"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.captureContext = void 0;
const vscode = require("vscode");
const path = require("path");
async function captureContext() {
    const activeEditor = vscode.window.activeTextEditor;
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
        throw new Error('No workspace folder open');
    }
    const context = {
        repoRoot: workspaceFolder.uri.fsPath
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
            context.selection = {
                start: {
                    line: selection.start.line,
                    character: selection.start.character
                },
                end: {
                    line: selection.end.line,
                    character: selection.end.character
                },
                text: selectedText
            };
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
        const packageJsonExists = await vscode.workspace.fs.stat(vscode.Uri.file(packageJsonPath))
            .then(() => true)
            .catch(() => false);
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