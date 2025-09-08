/**
 * 🔥 Cache Warming System - Intelligent Pre-loading of AI Responses
 * Smart cache warming with project-specific and context-aware query generation
 * TypeScript implementation for KRINS-Universe-Builder
 */

import { 
  CacheContext, 
  WarmupResult
} from './cache-types.js';
import { SmartResponseCache } from './smart-response-cache.js';
import { UniversalProjectDetector, ProjectAnalysis } from './universal-project-detector.js';

export interface WarmupConfig {
  maxQueries: number;
  maxContexts: number;
  projectSpecific: boolean;
  includeCommonPatterns: boolean;
  includeFrameworkSpecific: boolean;
  priorityLevels: ('basic' | 'intermediate' | 'advanced' | 'expert')[];
  simulateResponses: boolean; // For testing without actual API calls
}

export interface QueryTemplate {
  template: string;
  contexts: string[];
  priority: 'high' | 'medium' | 'low';
  category: 'debugging' | 'optimization' | 'best-practices' | 'security' | 'testing' | 'deployment';
  frameworks?: string[];
  languages?: string[];
}

export class CacheWarming {
  private cache: SmartResponseCache;
  private projectPath: string;
  private config: WarmupConfig;
  private projectAnalysis?: ProjectAnalysis;

  constructor(
    cache: SmartResponseCache, 
    projectPath: string, 
    config: Partial<WarmupConfig> = {}
  ) {
    this.cache = cache;
    this.projectPath = projectPath;
    
    this.config = {
      maxQueries: 100,
      maxContexts: 5,
      projectSpecific: true,
      includeCommonPatterns: true,
      includeFrameworkSpecific: true,
      priorityLevels: ['basic', 'intermediate', 'advanced'],
      simulateResponses: false,
      ...config
    };
  }

  /**
   * 🔥 Main cache warming method
   */
  public async warmCache(customQueries: string[] = []): Promise<WarmupResult> {
    const startTime = performance.now();
    const errors: string[] = [];
    let queriesProcessed = 0;
    let cacheKeysGenerated = 0;

    console.log('🔥 Starting intelligent cache warming...');

    try {
      // Analyze project if project-specific warming is enabled
      if (this.config.projectSpecific) {
        await this.analyzeProject();
      }

      // Generate query contexts
      const contexts = this.generateContexts();
      console.log(`📊 Generated ${contexts.length} contexts for warming`);

      // Generate queries
      const queries = await this.generateQueries(customQueries);
      console.log(`📝 Generated ${queries.length} queries for warming`);

      // Warm cache with query-context combinations
      for (const query of queries.slice(0, this.config.maxQueries)) {
        try {
          queriesProcessed++;
          
          for (const context of contexts.slice(0, this.config.maxContexts)) {
            const cacheKey = this.cache.generateCacheKey(query, context);
            cacheKeysGenerated++;

            // Check if already cached
            const existing = await this.cache.get(query, context, { skipSimilarity: true });
            
            if (!existing) {
              // Generate simulated response for warming (if enabled)
              if (this.config.simulateResponses) {
                const simulatedResponse = this.generateSimulatedResponse(query, context);
                await this.cache.set(query, context, simulatedResponse, { ttl: 60000 }); // Short TTL for simulated
              } else {
                // Just pre-compute cache keys for faster lookup
                console.log(`🔑 Pre-computed cache key: ${cacheKey.substring(0, 16)}...`);
              }
            }
          }
          
          // Progress indicator
          if (queriesProcessed % 10 === 0) {
            console.log(`🔥 Progress: ${queriesProcessed}/${Math.min(queries.length, this.config.maxQueries)} queries processed`);
          }
          
        } catch (error) {
          errors.push(`Error warming query "${query}": ${error}`);
        }
      }

    } catch (error) {
      errors.push(`Cache warming error: ${error}`);
    }

    const duration = performance.now() - startTime;
    const result: WarmupResult = {
      queriesProcessed,
      cacheKeysGenerated,
      duration,
      errors
    };

    console.log(`🔥 Cache warming complete: ${queriesProcessed} queries, ${cacheKeysGenerated} keys in ${Math.round(duration)}ms`);
    
    if (errors.length > 0) {
      console.log(`⚠️ ${errors.length} errors occurred during warming`);
    }

    return result;
  }

  /**
   * 🔍 Analyze current project for context
   */
  private async analyzeProject(): Promise<void> {
    try {
      const detector = new UniversalProjectDetector(this.projectPath);
      this.projectAnalysis = await detector.analyze();
      console.log(`📊 Project analysis complete: ${this.projectAnalysis.type} project with ${this.projectAnalysis.frameworks.join(', ')} frameworks`);
    } catch (error) {
      console.warn('⚠️ Could not analyze project for warming:', error);
    }
  }

  /**
   * 📊 Generate contexts for cache warming
   */
  private generateContexts(): CacheContext[] {
    const contexts: CacheContext[] = [];

    // Base contexts
    const baseContexts: CacheContext[] = [
      { taskType: 'general', skillLevel: 'intermediate' },
      { taskType: 'debugging', skillLevel: 'intermediate' },
      { taskType: 'optimization', skillLevel: 'advanced' },
      { taskType: 'review', skillLevel: 'intermediate' },
      { taskType: 'testing', skillLevel: 'intermediate' }
    ];

    // Add project-specific contexts if analysis is available
    if (this.projectAnalysis) {
      const projectContexts: CacheContext[] = [
        {
          projectType: this.projectAnalysis.type,
          language: this.projectAnalysis.languages[0]?.toLowerCase() || 'javascript',
          taskType: 'general',
          skillLevel: 'intermediate'
        }
      ];

      // Add framework-specific contexts
      for (const framework of this.projectAnalysis.frameworks) {
        projectContexts.push({
          projectType: this.projectAnalysis.type,
          language: this.projectAnalysis.languages[0]?.toLowerCase() || 'javascript',
          framework: framework.toLowerCase(),
          taskType: 'optimization',
          skillLevel: 'intermediate'
        });
      }

      contexts.push(...projectContexts);
    }

    // Add common web development contexts
    const webContexts: CacheContext[] = [
      { projectType: 'web', language: 'javascript', framework: 'react', taskType: 'optimization' },
      { projectType: 'web', language: 'typescript', framework: 'react', taskType: 'debugging' },
      { projectType: 'api', language: 'node', framework: 'express', taskType: 'performance' },
      { projectType: 'web', language: 'javascript', framework: 'vue', taskType: 'best-practices' },
      { projectType: 'mobile', language: 'react-native', taskType: 'optimization' }
    ];

    contexts.push(...baseContexts, ...webContexts);

    // Remove duplicates and limit
    const uniqueContexts = contexts.filter((context, index, self) => 
      index === self.findIndex(c => JSON.stringify(c) === JSON.stringify(context))
    );

    return uniqueContexts.slice(0, this.config.maxContexts * 2);
  }

  /**
   * 📝 Generate intelligent queries for warming
   */
  private async generateQueries(customQueries: string[] = []): Promise<string[]> {
    const queries: string[] = [...customQueries];

    // Common development queries
    if (this.config.includeCommonPatterns) {
      queries.push(...this.getCommonQueries());
    }

    // Framework-specific queries
    if (this.config.includeFrameworkSpecific && this.projectAnalysis) {
      queries.push(...this.getFrameworkSpecificQueries(this.projectAnalysis));
    }

    // Project-specific queries
    if (this.config.projectSpecific && this.projectAnalysis) {
      queries.push(...this.getProjectSpecificQueries(this.projectAnalysis));
    }

    // Query templates based on project analysis
    queries.push(...this.generateFromTemplates());

    // Remove duplicates and return
    return [...new Set(queries)].slice(0, this.config.maxQueries);
  }

  /**
   * 📚 Get common development queries
   */
  private getCommonQueries(): string[] {
    return [
      // Performance
      'How do I optimize performance?',
      'Best practices for improving load times?',
      'How to reduce bundle size?',
      'Memory optimization techniques?',
      
      // Debugging
      'How to debug this error?',
      'Common debugging strategies?',
      'How to trace performance issues?',
      'Best debugging tools and techniques?',
      
      // Best Practices
      'Code review best practices?',
      'Security best practices?',
      'How to improve code quality?',
      'Clean code principles?',
      
      // Testing
      'How to write better tests?',
      'Testing strategies and patterns?',
      'Integration testing best practices?',
      'How to test this component?',
      
      // Architecture
      'How to improve code architecture?',
      'Design patterns for this use case?',
      'How to structure this project?',
      'Scalability best practices?',
      
      // DevOps
      'How to set up CI/CD?',
      'Deployment best practices?',
      'How to configure monitoring?',
      'Docker best practices?'
    ];
  }

  /**
   * 🏗️ Get framework-specific queries
   */
  private getFrameworkSpecificQueries(analysis: ProjectAnalysis): string[] {
    const queries: string[] = [];
    
    for (const framework of analysis.frameworks) {
      switch (framework.toLowerCase()) {
        case 'react':
          queries.push(
            'React performance optimization tips?',
            'How to optimize React re-renders?',
            'React hooks best practices?',
            'How to handle React state management?',
            'React testing strategies?'
          );
          break;
          
        case 'vue':
          queries.push(
            'Vue.js performance optimization?',
            'Vue composition API best practices?',
            'How to optimize Vue reactivity?',
            'Vue testing with Jest?'
          );
          break;
          
        case 'angular':
          queries.push(
            'Angular performance optimization?',
            'Change detection optimization in Angular?',
            'Angular testing best practices?',
            'How to optimize Angular bundle size?'
          );
          break;
          
        case 'express':
          queries.push(
            'Express.js performance optimization?',
            'Express middleware best practices?',
            'How to handle Express errors?',
            'Express security best practices?'
          );
          break;
          
        case 'next.js':
          queries.push(
            'Next.js performance optimization?',
            'How to optimize Next.js build?',
            'Next.js SEO best practices?',
            'Server-side rendering optimization?'
          );
          break;
      }
    }
    
    return queries;
  }

  /**
   * 🎯 Get project-specific queries
   */
  private getProjectSpecificQueries(analysis: ProjectAnalysis): string[] {
    const queries: string[] = [];
    
    // Based on project type
    switch (analysis.type) {
      case 'react-app':
        queries.push(
          'How to optimize this React application?',
          'React component optimization strategies?',
          'How to improve React app performance?'
        );
        break;
        
      case 'node-api':
        queries.push(
          'Node.js API optimization techniques?',
          'How to scale this Node.js API?',
          'API security best practices?'
        );
        break;
        
      case 'typescript-lib':
        queries.push(
          'TypeScript library best practices?',
          'How to optimize TypeScript compilation?',
          'Library distribution strategies?'
        );
        break;
    }
    
    // Based on missing features (from recommendations)
    if (!analysis.hasTests) {
      queries.push(
        'How to add tests to this project?',
        'Testing strategy for this codebase?',
        'Unit testing best practices?'
      );
    }
    
    if (!analysis.hasDocumentation) {
      queries.push(
        'How to document this project?',
        'API documentation best practices?',
        'README writing guidelines?'
      );
    }
    
    return queries;
  }

  /**
   * 📋 Generate queries from templates
   */
  private generateFromTemplates(): string[] {
    const templates: QueryTemplate[] = [
      {
        template: 'How to optimize {framework} performance?',
        contexts: ['react', 'vue', 'angular', 'express'],
        priority: 'high',
        category: 'optimization'
      },
      {
        template: 'Best practices for {framework} development?',
        contexts: ['react', 'vue', 'angular', 'node'],
        priority: 'high',
        category: 'best-practices'
      },
      {
        template: 'How to debug {language} applications?',
        contexts: ['javascript', 'typescript', 'python', 'go'],
        priority: 'medium',
        category: 'debugging'
      },
      {
        template: 'Security considerations for {framework}?',
        contexts: ['react', 'express', 'vue', 'angular'],
        priority: 'high',
        category: 'security'
      },
      {
        template: 'Testing strategies for {framework}?',
        contexts: ['react', 'vue', 'node', 'express'],
        priority: 'medium',
        category: 'testing'
      }
    ];

    const queries: string[] = [];
    
    for (const template of templates) {
      for (const context of template.contexts) {
        const query = template.template.replace('{framework}', context).replace('{language}', context);
        queries.push(query);
      }
    }
    
    return queries;
  }

  /**
   * 🎭 Generate simulated response for testing
   */
  private generateSimulatedResponse(query: string, context: CacheContext): any {
    const category = this.categorizeQuery(query);
    
    const responses = {
      performance: {
        suggestions: ['Optimize bundle size', 'Enable code splitting', 'Use lazy loading'],
        code_examples: ['// Example optimization code'],
        best_practices: ['Measure first', 'Profile before optimizing', 'Focus on user experience']
      },
      debugging: {
        steps: ['Identify the error', 'Check browser console', 'Use debugging tools'],
        tools: ['Chrome DevTools', 'VS Code Debugger', 'Network tab'],
        common_issues: ['Async/await problems', 'State management issues', 'Network errors']
      },
      best_practices: {
        principles: ['Keep it simple', 'Follow conventions', 'Write tests'],
        patterns: ['Component composition', 'State management', 'Error handling'],
        resources: ['Official documentation', 'Community guidelines', 'Code examples']
      }
    };

    return responses[category as keyof typeof responses] || responses.best_practices;
  }

  /**
   * 🏷️ Categorize query for simulated responses
   */
  private categorizeQuery(query: string): string {
    const lowerQuery = query.toLowerCase();
    
    if (lowerQuery.includes('performance') || lowerQuery.includes('optimize')) {
      return 'performance';
    }
    
    if (lowerQuery.includes('debug') || lowerQuery.includes('error') || lowerQuery.includes('fix')) {
      return 'debugging';
    }
    
    return 'best_practices';
  }

  /**
   * ⚙️ Update warming configuration
   */
  public updateConfig(config: Partial<WarmupConfig>): void {
    this.config = { ...this.config, ...config };
    console.log('⚙️ Cache warming configuration updated');
  }

  /**
   * 📊 Get warming statistics
   */
  public getWarmingStats(): any {
    return {
      config: this.config,
      projectAnalysis: this.projectAnalysis ? {
        type: this.projectAnalysis.type,
        frameworks: this.projectAnalysis.frameworks,
        languages: this.projectAnalysis.languages,
        complexity: this.projectAnalysis.complexity
      } : null
    };
  }
}

// CacheWarming already exported above