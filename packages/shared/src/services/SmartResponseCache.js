"use strict";
/**
 * 🚀 Smart Response Cache System
 * Intelligent caching of AI responses with context-aware hashing and TTL
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SmartResponseCache = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const crypto = __importStar(require("crypto"));
class SmartResponseCache {
    constructor(projectPath = process.cwd()) {
        this.cleanupInterval = null;
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
    ensureCacheDirectory() {
        if (!fs.existsSync(this.cacheDir)) {
            fs.mkdirSync(this.cacheDir, { recursive: true });
        }
    }
    /**
     * 💾 Get cached response
     */
    async get(key, context) {
        const startTime = Date.now();
        try {
            const cacheKey = this.generateCacheKey(key, context);
            const cacheFile = path.join(this.cacheDir, `${cacheKey}.json`);
            if (!fs.existsSync(cacheFile)) {
                this.stats.misses++;
                this.updateStats(startTime);
                return null;
            }
            const entry = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
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
        }
        catch (error) {
            console.warn('Cache get error:', error);
            this.stats.misses++;
            this.updateStats(startTime);
            return null;
        }
    }
    /**
     * 💾 Set cached response
     */
    async set(key, data, context, ttl) {
        try {
            const cacheKey = this.generateCacheKey(key, context);
            const cacheFile = path.join(this.cacheDir, `${cacheKey}.json`);
            const serializedData = JSON.stringify(data);
            const size = Buffer.byteLength(serializedData, 'utf8');
            // Check if adding this entry would exceed cache size limit
            if (this.metadata.totalSize + size > this.maxCacheSize) {
                await this.evictLRU(size);
            }
            const entry = {
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
        }
        catch (error) {
            console.warn('Cache set error:', error);
        }
    }
    /**
     * 🗑️ Delete cached entry
     */
    async delete(cacheKey) {
        try {
            const cacheFile = path.join(this.cacheDir, `${cacheKey}.json`);
            if (fs.existsSync(cacheFile)) {
                const entry = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
                fs.unlinkSync(cacheFile);
                this.metadata.totalEntries--;
                this.metadata.totalSize -= entry.size;
                this.stats.evictions++;
            }
        }
        catch (error) {
            console.warn('Cache delete error:', error);
        }
    }
    /**
     * 🧹 Clear all cache entries
     */
    async clear() {
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
        }
        catch (error) {
            console.warn('Cache clear error:', error);
        }
    }
    /**
     * 🎯 Generate context-aware cache key
     */
    generateCacheKey(key, context) {
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
    serializeContext(context) {
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
    sanitizeContext(context) {
        if (!context)
            return undefined;
        // Remove sensitive or large context data
        const sanitized = {};
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
    isExpired(entry) {
        return Date.now() - entry.timestamp > entry.ttl;
    }
    /**
     * 🔄 Check if context is compatible
     */
    isContextCompatible(entryContext, requestContext) {
        if (!entryContext && !requestContext)
            return true;
        if (!entryContext || !requestContext)
            return false;
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
    async evictLRU(requiredSpace) {
        console.log('🗑️ Evicting LRU entries to make space...');
        try {
            const files = fs.readdirSync(this.cacheDir);
            const entries = [];
            // Load all entries with their access times
            for (const file of files) {
                if (file.endsWith('.json') && file !== 'cache-metadata.json' && file !== 'cache-stats.json') {
                    try {
                        const entry = JSON.parse(fs.readFileSync(path.join(this.cacheDir, file), 'utf8'));
                        entries.push({ file, entry });
                    }
                    catch (error) {
                        // Remove corrupted files
                        fs.unlinkSync(path.join(this.cacheDir, file));
                    }
                }
            }
            // Sort by last accessed time (ascending - oldest first)
            entries.sort((a, b) => a.entry.lastAccessed - b.entry.lastAccessed);
            let freedSpace = 0;
            for (const { file, entry } of entries) {
                if (freedSpace >= requiredSpace)
                    break;
                await this.delete(entry.key);
                freedSpace += entry.size;
                console.log(`🗑️ Evicted cache entry: ${entry.key.substring(0, 20)}...`);
            }
        }
        catch (error) {
            console.warn('LRU eviction error:', error);
        }
    }
    /**
     * 🧹 Cleanup expired entries
     */
    async cleanup() {
        console.log('🧹 Starting cache cleanup...');
        try {
            const files = fs.readdirSync(this.cacheDir);
            let removedCount = 0;
            let freedSpace = 0;
            for (const file of files) {
                if (file.endsWith('.json') && file !== 'cache-metadata.json' && file !== 'cache-stats.json') {
                    try {
                        const filePath = path.join(this.cacheDir, file);
                        const entry = JSON.parse(fs.readFileSync(filePath, 'utf8'));
                        if (this.isExpired(entry)) {
                            fs.unlinkSync(filePath);
                            this.metadata.totalEntries--;
                            this.metadata.totalSize -= entry.size;
                            freedSpace += entry.size;
                            removedCount++;
                        }
                    }
                    catch (error) {
                        // Remove corrupted files
                        fs.unlinkSync(path.join(this.cacheDir, file));
                        removedCount++;
                    }
                }
            }
            this.metadata.lastCleanup = Date.now();
            await this.saveMetadata();
            console.log(`🧹 Cleanup complete: removed ${removedCount} entries, freed ${Math.round(freedSpace / 1024)}KB`);
        }
        catch (error) {
            console.warn('Cache cleanup error:', error);
        }
    }
    /**
     * 📊 Get cache statistics
     */
    getStats() {
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
    async updateSettings(settings) {
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
    startCleanupTimer() {
        const interval = this.metadata.settings.cleanupInterval || 60 * 60 * 1000; // 1 hour default
        this.cleanupInterval = setInterval(async () => {
            await this.cleanup();
        }, interval);
    }
    /**
     * 🛑 Stop cleanup timer
     */
    stopCleanupTimer() {
        if (this.cleanupInterval) {
            clearInterval(this.cleanupInterval);
            this.cleanupInterval = null;
        }
    }
    /**
     * 📊 Update statistics
     */
    updateStats(startTime) {
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
    loadMetadata() {
        try {
            if (fs.existsSync(this.metadataFile)) {
                const data = fs.readFileSync(this.metadataFile, 'utf8');
                return JSON.parse(data);
            }
        }
        catch (error) {
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
    async saveMetadata() {
        try {
            fs.writeFileSync(this.metadataFile, JSON.stringify(this.metadata, null, 2));
        }
        catch (error) {
            console.warn('Could not save cache metadata:', error);
        }
    }
    /**
     * 📊 Load statistics
     */
    loadStats() {
        try {
            const statsFile = path.join(this.cacheDir, 'cache-stats.json');
            if (fs.existsSync(statsFile)) {
                const data = fs.readFileSync(statsFile, 'utf8');
                return JSON.parse(data);
            }
        }
        catch (error) {
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
    async saveStats() {
        try {
            const statsFile = path.join(this.cacheDir, 'cache-stats.json');
            fs.writeFileSync(statsFile, JSON.stringify(this.stats, null, 2));
        }
        catch (error) {
            console.warn('Could not save cache stats:', error);
        }
    }
    /**
     * 🔧 Destructor - cleanup on exit
     */
    async destroy() {
        this.stopCleanupTimer();
        await this.saveStats();
        await this.saveMetadata();
    }
}
exports.SmartResponseCache = SmartResponseCache;
//# sourceMappingURL=SmartResponseCache.js.map