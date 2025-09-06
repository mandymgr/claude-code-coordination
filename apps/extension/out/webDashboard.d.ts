export declare class WebDashboardPanel {
    static currentPanel: WebDashboardPanel | undefined;
    private readonly _panel;
    private readonly _extensionPath;
    private _disposables;
    static createOrShow(extensionPath?: string): void;
    private constructor();
    dispose(): void;
    private _update;
    private getCoordinationStatus;
    private getWebviewContent;
    private getErrorContent;
}
