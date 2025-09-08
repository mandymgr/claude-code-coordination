/**
 * 💾 Backup & Restore System
 * Comprehensive backup solution for coordination state, AI cache, and project metadata
 */

import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';
import { execSync } from 'child_process';

export interface BackupConfig {
  autoBackup: boolean;
  backupInterval: number; // minutes
  maxBackups: number;
  compressionEnabled: boolean;
  includePaths: string[];
  excludePaths: string[];
  encryptionEnabled: boolean;
}

export interface BackupMetadata {
  id: string;
  timestamp: number;
  type: BackupType;
  size: number;
  files: string[];
  checksum: string;
  version: string;
  description?: string;
}

export interface RestoreOptions {
  backupId: string;
  targetPath?: string;
  selective?: string[];
  overwrite?: boolean;
  dryRun?: boolean;
}

export interface BackupStats {
  totalBackups: number;
  totalSize: number;
  oldestBackup: number;
  newestBackup: number;
  averageSize: number;
}

export type BackupType = 'full' | 'incremental' | 'differential' | 'snapshot';

export interface BackupJob {
  id: string;
  type: BackupType;
  status: 'pending' | 'running' | 'completed' | 'failed';
  startTime: number;
  endTime?: number;
  progress: number;
  error?: string;
}

export class BackupRestoreSystem {
  private projectPath: string;
  private coordinationDir: string;
  private backupDir: string;
  private configFile: string;
  private metadataFile: string;
  private config: BackupConfig;
  private backupTimer: NodeJS.Timeout | null = null;

  constructor(projectPath: string = process.cwd()) {
    this.projectPath = projectPath;
    this.coordinationDir = path.join(projectPath, '.claude-coordination');
    this.backupDir = path.join(this.coordinationDir, 'backups');
    this.configFile = path.join(this.coordinationDir, 'backup-config.json');
    this.metadataFile = path.join(this.backupDir, 'backup-metadata.json');
    this.config = this.loadConfig();
    
    this.ensureBackupDirectory();
    this.startAutoBackup();
  }

  /**
   * 🗂️ Ensure backup directory exists
   */
  private ensureBackupDirectory(): void {
    if (!fs.existsSync(this.backupDir)) {
      fs.mkdirSync(this.backupDir, { recursive: true });
    }
  }

  /**
   * 💾 Create backup
   */
  async createBackup(
    type: BackupType = 'full',
    description?: string
  ): Promise<BackupMetadata> {
    console.log(`💾 Starting ${type} backup...`);
    
    const backupId = this.generateBackupId();
    const job = this.createBackupJob(backupId, type);
    
    try {
      job.status = 'running';
      job.startTime = Date.now();

      const backupPath = path.join(this.backupDir, backupId);
      fs.mkdirSync(backupPath, { recursive: true });

      // Collect files to backup
      const filesToBackup = await this.collectFiles(type);
      job.progress = 10;

      // Create backup archive
      const archivePath = await this.createArchive(backupId, filesToBackup);
      job.progress = 70;

      // Generate metadata
      const metadata = await this.generateMetadata(backupId, type, archivePath, filesToBackup, description);
      job.progress = 90;

      // Save metadata
      await this.saveBackupMetadata(metadata);
      job.progress = 100;

      job.status = 'completed';
      job.endTime = Date.now();

      console.log(`✅ Backup completed: ${backupId}`);
      
      // Cleanup old backups if needed
      await this.cleanupOldBackups();

      return metadata;

    } catch (error) {
      job.status = 'failed';
      job.error = error instanceof Error ? error.message : 'Unknown error';
      job.endTime = Date.now();
      
      console.error('❌ Backup failed:', error);
      throw error;
    }
  }

  /**
   * 🔄 Restore from backup
   */
  async restoreBackup(options: RestoreOptions): Promise<void> {
    console.log(`🔄 Starting restore from backup: ${options.backupId}`);
    
    try {
      // Load backup metadata
      const metadata = await this.getBackupMetadata(options.backupId);
      if (!metadata) {
        throw new Error(`Backup not found: ${options.backupId}`);
      }

      if (options.dryRun) {
        console.log('🔍 Dry run - would restore:');
        metadata.files.forEach(file => console.log(`  📁 ${file}`));
        return;
      }

      const backupArchive = path.join(this.backupDir, options.backupId, 'backup.tar.gz');
      const targetPath = options.targetPath || this.coordinationDir;

      // Verify backup integrity
      await this.verifyBackupIntegrity(metadata, backupArchive);

      // Extract archive
      await this.extractArchive(backupArchive, targetPath, options.selective);

      console.log('✅ Restore completed successfully');

    } catch (error) {
      console.error('❌ Restore failed:', error);
      throw error;
    }
  }

  /**
   * 📊 Get backup statistics
   */
  async getBackupStats(): Promise<BackupStats> {
    const backups = await this.listBackups();
    
    if (backups.length === 0) {
      return {
        totalBackups: 0,
        totalSize: 0,
        oldestBackup: 0,
        newestBackup: 0,
        averageSize: 0
      };
    }

    const totalSize = backups.reduce((sum, backup) => sum + backup.size, 0);
    const timestamps = backups.map(backup => backup.timestamp);

    return {
      totalBackups: backups.length,
      totalSize,
      oldestBackup: Math.min(...timestamps),
      newestBackup: Math.max(...timestamps),
      averageSize: totalSize / backups.length
    };
  }

  /**
   * 📋 List available backups
   */
  async listBackups(): Promise<BackupMetadata[]> {
    try {
      if (!fs.existsSync(this.metadataFile)) {
        return [];
      }

      const data = fs.readFileSync(this.metadataFile, 'utf8');
      const backups: BackupMetadata[] = JSON.parse(data);
      
      // Sort by timestamp (newest first)
      return backups.sort((a, b) => b.timestamp - a.timestamp);

    } catch (error) {
      console.warn('Could not list backups:', error);
      return [];
    }
  }

  /**
   * 🗑️ Delete backup
   */
  async deleteBackup(backupId: string): Promise<void> {
    try {
      const backups = await this.listBackups();
      const backupIndex = backups.findIndex(b => b.id === backupId);
      
      if (backupIndex === -1) {
        throw new Error(`Backup not found: ${backupId}`);
      }

      // Remove backup files
      const backupPath = path.join(this.backupDir, backupId);
      if (fs.existsSync(backupPath)) {
        fs.rmSync(backupPath, { recursive: true });
      }

      // Remove from metadata
      backups.splice(backupIndex, 1);
      fs.writeFileSync(this.metadataFile, JSON.stringify(backups, null, 2));

      console.log(`🗑️ Backup deleted: ${backupId}`);

    } catch (error) {
      console.error('❌ Failed to delete backup:', error);
      throw error;
    }
  }

  /**
   * 🔧 Update configuration
   */
  async updateConfig(newConfig: Partial<BackupConfig>): Promise<void> {
    this.config = { ...this.config, ...newConfig };
    await this.saveConfig();
    
    // Restart auto backup if interval changed
    if (newConfig.autoBackup !== undefined || newConfig.backupInterval !== undefined) {
      this.stopAutoBackup();
      this.startAutoBackup();
    }
    
    console.log('⚙️ Backup configuration updated');
  }

  /**
   * 📁 Collect files for backup
   */
  private async collectFiles(type: BackupType): Promise<string[]> {
    const files: string[] = [];
    
    // Always include coordination state
    const coordinationFiles = [
      'team-optimization-state.json',
      'ai-learning.json',
      'user-profile.json',
      'optimization-sessions.json',
      'learning-data.json',
      'cache-metadata.json'
    ];

    for (const file of coordinationFiles) {
      const filePath = path.join(this.coordinationDir, file);
      if (fs.existsSync(filePath)) {
        files.push(filePath);
      }
    }

    // Include cache directory for full backups
    if (type === 'full') {
      const cacheDir = path.join(this.coordinationDir, 'response-cache');
      if (fs.existsSync(cacheDir)) {
        const cacheFiles = this.getAllFiles(cacheDir);
        files.push(...cacheFiles);
      }
    }

    // Include custom paths from config
    for (const includePath of this.config.includePaths) {
      const fullPath = path.resolve(this.projectPath, includePath);
      if (fs.existsSync(fullPath)) {
        if (fs.statSync(fullPath).isDirectory()) {
          files.push(...this.getAllFiles(fullPath));
        } else {
          files.push(fullPath);
        }
      }
    }

    // Filter out excluded paths
    return files.filter(file => !this.isExcluded(file));
  }

  /**
   * 📦 Create backup archive
   */
  private async createArchive(backupId: string, files: string[]): Promise<string> {
    const backupPath = path.join(this.backupDir, backupId);
    const archivePath = path.join(backupPath, 'backup.tar.gz');
    
    // Create file list for tar
    const fileListPath = path.join(backupPath, 'files.txt');
    const relativeFiles = files.map(file => path.relative(this.projectPath, file));
    fs.writeFileSync(fileListPath, relativeFiles.join('\n'));

    try {
      // Use tar to create compressed archive
      const command = `cd "${this.projectPath}" && tar -czf "${archivePath}" -T "${fileListPath}"`;
      execSync(command, { stdio: 'pipe' });
      
      // Remove temp file list
      fs.unlinkSync(fileListPath);
      
      return archivePath;
      
    } catch (error) {
      console.error('Archive creation failed:', error);
      throw new Error('Failed to create backup archive');
    }
  }

  /**
   * 📋 Generate backup metadata
   */
  private async generateMetadata(
    backupId: string,
    type: BackupType,
    archivePath: string,
    files: string[],
    description?: string
  ): Promise<BackupMetadata> {
    
    const stats = fs.statSync(archivePath);
    const checksum = await this.calculateChecksum(archivePath);
    
    return {
      id: backupId,
      timestamp: Date.now(),
      type,
      size: stats.size,
      files: files.map(file => path.relative(this.projectPath, file)),
      checksum,
      version: '1.0.0',
      description
    };
  }

  /**
   * 🔍 Verify backup integrity
   */
  private async verifyBackupIntegrity(metadata: BackupMetadata, archivePath: string): Promise<void> {
    if (!fs.existsSync(archivePath)) {
      throw new Error('Backup archive not found');
    }

    const currentChecksum = await this.calculateChecksum(archivePath);
    if (currentChecksum !== metadata.checksum) {
      throw new Error('Backup integrity check failed - checksum mismatch');
    }

    console.log('✅ Backup integrity verified');
  }

  /**
   * 📤 Extract backup archive
   */
  private async extractArchive(
    archivePath: string, 
    targetPath: string, 
    selective?: string[]
  ): Promise<void> {
    
    try {
      let command = `cd "${targetPath}" && tar -xzf "${archivePath}"`;
      
      if (selective && selective.length > 0) {
        // Extract only specific files
        command += ` ${selective.map(file => `"${file}"`).join(' ')}`;
      }
      
      execSync(command, { stdio: 'pipe' });
      
    } catch (error) {
      console.error('Archive extraction failed:', error);
      throw new Error('Failed to extract backup archive');
    }
  }

  /**
   * 🧹 Cleanup old backups
   */
  private async cleanupOldBackups(): Promise<void> {
    const backups = await this.listBackups();
    
    if (backups.length <= this.config.maxBackups) {
      return;
    }

    const backupsToDelete = backups.slice(this.config.maxBackups);
    
    for (const backup of backupsToDelete) {
      await this.deleteBackup(backup.id);
      console.log(`🧹 Cleaned up old backup: ${backup.id}`);
    }
  }

  /**
   * ⏰ Start automatic backup
   */
  private startAutoBackup(): void {
    if (!this.config.autoBackup) return;
    
    const intervalMs = this.config.backupInterval * 60 * 1000;
    
    this.backupTimer = setInterval(async () => {
      try {
        await this.createBackup('incremental', 'Automatic backup');
        console.log('🤖 Automatic backup completed');
      } catch (error) {
        console.error('🤖 Automatic backup failed:', error);
      }
    }, intervalMs);
    
    console.log(`⏰ Auto backup scheduled every ${this.config.backupInterval} minutes`);
  }

  /**
   * 🛑 Stop automatic backup
   */
  private stopAutoBackup(): void {
    if (this.backupTimer) {
      clearInterval(this.backupTimer);
      this.backupTimer = null;
    }
  }

  // Helper methods
  private generateBackupId(): string {
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const random = Math.random().toString(36).substring(2, 8);
    return `backup-${timestamp}-${random}`;
  }

  private createBackupJob(backupId: string, type: BackupType): BackupJob {
    return {
      id: backupId,
      type,
      status: 'pending',
      startTime: Date.now(),
      progress: 0
    };
  }

  private getAllFiles(dirPath: string): string[] {
    const files: string[] = [];
    
    const scanDir = (dir: string) => {
      const items = fs.readdirSync(dir);
      
      for (const item of items) {
        const itemPath = path.join(dir, item);
        const stat = fs.statSync(itemPath);
        
        if (stat.isDirectory()) {
          scanDir(itemPath);
        } else {
          files.push(itemPath);
        }
      }
    };
    
    scanDir(dirPath);
    return files;
  }

  private isExcluded(filePath: string): boolean {
    for (const excludePath of this.config.excludePaths) {
      const fullExcludePath = path.resolve(this.projectPath, excludePath);
      if (filePath.startsWith(fullExcludePath)) {
        return true;
      }
    }
    return false;
  }

  private async calculateChecksum(filePath: string): Promise<string> {
    return new Promise((resolve, reject) => {
      const hash = crypto.createHash('sha256');
      const stream = fs.createReadStream(filePath);
      
      stream.on('data', data => hash.update(data));
      stream.on('end', () => resolve(hash.digest('hex')));
      stream.on('error', reject);
    });
  }

  private async getBackupMetadata(backupId: string): Promise<BackupMetadata | null> {
    const backups = await this.listBackups();
    return backups.find(backup => backup.id === backupId) || null;
  }

  private async saveBackupMetadata(metadata: BackupMetadata): Promise<void> {
    const backups = await this.listBackups();
    backups.push(metadata);
    fs.writeFileSync(this.metadataFile, JSON.stringify(backups, null, 2));
  }

  /**
   * 🔧 Load configuration
   */
  private loadConfig(): BackupConfig {
    try {
      if (fs.existsSync(this.configFile)) {
        const data = fs.readFileSync(this.configFile, 'utf8');
        return { ...this.getDefaultConfig(), ...JSON.parse(data) };
      }
    } catch (error) {
      console.warn('Could not load backup config:', error);
    }
    
    return this.getDefaultConfig();
  }

  /**
   * 💾 Save configuration
   */
  private async saveConfig(): Promise<void> {
    try {
      if (!fs.existsSync(this.coordinationDir)) {
        fs.mkdirSync(this.coordinationDir, { recursive: true });
      }
      
      fs.writeFileSync(this.configFile, JSON.stringify(this.config, null, 2));
    } catch (error) {
      console.warn('Could not save backup config:', error);
    }
  }

  /**
   * ⚙️ Get default configuration
   */
  private getDefaultConfig(): BackupConfig {
    return {
      autoBackup: true,
      backupInterval: 60, // 1 hour
      maxBackups: 10,
      compressionEnabled: true,
      includePaths: [
        '.claude-coordination'
      ],
      excludePaths: [
        'node_modules',
        '.git',
        'dist',
        'build',
        'coverage'
      ],
      encryptionEnabled: false
    };
  }

  /**
   * 🔧 Cleanup on destroy
   */
  destroy(): void {
    this.stopAutoBackup();
  }
}