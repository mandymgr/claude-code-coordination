// Quick test of ADR integration concept
const fs = require('fs');
const path = require('path');

// Simplified ADR Reader
class SimpleADRReader {
  constructor(adrPath) {
    this.adrPath = adrPath || '/Users/mandymarigjervikrygg/Desktop/code/Krins-Dev-Memory-OS/docs/adr';
  }

  async getADRContext() {
    try {
      if (!fs.existsSync(this.adrPath)) {
        console.log(`❌ ADR path not found: ${this.adrPath}`);
        return [];
      }

      const files = fs.readdirSync(this.adrPath);
      const adrFiles = files.filter(file => 
        file.startsWith('ADR-') && file.endsWith('.md')
      );

      console.log(`📋 Found ${adrFiles.length} ADR files:`);
      
      const contexts = [];
      for (const file of adrFiles) {
        const filePath = path.join(this.adrPath, file);
        const content = fs.readFileSync(filePath, 'utf8');
        
        // Simple parsing
        const lines = content.split('\n');
        const titleLine = lines.find(line => line.startsWith('# ADR-'));
        
        if (titleLine) {
          const titleMatch = titleLine.match(/# ADR-(\d+): (.+)/);
          if (titleMatch) {
            const [, number, title] = titleMatch;
            
            // Extract component and decision
            const metaLine = lines.find(line => line.includes('Komponent:'));
            const componentMatch = metaLine?.match(/Komponent:\s*([^•]+)/);
            const component = componentMatch?.[1]?.trim() || 'unknown';
            
            const decisionSection = this.extractSection(content, '## Beslutning');
            
            contexts.push({
              number,
              title,
              component,
              decision: decisionSection.substring(0, 200) + '...',
              file: filePath
            });

            console.log(`  • ADR-${number}: ${title} (${component})`);
          }
        }
      }

      return contexts;
    } catch (error) {
      console.error('Error reading ADRs:', error.message);
      return [];
    }
  }

  extractSection(content, sectionTitle) {
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

  async findRelevantADRs(task, component) {
    const allADRs = await this.getADRContext();
    
    const taskLower = task.toLowerCase();
    const keywords = ['search', 'søk', 'database', 'auth', 'api', 'pgvector'];
    
    return allADRs.filter(adr => {
      const titleMatch = keywords.some(keyword => 
        adr.title.toLowerCase().includes(keyword) || 
        taskLower.includes(keyword)
      );
      
      const componentMatch = component && 
        adr.component.toLowerCase().includes(component.toLowerCase());
        
      return titleMatch || componentMatch;
    });
  }
}

// Demo function
async function demonstrateADRIntegration() {
  console.log('🧠 ADR-Aware AI Integration Demo');
  console.log('='.repeat(50));

  const adrReader = new SimpleADRReader();
  
  // Test scenarios
  const scenarios = [
    { task: "Implementer semantisk søk", component: "search" },
    { task: "Lag database for brukere", component: "database" },
    { task: "Opprett API endpoint", component: "api" }
  ];

  for (const scenario of scenarios) {
    console.log(`\n📋 Task: ${scenario.task}`);
    console.log(`📁 Component: ${scenario.component}`);
    console.log('-'.repeat(40));

    const relevantADRs = await adrReader.findRelevantADRs(scenario.task, scenario.component);
    
    if (relevantADRs.length > 0) {
      console.log(`\n🎯 Relevant ADRs found (${relevantADRs.length}):`);
      relevantADRs.forEach(adr => {
        console.log(`  • ADR-${adr.number}: ${adr.title}`);
        console.log(`    Component: ${adr.component}`);
        console.log(`    Decision: ${adr.decision}`);
      });
      
      console.log(`\n💭 AI would now generate code following these ADRs...`);
    } else {
      console.log(`\n⚠️  No relevant ADRs found - suggest creating new ADR`);
    }
  }
  
  console.log('\n' + '='.repeat(50));
  console.log('✅ Demo complete! This shows how AI can read and apply ADR context.');
}

// Run demo
if (require.main === module) {
  demonstrateADRIntegration().catch(console.error);
}

module.exports = { SimpleADRReader, demonstrateADRIntegration };