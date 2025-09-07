import * as vscode from 'vscode';
export declare class CoordinationDecorationProvider implements vscode.FileDecorationProvider {
    private _onDidChangeFileDecorations;
    readonly onDidChangeFileDecorations: vscode.Event<vscode.Uri | vscode.Uri[] | undefined>;
    private lockedFiles;
    private myLockedFiles;
    constructor();
    refresh(): void;
    provideFileDecoration(uri: vscode.Uri): vscode.ProviderResult<vscode.FileDecoration>;
    private loadLockedFiles;
}
