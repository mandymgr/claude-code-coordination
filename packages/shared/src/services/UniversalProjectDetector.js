"use strict";
/**
 * 🔮 Universal Project Detection Engine
 * Magically detects ANY type of development project and auto-configures coordination
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UniversalProjectDetector = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class UniversalProjectDetector {
    constructor(projectPath = process.cwd()) {
        this.detectedFrameworks = new Set();
        this.detectedLanguages = new Set();
        this.detectedTools = new Set();
        this.projectMetadata = {};
        this.projectPath = projectPath;
    }
    /**
     * 🎯 Master detection method - analyzes everything
     */
    async detectProject() {
        console.log('🔍 Scanning project for magic detection...');
        const analysis = {
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
    async detectProjectType() {
        const indicators = {
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
        let bestMatch = 'unknown';
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
    async detectLanguages() {
        const languages = [];
        try {
            const files = await this.getFilesList();
            const extensions = new Set(files.map(f => path.extname(f).toLowerCase()));
            const languageMap = {
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
        }
        catch (error) {
            console.warn('Could not detect languages:', error);
        }
        return languages;
    }
    /**
     * 🛠️ Detect frameworks and libraries
     */
    async detectFrameworks() {
        const frameworks = [];
        try {
            const packageJsonPath = path.join(this.projectPath, 'package.json');
            if (fs.existsSync(packageJsonPath)) {
                const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
                const allDeps = { ...packageJson.dependencies, ...packageJson.devDependencies };
                const frameworkMap = {
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
        }
        catch (error) {
            console.warn('Could not detect frameworks:', error);
        }
        return frameworks;
    }
    /**
     * 🔧 Detect development tools
     */
    async detectTools() {
        const tools = [];
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
    async detectArchitecture() {
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
    async detectDeploymentTarget() {
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
    async detectDatabase() {
        try {
            const packageJsonPath = path.join(this.projectPath, 'package.json');
            if (fs.existsSync(packageJsonPath)) {
                const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
                const allDeps = { ...packageJson.dependencies, ...packageJson.devDependencies };
                if (allDeps['pg'] || allDeps['postgresql'])
                    return 'postgresql';
                if (allDeps['mysql'] || allDeps['mysql2'])
                    return 'mysql';
                if (allDeps['mongodb'] || allDeps['mongoose'])
                    return 'mongodb';
                if (allDeps['redis'])
                    return 'redis';
                if (allDeps['sqlite'] || allDeps['sqlite3'])
                    return 'sqlite';
            }
        }
        catch (error) {
            console.warn('Could not detect database:', error);
        }
        return 'postgresql'; // Default
    }
    /**
     * 🧪 Detect testing framework
     */
    async detectTestingFramework() {
        try {
            const packageJsonPath = path.join(this.projectPath, 'package.json');
            if (fs.existsSync(packageJsonPath)) {
                const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
                const allDeps = { ...packageJson.dependencies, ...packageJson.devDependencies };
                if (allDeps['jest'])
                    return 'jest';
                if (allDeps['vitest'])
                    return 'vitest';
                if (allDeps['cypress'])
                    return 'cypress';
                if (allDeps['playwright'])
                    return 'playwright';
            }
        }
        catch (error) {
            console.warn('Could not detect testing framework:', error);
        }
        return 'jest'; // Default
    }
    /**
     * ☁️ Detect cloud provider
     */
    async detectCloudProvider() {
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
    async generateAISuggestions() {
        const suggestions = [];
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
    calculateConfidence() {
        const indicators = this.detectedLanguages.size + this.detectedFrameworks.size + this.detectedTools.size;
        return Math.min(indicators * 0.1, 1.0);
    }
    /**
     * ⚙️ Generate magic configuration
     */
    async generateMagicConfiguration(analysis) {
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
    getRecommendedAgents(projectType) {
        const agentMap = {
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
    generateWorkflowSteps(analysis) {
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
    generateQualityGates(analysis) {
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
    generateDeploymentSteps(analysis) {
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
    async calculatePatternScore(pattern) {
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
            }
            catch (error) {
                // Ignore errors
            }
        }
        return Math.min(score * pattern.weight, 1.0);
    }
    mapToProjectType(type) {
        const mapping = {
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
    async getFilesList() {
        const files = [];
        const scanDirectory = (dir) => {
            try {
                const items = fs.readdirSync(dir);
                for (const item of items) {
                    if (item.startsWith('.') && item !== '.gitignore')
                        continue;
                    if (item === 'node_modules')
                        continue;
                    const fullPath = path.join(dir, item);
                    const stat = fs.statSync(fullPath);
                    if (stat.isDirectory()) {
                        scanDirectory(fullPath);
                    }
                    else {
                        files.push(fullPath);
                    }
                }
            }
            catch (error) {
                // Ignore errors
            }
        };
        scanDirectory(this.projectPath);
        return files;
    }
    generateAutoSetupCommands(analysis) {
        const commands = [];
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
    generateTeamRecommendations(analysis) {
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
exports.UniversalProjectDetector = UniversalProjectDetector;
//# sourceMappingURL=UniversalProjectDetector.js.map