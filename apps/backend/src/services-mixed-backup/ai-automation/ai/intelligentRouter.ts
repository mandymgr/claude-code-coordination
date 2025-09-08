import { TelemetryUtils, DatabaseService, databaseService } from '../../utils/telemetry';
import { EventEmitter } from 'events';

export interface AIProvider {
  id: string;
  name: string;
  type: 'openai' | 'anthropic' | 'google' | 'local' | 'custom';
  models: string[];
  pricing: {
    input_tokens: number; // Cost per 1K input tokens in USD
    output_tokens: number; // Cost per 1K output tokens in USD
    requests: number; // Cost per request in USD
  };
  rate_limits: {
    requests_per_minute: number;
    tokens_per_minute: number;
    concurrent_requests: number;
  };
  capabilities: {
    max_tokens: number;
    context_window: number;
    supports_streaming: boolean;
    supports_function_calling: boolean;
    supports_code_execution: boolean;
    supports_vision: boolean;
    supports_multimodal: boolean;
  };
  specializations: string[]; // e.g., ['code', 'reasoning', 'creative', 'analysis']
  performance_metrics: {
    average_latency_ms: number;
    success_rate: number;
    quality_score: number;
    last_updated: Date;
  };
  is_active: boolean;
  endpoint_url: string;
  api_key_encrypted: string;
  organization_id: string;
}

export interface AIRequest {
  id: string;
  user_id: string;
  organization_id: string;
  task_type: 'code_generation' | 'code_review' | 'documentation' | 'debugging' | 'explanation' | 'refactoring' | 'testing' | 'analysis' | 'creative' | 'reasoning';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  content: {
    prompt: string;
    context?: string;
    files?: Array<{ path: string; content: string }>;
    language?: string;
    framework?: string;
  };
  constraints: {
    max_tokens?: number;
    max_cost_usd?: number;
    max_latency_ms?: number;
    preferred_providers?: string[];
    excluded_providers?: string[];
    require_streaming?: boolean;
    require_function_calling?: boolean;
  };
  metadata: {
    project_id?: string;
    session_id?: string;
    collaboration_context?: any;
  };
  created_at: Date;
}

export interface AIResponse {
  request_id: string;
  provider_id: string;
  model_used: string;
  response_content: string;
  metadata: {
    tokens_used: {
      input: number;
      output: number;
      total: number;
    };
    cost_usd: number;
    latency_ms: number;
    quality_indicators: {
      confidence_score?: number;
      relevance_score?: number;
      completeness_score?: number;
    };
  };
  success: boolean;
  error_message?: string;
  timestamp: Date;
}

export interface RoutingDecision {
  selected_provider: AIProvider;
  selected_model: string;
  reasoning: string;
  confidence_score: number;
  estimated_cost: number;
  estimated_latency: number;
  fallback_options: Array<{ provider: AIProvider; model: string }>;
}

export class IntelligentAIRouter extends EventEmitter {
  private db: DatabaseService;
  private providers: Map<string, AIProvider> = new Map();
  private requestQueue: Map<string, AIRequest> = new Map();
  private activeRequests: Map<string, { provider: AIProvider; start_time: Date }> = new Map();
  
  // Performance tracking
  private providerMetrics: Map<string, {
    total_requests: number;
    successful_requests: number;
    total_latency_ms: number;
    total_cost_usd: number;
    last_hour_requests: Array<{ timestamp: Date; success: boolean; latency_ms: number }>;
  }> = new Map();

  // Load balancing state
  private providerLoadState: Map<string, {
    current_requests: number;
    last_request_time: Date;
    tokens_used_this_minute: number;
    requests_this_minute: number;
  }> = new Map();

  constructor() {
    super();
    this.db = databaseService;
    this.initializeProviders();
    this.startMetricsCollection();
    this.startLoadBalancingCleanup();
  }

  /**
   * Initialize AI providers with configurations
   */
  private async initializeProviders(): Promise<void> {
    return TelemetryUtils.traceAsync('ai_router.initialize_providers', async () => {
      // OpenAI GPT-4
      this.providers.set('openai-gpt4', {
        id: 'openai-gpt4',
        name: 'OpenAI GPT-4',
        type: 'openai',
        models: ['gpt-4', 'gpt-4-turbo', 'gpt-4o'],
        pricing: {
          input_tokens: 0.03, // $0.03 per 1K input tokens
          output_tokens: 0.06, // $0.06 per 1K output tokens
          requests: 0.001 // $0.001 per request
        },
        rate_limits: {
          requests_per_minute: 500,
          tokens_per_minute: 150000,
          concurrent_requests: 10
        },
        capabilities: {
          max_tokens: 4096,
          context_window: 128000,
          supports_streaming: true,
          supports_function_calling: true,
          supports_code_execution: false,
          supports_vision: true,
          supports_multimodal: true
        },
        specializations: ['reasoning', 'code', 'analysis', 'creative'],
        performance_metrics: {
          average_latency_ms: 2500,
          success_rate: 0.98,
          quality_score: 0.92,
          last_updated: new Date()
        },
        is_active: true,
        endpoint_url: 'https://api.openai.com/v1/chat/completions',
        api_key_encrypted: process.env.OPENAI_API_KEY || '',
        organization_id: 'default'
      });

      // Anthropic Claude
      this.providers.set('anthropic-claude', {
        id: 'anthropic-claude',
        name: 'Anthropic Claude',
        type: 'anthropic',
        models: ['claude-3-haiku', 'claude-3-sonnet', 'claude-3-opus'],
        pricing: {
          input_tokens: 0.025,
          output_tokens: 0.125,
          requests: 0.001
        },
        rate_limits: {
          requests_per_minute: 1000,
          tokens_per_minute: 200000,
          concurrent_requests: 15
        },
        capabilities: {
          max_tokens: 4096,
          context_window: 200000,
          supports_streaming: true,
          supports_function_calling: true,
          supports_code_execution: false,
          supports_vision: true,
          supports_multimodal: false
        },
        specializations: ['code', 'reasoning', 'analysis', 'documentation'],
        performance_metrics: {
          average_latency_ms: 1800,
          success_rate: 0.99,
          quality_score: 0.94,
          last_updated: new Date()
        },
        is_active: true,
        endpoint_url: 'https://api.anthropic.com/v1/messages',
        api_key_encrypted: process.env.ANTHROPIC_API_KEY || '',
        organization_id: 'default'
      });

      // Google Gemini
      this.providers.set('google-gemini', {
        id: 'google-gemini',
        name: 'Google Gemini',
        type: 'google',
        models: ['gemini-pro', 'gemini-pro-vision'],
        pricing: {
          input_tokens: 0.001,
          output_tokens: 0.002,
          requests: 0.0005
        },
        rate_limits: {
          requests_per_minute: 60,
          tokens_per_minute: 120000,
          concurrent_requests: 5
        },
        capabilities: {
          max_tokens: 2048,
          context_window: 32000,
          supports_streaming: true,
          supports_function_calling: true,
          supports_code_execution: true,
          supports_vision: true,
          supports_multimodal: true
        },
        specializations: ['reasoning', 'multimodal', 'analysis'],
        performance_metrics: {
          average_latency_ms: 3200,
          success_rate: 0.95,
          quality_score: 0.88,
          last_updated: new Date()
        },
        is_active: true,
        endpoint_url: 'https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent',
        api_key_encrypted: process.env.GOOGLE_API_KEY || '',
        organization_id: 'default'
      });

      // Initialize load state for all providers
      this.providers.forEach((provider) => {
        this.providerLoadState.set(provider.id, {
          current_requests: 0,
          last_request_time: new Date(0),
          tokens_used_this_minute: 0,
          requests_this_minute: 0
        });

        this.providerMetrics.set(provider.id, {
          total_requests: 0,
          successful_requests: 0,
          total_latency_ms: 0,
          total_cost_usd: 0,
          last_hour_requests: []
        });
      });

      console.log(`Initialized ${this.providers.size} AI providers`);
    });
  }

  /**
   * Route an AI request to the optimal provider
   */
  async routeRequest(request: AIRequest): Promise<RoutingDecision> {
    return TelemetryUtils.traceAsync('ai_router.route_request', async () => {
      // Filter providers based on constraints and capabilities
      const availableProviders = this.filterAvailableProviders(request);
      
      if (availableProviders.length === 0) {
        throw new Error('No suitable AI providers available for this request');
      }

      // Score each available provider
      const providerScores = await Promise.all(
        availableProviders.map(async (provider) => {
          const score = await this.calculateProviderScore(provider, request);
          return { provider, score };
        })
      );

      // Sort by score (highest first)
      providerScores.sort((a, b) => b.score.total_score - a.score.total_score);

      const selectedProvider = providerScores[0].provider;
      const selectedModel = this.selectOptimalModel(selectedProvider, request);

      // Calculate estimates
      const estimatedTokens = this.estimateTokenUsage(request);
      const estimatedCost = this.calculateEstimatedCost(selectedProvider, estimatedTokens);
      const estimatedLatency = this.estimateLatency(selectedProvider, request);

      // Prepare fallback options
      const fallbackOptions = providerScores.slice(1, 4).map(({ provider }) => ({
        provider,
        model: this.selectOptimalModel(provider, request)
      }));

      const decision: RoutingDecision = {
        selected_provider: selectedProvider,
        selected_model: selectedModel,
        reasoning: this.generateRoutingReasoning(selectedProvider, providerScores[0].score, request),
        confidence_score: providerScores[0].score.confidence,
        estimated_cost: estimatedCost,
        estimated_latency: estimatedLatency,
        fallback_options: fallbackOptions
      };

      // Store routing decision
      await this.storeRoutingDecision(request.id, decision);

      this.emit('routing_decision', { request, decision });

      return decision;
    });
  }

  /**
   * Execute an AI request using the selected provider
   */
  async executeRequest(request: AIRequest, decision: RoutingDecision): Promise<AIResponse> {
    return TelemetryUtils.traceAsync('ai_router.execute_request', async () => {
      const startTime = new Date();
      const provider = decision.selected_provider;
      
      // Update load state
      this.updateLoadState(provider.id, 'start');
      this.activeRequests.set(request.id, { provider, start_time: startTime });

      try {
        // Execute the actual AI request
        const response = await this.callAIProvider(provider, decision.selected_model, request);
        
        // Calculate actual metrics
        const endTime = new Date();
        const latency = endTime.getTime() - startTime.getTime();
        const actualCost = this.calculateActualCost(provider, response.metadata.tokens_used);

        // Update provider metrics
        this.updateProviderMetrics(provider.id, true, latency, actualCost);

        // Store response
        await this.storeAIResponse(response);

        this.emit('request_completed', { request, response });

        return response;

      } catch (error) {
        // Handle failure and try fallback if available
        const latency = new Date().getTime() - startTime.getTime();
        this.updateProviderMetrics(provider.id, false, latency, 0);

        console.error(`AI request failed for provider ${provider.id}:`, error);

        // Try fallback providers
        if (decision.fallback_options.length > 0) {
          console.log('Attempting fallback provider...');
          const fallback = decision.fallback_options[0];
          
          const fallbackDecision: RoutingDecision = {
            ...decision,
            selected_provider: fallback.provider,
            selected_model: fallback.model
          };

          return await this.executeRequest(request, fallbackDecision);
        }

        // Create error response
        const errorResponse: AIResponse = {
          request_id: request.id,
          provider_id: provider.id,
          model_used: decision.selected_model,
          response_content: '',
          metadata: {
            tokens_used: { input: 0, output: 0, total: 0 },
            cost_usd: 0,
            latency_ms: latency,
            quality_indicators: {}
          },
          success: false,
          error_message: error instanceof Error ? error.message : 'Unknown error',
          timestamp: new Date()
        };

        this.emit('request_failed', { request, response: errorResponse, error });

        return errorResponse;

      } finally {
        // Cleanup
        this.updateLoadState(provider.id, 'end');
        this.activeRequests.delete(request.id);
      }
    });
  }

  /**
   * Filter providers based on request constraints and current availability
   */
  private filterAvailableProviders(request: AIRequest): AIProvider[] {
    const availableProviders: AIProvider[] = [];

    this.providers.forEach((provider) => {
      // Check if provider is active
      if (!provider.is_active) return;

      // Check organization access
      if (provider.organization_id !== 'default' && provider.organization_id !== request.organization_id) return;

      // Check excluded providers
      if (request.constraints.excluded_providers?.includes(provider.id)) return;

      // Check preferred providers
      if (request.constraints.preferred_providers?.length && 
          !request.constraints.preferred_providers.includes(provider.id)) return;

      // Check capability requirements
      if (request.constraints.require_streaming && !provider.capabilities.supports_streaming) return;
      if (request.constraints.require_function_calling && !provider.capabilities.supports_function_calling) return;

      // Check rate limits
      const loadState = this.providerLoadState.get(provider.id);
      if (loadState) {
        if (loadState.current_requests >= provider.rate_limits.concurrent_requests) return;
        if (loadState.requests_this_minute >= provider.rate_limits.requests_per_minute) return;
        if (loadState.tokens_used_this_minute >= provider.rate_limits.tokens_per_minute) return;
      }

      // Check cost constraints
      if (request.constraints.max_cost_usd) {
        const estimatedTokens = this.estimateTokenUsage(request);
        const estimatedCost = this.calculateEstimatedCost(provider, estimatedTokens);
        if (estimatedCost > request.constraints.max_cost_usd) return;
      }

      availableProviders.push(provider);
    });

    return availableProviders;
  }

  /**
   * Calculate provider score based on request requirements
   */
  private async calculateProviderScore(provider: AIProvider, request: AIRequest): Promise<{
    total_score: number;
    confidence: number;
    breakdown: {
      specialization_score: number;
      performance_score: number;
      cost_score: number;
      availability_score: number;
      quality_score: number;
    };
  }> {
    const weights = {
      specialization: 0.3,
      performance: 0.25,
      cost: 0.2,
      availability: 0.15,
      quality: 0.1
    };

    // Specialization score (how well the provider matches the task type)
    const specializationScore = this.calculateSpecializationScore(provider, request.task_type);

    // Performance score (latency and success rate)
    const performanceScore = this.calculatePerformanceScore(provider, request);

    // Cost score (lower cost = higher score)
    const estimatedTokens = this.estimateTokenUsage(request);
    const estimatedCost = this.calculateEstimatedCost(provider, estimatedTokens);
    const costScore = this.calculateCostScore(estimatedCost, request.constraints.max_cost_usd);

    // Availability score (current load and rate limits)
    const availabilityScore = this.calculateAvailabilityScore(provider);

    // Quality score (historical quality metrics)
    const qualityScore = provider.performance_metrics.quality_score;

    const totalScore = 
      (specializationScore * weights.specialization) +
      (performanceScore * weights.performance) +
      (costScore * weights.cost) +
      (availabilityScore * weights.availability) +
      (qualityScore * weights.quality);

    const confidence = Math.min(
      provider.performance_metrics.success_rate,
      (this.providerMetrics.get(provider.id)?.total_requests || 0) > 10 ? 0.9 : 0.7
    );

    return {
      total_score: totalScore,
      confidence,
      breakdown: {
        specialization_score: specializationScore,
        performance_score: performanceScore,
        cost_score: costScore,
        availability_score: availabilityScore,
        quality_score: qualityScore
      }
    };
  }

  private calculateSpecializationScore(provider: AIProvider, taskType: string): number {
    const taskTypeMapping: Record<string, string[]> = {
      'code_generation': ['code'],
      'code_review': ['code', 'analysis'],
      'documentation': ['documentation', 'creative'],
      'debugging': ['code', 'reasoning'],
      'explanation': ['reasoning', 'analysis'],
      'refactoring': ['code', 'analysis'],
      'testing': ['code', 'reasoning'],
      'analysis': ['analysis', 'reasoning'],
      'creative': ['creative'],
      'reasoning': ['reasoning']
    };

    const requiredSpecializations = taskTypeMapping[taskType] || [];
    const matchingSpecializations = provider.specializations.filter(spec => 
      requiredSpecializations.includes(spec)
    );

    return matchingSpecializations.length / Math.max(requiredSpecializations.length, 1);
  }

  private calculatePerformanceScore(provider: AIProvider, request: AIRequest): number {
    const latencyScore = request.constraints.max_latency_ms 
      ? Math.max(0, 1 - (provider.performance_metrics.average_latency_ms / request.constraints.max_latency_ms))
      : 1 - (provider.performance_metrics.average_latency_ms / 5000); // Normalize to 5 seconds

    const successScore = provider.performance_metrics.success_rate;

    return (latencyScore * 0.6) + (successScore * 0.4);
  }

  private calculateCostScore(estimatedCost: number, maxCost?: number): number {
    if (!maxCost) {
      // Return score based on general cost efficiency (lower = better)
      return Math.max(0, 1 - (estimatedCost / 1.0)); // Normalize to $1.00
    }

    return Math.max(0, 1 - (estimatedCost / maxCost));
  }

  private calculateAvailabilityScore(provider: AIProvider): number {
    const loadState = this.providerLoadState.get(provider.id);
    if (!loadState) return 1.0;

    const concurrentScore = 1 - (loadState.current_requests / provider.rate_limits.concurrent_requests);
    const rpmScore = 1 - (loadState.requests_this_minute / provider.rate_limits.requests_per_minute);
    const tpmScore = 1 - (loadState.tokens_used_this_minute / provider.rate_limits.tokens_per_minute);

    return Math.min(concurrentScore, rpmScore, tpmScore);
  }

  private selectOptimalModel(provider: AIProvider, request: AIRequest): string {
    // Simple model selection - can be enhanced with more sophisticated logic
    const models = provider.models;
    
    if (request.task_type === 'code_generation' || request.task_type === 'code_review') {
      // Prefer more capable models for code tasks
      return models[models.length - 1]; // Assuming models are ordered by capability
    }
    
    if (request.priority === 'low' || request.constraints.max_cost_usd && request.constraints.max_cost_usd < 0.01) {
      // Use cheaper/faster model for low priority or budget-constrained requests
      return models[0];
    }

    // Default to middle-tier model
    return models[Math.floor(models.length / 2)];
  }

  private estimateTokenUsage(request: AIRequest): { input: number; output: number } {
    // Rough token estimation - can be improved with more sophisticated algorithms
    const promptTokens = Math.ceil(request.content.prompt.length / 4); // ~4 chars per token
    const contextTokens = request.content.context ? Math.ceil(request.content.context.length / 4) : 0;
    const fileTokens = request.content.files?.reduce((sum, file) => sum + Math.ceil(file.content.length / 4), 0) || 0;
    
    const inputTokens = promptTokens + contextTokens + fileTokens;
    const outputTokens = request.constraints.max_tokens || Math.min(1000, inputTokens * 0.5);

    return { input: inputTokens, output: outputTokens };
  }

  private calculateEstimatedCost(provider: AIProvider, tokens: { input: number; output: number }): number {
    const inputCost = (tokens.input / 1000) * provider.pricing.input_tokens;
    const outputCost = (tokens.output / 1000) * provider.pricing.output_tokens;
    const requestCost = provider.pricing.requests;

    return inputCost + outputCost + requestCost;
  }

  private calculateActualCost(provider: AIProvider, tokens: { input: number; output: number; total: number }): number {
    return this.calculateEstimatedCost(provider, tokens);
  }

  private estimateLatency(provider: AIProvider, request: AIRequest): number {
    // Base latency from provider metrics
    let estimatedLatency = provider.performance_metrics.average_latency_ms;

    // Adjust based on request size
    const tokens = this.estimateTokenUsage(request);
    const totalTokens = tokens.input + tokens.output;
    
    // Add latency for larger requests
    estimatedLatency += Math.max(0, (totalTokens - 1000) * 2); // 2ms per token over 1000

    return estimatedLatency;
  }

  private generateRoutingReasoning(provider: AIProvider, score: any, request: AIRequest): string {
    const reasons = [];
    
    if (score.breakdown.specialization_score > 0.8) {
      reasons.push(`Strong specialization match for ${request.task_type}`);
    }
    
    if (score.breakdown.performance_score > 0.8) {
      reasons.push(`Excellent performance metrics (${(provider.performance_metrics.success_rate * 100).toFixed(1)}% success rate)`);
    }
    
    if (score.breakdown.cost_score > 0.8) {
      reasons.push('Cost-efficient option');
    }
    
    if (score.breakdown.availability_score > 0.9) {
      reasons.push('High availability with low current load');
    }

    return reasons.join('; ') || `Selected based on overall score: ${score.total_score.toFixed(2)}`;
  }

  /**
   * Mock AI provider call - replace with actual provider implementations
   */
  private async callAIProvider(provider: AIProvider, model: string, request: AIRequest): Promise<AIResponse> {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, provider.performance_metrics.average_latency_ms));

    // Mock successful response
    const tokens = this.estimateTokenUsage(request);
    const response: AIResponse = {
      request_id: request.id,
      provider_id: provider.id,
      model_used: model,
      response_content: `Mock AI response for ${request.task_type} task using ${provider.name}`,
      metadata: {
        tokens_used: {
          input: tokens.input,
          output: tokens.output,
          total: tokens.input + tokens.output
        },
        cost_usd: this.calculateActualCost(provider, tokens),
        latency_ms: provider.performance_metrics.average_latency_ms,
        quality_indicators: {
          confidence_score: 0.92,
          relevance_score: 0.94,
          completeness_score: 0.89
        }
      },
      success: true,
      timestamp: new Date()
    };

    return response;
  }

  /**
   * Update provider load state and metrics
   */
  private updateLoadState(providerId: string, action: 'start' | 'end'): void {
    const loadState = this.providerLoadState.get(providerId);
    if (!loadState) return;

    if (action === 'start') {
      loadState.current_requests++;
      loadState.requests_this_minute++;
      loadState.last_request_time = new Date();
    } else {
      loadState.current_requests = Math.max(0, loadState.current_requests - 1);
    }
  }

  private updateProviderMetrics(providerId: string, success: boolean, latencyMs: number, costUsd: number): void {
    const metrics = this.providerMetrics.get(providerId);
    if (!metrics) return;

    metrics.total_requests++;
    if (success) {
      metrics.successful_requests++;
    }
    metrics.total_latency_ms += latencyMs;
    metrics.total_cost_usd += costUsd;

    // Update recent requests for trending analysis
    metrics.last_hour_requests.push({
      timestamp: new Date(),
      success,
      latency_ms: latencyMs
    });

    // Keep only last hour
    const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000);
    metrics.last_hour_requests = metrics.last_hour_requests.filter(req => req.timestamp > oneHourAgo);

    // Update provider performance metrics
    const provider = this.providers.get(providerId);
    if (provider) {
      provider.performance_metrics.average_latency_ms = metrics.total_latency_ms / metrics.total_requests;
      provider.performance_metrics.success_rate = metrics.successful_requests / metrics.total_requests;
      provider.performance_metrics.last_updated = new Date();
    }
  }

  /**
   * Periodic cleanup and metrics collection
   */
  private startMetricsCollection(): void {
    setInterval(() => {
      this.collectMetrics();
    }, 60000); // Every minute
  }

  private startLoadBalancingCleanup(): void {
    setInterval(() => {
      // Reset per-minute counters
      this.providerLoadState.forEach((loadState) => {
        loadState.requests_this_minute = 0;
        loadState.tokens_used_this_minute = 0;
      });
    }, 60000); // Every minute
  }

  private async collectMetrics(): Promise<void> {
    // Emit metrics for monitoring
    this.providerMetrics.forEach((metrics, providerId) => {
      this.emit('provider_metrics', {
        provider_id: providerId,
        metrics: {
          ...metrics,
          current_requests: this.providerLoadState.get(providerId)?.current_requests || 0
        }
      });
    });
  }

  /**
   * Database operations (mock implementations)
   */
  private async storeRoutingDecision(requestId: string, decision: RoutingDecision): Promise<void> {
    // Mock implementation
    console.log(`Storing routing decision for request ${requestId}: ${decision.selected_provider.name}`);
  }

  private async storeAIResponse(response: AIResponse): Promise<void> {
    // Mock implementation
    console.log(`Storing AI response: ${response.success ? 'Success' : 'Failed'}`);
  }

  /**
   * Public API methods
   */
  getProviders(): AIProvider[] {
    return Array.from(this.providers.values());
  }

  getProviderMetrics(providerId?: string): any {
    if (providerId) {
      return this.providerMetrics.get(providerId);
    }
    return Object.fromEntries(this.providerMetrics);
  }

  getActiveRequests(): number {
    return this.activeRequests.size;
  }

  /**
   * Cleanup
   */
  destroy(): void {
    this.providers.clear();
    this.requestQueue.clear();
    this.activeRequests.clear();
    this.providerMetrics.clear();
    this.providerLoadState.clear();
    this.removeAllListeners();
  }
}

export default IntelligentAIRouter;