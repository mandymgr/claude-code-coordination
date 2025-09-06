/**
 * AI Agent Pool - KRIN's intelligent agent management system
 */

import { v4 as uuidv4 } from 'uuid';
import chalk from 'chalk';

export interface AIAgent {
  id: string;
  name: string;
  type: 'claude' | 'gpt4' | 'gemini';
  status: 'idle' | 'busy' | 'error';
  capabilities: string[];
  currentTasks: Task[];
  metrics: {
    tasksCompleted: number;
    successRate: number;
    avgResponseTime: number;
    tokensUsed: number;
    specializations: string[];
  };
}

export interface Task {
  id: string;
  description: string;
  assignedAgent: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  context?: string;
  files: string[];
  deadline?: string;
  createdAt: Date;
  completedAt?: Date;
  estimatedTime: number;
}

export interface TaskAssignment {
  taskId: string;
  assignedAgent: string;
  reasoning: string;
  estimatedTime: string;
  confidence: number;
}

export class AIAgentPool {
  private agents: Map<string, AIAgent> = new Map();
  private tasks: Map<string, Task> = new Map();

  constructor() {
    this.initializeAgents();
  }

  private initializeAgents(): void {
    const agentConfigs = [
      {
        id: 'claude-1',
        name: 'Claude Sonnet',
        type: 'claude' as const,
        capabilities: ['frontend', 'ui-ux', 'react', 'typescript', 'documentation', 'code-review']
      },
      {
        id: 'gpt4-1',
        name: 'GPT-4 Turbo',
        type: 'gpt4' as const,
        capabilities: ['backend', 'api-design', 'database', 'algorithms', 'system-architecture', 'debugging']
      },
      {
        id: 'gemini-1',
        name: 'Gemini Pro',
        type: 'gemini' as const,
        capabilities: ['devops', 'infrastructure', 'deployment', 'monitoring', 'automation', 'performance']
      }
    ];

    for (const config of agentConfigs) {
      const agent: AIAgent = {
        id: config.id,
        name: config.name,
        type: config.type,
        status: 'idle',
        capabilities: config.capabilities,
        currentTasks: [],
        metrics: {
          tasksCompleted: Math.floor(Math.random() * 50) + 10,
          successRate: Math.floor(Math.random() * 15) + 85,
          avgResponseTime: Math.floor(Math.random() * 2000) + 800,
          tokensUsed: Math.floor(Math.random() * 40000) + 15000,
          specializations: config.capabilities
        }
      };
      
      this.agents.set(agent.id, agent);
    }

    console.log(chalk.green(`🤖 KRIN: Initialized ${this.agents.size} AI agents`));
  }

  async assignTask(options: {
    task: string;
    agentPreference?: string;
    context?: string;
    files?: string[];
    deadline?: string;
  }): Promise<TaskAssignment> {
    const { task, agentPreference = 'auto', context, files = [], deadline } = options;

    const taskObj: Task = {
      id: uuidv4(),
      description: task,
      assignedAgent: '',
      status: 'pending',
      context,
      files,
      deadline,
      createdAt: new Date(),
      estimatedTime: this.estimateTaskTime(task)
    };

    // KRIN's intelligent agent selection
    let selectedAgent: AIAgent;
    let reasoning: string;

    if (agentPreference !== 'auto') {
      // Use preferred agent if available
      selectedAgent = Array.from(this.agents.values()).find(a => a.type === agentPreference) 
        || Array.from(this.agents.values())[0];
      reasoning = `User requested ${agentPreference}`;
    } else {
      // KRIN analyzes task and selects optimal agent
      selectedAgent = this.selectOptimalAgent(task, context, files);
      reasoning = this.getSelectionReasoning(selectedAgent, task);
    }

    // Assign task to agent
    taskObj.assignedAgent = selectedAgent.id;
    taskObj.status = 'in_progress';
    selectedAgent.currentTasks.push(taskObj);
    selectedAgent.status = 'busy';

    this.tasks.set(taskObj.id, taskObj);

    console.log(chalk.blue(`🎯 KRIN: Assigned task "${task.substring(0, 50)}..." to ${selectedAgent.name}`));

    // Simulate task completion after estimated time
    setTimeout(() => {
      this.completeTask(taskObj.id);
    }, Math.min(taskObj.estimatedTime * 100, 10000)); // Max 10 seconds for demo

    return {
      taskId: taskObj.id,
      assignedAgent: selectedAgent.name,
      reasoning,
      estimatedTime: `${Math.ceil(taskObj.estimatedTime / 60)} minutes`,
      confidence: this.calculateConfidence(selectedAgent, task)
    };
  }

  private selectOptimalAgent(task: string, context?: string, files: string[] = []): AIAgent {
    const taskLower = task.toLowerCase();
    const contextLower = context?.toLowerCase() || '';
    const fileExtensions = files.map(f => f.split('.').pop()?.toLowerCase()).filter(Boolean);

    let scores: { agent: AIAgent; score: number }[] = [];

    for (const agent of this.agents.values()) {
      let score = 0;

      // Capability matching
      for (const capability of agent.capabilities) {
        if (taskLower.includes(capability) || contextLower.includes(capability)) {
          score += 10;
        }
      }

      // File type matching
      if (fileExtensions.includes('tsx') || fileExtensions.includes('jsx')) {
        if (agent.capabilities.includes('react') || agent.capabilities.includes('frontend')) {
          score += 15;
        }
      }
      if (fileExtensions.includes('py') || fileExtensions.includes('js') || fileExtensions.includes('ts')) {
        if (agent.capabilities.includes('backend') || agent.capabilities.includes('algorithms')) {
          score += 10;
        }
      }
      if (fileExtensions.includes('yml') || fileExtensions.includes('dockerfile')) {
        if (agent.capabilities.includes('devops') || agent.capabilities.includes('deployment')) {
          score += 15;
        }
      }

      // Task type analysis
      if (taskLower.includes('ui') || taskLower.includes('frontend') || taskLower.includes('component')) {
        if (agent.type === 'claude') score += 20;
      }
      if (taskLower.includes('api') || taskLower.includes('backend') || taskLower.includes('database')) {
        if (agent.type === 'gpt4') score += 20;
      }
      if (taskLower.includes('deploy') || taskLower.includes('docker') || taskLower.includes('infrastructure')) {
        if (agent.type === 'gemini') score += 20;
      }

      // Availability bonus
      if (agent.status === 'idle') score += 5;

      // Performance bonus
      score += agent.metrics.successRate / 10;

      scores.push({ agent, score });
    }

    // Sort by score and return best match
    scores.sort((a, b) => b.score - a.score);
    return scores[0]?.agent || Array.from(this.agents.values())[0];
  }

  private getSelectionReasoning(agent: AIAgent, task: string): string {
    const taskLower = task.toLowerCase();
    
    if (taskLower.includes('ui') || taskLower.includes('frontend')) {
      return `Selected ${agent.name} for frontend expertise and React specialization`;
    }
    if (taskLower.includes('api') || taskLower.includes('backend')) {
      return `Selected ${agent.name} for backend development and system architecture`;
    }
    if (taskLower.includes('deploy') || taskLower.includes('docker')) {
      return `Selected ${agent.name} for DevOps expertise and deployment automation`;
    }
    
    return `Selected ${agent.name} based on capability match and current availability`;
  }

  private estimateTaskTime(task: string): number {
    const taskLower = task.toLowerCase();
    let baseTime = 30; // 30 minutes base

    // Complexity indicators
    if (taskLower.includes('complex') || taskLower.includes('architecture')) baseTime += 60;
    if (taskLower.includes('simple') || taskLower.includes('fix')) baseTime -= 15;
    if (taskLower.includes('design') || taskLower.includes('implement')) baseTime += 30;
    if (taskLower.includes('test') || taskLower.includes('debug')) baseTime += 20;

    return Math.max(15, baseTime); // Minimum 15 minutes
  }

  private calculateConfidence(agent: AIAgent, task: string): number {
    let confidence = agent.metrics.successRate;
    
    // Boost confidence for matching capabilities
    const taskLower = task.toLowerCase();
    for (const capability of agent.capabilities) {
      if (taskLower.includes(capability)) {
        confidence = Math.min(95, confidence + 5);
      }
    }

    return Math.round(confidence);
  }

  private async completeTask(taskId: string): Promise<void> {
    const task = this.tasks.get(taskId);
    if (!task) return;

    const agent = this.agents.get(task.assignedAgent);
    if (!agent) return;

    // Simulate success/failure based on agent success rate
    const success = Math.random() * 100 < agent.metrics.successRate;

    task.status = success ? 'completed' : 'failed';
    task.completedAt = new Date();

    // Update agent
    agent.currentTasks = agent.currentTasks.filter(t => t.id !== taskId);
    if (agent.currentTasks.length === 0) {
      agent.status = 'idle';
    }

    // Update metrics
    if (success) {
      agent.metrics.tasksCompleted++;
    }

    console.log(chalk.green(`${success ? '✅' : '❌'} Task ${taskId.substring(0, 8)} ${success ? 'completed' : 'failed'} by ${agent.name}`));
  }

  async getStatus(agentId?: string, includeMetrics: boolean = true): Promise<any> {
    if (agentId) {
      const agent = this.agents.get(agentId);
      return agent ? { agents: { [agentId]: this.formatAgentStatus(agent, includeMetrics) } } : null;
    }

    const status: any = { agents: {} };
    for (const [id, agent] of this.agents.entries()) {
      status.agents[id] = this.formatAgentStatus(agent, includeMetrics);
    }

    return status;
  }

  private formatAgentStatus(agent: AIAgent, includeMetrics: boolean): any {
    const status: any = {
      name: agent.name,
      type: agent.type,
      status: agent.status,
      activeTasks: agent.currentTasks.length,
      capabilities: agent.capabilities
    };

    if (includeMetrics) {
      status.metrics = agent.metrics;
    }

    return status;
  }

  async optimize(options: {
    type: 'performance' | 'cost' | 'quality' | 'speed';
    includeHistory?: boolean;
  }): Promise<any> {
    const { type, includeHistory = true } = options;

    console.log(chalk.blue(`⚡ KRIN: Analyzing team for ${type} optimization...`));

    const recommendations: string[] = [];
    let expectedImprovement = '';

    switch (type) {
      case 'performance':
        recommendations.push('Increase Claude usage for UI/UX tasks (92% success rate)');
        recommendations.push('Route complex algorithms to GPT-4 (better logic handling)');
        recommendations.push('Use Gemini for all deployment tasks (specialized DevOps)');
        expectedImprovement = '15-25% improvement in task completion rate';
        break;

      case 'cost':
        recommendations.push('Optimize token usage by better task chunking');
        recommendations.push('Use cheaper models for simple tasks');
        recommendations.push('Implement caching for repetitive queries');
        expectedImprovement = '20-30% reduction in API costs';
        break;

      case 'quality':
        recommendations.push('Enable stricter quality gates');
        recommendations.push('Implement peer review between agents');
        recommendations.push('Add automated testing requirements');
        expectedImprovement = '10-15% improvement in code quality scores';
        break;

      case 'speed':
        recommendations.push('Parallel task assignment when possible');
        recommendations.push('Pre-load contexts for frequently used patterns');
        recommendations.push('Optimize agent switching overhead');
        expectedImprovement = '25-40% faster task completion';
        break;
    }

    return {
      type,
      recommendations,
      expectedImprovement,
      status: 'recommendations_ready',
      implementedAt: null
    };
  }
}