import { PrismaClient } from './generated/client/index.js'
import { Pool, neonConfig } from '@neondatabase/serverless'

// Configure Neon for serverless environments
neonConfig.fetchConnectionCache = true

// Global database client
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

// Create Prisma client with Neon connection
export const db = globalForPrisma.prisma ?? 
  new PrismaClient({
    datasources: {
      db: {
        url: process.env.DATABASE_URL
      }
    },
    log: process.env.NODE_ENV === 'development' 
      ? ['query', 'error', 'warn'] 
      : ['error']
  })

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db
}

// Connection health check
export async function checkDatabaseConnection(): Promise<boolean> {
  try {
    await db.$queryRaw`SELECT 1`
    return true
  } catch (error) {
    console.error('Database connection failed:', error)
    return false
  }
}

// Graceful shutdown
export async function closeDatabaseConnection(): Promise<void> {
  await db.$disconnect()
}

// Database utilities
export const dbUtils = {
  // Pagination helper
  getPaginationOptions: (page: number = 1, limit: number = 10) => ({
    skip: (page - 1) * limit,
    take: limit
  }),

  // Count with pagination
  getPaginatedResults: async <T>(
    query: Promise<T[]>,
    countQuery: Promise<number>,
    page: number = 1,
    limit: number = 10
  ) => {
    const [items, total] = await Promise.all([query, countQuery])
    return {
      items,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
        hasNext: page * limit < total,
        hasPrev: page > 1
      }
    }
  },

  // Soft delete helper
  softDelete: async (model: any, id: string) => {
    return model.update({
      where: { id },
      data: { isActive: false, updatedAt: new Date() }
    })
  }
}

export default db