# 🚀 Claude Code Coordination MCP Server

**KRIN AI Team Management & Multi-Agent Coordination**

This MCP (Model Context Protocol) server enables Claude to coordinate with other AI agents (GPT-4, Gemini) through KRIN as the master orchestrator.

## ✨ Features

- 🤖 **KRIN Master Orchestrator**: Intelligent AI team coordination
- ⚡ **Multi-Agent Management**: Claude, GPT-4, Gemini coordination
- 🛡️ **Quality Gates**: Automated code quality and security validation
- 📊 **Real-time Metrics**: Performance tracking and optimization
- 🔒 **File Locking**: Safe collaborative development
- 📈 **Enterprise Reports**: Comprehensive analytics and insights

## 🔧 Available MCP Tools

### Core Coordination
- `krin_coordinate_session` - Create and manage AI coordination sessions
- `krin_assign_task` - Intelligently assign tasks to optimal AI agents
- `krin_get_agent_status` - Real-time AI agent status and metrics

### Quality & Performance  
- `krin_run_quality_gate` - Execute quality gates with auto-fix
- `krin_optimize_team` - KRIN analyzes and optimizes team performance
- `krin_get_session_metrics` - Comprehensive session metrics

### File Management
- `krin_manage_file_locks` - Coordinate file locking for safety
- `krin_generate_report` - Generate coordination reports

## 🚀 Quick Start

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Build the server:**
   ```bash
   npm run build
   ```

3. **Start the server:**
   ```bash
   npm start
   ```

### Claude Desktop Integration

Add to your Claude Desktop `claude_desktop_config.json`:

```json
{
  "mcpServers": {
    "claude-coordination": {
      "command": "node",
      "args": ["/path/to/claude-code-coordination/packages/mcp-server/dist/index.js"]
    }
  }
}
```

## 🤖 Usage Examples

### Start Coordination Session
```
Use the krin_coordinate_session tool to create a new AI coordination session with Claude, GPT-4, and Gemini for developing a React dashboard.
```

### Assign Task to Optimal Agent
```
Use krin_assign_task to assign "Create a responsive navbar component with dark mode toggle" and let KRIN decide the best agent.
```

### Run Quality Gates
```
Use krin_run_quality_gate on ["src/components/*.tsx"] with TypeScript, ESLint, and security checks enabled with auto-fix.
```

### Get Team Status
```
Use krin_get_agent_status to see real-time status and performance metrics for all AI agents.
```

### Generate Executive Report
```
Use krin_generate_report with type "executive" to get comprehensive coordination insights.
```

## 🧠 KRIN Intelligence

KRIN (the master orchestrator) makes intelligent decisions about:

- **Agent Selection**: Chooses optimal AI agent based on task type, complexity, and current workload
- **Quality Assurance**: Automatically runs quality gates and fixes issues when possible  
- **Performance Optimization**: Continuously optimizes team performance and resource usage
- **Conflict Prevention**: Manages file locks and coordination to prevent conflicts

## 🛡️ Quality Gates

Automated quality validation includes:

- **TypeScript**: Strict type checking and compilation
- **ESLint**: Code style and best practices
- **Security**: Vulnerability scanning and prevention  
- **Performance**: Bundle size and optimization checks
- **Tests**: Coverage analysis and validation

## 📊 Metrics & Analytics

KRIN tracks comprehensive metrics:

- Task completion rates and success metrics
- Agent performance and specialization analytics
- Token usage optimization and cost tracking
- Quality gate pass/fail rates and trends
- Real-time coordination session insights

## 🔧 Development

### Build
```bash
npm run build
```

### Development Mode
```bash
npm run dev
```

### Testing
```bash
npm test
```

## 📈 Architecture

```
Claude (via MCP) 
    ↓
KRIN Coordination Server
    ├── Agent Pool Manager (Claude, GPT-4, Gemini)
    ├── Quality Gate Runner
    ├── Coordination Manager  
    └── Metrics & Analytics
```

## 🌟 Why This is Revolutionary

1. **First Multi-AI Orchestrator**: KRIN coordinates multiple AI models as a team
2. **Intelligent Task Routing**: Automatic optimal agent selection
3. **Enterprise Quality**: Automated quality gates with auto-fix
4. **Real-time Coordination**: Live metrics and performance optimization
5. **Conflict Prevention**: Smart file locking and session management

## 📝 License

MIT License - Built by KRIN AI Coordination Team

---

**Ready to revolutionize your AI development workflow with KRIN orchestration!** 🚀