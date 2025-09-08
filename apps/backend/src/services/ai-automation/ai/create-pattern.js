#!/usr/bin/env node

/**
 * 🧠 KRINS-Universe-Builder Pattern Creator
 * Ultimate AI Development Universe - Pattern Creation System
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

console.log(`${COLORS.PURPLE}🌌 KRINS-Universe-Builder Pattern Creator${COLORS.RESET}`);
console.log(`${COLORS.CYAN}Ultimate AI Development Universe${COLORS.RESET}`);
console.log('='.repeat(50));

async function createPattern(patternName, category = 'general') {
    if (!patternName) {
        console.error(`${COLORS.RED}❌ Pattern name is required${COLORS.RESET}`);
        process.exit(1);
    }

    const patternsDir = path.join('docs', 'patterns');
    const categoryDir = path.join(patternsDir, category);
    
    // Ensure directories exist
    await fs.mkdir(categoryDir, { recursive: true });
    
    const filename = `${patternName.toLowerCase().replace(/\s+/g, '-')}.md`;
    const filepath = path.join(categoryDir, filename);
    
    const patternTemplate = `# 🧠 ${patternName} Pattern

## 🎯 Purpose
<!-- What problem does this pattern solve? -->

## 🏗️ Structure
<!-- How is this pattern organized? -->

## 💡 Implementation
<!-- How to implement this pattern -->

\`\`\`javascript
// Example implementation
class ${patternName.replace(/\s+/g, '')}Pattern {
    constructor() {
        // Pattern initialization
    }
    
    apply() {
        // Pattern application logic
    }
}
\`\`\`

## 🔄 Usage Scenarios
<!-- When should this pattern be used? -->

- Scenario 1: 
- Scenario 2: 
- Scenario 3: 

## ✅ Benefits
<!-- What are the advantages of using this pattern? -->

- Benefit 1
- Benefit 2
- Benefit 3

## ⚠️ Considerations
<!-- What should be considered when using this pattern? -->

- Consideration 1
- Consideration 2

## 🔗 Related Patterns
<!-- Links to related patterns -->

- [Pattern Name](./related-pattern.md)

## 📚 References
<!-- External references and documentation -->

- Reference 1
- Reference 2

---

**Created:** ${new Date().toISOString().split('T')[0]}  
**Category:** ${category}  
**Tags:** #pattern #krins-universe #${category}  
**KRINS-Universe-Builder Pattern Library**
`;

    try {
        await fs.writeFile(filepath, patternTemplate);
        
        console.log(`${COLORS.GREEN}✅ Pattern created successfully!${COLORS.RESET}`);
        console.log(`${COLORS.BLUE}📁 File: ${filepath}${COLORS.RESET}`);
        console.log(`${COLORS.BLUE}📂 Category: ${category}${COLORS.RESET}`);
        console.log('');
        console.log(`${COLORS.CYAN}Next steps:${COLORS.RESET}`);
        console.log('1. Edit the pattern to add implementation details');
        console.log('2. Add code examples and usage scenarios');
        console.log('3. Link to related patterns');
        console.log('4. Update pattern registry');
        console.log('');
        console.log(`${COLORS.PURPLE}🌌 Pattern ready for KRINS-Universe-Builder!${COLORS.RESET}`);
        
    } catch (error) {
        console.error(`${COLORS.RED}❌ Failed to create pattern: ${error.message}${COLORS.RESET}`);
        process.exit(1);
    }
}

// Parse command line arguments
const args = process.argv.slice(2);
const patternName = args[0];
const category = args[1] || 'general';

if (!patternName) {
    console.log(`${COLORS.YELLOW}Usage: node create-pattern.js "Pattern Name" [category]${COLORS.RESET}`);
    console.log('');
    console.log('Available categories:');
    console.log('- architecture');
    console.log('- design');  
    console.log('- integration');
    console.log('- performance');
    console.log('- security');
    console.log('- general');
    process.exit(1);
}

createPattern(patternName, category);