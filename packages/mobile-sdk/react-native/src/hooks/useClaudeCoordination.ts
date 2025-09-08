import { useState, useEffect, useCallback, useRef } from 'react';
import { AppState, AppStateStatus, NetInfo } from 'react-native';
import { ClaudeCoordination, ClaudeCoordinationConfig, Task, AIAgent, Project } from '../ClaudeCoordination';

interface UseClaudeCoordinationOptions {
  config: ClaudeCoordinationConfig;
  autoConnect?: boolean;
  enableBackgroundMode?: boolean;
  pollingInterval?: number;
}

interface ClaudeCoordinationState {
  isInitialized: boolean;
  isConnected: boolean;
  isOnline: boolean;
  isLoading: boolean;
  error: string | null;
  agents: AIAgent[];
  tasks: Task[];
  projects: Project[];
  queuedItems: number;
  connectionStatus: 'connecting' | 'connected' | 'disconnected' | 'error';
}

interface ClaudeCoordinationActions {
  initialize: () => Promise<void>;
  disconnect: () => Promise<void>;
  createTask: (taskData: Omit<Task, 'id' | 'status' | 'progress' | 'createdAt' | 'updatedAt'>) => Promise<Task>;
  assignTask: (taskId: string, agentIds: string[]) => Promise<void>;
  cancelTask: (taskId: string) => Promise<void>;
  refreshAgents: () => Promise<void>;
  refreshTasks: (projectId?: string) => Promise<void>;
  refreshProjects: () => Promise<void>;
  getTaskStatus: (taskId: string) => Promise<Task>;
  trackScreenView: (screenName: string) => void;
  trackAction: (action: string, metadata?: any) => void;
  clearError: () => void;
}

export const useClaudeCoordination = (
  options: UseClaudeCoordinationOptions
): [ClaudeCoordinationState, ClaudeCoordinationActions] => {
  const {
    config,
    autoConnect = true,
    enableBackgroundMode = true,
    pollingInterval = 30000, // 30 seconds
  } = options;

  const claudeRef = useRef<ClaudeCoordination | null>(null);
  const pollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const appStateRef = useRef<AppStateStatus>('active');

  const [state, setState] = useState<ClaudeCoordinationState>({
    isInitialized: false,
    isConnected: false,
    isOnline: true,
    isLoading: false,
    error: null,
    agents: [],
    tasks: [],
    projects: [],
    queuedItems: 0,
    connectionStatus: 'disconnected',
  });

  // Initialize Claude Coordination
  const initialize = useCallback(async () => {
    if (claudeRef.current) return;

    try {
      setState(prev => ({ ...prev, isLoading: true, error: null, connectionStatus: 'connecting' }));

      const claude = new ClaudeCoordination(config);
      claudeRef.current = claude;

      // Set up event listeners
      claude.on('initialized', () => {
        setState(prev => ({
          ...prev,
          isInitialized: true,
          isLoading: false,
          connectionStatus: 'connected',
        }));
      });

      claude.on('connected', () => {
        setState(prev => ({ ...prev, isConnected: true, connectionStatus: 'connected' }));
      });

      claude.on('disconnected', () => {
        setState(prev => ({ ...prev, isConnected: false, connectionStatus: 'disconnected' }));
      });

      claude.on('online', () => {
        setState(prev => ({ ...prev, isOnline: true }));
      });

      claude.on('offline', () => {
        setState(prev => ({ ...prev, isOnline: false }));
      });

      claude.on('error', (error: Error) => {
        setState(prev => ({
          ...prev,
          error: error.message,
          isLoading: false,
          connectionStatus: 'error',
        }));
      });

      claude.on('connection_error', (error: Error) => {
        setState(prev => ({
          ...prev,
          error: `Connection failed: ${error.message}`,
          connectionStatus: 'error',
        }));
      });

      // Task events
      claude.on('task_created', (task: Task) => {
        setState(prev => ({
          ...prev,
          tasks: [...prev.tasks, task],
        }));
      });

      claude.on('task_updated', (task: Task) => {
        setState(prev => ({
          ...prev,
          tasks: prev.tasks.map(t => t.id === task.id ? task : t),
        }));
      });

      claude.on('task_completed', (task: Task) => {
        setState(prev => ({
          ...prev,
          tasks: prev.tasks.map(t => t.id === task.id ? task : t),
        }));
      });

      claude.on('task_failed', (task: Task) => {
        setState(prev => ({
          ...prev,
          tasks: prev.tasks.map(t => t.id === task.id ? task : t),
        }));
      });

      // Agent events
      claude.on('agent_status_changed', (agent: AIAgent) => {
        setState(prev => ({
          ...prev,
          agents: prev.agents.map(a => a.id === agent.id ? agent : a),
        }));
      });

      // Project events
      claude.on('project_updated', (project: Project) => {
        setState(prev => ({
          ...prev,
          projects: prev.projects.map(p => p.id === project.id ? project : p),
        }));
      });

      // Sync events
      claude.on('task_queued', () => {
        setState(prev => ({
          ...prev,
          queuedItems: claude.queuedItemsCount,
        }));
      });

      claude.on('task_synced', () => {
        setState(prev => ({
          ...prev,
          queuedItems: claude.queuedItemsCount,
        }));
      });

      // Initialize the SDK
      await claude.initialize();

      // Load initial data
      await loadInitialData(claude);

      // Start polling if enabled
      if (pollingInterval > 0) {
        startPolling();
      }

    } catch (error) {
      setState(prev => ({
        ...prev,
        error: error instanceof Error ? error.message : 'Failed to initialize',
        isLoading: false,
        connectionStatus: 'error',
      }));
      claudeRef.current = null;
      throw error;
    }
  }, [config, pollingInterval]);

  // Load initial data
  const loadInitialData = async (claude: ClaudeCoordination) => {
    try {
      const [agents, tasks, projects] = await Promise.allSettled([
        claude.getAvailableAgents(),
        claude.getTasks(),
        claude.getProjects(),
      ]);

      setState(prev => ({
        ...prev,
        agents: agents.status === 'fulfilled' ? agents.value : prev.agents,
        tasks: tasks.status === 'fulfilled' ? tasks.value : prev.tasks,
        projects: projects.status === 'fulfilled' ? projects.value : prev.projects,
        queuedItems: claude.queuedItemsCount,
      }));
    } catch (error) {
      console.warn('Failed to load initial data:', error);
    }
  };

  // Start polling for updates
  const startPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
    }

    pollingIntervalRef.current = setInterval(async () => {
      if (!claudeRef.current || !state.isInitialized || appStateRef.current !== 'active') {
        return;
      }

      try {
        const [agents, tasks] = await Promise.allSettled([
          claudeRef.current.getAvailableAgents(),
          claudeRef.current.getTasks(),
        ]);

        setState(prev => ({
          ...prev,
          agents: agents.status === 'fulfilled' ? agents.value : prev.agents,
          tasks: tasks.status === 'fulfilled' ? tasks.value : prev.tasks,
          queuedItems: claudeRef.current?.queuedItemsCount || 0,
        }));
      } catch (error) {
        console.warn('Polling error:', error);
      }
    }, pollingInterval);
  }, [pollingInterval, state.isInitialized]);

  // Stop polling
  const stopPolling = useCallback(() => {
    if (pollingIntervalRef.current) {
      clearInterval(pollingIntervalRef.current);
      pollingIntervalRef.current = null;
    }
  }, []);

  // Disconnect
  const disconnect = useCallback(async () => {
    if (!claudeRef.current) return;

    try {
      stopPolling();
      await claudeRef.current.destroy();
      claudeRef.current = null;

      setState({
        isInitialized: false,
        isConnected: false,
        isOnline: true,
        isLoading: false,
        error: null,
        agents: [],
        tasks: [],
        projects: [],
        queuedItems: 0,
        connectionStatus: 'disconnected',
      });
    } catch (error) {
      console.warn('Disconnect error:', error);
    }
  }, [stopPolling]);

  // Actions
  const createTask = useCallback(async (taskData: Omit<Task, 'id' | 'status' | 'progress' | 'createdAt' | 'updatedAt'>) => {
    if (!claudeRef.current) throw new Error('SDK not initialized');
    return await claudeRef.current.createTask(taskData);
  }, []);

  const assignTask = useCallback(async (taskId: string, agentIds: string[]) => {
    if (!claudeRef.current) throw new Error('SDK not initialized');
    return await claudeRef.current.assignTask(taskId, agentIds);
  }, []);

  const cancelTask = useCallback(async (taskId: string) => {
    if (!claudeRef.current) throw new Error('SDK not initialized');
    return await claudeRef.current.cancelTask(taskId);
  }, []);

  const refreshAgents = useCallback(async () => {
    if (!claudeRef.current) throw new Error('SDK not initialized');
    
    try {
      const agents = await claudeRef.current.getAvailableAgents();
      setState(prev => ({ ...prev, agents }));
    } catch (error) {
      console.warn('Failed to refresh agents:', error);
      throw error;
    }
  }, []);

  const refreshTasks = useCallback(async (projectId?: string) => {
    if (!claudeRef.current) throw new Error('SDK not initialized');
    
    try {
      const tasks = await claudeRef.current.getTasks(projectId);
      setState(prev => ({ ...prev, tasks }));
    } catch (error) {
      console.warn('Failed to refresh tasks:', error);
      throw error;
    }
  }, []);

  const refreshProjects = useCallback(async () => {
    if (!claudeRef.current) throw new Error('SDK not initialized');
    
    try {
      const projects = await claudeRef.current.getProjects();
      setState(prev => ({ ...prev, projects }));
    } catch (error) {
      console.warn('Failed to refresh projects:', error);
      throw error;
    }
  }, []);

  const getTaskStatus = useCallback(async (taskId: string) => {
    if (!claudeRef.current) throw new Error('SDK not initialized');
    return await claudeRef.current.getTaskStatus(taskId);
  }, []);

  const trackScreenView = useCallback((screenName: string) => {
    claudeRef.current?.trackScreenView(screenName);
  }, []);

  const trackAction = useCallback((action: string, metadata?: any) => {
    claudeRef.current?.trackAction(action, metadata);
  }, []);

  const clearError = useCallback(() => {
    setState(prev => ({ ...prev, error: null }));
  }, []);

  // Handle app state changes
  useEffect(() => {
    const handleAppStateChange = (nextAppState: AppStateStatus) => {
      const previousAppState = appStateRef.current;
      appStateRef.current = nextAppState;

      if (enableBackgroundMode && claudeRef.current) {
        if (nextAppState === 'active' && previousAppState.match(/inactive|background/)) {
          // App came to foreground - resume polling and sync
          startPolling();
          if (state.isOnline) {
            loadInitialData(claudeRef.current);
          }
        } else if (nextAppState.match(/inactive|background/)) {
          // App went to background - reduce polling frequency or stop
          stopPolling();
        }
      }
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription?.remove();
  }, [enableBackgroundMode, startPolling, stopPolling, state.isOnline]);

  // Auto-connect on mount
  useEffect(() => {
    if (autoConnect) {
      initialize().catch(console.error);
    }

    return () => {
      disconnect().catch(console.error);
    };
  }, [autoConnect, initialize, disconnect]);

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      stopPolling();
      if (claudeRef.current) {
        claudeRef.current.destroy().catch(console.error);
      }
    };
  }, [stopPolling]);

  const actions: ClaudeCoordinationActions = {
    initialize,
    disconnect,
    createTask,
    assignTask,
    cancelTask,
    refreshAgents,
    refreshTasks,
    refreshProjects,
    getTaskStatus,
    trackScreenView,
    trackAction,
    clearError,
  };

  return [state, actions];
};

export default useClaudeCoordination;