#!/usr/bin/env node

/**
 * 📝 KRINS-Universe-Builder PR Explainer
 * Ultimate AI Development Universe - Intelligent Pull Request Explanation
 */

const fs = require('fs').promises;
const path = require('path');

const COLORS = {
    PURPLE: '\x1b[35m',
    CYAN: '\x1b[36m',
    GREEN: '\x1b[32m',
    YELLOW: '\x1b[33m',
    RED: '\x1b[31m',
    BLUE: '\x1b[34m',
    MAGENTA: '\x1b[95m',
    RESET: '\x1b[0m'
};

console.log(`${COLORS.PURPLE}🌌 KRINS-Universe-Builder PR Explainer${COLORS.RESET}`);
console.log(`${COLORS.CYAN}Ultimate AI Development Universe${COLORS.RESET}`);
console.log('='.repeat(55));

class PRExplainer {
    constructor() {
        this.adrContext = new Map();
        this.patternContext = new Map();
        this.changeAnalysis = {
            files_changed: [],
            components_affected: [],
            architectural_impact: 'low',
            pattern_compliance: true,
            adr_references: []
        };
    }

    async explainPullRequest(prNumber, options = {}) {
        console.log(`${COLORS.BLUE}🔍 Analyzing Pull Request #${prNumber}${COLORS.RESET}`);
        
        try {
            // Load contextual information
            await this.loadADRContext();
            await this.loadPatternContext();
            
            // Analyze the PR changes
            const prData = await this.analyzePRChanges(prNumber);
            
            // Generate explanation
            const explanation = await this.generateExplanation(prData, options);
            
            // Output the explanation
            this.displayExplanation(explanation);
            
            if (options.output) {
                await this.saveExplanation(explanation, options.output);
            }
            
            return explanation;
            
        } catch (error) {
            console.error(`${COLORS.RED}❌ PR analysis failed: ${error.message}${COLORS.RESET}`);
            throw error;
        }
    }

    async loadADRContext() {
        console.log(`${COLORS.CYAN}📚 Loading ADR context...${COLORS.RESET}`);
        
        const adrDir = 'docs/adr';
        try {
            const files = await fs.readdir(adrDir);
            const adrFiles = files.filter(f => f.endsWith('.md') && f.match(/^\\d{4}-/));
            
            for (const file of adrFiles) {
                const filePath = path.join(adrDir, file);
                const content = await fs.readFile(filePath, 'utf8');
                const adr = this.parseADR(content, file);
                this.adrContext.set(adr.number, adr);
            }
            
            console.log(`   Loaded ${this.adrContext.size} ADRs`);
        } catch (error) {
            console.log(`   ${COLORS.YELLOW}⚠️  No ADR directory found${COLORS.RESET}`);
        }
    }

    async loadPatternContext() {
        console.log(`${COLORS.CYAN}🧩 Loading pattern context...${COLORS.RESET}`);
        
        const patternsDir = 'docs/patterns';
        try {
            const categories = await fs.readdir(patternsDir);
            let patternCount = 0;
            
            for (const category of categories) {
                const categoryPath = path.join(patternsDir, category);
                const stat = await fs.lstat(categoryPath);
                
                if (stat.isDirectory()) {
                    const patterns = await fs.readdir(categoryPath);
                    const mdPatterns = patterns.filter(p => p.endsWith('.md'));
                    
                    for (const pattern of mdPatterns) {
                        const patternPath = path.join(categoryPath, pattern);
                        const content = await fs.readFile(patternPath, 'utf8');
                        const patternData = this.parsePattern(content, pattern, category);
                        this.patternContext.set(pattern.replace('.md', ''), patternData);
                        patternCount++;
                    }
                }
            }
            
            console.log(`   Loaded ${patternCount} patterns`);
        } catch (error) {
            console.log(`   ${COLORS.YELLOW}⚠️  No patterns directory found${COLORS.RESET}`);
        }
    }

    parseADR(content, filename) {
        const lines = content.split('\\n');
        const adr = {
            number: filename.match(/^(\\d{4})/)?.[1] || 'Unknown',
            file: filename,
            title: '',
            status: 'Unknown',
            context: '',
            decision: '',
            consequences: ''
        };

        // Extract title
        const titleMatch = content.match(/^#\\s+(.+)$/m);
        adr.title = titleMatch ? titleMatch[1] : filename.replace('.md', '');

        // Extract sections
        const sections = this.extractSections(content);
        adr.status = sections.status || 'Unknown';
        adr.context = sections.context || '';
        adr.decision = sections.decision || '';
        adr.consequences = sections.consequences || '';

        return adr;
    }

    parsePattern(content, filename, category) {
        return {
            name: filename.replace('.md', ''),
            category: category,
            title: content.match(/^#\\s+(.+)$/m)?.[1] || filename,
            content: content,
            keywords: this.extractKeywords(content)
        };
    }

    extractSections(content) {
        const sections = {};
        const lines = content.split('\\n');
        let currentSection = null;
        let currentContent = [];

        for (const line of lines) {
            if (line.startsWith('## ')) {
                if (currentSection) {
                    sections[currentSection] = currentContent.join('\\n').trim();
                }
                currentSection = line.replace('## ', '').toLowerCase();
                currentContent = [];
            } else if (currentSection) {
                currentContent.push(line);
            }
        }

        if (currentSection) {
            sections[currentSection] = currentContent.join('\\n').trim();
        }

        return sections;
    }

    extractKeywords(content) {
        // Simple keyword extraction - in real implementation, this would be more sophisticated
        const words = content.toLowerCase()
            .replace(/[^a-z\\s]/g, ' ')
            .split(/\\s+/)
            .filter(word => word.length > 3);
        
        const wordCount = {};
        words.forEach(word => {
            wordCount[word] = (wordCount[word] || 0) + 1;
        });

        return Object.keys(wordCount)
            .sort((a, b) => wordCount[b] - wordCount[a])
            .slice(0, 10);
    }

    async analyzePRChanges(prNumber) {
        // In real implementation, this would use GitHub API
        // For demo, we'll simulate PR analysis
        
        const prData = {
            number: prNumber,
            title: 'Add new AI coordination features',
            description: 'This PR adds new AI coordination capabilities including pattern recognition and workflow automation.',
            files_changed: [
                'apps/backend/src/services/ai/coordinationService.ts',
                'apps/frontend/src/components/AICoordination.tsx',
                'packages/shared/src/types/ai.ts',
                'docs/adr/0012-ai-coordination-architecture.md'
            ],
            lines_added: 456,
            lines_deleted: 23,
            commits: 8
        };

        // Analyze architectural impact
        this.changeAnalysis.files_changed = prData.files_changed;
        this.changeAnalysis.components_affected = this.identifyAffectedComponents(prData.files_changed);
        this.changeAnalysis.architectural_impact = this.assessArchitecturalImpact(prData);
        this.changeAnalysis.adr_references = this.findRelevantADRs(prData);
        this.changeAnalysis.pattern_compliance = this.checkPatternCompliance(prData);

        return prData;
    }

    identifyAffectedComponents(files) {
        const components = new Set();
        
        files.forEach(file => {
            if (file.includes('/backend/')) components.add('Backend API');
            if (file.includes('/frontend/')) components.add('Frontend UI');
            if (file.includes('/shared/')) components.add('Shared Types');
            if (file.includes('/ai/')) components.add('AI Services');
            if (file.includes('/docs/')) components.add('Documentation');
            if (file.includes('Service.ts')) components.add('Service Layer');
            if (file.includes('Component.tsx')) components.add('React Components');
        });

        return Array.from(components);
    }

    assessArchitecturalImpact(prData) {
        let impact = 'low';
        
        if (prData.lines_added > 500) impact = 'high';
        else if (prData.lines_added > 200) impact = 'medium';
        
        if (prData.files_changed.some(f => f.includes('/adr/'))) impact = 'high';
        if (prData.files_changed.some(f => f.includes('/types/'))) impact = 'medium';
        
        return impact;
    }

    findRelevantADRs(prData) {
        const relevantADRs = [];
        
        // Simple keyword matching - in real implementation, this would be more sophisticated
        const prText = `${prData.title} ${prData.description}`.toLowerCase();
        
        for (const [number, adr] of this.adrContext) {
            const adrText = `${adr.title} ${adr.context} ${adr.decision}`.toLowerCase();
            
            // Check for keyword overlap
            const prWords = prText.split(/\\s+/);
            const adrWords = adrText.split(/\\s+/);
            const overlap = prWords.filter(word => adrWords.includes(word) && word.length > 4);
            
            if (overlap.length > 2) {
                relevantADRs.push({
                    number: adr.number,
                    title: adr.title,
                    relevance: overlap.length
                });
            }
        }
        
        return relevantADRs.sort((a, b) => b.relevance - a.relevance).slice(0, 5);
    }

    checkPatternCompliance(prData) {
        // Simplified pattern compliance check
        // In real implementation, this would analyze actual code
        
        const hasTests = prData.files_changed.some(f => f.includes('test') || f.includes('spec'));
        const hasDocumentation = prData.files_changed.some(f => f.includes('/docs/'));
        const followsNaming = prData.files_changed.every(f => !f.includes(' ') && f.match(/^[a-zA-Z0-9/._-]+$/));
        
        return hasTests && hasDocumentation && followsNaming;
    }

    async generateExplanation(prData, options) {
        const explanation = {
            pr_number: prData.number,
            title: prData.title,
            summary: this.generateSummary(prData),
            architectural_analysis: this.generateArchitecturalAnalysis(),
            adr_context: this.generateADRContext(),
            pattern_analysis: this.generatePatternAnalysis(),
            recommendations: this.generateRecommendations(),
            impact_assessment: this.generateImpactAssessment(prData),
            generated_at: new Date().toISOString()
        };

        return explanation;
    }

    generateSummary(prData) {
        return {
            overview: `This pull request ${prData.title.toLowerCase()} with ${prData.lines_added} lines added and ${prData.lines_deleted} lines removed across ${prData.files_changed.length} files.`,
            scope: `Changes affect: ${this.changeAnalysis.components_affected.join(', ')}`,
            architectural_impact: this.changeAnalysis.architectural_impact
        };
    }

    generateArchitecturalAnalysis() {
        return {
            components_affected: this.changeAnalysis.components_affected,
            architectural_impact: this.changeAnalysis.architectural_impact,
            compliance_status: this.changeAnalysis.pattern_compliance ? 'compliant' : 'non-compliant'
        };
    }

    generateADRContext() {
        return {
            relevant_adrs: this.changeAnalysis.adr_references,
            recommendations: this.changeAnalysis.adr_references.length > 0 
                ? 'Review relevant ADRs to ensure consistency with architectural decisions'
                : 'Consider creating an ADR if this introduces significant architectural changes'
        };
    }

    generatePatternAnalysis() {
        return {
            pattern_compliance: this.changeAnalysis.pattern_compliance,
            suggestions: this.changeAnalysis.pattern_compliance 
                ? 'Code follows established patterns'
                : 'Review code against established patterns in docs/patterns/'
        };
    }

    generateRecommendations() {
        const recommendations = [];
        
        if (this.changeAnalysis.architectural_impact === 'high') {
            recommendations.push('Consider breaking this into smaller PRs for easier review');
            recommendations.push('Ensure comprehensive testing for high-impact changes');
        }
        
        if (this.changeAnalysis.adr_references.length > 0) {
            recommendations.push('Verify alignment with referenced ADRs');
        }
        
        if (!this.changeAnalysis.pattern_compliance) {
            recommendations.push('Review code against established patterns');
            recommendations.push('Add missing tests or documentation');
        }
        
        return recommendations.length > 0 ? recommendations : ['No specific recommendations - looks good!'];
    }

    generateImpactAssessment(prData) {
        return {
            risk_level: this.changeAnalysis.architectural_impact,
            testing_requirements: this.changeAnalysis.architectural_impact === 'high' ? 'comprehensive' : 'standard',
            deployment_considerations: this.changeAnalysis.components_affected.includes('Backend API') 
                ? 'May require database migrations or API versioning'
                : 'Standard deployment process should suffice'
        };
    }

    displayExplanation(explanation) {
        console.log('');
        console.log(`${COLORS.PURPLE}📝 PR EXPLANATION REPORT${COLORS.RESET}`);
        console.log('='.repeat(40));
        console.log(`${COLORS.BLUE}PR #${explanation.pr_number}: ${explanation.title}${COLORS.RESET}`);
        console.log('');
        
        console.log(`${COLORS.CYAN}📊 Summary${COLORS.RESET}`);
        console.log(`   ${explanation.summary.overview}`);
        console.log(`   ${explanation.summary.scope}`);
        console.log(`   Impact Level: ${this.getImpactEmoji(explanation.summary.architectural_impact)} ${explanation.summary.architectural_impact.toUpperCase()}`);
        console.log('');
        
        if (explanation.adr_context.relevant_adrs.length > 0) {
            console.log(`${COLORS.YELLOW}🏛️ Relevant ADRs${COLORS.RESET}`);
            explanation.adr_context.relevant_adrs.forEach(adr => {
                console.log(`   • ADR-${adr.number}: ${adr.title}`);
            });
            console.log('');
        }
        
        console.log(`${COLORS.GREEN}💡 Recommendations${COLORS.RESET}`);
        explanation.recommendations.forEach(rec => {
            console.log(`   • ${rec}`);
        });
        console.log('');
        
        console.log(`${COLORS.MAGENTA}🎯 Impact Assessment${COLORS.RESET}`);
        console.log(`   Risk Level: ${explanation.impact_assessment.risk_level}`);
        console.log(`   Testing: ${explanation.impact_assessment.testing_requirements}`);
        console.log(`   Deployment: ${explanation.impact_assessment.deployment_considerations}`);
        console.log('');
        
        console.log(`${COLORS.PURPLE}🌌 KRINS PR Analysis Complete!${COLORS.RESET}`);
    }

    getImpactEmoji(impact) {
        switch (impact) {
            case 'low': return '🟢';
            case 'medium': return '🟡';
            case 'high': return '🔴';
            default: return '⚪';
        }
    }

    async saveExplanation(explanation, outputPath) {
        await fs.writeFile(outputPath, JSON.stringify(explanation, null, 2));
        console.log(`${COLORS.GREEN}💾 Explanation saved to: ${outputPath}${COLORS.RESET}`);
    }
}

// Command line interface
async function main() {
    const args = process.argv.slice(2);
    
    if (args.includes('--help')) {
        console.log(`${COLORS.YELLOW}Usage: node explain-pr.js [options] <pr-number>${COLORS.RESET}`);
        console.log('');
        console.log('Options:');
        console.log('  --output <path>    Save explanation to JSON file');
        console.log('  --include-context  Include full ADR and pattern context');
        console.log('  --help            Show this help message');
        console.log('');
        console.log('Examples:');
        console.log('  node explain-pr.js 123');
        console.log('  node explain-pr.js 123 --output pr-123-explanation.json');
        console.log('  node explain-pr.js 123 --include-context');
        return;
    }
    
    const prNumber = args.find(arg => /^\\d+$/.test(arg));
    if (!prNumber) {
        console.error(`${COLORS.RED}❌ Please provide a PR number${COLORS.RESET}`);
        console.log(`${COLORS.CYAN}Usage: node explain-pr.js <pr-number>${COLORS.RESET}`);
        return;
    }
    
    const outputIndex = args.indexOf('--output');
    const outputPath = outputIndex !== -1 ? args[outputIndex + 1] : null;
    
    const options = {
        output: outputPath,
        include_context: args.includes('--include-context')
    };
    
    const explainer = new PRExplainer();
    await explainer.explainPullRequest(parseInt(prNumber), options);
}

main().catch(console.error);