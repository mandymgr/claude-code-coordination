import { z } from 'zod'
import { createTRPCRouter, authDbProcedure } from '../trpc.js'
import { taskRepo } from '@claude-coordination/database'

export const tasksRouter = createTRPCRouter({
  // Get task by ID
  getById: authDbProcedure
    .input(z.object({ 
      id: z.string().cuid(),
      includeRelations: z.boolean().default(false)
    }))
    .query(async ({ input }) => {
      return taskRepo.findById(input.id, input.includeRelations)
    }),

  // List tasks with filters
  list: authDbProcedure
    .input(z.object({
      page: z.number().min(1).default(1),
      limit: z.number().min(1).max(100).default(10),
      projectId: z.string().cuid().optional(),
      status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'CANCELLED']).optional(),
      aiProvider: z.enum(['CLAUDE', 'OPENAI', 'GOOGLE', 'ANTHROPIC']).optional(),
      type: z.enum([
        'CODE_GENERATION', 'CODE_REVIEW', 'DEBUGGING', 'REFACTORING',
        'DOCUMENTATION', 'TESTING', 'DEPLOYMENT', 'ANALYSIS', 'OPTIMIZATION'
      ]).optional(),
      priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
      search: z.string().optional()
    }))
    .query(async ({ ctx, input }) => {
      const { page, limit, ...filters } = input
      return taskRepo.list({ page, limit }, {
        ...filters,
        userId: ctx.userId // Only show user's tasks
      })
    }),

  // Create new task
  create: authDbProcedure
    .input(z.object({
      projectId: z.string().cuid(),
      title: z.string().min(1).max(200),
      description: z.string().optional(),
      type: z.enum([
        'CODE_GENERATION', 'CODE_REVIEW', 'DEBUGGING', 'REFACTORING',
        'DOCUMENTATION', 'TESTING', 'DEPLOYMENT', 'ANALYSIS', 'OPTIMIZATION'
      ]),
      priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).default('MEDIUM'),
      aiProvider: z.enum(['CLAUDE', 'OPENAI', 'GOOGLE', 'ANTHROPIC']),
      model: z.string().optional(),
      context: z.record(z.any()).optional(),
      requirements: z.record(z.any()).optional(),
      constraints: z.object({
        timeLimit: z.number().optional(),
        tokenLimit: z.number().optional(),
        costLimit: z.number().optional()
      }).optional()
    }))
    .mutation(async ({ ctx, input }) => {
      return taskRepo.create({
        ...input,
        userId: ctx.userId,
        project: {
          connect: { id: input.projectId }
        },
        user: {
          connect: { id: ctx.userId }
        }
      })
    }),

  // Update task
  update: authDbProcedure
    .input(z.object({
      id: z.string().cuid(),
      title: z.string().min(1).max(200).optional(),
      description: z.string().optional(),
      status: z.enum(['PENDING', 'IN_PROGRESS', 'COMPLETED', 'FAILED', 'CANCELLED']).optional(),
      priority: z.enum(['LOW', 'MEDIUM', 'HIGH', 'URGENT']).optional(),
      result: z.record(z.any()).optional(),
      diff: z.string().optional(),
      artifacts: z.record(z.any()).optional(),
      tokenUsage: z.number().optional(),
      cost: z.number().optional(),
      duration: z.number().optional(),
      quality: z.number().min(0).max(1).optional()
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input
      return taskRepo.update(id, data)
    }),

  // Delete task
  delete: authDbProcedure
    .input(z.object({ id: z.string().cuid() }))
    .mutation(async ({ input }) => {
      return taskRepo.delete(input.id)
    }),

  // Get tasks by status for dashboard
  getByStatus: authDbProcedure
    .input(z.object({ projectId: z.string().cuid().optional() }))
    .query(async ({ input }) => {
      return taskRepo.getByStatus(input.projectId)
    }),

  // Get performance metrics
  getPerformanceMetrics: authDbProcedure
    .input(z.object({
      projectId: z.string().cuid().optional(),
      aiProvider: z.enum(['CLAUDE', 'OPENAI', 'GOOGLE', 'ANTHROPIC']).optional(),
      dateFrom: z.date().optional(),
      dateTo: z.date().optional()
    }))
    .query(async ({ ctx, input }) => {
      return taskRepo.getPerformanceMetrics({
        ...input,
        userId: ctx.userId
      })
    }),

  // Get active tasks for monitoring
  getActiveTasks: authDbProcedure
    .input(z.object({ projectId: z.string().cuid().optional() }))
    .query(async ({ input }) => {
      return taskRepo.getActiveTasks(input.projectId)
    }),

  // Get task queue
  getQueue: authDbProcedure
    .input(z.object({ 
      aiProvider: z.enum(['CLAUDE', 'OPENAI', 'GOOGLE', 'ANTHROPIC']).optional() 
    }))
    .query(async ({ input }) => {
      return taskRepo.getQueuedTasks(input.aiProvider)
    }),

  // Get task history for a project
  getHistory: authDbProcedure
    .input(z.object({
      projectId: z.string().cuid(),
      page: z.number().min(1).default(1),
      limit: z.number().min(1).max(100).default(10)
    }))
    .query(async ({ input }) => {
      const { projectId, ...paginationOptions } = input
      return taskRepo.getHistory(projectId, paginationOptions)
    })
})