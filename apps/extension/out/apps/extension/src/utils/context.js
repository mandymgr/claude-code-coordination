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
exports.captureContext = void 0;
const vscode = __importStar(require("vscode"));
const path = __importStar(require("path"));
async function captureContext() {
    const activeEditor = vscode.window.activeTextEditor;
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
        throw new Error('No workspace folder open');
    }
    const context = {
        repoRoot: workspaceFolder.uri.fsPath,
        workspaceRoot: workspaceFolder.uri.fsPath,
        openFiles: []
    };
    // Add active file information if available
    if (activeEditor) {
        const filePath = activeEditor.document.fileName;
        const relativePath = path.relative(workspaceFolder.uri.fsPath, filePath);
        context.activeFile = relativePath;
        // Add selection if text is selected
        const selection = activeEditor.selection;
        if (!selection.isEmpty) {
            const selectedText = activeEditor.document.getText(selection);
            context.selection = selectedText;
        }
    }
    // Detect project type based on files in workspace
    context.projectType = await detectProjectType(workspaceFolder.uri.fsPath);
    // Add related files (files in same directory as active file)
    if (context.activeFile) {
        context.relatedFiles = await getRelatedFiles(workspaceFolder.uri.fsPath, context.activeFile);
    }
    return context;
}
exports.captureContext = captureContext;
async function detectProjectType(repoRoot) {
    try {
        // Check for package.json to determine if it's a Node.js project
        const packageJsonPath = path.join(repoRoot, 'package.json');
        let packageJsonExists;
        try {
            await vscode.workspace.fs.stat(vscode.Uri.file(packageJsonPath));
            packageJsonExists = true;
        }
        catch {
            packageJsonExists = false;
        }
        if (packageJsonExists) {
            // Read package.json to determine specific type
            const packageJsonContent = await vscode.workspace.fs.readFile(vscode.Uri.file(packageJsonPath));
            const packageJson = JSON.parse(packageJsonContent.toString());
            // Check dependencies for React/Next.js
            const deps = {
                ...packageJson.dependencies,
                ...packageJson.devDependencies
            };
            if (deps.next || deps.react) {
                return 'react';
            }
            return 'node';
        }
        // Check for Python files
        const pythonFiles = await vscode.workspace.findFiles('**/*.py', null, 1);
        if (pythonFiles.length > 0) {
            return 'python';
        }
        return 'other';
    }
    catch (error) {
        console.warn('Failed to detect project type:', error);
        return 'other';
    }
}
async function getRelatedFiles(repoRoot, activeFile) {
    try {
        const activeDir = path.dirname(activeFile);
        const pattern = `${activeDir}/**/*`;
        const files = await vscode.workspace.findFiles(pattern, null, 10);
        return files
            .map(file => path.relative(repoRoot, file.fsPath))
            .filter(file => file !== activeFile) // Exclude the active file itself
            .slice(0, 5); // Limit to 5 related files
    }
    catch (error) {
        console.warn('Failed to get related files:', error);
        return [];
    }
}
//# sourceMappingURL=context.js.map