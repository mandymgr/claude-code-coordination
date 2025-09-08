/**
 * 🧠 Adaptive AI Assistant
 * Learns from your coding patterns and provides intelligent, context-aware assistance
 */
export interface LearningPattern {
    pattern: string;
    frequency: number;
    context: string[];
    successRate: number;
}
export interface AssistanceContext {
    currentFile?: string;
    projectType?: string;
    recentFiles?: string[];
    codeBase?: string[];
    userPreferences?: Record<string, any>;
}
export interface AssistanceResponse {
    type: 'suggestion' | 'fix' | 'explanation' | 'example';
    content: string;
    confidence: number;
    reasoning: string;
    codeSnippet?: string;
    resources?: string[];
}
export interface UserProfile {
    skillLevel: 'beginner' | 'intermediate' | 'expert';
    preferredLanguages: string[];
    workingPatterns: LearningPattern[];
    successfulSuggestions: string[];
    rejectedSuggestions: string[];
    learningGoals: string[];
}
export declare class AdaptiveAIAssistant {
    private projectPath;
    private learningPath;
    private patterns;
    private contextWindow;
    private skillLevel;
    private cache;
    private userProfile;
    constructor(projectPath?: string);
    /**
     * 🎯 Main AI assistant interface
     */
    assist(query: string, context?: AssistanceContext): Promise<AssistanceResponse>;
    /**
     * 🔍 Classify the type of assistance needed
     */
    private classifyQuery;
    /**
     * 💡 Generate personalized response
     */
    private generateResponse;
    /**
     * 🐛 Generate debug assistance
     */
    private generateDebugResponse;
    /**
     * 📚 Generate explanation response
     */
    private generateExplanationResponse;
    /**
     * 🔨 Generate implementation assistance
     */
    private generateImplementationResponse;
    /**
     * ⚡ Generate optimization response
     */
    private generateOptimizationResponse;
    /**
     * 💬 Generate general response
     */
    private generateGeneralResponse;
    /**
     * 🧠 Learn from interaction
     */
    private learnFromInteraction;
    /**
     * 🔄 Update context window
     */
    private updateContextWindow;
    /**
     * 🎯 Get complexity level for current user
     */
    private getComplexityLevel;
    /**
     * 🔍 Find similar patterns
     */
    private findSimilarPattern;
    /**
     * 🧩 Extract pattern from query
     */
    private extractPattern;
    private getDebugSteps;
    private getCommonIssues;
    private formatDebugSuggestion;
    private formatExplanation;
    private formatImplementationPlan;
    private chooseImplementationApproach;
    private getOptimizationStrategies;
    private formatOptimizationSuggestions;
    private generateDebugCode;
    private generateExampleCode;
    private generateImplementationCode;
    private generateOptimizedCode;
    private getDebugResources;
    private getEducationalResources;
    private getImplementationResources;
    private getPerformanceResources;
    private getGeneralResources;
    /**
     * 💾 Load learning data
     */
    private loadLearningData;
    /**
     * 💾 Save learning data
     */
    private saveLearningData;
    /**
     * 👤 Load user profile
     */
    private loadUserProfile;
    /**
     * 📈 Update user profile based on feedback
     */
    updateProfile(feedback: 'positive' | 'negative', suggestion: string): Promise<void>;
    /**
     * 💾 Save user profile
     */
    private saveUserProfile;
}
//# sourceMappingURL=AdaptiveAIAssistant.d.ts.map