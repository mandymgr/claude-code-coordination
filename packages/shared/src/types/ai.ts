// AI and coordination specific types
import { TaskStatus } from './common';

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

export interface AIAgent {
  id: string;
  name: string;
  type: AIAgentType;
  provider: AIProvider;
  specialization: AICapability[];
  status: AgentStatus;
  performance: AgentPerformance;
  configuration: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;
}

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

export interface AgentPerformance {
  totalTasks: number;
  completedTasks: number;
  failedTasks: number;
  averageResponseTime: number;
  successRate: number;
  costEfficiency: number;
  lastUpdated: Date;
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

export interface AITaskResult {
  success: boolean;
  deliverables: TaskDeliverable[];
  metrics: TaskMetrics;
  feedback?: string;
  recommendations?: string[];
}

export interface TaskDeliverable {
  type: DeliverableType;
  path: string;
  content: string;
  changes?: FileChange[];
}

export enum DeliverableType {
  SOURCE_CODE = 'source_code',
  TEST_FILE = 'test_file',
  DOCUMENTATION = 'documentation',
  CONFIGURATION = 'configuration',
  PATCH = 'patch'
}

export interface FileChange {
  type: ChangeType;
  line?: number;
  oldContent?: string;
  newContent?: string;
}

export enum ChangeType {
  ADD = 'add',
  MODIFY = 'modify',
  DELETE = 'delete'
}

export interface TaskMetrics {
  tokensUsed: number;
  responseTime: number;
  cost: number;
  qualityScore: number;
  testCoverage?: number;
}