import { db, dbUtils } from '../client.js'
import type { User, Prisma, UserRole } from '../types.js'
import type { PaginatedResult, PaginationOptions } from '../types.js'

export class UserRepository {
  // Create user
  async create(data: Prisma.UserCreateInput): Promise<User> {
    return db.user.create({ data })
  }

  // Find by ID with relations
  async findById(id: string, includeRelations = false): Promise<User | null> {
    return db.user.findUnique({
      where: { id, isActive: true },
      include: includeRelations ? {
        projects: true,
        tasks: true,
        teamMembers: {
          include: {
            team: true
          }
        },
        _count: {
          select: {
            projects: true,
            tasks: true
          }
        }
      } : undefined
    })
  }

  // Find by email
  async findByEmail(email: string): Promise<User | null> {
    return db.user.findUnique({
      where: { email, isActive: true }
    })
  }

  // List users with pagination
  async list(
    options: PaginationOptions = {},
    filters: {
      role?: UserRole
      search?: string
    } = {}
  ): Promise<PaginatedResult<User>> {
    const { skip, take } = dbUtils.getPaginationOptions(options.page, options.limit)

    const where: Prisma.UserWhereInput = {
      isActive: true,
      ...(filters.role && { role: filters.role }),
      ...(filters.search && {
        OR: [
          { name: { contains: filters.search, mode: 'insensitive' } },
          { email: { contains: filters.search, mode: 'insensitive' } }
        ]
      })
    }

    const [items, total] = await Promise.all([
      db.user.findMany({
        where,
        skip,
        take,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: {
              projects: true,
              tasks: true
            }
          }
        }
      }),
      db.user.count({ where })
    ])

    return dbUtils.getPaginatedResults(
      Promise.resolve(items),
      Promise.resolve(total),
      options.page,
      options.limit
    )
  }

  // Update user
  async update(id: string, data: Prisma.UserUpdateInput): Promise<User> {
    return db.user.update({
      where: { id },
      data: {
        ...data,
        updatedAt: new Date()
      }
    })
  }

  // Soft delete user
  async delete(id: string): Promise<User> {
    return dbUtils.softDelete(db.user, id)
  }

  // Get user statistics
  async getStats(id: string) {
    const stats = await db.user.findUnique({
      where: { id },
      select: {
        _count: {
          select: {
            projects: true,
            tasks: true,
            sessions: true
          }
        },
        tasks: {
          select: {
            status: true,
            createdAt: true
          },
          orderBy: { createdAt: 'desc' },
          take: 10
        }
      }
    })

    if (!stats) return null

    // Calculate task completion rate
    const completedTasks = stats.tasks.filter(t => t.status === 'COMPLETED').length
    const completionRate = stats.tasks.length > 0 
      ? (completedTasks / stats.tasks.length) * 100 
      : 0

    return {
      totalProjects: stats._count.projects,
      totalTasks: stats._count.tasks,
      activeSessions: stats._count.sessions,
      completionRate,
      recentTasks: stats.tasks
    }
  }

  // Check if user exists
  async exists(id: string): Promise<boolean> {
    const user = await db.user.findUnique({
      where: { id, isActive: true },
      select: { id: true }
    })
    return !!user
  }
}