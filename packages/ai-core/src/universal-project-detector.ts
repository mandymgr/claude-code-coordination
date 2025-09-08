#!/usr/bin/env node
/**
 * 🔍 Universal Project Detector - Intelligent project type detection and analysis
 * Advanced project analysis with framework detection, dependency analysis, and AI recommendations
 * TypeScript implementation for KRINS-Universe-Builder
 */

import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

// Type definitions for project detection
export interface ProjectAnalysis {
  name: string;
  path: string;
  type: ProjectType;
  frameworks: string[];
  languages: string[];
  buildTools: string[];
  testFrameworks: string[];
  linting: string[];
  ci: string[];
  deployment: string[];
  dependencies: DependencyAnalysis;
  structure: ProjectStructure;
  recommendations: Recommendation[];
  confidence: number;
  isMonorepo: boolean;
  hasDocumentation: boolean;
  hasTests: boolean;
  complexity: 'low' | 'medium' | 'high' | 'enterprise';
}

export interface DependencyAnalysis {
  total: number;
  production: number;
  development: number;
  outdated?: string[];
  security?: SecurityIssue[];
  licenses: Record<string, number>;
}

export interface SecurityIssue {
  package: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  issue: string;
}

export interface ProjectStructure {
  hasSourceDir: boolean;
  sourceDir: string;
  hasTestDir: boolean;
  testDir: string;
  configFiles: string[];
  entryPoints: string[];
  directories: string[];
  keyFiles: string[];
}

export interface Recommendation {
  type: 'improvement' | 'best-practice' | 'security' | 'performance' | 'ai-optimization';
  title: string;
  description: string;
  priority: 'low' | 'medium' | 'high';
  aiModel?: 'claude' | 'gpt4' | 'gemini';
}

export type ProjectType = 
  | 'react-app' | 'vue-app' | 'angular-app' | 'svelte-app'
  | 'next.js' | 'nuxt.js' | 'gatsby'
  | 'node-api' | 'express-api' | 'fastify-api' | 'nest.js'
  | 'typescript-lib' | 'javascript-lib' | 'npm-package'
  | 'python-app' | 'django' | 'flask' | 'fastapi'
  | 'rust-app' | 'go-app' | 'java-app' | 'spring-boot'
  | 'mobile-react-native' | 'mobile-flutter' | 'mobile-ionic'
  | 'electron-app' | 'chrome-extension'
  | 'monorepo' | 'lerna' | 'nx-workspace'
  | 'documentation' | 'static-site'
  | 'unknown';

export class UniversalProjectDetector {
  private projectPath: string;
  private packageJson: any = null;
  private analysis: Partial<ProjectAnalysis> = {};

  constructor(projectPath: string = process.cwd()) {
    this.projectPath = path.resolve(projectPath);
  }

  /**
   * 🎯 Main detection method - analyzes project comprehensively
   */
  public async analyze(): Promise<ProjectAnalysis> {
    try {
      this.analysis = {
        name: path.basename(this.projectPath),
        path: this.projectPath,
        frameworks: [],
        languages: [],
        buildTools: [],
        testFrameworks: [],
        linting: [],
        ci: [],
        deployment: [],
        recommendations: []
      };

      // Load package.json if exists
      await this.loadPackageJson();

      // Perform analysis steps
      await this.detectProjectType();
      await this.analyzeLanguages();
      await this.detectFrameworks();
      await this.analyzeBuildTools();
      await this.analyzeTestFrameworks();
      await this.analyzeLinting();
      await this.analyzeCI();
      await this.analyzeDeployment();
      await this.analyzeDependencies();
      await this.analyzeProjectStructure();
      await this.generateRecommendations();
      
      // Calculate confidence and complexity
      this.calculateConfidence();
      this.determineComplexity();

      return this.analysis as ProjectAnalysis;
    } catch (error) {
      throw new Error(`Project analysis failed: ${error}`);
    }
  }

  /**
   * 📦 Load and parse package.json
   */
  private async loadPackageJson(): Promise<void> {
    const packagePath = path.join(this.projectPath, 'package.json');
    if (fs.existsSync(packagePath)) {
      try {
        this.packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
        this.analysis.name = this.packageJson.name || this.analysis.name;
      } catch (error) {
        console.warn('Warning: Could not parse package.json');
      }
    }
  }

  /**
   * 🔍 Detect main project type
   */
  private async detectProjectType(): Promise<void> {
    if (!this.packageJson) {
      this.analysis.type = await this.detectNonNodeProject();
      return;
    }

    const deps = { ...this.packageJson.dependencies, ...this.packageJson.devDependencies };
    
    // React-based projects
    if (deps.react) {
      if (deps.next || this.packageJson.name?.includes('next')) {
        this.analysis.type = 'next.js';
      } else if (deps.gatsby) {
        this.analysis.type = 'gatsby';
      } else if (deps['react-native']) {
        this.analysis.type = 'mobile-react-native';
      } else if (deps.electron) {
        this.analysis.type = 'electron-app';
      } else {
        this.analysis.type = 'react-app';
      }
      return;
    }

    // Vue projects
    if (deps.vue) {
      if (deps.nuxt) {
        this.analysis.type = 'nuxt.js';
      } else {
        this.analysis.type = 'vue-app';
      }
      return;
    }

    // Angular projects
    if (deps['@angular/core']) {
      this.analysis.type = 'angular-app';
      return;
    }

    // Svelte projects
    if (deps.svelte) {
      this.analysis.type = 'svelte-app';
      return;
    }

    // Node.js API projects
    if (deps.express) {
      this.analysis.type = 'express-api';
    } else if (deps.fastify) {
      this.analysis.type = 'fastify-api';
    } else if (deps['@nestjs/core']) {
      this.analysis.type = 'nest.js';
    } else if (this.hasApiStructure()) {
      this.analysis.type = 'node-api';
    }

    // Library/Package projects
    else if (this.packageJson.main || this.packageJson.exports || this.packageJson.types) {
      if (deps.typescript || this.hasTypeScriptFiles()) {
        this.analysis.type = 'typescript-lib';
      } else {
        this.analysis.type = 'javascript-lib';
      }
    }

    // Monorepo detection
    else if (this.isMonorepo()) {
      this.analysis.type = 'monorepo';
      this.analysis.isMonorepo = true;
    }

    // Chrome extension
    else if (fs.existsSync(path.join(this.projectPath, 'manifest.json'))) {
      this.analysis.type = 'chrome-extension';
    }

    // Default fallback
    else {
      this.analysis.type = 'unknown';
    }
  }

  /**
   * 🌐 Detect non-Node.js projects
   */
  private async detectNonNodeProject(): Promise<ProjectType> {
    const files = fs.readdirSync(this.projectPath);

    // Python projects
    if (files.includes('requirements.txt') || files.includes('setup.py') || files.includes('pyproject.toml')) {
      if (files.includes('manage.py')) return 'django';
      if (files.some(f => f.includes('flask'))) return 'flask';
      if (files.some(f => f.includes('fastapi'))) return 'fastapi';
      return 'python-app';
    }

    // Rust projects
    if (files.includes('Cargo.toml')) {
      return 'rust-app';
    }

    // Go projects
    if (files.includes('go.mod') || files.includes('go.sum')) {
      return 'go-app';
    }

    // Java projects
    if (files.includes('pom.xml') || files.includes('build.gradle')) {
      if (fs.existsSync(path.join(this.projectPath, 'src/main/java'))) {
        return 'spring-boot';
      }
      return 'java-app';
    }

    // Flutter projects
    if (files.includes('pubspec.yaml')) {
      return 'mobile-flutter';
    }

    // Static sites / Documentation
    if (files.includes('_config.yml') || files.includes('docs/')) {
      return 'documentation';
    }

    return 'unknown';
  }

  /**
   * 🗣️ Analyze programming languages used
   */
  private async analyzeLanguages(): Promise<void> {
    const languages: string[] = [];
    const files = this.getAllFiles(this.projectPath);

    const languageExtensions = {
      'TypeScript': ['.ts', '.tsx'],
      'JavaScript': ['.js', '.jsx', '.mjs'],
      'Python': ['.py'],
      'Rust': ['.rs'],
      'Go': ['.go'],
      'Java': ['.java'],
      'C++': ['.cpp', '.cc', '.cxx'],
      'C#': ['.cs'],
      'PHP': ['.php'],
      'Ruby': ['.rb'],
      'Swift': ['.swift'],
      'Kotlin': ['.kt'],
      'Dart': ['.dart'],
      'HTML': ['.html', '.htm'],
      'CSS': ['.css', '.scss', '.sass', '.less'],
      'SQL': ['.sql'],
      'Shell': ['.sh', '.bash', '.zsh']
    };

    for (const [language, extensions] of Object.entries(languageExtensions)) {
      if (files.some(file => extensions.some(ext => file.endsWith(ext)))) {
        languages.push(language);
      }
    }

    this.analysis.languages = languages;
  }

  /**
   * 🏗️ Detect frameworks and libraries
   */
  private async detectFrameworks(): Promise<void> {
    const frameworks: string[] = [];
    
    if (!this.packageJson) return;

    const deps = { ...this.packageJson.dependencies, ...this.packageJson.devDependencies };
    
    const frameworkMap = {
      'React': ['react'],
      'Vue': ['vue'],
      'Angular': ['@angular/core'],
      'Svelte': ['svelte'],
      'Next.js': ['next'],
      'Nuxt.js': ['nuxt'],
      'Gatsby': ['gatsby'],
      'Express': ['express'],
      'Fastify': ['fastify'],
      'NestJS': ['@nestjs/core'],
      'Socket.io': ['socket.io'],
      'GraphQL': ['graphql', 'apollo-server'],
      'Apollo': ['apollo-client', '@apollo/client'],
      'Redux': ['redux', '@reduxjs/toolkit'],
      'MobX': ['mobx'],
      'Styled Components': ['styled-components'],
      'Material-UI': ['@mui/material', '@material-ui/core'],
      'Chakra UI': ['@chakra-ui/react'],
      'Tailwind CSS': ['tailwindcss'],
      'Bootstrap': ['bootstrap'],
      'Electron': ['electron'],
      'React Native': ['react-native'],
      'Ionic': ['@ionic/react', '@ionic/angular'],
      'Three.js': ['three'],
      'D3.js': ['d3']
    };

    for (const [framework, packages] of Object.entries(frameworkMap)) {
      if (packages.some(pkg => deps[pkg])) {
        frameworks.push(framework);
      }
    }

    this.analysis.frameworks = frameworks;
  }

  /**
   * 🔨 Analyze build tools
   */
  private async analyzeBuildTools(): Promise<void> {
    const buildTools: string[] = [];
    
    if (this.packageJson) {
      const deps = { ...this.packageJson.dependencies, ...this.packageJson.devDependencies };
      const scripts = this.packageJson.scripts || {};

      const toolMap = {
        'Webpack': ['webpack'],
        'Vite': ['vite'],
        'Rollup': ['rollup'],
        'Parcel': ['parcel'],
        'ESBuild': ['esbuild'],
        'Babel': ['@babel/core'],
        'TypeScript': ['typescript'],
        'SWC': ['@swc/core'],
        'Turbo': ['turbo'],
        'Rome': ['rome']
      };

      for (const [tool, packages] of Object.entries(toolMap)) {
        if (packages.some(pkg => deps[pkg]) || 
            Object.values(scripts).some((script: unknown) => packages.some(pkg => typeof script === 'string' && script.includes(pkg)))) {
          buildTools.push(tool);
        }
      }
    }

    // Check for config files
    const configFiles = [
      { tool: 'Webpack', files: ['webpack.config.js', 'webpack.config.ts'] },
      { tool: 'Vite', files: ['vite.config.js', 'vite.config.ts'] },
      { tool: 'Rollup', files: ['rollup.config.js', 'rollup.config.ts'] },
      { tool: 'Babel', files: ['.babelrc', 'babel.config.js'] }
    ];

    for (const { tool, files } of configFiles) {
      if (files.some(file => fs.existsSync(path.join(this.projectPath, file)))) {
        if (!buildTools.includes(tool)) {
          buildTools.push(tool);
        }
      }
    }

    this.analysis.buildTools = buildTools;
  }

  /**
   * 🧪 Analyze testing frameworks
   */
  private async analyzeTestFrameworks(): Promise<void> {
    const testFrameworks: string[] = [];
    
    if (this.packageJson) {
      const deps = { ...this.packageJson.dependencies, ...this.packageJson.devDependencies };

      const testMap = {
        'Jest': ['jest'],
        'Vitest': ['vitest'],
        'Mocha': ['mocha'],
        'Jasmine': ['jasmine'],
        'Cypress': ['cypress'],
        'Playwright': ['playwright', '@playwright/test'],
        'Puppeteer': ['puppeteer'],
        'Testing Library': ['@testing-library/react', '@testing-library/vue'],
        'Enzyme': ['enzyme'],
        'Karma': ['karma'],
        'Protractor': ['protractor']
      };

      for (const [framework, packages] of Object.entries(testMap)) {
        if (packages.some(pkg => deps[pkg])) {
          testFrameworks.push(framework);
        }
      }
    }

    this.analysis.testFrameworks = testFrameworks;
    this.analysis.hasTests = testFrameworks.length > 0 || this.hasTestFiles();
  }

  /**
   * ✨ Analyze linting and formatting tools
   */
  private async analyzeLinting(): Promise<void> {
    const linting: string[] = [];
    
    if (this.packageJson) {
      const deps = { ...this.packageJson.dependencies, ...this.packageJson.devDependencies };

      const lintMap = {
        'ESLint': ['eslint'],
        'Prettier': ['prettier'],
        'TSLint': ['tslint'],
        'Stylelint': ['stylelint'],
        'JSHint': ['jshint'],
        'StandardJS': ['standard'],
        'XO': ['xo'],
        'Rome': ['rome']
      };

      for (const [tool, packages] of Object.entries(lintMap)) {
        if (packages.some(pkg => deps[pkg])) {
          linting.push(tool);
        }
      }
    }

    // Check for config files
    const configFiles = [
      { tool: 'ESLint', files: ['.eslintrc.js', '.eslintrc.json', '.eslintrc.yml'] },
      { tool: 'Prettier', files: ['.prettierrc', '.prettierrc.json', '.prettierrc.js'] },
      { tool: 'Stylelint', files: ['.stylelintrc', '.stylelintrc.json'] }
    ];

    for (const { tool, files } of configFiles) {
      if (files.some(file => fs.existsSync(path.join(this.projectPath, file)))) {
        if (!linting.includes(tool)) {
          linting.push(tool);
        }
      }
    }

    this.analysis.linting = linting;
  }

  /**
   * 🔄 Analyze CI/CD configuration
   */
  private async analyzeCI(): Promise<void> {
    const ci: string[] = [];

    const ciFiles = [
      { name: 'GitHub Actions', files: ['.github/workflows/'] },
      { name: 'GitLab CI', files: ['.gitlab-ci.yml'] },
      { name: 'Travis CI', files: ['.travis.yml'] },
      { name: 'CircleCI', files: ['.circleci/config.yml'] },
      { name: 'Jenkins', files: ['Jenkinsfile'] },
      { name: 'Azure Pipelines', files: ['azure-pipelines.yml'] },
      { name: 'Bitbucket Pipelines', files: ['bitbucket-pipelines.yml'] }
    ];

    for (const { name, files } of ciFiles) {
      if (files.some(file => fs.existsSync(path.join(this.projectPath, file)))) {
        ci.push(name);
      }
    }

    this.analysis.ci = ci;
  }

  /**
   * 🚀 Analyze deployment configuration
   */
  private async analyzeDeployment(): Promise<void> {
    const deployment: string[] = [];

    const deployFiles = [
      { name: 'Docker', files: ['Dockerfile', 'docker-compose.yml'] },
      { name: 'Kubernetes', files: ['k8s/', 'kubernetes/'] },
      { name: 'Vercel', files: ['vercel.json', '.vercelignore'] },
      { name: 'Netlify', files: ['netlify.toml', '_redirects'] },
      { name: 'Heroku', files: ['Procfile', 'app.json'] },
      { name: 'AWS', files: ['serverless.yml', 'aws-exports.js'] }
    ];

    for (const { name, files } of deployFiles) {
      if (files.some(file => fs.existsSync(path.join(this.projectPath, file)))) {
        deployment.push(name);
      }
    }

    if (this.packageJson?.scripts) {
      const scripts = this.packageJson.scripts;
      if (scripts.deploy || scripts['deploy:prod']) {
        deployment.push('Custom Deploy Script');
      }
    }

    this.analysis.deployment = deployment;
  }

  /**
   * 📊 Analyze dependencies
   */
  private async analyzeDependencies(): Promise<void> {
    if (!this.packageJson) {
      this.analysis.dependencies = {
        total: 0,
        production: 0,
        development: 0,
        licenses: {}
      };
      return;
    }

    const prodDeps = Object.keys(this.packageJson.dependencies || {});
    const devDeps = Object.keys(this.packageJson.devDependencies || {});

    this.analysis.dependencies = {
      total: prodDeps.length + devDeps.length,
      production: prodDeps.length,
      development: devDeps.length,
      licenses: {}
    };

    // TODO: Add license analysis and security scanning
    // This would require additional API calls or local tools
  }

  /**
   * 🏗️ Analyze project structure
   */
  private async analyzeProjectStructure(): Promise<void> {
    const structure: ProjectStructure = {
      hasSourceDir: false,
      sourceDir: '',
      hasTestDir: false,
      testDir: '',
      configFiles: [],
      entryPoints: [],
      directories: [],
      keyFiles: []
    };

    const files = fs.readdirSync(this.projectPath);
    const dirs = files.filter(f => fs.statSync(path.join(this.projectPath, f)).isDirectory());
    
    structure.directories = dirs;

    // Detect source directories
    const srcDirs = ['src', 'lib', 'app', 'source'];
    for (const dir of srcDirs) {
      if (dirs.includes(dir)) {
        structure.hasSourceDir = true;
        structure.sourceDir = dir;
        break;
      }
    }

    // Detect test directories
    const testDirs = ['test', 'tests', '__tests__', 'spec'];
    for (const dir of testDirs) {
      if (dirs.includes(dir)) {
        structure.hasTestDir = true;
        structure.testDir = dir;
        break;
      }
    }

    // Detect config files
    const configPatterns = [
      '.env', '.env.local', '.env.example',
      'tsconfig.json', 'jsconfig.json',
      '.eslintrc*', '.prettierrc*',
      'webpack.config.*', 'vite.config.*',
      'tailwind.config.*', 'next.config.*'
    ];

    for (const pattern of configPatterns) {
      const matches = files.filter(f => f.includes(pattern.replace('*', '')));
      structure.configFiles.push(...matches);
    }

    // Detect entry points
    if (this.packageJson) {
      if (this.packageJson.main) structure.entryPoints.push(this.packageJson.main);
      if (this.packageJson.module) structure.entryPoints.push(this.packageJson.module);
      if (this.packageJson.types) structure.entryPoints.push(this.packageJson.types);
    }

    // Common entry files
    const entryFiles = ['index.js', 'index.ts', 'main.js', 'main.ts', 'app.js', 'app.ts'];
    for (const file of entryFiles) {
      if (files.includes(file)) {
        structure.entryPoints.push(file);
      }
    }

    // Key files
    const keyFiles = files.filter(f => 
      ['README', 'CHANGELOG', 'LICENSE', 'CONTRIBUTING'].some(key => 
        f.toUpperCase().startsWith(key)
      )
    );
    structure.keyFiles = keyFiles;

    this.analysis.structure = structure;
    this.analysis.hasDocumentation = keyFiles.some(f => f.toUpperCase().startsWith('README'));
  }

  /**
   * 💡 Generate AI-powered recommendations
   */
  private async generateRecommendations(): Promise<void> {
    const recommendations: Recommendation[] = [];

    // Documentation recommendations
    if (!this.analysis.hasDocumentation) {
      recommendations.push({
        type: 'best-practice',
        title: 'Add README documentation',
        description: 'Project lacks comprehensive documentation. Consider adding a README.md with setup instructions, usage examples, and contribution guidelines.',
        priority: 'high',
        aiModel: 'claude'
      });
    }

    // Testing recommendations
    if (!this.analysis.hasTests) {
      recommendations.push({
        type: 'best-practice',
        title: 'Add automated testing',
        description: 'No testing framework detected. Adding unit tests will improve code quality and prevent regressions.',
        priority: 'high',
        aiModel: 'gpt4'
      });
    }

    // Linting recommendations
    if (!this.analysis.linting?.length) {
      recommendations.push({
        type: 'improvement',
        title: 'Add code linting',
        description: 'No linting tools detected. ESLint and Prettier can help maintain consistent code style.',
        priority: 'medium',
        aiModel: 'claude'
      });
    }

    // CI/CD recommendations
    if (!this.analysis.ci?.length) {
      recommendations.push({
        type: 'improvement',
        title: 'Set up continuous integration',
        description: 'No CI/CD configuration found. GitHub Actions or similar can automate testing and deployment.',
        priority: 'medium',
        aiModel: 'gpt4'
      });
    }

    // TypeScript recommendations
    if (this.analysis.languages?.includes('JavaScript') && !this.analysis.languages?.includes('TypeScript')) {
      recommendations.push({
        type: 'improvement',
        title: 'Consider TypeScript migration',
        description: 'Adding TypeScript can improve code safety and developer experience.',
        priority: 'low',
        aiModel: 'claude'
      });
    }

    // Security recommendations
    if (this.analysis.dependencies && this.analysis.dependencies.total > 50) {
      recommendations.push({
        type: 'security',
        title: 'Audit dependencies',
        description: 'Large number of dependencies detected. Regular security audits are recommended.',
        priority: 'medium',
        aiModel: 'gemini'
      });
    }

    // Performance recommendations based on project type
    if (this.analysis.type?.includes('react') || this.analysis.type?.includes('vue')) {
      recommendations.push({
        type: 'performance',
        title: 'Optimize bundle size',
        description: 'Consider implementing code splitting and lazy loading for better performance.',
        priority: 'medium',
        aiModel: 'gpt4'
      });
    }

    this.analysis.recommendations = recommendations;
  }

  /**
   * 📊 Calculate detection confidence
   */
  private calculateConfidence(): void {
    let confidence = 0;

    if (this.packageJson) confidence += 30;
    if (this.analysis.frameworks?.length) confidence += 20;
    if (this.analysis.languages?.length) confidence += 20;
    if (this.analysis.buildTools?.length) confidence += 15;
    if (this.analysis.structure?.hasSourceDir) confidence += 10;
    if (this.analysis.hasTests) confidence += 5;

    this.analysis.confidence = Math.min(confidence, 100);
  }

  /**
   * 🎯 Determine project complexity
   */
  private determineComplexity(): void {
    let complexityScore = 0;

    if (this.analysis.dependencies && this.analysis.dependencies.total > 100) complexityScore += 3;
    else if (this.analysis.dependencies && this.analysis.dependencies.total > 50) complexityScore += 2;
    else if (this.analysis.dependencies && this.analysis.dependencies.total > 20) complexityScore += 1;

    if (this.analysis.frameworks && this.analysis.frameworks.length > 5) complexityScore += 2;
    else if (this.analysis.frameworks && this.analysis.frameworks.length > 2) complexityScore += 1;

    if (this.analysis.isMonorepo) complexityScore += 2;
    if (this.analysis.languages && this.analysis.languages.length > 3) complexityScore += 1;
    if (this.analysis.ci && this.analysis.ci.length > 0) complexityScore += 1;
    if (this.analysis.deployment && this.analysis.deployment.length > 1) complexityScore += 1;

    if (complexityScore >= 8) this.analysis.complexity = 'enterprise';
    else if (complexityScore >= 5) this.analysis.complexity = 'high';
    else if (complexityScore >= 2) this.analysis.complexity = 'medium';
    else this.analysis.complexity = 'low';
  }

  // Helper methods
  private hasApiStructure(): boolean {
    const apiDirs = ['routes', 'controllers', 'api', 'endpoints'];
    const dirs = fs.readdirSync(this.projectPath).filter(f => 
      fs.statSync(path.join(this.projectPath, f)).isDirectory()
    );
    return apiDirs.some(dir => dirs.includes(dir));
  }

  private hasTypeScriptFiles(): boolean {
    const files = this.getAllFiles(this.projectPath);
    return files.some(file => file.endsWith('.ts') || file.endsWith('.tsx'));
  }

  private hasTestFiles(): boolean {
    const files = this.getAllFiles(this.projectPath);
    return files.some(file => 
      file.includes('.test.') || 
      file.includes('.spec.') || 
      file.includes('__tests__')
    );
  }

  private isMonorepo(): boolean {
    const files = fs.readdirSync(this.projectPath);
    return files.includes('lerna.json') || 
           files.includes('nx.json') || 
           files.includes('rush.json') ||
           files.includes('pnpm-workspace.yaml') ||
           (this.packageJson?.workspaces && Array.isArray(this.packageJson.workspaces));
  }

  private getAllFiles(dir: string, depth: number = 0): string[] {
    if (depth > 3) return []; // Prevent too deep recursion

    let results: string[] = [];
    try {
      const list = fs.readdirSync(dir);
      
      for (const file of list) {
        const filePath = path.join(dir, file);
        const stat = fs.statSync(filePath);
        
        if (stat && stat.isDirectory() && !file.startsWith('.') && file !== 'node_modules') {
          results = results.concat(this.getAllFiles(filePath, depth + 1));
        } else if (stat && stat.isFile()) {
          results.push(filePath);
        }
      }
    } catch (error) {
      // Ignore errors for directories we can't read
    }
    
    return results;
  }

  /**
   * 📋 Generate human-readable report
   */
  public generateReport(analysis: ProjectAnalysis): string {
    let report = `
🔍 Universal Project Analysis Report
=====================================

📁 Project: ${analysis.name}
📂 Path: ${analysis.path}
🎯 Type: ${analysis.type}
📊 Confidence: ${analysis.confidence}%
⚡ Complexity: ${analysis.complexity}

🗣️  Languages: ${analysis.languages.join(', ') || 'None detected'}
🏗️  Frameworks: ${analysis.frameworks.join(', ') || 'None detected'}
🔨 Build Tools: ${analysis.buildTools.join(', ') || 'None detected'}
🧪 Testing: ${analysis.testFrameworks.join(', ') || 'None detected'}
✨ Linting: ${analysis.linting.join(', ') || 'None detected'}
🔄 CI/CD: ${analysis.ci.join(', ') || 'None detected'}
🚀 Deployment: ${analysis.deployment.join(', ') || 'None detected'}

📊 Dependencies:
   Total: ${analysis.dependencies.total}
   Production: ${analysis.dependencies.production}
   Development: ${analysis.dependencies.development}

🏗️  Project Structure:
   Source Directory: ${analysis.structure.sourceDir || 'Not detected'}
   Test Directory: ${analysis.structure.testDir || 'Not detected'}
   Entry Points: ${analysis.structure.entryPoints.join(', ') || 'None detected'}
   Key Files: ${analysis.structure.keyFiles.join(', ') || 'None detected'}

Features:
   📚 Documentation: ${analysis.hasDocumentation ? '✅' : '❌'}
   🧪 Tests: ${analysis.hasTests ? '✅' : '❌'}
   📦 Monorepo: ${analysis.isMonorepo ? '✅' : '❌'}

💡 AI Recommendations (${analysis.recommendations.length}):
`;

    for (const rec of analysis.recommendations) {
      const priority = rec.priority === 'high' ? '🔴' : rec.priority === 'medium' ? '🟡' : '🟢';
      const aiIcon = rec.aiModel === 'claude' ? '🧠' : rec.aiModel === 'gpt4' ? '🤖' : '💎';
      report += `   ${priority} ${aiIcon} ${rec.title}\n      ${rec.description}\n\n`;
    }

    return report;
  }
}

// CLI entry point
async function main() {
  const projectPath = process.argv[2] || process.cwd();
  const detector = new UniversalProjectDetector(projectPath);
  
  try {
    console.log('🔍 Analyzing project...\n');
    const analysis = await detector.analyze();
    console.log(detector.generateReport(analysis));
    
    // Output JSON for programmatic use
    if (process.argv.includes('--json')) {
      console.log('\n📋 JSON Output:');
      console.log(JSON.stringify(analysis, null, 2));
    }
  } catch (error) {
    console.error('❌ Analysis failed:', error);
    process.exit(1);
  }
}

// Run if this is the main module
if (process.argv[1].endsWith('universal-project-detector.ts')) {
  main();
}