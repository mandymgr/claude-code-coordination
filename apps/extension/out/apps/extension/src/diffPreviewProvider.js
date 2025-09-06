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
exports.DiffPreviewProvider = void 0;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const socket_io_client_1 = require("socket.io-client");
class DiffPreviewProvider {
    constructor(_extensionUri) {
        this._extensionUri = _extensionUri;
        this._pendingDiffs = [];
        this.initializeWebSocket();
    }
    initializeWebSocket() {
        try {
            const config = vscode.workspace.getConfiguration('claude-coordination');
            const serverUrl = config.get('serverUrl') || 'http://localhost:8080';
            this._socket = (0, socket_io_client_1.io)(serverUrl);
            this._socket.on('connect', () => {
                console.log('✅ Diff Preview connected to coordination server');
                // Join a project room for diff updates
                const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
                if (workspaceFolder) {
                    this._socket?.emit('join-project', {
                        projectId: path.basename(workspaceFolder.uri.fsPath),
                        userId: `vscode-diff-${Date.now()}`
                    });
                }
            });
            this._socket.on('diff-generated', (diffData) => {
                console.log('📝 New diff generated:', diffData);
                this._pendingDiffs.unshift(diffData);
                this.refreshWebview();
            });
            this._socket.on('diff-applied', (diffId) => {
                this._pendingDiffs = this._pendingDiffs.filter(d => d.id !== diffId);
                this.refreshWebview();
            });
        }
        catch (error) {
            console.error('Failed to initialize WebSocket for diff preview:', error);
        }
    }
    resolveWebviewView(webviewView, context, _token) {
        this._view = webviewView;
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri]
        };
        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
        // Handle messages from webview
        webviewView.webview.onDidReceiveMessage(data => {
            switch (data.type) {
                case 'applyDiff':
                    this.applyDiff(data.diffId);
                    break;
                case 'rejectDiff':
                    this.rejectDiff(data.diffId);
                    break;
                case 'previewDiff':
                    this.previewDiff(data.diffId);
                    break;
                case 'refresh':
                    this.refreshWebview();
                    break;
            }
        });
    }
    async applyDiff(diffId) {
        const diff = this._pendingDiffs.find(d => d.id === diffId);
        if (!diff)
            return;
        try {
            // Apply the diff to the file
            const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
            if (!workspaceFolder) {
                throw new Error('No workspace folder open');
            }
            const filePath = path.join(workspaceFolder.uri.fsPath, diff.fileName);
            const fileUri = vscode.Uri.file(filePath);
            // Open the file and apply changes
            const document = await vscode.workspace.openTextDocument(fileUri);
            const editor = await vscode.window.showTextDocument(document);
            const edit = new vscode.WorkspaceEdit();
            const fullRange = new vscode.Range(document.positionAt(0), document.positionAt(document.getText().length));
            edit.replace(fileUri, fullRange, diff.diffContent);
            await vscode.workspace.applyEdit(edit);
            // Remove from pending list
            this._pendingDiffs = this._pendingDiffs.filter(d => d.id !== diffId);
            this.refreshWebview();
            // Notify server
            this._socket?.emit('diff-applied', { diffId, status: 'applied' });
            vscode.window.showInformationMessage(`✅ Diff applied to ${diff.fileName}`);
        }
        catch (error) {
            vscode.window.showErrorMessage(`Failed to apply diff: ${error}`);
        }
    }
    async rejectDiff(diffId) {
        const diff = this._pendingDiffs.find(d => d.id === diffId);
        if (!diff)
            return;
        // Remove from pending list
        this._pendingDiffs = this._pendingDiffs.filter(d => d.id !== diffId);
        this.refreshWebview();
        // Notify server
        this._socket?.emit('diff-rejected', { diffId, status: 'rejected' });
        vscode.window.showInformationMessage(`❌ Diff rejected for ${diff.fileName}`);
    }
    async previewDiff(diffId) {
        const diff = this._pendingDiffs.find(d => d.id === diffId);
        if (!diff)
            return;
        try {
            // Create a virtual document with the diff content
            const diffDocument = await vscode.workspace.openTextDocument({
                content: this.generateDiffView(diff),
                language: 'diff'
            });
            await vscode.window.showTextDocument(diffDocument, {
                viewColumn: vscode.ViewColumn.Beside
            });
        }
        catch (error) {
            vscode.window.showErrorMessage(`Failed to preview diff: ${error}`);
        }
    }
    generateDiffView(diff) {
        return `AI-Generated Diff for ${diff.fileName}
Agent: ${diff.aiAgent.toUpperCase()}
Description: ${diff.description}
Timestamp: ${new Date(diff.timestamp).toLocaleString()}

--- Original
+++ Modified
${this.generateUnifiedDiff(diff.originalContent, diff.diffContent)}`;
    }
    generateUnifiedDiff(original, modified) {
        // Simple diff generation - in production you'd use a proper diff library
        const originalLines = original.split('\n');
        const modifiedLines = modified.split('\n');
        let diffLines = [];
        const maxLines = Math.max(originalLines.length, modifiedLines.length);
        for (let i = 0; i < maxLines; i++) {
            const originalLine = originalLines[i] || '';
            const modifiedLine = modifiedLines[i] || '';
            if (originalLine !== modifiedLine) {
                if (originalLine)
                    diffLines.push(`-${originalLine}`);
                if (modifiedLine)
                    diffLines.push(`+${modifiedLine}`);
            }
            else if (originalLine) {
                diffLines.push(` ${originalLine}`);
            }
        }
        return diffLines.join('\n');
    }
    refreshWebview() {
        if (this._view) {
            this._view.webview.html = this._getHtmlForWebview(this._view.webview);
        }
    }
    _getHtmlForWebview(webview) {
        return `<!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>AI Diff Preview</title>
        <style>
            body {
                font-family: var(--vscode-font-family);
                color: var(--vscode-foreground);
                background-color: var(--vscode-editor-background);
                padding: 10px;
                margin: 0;
            }
            .diff-header {
                display: flex;
                justify-content: between;
                align-items: center;
                margin-bottom: 15px;
                padding-bottom: 10px;
                border-bottom: 1px solid var(--vscode-panel-border);
            }
            .diff-item {
                background: var(--vscode-editor-inactiveSelectionBackground);
                border: 1px solid var(--vscode-panel-border);
                border-radius: 4px;
                margin-bottom: 10px;
                overflow: hidden;
            }
            .diff-item-header {
                padding: 12px;
                background: var(--vscode-titleBar-inactiveBackground);
                border-bottom: 1px solid var(--vscode-panel-border);
            }
            .diff-item-title {
                font-weight: bold;
                margin-bottom: 4px;
            }
            .diff-item-meta {
                font-size: 0.9em;
                opacity: 0.8;
            }
            .diff-item-content {
                padding: 12px;
                max-height: 200px;
                overflow-y: auto;
                font-family: var(--vscode-editor-font-family);
                font-size: var(--vscode-editor-font-size);
                white-space: pre-wrap;
                background: var(--vscode-editor-background);
            }
            .diff-actions {
                padding: 8px 12px;
                background: var(--vscode-titleBar-inactiveBackground);
                display: flex;
                gap: 8px;
            }
            .diff-button {
                background: var(--vscode-button-background);
                color: var(--vscode-button-foreground);
                border: none;
                padding: 6px 12px;
                border-radius: 3px;
                cursor: pointer;
                font-size: 0.9em;
            }
            .diff-button:hover {
                background: var(--vscode-button-hoverBackground);
            }
            .diff-button.success {
                background: var(--vscode-testing-iconPassed);
            }
            .diff-button.danger {
                background: var(--vscode-testing-iconFailed);
            }
            .diff-button.secondary {
                background: var(--vscode-button-secondaryBackground);
                color: var(--vscode-button-secondaryForeground);
            }
            .empty-state {
                text-align: center;
                padding: 40px 20px;
                opacity: 0.7;
            }
            .agent-badge {
                display: inline-block;
                padding: 2px 6px;
                border-radius: 3px;
                font-size: 0.8em;
                font-weight: bold;
                text-transform: uppercase;
            }
            .agent-claude { background: #8B5CF6; color: white; }
            .agent-gpt4 { background: #10B981; color: white; }
            .agent-gemini { background: #F59E0B; color: white; }
            .refresh-button {
                float: right;
                background: var(--vscode-button-secondaryBackground);
                color: var(--vscode-button-secondaryForeground);
                border: none;
                padding: 4px 8px;
                border-radius: 3px;
                cursor: pointer;
                font-size: 0.8em;
            }
        </style>
    </head>
    <body>
        <div class="diff-header">
            <h2>🔍 AI Diff Preview</h2>
            <button class="refresh-button" onclick="refresh()">🔄 Refresh</button>
        </div>

        ${this._pendingDiffs.length === 0 ? `
            <div class="empty-state">
                <p>📄 No pending diffs</p>
                <p>AI-generated code changes will appear here</p>
            </div>
        ` : this._pendingDiffs.map(diff => `
            <div class="diff-item">
                <div class="diff-item-header">
                    <div class="diff-item-title">
                        📄 ${diff.fileName}
                        <span class="agent-badge agent-${diff.aiAgent}">${diff.aiAgent}</span>
                    </div>
                    <div class="diff-item-meta">
                        ${diff.description} • ${new Date(diff.timestamp).toLocaleTimeString()}
                    </div>
                </div>
                <div class="diff-item-content">${this.escapeHtml(diff.diffContent.substring(0, 500))}${diff.diffContent.length > 500 ? '...' : ''}</div>
                <div class="diff-actions">
                    <button class="diff-button success" onclick="applyDiff('${diff.id}')">✅ Apply</button>
                    <button class="diff-button danger" onclick="rejectDiff('${diff.id}')">❌ Reject</button>
                    <button class="diff-button secondary" onclick="previewDiff('${diff.id}')">👁️ Preview</button>
                </div>
            </div>
        `).join('')}

        <script>
            const vscode = acquireVsCodeApi();
            
            function applyDiff(diffId) {
                vscode.postMessage({ type: 'applyDiff', diffId });
            }
            
            function rejectDiff(diffId) {
                vscode.postMessage({ type: 'rejectDiff', diffId });
            }
            
            function previewDiff(diffId) {
                vscode.postMessage({ type: 'previewDiff', diffId });
            }
            
            function refresh() {
                vscode.postMessage({ type: 'refresh' });
            }
        </script>
    </body>
    </html>`;
    }
    escapeHtml(text) {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#39;');
    }
    addDiff(diffData) {
        this._pendingDiffs.unshift(diffData);
        this.refreshWebview();
    }
    dispose() {
        this._socket?.disconnect();
    }
}
exports.DiffPreviewProvider = DiffPreviewProvider;
DiffPreviewProvider.viewType = 'claude-coordination-diff-preview';
//# sourceMappingURL=diffPreviewProvider.js.map