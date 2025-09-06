/**
 * Spec Mode Provider - VS Code WebView for Test-Driven Development
 *
 * Provides interface for generating tests and implementing features through TDD
 */
import * as vscode from 'vscode';
export interface SpecModeRequest {
    task: string;
    targetFiles: string[];
    framework?: 'vitest' | 'jest' | 'mocha';
    mode: 'full-tdd' | 'tests-only' | 'patch-only';
    maxIterations?: number;
    aiModel?: 'claude' | 'gpt4' | 'gemini';
}
export interface SpecModeResult {
    success: boolean;
    specGeneration: {
        tests: any[];
        totalTests: number;
        confidence: number;
        recommendations: string[];
    };
    patchGeneration?: {
        success: boolean;
        iterations: number;
        generatedPatch?: string;
        testResults: any[];
    };
    totalDuration: number;
    recommendations: string[];
}
export declare class SpecModeProvider implements vscode.WebviewViewProvider {
    private readonly _extensionUri;
    static readonly viewType = "claude-spec-mode";
    private _view?;
    private _context;
    private _currentResult?;
    private serverUrl;
    private isRunning;
    constructor(_extensionUri: vscode.Uri, context: vscode.ExtensionContext);
    resolveWebviewView(webviewView: vscode.WebviewView, context: vscode.WebviewViewResolveContext, _token: vscode.CancellationToken): void;
    runSpecMode(request: SpecModeRequest): Promise<void>;
    generateTestsOnly(request: SpecModeRequest): Promise<void>;
    applyGeneratedPatch(): Promise<void>;
    private showPatchDiff;
    private selectTargetFiles;
    private openTestFile;
    private updateWebview;
    private _getHtmlForWebview;
}
