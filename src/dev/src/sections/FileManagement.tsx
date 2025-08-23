import React, { useState } from 'react';
import { 
  HiOutlineArchiveBox,
  HiLockClosed,
  HiLockOpen,
  HiExclamationTriangle,
  HiClock,
  HiUsers,
  HiArrowPath,
  HiShieldCheck,
  HiDocumentText
} from 'react-icons/hi2';

interface FileManagementProps {
  isDarkTheme: boolean;
}

const FileManagement: React.FC<FileManagementProps> = ({ isDarkTheme }) => {
  const [selectedLock, setSelectedLock] = useState<string | null>(null);

  const activeLocks = [
    {
      id: 'lock-1',
      file: 'src/auth/login.tsx',
      user: 'Claude#1',
      status: 'active',
      duration: '5m 23s',
      type: 'write',
      conflicts: 0,
      lastActivity: '2s ago'
    },
    {
      id: 'lock-2', 
      file: 'shared-types/src/index.ts',
      user: 'Claude#2',
      status: 'pending',
      duration: '12s',
      type: 'read',
      conflicts: 1,
      lastActivity: '30s ago'
    },
    {
      id: 'lock-3',
      file: 'backend/src/controllers/auth.js',
      user: 'Claude#3',
      status: 'conflict',
      duration: '2m 45s',
      type: 'write',
      conflicts: 2,
      lastActivity: '5s ago'
    }
  ];

  const lockMetrics = [
    { label: 'Active Locks', value: '3', color: 'blue', change: '+1' },
    { label: 'Conflicts Resolved', value: '127', color: 'green', change: '+5' },
    { label: 'Auto-Release Rate', value: '94%', color: 'purple', change: '+2%' },
    { label: 'Avg Lock Duration', value: '3.2m', color: 'orange', change: '-0.5m' }
  ];

  const resolutionStrategies = [
    {
      name: 'Intelligent Merging',
      description: 'AI-powered three-way merge with semantic conflict resolution',
      successRate: '89%',
      icon: HiArrowPath,
      features: ['AST-based merging', 'Semantic analysis', 'Auto-conflict detection']
    },
    {
      name: 'Priority Queuing',
      description: 'Smart queuing system based on task priority and dependencies',
      successRate: '94%',
      icon: HiClock,
      features: ['Dependency analysis', 'Priority scoring', 'Fair scheduling']
    },
    {
      name: 'Collaborative Resolution', 
      description: 'Real-time collaboration tools for manual conflict resolution',
      successRate: '97%',
      icon: HiUsers,
      features: ['Live editing', 'Voice coordination', 'Visual diff tools']
    }
  ];


  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'active': return HiLockClosed;
      case 'pending': return HiClock;
      case 'conflict': return HiExclamationTriangle;
      default: return HiLockOpen;
    }
  };

  return (
    <section id="file-management" className="p-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 coordination-accent rounded-2xl flex items-center justify-center">
              <HiOutlineArchiveBox className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h1 className={`text-4xl font-bold mb-6 ${
            isDarkTheme ? 'text-white' : 'text-slate-900'
          }`}>
            Intelligent File Management
          </h1>
          
          <p className={`text-lg leading-relaxed max-w-3xl mx-auto ${
            isDarkTheme ? 'text-slate-300' : 'text-slate-600'
          }`}>
            Advanced file locking system with AI-powered conflict resolution, preventing edit conflicts 
            and ensuring seamless collaboration across multiple development sessions.
          </p>
        </div>

        {/* Lock Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-12">
          {lockMetrics.map((metric, index) => (
            <div key={index} className="coordination-card p-6">
              <div className="flex items-center justify-between mb-2">
                <div className={`text-2xl font-bold ${
                  metric.color === 'green' ? 'text-green-400' :
                  metric.color === 'blue' ? 'text-blue-400' :
                  metric.color === 'purple' ? 'text-purple-400' :
                  'text-orange-400'
                }`}>
                  {metric.value}
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  metric.change.startsWith('+') 
                    ? isDarkTheme ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'
                    : isDarkTheme ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700'
                }`}>
                  {metric.change}
                </span>
              </div>
              <div className={`text-sm ${
                isDarkTheme ? 'text-slate-400' : 'text-slate-600'
              }`}>
                {metric.label}
              </div>
            </div>
          ))}
        </div>

        {/* Active File Locks */}
        <div className="mb-12">
          <h2 className={`text-2xl font-bold mb-6 ${
            isDarkTheme ? 'text-white' : 'text-slate-900'
          }`}>
            Active File Locks
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            {activeLocks.map((lock) => {
              const StatusIcon = getStatusIcon(lock.status);
              return (
                <button
                  key={lock.id}
                  onClick={() => setSelectedLock(selectedLock === lock.id ? null : lock.id)}
                  className={`coordination-card p-6 text-left transition-all duration-300 ${
                    selectedLock === lock.id 
                      ? isDarkTheme 
                        ? 'ring-2 ring-blue-400 bg-blue-500/10' 
                        : 'ring-2 ring-blue-500 bg-blue-50'
                      : ''
                  }`}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      lock.status === 'active' ? 'bg-green-500/20 text-green-400' :
                      lock.status === 'pending' ? 'bg-yellow-500/20 text-yellow-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      <StatusIcon className="w-5 h-5" />
                    </div>
                    <div className="text-right">
                      <div className={`text-sm font-medium ${
                        isDarkTheme ? 'text-slate-300' : 'text-slate-700'
                      }`}>
                        {lock.user}
                      </div>
                      <div className={`text-xs ${
                        isDarkTheme ? 'text-slate-500' : 'text-slate-500'
                      }`}>
                        {lock.lastActivity}
                      </div>
                    </div>
                  </div>
                  
                  <h3 className={`font-mono text-sm mb-2 ${
                    isDarkTheme ? 'text-white' : 'text-slate-900'
                  }`}>
                    {lock.file}
                  </h3>
                  
                  <div className="flex items-center justify-between text-xs">
                    <span className={`px-2 py-1 rounded-full ${
                      lock.type === 'write' 
                        ? isDarkTheme ? 'bg-red-500/20 text-red-400' : 'bg-red-100 text-red-700'
                        : isDarkTheme ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700'
                    }`}>
                      {lock.type} lock
                    </span>
                    <span className={isDarkTheme ? 'text-slate-400' : 'text-slate-600'}>
                      {lock.duration}
                    </span>
                  </div>
                  
                  {lock.conflicts > 0 && (
                    <div className="mt-2 flex items-center gap-1 text-xs text-orange-400">
                      <HiExclamationTriangle className="w-3 h-3" />
                      <span>{lock.conflicts} conflict{lock.conflicts > 1 ? 's' : ''}</span>
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {/* Selected Lock Details */}
          {selectedLock && (
            <div className="coordination-card p-6">
              <h3 className={`text-lg font-semibold mb-4 ${
                isDarkTheme ? 'text-white' : 'text-slate-900'
              }`}>
                Lock Details: {activeLocks.find(l => l.id === selectedLock)?.file}
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <h4 className={`text-sm font-medium mb-2 ${
                    isDarkTheme ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    Lock Information
                  </h4>
                  <div className={`space-y-1 text-sm ${
                    isDarkTheme ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    <div>Owner: Claude#1</div>
                    <div>Type: Write lock</div>
                    <div>Duration: 5m 23s</div>
                    <div>Auto-release: 25m remaining</div>
                  </div>
                </div>
                
                <div>
                  <h4 className={`text-sm font-medium mb-2 ${
                    isDarkTheme ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    Conflict Status
                  </h4>
                  <div className={`space-y-1 text-sm ${
                    isDarkTheme ? 'text-slate-400' : 'text-slate-600'
                  }`}>
                    <div>Pending requests: 0</div>
                    <div>Queue position: N/A</div>
                    <div>Risk level: Low</div>
                    <div>Resolution: Auto</div>
                  </div>
                </div>
                
                <div>
                  <h4 className={`text-sm font-medium mb-2 ${
                    isDarkTheme ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    Actions
                  </h4>
                  <div className="space-y-2">
                    <button className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                      isDarkTheme 
                        ? 'bg-slate-700/50 hover:bg-slate-700 text-slate-300' 
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}>
                      Request access
                    </button>
                    <button className={`w-full text-left px-3 py-2 rounded text-sm transition-colors ${
                      isDarkTheme 
                        ? 'bg-slate-700/50 hover:bg-slate-700 text-slate-300' 
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}>
                      Force release (admin)
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Conflict Resolution Strategies */}
        <div className="mb-12">
          <h2 className={`text-2xl font-bold mb-6 ${
            isDarkTheme ? 'text-white' : 'text-slate-900'
          }`}>
            Conflict Resolution Strategies
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {resolutionStrategies.map((strategy, index) => (
              <div key={index} className="coordination-card p-6">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    isDarkTheme ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'
                  }`}>
                    <strategy.icon className="w-6 h-6" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className={`text-lg font-semibold ${
                        isDarkTheme ? 'text-white' : 'text-slate-900'
                      }`}>
                        {strategy.name}
                      </h3>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        isDarkTheme ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'
                      }`}>
                        {strategy.successRate}
                      </span>
                    </div>
                    
                    <p className={`text-sm mb-3 ${
                      isDarkTheme ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      {strategy.description}
                    </p>

                    <div className="space-y-1">
                      {strategy.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className={`text-xs flex items-center gap-2 ${
                          isDarkTheme ? 'text-slate-500' : 'text-slate-500'
                        }`}>
                          <div className="w-1 h-1 rounded-full bg-blue-400"></div>
                          <span>{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* System Architecture */}
        <div className="coordination-card p-8">
          <h2 className={`text-2xl font-bold mb-6 ${
            isDarkTheme ? 'text-white' : 'text-slate-900'
          }`}>
            File Management Architecture
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
                isDarkTheme ? 'text-white' : 'text-slate-900'
              }`}>
                <HiShieldCheck className="w-5 h-5 text-green-400" />
                Lock Management
              </h3>
              <ul className="space-y-2">
                <li className={`text-sm flex items-start gap-2 ${
                  isDarkTheme ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  <span className="text-green-400">•</span>
                  <span>Distributed locking with Redis coordination</span>
                </li>
                <li className={`text-sm flex items-start gap-2 ${
                  isDarkTheme ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  <span className="text-green-400">•</span>
                  <span>Automatic timeout and cleanup mechanisms</span>
                </li>
                <li className={`text-sm flex items-start gap-2 ${
                  isDarkTheme ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  <span className="text-green-400">•</span>
                  <span>Priority-based queuing for lock requests</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
                isDarkTheme ? 'text-white' : 'text-slate-900'
              }`}>
                <HiArrowPath className="w-5 h-5 text-blue-400" />
                Conflict Resolution
              </h3>
              <ul className="space-y-2">
                <li className={`text-sm flex items-start gap-2 ${
                  isDarkTheme ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  <span className="text-blue-400">•</span>
                  <span>Three-way merge with semantic analysis</span>
                </li>
                <li className={`text-sm flex items-start gap-2 ${
                  isDarkTheme ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  <span className="text-blue-400">•</span>
                  <span>Operational transforms for real-time editing</span>
                </li>
                <li className={`text-sm flex items-start gap-2 ${
                  isDarkTheme ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  <span className="text-blue-400">•</span>
                  <span>Machine learning conflict prediction</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
                isDarkTheme ? 'text-white' : 'text-slate-900'
              }`}>
                <HiDocumentText className="w-5 h-5 text-purple-400" />
                File Tracking
              </h3>
              <ul className="space-y-2">
                <li className={`text-sm flex items-start gap-2 ${
                  isDarkTheme ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  <span className="text-purple-400">•</span>
                  <span>Real-time file system monitoring</span>
                </li>
                <li className={`text-sm flex items-start gap-2 ${
                  isDarkTheme ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  <span className="text-purple-400">•</span>
                  <span>Change detection and impact analysis</span>
                </li>
                <li className={`text-sm flex items-start gap-2 ${
                  isDarkTheme ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  <span className="text-purple-400">•</span>
                  <span>Dependency graph maintenance</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FileManagement;