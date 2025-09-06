import * as vscode from 'vscode';
export interface DiffPreviewData {
    id: string;
    fileName: string;
    originalContent: string;
    diffContent: string;
    timestamp: number;
    aiAgent: 'claude' | 'gpt4' | 'gemini';
    description: string;
    status: 'pending' | 'applied' | 'rejected';
}
export declare class DiffPreviewProvider implements vscode.WebviewViewProvider {
    private readonly _extensionUri;
    static readonly viewType = "claude-coordination-diff-preview";
    private _view?;
    private _socket?;
    private _pendingDiffs;
    constructor(_extensionUri: vscode.Uri);
    private initializeWebSocket;
    resolveWebviewView(webviewView: vscode.WebviewView, context: vscode.WebviewViewResolveContext, _token: vscode.CancellationToken): void;
    private applyDiff;
    private rejectDiff;
    private previewDiff;
    private generateDiffView;
    private generateUnifiedDiff;
    private refreshWebview;
    private _getHtmlForWebview;
    private escapeHtml;
    addDiff(diffData: DiffPreviewData): void;
    dispose(): void;
}
