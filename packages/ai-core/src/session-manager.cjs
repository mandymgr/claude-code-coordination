#!/usr/bin/env node

/**
 * Claude Code Coordination - Advanced Session Manager v2.0
 * Intelligent session cleanup, health monitoring, and management
 */

const fs = require('fs');
const path = require('path');
const { exec } = require('child_process');
const { promisify } = require('util');

const execAsync = promisify(exec);

class SessionManager {
    constructor(coordinationDir = '.claude-coordination') {
        this.coordinationDir = path.resolve(coordinationDir);
        this.systemFile = path.join(this.coordinationDir, 'system.json');
        this.sessionsDir = path.join(this.coordinationDir, 'sessions');
        this.locksDir = path.join(this.coordinationDir, 'locks');
        
        // Session thresholds
        this.SESSION_TIMEOUT_MS = 2 * 60 * 60 * 1000; // 2 hours
        this.HEARTBEAT_TIMEOUT_MS = 5 * 60 * 1000; // 5 minutes
        this.ZOMBIE_PROCESS_THRESHOLD = 10 * 60 * 1000; // 10 minutes
        
        this.stats = {
            totalSessions: 0,
            activeSessions: 0,
            zombieSessions: 0,
            cleanedSessions: 0,
            orphanedLocks: 0
        };
    }

    /**
     * Load system state from disk
     */
    loadSystemState() {
        try {
            if (fs.existsSync(this.systemFile)) {
                const data = fs.readFileSync(this.systemFile, 'utf8');
                return JSON.parse(data);
            }
        } catch (error) {
            console.warn(`⚠️  Warning: Could not load system state: ${error.message}`);
        }
        
        return {
            version: "2.0.0",
            sessions: {},
            locks: {},
            activeFiles: {},
            sharedState: {
                currentTasks: [],
                projectSettings: {}
            },
            lastUpdated: Date.now()
        };
    }

    /**
     * Save system state to disk
     */
    saveSystemState(state) {
        try {
            state.lastUpdated = Date.now();
            fs.writeFileSync(this.systemFile, JSON.stringify(state, null, 2));
            return true;
        } catch (error) {
            console.error(`❌ Error saving system state: ${error.message}`);
            return false;
        }
    }

    /**
     * Check if a process is still running
     */
    async isProcessRunning(pid) {
        try {
            // On Unix-like systems, kill with signal 0 checks if process exists
            await execAsync(`kill -0 ${pid} 2>/dev/null`);
            return true;
        } catch (error) {
            return false;
        }
    }

    /**
     * Get process information
     */
    async getProcessInfo(pid) {
        try {
            const { stdout } = await execAsync(`ps -o pid,ppid,etime,cmd -p ${pid} 2>/dev/null | tail -n 1`);
            const parts = stdout.trim().split(/\s+/);
            
            if (parts.length >= 4) {
                return {
                    pid: parseInt(parts[0]),
                    ppid: parseInt(parts[1]),
                    etime: parts[2],
                    cmd: parts.slice(3).join(' ')
                };
            }
        } catch (error) {
            // Process not found
        }
        return null;
    }

    /**
     * Analyze session health
     */
    async analyzeSessionHealth(session) {
        const now = Date.now();
        const analysis = {
            id: session.id,
            status: 'unknown',
            issues: [],
            recommendations: []
        };

        // Check if process exists
        const processRunning = await this.isProcessRunning(session.pid);
        if (!processRunning) {
            analysis.status = 'zombie';
            analysis.issues.push('Process no longer running');
            analysis.recommendations.push('Remove zombie session');
            return analysis;
        }

        // Check heartbeat age
        const heartbeatAge = now - session.lastHeartbeat;
        if (heartbeatAge > this.HEARTBEAT_TIMEOUT_MS) {
            analysis.status = 'stale';
            analysis.issues.push(`No heartbeat for ${Math.round(heartbeatAge / 60000)} minutes`);
            analysis.recommendations.push('Check session responsiveness');
        }

        // Check session age
        const sessionAge = now - session.startTime;
        if (sessionAge > this.SESSION_TIMEOUT_MS) {
            analysis.status = 'old';
            analysis.issues.push(`Session running for ${Math.round(sessionAge / (60 * 60 * 1000))} hours`);
            analysis.recommendations.push('Consider session cleanup');
        }

        // Check for stuck file locks
        if (session.workingFiles && session.workingFiles.length > 0) {
            const oldLocks = session.workingFiles.filter(file => {
                // Check if lock is very old (> 30 minutes)
                return sessionAge > 30 * 60 * 1000;
            });
            
            if (oldLocks.length > 0) {
                analysis.issues.push(`${oldLocks.length} potentially stuck file locks`);
                analysis.recommendations.push('Release old file locks');
            }
        }

        // If no issues found, mark as healthy
        if (analysis.issues.length === 0) {
            analysis.status = 'healthy';
        }

        return analysis;
    }

    /**
     * Clean up zombie sessions and orphaned locks
     */
    async performCleanup(options = {}) {
        const { dryRun = false, force = false } = options;
        
        console.log('🧹 Starting intelligent session cleanup...\n');
        
        const state = this.loadSystemState();
        this.stats.totalSessions = Object.keys(state.sessions).length;
        
        const sessionAnalyses = [];
        const toRemove = [];
        const locksToClean = [];

        // Analyze all sessions
        for (const [sessionId, session] of Object.entries(state.sessions)) {
            const analysis = await this.analyzeSessionHealth(session);
            sessionAnalyses.push(analysis);
            
            if (analysis.status === 'zombie' || (force && analysis.status === 'old')) {
                toRemove.push(sessionId);
                this.stats.zombieSessions++;
            } else if (analysis.status === 'healthy') {
                this.stats.activeSessions++;
            }
        }

        // Find orphaned locks (locks belonging to zombie sessions)
        for (const [filePath, lock] of Object.entries(state.locks || {})) {
            if (toRemove.includes(lock.sessionId)) {
                locksToClean.push(filePath);
                this.stats.orphanedLocks++;
            }
        }

        // Report findings
        this.printCleanupReport(sessionAnalyses, toRemove, locksToClean);

        if (dryRun) {
            console.log('🔍 Dry run complete - no changes made');
            return this.stats;
        }

        // Perform cleanup
        if (toRemove.length > 0) {
            console.log('\n🗑️  Removing zombie sessions...');
            toRemove.forEach(sessionId => {
                delete state.sessions[sessionId];
                console.log(`   ❌ Removed session: ${sessionId.substring(0, 8)}...`);
            });
            this.stats.cleanedSessions = toRemove.length;
        }

        // Clean orphaned locks
        if (locksToClean.length > 0) {
            console.log('\n🔓 Cleaning orphaned locks...');
            locksToClean.forEach(filePath => {
                delete state.locks[filePath];
                console.log(`   🔓 Released lock: ${path.basename(filePath)}`);
                
                // Remove physical lock file
                const lockFile = path.join(this.locksDir, `${path.basename(filePath)}.lock`);
                if (fs.existsSync(lockFile)) {
                    fs.unlinkSync(lockFile);
                }
            });
        }

        // Save cleaned state
        if (this.saveSystemState(state)) {
            console.log('\n✅ Cleanup completed successfully!');
        } else {
            console.log('\n❌ Error saving cleaned state');
        }

        return this.stats;
    }

    /**
     * Print detailed cleanup report
     */
    printCleanupReport(analyses, toRemove, locksToClean) {
        console.log('📊 Session Health Report');
        console.log('========================\n');
        
        console.log(`📈 Statistics:`);
        console.log(`   Total sessions: ${this.stats.totalSessions}`);
        console.log(`   Active sessions: ${this.stats.activeSessions}`);
        console.log(`   Zombie sessions: ${this.stats.zombieSessions}`);
        console.log(`   Orphaned locks: ${this.stats.orphanedLocks}\n`);

        if (analyses.length === 0) {
            console.log('🎉 No sessions found - system is clean!\n');
            return;
        }

        // Group sessions by status
        const grouped = analyses.reduce((acc, analysis) => {
            if (!acc[analysis.status]) acc[analysis.status] = [];
            acc[analysis.status].push(analysis);
            return acc;
        }, {});

        // Print healthy sessions
        if (grouped.healthy) {
            console.log(`✅ Healthy Sessions (${grouped.healthy.length}):`);
            grouped.healthy.forEach(analysis => {
                console.log(`   🟢 ${analysis.id.substring(0, 8)}... - Running normally`);
            });
            console.log('');
        }

        // Print problematic sessions
        ['stale', 'old', 'zombie'].forEach(status => {
            if (!grouped[status]) return;
            
            const statusEmoji = {
                stale: '🟡',
                old: '🟠',
                zombie: '🔴'
            };
            
            console.log(`${statusEmoji[status]} ${status.toUpperCase()} Sessions (${grouped[status].length}):`);
            grouped[status].forEach(analysis => {
                console.log(`   ${statusEmoji[status]} ${analysis.id.substring(0, 8)}...`);
                analysis.issues.forEach(issue => {
                    console.log(`      ⚠️  ${issue}`);
                });
                analysis.recommendations.forEach(rec => {
                    console.log(`      💡 ${rec}`);
                });
            });
            console.log('');
        });

        // Print cleanup actions
        if (toRemove.length > 0 || locksToClean.length > 0) {
            console.log('🧹 Cleanup Actions:');
            if (toRemove.length > 0) {
                console.log(`   🗑️  Will remove ${toRemove.length} zombie sessions`);
            }
            if (locksToClean.length > 0) {
                console.log(`   🔓 Will release ${locksToClean.length} orphaned locks`);
            }
            console.log('');
        }
    }

    /**
     * Monitor sessions in real-time
     */
    async startMonitoring(interval = 60000) {
        console.log('👁️  Starting real-time session monitoring...');
        console.log(`   Checking every ${interval / 1000} seconds\n`);

        const monitor = async () => {
            try {
                const stats = await this.performCleanup({ dryRun: true });
                
                if (stats.zombieSessions > 0 || stats.orphanedLocks > 0) {
                    console.log(`⚠️  ${new Date().toLocaleTimeString()} - Found ${stats.zombieSessions} zombies, ${stats.orphanedLocks} orphaned locks`);
                    
                    // Auto-cleanup if too many zombies
                    if (stats.zombieSessions > 5) {
                        console.log('🧹 Auto-cleanup triggered (>5 zombies)');
                        await this.performCleanup({ dryRun: false });
                    }
                } else {
                    console.log(`✅ ${new Date().toLocaleTimeString()} - System healthy (${stats.activeSessions} active sessions)`);
                }
            } catch (error) {
                console.error(`❌ Monitoring error: ${error.message}`);
            }
        };

        // Initial check
        await monitor();
        
        // Set up periodic monitoring
        return setInterval(monitor, interval);
    }
}

// CLI Interface
async function main() {
    const args = process.argv.slice(2);
    const command = args[0] || 'status';
    
    const manager = new SessionManager();

    try {
        switch (command) {
            case 'cleanup':
                const force = args.includes('--force');
                const dryRun = args.includes('--dry-run');
                await manager.performCleanup({ force, dryRun });
                break;
                
            case 'monitor':
                const interval = parseInt(args.find(arg => arg.startsWith('--interval='))?.split('=')[1]) || 60000;
                const monitorId = await manager.startMonitoring(interval);
                
                // Handle graceful shutdown
                process.on('SIGINT', () => {
                    console.log('\n👋 Stopping monitor...');
                    clearInterval(monitorId);
                    process.exit(0);
                });
                break;
                
            case 'status':
                await manager.performCleanup({ dryRun: true });
                break;
                
            default:
                console.log(`
🚀 Claude Code Coordination - Session Manager v2.0

Usage: node session-manager.js <command> [options]

Commands:
  status              Show session health status (default)
  cleanup             Clean zombie sessions and orphaned locks
  monitor             Start real-time monitoring

Options:
  --dry-run          Show what would be cleaned without making changes
  --force            Force cleanup of old sessions (not just zombies)
  --interval=<ms>    Monitoring interval in milliseconds (default: 60000)

Examples:
  node session-manager.js status
  node session-manager.js cleanup --dry-run  
  node session-manager.js cleanup --force
  node session-manager.js monitor --interval=30000
                `);
                break;
        }
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
    }
}

// Export for use as module
module.exports = SessionManager;

// Run CLI if executed directly
if (require.main === module) {
    main();
}