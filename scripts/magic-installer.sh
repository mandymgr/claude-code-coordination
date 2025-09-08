#!/bin/bash
# 🪄 Magic Development System - Universal Installer
# One command installs everything globally and makes it available anywhere

set -e  # Exit on any error

echo "🪄 Installing Magic Development System..."
echo "========================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    print_error "Node.js is required but not installed!"
    echo "Please install Node.js from https://nodejs.org/"
    exit 1
fi

print_info "Node.js version: $(node --version)"

# Get installation directory
MAGIC_DIR="$HOME/.magic-system"
CURRENT_DIR=$(pwd)

print_info "Installing Magic System to: $MAGIC_DIR"

# Create magic directory
mkdir -p "$MAGIC_DIR"

# Copy magic system files
print_info "Copying Magic System files..."
cp -r "$CURRENT_DIR"/* "$MAGIC_DIR/" 2>/dev/null || true

# Install dependencies
print_info "Installing Magic System dependencies..."
cd "$MAGIC_DIR"
npm install --production --silent

# Make scripts executable
chmod +x "$MAGIC_DIR/src/magic-cli.js" 2>/dev/null || true
chmod +x "$MAGIC_DIR/conversation-logger.js" 2>/dev/null || true
chmod +x "$MAGIC_DIR/src/universal-project-detector.js" 2>/dev/null || true

# Create global magic command (user-local installation)
print_info "Creating global 'magic' command..."
mkdir -p "$HOME/.local/bin"
tee "$HOME/.local/bin/magic" > /dev/null << 'EOF'
#!/bin/bash
# 🪄 Magic Development System - Global Command
export MAGIC_SYSTEM_PATH="$HOME/.magic-system"
node "$HOME/.magic-system/src/magic-cli.js" "$@"
EOF
chmod +x "$HOME/.local/bin/magic"

# Create project setup command  
print_info "Creating 'magic-setup' command for projects..."
tee "$HOME/.local/bin/magic-setup" > /dev/null << 'EOF'
#!/bin/bash
# 🪄 Magic Project Setup - One Command Setup
export MAGIC_SYSTEM_PATH="$HOME/.magic-system"

echo "🪄 Setting up Magic Development System for current project..."

# Create project magic integration
mkdir -p .magic-integration

# Generate project-specific magic assistant
PROJECT_NAME=$(basename "$(pwd)")
PROJECT_TYPE="auto-detected"

cat > ".magic-integration/project-magic.js" << MAGIC_EOF
#!/usr/bin/env node
/**
 * 🪄 ${PROJECT_NAME} Magic Assistant
 * Auto-generated project-specific AI assistance
 */

const path = require('path');
const MAGIC_PATH = process.env.MAGIC_SYSTEM_PATH || process.env.HOME + '/.magic-system';

const AdaptiveAIAssistant = require(path.join(MAGIC_PATH, 'src/adaptive-ai-assistant.js'));
const ConversationLogger = require(path.join(MAGIC_PATH, 'conversation-logger.js'));

class ProjectMagicAssistant {
  constructor() {
    this.ai = new AdaptiveAIAssistant();
    this.logger = new ConversationLogger(process.cwd());
    this.projectName = '${PROJECT_NAME}';
    this.projectType = '${PROJECT_TYPE}';
  }

  async ask(question) {
    console.log('🪄 ' + this.projectName + ' Magic Assistant analyzing...');
    
    const contextualQuestion = \`
Project: \${this.projectName}
Type: \${this.projectType}
Directory: \${process.cwd()}

Question: \${question}

Please provide project-specific guidance considering the current codebase and architecture.
    \`;

    try {
      const response = await this.ai.assist(contextualQuestion, {
        projectName: this.projectName,
        projectType: this.projectType,
        projectPath: process.cwd()
      });

      let responseText = '';
      if (response && typeof response === 'object') {
        if (response.suggestions && response.suggestions.length > 0) {
          responseText = response.suggestions[0].explanation || response.suggestions[0].code || JSON.stringify(response.suggestions[0]);
        } else {
          responseText = JSON.stringify(response, null, 2);
        }
      } else {
        responseText = response || 'No response generated';
      }

      this.logger.logInteraction(question, responseText, {
        projectName: this.projectName,
        command: 'project-magic',
        context: 'project-specific-assistance'
      });

      console.log('🧠 Magic Response:');
      console.log(responseText);
      console.log('\\n📝 Logged for session continuity');

      return responseText;
    } catch (error) {
      console.error('❌ Error:', error.message);
      return null;
    }
  }
}

// CLI Interface
if (require.main === module) {
  const assistant = new ProjectMagicAssistant();
  const command = process.argv[2];
  const question = process.argv.slice(3).join(' ');

  if (command === 'ask' || !command) {
    assistant.ask(question || 'How can I improve this project?');
  } else {
    console.log('Usage: node project-magic.js ask "your question"');
  }
}

module.exports = ProjectMagicAssistant;
MAGIC_EOF

chmod +x ".magic-integration/project-magic.js"

# Add to package.json if it exists
if [ -f "package.json" ]; then
    echo "📦 Adding magic scripts to package.json..."
    
    # Create temp file with magic scripts
    node -e "
    const fs = require('fs');
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    pkg.scripts = pkg.scripts || {};
    pkg.scripts['magic:ask'] = 'node .magic-integration/project-magic.js ask';
    pkg.scripts['magic:setup'] = 'magic-setup';
    pkg.scripts['magic:dashboard'] = 'magic dashboard';
    pkg.scripts['magic:logs'] = 'magic logs';
    pkg.scripts['magic:detect'] = 'magic detect';
    
    fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2));
    "
fi

# Create magic aliases
cat > ".magic-integration/magic-aliases.sh" << 'ALIAS_EOF'
#!/bin/bash
# 🪄 Magic Aliases for Current Project

# Short magic commands  
alias mai='node .magic-integration/project-magic.js ask'
alias msetup='magic-setup'
alias mdash='magic dashboard'  
alias mlogs='magic logs'
alias mdetect='magic detect'

echo "🪄 Magic aliases loaded for $(basename $(pwd))!"
echo "Use: mai 'question', msetup, mdash, mlogs, mdetect"
ALIAS_EOF

chmod +x ".magic-integration/magic-aliases.sh"

echo ""
echo "🎉 Magic Setup Complete for $(basename $(pwd))!"
echo ""
echo "🚀 Available commands:"
echo "  npm run magic:ask \"your question\"     # AI assistance"
echo "  npm run magic:dashboard               # Open dashboard"
echo "  npm run magic:logs                    # View logs"
echo "  npm run magic:detect                  # Analyze project"
echo ""
echo "🪄 Or load aliases:"
echo "  source .magic-integration/magic-aliases.sh"
echo "  mai \"your question\"                   # Short AI command"
echo ""
echo "✨ Your project is now magically enhanced!"
EOF
chmod +x "$HOME/.local/bin/magic-setup"

# Create quick activation script
print_info "Creating quick activation script..."
tee "$MAGIC_DIR/activate-magic.sh" > /dev/null << 'EOF'
#!/bin/bash
# 🪄 Magic Quick Activation Script

echo "🪄 Activating Magic Development Environment..."

# Add magic to PATH if not already there
if ! command -v magic &> /dev/null; then
    export PATH="$HOME/.local/bin:$PATH"
fi

# Load project-specific aliases if available
if [ -f ".magic-integration/magic-aliases.sh" ]; then
    source .magic-integration/magic-aliases.sh
else
    echo "💡 Run 'magic-setup' in any project to enable project-specific magic commands"
fi

# Global magic aliases
alias m='magic'
alias mai='magic ai'
alias msetup='magic-setup'
alias mdash='magic dashboard'
alias mlogs='magic logs'

echo "🎉 Magic Development System Activated!"
echo ""
echo "🌟 Global Commands:"
echo "  magic ai \"question\"        # AI assistance anywhere"
echo "  magic dashboard           # Open magic dashboard" 
echo "  magic logs               # View conversation logs"
echo "  magic-setup              # Setup magic for current project"
echo ""
echo "🪄 Short Aliases:"
echo "  m ai \"question\"           # Short magic command"
echo "  mai \"question\"            # Direct AI assistance"
echo "  msetup                   # Quick project setup"
echo "  mdash                    # Quick dashboard"
echo ""
echo "✨ Magic is ready! Use 'magic --help' for full command list."
EOF

chmod +x "$MAGIC_DIR/activate-magic.sh"

# Create desktop shortcut (macOS)
if [[ "$OSTYPE" == "darwin"* ]]; then
    print_info "Creating desktop shortcut..."
    cat > "$HOME/Desktop/Magic Development System.command" << 'EOF'
#!/bin/bash
cd ~ && source "$HOME/.magic-system/activate-magic.sh" && exec bash
EOF
    chmod +x "$HOME/Desktop/Magic Development System.command"
fi

# Update shell profile for automatic loading
print_info "Setting up automatic magic activation..."

SHELL_PROFILE=""
if [ -f "$HOME/.zshrc" ]; then
    SHELL_PROFILE="$HOME/.zshrc"
elif [ -f "$HOME/.bashrc" ]; then
    SHELL_PROFILE="$HOME/.bashrc"  
elif [ -f "$HOME/.bash_profile" ]; then
    SHELL_PROFILE="$HOME/.bash_profile"
fi

if [ ! -z "$SHELL_PROFILE" ]; then
    if ! grep -q "magic-system" "$SHELL_PROFILE"; then
        echo "" >> "$SHELL_PROFILE"
        echo "# 🪄 Magic Development System Auto-activation" >> "$SHELL_PROFILE"
        echo "export PATH=\"\$HOME/.local/bin:\$PATH\"" >> "$SHELL_PROFILE"
        echo "if [ -f \"\$HOME/.magic-system/activate-magic.sh\" ]; then" >> "$SHELL_PROFILE"
        echo "    source \"\$HOME/.magic-system/activate-magic.sh\"" >> "$SHELL_PROFILE"
        echo "fi" >> "$SHELL_PROFILE"
        print_status "Added magic auto-activation to $SHELL_PROFILE"
    fi
fi

echo ""
echo "🎉 MAGIC DEVELOPMENT SYSTEM INSTALLED SUCCESSFULLY! 🎉"
echo "======================================================="
echo ""
print_status "Global magic command available: 'magic'"
print_status "Project setup command: 'magic-setup'"
print_status "Quick activation: 'source ~/.magic-system/activate-magic.sh'"
echo ""
echo "🚀 Getting Started:"
echo "1. Restart your terminal or run: source ~/.magic-system/activate-magic.sh"
echo "2. Go to any project: cd your-project"
echo "3. Setup magic: magic-setup"
echo "4. Start using: magic ai \"how can I improve this project?\""
echo ""
echo "🪄 Magic is now installed and ready to use anywhere!"
echo "✨ Happy magical development!"