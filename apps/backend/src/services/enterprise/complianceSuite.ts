import { EventEmitter } from 'events';
import { globalConnectionPool } from '../performance/connectionPool';
import { globalMultiTenantService, Tenant } from './multiTenant';
import crypto from 'crypto';

export type ComplianceFramework = 'soc2' | 'gdpr' | 'hipaa' | 'pci' | 'iso27001' | 'custom';
export type DataClassification = 'public' | 'internal' | 'confidential' | 'restricted' | 'pii' | 'phi';
export type AuditEventType = 'access' | 'modification' | 'deletion' | 'export' | 'login' | 'permission_change' | 'data_breach' | 'system_change';

export interface ComplianceProfile {
  id: string;
  tenantId: string;
  framework: ComplianceFramework;
  version: string;
  status: 'draft' | 'active' | 'suspended' | 'audit_required';
  configuration: ComplianceConfiguration;
  policies: CompliancePolicy[];
  controls: ComplianceControl[];
  assessments: ComplianceAssessment[];
  metadata: {
    createdAt: Date;
    updatedAt: Date;
    createdBy: string;
    lastAuditAt?: Date;
    nextAuditDue?: Date;
    certificationExpiry?: Date;
  };
}

export interface ComplianceConfiguration {
  framework: ComplianceFramework;
  dataRetentionPeriod: number; // days
  auditLogRetention: number; // days
  encryptionStandards: {
    dataAtRest: 'AES256' | 'AES128';
    dataInTransit: 'TLS1.2' | 'TLS1.3';
    keyManagement: 'HSM' | 'KMS' | 'local';
  };
  accessControls: {
    mfaRequired: boolean;
    sessionTimeout: number; // minutes
    passwordPolicy: {
      minLength: number;
      complexity: 'basic' | 'medium' | 'high';
      rotationDays: number;
    };
    privilegedAccessReview: number; // days
  };
  dataClassification: {
    enabled: boolean;
    defaultClassification: DataClassification;
    autoClassification: boolean;
  };
  monitoring: {
    realTimeAlerts: boolean;
    anomalyDetection: boolean;
    behavioralAnalysis: boolean;
    intrusionDetection: boolean;
  };
  dataSubjectRights?: { // GDPR specific
    enableRightToAccess: boolean;
    enableRightToRectification: boolean;
    enableRightToErasure: boolean;
    enableRightToPortability: boolean;
    responseTimeLimit: number; // hours
  };
  hipaaSafeguards?: { // HIPAA specific
    adminSafeguards: string[];
    physicalSafeguards: string[];
    technicalSafeguards: string[];
    businessAssociateAgreements: boolean;
  };
}

export interface CompliancePolicy {
  id: string;
  name: string;
  description: string;
  framework: ComplianceFramework;
  category: 'access_control' | 'data_protection' | 'incident_response' | 'audit' | 'privacy' | 'custom';
  requirements: string[];
  controls: string[]; // Control IDs
  status: 'draft' | 'active' | 'deprecated';
  version: string;
  effectiveDate: Date;
  reviewDate: Date;
  approvedBy?: string;
}

export interface ComplianceControl {
  id: string;
  name: string;
  description: string;
  framework: ComplianceFramework;
  controlFamily: string;
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  implementationStatus: 'not_started' | 'in_progress' | 'implemented' | 'testing' | 'operational';
  automationLevel: 'manual' | 'semi_automated' | 'fully_automated';
  testingFrequency: 'daily' | 'weekly' | 'monthly' | 'quarterly' | 'annually';
  lastTested?: Date;
  nextTestDue?: Date;
  testResults?: {
    status: 'pass' | 'fail' | 'warning';
    score: number;
    findings: string[];
    recommendations: string[];
    testedAt: Date;
    testedBy: string;
  };
}

export interface ComplianceAssessment {
  id: string;
  tenantId: string;
  framework: ComplianceFramework;
  type: 'self_assessment' | 'internal_audit' | 'external_audit' | 'penetration_test' | 'vulnerability_scan';
  status: 'scheduled' | 'in_progress' | 'completed' | 'failed';
  scope: string[];
  findings: AssessmentFinding[];
  overallScore: number;
  scheduledDate: Date;
  completedDate?: Date;
  assessor: {
    name: string;
    organization?: string;
    certification?: string;
  };
  report?: {
    summary: string;
    recommendations: string[];
    remediation: Array<{
      finding: string;
      priority: 'low' | 'medium' | 'high' | 'critical';
      dueDate: Date;
      assignedTo?: string;
      status: 'open' | 'in_progress' | 'resolved' | 'accepted_risk';
    }>;
  };
}

export interface AssessmentFinding {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  category: string;
  affectedControls: string[];
  evidence: string[];
  recommendation: string;
  remediation: {
    effort: 'low' | 'medium' | 'high';
    cost: 'low' | 'medium' | 'high';
    timeline: string;
    steps: string[];
  };
}

export interface DataProcessingRecord {
  id: string;
  tenantId: string;
  dataType: string;
  classification: DataClassification;
  processingPurpose: string;
  legalBasis?: 'consent' | 'contract' | 'legal_obligation' | 'vital_interests' | 'public_task' | 'legitimate_interests';
  dataSubjects: string[];
  dataCategories: string[];
  recipients: string[];
  transfers: Array<{
    country: string;
    safeguards: string;
    date: Date;
  }>;
  retentionPeriod: number; // days
  deletionSchedule?: Date;
  consentRecords?: Array<{
    dataSubjectId: string;
    consentGiven: boolean;
    consentDate: Date;
    withdrawalDate?: Date;
    purpose: string;
  }>;
}

export interface AuditTrail {
  id: string;
  tenantId: string;
  userId?: string;
  eventType: AuditEventType;
  resource: string;
  resourceId?: string;
  action: string;
  outcome: 'success' | 'failure' | 'partial';
  riskLevel: 'low' | 'medium' | 'high' | 'critical';
  details: Record<string, any>;
  metadata: {
    timestamp: Date;
    ipAddress: string;
    userAgent: string;
    sessionId?: string;
    correlationId?: string;
  };
  complianceFlags: {
    requiresReview: boolean;
    dataAccess: boolean;
    privilegedAction: boolean;
    crossBorderTransfer: boolean;
    automated: boolean;
  };
}

export class ComplianceSuite extends EventEmitter {
  private complianceCache = new Map<string, ComplianceProfile>();
  private cacheTimeout = 10 * 60 * 1000; // 10 minutes

  constructor() {
    super();
    this.setupComplianceMonitoring();
  }

  private setupComplianceMonitoring(): void {
    // Run compliance checks every hour
    setInterval(() => {
      this.runPeriodicComplianceChecks();
    }, 60 * 60 * 1000);

    // Clear cache every 10 minutes
    setInterval(() => {
      this.complianceCache.clear();
    }, this.cacheTimeout);
  }

  /**
   * Create compliance profile for tenant
   */
  async createComplianceProfile(
    tenantId: string,
    framework: ComplianceFramework,
    configuration: ComplianceConfiguration
  ): Promise<ComplianceProfile> {
    const tenant = await globalMultiTenantService.getTenant(tenantId);
    if (!tenant) {
      throw new Error(`Tenant not found: ${tenantId}`);
    }

    const profileId = `comp_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    
    // Get standard policies and controls for framework
    const policies = await this.getStandardPolicies(framework);
    const controls = await this.getStandardControls(framework);

    const profile: ComplianceProfile = {
      id: profileId,
      tenantId,
      framework,
      version: '1.0',
      status: 'draft',
      configuration,
      policies,
      controls,
      assessments: [],
      metadata: {
        createdAt: new Date(),
        updatedAt: new Date(),
        createdBy: 'system'
      }
    };

    try {
      await globalConnectionPool.query(
        `INSERT INTO compliance_profiles (
          id, tenant_id, framework, version, status, configuration, 
          policies, controls, assessments, metadata
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)`,
        [
          profile.id,
          profile.tenantId,
          profile.framework,
          profile.version,
          profile.status,
          JSON.stringify(profile.configuration),
          JSON.stringify(profile.policies),
          JSON.stringify(profile.controls),
          JSON.stringify(profile.assessments),
          JSON.stringify(profile.metadata)
        ]
      );

      // Initialize compliance tables for tenant
      await this.initializeComplianceTables(tenantId, profileId);

      this.emit('complianceProfileCreated', { profile });
      console.log(`[ComplianceSuite] Created compliance profile: ${profileId} (${framework})`);

      return profile;
    } catch (error) {
      console.error('[ComplianceSuite] Error creating compliance profile:', error);
      throw error;
    }
  }

  /**
   * Log audit event
   */
  async logAuditEvent(auditEvent: Omit<AuditTrail, 'id'>): Promise<void> {
    const eventId = `audit_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const fullEvent: AuditTrail = {
      ...auditEvent,
      id: eventId
    };

    try {
      await globalConnectionPool.query(
        `INSERT INTO compliance_audit_trail (
          id, tenant_id, user_id, event_type, resource, resource_id, action,
          outcome, risk_level, details, metadata, compliance_flags
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
        [
          fullEvent.id,
          fullEvent.tenantId,
          fullEvent.userId,
          fullEvent.eventType,
          fullEvent.resource,
          fullEvent.resourceId,
          fullEvent.action,
          fullEvent.outcome,
          fullEvent.riskLevel,
          JSON.stringify(fullEvent.details),
          JSON.stringify(fullEvent.metadata),
          JSON.stringify(fullEvent.complianceFlags)
        ]
      );

      // Check for high-risk events that need immediate attention
      if (fullEvent.riskLevel === 'critical' || fullEvent.complianceFlags.requiresReview) {
        this.emit('criticalAuditEvent', { event: fullEvent });
        await this.triggerComplianceAlert(fullEvent);
      }

      // Check for GDPR data access events
      if (fullEvent.complianceFlags.dataAccess && fullEvent.eventType === 'access') {
        await this.trackGDPRDataAccess(fullEvent);
      }

    } catch (error) {
      console.error('[ComplianceSuite] Error logging audit event:', error);
      // Don't throw error to avoid breaking the main flow
    }
  }

  /**
   * Record data processing activity (GDPR)
   */
  async recordDataProcessing(
    tenantId: string,
    processingRecord: Omit<DataProcessingRecord, 'id' | 'tenantId'>
  ): Promise<DataProcessingRecord> {
    const recordId = `proc_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    const fullRecord: DataProcessingRecord = {
      ...processingRecord,
      id: recordId,
      tenantId
    };

    try {
      await globalConnectionPool.query(
        `INSERT INTO data_processing_records (
          id, tenant_id, data_type, classification, processing_purpose, legal_basis,
          data_subjects, data_categories, recipients, transfers, retention_period,
          deletion_schedule, consent_records
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13)`,
        [
          fullRecord.id,
          fullRecord.tenantId,
          fullRecord.dataType,
          fullRecord.classification,
          fullRecord.processingPurpose,
          fullRecord.legalBasis,
          JSON.stringify(fullRecord.dataSubjects),
          JSON.stringify(fullRecord.dataCategories),
          JSON.stringify(fullRecord.recipients),
          JSON.stringify(fullRecord.transfers),
          fullRecord.retentionPeriod,
          fullRecord.deletionSchedule,
          JSON.stringify(fullRecord.consentRecords || [])
        ]
      );

      this.emit('dataProcessingRecorded', { record: fullRecord });

      return fullRecord;
    } catch (error) {
      console.error('[ComplianceSuite] Error recording data processing:', error);
      throw error;
    }
  }

  /**
   * Handle data subject rights request (GDPR)
   */
  async handleDataSubjectRequest(
    tenantId: string,
    requestType: 'access' | 'rectification' | 'erasure' | 'portability' | 'restriction',
    dataSubjectId: string,
    details: any
  ): Promise<{
    requestId: string;
    status: 'received' | 'processing' | 'completed' | 'rejected';
    dueDate: Date;
  }> {
    const requestId = `dsr_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30); // 30 days as per GDPR

    try {
      await globalConnectionPool.query(
        `INSERT INTO data_subject_requests (
          id, tenant_id, request_type, data_subject_id, details, status, 
          created_at, due_date
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          requestId,
          tenantId,
          requestType,
          dataSubjectId,
          JSON.stringify(details),
          'received',
          new Date(),
          dueDate
        ]
      );

      // Log audit event
      await this.logAuditEvent({
        tenantId,
        eventType: 'access',
        resource: 'data_subject_request',
        resourceId: requestId,
        action: `data_subject_${requestType}_request`,
        outcome: 'success',
        riskLevel: 'medium',
        details: { requestType, dataSubjectId },
        metadata: {
          timestamp: new Date(),
          ipAddress: '127.0.0.1',
          userAgent: 'System'
        },
        complianceFlags: {
          requiresReview: true,
          dataAccess: true,
          privilegedAction: false,
          crossBorderTransfer: false,
          automated: false
        }
      });

      this.emit('dataSubjectRequest', { 
        requestId, 
        tenantId, 
        requestType, 
        dataSubjectId, 
        dueDate 
      });

      return {
        requestId,
        status: 'received',
        dueDate
      };
    } catch (error) {
      console.error('[ComplianceSuite] Error handling data subject request:', error);
      throw error;
    }
  }

  /**
   * Run compliance assessment
   */
  async runComplianceAssessment(
    tenantId: string,
    framework: ComplianceFramework,
    assessmentType: ComplianceAssessment['type']
  ): Promise<ComplianceAssessment> {
    const assessmentId = `assess_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    // Get compliance profile
    const profile = await this.getComplianceProfile(tenantId, framework);
    if (!profile) {
      throw new Error(`No compliance profile found for ${framework}`);
    }

    const assessment: ComplianceAssessment = {
      id: assessmentId,
      tenantId,
      framework,
      type: assessmentType,
      status: 'in_progress',
      scope: profile.controls.map(c => c.id),
      findings: [],
      overallScore: 0,
      scheduledDate: new Date(),
      assessor: {
        name: 'Automated System',
        organization: 'Claude Code Coordination'
      }
    };

    try {
      // Run automated tests for each control
      const findings: AssessmentFinding[] = [];
      let totalScore = 0;
      let passedControls = 0;

      for (const control of profile.controls) {
        const testResult = await this.testComplianceControl(tenantId, control);
        
        if (testResult.status === 'pass') {
          passedControls++;
          totalScore += testResult.score;
        } else {
          // Create finding for failed control
          findings.push({
            id: `finding_${control.id}`,
            title: `Control ${control.name} Failed`,
            description: testResult.findings.join('; '),
            severity: control.riskLevel === 'critical' ? 'critical' : 
                     control.riskLevel === 'high' ? 'high' : 'medium',
            category: control.controlFamily,
            affectedControls: [control.id],
            evidence: testResult.findings,
            recommendation: testResult.recommendations.join('; '),
            remediation: {
              effort: control.riskLevel === 'critical' ? 'high' : 'medium',
              cost: 'medium',
              timeline: '30 days',
              steps: testResult.recommendations
            }
          });
        }
      }

      assessment.findings = findings;
      assessment.overallScore = profile.controls.length > 0 ? 
        (passedControls / profile.controls.length) * 100 : 0;
      assessment.status = 'completed';
      assessment.completedDate = new Date();

      // Generate report
      assessment.report = {
        summary: `Assessment completed with ${passedControls}/${profile.controls.length} controls passing (${assessment.overallScore.toFixed(1)}% compliance)`,
        recommendations: findings.map(f => f.recommendation),
        remediation: findings.map(f => ({
          finding: f.title,
          priority: f.severity,
          dueDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days
          status: 'open' as const
        }))
      };

      // Store assessment
      await globalConnectionPool.query(
        `INSERT INTO compliance_assessments (
          id, tenant_id, framework, type, status, scope, findings, overall_score,
          scheduled_date, completed_date, assessor, report
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)`,
        [
          assessment.id,
          assessment.tenantId,
          assessment.framework,
          assessment.type,
          assessment.status,
          JSON.stringify(assessment.scope),
          JSON.stringify(assessment.findings),
          assessment.overallScore,
          assessment.scheduledDate,
          assessment.completedDate,
          JSON.stringify(assessment.assessor),
          JSON.stringify(assessment.report)
        ]
      );

      this.emit('complianceAssessmentCompleted', { assessment });

      return assessment;
    } catch (error) {
      console.error('[ComplianceSuite] Error running compliance assessment:', error);
      throw error;
    }
  }

  /**
   * Generate compliance report
   */
  async generateComplianceReport(
    tenantId: string,
    framework: ComplianceFramework,
    reportType: 'executive' | 'technical' | 'audit' | 'data_mapping'
  ): Promise<{
    reportId: string;
    summary: any;
    details: any;
    recommendations: string[];
    generatedAt: Date;
  }> {
    const reportId = `report_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    try {
      const [profile, recentAssessment, auditStats] = await Promise.all([
        this.getComplianceProfile(tenantId, framework),
        this.getLatestAssessment(tenantId, framework),
        this.getAuditStatistics(tenantId, 30) // Last 30 days
      ]);

      let report: any = {
        reportId,
        tenantId,
        framework,
        reportType,
        generatedAt: new Date()
      };

      if (reportType === 'executive') {
        report = {
          ...report,
          summary: {
            overallCompliance: recentAssessment?.overallScore || 0,
            criticalFindings: recentAssessment?.findings.filter(f => f.severity === 'critical').length || 0,
            highRiskEvents: auditStats.highRiskEvents,
            lastAssessmentDate: recentAssessment?.completedDate,
            nextAssessmentDue: this.calculateNextAssessmentDue(framework)
          },
          details: {
            controlsImplemented: profile?.controls.filter(c => c.implementationStatus === 'operational').length || 0,
            totalControls: profile?.controls.length || 0,
            policiesActive: profile?.policies.filter(p => p.status === 'active').length || 0,
            dataProcessingActivities: await this.countDataProcessingActivities(tenantId),
            openFindings: recentAssessment?.findings.filter(f => 
              recentAssessment.report?.remediation.find(r => 
                r.finding === f.title && r.status === 'open'
              )
            ).length || 0
          },
          recommendations: this.generateExecutiveRecommendations(profile, recentAssessment, auditStats)
        };
      } else if (reportType === 'technical') {
        report = {
          ...report,
          summary: {
            controlsBreakdown: this.generateControlsBreakdown(profile?.controls || []),
            vulnerabilities: recentAssessment?.findings || [],
            securityMetrics: auditStats
          },
          details: {
            controls: profile?.controls || [],
            policies: profile?.policies || [],
            assessmentHistory: await this.getAssessmentHistory(tenantId, framework),
            riskMatrix: this.generateRiskMatrix(recentAssessment?.findings || [])
          },
          recommendations: this.generateTechnicalRecommendations(profile, recentAssessment)
        };
      }

      // Store report
      await globalConnectionPool.query(
        `INSERT INTO compliance_reports (
          id, tenant_id, framework, report_type, summary, details, 
          recommendations, generated_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)`,
        [
          reportId,
          tenantId,
          framework,
          reportType,
          JSON.stringify(report.summary),
          JSON.stringify(report.details),
          JSON.stringify(report.recommendations),
          report.generatedAt
        ]
      );

      this.emit('complianceReportGenerated', { report });

      return report;
    } catch (error) {
      console.error('[ComplianceSuite] Error generating compliance report:', error);
      throw error;
    }
  }

  // Helper methods (simplified implementations)

  private async getStandardPolicies(framework: ComplianceFramework): Promise<CompliancePolicy[]> {
    // Return standard policies for framework
    const policies: Record<ComplianceFramework, CompliancePolicy[]> = {
      soc2: [
        {
          id: 'soc2_acc_001',
          name: 'Access Control Policy',
          description: 'Defines access control requirements for SOC 2 compliance',
          framework: 'soc2',
          category: 'access_control',
          requirements: ['Multi-factor authentication', 'Least privilege access', 'Regular access reviews'],
          controls: ['soc2_cc6_1', 'soc2_cc6_2'],
          status: 'active',
          version: '1.0',
          effectiveDate: new Date(),
          reviewDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        }
      ],
      gdpr: [
        {
          id: 'gdpr_data_001',
          name: 'Data Protection Policy',
          description: 'GDPR data protection requirements and procedures',
          framework: 'gdpr',
          category: 'privacy',
          requirements: ['Data minimization', 'Purpose limitation', 'Data subject rights'],
          controls: ['gdpr_art6', 'gdpr_art7', 'gdpr_art17'],
          status: 'active',
          version: '1.0',
          effectiveDate: new Date(),
          reviewDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        }
      ],
      hipaa: [
        {
          id: 'hipaa_sec_001',
          name: 'HIPAA Security Rule Policy',
          description: 'HIPAA Security Rule implementation requirements',
          framework: 'hipaa',
          category: 'data_protection',
          requirements: ['Administrative safeguards', 'Physical safeguards', 'Technical safeguards'],
          controls: ['hipaa_164_308', 'hipaa_164_310', 'hipaa_164_312'],
          status: 'active',
          version: '1.0',
          effectiveDate: new Date(),
          reviewDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
        }
      ],
      pci: [],
      iso27001: [],
      custom: []
    };

    return policies[framework] || [];
  }

  private async getStandardControls(framework: ComplianceFramework): Promise<ComplianceControl[]> {
    // Return standard controls for framework
    return [
      {
        id: `${framework}_ctrl_001`,
        name: 'Access Control Implementation',
        description: 'Implement and maintain access controls',
        framework,
        controlFamily: 'Access Control',
        riskLevel: 'high',
        implementationStatus: 'not_started',
        automationLevel: 'semi_automated',
        testingFrequency: 'monthly'
      }
    ];
  }

  private async initializeComplianceTables(tenantId: string, profileId: string): Promise<void> {
    // Initialize compliance-specific tables for tenant
    const queries = [
      `CREATE TABLE IF NOT EXISTS ${tenantId}_compliance_audit_trail (
        id VARCHAR(255) PRIMARY KEY,
        profile_id VARCHAR(255),
        event_type VARCHAR(100),
        details JSONB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )`
    ];

    for (const query of queries) {
      await globalConnectionPool.query(query);
    }
  }

  private async testComplianceControl(tenantId: string, control: ComplianceControl): Promise<any> {
    // Simulate control testing
    return {
      status: Math.random() > 0.3 ? 'pass' : 'fail',
      score: Math.floor(Math.random() * 100),
      findings: Math.random() > 0.7 ? ['Control implementation gap found'] : [],
      recommendations: Math.random() > 0.7 ? ['Implement additional monitoring'] : []
    };
  }

  private async getComplianceProfile(tenantId: string, framework: ComplianceFramework): Promise<ComplianceProfile | null> {
    const result = await globalConnectionPool.query(
      'SELECT * FROM compliance_profiles WHERE tenant_id = $1 AND framework = $2',
      [tenantId, framework]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapRowToComplianceProfile(result.rows[0]);
  }

  private async getLatestAssessment(tenantId: string, framework: ComplianceFramework): Promise<ComplianceAssessment | null> {
    const result = await globalConnectionPool.query(
      `SELECT * FROM compliance_assessments 
       WHERE tenant_id = $1 AND framework = $2 AND status = 'completed'
       ORDER BY completed_date DESC LIMIT 1`,
      [tenantId, framework]
    );

    if (result.rows.length === 0) {
      return null;
    }

    return this.mapRowToComplianceAssessment(result.rows[0]);
  }

  private async getAuditStatistics(tenantId: string, days: number): Promise<any> {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);

    const result = await globalConnectionPool.query(
      `SELECT 
         COUNT(*) as total_events,
         COUNT(CASE WHEN risk_level = 'high' OR risk_level = 'critical' THEN 1 END) as high_risk_events,
         COUNT(CASE WHEN outcome = 'failure' THEN 1 END) as failed_events
       FROM compliance_audit_trail 
       WHERE tenant_id = $1 AND metadata->>'timestamp' >= $2`,
      [tenantId, cutoff.toISOString()]
    );

    return {
      totalEvents: parseInt(result.rows[0]?.total_events || '0'),
      highRiskEvents: parseInt(result.rows[0]?.high_risk_events || '0'),
      failedEvents: parseInt(result.rows[0]?.failed_events || '0')
    };
  }

  private generateExecutiveRecommendations(profile: any, assessment: any, auditStats: any): string[] {
    const recommendations = [];
    
    if (assessment?.overallScore < 80) {
      recommendations.push('Immediate action required to address compliance gaps');
    }
    
    if (auditStats.highRiskEvents > 10) {
      recommendations.push('Review and enhance security monitoring');
    }

    return recommendations;
  }

  private generateTechnicalRecommendations(profile: any, assessment: any): string[] {
    return [
      'Implement automated compliance testing',
      'Enhance audit logging capabilities',
      'Review and update security policies'
    ];
  }

  private generateControlsBreakdown(controls: ComplianceControl[]): any {
    return controls.reduce((acc: any, control) => {
      acc[control.implementationStatus] = (acc[control.implementationStatus] || 0) + 1;
      return acc;
    }, {});
  }

  private generateRiskMatrix(findings: AssessmentFinding[]): any {
    return findings.reduce((acc: any, finding) => {
      acc[finding.severity] = (acc[finding.severity] || 0) + 1;
      return acc;
    }, {});
  }

  private calculateNextAssessmentDue(framework: ComplianceFramework): Date {
    const nextDue = new Date();
    // Different frameworks have different assessment frequencies
    const frequencies: Record<ComplianceFramework, number> = {
      soc2: 365, // Annual
      gdpr: 365, // Annual
      hipaa: 365, // Annual
      pci: 365, // Annual
      iso27001: 365, // Annual
      custom: 365
    };
    
    nextDue.setDate(nextDue.getDate() + frequencies[framework]);
    return nextDue;
  }

  private async countDataProcessingActivities(tenantId: string): Promise<number> {
    const result = await globalConnectionPool.query(
      'SELECT COUNT(*) as count FROM data_processing_records WHERE tenant_id = $1',
      [tenantId]
    );

    return parseInt(result.rows[0]?.count || '0');
  }

  private async getAssessmentHistory(tenantId: string, framework: ComplianceFramework): Promise<ComplianceAssessment[]> {
    const result = await globalConnectionPool.query(
      `SELECT * FROM compliance_assessments 
       WHERE tenant_id = $1 AND framework = $2 
       ORDER BY completed_date DESC LIMIT 10`,
      [tenantId, framework]
    );

    return result.rows.map(row => this.mapRowToComplianceAssessment(row));
  }

  private async runPeriodicComplianceChecks(): Promise<void> {
    console.log('[ComplianceSuite] Running periodic compliance checks...');
    // Implementation for periodic checks
  }

  private async triggerComplianceAlert(event: AuditTrail): Promise<void> {
    console.log(`[ComplianceSuite] Critical compliance event: ${event.eventType} - ${event.action}`);
    // Implementation for alerts
  }

  private async trackGDPRDataAccess(event: AuditTrail): Promise<void> {
    // Track GDPR data access for reporting
    console.log(`[ComplianceSuite] GDPR data access tracked: ${event.resource}`);
  }

  // Mapping methods
  private mapRowToComplianceProfile(row: any): ComplianceProfile {
    return {
      id: row.id,
      tenantId: row.tenant_id,
      framework: row.framework,
      version: row.version,
      status: row.status,
      configuration: JSON.parse(row.configuration),
      policies: JSON.parse(row.policies),
      controls: JSON.parse(row.controls),
      assessments: JSON.parse(row.assessments),
      metadata: JSON.parse(row.metadata)
    };
  }

  private mapRowToComplianceAssessment(row: any): ComplianceAssessment {
    return {
      id: row.id,
      tenantId: row.tenant_id,
      framework: row.framework,
      type: row.type,
      status: row.status,
      scope: JSON.parse(row.scope),
      findings: JSON.parse(row.findings),
      overallScore: row.overall_score,
      scheduledDate: row.scheduled_date,
      completedDate: row.completed_date,
      assessor: JSON.parse(row.assessor),
      report: JSON.parse(row.report || '{}')
    };
  }
}

// Global Compliance Suite instance
export const globalComplianceSuite = new ComplianceSuite();