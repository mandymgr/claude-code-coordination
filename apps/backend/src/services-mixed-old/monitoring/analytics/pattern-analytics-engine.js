#!/usr/bin/env node

/**
 * 📊 KRINS-Universe-Builder Pattern Analytics Engine
 * Ultimate AI Development Universe - Pattern Analytics & Intelligence
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

console.log(`${COLORS.PURPLE}🌌 KRINS-Universe-Builder Pattern Analytics Engine${COLORS.RESET}`);
console.log(`${COLORS.CYAN}Ultimate AI Development Universe${COLORS.RESET}`);
console.log('='.repeat(60));

class PatternAnalyticsEngine {
    constructor() {
        this.patterns = new Map();
        this.metrics = {
            usage_frequency: new Map(),
            success_rate: new Map(),
            maintenance_cost: new Map(),
            developer_satisfaction: new Map(),
            performance_impact: new Map()
        };
    }

    async analyzePatterns(directory = 'docs/patterns') {
        console.log(`${COLORS.BLUE}🔍 Analyzing patterns in: ${directory}${COLORS.RESET}`);
        
        try {
            await this.scanPatternDirectory(directory);
            await this.calculateMetrics();
            this.generateReport();
            
        } catch (error) {
            console.error(`${COLORS.RED}❌ Analysis failed: ${error.message}${COLORS.RESET}`);
        }
    }

    async scanPatternDirectory(directory) {
        try {
            const categories = await fs.readdir(directory);
            
            for (const category of categories) {
                const categoryPath = path.join(directory, category);
                const stat = await fs.lstat(categoryPath);
                
                if (stat.isDirectory()) {
                    console.log(`${COLORS.CYAN}📂 Scanning category: ${category}${COLORS.RESET}`);
                    await this.scanCategoryPatterns(categoryPath, category);
                }
            }
        } catch (error) {
            console.log(`${COLORS.YELLOW}⚠️  Pattern directory not found: ${directory}${COLORS.RESET}`);
            console.log(`${COLORS.CYAN}💡 Run create-pattern.js to create patterns first${COLORS.RESET}`);
        }
    }

    async scanCategoryPatterns(categoryPath, category) {
        const patterns = await fs.readdir(categoryPath);
        const mdPatterns = patterns.filter(p => p.endsWith('.md'));
        
        for (const pattern of mdPatterns) {
            const patternPath = path.join(categoryPath, pattern);
            await this.analyzePattern(patternPath, category, pattern);
        }
    }

    async analyzePattern(patternPath, category, filename) {
        const content = await fs.readFile(patternPath, 'utf8');
        const patternName = filename.replace('.md', '');
        
        console.log(`  ${COLORS.BLUE}📄 Analyzing: ${patternName}${COLORS.RESET}`);
        
        const analysis = {
            name: patternName,
            category: category,
            file_path: patternPath,
            size: content.length,
            sections: this.extractSections(content),
            complexity: this.calculateComplexity(content),
            usage_indicators: this.findUsageIndicators(content),
            last_updated: await this.getLastModified(patternPath),
            quality_score: 0
        };
        
        analysis.quality_score = this.calculateQualityScore(analysis);
        this.patterns.set(patternName, analysis);
    }

    extractSections(content) {
        const sections = [];
        const sectionRegex = /^##\s+(.+)$/gm;
        let match;
        
        while ((match = sectionRegex.exec(content)) !== null) {
            sections.push(match[1].trim());
        }
        
        return sections;
    }

    calculateComplexity(content) {
        let complexity = 1;
        
        // Code blocks increase complexity
        const codeBlocks = (content.match(/```[\s\S]*?```/g) || []).length;
        complexity += codeBlocks * 2;
        
        // External links increase complexity
        const links = (content.match(/\[.*?\]\(https?:\/\/.*?\)/g) || []).length;
        complexity += links;
        
        // Length-based complexity
        if (content.length > 2000) complexity += 2;
        if (content.length > 5000) complexity += 3;
        
        return Math.min(complexity, 10); // Cap at 10
    }

    findUsageIndicators(content) {
        const indicators = {
            has_examples: /```[\s\S]*?```/.test(content),
            has_benefits: /benefits|advantages|pros/i.test(content),
            has_drawbacks: /drawbacks|disadvantages|cons|considerations/i.test(content),
            has_alternatives: /alternatives|related|similar/i.test(content),
            has_references: /references|links|see also/i.test(content)
        };
        
        return indicators;
    }

    async getLastModified(filePath) {
        try {
            const stats = await fs.stat(filePath);
            return stats.mtime;
        } catch {
            return new Date();
        }
    }

    calculateQualityScore(analysis) {
        let score = 0;
        const indicators = analysis.usage_indicators;
        
        // Base score for existence
        score += 2;
        
        // Section completeness (max 3 points)
        const requiredSections = ['Purpose', 'Implementation', 'Usage', 'Benefits'];
        const hasRequiredSections = requiredSections.filter(section => 
            analysis.sections.some(s => s.includes(section))
        ).length;
        score += (hasRequiredSections / requiredSections.length) * 3;
        
        // Content quality indicators (max 3 points)
        if (indicators.has_examples) score += 1;
        if (indicators.has_benefits) score += 0.5;
        if (indicators.has_drawbacks) score += 0.5;
        if (indicators.has_alternatives) score += 0.5;
        if (indicators.has_references) score += 0.5;
        
        // Content length (max 2 points)
        if (analysis.size > 500) score += 1;
        if (analysis.size > 1500) score += 1;
        
        return Math.min(score, 10).toFixed(1);
    }

    calculateMetrics() {
        console.log(`${COLORS.BLUE}📊 Calculating analytics metrics...${COLORS.RESET}`);
        
        for (const [name, pattern] of this.patterns) {
            // Simulate usage metrics (in real implementation, this would come from actual usage data)
            this.metrics.usage_frequency.set(name, Math.random() * 100);
            this.metrics.success_rate.set(name, 70 + Math.random() * 30); // 70-100%
            this.metrics.maintenance_cost.set(name, pattern.complexity * (1 + Math.random()));
            this.metrics.developer_satisfaction.set(name, parseFloat(pattern.quality_score) * (8 + Math.random() * 2));
            this.metrics.performance_impact.set(name, Math.random() * 10);
        }
    }

    generateReport() {
        console.log('');
        console.log(`${COLORS.PURPLE}📊 PATTERN ANALYTICS REPORT${COLORS.RESET}`);
        console.log('='.repeat(40));
        
        // Summary statistics
        const totalPatterns = this.patterns.size;
        const avgQuality = Array.from(this.patterns.values())
            .reduce((sum, p) => sum + parseFloat(p.quality_score), 0) / totalPatterns;
        
        console.log(`${COLORS.CYAN}📈 Summary Statistics${COLORS.RESET}`);
        console.log(`   Total Patterns: ${totalPatterns}`);
        console.log(`   Average Quality Score: ${avgQuality.toFixed(1)}/10`);
        console.log('');
        
        // Top performing patterns
        console.log(`${COLORS.GREEN}🏆 Top Performing Patterns${COLORS.RESET}`);
        const sortedByQuality = Array.from(this.patterns.entries())
            .sort((a, b) => parseFloat(b[1].quality_score) - parseFloat(a[1].quality_score))
            .slice(0, 5);
        
        sortedByQuality.forEach(([name, pattern], index) => {
            console.log(`   ${index + 1}. ${name} (${pattern.quality_score}/10) - ${pattern.category}`);
        });
        
        console.log('');
        
        // Category breakdown
        const categories = new Map();
        for (const pattern of this.patterns.values()) {
            categories.set(pattern.category, (categories.get(pattern.category) || 0) + 1);
        }
        
        console.log(`${COLORS.YELLOW}📂 Category Breakdown${COLORS.RESET}`);
        for (const [category, count] of categories) {
            console.log(`   ${category}: ${count} patterns`);
        }
        
        console.log('');
        
        // Recommendations
        console.log(`${COLORS.MAGENTA}💡 Recommendations${COLORS.RESET}`);
        
        const lowQualityPatterns = Array.from(this.patterns.values())
            .filter(p => parseFloat(p.quality_score) < 6);
        
        if (lowQualityPatterns.length > 0) {
            console.log(`   🔧 ${lowQualityPatterns.length} patterns need quality improvements`);
            lowQualityPatterns.forEach(p => {
                console.log(`      - ${p.name}: Add examples, benefits, and usage scenarios`);
            });
        }
        
        const oldPatterns = Array.from(this.patterns.values())
            .filter(p => {
                const daysSinceUpdate = (Date.now() - p.last_updated.getTime()) / (1000 * 60 * 60 * 24);
                return daysSinceUpdate > 90;
            });
        
        if (oldPatterns.length > 0) {
            console.log(`   📅 ${oldPatterns.length} patterns haven't been updated in 90+ days`);
        }
        
        console.log('');
        console.log(`${COLORS.PURPLE}🌌 KRINS Pattern Analytics Complete!${COLORS.RESET}`);
        console.log(`${COLORS.BLUE}💾 Consider implementing pattern usage tracking for more accurate metrics${COLORS.RESET}`);
    }

    async generateJSONReport(outputPath = 'pattern-analytics-report.json') {
        const report = {
            timestamp: new Date().toISOString(),
            summary: {
                total_patterns: this.patterns.size,
                average_quality: Array.from(this.patterns.values())
                    .reduce((sum, p) => sum + parseFloat(p.quality_score), 0) / this.patterns.size
            },
            patterns: Object.fromEntries(this.patterns),
            metrics: {
                usage_frequency: Object.fromEntries(this.metrics.usage_frequency),
                success_rate: Object.fromEntries(this.metrics.success_rate),
                maintenance_cost: Object.fromEntries(this.metrics.maintenance_cost),
                developer_satisfaction: Object.fromEntries(this.metrics.developer_satisfaction),
                performance_impact: Object.fromEntries(this.metrics.performance_impact)
            }
        };
        
        await fs.writeFile(outputPath, JSON.stringify(report, null, 2));
        console.log(`${COLORS.GREEN}💾 JSON report saved to: ${outputPath}${COLORS.RESET}`);
    }
}

// Command line interface
async function main() {
    const args = process.argv.slice(2);
    const engine = new PatternAnalyticsEngine();
    
    if (args.includes('--help')) {
        console.log(`${COLORS.YELLOW}Usage: node pattern-analytics-engine.js [options]${COLORS.RESET}`);
        console.log('');
        console.log('Options:');
        console.log('  --directory <path>  Pattern directory to analyze (default: docs/patterns)');
        console.log('  --json <path>      Generate JSON report at specified path');
        console.log('  --help             Show this help message');
        console.log('');
        console.log('Examples:');
        console.log('  node pattern-analytics-engine.js');
        console.log('  node pattern-analytics-engine.js --directory custom/patterns');
        console.log('  node pattern-analytics-engine.js --json reports/patterns.json');
        return;
    }
    
    const directoryIndex = args.indexOf('--directory');
    const directory = directoryIndex !== -1 ? args[directoryIndex + 1] : 'docs/patterns';
    
    const jsonIndex = args.indexOf('--json');
    const jsonPath = jsonIndex !== -1 ? args[jsonIndex + 1] : null;
    
    await engine.analyzePatterns(directory);
    
    if (jsonPath) {
        await engine.generateJSONReport(jsonPath);
    }
}

main().catch(console.error);