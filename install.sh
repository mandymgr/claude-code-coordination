#!/bin/bash

# Claude Code Coordination - Universal Installer
# Installs and configures coordination system for any project

set -e

REPO_URL="https://github.com/anthropics/claude-code-coordination"
INSTALL_DIR="$HOME/.claude-coordination"
PROJECT_COORD_DIR=".claude-coordination"

echo "🚀 Installing Claude Code Coordination System"
echo "============================================="

# Check requirements
check_requirements() {
    echo "🔍 Checking system requirements..."
    
    if ! command -v jq &> /dev/null; then
        echo "❌ jq is required but not installed."
        if command -v brew &> /dev/null; then
            echo "📦 Installing jq with Homebrew..."
            brew install jq
        elif command -v apt-get &> /dev/null; then
            echo "📦 Installing jq with apt..."
            sudo apt-get update && sudo apt-get install -y jq
        else
            echo "Please install jq manually: https://stedolan.github.io/jq/"
            exit 1
        fi
    fi
    
    if ! command -v uuidgen &> /dev/null; then
        echo "❌ uuidgen is required but not available"
        exit 1
    fi
    
    echo "✅ All requirements met"
}

# Install globally
install_global() {
    echo "📦 Installing global coordination system..."
    
    # Create global install directory
    mkdir -p "$INSTALL_DIR"
    
    # Download or copy coordination files
    if [ -f "src/hooks.sh" ]; then
        # Local installation (development)
        cp src/hooks.sh "$INSTALL_DIR/"
        cp -r src/* "$INSTALL_DIR/"
    else
        # Remote installation
        echo "📥 Downloading from GitHub..."
        curl -sSL "${REPO_URL}/raw/main/src/hooks.sh" > "$INSTALL_DIR/hooks.sh"
    fi
    
    chmod +x "$INSTALL_DIR/hooks.sh"
    
    # Create global CLI tool
    cat <<'EOF' > "$INSTALL_DIR/claude-coord"
#!/bin/bash
COORDINATION_DIR="$HOME/.claude-coordination"

case "$1" in
    "init")
        echo "🚀 Initializing coordination for current project..."
        mkdir -p .claude-coordination
        cp "$COORDINATION_DIR/hooks.sh" .claude-coordination/
        echo "✅ Project initialized. Run: source .claude-coordination/hooks.sh"
        ;;
    "status")
        source "$COORDINATION_DIR/hooks.sh" && get_project_status
        ;;
    "sessions")
        source "$COORDINATION_DIR/hooks.sh" && list_sessions
        ;;
    "cleanup")
        source "$COORDINATION_DIR/hooks.sh" && cleanup_coordination
        ;;
    "doctor")
        echo "🩺 Claude Code Coordination System Check"
        echo "========================================"
        echo "Global install: $([ -f "$COORDINATION_DIR/hooks.sh" ] && echo "✅" || echo "❌")"
        echo "jq available: $(command -v jq &> /dev/null && echo "✅" || echo "❌")"
        echo "uuidgen available: $(command -v uuidgen &> /dev/null && echo "✅" || echo "❌")"
        if [ -f ".claude-coordination/hooks.sh" ]; then
            echo "Project coordination: ✅"
        else
            echo "Project coordination: ❌ (run: claude-coord init)"
        fi
        ;;
    "--hooks-path")
        echo "$COORDINATION_DIR/hooks.sh"
        ;;
    *)
        echo "Claude Code Coordination System"
        echo "==============================="
        echo ""
        echo "Usage: claude-coord <command>"
        echo ""
        echo "Commands:"
        echo "  init      - Initialize coordination in current project"
        echo "  status    - Show coordination status"
        echo "  sessions  - List active sessions"
        echo "  cleanup   - Clean old coordination data"
        echo "  doctor    - Check system health"
        echo ""
        echo "Activation:"
        echo "  source \$(claude-coord --hooks-path)"
        ;;
esac
EOF
    
    chmod +x "$INSTALL_DIR/claude-coord"
    
    # Add to PATH if not already there
    if [[ ":$PATH:" != *":$INSTALL_DIR:"* ]]; then
        echo "🔗 Adding to PATH..."
        echo "export PATH=\"\$PATH:$INSTALL_DIR\"" >> ~/.bashrc
        echo "export PATH=\"\$PATH:$INSTALL_DIR\"" >> ~/.zshrc 2>/dev/null || true
        export PATH="$PATH:$INSTALL_DIR"
    fi
    
    echo "✅ Global installation complete"
}

# Initialize for current project
init_project() {
    if [ ! -d "$PROJECT_COORD_DIR" ]; then
        echo "🏗 Initializing project coordination..."
        mkdir -p "$PROJECT_COORD_DIR"
        
        # Copy coordination system
        cp "$INSTALL_DIR/hooks.sh" "$PROJECT_COORD_DIR/"
        
        # Create project config
        cat <<EOF > "$PROJECT_COORD_DIR/config.json"
{
  "project_name": "$(basename "$(pwd)")",
  "project_root": "$(pwd)",
  "coordination_enabled": true,
  "session_timeout_hours": 2,
  "message_retention_hours": 24,
  "lock_timeout_minutes": 30,
  "cleanup_interval_minutes": 5,
  "features": {
    "file_locking": true,
    "inter_session_messaging": true,
    "context_sharing": true,
    "task_coordination": true,
    "automatic_cleanup": true
  }
}
EOF
        
        # Add to .gitignore
        if [ -f ".gitignore" ]; then
            if ! grep -q ".claude-coordination/sessions" ".gitignore"; then
                cat <<'EOF' >> .gitignore

# Claude Code Coordination System
.claude-coordination/sessions/
.claude-coordination/logs/
.claude-coordination/broadcasts/
.claude-coordination/locks/
.claude-coordination/global-state.json
EOF
            fi
        fi
        
        echo "✅ Project coordination initialized"
    else
        echo "ℹ️  Project coordination already initialized"
    fi
}

# Main installation flow
main() {
    check_requirements
    install_global
    init_project
    
    echo ""
    echo "🎉 Installation Complete!"
    echo "========================"
    echo ""
    echo "🚀 Quick Start:"
    echo "   source \$(claude-coord --hooks-path)"
    echo "   # or"
    echo "   source .claude-coordination/hooks.sh"
    echo ""
    echo "💡 Available commands:"
    echo "   claude-coord doctor    - Check system health"
    echo "   claude-coord status    - Show coordination status"
    echo "   claude-coord sessions  - List active sessions"
    echo ""
    echo "📖 Documentation: ${REPO_URL}#readme"
    
    # Auto-activate if in interactive shell
    if [[ $- == *i* ]]; then
        echo ""
        echo "🔌 Auto-activating for current session..."
        source "$INSTALL_DIR/hooks.sh"
    fi
}

# Run installation
main "$@"