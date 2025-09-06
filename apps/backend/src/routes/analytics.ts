import { Router, Response } from 'express';
import { authenticate, authorize, AuthenticatedRequest } from '../middleware/auth';
import { metricsCollector } from '../services/analytics/metricsCollector';
import { TelemetryUtils } from '../utils/telemetry';
import { query, param, validationResult } from 'express-validator';
import rateLimit from 'express-rate-limit';

const router: Router = Router();

// Rate limiting for analytics endpoints
const analyticsRateLimit = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutes
  max: 100, // 100 requests per window
  message: { error: 'Too many analytics requests', code: 'ANALYTICS_RATE_LIMIT' },
  standardHeaders: true,
  legacyHeaders: false
});

// All analytics routes require authentication
router.use(authenticate);
router.use(analyticsRateLimit);

/**
 * GET /analytics/dashboard
 * Get real-time dashboard data
 */
router.get('/dashboard',
  authorize('analytics', 'read'),
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    return TelemetryUtils.traceAsync('analytics.dashboard', async () => {
      try {
        if (!req.user?.organization_id) {
          res.status(400).json({
            error: 'Organization context required',
            code: 'ORGANIZATION_REQUIRED'
          });
          return;
        }

        const dashboardData = await metricsCollector.getDashboardData(req.user.organization_id);

        res.json({
          success: true,
          data: dashboardData,
          timestamp: new Date().toISOString()
        });
      } catch (error) {
        console.error('Dashboard data error:', error);
        res.status(500).json({
          error: 'Failed to load dashboard data',
          code: 'DASHBOARD_ERROR'
        });
      }
    });
  }
);

/**
 * GET /analytics/productivity
 * Get productivity metrics for a specific period
 */
router.get('/productivity',
  authorize('analytics', 'read'),
  [
    query('period').optional().isISO8601().withMessage('Period must be valid ISO 8601 date'),
    query('days').optional().isInt({ min: 1, max: 365 }).withMessage('Days must be between 1 and 365')
  ],
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    return TelemetryUtils.traceAsync('analytics.productivity', async () => {
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

        if (!req.user?.organization_id) {
          res.status(400).json({
            error: 'Organization context required',
            code: 'ORGANIZATION_REQUIRED'
          });
          return;
        }

        const period = req.query.period ? new Date(req.query.period as string) : new Date();
        const days = parseInt(req.query.days as string) || 30;

        // Calculate productivity metrics for the specified period
        const productivityMetrics = await metricsCollector.calculateProductivityMetrics(
          req.user.organization_id,
          period
        );

        // Get historical data for trend analysis
        const historicalData = [];
        for (let i = 1; i <= days; i++) {
          const historicalDate = new Date(period);
          historicalDate.setDate(historicalDate.getDate() - i);
          
          try {
            const historical = await metricsCollector.calculateProductivityMetrics(
              req.user.organization_id,
              historicalDate
            );
            historicalData.push(historical);
          } catch (error) {
            // Skip missing data points
            continue;
          }
        }

        // Calculate trends
        const trends = {
          completion_rate_trend: calculateTrend(historicalData.map(h => h.completion_rate)),
          ai_assistance_trend: calculateTrend(historicalData.map(h => h.ai_assistance_rate)),
          quality_trend: calculateTrend(historicalData.map(h => h.code_quality_score)),
          deployment_trend: calculateTrend(historicalData.map(h => h.deployment_success_rate))
        };

        res.json({
          success: true,
          data: {
            current: productivityMetrics,
            historical: historicalData.reverse(), // Most recent first
            trends,
            period: {
              start: new Date(period.getTime() - (days * 24 * 60 * 60 * 1000)),
              end: period,
              days
            }
          }
        });
      } catch (error) {
        console.error('Productivity metrics error:', error);
        res.status(500).json({
          error: 'Failed to load productivity metrics',
          code: 'PRODUCTIVITY_ERROR'
        });
      }
    });
  }
);

/**
 * GET /analytics/roi
 * Get ROI calculations and analysis
 */
router.get('/roi',
  authorize('analytics', 'read'),
  [
    query('period_start').optional().isISO8601().withMessage('Period start must be valid ISO 8601 date'),
    query('period_end').optional().isISO8601().withMessage('Period end must be valid ISO 8601 date'),
    query('calculation_type').optional().isIn(['time_saved', 'cost_reduction', 'revenue_increase', 'efficiency_gain']).withMessage('Invalid calculation type')
  ],
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    return TelemetryUtils.traceAsync('analytics.roi', async () => {
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

        if (!req.user?.organization_id) {
          res.status(400).json({
            error: 'Organization context required',
            code: 'ORGANIZATION_REQUIRED'
          });
          return;
        }

        // Default to last 30 days
        const defaultEndDate = new Date();
        const defaultStartDate = new Date();
        defaultStartDate.setDate(defaultStartDate.getDate() - 30);

        const periodStart = req.query.period_start ? new Date(req.query.period_start as string) : defaultStartDate;
        const periodEnd = req.query.period_end ? new Date(req.query.period_end as string) : defaultEndDate;
        const calculationType = req.query.calculation_type as string;

        // Calculate ROI for the period
        const roiCalculations = await metricsCollector.calculateROI(
          req.user.organization_id,
          periodStart,
          periodEnd
        );

        // Filter by calculation type if specified
        const filteredCalculations = calculationType 
          ? roiCalculations.filter(calc => calc.calculation_type === calculationType)
          : roiCalculations;

        // Calculate summary statistics
        const summary = {
          total_roi_percentage: filteredCalculations.reduce((sum, calc) => sum + calc.roi_percentage, 0),
          average_roi_percentage: filteredCalculations.length > 0 
            ? filteredCalculations.reduce((sum, calc) => sum + calc.roi_percentage, 0) / filteredCalculations.length
            : 0,
          total_value_created: filteredCalculations.reduce((sum, calc) => sum + (calc.current_value - calc.baseline_value), 0),
          confidence_score: filteredCalculations.length > 0
            ? filteredCalculations.reduce((sum, calc) => sum + calc.confidence_score, 0) / filteredCalculations.length
            : 0,
          by_category: {
            time_saved: filteredCalculations.filter(c => c.calculation_type === 'time_saved').length,
            cost_reduction: filteredCalculations.filter(c => c.calculation_type === 'cost_reduction').length,
            revenue_increase: filteredCalculations.filter(c => c.calculation_type === 'revenue_increase').length,
            efficiency_gain: filteredCalculations.filter(c => c.calculation_type === 'efficiency_gain').length
          }
        };

        res.json({
          success: true,
          data: {
            calculations: filteredCalculations,
            summary,
            period: {
              start: periodStart,
              end: periodEnd
            }
          }
        });
      } catch (error) {
        console.error('ROI calculation error:', error);
        res.status(500).json({
          error: 'Failed to calculate ROI',
          code: 'ROI_ERROR'
        });
      }
    });
  }
);

/**
 * GET /analytics/metrics/:metric_name
 * Get specific business metrics over time
 */
router.get('/metrics/:metric_name',
  authorize('analytics', 'read'),
  [
    param('metric_name').isAlphanumeric().withMessage('Metric name must be alphanumeric'),
    query('period_type').optional().isIn(['hour', 'day', 'week', 'month', 'quarter', 'year']).withMessage('Invalid period type'),
    query('count').optional().isInt({ min: 1, max: 1000 }).withMessage('Count must be between 1 and 1000')
  ],
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    return TelemetryUtils.traceAsync('analytics.metrics', async () => {
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

        if (!req.user?.organization_id) {
          res.status(400).json({
            error: 'Organization context required',
            code: 'ORGANIZATION_REQUIRED'
          });
          return;
        }

        const metricName = req.params.metric_name;
        const periodType = req.query.period_type as 'day' | 'week' | 'month' | 'quarter' || 'day';
        const count = parseInt(req.query.count as string) || 30;

        const businessMetrics = await metricsCollector.getBusinessMetrics(
          req.user.organization_id,
          periodType,
          count
        );

        // Filter by metric name
        const filteredMetrics = businessMetrics.filter(metric => metric.metric_name === metricName);

        // Calculate statistics
        const values = filteredMetrics.map(m => m.metric_value);
        const statistics = values.length > 0 ? {
          count: values.length,
          min: Math.min(...values),
          max: Math.max(...values),
          average: values.reduce((sum, val) => sum + val, 0) / values.length,
          trend: calculateTrend(values)
        } : null;

        res.json({
          success: true,
          data: {
            metrics: filteredMetrics,
            statistics,
            period_type: periodType,
            metric_name: metricName
          }
        });
      } catch (error) {
        console.error('Metrics query error:', error);
        res.status(500).json({
          error: 'Failed to load metrics',
          code: 'METRICS_ERROR'
        });
      }
    });
  }
);

/**
 * POST /analytics/metrics
 * Record a custom business metric
 */
router.post('/metrics',
  authorize('analytics', 'write'),
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    return TelemetryUtils.traceAsync('analytics.record_metric', async () => {
      try {
        if (!req.user?.organization_id) {
          res.status(400).json({
            error: 'Organization context required',
            code: 'ORGANIZATION_REQUIRED'
          });
          return;
        }

        const { metric_name, value, unit, labels } = req.body;

        if (!metric_name || typeof value !== 'number') {
          res.status(400).json({
            error: 'Metric name and numeric value required',
            code: 'INVALID_METRIC'
          });
          return;
        }

        await metricsCollector.recordMetric({
          metric_type: 'gauge',
          name: metric_name,
          value,
          unit,
          labels: labels || {},
          organization_id: req.user.organization_id
        });

        res.json({
          success: true,
          message: 'Metric recorded successfully'
        });
      } catch (error) {
        console.error('Record metric error:', error);
        res.status(500).json({
          error: 'Failed to record metric',
          code: 'RECORD_ERROR'
        });
      }
    });
  }
);

/**
 * GET /analytics/reports/executive
 * Generate executive summary report
 */
router.get('/reports/executive',
  authorize('analytics', 'read', { requireMFA: true }),
  [
    query('period_days').optional().isInt({ min: 1, max: 365 }).withMessage('Period must be between 1 and 365 days')
  ],
  async (req: AuthenticatedRequest, res: Response): Promise<void> => {
    return TelemetryUtils.traceAsync('analytics.executive_report', async () => {
      try {
        if (!req.user?.organization_id) {
          res.status(400).json({
            error: 'Organization context required',
            code: 'ORGANIZATION_REQUIRED'
          });
          return;
        }

        const periodDays = parseInt(req.query.period_days as string) || 30;
        const endDate = new Date();
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - periodDays);

        // Get comprehensive data for executive report
        const [dashboardData, roiCalculations, productivity] = await Promise.all([
          metricsCollector.getDashboardData(req.user.organization_id),
          metricsCollector.calculateROI(req.user.organization_id, startDate, endDate),
          metricsCollector.calculateProductivityMetrics(req.user.organization_id, endDate)
        ]);

        // Generate executive insights
        const insights = generateExecutiveInsights(productivity, roiCalculations, dashboardData);

        const executiveReport = {
          summary: {
            period: { start: startDate, end: endDate, days: periodDays },
            total_roi: roiCalculations.reduce((sum, calc) => sum + calc.roi_percentage, 0),
            productivity_score: calculateProductivityScore(productivity),
            system_health: dashboardData.systemHealth,
            key_achievements: insights.achievements,
            areas_for_improvement: insights.improvements
          },
          productivity,
          roi: {
            calculations: roiCalculations,
            total_value_created: roiCalculations.reduce((sum, calc) => sum + (calc.current_value - calc.baseline_value), 0)
          },
          real_time: dashboardData,
          recommendations: insights.recommendations
        };

        res.json({
          success: true,
          data: executiveReport,
          generated_at: new Date().toISOString()
        });
      } catch (error) {
        console.error('Executive report error:', error);
        res.status(500).json({
          error: 'Failed to generate executive report',
          code: 'REPORT_ERROR'
        });
      }
    });
  }
);

/**
 * Helper functions
 */
function calculateTrend(values: number[]): 'up' | 'down' | 'stable' {
  if (values.length < 2) return 'stable';
  
  const first = values[0];
  const last = values[values.length - 1];
  const difference = ((last - first) / first) * 100;
  
  if (difference > 5) return 'up';
  if (difference < -5) return 'down';
  return 'stable';
}

function calculateProductivityScore(metrics: any): number {
  // Weighted productivity score calculation
  const completionWeight = 0.3;
  const aiAssistanceWeight = 0.2;
  const qualityWeight = 0.25;
  const deploymentWeight = 0.15;
  const satisfactionWeight = 0.1;

  const score = (
    (metrics.completion_rate * completionWeight) +
    (metrics.ai_assistance_rate * aiAssistanceWeight) +
    (metrics.code_quality_score * 10 * qualityWeight) + // Scale to 0-100
    (metrics.deployment_success_rate * deploymentWeight) +
    (metrics.developer_satisfaction_score * 10 * satisfactionWeight) // Scale to 0-100
  );

  return Math.round(score * 10) / 10; // Round to 1 decimal
}

function generateExecutiveInsights(productivity: any, roiCalculations: any[], dashboardData: any) {
  const achievements = [];
  const improvements = [];
  const recommendations = [];

  // Analyze productivity metrics
  if (productivity.completion_rate > 85) {
    achievements.push(`High task completion rate of ${productivity.completion_rate.toFixed(1)}%`);
  } else if (productivity.completion_rate < 70) {
    improvements.push(`Task completion rate at ${productivity.completion_rate.toFixed(1)}% - below target`);
    recommendations.push('Review task assignment processes and provide additional developer support');
  }

  // Analyze AI assistance
  if (productivity.ai_assistance_rate > 75) {
    achievements.push(`Strong AI adoption with ${productivity.ai_assistance_rate.toFixed(1)}% of tasks AI-assisted`);
  } else if (productivity.ai_assistance_rate < 50) {
    improvements.push(`Low AI adoption at ${productivity.ai_assistance_rate.toFixed(1)}%`);
    recommendations.push('Provide additional AI training and showcase success stories');
  }

  // Analyze ROI
  const totalROI = roiCalculations.reduce((sum, calc) => sum + calc.roi_percentage, 0);
  if (totalROI > 100) {
    achievements.push(`Excellent ROI of ${totalROI.toFixed(1)}% demonstrating strong value creation`);
  }

  // System health analysis
  if (dashboardData.systemHealth > 95) {
    achievements.push(`Excellent system reliability at ${dashboardData.systemHealth.toFixed(1)}%`);
  } else if (dashboardData.systemHealth < 90) {
    improvements.push(`System health at ${dashboardData.systemHealth.toFixed(1)}% needs attention`);
    recommendations.push('Review system monitoring and implement additional reliability measures');
  }

  return { achievements, improvements, recommendations };
}

export { router as analyticsRouter };