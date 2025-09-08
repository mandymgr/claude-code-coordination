import type { Request, Response } from 'express'
import { db, checkDatabaseConnection } from '@claude-coordination/database'

export interface CreateContextOptions {
  req: Request
  res: Response
}

export async function createContext({ req, res }: CreateContextOptions) {
  // Check database connection
  const isDbHealthy = await checkDatabaseConnection()
  
  // Extract user from request (JWT token, session, etc.)
  const userId = req.headers['x-user-id'] as string | undefined
  
  return {
    req,
    res,
    db,
    userId,
    isDbHealthy,
    // Add other context data as needed
    timestamp: new Date(),
    requestId: req.headers['x-request-id'] as string || crypto.randomUUID()
  }
}

export type Context = Awaited<ReturnType<typeof createContext>>