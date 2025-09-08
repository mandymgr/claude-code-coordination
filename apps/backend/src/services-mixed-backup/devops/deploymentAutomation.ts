import { EventEmitter } from 'events';
import { execSync, spawn, ChildProcess } from 'child_process';
import { promises as fs } from 'fs';
import path from 'path';

export interface DeploymentTarget {
  id: string;
  name: string;
  type: 'production' | 'staging' | 'development' | 'testing' | 'preview';
  provider: 'vercel' | 'netlify' | 'aws' | 'gcp' | 'azure' | 'heroku' | 'digitalocean' | 'docker' | 'kubernetes';
  environment: Record<string, string>;
  configuration: {
    buildCommand?: string;
    deployCommand?: string;
    healthCheckUrl?: string;
    rollbackEnabled: boolean;
    autoScale: boolean;
    resourceLimits?: {
      cpu: string;
      memory: string;
      storage: string;
    };
  };
  hooks: {
    preDeploy?: string[];
    postDeploy?: string[];
    preRollback?: string[];
    postRollback?: string[];
  };
  secrets: Record<string, string>;
  is_active: boolean;
  lastDeployment?: Date;
  deploymentHistory: DeploymentRecord[];
}

export interface DeploymentRecord {
  id: string;
  targetId: string;
  version: string;
  status: 'pending' | 'building' | 'deploying' | 'deployed' | 'failed' | 'rolled_back';
  triggeredBy: 'manual' | 'webhook' | 'schedule' | 'api' | 'ci/cd';
  startTime: Date;
  endTime?: Date;
  duration?: number;
  buildLogs: string[];
  deploymentLogs: string[];
  artifacts: {
    buildOutput?: string;
    deploymentPackage?: string;
    configFiles: string[];
    metrics?: Record<string, any>;
  };
  healthChecks: {
    url: string;
    status: 'passed' | 'failed' | 'pending';
    response?: any;
    timestamp: Date;
  }[];
  rollbackInfo?: {
    canRollback: boolean;
    previousVersion?: string;
    rollbackCommand?: string;
  };
  metadata: {
    commitHash?: string;
    branch?: string;
    author?: string;
    message?: string;
    pullRequestId?: string;
  };
}

export interface DeploymentPipeline {
  id: string;
  name: string;
  repository: string;
  branch: string;
  targets: string[]; // Target IDs in order
  workflow: {
    sequential: boolean;
    parallelGroups?: string[][];
    approvalRequired?: string[]; // Target IDs requiring manual approval
    rollbackTriggers: {
      failureThreshold: number;
      healthCheckFailures: number;
      errorRateThreshold: number;
    };
  };
  triggers: {
    push: boolean;
    pullRequest: boolean;
    schedule?: string; // cron expression
    manual: boolean;
    webhook?: {
      url: string;
      secret: string;
    };
  };
  qualityGates: {
    tests: boolean;
    codeAnalysis: boolean;
    securityScan: boolean;
    performanceBenchmark: boolean;
    approvalWorkflow: boolean;
  };
  notifications: {
    slack?: string;
    email?: string[];
    webhook?: string;
  };
  status: 'idle' | 'running' | 'completed' | 'failed';
  lastRun?: Date;
  metrics: {
    totalDeployments: number;
    successRate: number;
    averageDuration: number;
    failureReasons: Record<string, number>;
  };
}

export interface CICDIntegration {
  id: string;
  provider: 'github-actions' | 'gitlab-ci' | 'jenkins' | 'circleci' | 'azure-devops' | 'travis';
  repository: string;
  configPath: string;
  is_active: boolean;
  workflows: {
    build: string;
    test: string;
    deploy: string;
    rollback: string;
  };
  secrets: Record<string, string>;
  environment: Record<string, string>;
}

export interface InfrastructureMonitoring {
  deploymentId: string;
  metrics: {
    cpu: number;
    memory: number;
    disk: number;
    network: number;
    requests: number;
    errors: number;
    latency: number;
  };
  alerts: {
    level: 'info' | 'warning' | 'error' | 'critical';
    message: string;
    timestamp: Date;
    resolved?: boolean;
  }[];
  healthStatus: 'healthy' | 'degraded' | 'unhealthy';
  lastUpdate: Date;
}

export class DeploymentAutomationService extends EventEmitter {
  private targets: Map<string, DeploymentTarget> = new Map();
  private pipelines: Map<string, DeploymentPipeline> = new Map();
  private activeDeployments: Map<string, DeploymentRecord> = new Map();
  private cicdIntegrations: Map<string, CICDIntegration> = new Map();
  private monitoring: Map<string, InfrastructureMonitoring> = new Map();
  private deploymentProcesses: Map<string, ChildProcess> = new Map();

  constructor() {
    super();
    this.setupDefaultTargets();
    this.startHealthMonitoring();
  }

  private setupDefaultTargets(): void {
    // Default Vercel target
    const vercelTarget: DeploymentTarget = {
      id: 'vercel-production',
      name: 'Vercel Production',
      type: 'production',
      provider: 'vercel',
      environment: {
        NODE_ENV: 'production',
        VERCEL_ENV: 'production'
      },
      configuration: {
        buildCommand: 'npm run build',
        deployCommand: 'vercel --prod',
        healthCheckUrl: 'https://app.krins.dev/health',
        rollbackEnabled: true,
        autoScale: true,
        resourceLimits: {
          cpu: '1000m',
          memory: '1Gi',
          storage: '10Gi'
        }
      },
      hooks: {
        preDeploy: ['npm run test', 'npm run lint'],
        postDeploy: ['npm run notify-deployment'],
        preRollback: ['npm run backup-data'],
        postRollback: ['npm run restore-monitoring']
      },
      secrets: {},
      is_active: true,
      deploymentHistory: []
    };

    // Default Docker/Kubernetes target
    const k8sTarget: DeploymentTarget = {
      id: 'k8s-production',
      name: 'Kubernetes Production',
      type: 'production', 
      provider: 'kubernetes',
      environment: {
        NODE_ENV: 'production',
        KUBE_NAMESPACE: 'claude-coordination'
      },
      configuration: {
        buildCommand: 'docker build -t claude-coordination:latest .',
        deployCommand: 'kubectl apply -f k8s/',
        healthCheckUrl: 'http://claude-coordination.default.svc.cluster.local/health',
        rollbackEnabled: true,
        autoScale: true,
        resourceLimits: {
          cpu: '2000m',
          memory: '4Gi',
          storage: '50Gi'
        }
      },
      hooks: {
        preDeploy: ['kubectl get pods', 'docker system prune -f'],
        postDeploy: ['kubectl rollout status deployment/claude-coordination'],
        preRollback: ['kubectl create backup --namespace=claude-coordination'],
        postRollback: ['kubectl get events --field-selector type=Warning']
      },
      secrets: {},
      is_active: false,
      deploymentHistory: []
    };

    this.targets.set(vercelTarget.id, vercelTarget);
    this.targets.set(k8sTarget.id, k8sTarget);
  }

  private startHealthMonitoring(): void {
    // Monitor active deployments every 30 seconds
    setInterval(async () => {
      for (const [targetId, target] of this.targets) {
        if (target.is_active && target.configuration.healthCheckUrl) {
          await this.performHealthCheck(targetId);
        }
      }
    }, 30000);
  }

  async createTarget(target: Omit<DeploymentTarget, 'id' | 'deploymentHistory'>): Promise<string> {
    const targetId = `target_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const newTarget: DeploymentTarget = {
      ...target,
      id: targetId,
      deploymentHistory: []
    };

    this.targets.set(targetId, newTarget);

    this.emit('targetCreated', {
      targetId,
      timestamp: new Date(),
      target: newTarget
    });

    return targetId;
  }

  async createPipeline(pipeline: Omit<DeploymentPipeline, 'id' | 'metrics'>): Promise<string> {
    const pipelineId = `pipeline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const newPipeline: DeploymentPipeline = {
      ...pipeline,
      id: pipelineId,
      metrics: {
        totalDeployments: 0,
        successRate: 100,
        averageDuration: 0,
        failureReasons: {}
      }
    };

    this.pipelines.set(pipelineId, newPipeline);

    // Setup CI/CD integration if needed
    await this.setupCICDIntegration(newPipeline);

    this.emit('pipelineCreated', {
      pipelineId,
      timestamp: new Date(),
      pipeline: newPipeline
    });

    return pipelineId;
  }

  async triggerDeployment(
    targetId: string,
    options: {
      version?: string;
      branch?: string;
      triggeredBy: DeploymentRecord['triggeredBy'];
      metadata?: DeploymentRecord['metadata'];
      skipQualityGates?: boolean;
    }
  ): Promise<string> {
    const target = this.targets.get(targetId);
    if (!target) {
      throw new Error(`Target ${targetId} not found`);
    }

    if (!target.is_active) {
      throw new Error(`Target ${targetId} is not active`);
    }

    const deploymentId = `deploy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const deployment: DeploymentRecord = {
      id: deploymentId,
      targetId,
      version: options.version || 'latest',
      status: 'pending',
      triggeredBy: options.triggeredBy,
      startTime: new Date(),
      buildLogs: [],
      deploymentLogs: [],
      artifacts: {
        configFiles: []
      },
      healthChecks: [],
      metadata: options.metadata || {}
    };

    this.activeDeployments.set(deploymentId, deployment);
    target.deploymentHistory.unshift(deployment);

    this.emit('deploymentStarted', {
      deploymentId,
      targetId,
      timestamp: new Date(),
      deployment
    });

    // Execute deployment asynchronously
    this.executeDeployment(deployment, target, options.skipQualityGates || false);

    return deploymentId;
  }

  private async executeDeployment(
    deployment: DeploymentRecord,
    target: DeploymentTarget,
    skipQualityGates: boolean
  ): Promise<void> {
    try {
      deployment.status = 'building';
      
      this.emit('deploymentStatusChanged', {
        deploymentId: deployment.id,
        status: deployment.status,
        timestamp: new Date()
      });

      // Run pre-deploy hooks
      if (target.hooks.preDeploy) {
        await this.runHooks(target.hooks.preDeploy, deployment, 'pre-deploy');
      }

      // Quality gates (unless skipped)
      if (!skipQualityGates) {
        await this.runQualityGates(deployment, target);
      }

      // Build phase
      if (target.configuration.buildCommand) {
        await this.runBuildCommand(deployment, target);
      }

      // Deploy phase
      deployment.status = 'deploying';
      this.emit('deploymentStatusChanged', {
        deploymentId: deployment.id,
        status: deployment.status,
        timestamp: new Date()
      });

      if (target.configuration.deployCommand) {
        await this.runDeployCommand(deployment, target);
      }

      // Health check
      if (target.configuration.healthCheckUrl) {
        await this.performHealthCheck(target.id, deployment);
      }

      // Run post-deploy hooks
      if (target.hooks.postDeploy) {
        await this.runHooks(target.hooks.postDeploy, deployment, 'post-deploy');
      }

      // Mark as successful
      deployment.status = 'deployed';
      deployment.endTime = new Date();
      deployment.duration = deployment.endTime.getTime() - deployment.startTime.getTime();

      target.lastDeployment = deployment.endTime;

      this.emit('deploymentCompleted', {
        deploymentId: deployment.id,
        targetId: target.id,
        timestamp: new Date(),
        deployment,
        duration: deployment.duration
      });

      // Setup monitoring
      this.setupDeploymentMonitoring(deployment, target);

    } catch (error) {
      deployment.status = 'failed';
      deployment.endTime = new Date();
      deployment.duration = deployment.endTime.getTime() - deployment.startTime.getTime();

      this.emit('deploymentFailed', {
        deploymentId: deployment.id,
        targetId: target.id,
        timestamp: new Date(),
        deployment,
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      // Attempt rollback if enabled
      if (target.configuration.rollbackEnabled) {
        await this.attemptRollback(deployment, target);
      }
    } finally {
      this.activeDeployments.delete(deployment.id);
    }
  }

  private async runQualityGates(deployment: DeploymentRecord, target: DeploymentTarget): Promise<void> {
    const qualityChecks = [
      { name: 'tests', command: 'npm test' },
      { name: 'lint', command: 'npm run lint' },
      { name: 'security', command: 'npm audit --audit-level high' },
      { name: 'type-check', command: 'npm run type-check' }
    ];

    for (const check of qualityChecks) {
      try {
        const output = execSync(check.command, { 
          encoding: 'utf8',
          timeout: 300000 // 5 minutes
        });
        
        deployment.buildLogs.push(`✅ Quality gate passed: ${check.name}`);
        deployment.buildLogs.push(output);
      } catch (error) {
        deployment.buildLogs.push(`❌ Quality gate failed: ${check.name}`);
        deployment.buildLogs.push(error instanceof Error ? error.message : 'Unknown error');
        throw new Error(`Quality gate failed: ${check.name}`);
      }
    }
  }

  private async runBuildCommand(deployment: DeploymentRecord, target: DeploymentTarget): Promise<void> {
    return new Promise((resolve, reject) => {
      const buildProcess = spawn('bash', ['-c', target.configuration.buildCommand!], {
        env: { ...process.env, ...target.environment },
        stdio: ['ignore', 'pipe', 'pipe']
      });

      this.deploymentProcesses.set(deployment.id, buildProcess);

      buildProcess.stdout?.on('data', (data) => {
        const output = data.toString();
        deployment.buildLogs.push(output);
        
        this.emit('deploymentLog', {
          deploymentId: deployment.id,
          type: 'build',
          log: output,
          timestamp: new Date()
        });
      });

      buildProcess.stderr?.on('data', (data) => {
        const output = data.toString();
        deployment.buildLogs.push(`ERROR: ${output}`);
        
        this.emit('deploymentLog', {
          deploymentId: deployment.id,
          type: 'build_error',
          log: output,
          timestamp: new Date()
        });
      });

      buildProcess.on('close', (code) => {
        this.deploymentProcesses.delete(deployment.id);
        
        if (code === 0) {
          deployment.buildLogs.push('Build completed successfully');
          resolve();
        } else {
          deployment.buildLogs.push(`Build failed with exit code ${code}`);
          reject(new Error(`Build failed with exit code ${code}`));
        }
      });

      buildProcess.on('error', (error) => {
        this.deploymentProcesses.delete(deployment.id);
        deployment.buildLogs.push(`Build process error: ${error.message}`);
        reject(error);
      });
    });
  }

  private async runDeployCommand(deployment: DeploymentRecord, target: DeploymentTarget): Promise<void> {
    return new Promise((resolve, reject) => {
      const deployProcess = spawn('bash', ['-c', target.configuration.deployCommand!], {
        env: { ...process.env, ...target.environment, ...target.secrets },
        stdio: ['ignore', 'pipe', 'pipe']
      });

      this.deploymentProcesses.set(`${deployment.id}-deploy`, deployProcess);

      deployProcess.stdout?.on('data', (data) => {
        const output = data.toString();
        deployment.deploymentLogs.push(output);
        
        this.emit('deploymentLog', {
          deploymentId: deployment.id,
          type: 'deploy',
          log: output,
          timestamp: new Date()
        });
      });

      deployProcess.stderr?.on('data', (data) => {
        const output = data.toString();
        deployment.deploymentLogs.push(`ERROR: ${output}`);
        
        this.emit('deploymentLog', {
          deploymentId: deployment.id,
          type: 'deploy_error',
          log: output,
          timestamp: new Date()
        });
      });

      deployProcess.on('close', (code) => {
        this.deploymentProcesses.delete(`${deployment.id}-deploy`);
        
        if (code === 0) {
          deployment.deploymentLogs.push('Deployment completed successfully');
          resolve();
        } else {
          deployment.deploymentLogs.push(`Deployment failed with exit code ${code}`);
          reject(new Error(`Deployment failed with exit code ${code}`));
        }
      });

      deployProcess.on('error', (error) => {
        this.deploymentProcesses.delete(`${deployment.id}-deploy`);
        deployment.deploymentLogs.push(`Deploy process error: ${error.message}`);
        reject(error);
      });
    });
  }

  private async runHooks(hooks: string[], deployment: DeploymentRecord, phase: string): Promise<void> {
    for (const hook of hooks) {
      try {
        const output = execSync(hook, { 
          encoding: 'utf8',
          timeout: 60000 // 1 minute per hook
        });
        
        deployment.buildLogs.push(`✅ Hook completed (${phase}): ${hook}`);
        deployment.buildLogs.push(output);
      } catch (error) {
        deployment.buildLogs.push(`❌ Hook failed (${phase}): ${hook}`);
        deployment.buildLogs.push(error instanceof Error ? error.message : 'Unknown error');
        throw new Error(`Hook failed (${phase}): ${hook}`);
      }
    }
  }

  private async performHealthCheck(targetId: string, deployment?: DeploymentRecord): Promise<void> {
    const target = this.targets.get(targetId);
    if (!target || !target.configuration.healthCheckUrl) return;

    const healthCheck = {
      url: target.configuration.healthCheckUrl,
      status: 'pending' as const,
      timestamp: new Date()
    };

    try {
      // Simple health check - in production would use proper HTTP client
      const response = await fetch(target.configuration.healthCheckUrl, {
        method: 'GET',
        timeout: 10000 // 10 seconds
      });

      healthCheck.status = response.ok ? 'passed' : 'failed';
      healthCheck.response = {
        status: response.status,
        statusText: response.statusText,
        body: await response.text().catch(() => 'Unable to read response body')
      };

      if (deployment) {
        deployment.healthChecks.push(healthCheck);
      }

      this.emit('healthCheckCompleted', {
        targetId,
        deploymentId: deployment?.id,
        healthCheck,
        timestamp: new Date()
      });

    } catch (error) {
      healthCheck.status = 'failed';
      healthCheck.response = {
        error: error instanceof Error ? error.message : 'Unknown error'
      };

      if (deployment) {
        deployment.healthChecks.push(healthCheck);
      }

      this.emit('healthCheckFailed', {
        targetId,
        deploymentId: deployment?.id,
        healthCheck,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date()
      });
    }
  }

  private async attemptRollback(deployment: DeploymentRecord, target: DeploymentTarget): Promise<void> {
    const previousDeployment = target.deploymentHistory
      .filter(d => d.status === 'deployed' && d.id !== deployment.id)[0];

    if (!previousDeployment) {
      deployment.deploymentLogs.push('❌ No previous successful deployment found for rollback');
      return;
    }

    try {
      deployment.deploymentLogs.push(`🔄 Attempting rollback to version ${previousDeployment.version}`);

      // Run pre-rollback hooks
      if (target.hooks.preRollback) {
        await this.runHooks(target.hooks.preRollback, deployment, 'pre-rollback');
      }

      // Execute rollback command (if specified) or redeploy previous version
      const rollbackCommand = deployment.rollbackInfo?.rollbackCommand || 
        target.configuration.deployCommand?.replace('--prod', `--prod --rollback=${previousDeployment.version}`);

      if (rollbackCommand) {
        await this.runRollbackCommand(deployment, target, rollbackCommand);
      }

      // Run post-rollback hooks
      if (target.hooks.postRollback) {
        await this.runHooks(target.hooks.postRollback, deployment, 'post-rollback');
      }

      deployment.status = 'rolled_back';
      deployment.rollbackInfo = {
        canRollback: false,
        previousVersion: previousDeployment.version
      };

      deployment.deploymentLogs.push(`✅ Successfully rolled back to version ${previousDeployment.version}`);

      this.emit('deploymentRolledBack', {
        deploymentId: deployment.id,
        targetId: target.id,
        previousVersion: previousDeployment.version,
        timestamp: new Date()
      });

    } catch (error) {
      deployment.deploymentLogs.push(`❌ Rollback failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      
      this.emit('rollbackFailed', {
        deploymentId: deployment.id,
        targetId: target.id,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date()
      });
    }
  }

  private async runRollbackCommand(deployment: DeploymentRecord, target: DeploymentTarget, command: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const rollbackProcess = spawn('bash', ['-c', command], {
        env: { ...process.env, ...target.environment, ...target.secrets },
        stdio: ['ignore', 'pipe', 'pipe']
      });

      rollbackProcess.stdout?.on('data', (data) => {
        const output = data.toString();
        deployment.deploymentLogs.push(output);
      });

      rollbackProcess.stderr?.on('data', (data) => {
        const output = data.toString();
        deployment.deploymentLogs.push(`ERROR: ${output}`);
      });

      rollbackProcess.on('close', (code) => {
        if (code === 0) {
          resolve();
        } else {
          reject(new Error(`Rollback failed with exit code ${code}`));
        }
      });

      rollbackProcess.on('error', (error) => {
        reject(error);
      });
    });
  }

  private async setupCICDIntegration(pipeline: DeploymentPipeline): Promise<void> {
    // Generate GitHub Actions workflow
    if (pipeline.repository.includes('github.com')) {
      await this.generateGitHubActionsWorkflow(pipeline);
    }
    
    // Other CI/CD integrations can be added here
  }

  private async generateGitHubActionsWorkflow(pipeline: DeploymentPipeline): Promise<void> {
    const workflow = {
      name: `Deploy ${pipeline.name}`,
      on: {
        ...(pipeline.triggers.push && { push: { branches: [pipeline.branch] } }),
        ...(pipeline.triggers.pullRequest && { pull_request: { branches: [pipeline.branch] } }),
        ...(pipeline.triggers.schedule && { schedule: [{ cron: pipeline.triggers.schedule }] }),
        ...(pipeline.triggers.manual && { workflow_dispatch: {} })
      },
      jobs: {
        deploy: {
          'runs-on': 'ubuntu-latest',
          steps: [
            { uses: 'actions/checkout@v3' },
            {
              name: 'Setup Node.js',
              uses: 'actions/setup-node@v3',
              with: { 'node-version': '18' }
            },
            {
              name: 'Install dependencies',
              run: 'npm ci'
            }
          ]
        }
      }
    };

    // Add quality gates
    if (pipeline.qualityGates.tests) {
      workflow.jobs.deploy.steps.push({
        name: 'Run tests',
        run: 'npm test'
      });
    }

    if (pipeline.qualityGates.codeAnalysis) {
      workflow.jobs.deploy.steps.push({
        name: 'Run linting',
        run: 'npm run lint'
      });
    }

    // Add deployment steps for each target
    for (const targetId of pipeline.targets) {
      const target = this.targets.get(targetId);
      if (target) {
        workflow.jobs.deploy.steps.push({
          name: `Deploy to ${target.name}`,
          run: target.configuration.deployCommand || 'echo "No deploy command configured"',
          env: target.environment
        });
      }
    }

    // Save workflow file (in production, would commit to repository)
    const workflowPath = path.join(process.cwd(), '.github/workflows', `deploy-${pipeline.name.toLowerCase().replace(/\s+/g, '-')}.yml`);
    await fs.mkdir(path.dirname(workflowPath), { recursive: true });
    await fs.writeFile(workflowPath, JSON.stringify(workflow, null, 2));

    console.log(`Generated GitHub Actions workflow: ${workflowPath}`);
  }

  private setupDeploymentMonitoring(deployment: DeploymentRecord, target: DeploymentTarget): void {
    const monitoring: InfrastructureMonitoring = {
      deploymentId: deployment.id,
      metrics: {
        cpu: 0,
        memory: 0,
        disk: 0,
        network: 0,
        requests: 0,
        errors: 0,
        latency: 0
      },
      alerts: [],
      healthStatus: 'healthy',
      lastUpdate: new Date()
    };

    this.monitoring.set(deployment.id, monitoring);

    // Start monitoring process (simplified)
    const monitoringInterval = setInterval(async () => {
      // Simulate metric collection
      monitoring.metrics = {
        cpu: Math.random() * 100,
        memory: Math.random() * 100,
        disk: Math.random() * 100,
        network: Math.random() * 1000,
        requests: Math.floor(Math.random() * 1000),
        errors: Math.floor(Math.random() * 10),
        latency: Math.random() * 500
      };
      
      monitoring.lastUpdate = new Date();

      // Check for alerts
      if (monitoring.metrics.cpu > 90) {
        monitoring.alerts.push({
          level: 'critical',
          message: `High CPU usage: ${monitoring.metrics.cpu.toFixed(1)}%`,
          timestamp: new Date()
        });
        monitoring.healthStatus = 'unhealthy';
      } else if (monitoring.metrics.cpu > 75) {
        monitoring.alerts.push({
          level: 'warning',
          message: `Elevated CPU usage: ${monitoring.metrics.cpu.toFixed(1)}%`,
          timestamp: new Date()
        });
        monitoring.healthStatus = 'degraded';
      } else {
        monitoring.healthStatus = 'healthy';
      }

      this.emit('monitoringUpdate', {
        deploymentId: deployment.id,
        metrics: monitoring.metrics,
        healthStatus: monitoring.healthStatus,
        timestamp: new Date()
      });

    }, 60000); // Update every minute

    // Store interval for cleanup
    setTimeout(() => {
      clearInterval(monitoringInterval);
      this.monitoring.delete(deployment.id);
    }, 24 * 60 * 60 * 1000); // Clean up after 24 hours
  }

  // Public API methods

  async getTargets(): Promise<DeploymentTarget[]> {
    return Array.from(this.targets.values());
  }

  async getTarget(targetId: string): Promise<DeploymentTarget | null> {
    return this.targets.get(targetId) || null;
  }

  async getPipelines(): Promise<DeploymentPipeline[]> {
    return Array.from(this.pipelines.values());
  }

  async getPipeline(pipelineId: string): Promise<DeploymentPipeline | null> {
    return this.pipelines.get(pipelineId) || null;
  }

  async getDeploymentHistory(targetId: string, limit = 50): Promise<DeploymentRecord[]> {
    const target = this.targets.get(targetId);
    return target ? target.deploymentHistory.slice(0, limit) : [];
  }

  async getDeployment(deploymentId: string): Promise<DeploymentRecord | null> {
    // Check active deployments first
    const active = this.activeDeployments.get(deploymentId);
    if (active) return active;

    // Search in target histories
    for (const target of this.targets.values()) {
      const deployment = target.deploymentHistory.find(d => d.id === deploymentId);
      if (deployment) return deployment;
    }

    return null;
  }

  async cancelDeployment(deploymentId: string): Promise<boolean> {
    const deployment = this.activeDeployments.get(deploymentId);
    if (!deployment) return false;

    // Kill associated processes
    const buildProcess = this.deploymentProcesses.get(deploymentId);
    const deployProcess = this.deploymentProcesses.get(`${deploymentId}-deploy`);
    
    if (buildProcess) {
      buildProcess.kill('SIGTERM');
      this.deploymentProcesses.delete(deploymentId);
    }
    
    if (deployProcess) {
      deployProcess.kill('SIGTERM');
      this.deploymentProcesses.delete(`${deploymentId}-deploy`);
    }

    // Update status
    deployment.status = 'failed';
    deployment.endTime = new Date();
    deployment.deploymentLogs.push('Deployment cancelled by user');

    this.activeDeployments.delete(deploymentId);

    this.emit('deploymentCancelled', {
      deploymentId,
      timestamp: new Date(),
      deployment
    });

    return true;
  }

  async rollbackDeployment(deploymentId: string): Promise<boolean> {
    const deployment = await this.getDeployment(deploymentId);
    if (!deployment) return false;

    const target = this.targets.get(deployment.targetId);
    if (!target) return false;

    await this.attemptRollback(deployment, target);
    return true;
  }

  getMetrics(): {
    totalTargets: number;
    activeTargets: number;
    totalPipelines: number;
    activeDeployments: number;
    totalDeployments: number;
    successRate: number;
  } {
    const totalDeployments = Array.from(this.targets.values())
      .reduce((sum, target) => sum + target.deploymentHistory.length, 0);
    
    const successfulDeployments = Array.from(this.targets.values())
      .reduce((sum, target) => sum + target.deploymentHistory.filter(d => d.status === 'deployed').length, 0);

    return {
      totalTargets: this.targets.size,
      activeTargets: Array.from(this.targets.values()).filter(t => t.is_active).length,
      totalPipelines: this.pipelines.size,
      activeDeployments: this.activeDeployments.size,
      totalDeployments,
      successRate: totalDeployments > 0 ? (successfulDeployments / totalDeployments) * 100 : 100
    };
  }
}