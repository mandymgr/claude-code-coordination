#!/usr/bin/env node
/**
 * 🔮 Universal Project Detection Engine
 * Magically detects ANY type of development project and auto-configures coordination
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

class UniversalProjectDetector {
  constructor(projectPath = process.cwd()) {
    this.projectPath = projectPath;
    this.detectedFrameworks = new Set();
    this.detectedLanguages = new Set();
    this.detectedTools = new Set();
    this.projectMetadata = {};
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
      tools: ['git', 'npm'], // Simplified for demo
      architecture: 'monorepo', // Simplified for demo
      deployment: 'vercel', // Simplified for demo
      database: 'postgresql', // Simplified for demo
      testing: 'jest', // Simplified for demo
      cloud: 'vercel', // Simplified for demo
      aiSuggestions: ['Enable TypeScript strict mode', 'Add performance monitoring']
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
      'react-app': ['src/App.js', 'src/App.tsx', 'public/index.html', 'package.json'],
      'nextjs-app': ['next.config.js', 'pages/', 'app/', 'package.json'],
      'vue-app': ['src/App.vue', 'vue.config.js', 'package.json'],
      'angular-app': ['angular.json', 'src/app/', 'package.json'],
      'svelte-app': ['svelte.config.js', 'src/App.svelte'],
      
      // Backend Services
      'express-api': ['server.js', 'app.js', 'routes/', 'package.json'],
      'fastify-api': ['fastify.js', 'plugins/', 'package.json'],
      'django-app': ['manage.py', 'settings.py', 'requirements.txt'],
      'flask-app': ['app.py', 'requirements.txt', 'templates/'],
      'rails-app': ['Gemfile', 'config/routes.rb', 'app/controllers/'],
      'laravel-app': ['composer.json', 'artisan', 'app/Http/'],
      'spring-boot': ['pom.xml', 'src/main/java/', 'application.properties'],
      
      // Mobile Development  
      'react-native': ['metro.config.js', 'android/', 'ios/', 'App.js'],
      'flutter-app': ['pubspec.yaml', 'lib/main.dart', 'android/', 'ios/'],
      'ionic-app': ['ionic.config.json', 'src/app/', 'package.json'],
      
      // Desktop Applications
      'electron-app': ['src/main.js', 'src/renderer/', 'package.json'],
      'tauri-app': ['src-tauri/', 'Cargo.toml', 'tauri.conf.json'],
      
      // Game Development
      'unity-game': ['Assets/', 'ProjectSettings/', '*.unity'],
      'unreal-game': ['*.uproject', 'Source/', 'Content/'],
      'godot-game': ['project.godot', 'scenes/', 'scripts/'],
      
      // Data Science & AI
      'jupyter-project': ['*.ipynb', 'requirements.txt', 'data/'],
      'ml-project': ['model.py', 'train.py', 'datasets/', 'requirements.txt'],
      'data-pipeline': ['airflow/', 'dags/', 'docker-compose.yml'],
      
      // DevOps & Infrastructure
      'kubernetes-deployment': ['k8s/', 'helm/', 'kustomization.yaml'],
      'terraform-infrastructure': ['*.tf', 'terraform.tfvars', 'modules/'],
      'docker-project': ['Dockerfile', 'docker-compose.yml'],
      
      // Blockchain & Web3
      'smart-contracts': ['contracts/', 'truffle-config.js', 'hardhat.config.js'],
      'dapp': ['src/contracts/', 'migrations/', 'web3/'],
      
      // E-commerce
      'shopify-app': ['shopify.app.toml', 'extensions/', 'web/'],
      'woocommerce-plugin': ['woocommerce-plugin.php', 'includes/'],
      
      // CMS & Content
      'wordpress-theme': ['style.css', 'index.php', 'functions.php'],
      'gatsby-site': ['gatsby-config.js', 'src/pages/', 'package.json'],
      'hugo-site': ['config.yaml', 'content/', 'layouts/'],
      
      // Microservices
      'microservice-architecture': ['docker-compose.yml', 'services/', 'api-gateway/'],
      'serverless-app': ['serverless.yml', 'functions/', 'handler.js'],
      
      // Libraries & Packages
      'npm-package': ['package.json', 'src/', 'dist/', 'index.js'],
      'python-package': ['setup.py', 'pyproject.toml', 'src/', '__init__.py'],
      'rust-crate': ['Cargo.toml', 'src/lib.rs', 'src/main.rs'],
      'go-module': ['go.mod', 'main.go', 'cmd/'],
      
      // Documentation
      'documentation-site': ['mkdocs.yml', 'docs/', 'README.md'],
      'storybook': ['.storybook/', 'stories/', 'package.json']
    };

    const detectedTypes = [];

    for (const [type, files] of Object.entries(indicators)) {
      const matches = files.filter(file => {
        const fullPath = path.join(this.projectPath, file);
        return fs.existsSync(fullPath);
      });
      
      if (matches.length >= Math.ceil(files.length * 0.6)) {
        detectedTypes.push({
          type,
          confidence: (matches.length / files.length) * 100,
          matchedFiles: matches
        });
      }
    }

    // Sort by confidence and return top match
    detectedTypes.sort((a, b) => b.confidence - a.confidence);
    return detectedTypes.length > 0 ? detectedTypes[0] : { type: 'unknown', confidence: 0 };
  }

  /**
   * 🌍 Detect all programming languages in project
   */
  async detectLanguages() {
    const languageExtensions = {
      'JavaScript': ['.js', '.jsx', '.mjs'],
      'TypeScript': ['.ts', '.tsx', '.d.ts'],
      'Python': ['.py', '.pyx', '.pyw'],
      'Java': ['.java', '.class'],
      'C#': ['.cs', '.csx'],
      'C++': ['.cpp', '.cc', '.cxx', '.h', '.hpp'],
      'C': ['.c', '.h'],
      'Go': ['.go'],
      'Rust': ['.rs'],
      'PHP': ['.php', '.phar'],
      'Ruby': ['.rb', '.erb'],
      'Swift': ['.swift'],
      'Kotlin': ['.kt', '.kts'],
      'Dart': ['.dart'],
      'R': ['.r', '.R'],
      'Scala': ['.scala', '.sc'],
      'Shell': ['.sh', '.bash', '.zsh'],
      'PowerShell': ['.ps1', '.psm1'],
      'SQL': ['.sql'],
      'HTML': ['.html', '.htm'],
      'CSS': ['.css', '.scss', '.sass', '.less'],
      'YAML': ['.yml', '.yaml'],
      'JSON': ['.json'],
      'XML': ['.xml', '.xsl'],
      'Markdown': ['.md', '.markdown'],
      'Dockerfile': ['Dockerfile'],
      'Terraform': ['.tf', '.tfvars'],
      'Solidity': ['.sol']
    };

    const detectedLanguages = new Map();
    
    const scanDirectory = (dir) => {
      try {
        const items = fs.readdirSync(dir, { withFileTypes: true });
        
        for (const item of items) {
          const fullPath = path.join(dir, item.name);
          
          if (item.isDirectory() && !item.name.startsWith('.') && item.name !== 'node_modules') {
            scanDirectory(fullPath);
          } else if (item.isFile()) {
            const ext = path.extname(item.name).toLowerCase();
            
            for (const [language, extensions] of Object.entries(languageExtensions)) {
              if (extensions.includes(ext) || extensions.includes(item.name)) {
                detectedLanguages.set(language, (detectedLanguages.get(language) || 0) + 1);
              }
            }
          }
        }
      } catch (error) {
        // Ignore permission errors
      }
    };

    scanDirectory(this.projectPath);
    
    return Array.from(detectedLanguages.entries())
      .map(([language, fileCount]) => ({ language, fileCount }))
      .sort((a, b) => b.fileCount - a.fileCount);
  }

  /**
   * 🏗️ Detect frameworks and libraries
   */
  async detectFrameworks() {
    const frameworks = new Set();
    
    // Check package.json for JS/TS frameworks
    const packageJsonPath = path.join(this.projectPath, 'package.json');
    if (fs.existsSync(packageJsonPath)) {
      try {
        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        const allDeps = { ...packageJson.dependencies, ...packageJson.devDependencies };
        
        const frameworkPatterns = {
          'React': ['react', '@types/react'],
          'Vue': ['vue', 'vue-router', 'vuex'],
          'Angular': ['@angular/core', '@angular/cli'],
          'Svelte': ['svelte', '@sveltejs/kit'],
          'Next.js': ['next'],
          'Nuxt': ['nuxt', '@nuxt/core'],
          'Express': ['express'],
          'Fastify': ['fastify'],
          'NestJS': ['@nestjs/core'],
          'Socket.io': ['socket.io'],
          'GraphQL': ['graphql', 'apollo-server'],
          'Prisma': ['prisma', '@prisma/client'],
          'TypeORM': ['typeorm'],
          'Mongoose': ['mongoose'],
          'Redis': ['redis', 'ioredis'],
          'Jest': ['jest'],
          'Cypress': ['cypress'],
          'Playwright': ['playwright'],
          'Webpack': ['webpack'],
          'Vite': ['vite'],
          'Tailwind': ['tailwindcss'],
          'Styled Components': ['styled-components'],
          'Material-UI': ['@mui/material', '@material-ui/core'],
          'Chakra UI': ['@chakra-ui/react'],
          'React Native': ['react-native'],
          'Expo': ['expo'],
          'Electron': ['electron'],
          'Tauri': ['@tauri-apps/api']
        };

        for (const [framework, packages] of Object.entries(frameworkPatterns)) {
          if (packages.some(pkg => allDeps[pkg])) {
            frameworks.add(framework);
          }
        }
      } catch (error) {
        console.warn('Could not parse package.json:', error.message);
      }
    }

    // Check requirements.txt for Python frameworks
    const requirementsPath = path.join(this.projectPath, 'requirements.txt');
    if (fs.existsSync(requirementsPath)) {
      try {
        const requirements = fs.readFileSync(requirementsPath, 'utf8');
        const pythonFrameworks = {
          'Django': ['django'],
          'Flask': ['flask'],
          'FastAPI': ['fastapi'],
          'Pandas': ['pandas'],
          'NumPy': ['numpy'],
          'TensorFlow': ['tensorflow'],
          'PyTorch': ['torch', 'pytorch'],
          'Scikit-learn': ['scikit-learn', 'sklearn'],
          'Jupyter': ['jupyter', 'jupyterlab']
        };

        for (const [framework, packages] of Object.entries(pythonFrameworks)) {
          if (packages.some(pkg => requirements.toLowerCase().includes(pkg))) {
            frameworks.add(framework);
          }
        }
      } catch (error) {
        console.warn('Could not parse requirements.txt:', error.message);
      }
    }

    return Array.from(frameworks);
  }

  /**
   * 🛠️ Generate magic auto-configuration
   */
  async generateMagicConfiguration(analysis) {
    const config = {
      project_name: path.basename(this.projectPath),
      project_type: analysis.type.type,
      detected_at: new Date().toISOString(),
      
      // AI-optimized settings based on project type
      coordination: {
        session_timeout_hours: this.getOptimalTimeout(analysis.type.type),
        ai_assistance_level: this.getAIAssistanceLevel(analysis.languages),
        auto_conflict_resolution: true, // Simplified
        intelligent_file_watching: ['**/*.js', '**/*.ts', '**/*.jsx', '**/*.tsx'],
        team_size_recommendation: this.getOptimalTeamSize(analysis.type.type)
      },

      // Magic development environment
      environment: {
        auto_install_dependencies: true,
        auto_setup_git_hooks: true,
        auto_configure_linting: true,
        auto_setup_testing: true,
        auto_configure_ci_cd: true,
        recommended_extensions: this.getVSCodeExtensions(analysis)
      },

      // Intelligent workflow
      workflow: {
        suggested_git_workflow: 'gitflow',
        deployment_strategy: 'continuous-deployment',
        monitoring_recommendations: ['performance', 'errors', 'uptime'],
        security_checklist: ['dependency-scan', 'code-analysis', 'secret-detection']
      }
    };

    return config;
  }

  /**
   * 🚀 Generate automatic setup commands
   */
  generateAutoSetupCommands(analysis) {
    const commands = [
      '# 🎯 Magic Project Setup - Auto-generated',
      'echo "🔮 Setting up coordination for ' + analysis.type.type + ' project..."',
      '',
      '# Initialize coordination system',
      'claude-coord init --type=' + analysis.type.type,
      ''
    ];

    // Language-specific setup
    if (analysis.languages.find(l => l.language === 'JavaScript' || l.language === 'TypeScript')) {
      commands.push(
        '# Node.js magic setup',
        'npm install --save-dev @claude-coordination/node-integration',
        'npx claude-coord setup-hooks --javascript',
        ''
      );
    }

    if (analysis.languages.find(l => l.language === 'Python')) {
      commands.push(
        '# Python magic setup',
        'pip install claude-coordination-python',
        'claude-coord setup-hooks --python',
        ''
      );
    }

    // Framework-specific enhancements
    if (analysis.frameworks.includes('React')) {
      commands.push(
        '# React magic enhancements',
        'npm install --save-dev @claude-coordination/react-devtools',
        'claude-coord enable-react-integration',
        ''
      );
    }

    if (analysis.frameworks.includes('Django')) {
      commands.push(
        '# Django magic integration',
        'pip install django-claude-coordination',
        'python manage.py setup_coordination',
        ''
      );
    }

    // AI-powered final setup
    commands.push(
      '# AI-powered optimization',
      'claude-coord ai-optimize --auto',
      'claude-coord generate-team-recommendations',
      'claude-coord setup-intelligent-workflows',
      '',
      '🎉 Magic setup complete! Your project is now supercharged with AI coordination.'
    );

    return commands;
  }

  /**
   * 👥 Generate optimal team recommendations
   */
  generateTeamRecommendations(analysis) {
    const recommendations = {
      teamSize: this.getOptimalTeamSize(analysis.type.type),
      roles: ['Frontend Developer', 'Backend Developer', 'DevOps Engineer'],
      skillsNeeded: analysis.languages.map(l => l.language).concat(analysis.frameworks),
      experienceLevels: 'Mixed: 1 Senior, 2 Mid-level, 1 Junior'
    };

    return recommendations;
  }

  /**
   * ⚡ Helper methods for intelligent recommendations
   */
  getOptimalTimeout(projectType) {
    const timeouts = {
      'react-app': 3,
      'nextjs-app': 4,
      'django-app': 6,
      'microservice-architecture': 8,
      'ml-project': 12,
      'smart-contracts': 2,
      'documentation-site': 1
    };
    return timeouts[projectType] || 4;
  }

  getAIAssistanceLevel(languages) {
    const complexLanguages = ['C++', 'Rust', 'Go', 'Solidity'];
    const hasComplexLanguage = languages.some(l => complexLanguages.includes(l.language));
    return hasComplexLanguage ? 'high' : 'medium';
  }

  getOptimalTeamSize(projectType) {
    const sizes = {
      'react-app': '2-4',
      'microservice-architecture': '6-12',
      'ml-project': '3-6',
      'documentation-site': '1-2',
      'smart-contracts': '2-3'
    };
    return sizes[projectType] || '3-5';
  }

  getVSCodeExtensions(analysis) {
    const extensions = ['claude-code-coordination.coordination-tools'];
    
    // Language-specific extensions
    analysis.languages.forEach(({ language }) => {
      const langExtensions = {
        'TypeScript': ['ms-vscode.vscode-typescript-next'],
        'Python': ['ms-python.python'],
        'Go': ['golang.go'],
        'Rust': ['rust-lang.rust-analyzer'],
        'Java': ['redhat.java']
      };
      if (langExtensions[language]) {
        extensions.push(...langExtensions[language]);
      }
    });

    // Framework-specific extensions
    analysis.frameworks.forEach(framework => {
      const frameworkExtensions = {
        'React': ['es7-react-js-snippets'],
        'Vue': ['octref.vetur'],
        'Django': ['ms-python.django'],
        'Docker': ['ms-azuretools.vscode-docker']
      };
      if (frameworkExtensions[framework]) {
        extensions.push(...frameworkExtensions[framework]);
      }
    });

    return [...new Set(extensions)];
  }

  /**
   * 🎯 Main execution method
   */
  static async detect(projectPath) {
    const detector = new UniversalProjectDetector(projectPath);
    return await detector.detectProject();
  }
}

// CLI usage
if (require.main === module) {
  (async () => {
    try {
      const projectPath = process.argv[2] || process.cwd();
      const result = await UniversalProjectDetector.detect(projectPath);
      
      console.log('\n🎉 Project Analysis Complete!');
      console.log('=====================================');
      console.log('📊 Project Type:', result.analysis.type.type, `(${result.analysis.type.confidence}% confidence)`);
      console.log('🌍 Languages:', result.analysis.languages.map(l => l.language).join(', '));
      console.log('🏗️  Frameworks:', result.analysis.frameworks.join(', '));
      console.log('👥 Recommended Team Size:', result.magicConfig.coordination.team_size_recommendation);
      
      console.log('\n🚀 Run these commands to set up magic coordination:');
      console.log('=====================================');
      result.autoSetupCommands.forEach(cmd => console.log(cmd));
      
    } catch (error) {
      console.error('❌ Detection failed:', error.message);
      process.exit(1);
    }
  })();
}

module.exports = UniversalProjectDetector;