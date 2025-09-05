import React, { useState } from 'react';
import { 
  HiCpuChip,
  HiLightBulb,
  HiBeaker,
  HiShieldCheck,
  HiChartBarSquare,
  HiCodeBracket,
  HiPlay,
  HiSparkles
} from 'react-icons/hi2';

interface AIFeaturesProps {
  isDarkTheme: boolean;
}

const AIFeatures: React.FC<AIFeaturesProps> = ({ isDarkTheme }) => {
  const [activeDemo, setActiveDemo] = useState('task-suggestion');

  const aiCapabilities = [
    {
      id: 'task-suggestion',
      icon: HiLightBulb,
      title: 'Intelligent Task Suggestions',
      description: 'AI analyzes your codebase and suggests relevant tasks based on patterns, complexity, and project context.',
      features: [
        'Code complexity analysis',
        'Pattern recognition',
        'Context-aware suggestions',
        'Learning from completion history'
      ],
      demo: {
        input: 'Working on authentication system...',
        output: [
          '🎯 Suggested: Add password strength validation',
          '🔒 Suggested: Implement rate limiting for login attempts', 
          '✨ Suggested: Add social OAuth providers',
          '🛡️ Suggested: Set up session management'
        ]
      }
    },
    {
      id: 'conflict-prediction',
      icon: HiShieldCheck,
      title: 'Conflict Prediction',
      description: 'Advanced AI engine predicts potential conflicts before they happen using dependency analysis and change patterns.',
      features: [
        'Dependency graph analysis',
        'Change impact prediction',
        'Risk assessment scoring',
        'Preventive recommendations'
      ],
      demo: {
        input: 'Editing src/auth/login.tsx...',
        output: [
          '⚠️ Potential conflict: UserContext also being edited',
          '🔍 Impact analysis: 3 dependent components affected',
          '💡 Suggestion: Coordinate with session on auth/session.tsx',
          '🛡️ Auto-lock: Protecting shared types until coordination'
        ]
      }
    },
    {
      id: 'code-intelligence',
      icon: HiCodeBracket,
      title: 'Code Intelligence',
      description: 'Deep code understanding with AST parsing, semantic analysis, and architectural insights.',
      features: [
        'AST parsing and analysis',
        'Semantic code understanding',
        'Architecture pattern detection',
        'API endpoint mapping'
      ],
      demo: {
        input: 'Analyzing project structure...',
        output: [
          '🏗️ Architecture: React + Express.js detected',
          '📊 Complexity score: 7.2/10 (High)',
          '🔗 Found 23 API endpoints, 15 components',
          '📈 Suggested optimization: Extract shared hooks'
        ]
      }
    },
    {
      id: 'learning-engine',
      icon: HiChartBarSquare,
      title: 'Adaptive Learning',
      description: 'AI learns from your development patterns, preferences, and team dynamics to improve suggestions over time.',
      features: [
        'Developer behavior analysis',
        'Success pattern recognition',
        'Preference learning',
        'Team dynamics modeling'
      ],
      demo: {
        input: 'Session analysis complete...',
        output: [
          '📊 Your preference: TypeScript strict mode (95% usage)',
          '⚡ Fast at: Component architecture (avg 12min)',
          '🎯 Improvement area: Testing coverage (current 68%)',
          '👥 Team sync: Best collaboration time 14:00-16:00'
        ]
      }
    }
  ];

  const performanceMetrics = [
    { label: 'Task Accuracy', value: '94%', color: 'green' },
    { label: 'Conflict Prevention', value: '89%', color: 'blue' },
    { label: 'Code Analysis Speed', value: '<2s', color: 'purple' },
    { label: 'Learning Adaptation', value: '97%', color: 'orange' }
  ];

  return (
    <section id="ai-features" className="p-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 coordination-accent rounded-2xl flex items-center justify-center">
              <HiCpuChip className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h1 className={`text-4xl font-bold mb-6 ${
            isDarkTheme ? 'text-white' : 'text-slate-900'
          }`}>
            AI-Powered Intelligence
          </h1>
          
          <p className={`text-lg leading-relaxed max-w-3xl mx-auto ${
            isDarkTheme ? 'text-slate-300' : 'text-slate-600'
          }`}>
            Advanced artificial intelligence that understands your code, predicts conflicts, 
            and provides intelligent suggestions to enhance your development workflow.
          </p>
        </div>

        {/* Performance Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {performanceMetrics.map((metric, index) => (
            <div key={index} className="coordination-card p-6 text-center">
              <div className={`text-3xl font-bold mb-2 ${
                metric.color === 'green' ? 'text-green-400' :
                metric.color === 'blue' ? 'text-blue-400' :
                metric.color === 'purple' ? 'text-purple-400' :
                'text-orange-400'
              }`}>
                {metric.value}
              </div>
              <div className={`text-sm ${isDarkTheme ? 'text-slate-400' : 'text-slate-600'}`}>
                {metric.label}
              </div>
            </div>
          ))}
        </div>

        {/* AI Capabilities */}
        <div className="mb-16">
          <h2 className={`text-2xl font-bold mb-8 ${
            isDarkTheme ? 'text-white' : 'text-slate-900'
          }`}>
            Core AI Capabilities
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
            {aiCapabilities.map((capability) => (
              <button
                key={capability.id}
                onClick={() => setActiveDemo(capability.id)}
                className={`coordination-card p-6 text-left transition-all duration-300 ${
                  activeDemo === capability.id 
                    ? isDarkTheme 
                      ? 'ring-2 ring-blue-400 bg-blue-500/10' 
                      : 'ring-2 ring-blue-500 bg-blue-50'
                    : ''
                }`}
              >
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center mb-4 ${
                  activeDemo === capability.id 
                    ? 'bg-blue-500/20 text-blue-400' 
                    : isDarkTheme 
                      ? 'bg-slate-700 text-slate-400' 
                      : 'bg-slate-100 text-slate-600'
                }`}>
                  <capability.icon className="w-6 h-6" />
                </div>
                
                <h3 className={`text-lg font-semibold mb-2 ${
                  isDarkTheme ? 'text-white' : 'text-slate-900'
                }`}>
                  {capability.title}
                </h3>
                
                <p className={`text-sm leading-relaxed ${
                  isDarkTheme ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  {capability.description}
                </p>
              </button>
            ))}
          </div>

          {/* Active Demo */}
          {activeDemo && (
            <div className="coordination-card p-8">
              <div className="flex items-center gap-3 mb-6">
                <HiPlay className="w-5 h-5 text-green-400" />
                <h3 className={`text-xl font-semibold ${
                  isDarkTheme ? 'text-white' : 'text-slate-900'
                }`}>
                  {aiCapabilities.find(c => c.id === activeDemo)?.title} Demo
                </h3>
                <HiSparkles className="w-5 h-5 text-yellow-400 animate-pulse" />
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                <div>
                  <h4 className={`text-sm font-medium mb-3 ${
                    isDarkTheme ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    Input Context
                  </h4>
                  <div className={`p-4 rounded-lg font-mono text-sm ${
                    isDarkTheme ? 'bg-slate-800 text-green-400' : 'bg-slate-100 text-green-600'
                  }`}>
                    {aiCapabilities.find(c => c.id === activeDemo)?.demo.input}
                  </div>

                  <h4 className={`text-sm font-medium mt-6 mb-3 ${
                    isDarkTheme ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    Key Features
                  </h4>
                  <ul className="space-y-2">
                    {aiCapabilities.find(c => c.id === activeDemo)?.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-1.5 h-1.5 rounded-full bg-blue-400"></div>
                        <span className={`text-sm ${
                          isDarkTheme ? 'text-slate-400' : 'text-slate-600'
                        }`}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div>
                  <h4 className={`text-sm font-medium mb-3 ${
                    isDarkTheme ? 'text-slate-300' : 'text-slate-700'
                  }`}>
                    AI Response
                  </h4>
                  <div className={`p-4 rounded-lg ${
                    isDarkTheme ? 'bg-slate-800' : 'bg-slate-100'
                  }`}>
                    <div className="space-y-2">
                      {aiCapabilities.find(c => c.id === activeDemo)?.demo.output.map((line, index) => (
                        <div 
                          key={index} 
                          className={`font-mono text-sm flex items-start gap-2 ${
                            isDarkTheme ? 'text-slate-300' : 'text-slate-700'
                          }`}
                          style={{ animationDelay: `${index * 200}ms` }}
                        >
                          <span className="text-blue-400">$</span>
                          <span>{line}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Implementation Details */}
        <div className="coordination-card p-8">
          <h2 className={`text-2xl font-bold mb-6 ${
            isDarkTheme ? 'text-white' : 'text-slate-900'
          }`}>
            Technical Implementation
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
                isDarkTheme ? 'text-white' : 'text-slate-900'
              }`}>
                <HiBeaker className="w-5 h-5 text-blue-400" />
                Machine Learning
              </h3>
              <ul className="space-y-2">
                <li className={`text-sm ${isDarkTheme ? 'text-slate-400' : 'text-slate-600'}`}>
                  • Pattern recognition algorithms
                </li>
                <li className={`text-sm ${isDarkTheme ? 'text-slate-400' : 'text-slate-600'}`}>
                  • Behavioral analysis models
                </li>
                <li className={`text-sm ${isDarkTheme ? 'text-slate-400' : 'text-slate-600'}`}>
                  • Adaptive learning networks
                </li>
                <li className={`text-sm ${isDarkTheme ? 'text-slate-400' : 'text-slate-600'}`}>
                  • Predictive conflict modeling
                </li>
              </ul>
            </div>

            <div>
              <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
                isDarkTheme ? 'text-white' : 'text-slate-900'
              }`}>
                <HiCodeBracket className="w-5 h-5 text-green-400" />
                Code Analysis
              </h3>
              <ul className="space-y-2">
                <li className={`text-sm ${isDarkTheme ? 'text-slate-400' : 'text-slate-600'}`}>
                  • AST parsing and traversal
                </li>
                <li className={`text-sm ${isDarkTheme ? 'text-slate-400' : 'text-slate-600'}`}>
                  • Semantic analysis engine
                </li>
                <li className={`text-sm ${isDarkTheme ? 'text-slate-400' : 'text-slate-600'}`}>
                  • Dependency graph mapping
                </li>
                <li className={`text-sm ${isDarkTheme ? 'text-slate-400' : 'text-slate-600'}`}>
                  • Impact assessment algorithms
                </li>
              </ul>
            </div>

            <div>
              <h3 className={`text-lg font-semibold mb-4 flex items-center gap-2 ${
                isDarkTheme ? 'text-white' : 'text-slate-900'
              }`}>
                <HiChartBarSquare className="w-5 h-5 text-purple-400" />
                Performance
              </h3>
              <ul className="space-y-2">
                <li className={`text-sm ${isDarkTheme ? 'text-slate-400' : 'text-slate-600'}`}>
                  • In-memory caching (30s TTL)
                </li>
                <li className={`text-sm ${isDarkTheme ? 'text-slate-400' : 'text-slate-600'}`}>
                  • Batch processing optimization
                </li>
                <li className={`text-sm ${isDarkTheme ? 'text-slate-400' : 'text-slate-600'}`}>
                  • Lazy loading strategies
                </li>
                <li className={`text-sm ${isDarkTheme ? 'text-slate-400' : 'text-slate-600'}`}>
                  • Background async operations
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIFeatures;