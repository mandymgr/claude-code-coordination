import { EventEmitter } from 'events';

export interface LazyLoadOptions {
  cacheTimeout: number; // milliseconds
  maxCacheSize: number; // number of items
  preloadStrategies: string[];
  enableMetrics: boolean;
}

export interface LoadMetrics {
  loadCount: number;
  cacheHits: number;
  cacheMisses: number;
  totalLoadTime: number;
  averageLoadTime: number;
  lastLoadTime: Date;
}

export interface LazyLoadableService {
  initialize(): Promise<void>;
  dispose(): Promise<void>;
  isInitialized(): boolean;
  getServiceName(): string;
}

interface CacheEntry<T> {
  value: T;
  loadedAt: Date;
  accessCount: number;
  lastAccessed: Date;
}

export class LazyLoader extends EventEmitter {
  private cache = new Map<string, CacheEntry<any>>();
  private loadingPromises = new Map<string, Promise<any>>();
  private services = new Map<string, LazyLoadableService>();
  private options: LazyLoadOptions;
  private metrics: LoadMetrics;

  constructor(options: Partial<LazyLoadOptions> = {}) {
    super();
    
    this.options = {
      cacheTimeout: 300000, // 5 minutes
      maxCacheSize: 100,
      preloadStrategies: ['auto', 'dependency'],
      enableMetrics: true,
      ...options
    };

    this.metrics = {
      loadCount: 0,
      cacheHits: 0,
      cacheMisses: 0,
      totalLoadTime: 0,
      averageLoadTime: 0,
      lastLoadTime: new Date()
    };

    // Cleanup expired cache entries every minute
    setInterval(() => this.cleanupCache(), 60000);
  }

  /**
   * Register a lazy-loadable service
   */
  public registerService<T extends LazyLoadableService>(
    key: string, 
    serviceFactory: () => T | Promise<T>
  ): void {
    if (this.services.has(key)) {
      console.warn(`[LazyLoader] Service ${key} already registered, overwriting`);
    }

    // Create a wrapper that implements LazyLoadableService
    const wrapper: LazyLoadableService = {
      _instance: null as T | null,
      _factory: serviceFactory,
      
      async initialize(): Promise<void> {
        if (!this._instance) {
          const startTime = Date.now();
          this._instance = await this._factory();
          
          if (this._instance && typeof this._instance.initialize === 'function') {
            await this._instance.initialize();
          }
          
          const loadTime = Date.now() - startTime;
          console.log(`[LazyLoader] Service ${key} initialized in ${loadTime}ms`);
        }
      },
      
      async dispose(): Promise<void> {
        if (this._instance && typeof this._instance.dispose === 'function') {
          await this._instance.dispose();
        }
        this._instance = null;
      },
      
      isInitialized(): boolean {
        return this._instance !== null;
      },
      
      getServiceName(): string {
        return key;
      },
      
      getInstance(): T {
        return this._instance as T;
      }
    } as any;

    this.services.set(key, wrapper);
    console.log(`[LazyLoader] Registered service: ${key}`);
  }

  /**
   * Load a service or resource lazily
   */
  public async load<T>(
    key: string, 
    loader?: () => Promise<T>,
    options: { 
      bypassCache?: boolean, 
      timeout?: number,
      dependencies?: string[] 
    } = {}
  ): Promise<T> {
    const startTime = Date.now();

    try {
      // Check cache first (unless bypassing)
      if (!options.bypassCache && this.cache.has(key)) {
        const entry = this.cache.get(key)!;
        
        // Check if cache entry is still valid
        const age = Date.now() - entry.loadedAt.getTime();
        if (age < this.options.cacheTimeout) {
          entry.accessCount++;
          entry.lastAccessed = new Date();
          
          if (this.options.enableMetrics) {
            this.metrics.cacheHits++;
          }
          
          this.emit('cacheHit', { key, entry });
          return entry.value;
        } else {
          // Cache expired, remove it
          this.cache.delete(key);
        }
      }

      // Check if already loading
      if (this.loadingPromises.has(key)) {
        return await this.loadingPromises.get(key);
      }

      // Load dependencies first
      if (options.dependencies && options.dependencies.length > 0) {
        await Promise.all(
          options.dependencies.map(dep => this.load(dep))
        );
      }

      // Create loading promise
      const loadingPromise = this.performLoad<T>(key, loader, options.timeout);
      this.loadingPromises.set(key, loadingPromise);

      try {
        const result = await loadingPromise;
        
        // Cache the result
        this.cacheResult(key, result);
        
        // Update metrics
        if (this.options.enableMetrics) {
          const loadTime = Date.now() - startTime;
          this.updateMetrics(loadTime, false);
        }
        
        this.emit('loaded', { key, result, loadTime: Date.now() - startTime });
        return result;
        
      } finally {
        this.loadingPromises.delete(key);
      }
      
    } catch (error) {
      this.loadingPromises.delete(key);
      
      if (this.options.enableMetrics) {
        this.metrics.cacheMisses++;
      }
      
      this.emit('loadError', { key, error, loadTime: Date.now() - startTime });
      throw error;
    }
  }

  private async performLoad<T>(
    key: string, 
    loader?: () => Promise<T>, 
    timeout?: number
  ): Promise<T> {
    // Try to load registered service first
    if (this.services.has(key)) {
      const service = this.services.get(key)!;
      
      if (!service.isInitialized()) {
        await service.initialize();
      }
      
      return (service as any).getInstance();
    }

    // Use provided loader
    if (!loader) {
      throw new Error(`[LazyLoader] No loader provided for key: ${key}`);
    }

    let loadPromise = loader();

    // Apply timeout if specified
    if (timeout) {
      const timeoutPromise = new Promise<never>((_, reject) => {
        setTimeout(() => reject(new Error(`Load timeout for ${key}`)), timeout);
      });
      
      loadPromise = Promise.race([loadPromise, timeoutPromise]);
    }

    return await loadPromise;
  }

  private cacheResult<T>(key: string, value: T): void {
    // Check cache size limit
    if (this.cache.size >= this.options.maxCacheSize) {
      // Remove least recently accessed entry
      let oldestKey = '';
      let oldestTime = Date.now();
      
      for (const [k, entry] of this.cache.entries()) {
        if (entry.lastAccessed.getTime() < oldestTime) {
          oldestTime = entry.lastAccessed.getTime();
          oldestKey = k;
        }
      }
      
      if (oldestKey) {
        this.cache.delete(oldestKey);
        this.emit('cacheEvicted', { key: oldestKey });
      }
    }

    const now = new Date();
    this.cache.set(key, {
      value,
      loadedAt: now,
      accessCount: 1,
      lastAccessed: now
    });
  }

  private updateMetrics(loadTime: number, wasHit: boolean): void {
    this.metrics.loadCount++;
    this.metrics.totalLoadTime += loadTime;
    this.metrics.averageLoadTime = this.metrics.totalLoadTime / this.metrics.loadCount;
    this.metrics.lastLoadTime = new Date();
    
    if (wasHit) {
      this.metrics.cacheHits++;
    } else {
      this.metrics.cacheMisses++;
    }
  }

  private cleanupCache(): void {
    const now = Date.now();
    let removedCount = 0;

    for (const [key, entry] of this.cache.entries()) {
      const age = now - entry.loadedAt.getTime();
      if (age > this.options.cacheTimeout) {
        this.cache.delete(key);
        removedCount++;
      }
    }

    if (removedCount > 0) {
      console.log(`[LazyLoader] Cleaned up ${removedCount} expired cache entries`);
      this.emit('cacheCleanup', { removedCount });
    }
  }

  /**
   * Preload services based on strategies
   */
  public async preload(keys: string[], strategy: string = 'auto'): Promise<void> {
    if (!this.options.preloadStrategies.includes(strategy)) {
      console.warn(`[LazyLoader] Unknown preload strategy: ${strategy}`);
      return;
    }

    console.log(`[LazyLoader] Preloading ${keys.length} services with strategy: ${strategy}`);
    
    const preloadPromises = keys.map(async (key) => {
      try {
        await this.load(key);
        console.log(`[LazyLoader] Preloaded: ${key}`);
      } catch (error) {
        console.error(`[LazyLoader] Failed to preload ${key}:`, error);
      }
    });

    if (strategy === 'auto') {
      // Load in parallel
      await Promise.all(preloadPromises);
    } else if (strategy === 'dependency') {
      // Load sequentially to respect dependencies
      for (const promise of preloadPromises) {
        await promise;
      }
    }

    this.emit('preloadComplete', { keys, strategy });
  }

  /**
   * Get service without loading (returns null if not loaded)
   */
  public getIfLoaded<T>(key: string): T | null {
    const cacheEntry = this.cache.get(key);
    if (cacheEntry) {
      const age = Date.now() - cacheEntry.loadedAt.getTime();
      if (age < this.options.cacheTimeout) {
        return cacheEntry.value;
      }
    }

    const service = this.services.get(key);
    if (service && service.isInitialized()) {
      return (service as any).getInstance();
    }

    return null;
  }

  /**
   * Check if a resource is loaded and valid
   */
  public isLoaded(key: string): boolean {
    return this.getIfLoaded(key) !== null;
  }

  /**
   * Invalidate cache entry
   */
  public invalidate(key: string): void {
    this.cache.delete(key);
    this.emit('invalidated', { key });
  }

  /**
   * Clear all cache
   */
  public clearCache(): void {
    const size = this.cache.size;
    this.cache.clear();
    console.log(`[LazyLoader] Cleared ${size} cache entries`);
    this.emit('cacheCleared', { size });
  }

  /**
   * Get current metrics
   */
  public getMetrics(): LoadMetrics & { cacheSize: number; serviceCount: number } {
    return {
      ...this.metrics,
      cacheSize: this.cache.size,
      serviceCount: this.services.size
    };
  }

  /**
   * Dispose all services and clear cache
   */
  public async dispose(): Promise<void> {
    console.log('[LazyLoader] Disposing all services...');
    
    const disposePromises = Array.from(this.services.values()).map(async (service) => {
      try {
        if (service.isInitialized()) {
          await service.dispose();
        }
      } catch (error) {
        console.error(`[LazyLoader] Error disposing service ${service.getServiceName()}:`, error);
      }
    });

    await Promise.all(disposePromises);
    
    this.services.clear();
    this.cache.clear();
    this.loadingPromises.clear();
    
    console.log('[LazyLoader] Disposed');
  }
}

// Specific lazy-loadable services
export class LazyTensorFlowService implements LazyLoadableService {
  private tf: typeof import('@tensorflow/tfjs-node') | null = null;
  private isReady = false;

  async initialize(): Promise<void> {
    if (!this.isReady) {
      console.log('[LazyTensorFlow] Loading TensorFlow.js...');
      this.tf = await import('@tensorflow/tfjs-node');
      
      // Set backend and configure
      await this.tf.ready();
      console.log(`[LazyTensorFlow] Backend: ${this.tf.getBackend()}`);
      
      this.isReady = true;
    }
  }

  async dispose(): Promise<void> {
    if (this.tf) {
      // Cleanup TensorFlow resources
      this.tf.disposeVariables();
      this.tf = null;
      this.isReady = false;
    }
  }

  isInitialized(): boolean {
    return this.isReady && this.tf !== null;
  }

  getServiceName(): string {
    return 'tensorflow';
  }

  getTensorFlow(): typeof import('@tensorflow/tfjs-node') {
    if (!this.tf || !this.isReady) {
      throw new Error('TensorFlow.js not initialized. Call initialize() first.');
    }
    return this.tf;
  }
}

export class LazyEthersService implements LazyLoadableService {
  private ethers: typeof import('ethers') | null = null;
  private providers: Map<string, any> = new Map();
  private isReady = false;

  async initialize(): Promise<void> {
    if (!this.isReady) {
      console.log('[LazyEthers] Loading ethers.js...');
      this.ethers = await import('ethers');
      this.isReady = true;
    }
  }

  async dispose(): Promise<void> {
    if (this.providers) {
      // Cleanup providers
      for (const [name, provider] of this.providers) {
        try {
          if (provider.destroy) {
            await provider.destroy();
          }
        } catch (error) {
          console.error(`[LazyEthers] Error disposing provider ${name}:`, error);
        }
      }
      this.providers.clear();
    }
    
    this.ethers = null;
    this.isReady = false;
  }

  isInitialized(): boolean {
    return this.isReady && this.ethers !== null;
  }

  getServiceName(): string {
    return 'ethers';
  }

  getEthers(): typeof import('ethers') {
    if (!this.ethers || !this.isReady) {
      throw new Error('Ethers.js not initialized. Call initialize() first.');
    }
    return this.ethers;
  }

  getProvider(networkName: string): any {
    return this.providers.get(networkName);
  }

  setProvider(networkName: string, provider: any): void {
    this.providers.set(networkName, provider);
  }
}

// Global lazy loader instance
export const globalLazyLoader = new LazyLoader({
  cacheTimeout: parseInt(process.env.LAZY_CACHE_TIMEOUT || '300000'),
  maxCacheSize: parseInt(process.env.LAZY_CACHE_SIZE || '100'),
  preloadStrategies: ['auto', 'dependency'],
  enableMetrics: process.env.LAZY_METRICS !== 'false'
});

// Register core services
globalLazyLoader.registerService('tensorflow', () => new LazyTensorFlowService());
globalLazyLoader.registerService('ethers', () => new LazyEthersService());

// Graceful shutdown
process.on('SIGINT', async () => {
  await globalLazyLoader.dispose();
});

process.on('SIGTERM', async () => {
  await globalLazyLoader.dispose();
});