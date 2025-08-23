import React, { useState, useEffect } from 'react';
import { 
  HiGlobeAlt,
  HiSignal,
  HiUsers,
  HiChatBubbleLeftRight,
  HiMicrophone,
  HiVideoCamera,
  HiCodeBracket,
  HiPlay,
  HiPause,
  HiSpeakerWave,
  HiWifi,
  HiLockClosed
} from 'react-icons/hi2';

interface RealtimeHubProps {
  isDarkTheme: boolean;
}

const RealtimeHub: React.FC<RealtimeHubProps> = ({ isDarkTheme }) => {
  const [connectionStatus] = useState<'connected' | 'connecting' | 'disconnected'>('connected');
  const [activeConnections, setActiveConnections] = useState(4);
  const [isLiveDemo, setIsLiveDemo] = useState(false);

  const hubFeatures = [
    {
      icon: HiWifi,
      title: 'WebSocket Infrastructure',
      description: 'High-performance WebSocket server with automatic reconnection and load balancing.',
      status: 'Active',
      metrics: ['99.9% uptime', 'Sub-50ms latency', '1000+ concurrent connections']
    },
    {
      icon: HiUsers,
      title: 'Room Management',
      description: 'Dynamic room creation with role-based permissions and collaborative workspaces.',
      status: 'Running',
      metrics: ['Auto room creation', 'Role-based access', 'Session persistence']
    },
    {
      icon: HiCodeBracket,
      title: 'Live Code Sharing',
      description: 'Real-time code synchronization with operational transforms and conflict resolution.',
      status: 'Synchronized',
      metrics: ['Real-time sync', 'Conflict resolution', 'Version control']
    },
    {
      icon: HiMicrophone,
      title: 'Voice Coordination',
      description: 'Integrated voice chat with noise cancellation and automatic transcription.',
      status: 'Ready',
      metrics: ['HD voice quality', 'Noise cancellation', 'Auto transcription']
    }
  ];

  const liveActivities = [
    { user: 'Claude#1', action: 'editing auth/login.tsx', timestamp: '2s ago', status: 'active' },
    { user: 'Claude#2', action: 'reviewing database schema', timestamp: '5s ago', status: 'idle' },
    { user: 'Claude#3', action: 'running tests', timestamp: '12s ago', status: 'busy' },
    { user: 'Claude#4', action: 'updating documentation', timestamp: '30s ago', status: 'active' }
  ];

  const networkMetrics = [
    { label: 'Latency', value: '23ms', color: 'green', trend: 'stable' },
    { label: 'Throughput', value: '2.4MB/s', color: 'blue', trend: 'up' },
    { label: 'Active Sessions', value: activeConnections.toString(), color: 'purple', trend: 'stable' },
    { label: 'Success Rate', value: '99.8%', color: 'orange', trend: 'up' }
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setActiveConnections(prev => prev + Math.floor(Math.random() * 3) - 1);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <section id="realtime-hub" className="p-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 coordination-accent rounded-2xl flex items-center justify-center relative">
              <HiGlobeAlt className="w-8 h-8 text-white" />
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
            </div>
          </div>
          
          <h1 className={`text-4xl font-bold mb-6 ${
            isDarkTheme ? 'text-white' : 'text-slate-900'
          }`}>
            Real-time Coordination Hub
          </h1>
          
          <p className={`text-lg leading-relaxed max-w-3xl mx-auto ${
            isDarkTheme ? 'text-slate-300' : 'text-slate-600'
          }`}>
            WebSocket-powered live collaboration system enabling instant synchronization, 
            voice coordination, and real-time code sharing across multiple Claude Code terminals.
          </p>
        </div>

        {/* Connection Status */}
        <div className="coordination-card p-6 mb-12">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <HiSignal className={`w-6 h-6 ${
                connectionStatus === 'connected' ? 'text-green-400' :
                connectionStatus === 'connecting' ? 'text-yellow-400' :
                'text-red-400'
              }`} />
              <h3 className={`text-xl font-semibold ${
                isDarkTheme ? 'text-white' : 'text-slate-900'
              }`}>
                Hub Status: {connectionStatus.charAt(0).toUpperCase() + connectionStatus.slice(1)}
              </h3>
            </div>
            <div className="flex items-center gap-2">
              <div className={`w-3 h-3 rounded-full ${
                connectionStatus === 'connected' ? 'bg-green-400 animate-pulse' :
                connectionStatus === 'connecting' ? 'bg-yellow-400 animate-pulse' :
                'bg-red-400'
              }`}></div>
              <span className={`text-sm ${
                isDarkTheme ? 'text-slate-400' : 'text-slate-600'
              }`}>
                {activeConnections} active sessions
              </span>
            </div>
          </div>

          {/* Network Metrics */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {networkMetrics.map((metric, index) => (
              <div key={index} className={`p-4 rounded-lg ${
                isDarkTheme ? 'bg-slate-800/50' : 'bg-slate-50'
              }`}>
                <div className={`text-lg font-bold mb-1 ${
                  metric.color === 'green' ? 'text-green-400' :
                  metric.color === 'blue' ? 'text-blue-400' :
                  metric.color === 'purple' ? 'text-purple-400' :
                  'text-orange-400'
                }`}>
                  {metric.value}
                </div>
                <div className={`text-sm ${
                  isDarkTheme ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  {metric.label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Hub Features */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-12">
          {hubFeatures.map((feature, index) => (
            <div key={index} className="coordination-card p-6">
              <div className="flex items-start gap-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  isDarkTheme ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'
                }`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <h3 className={`text-lg font-semibold ${
                      isDarkTheme ? 'text-white' : 'text-slate-900'
                    }`}>
                      {feature.title}
                    </h3>
                    <span className={`text-xs px-2 py-1 rounded-full ${
                      isDarkTheme ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'
                    }`}>
                      {feature.status}
                    </span>
                  </div>
                  
                  <p className={`text-sm mb-3 ${
                    isDarkTheme ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    {feature.description}
                  </p>

                  <div className="flex flex-wrap gap-2">
                    {feature.metrics.map((metric, metricIndex) => (
                      <span 
                        key={metricIndex}
                        className={`text-xs px-2 py-1 rounded-full ${
                          isDarkTheme 
                            ? 'bg-slate-700/50 text-slate-300' 
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {metric}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Live Activity Feed */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
          <div className="coordination-card p-6">
            <div className="flex items-center justify-between mb-6">
              <h3 className={`text-xl font-semibold ${
                isDarkTheme ? 'text-white' : 'text-slate-900'
              }`}>
                Live Activity Feed
              </h3>
              <button
                onClick={() => setIsLiveDemo(!isLiveDemo)}
                className={`flex items-center gap-2 px-3 py-1 rounded-lg transition-colors ${
                  isDarkTheme 
                    ? 'hover:bg-slate-700/50 text-slate-300' 
                    : 'hover:bg-slate-200/50 text-slate-700'
                }`}
              >
                {isLiveDemo ? <HiPause className="w-4 h-4" /> : <HiPlay className="w-4 h-4" />}
                <span className="text-sm">{isLiveDemo ? 'Pause' : 'Live'}</span>
              </button>
            </div>

            <div className="space-y-3">
              {liveActivities.map((activity, index) => (
                <div key={index} className={`flex items-center gap-3 p-3 rounded-lg ${
                  isDarkTheme ? 'bg-slate-800/50' : 'bg-slate-50'
                }`}>
                  <div className={`w-3 h-3 rounded-full ${
                    activity.status === 'active' ? 'bg-green-400 animate-pulse' :
                    activity.status === 'busy' ? 'bg-orange-400 animate-pulse' :
                    'bg-slate-400'
                  }`}></div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className={`font-medium ${
                        isDarkTheme ? 'text-white' : 'text-slate-900'
                      }`}>
                        {activity.user}
                      </span>
                      <span className={`text-xs ${
                        isDarkTheme ? 'text-slate-500' : 'text-slate-500'
                      }`}>
                        {activity.timestamp}
                      </span>
                    </div>
                    <div className={`text-sm ${
                      isDarkTheme ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      {activity.action}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Voice Coordination Panel */}
          <div className="coordination-card p-6">
            <h3 className={`text-xl font-semibold mb-6 ${
              isDarkTheme ? 'text-white' : 'text-slate-900'
            }`}>
              Voice Coordination
            </h3>

            <div className="space-y-4">
              <div className={`flex items-center justify-between p-4 rounded-lg ${
                isDarkTheme ? 'bg-slate-800/50' : 'bg-slate-50'
              }`}>
                <div className="flex items-center gap-3">
                  <HiMicrophone className="w-5 h-5 text-green-400" />
                  <span className={`font-medium ${
                    isDarkTheme ? 'text-white' : 'text-slate-900'
                  }`}>
                    Voice Channel #1
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <HiSpeakerWave className="w-4 h-4 text-blue-400" />
                  <span className={`text-sm ${
                    isDarkTheme ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    2 connected
                  </span>
                </div>
              </div>

              <div className={`flex items-center justify-between p-4 rounded-lg ${
                isDarkTheme ? 'bg-slate-800/50' : 'bg-slate-50'
              }`}>
                <div className="flex items-center gap-3">
                  <HiVideoCamera className="w-5 h-5 text-purple-400" />
                  <span className={`font-medium ${
                    isDarkTheme ? 'text-white' : 'text-slate-900'
                  }`}>
                    Screen Share
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <HiLockClosed className="w-4 h-4 text-orange-400" />
                  <span className={`text-sm ${
                    isDarkTheme ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    Encrypted
                  </span>
                </div>
              </div>

              <div className={`p-4 rounded-lg border-2 border-dashed ${
                isDarkTheme ? 'border-slate-600 bg-slate-800/30' : 'border-slate-300 bg-slate-50/50'
              }`}>
                <div className="text-center">
                  <HiChatBubbleLeftRight className={`w-8 h-8 mx-auto mb-2 ${
                    isDarkTheme ? 'text-slate-500' : 'text-slate-400'
                  }`} />
                  <p className={`text-sm ${
                    isDarkTheme ? 'text-slate-500' : 'text-slate-500'
                  }`}>
                    Join voice channel to start collaborating
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Technical Architecture */}
        <div className="coordination-card p-8">
          <h2 className={`text-2xl font-bold mb-6 ${
            isDarkTheme ? 'text-white' : 'text-slate-900'
          }`}>
            Technical Architecture
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className={`text-lg font-semibold mb-4 ${
                isDarkTheme ? 'text-white' : 'text-slate-900'
              }`}>
                WebSocket Server
              </h3>
              <ul className="space-y-2">
                <li className={`text-sm flex items-start gap-2 ${
                  isDarkTheme ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  <span className="text-blue-400">•</span>
                  <span>Node.js WebSocket server with Socket.IO</span>
                </li>
                <li className={`text-sm flex items-start gap-2 ${
                  isDarkTheme ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  <span className="text-blue-400">•</span>
                  <span>Redis adapter for scaling across instances</span>
                </li>
                <li className={`text-sm flex items-start gap-2 ${
                  isDarkTheme ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  <span className="text-blue-400">•</span>
                  <span>Automatic reconnection with exponential backoff</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className={`text-lg font-semibold mb-4 ${
                isDarkTheme ? 'text-white' : 'text-slate-900'
              }`}>
                Message Protocol
              </h3>
              <ul className="space-y-2">
                <li className={`text-sm flex items-start gap-2 ${
                  isDarkTheme ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  <span className="text-green-400">•</span>
                  <span>Binary protocol for code synchronization</span>
                </li>
                <li className={`text-sm flex items-start gap-2 ${
                  isDarkTheme ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  <span className="text-green-400">•</span>
                  <span>Operational transforms for conflict resolution</span>
                </li>
                <li className={`text-sm flex items-start gap-2 ${
                  isDarkTheme ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  <span className="text-green-400">•</span>
                  <span>Message ordering and delivery guarantees</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className={`text-lg font-semibold mb-4 ${
                isDarkTheme ? 'text-white' : 'text-slate-900'
              }`}>
                Security & Performance
              </h3>
              <ul className="space-y-2">
                <li className={`text-sm flex items-start gap-2 ${
                  isDarkTheme ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  <span className="text-purple-400">•</span>
                  <span>End-to-end encryption for sensitive data</span>
                </li>
                <li className={`text-sm flex items-start gap-2 ${
                  isDarkTheme ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  <span className="text-purple-400">•</span>
                  <span>Rate limiting and DDoS protection</span>
                </li>
                <li className={`text-sm flex items-start gap-2 ${
                  isDarkTheme ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  <span className="text-purple-400">•</span>
                  <span>Connection pooling and load balancing</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default RealtimeHub;