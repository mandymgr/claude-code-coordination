// Demo: ADR-Aware Code Generation
import ContextAwareAI from './context-aware-ai';
import path from 'path';

export async function demonstrateADRIntegration() {
  console.log('🧠 ADR-Aware AI Code Generation Demo\n');

  // Initialize with path to Krins-Dev-Memory-OS ADRs
  const krinsPath = '/Users/mandymarigjervikrygg/Desktop/code/Krins-Dev-Memory-OS/docs/adr';
  const contextAI = new ContextAwareAI(krinsPath);

  // Demo scenarios
  const scenarios = [
    {
      task: "Implementer semantisk søk i dokumenter",
      component: "platform/search",
      language: "TypeScript",
      framework: "Express"
    },
    {
      task: "Lag database schema for brukeradministrasjon", 
      component: "platform/auth",
      language: "SQL"
    },
    {
      task: "Opprett API endpoint for document search",
      component: "backend/api",
      language: "TypeScript"
    }
  ];

  for (const scenario of scenarios) {
    console.log(`\n📋 Scenario: ${scenario.task}`);
    console.log(`📁 Component: ${scenario.component}`);
    console.log('─'.repeat(50));

    try {
      const result = await contextAI.generateCode(scenario);

      console.log(`\n🎯 Applied ADRs (${result.appliedADRs.length}):`);
      result.appliedADRs.forEach(adr => {
        console.log(`  • ADR-${adr.number}: ${adr.title}`);
        console.log(`    Decision: ${adr.decision.substring(0, 100)}...`);
      });

      console.log(`\n💡 Recommendations:`);
      result.recommendations.forEach(rec => {
        console.log(`  • ${rec}`);
      });

      console.log(`\n📝 Generated Code:`);
      console.log(result.code);

      // Check if new ADR should be suggested
      const adrSuggestion = await contextAI.suggestNewADR(scenario);
      if (adrSuggestion) {
        console.log(`\n⚠️  ADR Suggestion: ${adrSuggestion}`);
      }

    } catch (error) {
      console.error(`❌ Error processing scenario: ${error}`);
    }

    console.log('\n' + '='.repeat(70));
  }
}

// Export for use in main system
export { ContextAwareAI };

// Run demo if this file is executed directly
if (require.main === module) {
  demonstrateADRIntegration().catch(console.error);
}