#!/usr/bin/env node

/**
 * AI Specialization Engine - Intelligent AI Team Composition
 * Part of the Autonomous AI Team Orchestrator system
 * 
 * This engine analyzes project requirements and optimally assigns
 * AI agents based on their specializations, performance history,
 * and current workload for maximum efficiency and quality.
 */

const fs = require('fs');
const path = require('path');
const EventEmitter = require('events');

class AISpecializationEngine extends EventEmitter {
    constructor(coordinationDir = '.claude-coordination') {
        super();
        
        this.coordinationDir = path.resolve(coordinationDir);
        this.specializationDataFile = path.join(this.coordinationDir, 'ai-specializations.json');
        this.performanceHistoryFile = path.join(this.coordinationDir, 'ai-performance-history.json');
        
        // AI capability registry
        this.aiCapabilities = new Map();
        this.performanceHistory = new Map();
        
        // Load balancing and optimization
        this.loadBalancer = new AILoadBalancer();
        this.performanceOptimizer = new PerformanceOptimizer();
        
        // Specialization categories and their weights
        this.specializationCategories = {
            'frontend': {
                skills: ['react', 'vue', 'angular', 'typescript', 'css', 'html', 'ui-ux', 'responsive-design'],
                weight: 1.0,
                importance: 'high'
            },
            'backend': {
                skills: ['nodejs', 'python', 'java', 'api-design', 'microservices', 'database-integration'],
                weight: 1.0,
                importance: 'high'
            },
            'database': {
                skills: ['sql', 'postgresql', 'mongodb', 'redis', 'schema-design', 'query-optimization'],
                weight: 0.8,
                importance: 'medium'
            },
            'devops': {
                skills: ['docker', 'kubernetes', 'ci-cd', 'aws', 'monitoring', 'deployment'],
                weight: 0.7,
                importance: 'medium'
            },
            'security': {
                skills: ['authentication', 'authorization', 'encryption', 'vulnerability-assessment', 'compliance'],
                weight: 0.9,
                importance: 'high'
            },
            'testing': {
                skills: ['unit-testing', 'integration-testing', 'e2e-testing', 'test-automation', 'qa'],
                weight: 0.6,
                importance: 'medium'
            },
            'mobile': {
                skills: ['react-native', 'flutter', 'ios', 'android', 'mobile-optimization'],
                weight: 0.8,
                importance: 'medium'
            },
            'ai-ml': {
                skills: ['machine-learning', 'natural-language-processing', 'data-analysis', 'tensorflow'],
                weight: 0.9,
                importance: 'low'
            },
            'system-architecture': {
                skills: ['system-design', 'scalability', 'performance', 'architecture-patterns'],
                weight: 1.0,
                importance: 'high'
            },
            'documentation': {
                skills: ['technical-writing', 'api-documentation', 'user-guides', 'code-comments'],
                weight: 0.5,
                importance: 'low'
            }
        };
        
        // Default AI profiles based on known capabilities
        this.defaultAIProfiles = {
            'claude-code': {
                id: 'claude-code',
                name: 'Claude Code',
                type: 'anthropic',
                specializations: ['frontend', 'system-architecture', 'documentation'],
                skills: {
                    'react': 0.95,
                    'typescript': 0.90,
                    'ui-ux': 0.85,
                    'system-design': 0.90,
                    'code-generation': 0.95,
                    'debugging': 0.90,
                    'technical-writing': 0.95
                },
                performance: {
                    averageResponseTime: 2000,
                    successRate: 0.95,
                    qualityScore: 0.92,
                    maxConcurrentTasks: 3
                },
                preferences: {
                    taskTypes: ['component-creation', 'ui-implementation', 'code-review', 'documentation'],
                    projectTypes: ['web-app', 'frontend-focused'],
                    complexity: ['medium', 'high']
                }
            },
            'openai-gpt4': {
                id: 'openai-gpt4',
                name: 'GPT-4',
                type: 'openai',
                specializations: ['backend', 'database', 'ai-ml'],
                skills: {
                    'nodejs': 0.90,
                    'python': 0.95,
                    'api-design': 0.88,
                    'database-design': 0.85,
                    'microservices': 0.80,
                    'machine-learning': 0.92,
                    'data-analysis': 0.88
                },
                performance: {
                    averageResponseTime: 1500,
                    successRate: 0.92,
                    qualityScore: 0.89,
                    maxConcurrentTasks: 4
                },
                preferences: {
                    taskTypes: ['api-development', 'system-design', 'database-schema', 'algorithm-optimization'],
                    projectTypes: ['backend-heavy', 'data-intensive'],
                    complexity: ['medium', 'high']
                }
            },
            'anthropic-claude': {
                id: 'anthropic-claude',
                name: 'Claude Assistant',
                type: 'anthropic',
                specializations: ['security', 'testing', 'system-architecture'],
                skills: {
                    'security': 0.92,
                    'testing': 0.88,
                    'code-analysis': 0.90,
                    'vulnerability-assessment': 0.85,
                    'system-design': 0.87,
                    'optimization': 0.83
                },
                performance: {
                    averageResponseTime: 1800,
                    successRate: 0.94,
                    qualityScore: 0.91,
                    maxConcurrentTasks: 2
                },
                preferences: {
                    taskTypes: ['code-analysis', 'security-audit', 'test-generation', 'optimization'],
                    projectTypes: ['security-critical', 'enterprise'],
                    complexity: ['high']
                }
            },
            'specialized-devops': {
                id: 'specialized-devops',
                name: 'DevOps Specialist',
                type: 'specialized',
                specializations: ['devops', 'security'],
                skills: {
                    'docker': 0.95,
                    'kubernetes': 0.90,
                    'ci-cd': 0.92,
                    'aws': 0.88,
                    'monitoring': 0.85,
                    'deployment': 0.93,
                    'infrastructure': 0.87
                },
                performance: {
                    averageResponseTime: 3000,
                    successRate: 0.90,
                    qualityScore: 0.88,
                    maxConcurrentTasks: 2
                },
                preferences: {
                    taskTypes: ['deployment-setup', 'pipeline-creation', 'infrastructure', 'monitoring-setup'],
                    projectTypes: ['enterprise', 'scalable'],
                    complexity: ['medium', 'high']
                }
            },
            'database-specialist': {
                id: 'database-specialist',
                name: 'Database Designer',
                type: 'specialized',
                specializations: ['database', 'backend'],
                skills: {
                    'postgresql': 0.95,
                    'mongodb': 0.88,
                    'redis': 0.85,
                    'schema-design': 0.92,
                    'query-optimization': 0.90,
                    'data-modeling': 0.88,
                    'migration-planning': 0.85
                },
                performance: {
                    averageResponseTime: 2500,
                    successRate: 0.91,
                    qualityScore: 0.89,
                    maxConcurrentTasks: 2
                },
                preferences: {
                    taskTypes: ['schema-design', 'query-optimization', 'data-migration', 'database-setup'],
                    projectTypes: ['data-heavy', 'enterprise'],
                    complexity: ['medium', 'high']
                }
            },
            'mobile-specialist': {
                id: 'mobile-specialist',
                name: 'Mobile App Developer',
                type: 'specialized',
                specializations: ['mobile', 'frontend'],
                skills: {
                    'react-native': 0.92,
                    'flutter': 0.88,
                    'ios': 0.85,
                    'android': 0.87,
                    'mobile-optimization': 0.90,
                    'responsive-design': 0.85
                },
                performance: {
                    averageResponseTime: 2200,
                    successRate: 0.89,
                    qualityScore: 0.86,
                    maxConcurrentTasks: 2
                },
                preferences: {
                    taskTypes: ['mobile-ui', 'cross-platform', 'mobile-optimization', 'native-features'],
                    projectTypes: ['mobile-app', 'cross-platform'],
                    complexity: ['medium', 'high']
                }
            }
        };
        
        // Initialize engine
        this.initializeEngine();
        
        console.log('🧠 AI Specialization Engine initialized');
    }
    
    /**
     * Initialize the specialization engine
     */
    initializeEngine() {
        // Load existing data
        this.loadSpecializationData();
        this.loadPerformanceHistory();
        
        // Register default AI profiles
        for (const profile of Object.values(this.defaultAIProfiles)) {
            this.registerAICapabilities(profile);
        }
        
        // Set up periodic optimization
        this.optimizationInterval = setInterval(() => {
            this.performPeriodicOptimization();
        }, 300000); // Every 5 minutes
    }
    
    /**
     * Register AI capabilities and specializations
     */
    registerAICapabilities(aiProfile) {
        this.aiCapabilities.set(aiProfile.id, {
            ...aiProfile,
            registeredAt: Date.now(),
            lastUpdated: Date.now(),
            currentLoad: 0,
            activeAssignments: [],
            totalTasksCompleted: 0,
            averageTaskDuration: 0
        });
        
        // Initialize performance tracking
        if (!this.performanceHistory.has(aiProfile.id)) {
            this.performanceHistory.set(aiProfile.id, {
                taskHistory: [],
                performanceMetrics: { ...aiProfile.performance },
                specializationScores: { ...aiProfile.skills },
                improvementTrends: {},
                lastEvaluated: Date.now()
            });
        }
        
        this.emit('ai-registered', aiProfile);
        console.log(`🤖 AI capabilities registered: ${aiProfile.name}`);
    }
    
    /**
     * Select best AI for a specific task
     */
    selectBestAI(task, availableAIs = null, constraints = {}) {
        const candidates = availableAIs || Array.from(this.aiCapabilities.values());
        
        if (candidates.length === 0) {
            throw new Error('No AI candidates available for task assignment');
        }
        
        console.log(`🎯 Selecting optimal AI for task: ${task.title}`);
        
        // Score each candidate
        const scoredCandidates = candidates.map(ai => ({
            ai,
            score: this.calculateAIScore(ai, task, constraints)
        }));
        
        // Sort by score (highest first)
        scoredCandidates.sort((a, b) => b.score - a.score);
        
        // Apply load balancing
        const balancedCandidate = this.loadBalancer.selectOptimal(scoredCandidates, constraints);
        
        // Log selection reasoning
        console.log(`✅ Selected AI: ${balancedCandidate.ai.name} (score: ${balancedCandidate.score.toFixed(2)})`);
        
        return balancedCandidate.ai;
    }
    
    /**
     * Calculate AI suitability score for a specific task
     */
    calculateAIScore(ai, task, constraints = {}) {
        let score = 0;
        
        // 1. Specialization match (40% of total score)
        const specializationScore = this.calculateSpecializationScore(ai, task);
        score += specializationScore * 0.4;
        
        // 2. Skill proficiency (30% of total score)
        const skillScore = this.calculateSkillScore(ai, task);
        score += skillScore * 0.3;
        
        // 3. Performance history (20% of total score)
        const performanceScore = this.calculatePerformanceScore(ai, task);
        score += performanceScore * 0.2;
        
        // 4. Current load and availability (10% of total score)
        const availabilityScore = this.calculateAvailabilityScore(ai);
        score += availabilityScore * 0.1;
        
        // Apply constraint penalties
        score = this.applyConstraintPenalties(score, ai, constraints);
        
        return Math.max(0, Math.min(1, score)); // Clamp between 0 and 1
    }
    
    /**
     * Calculate specialization match score
     */
    calculateSpecializationScore(ai, task) {
        const requiredSpecialization = task.aiSpecialization || task.type;
        
        if (!requiredSpecialization) return 0.5; // Neutral if no specialization required
        
        // Direct specialization match
        if (ai.specializations.includes(requiredSpecialization)) {
            const category = this.specializationCategories[requiredSpecialization];
            return category ? category.weight : 0.8;
        }
        
        // Related specialization match
        const relatedScore = this.findRelatedSpecializationScore(ai.specializations, requiredSpecialization);
        return relatedScore * 0.6; // Reduced score for related but not exact match
    }
    
    /**
     * Find related specialization score
     */
    findRelatedSpecializationScore(aiSpecializations, requiredSpecialization) {
        const relationships = {
            'frontend': ['ui-ux', 'mobile'],
            'backend': ['database', 'api-design'],
            'devops': ['security', 'system-architecture'],
            'testing': ['security', 'backend'],
            'mobile': ['frontend', 'ui-ux']
        };
        
        const related = relationships[requiredSpecialization] || [];
        const matchScore = aiSpecializations
            .filter(spec => related.includes(spec))
            .length / Math.max(related.length, 1);
        
        return matchScore;
    }
    
    /**
     * Calculate skill proficiency score
     */
    calculateSkillScore(ai, task) {
        if (!ai.skills || Object.keys(ai.skills).length === 0) return 0.5;
        
        const taskKeywords = this.extractTaskKeywords(task);
        let totalScore = 0;
        let matchingSkills = 0;
        
        for (const keyword of taskKeywords) {
            if (ai.skills[keyword] !== undefined) {
                totalScore += ai.skills[keyword];
                matchingSkills++;
            }
        }
        
        if (matchingSkills === 0) {
            // If no direct skill matches, use average skill level
            const skillValues = Object.values(ai.skills);
            return skillValues.reduce((sum, skill) => sum + skill, 0) / skillValues.length;
        }
        
        return totalScore / matchingSkills;
    }
    
    /**
     * Extract keywords from task for skill matching
     */
    extractTaskKeywords(task) {
        const text = `${task.title} ${task.description || ''} ${task.type} ${task.aiSpecialization || ''}`.toLowerCase();
        
        const keywords = [];
        
        // Extract technology keywords
        const techPatterns = {
            'react': /react|jsx|tsx/,
            'typescript': /typescript|ts/,
            'nodejs': /node\.?js|node/,
            'python': /python|py/,
            'postgresql': /postgres|postgresql|pg/,
            'mongodb': /mongo|mongodb/,
            'docker': /docker|container/,
            'kubernetes': /k8s|kubernetes/,
            'aws': /aws|amazon/,
            'api-design': /api|endpoint|rest|graphql/,
            'testing': /test|spec|jest|cypress/,
            'security': /security|auth|secure/,
            'ui-ux': /ui|ux|design|interface/
        };
        
        for (const [keyword, pattern] of Object.entries(techPatterns)) {
            if (pattern.test(text)) {
                keywords.push(keyword);
            }
        }
        
        return keywords;
    }
    
    /**
     * Calculate performance score based on history
     */
    calculatePerformanceScore(ai, task) {
        const history = this.performanceHistory.get(ai.id);
        if (!history || history.taskHistory.length === 0) {
            return ai.performance?.qualityScore || 0.5; // Use default or neutral
        }
        
        const recentTasks = history.taskHistory.slice(-10); // Last 10 tasks
        const similarTasks = recentTasks.filter(t => 
            t.type === task.type || t.aiSpecialization === task.aiSpecialization
        );
        
        if (similarTasks.length === 0) {
            // Use overall performance if no similar tasks
            return history.performanceMetrics.qualityScore || 0.5;
        }
        
        // Calculate average performance on similar tasks
        const avgScore = similarTasks.reduce((sum, t) => sum + (t.qualityScore || 0.5), 0) / similarTasks.length;
        const avgTime = similarTasks.reduce((sum, t) => sum + t.completionTime, 0) / similarTasks.length;
        
        // Combine quality and speed (quality weighted more heavily)
        const timeScore = Math.max(0, 1 - (avgTime / (task.estimatedHours * 3600000))); // Penalize if takes much longer than estimated
        return (avgScore * 0.8) + (timeScore * 0.2);
    }
    
    /**
     * Calculate availability score based on current load
     */
    calculateAvailabilityScore(ai) {
        const maxConcurrent = ai.performance?.maxConcurrentTasks || 2;
        const currentLoad = ai.currentLoad || 0;
        
        if (currentLoad >= maxConcurrent) return 0; // Fully loaded
        
        const loadRatio = currentLoad / maxConcurrent;
        return 1 - (loadRatio * 0.5); // Reduce score based on load, but not linearly
    }
    
    /**
     * Apply constraint penalties to score
     */
    applyConstraintPenalties(score, ai, constraints) {
        let penalizedScore = score;
        
        // Time constraint penalty
        if (constraints.urgency === 'high' && ai.performance?.averageResponseTime > 2000) {
            penalizedScore *= 0.8;
        }
        
        // Quality constraint penalty
        if (constraints.qualityRequired === 'high' && 
            (ai.performance?.qualityScore || 0) < 0.9) {
            penalizedScore *= 0.7;
        }
        
        // Complexity penalty
        if (constraints.complexity === 'high' && 
            !ai.preferences?.complexity?.includes('high')) {
            penalizedScore *= 0.6;
        }
        
        return penalizedScore;
    }
    
    /**
     * Assemble optimal AI team for a project
     */
    assembleOptimalTeam(projectSpec, constraints = {}) {
        console.log(`🔧 Assembling optimal AI team for: ${projectSpec.type}`);
        
        const requiredSpecializations = projectSpec.requiredSpecializations || [];
        const optimalSize = projectSpec.optimalTeamSize || this.calculateOptimalTeamSize(projectSpec);
        
        const selectedAIs = [];
        const usedSpecializations = new Set();
        
        // 1. Select core specializations first
        for (const specialization of requiredSpecializations) {
            if (selectedAIs.length >= optimalSize) break;
            
            const bestAI = this.selectBestAIForSpecialization(specialization, selectedAIs, constraints);
            if (bestAI) {
                selectedAIs.push(bestAI);
                bestAI.specializations.forEach(spec => usedSpecializations.add(spec));
                
                console.log(`✅ Selected for ${specialization}: ${bestAI.name}`);
            }
        }
        
        // 2. Fill remaining spots with complementary skills
        while (selectedAIs.length < optimalSize) {
            const complementaryAI = this.selectComplementaryAI(
                selectedAIs, 
                usedSpecializations, 
                projectSpec, 
                constraints
            );
            
            if (complementaryAI) {
                selectedAIs.push(complementaryAI);
                complementaryAI.specializations.forEach(spec => usedSpecializations.add(spec));
                
                console.log(`✅ Added complementary AI: ${complementaryAI.name}`);
            } else {
                break; // No more suitable AIs available
            }
        }
        
        // 3. Optimize team composition
        const optimizedTeam = this.optimizeTeamComposition(selectedAIs, projectSpec);
        
        console.log(`🎯 Final team assembled: ${optimizedTeam.map(ai => ai.name).join(', ')}`);
        
        return optimizedTeam;
    }
    
    /**
     * Select best AI for a specific specialization
     */
    selectBestAIForSpecialization(specialization, excludeAIs = [], constraints = {}) {
        const candidates = Array.from(this.aiCapabilities.values())
            .filter(ai => 
                ai.specializations.includes(specialization) &&
                !excludeAIs.some(selected => selected.id === ai.id)
            );
        
        if (candidates.length === 0) return null;
        
        // Create a mock task for scoring
        const mockTask = {
            type: specialization,
            aiSpecialization: specialization,
            title: `${specialization} task`,
            estimatedHours: 2
        };
        
        return this.selectBestAI(mockTask, candidates, constraints);
    }
    
    /**
     * Select complementary AI to fill team gaps
     */
    selectComplementaryAI(currentTeam, usedSpecializations, projectSpec, constraints) {
        const allSpecializations = Object.keys(this.specializationCategories);
        const missingSpecializations = allSpecializations.filter(spec => 
            !usedSpecializations.has(spec) && 
            this.isSpecializationRelevant(spec, projectSpec)
        );
        
        if (missingSpecializations.length === 0) return null;
        
        // Prioritize by importance and project relevance
        missingSpecializations.sort((a, b) => {
            const importanceA = this.specializationCategories[a].importance === 'high' ? 3 : 
                              this.specializationCategories[a].importance === 'medium' ? 2 : 1;
            const importanceB = this.specializationCategories[b].importance === 'high' ? 3 : 
                              this.specializationCategories[b].importance === 'medium' ? 2 : 1;
            
            return importanceB - importanceA;
        });
        
        return this.selectBestAIForSpecialization(
            missingSpecializations[0], 
            currentTeam, 
            constraints
        );
    }
    
    /**
     * Check if specialization is relevant to project
     */
    isSpecializationRelevant(specialization, projectSpec) {
        const projectType = projectSpec.type;
        const relevanceMap = {
            'e-commerce': ['frontend', 'backend', 'database', 'security', 'testing', 'devops'],
            'web-app': ['frontend', 'backend', 'database', 'testing', 'devops'],
            'mobile-app': ['mobile', 'frontend', 'backend', 'testing'],
            'api-service': ['backend', 'database', 'security', 'testing', 'documentation'],
            'blog-cms': ['frontend', 'backend', 'database', 'testing']
        };
        
        const relevantSpecs = relevanceMap[projectType] || ['frontend', 'backend', 'testing'];
        return relevantSpecs.includes(specialization);
    }
    
    /**
     * Optimize team composition for better collaboration
     */
    optimizeTeamComposition(team, projectSpec) {
        // For now, return as-is, but could implement:
        // - Communication compatibility analysis
        // - Workload balancing
        // - Skill overlap optimization
        
        return team;
    }
    
    /**
     * Calculate optimal team size based on project
     */
    calculateOptimalTeamSize(projectSpec) {
        let baseSize = 2;
        
        // Adjust based on complexity
        if (projectSpec.complexity > 0.7) baseSize += 1;
        if (projectSpec.complexity > 0.9) baseSize += 1;
        
        // Adjust based on estimated hours
        if (projectSpec.estimatedHours > 20) baseSize += 1;
        if (projectSpec.estimatedHours > 40) baseSize += 1;
        
        // Adjust based on number of requirements
        if (projectSpec.requirements && projectSpec.requirements.length > 5) baseSize += 1;
        
        return Math.min(baseSize, 6); // Cap at 6 members
    }
    
    /**
     * Update performance metrics after task completion
     */
    updatePerformanceMetrics(aiId, taskResult) {
        const history = this.performanceHistory.get(aiId);
        if (!history) return;
        
        // Add to task history
        history.taskHistory.push({
            ...taskResult,
            completedAt: Date.now()
        });
        
        // Keep only recent history (last 100 tasks)
        if (history.taskHistory.length > 100) {
            history.taskHistory = history.taskHistory.slice(-100);
        }
        
        // Recalculate performance metrics
        this.recalculatePerformanceMetrics(aiId);
        
        // Update AI capabilities
        const ai = this.aiCapabilities.get(aiId);
        if (ai) {
            ai.totalTasksCompleted++;
            ai.lastUpdated = Date.now();
        }
        
        this.emit('performance-updated', { aiId, taskResult });
    }
    
    /**
     * Recalculate performance metrics based on recent history
     */
    recalculatePerformanceMetrics(aiId) {
        const history = this.performanceHistory.get(aiId);
        const ai = this.aiCapabilities.get(aiId);
        
        if (!history || !ai || history.taskHistory.length === 0) return;
        
        const recentTasks = history.taskHistory.slice(-20); // Last 20 tasks
        
        // Calculate averages
        const avgResponseTime = recentTasks.reduce((sum, t) => sum + t.responseTime, 0) / recentTasks.length;
        const successRate = recentTasks.filter(t => t.success).length / recentTasks.length;
        const avgQuality = recentTasks.reduce((sum, t) => sum + (t.qualityScore || 0.5), 0) / recentTasks.length;
        
        // Update performance metrics
        history.performanceMetrics = {
            averageResponseTime: Math.round(avgResponseTime),
            successRate: successRate,
            qualityScore: avgQuality,
            maxConcurrentTasks: ai.performance.maxConcurrentTasks
        };
        
        // Update AI performance reference
        ai.performance = { ...history.performanceMetrics };
        
        history.lastEvaluated = Date.now();
    }
    
    /**
     * Get performance analytics for AI
     */
    getAIAnalytics(aiId) {
        const ai = this.aiCapabilities.get(aiId);
        const history = this.performanceHistory.get(aiId);
        
        if (!ai || !history) return null;
        
        const recentTasks = history.taskHistory.slice(-30);
        
        return {
            ai: {
                id: ai.id,
                name: ai.name,
                specializations: ai.specializations,
                totalTasksCompleted: ai.totalTasksCompleted
            },
            performance: history.performanceMetrics,
            trends: {
                tasksLastMonth: recentTasks.length,
                averageTasksPerWeek: recentTasks.length / 4,
                improvementScore: this.calculateImprovementScore(recentTasks),
                specialtyStrengths: this.identifySpecialtyStrengths(recentTasks)
            },
            recommendations: this.generateAIRecommendations(ai, history)
        };
    }
    
    /**
     * Calculate improvement score based on recent performance
     */
    calculateImprovementScore(recentTasks) {
        if (recentTasks.length < 10) return 0;
        
        const firstHalf = recentTasks.slice(0, Math.floor(recentTasks.length / 2));
        const secondHalf = recentTasks.slice(Math.floor(recentTasks.length / 2));
        
        const firstAvg = firstHalf.reduce((sum, t) => sum + (t.qualityScore || 0.5), 0) / firstHalf.length;
        const secondAvg = secondHalf.reduce((sum, t) => sum + (t.qualityScore || 0.5), 0) / secondHalf.length;
        
        return secondAvg - firstAvg; // Positive means improvement
    }
    
    /**
     * Identify specialty strengths
     */
    identifySpecialtyStrengths(recentTasks) {
        const specialtyScores = {};
        
        recentTasks.forEach(task => {
            const specialty = task.aiSpecialization || task.type;
            if (!specialtyScores[specialty]) {
                specialtyScores[specialty] = { count: 0, totalScore: 0 };
            }
            specialtyScores[specialty].count++;
            specialtyScores[specialty].totalScore += task.qualityScore || 0.5;
        });
        
        // Calculate averages and sort by performance
        const strengths = Object.entries(specialtyScores)
            .map(([specialty, data]) => ({
                specialty,
                averageScore: data.totalScore / data.count,
                taskCount: data.count
            }))
            .sort((a, b) => b.averageScore - a.averageScore);
        
        return strengths.slice(0, 3); // Top 3 strengths
    }
    
    /**
     * Generate recommendations for AI improvement
     */
    generateAIRecommendations(ai, history) {
        const recommendations = [];
        
        if (history.performanceMetrics.successRate < 0.8) {
            recommendations.push({
                type: 'improvement',
                priority: 'high',
                message: 'Focus on task completion consistency'
            });
        }
        
        if (history.performanceMetrics.averageResponseTime > 5000) {
            recommendations.push({
                type: 'optimization',
                priority: 'medium',
                message: 'Work on response time optimization'
            });
        }
        
        if (ai.totalTasksCompleted > 50 && history.performanceMetrics.qualityScore > 0.9) {
            recommendations.push({
                type: 'expansion',
                priority: 'low',
                message: 'Consider expanding to related specializations'
            });
        }
        
        return recommendations;
    }
    
    /**
     * Perform periodic optimization
     */
    performPeriodicOptimization() {
        console.log('🔄 Performing periodic AI optimization...');
        
        // Update all performance metrics
        for (const [aiId] of this.aiCapabilities) {
            this.recalculatePerformanceMetrics(aiId);
        }
        
        // Save updated data
        this.saveSpecializationData();
        this.savePerformanceHistory();
        
        this.emit('optimization-complete');
    }
    
    /**
     * Load specialization data
     */
    loadSpecializationData() {
        try {
            if (fs.existsSync(this.specializationDataFile)) {
                const data = JSON.parse(fs.readFileSync(this.specializationDataFile, 'utf-8'));
                
                for (const [id, aiData] of Object.entries(data.aiCapabilities || {})) {
                    this.aiCapabilities.set(id, aiData);
                }
            }
        } catch (error) {
            console.warn(`⚠️ Failed to load specialization data: ${error.message}`);
        }
    }
    
    /**
     * Save specialization data
     */
    saveSpecializationData() {
        try {
            const data = {
                version: '1.0',
                lastUpdated: Date.now(),
                aiCapabilities: Object.fromEntries(this.aiCapabilities)
            };
            
            fs.writeFileSync(this.specializationDataFile, JSON.stringify(data, null, 2));
        } catch (error) {
            console.error(`❌ Failed to save specialization data: ${error.message}`);
        }
    }
    
    /**
     * Load performance history
     */
    loadPerformanceHistory() {
        try {
            if (fs.existsSync(this.performanceHistoryFile)) {
                const data = JSON.parse(fs.readFileSync(this.performanceHistoryFile, 'utf-8'));
                
                for (const [id, historyData] of Object.entries(data.performanceHistory || {})) {
                    this.performanceHistory.set(id, historyData);
                }
            }
        } catch (error) {
            console.warn(`⚠️ Failed to load performance history: ${error.message}`);
        }
    }
    
    /**
     * Save performance history
     */
    savePerformanceHistory() {
        try {
            const data = {
                version: '1.0',
                lastUpdated: Date.now(),
                performanceHistory: Object.fromEntries(this.performanceHistory)
            };
            
            fs.writeFileSync(this.performanceHistoryFile, JSON.stringify(data, null, 2));
        } catch (error) {
            console.error(`❌ Failed to save performance history: ${error.message}`);
        }
    }
    
    /**
     * Get comprehensive engine status
     */
    getEngineStatus() {
        return {
            registeredAIs: this.aiCapabilities.size,
            totalSpecializations: Object.keys(this.specializationCategories).length,
            performanceHistoryEntries: Array.from(this.performanceHistory.values())
                .reduce((sum, history) => sum + history.taskHistory.length, 0),
            averageQualityScore: this.calculateOverallAverageQuality(),
            topPerformingAIs: this.getTopPerformingAIs(3),
            systemHealth: 'excellent'
        };
    }
    
    /**
     * Calculate overall average quality
     */
    calculateOverallAverageQuality() {
        const allScores = [];
        
        for (const history of this.performanceHistory.values()) {
            allScores.push(...history.taskHistory.map(t => t.qualityScore || 0.5));
        }
        
        return allScores.length > 0 ? 
            allScores.reduce((sum, score) => sum + score, 0) / allScores.length : 0.5;
    }
    
    /**
     * Get top performing AIs
     */
    getTopPerformingAIs(limit = 5) {
        return Array.from(this.aiCapabilities.values())
            .map(ai => ({
                id: ai.id,
                name: ai.name,
                qualityScore: ai.performance?.qualityScore || 0,
                tasksCompleted: ai.totalTasksCompleted || 0
            }))
            .sort((a, b) => b.qualityScore - a.qualityScore)
            .slice(0, limit);
    }
    
    /**
     * Shutdown engine
     */
    shutdown() {
        if (this.optimizationInterval) {
            clearInterval(this.optimizationInterval);
        }
        
        this.saveSpecializationData();
        this.savePerformanceHistory();
        
        this.emit('shutdown');
        console.log('🔴 AI Specialization Engine shutdown complete');
    }
}

/**
 * AI Load Balancer - Distributes tasks optimally across AIs
 */
class AILoadBalancer {
    constructor() {
        this.loadHistory = new Map();
    }
    
    selectOptimal(scoredCandidates, constraints = {}) {
        // Apply load balancing logic
        const balancedCandidates = scoredCandidates.map(candidate => ({
            ...candidate,
            adjustedScore: this.adjustScoreForLoad(candidate)
        }));
        
        balancedCandidates.sort((a, b) => b.adjustedScore - a.adjustedScore);
        
        return balancedCandidates[0];
    }
    
    adjustScoreForLoad(candidate) {
        const loadPenalty = (candidate.ai.currentLoad || 0) * 0.1;
        return candidate.score - loadPenalty;
    }
}

/**
 * Performance Optimizer - Analyzes and optimizes AI performance
 */
class PerformanceOptimizer {
    constructor() {
        this.optimizationStrategies = new Map();
    }
    
    optimizeAI(ai, history) {
        // Implement performance optimization strategies
        return {
            recommendedSpecializations: [],
            trainingNeeds: [],
            performanceTargets: {}
        };
    }
}

module.exports = { AISpecializationEngine };

// CLI interface for testing
if (require.main === module) {
    console.log('🧠 AI Specialization Engine - Testing Interface\n');
    
    const engine = new AISpecializationEngine();
    
    async function runTests() {
        // Test AI selection
        const mockTask = {
            id: 'test-task',
            title: 'Create React Component',
            type: 'frontend',
            aiSpecialization: 'frontend',
            estimatedHours: 2
        };
        
        console.log('🎯 Testing AI selection...');
        const selectedAI = engine.selectBestAI(mockTask);
        console.log(`Selected: ${selectedAI.name} for frontend task`);
        
        // Test team assembly
        const mockProject = {
            type: 'web-app',
            complexity: 0.7,
            estimatedHours: 15,
            requiredSpecializations: ['frontend', 'backend', 'testing'],
            optimalTeamSize: 3
        };
        
        console.log('\n🔧 Testing team assembly...');
        const team = engine.assembleOptimalTeam(mockProject);
        console.log('Team members:');
        team.forEach(ai => console.log(`  - ${ai.name} (${ai.specializations.join(', ')})`));
        
        // Test analytics
        console.log('\n📊 Testing analytics...');
        const analytics = engine.getAIAnalytics('claude-code');
        console.log('Analytics:', JSON.stringify(analytics, null, 2));
        
        // Engine status
        console.log('\n🏥 Engine Status:');
        console.log(JSON.stringify(engine.getEngineStatus(), null, 2));
        
        process.exit(0);
    }
    
    runTests().catch(error => {
        console.error('❌ Test failed:', error);
        process.exit(1);
    });
}