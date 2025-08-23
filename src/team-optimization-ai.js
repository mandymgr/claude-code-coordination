#!/usr/bin/env node

/**
 * Claude Code Coordination - Team Optimization AI v4.0
 * Revolutionary team composition and optimization based on project types and session capabilities
 */

const fs = require('fs');
const path = require('path');

class TeamOptimizationAI {
    constructor(coordinationDir = '.claude-coordination') {
        this.coordinationDir = path.resolve(coordinationDir);
        this.teamStateFile = path.join(this.coordinationDir, 'team-optimization-state.json');
        
        // Project type classifications
        this.projectTypes = {
            'web_fullstack': {
                name: 'Full-Stack Web Application',
                complexity: 0.8,
                requiredSkills: ['frontend', 'backend', 'database', 'api', 'ui_ux'],
                optimalTeamSize: [3, 5],
                criticalRoles: ['frontend_specialist', 'backend_specialist', 'full_stack_generalist']
            },
            'ecommerce': {
                name: 'E-commerce Platform',
                complexity: 0.9,
                requiredSkills: ['frontend', 'backend', 'database', 'payment', 'security', 'api'],
                optimalTeamSize: [4, 6],
                criticalRoles: ['frontend_specialist', 'backend_specialist', 'payment_specialist', 'security_specialist']
            },
            'mobile_app': {
                name: 'Mobile Application',
                complexity: 0.7,
                requiredSkills: ['mobile', 'ui_ux', 'api', 'database'],
                optimalTeamSize: [2, 4],
                criticalRoles: ['mobile_specialist', 'api_specialist', 'ui_ux_specialist']
            },
            'api_microservices': {
                name: 'API & Microservices',
                complexity: 0.9,
                requiredSkills: ['backend', 'database', 'api', 'devops', 'security'],
                optimalTeamSize: [3, 5],
                criticalRoles: ['backend_specialist', 'api_architect', 'devops_specialist']
            },
            'data_analytics': {
                name: 'Data Analytics Platform',
                complexity: 0.8,
                requiredSkills: ['data_science', 'backend', 'database', 'visualization'],
                optimalTeamSize: [2, 4],
                criticalRoles: ['data_scientist', 'backend_specialist', 'database_specialist']
            },
            'ai_ml_project': {
                name: 'AI/ML Project',
                complexity: 0.9,
                requiredSkills: ['machine_learning', 'data_science', 'python', 'api'],
                optimalTeamSize: [2, 4],
                criticalRoles: ['ml_engineer', 'data_scientist', 'api_specialist']
            },
            'blockchain_dapp': {
                name: 'Blockchain DApp',
                complexity: 0.9,
                requiredSkills: ['blockchain', 'smart_contracts', 'frontend', 'security'],
                optimalTeamSize: [3, 5],
                criticalRoles: ['blockchain_specialist', 'smart_contract_dev', 'security_specialist']
            },
            'game_development': {
                name: 'Game Development',
                complexity: 0.8,
                requiredSkills: ['game_dev', 'graphics', 'ui_ux', 'performance'],
                optimalTeamSize: [2, 5],
                criticalRoles: ['game_developer', 'graphics_specialist', 'performance_specialist']
            },
            'devops_infrastructure': {
                name: 'DevOps & Infrastructure',
                complexity: 0.8,
                requiredSkills: ['devops', 'cloud', 'security', 'monitoring'],
                optimalTeamSize: [2, 4],
                criticalRoles: ['devops_specialist', 'cloud_architect', 'security_specialist']
            },
            'startup_mvp': {
                name: 'Startup MVP',
                complexity: 0.6,
                requiredSkills: ['frontend', 'backend', 'database', 'rapid_prototyping'],
                optimalTeamSize: [2, 3],
                criticalRoles: ['full_stack_generalist', 'rapid_prototyper']
            }
        };

        // Claude session role classifications
        this.sessionRoles = {
            'full_stack_generalist': {
                name: 'Full-Stack Generalist',
                skills: ['frontend', 'backend', 'database', 'api'],
                strengths: 'Versatile across the stack',
                workload: 'high_versatility'
            },
            'frontend_specialist': {
                name: 'Frontend Specialist',
                skills: ['frontend', 'ui_ux', 'javascript', 'css'],
                strengths: 'UI/UX excellence and user experience',
                workload: 'medium_focused'
            },
            'backend_specialist': {
                name: 'Backend Specialist',
                skills: ['backend', 'api', 'database', 'server'],
                strengths: 'Server-side logic and data management',
                workload: 'high_complexity'
            },
            'api_architect': {
                name: 'API Architect',
                skills: ['api', 'backend', 'microservices', 'design_patterns'],
                strengths: 'API design and architecture',
                workload: 'high_architecture'
            },
            'database_specialist': {
                name: 'Database Specialist',
                skills: ['database', 'sql', 'optimization', 'data_modeling'],
                strengths: 'Data architecture and optimization',
                workload: 'medium_specialized'
            },
            'security_specialist': {
                name: 'Security Specialist',
                skills: ['security', 'authentication', 'encryption', 'compliance'],
                strengths: 'Security implementation and auditing',
                workload: 'high_critical'
            },
            'devops_specialist': {
                name: 'DevOps Specialist',
                skills: ['devops', 'cloud', 'ci_cd', 'monitoring'],
                strengths: 'Deployment and infrastructure management',
                workload: 'medium_operational'
            },
            'mobile_specialist': {
                name: 'Mobile Specialist',
                skills: ['mobile', 'ios', 'android', 'react_native', 'flutter'],
                strengths: 'Mobile app development expertise',
                workload: 'high_specialized'
            },
            'ui_ux_specialist': {
                name: 'UI/UX Specialist',
                skills: ['ui_ux', 'design', 'user_research', 'prototyping'],
                strengths: 'User experience and interface design',
                workload: 'medium_creative'
            },
            'data_scientist': {
                name: 'Data Scientist',
                skills: ['data_science', 'python', 'machine_learning', 'statistics'],
                strengths: 'Data analysis and ML model development',
                workload: 'high_analytical'
            },
            'ml_engineer': {
                name: 'ML Engineer',
                skills: ['machine_learning', 'python', 'tensorflow', 'deployment'],
                strengths: 'ML model training and deployment',
                workload: 'high_specialized'
            },
            'blockchain_specialist': {
                name: 'Blockchain Specialist',
                skills: ['blockchain', 'ethereum', 'solidity', 'web3'],
                strengths: 'Blockchain development and integration',
                workload: 'high_specialized'
            },
            'payment_specialist': {
                name: 'Payment Specialist',
                skills: ['payment', 'stripe', 'paypal', 'security', 'compliance'],
                strengths: 'Payment integration and security',
                workload: 'medium_critical'
            },
            'rapid_prototyper': {
                name: 'Rapid Prototyper',
                skills: ['rapid_prototyping', 'mvp', 'frontend', 'backend'],
                strengths: 'Quick MVP development and iteration',
                workload: 'high_speed'
            }
        };

        // Team composition strategies
        this.teamStrategies = {
            'balanced': {
                name: 'Balanced Team',
                description: 'Even skill distribution across all areas',
                riskTolerance: 'medium',
                efficiency: 'high'
            },
            'specialist_heavy': {
                name: 'Specialist-Heavy',
                description: 'Deep expertise in critical areas',
                riskTolerance: 'low',
                efficiency: 'very_high'
            },
            'generalist_heavy': {
                name: 'Generalist-Heavy',  
                description: 'Flexible team with versatile members',
                riskTolerance: 'high',
                efficiency: 'medium'
            },
            'hybrid': {
                name: 'Hybrid Approach',
                description: 'Mix of specialists and generalists',
                riskTolerance: 'medium',
                efficiency: 'high'
            }
        };

        this.teamState = this.loadTeamState();
    }

    /**
     * Load team optimization state
     */
    loadTeamState() {
        try {
            if (fs.existsSync(this.teamStateFile)) {
                return JSON.parse(fs.readFileSync(this.teamStateFile, 'utf8'));
            }
        } catch (error) {
            console.warn(`Warning: Could not load team state: ${error.message}`);
        }
        
        return {
            version: "4.0.0",
            sessionProfiles: {},
            teamCompositions: {},
            performanceMetrics: {},
            projectAnalysis: {},
            optimizationHistory: [],
            lastOptimization: Date.now()
        };
    }

    /**
     * Save team optimization state
     */
    saveTeamState() {
        try {
            this.teamState.lastOptimization = Date.now();
            fs.writeFileSync(this.teamStateFile, JSON.stringify(this.teamState, null, 2));
            return true;
        } catch (error) {
            console.error(`Error saving team state: ${error.message}`);
            return false;
        }
    }

    /**
     * Analyze project type and requirements
     */
    analyzeProjectRequirements(projectPath, projectMetadata = {}) {
        console.log('🔍 Analyzing project requirements...');
        
        const analysis = {
            detectedType: null,
            confidence: 0,
            requiredSkills: [],
            complexity: 0,
            recommendedTeamSize: [2, 4],
            criticalRoles: [],
            techStack: [],
            projectCharacteristics: {}
        };

        // Analyze project structure and files
        const projectStructure = this.analyzeProjectStructure(projectPath);
        const packageAnalysis = this.analyzePackageFiles(projectPath);
        
        // Detect project type based on structure and dependencies
        const typeDetection = this.detectProjectType(projectStructure, packageAnalysis, projectMetadata);
        analysis.detectedType = typeDetection.type;
        analysis.confidence = typeDetection.confidence;
        
        if (analysis.detectedType && this.projectTypes[analysis.detectedType]) {
            const projectType = this.projectTypes[analysis.detectedType];
            analysis.requiredSkills = projectType.requiredSkills;
            analysis.complexity = projectType.complexity;
            analysis.recommendedTeamSize = projectType.optimalTeamSize;
            analysis.criticalRoles = projectType.criticalRoles;
        }

        analysis.techStack = packageAnalysis.technologies;
        analysis.projectCharacteristics = {
            hasDatabase: projectStructure.hasDatabase,
            hasAPI: projectStructure.hasAPI,
            hasFrontend: projectStructure.hasFrontend,
            hasTests: projectStructure.hasTests,
            hasDocker: projectStructure.hasDocker,
            complexity: this.calculateProjectComplexity(projectStructure, packageAnalysis)
        };

        console.log(`✅ Project analysis complete:`);
        console.log(`   Type: ${analysis.detectedType} (${Math.round(analysis.confidence * 100)}% confidence)`);
        console.log(`   Complexity: ${Math.round(analysis.complexity * 100)}%`);
        console.log(`   Required skills: ${analysis.requiredSkills.join(', ')}`);
        
        this.teamState.projectAnalysis = analysis;
        this.saveTeamState();
        
        return analysis;
    }

    /**
     * Generate optimal team composition recommendations
     */
    generateTeamRecommendations(projectAnalysis, availableSessions = [], strategy = 'hybrid') {
        console.log('🧠 Generating team recommendations...');
        
        const recommendations = {
            strategy: strategy,
            optimalTeam: [],
            alternativeTeams: [],
            sessionRoleAssignments: {},
            teamMetrics: {
                skillCoverage: 0,
                balanceScore: 0,
                efficiencyScore: 0,
                riskScore: 0
            },
            recommendations: [],
            warnings: []
        };

        // Analyze available sessions and assign roles
        const sessionAnalysis = this.analyzeAvailableSessions(availableSessions);
        
        // Generate primary team recommendation
        const primaryTeam = this.optimizeTeamComposition(
            projectAnalysis, 
            sessionAnalysis, 
            strategy
        );
        
        recommendations.optimalTeam = primaryTeam.team;
        recommendations.sessionRoleAssignments = primaryTeam.roleAssignments;
        recommendations.teamMetrics = primaryTeam.metrics;

        // Generate alternative team compositions
        const alternatives = ['balanced', 'specialist_heavy', 'generalist_heavy']
            .filter(s => s !== strategy)
            .map(s => this.optimizeTeamComposition(projectAnalysis, sessionAnalysis, s));
        
        recommendations.alternativeTeams = alternatives;

        // Generate specific recommendations
        recommendations.recommendations = this.generateSpecificRecommendations(
            projectAnalysis, 
            primaryTeam, 
            sessionAnalysis
        );

        // Identify potential issues and warnings
        recommendations.warnings = this.identifyTeamWarnings(
            projectAnalysis, 
            primaryTeam
        );

        console.log(`✅ Team recommendations generated:`);
        console.log(`   Optimal team size: ${primaryTeam.team.length} members`);
        console.log(`   Skill coverage: ${Math.round(primaryTeam.metrics.skillCoverage * 100)}%`);
        console.log(`   Balance score: ${Math.round(primaryTeam.metrics.balanceScore * 100)}%`);

        this.teamState.teamCompositions[Date.now()] = recommendations;
        this.saveTeamState();

        return recommendations;
    }

    /**
     * Optimize team composition based on strategy
     */
    optimizeTeamComposition(projectAnalysis, sessionAnalysis, strategy) {
        const requiredSkills = projectAnalysis.requiredSkills;
        const criticalRoles = projectAnalysis.criticalRoles;
        const availableSessions = sessionAnalysis.sessions;
        
        const team = {
            team: [],
            roleAssignments: {},
            metrics: {
                skillCoverage: 0,
                balanceScore: 0,
                efficiencyScore: 0,
                riskScore: 0
            },
            strategy: strategy
        };

        // Score sessions for each required role
        const sessionScores = this.scoreSessionsForRoles(
            availableSessions, 
            criticalRoles, 
            requiredSkills
        );

        // Select optimal team based on strategy
        switch (strategy) {
            case 'specialist_heavy':
                team.team = this.selectSpecialistHeavyTeam(sessionScores, criticalRoles);
                break;
            case 'generalist_heavy':
                team.team = this.selectGeneralistHeavyTeam(sessionScores, requiredSkills);
                break;
            case 'balanced':
                team.team = this.selectBalancedTeam(sessionScores, criticalRoles, requiredSkills);
                break;
            default: // hybrid
                team.team = this.selectHybridTeam(sessionScores, criticalRoles, requiredSkills);
        }

        // Assign roles to selected team members
        team.roleAssignments = this.assignRolesToTeam(team.team, criticalRoles, sessionScores);
        
        // Calculate team metrics
        team.metrics = this.calculateTeamMetrics(
            team.team, 
            team.roleAssignments, 
            requiredSkills, 
            projectAnalysis
        );

        return team;
    }

    /**
     * Analyze project structure
     */
    analyzeProjectStructure(projectPath) {
        const structure = {
            hasDatabase: false,
            hasAPI: false,
            hasFrontend: false,
            hasTests: false,
            hasDocker: false,
            directories: [],
            fileTypes: {}
        };

        if (!fs.existsSync(projectPath)) {
            return structure;
        }

        try {
            const walkDirectory = (dir) => {
                const files = fs.readdirSync(dir);
                
                for (const file of files) {
                    const filePath = path.join(dir, file);
                    const stat = fs.statSync(filePath);
                    
                    if (stat.isDirectory()) {
                        structure.directories.push(file);
                        
                        // Check for specific patterns
                        if (['api', 'routes', 'controllers', 'endpoints'].includes(file.toLowerCase())) {
                            structure.hasAPI = true;
                        }
                        if (['frontend', 'client', 'web', 'ui', 'components'].includes(file.toLowerCase())) {
                            structure.hasFrontend = true;
                        }
                        if (['test', 'tests', '__tests__', 'spec'].includes(file.toLowerCase())) {
                            structure.hasTests = true;
                        }
                        if (['models', 'database', 'db', 'schema'].includes(file.toLowerCase())) {
                            structure.hasDatabase = true;
                        }
                        
                        if (file !== 'node_modules' && file !== '.git') {
                            walkDirectory(filePath);
                        }
                    } else {
                        const ext = path.extname(file);
                        structure.fileTypes[ext] = (structure.fileTypes[ext] || 0) + 1;
                        
                        // Check for specific files
                        if (file === 'Dockerfile' || file === 'docker-compose.yml') {
                            structure.hasDocker = true;
                        }
                        if (file.includes('database') || file.includes('db') || ext === '.sql') {
                            structure.hasDatabase = true;
                        }
                    }
                }
            };

            walkDirectory(projectPath);
        } catch (error) {
            console.warn(`Warning: Could not analyze project structure: ${error.message}`);
        }

        return structure;
    }

    /**
     * Analyze package files for technology detection
     */
    analyzePackageFiles(projectPath) {
        const analysis = {
            technologies: [],
            dependencies: [],
            framework: null,
            language: null
        };

        // Check package.json
        const packageJsonPath = path.join(projectPath, 'package.json');
        if (fs.existsSync(packageJsonPath)) {
            try {
                const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
                const deps = { ...packageJson.dependencies, ...packageJson.devDependencies };
                
                analysis.dependencies = Object.keys(deps);
                
                // Detect frameworks and technologies
                if (deps.react) analysis.technologies.push('react');
                if (deps.vue) analysis.technologies.push('vue');
                if (deps.angular) analysis.technologies.push('angular');
                if (deps.express) analysis.technologies.push('express');
                if (deps.fastify) analysis.technologies.push('fastify');
                if (deps.prisma) analysis.technologies.push('prisma');
                if (deps.mongoose) analysis.technologies.push('mongoose');
                if (deps.stripe) analysis.technologies.push('stripe');
                if (deps['@types/node']) analysis.technologies.push('typescript');
            } catch (error) {
                console.warn(`Warning: Could not parse package.json: ${error.message}`);
            }
        }

        // Check requirements.txt (Python)
        const requirementsPath = path.join(projectPath, 'requirements.txt');
        if (fs.existsSync(requirementsPath)) {
            analysis.language = 'python';
            analysis.technologies.push('python');
            
            try {
                const requirements = fs.readFileSync(requirementsPath, 'utf8');
                if (requirements.includes('django')) analysis.technologies.push('django');
                if (requirements.includes('flask')) analysis.technologies.push('flask');
                if (requirements.includes('fastapi')) analysis.technologies.push('fastapi');
                if (requirements.includes('tensorflow')) analysis.technologies.push('tensorflow');
                if (requirements.includes('scikit-learn')) analysis.technologies.push('machine_learning');
            } catch (error) {
                console.warn(`Warning: Could not read requirements.txt: ${error.message}`);
            }
        }

        // Check go.mod (Go)
        const goModPath = path.join(projectPath, 'go.mod');
        if (fs.existsSync(goModPath)) {
            analysis.language = 'go';
            analysis.technologies.push('go');
        }

        return analysis;
    }

    /**
     * Detect project type based on analysis
     */
    detectProjectType(structure, packageAnalysis, metadata) {
        const scores = {};
        
        // Score each project type based on indicators
        for (const [type, config] of Object.entries(this.projectTypes)) {
            scores[type] = 0;
            
            // Check required skills alignment
            const techMatch = packageAnalysis.technologies.filter(tech => 
                config.requiredSkills.includes(tech)
            ).length;
            scores[type] += techMatch * 0.3;
            
            // Check structural indicators
            if (type === 'ecommerce' && packageAnalysis.technologies.includes('stripe')) {
                scores[type] += 0.4;
            }
            if (type === 'web_fullstack' && structure.hasFrontend && structure.hasAPI) {
                scores[type] += 0.4;
            }
            if (type === 'api_microservices' && structure.hasAPI && !structure.hasFrontend) {
                scores[type] += 0.5;
            }
            if (type === 'mobile_app' && packageAnalysis.technologies.includes('react-native')) {
                scores[type] += 0.6;
            }
            if (type === 'ai_ml_project' && packageAnalysis.technologies.includes('machine_learning')) {
                scores[type] += 0.6;
            }
            
            // Check metadata hints
            if (metadata.type === type) {
                scores[type] += 0.3;
            }
        }

        // Find best match
        const bestMatch = Object.entries(scores).reduce((best, [type, score]) => 
            score > best.score ? { type, score } : best
        , { type: 'web_fullstack', score: 0 });

        return {
            type: bestMatch.type,
            confidence: Math.min(bestMatch.score, 1.0)
        };
    }

    /**
     * Calculate project complexity
     */
    calculateProjectComplexity(structure, packageAnalysis) {
        let complexity = 0;
        
        // File type diversity
        complexity += Math.min(Object.keys(structure.fileTypes).length * 0.1, 0.3);
        
        // Technology stack size
        complexity += Math.min(packageAnalysis.technologies.length * 0.05, 0.2);
        
        // Structural complexity
        if (structure.hasDatabase) complexity += 0.2;
        if (structure.hasAPI) complexity += 0.15;
        if (structure.hasFrontend) complexity += 0.15;
        if (structure.hasDocker) complexity += 0.1;
        
        return Math.min(complexity, 1.0);
    }

    /**
     * Analyze available sessions for role assignment
     */
    analyzeAvailableSessions(sessions) {
        return {
            sessions: sessions.map(session => ({
                id: session.id,
                skills: this.inferSessionSkills(session),
                experience: session.experience || {},
                availability: session.availability || 1.0,
                preferences: session.preferences || {}
            })),
            totalAvailable: sessions.length,
            skillDistribution: this.calculateSkillDistribution(sessions)
        };
    }

    /**
     * Infer session skills from history and metadata
     */
    inferSessionSkills(session) {
        // This would analyze session history, completed tasks, etc.
        // For now, return mock skills based on session ID pattern
        const skills = ['frontend', 'backend']; // Default
        
        if (session.metadata?.expertise) {
            skills.push(...session.metadata.expertise);
        }
        
        return [...new Set(skills)];
    }

    /**
     * Score sessions for specific roles
     */
    scoreSessionsForRoles(sessions, criticalRoles, requiredSkills) {
        const scores = {};
        
        for (const session of sessions) {
            scores[session.id] = {};
            
            for (const role of criticalRoles) {
                const roleConfig = this.sessionRoles[role];
                if (!roleConfig) continue;
                
                let score = 0;
                
                // Skill match scoring
                const skillMatches = session.skills.filter(skill => 
                    roleConfig.skills.includes(skill)
                ).length;
                score += (skillMatches / roleConfig.skills.length) * 0.7;
                
                // Experience bonus
                score += (session.experience[role] || 0) * 0.2;
                
                // Availability factor
                score *= session.availability;
                
                scores[session.id][role] = Math.min(score, 1.0);
            }
        }
        
        return scores;
    }

    /**
     * Select different team compositions based on strategy
     */
    selectSpecialistHeavyTeam(sessionScores, criticalRoles) {
        const team = [];
        const usedSessions = new Set();
        
        // Select best specialist for each critical role
        for (const role of criticalRoles) {
            let bestSession = null;
            let bestScore = 0;
            
            for (const [sessionId, scores] of Object.entries(sessionScores)) {
                if (!usedSessions.has(sessionId) && scores[role] > bestScore) {
                    bestScore = scores[role];
                    bestSession = sessionId;
                }
            }
            
            if (bestSession && bestScore > 0.5) {
                team.push(bestSession);
                usedSessions.add(bestSession);
            }
        }
        
        return team;
    }

    selectGeneralistHeavyTeam(sessionScores, requiredSkills) {
        const team = [];
        
        // Score sessions by versatility across all required skills
        const versatilityScores = {};
        for (const [sessionId, scores] of Object.entries(sessionScores)) {
            const roleScores = Object.values(scores);
            versatilityScores[sessionId] = {
                average: roleScores.reduce((sum, score) => sum + score, 0) / roleScores.length,
                coverage: roleScores.filter(score => score > 0.3).length
            };
        }
        
        // Select most versatile sessions
        const sortedSessions = Object.entries(versatilityScores)
            .sort(([,a], [,b]) => (b.coverage * b.average) - (a.coverage * a.average))
            .slice(0, 3);
        
        return sortedSessions.map(([sessionId]) => sessionId);
    }

    selectBalancedTeam(sessionScores, criticalRoles, requiredSkills) {
        // Implement balanced team selection logic
        return this.selectHybridTeam(sessionScores, criticalRoles, requiredSkills);
    }

    selectHybridTeam(sessionScores, criticalRoles, requiredSkills) {
        const team = [];
        const usedSessions = new Set();
        
        // First, ensure critical roles are covered
        const criticalCoverage = {};
        for (const role of criticalRoles.slice(0, 2)) { // Top 2 critical roles
            let bestSession = null;
            let bestScore = 0;
            
            for (const [sessionId, scores] of Object.entries(sessionScores)) {
                if (!usedSessions.has(sessionId) && scores[role] > bestScore) {
                    bestScore = scores[role];
                    bestSession = sessionId;
                }
            }
            
            if (bestSession && bestScore > 0.4) {
                team.push(bestSession);
                usedSessions.add(bestSession);
                criticalCoverage[role] = bestSession;
            }
        }
        
        // Then add versatile members for remaining needs
        const remainingNeeds = requiredSkills.filter(skill => 
            !team.some(sessionId => 
                sessionScores[sessionId] && 
                Object.values(sessionScores[sessionId]).some(score => score > 0.3)
            )
        );
        
        if (remainingNeeds.length > 0 && team.length < 4) {
            // Add one versatile generalist
            const versatilityScores = {};
            for (const [sessionId, scores] of Object.entries(sessionScores)) {
                if (!usedSessions.has(sessionId)) {
                    const roleScores = Object.values(scores);
                    versatilityScores[sessionId] = 
                        roleScores.reduce((sum, score) => sum + score, 0) / roleScores.length;
                }
            }
            
            const bestGeneralist = Object.entries(versatilityScores)
                .sort(([,a], [,b]) => b - a)[0];
            
            if (bestGeneralist && bestGeneralist[1] > 0.3) {
                team.push(bestGeneralist[0]);
            }
        }
        
        return team;
    }

    /**
     * Assign roles to selected team members
     */
    assignRolesToTeam(team, criticalRoles, sessionScores) {
        const assignments = {};
        const assignedRoles = new Set();
        
        // Assign critical roles first
        for (const sessionId of team) {
            let bestRole = null;
            let bestScore = 0;
            
            for (const role of criticalRoles) {
                if (!assignedRoles.has(role) && 
                    sessionScores[sessionId] && 
                    sessionScores[sessionId][role] > bestScore) {
                    bestScore = sessionScores[sessionId][role];
                    bestRole = role;
                }
            }
            
            if (bestRole) {
                assignments[sessionId] = bestRole;
                assignedRoles.add(bestRole);
            } else {
                assignments[sessionId] = 'support_generalist';
            }
        }
        
        return assignments;
    }

    /**
     * Calculate team performance metrics
     */
    calculateTeamMetrics(team, roleAssignments, requiredSkills, projectAnalysis) {
        const metrics = {
            skillCoverage: 0,
            balanceScore: 0,
            efficiencyScore: 0,
            riskScore: 0
        };

        // Skill coverage calculation
        const coveredSkills = new Set();
        for (const sessionId of team) {
            const role = roleAssignments[sessionId];
            const roleConfig = this.sessionRoles[role];
            if (roleConfig) {
                roleConfig.skills.forEach(skill => coveredSkills.add(skill));
            }
        }
        
        metrics.skillCoverage = Math.min(coveredSkills.size / requiredSkills.length, 1.0);
        
        // Balance score (even distribution of workload)
        const roleDistribution = Object.values(roleAssignments);
        const uniqueRoles = new Set(roleDistribution);
        metrics.balanceScore = Math.min(uniqueRoles.size / team.length, 1.0);
        
        // Efficiency score (team size vs project complexity)
        const optimalSize = projectAnalysis.recommendedTeamSize;
        const sizeScore = team.length >= optimalSize[0] && team.length <= optimalSize[1] ? 1.0 : 0.7;
        metrics.efficiencyScore = sizeScore * metrics.skillCoverage;
        
        // Risk score (critical role coverage)
        const criticalRolesCovered = projectAnalysis.criticalRoles.filter(role =>
            Object.values(roleAssignments).includes(role)
        ).length;
        metrics.riskScore = 1.0 - (criticalRolesCovered / projectAnalysis.criticalRoles.length);
        
        return metrics;
    }

    /**
     * Generate specific recommendations for team improvement
     */
    generateSpecificRecommendations(projectAnalysis, primaryTeam, sessionAnalysis) {
        const recommendations = [];
        
        // Check skill coverage gaps
        const requiredSkills = new Set(projectAnalysis.requiredSkills);
        const coveredSkills = new Set();
        
        for (const sessionId of primaryTeam.team) {
            const role = primaryTeam.roleAssignments[sessionId];
            const roleConfig = this.sessionRoles[role];
            if (roleConfig) {
                roleConfig.skills.forEach(skill => coveredSkills.add(skill));
            }
        }
        
        const missingSkills = [...requiredSkills].filter(skill => !coveredSkills.has(skill));
        if (missingSkills.length > 0) {
            recommendations.push({
                type: 'skill_gap',
                priority: 'high',
                description: `Consider adding expertise in: ${missingSkills.join(', ')}`,
                action: 'recruit_specialist'
            });
        }
        
        // Team size recommendations
        const teamSize = primaryTeam.team.length;
        const optimalRange = projectAnalysis.recommendedTeamSize;
        
        if (teamSize < optimalRange[0]) {
            recommendations.push({
                type: 'team_size',
                priority: 'medium',
                description: `Team might be understaffed. Consider adding ${optimalRange[0] - teamSize} more member(s)`,
                action: 'expand_team'
            });
        } else if (teamSize > optimalRange[1]) {
            recommendations.push({
                type: 'team_size',
                priority: 'low',
                description: `Team might be overstaffed. Consider optimizing with ${teamSize - optimalRange[1]} fewer member(s)`,
                action: 'optimize_team'
            });
        }
        
        // Role balance recommendations
        const roleDistribution = Object.values(primaryTeam.roleAssignments);
        const roleCount = {};
        roleDistribution.forEach(role => {
            roleCount[role] = (roleCount[role] || 0) + 1;
        });
        
        const duplicateRoles = Object.entries(roleCount).filter(([role, count]) => count > 1);
        if (duplicateRoles.length > 0) {
            recommendations.push({
                type: 'role_balance',
                priority: 'low',
                description: `Multiple members assigned to same role: ${duplicateRoles.map(([role]) => role).join(', ')}`,
                action: 'rebalance_roles'
            });
        }
        
        return recommendations;
    }

    /**
     * Identify potential team warnings
     */
    identifyTeamWarnings(projectAnalysis, primaryTeam) {
        const warnings = [];
        
        // High risk score warning
        if (primaryTeam.metrics.riskScore > 0.5) {
            warnings.push({
                type: 'high_risk',
                severity: 'warning',
                message: 'Team has high risk due to missing critical roles'
            });
        }
        
        // Low skill coverage warning
        if (primaryTeam.metrics.skillCoverage < 0.7) {
            warnings.push({
                type: 'skill_gap',
                severity: 'warning',
                message: 'Team may not have sufficient skill coverage for project requirements'
            });
        }
        
        // Complex project with small team warning
        if (projectAnalysis.complexity > 0.8 && primaryTeam.team.length < 3) {
            warnings.push({
                type: 'complexity_mismatch',
                severity: 'caution',
                message: 'High complexity project with small team - consider adding more members'
            });
        }
        
        return warnings;
    }

    /**
     * Calculate skill distribution across sessions
     */
    calculateSkillDistribution(sessions) {
        const distribution = {};
        
        for (const session of sessions) {
            const skills = this.inferSessionSkills(session);
            for (const skill of skills) {
                distribution[skill] = (distribution[skill] || 0) + 1;
            }
        }
        
        return distribution;
    }

    /**
     * Get formatted team recommendations
     */
    getFormattedRecommendations(projectPath, availableSessions, strategy = 'hybrid', metadata = {}) {
        console.log('🎯 Generating comprehensive team recommendations...\n');
        
        // Analyze project
        const projectAnalysis = this.analyzeProjectRequirements(projectPath, metadata);
        
        // Generate team recommendations
        const recommendations = this.generateTeamRecommendations(
            projectAnalysis, 
            availableSessions, 
            strategy
        );
        
        return {
            projectAnalysis,
            recommendations,
            summary: this.generateRecommendationSummary(projectAnalysis, recommendations)
        };
    }

    /**
     * Generate summary of recommendations
     */
    generateRecommendationSummary(projectAnalysis, recommendations) {
        return {
            projectType: projectAnalysis.detectedType,
            confidence: projectAnalysis.confidence,
            complexity: projectAnalysis.complexity,
            teamSize: recommendations.optimalTeam.length,
            skillCoverage: recommendations.teamMetrics.skillCoverage,
            efficiency: recommendations.teamMetrics.efficiencyScore,
            criticalWarnings: recommendations.warnings.filter(w => w.severity === 'warning').length,
            keyRecommendations: recommendations.recommendations.filter(r => r.priority === 'high').length
        };
    }
}

// CLI Interface
async function main() {
    const args = process.argv.slice(2);
    const command = args[0] || 'help';
    
    const teamAI = new TeamOptimizationAI();

    try {
        switch (command) {
            case 'analyze':
                const projectPath = args[1] || process.cwd();
                await teamAI.analyzeProjectRequirements(projectPath);
                break;
                
            case 'recommend':
                const recProjectPath = args[1] || process.cwd();
                const strategy = args[2] || 'hybrid';
                
                // Mock available sessions for demo
                const mockSessions = [
                    { id: 'session-1', metadata: { expertise: ['frontend', 'react'] } },
                    { id: 'session-2', metadata: { expertise: ['backend', 'api'] } },
                    { id: 'session-3', metadata: { expertise: ['database', 'sql'] } }
                ];
                
                const result = teamAI.getFormattedRecommendations(
                    recProjectPath, 
                    mockSessions, 
                    strategy
                );
                
                console.log('\n🎯 Team Optimization Results');
                console.log('============================\n');
                
                console.log(`📁 Project Type: ${result.projectAnalysis.detectedType}`);
                console.log(`🎯 Confidence: ${Math.round(result.projectAnalysis.confidence * 100)}%`);
                console.log(`🔥 Complexity: ${Math.round(result.projectAnalysis.complexity * 100)}%`);
                console.log(`👥 Recommended Team Size: ${result.recommendations.optimalTeam.length} members\n`);
                
                console.log('🏆 Optimal Team Composition:');
                result.recommendations.optimalTeam.forEach((sessionId, index) => {
                    const role = result.recommendations.sessionRoleAssignments[sessionId];
                    const roleConfig = teamAI.sessionRoles[role];
                    console.log(`   ${index + 1}. ${sessionId} → ${roleConfig?.name || role}`);
                    if (roleConfig?.strengths) {
                        console.log(`      Strengths: ${roleConfig.strengths}`);
                    }
                });
                
                console.log('\n📊 Team Metrics:');
                console.log(`   Skill Coverage: ${Math.round(result.recommendations.teamMetrics.skillCoverage * 100)}%`);
                console.log(`   Balance Score: ${Math.round(result.recommendations.teamMetrics.balanceScore * 100)}%`);
                console.log(`   Efficiency: ${Math.round(result.recommendations.teamMetrics.efficiencyScore * 100)}%`);
                console.log(`   Risk Level: ${Math.round(result.recommendations.teamMetrics.riskScore * 100)}%`);
                
                if (result.recommendations.recommendations.length > 0) {
                    console.log('\n💡 Recommendations:');
                    result.recommendations.recommendations.forEach(rec => {
                        console.log(`   • ${rec.description} (${rec.priority} priority)`);
                    });
                }
                
                if (result.recommendations.warnings.length > 0) {
                    console.log('\n⚠️  Warnings:');
                    result.recommendations.warnings.forEach(warning => {
                        console.log(`   • ${warning.message} (${warning.severity})`);
                    });
                }
                
                break;
                
            default:
                console.log(`
🧠 Team Optimization AI v4.0 - Intelligent Team Composition

Usage: node team-optimization-ai.js <command> [options]

Commands:
  analyze [project-path]           Analyze project requirements and type
  recommend [project-path] [strategy]  Generate optimal team recommendations

Strategies:
  hybrid           Mix of specialists and generalists (default)
  specialist_heavy Deep expertise focus
  generalist_heavy Flexible, versatile team
  balanced         Even skill distribution

Examples:
  node team-optimization-ai.js analyze ./my-ecommerce-project
  node team-optimization-ai.js recommend ./api-project specialist_heavy
  node team-optimization-ai.js recommend . balanced

Features:
  🔍 Automatic project type detection
  🎯 Role-based team optimization  
  📊 Skill coverage analysis
  ⚖️  Team balance scoring
  🚨 Risk assessment and warnings
  💡 Actionable improvement recommendations
                `);
                break;
        }
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
    }
}

// Export for use as module
module.exports = TeamOptimizationAI;

// Run CLI if executed directly
if (require.main === module) {
    main();
}