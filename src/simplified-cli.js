#!/usr/bin/env node

/**
 * 🎯 Simplified Magic CLI - Ultra-Easy Development Interface
 * One command to rule them all - zero configuration required
 */

const MagicCLI = require('./magic-cli');

class SimplifiedMagicCLI extends MagicCLI {
    constructor() {
        super();
        this.setupSimplifiedCommands();
        this.setupProjectTemplates();
        this.setupSmartEnhancer();
    }
    
    /**
     * 🎨 Setup ultra-simple command structure
     */
    setupSimplifiedCommands() {
        // Replace complex commands with simple ones
        const originalCommands = this.commands;
        
        this.commands = {
            // 🚀 Main command - handles everything
            'create': {
                description: '🚀 Create any project from description or template',
                usage: 'magic create [template|"description"]',
                examples: [
                    'magic create todoapp',
                    'magic create "blog with comments"',
                    'magic create ecommerce'
                ],
                action: this.createProject.bind(this)
            },
            
            // ✨ Quick templates
            'todoapp': {
                description: '✅ Create a todo application instantly',
                action: () => this.createFromTemplate('todo-app')
            },
            
            'ecommerce': {
                description: '🛒 Create an e-commerce store instantly',
                action: () => this.createFromTemplate('ecommerce-store')
            },
            
            'blog': {
                description: '📝 Create a blog platform instantly',
                action: () => this.createFromTemplate('blog-platform')
            },
            
            'portfolio': {
                description: '💼 Create a portfolio website instantly',
                action: () => this.createFromTemplate('portfolio-pro')
            },
            
            'chat': {
                description: '💬 Create a chat application instantly',
                action: () => this.createFromTemplate('chat-app')
            },
            
            'startup': {
                description: '🚀 Create a startup MVP instantly',
                action: () => this.createFromTemplate('startup-mvp')
            },
            
            // 🎮 Utility commands
            'demo': {
                description: '🎮 Try the system with interactive demo',
                action: this.runInteractiveDemo.bind(this)
            },
            
            'templates': {
                description: '🎨 Browse all available project templates',
                action: this.showTemplateGallery.bind(this)
            },
            
            'status': {
                description: '📊 Show system status and capabilities',
                action: this.showSimplifiedStatus.bind(this)
            },
            
            'setup': {
                description: '⚙️ Run guided first-time setup',
                action: this.runGuidedSetup.bind(this)
            },
            
            // 🔧 Advanced commands (hidden by default)
            'advanced': {
                description: '🔧 Access advanced features',
                action: this.showAdvancedCommands.bind(this),
                hidden: true
            }
        };
        
        // Keep advanced commands available but hidden
        this.advancedCommands = originalCommands;
    }
    
    /**
     * 🎨 Setup project templates for instant creation
     */
    setupProjectTemplates() {
        this.projectTemplates = {
            'todo-app': {
                name: 'Todo Application',
                description: 'Perfect for learning - task management with user auth',
                icon: '✅',
                features: ['User authentication', 'Task CRUD', 'Real-time updates', 'Responsive design'],
                estimatedTime: '5-10 minutes',
                complexity: 'Beginner',
                tags: ['todo', 'task', 'productivity', 'learning'],
                prompt: 'Create a modern todo application with user authentication, task management (create, read, update, delete), real-time synchronization, responsive design, and clean UI. Include user registration, login, password reset, task categories, due dates, and basic analytics.',
                technologies: {
                    frontend: 'React + TypeScript',
                    backend: 'Node.js + Express', 
                    database: 'PostgreSQL',
                    auth: 'JWT',
                    styling: 'Tailwind CSS'
                }
            },
            
            'ecommerce-store': {
                name: 'E-Commerce Store',
                description: 'Full-featured online store with payments',
                icon: '🛒',
                features: ['Product catalog', 'Shopping cart', 'Stripe payments', 'Admin dashboard'],
                estimatedTime: '15-25 minutes',
                complexity: 'Intermediate',
                tags: ['ecommerce', 'shop', 'store', 'payment', 'business'],
                prompt: 'Build a complete e-commerce platform with product catalog, search and filters, shopping cart, secure checkout with Stripe payment processing, user accounts, order management, inventory tracking, admin dashboard, and responsive design. Include product reviews, wishlist, and basic analytics.',
                technologies: {
                    frontend: 'Next.js + TypeScript',
                    backend: 'Node.js + Express',
                    database: 'PostgreSQL',
                    payment: 'Stripe',
                    auth: 'NextAuth.js',
                    styling: 'Tailwind CSS'
                }
            },
            
            'blog-platform': {
                name: 'Blog Platform',
                description: 'Content management with SEO optimization',
                icon: '📝',
                features: ['Content management', 'SEO optimized', 'Comments', 'Analytics'],
                estimatedTime: '10-15 minutes',
                complexity: 'Beginner',
                tags: ['blog', 'cms', 'content', 'seo', 'writing'],
                prompt: 'Develop a modern blog platform with content management system, rich text editor, SEO optimization, comment system, user authentication, post scheduling, categories and tags, search functionality, responsive design, and analytics integration.',
                technologies: {
                    frontend: 'Next.js + TypeScript',
                    backend: 'Node.js + Express',
                    database: 'PostgreSQL',
                    cms: 'Headless CMS integration',
                    styling: 'Tailwind CSS'
                }
            },
            
            'portfolio-pro': {
                name: 'Professional Portfolio',
                description: 'Showcase your work with style and performance',
                icon: '💼',
                features: ['Project showcase', 'Contact form', 'SEO optimized', 'Fast loading'],
                estimatedTime: '8-12 minutes',
                complexity: 'Beginner',
                tags: ['portfolio', 'showcase', 'personal', 'professional'],
                prompt: 'Create a professional portfolio website with project showcase, skills section, about page, contact form, blog integration, SEO optimization, responsive design, dark/light theme, smooth animations, and performance optimization.',
                technologies: {
                    frontend: 'Next.js + TypeScript',
                    styling: 'Tailwind CSS + Framer Motion',
                    deployment: 'Vercel',
                    cms: 'Content management for projects'
                }
            },
            
            'chat-app': {
                name: 'Real-time Chat App',
                description: 'Modern chat with video calls and file sharing',
                icon: '💬',
                features: ['Real-time messaging', 'Video calls', 'File sharing', 'Group chats'],
                estimatedTime: '20-30 minutes',
                complexity: 'Advanced',
                tags: ['chat', 'messaging', 'realtime', 'websocket', 'communication'],
                prompt: 'Create a real-time chat application with WebSocket communication, private and group chats, file sharing, emoji support, message reactions, user presence indicators, video/audio calls, message history, push notifications, and responsive design.',
                technologies: {
                    frontend: 'React + TypeScript',
                    backend: 'Node.js + Socket.io',
                    database: 'PostgreSQL + Redis',
                    realtime: 'WebSocket',
                    media: 'WebRTC for video calls'
                }
            },
            
            'startup-mvp': {
                name: 'Startup MVP',
                description: 'Minimum viable product for rapid validation',
                icon: '🚀',
                features: ['Landing page', 'User auth', 'Core feature', 'Analytics'],
                estimatedTime: '12-18 minutes',
                complexity: 'Intermediate',
                tags: ['startup', 'mvp', 'business', 'validation', 'launch'],
                prompt: 'Build a startup MVP with compelling landing page, user authentication, core product feature, user dashboard, basic analytics, email notifications, payment integration (if needed), feedback collection, and responsive design optimized for conversion.',
                technologies: {
                    frontend: 'Next.js + TypeScript',
                    backend: 'Node.js + Express',
                    database: 'PostgreSQL',
                    analytics: 'Google Analytics',
                    auth: 'NextAuth.js'
                }
            }
        };
    }
    
    /**
     * 🧠 Setup smart input enhancement
     */
    setupSmartEnhancer() {
        this.commonPatterns = {
            // Short inputs that need enhancement
            'todo': 'todo-app',
            'shop': 'ecommerce-store', 
            'store': 'ecommerce-store',
            'blog': 'blog-platform',
            'portfolio': 'portfolio-pro',
            'chat': 'chat-app',
            'messaging': 'chat-app',
            'startup': 'startup-mvp',
            'mvp': 'startup-mvp'
        };
        
        this.autoEnhancements = [
            'with modern responsive design',
            'including user authentication',
            'optimized for performance and SEO',
            'following security best practices',
            'with clean, professional UI'
        ];
    }
    
    /**
     * 🚀 Main create command - handles everything
     */
    async createProject(args) {
        const input = args.join(' ').trim();
        
        if (!input) {
            return await this.showInteractiveCreator();
        }
        
        // Check if it's a template shortcut
        if (this.projectTemplates[input] || this.commonPatterns[input.toLowerCase()]) {
            const templateId = this.projectTemplates[input] ? input : this.commonPatterns[input.toLowerCase()];
            return await this.createFromTemplate(templateId);
        }
        
        // Enhance short/vague inputs
        const enhanced = this.enhanceUserInput(input);
        
        if (enhanced.suggestion) {
            console.log(`💡 Did you mean: ${enhanced.suggestion.name}?`);
            console.log(`   ${enhanced.suggestion.description}`);
            console.log(`   Estimated time: ${enhanced.suggestion.estimatedTime}\n`);
            
            const confirm = await this.promptUser('Use this template? (y/n): ');
            if (confirm.toLowerCase().startsWith('y')) {
                return await this.createFromTemplate(enhanced.suggestion.id);
            }
        }
        
        if (enhanced.autoEnhanced) {
            console.log(`🎯 Enhanced description: "${enhanced.enhanced}"\n`);
        }
        
        // Build custom project
        console.log('🏗️  Building your custom project...\n');
        return await this.orchestrator.buildProject(enhanced.enhanced, {
            showProgress: true,
            autoEnhanced: enhanced.autoEnhanced
        });
    }
    
    /**
     * 🎨 Interactive project creator
     */
    async showInteractiveCreator() {
        console.log('\n🎨 Welcome to the AI Project Creator!\n');
        console.log('What would you like to build today?\n');
        
        // Show template gallery
        const templates = Object.entries(this.projectTemplates);
        templates.forEach(([id, template], index) => {
            console.log(`${index + 1}. ${template.icon} ${template.name}`);
            console.log(`   ${template.description}`);
            console.log(`   ⏱️  ${template.estimatedTime} • 🎯 ${template.complexity}`);
            console.log(`   Features: ${template.features.join(', ')}\n`);
        });
        
        console.log(`${templates.length + 1}. ✍️  Describe a custom project\n`);
        
        const choice = await this.promptUser('Enter your choice (number or description): ');
        
        // Handle numeric choice
        if (!isNaN(choice) && choice > 0 && choice <= templates.length) {
            const [templateId] = templates[parseInt(choice) - 1];
            return await this.createFromTemplate(templateId);
        }
        
        // Handle custom project option
        if (choice == templates.length + 1) {
            const description = await this.promptUser('Describe your project: ');
            return await this.createProject([description]);
        }
        
        // Handle direct description
        return await this.createProject([choice]);
    }
    
    /**
     * 🎯 Create from predefined template
     */
    async createFromTemplate(templateId) {
        const template = this.projectTemplates[templateId];
        if (!template) {
            console.log(`❌ Template '${templateId}' not found`);
            return await this.showTemplateGallery();
        }
        
        console.log(`\n🚀 Creating ${template.name}...\n`);
        console.log(`📝 ${template.description}`);
        console.log(`⏱️  Estimated time: ${template.estimatedTime}`);
        console.log(`🔧 Technologies: ${Object.values(template.technologies).join(', ')}\n`);
        
        // Show what will be built
        console.log('📦 Features included:');
        template.features.forEach(feature => console.log(`   ✅ ${feature}`));
        console.log('');
        
        try {
            const result = await this.orchestrator.buildProject(template.prompt, {
                templateId,
                technologies: template.technologies,
                showProgress: true,
                complexity: template.complexity.toLowerCase()
            });
            
            console.log(`\n🎉 Your ${template.name} is ready!\n`);
            
            if (result.artifacts) {
                console.log('📁 Generated files:');
                console.log(`   Repository: ${result.artifacts.codeRepository}`);
                console.log(`   Documentation: ${result.artifacts.documentation}`);
                
                if (result.artifacts.deploymentUrl) {
                    console.log(`   🌐 Live preview: ${result.artifacts.deploymentUrl}`);
                }
            }
            
            console.log(`\n⏱️  Built in ${Math.round(result.actualHours * 60)} minutes`);
            console.log(`🏆 Quality score: ${Math.round(result.qualityScore * 100)}%`);
            console.log(`\n💡 Try creating something else: magic create "your idea"`);
            
            return result;
            
        } catch (error) {
            console.error(`❌ Failed to create ${template.name}: ${error.message}`);
            console.log('\n🔧 Try the demo mode: magic demo');
        }
    }
    
    /**
     * 🧠 Smart input enhancement
     */
    enhanceUserInput(input) {
        const lowerInput = input.toLowerCase().trim();
        
        // Check for template suggestions
        for (const [id, template] of Object.entries(this.projectTemplates)) {
            const matchScore = this.calculateTemplateMatch(lowerInput, template);
            if (matchScore > 0.7) {
                return {
                    original: input,
                    enhanced: input,
                    suggestion: { id, ...template },
                    autoEnhanced: false
                };
            }
        }
        
        // Enhance short inputs
        if (input.length < 20) {
            const enhanced = input + '. ' + this.autoEnhancements.join(', ') + '.';
            return {
                original: input,
                enhanced: enhanced,
                autoEnhanced: true
            };
        }
        
        return {
            original: input,
            enhanced: input,
            autoEnhanced: false
        };
    }
    
    /**
     * 📊 Calculate template match score
     */
    calculateTemplateMatch(input, template) {
        let score = 0;
        
        // Check tags
        template.tags.forEach(tag => {
            if (input.includes(tag)) score += 0.3;
        });
        
        // Check name
        if (input.includes(template.name.toLowerCase())) score += 0.5;
        
        // Check description words
        const descWords = template.description.toLowerCase().split(' ');
        const inputWords = input.split(' ');
        const commonWords = descWords.filter(word => inputWords.includes(word));
        score += (commonWords.length / descWords.length) * 0.4;
        
        return Math.min(score, 1.0);
    }
    
    /**
     * 🎮 Interactive demo mode
     */
    async runInteractiveDemo() {
        console.log('\n🎮 Welcome to the Interactive Demo!\n');
        
        // Enable simulation mode for demo
        this.orchestrator.enableDemoMode();
        this.aiApiManager.enableSimulationMode({
            claude: true,
            gpt4: true,
            responseDelay: 800 // Fast demo responses
        });
        
        console.log('🤖 AI services: Demo mode (no API keys needed)');
        console.log('⚡ Super fast responses for demonstration\n');
        
        console.log('Let\'s build a sample project together!\n');
        
        const demoProjects = [
            { name: 'Quick Todo App', id: 'todo-app', time: '2 minutes' },
            { name: 'Simple Blog', id: 'blog-platform', time: '3 minutes' },
            { name: 'Portfolio Site', id: 'portfolio-pro', time: '2 minutes' }
        ];
        
        console.log('Choose a demo project:');
        demoProjects.forEach((project, index) => {
            console.log(`${index + 1}. ${project.name} (${project.time})`);
        });
        
        const choice = await this.promptUser('\nYour choice (1-3): ');
        const selectedProject = demoProjects[parseInt(choice) - 1];
        
        if (selectedProject) {
            console.log(`\n🚀 Demo: Building ${selectedProject.name} in fast-forward mode...\n`);
            return await this.createFromTemplate(selectedProject.id);
        } else {
            console.log('Invalid choice, building todo app demo...');
            return await this.createFromTemplate('todo-app');
        }
    }
    
    /**
     * 🎨 Show template gallery
     */
    async showTemplateGallery() {
        console.log('\n🎨 Project Template Gallery\n');
        console.log('='.repeat(50));
        
        Object.entries(this.projectTemplates).forEach(([id, template]) => {
            console.log(`\n${template.icon} ${template.name}`);
            console.log(`Description: ${template.description}`);
            console.log(`Complexity: ${template.complexity}`);
            console.log(`Time: ${template.estimatedTime}`);
            console.log(`Command: magic create ${id}`);
            console.log(`Features: ${template.features.join(', ')}`);
        });
        
        console.log('\n' + '='.repeat(50));
        console.log('💡 Usage: magic create [template-name] or magic create "custom description"');
    }
    
    /**
     * 📊 Simplified status display
     */
    async showSimplifiedStatus() {
        console.log('\n📊 System Status\n');
        
        const status = {
            system: '✅ Ready',
            aiServices: await this.checkAIServicesSimple(),
            templatesAvailable: Object.keys(this.projectTemplates).length,
            recentBuilds: 0 // TODO: Track this
        };
        
        console.log(`System: ${status.system}`);
        console.log(`AI Services: ${status.aiServices}`);
        console.log(`Templates Available: ${status.templatesAvailable}`);
        console.log(`\n💡 Try: magic create todoapp`);
    }
    
    async checkAIServicesSimple() {
        try {
            const servicesStatus = this.aiApiManager.getServicesStatus();
            if (servicesStatus.healthy > 0) {
                return `✅ ${servicesStatus.healthy} healthy`;
            } else {
                return '🎮 Demo mode (no API keys)';
            }
        } catch {
            return '🎮 Demo mode enabled';
        }
    }
    
    /**
     * ⚙️ Guided first-time setup
     */
    async runGuidedSetup() {
        console.log('\n⚙️ Welcome to Magic AI Development!\n');
        console.log('Let me help you get started...\n');
        
        // 1. Check environment
        console.log('🔍 Checking your environment...');
        const nodeVersion = process.version;
        console.log(`✅ Node.js ${nodeVersion} detected\n`);
        
        // 2. Check API keys
        const hasKeys = process.env.ANTHROPIC_API_KEY || process.env.OPENAI_API_KEY;
        if (hasKeys) {
            console.log('🔑 API keys found - Full AI power available!');
        } else {
            console.log('🎮 No API keys - Demo mode enabled (fully functional for testing)');
            console.log('💡 Add API keys later for production use\n');
        }
        
        // 3. Quick capability test
        console.log('🧪 Testing system capabilities...');
        try {
            await this.orchestrator.performHealthCheck();
            console.log('✅ All systems ready!\n');
        } catch (error) {
            console.log('⚠️  Some features limited - demo mode active\n');
        }
        
        // 4. Show quick tutorial
        console.log('🚀 Quick Tutorial:\n');
        console.log('• Create instant projects: magic create todoapp');
        console.log('• Custom projects: magic create "your idea"');
        console.log('• Browse templates: magic templates');
        console.log('• Try demo: magic demo\n');
        
        console.log('Ready to create your first project? (y/n)');
        const ready = await this.promptUser('> ');
        
        if (ready.toLowerCase().startsWith('y')) {
            return await this.showInteractiveCreator();
        }
        
        console.log('\n✅ Setup complete! Run "magic create" when ready.');
    }
    
    /**
     * 🔧 Show advanced commands (hidden by default)
     */
    showAdvancedCommands() {
        console.log('\n🔧 Advanced Commands\n');
        console.log('For power users who need more control:\n');
        
        Object.entries(this.advancedCommands).forEach(([cmd, info]) => {
            console.log(`${cmd.padEnd(20)} ${info.description}`);
        });
        
        console.log('\n💡 Most users only need: magic create "project description"');
        console.log('📚 Full docs: magic help\n');
    }
    
    /**
     * 🎯 Enhanced help display
     */
    showHelp() {
        console.log(`
🚀 Magic AI Development System v${this.version}
================================================

SIMPLE COMMANDS (Start here!):
  create [template|"description"]  🚀 Create any project instantly
  todoapp                         ✅ Quick todo application  
  ecommerce                       🛒 Quick e-commerce store
  blog                           📝 Quick blog platform
  portfolio                      💼 Quick portfolio site
  
UTILITY COMMANDS:
  demo                           🎮 Interactive demo (no setup needed)
  templates                      🎨 Browse project templates
  setup                         ⚙️ Guided first-time setup
  status                        📊 System status

EXAMPLES:
  magic create todoapp                    # Instant todo app
  magic create "fitness tracking app"    # Custom project
  magic demo                             # Try without setup
  magic templates                        # See all options

GETTING STARTED:
  1. Run: magic setup        (guided setup)
  2. Run: magic demo         (try it out)  
  3. Run: magic create       (build something)

💡 Need help? Most projects can be created with just:
   magic create "describe what you want to build"

🚀 Let AI do the heavy lifting - you focus on the ideas!
`);
    }
    
    /**
     * 🎯 Simple prompt helper
     */
    async promptUser(question) {
        return new Promise((resolve) => {
            process.stdout.write(question);
            process.stdin.once('data', (data) => {
                resolve(data.toString().trim());
            });
        });
    }
}

// Export and CLI execution
module.exports = SimplifiedMagicCLI;

if (require.main === module) {
    const cli = new SimplifiedMagicCLI();
    cli.run().catch(error => {
        console.error('❌ Error:', error.message);
        console.log('\n💡 Try: magic demo (for testing without setup)');
        process.exit(1);
    });
}