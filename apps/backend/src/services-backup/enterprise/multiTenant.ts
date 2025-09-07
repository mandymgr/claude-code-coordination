import { EventEmitter } from 'events';
import { globalConnectionPool } from '../performance/connectionPool';

export interface Tenant {
  id: string;
  name: string;
  domain: string;
  subdomain: string;
  status: 'active' | 'suspended' | 'inactive';
  plan: 'starter' | 'professional' | 'enterprise' | 'custom';
  settings: TenantSettings;
  limits: TenantLimits;
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    industry?: string;
    size?: 'small' | 'medium' | 'large' | 'enterprise';
    region?: string;
    customFields?: Record<string, any>;
  };
}

export interface TenantSettings {
  branding: {
    logo?: string;
    primaryColor?: string;
    secondaryColor?: string;
    customCSS?: string;
    favicon?: string;
    companyName?: string;
  };
  features: {
    aiProviders: string[];
    maxProjects: number;
    maxUsers: number;
    allowCustomIntegrations: boolean;
    enableAnalytics: boolean;
    enableAuditLog: boolean;
    enableAPIAccess: boolean;
    enableWebhooks: boolean;
    enableSSO: boolean;
    enableMFA: boolean;
  };
  security: {
    passwordPolicy: {
      minLength: number;
      requireUppercase: boolean;
      requireLowercase: boolean;
      requireNumbers: boolean;
      requireSymbols: boolean;
      maxAge: number; // days
    };
    sessionTimeout: number; // minutes
    allowedDomains?: string[];
    ipWhitelist?: string[];
    enableDataEncryption: boolean;
    complianceLevel: 'basic' | 'hipaa' | 'soc2' | 'gdpr' | 'custom';
  };
  integrations: {
    slack?: { webhookUrl: string; enabled: boolean };
    teams?: { webhookUrl: string; enabled: boolean };
    jira?: { baseUrl: string; token: string; enabled: boolean };
    github?: { token: string; enabled: boolean };
    custom?: Array<{
      name: string;
      type: 'webhook' | 'api' | 'oauth';
      config: Record<string, any>;
      enabled: boolean;
    }>;
  };
}

export interface TenantLimits {
  users: {
    max: number;
    current: number;
  };
  projects: {
    max: number;
    current: number;
  };
  apiCalls: {
    max: number; // per month
    current: number;
    resetDate: Date;
  };
  storage: {
    max: number; // MB
    current: number;
  };
  bandwidth: {
    max: number; // GB per month
    current: number;
    resetDate: Date;
  };
  aiTokens: {
    max: number; // per month
    current: number;
    resetDate: Date;
  };
}

export interface TenantContext {
  tenant: Tenant;
  user: {
    id: string;
    email: string;
    role: string;
    permissions: string[];
  };
  request: {
    ip: string;
    userAgent: string;
    timestamp: Date;
  };
}

export class MultiTenantService extends EventEmitter {
  private tenantCache = new Map<string, Tenant>();
  private domainCache = new Map<string, string>(); // domain -> tenantId
  private cacheTimeout = 5 * 60 * 1000; // 5 minutes

  constructor() {
    super();
    this.setupCacheCleanup();
  }

  private setupCacheCleanup(): void {
    // Clear cache every 5 minutes
    setInterval(() => {
      this.tenantCache.clear();
      this.domainCache.clear();
      console.log('[MultiTenant] Cache cleared');
    }, this.cacheTimeout);
  }

  /**
   * Get tenant by ID with caching
   */
  async getTenant(tenantId: string): Promise<Tenant | null> {
    // Check cache first
    if (this.tenantCache.has(tenantId)) {
      return this.tenantCache.get(tenantId)!;
    }

    try {
      const result = await globalConnectionPool.query(
        'SELECT * FROM tenants WHERE id = $1 AND status != $2',
        [tenantId, 'inactive']
      );

      if (result.rows.length === 0) {
        return null;
      }

      const tenant = this.mapRowToTenant(result.rows[0]);
      this.tenantCache.set(tenantId, tenant);
      
      return tenant;
    } catch (error) {
      console.error('[MultiTenant] Error fetching tenant:', error);
      throw error;
    }
  }

  /**
   * Get tenant by domain/subdomain
   */
  async getTenantByDomain(domain: string): Promise<Tenant | null> {
    // Check domain cache first
    if (this.domainCache.has(domain)) {
      const tenantId = this.domainCache.get(domain)!;
      return this.getTenant(tenantId);
    }

    try {
      const result = await globalConnectionPool.query(
        'SELECT * FROM tenants WHERE domain = $1 OR subdomain = $2 AND status != $3',
        [domain, domain, 'inactive']
      );

      if (result.rows.length === 0) {
        return null;
      }

      const tenant = this.mapRowToTenant(result.rows[0]);
      this.tenantCache.set(tenant.id, tenant);
      this.domainCache.set(domain, tenant.id);
      
      return tenant;
    } catch (error) {
      console.error('[MultiTenant] Error fetching tenant by domain:', error);
      throw error;
    }
  }

  /**
   * Create new tenant
   */
  async createTenant(tenantData: Omit<Tenant, 'id' | 'metadata'>): Promise<Tenant> {
    const tenantId = `tenant_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const tenant: Tenant = {
      ...tenantData,
      id: tenantId,
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'system', // Should be actual user ID
        ...tenantData.metadata
      }
    };

    try {
      await globalConnectionPool.query(
        `INSERT INTO tenants (
          id, name, domain, subdomain, status, plan, 
          settings, limits, metadata
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
        [
          tenant.id,
          tenant.name,
          tenant.domain,
          tenant.subdomain,
          tenant.status,
          tenant.plan,
          JSON.stringify(tenant.settings),
          JSON.stringify(tenant.limits),
          JSON.stringify(tenant.metadata)
        ]
      );

      // Initialize tenant-specific database schema
      await this.initializeTenantSchema(tenant.id);

      this.emit('tenantCreated', { tenant });
      console.log(`[MultiTenant] Created tenant: ${tenant.id} (${tenant.name})`);

      return tenant;
    } catch (error) {
      console.error('[MultiTenant] Error creating tenant:', error);
      throw error;
    }
  }

  /**
   * Update tenant
   */
  async updateTenant(tenantId: string, updates: Partial<Tenant>): Promise<Tenant> {
    const existingTenant = await this.getTenant(tenantId);
    if (!existingTenant) {
      throw new Error(`Tenant not found: ${tenantId}`);
    }

    const updatedTenant = {
      ...existingTenant,
      ...updates,
      metadata: {
        ...existingTenant.metadata,
        ...updates.metadata,
        updatedAt: new Date()
      }
    };

    try {
      await globalConnectionPool.query(
        `UPDATE tenants SET 
          name = $2, domain = $3, subdomain = $4, status = $5, plan = $6,
          settings = $7, limits = $8, metadata = $9
        WHERE id = $1`,
        [
          tenantId,
          updatedTenant.name,
          updatedTenant.domain,
          updatedTenant.subdomain,
          updatedTenant.status,
          updatedTenant.plan,
          JSON.stringify(updatedTenant.settings),
          JSON.stringify(updatedTenant.limits),
          JSON.stringify(updatedTenant.metadata)
        ]
      );

      // Clear cache
      this.tenantCache.delete(tenantId);
      this.domainCache.delete(existingTenant.domain);
      this.domainCache.delete(existingTenant.subdomain);

      this.emit('tenantUpdated', { tenant: updatedTenant, previous: existingTenant });
      
      return updatedTenant;
    } catch (error) {
      console.error('[MultiTenant] Error updating tenant:', error);
      throw error;
    }
  }

  /**
   * Initialize tenant-specific database schema
   */
  private async initializeTenantSchema(tenantId: string): Promise<void> {
    const schemaQueries = [
      // Tenant-specific users table
      `CREATE TABLE IF NOT EXISTS ${tenantId}_users (
        id VARCHAR(255) PRIMARY KEY,
        email VARCHAR(255) UNIQUE NOT NULL,
        name VARCHAR(255),
        role VARCHAR(100) DEFAULT 'user',
        permissions JSONB DEFAULT '[]',
        settings JSONB DEFAULT '{}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP,
        is_active BOOLEAN DEFAULT true
      )`,
      
      // Tenant-specific projects table
      `CREATE TABLE IF NOT EXISTS ${tenantId}_projects (
        id VARCHAR(255) PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        owner_id VARCHAR(255) REFERENCES ${tenantId}_users(id),
        settings JSONB DEFAULT '{}',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        is_active BOOLEAN DEFAULT true
      )`,

      // Tenant-specific audit log
      `CREATE TABLE IF NOT EXISTS ${tenantId}_audit_log (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255),
        action VARCHAR(255) NOT NULL,
        resource_type VARCHAR(100),
        resource_id VARCHAR(255),
        details JSONB,
        ip_address INET,
        user_agent TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`,

      // Tenant-specific API usage tracking
      `CREATE TABLE IF NOT EXISTS ${tenantId}_api_usage (
        id VARCHAR(255) PRIMARY KEY,
        user_id VARCHAR(255),
        endpoint VARCHAR(255) NOT NULL,
        method VARCHAR(10) NOT NULL,
        status_code INTEGER,
        response_time INTEGER,
        tokens_used INTEGER DEFAULT 0,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`
    ];

    for (const query of schemaQueries) {
      try {
        await globalConnectionPool.query(query);
      } catch (error) {
        console.error(`[MultiTenant] Error creating schema for ${tenantId}:`, error);
        throw error;
      }
    }

    console.log(`[MultiTenant] Initialized schema for tenant: ${tenantId}`);
  }

  /**
   * Check tenant limits
   */
  async checkLimits(tenantId: string, resource: keyof TenantLimits): Promise<{
    allowed: boolean;
    current: number;
    max: number;
    remaining: number;
  }> {
    const tenant = await this.getTenant(tenantId);
    if (!tenant) {
      throw new Error(`Tenant not found: ${tenantId}`);
    }

    const limit = tenant.limits[resource];
    const remaining = limit.max - limit.current;

    return {
      allowed: limit.current < limit.max,
      current: limit.current,
      max: limit.max,
      remaining: Math.max(0, remaining)
    };
  }

  /**
   * Update tenant usage
   */
  async updateUsage(
    tenantId: string,
    resource: keyof TenantLimits,
    amount: number
  ): Promise<void> {
    const tenant = await this.getTenant(tenantId);
    if (!tenant) {
      throw new Error(`Tenant not found: ${tenantId}`);
    }

    const updatedLimits = { ...tenant.limits };
    updatedLimits[resource] = {
      ...updatedLimits[resource],
      current: updatedLimits[resource].current + amount
    };

    await this.updateTenant(tenantId, { limits: updatedLimits });

    // Emit usage event for monitoring
    this.emit('usageUpdated', {
      tenantId,
      resource,
      amount,
      newTotal: updatedLimits[resource].current,
      limit: updatedLimits[resource].max
    });

    // Check if approaching limits (90%)
    const usagePercent = (updatedLimits[resource].current / updatedLimits[resource].max) * 100;
    if (usagePercent >= 90) {
      this.emit('limitWarning', {
        tenantId,
        resource,
        usagePercent,
        current: updatedLimits[resource].current,
        max: updatedLimits[resource].max
      });
    }
  }

  /**
   * Create tenant context for request
   */
  createTenantContext(
    tenant: Tenant,
    user: TenantContext['user'],
    request: TenantContext['request']
  ): TenantContext {
    return {
      tenant,
      user,
      request
    };
  }

  /**
   * Get tenant metrics
   */
  async getTenantMetrics(tenantId: string): Promise<{
    users: { total: number; active: number };
    projects: { total: number; active: number };
    apiUsage: { today: number; thisMonth: number };
    storage: { used: number; limit: number };
  }> {
    try {
      const [usersResult, projectsResult, apiUsageResult] = await Promise.all([
        globalConnectionPool.query(
          `SELECT COUNT(*) as total, SUM(CASE WHEN is_active THEN 1 ELSE 0 END) as active 
           FROM ${tenantId}_users`
        ),
        globalConnectionPool.query(
          `SELECT COUNT(*) as total, SUM(CASE WHEN is_active THEN 1 ELSE 0 END) as active 
           FROM ${tenantId}_projects`
        ),
        globalConnectionPool.query(
          `SELECT 
             COUNT(CASE WHEN created_at >= CURRENT_DATE THEN 1 END) as today,
             COUNT(CASE WHEN created_at >= DATE_TRUNC('month', CURRENT_DATE) THEN 1 END) as this_month
           FROM ${tenantId}_api_usage`
        )
      ]);

      const tenant = await this.getTenant(tenantId);
      if (!tenant) {
        throw new Error(`Tenant not found: ${tenantId}`);
      }

      return {
        users: {
          total: parseInt(usersResult.rows[0]?.total || '0'),
          active: parseInt(usersResult.rows[0]?.active || '0')
        },
        projects: {
          total: parseInt(projectsResult.rows[0]?.total || '0'),
          active: parseInt(projectsResult.rows[0]?.active || '0')
        },
        apiUsage: {
          today: parseInt(apiUsageResult.rows[0]?.today || '0'),
          thisMonth: parseInt(apiUsageResult.rows[0]?.this_month || '0')
        },
        storage: {
          used: tenant.limits.storage.current,
          limit: tenant.limits.storage.max
        }
      };
    } catch (error) {
      console.error('[MultiTenant] Error getting tenant metrics:', error);
      throw error;
    }
  }

  /**
   * List all tenants with pagination
   */
  async listTenants(
    page = 1,
    limit = 50,
    filters: {
      status?: Tenant['status'];
      plan?: Tenant['plan'];
      search?: string;
    } = {}
  ): Promise<{
    tenants: Tenant[];
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  }> {
    let whereConditions = ['status != $1'];
    let queryParams: any[] = ['inactive'];
    let paramIndex = 2;

    if (filters.status) {
      whereConditions.push(`status = $${paramIndex}`);
      queryParams.push(filters.status);
      paramIndex++;
    }

    if (filters.plan) {
      whereConditions.push(`plan = $${paramIndex}`);
      queryParams.push(filters.plan);
      paramIndex++;
    }

    if (filters.search) {
      whereConditions.push(`(name ILIKE $${paramIndex} OR domain ILIKE $${paramIndex})`);
      queryParams.push(`%${filters.search}%`);
      paramIndex++;
    }

    const whereClause = whereConditions.join(' AND ');
    const offset = (page - 1) * limit;

    try {
      const [dataResult, countResult] = await Promise.all([
        globalConnectionPool.query(
          `SELECT * FROM tenants WHERE ${whereClause} 
           ORDER BY metadata->>'createdAt' DESC 
           LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`,
          [...queryParams, limit, offset]
        ),
        globalConnectionPool.query(
          `SELECT COUNT(*) as total FROM tenants WHERE ${whereClause}`,
          queryParams
        )
      ]);

      const tenants = dataResult.rows.map(row => this.mapRowToTenant(row));
      const total = parseInt(countResult.rows[0]?.total || '0');
      const totalPages = Math.ceil(total / limit);

      return {
        tenants,
        total,
        page,
        limit,
        totalPages
      };
    } catch (error) {
      console.error('[MultiTenant] Error listing tenants:', error);
      throw error;
    }
  }

  /**
   * Map database row to Tenant object
   */
  private mapRowToTenant(row: any): Tenant {
    return {
      id: row.id,
      name: row.name,
      domain: row.domain,
      subdomain: row.subdomain,
      status: row.status,
      plan: row.plan,
      settings: JSON.parse(row.settings || '{}'),
      limits: JSON.parse(row.limits || '{}'),
      metadata: JSON.parse(row.metadata || '{}')
    };
  }

  /**
   * Cleanup inactive tenants
   */
  async cleanupInactiveTenants(olderThanDays = 90): Promise<number> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - olderThanDays);

    try {
      const result = await globalConnectionPool.query(
        `DELETE FROM tenants 
         WHERE status = 'inactive' 
         AND (metadata->>'updatedAt')::timestamp < $1`,
        [cutoffDate.toISOString()]
      );

      const deletedCount = result.rowCount || 0;
      console.log(`[MultiTenant] Cleaned up ${deletedCount} inactive tenants`);
      
      return deletedCount;
    } catch (error) {
      console.error('[MultiTenant] Error cleaning up inactive tenants:', error);
      throw error;
    }
  }
}

// Global multi-tenant service instance
export const globalMultiTenantService = new MultiTenantService();

// Middleware for tenant resolution
export function tenantMiddleware() {
  return async (req: any, res: any, next: any) => {
    try {
      // Extract tenant identifier from request
      let tenantIdentifier = req.headers['x-tenant-id'] || 
                           req.query.tenant ||
                           req.subdomains[0];

      // If no explicit tenant, try to extract from host
      if (!tenantIdentifier && req.headers.host) {
        const host = req.headers.host;
        const parts = host.split('.');
        if (parts.length > 2) {
          tenantIdentifier = parts[0]; // subdomain
        }
      }

      if (!tenantIdentifier) {
        return res.status(400).json({
          error: 'Tenant identifier required',
          code: 'TENANT_REQUIRED'
        });
      }

      // Resolve tenant
      const tenant = await globalMultiTenantService.getTenantByDomain(tenantIdentifier) ||
                     await globalMultiTenantService.getTenant(tenantIdentifier);

      if (!tenant) {
        return res.status(404).json({
          error: 'Tenant not found',
          code: 'TENANT_NOT_FOUND'
        });
      }

      if (tenant.status !== 'active') {
        return res.status(403).json({
          error: 'Tenant access suspended',
          code: 'TENANT_SUSPENDED'
        });
      }

      // Add tenant to request context
      req.tenant = tenant;
      req.tenantId = tenant.id;

      next();
    } catch (error) {
      console.error('[MultiTenant] Middleware error:', error);
      return res.status(500).json({
        error: 'Tenant resolution failed',
        code: 'TENANT_ERROR'
      });
    }
  };
}