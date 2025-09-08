/**
 * Enterprise Audit Service
 * 
 * Comprehensive audit logging for compliance and security:
 * - User activity tracking
 * - Data access logging
 * - Administrative actions
 * - Compliance reporting (SOX, GDPR, HIPAA)
 */

import { DatabaseService } from '../../../database/DatabaseService';
import { logger } from '../../../utils/logger';
import { TelemetryUtils } from '../../../../../utils/telemetry';
import { metrics } from '../../../../../utils/telemetry';

// Types
export interface AuditEvent {
  id: string;
  user_id?: string;
  session_id?: string;
  organization_id?: string;
  event_type: AuditEventType;
  resource_type: string;
  resource_id?: string;
  action: string;
  outcome: 'success' | 'failure' | 'partial';
  details: AuditEventDetails;
  ip_address?: string;
  user_agent?: string;
  timestamp: Date;
  correlation_id?: string;
}

export interface AuditEventDetails {
  description: string;
  old_values?: Record<string, any>;
  new_values?: Record<string, any>;
  additional_context?: Record<string, any>;
  error_message?: string;
  duration_ms?: number;
}

export enum AuditEventType {
  // Authentication & Authorization
  AUTH_LOGIN = 'auth.login',
  AUTH_LOGOUT = 'auth.logout',
  AUTH_LOGIN_FAILED = 'auth.login_failed',
  AUTH_PASSWORD_CHANGED = 'auth.password_changed',
  AUTH_MFA_ENABLED = 'auth.mfa_enabled',
  AUTH_MFA_DISABLED = 'auth.mfa_disabled',
  AUTH_TOKEN_REFRESHED = 'auth.token_refreshed',
  
  // User Management
  USER_CREATED = 'user.created',
  USER_UPDATED = 'user.updated',
  USER_DELETED = 'user.deleted',
  USER_INVITED = 'user.invited',
  USER_ROLE_ASSIGNED = 'user.role_assigned',
  USER_ROLE_REMOVED = 'user.role_removed',
  USER_SUSPENDED = 'user.suspended',
  USER_ACTIVATED = 'user.activated',
  
  // Project Management
  PROJECT_CREATED = 'project.created',
  PROJECT_UPDATED = 'project.updated',
  PROJECT_DELETED = 'project.deleted',
  PROJECT_ACCESSED = 'project.accessed',
  PROJECT_MEMBER_ADDED = 'project.member_added',
  PROJECT_MEMBER_REMOVED = 'project.member_removed',
  
  // Task Management
  TASK_CREATED = 'task.created',
  TASK_UPDATED = 'task.updated',
  TASK_DELETED = 'task.deleted',
  TASK_EXECUTED = 'task.executed',
  TASK_ASSIGNED = 'task.assigned',
  TASK_COMPLETED = 'task.completed',
  TASK_FAILED = 'task.failed',
  
  // AI Operations
  AI_REQUEST = 'ai.request',
  AI_RESPONSE = 'ai.response',
  AI_MODEL_CHANGED = 'ai.model_changed',
  AI_SETTINGS_UPDATED = 'ai.settings_updated',
  
  // Data Operations
  DATA_EXPORTED = 'data.exported',
  DATA_IMPORTED = 'data.imported',
  DATA_ACCESSED = 'data.accessed',
  DATA_MODIFIED = 'data.modified',
  DATA_DELETED = 'data.deleted',
  
  // Administrative
  ADMIN_SETTINGS_CHANGED = 'admin.settings_changed',
  ADMIN_ROLE_CREATED = 'admin.role_created',
  ADMIN_ROLE_UPDATED = 'admin.role_updated',
  ADMIN_ROLE_DELETED = 'admin.role_deleted',
  ADMIN_PERMISSION_GRANTED = 'admin.permission_granted',
  ADMIN_PERMISSION_REVOKED = 'admin.permission_revoked',
  
  // System Events
  SYSTEM_STARTUP = 'system.startup',
  SYSTEM_SHUTDOWN = 'system.shutdown',
  SYSTEM_ERROR = 'system.error',
  SYSTEM_BACKUP = 'system.backup',
  SYSTEM_RESTORE = 'system.restore',
  
  // Compliance
  COMPLIANCE_EXPORT = 'compliance.export',
  COMPLIANCE_REPORT_GENERATED = 'compliance.report_generated',
  COMPLIANCE_AUDIT_STARTED = 'compliance.audit_started',
  COMPLIANCE_AUDIT_COMPLETED = 'compliance.audit_completed'
}

export interface AuditQuery {
  user_id?: string;
  organization_id?: string;
  event_types?: AuditEventType[];
  event_type?: AuditEventType; // Single event type (alias)
  resource_type?: string;
  resource_id?: string;
  outcome?: 'success' | 'failure' | 'partial';
  start_date?: Date;
  end_date?: Date;
  ip_address?: string;
  limit?: number;
  offset?: number;
  sort_by?: 'timestamp' | 'event_type' | 'outcome';
  sort_order?: 'asc' | 'desc';
  format?: 'json' | 'csv' | 'xml'; // For export functionality
  compliance_standard?: string;
}

export interface AuditReport {
  title: string;
  period: {
    start: Date;
    end: Date;
  };
  summary: {
    total_events: number;
    event_types: { [key: string]: number };
    outcomes: { [key: string]: number };
    top_users: { user_id: string; username: string; count: number }[];
    top_resources: { resource_type: string; count: number }[];
  };
  events: AuditEvent[];
  compliance_status: {
    gdpr_compliant: boolean;
    sox_compliant: boolean;
    retention_policy_met: boolean;
  };
}

export class AuditService {
  private db: DatabaseService;
  private retentionPeriodDays: number;

  constructor() {
    this.db = DatabaseService.getInstance();
    this.retentionPeriodDays = parseInt(process.env.AUDIT_RETENTION_DAYS || '2555'); // 7 years default
  }

  /**
   * Log audit event
   */
  async logEvent(eventData: {
    user_id?: string;
    session_id?: string;
    organization_id?: string;
    event_type: AuditEventType;
    resource_type: string;
    resource_id?: string;
    action: string;
    outcome: 'success' | 'failure' | 'partial';
    details: AuditEventDetails;
    ip_address?: string;
    user_agent?: string;
    correlation_id?: string;
  }): Promise<AuditEvent> {
    return TelemetryUtils.traceAsync('audit.log_event', async () => {
      const query = `
        INSERT INTO audit_events (
          user_id, session_id, organization_id, event_type, 
          resource_type, resource_id, action, outcome, 
          details, ip_address, user_agent, correlation_id
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
        RETURNING id, timestamp
      `;

      const result = await this.db.queryOne<{id: string, timestamp: Date}>(query, [
        eventData.user_id || null,
        eventData.session_id || null,
        eventData.organization_id || null,
        eventData.event_type,
        eventData.resource_type,
        eventData.resource_id || null,
        eventData.action,
        eventData.outcome,
        JSON.stringify(eventData.details),
        eventData.ip_address || null,
        eventData.user_agent || null,
        eventData.correlation_id || null
      ]);

      if (!result) {
        throw new Error('Failed to log audit event');
      }

      const auditEvent: AuditEvent = {
        id: result.id,
        timestamp: result.timestamp,
        ...eventData
      };

      // Async metrics recording (don't await to avoid blocking)
      setImmediate(() => {
        this.recordAuditMetrics(auditEvent);
      });

      logger.debug('Audit event logged', {
        eventId: result.id,
        eventType: eventData.event_type,
        userId: eventData.user_id,
        resourceType: eventData.resource_type,
        outcome: eventData.outcome
      });

      return auditEvent;
    });
  }

  /**
   * Query audit events
   */
  async queryEvents(query: AuditQuery): Promise<{
    events: AuditEvent[];
    total_count: number;
  }> {
    return TelemetryUtils.traceAsync('audit.query_events', async () => {
      const conditions: string[] = [];
      const values: any[] = [];
      let valueIndex = 1;

      // Build WHERE conditions
      if (query.user_id) {
        conditions.push(`user_id = $${valueIndex++}`);
        values.push(query.user_id);
      }

      if (query.organization_id) {
        conditions.push(`organization_id = $${valueIndex++}`);
        values.push(query.organization_id);
      }

      if (query.event_types && query.event_types.length > 0) {
        conditions.push(`event_type = ANY($${valueIndex++})`);
        values.push(query.event_types);
      }

      if (query.resource_type) {
        conditions.push(`resource_type = $${valueIndex++}`);
        values.push(query.resource_type);
      }

      if (query.resource_id) {
        conditions.push(`resource_id = $${valueIndex++}`);
        values.push(query.resource_id);
      }

      if (query.outcome) {
        conditions.push(`outcome = $${valueIndex++}`);
        values.push(query.outcome);
      }

      if (query.start_date) {
        conditions.push(`timestamp >= $${valueIndex++}`);
        values.push(query.start_date);
      }

      if (query.end_date) {
        conditions.push(`timestamp <= $${valueIndex++}`);
        values.push(query.end_date);
      }

      if (query.ip_address) {
        conditions.push(`ip_address = $${valueIndex++}`);
        values.push(query.ip_address);
      }

      const whereClause = conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';

      // Count query
      const countQuery = `
        SELECT COUNT(*) as total 
        FROM audit_events 
        ${whereClause}
      `;

      const countResult = await this.db.queryOne<{total: string}>(countQuery, values);
      const total_count = parseInt(countResult?.total || '0');

      // Data query
      const sortBy = query.sort_by || 'timestamp';
      const sortOrder = query.sort_order || 'desc';
      const limit = query.limit || 100;
      const offset = query.offset || 0;

      const dataQuery = `
        SELECT * FROM audit_events 
        ${whereClause}
        ORDER BY ${sortBy} ${sortOrder.toUpperCase()}
        LIMIT $${valueIndex++} OFFSET $${valueIndex++}
      `;

      values.push(limit, offset);

      const results = await this.db.query<any>(dataQuery, values);
      const events = results.map(row => this.mapAuditEventData(row));

      return { events, total_count };
    });
  }

  /**
   * Generate compliance report
   */
  async generateComplianceReport(options: {
    organization_id?: string;
    start_date: Date;
    end_date: Date;
    event_types?: AuditEventType[];
  }): Promise<AuditReport> {
    return TelemetryUtils.traceAsync('audit.generate_compliance_report', async () => {
      const query: AuditQuery = {
        organization_id: options.organization_id,
        start_date: options.start_date,
        end_date: options.end_date,
        event_types: options.event_types,
        limit: 10000 // Get all events for report
      };

      const { events, total_count } = await this.queryEvents(query);

      // Generate summary statistics
      const eventTypeCounts: { [key: string]: number } = {};
      const outcomeCounts: { [key: string]: number } = {};
      const userCounts: { [key: string]: number } = {};
      const resourceCounts: { [key: string]: number } = {};

      events.forEach(event => {
        eventTypeCounts[event.event_type] = (eventTypeCounts[event.event_type] || 0) + 1;
        outcomeCounts[event.outcome] = (outcomeCounts[event.outcome] || 0) + 1;
        
        if (event.user_id) {
          userCounts[event.user_id] = (userCounts[event.user_id] || 0) + 1;
        }
        
        resourceCounts[event.resource_type] = (resourceCounts[event.resource_type] || 0) + 1;
      });

      // Get top users
      const topUserIds = Object.entries(userCounts)
        .sort(([, a], [, b]) => b - a)
        .slice(0, 10)
        .map(([userId]) => userId);

      const topUsers = await this.getUsernames(topUserIds);

      // Check compliance status
      const complianceStatus = await this.checkComplianceStatus(options);

      const report: AuditReport = {
        title: `Compliance Report: ${options.start_date.toISOString().split('T')[0]} to ${options.end_date.toISOString().split('T')[0]}`,
        period: {
          start: options.start_date,
          end: options.end_date
        },
        summary: {
          total_events: total_count,
          event_types: eventTypeCounts,
          outcomes: outcomeCounts,
          top_users: topUsers.map(user => ({
            user_id: user.id,
            username: user.username,
            count: userCounts[user.id] || 0
          })),
          top_resources: Object.entries(resourceCounts)
            .sort(([, a], [, b]) => b - a)
            .slice(0, 10)
            .map(([resource_type, count]) => ({ resource_type, count }))
        },
        events: events.slice(0, 1000), // Limit events in report
        compliance_status: complianceStatus
      };

      // Log report generation
      await this.logEvent({
        event_type: AuditEventType.COMPLIANCE_REPORT_GENERATED,
        resource_type: 'audit_report',
        action: 'generate',
        outcome: 'success',
        details: {
          description: 'Compliance report generated',
          additional_context: {
            period_start: options.start_date,
            period_end: options.end_date,
            event_count: total_count,
            organization_id: options.organization_id
          }
        }
      });

      return report;
    });
  }

  /**
   * Export audit data for compliance
   */
  async exportAuditData(query: AuditQuery, format: 'json' | 'csv' | 'xml' = 'json'): Promise<{
    data: string;
    filename: string;
    mime_type: string;
  }> {
    return TelemetryUtils.traceAsync('audit.export_data', async () => {
      const { events } = await this.queryEvents(query);

      let data: string;
      let filename: string;
      let mime_type: string;

      const timestamp = new Date().toISOString().split('T')[0];

      switch (format) {
        case 'csv':
          data = this.convertToCSV(events);
          filename = `audit_export_${timestamp}.csv`;
          mime_type = 'text/csv';
          break;
          
        case 'xml':
          data = this.convertToXML(events);
          filename = `audit_export_${timestamp}.xml`;
          mime_type = 'application/xml';
          break;
          
        default:
          data = JSON.stringify(events, null, 2);
          filename = `audit_export_${timestamp}.json`;
          mime_type = 'application/json';
      }

      // Log export
      await this.logEvent({
        event_type: AuditEventType.DATA_EXPORTED,
        resource_type: 'audit_data',
        action: 'export',
        outcome: 'success',
        details: {
          description: `Audit data exported in ${format} format`,
          additional_context: {
            format,
            record_count: events.length,
            file_size: data.length
          }
        }
      });

      return { data, filename, mime_type };
    });
  }

  /**
   * Clean up old audit records (retention policy)
   */
  async cleanupOldRecords(): Promise<number> {
    return TelemetryUtils.traceAsync('audit.cleanup_old_records', async () => {
      const cutoffDate = new Date();
      cutoffDate.setDate(cutoffDate.getDate() - this.retentionPeriodDays);

      const query = `
        DELETE FROM audit_events 
        WHERE timestamp < $1
      `;

      const result = await this.db.query(query, [cutoffDate]);
      const deletedCount = result.length;

      if (deletedCount > 0) {
        logger.info(`Cleaned up ${deletedCount} old audit records older than ${this.retentionPeriodDays} days`);
        
        await this.logEvent({
          event_type: AuditEventType.SYSTEM_CLEANUP,
          resource_type: 'audit_events',
          action: 'cleanup',
          outcome: 'success',
          details: {
            description: 'Old audit records cleaned up',
            additional_context: {
              cutoff_date: cutoffDate,
              deleted_count: deletedCount,
              retention_days: this.retentionPeriodDays
            }
          }
        });
      }

      return deletedCount;
    });
  }

  /**
   * Get audit statistics
   */
  async getAuditStatistics(organizationId?: string): Promise<{
    total_events: number;
    events_last_24h: number;
    events_last_7d: number;
    events_last_30d: number;
    top_event_types: { event_type: string; count: number }[];
    failure_rate: number;
  }> {
    const baseQuery = organizationId 
      ? 'WHERE organization_id = $1 OR organization_id IS NULL'
      : '';
    const params = organizationId ? [organizationId] : [];

    const queries = [
      // Total events
      `SELECT COUNT(*) as count FROM audit_events ${baseQuery}`,
      
      // Last 24 hours
      `SELECT COUNT(*) as count FROM audit_events ${baseQuery} ${organizationId ? 'AND' : 'WHERE'} timestamp >= NOW() - INTERVAL '24 hours'`,
      
      // Last 7 days
      `SELECT COUNT(*) as count FROM audit_events ${baseQuery} ${organizationId ? 'AND' : 'WHERE'} timestamp >= NOW() - INTERVAL '7 days'`,
      
      // Last 30 days
      `SELECT COUNT(*) as count FROM audit_events ${baseQuery} ${organizationId ? 'AND' : 'WHERE'} timestamp >= NOW() - INTERVAL '30 days'`,
      
      // Top event types (last 30 days)
      `SELECT event_type, COUNT(*) as count FROM audit_events ${baseQuery} ${organizationId ? 'AND' : 'WHERE'} timestamp >= NOW() - INTERVAL '30 days' GROUP BY event_type ORDER BY count DESC LIMIT 10`,
      
      // Failure rate (last 7 days)
      `SELECT outcome, COUNT(*) as count FROM audit_events ${baseQuery} ${organizationId ? 'AND' : 'WHERE'} timestamp >= NOW() - INTERVAL '7 days' GROUP BY outcome`
    ];

    const results = await Promise.all(
      queries.map(query => this.db.query(query, params))
    );

    const total_events = parseInt(results[0][0]?.count || '0');
    const events_last_24h = parseInt(results[1][0]?.count || '0');
    const events_last_7d = parseInt(results[2][0]?.count || '0');
    const events_last_30d = parseInt(results[3][0]?.count || '0');
    const top_event_types = results[4].map((row: any) => ({
      event_type: row.event_type,
      count: parseInt(row.count)
    }));

    const outcomeStats = results[5].reduce((acc: any, row: any) => {
      acc[row.outcome] = parseInt(row.count);
      return acc;
    }, {});

    const total_recent = Object.values(outcomeStats).reduce((sum: number, count: any) => sum + count, 0);
    const failure_count = outcomeStats.failure || 0;
    const failure_rate = total_recent > 0 ? (failure_count / total_recent) * 100 : 0;

    return {
      total_events,
      events_last_24h,
      events_last_7d,
      events_last_30d,
      top_event_types,
      failure_rate
    };
  }

  // Private helper methods
  private async recordAuditMetrics(event: AuditEvent): void {
    try {
      // Record general audit metrics
      if (event.outcome === 'failure') {
        // Could add specific audit failure metrics here
      }
      
      // Record event type metrics
      // This could be expanded based on specific monitoring needs
    } catch (error) {
      logger.error('Failed to record audit metrics', error);
    }
  }

  private async getUsernames(userIds: string[]): Promise<Array<{id: string, username: string}>> {
    if (userIds.length === 0) return [];

    const query = `
      SELECT id, username 
      FROM users 
      WHERE id = ANY($1)
    `;

    const results = await this.db.query<{id: string, username: string}>(query, [userIds]);
    return results;
  }

  private async checkComplianceStatus(options: any): Promise<{
    gdpr_compliant: boolean;
    sox_compliant: boolean;
    retention_policy_met: boolean;
  }> {
    // Check GDPR compliance (data access logging)
    const gdprQuery = `
      SELECT COUNT(*) as count 
      FROM audit_events 
      WHERE event_type IN ('data.accessed', 'data.exported', 'data.modified', 'data.deleted')
      AND timestamp >= $1 AND timestamp <= $2
    `;
    
    const gdprResult = await this.db.queryOne<{count: string}>(gdprQuery, [options.start_date, options.end_date]);
    const gdpr_compliant = true; // Basic compliance check - could be more sophisticated

    // Check SOX compliance (financial data access)
    const sox_compliant = true; // Placeholder - implement specific SOX checks

    // Check retention policy
    const oldestRecord = await this.db.queryOne<{timestamp: Date}>(
      'SELECT MIN(timestamp) as timestamp FROM audit_events'
    );
    
    const retention_policy_met = !oldestRecord || 
      (Date.now() - oldestRecord.timestamp.getTime()) <= (this.retentionPeriodDays * 24 * 60 * 60 * 1000);

    return {
      gdpr_compliant,
      sox_compliant,
      retention_policy_met
    };
  }

  private convertToCSV(events: AuditEvent[]): string {
    if (events.length === 0) return '';

    const headers = [
      'id', 'user_id', 'session_id', 'organization_id', 'event_type', 
      'resource_type', 'resource_id', 'action', 'outcome', 'description',
      'ip_address', 'user_agent', 'timestamp', 'correlation_id'
    ];

    const rows = events.map(event => [
      event.id,
      event.user_id || '',
      event.session_id || '',
      event.organization_id || '',
      event.event_type,
      event.resource_type,
      event.resource_id || '',
      event.action,
      event.outcome,
      event.details.description.replace(/"/g, '""'),
      event.ip_address || '',
      event.user_agent ? event.user_agent.replace(/"/g, '""') : '',
      event.timestamp.toISOString(),
      event.correlation_id || ''
    ]);

    return [headers, ...rows]
      .map(row => row.map(field => `"${field}"`).join(','))
      .join('\n');
  }

  private convertToXML(events: AuditEvent[]): string {
    const xmlEvents = events.map(event => `
      <event id="${event.id}">
        <user_id>${event.user_id || ''}</user_id>
        <session_id>${event.session_id || ''}</session_id>
        <organization_id>${event.organization_id || ''}</organization_id>
        <event_type>${event.event_type}</event_type>
        <resource_type>${event.resource_type}</resource_type>
        <resource_id>${event.resource_id || ''}</resource_id>
        <action>${event.action}</action>
        <outcome>${event.outcome}</outcome>
        <description><![CDATA[${event.details.description}]]></description>
        <ip_address>${event.ip_address || ''}</ip_address>
        <user_agent><![CDATA[${event.user_agent || ''}]]></user_agent>
        <timestamp>${event.timestamp.toISOString()}</timestamp>
        <correlation_id>${event.correlation_id || ''}</correlation_id>
      </event>
    `).join('');

    return `<?xml version="1.0" encoding="UTF-8"?>
<audit_events>
  ${xmlEvents}
</audit_events>`;
  }

  private mapAuditEventData(row: any): AuditEvent {
    return {
      id: row.id,
      user_id: row.user_id,
      session_id: row.session_id,
      organization_id: row.organization_id,
      event_type: row.event_type,
      resource_type: row.resource_type,
      resource_id: row.resource_id,
      action: row.action,
      outcome: row.outcome,
      details: typeof row.details === 'string' ? JSON.parse(row.details) : row.details,
      ip_address: row.ip_address,
      user_agent: row.user_agent,
      timestamp: row.timestamp,
      correlation_id: row.correlation_id
    };
  }

  /**
   * Get audit events (alias for queryEvents)
   */
  async getEvents(query: AuditQuery): Promise<{
    events: AuditEvent[];
    total_count: number;
  }> {
    return this.queryEvents(query);
  }

  /**
   * Export audit events (alias for exportAuditData)
   */
  async exportEvents(query: AuditQuery, format: 'json' | 'csv' | 'xml' = 'json'): Promise<{
    data: string;
    filename: string;
    mime_type: string;
  }> {
    return this.exportAuditData(query, format);
  }
}

export const auditService = new AuditService();