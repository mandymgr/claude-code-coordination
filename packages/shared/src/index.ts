// Main export file for @claude-coordination/shared package

// Types
export * from './types/common';
export * from './types/ai';
export * from './types/enterprise';
export * from './types/project';
export * from './types/team';

// Services
export * from './services/UniversalProjectDetector';
export * from './services/TeamOptimizationAI';
export * from './services/AdaptiveAIAssistant';
export * from './services/SmartResponseCache';
export * from './services/BackupRestoreSystem';

// Utilities
export * from './utils/validation';
export * from './utils/constants';
export * from './utils/helpers';

// Version
export const SHARED_PACKAGE_VERSION = '3.0.0';

// Common re-exports for convenience
export type {
  User,
  UserProfile,
  UserRole,
  Session,
  ApiResponse,
  PaginationMeta,
  CoordinationTask,
  TaskStatus,
  TaskPriority,
  WebSocketMessage
} from './types/common';

export type {
  AIProvider,
  AIAgent,
  AICapability,
  AIAgentType,
  AITaskRequest,
  TaskType,
  AITaskResult
} from './types/ai';

export type {
  Tenant,
  TenantPlan,
  SSOSettings,
  AuditEvent,
  Analytics
} from './types/enterprise';

export type {
  ProjectAnalysis,
  ProjectType,
  MagicConfiguration,
  DetectionPattern
} from './types/project';

export type {
  TeamOptimizationSession,
  ProjectRequirements,
  TeamComposition,
  AgentCapability,
  OptimizationMetrics
} from './types/team';

export {
  validateEmail,
  validatePassword,
  validateURL,
  validateUUID
} from './utils/validation';

export {
  API_ENDPOINTS,
  WEBSOCKET_EVENTS,
  ERROR_CODES,
  HTTP_STATUS,
  AI_MODELS,
  PERMISSIONS
} from './utils/constants';

export {
  generateId,
  formatDate,
  formatTime,
  formatDuration,
  formatBytes,
  formatCurrency,
  formatPercentage,
  debounce,
  throttle,
  retry,
  isEmpty,
  deepMerge
} from './utils/helpers';