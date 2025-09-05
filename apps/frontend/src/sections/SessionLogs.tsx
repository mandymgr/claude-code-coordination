import React, { useState } from 'react';
import { 
  HiOutlineDocumentText,
  HiOutlineChartBarSquare,
  HiOutlineDocumentArrowDown,
  HiOutlineTrash,
  HiOutlineCalendarDays,
  HiOutlineChatBubbleLeftEllipsis,
  HiOutlineCommandLine,
  HiOutlineDocumentDuplicate,
  HiOutlineEye
} from 'react-icons/hi2';

interface SessionLogsProps {
  isDarkTheme: boolean;
}

const SessionLogs: React.FC<SessionLogsProps> = ({ isDarkTheme }) => {
  const [logs, setLogs] = useState<any>(null);
  const [report, setReport] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<'summary' | 'report' | 'export' | 'demo'>('demo');

  // Demo data for visualization
  const demoSessionData = {
    totalSessions: 12,
    totalInteractions: 47,
    topTopics: [
      ['react', 8],
      ['typescript', 6],
      ['coordination', 5],
      ['ai', 4],
      ['deployment', 3]
    ],
    commandsUsed: [
      ['magic init', 5],
      ['magic ai', 12],
      ['magic deploy', 3],
      ['magic logs', 2]
    ],
    filesCreated: 23,
    recentActivity: [
      {
        timestamp: '2025-08-23T10:30:00Z',
        userMessage: 'Create a comprehensive logging system for our magic CLI...',
        responseType: 'code-generation'
      },
      {
        timestamp: '2025-08-23T10:15:00Z',
        userMessage: 'Integrate conversation logger into React dashboard',
        responseType: 'ai-assistance'
      },
      {
        timestamp: '2025-08-23T10:00:00Z',
        userMessage: 'Build universal project detection system',
        responseType: 'magic-system'
      }
    ]
  };

  const loadSessionSummary = async (days: number = 7) => {
    setLoading(true);
    try {
      // Simulate API call to conversation logger
      // In real implementation, would filter by `days` parameter
      console.log(`Loading summary for last ${days} days`);
      setTimeout(() => {
        setLogs({
          '2025-08-23': {
            date: '2025-08-23',
            interactions: demoSessionData.recentActivity,
            keyTopics: ['magic-system', 'logging', 'react-dashboard'],
            filesCreated: ['SessionLogs.tsx', 'conversation-logger.js'],
            commandsUsed: ['magic logs', 'magic init']
          }
        });
        setLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Failed to load session summary:', error);
      setLoading(false);
    }
  };

  const generateReport = async () => {
    setLoading(true);
    try {
      setTimeout(() => {
        setReport(demoSessionData);
        setLoading(false);
      }, 800);
    } catch (error) {
      console.error('Failed to generate report:', error);
      setLoading(false);
    }
  };

  const exportLogs = (format: 'markdown' | 'json') => {
    console.log(`🪄 Exporting logs in ${format} format...`);
    // This would call the conversation logger export functionality
    alert(`Logs would be exported in ${format} format to .claude-coordination/conversation-logs/exports/`);
  };

  const cleanOldLogs = (days: number = 30) => {
    console.log(`🪄 Cleaning logs older than ${days} days...`);
    alert(`Would clean logs older than ${days} days`);
  };

  return (
    <div className="space-y-8">
      <div>
        <h2 className={`text-2xl font-bold mb-4 ${isDarkTheme ? 'text-white' : 'text-slate-900'}`}>
          📝 Session Logs & Conversation History
        </h2>
        <p className={`text-sm ${isDarkTheme ? 'text-slate-400' : 'text-slate-600'} mb-6 leading-relaxed`}>
          Comprehensive logging system that tracks all magic CLI commands, conversations, and session continuity.
          Perfect for maintaining context across multiple development sessions and terminals.
        </p>
      </div>

      {/* Tab Navigation */}
      <div className="flex flex-wrap gap-1 mb-6">
        {[
          { id: 'demo', label: 'Live Demo', icon: HiOutlineEye },
          { id: 'summary', label: 'Session Summary', icon: HiOutlineDocumentText },
          { id: 'report', label: 'Analytics Report', icon: HiOutlineChartBarSquare },
          { id: 'export', label: 'Export & Clean', icon: HiOutlineDocumentArrowDown }
        ].map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as any)}
            className={`flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab.id
                ? isDarkTheme
                  ? 'bg-blue-600/20 text-blue-400 border border-blue-600/30'
                  : 'bg-blue-50 text-blue-700 border border-blue-200'
                : isDarkTheme
                  ? 'text-slate-400 hover:text-white hover:bg-slate-700/50'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <tab.icon className="w-4 h-4" />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Demo Tab */}
      {activeTab === 'demo' && (
        <div className="space-y-6">
          <div className={`rounded-lg border p-6 ${isDarkTheme ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
            <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDarkTheme ? 'text-white' : 'text-slate-900'}`}>
              <HiOutlineCommandLine className="w-5 h-5 text-purple-500" />
              Magic CLI Integration
            </h3>
            <div className={`bg-slate-900 rounded-lg p-4 font-mono text-sm text-green-400 mb-4`}>
              <div className="space-y-1">
                <div># Automatic logging of all magic commands:</div>
                <div className="text-blue-400">magic init</div>
                <div className="text-slate-500">🪄 Initializing magic environment... [LOGGED]</div>
                <div className="text-blue-400">magic ai "optimize React component"</div>
                <div className="text-slate-500">🧠 AI assistance provided... [LOGGED]</div>
                <div className="text-blue-400">magic logs summary</div>
                <div className="text-slate-500">📊 Showing session summary... [LOGGED]</div>
              </div>
            </div>
            <p className={`text-sm ${isDarkTheme ? 'text-slate-400' : 'text-slate-600'}`}>
              Every magic command is automatically logged with context, results, and performance metrics.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-6">
            <div className={`rounded-lg border p-6 ${isDarkTheme ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
              <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDarkTheme ? 'text-white' : 'text-slate-900'}`}>
                <HiOutlineChartBarSquare className="w-5 h-5 text-green-500" />
                Session Analytics
              </h3>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className={isDarkTheme ? 'text-slate-400' : 'text-slate-600'}>Total Sessions:</span>
                  <span className={`font-semibold ${isDarkTheme ? 'text-white' : 'text-slate-900'}`}>12</span>
                </div>
                <div className="flex justify-between">
                  <span className={isDarkTheme ? 'text-slate-400' : 'text-slate-600'}>Interactions:</span>
                  <span className={`font-semibold ${isDarkTheme ? 'text-white' : 'text-slate-900'}`}>47</span>
                </div>
                <div className="flex justify-between">
                  <span className={isDarkTheme ? 'text-slate-400' : 'text-slate-600'}>Files Created:</span>
                  <span className={`font-semibold ${isDarkTheme ? 'text-white' : 'text-slate-900'}`}>23</span>
                </div>
              </div>
            </div>

            <div className={`rounded-lg border p-6 ${isDarkTheme ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
              <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDarkTheme ? 'text-white' : 'text-slate-900'}`}>
                <HiOutlineChatBubbleLeftEllipsis className="w-5 h-5 text-blue-500" />
                Top Topics
              </h3>
              <div className="space-y-2">
                {demoSessionData.topTopics.slice(0, 4).map(([topic, count]) => (
                  <div key={topic} className="flex items-center justify-between">
                    <span className={`text-sm ${isDarkTheme ? 'text-slate-400' : 'text-slate-600'}`}>{topic}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      isDarkTheme ? 'bg-blue-600/20 text-blue-400' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {count}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Session Summary Tab */}
      {activeTab === 'summary' && (
        <div className="space-y-6">
          <div className="flex flex-wrap gap-3 mb-6">
            {[7, 14, 30].map((days) => (
              <button
                key={days}
                onClick={() => loadSessionSummary(days)}
                disabled={loading}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  loading
                    ? isDarkTheme
                      ? 'bg-slate-700/50 text-slate-500 cursor-not-allowed'
                      : 'bg-slate-200/50 text-slate-400 cursor-not-allowed'
                    : isDarkTheme
                      ? 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border border-blue-600/30'
                      : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
                }`}
              >
                <HiOutlineCalendarDays className="w-4 h-4 inline mr-2" />
                Last {days} days
              </button>
            ))}
          </div>

          {loading && (
            <div className={`text-center py-8 ${isDarkTheme ? 'text-slate-400' : 'text-slate-600'}`}>
              <div className="animate-spin w-6 h-6 border-2 border-current border-t-transparent rounded-full mx-auto mb-2"></div>
              Loading session summary...
            </div>
          )}

          {logs && (
            <div className="space-y-4">
              {Object.entries(logs).map(([date, session]: [string, any]) => (
                <div key={date} className={`rounded-lg border p-6 ${isDarkTheme ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
                  <h3 className={`text-lg font-semibold mb-4 ${isDarkTheme ? 'text-white' : 'text-slate-900'}`}>
                    📅 {date}
                  </h3>
                  <div className="grid md:grid-cols-3 gap-4 mb-4">
                    <div>
                      <div className={`text-sm font-medium mb-2 ${isDarkTheme ? 'text-slate-300' : 'text-slate-700'}`}>Key Topics</div>
                      <div className="flex flex-wrap gap-1">
                        {session.keyTopics?.map((topic: string) => (
                          <span key={topic} className={`px-2 py-1 rounded-full text-xs ${
                            isDarkTheme ? 'bg-purple-600/20 text-purple-400' : 'bg-purple-100 text-purple-700'
                          }`}>
                            {topic}
                          </span>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className={`text-sm font-medium mb-2 ${isDarkTheme ? 'text-slate-300' : 'text-slate-700'}`}>Files Created</div>
                      <div className="space-y-1">
                        {session.filesCreated?.map((file: string) => (
                          <div key={file} className={`text-xs font-mono ${isDarkTheme ? 'text-slate-400' : 'text-slate-600'}`}>
                            {file}
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <div className={`text-sm font-medium mb-2 ${isDarkTheme ? 'text-slate-300' : 'text-slate-700'}`}>Commands Used</div>
                      <div className="space-y-1">
                        {session.commandsUsed?.map((cmd: string) => (
                          <div key={cmd} className={`text-xs font-mono ${isDarkTheme ? 'text-slate-400' : 'text-slate-600'}`}>
                            {cmd}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className={`text-sm font-medium mb-2 ${isDarkTheme ? 'text-slate-300' : 'text-slate-700'}`}>
                      Recent Interactions ({session.interactions?.length || 0})
                    </div>
                    <div className="space-y-2">
                      {session.interactions?.slice(0, 2).map((interaction: any, idx: number) => (
                        <div key={idx} className={`text-sm p-3 rounded-lg ${
                          isDarkTheme ? 'bg-slate-700/30' : 'bg-slate-50'
                        }`}>
                          <div className={`font-medium mb-1 ${isDarkTheme ? 'text-white' : 'text-slate-900'}`}>
                            {interaction.userMessage}
                          </div>
                          <div className={`text-xs ${isDarkTheme ? 'text-slate-400' : 'text-slate-600'}`}>
                            {new Date(interaction.timestamp).toLocaleString()} • {interaction.responseType}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Analytics Report Tab */}
      {activeTab === 'report' && (
        <div className="space-y-6">
          <button
            onClick={generateReport}
            disabled={loading}
            className={`px-6 py-3 rounded-lg font-medium transition-all ${
              loading
                ? isDarkTheme
                  ? 'bg-slate-700/50 text-slate-500 cursor-not-allowed'
                  : 'bg-slate-200/50 text-slate-400 cursor-not-allowed'
                : isDarkTheme
                  ? 'bg-green-600/20 text-green-400 hover:bg-green-600/30 border border-green-600/30'
                  : 'bg-green-50 text-green-700 hover:bg-green-100 border border-green-200'
            }`}
          >
            <HiOutlineChartBarSquare className="w-5 h-5 inline mr-2" />
            {loading ? 'Generating Report...' : 'Generate Comprehensive Report'}
          </button>

          {report && (
            <div className="grid md:grid-cols-2 gap-6">
              <div className={`rounded-lg border p-6 ${isDarkTheme ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
                <h3 className={`text-lg font-semibold mb-4 ${isDarkTheme ? 'text-white' : 'text-slate-900'}`}>
                  📊 Session Overview
                </h3>
                <div className="space-y-4">
                  <div className="flex justify-between items-center">
                    <span className={isDarkTheme ? 'text-slate-400' : 'text-slate-600'}>Total Sessions</span>
                    <span className={`text-xl font-bold ${isDarkTheme ? 'text-green-400' : 'text-green-600'}`}>
                      {report.totalSessions}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={isDarkTheme ? 'text-slate-400' : 'text-slate-600'}>Total Interactions</span>
                    <span className={`text-xl font-bold ${isDarkTheme ? 'text-blue-400' : 'text-blue-600'}`}>
                      {report.totalInteractions}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className={isDarkTheme ? 'text-slate-400' : 'text-slate-600'}>Files Created</span>
                    <span className={`text-xl font-bold ${isDarkTheme ? 'text-purple-400' : 'text-purple-600'}`}>
                      {report.filesCreated}
                    </span>
                  </div>
                </div>
              </div>

              <div className={`rounded-lg border p-6 ${isDarkTheme ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
                <h3 className={`text-lg font-semibold mb-4 ${isDarkTheme ? 'text-white' : 'text-slate-900'}`}>
                  🏆 Most Used Commands
                </h3>
                <div className="space-y-3">
                  {report.commandsUsed?.slice(0, 5).map(([command, count]: [string, number]) => (
                    <div key={command} className="flex items-center justify-between">
                      <span className={`font-mono text-sm ${isDarkTheme ? 'text-slate-400' : 'text-slate-600'}`}>
                        {command}
                      </span>
                      <div className="flex items-center gap-2">
                        <div className={`h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full`} 
                             style={{ width: `${(count / Math.max(...report.commandsUsed.map(([,c]: [string, number]) => c))) * 60}px` }}>
                        </div>
                        <span className={`text-sm font-medium ${isDarkTheme ? 'text-white' : 'text-slate-900'}`}>
                          {count}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Export & Clean Tab */}
      {activeTab === 'export' && (
        <div className="space-y-6">
          <div className="grid md:grid-cols-2 gap-6">
            <div className={`rounded-lg border p-6 ${isDarkTheme ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
              <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDarkTheme ? 'text-white' : 'text-slate-900'}`}>
                <HiOutlineDocumentArrowDown className="w-5 h-5 text-green-500" />
                Export Session Logs
              </h3>
              <p className={`text-sm mb-4 ${isDarkTheme ? 'text-slate-400' : 'text-slate-600'}`}>
                Export your conversation logs for sharing, backup, or analysis.
              </p>
              <div className="space-y-3">
                <button
                  onClick={() => exportLogs('markdown')}
                  className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isDarkTheme
                      ? 'bg-blue-600/20 text-blue-400 hover:bg-blue-600/30 border border-blue-600/30'
                      : 'bg-blue-50 text-blue-700 hover:bg-blue-100 border border-blue-200'
                  }`}
                >
                  <HiOutlineDocumentDuplicate className="w-4 h-4 inline mr-2" />
                  Export as Markdown
                </button>
                <button
                  onClick={() => exportLogs('json')}
                  className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                    isDarkTheme
                      ? 'bg-purple-600/20 text-purple-400 hover:bg-purple-600/30 border border-purple-600/30'
                      : 'bg-purple-50 text-purple-700 hover:bg-purple-100 border border-purple-200'
                  }`}
                >
                  <HiOutlineDocumentDuplicate className="w-4 h-4 inline mr-2" />
                  Export as JSON
                </button>
              </div>
            </div>

            <div className={`rounded-lg border p-6 ${isDarkTheme ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
              <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDarkTheme ? 'text-white' : 'text-slate-900'}`}>
                <HiOutlineTrash className="w-5 h-5 text-red-500" />
                Clean Old Logs
              </h3>
              <p className={`text-sm mb-4 ${isDarkTheme ? 'text-slate-400' : 'text-slate-600'}`}>
                Remove old session logs to save disk space and improve performance.
              </p>
              <div className="space-y-3">
                {[30, 60, 90].map((days) => (
                  <button
                    key={days}
                    onClick={() => cleanOldLogs(days)}
                    className={`w-full px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                      isDarkTheme
                        ? 'bg-red-600/20 text-red-400 hover:bg-red-600/30 border border-red-600/30'
                        : 'bg-red-50 text-red-700 hover:bg-red-100 border border-red-200'
                    }`}
                  >
                    <HiOutlineTrash className="w-4 h-4 inline mr-2" />
                    Clean logs older than {days} days
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className={`rounded-lg border p-6 ${isDarkTheme ? 'bg-slate-800/50 border-slate-700' : 'bg-white border-slate-200'}`}>
            <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${isDarkTheme ? 'text-white' : 'text-slate-900'}`}>
              <HiOutlineCommandLine className="w-5 h-5 text-blue-500" />
              CLI Commands
            </h3>
            <div className="space-y-4">
              <div>
                <h4 className={`text-sm font-medium mb-2 ${isDarkTheme ? 'text-slate-300' : 'text-slate-700'}`}>Available Commands:</h4>
                <div className={`bg-slate-900 rounded-lg p-4 font-mono text-sm space-y-1`}>
                  <div className="text-green-400">magic logs summary [days]</div>
                  <div className="text-slate-500"># Show session summary for last N days</div>
                  <div className="text-green-400">magic logs report</div>
                  <div className="text-slate-500"># Generate comprehensive analytics report</div>
                  <div className="text-green-400">magic logs export [markdown|json]</div>
                  <div className="text-slate-500"># Export logs in specified format</div>
                  <div className="text-green-400">magic logs clean [days]</div>
                  <div className="text-slate-500"># Clean logs older than N days</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SessionLogs;