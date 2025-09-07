// KRINS Universe Builder - Complete Type System
// Comprehensive TypeScript definitions for AI coordination and development system

// ============================================================================
// UTILITY FUNCTIONS & HELPERS
// ============================================================================

export function generateId(): string {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

export function formatDate(date: Date): string {
  return date.toLocaleDateString();
}

export function formatTime(date: Date): string {
  return date.toLocaleTimeString();
}

export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${Math.round(ms / 1000)}s`;
  if (ms < 3600000) return `${Math.round(ms / 60000)}m`;
  return `${Math.round(ms / 3600000)}h`;
}

export function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

// ============================================================================
// API ENDPOINTS & CONSTANTS
// ============================================================================

export const API_ENDPOINTS = {
  HEALTH: '/api/health',
  AUTH: '/api/auth',
  USERS: '/api/users',
  TASKS: '/api/tasks',
  AI: '/api/ai',
  COORDINATION: '/api/coordination',
  QUALITY: '/api/quality',
  METRICS: '/api/metrics',
  WEBSOCKET: '/ws'
} as const;

export const WEBSOCKET_EVENTS = {
  CONNECT: 'connect',
  DISCONNECT: 'disconnect',
  TASK_UPDATE: 'task_update',
  AGENT_STATUS: 'agent_status',
  QUALITY_RESULT: 'quality_result',
  SESSION_UPDATE: 'session_update'
} as const;

export const ERROR_CODES = {
  UNAUTHORIZED: 'UNAUTHORIZED',
  FORBIDDEN: 'FORBIDDEN',
  NOT_FOUND: 'NOT_FOUND',
  VALIDATION_ERROR: 'VALIDATION_ERROR',
  INTERNAL_ERROR: 'INTERNAL_ERROR',
  AGENT_UNAVAILABLE: 'AGENT_UNAVAILABLE',
  TASK_FAILED: 'TASK_FAILED'
} as const;

// ============================================================================
// CORE USER & AUTHENTICATION TYPES
// ============================================================================

export enum UserRole {
  ADMIN = 'admin',
  DEVELOPER = 'developer',
  VIEWER = 'viewer',
  GUEST = 'guest'
}

export interface User {
  id: string;
  username: string;
  email: string;
  role: UserRole;
  permissions: string[];
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt?: Date;
  isActive: boolean;
  profile?: UserProfile;
  tenantId?: string;
}

export interface UserProfile {
  firstName?: string;
  lastName?: string;
  avatar?: string;
  timezone?: string;
  language?: string;
  preferences: Record<string, any>;
}

export interface Session {
  id: string;
  userId: string;
  token: string;
  refreshToken?: string;
  expiresAt: Date;
  createdAt: Date;
  ipAddress?: string;
  userAgent?: string;
  isActive: boolean;
}

export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: Record<string, any>;
  };
  meta?: {
    timestamp: string;
    requestId?: string;
    pagination?: PaginationMeta;
  };
}

export interface PaginationMeta {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
}

// ============================================================================
// AI AGENTS & COORDINATION TYPES
// ============================================================================

export enum AIAgentType {
  CLAUDE = 'claude',
  GPT4 = 'gpt4', 
  GEMINI = 'gemini',
  CUSTOM = 'custom'
}

export enum AgentStatus {
  IDLE = 'idle',
  BUSY = 'busy',
  ERROR = 'error',
  MAINTENANCE = 'maintenance',
  OFFLINE = 'offline'
}

export enum AICapability {
  CODE_GENERATION = 'code_generation',
  CODE_REVIEW = 'code_review',
  DOCUMENTATION = 'documentation',
  TESTING = 'testing',
  DEBUGGING = 'debugging',
  REFACTORING = 'refactoring',
  UI_UX = 'ui_ux',
  DEVOPS = 'devops',
  DATABASE = 'database',
  ARCHITECTURE = 'architecture'
}

export interface AIProvider {
  name: string;
  model: string;
  apiKey?: string;
  endpoint?: string;
  maxTokens?: number;
  temperature?: number;
  capabilities: AICapability[];
  cost: {
    inputTokens: number;
    outputTokens: number;
  };
}

export interface AIAgent {
  id: string;
  name: string;
  type: AIAgentType;
  provider?: AIProvider;
  specialization: AICapability[];
  status: AgentStatus;
  performance?: AgentPerformance;
  configuration?: Record<string, any>;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface AgentPerformance {
  totalTasks: number;
  completedTasks: number;
  failedTasks: number;
  averageResponseTime: number;
  successRate: number;
  costEfficiency: number;
  lastUpdated: Date;
}

// ============================================================================
// TASK & COORDINATION TYPES  
// ============================================================================

export enum TaskStatus {
  PENDING = 'pending',
  IN_PROGRESS = 'in_progress',
  REVIEW = 'review', 
  COMPLETED = 'completed',
  CANCELLED = 'cancelled',
  BLOCKED = 'blocked'
}

export enum TaskPriority {
  LOW = 'low',
  MEDIUM = 'medium',
  HIGH = 'high',
  CRITICAL = 'critical'
}

export enum TaskType {
  CODE_GENERATION = 'code_generation',
  CODE_REVIEW = 'code_review',
  BUG_FIX = 'bug_fix',
  FEATURE_IMPLEMENTATION = 'feature_implementation',
  DOCUMENTATION = 'documentation',
  TESTING = 'testing',
  REFACTORING = 'refactoring',
  DEPLOYMENT = 'deployment'
}

export interface CoordinationTask {
  id: string;
  title: string;
  description: string;
  status: TaskStatus;
  priority: TaskPriority;
  assignedTo?: string;
  assignedBy: string;
  projectId?: string;
  createdAt: Date;
  updatedAt: Date;
  dueDate?: Date;
  completedAt?: Date;
  tags: string[];
  metadata: Record<string, any>;
}

export interface TaskContext {
  projectPath: string;
  files: string[];
  dependencies: string[];
  framework?: string;
  language?: string;
  gitBranch?: string;
  environment?: string;
}

export interface TaskRequirements {
  deliverables: string[];
  constraints: string[];
  quality: QualityRequirements;
  timeline?: string;
}

export interface QualityRequirements {
  testCoverage?: number;
  codeQuality?: number;
  security?: boolean;
  performance?: boolean;
  accessibility?: boolean;
}

export interface AITaskRequest {
  id: string;
  type: TaskType;
  description: string;
  context: TaskContext;
  requirements: TaskRequirements;
  assignedAgent?: string;
  status: TaskStatus;
  createdAt: Date;
  startedAt?: Date;
  completedAt?: Date;
  result?: AITaskResult;
}

export interface AITaskResult {
  success: boolean;
  deliverables: TaskDeliverable[];
  metrics: TaskMetrics;
  feedback?: string;
  recommendations?: string[];
}

export enum DeliverableType {
  SOURCE_CODE = 'source_code',
  TEST_FILE = 'test_file',
  DOCUMENTATION = 'documentation',
  CONFIGURATION = 'configuration',
  PATCH = 'patch'
}

export interface TaskDeliverable {
  type: DeliverableType;
  path: string;
  content: string;
  changes?: FileChange[];
}

export enum ChangeType {
  ADD = 'add',
  MODIFY = 'modify',
  DELETE = 'delete'
}

export interface FileChange {
  type: ChangeType;
  line?: number;
  oldContent?: string;
  newContent?: string;
}

export interface TaskMetrics {
  tokensUsed: number;
  responseTime: number;
  cost: number;
  qualityScore: number;
  testCoverage?: number;
}

// ============================================================================
// SESSION & COORDINATION SYSTEM TYPES
// ============================================================================

export interface ClaudeSession {
  /** Unique session identifier */
  id: string;
  
  /** ISO timestamp when session was created */
  created: string;
  
  /** ISO timestamp of last activity */
  last_active: string;
  
  /** Current working directory */
  current_directory: string;
  
  /** Session status */
  status: 'active' | 'idle' | 'disconnected';
  
  /** Current task description (if any) */
  current_task: string | null;
  
  /** List of files currently locked by this session */
  locked_files: string[];
  
  /** Session-specific context data */
  shared_context: Record<string, any>;
  
  /** Capabilities supported by this session */
  capabilities: string[];
  
  /** Process ID of the session */
  pid: number;
  
  /** Hostname where session is running */
  hostname: string;
}

export interface CoordinationMessage {
  /** ID of the session that sent the message */
  from_session: string;
  
  /** ISO timestamp when message was created */
  timestamp: string;
  
  /** Message priority level */
  priority: 'low' | 'normal' | 'high' | 'urgent';
  
  /** Target session ID or 'all' for broadcast */
  target: string | 'all';
  
  /** Message content */
  message: string;
  
  /** Working directory when message was sent */
  current_directory: string;
  
  /** Hostname where message originated */
  hostname: string;
}

export interface FileLock {
  /** Session that owns the lock */
  session_id: string;
  
  /** Full path to the locked file */
  file_path: string;
  
  /** Type of operation (edit, write, etc.) */
  operation: string;
  
  /** ISO timestamp when lock was created */
  timestamp: string;
  
  /** Process ID that created the lock */
  pid: number;
}

export interface GlobalCoordinationState {
  /** All active sessions indexed by session ID */
  sessions: Record<string, ClaudeSession>;
  
  /** Shared context data */
  shared_contexts: {
    /** Global context shared across all projects */
    global: Record<string, any>;
  };
  
  /** File locks indexed by file path */
  file_locks: Record<string, FileLock>;
  
  /** Project-specific state data */
  project_state: Record<string, any>;
}

export interface CoordinationConfig {
  /** Project display name */
  project_name?: string;
  
  /** Absolute path to project root */
  project_root?: string;
  
  /** Whether coordination is enabled */
  coordination_enabled: boolean;
  
  /** Hours before a session is considered inactive */
  session_timeout_hours: number;
  
  /** Hours to retain messages before cleanup */
  message_retention_hours: number;
  
  /** Minutes before file locks expire */
  lock_timeout_minutes: number;
  
  /** Minutes between automatic cleanup runs */
  cleanup_interval_minutes: number;
  
  /** Feature toggles */
  features: {
    /** Enable file locking system */
    file_locking: boolean;
    
    /** Enable inter-session messaging */
    inter_session_messaging: boolean;
    
    /** Enable context sharing */
    context_sharing: boolean;
    
    /** Enable task coordination */
    task_coordination: boolean;
    
    /** Enable automatic cleanup */
    automatic_cleanup: boolean;
  };
  
  /** Repository paths for multi-repo projects */
  repositories?: Record<string, string>;
}

// Utility types for coordination commands
export type CoordinationCommand = 
  | 'sessions'
  | 'status' 
  | 'broadcast'
  | 'context'
  | 'task'
  | 'cleanup';

export interface CoordinationHookResult {
  /** Whether to continue with normal Claude Code processing */
  should_continue: boolean;
  
  /** Optional message to display to user */
  message?: string;
}

export interface SessionStatistics {
  /** Total number of active sessions */
  active_sessions: number;
  
  /** Number of pending messages */
  pending_messages: number;
  
  /** Number of active file locks */
  active_locks: number;
  
  /** Number of shared context keys */
  shared_contexts: number;
  
  /** Uptime of coordination system in milliseconds */
  uptime_ms: number;
}

export interface CoordinationEvent {
  /** Event type */
  type: 'session_start' | 'session_end' | 'message_sent' | 'file_locked' | 'file_unlocked' | 'context_shared' | 'task_updated';
  
  /** Session that triggered the event */
  session_id: string;
  
  /** ISO timestamp of the event */
  timestamp: string;
  
  /** Event-specific data */
  data: Record<string, any>;
}

// Hook function types
export type PreToolHook = (tool_name: string, ...args: any[]) => void | Promise<void>;
export type PostToolHook = (tool_name: string, result: any, ...args: any[]) => void | Promise<void>;
export type UserPromptHook = (user_input: string) => CoordinationHookResult | Promise<CoordinationHookResult>;

export interface CoordinationHooks {
  /** Hook called before tool execution */
  pre_tool?: PreToolHook;
  
  /** Hook called after tool execution */
  post_tool?: PostToolHook;
  
  /** Hook called when user submits a prompt */
  user_prompt_submit?: UserPromptHook;
}

// Configuration validation
export interface ValidationError {
  field: string;
  message: string;
  value: any;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

// Export utility functions types
export interface CoordinationUtils {
  /** Validate configuration object */
  validateConfig(config: Partial<CoordinationConfig>): ValidationResult;
  
  /** Generate unique session ID */
  generateSessionId(): string;
  
  /** Check if a session is active */
  isSessionActive(session: ClaudeSession): boolean;
  
  /** Calculate session uptime */
  getSessionUptime(session: ClaudeSession): number;
  
  /** Format timestamp for display */
  formatTimestamp(timestamp: string): string;
}

// ============================================================================
// WEBSOCKET & MESSAGING TYPES
// ============================================================================

export interface WebSocketMessage {
  type: string;
  payload: any;
  timestamp: string;
  id?: string;
  userId?: string;
  sessionId?: string;
}

// ============================================================================
// EXPORT ALL TYPES FROM DEV SYSTEM COMPATIBILITY
// ============================================================================

// Re-export some compatibility types
export type { ClaudeSession as CoordinationSession };
export type { CoordinationMessage as Message };
export type { FileLock as Lock };
export type { GlobalCoordinationState as CoordinationState };
export type { CoordinationConfig as Config };