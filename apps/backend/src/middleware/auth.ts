import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/auth/authService';
import { RBACService } from '../services/auth/rbacService';
import { AuditService, AuditEventType } from '../services/auth/auditService';
import { TelemetryUtils } from '../utils/telemetry';
import jwt from 'jsonwebtoken';

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string;
    username: string;
    email: string;
    organization_id: string;
    roles: string[];
    permissions: string[];
    session_id: string;
  };
  session?: {
    id: string;
    expires_at: Date;
    mfa_verified: boolean;
    organization_id: string;
  };
}

export class AuthMiddleware {
  private authService: AuthService;
  private rbacService: RBACService;
  private auditService: AuditService;

  constructor() {
    this.authService = new AuthService();
    this.rbacService = new RBACService();
    this.auditService = new AuditService();
  }

  /**
   * JWT Authentication Middleware
   */
  authenticate = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    await TelemetryUtils.traceAsync('auth.middleware.authenticate', async () => {
      try {
        const token = this.extractToken(req);
        
        if (!token) {
          await this.auditService.logEvent({
            event_type: AuditEventType.AUTH_LOGIN_FAILED,
            resource_type: 'api',
            action: 'access_attempt',
            outcome: 'failure',
            details: {
              description: 'Authentication failed - missing token',
              additional_context: {
                ip_address: req.ip,
                user_agent: req.get('User-Agent'),
                endpoint: req.path,
                reason: 'missing_token'
              }
            }
          });

          res.status(401).json({ 
            error: 'Authentication required',
            code: 'AUTH_REQUIRED'
          });
          return;
        }

        // Verify JWT token
        const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
        const sessionId = decoded.session_id;

        // Validate session
        const session = await this.authService.getSession(sessionId);
        if (!session || !session.is_active || new Date(session.expires_at) < new Date()) {
          await this.auditService.logEvent({
            event_type: AuditEventType.AUTH_LOGIN_FAILED,
            resource_type: 'api',
            action: 'access_attempt',
            outcome: 'failure',
            details: {
              description: 'Authentication failed - invalid session',
              additional_context: {
                user_id: decoded.user_id,
                session_id: sessionId,
                ip_address: req.ip,
                user_agent: req.get('User-Agent'),
                endpoint: req.path,
                reason: 'invalid_session'
              }
            }
          });

          res.status(401).json({
            error: 'Invalid or expired session',
            code: 'SESSION_INVALID'
          });
          return;
        }

        // Get user details
        const user = await this.authService.getUser(decoded.user_id);
        if (!user || user.status !== 'active') {
          await this.auditService.logEvent({
            event_type: AuditEventType.AUTH_LOGIN_FAILED,
            resource_type: 'api',
            action: 'access_attempt',
            outcome: 'failure',
            details: {
              description: 'Authentication failed - user inactive',
              additional_context: {
                user_id: decoded.user_id,
                session_id: sessionId,
                ip_address: req.ip,
                user_agent: req.get('User-Agent'),
                endpoint: req.path,
                reason: 'user_inactive'
              }
            }
          });

          res.status(403).json({
            error: 'User account is inactive',
            code: 'USER_INACTIVE'
          });
          return;
        }

        // Attach user and session to request
        req.user = {
          id: user.id,
          username: user.username,
          email: user.email,
          organization_id: user.organization_id || '',
          roles: user.role ? [user.role.name] : [],
          permissions: [], // Will be populated by RBAC middleware if needed
          session_id: sessionId
        };

        req.session = {
          id: sessionId,
          expires_at: new Date(session.expires_at),
          mfa_verified: session.mfa_verified,
          organization_id: session.organization_id
        };

        // Update session activity (commented out until method is implemented)
        // await this.authService.updateSessionActivity(sessionId, req.ip, req.get('User-Agent'));

        next();
      } catch (error) {
        await this.auditService.logEvent({
          event_type: AuditEventType.AUTH_LOGIN_FAILED,
          resource_type: 'api',
          action: 'access_attempt',
          outcome: 'failure',
          details: {
            description: 'Authentication failed - system error',
            error_message: error instanceof Error ? error.message : 'Unknown error',
            additional_context: {
              ip_address: req.ip,
              user_agent: req.get('User-Agent'),
              endpoint: req.path,
              reason: 'auth_error'
            }
          }
        });

        res.status(401).json({
          error: 'Authentication failed',
          code: 'AUTH_FAILED'
        });
        return;
      }
    });
  };

  /**
   * Role-based Authorization Middleware
   */
  authorize = (resource: string, action: string, options?: { 
    requireMFA?: boolean;
    organizationScope?: boolean;
  }) => {
    return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
      await TelemetryUtils.traceAsync('auth.middleware.authorize', async () => {
        try {
          if (!req.user) {
            res.status(401).json({ 
              error: 'Authentication required',
              code: 'AUTH_REQUIRED'
            });
            return;
          }

          // Check MFA requirement
          if (options?.requireMFA && !req.session?.mfa_verified) {
            await this.auditService.logEvent({
              event_type: AuditEventType.AUTH_LOGIN_FAILED,
              resource_type: resource,
              action: action,
              outcome: 'failure',
              details: {
                description: 'Authorization failed - MFA required',
                additional_context: {
                  user_id: req.user.id,
                  session_id: req.user.session_id,
                  ip_address: req.ip,
                  endpoint: req.path,
                  reason: 'mfa_required'
                }
              }
            });

            res.status(403).json({
              error: 'Multi-factor authentication required',
              code: 'MFA_REQUIRED'
            });
            return;
          }

          // Prepare access context
          const context = {
            user_id: req.user.id,
            organization_id: req.user.organization_id,
            session_id: req.user.session_id,
            ip_address: req.ip,
            time_of_day: new Date().getHours(),
            endpoint: req.path,
            method: req.method
          };

          // Check RBAC permissions
          const accessResult = await this.rbacService.checkAccess(
            req.user.id,
            resource,
            action,
            context
          );

          if (!accessResult.allowed) {
            await this.auditService.logEvent({
              event_type: AuditEventType.AUTH_LOGIN_FAILED,
              resource_type: resource,
              action: action,
              outcome: 'failure',
              details: {
                description: 'Authorization failed - insufficient permissions',
                additional_context: {
                  user_id: req.user.id,
                  session_id: req.user.session_id,
                  organization_id: req.user.organization_id,
                  ip_address: req.ip,
                  endpoint: req.path,
                  reason: 'insufficient_permissions'
                }
              }
            });

            res.status(403).json({
              error: 'Insufficient permissions',
              code: 'ACCESS_DENIED',
              resource,
              action
            });
            return;
          }

          // Log successful authorization
          await this.auditService.logEvent({
            event_type: AuditEventType.AUTH_LOGIN,
            resource_type: resource,
            action: action,
            outcome: 'success',
            details: {
              description: 'Authorization successful',
              additional_context: {
                user_id: req.user.id,
                session_id: req.user.session_id,
                organization_id: req.user.organization_id,
                ip_address: req.ip,
                endpoint: req.path,
                matched_permission: accessResult.matched_permission?.id
              }
            }
          });

          // Attach permissions to user object
          if (accessResult.matched_permission) {
            req.user.permissions.push(accessResult.matched_permission.id);
          }

          next();
        } catch (error) {
          await this.auditService.logEvent({
            event_type: AuditEventType.AUTH_LOGIN_FAILED,
            resource_type: resource,
            action: action,
            outcome: 'failure',
            details: {
              description: 'Authorization failed - system error',
              error_message: error instanceof Error ? error.message : 'Unknown error',
              additional_context: {
                user_id: req.user?.id,
                session_id: req.user?.session_id,
                ip_address: req.ip,
                endpoint: req.path,
                reason: 'authorization_error'
              }
            }
          });

          res.status(500).json({
            error: 'Authorization check failed',
            code: 'AUTH_CHECK_FAILED'
          });
          return;
        }
      });
    };
  };

  /**
   * Organization Scope Middleware
   */
  organizationScope = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
    await TelemetryUtils.traceAsync('auth.middleware.organization_scope', async () => {
      if (!req.user) {
        res.status(401).json({ 
          error: 'Authentication required',
          code: 'AUTH_REQUIRED'
        });
        return;
      }

      // Add organization filter to query parameters
      req.query.organization_id = req.user.organization_id;
      
      next();
    });
  };

  /**
   * Rate Limiting by User
   */
  userRateLimit = (maxRequests: number, windowMs: number) => {
    const requests = new Map<string, { count: number; resetTime: number }>();

    return async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
      if (!req.user) {
        next();
        return;
      }

      const userId = req.user.id;
      const now = Date.now();
      const userRequests = requests.get(userId) || { count: 0, resetTime: now + windowMs };

      if (now > userRequests.resetTime) {
        userRequests.count = 1;
        userRequests.resetTime = now + windowMs;
      } else {
        userRequests.count++;
      }

      requests.set(userId, userRequests);

      if (userRequests.count > maxRequests) {
        await this.auditService.logEvent({
          event_type: AuditEventType.SYSTEM_ERROR,
          resource_type: 'api',
          action: 'rate_limit_exceeded',
          outcome: 'failure',
          details: {
            description: 'Security event - rate limit exceeded',
            additional_context: {
              user_id: userId,
              session_id: req.user.session_id,
              ip_address: req.ip,
              endpoint: req.path,
              request_count: userRequests.count,
              max_requests: maxRequests
            }
          }
        });

        res.status(429).json({
          error: 'Rate limit exceeded',
          code: 'RATE_LIMIT_EXCEEDED',
          retry_after: Math.ceil((userRequests.resetTime - now) / 1000)
        });
        return;
      }

      next();
    };
  };

  /**
   * Extract JWT token from request
   */
  private extractToken(req: Request): string | null {
    const authHeader = req.get('Authorization');
    if (authHeader?.startsWith('Bearer ')) {
      return authHeader.substring(7);
    }

    // Also check cookies for web clients
    const cookieToken = req.cookies?.access_token;
    if (cookieToken) {
      return cookieToken;
    }

    return null;
  }
}

// Export middleware instance and individual middlewares
export const authMiddleware = new AuthMiddleware();

// Convenience exports
export const authenticate = authMiddleware.authenticate;
export const authorize = authMiddleware.authorize;
export const organizationScope = authMiddleware.organizationScope;
export const userRateLimit = authMiddleware.userRateLimit;