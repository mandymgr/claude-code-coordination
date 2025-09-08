import { EventEmitter } from 'events';
import { Pool, PoolClient, PoolConfig } from 'pg';
import { createClient, createCluster } from 'redis';
import type { RedisClientType, RedisClusterType } from 'redis';

export interface ConnectionPoolOptions {
  postgresql: {
    max: number;
    min: number;
    idleTimeoutMillis: number;
    connectionTimeoutMillis: number;
    statementTimeout: number;
    queryTimeout: number;
    maxRetries: number;
    retryDelay: number;
  };
  redis: {
    maxConnections: number;
    minConnections: number;
    idleTimeoutMs: number;
    commandTimeout: number;
    connectTimeout: number;
    maxRetries: number;
    retryDelay: number;
  };
  monitoring: {
    enabled: boolean;
    metricsInterval: number;
    slowQueryThreshold: number;
  };
}

export interface PoolMetrics {
  postgresql: {
    totalConnections: number;
    idleConnections: number;
    waitingClients: number;
    totalQueries: number;
    slowQueries: number;
    errorCount: number;
    averageQueryTime: number;
  };
  redis: {
    connectedClients: number;
    commandsSent: number;
    commandsProcessed: number;
    errorCount: number;
    averageCommandTime: number;
    memoryUsage: number;
  };
  uptime: number;
}

export class OptimizedConnectionPool extends EventEmitter {
  private pgPool: Pool;
  private redisClients: Map<string, RedisClientType | RedisClusterType> = new Map();
  private options: ConnectionPoolOptions;
  private metrics: PoolMetrics;
  private startTime: Date;
  private metricsTimer: NodeJS.Timeout | null = null;
  private queryTimes: number[] = [];
  private commandTimes: number[] = [];

  constructor(options: Partial<ConnectionPoolOptions> = {}) {
    super();
    
    this.options = {
      postgresql: {
        max: 20,
        min: 2,
        idleTimeoutMillis: 30000,
        connectionTimeoutMillis: 10000,
        statementTimeout: 30000,
        queryTimeout: 30000,
        maxRetries: 3,
        retryDelay: 1000,
        ...options.postgresql
      },
      redis: {
        maxConnections: 10,
        minConnections: 2,
        idleTimeoutMs: 30000,
        commandTimeout: 10000,
        connectTimeout: 10000,
        maxRetries: 3,
        retryDelay: 1000,
        ...options.redis
      },
      monitoring: {
        enabled: true,
        metricsInterval: 60000, // 1 minute
        slowQueryThreshold: 1000, // 1 second
        ...options.monitoring
      }
    };

    this.startTime = new Date();
    this.initializeMetrics();
    this.initializePostgreSQL();
    this.initializeRedis();
    
    if (this.options.monitoring.enabled) {
      this.startMonitoring();
    }
  }

  private initializeMetrics(): void {
    this.metrics = {
      postgresql: {
        totalConnections: 0,
        idleConnections: 0,
        waitingClients: 0,
        totalQueries: 0,
        slowQueries: 0,
        errorCount: 0,
        averageQueryTime: 0
      },
      redis: {
        connectedClients: 0,
        commandsSent: 0,
        commandsProcessed: 0,
        errorCount: 0,
        averageCommandTime: 0,
        memoryUsage: 0
      },
      uptime: 0
    };
  }

  private initializePostgreSQL(): void {
    const pgConfig: PoolConfig = {
      host: process.env.POSTGRES_HOST || 'localhost',
      port: parseInt(process.env.POSTGRES_PORT || '5432'),
      database: process.env.POSTGRES_DB || 'claude_coordination',
      user: process.env.POSTGRES_USER || 'claude',
      password: process.env.POSTGRES_PASSWORD,
      max: this.options.postgresql.max,
      min: this.options.postgresql.min,
      idleTimeoutMillis: this.options.postgresql.idleTimeoutMillis,
      connectionTimeoutMillis: this.options.postgresql.connectionTimeoutMillis,
      statement_timeout: this.options.postgresql.statementTimeout,
      query_timeout: this.options.postgresql.queryTimeout,
      
      // Advanced configuration
      keepAlive: true,
      keepAliveInitialDelayMillis: 10000,
      
      // SSL configuration for production
      ssl: process.env.NODE_ENV === 'production' ? {
        rejectUnauthorized: false // Configure based on your SSL setup
      } : false
    };

    this.pgPool = new Pool(pgConfig);

    // Setup pool event listeners
    this.pgPool.on('connect', () => {
      console.log('[ConnectionPool] PostgreSQL client connected');
      this.emit('pgConnect');
    });

    this.pgPool.on('error', (err) => {
      console.error('[ConnectionPool] PostgreSQL pool error:', err);
      this.metrics.postgresql.errorCount++;
      this.emit('pgError', err);
    });

    this.pgPool.on('remove', () => {
      console.log('[ConnectionPool] PostgreSQL client removed');
      this.emit('pgDisconnect');
    });

    console.log(`[ConnectionPool] PostgreSQL pool initialized with ${this.options.postgresql.min}-${this.options.postgresql.max} connections`);
  }

  private initializeRedis(): void {
    // Primary Redis client
    this.createRedisClient('primary', {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
      db: 0,
      commandTimeout: this.options.redis.commandTimeout,
      connectTimeout: this.options.redis.connectTimeout,
      retryDelayOnFailover: this.options.redis.retryDelay,
      maxRetriesPerRequest: this.options.redis.maxRetries,
      
      // Connection pool settings
      family: 4,
      keepAlive: true,
      
      // Performance optimizations
      lazyConnect: true,
      maxLoadingTimeout: 3000
    });

    // Pub/Sub Redis client
    this.createRedisClient('pubsub', {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
      db: 1,
      commandTimeout: this.options.redis.commandTimeout,
      connectTimeout: this.options.redis.connectTimeout,
      retryDelayOnFailover: this.options.redis.retryDelay,
      maxRetriesPerRequest: this.options.redis.maxRetries,
      
      lazyConnect: true
    });

    // Cache Redis client  
    this.createRedisClient('cache', {
      host: process.env.REDIS_HOST || 'localhost',
      port: parseInt(process.env.REDIS_PORT || '6379'),
      password: process.env.REDIS_PASSWORD,
      db: 2,
      commandTimeout: this.options.redis.commandTimeout,
      connectTimeout: this.options.redis.connectTimeout,
      retryDelayOnFailover: this.options.redis.retryDelay,
      maxRetriesPerRequest: this.options.redis.maxRetries,
      
      lazyConnect: true
    });

    console.log('[ConnectionPool] Redis clients initialized');
  }

  private createRedisClient(name: string, config: RedisOptions): void {
    const client = new Redis(config);

    client.on('connect', () => {
      console.log(`[ConnectionPool] Redis ${name} client connected`);
      this.emit('redisConnect', name);
    });

    client.on('error', (err) => {
      console.error(`[ConnectionPool] Redis ${name} client error:`, err);
      this.metrics.redis.errorCount++;
      this.emit('redisError', { name, error: err });
    });

    client.on('close', () => {
      console.log(`[ConnectionPool] Redis ${name} client disconnected`);
      this.emit('redisDisconnect', name);
    });

    this.redisClients.set(name, client);
  }

  private startMonitoring(): void {
    this.metricsTimer = setInterval(() => {
      this.updateMetrics();
      this.emit('metricsUpdated', this.metrics);
    }, this.options.monitoring.metricsInterval);

    console.log(`[ConnectionPool] Monitoring started (interval: ${this.options.monitoring.metricsInterval}ms)`);
  }

  private updateMetrics(): void {
    // PostgreSQL metrics
    this.metrics.postgresql.totalConnections = this.pgPool.totalCount;
    this.metrics.postgresql.idleConnections = this.pgPool.idleCount;
    this.metrics.postgresql.waitingClients = this.pgPool.waitingCount;
    
    // Calculate average query time
    if (this.queryTimes.length > 0) {
      this.metrics.postgresql.averageQueryTime = 
        this.queryTimes.reduce((sum, time) => sum + time, 0) / this.queryTimes.length;
      
      // Keep only last 100 query times
      if (this.queryTimes.length > 100) {
        this.queryTimes = this.queryTimes.slice(-100);
      }
    }

    // Redis metrics
    const primaryRedis = this.redisClients.get('primary');
    if (primaryRedis && primaryRedis.status === 'ready') {
      this.metrics.redis.connectedClients = this.redisClients.size;
    }

    // Calculate average command time  
    if (this.commandTimes.length > 0) {
      this.metrics.redis.averageCommandTime = 
        this.commandTimes.reduce((sum, time) => sum + time, 0) / this.commandTimes.length;
      
      // Keep only last 100 command times
      if (this.commandTimes.length > 100) {
        this.commandTimes = this.commandTimes.slice(-100);
      }
    }

    // Update uptime
    this.metrics.uptime = Date.now() - this.startTime.getTime();
  }

  /**
   * Execute PostgreSQL query with retry logic and monitoring
   */
  public async query<T = any>(
    text: string, 
    params?: any[], 
    options: { 
      timeout?: number, 
      retries?: number,
      priority?: 'low' | 'normal' | 'high' 
    } = {}
  ): Promise<T> {
    const startTime = Date.now();
    const timeout = options.timeout || this.options.postgresql.queryTimeout;
    const maxRetries = options.retries || this.options.postgresql.maxRetries;
    
    let lastError: Error | null = null;
    
    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      let client: PoolClient | null = null;
      
      try {
        // Get client with timeout
        client = await Promise.race([
          this.pgPool.connect(),
          new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error('Connection timeout')), timeout)
          )
        ]);

        // Execute query with timeout
        const result = await Promise.race([
          client.query(text, params),
          new Promise<never>((_, reject) => 
            setTimeout(() => reject(new Error('Query timeout')), timeout)
          )
        ]);

        const queryTime = Date.now() - startTime;
        this.queryTimes.push(queryTime);
        
        this.metrics.postgresql.totalQueries++;
        
        // Check for slow queries
        if (queryTime > this.options.monitoring.slowQueryThreshold) {
          this.metrics.postgresql.slowQueries++;
          console.warn(`[ConnectionPool] Slow query detected (${queryTime}ms): ${text.substring(0, 100)}...`);
          this.emit('slowQuery', { text, params, time: queryTime });
        }

        this.emit('queryExecuted', { text, params, time: queryTime, rows: result.rowCount });
        return result as T;
        
      } catch (error) {
        lastError = error as Error;
        console.error(`[ConnectionPool] Query attempt ${attempt + 1} failed:`, error);
        
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, this.options.postgresql.retryDelay * (attempt + 1)));
        }
      } finally {
        if (client) {
          client.release();
        }
      }
    }

    this.metrics.postgresql.errorCount++;
    this.emit('queryError', { text, params, error: lastError });
    throw lastError;
  }

  /**
   * Execute Redis command with retry logic and monitoring
   */
  public async redisCommand<T = any>(
    clientName: string,
    command: string,
    ...args: any[]
  ): Promise<T> {
    const startTime = Date.now();
    const client = this.redisClients.get(clientName);
    
    if (!client) {
      throw new Error(`[ConnectionPool] Redis client '${clientName}' not found`);
    }

    const maxRetries = this.options.redis.maxRetries;
    let lastError: Error | null = null;

    for (let attempt = 0; attempt <= maxRetries; attempt++) {
      try {
        this.metrics.redis.commandsSent++;
        
        // Execute command
        const result = await (client as any)[command.toLowerCase()](...args);
        
        const commandTime = Date.now() - startTime;
        this.commandTimes.push(commandTime);
        this.metrics.redis.commandsProcessed++;

        this.emit('redisCommandExecuted', { 
          client: clientName, 
          command, 
          args, 
          time: commandTime 
        });
        
        return result;
        
      } catch (error) {
        lastError = error as Error;
        console.error(`[ConnectionPool] Redis command attempt ${attempt + 1} failed:`, error);
        
        if (attempt < maxRetries) {
          await new Promise(resolve => setTimeout(resolve, this.options.redis.retryDelay * (attempt + 1)));
        }
      }
    }

    this.metrics.redis.errorCount++;
    this.emit('redisCommandError', { client: clientName, command, args, error: lastError });
    throw lastError;
  }

  /**
   * Get Redis client by name
   */
  public getRedisClient(name: string): Redis | Cluster | null {
    return this.redisClients.get(name) || null;
  }

  /**
   * Get PostgreSQL pool
   */
  public getPostgreSQLPool(): Pool {
    return this.pgPool;
  }

  /**
   * Get current pool metrics
   */
  public getMetrics(): PoolMetrics {
    this.updateMetrics();
    return { ...this.metrics };
  }

  /**
   * Health check for all connections
   */
  public async healthCheck(): Promise<{
    postgresql: { status: string; latency?: number; error?: string };
    redis: Record<string, { status: string; latency?: number; error?: string }>;
  }> {
    const health = {
      postgresql: { status: 'unknown' as string, latency: undefined as number | undefined, error: undefined as string | undefined },
      redis: {} as Record<string, { status: string; latency?: number; error?: string }>
    };

    // PostgreSQL health check
    try {
      const start = Date.now();
      await this.query('SELECT 1');
      health.postgresql = { status: 'healthy', latency: Date.now() - start };
    } catch (error) {
      health.postgresql = { 
        status: 'unhealthy', 
        error: error instanceof Error ? error.message : 'Unknown error' 
      };
    }

    // Redis health checks
    for (const [name, client] of this.redisClients) {
      try {
        const start = Date.now();
        await client.ping();
        health.redis[name] = { status: 'healthy', latency: Date.now() - start };
      } catch (error) {
        health.redis[name] = { 
          status: 'unhealthy', 
          error: error instanceof Error ? error.message : 'Unknown error' 
        };
      }
    }

    return health;
  }

  /**
   * Graceful shutdown
   */
  public async dispose(): Promise<void> {
    console.log('[ConnectionPool] Starting graceful shutdown...');
    
    // Stop monitoring
    if (this.metricsTimer) {
      clearInterval(this.metricsTimer);
      this.metricsTimer = null;
    }

    // Close Redis connections
    const redisPromises = Array.from(this.redisClients.entries()).map(async ([name, client]) => {
      try {
        await client.quit();
        console.log(`[ConnectionPool] Redis ${name} client disconnected`);
      } catch (error) {
        console.error(`[ConnectionPool] Error closing Redis ${name} client:`, error);
      }
    });

    await Promise.all(redisPromises);
    this.redisClients.clear();

    // Close PostgreSQL pool
    try {
      await this.pgPool.end();
      console.log('[ConnectionPool] PostgreSQL pool closed');
    } catch (error) {
      console.error('[ConnectionPool] Error closing PostgreSQL pool:', error);
    }

    console.log('[ConnectionPool] Graceful shutdown completed');
  }
}

// Global connection pool instance
export const globalConnectionPool = new OptimizedConnectionPool({
  postgresql: {
    max: parseInt(process.env.PG_POOL_MAX || '20'),
    min: parseInt(process.env.PG_POOL_MIN || '2'),
    idleTimeoutMillis: parseInt(process.env.PG_IDLE_TIMEOUT || '30000'),
    connectionTimeoutMillis: parseInt(process.env.PG_CONNECTION_TIMEOUT || '10000'),
    statementTimeout: parseInt(process.env.PG_STATEMENT_TIMEOUT || '30000'),
    queryTimeout: parseInt(process.env.PG_QUERY_TIMEOUT || '30000'),
    maxRetries: parseInt(process.env.PG_MAX_RETRIES || '3'),
    retryDelay: parseInt(process.env.PG_RETRY_DELAY || '1000')
  },
  redis: {
    maxConnections: parseInt(process.env.REDIS_POOL_MAX || '10'),
    minConnections: parseInt(process.env.REDIS_POOL_MIN || '2'),
    idleTimeoutMs: parseInt(process.env.REDIS_IDLE_TIMEOUT || '30000'),
    commandTimeout: parseInt(process.env.REDIS_COMMAND_TIMEOUT || '10000'),
    connectTimeout: parseInt(process.env.REDIS_CONNECT_TIMEOUT || '10000'),
    maxRetries: parseInt(process.env.REDIS_MAX_RETRIES || '3'),
    retryDelay: parseInt(process.env.REDIS_RETRY_DELAY || '1000')
  },
  monitoring: {
    enabled: process.env.POOL_MONITORING !== 'false',
    metricsInterval: parseInt(process.env.POOL_METRICS_INTERVAL || '60000'),
    slowQueryThreshold: parseInt(process.env.SLOW_QUERY_THRESHOLD || '1000')
  }
});

// Graceful shutdown
process.on('SIGINT', async () => {
  await globalConnectionPool.dispose();
});

process.on('SIGTERM', async () => {
  await globalConnectionPool.dispose();
});