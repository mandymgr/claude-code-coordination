import { Router, Request, Response } from 'express';
import { AuthService } from '../services/auth/authService';
import { RBACService } from '../services/auth/rbacService';
import { AuditService } from '../services/auth/auditService';
import { authenticate, authorize, AuthenticatedRequest } from '../middleware/auth';
import { TelemetryUtils } from '../utils/telemetry';
import { body, validationResult } from 'express-validator';
import rateLimit from 'express-rate-limit';

const router: Router = Router();
const authService = new AuthService();
const rbacService = new RBACService();
const auditService = new AuditService();

// Rate limiting for auth endpoints
const authRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // 10 attempts per window
  message: { error: 'Too many authentication attempts', code: 'RATE_LIMIT_EXCEEDED' },
  standardHeaders: true,
  legacyHeaders: false
});

const loginRateLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5, // 5 login attempts per window
  message: { error: 'Too many login attempts', code: 'LOGIN_RATE_LIMIT_EXCEEDED' },
  standardHeaders: true,
  legacyHeaders: false
});

/**
 * POST /auth/login
 * Authenticate user with email/password
 */
router.post('/login', 
  loginRateLimit,
  [
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 1 }).withMessage('Password required'),
    body('mfa_code').optional().isLength({ min: 6, max: 6 }).withMessage('MFA code must be 6 digits')
  ],
  async (req: Request, res: Response): Promise<void> => {
    return TelemetryUtils.traceAsync('auth.routes.login', async () => {
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

        const { email, password, mfa_code, remember_me } = req.body;

        const result = await authService.authenticate({
          email,
          password,
          mfa_code,
          ip_address: req.ip,
          user_agent: req.get('User-Agent'),
          remember_me
        });

        if (!result.success) {
          res.status(401).json({
            error: result.error || 'Authentication failed',
            code: result.error_code || 'AUTH_FAILED',
            requires_mfa: result.requires_mfa
          });
          return;
        }

        // Set secure cookie for web clients
        if (result.tokens) {
          res.cookie('access_token', result.tokens.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: result.tokens.expires_in * 1000
          });

          if (result.tokens.refresh_token) {
            res.cookie('refresh_token', result.tokens.refresh_token, {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'strict',
              maxAge: 30 * 24 * 60 * 60 * 1000 // 30 days
            });
          }
        }

        res.json({
          success: true,
          user: result.user,
          tokens: result.tokens,
          session: result.session,
          requires_mfa: result.requires_mfa
        });
      } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({
          error: 'Internal server error',
          code: 'SERVER_ERROR'
        });
      }
    });
  }
);

/**
 * POST /auth/oauth/callback
 * Handle OAuth callback from providers
 */
router.post('/oauth/callback',
  authRateLimit,
  [
    body('provider').isIn(['google', 'microsoft', 'github']).withMessage('Valid OAuth provider required'),
    body('code').isLength({ min: 1 }).withMessage('Authorization code required'),
    body('state').optional().isLength({ min: 1 }).withMessage('State parameter required')
  ],
  async (req: Request, res: Response): Promise<void> => {
    return TelemetryUtils.traceAsync('auth.routes.oauth_callback', async () => {
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

        const { provider, code, state } = req.body;

        // Exchange code for token
        const tokenResult = await authService.exchangeOAuthCode(provider, code, state);
        if (!tokenResult.success) {
          res.status(400).json({
            error: tokenResult.error || 'OAuth exchange failed',
            code: 'OAUTH_EXCHANGE_FAILED'
          });
          return;
        }

        // Authenticate with OAuth token
        const result = await authService.authenticate({
          oauth_token: tokenResult.access_token,
          oauth_provider: provider,
          ip_address: req.ip,
          user_agent: req.get('User-Agent')
        });

        if (!result.success) {
          res.status(401).json({
            error: result.error || 'OAuth authentication failed',
            code: result.error_code || 'OAUTH_AUTH_FAILED'
          });
          return;
        }

        // Set cookies and return result
        if (result.tokens) {
          res.cookie('access_token', result.tokens.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: result.tokens.expires_in * 1000
          });
        }

        res.json({
          success: true,
          user: result.user,
          tokens: result.tokens,
          session: result.session
        });
      } catch (error) {
        console.error('OAuth callback error:', error);
        res.status(500).json({
          error: 'Internal server error',
          code: 'SERVER_ERROR'
        });
      }
    });
  }
);

/**
 * POST /auth/saml/callback
 * Handle SAML assertion callback
 */
router.post('/saml/callback',
  authRateLimit,
  [
    body('saml_response').isLength({ min: 1 }).withMessage('SAML response required'),
    body('relay_state').optional().isLength({ min: 1 })
  ],
  async (req: Request, res: Response): Promise<void> => {
    return TelemetryUtils.traceAsync('auth.routes.saml_callback', async () => {
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

        const { saml_response, relay_state } = req.body;

        const result = await authService.authenticate({
          saml_response,
          relay_state,
          ip_address: req.ip,
          user_agent: req.get('User-Agent')
        });

        if (!result.success) {
          res.status(401).json({
            error: result.error || 'SAML authentication failed',
            code: result.error_code || 'SAML_AUTH_FAILED'
          });
          return;
        }

        // Set cookies and return result
        if (result.tokens) {
          res.cookie('access_token', result.tokens.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: result.tokens.expires_in * 1000
          });
        }

        res.json({
          success: true,
          user: result.user,
          tokens: result.tokens,
          session: result.session
        });
      } catch (error) {
        console.error('SAML callback error:', error);
        res.status(500).json({
          error: 'Internal server error',
          code: 'SERVER_ERROR'
        });
      }
    });
  }
);

/**
 * POST /auth/refresh
 * Refresh access token using refresh token
 */
router.post('/refresh',
  authRateLimit,
  [
    body('refresh_token').optional().isLength({ min: 1 }).withMessage('Refresh token required')
  ],
  async (req: Request, res: Response): Promise<void> => {
    return TelemetryUtils.traceAsync('auth.routes.refresh', async () => {
      try {
        let refreshToken = req.body.refresh_token || req.cookies.refresh_token;

        if (!refreshToken) {
          res.status(400).json({
            error: 'Refresh token required',
            code: 'REFRESH_TOKEN_REQUIRED'
          });
          return;
        }

        const result = await authService.refreshTokens(refreshToken, req.ip);

        if (!result.success) {
          // Clear invalid cookies
          res.clearCookie('access_token');
          res.clearCookie('refresh_token');

          res.status(401).json({
            error: result.error || 'Token refresh failed',
            code: result.error_code || 'REFRESH_FAILED'
          });
          return;
        }

        // Set new cookies
        if (result.tokens) {
          res.cookie('access_token', result.tokens.access_token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'strict',
            maxAge: result.tokens.expires_in * 1000
          });

          if (result.tokens.refresh_token) {
            res.cookie('refresh_token', result.tokens.refresh_token, {
              httpOnly: true,
              secure: process.env.NODE_ENV === 'production',
              sameSite: 'strict',
              maxAge: 30 * 24 * 60 * 60 * 1000
            });
          }
        }

        res.json({
          success: true,
          tokens: result.tokens
        });
      } catch (error) {
        console.error('Token refresh error:', error);
        res.status(500).json({
          error: 'Internal server error',
          code: 'SERVER_ERROR'
        });
      }
    });
  }
);

/**
 * POST /auth/logout
 * Logout user and invalidate session
 */
router.post('/logout',
  authenticate,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    return TelemetryUtils.traceAsync('auth.routes.logout', async () => {
      try {
        if (req.user?.session_id) {
          await authService.invalidateSession(req.user.session_id, 'user_logout');
        }

        // Clear cookies
        res.clearCookie('access_token');
        res.clearCookie('refresh_token');

        res.json({ 
          success: true,
          message: 'Logged out successfully'
        });
      } catch (error) {
        console.error('Logout error:', error);
        res.status(500).json({
          error: 'Internal server error',
          code: 'SERVER_ERROR'
        });
      }
    });
  }
);

/**
 * GET /auth/me
 * Get current user information
 */
router.get('/me',
  authenticate,
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    return TelemetryUtils.traceAsync('auth.routes.me', async () => {
      try {
        if (!req.user) {
          res.status(401).json({
            error: 'Authentication required',
            code: 'AUTH_REQUIRED'
          });
          return;
        }

        // Get user permissions
        const permissions = await rbacService.getUserPermissions(req.user.id);

        res.json({
          user: {
            id: req.user.id,
            username: req.user.username,
            email: req.user.email,
            organization_id: req.user.organization_id,
            roles: req.user.roles,
            permissions: permissions.map(p => ({
              id: p.id,
              resource: p.resource,
              action: p.action,
              scope: p.scope
            }))
          },
          session: {
            id: req.session?.id,
            expires_at: req.session?.expires_at,
            mfa_verified: req.session?.mfa_verified
          }
        });
      } catch (error) {
        console.error('Get user info error:', error);
        res.status(500).json({
          error: 'Internal server error',
          code: 'SERVER_ERROR'
        });
      }
    });
  }
);

/**
 * POST /auth/mfa/verify
 * Verify MFA code for enhanced session
 */
router.post('/mfa/verify',
  authenticate,
  [
    body('mfa_code').isLength({ min: 6, max: 6 }).withMessage('MFA code must be 6 digits')
  ],
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    return TelemetryUtils.traceAsync('auth.routes.mfa_verify', async () => {
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

        if (!req.user?.session_id) {
          res.status(401).json({
            error: 'Authentication required',
            code: 'AUTH_REQUIRED'
          });
          return;
        }

        const { mfa_code } = req.body;

        const result = await authService.verifyMFA(req.user.id, mfa_code);

        if (!result.success) {
          res.status(400).json({
            error: result.error || 'MFA verification failed',
            code: 'MFA_VERIFICATION_FAILED'
          });
          return;
        }

        // Update session MFA status
        await authService.updateSessionMFA(req.user.session_id, true);

        res.json({
          success: true,
          message: 'MFA verified successfully'
        });
      } catch (error) {
        console.error('MFA verification error:', error);
        res.status(500).json({
          error: 'Internal server error',
          code: 'SERVER_ERROR'
        });
      }
    });
  }
);

/**
 * GET /auth/audit/events
 * Get audit events (admin only)
 */
router.get('/audit/events',
  authenticate,
  authorize('audit', 'read', { requireMFA: true }),
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    return TelemetryUtils.traceAsync('auth.routes.audit_events', async () => {
      try {
        const { 
          event_type, 
          start_date, 
          end_date, 
          user_id, 
          limit = 100, 
          offset = 0 
        } = req.query;

        const events = await auditService.getEvents({
          event_type: event_type as any,
          start_date: start_date ? new Date(start_date as string) : undefined,
          end_date: end_date ? new Date(end_date as string) : undefined,
          user_id: user_id as string,
          organization_id: req.user?.organization_id,
          limit: parseInt(limit as string),
          offset: parseInt(offset as string)
        });

        res.json({
          success: true,
          events: events.events,
          total: events.total_count,
          pagination: {
            limit: parseInt(limit as string),
            offset: parseInt(offset as string),
            has_more: events.events.length === parseInt(limit as string)
          }
        });
      } catch (error) {
        console.error('Get audit events error:', error);
        res.status(500).json({
          error: 'Internal server error',
          code: 'SERVER_ERROR'
        });
      }
    });
  }
);

/**
 * GET /auth/audit/export
 * Export audit events for compliance (admin only)
 */
router.get('/audit/export',
  authenticate,
  authorize('audit', 'export', { requireMFA: true }),
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    await TelemetryUtils.traceAsync('auth.routes.audit_export', async () => {
      try {
        const { 
          format = 'json', 
          start_date, 
          end_date,
          compliance_standard
        } = req.query;

        const exportData = await auditService.exportEvents({
          format: format as 'json' | 'csv' | 'xml',
          start_date: start_date ? new Date(start_date as string) : undefined,
          end_date: end_date ? new Date(end_date as string) : undefined,
          organization_id: req.user?.organization_id,
          compliance_standard: compliance_standard as string
        });

        // Set appropriate headers for file download
        const timestamp = new Date().toISOString().split('T')[0];
        const filename = `audit_export_${timestamp}.${format}`;
        
        res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
        res.setHeader('Content-Type', 
          format === 'csv' ? 'text/csv' : 
          format === 'xml' ? 'application/xml' : 
          'application/json'
        );

        res.send(exportData);
        return;
      } catch (error) {
        console.error('Audit export error:', error);
        res.status(500).json({
          error: 'Internal server error',
          code: 'SERVER_ERROR'
        });
        return;
      }
    });
    return;
  }
);

export { router as authRouter };