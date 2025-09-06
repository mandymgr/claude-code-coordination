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
exports.CoordinationStatusProvider = void 0;
const vscode = __importStar(require("vscode"));
const child_process_1 = require("child_process");
class CoordinationStatusProvider {
    constructor() {
        this._onDidChangeTreeData = new vscode.EventEmitter();
        this.onDidChangeTreeData = this._onDidChangeTreeData.event;
        this.status = null;
        this.loadStatus();
    }
    refresh() {
        this.loadStatus();
        this._onDidChangeTreeData.fire();
    }
    getTreeItem(element) {
        return element;
    }
    getChildren(element) {
        if (!element) {
            // Root level items
            return Promise.resolve(this.getRootItems());
        }
        else {
            // Child items
            return Promise.resolve(this.getChildItems(element));
        }
    }
    getRootItems() {
        if (!this.status) {
            return [new CoordinationItem('No coordination data', '', vscode.TreeItemCollapsibleState.None, 'info')];
        }
        const items = [];
        // Current session info
        items.push(new CoordinationItem(`Current Session: ${this.status.currentSession}`, `Active since startup`, vscode.TreeItemCollapsibleState.None, 'session', {
            command: 'claude-coordination.status',
            title: 'Show Full Status'
        }));
        // Sessions section
        if (this.status.sessions.length > 0) {
            items.push(new CoordinationItem(`Sessions (${this.status.activeSessions})`, `${this.status.activeSessions} active sessions`, vscode.TreeItemCollapsibleState.Expanded, 'sessions'));
        }
        // Locks section
        if (this.status.locks.length > 0) {
            items.push(new CoordinationItem(`Locked Files (${this.status.activeFiles})`, `${this.status.activeFiles} files currently locked`, vscode.TreeItemCollapsibleState.Expanded, 'locks'));
        }
        // Messages section
        if (this.status.recentMessages.length > 0) {
            items.push(new CoordinationItem(`Messages (${this.status.pendingMessages})`, `${this.status.pendingMessages} recent messages`, vscode.TreeItemCollapsibleState.Collapsed, 'messages'));
        }
        // Quick actions
        items.push(new CoordinationItem('Quick Actions', 'Common coordination commands', vscode.TreeItemCollapsibleState.Expanded, 'actions'));
        return items;
    }
    getChildItems(element) {
        if (!this.status) {
            return [];
        }
        switch (element.contextValue) {
            case 'sessions':
                return this.status.sessions.map(session => new CoordinationItem(session.id, session.description, vscode.TreeItemCollapsibleState.None, 'session-item'));
            case 'locks':
                return this.status.locks.map(lock => new CoordinationItem(lock.file, `${lock.reason} (by ${lock.session})`, vscode.TreeItemCollapsibleState.None, 'lock-item', {
                    command: 'claude-coordination.unlockFile',
                    title: 'Unlock File',
                    arguments: [lock.file]
                }));
            case 'messages':
                return this.status.recentMessages.slice(0, 5).map(msg => new CoordinationItem(`From ${msg.from}`, msg.message, vscode.TreeItemCollapsibleState.None, 'message-item'));
            case 'actions':
                return [
                    new CoordinationItem('Lock Current File', 'Lock the active editor file', vscode.TreeItemCollapsibleState.None, 'action', {
                        command: 'claude-coordination.lockFile',
                        title: 'Lock Current File'
                    }),
                    new CoordinationItem('Send Message', 'Send message to team', vscode.TreeItemCollapsibleState.None, 'action', {
                        command: 'claude-coordination.sendMessage',
                        title: 'Send Message'
                    }),
                    new CoordinationItem('AI Assistant', 'Ask AI about your code', vscode.TreeItemCollapsibleState.None, 'action', {
                        command: 'claude-coordination.aiAssist',
                        title: 'AI Assistant'
                    }),
                    new CoordinationItem('Open Dashboard', 'Open web dashboard', vscode.TreeItemCollapsibleState.None, 'action', {
                        command: 'claude-coordination.openDashboard',
                        title: 'Open Dashboard'
                    }),
                    new CoordinationItem('Refresh', 'Refresh coordination status', vscode.TreeItemCollapsibleState.None, 'action', {
                        command: 'claude-coordination.refresh',
                        title: 'Refresh'
                    })
                ];
            default:
                return [];
        }
    }
    async loadStatus() {
        try {
            const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
            if (!workspaceFolder) {
                this.status = null;
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
            this.status = JSON.parse(output);
        }
        catch (error) {
            console.log('Failed to load coordination status:', error);
            this.status = null;
        }
    }
}
exports.CoordinationStatusProvider = CoordinationStatusProvider;
class CoordinationItem extends vscode.TreeItem {
    constructor(label, tooltip, collapsibleState, contextValue, command) {
        super(label, collapsibleState);
        this.label = label;
        this.tooltip = tooltip;
        this.collapsibleState = collapsibleState;
        this.contextValue = contextValue;
        this.command = command;
        this.tooltip = tooltip;
        this.contextValue = contextValue;
        // Set icons based on context
        switch (contextValue) {
            case 'session':
            case 'session-item':
                this.iconPath = new vscode.ThemeIcon('sync');
                break;
            case 'sessions':
                this.iconPath = new vscode.ThemeIcon('people');
                break;
            case 'lock-item':
                this.iconPath = new vscode.ThemeIcon('lock');
                break;
            case 'locks':
                this.iconPath = new vscode.ThemeIcon('file-binary');
                break;
            case 'message-item':
                this.iconPath = new vscode.ThemeIcon('mail-read');
                break;
            case 'messages':
                this.iconPath = new vscode.ThemeIcon('mail');
                break;
            case 'actions':
                this.iconPath = new vscode.ThemeIcon('tools');
                break;
            case 'action':
                this.iconPath = new vscode.ThemeIcon('play');
                break;
            default:
                this.iconPath = new vscode.ThemeIcon('info');
        }
    }
}
//# sourceMappingURL=statusProvider.js.map