import * as vscode from 'vscode';
export interface CoordinationStatus {
    currentSession: string;
    activeSessions: number;
    activeFiles: number;
    pendingMessages: number;
    sessions: Array<{
        id: string;
        description: string;
        lastActivity: string;
        currentTask?: string;
    }>;
    locks: Array<{
        file: string;
        session: string;
        reason: string;
        since: string;
    }>;
    recentMessages: Array<{
        id: string;
        from: string;
        message: string;
        timestamp: string;
    }>;
}
export declare function activate(context: vscode.ExtensionContext): void;
export declare function deactivate(): void;
