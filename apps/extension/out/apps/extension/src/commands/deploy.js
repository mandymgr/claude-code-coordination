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
exports.deploy = void 0;
const vscode = __importStar(require("vscode"));
const api_js_1 = require("../utils/api.js");
async function deploy() {
    const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
    if (!workspaceFolder) {
        vscode.window.showErrorMessage('Please open a workspace first');
        return;
    }
    // Select deployment target
    const targets = [
        { label: 'Vercel', description: 'Deploy to Vercel', target: 'vercel' },
        { label: 'Netlify', description: 'Deploy to Netlify', target: 'netlify' }
    ];
    const selectedTarget = await vscode.window.showQuickPick(targets, {
        placeHolder: 'Select deployment target'
    });
    if (!selectedTarget)
        return;
    // Confirm production deployment
    const confirm = await vscode.window.showWarningMessage(`Deploy to ${selectedTarget.label} production?`, { modal: true }, 'Deploy', 'Cancel');
    if (confirm !== 'Deploy')
        return;
    try {
        vscode.window.showInformationMessage(`🚀 Deploying to ${selectedTarget.label}...`);
        const result = await (0, api_js_1.callServer)('/api/deploy', {
            target: selectedTarget.target,
            projectPath: workspaceFolder.uri.fsPath
        });
        if (result.success) {
            const openUrl = await vscode.window.showInformationMessage(`✅ Deployed successfully to ${selectedTarget.label}!`, 'Open URL', 'Copy URL');
            if (result.url) {
                if (openUrl === 'Open URL') {
                    vscode.env.openExternal(vscode.Uri.parse(result.url));
                }
                else if (openUrl === 'Copy URL') {
                    vscode.env.clipboard.writeText(result.url);
                    vscode.window.showInformationMessage('URL copied to clipboard!');
                }
            }
        }
        else {
            vscode.window.showErrorMessage(`❌ Deployment failed: ${result.error}`);
        }
    }
    catch (error) {
        vscode.window.showErrorMessage(`❌ Deployment failed: ${error}`);
    }
}
exports.deploy = deploy;
//# sourceMappingURL=deploy.js.map