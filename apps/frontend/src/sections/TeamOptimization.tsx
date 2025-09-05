import React, { useState } from 'react';
import { 
  HiUsers,
  HiAcademicCap,
  HiChartBarSquare,
  HiLightBulb,
  HiCog6Tooth,
  HiSparkles,
  HiTrophy,
  HiArrowTrendingUp
} from 'react-icons/hi2';

interface TeamOptimizationProps {
  isDarkTheme: boolean;
}

const TeamOptimization: React.FC<TeamOptimizationProps> = ({ isDarkTheme }) => {
  const [selectedProjectType, setSelectedProjectType] = useState('ecommerce');

  const projectTypes = [
    {
      id: 'ecommerce',
      name: 'E-commerce Platform',
      icon: '🛒',
      complexity: 'High',
      timeline: '6-8 months',
      teamSize: '5-7 developers',
      description: 'Full-scale e-commerce solution with payment processing, inventory management, and user authentication.'
    },
    {
      id: 'webapp',
      name: 'Web Application',
      icon: '💻',
      complexity: 'Medium',
      timeline: '3-4 months',
      teamSize: '3-5 developers',
      description: 'Interactive web application with modern frontend and robust backend API.'
    },
    {
      id: 'mobile',
      name: 'Mobile App',
      icon: '📱',
      complexity: 'High',
      timeline: '4-6 months',
      teamSize: '4-6 developers',
      description: 'Cross-platform mobile application with native features and cloud synchronization.'
    },
    {
      id: 'api',
      name: 'API Service',
      icon: '🔌',
      complexity: 'Medium',
      timeline: '2-3 months',
      teamSize: '2-4 developers',
      description: 'RESTful API service with microservices architecture and comprehensive documentation.'
    }
  ];

  const teamCompositions = {
    ecommerce: [
      {
        role: 'Frontend Specialist',
        icon: HiUsers,
        expertise: ['React/Vue.js', 'TypeScript', 'UI/UX Design', 'E-commerce UX'],
        responsibility: 'Product catalog, shopping cart, checkout flow, user dashboard',
        weight: 0.3,
        experience: 'Senior (5+ years)'
      },
      {
        role: 'Backend Specialist',
        icon: HiCog6Tooth,
        expertise: ['Node.js/Python', 'Database Design', 'Payment APIs', 'Security'],
        responsibility: 'Order management, payment processing, inventory API, user authentication',
        weight: 0.25,
        experience: 'Senior (5+ years)'
      },
      {
        role: 'Full-Stack Developer',
        icon: HiAcademicCap,
        expertise: ['React + Node.js', 'Database', 'API Integration', 'Testing'],
        responsibility: 'Feature implementation, bug fixes, integration testing',
        weight: 0.2,
        experience: 'Mid-level (3+ years)'
      },
      {
        role: 'DevOps Engineer',
        icon: HiChartBarSquare,
        expertise: ['Docker', 'AWS/Azure', 'CI/CD', 'Monitoring'],
        responsibility: 'Deployment, scaling, performance monitoring, security audits',
        weight: 0.15,
        experience: 'Senior (4+ years)'
      },
      {
        role: 'Product Manager',
        icon: HiLightBulb,
        expertise: ['Product Strategy', 'User Research', 'Analytics', 'Roadmap'],
        responsibility: 'Requirements gathering, sprint planning, stakeholder communication',
        weight: 0.1,
        experience: 'Senior (4+ years)'
      }
    ],
    webapp: [
      {
        role: 'Frontend Developer',
        icon: HiUsers,
        expertise: ['React/Vue.js', 'TypeScript', 'Responsive Design'],
        responsibility: 'User interface, component library, state management',
        weight: 0.4,
        experience: 'Mid-Senior (3+ years)'
      },
      {
        role: 'Backend Developer',
        icon: HiCog6Tooth,
        expertise: ['Node.js/Python', 'Database', 'API Design'],
        responsibility: 'REST API, database schema, business logic',
        weight: 0.35,
        experience: 'Mid-Senior (3+ years)'
      },
      {
        role: 'Full-Stack Developer',
        icon: HiAcademicCap,
        expertise: ['Frontend + Backend', 'Testing', 'Integration'],
        responsibility: 'Feature development, testing, bug fixes',
        weight: 0.25,
        experience: 'Mid-level (2+ years)'
      }
    ]
  };

  const optimizationMetrics = [
    { 
      label: 'Team Efficiency', 
      value: '87%', 
      trend: '+12%',
      color: 'green',
      description: 'Overall team productivity and collaboration effectiveness'
    },
    { 
      label: 'Skill Match', 
      value: '94%', 
      trend: '+8%',
      color: 'blue',
      description: 'How well team member skills align with project requirements'
    },
    { 
      label: 'Delivery Speed', 
      value: '2.3x', 
      trend: '+45%',
      color: 'purple',
      description: 'Feature delivery speed compared to industry average'
    },
    { 
      label: 'Quality Score', 
      value: '9.2/10', 
      trend: '+0.8',
      color: 'orange',
      description: 'Code quality and bug reduction metrics'
    }
  ];

  const selectedProject = projectTypes.find(p => p.id === selectedProjectType);
  const selectedTeam = teamCompositions[selectedProjectType as keyof typeof teamCompositions] || [];

  return (
    <section id="team-optimization" className="p-8 min-h-screen">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="flex justify-center mb-6">
            <div className="w-16 h-16 coordination-accent-secondary rounded-2xl flex items-center justify-center">
              <HiUsers className="w-8 h-8 text-white" />
            </div>
          </div>
          
          <h1 className={`text-4xl font-bold mb-6 ${
            isDarkTheme ? 'text-white' : 'text-slate-900'
          }`}>
            AI Team Optimization
          </h1>
          
          <p className={`text-lg leading-relaxed max-w-3xl mx-auto ${
            isDarkTheme ? 'text-slate-300' : 'text-slate-600'
          }`}>
            Intelligent team composition based on project analysis, developer expertise, and proven 
            collaboration patterns to maximize productivity and code quality.
          </p>
        </div>

        {/* Optimization Metrics */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-16">
          {optimizationMetrics.map((metric, index) => (
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
                <div className="flex items-center gap-1">
                  <HiArrowTrendingUp className="w-3 h-3 text-green-400" />
                  <span className="text-xs text-green-400 font-medium">{metric.trend}</span>
                </div>
              </div>
              
              <div className={`text-sm font-medium mb-1 ${
                isDarkTheme ? 'text-slate-300' : 'text-slate-700'
              }`}>
                {metric.label}
              </div>
              
              <div className={`text-xs leading-relaxed ${
                isDarkTheme ? 'text-slate-500' : 'text-slate-500'
              }`}>
                {metric.description}
              </div>
            </div>
          ))}
        </div>

        {/* Project Type Selection */}
        <div className="mb-12">
          <h2 className={`text-2xl font-bold mb-6 ${
            isDarkTheme ? 'text-white' : 'text-slate-900'
          }`}>
            Project Type Analysis
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {projectTypes.map((project) => (
              <button
                key={project.id}
                onClick={() => setSelectedProjectType(project.id)}
                className={`coordination-card p-6 text-left transition-all duration-300 ${
                  selectedProjectType === project.id 
                    ? isDarkTheme 
                      ? 'ring-2 ring-green-400 bg-green-500/10' 
                      : 'ring-2 ring-green-500 bg-green-50'
                    : ''
                }`}
              >
                <div className="text-3xl mb-3">{project.icon}</div>
                <h3 className={`text-lg font-semibold mb-2 ${
                  isDarkTheme ? 'text-white' : 'text-slate-900'
                }`}>
                  {project.name}
                </h3>
                <div className="space-y-1 text-sm">
                  <div className={`${isDarkTheme ? 'text-slate-400' : 'text-slate-600'}`}>
                    Complexity: <span className="font-medium">{project.complexity}</span>
                  </div>
                  <div className={`${isDarkTheme ? 'text-slate-400' : 'text-slate-600'}`}>
                    Timeline: <span className="font-medium">{project.timeline}</span>
                  </div>
                  <div className={`${isDarkTheme ? 'text-slate-400' : 'text-slate-600'}`}>
                    Team: <span className="font-medium">{project.teamSize}</span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Selected Project Details */}
          {selectedProject && (
            <div className="coordination-card p-6">
              <div className="flex items-center gap-4 mb-4">
                <div className="text-4xl">{selectedProject.icon}</div>
                <div>
                  <h3 className={`text-xl font-semibold ${
                    isDarkTheme ? 'text-white' : 'text-slate-900'
                  }`}>
                    {selectedProject.name}
                  </h3>
                  <p className={`${isDarkTheme ? 'text-slate-400' : 'text-slate-600'}`}>
                    {selectedProject.description}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Optimized Team Composition */}
        <div className="mb-16">
          <div className="flex items-center gap-3 mb-8">
            <h2 className={`text-2xl font-bold ${
              isDarkTheme ? 'text-white' : 'text-slate-900'
            }`}>
              Optimized Team Composition
            </h2>
            <HiSparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
            <span className={`text-sm px-3 py-1 rounded-full ${
              isDarkTheme ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'
            }`}>
              AI Optimized
            </span>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {selectedTeam.map((member, index) => (
              <div key={index} className="coordination-card p-6">
                <div className="flex items-start gap-4">
                  <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
                    isDarkTheme ? 'bg-slate-700 text-slate-300' : 'bg-slate-100 text-slate-600'
                  }`}>
                    <member.icon className="w-6 h-6" />
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className={`text-lg font-semibold ${
                        isDarkTheme ? 'text-white' : 'text-slate-900'
                      }`}>
                        {member.role}
                      </h3>
                      <div className="flex items-center gap-2">
                        <span className={`text-xs px-2 py-1 rounded-full ${
                          isDarkTheme ? 'bg-blue-500/20 text-blue-400' : 'bg-blue-100 text-blue-700'
                        }`}>
                          {Math.round(member.weight * 100)}% allocation
                        </span>
                        <HiTrophy className="w-4 h-4 text-yellow-400" />
                      </div>
                    </div>

                    <div className="mb-3">
                      <span className={`text-xs font-medium ${
                        isDarkTheme ? 'text-slate-400' : 'text-slate-600'
                      }`}>
                        Experience: {member.experience}
                      </span>
                    </div>

                    <p className={`text-sm mb-3 ${
                      isDarkTheme ? 'text-slate-400' : 'text-slate-600'
                    }`}>
                      {member.responsibility}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {member.expertise.map((skill, skillIndex) => (
                        <span 
                          key={skillIndex}
                          className={`text-xs px-2 py-1 rounded-full ${
                            isDarkTheme 
                              ? 'bg-slate-700/50 text-slate-300' 
                              : 'bg-slate-100 text-slate-600'
                          }`}
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* AI Analysis Insights */}
        <div className="coordination-card p-8">
          <h2 className={`text-2xl font-bold mb-6 flex items-center gap-3 ${
            isDarkTheme ? 'text-white' : 'text-slate-900'
          }`}>
            <HiLightBulb className="w-6 h-6 text-yellow-400" />
            AI Analysis & Insights
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className={`text-lg font-semibold mb-4 ${
                isDarkTheme ? 'text-white' : 'text-slate-900'
              }`}>
                Skill Optimization
              </h3>
              <ul className="space-y-2">
                <li className={`text-sm flex items-start gap-2 ${
                  isDarkTheme ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  <span className="text-green-400">✓</span>
                  <span>Frontend-backend ratio optimized for project type</span>
                </li>
                <li className={`text-sm flex items-start gap-2 ${
                  isDarkTheme ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  <span className="text-green-400">✓</span>
                  <span>Senior developers in critical architectural roles</span>
                </li>
                <li className={`text-sm flex items-start gap-2 ${
                  isDarkTheme ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  <span className="text-green-400">✓</span>
                  <span>Cross-training opportunities identified</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className={`text-lg font-semibold mb-4 ${
                isDarkTheme ? 'text-white' : 'text-slate-900'
              }`}>
                Collaboration Patterns
              </h3>
              <ul className="space-y-2">
                <li className={`text-sm flex items-start gap-2 ${
                  isDarkTheme ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  <span className="text-blue-400">◦</span>
                  <span>Optimal team size for communication efficiency</span>
                </li>
                <li className={`text-sm flex items-start gap-2 ${
                  isDarkTheme ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  <span className="text-blue-400">◦</span>
                  <span>Complementary skill sets for knowledge sharing</span>
                </li>
                <li className={`text-sm flex items-start gap-2 ${
                  isDarkTheme ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  <span className="text-blue-400">◦</span>
                  <span>Experience levels balanced for mentoring</span>
                </li>
              </ul>
            </div>

            <div>
              <h3 className={`text-lg font-semibold mb-4 ${
                isDarkTheme ? 'text-white' : 'text-slate-900'
              }`}>
                Success Predictions
              </h3>
              <ul className="space-y-2">
                <li className={`text-sm flex items-start gap-2 ${
                  isDarkTheme ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  <span className="text-purple-400">▶</span>
                  <span>94% probability of on-time delivery</span>
                </li>
                <li className={`text-sm flex items-start gap-2 ${
                  isDarkTheme ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  <span className="text-purple-400">▶</span>
                  <span>87% expected code quality score</span>
                </li>
                <li className={`text-sm flex items-start gap-2 ${
                  isDarkTheme ? 'text-slate-400' : 'text-slate-600'
                }`}>
                  <span className="text-purple-400">▶</span>
                  <span>Low risk of team conflicts or blockers</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default TeamOptimization;