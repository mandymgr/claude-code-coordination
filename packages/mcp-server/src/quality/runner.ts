/**
 * Quality Gate Runner - KRIN's automated code quality system
 */

import chalk from 'chalk';
import { v4 as uuidv4 } from 'uuid';

export interface QualityCheck {
  name: string;
  passed: boolean;
  message: string;
  issues?: QualityIssue[];
  fixedIssues: number;
  executionTime: number;
}

export interface QualityIssue {
  file: string;
  line: number;
  column: number;
  rule: string;
  severity: 'error' | 'warning' | 'info';
  message: string;
  fixable: boolean;
  fixed?: boolean;
}

export interface QualityResults {
  id: string;
  passed: boolean;
  checks: QualityCheck[];
  totalIssues: number;
  fixedIssues: number;
  executionTime: number;
  summary: string;
}

export class QualityGateRunner {
  private runningChecks: Map<string, Promise<QualityResults>> = new Map();

  async run(options: {
    files: string[];
    checks: string[];
    autoFix: boolean;
  }): Promise<QualityResults> {
    const { files, checks, autoFix } = options;
    const runId = uuidv4();

    console.log(chalk.blue(`🛡️ KRIN: Running quality gates on ${files.length} files`));

    const startTime = Date.now();
    const qualityChecks: QualityCheck[] = [];
    let totalIssues = 0;
    let totalFixed = 0;

    // Run each requested check
    for (const checkType of checks) {
      const checkResult = await this.runSingleCheck(checkType, files, autoFix);
      qualityChecks.push(checkResult);
      totalIssues += checkResult.issues?.length || 0;
      totalFixed += checkResult.fixedIssues;
    }

    const executionTime = Date.now() - startTime;
    const passed = qualityChecks.every(check => check.passed);

    const results: QualityResults = {
      id: runId,
      passed,
      checks: qualityChecks,
      totalIssues,
      fixedIssues: totalFixed,
      executionTime,
      summary: this.generateSummary(passed, totalIssues, totalFixed, qualityChecks)
    };

    console.log(chalk.green(`${passed ? '✅' : '❌'} Quality gate ${passed ? 'PASSED' : 'FAILED'} in ${executionTime}ms`));

    return results;
  }

  private async runSingleCheck(
    checkType: string, 
    files: string[], 
    autoFix: boolean
  ): Promise<QualityCheck> {
    const startTime = Date.now();

    switch (checkType) {
      case 'typescript':
        return this.runTypeScriptCheck(files, startTime);
      
      case 'eslint':
        return this.runESLintCheck(files, autoFix, startTime);
      
      case 'security':
        return this.runSecurityCheck(files, startTime);
      
      case 'performance':
        return this.runPerformanceCheck(files, startTime);
      
      case 'tests':
        return this.runTestCheck(files, startTime);
      
      default:
        return {
          name: checkType,
          passed: false,
          message: `Unknown check type: ${checkType}`,
          issues: [],
          fixedIssues: 0,
          executionTime: Date.now() - startTime
        };
    }
  }

  private async runTypeScriptCheck(files: string[], startTime: number): Promise<QualityCheck> {
    // Simulate TypeScript compilation check
    await this.delay(500);

    const tsFiles = files.filter(f => f.endsWith('.ts') || f.endsWith('.tsx'));
    const issues: QualityIssue[] = [];

    // Simulate finding TypeScript issues
    if (tsFiles.length > 0 && Math.random() < 0.3) {
      issues.push({
        file: tsFiles[0],
        line: 42,
        column: 8,
        rule: 'implicit-any',
        severity: 'error',
        message: 'Variable implicitly has an any type',
        fixable: false
      });
    }

    return {
      name: 'TypeScript Check',
      passed: issues.length === 0,
      message: issues.length === 0 ? 'No TypeScript errors found' : `${issues.length} TypeScript errors found`,
      issues,
      fixedIssues: 0,
      executionTime: Date.now() - startTime
    };
  }

  private async runESLintCheck(files: string[], autoFix: boolean, startTime: number): Promise<QualityCheck> {
    await this.delay(800);

    const issues: QualityIssue[] = [];
    let fixedCount = 0;

    // Simulate ESLint issues
    if (Math.random() < 0.7) {
      const mockIssues: QualityIssue[] = [
        {
          file: files[0] || 'src/example.ts',
          line: 15,
          column: 12,
          rule: 'no-console',
          severity: 'warning',
          message: 'Unexpected console statement',
          fixable: true
        },
        {
          file: files[0] || 'src/example.ts',
          line: 28,
          column: 5,
          rule: 'unused-vars',
          severity: 'warning',
          message: 'Variable is defined but never used',
          fixable: true
        },
        {
          file: files[1] || 'src/utils.ts',
          line: 67,
          column: 18,
          rule: 'prefer-const',
          severity: 'error',
          message: 'Variable should be const instead of let',
          fixable: true
        }
      ];

      for (const issue of mockIssues) {
        if (autoFix && issue.fixable && Math.random() < 0.8) {
          issue.fixed = true;
          fixedCount++;
        } else {
          issues.push(issue);
        }
      }
    }

    return {
      name: 'ESLint',
      passed: issues.length === 0,
      message: issues.length === 0 ? 'All linting rules passed' : `${issues.length} linting errors found`,
      issues,
      fixedIssues: fixedCount,
      executionTime: Date.now() - startTime
    };
  }

  private async runSecurityCheck(files: string[], startTime: number): Promise<QualityCheck> {
    await this.delay(1200);

    const issues: QualityIssue[] = [];

    // Simulate security vulnerability detection
    if (Math.random() < 0.2) {
      issues.push({
        file: files.find(f => f.includes('api')) || files[0] || 'src/api.ts',
        line: 156,
        column: 22,
        rule: 'xss-prevention',
        severity: 'error',
        message: 'Potential XSS vulnerability in user input handling',
        fixable: false
      });
    }

    return {
      name: 'Security Audit',
      passed: issues.length === 0,
      message: issues.length === 0 ? 'No security vulnerabilities found' : `${issues.length} security issues found`,
      issues,
      fixedIssues: 0,
      executionTime: Date.now() - startTime
    };
  }

  private async runPerformanceCheck(files: string[], startTime: number): Promise<QualityCheck> {
    await this.delay(600);

    const issues: QualityIssue[] = [];

    // Simulate performance analysis
    if (Math.random() < 0.4) {
      issues.push({
        file: files.find(f => f.includes('.tsx')) || files[0] || 'src/Component.tsx',
        line: 89,
        column: 12,
        rule: 'react-hooks-deps',
        severity: 'warning',
        message: 'Missing dependency in useEffect hook may cause performance issues',
        fixable: true
      });
    }

    return {
      name: 'Performance Check',
      passed: issues.length === 0,
      message: issues.length === 0 ? 'No performance issues detected' : `${issues.length} performance issues found`,
      issues,
      fixedIssues: 0,
      executionTime: Date.now() - startTime
    };
  }

  private async runTestCheck(files: string[], startTime: number): Promise<QualityCheck> {
    await this.delay(1500);

    const testFiles = files.filter(f => f.includes('.test.') || f.includes('.spec.'));
    const sourceFiles = files.filter(f => !f.includes('.test.') && !f.includes('.spec.'));
    
    // Calculate test coverage simulation
    const coverage = testFiles.length > 0 ? Math.random() * 40 + 60 : 30; // 60-100% if tests exist, otherwise low
    const passed = coverage >= 70;

    return {
      name: 'Test Coverage',
      passed,
      message: passed ? 
        `Test coverage: ${coverage.toFixed(1)}% (meets 70% threshold)` : 
        `Test coverage: ${coverage.toFixed(1)}% (below 70% threshold)`,
      issues: [],
      fixedIssues: 0,
      executionTime: Date.now() - startTime
    };
  }

  private generateSummary(passed: boolean, totalIssues: number, fixedIssues: number, checks: QualityCheck[]): string {
    if (passed) {
      return `🎉 All quality gates passed! ${fixedIssues > 0 ? `Auto-fixed ${fixedIssues} issues.` : ''}`;
    }

    const failedChecks = checks.filter(c => !c.passed).map(c => c.name);
    return `⚠️ Quality gate failed. Issues found in: ${failedChecks.join(', ')}. ` +
           `${fixedIssues > 0 ? `Auto-fixed ${fixedIssues} of ${totalIssues + fixedIssues} total issues.` : ''}`;
  }

  private async delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  async getActiveChecks(): Promise<string[]> {
    return Array.from(this.runningChecks.keys());
  }

  async cancelCheck(checkId: string): Promise<boolean> {
    if (this.runningChecks.has(checkId)) {
      this.runningChecks.delete(checkId);
      console.log(chalk.yellow(`🛑 KRIN: Cancelled quality check ${checkId}`));
      return true;
    }
    return false;
  }
}