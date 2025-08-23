#!/usr/bin/env node
/**
 * 🚀 Smart Response Cache System
 * Intelligent caching of AI responses with context-aware hashing and TTL
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class SmartResponseCache {
  constructor(projectPath = process.cwd()) {
    this.projectPath = projectPath;
    this.cacheDir = path.join(projectPath, '.claude-coordination', 'response-cache');
    this.metadataFile = path.join(this.cacheDir, 'cache-metadata.json');
    this.maxCacheSize = 100 * 1024 * 1024; // 100MB max cache size
    this.defaultTTL = 24 * 60 * 60 * 1000; // 24 hours in milliseconds
    
    this.ensureCacheDirectory();
    this.metadata = this.loadMetadata();
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
   * 📊 Load cache metadata
   */
  loadMetadata() {
    try {
      if (fs.existsSync(this.metadataFile)) {
        return JSON.parse(fs.readFileSync(this.metadataFile, 'utf8'));
      }
    } catch (error) {
      console.warn('⚠️ Error loading cache metadata:', error.message);
    }
    
    return {
      entries: {},
      totalSize: 0,
      created: Date.now(),
      lastCleanup: Date.now()
    };
  }

  /**
   * 💾 Save cache metadata
   */
  saveMetadata() {
    try {
      fs.writeFileSync(this.metadataFile, JSON.stringify(this.metadata, null, 2));
    } catch (error) {
      console.warn('⚠️ Error saving cache metadata:', error.message);
    }
  }

  /**
   * 🔑 Generate context-aware cache key
   */
  generateCacheKey(query, context = {}) {
    const normalizedQuery = query.toLowerCase().trim();
    
    // Create context hash from relevant context data
    const contextData = {
      projectType: context.projectType || 'unknown',
      language: context.language || 'unknown',
      framework: context.framework || 'unknown',
      taskType: context.taskType || 'general',
      skillLevel: context.skillLevel || 'intermediate'
    };
    
    // Include file context if available
    if (context.fileContext) {
      contextData.fileExtension = this.extractFileExtension(context.fileContext);
      contextData.fileType = this.detectFileType(context.fileContext);
    }
    
    const contextString = JSON.stringify(contextData);
    const combinedString = `${normalizedQuery}|${contextString}`;
    
    return crypto.createHash('sha256').update(combinedString).digest('hex');
  }

  /**
   * 📁 Extract file extension from context
   */
  extractFileExtension(fileContext) {
    if (typeof fileContext === 'string' && fileContext.includes('.')) {
      const matches = fileContext.match(/\.([a-zA-Z0-9]+)(?:\s|$)/);
      return matches ? matches[1].toLowerCase() : null;
    }
    return null;
  }

  /**
   * 🔍 Detect file type from context
   */
  detectFileType(fileContext) {
    const lowerContext = fileContext.toLowerCase();
    
    if (lowerContext.includes('package.json')) return 'config';
    if (lowerContext.includes('dockerfile')) return 'docker';
    if (lowerContext.includes('.test.') || lowerContext.includes('.spec.')) return 'test';
    if (lowerContext.includes('readme')) return 'documentation';
    if (lowerContext.includes('.css') || lowerContext.includes('.scss')) return 'style';
    
    return 'code';
  }

  /**
   * 💨 Get cached response
   */
  async get(query, context = {}) {
    const cacheKey = this.generateCacheKey(query, context);
    const entry = this.metadata.entries[cacheKey];
    
    if (!entry) {
      return null;
    }
    
    // Check if entry has expired
    const now = Date.now();
    if (now > entry.expiresAt) {
      await this.remove(cacheKey);
      return null;
    }
    
    // Try to read cached response
    const cacheFile = path.join(this.cacheDir, `${cacheKey}.json`);
    try {
      if (fs.existsSync(cacheFile)) {
        const cachedData = JSON.parse(fs.readFileSync(cacheFile, 'utf8'));
        
        // Update access time
        entry.lastAccessed = now;
        entry.accessCount = (entry.accessCount || 0) + 1;
        this.saveMetadata();
        
        console.log('🚀 Cache hit! Retrieved response from cache');
        return cachedData.response;
      }
    } catch (error) {
      console.warn('⚠️ Error reading cached response:', error.message);
      await this.remove(cacheKey);
    }
    
    return null;
  }

  /**
   * 💾 Store response in cache
   */
  async set(query, context = {}, response, ttl = null) {
    const cacheKey = this.generateCacheKey(query, context);
    const now = Date.now();
    const expiresAt = now + (ttl || this.defaultTTL);
    
    const cacheData = {
      query,
      context,
      response,
      timestamp: now,
      expiresAt
    };
    
    const cacheFile = path.join(this.cacheDir, `${cacheKey}.json`);
    
    try {
      const dataString = JSON.stringify(cacheData, null, 2);
      const dataSize = Buffer.byteLength(dataString, 'utf8');
      
      // Check cache size limits
      if (this.metadata.totalSize + dataSize > this.maxCacheSize) {
        await this.cleanup();
      }
      
      fs.writeFileSync(cacheFile, dataString);
      
      // Update metadata
      const existingEntry = this.metadata.entries[cacheKey];
      if (existingEntry) {
        this.metadata.totalSize -= existingEntry.size;
      }
      
      this.metadata.entries[cacheKey] = {
        size: dataSize,
        created: now,
        expiresAt,
        lastAccessed: now,
        accessCount: 1,
        query: query.substring(0, 100) + (query.length > 100 ? '...' : '')
      };
      
      this.metadata.totalSize += dataSize;
      this.saveMetadata();
      
      console.log('💾 Response cached successfully');
      
    } catch (error) {
      console.warn('⚠️ Error caching response:', error.message);
    }
  }

  /**
   * 🗑️ Remove cached entry
   */
  async remove(cacheKey) {
    const entry = this.metadata.entries[cacheKey];
    if (entry) {
      const cacheFile = path.join(this.cacheDir, `${cacheKey}.json`);
      
      try {
        if (fs.existsSync(cacheFile)) {
          fs.unlinkSync(cacheFile);
        }
        
        this.metadata.totalSize -= entry.size;
        delete this.metadata.entries[cacheKey];
        this.saveMetadata();
        
      } catch (error) {
        console.warn('⚠️ Error removing cached entry:', error.message);
      }
    }
  }

  /**
   * 🧹 Cleanup expired and least-used entries
   */
  async cleanup() {
    const now = Date.now();
    const entries = Object.entries(this.metadata.entries);
    let cleanedSize = 0;
    let cleanedCount = 0;
    
    console.log('🧹 Cleaning up cache...');
    
    // Remove expired entries first
    for (const [cacheKey, entry] of entries) {
      if (now > entry.expiresAt) {
        await this.remove(cacheKey);
        cleanedSize += entry.size;
        cleanedCount++;
      }
    }
    
    // If still over limit, remove least-used entries
    if (this.metadata.totalSize > this.maxCacheSize * 0.8) {
      const sortedEntries = Object.entries(this.metadata.entries)
        .sort((a, b) => {
          // Sort by access frequency and recency
          const aScore = (a[1].accessCount || 1) * (now - a[1].lastAccessed);
          const bScore = (b[1].accessCount || 1) * (now - b[1].lastAccessed);
          return bScore - aScore; // Higher score = less important
        });
      
      const targetSize = this.maxCacheSize * 0.7;
      
      for (const [cacheKey, entry] of sortedEntries) {
        if (this.metadata.totalSize <= targetSize) break;
        
        await this.remove(cacheKey);
        cleanedSize += entry.size;
        cleanedCount++;
      }
    }
    
    this.metadata.lastCleanup = now;
    this.saveMetadata();
    
    console.log(`🧹 Cache cleanup complete: Removed ${cleanedCount} entries, freed ${Math.round(cleanedSize / 1024)}KB`);
  }

  /**
   * 📊 Get cache statistics
   */
  getStats() {
    const entryCount = Object.keys(this.metadata.entries).length;
    const totalSize = Math.round(this.metadata.totalSize / 1024); // KB
    const maxSize = Math.round(this.maxCacheSize / 1024); // KB
    
    const now = Date.now();
    const recentEntries = Object.values(this.metadata.entries)
      .filter(entry => (now - entry.created) < 60 * 60 * 1000).length; // Last hour
    
    const hitRate = this.calculateHitRate();
    
    return {
      entryCount,
      totalSizeKB: totalSize,
      maxSizeKB: maxSize,
      utilizationPercent: Math.round((totalSize / maxSize) * 100),
      recentEntries,
      hitRate: Math.round(hitRate * 100),
      lastCleanup: new Date(this.metadata.lastCleanup).toISOString()
    };
  }

  /**
   * 📈 Calculate cache hit rate
   */
  calculateHitRate() {
    const entries = Object.values(this.metadata.entries);
    if (entries.length === 0) return 0;
    
    const totalAccesses = entries.reduce((sum, entry) => sum + (entry.accessCount || 1), 0);
    const uniqueEntries = entries.length;
    
    return Math.min(1, (totalAccesses - uniqueEntries) / totalAccesses);
  }

  /**
   * 🚀 Smart cache warming
   */
  async warmCache(commonQueries = []) {
    console.log('🔥 Warming cache with common queries...');
    
    const defaultQueries = [
      'How do I optimize performance?',
      'Best practices for this project?',
      'How to write better tests?',
      'Code review suggestions?',
      'Security best practices?'
    ];
    
    const queries = [...defaultQueries, ...commonQueries];
    
    for (const query of queries) {
      // Pre-compute cache keys for common contexts
      const contexts = [
        { projectType: 'web', language: 'javascript' },
        { projectType: 'api', language: 'node' },
        { projectType: 'mobile', language: 'react-native' }
      ];
      
      for (const context of contexts) {
        const cacheKey = this.generateCacheKey(query, context);
        console.log(`🔑 Pre-computed cache key for: "${query}" with context ${JSON.stringify(context)}`);
      }
    }
  }

  /**
   * 💀 Clear entire cache
   */
  async clearCache() {
    try {
      const files = fs.readdirSync(this.cacheDir);
      let deletedCount = 0;
      
      for (const file of files) {
        if (file.endsWith('.json') && file !== 'cache-metadata.json') {
          fs.unlinkSync(path.join(this.cacheDir, file));
          deletedCount++;
        }
      }
      
      this.metadata = {
        entries: {},
        totalSize: 0,
        created: Date.now(),
        lastCleanup: Date.now()
      };
      
      this.saveMetadata();
      
      console.log(`🗑️ Cache cleared: Removed ${deletedCount} entries`);
      
    } catch (error) {
      console.warn('⚠️ Error clearing cache:', error.message);
    }
  }
}

// CLI Interface
if (require.main === module) {
  const cache = new SmartResponseCache();
  const command = process.argv[2];
  
  switch (command) {
    case 'stats':
      console.log('📊 Cache Statistics:');
      console.log(JSON.stringify(cache.getStats(), null, 2));
      break;
      
    case 'cleanup':
      cache.cleanup();
      break;
      
    case 'clear':
      cache.clearCache();
      break;
      
    case 'warm':
      cache.warmCache();
      break;
      
    default:
      console.log('Usage: node smart-response-cache.js [stats|cleanup|clear|warm]');
  }
}

module.exports = SmartResponseCache;