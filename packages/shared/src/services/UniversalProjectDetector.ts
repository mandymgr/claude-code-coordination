/**
 * 🔮 Universal Project Detection Engine
 * Magically detects ANY type of development project and auto-configures coordination
 */

import * as fs from 'fs';
import * as path from 'path';
import { execSync } from 'child_process';
import { 
  ProjectAnalysis, 
  ProjectType, 
  MagicConfiguration, 
  DetectionPattern,
  WorkflowStep,
  QualityGate,
  DeploymentStep
} from '../types/project.js';

export class UniversalProjectDetector {
  private projectPath: string;
  private detectedFrameworks = new Set<string>();
  private detectedLanguages = new Set<string>();
  private detectedTools = new Set<string>();
  private projectMetadata: Record<string, any> = {};

  constructor(projectPath: string = process.cwd()) {
    this.projectPath = projectPath;
  }

  /**
   * 🎯 Master detection method - analyzes everything
   */
  async detectProject(): Promise<{
    analysis: ProjectAnalysis;
    magicConfig: MagicConfiguration;
    autoSetupCommands: string[];
    recommendedTeam: string[];
    developmentWorkflow: Record<string, string>;
  }> {
    console.log('🔍 Scanning project for magic detection...');
    
    const analysis: ProjectAnalysis = {
      type: await this.detectProjectType(),
      languages: await this.detectLanguages(),
      frameworks: await this.detectFrameworks(),
      tools: await this.detectTools(),
      architecture: await this.detectArchitecture(),
      deployment: await this.detectDeploymentTarget(),
      database: await this.detectDatabase(),
      testing: await this.detectTestingFramework(),
      cloud: await this.detectCloudProvider(),
      aiSuggestions: await this.generateAISuggestions(),
      confidence: this.calculateConfidence()
    };

    // Generate magic configuration
    const magicConfig = await this.generateMagicConfiguration(analysis);
    
    return {
      analysis,
      magicConfig,
      autoSetupCommands: this.generateAutoSetupCommands(analysis),
      recommendedTeam: this.generateTeamRecommendations(analysis),
      developmentWorkflow: {
        git_workflow: 'gitflow',
        testing_strategy: 'tdd',
        deployment_frequency: 'continuous',
        code_review_process: 'pull-request'
      }
    };
  }

  /**
   * 🎭 Detect project type with supernatural accuracy
   */
  private async detectProjectType(): Promise<ProjectType> {
    const indicators: Record<string, DetectionPattern> = {
      // Web Development
      'react-app': {
        files: ['src/App.js', 'src/App.tsx', 'public/index.html', 'package.json'],
        dependencies: ['react', 'react-dom'],
        weight: 0.9
      },
      'nextjs-app': {
        files: ['next.config.js', 'pages/', 'app/', 'package.json'],
        dependencies: ['next', 'react'],
        weight: 0.95
      },
      'vue-app': {
        files: ['src/App.vue', 'vue.config.js', 'package.json'],
        dependencies: ['vue'],
        weight: 0.9
      },
      'angular-app': {
        files: ['angular.json', 'src/app/', 'package.json'],
        dependencies: ['@angular/core'],
        weight: 0.9
      },
      'svelte-app': {
        files: ['svelte.config.js', 'src/App.svelte'],
        dependencies: ['svelte'],
        weight: 0.9
      },
      
      // Backend Services
      'express-api': {
        files: ['server.js', 'app.js', 'routes/', 'package.json'],
        dependencies: ['express'],
        weight: 0.8
      },
      'fastify-api': {
        files: ['fastify.js', 'plugins/', 'package.json'],
        dependencies: ['fastify'],
        weight: 0.8
      },
      
      // Mobile Development  
      'react-native': {
        files: ['metro.config.js', 'android/', 'ios/', 'App.js'],
        dependencies: ['react-native'],
        weight: 0.85
      },
      'flutter-app': {
        files: ['pubspec.yaml', 'lib/main.dart', 'android/', 'ios/'],
        weight: 0.9
      },
      
      // Desktop Applications
      'electron-app': {
        files: ['src/main.js', 'src/renderer/', 'package.json'],
        dependencies: ['electron'],
        weight: 0.85
      },
      
      // Data Science & AI
      'jupyter-project': {
        files: ['*.ipynb', 'requirements.txt', 'data/'],
        weight: 0.7
      },
      'ml-project': {
        files: ['model.py', 'train.py', 'datasets/', 'requirements.txt'],
        weight: 0.75
      }
    };

    let bestMatch: ProjectType = 'unknown';
    let highestScore = 0;

    for (const [type, pattern] of Object.entries(indicators)) {
      const score = await this.calculatePatternScore(pattern);
      if (score > highestScore) {
        highestScore = score;
        bestMatch = this.mapToProjectType(type);
      }
    }

    return bestMatch;
  }

  /**
   * 🔍 Detect programming languages used
   */
  private async detectLanguages(): Promise<string[]> {
    const languages: string[] = [];
    
    try {
      const files = await this.getFilesList();
      const extensions = new Set(files.map(f => path.extname(f).toLowerCase()));
      
      const languageMap: Record<string, string> = {
        '.js': 'JavaScript',
        '.ts': 'TypeScript',
        '.jsx': 'JavaScript',
        '.tsx': 'TypeScript',
        '.py': 'Python',
        '.java': 'Java',
        '.cpp': 'C++',
        '.c': 'C',
        '.cs': 'C#',
        '.php': 'PHP',
        '.rb': 'Ruby',
        '.go': 'Go',
        '.rs': 'Rust',
        '.swift': 'Swift',
        '.kt': 'Kotlin',
        '.dart': 'Dart',
        '.vue': 'Vue',
        '.svelte': 'Svelte'
      };

      for (const ext of extensions) {
        if (languageMap[ext]) {
          languages.push(languageMap[ext]);
        }
      }
    } catch (error) {
      console.warn('Could not detect languages:', error);
    }

    return languages;
  }

  /**
   * 🛠️ Detect frameworks and libraries
   */
  private async detectFrameworks(): Promise<string[]> {
    const frameworks: string[] = [];
    
    try {
      const packageJsonPath = path.join(this.projectPath, 'package.json');
      if (fs.existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        const allDeps = { ...packageJson.dependencies, ...packageJson.devDependencies };
        
        const frameworkMap: Record<string, string> = {
          'react': 'React',
          'vue': 'Vue.js',
          '@angular/core': 'Angular',
          'svelte': 'Svelte',
          'next': 'Next.js',
          'nuxt': 'Nuxt.js',
          'express': 'Express.js',
          'fastify': 'Fastify',
          'nest': 'NestJS',
          'tailwindcss': 'Tailwind CSS',
          'bootstrap': 'Bootstrap',
          'sass': 'Sass',
          'webpack': 'Webpack',
          'vite': 'Vite',
          'rollup': 'Rollup'
        };

        for (const [dep, framework] of Object.entries(frameworkMap)) {
          if (allDeps[dep]) {
            frameworks.push(framework);
          }
        }
      }
    } catch (error) {
      console.warn('Could not detect frameworks:', error);
    }

    return frameworks;
  }

  /**
   * 🔧 Detect development tools
   */
  private async detectTools(): Promise<string[]> {
    const tools: string[] = [];
    
    // Check for common tools
    const toolChecks = [
      { file: '.git/', tool: 'Git' },
      { file: 'package.json', tool: 'npm' },
      { file: 'yarn.lock', tool: 'Yarn' },
      { file: 'pnpm-lock.yaml', tool: 'pnpm' },
      { file: 'Dockerfile', tool: 'Docker' },
      { file: 'docker-compose.yml', tool: 'Docker Compose' },
      { file: '.eslintrc', tool: 'ESLint' },
      { file: 'prettier.config.js', tool: 'Prettier' },
      { file: 'jest.config.js', tool: 'Jest' },
      { file: 'cypress.config.js', tool: 'Cypress' },
      { file: 'playwright.config.js', tool: 'Playwright' }
    ];

    for (const { file, tool } of toolChecks) {
      if (fs.existsSync(path.join(this.projectPath, file))) {
        tools.push(tool);
      }
    }

    return tools;
  }

  /**
   * 🏗️ Detect architecture type
   */
  private async detectArchitecture() {
    if (fs.existsSync(path.join(this.projectPath, 'packages')) ||
        fs.existsSync(path.join(this.projectPath, 'apps'))) {
      return 'monorepo';
    }
    
    if (fs.existsSync(path.join(this.projectPath, 'serverless.yml'))) {
      return 'serverless';
    }
    
    if (fs.existsSync(path.join(this.projectPath, 'next.config.js'))) {
      return 'ssr';
    }
    
    return 'monolith';
  }

  /**
   * 🚀 Detect deployment target
   */
  private async detectDeploymentTarget() {
    if (fs.existsSync(path.join(this.projectPath, 'vercel.json'))) {
      return 'vercel';
    }
    
    if (fs.existsSync(path.join(this.projectPath, 'netlify.toml'))) {
      return 'netlify';
    }
    
    if (fs.existsSync(path.join(this.projectPath, 'Dockerfile'))) {
      return 'docker';
    }
    
    return 'vercel'; // Default
  }

  /**
   * 🗄️ Detect database type
   */
  private async detectDatabase() {
    try {
      const packageJsonPath = path.join(this.projectPath, 'package.json');
      if (fs.existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        const allDeps = { ...packageJson.dependencies, ...packageJson.devDependencies };
        
        if (allDeps['pg'] || allDeps['postgresql']) return 'postgresql';
        if (allDeps['mysql'] || allDeps['mysql2']) return 'mysql';
        if (allDeps['mongodb'] || allDeps['mongoose']) return 'mongodb';
        if (allDeps['redis']) return 'redis';
        if (allDeps['sqlite'] || allDeps['sqlite3']) return 'sqlite';
      }
    } catch (error) {
      console.warn('Could not detect database:', error);
    }
    
    return 'postgresql'; // Default
  }

  /**
   * 🧪 Detect testing framework
   */
  private async detectTestingFramework() {
    try {
      const packageJsonPath = path.join(this.projectPath, 'package.json');
      if (fs.existsSync(packageJsonPath)) {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        const allDeps = { ...packageJson.dependencies, ...packageJson.devDependencies };
        
        if (allDeps['jest']) return 'jest';
        if (allDeps['vitest']) return 'vitest';
        if (allDeps['cypress']) return 'cypress';
        if (allDeps['playwright']) return 'playwright';
      }
    } catch (error) {
      console.warn('Could not detect testing framework:', error);
    }
    
    return 'jest'; // Default
  }

  /**
   * ☁️ Detect cloud provider
   */
  private async detectCloudProvider() {
    if (fs.existsSync(path.join(this.projectPath, 'vercel.json'))) {
      return 'vercel';
    }
    
    if (fs.existsSync(path.join(this.projectPath, 'netlify.toml'))) {
      return 'netlify';
    }
    
    return 'vercel'; // Default
  }

  /**
   * 🤖 Generate AI suggestions
   */
  private async generateAISuggestions(): Promise<string[]> {
    const suggestions: string[] = [];
    
    // Check for TypeScript
    const hasTypeScript = fs.existsSync(path.join(this.projectPath, 'tsconfig.json'));
    if (!hasTypeScript) {
      suggestions.push('Consider migrating to TypeScript for better type safety');
    }
    
    // Check for testing
    const hasTests = fs.existsSync(path.join(this.projectPath, '__tests__')) ||
                     fs.existsSync(path.join(this.projectPath, 'tests'));
    if (!hasTests) {
      suggestions.push('Add comprehensive test suite');
    }
    
    // Check for ESLint
    const hasESLint = fs.existsSync(path.join(this.projectPath, '.eslintrc'));
    if (!hasESLint) {
      suggestions.push('Set up ESLint for code quality');
    }
    
    suggestions.push('Add performance monitoring');
    suggestions.push('Implement error tracking');
    
    return suggestions;
  }

  /**
   * 📊 Calculate detection confidence
   */
  private calculateConfidence(): number {
    const indicators = this.detectedLanguages.size + this.detectedFrameworks.size + this.detectedTools.size;
    return Math.min(indicators * 0.1, 1.0);
  }

  /**
   * ⚙️ Generate magic configuration
   */
  private async generateMagicConfiguration(analysis: ProjectAnalysis): Promise<MagicConfiguration> {
    const recommendedAgents = this.getRecommendedAgents(analysis.type);
    
    return {
      projectType: analysis.type,
      recommendedAgents,
      suggestedWorkflow: this.generateWorkflowSteps(analysis),
      qualityGates: this.generateQualityGates(analysis),
      deploymentPipeline: this.generateDeploymentSteps(analysis)
    };
  }

  /**
   * 👥 Get recommended agents for project type
   */
  private getRecommendedAgents(projectType: ProjectType): string[] {
    const agentMap: Record<ProjectType, string[]> = {
      'web_fullstack': ['claude', 'gpt4'],
      'ecommerce': ['claude', 'gpt4', 'gemini'],
      'mobile_app': ['claude', 'gpt4'],
      'api_microservices': ['gpt4', 'gemini'],
      'desktop_app': ['claude', 'gpt4'],
      'data_science': ['gemini', 'claude'],
      'game_development': ['gpt4', 'claude'],
      'blockchain': ['gpt4', 'gemini'],
      'iot': ['gemini', 'gpt4'],
      'unknown': ['claude']
    };
    
    return agentMap[projectType] || ['claude'];
  }

  /**
   * 📝 Generate workflow steps
   */
  private generateWorkflowSteps(analysis: ProjectAnalysis): WorkflowStep[] {
    return [
      {
        name: 'Code Quality Check',
        description: 'Run linting and type checking',
        automated: true,
        dependencies: ['eslint', 'typescript']
      },
      {
        name: 'Run Tests',
        description: 'Execute test suite',
        automated: true,
        dependencies: [analysis.testing || 'jest']
      },
      {
        name: 'Build Project',
        description: 'Create production build',
        automated: true
      },
      {
        name: 'Deploy',
        description: 'Deploy to target environment',
        automated: false
      }
    ];
  }

  /**
   * 🛡️ Generate quality gates
   */
  private generateQualityGates(analysis: ProjectAnalysis): QualityGate[] {
    return [
      {
        name: 'Code Quality',
        checks: ['eslint', 'prettier', 'typescript'],
        blocking: true
      },
      {
        name: 'Testing',
        checks: ['unit-tests', 'integration-tests'],
        blocking: true
      },
      {
        name: 'Security',
        checks: ['security-audit', 'dependency-check'],
        blocking: true
      }
    ];
  }

  /**
   * 🚀 Generate deployment steps
   */
  private generateDeploymentSteps(analysis: ProjectAnalysis): DeploymentStep[] {
    return [
      {
        name: 'Development Deploy',
        environment: 'development',
        automated: true,
        requirements: ['build-success']
      },
      {
        name: 'Staging Deploy',
        environment: 'staging',
        automated: false,
        requirements: ['code-review', 'tests-pass']
      },
      {
        name: 'Production Deploy',
        environment: 'production',
        automated: false,
        requirements: ['staging-approval', 'security-check']
      }
    ];
  }

  // Helper methods
  private async calculatePatternScore(pattern: DetectionPattern): Promise<number> {
    let score = 0;
    
    for (const file of pattern.files) {
      if (fs.existsSync(path.join(this.projectPath, file))) {
        score += 0.3;
      }
    }
    
    if (pattern.dependencies) {
      try {
        const packageJsonPath = path.join(this.projectPath, 'package.json');
        if (fs.existsSync(packageJsonPath)) {
          const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
          const allDeps = { ...packageJson.dependencies, ...packageJson.devDependencies };
          
          for (const dep of pattern.dependencies) {
            if (allDeps[dep]) {
              score += 0.4;
            }
          }
        }
      } catch (error) {
        // Ignore errors
      }
    }
    
    return Math.min(score * pattern.weight, 1.0);
  }

  private mapToProjectType(type: string): ProjectType {
    const mapping: Record<string, ProjectType> = {
      'react-app': 'web_fullstack',
      'nextjs-app': 'web_fullstack',
      'vue-app': 'web_fullstack',
      'angular-app': 'web_fullstack',
      'svelte-app': 'web_fullstack',
      'express-api': 'api_microservices',
      'fastify-api': 'api_microservices',
      'react-native': 'mobile_app',
      'flutter-app': 'mobile_app',
      'electron-app': 'desktop_app',
      'jupyter-project': 'data_science',
      'ml-project': 'data_science'
    };
    
    return mapping[type] || 'unknown';
  }

  private async getFilesList(): Promise<string[]> {
    const files: string[] = [];
    
    const scanDirectory = (dir: string) => {
      try {
        const items = fs.readdirSync(dir);
        for (const item of items) {
          if (item.startsWith('.') && item !== '.gitignore') continue;
          if (item === 'node_modules') continue;
          
          const fullPath = path.join(dir, item);
          const stat = fs.statSync(fullPath);
          
          if (stat.isDirectory()) {
            scanDirectory(fullPath);
          } else {
            files.push(fullPath);
          }
        }
      } catch (error) {
        // Ignore errors
      }
    };
    
    scanDirectory(this.projectPath);
    return files;
  }

  private generateAutoSetupCommands(analysis: ProjectAnalysis): string[] {
    const commands: string[] = [];
    
    if (!analysis.languages.includes('TypeScript')) {
      commands.push('npm install -D typescript @types/node');
      commands.push('npx tsc --init');
    }
    
    if (!analysis.tools.includes('ESLint')) {
      commands.push('npm install -D eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin');
      commands.push('npx eslint --init');
    }
    
    if (!analysis.tools.includes('Prettier')) {
      commands.push('npm install -D prettier');
    }
    
    return commands;
  }

  private generateTeamRecommendations(analysis: ProjectAnalysis): string[] {
    const baseTeam = ['Frontend Developer', 'Backend Developer'];
    
    if (analysis.type === 'ecommerce') {
      baseTeam.push('Payment Integration Specialist', 'Security Expert');
    }
    
    if (analysis.type === 'mobile_app') {
      baseTeam.push('Mobile UI/UX Designer', 'Platform Integration Specialist');
    }
    
    if (analysis.type === 'data_science') {
      baseTeam.push('Data Scientist', 'ML Engineer');
    }
    
    return baseTeam;
  }
}