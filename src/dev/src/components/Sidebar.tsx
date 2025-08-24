import React from 'react';
import { 
  HiMagnifyingGlass, 
  HiSun, 
  HiMoon, 
  HiBars3, 
  HiXMark,
  HiOutlineCube
} from 'react-icons/hi2';

interface SidebarProps {
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  filteredSections: Array<{
    id: string;
    title: string;
    icon: React.ComponentType<any>;
    description: string;
  }>;
  activeSection: string;
  onSectionChange: (sectionId: string) => void;
  isDarkTheme: boolean;
  onThemeToggle: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  sidebarOpen,
  setSidebarOpen,
  searchQuery,
  setSearchQuery,
  filteredSections,
  activeSection,
  onSectionChange,
  isDarkTheme,
  onThemeToggle
}) => {
  return (
    <>
      {/* Mobile overlay */}
      {sidebarOpen && (
        <div 
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed lg:relative inset-y-0 left-0 z-50
          w-80 transform transition-transform duration-300 ease-in-out
          ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          flex flex-col
        `}
        style={{
          backgroundColor: 'var(--bg-secondary)',
          borderRight: '1px solid var(--bg-tertiary)'
        }}
      >
        {/* Header with system name */}
        <div className="flex items-center justify-between p-6 border-b" style={{borderColor: 'var(--bg-tertiary)'}}>
          <div className="flex items-center gap-3">
            <HiOutlineCube className="w-8 h-8" style={{color: 'var(--accent-primary)'}} />
            <div>
              <h1 className="font-serif text-xl font-medium" style={{color: 'var(--text-primary)'}}>
                Claude Code Coordination
              </h1>
              <p className="text-sm" style={{color: 'var(--text-muted)'}}>
                Development System
              </p>
            </div>
          </div>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
          >
            <HiXMark className="w-5 h-5" />
          </button>
        </div>

        {/* Search */}
        <div className="p-6 border-b" style={{borderColor: 'var(--bg-tertiary)'}}>
          <div className="relative">
            <HiMagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4" style={{color: 'var(--text-muted)'}} />
            <input
              type="text"
              placeholder="Search sections..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border text-sm transition-colors"
              style={{
                backgroundColor: 'var(--bg-primary)',
                borderColor: 'var(--bg-tertiary)',
                color: 'var(--text-primary)'
              }}
            />
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4">
          <div className="space-y-2">
            {filteredSections.map((section) => (
              <button
                key={section.id}
                onClick={() => onSectionChange(section.id)}
                className={`
                  w-full text-left p-3 rounded-lg transition-all duration-200
                  hover:transform hover:translate-x-1
                  ${activeSection === section.id 
                    ? 'shadow-sm' 
                    : 'hover:shadow-sm'
                  }
                `}
                style={{
                  backgroundColor: activeSection === section.id 
                    ? 'var(--accent-primary)' 
                    : 'transparent',
                  color: activeSection === section.id 
                    ? 'var(--bg-primary)' 
                    : 'var(--text-primary)',
                }}
              >
                <div className="flex items-start gap-3">
                  <section.icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
                  <div className="min-w-0 flex-1">
                    <div className="font-medium text-sm mb-1">
                      {section.title}
                    </div>
                    <div 
                      className="text-xs leading-relaxed opacity-75"
                    >
                      {section.description}
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        </nav>

        {/* System Status */}
        <div className="p-6 border-t" style={{borderColor: 'var(--bg-tertiary)'}}>
          <div className="nordic-caption mb-3">System Status</div>
          <div className="space-y-2">
            <div className="flex justify-between items-center text-sm">
              <span>AI Engine</span>
              <span className="text-xs font-medium" style={{color: 'var(--accent-primary)'}}>Active</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span>WebSocket</span>
              <span className="text-xs font-medium" style={{color: 'var(--accent-primary)'}}>Connected</span>
            </div>
            <div className="flex justify-between items-center text-sm">
              <span>Sessions</span>
              <span className="text-xs font-medium" style={{color: 'var(--text-muted)'}}>3 Active</span>
            </div>
          </div>
        </div>

        {/* Theme Toggle */}
        <div className="p-6 border-t" style={{borderColor: 'var(--bg-tertiary)'}}>
          <button
            onClick={onThemeToggle}
            className="flex items-center justify-between w-full p-3 rounded-lg transition-colors"
            style={{
              backgroundColor: 'var(--bg-primary)',
              color: 'var(--text-primary)'
            }}
          >
            <span className="text-sm font-medium">
              {isDarkTheme ? 'Light Theme' : 'Dark Theme'}
            </span>
            {isDarkTheme ? (
              <HiSun className="w-4 h-4" />
            ) : (
              <HiMoon className="w-4 h-4" />
            )}
          </button>
        </div>
      </aside>

      {/* Mobile toggle button */}
      <button
        onClick={() => setSidebarOpen(true)}
        className={`
          lg:hidden fixed top-4 left-4 z-30 p-3 rounded-lg shadow-lg
          ${sidebarOpen ? 'hidden' : 'block'}
        `}
        style={{
          backgroundColor: 'var(--bg-primary)',
          color: 'var(--accent-primary)'
        }}
      >
        <HiBars3 className="w-6 h-6" />
      </button>
    </>
  );
};