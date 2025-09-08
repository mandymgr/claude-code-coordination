import { db, dbUtils } from '../client.js'
import type { Project, Prisma, ProjectStatus } from '../types.js'
import type { PaginatedResult, PaginationOptions } from '../types.js'

export class ProjectRepository {
  // Create project
  async create(data: Prisma.ProjectCreateInput): Promise<Project> {
    return db.project.create({ 
      data,
      include: {
        user: true,
        _count: {
          select: {
            tasks: true,
            deployments: true
          }
        }
      }
    })
  }

  // Find by ID with relations
  async findById(id: string, includeRelations = false): Promise<Project | null> {
    return db.project.findUnique({
      where: { id },
      include: includeRelations ? {
        user: true,
        tasks: {
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        deployments: {
          orderBy: { createdAt: 'desc' },
          take: 5
        },
        qualityGates: {
          orderBy: { createdAt: 'desc' },
          take: 10
        },
        files: {
          orderBy: { updatedAt: 'desc' }
        },
        _count: {
          select: {
            tasks: true,
            deployments: true,
            qualityGates: true,
            files: true
          }
        }
      } : {
        user: true,
        _count: {
          select: {
            tasks: true,
            deployments: true
          }
        }
      }
    })
  }

  // List projects for user
  async listForUser(
    userId: string,
    options: PaginationOptions = {},
    filters: {
      status?: ProjectStatus
      search?: string
      framework?: string
      language?: string
    } = {}
  ): Promise<PaginatedResult<Project>> {
    const { skip, take } = dbUtils.getPaginationOptions(options.page, options.limit)

    const where: Prisma.ProjectWhereInput = {
      userId,
      ...(filters.status && { status: filters.status }),
      ...(filters.framework && { framework: filters.framework }),
      ...(filters.language && { language: filters.language }),
      ...(filters.search && {
        OR: [
          { name: { contains: filters.search, mode: 'insensitive' } },
          { description: { contains: filters.search, mode: 'insensitive' } }
        ]
      })
    }

    const [items, total] = await Promise.all([
      db.project.findMany({
        where,
        skip,
        take,
        orderBy: { updatedAt: 'desc' },
        include: {
          user: true,
          _count: {
            select: {
              tasks: true,
              deployments: true,
              qualityGates: true
            }
          }
        }
      }),
      db.project.count({ where })
    ])

    return dbUtils.getPaginatedResults(
      Promise.resolve(items),
      Promise.resolve(total),
      options.page,
      options.limit
    )
  }

  // Update project
  async update(id: string, data: Prisma.ProjectUpdateInput): Promise<Project> {
    return db.project.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date()
      },
      include: {
        user: true,
        _count: {
          select: {
            tasks: true,
            deployments: true
          }
        }
      }
    })
  }

  // Delete project (cascade delete)
  async delete(id: string): Promise<Project> {
    return db.project.delete({
      where: { id }
    })
  }

  // Get project statistics
  async getStats(id: string) {
    const project = await db.project.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            tasks: true,
            deployments: true,
            qualityGates: true,
            files: true
          }
        },
        tasks: {
          select: {
            status: true,
            priority: true,
            aiProvider: true,
            createdAt: true,
            completedAt: true,
            cost: true,
            tokenUsage: true
          }
        },
        qualityGates: {
          select: {
            status: true,
            score: true,
            type: true
          }
        },
        deployments: {
          select: {
            status: true,
            environment: true,
            createdAt: true
          },
          orderBy: { createdAt: 'desc' },
          take: 5
        }
      }
    })

    if (!project) return null

    // Calculate metrics
    const completedTasks = project.tasks.filter(t => t.status === 'COMPLETED')
    const failedTasks = project.tasks.filter(t => t.status === 'FAILED')
    
    const taskMetrics = {
      total: project._count.tasks,
      completed: completedTasks.length,
      failed: failedTasks.length,
      inProgress: project.tasks.filter(t => t.status === 'IN_PROGRESS').length,
      successRate: project.tasks.length > 0 
        ? (completedTasks.length / project.tasks.length) * 100 
        : 0
    }

    const costMetrics = {
      total: project.tasks.reduce((sum, t) => sum + (t.cost || 0), 0),
      average: completedTasks.length > 0 
        ? completedTasks.reduce((sum, t) => sum + (t.cost || 0), 0) / completedTasks.length
        : 0
    }

    const tokenMetrics = {
      total: project.tasks.reduce((sum, t) => sum + (t.tokenUsage || 0), 0),
      average: completedTasks.length > 0 
        ? completedTasks.reduce((sum, t) => sum + (t.tokenUsage || 0), 0) / completedTasks.length
        : 0
    }

    const qualityMetrics = {
      total: project._count.qualityGates,
      passed: project.qualityGates.filter(q => q.status === 'PASSED').length,
      failed: project.qualityGates.filter(q => q.status === 'FAILED').length,
      averageScore: project.qualityGates.length > 0
        ? project.qualityGates
            .filter(q => q.score !== null)
            .reduce((sum, q) => sum + (q.score || 0), 0) / project.qualityGates.length
        : 0
    }

    return {
      ...project,
      metrics: {
        tasks: taskMetrics,
        cost: costMetrics,
        tokens: tokenMetrics,
        quality: qualityMetrics
      }
    }
  }

  // Get trending projects
  async getTrending(limit = 10): Promise<Project[]> {
    const thirtyDaysAgo = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
    
    return db.project.findMany({
      where: {
        updatedAt: { gte: thirtyDaysAgo }
      },
      orderBy: [
        { updatedAt: 'desc' },
        { tasks: { _count: 'desc' } }
      ],
      take: limit,
      include: {
        user: true,
        _count: {
          select: {
            tasks: true,
            deployments: true
          }
        }
      }
    })
  }
}