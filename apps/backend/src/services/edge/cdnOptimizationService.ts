import { EventEmitter } from 'events';
import { EdgeComputingService, EdgeNode, CDNConfiguration } from './edgeComputingService';

export interface OptimizationRule {
  id: string;
  name: string;
  description: string;
  type: 'caching' | 'compression' | 'image' | 'routing' | 'security' | 'performance';
  conditions: {
    pathPatterns?: string[];
    userAgent?: string[];
    country?: string[];
    timeOfDay?: { start: string; end: string };
    requestFrequency?: { threshold: number; window: number };
    fileSize?: { min?: number; max?: number };
    responseTime?: { threshold: number };
  };
  actions: {
    cache?: {
      ttl: number;
      vary: string[];
      key: string[];
      bypass?: boolean;
    };
    compress?: {
      algorithms: ('gzip' | 'brotli')[];
      level: number;
      minSize: number;
    };
    optimize?: {
      images?: {
        format: 'auto' | 'webp' | 'avif' | 'jpeg' | 'png';
        quality: number;
        resize?: { width?: number; height?: number };
      };
      css?: {
        minify: boolean;
        inlineSmall: boolean;
        removeUnused: boolean;
      };
      javascript?: {
        minify: boolean;
        bundle: boolean;
        treeshaking: boolean;
      };
    };
    route?: {
      preferredNodes: string[];
      loadBalancing: 'round-robin' | 'latency' | 'load' | 'geo';
      healthCheck: boolean;
    };
    security?: {
      rateLimiting?: {
        requests: number;
        window: number;
        action: 'block' | 'throttle';
      };
      headers?: Record<string, string>;
      blocking?: {
        ips: string[];
        userAgents: string[];
        referrers: string[];
      };
    };
  };
  priority: number;
  isActive: boolean;
  metrics: {
    appliedCount: number;
    successRate: number;
    performanceImpact: number;
    lastApplied?: Date;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface CacheStrategy {
  id: string;
  name: string;
  type: 'static' | 'dynamic' | 'api' | 'streaming' | 'edge-side-includes';
  configuration: {
    defaultTtl: number;
    maxTtl: number;
    staleWhileRevalidate: number;
    varyHeaders: string[];
    cacheKeyRules: {
      include: string[];
      exclude: string[];
      normalize: boolean;
    };
    invalidation: {
      patterns: string[];
      webhook?: string;
      automatic: boolean;
    };
    storage: {
      maxSize: string;
      evictionPolicy: 'lru' | 'lfu' | 'ttl' | 'size';
      compression: boolean;
    };
  };
  performance: {
    hitRatio: number;
    missRatio: number;
    storageUtilization: number;
    averageServeTime: number;
    bandwidthSaved: number;
    costSavings: number;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TrafficPattern {
  id: string;
  name: string;
  pattern: 'surge' | 'gradual' | 'periodic' | 'geographic' | 'seasonal' | 'event-driven';
  detection: {
    metrics: ('requests' | 'bandwidth' | 'latency' | 'errors')[];
    thresholds: {
      increase: number; // percentage
      timeWindow: number; // minutes
      significance: number; // minimum volume
    };
    locations?: string[];
    timeRanges?: { start: string; end: string; days: string[] }[];
  };
  response: {
    scaling: {
      nodes: number;
      resources: {
        cpu: number;
        memory: number;
        bandwidth: number;
      };
    };
    caching: {
      increaseTtl: boolean;
      preload: string[];
      purgePattern: string[];
    };
    routing: {
      redistribution: boolean;
      fallbackNodes: string[];
      loadBalancingAdjustment: number;
    };
  };
  status: 'monitoring' | 'detected' | 'responding' | 'resolved';
  lastDetected?: Date;
  occurrences: {
    timestamp: Date;
    magnitude: number;
    duration: number;
    impactNodes: string[];
    responseActions: string[];
  }[];
}

export interface PerformanceOptimization {
  id: string;
  name: string;
  category: 'image' | 'css' | 'javascript' | 'font' | 'video' | 'api' | 'general';
  techniques: {
    lazyLoading?: {
      images: boolean;
      videos: boolean;
      iframes: boolean;
      threshold: number; // pixels
    };
    prefetching?: {
      dns: boolean;
      preconnect: string[];
      preload: string[];
      prefetch: string[];
    };
    bundling?: {
      css: boolean;
      javascript: boolean;
      critical: boolean;
      async: boolean;
    };
    optimization?: {
      images: {
        format: 'auto' | 'webp' | 'avif';
        quality: number;
        progressive: boolean;
        responsive: boolean;
      };
      fonts: {
        preload: boolean;
        display: 'auto' | 'block' | 'swap' | 'fallback' | 'optional';
        subset: boolean;
      };
      videos: {
        streaming: boolean;
        adaptive: boolean;
        preload: 'none' | 'metadata' | 'auto';
      };
    };
  };
  impact: {
    loadTimeReduction: number; // percentage
    bandwidthSaving: number; // percentage
    coreWebVitals: {
      lcp: number; // Largest Contentful Paint improvement
      fid: number; // First Input Delay improvement
      cls: number; // Cumulative Layout Shift improvement
    };
  };
  implementation: {
    automatic: boolean;
    requiresReview: boolean;
    rollback: boolean;
    testingRequired: boolean;
  };
  status: 'proposed' | 'testing' | 'deployed' | 'monitoring' | 'completed';
  createdAt: Date;
  updatedAt: Date;
}

export interface GlobalLoadBalancing {
  id: string;
  name: string;
  algorithm: 'round-robin' | 'weighted' | 'latency-based' | 'geo-routing' | 'load-based' | 'hybrid';
  configuration: {
    healthCheck: {
      interval: number; // seconds
      timeout: number; // seconds
      retries: number;
      url: string;
      expectedStatus: number[];
    };
    failover: {
      enabled: boolean;
      threshold: number; // percentage of failed health checks
      fallbackNodes: string[];
      automaticFailback: boolean;
    };
    weights?: Record<string, number>; // nodeId -> weight
    geoRouting?: {
      regions: {
        name: string;
        countries: string[];
        primaryNodes: string[];
        backupNodes: string[];
      }[];
      fallbackStrategy: 'closest' | 'lowest-latency' | 'least-loaded';
    };
    stickiness?: {
      enabled: boolean;
      duration: number; // seconds
      key: 'ip' | 'session' | 'cookie';
    };
  };
  metrics: {
    totalRequests: number;
    nodeDistribution: Record<string, number>;
    failoverEvents: number;
    averageLatency: number;
    healthCheckSuccessRate: number;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export class CDNOptimizationService extends EventEmitter {
  private edgeService: EdgeComputingService;
  private optimizationRules: Map<string, OptimizationRule> = new Map();
  private cacheStrategies: Map<string, CacheStrategy> = new Map();
  private trafficPatterns: Map<string, TrafficPattern> = new Map();
  private performanceOptimizations: Map<string, PerformanceOptimization> = new Map();
  private loadBalancers: Map<string, GlobalLoadBalancing> = new Map();
  private monitoringInterval: NodeJS.Timeout;

  constructor(edgeService: EdgeComputingService) {
    super();
    this.edgeService = edgeService;
    this.setupDefaultRules();
    this.setupDefaultStrategies();
    this.startMonitoring();
  }

  private setupDefaultRules(): void {
    // Static asset caching rule
    const staticCachingRule: OptimizationRule = {
      id: 'static-assets-cache',
      name: 'Static Assets Caching',
      description: 'Cache static assets like images, CSS, JS for optimal performance',
      type: 'caching',
      conditions: {
        pathPatterns: ['*.jpg', '*.jpeg', '*.png', '*.gif', '*.svg', '*.css', '*.js', '*.woff*', '*.ttf'],
        fileSize: { max: 50 * 1024 * 1024 } // 50MB
      },
      actions: {
        cache: {
          ttl: 86400 * 30, // 30 days
          vary: ['Accept-Encoding'],
          key: ['url', 'version'],
          bypass: false
        },
        compress: {
          algorithms: ['brotli', 'gzip'],
          level: 6,
          minSize: 1024
        }
      },
      priority: 100,
      isActive: true,
      metrics: {
        appliedCount: 0,
        successRate: 100,
        performanceImpact: 85
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // API response caching rule
    const apiCachingRule: OptimizationRule = {
      id: 'api-response-cache',
      name: 'API Response Caching',
      description: 'Cache API responses with short TTL for improved performance',
      type: 'caching',
      conditions: {
        pathPatterns: ['/api/*'],
        requestFrequency: { threshold: 100, window: 300 } // 100 requests in 5 minutes
      },
      actions: {
        cache: {
          ttl: 300, // 5 minutes
          vary: ['Authorization', 'Accept'],
          key: ['url', 'method', 'user-id'],
          bypass: false
        }
      },
      priority: 80,
      isActive: true,
      metrics: {
        appliedCount: 0,
        successRate: 95,
        performanceImpact: 40
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Image optimization rule
    const imageOptimizationRule: OptimizationRule = {
      id: 'image-optimization',
      name: 'Image Optimization',
      description: 'Automatically optimize images for better performance',
      type: 'image',
      conditions: {
        pathPatterns: ['*.jpg', '*.jpeg', '*.png'],
        fileSize: { min: 10240 } // 10KB minimum
      },
      actions: {
        optimize: {
          images: {
            format: 'auto',
            quality: 85,
            resize: { width: 1920 } // Max width
          }
        }
      },
      priority: 70,
      isActive: true,
      metrics: {
        appliedCount: 0,
        successRate: 98,
        performanceImpact: 60
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.optimizationRules.set(staticCachingRule.id, staticCachingRule);
    this.optimizationRules.set(apiCachingRule.id, apiCachingRule);
    this.optimizationRules.set(imageOptimizationRule.id, imageOptimizationRule);
  }

  private setupDefaultStrategies(): void {
    // Static content cache strategy
    const staticCacheStrategy: CacheStrategy = {
      id: 'static-content',
      name: 'Static Content Caching',
      type: 'static',
      configuration: {
        defaultTtl: 86400, // 1 day
        maxTtl: 86400 * 365, // 1 year
        staleWhileRevalidate: 86400 * 7, // 7 days
        varyHeaders: ['Accept-Encoding', 'Accept'],
        cacheKeyRules: {
          include: ['url', 'query', 'method'],
          exclude: ['utm_*', 'fbclid', 'gclid'],
          normalize: true
        },
        invalidation: {
          patterns: ['/*'],
          automatic: false
        },
        storage: {
          maxSize: '10GB',
          evictionPolicy: 'lru',
          compression: true
        }
      },
      performance: {
        hitRatio: 85,
        missRatio: 15,
        storageUtilization: 65,
        averageServeTime: 25,
        bandwidthSaved: 70,
        costSavings: 45
      },
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    // Dynamic content cache strategy
    const dynamicCacheStrategy: CacheStrategy = {
      id: 'dynamic-content',
      name: 'Dynamic Content Caching',
      type: 'dynamic',
      configuration: {
        defaultTtl: 300, // 5 minutes
        maxTtl: 3600, // 1 hour
        staleWhileRevalidate: 600, // 10 minutes
        varyHeaders: ['Authorization', 'Accept-Language', 'User-Agent'],
        cacheKeyRules: {
          include: ['url', 'method', 'user-type'],
          exclude: ['timestamp', 'nonce'],
          normalize: true
        },
        invalidation: {
          patterns: ['/api/*', '/user/*'],
          webhook: '/invalidate',
          automatic: true
        },
        storage: {
          maxSize: '5GB',
          evictionPolicy: 'ttl',
          compression: true
        }
      },
      performance: {
        hitRatio: 60,
        missRatio: 40,
        storageUtilization: 45,
        averageServeTime: 50,
        bandwidthSaved: 35,
        costSavings: 25
      },
      isActive: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.cacheStrategies.set(staticCacheStrategy.id, staticCacheStrategy);
    this.cacheStrategies.set(dynamicCacheStrategy.id, dynamicCacheStrategy);
  }

  private startMonitoring(): void {
    this.monitoringInterval = setInterval(async () => {
      await this.detectTrafficPatterns();
      await this.optimizePerformance();
      await this.balanceLoad();
    }, 60000); // Every minute
  }

  async createOptimizationRule(ruleData: Omit<OptimizationRule, 'id' | 'metrics' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const ruleId = `rule_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const rule: OptimizationRule = {
      ...ruleData,
      id: ruleId,
      metrics: {
        appliedCount: 0,
        successRate: 100,
        performanceImpact: 0
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.optimizationRules.set(ruleId, rule);

    this.emit('optimizationRuleCreated', {
      ruleId,
      timestamp: new Date(),
      rule
    });

    return ruleId;
  }

  async createCacheStrategy(strategyData: Omit<CacheStrategy, 'id' | 'performance' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const strategyId = `strategy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const strategy: CacheStrategy = {
      ...strategyData,
      id: strategyId,
      performance: {
        hitRatio: 0,
        missRatio: 100,
        storageUtilization: 0,
        averageServeTime: 0,
        bandwidthSaved: 0,
        costSavings: 0
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.cacheStrategies.set(strategyId, strategy);

    this.emit('cacheStrategyCreated', {
      strategyId,
      timestamp: new Date(),
      strategy
    });

    return strategyId;
  }

  async optimizeRequest(request: {
    url: string;
    method: string;
    headers: Record<string, string>;
    userAgent?: string;
    clientIP?: string;
    country?: string;
  }): Promise<{
    optimizations: string[];
    cacheDirective?: {
      ttl: number;
      vary: string[];
      key: string;
    };
    compressionDirective?: {
      algorithm: string;
      level: number;
    };
    routingDirective?: {
      preferredNodes: string[];
      strategy: string;
    };
    transformations?: {
      images?: { format: string; quality: number };
      content?: { minify: boolean; inline: boolean };
    };
  }> {
    const optimizations: string[] = [];
    let cacheDirective;
    let compressionDirective;
    let routingDirective;
    let transformations;

    // Apply optimization rules
    for (const rule of this.optimizationRules.values()) {
      if (!rule.isActive) continue;

      if (this.matchesConditions(request, rule.conditions)) {
        optimizations.push(rule.id);

        // Apply caching directive
        if (rule.actions.cache) {
          cacheDirective = {
            ttl: rule.actions.cache.ttl,
            vary: rule.actions.cache.vary,
            key: this.generateCacheKey(request, rule.actions.cache.key)
          };
        }

        // Apply compression directive
        if (rule.actions.compress) {
          compressionDirective = {
            algorithm: rule.actions.compress.algorithms[0],
            level: rule.actions.compress.level
          };
        }

        // Apply routing directive
        if (rule.actions.route) {
          routingDirective = {
            preferredNodes: rule.actions.route.preferredNodes,
            strategy: rule.actions.route.loadBalancing
          };
        }

        // Apply transformations
        if (rule.actions.optimize) {
          transformations = {
            images: rule.actions.optimize.images,
            content: {
              minify: rule.actions.optimize.css?.minify || rule.actions.optimize.javascript?.minify || false,
              inline: rule.actions.optimize.css?.inlineSmall || false
            }
          };
        }

        // Update rule metrics
        rule.metrics.appliedCount++;
        rule.metrics.lastApplied = new Date();
        rule.updatedAt = new Date();
      }
    }

    return {
      optimizations,
      cacheDirective,
      compressionDirective,
      routingDirective,
      transformations
    };
  }

  private matchesConditions(request: any, conditions: OptimizationRule['conditions']): boolean {
    // Check path patterns
    if (conditions.pathPatterns) {
      const matches = conditions.pathPatterns.some(pattern => {
        const regex = new RegExp(pattern.replace('*', '.*'));
        return regex.test(request.url);
      });
      if (!matches) return false;
    }

    // Check user agent
    if (conditions.userAgent && request.userAgent) {
      const matches = conditions.userAgent.some(agent => 
        request.userAgent.toLowerCase().includes(agent.toLowerCase())
      );
      if (!matches) return false;
    }

    // Check country
    if (conditions.country && request.country) {
      if (!conditions.country.includes(request.country)) return false;
    }

    // Check time of day
    if (conditions.timeOfDay) {
      const now = new Date();
      const currentTime = now.getHours() * 100 + now.getMinutes();
      const startTime = parseInt(conditions.timeOfDay.start.replace(':', ''));
      const endTime = parseInt(conditions.timeOfDay.end.replace(':', ''));
      
      if (currentTime < startTime || currentTime > endTime) return false;
    }

    return true;
  }

  private generateCacheKey(request: any, keyRules: string[]): string {
    const keyParts = keyRules.map(rule => {
      switch (rule) {
        case 'url':
          return request.url;
        case 'method':
          return request.method;
        case 'user-id':
          return request.headers['x-user-id'] || 'anonymous';
        case 'version':
          return request.headers['x-version'] || 'latest';
        default:
          return request.headers[rule] || '';
      }
    });

    return Buffer.from(keyParts.join('|')).toString('base64');
  }

  private async detectTrafficPatterns(): Promise<void> {
    const nodes = await this.edgeService.getNodes();
    const currentTime = new Date();

    // Analyze traffic for surge detection
    for (const node of nodes) {
      const baseline = node.metrics.requestsPerSecond;
      const current = baseline * (1 + (Math.random() - 0.5) * 0.4); // Simulate variation

      // Detect surge pattern
      if (current > baseline * 1.5) {
        await this.handleTrafficSurge(node.id, current, baseline);
      }
    }
  }

  private async handleTrafficSurge(nodeId: string, current: number, baseline: number): Promise<void> {
    const magnitude = (current - baseline) / baseline;
    
    this.emit('trafficSurgeDetected', {
      nodeId,
      magnitude,
      current,
      baseline,
      timestamp: new Date()
    });

    // Auto-scaling response
    if (magnitude > 2.0) { // 200% increase
      await this.autoScale(nodeId, Math.ceil(magnitude));
    }
  }

  private async autoScale(nodeId: string, factor: number): Promise<void> {
    // Simulate auto-scaling by updating node specifications
    const node = await this.edgeService.getNode(nodeId);
    if (!node) return;

    // This would trigger actual scaling in production
    this.emit('autoScalingTriggered', {
      nodeId,
      scaleFactor: factor,
      newCapacity: {
        cpu: node.specifications.cpu,
        memory: node.specifications.memory,
        bandwidth: node.specifications.bandwidth
      },
      timestamp: new Date()
    });
  }

  private async optimizePerformance(): Promise<void> {
    // Analyze performance metrics and suggest optimizations
    const nodes = await this.edgeService.getNodes();
    
    for (const node of nodes) {
      const optimizations: string[] = [];

      // Check cache hit ratio
      if (node.metrics.cacheHitRatio < 70) {
        optimizations.push('Improve cache configuration');
        await this.suggestCacheOptimization(node.id);
      }

      // Check response time
      if (node.metrics.averageResponseTime > 200) {
        optimizations.push('Optimize response time');
        await this.suggestResponseTimeOptimization(node.id);
      }

      // Check error rate
      if (node.metrics.errorRate > 5) {
        optimizations.push('Reduce error rate');
        await this.suggestErrorReduction(node.id);
      }

      if (optimizations.length > 0) {
        this.emit('performanceOptimizationSuggested', {
          nodeId: node.id,
          optimizations,
          currentMetrics: node.metrics,
          timestamp: new Date()
        });
      }
    }
  }

  private async suggestCacheOptimization(nodeId: string): Promise<void> {
    const optimization: PerformanceOptimization = {
      id: `cache-opt-${nodeId}-${Date.now()}`,
      name: `Cache Optimization for ${nodeId}`,
      category: 'general',
      techniques: {
        prefetching: {
          dns: true,
          preconnect: [],
          preload: ['/*.css', '/*.js'],
          prefetch: ['/*.jpg', '/*.png']
        }
      },
      impact: {
        loadTimeReduction: 25,
        bandwidthSaving: 15,
        coreWebVitals: {
          lcp: -500,
          fid: -50,
          cls: -0.05
        }
      },
      implementation: {
        automatic: true,
        requiresReview: false,
        rollback: true,
        testingRequired: false
      },
      status: 'proposed',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.performanceOptimizations.set(optimization.id, optimization);

    this.emit('optimizationProposed', {
      nodeId,
      optimization,
      timestamp: new Date()
    });
  }

  private async suggestResponseTimeOptimization(nodeId: string): Promise<void> {
    // Similar to cache optimization but for response time
    const optimization: PerformanceOptimization = {
      id: `response-opt-${nodeId}-${Date.now()}`,
      name: `Response Time Optimization for ${nodeId}`,
      category: 'general',
      techniques: {
        bundling: {
          css: true,
          javascript: true,
          critical: true,
          async: true
        }
      },
      impact: {
        loadTimeReduction: 30,
        bandwidthSaving: 10,
        coreWebVitals: {
          lcp: -300,
          fid: -20,
          cls: 0
        }
      },
      implementation: {
        automatic: false,
        requiresReview: true,
        rollback: true,
        testingRequired: true
      },
      status: 'proposed',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.performanceOptimizations.set(optimization.id, optimization);
  }

  private async suggestErrorReduction(nodeId: string): Promise<void> {
    // Create optimization for error reduction
    const optimization: PerformanceOptimization = {
      id: `error-opt-${nodeId}-${Date.now()}`,
      name: `Error Reduction for ${nodeId}`,
      category: 'general',
      techniques: {
        prefetching: {
          dns: true,
          preconnect: ['https://api.example.com'],
          preload: [],
          prefetch: []
        }
      },
      impact: {
        loadTimeReduction: 5,
        bandwidthSaving: 5,
        coreWebVitals: {
          lcp: -100,
          fid: 0,
          cls: 0
        }
      },
      implementation: {
        automatic: true,
        requiresReview: false,
        rollback: true,
        testingRequired: false
      },
      status: 'proposed',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.performanceOptimizations.set(optimization.id, optimization);
  }

  private async balanceLoad(): Promise<void> {
    const nodes = await this.edgeService.getNodes();
    const activeNodes = nodes.filter(n => n.isActive && n.status === 'online');

    if (activeNodes.length < 2) return;

    // Calculate load distribution
    const totalRequests = activeNodes.reduce((sum, node) => sum + node.metrics.requestsPerSecond, 0);
    const averageLoad = totalRequests / activeNodes.length;

    // Find imbalanced nodes
    const overloadedNodes = activeNodes.filter(node => 
      node.metrics.requestsPerSecond > averageLoad * 1.5
    );
    const underutilizedNodes = activeNodes.filter(node => 
      node.metrics.requestsPerSecond < averageLoad * 0.5
    );

    if (overloadedNodes.length > 0 && underutilizedNodes.length > 0) {
      this.emit('loadImbalanceDetected', {
        overloadedNodes: overloadedNodes.map(n => n.id),
        underutilizedNodes: underutilizedNodes.map(n => n.id),
        averageLoad,
        timestamp: new Date()
      });

      // Suggest load balancing adjustment
      await this.adjustLoadBalancing(overloadedNodes, underutilizedNodes);
    }
  }

  private async adjustLoadBalancing(overloaded: EdgeNode[], underutilized: EdgeNode[]): Promise<void> {
    const adjustment = {
      from: overloaded.map(n => ({ nodeId: n.id, currentLoad: n.metrics.requestsPerSecond })),
      to: underutilized.map(n => ({ nodeId: n.id, currentLoad: n.metrics.requestsPerSecond })),
      strategy: 'redistribute',
      expectedImprovement: '25% load reduction on overloaded nodes'
    };

    this.emit('loadBalancingAdjusted', {
      adjustment,
      timestamp: new Date()
    });
  }

  // Public API methods

  async getOptimizationRules(): Promise<OptimizationRule[]> {
    return Array.from(this.optimizationRules.values());
  }

  async getOptimizationRule(ruleId: string): Promise<OptimizationRule | null> {
    return this.optimizationRules.get(ruleId) || null;
  }

  async getCacheStrategies(): Promise<CacheStrategy[]> {
    return Array.from(this.cacheStrategies.values());
  }

  async getCacheStrategy(strategyId: string): Promise<CacheStrategy | null> {
    return this.cacheStrategies.get(strategyId) || null;
  }

  async getPerformanceOptimizations(): Promise<PerformanceOptimization[]> {
    return Array.from(this.performanceOptimizations.values());
  }

  async purgeGlobalCache(pattern?: string): Promise<void> {
    await this.edgeService.purgeCache(pattern || '/*');
    
    this.emit('globalCachePurged', {
      pattern: pattern || '/*',
      timestamp: new Date()
    });
  }

  getOptimizationMetrics(): {
    totalRules: number;
    activeRules: number;
    totalApplications: number;
    averagePerformanceImpact: number;
    cacheStrategies: number;
    activeCacheStrategies: number;
    averageCacheHitRatio: number;
  } {
    const rules = Array.from(this.optimizationRules.values());
    const strategies = Array.from(this.cacheStrategies.values());
    
    const activeRules = rules.filter(r => r.isActive);
    const totalApplications = rules.reduce((sum, r) => sum + r.metrics.appliedCount, 0);
    const averagePerformanceImpact = rules.length > 0
      ? rules.reduce((sum, r) => sum + r.metrics.performanceImpact, 0) / rules.length
      : 0;
    
    const activeCacheStrategies = strategies.filter(s => s.isActive);
    const averageCacheHitRatio = strategies.length > 0
      ? strategies.reduce((sum, s) => sum + s.performance.hitRatio, 0) / strategies.length
      : 0;

    return {
      totalRules: rules.length,
      activeRules: activeRules.length,
      totalApplications,
      averagePerformanceImpact: Math.round(averagePerformanceImpact),
      cacheStrategies: strategies.length,
      activeCacheStrategies: activeCacheStrategies.length,
      averageCacheHitRatio: Math.round(averageCacheHitRatio)
    };
  }

  destroy(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }
    this.removeAllListeners();
  }
}