// Claude Code Coordination API Service
// Handles communication with backend server and AI coordination system

const API_BASE_URL = 'http://localhost:8080';

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

// Helper function to use mock data when backend is unavailable
export async function safeApiCall<T>(apiCall: () => Promise<T>, mockResponse: T): Promise<T> {
  try {
    return await apiCall();
  } catch (error) {
    console.warn('API call failed, using mock data:', error);
    return mockResponse;
  }
}