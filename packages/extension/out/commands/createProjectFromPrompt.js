"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createProjectFromPrompt = createProjectFromPrompt;
const vscode = require("vscode");
const path = require("path");
const api_js_1 = require("../utils/api.js");
async function createProjectFromPrompt() {
    // Get available templates
    let templates;
    try {
        const templatesResponse = await (0, api_js_1.callServer)('/api/projects/templates', {});
        templates = templatesResponse.templates || [];
    }
    catch (error) {
        vscode.window.showErrorMessage(`Failed to load templates: ${error}`);
        return;
    }
    if (templates.length === 0) {
        vscode.window.showWarningMessage('No project templates available');
        return;
    }
    // Select template
    const templateItems = templates.map(t => ({
        label: t.name,
        description: t.description,
        detail: t.techStack.join(', '),
        template: t
    }));
    const selectedTemplate = await vscode.window.showQuickPick(templateItems, {
        placeHolder: 'Select a project template'
    });
    if (!selectedTemplate)
        return;
    // Get project description/customization prompt
    const prompt = await vscode.window.showInputBox({
        prompt: 'Describe how you want to customize this project',
        placeHolder: 'Add user authentication and dark mode support',
        value: ''
    });
    if (prompt === undefined)
        return;
    // Get target directory
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
        vscode.window.showErrorMessage('Please open a workspace first');
        return;
    }
    const projectName = await vscode.window.showInputBox({
        prompt: 'Enter project name',
        placeHolder: 'my-awesome-project',
        validateInput: (value) => {
            if (!value || value.trim().length === 0) {
                return 'Project name is required';
            }
            if (!/^[a-zA-Z0-9-_]+$/.test(value)) {
                return 'Project name can only contain letters, numbers, hyphens, and underscores';
            }
            return null;
        }
    });
    if (!projectName)
        return;
    const targetDir = path.join(workspaceFolder.uri.fsPath, projectName);
    try {
        vscode.window.showInformationMessage('🚀 Creating project from template...');
        const result = await (0, api_js_1.callServer)('/api/projects/from-prompt', {
            prompt: prompt || '',
            template: selectedTemplate.template.id,
            targetDir,
            variables: {
                projectName: projectName,
                description: prompt || `${selectedTemplate.template.name} project`
            }
        });
        if (result.success) {
            vscode.window.showInformationMessage(`✅ Project created! ${result.filesCreated.length} files created, ${result.filesModified.length} files customized by AI.`);
            // Ask if user wants to open the new project
            const openProject = await vscode.window.showInformationMessage('Open the new project?', 'Open in New Window', 'Open in Current Window');
            if (openProject) {
                const uri = vscode.Uri.file(targetDir);
                if (openProject === 'Open in New Window') {
                    await vscode.commands.executeCommand('vscode.openFolder', uri, true);
                }
                else {
                    await vscode.commands.executeCommand('vscode.openFolder', uri, false);
                }
            }
        }
        else {
            vscode.window.showErrorMessage(`❌ Failed to create project: ${result.error}`);
        }
    }
    catch (error) {
        vscode.window.showErrorMessage(`❌ Failed to create project: ${error}`);
    }
}
//# sourceMappingURL=createProjectFromPrompt.js.map