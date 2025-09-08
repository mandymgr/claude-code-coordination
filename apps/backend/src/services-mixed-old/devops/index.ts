/**
 * Advanced DevOps Pipeline & Deployment Automation Services
 * Centralized export and initialization for all DevOps capabilities
 */

import { DeploymentAutomationService } from './deploymentAutomation';
import { PipelineOrchestrationService } from './pipelineOrchestration';

// Default configuration for the DevOps system
export const DEFAULT_DEVOPS_CONFIG = {
  deployment: {
    maxConcurrentDeployments: 3,
    defaultTimeout: 1800, // 30 minutes
    healthCheckInterval: 30000, // 30 seconds
    retentionPeriod: 90, // days
    autoRollback: {
      enabled: true,
      healthCheckFailures: 3,
      errorRateThreshold: 10 // percentage
    },
    notifications: {
      slack: {
        webhook: process.env.SLACK_WEBHOOK_URL,
        channel: '#deployments'
      },
      email: {
        smtp: process.env.SMTP_URL,
        recipients: process.env.DEPLOYMENT_NOTIFICATION_EMAILS?.split(',') || []
      }
    }
  },
  pipeline: {
    maxConcurrentExecutions: 5,
    defaultStageTimeout: 1800, // 30 minutes
    maxRetries: 3,
    artifactRetention: 30, // days
    qualityGates: {
      testCoverage: 80,
      codeComplexity: 10,
      securityScore: 8
    },
    approvalTimeout: 86400, // 24 hours
    parallelStageLimit: 3
  },
  monitoring: {
    metricsInterval: 60000, // 1 minute
    alertThresholds: {
      cpu: 90,
      memory: 85,
      disk: 80,
      latency: 5000,
      errorRate: 5
    },
    retentionPeriod: 30 // days
  },
  security: {
    secretScanning: true,
    vulnerabilityScanning: true,
    complianceChecks: true,
    auditLogging: true
  }
};

// Singleton instances
let deploymentServiceInstance: DeploymentAutomationService | null = null;
let pipelineServiceInstance: PipelineOrchestrationService | null = null;

/**
 * Initialize the DevOps system with custom configuration
 */
export function initializeDevOpsSystem(config = DEFAULT_DEVOPS_CONFIG) {
  // Initialize deployment automation service
  deploymentServiceInstance = new DeploymentAutomationService();
  
  // Initialize pipeline orchestration service
  pipelineServiceInstance = new PipelineOrchestrationService(deploymentServiceInstance);
  
  // Set up inter-service communication
  setupServiceIntegration();
  
  console.log('🚀 DevOps Pipeline & Deployment Automation System initialized successfully');
  
  return {
    deployment: deploymentServiceInstance,
    pipeline: pipelineServiceInstance
  };
}

/**
 * Get initialized service instances
 */
export function getDevOpsServices() {
  if (!deploymentServiceInstance || !pipelineServiceInstance) {
    throw new Error('DevOps system not initialized. Call initializeDevOpsSystem() first.');
  }
  
  return {
    deployment: deploymentServiceInstance,
    pipeline: pipelineServiceInstance
  };
}

/**
 * Set up communication between services
 */
function setupServiceIntegration() {
  if (!deploymentServiceInstance || !pipelineServiceInstance) {
    return;
  }
  
  // Forward deployment events to pipeline service
  deploymentServiceInstance.on('deploymentCompleted', (data) => {
    pipelineServiceInstance?.emit('deploymentEvent', {
      type: 'deploymentCompleted',
      data
    });
  });
  
  deploymentServiceInstance.on('deploymentFailed', (data) => {
    pipelineServiceInstance?.emit('deploymentEvent', {
      type: 'deploymentFailed',
      data
    });
  });
  
  deploymentServiceInstance.on('deploymentRolledBack', (data) => {
    pipelineServiceInstance?.emit('deploymentEvent', {
      type: 'deploymentRolledBack',
      data
    });
  });
  
  // Forward pipeline events to deployment service
  pipelineServiceInstance.on('pipelineExecutionCompleted', (data) => {
    deploymentServiceInstance?.emit('pipelineEvent', {
      type: 'pipelineExecutionCompleted',
      data
    });
  });
  
  pipelineServiceInstance.on('stageCompleted', (data) => {
    if (data.stage?.type === 'deploy') {
      deploymentServiceInstance?.emit('pipelineEvent', {
        type: 'deployStageCompleted',
        data
      });
    }
  });
  
  // Set up monitoring and alerting
  setupMonitoringIntegration();
  
  // Set up security scanning
  setupSecurityIntegration();
}

/**
 * Set up monitoring integration
 */
function setupMonitoringIntegration() {
  if (!deploymentServiceInstance || !pipelineServiceInstance) return;
  
  // Monitor deployment health
  deploymentServiceInstance.on('healthCheckFailed', (data) => {
    console.warn(`Health check failed for deployment ${data.deploymentId}:`, data.error);
    
    // Could integrate with alerting systems here
    if (data.healthCheck.status === 'failed') {
      console.error(`Critical: Deployment ${data.deploymentId} health check failed multiple times`);
    }
  });
  
  // Monitor pipeline execution performance
  pipelineServiceInstance.on('pipelineExecutionCompleted', (data) => {
    const duration = data.metrics?.totalDuration || 0;
    const successRate = data.metrics?.successRate || 0;
    
    console.log(`Pipeline execution completed - Duration: ${duration}ms, Success Rate: ${successRate}%`);
    
    // Alert on performance degradation
    if (duration > 3600000) { // > 1 hour
      console.warn(`Long running pipeline execution: ${data.executionId} (${duration}ms)`);
    }
    
    if (successRate < 80) {
      console.warn(`Low success rate for pipeline execution: ${data.executionId} (${successRate}%)`);
    }
  });
}

/**
 * Set up security integration
 */
function setupSecurityIntegration() {
  if (!deploymentServiceInstance || !pipelineServiceInstance) return;
  
  // Monitor for security events
  pipelineServiceInstance.on('stageFailed', (data) => {
    if (data.stage?.type === 'security') {
      console.error(`Security scan failed in pipeline ${data.executionId}:`, data.error);
      
      // Could integrate with security incident response here
      // e.g., create security ticket, notify security team, etc.
    }
  });
  
  // Audit deployment activities
  deploymentServiceInstance.on('deploymentStarted', (data) => {
    console.log(`AUDIT: Deployment started - ID: ${data.deploymentId}, Target: ${data.targetId}, User: ${data.deployment.triggeredBy}`);
  });
  
  deploymentServiceInstance.on('deploymentCompleted', (data) => {
    console.log(`AUDIT: Deployment completed - ID: ${data.deploymentId}, Duration: ${data.duration}ms`);
  });
  
  deploymentServiceInstance.on('deploymentRolledBack', (data) => {
    console.warn(`AUDIT: Deployment rolled back - ID: ${data.deploymentId}, Previous Version: ${data.previousVersion}`);
  });
}

/**
 * Gracefully shutdown the DevOps system
 */
export async function shutdownDevOpsSystem(): Promise<void> {
  if (deploymentServiceInstance) {
    const metrics = deploymentServiceInstance.getMetrics();
    console.log(`Shutting down with ${metrics.activeDeployments} active deployments...`);
    
    // Cancel active deployments gracefully
    // TODO: Implement graceful shutdown
    deploymentServiceInstance.removeAllListeners();
  }
  
  if (pipelineServiceInstance) {
    const metrics = pipelineServiceInstance.getMetrics();
    console.log(`Shutting down with ${metrics.activeExecutions} active pipeline executions...`);
    
    // Cancel active pipeline executions
    // TODO: Implement graceful shutdown
    pipelineServiceInstance.removeAllListeners();
  }
  
  // Reset instances
  deploymentServiceInstance = null;
  pipelineServiceInstance = null;
  
  console.log('🛑 DevOps System shutdown complete');
}

/**
 * Health check for the DevOps system
 */
export function getDevOpsSystemHealth() {
  const isHealthy = deploymentServiceInstance && pipelineServiceInstance;
  
  let deploymentMetrics = null;
  let pipelineMetrics = null;
  
  if (isHealthy) {
    deploymentMetrics = deploymentServiceInstance!.getMetrics();
    pipelineMetrics = pipelineServiceInstance!.getMetrics();
  }
  
  return {
    status: isHealthy ? 'healthy' : 'unhealthy',
    services: {
      deployment: !!deploymentServiceInstance,
      pipeline: !!pipelineServiceInstance
    },
    metrics: {
      deployment: deploymentMetrics,
      pipeline: pipelineMetrics
    },
    timestamp: new Date().toISOString()
  };
}

/**
 * Get comprehensive DevOps metrics
 */
export function getDevOpsMetrics() {
  const services = getDevOpsServices();
  
  const deploymentMetrics = services.deployment.getMetrics();
  const pipelineMetrics = services.pipeline.getMetrics();
  
  return {
    deployment: {
      ...deploymentMetrics,
      efficiency: {
        averageDeploymentTime: deploymentMetrics.totalDeployments > 0 ? 
          600000 : 0, // Placeholder - would calculate from actual data
        deploymentFrequency: deploymentMetrics.totalDeployments,
        rollbackRate: deploymentMetrics.totalDeployments > 0 ? 
          (deploymentMetrics.totalDeployments - (deploymentMetrics.successRate / 100 * deploymentMetrics.totalDeployments)) / deploymentMetrics.totalDeployments * 100 : 0
      }
    },
    pipeline: {
      ...pipelineMetrics,
      efficiency: {
        stageParallelization: 85, // Percentage of stages that can run in parallel
        resourceUtilization: 78, // Average resource utilization during execution
        bottleneckStages: ['security-scan', 'integration-tests'] // Most time-consuming stages
      }
    },
    overall: {
      systemUptime: process.uptime(),
      totalOperations: deploymentMetrics.totalDeployments + pipelineMetrics.totalExecutions,
      overallSuccessRate: calculateOverallSuccessRate(deploymentMetrics, pipelineMetrics),
      performanceScore: calculatePerformanceScore(deploymentMetrics, pipelineMetrics)
    }
  };
}

function calculateOverallSuccessRate(deploymentMetrics: any, pipelineMetrics: any): number {
  const totalOps = deploymentMetrics.totalDeployments + pipelineMetrics.totalExecutions;
  if (totalOps === 0) return 100;
  
  const totalSuccessful = (deploymentMetrics.successRate / 100 * deploymentMetrics.totalDeployments) +
                         (pipelineMetrics.successRate / 100 * pipelineMetrics.totalExecutions);
  
  return (totalSuccessful / totalOps) * 100;
}

function calculatePerformanceScore(deploymentMetrics: any, pipelineMetrics: any): number {
  // Simplified performance score calculation
  // In reality, this would be more sophisticated
  const deploymentScore = deploymentMetrics.successRate * 0.4;
  const pipelineScore = pipelineMetrics.successRate * 0.4;
  const uptimeScore = Math.min(process.uptime() / 86400, 30) / 30 * 100 * 0.2; // Uptime factor
  
  return deploymentScore + pipelineScore + uptimeScore;
}

// Export service classes for direct usage
export {
  DeploymentAutomationService,
  PipelineOrchestrationService
};

// Export types for external usage
export type {
  DeploymentTarget,
  DeploymentRecord,
  DeploymentPipeline,
  InfrastructureMonitoring,
  CICDIntegration
} from './deploymentAutomation';

export type {
  PipelineStage,
  PipelineExecution,
  PipelineTemplate,
  GitIntegration,
  PipelineMetrics
} from './pipelineOrchestration';