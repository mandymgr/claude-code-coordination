import { EventEmitter } from 'events';
import { globalConnectionPool } from '../performance/connectionPool';
import { globalMultiTenantService, Tenant } from './multiTenant';
import crypto from 'crypto';

export interface SSOProvider {
  id: string;
  tenantId: string;
  name: string;
  type: 'saml2' | 'oidc' | 'oauth2' | 'ldap';
  status: 'active' | 'inactive' | 'testing';
  config: SSOProviderConfig;
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    lastUsed?: Date;
    totalLogins: number;
  };
}

export type SSOProviderConfig = 
  | SAML2Config 
  | OIDCConfig 
  | OAuth2Config 
  | LDAPConfig;

export interface SAML2Config {
  type: 'saml2';
  entityId: string;
  ssoUrl: string;
  sloUrl?: string;
  x509Certificate: string;
  signatureAlgorithm: 'RSA-SHA1' | 'RSA-SHA256';
  digestAlgorithm: 'SHA1' | 'SHA256';
  nameIdFormat: string;
  attributeMapping: {
    email: string;
    firstName?: string;
    lastName?: string;
    displayName?: string;
    groups?: string;
    department?: string;
  };
  encryptAssertions: boolean;
  signRequests: boolean;
  allowUnencryptedAssertion: boolean;
}

export interface OIDCConfig {
  type: 'oidc';
  issuer: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scope: string[];
  responseType: 'code' | 'id_token' | 'code id_token';
  responseMode: 'query' | 'fragment' | 'form_post';
  userInfoEndpoint?: string;
  jwksUri: string;
  tokenEndpoint: string;
  authorizationEndpoint: string;
  endSessionEndpoint?: string;
  claimsMapping: {
    sub: string;
    email: string;
    name?: string;
    given_name?: string;
    family_name?: string;
    groups?: string;
  };
}

export interface OAuth2Config {
  type: 'oauth2';
  authorizationUrl: string;
  tokenUrl: string;
  userInfoUrl: string;
  clientId: string;
  clientSecret: string;
  redirectUri: string;
  scope: string[];
  responseType: string;
  grantType: string;
  userMapping: {
    id: string;
    email: string;
    name?: string;
    avatar?: string;
  };
}

export interface LDAPConfig {
  type: 'ldap';
  host: string;
  port: number;
  secure: boolean;
  bindDn: string;
  bindCredentials: string;
  searchBase: string;
  searchFilter: string;
  searchAttributes: string[];
  groupSearchBase?: string;
  groupSearchFilter?: string;
  attributeMapping: {
    username: string;
    email: string;
    firstName?: string;
    lastName?: string;
    groups?: string;
  };
  tlsOptions?: {
    rejectUnauthorized: boolean;
    ca?: string;
  };
}

export interface SSOSession {
  id: string;
  tenantId: string;
  providerId: string;
  userId: string;
  sessionToken: string;
  externalUserId: string;
  userAttributes: Record<string, any>;
  createdAt: Date;
  expiresAt: Date;
  lastActivityAt: Date;
  ipAddress: string;
  userAgent: string;
}

export interface SSOUser {
  id: string;
  tenantId: string;
  providerId: string;
  externalId: string;
  email: string;
  firstName?: string;
  lastName?: string;
  displayName?: string;
  groups?: string[];
  attributes: Record<string, any>;
  isActive: boolean;
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export class EnterpriseSSO extends EventEmitter {
  private readonly algorithms = {
    'RSA-SHA1': 'RSA-SHA1',
    'RSA-SHA256': 'RSA-SHA256'
  };

  constructor() {
    super();
  }

  /**
   * Create SSO provider for tenant
   */
  async createSSOProvider(
    tenantId: string,
    providerData: Omit<SSOProvider, 'id' | 'metadata'>
  ): Promise<SSOProvider> {
    // Validate tenant
    const tenant = await globalMultiTenantService.getTenant(tenantId);
    if (!tenant) {
      throw new Error(`Tenant not found: ${tenantId}`);
    }

    if (!tenant.settings.features.enableSSO) {
      throw new Error('SSO is not enabled for this tenant');
    }

    const providerId = `sso_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    const provider: SSOProvider = {
      ...providerData,
      id: providerId,
      tenantId,
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'system', // Should be actual user ID
        totalLogins: 0
      }
    };

    try {
      await globalConnectionPool.query(
        `INSERT INTO sso_providers (
          id, tenant_id, name, type, status, config, metadata
        ) VALUES ($1, $2, $3, $4, $5, $6, $7)`,
        [
          provider.id,
          provider.tenantId,
          provider.name,
          provider.type,
          provider.status,
          JSON.stringify(provider.config),
          JSON.stringify(provider.metadata)
        ]
      );

      this.emit('ssoProviderCreated', { provider });
      console.log(`[EnterpriseSSO] Created SSO provider: ${provider.id} (${provider.type})`);

      return provider;
    } catch (error) {
      console.error('[EnterpriseSSO] Error creating SSO provider:', error);
      throw error;
    }
  }

  /**
   * Get SSO provider by ID
   */
  async getSSOProvider(providerId: string): Promise<SSOProvider | null> {
    try {
      const result = await globalConnectionPool.query(
        'SELECT * FROM sso_providers WHERE id = $1',
        [providerId]
      );

      if (result.rows.length === 0) {
        return null;
      }

      return this.mapRowToSSOProvider(result.rows[0]);
    } catch (error) {
      console.error('[EnterpriseSSO] Error fetching SSO provider:', error);
      throw error;
    }
  }

  /**
   * Get SSO providers for tenant
   */
  async getTenantSSOProviders(tenantId: string): Promise<SSOProvider[]> {
    try {
      const result = await globalConnectionPool.query(
        'SELECT * FROM sso_providers WHERE tenant_id = $1 ORDER BY name',
        [tenantId]
      );

      return result.rows.map(row => this.mapRowToSSOProvider(row));
    } catch (error) {
      console.error('[EnterpriseSSO] Error fetching tenant SSO providers:', error);
      throw error;
    }
  }

  /**
   * Initiate SAML2 SSO
   */
  async initiateSAML2SSO(
    providerId: string,
    relayState?: string
  ): Promise<{ redirectUrl: string; requestId: string }> {
    const provider = await this.getSSOProvider(providerId);
    if (!provider || provider.type !== 'saml2') {
      throw new Error('Invalid SAML2 provider');
    }

    const config = provider.config as SAML2Config;
    const requestId = crypto.randomBytes(16).toString('hex');
    const timestamp = new Date().toISOString();

    // Generate SAML AuthnRequest
    const authnRequest = this.generateSAMLAuthnRequest(config, requestId, timestamp, relayState);
    
    // Encode and build redirect URL
    const encodedRequest = Buffer.from(authnRequest).toString('base64');
    const redirectUrl = `${config.ssoUrl}?SAMLRequest=${encodeURIComponent(encodedRequest)}${
      relayState ? `&RelayState=${encodeURIComponent(relayState)}` : ''
    }`;

    // Store request for validation
    await this.storeSSORequest(requestId, providerId, {
      type: 'saml2',
      timestamp,
      relayState
    });

    this.emit('ssoInitiated', { providerId, requestId, type: 'saml2' });

    return {
      redirectUrl,
      requestId
    };
  }

  /**
   * Process SAML2 response
   */
  async processSAML2Response(
    providerId: string,
    samlResponse: string,
    relayState?: string
  ): Promise<{ user: SSOUser; session: SSOSession }> {
    const provider = await this.getSSOProvider(providerId);
    if (!provider || provider.type !== 'saml2') {
      throw new Error('Invalid SAML2 provider');
    }

    const config = provider.config as SAML2Config;

    try {
      // Decode SAML response
      const decodedResponse = Buffer.from(samlResponse, 'base64').toString('utf-8');
      
      // Validate and parse SAML response
      const userAttributes = await this.parseSAMLResponse(decodedResponse, config);
      
      // Create or update SSO user
      const ssoUser = await this.createOrUpdateSSOUser(
        provider.tenantId,
        providerId,
        userAttributes
      );

      // Create SSO session
      const session = await this.createSSOSession(
        provider.tenantId,
        providerId,
        ssoUser.id,
        userAttributes
      );

      // Update provider statistics
      await this.updateSSOProviderStats(providerId);

      this.emit('ssoCompleted', { 
        providerId, 
        userId: ssoUser.id, 
        type: 'saml2',
        sessionId: session.id 
      });

      return { user: ssoUser, session };
    } catch (error) {
      this.emit('ssoFailed', { providerId, type: 'saml2', error: error.message });
      throw error;
    }
  }

  /**
   * Initiate OIDC SSO
   */
  async initiateOIDCSSO(
    providerId: string,
    state?: string
  ): Promise<{ redirectUrl: string; state: string }> {
    const provider = await this.getSSOProvider(providerId);
    if (!provider || provider.type !== 'oidc') {
      throw new Error('Invalid OIDC provider');
    }

    const config = provider.config as OIDCConfig;
    const generatedState = state || crypto.randomBytes(16).toString('hex');
    const nonce = crypto.randomBytes(16).toString('hex');

    // Build authorization URL
    const params = new URLSearchParams({
      response_type: config.responseType,
      client_id: config.clientId,
      redirect_uri: config.redirectUri,
      scope: config.scope.join(' '),
      state: generatedState,
      nonce: nonce
    });

    if (config.responseMode) {
      params.append('response_mode', config.responseMode);
    }

    const redirectUrl = `${config.authorizationEndpoint}?${params.toString()}`;

    // Store state for validation
    await this.storeSSORequest(generatedState, providerId, {
      type: 'oidc',
      nonce,
      timestamp: new Date().toISOString()
    });

    this.emit('ssoInitiated', { providerId, state: generatedState, type: 'oidc' });

    return {
      redirectUrl,
      state: generatedState
    };
  }

  /**
   * Process OIDC callback
   */
  async processOIDCCallback(
    providerId: string,
    authorizationCode: string,
    state: string
  ): Promise<{ user: SSOUser; session: SSOSession }> {
    const provider = await this.getSSOProvider(providerId);
    if (!provider || provider.type !== 'oidc') {
      throw new Error('Invalid OIDC provider');
    }

    const config = provider.config as OIDCConfig;

    try {
      // Validate state
      const storedRequest = await this.getSSORequest(state);
      if (!storedRequest || storedRequest.providerId !== providerId) {
        throw new Error('Invalid state parameter');
      }

      // Exchange authorization code for tokens
      const tokenResponse = await this.exchangeOIDCCode(config, authorizationCode);
      
      // Get user info
      const userInfo = await this.getOIDCUserInfo(config, tokenResponse.access_token);
      
      // Create or update SSO user
      const ssoUser = await this.createOrUpdateSSOUser(
        provider.tenantId,
        providerId,
        userInfo
      );

      // Create SSO session
      const session = await this.createSSOSession(
        provider.tenantId,
        providerId,
        ssoUser.id,
        userInfo,
        tokenResponse
      );

      // Update provider statistics
      await this.updateSSOProviderStats(providerId);

      this.emit('ssoCompleted', { 
        providerId, 
        userId: ssoUser.id, 
        type: 'oidc',
        sessionId: session.id 
      });

      return { user: ssoUser, session };
    } catch (error) {
      this.emit('ssoFailed', { providerId, type: 'oidc', error: error.message });
      throw error;
    }
  }

  /**
   * Validate SSO session
   */
  async validateSSOSession(sessionToken: string): Promise<SSOSession | null> {
    try {
      const result = await globalConnectionPool.query(
        `SELECT s.*, p.tenant_id 
         FROM sso_sessions s
         JOIN sso_providers p ON s.provider_id = p.id
         WHERE s.session_token = $1 
         AND s.expires_at > NOW() 
         AND s.created_at IS NOT NULL`,
        [sessionToken]
      );

      if (result.rows.length === 0) {
        return null;
      }

      const session = this.mapRowToSSOSession(result.rows[0]);

      // Update last activity
      await globalConnectionPool.query(
        'UPDATE sso_sessions SET last_activity_at = NOW() WHERE id = $1',
        [session.id]
      );

      return session;
    } catch (error) {
      console.error('[EnterpriseSSO] Error validating SSO session:', error);
      return null;
    }
  }

  /**
   * Revoke SSO session
   */
  async revokeSSOSession(sessionId: string): Promise<boolean> {
    try {
      const result = await globalConnectionPool.query(
        'DELETE FROM sso_sessions WHERE id = $1',
        [sessionId]
      );

      const revoked = (result.rowCount || 0) > 0;
      if (revoked) {
        this.emit('sessionRevoked', { sessionId });
      }

      return revoked;
    } catch (error) {
      console.error('[EnterpriseSSO] Error revoking SSO session:', error);
      return false;
    }
  }

  /**
   * Get SSO analytics for tenant
   */
  async getSSOAnalytics(tenantId: string, days = 30): Promise<{
    totalLogins: number;
    uniqueUsers: number;
    providerBreakdown: Array<{
      providerId: string;
      providerName: string;
      logins: number;
      users: number;
    }>;
    dailyLogins: Array<{
      date: string;
      count: number;
    }>;
  }> {
    const cutoffDate = new Date();
    cutoffDate.setDate(cutoffDate.getDate() - days);

    try {
      const [totalResult, providerResult, dailyResult] = await Promise.all([
        // Total stats
        globalConnectionPool.query(
          `SELECT 
             COUNT(*) as total_logins,
             COUNT(DISTINCT user_id) as unique_users
           FROM sso_sessions s
           JOIN sso_providers p ON s.provider_id = p.id
           WHERE p.tenant_id = $1 AND s.created_at >= $2`,
          [tenantId, cutoffDate]
        ),
        
        // Provider breakdown
        globalConnectionPool.query(
          `SELECT 
             p.id as provider_id,
             p.name as provider_name,
             COUNT(s.id) as logins,
             COUNT(DISTINCT s.user_id) as users
           FROM sso_providers p
           LEFT JOIN sso_sessions s ON p.id = s.provider_id AND s.created_at >= $2
           WHERE p.tenant_id = $1
           GROUP BY p.id, p.name
           ORDER BY logins DESC`,
          [tenantId, cutoffDate]
        ),
        
        // Daily logins
        globalConnectionPool.query(
          `SELECT 
             DATE(s.created_at) as date,
             COUNT(*) as count
           FROM sso_sessions s
           JOIN sso_providers p ON s.provider_id = p.id
           WHERE p.tenant_id = $1 AND s.created_at >= $2
           GROUP BY DATE(s.created_at)
           ORDER BY date DESC`,
          [tenantId, cutoffDate]
        )
      ]);

      return {
        totalLogins: parseInt(totalResult.rows[0]?.total_logins || '0'),
        uniqueUsers: parseInt(totalResult.rows[0]?.unique_users || '0'),
        providerBreakdown: providerResult.rows.map(row => ({
          providerId: row.provider_id,
          providerName: row.provider_name,
          logins: parseInt(row.logins || '0'),
          users: parseInt(row.users || '0')
        })),
        dailyLogins: dailyResult.rows.map(row => ({
          date: row.date,
          count: parseInt(row.count || '0')
        }))
      };
    } catch (error) {
      console.error('[EnterpriseSSO] Error getting SSO analytics:', error);
      throw error;
    }
  }

  // Helper methods (simplified implementations)
  private generateSAMLAuthnRequest(
    config: SAML2Config, 
    requestId: string, 
    timestamp: string, 
    relayState?: string
  ): string {
    // Simplified SAML AuthnRequest generation
    // In production, use a proper SAML library like node-saml
    return `<?xml version="1.0" encoding="UTF-8"?>
<samlp:AuthnRequest 
  xmlns:samlp="urn:oasis:names:tc:SAML:2.0:protocol"
  xmlns:saml="urn:oasis:names:tc:SAML:2.0:assertion"
  ID="${requestId}"
  Version="2.0"
  IssueInstant="${timestamp}"
  Destination="${config.ssoUrl}">
  <saml:Issuer>${config.entityId}</saml:Issuer>
  <samlp:NameIDPolicy Format="${config.nameIdFormat}" AllowCreate="true"/>
</samlp:AuthnRequest>`;
  }

  private async parseSAMLResponse(response: string, config: SAML2Config): Promise<any> {
    // Simplified SAML response parsing
    // In production, use a proper SAML library for XML parsing and signature validation
    const attributes = {
      email: 'user@example.com',
      firstName: 'John',
      lastName: 'Doe',
      groups: ['users']
    };
    return attributes;
  }

  private async exchangeOIDCCode(config: OIDCConfig, code: string): Promise<any> {
    const response = await fetch(config.tokenEndpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${config.clientId}:${config.clientSecret}`).toString('base64')}`
      },
      body: new URLSearchParams({
        grant_type: 'authorization_code',
        code,
        redirect_uri: config.redirectUri
      })
    });

    return await response.json();
  }

  private async getOIDCUserInfo(config: OIDCConfig, accessToken: string): Promise<any> {
    if (!config.userInfoEndpoint) {
      throw new Error('UserInfo endpoint not configured');
    }

    const response = await fetch(config.userInfoEndpoint, {
      headers: {
        'Authorization': `Bearer ${accessToken}`
      }
    });

    return await response.json();
  }

  private async createOrUpdateSSOUser(
    tenantId: string,
    providerId: string,
    attributes: any
  ): Promise<SSOUser> {
    const email = attributes.email || attributes.emailAddress;
    if (!email) {
      throw new Error('Email attribute is required');
    }

    const userId = `sso_${tenantId}_${crypto.randomBytes(8).toString('hex')}`;

    const ssoUser: SSOUser = {
      id: userId,
      tenantId,
      providerId,
      externalId: attributes.id || attributes.sub || email,
      email,
      firstName: attributes.firstName || attributes.given_name,
      lastName: attributes.lastName || attributes.family_name,
      displayName: attributes.displayName || attributes.name,
      groups: attributes.groups || [],
      attributes,
      isActive: true,
      lastLoginAt: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    try {
      // Try to update existing user first
      const updateResult = await globalConnectionPool.query(
        `UPDATE sso_users SET
          email = $3, first_name = $4, last_name = $5, display_name = $6,
          groups = $7, attributes = $8, last_login_at = NOW(), updated_at = NOW()
         WHERE tenant_id = $1 AND provider_id = $2 AND external_id = $9
         RETURNING *`,
        [
          tenantId, providerId, email, ssoUser.firstName, ssoUser.lastName,
          ssoUser.displayName, JSON.stringify(ssoUser.groups),
          JSON.stringify(ssoUser.attributes), ssoUser.externalId
        ]
      );

      if (updateResult.rows.length > 0) {
        return this.mapRowToSSOUser(updateResult.rows[0]);
      }

      // Create new user
      await globalConnectionPool.query(
        `INSERT INTO sso_users (
          id, tenant_id, provider_id, external_id, email, first_name, last_name,
          display_name, groups, attributes, is_active, last_login_at, created_at, updated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14)`,
        [
          ssoUser.id, ssoUser.tenantId, ssoUser.providerId, ssoUser.externalId,
          ssoUser.email, ssoUser.firstName, ssoUser.lastName, ssoUser.displayName,
          JSON.stringify(ssoUser.groups), JSON.stringify(ssoUser.attributes),
          ssoUser.isActive, ssoUser.lastLoginAt, ssoUser.createdAt, ssoUser.updatedAt
        ]
      );

      return ssoUser;
    } catch (error) {
      console.error('[EnterpriseSSO] Error creating/updating SSO user:', error);
      throw error;
    }
  }

  private async createSSOSession(
    tenantId: string,
    providerId: string,
    userId: string,
    userAttributes: any,
    tokens?: any
  ): Promise<SSOSession> {
    const sessionId = `sess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const sessionToken = crypto.randomBytes(32).toString('hex');
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 8); // 8 hour session

    const session: SSOSession = {
      id: sessionId,
      tenantId,
      providerId,
      userId,
      sessionToken,
      externalUserId: userAttributes.id || userAttributes.sub || userAttributes.email,
      userAttributes,
      createdAt: new Date(),
      expiresAt,
      lastActivityAt: new Date(),
      ipAddress: '127.0.0.1', // Should come from request
      userAgent: 'Unknown' // Should come from request
    };

    try {
      await globalConnectionPool.query(
        `INSERT INTO sso_sessions (
          id, tenant_id, provider_id, user_id, session_token, external_user_id,
          user_attributes, created_at, expires_at, last_activity_at, ip_address, user_agent
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
        [
          session.id, session.tenantId, session.providerId, session.userId,
          session.sessionToken, session.externalUserId, JSON.stringify(session.userAttributes),
          session.createdAt, session.expiresAt, session.lastActivityAt,
          session.ipAddress, session.userAgent
        ]
      );

      return session;
    } catch (error) {
      console.error('[EnterpriseSSO] Error creating SSO session:', error);
      throw error;
    }
  }

  private async storeSSORequest(requestId: string, providerId: string, data: any): Promise<void> {
    const expiresAt = new Date();
    expiresAt.setMinutes(expiresAt.getMinutes() + 10); // 10 minute expiry

    await globalConnectionPool.query(
      `INSERT INTO sso_requests (id, provider_id, data, expires_at)
       VALUES ($1, $2, $3, $4)`,
      [requestId, providerId, JSON.stringify(data), expiresAt]
    );
  }

  private async getSSORequest(requestId: string): Promise<any> {
    const result = await globalConnectionPool.query(
      'SELECT * FROM sso_requests WHERE id = $1 AND expires_at > NOW()',
      [requestId]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return {
      id: result.rows[0].id,
      providerId: result.rows[0].provider_id,
      data: JSON.parse(result.rows[0].data),
      expiresAt: result.rows[0].expires_at
    };
  }

  private async updateSSOProviderStats(providerId: string): Promise<void> {
    await globalConnectionPool.query(
      `UPDATE sso_providers 
       SET metadata = jsonb_set(
         jsonb_set(metadata, '{lastUsed}', to_jsonb(NOW())),
         '{totalLogins}', 
         to_jsonb((COALESCE((metadata->>'totalLogins')::int, 0) + 1))
       )
       WHERE id = $1`,
      [providerId]
    );
  }

  // Mapping methods
  private mapRowToSSOProvider(row: any): SSOProvider {
    return {
      id: row.id,
      tenantId: row.tenant_id,
      name: row.name,
      type: row.type,
      status: row.status,
      config: JSON.parse(row.config),
      metadata: JSON.parse(row.metadata)
    };
  }

  private mapRowToSSOSession(row: any): SSOSession {
    return {
      id: row.id,
      tenantId: row.tenant_id,
      providerId: row.provider_id,
      userId: row.user_id,
      sessionToken: row.session_token,
      externalUserId: row.external_user_id,
      userAttributes: JSON.parse(row.user_attributes || '{}'),
      createdAt: row.created_at,
      expiresAt: row.expires_at,
      lastActivityAt: row.last_activity_at,
      ipAddress: row.ip_address,
      userAgent: row.user_agent
    };
  }

  private mapRowToSSOUser(row: any): SSOUser {
    return {
      id: row.id,
      tenantId: row.tenant_id,
      providerId: row.provider_id,
      externalId: row.external_id,
      email: row.email,
      firstName: row.first_name,
      lastName: row.last_name,
      displayName: row.display_name,
      groups: JSON.parse(row.groups || '[]'),
      attributes: JSON.parse(row.attributes || '{}'),
      isActive: row.is_active,
      lastLoginAt: row.last_login_at,
      createdAt: row.created_at,
      updatedAt: row.updated_at
    };
  }
}

// Global Enterprise SSO service
export const globalEnterpriseSSO = new EnterpriseSSO();