# Claude Code Coordination - VS Code Extension

🔄 **Multi-terminal AI coordination for seamless development workflow**

This VS Code extension provides a native GUI interface for the Claude Code Coordination CLI system, enabling seamless file locking, terminal coordination, and AI assistance directly within VS Code.

## ✨ Features

### 🔒 **File Coordination**
- **Lock/Unlock Files** - Right-click any file to lock it for editing
- **Visual Indicators** - Locked files show badges in explorer
- **Conflict Prevention** - Automatic detection of locked files
- **Session Management** - Track who's working on what

### 🤖 **AI Integration**
- **Context-Aware AI** - Ask AI about selected code
- **Smart Suggestions** - Get intelligent code recommendations
- **Terminal Integration** - Full Magic CLI access from VS Code

### 👥 **Team Collaboration**
- **Real-time Status** - See team activity in sidebar
- **Messaging System** - Send messages to other terminals
- **Web Dashboard** - Visual coordination overview
- **Session Tracking** - Monitor all active sessions

### ⚡ **Developer Experience**
- **Keyboard Shortcuts** - Quick access to all features
- **Command Palette** - All commands accessible via Cmd+Shift+P
- **Status Bar** - Live coordination status
- **Auto-refresh** - Real-time updates without manual refresh

## 🚀 Installation

### 1. Install Magic CLI
```bash
cd claude-code-coordination
npm install -g .
```

### 2. Install VS Code Extension
```bash
cd extensions/vscode
npm install
npm run compile
```

### 3. Install Extension in VS Code
- Open VS Code
- Go to Extensions view (Cmd+Shift+X)
- Click "..." → "Install from VSIX"
- Select the generated .vsix file

## 🎮 Usage

### **Quick Start**
1. Open a workspace in VS Code
2. Extension auto-starts coordination session
3. Use Command Palette (Cmd+Shift+P) → "Claude Coordination"
4. Or use sidebar panel "Claude Coordination"

### **Keyboard Shortcuts**
- `Cmd+Shift+L` - Lock current file
- `Cmd+Shift+A` - Ask AI assistant
- `Cmd+Shift+S` - Show coordination status

### **Context Menus**
- Right-click file → Lock/Unlock file
- Right-click code → AI assistance

## 🔧 Configuration

Access settings via VS Code Preferences → Extensions → Claude Code Coordination:

```json
{
  "claude-coordination.autoStartSession": true,
  "claude-coordination.showFileDecorations": true,
  "claude-coordination.enableNotifications": true,
  "claude-coordination.magicCliPath": "magic",
  "claude-coordination.webDashboardPort": 3000
}
```

## 📊 Interface Components

### **Sidebar Panel**
- Current session info
- Active sessions list
- Locked files overview
- Recent messages
- Quick action buttons

### **Status Bar**
- Live coordination status
- Active file locks count
- Session indicators
- Click for detailed status

### **Web Dashboard**
- Full-screen coordination overview
- Real-time statistics
- Team activity monitoring
- Interactive controls

## 🎯 Commands

| Command | Description | Shortcut |
|---------|-------------|----------|
| `Start Coordination Session` | Begin coordinating with team | - |
| `Lock Current File` | Lock active editor file | `Cmd+Shift+L` |
| `Unlock Current File` | Unlock active editor file | - |
| `Show Coordination Status` | Display full status panel | `Cmd+Shift+S` |
| `Send Message to Team` | Send team message | - |
| `Ask AI Assistant` | AI help with code | `Cmd+Shift+A` |
| `Open Web Dashboard` | Launch dashboard view | - |

## 🏗️ Architecture

```
VS Code Extension
├── StatusProvider     ← Sidebar tree view
├── DecorationProvider ← File badges/indicators  
├── WebDashboard      ← Full-screen dashboard
└── Extension         ← Main coordination logic
    ↓
Magic CLI System
├── terminal-coordinator.js
├── magic-cli.js
└── .claude-coordination/
```

## 🔍 Troubleshooting

### **Extension Not Working**
1. Check Magic CLI is installed: `magic --version`
2. Verify workspace has `.claude-coordination` folder
3. Check VS Code Developer Console for errors

### **File Decorations Missing**
1. Enable in settings: `claude-coordination.showFileDecorations`
2. Restart VS Code if needed
3. Check file is in workspace folder

### **Commands Not Available**
1. Ensure workspace is open (not single files)
2. Check Command Palette has "Claude Coordination" commands
3. Verify extension is activated in Extensions view

## 🤝 Contributing

1. Fork the repository
2. Make changes in `extensions/vscode/`
3. Test with `npm run compile && F5` (Launch Extension)
4. Submit pull request

## 📄 License

MIT License - See main project LICENSE file

## 🔗 Links

- [Main Project](https://github.com/mandymgr/claude-code-coordination)
- [Documentation](../../VIDERUTVIKLING.md)
- [CLI Usage](../../README.md)

---

**Made with ❤️ for developers who value seamless coordination**