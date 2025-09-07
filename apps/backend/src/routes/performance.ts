import express from 'express';
import { globalMemoryManager } from '../services/monitoring/performance/memoryManager';
import { globalLazyLoader } from '../services/monitoring/performance/lazyLoader';
import { globalConnectionPool } from '../services/monitoring/performance/connectionPool';

const router: express.Router = express.Router();

// Performance metrics endpoint
router.get('/metrics', async (req, res) => {
  try {
    const metrics = {
      memory: {status: 'active', allocatedBytes: process.memoryUsage().heapUsed},
      lazyLoader: globalLazyLoader.getMetrics(),
      connectionPool: globalConnectionPool.getMetrics(),
      system: {
        uptime: process.uptime(),
        platform: process.platform,
        arch: process.arch,
        nodeVersion: process.version,
        memoryUsage: process.memoryUsage(),
        cpuUsage: process.cpuUsage()
      }
    };
    
    return res.json(metrics);
  } catch (error) {
    console.error('Error getting performance metrics:', error);
    res.status(500).json({ 
      error: 'Failed to get performance metrics',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Memory management endpoints
router.post('/memory/gc', async (req, res) => {
  try {
    globalMemoryManager.performGarbageCollection();
    const stats = {status: 'active', allocatedBytes: process.memoryUsage().heapUsed};
    
    res.json({
      success: true,
      message: 'Garbage collection completed',
      stats
    });
  } catch (error) {
    res.status(500).json({
      error: 'Garbage collection failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.get('/memory/stats', async (req, res) => {
  try {
    const stats = {status: 'active', allocatedBytes: process.memoryUsage().heapUsed};
    // getCurrentMemoryUsage placeholder - method not available
    const current = { status: 'active', allocatedBytes: process.memoryUsage().heapUsed };
    
    res.json({
      stats,
      current,
      warnings: [] // memoryWarnings placeholder
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get memory stats',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Lazy loader endpoints
router.get('/lazy-loader/status', async (req, res) => {
  try {
    const metrics = globalLazyLoader.getMetrics();
    
    res.json({
      metrics,
      loadedServices: [
        { name: 'tensorflow', loaded: globalLazyLoader.isLoaded('tensorflow') },
        { name: 'ethers', loaded: globalLazyLoader.isLoaded('ethers') }
      ]
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get lazy loader status',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.post('/lazy-loader/preload', async (req, res) => {
  try {
    const { services = ['tensorflow', 'ethers'], strategy = 'auto' } = req.body;
    
    await globalLazyLoader.preload(services, strategy);
    
    res.json({
      success: true,
      message: `Preloaded ${services.length} services with strategy: ${strategy}`,
      services
    });
  } catch (error) {
    res.status(500).json({
      error: 'Preload failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.delete('/lazy-loader/cache', async (req, res) => {
  try {
    globalLazyLoader.clearCache();
    
    res.json({
      success: true,
      message: 'Lazy loader cache cleared'
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to clear cache',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Connection pool endpoints
router.get('/connections/health', async (req, res) => {
  try {
    const health = await globalConnectionPool.healthCheck();
    
    // Determine overall health
    const pgHealthy = health.postgresql.status === 'healthy';
    const redisHealthy = Object.values(health.redis).every(r => r.status === 'healthy');
    const overallHealthy = pgHealthy && redisHealthy;
    
    res.status(overallHealthy ? 200 : 503).json({
      status: overallHealthy ? 'healthy' : 'unhealthy',
      checks: health,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: 'Health check failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

router.get('/connections/stats', async (req, res) => {
  try {
    const stats = globalConnectionPool.getMetrics();
    
    res.json({
      stats,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    res.status(500).json({
      error: 'Failed to get connection stats',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// System optimization endpoint
router.post('/optimize', async (req, res) => {
  try {
    console.log('[Performance] Starting system optimization...');
    
    // Step 1: Garbage collection
    globalMemoryManager.performGarbageCollection();
    
    // Step 2: Clear lazy loader cache
    globalLazyLoader.clearCache();
    
    // Step 3: Preload critical services
    await globalLazyLoader.preload(['tensorflow', 'ethers'], 'auto');
    
    // Step 4: Get final metrics
    const finalMetrics = {
      memory: {status: 'active', allocatedBytes: process.memoryUsage().heapUsed},
      lazyLoader: globalLazyLoader.getMetrics(),
      connectionPool: globalConnectionPool.getMetrics()
    };
    
    console.log('[Performance] System optimization completed');
    
    res.json({
      success: true,
      message: 'System optimization completed',
      metrics: finalMetrics,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('[Performance] System optimization failed:', error);
    res.status(500).json({
      error: 'System optimization failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Load testing endpoint (for development only)
router.post('/load-test', async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({
      error: 'Load testing not available in production'
    });
  }

  try {
    const { 
      operations = 100, 
      concurrency = 10,
      testType = 'memory' // 'memory', 'lazy-loading', 'database'
    } = req.body;

    console.log(`[Performance] Starting load test: ${testType} (${operations} ops, ${concurrency} concurrent)`);
    
    const startTime = Date.now();
    const results = [];
    
    if (testType === 'memory') {
      // Memory stress test
      const promises = [];
      for (let i = 0; i < concurrency; i++) {
        promises.push((async () => {
          for (let j = 0; j < operations / concurrency; j++) {
            await globalMemoryManager.withMemoryManagement(
              async () => {
                // Simulate memory-intensive operation
                const data = new Array(1000).fill(Math.random());
                await new Promise(resolve => setTimeout(resolve, 10));
                return data.length;
              },
              `load-test-${i}-${j}`
            );
          }
        })());
      }
      await Promise.all(promises);
      
    } else if (testType === 'lazy-loading') {
      // Lazy loading stress test
      for (let i = 0; i < operations; i++) {
        await globalLazyLoader.load('tensorflow');
        if (i % 10 === 0) {
          globalLazyLoader.invalidate('tensorflow');
        }
      }
    }
    
    const endTime = Date.now();
    const duration = endTime - startTime;
    
    const finalMetrics = {
      memory: {status: 'active', allocatedBytes: process.memoryUsage().heapUsed},
      lazyLoader: globalLazyLoader.getMetrics(),
      connectionPool: globalConnectionPool.getMetrics()
    };
    
    console.log(`[Performance] Load test completed in ${duration}ms`);
    
    res.json({
      success: true,
      testResults: {
        type: testType,
        operations,
        concurrency,
        duration,
        operationsPerSecond: (operations / duration) * 1000,
        averageLatency: duration / operations
      },
      metrics: finalMetrics
    });
    
  } catch (error) {
    console.error('[Performance] Load test failed:', error);
    res.status(500).json({
      error: 'Load test failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;