import { EventEmitter } from 'events';

export interface ErrorPattern {
  id: string;
  type: 'timeout' | 'rate_limit' | 'auth_failure' | 'network_error' | 'memory_leak' | 'cpu_spike' | 'database_error';
  pattern: string; // regex or description
  frequency: number; // occurrences per hour
  severity: 'low' | 'medium' | 'high' | 'critical';
  recoveryActions: RecoveryAction[];
  preventionMeasures: PreventionMeasure[];
  lastOccurrence: Date;
  trend: 'increasing' | 'stable' | 'decreasing';
}

export interface RecoveryAction {
  id: string;
  name: string;
  type: 'restart' | 'fallback' | 'circuit_breaker' | 'scaling' | 'cleanup' | 'reroute';
  priority: number; // 1-10, higher = more priority
  conditions: ActionCondition[];
  implementation: string; // code or script reference
  successRate: number; // 0-100%
  averageExecutionTime: number; // milliseconds
  cooldownPeriod: number; // seconds
  lastExecuted?: Date;
  isEnabled: boolean;
}

export interface ActionCondition {
  metric: string; // cpu_usage, memory_usage, error_rate, etc.
  operator: 'gt' | 'lt' | 'eq' | 'gte' | 'lte';
  threshold: number;
  timeWindow: number; // seconds
}

export interface PreventionMeasure {
  id: string;
  name: string;
  type: 'monitoring' | 'throttling' | 'caching' | 'load_balancing' | 'resource_limits';
  description: string;
  isActive: boolean;
  configuration: Record<string, any>;
  effectiveness: number; // 0-100%
}

export interface SystemHealth {
  timestamp: Date;
  overall: 'healthy' | 'degraded' | 'critical' | 'down';
  components: ComponentHealth[];
  activeIncidents: Incident[];
  recoveryActions: ActiveRecoveryAction[];
  predictions: HealthPrediction[];
}

export interface ComponentHealth {
  name: string;
  status: 'healthy' | 'warning' | 'error' | 'down';
  metrics: {
    cpu: number;
    memory: number;
    responseTime: number;
    errorRate: number;
    throughput: number;
  };
  lastCheck: Date;
  issues: string[];
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'resolving' | 'resolved';
  affectedComponents: string[];
  startTime: Date;
  resolvedTime?: Date;
  recoveryActions: string[]; // action IDs
  rootCause?: string;
  postmortemUrl?: string;
}

export interface ActiveRecoveryAction {
  actionId: string;
  incidentId: string;
  startTime: Date;
  estimatedDuration: number;
  status: 'running' | 'completed' | 'failed' | 'cancelled';
  progress: number; // 0-100%
  logs: string[];
}

export interface HealthPrediction {
  component: string;
  metric: string;
  predictedValue: number;
  confidence: number; // 0-100%
  timeHorizon: number; // minutes
  riskLevel: 'low' | 'medium' | 'high';
  recommendedActions: string[];
}

export interface CircuitBreaker {
  id: string;
  name: string;
  service: string;
  state: 'closed' | 'open' | 'half_open';
  failureThreshold: number;
  resetTimeout: number; // milliseconds
  failureCount: number;
  successCount: number;
  lastFailureTime?: Date;
  lastSuccessTime?: Date;
  nextAttemptTime?: Date;
  configuration: CircuitBreakerConfig;
}

export interface CircuitBreakerConfig {
  failureThreshold: number;
  resetTimeout: number;
  monitoringPeriod: number;
  expectedExceptions: string[];
  fallbackMethod?: string;
  metrics: {
    enabled: boolean;
    slidingWindowSize: number;
    minimumThroughput: number;
  };
}

export class ErrorRecoveryService extends EventEmitter {
  private errorPatterns: Map<string, ErrorPattern> = new Map();
  private recoveryActions: Map<string, RecoveryAction> = new Map();
  private circuitBreakers: Map<string, CircuitBreaker> = new Map();
  private incidents: Map<string, Incident> = new Map();
  private activeRecoveryActions: Map<string, ActiveRecoveryAction> = new Map();
  private healthHistory: SystemHealth[] = [];
  private monitoringInterval?: NodeJS.Timeout;

  constructor() {
    super();
    this.initializeDefaultPatterns();
    this.initializeDefaultActions();
    this.initializeCircuitBreakers();
    this.startHealthMonitoring();
  }

  private initializeDefaultPatterns(): void {
    const defaultPatterns: ErrorPattern[] = [
      {
        id: 'ai_timeout',
        type: 'timeout',
        pattern: 'AI request timeout after \\d+ seconds',
        frequency: 0,
        severity: 'high',
        recoveryActions: ['switch_ai_provider', 'increase_timeout', 'use_cached_response'],
        preventionMeasures: ['request_throttling', 'provider_health_check'],
        lastOccurrence: new Date(),
        trend: 'stable'
      },
      {
        id: 'memory_spike',
        type: 'memory_leak',
        pattern: 'Memory usage exceeded \\d+% threshold',
        frequency: 0,
        severity: 'critical',
        recoveryActions: ['garbage_collection', 'restart_service', 'scale_horizontally'],
        preventionMeasures: ['memory_monitoring', 'resource_limits'],
        lastOccurrence: new Date(),
        trend: 'stable'
      },
      {
        id: 'database_connection_loss',
        type: 'database_error',
        pattern: 'Database connection lost|Connection pool exhausted',
        frequency: 0,
        severity: 'critical',
        recoveryActions: ['reconnect_database', 'use_replica', 'clear_connection_pool'],
        preventionMeasures: ['connection_pooling', 'database_health_check'],
        lastOccurrence: new Date(),
        trend: 'stable'
      }
    ];

    defaultPatterns.forEach(pattern => {
      this.errorPatterns.set(pattern.id, pattern);
    });
  }

  private initializeDefaultActions(): void {
    const defaultActions: RecoveryAction[] = [
      {
        id: 'switch_ai_provider',
        name: 'Switch AI Provider',
        type: 'fallback',
        priority: 9,
        conditions: [
          { metric: 'ai_provider_error_rate', operator: 'gt', threshold: 20, timeWindow: 300 }
        ],
        implementation: 'aiRouter.switchToBackupProvider()',
        successRate: 85,
        averageExecutionTime: 1000,
        cooldownPeriod: 60,
        isEnabled: true
      },
      {
        id: 'restart_service',
        name: 'Restart Service',
        type: 'restart',
        priority: 6,
        conditions: [
          { metric: 'memory_usage', operator: 'gt', threshold: 90, timeWindow: 120 }
        ],
        implementation: 'systemctl restart claude-code-server',
        successRate: 95,
        averageExecutionTime: 30000,
        cooldownPeriod: 300,
        isEnabled: true
      },
      {
        id: 'scale_horizontally',
        name: 'Scale Horizontally',
        type: 'scaling',
        priority: 7,
        conditions: [
          { metric: 'cpu_usage', operator: 'gt', threshold: 80, timeWindow: 180 },
          { metric: 'response_time', operator: 'gt', threshold: 5000, timeWindow: 120 }
        ],
        implementation: 'kubernetes.scaleDeployment(replicas + 1)',
        successRate: 90,
        averageExecutionTime: 45000,
        cooldownPeriod: 600,
        isEnabled: true
      },
      {
        id: 'clear_connection_pool',
        name: 'Clear Database Connection Pool',
        type: 'cleanup',
        priority: 8,
        conditions: [
          { metric: 'db_connection_errors', operator: 'gt', threshold: 5, timeWindow: 60 }
        ],
        implementation: 'dbPool.clearConnections()',
        successRate: 80,
        averageExecutionTime: 5000,
        cooldownPeriod: 120,
        isEnabled: true
      }
    ];

    defaultActions.forEach(action => {
      this.recoveryActions.set(action.id, action);
    });
  }

  private initializeCircuitBreakers(): void {
    const defaultBreakers: CircuitBreaker[] = [
      {
        id: 'ai_provider_openai',
        name: 'OpenAI Circuit Breaker',
        service: 'openai_api',
        state: 'closed',
        failureThreshold: 5,
        resetTimeout: 60000,
        failureCount: 0,
        successCount: 0,
        configuration: {
          failureThreshold: 5,
          resetTimeout: 60000,
          monitoringPeriod: 30000,
          expectedExceptions: ['timeout', 'rate_limit', 'auth_error'],
          fallbackMethod: 'switchToAnthropicProvider',
          metrics: {
            enabled: true,
            slidingWindowSize: 100,
            minimumThroughput: 10
          }
        }
      },
      {
        id: 'database_primary',
        name: 'Primary Database Circuit Breaker',
        service: 'postgresql_primary',
        state: 'closed',
        failureThreshold: 3,
        resetTimeout: 30000,
        failureCount: 0,
        successCount: 0,
        configuration: {
          failureThreshold: 3,
          resetTimeout: 30000,
          monitoringPeriod: 15000,
          expectedExceptions: ['connection_error', 'timeout'],
          fallbackMethod: 'useReadReplica',
          metrics: {
            enabled: true,
            slidingWindowSize: 50,
            minimumThroughput: 5
          }
        }
      }
    ];

    defaultBreakers.forEach(breaker => {
      this.circuitBreakers.set(breaker.id, breaker);
    });
  }

  private startHealthMonitoring(): void {
    this.monitoringInterval = setInterval(async () => {
      await this.performHealthCheck();
    }, 30000); // Every 30 seconds
  }

  async performHealthCheck(): Promise<SystemHealth> {
    const components = await this.checkComponentHealth();
    const activeIncidents = Array.from(this.incidents.values()).filter(i => i.status !== 'resolved');
    const activeRecovery = Array.from(this.activeRecoveryActions.values());
    const predictions = await this.generateHealthPredictions();

    const overall = this.calculateOverallHealth(components);

    const health: SystemHealth = {
      timestamp: new Date(),
      overall,
      components,
      activeIncidents,
      recoveryActions: activeRecovery,
      predictions
    };

    this.healthHistory.push(health);
    
    // Keep only last 24 hours of health data
    const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
    this.healthHistory = this.healthHistory.filter(h => h.timestamp > cutoff);

    this.emit('health_check_completed', health);

    // Trigger recovery if issues detected
    if (overall === 'critical' || overall === 'degraded') {
      await this.triggerAutoRecovery(health);
    }

    return health;
  }

  private async checkComponentHealth(): Promise<ComponentHealth[]> {
    const components = ['api_server', 'database', 'redis', 'ai_router', 'websocket_server'];
    
    return Promise.all(components.map(async (component) => {
      try {
        const metrics = await this.getComponentMetrics(component);
        const issues = this.identifyIssues(component, metrics);
        
        let status: ComponentHealth['status'] = 'healthy';
        if (issues.some(i => i.includes('critical'))) status = 'error';
        else if (issues.some(i => i.includes('warning'))) status = 'warning';

        return {
          name: component,
          status,
          metrics,
          lastCheck: new Date(),
          issues
        };
      } catch (error) {
        return {
          name: component,
          status: 'down' as const,
          metrics: {
            cpu: 0,
            memory: 0,
            responseTime: 0,
            errorRate: 100,
            throughput: 0
          },
          lastCheck: new Date(),
          issues: [`Component unreachable: ${error}`]
        };
      }
    }));
  }

  private async getComponentMetrics(component: string): Promise<ComponentHealth['metrics']> {
    // Simulate metrics collection - in real implementation would connect to monitoring system
    return {
      cpu: Math.random() * 100,
      memory: Math.random() * 100,
      responseTime: Math.random() * 1000,
      errorRate: Math.random() * 10,
      throughput: Math.random() * 1000
    };
  }

  private identifyIssues(component: string, metrics: ComponentHealth['metrics']): string[] {
    const issues: string[] = [];

    if (metrics.cpu > 80) issues.push('High CPU usage - critical');
    else if (metrics.cpu > 60) issues.push('Elevated CPU usage - warning');

    if (metrics.memory > 85) issues.push('High memory usage - critical');
    else if (metrics.memory > 70) issues.push('Elevated memory usage - warning');

    if (metrics.responseTime > 5000) issues.push('High response time - critical');
    else if (metrics.responseTime > 2000) issues.push('Elevated response time - warning');

    if (metrics.errorRate > 5) issues.push('High error rate - critical');
    else if (metrics.errorRate > 2) issues.push('Elevated error rate - warning');

    return issues;
  }

  private calculateOverallHealth(components: ComponentHealth[]): SystemHealth['overall'] {
    const downComponents = components.filter(c => c.status === 'down');
    const errorComponents = components.filter(c => c.status === 'error');
    const warningComponents = components.filter(c => c.status === 'warning');

    if (downComponents.length > 0) return 'down';
    if (errorComponents.length > 0) return 'critical';
    if (warningComponents.length > 0) return 'degraded';
    
    return 'healthy';
  }

  private async generateHealthPredictions(): Promise<HealthPrediction[]> {
    const predictions: HealthPrediction[] = [];
    
    // Analyze trends from health history
    if (this.healthHistory.length >= 10) {
      const recent = this.healthHistory.slice(-10);
      
      // Predict CPU trend
      const cpuTrend = recent.map(h => h.components.reduce((sum, c) => sum + c.metrics.cpu, 0) / h.components.length);
      const cpuGrowth = (cpuTrend[cpuTrend.length - 1] - cpuTrend[0]) / cpuTrend.length;
      
      if (cpuGrowth > 2) {
        predictions.push({
          component: 'overall',
          metric: 'cpu_usage',
          predictedValue: cpuTrend[cpuTrend.length - 1] + (cpuGrowth * 6), // 3 minutes ahead
          confidence: 75,
          timeHorizon: 3,
          riskLevel: cpuGrowth > 5 ? 'high' : 'medium',
          recommendedActions: ['scale_horizontally', 'optimize_processes']
        });
      }
    }

    return predictions;
  }

  private async triggerAutoRecovery(health: SystemHealth): Promise<void> {
    for (const component of health.components) {
      if (component.status === 'error' || component.status === 'down') {
        const matchingActions = this.findMatchingActions(component);
        
        for (const action of matchingActions) {
          if (await this.shouldExecuteAction(action, component)) {
            await this.executeRecoveryAction(action, component);
          }
        }
      }
    }
  }

  private findMatchingActions(component: ComponentHealth): RecoveryAction[] {
    return Array.from(this.recoveryActions.values())
      .filter(action => action.isEnabled)
      .filter(action => this.actionConditionsMet(action, component))
      .sort((a, b) => b.priority - a.priority);
  }

  private actionConditionsMet(action: RecoveryAction, component: ComponentHealth): boolean {
    return action.conditions.every(condition => {
      const value = component.metrics[condition.metric as keyof ComponentHealth['metrics']];
      
      switch (condition.operator) {
        case 'gt': return value > condition.threshold;
        case 'gte': return value >= condition.threshold;
        case 'lt': return value < condition.threshold;
        case 'lte': return value <= condition.threshold;
        case 'eq': return value === condition.threshold;
        default: return false;
      }
    });
  }

  private async shouldExecuteAction(action: RecoveryAction, component: ComponentHealth): boolean {
    // Check cooldown period
    if (action.lastExecuted) {
      const timeSinceExecution = Date.now() - action.lastExecuted.getTime();
      if (timeSinceExecution < action.cooldownPeriod * 1000) {
        return false;
      }
    }

    // Check if similar action is already running
    const runningActions = Array.from(this.activeRecoveryActions.values())
      .filter(active => active.status === 'running');
    
    if (runningActions.some(running => running.actionId === action.id)) {
      return false;
    }

    return true;
  }

  private async executeRecoveryAction(action: RecoveryAction, component: ComponentHealth): Promise<void> {
    const incident = await this.createIncident(action, component);
    
    const activeAction: ActiveRecoveryAction = {
      actionId: action.id,
      incidentId: incident.id,
      startTime: new Date(),
      estimatedDuration: action.averageExecutionTime,
      status: 'running',
      progress: 0,
      logs: [`Starting recovery action: ${action.name}`]
    };

    this.activeRecoveryActions.set(`${action.id}_${Date.now()}`, activeAction);

    try {
      // Simulate action execution
      await this.simulateActionExecution(action, activeAction);
      
      activeAction.status = 'completed';
      activeAction.progress = 100;
      activeAction.logs.push('Recovery action completed successfully');
      
      action.lastExecuted = new Date();
      
      this.emit('recovery_action_completed', { action, activeAction, incident });
      
    } catch (error) {
      activeAction.status = 'failed';
      activeAction.logs.push(`Recovery action failed: ${error}`);
      
      this.emit('recovery_action_failed', { action, activeAction, incident, error });
    }
  }

  private async simulateActionExecution(action: RecoveryAction, activeAction: ActiveRecoveryAction): Promise<void> {
    const steps = 10;
    const stepDelay = action.averageExecutionTime / steps;
    
    for (let i = 1; i <= steps; i++) {
      await new Promise(resolve => setTimeout(resolve, stepDelay));
      activeAction.progress = (i / steps) * 100;
      activeAction.logs.push(`Progress: ${activeAction.progress.toFixed(1)}%`);
      
      // Simulate potential failure
      if (Math.random() > action.successRate / 100) {
        throw new Error(`Action failed at step ${i}`);
      }
    }
  }

  private async createIncident(action: RecoveryAction, component: ComponentHealth): Promise<Incident> {
    const incident: Incident = {
      id: this.generateId('incident'),
      title: `${component.name} Recovery Action: ${action.name}`,
      description: `Automatic recovery triggered for ${component.name} due to: ${component.issues.join(', ')}`,
      severity: component.status === 'down' ? 'critical' : 'high',
      status: 'investigating',
      affectedComponents: [component.name],
      startTime: new Date(),
      recoveryActions: [action.id]
    };

    this.incidents.set(incident.id, incident);

    this.emit('incident_created', incident);

    return incident;
  }

  // Circuit Breaker Methods
  async executeWithCircuitBreaker<T>(breakerId: string, operation: () => Promise<T>): Promise<T> {
    const breaker = this.circuitBreakers.get(breakerId);
    if (!breaker) {
      throw new Error(`Circuit breaker ${breakerId} not found`);
    }

    if (breaker.state === 'open') {
      if (Date.now() < (breaker.nextAttemptTime?.getTime() || 0)) {
        throw new Error(`Circuit breaker ${breakerId} is open`);
      } else {
        breaker.state = 'half_open';
      }
    }

    try {
      const result = await operation();
      await this.onOperationSuccess(breaker);
      return result;
    } catch (error) {
      await this.onOperationFailure(breaker);
      throw error;
    }
  }

  private async onOperationSuccess(breaker: CircuitBreaker): Promise<void> {
    breaker.successCount++;
    breaker.lastSuccessTime = new Date();

    if (breaker.state === 'half_open') {
      // If we've had enough successes, close the breaker
      if (breaker.successCount >= breaker.configuration.minimumThroughput) {
        breaker.state = 'closed';
        breaker.failureCount = 0;
        this.emit('circuit_breaker_closed', breaker);
      }
    }
  }

  private async onOperationFailure(breaker: CircuitBreaker): Promise<void> {
    breaker.failureCount++;
    breaker.lastFailureTime = new Date();

    if (breaker.state === 'closed' || breaker.state === 'half_open') {
      if (breaker.failureCount >= breaker.failureThreshold) {
        breaker.state = 'open';
        breaker.nextAttemptTime = new Date(Date.now() + breaker.resetTimeout);
        this.emit('circuit_breaker_opened', breaker);
      }
    }
  }

  // API Methods
  getSystemHealth(): SystemHealth | undefined {
    return this.healthHistory[this.healthHistory.length - 1];
  }

  getHealthHistory(hours: number = 24): SystemHealth[] {
    const cutoff = new Date(Date.now() - hours * 60 * 60 * 1000);
    return this.healthHistory.filter(h => h.timestamp > cutoff);
  }

  getAllIncidents(): Incident[] {
    return Array.from(this.incidents.values());
  }

  getActiveIncidents(): Incident[] {
    return Array.from(this.incidents.values()).filter(i => i.status !== 'resolved');
  }

  getCircuitBreakerStatus(): CircuitBreaker[] {
    return Array.from(this.circuitBreakers.values());
  }

  async resolveIncident(incidentId: string, rootCause?: string, postmortemUrl?: string): Promise<Incident> {
    const incident = this.incidents.get(incidentId);
    if (!incident) {
      throw new Error('Incident not found');
    }

    incident.status = 'resolved';
    incident.resolvedTime = new Date();
    incident.rootCause = rootCause;
    incident.postmortemUrl = postmortemUrl;

    this.incidents.set(incidentId, incident);

    this.emit('incident_resolved', incident);

    return incident;
  }

  private generateId(prefix: string): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  destroy(): void {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
    }
  }
}