import React from 'react';
import { 
  HiOutlineShieldCheck,
  HiCommandLine,
  HiUsers,
  HiSignal,
  HiChatBubbleLeftRight,
  HiClock
} from 'react-icons/hi2';

interface SessionCoordinationProps {
  isDarkTheme: boolean;
}

const SessionCoordination: React.FC<SessionCoordinationProps> = ({ isDarkTheme }) => {
  const activeSessions = [
    {
      id: 'session-1',
      name: 'Claude#1',
      status: 'active',
      terminal: '/Users/dev/helseriet-backend',
      lastActivity: '2s ago',
      currentTask: 'Implementing user authentication',
      uptime: '2h 15m'
    },
    {
      id: 'session-2', 
      name: 'Claude#2',
      status: 'idle',
      terminal: '/Users/dev/helseriet-frontend',
      lastActivity: '5m ago',
      currentTask: 'Code review and optimization',
      uptime: '1h 45m'
    },
    {
      id: 'session-3',
      name: 'Claude#3',
      status: 'busy',
      terminal: '/Users/dev/shared-types',
      lastActivity: '30s ago',
      currentTask: 'Type definition updates',
      uptime: '3h 02m'
    }
  ];

  return (
    <section id="session-coordination" className="p-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 coordination-accent rounded-2xl flex items-center justify-center">
              <HiOutlineShieldCheck className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h1 className={`text-4xl font-bold mb-6 ${
            isDarkTheme ? 'text-white' : 'text-slate-900'
          }`}>
            Session Coordination
          </h1>
          
          <p className={`text-lg leading-relaxed max-w-3xl mx-auto ${
            isDarkTheme ? 'text-slate-300' : 'text-slate-600'
          }`}>
            Multi-terminal session management with inter-session messaging, context sharing, 
            and coordinated task execution across all active Claude Code instances.
          </p>
        </div>

        {/* Active Sessions */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-12">
          {activeSessions.map((session) => (
            <div key={session.id} className="coordination-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <HiCommandLine className={`w-5 h-5 ${
                    session.status === 'active' ? 'text-green-400' :
                    session.status === 'busy' ? 'text-orange-400' :
                    'text-slate-400'
                  }`} />
                  <h3 className={`text-lg font-semibold ${
                    isDarkTheme ? 'text-white' : 'text-slate-900'
                  }`}>
                    {session.name}
                  </h3>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  session.status === 'active' 
                    ? isDarkTheme ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'
                    : session.status === 'busy'
                    ? isDarkTheme ? 'bg-orange-500/20 text-orange-400' : 'bg-orange-100 text-orange-700'
                    : isDarkTheme ? 'bg-slate-500/20 text-slate-400' : 'bg-slate-100 text-slate-600'
                }`}>
                  {session.status}
                </span>
              </div>
              
              <div className={`text-sm space-y-2 ${
                isDarkTheme ? 'text-slate-400' : 'text-slate-600'
              }`}>
                <div>
                  <span className="font-medium">Terminal:</span>
                  <div className="font-mono text-xs mt-1 break-all">{session.terminal}</div>
                </div>
                <div>
                  <span className="font-medium">Current Task:</span>
                  <div className="mt-1">{session.currentTask}</div>
                </div>
                <div className="flex justify-between">
                  <span>Uptime: {session.uptime}</span>
                  <span>Last: {session.lastActivity}</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Coordination Features */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          <div className="coordination-card p-6">
            <h3 className={`text-xl font-semibold mb-6 flex items-center gap-3 ${
              isDarkTheme ? 'text-white' : 'text-slate-900'
            }`}>
              <HiChatBubbleLeftRight className="w-6 h-6 text-blue-400" />
              Inter-Session Messaging
            </h3>

            <div className="space-y-4">
              <div className={`p-4 rounded-lg ${
                isDarkTheme ? 'bg-slate-800/50' : 'bg-slate-50'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-medium ${
                    isDarkTheme ? 'text-white' : 'text-slate-900'
                  }`}>
                    Claude#1 → All
                  </span>
                  <span className={`text-xs ${
                    isDarkTheme ? 'text-slate-500' : 'text-slate-500'
                  }`}>
                    2m ago
                  </span>
                </div>
                <p className={`text-sm ${
                  isDarkTheme ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  Auth system complete. Ready for frontend integration testing.
                </p>
              </div>

              <div className={`p-4 rounded-lg ${
                isDarkTheme ? 'bg-slate-800/50' : 'bg-slate-50'
              }`}>
                <div className="flex items-center justify-between mb-2">
                  <span className={`font-medium ${
                    isDarkTheme ? 'text-white' : 'text-slate-900'
                  }`}>
                    Claude#3 → Claude#1
                  </span>
                  <span className={`text-xs ${
                    isDarkTheme ? 'text-slate-500' : 'text-slate-500'
                  }`}>
                    5m ago
                  </span>
                </div>
                <p className={`text-sm ${
                  isDarkTheme ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  Updated shared types for auth responses. Please rebuild.
                </p>
              </div>

              <div className={`p-3 rounded-lg border-2 border-dashed ${
                isDarkTheme ? 'border-slate-600' : 'border-slate-300'
              }`}>
                <div className="flex items-center gap-3">
                  <input 
                    type="text" 
                    placeholder="Send message to all sessions..."
                    className={`flex-1 bg-transparent text-sm placeholder-slate-500 focus:outline-none ${
                      isDarkTheme ? 'text-white' : 'text-slate-900'
                    }`}
                  />
                  <button className="coordination-accent text-white px-4 py-2 rounded text-sm">
                    Send
                  </button>
                </div>
              </div>
            </div>
          </div>

          <div className="coordination-card p-6">
            <h3 className={`text-xl font-semibold mb-6 flex items-center gap-3 ${
              isDarkTheme ? 'text-white' : 'text-slate-900'
            }`}>
              <HiCommandLine className="w-6 h-6 text-green-400" />
              Coordination Commands
            </h3>

            <div className="space-y-3">
              {[
                { command: '/sessions', description: 'List all active Claude sessions' },
                { command: '/broadcast <msg>', description: 'Send message to all sessions' },
                { command: '/status', description: 'Show project coordination status' },
                { command: '/context key=value', description: 'Set shared project context' },
                { command: '/task <description>', description: 'Set current session task' },
                { command: '/cleanup', description: 'Clean up inactive sessions' }
              ].map((cmd, index) => (
                <div key={index} className={`p-3 rounded-lg ${
                  isDarkTheme ? 'bg-slate-800/50' : 'bg-slate-50'
                }`}>
                  <div className="flex items-start gap-3">
                    <code className={`text-sm font-mono px-2 py-1 rounded ${
                      isDarkTheme ? 'bg-slate-700 text-green-400' : 'bg-slate-200 text-green-600'
                    }`}>
                      {cmd.command}
                    </code>
                    <p className={`text-sm flex-1 ${
                      isDarkTheme ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      {cmd.description}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Context Sharing */}
        <div className="coordination-card p-8 mb-12">
          <h2 className={`text-2xl font-bold mb-6 ${
            isDarkTheme ? 'text-white' : 'text-slate-900'
          }`}>
            Shared Project Context
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className={`text-lg font-semibold mb-4 ${
                isDarkTheme ? 'text-white' : 'text-slate-900'
              }`}>
                Current Context
              </h3>
              <div className="space-y-3">
                {[
                  { key: 'project_phase', value: 'MVP Development', updatedBy: 'Claude#1' },
                  { key: 'current_sprint', value: 'Authentication & UI', updatedBy: 'Claude#2' },
                  { key: 'next_milestone', value: 'Payment Integration', updatedBy: 'Claude#1' },
                  { key: 'blocker_status', value: 'None', updatedBy: 'System' }
                ].map((context, index) => (
                  <div key={index} className={`p-3 rounded-lg ${
                    isDarkTheme ? 'bg-slate-800/50' : 'bg-slate-50'
                  }`}>
                    <div className="flex items-center justify-between">
                      <div>
                        <code className={`text-sm font-mono ${
                          isDarkTheme ? 'text-blue-400' : 'text-blue-600'
                        }`}>
                          {context.key}
                        </code>
                        <span className={`ml-3 ${
                          isDarkTheme ? 'text-white' : 'text-slate-900'
                        }`}>
                          {context.value}
                        </span>
                      </div>
                      <span className={`text-xs ${
                        isDarkTheme ? 'text-slate-500' : 'text-slate-500'
                      }`}>
                        by {context.updatedBy}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className={`text-lg font-semibold mb-4 ${
                isDarkTheme ? 'text-white' : 'text-slate-900'
              }`}>
                Task Coordination
              </h3>
              
              <div className="space-y-3">
                <div className={`p-3 rounded-lg border-l-4 border-green-400 ${
                  isDarkTheme ? 'bg-green-500/10' : 'bg-green-50'
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`font-medium text-sm ${
                      isDarkTheme ? 'text-white' : 'text-slate-900'
                    }`}>
                      ✅ Authentication System
                    </span>
                    <span className="text-xs text-green-400">Claude#1</span>
                  </div>
                  <p className={`text-xs ${
                    isDarkTheme ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    Completed: User login, registration, JWT tokens
                  </p>
                </div>

                <div className={`p-3 rounded-lg border-l-4 border-blue-400 ${
                  isDarkTheme ? 'bg-blue-500/10' : 'bg-blue-50'
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`font-medium text-sm ${
                      isDarkTheme ? 'text-white' : 'text-slate-900'
                    }`}>
                      🔄 Frontend Integration
                    </span>
                    <span className="text-xs text-blue-400">Claude#2</span>
                  </div>
                  <p className={`text-xs ${
                    isDarkTheme ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    In progress: Login forms, protected routes
                  </p>
                </div>

                <div className={`p-3 rounded-lg border-l-4 border-orange-400 ${
                  isDarkTheme ? 'bg-orange-500/10' : 'bg-orange-50'
                }`}>
                  <div className="flex items-center justify-between mb-1">
                    <span className={`font-medium text-sm ${
                      isDarkTheme ? 'text-white' : 'text-slate-900'
                    }`}>
                      📋 Type Definitions
                    </span>
                    <span className="text-xs text-orange-400">Claude#3</span>
                  </div>
                  <p className={`text-xs ${
                    isDarkTheme ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    Pending: Update shared types for new auth flow
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Session Management */}
        <div className="coordination-card p-8">
          <h2 className={`text-2xl font-bold mb-6 ${
            isDarkTheme ? 'text-white' : 'text-slate-900'
          }`}>
            Session Management Features
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
                isDarkTheme ? 'text-white' : 'text-slate-900'
              }`}>
                <HiUsers className="w-5 h-5 text-blue-400" />
                Session Discovery
              </h3>
              <ul className="space-y-2">
                <li className={`text-sm flex items-start gap-2 ${
                  isDarkTheme ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  <span className="text-blue-400">•</span>
                  <span>Automatic session detection and registration</span>
                </li>
                <li className={`text-sm flex items-start gap-2 ${
                  isDarkTheme ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  <span className="text-blue-400">•</span>
                  <span>Real-time status monitoring and updates</span>
                </li>
                <li className={`text-sm flex items-start gap-2 ${
                  isDarkTheme ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  <span className="text-blue-400">•</span>
                  <span>Heartbeat mechanism for health checking</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
                isDarkTheme ? 'text-white' : 'text-slate-900'
              }`}>
                <HiSignal className="w-5 h-5 text-green-400" />
                Communication
              </h3>
              <ul className="space-y-2">
                <li className={`text-sm flex items-start gap-2 ${
                  isDarkTheme ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  <span className="text-green-400">•</span>
                  <span>Direct messaging between sessions</span>
                </li>
                <li className={`text-sm flex items-start gap-2 ${
                  isDarkTheme ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  <span className="text-green-400">•</span>
                  <span>Broadcast messaging to all active sessions</span>
                </li>
                <li className={`text-sm flex items-start gap-2 ${
                  isDarkTheme ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  <span className="text-green-400">•</span>
                  <span>Persistent message history and replay</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
                isDarkTheme ? 'text-white' : 'text-slate-900'
              }`}>
                <HiClock className="w-5 h-5 text-purple-400" />
                Lifecycle Management
              </h3>
              <ul className="space-y-2">
                <li className={`text-sm flex items-start gap-2 ${
                  isDarkTheme ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  <span className="text-purple-400">•</span>
                  <span>Automatic cleanup of inactive sessions</span>
                </li>
                <li className={`text-sm flex items-start gap-2 ${
                  isDarkTheme ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  <span className="text-purple-400">•</span>
                  <span>Session timeout configuration and management</span>
                </li>
                <li className={`text-sm flex items-start gap-2 ${
                  isDarkTheme ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  <span className="text-purple-400">•</span>
                  <span>Graceful shutdown and resource cleanup</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SessionCoordination;