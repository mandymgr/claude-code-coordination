import React, { useState, useEffect } from 'react';
import { 
  HiOutlineCube,
  HiOutlineShieldCheck,
  HiOutlineArchiveBox,
  HiBars3,
  HiXMark,
  HiSun,
  HiMoon,
  HiCog6Tooth,
  HiMagnifyingGlass,
  HiUsers,
  HiCpuChip,
  HiRocketLaunch,
  HiCommandLine,
  HiGlobeAlt,
  HiOutlineDocumentText
} from 'react-icons/hi2';

// Import coordination-specific sections
import { 
  CoordinationOverview,
  AIFeatures,
  RealtimeHub,
  TeamOptimization,
  FileManagement,
  SessionCoordination,
  PerformanceMetrics,
  APIDocumentation,
  SessionLogs
} from './sections';
import ExecutiveDashboard from './sections/ExecutiveDashboard';
import CollaborationDashboard from './sections/CollaborationDashboard';
import AIAgentManagement from './sections/AIAgentManagement';
import { ErrorBoundary } from './components/ErrorBoundary';
import ApiStatusIndicator from './components/ApiStatusIndicator';

const DeveloperSystem: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDarkTheme, setIsDarkTheme] = useState(true); // Default to dark for dev tools
  const [activeSection, setActiveSection] = useState('coordination-overview');
  const [searchQuery, setSearchQuery] = useState('');

  // Load saved preferences from localStorage on component mount
  useEffect(() => {
    document.body.classList.add('coordination-developer-system');
    
    const savedTheme = localStorage.getItem('coordination-theme');
    if (savedTheme) {
      setIsDarkTheme(savedTheme === 'dark');
    }
    
    return () => {
      document.body.classList.remove('coordination-developer-system');
    };
  }, []);

  const handleThemeToggle = () => {
    const newTheme = !isDarkTheme;
    setIsDarkTheme(newTheme);
    localStorage.setItem('coordination-theme', newTheme ? 'dark' : 'light');
  };

  const sections = [
    { 
      id: 'coordination-overview', 
      title: 'Coordination Overview', 
      icon: HiOutlineCube,
      description: 'System architecture and core concepts'
    },
    { 
      id: 'ai-agent-management', 
      title: 'KRIN AI Management', 
      icon: HiCpuChip,
      description: 'Manage KRIN and AI team coordination'
    },
    { 
      id: 'ai-features', 
      title: 'AI Features', 
      icon: HiCpuChip,
      description: 'AI-powered task suggestions and intelligence'
    },
    { 
      id: 'realtime-hub', 
      title: 'Realtime Hub', 
      icon: HiGlobeAlt,
      description: 'WebSocket coordination and live collaboration'
    },
    { 
      id: 'team-optimization', 
      title: 'Team Optimization', 
      icon: HiUsers,
      description: 'AI-driven team composition and project analysis'
    },
    { 
      id: 'file-management', 
      title: 'File Management', 
      icon: HiOutlineArchiveBox,
      description: 'Lock system and conflict resolution'
    },
    { 
      id: 'session-coordination', 
      title: 'Session Coordination', 
      icon: HiOutlineShieldCheck,
      description: 'Multi-terminal session management'
    },
    { 
      id: 'performance-metrics', 
      title: 'Performance', 
      icon: HiRocketLaunch,
      description: 'Caching, optimization and benchmarks'
    },
    { 
      id: 'api-documentation', 
      title: 'API Reference', 
      icon: HiCommandLine,
      description: 'Complete API and command reference'
    },
    { 
      id: 'session-logs', 
      title: 'Session Logs', 
      icon: HiOutlineDocumentText,
      description: 'Conversation history and logging system'
    }
  ];

  const filteredSections = sections.filter(section =>
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <style>
        {`
          body.coordination-developer-system {
            padding-top: 0 !important;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          }
          
          .coordination-gradient-bg {
            background: ${isDarkTheme 
              ? 'linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%)'
              : 'linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%)'
            };
          }
          
          .coordination-card {
            background: ${isDarkTheme 
              ? 'rgba(30, 41, 59, 0.8)'
              : 'rgba(255, 255, 255, 0.9)'
            };
            border: 1px solid ${isDarkTheme 
              ? 'rgba(71, 85, 105, 0.5)'
              : 'rgba(203, 213, 225, 0.8)'
            };
            backdrop-filter: blur(12px);
            border-radius: 12px;
            transition: all 0.3s ease;
          }
          
          .coordination-card:hover {
            transform: translateY(-2px);
            box-shadow: ${isDarkTheme 
              ? '0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.2)'
              : '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)'
            };
          }
          
          .coordination-sidebar {
            background: ${isDarkTheme 
              ? 'linear-gradient(180deg, #1e293b 0%, #334155 100%)'
              : 'linear-gradient(180deg, #ffffff 0%, #f8fafc 100%)'
            };
            border-right: 1px solid ${isDarkTheme 
              ? 'rgba(71, 85, 105, 0.5)'
              : 'rgba(203, 213, 225, 0.8)'
            };
          }
          
          .coordination-accent {
            background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
          }
          
          .coordination-accent-secondary {
            background: linear-gradient(135deg, #10b981 0%, #059669 100%);
          }
        `}
      </style>
      
      <div className="min-h-screen flex coordination-gradient-bg">
        {/* Sidebar */}
        <div className={`fixed inset-y-0 left-0 z-50 w-80 coordination-sidebar transform transition-transform duration-300 ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}>
          <div className={`flex items-center justify-between p-6 border-b ${
            isDarkTheme ? 'border-slate-600/50' : 'border-slate-300/50'
          }`}>
            <div>
              <div className="flex items-center space-x-3">
                <div>
                  <h1 className={`text-2xl font-bold ${
                    isDarkTheme ? 'text-white' : 'text-slate-900'
                  }`} style={{fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'}}>
                    Claude Code Coordination
                  </h1>
                  <p className={`text-sm ${isDarkTheme ? 'text-slate-400' : 'text-slate-600'} mt-1`}>
                    Advanced Multi-Terminal AI System
                  </p>
                </div>
                <ApiStatusIndicator />
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className={`lg:hidden p-2 rounded-lg ${
                isDarkTheme 
                  ? 'hover:bg-slate-700/50 text-slate-300' 
                  : 'hover:bg-slate-200/50 text-slate-700'
              } transition-colors`}
            >
              <HiXMark className="w-6 h-6" />
            </button>
          </div>
          
          <nav className="p-6">
            <p className={`text-sm ${isDarkTheme ? 'text-slate-400' : 'text-slate-600'} mb-6 leading-relaxed`}>
              Comprehensive development system for Claude Code coordination features, AI intelligence, and multi-terminal collaboration.
            </p>

            {/* Search */}
            <div className="mb-6">
              <div className="relative">
                <HiMagnifyingGlass className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${
                  isDarkTheme ? 'text-slate-500' : 'text-slate-400'
                }`} />
                <input
                  type="text"
                  placeholder="Search features and docs..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className={`w-full border rounded-lg pl-10 pr-4 py-2 text-sm transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500/50 ${
                    isDarkTheme 
                      ? 'bg-slate-800/50 border-slate-600/50 text-white placeholder-slate-500' 
                      : 'bg-white/50 border-slate-300 text-slate-900 placeholder-slate-400'
                  }`}
                />
              </div>
            </div>

            {/* Navigation Links */}
            <div className="space-y-2 mb-8">
              {filteredSections.map((section) => (
                <a
                  key={section.id}
                  href={`#${section.id}`}
                  onClick={() => setActiveSection(section.id)}
                  className={`flex items-start gap-3 px-4 py-3 rounded-lg transition-all group ${
                    activeSection === section.id
                      ? isDarkTheme 
                        ? 'bg-blue-600/20 text-blue-400 border-r-2 border-blue-400'
                        : 'bg-blue-50 text-blue-700 border-r-2 border-blue-500'
                      : isDarkTheme
                        ? 'text-slate-400 hover:text-white hover:bg-slate-700/30'
                        : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100/50'
                  }`}
                >
                  <section.icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0">
                    <div className="font-medium">{section.title}</div>
                    <div className={`text-xs mt-1 ${
                      activeSection === section.id
                        ? isDarkTheme ? 'text-blue-300/80' : 'text-blue-600/80'
                        : isDarkTheme ? 'text-slate-500' : 'text-slate-500'
                    }`}>
                      {section.description}
                    </div>
                  </div>
                </a>
              ))}
            </div>

            {/* Quick Stats */}
            <div className="coordination-card p-4 mb-6">
              <h3 className={`text-sm font-medium ${isDarkTheme ? 'text-slate-300' : 'text-slate-700'} mb-3`}>
                System Status
              </h3>
              <div className="space-y-2 text-xs">
                <div className={`flex justify-between ${isDarkTheme ? 'text-slate-400' : 'text-slate-600'}`}>
                  <span>AI Engine</span>
                  <span className="text-green-400 font-medium">Active</span>
                </div>
                <div className={`flex justify-between ${isDarkTheme ? 'text-slate-400' : 'text-slate-600'}`}>
                  <span>WebSocket Hub</span>
                  <span className="text-green-400 font-medium">Connected</span>
                </div>
                <div className={`flex justify-between ${isDarkTheme ? 'text-slate-400' : 'text-slate-600'}`}>
                  <span>Team Optimizer</span>
                  <span className="text-blue-400 font-medium">Ready</span>
                </div>
                <div className={`flex justify-between ${isDarkTheme ? 'text-slate-400' : 'text-slate-600'}`}>
                  <span>File Locks</span>
                  <span className="text-orange-400 font-medium">3 Active</span>
                </div>
              </div>
            </div>

            {/* Settings */}
            <div className={`border-t pt-6 ${isDarkTheme ? 'border-slate-600/50' : 'border-slate-300/50'}`}>
              <h3 className={`text-sm font-medium ${isDarkTheme ? 'text-slate-400' : 'text-slate-600'} mb-4 flex items-center gap-2`}>
                <HiCog6Tooth className="w-4 h-4" />
                Developer Settings
              </h3>
              
              {/* Theme Toggle */}
              <div className="flex items-center justify-between py-2">
                <span className={`text-sm ${isDarkTheme ? 'text-slate-300' : 'text-slate-700'}`}>Theme</span>
                <button
                  onClick={handleThemeToggle}
                  className={`flex items-center gap-2 p-2 rounded-lg transition-colors ${
                    isDarkTheme 
                      ? 'hover:bg-slate-700/50 text-slate-300' 
                      : 'hover:bg-slate-200/50 text-slate-700'
                  }`}
                  title={isDarkTheme ? 'Switch to Light' : 'Switch to Dark'}
                >
                  {isDarkTheme ? (
                    <HiSun className="w-4 h-4 text-orange-400" />
                  ) : (
                    <HiMoon className="w-4 h-4 text-blue-500" />
                  )}
                </button>
              </div>
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className={`flex-1 transition-all duration-300 ${
          sidebarOpen ? 'lg:ml-80' : 'ml-0'
        }`}>
          {/* Mobile Header */}
          <div className={`lg:hidden sticky top-0 z-40 backdrop-blur p-4 border-b ${
            isDarkTheme 
              ? 'bg-slate-900/90 border-slate-600/50 text-white' 
              : 'bg-white/90 border-slate-300/50 text-slate-900'
          }`}>
            <div className="flex items-center justify-between">
              <button
                onClick={() => setSidebarOpen(true)}
                className={`p-2 rounded-lg transition-colors ${
                  isDarkTheme 
                    ? 'hover:bg-slate-700/50' 
                    : 'hover:bg-slate-200/50'
                }`}
              >
                <HiBars3 className="w-6 h-6" />
              </button>
              <h1 className="text-lg font-medium">Coordination System</h1>
              <div className="w-10" />
            </div>
          </div>

          {/* Content Sections */}
          <main className="relative">
            <ErrorBoundary>
              <ExecutiveDashboard />
            </ErrorBoundary>
            <CollaborationDashboard />
            <CoordinationOverview isDarkTheme={isDarkTheme} />
            <AIAgentManagement isDarkTheme={isDarkTheme} />
            <AIFeatures isDarkTheme={isDarkTheme} />
            <RealtimeHub isDarkTheme={isDarkTheme} />
            <TeamOptimization isDarkTheme={isDarkTheme} />
            <FileManagement isDarkTheme={isDarkTheme} />
            <SessionCoordination isDarkTheme={isDarkTheme} />
            <PerformanceMetrics isDarkTheme={isDarkTheme} />
            <APIDocumentation isDarkTheme={isDarkTheme} />
            <SessionLogs isDarkTheme={isDarkTheme} />
          </main>
        </div>
      </div>
    </>
  );
};

export default DeveloperSystem;