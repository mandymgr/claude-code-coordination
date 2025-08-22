# Installation Guide

Complete guide for installing Claude Code Coordination System.

## Quick Installation

### Option 1: One-line Install (Recommended)
```bash
curl -sSL https://raw.githubusercontent.com/anthropics/claude-code-coordination/main/install.sh | bash
```

### Option 2: NPM Global Install
```bash
npm install -g claude-code-coordination
```

### Option 3: Manual Installation
```bash
git clone https://github.com/anthropics/claude-code-coordination.git
cd claude-code-coordination
./install.sh
```

## System Requirements

- **macOS**: 10.14+ or **Linux**: Ubuntu 18.04+
- **Node.js**: 14.0+ (for NPM installation)
- **jq**: JSON processor (auto-installed)
- **uuidgen**: UUID generator (system built-in)

## Verification

After installation, verify everything works:

```bash
# Check system health
claude-coord doctor

# Initialize in a project
cd your-project
claude-coord init

# Activate coordination
source $(claude-coord --hooks-path)
```

## Project Setup

### Initialize Coordination
```bash
cd your-project
claude-coord init
```

This creates:
- `.claude-coordination/` directory
- `hooks.sh` coordination script
- `config.json` project configuration
- Updates `.gitignore`

### Activate Coordination
```bash
# Option 1: Auto-detect
source $(claude-coord --hooks-path)

# Option 2: Direct path
source .claude-coordination/hooks.sh

# Option 3: Project-specific helper (if created)
source .claude-start.sh
```

## Multi-Repository Setup

For projects with multiple repositories:

```bash
# In main project directory
claude-coord init

# Create coordination links
ln -s $(pwd)/.claude-coordination /path/to/repo1/.claude-coordination
ln -s $(pwd)/.claude-coordination /path/to/repo2/.claude-coordination
```

## Configuration

### Project Configuration
Edit `.claude-coordination/config.json`:

```json
{
  "project_name": "My Project",
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
```

### Global Configuration
Edit `~/.claude-coordination/config.json` for global defaults.

## Shell Integration

### Bash
Add to `~/.bashrc`:
```bash
# Auto-activate coordination in project directories
if [ -f ".claude-coordination/hooks.sh" ] && [ -z "$CLAUDE_SESSION_ID" ]; then
    source .claude-coordination/hooks.sh
fi
```

### Zsh
Add to `~/.zshrc`:
```zsh
# Auto-activate coordination in project directories
if [ -f ".claude-coordination/hooks.sh" ] && [ -z "$CLAUDE_SESSION_ID" ]; then
    source .claude-coordination/hooks.sh
fi
```

## IDE Integration

### VS Code
Create `.vscode/tasks.json`:
```json
{
  "version": "2.0.0",
  "tasks": [
    {
      "label": "Activate Claude Coordination",
      "type": "shell",
      "command": "source .claude-coordination/hooks.sh",
      "group": "build"
    }
  ]
}
```

### Terminal Integrations
Most terminals support sourcing the coordination script on startup.

## Docker Support

For containerized development:

```dockerfile
# In your Dockerfile
RUN curl -sSL https://raw.githubusercontent.com/anthropics/claude-code-coordination/main/install.sh | bash

# In your docker-compose.yml
volumes:
  - ./.claude-coordination:/app/.claude-coordination
```

## Troubleshooting

### Installation Issues

**Permission denied:**
```bash
chmod +x ~/.claude-coordination/claude-coord
export PATH="$PATH:~/.claude-coordination"
```

**jq not found:**
```bash
# macOS
brew install jq

# Ubuntu/Debian
sudo apt-get install jq

# CentOS/RHEL
sudo yum install jq
```

**Command not found:**
```bash
# Add to PATH
echo 'export PATH="$PATH:~/.claude-coordination"' >> ~/.bashrc
source ~/.bashrc
```

### Runtime Issues

**Sessions not visible:**
```bash
# Check if coordination is active
echo $CLAUDE_SESSION_ID

# Manually activate
source .claude-coordination/hooks.sh

# Check system health
claude-coord doctor
```

**File locks stuck:**
```bash
# Clear all locks
claude-coord unlock --all

# Clear specific file
claude-coord unlock path/to/file.js
```

**Messages not received:**
```bash
# Force cleanup
claude-coord cleanup

# Reset system
claude-coord reset
```

## Updating

### NPM Installation
```bash
npm update -g claude-code-coordination
```

### Manual Installation
```bash
cd claude-code-coordination
git pull origin main
./install.sh
```

### Automatic Updates
The system checks for updates weekly and notifies you of new versions.

## Uninstallation

### Remove Global Installation
```bash
rm -rf ~/.claude-coordination
# Remove PATH export from shell config
```

### Remove Project Installation
```bash
rm -rf .claude-coordination
# Remove from .gitignore
```

### NPM Uninstall
```bash
npm uninstall -g claude-code-coordination
```

## Next Steps

- Read the [Usage Guide](./usage.md)
- See [Command Reference](./commands.md)
- Check out [Examples](../examples/)