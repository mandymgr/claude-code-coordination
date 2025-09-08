import { Platform, Dimensions, PixelRatio } from 'react-native';
import { Task, AIAgent, Project } from '../ClaudeCoordination';
import { COLORS, TASK_STATUS, TASK_PRIORITY, AGENT_STATUS } from './constants';

// Device Information
export const getDeviceInfo = () => {
  const { width, height } = Dimensions.get('window');
  const scale = PixelRatio.get();
  const pixelDensity = PixelRatio.getFontScale();

  return {
    width,
    height,
    scale,
    pixelDensity,
    isTablet: width >= 768,
    isSmallScreen: width < 375,
    platform: Platform.OS,
    version: Platform.Version,
  };
};

// Screen Size Utilities
export const isTablet = (): boolean => {
  const { width, height } = Dimensions.get('window');
  const aspectRatio = height / width;
  return Math.min(width, height) >= 600 && aspectRatio < 1.6;
};

export const getScreenCategory = (): 'small' | 'medium' | 'large' | 'xlarge' => {
  const { width } = Dimensions.get('window');
  
  if (width < 375) return 'small';
  if (width < 414) return 'medium';
  if (width < 768) return 'large';
  return 'xlarge';
};

// Color Utilities
export const getStatusColor = (status: Task['status'] | AIAgent['status']): string => {
  switch (status) {
    case TASK_STATUS.PENDING:
    case AGENT_STATUS.OFFLINE:
      return COLORS.WARNING;
    case TASK_STATUS.IN_PROGRESS:
    case AGENT_STATUS.BUSY:
      return COLORS.INFO;
    case TASK_STATUS.COMPLETED:
    case AGENT_STATUS.AVAILABLE:
      return COLORS.SUCCESS;
    case TASK_STATUS.FAILED:
    case TASK_STATUS.CANCELLED:
      return COLORS.ERROR;
    default:
      return COLORS.SECONDARY;
  }
};

export const getPriorityColor = (priority: Task['priority']): string => {
  switch (priority) {
    case TASK_PRIORITY.LOW:
      return COLORS.LOW_PRIORITY;
    case TASK_PRIORITY.MEDIUM:
      return COLORS.MEDIUM_PRIORITY;
    case TASK_PRIORITY.HIGH:
      return COLORS.HIGH_PRIORITY;
    case TASK_PRIORITY.URGENT:
      return COLORS.URGENT_PRIORITY;
    default:
      return COLORS.SECONDARY;
  }
};

export const getAgentTypeColor = (type: AIAgent['type']): string => {
  switch (type) {
    case 'claude':
      return COLORS.CLAUDE;
    case 'gpt4':
      return COLORS.GPT4;
    case 'gemini':
      return COLORS.GEMINI;
    case 'custom':
      return COLORS.CUSTOM;
    default:
      return COLORS.SECONDARY;
  }
};

export const getTaskTypeColor = (type: Task['type']): string => {
  switch (type) {
    case 'development':
      return COLORS.DEVELOPMENT;
    case 'analysis':
      return COLORS.ANALYSIS;
    case 'testing':
      return COLORS.TESTING;
    case 'deployment':
      return COLORS.DEPLOYMENT;
    case 'review':
      return COLORS.REVIEW;
    default:
      return COLORS.SECONDARY;
  }
};

// Time Formatting
export const formatDuration = (minutes?: number): string => {
  if (!minutes) return 'N/A';
  if (minutes < 60) return `${minutes}m`;
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
};

export const formatRelativeTime = (date: Date): string => {
  const now = new Date();
  const diffMs = now.getTime() - date.getTime();
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'Just now';
  if (diffMins < 60) return `${diffMins}m ago`;
  if (diffHours < 24) return `${diffHours}h ago`;
  if (diffDays < 7) return `${diffDays}d ago`;
  return date.toLocaleDateString();
};

export const formatAbsoluteTime = (date: Date): string => {
  const now = new Date();
  const isToday = now.toDateString() === date.toDateString();
  const isYesterday = new Date(now.getTime() - 24 * 60 * 60 * 1000).toDateString() === date.toDateString();
  
  if (isToday) {
    return `Today ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }
  
  if (isYesterday) {
    return `Yesterday ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  }
  
  return date.toLocaleDateString() + ' ' + date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
};

// Data Formatting
export const formatBytes = (bytes: number): string => {
  const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
  if (bytes === 0) return '0 Byte';
  const i = Math.floor(Math.log(bytes) / Math.log(1024));
  return Math.round(bytes / Math.pow(1024, i) * 100) / 100 + ' ' + sizes[i];
};

export const formatPercentage = (value: number, decimals: number = 1): string => {
  return `${(value * 100).toFixed(decimals)}%`;
};

export const formatNumber = (num: number): string => {
  if (num >= 1000000) {
    return (num / 1000000).toFixed(1) + 'M';
  }
  if (num >= 1000) {
    return (num / 1000).toFixed(1) + 'K';
  }
  return num.toString();
};

// Data Validation
export const isValidEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

// Array Utilities
export const groupBy = <T>(array: T[], keyGetter: (item: T) => string): Record<string, T[]> => {
  return array.reduce((groups, item) => {
    const key = keyGetter(item);
    groups[key] = groups[key] || [];
    groups[key].push(item);
    return groups;
  }, {} as Record<string, T[]>);
};

export const sortBy = <T>(array: T[], keyGetter: (item: T) => any, direction: 'asc' | 'desc' = 'asc'): T[] => {
  return array.sort((a, b) => {
    const aVal = keyGetter(a);
    const bVal = keyGetter(b);
    
    if (aVal < bVal) return direction === 'asc' ? -1 : 1;
    if (aVal > bVal) return direction === 'asc' ? 1 : -1;
    return 0;
  });
};

export const filterUnique = <T>(array: T[], keyGetter?: (item: T) => any): T[] => {
  if (!keyGetter) {
    return [...new Set(array)];
  }
  
  const seen = new Set();
  return array.filter(item => {
    const key = keyGetter(item);
    if (seen.has(key)) {
      return false;
    }
    seen.add(key);
    return true;
  });
};

// Object Utilities
export const omit = <T extends object, K extends keyof T>(obj: T, keys: K[]): Omit<T, K> => {
  const result = { ...obj };
  keys.forEach(key => delete result[key]);
  return result;
};

export const pick = <T extends object, K extends keyof T>(obj: T, keys: K[]): Pick<T, K> => {
  const result = {} as Pick<T, K>;
  keys.forEach(key => {
    if (key in obj) {
      result[key] = obj[key];
    }
  });
  return result;
};

export const isEmpty = (obj: any): boolean => {
  if (obj == null) return true;
  if (Array.isArray(obj) || typeof obj === 'string') return obj.length === 0;
  if (typeof obj === 'object') return Object.keys(obj).length === 0;
  return false;
};

// Task Utilities
export const getTaskProgress = (task: Task): number => {
  return Math.max(0, Math.min(100, task.progress));
};

export const getTaskDuration = (task: Task): number | null => {
  if (task.status === 'completed' && task.actualDuration) {
    return task.actualDuration;
  }
  if (task.estimatedDuration) {
    return task.estimatedDuration;
  }
  return null;
};

export const isTaskOverdue = (task: Task): boolean => {
  if (!task.estimatedDuration || task.status === 'completed') return false;
  
  const now = new Date();
  const started = new Date(task.createdAt);
  const elapsed = (now.getTime() - started.getTime()) / (1000 * 60); // minutes
  
  return elapsed > task.estimatedDuration;
};

export const getTaskStatusIcon = (status: Task['status']): string => {
  switch (status) {
    case TASK_STATUS.PENDING:
      return 'schedule';
    case TASK_STATUS.IN_PROGRESS:
      return 'play-arrow';
    case TASK_STATUS.COMPLETED:
      return 'check-circle';
    case TASK_STATUS.FAILED:
      return 'error';
    case TASK_STATUS.CANCELLED:
      return 'cancel';
    default:
      return 'help';
  }
};

// Agent Utilities
export const getAgentIcon = (type: AIAgent['type']): string => {
  switch (type) {
    case 'claude':
      return 'psychology';
    case 'gpt4':
      return 'smart-toy';
    case 'gemini':
      return 'auto-awesome';
    case 'custom':
      return 'extension';
    default:
      return 'android';
  }
};

export const formatAgentPerformance = (performance: AIAgent['performance']): string => {
  const { successRate, averageResponseTime } = performance;
  return `${Math.round(successRate * 100)}% • ${Math.round(averageResponseTime)}ms`;
};

export const isAgentAvailable = (agent: AIAgent): boolean => {
  return agent.status === AGENT_STATUS.AVAILABLE;
};

// Project Utilities
export const calculateProjectProgress = (project: Project): number => {
  if (project.tasks.length === 0) return 0;
  
  const completedTasks = project.tasks.filter(task => task.status === TASK_STATUS.COMPLETED);
  return (completedTasks.length / project.tasks.length) * 100;
};

export const getProjectHealth = (project: Project): 'good' | 'warning' | 'critical' => {
  const progress = calculateProjectProgress(project);
  const overdueTasks = project.tasks.filter(isTaskOverdue);
  const failedTasks = project.tasks.filter(task => task.status === TASK_STATUS.FAILED);
  
  if (failedTasks.length > project.tasks.length * 0.2 || overdueTasks.length > project.tasks.length * 0.3) {
    return 'critical';
  }
  
  if (progress < 50 || overdueTasks.length > 0) {
    return 'warning';
  }
  
  return 'good';
};

// Error Handling
export const createErrorMessage = (error: any): string => {
  if (typeof error === 'string') return error;
  if (error?.message) return error.message;
  if (error?.error) return error.error;
  return 'An unknown error occurred';
};

export const isNetworkError = (error: any): boolean => {
  return error?.code === 'NETWORK_ERROR' || 
         error?.message?.includes('network') ||
         error?.message?.includes('fetch');
};

// Debouncing
export const debounce = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let timeout: NodeJS.Timeout;
  
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
};

// Throttling
export const throttle = <T extends (...args: any[]) => any>(
  func: T,
  wait: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;
  
  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, wait);
    }
  };
};

// Animation Helpers
export const interpolate = (
  value: number,
  inputRange: [number, number],
  outputRange: [number, number],
  extrapolate?: 'clamp' | 'extend'
): number => {
  const [inputMin, inputMax] = inputRange;
  const [outputMin, outputMax] = outputRange;
  
  if (extrapolate === 'clamp') {
    if (value <= inputMin) return outputMin;
    if (value >= inputMax) return outputMax;
  }
  
  const progress = (value - inputMin) / (inputMax - inputMin);
  return outputMin + progress * (outputMax - outputMin);
};

// Storage Helpers
export const createStorageKey = (...parts: string[]): string => {
  return parts.join('_').toLowerCase();
};

export const parseStorageValue = <T>(value: string | null, defaultValue: T): T => {
  if (!value) return defaultValue;
  
  try {
    return JSON.parse(value);
  } catch {
    return defaultValue;
  }
};

// Development Helpers
export const logDebug = (message: string, ...args: any[]): void => {
  if (__DEV__) {
    console.log(`[ClaudeCoordination] ${message}`, ...args);
  }
};

export const logError = (message: string, error?: any): void => {
  if (__DEV__) {
    console.error(`[ClaudeCoordination] ${message}`, error);
  }
};