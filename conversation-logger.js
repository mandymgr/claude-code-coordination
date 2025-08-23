#!/usr/bin/env node
/**
 * 📝 Conversation Logger for Claude Code Sessions
 * Automatically logs all interactions for continuity between sessions
 */

const fs = require('fs');
const path = require('path');

class ConversationLogger {
  constructor(projectPath = process.cwd()) {
    this.projectPath = projectPath;
    this.logDir = path.join(projectPath, '.claude-coordination', 'conversation-logs');
    this.currentSessionFile = path.join(this.logDir, `session-${new Date().toISOString().split('T')[0]}.md`);
    this.summaryFile = path.join(this.logDir, 'session-summary.json');
    
    this.ensureLogDirectory();
    this.initializeSession();
  }

  ensureLogDirectory() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  initializeSession() {
    const timestamp = new Date().toISOString();
    const sessionHeader = `# 🪄 Claude Code Session Log - ${timestamp}\n\n`;
    
    if (!fs.existsSync(this.currentSessionFile)) {
      fs.writeFileSync(this.currentSessionFile, sessionHeader);
    }
  }

  /**
   * 📝 Log user message and response
   */
  logInteraction(userMessage, claudeResponse, context = {}) {
    const timestamp = new Date().toISOString();
    const interaction = `
## 🕐 ${timestamp}

### 👤 User:
${userMessage}

### 🤖 Claude Response:
${claudeResponse}

### 📊 Context:
- Project: ${context.projectType || 'Unknown'}
- Command: ${context.command || 'N/A'}
- Files Modified: ${context.filesModified?.join(', ') || 'None'}

---

`;

    fs.appendFileSync(this.currentSessionFile, interaction);
    this.updateSessionSummary(userMessage, claudeResponse, context);
  }

  /**
   * 📊 Update session summary for quick reference
   */
  updateSessionSummary(userMessage, claudeResponse, context) {
    let summary = {};
    
    if (fs.existsSync(this.summaryFile)) {
      try {
        summary = JSON.parse(fs.readFileSync(this.summaryFile, 'utf8'));
      } catch (error) {
        console.warn('Could not read session summary:', error.message);
      }
    }

    const today = new Date().toISOString().split('T')[0];
    
    if (!summary[today]) {
      summary[today] = {
        date: today,
        interactions: [],
        keyTopics: [],
        filesCreated: [],
        commandsUsed: []
      };
    }

    // Ensure arrays (in case they were loaded as Sets from JSON)
    if (!Array.isArray(summary[today].keyTopics)) {
      summary[today].keyTopics = Array.from(summary[today].keyTopics || []);
    }
    if (!Array.isArray(summary[today].filesCreated)) {
      summary[today].filesCreated = Array.from(summary[today].filesCreated || []);
    }
    if (!Array.isArray(summary[today].commandsUsed)) {
      summary[today].commandsUsed = Array.from(summary[today].commandsUsed || []);
    }

    // Add interaction
    summary[today].interactions.push({
      timestamp: new Date().toISOString(),
      userMessage: userMessage.substring(0, 100) + (userMessage.length > 100 ? '...' : ''),
      responseType: this.classifyResponse(claudeResponse),
      context
    });

    // Extract key topics
    this.extractKeyTopics(userMessage).forEach(topic => {
      if (!summary[today].keyTopics.includes(topic)) {
        summary[today].keyTopics.push(topic);
      }
    });

    // Track files and commands
    if (context.filesModified) {
      context.filesModified.forEach(file => {
        if (!summary[today].filesCreated.includes(file)) {
          summary[today].filesCreated.push(file);
        }
      });
    }
    
    if (context.command && !summary[today].commandsUsed.includes(context.command)) {
      summary[today].commandsUsed.push(context.command);
    }

    fs.writeFileSync(this.summaryFile, JSON.stringify(summary, null, 2));
  }

  /**
   * 🔍 Extract key topics from user message
   */
  extractKeyTopics(message) {
    const topicKeywords = [
      'react', 'typescript', 'javascript', 'python', 'django', 'flask',
      'deployment', 'docker', 'kubernetes', 'ai', 'optimization', 'testing',
      'component', 'api', 'database', 'authentication', 'performance',
      'magic', 'cli', 'coordination', 'team', 'dashboard'
    ];

    const topics = [];
    const lowerMessage = message.toLowerCase();
    
    topicKeywords.forEach(keyword => {
      if (lowerMessage.includes(keyword)) {
        topics.push(keyword);
      }
    });

    return topics;
  }

  /**
   * 📋 Classify Claude's response type
   */
  classifyResponse(response) {
    if (response.includes('```')) return 'code-generation';
    if (response.includes('🧠') || response.includes('AI')) return 'ai-assistance';
    if (response.includes('magic')) return 'magic-system';
    if (response.includes('deploy')) return 'deployment';
    if (response.includes('test')) return 'testing';
    return 'general';
  }

  /**
   * 📖 Get session summary
   */
  getSessionSummary(days = 7) {
    if (!fs.existsSync(this.summaryFile)) {
      return { message: 'No session history found' };
    }

    try {
      const summary = JSON.parse(fs.readFileSync(this.summaryFile, 'utf8'));
      const recentSessions = {};
      
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - days);

      Object.keys(summary)
        .filter(date => new Date(date) >= cutoffDate)
        .forEach(date => {
          recentSessions[date] = summary[date];
        });

      return recentSessions;
    } catch (error) {
      return { error: 'Could not read session summary' };
    }
  }

  /**
   * 📝 Log magic command usage
   */
  logMagicCommand(command, args, result) {
    this.logInteraction(
      `magic ${command} ${args.join(' ')}`,
      `Command executed successfully. Result: ${JSON.stringify(result, null, 2)}`,
      {
        command: `magic ${command}`,
        projectType: 'magic-system',
        result: result.status || 'completed'
      }
    );
  }

  /**
   * 📁 Log file operations
   */
  logFileOperation(operation, files, description) {
    this.logInteraction(
      `File operation: ${operation}`,
      description,
      {
        command: operation,
        filesModified: Array.isArray(files) ? files : [files],
        projectType: 'file-management'
      }
    );
  }

  /**
   * 📊 Generate session report
   */
  generateSessionReport() {
    const summary = this.getSessionSummary(30); // Last 30 days
    const report = {
      totalSessions: Object.keys(summary).length,
      totalInteractions: 0,
      topTopics: {},
      commandsUsed: {},
      filesCreated: new Set(),
      recentActivity: []
    };

    Object.values(summary).forEach(session => {
      if (session.interactions) {
        report.totalInteractions += session.interactions.length;
      }
      
      // Count topics
      if (session.keyTopics) {
        session.keyTopics.forEach(topic => {
          report.topTopics[topic] = (report.topTopics[topic] || 0) + 1;
        });
      }
      
      // Count commands
      if (session.commandsUsed) {
        session.commandsUsed.forEach(cmd => {
          report.commandsUsed[cmd] = (report.commandsUsed[cmd] || 0) + 1;
        });
      }
      
      // Collect files
      if (session.filesCreated) {
        session.filesCreated.forEach(file => report.filesCreated.add(file));
      }
      
      // Recent activity
      if (session.interactions) {
        report.recentActivity.push(...session.interactions.slice(-3));
      }
    });

    report.filesCreated = Array.from(report.filesCreated);
    report.recentActivity = report.recentActivity
      .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp))
      .slice(0, 10);

    return report;
  }

  /**
   * 📤 Export logs for sharing
   */
  exportLogs(format = 'markdown') {
    const exportDir = path.join(this.logDir, 'exports');
    if (!fs.existsSync(exportDir)) {
      fs.mkdirSync(exportDir, { recursive: true });
    }

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const exportFile = path.join(exportDir, `claude-session-export-${timestamp}.${format}`);
    
    if (format === 'markdown') {
      const summary = this.getSessionSummary(30);
      let exportContent = `# 🪄 Claude Code Session Export\n\n`;
      exportContent += `Generated: ${new Date().toISOString()}\n\n`;
      
      Object.entries(summary).forEach(([date, session]) => {
        exportContent += `## 📅 ${date}\n\n`;
        if (session.interactions) {
          session.interactions.forEach(interaction => {
            exportContent += `### 🕐 ${interaction.timestamp}\n`;
            exportContent += `**User:** ${interaction.userMessage}\n`;
            exportContent += `**Type:** ${interaction.responseType}\n\n`;
          });
        }
      });
      
      fs.writeFileSync(exportFile, exportContent);
    } else if (format === 'json') {
      const summary = this.getSessionSummary(30);
      fs.writeFileSync(exportFile, JSON.stringify(summary, null, 2));
    }

    return exportFile;
  }

  /**
   * 🧹 Clean old logs
   */
  cleanOldLogs(daysToKeep = 30) {
    try {
      const files = fs.readdirSync(this.logDir);
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - daysToKeep);

      let cleanedCount = 0;
      files.forEach(file => {
        const filePath = path.join(this.logDir, file);
        const stats = fs.statSync(filePath);
        
        if (stats.mtime < cutoffDate && file.endsWith('.md')) {
          fs.unlinkSync(filePath);
          cleanedCount++;
        }
      });

      return { cleaned: cleanedCount, message: `Cleaned ${cleanedCount} old log files` };
    } catch (error) {
      return { error: 'Could not clean old logs: ' + error.message };
    }
  }
}

// CLI interface
if (require.main === module) {
  const logger = new ConversationLogger();
  const command = process.argv[2];
  
  switch (command) {
    case 'summary':
      const days = parseInt(process.argv[3]) || 7;
      const summary = logger.getSessionSummary(days);
      console.log('📊 Session Summary (last ' + days + ' days):');
      console.log(JSON.stringify(summary, null, 2));
      break;
      
    case 'report':
      const report = logger.generateSessionReport();
      console.log('📈 Session Report:');
      console.log('Total Sessions:', report.totalSessions);
      console.log('Total Interactions:', report.totalInteractions);
      console.log('Top Topics:', Object.entries(report.topTopics).slice(0, 5));
      console.log('Commands Used:', Object.entries(report.commandsUsed).slice(0, 5));
      console.log('Files Created:', report.filesCreated.length);
      break;
      
    case 'export':
      const format = process.argv[3] || 'markdown';
      const exportFile = logger.exportLogs(format);
      console.log('📤 Logs exported to:', exportFile);
      break;
      
    case 'clean':
      const daysToKeep = parseInt(process.argv[3]) || 30;
      const result = logger.cleanOldLogs(daysToKeep);
      console.log('🧹 Cleanup result:', result.message || result.error);
      break;
      
    default:
      console.log(`
🪄 Conversation Logger CLI

Usage:
  node conversation-logger.js <command> [options]

Commands:
  summary [days]    Show session summary (default: 7 days)
  report           Generate comprehensive session report
  export [format]  Export logs (markdown|json, default: markdown)
  clean [days]     Clean logs older than N days (default: 30)

Examples:
  node conversation-logger.js summary 14
  node conversation-logger.js export json
  node conversation-logger.js clean 60
`);
  }
}

module.exports = ConversationLogger;