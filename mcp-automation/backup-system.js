#!/usr/bin/env node

/**
 * MCP-enabled backup system for Claude Code Coordination
 * This script can be triggered by Claude via File System MCP
 */

const fs = require('fs').promises;
const path = require('path');
const { execSync } = require('child_process');

class AutomatedBackupSystem {
  constructor() {
    this.projectRoot = process.cwd();
    this.backupDir = path.join(this.projectRoot, '.backups');
    this.timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  }

  async init() {
    console.log('🚀 Initializing MCP-enabled backup system...');
    await this.ensureBackupDir();
    await this.runBackup();
  }

  async ensureBackupDir() {
    try {
      await fs.access(this.backupDir);
    } catch {
      await fs.mkdir(this.backupDir, { recursive: true });
      console.log(`📁 Created backup directory: ${this.backupDir}`);
    }
  }

  async runBackup() {
    const backupPath = path.join(this.backupDir, `backup-${this.timestamp}`);
    await fs.mkdir(backupPath, { recursive: true });

    // Backup critical files
    const criticalFiles = [
      '.claude-coordination/config.json',
      '.claude-coordination/hooks.sh',
      'package.json',
      'CLAUDE.md',
      'README.md'
    ];

    for (const file of criticalFiles) {
      const sourcePath = path.join(this.projectRoot, file);
      const destPath = path.join(backupPath, file);
      
      try {
        await fs.mkdir(path.dirname(destPath), { recursive: true });
        await fs.copyFile(sourcePath, destPath);
        console.log(`✅ Backed up: ${file}`);
      } catch (error) {
        console.log(`⚠️  Skip: ${file} (${error.message})`);
      }
    }

    // Create git snapshot
    try {
      const gitLog = execSync('git log --oneline -5').toString();
      const gitStatus = execSync('git status --porcelain').toString();
      
      const gitSnapshot = `Git Snapshot - ${new Date().toISOString()}\n\n` +
                         `Recent commits:\n${gitLog}\n` +
                         `Working directory status:\n${gitStatus}`;
      
      await fs.writeFile(path.join(backupPath, 'git-snapshot.txt'), gitSnapshot);
      console.log('✅ Created git snapshot');
    } catch (error) {
      console.log(`⚠️  Git snapshot failed: ${error.message}`);
    }

    console.log(`🎉 Backup completed: ${backupPath}`);
    return backupPath;
  }

  async cleanup() {
    const backups = await fs.readdir(this.backupDir);
    const backupFolders = backups.filter(name => name.startsWith('backup-'));
    
    // Keep only last 10 backups
    if (backupFolders.length > 10) {
      const oldBackups = backupFolders.slice(0, -10);
      for (const backup of oldBackups) {
        const backupPath = path.join(this.backupDir, backup);
        await fs.rmdir(backupPath, { recursive: true });
        console.log(`🗑️  Removed old backup: ${backup}`);
      }
    }
  }
}

// Can be called by Claude via MCP
if (require.main === module) {
  const backup = new AutomatedBackupSystem();
  backup.init()
    .then(() => backup.cleanup())
    .then(() => console.log('💯 Backup system completed successfully'))
    .catch(error => {
      console.error('❌ Backup failed:', error);
      process.exit(1);
    });
}

module.exports = AutomatedBackupSystem;