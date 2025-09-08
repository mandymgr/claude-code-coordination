import * as vscode from 'vscode';
import { exec } from 'child_process';
import { CoordinationStatus } from './extension';

export class CoordinationDecorationProvider implements vscode.FileDecorationProvider {
  private _onDidChangeFileDecorations: vscode.EventEmitter<vscode.Uri | vscode.Uri[] | undefined> = new vscode.EventEmitter<vscode.Uri | vscode.Uri[] | undefined>();
  readonly onDidChangeFileDecorations: vscode.Event<vscode.Uri | vscode.Uri[] | undefined> = this._onDidChangeFileDecorations.event;

  private lockedFiles: Set<string> = new Set();
  private myLockedFiles: Set<string> = new Set();

  constructor() {
    this.loadLockedFiles();
  }

  refresh(): void {
    this.loadLockedFiles();
    this._onDidChangeFileDecorations.fire(undefined);
  }

  provideFileDecoration(uri: vscode.Uri): vscode.ProviderResult<vscode.FileDecoration> {
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

  private async loadLockedFiles(): Promise<void> {
    try {
      const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
      if (!workspaceFolder) {
        return;
      }

      const config = vscode.workspace.getConfiguration('claude-coordination');
      const magicPath = config.get<string>('magicCliPath') || 'magic';
      
      const command = `${magicPath} coord-status --json`;
      
      const output = await new Promise<string>((resolve, reject) => {
        exec(command, { 
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

      const status: CoordinationStatus = JSON.parse(output);
      
      this.lockedFiles.clear();
      this.myLockedFiles.clear();

      for (const lock of status.locks) {
        this.lockedFiles.add(lock.file);
        if (lock.session === status.currentSession) {
          this.myLockedFiles.add(lock.file);
        }
      }
    } catch (error) {
      console.log('Failed to load locked files:', error);
      this.lockedFiles.clear();
      this.myLockedFiles.clear();
    }
  }
}