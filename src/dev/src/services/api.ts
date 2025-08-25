/**
 * Real API Service Integration
 * Connects frontend to the real backend server
 */

import axios, { AxiosInstance, AxiosResponse } from 'axios';
import { io, Socket } from 'socket.io-client';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8080';
const WS_URL = process.env.REACT_APP_WS_URL || 'http://localhost:8080';

class APIService {
  private api: AxiosInstance;
  private socket: Socket | null = null;
  private userId: string | null = null;

  constructor() {
    this.api = axios.create({
      baseURL: API_BASE_URL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
      }
    });

    // Add response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => response,
      (error) => {
        console.error('API Error:', error);
        return Promise.reject(error);
      }
    );
  }

  // Initialize WebSocket connection
  connectWebSocket(userId: string): Socket {
    if (this.socket) {
      this.socket.disconnect();
    }

    this.userId = userId;
    this.socket = io(WS_URL, {
      transports: ['websocket', 'polling']
    });

    this.socket.on('connect', () => {
      console.log('✅ Connected to real-time server');
    });

    this.socket.on('disconnect', () => {
      console.log('❌ Disconnected from real-time server');
    });

    return this.socket;
  }

  // Project Management
  async createProject(projectData: {
    name: string;
    description: string;
    techStack: string;
    userId: string;
  }): Promise<{ success: boolean; projectId: string }> {
    const response = await this.api.post('/api/projects', projectData);
    return response.data;
  }

  async getProject(projectId: string): Promise<any> {
    const response = await this.api.get(`/api/projects/${projectId}`);
    return response.data;
  }

  // AI Team Orchestration
  async buildWithAI(buildData: {
    projectDescription: string;
    teamComposition?: string[];
    projectId?: string;
  }): Promise<{
    success: boolean;
    results: any[];
    buildId: string;
  }> {
    const response = await this.api.post('/api/ai/build', buildData);
    return response.data;
  }

  // AI Performance Analytics
  async getAIPerformance(): Promise<{
    success: boolean;
    performance: Array<{
      ai_name: string;
      total_tasks: number;
      avg_duration: number;
      success_rate: number;
      avg_quality: number;
    }>;
  }> {
    const response = await this.api.get('/api/ai/performance');
    return response.data;
  }

  // Deployment Services
  async deployProject(deploymentData: {
    projectPath: string;
    provider: 'vercel' | 'netlify' | 'aws' | 'docker';
    config: {
      projectId?: string;
      customDomain?: string;
      envVars?: Record<string, string>;
    };
  }): Promise<{
    success: boolean;
    deploymentId: string;
    url?: string;
    error?: string;
  }> {
    const response = await this.api.post('/api/deploy', deploymentData);
    return response.data;
  }

  async getDeployment(deploymentId: string): Promise<any> {
    const response = await this.api.get(`/api/deployments/${deploymentId}`);
    return response.data;
  }

  // Multi-User Collaboration
  joinProject(projectId: string): void {
    if (!this.socket || !this.userId) {
      throw new Error('WebSocket not connected or user not authenticated');
    }

    this.socket.emit('join-project', {
      projectId,
      userId: this.userId
    });
  }

  updateCursor(projectId: string, x: number, y: number): void {
    if (!this.socket) return;

    this.socket.emit('cursor-update', {
      projectId,
      x,
      y
    });
  }

  sendTextEdit(projectId: string, edit: {
    field: string;
    operation: 'insert' | 'delete' | 'replace';
    position: number;
    text: string;
  }): void {
    if (!this.socket) return;

    this.socket.emit('text-edit', {
      projectId,
      ...edit
    });
  }

  // Event listeners for real-time updates
  onUserJoined(callback: (data: { userId: string; timestamp: string }) => void): void {
    if (!this.socket) return;
    this.socket.on('user-joined', callback);
  }

  onCursorMoved(callback: (data: { userId: string; x: number; y: number }) => void): void {
    if (!this.socket) return;
    this.socket.on('cursor-moved', callback);
  }

  onTextEdited(callback: (data: {
    userId: string;
    field: string;
    operation: string;
    position: number;
    text: string;
    timestamp: number;
  }) => void): void {
    if (!this.socket) return;
    this.socket.on('text-edited', callback);
  }

  // Health check
  async checkHealth(): Promise<{
    status: string;
    timestamp: string;
    services: {
      database: string;
      redis: string;
      websocket: number;
    };
  }> {
    const response = await this.api.get('/health');
    return response.data;
  }

  // Utility methods
  isConnected(): boolean {
    return this.socket?.connected || false;
  }

  disconnect(): void {
    if (this.socket) {
      this.socket.disconnect();
      this.socket = null;
    }
  }

  setUserId(userId: string): void {
    this.userId = userId;
  }

  getUserId(): string | null {
    return this.userId;
  }
}

// Export singleton instance
const apiService = new APIService();
export default apiService;

// Export types for TypeScript usage
export interface AIBuildResult {
  task: {
    type: string;
    title: string;
    prompt: string;
  };
  ai: string;
  result: {
    success: boolean;
    content: string;
    error?: string;
  };
  duration: number;
  success: boolean;
}

export interface DeploymentStatus {
  id: string;
  project_id: string;
  provider: string;
  status: 'deploying' | 'deployed' | 'failed';
  url?: string;
  created_at: string;
  completed_at?: string;
  error_message?: string;
}

export interface AIPerformanceData {
  ai_name: string;
  total_tasks: number;
  avg_duration: number;
  success_rate: number;
  avg_quality: number;
}