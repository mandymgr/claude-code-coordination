import express from 'express';
import { MultiTenantService } from '../services/enterprise/multiTenant.js';
import { EnterpriseSSOService } from '../services/enterprise/enterpriseSSO.js';
import { ComplianceSuite } from '../services/enterprise/complianceSuite.js';
import { AdvancedAnalytics } from '../services/enterprise/advancedAnalytics.js';
import { whiteLabelService } from '../services/enterprise/whiteLabelSolutions.js';

const router: express.Router = express.Router();

// Multi-Tenant Management Routes
router.post('/tenants', async (req, res) => {
  try {
    const tenant = await new MultiTenantService().createTenant({
      name: req.body.name,
      settings: req.body.settings || {},
      limits: req.body.limits || {},
      metadata: req.body.metadata || {}
    });
    res.status(201).json({ success: true, tenant });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
});

router.get('/tenants/:id', async (req, res) => {
  try {
    const tenant = await new MultiTenantService().getTenant(req.params.id);
    if (!tenant) {
      res.status(404).json({ success: false, error: 'Tenant not found' });
      return;
    }
    res.json({ success: true, tenant });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

router.put('/tenants/:id', async (req, res) => {
  try {
    const tenant = await new MultiTenantService().updateTenant(req.params.id, req.body);
    res.json({ success: true, tenant });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
});

router.delete('/tenants/:id', async (req, res) => {
  try {
    await new MultiTenantService().deleteTenant(req.params.id);
    res.json({ success: true, message: 'Tenant deleted successfully' });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
});

router.get('/tenants', async (req, res) => {
  try {
    const tenants = await new MultiTenantService().getAllTenants();
    res.json({ success: true, tenants });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

router.get('/tenants/:id/usage', async (req, res) => {
  try {
    const usage = await new MultiTenantService().getTenantUsage(req.params.id);
    res.json({ success: true, usage });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// Enterprise SSO Routes
router.post('/sso/providers', async (req, res) => {
  try {
    const provider = await new EnterpriseSSOService().createProvider({
      tenantId: req.body.tenantId,
      type: req.body.type,
      config: req.body.config,
      name: req.body.name
    });
    res.status(201).json({ success: true, provider });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
});

router.get('/sso/providers/:id', async (req, res) => {
  try {
    const provider = await new EnterpriseSSOService().getProvider(req.params.id);
    if (!provider) {
      res.status(404).json({ success: false, error: 'SSO provider not found' });
      return;
    }
    res.json({ success: true, provider });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

router.put('/sso/providers/:id', async (req, res) => {
  try {
    const provider = await new EnterpriseSSOService().updateProvider(req.params.id, req.body);
    res.json({ success: true, provider });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
});

router.delete('/sso/providers/:id', async (req, res) => {
  try {
    await new EnterpriseSSOService().deleteProvider(req.params.id);
    res.json({ success: true, message: 'SSO provider deleted successfully' });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
});

router.get('/sso/tenants/:tenantId/providers', async (req, res) => {
  try {
    const providers = await new EnterpriseSSOService().getProvidersByTenant(req.params.tenantId);
    res.json({ success: true, providers });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

router.post('/sso/authenticate', async (req, res) => {
  try {
    const result = await new EnterpriseSSOService().authenticate(
      req.body.providerId,
      req.body.assertion || req.body.code,
      req.body.relayState
    );
    res.json({ success: true, result });
  } catch (error) {
    res.status(401).json({ success: false, error: (error as Error).message });
  }
});

router.get('/sso/providers/:id/metadata', async (req, res) => {
  try {
    const metadata = await new EnterpriseSSOService().generateMetadata(req.params.id);
    res.set('Content-Type', 'application/xml');
    res.send(metadata);
    return;
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// Compliance Suite Routes
router.post('/compliance/assessments', async (req, res) => {
  try {
    const assessment = await new ComplianceSuite().runAssessment(
      req.body.tenantId,
      req.body.framework,
      req.body.scope
    );
    res.status(201).json({ success: true, assessment });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
});

router.get('/compliance/assessments/:id', async (req, res) => {
  try {
    const assessment = await new ComplianceSuite().getAssessment(req.params.id);
    if (!assessment) {
      res.status(404).json({ success: false, error: 'Assessment not found' });
      return;
    }
    res.json({ success: true, assessment });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

router.get('/compliance/tenants/:tenantId/assessments', async (req, res) => {
  try {
    const framework = req.query.framework as string;
    const assessments = await new ComplianceSuite().getAssessmentsByTenant(req.params.tenantId, framework);
    res.json({ success: true, assessments });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

router.get('/compliance/frameworks', async (req, res) => {
  try {
    const frameworks = await new ComplianceSuite().getSupportedFrameworks();
    res.json({ success: true, frameworks });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

router.post('/compliance/audit-trail', async (req, res) => {
  try {
    await new ComplianceSuite().logAuditEvent(
      req.body.tenantId,
      req.body.userId,
      req.body.action,
      req.body.resource,
      req.body.details
    );
    res.json({ success: true, message: 'Audit event logged' });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

router.get('/compliance/audit-trail/:tenantId', async (req, res) => {
  try {
    const startDate = req.query.startDate as string;
    const endDate = req.query.endDate as string;
    const userId = req.query.userId as string;
    const action = req.query.action as string;

    const events = await new ComplianceSuite().getAuditTrail(
      req.params.tenantId,
      startDate ? new Date(startDate) : undefined,
      endDate ? new Date(endDate) : undefined,
      userId,
      action
    );
    res.json({ success: true, events });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

router.post('/compliance/data-subject-requests', async (req, res) => {
  try {
    const request = await new ComplianceSuite().handleDataSubjectRequest(
      req.body.tenantId,
      req.body.type,
      req.body.subjectId,
      req.body.details
    );
    res.status(201).json({ success: true, request });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
});

// Advanced Analytics Routes
router.post('/analytics/dashboards', async (req, res) => {
  try {
    const dashboard = await new AdvancedAnalytics().createDashboard({
      tenantId: req.body.tenantId,
      name: req.body.name,
      description: req.body.description,
      widgets: req.body.widgets || [],
      layout: req.body.layout,
      permissions: req.body.permissions || {}
    });
    res.status(201).json({ success: true, dashboard });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
});

router.get('/analytics/dashboards/:id', async (req, res) => {
  try {
    const dashboard = await new AdvancedAnalytics().getDashboard(req.params.id);
    if (!dashboard) {
      res.status(404).json({ success: false, error: 'Dashboard not found' });
      return;
    }
    res.json({ success: true, dashboard });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

router.put('/analytics/dashboards/:id', async (req, res) => {
  try {
    const dashboard = await new AdvancedAnalytics().updateDashboard(req.params.id, req.body);
    res.json({ success: true, dashboard });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
});

router.delete('/analytics/dashboards/:id', async (req, res) => {
  try {
    await new AdvancedAnalytics().deleteDashboard(req.params.id);
    res.json({ success: true, message: 'Dashboard deleted successfully' });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
});

router.get('/analytics/tenants/:tenantId/dashboards', async (req, res) => {
  try {
    const dashboards = await new AdvancedAnalytics().getDashboardsByTenant(req.params.tenantId);
    res.json({ success: true, dashboards });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

router.post('/analytics/reports', async (req, res) => {
  try {
    const report = await new AdvancedAnalytics().generateReport(
      req.body.tenantId,
      req.body.type,
      req.body.config,
      req.body.dateRange
    );
    res.status(201).json({ success: true, report });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
});

router.get('/analytics/reports/:id', async (req, res) => {
  try {
    const report = await new AdvancedAnalytics().getReport(req.params.id);
    if (!report) {
      res.status(404).json({ success: false, error: 'Report not found' });
      return;
    }
    res.json({ success: true, report });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

router.get('/analytics/tenants/:tenantId/reports', async (req, res) => {
  try {
    const type = req.query.type as string;
    const reports = await new AdvancedAnalytics().getReportsByTenant(req.params.tenantId, type);
    res.json({ success: true, reports });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

router.post('/analytics/metrics', async (req, res) => {
  try {
    await new AdvancedAnalytics().collectMetric(
      req.body.tenantId,
      req.body.metricName,
      req.body.value,
      req.body.tags,
      req.body.timestamp ? new Date(req.body.timestamp) : new Date()
    );
    res.json({ success: true, message: 'Metric collected' });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

router.get('/analytics/metrics/:tenantId/:metricName', async (req, res) => {
  try {
    const startTime = req.query.startTime as string;
    const endTime = req.query.endTime as string;
    const aggregation = req.query.aggregation as 'sum' | 'avg' | 'max' | 'min' | 'count';

    const metrics = await new AdvancedAnalytics().queryMetrics(
      req.params.tenantId,
      req.params.metricName,
      startTime ? new Date(startTime) : new Date(Date.now() - 24 * 60 * 60 * 1000),
      endTime ? new Date(endTime) : new Date(),
      aggregation || 'avg'
    );
    res.json({ success: true, metrics });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

router.post('/analytics/alerts', async (req, res) => {
  try {
    const alert = await new AdvancedAnalytics().createAlert(req.body.tenantId, req.body.rule);
    res.status(201).json({ success: true, alert });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
});

router.get('/analytics/alerts/:tenantId', async (req, res) => {
  try {
    const alerts = await new AdvancedAnalytics().getAlerts(req.params.tenantId);
    res.json({ success: true, alerts });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

// White Label Solutions Routes
router.post('/white-label/configs', async (req, res) => {
  try {
    const config = await whiteLabelService.createWhiteLabelConfig({
      tenantId: req.body.tenantId,
      brandName: req.body.brandName,
      theme: req.body.theme,
      features: req.body.features,
      domain: req.body.domain,
      branding: req.body.branding,
      customization: req.body.customization,
      integrations: req.body.integrations
    });
    res.status(201).json({ success: true, config });    return;
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
});

router.get('/white-label/configs/:id', async (req, res) => {
  try {
    const config = await whiteLabelService.getWhiteLabelConfig(req.params.id);
    if (!config) {
      return res.status(404).json({ success: false, error: 'White label configuration not found' });
    }
    res.json({ success: true, config });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

router.put('/white-label/configs/:id', async (req, res) => {
  try {
    const config = await whiteLabelService.updateWhiteLabelConfig(req.params.id, req.body);
    res.json({ success: true, config });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
});

router.delete('/white-label/configs/:id', async (req, res) => {
  try {
    await whiteLabelService.deleteWhiteLabelConfig(req.params.id);
    res.json({ success: true, message: 'White label configuration deleted successfully' });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
});

router.get('/white-label/tenants/:tenantId/configs', async (req, res) => {
  try {
    const configs = await whiteLabelService.getWhiteLabelConfigsByTenant(req.params.tenantId);
    res.json({ success: true, configs });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

router.put('/white-label/configs/:id/theme', async (req, res) => {
  try {
    const theme = await whiteLabelService.updateTheme(req.params.id, req.body);
    res.json({ success: true, theme });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
});

router.post('/white-label/configs/:id/assets', async (req, res) => {
  try {
    // In a real implementation, this would handle file uploads
    const assetUrl = await whiteLabelService.uploadBrandingAsset(
      req.params.id,
      req.body.assetType,
      Buffer.from(req.body.fileData, 'base64')
    );
    res.json({ success: true, assetUrl });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
});

router.post('/white-label/deployments', async (req, res) => {
  try {
    const deployment = await whiteLabelService.createDeploymentConfig(
      req.body.whiteLabelId,
      req.body.environment
    );
    res.status(201).json({ success: true, deployment });    return;
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
});

router.post('/white-label/deployments/:id/deploy', async (req, res) => {
  try {
    await whiteLabelService.deployWhiteLabel(req.params.id);
    res.json({ success: true, message: 'Deployment started' });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
});

router.get('/white-label/deployments/:id/status', async (req, res) => {
  try {
    const status = await whiteLabelService.getDeploymentStatus(req.params.id);
    if (!status) {
      return res.status(404).json({ success: false, error: 'Deployment not found' });
    }
    res.json({ success: true, status });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

router.delete('/white-label/deployments/:id', async (req, res) => {
  try {
    await whiteLabelService.stopDeployment(req.params.id);
    res.json({ success: true, message: 'Deployment stopped' });
  } catch (error) {
    res.status(400).json({ success: false, error: (error as Error).message });
  }
});

router.get('/white-label/analytics/:whiteLabelId', async (req, res) => {
  try {
    const startDate = req.query.startDate as string;
    const endDate = req.query.endDate as string;
    const granularity = req.query.granularity as 'hour' | 'day' | 'week' | 'month';

    const analytics = await whiteLabelService.getUsageAnalytics(req.params.whiteLabelId, {
      startDate: startDate ? new Date(startDate) : new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
      endDate: endDate ? new Date(endDate) : new Date(),
      granularity: granularity || 'day'
    });
    res.json({ success: true, analytics });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

router.post('/white-label/analytics/:whiteLabelId/events', async (req, res) => {
  try {
    await whiteLabelService.trackEvent(
      req.params.whiteLabelId,
      req.body.eventType,
      req.body.eventData
    );
    res.json({ success: true, message: 'Event tracked' });
  } catch (error) {
    res.status(500).json({ success: false, error: (error as Error).message });
  }
});

export { router as enterpriseRouter };