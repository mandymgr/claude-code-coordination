/**
 * 💾 Backup & Restore System
 * Comprehensive backup solution for coordination state, AI cache, and project metadata
 */
export interface BackupConfig {
    autoBackup: boolean;
    backupInterval: number;
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
export declare class BackupRestoreSystem {
    private projectPath;
    private coordinationDir;
    private backupDir;
    private configFile;
    private metadataFile;
    private config;
    private backupTimer;
    constructor(projectPath?: string);
    /**
     * 🗂️ Ensure backup directory exists
     */
    private ensureBackupDirectory;
    /**
     * 💾 Create backup
     */
    createBackup(type?: BackupType, description?: string): Promise<BackupMetadata>;
    /**
     * 🔄 Restore from backup
     */
    restoreBackup(options: RestoreOptions): Promise<void>;
    /**
     * 📊 Get backup statistics
     */
    getBackupStats(): Promise<BackupStats>;
    /**
     * 📋 List available backups
     */
    listBackups(): Promise<BackupMetadata[]>;
    /**
     * 🗑️ Delete backup
     */
    deleteBackup(backupId: string): Promise<void>;
    /**
     * 🔧 Update configuration
     */
    updateConfig(newConfig: Partial<BackupConfig>): Promise<void>;
    /**
     * 📁 Collect files for backup
     */
    private collectFiles;
    /**
     * 📦 Create backup archive
     */
    private createArchive;
    /**
     * 📋 Generate backup metadata
     */
    private generateMetadata;
    /**
     * 🔍 Verify backup integrity
     */
    private verifyBackupIntegrity;
    /**
     * 📤 Extract backup archive
     */
    private extractArchive;
    /**
     * 🧹 Cleanup old backups
     */
    private cleanupOldBackups;
    /**
     * ⏰ Start automatic backup
     */
    private startAutoBackup;
    /**
     * 🛑 Stop automatic backup
     */
    private stopAutoBackup;
    private generateBackupId;
    private createBackupJob;
    private getAllFiles;
    private isExcluded;
    private calculateChecksum;
    private getBackupMetadata;
    private saveBackupMetadata;
    /**
     * 🔧 Load configuration
     */
    private loadConfig;
    /**
     * 💾 Save configuration
     */
    private saveConfig;
    /**
     * ⚙️ Get default configuration
     */
    private getDefaultConfig;
    /**
     * 🔧 Cleanup on destroy
     */
    destroy(): void;
}
//# sourceMappingURL=BackupRestoreSystem.d.ts.map