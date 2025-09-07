import * as tf from '@tensorflow/tfjs-node';
import { EventEmitter } from 'events';

export interface MemoryManagerOptions {
  maxMemoryMB: number;
  gcInterval: number; // milliseconds
  tensorLeakThreshold: number;
  enableTensorMemoryTracking: boolean;
  enableGarbageCollection: boolean;
}

export interface MemoryStats {
  heapUsed: number;
  heapTotal: number;
  external: number;
  tensorMemoryUsage: number;
  numTensors: number;
  gcCount: number;
  lastGC: Date;
  memoryWarnings: string[];
}

export class MemoryManager extends EventEmitter {
  private options: MemoryManagerOptions;
  private gcTimer: NodeJS.Timeout | null = null;
  private gcCount = 0;
  private lastGC = new Date();
  private memoryWarnings: string[] = [];
  private initialTensorCount: number;
  private isDisposed = false;

  constructor(options: Partial<MemoryManagerOptions> = {}) {
    super();
    
    this.options = {
      maxMemoryMB: 2048, // 2GB default
      gcInterval: 60000, // 1 minute
      tensorLeakThreshold: 100,
      enableTensorMemoryTracking: true,
      enableGarbageCollection: true,
      ...options
    };

    this.initialTensorCount = tf.memory().numTensors;
    
    if (this.options.enableGarbageCollection) {
      this.startGCTimer();
    }

    // Setup memory pressure monitoring
    this.startMemoryMonitoring();
  }

  private startGCTimer(): void {
    this.gcTimer = setInterval(() => {
      this.performGarbageCollection();
    }, this.options.gcInterval);
  }

  private startMemoryMonitoring(): void {
    const checkMemory = () => {
      const stats = this.getMemoryStats();
      
      // Check heap memory pressure
      const heapUsageMB = stats.heapUsed / 1024 / 1024;
      if (heapUsageMB > this.options.maxMemoryMB * 0.85) {
        const warning = `High memory usage: ${heapUsageMB.toFixed(0)}MB (${((heapUsageMB / this.options.maxMemoryMB) * 100).toFixed(1)}%)`;
        this.addWarning(warning);
        this.emit('memoryPressure', { severity: 'high', usage: heapUsageMB, stats });
        this.performEmergencyCleanup();
      } else if (heapUsageMB > this.options.maxMemoryMB * 0.75) {
        const warning = `Medium memory usage: ${heapUsageMB.toFixed(0)}MB`;
        this.addWarning(warning);
        this.emit('memoryPressure', { severity: 'medium', usage: heapUsageMB, stats });
      }

      // Check for tensor leaks
      if (this.options.enableTensorMemoryTracking) {
        const tensorLeakCount = stats.numTensors - this.initialTensorCount;
        if (tensorLeakCount > this.options.tensorLeakThreshold) {
          const warning = `Potential tensor leak detected: ${tensorLeakCount} tensors not disposed`;
          this.addWarning(warning);
          this.emit('tensorLeak', { leakCount: tensorLeakCount, stats });
        }
      }
    };

    // Check memory every 30 seconds
    setInterval(checkMemory, 30000);
  }

  private addWarning(warning: string): void {
    this.memoryWarnings.push(warning);
    // Keep only last 10 warnings
    if (this.memoryWarnings.length > 10) {
      this.memoryWarnings = this.memoryWarnings.slice(-10);
    }
    console.warn(`[MemoryManager] ${warning}`);
  }

  public performGarbageCollection(): void {
    if (this.isDisposed) return;

    try {
      const beforeStats = this.getMemoryStats();
      
      // Force garbage collection if available
      if (global.gc) {
        global.gc();
      }

      // TensorFlow.js specific cleanup
      if (this.options.enableTensorMemoryTracking) {
        // Clean up disposed tensors
        tf.disposeVariables();
        
        // Force TensorFlow backend cleanup
        const backend = tf.getBackend();
        if (backend === 'tensorflow') {
          // @ts-ignore - Access internal cleanup if available
          if (tf.backend()?.cleanupDelayedStorageBuffers) {
            tf.backend().cleanupDelayedStorageBuffers();
          }
        }
      }

      const afterStats = this.getMemoryStats();
      const freedMemory = beforeStats.heapUsed - afterStats.heapUsed;
      const freedTensors = beforeStats.numTensors - afterStats.numTensors;

      this.gcCount++;
      this.lastGC = new Date();

      this.emit('garbageCollected', {
        freedMemoryMB: freedMemory / 1024 / 1024,
        freedTensors,
        beforeStats,
        afterStats
      });

      console.log(`[MemoryManager] GC completed: Freed ${(freedMemory / 1024 / 1024).toFixed(2)}MB, ${freedTensors} tensors`);
    } catch (error) {
      console.error('[MemoryManager] Error during garbage collection:', error);
      this.emit('gcError', error);
    }
  }

  private performEmergencyCleanup(): void {
    console.warn('[MemoryManager] Performing emergency memory cleanup');
    
    try {
      // Aggressive tensor cleanup
      if (this.options.enableTensorMemoryTracking) {
        const beforeTensors = tf.memory().numTensors;
        
        // Force dispose all variables
        tf.disposeVariables();
        
        // Clear any cached operations
        tf.engine().endScope();
        tf.engine().startScope();
        
        const afterTensors = tf.memory().numTensors;
        console.log(`[MemoryManager] Emergency cleanup: Disposed ${beforeTensors - afterTensors} tensors`);
      }

      // Force multiple GC cycles
      for (let i = 0; i < 3; i++) {
        if (global.gc) {
          global.gc();
        }
      }

      this.emit('emergencyCleanup');
    } catch (error) {
      console.error('[MemoryManager] Error during emergency cleanup:', error);
    }
  }

  public getMemoryStats(): MemoryStats {
    const memUsage = process.memoryUsage();
    const tfMemory = this.options.enableTensorMemoryTracking ? tf.memory() : { numBytes: 0, numTensors: 0 };

    return {
      heapUsed: memUsage.heapUsed,
      heapTotal: memUsage.heapTotal,
      external: memUsage.external,
      tensorMemoryUsage: tfMemory.numBytes || 0,
      numTensors: tfMemory.numTensors || 0,
      gcCount: this.gcCount,
      lastGC: this.lastGC,
      memoryWarnings: [...this.memoryWarnings]
    };
  }

  public async withMemoryManagement<T>(
    operation: () => Promise<T>,
    operationName: string = 'operation'
  ): Promise<T> {
    const startStats = this.getMemoryStats();
    const startTime = Date.now();

    try {
      console.log(`[MemoryManager] Starting ${operationName}`);
      
      // Perform GC before operation
      this.performGarbageCollection();
      
      const result = await operation();
      
      // Check memory after operation
      const endStats = this.getMemoryStats();
      const duration = Date.now() - startTime;
      const memoryDelta = endStats.heapUsed - startStats.heapUsed;
      const tensorDelta = endStats.numTensors - startStats.numTensors;

      console.log(`[MemoryManager] ${operationName} completed in ${duration}ms`);
      console.log(`Memory delta: ${(memoryDelta / 1024 / 1024).toFixed(2)}MB, Tensor delta: ${tensorDelta}`);

      // Emit operation complete event
      this.emit('operationComplete', {
        operationName,
        duration,
        memoryDelta,
        tensorDelta,
        startStats,
        endStats
      });

      // Perform cleanup GC if memory usage is high
      if (endStats.heapUsed > this.options.maxMemoryMB * 0.7 * 1024 * 1024) {
        setTimeout(() => this.performGarbageCollection(), 1000);
      }

      return result;
    } catch (error) {
      const endStats = this.getMemoryStats();
      console.error(`[MemoryManager] ${operationName} failed:`, error);
      
      this.emit('operationError', {
        operationName,
        error,
        startStats,
        endStats: endStats
      });

      // Perform cleanup after error
      this.performGarbageCollection();
      
      throw error;
    }
  }

  public createTensorScope<T>(fn: () => T): T {
    if (!this.options.enableTensorMemoryTracking) {
      return fn();
    }

    return tf.tidy(() => {
      const result = fn();
      
      // If result is a tensor or tensor array, mark it for keeping
      if (result && (result instanceof tf.Tensor || Array.isArray(result))) {
        return tf.keep(result as any);
      }
      
      return result;
    });
  }

  public enableNodeGC(): boolean {
    try {
      // Enable garbage collection flag for Node.js
      if (typeof global !== 'undefined' && !global.gc) {
        console.warn('[MemoryManager] Node.js garbage collection not exposed. Run with --expose-gc flag for better memory management');
        return false;
      }
      return true;
    } catch (error) {
      console.error('[MemoryManager] Error enabling Node.js GC:', error);
      return false;
    }
  }

  public dispose(): void {
    this.isDisposed = true;
    
    if (this.gcTimer) {
      clearInterval(this.gcTimer);
      this.gcTimer = null;
    }

    // Final cleanup
    this.performGarbageCollection();
    
    console.log('[MemoryManager] Disposed');
  }

  // Static utility methods
  public static formatBytes(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  }

  public static getCurrentMemoryUsage(): { heap: string; external: string; tensors: string } {
    const mem = process.memoryUsage();
    const tfMem = tf.memory();
    
    return {
      heap: MemoryManager.formatBytes(mem.heapUsed),
      external: MemoryManager.formatBytes(mem.external),
      tensors: MemoryManager.formatBytes(tfMem.numBytes || 0)
    };
  }
}

// Global memory manager instance
export const globalMemoryManager = new MemoryManager({
  maxMemoryMB: parseInt(process.env.MAX_MEMORY_MB || '2048'),
  gcInterval: parseInt(process.env.GC_INTERVAL_MS || '60000'),
  tensorLeakThreshold: parseInt(process.env.TENSOR_LEAK_THRESHOLD || '100'),
  enableTensorMemoryTracking: process.env.ENABLE_TENSOR_TRACKING !== 'false',
  enableGarbageCollection: process.env.ENABLE_GC !== 'false'
});

// Setup global error handlers for memory issues
process.on('warning', (warning) => {
  if (warning.name === 'MaxListenersExceededWarning') {
    globalMemoryManager.emit('memoryWarning', warning);
  }
});

// Graceful shutdown
process.on('SIGINT', () => {
  globalMemoryManager.dispose();
});

process.on('SIGTERM', () => {
  globalMemoryManager.dispose();
});