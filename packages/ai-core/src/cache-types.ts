/**
 * 🚀 Smart Response Cache - TypeScript Type Definitions
 * Advanced caching system with similarity matching and intelligent analytics
 * Enterprise-grade TypeScript implementation for KRINS-Universe-Builder
 */

export interface CacheEntry {
  size: number;
  created: number;
  expiresAt: number;
  lastAccessed: number;
  accessCount: number;
  query: string; // Truncated for metadata display
  similarity?: number; // For similarity-matched entries
}

export interface CacheMetadata {
  entries: Record<string, CacheEntry>;
  totalSize: number;
  created: number;
  lastCleanup: number;
  version: string;
  hitCount: number;
  missCount: number;
  similarityHits: number;
}

export interface CacheData {
  query: string;
  context: CacheContext;
  response: any;
  timestamp: number;
  expiresAt: number;
  aiModel?: string;
  tokenCount?: number;
  responseTime?: number;
}

export interface CacheContext {
  projectType?: string;
  language?: string;
  framework?: string;
  taskType?: string;
  skillLevel?: string;
  fileContext?: string;
  fileExtension?: string;
  fileType?: string;
  aiModel?: string;
  sessionId?: string;
  responseTime?: number;
}

export interface SimilarityMatch {
  cacheKey: string;
  query: string;
  similarity: number;
  context: CacheContext;
  entry: CacheEntry;
}

export interface CacheStats {
  entryCount: number;
  totalSizeKB: number;
  maxSizeKB: number;
  utilizationPercent: number;
  hitRate: number;
  missRate: number;
  similarityHitRate: number;
  averageResponseTime: number;
  recentEntries: number;
  expiredEntries: number;
  lastCleanup: string;
  topQueries: QueryStats[];
  performance: PerformanceStats;
}

export interface QueryStats {
  query: string;
  count: number;
  averageSimilarity: number;
  lastUsed: string;
}

export interface PerformanceStats {
  averageCacheHitTime: number;
  averageCacheMissTime: number;
  cacheEfficiency: number;
  memoryUsage: number;
  diskUsage: number;
  compressionRatio: number;
}

export interface CacheConfiguration {
  maxCacheSize: number; // bytes
  defaultTTL: number; // milliseconds
  similarityThreshold: number; // 0-1
  compressionEnabled: boolean;
  backgroundCleanup: boolean;
  cleanupInterval: number; // milliseconds
  maxEntries: number;
  enableAnalytics: boolean;
  warmupQueries: string[];
}

export interface CleanupResult {
  entriesRemoved: number;
  sizeFreed: number;
  expiredCount: number;
  lruCount: number;
  duration: number;
}

export interface WarmupResult {
  queriesProcessed: number;
  cacheKeysGenerated: number;
  duration: number;
  errors: string[];
}

export interface SimilarityConfig {
  algorithm: 'levenshtein' | 'jaccard' | 'cosine' | 'hybrid';
  threshold: number;
  contextWeight: number;
  queryWeight: number;
  normalizeCase: boolean;
  removePunctuation: boolean;
  stemming: boolean;
}

export type CacheEventType = 
  | 'hit' 
  | 'miss' 
  | 'similarity_hit' 
  | 'set' 
  | 'remove' 
  | 'cleanup' 
  | 'warmup' 
  | 'error';

export interface CacheEvent {
  type: CacheEventType;
  timestamp: number;
  cacheKey?: string;
  query?: string;
  similarity?: number;
  duration?: number;
  error?: string;
  metadata?: Record<string, any>;
}

export interface CacheOperationOptions {
  ttl?: number;
  skipSimilarity?: boolean;
  forceUpdate?: boolean;
  compress?: boolean;
  priority?: 'low' | 'normal' | 'high';
}

export interface SimilarityAnalysis {
  textSimilarity: number;
  contextSimilarity: number;
  semanticSimilarity: number;
  overallSimilarity: number;
  confidence: number;
}

// Utility types
export type CacheKey = string;
export type QueryHash = string;
export type ContextHash = string;