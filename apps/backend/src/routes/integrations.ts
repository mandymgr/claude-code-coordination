import express, { Request, Response } from 'express';
import { SlackIntegrationService } from '../services/dev-tools/integrations/slackService';
import { TeamsIntegrationService } from '../services/dev-tools/integrations/teamsService';
import { GitHubIntegrationService } from '../services/dev-tools/integrations/githubService';
import { JiraIntegrationService } from '../services/dev-tools/integrations/jiraService';

export function createIntegrationsRouter(
  slackService: SlackIntegrationService,
  teamsService: TeamsIntegrationService,
  githubService: GitHubIntegrationService,
  jiraService: JiraIntegrationService
): express.Router {
  const router = express.Router();

  // Slack Integration Routes
  router.post('/slack', async (req: Request, res: Response) => {
    try {
      const integration = await slackService.createIntegration(req.body);
      return res.json(integration);
    } catch (error) {
      console.error('Error creating Slack integration:', error);
      return res.status(500).json({ error: 'Failed to create Slack integration' });
    }
  });

  router.get('/slack', async (req: Request, res: Response) => {
    try {
      const integrations = await slackService.getIntegration();
      return res.json(integrations);
    } catch (error) {
      console.error('Error fetching Slack integrations:', error);
      return res.status(500).json({ error: 'Failed to fetch Slack integrations' });
    }
  });

  router.get('/slack/:id', async (req: Request, res: Response) => {
    try {
      const integration = slackService.getIntegration(req.params.id);
      if (!integration) {
        return res.status(404).json({ error: 'Slack integration not found' });
      }
      return res.json(integration);
    } catch (error) {
      console.error('Error fetching Slack integration:', error);
      return res.status(500).json({ error: 'Failed to fetch Slack integration' });
    }
  });

  router.put('/slack/:id', async (req: Request, res: Response) => {
    try {
      const integration = await slackService.updateIntegration(req.params.id, req.body);
      return res.json(integration);
    } catch (error) {
      console.error('Error updating Slack integration:', error);
      return res.status(500).json({ error: 'Failed to update Slack integration' });
    }
  });

  router.delete('/slack/:id', async (req: Request, res: Response) => {
    try {
      await slackService.deleteIntegration(req.params.id);
      return res.json({ success: true });
    } catch (error) {
      console.error('Error deleting Slack integration:', error);
      return res.status(500).json({ error: 'Failed to delete Slack integration' });
    }
  });

  router.post('/slack/:id/notifications', async (req: Request, res: Response) => {
    try {
      const notification = await slackService.sendNotification(req.params.id, req.body);
      return res.json(notification);
    } catch (error) {
      console.error('Error sending Slack notification:', error);
      return res.status(500).json({ error: 'Failed to send Slack notification' });
    }
  });

  router.post('/slack/:id/commands', async (req: Request, res: Response) => {
    try {
      const response = await slackService.handleSlashCommand(req.params.id, req.body);
      return res.json(response);
    } catch (error) {
      console.error('Error handling Slack command:', error);
      return res.status(500).json({ error: 'Failed to handle Slack command' });
    }
  });

  router.get('/slack/:id/analytics', async (req: Request, res: Response) => {
    try {
      const { start, end } = req.query;
      const timeRange = {
        start: new Date(start as string),
        end: new Date(end as string)
      };
      const analytics = await slackService.getAnalytics(req.params.id, timeRange);
      return res.json(analytics);
    } catch (error) {
      console.error('Error fetching Slack analytics:', error);
      return res.status(500).json({ error: 'Failed to fetch Slack analytics' });
    }
  });

  // Teams Integration Routes
  router.post('/teams', async (req: Request, res: Response) => {
    try {
      const integration = await teamsService.createIntegration(req.body);
      return res.json(integration);
    } catch (error) {
      console.error('Error creating Teams integration:', error);
      return res.status(500).json({ error: 'Failed to create Teams integration' });
    }
  });

  router.get('/teams', async (req: Request, res: Response) => {
    try {
      const integrations = teamsService.getIntegration();
      return res.json(integrations);
    } catch (error) {
      console.error('Error fetching Teams integrations:', error);
      return res.status(500).json({ error: 'Failed to fetch Teams integrations' });
    }
  });

  router.get('/teams/:id', async (req: Request, res: Response) => {
    try {
      const integration = teamsService.getIntegration(req.params.id);
      if (!integration) {
        return res.status(404).json({ error: 'Teams integration not found' });
      }
      return res.json(integration);
    } catch (error) {
      console.error('Error fetching Teams integration:', error);
      return res.status(500).json({ error: 'Failed to fetch Teams integration' });
    }
  });

  router.put('/teams/:id', async (req: Request, res: Response) => {
    try {
      const integration = await teamsService.updateIntegration(req.params.id, req.body);
      return res.json(integration);
    } catch (error) {
      console.error('Error updating Teams integration:', error);
      return res.status(500).json({ error: 'Failed to update Teams integration' });
    }
  });

  router.delete('/teams/:id', async (req: Request, res: Response) => {
    try {
      await teamsService.deleteIntegration(req.params.id);
      return res.json({ success: true });
    } catch (error) {
      console.error('Error deleting Teams integration:', error);
      return res.status(500).json({ error: 'Failed to delete Teams integration' });
    }
  });

  router.post('/teams/:id/notifications', async (req: Request, res: Response) => {
    try {
      const notification = await teamsService.sendNotification(req.params.id, req.body);
      return res.json(notification);
    } catch (error) {
      console.error('Error sending Teams notification:', error);
      return res.status(500).json({ error: 'Failed to send Teams notification' });
    }
  });

  router.post('/teams/:id/messages', async (req: Request, res: Response) => {
    try {
      await teamsService.handleIncomingActivity(req.params.id, req, res);
    } catch (error) {
      console.error('Error handling Teams message:', error);
      return res.status(500).json({ error: 'Failed to handle Teams message' });
    }
  });

  router.post('/teams/:id/commands', async (req: Request, res: Response) => {
    try {
      const response = await teamsService.handleCommand(req.params.id, req.body);
      return res.json(response);
    } catch (error) {
      console.error('Error handling Teams command:', error);
      return res.status(500).json({ error: 'Failed to handle Teams command' });
    }
  });

  router.get('/teams/:id/analytics', async (req: Request, res: Response) => {
    try {
      const { start, end } = req.query;
      const timeRange = {
        start: new Date(start as string),
        end: new Date(end as string)
      };
      const analytics = await teamsService.getAnalytics(req.params.id, timeRange);
      return res.json(analytics);
    } catch (error) {
      console.error('Error fetching Teams analytics:', error);
      return res.status(500).json({ error: 'Failed to fetch Teams analytics' });
    }
  });

  // GitHub Integration Routes
  router.post('/github', async (req: Request, res: Response) => {
    try {
      const integration = await githubService.createIntegration(req.body);
      return res.json(integration);
    } catch (error) {
      console.error('Error creating GitHub integration:', error);
      return res.status(500).json({ error: 'Failed to create GitHub integration' });
    }
  });

  router.get('/github', async (req: Request, res: Response) => {
    try {
      const integrations = githubService.getIntegration();
      return res.json(integrations);
    } catch (error) {
      console.error('Error fetching GitHub integrations:', error);
      return res.status(500).json({ error: 'Failed to fetch GitHub integrations' });
    }
  });

  router.get('/github/:id', async (req: Request, res: Response) => {
    try {
      const integration = githubService.getIntegration(req.params.id);
      if (!integration) {
        return res.status(404).json({ error: 'GitHub integration not found' });
      }
      return res.json(integration);
    } catch (error) {
      console.error('Error fetching GitHub integration:', error);
      return res.status(500).json({ error: 'Failed to fetch GitHub integration' });
    }
  });

  router.post('/github/:id/webhooks', async (req: Request, res: Response) => {
    try {
      await githubService.handleWebhook(req.params.id, req.body);
      return res.json({ success: true });
    } catch (error) {
      console.error('Error handling GitHub webhook:', error);
      return res.status(500).json({ error: 'Failed to handle GitHub webhook' });
    }
  });

  router.get('/github/:id/analytics', async (req: Request, res: Response) => {
    try {
      const { start, end } = req.query;
      const timeRange = {
        start: new Date(start as string),
        end: new Date(end as string)
      };
      const analytics = await githubService.getAnalytics(req.params.id, timeRange);
      return res.json(analytics);
    } catch (error) {
      console.error('Error fetching GitHub analytics:', error);
      return res.status(500).json({ error: 'Failed to fetch GitHub analytics' });
    }
  });

  // Jira Integration Routes
  router.post('/jira', async (req: Request, res: Response) => {
    try {
      const integration = await jiraService.createIntegration(req.body);
      return res.json(integration);
    } catch (error) {
      console.error('Error creating Jira integration:', error);
      return res.status(500).json({ error: 'Failed to create Jira integration' });
    }
  });

  router.get('/jira', async (req: Request, res: Response) => {
    try {
      const integrations = jiraService.getIntegration();
      return res.json(integrations);
    } catch (error) {
      console.error('Error fetching Jira integrations:', error);
      return res.status(500).json({ error: 'Failed to fetch Jira integrations' });
    }
  });

  router.get('/jira/:id', async (req: Request, res: Response) => {
    try {
      const integration = jiraService.getIntegration(req.params.id);
      if (!integration) {
        return res.status(404).json({ error: 'Jira integration not found' });
      }
      return res.json(integration);
    } catch (error) {
      console.error('Error fetching Jira integration:', error);
      return res.status(500).json({ error: 'Failed to fetch Jira integration' });
    }
  });

  router.post('/jira/:id/webhooks', async (req: Request, res: Response) => {
    try {
      await jiraService.handleWebhook(req.params.id, req.body);
      return res.json({ success: true });
    } catch (error) {
      console.error('Error handling Jira webhook:', error);
      return res.status(500).json({ error: 'Failed to handle Jira webhook' });
    }
  });

  router.get('/jira/:id/analytics', async (req: Request, res: Response) => {
    try {
      const { start, end } = req.query;
      const timeRange = {
        start: new Date(start as string),
        end: new Date(end as string)
      };
      const analytics = await jiraService.getAnalytics(req.params.id, timeRange);
      return res.json(analytics);
    } catch (error) {
      console.error('Error fetching Jira analytics:', error);
      return res.status(500).json({ error: 'Failed to fetch Jira analytics' });
    }
  });

  // General Integration Routes
  router.get('/status', async (req: Request, res: Response) => {
    try {
      const status = {
        slack: {
          total: slackService.getIntegration().length,
          active: slackService.getIntegration().filter(i => i.is_active).length
        },
        teams: {
          total: teamsService.getIntegration().length,
          active: teamsService.getIntegration().filter(i => i.is_active).length
        },
        github: {
          total: githubService.getIntegration().length,
          active: githubService.getIntegration().filter(i => i.is_active).length
        },
        jira: {
          total: jiraService.getIntegration().length,
          active: jiraService.getIntegration().filter(i => i.is_active).length
        }
      };
      return res.json(status);
    } catch (error) {
      console.error('Error fetching integration status:', error);
      return res.status(500).json({ error: 'Failed to fetch integration status' });
    }
  });

  router.get('/health', async (req: Request, res: Response) => {
    try {
      const health = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        services: {
          slack: 'operational',
          teams: 'operational', 
          github: 'operational',
          jira: 'operational'
        }
      };
      return res.json(health);
    } catch (error) {
      console.error('Error checking integration health:', error);
      return res.status(500).json({ error: 'Failed to check integration health' });
    }
  });

  return router;
}