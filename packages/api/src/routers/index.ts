import { createTRPCRouter } from '../trpc.js'
import { usersRouter } from './users.js'
import { projectsRouter } from './projects.js'
import { tasksRouter } from './tasks.js'

export const appRouter = createTRPCRouter({
  users: usersRouter,
  projects: projectsRouter,
  tasks: tasksRouter,
})

export type AppRouter = typeof appRouter