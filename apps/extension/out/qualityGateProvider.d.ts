/**
 * Quality Gate Provider - VS Code WebView for Code Quality Validation
 *
 * Shows real-time quality gate results with pass/fail status
 * Provides auto-fix buttons for failed quality checks
 */
import * as vscode from 'vscode';
export interface QualityGateResult {
    passed: boolean;
    score: number;
    gates: {
        syntax: QualityGateStatus;
        build: QualityGateStatus;
        tests: QualityGateStatus;
        security: QualityGateStatus;
        performance: QualityGateStatus;
    };
    suggestions: FixSuggestion[];
    canAutoFix: boolean;
    processingTime: number;
}
export interface QualityGateStatus {
    passed: boolean;
    score: number;
    issues: QualityIssue[];
    metrics?: Record<string, any>;
}
export interface QualityIssue {
    type: 'error' | 'warning' | 'info';
    severity: 'critical' | 'high' | 'medium' | 'low';
    file: string;
    line?: number;
    column?: number;
    message: string;
    rule?: string;
    category: 'syntax' | 'build' | 'test' | 'security' | 'performance';
    fixable: boolean;
    suggestedFix?: string;
}
export interface FixSuggestion {
    id: string;
    description: string;
    confidence: number;
    impact: 'low' | 'medium' | 'high';
    category: string;
    automatable: boolean;
    estimatedTime: number;
}
export declare class QualityGateProvider implements vscode.WebviewViewProvider {
    private readonly _extensionUri;
    static readonly viewType = "claude-quality-gate";
    private _view?;
    private _context;
    private _currentResult?;
    private serverUrl;
    constructor(_extensionUri: vscode.Uri, context: vscode.ExtensionContext);
    resolveWebviewView(webviewView: vscode.WebviewView, context: vscode.WebviewViewResolveContext, _token: vscode.CancellationToken): void;
    runQualityGates(): Promise<void>;
    applyFix(suggestionId: string): Promise<void>;
    applyAllFixes(): Promise<void>;
    private openFile;
    private getChangedFiles;
    private updateWebview;
    private _getHtmlForWebview;
}
