#!/usr/bin/env node

/**
 * Advanced Task Parser - Natural Language to Structured Tasks
 * Part of the Autonomous AI Team Orchestrator system
 * 
 * This parser uses advanced NLP patterns and AI-assisted parsing
 * to convert natural language project descriptions into detailed,
 * actionable task structures for AI team coordination.
 */

const crypto = require('crypto');
const fs = require('fs');
const path = require('path');

class TaskParser {
    constructor() {
        // Project type patterns with confidence scoring
        this.projectPatterns = {
            'e-commerce': {
                keywords: ['shop', 'store', 'ecommerce', 'e-commerce', 'buy', 'sell', 'cart', 'payment', 'checkout', 'product', 'inventory'],
                indicators: ['shopping cart', 'product catalog', 'payment gateway', 'order management'],
                complexity: 0.9,
                weight: 10
            },
            'web-app': {
                keywords: ['website', 'web app', 'webapp', 'web application', 'dashboard', 'admin panel', 'portal'],
                indicators: ['user interface', 'responsive design', 'web dashboard'],
                complexity: 0.7,
                weight: 8
            },
            'mobile-app': {
                keywords: ['mobile', 'app', 'ios', 'android', 'react native', 'flutter', 'mobile application'],
                indicators: ['mobile app', 'cross platform', 'native app'],
                complexity: 0.8,
                weight: 9
            },
            'api-service': {
                keywords: ['api', 'service', 'microservice', 'endpoint', 'rest api', 'graphql', 'backend service'],
                indicators: ['rest endpoints', 'api documentation', 'service layer'],
                complexity: 0.6,
                weight: 7
            },
            'blog-cms': {
                keywords: ['blog', 'cms', 'content management', 'articles', 'posts', 'publishing'],
                indicators: ['content management', 'blog posts', 'article publishing'],
                complexity: 0.5,
                weight: 6
            },
            'todo-app': {
                keywords: ['todo', 'task', 'productivity', 'checklist', 'reminders', 'task management'],
                indicators: ['task lists', 'todo items', 'task tracking'],
                complexity: 0.4,
                weight: 5
            },
            'chat-app': {
                keywords: ['chat', 'messaging', 'communication', 'real-time', 'websocket', 'instant messaging'],
                indicators: ['real-time chat', 'message history', 'chat rooms'],
                complexity: 0.7,
                weight: 8
            },
            'social-media': {
                keywords: ['social', 'network', 'feed', 'posts', 'followers', 'likes', 'social platform'],
                indicators: ['social feed', 'user profiles', 'social interactions'],
                complexity: 0.9,
                weight: 9
            },
            'portfolio': {
                keywords: ['portfolio', 'showcase', 'personal website', 'resume', 'cv'],
                indicators: ['project showcase', 'personal branding', 'work examples'],
                complexity: 0.3,
                weight: 4
            },
            'landing-page': {
                keywords: ['landing', 'marketing', 'promotional', 'lead generation', 'conversion'],
                indicators: ['call to action', 'lead capture', 'marketing page'],
                complexity: 0.2,
                weight: 3
            }
        };

        // Feature requirement patterns
        this.featurePatterns = {
            'user-authentication': {
                keywords: ['login', 'register', 'auth', 'sign up', 'sign in', 'authentication', 'user accounts'],
                complexity: 0.2,
                estimatedHours: 3
            },
            'database': {
                keywords: ['store', 'save', 'database', 'data', 'persistent', 'sql', 'mongodb'],
                complexity: 0.15,
                estimatedHours: 2
            },
            'real-time': {
                keywords: ['real-time', 'live', 'instant', 'websocket', 'socket.io', 'live updates'],
                complexity: 0.25,
                estimatedHours: 4
            },
            'responsive': {
                keywords: ['responsive', 'mobile', 'tablet', 'device', 'mobile-first'],
                complexity: 0.1,
                estimatedHours: 2
            },
            'admin-panel': {
                keywords: ['admin', 'dashboard', 'management', 'control panel', 'admin interface'],
                complexity: 0.2,
                estimatedHours: 4
            },
            'payment': {
                keywords: ['payment', 'stripe', 'paypal', 'checkout', 'billing', 'subscription'],
                complexity: 0.3,
                estimatedHours: 5
            },
            'email': {
                keywords: ['email', 'notification', 'send', 'smtp', 'email service'],
                complexity: 0.1,
                estimatedHours: 2
            },
            'file-upload': {
                keywords: ['upload', 'file', 'image', 'document', 'media upload'],
                complexity: 0.15,
                estimatedHours: 3
            },
            'search': {
                keywords: ['search', 'filter', 'find', 'query', 'elasticsearch'],
                complexity: 0.2,
                estimatedHours: 3
            },
            'api': {
                keywords: ['api', 'rest', 'graphql', 'endpoint', 'api integration'],
                complexity: 0.15,
                estimatedHours: 2
            },
            'social-features': {
                keywords: ['like', 'comment', 'share', 'follow', 'social interaction'],
                complexity: 0.25,
                estimatedHours: 4
            },
            'notifications': {
                keywords: ['notification', 'alert', 'push', 'email notification'],
                complexity: 0.15,
                estimatedHours: 2
            },
            'analytics': {
                keywords: ['analytics', 'tracking', 'metrics', 'google analytics'],
                complexity: 0.1,
                estimatedHours: 1
            },
            'security': {
                keywords: ['security', 'encryption', 'ssl', 'secure', 'vulnerability'],
                complexity: 0.2,
                estimatedHours: 3
            }
        };

        // Technology stack recommendations
        this.techStacks = {
            'web-app': {
                frontend: 'React + TypeScript',
                backend: 'Node.js + Express',
                database: 'PostgreSQL',
                styling: 'Tailwind CSS',
                testing: 'Jest + React Testing Library'
            },
            'e-commerce': {
                frontend: 'Next.js + TypeScript',
                backend: 'Node.js + Express',
                database: 'PostgreSQL',
                payment: 'Stripe',
                auth: 'NextAuth.js',
                styling: 'Tailwind CSS'
            },
            'mobile-app': {
                framework: 'React Native',
                state: 'Redux Toolkit',
                navigation: 'React Navigation',
                backend: 'Node.js + Express',
                database: 'PostgreSQL'
            },
            'api-service': {
                framework: 'Express.js',
                database: 'PostgreSQL',
                validation: 'Joi',
                documentation: 'Swagger',
                testing: 'Jest + Supertest'
            },
            'blog-cms': {
                frontend: 'Next.js',
                cms: 'Strapi or Contentful',
                database: 'PostgreSQL',
                styling: 'Tailwind CSS',
                auth: 'NextAuth.js'
            }
        };

        // Task templates for different project types
        this.taskTemplates = {
            'base': [
                { type: 'planning', title: 'Project Architecture Planning', priority: 1, estimatedHours: 1, aiSpecialization: 'system-architecture' },
                { type: 'setup', title: 'Development Environment Setup', priority: 2, estimatedHours: 0.5, aiSpecialization: 'devops' }
            ],
            'frontend': [
                { type: 'frontend', title: 'React Application Setup', priority: 3, estimatedHours: 1, aiSpecialization: 'frontend' },
                { type: 'frontend', title: 'Component Architecture Design', priority: 4, estimatedHours: 1.5, aiSpecialization: 'frontend' },
                { type: 'frontend', title: 'UI Components Implementation', priority: 5, estimatedHours: 3, aiSpecialization: 'frontend' },
                { type: 'frontend', title: 'Responsive Design Implementation', priority: 6, estimatedHours: 2, aiSpecialization: 'frontend' },
                { type: 'frontend', title: 'State Management Setup', priority: 7, estimatedHours: 1.5, aiSpecialization: 'frontend' }
            ],
            'backend': [
                { type: 'backend', title: 'API Server Architecture', priority: 3, estimatedHours: 1.5, aiSpecialization: 'backend' },
                { type: 'backend', title: 'Database Schema Design', priority: 4, estimatedHours: 1, aiSpecialization: 'database' },
                { type: 'backend', title: 'Core API Endpoints', priority: 5, estimatedHours: 2.5, aiSpecialization: 'backend' },
                { type: 'backend', title: 'Database Integration', priority: 6, estimatedHours: 2, aiSpecialization: 'database' },
                { type: 'backend', title: 'API Documentation', priority: 7, estimatedHours: 1, aiSpecialization: 'documentation' }
            ],
            'authentication': [
                { type: 'auth', title: 'Authentication Strategy Design', priority: 8, estimatedHours: 1, aiSpecialization: 'security' },
                { type: 'auth', title: 'User Authentication Backend', priority: 9, estimatedHours: 2.5, aiSpecialization: 'backend' },
                { type: 'auth', title: 'Login/Register UI Components', priority: 10, estimatedHours: 1.5, aiSpecialization: 'frontend' },
                { type: 'auth', title: 'JWT Token Management', priority: 11, estimatedHours: 1, aiSpecialization: 'security' }
            ],
            'payment': [
                { type: 'payment', title: 'Payment Gateway Integration', priority: 12, estimatedHours: 3, aiSpecialization: 'backend' },
                { type: 'payment', title: 'Checkout UI Implementation', priority: 13, estimatedHours: 2, aiSpecialization: 'frontend' },
                { type: 'payment', title: 'Payment Security & Validation', priority: 14, estimatedHours: 2, aiSpecialization: 'security' }
            ],
            'testing-deployment': [
                { type: 'testing', title: 'Unit Test Suite Creation', priority: 20, estimatedHours: 2, aiSpecialization: 'testing' },
                { type: 'testing', title: 'Integration Testing', priority: 21, estimatedHours: 2, aiSpecialization: 'testing' },
                { type: 'testing', title: 'End-to-End Testing', priority: 22, estimatedHours: 1.5, aiSpecialization: 'testing' },
                { type: 'deployment', title: 'CI/CD Pipeline Setup', priority: 23, estimatedHours: 2, aiSpecialization: 'devops' },
                { type: 'deployment', title: 'Production Deployment', priority: 24, estimatedHours: 1.5, aiSpecialization: 'devops' }
            ]
        };
    }

    /**
     * Main parsing method - converts natural language to structured project spec
     */
    async parseProjectDescription(description, options = {}) {
        console.log(`🔍 Parsing project: "${description}"`);
        
        const projectSpec = {
            id: crypto.randomUUID(),
            originalDescription: description,
            timestamp: Date.now(),
            confidence: 0,
            
            // Core identification
            type: null,
            subtype: null,
            
            // Requirements and features
            requirements: [],
            features: [],
            
            // Technical details
            technologies: {},
            complexity: 0,
            estimatedHours: 0,
            
            // Task breakdown
            tasks: [],
            phases: [],
            
            // AI team recommendations
            requiredSpecializations: [],
            optimalTeamSize: 0,
            
            // Additional context
            targetAudience: null,
            businessGoals: [],
            technicalConstraints: []
        };

        // Step 1: Identify project type
        projectSpec.type = this.identifyProjectType(description);
        projectSpec.confidence = this.calculateTypeConfidence(description, projectSpec.type);
        
        // Step 2: Extract features and requirements
        projectSpec.requirements = this.extractRequirements(description);
        projectSpec.features = this.extractFeatures(description);
        
        // Step 3: Determine technology stack
        projectSpec.technologies = this.suggestTechnologies(projectSpec.type, projectSpec.requirements);
        
        // Step 4: Calculate complexity
        projectSpec.complexity = this.calculateComplexity(projectSpec);
        
        // Step 5: Generate detailed tasks
        projectSpec.tasks = this.generateDetailedTasks(projectSpec);
        projectSpec.phases = this.organizeTasks(projectSpec.tasks);
        
        // Step 6: Estimate hours and team
        projectSpec.estimatedHours = this.calculateEstimatedHours(projectSpec.tasks);
        projectSpec.requiredSpecializations = this.identifyRequiredSpecializations(projectSpec);
        projectSpec.optimalTeamSize = this.calculateOptimalTeamSize(projectSpec);
        
        // Step 7: Extract additional context
        projectSpec.targetAudience = this.identifyTargetAudience(description);
        projectSpec.businessGoals = this.extractBusinessGoals(description);
        projectSpec.technicalConstraints = this.extractTechnicalConstraints(description);

        console.log(`✅ Project parsed: ${projectSpec.type} (${Math.round(projectSpec.confidence * 100)}% confidence)`);
        console.log(`📊 Complexity: ${projectSpec.complexity.toFixed(2)}, Tasks: ${projectSpec.tasks.length}, Hours: ${projectSpec.estimatedHours}`);
        
        return projectSpec;
    }

    /**
     * Identify project type with confidence scoring
     */
    identifyProjectType(description) {
        const desc = description.toLowerCase();
        const typeScores = {};
        
        for (const [type, pattern] of Object.entries(this.projectPatterns)) {
            let score = 0;
            
            // Score based on keywords
            const keywordMatches = pattern.keywords.filter(keyword => desc.includes(keyword));
            score += keywordMatches.length * pattern.weight;
            
            // Bonus for specific indicators
            const indicatorMatches = pattern.indicators.filter(indicator => desc.includes(indicator));
            score += indicatorMatches.length * pattern.weight * 2;
            
            // Length bonus for longer matches
            const totalMatchLength = [...keywordMatches, ...indicatorMatches]
                .reduce((sum, match) => sum + match.length, 0);
            score += totalMatchLength * 0.5;
            
            typeScores[type] = score;
        }
        
        // Find highest scoring type
        const sortedTypes = Object.entries(typeScores)
            .sort(([,a], [,b]) => b - a);
        
        return sortedTypes.length > 0 && sortedTypes[0][1] > 0 ? 
            sortedTypes[0][0] : 'web-app'; // default fallback
    }

    /**
     * Calculate confidence score for identified project type
     */
    calculateTypeConfidence(description, identifiedType) {
        const desc = description.toLowerCase();
        const pattern = this.projectPatterns[identifiedType];
        
        if (!pattern) return 0.5; // default confidence
        
        const keywordMatches = pattern.keywords.filter(keyword => desc.includes(keyword));
        const indicatorMatches = pattern.indicators.filter(indicator => desc.includes(indicator));
        
        const totalPossibleMatches = pattern.keywords.length + pattern.indicators.length;
        const actualMatches = keywordMatches.length + indicatorMatches.length;
        
        const baseConfidence = actualMatches / totalPossibleMatches;
        
        // Bonus for high-quality matches
        const qualityBonus = indicatorMatches.length * 0.2;
        
        return Math.min(baseConfidence + qualityBonus, 1.0);
    }

    /**
     * Extract functional requirements
     */
    extractRequirements(description) {
        const desc = description.toLowerCase();
        const requirements = [];
        
        for (const [req, pattern] of Object.entries(this.featurePatterns)) {
            const matches = pattern.keywords.filter(keyword => desc.includes(keyword));
            if (matches.length > 0) {
                requirements.push({
                    name: req,
                    matches: matches,
                    confidence: Math.min(matches.length / pattern.keywords.length, 1.0),
                    complexity: pattern.complexity,
                    estimatedHours: pattern.estimatedHours
                });
            }
        }
        
        return requirements.sort((a, b) => b.confidence - a.confidence);
    }

    /**
     * Extract specific features mentioned
     */
    extractFeatures(description) {
        const desc = description.toLowerCase();
        const features = [];
        
        // Advanced feature detection patterns
        const featurePatterns = {
            'drag-and-drop': /drag.{0,10}drop/i,
            'dark-mode': /dark.{0,5}mode|theme.{0,5}switch/i,
            'multi-language': /multi.{0,5}language|internationalization|i18n/i,
            'offline-support': /offline|pwa|service.{0,5}worker/i,
            'video-streaming': /video.{0,10}stream|live.{0,5}video/i,
            'geolocation': /location|gps|map|geolocation/i,
            'push-notifications': /push.{0,5}notification|web.{0,5}push/i,
            'social-login': /social.{0,5}login|oauth|google.{0,5}login|facebook.{0,5}login/i,
            'chat-bot': /chatbot|chat.{0,5}bot|ai.{0,5}assistant/i,
            'calendar-integration': /calendar|schedule|appointment/i
        };
        
        for (const [feature, pattern] of Object.entries(featurePatterns)) {
            if (pattern.test(description)) {
                features.push({
                    name: feature,
                    detected: true,
                    complexity: 0.2,
                    estimatedHours: 3
                });
            }
        }
        
        return features;
    }

    /**
     * Suggest optimal technology stack
     */
    suggestTechnologies(projectType, requirements) {
        const baseTech = this.techStacks[projectType] || this.techStacks['web-app'];
        const enhancedTech = { ...baseTech };
        
        // Modify stack based on requirements
        const requirementNames = requirements.map(r => r.name);
        
        if (requirementNames.includes('real-time')) {
            enhancedTech.realtime = 'Socket.io';
            enhancedTech.backend = enhancedTech.backend + ' + Socket.io';
        }
        
        if (requirementNames.includes('payment')) {
            enhancedTech.payment = 'Stripe';
        }
        
        if (requirementNames.includes('file-upload')) {
            enhancedTech.storage = 'AWS S3 or Cloudinary';
        }
        
        if (requirementNames.includes('search')) {
            enhancedTech.search = 'Elasticsearch or Algolia';
        }
        
        if (requirementNames.includes('email')) {
            enhancedTech.email = 'SendGrid or AWS SES';
        }
        
        return enhancedTech;
    }

    /**
     * Calculate overall project complexity
     */
    calculateComplexity(projectSpec) {
        let complexity = this.projectPatterns[projectSpec.type]?.complexity || 0.5;
        
        // Add complexity from requirements
        const requirementComplexity = projectSpec.requirements
            .reduce((sum, req) => sum + req.complexity, 0);
        
        // Add complexity from features
        const featureComplexity = projectSpec.features
            .reduce((sum, feature) => sum + feature.complexity, 0);
        
        // Scale based on number of different tech components
        const techComplexity = Object.keys(projectSpec.technologies).length * 0.05;
        
        const totalComplexity = complexity + requirementComplexity + featureComplexity + techComplexity;
        
        return Math.min(totalComplexity, 1.0);
    }

    /**
     * Generate detailed task breakdown
     */
    generateDetailedTasks(projectSpec) {
        const tasks = [];
        let taskPriority = 1;
        
        // Always include base tasks
        const baseTasks = this.taskTemplates.base.map(task => ({
            ...task,
            id: crypto.randomUUID(),
            priority: taskPriority++,
            projectType: projectSpec.type
        }));
        tasks.push(...baseTasks);
        
        // Add frontend tasks for web projects
        if (['web-app', 'e-commerce', 'blog-cms'].includes(projectSpec.type)) {
            const frontendTasks = this.taskTemplates.frontend.map(task => ({
                ...task,
                id: crypto.randomUUID(),
                priority: taskPriority++,
                projectType: projectSpec.type
            }));
            tasks.push(...frontendTasks);
        }
        
        // Add backend tasks
        if (projectSpec.requirements.some(r => ['database', 'api'].includes(r.name)) || 
            ['web-app', 'e-commerce', 'api-service'].includes(projectSpec.type)) {
            const backendTasks = this.taskTemplates.backend.map(task => ({
                ...task,
                id: crypto.randomUUID(),
                priority: taskPriority++,
                projectType: projectSpec.type
            }));
            tasks.push(...backendTasks);
        }
        
        // Add authentication tasks
        if (projectSpec.requirements.some(r => r.name === 'user-authentication')) {
            const authTasks = this.taskTemplates.authentication.map(task => ({
                ...task,
                id: crypto.randomUUID(),
                priority: taskPriority++,
                projectType: projectSpec.type
            }));
            tasks.push(...authTasks);
        }
        
        // Add payment tasks
        if (projectSpec.requirements.some(r => r.name === 'payment')) {
            const paymentTasks = this.taskTemplates.payment.map(task => ({
                ...task,
                id: crypto.randomUUID(),
                priority: taskPriority++,
                projectType: projectSpec.type
            }));
            tasks.push(...paymentTasks);
        }
        
        // Add feature-specific tasks
        for (const requirement of projectSpec.requirements) {
            if (!['user-authentication', 'payment', 'database', 'api'].includes(requirement.name)) {
                tasks.push({
                    id: crypto.randomUUID(),
                    type: 'feature',
                    title: `${requirement.name.replace('-', ' ')} Implementation`,
                    priority: taskPriority++,
                    estimatedHours: requirement.estimatedHours,
                    aiSpecialization: this.getSpecializationForFeature(requirement.name),
                    projectType: projectSpec.type
                });
            }
        }
        
        // Always add testing and deployment
        const testDeployTasks = this.taskTemplates['testing-deployment'].map(task => ({
            ...task,
            id: crypto.randomUUID(),
            priority: taskPriority++,
            projectType: projectSpec.type
        }));
        tasks.push(...testDeployTasks);
        
        return tasks.sort((a, b) => a.priority - b.priority);
    }

    /**
     * Get AI specialization for a specific feature
     */
    getSpecializationForFeature(featureName) {
        const specializationMap = {
            'real-time': 'backend',
            'responsive': 'frontend',
            'admin-panel': 'frontend',
            'email': 'backend',
            'file-upload': 'backend',
            'search': 'backend',
            'social-features': 'frontend',
            'notifications': 'backend',
            'analytics': 'backend',
            'security': 'security'
        };
        
        return specializationMap[featureName] || 'frontend';
    }

    /**
     * Organize tasks into logical phases
     */
    organizeTasks(tasks) {
        const phases = [
            {
                name: 'Planning & Setup',
                tasks: tasks.filter(t => ['planning', 'setup'].includes(t.type)),
                estimatedHours: 0
            },
            {
                name: 'Core Development',
                tasks: tasks.filter(t => ['frontend', 'backend'].includes(t.type)),
                estimatedHours: 0
            },
            {
                name: 'Features & Integration',
                tasks: tasks.filter(t => ['auth', 'payment', 'feature'].includes(t.type)),
                estimatedHours: 0
            },
            {
                name: 'Testing & Deployment',
                tasks: tasks.filter(t => ['testing', 'deployment'].includes(t.type)),
                estimatedHours: 0
            }
        ];
        
        // Calculate hours for each phase
        phases.forEach(phase => {
            phase.estimatedHours = phase.tasks.reduce((sum, task) => sum + task.estimatedHours, 0);
        });
        
        return phases.filter(phase => phase.tasks.length > 0);
    }

    /**
     * Calculate total estimated hours
     */
    calculateEstimatedHours(tasks) {
        return tasks.reduce((total, task) => total + task.estimatedHours, 0);
    }

    /**
     * Identify required AI specializations
     */
    identifyRequiredSpecializations(projectSpec) {
        const specializations = new Set();
        
        // Add specializations from tasks
        for (const task of projectSpec.tasks) {
            if (task.aiSpecialization) {
                specializations.add(task.aiSpecialization);
            }
        }
        
        // Ensure we have core specializations
        specializations.add('system-architecture');
        if (projectSpec.complexity > 0.5) {
            specializations.add('frontend');
            specializations.add('backend');
        }
        
        return Array.from(specializations);
    }

    /**
     * Calculate optimal team size
     */
    calculateOptimalTeamSize(projectSpec) {
        const baseSize = 2; // Minimum team size
        
        let size = baseSize;
        
        // Add team members based on complexity
        if (projectSpec.complexity > 0.7) size += 1;
        if (projectSpec.complexity > 0.9) size += 1;
        
        // Add members based on specializations needed
        const specializations = projectSpec.requiredSpecializations.length;
        size = Math.max(size, Math.min(specializations, 5));
        
        // Add members based on estimated hours
        if (projectSpec.estimatedHours > 20) size += 1;
        if (projectSpec.estimatedHours > 40) size += 1;
        
        return Math.min(size, 6); // Cap at 6 team members
    }

    /**
     * Identify target audience from description
     */
    identifyTargetAudience(description) {
        const audiencePatterns = {
            'developers': /developer|programmer|coder|technical/i,
            'business': /business|enterprise|company|corporate/i,
            'consumers': /consumer|user|customer|public/i,
            'students': /student|education|learning|academic/i,
            'professionals': /professional|expert|specialist/i
        };
        
        for (const [audience, pattern] of Object.entries(audiencePatterns)) {
            if (pattern.test(description)) {
                return audience;
            }
        }
        
        return 'general';
    }

    /**
     * Extract business goals from description
     */
    extractBusinessGoals(description) {
        const goalPatterns = {
            'increase-sales': /increase.{0,10}sales|boost.{0,10}revenue|generate.{0,10}income/i,
            'improve-efficiency': /efficiency|productivity|streamline|automate/i,
            'user-engagement': /engagement|retention|user.{0,10}experience/i,
            'brand-awareness': /brand|awareness|marketing|promotion/i,
            'cost-reduction': /cost.{0,10}reduction|save.{0,10}money|reduce.{0,10}expense/i,
            'scalability': /scale|growth|expansion|scalable/i
        };
        
        const goals = [];
        for (const [goal, pattern] of Object.entries(goalPatterns)) {
            if (pattern.test(description)) {
                goals.push(goal);
            }
        }
        
        return goals;
    }

    /**
     * Extract technical constraints
     */
    extractTechnicalConstraints(description) {
        const constraintPatterns = {
            'budget-limited': /budget|cost.{0,10}effective|cheap|affordable/i,
            'time-critical': /urgent|asap|quickly|deadline|time.{0,10}sensitive/i,
            'mobile-first': /mobile.{0,10}first|mobile.{0,10}priority/i,
            'seo-important': /seo|search.{0,10}engine|google.{0,10}ranking/i,
            'accessibility': /accessibility|a11y|accessible|disability/i,
            'performance': /performance|fast|speed|optimization/i,
            'security': /security|secure|encryption|privacy/i
        };
        
        const constraints = [];
        for (const [constraint, pattern] of Object.entries(constraintPatterns)) {
            if (pattern.test(description)) {
                constraints.push(constraint);
            }
        }
        
        return constraints;
    }

    /**
     * Generate summary report of parsing results
     */
    generateParsingReport(projectSpec) {
        return {
            summary: {
                projectType: projectSpec.type,
                confidence: Math.round(projectSpec.confidence * 100) + '%',
                complexity: projectSpec.complexity.toFixed(2),
                estimatedHours: projectSpec.estimatedHours,
                teamSize: projectSpec.optimalTeamSize
            },
            breakdown: {
                requirements: projectSpec.requirements.length,
                features: projectSpec.features.length,
                tasks: projectSpec.tasks.length,
                phases: projectSpec.phases.length,
                specializations: projectSpec.requiredSpecializations.length
            },
            technologies: Object.keys(projectSpec.technologies),
            topRequirements: projectSpec.requirements
                .slice(0, 5)
                .map(r => `${r.name} (${Math.round(r.confidence * 100)}%)`),
            phases: projectSpec.phases.map(p => ({
                name: p.name,
                tasks: p.tasks.length,
                hours: p.estimatedHours
            }))
        };
    }
}

module.exports = { TaskParser };

// CLI interface for testing
if (require.main === module) {
    console.log('🔍 Task Parser - Testing Interface\n');
    
    const parser = new TaskParser();
    
    async function runTests() {
        const testDescriptions = [
            "Create a modern e-commerce platform with user authentication, shopping cart, payment processing, and admin dashboard",
            "Build a simple todo app with task management and user accounts",
            "Develop a real-time chat application with websockets and mobile responsive design",
            "Create a portfolio website with project showcase and contact form",
            "Build a social media platform with posts, likes, comments, and user profiles"
        ];
        
        for (const description of testDescriptions) {
            console.log(`\n${'='.repeat(80)}`);
            console.log(`Testing: "${description}"`);
            console.log('='.repeat(80));
            
            try {
                const projectSpec = await parser.parseProjectDescription(description);
                const report = parser.generateParsingReport(projectSpec);
                
                console.log('\n📊 PARSING REPORT:');
                console.log(JSON.stringify(report, null, 2));
                
            } catch (error) {
                console.error('❌ Parsing failed:', error.message);
            }
        }
        
        process.exit(0);
    }
    
    runTests().catch(error => {
        console.error('❌ Test suite failed:', error);
        process.exit(1);
    });
}