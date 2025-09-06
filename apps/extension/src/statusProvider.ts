import * as vscode from 'vscode';
import { exec } from 'child_process';
import { CoordinationStatus } from './extension';

export class CoordinationStatusProvider implements vscode.TreeDataProvider<CoordinationItem> {
  private _onDidChangeTreeData: vscode.EventEmitter<CoordinationItem | undefined | null | void> = new vscode.EventEmitter<CoordinationItem | undefined | null | void>();
  readonly onDidChangeTreeData: vscode.Event<CoordinationItem | undefined | null | void> = this._onDidChangeTreeData.event;

  private status: CoordinationStatus | null = null;

  constructor() {
    this.loadStatus();
  }

  refresh(): void {
    this.loadStatus();
    this._onDidChangeTreeData.fire();
  }

  getTreeItem(element: CoordinationItem): vscode.TreeItem {
    return element;
  }

  getChildren(element?: CoordinationItem): Thenable<CoordinationItem[]> {
    if (!element) {
      // Root level items
      return Promise.resolve(this.getRootItems());
    } else {
      // Child items
      return Promise.resolve(this.getChildItems(element));
    }
  }

  private getRootItems(): CoordinationItem[] {
    if (!this.status) {
      return [new CoordinationItem('No coordination data', '', vscode.TreeItemCollapsibleState.None, 'info')];
    }

    const items: CoordinationItem[] = [];

    // Current session info
    items.push(new CoordinationItem(
      `Current Session: ${this.status.currentSession}`,
      `Active since startup`,
      vscode.TreeItemCollapsibleState.None,
      'session',
      {
        command: 'claude-coordination.status',
        title: 'Show Full Status'
      }
    ));

    // Sessions section
    if (this.status.sessions.length > 0) {
      items.push(new CoordinationItem(
        `Sessions (${this.status.activeSessions})`,
        `${this.status.activeSessions} active sessions`,
        vscode.TreeItemCollapsibleState.Expanded,
        'sessions'
      ));
    }

    // Locks section
    if (this.status.locks.length > 0) {
      items.push(new CoordinationItem(
        `Locked Files (${this.status.activeFiles})`,
        `${this.status.activeFiles} files currently locked`,
        vscode.TreeItemCollapsibleState.Expanded,
        'locks'
      ));
    }

    // Messages section
    if (this.status.recentMessages.length > 0) {
      items.push(new CoordinationItem(
        `Messages (${this.status.pendingMessages})`,
        `${this.status.pendingMessages} recent messages`,
        vscode.TreeItemCollapsibleState.Collapsed,
        'messages'
      ));
    }

    // Quick actions
    items.push(new CoordinationItem(
      'Quick Actions',
      'Common coordination commands',
      vscode.TreeItemCollapsibleState.Expanded,
      'actions'
    ));

    return items;
  }

  private getChildItems(element: CoordinationItem): CoordinationItem[] {
    if (!this.status) {
      return [];
    }

    switch (element.contextValue) {
      case 'sessions':
        return this.status.sessions.map(session => 
          new CoordinationItem(
            session.id,
            session.description,
            vscode.TreeItemCollapsibleState.None,
            'session-item'
          )
        );

      case 'locks':
        return this.status.locks.map(lock => 
          new CoordinationItem(
            lock.file,
            `${lock.reason} (by ${lock.session})`,
            vscode.TreeItemCollapsibleState.None,
            'lock-item',
            {
              command: 'claude-coordination.unlockFile',
              title: 'Unlock File',
              arguments: [lock.file]
            }
          )
        );

      case 'messages':
        return this.status.recentMessages.slice(0, 5).map(msg => 
          new CoordinationItem(
            `From ${msg.from}`,
            msg.message,
            vscode.TreeItemCollapsibleState.None,
            'message-item'
          )
        );

      case 'actions':
        return [
          new CoordinationItem(
            'Lock Current File',
            'Lock the active editor file',
            vscode.TreeItemCollapsibleState.None,
            'action',
            {
              command: 'claude-coordination.lockFile',
              title: 'Lock Current File'
            }
          ),
          new CoordinationItem(
            'Send Message',
            'Send message to team',
            vscode.TreeItemCollapsibleState.None,
            'action',
            {
              command: 'claude-coordination.sendMessage',
              title: 'Send Message'
            }
          ),
          new CoordinationItem(
            'AI Assistant',
            'Ask AI about your code',
            vscode.TreeItemCollapsibleState.None,
            'action',
            {
              command: 'claude-coordination.aiAssist',
              title: 'AI Assistant'
            }
          ),
          new CoordinationItem(
            'Open Dashboard',
            'Open web dashboard',
            vscode.TreeItemCollapsibleState.None,
            'action',
            {
              command: 'claude-coordination.openDashboard',
              title: 'Open Dashboard'
            }
          ),
          new CoordinationItem(
            'Refresh',
            'Refresh coordination status',
            vscode.TreeItemCollapsibleState.None,
            'action',
            {
              command: 'claude-coordination.refresh',
              title: 'Refresh'
            }
          )
        ];

      default:
        return [];
    }
  }

  private async loadStatus(): Promise<void> {
    try {
      const workspaceFolder = vscode.workspace.workspaceFolders?.[0];
      if (!workspaceFolder) {
        this.status = null;
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

      this.status = JSON.parse(output);
    } catch (error) {
      console.log('Failed to load coordination status:', error);
      this.status = null;
    }
  }
}

class CoordinationItem extends vscode.TreeItem {
  constructor(
    public readonly label: string,
    public readonly tooltip: string,
    public readonly collapsibleState: vscode.TreeItemCollapsibleState,
    public readonly contextValue: string,
    public readonly command?: vscode.Command
  ) {
    super(label, collapsibleState);
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