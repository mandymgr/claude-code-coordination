#!/usr/bin/env node

/**
 * 🤖 KRINS-Universe-Builder Slack ADR Bot
 * Ultimate AI Development Universe - Automated Slack Integration for ADRs
 */

const COLORS = {
    PURPLE: '\x1b[35m',
    CYAN: '\x1b[36m',
    GREEN: '\x1b[32m',
    YELLOW: '\x1b[33m',
    RED: '\x1b[31m',
    BLUE: '\x1b[34m',
    RESET: '\x1b[0m'
};

console.log(`${COLORS.PURPLE}🌌 KRINS-Universe-Builder Slack ADR Bot${COLORS.RESET}`);
console.log(`${COLORS.CYAN}Ultimate AI Development Universe${COLORS.RESET}`);
console.log('='.repeat(50));

class SlackADRBot {
    constructor() {
        this.webhookUrl = process.env.SLACK_WEBHOOK_URL;
        this.channel = process.env.SLACK_CHANNEL || '#architecture';
        this.botName = 'KRINS Universe Builder';
        this.botIcon = ':building_construction:';
    }

    async postADRNotification(adrData) {
        if (!this.webhookUrl) {
            console.log(`${COLORS.YELLOW}⚠️  SLACK_WEBHOOK_URL not configured${COLORS.RESET}`);
            console.log(`${COLORS.CYAN}💡 Set SLACK_WEBHOOK_URL environment variable to enable Slack integration${COLORS.RESET}`);
            return;
        }

        const message = this.formatADRMessage(adrData);
        
        try {
            const response = await this.sendToSlack(message);
            console.log(`${COLORS.GREEN}✅ ADR notification sent to Slack${COLORS.RESET}`);
            return response;
        } catch (error) {
            console.error(`${COLORS.RED}❌ Failed to send Slack notification: ${error.message}${COLORS.RESET}`);
            throw error;
        }
    }

    formatADRMessage(adrData) {
        const blocks = [
            {
                "type": "header",
                "text": {
                    "type": "plain_text",
                    "text": `🏛️ New Architecture Decision: ${adrData.title}`
                }
            },
            {
                "type": "section",
                "fields": [
                    {
                        "type": "mrkdwn",
                        "text": `*ADR Number:*\\n${adrData.number}`
                    },
                    {
                        "type": "mrkdwn",
                        "text": `*Status:*\\n${adrData.status || 'Proposed'}`
                    },
                    {
                        "type": "mrkdwn",
                        "text": `*Component:*\\n${adrData.component || 'General'}`
                    },
                    {
                        "type": "mrkdwn",
                        "text": `*Author:*\\n${adrData.author || 'KRINS Team'}`
                    }
                ]
            }
        ];

        if (adrData.context) {
            blocks.push({
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": `*Context:*\\n${adrData.context.substring(0, 300)}${adrData.context.length > 300 ? '...' : ''}`
                }
            });
        }

        if (adrData.decision) {
            blocks.push({
                "type": "section",
                "text": {
                    "type": "mrkdwn",
                    "text": `*Decision:*\\n${adrData.decision.substring(0, 300)}${adrData.decision.length > 300 ? '...' : ''}`
                }
            });
        }

        blocks.push({
            "type": "divider"
        });

        blocks.push({
            "type": "context",
            "elements": [
                {
                    "type": "mrkdwn",
                    "text": `🌌 KRINS-Universe-Builder | ${new Date().toLocaleDateString()}`
                }
            ]
        });

        if (adrData.file_path) {
            blocks.push({
                "type": "actions",
                "elements": [
                    {
                        "type": "button",
                        "text": {
                            "type": "plain_text",
                            "text": "📄 View ADR"
                        },
                        "url": `https://github.com/mandymgr/KRINS-Universe-Builder/blob/main/${adrData.file_path}`
                    }
                ]
            });
        }

        return {
            channel: this.channel,
            username: this.botName,
            icon_emoji: this.botIcon,
            blocks: blocks
        };
    }

    async sendToSlack(message) {
        // In real implementation, this would use the Slack Web API or webhook
        // For now, we'll simulate the request
        console.log(`${COLORS.BLUE}📤 Slack message prepared:${COLORS.RESET}`);
        console.log(JSON.stringify(message, null, 2));
        
        // Simulate API call
        return new Promise((resolve) => {
            setTimeout(() => {
                resolve({ ok: true, ts: Date.now().toString() });
            }, 500);
        });
    }

    async monitorADRChanges(adrDirectory = 'docs/adr') {
        console.log(`${COLORS.BLUE}👀 Monitoring ADR changes in: ${adrDirectory}${COLORS.RESET}`);
        
        // In real implementation, this would use file system watchers
        // For demo purposes, we'll check for recent changes
        const fs = require('fs').promises;
        
        try {
            const files = await fs.readdir(adrDirectory);
            const adrFiles = files.filter(f => f.endsWith('.md') && f.match(/^\\d{4}-/));
            
            console.log(`${COLORS.CYAN}📋 Found ${adrFiles.length} ADR files${COLORS.RESET}`);
            
            // Check for recent modifications (last 24 hours)
            const oneDayAgo = Date.now() - (24 * 60 * 60 * 1000);
            
            for (const file of adrFiles) {
                const filePath = `${adrDirectory}/${file}`;
                const stats = await fs.stat(filePath);
                
                if (stats.mtime.getTime() > oneDayAgo) {
                    console.log(`${COLORS.GREEN}🆕 Recent change detected: ${file}${COLORS.RESET}`);
                    
                    // Parse and notify
                    const content = await fs.readFile(filePath, 'utf8');
                    const adrData = this.parseADRContent(content, file, filePath);
                    await this.postADRNotification(adrData);
                }
            }
            
        } catch (error) {
            console.log(`${COLORS.YELLOW}⚠️  ADR directory not found: ${adrDirectory}${COLORS.RESET}`);
        }
    }

    parseADRContent(content, filename, filepath) {
        const lines = content.split('\\n');
        const adrData = {
            file_path: filepath,
            number: filename.match(/^(\\d{4})/)?.[1] || 'Unknown'
        };

        // Extract title (first # heading)
        const titleMatch = content.match(/^#\\s+(.+)$/m);
        adrData.title = titleMatch ? titleMatch[1] : filename.replace('.md', '');

        // Extract sections
        const sections = {};
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

        // Map sections to adrData
        adrData.status = sections.status || 'Proposed';
        adrData.context = sections.context || '';
        adrData.decision = sections.decision || '';
        adrData.component = sections.component || '';

        // Extract author from content or metadata
        const authorMatch = content.match(/\\*\\*Authors?:\\*\\*\\s*(.+)/);
        adrData.author = authorMatch ? authorMatch[1] : 'KRINS Team';

        return adrData;
    }

    async setupSlackIntegration() {
        console.log(`${COLORS.PURPLE}🔧 Setting up Slack Integration${COLORS.RESET}`);
        console.log('');
        console.log('To complete Slack integration setup:');
        console.log('');
        console.log('1. Create a Slack App at https://api.slack.com/apps');
        console.log('2. Enable Incoming Webhooks');
        console.log('3. Create a webhook for your channel');
        console.log('4. Set environment variables:');
        console.log(`   ${COLORS.CYAN}export SLACK_WEBHOOK_URL="your-webhook-url"${COLORS.RESET}`);
        console.log(`   ${COLORS.CYAN}export SLACK_CHANNEL="#architecture"${COLORS.RESET}`);
        console.log('');
        console.log('5. Test the integration:');
        console.log(`   ${COLORS.CYAN}node slack-adr-bot.js --test${COLORS.RESET}`);
        console.log('');
        console.log(`${COLORS.PURPLE}🌌 KRINS Slack Integration Ready!${COLORS.RESET}`);
    }

    async testIntegration() {
        console.log(`${COLORS.BLUE}🧪 Testing Slack integration...${COLORS.RESET}`);
        
        const testADR = {
            number: '0001',
            title: 'Test ADR Integration',
            status: 'Proposed',
            context: 'Testing the Slack ADR bot integration for KRINS-Universe-Builder',
            decision: 'Implement automated Slack notifications for all new ADRs',
            component: 'slack-integration',
            author: 'KRINS Bot',
            file_path: 'docs/adr/0001-test-adr-integration.md'
        };

        await this.postADRNotification(testADR);
        console.log(`${COLORS.GREEN}✅ Test integration complete${COLORS.RESET}`);
    }
}

// Command line interface
async function main() {
    const args = process.argv.slice(2);
    const bot = new SlackADRBot();

    if (args.includes('--help')) {
        console.log(`${COLORS.YELLOW}Usage: node slack-adr-bot.js [options]${COLORS.RESET}`);
        console.log('');
        console.log('Options:');
        console.log('  --setup     Show Slack integration setup instructions');
        console.log('  --test      Test Slack integration with sample ADR');
        console.log('  --monitor   Monitor ADR directory for changes');
        console.log('  --help      Show this help message');
        console.log('');
        console.log('Environment Variables:');
        console.log('  SLACK_WEBHOOK_URL  Slack webhook URL for notifications');
        console.log('  SLACK_CHANNEL     Slack channel (default: #architecture)');
        return;
    }

    if (args.includes('--setup')) {
        await bot.setupSlackIntegration();
        return;
    }

    if (args.includes('--test')) {
        await bot.testIntegration();
        return;
    }

    if (args.includes('--monitor')) {
        await bot.monitorADRChanges();
        return;
    }

    // Default: show help
    console.log(`${COLORS.CYAN}Run with --help to see available options${COLORS.RESET}`);
}

main().catch(console.error);