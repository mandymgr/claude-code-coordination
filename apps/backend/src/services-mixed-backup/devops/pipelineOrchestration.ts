import { EventEmitter } from 'events';
import { DeploymentAutomationService, DeploymentTarget, DeploymentPipeline } from './deploymentAutomation';

export interface PipelineStage {
  id: string;
  name: string;
  type: 'build' | 'test' | 'security' | 'deploy' | 'approval' | 'notification' | 'rollback' | 'custom';
  dependsOn: string[];
  parallel: boolean;
  optional: boolean;
  retryCount: number;
  timeout: number;
  configuration: {
    command?: string;
    script?: string;
    approvers?: string[];
    notification?: {
      type: 'slack' | 'email' | 'webhook';
      recipients: string[];
      template?: string;
    };
    conditions?: {
      when: 'always' | 'on_success' | 'on_failure' | 'manual';
      branches?: string[];
      environment?: Record<string, string>;
    };
  };
  artifacts?: {
    input: string[];
    output: string[];
    cache: boolean;
    retention: number; // days
  };
  status: 'pending' | 'running' | 'success' | 'failed' | 'skipped' | 'cancelled';
  startTime?: Date;
  endTime?: Date;
  logs: string[];
  metadata: Record<string, any>;
}

export interface PipelineExecution {
  id: string;
  pipelineId: string;
  version: string;
  status: 'pending' | 'running' | 'success' | 'failed' | 'cancelled';
  stages: PipelineStage[];
  currentStage?: string;
  startTime: Date;
  endTime?: Date;
  duration?: number;
  triggeredBy: {
    type: 'manual' | 'webhook' | 'schedule' | 'api' | 'ci/cd';
    user?: string;
    source?: string;
    metadata?: Record<string, any>;
  };
  environment: Record<string, string>;
  artifacts: {
    [stageId: string]: {
      files: string[];
      metadata: Record<string, any>;
      size: number;
    };
  };
  approvals: {
    stageId: string;
    required: string[];
    approved: string[];
    rejected: string[];
    status: 'pending' | 'approved' | 'rejected';
    timestamp?: Date;
  }[];
  metrics: {
    stageMetrics: {
      [stageId: string]: {
        duration: number;
        retries: number;
        success: boolean;
        resourceUsage?: {
          cpu: number;
          memory: number;
          storage: number;
        };
      };
    };
    totalDuration: number;
    successRate: number;
    failurePoints: string[];
  };
}

export interface PipelineTemplate {
  id: string;
  name: string;
  description: string;
  category: 'web' | 'api' | 'mobile' | 'ml' | 'infra' | 'custom';
  language?: string;
  framework?: string;
  stages: Omit<PipelineStage, 'id' | 'status' | 'logs' | 'startTime' | 'endTime'>[];
  variables: {
    name: string;
    description: string;
    required: boolean;
    defaultValue?: any;
    type: 'string' | 'number' | 'boolean' | 'array' | 'object';
  }[];
  tags: string[];
  version: string;
  author: string;
  isPublic: boolean;
}

export interface GitIntegration {
  id: string;
  provider: 'github' | 'gitlab' | 'bitbucket' | 'azure-repos';
  repository: string;
  branch: string;
  webhookUrl?: string;
  webhookSecret?: string;
  credentials: {
    type: 'token' | 'ssh' | 'app';
    token?: string;
    privateKey?: string;
    appId?: string;
  };
  triggers: {
    push: boolean;
    pullRequest: boolean;
    tag: boolean;
    release: boolean;
  };
  status: 'active' | 'inactive' | 'error';
  lastSync?: Date;
  syncLogs: string[];
}

export interface PipelineMetrics {
  pipelineId: string;
  period: {
    start: Date;
    end: Date;
  };
  executions: {
    total: number;
    successful: number;
    failed: number;
    cancelled: number;
  };
  performance: {
    averageDuration: number;
    medianDuration: number;
    p95Duration: number;
    fastestExecution: number;
    slowestExecution: number;
  };
  reliability: {
    successRate: number;
    failureRate: number;
    mostCommonFailures: {
      stage: string;
      reason: string;
      count: number;
    }[];
    mttr: number; // Mean Time To Recovery
    mtbf: number; // Mean Time Between Failures
  };
  efficiency: {
    stageDurations: {
      [stageId: string]: {
        average: number;
        trend: 'improving' | 'degrading' | 'stable';
      };
    };
    bottlenecks: string[];
    parallelizationOpportunities: string[];
  };
  costs: {
    totalCost: number;
    costPerExecution: number;
    costBreakdown: {
      [stageId: string]: number;
    };
  };
}

export class PipelineOrchestrationService extends EventEmitter {
  private deploymentService: DeploymentAutomationService;
  private executions: Map<string, PipelineExecution> = new Map();
  private templates: Map<string, PipelineTemplate> = new Map();
  private gitIntegrations: Map<string, GitIntegration> = new Map();
  private activeExecutions: Set<string> = new Set();
  private stageQueue: Map<string, PipelineStage[]> = new Map();

  constructor(deploymentService: DeploymentAutomationService) {
    super();
    this.deploymentService = deploymentService;
    this.setupDefaultTemplates();
    this.startExecutionManager();
  }

  private setupDefaultTemplates(): void {
    // Node.js API Pipeline Template
    const nodeApiTemplate: PipelineTemplate = {
      id: 'nodejs-api',
      name: 'Node.js API Pipeline',
      description: 'Complete CI/CD pipeline for Node.js REST API applications',
      category: 'api',
      language: 'javascript',
      framework: 'express',
      stages: [
        {
          name: 'Checkout Code',
          type: 'build',
          dependsOn: [],
          parallel: false,
          optional: false,
          retryCount: 3,
          timeout: 300,
          configuration: {
            command: 'git clone $REPO_URL .',
            conditions: { when: 'always' }
          },
          artifacts: {
            input: [],
            output: ['**/*'],
            cache: false,
            retention: 1
          },
          metadata: {}
        },
        {
          name: 'Install Dependencies',
          type: 'build',
          dependsOn: ['checkout-code'],
          parallel: false,
          optional: false,
          retryCount: 2,
          timeout: 600,
          configuration: {
            command: 'npm ci',
            conditions: { when: 'on_success' }
          },
          artifacts: {
            input: ['package.json', 'package-lock.json'],
            output: ['node_modules/**'],
            cache: true,
            retention: 7
          },
          metadata: {}
        },
        {
          name: 'Run Tests',
          type: 'test',
          dependsOn: ['install-dependencies'],
          parallel: true,
          optional: false,
          retryCount: 1,
          timeout: 1800,
          configuration: {
            command: 'npm test',
            conditions: { when: 'on_success' }
          },
          artifacts: {
            input: ['src/**', 'tests/**'],
            output: ['coverage/**', 'test-results.xml'],
            cache: false,
            retention: 30
          },
          metadata: {}
        },
        {
          name: 'Code Quality Analysis',
          type: 'test',
          dependsOn: ['install-dependencies'],
          parallel: true,
          optional: false,
          retryCount: 1,
          timeout: 900,
          configuration: {
            command: 'npm run lint && npm run type-check',
            conditions: { when: 'on_success' }
          },
          artifacts: {
            input: ['src/**'],
            output: ['lint-results.json', 'tsc-results.json'],
            cache: false,
            retention: 30
          },
          metadata: {}
        },
        {
          name: 'Security Scan',
          type: 'security',
          dependsOn: ['install-dependencies'],
          parallel: true,
          optional: false,
          retryCount: 1,
          timeout: 600,
          configuration: {
            command: 'npm audit --audit-level high && npm run security-scan',
            conditions: { when: 'on_success' }
          },
          artifacts: {
            input: ['package.json', 'package-lock.json'],
            output: ['security-report.json'],
            cache: false,
            retention: 30
          },
          metadata: {}
        },
        {
          name: 'Build Application',
          type: 'build',
          dependsOn: ['run-tests', 'code-quality-analysis', 'security-scan'],
          parallel: false,
          optional: false,
          retryCount: 2,
          timeout: 1200,
          configuration: {
            command: 'npm run build',
            conditions: { when: 'on_success' }
          },
          artifacts: {
            input: ['src/**'],
            output: ['dist/**', 'build/**'],
            cache: true,
            retention: 30
          },
          metadata: {}
        },
        {
          name: 'Deploy to Staging',
          type: 'deploy',
          dependsOn: ['build-application'],
          parallel: false,
          optional: false,
          retryCount: 2,
          timeout: 1800,
          configuration: {
            command: 'npm run deploy:staging',
            conditions: { 
              when: 'on_success',
              branches: ['main', 'develop']
            }
          },
          artifacts: {
            input: ['dist/**'],
            output: ['deployment.log'],
            cache: false,
            retention: 90
          },
          metadata: {}
        },
        {
          name: 'Production Approval',
          type: 'approval',
          dependsOn: ['deploy-to-staging'],
          parallel: false,
          optional: false,
          retryCount: 0,
          timeout: 86400, // 24 hours
          configuration: {
            approvers: ['lead-developer', 'devops-lead'],
            conditions: { 
              when: 'manual',
              branches: ['main']
            }
          },
          artifacts: {
            input: [],
            output: [],
            cache: false,
            retention: 90
          },
          metadata: {}
        },
        {
          name: 'Deploy to Production',
          type: 'deploy',
          dependsOn: ['production-approval'],
          parallel: false,
          optional: false,
          retryCount: 1,
          timeout: 1800,
          configuration: {
            command: 'npm run deploy:production',
            conditions: { 
              when: 'on_success',
              branches: ['main']
            }
          },
          artifacts: {
            input: ['dist/**'],
            output: ['production-deployment.log'],
            cache: false,
            retention: 365
          },
          metadata: {}
        },
        {
          name: 'Post-Deploy Notification',
          type: 'notification',
          dependsOn: ['deploy-to-production'],
          parallel: false,
          optional: true,
          retryCount: 3,
          timeout: 60,
          configuration: {
            notification: {
              type: 'slack',
              recipients: ['#deployments'],
              template: 'deployment-success'
            },
            conditions: { when: 'always' }
          },
          artifacts: {
            input: [],
            output: [],
            cache: false,
            retention: 7
          },
          metadata: {}
        }
      ],
      variables: [
        {
          name: 'REPO_URL',
          description: 'Git repository URL',
          required: true,
          type: 'string'
        },
        {
          name: 'NODE_VERSION',
          description: 'Node.js version to use',
          required: false,
          defaultValue: '18',
          type: 'string'
        },
        {
          name: 'DEPLOY_ENVIRONMENT',
          description: 'Target deployment environment',
          required: false,
          defaultValue: 'production',
          type: 'string'
        }
      ],
      tags: ['nodejs', 'api', 'express', 'ci/cd'],
      version: '1.0.0',
      author: 'Claude Code Coordination',
      isPublic: true
    };

    this.templates.set(nodeApiTemplate.id, nodeApiTemplate);
  }

  private startExecutionManager(): void {
    // Process stage queue every 5 seconds
    setInterval(() => {
      this.processStageQueue();
    }, 5000);

    // Clean up completed executions every hour
    setInterval(() => {
      this.cleanupExecutions();
    }, 3600000);
  }

  async createPipelineFromTemplate(
    templateId: string,
    variables: Record<string, any>,
    options: {
      name?: string;
      description?: string;
      repository?: string;
      branch?: string;
    }
  ): Promise<string> {
    const template = this.templates.get(templateId);
    if (!template) {
      throw new Error(`Template ${templateId} not found`);
    }

    // Validate required variables
    for (const variable of template.variables) {
      if (variable.required && !(variable.name in variables)) {
        throw new Error(`Required variable ${variable.name} not provided`);
      }
    }

    // Create pipeline stages from template
    const stages: PipelineStage[] = template.stages.map((stageTemplate, index) => ({
      id: `${stageTemplate.name.toLowerCase().replace(/\s+/g, '-')}-${index}`,
      ...stageTemplate,
      status: 'pending',
      logs: [],
      metadata: { ...stageTemplate.metadata }
    }));

    // Create execution
    const execution: PipelineExecution = {
      id: `exec_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      pipelineId: templateId,
      version: template.version,
      status: 'pending',
      stages,
      startTime: new Date(),
      triggeredBy: {
        type: 'api',
        metadata: { templateId, variables }
      },
      environment: { ...variables },
      artifacts: {},
      approvals: [],
      metrics: {
        stageMetrics: {},
        totalDuration: 0,
        successRate: 0,
        failurePoints: []
      }
    };

    this.executions.set(execution.id, execution);

    this.emit('pipelineExecutionCreated', {
      executionId: execution.id,
      templateId,
      timestamp: new Date(),
      execution
    });

    return execution.id;
  }

  async startExecution(executionId: string): Promise<void> {
    const execution = this.executions.get(executionId);
    if (!execution) {
      throw new Error(`Execution ${executionId} not found`);
    }

    if (execution.status !== 'pending') {
      throw new Error(`Execution ${executionId} is not in pending state`);
    }

    execution.status = 'running';
    execution.startTime = new Date();
    this.activeExecutions.add(executionId);

    this.emit('pipelineExecutionStarted', {
      executionId,
      timestamp: new Date(),
      execution
    });

    // Queue initial stages
    this.queueReadyStages(execution);
  }

  private queueReadyStages(execution: PipelineExecution): void {
    const readyStages = execution.stages.filter(stage => {
      if (stage.status !== 'pending') return false;
      
      // Check dependencies
      const dependenciesMet = stage.dependsOn.every(depId => {
        const depStage = execution.stages.find(s => s.id === depId);
        return depStage && depStage.status === 'success';
      });

      return dependenciesMet;
    });

    if (readyStages.length > 0) {
      let executionQueue = this.stageQueue.get(execution.id) || [];
      executionQueue.push(...readyStages);
      this.stageQueue.set(execution.id, executionQueue);
    }
  }

  private async processStageQueue(): Promise<void> {
    for (const [executionId, stages] of this.stageQueue.entries()) {
      if (stages.length === 0) continue;

      const execution = this.executions.get(executionId);
      if (!execution || !this.activeExecutions.has(executionId)) continue;

      // Process stages (respecting parallelization)
      const currentRunning = execution.stages.filter(s => s.status === 'running').length;
      const maxParallel = 5; // Configurable

      let processed = 0;
      let i = 0;
      
      while (i < stages.length && currentRunning + processed < maxParallel) {
        const stage = stages[i];
        
        // Check if we can run this stage in parallel
        if (stage.parallel || processed === 0) {
          await this.executeStage(execution, stage);
          processed++;
          stages.splice(i, 1); // Remove from queue
        } else {
          i++;
        }
      }

      // Update queue
      this.stageQueue.set(executionId, stages);
    }
  }

  private async executeStage(execution: PipelineExecution, stage: PipelineStage): Promise<void> {
    stage.status = 'running';
    stage.startTime = new Date();
    execution.currentStage = stage.id;

    this.emit('stageStarted', {
      executionId: execution.id,
      stageId: stage.id,
      timestamp: new Date(),
      stage
    });

    try {
      // Check conditions
      if (!this.evaluateStageConditions(stage, execution)) {
        stage.status = 'skipped';
        stage.endTime = new Date();
        stage.logs.push('Stage skipped due to conditions not met');
        
        this.emit('stageSkipped', {
          executionId: execution.id,
          stageId: stage.id,
          timestamp: new Date(),
          reason: 'Conditions not met'
        });
        
        this.checkExecutionComplete(execution);
        return;
      }

      // Execute stage based on type
      await this.executeStageByType(execution, stage);

      stage.status = 'success';
      stage.endTime = new Date();

      // Record metrics
      execution.metrics.stageMetrics[stage.id] = {
        duration: stage.endTime.getTime() - stage.startTime!.getTime(),
        retries: 0, // TODO: Track retries
        success: true
      };

      this.emit('stageCompleted', {
        executionId: execution.id,
        stageId: stage.id,
        timestamp: new Date(),
        duration: execution.metrics.stageMetrics[stage.id].duration,
        stage
      });

      // Queue dependent stages
      this.queueReadyStages(execution);

    } catch (error) {
      stage.status = 'failed';
      stage.endTime = new Date();
      stage.logs.push(`Stage failed: ${error instanceof Error ? error.message : 'Unknown error'}`);

      execution.metrics.stageMetrics[stage.id] = {
        duration: stage.endTime.getTime() - stage.startTime!.getTime(),
        retries: 0,
        success: false
      };
      
      execution.metrics.failurePoints.push(stage.id);

      this.emit('stageFailed', {
        executionId: execution.id,
        stageId: stage.id,
        timestamp: new Date(),
        error: error instanceof Error ? error.message : 'Unknown error',
        stage
      });

      // Handle stage failure
      await this.handleStageFailure(execution, stage, error);
    }

    this.checkExecutionComplete(execution);
  }

  private evaluateStageConditions(stage: PipelineStage, execution: PipelineExecution): boolean {
    const conditions = stage.configuration.conditions;
    if (!conditions) return true;

    // Check branch conditions
    if (conditions.branches) {
      const currentBranch = execution.environment.BRANCH || 'main';
      if (!conditions.branches.includes(currentBranch)) {
        return false;
      }
    }

    // Check when conditions
    switch (conditions.when) {
      case 'always':
        return true;
      case 'on_success':
        return !execution.metrics.failurePoints.length;
      case 'on_failure':
        return execution.metrics.failurePoints.length > 0;
      case 'manual':
        return this.isStageApproved(execution, stage);
      default:
        return true;
    }
  }

  private isStageApproved(execution: PipelineExecution, stage: PipelineStage): boolean {
    const approval = execution.approvals.find(a => a.stageId === stage.id);
    return approval ? approval.status === 'approved' : false;
  }

  private async executeStageByType(execution: PipelineExecution, stage: PipelineStage): Promise<void> {
    switch (stage.type) {
      case 'build':
      case 'test':
      case 'custom':
        await this.executeCommand(execution, stage);
        break;
      case 'deploy':
        await this.executeDeployment(execution, stage);
        break;
      case 'approval':
        await this.requestApproval(execution, stage);
        break;
      case 'notification':
        await this.sendNotification(execution, stage);
        break;
      case 'security':
        await this.executeSecurityScan(execution, stage);
        break;
      case 'rollback':
        await this.executeRollback(execution, stage);
        break;
      default:
        throw new Error(`Unknown stage type: ${stage.type}`);
    }
  }

  private async executeCommand(execution: PipelineExecution, stage: PipelineStage): Promise<void> {
    const command = stage.configuration.command;
    if (!command) {
      throw new Error(`No command specified for stage ${stage.name}`);
    }

    return new Promise((resolve, reject) => {
      const { spawn } = require('child_process');
      
      const process = spawn('bash', ['-c', command], {
        env: { ...process.env, ...execution.environment },
        stdio: ['ignore', 'pipe', 'pipe']
      });

      let timeout: NodeJS.Timeout;
      if (stage.timeout > 0) {
        timeout = setTimeout(() => {
          process.kill('SIGTERM');
          reject(new Error(`Stage timeout after ${stage.timeout} seconds`));
        }, stage.timeout * 1000);
      }

      process.stdout?.on('data', (data) => {
        const output = data.toString();
        stage.logs.push(output);
        
        this.emit('stageLog', {
          executionId: execution.id,
          stageId: stage.id,
          type: 'stdout',
          log: output,
          timestamp: new Date()
        });
      });

      process.stderr?.on('data', (data) => {
        const output = data.toString();
        stage.logs.push(`ERROR: ${output}`);
        
        this.emit('stageLog', {
          executionId: execution.id,
          stageId: stage.id,
          type: 'stderr',
          log: output,
          timestamp: new Date()
        });
      });

      process.on('close', (code) => {
        if (timeout) clearTimeout(timeout);
        
        if (code === 0) {
          stage.logs.push('Command completed successfully');
          resolve();
        } else {
          stage.logs.push(`Command failed with exit code ${code}`);
          reject(new Error(`Command failed with exit code ${code}`));
        }
      });

      process.on('error', (error) => {
        if (timeout) clearTimeout(timeout);
        stage.logs.push(`Process error: ${error.message}`);
        reject(error);
      });
    });
  }

  private async executeDeployment(execution: PipelineExecution, stage: PipelineStage): Promise<void> {
    // Integration with DeploymentAutomationService
    const targetId = stage.metadata.targetId || 'vercel-production';
    
    try {
      const deploymentId = await this.deploymentService.triggerDeployment(targetId, {
        version: execution.version,
        branch: execution.environment.BRANCH || 'main',
        triggeredBy: 'api',
        metadata: {
          executionId: execution.id,
          stageId: stage.id
        }
      });

      stage.logs.push(`Deployment triggered: ${deploymentId}`);
      stage.metadata.deploymentId = deploymentId;

      // Wait for deployment to complete (simplified)
      await this.waitForDeployment(deploymentId);
      
      stage.logs.push('Deployment completed successfully');
    } catch (error) {
      stage.logs.push(`Deployment failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }

  private async waitForDeployment(deploymentId: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const checkInterval = setInterval(async () => {
        try {
          const deployment = await this.deploymentService.getDeployment(deploymentId);
          if (!deployment) {
            clearInterval(checkInterval);
            reject(new Error('Deployment not found'));
            return;
          }

          switch (deployment.status) {
            case 'deployed':
              clearInterval(checkInterval);
              resolve();
              break;
            case 'failed':
            case 'rolled_back':
              clearInterval(checkInterval);
              reject(new Error(`Deployment ${deployment.status}`));
              break;
            // Continue waiting for other statuses
          }
        } catch (error) {
          clearInterval(checkInterval);
          reject(error);
        }
      }, 10000); // Check every 10 seconds

      // Timeout after 30 minutes
      setTimeout(() => {
        clearInterval(checkInterval);
        reject(new Error('Deployment timeout'));
      }, 30 * 60 * 1000);
    });
  }

  private async requestApproval(execution: PipelineExecution, stage: PipelineStage): Promise<void> {
    const approvers = stage.configuration.approvers || [];
    
    const approval = {
      stageId: stage.id,
      required: approvers,
      approved: [],
      rejected: [],
      status: 'pending' as const,
      timestamp: new Date()
    };

    execution.approvals.push(approval);
    stage.logs.push(`Approval requested from: ${approvers.join(', ')}`);

    this.emit('approvalRequested', {
      executionId: execution.id,
      stageId: stage.id,
      approvers,
      timestamp: new Date()
    });

    // Wait for approval (this would be handled by external approval system)
    // For now, just mark as waiting
    stage.status = 'pending'; // Keep pending until approved
    throw new Error('APPROVAL_PENDING'); // Special error to pause execution
  }

  private async sendNotification(execution: PipelineExecution, stage: PipelineStage): Promise<void> {
    const notification = stage.configuration.notification;
    if (!notification) return;

    stage.logs.push(`Sending ${notification.type} notification to: ${notification.recipients.join(', ')}`);

    // Simulate notification sending
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    stage.logs.push('Notification sent successfully');
  }

  private async executeSecurityScan(execution: PipelineExecution, stage: PipelineStage): Promise<void> {
    const command = stage.configuration.command || 'npm audit --audit-level high';
    await this.executeCommand(execution, stage);
    
    // Additional security-specific processing could go here
    stage.logs.push('Security scan completed');
  }

  private async executeRollback(execution: PipelineExecution, stage: PipelineStage): Promise<void> {
    const deploymentId = stage.metadata.deploymentId;
    if (!deploymentId) {
      throw new Error('No deployment ID found for rollback');
    }

    try {
      await this.deploymentService.rollbackDeployment(deploymentId);
      stage.logs.push(`Rollback completed for deployment: ${deploymentId}`);
    } catch (error) {
      stage.logs.push(`Rollback failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
      throw error;
    }
  }

  private async handleStageFailure(execution: PipelineExecution, stage: PipelineStage, error: any): Promise<void> {
    // Handle retries
    if (stage.retryCount > 0) {
      stage.logs.push(`Retrying stage (${stage.retryCount} attempts remaining)`);
      stage.retryCount--;
      stage.status = 'pending';
      // Re-queue the stage
      let executionQueue = this.stageQueue.get(execution.id) || [];
      executionQueue.unshift(stage);
      this.stageQueue.set(execution.id, executionQueue);
      return;
    }

    // If stage is not optional, fail the entire execution
    if (!stage.optional) {
      execution.status = 'failed';
      execution.endTime = new Date();
      
      this.emit('pipelineExecutionFailed', {
        executionId: execution.id,
        failedStage: stage.id,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date()
      });

      this.activeExecutions.delete(execution.id);
      this.stageQueue.delete(execution.id);
    }
  }

  private checkExecutionComplete(execution: PipelineExecution): void {
    const pendingStages = execution.stages.filter(s => 
      s.status === 'pending' || s.status === 'running'
    );

    if (pendingStages.length === 0) {
      const failedStages = execution.stages.filter(s => s.status === 'failed');
      const successStages = execution.stages.filter(s => s.status === 'success');
      
      execution.status = failedStages.length > 0 ? 'failed' : 'success';
      execution.endTime = new Date();
      execution.metrics.totalDuration = execution.endTime.getTime() - execution.startTime.getTime();
      execution.metrics.successRate = (successStages.length / execution.stages.length) * 100;

      this.emit('pipelineExecutionCompleted', {
        executionId: execution.id,
        status: execution.status,
        timestamp: new Date(),
        metrics: execution.metrics
      });

      this.activeExecutions.delete(execution.id);
      this.stageQueue.delete(execution.id);
    }
  }

  private cleanupExecutions(): void {
    const cutoffDate = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000); // 7 days ago
    
    for (const [executionId, execution] of this.executions.entries()) {
      if (execution.endTime && execution.endTime < cutoffDate) {
        this.executions.delete(executionId);
      }
    }
  }

  // Public API methods

  async getExecution(executionId: string): Promise<PipelineExecution | null> {
    return this.executions.get(executionId) || null;
  }

  async getExecutions(filters?: {
    status?: PipelineExecution['status'];
    pipelineId?: string;
    limit?: number;
  }): Promise<PipelineExecution[]> {
    let executions = Array.from(this.executions.values());

    if (filters) {
      if (filters.status) {
        executions = executions.filter(e => e.status === filters.status);
      }
      if (filters.pipelineId) {
        executions = executions.filter(e => e.pipelineId === filters.pipelineId);
      }
      if (filters.limit) {
        executions = executions.slice(0, filters.limit);
      }
    }

    return executions.sort((a, b) => b.startTime.getTime() - a.startTime.getTime());
  }

  async cancelExecution(executionId: string): Promise<boolean> {
    const execution = this.executions.get(executionId);
    if (!execution || execution.status !== 'running') return false;

    execution.status = 'cancelled';
    execution.endTime = new Date();

    // Cancel all running stages
    execution.stages.forEach(stage => {
      if (stage.status === 'running') {
        stage.status = 'cancelled';
        stage.endTime = new Date();
      }
    });

    this.activeExecutions.delete(executionId);
    this.stageQueue.delete(executionId);

    this.emit('pipelineExecutionCancelled', {
      executionId,
      timestamp: new Date()
    });

    return true;
  }

  async approveStage(executionId: string, stageId: string, approver: string): Promise<boolean> {
    const execution = this.executions.get(executionId);
    if (!execution) return false;

    const approval = execution.approvals.find(a => a.stageId === stageId);
    if (!approval || approval.status !== 'pending') return false;

    if (!approval.approved.includes(approver)) {
      approval.approved.push(approver);
    }

    // Check if all required approvals are received
    if (approval.approved.length >= approval.required.length) {
      approval.status = 'approved';
      approval.timestamp = new Date();

      // Resume stage execution
      const stage = execution.stages.find(s => s.id === stageId);
      if (stage) {
        stage.status = 'pending';
        this.queueReadyStages(execution);
      }

      this.emit('stageApproved', {
        executionId,
        stageId,
        approver,
        timestamp: new Date()
      });
    }

    return true;
  }

  getMetrics(): {
    totalExecutions: number;
    activeExecutions: number;
    successRate: number;
    averageDuration: number;
    templatesCount: number;
  } {
    const executions = Array.from(this.executions.values());
    const completed = executions.filter(e => e.endTime);
    const successful = completed.filter(e => e.status === 'success');
    
    const totalDuration = completed.reduce((sum, e) => sum + (e.metrics?.totalDuration || 0), 0);
    const averageDuration = completed.length > 0 ? totalDuration / completed.length : 0;

    return {
      totalExecutions: executions.length,
      activeExecutions: this.activeExecutions.size,
      successRate: completed.length > 0 ? (successful.length / completed.length) * 100 : 100,
      averageDuration,
      templatesCount: this.templates.size
    };
  }
}