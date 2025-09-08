// Main database package exports
export { db, checkDatabaseConnection, closeDatabaseConnection, dbUtils } from './client.js'
export * from './types.js'
export * from './repositories/index.js'

// Convenience exports for common operations
export { db as default } from './client.js'