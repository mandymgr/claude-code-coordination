#!/bin/bash

# Claude Code Coordination - CLI Tool
# Command-line interface for coordination system management

COORDINATION_DIR="$HOME/.claude-coordination"
PROJECT_COORD_DIR=".claude-coordination"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
PURPLE='\033[0;35m'
NC='\033[0m' # No Color

# Helper functions
print_header() {
    echo -e "${BLUE}Claude Code Coordination System${NC}"
    echo -e "${BLUE}===============================${NC}"
    echo ""
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

# Command implementations
cmd_init() {
    echo "🚀 Initializing coordination for current project..."
    
    if [ -d "$PROJECT_COORD_DIR" ]; then
        print_warning "Coordination already initialized in this project"
        return 0
    fi
    
    # Create project coordination directory
    mkdir -p "$PROJECT_COORD_DIR"
    
    # Copy hooks if global installation exists
    if [ -f "$COORDINATION_DIR/hooks.sh" ]; then
        cp "$COORDINATION_DIR/hooks.sh" "$PROJECT_COORD_DIR/"
    else
        print_error "Global coordination not installed. Run the installer first."
        return 1
    fi
    
    # Create project configuration
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
    
    # Update .gitignore
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
    
    print_success "Project coordination initialized"
    print_info "Activate with: source .claude-coordination/hooks.sh"
}

cmd_status() {
    if [ -f "$PROJECT_COORD_DIR/hooks.sh" ]; then
        source "$PROJECT_COORD_DIR/hooks.sh"
        get_project_status
    elif [ -f "$COORDINATION_DIR/hooks.sh" ]; then
        source "$COORDINATION_DIR/hooks.sh"
        get_project_status
    else
        print_error "No coordination system found"
        return 1
    fi
}

cmd_sessions() {
    if [ -f "$PROJECT_COORD_DIR/hooks.sh" ]; then
        source "$PROJECT_COORD_DIR/hooks.sh"
        list_sessions
    elif [ -f "$COORDINATION_DIR/hooks.sh" ]; then
        source "$COORDINATION_DIR/hooks.sh"
        list_sessions
    else
        print_error "No coordination system found"
        return 1
    fi
}

cmd_cleanup() {
    if [ -f "$PROJECT_COORD_DIR/hooks.sh" ]; then
        source "$PROJECT_COORD_DIR/hooks.sh"
        cleanup_coordination
    elif [ -f "$COORDINATION_DIR/hooks.sh" ]; then
        source "$COORDINATION_DIR/hooks.sh"
        cleanup_coordination
    else
        print_error "No coordination system found"
        return 1
    fi
}

cmd_doctor() {
    print_header
    echo "🩺 System Health Check"
    echo "====================="
    echo ""
    
    # Check global installation
    if [ -f "$COORDINATION_DIR/hooks.sh" ]; then
        print_success "Global coordination installed"
    else
        print_error "Global coordination not found"
        print_info "Install with: curl -sSL https://raw.githubusercontent.com/anthropics/claude-code-coordination/main/install.sh | bash"
    fi
    
    # Check project installation
    if [ -f "$PROJECT_COORD_DIR/hooks.sh" ]; then
        print_success "Project coordination configured"
    else
        print_warning "Project coordination not initialized"
        print_info "Initialize with: claude-coord init"
    fi
    
    # Check dependencies
    if command -v jq &> /dev/null; then
        print_success "jq available ($(jq --version))"
    else
        print_error "jq not found (required for JSON processing)"
    fi
    
    if command -v uuidgen &> /dev/null; then
        print_success "uuidgen available"
    else
        print_error "uuidgen not found (required for session IDs)"
    fi
    
    # Check active sessions
    if [ -d "$PROJECT_COORD_DIR/sessions" ]; then
        local session_count=$(ls -1 "$PROJECT_COORD_DIR/sessions"/*.json 2>/dev/null | wc -l)
        if [ "$session_count" -gt 0 ]; then
            print_success "$session_count active session(s)"
        else
            print_info "No active sessions"
        fi
    fi
    
    # Check file locks
    if [ -d "$PROJECT_COORD_DIR/locks" ]; then
        local lock_count=$(ls -1 "$PROJECT_COORD_DIR/locks"/*.lock 2>/dev/null | wc -l)
        if [ "$lock_count" -gt 0 ]; then
            print_warning "$lock_count active file lock(s)"
        else
            print_success "No active file locks"
        fi
    fi
    
    echo ""
    print_info "For more details, run: claude-coord status"
}

cmd_broadcast() {
    local message="$*"
    if [ -z "$message" ]; then
        echo "Usage: claude-coord broadcast <message>"
        return 1
    fi
    
    if [ -f "$PROJECT_COORD_DIR/hooks.sh" ]; then
        source "$PROJECT_COORD_DIR/hooks.sh"
        broadcast_message "$message" "high"
    else
        print_error "No coordination system found"
        return 1
    fi
}

cmd_locks() {
    print_header
    echo "🔒 Active File Locks"
    echo "==================="
    echo ""
    
    if [ -d "$PROJECT_COORD_DIR/locks" ]; then
        local lock_files=("$PROJECT_COORD_DIR/locks"/*.lock)
        if [ -f "${lock_files[0]}" ]; then
            for lock_file in "${lock_files[@]}"; do
                if [ -f "$lock_file" ]; then
                    local session_id=$(jq -r '.session_id' "$lock_file")
                    local file_path=$(jq -r '.file_path' "$lock_file")
                    local timestamp=$(jq -r '.timestamp' "$lock_file")
                    local operation=$(jq -r '.operation' "$lock_file")
                    
                    echo "📁 $(basename "$file_path")"
                    echo "   Session: $session_id"
                    echo "   Operation: $operation"
                    echo "   Locked at: $timestamp"
                    echo ""
                fi
            done
        else
            print_success "No active file locks"
        fi
    else
        print_info "Lock directory not found"
    fi
}

cmd_unlock() {
    local target="$1"
    
    if [ "$target" = "--all" ]; then
        print_info "Unlocking all files..."
        rm -f "$PROJECT_COORD_DIR/locks"/*.lock 2>/dev/null
        print_success "All files unlocked"
    elif [ -n "$target" ]; then
        local lock_file="$PROJECT_COORD_DIR/locks/$(echo "$target" | sed 's|/|_|g').lock"
        if [ -f "$lock_file" ]; then
            rm "$lock_file"
            print_success "Unlocked: $target"
        else
            print_warning "File not locked: $target"
        fi
    else
        echo "Usage: claude-coord unlock <file_path> | --all"
        return 1
    fi
}

cmd_reset() {
    print_warning "This will reset the coordination system and remove all session data"
    read -p "Are you sure? [y/N] " -n 1 -r
    echo ""
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        rm -rf "$PROJECT_COORD_DIR/sessions" "$PROJECT_COORD_DIR/broadcasts" "$PROJECT_COORD_DIR/locks" "$PROJECT_COORD_DIR/global-state.json" 2>/dev/null
        print_success "Coordination system reset"
    else
        print_info "Reset cancelled"
    fi
}

# Main command dispatcher
main() {
    case "$1" in
        "init")
            cmd_init
            ;;
        "status")
            cmd_status
            ;;
        "sessions")
            cmd_sessions
            ;;
        "cleanup")
            cmd_cleanup
            ;;
        "doctor")
            cmd_doctor
            ;;
        "broadcast")
            shift
            cmd_broadcast "$@"
            ;;
        "locks")
            cmd_locks
            ;;
        "unlock")
            cmd_unlock "$2"
            ;;
        "reset")
            cmd_reset
            ;;
        "--hooks-path")
            if [ -f "$PROJECT_COORD_DIR/hooks.sh" ]; then
                echo "$PROJECT_COORD_DIR/hooks.sh"
            elif [ -f "$COORDINATION_DIR/hooks.sh" ]; then
                echo "$COORDINATION_DIR/hooks.sh"
            else
                print_error "No coordination hooks found"
                exit 1
            fi
            ;;
        "--version"|"-v")
            echo "claude-code-coordination v1.0.0"
            ;;
        "--help"|"-h"|"")
            print_header
            echo "Usage: claude-coord <command>"
            echo ""
            echo "Commands:"
            echo "  init              Initialize coordination in current project"
            echo "  status            Show coordination status"
            echo "  sessions          List active Claude sessions"
            echo "  cleanup           Clean old coordination data"
            echo "  doctor            Check system health"
            echo "  broadcast <msg>   Send message to all sessions"
            echo "  locks             Show active file locks"
            echo "  unlock <file>     Unlock specific file or --all"
            echo "  reset             Reset coordination system"
            echo ""
            echo "Options:"
            echo "  --hooks-path      Show path to coordination hooks"
            echo "  --version, -v     Show version"
            echo "  --help, -h        Show this help"
            echo ""
            echo "Quick Start:"
            echo "  claude-coord init"
            echo "  source \$(claude-coord --hooks-path)"
            echo ""
            echo "Documentation: https://github.com/anthropics/claude-code-coordination"
            ;;
        *)
            print_error "Unknown command: $1"
            echo "Run 'claude-coord --help' for usage information"
            exit 1
            ;;
    esac
}

# Run the main function with all arguments
main "$@"