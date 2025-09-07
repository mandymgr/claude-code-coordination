#!/usr/bin/env node

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import { createServer } from 'http';
import { WebSocketServer } from 'ws';
import path from 'path';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import authentication routes and middleware
import { authRouter } from './routes/auth';
import { analyticsRouter } from './routes/analytics';
import { collaborationRouter, setRealtimeService } from './routes/collaboration';
import { coordinationRouter } from './routes/coordination';
import codegenRouter from './routes/codegen';
import quantumRouter from './routes/quantum';
import blockchainRouter from './routes/blockchain';
import automlRouter from './routes/automl';
import voiceRouter from './routes/voice';
import performanceRouter from './routes/performance';
import { enterpriseRouter } from './routes/enterprise';
import { authenticate, authorize } from './middleware/auth';
import { healthChecker } from './middleware/healthCheck';
import RealtimeCollaborationService from './services/system-building/collaboration/realtimeService';
import { TelemetryUtils } from './utils/telemetry';

// Initialize OpenTelemetry if configured
if (process.env.OTEL_EXPORTER_OTLP_ENDPOINT) {
  const { NodeSDK } = require('@opentelemetry/sdk-node');
  const { getNodeAutoInstrumentations } = require('@opentelemetry/auto-instrumentations-node');
  const { Resource } = require('@opentelemetry/resources');
  const { SemanticResourceAttributes } = require('@opentelemetry/semantic-conventions');

  const sdk = new NodeSDK({
    resource: new Resource({
      [SemanticResourceAttributes.SERVICE_NAME]: 'claude-coordination',
      [SemanticResourceAttributes.SERVICE_VERSION]: process.env.SERVICE_VERSION || '1.0.0',
    }),
    instrumentations: [getNodeAutoInstrumentations()],
  });

  sdk.start();
  console.log('OpenTelemetry instrumentation started');
}

export class CoordinationServer {
  private app: express.Application;
  private server: any;
  private wss: WebSocketServer;
  private port: number;
  private realtimeService: RealtimeCollaborationService;

  constructor(port = parseInt(process.env.PORT || '8080')) {
    this.port = port;
    this.app = express();
    
    this.setupMiddleware();
    this.setupRoutes();
    this.setupWebSocket();
  }

  private setupMiddleware() {
    // Security middleware
    this.app.use(helmet({
      contentSecurityPolicy: {
        directives: {
          defaultSrc: ["'self'"],
          styleSrc: ["'self'", "'unsafe-inline'"],
          scriptSrc: ["'self'"],
          imgSrc: ["'self'", "data:", "https:"],
          connectSrc: ["'self'", "ws:", "wss:"],
        },
      },
    }));

    // CORS configuration
    this.app.use(cors({
      origin: process.env.NODE_ENV === 'production' 
        ? ['https://krins.dev', 'https://claude-coordination.krins.dev']
        : ['http://localhost:3000', 'http://localhost:5173'],
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
      allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    }));

    // Body parsing
    this.app.use(express.json({ limit: '10mb' }));
    this.app.use(express.urlencoded({ extended: true, limit: '10mb' }));
    this.app.use(cookieParser());

    // Request logging
    this.app.use((req, res, next) => {
      TelemetryUtils.addAttributes({
        'http.method': req.method,
        'http.url': req.url,
        'http.user_agent': req.get('User-Agent') || 'unknown'
      });
      next();
    });
  }

  private setupRoutes() {
    // Enhanced health check endpoints with comprehensive monitoring
    this.app.get('/health', healthChecker.healthCheckMiddleware.bind(healthChecker));
    this.app.get('/health/live', healthChecker.livenessProbe.bind(healthChecker));
    this.app.get('/health/ready', healthChecker.readinessProbe.bind(healthChecker));
    
    // Metrics endpoint for Prometheus scraping
    this.app.get('/metrics', (req, res) => {
      // In a real implementation, this would return Prometheus metrics
      res.setHeader('Content-Type', 'text/plain');
      res.send(`# HELP nodejs_version_info Node.js version info
# TYPE nodejs_version_info gauge
nodejs_version_info{version="${process.version}"} 1
# HELP process_uptime_seconds Process uptime in seconds
# TYPE process_uptime_seconds counter
process_uptime_seconds ${process.uptime()}
`);
    });

    // Authentication routes
    this.app.use('/api/auth', authRouter);

    // Analytics routes (protected)
    this.app.use('/api/analytics', analyticsRouter);

    // Collaboration routes (protected)
    this.app.use('/api/collaboration', collaborationRouter);

    // KRIN Coordination routes (protected)
    this.app.use('/api/coordination', coordinationRouter);
    
    // Legacy task assignment (fallback for VS Code extension)
    this.app.use('/api', coordinationRouter);

    // Code generation and refactoring routes (protected)
    this.app.use('/api/codegen', authenticate, codegenRouter);

    // Quantum computing routes (protected)
    this.app.use('/api/quantum', authenticate, quantumRouter);

    // Blockchain and Web3 routes (protected)
    this.app.use('/api/blockchain', authenticate, blockchainRouter);

    // AutoML and Neural Architecture Search routes (protected)
    this.app.use('/api/automl', authenticate, automlRouter);

    // Voice and Natural Language Interface routes (protected)
    this.app.use('/api/voice', authenticate, voiceRouter);

    // Performance monitoring and optimization routes (protected)
    this.app.use('/api/performance', authenticate, performanceRouter);

    // Enterprise features routes (protected)
    this.app.use('/api/enterprise', authenticate, enterpriseRouter);

    // Protected API routes (require authentication)
    this.app.use('/api/protected', authenticate);

    // Admin routes (require authentication + admin role)
    this.app.use('/api/admin', 
      authenticate,
      authorize('system', 'admin', { requireMFA: true })
    );

    // Legacy dashboard routes for backwards compatibility
    this.setupLegacyRoutes();

    // WebSocket upgrade path
    this.app.get('/ws', (req, res) => {
      return res.status(426).json({
        error: 'Upgrade Required',
        message: 'This endpoint requires WebSocket upgrade'
      });
    });

    // Serve static files
    const staticPath = path.join(__dirname, '../../../src');
    this.app.use(express.static(staticPath));

    // SPA fallback for dashboard
    this.app.get('*', (req, res) => {
      if (req.path.startsWith('/api/')) {
        return res.status(404).json({ error: 'API endpoint not found' });
      } else {
        res.sendFile(path.join(staticPath, 'dashboard.html'));
      }
    });

    // Error handling middleware
    this.app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
      console.error('Unhandled error:', err);
      
      TelemetryUtils.addAttributes({
        'error.name': err.name || 'Error',
        'error.message': err.message || 'Unknown error'
      });

      return res.status(err.status || 500).json({
        error: process.env.NODE_ENV === 'production' 
          ? 'Internal server error' 
          : err.message,
        code: err.code || 'SERVER_ERROR'
      });
    });
  }

  private setupLegacyRoutes() {
    // Keep existing dashboard routes for backwards compatibility
    this.app.get('/api/system', async (req, res) => {
      return TelemetryUtils.traceAsync('api.system', async () => {
        try {
          const systemData = {
            status: 'active',
            projects: [],
            agents: {
              available: ['claude', 'gpt4', 'gemini'],
              active: []
            },
            metrics: {
              requests: 0,
              success_rate: 100,
              avg_response_time: 0
            }
          };
          return res.json(systemData);
        } catch (error) {
          console.error('Error getting system data:', error);
          return res.status(500).json({ error: 'Failed to load system data' });
        }
      });
    });

    this.app.post('/api/cleanup', async (req, res) => {
      return TelemetryUtils.traceAsync('api.cleanup', async () => {
        try {
          // Legacy cleanup functionality
          console.log('Cleanup requested');
          return res.json({ success: true, message: 'Cleanup completed' });
        } catch (error) {
          console.error('Cleanup error:', error);
          return res.status(500).json({ error: 'Cleanup failed' });
        }
      });
    });
  }

  private setupWebSocket() {
    this.server = createServer(this.app);
    
    this.wss = new WebSocketServer({ 
      server: this.server,
      path: '/ws'
    });

    // Initialize real-time collaboration service
    this.realtimeService = new RealtimeCollaborationService(this.server);
    setRealtimeService(this.realtimeService);

    this.wss.on('connection', (ws, req) => {
      TelemetryUtils.traceAsync('websocket.connection', async () => {
        console.log('WebSocket connection established');
        
        // TODO: Add authentication for WebSocket connections
        // const token = req.url?.split('token=')[1];
        // const user = await authenticateWebSocketToken(token);

        ws.on('message', (message) => {
          try {
            const data = JSON.parse(message.toString());
            console.log('WebSocket message:', data);
            
            // Echo back for now
            ws.send(JSON.stringify({
              type: 'echo',
              data: data
            }));
          } catch (error) {
            console.error('WebSocket message error:', error);
            ws.send(JSON.stringify({
              type: 'error',
              error: 'Invalid message format'
            }));
          }
        });

        ws.on('close', () => {
          console.log('WebSocket connection closed');
        });

        ws.on('error', (error) => {
          console.error('WebSocket error:', error);
        });

        // Send welcome message
        ws.send(JSON.stringify({
          type: 'welcome',
          message: 'Connected to Claude Coordination Server'
        }));
      });
    });
  }

  public async start(): Promise<void> {
    return new Promise((resolve) => {
      this.server.listen(this.port, () => {
        console.log(`🚀 Claude Coordination Server running on port ${this.port}`);
        console.log(`📊 Dashboard: http://localhost:${this.port}`);
        console.log(`🔐 Auth API: http://localhost:${this.port}/api/auth`);
        console.log(`💬 WebSocket: ws://localhost:${this.port}/ws`);
        console.log(`🏥 Health Check: http://localhost:${this.port}/health`);
        resolve();
      });
    });
  }

  public async stop(): Promise<void> {
    return new Promise((resolve) => {
      // Cleanup collaboration service
      if (this.realtimeService) {
        this.realtimeService.destroy();
      }

      this.wss.close(() => {
        this.server.close(() => {
          console.log('Server stopped');
          resolve();
        });
      });
    });
  }
}

// Start server if this file is run directly
if (require.main === module) {
  const server = new CoordinationServer();
  
  // Graceful shutdown
  process.on('SIGINT', async () => {
    console.log('\nReceived SIGINT, shutting down gracefully...');
    await server.stop();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    console.log('\nReceived SIGTERM, shutting down gracefully...');
    await server.stop();
    process.exit(0);
  });

  server.start().catch((error) => {
    console.error('Failed to start server:', error);
    process.exit(1);
  });
}

export default CoordinationServer;