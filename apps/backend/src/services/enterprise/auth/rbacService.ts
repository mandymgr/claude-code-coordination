/**
 * Role-Based Access Control (RBAC) Service
 * 
 * Enterprise-grade permission management system with:
 * - Hierarchical roles and permissions
 * - Resource-based access control
 * - Organization-level isolation
 * - Conditional permissions
 */

import { DatabaseService } from '../../database/DatabaseService';
import { logger } from '../../utils/logger';
import { TelemetryUtils } from '../../observability/telemetry';

// Types
export interface Permission {
  id: string;
  resource: string;
  action: string;
  scope?: string;
  conditions?: PermissionCondition[];
  description?: string;
}

export interface PermissionCondition {
  field: string;
  operator: 'eq' | 'neq' | 'in' | 'nin' | 'gt' | 'lt' | 'gte' | 'lte' | 'contains' | 'starts_with';
  value: any;
}

export interface Role {
  id: string;
  name: string;
  description?: string;
  permissions: Permission[];
  organization_id?: string;
  parent_role_id?: string;
  is_system_role: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface AccessContext {
  user_id: string;
  organization_id?: string;
  project_id?: string;
  resource_owner_id?: string;
  additional_context?: Record<string, any>;
}

export interface AccessCheckResult {
  allowed: boolean;
  reason?: string;
  matched_permission?: Permission;
}

// System Resources
export enum SystemResource {
  USER = 'user',
  PROJECT = 'project',
  TASK = 'task',
  AI_MODEL = 'ai_model',
  ORGANIZATION = 'organization',
  ROLE = 'role',
  PERMISSION = 'permission',
  AUDIT_LOG = 'audit_log',
  BILLING = 'billing',
  SETTINGS = 'settings'
}

// System Actions
export enum SystemAction {
  CREATE = 'create',
  READ = 'read',
  UPDATE = 'update',
  DELETE = 'delete',
  EXECUTE = 'execute',
  ASSIGN = 'assign',
  INVITE = 'invite',
  APPROVE = 'approve',
  REJECT = 'reject',
  EXPORT = 'export',
  IMPORT = 'import',
  ADMIN = 'admin'
}

export class RBACService {
  private db: DatabaseService;
  private permissionCache = new Map<string, Permission[]>();
  private cacheExpiry = 300000; // 5 minutes

  constructor() {
    this.db = DatabaseService.getInstance();
  }

  /**
   * Check if user has permission to perform action on resource
   */
  async checkAccess(
    userId: string,
    resource: string,
    action: string,
    context?: AccessContext
  ): Promise<AccessCheckResult> {
    return TelemetryUtils.traceAsync('rbac.check_access', async () => {
      try {
        // Get user permissions
        const userPermissions = await this.getUserPermissions(userId);
        
        // Check each permission
        for (const permission of userPermissions) {
          if (this.matchesPermission(permission, resource, action)) {
            // Check conditions if present
            if (permission.conditions && permission.conditions.length > 0) {
              const conditionsMet = await this.evaluateConditions(
                permission.conditions,
                context || { user_id: userId }
              );
              
              if (conditionsMet) {
                logger.debug('Access granted', {
                  userId,
                  resource,
                  action,
                  permissionId: permission.id
                });
                
                return {
                  allowed: true,
                  matched_permission: permission
                };
              }
            } else {
              // No conditions, permission matches
              logger.debug('Access granted', {
                userId,
                resource,
                action,
                permissionId: permission.id
              });
              
              return {
                allowed: true,
                matched_permission: permission
              };
            }
          }
        }

        logger.debug('Access denied', {
          userId,
          resource,
          action,
          reason: 'No matching permissions'
        });

        return {
          allowed: false,
          reason: 'Access denied: insufficient permissions'
        };

      } catch (error) {
        logger.error('Access check failed', error);
        return {
          allowed: false,
          reason: 'Access check failed'
        };
      }
    });
  }

  /**
   * Get all permissions for a user (including inherited from roles)
   */
  async getUserPermissions(userId: string): Promise<Permission[]> {
    const cacheKey = `user_permissions:${userId}`;
    
    // Check cache
    const cached = this.permissionCache.get(cacheKey);
    if (cached) {
      return cached;
    }

    const query = `
      SELECT DISTINCT p.*
      FROM permissions p
      JOIN role_permissions rp ON p.id = rp.permission_id
      JOIN roles r ON rp.role_id = r.id
      JOIN user_roles ur ON r.id = ur.role_id
      WHERE ur.user_id = $1
      AND r.is_active = true
      ORDER BY p.resource, p.action
    `;

    const results = await this.db.query<any>(query, [userId]);
    const permissions = results.map(row => this.mapPermissionData(row));

    // Cache permissions
    this.permissionCache.set(cacheKey, permissions);
    setTimeout(() => this.permissionCache.delete(cacheKey), this.cacheExpiry);

    return permissions;
  }

  /**
   * Get user roles
   */
  async getUserRoles(userId: string): Promise<Role[]> {
    const query = `
      SELECT r.*, array_agg(
        json_build_object(
          'id', p.id,
          'resource', p.resource,
          'action', p.action,
          'conditions', p.conditions,
          'description', p.description
        )
      ) as permissions
      FROM roles r
      JOIN user_roles ur ON r.id = ur.role_id
      LEFT JOIN role_permissions rp ON r.id = rp.role_id
      LEFT JOIN permissions p ON rp.permission_id = p.id
      WHERE ur.user_id = $1
      GROUP BY r.id, r.name, r.description, r.organization_id, r.parent_role_id, r.is_system_role, r.created_at, r.updated_at
    `;

    const results = await this.db.query<any>(query, [userId]);
    return results.map(row => this.mapRoleData(row));
  }

  /**
   * Create new role
   */
  async createRole(roleData: {
    name: string;
    description?: string;
    organization_id?: string;
    parent_role_id?: string;
    permissions?: string[];
  }): Promise<Role> {
    return TelemetryUtils.traceAsync('rbac.create_role', async () => {
      const query = `
        INSERT INTO roles (name, description, organization_id, parent_role_id, is_system_role)
        VALUES ($1, $2, $3, $4, false)
        RETURNING id, created_at, updated_at
      `;

      const result = await this.db.queryOne<{id: string, created_at: Date, updated_at: Date}>(query, [
        roleData.name,
        roleData.description || null,
        roleData.organization_id || null,
        roleData.parent_role_id || null
      ]);

      if (!result) {
        throw new Error('Failed to create role');
      }

      // Assign permissions if provided
      if (roleData.permissions && roleData.permissions.length > 0) {
        await this.assignPermissionsToRole(result.id, roleData.permissions);
      }

      const role = await this.getRoleById(result.id);
      if (!role) {
        throw new Error('Failed to retrieve created role');
      }

      logger.info('Role created', {
        roleId: role.id,
        roleName: role.name,
        organizationId: role.organization_id
      });

      return role;
    });
  }

  /**
   * Update role
   */
  async updateRole(roleId: string, updates: {
    name?: string;
    description?: string;
    permissions?: string[];
  }): Promise<Role> {
    return TelemetryUtils.traceAsync('rbac.update_role', async () => {
      const setParts: string[] = [];
      const values: any[] = [];
      let valueIndex = 1;

      if (updates.name !== undefined) {
        setParts.push(`name = $${valueIndex++}`);
        values.push(updates.name);
      }

      if (updates.description !== undefined) {
        setParts.push(`description = $${valueIndex++}`);
        values.push(updates.description);
      }

      if (setParts.length > 0) {
        setParts.push(`updated_at = NOW()`);
        values.push(roleId);

        const query = `
          UPDATE roles 
          SET ${setParts.join(', ')}
          WHERE id = $${valueIndex}
        `;

        await this.db.query(query, values);
      }

      // Update permissions if provided
      if (updates.permissions !== undefined) {
        await this.setRolePermissions(roleId, updates.permissions);
      }

      const role = await this.getRoleById(roleId);
      if (!role) {
        throw new Error('Role not found');
      }

      // Clear permission cache
      this.clearPermissionCache();

      logger.info('Role updated', { roleId, updates });
      return role;
    });
  }

  /**
   * Delete role
   */
  async deleteRole(roleId: string): Promise<void> {
    return TelemetryUtils.traceAsync('rbac.delete_role', async () => {
      // Check if role is in use
      const usageQuery = 'SELECT COUNT(*) as count FROM user_roles WHERE role_id = $1';
      const usageResult = await this.db.queryOne<{count: string}>(usageQuery, [roleId]);
      
      if (parseInt(usageResult?.count || '0') > 0) {
        throw new Error('Cannot delete role: still assigned to users');
      }

      // Delete role permissions
      await this.db.query('DELETE FROM role_permissions WHERE role_id = $1', [roleId]);
      
      // Delete role
      await this.db.query('DELETE FROM roles WHERE id = $1', [roleId]);
      
      // Clear cache
      this.clearPermissionCache();
      
      logger.info('Role deleted', { roleId });
    });
  }

  /**
   * Assign role to user
   */
  async assignRoleToUser(userId: string, roleId: string): Promise<void> {
    return TelemetryUtils.traceAsync('rbac.assign_role', async () => {
      const query = `
        INSERT INTO user_roles (user_id, role_id)
        VALUES ($1, $2)
        ON CONFLICT (user_id, role_id) DO NOTHING
      `;

      await this.db.query(query, [userId, roleId]);
      
      // Clear user permission cache
      this.permissionCache.delete(`user_permissions:${userId}`);
      
      logger.info('Role assigned to user', { userId, roleId });
    });
  }

  /**
   * Remove role from user
   */
  async removeRoleFromUser(userId: string, roleId: string): Promise<void> {
    return TelemetryUtils.traceAsync('rbac.remove_role', async () => {
      const query = 'DELETE FROM user_roles WHERE user_id = $1 AND role_id = $2';
      await this.db.query(query, [userId, roleId]);
      
      // Clear user permission cache
      this.permissionCache.delete(`user_permissions:${userId}`);
      
      logger.info('Role removed from user', { userId, roleId });
    });
  }

  /**
   * Create custom permission
   */
  async createPermission(permissionData: {
    resource: string;
    action: string;
    conditions?: PermissionCondition[];
    description?: string;
  }): Promise<Permission> {
    return TelemetryUtils.traceAsync('rbac.create_permission', async () => {
      const query = `
        INSERT INTO permissions (resource, action, conditions, description)
        VALUES ($1, $2, $3, $4)
        RETURNING *
      `;

      const result = await this.db.queryOne<any>(query, [
        permissionData.resource,
        permissionData.action,
        JSON.stringify(permissionData.conditions || []),
        permissionData.description || null
      ]);

      if (!result) {
        throw new Error('Failed to create permission');
      }

      const permission = this.mapPermissionData(result);
      
      logger.info('Permission created', {
        permissionId: permission.id,
        resource: permission.resource,
        action: permission.action
      });

      return permission;
    });
  }

  /**
   * Get all available resources and actions
   */
  async getAvailablePermissions(): Promise<{
    resources: string[];
    actions: string[];
    permissions: Permission[];
  }> {
    const query = `
      SELECT DISTINCT resource, action, id, conditions, description
      FROM permissions
      ORDER BY resource, action
    `;

    const results = await this.db.query<any>(query, []);
    const permissions = results.map(row => this.mapPermissionData(row));

    const resources = [...new Set(permissions.map(p => p.resource))];
    const actions = [...new Set(permissions.map(p => p.action))];

    return {
      resources: resources.sort(),
      actions: actions.sort(),
      permissions
    };
  }

  /**
   * Get organization roles
   */
  async getOrganizationRoles(organizationId: string): Promise<Role[]> {
    const query = `
      SELECT r.*, array_agg(
        json_build_object(
          'id', p.id,
          'resource', p.resource,
          'action', p.action,
          'conditions', p.conditions,
          'description', p.description
        )
      ) as permissions
      FROM roles r
      LEFT JOIN role_permissions rp ON r.id = rp.role_id
      LEFT JOIN permissions p ON rp.permission_id = p.id
      WHERE r.organization_id = $1 OR r.is_system_role = true
      GROUP BY r.id
      ORDER BY r.is_system_role DESC, r.name
    `;

    const results = await this.db.query<any>(query, [organizationId]);
    return results.map(row => this.mapRoleData(row));
  }

  /**
   * Initialize system roles and permissions
   */
  async initializeSystemRoles(): Promise<void> {
    return TelemetryUtils.traceAsync('rbac.initialize_system_roles', async () => {
      // Create system permissions
      const systemPermissions = this.getSystemPermissions();
      
      for (const permData of systemPermissions) {
        await this.createOrUpdatePermission(permData);
      }

      // Create system roles
      const systemRoles = this.getSystemRoles();
      
      for (const roleData of systemRoles) {
        await this.createOrUpdateSystemRole(roleData);
      }

      logger.info('System roles and permissions initialized');
    });
  }

  // Private helper methods
  private matchesPermission(permission: Permission, resource: string, action: string): boolean {
    // Exact match
    if (permission.resource === resource && permission.action === action) {
      return true;
    }

    // Wildcard matches
    if (permission.resource === '*' && permission.action === action) {
      return true;
    }

    if (permission.resource === resource && permission.action === '*') {
      return true;
    }

    if (permission.resource === '*' && permission.action === '*') {
      return true;
    }

    return false;
  }

  private async evaluateConditions(
    conditions: PermissionCondition[],
    context: AccessContext
  ): Promise<boolean> {
    for (const condition of conditions) {
      if (!this.evaluateCondition(condition, context)) {
        return false;
      }
    }
    return true;
  }

  private evaluateCondition(condition: PermissionCondition, context: AccessContext): boolean {
    const contextValue = this.getContextValue(condition.field, context);
    
    switch (condition.operator) {
      case 'eq':
        return contextValue === condition.value;
      case 'neq':
        return contextValue !== condition.value;
      case 'in':
        return Array.isArray(condition.value) && condition.value.includes(contextValue);
      case 'nin':
        return Array.isArray(condition.value) && !condition.value.includes(contextValue);
      case 'gt':
        return contextValue > condition.value;
      case 'lt':
        return contextValue < condition.value;
      case 'gte':
        return contextValue >= condition.value;
      case 'lte':
        return contextValue <= condition.value;
      case 'contains':
        return typeof contextValue === 'string' && contextValue.includes(condition.value);
      case 'starts_with':
        return typeof contextValue === 'string' && contextValue.startsWith(condition.value);
      default:
        return false;
    }
  }

  private getContextValue(field: string, context: AccessContext): any {
    switch (field) {
      case 'user_id':
        return context.user_id;
      case 'organization_id':
        return context.organization_id;
      case 'project_id':
        return context.project_id;
      case 'resource_owner_id':
        return context.resource_owner_id;
      default:
        return context.additional_context?.[field];
    }
  }

  private async getRoleById(roleId: string): Promise<Role | null> {
    const query = `
      SELECT r.*, array_agg(
        CASE WHEN p.id IS NOT NULL THEN
          json_build_object(
            'id', p.id,
            'resource', p.resource,
            'action', p.action,
            'conditions', p.conditions,
            'description', p.description
          )
        END
      ) as permissions
      FROM roles r
      LEFT JOIN role_permissions rp ON r.id = rp.role_id
      LEFT JOIN permissions p ON rp.permission_id = p.id
      WHERE r.id = $1
      GROUP BY r.id
    `;

    const result = await this.db.queryOne<any>(query, [roleId]);
    return result ? this.mapRoleData(result) : null;
  }

  private async assignPermissionsToRole(roleId: string, permissionIds: string[]): Promise<void> {
    for (const permissionId of permissionIds) {
      const query = `
        INSERT INTO role_permissions (role_id, permission_id)
        VALUES ($1, $2)
        ON CONFLICT DO NOTHING
      `;
      await this.db.query(query, [roleId, permissionId]);
    }
  }

  private async setRolePermissions(roleId: string, permissionIds: string[]): Promise<void> {
    // Remove existing permissions
    await this.db.query('DELETE FROM role_permissions WHERE role_id = $1', [roleId]);
    
    // Add new permissions
    if (permissionIds.length > 0) {
      await this.assignPermissionsToRole(roleId, permissionIds);
    }
  }

  private async createOrUpdatePermission(permData: any): Promise<void> {
    const query = `
      INSERT INTO permissions (resource, action, conditions, description)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (resource, action) DO UPDATE SET
        conditions = $3,
        description = $4
    `;

    await this.db.query(query, [
      permData.resource,
      permData.action,
      JSON.stringify(permData.conditions || []),
      permData.description
    ]);
  }

  private async createOrUpdateSystemRole(roleData: any): Promise<void> {
    const query = `
      INSERT INTO roles (name, description, is_system_role)
      VALUES ($1, $2, true)
      ON CONFLICT (name) WHERE is_system_role = true DO UPDATE SET
        description = $2
      RETURNING id
    `;

    const result = await this.db.queryOne<{id: string}>(query, [
      roleData.name,
      roleData.description
    ]);

    if (result && roleData.permissions) {
      // Get permission IDs
      const permissionIds: string[] = [];
      for (const perm of roleData.permissions) {
        const permQuery = 'SELECT id FROM permissions WHERE resource = $1 AND action = $2';
        const permResult = await this.db.queryOne<{id: string}>(permQuery, [perm.resource, perm.action]);
        if (permResult) {
          permissionIds.push(permResult.id);
        }
      }

      await this.setRolePermissions(result.id, permissionIds);
    }
  }

  private mapPermissionData(row: any): Permission {
    return {
      id: row.id,
      resource: row.resource,
      action: row.action,
      conditions: row.conditions ? JSON.parse(row.conditions) : [],
      description: row.description
    };
  }

  private mapRoleData(row: any): Role {
    const permissions = row.permissions ? 
      row.permissions.filter((p: any) => p !== null) : [];

    return {
      id: row.id,
      name: row.name,
      description: row.description,
      permissions,
      organization_id: row.organization_id,
      parent_role_id: row.parent_role_id,
      is_system_role: row.is_system_role,
      created_at: row.created_at,
      updated_at: row.updated_at
    };
  }

  private clearPermissionCache(): void {
    this.permissionCache.clear();
  }

  private getSystemPermissions(): any[] {
    return [
      // User management
      { resource: SystemResource.USER, action: SystemAction.CREATE, description: 'Create users' },
      { resource: SystemResource.USER, action: SystemAction.READ, description: 'View users' },
      { resource: SystemResource.USER, action: SystemAction.UPDATE, description: 'Update users' },
      { resource: SystemResource.USER, action: SystemAction.DELETE, description: 'Delete users' },
      { resource: SystemResource.USER, action: SystemAction.INVITE, description: 'Invite users' },

      // Project management
      { resource: SystemResource.PROJECT, action: SystemAction.CREATE, description: 'Create projects' },
      { resource: SystemResource.PROJECT, action: SystemAction.READ, description: 'View projects' },
      { resource: SystemResource.PROJECT, action: SystemAction.UPDATE, description: 'Update projects' },
      { resource: SystemResource.PROJECT, action: SystemAction.DELETE, description: 'Delete projects' },
      { resource: SystemResource.PROJECT, action: SystemAction.ASSIGN, description: 'Assign users to projects' },

      // Task management
      { resource: SystemResource.TASK, action: SystemAction.CREATE, description: 'Create tasks' },
      { resource: SystemResource.TASK, action: SystemAction.READ, description: 'View tasks' },
      { resource: SystemResource.TASK, action: SystemAction.UPDATE, description: 'Update tasks' },
      { resource: SystemResource.TASK, action: SystemAction.DELETE, description: 'Delete tasks' },
      { resource: SystemResource.TASK, action: SystemAction.EXECUTE, description: 'Execute tasks' },
      { resource: SystemResource.TASK, action: SystemAction.ASSIGN, description: 'Assign tasks' },

      // AI model access
      { resource: SystemResource.AI_MODEL, action: SystemAction.READ, description: 'View AI models' },
      { resource: SystemResource.AI_MODEL, action: SystemAction.EXECUTE, description: 'Use AI models' },

      // Organization management
      { resource: SystemResource.ORGANIZATION, action: SystemAction.READ, description: 'View organization' },
      { resource: SystemResource.ORGANIZATION, action: SystemAction.UPDATE, description: 'Update organization' },
      { resource: SystemResource.ORGANIZATION, action: SystemAction.ADMIN, description: 'Administer organization' },

      // Role and permission management
      { resource: SystemResource.ROLE, action: SystemAction.CREATE, description: 'Create roles' },
      { resource: SystemResource.ROLE, action: SystemAction.READ, description: 'View roles' },
      { resource: SystemResource.ROLE, action: SystemAction.UPDATE, description: 'Update roles' },
      { resource: SystemResource.ROLE, action: SystemAction.DELETE, description: 'Delete roles' },
      { resource: SystemResource.ROLE, action: SystemAction.ASSIGN, description: 'Assign roles' },

      { resource: SystemResource.PERMISSION, action: SystemAction.CREATE, description: 'Create permissions' },
      { resource: SystemResource.PERMISSION, action: SystemAction.READ, description: 'View permissions' },
      { resource: SystemResource.PERMISSION, action: SystemAction.UPDATE, description: 'Update permissions' },
      { resource: SystemResource.PERMISSION, action: SystemAction.DELETE, description: 'Delete permissions' },

      // System administration
      { resource: SystemResource.AUDIT_LOG, action: SystemAction.READ, description: 'View audit logs' },
      { resource: SystemResource.AUDIT_LOG, action: SystemAction.EXPORT, description: 'Export audit logs' },

      { resource: SystemResource.BILLING, action: SystemAction.READ, description: 'View billing information' },
      { resource: SystemResource.BILLING, action: SystemAction.UPDATE, description: 'Update billing information' },

      { resource: SystemResource.SETTINGS, action: SystemAction.READ, description: 'View system settings' },
      { resource: SystemResource.SETTINGS, action: SystemAction.UPDATE, description: 'Update system settings' },

      // Admin wildcards
      { resource: '*', action: '*', description: 'Full system access' }
    ];
  }

  private getSystemRoles(): any[] {
    return [
      {
        name: 'super_admin',
        description: 'Full system administrator with all permissions',
        permissions: [
          { resource: '*', action: '*' }
        ]
      },
      {
        name: 'org_admin',
        description: 'Organization administrator',
        permissions: [
          { resource: SystemResource.ORGANIZATION, action: SystemAction.ADMIN },
          { resource: SystemResource.USER, action: SystemAction.CREATE },
          { resource: SystemResource.USER, action: SystemAction.READ },
          { resource: SystemResource.USER, action: SystemAction.UPDATE },
          { resource: SystemResource.USER, action: SystemAction.DELETE },
          { resource: SystemResource.USER, action: SystemAction.INVITE },
          { resource: SystemResource.PROJECT, action: SystemAction.CREATE },
          { resource: SystemResource.PROJECT, action: SystemAction.READ },
          { resource: SystemResource.PROJECT, action: SystemAction.UPDATE },
          { resource: SystemResource.PROJECT, action: SystemAction.DELETE },
          { resource: SystemResource.ROLE, action: SystemAction.CREATE },
          { resource: SystemResource.ROLE, action: SystemAction.READ },
          { resource: SystemResource.ROLE, action: SystemAction.UPDATE },
          { resource: SystemResource.ROLE, action: SystemAction.DELETE },
          { resource: SystemResource.ROLE, action: SystemAction.ASSIGN },
          { resource: SystemResource.BILLING, action: SystemAction.READ },
          { resource: SystemResource.BILLING, action: SystemAction.UPDATE },
          { resource: SystemResource.AUDIT_LOG, action: SystemAction.READ },
          { resource: SystemResource.AUDIT_LOG, action: SystemAction.EXPORT }
        ]
      },
      {
        name: 'project_manager',
        description: 'Project manager with team and project management permissions',
        permissions: [
          { resource: SystemResource.PROJECT, action: SystemAction.CREATE },
          { resource: SystemResource.PROJECT, action: SystemAction.READ },
          { resource: SystemResource.PROJECT, action: SystemAction.UPDATE },
          { resource: SystemResource.PROJECT, action: SystemAction.ASSIGN },
          { resource: SystemResource.TASK, action: SystemAction.CREATE },
          { resource: SystemResource.TASK, action: SystemAction.READ },
          { resource: SystemResource.TASK, action: SystemAction.UPDATE },
          { resource: SystemResource.TASK, action: SystemAction.DELETE },
          { resource: SystemResource.TASK, action: SystemAction.ASSIGN },
          { resource: SystemResource.USER, action: SystemAction.READ },
          { resource: SystemResource.USER, action: SystemAction.INVITE },
          { resource: SystemResource.AI_MODEL, action: SystemAction.READ },
          { resource: SystemResource.AI_MODEL, action: SystemAction.EXECUTE }
        ]
      },
      {
        name: 'developer',
        description: 'Standard developer with task execution permissions',
        permissions: [
          { resource: SystemResource.PROJECT, action: SystemAction.READ },
          { resource: SystemResource.TASK, action: SystemAction.CREATE },
          { resource: SystemResource.TASK, action: SystemAction.READ },
          { resource: SystemResource.TASK, action: SystemAction.UPDATE },
          { resource: SystemResource.TASK, action: SystemAction.EXECUTE },
          { resource: SystemResource.AI_MODEL, action: SystemAction.READ },
          { resource: SystemResource.AI_MODEL, action: SystemAction.EXECUTE },
          { resource: SystemResource.USER, action: SystemAction.READ }
        ]
      },
      {
        name: 'viewer',
        description: 'Read-only access to projects and tasks',
        permissions: [
          { resource: SystemResource.PROJECT, action: SystemAction.READ },
          { resource: SystemResource.TASK, action: SystemAction.READ },
          { resource: SystemResource.USER, action: SystemAction.READ }
        ]
      }
    ];
  }
}

export const rbacService = new RBACService();