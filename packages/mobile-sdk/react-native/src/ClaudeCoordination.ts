import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';
import DeviceInfo from 'react-native-device-info';
import Keychain from 'react-native-keychain';
import { io, Socket } from 'socket.io-client';
import { v4 as uuidv4 } from 'uuid';
import { EventEmitter } from 'events';
import BackgroundTask from 'react-native-background-task';

export interface ClaudeCoordinationConfig {
  apiUrl: string;
  wsUrl?: string;
  apiKey?: string;
  enableOfflineMode?: boolean;
  enableBackgroundSync?: boolean;
  cacheSize?: number;
  syncInterval?: number;
  retryAttempts?: number;
  timeout?: number;
  enableAnalytics?: boolean;
  enablePushNotifications?: boolean;
  environment?: 'development' | 'staging' | 'production';
  logLevel?: 'debug' | 'info' | 'warn' | 'error';
}

export interface AIAgent {
  id: string;
  name: string;
  type: 'claude' | 'gpt4' | 'gemini' | 'custom';
  capabilities: string[];
  status: 'available' | 'busy' | 'offline';
  performance: {
    successRate: number;
    averageResponseTime: number;
    tasksCompleted: number;
  };
  metadata: Record<string, any>;
}

export interface Task {
  id: string;
  title: string;
  description: string;
  type: 'development' | 'analysis' | 'testing' | 'deployment' | 'review';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'pending' | 'in_progress' | 'completed' | 'failed' | 'cancelled';
  assignedAgents: string[];
  files?: string[];
  requirements?: string[];
  estimatedDuration?: number;
  actualDuration?: number;
  progress: number;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;
  metadata: Record<string, any>;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  status: 'active' | 'paused' | 'completed' | 'archived';
  members: string[];
  tasks: Task[];
  settings: {
    allowedAgents: string[];
    autoAssignment: boolean;
    notifications: boolean;
    qualityGates: boolean;
  };
  metrics: {
    totalTasks: number;
    completedTasks: number;
    averageCompletionTime: number;
    successRate: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface MobileAnalytics {
  sessionId: string;
  userId?: string;
  deviceInfo: {
    model: string;
    brand: string;
    systemVersion: string;
    appVersion: string;
    screenDimensions: {
      width: number;
      height: number;
    };
    isTablet: boolean;
    carrier?: string;
    timezone: string;
  };
  networkInfo: {
    type: string;
    isConnected: boolean;
    strength?: number;
  };
  performance: {
    appStartTime: number;
    memoryUsage: number;
    batteryLevel?: number;
    thermalState?: string;
  };
  usage: {
    screenViews: { screen: string; timestamp: Date; duration: number }[];
    actions: { action: string; timestamp: Date; metadata?: any }[];
    errors: { error: string; timestamp: Date; stackTrace?: string }[];
  };
}

export class ClaudeCoordination extends EventEmitter {
  private config: ClaudeCoordinationConfig;
  private socket: Socket | null = null;
  private isInitialized: boolean = false;
  private isOnline: boolean = true;
  private syncQueue: any[] = [];
  private cache: Map<string, any> = new Map();
  private sessionId: string;
  private analytics: MobileAnalytics;
  private backgroundTaskId: number = 0;

  constructor(config: ClaudeCoordinationConfig) {
    super();
    this.config = {
      enableOfflineMode: true,
      enableBackgroundSync: true,
      cacheSize: 100,
      syncInterval: 30000, // 30 seconds
      retryAttempts: 3,
      timeout: 30000, // 30 seconds
      enableAnalytics: true,
      enablePushNotifications: true,
      environment: 'production',
      logLevel: 'info',
      ...config
    };
    
    this.sessionId = uuidv4();
    this.analytics = this.initializeAnalytics();
    this.setupNetworkMonitoring();
  }

  private async initializeAnalytics(): Promise<MobileAnalytics> {
    const deviceInfo = {
      model: await DeviceInfo.getModel(),
      brand: await DeviceInfo.getBrand(),
      systemVersion: await DeviceInfo.getSystemVersion(),
      appVersion: await DeviceInfo.getVersion(),
      screenDimensions: {
        width: await DeviceInfo.getScreenWidth(),
        height: await DeviceInfo.getScreenHeight()
      },
      isTablet: await DeviceInfo.isTablet(),
      carrier: await DeviceInfo.getCarrier(),
      timezone: await DeviceInfo.getTimezone()
    };

    const netInfo = await NetInfo.fetch();
    const networkInfo = {
      type: netInfo.type || 'unknown',
      isConnected: netInfo.isConnected || false,
      strength: netInfo.details && 'strength' in netInfo.details ? netInfo.details.strength : undefined
    };

    return {
      sessionId: this.sessionId,
      deviceInfo,
      networkInfo,
      performance: {
        appStartTime: Date.now(),
        memoryUsage: await DeviceInfo.getUsedMemory(),
        batteryLevel: await DeviceInfo.getBatteryLevel(),
        thermalState: await DeviceInfo.getPowerState().then(state => state.thermalState)
      },
      usage: {
        screenViews: [],
        actions: [],
        errors: []
      }
    };
  }

  private setupNetworkMonitoring(): void {
    NetInfo.addEventListener(state => {
      const wasOnline = this.isOnline;
      this.isOnline = state.isConnected || false;
      
      this.analytics.networkInfo = {
        type: state.type || 'unknown',
        isConnected: this.isOnline,
        strength: state.details && 'strength' in state.details ? state.details.strength : undefined
      };

      if (!wasOnline && this.isOnline) {
        this.emit('online');
        this.syncOfflineData();
      } else if (wasOnline && !this.isOnline) {
        this.emit('offline');
      }
    });
  }

  async initialize(): Promise<void> {
    try {
      this.log('info', 'Initializing Claude Coordination SDK...');
      
      // Load cached configuration and data
      await this.loadCachedData();
      
      // Initialize secure storage
      await this.initializeSecureStorage();
      
      // Connect to WebSocket if online
      if (this.isOnline) {
        await this.connectWebSocket();
      }
      
      // Start background sync if enabled
      if (this.config.enableBackgroundSync) {
        this.startBackgroundSync();
      }
      
      // Initialize analytics
      if (this.config.enableAnalytics) {
        this.startAnalytics();
      }

      this.isInitialized = true;
      this.emit('initialized');
      
      this.log('info', 'Claude Coordination SDK initialized successfully');
      
    } catch (error) {
      this.log('error', 'Failed to initialize SDK:', error);
      this.emit('error', error);
      throw error;
    }
  }

  private async loadCachedData(): Promise<void> {
    try {
      const cachedData = await AsyncStorage.getItem('claude_coordination_cache');
      if (cachedData) {
        const parsed = JSON.parse(cachedData);
        Object.entries(parsed).forEach(([key, value]) => {
          this.cache.set(key, value);
        });
        this.log('debug', `Loaded ${this.cache.size} cached items`);
      }
    } catch (error) {
      this.log('warn', 'Failed to load cached data:', error);
    }
  }

  private async initializeSecureStorage(): Promise<void> {
    try {
      if (this.config.apiKey) {
        await Keychain.setInternetCredentials(
          'claude_coordination_api',
          'api_key',
          this.config.apiKey
        );
      }
    } catch (error) {
      this.log('warn', 'Failed to initialize secure storage:', error);
    }
  }

  private async connectWebSocket(): Promise<void> {
    if (!this.config.wsUrl) return;

    try {
      this.socket = io(this.config.wsUrl, {
        timeout: this.config.timeout,
        forceNew: true,
        transports: ['websocket', 'polling']
      });

      this.socket.on('connect', () => {
        this.log('info', 'WebSocket connected');
        this.emit('connected');
      });

      this.socket.on('disconnect', () => {
        this.log('info', 'WebSocket disconnected');
        this.emit('disconnected');
      });

      this.socket.on('task_updated', (task: Task) => {
        this.handleTaskUpdate(task);
      });

      this.socket.on('agent_status_changed', (agent: AIAgent) => {
        this.handleAgentStatusChange(agent);
      });

      this.socket.on('project_updated', (project: Project) => {
        this.handleProjectUpdate(project);
      });

      this.socket.on('notification', (notification: any) => {
        this.handleNotification(notification);
      });

    } catch (error) {
      this.log('error', 'Failed to connect WebSocket:', error);
      this.emit('connection_error', error);
    }
  }

  private startBackgroundSync(): void {
    this.backgroundTaskId = BackgroundTask.define(() => {
      this.log('debug', 'Running background sync...');
      this.syncOfflineData()
        .then(() => {
          this.log('debug', 'Background sync completed');
          BackgroundTask.finish(this.backgroundTaskId);
        })
        .catch(error => {
          this.log('error', 'Background sync failed:', error);
          BackgroundTask.finish(this.backgroundTaskId);
        });
    });
  }

  private startAnalytics(): void {
    // Track app lifecycle events
    setInterval(() => {
      this.updatePerformanceMetrics();
    }, 60000); // Every minute

    // Auto-flush analytics every 5 minutes
    setInterval(() => {
      this.flushAnalytics();
    }, 300000);
  }

  private async updatePerformanceMetrics(): Promise<void> {
    try {
      this.analytics.performance = {
        ...this.analytics.performance,
        memoryUsage: await DeviceInfo.getUsedMemory(),
        batteryLevel: await DeviceInfo.getBatteryLevel()
      };
    } catch (error) {
      this.log('warn', 'Failed to update performance metrics:', error);
    }
  }

  // Public API Methods

  async getAvailableAgents(): Promise<AIAgent[]> {
    try {
      const cacheKey = 'available_agents';
      
      // Return cached data if offline
      if (!this.isOnline && this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey);
      }

      const response = await this.apiRequest('GET', '/api/ai/agents');
      const agents = response.data.agents;
      
      // Cache the result
      this.cache.set(cacheKey, agents);
      await this.saveCacheToStorage();
      
      return agents;
      
    } catch (error) {
      this.log('error', 'Failed to get available agents:', error);
      
      // Return cached data as fallback
      const cacheKey = 'available_agents';
      if (this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey);
      }
      
      throw error;
    }
  }

  async createTask(taskData: Omit<Task, 'id' | 'status' | 'progress' | 'createdAt' | 'updatedAt'>): Promise<Task> {
    try {
      const task: Task = {
        ...taskData,
        id: uuidv4(),
        status: 'pending',
        progress: 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      if (this.isOnline) {
        const response = await this.apiRequest('POST', '/api/tasks', task);
        const createdTask = response.data.task;
        
        this.emit('task_created', createdTask);
        this.trackAction('task_created', { taskId: createdTask.id, type: createdTask.type });
        
        return createdTask;
      } else {
        // Queue for offline sync
        this.syncQueue.push({
          action: 'create_task',
          data: task,
          timestamp: Date.now()
        });
        
        this.emit('task_queued', task);
        return task;
      }
      
    } catch (error) {
      this.log('error', 'Failed to create task:', error);
      this.trackError('task_creation_failed', error);
      throw error;
    }
  }

  async assignTask(taskId: string, agentIds: string[]): Promise<void> {
    try {
      const assignmentData = { taskId, agentIds };
      
      if (this.isOnline) {
        await this.apiRequest('POST', `/api/tasks/${taskId}/assign`, { agentIds });
        this.emit('task_assigned', assignmentData);
        this.trackAction('task_assigned', assignmentData);
      } else {
        this.syncQueue.push({
          action: 'assign_task',
          data: assignmentData,
          timestamp: Date.now()
        });
      }
      
    } catch (error) {
      this.log('error', 'Failed to assign task:', error);
      this.trackError('task_assignment_failed', error);
      throw error;
    }
  }

  async getProjects(): Promise<Project[]> {
    try {
      const cacheKey = 'user_projects';
      
      if (!this.isOnline && this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey);
      }

      const response = await this.apiRequest('GET', '/api/projects');
      const projects = response.data.projects;
      
      this.cache.set(cacheKey, projects);
      await this.saveCacheToStorage();
      
      return projects;
      
    } catch (error) {
      this.log('error', 'Failed to get projects:', error);
      
      const cacheKey = 'user_projects';
      if (this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey);
      }
      
      throw error;
    }
  }

  async getTasks(projectId?: string): Promise<Task[]> {
    try {
      const endpoint = projectId ? `/api/projects/${projectId}/tasks` : '/api/tasks';
      const cacheKey = `tasks_${projectId || 'all'}`;
      
      if (!this.isOnline && this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey);
      }

      const response = await this.apiRequest('GET', endpoint);
      const tasks = response.data.tasks;
      
      this.cache.set(cacheKey, tasks);
      await this.saveCacheToStorage();
      
      return tasks;
      
    } catch (error) {
      this.log('error', 'Failed to get tasks:', error);
      
      const cacheKey = `tasks_${projectId || 'all'}`;
      if (this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey);
      }
      
      throw error;
    }
  }

  async getTaskStatus(taskId: string): Promise<Task> {
    try {
      const response = await this.apiRequest('GET', `/api/tasks/${taskId}`);
      const task = response.data.task;
      
      // Update cache
      this.cache.set(`task_${taskId}`, task);
      
      return task;
      
    } catch (error) {
      this.log('error', `Failed to get task status for ${taskId}:`, error);
      
      // Return cached data as fallback
      const cacheKey = `task_${taskId}`;
      if (this.cache.has(cacheKey)) {
        return this.cache.get(cacheKey);
      }
      
      throw error;
    }
  }

  async cancelTask(taskId: string): Promise<void> {
    try {
      if (this.isOnline) {
        await this.apiRequest('POST', `/api/tasks/${taskId}/cancel`);
        this.emit('task_cancelled', { taskId });
        this.trackAction('task_cancelled', { taskId });
      } else {
        this.syncQueue.push({
          action: 'cancel_task',
          data: { taskId },
          timestamp: Date.now()
        });
      }
      
    } catch (error) {
      this.log('error', 'Failed to cancel task:', error);
      this.trackError('task_cancellation_failed', error);
      throw error;
    }
  }

  // Analytics and Tracking
  trackScreenView(screenName: string): void {
    const now = new Date();
    const lastView = this.analytics.usage.screenViews[this.analytics.usage.screenViews.length - 1];
    
    if (lastView) {
      lastView.duration = now.getTime() - lastView.timestamp.getTime();
    }
    
    this.analytics.usage.screenViews.push({
      screen: screenName,
      timestamp: now,
      duration: 0
    });
    
    this.log('debug', `Screen view tracked: ${screenName}`);
  }

  trackAction(action: string, metadata?: any): void {
    this.analytics.usage.actions.push({
      action,
      timestamp: new Date(),
      metadata
    });
    
    this.log('debug', `Action tracked: ${action}`, metadata);
  }

  trackError(error: string, errorObject?: any): void {
    this.analytics.usage.errors.push({
      error,
      timestamp: new Date(),
      stackTrace: errorObject?.stack
    });
    
    this.log('debug', `Error tracked: ${error}`);
  }

  private async flushAnalytics(): Promise<void> {
    if (!this.config.enableAnalytics || !this.isOnline) return;
    
    try {
      await this.apiRequest('POST', '/api/analytics/mobile', this.analytics);
      
      // Reset usage data after successful flush
      this.analytics.usage = {
        screenViews: [],
        actions: [],
        errors: []
      };
      
      this.log('debug', 'Analytics flushed successfully');
      
    } catch (error) {
      this.log('warn', 'Failed to flush analytics:', error);
    }
  }

  // Offline Support
  private async syncOfflineData(): Promise<void> {
    if (!this.isOnline || this.syncQueue.length === 0) return;
    
    this.log('info', `Syncing ${this.syncQueue.length} queued items...`);
    
    const itemsToSync = [...this.syncQueue];
    this.syncQueue = [];
    
    for (const item of itemsToSync) {
      try {
        await this.processSyncItem(item);
      } catch (error) {
        this.log('error', 'Failed to sync item:', error);
        // Re-queue failed items
        this.syncQueue.push(item);
      }
    }
  }

  private async processSyncItem(item: any): Promise<void> {
    switch (item.action) {
      case 'create_task':
        await this.apiRequest('POST', '/api/tasks', item.data);
        this.emit('task_synced', item.data);
        break;
        
      case 'assign_task':
        await this.apiRequest('POST', `/api/tasks/${item.data.taskId}/assign`, {
          agentIds: item.data.agentIds
        });
        this.emit('task_assignment_synced', item.data);
        break;
        
      case 'cancel_task':
        await this.apiRequest('POST', `/api/tasks/${item.data.taskId}/cancel`);
        this.emit('task_cancellation_synced', item.data);
        break;
        
      default:
        this.log('warn', `Unknown sync action: ${item.action}`);
    }
  }

  // Event Handlers
  private handleTaskUpdate(task: Task): void {
    this.cache.set(`task_${task.id}`, task);
    this.emit('task_updated', task);
    
    if (task.status === 'completed') {
      this.emit('task_completed', task);
    } else if (task.status === 'failed') {
      this.emit('task_failed', task);
    }
  }

  private handleAgentStatusChange(agent: AIAgent): void {
    this.cache.set(`agent_${agent.id}`, agent);
    this.emit('agent_status_changed', agent);
  }

  private handleProjectUpdate(project: Project): void {
    this.cache.set(`project_${project.id}`, project);
    this.emit('project_updated', project);
  }

  private handleNotification(notification: any): void {
    this.emit('notification', notification);
    
    // Show local notification if enabled
    if (this.config.enablePushNotifications) {
      this.showLocalNotification(notification);
    }
  }

  private showLocalNotification(notification: any): void {
    // Implementation would depend on chosen push notification library
    this.log('info', 'Notification received:', notification.title);
  }

  // Utility Methods
  private async apiRequest(method: string, endpoint: string, data?: any): Promise<any> {
    const credentials = await Keychain.getInternetCredentials('claude_coordination_api');
    const apiKey = credentials ? credentials.password : this.config.apiKey;
    
    const url = `${this.config.apiUrl}${endpoint}`;
    const options: RequestInit = {
      method,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`,
        'User-Agent': `ClaudeCoordination-ReactNative/3.0.0`,
        'X-Session-ID': this.sessionId
      },
      body: data ? JSON.stringify(data) : undefined
    };

    const response = await fetch(url, options);
    
    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }
    
    return await response.json();
  }

  private async saveCacheToStorage(): Promise<void> {
    try {
      const cacheObject = Object.fromEntries(this.cache.entries());
      await AsyncStorage.setItem('claude_coordination_cache', JSON.stringify(cacheObject));
    } catch (error) {
      this.log('warn', 'Failed to save cache to storage:', error);
    }
  }

  private log(level: string, message: string, ...args: any[]): void {
    if (this.shouldLog(level)) {
      console[level as keyof Console](`[ClaudeCoordination] ${message}`, ...args);
    }
  }

  private shouldLog(level: string): boolean {
    const levels = { debug: 0, info: 1, warn: 2, error: 3 };
    const configLevel = levels[this.config.logLevel || 'info'];
    const messageLevel = levels[level as keyof typeof levels];
    return messageLevel >= configLevel;
  }

  // Cleanup
  async destroy(): Promise<void> {
    this.log('info', 'Destroying Claude Coordination SDK...');
    
    // Flush any remaining analytics
    if (this.config.enableAnalytics) {
      await this.flushAnalytics();
    }
    
    // Disconnect WebSocket
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
    
    // Stop background tasks
    if (this.backgroundTaskId) {
      BackgroundTask.finish(this.backgroundTaskId);
    }
    
    // Save cache
    await this.saveCacheToStorage();
    
    // Remove all listeners
    this.removeAllListeners();
    
    this.isInitialized = false;
    this.log('info', 'Claude Coordination SDK destroyed');
  }

  // Getters
  get isConnected(): boolean {
    return this.socket?.connected || false;
  }

  get isOfflineMode(): boolean {
    return !this.isOnline;
  }

  get queuedItemsCount(): number {
    return this.syncQueue.length;
  }

  get cacheSize(): number {
    return this.cache.size;
  }

  get sessionAnalytics(): MobileAnalytics {
    return { ...this.analytics };
  }
}