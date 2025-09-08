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
exports.WebDashboardPanel = void 0;
const vscode = __importStar(require("vscode"));
const child_process_1 = require("child_process");
const path = __importStar(require("path"));
class WebDashboardPanel {
    static createOrShow(extensionPath) {
        const column = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : undefined;
        if (WebDashboardPanel.currentPanel) {
            WebDashboardPanel.currentPanel._panel.reveal(column);
            return;
        }
        const panel = vscode.window.createWebviewPanel('claudeCoordinationDashboard', 'KRINS AI Coordination Dashboard', column || vscode.ViewColumn.One, {
            enableScripts: true,
            retainContextWhenHidden: true,
            enableCommandUris: true
        });
        WebDashboardPanel.currentPanel = new WebDashboardPanel(panel, extensionPath || '');
    }
    constructor(panel, extensionPath) {
        this._disposables = [];
        this._isServerRunning = false;
        this._panel = panel;
        this._extensionPath = extensionPath;
        // Initialize server configuration
        const config = vscode.workspace.getConfiguration('claude-coordination');
        this._serverConfig = {
            port: config.get('webDashboardPort') || 3000,
            serverUrl: config.get('serverUrl') || 'http://localhost:8080',
            autoStart: true
        };
        this._init();
        this._panel.onDidDispose(() => this.dispose(), null, this._disposables);
        this._panel.webview.onDidReceiveMessage(message => {
            switch (message.command) {
                case 'refresh':
                    this._update();
                    return;
                case 'lockFile':
                    vscode.commands.executeCommand('claude-coordination.lockFile');
                    return;
                case 'sendMessage':
                    vscode.commands.executeCommand('claude-coordination.sendMessage');
                    return;
                case 'aiAssist':
                    vscode.commands.executeCommand('claude-coordination.aiAssist');
                    return;
                case 'startServer':
                    this._startDashboardServer();
                    return;
                case 'stopServer':
                    this._stopDashboardServer();
                    return;
                case 'openExternal':
                    vscode.env.openExternal(vscode.Uri.parse(`http://localhost:${this._serverConfig.port}`));
                    return;
                case 'runCleanup':
                    this._runCleanup();
                    return;
                case 'assignTask':
                    vscode.commands.executeCommand('claude-coordination.assignTask');
                    return;
                case 'runQualityGates':
                    vscode.commands.executeCommand('claude-coordination.runQualityGates');
                    return;
                case 'deploy':
                    vscode.commands.executeCommand('claude-coordination.deploy');
                    return;
            }
        }, null, this._disposables);
    }
    dispose() {
        WebDashboardPanel.currentPanel = undefined;
        // Close event source
        if (this._eventSource) {
            this._eventSource.close();
        }
        // Stop dashboard server
        this._stopDashboardServer();
        this._panel.dispose();
        while (this._disposables.length) {
            const x = this._disposables.pop();
            if (x) {
                x.dispose();
            }
        }
    }
    async _init() {
        // Start with loading screen
        this._panel.webview.html = this.getLoadingContent();
        // Start dashboard server if configured
        if (this._serverConfig.autoStart) {
            await this._startDashboardServer();
        }
        // Initial update
        await this._update();
        // Setup real-time updates if server is running
        if (this._isServerRunning) {
            this._setupRealTimeUpdates();
        }
    }
    async _update() {
        try {
            const status = await this.getCoordinationStatus();
            const serverStats = await this.getServerStats();
            this._panel.webview.html = this.getWebviewContent(status, serverStats);
        }
        catch (error) {
            this._panel.webview.html = this.getErrorContent(error);
        }
    }
    async getCoordinationStatus() {
        return new Promise((resolve, reject) => {
            const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
            if (!workspaceFolder) {
                reject('No workspace folder open');
                return;
            }
            const config = vscode.workspace.getConfiguration('claude-coordination');
            const magicPath = config.get('magicCliPath') || 'magic';
            const command = `${magicPath} coord-status --json`;
            (0, child_process_1.exec)(command, {
                cwd: workspaceFolder.uri.fsPath,
                timeout: 10000
            }, (error, stdout, stderr) => {
                if (error) {
                    reject(stderr || error.message);
                    return;
                }
                try {
                    const status = JSON.parse(stdout.trim());
                    resolve(status);
                }
                catch (parseError) {
                    reject('Failed to parse coordination status');
                }
            });
        });
    }
    async _startDashboardServer() {
        try {
            const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
            if (!workspaceFolder) {
                throw new Error('No workspace folder open');
            }
            // Check if ai-core package exists
            const aiCorePath = path.join(workspaceFolder.uri.fsPath, 'packages', 'ai-core');
            const dashboardServerPath = path.join(aiCorePath, 'src', 'dashboard-server.cjs');
            if (!require('fs').existsSync(dashboardServerPath)) {
                vscode.window.showWarningMessage('Dashboard server not found. Run: npm run dashboard');
                return;
            }
            // Kill any existing server
            await this._stopDashboardServer();
            // Start new server
            this._dashboardServer = (0, child_process_1.spawn)('node', [dashboardServerPath, `--port=${this._serverConfig.port}`], {
                cwd: aiCorePath,
                stdio: ['ignore', 'pipe', 'pipe']
            });
            this._dashboardServer.stdout?.on('data', (data) => {
                console.log(`Dashboard server: ${data}`);
            });
            this._dashboardServer.stderr?.on('data', (data) => {
                console.error(`Dashboard server error: ${data}`);
            });
            this._dashboardServer.on('close', (code) => {
                this._isServerRunning = false;
                console.log(`Dashboard server exited with code ${code}`);
            });
            // Wait a bit for server to start
            await new Promise(resolve => setTimeout(resolve, 2000));
            this._isServerRunning = true;
            vscode.window.showInformationMessage(`Dashboard server started on port ${this._serverConfig.port}`);
        }
        catch (error) {
            console.error('Failed to start dashboard server:', error);
            vscode.window.showErrorMessage(`Failed to start dashboard server: ${error}`);
        }
    }
    async _stopDashboardServer() {
        if (this._dashboardServer) {
            this._dashboardServer.kill();
            this._dashboardServer = undefined;
            this._isServerRunning = false;
        }
    }
    _setupRealTimeUpdates() {
        // This would require implementing Server-Sent Events in a Node.js context
        // For now, we'll use polling with shorter intervals when server is running
        const updateInterval = setInterval(() => {
            if (this._isServerRunning && this._panel.visible) {
                this._update();
            }
        }, 5000);
        this._disposables.push({
            dispose: () => clearInterval(updateInterval)
        });
    }
    async _runCleanup() {
        try {
            const result = await fetch(`http://localhost:${this._serverConfig.port}/api/cleanup`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await result.json();
            if (data.success) {
                vscode.window.showInformationMessage(data.message);
                this._update(); // Refresh the view
            }
            else {
                vscode.window.showErrorMessage(`Cleanup failed: ${data.message}`);
            }
        }
        catch (error) {
            vscode.window.showErrorMessage(`Cleanup failed: ${error}`);
        }
    }
    async getServerStats() {
        if (!this._isServerRunning) {
            return null;
        }
        try {
            const response = await fetch(`http://localhost:${this._serverConfig.port}/api/system`);
            const data = await response.json();
            return {
                sessions: Object.keys(data.sessions || {}).length,
                activeLocks: Object.keys(data.locks || {}).length,
                healthyConnections: Object.values(data.sessions || {}).filter((s) => s.health?.status === 'healthy').length,
                uptime: this._formatUptime(data.lastUpdated)
            };
        }
        catch (error) {
            return null;
        }
    }
    _formatUptime(timestamp) {
        const uptimeMs = Date.now() - timestamp;
        const uptimeSeconds = Math.floor(uptimeMs / 1000);
        const hours = Math.floor(uptimeSeconds / 3600);
        const minutes = Math.floor((uptimeSeconds % 3600) / 60);
        return `${hours}h ${minutes}m`;
    }
    getLoadingContent() {
        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>KRINS AI Coordination Dashboard - Loading</title>
    <style>
        body {
            font-family: var(--vscode-font-family);
            color: var(--vscode-foreground);
            background-color: var(--vscode-editor-background);
            display: flex;
            justify-content: center;
            align-items: center;
            height: 100vh;
            margin: 0;
        }
        .loading-container {
            text-align: center;
        }
        .spinner {
            border: 4px solid var(--vscode-panel-border);
            border-top: 4px solid var(--vscode-textLink-foreground);
            border-radius: 50%;
            width: 40px;
            height: 40px;
            animation: spin 2s linear infinite;
            margin: 0 auto 20px;
        }
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
    </style>
</head>
<body>
    <div class="loading-container">
        <div class="spinner"></div>
        <h2>🚀 Initializing KRINS AI Coordination Dashboard</h2>
        <p>Starting dashboard server and loading coordination data...</p>
    </div>
</body>
</html>`;
    }
    getWebviewContent(status, serverStats) {
        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Claude Code Coordination Dashboard</title>
    <style>
        body {
            font-family: var(--vscode-font-family);
            font-size: var(--vscode-font-size);
            font-weight: var(--vscode-font-weight);
            color: var(--vscode-foreground);
            background-color: var(--vscode-editor-background);
            padding: 20px;
            margin: 0;
        }
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 30px;
            padding-bottom: 20px;
            border-bottom: 1px solid var(--vscode-panel-border);
            flex-wrap: wrap;
            gap: 15px;
        }
        .header h1 {
            margin: 0;
            color: var(--vscode-textLink-foreground);
            flex-grow: 1;
        }
        .header-controls {
            display: flex;
            align-items: center;
            gap: 15px;
            flex-wrap: wrap;
        }
        .server-status {
            display: flex;
            align-items: center;
            gap: 8px;
            padding: 6px 12px;
            border-radius: 4px;
            font-size: 0.9em;
            border: 1px solid var(--vscode-panel-border);
        }
        .server-status.running {
            background: var(--vscode-testing-iconPassed);
            color: var(--vscode-editor-background);
            border-color: var(--vscode-testing-iconPassed);
        }
        .server-status.stopped {
            background: var(--vscode-testing-iconFailed);
            color: var(--vscode-editor-background);
            border-color: var(--vscode-testing-iconFailed);
        }
        .status-dot {
            width: 8px;
            height: 8px;
            border-radius: 50%;
            background-color: currentColor;
        }
        .header-buttons {
            display: flex;
            gap: 8px;
            align-items: center;
            flex-wrap: wrap;
        }
        .control-btn {
            background: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
            padding: 6px 12px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.85em;
        }
        .control-btn:hover {
            background: var(--vscode-button-hoverBackground);
        }
        .refresh-btn {
            background: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
        }
        .refresh-btn:hover {
            background: var(--vscode-button-hoverBackground);
        }
        .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        .stat-card {
            background: var(--vscode-editor-inactiveSelectionBackground);
            border: 1px solid var(--vscode-panel-border);
            border-radius: 6px;
            padding: 20px;
            text-align: center;
        }
        .stat-number {
            font-size: 2.5em;
            font-weight: bold;
            color: var(--vscode-textLink-foreground);
            margin-bottom: 8px;
        }
        .stat-label {
            color: var(--vscode-descriptionForeground);
            text-transform: uppercase;
            font-size: 0.9em;
            letter-spacing: 0.5px;
        }
        .section {
            margin-bottom: 30px;
        }
        .section h2 {
            color: var(--vscode-textLink-foreground);
            border-bottom: 2px solid var(--vscode-textLink-foreground);
            padding-bottom: 8px;
            margin-bottom: 20px;
        }
        .item-grid {
            display: grid;
            gap: 12px;
        }
        .item-card {
            background: var(--vscode-list-inactiveSelectionBackground);
            border: 1px solid var(--vscode-list-inactiveSelectionBackground);
            border-radius: 4px;
            padding: 16px;
            transition: all 0.2s ease;
        }
        .item-card:hover {
            background: var(--vscode-list-hoverBackground);
            border-color: var(--vscode-focusBorder);
        }
        .item-title {
            font-weight: bold;
            color: var(--vscode-textLink-foreground);
            margin-bottom: 4px;
        }
        .item-description {
            color: var(--vscode-descriptionForeground);
            font-size: 0.9em;
        }
        .item-meta {
            color: var(--vscode-descriptionForeground);
            font-size: 0.8em;
            margin-top: 8px;
        }
        .actions {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-top: 30px;
        }
        .action-section {
            background: var(--vscode-editor-inactiveSelectionBackground);
            border: 1px solid var(--vscode-panel-border);
            border-radius: 6px;
            padding: 16px;
        }
        .action-section h3 {
            margin: 0 0 12px 0;
            color: var(--vscode-textLink-foreground);
            font-size: 0.9em;
            text-transform: uppercase;
            letter-spacing: 0.5px;
        }
        .action-section .action-btn {
            width: 100%;
            margin-bottom: 6px;
        }
        .action-section .action-btn:last-child {
            margin-bottom: 0;
        }
        .server-stat {
            border-left: 3px solid var(--vscode-textLink-foreground);
        }
        .action-btn.cleanup {
            background: var(--vscode-testing-iconFailed);
            color: var(--vscode-editor-background);
        }
        .action-btn.cleanup:hover {
            background: var(--vscode-errorForeground);
        }
        .action-btn {
            background: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
            padding: 10px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 0.9em;
        }
        .action-btn:hover {
            background: var(--vscode-button-hoverBackground);
        }
        .empty-state {
            text-align: center;
            color: var(--vscode-descriptionForeground);
            font-style: italic;
            padding: 40px;
        }
        .status-indicator {
            display: inline-block;
            width: 8px;
            height: 8px;
            border-radius: 50%;
            margin-right: 8px;
        }
        .status-active {
            background-color: #4CAF50;
        }
        .status-locked {
            background-color: #FF5722;
        }
        .status-pending {
            background-color: #FF9800;
        }
    </style>
</head>
<body>
    <div class="header">
        <h1>🚀 KRINS AI Coordination Dashboard</h1>
        <div class="header-controls">
            <div class="server-status ${this._isServerRunning ? 'running' : 'stopped'}">
                <span class="status-dot"></span>
                ${this._isServerRunning ? `Server Running (Port ${this._serverConfig.port})` : 'Server Stopped'}
            </div>
            <div class="header-buttons">
                ${!this._isServerRunning ?
            '<button class="control-btn" onclick="startServer()">🚀 Start Server</button>' :
            '<button class="control-btn" onclick="stopServer()">⏹️ Stop Server</button>'}
                <button class="control-btn" onclick="openExternal()">🌐 Open Web</button>
                <button class="refresh-btn" onclick="refresh()">🔄 Refresh</button>
            </div>
        </div>
    </div>

    <div class="stats-grid">
        <div class="stat-card">
            <div class="stat-number">${status.activeSessions}</div>
            <div class="stat-label">Active Sessions</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">${status.activeFiles}</div>
            <div class="stat-label">Locked Files</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">${status.pendingMessages}</div>
            <div class="stat-label">Pending Messages</div>
        </div>
        <div class="stat-card">
            <div class="stat-number">${status.currentSession}</div>
            <div class="stat-label">Current Session</div>
        </div>
        ${serverStats ? `
        <div class="stat-card server-stat">
            <div class="stat-number">${serverStats.healthyConnections}</div>
            <div class="stat-label">Healthy Connections</div>
        </div>
        <div class="stat-card server-stat">
            <div class="stat-number">${serverStats.uptime}</div>
            <div class="stat-label">Server Uptime</div>
        </div>
        ` : ''}
    </div>

    ${status.sessions.length > 0 ? `
    <div class="section">
        <h2>👥 Active Sessions</h2>
        <div class="item-grid">
            ${status.sessions.map(session => `
                <div class="item-card">
                    <div class="item-title">
                        <span class="status-indicator status-active"></span>
                        ${session.id}
                    </div>
                    <div class="item-description">${session.description}</div>
                    <div class="item-meta">
                        Last activity: ${new Date(session.lastActivity).toLocaleString()}
                        ${session.currentTask ? `<br>Current task: ${session.currentTask}` : ''}
                    </div>
                </div>
            `).join('')}
        </div>
    </div>
    ` : '<div class="section"><div class="empty-state">No active sessions</div></div>'}

    ${status.locks.length > 0 ? `
    <div class="section">
        <h2>🔒 Locked Files</h2>
        <div class="item-grid">
            ${status.locks.map(lock => `
                <div class="item-card">
                    <div class="item-title">
                        <span class="status-indicator status-locked"></span>
                        ${lock.file}
                    </div>
                    <div class="item-description">${lock.reason}</div>
                    <div class="item-meta">
                        Locked by session ${lock.session}<br>
                        Since: ${new Date(lock.since).toLocaleString()}
                    </div>
                </div>
            `).join('')}
        </div>
    </div>
    ` : '<div class="section"><div class="empty-state">No locked files</div></div>'}

    ${status.recentMessages.length > 0 ? `
    <div class="section">
        <h2>💬 Recent Messages</h2>
        <div class="item-grid">
            ${status.recentMessages.map(msg => `
                <div class="item-card">
                    <div class="item-title">
                        <span class="status-indicator status-pending"></span>
                        From ${msg.from}
                    </div>
                    <div class="item-description">${msg.message}</div>
                    <div class="item-meta">${new Date(msg.timestamp).toLocaleString()}</div>
                </div>
            `).join('')}
        </div>
    </div>
    ` : '<div class="section"><div class="empty-state">No recent messages</div></div>'}

    <div class="actions">
        <div class="action-section">
            <h3>🔧 File Operations</h3>
            <button class="action-btn" onclick="lockFile()">🔒 Lock Current File</button>
            <button class="action-btn" onclick="assignTask()">🤖 Assign AI Task</button>
            <button class="action-btn" onclick="runQualityGates()">🛡️ Quality Gates</button>
        </div>
        <div class="action-section">
            <h3>💬 Communication</h3>
            <button class="action-btn" onclick="sendMessage()">💬 Send Message</button>
            <button class="action-btn" onclick="aiAssist()">🧠 AI Assistant</button>
        </div>
        <div class="action-section">
            <h3>🚀 Deployment</h3>
            <button class="action-btn" onclick="deploy()">🚀 Deploy Project</button>
            ${this._isServerRunning ? '<button class="action-btn cleanup" onclick="runCleanup()">🧹 Run Cleanup</button>' : ''}
        </div>
        <div class="action-section">
            <h3>📊 Monitoring</h3>
            <button class="action-btn" onclick="refresh()">🔄 Refresh Status</button>
            ${this._isServerRunning ? '<button class="action-btn" onclick="openExternal()">🌐 Open Web Dashboard</button>' : ''}
        </div>
    </div>

    <script>
        const vscode = acquireVsCodeApi();
        
        function refresh() {
            vscode.postMessage({ command: 'refresh' });
        }
        
        function lockFile() {
            vscode.postMessage({ command: 'lockFile' });
        }
        
        function sendMessage() {
            vscode.postMessage({ command: 'sendMessage' });
        }
        
        function aiAssist() {
            vscode.postMessage({ command: 'aiAssist' });
        }
        
        function startServer() {
            vscode.postMessage({ command: 'startServer' });
        }
        
        function stopServer() {
            vscode.postMessage({ command: 'stopServer' });
        }
        
        function openExternal() {
            vscode.postMessage({ command: 'openExternal' });
        }
        
        function runCleanup() {
            if (confirm('This will clean up zombie sessions and orphaned locks. Continue?')) {
                vscode.postMessage({ command: 'runCleanup' });
            }
        }
        
        function assignTask() {
            vscode.postMessage({ command: 'assignTask' });
        }
        
        function runQualityGates() {
            vscode.postMessage({ command: 'runQualityGates' });
        }
        
        function deploy() {
            vscode.postMessage({ command: 'deploy' });
        }
        
        // Auto-refresh indicator
        let refreshCount = 0;
        setInterval(() => {
            refreshCount++;
            if (refreshCount % 3 === 0) {
                refresh();
            }
        }, 10000);
    </script>
</body>
</html>`;
    }
    getErrorContent(error) {
        return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Claude Code Coordination Dashboard - Error</title>
    <style>
        body {
            font-family: var(--vscode-font-family);
            color: var(--vscode-foreground);
            background-color: var(--vscode-editor-background);
            padding: 40px;
            text-align: center;
        }
        .error-container {
            background: var(--vscode-inputValidation-errorBackground);
            border: 1px solid var(--vscode-inputValidation-errorBorder);
            border-radius: 6px;
            padding: 30px;
            max-width: 600px;
            margin: 0 auto;
        }
        .error-title {
            color: var(--vscode-errorForeground);
            font-size: 1.5em;
            margin-bottom: 16px;
        }
        .error-message {
            color: var(--vscode-descriptionForeground);
            margin-bottom: 20px;
        }
        .retry-btn {
            background: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
            padding: 10px 20px;
            border-radius: 4px;
            cursor: pointer;
        }
        .retry-btn:hover {
            background: var(--vscode-button-hoverBackground);
        }
    </style>
</head>
<body>
    <div class="error-container">
        <div class="error-title">❌ Dashboard Error</div>
        <div class="error-message">
            Failed to load coordination status:<br>
            <code>${error}</code>
        </div>
        <button class="retry-btn" onclick="refresh()">🔄 Retry</button>
    </div>

    <script>
        const vscode = acquireVsCodeApi();
        
        function refresh() {
            vscode.postMessage({ command: 'refresh' });
        }
    </script>
</body>
</html>`;
    }
}
exports.WebDashboardPanel = WebDashboardPanel;
//# sourceMappingURL=webDashboard.js.map