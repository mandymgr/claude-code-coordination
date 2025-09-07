// Simple Quality Gates test
import { QualityGateRunner } from './dist/quality/runner.js';

async function testQualityGates() {
  console.log('🛡️ Testing KRIN Quality Gates...\n');
  
  const qualityRunner = new QualityGateRunner();
  
  try {
    const results = await qualityRunner.run({
      files: ['../../test-quality-gates.ts', '../ai-core/src/magic-cli.ts'],
      checks: ['typescript', 'eslint', 'security', 'performance'],
      autoFix: true
    });
    
    console.log(`🛡️ Quality Gate Results:`);
    console.log(`Overall Status: ${results.passed ? '✅ PASSED' : '❌ FAILED'}`);
    console.log(`Total Issues: ${results.totalIssues}`);
    console.log(`Fixed Issues: ${results.fixedIssues}`);
    console.log(`Execution Time: ${results.executionTime}ms`);
    
    console.log('\nDetailed Results:');
    results.checks.forEach(check => {
      const status = check.passed ? '✅' : '❌';
      console.log(`${status} ${check.name}: ${check.message}`);
      if (check.fixedIssues > 0) {
        console.log(`   🔧 Auto-fixed ${check.fixedIssues} issues`);
      }
    });
    
    console.log(`\n📋 Summary: ${results.summary}`);
    
  } catch (error) {
    console.error('❌ Quality Gates test failed:', error.message);
  }
}

testQualityGates();