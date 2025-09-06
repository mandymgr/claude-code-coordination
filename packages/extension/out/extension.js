"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = activate;
exports.deactivate = deactivate;
const vscode = require("vscode");

function activate(context) {
    console.log('🚀 Claude Code Coordination extension is now active!');
    
    // Register basic command
    const disposable = vscode.commands.registerCommand('claude-coordination.coordinate', () => {
        vscode.window.showInformationMessage('Claude Code Coordination v3.0.0 - Ready for Enterprise AI Development!');
    });
    
    context.subscriptions.push(disposable);
}

function deactivate() {
    console.log('👋 Claude Code Coordination extension deactivated');
}