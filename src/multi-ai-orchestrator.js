#!/usr/bin/env node

/**
 * Multi-AI Orchestrator v1.0
 * Revolutionary autonomous AI team coordination system
 * Builds on Claude Code Coordination foundation
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');
const EventEmitter = require('events');
const AICoordinator = require('./ai-coordinator.js');

class MultiAIOrchestrator extends EventEmitter {
    constructor(coordinationDir = '.claude-coordination') {
        super();
        
        this.coordinationDir = path.resolve(coordinationDir);
        this.aiCoordinator = new AICoordinator(coordinationDir);
        this.orchestratorStateFile = path.join(this.coordinationDir, 'orchestrator-state.json');
        
        // Multi-AI service registry
        this.aiServices = new Map();
        this.activeProjects = new Map();
        this.taskQueue = [];
        this.completedTasks = new Map();
        
        // AI specialization mappings
        this.aiSpecializations = {
            'claude-code': {
                strengths: ['frontend', 'react', 'typescript', 'ui-ux', 'coordination'],
                preferredTasks: ['component-creation', 'ui-implementation', 'code-review'],
                maxConcurrentTasks: 3,
                averageResponseTime: 2000, // ms
                qualityScore: 0.95
            },
            'openai-gpt4': {
                strengths: ['backend', 'api-design', 'database', 'architecture', 'documentation'],
                preferredTasks: ['api-development', 'system-design', 'database-schema'],
                maxConcurrentTasks: 4,
                averageResponseTime: 1500,
                qualityScore: 0.92
            },
            'anthropic-claude': {
                strengths: ['analysis', 'planning', 'testing', 'optimization', 'security'],
                preferredTasks: ['code-analysis', 'test-generation', 'security-audit'],
                maxConcurrentTasks: 2,
                averageResponseTime: 1800,
                qualityScore: 0.94
            },
            'specialized-devops': {
                strengths: ['deployment', 'ci-cd', 'docker', 'kubernetes', 'monitoring'],
                preferredTasks: ['deployment-setup', 'pipeline-creation', 'infrastructure'],
                maxConcurrentTasks: 2,
                averageResponseTime: 3000,
                qualityScore: 0.90
            }
        };
        
        // Project types and their optimal AI team compositions
        this.projectTemplates = {
            'web-app': {
                requiredRoles: ['frontend', 'backend', 'database'],
                optimalTeam: ['claude-code', 'openai-gpt4', 'anthropic-claude'],
                estimatedHours: 8,
                complexity: 0.7
            },
            'mobile-app': {
                requiredRoles: ['frontend', 'backend', 'api'],
                optimalTeam: ['claude-code', 'openai-gpt4'],
                estimatedHours: 12,
                complexity: 0.8
            },
            'api-service': {
                requiredRoles: ['backend', 'database', 'testing'],
                optimalTeam: ['openai-gpt4', 'anthropic-claude'],
                estimatedHours: 6,
                complexity: 0.6
            },
            'e-commerce': {
                requiredRoles: ['frontend', 'backend', 'database', 'payment', 'security'],
                optimalTeam: ['claude-code', 'openai-gpt4', 'anthropic-claude', 'specialized-devops'],
                estimatedHours: 20,
                complexity: 0.9
            }
        };
        
        // Load existing state
        this.orchestratorState = this.loadOrchestratorState();
        
        this.setupEventHandlers();
        
        console.log('🚀 Multi-AI Orchestrator initialized');
        console.log(`📊 Available AI services: ${this.aiServices.size}`);
        console.log(`🎯 Active projects: ${this.activeProjects.size}`);
    }

    /**
     * MAIN ENTRY POINT: Build project from description
     */
    async buildProject(description, options = {}) {
        try {
            console.log(`\n🎯 Starting autonomous project build: "${description}"`);
            
            // Phase 1: Parse project description
            const projectSpec = await this.parseProjectDescription(description);
            console.log(`📋 Project parsed: ${projectSpec.type} (complexity: ${projectSpec.complexity})`);
            
            // Phase 2: Assemble optimal AI team
            const aiTeam = await this.assembleOptimalTeam(projectSpec);
            console.log(`🤖 AI team assembled: ${aiTeam.map(ai => ai.id).join(', ')}`);
            
            // Phase 3: Create project coordination
            const projectId = this.createProjectCoordination(projectSpec, aiTeam);
            
            // Phase 4: Orchestrate team work
            const result = await this.orchestrateTeamWork(projectId, projectSpec, aiTeam);
            
            console.log(`✅ Project "${description}" completed successfully!`);
            return result;
            
        } catch (error) {
            console.error('❌ Project build failed:', error.message);
            throw error;
        }
    }

    /**
     * Parse natural language project description into structured specification
     */
    async parseProjectDescription(description) {
        const projectSpec = {
            id: crypto.randomUUID(),
            originalDescription: description,
            timestamp: Date.now(),
            type: this.identifyProjectType(description),
            requirements: this.extractRequirements(description),
            technologies: this.suggestTechnologies(description),
            complexity: this.assessComplexity(description),
            estimatedHours: 0,
            tasks: []
        };

        // Generate detailed tasks based on project type
        projectSpec.tasks = this.generateTasks(projectSpec);
        projectSpec.estimatedHours = this.estimateProjectHours(projectSpec);

        return projectSpec;
    }

    /**
     * Identify project type from description using NLP patterns
     */
    identifyProjectType(description) {
        const desc = description.toLowerCase();
        
        const patterns = {
            'e-commerce': ['shop', 'store', 'ecommerce', 'e-commerce', 'buy', 'sell', 'cart', 'payment'],
            'web-app': ['website', 'web app', 'webapp', 'web application', 'dashboard', 'admin panel'],
            'mobile-app': ['mobile', 'app', 'ios', 'android', 'react native', 'flutter'],
            'api-service': ['api', 'service', 'microservice', 'endpoint', 'rest api', 'graphql'],
            'blog': ['blog', 'cms', 'content management', 'articles', 'posts'],
            'todo-app': ['todo', 'task', 'productivity', 'checklist', 'reminders'],
            'chat-app': ['chat', 'messaging', 'communication', 'real-time', 'websocket'],
            'social-media': ['social', 'network', 'feed', 'posts', 'followers', 'likes']
        };

        for (const [type, keywords] of Object.entries(patterns)) {
            if (keywords.some(keyword => desc.includes(keyword))) {
                return type;
            }
        }

        return 'web-app'; // default
    }

    /**
     * Extract functional requirements from description
     */
    extractRequirements(description) {
        const requirements = [];
        const desc = description.toLowerCase();

        const requirementPatterns = {
            'user-authentication': ['login', 'register', 'auth', 'sign up', 'sign in', 'authentication'],
            'database': ['store', 'save', 'database', 'data', 'persistent'],
            'real-time': ['real-time', 'live', 'instant', 'websocket', 'socket.io'],
            'responsive': ['responsive', 'mobile', 'tablet', 'device'],
            'admin-panel': ['admin', 'dashboard', 'management', 'control panel'],
            'payment': ['payment', 'stripe', 'paypal', 'checkout', 'billing'],
            'email': ['email', 'notification', 'send', 'smtp'],
            'file-upload': ['upload', 'file', 'image', 'document'],
            'search': ['search', 'filter', 'find', 'query'],
            'api': ['api', 'rest', 'graphql', 'endpoint']
        };

        for (const [req, keywords] of Object.entries(requirementPatterns)) {
            if (keywords.some(keyword => desc.includes(keyword))) {
                requirements.push(req);
            }
        }

        return requirements;
    }

    /**
     * Suggest optimal technology stack
     */
    suggestTechnologies(description) {
        const projectType = this.identifyProjectType(description);
        const requirements = this.extractRequirements(description);

        const techStacks = {
            'web-app': {
                frontend: 'React + TypeScript',
                backend: 'Node.js + Express',
                database: 'PostgreSQL',
                styling: 'Tailwind CSS'
            },
            'e-commerce': {
                frontend: 'Next.js + TypeScript',
                backend: 'Node.js + Express',
                database: 'PostgreSQL',
                payment: 'Stripe',
                auth: 'NextAuth.js'
            },
            'mobile-app': {
                framework: 'React Native',
                state: 'Redux Toolkit',
                navigation: 'React Navigation',
                backend: 'Node.js + Express'
            },
            'api-service': {
                framework: 'Express.js',
                database: 'PostgreSQL',
                validation: 'Joi',
                documentation: 'Swagger'
            }
        };

        return techStacks[projectType] || techStacks['web-app'];
    }

    /**
     * Assess project complexity (0.1 - 1.0)
     */
    assessComplexity(description) {
        const requirements = this.extractRequirements(description);
        const complexityWeights = {
            'user-authentication': 0.2,
            'payment': 0.3,
            'real-time': 0.25,
            'admin-panel': 0.15,
            'file-upload': 0.1,
            'email': 0.1,
            'api': 0.2,
            'database': 0.15
        };

        let complexity = 0.3; // base complexity
        requirements.forEach(req => {
            complexity += complexityWeights[req] || 0.1;
        });

        return Math.min(complexity, 1.0);
    }

    /**
     * Generate specific tasks for the project
     */
    generateTasks(projectSpec) {
        const tasks = [];
        const { type, requirements } = projectSpec;

        // Base tasks for all projects
        tasks.push(
            { id: crypto.randomUUID(), type: 'planning', title: 'Project Architecture Planning', priority: 1, estimatedHours: 1 },
            { id: crypto.randomUUID(), type: 'setup', title: 'Development Environment Setup', priority: 2, estimatedHours: 0.5 }
        );

        // Frontend tasks
        if (['web-app', 'e-commerce', 'blog'].includes(type)) {
            tasks.push(
                { id: crypto.randomUUID(), type: 'frontend', title: 'React Application Setup', priority: 3, estimatedHours: 1 },
                { id: crypto.randomUUID(), type: 'frontend', title: 'UI Components Creation', priority: 4, estimatedHours: 3 },
                { id: crypto.randomUUID(), type: 'frontend', title: 'Responsive Design Implementation', priority: 5, estimatedHours: 2 }
            );
        }

        // Backend tasks
        if (requirements.includes('database') || ['web-app', 'e-commerce', 'api-service'].includes(type)) {
            tasks.push(
                { id: crypto.randomUUID(), type: 'backend', title: 'API Server Setup', priority: 3, estimatedHours: 1.5 },
                { id: crypto.randomUUID(), type: 'backend', title: 'Database Schema Design', priority: 4, estimatedHours: 1 },
                { id: crypto.randomUUID(), type: 'backend', title: 'API Endpoints Implementation', priority: 5, estimatedHours: 2.5 }
            );
        }

        // Authentication tasks
        if (requirements.includes('user-authentication')) {
            tasks.push(
                { id: crypto.randomUUID(), type: 'auth', title: 'Authentication System Setup', priority: 6, estimatedHours: 2 },
                { id: crypto.randomUUID(), type: 'frontend', title: 'Login/Register UI', priority: 7, estimatedHours: 1.5 }
            );
        }

        // Payment tasks
        if (requirements.includes('payment')) {
            tasks.push(
                { id: crypto.randomUUID(), type: 'payment', title: 'Payment Integration (Stripe)', priority: 8, estimatedHours: 3 },
                { id: crypto.randomUUID(), type: 'frontend', title: 'Checkout UI Implementation', priority: 9, estimatedHours: 2 }
            );
        }

        // Testing and deployment
        tasks.push(
            { id: crypto.randomUUID(), type: 'testing', title: 'Unit Tests Creation', priority: 10, estimatedHours: 2 },
            { id: crypto.randomUUID(), type: 'deployment', title: 'Production Deployment Setup', priority: 11, estimatedHours: 1.5 }
        );

        return tasks.sort((a, b) => a.priority - b.priority);
    }

    /**
     * Estimate total project hours
     */
    estimateProjectHours(projectSpec) {
        return projectSpec.tasks.reduce((total, task) => total + task.estimatedHours, 0);
    }

    /**
     * Assemble optimal AI team for the project
     */
    async assembleOptimalTeam(projectSpec) {
        const requiredSkills = this.identifyRequiredSkills(projectSpec);
        const availableAIs = Array.from(this.aiServices.values());
        
        // If no AIs registered, use default configuration
        if (availableAIs.length === 0) {
            return this.getDefaultAITeam(projectSpec.type);
        }

        const selectedAIs = [];
        const usedAIs = new Set();

        // Select best AI for each required skill
        for (const skill of requiredSkills) {
            const bestAI = this.findBestAIForSkill(skill, availableAIs, usedAIs);
            if (bestAI && !usedAIs.has(bestAI.id)) {
                selectedAIs.push(bestAI);
                usedAIs.add(bestAI.id);
            }
        }

        // Ensure minimum team size of 2
        if (selectedAIs.length < 2) {
            const additionalAIs = availableAIs
                .filter(ai => !usedAIs.has(ai.id))
                .slice(0, 2 - selectedAIs.length);
            selectedAIs.push(...additionalAIs);
        }

        return selectedAIs;
    }

    /**
     * Identify required skills for project
     */
    identifyRequiredSkills(projectSpec) {
        const skills = new Set(['planning']); // Always need planning

        projectSpec.tasks.forEach(task => {
            switch (task.type) {
                case 'frontend':
                    skills.add('frontend');
                    skills.add('react');
                    skills.add('ui-ux');
                    break;
                case 'backend':
                    skills.add('backend');
                    skills.add('api-design');
                    skills.add('database');
                    break;
                case 'auth':
                    skills.add('authentication');
                    skills.add('security');
                    break;
                case 'payment':
                    skills.add('payment-integration');
                    break;
                case 'testing':
                    skills.add('testing');
                    break;
                case 'deployment':
                    skills.add('deployment');
                    skills.add('devops');
                    break;
            }
        });

        return Array.from(skills);
    }

    /**
     * Find best AI for specific skill
     */
    findBestAIForSkill(skill, availableAIs, usedAIs) {
        return availableAIs
            .filter(ai => !usedAIs.has(ai.id))
            .filter(ai => ai.specialization && ai.specialization.strengths.includes(skill))
            .sort((a, b) => {
                const aScore = a.specialization.qualityScore * (1 / a.specialization.averageResponseTime);
                const bScore = b.specialization.qualityScore * (1 / b.specialization.averageResponseTime);
                return bScore - aScore;
            })[0];
    }

    /**
     * Get default AI team composition
     */
    getDefaultAITeam(projectType) {
        const template = this.projectTemplates[projectType] || this.projectTemplates['web-app'];
        return template.optimalTeam.map(aiId => ({
            id: aiId,
            specialization: this.aiSpecializations[aiId],
            status: 'ready'
        }));
    }

    /**
     * Create project coordination structure
     */
    createProjectCoordination(projectSpec, aiTeam) {
        const projectId = projectSpec.id;
        
        this.activeProjects.set(projectId, {
            spec: projectSpec,
            team: aiTeam,
            status: 'active',
            startTime: Date.now(),
            progress: {
                completedTasks: 0,
                totalTasks: projectSpec.tasks.length,
                currentPhase: 'initialization'
            },
            coordination: {
                conflicts: [],
                dependencies: new Map(),
                communications: []
            }
        });

        // Create coordination directory
        const projectDir = path.join(this.coordinationDir, 'projects', projectId);
        fs.mkdirSync(projectDir, { recursive: true });
        
        // Save project specification
        fs.writeFileSync(
            path.join(projectDir, 'project-spec.json'),
            JSON.stringify(projectSpec, null, 2)
        );

        console.log(`📁 Project coordination created: ${projectDir}`);
        return projectId;
    }

    /**
     * Orchestrate autonomous team work
     */
    async orchestrateTeamWork(projectId, projectSpec, aiTeam) {
        const project = this.activeProjects.get(projectId);
        if (!project) throw new Error(`Project ${projectId} not found`);

        console.log(`\n🎵 Starting orchestration for project: ${projectSpec.originalDescription}`);
        
        try {
            // Phase 1: Initialize all AIs with project context
            await this.initializeAITeam(projectId, aiTeam, projectSpec);
            
            // Phase 2: Distribute tasks among team
            await this.distributeTasks(projectId, projectSpec.tasks, aiTeam);
            
            // Phase 3: Monitor and coordinate execution
            await this.monitorExecution(projectId);
            
            // Phase 4: Integration and quality assurance
            await this.performQualityAssurance(projectId);
            
            project.status = 'completed';
            project.completionTime = Date.now();
            
            const result = this.generateProjectResult(project);
            console.log(`🎉 Project orchestration completed successfully!`);
            
            return result;
            
        } catch (error) {
            project.status = 'failed';
            project.error = error.message;
            console.error(`❌ Orchestration failed: ${error.message}`);
            throw error;
        }
    }

    /**
     * Initialize AI team with project context
     */
    async initializeAITeam(projectId, aiTeam, projectSpec) {
        console.log(`🔄 Initializing AI team...`);
        
        for (const ai of aiTeam) {
            try {
                await this.sendMessageToAI(ai.id, {
                    type: 'project_initialization',
                    projectId: projectId,
                    projectSpec: projectSpec,
                    role: this.determineAIRole(ai, projectSpec),
                    teammates: aiTeam.filter(teammate => teammate.id !== ai.id).map(t => t.id)
                });
                
                console.log(`✅ ${ai.id} initialized`);
                
            } catch (error) {
                console.warn(`⚠️ Failed to initialize ${ai.id}: ${error.message}`);
            }
        }
    }

    /**
     * Distribute tasks among AI team members
     */
    async distributeTasks(projectId, tasks, aiTeam) {
        console.log(`📋 Distributing ${tasks.length} tasks among ${aiTeam.length} AIs...`);
        
        for (const task of tasks) {
            const assignedAI = this.selectOptimalAIForTask(task, aiTeam);
            
            if (assignedAI) {
                await this.assignTaskToAI(assignedAI.id, task, projectId);
                console.log(`📤 Task "${task.title}" → ${assignedAI.id}`);
            } else {
                console.warn(`⚠️ No suitable AI found for task: ${task.title}`);
            }
        }
    }

    /**
     * Monitor execution and handle coordination
     */
    async monitorExecution(projectId) {
        return new Promise((resolve) => {
            console.log(`👁️ Monitoring project execution...`);
            
            // Simulate monitoring (in real implementation, this would be event-driven)
            const monitorInterval = setInterval(() => {
                const project = this.activeProjects.get(projectId);
                if (!project) {
                    clearInterval(monitorInterval);
                    resolve();
                    return;
                }

                // Check progress
                const progress = this.calculateProgress(projectId);
                project.progress = progress;
                
                console.log(`📊 Progress: ${Math.round(progress.percentage)}%`);
                
                // Complete when all tasks are done (simulated)
                if (progress.percentage >= 100) {
                    clearInterval(monitorInterval);
                    resolve();
                }
            }, 2000);

            // Auto-complete after 10 seconds for demo
            setTimeout(() => {
                clearInterval(monitorInterval);
                resolve();
            }, 10000);
        });
    }

    /**
     * Calculate project progress
     */
    calculateProgress(projectId) {
        const project = this.activeProjects.get(projectId);
        if (!project) return { percentage: 0, phase: 'unknown' };

        // Simulate progress calculation
        const elapsed = Date.now() - project.startTime;
        const percentage = Math.min((elapsed / 10000) * 100, 100); // Complete in 10 seconds for demo

        return {
            percentage,
            completedTasks: Math.floor((percentage / 100) * project.spec.tasks.length),
            totalTasks: project.spec.tasks.length,
            currentPhase: percentage < 30 ? 'setup' : percentage < 70 ? 'development' : 'finalization'
        };
    }

    /**
     * Perform quality assurance
     */
    async performQualityAssurance(projectId) {
        console.log(`🔍 Performing quality assurance...`);
        
        // Simulate QA process
        await new Promise(resolve => setTimeout(resolve, 2000));
        
        console.log(`✅ Quality assurance completed`);
    }

    /**
     * Generate final project result
     */
    generateProjectResult(project) {
        const duration = project.completionTime - project.startTime;
        
        return {
            projectId: project.spec.id,
            description: project.spec.originalDescription,
            status: 'completed',
            duration: duration,
            team: project.team.map(ai => ai.id),
            tasks: {
                total: project.spec.tasks.length,
                completed: project.progress.completedTasks
            },
            technologies: project.spec.technologies,
            estimatedHours: project.spec.estimatedHours,
            actualHours: duration / (1000 * 60 * 60), // Convert ms to hours
            qualityScore: 0.95, // Simulated quality score
            artifacts: {
                codeRepository: `./projects/${project.spec.id}`,
                documentation: `./projects/${project.spec.id}/README.md`,
                deploymentUrl: `https://deploy.example.com/${project.spec.id}`
            }
        };
    }

    // === AI Service Management ===

    /**
     * Register an AI service
     */
    registerAIService(aiConfig) {
        const aiService = {
            id: aiConfig.id,
            name: aiConfig.name,
            type: aiConfig.type,
            endpoint: aiConfig.endpoint,
            apiKey: aiConfig.apiKey,
            specialization: aiConfig.specialization || this.aiSpecializations[aiConfig.id],
            status: 'ready',
            registeredAt: Date.now(),
            stats: {
                tasksCompleted: 0,
                averageResponseTime: 2000,
                successRate: 1.0
            }
        };

        this.aiServices.set(aiService.id, aiService);
        console.log(`🤖 AI service registered: ${aiService.name} (${aiService.id})`);
        
        this.emit('ai_registered', aiService);
        return aiService.id;
    }

    /**
     * Send message to AI service
     */
    async sendMessageToAI(aiId, message) {
        const ai = this.aiServices.get(aiId);
        if (!ai) {
            throw new Error(`AI service ${aiId} not found`);
        }

        // Simulate AI communication (in real implementation, this would call actual APIs)
        console.log(`📤 → ${aiId}: ${message.type}`);
        
        // Simulate response time
        await new Promise(resolve => setTimeout(resolve, ai.stats.averageResponseTime));
        
        const response = {
            aiId: aiId,
            messageId: crypto.randomUUID(),
            timestamp: Date.now(),
            status: 'success',
            data: `Processed: ${message.type}`
        };

        console.log(`📥 ← ${aiId}: Response received`);
        return response;
    }

    /**
     * Select optimal AI for specific task
     */
    selectOptimalAIForTask(task, aiTeam) {
        // Simple selection based on task type and AI specialization
        for (const ai of aiTeam) {
            if (ai.specialization && ai.specialization.preferredTasks.includes(task.type)) {
                return ai;
            }
        }

        // Fallback to first available AI
        return aiTeam[0];
    }

    /**
     * Assign task to AI
     */
    async assignTaskToAI(aiId, task, projectId) {
        return await this.sendMessageToAI(aiId, {
            type: 'task_assignment',
            task: task,
            projectId: projectId,
            deadline: new Date(Date.now() + (task.estimatedHours * 60 * 60 * 1000)).toISOString()
        });
    }

    /**
     * Determine AI role in project
     */
    determineAIRole(ai, projectSpec) {
        if (ai.specialization) {
            const strengths = ai.specialization.strengths;
            if (strengths.includes('frontend')) return 'frontend-lead';
            if (strengths.includes('backend')) return 'backend-lead';
            if (strengths.includes('testing')) return 'qa-lead';
            if (strengths.includes('deployment')) return 'devops-lead';
        }
        return 'general-developer';
    }

    // === State Management ===

    /**
     * Load orchestrator state
     */
    loadOrchestratorState() {
        try {
            if (fs.existsSync(this.orchestratorStateFile)) {
                const data = fs.readFileSync(this.orchestratorStateFile, 'utf-8');
                return JSON.parse(data);
            }
        } catch (error) {
            console.warn(`⚠️ Failed to load orchestrator state: ${error.message}`);
        }
        
        return {
            version: '1.0.0',
            created: Date.now(),
            projects: {},
            aiServices: {},
            statistics: {
                totalProjects: 0,
                successfulProjects: 0,
                totalAIHours: 0
            }
        };
    }

    /**
     * Save orchestrator state
     */
    saveOrchestratorState() {
        try {
            const state = {
                ...this.orchestratorState,
                lastUpdated: Date.now(),
                projects: Object.fromEntries(this.activeProjects),
                aiServices: Object.fromEntries(this.aiServices)
            };

            fs.writeFileSync(this.orchestratorStateFile, JSON.stringify(state, null, 2));
        } catch (error) {
            console.error(`❌ Failed to save orchestrator state: ${error.message}`);
        }
    }

    /**
     * Setup event handlers
     */
    setupEventHandlers() {
        this.on('project_started', (project) => {
            console.log(`🚀 Project started: ${project.spec.originalDescription}`);
        });

        this.on('project_completed', (project) => {
            console.log(`✅ Project completed: ${project.spec.originalDescription}`);
        });

        this.on('task_assigned', (task, aiId) => {
            console.log(`📋 Task assigned: ${task.title} → ${aiId}`);
        });

        // Auto-save state on changes
        this.on('state_changed', () => {
            this.saveOrchestratorState();
        });
    }

    /**
     * Get orchestrator status
     */
    getStatus() {
        return {
            activeProjects: this.activeProjects.size,
            registeredAIs: this.aiServices.size,
            tasksInQueue: this.taskQueue.length,
            uptime: Date.now() - this.orchestratorState.created
        };
    }

    /**
     * Shutdown orchestrator gracefully
     */
    async shutdown() {
        console.log('🛑 Shutting down Multi-AI Orchestrator...');
        
        // Save final state
        this.saveOrchestratorState();
        
        // Notify all AIs
        for (const ai of this.aiServices.values()) {
            try {
                await this.sendMessageToAI(ai.id, { type: 'shutdown_notification' });
            } catch (error) {
                console.warn(`⚠️ Failed to notify ${ai.id} of shutdown: ${error.message}`);
            }
        }
        
        console.log('👋 Multi-AI Orchestrator shutdown complete');
    }
}

module.exports = MultiAIOrchestrator;

// CLI usage
if (require.main === module) {
    const orchestrator = new MultiAIOrchestrator();
    
    // Example usage
    const projectDescription = process.argv[2] || "Create a todo app with user authentication";
    
    orchestrator.buildProject(projectDescription)
        .then(result => {
            console.log('\n🎉 PROJECT COMPLETED!');
            console.log('📊 Result:', JSON.stringify(result, null, 2));
            process.exit(0);
        })
        .catch(error => {
            console.error('\n❌ PROJECT FAILED:', error.message);
            process.exit(1);
        });
}