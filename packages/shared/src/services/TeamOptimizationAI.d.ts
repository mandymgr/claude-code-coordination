/**
 * Claude Code Coordination - Team Optimization AI v4.0
 * Revolutionary team composition and optimization based on project types and session capabilities
 */
import { TeamOptimizationSession, ProjectRequirements, OptimizationConstraints, TeamPerformanceMetrics } from '../types/team.js';
export declare class TeamOptimizationAI {
    private coordinationDir;
    private teamStateFile;
    private projectTypes;
    private agentCapabilities;
    private learningData;
    constructor(coordinationDir?: string);
    /**
     * 🎯 Optimize team composition for a project
     */
    optimizeTeam(requirements: ProjectRequirements, constraints?: OptimizationConstraints): Promise<TeamOptimizationSession>;
    /**
     * 🔍 Infer project type from requirements
     */
    private inferProjectType;
    /**
     * 💡 Generate team recommendations
     */
    private generateTeamRecommendations;
    /**
     * 👥 Generate specific team composition
     */
    private generateTeamComposition;
    /**
     * 🔍 Find best agent for specific role
     */
    private findBestAgentForRole;
    /**
     * 🎯 Find best agent for specific skills
     */
    private findBestAgentForSkills;
    /**
     * 📊 Calculate skills coverage
     */
    private calculateSkillsCoverage;
    /**
     * 💰 Calculate team cost
     */
    private calculateTeamCost;
    /**
     * ⚠️ Assess team risks
     */
    private assessTeamRisks;
    /**
     * 🛡️ Generate mitigation strategies
     */
    private generateMitigationStrategies;
    /**
     * 🔍 Get uncovered skills
     */
    private getUncoveredSkills;
    /**
     * 🏆 Select optimal team from recommendations
     */
    private selectOptimalTeam;
    /**
     * 📊 Calculate team score for optimization
     */
    private calculateTeamScore;
    /**
     * 📈 Calculate session metrics
     */
    private calculateSessionMetrics;
    /**
     * 🆔 Generate session ID
     */
    private generateSessionId;
    /**
     * ⚙️ Get default constraints
     */
    private getDefaultConstraints;
    /**
     * 🧠 Load learning data
     */
    private loadLearningData;
    /**
     * 💾 Save session
     */
    private saveSession;
    /**
     * 📁 Ensure coordination directory exists
     */
    private ensureCoordinationDirectory;
    /**
     * 📊 Analyze team performance (for learning)
     */
    analyzeTeamPerformance(sessionId: string, metrics: TeamPerformanceMetrics): Promise<void>;
    /**
     * 🔍 Get session by ID
     */
    private getSession;
    /**
     * 💾 Save learning data
     */
    private saveLearningData;
}
