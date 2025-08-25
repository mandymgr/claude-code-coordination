import React, { useState, useEffect } from 'react';
import { 
  HiOutlineCube,
  HiOutlineShieldCheck,
  HiOutlineArchiveBox,
  HiUsers,
  HiCpuChip,
  HiRocketLaunch,
  HiCommandLine,
  HiGlobeAlt,
  HiOutlineDocumentText
} from 'react-icons/hi2';

// Import components
import { Sidebar } from './components';

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

const DeveloperSystem: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDarkTheme, setIsDarkTheme] = useState(false); // Default to light for Nordic aesthetics
  const [activeSection, setActiveSection] = useState('coordination-overview');
  const [searchQuery, setSearchQuery] = useState('');

  // Load saved preferences from localStorage on component mount
  useEffect(() => {
    document.body.classList.add('coordination-developer-system');
    
    const savedTheme = localStorage.getItem('coordination-theme');
    if (savedTheme) {
      setIsDarkTheme(savedTheme === 'dark');
    }
    
    // Apply theme to document
    document.documentElement.setAttribute('data-theme', isDarkTheme ? 'dark' : 'light');
    
    return () => {
      document.body.classList.remove('coordination-developer-system');
    };
  }, [isDarkTheme]);

  const handleThemeToggle = () => {
    const newTheme = !isDarkTheme;
    setIsDarkTheme(newTheme);
    localStorage.setItem('coordination-theme', newTheme ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', newTheme ? 'dark' : 'light');
  };

  const sections = [
    { 
      id: 'coordination-overview', 
      title: 'Coordination Overview', 
      icon: HiOutlineCube,
      description: 'System architecture and core concepts'
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
    <div className="min-h-screen" style={{backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)'}}>
      <div className="flex">
        <Sidebar
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          filteredSections={filteredSections}
          activeSection={activeSection}
          onSectionChange={setActiveSection}
          isDarkTheme={isDarkTheme}
          onThemeToggle={handleThemeToggle}
        />

        {/* Main Content */}
        <main className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'lg:ml-0' : 'ml-0'}`}>
          {/* Hero Section - Magazine Style */}
          <section className="nordic-section">
            <div className="nordic-container-wide">
              <div className="nordic-grid-magazine">
                <div>
                  <div className="nordic-h3" style={{color: 'var(--text-muted)', marginBottom: 'var(--space-sm)'}}>
                    Development System
                  </div>
                  <h1 className="nordic-h1" style={{marginBottom: 'var(--space-md)'}}>
                    Claude Code Coordination
                  </h1>
                  <p className="nordic-body-large">
                    Advanced multi-terminal AI system for intelligent file coordination, 
                    real-time collaboration, and AI-powered development optimization.
                  </p>
                </div>
                <div className="flex flex-col gap-6">
                  <div className="nordic-card" style={{padding: 'var(--space-lg)'}}>
                    <div className="nordic-caption mb-2">System Status</div>
                    <div className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="nordic-body text-sm">AI Engine</span>
                        <span className="text-xs font-medium" style={{color: 'var(--accent-secondary)'}}>Active</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="nordic-body text-sm">WebSocket Hub</span>
                        <span className="text-xs font-medium" style={{color: 'var(--accent-secondary)'}}>Connected</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="nordic-body text-sm">File Locks</span>
                        <span className="text-xs font-medium" style={{color: 'var(--accent-primary)'}}>3 Active</span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col gap-3">
                    <button className="nordic-button-primary">
                      Get Started
                    </button>
                    <button className="nordic-button">
                      Documentation
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Feature Introduction */}
          <section className="nordic-section-tight" style={{backgroundColor: 'var(--bg-secondary)', borderTop: '1px solid var(--bg-tertiary)'}}>
            <div className="nordic-container-narrow">
              <div className="text-center">
                <h2 className="nordic-h2">Intelligent Coordination</h2>
                <p className="nordic-body">
                  Built for modern development workflows requiring seamless collaboration 
                  between multiple Claude Code instances with zero conflicts.
                </p>
              </div>
            </div>
          </section>

          {/* Features - Asymmetric Layout */}
          <section className="nordic-section">
            <div className="nordic-container-wide">
              <div className="space-y-16">
                {/* First feature row */}
                <div className="nordic-grid-feature">
                  <div>
                    <div className="flex items-center gap-4 mb-6">
                      <HiCpuChip className="w-10 h-10" style={{color: 'var(--accent-primary)'}} />
                      <div>
                        <h3 className="nordic-h4">AI Features</h3>
                        <p className="nordic-caption">Advanced Intelligence</p>
                      </div>
                    </div>
                    <p className="nordic-body">
                      AI-powered task suggestions, intelligent conflict resolution, 
                      and automated optimization for development workflows.
                    </p>
                  </div>
                  <div className="nordic-card">
                    <div className="nordic-caption mb-4">Capabilities</div>
                    <div className="space-y-3 text-sm">
                      <div>• Smart file coordination</div>
                      <div>• Conflict prevention</div>
                      <div>• Task automation</div>
                      <div>• Performance optimization</div>
                    </div>
                  </div>
                </div>

                {/* Second feature row - reversed */}
                <div className="nordic-grid-feature" style={{gridTemplateColumns: '3fr 5fr'}}>
                  <div className="nordic-card">
                    <div className="nordic-caption mb-4">Real-time Status</div>
                    <div className="space-y-3 text-sm">
                      <div>• Live collaboration</div>
                      <div>• WebSocket coordination</div>
                      <div>• Session management</div>
                      <div>• Multi-terminal sync</div>
                    </div>
                  </div>
                  <div>
                    <div className="flex items-center gap-4 mb-6">
                      <HiGlobeAlt className="w-10 h-10" style={{color: 'var(--accent-primary)'}} />
                      <div>
                        <h3 className="nordic-h4">Realtime Hub</h3>
                        <p className="nordic-caption">Live Collaboration</p>
                      </div>
                    </div>
                    <p className="nordic-body">
                      WebSocket-based real-time coordination enabling seamless collaboration 
                      across multiple terminal instances with instant synchronization.
                    </p>
                  </div>
                </div>

                {/* Additional Features Grid */}
                <div className="nordic-grid nordic-grid-3" style={{marginTop: 'var(--space-3xl)'}}>
                  {sections.slice(2, 8).map((section) => (
                    <button 
                      key={section.id} 
                      className="nordic-card cursor-pointer group text-left w-full border-0"
                      onClick={() => setActiveSection(section.id)}
                      aria-label={`View ${section.title} section`}
                      style={{backgroundColor: 'var(--bg-primary)'}}
                    >
                      <section.icon className="w-6 h-6 mb-4 group-hover:scale-110 transition-transform duration-300" style={{color: 'var(--accent-primary)'}} />
                      <h4 className="nordic-h3" style={{fontSize: 'var(--text-base)', marginBottom: 'var(--space-sm)'}}>{section.title}</h4>
                      <p className="nordic-caption">{section.description}</p>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          {/* Content Sections */}
          <div className="relative">
            <CoordinationOverview isDarkTheme={isDarkTheme} />
            <AIFeatures isDarkTheme={isDarkTheme} />
            <RealtimeHub isDarkTheme={isDarkTheme} />
            <TeamOptimization isDarkTheme={isDarkTheme} />
            <FileManagement isDarkTheme={isDarkTheme} />
            <SessionCoordination isDarkTheme={isDarkTheme} />
            <PerformanceMetrics isDarkTheme={isDarkTheme} />
            <APIDocumentation isDarkTheme={isDarkTheme} />
            <SessionLogs isDarkTheme={isDarkTheme} />
          </div>
        </main>
      </div>
    </div>
  );
};

export default DeveloperSystem;