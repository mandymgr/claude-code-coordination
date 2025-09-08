// ADR Context Reader for Claude-Code-Coordination
import fs from 'fs';
import path from 'path';

export interface ADRContext {
  number: string;
  title: string;
  component: string;
  decision: string;
  alternatives: string[];
  reasoning: string;
  evidence: string;
  links: string[];
}

export class ADRContextReader {
  private adrPath: string;

  constructor(adrPath: string = 'docs/adr') {
    this.adrPath = adrPath;
  }

  /**
   * Read all ADRs and provide context for AI decisions
   */
  async getADRContext(): Promise<ADRContext[]> {
    try {
      const adrFiles = await this.findADRFiles();
      const contexts = await Promise.all(
        adrFiles.map(file => this.parseADR(file))
      );
      return contexts.filter(Boolean) as ADRContext[];
    } catch (error) {
      console.warn('Could not read ADR context:', error);
      return [];
    }
  }

  /**
   * Get relevant ADRs for a specific component or topic
   */
  async getRelevantADRs(component: string, keywords: string[] = []): Promise<ADRContext[]> {
    const allADRs = await this.getADRContext();
    
    return allADRs.filter(adr => {
      const componentMatch = adr.component.toLowerCase().includes(component.toLowerCase());
      const keywordMatch = keywords.some(keyword => 
        adr.title.toLowerCase().includes(keyword.toLowerCase()) ||
        adr.decision.toLowerCase().includes(keyword.toLowerCase())
      );
      return componentMatch || keywordMatch;
    });
  }

  private async findADRFiles(): Promise<string[]> {
    if (!fs.existsSync(this.adrPath)) {
      return [];
    }

    const files = fs.readdirSync(this.adrPath);
    return files
      .filter(file => file.startsWith('ADR-') && file.endsWith('.md'))
      .map(file => path.join(this.adrPath, file));
  }

  private async parseADR(filePath: string): Promise<ADRContext | null> {
    try {
      const content = fs.readFileSync(filePath, 'utf8');
      const lines = content.split('\n');

      // Parse title line: # ADR-0001: Title
      const titleLine = lines.find(line => line.startsWith('# ADR-'));
      if (!titleLine) return null;

      const titleMatch = titleLine.match(/# ADR-(\d+): (.+)/);
      if (!titleMatch) return null;

      const [, number, title] = titleMatch;

      // Parse metadata line
      const metaLine = lines.find(line => line.includes('Komponent:'));
      const componentMatch = metaLine?.match(/Komponent:\s*([^•]+)/);
      const component = componentMatch?.[1]?.trim() || 'unknown';

      // Extract sections
      const decision = this.extractSection(content, '## Beslutning');
      const alternatives = this.extractSection(content, '## Alternativer')
        .split('\n')
        .filter(line => line.match(/^\d+\)/))
        .map(line => line.replace(/^\d+\)\s*/, ''));

      const reasoning = decision; // In ADR format, reasoning is part of decision
      const evidence = this.extractSection(content, '## Evidens');
      const links = this.extractSection(content, '## Lenker')
        .split('•')
        .map(link => link.trim())
        .filter(Boolean);

      return {
        number,
        title,
        component,
        decision,
        alternatives,
        reasoning,
        evidence,
        links
      };
    } catch (error) {
      console.warn(`Could not parse ADR ${filePath}:`, error);
      return null;
    }
  }

  private extractSection(content: string, sectionTitle: string): string {
    const lines = content.split('\n');
    const startIndex = lines.findIndex(line => line.trim() === sectionTitle);
    
    if (startIndex === -1) return '';

    const nextSectionIndex = lines.findIndex((line, index) => 
      index > startIndex && line.startsWith('## '));
    
    const endIndex = nextSectionIndex === -1 ? lines.length : nextSectionIndex;
    
    return lines
      .slice(startIndex + 1, endIndex)
      .join('\n')
      .trim();
  }
}

export default ADRContextReader;