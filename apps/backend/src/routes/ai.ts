import { Router, Response } from 'express';
import { authenticate, authorize, AuthenticatedRequest } from '../middleware/auth';
import { TelemetryUtils } from '../utils/telemetry';
import { body, param, query, validationResult } from 'express-validator';
import rateLimit from 'express-rate-limit';
import IntelligentAIRouter, { AIRequest } from '../services/ai/intelligentRouter';
import AIOrchestrationService, { OrchestrationTask } from '../services/ai/orchestrationService';

const router: Router = Router();

// Rate limiting for AI endpoints
const aiRateLimit = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 50, // 50 AI requests per window per user
  message: { error: 'Too many AI requests', code: 'AI_RATE_LIMIT_EXCEEDED' },
  standardHeaders: true,
  legacyHeaders: false
});

// Expensive AI operations rate limit
const expensiveAIRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 expensive operations per window
  message: { error: 'Too many expensive AI operations', code: 'EXPENSIVE_AI_RATE_LIMIT' },
  standardHeaders: true,
  legacyHeaders: false
});

// All AI routes require authentication
router.use(authenticate);
router.use(aiRateLimit);

// Services will be injected by the main server
let aiRouter: IntelligentAIRouter | null = null;
let orchestrationService: AIOrchestrationService | null = null;

export const setAIServices = (router: IntelligentAIRouter, orchestrator: AIOrchestrationService) => {
  aiRouter = router;
  orchestrationService = orchestrator;
};

/**
 * GET /ai/providers
 * Get available AI providers and their capabilities
 */
router.get('/providers',
  authorize('ai', 'read'),
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    return TelemetryUtils.traceAsync('ai.get_providers', async () => {
      try {
        if (!aiRouter) {
          res.status(503).json({
            error: 'AI routing service not available',
            code: 'AI_SERVICE_UNAVAILABLE'
          });
          return;
        }

        const providers = aiRouter.getProviders();
        const sanitizedProviders = providers.map(provider => ({
          ...provider,
          api_key_encrypted: '***', // Don't expose API keys
          performance_metrics: provider.performance_metrics
        }));

        res.json({
          success: true,
          data: {
            providers: sanitizedProviders,
            count: sanitizedProviders.length,
            active_count: sanitizedProviders.filter(p => p.is_active).length
          }
        });

      } catch (error) {
        console.error('Get AI providers error:', error);
        res.status(500).json({
          error: 'Failed to get AI providers',
          code: 'GET_PROVIDERS_ERROR'
        });
      }
    });
  }
);

/**
 * POST /ai/route
 * Route an AI request to the optimal provider
 */
router.post('/route',
  authorize('ai', 'use'),
  [
    body('task_type').isIn(['code_generation', 'code_review', 'documentation', 'debugging', 'explanation', 'refactoring', 'testing', 'analysis', 'creative', 'reasoning']).withMessage('Valid task type required'),
    body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']).withMessage('Valid priority required'),
    body('content.prompt').isLength({ min: 1, max: 10000 }).withMessage('Prompt required (max 10000 chars)'),
    body('content.context').optional().isLength({ max: 50000 }).withMessage('Context max 50000 chars'),
    body('content.files').optional().isArray({ max: 10 }).withMessage('Max 10 files allowed'),
    body('constraints.max_tokens').optional().isInt({ min: 1, max: 8000 }).withMessage('Max tokens between 1-8000'),
    body('constraints.max_cost_usd').optional().isFloat({ min: 0, max: 10 }).withMessage('Max cost between $0-$10'),
    body('constraints.max_latency_ms').optional().isInt({ min: 1000, max: 300000 }).withMessage('Max latency between 1s-5min')
  ],
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    return TelemetryUtils.traceAsync('ai.route_request', async () => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          res.status(400).json({ 
            error: 'Validation failed',
            code: 'VALIDATION_ERROR',
            details: errors.array()
          });
          return;
        }

        if (!aiRouter) {
          res.status(503).json({
            error: 'AI routing service not available',
            code: 'AI_SERVICE_UNAVAILABLE'
          });
          return;
        }

        if (!req.user?.id || !req.user?.organization_id) {
          res.status(401).json({
            error: 'Authentication required',
            code: 'AUTH_REQUIRED'
          });
          return;
        }

        const aiRequest: AIRequest = {
          id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          user_id: req.user.id,
          organization_id: req.user.organization_id,
          task_type: req.body.task_type,
          priority: req.body.priority || 'medium',
          content: req.body.content,
          constraints: req.body.constraints || {},
          metadata: {
            project_id: req.body.metadata?.project_id,
            session_id: req.body.metadata?.session_id,
            collaboration_context: req.body.metadata?.collaboration_context
          },
          created_at: new Date()
        };

        const routingDecision = await aiRouter.routeRequest(aiRequest);

        res.json({
          success: true,
          data: {
            request_id: aiRequest.id,
            routing_decision: {
              selected_provider: {
                id: routingDecision.selected_provider.id,
                name: routingDecision.selected_provider.name,
                type: routingDecision.selected_provider.type
              },
              selected_model: routingDecision.selected_model,
              reasoning: routingDecision.reasoning,
              confidence_score: routingDecision.confidence_score,
              estimated_cost: routingDecision.estimated_cost,
              estimated_latency: routingDecision.estimated_latency,
              fallback_options: routingDecision.fallback_options.map(fb => ({
                provider_id: fb.provider.id,
                provider_name: fb.provider.name,
                model: fb.model
              }))
            }
          }
        });

      } catch (error) {
        console.error('AI routing error:', error);
        res.status(500).json({
          error: error instanceof Error ? error.message : 'Failed to route AI request',
          code: 'AI_ROUTING_ERROR'
        });
      }
    });
  }
);

/**
 * POST /ai/execute
 * Execute an AI request with routing
 */
router.post('/execute',
  authorize('ai', 'use'),
  expensiveAIRateLimit,
  [
    body('task_type').isIn(['code_generation', 'code_review', 'documentation', 'debugging', 'explanation', 'refactoring', 'testing', 'analysis', 'creative', 'reasoning']).withMessage('Valid task type required'),
    body('priority').optional().isIn(['low', 'medium', 'high', 'urgent']).withMessage('Valid priority required'),
    body('content.prompt').isLength({ min: 1, max: 10000 }).withMessage('Prompt required (max 10000 chars)'),
    body('auto_route').optional().isBoolean().withMessage('Auto route must be boolean')
  ],
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    return TelemetryUtils.traceAsync('ai.execute_request', async () => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          res.status(400).json({ 
            error: 'Validation failed',
            code: 'VALIDATION_ERROR',
            details: errors.array()
          });
          return;
        }

        if (!aiRouter) {
          res.status(503).json({
            error: 'AI routing service not available',
            code: 'AI_SERVICE_UNAVAILABLE'
          });
          return;
        }

        if (!req.user?.id || !req.user?.organization_id) {
          res.status(401).json({
            error: 'Authentication required',
            code: 'AUTH_REQUIRED'
          });
          return;
        }

        const aiRequest: AIRequest = {
          id: `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          user_id: req.user.id,
          organization_id: req.user.organization_id,
          task_type: req.body.task_type,
          priority: req.body.priority || 'medium',
          content: req.body.content,
          constraints: req.body.constraints || {},
          metadata: {
            project_id: req.body.metadata?.project_id,
            session_id: req.body.metadata?.session_id,
            collaboration_context: req.body.metadata?.collaboration_context
          },
          created_at: new Date()
        };

        // Route and execute
        const routingDecision = await aiRouter.routeRequest(aiRequest);
        const aiResponse = await aiRouter.executeRequest(aiRequest, routingDecision);

        res.json({
          success: true,
          data: {
            request_id: aiRequest.id,
            response: {
              content: aiResponse.response_content,
              success: aiResponse.success,
              error_message: aiResponse.error_message
            },
            provider_info: {
              provider_id: aiResponse.provider_id,
              model_used: aiResponse.model_used
            },
            metadata: {
              tokens_used: aiResponse.metadata.tokens_used,
              cost_usd: aiResponse.metadata.cost_usd,
              latency_ms: aiResponse.metadata.latency_ms,
              quality_indicators: aiResponse.metadata.quality_indicators
            },
            routing: {
              reasoning: routingDecision.reasoning,
              confidence_score: routingDecision.confidence_score
            }
          }
        });

      } catch (error) {
        console.error('AI execution error:', error);
        res.status(500).json({
          error: error instanceof Error ? error.message : 'Failed to execute AI request',
          code: 'AI_EXECUTION_ERROR'
        });
      }
    });
  }
);

/**
 * GET /ai/agents
 * Get available AI agents and their capabilities
 */
router.get('/agents',
  authorize('ai', 'read'),
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    return TelemetryUtils.traceAsync('ai.get_agents', async () => {
      try {
        if (!orchestrationService) {
          res.status(503).json({
            error: 'AI orchestration service not available',
            code: 'AI_ORCHESTRATION_UNAVAILABLE'
          });
          return;
        }

        const agents = orchestrationService.getAgents();

        res.json({
          success: true,
          data: {
            agents,
            count: agents.length,
            active_count: agents.filter(a => a.is_active).length,
            by_type: {
              specialist: agents.filter(a => a.type === 'specialist').length,
              generalist: agents.filter(a => a.type === 'generalist').length,
              reviewer: agents.filter(a => a.type === 'reviewer').length,
              coordinator: agents.filter(a => a.type === 'coordinator').length
            }
          }
        });

      } catch (error) {
        console.error('Get AI agents error:', error);
        res.status(500).json({
          error: 'Failed to get AI agents',
          code: 'GET_AGENTS_ERROR'
        });
      }
    });
  }
);

/**
 * POST /ai/orchestrate
 * Create and execute a multi-agent orchestrated task
 */
router.post('/orchestrate',
  authorize('ai', 'orchestrate'),
  expensiveAIRateLimit,
  [
    body('title').isLength({ min: 1, max: 255 }).withMessage('Title required (max 255 chars)'),
    body('description').isLength({ min: 1, max: 2000 }).withMessage('Description required (max 2000 chars)'),
    body('task_type').isIn(['single_agent', 'multi_agent_sequential', 'multi_agent_parallel', 'collaborative', 'hierarchical']).withMessage('Valid task type required'),
    body('complexity_level').isIn(['simple', 'medium', 'complex', 'expert']).withMessage('Valid complexity level required'),
    body('requirements.deliverables').isArray({ min: 1, max: 10 }).withMessage('1-10 deliverables required'),
    body('requirements.constraints.max_cost_usd').optional().isFloat({ min: 0, max: 50 }).withMessage('Max cost between $0-$50'),
    body('requirements.constraints.max_duration_minutes').optional().isInt({ min: 1, max: 300 }).withMessage('Max duration 1-300 minutes')
  ],
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    return TelemetryUtils.traceAsync('ai.orchestrate_task', async () => {
      try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
          res.status(400).json({ 
            error: 'Validation failed',
            code: 'VALIDATION_ERROR',
            details: errors.array()
          });
          return;
        }

        if (!orchestrationService) {
          res.status(503).json({
            error: 'AI orchestration service not available',
            code: 'AI_ORCHESTRATION_UNAVAILABLE'
          });
          return;
        }

        if (!req.user?.id || !req.user?.organization_id) {
          res.status(401).json({
            error: 'Authentication required',
            code: 'AUTH_REQUIRED'
          });
          return;
        }

        const orchestrationTask: OrchestrationTask = {
          id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          user_id: req.user.id,
          organization_id: req.user.organization_id,
          title: req.body.title,
          description: req.body.description,
          task_type: req.body.task_type,
          complexity_level: req.body.complexity_level,
          requirements: req.body.requirements,
          context: req.body.context || {},
          created_at: new Date(),
          updated_at: new Date()
        };

        // Plan execution
        const executionPlan = await orchestrationService.planExecution(orchestrationTask);

        // Execute if auto_execute is true, otherwise just return the plan
        if (req.body.auto_execute) {
          const executionResult = await orchestrationService.executeTask(orchestrationTask, executionPlan);
          
          res.json({
            success: true,
            data: {
              task_id: orchestrationTask.id,
              execution_plan: executionPlan,
              execution_result: {
                status: executionResult.status,
                final_output: executionResult.final_output,
                quality_assessment: executionResult.quality_assessment,
                step_results: executionResult.step_results.map(sr => ({
                  step_number: sr.step_number,
                  agent_id: sr.agent_id,
                  status: sr.status,
                  quality_score: sr.quality_score,
                  cost_usd: sr.cost_usd,
                  duration_minutes: sr.duration_minutes
                }))
              }
            }
          });
        } else {
          res.json({
            success: true,
            data: {
              task_id: orchestrationTask.id,
              execution_plan: executionPlan,
              message: 'Execution plan created. Use /ai/tasks/:id/execute to run the task.'
            }
          });
        }

      } catch (error) {
        console.error('AI orchestration error:', error);
        res.status(500).json({
          error: error instanceof Error ? error.message : 'Failed to orchestrate AI task',
          code: 'AI_ORCHESTRATION_ERROR'
        });
      }
    });
  }
);

/**
 * GET /ai/tasks
 * Get user's orchestration tasks
 */
router.get('/tasks',
  authorize('ai', 'read'),
  [
    query('status').optional().isIn(['running', 'completed', 'failed', 'cancelled']).withMessage('Valid status filter'),
    query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limit between 1-100'),
    query('offset').optional().isInt({ min: 0 }).withMessage('Offset must be non-negative')
  ],
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    return TelemetryUtils.traceAsync('ai.get_tasks', async () => {
      try {
        if (!orchestrationService) {
          res.status(503).json({
            error: 'AI orchestration service not available',
            code: 'AI_ORCHESTRATION_UNAVAILABLE'
          });
          return;
        }

        const activeTasks = orchestrationService.getActiveTasks();
        const taskHistory = orchestrationService.getTaskHistory();
        
        const allTasks = [...activeTasks, ...taskHistory];
        
        // Filter by status if provided
        const statusFilter = req.query.status as string;
        const filteredTasks = statusFilter 
          ? allTasks.filter(task => task.status === statusFilter)
          : allTasks;

        // Pagination
        const limit = parseInt(req.query.limit as string) || 20;
        const offset = parseInt(req.query.offset as string) || 0;
        const paginatedTasks = filteredTasks.slice(offset, offset + limit);

        res.json({
          success: true,
          data: {
            tasks: paginatedTasks.map(task => ({
              task_id: task.task_id,
              status: task.status,
              started_at: task.started_at,
              completed_at: task.completed_at,
              final_output: task.final_output,
              quality_assessment: task.quality_assessment
            })),
            pagination: {
              total: filteredTasks.length,
              limit,
              offset,
              has_more: offset + limit < filteredTasks.length
            },
            summary: {
              total_tasks: allTasks.length,
              running: allTasks.filter(t => t.status === 'running').length,
              completed: allTasks.filter(t => t.status === 'completed').length,
              failed: allTasks.filter(t => t.status === 'failed').length
            }
          }
        });

      } catch (error) {
        console.error('Get AI tasks error:', error);
        res.status(500).json({
          error: 'Failed to get AI tasks',
          code: 'GET_AI_TASKS_ERROR'
        });
      }
    });
  }
);

/**
 * GET /ai/tasks/:task_id
 * Get specific task details
 */
router.get('/tasks/:task_id',
  authorize('ai', 'read'),
  [
    param('task_id').isLength({ min: 1 }).withMessage('Task ID required')
  ],
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    return TelemetryUtils.traceAsync('ai.get_task_detail', async () => {
      try {
        if (!orchestrationService) {
          res.status(503).json({
            error: 'AI orchestration service not available',
            code: 'AI_ORCHESTRATION_UNAVAILABLE'
          });
          return;
        }

        const taskId = req.params.task_id;
        const activeTasks = orchestrationService.getActiveTasks();
        const taskHistory = orchestrationService.getTaskHistory();
        
        const task = [...activeTasks, ...taskHistory].find(t => t.task_id === taskId);
        
        if (!task) {
          res.status(404).json({
            error: 'Task not found',
            code: 'TASK_NOT_FOUND'
          });
          return;
        }

        res.json({
          success: true,
          data: {
            task,
            is_active: activeTasks.some(t => t.task_id === taskId)
          }
        });

      } catch (error) {
        console.error('Get task detail error:', error);
        res.status(500).json({
          error: 'Failed to get task details',
          code: 'GET_TASK_DETAIL_ERROR'
        });
      }
    });
  }
);

/**
 * DELETE /ai/tasks/:task_id
 * Cancel a running task
 */
router.delete('/tasks/:task_id',
  authorize('ai', 'manage'),
  [
    param('task_id').isLength({ min: 1 }).withMessage('Task ID required')
  ],
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    return TelemetryUtils.traceAsync('ai.cancel_task', async () => {
      try {
        if (!orchestrationService) {
          res.status(503).json({
            error: 'AI orchestration service not available',
            code: 'AI_ORCHESTRATION_UNAVAILABLE'
          });
          return;
        }

        const taskId = req.params.task_id;
        const cancelled = await orchestrationService.cancelTask(taskId);
        
        if (!cancelled) {
          res.status(404).json({
            error: 'Task not found or already completed',
            code: 'TASK_NOT_CANCELLABLE'
          });
          return;
        }

        res.json({
          success: true,
          message: 'Task cancelled successfully'
        });

      } catch (error) {
        console.error('Cancel task error:', error);
        res.status(500).json({
          error: 'Failed to cancel task',
          code: 'CANCEL_TASK_ERROR'
        });
      }
    });
  }
);

/**
 * GET /ai/metrics
 * Get AI system metrics and performance data
 */
router.get('/metrics',
  authorize('ai', 'read'),
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    return TelemetryUtils.traceAsync('ai.get_metrics', async () => {
      try {
        if (!aiRouter || !orchestrationService) {
          res.status(503).json({
            error: 'AI services not available',
            code: 'AI_SERVICES_UNAVAILABLE'
          });
          return;
        }

        const providerMetrics = aiRouter.getProviderMetrics();
        const activeTasks = orchestrationService.getActiveTasks();
        const agents = orchestrationService.getAgents();

        res.json({
          success: true,
          data: {
            routing: {
              active_requests: aiRouter.getActiveRequests(),
              provider_metrics: providerMetrics
            },
            orchestration: {
              active_tasks: activeTasks.length,
              available_agents: agents.filter(a => a.is_active).length,
              agent_performance: agents.map(agent => ({
                id: agent.id,
                name: agent.name,
                type: agent.type,
                performance: agent.performance_profile,
                is_active: agent.is_active
              }))
            },
            system_health: {
              timestamp: new Date(),
              overall_status: 'healthy',
              provider_availability: Object.values(providerMetrics).length > 0 ? 'good' : 'limited',
              agent_availability: agents.filter(a => a.is_active).length >= 3 ? 'good' : 'limited'
            }
          }
        });

      } catch (error) {
        console.error('Get AI metrics error:', error);
        res.status(500).json({
          error: 'Failed to get AI metrics',
          code: 'GET_AI_METRICS_ERROR'
        });
      }
    });
  }
);

export { router as aiRouter };