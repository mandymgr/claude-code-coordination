import React, { useState, useEffect } from 'react';
import { 
  HiCpuChip, 
  HiMagnifyingGlass, 
  HiCog6Tooth,
  HiArchiveBox,
  HiLightBulb,
  HiRocketLaunch,
  HiUsers,
  HiBeaker
} from 'react-icons/hi2';

// Import our new services
import { 
  UniversalProjectDetector, 
  TeamOptimizationAI, 
  AdaptiveAIAssistant,
  BackupRestoreSystem,
  SmartResponseCache
} from '@claude-coordination/shared';

interface IntelligentServicesProps {
  isDarkTheme: boolean;
}

interface ServiceStatus {
  name: string;
  status: 'active' | 'inactive' | 'initializing';
  lastActivity?: string;
  metrics?: Record<string, any>;
}

const IntelligentServices: React.FC<IntelligentServicesProps> = ({ isDarkTheme }) => {
  const [services, setServices] = useState<ServiceStatus[]>([]);
  const [projectAnalysis, setProjectAnalysis] = useState<any>(null);
  const [teamOptimization, setTeamOptimization] = useState<any>(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [selectedService, setSelectedService] = useState<string>('project-detector');

  useEffect(() => {
    initializeServices();
  }, []);

  const initializeServices = async () => {
    console.log('🚀 Initializing intelligent services...');
    
    const initialServices: ServiceStatus[] = [
      {
        name: 'Universal Project Detector',
        status: 'active',
        lastActivity: new Date().toISOString(),
        metrics: { scannedFiles: 0, detectedPatterns: 0 }
      },
      {
        name: 'Team Optimization AI',
        status: 'active', 
        lastActivity: new Date().toISOString(),
        metrics: { optimizationSessions: 0, recommendations: 0 }
      },
      {
        name: 'Adaptive AI Assistant',
        status: 'active',
        lastActivity: new Date().toISOString(),
        metrics: { interactions: 0, learningPatterns: 0 }
      },
      {
        name: 'Smart Response Cache',
        status: 'active',
        lastActivity: new Date().toISOString(),
        metrics: { cacheHits: 0, hitRate: 0 }
      },
      {
        name: 'Backup & Restore System',
        status: 'active',
        lastActivity: new Date().toISOString(),
        metrics: { totalBackups: 0, lastBackup: null }
      }
    ];

    setServices(initialServices);
  };

  const runProjectDetection = async () => {
    setIsAnalyzing(true);
    try {
      console.log('🔍 Running project detection...');
      
      const detector = new UniversalProjectDetector();
      const analysis = await detector.detectProject();
      
      setProjectAnalysis(analysis);
      
      // Update service metrics
      setServices(prev => prev.map(service => 
        service.name === 'Universal Project Detector' 
          ? { 
              ...service, 
              lastActivity: new Date().toISOString(),
              metrics: { 
                scannedFiles: analysis.analysis.languages.length + analysis.analysis.frameworks.length,
                detectedPatterns: analysis.analysis.frameworks.length,
                confidence: analysis.analysis.confidence
              }
            }
          : service
      ));
      
    } catch (error) {
      console.error('Project detection failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const runTeamOptimization = async () => {
    if (!projectAnalysis) {
      console.warn('Run project detection first');
      return;
    }

    try {
      console.log('🧠 Running team optimization...');
      
      const optimizer = new TeamOptimizationAI();
      
      const requirements = {
        skills: projectAnalysis.analysis.frameworks,
        timeline: '8 weeks',
        priorities: ['quality', 'speed', 'cost'],
        constraints: []
      };

      const session = await optimizer.optimizeTeam(requirements);
      setTeamOptimization(session);
      
      // Update service metrics
      setServices(prev => prev.map(service => 
        service.name === 'Team Optimization AI' 
          ? { 
              ...service, 
              lastActivity: new Date().toISOString(),
              metrics: { 
                optimizationSessions: 1,
                recommendations: session.recommendations.length,
                selectedAgents: session.selectedTeam?.agents.length || 0
              }
            }
          : service
      ));
      
    } catch (error) {
      console.error('Team optimization failed:', error);
    }
  };

  const testAIAssistant = async () => {
    try {
      console.log('🤖 Testing AI Assistant...');
      
      const assistant = new AdaptiveAIAssistant();
      const response = await assistant.assist('How can I optimize this React component?', {
        projectType: projectAnalysis?.analysis.type,
        currentFile: 'Component.tsx'
      });
      
      console.log('AI Assistant response:', response);
      
      // Update service metrics
      setServices(prev => prev.map(service => 
        service.name === 'Adaptive AI Assistant' 
          ? { 
              ...service, 
              lastActivity: new Date().toISOString(),
              metrics: { 
                interactions: (service.metrics?.interactions || 0) + 1,
                learningPatterns: 5,
                lastResponse: response.type
              }
            }
          : service
      ));
      
    } catch (error) {
      console.error('AI Assistant test failed:', error);
    }
  };

  const testBackupSystem = async () => {
    try {
      console.log('💾 Testing backup system...');
      
      const backup = new BackupRestoreSystem();
      const stats = await backup.getBackupStats();
      
      console.log('Backup stats:', stats);
      
      // Update service metrics
      setServices(prev => prev.map(service => 
        service.name === 'Backup & Restore System' 
          ? { 
              ...service, 
              lastActivity: new Date().toISOString(),
              metrics: { 
                totalBackups: stats.totalBackups,
                totalSize: Math.round(stats.totalSize / 1024),
                lastBackup: stats.newestBackup ? new Date(stats.newestBackup).toLocaleString() : null
              }
            }
          : service
      ));
      
    } catch (error) {
      console.error('Backup system test failed:', error);
    }
  };

  const renderServiceDetails = () => {
    switch (selectedService) {
      case 'project-detector':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className={`text-lg font-semibold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                🔮 Universal Project Detector
              </h3>
              <button
                onClick={runProjectDetection}
                disabled={isAnalyzing}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors"
              >
                {isAnalyzing ? 'Analyzing...' : 'Run Detection'}
              </button>
            </div>
            
            {projectAnalysis && (
              <div className="coordination-card p-6">
                <h4 className={`font-medium mb-4 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                  Detection Results
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className={`text-sm ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>
                      Project Type
                    </label>
                    <p className={`font-medium ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                      {projectAnalysis.analysis.type}
                    </p>
                  </div>
                  <div>
                    <label className={`text-sm ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>
                      Confidence
                    </label>
                    <p className={`font-medium ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                      {Math.round(projectAnalysis.analysis.confidence * 100)}%
                    </p>
                  </div>
                  <div>
                    <label className={`text-sm ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>
                      Languages
                    </label>
                    <p className={`font-medium ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                      {projectAnalysis.analysis.languages.join(', ')}
                    </p>
                  </div>
                  <div>
                    <label className={`text-sm ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>
                      Frameworks
                    </label>
                    <p className={`font-medium ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                      {projectAnalysis.analysis.frameworks.join(', ')}
                    </p>
                  </div>
                </div>
                
                <div className="mt-4">
                  <label className={`text-sm ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>
                    AI Suggestions
                  </label>
                  <ul className="mt-2 space-y-1">
                    {projectAnalysis.analysis.aiSuggestions.map((suggestion: string, index: number) => (
                      <li key={index} className={`text-sm ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>
                        • {suggestion}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            )}
          </div>
        );
        
      case 'team-optimization':
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className={`text-lg font-semibold ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                🧠 Team Optimization AI
              </h3>
              <button
                onClick={runTeamOptimization}
                disabled={!projectAnalysis}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors"
              >
                Optimize Team
              </button>
            </div>
            
            {teamOptimization && (
              <div className="coordination-card p-6">
                <h4 className={`font-medium mb-4 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                  Optimization Results
                </h4>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className={`text-sm ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>
                      Project Type
                    </label>
                    <p className={`font-medium ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                      {teamOptimization.projectType}
                    </p>
                  </div>
                  <div>
                    <label className={`text-sm ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>
                      Team Size
                    </label>
                    <p className={`font-medium ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                      {teamOptimization.selectedTeam?.agents.length} agents
                    </p>
                  </div>
                </div>
                
                <div>
                  <label className={`text-sm ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>
                    Selected Team
                  </label>
                  <div className="mt-2 space-y-2">
                    {teamOptimization.selectedTeam?.agents.map((agent: any, index: number) => (
                      <div key={index} className={`p-3 rounded-lg ${isDarkTheme ? 'bg-gray-700' : 'bg-gray-100'}`}>
                        <div className="flex justify-between items-center">
                          <span className={`font-medium ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                            {agent.agentId}
                          </span>
                          <span className={`text-sm ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>
                            {agent.role}
                          </span>
                        </div>
                        <p className={`text-sm mt-1 ${isDarkTheme ? 'text-gray-400' : 'text-gray-500'}`}>
                          Skills: {agent.skills.join(', ')}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}
          </div>
        );
        
      default:
        return (
          <div className="coordination-card p-6">
            <h3 className={`text-lg font-semibold mb-4 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
              Service Testing
            </h3>
            <div className="grid grid-cols-1 gap-4">
              <button
                onClick={testAIAssistant}
                className="p-4 text-left border rounded-lg hover:bg-opacity-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <HiLightBulb className="w-5 h-5 text-yellow-500" />
                  <span className={isDarkTheme ? 'text-white' : 'text-gray-900'}>
                    Test AI Assistant
                  </span>
                </div>
              </button>
              
              <button
                onClick={testBackupSystem}
                className="p-4 text-left border rounded-lg hover:bg-opacity-50 transition-colors"
              >
                <div className="flex items-center space-x-3">
                  <HiArchiveBox className="w-5 h-5 text-blue-500" />
                  <span className={isDarkTheme ? 'text-white' : 'text-gray-900'}>
                    Test Backup System
                  </span>
                </div>
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div id="intelligent-services" className="min-h-screen p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className={`text-4xl font-bold mb-4 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
            🧠 Intelligent Services
          </h1>
          <p className={`text-xl ${isDarkTheme ? 'text-gray-300' : 'text-gray-600'}`}>
            Advanced AI-powered services ported from the original Krins system
          </p>
        </div>

        {/* Service Status Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          {services.map((service, index) => (
            <div key={index} className="coordination-card p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className={`w-3 h-3 rounded-full ${
                    service.status === 'active' ? 'bg-green-500' :
                    service.status === 'initializing' ? 'bg-yellow-500' : 'bg-red-500'
                  }`} />
                  <h3 className={`font-medium ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                    {service.name}
                  </h3>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  service.status === 'active' ? 'bg-green-100 text-green-800' :
                  service.status === 'initializing' ? 'bg-yellow-100 text-yellow-800' :
                  'bg-red-100 text-red-800'
                }`}>
                  {service.status}
                </span>
              </div>
              
              {service.metrics && (
                <div className="space-y-2">
                  {Object.entries(service.metrics).map(([key, value]) => (
                    <div key={key} className="flex justify-between text-sm">
                      <span className={isDarkTheme ? 'text-gray-400' : 'text-gray-600'}>
                        {key.charAt(0).toUpperCase() + key.slice(1)}:
                      </span>
                      <span className={isDarkTheme ? 'text-gray-300' : 'text-gray-700'}>
                        {typeof value === 'number' ? value.toLocaleString() : String(value || 'N/A')}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              
              {service.lastActivity && (
                <div className={`text-xs mt-3 ${isDarkTheme ? 'text-gray-500' : 'text-gray-400'}`}>
                  Last activity: {new Date(service.lastActivity).toLocaleTimeString()}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Service Details */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Service Selector */}
          <div className="lg:col-span-1">
            <div className="coordination-card p-4">
              <h3 className={`font-medium mb-4 ${isDarkTheme ? 'text-white' : 'text-gray-900'}`}>
                Services
              </h3>
              <div className="space-y-2">
                {[
                  { id: 'project-detector', name: 'Project Detector', icon: HiMagnifyingGlass },
                  { id: 'team-optimization', name: 'Team Optimization', icon: HiUsers },
                  { id: 'ai-assistant', name: 'AI Assistant', icon: HiLightBulb },
                  { id: 'testing', name: 'Service Testing', icon: HiBeaker }
                ].map(service => (
                  <button
                    key={service.id}
                    onClick={() => setSelectedService(service.id)}
                    className={`w-full p-3 text-left rounded-lg transition-colors ${
                      selectedService === service.id
                        ? isDarkTheme ? 'bg-blue-600/20 text-blue-400' : 'bg-blue-50 text-blue-700'
                        : isDarkTheme ? 'text-gray-300 hover:bg-gray-700' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <div className="flex items-center space-x-3">
                      <service.icon className="w-5 h-5" />
                      <span className="font-medium">{service.name}</span>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Service Detail Panel */}
          <div className="lg:col-span-3">
            {renderServiceDetails()}
          </div>
        </div>
      </div>
    </div>
  );
};

export default IntelligentServices;