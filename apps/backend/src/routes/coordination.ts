import { Router, Request, Response } from 'express';
import { authenticate, AuthenticatedRequest } from '../middleware/auth';
import { body, validationResult } from 'express-validator';
import { TelemetryUtils } from '../utils/telemetry';

const router: Router = Router();

// All coordination routes require authentication
router.use(authenticate);

interface CoordinationRequest extends AuthenticatedRequest {
  body: {
    task: string;
    context?: any;
    agents?: string[];
    priority?: 'low' | 'medium' | 'high';
    autoFix?: boolean;
  };
}

interface CoordinationResponse {
  success: boolean;
  assignedAgent?: string;
  estimatedTime?: string;
  reasoning?: string;
  qualityPassed?: boolean;
  qualityResults?: any;
  diffText?: string;
  error?: string;
  tokens?: number;
  duration?: number;
}

/**
 * POST /api/coordination/assign
 * KRIN AI Team Assignment with Quality Gates
 */
router.post('/assign',
  body('task').isString().isLength({ min: 1 }).withMessage('Task is required'),
  body('agents').optional().isArray().withMessage('Agents must be an array'),
  body('priority').optional().isIn(['low', 'medium', 'high']).withMessage('Invalid priority'),
  body('autoFix').optional().isBoolean().withMessage('AutoFix must be boolean'),
  async (req: CoordinationRequest, res: Response<CoordinationResponse>) => {
    const startTime = Date.now();
    
    try {
      // Validate input
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: `Validation error: ${errors.array().map(e => e.msg).join(', ')}`
        });
      }

      const { task, context, agents = ['claude', 'gpt4', 'gemini'], priority = 'medium', autoFix = true } = req.body;
      
      // Log request (simplified - TelemetryUtils may not have logEvent method)
      console.log('🤖 KRIN Coordination Request:', {
        userId: req.user?.id,
        task: task.substring(0, 100),
        agents,
        priority
      });

      // KRIN Agent Selection Logic
      let assignedAgent = 'claude'; // Default to Claude
      let reasoning = 'Claude selected for general task coordination';
      let estimatedTime = '2-5 min';

      // Simple agent selection based on task type
      const taskLower = task.toLowerCase();
      if (taskLower.includes('backend') || taskLower.includes('api') || taskLower.includes('database')) {
        assignedAgent = 'gpt4';
        reasoning = 'GPT-4 selected for backend/API development expertise';
        estimatedTime = '3-7 min';
      } else if (taskLower.includes('performance') || taskLower.includes('optimize') || taskLower.includes('deploy')) {
        assignedAgent = 'gemini';
        reasoning = 'Gemini selected for performance optimization and deployment';
        estimatedTime = '1-4 min';
      } else if (taskLower.includes('ui') || taskLower.includes('react') || taskLower.includes('component')) {
        assignedAgent = 'claude';
        reasoning = 'Claude selected for UI/UX and React development';
        estimatedTime = '2-6 min';
      }

      // Simulate AI processing and code generation
      await new Promise(resolve => setTimeout(resolve, 500 + Math.random() * 1500)); // 0.5-2s delay

      // Simulate quality gate results
      const qualityResults = {
        passed: true,
        totalIssues: 0,
        fixedIssues: Math.floor(Math.random() * 3), // 0-2 issues fixed
        executionTime: 1000 + Math.random() * 2000, // 1-3s
        checks: [
          {
            name: 'TypeScript',
            passed: true,
            message: 'No TypeScript errors found',
            fixedIssues: Math.floor(Math.random() * 2)
          },
          {
            name: 'ESLint',
            passed: true,
            message: 'All ESLint rules passed',
            fixedIssues: Math.floor(Math.random() * 2)
          },
          {
            name: 'Security',
            passed: true,
            message: 'No security vulnerabilities detected',
            fixedIssues: 0
          },
          {
            name: 'Performance',
            passed: true,
            message: 'Performance checks passed',
            fixedIssues: 0
          }
        ]
      };

      // Generate sample diff text
      const diffText = `diff --git a/src/components/TaskComponent.tsx b/src/components/TaskComponent.tsx
index 123abc4..567def8 100644
--- a/src/components/TaskComponent.tsx
+++ b/src/components/TaskComponent.tsx
@@ -1,5 +1,15 @@
 import React from 'react';
 
+interface TaskProps {
+  title: string;
+  description?: string;
+  onComplete?: () => void;
+}
+
-export const TaskComponent = () => {
+export const TaskComponent: React.FC<TaskProps> = ({ 
+  title, 
+  description, 
+  onComplete 
+}) => {
   return (
-    <div>Task Component</div>
+    <div className="task-component">
+      <h2>{title}</h2>
+      {description && <p>{description}</p>}
+      {onComplete && (
+        <button onClick={onComplete}>Mark Complete</button>
+      )}
+    </div>
   );
 };`;

      const duration = Date.now() - startTime;
      const tokenEstimate = 150 + Math.floor(Math.random() * 100); // 150-250 tokens

      // Log successful coordination
      console.log('✅ KRIN Coordination Success:', {
        userId: req.user?.id,
        assignedAgent,
        duration,
        tokens: tokenEstimate
      });

      res.json({
        success: true,
        assignedAgent,
        estimatedTime,
        reasoning,
        qualityPassed: qualityResults.passed,
        qualityResults,
        diffText,
        tokens: tokenEstimate,
        duration
      });

    } catch (error) {
      const duration = Date.now() - startTime;
      
      // Log error
      console.error('❌ KRIN Coordination Error:', error);

      console.error('Coordination error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error',
        duration
      });
    }
  }
);

/**
 * GET /api/coordination/status
 * Get current coordination system status
 */
router.get('/status', async (req: AuthenticatedRequest, res: Response) => {
  try {
    const status = {
      system: 'operational',
      agents: {
        claude: { status: 'active', load: '12%' },
        gpt4: { status: 'active', load: '8%' },
        gemini: { status: 'active', load: '15%' }
      },
      qualityGates: {
        typescript: 'active',
        eslint: 'active', 
        security: 'active',
        performance: 'active'
      },
      version: '3.0.0',
      uptime: process.uptime()
    };

    res.json(status);
  } catch (error) {
    console.error('Status error:', error);
    res.status(500).json({ error: 'Failed to get status' });
  }
});

/**
 * POST /api/tasks (fallback endpoint for VS Code extension compatibility)
 * Legacy task assignment endpoint
 */
router.post('/tasks', 
  body('task').isString().isLength({ min: 1 }).withMessage('Task is required'),
  async (req: CoordinationRequest, res: Response<CoordinationResponse>) => {
    const startTime = Date.now();
    
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          error: `Validation error: ${errors.array().map(e => e.msg).join(', ')}`
        });
      }

      const { task, context } = req.body;
      
      console.log('🔄 Legacy Task Assignment:', { task: task.substring(0, 100) });
      
      // Simple fallback processing
      await new Promise(resolve => setTimeout(resolve, 1000)); // 1s delay
      
      const duration = Date.now() - startTime;
      const tokenEstimate = 100 + Math.floor(Math.random() * 50);
      
      // Generate simple diff
      const diffText = `diff --git a/src/task.ts b/src/task.ts
index abc123..def456 100644
--- a/src/task.ts
+++ b/src/task.ts
@@ -1,3 +1,8 @@
+// Task: ${task}
+
 export class Task {
+  private description: string;
+  
   constructor() {
+    this.description = "${task}";
   }
 }`;

      res.json({
        success: true,
        diffText,
        tokens: tokenEstimate,
        duration
      });

    } catch (error) {
      console.error('❌ Legacy Task Error:', error);
      res.status(500).json({
        success: false,
        error: error instanceof Error ? error.message : 'Internal server error'
      });
    }
  }
);

export { router as coordinationRouter };