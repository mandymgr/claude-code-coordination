#!/usr/bin/env node

/**
 * 🔄 Terminal Coordinator - Multi-terminal coordination system
 * Handles sessions, file locks, and inter-terminal communication
 */

const fs = require('fs');
const path = require('path');
const os = require('os');
const { v4: uuidv4 } = require('uuid');

class TerminalCoordinator {
  constructor(projectPath = process.cwd()) {
    this.projectPath = projectPath;
    this.coordDir = path.join(projectPath, '.claude-coordination');
    this.sessionsDir = path.join(this.coordDir, 'sessions');
    this.locksDir = path.join(this.coordDir, 'locks');
    this.messagesDir = path.join(this.coordDir, 'messages');
    
    this.sessionId = this.getOrCreateSessionId();
    this.ensureDirectories();
  }

  /**
   * 📁 Ensure coordination directories exist
   */
  ensureDirectories() {
    [this.coordDir, this.sessionsDir, this.locksDir, this.messagesDir].forEach(dir => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
    });
  }

  /**
   * 🆔 Get or create session ID
   */
  getOrCreateSessionId() {
    const sessionFile = path.join(os.tmpdir(), 'claude-session-id');
    
    if (fs.existsSync(sessionFile)) {
      return fs.readFileSync(sessionFile, 'utf8').trim();
    }
    
    const newSessionId = uuidv4().split('-')[0];
    fs.writeFileSync(sessionFile, newSessionId);
    return newSessionId;
  }

  /**
   * 🚀 Start a new coordination session
   */
  async startSession(description = 'Development work') {
    const sessionData = {
      id: this.sessionId,
      description,
      startTime: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
      currentDirectory: this.projectPath,
      status: 'active',
      currentTask: null,
      lockedFiles: []
    };

    const sessionFile = path.join(this.sessionsDir, `${this.sessionId}.json`);
    fs.writeFileSync(sessionFile, JSON.stringify(sessionData, null, 2));

    console.log(`🚀 Session started: ${this.sessionId}`);
    console.log(`📝 Description: ${description}`);
    console.log(`📁 Directory: ${this.projectPath}`);
    
    return sessionData;
  }

  /**
   * 📋 List all active sessions
   */
  listSessions() {
    if (!fs.existsSync(this.sessionsDir)) return [];

    const sessionFiles = fs.readdirSync(this.sessionsDir).filter(f => f.endsWith('.json'));
    const sessions = [];

    for (const file of sessionFiles) {
      try {
        const sessionData = JSON.parse(fs.readFileSync(path.join(this.sessionsDir, file), 'utf8'));
        
        // Check if session is still active (last activity within 1 hour)
        const lastActivity = new Date(sessionData.lastActivity);
        const now = new Date();
        const hoursInactive = (now - lastActivity) / (1000 * 60 * 60);
        
        if (hoursInactive < 1) {
          sessions.push(sessionData);
        } else {
          // Clean up inactive session
          fs.unlinkSync(path.join(this.sessionsDir, file));
        }
      } catch (error) {
        console.error(`Error reading session file ${file}:`, error.message);
      }
    }

    return sessions;
  }

  /**
   * 🔒 Lock a file for editing
   */
  lockFile(filePath, reason = 'Editing file') {
    const normalizedPath = path.resolve(filePath);
    const lockId = Buffer.from(normalizedPath).toString('base64').replace(/[/+=]/g, '_');
    const lockFile = path.join(this.locksDir, `${lockId}.lock`);

    // Check if already locked
    if (fs.existsSync(lockFile)) {
      const lockData = JSON.parse(fs.readFileSync(lockFile, 'utf8'));
      if (lockData.sessionId === this.sessionId) {
        console.log(`🔒 File already locked by you: ${filePath}`);
        return lockData;
      } else {
        console.log(`❌ File is locked by session ${lockData.sessionId}: ${filePath}`);
        console.log(`   Reason: ${lockData.reason}`);
        console.log(`   Since: ${new Date(lockData.timestamp).toLocaleString()}`);
        return null;
      }
    }

    // Create lock
    const lockData = {
      filePath: normalizedPath,
      sessionId: this.sessionId,
      reason,
      timestamp: new Date().toISOString()
    };

    fs.writeFileSync(lockFile, JSON.stringify(lockData, null, 2));
    console.log(`🔒 File locked: ${filePath}`);
    console.log(`   Reason: ${reason}`);
    
    this.updateSessionActivity();
    return lockData;
  }

  /**
   * 🔓 Unlock a file
   */
  unlockFile(filePath) {
    const normalizedPath = path.resolve(filePath);
    const lockId = Buffer.from(normalizedPath).toString('base64').replace(/[/+=]/g, '_');
    const lockFile = path.join(this.locksDir, `${lockId}.lock`);

    if (!fs.existsSync(lockFile)) {
      console.log(`⚠️  File is not locked: ${filePath}`);
      return false;
    }

    const lockData = JSON.parse(fs.readFileSync(lockFile, 'utf8'));
    if (lockData.sessionId !== this.sessionId) {
      console.log(`❌ Cannot unlock file - locked by session ${lockData.sessionId}: ${filePath}`);
      return false;
    }

    fs.unlinkSync(lockFile);
    console.log(`🔓 File unlocked: ${filePath}`);
    
    this.updateSessionActivity();
    return true;
  }

  /**
   * 🔍 List all active file locks
   */
  listLocks() {
    if (!fs.existsSync(this.locksDir)) return [];

    const lockFiles = fs.readdirSync(this.locksDir).filter(f => f.endsWith('.lock'));
    const locks = [];

    for (const file of lockFiles) {
      try {
        const lockData = JSON.parse(fs.readFileSync(path.join(this.locksDir, file), 'utf8'));
        
        // Check if lock is still valid (less than 2 hours old)
        const lockTime = new Date(lockData.timestamp);
        const now = new Date();
        const hoursOld = (now - lockTime) / (1000 * 60 * 60);
        
        if (hoursOld < 2) {
          locks.push(lockData);
        } else {
          // Clean up old lock
          fs.unlinkSync(path.join(this.locksDir, file));
        }
      } catch (error) {
        console.error(`Error reading lock file ${file}:`, error.message);
      }
    }

    return locks;
  }

  /**
   * 💬 Send message to other sessions
   */
  sendMessage(message, target = 'all', priority = 'normal') {
    const messageData = {
      id: uuidv4(),
      from: this.sessionId,
      to: target,
      message,
      priority,
      timestamp: new Date().toISOString()
    };

    const messageFile = path.join(this.messagesDir, `${messageData.id}.json`);
    fs.writeFileSync(messageFile, JSON.stringify(messageData, null, 2));

    console.log(`💬 Message sent to ${target}: ${message}`);
    this.updateSessionActivity();
  }

  /**
   * 📨 Check for new messages
   */
  checkMessages() {
    if (!fs.existsSync(this.messagesDir)) return [];

    const messageFiles = fs.readdirSync(this.messagesDir).filter(f => f.endsWith('.json'));
    const messages = [];

    for (const file of messageFiles) {
      try {
        const messageData = JSON.parse(fs.readFileSync(path.join(this.messagesDir, file), 'utf8'));
        
        // Check if message is for this session
        if (messageData.to === 'all' || messageData.to === this.sessionId) {
          // Don't show own messages
          if (messageData.from !== this.sessionId) {
            messages.push(messageData);
          }
        }
        
        // Clean up old messages (older than 1 hour)
        const messageTime = new Date(messageData.timestamp);
        const now = new Date();
        const hoursOld = (now - messageTime) / (1000 * 60 * 60);
        
        if (hoursOld > 1) {
          fs.unlinkSync(path.join(this.messagesDir, file));
        }
      } catch (error) {
        console.error(`Error reading message file ${file}:`, error.message);
      }
    }

    return messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
  }

  /**
   * ⏰ Update session activity
   */
  updateSessionActivity(task = null) {
    const sessionFile = path.join(this.sessionsDir, `${this.sessionId}.json`);
    
    if (fs.existsSync(sessionFile)) {
      const sessionData = JSON.parse(fs.readFileSync(sessionFile, 'utf8'));
      sessionData.lastActivity = new Date().toISOString();
      if (task) sessionData.currentTask = task;
      
      fs.writeFileSync(sessionFile, JSON.stringify(sessionData, null, 2));
    }
  }

  /**
   * 🔄 Get real-time coordination status
   */
  getStatus() {
    const sessions = this.listSessions();
    const locks = this.listLocks();
    const messages = this.checkMessages();

    return {
      currentSession: this.sessionId,
      activeSessions: sessions.length,
      activeFiles: locks.length,
      pendingMessages: messages.length,
      sessions: sessions.map(s => ({
        id: s.id,
        description: s.description,
        lastActivity: s.lastActivity,
        currentTask: s.currentTask
      })),
      locks: locks.map(l => ({
        file: path.relative(this.projectPath, l.filePath),
        session: l.sessionId,
        reason: l.reason,
        since: l.timestamp
      })),
      recentMessages: messages.slice(-5)
    };
  }

  /**
   * 🧹 Clean up session
   */
  cleanup() {
    // Remove session file
    const sessionFile = path.join(this.sessionsDir, `${this.sessionId}.json`);
    if (fs.existsSync(sessionFile)) {
      fs.unlinkSync(sessionFile);
    }

    // Remove all locks from this session
    const locks = this.listLocks();
    locks.forEach(lock => {
      if (lock.sessionId === this.sessionId) {
        this.unlockFile(lock.filePath);
      }
    });

    console.log(`🧹 Session ${this.sessionId} cleaned up`);
  }
}

module.exports = TerminalCoordinator;

// CLI usage
if (require.main === module) {
  const coordinator = new TerminalCoordinator();
  const [,, command, ...args] = process.argv;

  (async () => {
    try {
      switch (command) {
        case 'start':
          await coordinator.startSession(args.join(' ') || 'Development work');
          break;

        case 'list':
        case 'sessions':
          const sessions = coordinator.listSessions();
          console.log('\n👥 Active Sessions:');
          console.log('==================');
          if (sessions.length === 0) {
            console.log('   No active sessions');
          } else {
            sessions.forEach(session => {
              const current = session.id === coordinator.sessionId ? ' (current)' : '';
              console.log(`🔵 ${session.id}${current}`);
              console.log(`   📝 ${session.description}`);
              console.log(`   📁 ${session.currentDirectory}`);
              console.log(`   ⏰ ${new Date(session.lastActivity).toLocaleString()}`);
              if (session.currentTask) {
                console.log(`   🎯 ${session.currentTask}`);
              }
              console.log('');
            });
          }
          break;

        case 'lock':
          if (!args[0]) {
            console.log('❌ Please specify a file to lock');
            console.log('💡 Usage: terminal-coordinator lock <file> [reason]');
            process.exit(1);
          }
          coordinator.lockFile(args[0], args.slice(1).join(' ') || 'Editing file');
          break;

        case 'unlock':
          if (!args[0]) {
            console.log('❌ Please specify a file to unlock');
            console.log('💡 Usage: terminal-coordinator unlock <file>');
            process.exit(1);
          }
          coordinator.unlockFile(args[0]);
          break;

        case 'locks':
          const locks = coordinator.listLocks();
          console.log('\n🔒 Active File Locks:');
          console.log('====================');
          if (locks.length === 0) {
            console.log('   No active locks');
          } else {
            locks.forEach(lock => {
              const yours = lock.sessionId === coordinator.sessionId ? ' (yours)' : '';
              console.log(`🔒 ${path.relative(coordinator.projectPath, lock.filePath)}${yours}`);
              console.log(`   👤 Session: ${lock.sessionId}`);
              console.log(`   📝 Reason: ${lock.reason}`);
              console.log(`   ⏰ Since: ${new Date(lock.timestamp).toLocaleString()}`);
              console.log('');
            });
          }
          break;

        case 'message':
        case 'msg':
          if (!args[0]) {
            console.log('❌ Please specify a message');
            console.log('💡 Usage: terminal-coordinator message <message> [target] [priority]');
            process.exit(1);
          }
          coordinator.sendMessage(args[0], args[1] || 'all', args[2] || 'normal');
          break;

        case 'messages':
          const messages = coordinator.checkMessages();
          console.log('\n💬 Recent Messages:');
          console.log('==================');
          if (messages.length === 0) {
            console.log('   No new messages');
          } else {
            messages.forEach(msg => {
              const priority = msg.priority === 'high' ? '🔴' : msg.priority === 'low' ? '🟡' : '🔵';
              console.log(`${priority} From ${msg.from}: ${msg.message}`);
              console.log(`   ⏰ ${new Date(msg.timestamp).toLocaleString()}`);
              console.log('');
            });
          }
          break;

        case 'status':
          const status = coordinator.getStatus();
          console.log('\n🔄 Coordination Status:');
          console.log('======================');
          console.log(`🆔 Current Session: ${status.currentSession}`);
          console.log(`👥 Active Sessions: ${status.activeSessions}`);
          console.log(`🔒 Locked Files: ${status.activeFiles}`);
          console.log(`💬 Pending Messages: ${status.pendingMessages}`);
          console.log('');
          
          if (status.sessions.length > 0) {
            console.log('👥 Sessions:');
            status.sessions.forEach(session => {
              const current = session.id === coordinator.sessionId ? ' (you)' : '';
              console.log(`   ${session.id}${current} - ${session.description}`);
            });
            console.log('');
          }
          
          if (status.locks.length > 0) {
            console.log('🔒 Locked files:');
            status.locks.forEach(lock => {
              const yours = lock.session === coordinator.sessionId ? ' (yours)' : '';
              console.log(`   ${lock.file}${yours} - ${lock.reason}`);
            });
            console.log('');
          }
          break;

        case 'cleanup':
          coordinator.cleanup();
          break;

        default:
          console.log('🔄 Terminal Coordinator - Multi-terminal coordination');
          console.log('');
          console.log('USAGE:');
          console.log('  terminal-coordinator <command> [options]');
          console.log('');
          console.log('COMMANDS:');
          console.log('  start [description]    🚀 Start a coordination session');
          console.log('  sessions               👥 List all active sessions');
          console.log('  lock <file> [reason]   🔒 Lock a file for editing');
          console.log('  unlock <file>          🔓 Unlock a file');
          console.log('  locks                  🔍 List all active file locks');
          console.log('  message <msg> [target] 💬 Send message to other sessions');
          console.log('  messages               📨 Check for new messages');
          console.log('  status                 🔄 Show coordination status');
          console.log('  cleanup                🧹 Clean up current session');
          console.log('');
          console.log('EXAMPLES:');
          console.log('  terminal-coordinator start "Working on API"');
          console.log('  terminal-coordinator lock src/api.js "Fixing bug #123"');
          console.log('  terminal-coordinator message "Starting deployment"');
          console.log('  terminal-coordinator status');
      }
    } catch (error) {
      console.error('❌ Error:', error.message);
      process.exit(1);
    }
  })();
}