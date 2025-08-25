/**
 * AI Context Engine - Intelligent Context Awareness System
 * Learns from user patterns and provides personalized suggestions
 * 
 * Features:
 * - User preference learning
 * - Project history analysis
 * - Intelligent architecture suggestions
 * - Personalized template recommendations
 */

import fs from 'fs/promises';
import path from 'path';
import crypto from 'crypto';

class AIContextEngine {
    constructor() {
        this.contextFile = path.join(process.cwd(), '.claude-context.json');
        this.userProfile = null;
        this.projectHistory = [];
        this.preferences = {};
        this.learningModel = new Map();
        
        this.initializeContext();
    }

    async initializeContext() {
        try {
            const contextData = await fs.readFile(this.contextFile, 'utf8');
            const parsed = JSON.parse(contextData);
            
            this.userProfile = parsed.userProfile || this.createDefaultProfile();
            this.projectHistory = parsed.projectHistory || [];
            this.preferences = parsed.preferences || {};
            this.learningModel = new Map(parsed.learningModel || []);
            
            console.log('🧠 AI Context Engine initialized with existing data');
        } catch (error) {
            console.log('🧠 Creating new AI Context Engine profile');
            this.userProfile = this.createDefaultProfile();
            await this.saveContext();
        }
    }

    createDefaultProfile() {
        return {
            id: crypto.randomBytes(16).toString('hex'),
            createdAt: new Date().toISOString(),
            skillLevel: 'intermediate',
            favoriteFrameworks: [],
            preferredPatterns: [],
            projectTypes: new Map(),
            successRate: 1.0,
            totalProjects: 0
        };
    }

    // Learn from user input and project outcomes
    async learnFromProject(projectData) {
        const {
            description,
            selectedTemplate,
            techStack,
            deploymentTarget,
            buildTime,
            success,
            userFeedback
        } = projectData;

        // Update project history
        this.projectHistory.unshift({
            id: crypto.randomBytes(8).toString('hex'),
            timestamp: new Date().toISOString(),
            description: description,
            template: selectedTemplate,
            techStack: techStack,
            deployment: deploymentTarget,
            buildTime: buildTime,
            success: success,
            feedback: userFeedback
        });

        // Keep only last 50 projects
        if (this.projectHistory.length > 50) {
            this.projectHistory = this.projectHistory.slice(0, 50);
        }

        // Update user profile based on success
        this.userProfile.totalProjects++;
        if (success) {
            // Learn successful patterns
            this.learnSuccessPattern(techStack, selectedTemplate, description);
        }

        // Update preferences
        this.updatePreferences(techStack, deploymentTarget, success);

        await this.saveContext();
        console.log(`🧠 Learned from project: ${success ? '✅' : '❌'} ${description.substring(0, 50)}...`);
    }

    learnSuccessPattern(techStack, template, description) {
        const pattern = {
            keywords: this.extractKeywords(description),
            stack: techStack,
            template: template
        };

        const patternKey = JSON.stringify(pattern);
        const currentCount = this.learningModel.get(patternKey) || 0;
        this.learningModel.set(patternKey, currentCount + 1);
    }

    extractKeywords(description) {
        const keywords = description.toLowerCase()
            .split(/[\s,.-]+/)
            .filter(word => word.length > 2)
            .filter(word => !['the', 'and', 'with', 'for', 'that', 'this'].includes(word));
        
        return [...new Set(keywords)];
    }

    updatePreferences(techStack, deploymentTarget, success) {
        if (!success) return;

        // Update framework preferences
        if (techStack) {
            this.preferences.frameworks = this.preferences.frameworks || {};
            this.preferences.frameworks[techStack] = (this.preferences.frameworks[techStack] || 0) + 1;
        }

        // Update deployment preferences
        if (deploymentTarget) {
            this.preferences.deployment = this.preferences.deployment || {};
            this.preferences.deployment[deploymentTarget] = (this.preferences.deployment[deploymentTarget] || 0) + 1;
        }
    }

    // Provide intelligent suggestions based on learning
    getIntelligentSuggestions(description) {
        const keywords = this.extractKeywords(description);
        const suggestions = {
            recommendedTemplate: this.getRecommendedTemplate(keywords),
            suggestedTechStack: this.getSuggestedTechStack(keywords),
            preferredDeployment: this.getPreferredDeployment(),
            aiTeamComposition: this.getOptimalAITeam(keywords),
            estimatedComplexity: this.estimateComplexity(description),
            successProbability: this.estimateSuccessProbability(keywords)
        };

        console.log('🧠 Generated intelligent suggestions:', suggestions);
        return suggestions;
    }

    getRecommendedTemplate(keywords) {
        // Find most successful template for similar projects
        let bestMatch = { template: 'todo-app', confidence: 0.5 };

        for (const [patternKey, count] of this.learningModel.entries()) {
            const pattern = JSON.parse(patternKey);
            const overlap = this.calculateKeywordOverlap(keywords, pattern.keywords);
            
            if (overlap > bestMatch.confidence && count > 1) {
                bestMatch = {
                    template: pattern.template,
                    confidence: overlap,
                    usageCount: count
                };
            }
        }

        return bestMatch;
    }

    getSuggestedTechStack(keywords) {
        // Analyze project history for best tech stack matches
        const stackScores = new Map();

        this.projectHistory
            .filter(project => project.success)
            .forEach(project => {
                const overlap = this.calculateKeywordOverlap(keywords, 
                    this.extractKeywords(project.description));
                
                if (overlap > 0.3) {
                    const currentScore = stackScores.get(project.techStack) || 0;
                    stackScores.set(project.techStack, currentScore + overlap);
                }
            });

        const sortedStacks = [...stackScores.entries()]
            .sort(([,a], [,b]) => b - a)
            .slice(0, 3);

        return sortedStacks.length > 0 
            ? { stack: sortedStacks[0][0], confidence: sortedStacks[0][1] }
            : { stack: 'react-ts', confidence: 0.6 };
    }

    getPreferredDeployment() {
        const deploymentPrefs = this.preferences.deployment || {};
        const sortedPrefs = Object.entries(deploymentPrefs)
            .sort(([,a], [,b]) => b - a);

        return sortedPrefs.length > 0 
            ? { target: sortedPrefs[0][0], confidence: 0.8 }
            : { target: 'vercel', confidence: 0.5 };
    }

    getOptimalAITeam(keywords) {
        // Determine optimal AI team composition based on project complexity
        const complexity = this.estimateComplexity(keywords.join(' '));
        
        const baseTeam = [
            { role: 'orchestrator', ai: 'claude', specialization: 'coordination' },
            { role: 'frontend', ai: 'claude', specialization: 'react/ui' }
        ];

        if (complexity > 0.6) {
            baseTeam.push(
                { role: 'backend', ai: 'gpt-4', specialization: 'api/database' },
                { role: 'devops', ai: 'gemini', specialization: 'deployment' }
            );
        }

        if (complexity > 0.8) {
            baseTeam.push(
                { role: 'testing', ai: 'claude', specialization: 'qa/testing' },
                { role: 'security', ai: 'gpt-4', specialization: 'security' }
            );
        }

        return {
            team: baseTeam,
            estimatedDuration: this.estimateBuildDuration(complexity),
            confidence: 0.85
        };
    }

    estimateComplexity(description) {
        const complexityIndicators = [
            'authentication', 'database', 'api', 'backend', 'deployment',
            'real-time', 'websocket', 'payment', 'integration', 'microservice',
            'scaling', 'performance', 'security', 'testing', 'ci/cd'
        ];

        const words = description.toLowerCase().split(/\s+/);
        const matches = words.filter(word => 
            complexityIndicators.some(indicator => word.includes(indicator))
        ).length;

        return Math.min(matches / 5, 1.0); // Normalize to 0-1
    }

    estimateSuccessProbability(keywords) {
        let totalSuccessRate = 0;
        let relevantProjects = 0;

        this.projectHistory.forEach(project => {
            const overlap = this.calculateKeywordOverlap(keywords,
                this.extractKeywords(project.description));
            
            if (overlap > 0.2) {
                totalSuccessRate += project.success ? 1 : 0;
                relevantProjects++;
            }
        });

        return relevantProjects > 0 
            ? totalSuccessRate / relevantProjects 
            : 0.8; // Default optimistic rate
    }

    estimateBuildDuration(complexity) {
        const baseTime = 2; // minutes
        const complexityMultiplier = 1 + (complexity * 3);
        return Math.round(baseTime * complexityMultiplier);
    }

    calculateKeywordOverlap(keywords1, keywords2) {
        const set1 = new Set(keywords1);
        const set2 = new Set(keywords2);
        const intersection = new Set([...set1].filter(x => set2.has(x)));
        const union = new Set([...set1, ...set2]);
        
        return union.size > 0 ? intersection.size / union.size : 0;
    }

    // Get personalized templates based on user history
    getPersonalizedTemplates() {
        const templateUsage = new Map();
        
        this.projectHistory
            .filter(project => project.success)
            .forEach(project => {
                const count = templateUsage.get(project.template) || 0;
                templateUsage.set(project.template, count + 1);
            });

        const personalizedTemplates = [...templateUsage.entries()]
            .sort(([,a], [,b]) => b - a)
            .slice(0, 4)
            .map(([template, count]) => ({
                id: template,
                usage: count,
                successRate: this.getTemplateSuccessRate(template)
            }));

        return personalizedTemplates;
    }

    getTemplateSuccessRate(template) {
        const templateProjects = this.projectHistory.filter(p => p.template === template);
        if (templateProjects.length === 0) return 0.8;
        
        const successful = templateProjects.filter(p => p.success).length;
        return successful / templateProjects.length;
    }

    async saveContext() {
        const contextData = {
            userProfile: this.userProfile,
            projectHistory: this.projectHistory,
            preferences: this.preferences,
            learningModel: [...this.learningModel.entries()],
            lastUpdated: new Date().toISOString()
        };

        await fs.writeFile(this.contextFile, JSON.stringify(contextData, null, 2));
    }

    // Get user insights for dashboard
    getUserInsights() {
        return {
            totalProjects: this.userProfile.totalProjects,
            successRate: this.calculateOverallSuccessRate(),
            favoriteFramework: this.getFavoriteFramework(),
            mostUsedTemplate: this.getMostUsedTemplate(),
            averageBuildTime: this.getAverageBuildTime(),
            skillLevelProgression: this.assessSkillProgression()
        };
    }

    calculateOverallSuccessRate() {
        if (this.projectHistory.length === 0) return 1.0;
        
        const successful = this.projectHistory.filter(p => p.success).length;
        return successful / this.projectHistory.length;
    }

    getFavoriteFramework() {
        const frameworks = this.preferences.frameworks || {};
        const sorted = Object.entries(frameworks).sort(([,a], [,b]) => b - a);
        return sorted.length > 0 ? sorted[0][0] : 'react-ts';
    }

    getMostUsedTemplate() {
        const templateCounts = new Map();
        this.projectHistory.forEach(project => {
            const count = templateCounts.get(project.template) || 0;
            templateCounts.set(project.template, count + 1);
        });

        let mostUsed = { template: 'todo-app', count: 0 };
        for (const [template, count] of templateCounts.entries()) {
            if (count > mostUsed.count) {
                mostUsed = { template, count };
            }
        }

        return mostUsed;
    }

    getAverageBuildTime() {
        if (this.projectHistory.length === 0) return 3;
        
        const totalTime = this.projectHistory.reduce((sum, project) => 
            sum + (project.buildTime || 3), 0);
        return Math.round(totalTime / this.projectHistory.length);
    }

    assessSkillProgression() {
        const recentProjects = this.projectHistory.slice(0, 10);
        const olderProjects = this.projectHistory.slice(10, 20);
        
        const recentComplexity = recentProjects.reduce((sum, p) => 
            sum + this.estimateComplexity(p.description), 0) / Math.max(recentProjects.length, 1);
        
        const olderComplexity = olderProjects.reduce((sum, p) => 
            sum + this.estimateComplexity(p.description), 0) / Math.max(olderProjects.length, 1);
        
        const progression = recentComplexity - olderComplexity;
        
        if (progression > 0.2) return 'improving';
        if (progression < -0.1) return 'stable';
        return 'consistent';
    }
}

// Export singleton instance
const contextEngine = new AIContextEngine();
export default contextEngine;