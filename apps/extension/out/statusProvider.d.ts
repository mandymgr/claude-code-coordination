import * as vscode from 'vscode';
export declare class CoordinationStatusProvider implements vscode.TreeDataProvider<CoordinationItem> {
    private _onDidChangeTreeData;
    readonly onDidChangeTreeData: vscode.Event<CoordinationItem | undefined | null | void>;
    private status;
    constructor();
    refresh(): void;
    getTreeItem(element: CoordinationItem): vscode.TreeItem;
    getChildren(element?: CoordinationItem): Thenable<CoordinationItem[]>;
    private getRootItems;
    private getChildItems;
    private loadStatus;
}
declare class CoordinationItem extends vscode.TreeItem {
    readonly label: string;
    readonly tooltip: string;
    readonly collapsibleState: vscode.TreeItemCollapsibleState;
    readonly contextValue: string;
    readonly command?: vscode.Command | undefined;
    constructor(label: string, tooltip: string, collapsibleState: vscode.TreeItemCollapsibleState, contextValue: string, command?: vscode.Command | undefined);
}
export {};
