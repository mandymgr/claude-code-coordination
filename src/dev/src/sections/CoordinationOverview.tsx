import React from 'react';
import { 
  HiOutlineCube,
  HiCpuChip,
  HiUsers,
  HiGlobeAlt,
  HiShieldCheck,
  HiArrowRight,
  HiSparkles
} from 'react-icons/hi2';

interface CoordinationOverviewProps {
  isDarkTheme: boolean;
}

const CoordinationOverview: React.FC<CoordinationOverviewProps> = ({ isDarkTheme }) => {
  const features = [
    {
      icon: HiCpuChip,
      title: 'AI-Powered Intelligence',
      description: 'Advanced AI engine with code analysis, conflict prediction, and intelligent task suggestions',
      status: 'Active',
      color: 'blue'
    },
    {
      icon: HiUsers,
      title: 'Team Optimization',
      description: 'Smart team composition based on project analysis and developer expertise tracking',
      status: 'Ready',
      color: 'green'
    },
    {
      icon: HiGlobeAlt,
      title: 'Real-time Coordination',
      description: 'WebSocket-based live collaboration with instant synchronization across terminals',
      status: 'Connected',
      color: 'purple'
    },
    {
      icon: HiShieldCheck,
      title: 'File Lock Management',
      description: 'Intelligent file locking system preventing conflicts with automatic resolution',
      status: 'Protected',
      color: 'orange'
    }
  ];

  const architectureComponents = [
    {
      name: 'AI Coordinator',
      description: 'Core intelligence engine with machine learning capabilities',
      location: 'src/ai-coordinator.js',
      features: ['Task complexity analysis', 'Conflict prediction', 'Session profiling']
    },
    {
      name: 'Advanced AI Engine',
      description: 'Code intelligence with dependency graph analysis',
      location: 'src/advanced-ai-engine.js',
      features: ['AST parsing', 'Semantic analysis', 'Impact prediction']
    },
    {
      name: 'Realtime Hub',
      description: 'WebSocket server for live collaboration',
      location: 'src/realtime-hub.js',
      features: ['Room management', 'Voice coordination', 'Live code sharing']
    },
    {
      name: 'Team Optimizer',
      description: 'Project-based team composition AI',
      location: 'src/team-optimization-ai.js',
      features: ['Project type detection', 'Role matching', 'Performance metrics']
    }
  ];

  return (
    <section id="coordination-overview" className="p-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="relative">
              <div className="w-20 h-20 coordination-accent rounded-2xl flex items-center justify-center mb-4">
                <HiOutlineCube className="w-10 h-10 text-white" />
              </div>
              <div className="absolute -top-2 -right-2">
                <HiSparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
              </div>
            </div>
          </div>
          
          <h1 className={`text-5xl font-bold mb-6 ${
            isDarkTheme ? 'text-white' : 'text-slate-900'
          }`}>
            Claude Code Coordination
          </h1>
          
          <p className={`text-xl leading-relaxed max-w-3xl mx-auto ${
            isDarkTheme ? 'text-slate-300' : 'text-slate-600'
          }`}>
            Advanced multi-terminal AI coordination system that enables seamless collaboration between 
            multiple Claude Code instances with intelligent conflict resolution, real-time synchronization, 
            and AI-powered team optimization.
          </p>

          <div className="flex justify-center gap-4 mt-8">
            <button className="coordination-accent text-white px-8 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-300 flex items-center gap-2">
              Get Started
              <HiArrowRight className="w-4 h-4" />
            </button>
            <button className={`border px-8 py-3 rounded-lg font-medium transition-all duration-300 ${
              isDarkTheme 
                ? 'border-slate-600 text-slate-300 hover:border-slate-500 hover:text-white' 
                : 'border-slate-300 text-slate-700 hover:border-slate-400 hover:text-slate-900'
            }`}>
              View Documentation
            </button>
          </div>
        </div>

        {/* Feature Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {features.map((feature, index) => (
            <div key={index} className="coordination-card p-6">
              <div className="flex items-start justify-between mb-4">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                  feature.color === 'blue' ? 'bg-blue-500/20 text-blue-400' :
                  feature.color === 'green' ? 'bg-green-500/20 text-green-400' :
                  feature.color === 'purple' ? 'bg-purple-500/20 text-purple-400' :
                  'bg-orange-500/20 text-orange-400'
                }`}>
                  <feature.icon className="w-6 h-6" />
                </div>
                <span className={`text-xs px-2 py-1 rounded-full font-medium ${
                  feature.color === 'blue' ? 'bg-blue-500/20 text-blue-400' :
                  feature.color === 'green' ? 'bg-green-500/20 text-green-400' :
                  feature.color === 'purple' ? 'bg-purple-500/20 text-purple-400' :
                  'bg-orange-500/20 text-orange-400'
                }`}>
                  {feature.status}
                </span>
              </div>
              
              <h3 className={`text-lg font-semibold mb-2 ${
                isDarkTheme ? 'text-white' : 'text-slate-900'
              }`}>
                {feature.title}
              </h3>
              
              <p className={`text-sm leading-relaxed ${
                isDarkTheme ? 'text-slate-400' : 'text-slate-600'
              }`}>
                {feature.description}
              </p>
            </div>
          ))}
        </div>

        {/* System Architecture */}
        <div className="mb-16">
          <h2 className={`text-3xl font-bold text-center mb-12 ${
            isDarkTheme ? 'text-white' : 'text-slate-900'
          }`}>
            System Architecture
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {architectureComponents.map((component, index) => (
              <div key={index} className="coordination-card p-6">
                <div className="flex items-start gap-4">
                  <div className="w-3 h-3 rounded-full bg-green-400 mt-2 flex-shrink-0"></div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h3 className={`text-lg font-semibold ${
                        isDarkTheme ? 'text-white' : 'text-slate-900'
                      }`}>
                        {component.name}
                      </h3>
                      <code className={`text-xs px-2 py-1 rounded ${
                        isDarkTheme ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'
                      }`}>
                        {component.location}
                      </code>
                    </div>
                    
                    <p className={`text-sm mb-3 ${
                      isDarkTheme ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      {component.description}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {component.features.map((feature, featureIndex) => (
                        <span 
                          key={featureIndex}
                          className={`text-xs px-2 py-1 rounded-full ${
                            isDarkTheme 
                              ? 'bg-slate-700/50 text-slate-300' 
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {feature}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="coordination-card p-6 text-center">
            <div className="text-3xl font-bold text-blue-400 mb-2">95%</div>
            <div className={`text-sm ${isDarkTheme ? 'text-slate-400' : 'text-slate-600'}`}>
              Performance Boost
            </div>
          </div>
          <div className="coordination-card p-6 text-center">
            <div className="text-3xl font-bold text-green-400 mb-2">Zero</div>
            <div className={`text-sm ${isDarkTheme ? 'text-slate-400' : 'text-slate-600'}`}>
              File Conflicts
            </div>
          </div>
          <div className="coordination-card p-6 text-center">
            <div className="text-3xl font-bold text-purple-400 mb-2">Real-time</div>
            <div className={`text-sm ${isDarkTheme ? 'text-slate-400' : 'text-slate-600'}`}>
              Synchronization
            </div>
          </div>
          <div className="coordination-card p-6 text-center">
            <div className="text-3xl font-bold text-orange-400 mb-2">AI</div>
            <div className={`text-sm ${isDarkTheme ? 'text-slate-400' : 'text-slate-600'}`}>
              Powered
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default CoordinationOverview;