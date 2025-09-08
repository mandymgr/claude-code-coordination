/**
 * 🚀 Magic Deployment Engine - Type Definitions
 * Intelligent deployment automation with multi-platform support
 * TypeScript implementation for KRINS-Universe-Builder
 */

export type DeploymentTarget = 
  | 'vercel'
  | 'netlify' 
  | 'heroku'
  | 'aws-lambda'
  | 'aws-ecs'
  | 'aws-s3'
  | 'google-cloud'
  | 'azure'
  | 'docker'
  | 'kubernetes'
  | 'railway'
  | 'render'
  | 'supabase'
  | 'planetscale'
  | 'github-pages'
  | 'auto';

export type DeploymentEnvironment = 'dev' | 'staging' | 'prod' | 'preview';

export type ProjectType = 
  | 'frontend-spa'
  | 'frontend-ssr' 
  | 'backend-api'
  | 'full-stack'
  | 'static-site'
  | 'microservice'
  | 'serverless'
  | 'database'
  | 'cdn-assets'
  | 'monorepo';

export interface DeploymentConfig {
  target: DeploymentTarget;
  environment: DeploymentEnvironment;
  projectType: ProjectType;
  buildCommand?: string;
  outputDir?: string;
  startCommand?: string;
  envVars?: Record<string, string>;
  customDomain?: string;
  scaling?: ScalingConfig;
  monitoring?: MonitoringConfig;
  security?: SecurityConfig;
  performance?: PerformanceConfig;
}

export interface ScalingConfig {
  minInstances: number;
  maxInstances: number;
  autoScale: boolean;
  targetCPU?: number;
  targetMemory?: number;
  scaleUpCooldown?: number;
  scaleDownCooldown?: number;
}

export interface MonitoringConfig {
  healthCheck: string;
  alerting: boolean;
  logLevel: 'error' | 'warn' | 'info' | 'debug';
  metrics: boolean;
  uptime: boolean;
  errorTracking?: string; // sentry, bugsnag, etc.
}

export interface SecurityConfig {
  https: boolean;
  cors: CorsConfig;
  rateLimit?: RateLimitConfig;
  authentication?: AuthConfig;
  secrets: SecretsConfig;
}

export interface CorsConfig {
  enabled: boolean;
  origins: string[];
  methods: string[];
  headers: string[];
}

export interface RateLimitConfig {
  enabled: boolean;
  requests: number;
  window: number; // in seconds
  message?: string;
}

export interface AuthConfig {
  type: 'jwt' | 'oauth' | 'basic' | 'apikey' | 'none';
  providers?: string[];
  redirectUrl?: string;
}

export interface SecretsConfig {
  provider: 'env' | 'vault' | 'aws-secrets' | 'azure-keyvault' | 'gcp-secrets';
  encryption: boolean;
  rotation: boolean;
}

export interface PerformanceConfig {
  caching: CachingConfig;
  compression: boolean;
  minification: boolean;
  bundleOptimization: boolean;
  imageOptimization: boolean;
  cdn: boolean;
}

export interface CachingConfig {
  enabled: boolean;
  strategy: 'static' | 'dynamic' | 'hybrid';
  ttl: number; // in seconds
  purgeOnDeploy: boolean;
}

export interface DeploymentResult {
  success: boolean;
  target: DeploymentTarget;
  environment: DeploymentEnvironment;
  url?: string;
  deploymentId?: string;
  buildTime: number; // in ms
  deployTime: number; // in ms
  totalTime: number; // in ms
  logs: DeploymentLog[];
  metrics: DeploymentMetrics;
  warnings: DeploymentWarning[];
  errors: DeploymentError[];
  rollbackUrl?: string;
}

export interface DeploymentLog {
  timestamp: number;
  level: 'info' | 'warn' | 'error' | 'debug';
  message: string;
  source: 'build' | 'deploy' | 'health-check' | 'monitoring';
  details?: any;
}

export interface DeploymentMetrics {
  buildSize: number; // in bytes
  dependencies: number;
  bundleSize: number; // in bytes
  loadTime: number; // in ms
  firstContentfulPaint: number; // in ms
  lighthouse: LighthouseScore;
  uptime: number; // percentage
  responseTime: number; // average in ms
}

export interface LighthouseScore {
  performance: number; // 0-100
  accessibility: number; // 0-100
  bestPractices: number; // 0-100
  seo: number; // 0-100
  pwa: number; // 0-100
}

export interface DeploymentWarning {
  type: 'performance' | 'security' | 'configuration' | 'optimization';
  severity: 'low' | 'medium' | 'high';
  message: string;
  suggestion: string;
  autoFixable: boolean;
}

export interface DeploymentError {
  type: 'build' | 'deploy' | 'network' | 'configuration' | 'auth' | 'quota';
  code: string;
  message: string;
  details?: any;
  stack?: string;
  resolution: string[];
}

export interface TargetCapabilities {
  target: DeploymentTarget;
  supportedTypes: ProjectType[];
  features: TargetFeature[];
  limitations: TargetLimitation[];
  pricing: PricingInfo;
  performance: TargetPerformance;
  reputation: number; // 0-1
}

export interface TargetFeature {
  name: string;
  description: string;
  category: 'build' | 'runtime' | 'scaling' | 'monitoring' | 'security';
  premium: boolean;
}

export interface TargetLimitation {
  type: 'build-time' | 'file-size' | 'requests' | 'bandwidth' | 'storage';
  value: number;
  unit: string;
  tier: 'free' | 'pro' | 'enterprise';
}

export interface PricingInfo {
  free: boolean;
  freeTier?: TierLimits;
  paidTiers?: PaidTier[];
  costEstimate: number; // per month in USD
}

export interface TierLimits {
  builds: number;
  bandwidth: number; // in GB
  functions: number;
  domains: number;
}

export interface PaidTier {
  name: string;
  price: number; // per month in USD
  limits: TierLimits;
  features: string[];
}

export interface TargetPerformance {
  globalCDN: boolean;
  edgeLocations: number;
  averageLatency: number; // in ms
  uptime: number; // percentage
  buildSpeed: number; // relative score 0-1
}

export interface DeploymentStrategy {
  name: string;
  targets: DeploymentTarget[];
  priority: number; // 0-1
  conditions: DeploymentCondition[];
  rollback: RollbackStrategy;
  testing: TestingStrategy;
}

export interface DeploymentCondition {
  type: 'branch' | 'tag' | 'pr' | 'manual' | 'schedule';
  value: string;
  operator: 'equals' | 'contains' | 'matches' | 'gt' | 'lt';
}

export interface RollbackStrategy {
  automatic: boolean;
  conditions: RollbackCondition[];
  maxAttempts: number;
  cooldown: number; // in seconds
}

export interface RollbackCondition {
  metric: 'error-rate' | 'response-time' | 'uptime' | 'health-check';
  threshold: number;
  duration: number; // in seconds
}

export interface TestingStrategy {
  preDeployment: PreDeploymentTest[];
  postDeployment: PostDeploymentTest[];
  loadTesting: boolean;
  securityScanning: boolean;
}

export interface PreDeploymentTest {
  type: 'unit' | 'integration' | 'e2e' | 'lint' | 'security';
  command: string;
  required: boolean;
  timeout: number; // in seconds
}

export interface PostDeploymentTest {
  type: 'smoke' | 'health-check' | 'load' | 'security' | 'accessibility';
  endpoint: string;
  expected: any;
  timeout: number; // in seconds
}

export interface DeploymentPipeline {
  id: string;
  name: string;
  projectPath: string;
  stages: DeploymentStage[];
  triggers: PipelineTrigger[];
  notifications: NotificationConfig[];
  created: number;
  lastRun?: number;
}

export interface DeploymentStage {
  name: string;
  type: 'build' | 'test' | 'deploy' | 'monitor' | 'custom';
  config: DeploymentConfig;
  dependencies: string[]; // stage names
  parallel: boolean;
  optional: boolean;
  timeout: number; // in seconds
}

export interface PipelineTrigger {
  type: 'push' | 'pr' | 'schedule' | 'webhook' | 'manual';
  conditions: string[];
  branches?: string[];
  schedule?: string; // cron format
}

export interface NotificationConfig {
  type: 'slack' | 'discord' | 'email' | 'webhook' | 'teams';
  url: string;
  events: NotificationEvent[];
  template?: string;
}

export type NotificationEvent = 
  | 'deployment-start'
  | 'deployment-success'
  | 'deployment-failure'
  | 'rollback-triggered'
  | 'health-check-failed'
  | 'performance-degraded';

export interface DeploymentAnalytics {
  totalDeployments: number;
  successRate: number;
  averageBuildTime: number;
  averageDeployTime: number;
  popularTargets: Record<DeploymentTarget, number>;
  errorPatterns: ErrorPattern[];
  performanceTrends: PerformanceTrend[];
  costAnalysis: CostAnalysis;
}

export interface ErrorPattern {
  pattern: string;
  frequency: number;
  target: DeploymentTarget;
  category: string;
  solution: string;
}

export interface PerformanceTrend {
  metric: string;
  data: DataPoint[];
  trend: 'improving' | 'degrading' | 'stable';
  target: DeploymentTarget;
}

export interface DataPoint {
  timestamp: number;
  value: number;
  context?: Record<string, any>;
}

export interface CostAnalysis {
  totalCost: number;
  costByTarget: Record<DeploymentTarget, number>;
  costTrend: number; // percentage change
  recommendations: CostRecommendation[];
}

export interface CostRecommendation {
  type: 'target-switch' | 'optimization' | 'scaling' | 'feature-toggle';
  description: string;
  estimatedSavings: number; // percentage
  effort: 'low' | 'medium' | 'high';
  impact: 'low' | 'medium' | 'high';
}

export interface DeploymentEvent {
  id: string;
  type: 'deployment' | 'rollback' | 'health-check' | 'alert';
  timestamp: number;
  target: DeploymentTarget;
  environment: DeploymentEnvironment;
  data: any;
  metadata?: Record<string, any>;
}