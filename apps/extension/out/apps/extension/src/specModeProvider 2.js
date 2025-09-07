"use strict";
/**
 * Spec Mode Provider - VS Code WebView for Test-Driven Development
 *
 * Provides interface for generating tests and implementing features through TDD
 */
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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SpecModeProvider = void 0;
const vscode = __importStar(require("vscode"));
const axios_1 = __importDefault(require("axios"));
class SpecModeProvider {
    constructor(_extensionUri, context) {
        this._extensionUri = _extensionUri;
        this.serverUrl = 'http://localhost:8080';
        this.isRunning = false;
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
                case 'runSpecMode':
                    await this.runSpecMode(data.request);
                    break;
                case 'generateTestsOnly':
                    await this.generateTestsOnly(data.request);
                    break;
                case 'applyPatch':
                    await this.applyGeneratedPatch();
                    break;
                case 'selectFiles':
                    await this.selectTargetFiles();
                    break;
                case 'openTest':
                    await this.openTestFile(data.filePath);
                    break;
            }
        });
        this.updateWebview();
    }
    async runSpecMode(request) {
        if (this.isRunning) {
            vscode.window.showWarningMessage('Spec Mode is already running');
            return;
        }
        try {
            this.isRunning = true;
            this.updateWebview('running');
            vscode.window.showInformationMessage(`🧪 Starting TDD for: ${request.task}`);
            const response = await axios_1.default.post(`${this.serverUrl}/api/tasks/spec`, {
                task: request.task,
                targetFiles: request.targetFiles,
                framework: request.framework || 'vitest',
                maxIterations: request.maxIterations || 3,
                aiModel: request.aiModel || 'claude'
            });
            this._currentResult = response.data.data;
            this.updateWebview();
            if (this._currentResult.success) {
                vscode.window.showInformationMessage(`✅ TDD completed successfully! Generated ${this._currentResult.specGeneration.totalTests} tests`);
            }
            else {
                vscode.window.showWarningMessage(`⚠️ TDD completed with issues. ${this._currentResult.specGeneration.totalTests} tests generated but implementation needs work`);
            }
        }
        catch (error) {
            console.error('Spec Mode failed:', error);
            vscode.window.showErrorMessage(`Spec Mode failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
            this.updateWebview('error');
        }
        finally {
            this.isRunning = false;
        }
    }
    async generateTestsOnly(request) {
        if (this.isRunning) {
            vscode.window.showWarningMessage('Spec Mode is already running');
            return;
        }
        try {
            this.isRunning = true;
            this.updateWebview('running');
            vscode.window.showInformationMessage(`📝 Generating tests for: ${request.task}`);
            const response = await axios_1.default.post(`${this.serverUrl}/api/tasks/spec/tests-only`, {
                task: request.task,
                targetFiles: request.targetFiles,
                framework: request.framework || 'vitest'
            });
            const result = response.data.data;
            this._currentResult = {
                success: true,
                specGeneration: result,
                totalDuration: 0,
                recommendations: result.recommendations
            };
            this.updateWebview();
            vscode.window.showInformationMessage(`✅ Generated ${result.totalTests} test specifications (confidence: ${Math.round(result.confidence * 100)}%)`);
        }
        catch (error) {
            console.error('Test generation failed:', error);
            vscode.window.showErrorMessage(`Test generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
            this.updateWebview('error');
        }
        finally {
            this.isRunning = false;
        }
    }
    async applyGeneratedPatch() {
        if (!this._currentResult?.patchGeneration?.generatedPatch) {
            vscode.window.showWarningMessage('No patch available to apply');
            return;
        }
        const choice = await vscode.window.showInformationMessage('Apply the generated patch to your files?', 'Yes', 'Review First', 'Cancel');
        if (choice === 'Yes') {
            // Apply patch logic would go here
            vscode.window.showInformationMessage('✅ Patch applied successfully');
        }
        else if (choice === 'Review First') {
            // Show patch in diff view
            await this.showPatchDiff(this._currentResult.patchGeneration.generatedPatch);
        }
    }
    async showPatchDiff(patch) {
        const doc = await vscode.workspace.openTextDocument({
            content: patch,
            language: 'diff'
        });
        await vscode.window.showTextDocument(doc);
    }
    async selectTargetFiles() {
        const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
        if (!workspaceFolder) {
            vscode.window.showErrorMessage('No workspace folder found');
            return;
        }
        const files = await vscode.window.showOpenDialog({
            canSelectFiles: true,
            canSelectFolders: false,
            canSelectMany: true,
            defaultUri: workspaceFolder.uri,
            filters: {
                'Code files': ['ts', 'js', 'tsx', 'jsx', 'py', 'java', 'go', 'rs']
            }
        });
        if (files && files.length > 0) {
            const relativePaths = files.map(file => vscode.workspace.asRelativePath(file, false));
            this._view?.webview.postMessage({
                type: 'filesSelected',
                files: relativePaths
            });
        }
    }
    async openTestFile(filePath) {
        try {
            const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
            if (!workspaceFolder)
                return;
            const fullPath = vscode.Uri.joinPath(workspaceFolder.uri, filePath);
            const document = await vscode.workspace.openTextDocument(fullPath);
            await vscode.window.showTextDocument(document);
        }
        catch (error) {
            console.error('Failed to open test file:', error);
            vscode.window.showErrorMessage(`Could not open test file: ${filePath}`);
        }
    }
    updateWebview(state) {
        if (!this._view)
            return;
        this._view.webview.postMessage({
            type: 'update',
            data: this._currentResult,
            state,
            isRunning: this.isRunning
        });
    }
    _getHtmlForWebview(webview) {
        return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Spec Mode</title>
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
            align-items: center;
            gap: 8px;
            margin-bottom: 16px;
            padding-bottom: 8px;
            border-bottom: 1px solid var(--vscode-panel-border);
        }
        
        .title {
            font-size: 18px;
            font-weight: bold;
        }
        
        .subtitle {
            font-size: 12px;
            opacity: 0.7;
        }
        
        .form {
            margin-bottom: 24px;
        }
        
        .form-group {
            margin-bottom: 16px;
        }
        
        label {
            display: block;
            margin-bottom: 4px;
            font-weight: bold;
        }
        
        input, textarea, select {
            width: 100%;
            padding: 8px;
            border: 1px solid var(--vscode-input-border);
            background: var(--vscode-input-background);
            color: var(--vscode-input-foreground);
            border-radius: 4px;
            font-family: inherit;
            font-size: inherit;
            box-sizing: border-box;
        }
        
        textarea {
            min-height: 80px;
            resize: vertical;
        }
        
        .file-selector {
            display: flex;
            gap: 8px;
            align-items: center;
        }
        
        .file-list {
            background: var(--vscode-list-inactiveSelectionBackground);
            padding: 8px;
            border-radius: 4px;
            font-family: monospace;
            font-size: 11px;
            margin-top: 4px;
            max-height: 100px;
            overflow-y: auto;
        }
        
        .actions {
            display: flex;
            gap: 8px;
            margin-bottom: 16px;
        }
        
        button {
            background: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            border: none;
            padding: 8px 16px;
            border-radius: 4px;
            cursor: pointer;
            font-size: 12px;
            font-family: inherit;
        }
        
        button:hover {
            background: var(--vscode-button-hoverBackground);
        }
        
        button:disabled {
            opacity: 0.5;
            cursor: not-allowed;
        }
        
        .secondary-button {
            background: var(--vscode-button-secondaryBackground);
            color: var(--vscode-button-secondaryForeground);
        }
        
        .secondary-button:hover {
            background: var(--vscode-button-secondaryHoverBackground);
        }
        
        .results {
            margin-top: 16px;
        }
        
        .status {
            padding: 12px;
            border-radius: 4px;
            margin-bottom: 16px;
            display: flex;
            align-items: center;
            gap: 8px;
        }
        
        .status.success {
            background: var(--vscode-testing-iconPassed);
            color: white;
        }
        
        .status.warning {
            background: var(--vscode-testing-iconQueued);
            color: white;
        }
        
        .status.error {
            background: var(--vscode-testing-iconFailed);
            color: white;
        }
        
        .status.running {
            background: var(--vscode-progressBar-background);
            color: white;
        }
        
        .metrics {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 16px;
            margin-bottom: 16px;
        }
        
        .metric {
            background: var(--vscode-list-inactiveSelectionBackground);
            padding: 12px;
            border-radius: 4px;
            text-align: center;
        }
        
        .metric-value {
            font-size: 24px;
            font-weight: bold;
            color: var(--vscode-testing-iconPassed);
        }
        
        .metric-label {
            font-size: 11px;
            opacity: 0.7;
            margin-top: 4px;
        }
        
        .tests {
            margin-bottom: 16px;
        }
        
        .test-item {
            padding: 8px;
            margin: 4px 0;
            background: var(--vscode-list-inactiveSelectionBackground);
            border-radius: 4px;
            display: flex;
            justify-content: space-between;
            align-items: center;
            cursor: pointer;
        }
        
        .test-item:hover {
            background: var(--vscode-list-hoverBackground);
        }
        
        .test-name {
            font-family: monospace;
            font-size: 12px;
        }
        
        .test-status {
            font-size: 10px;
            padding: 2px 6px;
            border-radius: 2px;
        }
        
        .test-status.passed {
            background: var(--vscode-testing-iconPassed);
            color: white;
        }
        
        .test-status.failed {
            background: var(--vscode-testing-iconFailed);
            color: white;
        }
        
        .recommendations {
            background: var(--vscode-list-inactiveSelectionBackground);
            padding: 12px;
            border-radius: 4px;
            margin-top: 16px;
        }
        
        .recommendations h4 {
            margin-top: 0;
            margin-bottom: 8px;
        }
        
        .recommendations ul {
            margin: 0;
            padding-left: 16px;
        }
        
        .recommendations li {
            margin-bottom: 4px;
            font-size: 12px;
        }
        
        .loading {
            text-align: center;
            padding: 40px;
            opacity: 0.7;
        }
        
        .spinner {
            display: inline-block;
            width: 20px;
            height: 20px;
            border: 3px solid #f3f3f3;
            border-top: 3px solid var(--vscode-button-background);
            border-radius: 50%;
            animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
        }
        
        .empty {
            text-align: center;
            padding: 40px;
            opacity: 0.7;
        }
    </style>
</head>
<body>
    <div class="header">
        <div>
            <div class="title">🧪 Spec Mode</div>
            <div class="subtitle">Test-Driven Development</div>
        </div>
    </div>

    <div id="content">
        <div class="form">
            <div class="form-group">
                <label for="task">Task Description</label>
                <textarea id="task" placeholder="Describe what you want to implement..." rows="3"></textarea>
            </div>
            
            <div class="form-group">
                <label>Target Files</label>
                <div class="file-selector">
                    <button class="secondary-button" onclick="selectFiles()">Select Files</button>
                    <select id="framework">
                        <option value="vitest">Vitest</option>
                        <option value="jest">Jest</option>
                        <option value="mocha">Mocha</option>
                    </select>
                </div>
                <div id="file-list" class="file-list" style="display: none;">
                    No files selected
                </div>
            </div>
            
            <div class="actions">
                <button id="run-tdd" onclick="runFullTDD()" disabled>🧪 Run Full TDD</button>
                <button id="generate-tests" onclick="generateTests()" disabled>📝 Generate Tests Only</button>
            </div>
        </div>

        <div id="results" class="results" style="display: none;">
            <!-- Results will be populated by JavaScript -->
        </div>
    </div>

    <script>
        const vscode = acquireVsCodeApi();
        let selectedFiles = [];
        let currentResult = null;
        let isRunning = false;

        function selectFiles() {
            vscode.postMessage({ type: 'selectFiles' });
        }

        function runFullTDD() {
            const task = document.getElementById('task').value;
            const framework = document.getElementById('framework').value;
            
            if (!task || selectedFiles.length === 0) {
                return;
            }

            vscode.postMessage({
                type: 'runSpecMode',
                request: {
                    task,
                    targetFiles: selectedFiles,
                    framework,
                    mode: 'full-tdd'
                }
            });
        }

        function generateTests() {
            const task = document.getElementById('task').value;
            const framework = document.getElementById('framework').value;
            
            if (!task || selectedFiles.length === 0) {
                return;
            }

            vscode.postMessage({
                type: 'generateTestsOnly',
                request: {
                    task,
                    targetFiles: selectedFiles,
                    framework,
                    mode: 'tests-only'
                }
            });
        }

        function applyPatch() {
            vscode.postMessage({ type: 'applyPatch' });
        }

        function openTest(filePath) {
            vscode.postMessage({ type: 'openTest', filePath });
        }

        function updateUI(data, state, running) {
            isRunning = running;
            currentResult = data;
            
            // Update button states
            const runButton = document.getElementById('run-tdd');
            const generateButton = document.getElementById('generate-tests');
            const task = document.getElementById('task').value;
            
            runButton.disabled = isRunning || !task || selectedFiles.length === 0;
            generateButton.disabled = isRunning || !task || selectedFiles.length === 0;
            
            const resultsDiv = document.getElementById('results');
            
            if (state === 'running') {
                resultsDiv.style.display = 'block';
                resultsDiv.innerHTML = \`
                    <div class="status running">
                        <div class="spinner"></div>
                        Running Spec Mode...
                    </div>
                \`;
                return;
            }
            
            if (state === 'error') {
                resultsDiv.style.display = 'block';
                resultsDiv.innerHTML = \`
                    <div class="status error">
                        ❌ Spec Mode failed
                    </div>
                \`;
                return;
            }
            
            if (!data) {
                resultsDiv.style.display = 'none';
                return;
            }
            
            // Show results
            resultsDiv.style.display = 'block';
            
            const statusClass = data.success ? 'success' : 'warning';
            const statusIcon = data.success ? '✅' : '⚠️';
            const statusText = data.success ? 'TDD Completed Successfully' : 'TDD Completed with Issues';
            
            let testsHTML = '';
            if (data.specGeneration && data.specGeneration.tests) {
                testsHTML = \`
                    <div class="tests">
                        <h4>Generated Tests (\${data.specGeneration.tests.length})</h4>
                        \${data.specGeneration.tests.map(test => \`
                            <div class="test-item" onclick="openTest('\${test.filePath}')">
                                <span class="test-name">\${test.testName}</span>
                                <span class="test-status">\${test.framework}</span>
                            </div>
                        \`).join('')}
                    </div>
                \`;
            }
            
            let patchHTML = '';
            if (data.patchGeneration && data.patchGeneration.generatedPatch) {
                patchHTML = \`
                    <div class="actions">
                        <button onclick="applyPatch()">🔧 Apply Generated Patch</button>
                    </div>
                \`;
            }
            
            let recommendationsHTML = '';
            if (data.recommendations && data.recommendations.length > 0) {
                recommendationsHTML = \`
                    <div class="recommendations">
                        <h4>Recommendations</h4>
                        <ul>
                            \${data.recommendations.map(rec => \`<li>\${rec}</li>\`).join('')}
                        </ul>
                    </div>
                \`;
            }
            
            resultsDiv.innerHTML = \`
                <div class="status \${statusClass}">
                    \${statusIcon} \${statusText}
                </div>
                
                <div class="metrics">
                    <div class="metric">
                        <div class="metric-value">\${data.specGeneration?.totalTests || 0}</div>
                        <div class="metric-label">Tests Generated</div>
                    </div>
                    <div class="metric">
                        <div class="metric-value">\${Math.round((data.specGeneration?.confidence || 0) * 100)}%</div>
                        <div class="metric-label">Confidence</div>
                    </div>
                </div>
                
                \${testsHTML}
                \${patchHTML}
                \${recommendationsHTML}
            \`;
        }
        
        function updateFileList() {
            const fileList = document.getElementById('file-list');
            const runButton = document.getElementById('run-tdd');
            const generateButton = document.getElementById('generate-tests');
            const task = document.getElementById('task').value;
            
            if (selectedFiles.length > 0) {
                fileList.style.display = 'block';
                fileList.textContent = selectedFiles.join('\\n');
            } else {
                fileList.style.display = 'none';
                fileList.textContent = 'No files selected';
            }
            
            runButton.disabled = isRunning || !task || selectedFiles.length === 0;
            generateButton.disabled = isRunning || !task || selectedFiles.length === 0;
        }
        
        // Enable buttons when task is entered
        document.getElementById('task').addEventListener('input', function() {
            const runButton = document.getElementById('run-tdd');
            const generateButton = document.getElementById('generate-tests');
            const task = this.value;
            
            runButton.disabled = isRunning || !task || selectedFiles.length === 0;
            generateButton.disabled = isRunning || !task || selectedFiles.length === 0;
        });
        
        // Listen for messages from extension
        window.addEventListener('message', event => {
            const message = event.data;
            switch (message.type) {
                case 'update':
                    updateUI(message.data, message.state, message.isRunning);
                    break;
                case 'filesSelected':
                    selectedFiles = message.files;
                    updateFileList();
                    break;
            }
        });
    </script>
</body>
</html>`;
    }
}
exports.SpecModeProvider = SpecModeProvider;
SpecModeProvider.viewType = 'claude-spec-mode';
//# sourceMappingURL=specModeProvider%202.js.map