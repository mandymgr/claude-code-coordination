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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignTask = void 0;
const vscode = __importStar(require("vscode"));
const api_js_1 = require("../utils/api.js");
const context_js_1 = require("../utils/context.js");
// Import paths updated for new structure - use relative imports for better compatibility
// import { ContextAwareAI } from '../../../packages/ai-core/src/context-aware-ai';
// import { MagicCLI } from '../../../packages/ai-core/src/magic-cli';
const path_1 = __importDefault(require("path"));
async function assignTask() {
    const task = await vscode.window.showInputBox({
        prompt: 'Task for AI team…',
        placeHolder: 'Add dark mode toggle to the settings page'
    });
    if (!task)
        return;
    try {
        vscode.window.showInformationMessage('🤖 Processing task with AI team...');
        const context = await (0, context_js_1.captureContext)();
        // Check for ADR context in workspace
        const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
        let adrPath;
        if (workspaceRoot) {
            // Look for ADRs in common locations
            const possiblePaths = [
                path_1.default.join(workspaceRoot, 'docs/adr'),
                path_1.default.join(workspaceRoot, '../Krins-Dev-Memory-OS/docs/adr'),
                path_1.default.join(path_1.default.dirname(workspaceRoot), 'Krins-Dev-Memory-OS/docs/adr')
            ];
            for (const possiblePath of possiblePaths) {
                try {
                    const fs = require('fs');
                    if (fs.existsSync(possiblePath)) {
                        adrPath = possiblePath;
                        break;
                    }
                }
                catch (e) {
                    // Continue checking other paths
                }
            }
        }
        // Use context-aware AI if ADRs are found
        if (adrPath) {
            vscode.window.showInformationMessage('📋 Found ADRs - using architectural context...');
            // Show ADR context available in output channel
            const outputChannel = vscode.window.createOutputChannel('Claude Code - ADR Context');
            outputChannel.clear();
            outputChannel.appendLine(`📋 ADR Context available for task: "${task}"`);
            outputChannel.appendLine('─'.repeat(50));
            outputChannel.appendLine(`ADR Path: ${adrPath}`);
            outputChannel.appendLine('Context will be used for intelligent code generation.');
            outputChannel.show();
        }
        // Use KRIN MCP Server for intelligent task assignment
        try {
            // Create coordination session
            vscode.window.showInformationMessage('🎯 KRIN: Creating AI coordination session...');
            const result = await (0, api_js_1.callServer)('/api/coordination/assign', {
                task,
                context: {
                    ...context,
                    adrPath,
                    adrContext: adrPath ? 'ADR context available' : 'No ADR context found'
                },
                agents: ['claude', 'gpt4', 'gemini'],
                priority: 'medium',
                autoFix: true // Enable quality gates with auto-fix
            });
            if (result.success) {
                // Open diff preview
                const doc = await vscode.workspace.openTextDocument({
                    content: result.diffText,
                    language: 'diff'
                });
                await vscode.window.showTextDocument(doc, {
                    viewColumn: vscode.ViewColumn.Beside,
                    preview: true
                });
                // Show KRIN assignment details
                const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
                statusBarItem.text = `🤖 ${result.assignedAgent} • ${result.estimatedTime}`;
                statusBarItem.tooltip = `KRIN assigned to ${result.assignedAgent}: ${result.reasoning}`;
                statusBarItem.show();
                // Auto-hide status after 10 seconds
                setTimeout(() => statusBarItem.dispose(), 10000);
                vscode.window.showInformationMessage(`✅ KRIN: Task assigned to ${result.assignedAgent}! ${result.qualityPassed ? '🛡️ Quality gates passed' : '⚠️ Quality issues found'}`);
                // Show quality gate results if available
                if (result.qualityResults) {
                    const qualityChannel = vscode.window.createOutputChannel('KRIN - Quality Gates');
                    qualityChannel.clear();
                    qualityChannel.appendLine(`🛡️ Quality Gate Results for: "${task}"`);
                    qualityChannel.appendLine('─'.repeat(50));
                    result.qualityResults.checks.forEach((check) => {
                        const status = check.passed ? '✅' : '❌';
                        qualityChannel.appendLine(`${status} ${check.name}: ${check.message}`);
                        if (check.fixedIssues > 0) {
                            qualityChannel.appendLine(`   🔧 Auto-fixed ${check.fixedIssues} issues`);
                        }
                    });
                    qualityChannel.show();
                }
            }
            else {
                vscode.window.showErrorMessage(`❌ KRIN task assignment failed: ${result.error || 'Unknown error'}`);
            }
        }
        catch (mcpError) {
            // Fallback to regular task assignment
            console.warn('MCP Server unavailable, falling back to regular assignment:', mcpError);
            const result = await (0, api_js_1.callServer)('/api/tasks', {
                task,
                context: {
                    ...context,
                    adrPath,
                    adrContext: adrPath ? 'ADR context available' : 'No ADR context found'
                }
            });
            if (result.success) {
                // Open diff preview
                const doc = await vscode.workspace.openTextDocument({
                    content: result.diffText,
                    language: 'diff'
                });
                await vscode.window.showTextDocument(doc, {
                    viewColumn: vscode.ViewColumn.Beside,
                    preview: true
                });
                vscode.window.showInformationMessage(`✅ Task completed! Generated diff with ${result.tokens} tokens in ${result.duration}ms`);
            }
            else {
                vscode.window.showErrorMessage(`❌ Task failed: ${result.error || 'Unknown error'}`);
            }
        }
    }
    catch (error) {
        vscode.window.showErrorMessage(`❌ Task failed: ${error}`);
    }
}
exports.assignTask = assignTask;
//# sourceMappingURL=assignTask.js.map