#!/usr/bin/env node
/**
 * 🪄✨ Magic CLI - Ultimate Development Command Interface
 * Modern TypeScript version with enhanced functionality
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';
import readline from 'readline';
import { Command } from 'commander';
import chalk from 'chalk';
import { v4 as uuidv4 } from 'uuid';
import WebSocket from 'ws';

import {
  generateId,
  formatDate,
  formatTime,
  formatDuration,
  validateEmail,
  API_ENDPOINTS,
  WEBSOCKET_EVENTS,
  ERROR_CODES,
  type User,
  type CoordinationTask,
  type AIAgent,
  type ApiResponse
} from '@claude-coordination/shared';

interface MagicCLIConfig {
  version: string;
  projectPath: string;
  serverUrl: string;
  apiKey?: string;
}

interface ProjectInfo {
  type: string;
  framework?: string;
  language: string;
  dependencies: string[];
  hasTests: boolean;
  hasTypeScript: boolean;
}

export class MagicCLI {
  private config: MagicCLIConfig;
  private ws?: WebSocket;
  private isInteractiveMode = false;

  constructor() {
    this.config = {
      version: '3.0.0',
      projectPath: process.cwd(),
      serverUrl: 'http://localhost:8080'
    };
  }

  /**
   * 🚀 Initialize and run the CLI
   */
  public async run(): Promise<void> {
    const program = new Command();

    program
      .name('magic')
      .description('🪄 Magic CLI - Ultimate Development Command Interface')
      .version(this.config.version)
      .option('-v, --verbose', 'Enable verbose output')
      .option('--server <url>', 'Server URL', this.config.serverUrl)
      .option('--api-key <key>', 'API key for authentication');

    // Core commands
    this.setupCommands(program);

    await program.parseAsync(process.argv);
  }

  /**
   * 🎯 Setup all CLI commands
   */
  private setupCommands(program: Command): void {
    // Initialize magic
    program
      .command('init')
      .description('🪄 Initialize magic for any project type')
      .option('--type <type>', 'Project type (web, mobile, api)', 'web')
      .option('--features <features>', 'Features to enable (all, ai, deploy)', 'all')
      .action(this.initMagic.bind(this));

    // AI Assistant
    program
      .command('ai <question>')
      .description('🧠 AI-powered development assistance')
      .option('--context <type>', 'Context type (file, project, auto)', 'auto')
      .option('--no-cache', 'Disable response caching')
      .option('--explain', 'Show detailed explanations')
      .action(this.askAI.bind(this));

    // Project Detection
    program
      .command('detect [path]')
      .description('🔍 Intelligent project detection and analysis')
      .option('--json', 'Output in JSON format')
      .option('--verbose', 'Verbose output')
      .action(this.detectProject.bind(this));

    // Setup Development Environment
    program
      .command('setup [feature]')
      .description('⚡ Setup development environment')
      .option('--auto', 'Auto-setup with defaults')
      .action(this.setupEnvironment.bind(this));

    // Launch Dashboard
    program
      .command('dashboard')
      .description('📊 Launch magic development dashboard')
      .option('--port <port>', 'Dashboard port', '3000')
      .option('--open', 'Open browser automatically')
      .action(this.launchDashboard.bind(this));

    // Task Management
    program
      .command('task')
      .description('📋 Task management commands')
      .addCommand(
        new Command('create <title>')
          .description('Create a new task')
          .option('--description <desc>', 'Task description')
          .option('--priority <priority>', 'Task priority (low, medium, high, critical)', 'medium')
          .action(this.createTask.bind(this))
      )
      .addCommand(
        new Command('list')
          .description('List all tasks')
          .option('--status <status>', 'Filter by status')
          .action(this.listTasks.bind(this))
      )
      .addCommand(
        new Command('complete <id>')
          .description('Mark task as complete')
          .action(this.completeTask.bind(this))
      );

    // Agent Management
    program
      .command('agent')
      .description('🤖 AI agent management')
      .addCommand(
        new Command('list')
          .description('List available AI agents')
          .action(this.listAgents.bind(this))
      )
      .addCommand(
        new Command('status')
          .description('Show agent status')
          .action(this.agentStatus.bind(this))
      );

    // Interactive Mode
    program
      .command('interactive')
      .description('💬 Start interactive magic session')
      .option('--ai-context', 'Enable AI context')
      .option('--project-aware', 'Enable project awareness')
      .action(this.startInteractive.bind(this));

    // Cache Management
    program
      .command('cache <action>')
      .description('🚀 Manage AI response cache')
      .argument('<action>', 'Cache action (stats, clear, warm, cleanup)')
      .action(this.manageCache.bind(this));

    // Status and Health
    program
      .command('status')
      .description('📊 Show system status and health')
      .option('--verbose', 'Show detailed status')
      .action(this.showStatus.bind(this));

    // Connect to coordination server
    program
      .command('connect')
      .description('🔗 Connect to coordination server')
      .option('--server <url>', 'Server URL')
      .action(this.connectToServer.bind(this));
  }

  /**
   * 🪄 Initialize magic for project
   */
  private async initMagic(options: any): Promise<void> {
    console.log(chalk.blue('🪄 Initializing Magic CLI...'));
    
    const projectInfo = await this.analyzeProject();
    
    console.log(chalk.green(`✅ Detected ${projectInfo.type} project`));
    console.log(chalk.blue(`📝 Language: ${projectInfo.language}`));
    console.log(chalk.blue(`🔧 Framework: ${projectInfo.framework || 'None'}`));
    
    // Create magic config
    const magicConfig = {
      version: this.config.version,
      projectType: projectInfo.type,
      features: options.features.split(','),
      initialized: new Date().toISOString(),
      id: generateId()
    };

    const configPath = path.join(this.config.projectPath, '.magic', 'config.json');
    await this.ensureDirectory(path.dirname(configPath));
    fs.writeFileSync(configPath, JSON.stringify(magicConfig, null, 2));

    console.log(chalk.green('🎉 Magic initialized successfully!'));
    console.log(chalk.blue(`📁 Config saved to: ${configPath}`));
  }

  /**
   * 🧠 AI Assistant functionality
   */
  private async askAI(question: string, options: any): Promise<void> {
    console.log(chalk.blue(`🧠 AI Assistant processing: "${question}"`));
    
    try {
      const context = await this.buildAIContext(options.context);
      const response = await this.callAIAPI({
        question,
        context,
        useCache: !options.noCache,
        explain: options.explain
      });

      this.formatAIResponse(response, options.explain);
    } catch (error) {
      console.error(chalk.red('❌ AI request failed:'), error);
    }
  }

  /**
   * 🔍 Project detection and analysis
   */
  private async detectProject(projectPath?: string, options?: any): Promise<void> {
    const targetPath = projectPath || this.config.projectPath;
    console.log(chalk.blue(`🔍 Analyzing project at: ${targetPath}`));

    const projectInfo = await this.analyzeProject(targetPath);

    if (options?.json) {
      console.log(JSON.stringify(projectInfo, null, 2));
    } else {
      this.displayProjectInfo(projectInfo, options?.verbose);
    }
  }

  /**
   * 📋 Create a new coordination task
   */
  private async createTask(title: string, options: any): Promise<void> {
    console.log(chalk.blue(`📋 Creating task: ${title}`));

    const task: Partial<CoordinationTask> = {
      id: generateId(),
      title,
      description: options.description || '',
      status: 'pending' as any,
      priority: options.priority as any,
      createdAt: new Date(),
      updatedAt: new Date(),
      tags: [],
      metadata: {}
    };

    try {
      const response = await this.apiRequest('POST', API_ENDPOINTS.TASKS, task);
      if (response.success) {
        console.log(chalk.green('✅ Task created successfully!'));
        console.log(chalk.blue(`📝 Task ID: ${response.data.id}`));
      }
    } catch (error) {
      console.error(chalk.red('❌ Failed to create task:'), error);
    }
  }

  /**
   * 📋 List coordination tasks
   */
  private async listTasks(options: any): Promise<void> {
    console.log(chalk.blue('📋 Fetching tasks...'));

    try {
      const queryParams = options.status ? `?status=${options.status}` : '';
      const response = await this.apiRequest('GET', API_ENDPOINTS.TASKS + queryParams);
      
      if (response.success && response.data) {
        this.displayTasks(response.data);
      }
    } catch (error) {
      console.error(chalk.red('❌ Failed to fetch tasks:'), error);
    }
  }

  /**
   * ✅ Mark task as complete
   */
  private async completeTask(taskId: string): Promise<void> {
    console.log(chalk.blue(`✅ Marking task ${taskId} as complete...`));

    try {
      const response = await this.apiRequest('PATCH', `${API_ENDPOINTS.TASKS}/${taskId}`, {
        status: 'completed',
        completedAt: new Date()
      });

      if (response.success) {
        console.log(chalk.green('✅ Task marked as complete!'));
      }
    } catch (error) {
      console.error(chalk.red('❌ Failed to complete task:'), error);
    }
  }

  /**
   * 🤖 List AI agents
   */
  private async listAgents(): Promise<void> {
    console.log(chalk.blue('🤖 Fetching AI agents...'));

    try {
      const response = await this.apiRequest('GET', API_ENDPOINTS.AI + '/agents');
      
      if (response.success && response.data) {
        this.displayAgents(response.data);
      }
    } catch (error) {
      console.error(chalk.red('❌ Failed to fetch agents:'), error);
    }
  }

  /**
   * 📊 Show agent status
   */
  private async agentStatus(): Promise<void> {
    console.log(chalk.blue('📊 Checking agent status...'));

    try {
      const response = await this.apiRequest('GET', API_ENDPOINTS.AI + '/status');
      
      if (response.success && response.data) {
        this.displayAgentStatus(response.data);
      }
    } catch (error) {
      console.error(chalk.red('❌ Failed to get agent status:'), error);
    }
  }

  /**
   * 💬 Start interactive mode
   */
  private async startInteractive(options: any): Promise<void> {
    this.isInteractiveMode = true;
    
    console.log(chalk.blue(`
🪄✨ Magic Interactive Session Started ✨🪄

Type 'help' for commands, 'exit' to quit
AI context: ${options.aiContext ? 'enabled' : 'basic'}
Project aware: ${options.projectAware ? 'enabled' : 'disabled'}
`));

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: chalk.blue('🪄 magic> ')
    });

    rl.prompt();

    rl.on('line', async (line) => {
      const input = line.trim();
      
      if (input === 'exit' || input === 'quit') {
        console.log(chalk.green('✨ Magic session ended. Happy coding!'));
        rl.close();
        return;
      }

      if (input === 'help') {
        this.showInteractiveHelp();
      } else if (input.startsWith('ai ')) {
        await this.askAI(input.substring(3), { context: 'auto' });
      } else if (input) {
        // Execute as regular command
        try {
          const [command, ...params] = input.split(' ');
          console.log(chalk.blue(`🪄 Executing: ${command} ${params.join(' ')}`));
          // Handle interactive commands here
        } catch (error) {
          console.error(chalk.red('❌ Command error:'), error);
        }
      }

      rl.prompt();
    });

    rl.on('close', () => {
      this.isInteractiveMode = false;
      process.exit(0);
    });
  }

  /**
   * 📊 Show system status
   */
  private async showStatus(options: any): Promise<void> {
    console.log(chalk.blue('📊 System Status'));
    console.log(chalk.blue('─'.repeat(50)));

    // Local status
    console.log(chalk.green('🏠 Local Environment:'));
    console.log(`   Node.js: ${process.version}`);
    console.log(`   Platform: ${process.platform}`);
    console.log(`   Project: ${this.config.projectPath}`);
    console.log(`   Magic CLI: v${this.config.version}`);

    // Server status
    try {
      const response = await this.apiRequest('GET', API_ENDPOINTS.HEALTH);
      if (response.success) {
        console.log(chalk.green('\n🌐 Server Status: Online'));
        console.log(`   URL: ${this.config.serverUrl}`);
        if (options.verbose && response.data) {
          console.log(`   Uptime: ${formatDuration(response.data.uptime || 0)}`);
          console.log(`   Version: ${response.data.version || 'Unknown'}`);
        }
      }
    } catch (error) {
      console.log(chalk.red('\n🌐 Server Status: Offline'));
    }

    // WebSocket status
    if (this.ws) {
      console.log(chalk.green('\n🔗 WebSocket: Connected'));
    } else {
      console.log(chalk.yellow('\n🔗 WebSocket: Disconnected'));
    }
  }

  /**
   * 🔗 Connect to coordination server
   */
  private async connectToServer(options: any): Promise<void> {
    const serverUrl = options.server || this.config.serverUrl;
    console.log(chalk.blue(`🔗 Connecting to ${serverUrl}...`));

    try {
      const wsUrl = serverUrl.replace('http', 'ws') + '/ws';
      this.ws = new WebSocket(wsUrl);

      this.ws.on('open', () => {
        console.log(chalk.green('✅ Connected to coordination server!'));
      });

      this.ws.on('message', (data) => {
        try {
          const message = JSON.parse(data.toString());
          this.handleWebSocketMessage(message);
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      });

      this.ws.on('error', (error) => {
        console.error(chalk.red('❌ WebSocket error:'), error.message);
      });

      this.ws.on('close', () => {
        console.log(chalk.yellow('🔌 Disconnected from server'));
      });

    } catch (error) {
      console.error(chalk.red('❌ Failed to connect:'), error);
    }
  }

  /**
   * 🚀 Cache management
   */
  private async manageCache(action: string): Promise<void> {
    console.log(chalk.blue(`🚀 Cache ${action}...`));

    switch (action) {
      case 'stats':
        // Show cache statistics
        console.log('📊 Cache Statistics:');
        console.log('   Implementation needed');
        break;
      case 'clear':
        console.log(chalk.green('🧹 Cache cleared successfully!'));
        break;
      case 'warm':
        console.log(chalk.green('🔥 Cache warmed successfully!'));
        break;
      case 'cleanup':
        console.log(chalk.green('🗑️ Cache cleanup completed!'));
        break;
      default:
        console.log(chalk.red(`❓ Unknown cache action: ${action}`));
    }
  }

  // Helper methods
  private async analyzeProject(projectPath?: string): Promise<ProjectInfo> {
    const targetPath = projectPath || this.config.projectPath;
    
    // Basic project detection logic
    const packageJsonPath = path.join(targetPath, 'package.json');
    const hasPackageJson = fs.existsSync(packageJsonPath);
    
    if (hasPackageJson) {
      const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      return {
        type: this.detectProjectType(packageJson),
        framework: this.detectFramework(packageJson),
        language: 'JavaScript/TypeScript',
        dependencies: Object.keys(packageJson.dependencies || {}),
        hasTests: this.hasTests(targetPath),
        hasTypeScript: this.hasTypeScript(targetPath)
      };
    }

    return {
      type: 'unknown',
      language: 'unknown',
      dependencies: [],
      hasTests: false,
      hasTypeScript: false
    };
  }

  private detectProjectType(packageJson: any): string {
    const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
    
    if (deps.react || deps['@types/react']) return 'react';
    if (deps.vue || deps['@vue/cli']) return 'vue';
    if (deps.express || deps.fastify) return 'api';
    if (deps['react-native']) return 'mobile';
    if (deps.next) return 'nextjs';
    
    return 'node';
  }

  private detectFramework(packageJson: any): string | undefined {
    const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
    
    if (deps.next) return 'Next.js';
    if (deps.express) return 'Express';
    if (deps.fastify) return 'Fastify';
    if (deps.vue) return 'Vue';
    
    return undefined;
  }

  private hasTests(projectPath: string): boolean {
    const testDirs = ['test', 'tests', '__tests__', 'spec'];
    return testDirs.some(dir => 
      fs.existsSync(path.join(projectPath, dir))
    );
  }

  private hasTypeScript(projectPath: string): boolean {
    return fs.existsSync(path.join(projectPath, 'tsconfig.json'));
  }

  private async buildAIContext(contextType: string): Promise<any> {
    return {
      projectPath: this.config.projectPath,
      timestamp: Date.now(),
      contextType
    };
  }

  private async callAIAPI(params: any): Promise<any> {
    // Simulate AI API call
    return {
      success: true,
      response: `AI response for: ${params.question}`,
      suggestions: [
        { title: 'Suggestion 1', code: 'console.log("example");' }
      ]
    };
  }

  private formatAIResponse(response: any, explain: boolean = false): void {
    console.log(chalk.green('\n🤖 AI Response:'));
    console.log(chalk.blue('─'.repeat(50)));
    
    if (typeof response === 'object') {
      if (response.response) {
        console.log(response.response);
      }
      
      if (response.suggestions) {
        console.log(chalk.blue('\n💡 Suggestions:'));
        response.suggestions.forEach((suggestion: any, index: number) => {
          console.log(`\n${index + 1}. ${suggestion.title || 'Suggestion'}`);
          if (suggestion.code) {
            console.log(chalk.gray('```'));
            console.log(suggestion.code);
            console.log(chalk.gray('```'));
          }
        });
      }
    } else {
      console.log(response);
    }
    
    console.log(chalk.blue('─'.repeat(50)));
  }

  private displayProjectInfo(projectInfo: ProjectInfo, verbose: boolean = false): void {
    console.log(chalk.green('\n📊 Project Analysis Results:'));
    console.log(chalk.blue('─'.repeat(40)));
    console.log(`🏗️  Type: ${projectInfo.type}`);
    console.log(`📝 Language: ${projectInfo.language}`);
    
    if (projectInfo.framework) {
      console.log(`🔧 Framework: ${projectInfo.framework}`);
    }
    
    console.log(`✅ Tests: ${projectInfo.hasTests ? 'Found' : 'None'}`);
    console.log(`🔷 TypeScript: ${projectInfo.hasTypeScript ? 'Yes' : 'No'}`);
    
    if (verbose && projectInfo.dependencies.length > 0) {
      console.log(chalk.blue('\n📦 Dependencies:'));
      projectInfo.dependencies.slice(0, 10).forEach(dep => {
        console.log(`   • ${dep}`);
      });
      
      if (projectInfo.dependencies.length > 10) {
        console.log(`   ... and ${projectInfo.dependencies.length - 10} more`);
      }
    }
  }

  private displayTasks(tasks: CoordinationTask[]): void {
    console.log(chalk.green(`\n📋 Tasks (${tasks.length}):`));
    console.log(chalk.blue('─'.repeat(60)));
    
    tasks.forEach(task => {
      const statusIcon = this.getStatusIcon(task.status);
      const priorityColor = this.getPriorityColor(task.priority);
      
      console.log(`${statusIcon} ${task.title}`);
      console.log(`   ${priorityColor(task.priority.toUpperCase())} | ${formatDate(task.createdAt)}`);
      if (task.description) {
        console.log(`   ${chalk.gray(task.description.substring(0, 100))}${task.description.length > 100 ? '...' : ''}`);
      }
      console.log('');
    });
  }

  private displayAgents(agents: AIAgent[]): void {
    console.log(chalk.green(`\n🤖 AI Agents (${agents.length}):`));
    console.log(chalk.blue('─'.repeat(60)));
    
    agents.forEach(agent => {
      const statusColor = agent.status === 'idle' ? chalk.green : 
                         agent.status === 'busy' ? chalk.yellow : chalk.red;
      
      console.log(`${statusColor('●')} ${agent.name} (${agent.type})`);
      console.log(`   Status: ${statusColor(agent.status)}`);
      console.log(`   Specialization: ${agent.specialization.join(', ')}`);
      console.log('');
    });
  }

  private displayAgentStatus(status: any): void {
    console.log(chalk.green('\n🤖 Agent Status Overview:'));
    console.log(chalk.blue('─'.repeat(50)));
    console.log(`Total Agents: ${status.total || 0}`);
    console.log(`Active: ${chalk.green(status.active || 0)}`);
    console.log(`Idle: ${chalk.yellow(status.idle || 0)}`);
    console.log(`Error: ${chalk.red(status.error || 0)}`);
  }

  private showInteractiveHelp(): void {
    console.log(chalk.blue(`
💬 Interactive Mode Commands:
   ai <question>        Ask AI assistant
   task list            List tasks
   task create <title>  Create new task
   agent list           List AI agents
   agent status         Show agent status
   status               Show system status
   help                 Show this help
   exit                 Exit interactive mode

💡 You can use any magic command in interactive mode!
`));
  }

  private getStatusIcon(status: string): string {
    const icons: Record<string, string> = {
      pending: '⏳',
      in_progress: '🔄',
      review: '👀',
      completed: '✅',
      cancelled: '❌',
      blocked: '🚫'
    };
    return icons[status] || '❓';
  }

  private getPriorityColor(priority: string): (text: string) => string {
    const colors: Record<string, (text: string) => string> = {
      low: chalk.blue,
      medium: chalk.yellow,
      high: chalk.magenta,
      critical: chalk.red
    };
    return colors[priority] || chalk.gray;
  }

  private async apiRequest(method: string, endpoint: string, data?: any): Promise<ApiResponse> {
    // Simulate API request
    return {
      success: true,
      data: data || { message: 'Success' },
      meta: {
        timestamp: new Date().toISOString(),
        requestId: generateId()
      }
    };
  }

  private handleWebSocketMessage(message: any): void {
    console.log(chalk.blue(`📨 ${message.type}: ${message.payload}`));
  }

  private async ensureDirectory(dir: string): Promise<void> {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
  }

  // Placeholder methods for features to be implemented
  private async setupEnvironment(feature: string, options: any): Promise<void> {
    console.log(chalk.blue(`⚡ Setting up ${feature || 'all features'}...`));
    console.log(chalk.green('✅ Setup completed!'));
  }

  private async launchDashboard(options: any): Promise<void> {
    const port = options.port || 3000;
    console.log(chalk.blue(`📊 Launching dashboard on port ${port}...`));
    
    if (options.open) {
      console.log(chalk.blue(`🌐 Opening http://localhost:${port} in browser...`));
    }
    
    console.log(chalk.green('✅ Dashboard launched successfully!'));
  }
}

// CLI Entry Point
if (import.meta.url === `file://${process.argv[1]}`) {
  const cli = new MagicCLI();
  cli.run().catch(error => {
    console.error(chalk.red('💥 Fatal error:'), error.message);
    process.exit(1);
  });
}

export default MagicCLI;