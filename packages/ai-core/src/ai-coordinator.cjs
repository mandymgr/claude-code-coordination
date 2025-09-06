#!/usr/bin/env node

/**
 * Claude Code Coordination - AI-Powered Task Coordinator v3.0
 * Intelligent task suggestions, conflict prediction, and auto-assignment
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class AICoordinator {
    constructor(coordinationDir = '.claude-coordination') {
        this.coordinationDir = path.resolve(coordinationDir);
        this.systemFile = path.join(this.coordinationDir, 'system.json');
        this.aiStateFile = path.join(this.coordinationDir, 'ai-state.json');
        
        // AI learning parameters
        this.learningRate = 0.1;
        this.conflictThreshold = 0.7;
        this.taskComplexityWeight = 0.3;
        this.sessionExpertiseWeight = 0.4;
        this.collaborationWeight = 0.3;
        
        // Initialize AI state
        this.aiState = this.loadAIState();
        
        // File type classifications for conflict prediction
        this.fileTypeRisk = {
            '.ts': 0.8,    // High risk - complex logic
            '.tsx': 0.9,   // Very high risk - UI + logic
            '.js': 0.7,    // Medium-high risk
            '.jsx': 0.8,   // High risk - React components
            '.json': 0.5,  // Medium risk - configuration
            '.md': 0.2,    // Low risk - documentation
            '.css': 0.4,   // Medium-low risk - styling
            '.sql': 0.9,   // Very high risk - database changes
            '.prisma': 0.9 // Very high risk - schema changes
        };
        
        // Task complexity indicators
        this.complexityKeywords = {
            'authentication': 0.9,
            'database': 0.8,
            'api': 0.7,
            'payment': 0.9,
            'security': 0.9,
            'migration': 0.8,
            'refactor': 0.6,
            'component': 0.5,
            'styling': 0.3,
            'documentation': 0.2,
            'bug': 0.4,
            'feature': 0.6
        };
    }

    /**
     * Load AI learning state
     */
    loadAIState() {
        try {
            if (fs.existsSync(this.aiStateFile)) {
                return JSON.parse(fs.readFileSync(this.aiStateFile, 'utf8'));
            }
        } catch (error) {
            console.warn(`Warning: Could not load AI state: ${error.message}`);
        }
        
        return {
            version: "3.0.0",
            sessionProfiles: {}, // Session expertise and performance data
            fileRelationships: {}, // File dependency patterns
            conflictPatterns: [], // Historical conflict data
            taskSuccessPatterns: [], // Successful task completions
            collaborationMatrix: {}, // Session collaboration effectiveness
            lastLearning: Date.now()
        };
    }

    /**
     * Save AI learning state
     */
    saveAIState() {
        try {
            this.aiState.lastLearning = Date.now();
            fs.writeFileSync(this.aiStateFile, JSON.stringify(this.aiState, null, 2));
            return true;
        } catch (error) {
            console.error(`Error saving AI state: ${error.message}`);
            return false;
        }
    }

    /**
     * Load current system state
     */
    loadSystemState() {
        try {
            if (fs.existsSync(this.systemFile)) {
                return JSON.parse(fs.readFileSync(this.systemFile, 'utf8'));
            }
        } catch (error) {
            console.warn(`Warning: Could not load system state: ${error.message}`);
        }
        
        return { sessions: {}, locks: {}, sharedState: {} };
    }

    /**
     * Analyze file change patterns and relationships
     */
    analyzeFileRelationships(filePath, sessionId) {
        const fileKey = this.getFileKey(filePath);
        const now = Date.now();
        
        if (!this.aiState.fileRelationships[fileKey]) {
            this.aiState.fileRelationships[fileKey] = {
                path: filePath,
                editHistory: [],
                relatedFiles: {},
                conflictScore: 0,
                lastModified: now
            };
        }
        
        const fileData = this.aiState.fileRelationships[fileKey];
        
        // Add edit history
        fileData.editHistory.push({
            sessionId: sessionId,
            timestamp: now,
            dayOfWeek: new Date().getDay(),
            hour: new Date().getHours()
        });
        
        // Keep only last 50 edits for performance
        if (fileData.editHistory && fileData.editHistory.length > 50) {
            fileData.editHistory = fileData.editHistory.slice(-50);
        }
        
        fileData.lastModified = now;
        
        // Update conflict score based on edit patterns
        this.updateConflictScore(fileKey);
        
        return fileData;
    }

    /**
     * Generate intelligent task suggestions based on file changes and context
     */
    async generateTaskSuggestions(sessionId, recentFiles = []) {
        const systemState = this.loadSystemState();
        const session = systemState.sessions[sessionId];
        
        if (!session) {
            return { suggestions: [], confidence: 0 };
        }
        
        const suggestions = [];
        const sessionProfile = this.getSessionProfile(sessionId);
        
        // Analyze recent file changes
        for (const filePath of recentFiles) {
            const fileAnalysis = this.analyzeFileContext(filePath);
            const taskSuggestions = this.generateFileBasedTasks(filePath, fileAnalysis, sessionProfile);
            suggestions.push(...taskSuggestions);
        }
        
        // Generate coordination suggestions
        const coordinationTasks = this.generateCoordinationTasks(sessionId, systemState);
        suggestions.push(...coordinationTasks);
        
        // Generate proactive suggestions
        const proactiveTasks = this.generateProactiveTasks(sessionId, systemState);
        suggestions.push(...proactiveTasks);
        
        // Rank suggestions by relevance and confidence
        const rankedSuggestions = this.rankSuggestions(suggestions, sessionProfile);
        
        return {
            suggestions: rankedSuggestions.slice(0, 5), // Top 5 suggestions
            confidence: this.calculateOverallConfidence(rankedSuggestions),
            sessionProfile: sessionProfile
        };
    }

    /**
     * Predict potential conflicts before they occur
     */
    async predictConflicts(sessionId, targetFile) {
        const systemState = this.loadSystemState();
        const fileKey = this.getFileKey(targetFile);
        const fileData = this.aiState.fileRelationships[fileKey];
        
        if (!fileData) {
            return { conflictRisk: 0, recommendations: [] };
        }
        
        const predictions = {
            conflictRisk: 0,
            riskFactors: [],
            recommendations: [],
            relatedFiles: [],
            timeWindow: 30 * 60 * 1000 // 30 minutes
        };
        
        // Check if file is currently locked
        const isLocked = systemState.locks[targetFile];
        if (isLocked && isLocked.sessionId !== sessionId) {
            predictions.conflictRisk = 0.9;
            predictions.riskFactors.push('File currently locked by another session');
            predictions.recommendations.push(`Wait for ${isLocked.sessionId.substring(0, 8)}... to finish`);
        }
        
        // Analyze historical conflict patterns
        const historicalRisk = this.calculateHistoricalConflictRisk(fileKey);
        predictions.conflictRisk = Math.max(predictions.conflictRisk, historicalRisk);
        
        // Check file type risk
        const ext = path.extname(targetFile);
        const typeRisk = this.fileTypeRisk[ext] || 0.5;
        predictions.conflictRisk = Math.max(predictions.conflictRisk, typeRisk * 0.6);
        
        if (typeRisk > 0.7) {
            predictions.riskFactors.push(`High-risk file type: ${ext}`);
        }
        
        // Check recent edit frequency
        const recentEdits = fileData?.editHistory?.filter(edit => 
            Date.now() - edit.timestamp < predictions.timeWindow
        ) || [];
        
        if (recentEdits.length > 2) {
            predictions.conflictRisk = Math.max(predictions.conflictRisk, 0.8);
            predictions.riskFactors.push('Frequent recent edits detected');
            predictions.recommendations.push('Consider coordinating with other sessions');
        }
        
        // Find related files that might be affected
        predictions.relatedFiles = this.findRelatedFiles(targetFile);
        
        // Generate specific recommendations
        if (predictions.conflictRisk > this.conflictThreshold) {
            predictions.recommendations.push(
                'High conflict risk detected',
                'Consider broadcasting intent to edit',
                'Coordinate with active sessions',
                'Review recent changes before editing'
            );
        }
        
        return predictions;
    }

    /**
     * Auto-assign tasks to the most suitable Claude session
     */
    async autoAssignTask(taskDescription, availableSessions = []) {
        const systemState = this.loadSystemState();
        
        // Get all active sessions if none specified
        if (availableSessions.length === 0) {
            availableSessions = Object.keys(systemState.sessions).filter(id => 
                systemState.sessions[id].status !== 'zombie'
            );
        }
        
        if (availableSessions.length === 0) {
            return { assignment: null, reason: 'No active sessions available' };
        }
        
        const taskAnalysis = this.analyzeTaskComplexity(taskDescription);
        const sessionScores = [];
        
        // Score each available session
        for (const sessionId of availableSessions) {
            const sessionProfile = this.getSessionProfile(sessionId);
            const score = this.calculateSessionScore(sessionProfile, taskAnalysis, systemState.sessions[sessionId]);
            
            sessionScores.push({
                sessionId: sessionId,
                score: score,
                profile: sessionProfile,
                reasoning: this.generateAssignmentReasoning(sessionProfile, taskAnalysis)
            });
        }
        
        // Sort by score (highest first)
        sessionScores.sort((a, b) => b.score - a.score);
        
        const bestSession = sessionScores[0];
        
        return {
            assignment: bestSession.sessionId,
            score: bestSession.score,
            reasoning: bestSession.reasoning,
            alternatives: sessionScores.slice(1, 3), // Top 2 alternatives
            taskAnalysis: taskAnalysis,
            confidence: bestSession.score > 0.7 ? 'high' : bestSession.score > 0.5 ? 'medium' : 'low'
        };
    }

    /**
     * Learn from completed tasks and update AI models
     */
    async learnFromCompletion(sessionId, taskDescription, success, duration, filesModified = []) {
        const taskAnalysis = this.analyzeTaskComplexity(taskDescription);
        const sessionProfile = this.getSessionProfile(sessionId);
        
        // Update session profile based on task completion
        if (success) {
            sessionProfile.successfulTasks++;
            sessionProfile.totalDuration += duration;
            
            // Update expertise areas
            for (const keyword of taskAnalysis.keywords) {
                if (!sessionProfile.expertise[keyword]) {
                    sessionProfile.expertise[keyword] = 0;
                }
                sessionProfile.expertise[keyword] += this.learningRate;
            }
            
            // Update file type expertise
            for (const file of filesModified) {
                const ext = path.extname(file);
                if (!sessionProfile.fileTypeExpertise[ext]) {
                    sessionProfile.fileTypeExpertise[ext] = 0;
                }
                sessionProfile.fileTypeExpertise[ext] += this.learningRate;
            }
        } else {
            sessionProfile.failedTasks++;
        }
        
        // Store success pattern
        this.aiState.taskSuccessPatterns.push({
            sessionId: sessionId,
            task: taskDescription,
            success: success,
            duration: duration,
            complexity: taskAnalysis.complexity,
            keywords: taskAnalysis.keywords,
            filesModified: filesModified,
            timestamp: Date.now()
        });
        
        // Keep only last 200 patterns
        if (this.aiState.taskSuccessPatterns.length > 200) {
            this.aiState.taskSuccessPatterns = this.aiState.taskSuccessPatterns.slice(-200);
        }
        
        // Update AI state
        this.aiState.sessionProfiles[sessionId] = sessionProfile;
        this.saveAIState();
        
        return {
            learningApplied: true,
            sessionProfile: sessionProfile,
            improvedExpertise: taskAnalysis.keywords
        };
    }

    /**
     * Get or create session profile with expertise tracking
     */
    getSessionProfile(sessionId) {
        if (!this.aiState.sessionProfiles[sessionId]) {
            this.aiState.sessionProfiles[sessionId] = {
                sessionId: sessionId,
                createdAt: Date.now(),
                successfulTasks: 0,
                failedTasks: 0,
                totalDuration: 0,
                expertise: {}, // keyword -> expertise level (0-1)
                fileTypeExpertise: {}, // extension -> expertise level (0-1)
                collaborationStyle: 'adaptive', // adaptive, independent, collaborative
                preferredComplexity: 0.5, // 0=simple, 1=complex
                timePatterns: { // when this session is most active
                    hourPreferences: {},
                    dayPreferences: {}
                },
                lastActive: Date.now()
            };
        }
        
        return this.aiState.sessionProfiles[sessionId];
    }

    /**
     * Analyze task complexity and extract keywords
     */
    analyzeTaskComplexity(taskDescription) {
        const text = taskDescription.toLowerCase();
        const keywords = [];
        let complexity = 0;
        
        // Extract keywords and calculate complexity
        for (const [keyword, weight] of Object.entries(this.complexityKeywords)) {
            if (text.includes(keyword)) {
                keywords.push(keyword);
                complexity += weight;
            }
        }
        
        // Normalize complexity (0-1)
        complexity = Math.min(complexity / 3, 1);
        
        // Additional complexity indicators
        const wordCount = text.split(' ').length;
        if (wordCount > 10) complexity += 0.1;
        if (wordCount > 20) complexity += 0.1;
        
        // Technical indicators
        if (text.match(/\b(implement|create|build|develop)\b/)) complexity += 0.2;
        if (text.match(/\b(fix|debug|resolve)\b/)) complexity += 0.1;
        if (text.match(/\b(refactor|optimize|improve)\b/)) complexity += 0.15;
        
        return {
            complexity: Math.min(complexity, 1),
            keywords: keywords,
            wordCount: wordCount,
            technicalTerms: this.extractTechnicalTerms(text)
        };
    }

    /**
     * Calculate session suitability score for a task
     */
    calculateSessionScore(sessionProfile, taskAnalysis, sessionState) {
        let score = 0;
        
        // Base score from success rate
        const successRate = sessionProfile.successfulTasks / 
            Math.max(sessionProfile.successfulTasks + sessionProfile.failedTasks, 1);
        score += successRate * 0.3;
        
        // Expertise matching
        let expertiseScore = 0;
        for (const keyword of taskAnalysis.keywords) {
            const expertise = sessionProfile.expertise[keyword] || 0;
            expertiseScore += expertise;
        }
        expertiseScore = expertiseScore / Math.max(taskAnalysis.keywords.length, 1);
        score += expertiseScore * this.sessionExpertiseWeight;
        
        // Complexity preference matching
        const complexityMatch = 1 - Math.abs(sessionProfile.preferredComplexity - taskAnalysis.complexity);
        score += complexityMatch * this.taskComplexityWeight;
        
        // Current workload (prefer less busy sessions)
        const currentTask = sessionState.currentTask;
        if (!currentTask) {
            score += 0.2; // Bonus for available sessions
        }
        
        // File lock conflicts
        const workingFiles = sessionState.workingFiles || [];
        if (workingFiles.length > 2) {
            score -= 0.1; // Penalty for sessions with many locks
        }
        
        return Math.min(Math.max(score, 0), 1);
    }

    /**
     * Generate reasoning for task assignment
     */
    generateAssignmentReasoning(sessionProfile, taskAnalysis) {
        const reasons = [];
        
        // Success rate
        const successRate = sessionProfile.successfulTasks / 
            Math.max(sessionProfile.successfulTasks + sessionProfile.failedTasks, 1);
        
        if (successRate > 0.8) {
            reasons.push(`High success rate (${Math.round(successRate * 100)}%)`);
        }
        
        // Expertise matching
        const matchingExpertise = taskAnalysis.keywords.filter(kw => 
            (sessionProfile.expertise[kw] || 0) > 0.5
        );
        
        if (matchingExpertise.length > 0) {
            reasons.push(`Expertise in: ${matchingExpertise.join(', ')}`);
        }
        
        // Complexity match
        const complexityDiff = Math.abs(sessionProfile.preferredComplexity - taskAnalysis.complexity);
        if (complexityDiff < 0.2) {
            reasons.push('Good complexity match for session preferences');
        }
        
        if (reasons.length === 0) {
            reasons.push('Available session with general capabilities');
        }
        
        return reasons;
    }

    /**
     * Utility methods
     */
    
    getFileKey(filePath) {
        return crypto.createHash('md5').update(filePath).digest('hex').substring(0, 8);
    }

    analyzeFileContext(filePath) {
        const ext = path.extname(filePath);
        const fileName = path.basename(filePath);
        const directory = path.dirname(filePath);
        
        return {
            extension: ext,
            name: fileName,
            directory: directory,
            riskLevel: this.fileTypeRisk[ext] || 0.5,
            isCore: fileName.includes('index') || fileName.includes('main'),
            isConfig: ext === '.json' || fileName.includes('config'),
            isComponent: ext === '.tsx' || ext === '.jsx'
        };
    }

    generateFileBasedTasks(filePath, analysis, sessionProfile) {
        const suggestions = [];
        const baseName = path.basename(filePath, analysis.extension);
        
        if (analysis.isComponent) {
            suggestions.push({
                type: 'enhancement',
                description: `Add tests for ${baseName} component`,
                confidence: 0.7,
                files: [filePath],
                complexity: 0.4
            });
            
            suggestions.push({
                type: 'improvement',  
                description: `Review accessibility in ${baseName}`,
                confidence: 0.6,
                files: [filePath],
                complexity: 0.3
            });
        }
        
        if (analysis.riskLevel > 0.7) {
            suggestions.push({
                type: 'safety',
                description: `Add error handling to ${baseName}`,
                confidence: 0.8,
                files: [filePath],
                complexity: 0.5
            });
        }
        
        return suggestions;
    }

    generateCoordinationTasks(sessionId, systemState) {
        const suggestions = [];
        const activeSessions = Object.keys(systemState.sessions).length;
        
        if (activeSessions > 3) {
            suggestions.push({
                type: 'coordination',
                description: 'Review and coordinate with other active sessions',
                confidence: 0.6,
                complexity: 0.3
            });
        }
        
        const locksCount = Object.keys(systemState.locks).length;
        if (locksCount > 5) {
            suggestions.push({
                type: 'maintenance',
                description: 'Check for stuck file locks and cleanup if needed',
                confidence: 0.8,
                complexity: 0.2
            });
        }
        
        return suggestions;
    }

    generateProactiveTasks(sessionId, systemState) {
        // This would analyze project state and suggest proactive improvements
        return [];
    }

    rankSuggestions(suggestions, sessionProfile) {
        return suggestions.map(suggestion => ({
            ...suggestion,
            score: this.calculateSuggestionScore(suggestion, sessionProfile)
        })).sort((a, b) => b.score - a.score);
    }

    calculateSuggestionScore(suggestion, sessionProfile) {
        let score = suggestion.confidence || 0.5;
        
        // Adjust based on session expertise
        if (suggestion.type && sessionProfile.expertise[suggestion.type]) {
            score += sessionProfile.expertise[suggestion.type] * 0.3;
        }
        
        // Adjust based on complexity preference
        if (suggestion.complexity) {
            const complexityMatch = 1 - Math.abs(sessionProfile.preferredComplexity - suggestion.complexity);
            score += complexityMatch * 0.2;
        }
        
        return Math.min(Math.max(score, 0), 1);
    }

    calculateOverallConfidence(suggestions) {
        if (suggestions.length === 0) return 0;
        
        const avgScore = suggestions.reduce((sum, s) => sum + (s.score || 0), 0) / suggestions.length;
        return avgScore;
    }

    updateConflictScore(fileKey) {
        // This would analyze edit patterns to predict conflict likelihood
        // Implementation would look at edit frequency, session overlap, etc.
    }

    calculateHistoricalConflictRisk(fileKey) {
        // Analyze historical conflicts for this file
        const conflicts = this.aiState.conflictPatterns.filter(c => c.fileKey === fileKey);
        return Math.min(conflicts.length * 0.1, 0.9);
    }

    findRelatedFiles(filePath) {
        // Find files that are often edited together
        const fileKey = this.getFileKey(filePath);
        const fileData = this.aiState.fileRelationships[fileKey];
        
        if (!fileData) return [];
        
        return Object.keys(fileData.relatedFiles || {})
            .sort((a, b) => (fileData.relatedFiles[b] || 0) - (fileData.relatedFiles[a] || 0))
            .slice(0, 5);
    }

    extractTechnicalTerms(text) {
        const technicalPatterns = [
            /\b(api|endpoint|route|controller)\b/g,
            /\b(database|sql|query|migration)\b/g,
            /\b(component|jsx|tsx|react)\b/g,
            /\b(authentication|auth|login|token)\b/g,
            /\b(payment|stripe|vipps|checkout)\b/g
        ];
        
        const terms = [];
        for (const pattern of technicalPatterns) {
            const matches = text.match(pattern);
            if (matches) terms.push(...matches);
        }
        
        return [...new Set(terms)]; // Remove duplicates
    }
}

// CLI Interface
async function main() {
    const args = process.argv.slice(2);
    const command = args[0] || 'suggest';
    
    const coordinator = new AICoordinator();

    try {
        switch (command) {
            case 'suggest':
                const sessionId = args[1] || process.env.CLAUDE_SESSION_ID;
                if (!sessionId) {
                    console.log('❌ Session ID required. Set CLAUDE_SESSION_ID or provide as argument.');
                    return;
                }
                
                const files = args.slice(2);
                const suggestions = await coordinator.generateTaskSuggestions(sessionId, files);
                
                console.log('🤖 AI Task Suggestions');
                console.log('======================\n');
                
                if (suggestions.suggestions.length === 0) {
                    console.log('💭 No specific suggestions at this time.');
                    console.log('   Continue with your current work or try /broadcast to coordinate with other sessions.\n');
                } else {
                    suggestions.suggestions.forEach((suggestion, index) => {
                        console.log(`${index + 1}. 📋 ${suggestion.description}`);
                        console.log(`   Type: ${suggestion.type} | Confidence: ${Math.round((suggestion.score || 0) * 100)}%`);
                        if (suggestion.files) {
                            console.log(`   Files: ${suggestion.files.map(f => path.basename(f)).join(', ')}`);
                        }
                        console.log('');
                    });
                }
                
                console.log(`🎯 Overall Confidence: ${Math.round(suggestions.confidence * 100)}%`);
                break;
                
            case 'predict':
                const targetFile = args[1];
                const predictSessionId = args[2] || process.env.CLAUDE_SESSION_ID;
                
                if (!targetFile || !predictSessionId) {
                    console.log('Usage: predict <file> [session-id]');
                    return;
                }
                
                const prediction = await coordinator.predictConflicts(predictSessionId, targetFile);
                
                console.log('🔮 Conflict Prediction');
                console.log('======================\n');
                console.log(`📁 File: ${path.basename(targetFile)}`);
                console.log(`⚠️  Conflict Risk: ${Math.round(prediction.conflictRisk * 100)}%\n`);
                
                if (prediction.riskFactors && prediction.riskFactors.length > 0) {
                    console.log('🚨 Risk Factors:');
                    prediction.riskFactors.forEach(factor => {
                        console.log(`   • ${factor}`);
                    });
                    console.log('');
                }
                
                if (prediction.recommendations && prediction.recommendations.length > 0) {
                    console.log('💡 Recommendations:');
                    prediction.recommendations.forEach(rec => {
                        console.log(`   • ${rec}`);
                    });
                    console.log('');
                }
                
                if (prediction.relatedFiles && prediction.relatedFiles.length > 0) {
                    console.log(`🔗 Related Files: ${prediction.relatedFiles.map(f => path.basename(f)).join(', ')}`);
                }
                break;
                
            case 'assign':
                const taskDesc = args.slice(1).join(' ');
                if (!taskDesc) {
                    console.log('Usage: assign <task description>');
                    return;
                }
                
                const assignment = await coordinator.autoAssignTask(taskDesc);
                
                console.log('🎯 Task Assignment');
                console.log('==================\n');
                console.log(`📋 Task: ${taskDesc}\n`);
                
                if (assignment.assignment) {
                    console.log(`✅ Best Assignment: ${assignment.assignment.substring(0, 8)}...`);
                    console.log(`🎯 Confidence: ${assignment.confidence}`);
                    console.log(`📊 Score: ${Math.round(assignment.score * 100)}%\n`);
                    
                    console.log('💡 Reasoning:');
                    assignment.reasoning.forEach(reason => {
                        console.log(`   • ${reason}`);
                    });
                    
                    if (assignment.alternatives.length > 0) {
                        console.log('\n🔄 Alternatives:');
                        assignment.alternatives.forEach(alt => {
                            console.log(`   ${alt.sessionId.substring(0, 8)}... (${Math.round(alt.score * 100)}%)`);
                        });
                    }
                } else {
                    console.log(`❌ ${assignment.reason}`);
                }
                break;
                
            case 'learn':
                const learnSessionId = args[1] || process.env.CLAUDE_SESSION_ID;
                const task = args[2];
                const success = args[3] === 'true';
                const duration = parseInt(args[4]) || 0;
                
                if (!learnSessionId || !task) {
                    console.log('Usage: learn <session-id> <task> <success:true/false> [duration]');
                    return;
                }
                
                const learning = await coordinator.learnFromCompletion(learnSessionId, task, success, duration);
                
                console.log('🧠 AI Learning Applied');
                console.log('======================\n');
                console.log(`✅ Learning recorded for session: ${learnSessionId.substring(0, 8)}...`);
                console.log(`📈 Task: ${task}`);
                console.log(`🎯 Success: ${success ? 'Yes' : 'No'}`);
                
                if (learning.improvedExpertise.length > 0) {
                    console.log(`🚀 Improved Expertise: ${learning.improvedExpertise.join(', ')}`);
                }
                break;
                
            default:
                console.log(`
🤖 Claude Code Coordination - AI Coordinator v3.0

Usage: node ai-coordinator.js <command> [options]

Commands:
  suggest [session-id] [files...]    Generate intelligent task suggestions
  predict <file> [session-id]       Predict conflicts for file editing
  assign <task description>          Auto-assign task to best session
  learn <session> <task> <success>   Learn from completed task

Examples:
  node ai-coordinator.js suggest $CLAUDE_SESSION_ID src/App.tsx
  node ai-coordinator.js predict src/api/users.ts  
  node ai-coordinator.js assign "implement user authentication"
  node ai-coordinator.js learn abc123 "fix login bug" true 1800

Environment:
  CLAUDE_SESSION_ID - Current session identifier
                `);
                break;
        }
    } catch (error) {
        console.error(`❌ Error: ${error.message}`);
        process.exit(1);
    }
}

// Export for use as module
module.exports = AICoordinator;

// Run CLI if executed directly
if (require.main === module) {
    main();
}