/**
 * Code Generation & Automated Refactoring Services
 * Centralized export and initialization for all code generation capabilities
 */

import { IntelligentCodeGenerator } from './intelligentCodeGenerator';
import { AutomatedRefactoringEngine } from './automatedRefactoring';
import { CodegenOrchestrator } from './codegenOrchestrator';

// Default configuration for the code generation system
export const DEFAULT_CODEGEN_CONFIG = {
  orchestrator: {
    maxConcurrentTasks: 5,
    taskTimeout: 300000, // 5 minutes
    enableQualityGates: true,
    qualityThresholds: {
      minMaintainabilityIndex: 70,
      maxCyclomaticComplexity: 10,
      maxCognitiveComplexity: 15,
      minTestCoverage: 80
    },
    integrations: {
      ide: true,
      git: true,
      ci: true,
      testing: true
    }
  },
  generator: {
    templates: {
      react: {
        functional: true,
        typescript: true,
        hooks: true,
        styledComponents: false
      },
      node: {
        express: true,
        typescript: true,
        async: true,
        errorHandling: true
      },
      database: {
        orm: 'prisma',
        migrations: true,
        validation: true
      }
    },
    aiProviders: {
      primary: 'claude',
      fallback: 'gpt4',
      localModel: false
    }
  },
  refactoring: {
    enabledTypes: [
      'extract_method',
      'reduce_complexity',
      'remove_dead_code',
      'modernize_syntax',
      'improve_naming',
      'extract_variable',
      'inline_method',
      'move_method',
      'extract_class',
      'rename_class',
      'add_parameter',
      'remove_parameter',
      'change_signature',
      'extract_interface',
      'push_down_method',
      'pull_up_method',
      'replace_conditional',
      'simplify_expression',
      'optimize_imports',
      'fix_code_style'
    ],
    safetyLevel: 'moderate', // conservative, moderate, aggressive
    requireApproval: true,
    backupOriginal: true
  }
};

// Singleton instances
let orchestratorInstance: CodegenOrchestrator | null = null;
let generatorInstance: IntelligentCodeGenerator | null = null;
let refactoringInstance: AutomatedRefactoringEngine | null = null;

/**
 * Initialize the code generation system with custom configuration
 */
export function initializeCodegenSystem(config = DEFAULT_CODEGEN_CONFIG) {
  // Initialize generator
  generatorInstance = new IntelligentCodeGenerator();
  
  // Initialize refactoring engine
  refactoringInstance = new AutomatedRefactoringEngine();
  
  // Initialize orchestrator
  orchestratorInstance = new CodegenOrchestrator(config.orchestrator);
  
  // Set up inter-service communication
  setupServiceIntegration();
  
  console.log('🤖 Code Generation System initialized successfully');
  
  return {
    orchestrator: orchestratorInstance,
    generator: generatorInstance,
    refactoring: refactoringInstance
  };
}

/**
 * Get initialized service instances
 */
export function getCodegenServices() {
  if (!orchestratorInstance || !generatorInstance || !refactoringInstance) {
    throw new Error('Code generation system not initialized. Call initializeCodegenSystem() first.');
  }
  
  return {
    orchestrator: orchestratorInstance,
    generator: generatorInstance,
    refactoring: refactoringInstance
  };
}

/**
 * Set up communication between services
 */
function setupServiceIntegration() {
  if (!orchestratorInstance || !generatorInstance || !refactoringInstance) {
    return;
  }
  
  // Forward events between services for coordinated operation
  generatorInstance.on('codeGenerated', (data) => {
    orchestratorInstance?.emit('serviceEvent', {
      service: 'generator',
      event: 'codeGenerated',
      data
    });
  });
  
  refactoringInstance.on('refactoringCompleted', (data) => {
    orchestratorInstance?.emit('serviceEvent', {
      service: 'refactoring',
      event: 'refactoringCompleted',
      data
    });
  });
  
  orchestratorInstance.on('taskAssigned', (data) => {
    console.log(`Task assigned: ${data.taskType} to ${data.service}`);
  });
  
  orchestratorInstance.on('pipelineCompleted', (data) => {
    console.log(`Pipeline ${data.pipelineId} completed with ${data.metrics?.tasksCompleted} tasks`);
  });
}

/**
 * Gracefully shutdown the code generation system
 */
export async function shutdownCodegenSystem(): Promise<void> {
  if (orchestratorInstance) {
    // Cancel any running pipelines
    const metrics = orchestratorInstance.getMetrics();
    console.log(`Shutting down with ${metrics.runningPipelines} running pipelines...`);
    
    // TODO: Implement graceful shutdown of active pipelines
    orchestratorInstance.removeAllListeners();
  }
  
  if (generatorInstance) {
    generatorInstance.removeAllListeners();
  }
  
  if (refactoringInstance) {
    refactoringInstance.removeAllListeners();
  }
  
  // Reset instances
  orchestratorInstance = null;
  generatorInstance = null;
  refactoringInstance = null;
  
  console.log('🛑 Code Generation System shutdown complete');
}

/**
 * Health check for the code generation system
 */
export function getCodegenSystemHealth() {
  const isHealthy = orchestratorInstance && generatorInstance && refactoringInstance;
  const metrics = isHealthy ? orchestratorInstance!.getMetrics() : null;
  
  return {
    status: isHealthy ? 'healthy' : 'unhealthy',
    services: {
      orchestrator: !!orchestratorInstance,
      generator: !!generatorInstance,
      refactoring: !!refactoringInstance
    },
    metrics,
    timestamp: new Date().toISOString()
  };
}

// Export service classes for direct usage
export {
  IntelligentCodeGenerator,
  AutomatedRefactoringEngine, 
  CodegenOrchestrator
};

// Export types for external usage
export type {
  CodeGenerationRequest,
  RefactoringRequest,
  CodegenTask,
  CodegenPipeline,
  CodegenWorkspace
} from './intelligentCodeGenerator';

export type {
  RefactoringType,
  RefactoringResult,
  CodeAnalysis
} from './automatedRefactoring';

export type {
  CodegenOrchestrationConfig
} from './codegenOrchestrator';