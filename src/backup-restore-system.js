#!/usr/bin/env node
/**
 * 💾 Backup & Restore System
 * Comprehensive backup solution for coordination state, AI cache, and project metadata
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const { execSync } = require('child_process');

class BackupRestoreSystem {
  constructor(projectPath = process.cwd()) {
    this.projectPath = projectPath;
    this.coordinationDir = path.join(projectPath, '.claude-coordination');
    this.backupDir = path.join(this.coordinationDir, 'backups');
    this.configFile = path.join(this.coordinationDir, 'backup-config.json');
    this.config = this.loadConfig();
    
    this.ensureBackupDirectory();
  }

  /**
   * 🗂️ Ensure backup directory exists
   */
  ensureBackupDirectory() {
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }
  }

  /**
   * ⚙️ Load backup configuration
   */
  loadConfig() {
    try {
      if (fs.existsSync(this.configFile)) {
        return JSON.parse(fs.readFileSync(this.configFile, 'utf8'));
      }
    } catch (error) {
      console.warn('⚠️ Error loading backup config:', error.message);
    }
    
    return this.getDefaultConfig();
  }

  /**
   * 🎯 Get default configuration
   */
  getDefaultConfig() {
    return {
      autoBackup: {
        enabled: true,
        interval: '6h', // 6 hours
        maxBackups: 50,
        onFileChange: true,
        onAIInteraction: false
      },
      compression: {
        enabled: true,
        level: 6 // 1-9, higher = better compression but slower
      },
      encryption: {
        enabled: false,
        algorithm: 'aes-256-gcm'
      },
      retention: {
        daily: 7,    // Keep daily backups for 7 days
        weekly: 4,   // Keep weekly backups for 4 weeks
        monthly: 6   // Keep monthly backups for 6 months
      },
      include: [
        'sessions/**',
        'broadcasts/**',
        'locks/**',
        'global-state.json',
        'ai-learning.json',
        'response-cache/**',
        'conversation-logs/**',
        'realtime-status.json'
      ],
      exclude: [
        'node_modules/**',
        'temp/**',
        '*.tmp',
        '*.log'
      ]
    };
  }

  /**
   * 💾 Save configuration
   */
  saveConfig() {
    try {
      fs.writeFileSync(this.configFile, JSON.stringify(this.config, null, 2));
    } catch (error) {
      console.warn('⚠️ Error saving backup config:', error.message);
    }
  }

  /**
   * 📦 Create full backup
   */
  async createBackup(options = {}) {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const backupName = options.name || `backup-${timestamp}`;
    const backupPath = path.join(this.backupDir, `${backupName}.json`);
    
    console.log(`💾 Creating backup: ${backupName}`);
    
    try {
      const backupData = await this.gatherBackupData();
      const metadata = this.createBackupMetadata(backupName, options);
      
      const fullBackup = {
        metadata,
        data: backupData
      };
      
      // Apply compression if enabled
      let finalData = fullBackup;
      if (this.config.compression.enabled) {
        finalData = await this.compressData(fullBackup);
      }
      
      // Apply encryption if enabled
      if (this.config.encryption.enabled) {
        finalData = await this.encryptData(finalData, options.password);
      }
      
      fs.writeFileSync(backupPath, JSON.stringify(finalData, null, 2));
      
      // Update backup index
      await this.updateBackupIndex(metadata);
      
      // Clean up old backups
      await this.cleanupOldBackups();
      
      console.log(`✅ Backup created successfully: ${backupName}`);
      return backupName;
      
    } catch (error) {
      console.error('❌ Backup failed:', error.message);
      throw error;
    }
  }

  /**
   * 🗂️ Gather all data for backup
   */
  async gatherBackupData() {
    const data = {};
    
    // Gather coordination files
    const filesToBackup = [
      'sessions',
      'broadcasts', 
      'locks',
      'response-cache',
      'conversation-logs'
    ];
    
    for (const dir of filesToBackup) {
      const dirPath = path.join(this.coordinationDir, dir);
      if (fs.existsSync(dirPath)) {
        data[dir] = await this.readDirectoryRecursively(dirPath);
      }
    }
    
    // Gather individual files
    const individualFiles = [
      'global-state.json',
      'ai-learning.json',
      'realtime-status.json',
      'backup-config.json'
    ];
    
    for (const file of individualFiles) {
      const filePath = path.join(this.coordinationDir, file);
      if (fs.existsSync(filePath)) {
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          data[file] = file.endsWith('.json') ? JSON.parse(content) : content;
        } catch (error) {
          console.warn(`⚠️ Error reading ${file}:`, error.message);
        }
      }
    }
    
    // Gather project metadata
    data.projectMetadata = await this.gatherProjectMetadata();
    
    return data;
  }

  /**
   * 📁 Read directory recursively
   */
  async readDirectoryRecursively(dirPath) {
    const result = {};
    
    try {
      const items = fs.readdirSync(dirPath);
      
      for (const item of items) {
        const itemPath = path.join(dirPath, item);
        const stats = fs.statSync(itemPath);
        
        if (stats.isDirectory()) {
          result[item] = await this.readDirectoryRecursively(itemPath);
        } else {
          try {
            const content = fs.readFileSync(itemPath, 'utf8');
            result[item] = {
              content: item.endsWith('.json') ? JSON.parse(content) : content,
              modified: stats.mtime.toISOString(),
              size: stats.size
            };
          } catch (error) {
            console.warn(`⚠️ Error reading file ${itemPath}:`, error.message);
          }
        }
      }
    } catch (error) {
      console.warn(`⚠️ Error reading directory ${dirPath}:`, error.message);
    }
    
    return result;
  }

  /**
   * 📊 Gather project metadata
   */
  async gatherProjectMetadata() {
    const metadata = {
      projectName: path.basename(this.projectPath),
      projectPath: this.projectPath,
      backupTime: Date.now()
    };
    
    // Git information
    try {
      metadata.git = {
        branch: execSync('git rev-parse --abbrev-ref HEAD', { cwd: this.projectPath }).toString().trim(),
        commit: execSync('git rev-parse HEAD', { cwd: this.projectPath }).toString().trim(),
        status: execSync('git status --porcelain', { cwd: this.projectPath }).toString().trim()
      };
    } catch (error) {
      metadata.git = { error: 'Not a git repository or git not available' };
    }
    
    // Package.json information
    const packageJsonPath = path.join(this.projectPath, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      try {
        metadata.package = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
      } catch (error) {
        metadata.package = { error: 'Error reading package.json' };
      }
    }
    
    // System information
    metadata.system = {
      platform: process.platform,
      nodeVersion: process.version,
      timestamp: new Date().toISOString()
    };
    
    return metadata;
  }

  /**
   * 📝 Create backup metadata
   */
  createBackupMetadata(backupName, options = {}) {
    return {
      name: backupName,
      timestamp: Date.now(),
      version: '1.0.0',
      type: options.type || 'full',
      description: options.description || 'Automated backup',
      projectPath: this.projectPath,
      compressed: this.config.compression.enabled,
      encrypted: this.config.encryption.enabled,
      size: 0, // Will be updated after creation
      hash: '', // Will be updated after creation
      tags: options.tags || []
    };
  }

  /**
   * 🗜️ Compress backup data
   */
  async compressData(data) {
    // For now, just return the data
    // In a production system, you'd use zlib or similar
    console.log('🗜️ Compression applied (simulated)');
    return {
      compressed: true,
      data: data
    };
  }

  /**
   * 🔐 Encrypt backup data
   */
  async encryptData(data, password) {
    if (!password) {
      throw new Error('Password required for encryption');
    }
    
    // Simple encryption simulation
    // In production, use proper encryption libraries
    console.log('🔐 Encryption applied (simulated)');
    return {
      encrypted: true,
      data: Buffer.from(JSON.stringify(data)).toString('base64')
    };
  }

  /**
   * 📋 Update backup index
   */
  async updateBackupIndex(metadata) {
    const indexPath = path.join(this.backupDir, 'backup-index.json');
    let index = { backups: [] };
    
    try {
      if (fs.existsSync(indexPath)) {
        index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
      }
    } catch (error) {
      console.warn('⚠️ Error loading backup index:', error.message);
    }
    
    // Add new backup to index
    index.backups.unshift(metadata);
    
    // Keep only the most recent backups in index
    index.backups = index.backups.slice(0, 100);
    
    fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));
  }

  /**
   * 🧹 Clean up old backups
   */
  async cleanupOldBackups() {
    const indexPath = path.join(this.backupDir, 'backup-index.json');
    
    try {
      if (!fs.existsSync(indexPath)) return;
      
      const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
      const now = Date.now();
      
      const retentionPeriods = {
        daily: 24 * 60 * 60 * 1000,
        weekly: 7 * 24 * 60 * 60 * 1000,
        monthly: 30 * 24 * 60 * 60 * 1000
      };
      
      const backupsToKeep = new Set();
      
      // Keep backups based on retention policy
      for (const [period, count] of Object.entries(this.config.retention)) {
        const periodMs = retentionPeriods[period];
        if (!periodMs) continue;
        
        const backupsInPeriod = index.backups
          .filter(backup => (now - backup.timestamp) < (periodMs * count))
          .slice(0, count);
        
        backupsInPeriod.forEach(backup => backupsToKeep.add(backup.name));
      }
      
      // Always keep the most recent backup
      if (index.backups.length > 0) {
        backupsToKeep.add(index.backups[0].name);
      }
      
      // Remove old backups
      const backupsToRemove = index.backups.filter(backup => !backupsToKeep.has(backup.name));
      
      for (const backup of backupsToRemove) {
        const backupFile = path.join(this.backupDir, `${backup.name}.json`);
        try {
          if (fs.existsSync(backupFile)) {
            fs.unlinkSync(backupFile);
            console.log(`🗑️ Removed old backup: ${backup.name}`);
          }
        } catch (error) {
          console.warn(`⚠️ Error removing backup ${backup.name}:`, error.message);
        }
      }
      
      // Update index
      index.backups = index.backups.filter(backup => backupsToKeep.has(backup.name));
      fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));
      
    } catch (error) {
      console.warn('⚠️ Error during backup cleanup:', error.message);
    }
  }

  /**
   * 🔄 Restore from backup
   */
  async restoreBackup(backupName, options = {}) {
    const backupPath = path.join(this.backupDir, `${backupName}.json`);
    
    if (!fs.existsSync(backupPath)) {
      throw new Error(`Backup not found: ${backupName}`);
    }
    
    console.log(`🔄 Restoring backup: ${backupName}`);
    
    try {
      // Create backup of current state before restore
      if (!options.skipCurrentBackup) {
        await this.createBackup({
          name: `pre-restore-${Date.now()}`,
          type: 'pre-restore',
          description: `Backup before restoring ${backupName}`
        });
      }
      
      // Load backup data
      let backupData = JSON.parse(fs.readFileSync(backupPath, 'utf8'));
      
      // Decrypt if needed
      if (backupData.encrypted) {
        backupData = await this.decryptData(backupData, options.password);
      }
      
      // Decompress if needed
      if (backupData.compressed) {
        backupData = await this.decompressData(backupData);
      }
      
      // Restore data
      await this.restoreData(backupData.data, options);
      
      console.log(`✅ Backup restored successfully: ${backupName}`);
      
    } catch (error) {
      console.error('❌ Restore failed:', error.message);
      throw error;
    }
  }

  /**
   * 🔓 Decrypt backup data
   */
  async decryptData(data, password) {
    if (!password) {
      throw new Error('Password required for decryption');
    }
    
    // Decrypt simulation
    console.log('🔓 Decryption applied (simulated)');
    const decryptedString = Buffer.from(data.data, 'base64').toString();
    return JSON.parse(decryptedString);
  }

  /**
   * 🗜️ Decompress backup data
   */
  async decompressData(data) {
    console.log('🗜️ Decompression applied (simulated)');
    return data.data;
  }

  /**
   * 🔄 Restore data to file system
   */
  async restoreData(data, options = {}) {
    // Restore directories
    for (const [dirName, dirData] of Object.entries(data)) {
      if (typeof dirData === 'object' && dirData !== null && !Array.isArray(dirData)) {
        if (dirName.endsWith('.json')) {
          // Individual file
          const filePath = path.join(this.coordinationDir, dirName);
          await this.ensureDirectoryExists(path.dirname(filePath));
          fs.writeFileSync(filePath, JSON.stringify(dirData, null, 2));
          console.log(`📄 Restored file: ${dirName}`);
        } else if (dirName !== 'projectMetadata') {
          // Directory
          const dirPath = path.join(this.coordinationDir, dirName);
          await this.restoreDirectory(dirPath, dirData);
        }
      }
    }
  }

  /**
   * 📁 Restore directory structure
   */
  async restoreDirectory(dirPath, dirData) {
    await this.ensureDirectoryExists(dirPath);
    
    for (const [itemName, itemData] of Object.entries(dirData)) {
      const itemPath = path.join(dirPath, itemName);
      
      if (typeof itemData === 'object' && itemData.content !== undefined) {
        // File with metadata
        const content = typeof itemData.content === 'string' 
          ? itemData.content 
          : JSON.stringify(itemData.content, null, 2);
        
        fs.writeFileSync(itemPath, content);
        console.log(`📄 Restored: ${path.relative(this.coordinationDir, itemPath)}`);
        
      } else if (typeof itemData === 'object') {
        // Subdirectory
        await this.restoreDirectory(itemPath, itemData);
      }
    }
  }

  /**
   * 🗂️ Ensure directory exists
   */
  async ensureDirectoryExists(dirPath) {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  /**
   * 📋 List available backups
   */
  listBackups() {
    const indexPath = path.join(this.backupDir, 'backup-index.json');
    
    try {
      if (fs.existsSync(indexPath)) {
        const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
        return index.backups.map(backup => ({
          name: backup.name,
          timestamp: backup.timestamp,
          date: new Date(backup.timestamp).toISOString(),
          type: backup.type,
          description: backup.description,
          size: backup.size,
          compressed: backup.compressed,
          encrypted: backup.encrypted
        }));
      }
    } catch (error) {
      console.warn('⚠️ Error loading backup list:', error.message);
    }
    
    return [];
  }

  /**
   * 🗑️ Delete backup
   */
  async deleteBackup(backupName) {
    const backupPath = path.join(this.backupDir, `${backupName}.json`);
    
    if (fs.existsSync(backupPath)) {
      fs.unlinkSync(backupPath);
      
      // Update index
      const indexPath = path.join(this.backupDir, 'backup-index.json');
      try {
        const index = JSON.parse(fs.readFileSync(indexPath, 'utf8'));
        index.backups = index.backups.filter(backup => backup.name !== backupName);
        fs.writeFileSync(indexPath, JSON.stringify(index, null, 2));
      } catch (error) {
        console.warn('⚠️ Error updating backup index:', error.message);
      }
      
      console.log(`🗑️ Backup deleted: ${backupName}`);
    } else {
      console.log(`❓ Backup not found: ${backupName}`);
    }
  }

  /**
   * ⚙️ Configure backup settings
   */
  configure(settings) {
    this.config = { ...this.config, ...settings };
    this.saveConfig();
    console.log('⚙️ Backup configuration updated');
  }

  /**
   * 📊 Get backup statistics
   */
  getStats() {
    const backups = this.listBackups();
    const totalSize = backups.reduce((sum, backup) => sum + (backup.size || 0), 0);
    
    return {
      totalBackups: backups.length,
      totalSize: Math.round(totalSize / 1024), // KB
      oldestBackup: backups.length > 0 ? backups[backups.length - 1].date : null,
      newestBackup: backups.length > 0 ? backups[0].date : null,
      encryptedBackups: backups.filter(b => b.encrypted).length,
      compressedBackups: backups.filter(b => b.compressed).length
    };
  }
}

// CLI Interface
if (require.main === module) {
  const backup = new BackupRestoreSystem();
  const command = process.argv[2];
  
  async function runCommand() {
    switch (command) {
      case 'create':
        const backupName = await backup.createBackup({
          name: process.argv[3],
          description: process.argv[4]
        });
        console.log(`✅ Created backup: ${backupName}`);
        break;
        
      case 'restore':
        const restoreName = process.argv[3];
        if (!restoreName) {
          console.log('❓ Please specify backup name to restore');
          return;
        }
        await backup.restoreBackup(restoreName);
        break;
        
      case 'list':
        const backups = backup.listBackups();
        console.log('📋 Available backups:');
        backups.forEach(b => {
          console.log(`   ${b.name} - ${b.date} (${b.type})`);
          console.log(`      ${b.description}`);
        });
        break;
        
      case 'delete':
        const deleteName = process.argv[3];
        if (!deleteName) {
          console.log('❓ Please specify backup name to delete');
          return;
        }
        await backup.deleteBackup(deleteName);
        break;
        
      case 'stats':
        const stats = backup.getStats();
        console.log('📊 Backup Statistics:');
        console.log(`   Total Backups: ${stats.totalBackups}`);
        console.log(`   Total Size: ${stats.totalSize}KB`);
        console.log(`   Encrypted: ${stats.encryptedBackups}`);
        console.log(`   Compressed: ${stats.compressedBackups}`);
        console.log(`   Oldest: ${stats.oldestBackup || 'None'}`);
        console.log(`   Newest: ${stats.newestBackup || 'None'}`);
        break;
        
      default:
        console.log(`
💾 Backup & Restore System

Usage: node backup-restore-system.js [command] [options]

Commands:
  create [name] [description]    Create a new backup
  restore <name>                 Restore from backup
  list                          List available backups
  delete <name>                 Delete a backup
  stats                         Show backup statistics

Examples:
  node backup-restore-system.js create "before-deploy" "Backup before deployment"
  node backup-restore-system.js restore backup-2024-01-15
  node backup-restore-system.js list
  node backup-restore-system.js stats
`);
    }
  }
  
  runCommand().catch(error => {
    console.error('❌ Error:', error.message);
    process.exit(1);
  });
}

module.exports = BackupRestoreSystem;