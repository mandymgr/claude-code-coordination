import express, { Request, Response } from 'express';
import { PricingService } from '../services/commercial/pricingService';
import { MarketingService } from '../services/commercial/marketingService';
import { SalesService } from '../services/commercial/salesService';

export function createCommercialRouter(
  pricingService: PricingService,
  marketingService: MarketingService,
  salesService: SalesService
): express.Router {
  const router = express.Router();

  // Pricing Routes
  router.get('/pricing/plans', async (req: Request, res: Response) => {
    try {
      const category = req.query.category as 'individual' | 'team' | 'enterprise';
      const plans = category 
        ? pricingService.getPlansForCategory(category)
        : pricingService.getAllPlans();
      return res.json(plans);
    } catch (error) {
      console.error('Error fetching pricing plans:', error);
      return res.status(500).json({ error: 'Failed to fetch pricing plans' });
    }
  });

  router.get('/pricing/plans/:id', async (req: Request, res: Response) => {
    try {
      const plan = pricingService.getPlan(req.params.id);
      if (!plan) {
        return res.status(404).json({ error: 'Plan not found' });
      }
      return res.json(plan);
    } catch (error) {
      console.error('Error fetching plan:', error);
      return res.status(500).json({ error: 'Failed to fetch plan' });
    }
  });

  router.post('/pricing/subscriptions', async (req: Request, res: Response) => {
    try {
      const subscription = await pricingService.createSubscription(req.body);
      return res.json(subscription);
    } catch (error) {
      console.error('Error creating subscription:', error);
      return res.status(500).json({ error: 'Failed to create subscription' });
    }
  });

  router.get('/pricing/subscriptions/user/:userId', async (req: Request, res: Response) => {
    try {
      const subscription = pricingService.getUserSubscription(req.params.userId);
      if (!subscription) {
        return res.status(404).json({ error: 'Subscription not found' });
      }
      return res.json(subscription);
    } catch (error) {
      console.error('Error fetching subscription:', error);
      return res.status(500).json({ error: 'Failed to fetch subscription' });
    }
  });

  router.get('/pricing/subscriptions/org/:orgId', async (req: Request, res: Response) => {
    try {
      const subscription = pricingService.getOrganizationSubscription(req.params.orgId);
      if (!subscription) {
        return res.status(404).json({ error: 'Subscription not found' });
      }
      return res.json(subscription);
    } catch (error) {
      console.error('Error fetching subscription:', error);
      return res.status(500).json({ error: 'Failed to fetch subscription' });
    }
  });

  router.put('/pricing/subscriptions/:id', async (req: Request, res: Response) => {
    try {
      const subscription = await pricingService.updateSubscription(req.params.id, req.body);
      return res.json(subscription);
    } catch (error) {
      console.error('Error updating subscription:', error);
      return res.status(500).json({ error: 'Failed to update subscription' });
    }
  });

  router.post('/pricing/subscriptions/:id/usage', async (req: Request, res: Response) => {
    try {
      const { limitType, increment = 1 } = req.body;
      const usage = await pricingService.updateUsage(req.params.id, limitType, increment);
      return res.json(usage);
    } catch (error) {
      console.error('Error updating usage:', error);
      return res.status(500).json({ error: 'Failed to update usage' });
    }
  });

  router.post('/pricing/subscriptions/:id/usage/check', async (req: Request, res: Response) => {
    try {
      const { limitType, increment = 1 } = req.body;
      const canUse = await pricingService.checkUsageLimit(req.params.id, limitType, increment);
      return res.json({ canUse });
    } catch (error) {
      console.error('Error checking usage limit:', error);
      return res.status(500).json({ error: 'Failed to check usage limit' });
    }
  });

  router.post('/pricing/quotes', async (req: Request, res: Response) => {
    try {
      const quote = await pricingService.createQuote(req.body);
      return res.json(quote);
    } catch (error) {
      console.error('Error creating quote:', error);
      return res.status(500).json({ error: 'Failed to create quote' });
    }
  });

  router.get('/pricing/quotes', async (req: Request, res: Response) => {
    try {
      const quotes = req.query.status === 'pending' 
        ? pricingService.getPendingQuotes()
        : pricingService.getAllQuotes();
      return res.json(quotes);
    } catch (error) {
      console.error('Error fetching quotes:', error);
      return res.status(500).json({ error: 'Failed to fetch quotes' });
    }
  });

  router.post('/pricing/upgrade-calculation', async (req: Request, res: Response) => {
    try {
      const { currentPlanId, targetPlanId } = req.body;
      const upgrade = await pricingService.calculateUpgrade(currentPlanId, targetPlanId);
      return res.json(upgrade);
    } catch (error) {
      console.error('Error calculating upgrade:', error);
      return res.status(500).json({ error: 'Failed to calculate upgrade' });
    }
  });

  router.get('/pricing/revenue-report', async (req: Request, res: Response) => {
    try {
      const { start, end } = req.query;
      const timeRange = {
        start: new Date(start as string),
        end: new Date(end as string)
      };
      const report = await pricingService.generateRevenueReport(timeRange);
      return res.json(report);
    } catch (error) {
      console.error('Error generating revenue report:', error);
      return res.status(500).json({ error: 'Failed to generate revenue report' });
    }
  });

  // Marketing Routes
  router.post('/marketing/campaigns', async (req: Request, res: Response) => {
    try {
      const campaign = await marketingService.createCampaign(req.body);
      return res.json(campaign);
    } catch (error) {
      console.error('Error creating campaign:', error);
      return res.status(500).json({ error: 'Failed to create campaign' });
    }
  });

  router.get('/marketing/campaigns', async (req: Request, res: Response) => {
    try {
      const campaigns = marketingService.getAllCampaigns();
      return res.json(campaigns);
    } catch (error) {
      console.error('Error fetching campaigns:', error);
      return res.status(500).json({ error: 'Failed to fetch campaigns' });
    }
  });

  router.get('/marketing/campaigns/:id', async (req: Request, res: Response) => {
    try {
      const campaign = marketingService.getCampaign(req.params.id);
      if (!campaign) {
        return res.status(404).json({ error: 'Campaign not found' });
      }
      return res.json(campaign);
    } catch (error) {
      console.error('Error fetching campaign:', error);
      return res.status(500).json({ error: 'Failed to fetch campaign' });
    }
  });

  router.post('/marketing/leads', async (req: Request, res: Response) => {
    try {
      const lead = await marketingService.createLead(req.body);
      return res.json(lead);
    } catch (error) {
      console.error('Error creating lead:', error);
      return res.status(500).json({ error: 'Failed to create lead' });
    }
  });

  router.get('/marketing/leads', async (req: Request, res: Response) => {
    try {
      const status = req.query.status;
      let leads = marketingService.getAllLeads();
      
      if (status === 'qualified') {
        leads = marketingService.getQualifiedLeads();
      }
      
      return res.json(leads);
    } catch (error) {
      console.error('Error fetching leads:', error);
      return res.status(500).json({ error: 'Failed to fetch leads' });
    }
  });

  router.post('/marketing/leads/:id/interactions', async (req: Request, res: Response) => {
    try {
      const lead = await marketingService.addLeadInteraction(req.params.id, req.body);
      return res.json(lead);
    } catch (error) {
      console.error('Error adding lead interaction:', error);
      return res.status(500).json({ error: 'Failed to add lead interaction' });
    }
  });

  router.post('/marketing/content', async (req: Request, res: Response) => {
    try {
      const content = await marketingService.createContent(req.body);
      return res.json(content);
    } catch (error) {
      console.error('Error creating content:', error);
      return res.status(500).json({ error: 'Failed to create content' });
    }
  });

  router.get('/marketing/content', async (req: Request, res: Response) => {
    try {
      const content = marketingService.getAllContent();
      return res.json(content);
    } catch (error) {
      console.error('Error fetching content:', error);
      return res.status(500).json({ error: 'Failed to fetch content' });
    }
  });

  router.post('/marketing/webinars', async (req: Request, res: Response) => {
    try {
      const webinar = await marketingService.scheduleWebinar(req.body);
      return res.json(webinar);
    } catch (error) {
      console.error('Error scheduling webinar:', error);
      return res.status(500).json({ error: 'Failed to schedule webinar' });
    }
  });

  router.get('/marketing/webinars', async (req: Request, res: Response) => {
    try {
      const webinars = marketingService.getAllWebinars();
      return res.json(webinars);
    } catch (error) {
      console.error('Error fetching webinars:', error);
      return res.status(500).json({ error: 'Failed to fetch webinars' });
    }
  });

  router.post('/marketing/webinars/:id/register', async (req: Request, res: Response) => {
    try {
      const registration = await marketingService.registerForWebinar(req.params.id, req.body);
      return res.json(registration);
    } catch (error) {
      console.error('Error registering for webinar:', error);
      return res.status(500).json({ error: 'Failed to register for webinar' });
    }
  });

  router.get('/marketing/insights', async (req: Request, res: Response) => {
    try {
      const { start, end } = req.query;
      const timeRange = {
        start: new Date(start as string),
        end: new Date(end as string)
      };
      const insights = await marketingService.generateMarketingInsights(timeRange);
      return res.json(insights);
    } catch (error) {
      console.error('Error generating marketing insights:', error);
      return res.status(500).json({ error: 'Failed to generate marketing insights' });
    }
  });

  // Sales Routes
  router.post('/sales/leads', async (req: Request, res: Response) => {
    try {
      const lead = await salesService.createLead(req.body);
      return res.json(lead);
    } catch (error) {
      console.error('Error creating sales lead:', error);
      return res.status(500).json({ error: 'Failed to create sales lead' });
    }
  });

  router.get('/sales/leads', async (req: Request, res: Response) => {
    try {
      const { repId, qualified, hot } = req.query;
      
      let leads = salesService.getAllLeads();
      
      if (repId) {
        leads = salesService.getLeadsByRep(repId as string);
      } else if (qualified === 'true') {
        leads = salesService.getQualifiedLeads();
      } else if (hot === 'true') {
        leads = salesService.getHotLeads();
      }
      
      return res.json(leads);
    } catch (error) {
      console.error('Error fetching sales leads:', error);
      return res.status(500).json({ error: 'Failed to fetch sales leads' });
    }
  });

  router.get('/sales/leads/:id', async (req: Request, res: Response) => {
    try {
      const lead = salesService.getLead(req.params.id);
      if (!lead) {
        return res.status(404).json({ error: 'Sales lead not found' });
      }
      return res.json(lead);
    } catch (error) {
      console.error('Error fetching sales lead:', error);
      return res.status(500).json({ error: 'Failed to fetch sales lead' });
    }
  });

  router.post('/sales/leads/:id/interactions', async (req: Request, res: Response) => {
    try {
      const lead = await salesService.addInteraction(req.params.id, req.body);
      return res.json(lead);
    } catch (error) {
      console.error('Error adding sales interaction:', error);
      return res.status(500).json({ error: 'Failed to add sales interaction' });
    }
  });

  router.put('/sales/leads/:id/status', async (req: Request, res: Response) => {
    try {
      const { status, notes } = req.body;
      const lead = await salesService.updateLeadStatus(req.params.id, status, notes);
      return res.json(lead);
    } catch (error) {
      console.error('Error updating lead status:', error);
      return res.status(500).json({ error: 'Failed to update lead status' });
    }
  });

  router.post('/sales/proposals', async (req: Request, res: Response) => {
    try {
      const proposal = await salesService.createProposal(req.body);
      return res.json(proposal);
    } catch (error) {
      console.error('Error creating proposal:', error);
      return res.status(500).json({ error: 'Failed to create proposal' });
    }
  });

  router.get('/sales/proposals', async (req: Request, res: Response) => {
    try {
      const { leadId } = req.query;
      
      const proposals = leadId 
        ? salesService.getLeadProposals(leadId as string)
        : salesService.getAllProposals();
        
      return res.json(proposals);
    } catch (error) {
      console.error('Error fetching proposals:', error);
      return res.status(500).json({ error: 'Failed to fetch proposals' });
    }
  });

  router.put('/sales/proposals/:id/send', async (req: Request, res: Response) => {
    try {
      const proposal = await salesService.sendProposal(req.params.id);
      return res.json(proposal);
    } catch (error) {
      console.error('Error sending proposal:', error);
      return res.status(500).json({ error: 'Failed to send proposal' });
    }
  });

  router.put('/sales/proposals/:id/status', async (req: Request, res: Response) => {
    try {
      const { status } = req.body;
      const proposal = await salesService.updateProposalStatus(req.params.id, status);
      return res.json(proposal);
    } catch (error) {
      console.error('Error updating proposal status:', error);
      return res.status(500).json({ error: 'Failed to update proposal status' });
    }
  });

  router.get('/sales/reports', async (req: Request, res: Response) => {
    try {
      const { start, end } = req.query;
      const timeRange = {
        start: new Date(start as string),
        end: new Date(end as string)
      };
      const report = await salesService.generateSalesReport(timeRange);
      return res.json(report);
    } catch (error) {
      console.error('Error generating sales report:', error);
      return res.status(500).json({ error: 'Failed to generate sales report' });
    }
  });

  // Combined Dashboard Routes
  router.get('/dashboard/overview', async (req: Request, res: Response) => {
    try {
      const { start, end } = req.query;
      const timeRange = {
        start: new Date(start as string),
        end: new Date(end as string)
      };

      const [revenueReport, marketingInsights, salesReport] = await Promise.all([
        pricingService.generateRevenueReport(timeRange),
        marketingService.generateMarketingInsights(timeRange),
        salesService.generateSalesReport(timeRange)
      ]);

      const overview = {
        revenue: {
          total: revenueReport.totalRevenue,
          subscriptions: revenueReport.activeSubscriptions,
          avgRevenuePerUser: revenueReport.averageRevenuePerUser,
          growth: 0 // Would need historical data
        },
        marketing: {
          campaigns: marketingInsights.campaigns.active,
          leads: marketingInsights.leads.new,
          conversions: marketingInsights.leads.converted,
          roi: marketingInsights.campaigns.averageRoi
        },
        sales: {
          pipeline: salesReport.pipeline.totalValue,
          qualified: salesReport.metrics.qualifiedLeads,
          closed: salesReport.metrics.closedWon,
          conversionRate: salesReport.metrics.conversionRate
        },
        content: {
          pieces: marketingInsights.content.pieces,
          views: marketingInsights.content.totalViews,
          engagement: marketingInsights.content.averageTimeOnPage
        }
      };

      return res.json(overview);
    } catch (error) {
      console.error('Error generating dashboard overview:', error);
      return res.status(500).json({ error: 'Failed to generate dashboard overview' });
    }
  });

  router.get('/health', async (req: Request, res: Response) => {
    try {
      const health = {
        status: 'healthy',
        timestamp: new Date().toISOString(),
        services: {
          pricing: 'operational',
          marketing: 'operational',
          sales: 'operational'
        },
        stats: {
          plans: pricingService.getAllPlans().length,
          campaigns: marketingService.getAllCampaigns().length,
          leads: salesService.getAllLeads().length
        }
      };
      return res.json(health);
    } catch (error) {
      console.error('Error checking commercial health:', error);
      return res.status(500).json({ error: 'Failed to check commercial health' });
    }
  });

  return router;
}