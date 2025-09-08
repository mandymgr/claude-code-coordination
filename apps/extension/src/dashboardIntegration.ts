/**
 * KRINS AI Coordination Dashboard Integration
 * Advanced integration layer between VS Code extension and KRINS dashboard server
 */

import * as vscode from 'vscode';
import { spawn, ChildProcess } from 'child_process';
import * as path from 'path';
import * as fs from 'fs';

export interface DashboardServerStatus {
  isRunning: boolean;
  port: number;
  pid?: number;
  uptime?: number;
  lastError?: string;
}

export interface IntegrationConfig {
  serverPort: number;
  autoStart: boolean;
  enableRealTimeUpdates: boolean;
  updateInterval: number;
  serverTimeout: number;
}

export class DashboardIntegration {
  private static instance: DashboardIntegration;
  private server: ChildProcess | undefined;
  private config: IntegrationConfig;
  public status: DashboardServerStatus;
  private statusCallbacks: ((status: DashboardServerStatus) => void)[] = [];

  private constructor(config: IntegrationConfig) {
    this.config = config;
    this.status = {
      isRunning: false,
      port: config.serverPort
    };
  }

  public static getInstance(config?: IntegrationConfig): DashboardIntegration {
    if (!DashboardIntegration.instance) {
      const defaultConfig: IntegrationConfig = {
        serverPort: 3000,
        autoStart: true,
        enableRealTimeUpdates: true,
        updateInterval: 5000,
        serverTimeout: 10000
      };
      DashboardIntegration.instance = new DashboardIntegration(config || defaultConfig);
    }
    return DashboardIntegration.instance;
  }

  public onStatusChange(callback: (status: DashboardServerStatus) => void): vscode.Disposable {
    this.statusCallbacks.push(callback);
    return {
      dispose: () => {
        const index = this.statusCallbacks.indexOf(callback);
        if (index > -1) {
          this.statusCallbacks.splice(index, 1);
        }
      }
    };
  }

  private notifyStatusChange(): void {
    this.statusCallbacks.forEach(callback => callback(this.status));
  }

  public async startServer(workspaceFolder: vscode.WorkspaceFolder): Promise<boolean> {
    try {
      if (this.status.isRunning) {
        return true;
      }

      // Locate dashboard server
      const dashboardServerPath = this.findDashboardServer(workspaceFolder);
      if (!dashboardServerPath) {
        throw new Error('Dashboard server not found in workspace');
      }

      // Stop any existing server
      await this.stopServer();

      // Start new server
      const serverDir = path.dirname(dashboardServerPath);
      this.server = spawn('node', [
        dashboardServerPath,
        `--port=${this.config.serverPort}`,
        `--coord-dir=${path.join(workspaceFolder.uri.fsPath, '.claude-coordination')}`
      ], {
        cwd: serverDir,
        stdio: ['ignore', 'pipe', 'pipe'],
        detached: false
      });

      // Handle server output
      this.server.stdout?.on('data', (data) => {
        console.log(`[Dashboard Server]: ${data.toString()}`);
      });

      this.server.stderr?.on('data', (data) => {
        const errorMsg = data.toString();
        console.error(`[Dashboard Server Error]: ${errorMsg}`);
        this.status.lastError = errorMsg;
        this.notifyStatusChange();
      });

      this.server.on('close', (code) => {
        console.log(`Dashboard server exited with code ${code}`);
        this.status.isRunning = false;
        this.status.pid = undefined;
        this.notifyStatusChange();
      });

      this.server.on('error', (error) => {
        console.error('Dashboard server error:', error);
        this.status.lastError = error.message;
        this.status.isRunning = false;
        this.notifyStatusChange();
      });

      // Wait for server to start
      await this.waitForServerStart();
      
      this.status.isRunning = true;
      this.status.pid = this.server.pid;
      this.status.uptime = Date.now();
      this.status.lastError = undefined;
      this.notifyStatusChange();

      vscode.window.showInformationMessage(
        `🚀 KRINS Dashboard server started on port ${this.config.serverPort}`,
        'Open Dashboard'
      ).then(action => {
        if (action === 'Open Dashboard') {
          this.openExternalDashboard();
        }
      });

      return true;

    } catch (error) {
      console.error('Failed to start dashboard server:', error);
      this.status.lastError = error instanceof Error ? error.message : String(error);
      this.status.isRunning = false;
      this.notifyStatusChange();
      
      vscode.window.showErrorMessage(
        `Failed to start dashboard server: ${this.status.lastError}`
      );
      
      return false;
    }
  }

  public async stopServer(): Promise<void> {
    if (this.server) {
      try {
        this.server.kill('SIGTERM');
        
        // Wait for graceful shutdown or force kill after timeout
        const killTimeout = setTimeout(() => {
          if (this.server && !this.server.killed) {
            this.server.kill('SIGKILL');
          }
        }, 5000);

        this.server.on('close', () => {
          clearTimeout(killTimeout);
        });

      } catch (error) {
        console.error('Error stopping dashboard server:', error);
      }
      
      this.server = undefined;
    }

    this.status.isRunning = false;
    this.status.pid = undefined;
    this.notifyStatusChange();
  }

  private findDashboardServer(workspaceFolder: vscode.WorkspaceFolder): string | null {
    const possiblePaths = [
      'packages/ai-core/src/dashboard-server.cjs',
      'packages/ai-core/dist/dashboard-server.js',
      'apps/backend/src/dashboard-server.cjs',
      'src/dashboard-server.cjs',
      'dashboard-server.cjs'
    ];

    for (const relativePath of possiblePaths) {
      const fullPath = path.join(workspaceFolder.uri.fsPath, relativePath);
      if (fs.existsSync(fullPath)) {
        return fullPath;
      }
    }

    return null;
  }

  private async waitForServerStart(): Promise<void> {
    const maxAttempts = 20;
    const delayMs = 500;

    for (let attempt = 0; attempt < maxAttempts; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 2000);
        
        const response = await fetch(`http://localhost:${this.config.serverPort}/api/system`, {
          method: 'GET',
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        if (response.ok) {
          return; // Server is ready
        }
      } catch (error) {
        // Server not ready yet, continue waiting
      }

      await new Promise(resolve => setTimeout(resolve, delayMs));
    }

    throw new Error(`Dashboard server failed to start within ${maxAttempts * delayMs}ms`);
  }

  public async getServerStatus(): Promise<DashboardServerStatus> {
    if (!this.status.isRunning) {
      return this.status;
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.serverTimeout);
      
      const response = await fetch(`http://localhost:${this.config.serverPort}/api/system`, {
        method: 'GET',
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (response.ok) {
        // Server is responding
        return this.status;
      } else {
        // Server is not responding properly
        this.status.isRunning = false;
        this.status.lastError = `Server returned ${response.status}`;
        this.notifyStatusChange();
      }
    } catch (error) {
      // Server is not reachable
      this.status.isRunning = false;
      this.status.lastError = error instanceof Error ? error.message : String(error);
      this.notifyStatusChange();
    }

    return this.status;
  }

  public async performServerAction(action: string, payload?: any): Promise<any> {
    if (!this.status.isRunning) {
      throw new Error('Dashboard server is not running');
    }

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.serverTimeout);
      
      const response = await fetch(`http://localhost:${this.config.serverPort}/api/${action}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: payload ? JSON.stringify(payload) : undefined,
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Server action '${action}' failed: ${response.status} ${response.statusText}`);
      }

      return await response.json();
    } catch (error) {
      console.error(`Dashboard server action '${action}' failed:`, error);
      throw error;
    }
  }

  public openExternalDashboard(): void {
    if (this.status.isRunning) {
      vscode.env.openExternal(vscode.Uri.parse(`http://localhost:${this.config.serverPort}`));
    } else {
      vscode.window.showWarningMessage('Dashboard server is not running. Start it first.');
    }
  }

  public async runSystemCleanup(): Promise<any> {
    return this.performServerAction('cleanup');
  }

  public async getSystemMetrics(): Promise<any> {
    return this.performServerAction('system');
  }

  public async getSessionAnalysis(): Promise<any> {
    return this.performServerAction('sessions');
  }

  public dispose(): void {
    this.stopServer();
    this.statusCallbacks.length = 0;
  }

  // Health check and monitoring
  public startHealthMonitoring(context: vscode.ExtensionContext): void {
    if (!this.config.enableRealTimeUpdates) {
      return;
    }

    const healthCheckInterval = setInterval(async () => {
      await this.getServerStatus();
    }, this.config.updateInterval);

    context.subscriptions.push({
      dispose: () => clearInterval(healthCheckInterval)
    });
  }

  // Auto-restart functionality
  public async ensureServerRunning(workspaceFolder: vscode.WorkspaceFolder): Promise<boolean> {
    const status = await this.getServerStatus();
    
    if (!status.isRunning && this.config.autoStart) {
      console.log('Dashboard server not running, attempting to restart...');
      return this.startServer(workspaceFolder);
    }
    
    return status.isRunning;
  }
}

// Utility functions for dashboard integration
export namespace DashboardUtils {
  export function formatUptime(startTime: number): string {
    const uptimeMs = Date.now() - startTime;
    const uptimeSeconds = Math.floor(uptimeMs / 1000);
    const hours = Math.floor(uptimeSeconds / 3600);
    const minutes = Math.floor((uptimeSeconds % 3600) / 60);
    const seconds = uptimeSeconds % 60;
    
    if (hours > 0) {
      return `${hours}h ${minutes}m`;
    } else if (minutes > 0) {
      return `${minutes}m ${seconds}s`;
    } else {
      return `${seconds}s`;
    }
  }

  export function createServerStatusItem(context: vscode.ExtensionContext): vscode.StatusBarItem {
    const statusItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
    statusItem.command = 'claude-coordination.openDashboard';
    statusItem.tooltip = 'KRINS Dashboard Server Status';
    
    const integration = DashboardIntegration.getInstance();
    
    const updateStatusItem = (status: DashboardServerStatus) => {
      if (status.isRunning) {
        statusItem.text = '$(globe) KRINS Dashboard';
        statusItem.backgroundColor = undefined;
      } else {
        statusItem.text = '$(globe) KRINS Dashboard (Offline)';
        statusItem.backgroundColor = new vscode.ThemeColor('statusBarItem.warningBackground');
      }
    };

    // Initial update
    updateStatusItem(integration.status);

    // Subscribe to status changes
    const subscription = integration.onStatusChange(updateStatusItem);
    context.subscriptions.push(subscription);
    
    statusItem.show();
    context.subscriptions.push(statusItem);
    
    return statusItem;
  }
}