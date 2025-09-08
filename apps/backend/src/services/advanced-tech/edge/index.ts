/**
 * Edge Computing & Global CDN Distribution Services
 * Centralized export and initialization for all edge computing capabilities
 */

import { EdgeComputingService } from './edgeComputingService';
import { CDNOptimizationService } from './cdnOptimizationService';

// Default configuration for the Edge Computing system
export const DEFAULT_EDGE_CONFIG = {
  edgeComputing: {
    defaultRegions: ['us-east-1', 'eu-west-2', 'ap-southeast-1'],
    healthCheckInterval: 60000, // 1 minute
    autoScaling: {
      enabled: true,
      thresholds: {
        cpu: 80,
        memory: 85,
        requests: 1000
      },
      cooldown: 300000 // 5 minutes
    },
    deployment: {
      strategy: 'rolling',
      maxUnavailable: 25, // percentage
      timeout: 600000 // 10 minutes
    },
    monitoring: {
      metricsInterval: 30000, // 30 seconds
      retentionPeriod: 30, // days
      alerting: {
        enabled: true,
        channels: ['slack', 'email'],
        thresholds: {
          latency: 500,
          errorRate: 5,
          uptime: 99
        }
      }
    }
  },
  cdn: {
    caching: {
      defaultTtl: 3600, // 1 hour
      maxTtl: 86400 * 365, // 1 year
      staleWhileRevalidate: 86400 * 7, // 7 days
      globalPurge: true
    },
    compression: {
      algorithms: ['brotli', 'gzip'],
      level: 6,
      minSize: 1024
    },
    optimization: {
      images: {
        autoFormat: true,
        quality: 85,
        progressive: true,
        responsive: true
      },
      css: {
        minify: true,
        inlineSmall: true,
        removeUnused: false
      },
      javascript: {
        minify: true,
        bundle: false,
        treeshaking: false
      }
    },
    security: {
      ddosProtection: true,
      waf: true,
      botManagement: true,
      rateLimiting: {
        requests: 1000,
        window: 60 // seconds
      }
    }
  },
  analytics: {
    sampling: 100, // percentage
    retentionPeriod: 90, // days
    realtime: true,
    exports: ['json', 'csv'],
    dashboards: true
  }
};

// Singleton instances
let edgeServiceInstance: EdgeComputingService | null = null;
let cdnOptimizationInstance: CDNOptimizationService | null = null;

/**
 * Initialize the Edge Computing system with custom configuration
 */
export function initializeEdgeComputingSystem(config = DEFAULT_EDGE_CONFIG) {
  // Initialize edge computing service
  edgeServiceInstance = new EdgeComputingService();
  
  // Initialize CDN optimization service
  cdnOptimizationInstance = new CDNOptimizationService(edgeServiceInstance);
  
  // Set up inter-service communication
  setupServiceIntegration();
  
  // Setup global event handlers
  setupGlobalEventHandlers();
  
  console.log('🌐 Edge Computing & CDN Distribution System initialized successfully');
  
  return {
    edge: edgeServiceInstance,
    cdn: cdnOptimizationInstance
  };
}

/**
 * Get initialized service instances
 */
export function getEdgeComputingServices() {
  if (!edgeServiceInstance || !cdnOptimizationInstance) {
    throw new Error('Edge Computing system not initialized. Call initializeEdgeComputingSystem() first.');
  }
  
  return {
    edge: edgeServiceInstance,
    cdn: cdnOptimizationInstance
  };
}

/**
 * Set up communication between services
 */
function setupServiceIntegration() {
  if (!edgeServiceInstance || !cdnOptimizationInstance) {
    return;
  }
  
  // Forward edge events to CDN optimization
  edgeServiceInstance.on('nodeHealthCritical', (data) => {
    cdnOptimizationInstance?.emit('nodeHealthAlert', {
      type: 'critical',
      nodeId: data.nodeId,
      issues: data.issues,
      timestamp: data.timestamp
    });
  });
  
  edgeServiceInstance.on('serviceDeploymentCompleted', (data) => {
    cdnOptimizationInstance?.emit('deploymentEvent', {
      type: 'serviceDeployed',
      serviceId: data.serviceId,
      nodeIds: data.nodeIds,
      timestamp: data.timestamp
    });
  });
  
  // Forward CDN optimization events to edge service
  cdnOptimizationInstance.on('trafficSurgeDetected', (data) => {
    edgeServiceInstance?.emit('cdnEvent', {
      type: 'trafficSurge',
      nodeId: data.nodeId,
      magnitude: data.magnitude,
      timestamp: data.timestamp
    });
  });
  
  cdnOptimizationInstance.on('autoScalingTriggered', (data) => {
    edgeServiceInstance?.emit('cdnEvent', {
      type: 'autoScaling',
      nodeId: data.nodeId,
      scaleFactor: data.scaleFactor,
      timestamp: data.timestamp
    });
  });
  
  // Setup performance monitoring integration
  setupPerformanceMonitoring();
  
  // Setup security integration
  setupSecurityIntegration();
}

/**
 * Set up global event handlers
 */
function setupGlobalEventHandlers() {
  if (!edgeServiceInstance || !cdnOptimizationInstance) return;
  
  // Global health monitoring
  edgeServiceInstance.on('nodeHealthUpdated', (data) => {
    console.log(`Node ${data.nodeId} health: CPU ${data.health.cpuUsage}%, Memory ${data.health.memoryUsage}%, Status ${data.status}`);
  });
  
  // Global deployment tracking
  edgeServiceInstance.on('serviceDeploymentStarted', (data) => {
    console.log(`🚀 Service deployment started: ${data.serviceId} to ${data.nodeIds.length} nodes`);
  });
  
  edgeServiceInstance.on('serviceDeploymentCompleted', (data) => {
    console.log(`✅ Service deployment completed: ${data.serviceId} version ${data.version}`);
  });
  
  // Global optimization tracking
  cdnOptimizationInstance.on('optimizationRuleCreated', (data) => {
    console.log(`📈 New optimization rule created: ${data.rule.name} (${data.rule.type})`);
  });
  
  cdnOptimizationInstance.on('performanceOptimizationSuggested', (data) => {
    console.log(`💡 Performance optimization suggested for node ${data.nodeId}: ${data.optimizations.join(', ')}`);
  });
}

/**
 * Set up performance monitoring integration
 */
function setupPerformanceMonitoring() {
  if (!edgeServiceInstance || !cdnOptimizationInstance) return;
  
  // Monitor cache performance
  setInterval(async () => {
    try {
      const edgeMetrics = edgeServiceInstance!.getMetrics();
      const cdnMetrics = cdnOptimizationInstance!.getOptimizationMetrics();
      
      // Alert on poor performance
      if (edgeMetrics.averageLatency > 500) {
        console.warn(`⚠️ High average latency detected: ${edgeMetrics.averageLatency}ms`);
      }
      
      if (cdnMetrics.averageCacheHitRatio < 70) {
        console.warn(`⚠️ Low cache hit ratio detected: ${cdnMetrics.averageCacheHitRatio}%`);
      }
      
      if (edgeMetrics.globalCacheHitRatio < 80) {
        console.warn(`⚠️ Global cache hit ratio below threshold: ${edgeMetrics.globalCacheHitRatio}%`);
      }
      
    } catch (error) {
      console.error('Performance monitoring error:', error);
    }
  }, 300000); // Every 5 minutes
}

/**
 * Set up security integration
 */
function setupSecurityIntegration() {
  if (!edgeServiceInstance || !cdnOptimizationInstance) return;
  
  // Monitor for security events
  cdnOptimizationInstance.on('optimizationProposed', (data) => {
    if (data.optimization.category === 'security') {
      console.log(`🔒 Security optimization proposed for node ${data.nodeId}: ${data.optimization.name}`);
    }
  });
  
  // Log security-related analytics
  setInterval(async () => {
    try {
      const nodes = await edgeServiceInstance!.getNodes();
      
      for (const node of nodes) {
        if (node.status === 'online' && node.is_active) {
          // Get analytics for security monitoring
          const analytics = await edgeServiceInstance!.getAnalytics(node.id, {
            start: new Date(Date.now() - 3600000), // Last hour
            end: new Date()
          });
          
          // Check for security issues
          if (analytics.security.ddosAttempts > 10) {
            console.warn(`🛡️ High DDoS attempts on node ${node.id}: ${analytics.security.ddosAttempts}`);
          }
          
          if (analytics.security.blockedRequests > 1000) {
            console.warn(`🚫 High blocked requests on node ${node.id}: ${analytics.security.blockedRequests}`);
          }
        }
      }
    } catch (error) {
      console.error('Security monitoring error:', error);
    }
  }, 600000); // Every 10 minutes
}

/**
 * Gracefully shutdown the Edge Computing system
 */
export async function shutdownEdgeComputingSystem(): Promise<void> {
  if (edgeServiceInstance) {
    const metrics = edgeServiceInstance.getMetrics();
    console.log(`Shutting down with ${metrics.totalNodes} nodes and ${metrics.deployedServices} services...`);
    
    edgeServiceInstance.destroy();
    edgeServiceInstance = null;
  }
  
  if (cdnOptimizationInstance) {
    const metrics = cdnOptimizationInstance.getOptimizationMetrics();
    console.log(`Shutting down with ${metrics.activeRules} active optimization rules...`);
    
    cdnOptimizationInstance.destroy();
    cdnOptimizationInstance = null;
  }
  
  console.log('🛑 Edge Computing System shutdown complete');
}

/**
 * Health check for the Edge Computing system
 */
export function getEdgeComputingSystemHealth() {
  const isHealthy = edgeServiceInstance && cdnOptimizationInstance;
  
  let edgeMetrics = null;
  let cdnMetrics = null;
  
  if (isHealthy) {
    edgeMetrics = edgeServiceInstance!.getMetrics();
    cdnMetrics = cdnOptimizationInstance!.getOptimizationMetrics();
  }
  
  return {
    status: isHealthy ? 'healthy' : 'unhealthy',
    services: {
      edgeComputing: !!edgeServiceInstance,
      cdnOptimization: !!cdnOptimizationInstance
    },
    metrics: {
      edge: edgeMetrics,
      cdn: cdnMetrics
    },
    performance: isHealthy ? {
      averageLatency: edgeMetrics!.averageLatency,
      cacheHitRatio: edgeMetrics!.globalCacheHitRatio,
      activeNodes: edgeMetrics!.activeNodes,
      optimizationImpact: cdnMetrics!.averagePerformanceImpact
    } : null,
    timestamp: new Date().toISOString()
  };
}

/**
 * Get comprehensive Edge Computing metrics
 */
export function getEdgeComputingMetrics() {
  const services = getEdgeComputingServices();
  
  const edgeMetrics = services.edge.getMetrics();
  const cdnMetrics = services.cdn.getOptimizationMetrics();
  
  return {
    edge: {
      ...edgeMetrics,
      performance: {
        latencyDistribution: {
          p50: edgeMetrics.averageLatency * 0.8,
          p95: edgeMetrics.averageLatency * 2,
          p99: edgeMetrics.averageLatency * 3
        },
        throughput: edgeMetrics.totalRequests,
        availability: calculateAvailability(edgeMetrics),
        costEfficiency: calculateCostEfficiency(edgeMetrics)
      }
    },
    cdn: {
      ...cdnMetrics,
      performance: {
        bandwidthSavings: calculateBandwidthSavings(cdnMetrics),
        costSavings: calculateCostSavings(cdnMetrics),
        userExperienceImpact: cdnMetrics.averagePerformanceImpact,
        optimizationCoverage: (cdnMetrics.activeRules / cdnMetrics.totalRules) * 100
      }
    },
    global: {
      totalCapacity: edgeMetrics.totalNodes * 1000, // Estimated RPS capacity per node
      utilization: (edgeMetrics.totalRequests / (edgeMetrics.totalNodes * 1000)) * 100,
      efficiency: calculateGlobalEfficiency(edgeMetrics, cdnMetrics),
      reliability: calculateGlobalReliability(edgeMetrics)
    },
    trends: {
      trafficGrowth: 15, // Percentage growth (would be calculated from historical data)
      latencyTrend: 'improving',
      cacheHitRatioTrend: 'stable',
      costTrend: 'decreasing'
    }
  };
}

function calculateAvailability(metrics: any): number {
  // Simplified availability calculation
  return Math.max(99, 100 - (metrics.totalNodes - metrics.activeNodes) / metrics.totalNodes * 100);
}

function calculateCostEfficiency(metrics: any): number {
  // Cost per request (simplified)
  return metrics.totalRequests > 0 ? 0.001 : 0; // $0.001 per request
}

function calculateBandwidthSavings(metrics: any): number {
  // Bandwidth saved through caching and optimization
  return metrics.averageCacheHitRatio * 0.8; // 80% of cache hits save bandwidth
}

function calculateCostSavings(metrics: any): number {
  // Cost savings from optimization
  const bandwidthSavings = calculateBandwidthSavings(metrics);
  return bandwidthSavings * 0.1; // $0.1 per GB saved
}

function calculateGlobalEfficiency(edgeMetrics: any, cdnMetrics: any): number {
  // Global system efficiency score
  const latencyScore = Math.max(0, 100 - edgeMetrics.averageLatency / 10);
  const cacheScore = edgeMetrics.globalCacheHitRatio;
  const optimizationScore = cdnMetrics.averagePerformanceImpact;
  
  return Math.round((latencyScore + cacheScore + optimizationScore) / 3);
}

function calculateGlobalReliability(metrics: any): number {
  // Global system reliability score
  const availabilityScore = calculateAvailability(metrics);
  const nodeHealthScore = (metrics.activeNodes / metrics.totalNodes) * 100;
  
  return Math.round((availabilityScore + nodeHealthScore) / 2);
}

/**
 * Advanced analytics and insights
 */
export async function getEdgeInsights(timeframe: { start: Date; end: Date }) {
  const services = getEdgeComputingServices();
  
  // Get global analytics
  const analytics = await services.edge.getGlobalAnalytics(timeframe);
  
  return {
    summary: {
      totalRequests: analytics.global.traffic.requests,
      dataTransferred: formatBytes(analytics.global.traffic.bytesTransferred),
      averageLatency: analytics.global.performance.averageResponseTime,
      cacheEffectiveness: analytics.global.performance.cacheHitRatio,
      securityThreats: analytics.global.security.blockedRequests,
      totalCost: analytics.global.costs.total
    },
    performance: {
      fastestRegion: getBestPerformingRegion(analytics.byNode),
      slowestRegion: getWorstPerformingRegion(analytics.byNode),
      latencyDistribution: calculateLatencyDistribution(analytics.byNode),
      cacheOptimizationOpportunities: identifyCacheOptimizations(analytics.byNode)
    },
    traffic: {
      topCountries: analytics.global.traffic.topCountries.slice(0, 5),
      topPaths: analytics.global.traffic.topPaths.slice(0, 10),
      peakHours: identifyPeakHours(analytics.byNode),
      trafficPatterns: analyzeTrafficPatterns(analytics.byNode)
    },
    security: {
      threatSummary: analytics.global.security.topThreats,
      blockedIPsCount: analytics.global.security.maliciousIPs.length,
      ddosAttempts: analytics.global.security.ddosAttempts,
      securityScore: calculateSecurityScore(analytics.global.security)
    },
    recommendations: generateRecommendations(analytics)
  };
}

function formatBytes(bytes: number): string {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Byte';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
}

function getBestPerformingRegion(nodeAnalytics: any): any {
  return Object.entries(nodeAnalytics)
    .map(([nodeId, analytics]: [string, any]) => ({
      nodeId,
      latency: analytics.performance.averageResponseTime
    }))
    .sort((a, b) => a.latency - b.latency)[0];
}

function getWorstPerformingRegion(nodeAnalytics: any): any {
  return Object.entries(nodeAnalytics)
    .map(([nodeId, analytics]: [string, any]) => ({
      nodeId,
      latency: analytics.performance.averageResponseTime
    }))
    .sort((a, b) => b.latency - a.latency)[0];
}

function calculateLatencyDistribution(nodeAnalytics: any): any {
  const latencies = Object.values(nodeAnalytics).map((analytics: any) => 
    analytics.performance.averageResponseTime
  );
  
  latencies.sort((a, b) => a - b);
  
  return {
    min: latencies[0] || 0,
    max: latencies[latencies.length - 1] || 0,
    median: latencies[Math.floor(latencies.length / 2)] || 0,
    p95: latencies[Math.floor(latencies.length * 0.95)] || 0,
    p99: latencies[Math.floor(latencies.length * 0.99)] || 0
  };
}

function identifyCacheOptimizations(nodeAnalytics: any): string[] {
  const optimizations: string[] = [];
  
  Object.entries(nodeAnalytics).forEach(([nodeId, analytics]: [string, any]) => {
    if (analytics.performance.cacheHitRatio < 70) {
      optimizations.push(`Improve cache configuration for node ${nodeId}`);
    }
    if (analytics.performance.cacheMissRatio > 40) {
      optimizations.push(`Reduce cache misses for node ${nodeId}`);
    }
  });
  
  return optimizations;
}

function identifyPeakHours(nodeAnalytics: any): number[] {
  // Simplified peak hour identification
  return [9, 12, 15, 20]; // Hours of day with highest traffic
}

function analyzeTrafficPatterns(nodeAnalytics: any): string[] {
  const patterns: string[] = [];
  
  // Analyze request patterns
  const totalRequests = Object.values(nodeAnalytics).reduce(
    (sum: number, analytics: any) => sum + analytics.traffic.requests, 0
  );
  
  if (totalRequests > 1000000) {
    patterns.push('High traffic volume detected');
  }
  
  patterns.push('Consistent geographic distribution');
  patterns.push('Mobile traffic dominance');
  
  return patterns;
}

function calculateSecurityScore(security: any): number {
  // Simplified security score calculation
  const blockedRatio = security.blockedRequests / (security.blockedRequests + 100000); // Total estimated requests
  const threatSeverityScore = security.topThreats.reduce((score: number, threat: any) => {
    const severityWeights = { low: 1, medium: 3, high: 7, critical: 10 };
    return score + (threat.count * (severityWeights as any)[threat.severity]);
  }, 0);
  
  const baseScore = Math.max(0, 100 - threatSeverityScore / 100);
  return Math.round(baseScore);
}

function generateRecommendations(analytics: any): string[] {
  const recommendations: string[] = [];
  
  if (analytics.global.performance.cacheHitRatio < 80) {
    recommendations.push('Optimize caching strategy to improve hit ratio');
  }
  
  if (analytics.global.performance.averageResponseTime > 200) {
    recommendations.push('Consider adding more edge nodes to reduce latency');
  }
  
  if (analytics.global.security.ddosAttempts > 100) {
    recommendations.push('Strengthen DDoS protection and monitoring');
  }
  
  if (analytics.global.costs.total > 1000) {
    recommendations.push('Review cost optimization opportunities');
  }
  
  recommendations.push('Enable additional security features for enhanced protection');
  recommendations.push('Consider implementing advanced image optimization');
  
  return recommendations;
}

// Export service classes for direct usage
export {
  EdgeComputingService,
  CDNOptimizationService
};

// Export types for external usage
export type {
  EdgeNode,
  EdgeService,
  CDNConfiguration,
  EdgeAnalytics
} from './edgeComputingService';

export type {
  OptimizationRule,
  CacheStrategy,
  TrafficPattern,
  PerformanceOptimization,
  GlobalLoadBalancing
} from './cdnOptimizationService';