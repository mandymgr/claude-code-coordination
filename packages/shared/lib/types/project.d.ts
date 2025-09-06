/**
 * Project Detection and Analysis Types
 */
export interface ProjectAnalysis {
    type: ProjectType;
    languages: string[];
    frameworks: string[];
    tools: string[];
    architecture: ArchitectureType;
    deployment: DeploymentTarget;
    database?: DatabaseType;
    testing?: TestingFramework;
    cloud?: CloudProvider;
    aiSuggestions: string[];
    confidence: number;
}
export type ProjectType = 'web_fullstack' | 'ecommerce' | 'mobile_app' | 'api_microservices' | 'desktop_app' | 'data_science' | 'game_development' | 'blockchain' | 'iot' | 'unknown';
export type ArchitectureType = 'monorepo' | 'microservices' | 'monolith' | 'serverless' | 'jamstack' | 'spa' | 'ssr';
export type DeploymentTarget = 'vercel' | 'netlify' | 'aws' | 'azure' | 'gcp' | 'heroku' | 'docker' | 'kubernetes';
export type DatabaseType = 'postgresql' | 'mysql' | 'mongodb' | 'redis' | 'sqlite' | 'firebase' | 'supabase';
export type TestingFramework = 'jest' | 'vitest' | 'cypress' | 'playwright' | 'mocha' | 'jasmine';
export type CloudProvider = 'aws' | 'azure' | 'gcp' | 'vercel' | 'netlify' | 'heroku';
export interface DetectionPattern {
    files: string[];
    dependencies?: string[];
    keywords?: string[];
    weight: number;
}
export interface MagicConfiguration {
    projectType: ProjectType;
    recommendedAgents: string[];
    suggestedWorkflow: WorkflowStep[];
    qualityGates: QualityGate[];
    deploymentPipeline: DeploymentStep[];
}
export interface WorkflowStep {
    name: string;
    description: string;
    automated: boolean;
    dependencies?: string[];
}
export interface QualityGate {
    name: string;
    checks: string[];
    blocking: boolean;
}
export interface DeploymentStep {
    name: string;
    environment: 'development' | 'staging' | 'production';
    automated: boolean;
    requirements: string[];
}
//# sourceMappingURL=project.d.ts.map