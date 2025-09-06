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
exports.unlockCurrentFile = exports.lockCurrentFile = exports.toggleFileLock = void 0;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
const api_js_1 = require("../utils/api.js");
async function toggleFileLock() {
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) {
        vscode.window.showWarningMessage('No active file to lock/unlock');
        return;
    }
    const filePath = activeEditor.document.fileName;
    const workspaceFolder = vscode.workspace.getWorkspaceFolder(activeEditor.document.uri);
    if (!workspaceFolder) {
        vscode.window.showWarningMessage('File must be in workspace to coordinate');
        return;
    }
    const relativePath = path.relative(workspaceFolder.uri.fsPath, filePath);
    const fileName = path.basename(filePath);
    try {
        // Check current lock status
        const statusResult = await (0, api_js_1.callServer)('/api/locks/status', {
            path: relativePath
        });
        const isCurrentlyLocked = statusResult.locked;
        if (isCurrentlyLocked) {
            // Unlock file
            const confirm = await vscode.window.showQuickPick(['Yes, unlock it', 'Cancel'], {
                placeHolder: `File "${fileName}" is currently locked. Unlock it?`
            });
            if (confirm === 'Yes, unlock it') {
                await (0, api_js_1.callServer)('/api/locks', {
                    path: relativePath,
                    lock: false,
                    agentId: 'vscode-extension'
                });
                vscode.window.showInformationMessage(`🔓 File unlocked: ${fileName}`);
            }
        }
        else {
            // Lock file
            const reason = await vscode.window.showInputBox({
                prompt: 'Reason for locking file',
                placeHolder: 'Editing component logic...',
                value: `Editing ${fileName}`
            });
            if (reason) {
                await (0, api_js_1.callServer)('/api/locks', {
                    path: relativePath,
                    lock: true,
                    agentId: 'vscode-extension',
                    reason: reason
                });
                vscode.window.showInformationMessage(`🔒 File locked: ${fileName}`);
            }
        }
    }
    catch (error) {
        vscode.window.showErrorMessage(`Failed to toggle file lock: ${error}`);
    }
}
exports.toggleFileLock = toggleFileLock;
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
    if (!reason)
        return;
    try {
        await (0, api_js_1.callServer)('/api/locks', {
            path: relativePath,
            lock: true,
            agentId: 'vscode-extension',
            reason: reason
        });
        vscode.window.showInformationMessage(`🔒 File locked: ${path.basename(filePath)}`);
    }
    catch (error) {
        vscode.window.showErrorMessage(`Failed to lock file: ${error}`);
    }
}
exports.lockCurrentFile = lockCurrentFile;
async function unlockCurrentFile() {
    const activeEditor = vscode.window.activeTextEditor;
    if (!activeEditor) {
        vscode.window.showWarningMessage('No active file to unlock');
        return;
    }
    const filePath = activeEditor.document.fileName;
    const workspaceFolder = vscode.workspace.getWorkspaceFolder(activeEditor.document.uri);
    if (!workspaceFolder)
        return;
    const relativePath = path.relative(workspaceFolder.uri.fsPath, filePath);
    try {
        await (0, api_js_1.callServer)('/api/locks', {
            path: relativePath,
            lock: false,
            agentId: 'vscode-extension'
        });
        vscode.window.showInformationMessage(`🔓 File unlocked: ${path.basename(filePath)}`);
    }
    catch (error) {
        vscode.window.showErrorMessage(`Failed to unlock file: ${error}`);
    }
}
exports.unlockCurrentFile = unlockCurrentFile;
//# sourceMappingURL=toggleFileLock.js.map