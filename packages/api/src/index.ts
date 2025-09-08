// Main API exports
export { appRouter, type AppRouter } from './routers/index.js'
export { createContext, type CreateContextOptions, type Context } from './context.js'
export { 
  createTRPCRouter, 
  publicProcedure, 
  protectedProcedure, 
  dbProcedure, 
  authDbProcedure 
} from './trpc.js'

// Re-export database types for convenience
export * from '@claude-coordination/database/types'