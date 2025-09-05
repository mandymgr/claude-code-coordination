// API Constants
export const API_ENDPOINTS = {
  AGENTS: '/api/ai/agents',
  TASKS: '/api/tasks',
  PROJECTS: '/api/projects',
  ANALYTICS: '/api/analytics/mobile',
  HEALTH: '/api/health',
} as const;

// WebSocket Events
export const WS_EVENTS = {
  // Connection
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  
  // Tasks
  TASK_UPDATED: 'task_updated',
  TASK_ASSIGNED: 'task_assigned',
  TASK_COMPLETED: 'task_completed',
  TASK_FAILED: 'task_failed',
  
  // Agents
  AGENT_STATUS_CHANGED: 'agent_status_changed',
  AGENT_ASSIGNMENT: 'agent_assignment',
  
  // Projects
  PROJECT_UPDATED: 'project_updated',
  
  // Notifications
  NOTIFICATION: 'notification',
  ALERT: 'alert',
} as const;

// Task Status Constants
export const TASK_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
} as const;

// Task Priority Constants
export const TASK_PRIORITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
} as const;

// Task Type Constants
export const TASK_TYPE = {
  DEVELOPMENT: 'development',
  ANALYSIS: 'analysis',
  TESTING: 'testing',
  DEPLOYMENT: 'deployment',
  REVIEW: 'review',
} as const;

// Agent Status Constants
export const AGENT_STATUS = {
  AVAILABLE: 'available',
  BUSY: 'busy',
  OFFLINE: 'offline',
} as const;

// Agent Type Constants
export const AGENT_TYPE = {
  CLAUDE: 'claude',
  GPT4: 'gpt4',
  GEMINI: 'gemini',
  CUSTOM: 'custom',
} as const;

// Project Status Constants
export const PROJECT_STATUS = {
  ACTIVE: 'active',
  PAUSED: 'paused',
  COMPLETED: 'completed',
  ARCHIVED: 'archived',
} as const;

// Colors
export const COLORS = {
  // Status Colors
  SUCCESS: '#32CD32',
  WARNING: '#FFA500',
  ERROR: '#FF3B30',
  INFO: '#007AFF',
  
  // Priority Colors
  LOW_PRIORITY: '#32CD32',
  MEDIUM_PRIORITY: '#FFCC02',
  HIGH_PRIORITY: '#FF9500',
  URGENT_PRIORITY: '#FF3B30',
  
  // Agent Type Colors
  CLAUDE: '#FF6B35',
  GPT4: '#10A37F',
  GEMINI: '#4285F4',
  CUSTOM: '#8E44AD',
  
  // Task Type Colors
  DEVELOPMENT: '#007AFF',
  ANALYSIS: '#5856D6',
  TESTING: '#32CD32',
  DEPLOYMENT: '#FF9500',
  REVIEW: '#AF52DE',
  
  // UI Colors
  PRIMARY: '#007AFF',
  SECONDARY: '#8E8E93',
  BACKGROUND: '#F2F2F7',
  SURFACE: '#FFFFFF',
  TEXT_PRIMARY: '#000000',
  TEXT_SECONDARY: '#666666',
  TEXT_DISABLED: '#8E8E93',
  BORDER: '#E5E5EA',
  SHADOW: '#000000',
} as const;

// Dimensions
export const SPACING = {
  XS: 4,
  SM: 8,
  MD: 16,
  LG: 24,
  XL: 32,
  XXL: 48,
} as const;

export const BORDER_RADIUS = {
  SM: 4,
  MD: 8,
  LG: 12,
  XL: 16,
  CIRCLE: 1000,
} as const;

export const FONT_SIZE = {
  XS: 10,
  SM: 12,
  MD: 14,
  LG: 16,
  XL: 18,
  XXL: 20,
  XXXL: 24,
} as const;

// Animation Durations (in milliseconds)
export const ANIMATION_DURATION = {
  FAST: 200,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 1000,
} as const;

// Cache Keys
export const CACHE_KEYS = {
  AGENTS: 'available_agents',
  TASKS: 'user_tasks',
  PROJECTS: 'user_projects',
  USER_PREFERENCES: 'user_preferences',
  SESSION_DATA: 'session_data',
  OFFLINE_QUEUE: 'offline_queue',
} as const;

// Storage Keys
export const STORAGE_KEYS = {
  CACHE: 'claude_coordination_cache',
  PREFERENCES: 'claude_coordination_preferences',
  SESSION: 'claude_coordination_session',
  ANALYTICS: 'claude_coordination_analytics',
} as const;

// Default Configuration Values
export const DEFAULT_CONFIG = {
  CACHE_SIZE: 100,
  SYNC_INTERVAL: 30000, // 30 seconds
  RETRY_ATTEMPTS: 3,
  TIMEOUT: 30000, // 30 seconds
  POLLING_INTERVAL: 30000, // 30 seconds
  ANALYTICS_FLUSH_INTERVAL: 300000, // 5 minutes
  BACKGROUND_SYNC_INTERVAL: 60000, // 1 minute
} as const;

// Error Codes
export const ERROR_CODES = {
  // Network Errors
  NETWORK_ERROR: 'NETWORK_ERROR',
  TIMEOUT_ERROR: 'TIMEOUT_ERROR',
  CONNECTION_ERROR: 'CONNECTION_ERROR',
  
  // Authentication Errors
  AUTH_ERROR: 'AUTH_ERROR',
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  
  // API Errors
  API_ERROR: 'API_ERROR',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  NOT_FOUND: 'NOT_FOUND',
  
  // SDK Errors
  SDK_NOT_INITIALIZED: 'SDK_NOT_INITIALIZED',
  INVALID_CONFIGURATION: 'INVALID_CONFIGURATION',
  OPERATION_FAILED: 'OPERATION_FAILED',
} as const;

// Feature Flags
export const FEATURE_FLAGS = {
  OFFLINE_MODE: 'offline_mode',
  BACKGROUND_SYNC: 'background_sync',
  PUSH_NOTIFICATIONS: 'push_notifications',
  ANALYTICS: 'analytics',
  BIOMETRIC_AUTH: 'biometric_auth',
  DARK_MODE: 'dark_mode',
} as const;

// Platform Constants
export const PLATFORM_CONFIG = {
  IOS: {
    STATUS_BAR_HEIGHT: 44,
    TAB_BAR_HEIGHT: 83,
    NAVIGATION_BAR_HEIGHT: 44,
  },
  ANDROID: {
    STATUS_BAR_HEIGHT: 24,
    TAB_BAR_HEIGHT: 56,
    NAVIGATION_BAR_HEIGHT: 56,
  },
} as const;