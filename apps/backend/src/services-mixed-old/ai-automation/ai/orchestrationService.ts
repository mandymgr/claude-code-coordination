import { EventEmitter } from 'events';
import { TelemetryUtils } from '../../utils/telemetry';
import IntelligentAIRouter, { AIRequest, AIResponse, AIProvider } from './intelligentRouter';

export interface AIAgent {
  id: string;
  name: string;
  type: 'specialist' | 'generalist' | 'coordinator' | 'reviewer' | 'optimizer';
  specializations: string[];
  capabilities: {
    can_code: boolean;
    can_review: boolean;
    can_plan: boolean;
    can_coordinate: boolean;
    can_optimize: boolean;
  };
  preferred_providers: string[];
  performance_profile: {
    accuracy_score: number;
    speed_score: number;
    creativity_score: number;
    collaboration_score: number;
  };
  is_active: boolean;
}

export interface OrchestrationTask {
  id: string;
  user_id: string;
  organization_id: string;
  title: string;
  description: string;
  task_type: 'single_agent' | 'multi_agent_sequential' | 'multi_agent_parallel' | 'collaborative' | 'hierarchical';
  complexity_level: 'simple' | 'medium' | 'complex' | 'expert';
  requirements: {
    deliverables: string[];
    constraints: {
      max_cost_usd?: number;
      max_duration_minutes?: number;
      quality_threshold?: number;
      required_capabilities?: string[];
    };
    preferences: {
      speed_vs_quality: 'speed' | 'balanced' | 'quality';
      collaboration_style: 'independent' | 'collaborative' | 'supervised';
    };
  };
  context: {
    project_id?: string;
    session_id?: string;
    related_files?: Array<{ path: string; content: string; importance: 'high' | 'medium' | 'low' }>;
    previous_tasks?: string[];
    domain_knowledge?: Record<string, any>;
  };
  created_at: Date;
  updated_at: Date;
}

export interface ExecutionPlan {
  task_id: string;
  strategy: 'single' | 'sequential' | 'parallel' | 'hierarchical';
  estimated_duration_minutes: number;
  estimated_cost_usd: number;
  confidence_score: number;
  steps: ExecutionStep[];
  dependencies: Array<{ from_step: number; to_step: number; type: 'output' | 'approval' | 'sync' }>;
  quality_gates: Array<{ step_number: number; criteria: string[]; auto_pass_threshold: number }>;
}

export interface ExecutionStep {
  step_number: number;
  agent_id: string;
  agent_role: 'primary' | 'reviewer' | 'optimizer' | 'coordinator';
  action_type: 'generate' | 'review' | 'optimize' | 'coordinate' | 'validate';
  input_description: string;
  output_description: string;
  estimated_duration_minutes: number;
  estimated_cost_usd: number;
  ai_request_template: Partial<AIRequest>;
  success_criteria: string[];
  fallback_options?: Array<{ agent_id: string; reason: string }>;
}

export interface ExecutionResult {
  task_id: string;
  execution_plan_id: string;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  started_at: Date;
  completed_at?: Date;
  step_results: StepResult[];
  final_output: {
    deliverables: Array<{ type: string; content: string; quality_score: number }>;
    metadata: {
      total_cost_usd: number;
      total_duration_minutes: number;
      agents_used: string[];
      quality_scores: Record<string, number>;
    };
  };
  quality_assessment: {
    overall_score: number;
    completeness_score: number;
    accuracy_score: number;
    consistency_score: number;
    user_satisfaction_prediction: number;
  };
  lessons_learned: string[];
}

export interface StepResult {
  step_number: number;
  agent_id: string;
  status: 'pending' | 'running' | 'completed' | 'failed' | 'skipped';
  started_at?: Date;
  completed_at?: Date;
  ai_responses: AIResponse[];
  output_data: any;
  quality_score: number;
  cost_usd: number;
  duration_minutes: number;
  success_criteria_met: boolean[];
  feedback_from_reviewers?: Array<{ reviewer_agent_id: string; feedback: string; score: number }>;
  error_message?: string;
}

export class AIOrchestrationService extends EventEmitter {
  private router: IntelligentAIRouter;
  private agents: Map<string, AIAgent> = new Map();
  private activeTasks: Map<string, ExecutionResult> = new Map();
  private taskHistory: Map<string, ExecutionResult> = new Map();
  
  constructor(router: IntelligentAIRouter) {
    super();
    this.router = router;
    this.initializeAgents();
    this.startPerformanceMonitoring();
  }

  /**
   * Initialize AI agents with different specializations
   */
  private initializeAgents(): void {
    // Code Specialist Agent
    this.agents.set('code-specialist', {
      id: 'code-specialist',
      name: 'Code Specialist',
      type: 'specialist',
      specializations: ['code_generation', 'code_review', 'debugging', 'refactoring'],
      capabilities: {
        can_code: true,
        can_review: true,
        can_plan: false,
        can_coordinate: false,
        can_optimize: true
      },
      preferred_providers: ['anthropic-claude', 'openai-gpt4'],
      performance_profile: {
        accuracy_score: 0.94,
        speed_score: 0.87,
        creativity_score: 0.82,
        collaboration_score: 0.78
      },
      is_active: true
    });

    // Documentation Specialist Agent
    this.agents.set('docs-specialist', {
      id: 'docs-specialist',
      name: 'Documentation Specialist',
      type: 'specialist',
      specializations: ['documentation', 'explanation', 'technical_writing'],
      capabilities: {
        can_code: false,
        can_review: true,
        can_plan: false,
        can_coordinate: false,
        can_optimize: false
      },
      preferred_providers: ['anthropic-claude', 'openai-gpt4'],
      performance_profile: {
        accuracy_score: 0.91,
        speed_score: 0.93,
        creativity_score: 0.88,
        collaboration_score: 0.85
      },
      is_active: true
    });

    // Architecture Planning Agent
    this.agents.set('architect', {
      id: 'architect',
      name: 'System Architect',
      type: 'generalist',
      specializations: ['system_design', 'planning', 'analysis', 'architecture'],
      capabilities: {
        can_code: true,
        can_review: true,
        can_plan: true,
        can_coordinate: true,
        can_optimize: true
      },
      preferred_providers: ['openai-gpt4', 'google-gemini'],
      performance_profile: {
        accuracy_score: 0.96,
        speed_score: 0.75,
        creativity_score: 0.93,
        collaboration_score: 0.89
      },
      is_active: true
    });

    // Quality Assurance Reviewer Agent
    this.agents.set('qa-reviewer', {
      id: 'qa-reviewer',
      name: 'Quality Reviewer',
      type: 'reviewer',
      specializations: ['code_review', 'testing', 'quality_assurance', 'validation'],
      capabilities: {
        can_code: false,
        can_review: true,
        can_plan: false,
        can_coordinate: false,
        can_optimize: false
      },
      preferred_providers: ['anthropic-claude', 'openai-gpt4'],
      performance_profile: {
        accuracy_score: 0.98,
        speed_score: 0.85,
        creativity_score: 0.65,
        collaboration_score: 0.92
      },
      is_active: true
    });

    // Task Coordinator Agent
    this.agents.set('coordinator', {
      id: 'coordinator',
      name: 'Task Coordinator',
      type: 'coordinator',
      specializations: ['project_management', 'coordination', 'planning', 'optimization'],
      capabilities: {
        can_code: false,
        can_review: true,
        can_plan: true,
        can_coordinate: true,
        can_optimize: true
      },
      preferred_providers: ['openai-gpt4', 'anthropic-claude'],
      performance_profile: {
        accuracy_score: 0.89,
        speed_score: 0.91,
        creativity_score: 0.87,
        collaboration_score: 0.96
      },
      is_active: true
    });

    console.log(`Initialized ${this.agents.size} AI agents`);
  }

  /**
   * Plan task execution based on requirements
   */
  async planExecution(task: OrchestrationTask): Promise<ExecutionPlan> {
    return TelemetryUtils.traceAsync('orchestration.plan_execution', async () => {
      // Analyze task complexity and determine strategy
      const strategy = this.determineExecutionStrategy(task);
      
      // Select appropriate agents
      const selectedAgents = this.selectAgentsForTask(task);
      
      // Create execution steps
      const steps = await this.createExecutionSteps(task, selectedAgents, strategy);
      
      // Calculate dependencies
      const dependencies = this.calculateStepDependencies(steps, strategy);
      
      // Set up quality gates
      const qualityGates = this.defineQualityGates(task, steps);
      
      // Calculate estimates
      const estimates = this.calculateExecutionEstimates(steps);

      const plan: ExecutionPlan = {
        task_id: task.id,
        strategy,
        estimated_duration_minutes: estimates.duration,
        estimated_cost_usd: estimates.cost,
        confidence_score: estimates.confidence,
        steps,
        dependencies,
        quality_gates
      };

      this.emit('execution_planned', { task, plan });
      
      return plan;
    });
  }

  /**
   * Execute a planned task
   */
  async executeTask(task: OrchestrationTask, plan: ExecutionPlan): Promise<ExecutionResult> {
    return TelemetryUtils.traceAsync('orchestration.execute_task', async () => {
      const executionResult: ExecutionResult = {
        task_id: task.id,
        execution_plan_id: plan.task_id,
        status: 'running',
        started_at: new Date(),
        step_results: plan.steps.map(step => ({
          step_number: step.step_number,
          agent_id: step.agent_id,
          status: 'pending',
          ai_responses: [],
          output_data: null,
          quality_score: 0,
          cost_usd: 0,
          duration_minutes: 0,
          success_criteria_met: []
        })),
        final_output: {
          deliverables: [],
          metadata: {
            total_cost_usd: 0,
            total_duration_minutes: 0,
            agents_used: [],
            quality_scores: {}
          }
        },
        quality_assessment: {
          overall_score: 0,
          completeness_score: 0,
          accuracy_score: 0,
          consistency_score: 0,
          user_satisfaction_prediction: 0
        },
        lessons_learned: []
      };

      this.activeTasks.set(task.id, executionResult);
      this.emit('execution_started', { task, plan, executionResult });

      try {
        if (plan.strategy === 'sequential' || plan.strategy === 'single') {
          await this.executeSequentially(task, plan, executionResult);
        } else if (plan.strategy === 'parallel') {
          await this.executeInParallel(task, plan, executionResult);
        } else if (plan.strategy === 'hierarchical') {
          await this.executeHierarchically(task, plan, executionResult);
        }

        // Finalize results
        await this.finalizeExecution(task, plan, executionResult);
        
        executionResult.status = 'completed';
        executionResult.completed_at = new Date();

        this.emit('execution_completed', { task, plan, executionResult });

      } catch (error) {
        console.error('Task execution failed:', error);
        executionResult.status = 'failed';
        executionResult.completed_at = new Date();
        
        this.emit('execution_failed', { task, plan, executionResult, error });
      } finally {
        this.activeTasks.delete(task.id);
        this.taskHistory.set(task.id, executionResult);
      }

      return executionResult;
    });
  }

  /**
   * Execute steps sequentially
   */
  private async executeSequentially(
    task: OrchestrationTask, 
    plan: ExecutionPlan, 
    result: ExecutionResult
  ): Promise<void> {
    for (const step of plan.steps) {
      const stepResult = result.step_results.find(sr => sr.step_number === step.step_number)!;
      
      await this.executeStep(task, step, stepResult, result);
      
      // Check if step passed quality gates
      const qualityGate = plan.quality_gates.find(qg => qg.step_number === step.step_number);
      if (qualityGate && stepResult.quality_score < qualityGate.auto_pass_threshold) {
        // Handle quality gate failure
        await this.handleQualityGateFailure(step, stepResult, qualityGate);
      }
    }
  }

  /**
   * Execute steps in parallel
   */
  private async executeInParallel(
    task: OrchestrationTask, 
    plan: ExecutionPlan, 
    result: ExecutionResult
  ): Promise<void> {
    const stepPromises = plan.steps.map(async (step) => {
      const stepResult = result.step_results.find(sr => sr.step_number === step.step_number)!;
      return this.executeStep(task, step, stepResult, result);
    });

    await Promise.all(stepPromises);
  }

  /**
   * Execute steps hierarchically
   */
  private async executeHierarchically(
    task: OrchestrationTask, 
    plan: ExecutionPlan, 
    result: ExecutionResult
  ): Promise<void> {
    // Group steps by hierarchy level
    const stepLevels = this.groupStepsByLevel(plan.steps, plan.dependencies);
    
    for (const level of stepLevels) {
      const levelPromises = level.map(async (step) => {
        const stepResult = result.step_results.find(sr => sr.step_number === step.step_number)!;
        return this.executeStep(task, step, stepResult, result);
      });
      
      await Promise.all(levelPromises);
    }
  }

  /**
   * Execute individual step
   */
  private async executeStep(
    task: OrchestrationTask,
    step: ExecutionStep,
    stepResult: StepResult,
    executionResult: ExecutionResult
  ): Promise<void> {
    return TelemetryUtils.traceAsync('orchestration.execute_step', async () => {
      stepResult.status = 'running';
      stepResult.started_at = new Date();

      try {
        const agent = this.agents.get(step.agent_id);
        if (!agent) {
          throw new Error(`Agent ${step.agent_id} not found`);
        }

        // Create AI request based on step template
        const aiRequest = this.createAIRequestFromStep(task, step, executionResult);
        
        // Route and execute AI request
        const routingDecision = await this.router.routeRequest(aiRequest);
        const aiResponse = await this.router.executeRequest(aiRequest, routingDecision);

        stepResult.ai_responses.push(aiResponse);

        if (aiResponse.success) {
          // Process AI response into step output
          stepResult.output_data = this.processStepOutput(aiResponse, step);
          
          // Calculate quality score
          stepResult.quality_score = this.calculateStepQuality(aiResponse, step);
          
          // Check success criteria
          stepResult.success_criteria_met = await this.evaluateSuccessCriteria(
            step.success_criteria, 
            stepResult.output_data, 
            aiResponse
          );

          stepResult.status = stepResult.success_criteria_met.every(Boolean) ? 'completed' : 'failed';
        } else {
          stepResult.status = 'failed';
          stepResult.error_message = aiResponse.error_message;
        }

        // Update metrics
        stepResult.cost_usd = aiResponse.metadata.cost_usd;
        stepResult.duration_minutes = aiResponse.metadata.latency_ms / (1000 * 60);
        stepResult.completed_at = new Date();

        this.emit('step_completed', { step, stepResult, aiResponse });

      } catch (error) {
        stepResult.status = 'failed';
        stepResult.error_message = error instanceof Error ? error.message : 'Unknown error';
        stepResult.completed_at = new Date();
        
        console.error(`Step ${step.step_number} failed:`, error);
        this.emit('step_failed', { step, stepResult, error });
      }
    });
  }

  /**
   * Determine optimal execution strategy based on task
   */
  private determineExecutionStrategy(task: OrchestrationTask): 'single' | 'sequential' | 'parallel' | 'hierarchical' {
    if (task.task_type === 'single_agent') return 'single';
    if (task.task_type === 'multi_agent_sequential') return 'sequential';
    if (task.task_type === 'multi_agent_parallel') return 'parallel';
    if (task.task_type === 'hierarchical') return 'hierarchical';
    
    // Auto-determine based on complexity and requirements
    if (task.complexity_level === 'simple') return 'single';
    if (task.requirements.preferences.collaboration_style === 'independent') return 'parallel';
    if (task.requirements.preferences.speed_vs_quality === 'speed') return 'parallel';
    
    return 'sequential';
  }

  /**
   * Select agents based on task requirements
   */
  private selectAgentsForTask(task: OrchestrationTask): AIAgent[] {
    const selectedAgents: AIAgent[] = [];
    const requiredCapabilities = task.requirements.constraints.required_capabilities || [];
    
    // Always include coordinator for complex tasks
    if (task.complexity_level === 'complex' || task.complexity_level === 'expert') {
      const coordinator = this.agents.get('coordinator');
      if (coordinator) selectedAgents.push(coordinator);
    }

    // Select specialists based on task deliverables
    for (const deliverable of task.requirements.deliverables) {
      const matchingAgents = Array.from(this.agents.values()).filter(agent => {
        return agent.specializations.some(spec => 
          deliverable.toLowerCase().includes(spec.replace('_', ' '))
        ) && agent.is_active;
      });

      matchingAgents.forEach(agent => {
        if (!selectedAgents.find(sa => sa.id === agent.id)) {
          selectedAgents.push(agent);
        }
      });
    }

    // Always include QA reviewer for quality assurance
    if (task.requirements.preferences.speed_vs_quality !== 'speed') {
      const qaReviewer = this.agents.get('qa-reviewer');
      if (qaReviewer && !selectedAgents.find(sa => sa.id === qaReviewer.id)) {
        selectedAgents.push(qaReviewer);
      }
    }

    return selectedAgents.slice(0, 5); // Limit to 5 agents to avoid complexity
  }

  /**
   * Create execution steps based on selected agents and strategy
   */
  private async createExecutionSteps(
    task: OrchestrationTask,
    agents: AIAgent[],
    strategy: string
  ): Promise<ExecutionStep[]> {
    const steps: ExecutionStep[] = [];
    let stepNumber = 1;

    if (strategy === 'single' && agents.length > 0) {
      // Single agent execution
      const agent = agents[0];
      steps.push({
        step_number: stepNumber++,
        agent_id: agent.id,
        agent_role: 'primary',
        action_type: 'generate',
        input_description: `Complete task: ${task.title}`,
        output_description: task.requirements.deliverables.join(', '),
        estimated_duration_minutes: this.estimateStepDuration(agent, task),
        estimated_cost_usd: this.estimateStepCost(agent, task),
        ai_request_template: {
          task_type: 'code_generation',
          priority: 'medium',
          content: {
            prompt: `Task: ${task.title}\nDescription: ${task.description}`,
            context: JSON.stringify(task.context),
          }
        },
        success_criteria: this.generateSuccessCriteria(task, 'primary')
      });
    } else {
      // Multi-agent execution
      const specialists = agents.filter(a => a.type === 'specialist' || a.type === 'generalist');
      const reviewers = agents.filter(a => a.type === 'reviewer');
      const coordinators = agents.filter(a => a.type === 'coordinator');

      // Coordination step (if coordinator present)
      if (coordinators.length > 0) {
        steps.push({
          step_number: stepNumber++,
          agent_id: coordinators[0].id,
          agent_role: 'coordinator',
          action_type: 'coordinate',
          input_description: `Plan and coordinate task execution: ${task.title}`,
          output_description: 'Execution plan and task breakdown',
          estimated_duration_minutes: 3,
          estimated_cost_usd: 0.02,
          ai_request_template: {
            task_type: 'analysis',
            priority: 'high',
            content: {
              prompt: `Create detailed execution plan for: ${task.title}`,
              context: JSON.stringify(task)
            }
          },
          success_criteria: ['Clear task breakdown provided', 'Dependencies identified']
        });
      }

      // Primary execution steps
      for (const agent of specialists) {
        steps.push({
          step_number: stepNumber++,
          agent_id: agent.id,
          agent_role: 'primary',
          action_type: 'generate',
          input_description: `Execute specialized task using ${agent.name}`,
          output_description: `Deliverable matching agent specialization`,
          estimated_duration_minutes: this.estimateStepDuration(agent, task),
          estimated_cost_usd: this.estimateStepCost(agent, task),
          ai_request_template: {
            task_type: this.mapAgentToTaskType(agent),
            priority: 'medium',
            content: {
              prompt: this.createSpecializedPrompt(agent, task),
              context: JSON.stringify(task.context)
            }
          },
          success_criteria: this.generateSuccessCriteria(task, agent.type),
          fallback_options: this.findFallbackAgents(agent, agents)
        });
      }

      // Review step
      if (reviewers.length > 0) {
        steps.push({
          step_number: stepNumber++,
          agent_id: reviewers[0].id,
          agent_role: 'reviewer',
          action_type: 'review',
          input_description: 'Review and validate all previous outputs',
          output_description: 'Quality assessment and improvement suggestions',
          estimated_duration_minutes: this.estimateStepDuration(reviewers[0], task) * 0.7,
          estimated_cost_usd: this.estimateStepCost(reviewers[0], task) * 0.7,
          ai_request_template: {
            task_type: 'code_review',
            priority: 'high',
            content: {
              prompt: 'Review and assess quality of the following outputs',
              context: 'Previous step outputs will be provided'
            }
          },
          success_criteria: [
            'Quality issues identified',
            'Improvement suggestions provided',
            'Overall quality score assigned'
          ]
        });
      }
    }

    return steps;
  }

  // Helper methods for step creation
  private estimateStepDuration(agent: AIAgent, task: OrchestrationTask): number {
    const baseTime = {
      'simple': 2,
      'medium': 5,
      'complex': 12,
      'expert': 20
    }[task.complexity_level];

    const agentMultiplier = 2 - agent.performance_profile.speed_score;
    
    return Math.round(baseTime * agentMultiplier);
  }

  private estimateStepCost(agent: AIAgent, task: OrchestrationTask): number {
    const baseCost = {
      'simple': 0.05,
      'medium': 0.15,
      'complex': 0.35,
      'expert': 0.75
    }[task.complexity_level];

    return baseCost;
  }

  private mapAgentToTaskType(agent: AIAgent): AIRequest['task_type'] {
    if (agent.specializations.includes('code_generation')) return 'code_generation';
    if (agent.specializations.includes('code_review')) return 'code_review';
    if (agent.specializations.includes('documentation')) return 'documentation';
    if (agent.specializations.includes('testing')) return 'testing';
    return 'analysis';
  }

  private createSpecializedPrompt(agent: AIAgent, task: OrchestrationTask): string {
    return `As a ${agent.name}, please ${task.description}. Focus on your specializations: ${agent.specializations.join(', ')}.`;
  }

  private generateSuccessCriteria(task: OrchestrationTask, role: string): string[] {
    const baseCriteria = ['Output is complete', 'Requirements are addressed'];
    
    if (role === 'primary' || role === 'specialist') {
      baseCriteria.push('Technical accuracy verified', 'Best practices followed');
    }
    
    if (role === 'reviewer') {
      baseCriteria.push('Quality issues identified', 'Constructive feedback provided');
    }
    
    return baseCriteria;
  }

  private findFallbackAgents(primaryAgent: AIAgent, allAgents: AIAgent[]): Array<{ agent_id: string; reason: string }> {
    return allAgents
      .filter(agent => 
        agent.id !== primaryAgent.id && 
        agent.specializations.some(spec => primaryAgent.specializations.includes(spec))
      )
      .slice(0, 2)
      .map(agent => ({
        agent_id: agent.id,
        reason: `Alternative ${agent.type} with overlapping specializations`
      }));
  }

  // Additional helper methods would continue here...
  
  private calculateStepDependencies(steps: ExecutionStep[], strategy: string): Array<{ from_step: number; to_step: number; type: 'output' | 'approval' | 'sync' }> {
    // Mock implementation
    return [];
  }

  private defineQualityGates(task: OrchestrationTask, steps: ExecutionStep[]): Array<{ step_number: number; criteria: string[]; auto_pass_threshold: number }> {
    // Mock implementation
    return [];
  }

  private calculateExecutionEstimates(steps: ExecutionStep[]): { duration: number; cost: number; confidence: number } {
    const duration = steps.reduce((sum, step) => sum + step.estimated_duration_minutes, 0);
    const cost = steps.reduce((sum, step) => sum + step.estimated_cost_usd, 0);
    const confidence = 0.85; // Mock confidence score

    return { duration, cost, confidence };
  }

  private createAIRequestFromStep(task: OrchestrationTask, step: ExecutionStep, executionResult: ExecutionResult): AIRequest {
    return {
      id: `${task.id}_step_${step.step_number}`,
      user_id: task.user_id,
      organization_id: task.organization_id,
      ...step.ai_request_template,
      created_at: new Date()
    } as AIRequest;
  }

  private processStepOutput(aiResponse: AIResponse, step: ExecutionStep): any {
    // Mock processing
    return {
      content: aiResponse.response_content,
      step_type: step.action_type,
      agent_id: step.agent_id
    };
  }

  private calculateStepQuality(aiResponse: AIResponse, step: ExecutionStep): number {
    // Use AI response quality indicators
    const indicators = aiResponse.metadata.quality_indicators;
    if (indicators && indicators.confidence_score && indicators.relevance_score && indicators.completeness_score) {
      return (indicators.confidence_score + indicators.relevance_score + indicators.completeness_score) / 3;
    }
    return 0.8; // Default quality score
  }

  private async evaluateSuccessCriteria(criteria: string[], outputData: any, aiResponse: AIResponse): Promise<boolean[]> {
    // Mock evaluation - in real implementation would use AI to evaluate criteria
    return criteria.map(() => aiResponse.success && Math.random() > 0.2);
  }

  private groupStepsByLevel(steps: ExecutionStep[], dependencies: any[]): ExecutionStep[][] {
    // Mock implementation - group steps by dependency levels
    return [steps];
  }

  private async handleQualityGateFailure(step: ExecutionStep, stepResult: StepResult, qualityGate: any): Promise<void> {
    console.log(`Quality gate failed for step ${step.step_number}`);
    // Could implement retry logic, escalation, etc.
  }

  private async finalizeExecution(task: OrchestrationTask, plan: ExecutionPlan, result: ExecutionResult): Promise<void> {
    // Aggregate final results
    result.final_output.metadata.total_cost_usd = result.step_results.reduce((sum, sr) => sum + sr.cost_usd, 0);
    result.final_output.metadata.total_duration_minutes = result.step_results.reduce((sum, sr) => sum + sr.duration_minutes, 0);
    result.final_output.metadata.agents_used = [...new Set(result.step_results.map(sr => sr.agent_id))];
    
    // Calculate quality assessment
    const qualityScores = result.step_results.map(sr => sr.quality_score).filter(score => score > 0);
    result.quality_assessment.overall_score = qualityScores.reduce((sum, score) => sum + score, 0) / qualityScores.length;
    
    // Generate lessons learned
    result.lessons_learned = this.generateLessonsLearned(result);
  }

  private generateLessonsLearned(result: ExecutionResult): string[] {
    const lessons = [];
    
    if (result.final_output.metadata.total_cost_usd > 1.0) {
      lessons.push('Consider optimizing for cost in future similar tasks');
    }
    
    if (result.quality_assessment.overall_score > 0.9) {
      lessons.push('Excellent quality achieved - consider this approach for similar tasks');
    }
    
    return lessons;
  }

  private startPerformanceMonitoring(): void {
    setInterval(() => {
      this.emit('performance_metrics', {
        active_tasks: this.activeTasks.size,
        agents: Array.from(this.agents.values()).map(agent => ({
          id: agent.id,
          active: agent.is_active,
          performance: agent.performance_profile
        }))
      });
    }, 60000);
  }

  /**
   * Public API methods
   */
  getAgents(): AIAgent[] {
    return Array.from(this.agents.values());
  }

  getActiveTasks(): ExecutionResult[] {
    return Array.from(this.activeTasks.values());
  }

  getTaskHistory(): ExecutionResult[] {
    return Array.from(this.taskHistory.values());
  }

  async cancelTask(taskId: string): Promise<boolean> {
    const task = this.activeTasks.get(taskId);
    if (task) {
      task.status = 'cancelled';
      task.completed_at = new Date();
      this.activeTasks.delete(taskId);
      this.taskHistory.set(taskId, task);
      return true;
    }
    return false;
  }

  destroy(): void {
    this.agents.clear();
    this.activeTasks.clear();
    this.taskHistory.clear();
    this.removeAllListeners();
  }
}

export default AIOrchestrationService;