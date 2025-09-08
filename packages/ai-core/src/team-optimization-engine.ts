/**
 * 🚀 Team Optimization Engine - Main Orchestrator
 * Enterprise-grade team composition optimization with ML intelligence
 * TypeScript implementation for KRINS-Universe-Builder
 */

import { 
  TeamMember, 
  ProjectRequirements, 
  TeamComposition, 
  OptimizationResult, 
  OptimizationStrategy,
  OptimizationConfig,
  OptimizationAnalytics,
  TeamOptimizationEvent,
  CollaborationHistory,
  OptimizationPreferences
} from './team-optimization-types.js';

import { TeamOptimizationML } from './team-optimization-ml.js';
import { UniversalProjectDetector } from './universal-project-detector.js';

export interface TeamDatabase {
  members: Map<string, TeamMember>;
  projects: Map<string, ProjectRequirements>;
  history: TeamOptimizationEvent[];
  analytics: OptimizationAnalytics;
}

export class TeamOptimizationEngine {
  private mlEngine: TeamOptimizationML;
  private projectDetector: UniversalProjectDetector;
  private database: TeamDatabase;
  private eventListeners: Map<string, Function[]>;

  constructor(projectPath?: string) {
    this.mlEngine = new TeamOptimizationML();
    this.projectDetector = new UniversalProjectDetector(projectPath || process.cwd());
    this.eventListeners = new Map();
    
    this.database = {
      members: new Map(),
      projects: new Map(),
      history: [],
      analytics: this.initializeAnalytics()
    };

    this.initializeDefaultMembers();
  }

  /**
   * 🎯 Main entry point: Optimize team for project
   */
  public async optimizeTeamForProject(
    projectPath: string,
    strategy: OptimizationStrategy = 'balanced',
    preferences: OptimizationPreferences = {
      prioritizeExperience: false,
      allowSkillDevelopment: true,
      maximizeInnovation: false,
      minimizeRisk: false,
      preferStableTeams: false,
      encourageDiversity: true,
      focusOnCommunication: false
    }
  ): Promise<OptimizationResult> {
    console.log('🚀 Starting team optimization engine...');
    
    const startTime = performance.now();
    
    try {
      // 1. Analyze project requirements
      const projectAnalysis = await this.analyzeProject(projectPath);
      const requirements = this.convertAnalysisToRequirements(projectAnalysis);
      
      // 2. Get available team members
      const availableMembers = Array.from(this.database.members.values())
        .filter(member => member.availability > 0.3); // Only consider available members
      
      console.log(`📊 Project analysis: ${requirements.type} (complexity: ${Math.round(requirements.complexity * 100)}%)`);
      console.log(`👥 Available team members: ${availableMembers.length}`);
      
      // 3. Configure optimization
      const config: OptimizationConfig = {
        strategy,
        constraints: requirements.constraints,
        preferences,
        mlEnabled: true,
        historicalWeight: 0.3,
        realTimeAdjustments: true,
        uncertaintyTolerance: 0.2
      };
      
      // 4. Run ML optimization
      const result = await this.mlEngine.optimizeTeam(availableMembers, requirements, config);
      
      // 5. Post-process and enhance results
      const enhancedResult = await this.enhanceOptimizationResult(result, requirements);
      
      // 6. Log event and update analytics
      this.logOptimizationEvent('optimization-request', {
        projectPath,
        strategy,
        teamSize: result.composition.members.length,
        confidence: result.confidence,
        duration: performance.now() - startTime
      });
      
      this.updateAnalytics(enhancedResult);
      
      const duration = performance.now() - startTime;
      console.log(`✅ Team optimization complete in ${Math.round(duration)}ms`);
      console.log(`🎯 Confidence: ${Math.round(enhancedResult.confidence * 100)}%`);
      
      return enhancedResult;
      
    } catch (error) {
      console.error('❌ Team optimization failed:', error);
      throw error;
    }
  }

  /**
   * 🔍 Analyze project and detect requirements
   */
  private async analyzeProject(projectPath: string) {
    console.log(`🔍 Analyzing project: ${projectPath}`);
    
    try {
      const analysis = await this.projectDetector.analyze();
      console.log(`📋 Detected: ${analysis.type} project with ${analysis.frameworks.join(', ')} frameworks`);
      return analysis;
    } catch (error) {
      console.warn('⚠️ Project analysis failed, using defaults:', error);
      return {
        type: 'web-application',
        languages: ['javascript'],
        frameworks: ['react'],
        complexity: 0.5,
        hasTests: false,
        hasDocumentation: false,
        technologies: ['react', 'node'],
        recommendations: [],
        structure: {}
      };
    }
  }

  /**
   * 🔄 Convert project analysis to optimization requirements
   */
  private convertAnalysisToRequirements(analysis: any): ProjectRequirements {
    const typeMapping: Record<string, any> = {
      'react-app': 'web-frontend',
      'node-api': 'web-backend',
      'fullstack': 'web-fullstack',
      'web-application': 'web-fullstack',
      'mobile-app': 'mobile-app',
      'data-science': 'data-analytics',
      'ml-project': 'machine-learning',
      'api': 'api-development',
      'microservices': 'microservices'
    };

    const skillMapping: Record<string, string[]> = {
      'web-frontend': ['react', 'javascript', 'css', 'html', 'ui-ux'],
      'web-backend': ['node', 'api', 'database', 'server', 'security'],
      'web-fullstack': ['react', 'node', 'javascript', 'database', 'api', 'ui-ux'],
      'mobile-app': ['react-native', 'mobile', 'ui-ux', 'api'],
      'data-analytics': ['python', 'sql', 'data-science', 'visualization'],
      'machine-learning': ['python', 'ml', 'tensorflow', 'data-science'],
      'api-development': ['node', 'api', 'database', 'microservices'],
      'microservices': ['node', 'docker', 'kubernetes', 'api', 'database']
    };

    const projectType = typeMapping[analysis.type] || 'web-fullstack';
    const requiredSkills = [...(skillMapping[projectType] || ['javascript', 'node'])];
    
    // Add framework-specific skills
    if (analysis.frameworks && Array.isArray(analysis.frameworks)) {
      analysis.frameworks.forEach((framework: string) => {
        if (framework && !requiredSkills.includes(framework.toLowerCase())) {
          requiredSkills.push(framework.toLowerCase());
        }
      });
    }

    // Calculate complexity properly
    const complexity = Math.min(
      Math.max(
        isNaN(analysis.complexity) ? 0.5 : analysis.complexity,
        0.1
      ),
      1.0
    );

    return {
      type: projectType,
      complexity,
      estimatedDuration: this.estimateProjectDuration(analysis),
      priority: this.determineProjectPriority(analysis),
      requiredSkills,
      optionalSkills: ['testing', 'documentation', 'devops'],
      technologies: analysis.technologies || [],
      constraints: {
        maxTeamSize: this.calculateMaxTeamSize(complexity),
        minTeamSize: this.calculateMinTeamSize(complexity),
        deadline: this.calculateDeadline(analysis),
        location: 'remote',
        securityLevel: this.determineSecurityLevel(analysis)
      }
    };
  }

  /**
   * 🎨 Enhance optimization result with additional insights
   */
  private async enhanceOptimizationResult(
    result: OptimizationResult,
    requirements: ProjectRequirements
  ): Promise<OptimizationResult> {
    
    // Add team chemistry analysis
    const chemistryScore = this.analyzeTeamChemistry(result.composition.members);
    result.composition.metrics.collaborationPotential = chemistryScore;
    
    // Add cost estimation
    const costEstimate = this.estimateProjectCost(result.composition, requirements);
    result.predictions.budgetRequirement = costEstimate;
    
    // Add timeline refinement
    const refinedTimeline = this.refineTimelineEstimate(result.composition, requirements);
    result.predictions.timeToCompletion = refinedTimeline;
    
    // Add success probability with confidence intervals
    const successPrediction = this.calculateSuccessProbability(result.composition, requirements);
    result.predictions.estimatedSuccess = successPrediction.mean;
    
    // Add alternative team suggestions
    result.composition.alternatives = await this.generateAlternativeTeams(
      result.composition,
      requirements,
      2 // Generate 2 alternatives
    );

    return result;
  }

  /**
   * 👥 Initialize default team members for testing/demo
   */
  private initializeDefaultMembers(): void {
    const defaultMembers: TeamMember[] = [
      {
        id: 'claude-frontend',
        name: 'Claude Frontend Specialist',
        skills: ['react', 'typescript', 'css', 'html', 'ui-ux', 'javascript'],
        experience: { react: 5, typescript: 4, 'ui-ux': 3, frontend: 5 },
        availability: 0.9,
        preferences: { projectTypes: ['web-frontend', 'web-fullstack'] },
        performance: {
          tasksCompleted: 150,
          averageRating: 4.7,
          successRate: 0.92,
          responseTime: 2.3,
          collaborationScore: 0.88,
          specialtyAreas: ['react', 'typescript', 'component-design'],
          lastActive: Date.now() - 3600000 // 1 hour ago
        }
      },
      {
        id: 'gpt4-backend',
        name: 'GPT-4 Backend Architect',
        skills: ['node', 'api', 'database', 'microservices', 'docker', 'security'],
        experience: { node: 6, api: 5, database: 4, microservices: 3, security: 4 },
        availability: 0.85,
        preferences: { projectTypes: ['web-backend', 'api-development', 'microservices'] },
        performance: {
          tasksCompleted: 200,
          averageRating: 4.8,
          successRate: 0.94,
          responseTime: 1.8,
          collaborationScore: 0.85,
          specialtyAreas: ['api-design', 'database-optimization', 'scalability'],
          lastActive: Date.now() - 1800000 // 30 minutes ago
        }
      },
      {
        id: 'gemini-fullstack',
        name: 'Gemini Full-Stack Generalist',
        skills: ['react', 'node', 'python', 'database', 'devops', 'testing'],
        experience: { react: 3, node: 4, python: 5, database: 3, devops: 4 },
        availability: 0.95,
        preferences: { projectTypes: ['web-fullstack', 'startup-mvp', 'data-analytics'] },
        performance: {
          tasksCompleted: 120,
          averageRating: 4.5,
          successRate: 0.89,
          responseTime: 2.1,
          collaborationScore: 0.92,
          specialtyAreas: ['full-stack-integration', 'rapid-prototyping', 'problem-solving'],
          lastActive: Date.now() - 900000 // 15 minutes ago
        }
      },
      {
        id: 'perplexity-research',
        name: 'Perplexity Research Specialist',
        skills: ['python', 'data-science', 'ml', 'research', 'documentation'],
        experience: { python: 4, 'data-science': 5, ml: 3, research: 6 },
        availability: 0.8,
        preferences: { projectTypes: ['data-analytics', 'machine-learning', 'research-prototype'] },
        performance: {
          tasksCompleted: 80,
          averageRating: 4.9,
          successRate: 0.96,
          responseTime: 3.2,
          collaborationScore: 0.78,
          specialtyAreas: ['data-analysis', 'ml-models', 'technical-writing'],
          lastActive: Date.now() - 7200000 // 2 hours ago
        }
      },
      {
        id: 'copilot-devops',
        name: 'GitHub Copilot DevOps Engineer',
        skills: ['docker', 'kubernetes', 'ci-cd', 'monitoring', 'security', 'cloud'],
        experience: { docker: 5, kubernetes: 4, 'ci-cd': 5, cloud: 4, security: 3 },
        availability: 0.75,
        preferences: { projectTypes: ['devops-infrastructure', 'microservices', 'enterprise-software'] },
        performance: {
          tasksCompleted: 95,
          averageRating: 4.6,
          successRate: 0.91,
          responseTime: 2.5,
          collaborationScore: 0.83,
          specialtyAreas: ['automation', 'infrastructure', 'deployment-optimization'],
          lastActive: Date.now() - 1800000 // 30 minutes ago
        }
      }
    ];

    defaultMembers.forEach(member => {
      this.database.members.set(member.id, member);
    });

    console.log(`👥 Initialized ${defaultMembers.length} default team members`);
  }

  /**
   * 🧪 Analyze team chemistry and collaboration potential
   */
  private analyzeTeamChemistry(members: TeamMember[]): number {
    if (members.length < 2) return 1.0;
    
    let chemistryScore = 0;
    let pairCount = 0;
    
    // Analyze all member pairs
    for (let i = 0; i < members.length; i++) {
      for (let j = i + 1; j < members.length; j++) {
        const member1 = members[i];
        const member2 = members[j];
        
        // Skill complementarity
        const skillOverlap = this.calculateSkillOverlap(member1.skills, member2.skills);
        const complementarity = 1 - skillOverlap; // Less overlap = better complementarity
        
        // Experience balance
        const exp1 = Object.values(member1.experience).reduce((s, e) => s + e, 0);
        const exp2 = Object.values(member2.experience).reduce((s, e) => s + e, 0);
        const experienceBalance = 1 - Math.abs(exp1 - exp2) / Math.max(exp1, exp2, 1);
        
        // Communication compatibility
        const comm1 = member1.performance.collaborationScore;
        const comm2 = member2.performance.collaborationScore;
        const commCompatibility = Math.min(comm1, comm2); // Limited by weakest communicator
        
        // Response time sync
        const time1 = member1.performance.responseTime;
        const time2 = member2.performance.responseTime;
        const timeSync = 1 - Math.abs(time1 - time2) / Math.max(time1, time2);
        
        const pairScore = (complementarity * 0.3 + experienceBalance * 0.2 + 
                          commCompatibility * 0.3 + timeSync * 0.2);
        
        chemistryScore += pairScore;
        pairCount++;
      }
    }
    
    return pairCount > 0 ? chemistryScore / pairCount : 0.5;
  }

  /**
   * 💰 Estimate project cost based on team composition
   */
  private estimateProjectCost(team: TeamComposition, requirements: ProjectRequirements): number {
    const baseCost = {
      'web-frontend': 50000,
      'web-backend': 60000,
      'web-fullstack': 80000,
      'mobile-app': 70000,
      'data-analytics': 65000,
      'machine-learning': 85000,
      'api-development': 55000,
      'microservices': 90000,
      'enterprise-software': 120000,
      'devops-infrastructure': 75000,
      'security-focused': 95000,
      'blockchain-dapp': 110000,
      'game-development': 100000,
      'startup-mvp': 40000,
      'research-prototype': 35000,
      'legacy-migration': 80000,
      'ecommerce-platform': 90000
    };
    
    const baseProjectCost = baseCost[requirements.type] || 60000;
    const complexityMultiplier = 1 + (requirements.complexity - 0.5);
    const teamSizeMultiplier = 0.7 + (team.members.length * 0.15);
    const timelineMultiplier = Math.max(0.5, 2 - (requirements.estimatedDuration / 90));
    
    return Math.round(baseProjectCost * complexityMultiplier * teamSizeMultiplier * timelineMultiplier);
  }

  /**
   * ⏱️ Refine timeline estimate based on team capabilities
   */
  private refineTimelineEstimate(team: TeamComposition, requirements: ProjectRequirements): number {
    const baseTimeline = requirements.estimatedDuration;
    
    // Team experience factor
    const avgExperience = team.members.reduce((sum, member) => {
      const memberExp = Object.values(member.experience).reduce((s, e) => s + e, 0);
      return sum + memberExp;
    }, 0) / team.members.length;
    
    const experienceFactor = Math.max(0.7, Math.min(1.3, 1 - (avgExperience - 3) * 0.1));
    
    // Team size efficiency
    const optimalSize = this.getOptimalTeamSize(requirements.complexity);
    const sizeDifference = Math.abs(team.members.length - optimalSize);
    const sizeFactor = Math.max(0.8, 1 - (sizeDifference * 0.1));
    
    // Skill coverage factor
    const skillFactor = Math.max(0.9, team.metrics.skillCoverage);
    
    // Communication overhead
    const communicationOverhead = team.members.length > 4 ? 1 + ((team.members.length - 4) * 0.05) : 1;
    
    return Math.round(baseTimeline * experienceFactor * sizeFactor / skillFactor * communicationOverhead);
  }

  /**
   * 📈 Calculate success probability with confidence intervals
   */
  private calculateSuccessProbability(team: TeamComposition, requirements: ProjectRequirements) {
    const factors = {
      skillCoverage: team.metrics.skillCoverage,
      experienceLevel: team.metrics.experienceLevel,
      communicationScore: team.metrics.communicationScore,
      balanceScore: team.metrics.balanceScore,
      riskScore: 1 - team.metrics.riskScore,
      collaborationPotential: team.metrics.collaborationPotential
    };
    
    const weights = {
      skillCoverage: 0.25,
      experienceLevel: 0.20,
      communicationScore: 0.15,
      balanceScore: 0.15,
      riskScore: 0.15,
      collaborationPotential: 0.10
    };
    
    const weightedScore = Object.entries(factors).reduce((sum, [key, value]) => {
      return sum + (value * weights[key as keyof typeof weights]);
    }, 0);
    
    // Add complexity penalty
    const complexityPenalty = requirements.complexity * 0.1;
    const baseProbability = Math.max(0.1, weightedScore - complexityPenalty);
    
    const normalizedProbability = Math.min(0.95, Math.max(0.1, baseProbability));
    
    return {
      mean: normalizedProbability,
      confidence: 0.85,
      range: [Math.max(0.1, normalizedProbability - 0.1), Math.min(0.95, normalizedProbability + 0.1)]
    };
  }

  /**
   * 🔄 Generate alternative team compositions
   */
  private async generateAlternativeTeams(
    baseTeam: TeamComposition,
    requirements: ProjectRequirements,
    count: number
  ): Promise<TeamComposition[]> {
    const alternatives: TeamComposition[] = [];
    const allMembers = Array.from(this.database.members.values());
    const usedMemberIds = new Set(baseTeam.members.map(m => m.id));
    
    // Alternative 1: Different strategy focus
    if (alternatives.length < count) {
      const alternativeStrategy: OptimizationStrategy = 'experience-based';
      const altConfig: OptimizationConfig = {
        strategy: alternativeStrategy,
        constraints: requirements.constraints,
        preferences: {
          prioritizeExperience: true,
          allowSkillDevelopment: false,
          maximizeInnovation: false,
          minimizeRisk: true,
          preferStableTeams: true,
          encourageDiversity: false,
          focusOnCommunication: false
        },
        mlEnabled: true,
        historicalWeight: 0.5,
        realTimeAdjustments: false,
        uncertaintyTolerance: 0.1
      };
      
      try {
        const altResult = await this.mlEngine.optimizeTeam(allMembers, requirements, altConfig);
        alternatives.push(altResult.composition);
      } catch (error) {
        console.warn('Failed to generate experience-based alternative:', error);
      }
    }
    
    // Alternative 2: Larger team with junior members
    if (alternatives.length < count) {
      const availableMembers = allMembers.filter(m => !usedMemberIds.has(m.id));
      const seniorMembers = baseTeam.members.slice(0, 2); // Keep top 2 from original
      const juniorMembers = availableMembers
        .filter(m => this.calculateMemberExperience(m) < 3)
        .slice(0, 2);
      
      if (juniorMembers.length >= 1) {
        const mixedTeam = [...seniorMembers, ...juniorMembers];
        const altComposition = this.createAlternativeComposition(mixedTeam, requirements);
        alternatives.push(altComposition);
      }
    }
    
    return alternatives;
  }

  // Helper methods
  private calculateSkillOverlap(skills1: string[], skills2: string[]): number {
    const set1 = new Set(skills1);
    const set2 = new Set(skills2);
    const intersection = new Set([...set1].filter(x => set2.has(x)));
    const union = new Set([...set1, ...set2]);
    
    return union.size > 0 ? intersection.size / union.size : 0;
  }

  private calculateMemberExperience(member: TeamMember): number {
    return Object.values(member.experience).reduce((sum, exp) => sum + exp, 0);
  }

  private createAlternativeComposition(members: TeamMember[], requirements: ProjectRequirements): TeamComposition {
    return {
      members,
      roles: this.assignRolesToMembers(members, requirements),
      structure: {
        lead: members[0]?.id || '',
        specialists: members.filter(m => m.skills.length <= 4).map(m => m.id),
        generalists: members.filter(m => m.skills.length > 4).map(m => m.id),
        support: [],
        hierarchy: 'flat'
      },
      metrics: {
        skillCoverage: this.calculateSkillCoverage(members, requirements),
        experienceLevel: this.calculateAverageExperienceLevel(members),
        balanceScore: 0.75, // Simplified
        communicationScore: members.reduce((s, m) => s + m.performance.collaborationScore, 0) / members.length,
        riskScore: 0.3, // Simplified
        estimatedEfficiency: 0.8,
        collaborationPotential: 0.75,
        innovationIndex: 0.7
      },
      confidence: 0.75,
      alternatives: []
    };
  }

  private assignRolesToMembers(members: TeamMember[], requirements: ProjectRequirements): Record<string, string> {
    const roles: Record<string, string> = {};
    
    members.forEach((member, index) => {
      const primarySkill = member.skills.find(skill => 
        requirements.requiredSkills.includes(skill)
      ) || member.skills[0] || 'generalist';
      
      roles[member.id] = `${primarySkill}-specialist`;
    });
    
    return roles;
  }

  private calculateSkillCoverage(members: TeamMember[], requirements: ProjectRequirements): number {
    const teamSkills = new Set(members.flatMap(m => m.skills));
    const requiredSkills = new Set(requirements.requiredSkills);
    const covered = [...requiredSkills].filter(skill => teamSkills.has(skill));
    
    return covered.length / requiredSkills.size;
  }

  private calculateAverageExperienceLevel(members: TeamMember[]): number {
    return members.reduce((sum, member) => {
      const memberExp = Object.values(member.experience).reduce((s, e) => s + e, 0);
      return sum + memberExp;
    }, 0) / (members.length * 5); // Normalize assuming max 5 years per skill
  }

  // Project analysis helpers
  private estimateProjectDuration(analysis: any): number {
    const baseDuration = {
      'simple': 30,
      'medium': 60,
      'complex': 120,
      'enterprise': 180
    };
    
    const complexity = analysis.complexity || 0.5;
    
    if (complexity < 0.3) return baseDuration.simple;
    if (complexity < 0.6) return baseDuration.medium;
    if (complexity < 0.8) return baseDuration.complex;
    return baseDuration.enterprise;
  }

  private determineProjectPriority(analysis: any): 'low' | 'medium' | 'high' | 'critical' {
    const complexity = analysis.complexity || 0.5;
    
    if (complexity > 0.8) return 'critical';
    if (complexity > 0.6) return 'high';
    if (complexity > 0.3) return 'medium';
    return 'low';
  }

  private calculateMaxTeamSize(complexity: number): number {
    return Math.max(3, Math.min(8, Math.round(2 + complexity * 6)));
  }

  private calculateMinTeamSize(complexity: number): number {
    return Math.max(1, Math.round(1 + complexity * 2));
  }

  private calculateDeadline(analysis: any): Date | undefined {
    const duration = this.estimateProjectDuration(analysis);
    return new Date(Date.now() + duration * 24 * 60 * 60 * 1000);
  }

  private determineSecurityLevel(analysis: any): 'low' | 'medium' | 'high' | 'classified' {
    const hasAuth = analysis.technologies?.some((tech: string) => 
      ['auth', 'jwt', 'oauth', 'passport'].includes(tech.toLowerCase())
    );
    const hasPayment = analysis.technologies?.some((tech: string) =>
      ['stripe', 'paypal', 'payment'].includes(tech.toLowerCase())
    );
    
    if (hasPayment) return 'high';
    if (hasAuth) return 'medium';
    return 'low';
  }

  private getOptimalTeamSize(complexity: number): number {
    return Math.round(2 + complexity * 3);
  }

  private logOptimizationEvent(type: TeamOptimizationEvent['type'], data: any): void {
    const event: TeamOptimizationEvent = {
      type,
      timestamp: Date.now(),
      data,
      source: 'system'
    };
    
    this.database.history.push(event);
    
    // Keep only last 1000 events
    if (this.database.history.length > 1000) {
      this.database.history = this.database.history.slice(-1000);
    }
  }

  private updateAnalytics(result: OptimizationResult): void {
    this.database.analytics.totalOptimizations++;
    this.database.analytics.averageTeamSize = (
      (this.database.analytics.averageTeamSize * (this.database.analytics.totalOptimizations - 1)) + 
      result.composition.members.length
    ) / this.database.analytics.totalOptimizations;
    
    // Update skill demand tracking
    result.composition.members.forEach(member => {
      member.skills.forEach(skill => {
        this.database.analytics.mostRequestedSkills[skill] = 
          (this.database.analytics.mostRequestedSkills[skill] || 0) + 1;
      });
    });
  }

  private initializeAnalytics(): OptimizationAnalytics {
    return {
      totalOptimizations: 0,
      successRate: 0.85, // Initial estimate
      averageTeamSize: 3.2,
      mostRequestedSkills: {},
      performanceTrends: [],
      modelAccuracy: 0.78,
      improvementAreas: ['Communication optimization', 'Skill gap analysis']
    };
  }

  /**
   * 📊 Public API Methods
   */
  
  public async addTeamMember(member: TeamMember): Promise<void> {
    this.database.members.set(member.id, member);
    console.log(`➕ Added team member: ${member.name || member.id}`);
  }

  public async removeTeamMember(memberId: string): Promise<boolean> {
    const removed = this.database.members.delete(memberId);
    if (removed) {
      console.log(`➖ Removed team member: ${memberId}`);
    }
    return removed;
  }

  public getAvailableMembers(): TeamMember[] {
    return Array.from(this.database.members.values())
      .filter(member => member.availability > 0);
  }

  public getAnalytics(): OptimizationAnalytics {
    return { ...this.database.analytics };
  }

  public getOptimizationHistory(limit: number = 10): TeamOptimizationEvent[] {
    return this.database.history.slice(-limit);
  }

  /**
   * 🎯 CLI-friendly optimization method
   */
  public async optimizeForCLI(
    projectPath: string = process.cwd(),
    strategy: OptimizationStrategy = 'balanced'
  ): Promise<any> {
    const result = await this.optimizeTeamForProject(projectPath, strategy);
    
    return {
      success: true,
      team: {
        size: result.composition.members.length,
        members: result.composition.members.map(m => ({
          id: m.id,
          name: m.name || m.id,
          role: result.composition.roles[m.id],
          skills: m.skills,
          experience: Object.values(m.experience).reduce((s, e) => s + e, 0),
          availability: m.availability
        })),
        metrics: {
          skillCoverage: Math.round(result.composition.metrics.skillCoverage * 100),
          confidence: Math.round(result.confidence * 100),
          estimatedSuccess: Math.round(result.predictions.estimatedSuccess * 100)
        }
      },
      predictions: {
        timeToCompletion: Math.round(result.predictions.timeToCompletion),
        budgetRequirement: result.predictions.budgetRequirement,
        successProbability: Math.round(result.predictions.estimatedSuccess * 100)
      },
      recommendations: result.recommendations.map(r => ({
        type: r.type,
        priority: r.priority,
        description: r.description
      })),
      warnings: result.warnings.map(w => ({
        type: w.type,
        severity: w.severity,
        message: w.message
      }))
    };
  }
}