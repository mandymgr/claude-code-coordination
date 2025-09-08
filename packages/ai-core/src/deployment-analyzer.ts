/**
 * 🔍 Deployment Analyzer - Smart Project Analysis for Optimal Deployment
 * Intelligent analysis of project structure to recommend best deployment targets
 * TypeScript implementation for KRINS-Universe-Builder
 */

import fs from 'fs';
import path from 'path';
import { 
  ProjectType, 
  DeploymentTarget, 
  TargetCapabilities,
  DeploymentConfig,
  DeploymentEnvironment
} from './deployment-types.js';
import { UniversalProjectDetector } from './universal-project-detector.js';

export interface ProjectAnalysis {
  projectType: ProjectType;
  framework: string;
  language: string;
  dependencies: string[];
  hasDatabase: boolean;
  hasServerless: boolean;
  hasStatic: boolean;
  hasBuild: boolean;
  complexity: number;
  size: ProjectSize;
  requirements: DeploymentRequirements;
}

export interface ProjectSize {
  files: number;
  totalSize: number; // in bytes
  nodeModulesSize?: number;
  buildOutputSize?: number;
}

export interface DeploymentRequirements {
  runtime: string;
  nodeVersion?: string;
  buildTime: number; // estimated in seconds
  memory: number; // estimated in MB
  storage: number; // estimated in MB
  bandwidth: number; // estimated monthly in GB
  customDomain: boolean;
  https: boolean;
  serverSideRendering: boolean;
  apiRoutes: boolean;
  staticAssets: boolean;
  database: boolean;
  cron: boolean;
  websockets: boolean;
}

export interface RecommendationResult {
  primary: TargetRecommendation;
  alternatives: TargetRecommendation[];
  analysis: ProjectAnalysis;
  confidence: number;
  reasoning: string[];
}

export interface TargetRecommendation {
  target: DeploymentTarget;
  score: number; // 0-1
  config: DeploymentConfig;
  pros: string[];
  cons: string[];
  estimatedCost: number; // monthly in USD
  deploymentTime: number; // estimated in seconds
  limitations: string[];
}

export class DeploymentAnalyzer {
  private projectDetector: UniversalProjectDetector;
  private targetCapabilities: Map<DeploymentTarget, TargetCapabilities>;
  private projectPath: string;

  constructor(projectPath: string = process.cwd()) {
    this.projectPath = projectPath;
    this.projectDetector = new UniversalProjectDetector(projectPath);
    this.targetCapabilities = this.initializeTargetCapabilities();
  }

  /**
   * 🎯 Analyze project and recommend optimal deployment targets
   */
  public async analyzeAndRecommend(environment: DeploymentEnvironment = 'prod'): Promise<RecommendationResult> {
    console.log('🔍 Analyzing project for deployment recommendations...');

    try {
      // Analyze project structure
      const projectDetection = await this.projectDetector.analyze();
      const projectAnalysis = await this.analyzeProject(projectDetection);
      
      console.log(`📊 Project: ${projectAnalysis.projectType} (${projectAnalysis.framework})`);
      console.log(`🏗️ Complexity: ${Math.round(projectAnalysis.complexity * 100)}%`);

      // Score all targets
      const recommendations = await this.scoreTargets(projectAnalysis, environment);
      
      // Sort by score and select top recommendations
      recommendations.sort((a, b) => b.score - a.score);
      
      const result: RecommendationResult = {
        primary: recommendations[0],
        alternatives: recommendations.slice(1, 4), // Top 3 alternatives
        analysis: projectAnalysis,
        confidence: this.calculateConfidence(recommendations[0], projectAnalysis),
        reasoning: this.generateReasoning(recommendations[0], projectAnalysis)
      };

      console.log(`✅ Recommendation: ${result.primary.target} (${Math.round(result.primary.score * 100)}% match)`);
      
      return result;

    } catch (error) {
      console.error('❌ Analysis failed:', error);
      throw error;
    }
  }

  /**
   * 📋 Convert project detection to deployment analysis
   */
  private async analyzeProject(detection: any): Promise<ProjectAnalysis> {
    const projectPath = this.projectPath;
    
    // Determine project type
    const projectType = this.determineProjectType(detection);
    
    // Analyze dependencies
    const dependencies = this.extractDependencies(detection);
    
    // Analyze project structure
    const hasDatabase = this.detectDatabase(detection, dependencies);
    const hasServerless = this.detectServerless(detection, dependencies);
    const hasStatic = this.detectStatic(detection);
    const hasBuild = this.detectBuildProcess(detection);
    
    // Calculate project size
    const size = await this.calculateProjectSize(projectPath);
    
    // Estimate requirements
    const requirements = this.estimateRequirements(detection, dependencies, size);

    return {
      projectType,
      framework: detection.frameworks?.[0] || 'unknown',
      language: detection.languages?.[0] || 'javascript',
      dependencies,
      hasDatabase,
      hasServerless,
      hasStatic,
      hasBuild,
      complexity: detection.complexity || 0.5,
      size,
      requirements
    };
  }

  /**
   * 🏆 Score all deployment targets for this project
   */
  private async scoreTargets(analysis: ProjectAnalysis, environment: DeploymentEnvironment): Promise<TargetRecommendation[]> {
    const recommendations: TargetRecommendation[] = [];

    for (const [target, capabilities] of this.targetCapabilities.entries()) {
      if (target === 'auto') continue; // Skip auto target in scoring

      const score = this.calculateTargetScore(analysis, capabilities, environment);
      const config = this.generateTargetConfig(analysis, target, environment);
      const recommendation = this.createRecommendation(target, score, config, analysis, capabilities);
      
      recommendations.push(recommendation);
    }

    return recommendations;
  }

  /**
   * 📊 Calculate compatibility score for a specific target
   */
  private calculateTargetScore(
    analysis: ProjectAnalysis, 
    capabilities: TargetCapabilities, 
    environment: DeploymentEnvironment
  ): number {
    let score = 0;
    const factors = [];

    // Project type compatibility (40% weight)
    const typeCompatibility = capabilities.supportedTypes.includes(analysis.projectType) ? 1 : 0;
    score += typeCompatibility * 0.4;
    factors.push({ name: 'Type Compatibility', value: typeCompatibility, weight: 0.4 });

    // Feature support (25% weight)
    const featureScore = this.calculateFeatureSupport(analysis, capabilities);
    score += featureScore * 0.25;
    factors.push({ name: 'Feature Support', value: featureScore, weight: 0.25 });

    // Performance (15% weight)
    const performanceScore = this.calculatePerformanceScore(analysis, capabilities);
    score += performanceScore * 0.15;
    factors.push({ name: 'Performance', value: performanceScore, weight: 0.15 });

    // Cost effectiveness (10% weight)
    const costScore = this.calculateCostScore(analysis, capabilities, environment);
    score += costScore * 0.1;
    factors.push({ name: 'Cost', value: costScore, weight: 0.1 });

    // Ease of deployment (10% weight)
    const easeScore = this.calculateEaseScore(analysis, capabilities);
    score += easeScore * 0.1;
    factors.push({ name: 'Ease of Deployment', value: easeScore, weight: 0.1 });

    return Math.min(1, Math.max(0, score));
  }

  /**
   * 🎯 Determine project type from detection
   */
  private determineProjectType(detection: any): ProjectType {
    const frameworks = detection.frameworks || [];
    const dependencies = detection.technologies || [];
    
    // Check for full-stack indicators
    if (this.hasBackendFramework(frameworks) && this.hasFrontendFramework(frameworks)) {
      return 'full-stack';
    }
    
    // Check for serverless patterns
    if (dependencies.includes('aws-lambda') || dependencies.includes('vercel') || dependencies.includes('netlify-functions')) {
      return 'serverless';
    }
    
    // Check for backend API
    if (this.hasBackendFramework(frameworks)) {
      return 'backend-api';
    }
    
    // Check for SSR
    if (frameworks.includes('next.js') || frameworks.includes('nuxt') || frameworks.includes('sveltekit')) {
      return 'frontend-ssr';
    }
    
    // Check for SPA
    if (this.hasFrontendFramework(frameworks)) {
      return 'frontend-spa';
    }
    
    // Check for static site
    if (frameworks.includes('gatsby') || frameworks.includes('hugo') || dependencies.includes('static')) {
      return 'static-site';
    }

    return 'frontend-spa'; // Default fallback
  }

  private hasBackendFramework(frameworks: string[]): boolean {
    const backendFrameworks = ['express', 'fastify', 'koa', 'hapi', 'nestjs', 'django', 'flask', 'rails'];
    return frameworks.some(f => backendFrameworks.includes(f.toLowerCase()));
  }

  private hasFrontendFramework(frameworks: string[]): boolean {
    const frontendFrameworks = ['react', 'vue', 'angular', 'svelte', 'solid'];
    return frameworks.some(f => frontendFrameworks.includes(f.toLowerCase()));
  }

  /**
   * 📦 Extract dependencies from detection
   */
  private extractDependencies(detection: any): string[] {
    return detection.technologies || [];
  }

  /**
   * 🗄️ Detect database usage
   */
  private detectDatabase(detection: any, dependencies: string[]): boolean {
    const dbIndicators = ['prisma', 'mongoose', 'sequelize', 'typeorm', 'postgres', 'mysql', 'mongodb'];
    return dependencies.some(dep => dbIndicators.includes(dep.toLowerCase()));
  }

  /**
   * ⚡ Detect serverless functions
   */
  private detectServerless(detection: any, dependencies: string[]): boolean {
    const serverlessIndicators = ['vercel', 'netlify-functions', 'aws-lambda', 'azure-functions', 'cloudflare-workers'];
    return dependencies.some(dep => serverlessIndicators.includes(dep.toLowerCase()));
  }

  /**
   * 📄 Detect static site generation
   */
  private detectStatic(detection: any): boolean {
    const staticIndicators = ['gatsby', 'hugo', 'jekyll', 'eleventy', '11ty'];
    return detection.frameworks?.some((f: string) => staticIndicators.includes(f.toLowerCase())) || false;
  }

  /**
   * 🏗️ Detect build process
   */
  private detectBuildProcess(detection: any): boolean {
    // Check if there's a build script or common build tools
    return true; // Most modern projects have build processes
  }

  /**
   * 📏 Calculate project size metrics
   */
  private async calculateProjectSize(projectPath: string): Promise<ProjectSize> {
    let files = 0;
    let totalSize = 0;
    let nodeModulesSize = 0;

    try {
      const calculateDirectory = (dirPath: string, isNodeModules: boolean = false): void => {
        try {
          const entries = fs.readdirSync(dirPath, { withFileTypes: true });
          
          for (const entry of entries) {
            const fullPath = path.join(dirPath, entry.name);
            
            if (entry.isDirectory()) {
              if (entry.name === 'node_modules' && !isNodeModules) {
                calculateDirectory(fullPath, true);
              } else if (entry.name !== '.git' && !entry.name.startsWith('.') && !isNodeModules) {
                calculateDirectory(fullPath, false);
              }
            } else if (entry.isFile()) {
              const stats = fs.statSync(fullPath);
              files++;
              totalSize += stats.size;
              
              if (isNodeModules) {
                nodeModulesSize += stats.size;
              }
            }
          }
        } catch (error) {
          // Skip directories we can't read
        }
      };

      calculateDirectory(projectPath);
    } catch (error) {
      console.warn('Warning: Could not calculate project size:', error);
    }

    return {
      files,
      totalSize,
      nodeModulesSize
    };
  }

  /**
   * 📊 Estimate deployment requirements
   */
  private estimateRequirements(detection: any, dependencies: string[], size: ProjectSize): DeploymentRequirements {
    const complexity = detection.complexity || 0.5;
    
    // Base estimates
    let buildTime = 30; // seconds
    let memory = 512; // MB
    let storage = 100; // MB
    let bandwidth = 10; // GB per month

    // Adjust based on project characteristics
    if (size.files > 1000) {
      buildTime += 60;
      memory += 256;
      storage += 200;
    }

    if (complexity > 0.7) {
      buildTime += 120;
      memory += 512;
      bandwidth += 20;
    }

    if (dependencies.includes('react') || dependencies.includes('vue') || dependencies.includes('angular')) {
      buildTime += 30;
      memory += 128;
    }

    if (dependencies.includes('typescript')) {
      buildTime += 45;
      memory += 256;
    }

    return {
      runtime: dependencies.includes('python') ? 'python' : 'nodejs',
      nodeVersion: '18.x',
      buildTime,
      memory,
      storage,
      bandwidth,
      customDomain: true,
      https: true,
      serverSideRendering: this.hasSSR(dependencies),
      apiRoutes: this.hasAPIRoutes(detection, dependencies),
      staticAssets: true,
      database: this.detectDatabase(detection, dependencies),
      cron: false,
      websockets: dependencies.includes('socket.io') || dependencies.includes('websocket')
    };
  }

  private hasSSR(dependencies: string[]): boolean {
    return dependencies.includes('next.js') || dependencies.includes('nuxt') || dependencies.includes('sveltekit');
  }

  private hasAPIRoutes(detection: any, dependencies: string[]): boolean {
    return this.hasBackendFramework(detection.frameworks || []) || 
           dependencies.includes('api') || 
           dependencies.includes('express');
  }

  /**
   * 🎯 Initialize target capabilities database
   */
  private initializeTargetCapabilities(): Map<DeploymentTarget, TargetCapabilities> {
    const capabilities = new Map<DeploymentTarget, TargetCapabilities>();

    // Vercel
    capabilities.set('vercel', {
      target: 'vercel',
      supportedTypes: ['frontend-spa', 'frontend-ssr', 'full-stack', 'serverless', 'static-site'],
      features: [
        { name: 'Edge Functions', description: 'Run code at the edge', category: 'runtime', premium: false },
        { name: 'Auto-scaling', description: 'Automatic scaling', category: 'scaling', premium: false },
        { name: 'Global CDN', description: 'Global content delivery', category: 'runtime', premium: false },
        { name: 'Preview Deployments', description: 'Branch previews', category: 'build', premium: false }
      ],
      limitations: [
        { type: 'build-time', value: 45, unit: 'minutes', tier: 'free' },
        { type: 'file-size', value: 100, unit: 'MB', tier: 'free' }
      ],
      pricing: {
        free: true,
        freeTier: { builds: 100, bandwidth: 100, functions: 12, domains: 1 },
        costEstimate: 20
      },
      performance: {
        globalCDN: true,
        edgeLocations: 70,
        averageLatency: 50,
        uptime: 99.99,
        buildSpeed: 0.9
      },
      reputation: 0.95
    });

    // Netlify
    capabilities.set('netlify', {
      target: 'netlify',
      supportedTypes: ['frontend-spa', 'static-site', 'serverless'],
      features: [
        { name: 'Form Handling', description: 'Built-in form processing', category: 'runtime', premium: false },
        { name: 'Split Testing', description: 'A/B testing', category: 'monitoring', premium: true },
        { name: 'Identity', description: 'User management', category: 'security', premium: true }
      ],
      limitations: [
        { type: 'build-time', value: 15, unit: 'minutes', tier: 'free' },
        { type: 'bandwidth', value: 100, unit: 'GB', tier: 'free' }
      ],
      pricing: {
        free: true,
        freeTier: { builds: 300, bandwidth: 100, functions: 125000, domains: 1 },
        costEstimate: 15
      },
      performance: {
        globalCDN: true,
        edgeLocations: 40,
        averageLatency: 75,
        uptime: 99.9,
        buildSpeed: 0.8
      },
      reputation: 0.9
    });

    // Railway
    capabilities.set('railway', {
      target: 'railway',
      supportedTypes: ['backend-api', 'full-stack', 'database', 'microservice'],
      features: [
        { name: 'Database Hosting', description: 'Built-in databases', category: 'runtime', premium: false },
        { name: 'Auto Deploy', description: 'Git-based deployments', category: 'build', premium: false },
        { name: 'Private Networking', description: 'Internal communication', category: 'security', premium: false }
      ],
      limitations: [
        { type: 'bandwidth', value: 100, unit: 'GB', tier: 'free' },
        { type: 'build-time', value: 500, unit: 'hours', tier: 'free' }
      ],
      pricing: {
        free: true,
        freeTier: { builds: -1, bandwidth: 100, functions: -1, domains: 1 },
        costEstimate: 5
      },
      performance: {
        globalCDN: false,
        edgeLocations: 5,
        averageLatency: 100,
        uptime: 99.5,
        buildSpeed: 0.7
      },
      reputation: 0.85
    });

    // Add more targets...
    this.addMoreTargetCapabilities(capabilities);

    return capabilities;
  }

  private addMoreTargetCapabilities(capabilities: Map<DeploymentTarget, TargetCapabilities>): void {
    // Render
    capabilities.set('render', {
      target: 'render',
      supportedTypes: ['backend-api', 'full-stack', 'frontend-spa', 'database'],
      features: [
        { name: 'Auto SSL', description: 'Automatic HTTPS', category: 'security', premium: false },
        { name: 'Health Checks', description: 'Service monitoring', category: 'monitoring', premium: false }
      ],
      limitations: [
        { type: 'build-time', value: 90, unit: 'minutes', tier: 'free' }
      ],
      pricing: {
        free: true,
        freeTier: { builds: -1, bandwidth: 100, functions: -1, domains: 1 },
        costEstimate: 7
      },
      performance: {
        globalCDN: true,
        edgeLocations: 25,
        averageLatency: 80,
        uptime: 99.9,
        buildSpeed: 0.75
      },
      reputation: 0.88
    });

    // Heroku
    capabilities.set('heroku', {
      target: 'heroku',
      supportedTypes: ['backend-api', 'full-stack', 'database'],
      features: [
        { name: 'Add-ons', description: 'Rich ecosystem', category: 'runtime', premium: false },
        { name: 'Dynos', description: 'Container management', category: 'scaling', premium: false }
      ],
      limitations: [
        { type: 'build-time', value: 15, unit: 'minutes', tier: 'free' }
      ],
      pricing: {
        free: false, // No longer free
        costEstimate: 25
      },
      performance: {
        globalCDN: false,
        edgeLocations: 8,
        averageLatency: 120,
        uptime: 99.95,
        buildSpeed: 0.6
      },
      reputation: 0.8
    });
  }

  /**
   * 🏗️ Generate deployment configuration for target
   */
  private generateTargetConfig(
    analysis: ProjectAnalysis, 
    target: DeploymentTarget, 
    environment: DeploymentEnvironment
  ): DeploymentConfig {
    const baseConfig: DeploymentConfig = {
      target,
      environment,
      projectType: analysis.projectType,
      buildCommand: this.getBuildCommand(analysis),
      outputDir: this.getOutputDir(analysis),
      startCommand: this.getStartCommand(analysis),
      envVars: this.getDefaultEnvVars(environment),
      scaling: {
        minInstances: environment === 'prod' ? 2 : 1,
        maxInstances: environment === 'prod' ? 10 : 3,
        autoScale: true
      },
      monitoring: {
        healthCheck: '/health',
        alerting: environment === 'prod',
        logLevel: environment === 'prod' ? 'warn' : 'info',
        metrics: true,
        uptime: true
      },
      security: {
        https: true,
        cors: {
          enabled: true,
          origins: ['*'],
          methods: ['GET', 'POST', 'PUT', 'DELETE'],
          headers: ['Content-Type', 'Authorization']
        },
        secrets: {
          provider: 'env',
          encryption: false,
          rotation: false
        }
      },
      performance: {
        caching: {
          enabled: true,
          strategy: 'static',
          ttl: 3600,
          purgeOnDeploy: true
        },
        compression: true,
        minification: true,
        bundleOptimization: true,
        imageOptimization: true,
        cdn: true
      }
    };

    return this.customizeConfigForTarget(baseConfig, target, analysis);
  }

  private getBuildCommand(analysis: ProjectAnalysis): string {
    if (analysis.framework === 'next.js') return 'npm run build';
    if (analysis.framework === 'react') return 'npm run build';
    if (analysis.framework === 'vue') return 'npm run build';
    if (analysis.framework === 'angular') return 'npm run build';
    if (analysis.framework === 'svelte') return 'npm run build';
    return 'npm run build';
  }

  private getOutputDir(analysis: ProjectAnalysis): string {
    if (analysis.framework === 'next.js') return '.next';
    if (analysis.framework === 'react') return 'dist';
    if (analysis.framework === 'vue') return 'dist';
    if (analysis.framework === 'angular') return 'dist';
    return 'build';
  }

  private getStartCommand(analysis: ProjectAnalysis): string {
    if (analysis.projectType === 'backend-api') return 'npm start';
    if (analysis.framework === 'next.js') return 'npm start';
    return 'npm start';
  }

  private getDefaultEnvVars(environment: DeploymentEnvironment): Record<string, string> {
    return {
      NODE_ENV: environment === 'prod' ? 'production' : environment,
      PORT: '3000'
    };
  }

  private customizeConfigForTarget(
    config: DeploymentConfig, 
    target: DeploymentTarget, 
    analysis: ProjectAnalysis
  ): DeploymentConfig {
    switch (target) {
      case 'vercel':
        if (analysis.framework === 'next.js') {
          config.buildCommand = 'npm run build';
          config.outputDir = '.next';
        }
        break;
      
      case 'netlify':
        config.buildCommand = 'npm run build';
        config.outputDir = analysis.framework === 'react' ? 'build' : 'dist';
        break;
        
      case 'railway':
        config.startCommand = analysis.projectType === 'backend-api' ? 'npm start' : 'npm run start:prod';
        break;
    }

    return config;
  }

  // Helper methods for scoring calculations
  private calculateFeatureSupport(analysis: ProjectAnalysis, capabilities: TargetCapabilities): number {
    // Implementation would check if required features are supported
    return 0.8; // Simplified
  }

  private calculatePerformanceScore(analysis: ProjectAnalysis, capabilities: TargetCapabilities): number {
    let score = capabilities.performance.uptime / 100;
    score += (1 - capabilities.performance.averageLatency / 200);
    score += capabilities.performance.buildSpeed;
    return score / 3;
  }

  private calculateCostScore(analysis: ProjectAnalysis, capabilities: TargetCapabilities, environment: DeploymentEnvironment): number {
    if (capabilities.pricing.free && environment !== 'prod') return 1;
    const cost = capabilities.pricing.costEstimate;
    return Math.max(0, 1 - (cost / 100)); // Normalize against $100/month
  }

  private calculateEaseScore(analysis: ProjectAnalysis, capabilities: TargetCapabilities): number {
    // Simplified ease of deployment score
    return capabilities.reputation;
  }

  private createRecommendation(
    target: DeploymentTarget,
    score: number,
    config: DeploymentConfig,
    analysis: ProjectAnalysis,
    capabilities: TargetCapabilities
  ): TargetRecommendation {
    return {
      target,
      score,
      config,
      pros: this.generatePros(target, capabilities, analysis),
      cons: this.generateCons(target, capabilities, analysis),
      estimatedCost: capabilities.pricing.costEstimate,
      deploymentTime: this.estimateDeploymentTime(target, analysis),
      limitations: capabilities.limitations.map(l => `${l.type}: ${l.value} ${l.unit}`)
    };
  }

  private generatePros(target: DeploymentTarget, capabilities: TargetCapabilities, analysis: ProjectAnalysis): string[] {
    const pros = [];
    
    if (capabilities.pricing.free) pros.push('Free tier available');
    if (capabilities.performance.globalCDN) pros.push('Global CDN');
    if (capabilities.performance.uptime > 99.9) pros.push('High uptime SLA');
    if (capabilities.reputation > 0.9) pros.push('Excellent reputation');
    
    return pros;
  }

  private generateCons(target: DeploymentTarget, capabilities: TargetCapabilities, analysis: ProjectAnalysis): string[] {
    const cons = [];
    
    if (!capabilities.pricing.free) cons.push('No free tier');
    if (capabilities.performance.averageLatency > 100) cons.push('Higher latency');
    if (capabilities.limitations.length > 2) cons.push('Multiple limitations');
    
    return cons;
  }

  private estimateDeploymentTime(target: DeploymentTarget, analysis: ProjectAnalysis): number {
    let baseTime = 60; // 1 minute base
    
    if (analysis.complexity > 0.7) baseTime += 120;
    if (analysis.requirements.buildTime > 120) baseTime += 60;
    
    switch (target) {
      case 'vercel': return baseTime;
      case 'netlify': return baseTime + 30;
      case 'railway': return baseTime + 60;
      case 'render': return baseTime + 90;
      default: return baseTime + 45;
    }
  }

  private calculateConfidence(recommendation: TargetRecommendation, analysis: ProjectAnalysis): number {
    let confidence = recommendation.score;
    
    // Adjust based on project characteristics
    if (analysis.complexity < 0.3) confidence += 0.1; // Simple projects are easier to predict
    if (analysis.requirements.buildTime < 60) confidence += 0.05;
    
    return Math.min(0.98, confidence);
  }

  private generateReasoning(recommendation: TargetRecommendation, analysis: ProjectAnalysis): string[] {
    const reasoning = [];
    
    reasoning.push(`Best match for ${analysis.projectType} projects`);
    reasoning.push(`Supports ${analysis.framework} framework natively`);
    
    if (recommendation.estimatedCost === 0) {
      reasoning.push('Free tier covers project requirements');
    }
    
    if (recommendation.score > 0.8) {
      reasoning.push('Excellent compatibility score');
    }
    
    return reasoning;
  }
}