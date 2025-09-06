import { Router } from 'express';
import { CodegenOrchestrator } from '../services/codegen/codegenOrchestrator';
import { IntelligentCodeGenerator } from '../services/codegen/intelligentCodeGenerator';
import { AutomatedRefactoringEngine } from '../services/codegen/automatedRefactoring';

const router: Router = Router();

// Initialize services
const orchestrator = new CodegenOrchestrator({
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
});

const generator = new IntelligentCodeGenerator();
const refactoring = new AutomatedRefactoringEngine();

// Workspace management
router.post('/workspace', async (req, res) => {
  try {
    const { projectPath, language, frameworks } = req.body;
    
    if (!projectPath || !language) {
      res.status(400).json({
        error: 'Missing required fields: projectPath, language'
      }); return;
    }

    const workspaceId = await orchestrator.createWorkspace(
      projectPath,
      language,
      frameworks || []
    );

    res.json({
      success: true,
      workspaceId,
      message: 'Workspace created successfully'
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to create workspace',
      details: error instanceof Error ? error.message : 'Unknown error'
    }); return;
  }
});

router.get('/workspace/:workspaceId', async (req, res) => {
  try {
    const { workspaceId } = req.params;
    const workspace = await orchestrator.getWorkspaceStatus(workspaceId);

    if (!workspace) {
      res.status(404).json({
        error: 'Workspace not found'
      }); return;
    }

    res.json({
      success: true,
      workspace
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get workspace status',
      details: error instanceof Error ? error.message : 'Unknown error'
    }); return;
  }
});

// Code generation
router.post('/generate', async (req, res) => {
  try {
    const request = req.body;
    
    if (!request.type || !request.requirements) {
      res.status(400).json({
        error: 'Missing required fields: type, requirements'
      }); return;
    }

    const result = await generator.generateCode(request);

    res.json({
      success: true,
      result
    });
  } catch (error) {
    res.status(500).json({
      error: 'Code generation failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }); return;
  }
});

router.post('/generate/function', async (req, res) => {
  try {
    const { name, description, parameters, returnType, context } = req.body;
    
    const result = await generator.generateCode({
      type: 'function',
      description: description || name,
      userId: 'anonymous',
      projectId: 'default',
      requirements: [{
        type: 'functional',
        description: description || name,
        priority: 'must_have',
        acceptanceCriteria: []
      }],
      context: {
        language: 'typescript',
        existingCode: [],
        dependencies: [],
        ...context,
        functionName: name,
        parameters: parameters || [],
        returnType: returnType || 'any'
      },
      constraints: [],
      preferences: {
        codeStyle: {
          indentation: 'spaces' as const,
          indentSize: 2,
          quotes: 'single' as const,
          semicolons: true,
          trailingCommas: true
        },
        patterns: {
          preferFunctional: true,
          preferAsync: true,
          preferComposition: true,
          preferImmutability: true
        },
        optimization: {
          performanceFirst: false,
          readabilityFirst: true,
          maintainabilityFirst: true
        },
        testing: {
          testFramework: 'jest',
          mockingLibrary: 'jest',
          coverageThreshold: 80
        }
      }
    });

    res.json({
      success: true,
      result
    });
  } catch (error) {
    res.status(500).json({
      error: 'Function generation failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }); return;
  }
});

router.post('/generate/component', async (req, res) => {
  try {
    const { name, type, props, features, context } = req.body;
    
    const result = await generator.generateCode({
      type: 'component',
      description: `Create a ${type} component named ${name}`,
      userId: 'anonymous',
      projectId: 'default',
      requirements: [{
        type: 'functional',
        description: `Create a ${type} component named ${name}`,
        priority: 'must_have',
        acceptanceCriteria: []
      }],
      context: {
        ...context,
        componentName: name,
        componentType: type,
        props: props || [],
        features: features || []
      },
      constraints: [],
      preferences: {
        codeStyle: {
          indentation: 'spaces' as const,
          indentSize: 2,
          quotes: 'single' as const,
          semicolons: true,
          trailingCommas: true
        },
        patterns: {
          preferFunctional: true,
          preferAsync: true,
          preferComposition: true,
          preferImmutability: true
        },
        optimization: {
          performanceFirst: false,
          readabilityFirst: true,
          maintainabilityFirst: true
        },
        testing: {
          testFramework: 'jest',
          mockingLibrary: 'jest',
          coverageThreshold: 80
        }
      }
    });

    res.json({
      success: true,
      result
    });
  } catch (error) {
    res.status(500).json({
      error: 'Component generation failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }); return;
  }
});

// Code refactoring
router.post('/refactor', async (req, res) => {
  try {
    const { code, language, refactoringType, options } = req.body;
    
    if (!code || !language || !refactoringType) {
      res.status(400).json({
        error: 'Missing required fields: code, language, refactoringType'
      }); return;
    }

    const result = await refactoring.refactorCode({
      code,
      language,
      refactoringType,
      options: options || {}
    });

    res.json({
      success: true,
      result
    });
  } catch (error) {
    res.status(500).json({
      error: 'Code refactoring failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }); return;
  }
});

router.post('/analyze', async (req, res) => {
  try {
    const { code, language } = req.body;
    
    if (!code || !language) {
      res.status(400).json({
        error: 'Missing required fields: code, language'
      }); return;
    }

    const result = await refactoring.analyzeCode(code, language);

    res.json({
      success: true,
      analysis: result
    });
  } catch (error) {
    res.status(500).json({
      error: 'Code analysis failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }); return;
  }
});

// Pipeline management
router.post('/pipeline', async (req, res) => {
  try {
    const { workspaceId, name, tasks } = req.body;
    
    if (!workspaceId || !name || !tasks) {
      res.status(400).json({
        error: 'Missing required fields: workspaceId, name, tasks'
      }); return;
    }

    const pipelineId = await orchestrator.createPipeline(workspaceId, name, tasks);

    res.json({
      success: true,
      pipelineId,
      message: 'Pipeline created successfully'
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to create pipeline',
      details: error instanceof Error ? error.message : 'Unknown error'
    }); return;
  }
});

router.post('/pipeline/:pipelineId/execute', async (req, res) => {
  try {
    const { pipelineId } = req.params;
    
    // Execute pipeline asynchronously
    orchestrator.executePipeline(pipelineId).catch(error => {
      console.error(`Pipeline ${pipelineId} failed:`, error);
    });

    res.json({
      success: true,
      message: 'Pipeline execution started',
      pipelineId
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to start pipeline execution',
      details: error instanceof Error ? error.message : 'Unknown error'
    }); return;
  }
});

router.get('/pipeline/:pipelineId', async (req, res) => {
  try {
    const { pipelineId } = req.params;
    const pipeline = await orchestrator.getPipelineStatus(pipelineId);

    if (!pipeline) {
      res.status(404).json({
        error: 'Pipeline not found'
      }); return;
    }

    res.json({
      success: true,
      pipeline
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get pipeline status',
      details: error instanceof Error ? error.message : 'Unknown error'
    }); return;
  }
});

router.delete('/pipeline/:pipelineId', async (req, res) => {
  try {
    const { pipelineId } = req.params;
    const cancelled = await orchestrator.cancelPipeline(pipelineId);

    if (!cancelled) {
      res.status(404).json({
        error: 'Pipeline not found or not running'
      }); return;
    }

    res.json({
      success: true,
      message: 'Pipeline cancelled successfully'
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to cancel pipeline',
      details: error instanceof Error ? error.message : 'Unknown error'
    }); return;
  }
});

// Task management
router.get('/task/:taskId', async (req, res) => {
  try {
    const { taskId } = req.params;
    const task = await orchestrator.getTaskStatus(taskId);

    if (!task) {
      res.status(404).json({
        error: 'Task not found'
      }); return;
    }

    res.json({
      success: true,
      task
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get task status',
      details: error instanceof Error ? error.message : 'Unknown error'
    }); return;
  }
});

router.delete('/task/:taskId', async (req, res) => {
  try {
    const { taskId } = req.params;
    const cancelled = await orchestrator.cancelTask(taskId);

    if (!cancelled) {
      res.status(404).json({
        error: 'Task not found or not running'
      }); return;
    }

    res.json({
      success: true,
      message: 'Task cancelled successfully'
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to cancel task',
      details: error instanceof Error ? error.message : 'Unknown error'
    }); return;
  }
});

// Batch operations
router.post('/batch/refactor', async (req, res) => {
  try {
    const { files, refactoringType, options } = req.body;
    
    if (!files || !Array.isArray(files) || !refactoringType) {
      res.status(400).json({
        error: 'Missing required fields: files (array), refactoringType'
      }); return;
    }

    const results = await Promise.allSettled(
      files.map(async (file) => {
        return await refactoring.refactorCode({
          code: file.code,
          language: file.language,
          refactoringType,
          options: options || {}
        });
      })
    );

    const successful = results.filter(r => r.status === 'fulfilled').length;
    const failed = results.length - successful;

    res.json({
      success: true,
      results: results.map((result, index) => ({
        file: files[index].path,
        success: result.status === 'fulfilled',
        result: result.status === 'fulfilled' ? result.value : null,
        error: result.status === 'rejected' ? result.reason?.message : null
      })),
      summary: {
        total: results.length,
        successful,
        failed
      }
    });
  } catch (error) {
    res.status(500).json({
      error: 'Batch refactoring failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }); return;
  }
});

// Metrics and status
router.get('/metrics', async (req, res) => {
  try {
    const metrics = orchestrator.getMetrics();

    res.json({
      success: true,
      metrics,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get metrics',
      details: error instanceof Error ? error.message : 'Unknown error'
    }); return;
  }
});

router.get('/health', async (req, res) => {
  try {
    const metrics = orchestrator.getMetrics();
    const status = {
      status: 'healthy',
      services: {
        orchestrator: 'running',
        generator: 'running',
        refactoring: 'running'
      },
      metrics,
      timestamp: new Date().toISOString()
    };

    res.json(status);
  } catch (error) {
    res.status(500).json({
      status: 'unhealthy',
      error: error instanceof Error ? error.message : 'Unknown error',
      timestamp: new Date().toISOString()
    }); return;
  }
});

// Advanced features
router.post('/optimize', async (req, res) => {
  try {
    const { workspaceId, code, language, optimizationLevel } = req.body;
    
    const tasks = [{
      type: 'optimize' as const,
      payload: { code, optimizationLevel: optimizationLevel || 'medium' },
      context: {
        projectPath: '',
        language,
        frameworks: [],
        codeStyle: {}
      }
    }];

    const pipelineId = await orchestrator.createPipeline(
      workspaceId,
      'Code Optimization',
      tasks
    );

    // Execute pipeline
    orchestrator.executePipeline(pipelineId).catch(error => {
      console.error(`Optimization pipeline ${pipelineId} failed:`, error);
    });

    res.json({
      success: true,
      message: 'Code optimization started',
      pipelineId
    });
  } catch (error) {
    res.status(500).json({
      error: 'Code optimization failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }); return;
  }
});

router.post('/template', async (req, res) => {
  try {
    const { templateName, variables, context } = req.body;
    
    const result = await generator.generateCode({
      type: 'component',
      description: `Generate code from template: ${templateName}`,
      userId: 'anonymous',
      projectId: 'default',
      requirements: [{
        type: 'functional',
        description: `Generate code from template: ${templateName}`,
        priority: 'must_have',
        acceptanceCriteria: []
      }],
      context: {
        language: 'typescript',
        existingCode: [],
        dependencies: [],
        ...context,
        templateName,
        variables: variables || {}
      },
      constraints: [],
      preferences: {
        codeStyle: {
          indentation: 'spaces' as const,
          indentSize: 2,
          quotes: 'single' as const,
          semicolons: true,
          trailingCommas: true
        },
        patterns: {
          preferFunctional: true,
          preferAsync: true,
          preferComposition: true,
          preferImmutability: true
        },
        optimization: {
          performanceFirst: false,
          readabilityFirst: true,
          maintainabilityFirst: true
        },
        testing: {
          testFramework: 'jest',
          mockingLibrary: 'jest',
          coverageThreshold: 80
        }
      }
    });

    res.json({
      success: true,
      result
    });
  } catch (error) {
    res.status(500).json({
      error: 'Template generation failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }); return;
  }
});

export default router;