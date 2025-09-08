import { db, dbUtils } from '../client.js'
import type { Task, Prisma, TaskStatus, AIProvider, TaskType } from '../types.js'
import type { PaginatedResult, PaginationOptions } from '../types.js'

export class TaskRepository {
  // Create task
  async create(data: Prisma.TaskCreateInput): Promise<Task> {
    return db.task.create({
      data,
      include: {
        project: true,
        user: true,
        qualityGates: true
      }
    })
  }

  // Find by ID with relations
  async findById(id: string, includeRelations = false): Promise<Task | null> {
    return db.task.findUnique({
      where: { id },
      include: includeRelations ? {
        project: true,
        user: true,
        qualityGates: {
          orderBy: { createdAt: 'desc' }
        },
        executions: {
          orderBy: { startedAt: 'desc' }
        }
      } : {
        project: true,
        user: true
      }
    })
  }

  // List tasks with filters
  async list(
    options: PaginationOptions = {},
    filters: {
      projectId?: string
      userId?: string
      status?: TaskStatus
      aiProvider?: AIProvider
      type?: TaskType
      priority?: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT'
      search?: string
    } = {}
  ): Promise<PaginatedResult<Task>> {
    const { skip, take } = dbUtils.getPaginationOptions(options.page, options.limit)

    const where: Prisma.TaskWhereInput = {
      ...(filters.projectId && { projectId: filters.projectId }),
      ...(filters.userId && { userId: filters.userId }),
      ...(filters.status && { status: filters.status }),
      ...(filters.aiProvider && { aiProvider: filters.aiProvider }),
      ...(filters.type && { type: filters.type }),
      ...(filters.priority && { priority: filters.priority }),
      ...(filters.search && {
        OR: [
          { title: { contains: filters.search, mode: 'insensitive' } },
          { description: { contains: filters.search, mode: 'insensitive' } }
        ]
      })
    }

    const [items, total] = await Promise.all([
      db.task.findMany({
        where,
        skip,
        take,
        orderBy: [
          { priority: 'desc' },
          { createdAt: 'desc' }
        ],
        include: {
          project: true,
          user: true,
          _count: {
            select: {
              qualityGates: true,
              executions: true
            }
          }
        }
      }),
      db.task.count({ where })
    ])

    return dbUtils.getPaginatedResults(
      Promise.resolve(items),
      Promise.resolve(total),
      options.page,
      options.limit
    )
  }

  // Update task
  async update(id: string, data: Prisma.TaskUpdateInput): Promise<Task> {
    return db.task.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date(),
        ...(data.status === 'COMPLETED' && { completedAt: new Date() })
      },
      include: {
        project: true,
        user: true,
        qualityGates: true
      }
    })
  }

  // Delete task
  async delete(id: string): Promise<Task> {
    return db.task.delete({
      where: { id }
    })
  }

  // Get tasks by status for dashboard
  async getByStatus(projectId?: string) {
    const where: Prisma.TaskWhereInput = projectId ? { projectId } : {}

    const tasks = await db.task.groupBy({
      by: ['status'],
      where,
      _count: {
        _all: true
      }
    })

    return tasks.reduce((acc, task) => {
      acc[task.status] = task._count._all
      return acc
    }, {} as Record<TaskStatus, number>)
  }

  // Get performance metrics
  async getPerformanceMetrics(
    filters: {
      projectId?: string
      userId?: string
      aiProvider?: AIProvider
      dateFrom?: Date
      dateTo?: Date
    } = {}
  ) {
    const where: Prisma.TaskWhereInput = {
      status: 'COMPLETED',
      ...(filters.projectId && { projectId: filters.projectId }),
      ...(filters.userId && { userId: filters.userId }),
      ...(filters.aiProvider && { aiProvider: filters.aiProvider }),
      ...(filters.dateFrom && { createdAt: { gte: filters.dateFrom } }),
      ...(filters.dateTo && { createdAt: { lte: filters.dateTo } })
    }

    const tasks = await db.task.findMany({
      where,
      select: {
        aiProvider: true,
        model: true,
        duration: true,
        cost: true,
        tokenUsage: true,
        quality: true,
        createdAt: true,
        completedAt: true
      }
    })

    if (tasks.length === 0) {
      return {
        totalTasks: 0,
        averageDuration: 0,
        totalCost: 0,
        averageCost: 0,
        totalTokens: 0,
        averageTokens: 0,
        averageQuality: 0,
        providerBreakdown: {},
        modelBreakdown: {}
      }
    }

    // Calculate metrics
    const totalDuration = tasks.reduce((sum, t) => sum + (t.duration || 0), 0)
    const totalCost = tasks.reduce((sum, t) => sum + (t.cost || 0), 0)
    const totalTokens = tasks.reduce((sum, t) => sum + (t.tokenUsage || 0), 0)
    const qualityScores = tasks.filter(t => t.quality).map(t => t.quality!)
    
    // Provider breakdown
    const providerBreakdown = tasks.reduce((acc, task) => {
      const provider = task.aiProvider
      if (!acc[provider]) {
        acc[provider] = {
          count: 0,
          totalCost: 0,
          totalTokens: 0,
          totalDuration: 0,
          qualityScores: []
        }
      }
      acc[provider].count++
      acc[provider].totalCost += task.cost || 0
      acc[provider].totalTokens += task.tokenUsage || 0
      acc[provider].totalDuration += task.duration || 0
      if (task.quality) acc[provider].qualityScores.push(task.quality)
      return acc
    }, {} as Record<AIProvider, any>)

    // Model breakdown
    const modelBreakdown = tasks.reduce((acc, task) => {
      if (!task.model) return acc
      const model = task.model
      if (!acc[model]) {
        acc[model] = {
          count: 0,
          totalCost: 0,
          totalTokens: 0,
          averageQuality: 0
        }
      }
      acc[model].count++
      acc[model].totalCost += task.cost || 0
      acc[model].totalTokens += task.tokenUsage || 0
      return acc
    }, {} as Record<string, any>)

    return {
      totalTasks: tasks.length,
      averageDuration: totalDuration / tasks.length,
      totalCost,
      averageCost: totalCost / tasks.length,
      totalTokens,
      averageTokens: totalTokens / tasks.length,
      averageQuality: qualityScores.length > 0 
        ? qualityScores.reduce((sum, q) => sum + q, 0) / qualityScores.length 
        : 0,
      providerBreakdown,
      modelBreakdown
    }
  }

  // Get active tasks for real-time monitoring
  async getActiveTasks(projectId?: string): Promise<Task[]> {
    return db.task.findMany({
      where: {
        status: 'IN_PROGRESS',
        ...(projectId && { projectId })
      },
      include: {
        project: true,
        user: true,
        executions: {
          where: { status: 'RUNNING' },
          orderBy: { startedAt: 'desc' },
          take: 1
        }
      },
      orderBy: { createdAt: 'desc' }
    })
  }

  // Queue management
  async getQueuedTasks(aiProvider?: AIProvider): Promise<Task[]> {
    return db.task.findMany({
      where: {
        status: 'PENDING',
        ...(aiProvider && { aiProvider })
      },
      include: {
        project: true,
        user: true
      },
      orderBy: [
        { priority: 'desc' },
        { createdAt: 'asc' }
      ]
    })
  }

  // Task history for a project
  async getHistory(
    projectId: string,
    options: PaginationOptions = {}
  ): Promise<PaginatedResult<Task>> {
    return this.list(options, { 
      projectId,
      status: 'COMPLETED'
    })
  }
}