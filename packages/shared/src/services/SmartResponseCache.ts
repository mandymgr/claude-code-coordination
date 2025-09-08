/**
 * 🚀 Smart Response Cache System
 * Intelligent caching of AI responses with context-aware hashing and TTL
 */

import * as fs from 'fs';
import * as path from 'path';
import * as crypto from 'crypto';

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

export class SmartResponseCache {
  private projectPath: string;
  private cacheDir: string;
  private metadataFile: string;
  private maxCacheSize: number;
  private defaultTTL: number;
  private metadata: CacheMetadata;
  private stats: CacheStats;
  private cleanupInterval: NodeJS.Timeout | null = null;

  constructor(projectPath: string = process.cwd()) {
    this.projectPath = projectPath;
    this.cacheDir = path.join(projectPath, '.claude-coordination', 'response-cache');
    this.metadataFile = path.join(this.cacheDir, 'cache-metadata.json');
    this.maxCacheSize = 100 * 1024 * 1024; // 100MB max cache size
    this.defaultTTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    
    this.ensureCacheDirectory();
    this.metadata = this.loadMetadata();
    this.stats = this.loadStats();
    this.startCleanupTimer();
  }

  /**
   * 🗂️ Ensure cache directory exists
   */
  private ensureCacheDirectory(): void {
    if (!fs.existsSync(this.cacheDir)) {
      fs.mkdirSync(this.cacheDir, { recursive: true });
    }
  }

  /**
   * 💾 Get cached response
   */
  async get(key: string, context?: Record<string, any>): Promise<any | null> {
    const startTime = Date.now();
    
    try {
      const cacheKey = this.generateCacheKey(key, context);
      const cacheFile = path.join(this.cacheDir, `${cacheKey}.json`);
      
      if (!fs.existsSync(cacheFile)) {
        this.stats.misses++;
        this.updateStats(startTime);
        return null;
      }

      const entry: CacheEntry = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
      
      // Check if entry has expired
      if (this.isExpired(entry)) {
        await this.delete(cacheKey);
        this.stats.misses++;
        this.updateStats(startTime);
        return null;
      }

      // Check context compatibility if context-sensitive
      if (this.metadata.settings.contextSensitive && !this.isContextCompatible(entry.context, context)) {
        this.stats.misses++;
        this.updateStats(startTime);
        return null;
      }

      // Update access statistics
      entry.accessCount++;
      entry.lastAccessed = Date.now();
      fs.writeFileSync(cacheFile, JSON.stringify(entry, null, 2));

      this.stats.hits++;
      this.updateStats(startTime);
      
      console.log(`⚡ Cache hit for key: ${key.substring(0, 50)}...`);
      return entry.data;

    } catch (error) {
      console.warn('Cache get error:', error);
      this.stats.misses++;
      this.updateStats(startTime);
      return null;
    }
  }

  /**
   * 💾 Set cached response
   */
  async set(key: string, data: any, context?: Record<string, any>, ttl?: number): Promise<void> {
    try {
      const cacheKey = this.generateCacheKey(key, context);
      const cacheFile = path.join(this.cacheDir, `${cacheKey}.json`);
      
      const serializedData = JSON.stringify(data);
      const size = Buffer.byteLength(serializedData, 'utf8');
      
      // Check if adding this entry would exceed cache size limit
      if (this.metadata.totalSize + size > this.maxCacheSize) {
        await this.evictLRU(size);
      }

      const entry: CacheEntry = {
        key: cacheKey,
        data,
        timestamp: Date.now(),
        ttl: ttl || this.defaultTTL,
        context: this.sanitizeContext(context),
        accessCount: 1,
        lastAccessed: Date.now(),
        size
      };

      fs.writeFileSync(cacheFile, JSON.stringify(entry, null, 2));
      
      this.metadata.totalEntries++;
      this.metadata.totalSize += size;
      await this.saveMetadata();
      
      console.log(`💾 Cached response for key: ${key.substring(0, 50)}...`);
      
    } catch (error) {
      console.warn('Cache set error:', error);
    }
  }

  /**
   * 🗑️ Delete cached entry
   */
  async delete(cacheKey: string): Promise<void> {
    try {
      const cacheFile = path.join(this.cacheDir, `${cacheKey}.json`);
      
      if (fs.existsSync(cacheFile)) {
        const entry: CacheEntry = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
        fs.unlinkSync(cacheFile);
        
        this.metadata.totalEntries--;
        this.metadata.totalSize -= entry.size;
        this.stats.evictions++;
      }
    } catch (error) {
      console.warn('Cache delete error:', error);
    }
  }

  /**
   * 🧹 Clear all cache entries
   */
  async clear(): Promise<void> {
    try {
      const files = fs.readdirSync(this.cacheDir);
      
      for (const file of files) {
        if (file.endsWith('.json') && file !== 'cache-metadata.json' && file !== 'cache-stats.json') {
          fs.unlinkSync(path.join(this.cacheDir, file));
        }
      }
      
      this.metadata.totalEntries = 0;
      this.metadata.totalSize = 0;
      await this.saveMetadata();
      
      console.log('🧹 Cache cleared successfully');
      
    } catch (error) {
      console.warn('Cache clear error:', error);
    }
  }

  /**
   * 🎯 Generate context-aware cache key
   */
  private generateCacheKey(key: string, context?: Record<string, any>): string {
    let keyContent = key;
    
    if (context && this.metadata.settings.contextSensitive) {
      // Include relevant context in key generation
      const contextString = this.serializeContext(context);
      keyContent += contextString;
    }
    
    return crypto.createHash('sha256').update(keyContent).digest('hex');
  }

  /**
   * 🔗 Serialize context for key generation
   */
  private serializeContext(context: Record<string, any>): string {
    // Only include context fields that affect caching
    const relevantContext = {
      projectType: context.projectType,
      currentFile: context.currentFile ? path.extname(context.currentFile) : undefined,
      // Add more relevant context fields as needed
    };
    
    return JSON.stringify(relevantContext, Object.keys(relevantContext).sort());
  }

  /**
   * 🧼 Sanitize context for storage
   */
  private sanitizeContext(context?: Record<string, any>): Record<string, any> | undefined {
    if (!context) return undefined;
    
    // Remove sensitive or large context data
    const sanitized: Record<string, any> = {};
    const allowedFields = ['projectType', 'skillLevel', 'language'];
    
    for (const field of allowedFields) {
      if (context[field]) {
        sanitized[field] = context[field];
      }
    }
    
    return Object.keys(sanitized).length > 0 ? sanitized : undefined;
  }

  /**
   * ⏰ Check if cache entry has expired
   */
  private isExpired(entry: CacheEntry): boolean {
    return Date.now() - entry.timestamp > entry.ttl;
  }

  /**
   * 🔄 Check if context is compatible
   */
  private isContextCompatible(entryContext?: Record<string, any>, requestContext?: Record<string, any>): boolean {
    if (!entryContext && !requestContext) return true;
    if (!entryContext || !requestContext) return false;
    
    // Check if key context fields match
    const criticalFields = ['projectType', 'skillLevel'];
    
    for (const field of criticalFields) {
      if (entryContext[field] !== requestContext[field]) {
        return false;
      }
    }
    
    return true;
  }

  /**
   * 🗑️ Evict least recently used entries
   */
  private async evictLRU(requiredSpace: number): Promise<void> {
    console.log('🗑️ Evicting LRU entries to make space...');
    
    try {
      const files = fs.readdirSync(this.cacheDir);
      const entries: { file: string; entry: CacheEntry }[] = [];
      
      // Load all entries with their access times
      for (const file of files) {
        if (file.endsWith('.json') && file !== 'cache-metadata.json' && file !== 'cache-stats.json') {
          try {
            const entry: CacheEntry = JSON.parse(fs.readFileSync(path.join(this.cacheDir, file), 'utf8'));
            entries.push({ file, entry });
          } catch (error) {
            // Remove corrupted files
            fs.unlinkSync(path.join(this.cacheDir, file));
          }
        }
      }
      
      // Sort by last accessed time (ascending - oldest first)
      entries.sort((a, b) => a.entry.lastAccessed - b.entry.lastAccessed);
      
      let freedSpace = 0;
      
      for (const { file, entry } of entries) {
        if (freedSpace >= requiredSpace) break;
        
        await this.delete(entry.key);
        freedSpace += entry.size;
        
        console.log(`🗑️ Evicted cache entry: ${entry.key.substring(0, 20)}...`);
      }
      
    } catch (error) {
      console.warn('LRU eviction error:', error);
    }
  }

  /**
   * 🧹 Cleanup expired entries
   */
  async cleanup(): Promise<void> {
    console.log('🧹 Starting cache cleanup...');
    
    try {
      const files = fs.readdirSync(this.cacheDir);
      let removedCount = 0;
      let freedSpace = 0;
      
      for (const file of files) {
        if (file.endsWith('.json') && file !== 'cache-metadata.json' && file !== 'cache-stats.json') {
          try {
            const filePath = path.join(this.cacheDir, file);
            const entry: CacheEntry = JSON.parse(fs.readFileSync(filePath, 'utf8'));
            
            if (this.isExpired(entry)) {
              fs.unlinkSync(filePath);
              this.metadata.totalEntries--;
              this.metadata.totalSize -= entry.size;
              freedSpace += entry.size;
              removedCount++;
            }
          } catch (error) {
            // Remove corrupted files
            fs.unlinkSync(path.join(this.cacheDir, file));
            removedCount++;
          }
        }
      }
      
      this.metadata.lastCleanup = Date.now();
      await this.saveMetadata();
      
      console.log(`🧹 Cleanup complete: removed ${removedCount} entries, freed ${Math.round(freedSpace / 1024)}KB`);
      
    } catch (error) {
      console.warn('Cache cleanup error:', error);
    }
  }

  /**
   * 📊 Get cache statistics
   */
  getStats(): CacheStats & { hitRate: number; metadata: CacheMetadata } {
    const totalRequests = this.stats.hits + this.stats.misses;
    const hitRate = totalRequests > 0 ? this.stats.hits / totalRequests : 0;
    
    return {
      ...this.stats,
      hitRate,
      metadata: this.metadata
    };
  }

  /**
   * ⚙️ Update cache settings
   */
  async updateSettings(settings: Partial<CacheSettings>): Promise<void> {
    this.metadata.settings = { ...this.metadata.settings, ...settings };
    
    if (settings.maxCacheSize && settings.maxCacheSize !== this.maxCacheSize) {
      this.maxCacheSize = settings.maxCacheSize;
      
      // If new limit is smaller, trigger eviction
      if (this.metadata.totalSize > this.maxCacheSize) {
        await this.evictLRU(this.metadata.totalSize - this.maxCacheSize);
      }
    }
    
    if (settings.defaultTTL) {
      this.defaultTTL = settings.defaultTTL;
    }
    
    await this.saveMetadata();
    console.log('⚙️ Cache settings updated');
  }

  /**
   * ⏰ Start automatic cleanup timer
   */
  private startCleanupTimer(): void {
    const interval = this.metadata.settings.cleanupInterval || 60 * 60 * 1000; // 1 hour default
    
    this.cleanupInterval = setInterval(async () => {
      await this.cleanup();
    }, interval);
  }

  /**
   * 🛑 Stop cleanup timer
   */
  stopCleanupTimer(): void {
    if (this.cleanupInterval) {
      clearInterval(this.cleanupInterval);
      this.cleanupInterval = null;
    }
  }

  /**
   * 📊 Update statistics
   */
  private updateStats(startTime: number): void {
    this.stats.totalRequests++;
    
    const responseTime = Date.now() - startTime;
    this.stats.averageResponseTime = 
      (this.stats.averageResponseTime * (this.stats.totalRequests - 1) + responseTime) / this.stats.totalRequests;
    
    // Update hit/miss rates in metadata
    this.metadata.hitRate = this.stats.hits / this.stats.totalRequests;
    this.metadata.missRate = this.stats.misses / this.stats.totalRequests;
  }

  /**
   * 💾 Load metadata
   */
  private loadMetadata(): CacheMetadata {
    try {
      if (fs.existsSync(this.metadataFile)) {
        const data = fs.readFileSync(this.metadataFile, 'utf8');
        return JSON.parse(data);
      }
    } catch (error) {
      console.warn('Could not load cache metadata:', error);
    }
    
    return {
      totalEntries: 0,
      totalSize: 0,
      hitRate: 0,
      missRate: 0,
      lastCleanup: Date.now(),
      settings: {
        maxCacheSize: this.maxCacheSize,
        defaultTTL: this.defaultTTL,
        cleanupInterval: 60 * 60 * 1000,
        compressionEnabled: false,
        contextSensitive: true
      }
    };
  }

  /**
   * 💾 Save metadata
   */
  private async saveMetadata(): Promise<void> {
    try {
      fs.writeFileSync(this.metadataFile, JSON.stringify(this.metadata, null, 2));
    } catch (error) {
      console.warn('Could not save cache metadata:', error);
    }
  }

  /**
   * 📊 Load statistics
   */
  private loadStats(): CacheStats {
    try {
      const statsFile = path.join(this.cacheDir, 'cache-stats.json');
      if (fs.existsSync(statsFile)) {
        const data = fs.readFileSync(statsFile, 'utf8');
        return JSON.parse(data);
      }
    } catch (error) {
      console.warn('Could not load cache stats:', error);
    }
    
    return {
      hits: 0,
      misses: 0,
      evictions: 0,
      totalRequests: 0,
      averageResponseTime: 0
    };
  }

  /**
   * 💾 Save statistics
   */
  async saveStats(): Promise<void> {
    try {
      const statsFile = path.join(this.cacheDir, 'cache-stats.json');
      fs.writeFileSync(statsFile, JSON.stringify(this.stats, null, 2));
    } catch (error) {
      console.warn('Could not save cache stats:', error);
    }
  }

  /**
   * 🔧 Destructor - cleanup on exit
   */
  async destroy(): Promise<void> {
    this.stopCleanupTimer();
    await this.saveStats();
    await this.saveMetadata();
  }
}