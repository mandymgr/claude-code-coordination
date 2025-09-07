#!/usr/bin/env tsx

import { QualityGateRunner } from './packages/mcp-server/src/quality/runner.js';

async function testQualityGates() {
  console.log('🛡️ Testing KRIN Quality Gates...\n');
  
  const qualityRunner = new QualityGateRunner();
  
  const testFiles = [
    './test-quality-gates.ts',
    './packages/ai-core/src/magic-cli.ts'
  ];
  
  const results = await qualityRunner.run({
    files: testFiles,
    checks: ['typescript', 'eslint', 'security', 'performance'],
    autoFix: true
  });
  
  console.log(`\n🛡️ Quality Gate Results:`);
  console.log(`Overall Status: ${results.passed ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`Total Issues: ${results.totalIssues}`);
  console.log(`Fixed Issues: ${results.fixedIssues}`);
  console.log(`Execution Time: ${results.executionTime}ms`);
  
  results.checks.forEach(check => {
    const status = check.passed ? '✅' : '❌';
    console.log(`\n${status} ${check.name}:`);
    console.log(`   Message: ${check.message}`);
    if (check.fixedIssues > 0) {
      console.log(`   🔧 Auto-fixed ${check.fixedIssues} issues`);
    }
  });
  
  console.log(`\n📋 Summary: ${results.summary}`);
}

testQualityGates().catch(console.error);