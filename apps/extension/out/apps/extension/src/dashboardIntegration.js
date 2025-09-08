"use strict";
/**
 * KRINS AI Coordination Dashboard Integration
 * Advanced integration layer between VS Code extension and KRINS dashboard server
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DashboardUtils = exports.DashboardIntegration = void 0;
const vscode = __importStar(require("vscode"));
const child_process_1 = require("child_process");
const path = __importStar(require("path"));
const fs = __importStar(require("fs"));
class DashboardIntegration {
    constructor(config) {
        this.statusCallbacks = [];
        this.config = config;
        this.status = {
            isRunning: false,
            port: config.serverPort
        };
    }
    static getInstance(config) {
        if (!DashboardIntegration.instance) {
            const defaultConfig = {
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
    onStatusChange(callback) {
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
    notifyStatusChange() {
        this.statusCallbacks.forEach(callback => callback(this.status));
    }
    async startServer(workspaceFolder) {
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
            this.server = (0, child_process_1.spawn)('node', [
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
            vscode.window.showInformationMessage(`🚀 KRINS Dashboard server started on port ${this.config.serverPort}`, 'Open Dashboard').then(action => {
                if (action === 'Open Dashboard') {
                    this.openExternalDashboard();
                }
            });
            return true;
        }
        catch (error) {
            console.error('Failed to start dashboard server:', error);
            this.status.lastError = error instanceof Error ? error.message : String(error);
            this.status.isRunning = false;
            this.notifyStatusChange();
            vscode.window.showErrorMessage(`Failed to start dashboard server: ${this.status.lastError}`);
            return false;
        }
    }
    async stopServer() {
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
            }
            catch (error) {
                console.error('Error stopping dashboard server:', error);
            }
            this.server = undefined;
        }
        this.status.isRunning = false;
        this.status.pid = undefined;
        this.notifyStatusChange();
    }
    findDashboardServer(workspaceFolder) {
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
    async waitForServerStart() {
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
            }
            catch (error) {
                // Server not ready yet, continue waiting
            }
            await new Promise(resolve => setTimeout(resolve, delayMs));
        }
        throw new Error(`Dashboard server failed to start within ${maxAttempts * delayMs}ms`);
    }
    async getServerStatus() {
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
            }
            else {
                // Server is not responding properly
                this.status.isRunning = false;
                this.status.lastError = `Server returned ${response.status}`;
                this.notifyStatusChange();
            }
        }
        catch (error) {
            // Server is not reachable
            this.status.isRunning = false;
            this.status.lastError = error instanceof Error ? error.message : String(error);
            this.notifyStatusChange();
        }
        return this.status;
    }
    async performServerAction(action, payload) {
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
        }
        catch (error) {
            console.error(`Dashboard server action '${action}' failed:`, error);
            throw error;
        }
    }
    openExternalDashboard() {
        if (this.status.isRunning) {
            vscode.env.openExternal(vscode.Uri.parse(`http://localhost:${this.config.serverPort}`));
        }
        else {
            vscode.window.showWarningMessage('Dashboard server is not running. Start it first.');
        }
    }
    async runSystemCleanup() {
        return this.performServerAction('cleanup');
    }
    async getSystemMetrics() {
        return this.performServerAction('system');
    }
    async getSessionAnalysis() {
        return this.performServerAction('sessions');
    }
    dispose() {
        this.stopServer();
        this.statusCallbacks.length = 0;
    }
    // Health check and monitoring
    startHealthMonitoring(context) {
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
    async ensureServerRunning(workspaceFolder) {
        const status = await this.getServerStatus();
        if (!status.isRunning && this.config.autoStart) {
            console.log('Dashboard server not running, attempting to restart...');
            return this.startServer(workspaceFolder);
        }
        return status.isRunning;
    }
}
exports.DashboardIntegration = DashboardIntegration;
// Utility functions for dashboard integration
var DashboardUtils;
(function (DashboardUtils) {
    function formatUptime(startTime) {
        const uptimeMs = Date.now() - startTime;
        const uptimeSeconds = Math.floor(uptimeMs / 1000);
        const hours = Math.floor(uptimeSeconds / 3600);
        const minutes = Math.floor((uptimeSeconds % 3600) / 60);
        const seconds = uptimeSeconds % 60;
        if (hours > 0) {
            return `${hours}h ${minutes}m`;
        }
        else if (minutes > 0) {
            return `${minutes}m ${seconds}s`;
        }
        else {
            return `${seconds}s`;
        }
    }
    DashboardUtils.formatUptime = formatUptime;
    function createServerStatusItem(context) {
        const statusItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
        statusItem.command = 'claude-coordination.openDashboard';
        statusItem.tooltip = 'KRINS Dashboard Server Status';
        const integration = DashboardIntegration.getInstance();
        const updateStatusItem = (status) => {
            if (status.isRunning) {
                statusItem.text = '$(globe) KRINS Dashboard';
                statusItem.backgroundColor = undefined;
            }
            else {
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
    DashboardUtils.createServerStatusItem = createServerStatusItem;
})(DashboardUtils = exports.DashboardUtils || (exports.DashboardUtils = {}));
//# sourceMappingURL=dashboardIntegration.js.map