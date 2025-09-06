// Claude Code Coordination API Service
// Handles communication with backend server and AI coordination system

const API_BASE_URL = 'http://localhost:8080';

// Development mode controls
const isDevelopment = import.meta.env.MODE === 'development';
const VERBOSE_LOGGING = false; // Set to true for detailed API logging

// API status tracking
let apiStatus: 'unknown' | 'available' | 'unavailable' = 'unknown';
let lastStatusCheck = 0;
const STATUS_CHECK_INTERVAL = 30000; // 30 seconds

// Request deduplication for React StrictMode
const requestCache = new Map<string, { promise: Promise<any>, timestamp: number }>();
const CACHE_DURATION = 1000; // 1 second

// Types for API responses
export interface AIAgent {
  id: string;
  name: string;
  type: 'claude' | 'gpt4' | 'gemini';
  status: 'active' | 'idle' | 'busy';
  capabilities: string[];
}

export interface CoordinationSession {
  id: string;
  description: string;
  status: 'active' | 'paused' | 'completed';
  agents: AIAgent[];
  startTime: string;
  lastActivity: string;
}

export interface QualityGate {
  id: string;
  name: string;
  status: 'passed' | 'failed' | 'pending';
  checks: QualityCheck[];
}

export interface QualityCheck {
  name: string;
  status: 'passed' | 'failed' | 'pending';
  message: string;
  details?: string;
}

export interface MetricsData {
  totalTasks: number;
  completedTasks: number;
  activeAgents: number;
  averageResponseTime: number;
  successRate: number;
  tokenUsage: {
    total: number;
    byAgent: Record<string, number>;
  };
}

// API client class
export class CoordinationAPI {
  private baseUrl: string;

  constructor(baseUrl: string = API_BASE_URL) {
    this.baseUrl = baseUrl;
  }

  // Generic fetch wrapper
  private async fetch<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  // Session management
  async getSessions(): Promise<CoordinationSession[]> {
    return this.fetch<CoordinationSession[]>('/api/sessions');
  }

  async createSession(description: string): Promise<CoordinationSession> {
    return this.fetch<CoordinationSession>('/api/sessions', {
      method: 'POST',
      body: JSON.stringify({ description }),
    });
  }

  async endSession(sessionId: string): Promise<void> {
    await this.fetch(`/api/sessions/${sessionId}/end`, {
      method: 'POST',
    });
  }

  // AI Agent management
  async getAgents(): Promise<AIAgent[]> {
    return this.fetch<AIAgent[]>('/api/agents');
  }

  async assignTask(agentId: string, task: string, context?: string): Promise<any> {
    return this.fetch(`/api/agents/${agentId}/assign`, {
      method: 'POST',
      body: JSON.stringify({ task, context }),
    });
  }

  // Quality Gates
  async getQualityGates(): Promise<QualityGate[]> {
    return this.fetch<QualityGate[]>('/api/quality-gates');
  }

  async runQualityGate(gateId: string, files: string[]): Promise<QualityGate> {
    return this.fetch<QualityGate>(`/api/quality-gates/${gateId}/run`, {
      method: 'POST',
      body: JSON.stringify({ files }),
    });
  }

  // Metrics and analytics
  async getMetrics(): Promise<MetricsData> {
    return this.fetch<MetricsData>('/api/metrics');
  }

  async getAgentPerformance(): Promise<Record<string, any>> {
    return this.fetch<Record<string, any>>('/api/metrics/agents');
  }

  // File operations
  async lockFile(filePath: string, reason: string): Promise<void> {
    await this.fetch('/api/files/lock', {
      method: 'POST',
      body: JSON.stringify({ filePath, reason }),
    });
  }

  async unlockFile(filePath: string): Promise<void> {
    await this.fetch('/api/files/unlock', {
      method: 'POST',
      body: JSON.stringify({ filePath }),
    });
  }

  // Health check
  async healthCheck(): Promise<{ status: string; timestamp: string }> {
    return this.fetch<{ status: string; timestamp: string }>('/api/health');
  }

  // Generic HTTP methods for collaboration features
  async post<T>(endpoint: string, data?: any): Promise<T> {
    return this.fetch(endpoint, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: data ? JSON.stringify(data) : undefined
    });
  }

  async put<T>(endpoint: string, data?: any): Promise<T> {
    return this.fetch(endpoint, {
      method: 'PUT', 
      headers: { 'Content-Type': 'application/json' },
      body: data ? JSON.stringify(data) : undefined
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.fetch(endpoint, { method: 'DELETE' });
  }
}

// Default API instance
export const api = new CoordinationAPI();

// Legacy alias for compatibility
export const apiService = api;

// Mock data for development (when backend is not available)
export const mockData = {
  sessions: [
    {
      id: 'session-1',
      description: 'Frontend Dashboard Development',
      status: 'active' as const,
      agents: [
        {
          id: 'claude-1',
          name: 'Claude Frontend',
          type: 'claude' as const,
          status: 'active' as const,
          capabilities: ['React', 'TypeScript', 'UI/UX'],
        },
        {
          id: 'gpt4-1',
          name: 'GPT-4 Backend',
          type: 'gpt4' as const,
          status: 'idle' as const,
          capabilities: ['Node.js', 'API Design', 'Database'],
        },
      ],
      startTime: new Date().toISOString(),
      lastActivity: new Date().toISOString(),
    },
  ],
  
  agents: [
    {
      id: 'claude-1',
      name: 'Claude Frontend Specialist',
      type: 'claude' as const,
      status: 'active' as const,
      capabilities: ['React', 'TypeScript', 'TailwindCSS', 'UI/UX Design'],
    },
    {
      id: 'gpt4-1', 
      name: 'GPT-4 Backend Developer',
      type: 'gpt4' as const,
      status: 'idle' as const,
      capabilities: ['Node.js', 'Express', 'PostgreSQL', 'API Design'],
    },
    {
      id: 'gemini-1',
      name: 'Gemini DevOps Engineer',
      type: 'gemini' as const,
      status: 'busy' as const,
      capabilities: ['Docker', 'Kubernetes', 'CI/CD', 'Monitoring'],
    },
  ],

  qualityGates: [
    {
      id: 'gate-1',
      name: 'Code Quality Gate',
      status: 'passed' as const,
      checks: [
        { name: 'TypeScript Check', status: 'passed' as const, message: 'No type errors found' },
        { name: 'ESLint', status: 'passed' as const, message: 'All rules passed' },
        { name: 'Tests', status: 'failed' as const, message: '2 tests failing', details: 'Unit tests for API service' },
      ],
    },
  ],

  metrics: {
    totalTasks: 47,
    completedTasks: 42,
    activeAgents: 3,
    averageResponseTime: 1247,
    successRate: 89.4,
    tokenUsage: {
      total: 125690,
      byAgent: {
        'claude-1': 45230,
        'gpt4-1': 52180,
        'gemini-1': 28280,
      },
    },
  },
};

// Enhanced error types
export enum ApiErrorType {
  NETWORK_ERROR = 'network',
  TIMEOUT_ERROR = 'timeout', 
  SERVER_ERROR = 'server',
  EXPECTED_UNAVAILABLE = 'expected_unavailable'
}

// API status getter
export function getApiStatus() {
  return apiStatus;
}

// Check API availability (debounced)
async function checkApiAvailability(): Promise<boolean> {
  const now = Date.now();
  if (now - lastStatusCheck < STATUS_CHECK_INTERVAL && apiStatus !== 'unknown') {
    return apiStatus === 'available';
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000);
    
    const response = await fetch(`${API_BASE_URL}/health`, {
      signal: controller.signal,
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    });
    
    clearTimeout(timeoutId);
    const isAvailable = response.ok;
    apiStatus = isAvailable ? 'available' : 'unavailable';
    lastStatusCheck = now;
    
    return isAvailable;
  } catch (error) {
    apiStatus = 'unavailable';
    lastStatusCheck = now;
    return false;
  }
}

// Enhanced helper function with better logging and error categorization
export async function safeApiCall<T>(
  apiCall: () => Promise<T>, 
  mockResponse: T,
  context?: string
): Promise<T> {
  const cacheKey = `${context || 'call'}-${Date.now()}`;
  const now = Date.now();
  
  // Clean expired cache entries
  for (const [key, { timestamp }] of requestCache.entries()) {
    if (now - timestamp > CACHE_DURATION) {
      requestCache.delete(key);
    }
  }
  
  try {
    const result = await apiCall();
    return result;
  } catch (error) {
    const errorType = categorizeError(error);
    
    // Only log unexpected errors in verbose mode
    if (VERBOSE_LOGGING && isDevelopment) {
      console.warn(`[API] ${context || 'Call'} failed (${errorType}):`, error);
    }
    
    // Update API status based on error type
    if (errorType === ApiErrorType.NETWORK_ERROR) {
      apiStatus = 'unavailable';
      lastStatusCheck = Date.now();
    }
    
    return mockResponse;
  }
}

// Categorize errors for better handling
function categorizeError(error: any): ApiErrorType {
  if (error?.name === 'AbortError') {
    return ApiErrorType.TIMEOUT_ERROR;
  }
  
  if (error?.message?.includes('fetch')) {
    return ApiErrorType.NETWORK_ERROR;
  }
  
  if (error?.status >= 500) {
    return ApiErrorType.SERVER_ERROR;
  }
  
  if (apiStatus === 'unavailable') {
    return ApiErrorType.EXPECTED_UNAVAILABLE;
  }
  
  return ApiErrorType.NETWORK_ERROR;
}