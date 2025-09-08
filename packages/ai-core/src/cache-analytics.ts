/**
 * 📊 Cache Analytics - Advanced Performance Tracking and Insights
 * Comprehensive analytics for KRINS Smart Response Cache System
 * TypeScript implementation for KRINS-Universe-Builder
 */

import fs from 'fs';
import path from 'path';
import { EventEmitter } from 'events';
import {
  CacheEvent,
  CacheStats,
  PerformanceStats,
  QueryStats
} from './cache-types.js';

export interface AnalyticsConfig {
  retentionDays: number;
  aggregationInterval: number; // milliseconds
  enableRealTimeMetrics: boolean;
  exportFormats: ('json' | 'csv' | 'chart')[];
  alertThresholds: AlertThresholds;
}

export interface AlertThresholds {
  lowHitRate: number; // percentage
  highMissRate: number; // percentage
  maxResponseTime: number; // milliseconds
  maxCacheSize: number; // MB
  minFreeSpace: number; // MB
}

export interface TimeSeriesData {
  timestamp: number;
  hitRate: number;
  missRate: number;
  similarityHitRate: number;
  cacheSize: number;
  responseTime: number;
  throughput: number;
}

export interface AnalyticsReport {
  period: {
    start: string;
    end: string;
    duration: string;
  };
  summary: {
    totalRequests: number;
    totalHits: number;
    totalMisses: number;
    totalSimilarityHits: number;
    averageHitRate: number;
    averageResponseTime: number;
    peakThroughput: number;
    cacheEfficiency: number;
  };
  trends: {
    hitRateTrend: 'increasing' | 'decreasing' | 'stable';
    responseTrend: 'improving' | 'degrading' | 'stable';
    sizeTrend: 'growing' | 'shrinking' | 'stable';
  };
  insights: string[];
  recommendations: string[];
  timeSeries: TimeSeriesData[];
}

export interface AlertEvent {
  type: 'hit_rate' | 'response_time' | 'cache_size' | 'disk_space';
  severity: 'low' | 'medium' | 'high' | 'critical';
  message: string;
  value: number;
  threshold: number;
  timestamp: number;
  resolved?: boolean;
}

export class CacheAnalytics extends EventEmitter {
  private projectPath: string;
  private analyticsDir: string;
  private config: AnalyticsConfig;
  private events: CacheEvent[] = [];
  private timeSeries: TimeSeriesData[] = [];
  private alerts: AlertEvent[] = [];
  private aggregationInterval?: NodeJS.Timeout;
  private lastStats?: CacheStats;

  constructor(projectPath: string = process.cwd(), config: Partial<AnalyticsConfig> = {}) {
    super();
    
    this.projectPath = path.resolve(projectPath);
    this.analyticsDir = path.join(this.projectPath, '.claude-coordination', 'cache-analytics');
    
    this.config = {
      retentionDays: 30,
      aggregationInterval: 60 * 1000, // 1 minute
      enableRealTimeMetrics: true,
      exportFormats: ['json', 'csv'],
      alertThresholds: {
        lowHitRate: 70, // %
        highMissRate: 40, // %
        maxResponseTime: 1000, // ms
        maxCacheSize: 500, // MB
        minFreeSpace: 100 // MB
      },
      ...config
    };

    this.ensureAnalyticsDirectory();
    this.loadHistoricalData();
    
    if (this.config.enableRealTimeMetrics) {
      this.startRealTimeTracking();
    }
  }

  /**
   * 📁 Ensure analytics directory exists
   */
  private ensureAnalyticsDirectory(): void {
    if (!fs.existsSync(this.analyticsDir)) {
      fs.mkdirSync(this.analyticsDir, { recursive: true });
    }
  }

  /**
   * 📜 Load historical analytics data
   */
  private loadHistoricalData(): void {
    try {
      // Load events
      const eventsFile = path.join(this.analyticsDir, 'events.json');
      if (fs.existsSync(eventsFile)) {
        this.events = JSON.parse(fs.readFileSync(eventsFile, 'utf8'));
      }

      // Load time series data
      const timeSeriesFile = path.join(this.analyticsDir, 'timeseries.json');
      if (fs.existsSync(timeSeriesFile)) {
        this.timeSeries = JSON.parse(fs.readFileSync(timeSeriesFile, 'utf8'));
      }

      // Load alerts
      const alertsFile = path.join(this.analyticsDir, 'alerts.json');
      if (fs.existsSync(alertsFile)) {
        this.alerts = JSON.parse(fs.readFileSync(alertsFile, 'utf8'));
      }

      console.log(`📊 Loaded ${this.events.length} events, ${this.timeSeries.length} time series points, ${this.alerts.length} alerts`);
    } catch (error) {
      console.warn('⚠️ Error loading historical analytics data:', error);
    }
  }

  /**
   * 💾 Save analytics data
   */
  private saveAnalyticsData(): void {
    try {
      // Save events (keep only recent ones)
      const cutoffTime = Date.now() - (this.config.retentionDays * 24 * 60 * 60 * 1000);
      this.events = this.events.filter(event => event.timestamp > cutoffTime);
      
      fs.writeFileSync(
        path.join(this.analyticsDir, 'events.json'),
        JSON.stringify(this.events, null, 2)
      );

      // Save time series data
      this.timeSeries = this.timeSeries.filter(data => data.timestamp > cutoffTime);
      fs.writeFileSync(
        path.join(this.analyticsDir, 'timeseries.json'),
        JSON.stringify(this.timeSeries, null, 2)
      );

      // Save alerts
      fs.writeFileSync(
        path.join(this.analyticsDir, 'alerts.json'),
        JSON.stringify(this.alerts, null, 2)
      );

    } catch (error) {
      console.warn('⚠️ Error saving analytics data:', error);
    }
  }

  /**
   * 📝 Record cache event
   */
  public recordEvent(event: CacheEvent): void {
    this.events.push(event);
    
    // Emit for real-time processing
    this.emit('event_recorded', event);
    
    // Check for alert conditions
    this.checkAlerts(event);
    
    // Save periodically
    if (this.events.length % 100 === 0) {
      this.saveAnalyticsData();
    }
  }

  /**
   * 📊 Update cache statistics
   */
  public updateStats(stats: CacheStats): void {
    this.lastStats = stats;
    
    // Record time series data point
    const timeSeriesPoint: TimeSeriesData = {
      timestamp: Date.now(),
      hitRate: stats.hitRate,
      missRate: stats.missRate,
      similarityHitRate: stats.similarityHitRate,
      cacheSize: stats.totalSizeKB / 1024, // Convert to MB
      responseTime: stats.averageResponseTime,
      throughput: this.calculateThroughput()
    };
    
    this.timeSeries.push(timeSeriesPoint);
    
    // Check for performance alerts
    this.checkPerformanceAlerts(stats);
    
    this.emit('stats_updated', stats);
  }

  /**
   * 📈 Calculate current throughput
   */
  private calculateThroughput(): number {
    const recentEvents = this.events.filter(
      event => event.timestamp > Date.now() - 60000 // Last minute
    );
    
    return recentEvents.length; // requests per minute
  }

  /**
   * 🚨 Check for alert conditions
   */
  private checkAlerts(event: CacheEvent): void {
    // Response time alert
    if (event.duration && event.duration > this.config.alertThresholds.maxResponseTime) {
      this.createAlert({
        type: 'response_time',
        severity: event.duration > this.config.alertThresholds.maxResponseTime * 2 ? 'critical' : 'high',
        message: `High response time detected: ${Math.round(event.duration)}ms`,
        value: event.duration,
        threshold: this.config.alertThresholds.maxResponseTime,
        timestamp: Date.now()
      });
    }
  }

  /**
   * ⚡ Check for performance alerts
   */
  private checkPerformanceAlerts(stats: CacheStats): void {
    // Hit rate alert
    if (stats.hitRate < this.config.alertThresholds.lowHitRate) {
      this.createAlert({
        type: 'hit_rate',
        severity: stats.hitRate < 50 ? 'critical' : 'high',
        message: `Low cache hit rate: ${stats.hitRate}%`,
        value: stats.hitRate,
        threshold: this.config.alertThresholds.lowHitRate,
        timestamp: Date.now()
      });
    }

    // Cache size alert
    if (stats.utilizationPercent > 90) {
      this.createAlert({
        type: 'cache_size',
        severity: stats.utilizationPercent > 95 ? 'critical' : 'high',
        message: `Cache size approaching limit: ${stats.utilizationPercent}%`,
        value: stats.utilizationPercent,
        threshold: 90,
        timestamp: Date.now()
      });
    }
  }

  /**
   * 🚨 Create alert
   */
  private createAlert(alert: AlertEvent): void {
    // Check if similar alert already exists recently
    const recentSimilarAlert = this.alerts.find(a => 
      a.type === alert.type && 
      !a.resolved && 
      (Date.now() - a.timestamp) < 300000 // 5 minutes
    );

    if (!recentSimilarAlert) {
      this.alerts.push(alert);
      this.emit('alert_created', alert);
      
      console.warn(`🚨 ${alert.severity.toUpperCase()} ALERT: ${alert.message}`);
    }
  }

  /**
   * 📊 Generate comprehensive analytics report
   */
  public generateReport(startTime?: number, endTime?: number): AnalyticsReport {
    const now = Date.now();
    const start = startTime || (now - 24 * 60 * 60 * 1000); // Default: last 24 hours
    const end = endTime || now;
    
    // Filter data for the specified period
    const periodEvents = this.events.filter(e => e.timestamp >= start && e.timestamp <= end);
    const periodTimeSeries = this.timeSeries.filter(d => d.timestamp >= start && d.timestamp <= end);
    
    // Calculate summary statistics
    const hitEvents = periodEvents.filter(e => e.type === 'hit').length;
    const missEvents = periodEvents.filter(e => e.type === 'miss').length;
    const similarityHitEvents = periodEvents.filter(e => e.type === 'similarity_hit').length;
    const totalRequests = hitEvents + missEvents + similarityHitEvents;
    
    const averageHitRate = totalRequests > 0 ? (hitEvents / totalRequests) * 100 : 0;
    
    // Calculate response times
    const responseTimeEvents = periodEvents.filter(e => e.duration);
    const averageResponseTime = responseTimeEvents.length > 0 ?
      responseTimeEvents.reduce((sum, e) => sum + (e.duration || 0), 0) / responseTimeEvents.length : 0;
    
    // Calculate peak throughput
    const peakThroughput = this.calculatePeakThroughput(periodEvents);
    
    // Calculate trends
    const trends = this.calculateTrends(periodTimeSeries);
    
    // Generate insights and recommendations
    const insights = this.generateInsights(periodTimeSeries, periodEvents);
    const recommendations = this.generateRecommendations(averageHitRate, averageResponseTime, periodTimeSeries);
    
    return {
      period: {
        start: new Date(start).toISOString(),
        end: new Date(end).toISOString(),
        duration: this.formatDuration(end - start)
      },
      summary: {
        totalRequests,
        totalHits: hitEvents,
        totalMisses: missEvents,
        totalSimilarityHits: similarityHitEvents,
        averageHitRate: Math.round(averageHitRate * 100) / 100,
        averageResponseTime: Math.round(averageResponseTime * 100) / 100,
        peakThroughput,
        cacheEfficiency: this.calculateCacheEfficiency(hitEvents, similarityHitEvents, totalRequests)
      },
      trends,
      insights,
      recommendations,
      timeSeries: periodTimeSeries
    };
  }

  /**
   * 📈 Calculate performance trends
   */
  private calculateTrends(timeSeries: TimeSeriesData[]): AnalyticsReport['trends'] {
    if (timeSeries.length < 2) {
      return {
        hitRateTrend: 'stable',
        responseTrend: 'stable',
        sizeTrend: 'stable'
      };
    }

    const firstHalf = timeSeries.slice(0, Math.floor(timeSeries.length / 2));
    const secondHalf = timeSeries.slice(Math.floor(timeSeries.length / 2));

    const avgHitRateFirst = this.average(firstHalf.map(d => d.hitRate));
    const avgHitRateSecond = this.average(secondHalf.map(d => d.hitRate));
    
    const avgResponseFirst = this.average(firstHalf.map(d => d.responseTime));
    const avgResponseSecond = this.average(secondHalf.map(d => d.responseTime));
    
    const avgSizeFirst = this.average(firstHalf.map(d => d.cacheSize));
    const avgSizeSecond = this.average(secondHalf.map(d => d.cacheSize));

    return {
      hitRateTrend: this.getTrend(avgHitRateFirst, avgHitRateSecond, 5),
      responseTrend: this.getResponseTrend(avgResponseFirst, avgResponseSecond, 10),
      sizeTrend: this.getSizeTrend(avgSizeFirst, avgSizeSecond, 10)
    };
  }

  /**
   * 📊 Get trend direction
   */
  private getTrend(before: number, after: number, threshold: number): 'increasing' | 'decreasing' | 'stable' {
    const change = ((after - before) / before) * 100;
    
    if (Math.abs(change) < threshold) return 'stable';
    return change > 0 ? 'increasing' : 'decreasing';
  }

  /**
   * 📊 Get response time trend (inverted: lower is better)
   */
  private getResponseTrend(before: number, after: number, threshold: number): 'improving' | 'degrading' | 'stable' {
    const change = ((after - before) / before) * 100;
    
    if (Math.abs(change) < threshold) return 'stable';
    return change < 0 ? 'improving' : 'degrading'; // Inverted: lower response time is better
  }

  /**
   * 📊 Get size trend
   */
  private getSizeTrend(before: number, after: number, threshold: number): 'growing' | 'shrinking' | 'stable' {
    const change = ((after - before) / before) * 100;
    
    if (Math.abs(change) < threshold) return 'stable';
    return change > 0 ? 'growing' : 'shrinking';
  }

  /**
   * 💡 Generate performance insights
   */
  private generateInsights(timeSeries: TimeSeriesData[], events: CacheEvent[]): string[] {
    const insights: string[] = [];

    // Hit rate insights
    const hitRates = timeSeries.map(d => d.hitRate);
    const avgHitRate = this.average(hitRates);
    
    if (avgHitRate > 80) {
      insights.push(`Excellent cache performance with ${avgHitRate.toFixed(1)}% hit rate`);
    } else if (avgHitRate < 50) {
      insights.push(`Low cache hit rate (${avgHitRate.toFixed(1)}%) indicates potential optimization opportunities`);
    }

    // Similarity matching insights
    const similarityHits = events.filter(e => e.type === 'similarity_hit').length;
    const totalHits = events.filter(e => e.type === 'hit' || e.type === 'similarity_hit').length;
    
    if (similarityHits > 0) {
      const similarityRatio = (similarityHits / totalHits) * 100;
      insights.push(`Similarity matching contributed ${similarityRatio.toFixed(1)}% of cache hits`);
    }

    // Response time insights
    const responseTimes = timeSeries.map(d => d.responseTime);
    const avgResponseTime = this.average(responseTimes);
    
    if (avgResponseTime < 10) {
      insights.push(`Excellent response times averaging ${avgResponseTime.toFixed(1)}ms`);
    } else if (avgResponseTime > 100) {
      insights.push(`High response times (${avgResponseTime.toFixed(1)}ms) may impact user experience`);
    }

    // Usage patterns
    const hourlyDistribution = this.analyzeUsagePatterns(events);
    const peakHour = hourlyDistribution.indexOf(Math.max(...hourlyDistribution));
    insights.push(`Peak usage occurs around ${peakHour}:00 with ${Math.max(...hourlyDistribution)} requests`);

    return insights;
  }

  /**
   * 🎯 Generate optimization recommendations
   */
  private generateRecommendations(
    hitRate: number, 
    responseTime: number, 
    timeSeries: TimeSeriesData[]
  ): string[] {
    const recommendations: string[] = [];

    // Hit rate recommendations
    if (hitRate < 70) {
      recommendations.push('Consider increasing cache TTL or adjusting similarity threshold');
      recommendations.push('Review query patterns to identify opportunities for better caching');
    }

    // Response time recommendations
    if (responseTime > 50) {
      recommendations.push('Consider enabling compression or optimizing cache lookup algorithms');
    }

    // Size recommendations
    const avgSize = this.average(timeSeries.map(d => d.cacheSize));
    if (avgSize > 80) { // MB
      recommendations.push('Cache size is growing large - consider more aggressive cleanup policies');
    }

    // Similarity matching recommendations
    const similarityEvents = this.events.filter(e => e.type === 'similarity_hit');
    if (similarityEvents.length === 0) {
      recommendations.push('Enable similarity matching to improve cache hit rates for similar queries');
    }

    return recommendations;
  }

  /**
   * 📊 Analyze usage patterns by hour
   */
  private analyzeUsagePatterns(events: CacheEvent[]): number[] {
    const hourlyCount = new Array(24).fill(0);
    
    events.forEach(event => {
      const hour = new Date(event.timestamp).getHours();
      hourlyCount[hour]++;
    });
    
    return hourlyCount;
  }

  /**
   * ⚡ Calculate peak throughput
   */
  private calculatePeakThroughput(events: CacheEvent[]): number {
    const buckets = new Map<number, number>();
    const bucketSize = 60000; // 1 minute buckets
    
    events.forEach(event => {
      const bucket = Math.floor(event.timestamp / bucketSize);
      buckets.set(bucket, (buckets.get(bucket) || 0) + 1);
    });
    
    return Math.max(...buckets.values(), 0);
  }

  /**
   * 🎯 Calculate cache efficiency
   */
  private calculateCacheEfficiency(hits: number, similarityHits: number, total: number): number {
    if (total === 0) return 0;
    
    // Weighted efficiency: direct hits get full weight, similarity hits get 80% weight
    const weightedHits = hits + (similarityHits * 0.8);
    return Math.round((weightedHits / total) * 100 * 100) / 100;
  }

  /**
   * 🔢 Calculate average
   */
  private average(numbers: number[]): number {
    if (numbers.length === 0) return 0;
    return numbers.reduce((sum, n) => sum + n, 0) / numbers.length;
  }

  /**
   * ⏰ Format duration
   */
  private formatDuration(ms: number): string {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    
    if (days > 0) return `${days}d ${hours % 24}h`;
    if (hours > 0) return `${hours}h ${minutes % 60}m`;
    if (minutes > 0) return `${minutes}m ${seconds % 60}s`;
    return `${seconds}s`;
  }

  /**
   * 🔄 Start real-time tracking
   */
  private startRealTimeTracking(): void {
    this.aggregationInterval = setInterval(() => {
      if (this.lastStats) {
        this.updateStats(this.lastStats);
      }
      this.saveAnalyticsData();
    }, this.config.aggregationInterval);
  }

  /**
   * 🛑 Stop real-time tracking
   */
  private stopRealTimeTracking(): void {
    if (this.aggregationInterval) {
      clearInterval(this.aggregationInterval);
      this.aggregationInterval = undefined;
    }
  }

  /**
   * 📤 Export analytics data
   */
  public async exportData(
    format: 'json' | 'csv',
    outputPath?: string
  ): Promise<string> {
    const report = this.generateReport();
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    const filename = outputPath || path.join(this.analyticsDir, `analytics-report-${timestamp}.${format}`);
    
    try {
      if (format === 'json') {
        fs.writeFileSync(filename, JSON.stringify(report, null, 2));
      } else if (format === 'csv') {
        const csv = this.convertToCSV(report.timeSeries);
        fs.writeFileSync(filename, csv);
      }
      
      console.log(`📤 Analytics data exported to: ${filename}`);
      return filename;
      
    } catch (error) {
      throw new Error(`Failed to export analytics data: ${error}`);
    }
  }

  /**
   * 📊 Convert time series data to CSV
   */
  private convertToCSV(timeSeries: TimeSeriesData[]): string {
    if (timeSeries.length === 0) return 'timestamp,hitRate,missRate,similarityHitRate,cacheSize,responseTime,throughput\n';
    
    const headers = Object.keys(timeSeries[0]);
    const csvHeaders = headers.join(',');
    
    const csvRows = timeSeries.map(data => {
      return headers.map(header => {
        const value = data[header as keyof TimeSeriesData];
        return typeof value === 'number' ? value.toString() : `"${value}"`;
      }).join(',');
    });
    
    return csvHeaders + '\n' + csvRows.join('\n');
  }

  /**
   * 🛑 Shutdown analytics system
   */
  public shutdown(): void {
    console.log('📊 Shutting down analytics system...');
    
    this.stopRealTimeTracking();
    this.saveAnalyticsData();
    
    this.emit('shutdown');
    console.log('✅ Analytics system shutdown complete');
  }
}

// CacheAnalytics already exported above