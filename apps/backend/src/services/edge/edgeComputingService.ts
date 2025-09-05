import { EventEmitter } from 'events';

export interface EdgeNode {
  id: string;
  name: string;
  location: {
    region: string;
    country: string;
    city: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  };
  provider: 'cloudflare' | 'aws-cloudfront' | 'google-cdn' | 'azure-cdn' | 'fastly' | 'custom';
  capabilities: {
    compute: boolean;
    storage: boolean;
    caching: boolean;
    streaming: boolean;
    analytics: boolean;
    security: boolean;
  };
  specifications: {
    cpu: string;
    memory: string;
    storage: string;
    bandwidth: string;
    network: {
      ipv4: string;
      ipv6?: string;
      latency: number; // ms to nearest major city
    };
  };
  status: 'online' | 'offline' | 'maintenance' | 'error';
  health: {
    cpuUsage: number;
    memoryUsage: number;
    storageUsage: number;
    networkLatency: number;
    uptime: number;
    lastHealthCheck: Date;
  };
  deployment: {
    services: string[];
    version: string;
    lastDeployment: Date;
    configHash: string;
  };
  metrics: {
    requestsPerSecond: number;
    bytesTransferred: number;
    cacheHitRatio: number;
    errorRate: number;
    averageResponseTime: number;
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface EdgeService {
  id: string;
  name: string;
  type: 'compute' | 'storage' | 'cache' | 'cdn' | 'analytics' | 'security' | 'streaming';
  description: string;
  configuration: {
    runtime?: 'nodejs' | 'python' | 'rust' | 'go' | 'wasm';
    memory?: number;
    timeout?: number;
    environment?: Record<string, string>;
    scaling?: {
      minInstances: number;
      maxInstances: number;
      targetCpu: number;
    };
    caching?: {
      ttl: number;
      maxSize: string;
      strategy: 'lru' | 'lfu' | 'fifo';
    };
    security?: {
      authentication: boolean;
      rateLimiting: {
        requests: number;
        window: number; // seconds
      };
      cors: {
        origins: string[];
        methods: string[];
      };
    };
  };
  code?: string; // Function code for compute services
  routes?: {
    path: string;
    method: string;
    handler: string;
  }[];
  deployedNodes: string[];
  trafficRouting: {
    strategy: 'round-robin' | 'latency-based' | 'geo-based' | 'load-based';
    weights?: Record<string, number>;
    rules?: {
      condition: string;
      action: string;
      nodeIds: string[];
    }[];
  };
  status: 'draft' | 'deploying' | 'deployed' | 'failed' | 'retired';
  version: string;
  deploymentHistory: {
    version: string;
    timestamp: Date;
    status: 'success' | 'failed';
    nodeIds: string[];
    rollbackInfo?: {
      previousVersion: string;
      automated: boolean;
    };
  }[];
  metrics: {
    totalRequests: number;
    totalErrors: number;
    averageLatency: number;
    dataTransferred: number;
    cacheHitRatio: number;
    uptime: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface CDNConfiguration {
  id: string;
  name: string;
  domain: string;
  origins: {
    primary: string;
    fallbacks: string[];
  };
  caching: {
    staticAssets: {
      enabled: boolean;
      ttl: number;
      patterns: string[];
    };
    dynamicContent: {
      enabled: boolean;
      ttl: number;
      varyHeaders: string[];
    };
    apiResponses: {
      enabled: boolean;
      ttl: number;
      cacheKeyRules: string[];
    };
  };
  security: {
    ssl: {
      enabled: boolean;
      certificate: string;
      hsts: boolean;
    };
    ddosProtection: boolean;
    waf: {
      enabled: boolean;
      rules: string[];
    };
    botManagement: boolean;
    geoBlocking: {
      enabled: boolean;
      allowedCountries: string[];
      blockedCountries: string[];
    };
  };
  optimization: {
    compression: {
      enabled: boolean;
      algorithms: ('gzip' | 'brotli')[];
      minSize: number;
    };
    imageOptimization: {
      enabled: boolean;
      formats: ('webp' | 'avif' | 'jpeg' | 'png')[];
      quality: number;
    };
    minification: {
      html: boolean;
      css: boolean;
      javascript: boolean;
    };
  };
  monitoring: {
    realUserMonitoring: boolean;
    syntheticMonitoring: {
      enabled: boolean;
      frequency: number; // minutes
      locations: string[];
    };
    alerts: {
      errorRate: number;
      latency: number;
      availability: number;
    };
  };
  analytics: {
    enabled: boolean;
    sampling: number; // percentage
    retentionPeriod: number; // days
  };
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface EdgeAnalytics {
  nodeId: string;
  timeframe: {
    start: Date;
    end: Date;
  };
  traffic: {
    requests: number;
    uniqueVisitors: number;
    bytesTransferred: number;
    topPaths: {
      path: string;
      requests: number;
      bytes: number;
    }[];
    topCountries: {
      country: string;
      requests: number;
      percentage: number;
    }[];
    httpStatuses: Record<string, number>;
  };
  performance: {
    averageResponseTime: number;
    p50ResponseTime: number;
    p95ResponseTime: number;
    p99ResponseTime: number;
    cacheHitRatio: number;
    cacheMissRatio: number;
    originRequestRatio: number;
  };
  security: {
    blockedRequests: number;
    ddosAttempts: number;
    botRequests: number;
    maliciousIPs: string[];
    topThreats: {
      type: string;
      count: number;
      severity: 'low' | 'medium' | 'high' | 'critical';
    }[];
  };
  errors: {
    total: number;
    rate: number;
    breakdown: Record<string, number>;
    topErrors: {
      error: string;
      count: number;
      impact: number;
    }[];
  };
  costs: {
    compute: number;
    bandwidth: number;
    storage: number;
    requests: number;
    total: number;
  };
}

export class EdgeComputingService extends EventEmitter {
  private nodes: Map<string, EdgeNode> = new Map();
  private services: Map<string, EdgeService> = new Map();
  private cdnConfigurations: Map<string, CDNConfiguration> = new Map();
  private analytics: Map<string, EdgeAnalytics[]> = new Map();
  private healthCheckInterval: NodeJS.Timeout;

  constructor() {
    super();
    this.setupDefaultNodes();
    this.startHealthMonitoring();
  }

  private setupDefaultNodes(): void {
    // Global edge nodes for major regions
    const defaultNodes: Omit<EdgeNode, 'id' | 'createdAt' | 'updatedAt'>[] = [
      {
        name: 'US East (Virginia)',
        location: {
          region: 'us-east-1',
          country: 'United States',
          city: 'Ashburn',
          coordinates: { latitude: 39.0438, longitude: -77.4874 }
        },
        provider: 'aws-cloudfront',
        capabilities: {
          compute: true,
          storage: true,
          caching: true,
          streaming: true,
          analytics: true,
          security: true
        },
        specifications: {
          cpu: '4 vCPU',
          memory: '8 GB',
          storage: '100 GB SSD',
          bandwidth: '10 Gbps',
          network: {
            ipv4: '192.0.2.1',
            ipv6: '2001:db8::1',
            latency: 15
          }
        },
        status: 'online',
        health: {
          cpuUsage: 25,
          memoryUsage: 40,
          storageUsage: 30,
          networkLatency: 12,
          uptime: 99.9,
          lastHealthCheck: new Date()
        },
        deployment: {
          services: [],
          version: '1.0.0',
          lastDeployment: new Date(),
          configHash: 'abc123'
        },
        metrics: {
          requestsPerSecond: 1500,
          bytesTransferred: 5000000000,
          cacheHitRatio: 85,
          errorRate: 0.5,
          averageResponseTime: 45
        },
        isActive: true
      },
      {
        name: 'Europe West (London)',
        location: {
          region: 'eu-west-2',
          country: 'United Kingdom',
          city: 'London',
          coordinates: { latitude: 51.5074, longitude: -0.1278 }
        },
        provider: 'cloudflare',
        capabilities: {
          compute: true,
          storage: true,
          caching: true,
          streaming: true,
          analytics: true,
          security: true
        },
        specifications: {
          cpu: '8 vCPU',
          memory: '16 GB',
          storage: '200 GB SSD',
          bandwidth: '20 Gbps',
          network: {
            ipv4: '192.0.2.2',
            ipv6: '2001:db8::2',
            latency: 8
          }
        },
        status: 'online',
        health: {
          cpuUsage: 35,
          memoryUsage: 50,
          storageUsage: 45,
          networkLatency: 6,
          uptime: 99.95,
          lastHealthCheck: new Date()
        },
        deployment: {
          services: [],
          version: '1.0.0',
          lastDeployment: new Date(),
          configHash: 'def456'
        },
        metrics: {
          requestsPerSecond: 2200,
          bytesTransferred: 7500000000,
          cacheHitRatio: 88,
          errorRate: 0.3,
          averageResponseTime: 38
        },
        isActive: true
      },
      {
        name: 'Asia Pacific (Singapore)',
        location: {
          region: 'ap-southeast-1',
          country: 'Singapore',
          city: 'Singapore',
          coordinates: { latitude: 1.3521, longitude: 103.8198 }
        },
        provider: 'google-cdn',
        capabilities: {
          compute: true,
          storage: true,
          caching: true,
          streaming: true,
          analytics: true,
          security: true
        },
        specifications: {
          cpu: '6 vCPU',
          memory: '12 GB',
          storage: '150 GB SSD',
          bandwidth: '15 Gbps',
          network: {
            ipv4: '192.0.2.3',
            latency: 20
          }
        },
        status: 'online',
        health: {
          cpuUsage: 45,
          memoryUsage: 60,
          storageUsage: 35,
          networkLatency: 18,
          uptime: 99.8,
          lastHealthCheck: new Date()
        },
        deployment: {
          services: [],
          version: '1.0.0',
          lastDeployment: new Date(),
          configHash: 'ghi789'
        },
        metrics: {
          requestsPerSecond: 1800,
          bytesTransferred: 6000000000,
          cacheHitRatio: 82,
          errorRate: 0.7,
          averageResponseTime: 52
        },
        isActive: true
      }
    ];

    defaultNodes.forEach(nodeData => {
      const node: EdgeNode = {
        ...nodeData,
        id: `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      this.nodes.set(node.id, node);
    });
  }

  private startHealthMonitoring(): void {
    this.healthCheckInterval = setInterval(async () => {
      for (const [nodeId, node] of this.nodes) {
        await this.performNodeHealthCheck(nodeId);
      }
    }, 60000); // Check every minute
  }

  private async performNodeHealthCheck(nodeId: string): Promise<void> {
    const node = this.nodes.get(nodeId);
    if (!node) return;

    try {
      // Simulate health check (in production would be actual monitoring)
      const health = {
        cpuUsage: Math.random() * 100,
        memoryUsage: Math.random() * 100,
        storageUsage: Math.random() * 100,
        networkLatency: Math.random() * 100 + 5,
        uptime: Math.max(99, Math.random() * 100),
        lastHealthCheck: new Date()
      };

      node.health = health;
      node.updatedAt = new Date();

      // Update node status based on health
      if (health.cpuUsage > 95 || health.memoryUsage > 95 || health.uptime < 99) {
        node.status = 'error';
      } else if (health.cpuUsage > 80 || health.memoryUsage > 80) {
        node.status = 'maintenance';
      } else {
        node.status = 'online';
      }

      // Emit health events
      this.emit('nodeHealthUpdated', {
        nodeId,
        health,
        status: node.status,
        timestamp: new Date()
      });

      // Alert on critical issues
      if (node.status === 'error') {
        this.emit('nodeHealthCritical', {
          nodeId,
          node,
          issues: this.identifyHealthIssues(health),
          timestamp: new Date()
        });
      }

    } catch (error) {
      node.status = 'offline';
      node.updatedAt = new Date();

      this.emit('nodeHealthCheckFailed', {
        nodeId,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date()
      });
    }
  }

  private identifyHealthIssues(health: EdgeNode['health']): string[] {
    const issues: string[] = [];

    if (health.cpuUsage > 95) issues.push('High CPU usage');
    if (health.memoryUsage > 95) issues.push('High memory usage');
    if (health.storageUsage > 90) issues.push('Low storage space');
    if (health.networkLatency > 200) issues.push('High network latency');
    if (health.uptime < 99) issues.push('Low uptime');

    return issues;
  }

  async createNode(nodeData: Omit<EdgeNode, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const nodeId = `node_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const node: EdgeNode = {
      ...nodeData,
      id: nodeId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.nodes.set(nodeId, node);

    this.emit('nodeCreated', {
      nodeId,
      timestamp: new Date(),
      node
    });

    return nodeId;
  }

  async createEdgeService(serviceData: Omit<EdgeService, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const serviceId = `service_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const service: EdgeService = {
      ...serviceData,
      id: serviceId,
      deploymentHistory: [],
      metrics: {
        totalRequests: 0,
        totalErrors: 0,
        averageLatency: 0,
        dataTransferred: 0,
        cacheHitRatio: 0,
        uptime: 100
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.services.set(serviceId, service);

    this.emit('edgeServiceCreated', {
      serviceId,
      timestamp: new Date(),
      service
    });

    return serviceId;
  }

  async deployService(serviceId: string, targetNodeIds?: string[]): Promise<string> {
    const service = this.services.get(serviceId);
    if (!service) {
      throw new Error(`Service ${serviceId} not found`);
    }

    const deploymentId = `deploy_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Select target nodes
    const nodeIds = targetNodeIds || this.selectOptimalNodes(service);
    
    service.status = 'deploying';
    service.updatedAt = new Date();

    this.emit('serviceDeploymentStarted', {
      serviceId,
      deploymentId,
      nodeIds,
      timestamp: new Date()
    });

    try {
      // Deploy to each node
      const deploymentPromises = nodeIds.map(nodeId => 
        this.deployServiceToNode(service, nodeId)
      );

      await Promise.all(deploymentPromises);

      // Update service status
      service.status = 'deployed';
      service.deployedNodes = nodeIds;
      service.version = `v${Date.now()}`;
      service.deploymentHistory.push({
        version: service.version,
        timestamp: new Date(),
        status: 'success',
        nodeIds
      });

      // Update node deployment info
      for (const nodeId of nodeIds) {
        const node = this.nodes.get(nodeId);
        if (node) {
          node.deployment.services.push(serviceId);
          node.deployment.lastDeployment = new Date();
          node.deployment.version = service.version;
          node.updatedAt = new Date();
        }
      }

      this.emit('serviceDeploymentCompleted', {
        serviceId,
        deploymentId,
        nodeIds,
        version: service.version,
        timestamp: new Date()
      });

      return deploymentId;

    } catch (error) {
      service.status = 'failed';
      service.deploymentHistory.push({
        version: service.version,
        timestamp: new Date(),
        status: 'failed',
        nodeIds
      });

      this.emit('serviceDeploymentFailed', {
        serviceId,
        deploymentId,
        nodeIds,
        error: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date()
      });

      throw error;
    }
  }

  private selectOptimalNodes(service: EdgeService): string[] {
    const availableNodes = Array.from(this.nodes.values()).filter(
      node => node.isActive && node.status === 'online'
    );

    // Simple selection strategy - could be more sophisticated
    switch (service.trafficRouting.strategy) {
      case 'geo-based':
        // Select nodes from different regions
        const regions = new Set<string>();
        const selectedNodes: string[] = [];
        
        for (const node of availableNodes) {
          if (regions.size < 3 && !regions.has(node.location.region)) {
            regions.add(node.location.region);
            selectedNodes.push(node.id);
          }
        }
        
        return selectedNodes;

      case 'latency-based':
        // Select nodes with lowest latency
        return availableNodes
          .sort((a, b) => a.specifications.network.latency - b.specifications.network.latency)
          .slice(0, 3)
          .map(node => node.id);

      case 'load-based':
        // Select nodes with lowest current load
        return availableNodes
          .sort((a, b) => (a.health.cpuUsage + a.health.memoryUsage) - (b.health.cpuUsage + b.health.memoryUsage))
          .slice(0, 3)
          .map(node => node.id);

      default:
        // Round-robin or random selection
        return availableNodes.slice(0, 3).map(node => node.id);
    }
  }

  private async deployServiceToNode(service: EdgeService, nodeId: string): Promise<void> {
    const node = this.nodes.get(nodeId);
    if (!node) {
      throw new Error(`Node ${nodeId} not found`);
    }

    // Simulate deployment process
    await new Promise(resolve => setTimeout(resolve, Math.random() * 3000 + 1000));

    // Update node metrics
    node.metrics.requestsPerSecond += 100;
    node.updatedAt = new Date();

    this.emit('serviceDeployedToNode', {
      serviceId: service.id,
      nodeId,
      timestamp: new Date()
    });
  }

  async createCDNConfiguration(cdnData: Omit<CDNConfiguration, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const cdnId = `cdn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const cdn: CDNConfiguration = {
      ...cdnData,
      id: cdnId,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.cdnConfigurations.set(cdnId, cdn);

    this.emit('cdnConfigurationCreated', {
      cdnId,
      timestamp: new Date(),
      configuration: cdn
    });

    return cdnId;
  }

  async updateCDNConfiguration(cdnId: string, updates: Partial<CDNConfiguration>): Promise<void> {
    const cdn = this.cdnConfigurations.get(cdnId);
    if (!cdn) {
      throw new Error(`CDN configuration ${cdnId} not found`);
    }

    Object.assign(cdn, updates);
    cdn.updatedAt = new Date();

    this.emit('cdnConfigurationUpdated', {
      cdnId,
      timestamp: new Date(),
      updates,
      configuration: cdn
    });
  }

  async purgeCache(pattern: string, nodeIds?: string[]): Promise<void> {
    const targetNodes = nodeIds || Array.from(this.nodes.keys());
    
    const purgePromises = targetNodes.map(async (nodeId) => {
      const node = this.nodes.get(nodeId);
      if (node && node.capabilities.caching) {
        // Simulate cache purge
        await new Promise(resolve => setTimeout(resolve, 500));
        
        this.emit('cachePurged', {
          nodeId,
          pattern,
          timestamp: new Date()
        });
      }
    });

    await Promise.all(purgePromises);

    this.emit('globalCachePurged', {
      pattern,
      nodeIds: targetNodes,
      timestamp: new Date()
    });
  }

  async getAnalytics(nodeId: string, timeframe: { start: Date; end: Date }): Promise<EdgeAnalytics> {
    const node = this.nodes.get(nodeId);
    if (!node) {
      throw new Error(`Node ${nodeId} not found`);
    }

    // Generate mock analytics data (in production would query real analytics)
    const analytics: EdgeAnalytics = {
      nodeId,
      timeframe,
      traffic: {
        requests: Math.floor(Math.random() * 1000000),
        uniqueVisitors: Math.floor(Math.random() * 50000),
        bytesTransferred: Math.floor(Math.random() * 10000000000),
        topPaths: [
          { path: '/', requests: 50000, bytes: 100000000 },
          { path: '/api/data', requests: 30000, bytes: 600000000 },
          { path: '/static/js/app.js', requests: 45000, bytes: 45000000 }
        ],
        topCountries: [
          { country: 'United States', requests: 35000, percentage: 35 },
          { country: 'United Kingdom', requests: 20000, percentage: 20 },
          { country: 'Germany', requests: 15000, percentage: 15 }
        ],
        httpStatuses: {
          '200': 85000,
          '404': 8000,
          '500': 2000,
          '301': 5000
        }
      },
      performance: {
        averageResponseTime: node.metrics.averageResponseTime,
        p50ResponseTime: node.metrics.averageResponseTime * 0.8,
        p95ResponseTime: node.metrics.averageResponseTime * 2,
        p99ResponseTime: node.metrics.averageResponseTime * 3,
        cacheHitRatio: node.metrics.cacheHitRatio,
        cacheMissRatio: 100 - node.metrics.cacheHitRatio,
        originRequestRatio: (100 - node.metrics.cacheHitRatio) * 0.6
      },
      security: {
        blockedRequests: Math.floor(Math.random() * 10000),
        ddosAttempts: Math.floor(Math.random() * 100),
        botRequests: Math.floor(Math.random() * 5000),
        maliciousIPs: ['192.168.1.100', '10.0.0.50', '172.16.0.200'],
        topThreats: [
          { type: 'SQL Injection', count: 150, severity: 'high' },
          { type: 'XSS Attack', count: 89, severity: 'medium' },
          { type: 'Bot Traffic', count: 2500, severity: 'low' }
        ]
      },
      errors: {
        total: Math.floor(node.metrics.errorRate * 1000),
        rate: node.metrics.errorRate,
        breakdown: {
          '4xx': Math.floor(node.metrics.errorRate * 600),
          '5xx': Math.floor(node.metrics.errorRate * 400)
        },
        topErrors: [
          { error: '404 Not Found', count: 5000, impact: 2 },
          { error: '500 Internal Server Error', count: 1500, impact: 8 },
          { error: '503 Service Unavailable', count: 500, impact: 9 }
        ]
      },
      costs: {
        compute: Math.random() * 100,
        bandwidth: Math.random() * 200,
        storage: Math.random() * 50,
        requests: Math.random() * 75,
        total: 0
      }
    };

    analytics.costs.total = analytics.costs.compute + analytics.costs.bandwidth + 
                           analytics.costs.storage + analytics.costs.requests;

    return analytics;
  }

  async getGlobalAnalytics(timeframe: { start: Date; end: Date }): Promise<{
    global: EdgeAnalytics;
    byNode: { [nodeId: string]: EdgeAnalytics };
  }> {
    const nodeAnalytics: { [nodeId: string]: EdgeAnalytics } = {};
    
    // Get analytics for each node
    for (const nodeId of this.nodes.keys()) {
      nodeAnalytics[nodeId] = await this.getAnalytics(nodeId, timeframe);
    }

    // Aggregate global analytics
    const global: EdgeAnalytics = {
      nodeId: 'global',
      timeframe,
      traffic: {
        requests: Object.values(nodeAnalytics).reduce((sum, a) => sum + a.traffic.requests, 0),
        uniqueVisitors: Object.values(nodeAnalytics).reduce((sum, a) => sum + a.traffic.uniqueVisitors, 0),
        bytesTransferred: Object.values(nodeAnalytics).reduce((sum, a) => sum + a.traffic.bytesTransferred, 0),
        topPaths: this.aggregateTopPaths(Object.values(nodeAnalytics)),
        topCountries: this.aggregateTopCountries(Object.values(nodeAnalytics)),
        httpStatuses: this.aggregateHttpStatuses(Object.values(nodeAnalytics))
      },
      performance: {
        averageResponseTime: this.calculateAverageResponseTime(Object.values(nodeAnalytics)),
        p50ResponseTime: this.calculatePercentile(Object.values(nodeAnalytics), 50),
        p95ResponseTime: this.calculatePercentile(Object.values(nodeAnalytics), 95),
        p99ResponseTime: this.calculatePercentile(Object.values(nodeAnalytics), 99),
        cacheHitRatio: this.calculateAverageCacheHitRatio(Object.values(nodeAnalytics)),
        cacheMissRatio: 0,
        originRequestRatio: 0
      },
      security: {
        blockedRequests: Object.values(nodeAnalytics).reduce((sum, a) => sum + a.security.blockedRequests, 0),
        ddosAttempts: Object.values(nodeAnalytics).reduce((sum, a) => sum + a.security.ddosAttempts, 0),
        botRequests: Object.values(nodeAnalytics).reduce((sum, a) => sum + a.security.botRequests, 0),
        maliciousIPs: Array.from(new Set(Object.values(nodeAnalytics).flatMap(a => a.security.maliciousIPs))),
        topThreats: this.aggregateTopThreats(Object.values(nodeAnalytics))
      },
      errors: {
        total: Object.values(nodeAnalytics).reduce((sum, a) => sum + a.errors.total, 0),
        rate: this.calculateAverageErrorRate(Object.values(nodeAnalytics)),
        breakdown: this.aggregateErrorBreakdown(Object.values(nodeAnalytics)),
        topErrors: this.aggregateTopErrors(Object.values(nodeAnalytics))
      },
      costs: {
        compute: Object.values(nodeAnalytics).reduce((sum, a) => sum + a.costs.compute, 0),
        bandwidth: Object.values(nodeAnalytics).reduce((sum, a) => sum + a.costs.bandwidth, 0),
        storage: Object.values(nodeAnalytics).reduce((sum, a) => sum + a.costs.storage, 0),
        requests: Object.values(nodeAnalytics).reduce((sum, a) => sum + a.costs.requests, 0),
        total: Object.values(nodeAnalytics).reduce((sum, a) => sum + a.costs.total, 0)
      }
    };

    global.performance.cacheMissRatio = 100 - global.performance.cacheHitRatio;
    global.performance.originRequestRatio = global.performance.cacheMissRatio * 0.6;

    return { global, byNode: nodeAnalytics };
  }

  // Helper methods for analytics aggregation
  private aggregateTopPaths(analytics: EdgeAnalytics[]): EdgeAnalytics['traffic']['topPaths'] {
    const pathMap = new Map<string, { requests: number; bytes: number }>();
    
    analytics.forEach(a => {
      a.traffic.topPaths.forEach(path => {
        const existing = pathMap.get(path.path) || { requests: 0, bytes: 0 };
        pathMap.set(path.path, {
          requests: existing.requests + path.requests,
          bytes: existing.bytes + path.bytes
        });
      });
    });

    return Array.from(pathMap.entries())
      .map(([path, data]) => ({ path, ...data }))
      .sort((a, b) => b.requests - a.requests)
      .slice(0, 10);
  }

  private aggregateTopCountries(analytics: EdgeAnalytics[]): EdgeAnalytics['traffic']['topCountries'] {
    const countryMap = new Map<string, number>();
    let totalRequests = 0;
    
    analytics.forEach(a => {
      a.traffic.topCountries.forEach(country => {
        const existing = countryMap.get(country.country) || 0;
        countryMap.set(country.country, existing + country.requests);
        totalRequests += country.requests;
      });
    });

    return Array.from(countryMap.entries())
      .map(([country, requests]) => ({
        country,
        requests,
        percentage: Math.round((requests / totalRequests) * 100)
      }))
      .sort((a, b) => b.requests - a.requests)
      .slice(0, 10);
  }

  private aggregateHttpStatuses(analytics: EdgeAnalytics[]): Record<string, number> {
    const statusMap = new Map<string, number>();
    
    analytics.forEach(a => {
      Object.entries(a.traffic.httpStatuses).forEach(([status, count]) => {
        const existing = statusMap.get(status) || 0;
        statusMap.set(status, existing + count);
      });
    });

    return Object.fromEntries(statusMap);
  }

  private calculateAverageResponseTime(analytics: EdgeAnalytics[]): number {
    if (analytics.length === 0) return 0;
    const sum = analytics.reduce((sum, a) => sum + a.performance.averageResponseTime, 0);
    return Math.round(sum / analytics.length);
  }

  private calculatePercentile(analytics: EdgeAnalytics[], percentile: number): number {
    if (analytics.length === 0) return 0;
    const values = analytics.map(a => 
      percentile === 50 ? a.performance.p50ResponseTime :
      percentile === 95 ? a.performance.p95ResponseTime :
      a.performance.p99ResponseTime
    ).sort((a, b) => a - b);
    
    const index = Math.ceil((percentile / 100) * values.length) - 1;
    return values[index] || 0;
  }

  private calculateAverageCacheHitRatio(analytics: EdgeAnalytics[]): number {
    if (analytics.length === 0) return 0;
    const sum = analytics.reduce((sum, a) => sum + a.performance.cacheHitRatio, 0);
    return Math.round(sum / analytics.length);
  }

  private calculateAverageErrorRate(analytics: EdgeAnalytics[]): number {
    if (analytics.length === 0) return 0;
    const sum = analytics.reduce((sum, a) => sum + a.errors.rate, 0);
    return Math.round((sum / analytics.length) * 100) / 100;
  }

  private aggregateTopThreats(analytics: EdgeAnalytics[]): EdgeAnalytics['security']['topThreats'] {
    const threatMap = new Map<string, { count: number; severity: 'low' | 'medium' | 'high' | 'critical' }>();
    
    analytics.forEach(a => {
      a.security.topThreats.forEach(threat => {
        const existing = threatMap.get(threat.type);
        if (existing) {
          existing.count += threat.count;
          // Keep the highest severity
          if (this.getSeverityLevel(threat.severity) > this.getSeverityLevel(existing.severity)) {
            existing.severity = threat.severity;
          }
        } else {
          threatMap.set(threat.type, { count: threat.count, severity: threat.severity });
        }
      });
    });

    return Array.from(threatMap.entries())
      .map(([type, data]) => ({ type, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }

  private aggregateErrorBreakdown(analytics: EdgeAnalytics[]): Record<string, number> {
    const errorMap = new Map<string, number>();
    
    analytics.forEach(a => {
      Object.entries(a.errors.breakdown).forEach(([type, count]) => {
        const existing = errorMap.get(type) || 0;
        errorMap.set(type, existing + count);
      });
    });

    return Object.fromEntries(errorMap);
  }

  private aggregateTopErrors(analytics: EdgeAnalytics[]): EdgeAnalytics['errors']['topErrors'] {
    const errorMap = new Map<string, { count: number; impact: number }>();
    
    analytics.forEach(a => {
      a.errors.topErrors.forEach(error => {
        const existing = errorMap.get(error.error);
        if (existing) {
          existing.count += error.count;
          existing.impact = Math.max(existing.impact, error.impact); // Keep max impact
        } else {
          errorMap.set(error.error, { count: error.count, impact: error.impact });
        }
      });
    });

    return Array.from(errorMap.entries())
      .map(([error, data]) => ({ error, ...data }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);
  }

  private getSeverityLevel(severity: 'low' | 'medium' | 'high' | 'critical'): number {
    const levels = { low: 1, medium: 2, high: 3, critical: 4 };
    return levels[severity];
  }

  // Public API methods

  async getNodes(): Promise<EdgeNode[]> {
    return Array.from(this.nodes.values());
  }

  async getNode(nodeId: string): Promise<EdgeNode | null> {
    return this.nodes.get(nodeId) || null;
  }

  async getServices(): Promise<EdgeService[]> {
    return Array.from(this.services.values());
  }

  async getService(serviceId: string): Promise<EdgeService | null> {
    return this.services.get(serviceId) || null;
  }

  async getCDNConfigurations(): Promise<CDNConfiguration[]> {
    return Array.from(this.cdnConfigurations.values());
  }

  async getCDNConfiguration(cdnId: string): Promise<CDNConfiguration | null> {
    return this.cdnConfigurations.get(cdnId) || null;
  }

  getMetrics(): {
    totalNodes: number;
    activeNodes: number;
    totalServices: number;
    deployedServices: number;
    totalRequests: number;
    averageLatency: number;
    globalCacheHitRatio: number;
    totalBandwidth: number;
  } {
    const nodes = Array.from(this.nodes.values());
    const services = Array.from(this.services.values());
    
    const activeNodes = nodes.filter(n => n.isActive && n.status === 'online');
    const deployedServices = services.filter(s => s.status === 'deployed');
    
    const totalRequests = nodes.reduce((sum, n) => sum + n.metrics.requestsPerSecond, 0);
    const averageLatency = nodes.length > 0 
      ? nodes.reduce((sum, n) => sum + n.metrics.averageResponseTime, 0) / nodes.length 
      : 0;
    const globalCacheHitRatio = nodes.length > 0
      ? nodes.reduce((sum, n) => sum + n.metrics.cacheHitRatio, 0) / nodes.length
      : 0;
    const totalBandwidth = nodes.reduce((sum, n) => sum + n.metrics.bytesTransferred, 0);

    return {
      totalNodes: nodes.length,
      activeNodes: activeNodes.length,
      totalServices: services.length,
      deployedServices: deployedServices.length,
      totalRequests,
      averageLatency: Math.round(averageLatency),
      globalCacheHitRatio: Math.round(globalCacheHitRatio),
      totalBandwidth
    };
  }

  destroy(): void {
    if (this.healthCheckInterval) {
      clearInterval(this.healthCheckInterval);
    }
    this.removeAllListeners();
  }
}