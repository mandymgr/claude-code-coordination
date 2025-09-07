#!/usr/bin/env tsx

// Enhanced Security Quality Gates Demo with blocking functionality

import { promises as fs } from 'fs';
import path from 'path';

interface SecurityIssue {
  type: 'secret' | 'vulnerability' | 'license';
  severity: 'high' | 'medium' | 'low';
  file: string;
  line: number;
  message: string;
  content: string;
}

interface SecurityScanResult {
  passed: boolean;
  blocked: boolean;
  issues: SecurityIssue[];
  summary: string;
}

class SecurityScanner {
  private secretPatterns = [
    { pattern: /sk-[a-zA-Z0-9]{48}/, type: 'OpenAI API Key' },
    { pattern: /ghp_[a-zA-Z0-9]{36}/, type: 'GitHub Personal Access Token' },
    { pattern: /AKIA[0-9A-Z]{16}/, type: 'AWS Access Key ID' },
    { pattern: /postgres:\/\/[^:]+:[^@]+@[^:\/]+:\d+\/\w+/, type: 'Database URL with credentials' },
    { pattern: /jwt[_-]?secret[_-]?key/i, type: 'JWT Secret Key' },
    { pattern: /password\s*[:=]\s*['"][^'"]+['"]/, type: 'Hardcoded Password' }
  ];

  private vulnerabilityPatterns = [
    { pattern: /eval\s*\(/, type: 'Eval Usage', severity: 'high' as const },
    { pattern: /document\.innerHTML\s*=/, type: 'XSS Risk - innerHTML', severity: 'high' as const },
    { pattern: /createCipher\s*\(\s*['"]des['"]/, type: 'Weak Encryption Algorithm', severity: 'medium' as const },
    { pattern: /SELECT.*FROM.*WHERE.*=\s*['"][^'"]*\$\{/, type: 'SQL Injection Risk', severity: 'high' as const }
  ];

  private licensePatterns = [
    { pattern: /GPL\s*v?3/i, type: 'GPL v3 License' },
    { pattern: /GNU\s*General\s*Public\s*License/i, type: 'GPL License' },
    { pattern: /gpl-licensed-package/i, type: 'GPL Licensed Dependency' },
    { pattern: /This program is free software.*GNU General Public License/s, type: 'GPL License Header' }
  ];

  async scanFile(filePath: string): Promise<SecurityIssue[]> {
    const issues: SecurityIssue[] = [];
    
    try {
      const content = await fs.readFile(filePath, 'utf-8');
      const lines = content.split('\n');

      // Scan for secrets
      lines.forEach((line, index) => {
        this.secretPatterns.forEach(({ pattern, type }) => {
          if (pattern.test(line)) {
            issues.push({
              type: 'secret',
              severity: 'high',
              file: filePath,
              line: index + 1,
              message: `Detected ${type}`,
              content: line.trim().substring(0, 80) + '...'
            });
          }
        });

        // Scan for vulnerabilities
        this.vulnerabilityPatterns.forEach(({ pattern, type, severity }) => {
          if (pattern.test(line)) {
            issues.push({
              type: 'vulnerability',
              severity,
              file: filePath,
              line: index + 1,
              message: `Security vulnerability: ${type}`,
              content: line.trim()
            });
          }
        });

        // Scan for license issues
        this.licensePatterns.forEach(({ pattern, type }) => {
          if (pattern.test(line)) {
            issues.push({
              type: 'license',
              severity: 'medium',
              file: filePath,
              line: index + 1,
              message: `License compliance issue: ${type}`,
              content: line.trim().substring(0, 100) + '...'
            });
          }
        });
      });

    } catch (error) {
      console.error(`Error scanning file ${filePath}:`, error);
    }

    return issues;
  }

  async scanFiles(filePaths: string[]): Promise<SecurityScanResult> {
    console.log('🔒 KRINS Security Quality Gates - Advanced Scanning...\n');

    const allIssues: SecurityIssue[] = [];
    
    for (const filePath of filePaths) {
      console.log(`🔍 Scanning: ${path.basename(filePath)}`);
      const issues = await this.scanFile(filePath);
      allIssues.push(...issues);
    }

    // Determine if scan should be blocked
    const highSeverityIssues = allIssues.filter(issue => issue.severity === 'high');
    const secretIssues = allIssues.filter(issue => issue.type === 'secret');
    const blocked = highSeverityIssues.length > 0 || secretIssues.length > 0;

    console.log('\n🛡️ Security Scan Results:');
    console.log('─'.repeat(50));

    if (allIssues.length === 0) {
      console.log('✅ No security issues detected');
      return {
        passed: true,
        blocked: false,
        issues: [],
        summary: 'Clean - No security issues found'
      };
    }

    // Group and display issues
    const issuesByType = {
      secret: allIssues.filter(i => i.type === 'secret'),
      vulnerability: allIssues.filter(i => i.type === 'vulnerability'),
      license: allIssues.filter(i => i.type === 'license')
    };

    // Display secrets (always blocking)
    if (issuesByType.secret.length > 0) {
      console.log('🚨 SECRETS DETECTED (BLOCKING):');
      issuesByType.secret.forEach(issue => {
        console.log(`   ❌ ${issue.message} (${path.basename(issue.file)}:${issue.line})`);
        console.log(`      Content: ${issue.content.replace(/[a-zA-Z0-9]{8,}/g, '***REDACTED***')}`);
      });
      console.log();
    }

    // Display vulnerabilities
    if (issuesByType.vulnerability.length > 0) {
      console.log('⚠️  VULNERABILITIES:');
      issuesByType.vulnerability.forEach(issue => {
        const icon = issue.severity === 'high' ? '❌' : '⚠️';
        console.log(`   ${icon} ${issue.message} (${path.basename(issue.file)}:${issue.line})`);
      });
      console.log();
    }

    // Display license issues
    if (issuesByType.license.length > 0) {
      console.log('📄 LICENSE ISSUES:');
      issuesByType.license.forEach(issue => {
        console.log(`   ⚠️  ${issue.message} (${path.basename(issue.file)}:${issue.line})`);
      });
      console.log();
    }

    // Final verdict
    const status = blocked ? '❌ BLOCKED' : '⚠️  PASSED WITH WARNINGS';
    console.log(`📋 Final Status: ${status}`);
    console.log(`📊 Total Issues: ${allIssues.length}`);
    console.log(`🔴 High Severity: ${highSeverityIssues.length}`);
    console.log(`🔒 Secrets Found: ${secretIssues.length}`);

    if (blocked) {
      console.log('\n🚨 DEPLOYMENT BLOCKED: Critical security issues must be resolved before proceeding');
    }

    return {
      passed: !blocked,
      blocked,
      issues: allIssues,
      summary: blocked 
        ? `BLOCKED: ${allIssues.length} security issues found (${highSeverityIssues.length} critical)`
        : `PASSED: ${allIssues.length} warnings, no critical issues`
    };
  }
}

// Demo execution
async function runSecurityDemo() {
  const scanner = new SecurityScanner();
  
  const testFiles = [
    './test-security-issues.ts',
    './test-gpl-license.ts',
    './test-quality-gates.ts' // Clean file for comparison
  ];

  const result = await scanner.scanFiles(testFiles);
  
  console.log('\n' + '='.repeat(60));
  console.log('🎯 KRINS SECURITY QUALITY GATES DEMONSTRATION');
  console.log('='.repeat(60));
  console.log(`Result: ${result.passed ? '✅ PASSED' : '❌ FAILED'}`);
  console.log(`Blocked: ${result.blocked ? '🚨 YES' : '✅ NO'}`);
  console.log(`Summary: ${result.summary}`);
  
  if (result.blocked) {
    console.log('\n🛡️ This demonstrates KRINS ability to block dangerous code from deployment!');
  }
}

runSecurityDemo().catch(console.error);