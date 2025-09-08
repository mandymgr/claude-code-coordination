import { z } from 'zod'
import { createTRPCRouter, authDbProcedure } from '../trpc.js'
import { projectRepo } from '@claude-coordination/database'

export const projectsRouter = createTRPCRouter({
  // Get project by ID
  getById: authDbProcedure
    .input(z.object({ 
      id: z.string().cuid(),
      includeRelations: z.boolean().default(false)
    }))
    .query(async ({ input }) => {
      return projectRepo.findById(input.id, input.includeRelations)
    }),

  // List user's projects
  list: authDbProcedure
    .input(z.object({
      page: z.number().min(1).default(1),
      limit: z.number().min(1).max(100).default(10),
      status: z.enum(['ACTIVE', 'PAUSED', 'COMPLETED', 'ARCHIVED']).optional(),
      search: z.string().optional(),
      framework: z.string().optional(),
      language: z.string().optional()
    }))
    .query(async ({ ctx, input }) => {
      const { page, limit, ...filters } = input
      return projectRepo.listForUser(ctx.userId as string, { page, limit }, filters)
    }),

  // Create new project
  create: authDbProcedure
    .input(z.object({
      name: z.string().min(1).max(100),
      description: z.string().optional(),
      repository: z.string().url().optional(),
      framework: z.string().optional(),
      language: z.string().optional()
    }))
    .mutation(async ({ ctx, input }) => {
      return projectRepo.create({
        ...input,
        userId: ctx.userId
      })
    }),

  // Update project
  update: authDbProcedure
    .input(z.object({
      id: z.string().cuid(),
      name: z.string().min(1).max(100).optional(),
      description: z.string().optional(),
      status: z.enum(['ACTIVE', 'PAUSED', 'COMPLETED', 'ARCHIVED']).optional(),
      repository: z.string().url().optional(),
      framework: z.string().optional(),
      language: z.string().optional()
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input
      return projectRepo.update(id, data)
    }),

  // Delete project
  delete: authDbProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(async ({ input }) => {
      return projectRepo.delete(input.id)
    }),

  // Get project statistics
  getStats: authDbProcedure
    .input(z.object({ id: z.string().cuid() }))
    .query(async ({ input }) => {
      return projectRepo.getStats(input.id)
    }),

  // Get trending projects
  getTrending: authDbProcedure
    .input(z.object({ limit: z.number().min(1).max(50).default(10) }))
    .query(async ({ input }) => {
      return projectRepo.getTrending(input.limit)
    })
})