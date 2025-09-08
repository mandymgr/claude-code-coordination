"use strict";
/**
 * 🧠 Adaptive AI Assistant
 * Learns from your coding patterns and provides intelligent, context-aware assistance
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
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
Object.defineProperty(exports, "__esModule", { value: true });
exports.AdaptiveAIAssistant = void 0;
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
const SmartResponseCache_js_1 = require("./SmartResponseCache.js");
class AdaptiveAIAssistant {
    constructor(projectPath = process.cwd()) {
        this.projectPath = projectPath;
        this.learningPath = path.join(projectPath, '.claude-coordination', 'ai-learning.json');
        this.patterns = this.loadLearningData();
        this.contextWindow = [];
        this.skillLevel = 'intermediate';
        this.cache = new SmartResponseCache_js_1.SmartResponseCache(projectPath);
        this.userProfile = this.loadUserProfile();
    }
    /**
     * 🎯 Main AI assistant interface
     */
    async assist(query, context = {}) {
        console.log('🧠 AI Assistant analyzing your request...');
        // Try to get cached response first
        const cachedResponse = await this.cache.get(query, context);
        if (cachedResponse) {
            console.log('⚡ Using cached response for faster performance');
            return cachedResponse;
        }
        // Update context window
        this.updateContextWindow(query, context);
        // Determine assistance type
        const assistanceType = this.classifyQuery(query);
        // Generate personalized response
        const response = await this.generateResponse(query, context, assistanceType);
        // Cache the response
        await this.cache.set(query, response, context);
        // Learn from this interaction
        this.learnFromInteraction(query, response, context);
        return response;
    }
    /**
     * 🔍 Classify the type of assistance needed
     */
    classifyQuery(query) {
        const lowercaseQuery = query.toLowerCase();
        const patterns = {
            'debug': ['error', 'bug', 'not working', 'broken', 'fix'],
            'explain': ['what is', 'how does', 'explain', 'understand'],
            'implement': ['create', 'build', 'implement', 'add', 'make'],
            'optimize': ['optimize', 'improve', 'better', 'performance', 'faster'],
            'refactor': ['refactor', 'clean', 'restructure', 'organize'],
            'test': ['test', 'testing', 'spec', 'mock']
        };
        for (const [type, keywords] of Object.entries(patterns)) {
            for (const keyword of keywords) {
                if (lowercaseQuery.includes(keyword)) {
                    return type;
                }
            }
        }
        return 'general';
    }
    /**
     * 💡 Generate personalized response
     */
    async generateResponse(query, context, assistanceType) {
        // Adapt response based on skill level
        const complexity = this.getComplexityLevel();
        // Check patterns for similar queries
        const similarPattern = this.findSimilarPattern(query);
        // Generate base response
        let response;
        switch (assistanceType) {
            case 'debug':
                response = await this.generateDebugResponse(query, context, complexity);
                break;
            case 'explain':
                response = await this.generateExplanationResponse(query, context, complexity);
                break;
            case 'implement':
                response = await this.generateImplementationResponse(query, context, complexity);
                break;
            case 'optimize':
                response = await this.generateOptimizationResponse(query, context, complexity);
                break;
            default:
                response = await this.generateGeneralResponse(query, context, complexity);
        }
        // Enhance response with learning data
        if (similarPattern) {
            response.confidence *= similarPattern.successRate;
            response.reasoning += ` (Based on similar pattern: ${similarPattern.pattern})`;
        }
        return response;
    }
    /**
     * 🐛 Generate debug assistance
     */
    async generateDebugResponse(query, context, complexity) {
        const debugSteps = this.getDebugSteps(complexity);
        const commonIssues = this.getCommonIssues(context.projectType);
        return {
            type: 'fix',
            content: this.formatDebugSuggestion(query, debugSteps, commonIssues),
            confidence: 0.8,
            reasoning: 'Generated debug strategy based on common patterns and project context',
            codeSnippet: this.generateDebugCode(query, context),
            resources: this.getDebugResources(context.projectType)
        };
    }
    /**
     * 📚 Generate explanation response
     */
    async generateExplanationResponse(query, context, complexity) {
        const explanationDepth = complexity > 0.7 ? 'detailed' : complexity > 0.4 ? 'moderate' : 'simple';
        return {
            type: 'explanation',
            content: this.formatExplanation(query, explanationDepth),
            confidence: 0.85,
            reasoning: `Explanation tailored for ${this.skillLevel} level`,
            codeSnippet: this.generateExampleCode(query, context),
            resources: this.getEducationalResources(query)
        };
    }
    /**
     * 🔨 Generate implementation assistance
     */
    async generateImplementationResponse(query, context, complexity) {
        const implementationApproach = this.chooseImplementationApproach(query, context, complexity);
        return {
            type: 'suggestion',
            content: this.formatImplementationPlan(query, implementationApproach),
            confidence: 0.75,
            reasoning: 'Implementation plan based on best practices and project context',
            codeSnippet: this.generateImplementationCode(query, context),
            resources: this.getImplementationResources(context.projectType)
        };
    }
    /**
     * ⚡ Generate optimization response
     */
    async generateOptimizationResponse(query, context, complexity) {
        const optimizationStrategies = this.getOptimizationStrategies(context.projectType);
        return {
            type: 'suggestion',
            content: this.formatOptimizationSuggestions(query, optimizationStrategies),
            confidence: 0.8,
            reasoning: 'Optimization suggestions based on performance patterns',
            codeSnippet: this.generateOptimizedCode(query, context),
            resources: this.getPerformanceResources()
        };
    }
    /**
     * 💬 Generate general response
     */
    async generateGeneralResponse(query, context, complexity) {
        return {
            type: 'suggestion',
            content: `Based on your query "${query}", here's what I suggest...`,
            confidence: 0.6,
            reasoning: 'General assistance based on query analysis',
            resources: this.getGeneralResources()
        };
    }
    /**
     * 🧠 Learn from interaction
     */
    learnFromInteraction(query, response, context) {
        // Update patterns
        const pattern = this.extractPattern(query, context);
        const existingPattern = this.patterns.find(p => p.pattern === pattern);
        if (existingPattern) {
            existingPattern.frequency++;
        }
        else {
            this.patterns.push({
                pattern,
                frequency: 1,
                context: Object.keys(context),
                successRate: 0.5 // Will be updated based on feedback
            });
        }
        // Update context window
        this.contextWindow.push({
            query,
            response: response.type,
            timestamp: Date.now(),
            confidence: response.confidence
        });
        // Limit context window size
        if (this.contextWindow.length > 50) {
            this.contextWindow = this.contextWindow.slice(-50);
        }
        this.saveLearningData();
    }
    /**
     * 🔄 Update context window
     */
    updateContextWindow(query, context) {
        this.contextWindow.push({
            query,
            context: context,
            timestamp: Date.now()
        });
        // Keep only recent context
        const tenMinutesAgo = Date.now() - 10 * 60 * 1000;
        this.contextWindow = this.contextWindow.filter(item => item.timestamp > tenMinutesAgo);
    }
    /**
     * 🎯 Get complexity level for current user
     */
    getComplexityLevel() {
        const levelMap = {
            'beginner': 0.3,
            'intermediate': 0.6,
            'expert': 0.9
        };
        return levelMap[this.skillLevel] || 0.6;
    }
    /**
     * 🔍 Find similar patterns
     */
    findSimilarPattern(query) {
        const queryWords = query.toLowerCase().split(' ');
        let bestMatch = null;
        let bestScore = 0;
        for (const pattern of this.patterns) {
            const patternWords = pattern.pattern.toLowerCase().split(' ');
            const commonWords = queryWords.filter(word => patternWords.includes(word));
            const score = commonWords.length / Math.max(queryWords.length, patternWords.length);
            if (score > bestScore && score > 0.3) {
                bestScore = score;
                bestMatch = pattern;
            }
        }
        return bestMatch;
    }
    /**
     * 🧩 Extract pattern from query
     */
    extractPattern(query, context) {
        // Simplify query to extract core pattern
        const words = query.toLowerCase().split(' ');
        const meaningfulWords = words.filter(word => word.length > 3 &&
            !['the', 'and', 'for', 'with', 'this', 'that', 'from'].includes(word));
        return meaningfulWords.slice(0, 5).join(' ');
    }
    // Helper methods for generating specific response types
    getDebugSteps(complexity) {
        const basicSteps = [
            'Check console for errors',
            'Verify variable values',
            'Test with simple inputs'
        ];
        const advancedSteps = [
            'Use debugger breakpoints',
            'Check network requests',
            'Validate data flow',
            'Review error boundaries',
            'Check memory usage'
        ];
        return complexity > 0.6 ? [...basicSteps, ...advancedSteps] : basicSteps;
    }
    getCommonIssues(projectType) {
        const issueMap = {
            'web_fullstack': ['CORS issues', 'State management', 'API integration'],
            'mobile_app': ['Platform differences', 'Permission handling', 'Navigation'],
            'api_microservices': ['Authentication', 'Rate limiting', 'Data consistency']
        };
        return issueMap[projectType || 'general'] || ['Syntax errors', 'Logic issues', 'Dependencies'];
    }
    formatDebugSuggestion(query, steps, commonIssues) {
        return `To debug "${query}", try these steps:\n\n${steps.map((step, i) => `${i + 1}. ${step}`).join('\n')}\n\nCommon issues to check: ${commonIssues.join(', ')}`;
    }
    formatExplanation(query, depth) {
        const explanations = {
            'simple': `Here's a simple explanation of "${query}":`,
            'moderate': `Let me explain "${query}" in detail:`,
            'detailed': `Here's a comprehensive explanation of "${query}":`
        };
        return explanations[depth] || explanations.moderate;
    }
    formatImplementationPlan(query, approach) {
        return `To implement "${query}", I recommend this approach:\n\n${approach}`;
    }
    chooseImplementationApproach(query, context, complexity) {
        // Simplified implementation approach selection
        return complexity > 0.7 ?
            'Use a modular, test-driven approach with proper error handling' :
            'Start with a simple implementation and iterate';
    }
    getOptimizationStrategies(projectType) {
        const strategies = {
            'web_fullstack': ['Code splitting', 'Lazy loading', 'Caching', 'Bundle optimization'],
            'mobile_app': ['Image optimization', 'Memory management', 'Battery efficiency'],
            'api_microservices': ['Query optimization', 'Caching', 'Connection pooling']
        };
        return strategies[projectType || 'general'] || ['Code optimization', 'Performance monitoring'];
    }
    formatOptimizationSuggestions(query, strategies) {
        return `For optimizing "${query}", consider these strategies:\n\n${strategies.map((strategy, i) => `${i + 1}. ${strategy}`).join('\n')}`;
    }
    // Code generation helpers
    generateDebugCode(query, context) {
        return `// Debug code for: ${query}\nconsole.log('Debug point reached');\n// Add your debugging logic here`;
    }
    generateExampleCode(query, context) {
        return `// Example for: ${query}\n// This is a simple example to illustrate the concept`;
    }
    generateImplementationCode(query, context) {
        return `// Implementation for: ${query}\n// TODO: Implement the functionality\nfunction implement() {\n  // Your code here\n}`;
    }
    generateOptimizedCode(query, context) {
        return `// Optimized approach for: ${query}\n// This version focuses on performance`;
    }
    // Resource helpers
    getDebugResources(projectType) {
        return [
            'Developer Tools Documentation',
            'Debugging Best Practices',
            'Error Handling Patterns'
        ];
    }
    getEducationalResources(query) {
        return [
            'Official Documentation',
            'Tutorial Articles',
            'Video Explanations'
        ];
    }
    getImplementationResources(projectType) {
        return [
            'Best Practices Guide',
            'Code Examples',
            'Architecture Patterns'
        ];
    }
    getPerformanceResources() {
        return [
            'Performance Optimization Guide',
            'Profiling Tools',
            'Benchmark Strategies'
        ];
    }
    getGeneralResources() {
        return [
            'General Documentation',
            'Community Forums',
            'Stack Overflow'
        ];
    }
    /**
     * 💾 Load learning data
     */
    loadLearningData() {
        try {
            if (fs.existsSync(this.learningPath)) {
                const data = fs.readFileSync(this.learningPath, 'utf8');
                return JSON.parse(data);
            }
        }
        catch (error) {
            console.warn('Could not load learning data:', error);
        }
        return [];
    }
    /**
     * 💾 Save learning data
     */
    saveLearningData() {
        try {
            const dir = path.dirname(this.learningPath);
            if (!fs.existsSync(dir)) {
                fs.mkdirSync(dir, { recursive: true });
            }
            fs.writeFileSync(this.learningPath, JSON.stringify(this.patterns, null, 2));
        }
        catch (error) {
            console.warn('Could not save learning data:', error);
        }
    }
    /**
     * 👤 Load user profile
     */
    loadUserProfile() {
        try {
            const profilePath = path.join(path.dirname(this.learningPath), 'user-profile.json');
            if (fs.existsSync(profilePath)) {
                const data = fs.readFileSync(profilePath, 'utf8');
                return JSON.parse(data);
            }
        }
        catch (error) {
            console.warn('Could not load user profile:', error);
        }
        return {
            skillLevel: 'intermediate',
            preferredLanguages: ['javascript', 'typescript'],
            workingPatterns: [],
            successfulSuggestions: [],
            rejectedSuggestions: [],
            learningGoals: []
        };
    }
    /**
     * 📈 Update user profile based on feedback
     */
    async updateProfile(feedback, suggestion) {
        if (feedback === 'positive') {
            this.userProfile.successfulSuggestions.push(suggestion);
        }
        else {
            this.userProfile.rejectedSuggestions.push(suggestion);
        }
        // Adjust skill level based on feedback patterns
        const successRate = this.userProfile.successfulSuggestions.length /
            (this.userProfile.successfulSuggestions.length + this.userProfile.rejectedSuggestions.length);
        if (successRate > 0.8 && this.skillLevel !== 'expert') {
            this.skillLevel = this.skillLevel === 'beginner' ? 'intermediate' : 'expert';
        }
        await this.saveUserProfile();
    }
    /**
     * 💾 Save user profile
     */
    async saveUserProfile() {
        try {
            const profilePath = path.join(path.dirname(this.learningPath), 'user-profile.json');
            fs.writeFileSync(profilePath, JSON.stringify(this.userProfile, null, 2));
        }
        catch (error) {
            console.warn('Could not save user profile:', error);
        }
    }
}
exports.AdaptiveAIAssistant = AdaptiveAIAssistant;
//# sourceMappingURL=AdaptiveAIAssistant.js.map