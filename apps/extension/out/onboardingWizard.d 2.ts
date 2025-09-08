import * as vscode from 'vscode';
export declare class OnboardingWizard {
    private context;
    private panel;
    constructor(context: vscode.ExtensionContext);
    show(): Promise<void>;
    private validateServerConnection;
    private setupOAuth;
    private selectRepository;
    private configureDefaults;
    private runFirstTask;
    private completeOnboarding;
    private sendMessage;
    private getHtmlContent;
}
export declare function createOnboardingCommand(context: vscode.ExtensionContext): vscode.Disposable;
