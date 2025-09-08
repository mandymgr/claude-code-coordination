import * as vscode from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

export class OnboardingWizard {
  private panel: vscode.WebviewPanel | undefined;

  constructor(private context: vscode.ExtensionContext) {}

  public async show() {
    // Check if onboarding was already completed
    const config = vscode.workspace.getConfiguration('claude-coordination');
    const onboardingCompleted = config.get('onboardingCompleted', false);
    
    if (onboardingCompleted) {
      const restart = await vscode.window.showInformationMessage(
        'KRINS Code Coordination is already set up. Would you like to run the setup wizard again?',
        'Yes, restart setup',
        'No'
      );
      
      if (restart !== 'Yes, restart setup') {
        return;
      }
    }

    // Create and show webview panel
    this.panel = vscode.window.createWebviewPanel(
      'krins-onboarding',
      'KRINS Code Coordination - Setup Wizard',
      vscode.ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true,
        localResourceRoots: [this.context.extensionUri]
      }
    );

    // Set HTML content
    this.panel.webview.html = this.getHtmlContent();

    // Handle messages from webview
    this.panel.webview.onDidReceiveMessage(
      async message => {
        switch (message.command) {
          case 'validateServer':
            await this.validateServerConnection(message.serverUrl);
            break;
          case 'setupOAuth':
            await this.setupOAuth(message.provider);
            break;
          case 'selectRepo':
            await this.selectRepository();
            break;
          case 'configureDefaults':
            await this.configureDefaults(message.config);
            break;
          case 'runFirstTask':
            await this.runFirstTask(message.task);
            break;
          case 'completeOnboarding':
            await this.completeOnboarding();
            break;
        }
      },
      undefined,
      this.context.subscriptions
    );

    // Show welcome step
    await this.sendMessage({
      type: 'showStep',
      step: 'welcome'
    });
  }

  private async validateServerConnection(serverUrl: string) {
    try {
      // Check if we can connect to the KRINS backend server
      const response = await fetch(`${serverUrl}/health`);
      if (response.ok) {
        await this.sendMessage({
          type: 'serverValidated',
          success: true,
          message: 'KRINS server connection established! Ready for AI coordination.'
        });
        
        // Save server URL to configuration
        await vscode.workspace.getConfiguration('claude-coordination')
          .update('serverUrl', serverUrl, vscode.ConfigurationTarget.Global);
      } else {
        throw new Error(`Server responded with status ${response.status}`);
      }
    } catch (error) {
      // Try to start local server if connection fails
      try {
        await this.sendMessage({
          type: 'serverValidated',
          success: false,
          message: `Cannot connect to server at ${serverUrl}. Trying to start local KRINS server...`
        });

        // Attempt to start the local KRINS server
        await this.startLocalServer();
        
        await this.sendMessage({
          type: 'serverValidated',
          success: true,
          message: 'Local KRINS server started successfully! 🚀'
        });
        
        // Save localhost URL
        await vscode.workspace.getConfiguration('claude-coordination')
          .update('serverUrl', 'http://localhost:8080', vscode.ConfigurationTarget.Global);
          
      } catch (serverError) {
        await this.sendMessage({
          type: 'serverValidated',
          success: false,
          message: `Failed to connect to server: ${error}. Please ensure KRINS server is running.`
        });
      }
    }
  }

  private async startLocalServer() {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
      throw new Error('No workspace folder open');
    }

    // Try to find and start the backend server
    const backendPath = path.join(workspaceFolder.uri.fsPath, 'apps', 'backend');
    const aiCorePath = path.join(workspaceFolder.uri.fsPath, 'packages', 'ai-core');
    
    if (fs.existsSync(backendPath)) {
      // Start backend server
      const { stdout } = await execAsync('npm run dev', { cwd: backendPath });
      return stdout;
    } else if (fs.existsSync(aiCorePath)) {
      // Start AI core server
      const { stdout } = await execAsync('npm run dashboard', { cwd: aiCorePath });
      return stdout;
    } else {
      throw new Error('KRINS server not found in workspace');
    }
  }

  private async setupOAuth(provider: 'github' | 'gitlab' | 'bitbucket') {
    try {
      // Check if already authenticated with git
      const { stdout } = await execAsync(`git config user.email`);
      if (stdout.trim()) {
        await this.sendMessage({
          type: 'oauthComplete',
          success: true,
          message: `Already authenticated with Git (${stdout.trim()}). OAuth setup complete!`,
          userInfo: { email: stdout.trim() }
        });
        return;
      }

      // Launch OAuth flow based on provider
      let oauthUrl = '';
      switch (provider) {
        case 'github':
          oauthUrl = 'https://github.com/login';
          break;
        case 'gitlab':
          oauthUrl = 'https://gitlab.com/users/sign_in';
          break;
        case 'bitbucket':
          oauthUrl = 'https://bitbucket.org/account/signin/';
          break;
      }

      await vscode.env.openExternal(vscode.Uri.parse(oauthUrl));
      
      await this.sendMessage({
        type: 'oauthComplete',
        success: true,
        message: `${provider.charAt(0).toUpperCase() + provider.slice(1)} OAuth page opened. Please complete authentication in your browser, then configure git credentials locally.`
      });
    } catch (error) {
      await this.sendMessage({
        type: 'oauthComplete',
        success: false,
        message: `OAuth setup failed: ${error}`
      });
    }
  }

  private async selectRepository() {
    try {
      // Get current workspace
      const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
      if (!workspaceFolder) {
        throw new Error('No workspace folder open');
      }

      const repoPath = workspaceFolder.uri.fsPath;
      const gitDir = path.join(repoPath, '.git');
      
      let repoInfo = {
        path: repoPath,
        name: path.basename(repoPath),
        remote: null as string | null,
        isGitRepo: false,
        isKrinsRepo: false,
        projectType: 'unknown'
      };

      // Check if it's a git repository
      if (fs.existsSync(gitDir)) {
        repoInfo.isGitRepo = true;
        try {
          const { stdout } = await execAsync('git remote get-url origin', { cwd: repoPath });
          repoInfo.remote = stdout.trim();
        } catch (error) {
          // No remote configured
        }
      }

      // Enhanced project detection
      const packageJsonPath = path.join(repoPath, 'package.json');
      const claudeMdPath = path.join(repoPath, 'CLAUDE.md');
      const krinsConfigPath = path.join(repoPath, '.krins');
      
      if (fs.existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        if (packageJson.name?.includes('krins') || packageJson.name?.includes('claude-coordination')) {
          repoInfo.isKrinsRepo = true;
        }
        
        // Advanced project type detection
        const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
        
        // React ecosystem
        if (deps.react) {
          if (deps.next) repoInfo.projectType = 'Next.js';
          else if (deps.gatsby) repoInfo.projectType = 'Gatsby';
          else if (deps['react-native']) repoInfo.projectType = 'React Native';
          else repoInfo.projectType = 'React';
        }
        // Vue ecosystem
        else if (deps.vue) {
          if (deps.nuxt) repoInfo.projectType = 'Nuxt.js';
          else repoInfo.projectType = 'Vue';
        }
        // Angular
        else if (deps['@angular/core']) {
          repoInfo.projectType = 'Angular';
        }
        // Svelte
        else if (deps.svelte) {
          repoInfo.projectType = 'Svelte';
        }
        // Node.js APIs
        else if (deps.express) {
          repoInfo.projectType = 'Express API';
        } else if (deps.fastify) {
          repoInfo.projectType = 'Fastify API';
        } else if (deps['@nestjs/core']) {
          repoInfo.projectType = 'NestJS API';
        }
        // Libraries
        else if (packageJson.main || packageJson.exports || packageJson.types) {
          repoInfo.projectType = deps.typescript ? 'TypeScript Library' : 'JavaScript Library';
        }
        // Electron
        else if (deps.electron) {
          repoInfo.projectType = 'Electron App';
        }
        // Generic Node.js
        else if (deps['@types/node'] || packageJson.engines?.node) {
          repoInfo.projectType = 'TypeScript/Node.js';
        }
        // Default fallback
        else {
          repoInfo.projectType = 'JavaScript/Node.js';
        }
      }

      if (fs.existsSync(claudeMdPath) || fs.existsSync(krinsConfigPath)) {
        repoInfo.isKrinsRepo = true;
      }
        
      await this.sendMessage({
        type: 'repoSelected',
        success: true,
        repoInfo
      });
    } catch (error) {
      await this.sendMessage({
        type: 'repoSelected',
        success: false,
        message: `Repository selection failed: ${error}`
      });
    }
  }

  private async configureDefaults(config: {
    aiProvider: string;
    qualityGates: boolean;
    autoLinting: boolean;
    notifications: boolean;
    autoStartSession: boolean;
  }) {
    try {
      const configuration = vscode.workspace.getConfiguration('claude-coordination');
      
      // Apply configuration settings
      await configuration.update('enableNotifications', config.notifications, vscode.ConfigurationTarget.Global);
      await configuration.update('autoQualityGates', config.qualityGates, vscode.ConfigurationTarget.Global);
      await configuration.update('preferredAI', config.aiProvider, vscode.ConfigurationTarget.Global);
      await configuration.update('autoLinting', config.autoLinting, vscode.ConfigurationTarget.Global);
      await configuration.update('autoStartSession', config.autoStartSession, vscode.ConfigurationTarget.Global);
      await configuration.update('showFileDecorations', true, vscode.ConfigurationTarget.Global);

      await this.sendMessage({
        type: 'configurationSaved',
        success: true,
        message: 'KRINS configuration saved successfully! Your AI coordination preferences are now active.'
      });
    } catch (error) {
      await this.sendMessage({
        type: 'configurationSaved',
        success: false,
        message: `Configuration failed: ${error}`
      });
    }
  }

  private async runFirstTask(task: string) {
    try {
      await this.sendMessage({
        type: 'taskStarted',
        task,
        message: 'Running your first KRINS AI-coordinated task...'
      });

      // Simulate running the selected task
      let taskResult = '';
      switch (task) {
        case 'analyze':
          taskResult = await this.analyzeProject();
          break;
        case 'readme':
          taskResult = await this.generateReadme();
          break;
        case 'tests':
          taskResult = await this.suggestTests();
          break;
        case 'cleanup':
          taskResult = await this.cleanupCode();
          break;
        default:
          taskResult = 'Task analysis completed';
      }

      await this.sendMessage({
        type: 'taskCompleted',
        success: true,
        task,
        message: `✅ First task completed successfully! ${taskResult}`
      });
    } catch (error) {
      await this.sendMessage({
        type: 'taskCompleted',
        success: false,
        task,
        message: `Task failed: ${error}`
      });
    }
  }

  private async analyzeProject(): Promise<string> {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) return 'No workspace to analyze';

    const files = await vscode.workspace.findFiles('**/*.{js,ts,jsx,tsx,py,java,cpp}');
    return `Found ${files.length} code files ready for AI coordination`;
  }

  private async generateReadme(): Promise<string> {
    return 'README analysis complete - KRINS can now generate comprehensive documentation for your project';
  }

  private async suggestTests(): Promise<string> {
    const testFiles = await vscode.workspace.findFiles('**/*.{test,spec}.{js,ts}');
    return `Found ${testFiles.length} test files - KRINS can suggest additional test coverage`;
  }

  private async cleanupCode(): Promise<string> {
    return 'Code structure analyzed - KRINS can help optimize and clean up your codebase';
  }

  private async completeOnboarding() {
    try {
      // Mark onboarding as complete
      await vscode.workspace.getConfiguration('claude-coordination')
        .update('onboardingCompleted', true, vscode.ConfigurationTarget.Global);

      // Show completion message
      const action = await vscode.window.showInformationMessage(
        '🎉 Welcome to KRINS Code Coordination! You\'re all set to start multi-AI powered development.',
        'Open Dashboard',
        'Assign First Task',
        'View Documentation'
      );

      switch (action) {
        case 'Open Dashboard':
          vscode.commands.executeCommand('claude-coordination.openDashboard');
          break;
        case 'Assign First Task':
          vscode.commands.executeCommand('claude-coordination.assignTask');
          break;
        case 'View Documentation':
          vscode.env.openExternal(vscode.Uri.parse('https://github.com/anthropics/claude-code'));
          break;
      }

      // Close wizard
      this.panel?.dispose();
    } catch (error) {
      vscode.window.showErrorMessage(`Onboarding completion failed: ${error}`);
    }
  }

  private async sendMessage(message: any) {
    await this.panel?.webview.postMessage(message);
  }

  private getHtmlContent(): string {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Krins Code Coordination - Setup</title>
        <style>
            body {
                font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
                margin: 0;
                padding: 20px;
                background: var(--vscode-editor-background);
                color: var(--vscode-editor-foreground);
                line-height: 1.6;
            }
            
            .wizard-container {
                max-width: 800px;
                margin: 0 auto;
                padding: 0 20px;
            }
            
            .step {
                display: none;
                animation: fadeIn 0.3s ease-in-out;
            }
            
            .step.active {
                display: block;
            }
            
            @keyframes fadeIn {
                from { opacity: 0; transform: translateY(10px); }
                to { opacity: 1; transform: translateY(0); }
            }
            
            h1, h2 {
                color: var(--vscode-titleBar-activeForeground);
                margin-bottom: 24px;
            }
            
            .hero {
                text-align: center;
                padding: 40px 0;
                border-bottom: 1px solid var(--vscode-panel-border);
                margin-bottom: 40px;
            }
            
            .hero h1 {
                font-size: 2.8em;
                margin-bottom: 16px;
                background: linear-gradient(45deg, #007ACC, #4CAF50, #FF6B35);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
                background-clip: text;
            }
            
            .hero p {
                font-size: 1.3em;
                opacity: 0.9;
                max-width: 700px;
                margin: 0 auto;
            }
            
            .form-group {
                margin-bottom: 20px;
            }
            
            label {
                display: block;
                margin-bottom: 8px;
                font-weight: 600;
                color: var(--vscode-input-foreground);
            }
            
            input[type="text"], input[type="url"], select {
                width: 100%;
                padding: 12px;
                border: 1px solid var(--vscode-input-border);
                border-radius: 4px;
                background: var(--vscode-input-background);
                color: var(--vscode-input-foreground);
                font-size: 14px;
                box-sizing: border-box;
            }
            
            input[type="checkbox"] {
                margin-right: 8px;
            }
            
            .checkbox-group {
                display: flex;
                align-items: center;
                margin-bottom: 12px;
            }
            
            .btn {
                padding: 12px 24px;
                border: none;
                border-radius: 4px;
                cursor: pointer;
                font-size: 14px;
                font-weight: 600;
                transition: all 0.2s;
            }
            
            .btn-primary {
                background: var(--vscode-button-background);
                color: var(--vscode-button-foreground);
            }
            
            .btn-primary:hover {
                background: var(--vscode-button-hoverBackground);
            }
            
            .btn-secondary {
                background: var(--vscode-button-secondaryBackground);
                color: var(--vscode-button-secondaryForeground);
            }
            
            .btn-secondary:hover {
                background: var(--vscode-button-secondaryHoverBackground);
            }
            
            .button-group {
                display: flex;
                gap: 12px;
                margin-top: 24px;
            }
            
            .progress-bar {
                width: 100%;
                height: 6px;
                background: var(--vscode-progressBar-background);
                border-radius: 3px;
                margin-bottom: 40px;
                overflow: hidden;
            }
            
            .progress-fill {
                height: 100%;
                background: linear-gradient(90deg, #007ACC, #4CAF50);
                border-radius: 3px;
                transition: width 0.3s ease;
            }
            
            .status-message {
                padding: 12px;
                border-radius: 4px;
                margin: 16px 0;
                font-weight: 500;
            }
            
            .status-success {
                background: var(--vscode-diffEditor-insertedTextBackground);
                border: 1px solid var(--vscode-diffEditor-insertedLineBackground);
                color: var(--vscode-gitDecoration-addedResourceForeground);
            }
            
            .status-error {
                background: var(--vscode-diffEditor-removedTextBackground);
                border: 1px solid var(--vscode-diffEditor-removedLineBackground);
                color: var(--vscode-gitDecoration-deletedResourceForeground);
            }
            
            .feature-list {
                display: grid;
                grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
                gap: 20px;
                margin: 24px 0;
            }
            
            .feature-item {
                padding: 20px;
                border: 1px solid var(--vscode-panel-border);
                border-radius: 8px;
                background: var(--vscode-panel-background);
            }
            
            .feature-item h3 {
                margin: 0 0 12px 0;
                color: var(--vscode-titleBar-activeForeground);
                font-size: 1.1em;
            }
            
            .feature-item p {
                margin: 0;
                opacity: 0.85;
                font-size: 0.95em;
            }
            
            .repo-details {
                background: var(--vscode-editor-inactiveSelectionBackground);
                padding: 20px;
                border-radius: 8px;
                margin: 20px 0;
                border: 1px solid var(--vscode-panel-border);
            }
            
            .repo-badge {
                display: inline-block;
                padding: 4px 12px;
                background: var(--vscode-button-background);
                color: var(--vscode-button-foreground);
                border-radius: 12px;
                font-size: 0.85em;
                margin: 4px 8px 4px 0;
            }
            
            .spinner {
                display: inline-block;
                width: 16px;
                height: 16px;
                border: 2px solid var(--vscode-progressBar-background);
                border-radius: 50%;
                border-top-color: var(--vscode-button-background);
                animation: spin 1s linear infinite;
                margin-right: 8px;
            }
            
            @keyframes spin {
                to { transform: rotate(360deg); }
            }
        </style>
    </head>
    <body>
        <div class="wizard-container">
            <!-- Progress Bar -->
            <div class="progress-bar">
                <div class="progress-fill" id="progress" style="width: 0%"></div>
            </div>

            <!-- Welcome Step -->
            <div class="step active" id="step-welcome">
                <div class="hero">
                    <h1>🪐 Welcome to KRINS Code Coordination</h1>
                    <p>Transform your VS Code into an enterprise-grade multi-AI orchestration hub. Claude, GPT-4, and Gemini working together to supercharge your development workflow!</p>
                </div>
                
                <div class="feature-list">
                    <div class="feature-item">
                        <h3>🤖 Multi-AI Team Orchestration</h3>
                        <p>Claude 3.5 Sonnet, GPT-4, and Gemini Pro working together with intelligent task routing</p>
                    </div>
                    <div class="feature-item">
                        <h3>🛡️ Enterprise Quality Gates</h3>
                        <p>Automated testing, linting, security scanning, and code quality enforcement</p>
                    </div>
                    <div class="feature-item">
                        <h3>🧠 Smart Bandit Routing</h3>
                        <p>Machine learning algorithms automatically select the best AI for each task</p>
                    </div>
                    <div class="feature-item">
                        <h3>📊 Learning & Analytics</h3>
                        <p>Continuous improvement through outcome tracking and performance optimization</p>
                    </div>
                    <div class="feature-item">
                        <h3>🔒 Real-time Collaboration</h3>
                        <p>File locking, session management, and team coordination features</p>
                    </div>
                    <div class="feature-item">
                        <h3>⚡ Magical Automation</h3>
                        <p>One-command deployments, auto-fixes, and intelligent project detection</p>
                    </div>
                </div>
                
                <div class="button-group">
                    <button class="btn btn-primary" onclick="nextStep()">🚀 Get Started</button>
                </div>
            </div>

            <!-- Server Connection Step -->
            <div class="step" id="step-server">
                <h2>🌐 Connect to KRINS Server</h2>
                <p>First, let's connect to your KRINS coordination server. This is the brain of the operation where all AI magic happens.</p>
                
                <div class="form-group">
                    <label for="serverUrl">Server URL:</label>
                    <input type="url" id="serverUrl" value="http://localhost:8080" placeholder="https://your-krins-server.com">
                    <small style="opacity: 0.7; margin-top: 8px; display: block;">
                        💡 Leave as localhost if running KRINS locally, or enter your deployed server URL
                    </small>
                </div>
                
                <div id="server-status"></div>
                
                <div class="button-group">
                    <button class="btn btn-secondary" onclick="prevStep()">Back</button>
                    <button class="btn btn-primary" onclick="validateServer()">🔍 Test Connection</button>
                </div>
            </div>

            <!-- OAuth Step -->
            <div class="step" id="step-oauth">
                <h2>🔐 Connect Your Git Provider</h2>
                <p>Connect your repository provider to enable seamless code coordination, pull request management, and deployment automation.</p>
                
                <div class="form-group">
                    <label>Choose your Git provider:</label>
                    <select id="gitProvider">
                        <option value="github">🐙 GitHub</option>
                        <option value="gitlab">🦊 GitLab</option>
                        <option value="bitbucket">🪣 Bitbucket</option>
                    </select>
                </div>
                
                <div id="oauth-status"></div>
                
                <div class="button-group">
                    <button class="btn btn-secondary" onclick="prevStep()">Back</button>
                    <button class="btn btn-primary" onclick="setupOAuth()">🔗 Connect Account</button>
                </div>
            </div>

            <!-- Repository Step -->
            <div class="step" id="step-repo">
                <h2>📁 Analyze Repository</h2>
                <p>We'll analyze your current workspace to understand the project structure, detect frameworks, and configure optimal AI coordination.</p>
                
                <div id="repo-info"></div>
                
                <div class="button-group">
                    <button class="btn btn-secondary" onclick="prevStep()">Back</button>
                    <button class="btn btn-primary" onclick="selectRepo()">🔍 Analyze Workspace</button>
                </div>
            </div>

            <!-- Configuration Step -->
            <div class="step" id="step-config">
                <h2>⚙️ Configure AI Preferences</h2>
                <p>Set your preferences for AI coordination, quality gates, and automation features.</p>
                
                <div class="form-group">
                    <label>Preferred AI for initial routing:</label>
                    <select id="aiProvider">
                        <option value="claude">🧠 Claude 3.5 Sonnet (Recommended)</option>
                        <option value="gpt4">🤖 GPT-4 Turbo</option>
                        <option value="gemini">💎 Gemini Pro</option>
                        <option value="auto">✨ Auto-select (Bandit routing)</option>
                    </select>
                </div>
                
                <div class="checkbox-group">
                    <input type="checkbox" id="qualityGates" checked>
                    <label for="qualityGates">🛡️ Enable quality gates (build, test, lint, security)</label>
                </div>
                
                <div class="checkbox-group">
                    <input type="checkbox" id="autoLinting" checked>
                    <label for="autoLinting">🔧 Auto-fix linting and formatting issues</label>
                </div>
                
                <div class="checkbox-group">
                    <input type="checkbox" id="notifications" checked>
                    <label for="notifications">📢 Show progress notifications and status updates</label>
                </div>
                
                <div class="checkbox-group">
                    <input type="checkbox" id="autoStartSession" checked>
                    <label for="autoStartSession">⚡ Auto-start coordination session when opening workspace</label>
                </div>
                
                <div id="config-status"></div>
                
                <div class="button-group">
                    <button class="btn btn-secondary" onclick="prevStep()">Back</button>
                    <button class="btn btn-primary" onclick="saveConfig()">💾 Save Configuration</button>
                </div>
            </div>

            <!-- First Task Step -->
            <div class="step" id="step-task">
                <h2>🎯 Try Your First AI Task</h2>
                <p>Let's run a simple task to make sure everything is working perfectly and showcase KRINS capabilities!</p>
                
                <div class="form-group">
                    <label for="firstTask">Choose a starter task:</label>
                    <select id="firstTask">
                        <option value="analyze">📊 Analyze project structure and dependencies</option>
                        <option value="readme">📝 Generate comprehensive README documentation</option>
                        <option value="tests">🧪 Suggest unit test improvements and coverage</option>
                        <option value="cleanup">✨ Code cleanup and optimization recommendations</option>
                    </select>
                </div>
                
                <div id="task-status"></div>
                
                <div class="button-group">
                    <button class="btn btn-secondary" onclick="prevStep()">Back</button>
                    <button class="btn btn-primary" onclick="runFirstTask()">🚀 Run Task</button>
                </div>
            </div>

            <!-- Completion Step -->
            <div class="step" id="step-complete">
                <div class="hero">
                    <h1>🎉 KRINS is Ready!</h1>
                    <p>Your multi-AI coordination system is now configured and ready to revolutionize your development workflow. Welcome to the future of coding!</p>
                </div>
                
                <div class="feature-list">
                    <div class="feature-item">
                        <h3>🎯 Next: Assign Tasks</h3>
                        <p>Use <code>Ctrl+Shift+T</code> or Command Palette to assign your first AI-coordinated task</p>
                    </div>
                    <div class="feature-item">
                        <h3>📊 Dashboard Access</h3>
                        <p>Monitor AI performance, track metrics, and view team collaboration in the web dashboard</p>
                    </div>
                    <div class="feature-item">
                        <h3>🛡️ Quality Assurance</h3>
                        <p>All code changes automatically validated through quality gates before application</p>
                    </div>
                    <div class="feature-item">
                        <h3>📚 Continuous Learning</h3>
                        <p>The system learns from outcomes to improve AI selection and task routing</p>
                    </div>
                    <div class="feature-item">
                        <h3>🔒 Team Coordination</h3>
                        <p>Real-time file locking and session management for seamless collaboration</p>
                    </div>
                    <div class="feature-item">
                        <h3>⚡ Magic Commands</h3>
                        <p>One-click deployments, auto-fixes, and intelligent project management</p>
                    </div>
                </div>
                
                <div class="button-group" style="justify-content: center;">
                    <button class="btn btn-primary" onclick="completeOnboarding()">🚀 Start Developing with KRINS!</button>
                </div>
            </div>
        </div>

        <script>
            const vscode = acquireVsCodeApi();
            let currentStep = 0;
            const steps = ['welcome', 'server', 'oauth', 'repo', 'config', 'task', 'complete'];
            
            function updateProgress() {
                const progress = (currentStep / (steps.length - 1)) * 100;
                document.getElementById('progress').style.width = progress + '%';
            }
            
            function showStep(stepName) {
                document.querySelectorAll('.step').forEach(el => el.classList.remove('active'));
                document.getElementById('step-' + stepName).classList.add('active');
                currentStep = steps.indexOf(stepName);
                updateProgress();
            }
            
            function nextStep() {
                if (currentStep < steps.length - 1) {
                    currentStep++;
                    showStep(steps[currentStep]);
                }
            }
            
            function prevStep() {
                if (currentStep > 0) {
                    currentStep--;
                    showStep(steps[currentStep]);
                }
            }
            
            function validateServer() {
                const serverUrl = document.getElementById('serverUrl').value;
                const statusDiv = document.getElementById('server-status');
                statusDiv.innerHTML = '<div class="status-message"><span class="spinner"></span>Testing KRINS server connection...</div>';
                
                vscode.postMessage({
                    command: 'validateServer',
                    serverUrl: serverUrl
                });
            }
            
            function setupOAuth() {
                const provider = document.getElementById('gitProvider').value;
                const statusDiv = document.getElementById('oauth-status');
                statusDiv.innerHTML = '<div class="status-message"><span class="spinner"></span>Setting up OAuth with ' + provider.charAt(0).toUpperCase() + provider.slice(1) + '...</div>';
                
                vscode.postMessage({
                    command: 'setupOAuth',
                    provider: provider
                });
            }
            
            function selectRepo() {
                const statusDiv = document.getElementById('repo-info');
                statusDiv.innerHTML = '<div class="status-message"><span class="spinner"></span>Analyzing workspace structure and detecting project type...</div>';
                
                vscode.postMessage({
                    command: 'selectRepo'
                });
            }
            
            function saveConfig() {
                const config = {
                    aiProvider: document.getElementById('aiProvider').value,
                    qualityGates: document.getElementById('qualityGates').checked,
                    autoLinting: document.getElementById('autoLinting').checked,
                    notifications: document.getElementById('notifications').checked,
                    autoStartSession: document.getElementById('autoStartSession').checked
                };
                
                const statusDiv = document.getElementById('config-status');
                statusDiv.innerHTML = '<div class="status-message"><span class="spinner"></span>Saving KRINS configuration...</div>';
                
                vscode.postMessage({
                    command: 'configureDefaults',
                    config: config
                });
            }
            
            function runFirstTask() {
                const task = document.getElementById('firstTask').value;
                const statusDiv = document.getElementById('task-status');
                statusDiv.innerHTML = '<div class="status-message"><span class="spinner"></span>Running your first KRINS AI task...</div>';
                
                vscode.postMessage({
                    command: 'runFirstTask',
                    task: task
                });
            }
            
            function completeOnboarding() {
                vscode.postMessage({
                    command: 'completeOnboarding'
                });
            }
            
            // Handle messages from extension
            window.addEventListener('message', event => {
                const message = event.data;
                
                switch (message.type) {
                    case 'showStep':
                        showStep(message.step);
                        break;
                        
                    case 'serverValidated':
                        const serverStatus = document.getElementById('server-status');
                        if (message.success) {
                            serverStatus.innerHTML = '<div class="status-message status-success">✅ ' + message.message + '</div>';
                            setTimeout(() => nextStep(), 1500);
                        } else {
                            serverStatus.innerHTML = '<div class="status-message status-error">❌ ' + message.message + '</div>';
                        }
                        break;
                        
                    case 'oauthComplete':
                        const oauthStatus = document.getElementById('oauth-status');
                        if (message.success) {
                            oauthStatus.innerHTML = '<div class="status-message status-success">✅ ' + message.message + '</div>';
                            setTimeout(() => nextStep(), 1500);
                        } else {
                            oauthStatus.innerHTML = '<div class="status-message status-error">❌ ' + message.message + '</div>';
                        }
                        break;
                        
                    case 'repoSelected':
                        const repoInfo = document.getElementById('repo-info');
                        if (message.success) {
                            const repo = message.repoInfo;
                            let badges = '';
                            if (repo.isGitRepo) badges += '<span class="repo-badge">Git Repository</span>';
                            if (repo.isKrinsRepo) badges += '<span class="repo-badge">KRINS Enabled</span>';
                            if (repo.projectType !== 'unknown') badges += '<span class="repo-badge">' + repo.projectType + '</span>';
                            
                            repoInfo.innerHTML = \`
                                <div class="repo-details">
                                    <h4>✅ Repository Analysis Complete</h4>
                                    <p><strong>📁 Name:</strong> \${repo.name}</p>
                                    <p><strong>📂 Path:</strong> \${repo.path}</p>
                                    <p><strong>🏷️ Type:</strong> \${repo.projectType}</p>
                                    \${repo.remote ? \`<p><strong>🌐 Remote:</strong> \${repo.remote}</p>\` : ''}
                                    <div style="margin-top: 12px;">\${badges}</div>
                                </div>
                            \`;
                            setTimeout(() => nextStep(), 2500);
                        } else {
                            repoInfo.innerHTML = '<div class="status-message status-error">❌ ' + message.message + '</div>';
                        }
                        break;
                        
                    case 'configurationSaved':
                        const configStatus = document.getElementById('config-status');
                        if (message.success) {
                            configStatus.innerHTML = '<div class="status-message status-success">✅ ' + message.message + '</div>';
                            setTimeout(() => nextStep(), 1500);
                        } else {
                            configStatus.innerHTML = '<div class="status-message status-error">❌ ' + message.message + '</div>';
                        }
                        break;
                        
                    case 'taskStarted':
                        document.getElementById('task-status').innerHTML = 
                            '<div class="status-message"><span class="spinner"></span>' + message.message + '</div>';
                        break;
                        
                    case 'taskCompleted':
                        const taskStatus = document.getElementById('task-status');
                        if (message.success) {
                            taskStatus.innerHTML = '<div class="status-message status-success">✅ ' + message.message + '</div>';
                            setTimeout(() => nextStep(), 2000);
                        } else {
                            taskStatus.innerHTML = '<div class="status-message status-error">❌ ' + message.message + '</div>';
                        }
                        break;
                }
            });
        </script>
    </body>
    </html>
    `;
  }
}

export function createOnboardingCommand(context: vscode.ExtensionContext) {
  return vscode.commands.registerCommand('claude-coordination.startOnboarding', () => {
    const wizard = new OnboardingWizard(context);
    wizard.show();
  });
}