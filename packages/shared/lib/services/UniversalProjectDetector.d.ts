/**
 * 🔮 Universal Project Detection Engine
 * Magically detects ANY type of development project and auto-configures coordination
 */
import { ProjectAnalysis, MagicConfiguration } from '../types/project.js';
export declare class UniversalProjectDetector {
    private projectPath;
    private detectedFrameworks;
    private detectedLanguages;
    private detectedTools;
    private projectMetadata;
    constructor(projectPath?: string);
    /**
     * 🎯 Master detection method - analyzes everything
     */
    detectProject(): Promise<{
        analysis: ProjectAnalysis;
        magicConfig: MagicConfiguration;
        autoSetupCommands: string[];
        recommendedTeam: string[];
        developmentWorkflow: Record<string, string>;
    }>;
    /**
     * 🎭 Detect project type with supernatural accuracy
     */
    private detectProjectType;
    /**
     * 🔍 Detect programming languages used
     */
    private detectLanguages;
    /**
     * 🛠️ Detect frameworks and libraries
     */
    private detectFrameworks;
    /**
     * 🔧 Detect development tools
     */
    private detectTools;
    /**
     * 🏗️ Detect architecture type
     */
    private detectArchitecture;
    /**
     * 🚀 Detect deployment target
     */
    private detectDeploymentTarget;
    /**
     * 🗄️ Detect database type
     */
    private detectDatabase;
    /**
     * 🧪 Detect testing framework
     */
    private detectTestingFramework;
    /**
     * ☁️ Detect cloud provider
     */
    private detectCloudProvider;
    /**
     * 🤖 Generate AI suggestions
     */
    private generateAISuggestions;
    /**
     * 📊 Calculate detection confidence
     */
    private calculateConfidence;
    /**
     * ⚙️ Generate magic configuration
     */
    private generateMagicConfiguration;
    /**
     * 👥 Get recommended agents for project type
     */
    private getRecommendedAgents;
    /**
     * 📝 Generate workflow steps
     */
    private generateWorkflowSteps;
    /**
     * 🛡️ Generate quality gates
     */
    private generateQualityGates;
    /**
     * 🚀 Generate deployment steps
     */
    private generateDeploymentSteps;
    private calculatePatternScore;
    private mapToProjectType;
    private getFilesList;
    private generateAutoSetupCommands;
    private generateTeamRecommendations;
}
//# sourceMappingURL=UniversalProjectDetector.d.ts.map