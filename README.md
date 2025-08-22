# Claude Code Coordination

🚀 **Complete coordination system for multiple Claude Code terminal instances**

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Version](https://img.shields.io/npm/v/claude-code-coordination.svg)](https://npmjs.org/package/claude-code-coordination)

## ✨ Features

- 📝 **File Locking System** - Prevents conflicts when multiple Claude instances edit the same files
- 💬 **Inter-Session Messaging** - Send messages between Claude sessions with priority levels  
- 🔄 **Context Sharing** - Share context between sessions (session/project/global scopes)
- 📋 **Task Coordination** - Track what each Claude instance is working on
- 🧹 **Automatic Cleanup** - Removes old messages, sessions, and locks automatically
- 🔒 **TypeScript Support** - Complete type definitions included

## 🚀 Quick Start

### Installation

```bash
# Install globally
npm install -g claude-code-coordination

# Or install for current project
curl -sSL https://raw.githubusercontent.com/anthropics/claude-code-coordination/main/install.sh | bash
```

### Activation

```bash
# In any Claude Code terminal
source $(claude-coord --hooks-path)

# Or manually
export CLAUDE_SESSION_ID=$(uuidgen)
source ~/.claude-coordination/hooks.sh
```

## 💬 Available Commands

| Command | Description |
|---------|-------------|
| `/sessions` | List all active Claude sessions |
| `/status` | Show project coordination status |
| `/broadcast <message>` | Send message to all sessions |
| `/context key=value` | Set project context |
| `/context key` | Get project context |
| `/task <description>` | Set current task |
| `/task` | Clear current task |
| `/cleanup` | Manual cleanup of old data |

## 🛠 Configuration

Create `.claude-coordination/config.json` in your project:

```json
{
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

## 📖 Usage Examples

### Basic Coordination

```bash
# Terminal 1
source $(claude-coord --hooks-path)
/task "Implementing user authentication"

# Terminal 2  
source $(claude-coord --hooks-path)
/sessions  # Shows Terminal 1's task
/broadcast "Starting on database migrations"
```

### File Locking in Action

1. Claude 1 starts editing `app.ts` → File automatically locked
2. Claude 2 tries to edit same file → Gets lock warning
3. Claude 1 finishes → File automatically unlocked

### Context Sharing

```bash
# Share build status
/context build_status=success

# Check context from another session
/context build_status
# Output: build_status: success
```

## 🏗 Architecture

```
Project Root/
├── .claude-coordination/
│   ├── hooks.sh              # Main coordination script
│   ├── config.json          # Project configuration
│   ├── sessions/            # Session files (auto-managed)
│   ├── broadcasts/          # Message files (auto-managed)
│   ├── locks/              # File locks (auto-managed)
│   └── global-state.json   # Shared state (auto-managed)
```

## 📦 Integration

### TypeScript Projects

```typescript
import { 
  ClaudeSession, 
  CoordinationMessage, 
  GlobalCoordinationState 
} from 'claude-code-coordination/types';

// Your coordination logic here
```

### Multi-Repository Projects

```bash
# Setup for monorepo
claude-coord init --multi-repo
claude-coord link ./backend ./frontend ./shared-types
```

## 🧪 Testing

```bash
# Run all tests
npm test

# Run specific test suites
npm run test:unit
npm run test:integration

# Test installation
npm run test:install
```

## 🔧 CLI Tools

```bash
# Initialize coordination in current project
claude-coord init

# Check system status
claude-coord status

# Clean up old data
claude-coord cleanup

# Show active sessions
claude-coord sessions

# Send broadcast message
claude-coord broadcast "Deploy completed"
```

## 📊 Monitoring

Monitor coordination activity:

```bash
# Show coordination status
claude-coord status --verbose

# Watch coordination activity
claude-coord watch

# Export session data
claude-coord export --format json
```

## 🚨 Troubleshooting

### Common Issues

**Coordination not working**
```bash
# Check requirements
claude-coord doctor

# Reset coordination system
claude-coord reset
```

**File locks stuck**
```bash
# Force unlock all files
claude-coord unlock --all

# Show lock status
claude-coord locks
```

**Messages not received**
```bash
# Check message queue
claude-coord messages --pending

# Clear message queue
claude-coord cleanup --messages
```

## 🤝 Contributing

1. Fork the repository
2. Create feature branch: `git checkout -b feature-name`
3. Run tests: `npm test`
4. Commit changes: `git commit -am 'Add feature'`
5. Push branch: `git push origin feature-name`
6. Create Pull Request

## 📄 License

MIT © [Claude Code Community](https://github.com/anthropics/claude-code-coordination)

## 🙏 Acknowledgments

- Built for the [Claude Code](https://claude.ai/code) community
- Inspired by collaborative development workflows
- Thanks to all contributors

---

**Get Started**: `npm install -g claude-code-coordination && claude-coord init`