/**
 * 🧠 Adaptive AI Assistant
 * Learns from your coding patterns and provides intelligent, context-aware assistance
 */

import * as fs from 'fs';
import * as path from 'path';
import { SmartResponseCache } from './SmartResponseCache.js';

export interface LearningPattern {
  pattern: string;
  frequency: number;
  context: string[];
  successRate: number;
}

export interface AssistanceContext {
  currentFile?: string;
  projectType?: string;
  recentFiles?: string[];
  codeBase?: string[];
  userPreferences?: Record<string, any>;
}

export interface AssistanceResponse {
  type: 'suggestion' | 'fix' | 'explanation' | 'example';
  content: string;
  confidence: number;
  reasoning: string;
  codeSnippet?: string;
  resources?: string[];
}

export interface UserProfile {
  skillLevel: 'beginner' | 'intermediate' | 'expert';
  preferredLanguages: string[];
  workingPatterns: LearningPattern[];
  successfulSuggestions: string[];
  rejectedSuggestions: string[];
  learningGoals: string[];
}

export class AdaptiveAIAssistant {
  private projectPath: string;
  private learningPath: string;
  private patterns: LearningPattern[];
  private contextWindow: any[];
  private skillLevel: 'beginner' | 'intermediate' | 'expert';
  private cache: SmartResponseCache;
  private userProfile: UserProfile;

  constructor(projectPath: string = process.cwd()) {
    this.projectPath = projectPath;
    this.learningPath = path.join(projectPath, '.claude-coordination', 'ai-learning.json');
    this.patterns = this.loadLearningData();
    this.contextWindow = [];
    this.skillLevel = 'intermediate';
    this.cache = new SmartResponseCache(projectPath);
    this.userProfile = this.loadUserProfile();
  }

  /**
   * 🎯 Main AI assistant interface
   */
  async assist(query: string, context: AssistanceContext = {}): Promise<AssistanceResponse> {
    console.log('🧠 AI Assistant analyzing your request...');
    
    // Try to get cached response first
    const cachedResponse = await this.cache.get(query, context);
    if (cachedResponse) {
      console.log('⚡ Using cached response for faster performance');
      return cachedResponse;
    }
    
    // Update context window
    this.updateContextWindow(query, context);
    
    // Determine assistance type
    const assistanceType = this.classifyQuery(query);
    
    // Generate personalized response
    const response = await this.generateResponse(query, context, assistanceType);
    
    // Cache the response
    await this.cache.set(query, response, context);
    
    // Learn from this interaction
    this.learnFromInteraction(query, response, context);
    
    return response;
  }

  /**
   * 🔍 Classify the type of assistance needed
   */
  private classifyQuery(query: string): string {
    const lowercaseQuery = query.toLowerCase();
    
    const patterns = {
      'debug': ['error', 'bug', 'not working', 'broken', 'fix'],
      'explain': ['what is', 'how does', 'explain', 'understand'],
      'implement': ['create', 'build', 'implement', 'add', 'make'],
      'optimize': ['optimize', 'improve', 'better', 'performance', 'faster'],
      'refactor': ['refactor', 'clean', 'restructure', 'organize'],
      'test': ['test', 'testing', 'spec', 'mock']
    };

    for (const [type, keywords] of Object.entries(patterns)) {
      for (const keyword of keywords) {
        if (lowercaseQuery.includes(keyword)) {
          return type;
        }
      }
    }

    return 'general';
  }

  /**
   * 💡 Generate personalized response
   */
  private async generateResponse(
    query: string, 
    context: AssistanceContext, 
    assistanceType: string
  ): Promise<AssistanceResponse> {
    
    // Adapt response based on skill level
    const complexity = this.getComplexityLevel();
    
    // Check patterns for similar queries
    const similarPattern = this.findSimilarPattern(query);
    
    // Generate base response
    let response: AssistanceResponse;
    
    switch (assistanceType) {
      case 'debug':
        response = await this.generateDebugResponse(query, context, complexity);
        break;
      case 'explain':
        response = await this.generateExplanationResponse(query, context, complexity);
        break;
      case 'implement':
        response = await this.generateImplementationResponse(query, context, complexity);
        break;
      case 'optimize':
        response = await this.generateOptimizationResponse(query, context, complexity);
        break;
      default:
        response = await this.generateGeneralResponse(query, context, complexity);
    }

    // Enhance response with learning data
    if (similarPattern) {
      response.confidence *= similarPattern.successRate;
      response.reasoning += ` (Based on similar pattern: ${similarPattern.pattern})`;
    }

    return response;
  }

  /**
   * 🐛 Generate debug assistance
   */
  private async generateDebugResponse(
    query: string, 
    context: AssistanceContext, 
    complexity: number
  ): Promise<AssistanceResponse> {
    
    const debugSteps = this.getDebugSteps(complexity);
    const commonIssues = this.getCommonIssues(context.projectType);
    
    return {
      type: 'fix',
      content: this.formatDebugSuggestion(query, debugSteps, commonIssues),
      confidence: 0.8,
      reasoning: 'Generated debug strategy based on common patterns and project context',
      codeSnippet: this.generateDebugCode(query, context),
      resources: this.getDebugResources(context.projectType)
    };
  }

  /**
   * 📚 Generate explanation response
   */
  private async generateExplanationResponse(
    query: string, 
    context: AssistanceContext, 
    complexity: number
  ): Promise<AssistanceResponse> {
    
    const explanationDepth = complexity > 0.7 ? 'detailed' : complexity > 0.4 ? 'moderate' : 'simple';
    
    return {
      type: 'explanation',
      content: this.formatExplanation(query, explanationDepth),
      confidence: 0.85,
      reasoning: `Explanation tailored for ${this.skillLevel} level`,
      codeSnippet: this.generateExampleCode(query, context),
      resources: this.getEducationalResources(query)
    };
  }

  /**
   * 🔨 Generate implementation assistance
   */
  private async generateImplementationResponse(
    query: string, 
    context: AssistanceContext, 
    complexity: number
  ): Promise<AssistanceResponse> {
    
    const implementationApproach = this.chooseImplementationApproach(query, context, complexity);
    
    return {
      type: 'suggestion',
      content: this.formatImplementationPlan(query, implementationApproach),
      confidence: 0.75,
      reasoning: 'Implementation plan based on best practices and project context',
      codeSnippet: this.generateImplementationCode(query, context),
      resources: this.getImplementationResources(context.projectType)
    };
  }

  /**
   * ⚡ Generate optimization response
   */
  private async generateOptimizationResponse(
    query: string, 
    context: AssistanceContext, 
    complexity: number
  ): Promise<AssistanceResponse> {
    
    const optimizationStrategies = this.getOptimizationStrategies(context.projectType);
    
    return {
      type: 'suggestion',
      content: this.formatOptimizationSuggestions(query, optimizationStrategies),
      confidence: 0.8,
      reasoning: 'Optimization suggestions based on performance patterns',
      codeSnippet: this.generateOptimizedCode(query, context),
      resources: this.getPerformanceResources()
    };
  }

  /**
   * 💬 Generate general response
   */
  private async generateGeneralResponse(
    query: string, 
    context: AssistanceContext, 
    complexity: number
  ): Promise<AssistanceResponse> {
    
    return {
      type: 'suggestion',
      content: `Based on your query "${query}", here's what I suggest...`,
      confidence: 0.6,
      reasoning: 'General assistance based on query analysis',
      resources: this.getGeneralResources()
    };
  }

  /**
   * 🧠 Learn from interaction
   */
  private learnFromInteraction(query: string, response: AssistanceResponse, context: AssistanceContext): void {
    // Update patterns
    const pattern = this.extractPattern(query, context);
    const existingPattern = this.patterns.find(p => p.pattern === pattern);
    
    if (existingPattern) {
      existingPattern.frequency++;
    } else {
      this.patterns.push({
        pattern,
        frequency: 1,
        context: Object.keys(context),
        successRate: 0.5 // Will be updated based on feedback
      });
    }
    
    // Update context window
    this.contextWindow.push({
      query,
      response: response.type,
      timestamp: Date.now(),
      confidence: response.confidence
    });
    
    // Limit context window size
    if (this.contextWindow.length > 50) {
      this.contextWindow = this.contextWindow.slice(-50);
    }
    
    this.saveLearningData();
  }

  /**
   * 🔄 Update context window
   */
  private updateContextWindow(query: string, context: AssistanceContext): void {
    this.contextWindow.push({
      query,
      context: context,
      timestamp: Date.now()
    });
    
    // Keep only recent context
    const tenMinutesAgo = Date.now() - 10 * 60 * 1000;
    this.contextWindow = this.contextWindow.filter(item => item.timestamp > tenMinutesAgo);
  }

  /**
   * 🎯 Get complexity level for current user
   */
  private getComplexityLevel(): number {
    const levelMap = {
      'beginner': 0.3,
      'intermediate': 0.6,
      'expert': 0.9
    };
    
    return levelMap[this.skillLevel] || 0.6;
  }

  /**
   * 🔍 Find similar patterns
   */
  private findSimilarPattern(query: string): LearningPattern | null {
    const queryWords = query.toLowerCase().split(' ');
    let bestMatch: LearningPattern | null = null;
    let bestScore = 0;
    
    for (const pattern of this.patterns) {
      const patternWords = pattern.pattern.toLowerCase().split(' ');
      const commonWords = queryWords.filter(word => patternWords.includes(word));
      const score = commonWords.length / Math.max(queryWords.length, patternWords.length);
      
      if (score > bestScore && score > 0.3) {
        bestScore = score;
        bestMatch = pattern;
      }
    }
    
    return bestMatch;
  }

  /**
   * 🧩 Extract pattern from query
   */
  private extractPattern(query: string, context: AssistanceContext): string {
    // Simplify query to extract core pattern
    const words = query.toLowerCase().split(' ');
    const meaningfulWords = words.filter(word => 
      word.length > 3 && 
      !['the', 'and', 'for', 'with', 'this', 'that', 'from'].includes(word)
    );
    
    return meaningfulWords.slice(0, 5).join(' ');
  }

  // Helper methods for generating specific response types
  private getDebugSteps(complexity: number): string[] {
    const basicSteps = [
      'Check console for errors',
      'Verify variable values',
      'Test with simple inputs'
    ];
    
    const advancedSteps = [
      'Use debugger breakpoints',
      'Check network requests',
      'Validate data flow',
      'Review error boundaries',
      'Check memory usage'
    ];
    
    return complexity > 0.6 ? [...basicSteps, ...advancedSteps] : basicSteps;
  }

  private getCommonIssues(projectType?: string): string[] {
    const issueMap: Record<string, string[]> = {
      'web_fullstack': ['CORS issues', 'State management', 'API integration'],
      'mobile_app': ['Platform differences', 'Permission handling', 'Navigation'],
      'api_microservices': ['Authentication', 'Rate limiting', 'Data consistency']
    };
    
    return issueMap[projectType || 'general'] || ['Syntax errors', 'Logic issues', 'Dependencies'];
  }

  private formatDebugSuggestion(query: string, steps: string[], commonIssues: string[]): string {
    return `To debug "${query}", try these steps:\n\n${steps.map((step, i) => `${i + 1}. ${step}`).join('\n')}\n\nCommon issues to check: ${commonIssues.join(', ')}`;
  }

  private formatExplanation(query: string, depth: string): string {
    const explanations = {
      'simple': `Here's a simple explanation of "${query}":`,
      'moderate': `Let me explain "${query}" in detail:`,
      'detailed': `Here's a comprehensive explanation of "${query}":`
    };
    
    return explanations[depth as keyof typeof explanations] || explanations.moderate;
  }

  private formatImplementationPlan(query: string, approach: string): string {
    return `To implement "${query}", I recommend this approach:\n\n${approach}`;
  }

  private chooseImplementationApproach(query: string, context: AssistanceContext, complexity: number): string {
    // Simplified implementation approach selection
    return complexity > 0.7 ? 
      'Use a modular, test-driven approach with proper error handling' :
      'Start with a simple implementation and iterate';
  }

  private getOptimizationStrategies(projectType?: string): string[] {
    const strategies: Record<string, string[]> = {
      'web_fullstack': ['Code splitting', 'Lazy loading', 'Caching', 'Bundle optimization'],
      'mobile_app': ['Image optimization', 'Memory management', 'Battery efficiency'],
      'api_microservices': ['Query optimization', 'Caching', 'Connection pooling']
    };
    
    return strategies[projectType || 'general'] || ['Code optimization', 'Performance monitoring'];
  }

  private formatOptimizationSuggestions(query: string, strategies: string[]): string {
    return `For optimizing "${query}", consider these strategies:\n\n${strategies.map((strategy, i) => `${i + 1}. ${strategy}`).join('\n')}`;
  }

  // Code generation helpers
  private generateDebugCode(query: string, context: AssistanceContext): string {
    return `// Debug code for: ${query}\nconsole.log('Debug point reached');\n// Add your debugging logic here`;
  }

  private generateExampleCode(query: string, context: AssistanceContext): string {
    return `// Example for: ${query}\n// This is a simple example to illustrate the concept`;
  }

  private generateImplementationCode(query: string, context: AssistanceContext): string {
    return `// Implementation for: ${query}\n// TODO: Implement the functionality\nfunction implement() {\n  // Your code here\n}`;
  }

  private generateOptimizedCode(query: string, context: AssistanceContext): string {
    return `// Optimized approach for: ${query}\n// This version focuses on performance`;
  }

  // Resource helpers
  private getDebugResources(projectType?: string): string[] {
    return [
      'Developer Tools Documentation',
      'Debugging Best Practices',
      'Error Handling Patterns'
    ];
  }

  private getEducationalResources(query: string): string[] {
    return [
      'Official Documentation',
      'Tutorial Articles',
      'Video Explanations'
    ];
  }

  private getImplementationResources(projectType?: string): string[] {
    return [
      'Best Practices Guide',
      'Code Examples',
      'Architecture Patterns'
    ];
  }

  private getPerformanceResources(): string[] {
    return [
      'Performance Optimization Guide',
      'Profiling Tools',
      'Benchmark Strategies'
    ];
  }

  private getGeneralResources(): string[] {
    return [
      'General Documentation',
      'Community Forums',
      'Stack Overflow'
    ];
  }

  /**
   * 💾 Load learning data
   */
  private loadLearningData(): LearningPattern[] {
    try {
      if (fs.existsSync(this.learningPath)) {
        const data = fs.readFileSync(this.learningPath, 'utf8');
        return JSON.parse(data);
      }
    } catch (error) {
      console.warn('Could not load learning data:', error);
    }
    
    return [];
  }

  /**
   * 💾 Save learning data
   */
  private saveLearningData(): void {
    try {
      const dir = path.dirname(this.learningPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      
      fs.writeFileSync(this.learningPath, JSON.stringify(this.patterns, null, 2));
    } catch (error) {
      console.warn('Could not save learning data:', error);
    }
  }

  /**
   * 👤 Load user profile
   */
  private loadUserProfile(): UserProfile {
    try {
      const profilePath = path.join(path.dirname(this.learningPath), 'user-profile.json');
      if (fs.existsSync(profilePath)) {
        const data = fs.readFileSync(profilePath, 'utf8');
        return JSON.parse(data);
      }
    } catch (error) {
      console.warn('Could not load user profile:', error);
    }
    
    return {
      skillLevel: 'intermediate',
      preferredLanguages: ['javascript', 'typescript'],
      workingPatterns: [],
      successfulSuggestions: [],
      rejectedSuggestions: [],
      learningGoals: []
    };
  }

  /**
   * 📈 Update user profile based on feedback
   */
  async updateProfile(feedback: 'positive' | 'negative', suggestion: string): Promise<void> {
    if (feedback === 'positive') {
      this.userProfile.successfulSuggestions.push(suggestion);
    } else {
      this.userProfile.rejectedSuggestions.push(suggestion);
    }
    
    // Adjust skill level based on feedback patterns
    const successRate = this.userProfile.successfulSuggestions.length / 
      (this.userProfile.successfulSuggestions.length + this.userProfile.rejectedSuggestions.length);
    
    if (successRate > 0.8 && this.skillLevel !== 'expert') {
      this.skillLevel = this.skillLevel === 'beginner' ? 'intermediate' : 'expert';
    }
    
    await this.saveUserProfile();
  }

  /**
   * 💾 Save user profile
   */
  private async saveUserProfile(): Promise<void> {
    try {
      const profilePath = path.join(path.dirname(this.learningPath), 'user-profile.json');
      fs.writeFileSync(profilePath, JSON.stringify(this.userProfile, null, 2));
    } catch (error) {
      console.warn('Could not save user profile:', error);
    }
  }
}