"use strict";
/**
 * Quality Gate Provider - VS Code WebView for Code Quality Validation
 *
 * Shows real-time quality gate results with pass/fail status
 * Provides auto-fix buttons for failed quality checks
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.QualityGateProvider = void 0;
const vscode = require("vscode");
const axios_1 = require("axios");
class QualityGateProvider {
    constructor(_extensionUri, context) {
        this._extensionUri = _extensionUri;
        this.serverUrl = 'http://localhost:8080';
        this._context = context;
    }
    resolveWebviewView(webviewView, context, _token) {
        this._view = webviewView;
        webviewView.webview.options = {
            enableScripts: true,
            localResourceRoots: [this._extensionUri]
        };
        webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);
        // Handle messages from webview
        webviewView.webview.onDidReceiveMessage(async (data) => {
            switch (data.type) {
                case 'runQualityGates':
                    await this.runQualityGates();
                    break;
                case 'applyFix':
                    await this.applyFix(data.suggestionId);
                    break;
                case 'applyAllFixes':
                    await this.applyAllFixes();
                    break;
                case 'openFile':
                    await this.openFile(data.file, data.line);
                    break;
            }
        });
        // Update webview when result changes
        this.updateWebview();
    }
    async runQualityGates() {
        try {
            // Show loading state
            this.updateWebview('loading');
            // Get currently changed files from git
            const changedFiles = await this.getChangedFiles();
            if (changedFiles.length === 0) {
                vscode.window.showInformationMessage('No changed files to validate');
                return;
            }
            const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
            if (!workspaceFolder) {
                vscode.window.showErrorMessage('No workspace folder found');
                return;
            }
            // Call quality pipeline API
            const response = await axios_1.default.post(`${this.serverUrl}/api/quality/validate`, {
                changedFiles,
                taskDescription: 'VS Code quality validation',
                projectPath: workspaceFolder.uri.fsPath
            });
            this._currentResult = response.data.data;
            this.updateWebview();
            // Show notification
            const message = this._currentResult.passed
                ? `✅ Quality Gates Passed (Score: ${this._currentResult.score})`
                : `❌ Quality Gates Failed (Score: ${this._currentResult.score})`;
            if (this._currentResult.passed) {
                vscode.window.showInformationMessage(message);
            }
            else {
                vscode.window.showWarningMessage(message);
            }
        }
        catch (error) {
            console.error('Quality validation failed:', error);
            vscode.window.showErrorMessage(`Quality validation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
            this.updateWebview('error');
        }
    }
    async applyFix(suggestionId) {
        if (!this._currentResult)
            return;
        const suggestion = this._currentResult.suggestions.find(s => s.id === suggestionId);
        if (!suggestion)
            return;
        try {
            vscode.window.showInformationMessage(`Applying fix: ${suggestion.description}`);
            const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
            if (!workspaceFolder)
                return;
            const response = await axios_1.default.post(`${this.serverUrl}/api/quality/fix`, {
                suggestions: [suggestion],
                projectPath: workspaceFolder.uri.fsPath
            });
            const result = response.data.data;
            if (result.applied.length > 0) {
                vscode.window.showInformationMessage('✅ Fix applied successfully');
                // Re-run quality gates to show improvement
                if (result.newQualityResult) {
                    this._currentResult = result.newQualityResult;
                    this.updateWebview();
                }
            }
            else {
                vscode.window.showErrorMessage(`Failed to apply fix: ${result.failed[0]?.error || 'Unknown error'}`);
            }
        }
        catch (error) {
            console.error('Fix application failed:', error);
            vscode.window.showErrorMessage(`Fix failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async applyAllFixes() {
        if (!this._currentResult || this._currentResult.suggestions.length === 0)
            return;
        const automatableSuggestions = this._currentResult.suggestions.filter(s => s.automatable && s.confidence > 0.7);
        if (automatableSuggestions.length === 0) {
            vscode.window.showInformationMessage('No automatable fixes available');
            return;
        }
        try {
            const choice = await vscode.window.showInformationMessage(`Apply ${automatableSuggestions.length} automated fixes?`, 'Yes', 'No');
            if (choice !== 'Yes')
                return;
            vscode.window.showInformationMessage(`Applying ${automatableSuggestions.length} fixes...`);
            const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
            if (!workspaceFolder)
                return;
            const response = await axios_1.default.post(`${this.serverUrl}/api/quality/fix`, {
                suggestions: automatableSuggestions,
                projectPath: workspaceFolder.uri.fsPath
            });
            const result = response.data.data;
            vscode.window.showInformationMessage(`✅ Applied ${result.applied.length} fixes, ${result.failed.length} failed`);
            // Re-run quality gates to show improvement
            if (result.newQualityResult) {
                this._currentResult = result.newQualityResult;
                this.updateWebview();
            }
        }
        catch (error) {
            console.error('Bulk fix application failed:', error);
            vscode.window.showErrorMessage(`Bulk fix failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        }
    }
    async openFile(filePath, line) {
        try {
            const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
            if (!workspaceFolder)
                return;
            const fullPath = vscode.Uri.joinPath(workspaceFolder.uri, filePath);
            const document = await vscode.workspace.openTextDocument(fullPath);
            const editor = await vscode.window.showTextDocument(document);
            if (line !== undefined) {
                const position = new vscode.Position(Math.max(0, line - 1), 0);
                editor.selection = new vscode.Selection(position, position);
                editor.revealRange(new vscode.Range(position, position));
            }
        }
        catch (error) {
            console.error('Failed to open file:', error);
        }
    }
    async getChangedFiles() {
        return new Promise((resolve) => {
            const { exec } = require('child_process');
            exec('git diff --name-only HEAD', (error, stdout) => {
                if (error) {
                    resolve([]);
                    return;
                }
                const files = stdout.trim().split('\n').filter(f => f);
                resolve(files);
            });
        });
    }
    updateWebview(state) {
        if (!this._view)
            return;
        this._view.webview.postMessage({
            type: 'update',
            data: this._currentResult,
            state
        });
    }
    _getHtmlForWebview(webview) {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Quality Gate</title>
    <style>
        body {
            font-family: var(--vscode-font-family);
            font-size: var(--vscode-font-size);
            color: var(--vscode-foreground);
            background-color: var(--vscode-editor-background);
            padding: 16px;
            margin: 0;
        }
        
        .header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 16px;
            padding-bottom: 8px;
            border-bottom: 1px solid var(--vscode-panel-border);
        }
        
        .score {
            font-size: 24px;
            font-weight: bold;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .score.passed { color: var(--vscode-testing-iconPassed); }
        .score.failed { color: var(--vscode-testing-iconFailed); }
        
        .run-button {
            background: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
        }
        
        .run-button:hover {
            background: var(--vscode-button-hoverBackground);
        }
        
        .gates {
            margin-bottom: 16px;
        }
        
        .gate {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 8px;
            margin: 4px 0;
            border-radius: 4px;
            background: var(--vscode-list-inactiveSelectionBackground);
        }
        
        .gate.passed { border-left: 4px solid var(--vscode-testing-iconPassed); }
        .gate.failed { border-left: 4px solid var(--vscode-testing-iconFailed); }
        
        .gate-name { font-weight: bold; text-transform: capitalize; }
        .gate-score { font-family: monospace; }
        
        .issues {
            margin-top: 16px;
        }
        
        .issue {
            padding: 8px;
            margin: 4px 0;
            border-radius: 4px;
            background: var(--vscode-list-inactiveSelectionBackground);
            cursor: pointer;
        }
        
        .issue:hover {
            background: var(--vscode-list-hoverBackground);
        }
        
        .issue.error { border-left: 4px solid var(--vscode-testing-iconFailed); }
        .issue.warning { border-left: 4px solid var(--vscode-testing-iconQueued); }
        .issue.info { border-left: 4px solid var(--vscode-testing-iconUnset); }
        
        .issue-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 4px;
        }
        
        .issue-file { font-family: monospace; font-size: 11px; opacity: 0.8; }
        .issue-severity { 
            font-size: 10px; 
            padding: 2px 6px; 
            border-radius: 2px; 
            background: var(--vscode-badge-background);
            color: var(--vscode-badge-foreground);
        }
        
        .suggestions {
            margin-top: 16px;
        }
        
        .suggestion {
            padding: 8px;
            margin: 4px 0;
            border-radius: 4px;
            background: var(--vscode-list-inactiveSelectionBackground);
            display: flex;
            justify-content: space-between;
            align-items: center;
        }
        
        .fix-button {
            background: var(--vscode-button-secondaryBackground);
            color: var(--vscode-button-secondaryForeground);
            border: none;
            padding: 4px 8px;
            border-radius: 2px;
            cursor: pointer;
            font-size: 10px;
        }
        
        .fix-button:hover {
            background: var(--vscode-button-secondaryHoverBackground);
        }
        
        .fix-button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
        
        .confidence {
            font-size: 10px;
            opacity: 0.7;
        }
        
        .loading {
            text-align: center;
            padding: 40px;
            opacity: 0.7;
        }
        
        .error {
            text-align: center;
            padding: 40px;
            color: var(--vscode-testing-iconFailed);
        }
        
        .empty {
            text-align: center;
            padding: 40px;
            opacity: 0.7;
        }
        
        .actions {
            display: flex;
            gap: 8px;
            margin-top: 16px;
            padding-top: 16px;
            border-top: 1px solid var(--vscode-panel-border);
        }
        
        .apply-all-button {
            background: var(--vscode-testing-iconPassed);
            color: white;
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            flex: 1;
        }
        
        .apply-all-button:hover {
            opacity: 0.8;
        }
        
        .apply-all-button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
    </style>
</head>
<body>
    <div id="content">
        <div class="empty">
            <p>Click "Run Quality Gates" to validate your changes</p>
            <button class="run-button" onclick="runQualityGates()">Run Quality Gates</button>
        </div>
    </div>

    <script>
        const vscode = acquireVsCodeApi();
        let currentData = null;

        function runQualityGates() {
            vscode.postMessage({ type: 'runQualityGates' });
        }

        function applyFix(suggestionId) {
            vscode.postMessage({ type: 'applyFix', suggestionId });
        }

        function applyAllFixes() {
            vscode.postMessage({ type: 'applyAllFixes' });
        }

        function openFile(file, line) {
            vscode.postMessage({ type: 'openFile', file, line });
        }

        function updateUI(data, state) {
            const content = document.getElementById('content');
            
            if (state === 'loading') {
                content.innerHTML = '<div class="loading">Running quality gates...</div>';
                return;
            }
            
            if (state === 'error') {
                content.innerHTML = '<div class="error">Quality validation failed</div>';
                return;
            }
            
            if (!data) {
                content.innerHTML = \`
                    <div class="empty">
                        <p>Click "Run Quality Gates" to validate your changes</p>
                        <button class="run-button" onclick="runQualityGates()">Run Quality Gates</button>
                    </div>
                \`;
                return;
            }
            
            currentData = data;
            
            const gateEntries = Object.entries(data.gates);
            const allIssues = gateEntries.flatMap(([name, gate]) => 
                gate.issues.map(issue => ({ ...issue, gateName: name }))
            );
            
            const automatableFixes = data.suggestions.filter(s => s.automatable && s.confidence > 0.7);
            
            content.innerHTML = \`
                <div class="header">
                    <div class="score \${data.passed ? 'passed' : 'failed'}">
                        \${data.passed ? '✅' : '❌'} \${data.score}/100
                    </div>
                    <button class="run-button" onclick="runQualityGates()">Refresh</button>
                </div>
                
                <div class="gates">
                    \${gateEntries.map(([name, gate]) => \`
                        <div class="gate \${gate.passed ? 'passed' : 'failed'}">
                            <span class="gate-name">\${name}</span>
                            <span class="gate-score">\${gate.score}/100</span>
                        </div>
                    \`).join('')}
                </div>
                
                \${allIssues.length > 0 ? \`
                    <div class="issues">
                        <h3>Issues (\${allIssues.length})</h3>
                        \${allIssues.map(issue => \`
                            <div class="issue \${issue.type}" onclick="openFile('\${issue.file}', \${issue.line})">
                                <div class="issue-header">
                                    <span class="issue-file">\${issue.file}:\${issue.line || '?'}</span>
                                    <span class="issue-severity">\${issue.severity}</span>
                                </div>
                                <div>\${issue.message}</div>
                            </div>
                        \`).join('')}
                    </div>
                \` : ''}
                
                \${data.suggestions.length > 0 ? \`
                    <div class="suggestions">
                        <h3>Fix Suggestions (\${data.suggestions.length})</h3>
                        \${data.suggestions.map(suggestion => \`
                            <div class="suggestion">
                                <div>
                                    <div>\${suggestion.description}</div>
                                    <div class="confidence">Confidence: \${Math.round(suggestion.confidence * 100)}%</div>
                                </div>
                                <button 
                                    class="fix-button" 
                                    onclick="applyFix('\${suggestion.id}')"
                                    \${!suggestion.automatable || suggestion.confidence < 0.7 ? 'disabled' : ''}
                                >
                                    \${suggestion.automatable ? 'Fix' : 'Manual'}
                                </button>
                            </div>
                        \`).join('')}
                    </div>
                    
                    <div class="actions">
                        <button 
                            class="apply-all-button" 
                            onclick="applyAllFixes()"
                            \${automatableFixes.length === 0 ? 'disabled' : ''}
                        >
                            Apply All (\${automatableFixes.length})
                        </button>
                    </div>
                \` : ''}
            \`;
        }
        
        // Listen for messages from extension
        window.addEventListener('message', event => {
            const message = event.data;
            switch (message.type) {
                case 'update':
                    updateUI(message.data, message.state);
                    break;
            }
        });
    </script>
</body>
</html>`;
    }
}
exports.QualityGateProvider = QualityGateProvider;
QualityGateProvider.viewType = 'claude-quality-gate';
//# sourceMappingURL=qualityGateProvider.js.map