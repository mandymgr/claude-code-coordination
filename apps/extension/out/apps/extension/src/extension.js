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
exports.deactivate = exports.activate = void 0;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
const child_process_1 = require("child_process");
const statusProvider_1 = require("./statusProvider");
const decorationProvider_1 = require("./decorationProvider");
const webDashboard_1 = require("./webDashboard");
const diffPreviewProvider_1 = require("./diffPreviewProvider");
const qualityGateProvider_1 = require("./qualityGateProvider");
const index_js_1 = require("./commands/index.js");
const onboardingWizard_js_1 = require("./onboardingWizard.js");
function activate(context) {
    console.log('🚀 Claude Code Coordination extension is now active!');
    // Initialize providers
    const statusProvider = new statusProvider_1.CoordinationStatusProvider();
    const decorationProvider = new decorationProvider_1.CoordinationDecorationProvider();
    const diffPreviewProvider = new diffPreviewProvider_1.DiffPreviewProvider(context.extensionUri);
    const qualityGateProvider = new qualityGateProvider_1.QualityGateProvider(context.extensionUri, context);
    // Register tree view
    vscode.window.createTreeView('claude-coordination-status', {
        treeDataProvider: statusProvider,
        showCollapseAll: true
    });
    // Register diff preview webview
    vscode.window.registerWebviewViewProvider(diffPreviewProvider_1.DiffPreviewProvider.viewType, diffPreviewProvider);
    // Register quality gate webview
    vscode.window.registerWebviewViewProvider(qualityGateProvider_1.QualityGateProvider.viewType, qualityGateProvider);
    // Auto-start coordination session if enabled
    const config = vscode.workspace.getConfiguration('claude-coordination');
    if (config.get('autoStartSession') && vscode.workspace.workspaceFolders) {
        startCoordinationSession();
    }
    // Register commands
    const commands = [
        vscode.commands.registerCommand('claude-coordination.coordinate', startCoordinationSession),
        vscode.commands.registerCommand('claude-coordination.assignTask', index_js_1.assignTask),
        vscode.commands.registerCommand('claude-coordination.createProject', index_js_1.createProjectFromPrompt),
        vscode.commands.registerCommand('claude-coordination.deploy', index_js_1.deploy),
        vscode.commands.registerCommand('claude-coordination.toggleLock', index_js_1.toggleFileLock),
        vscode.commands.registerCommand('claude-coordination.lockFile', lockCurrentFile),
        vscode.commands.registerCommand('claude-coordination.unlockFile', unlockCurrentFile),
        vscode.commands.registerCommand('claude-coordination.status', showCoordinationStatus),
        vscode.commands.registerCommand('claude-coordination.sendMessage', sendMessage),
        vscode.commands.registerCommand('claude-coordination.aiAssist', aiAssist),
        vscode.commands.registerCommand('claude-coordination.openDashboard', openWebDashboard),
        vscode.commands.registerCommand('claude-coordination.runQualityGates', () => qualityGateProvider.runQualityGates()),
        vscode.commands.registerCommand('claude-coordination.refresh', () => {
            statusProvider.refresh();
            decorationProvider.refresh();
        }),
        (0, onboardingWizard_js_1.createOnboardingCommand)(context)
    ];
    // Register decoration provider for file decorations
    if (config.get('showFileDecorations')) {
        const disposable = vscode.window.registerFileDecorationProvider(decorationProvider);
        context.subscriptions.push(disposable);
    }
    // Watch for coordination changes and refresh status
    watchCoordinationChanges(() => {
        statusProvider.refresh();
        decorationProvider.refresh();
    });
    // Add status bar item
    const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
    statusBarItem.command = 'claude-coordination.status';
    statusBarItem.tooltip = 'Claude Code Coordination Status';
    updateStatusBar(statusBarItem);
    statusBarItem.show();
    // Subscribe all disposables
    context.subscriptions.push(...commands, statusBarItem, diffPreviewProvider);
    // Set up periodic status updates
    const statusInterval = setInterval(() => {
        updateStatusBar(statusBarItem);
    }, 5000);
    context.subscriptions.push({
        dispose: () => clearInterval(statusInterval)
    });
}
exports.activate = activate;
async function startCoordinationSession() {
    const description = await vscode.window.showInputBox({
        prompt: 'Enter session description',
        placeHolder: 'Working on feature implementation...',
        value: `VS Code session - ${new Date().toLocaleDateString()}`
    });
    if (!description) {
        return;
    }
    try {
        await executeMagicCommand(['coordinate', `"${description}"`]);
        vscode.window.showInformationMessage(`🚀 Coordination session started: ${description}`);
    }
    catch (error) {
        vscode.window.showErrorMessage(`Failed to start coordination session: ${error}`);
    }
}
async function lockCurrentFile() {
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) {
        vscode.window.showWarningMessage('No active file to lock');
        return;
    }
    const filePath = activeEditor.document.fileName;
    const workspaceFolder = vscode.workspace.getWorkspaceFolder(activeEditor.document.uri);
    if (!workspaceFolder) {
        vscode.window.showWarningMessage('File must be in workspace to coordinate');
        return;
    }
    const relativePath = path.relative(workspaceFolder.uri.fsPath, filePath);
    const reason = await vscode.window.showInputBox({
        prompt: 'Reason for locking file',
        placeHolder: 'Editing component logic...',
        value: `Editing ${path.basename(filePath)}`
    });
    if (!reason) {
        return;
    }
    try {
        await executeMagicCommand(['lock', relativePath, `"${reason}"`]);
        vscode.window.showInformationMessage(`🔒 File locked: ${path.basename(filePath)}`);
    }
    catch (error) {
        vscode.window.showErrorMessage(`Failed to lock file: ${error}`);
    }
}
async function unlockCurrentFile() {
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) {
        vscode.window.showWarningMessage('No active file to unlock');
        return;
    }
    const filePath = activeEditor.document.fileName;
    const workspaceFolder = vscode.workspace.getWorkspaceFolder(activeEditor.document.uri);
    if (!workspaceFolder) {
        return;
    }
    const relativePath = path.relative(workspaceFolder.uri.fsPath, filePath);
    try {
        await executeMagicCommand(['unlock', relativePath]);
        vscode.window.showInformationMessage(`🔓 File unlocked: ${path.basename(filePath)}`);
    }
    catch (error) {
        vscode.window.showErrorMessage(`Failed to unlock file: ${error}`);
    }
}
async function showCoordinationStatus() {
    try {
        const status = await getCoordinationStatus();
        const panel = vscode.window.createWebviewPanel('coordinationStatus', 'Claude Code Coordination Status', vscode.ViewColumn.One, { enableScripts: true });
        panel.webview.html = generateStatusWebview(status);
    }
    catch (error) {
        vscode.window.showErrorMessage(`Failed to get coordination status: ${error}`);
    }
}
async function sendMessage() {
    const message = await vscode.window.showInputBox({
        prompt: 'Message to send to team',
        placeHolder: 'Starting deployment process...'
    });
    if (!message) {
        return;
    }
    try {
        await executeMagicCommand(['message', `"${message}"`]);
        vscode.window.showInformationMessage(`💬 Message sent: ${message}`);
    }
    catch (error) {
        vscode.window.showErrorMessage(`Failed to send message: ${error}`);
    }
}
async function aiAssist() {
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) {
        vscode.window.showWarningMessage('No active file for AI assistance');
        return;
    }
    const question = await vscode.window.showInputBox({
        prompt: 'Ask AI about your code',
        placeHolder: 'How can I optimize this function?'
    });
    if (!question) {
        return;
    }
    // Get selected text or current line
    const selection = activeEditor.selection;
    const selectedText = activeEditor.document.getText(selection);
    const context = selectedText || activeEditor.document.lineAt(selection.active.line).text;
    try {
        const response = await executeMagicCommand(['ai', `"${question}"`], { includeContext: context });
        // Show AI response in a new document
        const doc = await vscode.workspace.openTextDocument({
            content: `AI Assistant Response:\n\nQuestion: ${question}\n\nContext:\n${context}\n\nResponse:\n${response}`,
            language: 'markdown'
        });
        await vscode.window.showTextDocument(doc);
    }
    catch (error) {
        vscode.window.showErrorMessage(`AI assistance failed: ${error}`);
    }
}
async function openWebDashboard() {
    try {
        webDashboard_1.WebDashboardPanel.createOrShow();
    }
    catch (error) {
        vscode.window.showErrorMessage(`Failed to open web dashboard: ${error}`);
    }
}
async function executeMagicCommand(args, options = {}) {
    return new Promise((resolve, reject) => {
        const config = vscode.workspace.getConfiguration('claude-coordination');
        const magicPath = config.get('magicCliPath') || 'magic';
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            reject('No workspace folder open');
            return;
        }
        const command = `${magicPath} ${args.join(' ')}`;
        (0, child_process_1.exec)(command, {
            cwd: workspaceFolder.uri.fsPath,
            timeout: 30000
        }, (error, stdout, stderr) => {
            if (error) {
                reject(stderr || error.message);
                return;
            }
            resolve(stdout.trim());
        });
    });
}
async function getCoordinationStatus() {
    const output = await executeMagicCommand(['coord-status', '--json']);
    return JSON.parse(output);
}
function updateStatusBar(statusBarItem) {
    getCoordinationStatus()
        .then(status => {
        const activeFiles = status.activeFiles > 0 ? `🔒${status.activeFiles}` : '';
        const activeSessions = status.activeSessions > 1 ? `👥${status.activeSessions}` : '';
        const messages = status.pendingMessages > 0 ? `💬${status.pendingMessages}` : '';
        statusBarItem.text = `$(sync) ${activeFiles} ${activeSessions} ${messages}`.trim();
        statusBarItem.backgroundColor = status.activeSessions > 0 ?
            new vscode.ThemeColor('claude-coordination.activeSession') : undefined;
    })
        .catch(() => {
        statusBarItem.text = '$(sync) Claude Coordination';
        statusBarItem.backgroundColor = undefined;
    });
}
function watchCoordinationChanges(callback) {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
        return;
    }
    const coordinationDir = path.join(workspaceFolder.uri.fsPath, '.claude-coordination');
    if (!fs.existsSync(coordinationDir)) {
        return;
    }
    const watcher = vscode.workspace.createFileSystemWatcher(new vscode.RelativePattern(workspaceFolder, '.claude-coordination/**/*'));
    watcher.onDidChange(callback);
    watcher.onDidCreate(callback);
    watcher.onDidDelete(callback);
    return watcher;
}
function generateStatusWebview(status) {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Claude Code Coordination Status</title>
        <style>
            body { 
                font-family: var(--vscode-font-family); 
                color: var(--vscode-foreground);
                background-color: var(--vscode-editor-background);
                padding: 20px;
            }
            .status-section { margin-bottom: 20px; }
            .status-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 15px; }
            .status-card { 
                background: var(--vscode-editor-inactiveSelectionBackground);
                padding: 15px;
                border-radius: 4px;
                border: 1px solid var(--vscode-panel-border);
            }
            .status-title { font-weight: bold; margin-bottom: 10px; }
            .status-value { font-size: 1.5em; color: var(--vscode-textLink-foreground); }
            .session-item, .lock-item, .message-item { 
                padding: 8px;
                margin: 4px 0;
                background: var(--vscode-list-hoverBackground);
                border-radius: 3px;
            }
        </style>
    </head>
    <body>
        <h1>🔄 Claude Code Coordination Status</h1>
        
        <div class="status-section">
            <h2>Overview</h2>
            <div class="status-grid">
                <div class="status-card">
                    <div class="status-title">Current Session</div>
                    <div class="status-value">${status.currentSession}</div>
                </div>
                <div class="status-card">
                    <div class="status-title">Active Sessions</div>
                    <div class="status-value">${status.activeSessions}</div>
                </div>
                <div class="status-card">
                    <div class="status-title">Locked Files</div>
                    <div class="status-value">${status.activeFiles}</div>
                </div>
                <div class="status-card">
                    <div class="status-title">Pending Messages</div>
                    <div class="status-value">${status.pendingMessages}</div>
                </div>
            </div>
        </div>

        ${status.sessions.length > 0 ? `
        <div class="status-section">
            <h2>👥 Active Sessions</h2>
            ${status.sessions.map(session => `
                <div class="session-item">
                    <strong>${session.id}</strong> - ${session.description}
                    <br><small>Last activity: ${new Date(session.lastActivity).toLocaleString()}</small>
                    ${session.currentTask ? `<br><em>Current task: ${session.currentTask}</em>` : ''}
                </div>
            `).join('')}
        </div>
        ` : ''}

        ${status.locks.length > 0 ? `
        <div class="status-section">
            <h2>🔒 Locked Files</h2>
            ${status.locks.map(lock => `
                <div class="lock-item">
                    <strong>${lock.file}</strong> - ${lock.reason}
                    <br><small>By session ${lock.session} since ${new Date(lock.since).toLocaleString()}</small>
                </div>
            `).join('')}
        </div>
        ` : ''}

        ${status.recentMessages.length > 0 ? `
        <div class="status-section">
            <h2>💬 Recent Messages</h2>
            ${status.recentMessages.map(msg => `
                <div class="message-item">
                    <strong>From ${msg.from}:</strong> ${msg.message}
                    <br><small>${new Date(msg.timestamp).toLocaleString()}</small>
                </div>
            `).join('')}
        </div>
        ` : ''}
    </body>
    </html>
  `;
}
function deactivate() {
    console.log('👋 Claude Code Coordination extension deactivated');
}
exports.deactivate = deactivate;
//# sourceMappingURL=extension.js.map