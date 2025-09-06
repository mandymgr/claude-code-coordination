/**
 * 🚀 Smart Response Cache System
 * Intelligent caching of AI responses with context-aware hashing and TTL
 */
export interface CacheEntry {
    key: string;
    data: any;
    timestamp: number;
    ttl: number;
    context?: Record<string, any>;
    accessCount: number;
    lastAccessed: number;
    size: number;
}
export interface CacheMetadata {
    totalEntries: number;
    totalSize: number;
    hitRate: number;
    missRate: number;
    lastCleanup: number;
    settings: CacheSettings;
}
export interface CacheSettings {
    maxCacheSize: number;
    defaultTTL: number;
    cleanupInterval: number;
    compressionEnabled: boolean;
    contextSensitive: boolean;
}
export interface CacheStats {
    hits: number;
    misses: number;
    evictions: number;
    totalRequests: number;
    averageResponseTime: number;
}
export declare class SmartResponseCache {
    private projectPath;
    private cacheDir;
    private metadataFile;
    private maxCacheSize;
    private defaultTTL;
    private metadata;
    private stats;
    private cleanupInterval;
    constructor(projectPath?: string);
    /**
     * 🗂️ Ensure cache directory exists
     */
    private ensureCacheDirectory;
    /**
     * 💾 Get cached response
     */
    get(key: string, context?: Record<string, any>): Promise<any | null>;
    /**
     * 💾 Set cached response
     */
    set(key: string, data: any, context?: Record<string, any>, ttl?: number): Promise<void>;
    /**
     * 🗑️ Delete cached entry
     */
    delete(cacheKey: string): Promise<void>;
    /**
     * 🧹 Clear all cache entries
     */
    clear(): Promise<void>;
    /**
     * 🎯 Generate context-aware cache key
     */
    private generateCacheKey;
    /**
     * 🔗 Serialize context for key generation
     */
    private serializeContext;
    /**
     * 🧼 Sanitize context for storage
     */
    private sanitizeContext;
    /**
     * ⏰ Check if cache entry has expired
     */
    private isExpired;
    /**
     * 🔄 Check if context is compatible
     */
    private isContextCompatible;
    /**
     * 🗑️ Evict least recently used entries
     */
    private evictLRU;
    /**
     * 🧹 Cleanup expired entries
     */
    cleanup(): Promise<void>;
    /**
     * 📊 Get cache statistics
     */
    getStats(): CacheStats & {
        hitRate: number;
        metadata: CacheMetadata;
    };
    /**
     * ⚙️ Update cache settings
     */
    updateSettings(settings: Partial<CacheSettings>): Promise<void>;
    /**
     * ⏰ Start automatic cleanup timer
     */
    private startCleanupTimer;
    /**
     * 🛑 Stop cleanup timer
     */
    stopCleanupTimer(): void;
    /**
     * 📊 Update statistics
     */
    private updateStats;
    /**
     * 💾 Load metadata
     */
    private loadMetadata;
    /**
     * 💾 Save metadata
     */
    private saveMetadata;
    /**
     * 📊 Load statistics
     */
    private loadStats;
    /**
     * 💾 Save statistics
     */
    saveStats(): Promise<void>;
    /**
     * 🔧 Destructor - cleanup on exit
     */
    destroy(): Promise<void>;
}
