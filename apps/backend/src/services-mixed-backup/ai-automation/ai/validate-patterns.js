#!/usr/bin/env node

/**
 * ✅ KRINS-Universe-Builder Pattern Validator
 * Ultimate AI Development Universe - Pattern Validation System
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
    RESET: '\x1b[0m'
};

console.log(`${COLORS.PURPLE}🌌 KRINS-Universe-Builder Pattern Validator${COLORS.RESET}`);
console.log(`${COLORS.CYAN}Ultimate AI Development Universe${COLORS.RESET}`);
console.log('='.repeat(50));

class PatternValidator {
    constructor() {
        this.requiredSections = [
            '## 🎯 Purpose',
            '## 🏗️ Structure', 
            '## 💡 Implementation',
            '## 🔄 Usage Scenarios',
            '## ✅ Benefits',
            '## ⚠️ Considerations'
        ];
        this.warnings = [];
        this.errors = [];
    }

    async validatePattern(filepath) {
        try {
            const content = await fs.readFile(filepath, 'utf8');
            const filename = path.basename(filepath);
            
            console.log(`${COLORS.BLUE}🔍 Validating: ${filename}${COLORS.RESET}`);
            
            // Check required sections
            this.checkRequiredSections(content, filename);
            
            // Check code examples
            this.checkCodeExamples(content, filename);
            
            // Check metadata
            this.checkMetadata(content, filename);
            
            // Check tags
            this.checkTags(content, filename);
            
            return {
                valid: this.errors.length === 0,
                warnings: this.warnings.length,
                errors: this.errors.length
            };
            
        } catch (error) {
            this.errors.push(`Failed to read file: ${error.message}`);
            return { valid: false, warnings: 0, errors: 1 };
        }
    }

    checkRequiredSections(content, filename) {
        for (const section of this.requiredSections) {
            if (!content.includes(section)) {
                this.errors.push(`${filename}: Missing required section "${section}"`);
            }
        }
    }

    checkCodeExamples(content, filename) {
        const codeBlockRegex = /```[\s\S]*?```/g;
        const codeBlocks = content.match(codeBlockRegex);
        
        if (!codeBlocks || codeBlocks.length === 0) {
            this.warnings.push(`${filename}: No code examples found`);
        }
    }

    checkMetadata(content, filename) {
        const requiredMetadata = ['**Created:**', '**Category:**', '**Tags:**'];
        
        for (const metadata of requiredMetadata) {
            if (!content.includes(metadata)) {
                this.warnings.push(`${filename}: Missing metadata "${metadata}"`);
            }
        }
    }

    checkTags(content, filename) {
        if (!content.includes('#krins-universe')) {
            this.warnings.push(`${filename}: Missing #krins-universe tag`);
        }
        
        if (!content.includes('#pattern')) {
            this.warnings.push(`${filename}: Missing #pattern tag`);
        }
    }

    printResults() {
        console.log('');
        console.log(`${COLORS.PURPLE}🌌 Validation Results${COLORS.RESET}`);
        console.log('='.repeat(30));
        
        if (this.errors.length > 0) {
            console.log(`${COLORS.RED}❌ Errors (${this.errors.length}):${COLORS.RESET}`);
            this.errors.forEach(error => console.log(`   ${error}`));
        }
        
        if (this.warnings.length > 0) {
            console.log(`${COLORS.YELLOW}⚠️  Warnings (${this.warnings.length}):${COLORS.RESET}`);
            this.warnings.forEach(warning => console.log(`   ${warning}`));
        }
        
        if (this.errors.length === 0 && this.warnings.length === 0) {
            console.log(`${COLORS.GREEN}✅ All patterns are valid!${COLORS.RESET}`);
        }
        
        console.log('');
        console.log(`${COLORS.PURPLE}🎯 KRINS-Universe-Builder Pattern Validation Complete!${COLORS.RESET}`);
    }
}

async function validateAllPatterns() {
    const validator = new PatternValidator();
    const patternsDir = path.join('docs', 'patterns');
    
    try {
        await fs.access(patternsDir);
    } catch {
        console.log(`${COLORS.YELLOW}⚠️  Patterns directory not found: ${patternsDir}${COLORS.RESET}`);
        console.log(`${COLORS.CYAN}💡 Run create-pattern.js to create your first pattern${COLORS.RESET}`);
        return;
    }
    
    const categories = await fs.readdir(patternsDir);
    let totalPatterns = 0;
    
    for (const category of categories) {
        const categoryPath = path.join(patternsDir, category);
        const stat = await fs.lstat(categoryPath);
        
        if (stat.isDirectory()) {
            console.log(`${COLORS.CYAN}📂 Category: ${category}${COLORS.RESET}`);
            
            const patterns = await fs.readdir(categoryPath);
            const mdPatterns = patterns.filter(p => p.endsWith('.md'));
            
            for (const pattern of mdPatterns) {
                const patternPath = path.join(categoryPath, pattern);
                await validator.validatePattern(patternPath);
                totalPatterns++;
            }
        }
    }
    
    console.log('');
    console.log(`${COLORS.BLUE}📊 Validated ${totalPatterns} patterns${COLORS.RESET}`);
    validator.printResults();
}

// Parse command line arguments
const args = process.argv.slice(2);
const specificPattern = args[0];

if (specificPattern) {
    // Validate specific pattern
    const validator = new PatternValidator();
    validator.validatePattern(specificPattern).then(() => {
        validator.printResults();
    });
} else {
    // Validate all patterns
    validateAllPatterns();
}