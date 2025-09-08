import { initTRPC, TRPCError } from '@trpc/server'
import superjson from 'superjson'
import type { Context } from './context.js'

const t = initTRPC.context<Context>().create({
  transformer: superjson,
  errorFormatter({ shape, error }) {
    return {
      ...shape,
      data: {
        ...shape.data,
        zodError: error.code === 'BAD_REQUEST' && error.cause?.name === 'ZodError' 
          ? (error.cause as any).flatten() 
          : null,
      },
    }
  },
})

// Base procedures
export const createTRPCRouter = t.router
export const publicProcedure = t.procedure

// Authenticated procedure middleware
const enforceUserIsAuthed = t.middleware(({ ctx, next }) => {
  if (!ctx.userId) {
    throw new TRPCError({ code: 'UNAUTHORIZED' })
  }
  return next({
    ctx: {
      ...ctx,
      userId: ctx.userId as string,
    },
  })
})

export const protectedProcedure = t.procedure.use(enforceUserIsAuthed)

// Database health check middleware
const enforceDbHealthy = t.middleware(({ ctx, next }) => {
  if (!ctx.isDbHealthy) {
    throw new TRPCError({ 
      code: 'INTERNAL_SERVER_ERROR',
      message: 'Database connection failed'
    })
  }
  return next({
    ctx,
  })
})

export const dbProcedure = publicProcedure.use(enforceDbHealthy)
export const authDbProcedure = protectedProcedure.use(enforceDbHealthy)