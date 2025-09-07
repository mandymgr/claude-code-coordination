import { EventEmitter } from 'events';
import { globalConnectionPool } from '../performance/connectionPool';
import { globalMultiTenantService } from './multiTenant';

export type MetricType = 'counter' | 'gauge' | 'histogram' | 'summary';
export type AggregationPeriod = 'minute' | 'hour' | 'day' | 'week' | 'month' | 'quarter' | 'year';
export type DashboardType = 'executive' | 'operational' | 'technical' | 'custom';

export interface Metric {
  id: string;
  tenantId: string;
  name: string;
  type: MetricType;
  category: string;
  description: string;
  unit: string;
  value: number;
  labels: Record<string, string>;
  timestamp: Date;
  metadata: {
    source: string;
    version: string;
    tags: string[];
  };
}

export interface Dashboard {
  id: string;
  tenantId: string;
  name: string;
  type: DashboardType;
  description?: string;
  layout: DashboardLayout;
  widgets: DashboardWidget[];
  filters: DashboardFilter[];
  permissions: {
    viewRoles: string[];
    editRoles: string[];
    shareRoles: string[];
  };
  settings: {
    refreshInterval: number; // seconds
    timeRange: {
      start: string; // relative time like "-1h", "-7d"
      end: string;
    };
    theme: 'light' | 'dark' | 'auto';
    exportFormats: ('pdf' | 'png' | 'csv' | 'json')[];
  };
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    lastViewedAt?: Date;
    viewCount: number;
    isPublic: boolean;
    tags: string[];
  };
}

export interface DashboardLayout {
  type: 'grid' | 'flex' | 'custom';
  columns: number;
  rowHeight: number;
  margin: [number, number];
  padding: [number, number];
  responsive: boolean;
}

export interface DashboardWidget {
  id: string;
  type: 'chart' | 'metric' | 'table' | 'text' | 'image' | 'iframe' | 'custom';
  title: string;
  description?: string;
  position: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  dataSource: WidgetDataSource;
  visualization: WidgetVisualization;
  interactions: WidgetInteraction[];
  settings: {
    refreshInterval?: number;
    showLegend: boolean;
    showTooltip: boolean;
    allowFullscreen: boolean;
    allowExport: boolean;
  };
}

export interface WidgetDataSource {
  type: 'metrics' | 'logs' | 'events' | 'database' | 'api' | 'static';
  query: string;
  parameters: Record<string, any>;
  aggregation?: {
    period: AggregationPeriod;
    function: 'sum' | 'avg' | 'min' | 'max' | 'count' | 'percentile';
    groupBy: string[];
  };
  filters: Array<{
    field: string;
    operator: 'eq' | 'ne' | 'gt' | 'lt' | 'gte' | 'lte' | 'in' | 'contains';
    value: any;
  }>;
}

export interface WidgetVisualization {
  chartType: 'line' | 'bar' | 'pie' | 'scatter' | 'heatmap' | 'gauge' | 'table' | 'stat';
  options: {
    colors: string[];
    axes?: {
      x: { label: string; scale: 'linear' | 'log' | 'time' };
      y: { label: string; scale: 'linear' | 'log' };
    };
    thresholds?: Array<{
      value: number;
      color: string;
      label?: string;
    }>;
    formatting: {
      numberFormat: string;
      dateFormat: string;
      precision: number;
    };
  };
}

export interface WidgetInteraction {
  type: 'click' | 'hover' | 'brush' | 'zoom';
  action: 'drill_down' | 'filter' | 'navigate' | 'custom';
  target?: string;
  parameters: Record<string, any>;
}

export interface DashboardFilter {
  id: string;
  name: string;
  type: 'select' | 'multiselect' | 'date' | 'daterange' | 'text' | 'number';
  field: string;
  options?: Array<{ label: string; value: any }>;
  defaultValue?: any;
  required: boolean;
}

export interface AnalyticsReport {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  type: 'scheduled' | 'on_demand' | 'alert_based';
  template: ReportTemplate;
  schedule?: {
    frequency: 'daily' | 'weekly' | 'monthly' | 'quarterly';
    time: string; // HH:MM format
    timezone: string;
    recipients: string[];
  };
  parameters: Record<string, any>;
  lastGenerated?: Date;
  nextScheduled?: Date;
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    generationCount: number;
    tags: string[];
  };
}

export interface ReportTemplate {
  format: 'pdf' | 'html' | 'csv' | 'json';
  sections: ReportSection[];
  styling: {
    logo?: string;
    colors: {
      primary: string;
      secondary: string;
      accent: string;
    };
    fonts: {
      header: string;
      body: string;
      monospace: string;
    };
    layout: 'portrait' | 'landscape';
    margins: [number, number, number, number]; // top, right, bottom, left
  };
}

export interface ReportSection {
  type: 'title' | 'summary' | 'chart' | 'table' | 'text' | 'page_break';
  title?: string;
  content: any;
  dataSource?: WidgetDataSource;
  visualization?: WidgetVisualization;
  conditions?: Array<{
    field: string;
    operator: string;
    value: any;
    action: 'show' | 'hide' | 'highlight';
  }>;
}

export interface AlertRule {
  id: string;
  tenantId: string;
  name: string;
  description?: string;
  enabled: boolean;
  severity: 'info' | 'warning' | 'error' | 'critical';
  conditions: AlertCondition[];
  actions: AlertAction[];
  throttling: {
    cooldown: number; // seconds
    maxAlerts: number;
    timeWindow: number; // seconds
  };
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    lastTriggered?: Date;
    triggerCount: number;
    tags: string[];
  };
}

export interface AlertCondition {
  metric: string;
  operator: 'gt' | 'lt' | 'eq' | 'ne' | 'gte' | 'lte';
  threshold: number;
  timeWindow: number; // seconds
  aggregation: 'avg' | 'sum' | 'min' | 'max' | 'count';
}

export interface AlertAction {
  type: 'email' | 'webhook' | 'slack' | 'teams' | 'sms' | 'custom';
  target: string;
  template: string;
  parameters: Record<string, any>;
}

export class AdvancedAnalytics extends EventEmitter {
  private metricsBuffer = new Map<string, Metric[]>();
  private bufferSize = 1000;
  private flushInterval = 30000; // 30 seconds

  constructor() {
    super();
    this.setupMetricsBuffering();
    this.setupPeriodicTasks();
  }

  private setupMetricsBuffering(): void {
    // Flush metrics buffer periodically
    setInterval(() => {
      this.flushMetricsBuffer();
    }, this.flushInterval);
  }

  private setupPeriodicTasks(): void {
    // Run analytics aggregations every hour
    setInterval(() => {
      this.runPeriodicAggregations();
    }, 60 * 60 * 1000);

    // Check alert rules every minute
    setInterval(() => {
      this.checkAlertRules();
    }, 60 * 1000);
  }

  /**
   * Record metric
   */
  async recordMetric(metric: Omit<Metric, 'id'>): Promise<void> {
    const fullMetric: Metric = {
      ...metric,
      id: `metric_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    };

    // Add to buffer for batch processing
    const bufferKey = metric.tenantId;
    if (!this.metricsBuffer.has(bufferKey)) {
      this.metricsBuffer.set(bufferKey, []);
    }

    const buffer = this.metricsBuffer.get(bufferKey)!;
    buffer.push(fullMetric);

    // Flush if buffer is full
    if (buffer.length >= this.bufferSize) {
      await this.flushMetricsBuffer(bufferKey);
    }

    this.emit('metricRecorded', { metric: fullMetric });
  }

  /**
   * Create dashboard
   */
  async createDashboard(
    tenantId: string,
    dashboardData: Omit<Dashboard, 'id' | 'metadata'>
  ): Promise<Dashboard> {
    const tenant = await globalMultiTenantService.getTenant(tenantId);
    if (!tenant) {
      throw new Error(`Tenant not found: ${tenantId}`);
    }

    const dashboardId = `dash_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const dashboard: Dashboard = {
      ...dashboardData,
      id: dashboardId,
      tenantId,
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'system',
        viewCount: 0,
        isPublic: false,
        tags: []
      }
    };

    try {
      await globalConnectionPool.query(
        `INSERT INTO analytics_dashboards (
          id, tenant_id, name, type, description, layout, widgets, filters,
          permissions, settings, metadata
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [
          dashboard.id,
          dashboard.tenantId,
          dashboard.name,
          dashboard.type,
          dashboard.description,
          JSON.stringify(dashboard.layout),
          JSON.stringify(dashboard.widgets),
          JSON.stringify(dashboard.filters),
          JSON.stringify(dashboard.permissions),
          JSON.stringify(dashboard.settings),
          JSON.stringify(dashboard.metadata)
        ]
      );

      this.emit('dashboardCreated', { dashboard });
      console.log(`[AdvancedAnalytics] Created dashboard: ${dashboard.id} (${dashboard.type})`);

      return dashboard;
    } catch (error) {
      console.error('[AdvancedAnalytics] Error creating dashboard:', error);
      throw error;
    }
  }

  /**
   * Get dashboard data
   */
  async getDashboardData(
    dashboardId: string,
    timeRange?: { start: Date; end: Date },
    filters?: Record<string, any>
  ): Promise<{
    dashboard: Dashboard;
    data: Record<string, any>;
    lastUpdated: Date;
  }> {
    // Get dashboard configuration
    const dashboardResult = await globalConnectionPool.query(
      'SELECT * FROM analytics_dashboards WHERE id = $1',
      [dashboardId]
    );

    if (dashboardResult.rows.length === 0) {
      throw new Error(`Dashboard not found: ${dashboardId}`);
    }

    const dashboard = this.mapRowToDashboard(dashboardResult.rows[0]);

    // Update view count
    await globalConnectionPool.query(
      `UPDATE analytics_dashboards 
       SET metadata = jsonb_set(
         jsonb_set(metadata, '{lastViewedAt}', to_jsonb(NOW())),
         '{viewCount}', 
         to_jsonb((COALESCE((metadata->>'viewCount')::int, 0) + 1))
       )
       WHERE id = $1`,
      [dashboardId]
    );

    // Get data for each widget
    const widgetData: Record<string, any> = {};

    for (const widget of dashboard.widgets) {
      try {
        const data = await this.getWidgetData(
          dashboard.tenantId,
          widget,
          timeRange,
          filters
        );
        widgetData[widget.id] = data;
      } catch (error) {
        console.error(`[AdvancedAnalytics] Error getting widget data for ${widget.id}:`, error);
        widgetData[widget.id] = { error: 'Failed to load data' };
      }
    }

    return {
      dashboard,
      data: widgetData,
      lastUpdated: new Date()
    };
  }

  /**
   * Create analytics report
   */
  async createReport(
    tenantId: string,
    reportData: Omit<AnalyticsReport, 'id' | 'metadata'>
  ): Promise<AnalyticsReport> {
    const reportId = `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const report: AnalyticsReport = {
      ...reportData,
      id: reportId,
      tenantId,
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'system',
        generationCount: 0,
        tags: []
      }
    };

    // Calculate next scheduled run
    if (report.schedule) {
      report.nextScheduled = this.calculateNextScheduledRun(report.schedule);
    }

    try {
      await globalConnectionPool.query(
        `INSERT INTO analytics_reports (
          id, tenant_id, name, description, type, template, schedule,
          parameters, last_generated, next_scheduled, metadata
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`,
        [
          report.id,
          report.tenantId,
          report.name,
          report.description,
          report.type,
          JSON.stringify(report.template),
          JSON.stringify(report.schedule),
          JSON.stringify(report.parameters),
          report.lastGenerated,
          report.nextScheduled,
          JSON.stringify(report.metadata)
        ]
      );

      this.emit('reportCreated', { report });
      
      return report;
    } catch (error) {
      console.error('[AdvancedAnalytics] Error creating report:', error);
      throw error;
    }
  }

  /**
   * Generate report
   */
  async generateReport(reportId: string): Promise<{
    reportId: string;
    format: string;
    data: Buffer;
    metadata: any;
  }> {
    // Get report configuration
    const reportResult = await globalConnectionPool.query(
      'SELECT * FROM analytics_reports WHERE id = $1',
      [reportId]
    );

    if (reportResult.rows.length === 0) {
      throw new Error(`Report not found: ${reportId}`);
    }

    const report = this.mapRowToReport(reportResult.rows[0]);

    try {
      // Generate report data
      const reportData = await this.generateReportData(report);
      
      // Format report based on template
      const formattedData = await this.formatReport(report, reportData);

      // Update generation metadata
      await globalConnectionPool.query(
        `UPDATE analytics_reports 
         SET last_generated = NOW(),
             next_scheduled = $2,
             metadata = jsonb_set(
               metadata, 
               '{generationCount}', 
               to_jsonb((COALESCE((metadata->>'generationCount')::int, 0) + 1))
             )
         WHERE id = $1`,
        [
          reportId,
          report.schedule ? this.calculateNextScheduledRun(report.schedule) : null
        ]
      );

      this.emit('reportGenerated', { reportId, format: report.template.format });

      return {
        reportId,
        format: report.template.format,
        data: formattedData,
        metadata: {
          generatedAt: new Date(),
          sections: report.template.sections.length,
          size: formattedData.length
        }
      };
    } catch (error) {
      console.error('[AdvancedAnalytics] Error generating report:', error);
      throw error;
    }
  }

  /**
   * Create alert rule
   */
  async createAlertRule(
    tenantId: string,
    ruleData: Omit<AlertRule, 'id' | 'metadata'>
  ): Promise<AlertRule> {
    const ruleId = `alert_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const rule: AlertRule = {
      ...ruleData,
      id: ruleId,
      tenantId,
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'system',
        triggerCount: 0,
        tags: []
      }
    };

    try {
      await globalConnectionPool.query(
        `INSERT INTO analytics_alert_rules (
          id, tenant_id, name, description, enabled, severity, conditions,
          actions, throttling, metadata
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          rule.id,
          rule.tenantId,
          rule.name,
          rule.description,
          rule.enabled,
          rule.severity,
          JSON.stringify(rule.conditions),
          JSON.stringify(rule.actions),
          JSON.stringify(rule.throttling),
          JSON.stringify(rule.metadata)
        ]
      );

      this.emit('alertRuleCreated', { rule });
      
      return rule;
    } catch (error) {
      console.error('[AdvancedAnalytics] Error creating alert rule:', error);
      throw error;
    }
  }

  /**
   * Get tenant analytics summary
   */
  async getTenantAnalytics(
    tenantId: string,
    period: AggregationPeriod = 'day',
    limit = 100
  ): Promise<{
    summary: {
      totalMetrics: number;
      totalDashboards: number;
      totalReports: number;
      totalAlerts: number;
      activeUsers: number;
    };
    trends: {
      period: AggregationPeriod;
      data: Array<{
        timestamp: Date;
        metrics: number;
        dashboardViews: number;
        reportGenerations: number;
        alertTriggers: number;
      }>;
    };
    topMetrics: Array<{
      name: string;
      category: string;
      value: number;
      trend: 'up' | 'down' | 'stable';
    }>;
    recentActivity: Array<{
      type: 'metric' | 'dashboard_view' | 'report_generated' | 'alert_triggered';
      description: string;
      timestamp: Date;
      userId?: string;
    }>;
  }> {
    try {
      const [summaryResult, trendsResult, topMetricsResult] = await Promise.all([
        // Summary stats
        globalConnectionPool.query(
          `SELECT 
             (SELECT COUNT(*) FROM analytics_metrics WHERE tenant_id = $1) as total_metrics,
             (SELECT COUNT(*) FROM analytics_dashboards WHERE tenant_id = $1) as total_dashboards,
             (SELECT COUNT(*) FROM analytics_reports WHERE tenant_id = $1) as total_reports,
             (SELECT COUNT(*) FROM analytics_alert_rules WHERE tenant_id = $1) as total_alerts`,
          [tenantId]
        ),

        // Trends data (simplified - would need proper time-series aggregation)
        globalConnectionPool.query(
          `SELECT 
             DATE_TRUNC($2, timestamp) as period,
             COUNT(*) as metric_count
           FROM analytics_metrics 
           WHERE tenant_id = $1 AND timestamp >= NOW() - INTERVAL '30 days'
           GROUP BY DATE_TRUNC($2, timestamp)
           ORDER BY period DESC
           LIMIT $3`,
          [tenantId, period, limit]
        ),

        // Top metrics by category
        globalConnectionPool.query(
          `SELECT 
             category,
             name,
             AVG(value) as avg_value,
             COUNT(*) as count
           FROM analytics_metrics 
           WHERE tenant_id = $1 AND timestamp >= NOW() - INTERVAL '7 days'
           GROUP BY category, name
           ORDER BY avg_value DESC
           LIMIT 10`,
          [tenantId]
        )
      ]);

      const summary = {
        totalMetrics: parseInt(summaryResult.rows[0]?.total_metrics || '0'),
        totalDashboards: parseInt(summaryResult.rows[0]?.total_dashboards || '0'),
        totalReports: parseInt(summaryResult.rows[0]?.total_reports || '0'),
        totalAlerts: parseInt(summaryResult.rows[0]?.total_alerts || '0'),
        activeUsers: 0 // Would need proper user activity tracking
      };

      const trends = {
        period,
        data: trendsResult.rows.map(row => ({
          timestamp: row.period,
          metrics: parseInt(row.metric_count || '0'),
          dashboardViews: 0, // Would need proper tracking
          reportGenerations: 0, // Would need proper tracking
          alertTriggers: 0 // Would need proper tracking
        }))
      };

      const topMetrics = topMetricsResult.rows.map(row => ({
        name: row.name,
        category: row.category,
        value: parseFloat(row.avg_value || '0'),
        trend: 'stable' as const // Would need trend calculation
      }));

      const recentActivity: any[] = []; // Would need activity log implementation

      return {
        summary,
        trends,
        topMetrics,
        recentActivity
      };
    } catch (error) {
      console.error('[AdvancedAnalytics] Error getting tenant analytics:', error);
      throw error;
    }
  }

  // Helper methods

  private async flushMetricsBuffer(tenantId?: string): Promise<void> {
    const keysToFlush = tenantId ? [tenantId] : Array.from(this.metricsBuffer.keys());

    for (const key of keysToFlush) {
      const metrics = this.metricsBuffer.get(key);
      if (!metrics || metrics.length === 0) continue;

      try {
        // Batch insert metrics
        const values = metrics.map((metric, index) => 
          `($${index * 9 + 1}, $${index * 9 + 2}, $${index * 9 + 3}, $${index * 9 + 4}, $${index * 9 + 5}, $${index * 9 + 6}, $${index * 9 + 7}, $${index * 9 + 8}, $${index * 9 + 9})`
        ).join(', ');

        const params: any[] = [];
        metrics.forEach(metric => {
          params.push(
            metric.id,
            metric.tenantId,
            metric.name,
            metric.type,
            metric.category,
            metric.value,
            JSON.stringify(metric.labels),
            metric.timestamp,
            JSON.stringify(metric.metadata)
          );
        });

        await globalConnectionPool.query(
          `INSERT INTO analytics_metrics (
            id, tenant_id, name, type, category, value, labels, timestamp, metadata
          ) VALUES ${values}`,
          params
        );

        console.log(`[AdvancedAnalytics] Flushed ${metrics.length} metrics for tenant ${key}`);
        this.metricsBuffer.set(key, []);
      } catch (error) {
        console.error(`[AdvancedAnalytics] Error flushing metrics for tenant ${key}:`, error);
      }
    }
  }

  private async getWidgetData(
    tenantId: string,
    widget: DashboardWidget,
    timeRange?: { start: Date; end: Date },
    filters?: Record<string, any>
  ): Promise<any> {
    const { dataSource } = widget;

    if (dataSource.type === 'metrics') {
      return await this.getMetricsData(tenantId, dataSource, timeRange, filters);
    } else if (dataSource.type === 'database') {
      return await this.getDatabaseData(tenantId, dataSource, timeRange, filters);
    } else if (dataSource.type === 'static') {
      return { data: [{ value: Math.random() * 100, timestamp: new Date() }] };
    }

    return { data: [] };
  }

  private async getMetricsData(
    tenantId: string,
    dataSource: WidgetDataSource,
    timeRange?: { start: Date; end: Date },
    filters?: Record<string, any>
  ): Promise<any> {
    let query = `
      SELECT name, category, AVG(value) as value, 
             DATE_TRUNC($2, timestamp) as timestamp
      FROM analytics_metrics 
      WHERE tenant_id = $1
    `;
    
    const params = [tenantId, dataSource.aggregation?.period || 'hour'];
    let paramIndex = 3;

    if (timeRange) {
      query += ` AND timestamp >= $${paramIndex} AND timestamp <= $${paramIndex + 1}`;
      params.push(timeRange.start, timeRange.end);
      paramIndex += 2;
    }

    if (dataSource.query) {
      query += ` AND name ILIKE $${paramIndex}`;
      params.push(`%${dataSource.query}%`);
      paramIndex++;
    }

    query += ` GROUP BY name, category, DATE_TRUNC($2, timestamp) ORDER BY timestamp DESC LIMIT 100`;

    const result = await globalConnectionPool.query(query, params);
    
    return {
      data: result.rows.map(row => ({
        name: row.name,
        category: row.category,
        value: parseFloat(row.value),
        timestamp: row.timestamp
      }))
    };
  }

  private async getDatabaseData(
    tenantId: string,
    dataSource: WidgetDataSource,
    timeRange?: { start: Date; end: Date },
    filters?: Record<string, any>
  ): Promise<any> {
    // Execute custom database query with safety measures
    // This would need proper query sanitization and validation
    return { data: [] };
  }

  private async generateReportData(report: AnalyticsReport): Promise<any> {
    const data: any = {};

    for (const section of report.template.sections) {
      if (section.dataSource) {
        try {
          const sectionData = await this.getWidgetData(
            report.tenantId,
            { dataSource: section.dataSource } as any,
            undefined,
            report.parameters
          );
          data[section.type] = sectionData;
        } catch (error) {
          console.error(`[AdvancedAnalytics] Error generating data for section ${section.type}:`, error);
          data[section.type] = { error: 'Failed to generate data' };
        }
      }
    }

    return data;
  }

  private async formatReport(report: AnalyticsReport, data: any): Promise<Buffer> {
    // This would use a proper report generation library
    // For now, return a simple JSON representation
    const reportContent = {
      report: report.name,
      generatedAt: new Date(),
      data
    };

    return Buffer.from(JSON.stringify(reportContent, null, 2));
  }

  private calculateNextScheduledRun(schedule: AnalyticsReport['schedule']): Date {
    const next = new Date();
    
    if (!schedule) return next;

    switch (schedule.frequency) {
      case 'daily':
        next.setDate(next.getDate() + 1);
        break;
      case 'weekly':
        next.setDate(next.getDate() + 7);
        break;
      case 'monthly':
        next.setMonth(next.getMonth() + 1);
        break;
      case 'quarterly':
        next.setMonth(next.getMonth() + 3);
        break;
    }

    return next;
  }

  private async runPeriodicAggregations(): Promise<void> {
    console.log('[AdvancedAnalytics] Running periodic aggregations...');
    // Implementation for periodic data aggregation
  }

  private async checkAlertRules(): Promise<void> {
    // Implementation for alert rule evaluation
    console.log('[AdvancedAnalytics] Checking alert rules...');
  }

  // Mapping methods
  private mapRowToDashboard(row: any): Dashboard {
    return {
      id: row.id,
      tenantId: row.tenant_id,
      name: row.name,
      type: row.type,
      description: row.description,
      layout: JSON.parse(row.layout),
      widgets: JSON.parse(row.widgets),
      filters: JSON.parse(row.filters),
      permissions: JSON.parse(row.permissions),
      settings: JSON.parse(row.settings),
      metadata: JSON.parse(row.metadata)
    };
  }

  private mapRowToReport(row: any): AnalyticsReport {
    return {
      id: row.id,
      tenantId: row.tenant_id,
      name: row.name,
      description: row.description,
      type: row.type,
      template: JSON.parse(row.template),
      schedule: JSON.parse(row.schedule || 'null'),
      parameters: JSON.parse(row.parameters),
      lastGenerated: row.last_generated,
      nextScheduled: row.next_scheduled,
      metadata: JSON.parse(row.metadata)
    };
  }
}

// Global Advanced Analytics instance
export const globalAdvancedAnalytics = new AdvancedAnalytics();