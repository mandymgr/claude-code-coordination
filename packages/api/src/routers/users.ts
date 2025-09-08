import { z } from 'zod'
import { createTRPCRouter, publicProcedure, authDbProcedure } from '../trpc.js'
import { userRepo } from '@claude-coordination/database'

export const usersRouter = createTRPCRouter({
  // Get current user profile
  me: authDbProcedure
    .query(async ({ ctx }) => {
      const user = await userRepo.findById(ctx.userId as string, true)
      if (!user) {
        throw new Error('User not found')
      }
      return user
    }),

  // Get user by ID
  getById: publicProcedure
    .input(z.object({ 
      id: z.string().cuid(),
      includeRelations: z.boolean().default(false)
    }))
    .query(async ({ input }) => {
      return userRepo.findById(input.id, input.includeRelations)
    }),

  // List users with pagination
  list: publicProcedure
    .input(z.object({
      page: z.number().min(1).default(1),
      limit: z.number().min(1).max(100).default(10),
      role: z.enum(['ADMIN', 'DEVELOPER', 'VIEWER']).optional(),
      search: z.string().optional()
    }))
    .query(async ({ input }) => {
      const { page, limit, ...filters } = input
      return userRepo.list({ page, limit }, filters)
    }),

  // Update user profile
  update: authDbProcedure
    .input(z.object({
      name: z.string().min(1).optional(),
      avatar: z.string().url().optional(),
    }))
    .mutation(async ({ ctx, input }) => {
      return userRepo.update(ctx.userId as string, input)
    }),

  // Get user statistics
  getStats: authDbProcedure
    .input(z.object({
      userId: z.string().cuid().optional()
    }))
    .query(async ({ ctx, input }) => {
      const userId = input.userId || (ctx.userId as string)
      return userRepo.getStats(userId)
    }),

  // Create user (admin only - for now public for testing)
  create: publicProcedure
    .input(z.object({
      email: z.string().email(),
      name: z.string().min(1),
      role: z.enum(['ADMIN', 'DEVELOPER', 'VIEWER']).default('DEVELOPER'),
      avatar: z.string().url().optional()
    }))
    .mutation(async ({ input }) => {
      // Check if user already exists
      const existingUser = await userRepo.findByEmail(input.email)
      if (existingUser) {
        throw new Error('User with this email already exists')
      }
      
      return userRepo.create(input)
    }),

  // Check if user exists
  exists: publicProcedure
    .input(z.object({ id: z.string().cuid() }))
    .query(async ({ input }) => {
      return userRepo.exists(input.id)
    })
})