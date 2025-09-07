import { EventEmitter } from 'events';
import crypto from 'crypto';

export interface ThreatDetectionRule {
  id: string;
  name: string;
  description: string;
  category: 'malware' | 'intrusion' | 'data_exfiltration' | 'privilege_escalation' | 'lateral_movement' | 'persistence' | 'command_control';
  severity: 'low' | 'medium' | 'high' | 'critical';
  techniques: MITREtechnique[];
  detection: DetectionLogic;
  response: ResponseAction[];
  isEnabled: boolean;
  confidence: number; // 0-100
  falsePositiveRate: number; // 0-100
  lastUpdated: Date;
  createdBy: string;
}

export interface MITREtechnique {
  id: string; // e.g., T1566.001
  name: string;
  tactic: string; // e.g., Initial Access
  description: string;
}

export interface DetectionLogic {
  type: 'signature' | 'behavioral' | 'statistical' | 'ml_model' | 'composite';
  rules: DetectionCondition[];
  threshold: number;
  timeWindow: number; // seconds
  dataSource: DataSource[];
}

export interface DetectionCondition {
  field: string;
  operator: 'equals' | 'contains' | 'regex' | 'greater_than' | 'less_than' | 'in_range' | 'anomaly';
  value: any;
  weight?: number; // for composite rules
}

export interface DataSource {
  type: 'logs' | 'network' | 'file_system' | 'registry' | 'memory' | 'process' | 'api_calls';
  source: string;
  fields: string[];
  filterConditions?: DetectionCondition[];
}

export interface ResponseAction {
  type: 'alert' | 'block' | 'quarantine' | 'isolate' | 'collect_evidence' | 'notify' | 'automated_response';
  priority: number; // 1-10
  parameters: Record<string, any>;
  conditions?: ResponseCondition[];
}

export interface ResponseCondition {
  field: string;
  operator: string;
  value: any;
}

export interface ThreatAlert {
  id: string;
  ruleId: string;
  ruleName: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  confidence: number; // 0-100
  riskScore: number; // 0-100
  category: string;
  techniques: MITREtechnique[];
  timestamp: Date;
  source: {
    type: string;
    identifier: string; // IP, user ID, device ID, etc.
    location?: string;
  };
  target: {
    type: string;
    identifier: string;
    location?: string;
  };
  evidence: Evidence[];
  timeline: TimelineEvent[];
  status: 'open' | 'investigating' | 'contained' | 'resolved' | 'false_positive';
  assignedTo?: string;
  containmentActions: ContainmentAction[];
  investigation: Investigation;
}

export interface Evidence {
  id: string;
  type: 'log_entry' | 'network_traffic' | 'file_hash' | 'process_info' | 'registry_key' | 'memory_dump';
  source: string;
  timestamp: Date;
  data: any;
  hash: string; // for integrity verification
  relevance: number; // 0-100
  chain_of_custody: ChainOfCustodyEntry[];
}

export interface ChainOfCustodyEntry {
  timestamp: Date;
  action: 'collected' | 'analyzed' | 'transferred' | 'stored';
  person: string;
  location: string;
  notes?: string;
}

export interface TimelineEvent {
  timestamp: Date;
  event: string;
  source: string;
  severity: 'info' | 'warning' | 'error' | 'critical';
  details: Record<string, any>;
}

export interface ContainmentAction {
  id: string;
  type: 'network_isolation' | 'account_disable' | 'process_kill' | 'file_quarantine' | 'system_shutdown';
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
  timestamp: Date;
  executor: string;
  target: string;
  result?: string;
  evidence?: string[];
}

export interface Investigation {
  id: string;
  status: 'open' | 'active' | 'on_hold' | 'closed';
  priority: 'low' | 'medium' | 'high' | 'critical';
  investigator?: string;
  findings: InvestigationFinding[];
  hypothesis: string[];
  nextSteps: string[];
  relatedAlerts: string[];
  externalReferences: string[];
  notes: InvestigationNote[];
}

export interface InvestigationFinding {
  id: string;
  timestamp: Date;
  investigator: string;
  category: 'initial_vector' | 'persistence' | 'lateral_movement' | 'data_access' | 'exfiltration' | 'impact';
  finding: string;
  confidence: number; // 0-100
  evidence: string[]; // evidence IDs
  recommendations: string[];
}

export interface InvestigationNote {
  id: string;
  timestamp: Date;
  investigator: string;
  note: string;
  category: 'observation' | 'hypothesis' | 'action' | 'communication';
}

export interface BehavioralBaseline {
  entityId: string;
  entityType: 'user' | 'device' | 'application' | 'network';
  metrics: BaselineMetric[];
  creationPeriod: { start: Date; end: Date };
  lastUpdated: Date;
  confidence: number; // 0-100
  sampleSize: number;
}

export interface BaselineMetric {
  name: string;
  normalRange: { min: number; max: number };
  average: number;
  standardDeviation: number;
  percentiles: {
    p50: number;
    p90: number;
    p95: number;
    p99: number;
  };
  trends: TrendData[];
}

export interface TrendData {
  timestamp: Date;
  value: number;
  anomalyScore: number; // 0-100
}

export interface MLModel {
  id: string;
  name: string;
  type: 'anomaly_detection' | 'classification' | 'clustering' | 'time_series' | 'deep_learning';
  algorithm: string;
  version: string;
  trainingData: {
    samples: number;
    features: string[];
    timeRange: { start: Date; end: Date };
    accuracy: number; // 0-100
    precision: number; // 0-100
    recall: number; // 0-100
    f1Score: number; // 0-100
  };
  deployment: {
    status: 'training' | 'testing' | 'deployed' | 'deprecated';
    deployedAt?: Date;
    performance: ModelPerformance;
  };
  configuration: ModelConfiguration;
}

export interface ModelPerformance {
  accuracy: number;
  falsePositiveRate: number;
  falseNegativeRate: number;
  averageLatency: number; // milliseconds
  throughput: number; // predictions per second
  lastEvaluated: Date;
}

export interface ModelConfiguration {
  parameters: Record<string, any>;
  threshold: number; // anomaly threshold
  updateFrequency: 'daily' | 'weekly' | 'monthly';
  retrainingTrigger: {
    accuracyThreshold: number;
    driftThreshold: number;
  };
}

export interface ThreatHuntingQuery {
  id: string;
  name: string;
  description: string;
  category: 'suspicious_activity' | 'ioc_search' | 'pattern_hunting' | 'baseline_deviation';
  query: string; // KQL, SQL, or custom query language
  dataSource: string[];
  schedule: {
    frequency: 'manual' | 'hourly' | 'daily' | 'weekly';
    nextRun?: Date;
  };
  results: ThreatHuntingResult[];
  isEnabled: boolean;
  createdBy: string;
  lastRun?: Date;
}

export interface ThreatHuntingResult {
  id: string;
  queryId: string;
  timestamp: Date;
  matches: number;
  results: any[];
  falsePositives: number;
  truePositives: number;
  investigationRequired: boolean;
  notes?: string;
}

export class ThreatDetectionService extends EventEmitter {
  private detectionRules: Map<string, ThreatDetectionRule> = new Map();
  private alerts: Map<string, ThreatAlert> = new Map();
  private behavioralBaselines: Map<string, BehavioralBaseline> = new Map();
  private mlModels: Map<string, MLModel> = new Map();
  private huntingQueries: Map<string, ThreatHuntingQuery> = new Map();
  private activeInvestigations: Map<string, Investigation> = new Map();
  private evidenceStore: Map<string, Evidence> = new Map();

  constructor() {
    super();
    this.initializeDetectionRules();
    this.initializeMLModels();
    this.initializeHuntingQueries();
    this.startContinuousMonitoring();
    this.startBehavioralLearning();
  }

  private initializeDetectionRules(): void {
    const defaultRules: ThreatDetectionRule[] = [
      {
        id: 'suspicious_login_activity',
        name: 'Suspicious Login Activity',
        description: 'Multiple failed login attempts from same IP followed by successful login',
        category: 'intrusion',
        severity: 'high',
        techniques: [
          {
            id: 'T1110',
            name: 'Brute Force',
            tactic: 'Credential Access',
            description: 'Adversaries may use brute force techniques to gain access to accounts'
          }
        ],
        detection: {
          type: 'behavioral',
          rules: [
            { field: 'event_type', operator: 'equals', value: 'login_failed' },
            { field: 'source_ip', operator: 'equals', value: '{IP}' },
            { field: 'count', operator: 'greater_than', value: 5 }
          ],
          threshold: 0.8,
          timeWindow: 300, // 5 minutes
          dataSource: [
            {
              type: 'logs',
              source: 'auth_service',
              fields: ['timestamp', 'event_type', 'source_ip', 'username', 'success']
            }
          ]
        },
        response: [
          {
            type: 'alert',
            priority: 8,
            parameters: {
              severity: 'high',
              notify: ['security_team', 'user_owner']
            }
          },
          {
            type: 'block',
            priority: 9,
            parameters: {
              target: 'source_ip',
              duration: 3600 // 1 hour
            }
          }
        ],
        isEnabled: true,
        confidence: 85,
        falsePositiveRate: 5,
        lastUpdated: new Date(),
        createdBy: 'security_team'
      },
      {
        id: 'privilege_escalation_attempt',
        name: 'Privilege Escalation Attempt',
        description: 'User attempting to access resources above their privilege level',
        category: 'privilege_escalation',
        severity: 'critical',
        techniques: [
          {
            id: 'T1068',
            name: 'Exploitation for Privilege Escalation',
            tactic: 'Privilege Escalation',
            description: 'Adversaries may exploit software vulnerabilities to elevate privileges'
          }
        ],
        detection: {
          type: 'composite',
          rules: [
            { field: 'access_denied_count', operator: 'greater_than', value: 3, weight: 0.4 },
            { field: 'privilege_change_attempt', operator: 'equals', value: true, weight: 0.6 },
            { field: 'admin_resource_access', operator: 'equals', value: true, weight: 0.8 }
          ],
          threshold: 0.7,
          timeWindow: 600, // 10 minutes
          dataSource: [
            {
              type: 'logs',
              source: 'access_control',
              fields: ['timestamp', 'user_id', 'resource', 'action', 'result', 'privilege_level']
            }
          ]
        },
        response: [
          {
            type: 'alert',
            priority: 10,
            parameters: {
              severity: 'critical',
              escalate: true,
              notify: ['security_team', 'ciso']
            }
          },
          {
            type: 'isolate',
            priority: 9,
            parameters: {
              target: 'user_account',
              method: 'temporary_suspension'
            }
          }
        ],
        isEnabled: true,
        confidence: 92,
        falsePositiveRate: 2,
        lastUpdated: new Date(),
        createdBy: 'security_team'
      },
      {
        id: 'data_exfiltration_pattern',
        name: 'Data Exfiltration Pattern',
        description: 'Unusual large data transfer patterns indicating potential exfiltration',
        category: 'data_exfiltration',
        severity: 'critical',
        techniques: [
          {
            id: 'T1041',
            name: 'Exfiltration Over C2 Channel',
            tactic: 'Exfiltration',
            description: 'Adversaries may steal data by exfiltrating it over an existing command and control channel'
          }
        ],
        detection: {
          type: 'statistical',
          rules: [
            { field: 'data_transfer_size', operator: 'anomaly', value: 'baseline_deviation' },
            { field: 'transfer_frequency', operator: 'greater_than', value: 'normal_range' },
            { field: 'destination_suspicious', operator: 'equals', value: true }
          ],
          threshold: 0.75,
          timeWindow: 1800, // 30 minutes
          dataSource: [
            {
              type: 'network',
              source: 'network_monitor',
              fields: ['timestamp', 'source_ip', 'dest_ip', 'bytes_transferred', 'protocol', 'user_id']
            }
          ]
        },
        response: [
          {
            type: 'alert',
            priority: 10,
            parameters: {
              severity: 'critical',
              escalate: true
            }
          },
          {
            type: 'collect_evidence',
            priority: 8,
            parameters: {
              types: ['network_traffic', 'file_access_logs', 'user_activity']
            }
          },
          {
            type: 'quarantine',
            priority: 7,
            parameters: {
              target: 'suspicious_files',
              preserve_evidence: true
            }
          }
        ],
        isEnabled: true,
        confidence: 88,
        falsePositiveRate: 8,
        lastUpdated: new Date(),
        createdBy: 'security_team'
      },
      {
        id: 'malware_execution_detection',
        name: 'Malware Execution Detection',
        description: 'Detection of known malware signatures and behaviors',
        category: 'malware',
        severity: 'critical',
        techniques: [
          {
            id: 'T1204',
            name: 'User Execution',
            tactic: 'Execution',
            description: 'Adversaries may rely upon specific actions by a user in order to gain execution'
          }
        ],
        detection: {
          type: 'signature',
          rules: [
            { field: 'file_hash', operator: 'in_range', value: 'malware_signatures' },
            { field: 'process_behavior', operator: 'contains', value: 'suspicious_actions' },
            { field: 'network_communication', operator: 'equals', value: 'c2_pattern' }
          ],
          threshold: 0.9,
          timeWindow: 60, // 1 minute
          dataSource: [
            {
              type: 'file_system',
              source: 'file_monitor',
              fields: ['timestamp', 'file_path', 'file_hash', 'process_id', 'user_id']
            },
            {
              type: 'process',
              source: 'process_monitor',
              fields: ['timestamp', 'process_name', 'pid', 'parent_pid', 'command_line']
            }
          ]
        },
        response: [
          {
            type: 'alert',
            priority: 10,
            parameters: {
              severity: 'critical',
              immediate: true
            }
          },
          {
            type: 'quarantine',
            priority: 10,
            parameters: {
              target: 'malicious_file',
              isolate_system: true
            }
          },
          {
            type: 'automated_response',
            priority: 9,
            parameters: {
              script: 'malware_containment.sh',
              parameters: ['isolate', 'preserve_evidence']
            }
          }
        ],
        isEnabled: true,
        confidence: 95,
        falsePositiveRate: 1,
        lastUpdated: new Date(),
        createdBy: 'security_team'
      }
    ];

    defaultRules.forEach(rule => {
      this.detectionRules.set(rule.id, rule);
    });
  }

  private initializeMLModels(): void {
    const defaultModels: MLModel[] = [
      {
        id: 'user_behavior_anomaly',
        name: 'User Behavior Anomaly Detection',
        type: 'anomaly_detection',
        algorithm: 'Isolation Forest',
        version: '1.2.0',
        trainingData: {
          samples: 1000000,
          features: ['login_frequency', 'access_patterns', 'data_volume', 'time_patterns', 'location_patterns'],
          timeRange: {
            start: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000), // 90 days ago
            end: new Date()
          },
          accuracy: 94.2,
          precision: 91.8,
          recall: 89.5,
          f1Score: 90.6
        },
        deployment: {
          status: 'deployed',
          deployedAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
          performance: {
            accuracy: 93.8,
            falsePositiveRate: 4.2,
            falseNegativeRate: 2.0,
            averageLatency: 125, // milliseconds
            throughput: 800, // predictions per second
            lastEvaluated: new Date()
          }
        },
        configuration: {
          parameters: {
            contamination: 0.05,
            n_estimators: 100,
            max_samples: 256,
            random_state: 42
          },
          threshold: 0.75,
          updateFrequency: 'weekly',
          retrainingTrigger: {
            accuracyThreshold: 85,
            driftThreshold: 0.1
          }
        }
      },
      {
        id: 'network_intrusion_classifier',
        name: 'Network Intrusion Classifier',
        type: 'classification',
        algorithm: 'XGBoost',
        version: '2.1.0',
        trainingData: {
          samples: 500000,
          features: ['packet_size', 'protocol_type', 'connection_duration', 'bytes_transferred', 'flag_patterns'],
          timeRange: {
            start: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
            end: new Date()
          },
          accuracy: 97.3,
          precision: 96.8,
          recall: 94.2,
          f1Score: 95.5
        },
        deployment: {
          status: 'deployed',
          deployedAt: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000), // 14 days ago
          performance: {
            accuracy: 96.9,
            falsePositiveRate: 2.1,
            falseNegativeRate: 1.0,
            averageLatency: 45, // milliseconds
            throughput: 2000, // predictions per second
            lastEvaluated: new Date()
          }
        },
        configuration: {
          parameters: {
            max_depth: 6,
            learning_rate: 0.1,
            n_estimators: 200,
            subsample: 0.8
          },
          threshold: 0.85,
          updateFrequency: 'daily',
          retrainingTrigger: {
            accuracyThreshold: 90,
            driftThreshold: 0.15
          }
        }
      }
    ];

    defaultModels.forEach(model => {
      this.mlModels.set(model.id, model);
    });
  }

  private initializeHuntingQueries(): void {
    const defaultQueries: ThreatHuntingQuery[] = [
      {
        id: 'suspicious_powershell_activity',
        name: 'Suspicious PowerShell Activity',
        description: 'Hunt for suspicious PowerShell execution patterns',
        category: 'suspicious_activity',
        query: `
          SELECT * FROM process_logs 
          WHERE process_name LIKE '%powershell%' 
          AND (command_line CONTAINS 'DownloadString' 
               OR command_line CONTAINS 'IEX' 
               OR command_line CONTAINS 'Invoke-Expression'
               OR command_line CONTAINS '-encodedCommand')
          AND timestamp >= NOW() - INTERVAL '24 HOURS'
        `,
        dataSource: ['process_monitor', 'command_line_logs'],
        schedule: {
          frequency: 'daily',
          nextRun: new Date(Date.now() + 24 * 60 * 60 * 1000)
        },
        results: [],
        isEnabled: true,
        createdBy: 'threat_hunter_01',
        lastRun: new Date(Date.now() - 24 * 60 * 60 * 1000)
      },
      {
        id: 'lateral_movement_indicators',
        name: 'Lateral Movement Indicators',
        description: 'Hunt for indicators of lateral movement across the network',
        category: 'pattern_hunting',
        query: `
          WITH user_connections AS (
            SELECT user_id, source_ip, dest_ip, COUNT(*) as conn_count
            FROM network_connections 
            WHERE timestamp >= NOW() - INTERVAL '4 HOURS'
            GROUP BY user_id, source_ip, dest_ip
          )
          SELECT * FROM user_connections 
          WHERE conn_count > 10 
          AND EXISTS (
            SELECT 1 FROM failed_authentications fa 
            WHERE fa.user_id = user_connections.user_id 
            AND fa.timestamp >= NOW() - INTERVAL '4 HOURS'
          )
        `,
        dataSource: ['network_monitor', 'authentication_logs'],
        schedule: {
          frequency: 'hourly',
          nextRun: new Date(Date.now() + 60 * 60 * 1000)
        },
        results: [],
        isEnabled: true,
        createdBy: 'threat_hunter_02'
      },
      {
        id: 'data_staging_behavior',
        name: 'Data Staging Behavior',
        description: 'Hunt for data staging activities before exfiltration',
        category: 'suspicious_activity',
        query: `
          SELECT user_id, file_path, SUM(file_size) as total_size, COUNT(*) as file_count
          FROM file_operations 
          WHERE operation IN ('copy', 'move') 
          AND file_path LIKE '%temp%' OR file_path LIKE '%tmp%'
          AND timestamp >= NOW() - INTERVAL '2 HOURS'
          GROUP BY user_id, file_path
          HAVING total_size > 100000000 OR file_count > 1000
        `,
        dataSource: ['file_system_monitor'],
        schedule: {
          frequency: 'hourly',
          nextRun: new Date(Date.now() + 60 * 60 * 1000)
        },
        results: [],
        isEnabled: true,
        createdBy: 'threat_hunter_03'
      }
    ];

    defaultQueries.forEach(query => {
      this.huntingQueries.set(query.id, query);
    });
  }

  private startContinuousMonitoring(): void {
    // Real-time threat detection
    setInterval(async () => {
      await this.runThreatDetection();
    }, 30 * 1000); // Every 30 seconds

    // ML model predictions
    setInterval(async () => {
      await this.runMLPredictions();
    }, 60 * 1000); // Every minute

    // Threat hunting queries
    setInterval(async () => {
      await this.runScheduledHunting();
    }, 5 * 60 * 1000); // Every 5 minutes

    // Investigation updates
    setInterval(async () => {
      await this.updateInvestigations();
    }, 2 * 60 * 1000); // Every 2 minutes
  }

  private startBehavioralLearning(): void {
    // Update behavioral baselines
    setInterval(async () => {
      await this.updateBehavioralBaselines();
    }, 15 * 60 * 1000); // Every 15 minutes

    // Retrain ML models
    setInterval(async () => {
      await this.evaluateModelPerformance();
    }, 60 * 60 * 1000); // Every hour
  }

  private async runThreatDetection(): Promise<void> {
    // Simulate processing new events
    const events = await this.collectEvents();

    for (const event of events) {
      // Check against all enabled detection rules
      for (const rule of this.detectionRules.values()) {
        if (rule.isEnabled) {
          const match = await this.evaluateDetectionRule(rule, event);
          if (match) {
            await this.createThreatAlert(rule, event, match);
          }
        }
      }
    }
  }

  private async collectEvents(): Promise<any[]> {
    // Simulate collecting events from various sources
    const events = [];

    // Generate sample events for demonstration
    const eventTypes = ['login_attempt', 'file_access', 'network_connection', 'process_execution', 'privilege_change'];
    
    for (let i = 0; i < 10; i++) {
      events.push({
        id: this.generateId('event'),
        type: eventTypes[Math.floor(Math.random() * eventTypes.length)],
        timestamp: new Date(),
        source_ip: `192.168.1.${Math.floor(Math.random() * 255)}`,
        user_id: `user_${Math.floor(Math.random() * 1000)}`,
        device_id: `device_${Math.floor(Math.random() * 500)}`,
        success: Math.random() > 0.1, // 90% success rate
        data_size: Math.floor(Math.random() * 1000000),
        destination: `external_${Math.floor(Math.random() * 100)}.com`,
        process_name: ['powershell.exe', 'cmd.exe', 'python.exe', 'node.exe'][Math.floor(Math.random() * 4)],
        command_line: 'sample command line',
        file_hash: crypto.createHash('md5').update(`file_${i}`).digest('hex')
      });
    }

    return events;
  }

  private async evaluateDetectionRule(rule: ThreatDetectionRule, event: any): Promise<any> {
    const matches: any = {};
    let totalWeight = 0;
    let matchedWeight = 0;

    for (const condition of rule.detection.rules) {
      const weight = condition.weight || 1;
      totalWeight += weight;

      const eventValue = event[condition.field];
      let conditionMet = false;

      switch (condition.operator) {
        case 'equals':
          conditionMet = eventValue === condition.value;
          break;
        case 'contains':
          conditionMet = typeof eventValue === 'string' && eventValue.includes(condition.value);
          break;
        case 'greater_than':
          conditionMet = typeof eventValue === 'number' && eventValue > condition.value;
          break;
        case 'regex':
          conditionMet = new RegExp(condition.value).test(String(eventValue));
          break;
        case 'anomaly':
          conditionMet = await this.checkAnomaly(condition.field, eventValue, event.user_id || event.device_id);
          break;
        default:
          conditionMet = false;
      }

      if (conditionMet) {
        matchedWeight += weight;
        matches[condition.field] = { value: eventValue, expected: condition.value };
      }
    }

    const score = totalWeight > 0 ? matchedWeight / totalWeight : 0;
    
    if (score >= rule.detection.threshold) {
      return {
        score,
        matches,
        confidence: rule.confidence,
        event
      };
    }

    return null;
  }

  private async checkAnomaly(field: string, value: any, entityId: string): Promise<boolean> {
    const baseline = this.behavioralBaselines.get(`${entityId}_${field}`);
    if (!baseline) return false;

    const metric = baseline.metrics.find(m => m.name === field);
    if (!metric) return false;

    // Simple anomaly detection - check if value is outside normal range
    const zscore = Math.abs((value - metric.average) / metric.standardDeviation);
    return zscore > 2.5; // 2.5 standard deviations
  }

  private async createThreatAlert(rule: ThreatDetectionRule, event: any, match: any): Promise<void> {
    const alert: ThreatAlert = {
      id: this.generateId('alert'),
      ruleId: rule.id,
      ruleName: rule.name,
      severity: rule.severity,
      confidence: match.confidence,
      riskScore: this.calculateRiskScore(rule, match),
      category: rule.category,
      techniques: rule.techniques,
      timestamp: new Date(),
      source: {
        type: 'ip_address',
        identifier: event.source_ip,
        location: 'unknown'
      },
      target: {
        type: 'user',
        identifier: event.user_id,
        location: 'internal'
      },
      evidence: [],
      timeline: [{
        timestamp: new Date(),
        event: 'Alert Created',
        source: 'threat_detection_engine',
        severity: 'info',
        details: { ruleId: rule.id, matchScore: match.score }
      }],
      status: 'open',
      containmentActions: [],
      investigation: {
        id: this.generateId('investigation'),
        status: 'open',
        priority: this.mapSeverityToPriority(rule.severity),
        findings: [],
        hypothesis: [],
        nextSteps: [],
        relatedAlerts: [],
        externalReferences: [],
        notes: []
      }
    };

    // Collect evidence
    alert.evidence = await this.collectEvidence(alert, event);

    // Execute response actions
    for (const responseAction of rule.response) {
      await this.executeResponseAction(responseAction, alert);
    }

    this.alerts.set(alert.id, alert);
    this.activeInvestigations.set(alert.investigation.id, alert.investigation);

    this.emit('threat_alert_created', alert);
  }

  private calculateRiskScore(rule: ThreatDetectionRule, match: any): number {
    let riskScore = 0;

    // Base score from severity
    const severityScores = { low: 20, medium: 40, high: 70, critical: 90 };
    riskScore += severityScores[rule.severity];

    // Adjust based on confidence and match score
    riskScore = riskScore * (match.confidence / 100) * match.score;

    return Math.min(100, Math.round(riskScore));
  }

  private mapSeverityToPriority(severity: string): Investigation['priority'] {
    const mapping: Record<string, Investigation['priority']> = {
      low: 'low',
      medium: 'medium',
      high: 'high',
      critical: 'critical'
    };
    return mapping[severity] || 'medium';
  }

  private async collectEvidence(alert: ThreatAlert, event: any): Promise<Evidence[]> {
    const evidence: Evidence[] = [];

    // Create log evidence
    const logEvidence: Evidence = {
      id: this.generateId('evidence'),
      type: 'log_entry',
      source: 'security_logs',
      timestamp: new Date(),
      data: event,
      hash: crypto.createHash('sha256').update(JSON.stringify(event)).digest('hex'),
      relevance: 95,
      chain_of_custody: [{
        timestamp: new Date(),
        action: 'collected',
        person: 'threat_detection_system',
        location: 'security_database',
        notes: 'Automatically collected during threat detection'
      }]
    };

    evidence.push(logEvidence);
    this.evidenceStore.set(logEvidence.id, logEvidence);

    // Collect additional evidence based on event type
    if (event.type === 'network_connection') {
      const networkEvidence: Evidence = {
        id: this.generateId('evidence'),
        type: 'network_traffic',
        source: 'network_monitor',
        timestamp: new Date(),
        data: {
          source_ip: event.source_ip,
          destination: event.destination,
          bytes_transferred: event.data_size,
          protocol: 'TCP',
          connection_duration: Math.random() * 3600
        },
        hash: crypto.createHash('sha256').update(`network_${event.id}`).digest('hex'),
        relevance: 80,
        chain_of_custody: [{
          timestamp: new Date(),
          action: 'collected',
          person: 'network_monitoring_system',
          location: 'network_database'
        }]
      };
      
      evidence.push(networkEvidence);
      this.evidenceStore.set(networkEvidence.id, networkEvidence);
    }

    return evidence;
  }

  private async executeResponseAction(action: ResponseAction, alert: ThreatAlert): Promise<void> {
    const containmentAction: ContainmentAction = {
      id: this.generateId('containment'),
      type: action.type as ContainmentAction['type'],
      status: 'pending',
      timestamp: new Date(),
      executor: 'automated_response_system',
      target: alert.source.identifier
    };

    try {
      containmentAction.status = 'in_progress';
      
      // Simulate response action execution
      switch (action.type) {
        case 'alert':
          await this.sendAlert(alert, action.parameters);
          break;
        case 'block':
          await this.blockEntity(alert.source.identifier, action.parameters);
          break;
        case 'isolate':
          await this.isolateEntity(alert.source.identifier, action.parameters);
          break;
        case 'collect_evidence':
          await this.collectAdditionalEvidence(alert, action.parameters);
          break;
        case 'quarantine':
          await this.quarantineAssets(alert, action.parameters);
          break;
        case 'automated_response':
          await this.executeAutomatedScript(action.parameters);
          break;
      }

      containmentAction.status = 'completed';
      containmentAction.result = 'Success';

    } catch (error) {
      containmentAction.status = 'failed';
      containmentAction.result = `Failed: ${error}`;
    }

    alert.containmentActions.push(containmentAction);
    alert.timeline.push({
      timestamp: new Date(),
      event: `Containment Action: ${action.type}`,
      source: 'response_system',
      severity: 'info',
      details: { actionId: containmentAction.id, status: containmentAction.status }
    });
  }

  private async sendAlert(alert: ThreatAlert, parameters: any): Promise<void> {
    // Simulate sending alert notification
    console.log(`Alert sent: ${alert.ruleName} - ${alert.severity}`);
    
    if (parameters.notify) {
      for (const recipient of parameters.notify) {
        console.log(`Notified: ${recipient}`);
      }
    }
  }

  private async blockEntity(entityId: string, parameters: any): Promise<void> {
    // Simulate blocking an IP or user
    console.log(`Blocked entity: ${entityId} for ${parameters.duration || 'indefinite'} seconds`);
  }

  private async isolateEntity(entityId: string, parameters: any): Promise<void> {
    // Simulate isolating a device or network segment
    console.log(`Isolated entity: ${entityId} using method: ${parameters.method}`);
  }

  private async collectAdditionalEvidence(alert: ThreatAlert, parameters: any): Promise<void> {
    // Simulate collecting additional evidence
    for (const evidenceType of parameters.types) {
      console.log(`Collecting evidence type: ${evidenceType}`);
    }
  }

  private async quarantineAssets(alert: ThreatAlert, parameters: any): Promise<void> {
    // Simulate quarantining suspicious assets
    console.log(`Quarantined assets for alert: ${alert.id}, preserve evidence: ${parameters.preserve_evidence}`);
  }

  private async executeAutomatedScript(parameters: any): Promise<void> {
    // Simulate executing automated response script
    console.log(`Executing script: ${parameters.script} with parameters:`, parameters.parameters);
  }

  private async runMLPredictions(): Promise<void> {
    const deployedModels = Array.from(this.mlModels.values())
      .filter(model => model.deployment.status === 'deployed');

    for (const model of deployedModels) {
      const predictions = await this.runModelPrediction(model);
      await this.processPredictions(model, predictions);
    }
  }

  private async runModelPrediction(model: MLModel): Promise<any[]> {
    // Simulate ML model prediction
    const predictions = [];
    
    for (let i = 0; i < 100; i++) {
      predictions.push({
        entityId: `entity_${Math.floor(Math.random() * 1000)}`,
        anomalyScore: Math.random(),
        classification: Math.random() > 0.9 ? 'anomalous' : 'normal',
        confidence: 0.7 + Math.random() * 0.3,
        features: {
          feature1: Math.random() * 100,
          feature2: Math.random() * 100,
          feature3: Math.random() * 100
        }
      });
    }

    return predictions;
  }

  private async processPredictions(model: MLModel, predictions: any[]): Promise<void> {
    const threshold = model.configuration.threshold;
    const anomalies = predictions.filter(p => p.anomalyScore > threshold);

    for (const anomaly of anomalies) {
      // Create ML-based threat alert
      await this.createMLBasedAlert(model, anomaly);
    }
  }

  private async createMLBasedAlert(model: MLModel, anomaly: any): Promise<void> {
    const alert: ThreatAlert = {
      id: this.generateId('ml_alert'),
      ruleId: model.id,
      ruleName: `ML Detection: ${model.name}`,
      severity: anomaly.anomalyScore > 0.9 ? 'critical' : 
                anomaly.anomalyScore > 0.8 ? 'high' : 'medium',
      confidence: Math.round(anomaly.confidence * 100),
      riskScore: Math.round(anomaly.anomalyScore * 100),
      category: 'intrusion',
      techniques: [],
      timestamp: new Date(),
      source: {
        type: 'entity',
        identifier: anomaly.entityId,
        location: 'internal'
      },
      target: {
        type: 'system',
        identifier: 'internal_systems',
        location: 'internal'
      },
      evidence: [],
      timeline: [{
        timestamp: new Date(),
        event: 'ML-based Alert Created',
        source: model.name,
        severity: 'info',
        details: { modelId: model.id, anomalyScore: anomaly.anomalyScore }
      }],
      status: 'open',
      containmentActions: [],
      investigation: {
        id: this.generateId('ml_investigation'),
        status: 'open',
        priority: anomaly.anomalyScore > 0.9 ? 'critical' : 'high',
        findings: [],
        hypothesis: [`ML model ${model.name} detected anomalous behavior`],
        nextSteps: ['Investigate entity behavior', 'Correlate with other alerts'],
        relatedAlerts: [],
        externalReferences: [],
        notes: []
      }
    };

    this.alerts.set(alert.id, alert);
    this.activeInvestigations.set(alert.investigation.id, alert.investigation);

    this.emit('ml_threat_alert_created', alert);
  }

  private async runScheduledHunting(): Promise<void> {
    const now = new Date();
    
    for (const query of this.huntingQueries.values()) {
      if (query.isEnabled && query.schedule.nextRun && query.schedule.nextRun <= now) {
        await this.executeHuntingQuery(query);
      }
    }
  }

  private async executeHuntingQuery(query: ThreatHuntingQuery): Promise<void> {
    try {
      // Simulate query execution
      const results = await this.simulateQueryExecution(query);
      
      const huntingResult: ThreatHuntingResult = {
        id: this.generateId('hunt_result'),
        queryId: query.id,
        timestamp: new Date(),
        matches: results.length,
        results: results.slice(0, 100), // Limit results
        falsePositives: Math.floor(results.length * 0.1),
        truePositives: Math.floor(results.length * 0.9),
        investigationRequired: results.length > 0,
        notes: results.length > 0 ? 'Suspicious activity detected' : 'No threats found'
      };

      query.results.push(huntingResult);
      query.lastRun = new Date();

      // Schedule next run
      this.scheduleNextHuntingRun(query);

      if (huntingResult.investigationRequired) {
        await this.createHuntingBasedInvestigation(query, huntingResult);
      }

      this.emit('hunting_query_completed', { query, result: huntingResult });

    } catch (error) {
      console.error(`Hunting query ${query.id} failed:`, error);
    }
  }

  private async simulateQueryExecution(query: ThreatHuntingQuery): Promise<any[]> {
    // Simulate query results based on query type
    const results = [];
    const resultCount = Math.floor(Math.random() * 10); // 0-9 results

    for (let i = 0; i < resultCount; i++) {
      results.push({
        id: this.generateId('query_result'),
        timestamp: new Date(Date.now() - Math.random() * 24 * 60 * 60 * 1000), // Last 24 hours
        user_id: `user_${Math.floor(Math.random() * 1000)}`,
        source_ip: `10.0.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`,
        suspicious_indicator: `indicator_${i}`,
        confidence: 0.5 + Math.random() * 0.5
      });
    }

    return results;
  }

  private scheduleNextHuntingRun(query: ThreatHuntingQuery): void {
    const intervals = {
      hourly: 60 * 60 * 1000,
      daily: 24 * 60 * 60 * 1000,
      weekly: 7 * 24 * 60 * 60 * 1000
    };

    if (query.schedule.frequency !== 'manual') {
      const interval = intervals[query.schedule.frequency];
      query.schedule.nextRun = new Date(Date.now() + interval);
    }
  }

  private async createHuntingBasedInvestigation(query: ThreatHuntingQuery, result: ThreatHuntingResult): Promise<void> {
    const investigation: Investigation = {
      id: this.generateId('hunt_investigation'),
      status: 'open',
      priority: result.matches > 5 ? 'high' : 'medium',
      findings: [],
      hypothesis: [`Hunting query "${query.name}" detected ${result.matches} suspicious indicators`],
      nextSteps: [
        'Analyze hunting results',
        'Correlate with existing alerts',
        'Investigate affected entities'
      ],
      relatedAlerts: [],
      externalReferences: [],
      notes: [{
        id: this.generateId('note'),
        timestamp: new Date(),
        investigator: 'hunting_system',
        note: `Hunting query executed: ${result.matches} matches found`,
        category: 'observation'
      }]
    };

    this.activeInvestigations.set(investigation.id, investigation);
    
    this.emit('hunting_investigation_created', { query, result, investigation });
  }

  private async updateInvestigations(): Promise<void> {
    for (const investigation of this.activeInvestigations.values()) {
      if (investigation.status === 'active') {
        // Simulate investigation progress
        if (Math.random() > 0.8) { // 20% chance of new finding
          const finding: InvestigationFinding = {
            id: this.generateId('finding'),
            timestamp: new Date(),
            investigator: 'automated_analysis',
            category: ['initial_vector', 'persistence', 'lateral_movement'][Math.floor(Math.random() * 3)] as InvestigationFinding['category'],
            finding: 'Automated analysis detected additional suspicious patterns',
            confidence: 60 + Math.random() * 30,
            evidence: [],
            recommendations: ['Further manual investigation required']
          };

          investigation.findings.push(finding);
        }
      }
    }
  }

  private async updateBehavioralBaselines(): Promise<void> {
    // Simulate updating behavioral baselines
    const entities = ['user_123', 'device_456', 'app_789'];
    
    for (const entityId of entities) {
      const baseline = await this.calculateBehavioralBaseline(entityId, 'user');
      this.behavioralBaselines.set(`${entityId}_behavior`, baseline);
    }
  }

  private async calculateBehavioralBaseline(entityId: string, entityType: BehavioralBaseline['entityType']): Promise<BehavioralBaseline> {
    // Simulate baseline calculation
    const metrics: BaselineMetric[] = [
      {
        name: 'login_frequency',
        normalRange: { min: 2, max: 10 },
        average: 5.5,
        standardDeviation: 1.2,
        percentiles: { p50: 5, p90: 8, p95: 9, p99: 10 },
        trends: []
      },
      {
        name: 'data_access_volume',
        normalRange: { min: 100, max: 5000 },
        average: 2500,
        standardDeviation: 800,
        percentiles: { p50: 2400, p90: 4200, p95: 4600, p99: 4900 },
        trends: []
      }
    ];

    return {
      entityId,
      entityType,
      metrics,
      creationPeriod: {
        start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
        end: new Date()
      },
      lastUpdated: new Date(),
      confidence: 85,
      sampleSize: 1000
    };
  }

  private async evaluateModelPerformance(): Promise<void> {
    for (const model of this.mlModels.values()) {
      if (model.deployment.status === 'deployed') {
        // Simulate performance evaluation
        const performance = model.deployment.performance;
        performance.lastEvaluated = new Date();
        
        // Check if retraining is needed
        const config = model.configuration.retrainingTrigger;
        if (performance.accuracy < config.accuracyThreshold) {
          await this.triggerModelRetraining(model);
        }
      }
    }
  }

  private async triggerModelRetraining(model: MLModel): Promise<void> {
    console.log(`Triggering retraining for model: ${model.name}`);
    
    // Update model status
    model.deployment.status = 'training';
    
    // Simulate training process
    setTimeout(() => {
      model.deployment.status = 'deployed';
      model.deployment.performance.accuracy = 90 + Math.random() * 8; // Improved accuracy
      console.log(`Model ${model.name} retraining completed`);
      
      this.emit('model_retrained', model);
    }, 10000); // 10 second training simulation
  }

  // API Methods
  getAllAlerts(filters?: {
    severity?: ThreatAlert['severity'];
    status?: ThreatAlert['status'];
    timeRange?: { start: Date; end: Date };
  }): ThreatAlert[] {
    let alerts = Array.from(this.alerts.values());

    if (filters) {
      if (filters.severity) alerts = alerts.filter(a => a.severity === filters.severity);
      if (filters.status) alerts = alerts.filter(a => a.status === filters.status);
      if (filters.timeRange) {
        alerts = alerts.filter(a => 
          a.timestamp >= filters.timeRange!.start && a.timestamp <= filters.timeRange!.end
        );
      }
    }

    return alerts.sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  getAlert(alertId: string): ThreatAlert | undefined {
    return this.alerts.get(alertId);
  }

  async updateAlertStatus(alertId: string, status: ThreatAlert['status'], assignedTo?: string): Promise<ThreatAlert> {
    const alert = this.alerts.get(alertId);
    if (!alert) {
      throw new Error('Alert not found');
    }

    alert.status = status;
    if (assignedTo) alert.assignedTo = assignedTo;

    alert.timeline.push({
      timestamp: new Date(),
      event: `Status changed to ${status}`,
      source: assignedTo || 'system',
      severity: 'info',
      details: { previousStatus: alert.status, newStatus: status }
    });

    this.alerts.set(alertId, alert);

    this.emit('alert_status_updated', alert);

    return alert;
  }

  getAllInvestigations(filters?: {
    status?: Investigation['status'];
    priority?: Investigation['priority'];
  }): Investigation[] {
    let investigations = Array.from(this.activeInvestigations.values());

    if (filters) {
      if (filters.status) investigations = investigations.filter(i => i.status === filters.status);
      if (filters.priority) investigations = investigations.filter(i => i.priority === filters.priority);
    }

    return investigations;
  }

  getInvestigation(investigationId: string): Investigation | undefined {
    return this.activeInvestigations.get(investigationId);
  }

  async addInvestigationFinding(investigationId: string, finding: Omit<InvestigationFinding, 'id'>): Promise<Investigation> {
    const investigation = this.activeInvestigations.get(investigationId);
    if (!investigation) {
      throw new Error('Investigation not found');
    }

    const fullFinding: InvestigationFinding = {
      ...finding,
      id: this.generateId('finding')
    };

    investigation.findings.push(fullFinding);
    this.activeInvestigations.set(investigationId, investigation);

    this.emit('investigation_finding_added', { investigation, finding: fullFinding });

    return investigation;
  }

  getAllDetectionRules(): ThreatDetectionRule[] {
    return Array.from(this.detectionRules.values());
  }

  getDetectionRule(ruleId: string): ThreatDetectionRule | undefined {
    return this.detectionRules.get(ruleId);
  }

  async updateDetectionRule(ruleId: string, updates: Partial<ThreatDetectionRule>): Promise<ThreatDetectionRule> {
    const rule = this.detectionRules.get(ruleId);
    if (!rule) {
      throw new Error('Detection rule not found');
    }

    const updatedRule = {
      ...rule,
      ...updates,
      lastUpdated: new Date()
    };

    this.detectionRules.set(ruleId, updatedRule);

    this.emit('detection_rule_updated', updatedRule);

    return updatedRule;
  }

  getAllHuntingQueries(): ThreatHuntingQuery[] {
    return Array.from(this.huntingQueries.values());
  }

  getHuntingQuery(queryId: string): ThreatHuntingQuery | undefined {
    return this.huntingQueries.get(queryId);
  }

  async executeManualHunt(queryId: string): Promise<ThreatHuntingResult> {
    const query = this.huntingQueries.get(queryId);
    if (!query) {
      throw new Error('Hunting query not found');
    }

    await this.executeHuntingQuery(query);
    return query.results[query.results.length - 1];
  }

  getMLModels(): MLModel[] {
    return Array.from(this.mlModels.values());
  }

  getMLModel(modelId: string): MLModel | undefined {
    return this.mlModels.get(modelId);
  }

  getBehavioralBaseline(entityId: string, entityType: string): BehavioralBaseline | undefined {
    return this.behavioralBaselines.get(`${entityId}_${entityType}`);
  }

  getEvidence(evidenceId: string): Evidence | undefined {
    return this.evidenceStore.get(evidenceId);
  }

  private generateId(prefix: string): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}