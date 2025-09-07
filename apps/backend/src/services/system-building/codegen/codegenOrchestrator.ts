import { EventEmitter } from 'events';
import { IntelligentCodeGenerator } from './intelligentCodeGenerator';
import { AutomatedRefactoringEngine } from './automatedRefactoring';

export interface CodegenTask {
  id: string;
  type: 'generate' | 'refactor' | 'optimize' | 'analyze';
  payload: any;
  context: {
    projectPath: string;
    language: string;
    frameworks: string[];
    codeStyle: Record<string, any>;
  };
  timestamp: Date;
  status: 'pending' | 'processing' | 'completed' | 'failed';
  result?: any;
  metrics?: {
    processingTime: number;
    linesGenerated?: number;
    complexityReduction?: number;
    qualityScore?: number;
  };
}

export interface CodegenPipeline {
  id: string;
  name: string;
  tasks: CodegenTask[];
  dependencies: Record<string, string[]>;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startTime?: Date;
  endTime?: Date;
  metrics?: {
    totalProcessingTime: number;
    tasksCompleted: number;
    tasksSkipped: number;
    totalLinesProcessed: number;
    averageQualityScore: number;
  };
}

export interface CodegenWorkspace {
  id: string;
  projectPath: string;
  language: string;
  frameworks: string[];
  codeStyle: Record<string, any>;
  activeFiles: Map<string, string>;
  generatedCode: Map<string, string>;
  refactoredCode: Map<string, string>;
  analysisResults: Map<string, any>;
  qualityMetrics: {
    maintainabilityIndex: number;
    cyclomaticComplexity: number;
    cognitiveComplexity: number;
    testCoverage: number;
    codeSmells: number;
  };
}

export interface CodegenOrchestrationConfig {
  maxConcurrentTasks: number;
  taskTimeout: number;
  enableQualityGates: boolean;
  qualityThresholds: {
    minMaintainabilityIndex: number;
    maxCyclomaticComplexity: number;
    maxCognitiveComplexity: number;
    minTestCoverage: number;
  };
  integrations: {
    ide: boolean;
    git: boolean;
    ci: boolean;
    testing: boolean;
  };
}

export class CodegenOrchestrator extends EventEmitter {
  private generator: IntelligentCodeGenerator;
  private refactoring: AutomatedRefactoringEngine;
  private activeTasks: Map<string, CodegenTask> = new Map();
  private pipelines: Map<string, CodegenPipeline> = new Map();
  private workspaces: Map<string, CodegenWorkspace> = new Map();
  private config: CodegenOrchestrationConfig;

  constructor(config: CodegenOrchestrationConfig) {
    super();
    this.config = config;
    this.generator = new IntelligentCodeGenerator();
    this.refactoring = new AutomatedRefactoringEngine();
    this.setupEventHandlers();
  }

  private setupEventHandlers(): void {
    this.generator.on('codeGenerationCompleted', (result) => {
      this.handleTaskCompletion('generate', result);
    });

    this.refactoring.on('refactoringCompleted', (result) => {
      this.handleTaskCompletion('refactor', result);
    });

    this.on('taskCompleted', (task) => {
      this.checkPipelineProgress(task);
    });
  }

  async createWorkspace(projectPath: string, language: string, frameworks: string[]): Promise<string> {
    const workspaceId = `workspace_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const workspace: CodegenWorkspace = {
      id: workspaceId,
      projectPath,
      language,
      frameworks,
      codeStyle: await this.detectCodeStyle(projectPath),
      activeFiles: new Map(),
      generatedCode: new Map(),
      refactoredCode: new Map(),
      analysisResults: new Map(),
      qualityMetrics: {
        maintainabilityIndex: 0,
        cyclomaticComplexity: 0,
        cognitiveComplexity: 0,
        testCoverage: 0,
        codeSmells: 0
      }
    };

    this.workspaces.set(workspaceId, workspace);

    this.emit('workspaceCreated', {
      workspaceId,
      timestamp: new Date(),
      workspace
    });

    return workspaceId;
  }

  async createPipeline(
    workspaceId: string,
    name: string,
    tasks: Omit<CodegenTask, 'id' | 'timestamp' | 'status'>[]
  ): Promise<string> {
    const pipelineId = `pipeline_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const pipelineTasks: CodegenTask[] = tasks.map((task, index) => ({
      ...task,
      id: `${pipelineId}_task_${index}`,
      timestamp: new Date(),
      status: 'pending' as const
    }));

    const pipeline: CodegenPipeline = {
      id: pipelineId,
      name,
      tasks: pipelineTasks,
      dependencies: this.analyzeDependencies(pipelineTasks),
      status: 'pending'
    };

    this.pipelines.set(pipelineId, pipeline);

    this.emit('pipelineCreated', {
      pipelineId,
      workspaceId,
      timestamp: new Date(),
      pipeline
    });

    return pipelineId;
  }

  async executePipeline(pipelineId: string): Promise<void> {
    const pipeline = this.pipelines.get(pipelineId);
    if (!pipeline) {
      throw new Error(`Pipeline ${pipelineId} not found`);
    }

    pipeline.status = 'running';
    pipeline.startTime = new Date();

    this.emit('pipelineStarted', {
      pipelineId,
      timestamp: new Date(),
      pipeline
    });

    try {
      await this.executePipelineTasks(pipeline);
      
      pipeline.status = 'completed';
      pipeline.endTime = new Date();
      pipeline.metrics = this.calculatePipelineMetrics(pipeline);

      this.emit('pipelineCompleted', {
        pipelineId,
        timestamp: new Date(),
        pipeline,
        metrics: pipeline.metrics
      });

    } catch (error) {
      pipeline.status = 'failed';
      pipeline.endTime = new Date();

      this.emit('pipelineFailed', {
        pipelineId,
        timestamp: new Date(),
        error: error instanceof Error ? error.message : 'Unknown error',
        pipeline
      });

      throw error;
    }
  }

  private async executePipelineTasks(pipeline: CodegenPipeline): Promise<void> {
    const readyTasks = this.getReadyTasks(pipeline);
    const executingTasks: Promise<void>[] = [];

    for (const task of readyTasks) {
      if (executingTasks.length >= this.config.maxConcurrentTasks) {
        await Promise.race(executingTasks);
      }

      const taskPromise = this.executeTask(task)
        .then(() => {
          const index = executingTasks.indexOf(taskPromise);
          if (index > -1) {
            executingTasks.splice(index, 1);
          }
        })
        .catch((error) => {
          const index = executingTasks.indexOf(taskPromise);
          if (index > -1) {
            executingTasks.splice(index, 1);
          }
          throw error;
        });

      executingTasks.push(taskPromise);
    }

    await Promise.all(executingTasks);

    // Check if there are more tasks to execute
    const remainingTasks = pipeline.tasks.filter(t => t.status === 'pending');
    if (remainingTasks.length > 0) {
      await this.executePipelineTasks(pipeline);
    }
  }

  private async executeTask(task: CodegenTask): Promise<void> {
    task.status = 'processing';
    const startTime = Date.now();

    this.activeTasks.set(task.id, task);

    this.emit('taskStarted', {
      taskId: task.id,
      timestamp: new Date(),
      task
    });

    try {
      let result: any;

      switch (task.type) {
        case 'generate':
          result = await this.generator.generateCode(task.payload);
          break;
        case 'refactor':
          result = await this.refactoring.refactorCode(task.payload);
          break;
        case 'optimize':
          result = await this.optimizeCode(task);
          break;
        case 'analyze':
          result = await this.analyzeCode(task);
          break;
        default:
          throw new Error(`Unsupported task type: ${task.type}`);
      }

      const processingTime = Date.now() - startTime;
      
      task.status = 'completed';
      task.result = result;
      task.metrics = {
        processingTime,
        ...this.extractTaskMetrics(task, result)
      };

      this.activeTasks.delete(task.id);

      this.emit('taskCompleted', {
        taskId: task.id,
        timestamp: new Date(),
        task,
        result,
        metrics: task.metrics
      });

    } catch (error) {
      task.status = 'failed';
      task.metrics = {
        processingTime: Date.now() - startTime
      };

      this.activeTasks.delete(task.id);

      this.emit('taskFailed', {
        taskId: task.id,
        timestamp: new Date(),
        task,
        error: error instanceof Error ? error.message : 'Unknown error'
      });

      throw error;
    }
  }

  private async optimizeCode(task: CodegenTask): Promise<any> {
    // Combined optimization using both generation and refactoring
    const analysisResult = await this.refactoring.analyzeCode(
      task.payload.code,
      task.context.language
    );

    const suggestions = analysisResult.refactoringSuggestions;
    const optimizedCode = task.payload.code;
    let currentCode = optimizedCode;

    for (const suggestion of suggestions) {
      if (suggestion.priority === 'high' || suggestion.priority === 'medium') {
        try {
          const refactorResult = await this.refactoring.refactorCode({
            code: currentCode,
            language: task.context.language,
            refactoringType: suggestion.type,
            options: suggestion.options
          });
          
          if (refactorResult.success && refactorResult.refactoredCode) {
            currentCode = refactorResult.refactoredCode;
          }
        } catch (error) {
          // Continue with other optimizations even if one fails
          console.warn(`Optimization failed for ${suggestion.type}:`, error);
        }
      }
    }

    return {
      originalCode: task.payload.code,
      optimizedCode: currentCode,
      optimizations: suggestions,
      metrics: {
        complexityReduction: analysisResult.complexity - 
          (await this.refactoring.analyzeCode(currentCode, task.context.language)).complexity,
        maintainabilityImprovement: 0.1 // Placeholder
      }
    };
  }

  private async analyzeCode(task: CodegenTask): Promise<any> {
    return await this.refactoring.analyzeCode(
      task.payload.code,
      task.context.language
    );
  }

  private getReadyTasks(pipeline: CodegenPipeline): CodegenTask[] {
    return pipeline.tasks.filter(task => {
      if (task.status !== 'pending') return false;
      
      const dependencies = pipeline.dependencies[task.id] || [];
      return dependencies.every(depId => {
        const depTask = pipeline.tasks.find(t => t.id === depId);
        return depTask?.status === 'completed';
      });
    });
  }

  private analyzeDependencies(tasks: CodegenTask[]): Record<string, string[]> {
    const dependencies: Record<string, string[]> = {};
    
    // Simple dependency analysis based on task types and order
    for (let i = 0; i < tasks.length; i++) {
      const task = tasks[i];
      const deps: string[] = [];
      
      // Tasks that depend on code generation
      if (task.type === 'refactor' || task.type === 'optimize') {
        for (let j = 0; j < i; j++) {
          if (tasks[j].type === 'generate') {
            deps.push(tasks[j].id);
          }
        }
      }
      
      // Analysis tasks can run independently but after generation
      if (task.type === 'analyze') {
        for (let j = 0; j < i; j++) {
          if (tasks[j].type === 'generate') {
            deps.push(tasks[j].id);
            break; // Only need one generation task
          }
        }
      }
      
      dependencies[task.id] = deps;
    }
    
    return dependencies;
  }

  private extractTaskMetrics(task: CodegenTask, result: any): Partial<CodegenTask['metrics']> {
    const metrics: Partial<CodegenTask['metrics']> = {};
    
    if (task.type === 'generate' && result.generatedCode) {
      metrics.linesGenerated = result.generatedCode.split('\n').length;
    }
    
    if (task.type === 'refactor' && result.complexityReduction) {
      metrics.complexityReduction = result.complexityReduction;
    }
    
    if (result.qualityScore) {
      metrics.qualityScore = result.qualityScore;
    }
    
    return metrics;
  }

  private calculatePipelineMetrics(pipeline: CodegenPipeline): CodegenPipeline['metrics'] {
    const completedTasks = pipeline.tasks.filter(t => t.status === 'completed');
    const totalProcessingTime = completedTasks.reduce(
      (sum, task) => sum + (task.metrics?.processingTime || 0), 0
    );
    
    const totalLinesProcessed = completedTasks.reduce(
      (sum, task) => sum + (task.metrics?.linesGenerated || 0), 0
    );
    
    const qualityScores = completedTasks
      .map(t => t.metrics?.qualityScore)
      .filter(score => score !== undefined) as number[];
    
    const averageQualityScore = qualityScores.length > 0
      ? qualityScores.reduce((sum, score) => sum + score, 0) / qualityScores.length
      : 0;

    return {
      totalProcessingTime,
      tasksCompleted: completedTasks.length,
      tasksSkipped: pipeline.tasks.length - completedTasks.length,
      totalLinesProcessed,
      averageQualityScore
    };
  }

  private async detectCodeStyle(projectPath: string): Promise<Record<string, any>> {
    // Placeholder for code style detection
    // Would analyze existing code files to determine style preferences
    return {
      indentation: '  ', // 2 spaces
      quotes: 'single',
      semicolons: true,
      trailingCommas: true,
      lineLength: 80
    };
  }

  private handleTaskCompletion(taskType: string, result: any): void {
    // Handle completion events from generator and refactoring engines
    this.emit('taskResult', {
      type: taskType,
      result,
      timestamp: new Date()
    });
  }

  private checkPipelineProgress(taskEvent: any): void {
    // Check if any pipelines can continue execution
    for (const [pipelineId, pipeline] of this.pipelines) {
      if (pipeline.status === 'running') {
        const readyTasks = this.getReadyTasks(pipeline);
        if (readyTasks.length > 0) {
          // Continue pipeline execution asynchronously
          setImmediate(() => this.executePipelineTasks(pipeline));
        }
      }
    }
  }

  // Public API methods
  async getWorkspaceStatus(workspaceId: string): Promise<CodegenWorkspace | null> {
    return this.workspaces.get(workspaceId) || null;
  }

  async getPipelineStatus(pipelineId: string): Promise<CodegenPipeline | null> {
    return this.pipelines.get(pipelineId) || null;
  }

  async getTaskStatus(taskId: string): Promise<CodegenTask | null> {
    return this.activeTasks.get(taskId) || null;
  }

  async cancelTask(taskId: string): Promise<boolean> {
    const task = this.activeTasks.get(taskId);
    if (task && task.status === 'processing') {
      task.status = 'failed';
      this.activeTasks.delete(taskId);
      
      this.emit('taskCancelled', {
        taskId,
        timestamp: new Date(),
        task
      });
      
      return true;
    }
    return false;
  }

  async cancelPipeline(pipelineId: string): Promise<boolean> {
    const pipeline = this.pipelines.get(pipelineId);
    if (pipeline && pipeline.status === 'running') {
      // Cancel all active tasks in the pipeline
      for (const task of pipeline.tasks) {
        if (task.status === 'processing') {
          await this.cancelTask(task.id);
        }
      }
      
      pipeline.status = 'failed';
      pipeline.endTime = new Date();
      
      this.emit('pipelineCancelled', {
        pipelineId,
        timestamp: new Date(),
        pipeline
      });
      
      return true;
    }
    return false;
  }

  getMetrics(): {
    activeTasks: number;
    runningPipelines: number;
    totalWorkspaces: number;
    averageTaskTime: number;
  } {
    const runningPipelines = Array.from(this.pipelines.values())
      .filter(p => p.status === 'running').length;
    
    // Calculate average task time from completed tasks
    const allTasks = Array.from(this.pipelines.values())
      .flatMap(p => p.tasks)
      .filter(t => t.status === 'completed' && t.metrics?.processingTime);
    
    const averageTaskTime = allTasks.length > 0
      ? allTasks.reduce((sum, t) => sum + (t.metrics?.processingTime || 0), 0) / allTasks.length
      : 0;

    return {
      activeTasks: this.activeTasks.size,
      runningPipelines,
      totalWorkspaces: this.workspaces.size,
      averageTaskTime
    };
  }
}