#!/usr/bin/env node

/**
 * Claude Code Coordination MCP Server
 * KRIN AI Team Management & Multi-Agent Coordination
 * 
 * This MCP server enables Claude to coordinate with other AI agents (GPT-4, Gemini)
 * through KRIN as the master orchestrator.
 */

import { Server } from '@modelcontextprotocol/sdk/server/index.js';
import { StdioServerTransport } from '@modelcontextprotocol/sdk/server/stdio.js';
import {
  CallToolRequestSchema,
  ErrorCode,
  ListToolsRequestSchema,
  McpError,
  Tool,
} from '@modelcontextprotocol/sdk/types.js';
import chalk from 'chalk';
import { CoordinationManager } from './coordination/manager.js';
import { AIAgentPool } from './agents/pool.js';
import { QualityGateRunner } from './quality/runner.js';
import { setupTools } from './tools/index.js';
import { setupResources } from './resources/index.js';
import { setupPrompts } from './prompts/index.js';

const SERVER_NAME = 'claude-coordination-mcp';
const SERVER_VERSION = '3.0.0';

class ClaudeCoordinationMCPServer {
  private server: Server;
  private coordinationManager: CoordinationManager;
  private agentPool: AIAgentPool;
  private qualityGate: QualityGateRunner;
  private tools: Map<string, Tool> = new Map();

  constructor() {
    this.server = new Server(
      {
        name: SERVER_NAME,
        version: SERVER_VERSION,
      },
      {
        capabilities: {
          tools: {},
          resources: {},
          prompts: {},
        },
      }
    );

    this.coordinationManager = new CoordinationManager();
    this.agentPool = new AIAgentPool();
    this.qualityGate = new QualityGateRunner();

    this.setupHandlers();
  }

  private setupHandlers(): void {
    // List available tools
    this.server.setRequestHandler(ListToolsRequestSchema, async () => {
      const tools = Array.from(this.tools.values());
      return { tools };
    });

    // Handle tool calls
    this.server.setRequestHandler(CallToolRequestSchema, async (request) => {
      const { name, arguments: args } = request.params;
      
      console.log(chalk.blue(`🔧 Executing tool: ${name}`), args);

      try {
        switch (name) {
          case 'krin_coordinate_session':
            return await this.handleCoordinateSession(args);
          
          case 'krin_assign_task':
            return await this.handleAssignTask(args);
          
          case 'krin_get_agent_status':
            return await this.handleGetAgentStatus(args);
          
          case 'krin_run_quality_gate':
            return await this.handleRunQualityGate(args);
          
          case 'krin_get_session_metrics':
            return await this.handleGetSessionMetrics(args);
          
          case 'krin_manage_file_locks':
            return await this.handleManageFileLocks(args);
          
          case 'krin_optimize_team':
            return await this.handleOptimizeTeam(args);
          
          case 'krin_generate_report':
            return await this.handleGenerateReport(args);

          default:
            throw new McpError(
              ErrorCode.MethodNotFound,
              `Unknown tool: ${name}`
            );
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : String(error);
        console.error(chalk.red(`❌ Tool execution failed: ${message}`));
        throw new McpError(ErrorCode.InternalError, message);
      }
    });

    this.setupTools();
    this.setupErrorHandling();
  }

  private setupTools(): void {
    // KRIN Master Coordination Tools
    const tools: Tool[] = [
      {
        name: 'krin_coordinate_session',
        description: 'KRIN creates and manages AI coordination sessions with multiple agents',
        inputSchema: {
          type: 'object',
          properties: {
            session_name: {
              type: 'string',
              description: 'Name for the coordination session'
            },
            agents: {
              type: 'array',
              items: {
                type: 'string',
                enum: ['claude', 'gpt4', 'gemini']
              },
              description: 'AI agents to include in session'
            },
            objective: {
              type: 'string',
              description: 'Main objective for the coordination session'
            },
            priority: {
              type: 'string',
              enum: ['low', 'medium', 'high', 'critical'],
              description: 'Session priority level'
            }
          },
          required: ['session_name', 'agents', 'objective']
        }
      },
      {
        name: 'krin_assign_task',
        description: 'KRIN intelligently assigns tasks to the most suitable AI agent based on capabilities',
        inputSchema: {
          type: 'object',
          properties: {
            task: {
              type: 'string',
              description: 'Task description'
            },
            agent_preference: {
              type: 'string',
              enum: ['claude', 'gpt4', 'gemini', 'auto'],
              description: 'Preferred agent or let KRIN decide automatically'
            },
            context: {
              type: 'string',
              description: 'Additional context for the task'
            },
            files: {
              type: 'array',
              items: { type: 'string' },
              description: 'Files relevant to the task'
            },
            deadline: {
              type: 'string',
              description: 'Task deadline (ISO 8601 format)'
            }
          },
          required: ['task']
        }
      },
      {
        name: 'krin_get_agent_status',
        description: 'Get real-time status and performance metrics for all AI agents',
        inputSchema: {
          type: 'object',
          properties: {
            agent_id: {
              type: 'string',
              description: 'Specific agent ID (optional, returns all if not specified)'
            },
            include_metrics: {
              type: 'boolean',
              description: 'Include performance metrics',
              default: true
            }
          }
        }
      },
      {
        name: 'krin_run_quality_gate',
        description: 'Execute quality gates with automatic issue detection and fixing',
        inputSchema: {
          type: 'object',
          properties: {
            files: {
              type: 'array',
              items: { type: 'string' },
              description: 'Files to analyze'
            },
            checks: {
              type: 'array',
              items: {
                type: 'string',
                enum: ['typescript', 'eslint', 'security', 'performance', 'tests']
              },
              description: 'Quality checks to run'
            },
            auto_fix: {
              type: 'boolean',
              description: 'Automatically fix issues when possible',
              default: true
            }
          },
          required: ['files']
        }
      },
      {
        name: 'krin_get_session_metrics',
        description: 'Retrieve comprehensive metrics for coordination sessions',
        inputSchema: {
          type: 'object',
          properties: {
            session_id: {
              type: 'string',
              description: 'Session ID (optional, returns current session if not specified)'
            },
            time_range: {
              type: 'string',
              enum: ['1h', '6h', '24h', '7d', '30d'],
              description: 'Time range for metrics',
              default: '24h'
            }
          }
        }
      },
      {
        name: 'krin_manage_file_locks',
        description: 'Manage file locking for coordination safety',
        inputSchema: {
          type: 'object',
          properties: {
            action: {
              type: 'string',
              enum: ['lock', 'unlock', 'status'],
              description: 'Lock action to perform'
            },
            file_path: {
              type: 'string',
              description: 'Path to file'
            },
            reason: {
              type: 'string',
              description: 'Reason for locking (required for lock action)'
            }
          },
          required: ['action', 'file_path']
        }
      },
      {
        name: 'krin_optimize_team',
        description: 'KRIN analyzes and optimizes AI team performance',
        inputSchema: {
          type: 'object',
          properties: {
            optimization_type: {
              type: 'string',
              enum: ['performance', 'cost', 'quality', 'speed'],
              description: 'Type of optimization to perform'
            },
            analyze_history: {
              type: 'boolean',
              description: 'Include historical data in optimization',
              default: true
            }
          }
        }
      },
      {
        name: 'krin_generate_report',
        description: 'Generate comprehensive coordination reports',
        inputSchema: {
          type: 'object',
          properties: {
            report_type: {
              type: 'string',
              enum: ['session_summary', 'agent_performance', 'quality_metrics', 'executive'],
              description: 'Type of report to generate'
            },
            session_id: {
              type: 'string',
              description: 'Session ID for session-specific reports'
            },
            format: {
              type: 'string',
              enum: ['json', 'markdown', 'html'],
              description: 'Report format',
              default: 'markdown'
            }
          },
          required: ['report_type']
        }
      }
    ];

    tools.forEach(tool => {
      this.tools.set(tool.name, tool);
    });

    console.log(chalk.green(`🔧 Registered ${tools.length} KRIN coordination tools`));
  }

  private setupErrorHandling(): void {
    this.server.onerror = (error) => {
      console.error(chalk.red('🚨 MCP Server Error:'), error);
    };

    process.on('SIGINT', async () => {
      console.log(chalk.yellow('\\n🛑 Shutting down KRIN Coordination MCP Server...'));
      await this.coordinationManager.cleanup();
      process.exit(0);
    });
  }

  // Tool Handlers
  private async handleCoordinateSession(args: any) {
    const { session_name, agents, objective, priority = 'medium' } = args;
    
    console.log(chalk.blue(`🎯 KRIN: Creating coordination session "${session_name}"`));
    
    const session = await this.coordinationManager.createSession({
      name: session_name,
      agents,
      objective,
      priority
    });

    return {
      content: [{
        type: 'text',
        text: `🎯 KRIN has created coordination session: "${session_name}"\\n\\n` +
              `**Agents:** ${agents.join(', ')}\\n` +
              `**Objective:** ${objective}\\n` +
              `**Priority:** ${priority}\\n` +
              `**Session ID:** ${session.id}\\n\\n` +
              `Session is now active and ready for task assignment.`
      }]
    };
  }

  private async handleAssignTask(args: any) {
    const { task, agent_preference = 'auto', context, files = [], deadline } = args;
    
    console.log(chalk.blue(`🤖 KRIN: Assigning task to ${agent_preference === 'auto' ? 'optimal agent' : agent_preference}`));
    
    const assignment = await this.agentPool.assignTask({
      task,
      agentPreference: agent_preference,
      context,
      files,
      deadline
    });

    return {
      content: [{
        type: 'text',
        text: `🤖 KRIN has assigned the task:\\n\\n` +
              `**Task:** ${task}\\n` +
              `**Assigned to:** ${assignment.assignedAgent}\\n` +
              `**Reasoning:** ${assignment.reasoning}\\n` +
              `**Estimated completion:** ${assignment.estimatedTime}\\n\\n` +
              `Task is now in progress. Use krin_get_agent_status to monitor.`
      }]
    };
  }

  private async handleGetAgentStatus(args: any) {
    const { agent_id, include_metrics = true } = args;
    
    const status = await this.agentPool.getStatus(agent_id, include_metrics);
    
    let statusText = '🤖 **AI Agent Status Report**\\n\\n';
    
    for (const [agentId, agentStatus] of Object.entries(status.agents)) {
      statusText += `**${agentId.toUpperCase()}:**\\n`;
      statusText += `- Status: ${(agentStatus as any).status}\\n`;
      statusText += `- Active Tasks: ${(agentStatus as any).activeTasks}\\n`;
      statusText += `- Success Rate: ${(agentStatus as any).successRate}%\\n`;
      if (include_metrics) {
        statusText += `- Avg Response Time: ${(agentStatus as any).avgResponseTime}ms\\n`;
        statusText += `- Tokens Used Today: ${(agentStatus as any).tokensUsed}\\n`;
      }
      statusText += '\\n';
    }

    return {
      content: [{
        type: 'text',
        text: statusText
      }]
    };
  }

  private async handleRunQualityGate(args: any) {
    const { files, checks = ['typescript', 'eslint', 'security'], auto_fix = true } = args;
    
    console.log(chalk.blue(`🛡️ KRIN: Running quality gates on ${files.length} files`));
    
    const results = await this.qualityGate.run({
      files,
      checks,
      autoFix: auto_fix
    });

    let resultText = '🛡️ **Quality Gate Results**\\n\\n';
    resultText += `**Overall Status:** ${results.passed ? '✅ PASSED' : '❌ FAILED'}\\n\\n`;
    
    for (const check of results.checks) {
      resultText += `**${check.name}:** ${check.passed ? '✅' : '❌'} ${check.message}\\n`;
      if (check.issues?.length > 0) {
        resultText += `  - ${check.issues.length} issues found\\n`;
        if (auto_fix && check.fixedIssues > 0) {
          resultText += `  - ${check.fixedIssues} issues auto-fixed\\n`;
        }
      }
    }

    return {
      content: [{
        type: 'text',
        text: resultText
      }]
    };
  }

  private async handleGetSessionMetrics(args: any) {
    const { session_id, time_range = '24h' } = args;
    
    const metrics = await this.coordinationManager.getMetrics(session_id, time_range);
    
    const metricsText = '📊 **Session Metrics Report**\\n\\n' +
      `**Active Sessions:** ${metrics.activeSessions}\\n` +
      `**Tasks Completed:** ${metrics.completedTasks}\\n` +
      `**Success Rate:** ${metrics.successRate}%\\n` +
      `**Avg Response Time:** ${metrics.avgResponseTime}ms\\n` +
      `**Total Tokens Used:** ${metrics.totalTokens}\\n\\n` +
      `**Agent Performance:**\\n` +
      Object.entries(metrics.agentMetrics)
        .map(([agent, perf]: [string, any]) => 
          `- ${agent}: ${perf.completedTasks} tasks, ${perf.successRate}% success`)
        .join('\\n');

    return {
      content: [{
        type: 'text',
        text: metricsText
      }]
    };
  }

  private async handleManageFileLocks(args: any) {
    const { action, file_path, reason } = args;
    
    const result = await this.coordinationManager.manageFileLock({
      action,
      filePath: file_path,
      reason
    });

    let resultText = '';
    switch (action) {
      case 'lock':
        resultText = `🔒 File locked: ${file_path}\\nReason: ${reason}`;
        break;
      case 'unlock':
        resultText = `🔓 File unlocked: ${file_path}`;
        break;
      case 'status':
        resultText = `📋 File lock status for ${file_path}:\\n${result.isLocked ? 'Locked' : 'Unlocked'}`;
        if (result.isLocked) {
          resultText += `\\nReason: ${result.reason}\\nLocked by: ${result.lockedBy}`;
        }
        break;
    }

    return {
      content: [{
        type: 'text',
        text: resultText
      }]
    };
  }

  private async handleOptimizeTeam(args: any) {
    const { optimization_type = 'performance', analyze_history = true } = args;
    
    console.log(chalk.blue(`⚡ KRIN: Optimizing team for ${optimization_type}`));
    
    const optimization = await this.agentPool.optimize({
      type: optimization_type,
      includeHistory: analyze_history
    });

    const optimizationText = `⚡ **KRIN Team Optimization Report**\\n\\n` +
      `**Optimization Type:** ${optimization_type}\\n` +
      `**Recommendations:**\\n${optimization.recommendations.map((rec: string) => `- ${rec}`).join('\\n')}\\n\\n` +
      `**Expected Improvement:** ${optimization.expectedImprovement}\\n` +
      `**Implementation Status:** ${optimization.status}`;

    return {
      content: [{
        type: 'text',
        text: optimizationText
      }]
    };
  }

  private async handleGenerateReport(args: any) {
    const { report_type, session_id, format = 'markdown' } = args;
    
    const report = await this.coordinationManager.generateReport({
      type: report_type,
      sessionId: session_id,
      format
    });

    return {
      content: [{
        type: 'text',
        text: report.content
      }]
    };
  }

  async start(): Promise<void> {
    const transport = new StdioServerTransport();
    await this.server.connect(transport);
    
    console.log(chalk.green.bold('🚀 KRIN Coordination MCP Server started successfully!'));
    console.log(chalk.blue('🤖 Ready to coordinate AI teams through Claude...'));
  }
}

// Start the server
if (import.meta.url === `file://${process.argv[1]}`) {
  const server = new ClaudeCoordinationMCPServer();
  server.start().catch((error) => {
    console.error(chalk.red('Failed to start MCP server:'), error);
    process.exit(1);
  });
}

export { ClaudeCoordinationMCPServer };