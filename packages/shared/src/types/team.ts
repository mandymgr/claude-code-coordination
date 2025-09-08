/**
 * Team Optimization and AI Agent Management Types
 */

export interface TeamOptimizationConfig {
  projectTypes: Record<string, ProjectTypeConfig>;
  agentCapabilities: Record<string, AgentCapability>;
  optimizationRules: OptimizationRule[];
}

export interface ProjectTypeConfig {
  name: string;
  complexity: number;
  requiredSkills: string[];
  optimalTeamSize: [number, number];
  criticalRoles: string[];
  estimatedDuration?: string;
  budgetMultiplier?: number;
}

export interface AgentCapability {
  id: string;
  name: string;
  skills: string[];
  efficiency: Record<string, number>;
  availability: 'high' | 'medium' | 'low';
  costPerHour?: number;
  specializations: string[];
}

export interface OptimizationRule {
  name: string;
  condition: string;
  action: string;
  priority: number;
  description: string;
}

export interface TeamComposition {
  agents: SelectedAgent[];
  totalCost: number;
  estimatedDuration: string;
  skillsCoverage: number;
  riskAssessment: RiskAssessment;
  alternatives: TeamComposition[];
}

export interface SelectedAgent {
  agentId: string;
  role: string;
  allocation: number; // Percentage of time
  skills: string[];
  reasoning: string;
}

export interface RiskAssessment {
  overall: 'low' | 'medium' | 'high';
  factors: RiskFactor[];
  mitigation: string[];
}

export interface RiskFactor {
  type: 'skill-gap' | 'resource-constraint' | 'timeline-pressure' | 'complexity-mismatch';
  severity: number;
  description: string;
}

export interface OptimizationMetrics {
  efficiency: number;
  costEffectiveness: number;
  skillMatch: number;
  availabilityScore: number;
  overallScore: number;
}

export interface TeamOptimizationSession {
  id: string;
  projectType: string;
  requirements: ProjectRequirements;
  constraints: OptimizationConstraints;
  recommendations: TeamComposition[];
  selectedTeam?: TeamComposition;
  sessionMetrics: OptimizationMetrics;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProjectRequirements {
  skills: string[];
  timeline: string;
  budget?: number;
  teamSize?: [number, number];
  priorities: string[];
  constraints: string[];
}

export interface OptimizationConstraints {
  maxBudget?: number;
  maxTeamSize?: number;
  requiredSkills: string[];
  forbiddenCombinations?: string[][];
  preferredAgents?: string[];
}

export interface SessionCapability {
  sessionId: string;
  totalSlots: number;
  usedSlots: number;
  availableSkills: string[];
  activeAgents: string[];
  queuedTasks: number;
}

export interface TeamPerformanceMetrics {
  productivity: number;
  qualityScore: number;
  collaborationIndex: number;
  taskCompletionRate: number;
  averageResponseTime: number;
  errorRate: number;
}

export interface LearningData {
  successfulCombinations: Record<string, number>;
  failedCombinations: Record<string, number>;
  agentPerformance: Record<string, AgentPerformanceHistory>;
  projectOutcomes: ProjectOutcome[];
}

export interface AgentPerformanceHistory {
  agentId: string;
  projects: ProjectPerformance[];
  averageRating: number;
  skillProgression: Record<string, number>;
  collaborationScores: Record<string, number>;
}

export interface ProjectPerformance {
  projectId: string;
  role: string;
  duration: string;
  rating: number;
  feedback: string[];
  skillsUsed: string[];
  challenges: string[];
}

export interface ProjectOutcome {
  projectId: string;
  projectType: string;
  teamComposition: string[];
  success: boolean;
  metrics: TeamPerformanceMetrics;
  lessons: string[];
}