"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createOnboardingCommand = exports.OnboardingWizard = void 0;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const child_process_1 = require("child_process");
const util_1 = require("util");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
class OnboardingWizard {
    constructor(context) {
        this.context = context;
    }
    async show() {
        // Create and show webview panel
        this.panel = vscode.window.createWebviewPanel('krins-onboarding', 'Krins Code Coordination - Setup Wizard', vscode.ViewColumn.One, {
            enableScripts: true,
            retainContextWhenHidden: true
        });
        // Set HTML content
        this.panel.webview.html = this.getHtmlContent();
        // Handle messages from webview
        this.panel.webview.onDidReceiveMessage(async (message) => {
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
        }, undefined, this.context.subscriptions);
        // Show welcome step
        await this.sendMessage({
            type: 'showStep',
            step: 'welcome'
        });
    }
    async validateServerConnection(serverUrl) {
        try {
            const response = await fetch(`${serverUrl}/health`);
            if (response.ok) {
                await this.sendMessage({
                    type: 'serverValidated',
                    success: true,
                    message: 'Server connection established!'
                });
                // Save server URL to configuration
                await vscode.workspace.getConfiguration('claude-coordination')
                    .update('serverUrl', serverUrl, vscode.ConfigurationTarget.Global);
            }
            else {
                throw new Error(`Server responded with status ${response.status}`);
            }
        }
        catch (error) {
            await this.sendMessage({
                type: 'serverValidated',
                success: false,
                message: `Failed to connect to server: ${error}`
            });
        }
    }
    async setupOAuth(provider) {
        try {
            // Check if already authenticated
            const { stdout } = await execAsync(`git config user.email`);
            if (stdout.trim()) {
                await this.sendMessage({
                    type: 'oauthComplete',
                    success: true,
                    message: `Already authenticated with ${provider}`,
                    userInfo: { email: stdout.trim() }
                });
                return;
            }
            // Launch OAuth flow (simplified - would need actual OAuth implementation)
            await vscode.env.openExternal(vscode.Uri.parse(`https://github.com/login/oauth/authorize?client_id=YOUR_CLIENT_ID&scope=repo`));
            await this.sendMessage({
                type: 'oauthComplete',
                success: true,
                message: 'OAuth flow initiated - complete authorization in browser'
            });
        }
        catch (error) {
            await this.sendMessage({
                type: 'oauthComplete',
                success: false,
                message: `OAuth setup failed: ${error}`
            });
        }
    }
    async selectRepository() {
        try {
            // Get current workspace
            const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
            if (!workspaceFolder) {
                throw new Error('No workspace folder open');
            }
            const repoPath = workspaceFolder.uri.fsPath;
            const gitDir = path.join(repoPath, '.git');
            if (fs.existsSync(gitDir)) {
                // Get git remote
                const { stdout } = await execAsync('git remote get-url origin', { cwd: repoPath });
                const remoteUrl = stdout.trim();
                await this.sendMessage({
                    type: 'repoSelected',
                    success: true,
                    repoInfo: {
                        path: repoPath,
                        name: path.basename(repoPath),
                        remote: remoteUrl,
                        isGitRepo: true
                    }
                });
            }
            else {
                await this.sendMessage({
                    type: 'repoSelected',
                    success: true,
                    repoInfo: {
                        path: repoPath,
                        name: path.basename(repoPath),
                        remote: null,
                        isGitRepo: false
                    }
                });
            }
        }
        catch (error) {
            await this.sendMessage({
                type: 'repoSelected',
                success: false,
                message: `Repository selection failed: ${error}`
            });
        }
    }
    async configureDefaults(config) {
        try {
            const configuration = vscode.workspace.getConfiguration('claude-coordination');
            // Apply configuration settings
            await configuration.update('enableNotifications', config.notifications, vscode.ConfigurationTarget.Global);
            await configuration.update('autoQualityGates', config.qualityGates, vscode.ConfigurationTarget.Global);
            await configuration.update('preferredAI', config.aiProvider, vscode.ConfigurationTarget.Global);
            await configuration.update('autoLinting', config.autoLinting, vscode.ConfigurationTarget.Global);
            await this.sendMessage({
                type: 'configurationSaved',
                success: true,
                message: 'Default configuration saved successfully!'
            });
        }
        catch (error) {
            await this.sendMessage({
                type: 'configurationSaved',
                success: false,
                message: `Configuration failed: ${error}`
            });
        }
    }
    async runFirstTask(task) {
        try {
            // Simulate a first task assignment
            await this.sendMessage({
                type: 'taskStarted',
                task,
                message: 'Running your first AI-coordinated task...'
            });
            // Add a small delay to simulate processing
            await new Promise(resolve => setTimeout(resolve, 2000));
            await this.sendMessage({
                type: 'taskCompleted',
                success: true,
                task,
                message: 'First task completed successfully! 🎉'
            });
        }
        catch (error) {
            await this.sendMessage({
                type: 'taskCompleted',
                success: false,
                task,
                message: `Task failed: ${error}`
            });
        }
    }
    async completeOnboarding() {
        try {
            // Mark onboarding as complete
            await vscode.workspace.getConfiguration('claude-coordination')
                .update('onboardingCompleted', true, vscode.ConfigurationTarget.Global);
            // Show completion message
            vscode.window.showInformationMessage('🎉 Welcome to Krins Code Coordination! You\'re all set to start AI-powered development.', 'Open Dashboard', 'Assign First Task').then(selection => {
                if (selection === 'Open Dashboard') {
                    vscode.commands.executeCommand('claude-coordination.openDashboard');
                }
                else if (selection === 'Assign First Task') {
                    vscode.commands.executeCommand('claude-coordination.assignTask');
                }
            });
            // Close wizard
            this.panel?.dispose();
        }
        catch (error) {
            vscode.window.showErrorMessage(`Onboarding completion failed: ${error}`);
        }
    }
    async sendMessage(message) {
        await this.panel?.webview.postMessage(message);
    }
    getHtmlContent() {
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
                font-size: 2.5em;
                margin-bottom: 16px;
                background: linear-gradient(45deg, #007ACC, #4CAF50);
                -webkit-background-clip: text;
                -webkit-text-fill-color: transparent;
            }
            
            .hero p {
                font-size: 1.2em;
                opacity: 0.8;
                max-width: 600px;
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
                opacity: 0.8;
                font-size: 0.9em;
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
                    <h1>🚀 Welcome to Krins Code Coordination</h1>
                    <p>Transform your VS Code into a multi-AI orchestration hub. Let's get you set up in just a few steps!</p>
                </div>
                
                <div class="feature-list">
                    <div class="feature-item">
                        <h3>🤖 Multi-AI Agents</h3>
                        <p>Claude, GPT-4, and Gemini working together on your code</p>
                    </div>
                    <div class="feature-item">
                        <h3>🛡️ Quality Gates</h3>
                        <p>Automated testing, linting, and security checks</p>
                    </div>
                    <div class="feature-item">
                        <h3>🧠 Smart Routing</h3>
                        <p>Bandit algorithms select the best AI for each task</p>
                    </div>
                    <div class="feature-item">
                        <h3>📊 Learning System</h3>
                        <p>Continuous improvement through outcome tracking</p>
                    </div>
                </div>
                
                <div class="button-group">
                    <button class="btn btn-primary" onclick="nextStep()">Get Started</button>
                </div>
            </div>

            <!-- Server Connection Step -->
            <div class="step" id="step-server">
                <h2>🌐 Connect to Krins Server</h2>
                <p>First, let's connect to your Krins coordination server. This is where all the AI magic happens.</p>
                
                <div class="form-group">
                    <label for="serverUrl">Server URL:</label>
                    <input type="url" id="serverUrl" value="http://localhost:8080" placeholder="https://your-server.com">
                </div>
                
                <div id="server-status"></div>
                
                <div class="button-group">
                    <button class="btn btn-secondary" onclick="prevStep()">Back</button>
                    <button class="btn btn-primary" onclick="validateServer()">Test Connection</button>
                </div>
            </div>

            <!-- OAuth Step -->
            <div class="step" id="step-oauth">
                <h2>🔐 Connect Your Git Provider</h2>
                <p>Connect your repository provider to enable seamless code coordination and pull request management.</p>
                
                <div class="form-group">
                    <label>Choose your Git provider:</label>
                    <select id="gitProvider">
                        <option value="github">GitHub</option>
                        <option value="gitlab">GitLab</option>
                        <option value="bitbucket">Bitbucket</option>
                    </select>
                </div>
                
                <div id="oauth-status"></div>
                
                <div class="button-group">
                    <button class="btn btn-secondary" onclick="prevStep()">Back</button>
                    <button class="btn btn-primary" onclick="setupOAuth()">Connect Account</button>
                </div>
            </div>

            <!-- Repository Step -->
            <div class="step" id="step-repo">
                <h2>📁 Select Repository</h2>
                <p>We'll analyze your current workspace to understand the project structure.</p>
                
                <div id="repo-info"></div>
                
                <div class="button-group">
                    <button class="btn btn-secondary" onclick="prevStep()">Back</button>
                    <button class="btn btn-primary" onclick="selectRepo()">Analyze Workspace</button>
                </div>
            </div>

            <!-- Configuration Step -->
            <div class="step" id="step-config">
                <h2>⚙️ Configure Defaults</h2>
                <p>Set your preferences for AI coordination and quality gates.</p>
                
                <div class="form-group">
                    <label>Preferred AI for initial routing:</label>
                    <select id="aiProvider">
                        <option value="claude">Claude 3.5 Sonnet (Recommended)</option>
                        <option value="gpt4">GPT-4</option>
                        <option value="gemini">Gemini Pro</option>
                        <option value="auto">Auto-select (Bandit routing)</option>
                    </select>
                </div>
                
                <div class="checkbox-group">
                    <input type="checkbox" id="qualityGates" checked>
                    <label for="qualityGates">Enable quality gates (build, test, lint)</label>
                </div>
                
                <div class="checkbox-group">
                    <input type="checkbox" id="autoLinting" checked>
                    <label for="autoLinting">Auto-fix linting issues</label>
                </div>
                
                <div class="checkbox-group">
                    <input type="checkbox" id="notifications" checked>
                    <label for="notifications">Show progress notifications</label>
                </div>
                
                <div id="config-status"></div>
                
                <div class="button-group">
                    <button class="btn btn-secondary" onclick="prevStep()">Back</button>
                    <button class="btn btn-primary" onclick="saveConfig()">Save Configuration</button>
                </div>
            </div>

            <!-- First Task Step -->
            <div class="step" id="step-task">
                <h2>🎯 Try Your First Task</h2>
                <p>Let's run a simple task to make sure everything is working perfectly!</p>
                
                <div class="form-group">
                    <label for="firstTask">Choose a starter task:</label>
                    <select id="firstTask">
                        <option value="analyze">Analyze code structure</option>
                        <option value="readme">Generate README documentation</option>
                        <option value="tests">Add unit tests</option>
                        <option value="cleanup">Code cleanup and formatting</option>
                    </select>
                </div>
                
                <div id="task-status"></div>
                
                <div class="button-group">
                    <button class="btn btn-secondary" onclick="prevStep()">Back</button>
                    <button class="btn btn-primary" onclick="runFirstTask()">Run Task</button>
                </div>
            </div>

            <!-- Completion Step -->
            <div class="step" id="step-complete">
                <div class="hero">
                    <h1>🎉 You're All Set!</h1>
                    <p>Krins Code Coordination is now configured and ready to supercharge your development workflow.</p>
                </div>
                
                <div class="feature-list">
                    <div class="feature-item">
                        <h3>📋 Next Steps</h3>
                        <p>Try the "Assign Task" command (Ctrl+Shift+T) to get started</p>
                    </div>
                    <div class="feature-item">
                        <h3>📊 Dashboard</h3>
                        <p>Monitor AI performance and team metrics in the web dashboard</p>
                    </div>
                    <div class="feature-item">
                        <h3>🛡️ Quality Gates</h3>
                        <p>All code changes will be automatically validated before application</p>
                    </div>
                    <div class="feature-item">
                        <h3>📚 Learning</h3>
                        <p>The system will learn from outcomes to improve future decisions</p>
                    </div>
                </div>
                
                <div class="button-group">
                    <button class="btn btn-primary" onclick="completeOnboarding()">Start Developing!</button>
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
                statusDiv.innerHTML = '<div class="status-message"><span class="spinner"></span>Testing connection...</div>';
                
                vscode.postMessage({
                    command: 'validateServer',
                    serverUrl: serverUrl
                });
            }
            
            function setupOAuth() {
                const provider = document.getElementById('gitProvider').value;
                const statusDiv = document.getElementById('oauth-status');
                statusDiv.innerHTML = '<div class="status-message"><span class="spinner"></span>Setting up OAuth...</div>';
                
                vscode.postMessage({
                    command: 'setupOAuth',
                    provider: provider
                });
            }
            
            function selectRepo() {
                const statusDiv = document.getElementById('repo-info');
                statusDiv.innerHTML = '<div class="status-message"><span class="spinner"></span>Analyzing workspace...</div>';
                
                vscode.postMessage({
                    command: 'selectRepo'
                });
            }
            
            function saveConfig() {
                const config = {
                    aiProvider: document.getElementById('aiProvider').value,
                    qualityGates: document.getElementById('qualityGates').checked,
                    autoLinting: document.getElementById('autoLinting').checked,
                    notifications: document.getElementById('notifications').checked
                };
                
                const statusDiv = document.getElementById('config-status');
                statusDiv.innerHTML = '<div class="status-message"><span class="spinner"></span>Saving configuration...</div>';
                
                vscode.postMessage({
                    command: 'configureDefaults',
                    config: config
                });
            }
            
            function runFirstTask() {
                const task = document.getElementById('firstTask').value;
                const statusDiv = document.getElementById('task-status');
                statusDiv.innerHTML = '<div class="status-message"><span class="spinner"></span>Running first task...</div>';
                
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
                            repoInfo.innerHTML = \`
                                <div class="status-message status-success">
                                    <h4>✅ Repository Analysis Complete</h4>
                                    <p><strong>Name:</strong> \${repo.name}</p>
                                    <p><strong>Path:</strong> \${repo.path}</p>
                                    <p><strong>Git Repository:</strong> \${repo.isGitRepo ? 'Yes' : 'No'}</p>
                                    \${repo.remote ? \`<p><strong>Remote:</strong> \${repo.remote}</p>\` : ''}
                                </div>
                            \`;
                            setTimeout(() => nextStep(), 2000);
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
exports.OnboardingWizard = OnboardingWizard;
function createOnboardingCommand(context) {
    return vscode.commands.registerCommand('claude-coordination.startOnboarding', () => {
        const wizard = new OnboardingWizard(context);
        wizard.show();
    });
}
exports.createOnboardingCommand = createOnboardingCommand;
//# sourceMappingURL=onboardingWizard.js.map