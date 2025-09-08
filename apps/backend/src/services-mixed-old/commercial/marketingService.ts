import { EventEmitter } from 'events';

export interface MarketingCampaign {
  id: string;
  name: string;
  description: string;
  type: 'email' | 'social' | 'content' | 'webinar' | 'conference' | 'partnership';
  status: 'draft' | 'scheduled' | 'active' | 'paused' | 'completed';
  targetAudience: TargetAudience;
  content: MarketingContent;
  channels: MarketingChannel[];
  metrics: CampaignMetrics;
  budget: number;
  startDate: Date;
  endDate: Date;
  createdBy: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface TargetAudience {
  segments: string[]; // 'developers', 'team-leads', 'ctos', 'startups', 'enterprises'
  technologies: string[]; // 'javascript', 'python', 'react', 'nodejs', etc.
  companySize: string[]; // 'startup', 'small', 'medium', 'large', 'enterprise'
  industries: string[]; // 'fintech', 'healthcare', 'ecommerce', 'saas', etc.
  regions: string[]; // 'north-america', 'europe', 'asia-pacific', etc.
  experienceLevel: string[]; // 'junior', 'mid', 'senior', 'lead', 'architect'
}

export interface MarketingContent {
  title: string;
  description: string;
  keyMessages: string[];
  valuePropositions: string[];
  callToAction: string;
  assets: MarketingAsset[];
  landingPage?: string;
  trackingParams: Record<string, string>;
}

export interface MarketingAsset {
  id: string;
  type: 'image' | 'video' | 'document' | 'infographic' | 'demo' | 'case-study';
  name: string;
  url: string;
  description: string;
  tags: string[];
  createdAt: Date;
}

export interface MarketingChannel {
  id: string;
  name: string;
  type: 'email' | 'linkedin' | 'twitter' | 'github' | 'dev-to' | 'hackernews' | 'reddit' | 'blog' | 'podcast' | 'youtube';
  configuration: Record<string, any>;
  is_active: boolean;
  metrics: ChannelMetrics;
}

export interface ChannelMetrics {
  impressions: number;
  clicks: number;
  conversions: number;
  cost: number;
  engagementRate: number;
  conversionRate: number;
  costPerClick: number;
  costPerConversion: number;
}

export interface CampaignMetrics {
  impressions: number;
  clicks: number;
  signups: number;
  trialStarts: number;
  conversions: number;
  revenue: number;
  cost: number;
  roi: number;
  ctr: number; // Click-through rate
  conversionRate: number;
  customerAcquisitionCost: number;
  lifetimeValue: number;
}

export interface Lead {
  id: string;
  email: string;
  name?: string;
  company?: string;
  jobTitle?: string;
  source: string; // campaign, organic, referral, etc.
  score: number; // Lead scoring 0-100
  status: 'cold' | 'warm' | 'hot' | 'qualified' | 'converted' | 'churned';
  interests: string[];
  demographics: LeadDemographics;
  interactions: LeadInteraction[];
  assignedTo?: string;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface LeadDemographics {
  country?: string;
  region?: string;
  timezone?: string;
  companySize?: string;
  industry?: string;
  technologies?: string[];
  experienceLevel?: string;
}

export interface LeadInteraction {
  id: string;
  type: 'email_open' | 'email_click' | 'website_visit' | 'demo_request' | 'trial_start' | 'content_download' | 'webinar_attend';
  timestamp: Date;
  details: Record<string, any>;
  score: number;
}

export interface ContentPiece {
  id: string;
  title: string;
  type: 'blog' | 'whitepaper' | 'case-study' | 'video' | 'webinar' | 'tutorial' | 'documentation';
  description: string;
  content: string;
  author: string;
  tags: string[];
  targetKeywords: string[];
  status: 'draft' | 'review' | 'published' | 'archived';
  seoOptimized: boolean;
  performance: ContentPerformance;
  publishDate?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContentPerformance {
  views: number;
  uniqueViews: number;
  timeOnPage: number;
  bounceRate: number;
  socialShares: number;
  leads: number;
  conversions: number;
  seoRanking: Record<string, number>; // keyword -> position
}

export interface WebinarEvent {
  id: string;
  title: string;
  description: string;
  presenter: string;
  coPresenter?: string;
  scheduledDate: Date;
  duration: number; // minutes
  maxAttendees: number;
  registrations: WebinarRegistration[];
  content: {
    agenda: string[];
    slides?: string;
    recording?: string;
    resources: string[];
  };
  status: 'scheduled' | 'live' | 'completed' | 'cancelled';
  metrics: WebinarMetrics;
  createdAt: Date;
}

export interface WebinarRegistration {
  id: string;
  leadId: string;
  email: string;
  name: string;
  company?: string;
  questions: string[];
  attended: boolean;
  attendedDuration?: number; // minutes
  engagementScore: number;
  registeredAt: Date;
}

export interface WebinarMetrics {
  registrations: number;
  attendance: number;
  attendanceRate: number;
  averageWatchTime: number;
  qnaQuestions: number;
  pollResponses: number;
  leadsGenerated: number;
  followUpConversions: number;
}

export class MarketingService extends EventEmitter {
  private campaigns: Map<string, MarketingCampaign> = new Map();
  private leads: Map<string, Lead> = new Map();
  private content: Map<string, ContentPiece> = new Map();
  private webinars: Map<string, WebinarEvent> = new Map();
  private channels: Map<string, MarketingChannel> = new Map();

  constructor() {
    super();
    this.initializeDefaultChannels();
  }

  private initializeDefaultChannels(): void {
    const defaultChannels: MarketingChannel[] = [
      {
        id: 'linkedin',
        name: 'LinkedIn',
        type: 'linkedin',
        configuration: {
          companyPage: '@claude-code',
          adAccount: 'claude-code-ads',
          targetingOptions: ['developers', 'engineering-managers', 'ctos']
        },
        is_active: true,
        metrics: {
          impressions: 0,
          clicks: 0,
          conversions: 0,
          cost: 0,
          engagementRate: 0,
          conversionRate: 0,
          costPerClick: 0,
          costPerConversion: 0
        }
      },
      {
        id: 'github',
        name: 'GitHub',
        type: 'github',
        configuration: {
          sponsorships: true,
          repositorySponsorship: true,
          opensourceContributions: true
        },
        is_active: true,
        metrics: {
          impressions: 0,
          clicks: 0,
          conversions: 0,
          cost: 0,
          engagementRate: 0,
          conversionRate: 0,
          costPerClick: 0,
          costPerConversion: 0
        }
      },
      {
        id: 'dev-to',
        name: 'DEV.to',
        type: 'dev-to',
        configuration: {
          profile: '@claudecode',
          contentTypes: ['tutorials', 'case-studies', 'technical-deep-dives']
        },
        is_active: true,
        metrics: {
          impressions: 0,
          clicks: 0,
          conversions: 0,
          cost: 0,
          engagementRate: 0,
          conversionRate: 0,
          costPerClick: 0,
          costPerConversion: 0
        }
      }
    ];

    defaultChannels.forEach(channel => {
      this.channels.set(channel.id, channel);
    });
  }

  async createCampaign(campaignData: Omit<MarketingCampaign, 'id' | 'metrics' | 'createdAt' | 'updatedAt'>): Promise<MarketingCampaign> {
    const campaign: MarketingCampaign = {
      ...campaignData,
      id: this.generateId('campaign'),
      metrics: {
        impressions: 0,
        clicks: 0,
        signups: 0,
        trialStarts: 0,
        conversions: 0,
        revenue: 0,
        cost: 0,
        roi: 0,
        ctr: 0,
        conversionRate: 0,
        customerAcquisitionCost: 0,
        lifetimeValue: 0
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.campaigns.set(campaign.id, campaign);

    this.emit('campaign_created', campaign);

    return campaign;
  }

  async createLead(leadData: Omit<Lead, 'id' | 'score' | 'interactions' | 'createdAt' | 'updatedAt'>): Promise<Lead> {
    const lead: Lead = {
      ...leadData,
      id: this.generateId('lead'),
      score: this.calculateLeadScore(leadData),
      interactions: [],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.leads.set(lead.id, lead);

    this.emit('lead_created', lead);

    return lead;
  }

  private calculateLeadScore(leadData: Partial<Lead>): number {
    let score = 0;

    // Company information adds points
    if (leadData.company) score += 10;
    if (leadData.jobTitle?.toLowerCase().includes('cto')) score += 20;
    if (leadData.jobTitle?.toLowerCase().includes('lead')) score += 15;
    if (leadData.jobTitle?.toLowerCase().includes('manager')) score += 10;
    if (leadData.jobTitle?.toLowerCase().includes('developer')) score += 5;

    // Demographics scoring
    if (leadData.demographics?.companySize === 'enterprise') score += 25;
    if (leadData.demographics?.companySize === 'large') score += 20;
    if (leadData.demographics?.companySize === 'medium') score += 15;
    if (leadData.demographics?.companySize === 'small') score += 10;

    // Technology alignment
    const relevantTechs = ['javascript', 'typescript', 'react', 'nodejs', 'python', 'ai', 'ml'];
    const techMatches = leadData.demographics?.technologies?.filter(tech => 
      relevantTechs.includes(tech.toLowerCase())
    ).length || 0;
    score += techMatches * 3;

    // Interest scoring
    const interests = leadData.interests || [];
    if (interests.includes('ai-development')) score += 15;
    if (interests.includes('code-quality')) score += 10;
    if (interests.includes('team-collaboration')) score += 10;
    if (interests.includes('automation')) score += 8;

    return Math.min(100, Math.max(0, score));
  }

  async addLeadInteraction(leadId: string, interaction: Omit<LeadInteraction, 'id'>): Promise<Lead> {
    const lead = this.leads.get(leadId);
    if (!lead) {
      throw new Error('Lead not found');
    }

    const newInteraction: LeadInteraction = {
      ...interaction,
      id: this.generateId('interaction')
    };

    lead.interactions.push(newInteraction);
    lead.score = Math.min(100, lead.score + interaction.score);
    lead.updatedAt = new Date();

    // Auto-qualify high-scoring leads
    if (lead.score >= 80 && lead.status === 'warm') {
      lead.status = 'hot';
    } else if (lead.score >= 60 && lead.status === 'cold') {
      lead.status = 'warm';
    }

    this.leads.set(leadId, lead);

    this.emit('lead_interaction', { lead, interaction: newInteraction });

    return lead;
  }

  async createContent(contentData: Omit<ContentPiece, 'id' | 'performance' | 'createdAt' | 'updatedAt'>): Promise<ContentPiece> {
    const content: ContentPiece = {
      ...contentData,
      id: this.generateId('content'),
      performance: {
        views: 0,
        uniqueViews: 0,
        timeOnPage: 0,
        bounceRate: 0,
        socialShares: 0,
        leads: 0,
        conversions: 0,
        seoRanking: {}
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.content.set(content.id, content);

    this.emit('content_created', content);

    return content;
  }

  async scheduleWebinar(webinarData: Omit<WebinarEvent, 'id' | 'registrations' | 'metrics' | 'createdAt'>): Promise<WebinarEvent> {
    const webinar: WebinarEvent = {
      ...webinarData,
      id: this.generateId('webinar'),
      registrations: [],
      metrics: {
        registrations: 0,
        attendance: 0,
        attendanceRate: 0,
        averageWatchTime: 0,
        qnaQuestions: 0,
        pollResponses: 0,
        leadsGenerated: 0,
        followUpConversions: 0
      },
      createdAt: new Date()
    };

    this.webinars.set(webinar.id, webinar);

    this.emit('webinar_scheduled', webinar);

    return webinar;
  }

  async registerForWebinar(webinarId: string, registrationData: Omit<WebinarRegistration, 'id' | 'attended' | 'engagementScore' | 'registeredAt'>): Promise<WebinarRegistration> {
    const webinar = this.webinars.get(webinarId);
    if (!webinar) {
      throw new Error('Webinar not found');
    }

    if (webinar.registrations.length >= webinar.maxAttendees) {
      throw new Error('Webinar is full');
    }

    const registration: WebinarRegistration = {
      ...registrationData,
      id: this.generateId('registration'),
      attended: false,
      engagementScore: 0,
      registeredAt: new Date()
    };

    webinar.registrations.push(registration);
    webinar.metrics.registrations = webinar.registrations.length;

    this.webinars.set(webinarId, webinar);

    // Create or update lead
    const existingLead = Array.from(this.leads.values()).find(lead => lead.email === registration.email);
    
    if (existingLead) {
      await this.addLeadInteraction(existingLead.id, {
        type: 'webinar_attend',
        timestamp: new Date(),
        details: { webinarId, webinarTitle: webinar.title },
        score: 15
      });
    } else {
      await this.createLead({
        email: registration.email,
        name: registration.name,
        company: registration.company,
        source: `webinar-${webinarId}`,
        status: 'warm',
        interests: ['ai-development', 'team-collaboration'],
        demographics: {},
        notes: `Registered for webinar: ${webinar.title}`
      });
    }

    this.emit('webinar_registration', { webinar, registration });

    return registration;
  }

  async generateMarketingInsights(timeRange: { start: Date; end: Date }): Promise<{
    campaigns: {
      total: number;
      active: number;
      completed: number;
      totalSpend: number;
      totalRevenue: number;
      averageRoi: number;
    };
    leads: {
      total: number;
      new: number;
      qualified: number;
      converted: number;
      averageScore: number;
      conversionRate: number;
    };
    content: {
      pieces: number;
      totalViews: number;
      averageTimeOnPage: number;
      topPerforming: ContentPiece[];
    };
    channels: {
      performance: Array<{ channel: string; clicks: number; conversions: number; roi: number }>;
      topChannel: string;
      mostCostEffective: string;
    };
    webinars: {
      scheduled: number;
      completed: number;
      totalRegistrations: number;
      averageAttendance: number;
      leadsGenerated: number;
    };
  }> {
    const campaigns = Array.from(this.campaigns.values()).filter(
      campaign => campaign.createdAt >= timeRange.start && campaign.createdAt <= timeRange.end
    );

    const leads = Array.from(this.leads.values()).filter(
      lead => lead.createdAt >= timeRange.start && lead.createdAt <= timeRange.end
    );

    const content = Array.from(this.content.values()).filter(
      piece => piece.createdAt >= timeRange.start && piece.createdAt <= timeRange.end
    );

    const webinars = Array.from(this.webinars.values()).filter(
      webinar => webinar.createdAt >= timeRange.start && webinar.createdAt <= timeRange.end
    );

    const channels = Array.from(this.channels.values());

    return {
      campaigns: {
        total: campaigns.length,
        active: campaigns.filter(c => c.status === 'active').length,
        completed: campaigns.filter(c => c.status === 'completed').length,
        totalSpend: campaigns.reduce((sum, c) => sum + c.metrics.cost, 0),
        totalRevenue: campaigns.reduce((sum, c) => sum + c.metrics.revenue, 0),
        averageRoi: campaigns.length > 0 
          ? campaigns.reduce((sum, c) => sum + c.metrics.roi, 0) / campaigns.length 
          : 0
      },
      leads: {
        total: leads.length,
        new: leads.filter(l => l.createdAt >= timeRange.start).length,
        qualified: leads.filter(l => l.status === 'qualified').length,
        converted: leads.filter(l => l.status === 'converted').length,
        averageScore: leads.length > 0 
          ? leads.reduce((sum, l) => sum + l.score, 0) / leads.length 
          : 0,
        conversionRate: leads.length > 0 
          ? leads.filter(l => l.status === 'converted').length / leads.length 
          : 0
      },
      content: {
        pieces: content.length,
        totalViews: content.reduce((sum, c) => sum + c.performance.views, 0),
        averageTimeOnPage: content.length > 0 
          ? content.reduce((sum, c) => sum + c.performance.timeOnPage, 0) / content.length 
          : 0,
        topPerforming: content
          .sort((a, b) => b.performance.views - a.performance.views)
          .slice(0, 5)
      },
      channels: {
        performance: channels.map(channel => ({
          channel: channel.name,
          clicks: channel.metrics.clicks,
          conversions: channel.metrics.conversions,
          roi: channel.metrics.cost > 0 
            ? (channel.metrics.conversions * 100 - channel.metrics.cost) / channel.metrics.cost 
            : 0
        })),
        topChannel: channels.reduce((top, channel) => 
          channel.metrics.conversions > (top?.metrics.conversions || 0) ? channel : top
        )?.name || 'N/A',
        mostCostEffective: channels.reduce((best, channel) => {
          const roi = channel.metrics.cost > 0 
            ? (channel.metrics.conversions * 100 - channel.metrics.cost) / channel.metrics.cost 
            : 0;
          const bestRoi = best && best.metrics.cost > 0 
            ? (best.metrics.conversions * 100 - best.metrics.cost) / best.metrics.cost 
            : -1;
          return roi > bestRoi ? channel : best;
        })?.name || 'N/A'
      },
      webinars: {
        scheduled: webinars.filter(w => w.status === 'scheduled').length,
        completed: webinars.filter(w => w.status === 'completed').length,
        totalRegistrations: webinars.reduce((sum, w) => sum + w.metrics.registrations, 0),
        averageAttendance: webinars.length > 0 
          ? webinars.reduce((sum, w) => sum + w.metrics.attendanceRate, 0) / webinars.length 
          : 0,
        leadsGenerated: webinars.reduce((sum, w) => sum + w.metrics.leadsGenerated, 0)
      }
    };
  }

  getCampaign(campaignId: string): MarketingCampaign | undefined {
    return this.campaigns.get(campaignId);
  }

  getAllCampaigns(): MarketingCampaign[] {
    return Array.from(this.campaigns.values());
  }

  getLead(leadId: string): Lead | undefined {
    return this.leads.get(leadId);
  }

  getAllLeads(): Lead[] {
    return Array.from(this.leads.values());
  }

  getQualifiedLeads(): Lead[] {
    return this.getAllLeads().filter(lead => 
      ['hot', 'qualified'].includes(lead.status) || lead.score >= 70
    );
  }

  getContent(contentId: string): ContentPiece | undefined {
    return this.content.get(contentId);
  }

  getAllContent(): ContentPiece[] {
    return Array.from(this.content.values());
  }

  getWebinar(webinarId: string): WebinarEvent | undefined {
    return this.webinars.get(webinarId);
  }

  getAllWebinars(): WebinarEvent[] {
    return Array.from(this.webinars.values());
  }

  private generateId(prefix: string): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}