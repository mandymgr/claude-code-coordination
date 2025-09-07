// Context-Aware AI Service
import { ADRContextReader, ADRContext } from './adr-context-reader';

export interface CodeGenerationRequest {
  task: string;
  component?: string;
  language?: string;
  framework?: string;
}

export interface ContextAwareResponse {
  code: string;
  explanation: string;
  appliedADRs: ADRContext[];
  recommendations: string[];
}

export class ContextAwareAI {
  private adrReader: ADRContextReader;

  constructor(adrPath?: string) {
    this.adrReader = new ADRContextReader(adrPath);
  }

  /**
   * Generate code with ADR context awareness
   */
  async generateCode(request: CodeGenerationRequest): Promise<ContextAwareResponse> {
    // 1. Extract relevant ADRs
    const relevantADRs = await this.findRelevantADRs(request);
    
    // 2. Build context-aware prompt
    const contextPrompt = this.buildContextPrompt(request, relevantADRs);
    
    // 3. Generate code with AI (mock for now)
    const aiResponse = await this.callAI(contextPrompt);
    
    return {
      code: aiResponse.code,
      explanation: aiResponse.explanation,
      appliedADRs: relevantADRs,
      recommendations: this.generateRecommendations(relevantADRs, request)
    };
  }

  private async findRelevantADRs(request: CodeGenerationRequest): Promise<ADRContext[]> {
    const keywords = this.extractKeywords(request.task);
    const component = request.component || this.inferComponent(request.task);
    
    return await this.adrReader.getRelevantADRs(component, keywords);
  }

  private extractKeywords(task: string): string[] {
    const techKeywords = [
      'database', 'search', 'authentication', 'api', 'frontend', 'backend',
      'deployment', 'monitoring', 'testing', 'security', 'performance',
      'postgres', 'redis', 'elasticsearch', 'react', 'express'
    ];

    return techKeywords.filter(keyword => 
      task.toLowerCase().includes(keyword)
    );
  }

  private inferComponent(task: string): string {
    // Simple component inference based on task description
    if (task.includes('search') || task.includes('søk')) return 'platform/search';
    if (task.includes('auth') || task.includes('login')) return 'platform/auth';
    if (task.includes('api') || task.includes('backend')) return 'backend';
    if (task.includes('frontend') || task.includes('ui')) return 'frontend';
    if (task.includes('deploy') || task.includes('infra')) return 'platform/infra';
    
    return 'unknown';
  }

  private buildContextPrompt(request: CodeGenerationRequest, adrs: ADRContext[]): string {
    let prompt = `Task: ${request.task}\n\n`;

    if (adrs.length > 0) {
      prompt += "IMPORTANT - Follow these architectural decisions:\n\n";
      
      adrs.forEach(adr => {
        prompt += `ADR-${adr.number}: ${adr.title}\n`;
        prompt += `Component: ${adr.component}\n`;
        prompt += `Decision: ${adr.decision}\n`;
        if (adr.evidence) {
          prompt += `Evidence: ${adr.evidence}\n`;
        }
        prompt += `\n`;
      });

      prompt += `Please implement the task following these architectural decisions. `;
      prompt += `Explain how your implementation aligns with the ADRs.\n\n`;
    }

    if (request.language) {
      prompt += `Language: ${request.language}\n`;
    }
    
    if (request.framework) {
      prompt += `Framework: ${request.framework}\n`;
    }

    return prompt;
  }

  private async callAI(prompt: string): Promise<{ code: string; explanation: string }> {
    // Mock implementation - replace with actual AI service call
    console.log('AI Prompt with ADR Context:');
    console.log(prompt);
    
    return {
      code: `// Generated code based on ADRs\n// Implementation follows architectural decisions`,
      explanation: 'Code generated following established architectural patterns from ADRs'
    };
  }

  private generateRecommendations(adrs: ADRContext[], request: CodeGenerationRequest): string[] {
    const recommendations: string[] = [];

    adrs.forEach(adr => {
      recommendations.push(`Consider ADR-${adr.number}: ${adr.title}`);
      
      if (adr.evidence) {
        recommendations.push(`Monitor metrics mentioned in ADR-${adr.number}: ${adr.evidence}`);
      }
      
      if (adr.links.length > 0) {
        recommendations.push(`Review related resources from ADR-${adr.number}`);
      }
    });

    return recommendations;
  }

  /**
   * Suggest creating new ADR if no relevant ones exist
   */
  async suggestNewADR(request: CodeGenerationRequest): Promise<string | null> {
    const relevantADRs = await this.findRelevantADRs(request);
    
    if (relevantADRs.length === 0 && this.isSignificantDecision(request)) {
      const component = request.component || this.inferComponent(request.task);
      return `Consider creating an ADR for this architectural decision: "${request.task}" in component "${component}"`;
    }
    
    return null;
  }

  private isSignificantDecision(request: CodeGenerationRequest): boolean {
    const significantKeywords = [
      'architecture', 'database', 'authentication', 'deployment', 
      'monitoring', 'security', 'performance', 'integration'
    ];
    
    return significantKeywords.some(keyword => 
      request.task.toLowerCase().includes(keyword)
    );
  }
}

export default ContextAwareAI;