#!/usr/bin/env node
/**
 * 🔄 Real-time Status Updates System
 * Live coordination status with WebSocket broadcasting and event streaming
 */

const fs = require('fs');
const path = require('path');
const { EventEmitter } = require('events');
const WebSocket = require('ws');

class RealtimeStatusUpdates extends EventEmitter {
  constructor(projectPath = process.cwd()) {
    super();
    this.projectPath = projectPath;
    this.coordinationDir = path.join(projectPath, '.claude-coordination');
    this.statusFile = path.join(this.coordinationDir, 'realtime-status.json');
    this.wsServer = null;
    this.clients = new Set();
    this.status = this.loadStatus();
    this.watchers = new Map();
    this.updateInterval = null;
    
    this.ensureCoordinationDir();
    this.initializeStatus();
  }

  /**
   * 🗂️ Ensure coordination directory exists
   */
  ensureCoordinationDir() {
    if (!fs.existsSync(this.coordinationDir)) {
      fs.mkdirSync(this.coordinationDir, { recursive: true });
    }
  }

  /**
   * 📊 Load current status
   */
  loadStatus() {
    try {
      if (fs.existsSync(this.statusFile)) {
        return JSON.parse(fs.readFileSync(this.statusFile, 'utf8'));
      }
    } catch (error) {
      console.warn('⚠️ Error loading status:', error.message);
    }
    
    return this.getDefaultStatus();
  }

  /**
   * 🎯 Get default status structure
   */
  getDefaultStatus() {
    return {
      project: {
        name: path.basename(this.projectPath),
        path: this.projectPath,
        lastActivity: Date.now(),
        health: 'healthy'
      },
      sessions: {},
      coordination: {
        activeLocks: {},
        messages: [],
        sharedContext: {}
      },
      ai: {
        cacheStats: { hits: 0, misses: 0, size: 0 },
        recentQueries: [],
        performanceMetrics: { avgResponseTime: 0, totalQueries: 0 }
      },
      development: {
        filesWatched: 0,
        recentChanges: [],
        buildStatus: 'unknown',
        testStatus: 'unknown'
      },
      realtime: {
        connectedClients: 0,
        lastUpdate: Date.now(),
        updateFrequency: 5000 // 5 seconds
      }
    };
  }

  /**
   * 🚀 Initialize status system
   */
  initializeStatus() {
    this.saveStatus();
    this.startStatusUpdater();
    this.watchFileSystem();
    this.watchCoordinationFiles();
    
    // Emit initial status
    this.emit('statusUpdate', this.status);
    console.log('🔄 Real-time status updates initialized');
  }

  /**
   * 💾 Save status to file
   */
  saveStatus() {
    try {
      this.status.realtime.lastUpdate = Date.now();
      fs.writeFileSync(this.statusFile, JSON.stringify(this.status, null, 2));
    } catch (error) {
      console.warn('⚠️ Error saving status:', error.message);
    }
  }

  /**
   * ⏰ Start periodic status updater
   */
  startStatusUpdater() {
    this.updateInterval = setInterval(() => {
      this.updateStatus();
    }, this.status.realtime.updateFrequency);
  }

  /**
   * 🔄 Update all status information
   */
  async updateStatus() {
    try {
      // Update project health
      await this.updateProjectHealth();
      
      // Update coordination status
      await this.updateCoordinationStatus();
      
      // Update AI metrics
      await this.updateAIMetrics();
      
      // Update development status
      await this.updateDevelopmentStatus();
      
      // Update real-time metrics
      this.status.realtime.connectedClients = this.clients.size;
      
      this.saveStatus();
      this.broadcastStatus();
      this.emit('statusUpdate', this.status);
      
    } catch (error) {
      console.warn('⚠️ Error updating status:', error.message);
    }
  }

  /**
   * 🏥 Update project health status
   */
  async updateProjectHealth() {
    const now = Date.now();
    this.status.project.lastActivity = now;
    
    // Check project health indicators
    const healthChecks = {
      fileSystem: this.checkFileSystemHealth(),
      dependencies: await this.checkDependencies(),
      processes: this.checkProcesses(),
      diskSpace: this.checkDiskSpace()
    };
    
    const healthyChecks = Object.values(healthChecks).filter(check => check).length;
    const totalChecks = Object.keys(healthChecks).length;
    
    if (healthyChecks === totalChecks) {
      this.status.project.health = 'healthy';
    } else if (healthyChecks >= totalChecks * 0.7) {
      this.status.project.health = 'warning';
    } else {
      this.status.project.health = 'error';
    }
    
    this.status.project.healthChecks = healthChecks;
  }

  /**
   * 🤝 Update coordination status
   */
  async updateCoordinationStatus() {
    // Update active sessions
    const sessionsDir = path.join(this.coordinationDir, 'sessions');
    if (fs.existsSync(sessionsDir)) {
      const sessionFiles = fs.readdirSync(sessionsDir).filter(f => f.endsWith('.json'));
      
      this.status.sessions = {};
      for (const file of sessionFiles) {
        try {
          const sessionPath = path.join(sessionsDir, file);
          const sessionData = JSON.parse(fs.readFileSync(sessionPath, 'utf8'));
          const sessionId = file.replace('.json', '');
          
          this.status.sessions[sessionId] = {
            ...sessionData,
            isActive: this.isSessionActive(sessionData),
            lastSeen: sessionData.lastActivity || sessionData.created
          };
        } catch (error) {
          console.warn(`⚠️ Error reading session file ${file}:`, error.message);
        }
      }
    }
    
    // Update file locks
    const locksDir = path.join(this.coordinationDir, 'locks');
    this.status.coordination.activeLocks = {};
    
    if (fs.existsSync(locksDir)) {
      const lockFiles = fs.readdirSync(locksDir).filter(f => f.endsWith('.lock'));
      
      for (const lockFile of lockFiles) {
        try {
          const lockPath = path.join(locksDir, lockFile);
          const lockData = JSON.parse(fs.readFileSync(lockPath, 'utf8'));
          const fileName = lockFile.replace('.lock', '');
          
          this.status.coordination.activeLocks[fileName] = lockData;
        } catch (error) {
          console.warn(`⚠️ Error reading lock file ${lockFile}:`, error.message);
        }
      }
    }
    
    // Update recent messages
    const broadcastsDir = path.join(this.coordinationDir, 'broadcasts');
    if (fs.existsSync(broadcastsDir)) {
      const messageFiles = fs.readdirSync(broadcastsDir)
        .filter(f => f.endsWith('.json'))
        .sort((a, b) => b.localeCompare(a))
        .slice(0, 10);
      
      this.status.coordination.messages = [];
      for (const messageFile of messageFiles) {
        try {
          const messagePath = path.join(broadcastsDir, messageFile);
          const messageData = JSON.parse(fs.readFileSync(messagePath, 'utf8'));
          this.status.coordination.messages.push(messageData);
        } catch (error) {
          console.warn(`⚠️ Error reading message file ${messageFile}:`, error.message);
        }
      }
    }
  }

  /**
   * 🧠 Update AI metrics
   */
  async updateAIMetrics() {
    const cacheStatsPath = path.join(this.coordinationDir, 'response-cache', 'cache-metadata.json');
    
    if (fs.existsSync(cacheStatsPath)) {
      try {
        const cacheData = JSON.parse(fs.readFileSync(cacheStatsPath, 'utf8'));
        const entries = Object.values(cacheData.entries || {});
        
        this.status.ai.cacheStats = {
          hits: entries.reduce((sum, entry) => sum + (entry.accessCount || 1) - 1, 0),
          misses: entries.length,
          size: Math.round(cacheData.totalSize / 1024) || 0,
          entryCount: entries.length
        };
        
        // Recent queries
        this.status.ai.recentQueries = entries
          .sort((a, b) => (b.lastAccessed || 0) - (a.lastAccessed || 0))
          .slice(0, 5)
          .map(entry => ({
            query: entry.query,
            timestamp: entry.lastAccessed,
            accessCount: entry.accessCount
          }));
          
      } catch (error) {
        console.warn('⚠️ Error reading AI cache stats:', error.message);
      }
    }
  }

  /**
   * 🛠️ Update development status
   */
  async updateDevelopmentStatus() {
    this.status.development.filesWatched = this.watchers.size;
    
    // Check build status
    this.status.development.buildStatus = await this.checkBuildStatus();
    
    // Check test status
    this.status.development.testStatus = await this.checkTestStatus();
    
    // Update recent file changes
    this.updateRecentChanges();
  }

  /**
   * 📁 Watch file system for changes
   */
  watchFileSystem() {
    const filesToWatch = [
      'package.json',
      'tsconfig.json',
      'webpack.config.js',
      'vite.config.js',
      '.env',
      'docker-compose.yml',
      'Dockerfile'
    ];
    
    filesToWatch.forEach(file => {
      const filePath = path.join(this.projectPath, file);
      if (fs.existsSync(filePath)) {
        this.watchFile(filePath);
      }
    });
    
    // Watch source directories
    const srcDirs = ['src', 'lib', 'components', 'pages', 'api'];
    srcDirs.forEach(dir => {
      const dirPath = path.join(this.projectPath, dir);
      if (fs.existsSync(dirPath)) {
        this.watchDirectory(dirPath);
      }
    });
  }

  /**
   * 📂 Watch coordination files
   */
  watchCoordinationFiles() {
    const filesToWatch = [
      path.join(this.coordinationDir, 'sessions'),
      path.join(this.coordinationDir, 'locks'),
      path.join(this.coordinationDir, 'broadcasts')
    ];
    
    filesToWatch.forEach(dir => {
      if (fs.existsSync(dir)) {
        this.watchDirectory(dir, true);
      }
    });
  }

  /**
   * 👁️ Watch a single file
   */
  watchFile(filePath) {
    if (this.watchers.has(filePath)) return;
    
    try {
      const watcher = fs.watchFile(filePath, (curr, prev) => {
        if (curr.mtime !== prev.mtime) {
          this.handleFileChange(filePath, 'modified');
        }
      });
      
      this.watchers.set(filePath, watcher);
    } catch (error) {
      console.warn(`⚠️ Error watching file ${filePath}:`, error.message);
    }
  }

  /**
   * 📁 Watch a directory
   */
  watchDirectory(dirPath, isCoordination = false) {
    if (this.watchers.has(dirPath)) return;
    
    try {
      const watcher = fs.watch(dirPath, (eventType, filename) => {
        if (filename) {
          const fullPath = path.join(dirPath, filename);
          this.handleFileChange(fullPath, eventType, isCoordination);
        }
      });
      
      this.watchers.set(dirPath, watcher);
    } catch (error) {
      console.warn(`⚠️ Error watching directory ${dirPath}:`, error.message);
    }
  }

  /**
   * 🔄 Handle file changes
   */
  handleFileChange(filePath, eventType, isCoordination = false) {
    const change = {
      file: path.relative(this.projectPath, filePath),
      type: eventType,
      timestamp: Date.now(),
      isCoordination
    };
    
    this.status.development.recentChanges.unshift(change);
    this.status.development.recentChanges = this.status.development.recentChanges.slice(0, 20);
    
    if (isCoordination) {
      // Trigger immediate update for coordination changes
      this.updateStatus();
    }
    
    this.emit('fileChange', change);
  }

  /**
   * 🌐 Start WebSocket server
   */
  startWebSocketServer(port = 8080) {
    this.wsServer = new WebSocket.Server({ port });
    
    this.wsServer.on('connection', (ws, req) => {
      this.clients.add(ws);
      console.log(`🔌 Client connected from ${req.socket.remoteAddress}`);
      
      // Send initial status
      ws.send(JSON.stringify({
        type: 'status',
        data: this.status,
        timestamp: Date.now()
      }));
      
      ws.on('close', () => {
        this.clients.delete(ws);
        console.log('🔌 Client disconnected');
      });
      
      ws.on('error', (error) => {
        console.warn('⚠️ WebSocket error:', error.message);
        this.clients.delete(ws);
      });
    });
    
    console.log(`🌐 WebSocket server started on port ${port}`);
    return port;
  }

  /**
   * 📡 Broadcast status to all connected clients
   */
  broadcastStatus() {
    if (this.clients.size === 0) return;
    
    const message = JSON.stringify({
      type: 'status',
      data: this.status,
      timestamp: Date.now()
    });
    
    this.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      } else {
        this.clients.delete(client);
      }
    });
  }

  /**
   * 📡 Broadcast custom event
   */
  broadcastEvent(eventType, data) {
    if (this.clients.size === 0) return;
    
    const message = JSON.stringify({
      type: eventType,
      data,
      timestamp: Date.now()
    });
    
    this.clients.forEach(client => {
      if (client.readyState === WebSocket.OPEN) {
        client.send(message);
      }
    });
  }

  /**
   * 🔍 Check if session is active
   */
  isSessionActive(sessionData) {
    const now = Date.now();
    const lastActivity = sessionData.lastActivity || sessionData.created;
    const timeout = 30 * 60 * 1000; // 30 minutes
    
    return (now - lastActivity) < timeout;
  }

  /**
   * 🏗️ Check build status
   */
  async checkBuildStatus() {
    try {
      const packageJsonPath = path.join(this.projectPath, 'package.json');
      if (fs.existsSync(packageJsonPath)) {
        const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        const buildScript = pkg.scripts && pkg.scripts.build;
        
        if (buildScript) {
          // Check if dist/build folder exists and is recent
          const possibleDirs = ['dist', 'build', 'out', '.next'];
          for (const dir of possibleDirs) {
            const buildDir = path.join(this.projectPath, dir);
            if (fs.existsSync(buildDir)) {
              const stats = fs.statSync(buildDir);
              const age = Date.now() - stats.mtime.getTime();
              const oneDayInMs = 24 * 60 * 60 * 1000;
              
              return age < oneDayInMs ? 'recent' : 'stale';
            }
          }
          return 'missing';
        }
      }
      return 'no-build-script';
    } catch (error) {
      return 'error';
    }
  }

  /**
   * 🧪 Check test status
   */
  async checkTestStatus() {
    try {
      const packageJsonPath = path.join(this.projectPath, 'package.json');
      if (fs.existsSync(packageJsonPath)) {
        const pkg = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        const testScript = pkg.scripts && pkg.scripts.test;
        
        if (testScript) {
          // Check for test directories/files
          const testDirs = ['test', 'tests', '__tests__', 'spec'];
          const hasTests = testDirs.some(dir => 
            fs.existsSync(path.join(this.projectPath, dir))
          );
          
          return hasTests ? 'available' : 'no-tests';
        }
      }
      return 'no-test-script';
    } catch (error) {
      return 'error';
    }
  }

  /**
   * 🏥 Health check methods
   */
  checkFileSystemHealth() {
    try {
      fs.accessSync(this.projectPath, fs.constants.R_OK | fs.constants.W_OK);
      return true;
    } catch (error) {
      return false;
    }
  }

  async checkDependencies() {
    try {
      const packageJsonPath = path.join(this.projectPath, 'package.json');
      const nodeModulesPath = path.join(this.projectPath, 'node_modules');
      
      if (fs.existsSync(packageJsonPath) && fs.existsSync(nodeModulesPath)) {
        return true;
      }
      return !fs.existsSync(packageJsonPath); // OK if no package.json
    } catch (error) {
      return false;
    }
  }

  checkProcesses() {
    return true;
  }

  checkDiskSpace() {
    try {
      const stats = fs.statSync(this.projectPath);
      return true;
    } catch (error) {
      return false;
    }
  }

  updateRecentChanges() {
    this.status.development.recentChanges = this.status.development.recentChanges
      .filter(change => (Date.now() - change.timestamp) < 60 * 60 * 1000) // Last hour
      .sort((a, b) => b.timestamp - a.timestamp);
  }

  /**
   * 📊 Get current status
   */
  getStatus() {
    return { ...this.status };
  }

  /**
   * 🛑 Stop all watchers and servers
   */
  stop() {
    // Clear update interval
    if (this.updateInterval) {
      clearInterval(this.updateInterval);
      this.updateInterval = null;
    }
    
    // Close file watchers
    this.watchers.forEach((watcher, filePath) => {
      try {
        if (typeof watcher.close === 'function') {
          watcher.close();
        } else {
          fs.unwatchFile(filePath);
        }
      } catch (error) {
        console.warn(`⚠️ Error closing watcher for ${filePath}:`, error.message);
      }
    });
    this.watchers.clear();
    
    // Close WebSocket server
    if (this.wsServer) {
      this.wsServer.close();
      this.wsServer = null;
    }
    
    // Clear clients
    this.clients.clear();
    
    console.log('🛑 Real-time status updates stopped');
  }
}

// CLI Interface
if (require.main === module) {
  const statusUpdates = new RealtimeStatusUpdates();
  const command = process.argv[2];
  
  switch (command) {
    case 'start':
      const port = parseInt(process.argv[3]) || 8080;
      statusUpdates.startWebSocketServer(port);
      console.log(`🚀 Real-time status system running on port ${port}`);
      break;
      
    case 'status':
      console.log('📊 Current Status:');
      console.log(JSON.stringify(statusUpdates.getStatus(), null, 2));
      statusUpdates.stop();
      break;
      
    case 'watch':
      statusUpdates.on('statusUpdate', (status) => {
        console.log('🔄 Status updated:', new Date().toISOString());
        console.log('   Connected clients:', status.realtime.connectedClients);
        console.log('   Active sessions:', Object.keys(status.sessions).length);
        console.log('   File locks:', Object.keys(status.coordination.activeLocks).length);
      });
      
      statusUpdates.on('fileChange', (change) => {
        console.log('📁 File changed:', change.file, '(' + change.type + ')');
      });
      
      console.log('👁️  Watching for changes... (Press Ctrl+C to stop)');
      break;
      
    default:
      console.log(`
🔄 Real-time Status Updates

Usage: node realtime-status-updates.js [command]

Commands:
  start [port]  Start WebSocket server (default port: 8080)
  status        Show current status
  watch         Watch for changes

Examples:
  node realtime-status-updates.js start 3001
  node realtime-status-updates.js status
  node realtime-status-updates.js watch
`);
  }
  
  // Graceful shutdown
  process.on('SIGINT', () => {
    console.log('\n🛑 Shutting down...');
    statusUpdates.stop();
    process.exit(0);
  });
}

module.exports = RealtimeStatusUpdates;