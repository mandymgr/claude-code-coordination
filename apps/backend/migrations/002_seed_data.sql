-- Claude Code Coordination Seed Data
-- Migration 002: Initial system data and default configurations

-- Insert default organization
INSERT INTO organizations (id, name, slug, domain, settings, subscription_tier) 
VALUES (
  'org-default-uuid-here-000000000000',
  'Default Organization',
  'default',
  'localhost',
  '{"theme": "system", "language": "en", "timezone": "UTC"}',
  'enterprise'
) ON CONFLICT (slug) DO NOTHING;

-- Insert system roles
INSERT INTO roles (id, organization_id, name, description, is_system, permissions) VALUES
(
  'role-admin-uuid-here-0000000000000',
  'org-default-uuid-here-000000000000',
  'System Administrator',
  'Full system access with all permissions',
  true,
  ARRAY['system:*']
),
(
  'role-manager-uuid-here-00000000000',
  'org-default-uuid-here-000000000000',
  'Organization Manager',
  'Manage organization settings and users',
  true,
  ARRAY['org:manage', 'user:*', 'role:*', 'audit:read']
),
(
  'role-developer-uuid-here-0000000000',
  'org-default-uuid-here-000000000000',
  'Developer',
  'Access to development tools and project management',
  true,
  ARRAY['project:*', 'ai:use', 'code:*', 'deploy:*']
),
(
  'role-analyst-uuid-here-00000000000',
  'org-default-uuid-here-000000000000',
  'Analyst',
  'Read access to analytics and reports',
  true,
  ARRAY['analytics:read', 'report:read', 'audit:read']
),
(
  'role-user-uuid-here-0000000000000',
  'org-default-uuid-here-000000000000',
  'User',
  'Basic user access',
  true,
  ARRAY['profile:manage', 'project:read']
) ON CONFLICT (organization_id, name) DO NOTHING;

-- Insert system permissions
INSERT INTO permissions (organization_id, resource, action, scope, description) VALUES
-- System permissions
('org-default-uuid-here-000000000000', 'system', 'admin', 'global', 'Full system administration'),
('org-default-uuid-here-000000000000', 'system', 'read', 'organization', 'Read system information'),

-- Organization permissions
('org-default-uuid-here-000000000000', 'organization', 'manage', 'organization', 'Manage organization settings'),
('org-default-uuid-here-000000000000', 'organization', 'read', 'organization', 'Read organization information'),

-- User management permissions
('org-default-uuid-here-000000000000', 'user', 'create', 'organization', 'Create new users'),
('org-default-uuid-here-000000000000', 'user', 'read', 'organization', 'Read user information'),
('org-default-uuid-here-000000000000', 'user', 'update', 'organization', 'Update user information'),
('org-default-uuid-here-000000000000', 'user', 'delete', 'organization', 'Delete users'),
('org-default-uuid-here-000000000000', 'user', 'impersonate', 'organization', 'Impersonate other users'),

-- Role management permissions
('org-default-uuid-here-000000000000', 'role', 'create', 'organization', 'Create new roles'),
('org-default-uuid-here-000000000000', 'role', 'read', 'organization', 'Read role information'),
('org-default-uuid-here-000000000000', 'role', 'update', 'organization', 'Update role permissions'),
('org-default-uuid-here-000000000000', 'role', 'delete', 'organization', 'Delete roles'),
('org-default-uuid-here-000000000000', 'role', 'assign', 'organization', 'Assign roles to users'),

-- Project permissions
('org-default-uuid-here-000000000000', 'project', 'create', 'organization', 'Create new projects'),
('org-default-uuid-here-000000000000', 'project', 'read', 'organization', 'Read project information'),
('org-default-uuid-here-000000000000', 'project', 'update', 'organization', 'Update project settings'),
('org-default-uuid-here-000000000000', 'project', 'delete', 'organization', 'Delete projects'),

-- Code permissions
('org-default-uuid-here-000000000000', 'code', 'read', 'organization', 'Read code repositories'),
('org-default-uuid-here-000000000000', 'code', 'write', 'organization', 'Modify code repositories'),
('org-default-uuid-here-000000000000', 'code', 'review', 'organization', 'Review code changes'),

-- AI permissions
('org-default-uuid-here-000000000000', 'ai', 'use', 'organization', 'Use AI assistance features'),
('org-default-uuid-here-000000000000', 'ai', 'configure', 'organization', 'Configure AI settings'),
('org-default-uuid-here-000000000000', 'ai', 'train', 'organization', 'Train custom AI models'),

-- Deployment permissions
('org-default-uuid-here-000000000000', 'deploy', 'create', 'organization', 'Create deployments'),
('org-default-uuid-here-000000000000', 'deploy', 'read', 'organization', 'Read deployment status'),
('org-default-uuid-here-000000000000', 'deploy', 'rollback', 'organization', 'Rollback deployments'),

-- Analytics permissions
('org-default-uuid-here-000000000000', 'analytics', 'read', 'organization', 'View analytics dashboards'),
('org-default-uuid-here-000000000000', 'analytics', 'export', 'organization', 'Export analytics data'),

-- Report permissions
('org-default-uuid-here-000000000000', 'report', 'read', 'organization', 'View reports'),
('org-default-uuid-here-000000000000', 'report', 'create', 'organization', 'Create custom reports'),
('org-default-uuid-here-000000000000', 'report', 'export', 'organization', 'Export report data'),

-- Audit permissions
('org-default-uuid-here-000000000000', 'audit', 'read', 'organization', 'View audit logs'),
('org-default-uuid-here-000000000000', 'audit', 'export', 'organization', 'Export audit logs'),

-- Profile permissions
('org-default-uuid-here-000000000000', 'profile', 'manage', 'user', 'Manage own profile')
ON CONFLICT (organization_id, resource, action, scope) DO NOTHING;

-- Map permissions to system roles
INSERT INTO role_permissions (role_id, permission_id)
SELECT r.id, p.id
FROM roles r, permissions p
WHERE r.organization_id = p.organization_id
  AND r.organization_id = 'org-default-uuid-here-000000000000'
  AND (
    -- Admin gets all permissions
    (r.name = 'System Administrator') OR
    
    -- Manager gets org and user management
    (r.name = 'Organization Manager' AND p.resource IN ('organization', 'user', 'role', 'audit')) OR
    
    -- Developer gets project, code, AI, deploy permissions
    (r.name = 'Developer' AND p.resource IN ('project', 'code', 'ai', 'deploy', 'profile')) OR
    
    -- Analyst gets read permissions for analytics, reports, audit
    (r.name = 'Analyst' AND p.resource IN ('analytics', 'report', 'audit', 'profile') AND p.action IN ('read', 'manage')) OR
    
    -- User gets basic profile management
    (r.name = 'User' AND p.resource = 'profile' AND p.action = 'manage') OR
    (r.name = 'User' AND p.resource = 'project' AND p.action = 'read')
  )
ON CONFLICT (role_id, permission_id) DO NOTHING;

-- Create default admin user
INSERT INTO users (
  id, 
  organization_id, 
  username, 
  email, 
  password_hash,
  first_name,
  last_name,
  is_active,
  is_verified
) VALUES (
  'user-admin-uuid-here-0000000000000',
  'org-default-uuid-here-000000000000',
  'admin',
  'admin@localhost',
  '$2b$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewKyEJZ0vNBywA1K', -- password: 'admin123'
  'System',
  'Administrator',
  true,
  true
) ON CONFLICT (organization_id, username) DO NOTHING;

-- Assign admin role to admin user
INSERT INTO user_roles (user_id, role_id, granted_by)
VALUES (
  'user-admin-uuid-here-0000000000000',
  'role-admin-uuid-here-0000000000000',
  'user-admin-uuid-here-0000000000000'
) ON CONFLICT (user_id, role_id) DO NOTHING;

-- Insert default authentication providers
INSERT INTO auth_providers (organization_id, provider_type, provider_name, config, is_enabled) VALUES
(
  'org-default-uuid-here-000000000000',
  'oauth',
  'google',
  '{
    "client_id": "",
    "client_secret": "",
    "callback_url": "http://localhost:8080/api/auth/oauth/google/callback",
    "scope": "email profile"
  }',
  false
),
(
  'org-default-uuid-here-000000000000',
  'oauth',
  'microsoft',
  '{
    "client_id": "",
    "client_secret": "",
    "callback_url": "http://localhost:8080/api/auth/oauth/microsoft/callback",
    "scope": "email profile"
  }',
  false
),
(
  'org-default-uuid-here-000000000000',
  'oauth',
  'github',
  '{
    "client_id": "",
    "client_secret": "",
    "callback_url": "http://localhost:8080/api/auth/oauth/github/callback",
    "scope": "user:email"
  }',
  false
),
(
  'org-default-uuid-here-000000000000',
  'saml',
  'enterprise-sso',
  '{
    "entry_point": "",
    "issuer": "claude-coordination",
    "callback_url": "http://localhost:8080/api/auth/saml/callback",
    "cert": "",
    "private_key": ""
  }',
  false
) ON CONFLICT (organization_id, provider_type, provider_name) DO NOTHING;

-- Log initial setup in audit events
INSERT INTO audit_events (
  organization_id,
  user_id,
  event_type,
  resource_type,
  action,
  outcome,
  details
) VALUES (
  'org-default-uuid-here-000000000000',
  'user-admin-uuid-here-0000000000000',
  'system',
  'organization',
  'initial_setup',
  'success',
  '{"message": "System initialized with default organization and admin user", "version": "3.0.0"}'
);