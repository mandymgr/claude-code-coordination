import { EventEmitter } from 'events';
import crypto from 'crypto';

export interface ZeroTrustPolicy {
  id: string;
  name: string;
  description: string;
  type: 'identity' | 'device' | 'network' | 'data' | 'application' | 'workload';
  rules: PolicyRule[];
  enforcement: 'monitor' | 'warn' | 'block' | 'quarantine';
  priority: number; // 1-10, higher = more priority
  isEnabled: boolean;
  conditions: PolicyCondition[];
  actions: PolicyAction[];
  metadata: {
    createdBy: string;
    createdAt: Date;
    lastModified: Date;
    version: number;
  };
}

export interface PolicyRule {
  id: string;
  name: string;
  type: 'allow' | 'deny' | 'require_mfa' | 'require_approval' | 'log_only';
  conditions: RuleCondition[];
  exceptions?: RuleException[];
  ttl?: number; // seconds, for temporary rules
}

export interface RuleCondition {
  field: string; // user.role, device.trust_level, location.country, etc.
  operator: 'equals' | 'not_equals' | 'contains' | 'not_contains' | 'in' | 'not_in' | 'greater_than' | 'less_than';
  value: any;
  caseSensitive?: boolean;
}

export interface RuleException {
  description: string;
  conditions: RuleCondition[];
  expiry?: Date;
  approver?: string;
}

export interface PolicyCondition {
  type: 'time_window' | 'geo_location' | 'risk_score' | 'device_state' | 'user_behavior';
  parameters: Record<string, any>;
}

export interface PolicyAction {
  type: 'log' | 'alert' | 'block' | 'redirect' | 'mfa_challenge' | 'device_isolation' | 'user_notification';
  parameters: Record<string, any>;
  priority: number;
}

export interface TrustScore {
  entityId: string;
  entityType: 'user' | 'device' | 'application' | 'network' | 'data';
  score: number; // 0-100, higher = more trusted
  factors: TrustFactor[];
  lastCalculated: Date;
  trend: 'improving' | 'stable' | 'degrading';
  confidence: number; // 0-100, confidence in the score
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
}

export interface TrustFactor {
  name: string;
  weight: number; // 0-1, contribution to overall score
  value: number; // 0-100
  description: string;
  source: string; // where this factor came from
  lastUpdated: Date;
}

export interface SecurityContext {
  sessionId: string;
  userId: string;
  deviceId: string;
  location: {
    country: string;
    region: string;
    city: string;
    coordinates?: { lat: number; lon: number };
    vpn: boolean;
    tor: boolean;
  };
  network: {
    ip: string;
    asn: string;
    isp: string;
    riskScore: number;
  };
  behavior: {
    loginPattern: 'normal' | 'unusual' | 'suspicious';
    accessPattern: 'normal' | 'unusual' | 'suspicious';
    timeOfDay: 'normal' | 'unusual';
    frequency: 'normal' | 'high' | 'low';
  };
  device: DeviceTrust;
  application: {
    name: string;
    version: string;
    integrity: boolean;
  };
}

export interface DeviceTrust {
  deviceId: string;
  type: 'desktop' | 'laptop' | 'mobile' | 'tablet' | 'server';
  os: {
    name: string;
    version: string;
    patchLevel: string;
  };
  browser?: {
    name: string;
    version: string;
    fingerprint: string;
  };
  security: {
    encrypted: boolean;
    antivirus: boolean;
    firewall: boolean;
    vpnClient: boolean;
    jailbroken: boolean;
    rooted: boolean;
  };
  compliance: {
    managed: boolean;
    compliant: boolean;
    lastCheck: Date;
    issues: string[];
  };
  trustLevel: 'unknown' | 'untrusted' | 'limited' | 'trusted' | 'highly_trusted';
  registrationDate: Date;
  lastSeen: Date;
}

export interface AccessRequest {
  id: string;
  userId: string;
  deviceId: string;
  resource: string;
  action: string;
  timestamp: Date;
  context: SecurityContext;
  decision: AccessDecision;
  policyEvaluations: PolicyEvaluation[];
}

export interface AccessDecision {
  result: 'allow' | 'deny' | 'challenge' | 'conditional';
  confidence: number; // 0-100
  riskScore: number; // 0-100
  reasoning: string[];
  requirements?: AccessRequirement[];
  ttl?: number; // seconds
  reviewRequired?: boolean;
}

export interface AccessRequirement {
  type: 'mfa' | 'device_verification' | 'approval' | 'additional_auth' | 'terms_acceptance';
  description: string;
  status: 'pending' | 'satisfied' | 'failed';
  expires?: Date;
}

export interface PolicyEvaluation {
  policyId: string;
  policyName: string;
  result: 'match' | 'no_match' | 'error';
  action: 'allow' | 'deny' | 'challenge';
  reasoning: string;
  executionTime: number; // milliseconds
}

export interface SecurityEvent {
  id: string;
  type: 'policy_violation' | 'anomalous_access' | 'failed_authentication' | 'suspicious_behavior' | 'compliance_violation';
  severity: 'low' | 'medium' | 'high' | 'critical';
  userId?: string;
  deviceId?: string;
  resource?: string;
  description: string;
  details: Record<string, any>;
  context: SecurityContext;
  timestamp: Date;
  acknowledged: boolean;
  investigationStatus: 'open' | 'investigating' | 'resolved' | 'false_positive';
  assignedTo?: string;
  resolution?: string;
  relatedEvents: string[]; // related event IDs
}

export interface ThreatIntelligence {
  id: string;
  type: 'ip_reputation' | 'domain_reputation' | 'file_hash' | 'behavioral_pattern' | 'vulnerability';
  source: string;
  confidence: number; // 0-100
  severity: 'low' | 'medium' | 'high' | 'critical';
  indicators: ThreatIndicator[];
  description: string;
  mitigation: string[];
  lastUpdated: Date;
  expires?: Date;
}

export interface ThreatIndicator {
  type: 'ip' | 'domain' | 'hash' | 'pattern' | 'signature';
  value: string;
  context: string;
  firstSeen: Date;
  lastSeen: Date;
  occurrences: number;
}

export class ZeroTrustService extends EventEmitter {
  private policies: Map<string, ZeroTrustPolicy> = new Map();
  private trustScores: Map<string, TrustScore> = new Map();
  private securityEvents: Map<string, SecurityEvent> = new Map();
  private accessRequests: Map<string, AccessRequest> = new Map();
  private threatIntelligence: Map<string, ThreatIntelligence> = new Map();
  private activeContexts: Map<string, SecurityContext> = new Map();

  constructor() {
    super();
    this.initializeDefaultPolicies();
    this.initializeThreatIntelligence();
    this.startContinuousMonitoring();
  }

  private initializeDefaultPolicies(): void {
    const defaultPolicies: ZeroTrustPolicy[] = [
      {
        id: 'admin_access_policy',
        name: 'Administrative Access Control',
        description: 'Strict controls for administrative functions',
        type: 'identity',
        rules: [
          {
            id: 'require_mfa_admin',
            name: 'Require MFA for Admin Actions',
            type: 'require_mfa',
            conditions: [
              { field: 'user.role', operator: 'in', value: ['admin', 'super_admin'] },
              { field: 'action', operator: 'contains', value: 'admin' }
            ]
          },
          {
            id: 'trusted_device_admin',
            name: 'Require Trusted Device for Admin',
            type: 'deny',
            conditions: [
              { field: 'user.role', operator: 'equals', value: 'admin' },
              { field: 'device.trustLevel', operator: 'not_in', value: ['trusted', 'highly_trusted'] }
            ]
          }
        ],
        enforcement: 'block',
        priority: 10,
        isEnabled: true,
        conditions: [],
        actions: [
          {
            type: 'log',
            parameters: { level: 'warning' },
            priority: 1
          },
          {
            type: 'alert',
            parameters: { notify: ['security_team'] },
            priority: 2
          }
        ],
        metadata: {
          createdBy: 'system',
          createdAt: new Date(),
          lastModified: new Date(),
          version: 1
        }
      },
      {
        id: 'geo_restriction_policy',
        name: 'Geographical Access Restrictions',
        description: 'Restrict access from high-risk countries',
        type: 'network',
        rules: [
          {
            id: 'block_high_risk_countries',
            name: 'Block High-Risk Countries',
            type: 'deny',
            conditions: [
              { field: 'location.country', operator: 'in', value: ['CN', 'RU', 'KP', 'IR'] }
            ],
            exceptions: [
              {
                description: 'VPN users with approval',
                conditions: [
                  { field: 'location.vpn', operator: 'equals', value: true },
                  { field: 'user.approved_vpn', operator: 'equals', value: true }
                ]
              }
            ]
          }
        ],
        enforcement: 'block',
        priority: 8,
        isEnabled: true,
        conditions: [],
        actions: [
          {
            type: 'log',
            parameters: { level: 'warning' },
            priority: 1
          },
          {
            type: 'user_notification',
            parameters: { message: 'Access denied from restricted location' },
            priority: 2
          }
        ],
        metadata: {
          createdBy: 'system',
          createdAt: new Date(),
          lastModified: new Date(),
          version: 1
        }
      },
      {
        id: 'anomaly_detection_policy',
        name: 'Behavioral Anomaly Detection',
        description: 'Detect and respond to anomalous user behavior',
        type: 'identity',
        rules: [
          {
            id: 'unusual_access_pattern',
            name: 'Unusual Access Pattern',
            type: 'require_mfa',
            conditions: [
              { field: 'behavior.accessPattern', operator: 'equals', value: 'suspicious' }
            ]
          },
          {
            id: 'login_from_new_location',
            name: 'Login from New Location',
            type: 'require_mfa',
            conditions: [
              { field: 'behavior.loginPattern', operator: 'equals', value: 'unusual' }
            ]
          }
        ],
        enforcement: 'warn',
        priority: 7,
        isEnabled: true,
        conditions: [],
        actions: [
          {
            type: 'mfa_challenge',
            parameters: { methods: ['totp', 'push'] },
            priority: 1
          }
        ],
        metadata: {
          createdBy: 'system',
          createdAt: new Date(),
          lastModified: new Date(),
          version: 1
        }
      },
      {
        id: 'device_compliance_policy',
        name: 'Device Compliance Requirements',
        description: 'Ensure devices meet security compliance standards',
        type: 'device',
        rules: [
          {
            id: 'encrypted_device_required',
            name: 'Require Encrypted Devices',
            type: 'deny',
            conditions: [
              { field: 'device.security.encrypted', operator: 'equals', value: false },
              { field: 'data.classification', operator: 'in', value: ['confidential', 'restricted'] }
            ]
          },
          {
            id: 'jailbroken_device_block',
            name: 'Block Jailbroken/Rooted Devices',
            type: 'deny',
            conditions: [
              { field: 'device.security.jailbroken', operator: 'equals', value: true }
            ]
          }
        ],
        enforcement: 'block',
        priority: 9,
        isEnabled: true,
        conditions: [],
        actions: [
          {
            type: 'device_isolation',
            parameters: { duration: 3600 },
            priority: 1
          }
        ],
        metadata: {
          createdBy: 'system',
          createdAt: new Date(),
          lastModified: new Date(),
          version: 1
        }
      },
      {
        id: 'data_classification_policy',
        name: 'Data Classification Access Control',
        description: 'Control access based on data sensitivity',
        type: 'data',
        rules: [
          {
            id: 'restricted_data_access',
            name: 'Restricted Data Access',
            type: 'require_approval',
            conditions: [
              { field: 'data.classification', operator: 'equals', value: 'restricted' },
              { field: 'user.clearance', operator: 'not_equals', value: 'top_secret' }
            ]
          }
        ],
        enforcement: 'block',
        priority: 10,
        isEnabled: true,
        conditions: [],
        actions: [
          {
            type: 'alert',
            parameters: { notify: ['data_owner', 'security_team'] },
            priority: 1
          }
        ],
        metadata: {
          createdBy: 'system',
          createdAt: new Date(),
          lastModified: new Date(),
          version: 1
        }
      }
    ];

    defaultPolicies.forEach(policy => {
      this.policies.set(policy.id, policy);
    });
  }

  private initializeThreatIntelligence(): void {
    const defaultThreats: ThreatIntelligence[] = [
      {
        id: 'tor_exit_nodes',
        type: 'ip_reputation',
        source: 'tor_project',
        confidence: 95,
        severity: 'medium',
        indicators: [
          {
            type: 'pattern',
            value: 'tor_exit_node',
            context: 'Known Tor exit node',
            firstSeen: new Date(),
            lastSeen: new Date(),
            occurrences: 1
          }
        ],
        description: 'Known Tor exit nodes used for anonymous access',
        mitigation: ['Additional verification required', 'Enhanced monitoring'],
        lastUpdated: new Date()
      },
      {
        id: 'malicious_ips',
        type: 'ip_reputation',
        source: 'threat_intelligence_feed',
        confidence: 90,
        severity: 'high',
        indicators: [
          {
            type: 'ip',
            value: '192.0.2.0/24',
            context: 'Known malicious IP range',
            firstSeen: new Date(Date.now() - 24 * 60 * 60 * 1000),
            lastSeen: new Date(),
            occurrences: 15
          }
        ],
        description: 'IP addresses associated with malicious activities',
        mitigation: ['Block access', 'Monitor for 30 days'],
        lastUpdated: new Date()
      }
    ];

    defaultThreats.forEach(threat => {
      this.threatIntelligence.set(threat.id, threat);
    });
  }

  private startContinuousMonitoring(): void {
    // Continuous trust score recalculation
    setInterval(() => {
      this.recalculateTrustScores();
    }, 5 * 60 * 1000); // Every 5 minutes

    // Security event correlation
    setInterval(() => {
      this.correlateSecurityEvents();
    }, 2 * 60 * 1000); // Every 2 minutes

    // Threat intelligence updates
    setInterval(() => {
      this.updateThreatIntelligence();
    }, 15 * 60 * 1000); // Every 15 minutes
  }

  async evaluateAccess(userId: string, deviceId: string, resource: string, action: string, context: Partial<SecurityContext>): Promise<AccessRequest> {
    const fullContext = await this.buildSecurityContext(userId, deviceId, context);
    
    const accessRequest: AccessRequest = {
      id: this.generateId('access'),
      userId,
      deviceId,
      resource,
      action,
      timestamp: new Date(),
      context: fullContext,
      decision: { result: 'deny', confidence: 0, riskScore: 100, reasoning: [] },
      policyEvaluations: []
    };

    // Evaluate all applicable policies
    const applicablePolicies = this.getApplicablePolicies(accessRequest);
    
    for (const policy of applicablePolicies) {
      const evaluation = await this.evaluatePolicy(policy, accessRequest);
      accessRequest.policyEvaluations.push(evaluation);
    }

    // Calculate overall decision
    accessRequest.decision = this.calculateAccessDecision(accessRequest.policyEvaluations);

    // Apply risk scoring
    const riskScore = await this.calculateRiskScore(fullContext);
    accessRequest.decision.riskScore = riskScore;

    // Store access request
    this.accessRequests.set(accessRequest.id, accessRequest);

    // Generate security events for denied or high-risk access
    if (accessRequest.decision.result === 'deny' || riskScore > 70) {
      await this.generateSecurityEvent(accessRequest);
    }

    this.emit('access_evaluated', accessRequest);

    return accessRequest;
  }

  private async buildSecurityContext(userId: string, deviceId: string, partialContext: Partial<SecurityContext>): Promise<SecurityContext> {
    // Get or create device trust info
    const deviceTrust = await this.getDeviceTrust(deviceId);
    
    // Analyze behavior patterns
    const behavior = await this.analyzeBehaviorPatterns(userId, deviceId);

    // Get location and network info
    const location = partialContext.location || await this.getLocationInfo(partialContext.network?.ip || '127.0.0.1');
    const network = partialContext.network || await this.getNetworkInfo(partialContext.network?.ip || '127.0.0.1');

    return {
      sessionId: partialContext.sessionId || this.generateId('session'),
      userId,
      deviceId,
      location,
      network,
      behavior,
      device: deviceTrust,
      application: partialContext.application || {
        name: 'claude-code-coordination',
        version: '3.0.0',
        integrity: true
      }
    };
  }

  private async getDeviceTrust(deviceId: string): Promise<DeviceTrust> {
    // In a real implementation, this would query device management systems
    return {
      deviceId,
      type: 'desktop',
      os: {
        name: 'Windows',
        version: '11',
        patchLevel: 'current'
      },
      browser: {
        name: 'Chrome',
        version: '120.0.0.0',
        fingerprint: crypto.createHash('md5').update(deviceId).digest('hex')
      },
      security: {
        encrypted: true,
        antivirus: true,
        firewall: true,
        vpnClient: false,
        jailbroken: false,
        rooted: false
      },
      compliance: {
        managed: true,
        compliant: true,
        lastCheck: new Date(),
        issues: []
      },
      trustLevel: 'trusted',
      registrationDate: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      lastSeen: new Date()
    };
  }

  private async analyzeBehaviorPatterns(userId: string, deviceId: string): Promise<SecurityContext['behavior']> {
    // Analyze historical access patterns
    const recentAccess = Array.from(this.accessRequests.values())
      .filter(req => req.userId === userId && req.deviceId === deviceId)
      .slice(-50); // Last 50 requests

    const now = new Date();
    const currentHour = now.getHours();
    const normalWorkingHours = currentHour >= 8 && currentHour <= 18;

    // Simple pattern analysis
    const accessFrequency = recentAccess.length;
    const uniqueResources = new Set(recentAccess.map(req => req.resource)).size;
    const avgTimeBetweenRequests = recentAccess.length > 1 
      ? (now.getTime() - recentAccess[0].timestamp.getTime()) / recentAccess.length
      : 0;

    return {
      loginPattern: 'normal', // Would be determined by ML analysis
      accessPattern: uniqueResources > 20 ? 'unusual' : 'normal',
      timeOfDay: normalWorkingHours ? 'normal' : 'unusual',
      frequency: accessFrequency > 100 ? 'high' : accessFrequency < 5 ? 'low' : 'normal'
    };
  }

  private async getLocationInfo(ip: string): Promise<SecurityContext['location']> {
    // Simulate geolocation lookup
    return {
      country: 'US',
      region: 'California',
      city: 'San Francisco',
      coordinates: { lat: 37.7749, lon: -122.4194 },
      vpn: false,
      tor: this.isTorExitNode(ip)
    };
  }

  private async getNetworkInfo(ip: string): Promise<SecurityContext['network']> {
    const riskScore = this.calculateNetworkRiskScore(ip);
    
    return {
      ip,
      asn: 'AS15169',
      isp: 'Google LLC',
      riskScore
    };
  }

  private isTorExitNode(ip: string): boolean {
    const torThreat = this.threatIntelligence.get('tor_exit_nodes');
    if (!torThreat) return false;

    return torThreat.indicators.some(indicator => 
      indicator.type === 'pattern' && indicator.value === 'tor_exit_node'
    );
  }

  private calculateNetworkRiskScore(ip: string): number {
    let riskScore = 0;

    // Check against threat intelligence
    for (const threat of this.threatIntelligence.values()) {
      if (threat.type === 'ip_reputation') {
        for (const indicator of threat.indicators) {
          if (indicator.type === 'ip' && this.ipInRange(ip, indicator.value)) {
            riskScore += (threat.severity === 'critical' ? 40 : 
                         threat.severity === 'high' ? 30 :
                         threat.severity === 'medium' ? 20 : 10);
          }
        }
      }
    }

    // Add other risk factors
    if (this.isPrivateNetwork(ip)) riskScore -= 20;
    if (this.isCloudProvider(ip)) riskScore += 10;

    return Math.max(0, Math.min(100, riskScore));
  }

  private ipInRange(ip: string, range: string): boolean {
    // Simplified CIDR check
    if (range.includes('/')) {
      const [network, mask] = range.split('/');
      return ip.startsWith(network.split('.').slice(0, Math.floor(parseInt(mask) / 8)).join('.'));
    }
    return ip === range;
  }

  private isPrivateNetwork(ip: string): boolean {
    return ip.startsWith('192.168.') || ip.startsWith('10.') || ip.startsWith('172.');
  }

  private isCloudProvider(ip: string): boolean {
    // Check against known cloud provider ranges
    const cloudRanges = ['8.8.8.8', '1.1.1.1']; // Simplified
    return cloudRanges.some(range => ip.startsWith(range.split('.').slice(0, 2).join('.')));
  }

  private getApplicablePolicies(accessRequest: AccessRequest): ZeroTrustPolicy[] {
    return Array.from(this.policies.values())
      .filter(policy => policy.isEnabled)
      .filter(policy => this.isPolicyApplicable(policy, accessRequest))
      .sort((a, b) => b.priority - a.priority);
  }

  private isPolicyApplicable(policy: ZeroTrustPolicy, accessRequest: AccessRequest): boolean {
    // Check if policy conditions are met
    for (const condition of policy.conditions) {
      if (!this.evaluatePolicyCondition(condition, accessRequest.context)) {
        return false;
      }
    }
    return true;
  }

  private evaluatePolicyCondition(condition: PolicyCondition, context: SecurityContext): boolean {
    switch (condition.type) {
      case 'time_window':
        return this.isWithinTimeWindow(condition.parameters);
      case 'geo_location':
        return this.matchesGeoLocation(condition.parameters, context.location);
      case 'risk_score':
        return context.network.riskScore >= condition.parameters.threshold;
      case 'device_state':
        return this.matchesDeviceState(condition.parameters, context.device);
      case 'user_behavior':
        return this.matchesUserBehavior(condition.parameters, context.behavior);
      default:
        return true;
    }
  }

  private isWithinTimeWindow(parameters: any): boolean {
    const now = new Date();
    const currentHour = now.getHours();
    return currentHour >= parameters.start && currentHour <= parameters.end;
  }

  private matchesGeoLocation(parameters: any, location: SecurityContext['location']): boolean {
    if (parameters.allowedCountries) {
      return parameters.allowedCountries.includes(location.country);
    }
    if (parameters.blockedCountries) {
      return !parameters.blockedCountries.includes(location.country);
    }
    return true;
  }

  private matchesDeviceState(parameters: any, device: DeviceTrust): boolean {
    if (parameters.requiredTrustLevel) {
      const trustLevels = ['unknown', 'untrusted', 'limited', 'trusted', 'highly_trusted'];
      const requiredIndex = trustLevels.indexOf(parameters.requiredTrustLevel);
      const deviceIndex = trustLevels.indexOf(device.trustLevel);
      return deviceIndex >= requiredIndex;
    }
    return true;
  }

  private matchesUserBehavior(parameters: any, behavior: SecurityContext['behavior']): boolean {
    if (parameters.allowedPatterns) {
      return parameters.allowedPatterns.includes(behavior.accessPattern);
    }
    return true;
  }

  private async evaluatePolicy(policy: ZeroTrustPolicy, accessRequest: AccessRequest): Promise<PolicyEvaluation> {
    const startTime = Date.now();
    let result: PolicyEvaluation['result'] = 'no_match';
    let action: PolicyEvaluation['action'] = 'allow';
    let reasoning = '';

    try {
      for (const rule of policy.rules) {
        const ruleMatches = this.evaluateRule(rule, accessRequest);
        
        if (ruleMatches) {
          result = 'match';
          action = rule.type === 'allow' ? 'allow' : 
                   rule.type === 'deny' ? 'deny' : 'challenge';
          reasoning = `Rule '${rule.name}' matched`;
          break;
        }
      }

      if (result === 'no_match') {
        reasoning = 'No rules matched';
      }

    } catch (error) {
      result = 'error';
      reasoning = `Policy evaluation error: ${error}`;
    }

    return {
      policyId: policy.id,
      policyName: policy.name,
      result,
      action,
      reasoning,
      executionTime: Date.now() - startTime
    };
  }

  private evaluateRule(rule: PolicyRule, accessRequest: AccessRequest): boolean {
    // Check all rule conditions
    const conditionsMet = rule.conditions.every(condition => 
      this.evaluateRuleCondition(condition, accessRequest)
    );

    if (!conditionsMet) return false;

    // Check exceptions
    if (rule.exceptions) {
      for (const exception of rule.exceptions) {
        const exceptionMet = exception.conditions.every(condition => 
          this.evaluateRuleCondition(condition, accessRequest)
        );
        
        if (exceptionMet && (!exception.expiry || exception.expiry > new Date())) {
          return false; // Exception applies, rule doesn't match
        }
      }
    }

    return true;
  }

  private evaluateRuleCondition(condition: RuleCondition, accessRequest: AccessRequest): boolean {
    const value = this.getFieldValue(condition.field, accessRequest);
    
    switch (condition.operator) {
      case 'equals':
        return this.compareValues(value, condition.value, '===', condition.caseSensitive);
      case 'not_equals':
        return this.compareValues(value, condition.value, '!==', condition.caseSensitive);
      case 'contains':
        return this.stringContains(value, condition.value, condition.caseSensitive);
      case 'not_contains':
        return !this.stringContains(value, condition.value, condition.caseSensitive);
      case 'in':
        return Array.isArray(condition.value) && condition.value.includes(value);
      case 'not_in':
        return Array.isArray(condition.value) && !condition.value.includes(value);
      case 'greater_than':
        return typeof value === 'number' && value > condition.value;
      case 'less_than':
        return typeof value === 'number' && value < condition.value;
      default:
        return false;
    }
  }

  private getFieldValue(field: string, accessRequest: AccessRequest): any {
    const parts = field.split('.');
    let current: any = {
      user: { role: 'user' }, // Would be populated from user service
      device: accessRequest.context.device,
      location: accessRequest.context.location,
      network: accessRequest.context.network,
      behavior: accessRequest.context.behavior,
      action: accessRequest.action,
      resource: accessRequest.resource,
      data: { classification: 'internal' } // Would be determined by data classifier
    };

    for (const part of parts) {
      current = current?.[part];
      if (current === undefined) break;
    }

    return current;
  }

  private compareValues(value1: any, value2: any, operator: string, caseSensitive?: boolean): boolean {
    if (!caseSensitive && typeof value1 === 'string' && typeof value2 === 'string') {
      value1 = value1.toLowerCase();
      value2 = value2.toLowerCase();
    }

    switch (operator) {
      case '===': return value1 === value2;
      case '!==': return value1 !== value2;
      default: return false;
    }
  }

  private stringContains(haystack: any, needle: any, caseSensitive?: boolean): boolean {
    if (typeof haystack !== 'string' || typeof needle !== 'string') return false;
    
    if (!caseSensitive) {
      haystack = haystack.toLowerCase();
      needle = needle.toLowerCase();
    }

    return haystack.includes(needle);
  }

  private calculateAccessDecision(evaluations: PolicyEvaluation[]): AccessDecision {
    let finalResult: AccessDecision['result'] = 'allow';
    let confidence = 100;
    const reasoning: string[] = [];
    const requirements: AccessRequirement[] = [];

    // Process evaluations in priority order
    for (const evaluation of evaluations) {
      if (evaluation.result === 'match') {
        reasoning.push(evaluation.reasoning);
        
        if (evaluation.action === 'deny') {
          finalResult = 'deny';
          confidence = 95;
          break;
        } else if (evaluation.action === 'challenge') {
          finalResult = 'challenge';
          confidence = 80;
          
          // Add MFA requirement
          requirements.push({
            type: 'mfa',
            description: 'Multi-factor authentication required',
            status: 'pending'
          });
        }
      }
    }

    return {
      result: finalResult,
      confidence,
      riskScore: 0, // Will be set by caller
      reasoning,
      requirements: requirements.length > 0 ? requirements : undefined,
      ttl: finalResult === 'allow' ? 3600 : undefined // 1 hour for allow decisions
    };
  }

  private async calculateRiskScore(context: SecurityContext): Promise<number> {
    let riskScore = 0;

    // Network risk
    riskScore += context.network.riskScore * 0.3;

    // Device risk
    const deviceRisk = this.calculateDeviceRisk(context.device);
    riskScore += deviceRisk * 0.25;

    // Location risk
    const locationRisk = this.calculateLocationRisk(context.location);
    riskScore += locationRisk * 0.2;

    // Behavior risk
    const behaviorRisk = this.calculateBehaviorRisk(context.behavior);
    riskScore += behaviorRisk * 0.25;

    return Math.max(0, Math.min(100, riskScore));
  }

  private calculateDeviceRisk(device: DeviceTrust): number {
    let risk = 0;

    const trustLevels = {
      'unknown': 80,
      'untrusted': 70,
      'limited': 40,
      'trusted': 20,
      'highly_trusted': 5
    };

    risk += trustLevels[device.trustLevel] || 80;

    if (!device.security.encrypted) risk += 20;
    if (!device.security.antivirus) risk += 15;
    if (!device.security.firewall) risk += 10;
    if (device.security.jailbroken || device.security.rooted) risk += 30;
    if (!device.compliance.compliant) risk += 25;

    return Math.min(100, risk);
  }

  private calculateLocationRisk(location: SecurityContext['location']): number {
    let risk = 0;

    const highRiskCountries = ['CN', 'RU', 'KP', 'IR'];
    if (highRiskCountries.includes(location.country)) risk += 40;

    if (location.vpn) risk += 15;
    if (location.tor) risk += 30;

    return risk;
  }

  private calculateBehaviorRisk(behavior: SecurityContext['behavior']): number {
    let risk = 0;

    if (behavior.loginPattern === 'suspicious') risk += 30;
    if (behavior.loginPattern === 'unusual') risk += 15;

    if (behavior.accessPattern === 'suspicious') risk += 25;
    if (behavior.accessPattern === 'unusual') risk += 10;

    if (behavior.timeOfDay === 'unusual') risk += 10;
    if (behavior.frequency === 'high') risk += 15;

    return risk;
  }

  private async generateSecurityEvent(accessRequest: AccessRequest): Promise<void> {
    let eventType: SecurityEvent['type'] = 'policy_violation';
    let severity: SecurityEvent['severity'] = 'medium';

    if (accessRequest.decision.result === 'deny') {
      eventType = 'policy_violation';
      severity = accessRequest.decision.riskScore > 80 ? 'critical' : 'high';
    } else if (accessRequest.decision.riskScore > 70) {
      eventType = 'suspicious_behavior';
      severity = 'medium';
    }

    const event: SecurityEvent = {
      id: this.generateId('event'),
      type: eventType,
      severity,
      userId: accessRequest.userId,
      deviceId: accessRequest.deviceId,
      resource: accessRequest.resource,
      description: `${eventType} detected for ${accessRequest.action} on ${accessRequest.resource}`,
      details: {
        accessRequestId: accessRequest.id,
        decision: accessRequest.decision,
        riskScore: accessRequest.decision.riskScore,
        policyEvaluations: accessRequest.policyEvaluations
      },
      context: accessRequest.context,
      timestamp: new Date(),
      acknowledged: false,
      investigationStatus: 'open',
      relatedEvents: []
    };

    this.securityEvents.set(event.id, event);

    this.emit('security_event', event);
  }

  private async recalculateTrustScores(): Promise<void> {
    // Recalculate trust scores for all entities
    for (const [contextId, context] of this.activeContexts.entries()) {
      // User trust score
      const userTrust = await this.calculateUserTrustScore(context.userId);
      this.trustScores.set(`user_${context.userId}`, userTrust);

      // Device trust score
      const deviceTrust = await this.calculateDeviceTrustScore(context.deviceId);
      this.trustScores.set(`device_${context.deviceId}`, deviceTrust);
    }
  }

  private async calculateUserTrustScore(userId: string): Promise<TrustScore> {
    const userAccess = Array.from(this.accessRequests.values())
      .filter(req => req.userId === userId)
      .slice(-100); // Last 100 requests

    const factors: TrustFactor[] = [
      {
        name: 'Access Pattern Consistency',
        weight: 0.3,
        value: this.calculateAccessPatternScore(userAccess),
        description: 'Consistency in access patterns and behavior',
        source: 'behavior_analytics',
        lastUpdated: new Date()
      },
      {
        name: 'Security Violations',
        weight: 0.25,
        value: this.calculateViolationScore(userId),
        description: 'Frequency and severity of security violations',
        source: 'security_events',
        lastUpdated: new Date()
      },
      {
        name: 'Device Trust',
        weight: 0.2,
        value: this.calculateAverageDeviceTrust(userId),
        description: 'Trust level of associated devices',
        source: 'device_management',
        lastUpdated: new Date()
      },
      {
        name: 'Account Age',
        weight: 0.15,
        value: 85, // Simulated
        description: 'Account age and usage history',
        source: 'user_management',
        lastUpdated: new Date()
      },
      {
        name: 'Compliance Status',
        weight: 0.1,
        value: 90, // Simulated
        description: 'Compliance with security policies',
        source: 'compliance_engine',
        lastUpdated: new Date()
      }
    ];

    const overallScore = factors.reduce((sum, factor) => 
      sum + (factor.value * factor.weight), 0
    );

    return {
      entityId: userId,
      entityType: 'user',
      score: Math.round(overallScore),
      factors,
      lastCalculated: new Date(),
      trend: 'stable', // Would be calculated from historical scores
      confidence: 85,
      riskLevel: overallScore >= 80 ? 'low' : overallScore >= 60 ? 'medium' : 'high'
    };
  }

  private calculateAccessPatternScore(accessRequests: AccessRequest[]): number {
    if (accessRequests.length === 0) return 50;

    const deniedRequests = accessRequests.filter(req => req.decision.result === 'deny');
    const denyRate = deniedRequests.length / accessRequests.length;

    return Math.max(0, 100 - (denyRate * 100));
  }

  private calculateViolationScore(userId: string): number {
    const userEvents = Array.from(this.securityEvents.values())
      .filter(event => event.userId === userId)
      .slice(-50); // Last 50 events

    if (userEvents.length === 0) return 100;

    const severityWeights = { low: 1, medium: 2, high: 4, critical: 8 };
    const violationScore = userEvents.reduce((sum, event) => 
      sum + severityWeights[event.severity], 0
    );

    return Math.max(0, 100 - violationScore);
  }

  private calculateAverageDeviceTrust(userId: string): number {
    const userDevices = Array.from(this.accessRequests.values())
      .filter(req => req.userId === userId)
      .map(req => req.deviceId);

    const uniqueDevices = [...new Set(userDevices)];
    
    if (uniqueDevices.length === 0) return 50;

    const trustLevels = { 
      'unknown': 20, 'untrusted': 30, 'limited': 60, 'trusted': 80, 'highly_trusted': 95 
    };

    const deviceScores = uniqueDevices.map(deviceId => {
      const deviceTrustScore = this.trustScores.get(`device_${deviceId}`);
      return deviceTrustScore?.score || 50;
    });

    return deviceScores.reduce((sum, score) => sum + score, 0) / deviceScores.length;
  }

  private async calculateDeviceTrustScore(deviceId: string): Promise<TrustScore> {
    // Similar implementation to user trust score but for devices
    const factors: TrustFactor[] = [
      {
        name: 'Security Configuration',
        weight: 0.4,
        value: 85, // Based on encryption, antivirus, etc.
        description: 'Device security configuration compliance',
        source: 'device_management',
        lastUpdated: new Date()
      },
      {
        name: 'Compliance Status',
        weight: 0.3,
        value: 90,
        description: 'Device compliance with organizational policies',
        source: 'compliance_engine',
        lastUpdated: new Date()
      },
      {
        name: 'Access History',
        weight: 0.2,
        value: 80,
        description: 'Historical access patterns and behavior',
        source: 'access_analytics',
        lastUpdated: new Date()
      },
      {
        name: 'Registration Age',
        weight: 0.1,
        value: 75,
        description: 'Time since device registration',
        source: 'device_registry',
        lastUpdated: new Date()
      }
    ];

    const overallScore = factors.reduce((sum, factor) => 
      sum + (factor.value * factor.weight), 0
    );

    return {
      entityId: deviceId,
      entityType: 'device',
      score: Math.round(overallScore),
      factors,
      lastCalculated: new Date(),
      trend: 'stable',
      confidence: 80,
      riskLevel: overallScore >= 80 ? 'low' : overallScore >= 60 ? 'medium' : 'high'
    };
  }

  private async correlateSecurityEvents(): Promise<void> {
    const recentEvents = Array.from(this.securityEvents.values())
      .filter(event => event.timestamp > new Date(Date.now() - 24 * 60 * 60 * 1000))
      .sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());

    // Look for patterns and correlations
    for (let i = 0; i < recentEvents.length; i++) {
      const event = recentEvents[i];
      const relatedEvents = recentEvents
        .slice(i + 1)
        .filter(other => this.areEventsRelated(event, other))
        .map(other => other.id);

      if (relatedEvents.length > 0) {
        event.relatedEvents = relatedEvents;
        this.securityEvents.set(event.id, event);
      }
    }
  }

  private areEventsRelated(event1: SecurityEvent, event2: SecurityEvent): boolean {
    // Same user within 1 hour
    if (event1.userId === event2.userId && 
        Math.abs(event1.timestamp.getTime() - event2.timestamp.getTime()) < 60 * 60 * 1000) {
      return true;
    }

    // Same device within 30 minutes
    if (event1.deviceId === event2.deviceId && 
        Math.abs(event1.timestamp.getTime() - event2.timestamp.getTime()) < 30 * 60 * 1000) {
      return true;
    }

    // Same IP address within 15 minutes
    if (event1.context.network.ip === event2.context.network.ip && 
        Math.abs(event1.timestamp.getTime() - event2.timestamp.getTime()) < 15 * 60 * 1000) {
      return true;
    }

    return false;
  }

  private async updateThreatIntelligence(): Promise<void> {
    // Simulate threat intelligence updates
    const newThreats: ThreatIntelligence[] = [];

    // Add dynamic threat indicators based on recent events
    const suspiciousIPs = new Set<string>();
    const recentEvents = Array.from(this.securityEvents.values())
      .filter(event => event.timestamp > new Date(Date.now() - 24 * 60 * 60 * 1000))
      .filter(event => event.severity === 'high' || event.severity === 'critical');

    recentEvents.forEach(event => {
      suspiciousIPs.add(event.context.network.ip);
    });

    if (suspiciousIPs.size > 0) {
      const threat: ThreatIntelligence = {
        id: `dynamic_threat_${Date.now()}`,
        type: 'ip_reputation',
        source: 'internal_analytics',
        confidence: 75,
        severity: 'medium',
        indicators: Array.from(suspiciousIPs).map(ip => ({
          type: 'ip' as const,
          value: ip,
          context: 'IP associated with recent security events',
          firstSeen: new Date(),
          lastSeen: new Date(),
          occurrences: 1
        })),
        description: 'IPs associated with recent security incidents',
        mitigation: ['Enhanced monitoring', 'Additional verification required'],
        lastUpdated: new Date(),
        expires: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // Expires in 7 days
      };

      this.threatIntelligence.set(threat.id, threat);
      this.emit('threat_intelligence_updated', threat);
    }
  }

  // API Methods
  getAllPolicies(): ZeroTrustPolicy[] {
    return Array.from(this.policies.values());
  }

  getPolicy(policyId: string): ZeroTrustPolicy | undefined {
    return this.policies.get(policyId);
  }

  async updatePolicy(policyId: string, updates: Partial<ZeroTrustPolicy>): Promise<ZeroTrustPolicy> {
    const policy = this.policies.get(policyId);
    if (!policy) {
      throw new Error('Policy not found');
    }

    const updatedPolicy = {
      ...policy,
      ...updates,
      metadata: {
        ...policy.metadata,
        lastModified: new Date(),
        version: policy.metadata.version + 1
      }
    };

    this.policies.set(policyId, updatedPolicy);

    this.emit('policy_updated', updatedPolicy);

    return updatedPolicy;
  }

  getTrustScore(entityId: string, entityType: 'user' | 'device'): TrustScore | undefined {
    return this.trustScores.get(`${entityType}_${entityId}`);
  }

  getAllTrustScores(): TrustScore[] {
    return Array.from(this.trustScores.values());
  }

  getSecurityEvents(filters?: {
    userId?: string;
    deviceId?: string;
    type?: SecurityEvent['type'];
    severity?: SecurityEvent['severity'];
    timeRange?: { start: Date; end: Date };
  }): SecurityEvent[] {
    let events = Array.from(this.securityEvents.values());

    if (filters) {
      if (filters.userId) events = events.filter(e => e.userId === filters.userId);
      if (filters.deviceId) events = events.filter(e => e.deviceId === filters.deviceId);
      if (filters.type) events = events.filter(e => e.type === filters.type);
      if (filters.severity) events = events.filter(e => e.severity === filters.severity);
      if (filters.timeRange) {
        events = events.filter(e => 
          e.timestamp >= filters.timeRange!.start && e.timestamp <= filters.timeRange!.end
        );
      }
    }

    return events.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  getAccessRequests(filters?: {
    userId?: string;
    deviceId?: string;
    result?: AccessDecision['result'];
    timeRange?: { start: Date; end: Date };
  }): AccessRequest[] {
    let requests = Array.from(this.accessRequests.values());

    if (filters) {
      if (filters.userId) requests = requests.filter(r => r.userId === filters.userId);
      if (filters.deviceId) requests = requests.filter(r => r.deviceId === filters.deviceId);
      if (filters.result) requests = requests.filter(r => r.decision.result === filters.result);
      if (filters.timeRange) {
        requests = requests.filter(r => 
          r.timestamp >= filters.timeRange!.start && r.timestamp <= filters.timeRange!.end
        );
      }
    }

    return requests.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  async acknowledgeSecurityEvent(eventId: string, acknowledgedBy: string): Promise<SecurityEvent> {
    const event = this.securityEvents.get(eventId);
    if (!event) {
      throw new Error('Security event not found');
    }

    event.acknowledged = true;
    event.assignedTo = acknowledgedBy;
    
    this.securityEvents.set(eventId, event);

    this.emit('security_event_acknowledged', event);

    return event;
  }

  private generateId(prefix: string): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}