"use strict";
/**
 * Claude Code Coordination - Team Optimization AI v4.0
 * Revolutionary team composition and optimization based on project types and session capabilities
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
exports.TeamOptimizationAI = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class TeamOptimizationAI {
    constructor(coordinationDir = '.claude-coordination') {
        this.coordinationDir = path.resolve(coordinationDir);
        this.teamStateFile = path.join(this.coordinationDir, 'team-optimization-state.json');
        // Initialize project type classifications
        this.projectTypes = {
            'web_fullstack': {
                name: 'Full-Stack Web Application',
                complexity: 0.8,
                requiredSkills: ['frontend', 'backend', 'database', 'api', 'ui_ux'],
                optimalTeamSize: [3, 5],
                criticalRoles: ['frontend_specialist', 'backend_specialist', 'full_stack_generalist'],
                estimatedDuration: '4-8 weeks',
                budgetMultiplier: 1.0
            },
            'ecommerce': {
                name: 'E-commerce Platform',
                complexity: 0.9,
                requiredSkills: ['frontend', 'backend', 'database', 'payment', 'security', 'api'],
                optimalTeamSize: [4, 6],
                criticalRoles: ['frontend_specialist', 'backend_specialist', 'payment_specialist', 'security_specialist'],
                estimatedDuration: '8-16 weeks',
                budgetMultiplier: 1.5
            },
            'mobile_app': {
                name: 'Mobile Application',
                complexity: 0.7,
                requiredSkills: ['mobile', 'ui_ux', 'api', 'database'],
                optimalTeamSize: [2, 4],
                criticalRoles: ['mobile_specialist', 'api_specialist', 'ui_ux_specialist'],
                estimatedDuration: '6-12 weeks',
                budgetMultiplier: 1.2
            },
            'api_microservices': {
                name: 'API & Microservices',
                complexity: 0.9,
                requiredSkills: ['backend', 'database', 'api', 'devops', 'security'],
                optimalTeamSize: [3, 5],
                criticalRoles: ['backend_specialist', 'api_architect', 'devops_specialist'],
                estimatedDuration: '6-14 weeks',
                budgetMultiplier: 1.3
            },
            'data_analytics': {
                name: 'Data Analytics Platform',
                complexity: 0.8,
                requiredSkills: ['data_science', 'backend', 'database', 'visualization'],
                optimalTeamSize: [2, 4],
                criticalRoles: ['data_scientist', 'backend_specialist', 'database_specialist'],
                estimatedDuration: '4-10 weeks',
                budgetMultiplier: 1.4
            },
            'ai_ml_project': {
                name: 'AI/ML Project',
                complexity: 0.9,
                requiredSkills: ['machine_learning', 'data_science', 'python', 'api'],
                optimalTeamSize: [2, 4],
                criticalRoles: ['ml_engineer', 'data_scientist', 'api_specialist'],
                estimatedDuration: '8-20 weeks',
                budgetMultiplier: 1.8
            }
        };
        // Initialize AI agent capabilities
        this.agentCapabilities = {
            'claude': {
                id: 'claude',
                name: 'Claude',
                skills: ['frontend', 'ui_ux', 'documentation', 'code_review', 'architecture'],
                efficiency: {
                    'frontend': 0.9,
                    'ui_ux': 0.8,
                    'documentation': 0.95,
                    'code_review': 0.85,
                    'architecture': 0.8
                },
                availability: 'high',
                costPerHour: 50,
                specializations: ['React', 'TypeScript', 'UI Design', 'Technical Writing']
            },
            'gpt4': {
                id: 'gpt4',
                name: 'GPT-4',
                skills: ['backend', 'api', 'database', 'algorithms', 'debugging'],
                efficiency: {
                    'backend': 0.9,
                    'api': 0.85,
                    'database': 0.8,
                    'algorithms': 0.9,
                    'debugging': 0.85
                },
                availability: 'high',
                costPerHour: 60,
                specializations: ['Node.js', 'Python', 'SQL', 'System Design']
            },
            'gemini': {
                id: 'gemini',
                name: 'Gemini',
                skills: ['devops', 'cloud', 'security', 'monitoring', 'performance'],
                efficiency: {
                    'devops': 0.85,
                    'cloud': 0.9,
                    'security': 0.8,
                    'monitoring': 0.85,
                    'performance': 0.8
                },
                availability: 'medium',
                costPerHour: 55,
                specializations: ['AWS', 'Docker', 'Kubernetes', 'Security Audits']
            }
        };
        this.learningData = this.loadLearningData();
        this.ensureCoordinationDirectory();
    }
    /**
     * 🎯 Optimize team composition for a project
     */
    async optimizeTeam(requirements, constraints) {
        console.log('🧠 Optimizing team composition...');
        const projectType = this.inferProjectType(requirements);
        const projectConfig = this.projectTypes[projectType];
        if (!projectConfig) {
            throw new Error(`Unknown project type: ${projectType}`);
        }
        // Generate multiple team composition options
        const recommendations = await this.generateTeamRecommendations(projectConfig, requirements, constraints);
        // Select the best team based on optimization metrics
        const bestTeam = this.selectOptimalTeam(recommendations);
        const session = {
            id: this.generateSessionId(),
            projectType,
            requirements,
            constraints: constraints || this.getDefaultConstraints(),
            recommendations,
            selectedTeam: bestTeam,
            sessionMetrics: this.calculateSessionMetrics(bestTeam),
            createdAt: new Date(),
            updatedAt: new Date()
        };
        await this.saveSession(session);
        return session;
    }
    /**
     * 🔍 Infer project type from requirements
     */
    inferProjectType(requirements) {
        const skillMap = {
            'frontend': 'web_fullstack',
            'react': 'web_fullstack',
            'vue': 'web_fullstack',
            'mobile': 'mobile_app',
            'ios': 'mobile_app',
            'android': 'mobile_app',
            'api': 'api_microservices',
            'microservices': 'api_microservices',
            'data_science': 'data_analytics',
            'machine_learning': 'ai_ml_project',
            'ml': 'ai_ml_project',
            'payment': 'ecommerce',
            'ecommerce': 'ecommerce'
        };
        for (const skill of requirements.skills) {
            const projectType = skillMap[skill.toLowerCase()];
            if (projectType) {
                return projectType;
            }
        }
        return 'web_fullstack'; // Default
    }
    /**
     * 💡 Generate team recommendations
     */
    async generateTeamRecommendations(projectConfig, requirements, constraints) {
        const recommendations = [];
        // Generate different team size variations
        const [minSize, maxSize] = projectConfig.optimalTeamSize;
        for (let teamSize = minSize; teamSize <= maxSize; teamSize++) {
            const composition = await this.generateTeamComposition(projectConfig, requirements, teamSize, constraints);
            if (composition) {
                recommendations.push(composition);
            }
        }
        return recommendations.sort((a, b) => b.skillsCoverage - a.skillsCoverage);
    }
    /**
     * 👥 Generate specific team composition
     */
    async generateTeamComposition(projectConfig, requirements, teamSize, constraints) {
        const selectedAgents = [];
        const availableAgents = Object.values(this.agentCapabilities);
        const requiredSkills = [...projectConfig.requiredSkills, ...requirements.skills];
        // Prioritize critical roles
        const criticalRoles = projectConfig.criticalRoles;
        let remainingSlots = teamSize;
        // Fill critical roles first
        for (const role of criticalRoles) {
            if (remainingSlots <= 0)
                break;
            const bestAgent = this.findBestAgentForRole(role, availableAgents, selectedAgents);
            if (bestAgent) {
                selectedAgents.push({
                    agentId: bestAgent.id,
                    role: role,
                    allocation: 100,
                    skills: bestAgent.skills,
                    reasoning: `Critical role ${role} assigned to ${bestAgent.name} based on skill match`
                });
                remainingSlots--;
            }
        }
        // Fill remaining slots with skill coverage optimization
        while (remainingSlots > 0 && selectedAgents.length < availableAgents.length) {
            const uncoveredSkills = this.getUncoveredSkills(requiredSkills, selectedAgents);
            if (uncoveredSkills.length === 0)
                break;
            const bestAgent = this.findBestAgentForSkills(uncoveredSkills, availableAgents, selectedAgents);
            if (bestAgent) {
                selectedAgents.push({
                    agentId: bestAgent.id,
                    role: 'specialist',
                    allocation: 100,
                    skills: bestAgent.skills,
                    reasoning: `Added ${bestAgent.name} to cover skills: ${uncoveredSkills.join(', ')}`
                });
                remainingSlots--;
            }
            else {
                break;
            }
        }
        const skillsCoverage = this.calculateSkillsCoverage(requiredSkills, selectedAgents);
        const totalCost = this.calculateTeamCost(selectedAgents);
        const riskAssessment = this.assessTeamRisks(selectedAgents, projectConfig, requirements);
        return {
            agents: selectedAgents,
            totalCost,
            estimatedDuration: projectConfig.estimatedDuration || '4-8 weeks',
            skillsCoverage,
            riskAssessment,
            alternatives: []
        };
    }
    /**
     * 🔍 Find best agent for specific role
     */
    findBestAgentForRole(role, availableAgents, excludeAgents) {
        const excludeIds = new Set(excludeAgents.map(a => a.agentId));
        const roleSkillMap = {
            'frontend_specialist': ['frontend', 'ui_ux'],
            'backend_specialist': ['backend', 'api', 'database'],
            'full_stack_generalist': ['frontend', 'backend'],
            'mobile_specialist': ['mobile', 'ui_ux'],
            'api_specialist': ['api', 'backend'],
            'devops_specialist': ['devops', 'cloud'],
            'security_specialist': ['security'],
            'data_scientist': ['data_science', 'machine_learning'],
            'ml_engineer': ['machine_learning', 'api']
        };
        const requiredSkills = roleSkillMap[role] || [];
        let bestAgent = null;
        let bestScore = 0;
        for (const agent of availableAgents) {
            if (excludeIds.has(agent.id))
                continue;
            let score = 0;
            for (const skill of requiredSkills) {
                if (agent.skills.includes(skill)) {
                    score += agent.efficiency[skill] || 0.5;
                }
            }
            if (score > bestScore) {
                bestScore = score;
                bestAgent = agent;
            }
        }
        return bestAgent;
    }
    /**
     * 🎯 Find best agent for specific skills
     */
    findBestAgentForSkills(skills, availableAgents, excludeAgents) {
        const excludeIds = new Set(excludeAgents.map(a => a.agentId));
        let bestAgent = null;
        let bestScore = 0;
        for (const agent of availableAgents) {
            if (excludeIds.has(agent.id))
                continue;
            let score = 0;
            let matchCount = 0;
            for (const skill of skills) {
                if (agent.skills.includes(skill)) {
                    score += agent.efficiency[skill] || 0.5;
                    matchCount++;
                }
            }
            // Prioritize agents that cover more skills
            score = score * (1 + matchCount * 0.1);
            if (score > bestScore) {
                bestScore = score;
                bestAgent = agent;
            }
        }
        return bestAgent;
    }
    /**
     * 📊 Calculate skills coverage
     */
    calculateSkillsCoverage(requiredSkills, selectedAgents) {
        const agentSkills = new Set();
        for (const agent of selectedAgents) {
            for (const skill of agent.skills) {
                agentSkills.add(skill);
            }
        }
        let coveredSkills = 0;
        for (const skill of requiredSkills) {
            if (agentSkills.has(skill)) {
                coveredSkills++;
            }
        }
        return requiredSkills.length > 0 ? coveredSkills / requiredSkills.length : 1.0;
    }
    /**
     * 💰 Calculate team cost
     */
    calculateTeamCost(selectedAgents) {
        let totalCost = 0;
        for (const agent of selectedAgents) {
            const agentCapability = this.agentCapabilities[agent.agentId];
            if (agentCapability?.costPerHour) {
                // Estimate 40 hours per week for 8 weeks (default project duration)
                totalCost += agentCapability.costPerHour * 40 * 8 * (agent.allocation / 100);
            }
        }
        return totalCost;
    }
    /**
     * ⚠️ Assess team risks
     */
    assessTeamRisks(selectedAgents, projectConfig, requirements) {
        const risks = [];
        // Check skill gaps
        const uncoveredSkills = this.getUncoveredSkills([...projectConfig.requiredSkills, ...requirements.skills], selectedAgents);
        if (uncoveredSkills.length > 0) {
            risks.push({
                type: 'skill-gap',
                severity: uncoveredSkills.length * 0.2,
                description: `Uncovered skills: ${uncoveredSkills.join(', ')}`
            });
        }
        // Check team size
        const [minSize, maxSize] = projectConfig.optimalTeamSize;
        if (selectedAgents.length < minSize) {
            risks.push({
                type: 'resource-constraint',
                severity: 0.3,
                description: 'Team size below optimal range'
            });
        }
        else if (selectedAgents.length > maxSize) {
            risks.push({
                type: 'resource-constraint',
                severity: 0.2,
                description: 'Team size above optimal range - may lead to coordination overhead'
            });
        }
        // Calculate overall risk
        const avgSeverity = risks.length > 0 ? risks.reduce((sum, r) => sum + r.severity, 0) / risks.length : 0;
        const overall = avgSeverity < 0.3 ? 'low' : avgSeverity < 0.6 ? 'medium' : 'high';
        return {
            overall,
            factors: risks,
            mitigation: this.generateMitigationStrategies(risks)
        };
    }
    /**
     * 🛡️ Generate mitigation strategies
     */
    generateMitigationStrategies(risks) {
        const strategies = [];
        for (const risk of risks) {
            switch (risk.type) {
                case 'skill-gap':
                    strategies.push('Consider training existing team members or adding specialists');
                    break;
                case 'resource-constraint':
                    strategies.push('Adjust project scope or timeline to match team capacity');
                    break;
                case 'timeline-pressure':
                    strategies.push('Implement agile methodology with regular checkpoints');
                    break;
                default:
                    strategies.push('Regular monitoring and risk assessment');
            }
        }
        return strategies;
    }
    /**
     * 🔍 Get uncovered skills
     */
    getUncoveredSkills(requiredSkills, selectedAgents) {
        const agentSkills = new Set();
        for (const agent of selectedAgents) {
            for (const skill of agent.skills) {
                agentSkills.add(skill);
            }
        }
        return requiredSkills.filter(skill => !agentSkills.has(skill));
    }
    /**
     * 🏆 Select optimal team from recommendations
     */
    selectOptimalTeam(recommendations) {
        if (recommendations.length === 0) {
            throw new Error('No valid team compositions generated');
        }
        // Score each team based on multiple factors
        let bestTeam = recommendations[0];
        let bestScore = this.calculateTeamScore(bestTeam);
        for (let i = 1; i < recommendations.length; i++) {
            const score = this.calculateTeamScore(recommendations[i]);
            if (score > bestScore) {
                bestScore = score;
                bestTeam = recommendations[i];
            }
        }
        return bestTeam;
    }
    /**
     * 📊 Calculate team score for optimization
     */
    calculateTeamScore(team) {
        // Weighted scoring: skills coverage (40%), cost efficiency (30%), risk (30%)
        const skillsScore = team.skillsCoverage * 0.4;
        const costScore = Math.max(0, 1 - (team.totalCost / 50000)) * 0.3; // Normalize against $50k baseline
        const riskScore = (team.riskAssessment.overall === 'low' ? 0.9 :
            team.riskAssessment.overall === 'medium' ? 0.6 : 0.3) * 0.3;
        return skillsScore + costScore + riskScore;
    }
    /**
     * 📈 Calculate session metrics
     */
    calculateSessionMetrics(team) {
        return {
            efficiency: team.skillsCoverage,
            costEffectiveness: Math.max(0, 1 - (team.totalCost / 50000)),
            skillMatch: team.skillsCoverage,
            availabilityScore: 0.8,
            overallScore: this.calculateTeamScore(team)
        };
    }
    /**
     * 🆔 Generate session ID
     */
    generateSessionId() {
        return `team-opt-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
    }
    /**
     * ⚙️ Get default constraints
     */
    getDefaultConstraints() {
        return {
            maxBudget: 100000,
            maxTeamSize: 6,
            requiredSkills: []
        };
    }
    /**
     * 🧠 Load learning data
     */
    loadLearningData() {
        try {
            const dataPath = path.join(this.coordinationDir, 'learning-data.json');
            if (fs.existsSync(dataPath)) {
                const data = fs.readFileSync(dataPath, 'utf8');
                return JSON.parse(data);
            }
        }
        catch (error) {
            console.warn('Could not load learning data:', error);
        }
        return {
            successfulCombinations: {},
            failedCombinations: {},
            agentPerformance: {},
            projectOutcomes: []
        };
    }
    /**
     * 💾 Save session
     */
    async saveSession(session) {
        try {
            const sessionsPath = path.join(this.coordinationDir, 'optimization-sessions.json');
            let sessions = [];
            if (fs.existsSync(sessionsPath)) {
                const data = fs.readFileSync(sessionsPath, 'utf8');
                sessions = JSON.parse(data);
            }
            sessions.push(session);
            fs.writeFileSync(sessionsPath, JSON.stringify(sessions, null, 2));
        }
        catch (error) {
            console.warn('Could not save session:', error);
        }
    }
    /**
     * 📁 Ensure coordination directory exists
     */
    ensureCoordinationDirectory() {
        if (!fs.existsSync(this.coordinationDir)) {
            fs.mkdirSync(this.coordinationDir, { recursive: true });
        }
    }
    /**
     * 📊 Analyze team performance (for learning)
     */
    async analyzeTeamPerformance(sessionId, metrics) {
        // Update learning data based on team performance
        const session = await this.getSession(sessionId);
        if (session) {
            const outcome = {
                projectId: sessionId,
                projectType: session.projectType,
                teamComposition: session.selectedTeam?.agents.map(a => a.agentId) || [],
                success: metrics.qualityScore > 0.7,
                metrics,
                lessons: []
            };
            this.learningData.projectOutcomes.push(outcome);
            await this.saveLearningData();
        }
    }
    /**
     * 🔍 Get session by ID
     */
    async getSession(sessionId) {
        try {
            const sessionsPath = path.join(this.coordinationDir, 'optimization-sessions.json');
            if (fs.existsSync(sessionsPath)) {
                const data = fs.readFileSync(sessionsPath, 'utf8');
                const sessions = JSON.parse(data);
                return sessions.find(s => s.id === sessionId) || null;
            }
        }
        catch (error) {
            console.warn('Could not get session:', error);
        }
        return null;
    }
    /**
     * 💾 Save learning data
     */
    async saveLearningData() {
        try {
            const dataPath = path.join(this.coordinationDir, 'learning-data.json');
            fs.writeFileSync(dataPath, JSON.stringify(this.learningData, null, 2));
        }
        catch (error) {
            console.warn('Could not save learning data:', error);
        }
    }
}
exports.TeamOptimizationAI = TeamOptimizationAI;
//# sourceMappingURL=TeamOptimizationAI.js.map