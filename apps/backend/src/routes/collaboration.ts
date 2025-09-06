import { Router, Response } from 'express';
import { authenticate, authorize, AuthenticatedRequest } from '../middleware/auth';
import { TelemetryUtils } from '../utils/telemetry';
import { body, param, query, validationResult } from 'express-validator';
import rateLimit from 'express-rate-limit';

const router: Router = Router();

// Rate limiting for collaboration endpoints
const collaborationRateLimit = rateLimit({
  windowMs: 1 * 60 * 1000, // 1 minute
  max: 200, // 200 requests per window
  message: { error: 'Too many collaboration requests', code: 'COLLABORATION_RATE_LIMIT' },
  standardHeaders: true,
  legacyHeaders: false
});

// All collaboration routes require authentication
router.use(authenticate);
router.use(collaborationRateLimit);

// Note: RealtimeCollaborationService will be injected by the main server
let realtimeService: any = null;

export const setRealtimeService = (service: any) => {
  realtimeService = service;
};

/**
 * POST /collaboration/sessions
 * Create a new collaboration session
 */
router.post('/sessions',
  authorize('collaborate', 'create'),
  [
    body('project_id').isUUID().withMessage('Valid project ID required'),
    body('session_name').isLength({ min: 1, max: 255 }).withMessage('Session name required (max 255 chars)'),
    body('session_type').isIn(['coding', 'review', 'planning', 'meeting']).withMessage('Valid session type required'),
    body('initial_participants').optional().isArray().withMessage('Initial participants must be an array'),
    body('initial_participants.*').optional().isUUID().withMessage('Participant IDs must be valid UUIDs')
  ],
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    return TelemetryUtils.traceAsync('collaboration.create_session', async () => {
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

        if (!realtimeService) {
          res.status(503).json({
            error: 'Collaboration service not available',
            code: 'SERVICE_UNAVAILABLE'
          });
          return;
        }

        if (!req.user?.id) {
          res.status(401).json({
            error: 'Authentication required',
            code: 'AUTH_REQUIRED'
          });
          return;
        }

        const { project_id, session_name, session_type, initial_participants } = req.body;

        const session = await realtimeService.createSession(req.user.id, {
          project_id,
          session_name,
          session_type,
          initial_participants
        });

        res.json({
          success: true,
          data: session
        });

      } catch (error) {
        console.error('Create session error:', error);
        res.status(500).json({
          error: error instanceof Error ? error.message : 'Failed to create session',
          code: 'CREATE_SESSION_ERROR'
        });
      }
    });
  }
);

/**
 * GET /collaboration/sessions
 * Get user's active collaboration sessions
 */
router.get('/sessions',
  authorize('collaborate', 'read'),
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    return TelemetryUtils.traceAsync('collaboration.get_sessions', async () => {
      try {
        if (!realtimeService) {
          res.status(503).json({
            error: 'Collaboration service not available',
            code: 'SERVICE_UNAVAILABLE'
          });
          return;
        }

        if (!req.user?.id) {
          res.status(401).json({
            error: 'Authentication required',
            code: 'AUTH_REQUIRED'
          });
          return;
        }

        const activeSessions = realtimeService.getActiveSessionsForUser(req.user.id);

        res.json({
          success: true,
          data: {
            sessions: activeSessions,
            count: activeSessions.length
          }
        });

      } catch (error) {
        console.error('Get sessions error:', error);
        res.status(500).json({
          error: 'Failed to get sessions',
          code: 'GET_SESSIONS_ERROR'
        });
      }
    });
  }
);

/**
 * POST /collaboration/sessions/:session_id/join
 * Join a collaboration session
 */
router.post('/sessions/:session_id/join',
  authorize('collaborate', 'join'),
  [
    param('session_id').isLength({ min: 1 }).withMessage('Session ID required')
  ],
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    return TelemetryUtils.traceAsync('collaboration.join_session', async () => {
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

        if (!realtimeService) {
          res.status(503).json({
            error: 'Collaboration service not available',
            code: 'SERVICE_UNAVAILABLE'
          });
          return;
        }

        if (!req.user?.id) {
          res.status(401).json({
            error: 'Authentication required',
            code: 'AUTH_REQUIRED'
          });
          return;
        }

        const { session_id } = req.params;

        await realtimeService.joinSession(req.user.id, session_id);

        res.json({
          success: true,
          message: 'Successfully joined session'
        });

      } catch (error) {
        console.error('Join session error:', error);
        res.status(500).json({
          error: error instanceof Error ? error.message : 'Failed to join session',
          code: 'JOIN_SESSION_ERROR'
        });
      }
    });
  }
);

/**
 * GET /collaboration/users/online
 * Get connected users in the organization
 */
router.get('/users/online',
  authorize('collaborate', 'read'),
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    return TelemetryUtils.traceAsync('collaboration.get_online_users', async () => {
      try {
        if (!realtimeService) {
          res.status(503).json({
            error: 'Collaboration service not available',
            code: 'SERVICE_UNAVAILABLE'
          });
          return;
        }

        if (!req.user?.organization_id) {
          res.status(400).json({
            error: 'Organization context required',
            code: 'ORGANIZATION_REQUIRED'
          });
          return;
        }

        const connectedUsers = realtimeService.getConnectedUsersInOrganization(req.user.organization_id);

        res.json({
          success: true,
          data: {
            users: connectedUsers,
            count: connectedUsers.length
          }
        });

      } catch (error) {
        console.error('Get online users error:', error);
        res.status(500).json({
          error: 'Failed to get online users',
          code: 'GET_ONLINE_USERS_ERROR'
        });
      }
    });
  }
);

/**
 * GET /collaboration/users/:user_id/status
 * Check if a user is online
 */
router.get('/users/:user_id/status',
  authorize('collaborate', 'read'),
  [
    param('user_id').isUUID().withMessage('Valid user ID required')
  ],
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    return TelemetryUtils.traceAsync('collaboration.check_user_status', async () => {
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

        if (!realtimeService) {
          res.status(503).json({
            error: 'Collaboration service not available',
            code: 'SERVICE_UNAVAILABLE'
          });
          return;
        }

        const { user_id } = req.params;
        const isConnected = realtimeService.isUserConnected(user_id);

        res.json({
          success: true,
          data: {
            user_id,
            is_online: isConnected,
            status: isConnected ? 'online' : 'offline'
          }
        });

      } catch (error) {
        console.error('Check user status error:', error);
        res.status(500).json({
          error: 'Failed to check user status',
          code: 'CHECK_USER_STATUS_ERROR'
        });
      }
    });
  }
);

/**
 * GET /collaboration/sessions/:session_id/history
 * Get collaboration session history
 */
router.get('/sessions/:session_id/history',
  authorize('collaborate', 'read'),
  [
    param('session_id').isLength({ min: 1 }).withMessage('Session ID required'),
    query('message_types').optional().isString().withMessage('Message types must be a comma-separated string'),
    query('limit').optional().isInt({ min: 1, max: 1000 }).withMessage('Limit must be between 1 and 1000'),
    query('offset').optional().isInt({ min: 0 }).withMessage('Offset must be non-negative')
  ],
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    return TelemetryUtils.traceAsync('collaboration.get_session_history', async () => {
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

        const { session_id } = req.params;
        const { message_types, limit = '100', offset = '0' } = req.query;

        // Parse message types
        const messageTypesArray = message_types 
          ? (message_types as string).split(',').map(t => t.trim())
          : undefined;

        // Mock implementation - in real system would query database
        const mockHistory = {
          session_id,
          messages: [],
          total_count: 0,
          filters: {
            message_types: messageTypesArray,
            limit: parseInt(limit as string),
            offset: parseInt(offset as string)
          }
        };

        res.json({
          success: true,
          data: mockHistory
        });

      } catch (error) {
        console.error('Get session history error:', error);
        res.status(500).json({
          error: 'Failed to get session history',
          code: 'GET_SESSION_HISTORY_ERROR'
        });
      }
    });
  }
);

/**
 * POST /collaboration/sessions/:session_id/invite
 * Invite users to a collaboration session
 */
router.post('/sessions/:session_id/invite',
  authorize('collaborate', 'invite'),
  [
    param('session_id').isLength({ min: 1 }).withMessage('Session ID required'),
    body('user_ids').isArray({ min: 1 }).withMessage('User IDs array required'),
    body('user_ids.*').isUUID().withMessage('All user IDs must be valid UUIDs'),
    body('message').optional().isLength({ max: 500 }).withMessage('Invitation message max 500 chars')
  ],
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    return TelemetryUtils.traceAsync('collaboration.invite_users', async () => {
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

        if (!realtimeService) {
          res.status(503).json({
            error: 'Collaboration service not available',
            code: 'SERVICE_UNAVAILABLE'
          });
          return;
        }

        if (!req.user?.id) {
          res.status(401).json({
            error: 'Authentication required',
            code: 'AUTH_REQUIRED'
          });
          return;
        }

        const { session_id } = req.params;
        const { user_ids, message } = req.body;

        // Mock invitation process - in real system would send actual invitations
        const invitations = user_ids.map((userId: string) => ({
          session_id,
          user_id: userId,
          inviter_id: req.user!.id,
          message,
          invited_at: new Date(),
          status: 'pending'
        }));

        res.json({
          success: true,
          data: {
            invitations,
            count: invitations.length,
            message: `Sent ${invitations.length} invitation(s)`
          }
        });

      } catch (error) {
        console.error('Invite users error:', error);
        res.status(500).json({
          error: 'Failed to invite users',
          code: 'INVITE_USERS_ERROR'
        });
      }
    });
  }
);

/**
 * GET /collaboration/stats
 * Get collaboration statistics
 */
router.get('/stats',
  authorize('collaborate', 'read'),
  [
    query('period_days').optional().isInt({ min: 1, max: 365 }).withMessage('Period must be between 1 and 365 days')
  ],
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    return TelemetryUtils.traceAsync('collaboration.get_stats', async () => {
      try {
        if (!req.user?.organization_id) {
          res.status(400).json({
            error: 'Organization context required',
            code: 'ORGANIZATION_REQUIRED'
          });
          return;
        }

        const periodDays = parseInt(req.query.period_days as string) || 30;

        // Mock collaboration statistics
        const stats = {
          organization_id: req.user.organization_id,
          period: {
            days: periodDays,
            start_date: new Date(Date.now() - periodDays * 24 * 60 * 60 * 1000),
            end_date: new Date()
          },
          sessions: {
            total_sessions: 45,
            active_sessions: realtimeService ? Object.keys(realtimeService.activeSessions || {}).length : 0,
            avg_session_duration_minutes: 67.5,
            most_popular_session_type: 'coding'
          },
          users: {
            total_collaborative_users: 23,
            currently_online: realtimeService ? realtimeService.getConnectedUsersInOrganization(req.user.organization_id).length : 0,
            avg_concurrent_users: 8.2
          },
          activity: {
            total_messages: 1247,
            code_edits: 389,
            code_reviews: 56,
            chat_messages: 802
          },
          productivity: {
            collaboration_time_percentage: 34.5,
            pair_programming_sessions: 12,
            code_review_sessions: 18,
            planning_sessions: 15
          }
        };

        res.json({
          success: true,
          data: stats
        });

      } catch (error) {
        console.error('Get collaboration stats error:', error);
        res.status(500).json({
          error: 'Failed to get collaboration statistics',
          code: 'GET_COLLABORATION_STATS_ERROR'
        });
      }
    });
  }
);

/**
 * WebSocket connection info endpoint
 */
router.get('/ws/info',
  authorize('collaborate', 'read'),
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    try {
      if (!req.user?.id) {
        res.status(401).json({
          error: 'Authentication required',
          code: 'AUTH_REQUIRED'
        });
        return;
      }

      // Generate a temporary JWT token for WebSocket authentication
      const jwt = require('jsonwebtoken');
      const wsToken = jwt.sign(
        { 
          user_id: req.user.id,
          organization_id: req.user.organization_id,
          purpose: 'websocket_auth'
        },
        process.env.JWT_SECRET!,
        { expiresIn: '1h' }
      );

      res.json({
        success: true,
        data: {
          websocket_url: `ws://${req.get('host')}/ws/collaboration`,
          token: wsToken,
          user_id: req.user.id,
          expires_in: 3600
        }
      });

    } catch (error) {
      console.error('Get WebSocket info error:', error);
      res.status(500).json({
        error: 'Failed to get WebSocket connection info',
        code: 'WEBSOCKET_INFO_ERROR'
      });
    }
  }
);

export { router as collaborationRouter };