# Claude Code Coordination - Detaljert Design Template

## 🎨 Design System Oversikt

Dette dokumentet definerer en omfattende designmal for Claude Code Coordination-systemet basert på den eksisterende frontend-arkitekturen i `DeveloperSystem.tsx`. Designet følger moderne enterprise-prinsipper med fokus på mørk tema, glasseffekter og profesjonell estetikk.

**Målsetting**: Sikre 100% konsistens på tvers av alle komponenter og sider i systemet.

---

## 🌈 Fargepalett og CSS-variabler

### CSS Custom Properties (root level)
```css
:root {
  /* Primærfarger */
  --coordination-primary: #3b82f6;    /* rgb(59, 130, 246) - Koordinasjon blå */
  --coordination-secondary: #10b981;  /* rgb(16, 185, 129) - Koordinasjon grønn */
  
  /* Slate skala (hovedsakelig for mørk tema) */
  --slate-50: #f8fafc;               /* rgb(248, 250, 252) */
  --slate-100: #f1f5f9;              /* rgb(241, 245, 249) */
  --slate-200: #e2e8f0;              /* rgb(226, 232, 240) */
  --slate-300: #cbd5e1;              /* rgb(203, 213, 225) */
  --slate-400: #94a3b8;              /* rgb(148, 163, 184) */
  --slate-500: #64748b;              /* rgb(100, 116, 139) */
  --slate-600: #475569;              /* rgb(71, 85, 105) */
  --slate-700: #334155;              /* rgb(51, 65, 85) */
  --slate-800: #1e293b;              /* rgb(30, 41, 59) */
  --slate-900: #0f172a;              /* rgb(15, 23, 42) */
  
  /* Accent-farger */
  --accent-purple: #8b5cf6;          /* rgb(139, 92, 246) - Lilla */
  --accent-orange: #f97316;          /* rgb(249, 115, 22) - Orange */
  --accent-pink: #ec4899;            /* rgb(236, 72, 153) - Rosa */
  --accent-yellow: #eab308;          /* rgb(234, 179, 8) - Gul */

  /* Funksjonelle farger */
  --success: #22c55e;                /* rgb(34, 197, 94) - Suksess grønn */
  --info: #06b6d4;                   /* rgb(6, 182, 212) - Info cyan */
  --warning: #f59e0b;                /* rgb(245, 158, 11) - Advarsel orange */
  --danger: #ef4444;                 /* rgb(239, 68, 68) - Fare rød */
  
  /* Dynamiske tema-variabler (oppdateres basert på tema) */
  --coordination-bg: var(--slate-900);
  --coordination-card-bg: rgba(30, 41, 59, 0.8);
  --coordination-card-border: rgba(71, 85, 105, 0.5);
  --coordination-text-primary: white;
  --coordination-text-secondary: var(--slate-400);
  --coordination-border: rgba(71, 85, 105, 0.5);
}

/* Lys tema override */
[data-theme="light"] {
  --coordination-bg: var(--slate-50);
  --coordination-card-bg: rgba(255, 255, 255, 0.9);
  --coordination-card-border: rgba(203, 213, 225, 0.8);
  --coordination-text-primary: var(--slate-900);
  --coordination-text-secondary: var(--slate-600);
  --coordination-border: rgba(203, 213, 225, 0.8);
}
```

### Gradient-systemet
```css
/* Hovedbakgrunner */
.coordination-gradient-bg {
  background: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
}

/* Lys tema (bruk data-theme="light" for å aktivere) */
[data-theme="light"] .coordination-gradient-bg {
  background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%);
}

/* Accent gradienter (tema-uavhengige) */
.coordination-accent {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
}

.coordination-accent-secondary {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
}

/* Sidebar-spesifikk gradient */
.coordination-sidebar {
  background: linear-gradient(180deg, #1e293b 0%, #334155 100%);
  border-right: 1px solid rgba(71, 85, 105, 0.5);
}

[data-theme="light"] .coordination-sidebar {
  background: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  border-right: 1px solid rgba(203, 213, 225, 0.8);
}
```

### Tailwind-klasser for farger
```css
/* Bruk disse Tailwind-klassene for konsistens */
.text-coordination-primary { color: var(--coordination-text-primary); }
.text-coordination-secondary { color: var(--coordination-text-secondary); }
.border-coordination { border-color: var(--coordination-border); }
.bg-coordination-card { 
  background: var(--coordination-card-bg);
  border: 1px solid var(--coordination-card-border);
}
```

---

## 🖼️ Komplett Glassmorfisme og Komponent-system

### Base Card-komponenter
```css
/* Hovedkort - bruk denne for alle kort-komponenter */
.coordination-card {
  background: var(--coordination-card-bg);
  border: 1px solid var(--coordination-card-border);
  backdrop-filter: blur(12px);
  border-radius: 12px;
  transition: all 0.3s ease;
}

.coordination-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.4), 
              0 10px 10px -5px rgba(0, 0, 0, 0.2);
}

/* Lys tema hover-effekt */
[data-theme="light"] .coordination-card:hover {
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 
              0 10px 10px -5px rgba(0, 0, 0, 0.04);
}

/* Kort med padding standarder */
.coordination-card-sm { padding: 1rem; }      /* 16px */
.coordination-card-md { padding: 1.5rem; }    /* 24px */  
.coordination-card-lg { padding: 2rem; }      /* 32px */
```

### Layout-strukturer
```css
/* Hovedlayout container */
.coordination-layout {
  min-height: 100vh;
  display: flex;
}

/* Sidebar fast bredde */
.coordination-sidebar {
  position: fixed;
  top: 0;
  left: 0;
  bottom: 0;
  width: 320px; /* 80 Tailwind units */
  z-index: 50;
  transform: translateX(0);
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.coordination-sidebar.closed {
  transform: translateX(-100%);
}

/* Hovedinnhold med dynamisk margin */
.coordination-main-content {
  flex: 1;
  margin-left: 320px; /* Når sidebar er åpen */
  transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.coordination-main-content.sidebar-closed {
  margin-left: 0;
}

/* Mobile responsive (< 1024px) */
@media (max-width: 1023px) {
  .coordination-sidebar {
    width: 100%;
    transform: translateX(-100%);
  }
  
  .coordination-sidebar.open {
    transform: translateX(0);
  }
  
  .coordination-main-content {
    margin-left: 0 !important;
  }
}
```

---

## 📱 Detaljert Layout-struktur og Responsivitet

### Hovedlayout-template
```tsx
// Standard layout-struktur for alle sider
const CoordinationLayout: React.FC = ({ children }) => (
  <div className="coordination-layout coordination-gradient-bg">
    {/* Sidebar */}
    <div className={`coordination-sidebar ${sidebarOpen ? '' : 'closed'}`}>
      {/* Sidebar innhold */}
    </div>
    
    {/* Hovedinnhold */}
    <div className={`coordination-main-content ${sidebarOpen ? '' : 'sidebar-closed'}`}>
      {/* Mobile header */}
      <div className="lg:hidden coordination-mobile-header">
        {/* Mobile navigasjon */}
      </div>
      
      {/* Hovedinnhold */}
      <main className="relative">
        {children}
      </main>
    </div>
  </div>
);
```

### Sidebar-struktur
```tsx
// Standard sidebar-template
const CoordinationSidebar: React.FC = () => (
  <div className="coordination-sidebar">
    {/* Header */}
    <div className="flex items-center justify-between p-6 border-b border-coordination">
      <div>
        <h1 className="text-2xl font-bold text-coordination-primary">
          Claude Code Coordination
        </h1>
        <p className="text-sm text-coordination-secondary mt-1">
          Advanced Multi-Terminal AI System
        </p>
      </div>
      <button className="lg:hidden coordination-btn-icon">
        <HiXMark className="w-6 h-6" />
      </button>
    </div>
    
    {/* Navigasjon */}
    <nav className="p-6">
      <p className="text-sm text-coordination-secondary mb-6 leading-relaxed">
        Beskrivelse av systemet...
      </p>
      
      {/* Søk */}
      <div className="mb-6">
        <CoordinationSearchInput />
      </div>
      
      {/* Navigasjonslenker */}
      <div className="space-y-2 mb-8">
        {sections.map(section => (
          <CoordinationNavItem key={section.id} {...section} />
        ))}
      </div>
      
      {/* Statuskort */}
      <div className="coordination-card coordination-card-sm mb-6">
        <h3 className="text-sm font-medium text-coordination-secondary mb-3">
          System Status
        </h3>
        <CoordinationStatusList />
      </div>
      
      {/* Innstillinger */}
      <div className="border-t border-coordination pt-6">
        <CoordinationSettings />
      </div>
    </nav>
  </div>
);
```

### Mobile Header-template
```tsx
const CoordinationMobileHeader: React.FC = () => (
  <div className="lg:hidden sticky top-0 z-40 backdrop-blur p-4 border-b border-coordination bg-coordination-card">
    <div className="flex items-center justify-between">
      <button onClick={() => setSidebarOpen(true)} className="coordination-btn-icon">
        <HiBars3 className="w-6 h-6" />
      </button>
      <h1 className="text-lg font-medium text-coordination-primary">
        Coordination System
      </h1>
      <div className="w-10" />
    </div>
  </div>
);
```

### Responsive breakpoints (følg Tailwind)
- **Mobile**: `< 640px` (sm) - Kompakt layout
- **Tablet**: `640px - 1024px` (sm-lg) - Overlay sidebar
- **Desktop**: `≥ 1024px` (lg+) - Fast sidebar panel

---

## 🎯 Detaljert Navigasjonssystem

### Navigationselement TypeScript Interface
```typescript
interface NavigationSection {
  id: string;
  title: string;
  icon: IconComponent;
  description: string;
  status?: 'Active' | 'Ready' | 'Connected' | 'Protected' | 'Warning' | 'Error';
  color?: 'blue' | 'green' | 'purple' | 'orange' | 'red';
  badge?: string | number;
  isNew?: boolean;
  isDisabled?: boolean;
}

interface NavigationProps {
  sections: NavigationSection[];
  activeSection: string;
  onSectionChange: (sectionId: string) => void;
  searchQuery?: string;
}
```

### Standard NavigationItem-komponent
```tsx
const CoordinationNavItem: React.FC<NavigationSection & { isActive: boolean }> = ({
  id,
  title,
  icon: Icon,
  description,
  status,
  badge,
  isNew,
  isDisabled,
  isActive
}) => (
  <a
    href={`#${id}`}
    className={`
      flex items-start gap-3 px-4 py-3 rounded-lg transition-all group relative
      ${isActive
        ? 'bg-blue-600/20 text-blue-400 border-r-2 border-blue-400'
        : isDisabled
        ? 'text-slate-600 cursor-not-allowed opacity-50'
        : 'text-coordination-secondary hover:text-coordination-primary hover:bg-slate-700/30'
      }
    `}
    onClick={isDisabled ? (e) => e.preventDefault() : undefined}
  >
    <Icon className="w-5 h-5 mt-0.5 flex-shrink-0" />
    <div className="min-w-0 flex-1">
      <div className="flex items-center gap-2">
        <span className="font-medium">{title}</span>
        {isNew && (
          <span className="px-1.5 py-0.5 text-xs font-medium bg-blue-500 text-white rounded">
            NEW
          </span>
        )}
        {badge && (
          <span className="px-1.5 py-0.5 text-xs font-medium bg-slate-600 text-white rounded">
            {badge}
          </span>
        )}
      </div>
      <div className={`text-xs mt-1 ${
        isActive 
          ? 'text-blue-300/80' 
          : 'text-coordination-secondary'
      }`}>
        {description}
      </div>
      {status && (
        <CoordinationStatusBadge status={status} size="sm" className="mt-2" />
      )}
    </div>
  </a>
);
```

### Navigasjons-tilstander og visuell feedback
```css
/* Aktiv navigasjonselement */
.nav-item-active {
  background: rgba(59, 130, 246, 0.2);
  color: #60a5fa;
  border-right: 2px solid #60a5fa;
}

/* Hover-tilstand */
.nav-item:hover:not(.nav-item-active):not(.nav-item-disabled) {
  background: rgba(51, 65, 85, 0.3);
  color: var(--coordination-text-primary);
}

/* Deaktivert tilstand */
.nav-item-disabled {
  opacity: 0.5;
  cursor: not-allowed;
  color: #6b7280;
}

/* Fokus-tilstand for tilgjengelighet */
.nav-item:focus {
  outline: none;
  ring: 2px solid rgba(59, 130, 246, 0.5);
  ring-offset: 2px;
}
```

---

## 🚀 Ikonbruk

### Hovedsystem (Hero Icons v2)
```typescript
import {
  HiOutlineCube,        // Coordination Overview
  HiCpuChip,           // AI Features  
  HiGlobeAlt,          // Realtime Hub
  HiUsers,             // Team Optimization
  HiOutlineArchiveBox, // File Management
  HiOutlineShieldCheck,// Session Coordination
  HiRocketLaunch,      // Performance
  HiCommandLine,       // API Documentation
  HiOutlineDocumentText,// Session Logs
  HiMagnifyingGlass,   // Search
  HiBars3, HiXMark,    // Menu toggle
  HiSun, HiMoon,       // Theme toggle
  HiCog6Tooth          // Settings
} from 'react-icons/hi2';
```

### Ikonstørrelser
- **Sidebar-navigasjon**: `w-5 h-5` (20px)
- **Hovedfunksjoner**: `w-6 h-6` (24px)
- **Store ikoner**: `w-8 h-8` (32px)

---

## ⚡ Komplett Interaksjons- og Animasjonssystem

### Standard overgangseffekter
```css
/* Base transition-klasser for komponenter */
.transition-standard {
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.transition-fast {
  transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
}

.transition-slow {
  transition: all 0.5s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Spesifikke animasjoner */
.card-hover {
  transition: transform 0.2s ease, box-shadow 0.3s ease;
}

.sidebar-transition {
  transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

.content-transition {
  transition: margin-left 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}
```

### Mikro-interaksjoner
```css
/* Knapp-interaksjoner */
.coordination-btn {
  transition: all 0.2s ease;
  transform: scale(1);
}

.coordination-btn:hover {
  transform: scale(1.02);
}

.coordination-btn:active {
  transform: scale(0.98);
}

/* Loading-animasjon */
.coordination-loading {
  animation: pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
}

@keyframes pulse {
  0%, 100% {
    opacity: 1;
  }
  50% {
    opacity: .5;
  }
}

/* Fade-in animasjon for innhold */
.coordination-fade-in {
  animation: fadeIn 0.5s ease-out;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(10px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}
```

### Hover-effektbibliotek
```css
/* Kort hover-effekter */
.coordination-card-hover-lift {
  transform: translateY(-2px);
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.4), 
              0 10px 10px -5px rgba(0, 0, 0, 0.2);
}

.coordination-card-hover-glow {
  box-shadow: 0 0 20px rgba(59, 130, 246, 0.3);
}

.coordination-card-hover-scale {
  transform: scale(1.02);
}

/* Knapp hover-effekter */
.coordination-btn-hover-primary {
  background: linear-gradient(135deg, #3b82f6 0%, #1d4ed8 100%);
  color: white;
}

.coordination-btn-hover-secondary {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: white;
}
```

---

## 📊 Komplett Status- og Badge-system

### Status-typer og farger
```typescript
type StatusType = 
  | 'active'      // Grønn - systemet kjører
  | 'ready'       // Blå - klart til bruk  
  | 'connected'   // Cyan - tilkoblet
  | 'protected'   // Purple - sikret
  | 'warning'     // Orange - advarsel
  | 'error'       // Rød - feil
  | 'inactive'    // Grå - ikke aktiv
  | 'loading';    // Gul - laster

interface StatusConfig {
  color: string;
  bgColor: string;
  textColor: string;
  icon?: IconComponent;
}

const statusConfigs: Record<StatusType, StatusConfig> = {
  active: {
    color: '#10b981',
    bgColor: 'rgba(16, 185, 129, 0.1)',
    textColor: '#10b981',
    icon: HiCheckCircle
  },
  ready: {
    color: '#3b82f6',
    bgColor: 'rgba(59, 130, 246, 0.1)', 
    textColor: '#3b82f6',
    icon: HiClock
  },
  connected: {
    color: '#06b6d4',
    bgColor: 'rgba(6, 182, 212, 0.1)',
    textColor: '#06b6d4',
    icon: HiGlobeAlt
  },
  // ... osv
};
```

### StatusBadge-komponent
```tsx
interface StatusBadgeProps {
  status: StatusType;
  size?: 'sm' | 'md' | 'lg';
  showIcon?: boolean;
  className?: string;
}

const CoordinationStatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size = 'md',
  showIcon = true,
  className = ''
}) => {
  const config = statusConfigs[status];
  const Icon = config.icon;
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs',
    md: 'px-3 py-1.5 text-sm', 
    lg: 'px-4 py-2 text-base'
  };
  
  return (
    <span
      className={`
        inline-flex items-center gap-1.5 rounded-full font-medium
        ${sizeClasses[size]} ${className}
      `}
      style={{
        backgroundColor: config.bgColor,
        color: config.textColor
      }}
    >
      {showIcon && Icon && <Icon className="w-4 h-4" />}
      {status.charAt(0).toUpperCase() + status.slice(1)}
    </span>
  );
};
```

### StatusList-komponent for system-status
```tsx
interface StatusItem {
  label: string;
  status: StatusType;
  value?: string | number;
  description?: string;
}

const CoordinationStatusList: React.FC<{ items: StatusItem[] }> = ({ items }) => (
  <div className="space-y-2 text-xs">
    {items.map((item, index) => (
      <div key={index} className="flex justify-between items-center">
        <span className="text-coordination-secondary">{item.label}</span>
        <div className="flex items-center gap-2">
          {item.value && (
            <span className="text-coordination-secondary">{item.value}</span>
          )}
          <CoordinationStatusBadge status={item.status} size="sm" />
        </div>
      </div>
    ))}
  </div>
);
```

### Standard system-status items
```typescript
const defaultSystemStatus: StatusItem[] = [
  { label: 'AI Engine', status: 'active' },
  { label: 'WebSocket Hub', status: 'connected' },
  { label: 'Team Optimizer', status: 'ready' },
  { label: 'File Locks', status: 'warning', value: '3 Active' },
  { label: 'Cache System', status: 'active' },
  { label: 'Session Manager', status: 'protected' }
];
```

---

## 🔤 Typografi

### Font-hierarki
```css
/* Primær font */
font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;

/* Monospace (kode) */
font-family: 'JetBrains Mono', 'Fira Code', Consolas, 'Liberation Mono', Menlo, monospace;
```

### Tekststørrelser
- **H1**: `text-2xl font-bold` (24px)
- **H2**: `text-xl font-semibold` (20px)
- **H3**: `text-lg font-medium` (18px)
- **Body**: `text-base` (16px)
- **Small**: `text-sm` (14px)
- **Tiny**: `text-xs` (12px)

---

## 🌙 Detaljert Tema-håndtering og State Management

### Theme Provider Setup
```tsx
interface ThemeContextType {
  isDarkTheme: boolean;
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const CoordinationThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [isDarkTheme, setIsDarkTheme] = useState(() => {
    const saved = localStorage.getItem('coordination-theme');
    return saved ? saved === 'dark' : true; // Default til dark
  });

  const toggleTheme = useCallback(() => {
    const newTheme = !isDarkTheme;
    setIsDarkTheme(newTheme);
    localStorage.setItem('coordination-theme', newTheme ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', newTheme ? 'dark' : 'light');
  }, [isDarkTheme]);

  const setTheme = useCallback((theme: 'light' | 'dark') => {
    setIsDarkTheme(theme === 'dark');
    localStorage.setItem('coordination-theme', theme);
    document.documentElement.setAttribute('data-theme', theme);
  }, []);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', isDarkTheme ? 'dark' : 'light');
  }, [isDarkTheme]);

  return (
    <ThemeContext.Provider value={{ isDarkTheme, toggleTheme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useCoordinationTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useCoordinationTheme must be used within CoordinationThemeProvider');
  }
  return context;
};
```

### Theme Toggle Component
```tsx
const CoordinationThemeToggle: React.FC = () => {
  const { isDarkTheme, toggleTheme } = useCoordinationTheme();
  
  return (
    <button
      onClick={toggleTheme}
      className="flex items-center gap-2 p-2 rounded-lg transition-colors hover:bg-slate-700/50 text-coordination-secondary"
      title={isDarkTheme ? 'Switch to Light Theme' : 'Switch to Dark Theme'}
      aria-label={`Switch to ${isDarkTheme ? 'light' : 'dark'} theme`}
    >
      {isDarkTheme ? (
        <HiSun className="w-4 h-4 text-orange-400" />
      ) : (
        <HiMoon className="w-4 h-4 text-blue-500" />
      )}
      <span className="text-sm font-medium">
        {isDarkTheme ? 'Light' : 'Dark'} Mode
      </span>
    </button>
  );
};
```

### CSS Custom Properties for Dynamic Theming
```css
/* I stedet for inline styles, bruk CSS-variabler */
:root {
  --coordination-transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
}

/* Mørk tema (default) */
:root,
[data-theme="dark"] {
  --coordination-bg: linear-gradient(135deg, #0f172a 0%, #1e293b 50%, #334155 100%);
  --coordination-sidebar-bg: linear-gradient(180deg, #1e293b 0%, #334155 100%);
  --coordination-card-bg: rgba(30, 41, 59, 0.8);
  --coordination-card-border: rgba(71, 85, 105, 0.5);
  --coordination-card-hover-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.4), 0 10px 10px -5px rgba(0, 0, 0, 0.2);
  --coordination-text-primary: white;
  --coordination-text-secondary: #94a3b8;
  --coordination-border: rgba(71, 85, 105, 0.5);
}

/* Lys tema */
[data-theme="light"] {
  --coordination-bg: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 50%, #cbd5e1 100%);
  --coordination-sidebar-bg: linear-gradient(180deg, #ffffff 0%, #f8fafc 100%);
  --coordination-card-bg: rgba(255, 255, 255, 0.9);
  --coordination-card-border: rgba(203, 213, 225, 0.8);
  --coordination-card-hover-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  --coordination-text-primary: #0f172a;
  --coordination-text-secondary: #475569;
  --coordination-border: rgba(203, 213, 225, 0.8);
}

/* Bruk variablene i komponenter */
.coordination-gradient-bg {
  background: var(--coordination-bg);
}

.coordination-sidebar {
  background: var(--coordination-sidebar-bg);
  border-right: 1px solid var(--coordination-border);
}

.coordination-card {
  background: var(--coordination-card-bg);
  border: 1px solid var(--coordination-card-border);
}

.coordination-card:hover {
  box-shadow: var(--coordination-card-hover-shadow);
}
```

---

## 📋 Komplett Komponenter-bibliotek

### Input og Form-komponenter
```tsx
// Standard søkeinput-komponent
const CoordinationSearchInput: React.FC<{
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}> = ({ value, onChange, placeholder = "Search features and docs...", className = "" }) => (
  <div className={`relative ${className}`}>
    <HiMagnifyingGlass className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-coordination-secondary" />
    <input
      type="text"
      placeholder={placeholder}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      className="
        w-full border rounded-lg pl-10 pr-4 py-2 text-sm transition-colors 
        focus:outline-none focus:ring-2 focus:ring-blue-500/50
        bg-coordination-card border-coordination text-coordination-primary
        placeholder-coordination-secondary
      "
    />
  </div>
);

// Standard knapp-komponenter
interface CoordinationButtonProps {
  variant?: 'primary' | 'secondary' | 'icon' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  className?: string;
}

const CoordinationButton: React.FC<CoordinationButtonProps> = ({
  variant = 'primary',
  size = 'md',
  children,
  onClick,
  disabled = false,
  className = ''
}) => {
  const baseClasses = "inline-flex items-center justify-center font-medium rounded-lg transition-all focus:outline-none focus:ring-2 focus:ring-offset-2";
  
  const variantClasses = {
    primary: "coordination-accent text-white hover:opacity-90 focus:ring-blue-500",
    secondary: "coordination-accent-secondary text-white hover:opacity-90 focus:ring-green-500",
    icon: "p-2 hover:bg-slate-700/50 text-coordination-secondary hover:text-coordination-primary focus:ring-blue-500",
    ghost: "border border-coordination text-coordination-primary hover:bg-coordination-card focus:ring-blue-500"
  };
  
  const sizeClasses = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-4 py-2 text-base", 
    lg: "px-6 py-3 text-lg"
  };
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        ${baseClasses} ${variantClasses[variant]} ${variant !== 'icon' ? sizeClasses[size] : ''}
        ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
        ${className}
      `}
    >
      {children}
    </button>
  );
};
```

### Layout-komponenter
```tsx
// Grid-system for kort og innhold
const CoordinationGrid: React.FC<{
  columns?: 1 | 2 | 3 | 4;
  gap?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}> = ({ columns = 2, gap = 'md', children, className = '' }) => {
  const gapClasses = {
    sm: 'gap-4',
    md: 'gap-6', 
    lg: 'gap-8'
  };
  
  return (
    <div className={`
      grid grid-cols-1 md:grid-cols-${columns} ${gapClasses[gap]} ${className}
    `}>
      {children}
    </div>
  );
};

// Stack-komponent for vertikal layout
const CoordinationStack: React.FC<{
  spacing?: 'sm' | 'md' | 'lg';
  children: React.ReactNode;
  className?: string;
}> = ({ spacing = 'md', children, className = '' }) => {
  const spacingClasses = {
    sm: 'space-y-2',
    md: 'space-y-4',
    lg: 'space-y-6'
  };
  
  return (
    <div className={`${spacingClasses[spacing]} ${className}`}>
      {children}
    </div>
  );
};

// Section-wrapper for hovedinnhold
const CoordinationSection: React.FC<{
  id?: string;
  title?: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}> = ({ id, title, description, children, className = '' }) => (
  <section id={id} className={`coordination-fade-in ${className}`}>
    {title && (
      <div className="mb-8">
        <h2 className="text-2xl font-bold text-coordination-primary mb-2">
          {title}
        </h2>
        {description && (
          <p className="text-coordination-secondary">
            {description}
          </p>
        )}
      </div>
    )}
    {children}
  </section>
);
```

### Hovedkomponenter
- **CoordinationCard**: Glassmorfisme-baserte kort med standardisert padding
- **CoordinationButton**: Konsistente knappper med alle varianter
- **CoordinationStatusBadge**: Status-indikatorer med ikoner
- **CoordinationProgress**: Animerte progresjonsbarer  
- **CoordinationTabs**: Navigasjon mellom seksjoner
- **CoordinationModal**: Overlay-dialogs
- **CoordinationTooltip**: Informative tooltips

---

## 🎨 Detaljerte Brukseksempler og Implementasjon

### Hovedkort med standardisert struktur
```tsx
// Standard kort-implementering med alle funksjoner
const ExampleCoordinationCard: React.FC = () => (
  <div className="coordination-card coordination-card-lg">
    <div className="flex items-center justify-between mb-4">
      <h3 className="text-lg font-semibold text-coordination-primary">
        System Status
      </h3>
      <CoordinationStatusBadge status="active" />
    </div>
    
    <CoordinationStack spacing="md">
      <CoordinationStatusList items={defaultSystemStatus} />
      
      <div className="pt-4 border-t border-coordination">
        <CoordinationButton variant="primary" size="sm">
          View Details
        </CoordinationButton>
      </div>
    </CoordinationStack>
  </div>
);
```

### Komplett sidebar-implementering
```tsx
const FullSidebarExample: React.FC = () => {
  const { isDarkTheme } = useCoordinationTheme();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState('coordination-overview');
  const [searchQuery, setSearchQuery] = useState('');

  const sections = [
    { 
      id: 'coordination-overview', 
      title: 'Coordination Overview', 
      icon: HiOutlineCube,
      description: 'System architecture and core concepts',
      status: 'active' as const
    },
    { 
      id: 'ai-features', 
      title: 'AI Features', 
      icon: HiCpuChip,
      description: 'AI-powered task suggestions and intelligence',
      status: 'ready' as const,
      isNew: true
    },
    // ... andre seksjoner
  ];

  const filteredSections = sections.filter(section =>
    section.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    section.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className={`coordination-sidebar ${sidebarOpen ? '' : 'closed'}`}>
      {/* Header */}
      <div className="flex items-center justify-between p-6 border-b border-coordination">
        <div>
          <h1 className="text-2xl font-bold text-coordination-primary">
            Claude Code Coordination
          </h1>
          <p className="text-sm text-coordination-secondary mt-1">
            Advanced Multi-Terminal AI System
          </p>
        </div>
        <CoordinationButton 
          variant="icon" 
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden"
        >
          <HiXMark className="w-6 h-6" />
        </CoordinationButton>
      </div>
      
      {/* Navigation */}
      <nav className="p-6">
        <p className="text-sm text-coordination-secondary mb-6 leading-relaxed">
          Comprehensive development system for Claude Code coordination features, 
          AI intelligence, and multi-terminal collaboration.
        </p>

        {/* Search */}
        <div className="mb-6">
          <CoordinationSearchInput
            value={searchQuery}
            onChange={setSearchQuery}
          />
        </div>

        {/* Navigation Links */}
        <CoordinationStack spacing="sm" className="mb-8">
          {filteredSections.map((section) => (
            <CoordinationNavItem
              key={section.id}
              {...section}
              isActive={activeSection === section.id}
              onClick={() => setActiveSection(section.id)}
            />
          ))}
        </CoordinationStack>

        {/* Status Card */}
        <div className="coordination-card coordination-card-sm mb-6">
          <h3 className="text-sm font-medium text-coordination-secondary mb-3">
            System Status
          </h3>
          <CoordinationStatusList items={defaultSystemStatus} />
        </div>

        {/* Settings */}
        <div className="border-t border-coordination pt-6">
          <h3 className="text-sm font-medium text-coordination-secondary mb-4 flex items-center gap-2">
            <HiCog6Tooth className="w-4 h-4" />
            Developer Settings
          </h3>
          
          <div className="flex items-center justify-between py-2">
            <span className="text-sm text-coordination-primary">Theme</span>
            <CoordinationThemeToggle />
          </div>
        </div>
      </nav>
    </div>
  );
};
```

### Page layout-template
```tsx
// Standard side-mal for alle sider i systemet
const CoordinationPageTemplate: React.FC<{
  title: string;
  description?: string;
  children: React.ReactNode;
}> = ({ title, description, children }) => (
  <CoordinationSection 
    title={title}
    description={description}
    className="p-8"
  >
    <CoordinationGrid columns={2} gap="lg">
      {children}
    </CoordinationGrid>
  </CoordinationSection>
);

// Eksempel på bruk
const AIFeaturesPage: React.FC = () => (
  <CoordinationPageTemplate
    title="AI Features"
    description="Advanced AI-powered capabilities for enhanced development workflow"
  >
    <div className="coordination-card coordination-card-lg">
      <h3 className="text-lg font-semibold text-coordination-primary mb-4">
        Task Suggestions
      </h3>
      {/* Innhold... */}
    </div>
    
    <div className="coordination-card coordination-card-lg">
      <h3 className="text-lg font-semibold text-coordination-primary mb-4">
        Code Intelligence
      </h3>
      {/* Innhold... */}
    </div>
  </CoordinationPageTemplate>
);
```

---

## 🏗️ Detaljert Implementeringsguide og Best Practices

### 1. Prosjekt-setup og grunnstruktur
```bash
# 1. Installer nødvendige avhengigheter
npm install tailwindcss @headlessui/react react-icons

# 2. Sett opp Tailwind config med custom tokens
# tailwind.config.js
module.exports = {
  content: ['./src/**/*.{js,ts,jsx,tsx}'],
  darkMode: ['class', '[data-theme="dark"]'],
  theme: {
    extend: {
      colors: {
        'coordination-primary': '#3b82f6',
        'coordination-secondary': '#10b981',
        // ... andre custom farger
      },
      fontFamily: {
        system: ['-apple-system', 'BlinkMacSystemFont', 'Segoe UI', 'Roboto', 'sans-serif']
      }
    }
  }
}
```

### 2. Fil- og mappestruktur
```
src/
├── components/
│   ├── coordination/           # Alle coordination-komponenter
│   │   ├── layout/
│   │   │   ├── CoordinationLayout.tsx
│   │   │   ├── CoordinationSidebar.tsx
│   │   │   └── CoordinationMobileHeader.tsx
│   │   ├── ui/
│   │   │   ├── CoordinationButton.tsx
│   │   │   ├── CoordinationCard.tsx
│   │   │   ├── CoordinationStatusBadge.tsx
│   │   │   └── CoordinationSearchInput.tsx
│   │   ├── navigation/
│   │   │   ├── CoordinationNavItem.tsx
│   │   │   └── CoordinationStatusList.tsx
│   │   └── index.ts            # Export alle komponenter
│   └── pages/                  # Siden-spesifikke komponenter
├── hooks/
│   ├── useCoordinationTheme.ts
│   └── useCoordinationNavigation.ts
├── contexts/
│   └── CoordinationThemeContext.tsx
├── styles/
│   ├── coordination.css        # Alle coordination-spesifikke styles
│   └── globals.css
└── types/
    └── coordination.types.ts   # Alle TypeScript interfaces
```

### 3. Tema-implementering (steg-for-steg)
```tsx
// 1. Installer ThemeProvider på root-nivå
function App() {
  return (
    <CoordinationThemeProvider>
      <div className="coordination-layout coordination-gradient-bg">
        {/* App innhold */}
      </div>
    </CoordinationThemeProvider>
  );
}

// 2. Bruk tema-hooks i komponenter
function MyComponent() {
  const { isDarkTheme, toggleTheme } = useCoordinationTheme();
  
  return (
    <div className="coordination-card">
      {/* Komponent innhold */}
    </div>
  );
}

// 3. CSS-variabler i coordination.css
@import 'tailwindcss/base';
@import 'tailwindcss/components';
@import 'tailwindcss/utilities';

/* Coordination-spesifikke styles */
@layer components {
  .coordination-card {
    @apply bg-coordination-card border-coordination backdrop-blur-sm rounded-xl transition-all;
  }
  
  .coordination-card:hover {
    @apply transform -translate-y-0.5;
    box-shadow: var(--coordination-card-hover-shadow);
  }
}
```

### 4. Component Development Guidelines

#### Navngivningskonvensjon
- **Alle komponenter**: Start med `Coordination` prefix
- **CSS-klasser**: Bruk `coordination-` prefix  
- **TypeScript interfaces**: `Coordination` + `ComponentName` + `Props`
- **Hooks**: `useCoordination` + `FeatureName`

#### Komponent-template
```tsx
// Standard template for alle coordination-komponenter
import React from 'react';
import { useCoordinationTheme } from '../hooks/useCoordinationTheme';

interface CoordinationComponentNameProps {
  // Props her...
  className?: string;
  children?: React.ReactNode;
}

export const CoordinationComponentName: React.FC<CoordinationComponentNameProps> = ({
  // Destructure props
  className = '',
  children
}) => {
  const { isDarkTheme } = useCoordinationTheme();
  
  return (
    <div className={`coordination-base-class ${className}`}>
      {children}
    </div>
  );
};

export default CoordinationComponentName;
```

### 5. Performance og tilgjengelighet
```tsx
// Lazy loading for store komponenter
const CoordinationDashboard = lazy(() => import('./components/coordination/CoordinationDashboard'));

// Accessibility best practices
const CoordinationButton: React.FC<ButtonProps> = ({ children, ...props }) => (
  <button
    className="coordination-btn"
    aria-label={props['aria-label'] || children?.toString()}
    role="button"
    tabIndex={0}
    {...props}
  >
    {children}
  </button>
);

// Error boundaries for robusthet
class CoordinationErrorBoundary extends React.Component {
  // Error boundary implementering...
}
```

### 6. Testing og kvalitetssikring
```typescript
// Component testing med Jest/RTL
import { render, screen } from '@testing-library/react';
import { CoordinationThemeProvider } from '../contexts/CoordinationThemeContext';
import CoordinationButton from '../components/coordination/ui/CoordinationButton';

const renderWithTheme = (component: React.ReactElement) => {
  return render(
    <CoordinationThemeProvider>
      {component}
    </CoordinationThemeProvider>
  );
};

test('CoordinationButton renders correctly', () => {
  renderWithTheme(<CoordinationButton>Test Button</CoordinationButton>);
  expect(screen.getByRole('button')).toBeInTheDocument();
});
```

### 7. Code review checklist
- [ ] Komponenten følger navngivningskonvensjonen
- [ ] CSS-variabler brukes i stedet for hardkodede farger
- [ ] Tema-support er implementert korrekt
- [ ] TypeScript interfaces er definert
- [ ] Accessibility attributes er lagt til
- [ ] Responsive design er testet
- [ ] Hover og fokus-tilstander fungerer
- [ ] Komponenten er dokumentert med JSDoc

---

## 📐 Design-tokens

### Spacing
```css
--spacing-xs: 0.25rem;   /* 4px */
--spacing-sm: 0.5rem;    /* 8px */
--spacing-md: 1rem;      /* 16px */
--spacing-lg: 1.5rem;    /* 24px */
--spacing-xl: 2rem;      /* 32px */
--spacing-2xl: 3rem;     /* 48px */
```

### Border radius
```css
--radius-sm: 6px;
--radius-md: 8px;
--radius-lg: 12px;
--radius-xl: 16px;
```

### Shadows
```css
--shadow-sm: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
--shadow-md: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
--shadow-lg: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
--shadow-xl: 0 20px 25px -5px rgba(0, 0, 0, 0.1);
```

---

## 🎯 Design Consistency Checklist

### For hver ny side/komponent:
- [ ] **Layout**: Bruker `CoordinationLayout` og standard spacing
- [ ] **Farger**: Kun CSS-variabler, ingen hardkodede hex-verdier
- [ ] **Tema**: Støtter både mørk og lys tema
- [ ] **Komponenter**: Bruker eksisterende `Coordination*` komponenter
- [ ] **Navigasjon**: Følger standard `NavigationSection` interface
- [ ] **Status**: Bruker `CoordinationStatusBadge` for alle indikatorer
- [ ] **Animasjoner**: Standard transition-klasser anvendt
- [ ] **Responsivitet**: Testet på mobile, tablet og desktop
- [ ] **Accessibility**: Riktige ARIA-labels og keyboard navigation
- [ ] **Performance**: Lazy loading for store komponenter

### CSS og styling:
- [ ] **Custom properties**: Alle farger som CSS-variabler
- [ ] **Tailwind**: Konsistent bruk av spacing og størrelse-klasser
- [ ] **Glassmorfisme**: `backdrop-filter: blur()` på kort og overlays
- [ ] **Hover-effekter**: Konsistent løft og skygge-effekter
- [ ] **Border radius**: Standard `12px` for kort, `8px` for mindre elementer

### TypeScript og kode:
- [ ] **Interfaces**: Alle props definert med TypeScript
- [ ] **Export**: Standard export i index.ts-filer
- [ ] **Hooks**: Bruk `useCoordinationTheme` for tema-funksjonalitet
- [ ] **Error handling**: Wrapped i ErrorBoundary der nødvendig

---

## 📖 Quick Reference

### Standard klasser (kopier og lim inn):
```css
/* Layout */
.coordination-layout            /* Main layout container */
.coordination-gradient-bg       /* Background gradient */
.coordination-sidebar           /* Sidebar container */
.coordination-main-content      /* Main content area */

/* Komponenter */
.coordination-card             /* Standard kort */
.coordination-card-sm          /* Kort med liten padding */
.coordination-card-md          /* Kort med medium padding */
.coordination-card-lg          /* Kort med stor padding */

/* Tekst og farger */
.text-coordination-primary     /* Hovedtekst */
.text-coordination-secondary   /* Sekundærtekst */
.border-coordination          /* Standard border */

/* Animasjoner */
.transition-standard          /* Standard transition */
.coordination-fade-in         /* Fade-in animasjon */
.card-hover                   /* Kort hover-effekt */
```

### Standard TypeScript interfaces:
```typescript
// Kopier disse til types/coordination.types.ts
interface NavigationSection {
  id: string;
  title: string;
  icon: IconComponent;
  description: string;
  status?: StatusType;
  badge?: string | number;
  isNew?: boolean;
  isDisabled?: boolean;
}

interface StatusItem {
  label: string;
  status: StatusType;
  value?: string | number;
  description?: string;
}

type StatusType = 'active' | 'ready' | 'connected' | 'protected' | 'warning' | 'error' | 'inactive' | 'loading';
```

---

*Denne utvidede designmalen sikrer 100% konsistens på tvers av hele Claude Code Coordination-systemet. Alle nye sider og komponenter skal følge disse retningslinjene nøye.*