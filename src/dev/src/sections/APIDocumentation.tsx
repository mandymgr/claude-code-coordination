import React, { useState } from 'react';
import { 
  HiCommandLine,
  HiCodeBracket,
  HiCpuChip,
  HiUsers,
  HiPlay
} from 'react-icons/hi2';

interface APIDocumentationProps {
  isDarkTheme: boolean;
}

const APIDocumentation: React.FC<APIDocumentationProps> = ({ isDarkTheme }) => {
  const [activeCategory, setActiveCategory] = useState('commands');

  const commandCategories = [
    { id: 'commands', label: 'CLI Commands', icon: HiCommandLine },
    { id: 'javascript', label: 'JavaScript API', icon: HiCodeBracket },
    { id: 'ai', label: 'AI Functions', icon: HiCpuChip },
    { id: 'websocket', label: 'WebSocket Events', icon: HiUsers }
  ];

  const cliCommands = [
    {
      command: '/sessions',
      description: 'View all active Claude Code sessions in the coordination network',
      usage: '/sessions [--detailed]',
      examples: ['/sessions', '/sessions --detailed'],
      response: 'List of active sessions with IDs, status, and project paths'
    },
    {
      command: '/broadcast <message>',
      description: 'Send a message to all active Claude Code sessions',
      usage: '/broadcast "your message here"',
      examples: ['/broadcast "Starting deployment"', '/broadcast "Please review PR #123"'],
      response: 'Confirmation with number of sessions that received the message'
    },
    {
      command: '/status',
      description: 'Show current coordination system status and configuration',
      usage: '/status [--verbose]',
      examples: ['/status', '/status --verbose'],
      response: 'Current session info, active locks, and system health'
    },
    {
      command: '/context <key> [value]',
      description: 'Get or set shared context variables for project coordination',
      usage: '/context <key> [value]',
      examples: ['/context phase', '/context phase testing', '/context branch feature-auth'],
      response: 'Current value for key, or confirmation of value being set'
    },
    {
      command: '/task [description]',
      description: 'Set or clear current task for better coordination',
      usage: '/task [task description]',
      examples: ['/task "Implementing user authentication"', '/task'],
      response: 'Current task set confirmation or task cleared message'
    },
    {
      command: '/cleanup',
      description: 'Manually trigger cleanup of inactive sessions and locks',
      usage: '/cleanup [--force]',
      examples: ['/cleanup', '/cleanup --force'],
      response: 'Summary of cleaned up sessions and released locks'
    }
  ];

  const jsApiMethods = [
    {
      method: 'coordinator.getActiveSessions()',
      description: 'Retrieve all active coordination sessions',
      parameters: 'None',
      returns: 'Promise<Session[]>',
      example: `const sessions = await coordinator.getActiveSessions();
console.log(\`Found \${sessions.length} active sessions\`);`
    },
    {
      method: 'coordinator.sendMessage(sessionId, message)',
      description: 'Send a direct message to a specific session',
      parameters: 'sessionId: string, message: string',
      returns: 'Promise<boolean>',
      example: `await coordinator.sendMessage('session-123', 'Task complete');`
    },
    {
      method: 'coordinator.broadcastMessage(message)',
      description: 'Broadcast message to all active sessions',
      parameters: 'message: string',
      returns: 'Promise<number>',
      example: `const count = await coordinator.broadcastMessage('System update');`
    },
    {
      method: 'coordinator.setContext(key, value)',
      description: 'Set a shared context variable',
      parameters: 'key: string, value: any',
      returns: 'Promise<void>',
      example: `await coordinator.setContext('phase', 'testing');`
    },
    {
      method: 'coordinator.getContext(key)',
      description: 'Retrieve a shared context variable',
      parameters: 'key?: string',
      returns: 'Promise<any>',
      example: `const phase = await coordinator.getContext('phase');`
    },
    {
      method: 'coordinator.acquireFileLock(filepath)',
      description: 'Acquire exclusive lock on a file',
      parameters: 'filepath: string',
      returns: 'Promise<LockHandle>',
      example: `const lock = await coordinator.acquireFileLock('src/auth.ts');`
    }
  ];

  const aiFunctions = [
    {
      function: 'ai.analyzeTaskComplexity(description)',
      description: 'Analyze task complexity and suggest time estimates',
      parameters: 'description: string',
      returns: 'Promise<ComplexityAnalysis>',
      example: `const analysis = await ai.analyzeTaskComplexity('Implement OAuth');
console.log(analysis.complexity, analysis.estimatedTime);`
    },
    {
      function: 'ai.predictConflicts(files)',
      description: 'Predict potential conflicts before editing files',
      parameters: 'files: string[]',
      returns: 'Promise<ConflictPrediction[]>',
      example: `const conflicts = await ai.predictConflicts(['auth.ts', 'user.ts']);`
    },
    {
      function: 'ai.suggestTeamComposition(projectType)',
      description: 'Get AI-optimized team composition for project type',
      parameters: 'projectType: ProjectType',
      returns: 'Promise<TeamSuggestion>',
      example: `const team = await ai.suggestTeamComposition('ecommerce');`
    },
    {
      function: 'ai.analyzeCodebase(path)',
      description: 'Perform deep analysis of codebase structure and complexity',
      parameters: 'path: string',
      returns: 'Promise<CodebaseAnalysis>',
      example: `const analysis = await ai.analyzeCodebase('./src');
console.log(analysis.architecture, analysis.complexity);`
    }
  ];

  const websocketEvents = [
    {
      event: 'session:joined',
      description: 'Emitted when a new session joins the coordination network',
      payload: 'SessionInfo',
      example: `socket.on('session:joined', (session) => {
  console.log(\`New session: \${session.id}\`);
});`
    },
    {
      event: 'session:left',
      description: 'Emitted when a session leaves or times out',
      payload: 'SessionInfo',
      example: `socket.on('session:left', (session) => {
  console.log(\`Session left: \${session.id}\`);
});`
    },
    {
      event: 'message:broadcast',
      description: 'Received when a broadcast message is sent to all sessions',
      payload: 'BroadcastMessage',
      example: `socket.on('message:broadcast', (msg) => {
  console.log(\`Broadcast from \${msg.sender}: \${msg.content}\`);
});`
    },
    {
      event: 'file:locked',
      description: 'Emitted when a file lock is acquired',
      payload: 'FileLockInfo',
      example: `socket.on('file:locked', (lock) => {
  console.log(\`File locked: \${lock.filepath}\`);
});`
    },
    {
      event: 'context:updated',
      description: 'Emitted when shared context is modified',
      payload: 'ContextUpdate',
      example: `socket.on('context:updated', (update) => {
  console.log(\`Context \${update.key} = \${update.value}\`);
});`
    }
  ];

  const getCurrentData = () => {
    switch (activeCategory) {
      case 'commands': return cliCommands;
      case 'javascript': return jsApiMethods;
      case 'ai': return aiFunctions;
      case 'websocket': return websocketEvents;
      default: return cliCommands;
    }
  };

  const renderCommandItem = (item: any, index: number) => {
    if (activeCategory === 'commands') {
      return (
        <div key={index} className={`rounded-lg border p-6 mb-6 ${isDarkTheme ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
          <div className="flex items-start gap-4">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDarkTheme ? 'bg-slate-700 text-green-400' : 'bg-green-100 text-green-600'}`}>
              <HiCommandLine className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className={`text-lg font-bold font-mono mb-2 ${isDarkTheme ? 'text-green-400' : 'text-green-600'}`}>
                {item.command}
              </h3>
              <p className={`text-sm mb-3 ${isDarkTheme ? 'text-slate-400' : 'text-slate-600'}`}>
                {item.description}
              </p>
              <div className="mb-3">
                <h4 className={`text-sm font-medium mb-2 ${isDarkTheme ? 'text-slate-300' : 'text-slate-700'}`}>Usage:</h4>
                <code className={`text-xs px-3 py-2 rounded ${isDarkTheme ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'}`}>
                  {item.usage}
                </code>
              </div>
              <div className="mb-3">
                <h4 className={`text-sm font-medium mb-2 ${isDarkTheme ? 'text-slate-300' : 'text-slate-700'}`}>Examples:</h4>
                <div className="space-y-1">
                  {item.examples.map((example: string, exIndex: number) => (
                    <code key={exIndex} className={`block text-xs px-3 py-2 rounded ${isDarkTheme ? 'bg-slate-800 text-blue-400' : 'bg-slate-100 text-blue-600'}`}>
                      {example}
                    </code>
                  ))}
                </div>
              </div>
              <div>
                <h4 className={`text-sm font-medium mb-2 ${isDarkTheme ? 'text-slate-300' : 'text-slate-700'}`}>Response:</h4>
                <p className={`text-xs ${isDarkTheme ? 'text-slate-500' : 'text-slate-500'}`}>
                  {item.response}
                </p>
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    if (activeCategory === 'javascript') {
      return (
        <div key={index} className={`rounded-lg border p-6 mb-6 ${isDarkTheme ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
          <div className="flex items-start gap-4">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDarkTheme ? 'bg-slate-700 text-blue-400' : 'bg-blue-100 text-blue-600'}`}>
              <HiCodeBracket className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className={`text-lg font-bold font-mono mb-2 ${isDarkTheme ? 'text-blue-400' : 'text-blue-600'}`}>
                {item.method}
              </h3>
              <p className={`text-sm mb-3 ${isDarkTheme ? 'text-slate-400' : 'text-slate-600'}`}>
                {item.description}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className={`text-sm font-medium mb-2 ${isDarkTheme ? 'text-slate-300' : 'text-slate-700'}`}>Parameters:</h4>
                  <code className={`text-xs px-3 py-2 rounded ${isDarkTheme ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'}`}>
                    {item.parameters}
                  </code>
                </div>
                <div>
                  <h4 className={`text-sm font-medium mb-2 ${isDarkTheme ? 'text-slate-300' : 'text-slate-700'}`}>Returns:</h4>
                  <code className={`text-xs px-3 py-2 rounded ${isDarkTheme ? 'bg-slate-800 text-purple-400' : 'bg-slate-100 text-purple-600'}`}>
                    {item.returns}
                  </code>
                </div>
              </div>
              <div>
                <h4 className={`text-sm font-medium mb-2 ${isDarkTheme ? 'text-slate-300' : 'text-slate-700'}`}>Example:</h4>
                <pre className={`text-xs px-3 py-2 rounded overflow-x-auto ${isDarkTheme ? 'bg-slate-800 text-green-400' : 'bg-slate-100 text-green-600'}`}>
                  {item.example}
                </pre>
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    if (activeCategory === 'ai') {
      return (
        <div key={index} className={`rounded-lg border p-6 mb-6 ${isDarkTheme ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
          <div className="flex items-start gap-4">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDarkTheme ? 'bg-slate-700 text-purple-400' : 'bg-purple-100 text-purple-600'}`}>
              <HiCpuChip className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className={`text-lg font-bold font-mono mb-2 ${isDarkTheme ? 'text-purple-400' : 'text-purple-600'}`}>
                {item.function}
              </h3>
              <p className={`text-sm mb-3 ${isDarkTheme ? 'text-slate-400' : 'text-slate-600'}`}>
                {item.description}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div>
                  <h4 className={`text-sm font-medium mb-2 ${isDarkTheme ? 'text-slate-300' : 'text-slate-700'}`}>Parameters:</h4>
                  <code className={`text-xs px-3 py-2 rounded ${isDarkTheme ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'}`}>
                    {item.parameters}
                  </code>
                </div>
                <div>
                  <h4 className={`text-sm font-medium mb-2 ${isDarkTheme ? 'text-slate-300' : 'text-slate-700'}`}>Returns:</h4>
                  <code className={`text-xs px-3 py-2 rounded ${isDarkTheme ? 'bg-slate-800 text-orange-400' : 'bg-slate-100 text-orange-600'}`}>
                    {item.returns}
                  </code>
                </div>
              </div>
              <div>
                <h4 className={`text-sm font-medium mb-2 ${isDarkTheme ? 'text-slate-300' : 'text-slate-700'}`}>Example:</h4>
                <pre className={`text-xs px-3 py-2 rounded overflow-x-auto ${isDarkTheme ? 'bg-slate-800 text-green-400' : 'bg-slate-100 text-green-600'}`}>
                  {item.example}
                </pre>
              </div>
            </div>
          </div>
        </div>
      );
    }
    
    if (activeCategory === 'websocket') {
      return (
        <div key={index} className={`rounded-lg border p-6 mb-6 ${isDarkTheme ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
          <div className="flex items-start gap-4">
            <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${isDarkTheme ? 'bg-slate-700 text-orange-400' : 'bg-orange-100 text-orange-600'}`}>
              <HiUsers className="w-5 h-5" />
            </div>
            <div className="flex-1">
              <h3 className={`text-lg font-bold font-mono mb-2 ${isDarkTheme ? 'text-orange-400' : 'text-orange-600'}`}>
                {item.event}
              </h3>
              <p className={`text-sm mb-3 ${isDarkTheme ? 'text-slate-400' : 'text-slate-600'}`}>
                {item.description}
              </p>
              <div className="mb-4">
                <h4 className={`text-sm font-medium mb-2 ${isDarkTheme ? 'text-slate-300' : 'text-slate-700'}`}>Payload:</h4>
                <code className={`text-xs px-3 py-2 rounded ${isDarkTheme ? 'bg-slate-800 text-slate-300' : 'bg-slate-100 text-slate-700'}`}>
                  {item.payload}
                </code>
              </div>
              <div>
                <h4 className={`text-sm font-medium mb-2 ${isDarkTheme ? 'text-slate-300' : 'text-slate-700'}`}>Example:</h4>
                <pre className={`text-xs px-3 py-2 rounded overflow-x-auto ${isDarkTheme ? 'bg-slate-800 text-green-400' : 'bg-slate-100 text-green-600'}`}>
                  {item.example}
                </pre>
              </div>
            </div>
          </div>
        </div>
      );
    }
  };

  return (
    <section id="api-documentation" className="p-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center">
              <HiCommandLine className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h1 className={`text-4xl font-bold mb-6 ${
            isDarkTheme ? 'text-white' : 'text-slate-900'
          }`}>
            API Reference & Documentation
          </h1>
          
          <p className={`text-lg leading-relaxed max-w-3xl mx-auto ${
            isDarkTheme ? 'text-slate-300' : 'text-slate-600'
          }`}>
            Complete reference for all coordination commands, JavaScript APIs, AI functions, 
            and WebSocket events in the Claude Code Coordination system.
          </p>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap justify-center gap-2 mb-12">
          {commandCategories.map((category) => (
            <button
              key={category.id}
              onClick={() => setActiveCategory(category.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-all duration-300 ${
                activeCategory === category.id
                  ? isDarkTheme 
                    ? 'bg-blue-600/20 text-blue-400 border border-blue-400/50' 
                    : 'bg-blue-100 text-blue-700 border border-blue-200'
                  : isDarkTheme
                    ? 'text-slate-400 hover:text-white hover:bg-slate-700/30 border border-transparent'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/50 border border-transparent'
              }`}
            >
              <category.icon className="w-4 h-4" />
              <span className="text-sm font-medium">{category.label}</span>
            </button>
          ))}
        </div>

        {/* API Documentation Content */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-8">
            <h2 className={`text-2xl font-bold ${
              isDarkTheme ? 'text-white' : 'text-slate-900'
            }`}>
              {commandCategories.find(c => c.id === activeCategory)?.label}
            </h2>
            <span className={`text-sm px-3 py-1 rounded-full ${
              isDarkTheme ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'
            }`}>
              {getCurrentData().length} items
            </span>
          </div>

          <div className="space-y-6">
            {getCurrentData().map((item, index) => renderCommandItem(item, index))}
          </div>
        </div>

        {/* Quick Start Guide */}
        <div className={`rounded-lg border p-8 ${isDarkTheme ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
          <h2 className={`text-2xl font-bold mb-6 flex items-center gap-3 ${
            isDarkTheme ? 'text-white' : 'text-slate-900'
          }`}>
            <HiPlay className="w-6 h-6 text-green-400" />
            Quick Start Guide
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className={`text-lg font-semibold mb-4 ${
                isDarkTheme ? 'text-white' : 'text-slate-900'
              }`}>
                Setting Up Coordination
              </h3>
              <div className="space-y-3">
                <div className={`p-4 rounded-lg ${
                  isDarkTheme ? 'bg-slate-800/50' : 'bg-slate-50'
                }`}>
                  <h4 className={`font-medium mb-2 ${
                    isDarkTheme ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    1. Enable Coordination
                  </h4>
                  <code className={`text-xs px-2 py-1 rounded ${
                    isDarkTheme ? 'bg-slate-700 text-green-400' : 'bg-slate-200 text-green-600'
                  }`}>
                    export CLAUDE_SESSION_ID=$(uuidgen)
                  </code>
                </div>
                <div className={`p-4 rounded-lg ${
                  isDarkTheme ? 'bg-slate-800/50' : 'bg-slate-50'
                }`}>
                  <h4 className={`font-medium mb-2 ${
                    isDarkTheme ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    2. Source Hooks
                  </h4>
                  <code className={`text-xs px-2 py-1 rounded ${
                    isDarkTheme ? 'bg-slate-700 text-green-400' : 'bg-slate-200 text-green-600'
                  }`}>
                    source .claude-coordination/claude-hooks.sh
                  </code>
                </div>
                <div className={`p-4 rounded-lg ${
                  isDarkTheme ? 'bg-slate-800/50' : 'bg-slate-50'
                }`}>
                  <h4 className={`font-medium mb-2 ${
                    isDarkTheme ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    3. Check Status
                  </h4>
                  <code className={`text-xs px-2 py-1 rounded ${
                    isDarkTheme ? 'bg-slate-700 text-green-400' : 'bg-slate-200 text-green-600'
                  }`}>
                    /status
                  </code>
                </div>
              </div>
            </div>

            <div>
              <h3 className={`text-lg font-semibold mb-4 ${
                isDarkTheme ? 'text-white' : 'text-slate-900'
              }`}>
                Common Use Cases
              </h3>
              <div className="space-y-3">
                <div className={`p-4 rounded-lg border-l-4 border-blue-400 ${
                  isDarkTheme ? 'bg-blue-500/10' : 'bg-blue-50'
                }`}>
                  <h4 className={`font-medium mb-1 ${
                    isDarkTheme ? 'text-white' : 'text-slate-900'
                  }`}>
                    Team Communication
                  </h4>
                  <p className={`text-xs ${
                    isDarkTheme ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    Use <code>/broadcast</code> to notify all team members of important updates
                  </p>
                </div>
                <div className={`p-4 rounded-lg border-l-4 border-green-400 ${
                  isDarkTheme ? 'bg-green-500/10' : 'bg-green-50'
                }`}>
                  <h4 className={`font-medium mb-1 ${
                    isDarkTheme ? 'text-white' : 'text-slate-900'
                  }`}>
                    File Coordination
                  </h4>
                  <p className={`text-xs ${
                    isDarkTheme ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    File locks are automatic, but use AI predictions to avoid conflicts
                  </p>
                </div>
                <div className={`p-4 rounded-lg border-l-4 border-purple-400 ${
                  isDarkTheme ? 'bg-purple-500/10' : 'bg-purple-50'
                }`}>
                  <h4 className={`font-medium mb-1 ${
                    isDarkTheme ? 'text-white' : 'text-slate-900'
                  }`}>
                    Context Sharing
                  </h4>
                  <p className={`text-xs ${
                    isDarkTheme ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    Set shared variables with <code>/context</code> for project coordination
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default APIDocumentation;