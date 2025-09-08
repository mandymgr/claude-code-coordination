/**
 * 🚀 Magic Deployment Engine - Intelligent Multi-Platform Deployment
 * Advanced deployment automation with AI-powered optimization and monitoring
 * TypeScript implementation for KRINS-Universe-Builder
 */

import fs from 'fs';
import path from 'path';
import { execSync, spawn, ChildProcess } from 'child_process';
import {
  DeploymentTarget,
  DeploymentEnvironment,
  DeploymentConfig,
  DeploymentResult,
  DeploymentLog,
  DeploymentMetrics,
  DeploymentError,
  DeploymentWarning,
  DeploymentAnalytics
} from './deployment-types.js';
import { DeploymentAnalyzer, RecommendationResult } from './deployment-analyzer.js';

export interface DeploymentOptions {
  target?: DeploymentTarget;
  environment?: DeploymentEnvironment;
  dryRun?: boolean;
  force?: boolean;
  verbose?: boolean;
  skipTests?: boolean;
  skipBuild?: boolean;
  customConfig?: Partial<DeploymentConfig>;
}

export class MagicDeploymentEngine {
  private analyzer: DeploymentAnalyzer;
  private projectPath: string;
  private logs: DeploymentLog[] = [];
  private analytics: DeploymentAnalytics;

  constructor(projectPath: string = process.cwd()) {
    this.projectPath = path.resolve(projectPath);
    this.analyzer = new DeploymentAnalyzer(projectPath);
    this.analytics = this.initializeAnalytics();
  }

  /**
   * 🚀 Main deployment orchestrator
   */
  public async deploy(options: DeploymentOptions = {}): Promise<DeploymentResult> {
    const startTime = performance.now();
    this.log('info', 'Starting magic deployment...', 'deploy');

    try {
      // 1. Analyze project and get recommendations
      const recommendation = await this.getDeploymentRecommendation(options);
      const target = options.target || recommendation.primary.target;
      const environment = options.environment || 'prod';
      
      this.log('info', `Selected target: ${target} (${environment})`, 'deploy');

      // 2. Validate deployment prerequisites (skip for dry run)
      if (!options.dryRun) {
        await this.validatePrerequisites(target, environment);
      } else {
        this.log('info', 'Skipping prerequisite validation (dry run)', 'deploy');
      }

      // 3. Run pre-deployment checks
      if (!options.skipTests && !options.dryRun) {
        await this.runPreDeploymentTests();
      }

      // 4. Build project if needed
      let buildTime = 0;
      if (!options.skipBuild && !options.dryRun) {
        const buildStart = performance.now();
        await this.buildProject(recommendation.primary.config);
        buildTime = performance.now() - buildStart;
      } else if (options.dryRun) {
        // Simulate build time for dry run
        buildTime = 5000; // 5 seconds simulated
        this.log('info', 'Simulating build process (dry run)', 'build');
        await new Promise(resolve => setTimeout(resolve, 1000));
      }

      // 5. Deploy to target platform
      const deployStart = performance.now();
      const deploymentInfo = options.dryRun ? 
        await this.performDryRun(target, recommendation.primary.config) :
        await this.performDeployment(target, recommendation.primary.config, environment);
      const deployTime = performance.now() - deployStart;

      // 6. Run post-deployment verification
      if (!options.dryRun) {
        await this.runPostDeploymentVerification(deploymentInfo);
      }

      // 7. Collect metrics and generate result
      const totalTime = performance.now() - startTime;
      const metrics = await this.collectDeploymentMetrics(deploymentInfo, buildTime, deployTime);
      
      const result: DeploymentResult = {
        success: true,
        target,
        environment,
        url: deploymentInfo.url,
        deploymentId: deploymentInfo.id,
        buildTime,
        deployTime,
        totalTime,
        logs: this.logs,
        metrics,
        warnings: this.generateWarnings(recommendation, metrics),
        errors: []
      };

      this.updateAnalytics(result);
      this.log('info', `Deployment successful: ${deploymentInfo.url}`, 'deploy');

      return result;

    } catch (error) {
      const totalTime = performance.now() - startTime;
      const deploymentError: DeploymentError = {
        type: 'deploy',
        code: 'DEPLOYMENT_FAILED',
        message: error instanceof Error ? error.message : String(error),
        stack: error instanceof Error ? error.stack : undefined,
        resolution: this.generateErrorResolution(error)
      };

      this.log('error', `Deployment failed: ${deploymentError.message}`, 'deploy');

      const failedResult: DeploymentResult = {
        success: false,
        target: options.target || 'auto',
        environment: options.environment || 'prod',
        buildTime: 0,
        deployTime: 0,
        totalTime,
        logs: this.logs,
        metrics: this.getEmptyMetrics(),
        warnings: [],
        errors: [deploymentError]
      };

      this.updateAnalytics(failedResult);
      return failedResult;
    }
  }

  /**
   * 🎯 Get intelligent deployment recommendations
   */
  public async getDeploymentRecommendation(options: DeploymentOptions = {}): Promise<RecommendationResult> {
    this.log('info', 'Analyzing project for optimal deployment...', 'deploy');
    
    const recommendation = await this.analyzer.analyzeAndRecommend(options.environment);
    
    // Apply custom config if provided
    if (options.customConfig) {
      recommendation.primary.config = { ...recommendation.primary.config, ...options.customConfig };
    }

    return recommendation;
  }

  /**
   * 📋 Validate deployment prerequisites
   */
  private async validatePrerequisites(target: DeploymentTarget, environment: DeploymentEnvironment): Promise<void> {
    this.log('info', 'Validating deployment prerequisites...', 'deploy');

    // Check if project directory exists
    if (!fs.existsSync(this.projectPath)) {
      throw new Error(`Project path does not exist: ${this.projectPath}`);
    }

    // Check for package.json
    const packageJsonPath = path.join(this.projectPath, 'package.json');
    if (!fs.existsSync(packageJsonPath)) {
      throw new Error('package.json not found in project directory');
    }

    // Validate target-specific requirements
    await this.validateTargetRequirements(target, environment);

    this.log('info', 'Prerequisites validated successfully', 'deploy');
  }

  /**
   * 🎯 Validate target-specific requirements
   */
  private async validateTargetRequirements(target: DeploymentTarget, environment: DeploymentEnvironment): Promise<void> {
    switch (target) {
      case 'vercel':
        await this.validateVercelRequirements();
        break;
      case 'netlify':
        await this.validateNetlifyRequirements();
        break;
      case 'railway':
        await this.validateRailwayRequirements();
        break;
      case 'render':
        await this.validateRenderRequirements();
        break;
      // Add more target validations
    }
  }

  /**
   * 🧪 Run pre-deployment tests
   */
  private async runPreDeploymentTests(): Promise<void> {
    this.log('info', 'Running pre-deployment tests...', 'build');

    try {
      // Check if there's a test script
      const packageJson = JSON.parse(fs.readFileSync(path.join(this.projectPath, 'package.json'), 'utf8'));
      
      if (packageJson.scripts?.test) {
        this.log('info', 'Running test suite...', 'build');
        await this.executeCommand('npm test', { timeout: 300000 }); // 5 minute timeout
        this.log('info', 'Tests passed successfully', 'build');
      } else {
        this.log('info', 'No test script found, skipping tests', 'build');
      }

      // Run linting if available
      if (packageJson.scripts?.lint) {
        this.log('info', 'Running linter...', 'build');
        await this.executeCommand('npm run lint');
        this.log('info', 'Linting passed successfully', 'build');
      }

    } catch (error) {
      this.log('error', `Pre-deployment tests failed: ${error}`, 'build');
      throw new Error(`Pre-deployment tests failed: ${error}`);
    }
  }

  /**
   * 🏗️ Build project with optimizations
   */
  private async buildProject(config: DeploymentConfig): Promise<void> {
    this.log('info', 'Building project...', 'build');

    try {
      const buildCommand = config.buildCommand || 'npm run build';
      
      // Set build environment variables
      const buildEnv = {
        ...process.env,
        NODE_ENV: config.environment === 'prod' ? 'production' : config.environment,
        ...config.envVars
      };

      await this.executeCommand(buildCommand, { 
        env: buildEnv,
        timeout: 600000 // 10 minute timeout
      });

      // Verify build output exists
      if (config.outputDir && !fs.existsSync(path.join(this.projectPath, config.outputDir))) {
        throw new Error(`Build output directory not found: ${config.outputDir}`);
      }

      this.log('info', 'Project built successfully', 'build');

    } catch (error) {
      this.log('error', `Build failed: ${error}`, 'build');
      throw new Error(`Build failed: ${error}`);
    }
  }

  /**
   * 🚀 Perform actual deployment
   */
  private async performDeployment(
    target: DeploymentTarget, 
    config: DeploymentConfig, 
    environment: DeploymentEnvironment
  ): Promise<{ url: string; id: string }> {
    this.log('info', `Deploying to ${target}...`, 'deploy');

    switch (target) {
      case 'vercel':
        return await this.deployToVercel(config, environment);
      case 'netlify':
        return await this.deployToNetlify(config, environment);
      case 'railway':
        return await this.deployToRailway(config, environment);
      case 'render':
        return await this.deployToRender(config, environment);
      case 'github-pages':
        return await this.deployToGitHubPages(config, environment);
      default:
        throw new Error(`Deployment target not supported: ${target}`);
    }
  }

  /**
   * ☁️ Deploy to Vercel
   */
  private async deployToVercel(config: DeploymentConfig, environment: DeploymentEnvironment): Promise<{ url: string; id: string }> {
    try {
      // Check if Vercel CLI is available
      await this.executeCommand('vercel --version');

      // Create vercel.json config if needed
      await this.createVercelConfig(config);

      // Deploy command
      const deployCommand = environment === 'prod' ? 'vercel --prod --yes' : 'vercel --yes';
      const output = await this.executeCommand(deployCommand);

      // Extract URL from output
      const urlMatch = output.match(/https:\/\/[^\s]+/);
      const url = urlMatch ? urlMatch[0] : '';

      return {
        url,
        id: `vercel-${Date.now()}`
      };

    } catch (error) {
      throw new Error(`Vercel deployment failed: ${error}`);
    }
  }

  /**
   * 📡 Deploy to Netlify
   */
  private async deployToNetlify(config: DeploymentConfig, environment: DeploymentEnvironment): Promise<{ url: string; id: string }> {
    try {
      // Check if Netlify CLI is available
      await this.executeCommand('netlify --version');

      // Create netlify.toml config if needed
      await this.createNetlifyConfig(config);

      // Deploy command
      const buildDir = config.outputDir || 'dist';
      const deployCommand = environment === 'prod' ? 
        `netlify deploy --prod --dir=${buildDir}` : 
        `netlify deploy --dir=${buildDir}`;
      
      const output = await this.executeCommand(deployCommand);

      // Extract URL from output
      const urlMatch = output.match(/Website URL: (https:\/\/[^\s]+)/);
      const url = urlMatch ? urlMatch[1] : '';

      return {
        url,
        id: `netlify-${Date.now()}`
      };

    } catch (error) {
      throw new Error(`Netlify deployment failed: ${error}`);
    }
  }

  /**
   * 🚂 Deploy to Railway
   */
  private async deployToRailway(config: DeploymentConfig, environment: DeploymentEnvironment): Promise<{ url: string; id: string }> {
    try {
      // Check if Railway CLI is available
      await this.executeCommand('railway version');

      // Login and deploy
      const output = await this.executeCommand('railway up --detach');

      // Extract URL from Railway status
      const statusOutput = await this.executeCommand('railway status');
      const urlMatch = statusOutput.match(/https:\/\/[^\s]+/);
      const url = urlMatch ? urlMatch[0] : '';

      return {
        url,
        id: `railway-${Date.now()}`
      };

    } catch (error) {
      throw new Error(`Railway deployment failed: ${error}`);
    }
  }

  /**
   * 🎨 Deploy to Render
   */
  private async deployToRender(config: DeploymentConfig, environment: DeploymentEnvironment): Promise<{ url: string; id: string }> {
    // Render deployments are typically done via Git integration
    // This would integrate with Render's API
    throw new Error('Render deployment requires API integration (not implemented in this demo)');
  }

  /**
   * 📄 Deploy to GitHub Pages
   */
  private async deployToGitHubPages(config: DeploymentConfig, environment: DeploymentEnvironment): Promise<{ url: string; id: string }> {
    try {
      const buildDir = config.outputDir || 'dist';

      // Use gh-pages package if available
      await this.executeCommand(`npx gh-pages -d ${buildDir}`);

      // Extract GitHub Pages URL
      const packageJson = JSON.parse(fs.readFileSync(path.join(this.projectPath, 'package.json'), 'utf8'));
      const repoUrl = packageJson.repository?.url || '';
      const repoMatch = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/);
      
      if (repoMatch) {
        const [, owner, repo] = repoMatch;
        const url = `https://${owner.toLowerCase()}.github.io/${repo.replace('.git', '')}`;
        return { url, id: `gh-pages-${Date.now()}` };
      }

      return { url: '', id: `gh-pages-${Date.now()}` };

    } catch (error) {
      throw new Error(`GitHub Pages deployment failed: ${error}`);
    }
  }

  /**
   * 🧪 Perform dry run simulation
   */
  private async performDryRun(target: DeploymentTarget, config: DeploymentConfig): Promise<{ url: string; id: string }> {
    this.log('info', `Performing dry run for ${target}...`, 'deploy');

    // Simulate deployment process
    await new Promise(resolve => setTimeout(resolve, 2000));

    const simulatedUrl = `https://preview-${Date.now()}.${target}.app`;
    
    this.log('info', `Dry run completed - would deploy to: ${simulatedUrl}`, 'deploy');

    return {
      url: simulatedUrl,
      id: `dry-run-${Date.now()}`
    };
  }

  /**
   * ✅ Run post-deployment verification
   */
  private async runPostDeploymentVerification(deploymentInfo: { url: string; id: string }): Promise<void> {
    if (!deploymentInfo.url) return;

    this.log('info', 'Running post-deployment verification...', 'health-check');

    try {
      // Wait a bit for deployment to be ready
      await new Promise(resolve => setTimeout(resolve, 5000));

      // Basic health check
      const response = await fetch(deploymentInfo.url);
      if (response.ok) {
        this.log('info', 'Health check passed', 'health-check');
      } else {
        this.log('warn', `Health check returned ${response.status}`, 'health-check');
      }

    } catch (error) {
      this.log('warn', `Health check failed: ${error}`, 'health-check');
    }
  }

  /**
   * 📊 Collect deployment metrics
   */
  private async collectDeploymentMetrics(
    deploymentInfo: { url: string; id: string },
    buildTime: number,
    deployTime: number
  ): Promise<DeploymentMetrics> {
    // Simulate metrics collection
    const buildSize = await this.calculateBuildSize();
    
    return {
      buildSize,
      dependencies: this.countDependencies(),
      bundleSize: Math.round(buildSize * 0.3), // Estimate
      loadTime: 1200, // Simulated
      firstContentfulPaint: 800, // Simulated
      lighthouse: {
        performance: 85,
        accessibility: 90,
        bestPractices: 88,
        seo: 92,
        pwa: 75
      },
      uptime: 100, // Initial
      responseTime: 250 // Simulated
    };
  }

  /**
   * ⚠️ Generate deployment warnings
   */
  private generateWarnings(recommendation: RecommendationResult, metrics: DeploymentMetrics): DeploymentWarning[] {
    const warnings: DeploymentWarning[] = [];

    // Performance warnings
    if (metrics.bundleSize > 5000000) { // 5MB
      warnings.push({
        type: 'performance',
        severity: 'medium',
        message: 'Bundle size is large (>5MB)',
        suggestion: 'Consider code splitting and lazy loading',
        autoFixable: false
      });
    }

    // Lighthouse warnings
    if (metrics.lighthouse.performance < 70) {
      warnings.push({
        type: 'performance',
        severity: 'high',
        message: 'Low Lighthouse performance score',
        suggestion: 'Optimize images and reduce JavaScript bundle size',
        autoFixable: false
      });
    }

    // Configuration warnings
    if (recommendation.primary.cons.length > 2) {
      warnings.push({
        type: 'configuration',
        severity: 'low',
        message: 'Multiple limitations detected for selected target',
        suggestion: 'Consider alternative deployment targets',
        autoFixable: false
      });
    }

    return warnings;
  }

  /**
   * 🛠️ Helper: Execute shell command
   */
  private async executeCommand(
    command: string, 
    options: { 
      env?: NodeJS.ProcessEnv; 
      timeout?: number;
      cwd?: string;
    } = {}
  ): Promise<string> {
    return new Promise((resolve, reject) => {
      const { env = process.env, timeout = 120000, cwd = this.projectPath } = options;

      try {
        const output = execSync(command, {
          encoding: 'utf8',
          env,
          cwd,
          timeout,
          stdio: ['pipe', 'pipe', 'pipe']
        });
        resolve(output);
      } catch (error: any) {
        reject(error.message || error);
      }
    });
  }

  /**
   * 📝 Logging utility
   */
  private log(level: 'info' | 'warn' | 'error' | 'debug', message: string, source: string): void {
    const logEntry: DeploymentLog = {
      timestamp: Date.now(),
      level,
      message,
      source: source as any
    };

    this.logs.push(logEntry);

    // Also log to console if verbose
    const timestamp = new Date().toISOString();
    console.log(`[${timestamp}] ${level.toUpperCase()}: ${message}`);
  }

  // Target-specific configuration creators
  private async createVercelConfig(config: DeploymentConfig): Promise<void> {
    const vercelConfig = {
      name: path.basename(this.projectPath),
      version: 2,
      builds: [
        {
          src: config.outputDir || 'dist',
          use: '@vercel/static'
        }
      ],
      routes: [
        { src: '/(.*)', dest: '/$1' }
      ]
    };

    const configPath = path.join(this.projectPath, 'vercel.json');
    if (!fs.existsSync(configPath)) {
      fs.writeFileSync(configPath, JSON.stringify(vercelConfig, null, 2));
      this.log('info', 'Created vercel.json configuration', 'build');
    }
  }

  private async createNetlifyConfig(config: DeploymentConfig): Promise<void> {
    const netlifyConfig = `
[build]
  publish = "${config.outputDir || 'dist'}"
  command = "${config.buildCommand || 'npm run build'}"

[[redirects]]
  from = "/*"
  to = "/index.html"
  status = 200
`;

    const configPath = path.join(this.projectPath, 'netlify.toml');
    if (!fs.existsSync(configPath)) {
      fs.writeFileSync(configPath, netlifyConfig.trim());
      this.log('info', 'Created netlify.toml configuration', 'build');
    }
  }

  // Validation methods for different targets
  private async validateVercelRequirements(): Promise<void> {
    try {
      await this.executeCommand('vercel --version');
    } catch {
      throw new Error('Vercel CLI not found. Install with: npm install -g vercel');
    }
  }

  private async validateNetlifyRequirements(): Promise<void> {
    try {
      await this.executeCommand('netlify --version');
    } catch {
      throw new Error('Netlify CLI not found. Install with: npm install -g netlify-cli');
    }
  }

  private async validateRailwayRequirements(): Promise<void> {
    try {
      await this.executeCommand('railway version');
    } catch {
      throw new Error('Railway CLI not found. Install from: https://railway.app/cli');
    }
  }

  private async validateRenderRequirements(): Promise<void> {
    // Render typically uses Git-based deployment
    // Check if project is a Git repository
    if (!fs.existsSync(path.join(this.projectPath, '.git'))) {
      throw new Error('Render deployment requires a Git repository');
    }
  }

  // Utility methods
  private async calculateBuildSize(): Promise<number> {
    const buildDir = path.join(this.projectPath, 'dist');
    if (!fs.existsSync(buildDir)) return 0;

    let totalSize = 0;
    const calculateDir = (dir: string) => {
      const files = fs.readdirSync(dir);
      for (const file of files) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        if (stat.isDirectory()) {
          calculateDir(filePath);
        } else {
          totalSize += stat.size;
        }
      }
    };

    try {
      calculateDir(buildDir);
    } catch {
      // Directory doesn't exist or can't be read
    }

    return totalSize;
  }

  private countDependencies(): number {
    try {
      const packageJson = JSON.parse(fs.readFileSync(path.join(this.projectPath, 'package.json'), 'utf8'));
      const deps = Object.keys(packageJson.dependencies || {});
      const devDeps = Object.keys(packageJson.devDependencies || {});
      return deps.length + devDeps.length;
    } catch {
      return 0;
    }
  }

  private getEmptyMetrics(): DeploymentMetrics {
    return {
      buildSize: 0,
      dependencies: 0,
      bundleSize: 0,
      loadTime: 0,
      firstContentfulPaint: 0,
      lighthouse: {
        performance: 0,
        accessibility: 0,
        bestPractices: 0,
        seo: 0,
        pwa: 0
      },
      uptime: 0,
      responseTime: 0
    };
  }

  private generateErrorResolution(error: any): string[] {
    const message = error instanceof Error ? error.message : String(error);
    const resolutions = [];

    if (message.includes('not found')) {
      resolutions.push('Install required CLI tools');
      resolutions.push('Check PATH environment variable');
    }

    if (message.includes('authentication') || message.includes('login')) {
      resolutions.push('Login to deployment platform');
      resolutions.push('Check API keys and credentials');
    }

    if (message.includes('build')) {
      resolutions.push('Check build configuration');
      resolutions.push('Verify all dependencies are installed');
      resolutions.push('Review build logs for specific errors');
    }

    if (resolutions.length === 0) {
      resolutions.push('Check deployment logs for details');
      resolutions.push('Verify project configuration');
      resolutions.push('Try deploying with --verbose flag');
    }

    return resolutions;
  }

  private initializeAnalytics(): DeploymentAnalytics {
    return {
      totalDeployments: 0,
      successRate: 0,
      averageBuildTime: 0,
      averageDeployTime: 0,
      popularTargets: {} as Record<DeploymentTarget, number>,
      errorPatterns: [],
      performanceTrends: [],
      costAnalysis: {
        totalCost: 0,
        costByTarget: {} as Record<DeploymentTarget, number>,
        costTrend: 0,
        recommendations: []
      }
    };
  }

  private updateAnalytics(result: DeploymentResult): void {
    this.analytics.totalDeployments++;
    
    if (result.success) {
      this.analytics.successRate = (this.analytics.successRate * (this.analytics.totalDeployments - 1) + 1) / this.analytics.totalDeployments;
    } else {
      this.analytics.successRate = (this.analytics.successRate * (this.analytics.totalDeployments - 1)) / this.analytics.totalDeployments;
    }

    this.analytics.averageBuildTime = (this.analytics.averageBuildTime * (this.analytics.totalDeployments - 1) + result.buildTime) / this.analytics.totalDeployments;
    this.analytics.averageDeployTime = (this.analytics.averageDeployTime * (this.analytics.totalDeployments - 1) + result.deployTime) / this.analytics.totalDeployments;

    // Update popular targets
    this.analytics.popularTargets[result.target] = (this.analytics.popularTargets[result.target] || 0) + 1;
  }

  /**
   * 📊 Get deployment analytics
   */
  public getAnalytics(): DeploymentAnalytics {
    return { ...this.analytics };
  }

  /**
   * 🔍 Get deployment logs
   */
  public getLogs(): DeploymentLog[] {
    return [...this.logs];
  }

  /**
   * 🧹 Clear logs
   */
  public clearLogs(): void {
    this.logs = [];
  }
}