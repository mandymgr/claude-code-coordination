# 🪄 Magic Development System - Simple Installation

## ⚡ Super Quick Install (One Command)

```bash
cd /path/to/claude-code-coordination
./magic-installer.sh
```

**Done!** Magic is now available everywhere on your system.

## 🚀 Using Magic in Any Project

### 1. Go to any project
```bash
cd your-project
```

### 2. Setup magic for this project  
```bash
magic-setup
```

### 3. Start using magic
```bash
# AI assistance
npm run magic:ask "how do I optimize this code?"

# Or use short alias
source .magic-integration/magic-aliases.sh
mai "your question"

# Dashboard
magic dashboard

# Logs  
magic logs summary
```

## 🎯 Example Usage

```bash
# Go to Helseriet project
cd helseriet-projekt

# Setup magic (one time only)
magic-setup

# Now you can use:
npm run magic:ask "improve ProductCard performance"
npm run magic:ask "implement Norwegian payment validation"
npm run magic:dashboard    # Visual interface

# Or with aliases:
mai "best React patterns for e-commerce"
mdash                      # Quick dashboard
```

## ✅ What Gets Installed

- **Global `magic` command** - Works anywhere
- **Global `magic-setup`** - Sets up any project  
- **Project-specific AI assistant** - Understands your codebase
- **Package.json scripts** - `npm run magic:*` commands
- **Shell aliases** - `mai`, `msetup`, `mdash` shortcuts
- **Auto-activation** - Loads in new terminals

## 🎉 Benefits

- **Zero configuration** - Just run installer once
- **Works everywhere** - Any project, any language
- **Project-aware** - AI understands your specific codebase
- **Session continuity** - Remembers conversations
- **Team friendly** - Share magic setups easily

That's it! Super simple installation and usage. ✨