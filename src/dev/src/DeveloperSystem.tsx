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
  HiOutlineDocumentText,
  HiHome
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
  SessionLogs,
  AutonomousBuilder,
  SimpleBuilder
} from './sections';

const DeveloperSystem: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isDarkTheme, setIsDarkTheme] = useState(false); // Default to light for Nordic aesthetics
  const [activeSection, setActiveSection] = useState('home');
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
      id: 'home', 
      title: 'Hjem', 
      icon: HiHome,
      description: 'Systemoversikt og kom i gang'
    },
    { 
      id: 'simple-builder', 
      title: 'Enkel Bygging', 
      icon: HiOutlineCube,
      description: 'Enkel måte å bygge prosjekter - full funksjonalitet'
    },
    { 
      id: 'autonomous-builder', 
      title: 'Autonom Byggeverktøy', 
      icon: HiRocketLaunch,
      description: 'Avansert AI-team orkestrering og automatisering'
    },
    { 
      id: 'coordination-overview', 
      title: 'Koordinasjonsoversikt', 
      icon: HiOutlineCube,
      description: 'Systemarkitektur og grunnleggende konsepter'
    },
    { 
      id: 'ai-features', 
      title: 'AI-Funksjoner', 
      icon: HiCpuChip,
      description: 'AI-drevne oppgaveforslag og intelligens'
    },
    { 
      id: 'realtime-hub', 
      title: 'Sanntidshub', 
      icon: HiGlobeAlt,
      description: 'WebSocket-koordinering og direktesamarbeid'
    },
    { 
      id: 'team-optimization', 
      title: 'Teamoptimalisering', 
      icon: HiUsers,
      description: 'AI-drevet teamsammensetning og prosjektanalyse'
    },
    { 
      id: 'file-management', 
      title: 'Filhåndtering', 
      icon: HiOutlineArchiveBox,
      description: 'Låsesystem og konfliktløsning'
    },
    { 
      id: 'session-coordination', 
      title: 'Sesjonskoordinering', 
      icon: HiOutlineShieldCheck,
      description: 'Administrasjon av multi-terminal sesjoner'
    },
    { 
      id: 'performance-metrics', 
      title: 'Ytelse', 
      icon: HiRocketLaunch,
      description: 'Hurtigbuffer, optimalisering og benchmarks'
    },
    { 
      id: 'api-documentation', 
      title: 'API-Referanse', 
      icon: HiCommandLine,
      description: 'Komplett API- og kommandoreferanse'
    },
    { 
      id: 'session-logs', 
      title: 'Sesjonslogger', 
      icon: HiOutlineDocumentText,
      description: 'Samtalehistorikk og loggingssystem'
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
          
          {/* Home/Landing Page */}
          {activeSection === 'home' && (
            <>
              {/* Hero Section - Magazine Style */}
              <section className="nordic-section">
                <div className="nordic-container-wide">
                  <div className="nordic-grid-magazine">
                    <div>
                      <div className="nordic-h3" style={{color: 'var(--text-muted)', marginBottom: 'var(--space-sm)'}}>
                        Utviklingssystem
                      </div>
                      <h1 className="nordic-h1" style={{marginBottom: 'var(--space-md)'}}>
                        Claude Code Coordination
                      </h1>
                      <p className="nordic-body-large">
                        Avansert multi-terminal AI-system for intelligent filkoordinering, 
                        sanntidssamarbeid og AI-drevet utviklingsoptimalisering.
                      </p>
                    </div>
                    <div className="flex flex-col gap-6">
                      <div className="nordic-card" style={{padding: 'var(--space-lg)'}}>
                        <div className="nordic-caption mb-2">Systemstatus</div>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center">
                            <span className="nordic-body text-sm">AI-Motor</span>
                            <span className="text-xs font-medium" style={{color: 'var(--accent-secondary)'}}>Aktiv</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="nordic-body text-sm">WebSocket Hub</span>
                            <span className="text-xs font-medium" style={{color: 'var(--accent-secondary)'}}>Tilkoblet</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="nordic-body text-sm">Fillåser</span>
                            <span className="text-xs font-medium" style={{color: 'var(--accent-primary)'}}>3 Aktive</span>
                          </div>
                        </div>
                      </div>
                      <div className="flex flex-col gap-3">
                        <button 
                          className="nordic-button-primary"
                          onClick={() => setActiveSection('simple-builder')}
                        >
                          ✨ Enkel Bygging
                        </button>
                        <button 
                          className="nordic-button"
                          onClick={() => setActiveSection('autonomous-builder')}
                        >
                          🚀 Avansert AI-team
                        </button>
                        <button 
                          className="nordic-button"
                          onClick={() => setActiveSection('coordination-overview')}
                        >
                          Kom i Gang
                        </button>
                        <button 
                          className="nordic-button"
                          onClick={() => setActiveSection('api-documentation')}
                        >
                          Dokumentasjon
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
                    <h2 className="nordic-h2">Intelligent Koordinering</h2>
                    <p className="nordic-body">
                      Bygget for moderne utviklingsarbeidsflyt som krever sømløst samarbeid 
                      mellom flere Claude Code-instanser uten konflikter.
                    </p>
                  </div>
                </div>
              </section>

              {/* Features Overview Grid */}
              <section className="nordic-section">
                <div className="nordic-container-wide">
                  <div className="nordic-grid nordic-grid-3" style={{marginTop: 'var(--space-2xl)'}}>
                    {sections.slice(1).map((section) => (
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
              </section>
            </>
          )}

          {/* Content Sections - Show only active section */}
          <div className="relative">
            {activeSection === 'simple-builder' && <SimpleBuilder isDarkTheme={isDarkTheme} />}
            {activeSection === 'autonomous-builder' && <AutonomousBuilder isDarkTheme={isDarkTheme} />}
            {activeSection === 'coordination-overview' && <CoordinationOverview isDarkTheme={isDarkTheme} />}
            {activeSection === 'ai-features' && <AIFeatures isDarkTheme={isDarkTheme} />}
            {activeSection === 'realtime-hub' && <RealtimeHub isDarkTheme={isDarkTheme} />}
            {activeSection === 'team-optimization' && <TeamOptimization isDarkTheme={isDarkTheme} />}
            {activeSection === 'file-management' && <FileManagement isDarkTheme={isDarkTheme} />}
            {activeSection === 'session-coordination' && <SessionCoordination isDarkTheme={isDarkTheme} />}
            {activeSection === 'performance-metrics' && <PerformanceMetrics isDarkTheme={isDarkTheme} />}
            {activeSection === 'api-documentation' && <APIDocumentation isDarkTheme={isDarkTheme} />}
            {activeSection === 'session-logs' && <SessionLogs isDarkTheme={isDarkTheme} />}
          </div>
        </main>
      </div>
    </div>
  );
};

export default DeveloperSystem;