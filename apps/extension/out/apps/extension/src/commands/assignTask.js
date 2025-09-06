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
exports.assignTask = void 0;
const vscode = __importStar(require("vscode"));
const api_js_1 = require("../utils/api.js");
const context_js_1 = require("../utils/context.js");
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
        const result = await (0, api_js_1.callServer)('/api/tasks', { task, context });
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
    catch (error) {
        vscode.window.showErrorMessage(`❌ Task failed: ${error}`);
    }
}
exports.assignTask = assignTask;
//# sourceMappingURL=assignTask.js.map