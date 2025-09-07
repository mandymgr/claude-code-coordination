import { EventEmitter } from 'events';

export interface SalesLead {
  id: string;
  contactInfo: ContactInfo;
  company: CompanyInfo;
  opportunity: OpportunityInfo;
  source: string; // marketing campaign, referral, inbound, etc.
  status: 'new' | 'contacted' | 'qualified' | 'proposal' | 'negotiation' | 'closed_won' | 'closed_lost';
  priority: 'low' | 'medium' | 'high' | 'critical';
  score: number; // 0-100
  assignedTo: string; // sales rep ID
  interactions: SalesInteraction[];
  timeline: SalesTimeline[];
  requirements: TechnicalRequirement[];
  budget: BudgetInfo;
  decisionMakers: DecisionMaker[];
  competitors: string[];
  notes: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ContactInfo {
  firstName: string;
  lastName: string;
  email: string;
  phone?: string;
  jobTitle: string;
  linkedin?: string;
  timezone: string;
  preferredContactMethod: 'email' | 'phone' | 'linkedin' | 'teams' | 'zoom';
}

export interface CompanyInfo {
  name: string;
  domain: string;
  industry: string;
  size: string; // '1-10', '11-50', '51-200', '201-1000', '1000+'
  revenue?: string; // '< $1M', '$1M-$10M', '$10M-$100M', '$100M+'
  location: {
    country: string;
    region: string;
    timezone: string;
  };
  techStack: string[];
  currentTools: string[];
  painPoints: string[];
}

export interface OpportunityInfo {
  dealValue: number;
  currency: string;
  probability: number; // 0-100%
  expectedCloseDate: Date;
  salesCycle: number; // estimated days
  planInterest: string[]; // plan IDs they're interested in
  teamSize: number;
  timeline: string; // 'immediate', '1-3months', '3-6months', '6-12months'
  urgency: 'low' | 'medium' | 'high' | 'critical';
}

export interface SalesInteraction {
  id: string;
  type: 'call' | 'email' | 'meeting' | 'demo' | 'proposal' | 'follow_up' | 'technical_call';
  timestamp: Date;
  duration?: number; // minutes for calls/meetings
  outcome: 'positive' | 'neutral' | 'negative' | 'no_response';
  summary: string;
  nextAction?: {
    type: string;
    dueDate: Date;
    assignedTo: string;
    description: string;
  };
  attendees?: string[];
  materials?: string[]; // URLs or file references
}

export interface SalesTimeline {
  id: string;
  stage: string;
  timestamp: Date;
  duration: number; // days in this stage
  notes: string;
  probability: number;
}

export interface TechnicalRequirement {
  id: string;
  category: 'integration' | 'security' | 'compliance' | 'performance' | 'scalability' | 'customization';
  requirement: string;
  priority: 'must_have' | 'nice_to_have' | 'future';
  status: 'identified' | 'evaluated' | 'quoted' | 'approved' | 'implemented';
  estimatedCost: number;
  estimatedTime: number; // hours
  technicalContact?: string;
}

export interface BudgetInfo {
  total: number;
  currency: string;
  timeframe: string; // 'annual', 'quarterly', 'one-time'
  approver: string;
  approvalProcess: string;
  currentSpend?: number;
  budgetCycle: 'calendar' | 'fiscal';
  constraints: string[];
}

export interface DecisionMaker {
  id: string;
  name: string;
  title: string;
  role: 'champion' | 'influencer' | 'decision_maker' | 'user' | 'blocker';
  influence: 'low' | 'medium' | 'high';
  sentiment: 'positive' | 'neutral' | 'negative' | 'unknown';
  concerns: string[];
  contacted: boolean;
  lastContact?: Date;
}

export interface SalesProposal {
  id: string;
  leadId: string;
  title: string;
  description: string;
  proposedSolution: ProposedSolution;
  pricing: ProposalPricing;
  timeline: ProposalTimeline;
  terms: ProposalTerms;
  status: 'draft' | 'sent' | 'viewed' | 'accepted' | 'rejected' | 'expired';
  version: number;
  validUntil: Date;
  createdBy: string;
  sentAt?: Date;
  viewedAt?: Date;
  respondedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProposedSolution {
  plans: string[]; // plan IDs
  customFeatures: string[];
  integrations: string[];
  supportLevel: string;
  implementationSupport: boolean;
  training: boolean;
  onboarding: string; // 'self-service', 'guided', 'full-service'
  migration: {
    included: boolean;
    estimatedTime: number;
    dataSize: string;
  };
}

export interface ProposalPricing {
  basePrice: number;
  customizations: number;
  implementation: number;
  training: number;
  support: number;
  total: number;
  currency: string;
  billingCycle: 'monthly' | 'quarterly' | 'annually';
  discounts: Array<{
    type: string;
    amount: number;
    description: string;
  }>;
  paymentTerms: string;
}

export interface ProposalTimeline {
  kickoff: Date;
  implementation: {
    start: Date;
    end: Date;
    milestones: Array<{
      name: string;
      date: Date;
      deliverables: string[];
    }>;
  };
  training: {
    start: Date;
    end: Date;
    sessions: number;
  };
  goLive: Date;
}

export interface ProposalTerms {
  contractLength: number; // months
  renewalTerms: string;
  cancellationTerms: string;
  slaCommitments: string[];
  dataRetention: string;
  compliance: string[];
  liability: string;
  supportHours: string;
}

export interface SalesReport {
  period: { start: Date; end: Date };
  metrics: {
    totalLeads: number;
    qualifiedLeads: number;
    proposals: number;
    closedWon: number;
    closedLost: number;
    pipeline: number;
    revenue: number;
    averageDealSize: number;
    conversionRate: number;
    salesCycle: number; // average days
  };
  pipeline: {
    byStage: Record<string, number>;
    byPriority: Record<string, number>;
    bySource: Record<string, number>;
    totalValue: number;
    weightedValue: number;
  };
  performance: {
    byRep: Array<{
      repId: string;
      leads: number;
      proposals: number;
      closedWon: number;
      revenue: number;
    }>;
    topPerformers: string[];
    activities: {
      calls: number;
      meetings: number;
      emails: number;
      demos: number;
    };
  };
}

export class SalesService extends EventEmitter {
  private leads: Map<string, SalesLead> = new Map();
  private proposals: Map<string, SalesProposal> = new Map();
  private salesReps: Map<string, any> = new Map(); // Would typically come from user service

  constructor() {
    super();
    this.initializeSalesReps();
  }

  private initializeSalesReps(): void {
    // Initialize default sales reps (would typically come from user service)
    const defaultReps = [
      { id: 'rep1', name: 'Sarah Chen', email: 'sarah@claudecode.dev', territory: 'North America' },
      { id: 'rep2', name: 'Marcus Johnson', email: 'marcus@claudecode.dev', territory: 'Europe' },
      { id: 'rep3', name: 'Yuki Tanaka', email: 'yuki@claudecode.dev', territory: 'Asia Pacific' }
    ];

    defaultReps.forEach(rep => {
      this.salesReps.set(rep.id, rep);
    });
  }

  async createLead(leadData: Omit<SalesLead, 'id' | 'score' | 'interactions' | 'timeline' | 'createdAt' | 'updatedAt'>): Promise<SalesLead> {
    const lead: SalesLead = {
      ...leadData,
      id: this.generateId('lead'),
      score: this.calculateLeadScore(leadData),
      interactions: [],
      timeline: [{
        id: this.generateId('timeline'),
        stage: leadData.status,
        timestamp: new Date(),
        duration: 0,
        notes: 'Lead created',
        probability: leadData.opportunity.probability
      }],
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.leads.set(lead.id, lead);

    // Auto-assign based on territory or round-robin
    if (!lead.assignedTo) {
      lead.assignedTo = this.autoAssignSalesRep(lead);
    }

    this.emit('lead_created', lead);

    return lead;
  }

  private calculateLeadScore(leadData: Partial<SalesLead>): number {
    let score = 0;

    // Company size scoring
    const sizeScoring = {
      '1-10': 10,
      '11-50': 20,
      '51-200': 30,
      '201-1000': 40,
      '1000+': 50
    };
    score += sizeScoring[leadData.company?.size as keyof typeof sizeScoring] || 0;

    // Deal value scoring
    const dealValue = leadData.opportunity?.dealValue || 0;
    if (dealValue > 100000) score += 30;
    else if (dealValue > 50000) score += 20;
    else if (dealValue > 10000) score += 10;
    else if (dealValue > 1000) score += 5;

    // Urgency scoring
    const urgencyScoring = {
      'critical': 20,
      'high': 15,
      'medium': 10,
      'low': 5
    };
    score += urgencyScoring[leadData.opportunity?.urgency as keyof typeof urgencyScoring] || 0;

    // Title scoring
    const title = leadData.contactInfo?.jobTitle?.toLowerCase() || '';
    if (title.includes('cto') || title.includes('ceo')) score += 20;
    else if (title.includes('vp') || title.includes('director')) score += 15;
    else if (title.includes('manager') || title.includes('lead')) score += 10;
    else if (title.includes('senior')) score += 5;

    // Pain points alignment
    const painPoints = leadData.company?.painPoints || [];
    const relevantPainPoints = ['code quality', 'team collaboration', 'ai development', 'automation'];
    const matches = painPoints.filter(pain => 
      relevantPainPoints.some(relevant => pain.toLowerCase().includes(relevant))
    ).length;
    score += matches * 5;

    return Math.min(100, Math.max(0, score));
  }

  private autoAssignSalesRep(lead: SalesLead): string {
    // Simple territory-based assignment
    const region = lead.company.location.region;
    
    if (region.includes('North America')) return 'rep1';
    if (region.includes('Europe')) return 'rep2';
    if (region.includes('Asia')) return 'rep3';
    
    // Round-robin fallback
    const reps = Array.from(this.salesReps.keys());
    return reps[this.leads.size % reps.length];
  }

  async addInteraction(leadId: string, interaction: Omit<SalesInteraction, 'id'>): Promise<SalesLead> {
    const lead = this.leads.get(leadId);
    if (!lead) {
      throw new Error('Lead not found');
    }

    const newInteraction: SalesInteraction = {
      ...interaction,
      id: this.generateId('interaction')
    };

    lead.interactions.push(newInteraction);
    lead.updatedAt = new Date();

    // Update lead score based on interaction outcome
    if (interaction.outcome === 'positive') {
      lead.score = Math.min(100, lead.score + 5);
    } else if (interaction.outcome === 'negative') {
      lead.score = Math.max(0, lead.score - 3);
    }

    this.leads.set(leadId, lead);

    this.emit('interaction_added', { lead, interaction: newInteraction });

    return lead;
  }

  async updateLeadStatus(leadId: string, newStatus: SalesLead['status'], notes?: string): Promise<SalesLead> {
    const lead = this.leads.get(leadId);
    if (!lead) {
      throw new Error('Lead not found');
    }

    const previousStatus = lead.status;
    lead.status = newStatus;
    lead.updatedAt = new Date();

    // Calculate time in previous stage
    const lastTimeline = lead.timeline[lead.timeline.length - 1];
    if (lastTimeline) {
      lastTimeline.duration = Math.floor(
        (new Date().getTime() - lastTimeline.timestamp.getTime()) / (1000 * 60 * 60 * 24)
      );
    }

    // Add new timeline entry
    const probabilityMap = {
      'new': 10,
      'contacted': 20,
      'qualified': 40,
      'proposal': 60,
      'negotiation': 80,
      'closed_won': 100,
      'closed_lost': 0
    };

    lead.timeline.push({
      id: this.generateId('timeline'),
      stage: newStatus,
      timestamp: new Date(),
      duration: 0,
      notes: notes || `Status changed from ${previousStatus} to ${newStatus}`,
      probability: probabilityMap[newStatus]
    });

    lead.opportunity.probability = probabilityMap[newStatus];

    this.leads.set(leadId, lead);

    this.emit('lead_status_updated', { lead, previousStatus, newStatus });

    return lead;
  }

  async createProposal(proposalData: Omit<SalesProposal, 'id' | 'version' | 'createdAt' | 'updatedAt'>): Promise<SalesProposal> {
    const existingProposals = Array.from(this.proposals.values())
      .filter(p => p.leadId === proposalData.leadId);

    const proposal: SalesProposal = {
      ...proposalData,
      id: this.generateId('proposal'),
      version: existingProposals.length + 1,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    this.proposals.set(proposal.id, proposal);

    // Update lead status to proposal
    await this.updateLeadStatus(proposalData.leadId, 'proposal', 'Proposal created');

    this.emit('proposal_created', proposal);

    return proposal;
  }

  async sendProposal(proposalId: string): Promise<SalesProposal> {
    const proposal = this.proposals.get(proposalId);
    if (!proposal) {
      throw new Error('Proposal not found');
    }

    proposal.status = 'sent';
    proposal.sentAt = new Date();
    proposal.updatedAt = new Date();

    this.proposals.set(proposalId, proposal);

    this.emit('proposal_sent', proposal);

    return proposal;
  }

  async updateProposalStatus(proposalId: string, status: SalesProposal['status']): Promise<SalesProposal> {
    const proposal = this.proposals.get(proposalId);
    if (!proposal) {
      throw new Error('Proposal not found');
    }

    const previousStatus = proposal.status;
    proposal.status = status;
    proposal.updatedAt = new Date();

    if (status === 'viewed' && !proposal.viewedAt) {
      proposal.viewedAt = new Date();
    } else if (['accepted', 'rejected'].includes(status)) {
      proposal.respondedAt = new Date();
    }

    this.proposals.set(proposalId, proposal);

    // Update lead status based on proposal status
    if (status === 'accepted') {
      await this.updateLeadStatus(proposal.leadId, 'closed_won', 'Proposal accepted');
    } else if (status === 'rejected') {
      await this.updateLeadStatus(proposal.leadId, 'closed_lost', 'Proposal rejected');
    }

    this.emit('proposal_status_updated', { proposal, previousStatus, newStatus: status });

    return proposal;
  }

  async generateSalesReport(timeRange: { start: Date; end: Date }): Promise<SalesReport> {
    const leads = Array.from(this.leads.values()).filter(
      lead => lead.createdAt >= timeRange.start && lead.createdAt <= timeRange.end
    );

    const proposals = Array.from(this.proposals.values()).filter(
      proposal => proposal.createdAt >= timeRange.start && proposal.createdAt <= timeRange.end
    );

    const closedWonLeads = leads.filter(lead => lead.status === 'closed_won');
    const closedLostLeads = leads.filter(lead => lead.status === 'closed_lost');
    const qualifiedLeads = leads.filter(lead => 
      ['qualified', 'proposal', 'negotiation'].includes(lead.status)
    );

    const totalRevenue = closedWonLeads.reduce((sum, lead) => sum + lead.opportunity.dealValue, 0);
    const averageDealSize = closedWonLeads.length > 0 ? totalRevenue / closedWonLeads.length : 0;
    const conversionRate = leads.length > 0 ? closedWonLeads.length / leads.length : 0;

    // Calculate average sales cycle
    const completedLeads = [...closedWonLeads, ...closedLostLeads];
    const averageSalesCycle = completedLeads.length > 0
      ? completedLeads.reduce((sum, lead) => {
          const cycleTime = lead.updatedAt.getTime() - lead.createdAt.getTime();
          return sum + (cycleTime / (1000 * 60 * 60 * 24)); // days
        }, 0) / completedLeads.length
      : 0;

    // Pipeline analysis
    const pipelineLeads = leads.filter(lead => 
      !['closed_won', 'closed_lost'].includes(lead.status)
    );

    const byStage = pipelineLeads.reduce((acc, lead) => {
      acc[lead.status] = (acc[lead.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const byPriority = pipelineLeads.reduce((acc, lead) => {
      acc[lead.priority] = (acc[lead.priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const bySource = leads.reduce((acc, lead) => {
      acc[lead.source] = (acc[lead.source] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    const totalPipelineValue = pipelineLeads.reduce((sum, lead) => sum + lead.opportunity.dealValue, 0);
    const weightedPipelineValue = pipelineLeads.reduce(
      (sum, lead) => sum + (lead.opportunity.dealValue * lead.opportunity.probability / 100), 
      0
    );

    // Performance by rep
    const byRep = Array.from(this.salesReps.keys()).map(repId => {
      const repLeads = leads.filter(lead => lead.assignedTo === repId);
      const repProposals = proposals.filter(proposal => 
        repLeads.some(lead => lead.id === proposal.leadId)
      );
      const repClosedWon = repLeads.filter(lead => lead.status === 'closed_won');
      const repRevenue = repClosedWon.reduce((sum, lead) => sum + lead.opportunity.dealValue, 0);

      return {
        repId,
        leads: repLeads.length,
        proposals: repProposals.length,
        closedWon: repClosedWon.length,
        revenue: repRevenue
      };
    });

    // Activity metrics
    const allInteractions = leads.flatMap(lead => lead.interactions);
    const activities = {
      calls: allInteractions.filter(i => i.type === 'call').length,
      meetings: allInteractions.filter(i => i.type === 'meeting').length,
      emails: allInteractions.filter(i => i.type === 'email').length,
      demos: allInteractions.filter(i => i.type === 'demo').length
    };

    return {
      period: timeRange,
      metrics: {
        totalLeads: leads.length,
        qualifiedLeads: qualifiedLeads.length,
        proposals: proposals.length,
        closedWon: closedWonLeads.length,
        closedLost: closedLostLeads.length,
        pipeline: pipelineLeads.length,
        revenue: totalRevenue,
        averageDealSize,
        conversionRate,
        salesCycle: averageSalesCycle
      },
      pipeline: {
        byStage,
        byPriority,
        bySource,
        totalValue: totalPipelineValue,
        weightedValue: weightedPipelineValue
      },
      performance: {
        byRep,
        topPerformers: byRep
          .sort((a, b) => b.revenue - a.revenue)
          .slice(0, 3)
          .map(rep => rep.repId),
        activities
      }
    };
  }

  getLead(leadId: string): SalesLead | undefined {
    return this.leads.get(leadId);
  }

  getAllLeads(): SalesLead[] {
    return Array.from(this.leads.values());
  }

  getLeadsByRep(repId: string): SalesLead[] {
    return this.getAllLeads().filter(lead => lead.assignedTo === repId);
  }

  getProposal(proposalId: string): SalesProposal | undefined {
    return this.proposals.get(proposalId);
  }

  getAllProposals(): SalesProposal[] {
    return Array.from(this.proposals.values());
  }

  getLeadProposals(leadId: string): SalesProposal[] {
    return this.getAllProposals().filter(proposal => proposal.leadId === leadId);
  }

  getQualifiedLeads(): SalesLead[] {
    return this.getAllLeads().filter(lead => 
      lead.score >= 60 && ['qualified', 'proposal', 'negotiation'].includes(lead.status)
    );
  }

  getHotLeads(): SalesLead[] {
    return this.getAllLeads().filter(lead => 
      lead.priority === 'high' || lead.priority === 'critical' || lead.score >= 80
    );
  }

  private generateId(prefix: string): string {
    return `${prefix}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
}