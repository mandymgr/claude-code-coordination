/**
 * 🧠 Team Optimization AI - Type Definitions
 * ML-based team composition and optimization for AI coordination
 * TypeScript implementation for KRINS-Universe-Builder
 */

export interface TeamMember {
  id: string;
  name?: string;
  skills: string[];
  experience: Record<string, number>;
  availability: number; // 0-1
  preferences: Record<string, any>;
  performance: Performancemetrics;
  metadata?: Record<string, any>;
}

export interface Performancemetrics {
  tasksCompleted: number;
  averageRating: number;
  successRate: number;
  responseTime: number;
  collaborationScore: number;
  specialtyAreas: string[];
  lastActive: number;
}

export interface ProjectRequirements {
  type: ProjectType;
  complexity: number; // 0-1
  estimatedDuration: number; // in days
  priority: 'low' | 'medium' | 'high' | 'critical';
  requiredSkills: string[];
  optionalSkills: string[];
  technologies: string[];
  constraints: ProjectConstraints;
}

export interface ProjectConstraints {
  maxTeamSize: number;
  minTeamSize: number;
  budget?: number;
  deadline?: Date;
  location?: 'remote' | 'onsite' | 'hybrid';
  timezone?: string;
  securityLevel?: 'low' | 'medium' | 'high' | 'classified';
}

export interface TeamComposition {
  members: TeamMember[];
  roles: Record<string, string>; // memberID -> role
  structure: TeamStructure;
  metrics: TeamMetrics;
  confidence: number; // 0-1
  alternatives: TeamComposition[];
}

export interface TeamStructure {
  lead: string; // memberID
  specialists: string[]; // memberIDs
  generalists: string[]; // memberIDs
  support: string[]; // memberIDs
  hierarchy: 'flat' | 'hierarchical' | 'matrix';
}

export interface TeamMetrics {
  skillCoverage: number; // 0-1
  experienceLevel: number; // 0-1
  balanceScore: number; // 0-1
  communicationScore: number; // 0-1
  riskScore: number; // 0-1
  estimatedEfficiency: number; // 0-1
  collaborationPotential: number; // 0-1
  innovationIndex: number; // 0-1
}

export type ProjectType = 
  | 'web-frontend'
  | 'web-backend' 
  | 'web-fullstack'
  | 'mobile-app'
  | 'api-development'
  | 'data-analytics'
  | 'machine-learning'
  | 'devops-infrastructure'
  | 'security-focused'
  | 'blockchain-dapp'
  | 'game-development'
  | 'enterprise-software'
  | 'startup-mvp'
  | 'research-prototype'
  | 'legacy-migration'
  | 'microservices'
  | 'ecommerce-platform';

export type OptimizationStrategy = 
  | 'skill-based'      // Optimize for skill coverage
  | 'experience-based' // Optimize for experience level
  | 'balanced'         // Balance all factors
  | 'cost-optimized'   // Minimize costs while meeting requirements
  | 'time-optimized'   // Optimize for fastest delivery
  | 'innovation-focused' // Optimize for creative solutions
  | 'risk-minimized'   // Minimize project risks
  | 'collaboration-optimized'; // Optimize team dynamics

export interface OptimizationResult {
  strategy: OptimizationStrategy;
  composition: TeamComposition;
  rationale: string[];
  predictions: ProjectPredictions;
  recommendations: Recommendation[];
  warnings: Warning[];
  confidence: number;
  timestamp: number;
}

export interface ProjectPredictions {
  estimatedSuccess: number; // 0-1
  timeToCompletion: number; // in days
  budgetRequirement: number;
  riskFactors: RiskFactor[];
  keyMilestones: Milestone[];
  potentialBottlenecks: string[];
}

export interface RiskFactor {
  type: 'skill-gap' | 'timeline' | 'communication' | 'technology' | 'resource' | 'external';
  severity: 'low' | 'medium' | 'high' | 'critical';
  probability: number; // 0-1
  impact: number; // 0-1
  description: string;
  mitigation: string[];
}

export interface Milestone {
  name: string;
  estimatedDate: Date;
  dependencies: string[];
  requiredSkills: string[];
  riskLevel: number; // 0-1
}

export interface Recommendation {
  type: 'team-composition' | 'skill-development' | 'process' | 'technology' | 'resource';
  priority: 'low' | 'medium' | 'high' | 'critical';
  description: string;
  rationale: string;
  implementation: string[];
  expectedBenefit: string;
  effort: 'low' | 'medium' | 'high';
}

export interface Warning {
  type: 'skill-mismatch' | 'overallocation' | 'communication-risk' | 'timeline-risk' | 'budget-risk';
  severity: 'info' | 'warning' | 'error' | 'critical';
  message: string;
  affectedMembers?: string[];
  suggestedActions: string[];
}

export interface SkillMatrix {
  [skill: string]: {
    required: boolean;
    level: 'beginner' | 'intermediate' | 'advanced' | 'expert';
    weight: number; // importance weight 0-1
    category: 'technical' | 'soft' | 'domain' | 'tool';
  };
}

export interface CollaborationHistory {
  memberPairs: Record<string, CollaborationMetrics>;
  teamHistory: TeamHistoryEntry[];
  successPatterns: SuccessPattern[];
  conflictPatterns: ConflictPattern[];
}

export interface CollaborationMetrics {
  projectsWorkedTogether: number;
  averageRating: number;
  communicationEfficiency: number;
  conflictResolution: number;
  knowledgeSharing: number;
  mutualSupport: number;
}

export interface TeamHistoryEntry {
  projectId: string;
  memberIds: string[];
  duration: number;
  success: boolean;
  metrics: TeamMetrics;
  lessons: string[];
  timestamp: number;
}

export interface SuccessPattern {
  pattern: string;
  frequency: number;
  impact: number;
  conditions: string[];
  examples: string[];
}

export interface ConflictPattern {
  pattern: string;
  frequency: number;
  severity: number;
  triggers: string[];
  resolutions: string[];
}

export interface MLModel {
  version: string;
  algorithm: 'neural-network' | 'random-forest' | 'gradient-boosting' | 'ensemble';
  trainingData: number; // number of samples
  accuracy: number; // 0-1
  lastTrained: number;
  features: string[];
  performance: ModelPerformance;
}

export interface ModelPerformance {
  precision: number;
  recall: number;
  f1Score: number;
  auc: number;
  confusionMatrix: number[][];
  featureImportance: Record<string, number>;
}

export interface OptimizationConfig {
  strategy: OptimizationStrategy;
  constraints: ProjectConstraints;
  preferences: OptimizationPreferences;
  mlEnabled: boolean;
  historicalWeight: number; // 0-1, how much to weight historical data
  realTimeAdjustments: boolean;
  uncertaintyTolerance: number; // 0-1
}

export interface OptimizationPreferences {
  prioritizeExperience: boolean;
  allowSkillDevelopment: boolean;
  maximizeInnovation: boolean;
  minimizeRisk: boolean;
  preferStableTeams: boolean;
  encourageDiversity: boolean;
  focusOnCommunication: boolean;
}

export interface TeamOptimizationEvent {
  type: 'optimization-request' | 'team-formed' | 'performance-update' | 'model-retrained';
  timestamp: number;
  data: any;
  source: 'user' | 'system' | 'ml-model';
  metadata?: Record<string, any>;
}

export interface OptimizationAnalytics {
  totalOptimizations: number;
  successRate: number;
  averageTeamSize: number;
  mostRequestedSkills: Record<string, number>;
  performanceTrends: TrendData[];
  modelAccuracy: number;
  improvementAreas: string[];
}

export interface TrendData {
  timestamp: number;
  value: number;
  metric: string;
  context?: Record<string, any>;
}