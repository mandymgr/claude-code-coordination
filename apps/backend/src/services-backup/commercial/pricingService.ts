import { EventEmitter } from 'events';

export interface PricingPlan {
  id: string;
  name: string;
  displayName: string;
  description: string;
  category: 'individual' | 'team' | 'enterprise';
  price: {
    monthly: number;
    yearly: number;
    currency: string;
  };
  features: PricingFeature[];
  limits: PricingLimits;
  popular: boolean;
  enterprise: boolean;
  customPricing: boolean;
  trialDays: number;
  stripeProductId?: string;
  stripePriceId?: {
    monthly: string;
    yearly: string;
  };
  metadata: Record<string, any>;
}

export interface PricingFeature {
  id: string;
  name: string;
  description: string;
  category: 'core' | 'ai' | 'collaboration' | 'integration' | 'security' | 'support';
  included: boolean;
  limit?: number;
  unit?: string;
  premium?: boolean;
}

export interface PricingLimits {
  projects: number;
  teamMembers: number;
  aiRequests: number;
  storage: number; // GB
  buildMinutes: number;
  integrations: number;
  customRules: number;
  apiCalls: number;
  supportLevel: 'community' | 'email' | 'priority' | 'dedicated';
}

export interface Subscription {
  id: string;
  userId: string;
  organizationId?: string;
  planId: string;
  status: 'active' | 'canceled' | 'past_due' | 'unpaid' | 'trialing';
  billingCycle: 'monthly' | 'yearly';
  currentPeriodStart: Date;
  currentPeriodEnd: Date;
  cancelAtPeriodEnd: boolean;
  trialStart?: Date;
  trialEnd?: Date;
  stripeSubscriptionId?: string;
  stripeCustomerId?: string;
  usage: UsageMetrics;
  createdAt: Date;
  updatedAt: Date;
}

export interface UsageMetrics {
  projects: number;
  teamMembers: number;
  aiRequests: number;
  storageUsed: number;
  buildMinutesUsed: number;
  integrationsUsed: number;
  apiCallsUsed: number;
  lastResetDate: Date;
}

export interface PricingQuote {
  id: string;
  organizationName: string;
  contactEmail: string;
  contactName: string;
  teamSize: number;
  requirements: QuoteRequirement[];
  estimatedPrice: number;
  customFeatures: string[];
  status: 'pending' | 'sent' | 'accepted' | 'rejected';
  validUntil: Date;
  salesRepId?: string;
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface QuoteRequirement {
  feature: string;
  description: string;
  priority: 'low' | 'medium' | 'high' | 'critical';
  estimatedCost: number;
}

export class PricingService extends EventEmitter {
  private plans: Map<string, PricingPlan> = new Map();
  private subscriptions: Map<string, Subscription> = new Map();
  private quotes: Map<string, PricingQuote> = new Map();

  constructor() {
    super();
    this.initializeDefaultPlans();
  }

  private initializeDefaultPlans(): void {
    const defaultPlans: PricingPlan[] = [
      {
        id: 'free',
        name: 'free',
        displayName: 'Free',
        description: 'Perfect for individual developers getting started',
        category: 'individual',
        price: {
          monthly: 0,
          yearly: 0,
          currency: 'USD'
        },
        features: [
          { id: 'basic_ai', name: 'Basic AI Assistance', description: 'AI-powered code suggestions', category: 'ai', included: true, limit: 100, unit: 'requests/month' },
          { id: 'code_review', name: 'Automated Code Review', description: 'Basic quality checks', category: 'core', included: true },
          { id: 'basic_integrations', name: 'Basic Integrations', description: 'GitHub integration', category: 'integration', included: true, limit: 1 },
          { id: 'community_support', name: 'Community Support', description: 'Community forums and docs', category: 'support', included: true }
        ],
        limits: {
          projects: 3,
          teamMembers: 1,
          aiRequests: 100,
          storage: 1,
          buildMinutes: 100,
          integrations: 1,
          customRules: 5,
          apiCalls: 1000,
          supportLevel: 'community'
        },
        popular: false,
        enterprise: false,
        customPricing: false,
        trialDays: 0,
        metadata: {}
      },
      {
        id: 'pro',
        name: 'pro',
        displayName: 'Pro',
        description: 'Advanced features for professional developers',
        category: 'individual',
        price: {
          monthly: 29,
          yearly: 290,
          currency: 'USD'
        },
        features: [
          { id: 'advanced_ai', name: 'Advanced AI', description: 'GPT-4, Claude, and Gemini access', category: 'ai', included: true, limit: 1000, unit: 'requests/month' },
          { id: 'smart_routing', name: 'Smart AI Routing', description: 'Intelligent provider selection', category: 'ai', included: true },
          { id: 'advanced_review', name: 'Advanced Code Review', description: 'Security scans and performance analysis', category: 'core', included: true },
          { id: 'all_integrations', name: 'All Integrations', description: 'GitHub, Jira, Slack, Teams', category: 'integration', included: true },
          { id: 'priority_builds', name: 'Priority Builds', description: 'Faster build processing', category: 'core', included: true },
          { id: 'email_support', name: 'Email Support', description: '24/7 email support', category: 'support', included: true }
        ],
        limits: {
          projects: 25,
          teamMembers: 1,
          aiRequests: 1000,
          storage: 10,
          buildMinutes: 1000,
          integrations: 10,
          customRules: 50,
          apiCalls: 10000,
          supportLevel: 'email'
        },
        popular: true,
        enterprise: false,
        customPricing: false,
        trialDays: 14,
        metadata: {}
      },
      {
        id: 'team',
        name: 'team',
        displayName: 'Team',
        description: 'Collaboration features for development teams',
        category: 'team',
        price: {
          monthly: 99,
          yearly: 990,
          currency: 'USD'
        },
        features: [
          { id: 'team_ai', name: 'Team AI Pool', description: 'Shared AI request pool', category: 'ai', included: true, limit: 5000, unit: 'requests/month' },
          { id: 'real_time_collab', name: 'Real-time Collaboration', description: 'Live code editing and review', category: 'collaboration', included: true },
          { id: 'team_analytics', name: 'Team Analytics', description: 'Performance and productivity insights', category: 'core', included: true },
          { id: 'advanced_security', name: 'Advanced Security', description: 'RBAC and audit logs', category: 'security', included: true },
          { id: 'workflow_automation', name: 'Workflow Automation', description: 'Custom CI/CD pipelines', category: 'core', included: true },
          { id: 'priority_support', name: 'Priority Support', description: 'Priority email and chat support', category: 'support', included: true }
        ],
        limits: {
          projects: 100,
          teamMembers: 10,
          aiRequests: 5000,
          storage: 100,
          buildMinutes: 5000,
          integrations: 25,
          customRules: 200,
          apiCalls: 50000,
          supportLevel: 'priority'
        },
        popular: false,
        enterprise: false,
        customPricing: false,
        trialDays: 30,
        metadata: {}
      },
      {
        id: 'enterprise',
        name: 'enterprise',
        displayName: 'Enterprise',
        description: 'Enterprise-grade features with custom solutions',
        category: 'enterprise',
        price: {
          monthly: 499,
          yearly: 4990,
          currency: 'USD'
        },
        features: [
          { id: 'unlimited_ai', name: 'Unlimited AI', description: 'Unlimited AI requests', category: 'ai', included: true },
          { id: 'custom_models', name: 'Custom AI Models', description: 'Deploy custom AI models', category: 'ai', included: true, premium: true },
          { id: 'enterprise_security', name: 'Enterprise Security', description: 'SAML, SSO, advanced compliance', category: 'security', included: true },
          { id: 'on_premise', name: 'On-Premise Deployment', description: 'Self-hosted solution', category: 'core', included: true, premium: true },
          { id: 'custom_integrations', name: 'Custom Integrations', description: 'Bespoke integration development', category: 'integration', included: true, premium: true },
          { id: 'dedicated_support', name: 'Dedicated Support', description: 'Dedicated customer success manager', category: 'support', included: true }
        ],
        limits: {
          projects: -1, // unlimited
          teamMembers: 100,
          aiRequests: -1, // unlimited
          storage: 1000,
          buildMinutes: -1, // unlimited
          integrations: -1, // unlimited
          customRules: -1, // unlimited
          apiCalls: -1, // unlimited
          supportLevel: 'dedicated'
        },
        popular: false,
        enterprise: true,
        customPricing: true,
        trialDays: 30,
        metadata: {}
      }
    ];

    defaultPlans.forEach(plan => {
      this.plans.set(plan.id, plan);
    });
  }

  getAllPlans(): PricingPlan[] {
    return Array.from(this.plans.values());
  }

  getPlan(planId: string): PricingPlan | undefined {
    return this.plans.get(planId);
  }

  getPlansForCategory(category: 'individual' | 'team' | 'enterprise'): PricingPlan[] {
    return this.getAllPlans().filter(plan => plan.category === category);
  }

  async createSubscription(subscriptionData: Omit<Subscription, 'id' | 'usage' | 'createdAt' | 'updatedAt'>): Promise<Subscription> {
    const plan = this.getPlan(subscriptionData.planId);
    if (!plan) {
      throw new Error('Invalid plan ID');
    }

    const subscription: Subscription = {
      ...subscriptionData,
      id: this.generateId('sub'),
      usage: {
        projects: 0,
        teamMembers: 1,
        aiRequests: 0,
        storageUsed: 0,
        buildMinutesUsed: 0,
        integrationsUsed: 0,
        apiCallsUsed: 0,
        lastResetDate: new Date()
      },
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.subscriptions.set(subscription.id, subscription);

    this.emit('subscription_created', subscription);

    return subscription;
  }

  async updateSubscription(subscriptionId: string, updates: Partial<Subscription>): Promise<Subscription> {
    const subscription = this.subscriptions.get(subscriptionId);
    if (!subscription) {
      throw new Error('Subscription not found');
    }

    const updatedSubscription = {
      ...subscription,
      ...updates,
      updatedAt: new Date()
    };

    this.subscriptions.set(subscriptionId, updatedSubscription);

    this.emit('subscription_updated', updatedSubscription);

    return updatedSubscription;
  }

  getSubscription(subscriptionId: string): Subscription | undefined {
    return this.subscriptions.get(subscriptionId);
  }

  getUserSubscription(userId: string): Subscription | undefined {
    return Array.from(this.subscriptions.values()).find(sub => sub.userId === userId);
  }

  getOrganizationSubscription(organizationId: string): Subscription | undefined {
    return Array.from(this.subscriptions.values()).find(sub => sub.organizationId === organizationId);
  }

  async checkUsageLimit(subscriptionId: string, limitType: keyof UsageMetrics, increment: number = 1): Promise<boolean> {
    const subscription = this.subscriptions.get(subscriptionId);
    if (!subscription) {
      throw new Error('Subscription not found');
    }

    const plan = this.getPlan(subscription.planId);
    if (!plan) {
      throw new Error('Plan not found');
    }

    const limit = plan.limits[limitType as keyof PricingLimits] as number;
    const currentUsage = subscription.usage[limitType] as number;

    // -1 means unlimited
    if (limit === -1) {
      return true;
    }

    return (currentUsage + increment) <= limit;
  }

  async updateUsage(subscriptionId: string, limitType: keyof UsageMetrics, increment: number = 1): Promise<UsageMetrics> {
    const subscription = this.subscriptions.get(subscriptionId);
    if (!subscription) {
      throw new Error('Subscription not found');
    }

    const canUse = await this.checkUsageLimit(subscriptionId, limitType, increment);
    if (!canUse) {
      throw new Error(`Usage limit exceeded for ${limitType}`);
    }

    subscription.usage[limitType] = (subscription.usage[limitType] as number) + increment;
    subscription.updatedAt = new Date();

    this.subscriptions.set(subscriptionId, subscription);

    this.emit('usage_updated', { subscriptionId, limitType, newUsage: subscription.usage[limitType] });

    return subscription.usage;
  }

  async resetUsage(subscriptionId: string): Promise<UsageMetrics> {
    const subscription = this.subscriptions.get(subscriptionId);
    if (!subscription) {
      throw new Error('Subscription not found');
    }

    subscription.usage = {
      projects: subscription.usage.projects, // Don't reset project count
      teamMembers: subscription.usage.teamMembers, // Don't reset team member count
      aiRequests: 0,
      storageUsed: subscription.usage.storageUsed, // Don't reset storage
      buildMinutesUsed: 0,
      integrationsUsed: subscription.usage.integrationsUsed, // Don't reset integration count
      apiCallsUsed: 0,
      lastResetDate: new Date()
    };

    subscription.updatedAt = new Date();
    this.subscriptions.set(subscriptionId, subscription);

    this.emit('usage_reset', subscriptionId);

    return subscription.usage;
  }

  async createQuote(quoteData: Omit<PricingQuote, 'id' | 'estimatedPrice' | 'createdAt' | 'updatedAt'>): Promise<PricingQuote> {
    const estimatedPrice = this.calculateQuotePrice(quoteData.teamSize, quoteData.requirements);

    const quote: PricingQuote = {
      ...quoteData,
      id: this.generateId('quote'),
      estimatedPrice,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.quotes.set(quote.id, quote);

    this.emit('quote_created', quote);

    return quote;
  }

  private calculateQuotePrice(teamSize: number, requirements: QuoteRequirement[]): number {
    const basePrice = teamSize * 150; // Base price per team member
    const requirementsCost = requirements.reduce((total, req) => total + req.estimatedCost, 0);
    const complexityMultiplier = Math.max(1, Math.sqrt(requirements.length) * 0.5);
    
    return Math.round((basePrice + requirementsCost) * complexityMultiplier);
  }

  getQuote(quoteId: string): PricingQuote | undefined {
    return this.quotes.get(quoteId);
  }

  async updateQuote(quoteId: string, updates: Partial<PricingQuote>): Promise<PricingQuote> {
    const quote = this.quotes.get(quoteId);
    if (!quote) {
      throw new Error('Quote not found');
    }

    const updatedQuote = {
      ...quote,
      ...updates,
      updatedAt: new Date()
    };

    this.quotes.set(quoteId, updatedQuote);

    this.emit('quote_updated', updatedQuote);

    return updatedQuote;
  }

  getAllQuotes(): PricingQuote[] {
    return Array.from(this.quotes.values());
  }

  getPendingQuotes(): PricingQuote[] {
    return this.getAllQuotes().filter(quote => quote.status === 'pending');
  }

  async calculateUpgrade(currentPlanId: string, targetPlanId: string): Promise<{
    priceDifference: number;
    featureUpgrades: string[];
    limitUpgrades: Record<string, { current: number; new: number }>;
  }> {
    const currentPlan = this.getPlan(currentPlanId);
    const targetPlan = this.getPlan(targetPlanId);

    if (!currentPlan || !targetPlan) {
      throw new Error('Invalid plan IDs');
    }

    const priceDifference = targetPlan.price.monthly - currentPlan.price.monthly;

    const featureUpgrades = targetPlan.features
      .filter(feature => 
        !currentPlan.features.some(currentFeature => 
          currentFeature.id === feature.id && currentFeature.included
        ) && feature.included
      )
      .map(feature => feature.name);

    const limitUpgrades: Record<string, { current: number; new: number }> = {};
    Object.entries(targetPlan.limits).forEach(([key, newLimit]) => {
      const currentLimit = currentPlan.limits[key as keyof PricingLimits] as number;
      if (newLimit > currentLimit || newLimit === -1) {
        limitUpgrades[key] = { current: currentLimit, new: newLimit };
      }
    });

    return {
      priceDifference,
      featureUpgrades,
      limitUpgrades
    };
  }

  async generateRevenueReport(timeRange: { start: Date; end: Date }): Promise<{
    totalRevenue: number;
    subscriptionRevenue: number;
    enterpriseRevenue: number;
    revenueByPlan: Record<string, number>;
    activeSubscriptions: number;
    newSubscriptions: number;
    churnedSubscriptions: number;
    averageRevenuePerUser: number;
  }> {
    const subscriptions = Array.from(this.subscriptions.values()).filter(
      sub => sub.createdAt >= timeRange.start && sub.createdAt <= timeRange.end
    );

    const revenueByPlan: Record<string, number> = {};
    let totalRevenue = 0;
    let subscriptionRevenue = 0;
    let enterpriseRevenue = 0;

    subscriptions.forEach(subscription => {
      const plan = this.getPlan(subscription.planId);
      if (!plan) return;

      const monthlyPrice = plan.price.monthly;
      const revenue = subscription.billingCycle === 'yearly' 
        ? plan.price.yearly 
        : monthlyPrice;

      totalRevenue += revenue;
      
      if (plan.enterprise) {
        enterpriseRevenue += revenue;
      } else {
        subscriptionRevenue += revenue;
      }

      revenueByPlan[plan.name] = (revenueByPlan[plan.name] || 0) + revenue;
    });

    const activeSubscriptions = subscriptions.filter(sub => sub.status === 'active').length;
    const newSubscriptions = subscriptions.filter(sub => 
      sub.createdAt >= timeRange.start && sub.createdAt <= timeRange.end
    ).length;
    const churnedSubscriptions = subscriptions.filter(sub => 
      sub.status === 'canceled' && sub.updatedAt >= timeRange.start && sub.updatedAt <= timeRange.end
    ).length;

    const averageRevenuePerUser = activeSubscriptions > 0 ? totalRevenue / activeSubscriptions : 0;

    return {
      totalRevenue,
      subscriptionRevenue,
      enterpriseRevenue,
      revenueByPlan,
      activeSubscriptions,
      newSubscriptions,
      churnedSubscriptions,
      averageRevenuePerUser
    };
  }

  private generateId(prefix: string): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}