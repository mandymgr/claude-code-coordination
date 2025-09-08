#!/usr/bin/env node

/**
 * Claude Code Coordination Dashboard Server
 * Serves the coordination dashboard with live data
 */

const express = require('express');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

class DashboardServer {
    constructor(port = 3333, coordinationDir = '.claude-coordination') {
        this.port = port;
        this.coordinationDir = path.resolve(coordinationDir);
        this.systemFile = path.join(this.coordinationDir, 'system.json');
        this.app = express();
        
        this.setupRoutes();
    }

    setupRoutes() {
        // Serve static files
        this.app.use(express.static(path.join(__dirname)));
        this.app.use(express.json());

        // Main dashboard route
        this.app.get('/', (req, res) => {
            res.sendFile(path.join(__dirname, 'dashboard.html'));
        });

        // API route for system data
        this.app.get('/api/system', async (req, res) => {
            try {
                const systemData = await this.getSystemData();
                res.json(systemData);
            } catch (error) {
                console.error('Error getting system data:', error);
                res.status(500).json({ error: 'Failed to load system data' });
            }
        });

        // API route for session cleanup
        this.app.post('/api/cleanup', async (req, res) => {
            try {
                const SessionManager = require('./session-manager.js.cjs');
                const manager = new SessionManager(this.coordinationDir);
                const stats = await manager.performCleanup();
                
                res.json({
                    success: true,
                    stats: stats,
                    message: `Cleaned up ${stats.cleanedSessions} sessions and ${stats.orphanedLocks} locks`
                });
            } catch (error) {
                console.error('Error during cleanup:', error);
                res.status(500).json({
                    success: false,
                    error: 'Cleanup failed',
                    message: error.message
                });
            }
        });

        // API route for session analysis
        this.app.get('/api/sessions', async (req, res) => {
            try {
                const SessionManager = require('./session-manager.js.cjs');
                const manager = new SessionManager(this.coordinationDir);
                const stats = await manager.performCleanup({ dryRun: true });
                
                const systemData = await this.getSystemData();
                const sessions = Object.values(systemData.sessions || {});
                
                const analyzedSessions = [];
                for (const session of sessions) {
                    const analysis = await manager.analyzeSessionHealth(session);
                    analyzedSessions.push({
                        ...session,
                        health: analysis
                    });
                }
                
                res.json({
                    sessions: analyzedSessions,
                    stats: stats
                });
            } catch (error) {
                console.error('Error analyzing sessions:', error);
                res.status(500).json({ error: 'Failed to analyze sessions' });
            }
        });

        // WebSocket-like Server-Sent Events for real-time updates
        this.app.get('/api/events', (req, res) => {
            res.writeHead(200, {
                'Content-Type': 'text/event-stream',
                'Cache-Control': 'no-cache',
                'Connection': 'keep-alive',
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Headers': 'Cache-Control'
            });

            // Send initial data
            this.getSystemData().then(data => {
                res.write(`data: ${JSON.stringify(data)}\n\n`);
            });

            // Send updates every 5 seconds
            const interval = setInterval(async () => {
                try {
                    const data = await this.getSystemData();
                    res.write(`data: ${JSON.stringify(data)}\n\n`);
                } catch (error) {
                    console.error('Error sending update:', error);
                }
            }, 5000);

            // Clean up when client disconnects
            req.on('close', () => {
                clearInterval(interval);
            });
        });
    }

    async getSystemData() {
        try {
            if (fs.existsSync(this.systemFile)) {
                const data = fs.readFileSync(this.systemFile, 'utf8');
                const systemData = JSON.parse(data);
                
                // Add session health analysis
                const SessionManager = require('./session-manager.js.cjs');
                const manager = new SessionManager(this.coordinationDir);
                
                for (const [sessionId, session] of Object.entries(systemData.sessions || {})) {
                    const health = await manager.analyzeSessionHealth(session);
                    systemData.sessions[sessionId].health = health;
                }
                
                return systemData;
            }
        } catch (error) {
            console.warn(`Warning: Could not load system data: ${error.message}`);
        }
        
        return {
            version: "2.0.0",
            sessions: {},
            locks: {},
            activeFiles: {},
            sharedState: {
                currentTasks: [],
                projectSettings: {
                    frontend_port: 5173,
                    backend_port: 3001,
                    database_port: 5555
                }
            },
            lastUpdated: Date.now()
        };
    }

    async start() {
        return new Promise((resolve, reject) => {
            this.server = this.app.listen(this.port, (error) => {
                if (error) {
                    reject(error);
                } else {
                    console.log(`🌐 Claude Coordination Dashboard running at:`);
                    console.log(`   http://localhost:${this.port}`);
                    console.log(`   Coordination dir: ${this.coordinationDir}`);
                    console.log('');
                    console.log('📊 Features:');
                    console.log('   • Real-time session monitoring');
                    console.log('   • Session health analysis');
                    console.log('   • File lock visualization');
                    console.log('   • One-click zombie cleanup');
                    console.log('   • Auto-refresh every 5 seconds');
                    console.log('');
                    console.log('🚀 Ready for coordination!');
                    resolve();
                }
            });
        });
    }

    async stop() {
        if (this.server) {
            return new Promise((resolve) => {
                this.server.close(resolve);
            });
        }
    }
}

// CLI interface
async function main() {
    const args = process.argv.slice(2);
    const port = parseInt(args.find(arg => arg.startsWith('--port='))?.split('=')[1]) || 3333;
    const coordDir = args.find(arg => arg.startsWith('--coord-dir='))?.split('=')[1] || '.claude-coordination';
    
    const dashboard = new DashboardServer(port, coordDir);
    
    try {
        await dashboard.start();
        
        // Handle graceful shutdown
        process.on('SIGINT', async () => {
            console.log('\n👋 Shutting down dashboard server...');
            await dashboard.stop();
            process.exit(0);
        });
        
    } catch (error) {
        console.error(`❌ Failed to start dashboard server: ${error.message}`);
        process.exit(1);
    }
}

// Export for use as module
module.exports = DashboardServer;

// Run CLI if executed directly
if (require.main === module) {
    main();
}