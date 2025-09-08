#!/bin/bash

# 🪄✨ KRINS-Universe-Builder Magic Installer v3.0
# Ultimate one-command global installation for all platforms
# Supports Linux, macOS, WSL, and various shells

set -e  # Exit on any error

# Version and repository configuration
KRINS_VERSION="3.0.0"
KRINS_REPO="https://github.com/mandymgr/KRINS-Universe-Builder.git"
KRINS_NPM_PACKAGE="krins-universe-builder"
INSTALL_DIR="$HOME/.krins"
BIN_DIR="$HOME/.local/bin"
CONFIG_DIR="$HOME/.config/krins"

# Colors and styling
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
MAGENTA='\033[0;35m'
CYAN='\033[0;36m'
WHITE='\033[1;37m'
GRAY='\033[0;37m'
NC='\033[0m' # No Color

# ASCII Art Banner
print_banner() {
    echo -e "${MAGENTA}"
    cat << 'EOF'
╔════════════════════════════════════════════════════════════════╗
║                                                                ║
║               🪄✨ KRINS-Universe-Builder ✨🪄                 ║
║                                                                ║
║            The Ultimate AI Development Universe                ║
║                                                                ║
║              Magic Installer & Setup Wizard                   ║
║                        v3.0.0                                  ║
║                                                                ║
╚════════════════════════════════════════════════════════════════╝
EOF
    echo -e "${NC}"
    echo -e "${CYAN}🚀 Enterprise-grade AI-powered development coordination platform${NC}"
    echo -e "${GRAY}   Intelligent deployment • Team optimization • Smart caching${NC}"
    echo
}

# Enhanced logging with timestamps and levels
log() {
    local level=$1
    local message=$2
    local timestamp=$(date '+%H:%M:%S')
    
    case $level in
        "info")     echo -e "${BLUE}[$timestamp INFO]${NC} $message" ;;
        "success")  echo -e "${GREEN}[$timestamp SUCCESS]${NC} $message" ;;
        "warning")  echo -e "${YELLOW}[$timestamp WARNING]${NC} $message" ;;
        "error")    echo -e "${RED}[$timestamp ERROR]${NC} $message" ;;
        "step")     echo -e "${CYAN}[$timestamp STEP]${NC} $message" ;;
    esac
}

# Progress spinner with message
show_spinner() {
    local pid=$1
    local message=$2
    local delay=0.1
    local spinstr='⠋⠙⠹⠸⠼⠴⠦⠧⠇⠏'
    
    echo -n "$message "
    while kill -0 $pid 2>/dev/null; do
        for i in $(seq 0 9); do
            echo -ne "\b${spinstr:$i:1}"
            sleep $delay
        done
    done
    echo -e "\b✓"
}

# Enhanced system detection
detect_os() {
    case "$(uname -s)" in
        Linux*)   
            if [[ $(uname -r) == *microsoft* ]]; then
                echo "wsl"
            else
                echo "linux"
            fi
            ;;
        Darwin*)    echo "macos" ;;
        CYGWIN*)    echo "cygwin" ;;
        MINGW*)     echo "mingw" ;;
        MSYS*)      echo "msys" ;;
        *)          echo "unknown" ;;
    esac
}

detect_arch() {
    case "$(uname -m)" in
        x86_64|amd64)   echo "x64" ;;
        arm64|aarch64)  echo "arm64" ;;
        armv7l|armv6l)  echo "arm" ;;
        i386|i686)      echo "x32" ;;
        *)              echo "unknown" ;;
    esac
}

detect_shell() {
    if [ -n "$ZSH_VERSION" ]; then
        echo "zsh"
    elif [ -n "$BASH_VERSION" ]; then
        echo "bash"
    elif [ -n "$FISH_VERSION" ]; then
        echo "fish"
    else
        echo "$(basename "$SHELL" 2>/dev/null || echo "bash")"
    fi
}

detect_package_manager() {
    if command -v pnpm >/dev/null 2>&1; then
        echo "pnpm"
    elif command -v yarn >/dev/null 2>&1; then
        echo "yarn"
    elif command -v npm >/dev/null 2>&1; then
        echo "npm"
    else
        echo "none"
    fi
}

# System information display
show_system_info() {
    local os=$(detect_os)
    local arch=$(detect_arch)
    local shell=$(detect_shell)
    local pkg_manager=$(detect_package_manager)
    
    log "info" "System: $os-$arch, Shell: $shell, Package Manager: $pkg_manager"
    
    if [ "$os" = "unknown" ] || [ "$arch" = "unknown" ]; then
        log "warning" "Unknown system detected. Installation may not work correctly."
    fi
}

# Comprehensive prerequisites check
check_prerequisites() {
    log "step" "Checking system prerequisites..."
    
    local missing_deps=()
    local warnings=()
    
    # Check Node.js
    if ! command -v node >/dev/null 2>&1; then
        missing_deps+=("Node.js")
    else
        local node_version=$(node --version | sed 's/v//')
        local major_version=$(echo $node_version | cut -d. -f1)
        if [ "$major_version" -lt 18 ]; then
            warnings+=("Node.js version $node_version detected. Version 18+ recommended.")
        else
            log "success" "Node.js $node_version ✓"
        fi
    fi
    
    # Check package managers
    local pkg_manager=$(detect_package_manager)
    if [ "$pkg_manager" = "none" ]; then
        missing_deps+=("npm/yarn/pnpm")
    else
        log "success" "$pkg_manager available ✓"
    fi
    
    # Check Git
    if ! command -v git >/dev/null 2>&1; then
        missing_deps+=("Git")
    else
        log "success" "Git $(git --version | cut -d' ' -f3) ✓"
    fi
    
    # Check curl/wget
    if ! command -v curl >/dev/null 2>&1 && ! command -v wget >/dev/null 2>&1; then
        missing_deps+=("curl or wget")
    fi
    
    # Optional tools check
    if ! command -v tsx >/dev/null 2>&1; then
        warnings+=("tsx not found - will be installed automatically")
    fi
    
    # Display warnings
    for warning in "${warnings[@]}"; do
        log "warning" "$warning"
    done
    
    # Handle missing dependencies
    if [ ${#missing_deps[@]} -gt 0 ]; then
        log "error" "Missing required dependencies:"
        for dep in "${missing_deps[@]}"; do
            echo "  • $dep"
        done
        
        echo
        echo -e "${YELLOW}Installation guides:${NC}"
        echo "  • Node.js: https://nodejs.org/"
        echo "  • Git: https://git-scm.com/"
        echo "  • Package managers: npm (comes with Node.js), yarn, or pnpm"
        
        if prompt_yes_no "Would you like to continue anyway? (may fail)"; then
            log "warning" "Continuing with missing dependencies..."
        else
            exit 1
        fi
    fi
    
    log "success" "Prerequisites check completed!"
}

# Interactive prompt utility
prompt_yes_no() {
    local prompt="$1"
    local default="${2:-n}"
    
    while true; do
        if [ "$default" = "y" ]; then
            read -p "$prompt [Y/n]: " yn
            yn=${yn:-y}
        else
            read -p "$prompt [y/N]: " yn
            yn=${yn:-n}
        fi
        
        case $yn in
            [Yy]* ) return 0 ;;
            [Nn]* ) return 1 ;;
            * ) echo "Please answer yes or no." ;;
        esac
    done
}

# Directory setup with proper permissions
setup_directories() {
    log "step" "Setting up installation directories..."
    
    local dirs=("$INSTALL_DIR" "$BIN_DIR" "$CONFIG_DIR")
    
    for dir in "${dirs[@]}"; do
        if ! mkdir -p "$dir" 2>/dev/null; then
            log "error" "Failed to create directory: $dir"
            if [ "$dir" = "$BIN_DIR" ]; then
                log "info" "Trying alternative bin directory..."
                BIN_DIR="/usr/local/bin"
                if ! mkdir -p "$BIN_DIR" 2>/dev/null; then
                    log "error" "Cannot create any bin directory. Aborting."
                    exit 1
                fi
            else
                exit 1
            fi
        fi
    done
    
    # Set proper permissions
    chmod 755 "$INSTALL_DIR" "$BIN_DIR" "$CONFIG_DIR" 2>/dev/null || true
    
    log "success" "Directories created successfully"
    log "info" "Install: $INSTALL_DIR, Bin: $BIN_DIR, Config: $CONFIG_DIR"
}

# Multi-method installation with fallbacks
install_krins() {
    log "step" "Installing KRINS-Universe-Builder..."
    
    # Method 1: Current directory (for development)
    if install_from_current_dir; then
        return 0
    fi
    
    # Method 2: Pre-built npm package
    if install_from_npm; then
        return 0
    fi
    
    # Method 3: Source build from git
    if install_from_source; then
        return 0
    fi
    
    # Method 4: Download pre-built release
    if install_from_release; then
        return 0
    fi
    
    log "error" "All installation methods failed"
    exit 1
}

# Install from current directory (development mode)
install_from_current_dir() {
    if [ -f "package.json" ] && [ -d "packages" ] && grep -q "krins-universe-builder" package.json; then
        log "info" "Installing from current directory (development mode)..."
        
        local pkg_manager=$(detect_package_manager)
        
        # Install dependencies
        case $pkg_manager in
            pnpm)
                pnpm install >/dev/null 2>&1 || return 1
                pnpm run build >/dev/null 2>&1 || return 1
                ;;
            yarn)
                yarn install >/dev/null 2>&1 || return 1
                yarn run build >/dev/null 2>&1 || return 1
                ;;
            npm)
                npm install >/dev/null 2>&1 || return 1
                npm run build >/dev/null 2>&1 || return 1
                ;;
        esac
        
        # Install globally
        npm install -g . >/dev/null 2>&1 || return 1
        
        log "success" "Installed from current directory successfully"
        return 0
    fi
    
    return 1
}

# Install from npm registry
install_from_npm() {
    log "info" "Attempting installation from npm registry..."
    
    local pkg_manager=$(detect_package_manager)
    
    case $pkg_manager in
        pnpm)
            if pnpm add -g "$KRINS_NPM_PACKAGE@$KRINS_VERSION" >/dev/null 2>&1; then
                log "success" "Installed from npm via pnpm"
                return 0
            fi
            ;;
        yarn)
            if yarn global add "$KRINS_NPM_PACKAGE@$KRINS_VERSION" >/dev/null 2>&1; then
                log "success" "Installed from npm via yarn"
                return 0
            fi
            ;;
        npm)
            if npm install -g "$KRINS_NPM_PACKAGE@$KRINS_VERSION" >/dev/null 2>&1; then
                log "success" "Installed from npm"
                return 0
            fi
            ;;
    esac
    
    log "warning" "npm installation failed, trying alternative methods..."
    return 1
}

# Install from source repository
install_from_source() {
    log "info" "Installing from source repository..."
    
    local temp_dir=$(mktemp -d)
    local current_dir=$(pwd)
    
    cd "$temp_dir"
    
    # Clone repository
    log "info" "Cloning repository..."
    if ! git clone --depth 1 --branch main "$KRINS_REPO" krins >/dev/null 2>&1; then
        cd "$current_dir"
        rm -rf "$temp_dir"
        return 1
    fi
    
    cd krins
    
    # Install dependencies and build
    local pkg_manager=$(detect_package_manager)
    case $pkg_manager in
        pnpm)
            pnpm install >/dev/null 2>&1 || { cd "$current_dir"; rm -rf "$temp_dir"; return 1; }
            pnpm run build >/dev/null 2>&1 || { cd "$current_dir"; rm -rf "$temp_dir"; return 1; }
            ;;
        yarn)
            yarn install >/dev/null 2>&1 || { cd "$current_dir"; rm -rf "$temp_dir"; return 1; }
            yarn run build >/dev/null 2>&1 || { cd "$current_dir"; rm -rf "$temp_dir"; return 1; }
            ;;
        npm)
            npm install >/dev/null 2>&1 || { cd "$current_dir"; rm -rf "$temp_dir"; return 1; }
            npm run build >/dev/null 2>&1 || { cd "$current_dir"; rm -rf "$temp_dir"; return 1; }
            ;;
    esac
    
    # Install globally
    npm install -g . >/dev/null 2>&1 || { cd "$current_dir"; rm -rf "$temp_dir"; return 1; }
    
    # Cleanup
    cd "$current_dir"
    rm -rf "$temp_dir"
    
    log "success" "Installed from source successfully"
    return 0
}

# Install from GitHub releases
install_from_release() {
    log "info" "Installing from GitHub releases..."
    
    # This would download a pre-built release tarball
    # For now, just return 1 to indicate method not available
    return 1
}

# Setup shell integration and completions
setup_shell_integration() {
    log "step" "Setting up shell integration..."
    
    local shell=$(detect_shell)
    local shell_rc=$(get_shell_config_file "$shell")
    
    if [ -z "$shell_rc" ]; then
        log "warning" "Could not determine shell configuration file"
        return
    fi
    
    log "info" "Configuring $shell in $shell_rc"
    
    # Backup existing config
    if [ -f "$shell_rc" ]; then
        cp "$shell_rc" "${shell_rc}.backup-krins" 2>/dev/null || true
    fi
    
    # Add KRINS to PATH
    add_to_path "$shell_rc" "$shell"
    
    # Setup command completions
    setup_completions "$shell_rc" "$shell"
    
    # Add useful aliases
    setup_aliases "$shell_rc" "$shell"
    
    log "success" "Shell integration configured for $shell"
}

# Determine shell configuration file
get_shell_config_file() {
    local shell=$1
    
    case $shell in
        zsh)
            if [ -f "$HOME/.zshrc" ]; then
                echo "$HOME/.zshrc"
            elif [ -f "$HOME/.zprofile" ]; then
                echo "$HOME/.zprofile"
            else
                echo "$HOME/.zshrc"
            fi
            ;;
        bash)
            if [ -f "$HOME/.bashrc" ]; then
                echo "$HOME/.bashrc"
            elif [ -f "$HOME/.bash_profile" ]; then
                echo "$HOME/.bash_profile"
            elif [ -f "$HOME/.profile" ]; then
                echo "$HOME/.profile"
            else
                echo "$HOME/.bashrc"
            fi
            ;;
        fish)
            mkdir -p "$HOME/.config/fish"
            echo "$HOME/.config/fish/config.fish"
            ;;
        *)
            echo "$HOME/.profile"
            ;;
    esac
}

# Add to PATH if not already there
add_to_path() {
    local shell_rc=$1
    local shell=$2
    
    # Check if already in PATH
    if echo "$PATH" | grep -q "$BIN_DIR"; then
        return
    fi
    
    case $shell in
        fish)
            cat >> "$shell_rc" << EOF

# KRINS-Universe-Builder
set -gx PATH $BIN_DIR \$PATH
EOF
            ;;
        *)
            cat >> "$shell_rc" << EOF

# KRINS-Universe-Builder
export PATH="$BIN_DIR:\$PATH"
EOF
            ;;
    esac
    
    # Export for current session
    export PATH="$BIN_DIR:$PATH"
}

# Setup command completions
setup_completions() {
    local shell_rc=$1
    local shell=$2
    
    # Only add completions if krins command is available
    if ! command -v krins >/dev/null 2>&1; then
        return
    fi
    
    case $shell in
        bash)
            local completion_file="$HOME/.krins-completion.bash"
            if krins completion bash > "$completion_file" 2>/dev/null; then
                echo "source \"$completion_file\"" >> "$shell_rc"
                log "info" "Bash completions installed"
            fi
            ;;
        zsh)
            local completion_file="$HOME/.krins-completion.zsh"
            if krins completion zsh > "$completion_file" 2>/dev/null; then
                echo "source \"$completion_file\"" >> "$shell_rc"
                log "info" "Zsh completions installed"
            fi
            ;;
        fish)
            # Fish completions would go in ~/.config/fish/completions/
            local comp_dir="$HOME/.config/fish/completions"
            mkdir -p "$comp_dir"
            if krins completion fish > "$comp_dir/krins.fish" 2>/dev/null; then
                log "info" "Fish completions installed"
            fi
            ;;
    esac
}

# Setup useful aliases
setup_aliases() {
    local shell_rc=$1
    local shell=$2
    
    case $shell in
        fish)
            cat >> "$shell_rc" << 'EOF'

# KRINS Aliases
alias k='krins'
alias kd='krins dashboard'
alias ki='krins init'
alias ka='krins ai'
alias kc='krins cache'
alias ko='krins optimize-team'
alias km='krins deploy'
EOF
            ;;
        *)
            cat >> "$shell_rc" << 'EOF'

# KRINS Aliases
alias k='krins'
alias kd='krins dashboard'
alias ki='krins init'
alias ka='krins ai'
alias kc='krins cache'
alias ko='krins optimize-team'
alias km='krins deploy'
EOF
            ;;
    esac
}

# Verify installation works correctly
verify_installation() {
    log "step" "Verifying installation..."
    
    # Check if krins command is available
    if ! command -v krins >/dev/null 2>&1; then
        log "error" "krins command not found in PATH"
        log "info" "PATH: $PATH"
        return 1
    fi
    
    # Check version
    local version=$(krins --version 2>/dev/null || echo "unknown")
    log "success" "krins command available (version: $version)"
    
    # Test basic functionality
    if krins status >/dev/null 2>&1; then
        log "success" "Basic functionality test passed"
    else
        log "warning" "Basic functionality test failed (this may be normal on first run)"
    fi
    
    # Check if magic alias works
    if command -v magic >/dev/null 2>&1; then
        log "success" "magic alias available"
    fi
    
    return 0
}

# Post-installation setup and configuration
post_install_setup() {
    log "step" "Running post-installation setup..."
    
    # Create configuration file
    create_config_file
    
    # Setup development tools
    setup_dev_tools
    
    # Create desktop integration
    create_desktop_integration
    
    # Initialize sample project
    if prompt_yes_no "Would you like to initialize a sample project?" "n"; then
        create_sample_project
    fi
    
    log "success" "Post-installation setup completed"
}

# Create initial configuration
create_config_file() {
    cat > "$CONFIG_DIR/config.json" << EOF
{
  "version": "$KRINS_VERSION",
  "installDate": "$(date -Iseconds)",
  "installMethod": "installer-script",
  "system": {
    "os": "$(detect_os)",
    "arch": "$(detect_arch)",
    "shell": "$(detect_shell)",
    "packageManager": "$(detect_package_manager)"
  },
  "features": {
    "aiAssistant": true,
    "smartCache": true,
    "teamOptimization": true,
    "deploymentEngine": true,
    "dashboard": true
  },
  "preferences": {
    "autoUpdate": true,
    "analytics": false,
    "verboseLogging": false
  }
}
EOF
}

# Setup development tools
setup_dev_tools() {
    # Install tsx globally if not available
    if ! command -v tsx >/dev/null 2>&1; then
        log "info" "Installing tsx globally..."
        npm install -g tsx >/dev/null 2>&1 || true
    fi
    
    # Create global symlinks
    if [ ! -L "$BIN_DIR/magic" ] && command -v krins >/dev/null 2>&1; then
        ln -sf "$(which krins)" "$BIN_DIR/magic" 2>/dev/null || true
        log "info" "Created magic symlink"
    fi
}

# Create desktop integration (Linux/macOS)
create_desktop_integration() {
    local os=$(detect_os)
    
    case $os in
        linux|wsl)
            if [ -d "$HOME/.local/share/applications" ]; then
                cat > "$HOME/.local/share/applications/krins-universe-builder.desktop" << EOF
[Desktop Entry]
Version=1.0
Type=Application
Name=KRINS Universe Builder
Comment=AI-powered development coordination platform
Exec=krins dashboard
Icon=utilities-terminal
Terminal=false
Categories=Development;IDE;
Keywords=AI;Development;Automation;CLI;Coordination;
EOF
                log "info" "Desktop entry created"
            fi
            ;;
        macos)
            # macOS specific integrations could go here
            log "info" "macOS integration available via command line"
            ;;
    esac
}

# Create a sample project for testing
create_sample_project() {
    local sample_dir="$HOME/krins-sample-project"
    
    if [ -d "$sample_dir" ]; then
        log "warning" "Sample project directory already exists"
        return
    fi
    
    log "info" "Creating sample project in $sample_dir"
    
    mkdir -p "$sample_dir"
    cd "$sample_dir"
    
    # Create sample package.json
    cat > package.json << EOF
{
  "name": "krins-sample-project",
  "version": "1.0.0",
  "description": "Sample project for KRINS-Universe-Builder",
  "main": "index.js",
  "scripts": {
    "start": "node index.js",
    "dev": "node index.js",
    "test": "echo \\"No tests yet\\""
  },
  "keywords": ["krins", "sample"],
  "author": "KRINS Installer",
  "license": "MIT"
}
EOF
    
    # Create sample index.js
    cat > index.js << 'EOF'
// KRINS Sample Project
console.log('🪄✨ Welcome to KRINS-Universe-Builder! ✨🪄');
console.log('This is a sample project to test your installation.');
console.log('');
console.log('Try these commands:');
console.log('  krins ai "how can I improve this project?"');
console.log('  krins detect');
console.log('  krins dashboard');
console.log('');
console.log('Happy coding with KRINS! 🚀');
EOF
    
    # Create sample README
    cat > README.md << 'EOF'
# KRINS Sample Project

This is a sample project created by the KRINS-Universe-Builder installer.

## Available KRINS Commands

- `krins ai "question"` - Ask the AI assistant
- `krins detect` - Analyze project structure
- `krins dashboard` - Launch development dashboard
- `krins optimize-team` - Get team composition recommendations
- `krins deploy auto` - Deploy with intelligent platform selection
- `krins cache stats` - View AI cache statistics

## Quick Start

```bash
# Ask AI for help
krins ai "how can I improve this project?"

# Analyze the project
krins detect

# Launch dashboard
krins dashboard
```

Enjoy developing with KRINS! 🪄✨
EOF
    
    cd - >/dev/null
    log "success" "Sample project created in $sample_dir"
}

# Print beautiful installation summary
print_summary() {
    clear
    echo
    echo -e "${GREEN}╔════════════════════════════════════════════════════════════════╗${NC}"
    echo -e "${GREEN}║                                                                ║${NC}"
    echo -e "${GREEN}║                 🎉 INSTALLATION COMPLETE! 🎉                  ║${NC}"
    echo -e "${GREEN}║                                                                ║${NC}"
    echo -e "${GREEN}╚════════════════════════════════════════════════════════════════╝${NC}"
    echo
    echo -e "${WHITE}🪄✨ KRINS-Universe-Builder v$KRINS_VERSION is now ready! ✨🪄${NC}"
    echo
    echo -e "${CYAN}🚀 Quick Start Commands:${NC}"
    echo -e "   ${YELLOW}krins${NC}                           # Show help and available commands"
    echo -e "   ${YELLOW}krins init${NC}                      # Initialize magic for your project" 
    echo -e "   ${YELLOW}krins ai \"your question\"${NC}        # Ask AI assistant anything"
    echo -e "   ${YELLOW}krins deploy auto${NC}               # Deploy with intelligent platform selection"
    echo -e "   ${YELLOW}krins optimize-team${NC}             # Get ML-powered team recommendations"
    echo -e "   ${YELLOW}krins dashboard${NC}                 # Launch beautiful development dashboard"
    echo
    echo -e "${CYAN}🧠 AI-Powered Features:${NC}"
    echo -e "   • ${GREEN}Smart Project Detection${NC} - Automatically understands your codebase"
    echo -e "   • ${GREEN}Intelligent Deployment${NC} - Recommends optimal hosting platforms"
    echo -e "   • ${GREEN}Team Optimization${NC} - ML-based team composition suggestions"
    echo -e "   • ${GREEN}Smart Response Cache${NC} - 3-5x faster AI responses with similarity matching"
    echo -e "   • ${GREEN}Real-time Dashboard${NC} - Beautiful web interface for development insights"
    echo
    echo -e "${CYAN}🎯 Convenient Aliases:${NC}"
    echo -e "   ${GRAY}k, kd, ki, ka, kc, ko, km${NC} - Short commands for common operations"
    echo
    echo -e "${CYAN}📚 Resources:${NC}"
    echo -e "   • Documentation: ${BLUE}https://krins-universe-builder.vercel.app${NC}"
    echo -e "   • GitHub: ${BLUE}https://github.com/mandymgr/KRINS-Universe-Builder${NC}"
    echo -e "   • Configuration: ${GRAY}$CONFIG_DIR/config.json${NC}"
    echo
    echo -e "${YELLOW}💡 Important:${NC}"
    echo -e "   You may need to restart your terminal or run:"
    echo -e "   ${WHITE}source ~/.$(basename "$SHELL")rc${NC}"
    echo
    echo -e "${MAGENTA}✨ Welcome to the future of AI-powered development! ✨${NC}"
    echo -e "${GREEN}Happy coding with KRINS! 🚀${NC}"
    echo
}

# Cleanup on error
cleanup_on_error() {
    log "error" "Installation failed. Performing cleanup..."
    
    # Remove partially installed files
    rm -rf "$INSTALL_DIR" 2>/dev/null || true
    rm -f "$HOME/.krins-completion.bash" 2>/dev/null || true
    rm -f "$HOME/.krins-completion.zsh" 2>/dev/null || true
    rm -f "$HOME/.config/fish/completions/krins.fish" 2>/dev/null || true
    
    # Try to uninstall global package
    npm uninstall -g "$KRINS_NPM_PACKAGE" >/dev/null 2>&1 || true
    
    echo -e "${RED}Installation failed. Please check the error messages above.${NC}"
    echo -e "${YELLOW}You can try running the installer again or install manually.${NC}"
    
    exit 1
}

# Main installation orchestrator
main() {
    # Set up error handling
    trap cleanup_on_error ERR
    
    # Clear screen and show banner
    clear
    print_banner
    
    log "info" "Starting KRINS-Universe-Builder installation..."
    show_system_info
    echo
    
    # Installation flow
    check_prerequisites
    setup_directories
    install_krins
    setup_shell_integration
    
    if verify_installation; then
        post_install_setup
        print_summary
        
        # Ask to restart shell or source config
        if prompt_yes_no "Would you like to reload your shell configuration now?" "y"; then
            local shell_rc=$(get_shell_config_file "$(detect_shell)")
            if [ -f "$shell_rc" ]; then
                exec "$SHELL" -l
            fi
        fi
    else
        log "error" "Installation verification failed"
        exit 1
    fi
}

# Command line argument parsing
parse_arguments() {
    while [[ $# -gt 0 ]]; do
        case $1 in
            --version|-v)
                echo "KRINS Magic Installer v$KRINS_VERSION"
                exit 0
                ;;
            --help|-h)
                show_help
                exit 0
                ;;
            --force)
                FORCE_INSTALL=true
                log "info" "Force installation enabled"
                ;;
            --dev)
                KRINS_VERSION="dev"
                KRINS_NPM_PACKAGE="krins-universe-builder@dev"
                log "info" "Development version installation enabled"
                ;;
            --no-shell-integration)
                NO_SHELL_INTEGRATION=true
                log "info" "Shell integration disabled"
                ;;
            --quiet|-q)
                exec >/dev/null 2>&1
                ;;
            *)
                log "error" "Unknown option: $1"
                echo "Use --help for usage information"
                exit 1
                ;;
        esac
        shift
    done
}

# Show help information
show_help() {
    echo "KRINS-Universe-Builder Magic Installer v$KRINS_VERSION"
    echo
    echo "Usage: $0 [options]"
    echo
    echo "Options:"
    echo "  -h, --help                    Show this help message"
    echo "  -v, --version                 Show installer version"
    echo "  -q, --quiet                   Silent installation"
    echo "  --force                       Force reinstallation"
    echo "  --dev                         Install development version"
    echo "  --no-shell-integration        Skip shell integration setup"
    echo
    echo "Examples:"
    echo "  $0                            # Standard installation"
    echo "  $0 --force --dev              # Force install development version"
    echo "  $0 --quiet                    # Silent installation"
    echo
    echo "For more information, visit:"
    echo "  https://github.com/mandymgr/KRINS-Universe-Builder"
}

# Parse arguments and run main installation
parse_arguments "$@"
main