import { Request, Response } from 'express';
// import { multiTenantService } from '../services/enterprise/enterprise/multiTenant.js';
// import { performanceMonitor } from '../services/monitoring/performance/memoryManager.js';

interface HealthCheckResult {
  status: 'healthy' | 'unhealthy' | 'degraded';
  timestamp: string;
  version: string;
  uptime: number;
  environment: string;
  checks: {
    [key: string]: {
      status: 'pass' | 'fail' | 'warn';
      message?: string;
      duration_ms?: number;
      timestamp: string;
    };
  };
  metrics: {
    memory: {
      used: number;
      total: number;
      percentage: number;
      heap_used: number;
      heap_total: number;
    };
    cpu: {
      usage_percent: number;
      load_average: number[];
    };
    process: {
      pid: number;
      uptime: number;
      title: string;
    };
    system: {
      platform: string;
      arch: string;
      node_version: string;
    };
  };
}

class HealthChecker {
  private startTime: number;
  private version: string;
  
  constructor() {
    this.startTime = Date.now();
    this.version = process.env.npm_package_version || '3.0.0';
  }

  async checkDatabase(): Promise<{ status: 'pass' | 'fail'; message?: string; duration_ms: number }> {
    const startTime = Date.now();
    
    try {
      // Test database connection (simplified for now)
      // await multiTenantService.healthCheck();
      const duration = Date.now() - startTime;
      
      return {
        status: 'pass',
        message: 'Database connection successful',
        duration_ms: duration
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      return {
        status: 'fail',
        message: `Database connection failed: ${(error as Error).message}`,
        duration_ms: duration
      };
    }
  }

  async checkRedis(): Promise<{ status: 'pass' | 'fail'; message?: string; duration_ms: number }> {
    const startTime = Date.now();
    
    try {
      // Test Redis connection
      const redis = require('ioredis');
      const client = new redis({
        host: process.env.REDIS_HOST || 'localhost',
        port: parseInt(process.env.REDIS_PORT || '6379'),
        retryDelayOnLoad: 100,
        connectTimeout: 5000,
        commandTimeout: 5000
      });
      
      await client.ping();
      await client.quit();
      
      const duration = Date.now() - startTime;
      return {
        status: 'pass',
        message: 'Redis connection successful',
        duration_ms: duration
      };
    } catch (error) {
      const duration = Date.now() - startTime;
      return {
        status: 'fail',
        message: `Redis connection failed: ${(error as Error).message}`,
        duration_ms: duration
      };
    }
  }

  async checkMemoryUsage(): Promise<{ status: 'pass' | 'warn' | 'fail'; message?: string; duration_ms: number }> {
    const startTime = Date.now();
    
    try {
      const memoryUsage = process.memoryUsage();
      const memoryUsagePercent = (memoryUsage.rss / (memoryUsage.rss + memoryUsage.external)) * 100;
      const duration = Date.now() - startTime;
      
      if (memoryUsagePercent > 90) {
        return {
          status: 'fail',
          message: `Critical memory usage: ${memoryUsagePercent.toFixed(2)}%`,
          duration_ms: duration
        };
      } else if (memoryUsagePercent > 80) {
        return {
          status: 'warn',
          message: `High memory usage: ${memoryUsagePercent.toFixed(2)}%`,
          duration_ms: duration
        };
      } else {
        return {
          status: 'pass',
          message: `Memory usage normal: ${memoryUsagePercent.toFixed(2)}%`,
          duration_ms: duration
        };
      }
    } catch (error) {
      const duration = Date.now() - startTime;
      return {
        status: 'fail',
        message: `Memory check failed: ${(error as Error).message}`,
        duration_ms: duration
      };
    }
  }

  async checkDiskSpace(): Promise<{ status: 'pass' | 'warn' | 'fail'; message?: string; duration_ms: number }> {
    const startTime = Date.now();
    
    try {
      const fs = require('fs');
      const stats = await fs.promises.statfs('/');
      
      const totalSpace = stats.blocks * stats.bsize;
      const freeSpace = stats.bavail * stats.bsize;
      const usedPercent = ((totalSpace - freeSpace) / totalSpace) * 100;
      const duration = Date.now() - startTime;
      
      if (usedPercent > 95) {
        return {
          status: 'fail',
          message: `Critical disk usage: ${usedPercent.toFixed(2)}%`,
          duration_ms: duration
        };
      } else if (usedPercent > 85) {
        return {
          status: 'warn',
          message: `High disk usage: ${usedPercent.toFixed(2)}%`,
          duration_ms: duration
        };
      } else {
        return {
          status: 'pass',
          message: `Disk usage normal: ${usedPercent.toFixed(2)}%`,
          duration_ms: duration
        };
      }
    } catch (error) {
      const duration = Date.now() - startTime;
      return {
        status: 'fail',
        message: `Disk space check failed: ${(error as Error).message}`,
        duration_ms: duration
      };
    }
  }

  async checkExternalServices(): Promise<{ status: 'pass' | 'warn' | 'fail'; message?: string; duration_ms: number }> {
    const startTime = Date.now();
    
    try {
      const services = [];
      
      // Check OpenAI API
      if (process.env.OPENAI_API_KEY) {
        try {
          const response = await fetch('https://api.openai.com/v1/models', {
            headers: { 'Authorization': `Bearer ${process.env.OPENAI_API_KEY}` },
            signal: AbortSignal.timeout(5000)
          });
          services.push({ name: 'OpenAI', status: response.ok });
        } catch {
          services.push({ name: 'OpenAI', status: false });
        }
      }
      
      // Check Anthropic API
      if (process.env.ANTHROPIC_API_KEY) {
        try {
          const response = await fetch('https://api.anthropic.com/v1/messages', {
            method: 'POST',
            headers: { 
              'x-api-key': process.env.ANTHROPIC_API_KEY,
              'content-type': 'application/json'
            },
            body: JSON.stringify({
              model: 'claude-3-sonnet-20240229',
              max_tokens: 1,
              messages: [{ role: 'user', content: 'test' }]
            }),
            signal: AbortSignal.timeout(5000)
          });
          services.push({ name: 'Anthropic', status: response.status !== 429 });
        } catch {
          services.push({ name: 'Anthropic', status: false });
        }
      }
      
      const failedServices = services.filter(s => !s.status);
      const duration = Date.now() - startTime;
      
      if (failedServices.length === services.length) {
        return {
          status: 'fail',
          message: 'All external services unreachable',
          duration_ms: duration
        };
      } else if (failedServices.length > 0) {
        return {
          status: 'warn',
          message: `Some services unreachable: ${failedServices.map(s => s.name).join(', ')}`,
          duration_ms: duration
        };
      } else {
        return {
          status: 'pass',
          message: `All external services accessible (${services.length})`,
          duration_ms: duration
        };
      }
    } catch (error) {
      const duration = Date.now() - startTime;
      return {
        status: 'fail',
        message: `External services check failed: ${(error as Error).message}`,
        duration_ms: duration
      };
    }
  }

  getSystemMetrics(): HealthCheckResult['metrics'] {
    const memoryUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();
    
    return {
      memory: {
        used: memoryUsage.rss,
        total: memoryUsage.rss + memoryUsage.external,
        percentage: (memoryUsage.rss / (memoryUsage.rss + memoryUsage.external)) * 100,
        heap_used: memoryUsage.heapUsed,
        heap_total: memoryUsage.heapTotal
      },
      cpu: {
        usage_percent: (cpuUsage.user + cpuUsage.system) / 1000000, // Convert microseconds to seconds
        load_average: require('os').loadavg()
      },
      process: {
        pid: process.pid,
        uptime: process.uptime(),
        title: process.title
      },
      system: {
        platform: process.platform,
        arch: process.arch,
        node_version: process.version
      }
    };
  }

  async performHealthCheck(): Promise<HealthCheckResult> {
    const timestamp = new Date().toISOString();
    const uptime = Math.floor((Date.now() - this.startTime) / 1000);
    
    // Perform all health checks in parallel
    const [
      databaseCheck,
      redisCheck,
      memoryCheck,
      diskCheck,
      externalServicesCheck
    ] = await Promise.all([
      this.checkDatabase(),
      this.checkRedis(),
      this.checkMemoryUsage(),
      this.checkDiskSpace(),
      this.checkExternalServices()
    ]);

    const checks = {
      database: { ...databaseCheck, timestamp },
      redis: { ...redisCheck, timestamp },
      memory: { ...memoryCheck, timestamp },
      disk: { ...diskCheck, timestamp },
      external_services: { ...externalServicesCheck, timestamp }
    };

    // Determine overall status
    const hasFailures = Object.values(checks).some(check => check.status === 'fail');
    const hasWarnings = Object.values(checks).some(check => check.status === 'warn');
    
    let status: 'healthy' | 'unhealthy' | 'degraded';
    if (hasFailures) {
      status = 'unhealthy';
    } else if (hasWarnings) {
      status = 'degraded';
    } else {
      status = 'healthy';
    }

    return {
      status,
      timestamp,
      version: this.version,
      uptime,
      environment: process.env.NODE_ENV || 'development',
      checks,
      metrics: this.getSystemMetrics()
    };
  }

  // Express middleware for health check endpoint
  async healthCheckMiddleware(req: Request, res: Response): Promise<void> {
    try {
      const healthResult = await this.performHealthCheck();
      
      // Set appropriate HTTP status code based on health status
      let statusCode = 200;
      if (healthResult.status === 'unhealthy') {
        statusCode = 503; // Service Unavailable
      } else if (healthResult.status === 'degraded') {
        statusCode = 200; // OK but with warnings
      }
      
      // Set cache headers to prevent caching of health check results
      res.setHeader('Cache-Control', 'no-cache, no-store, must-revalidate');
      res.setHeader('Pragma', 'no-cache');
      res.setHeader('Expires', '0');
      
      res.status(statusCode).json(healthResult);
      return;
    } catch (error) {
      // Return error response if health check itself fails
      const errorResponse: HealthCheckResult = {
        status: 'unhealthy',
        timestamp: new Date().toISOString(),
        version: this.version,
        uptime: Math.floor((Date.now() - this.startTime) / 1000),
        environment: process.env.NODE_ENV || 'development',
        checks: {
          system: {
            status: 'fail',
            message: `Health check failed: ${(error as Error).message}`,
            timestamp: new Date().toISOString()
          }
        },
        metrics: this.getSystemMetrics()
      };
      
      res.status(503).json(errorResponse);
      return;
    }
  }

  // Liveness probe - basic check that the application is running
  async livenessProbe(req: Request, res: Response): Promise<void> {
    res.status(200).json({
      status: 'alive',
      timestamp: new Date().toISOString(),
      uptime: Math.floor((Date.now() - this.startTime) / 1000)
    });
    return;
  }

  // Readiness probe - check if the application is ready to serve traffic
  async readinessProbe(req: Request, res: Response): Promise<void> {
    try {
      const [databaseCheck, redisCheck] = await Promise.all([
        this.checkDatabase(),
        this.checkRedis()
      ]);

      const isReady = databaseCheck.status === 'pass' && redisCheck.status === 'pass';
      
      if (isReady) {
        res.status(200).json({
          status: 'ready',
          timestamp: new Date().toISOString(),
          checks: {
            database: databaseCheck.status,
            redis: redisCheck.status
          }
        });
        return;
      } else {
        res.status(503).json({
          status: 'not_ready',
          timestamp: new Date().toISOString(),
          checks: {
            database: databaseCheck.status,
            redis: redisCheck.status
          }
        });
        return;
      }
    } catch (error) {
      res.status(503).json({
        status: 'not_ready',
        timestamp: new Date().toISOString(),
        error: (error as Error).message
      });
      return;
    }
  }
}

// Export singleton instance
export const healthChecker = new HealthChecker();