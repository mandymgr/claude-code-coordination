// Re-export Prisma generated types
export * from './generated/client/index.js'

// Custom types for enhanced functionality
export interface PaginationOptions {
  page?: number
  limit?: number
}

export interface PaginatedResult<T> {
  items: T[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
    hasNext: boolean
    hasPrev: boolean
  }
}

// Task context types
export interface TaskContext {
  files?: string[]
  dependencies?: string[]
  environment?: Record<string, any>
  constraints?: {
    timeLimit?: number
    tokenLimit?: number
    costLimit?: number
  }
}

// Quality Gate rule types
export interface SecurityRule {
  type: 'secret-scan' | 'vulnerability-scan' | 'license-check'
  severity: 'low' | 'medium' | 'high' | 'critical'
  enabled: boolean
  config?: Record<string, any>
}

export interface LintRule {
  type: 'eslint' | 'prettier' | 'typescript'
  config: Record<string, any>
  autoFix: boolean
}

export interface TestRule {
  type: 'unit' | 'integration' | 'e2e'
  coverage: {
    threshold: number
    statements: number
    branches: number
    functions: number
    lines: number
  }
}

export interface QualityRules {
  security?: SecurityRule[]
  lint?: LintRule[]
  test?: TestRule[]
  build?: {
    enabled: boolean
    failOnError: boolean
    timeout?: number
  }
}

// AI Team strategy types
export interface AITeamStrategy {
  assignment: 'round-robin' | 'specialized' | 'load-balanced'
  fallback: 'retry' | 'escalate' | 'skip'
  coordination: {
    maxConcurrent: number
    timeout: number
    retries: number
  }
}

// Performance metrics
export interface PerformanceMetrics {
  responseTime: number
  throughput: number
  errorRate: number
  tokenEfficiency: number
  costEfficiency: number
}

// Deployment configuration
export interface DeploymentConfig {
  platform: 'vercel' | 'netlify' | 'aws' | 'gcp' | 'azure' | 'docker'
  environment: 'development' | 'staging' | 'production'
  buildCommand?: string
  outputDirectory?: string
  environmentVariables?: Record<string, string>
  customDomains?: string[]
}