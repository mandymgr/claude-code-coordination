// Repository exports
export { UserRepository } from './user.js'
export { ProjectRepository } from './project.js'
export { TaskRepository } from './task.js'

// Create repository instances
import { UserRepository } from './user.js'
import { ProjectRepository } from './project.js'
import { TaskRepository } from './task.js'

export const repositories = {
  user: new UserRepository(),
  project: new ProjectRepository(),
  task: new TaskRepository()
}

// Convenience exports
export const userRepo = repositories.user
export const projectRepo = repositories.project
export const taskRepo = repositories.task