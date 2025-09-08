import { trace, SpanStatusCode, SpanKind } from '@opentelemetry/api';
import { performance } from 'perf_hooks';

export class TelemetryUtils {
  private static tracer = trace.getTracer('claude-coordination-auth');

  /**
   * Trace an async function with automatic span management
   */
  static async traceAsync<T>(
    name: string,
    fn: () => Promise<T>,
    attributes?: Record<string, string | number | boolean>
  ): Promise<T> {
    const span = this.tracer.startSpan(name, {
      kind: SpanKind.INTERNAL,
      attributes: {
        ...attributes,
        'service.name': 'claude-coordination',
        'service.version': process.env.SERVICE_VERSION || '1.0.0'
      }
    });

    const startTime = performance.now();

    try {
      const result = await fn();
      
      const duration = performance.now() - startTime;
      span.setAttributes({
        'operation.duration_ms': Math.round(duration),
        'operation.success': true
      });
      
      span.setStatus({ code: SpanStatusCode.OK });
      return result;
    } catch (error) {
      const duration = performance.now() - startTime;
      span.setAttributes({
        'operation.duration_ms': Math.round(duration),
        'operation.success': false,
        'error.message': error instanceof Error ? error.message : 'Unknown error',
        'error.name': error instanceof Error ? error.name : 'Error'
      });
      
      span.setStatus({ 
        code: SpanStatusCode.ERROR,
        message: error instanceof Error ? error.message : 'Unknown error'
      });
      
      throw error;
    } finally {
      span.end();
    }
  }

  /**
   * Create a child span for database operations
   */
  static traceDatabaseOperation<T>(
    operation: string,
    query?: string,
    parameters?: any[]
  ) {
    return (fn: () => Promise<T>): Promise<T> => {
      return this.traceAsync(
        `db.${operation}`,
        fn,
        {
          'db.operation': operation,
          'db.query': query || 'unknown',
          'db.parameter_count': parameters?.length || 0
        }
      );
    };
  }

  /**
   * Add custom attributes to the current span
   */
  static addAttributes(attributes: Record<string, string | number | boolean>) {
    const span = trace.getActiveSpan();
    if (span) {
      span.setAttributes(attributes);
    }
  }

  /**
   * Record a metric event
   */
  static recordMetric(
    name: string, 
    value: number, 
    unit?: string,
    attributes?: Record<string, string | number | boolean>
  ) {
    // This would integrate with OpenTelemetry Metrics API when available
    // For now, we'll just log it
    console.log(`Metric: ${name}=${value}${unit || ''}`, attributes || {});
  }

  /**
   * Record authentication metrics
   */
  static recordAuthMetric(
    event: string,
    success: boolean,
    method?: string,
    duration?: number
  ) {
    this.recordMetric(
      'auth.event',
      success ? 1 : 0,
      'count',
      {
        'auth.event': event,
        'auth.method': method || 'unknown',
        'auth.success': success,
        'auth.duration_ms': duration || 0
      }
    );
  }

  /**
   * Record audit metrics
   */
  static recordAuditMetric(
    eventType: string,
    outcome: 'success' | 'failure' | 'partial',
    resourceType?: string
  ) {
    this.recordMetric(
      'audit.event',
      1,
      'count',
      {
        'audit.event_type': eventType,
        'audit.outcome': outcome,
        'audit.resource_type': resourceType || 'unknown'
      }
    );
  }
}

/**
 * Database connection pool interface
 */
export interface DatabaseService {
  queryOne<T = any>(query: string, params?: any[]): Promise<T>;
  queryMany<T = any>(query: string, params?: any[]): Promise<T[]>;
  execute(query: string, params?: any[]): Promise<{ affectedRows: number }>;
  transaction<T>(fn: (db: DatabaseService) => Promise<T>): Promise<T>;
}

/**
 * Mock database service for development
 */
export class MockDatabaseService implements DatabaseService {
  private data: Map<string, any[]> = new Map();

  async queryOne<T = any>(query: string, params?: any[]): Promise<T> {
    return TelemetryUtils.traceDatabaseOperation('query_one', query, params)(async () => {
      // Mock implementation - in real system this would connect to PostgreSQL
      console.log(`DB Query (one): ${query}`, params);
      
      // Simulate database response based on query pattern
      if (query.includes('users') && query.includes('SELECT')) {
        return {
          id: '1',
          username: 'testuser',
          email: 'test@example.com',
          organization_id: 'org1',
          is_active: true,
          roles: ['user']
        } as T;
      }
      
      if (query.includes('sessions') && query.includes('SELECT')) {
        return {
          id: 'session1',
          is_active: true,
          expires_at: new Date(Date.now() + 3600000).toISOString(),
          mfa_verified: false,
          organization_id: 'org1'
        } as T;
      }
      
      throw new Error(`No mock data for query: ${query}`);
    });
  }

  async queryMany<T = any>(query: string, params?: any[]): Promise<T[]> {
    return TelemetryUtils.traceDatabaseOperation('query_many', query, params)(async () => {
      console.log(`DB Query (many): ${query}`, params);
      return [] as T[];
    });
  }

  async execute(query: string, params?: any[]): Promise<{ affectedRows: number }> {
    return TelemetryUtils.traceDatabaseOperation('execute', query, params)(async () => {
      console.log(`DB Execute: ${query}`, params);
      return { affectedRows: 1 };
    });
  }

  async transaction<T>(fn: (db: DatabaseService) => Promise<T>): Promise<T> {
    return TelemetryUtils.traceAsync('db.transaction', () => fn(this));
  }
}

// Singleton database service instance
export const databaseService: DatabaseService = new MockDatabaseService();