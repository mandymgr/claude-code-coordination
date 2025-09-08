import * as vscode from 'vscode';
import { exec } from 'child_process';
import { CoordinationStatus } from './extension';

export class WebDashboardPanel {
  public static currentPanel: WebDashboardPanel | undefined;
  private readonly _panel: vscode.WebviewPanel;
  private readonly _extensionPath: string;
  private _disposables: vscode.Disposable[] = [];

  public static createOrShow(extensionPath?: string) {
    const column = vscode.window.activeTextEditor ? vscode.window.activeTextEditor.viewColumn : undefined;

    if (WebDashboardPanel.currentPanel) {
      WebDashboardPanel.currentPanel._panel.reveal(column);
      return;
    }

    const panel = vscode.window.createWebviewPanel(
      'claudeCoordinationDashboard',
      'Claude Code Coordination Dashboard',
      column || vscode.ViewColumn.One,
      {
        enableScripts: true,
        retainContextWhenHidden: true
      }
    );

    WebDashboardPanel.currentPanel = new WebDashboardPanel(panel, extensionPath || '');
  }

  private constructor(panel: vscode.WebviewPanel, extensionPath: string) {
    this._panel = panel;
    this._extensionPath = extensionPath;

    this._update();
    this._panel.onDidDispose(() => this.dispose(), null, this._disposables);

    this._panel.webview.onDidReceiveMessage(
      message => {
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
        }
      },
      null,
      this._disposables
    );

    // Auto-refresh every 10 seconds
    const refreshInterval = setInterval(() => {
      this._update();
    }, 10000);

    this._disposables.push({
      dispose: () => clearInterval(refreshInterval)
    });
  }

  public dispose() {
    WebDashboardPanel.currentPanel = undefined;
    this._panel.dispose();

    while (this._disposables.length) {
      const x = this._disposables.pop();
      if (x) {
        x.dispose();
      }
    }
  }

  private async _update() {
    try {
      const status = await this.getCoordinationStatus();
      this._panel.webview.html = this.getWebviewContent(status);
    } catch (error) {
      this._panel.webview.html = this.getErrorContent(error as string);
    }
  }

  private async getCoordinationStatus(): Promise<CoordinationStatus> {
    return new Promise((resolve, reject) => {
      const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
      if (!workspaceFolder) {
        reject('No workspace folder open');
        return;
      }

      const config = vscode.workspace.getConfiguration('claude-coordination');
      const magicPath = config.get<string>('magicCliPath') || 'magic';
      const command = `${magicPath} coord-status --json`;

      exec(command, {
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
        } catch (parseError) {
          reject('Failed to parse coordination status');
        }
      });
    });
  }

  private getWebviewContent(status: CoordinationStatus): string {
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
        }
        .header h1 {
            margin: 0;
            color: var(--vscode-textLink-foreground);
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
            display: flex;
            gap: 12px;
            margin-top: 20px;
            flex-wrap: wrap;
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
        <h1>🔄 Claude Code Coordination Dashboard</h1>
        <button class="refresh-btn" onclick="refresh()">🔄 Refresh</button>
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
        <button class="action-btn" onclick="lockFile()">🔒 Lock Current File</button>
        <button class="action-btn" onclick="sendMessage()">💬 Send Message</button>
        <button class="action-btn" onclick="aiAssist()">🤖 AI Assistant</button>
        <button class="action-btn" onclick="refresh()">🔄 Refresh Status</button>
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

  private getErrorContent(error: string): string {
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