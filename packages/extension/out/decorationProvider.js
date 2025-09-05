"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CoordinationDecorationProvider = void 0;
const vscode = require("vscode");
const child_process_1 = require("child_process");
class CoordinationDecorationProvider {
    constructor() {
        this._onDidChangeFileDecorations = new vscode.EventEmitter();
        this.onDidChangeFileDecorations = this._onDidChangeFileDecorations.event;
        this.lockedFiles = new Set();
        this.myLockedFiles = new Set();
        this.loadLockedFiles();
    }
    refresh() {
        this.loadLockedFiles();
        this._onDidChangeFileDecorations.fire(undefined);
    }
    provideFileDecoration(uri) {
        const workspaceFolder = vscode.workspace.getWorkspaceFolder(uri);
        if (!workspaceFolder) {
            return undefined;
        }
        const relativePath = vscode.workspace.asRelativePath(uri, false);
        if (this.myLockedFiles.has(relativePath)) {
            // File locked by current session (you)
            return {
                badge: '🔒',
                color: new vscode.ThemeColor('claude-coordination.activeSession'),
                tooltip: 'File locked by you'
            };
        }
        if (this.lockedFiles.has(relativePath)) {
            // File locked by another session
            return {
                badge: '🔒',
                color: new vscode.ThemeColor('claude-coordination.lockedFile'),
                tooltip: 'File locked by another session'
            };
        }
        return undefined;
    }
    async loadLockedFiles() {
        try {
            const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
            if (!workspaceFolder) {
                return;
            }
            const config = vscode.workspace.getConfiguration('claude-coordination');
            const magicPath = config.get('magicCliPath') || 'magic';
            const command = `${magicPath} coord-status --json`;
            const output = await new Promise((resolve, reject) => {
                (0, child_process_1.exec)(command, {
                    cwd: workspaceFolder.uri.fsPath,
                    timeout: 10000
                }, (error, stdout, stderr) => {
                    if (error) {
                        reject(stderr || error.message);
                        return;
                    }
                    resolve(stdout.trim());
                });
            });
            const status = JSON.parse(output);
            this.lockedFiles.clear();
            this.myLockedFiles.clear();
            for (const lock of status.locks) {
                this.lockedFiles.add(lock.file);
                if (lock.session === status.currentSession) {
                    this.myLockedFiles.add(lock.file);
                }
            }
        }
        catch (error) {
            console.log('Failed to load locked files:', error);
            this.lockedFiles.clear();
            this.myLockedFiles.clear();
        }
    }
}
exports.CoordinationDecorationProvider = CoordinationDecorationProvider;
//# sourceMappingURL=decorationProvider.js.map