import React, { useState, useEffect } from 'react';
import {
  HiCpuChip,
  HiChartBar,
  HiTrophy,
  HiUsers,
  HiCog6Tooth,
  HiSparkles,
  HiArrowTrendingUp,
  HiExclamationTriangle
} from 'react-icons/hi2';

interface AIOptimizerDashboardProps {
  isDarkTheme: boolean;
}

interface AIPerformance {
  name: string;
  efficiency: number;
  successRate: number;
  totalTasks: number;
  averageResponseTime: number;
  currentLoad: number;
  specializations: string[];
}

interface TeamComposition {
  composition: any[];
  builds: number;
  successRate: number;
  averageQuality: number;
}

const AIOptimizerDashboard: React.FC<AIOptimizerDashboardProps> = ({ isDarkTheme }) => {
  const [performanceData, setPerformanceData] = useState<any>(null);
  const [aiPerformance, setAiPerformance] = useState<AIPerformance[]>([]);
  const [topTeams, setTopTeams] = useState<TeamComposition[]>([]);
  const [isOptimizing, setIsOptimizing] = useState(false);
  const [optimizationProgress, setOptimizationProgress] = useState(0);

  // Simulate loading performance data
  useEffect(() => {
    loadPerformanceData();
    const interval = setInterval(loadPerformanceData, 30000); // Update every 30s
    return () => clearInterval(interval);
  }, []);

  const loadPerformanceData = async () => {
    // Simulate API call to AI optimizer
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    setPerformanceData({
      totalBuilds: 247,
      successRate: 0.89,
      averageQuality: 0.92,
      averageDurationAccuracy: 0.85,
      averageCostAccuracy: 0.78
    });

    setAiPerformance([
      {
        name: 'Claude',
        efficiency: 0.94,
        successRate: 0.91,
        totalTasks: 142,
        averageResponseTime: 2.3,
        currentLoad: 3,
        specializations: ['Frontend', 'UI/UX', 'Testing', 'Documentation']
      },
      {
        name: 'GPT-4',
        efficiency: 0.88,
        successRate: 0.86,
        totalTasks: 98,
        averageResponseTime: 3.1,
        currentLoad: 2,
        specializations: ['Backend', 'API Design', 'Security', 'Algorithms']
      },
      {
        name: 'Gemini',
        efficiency: 0.82,
        successRate: 0.79,
        totalTasks: 67,
        averageResponseTime: 2.8,
        currentLoad: 1,
        specializations: ['DevOps', 'Deployment', 'Infrastructure', 'Monitoring']
      }
    ]);

    setTopTeams([
      {
        composition: [
          { ai: 'Claude', role: 'Frontend' },
          { ai: 'GPT-4', role: 'Backend' }
        ],
        builds: 45,
        successRate: 0.93,
        averageQuality: 0.95
      },
      {
        composition: [
          { ai: 'Claude', role: 'Fullstack' }
        ],
        builds: 67,
        successRate: 0.88,
        averageQuality: 0.89
      },
      {
        composition: [
          { ai: 'Claude', role: 'Frontend' },
          { ai: 'GPT-4', role: 'Backend' },
          { ai: 'Gemini', role: 'DevOps' }
        ],
        builds: 23,
        successRate: 0.96,
        averageQuality: 0.97
      }
    ]);
  };

  const runOptimization = async () => {
    setIsOptimizing(true);
    setOptimizationProgress(0);

    // Simulate optimization process
    for (let i = 0; i <= 100; i += 10) {
      await new Promise(resolve => setTimeout(resolve, 200));
      setOptimizationProgress(i);
    }

    // Simulate improved performance after optimization
    setPerformanceData(prev => ({
      ...prev,
      successRate: Math.min(prev.successRate + 0.02, 1.0),
      averageQuality: Math.min(prev.averageQuality + 0.01, 1.0)
    }));

    setIsOptimizing(false);
    setOptimizationProgress(0);
  };

  const getEfficiencyColor = (efficiency: number) => {
    if (efficiency >= 0.9) return 'text-green-600';
    if (efficiency >= 0.8) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getLoadStatus = (load: number, limit: number = 10) => {
    const percentage = (load / limit) * 100;
    if (percentage < 50) return { color: 'bg-green-500', text: 'Lav' };
    if (percentage < 80) return { color: 'bg-yellow-500', text: 'Moderat' };
    return { color: 'bg-red-500', text: 'Høy' };
  };

  if (!performanceData) {
    return (
      <section className="nordic-section">
        <div className="nordic-container">
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full"></div>
            <span className="ml-3">Laster AI-team analytics...</span>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="nordic-section">
      <div className="nordic-container-wide">
        {/* Header */}
        <div className="nordic-grid-magazine mb-12">
          <div>
            <div className="nordic-h3" style={{color: 'var(--text-muted)', marginBottom: 'var(--space-sm)'}}>
              AI Team Optimizer
            </div>
            <h1 className="nordic-h1" style={{marginBottom: 'var(--space-md)'}}>
              Machine Learning Dashboard
            </h1>
            <p className="nordic-body-large">
              Intelligent optimalisering av AI-team sammensetning basert på 
              kontinuerlig læring og performance analytics.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <button
              onClick={runOptimization}
              disabled={isOptimizing}
              className="nordic-button-primary disabled:opacity-50"
            >
              <div className="flex items-center gap-2">
                {isOptimizing ? (
                  <>
                    <div className="animate-spin w-4 h-4 border-2 border-white border-t-transparent rounded-full" />
                    Optimaliserer... ({optimizationProgress}%)
                  </>
                ) : (
                  <>
                    <HiSparkles className="w-4 h-4" />
                    Kjør ML Optimalisering
                  </>
                )}
              </div>
            </button>
            
            {isOptimizing && (
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${optimizationProgress}%` }}
                />
              </div>
            )}
          </div>
        </div>

        {/* Performance Overview */}
        <div className="nordic-grid-4 mb-12">
          <div className="nordic-card p-6 text-center">
            <div className="text-3xl font-bold mb-2" style={{color: 'var(--accent-primary)'}}>
              {performanceData.totalBuilds}
            </div>
            <div className="text-sm" style={{color: 'var(--text-muted)'}}>Total Byggeprosjekter</div>
          </div>
          
          <div className="nordic-card p-6 text-center">
            <div className="text-3xl font-bold mb-2" style={{color: 'var(--accent-secondary)'}}>
              {Math.round(performanceData.successRate * 100)}%
            </div>
            <div className="text-sm" style={{color: 'var(--text-muted)'}}>Suksessrate</div>
          </div>
          
          <div className="nordic-card p-6 text-center">
            <div className="text-3xl font-bold mb-2" style={{color: 'var(--accent-tertiary)'}}>
              {Math.round(performanceData.averageQuality * 100)}%
            </div>
            <div className="text-sm" style={{color: 'var(--text-muted)'}}>Gjennomsnittlig Kvalitet</div>
          </div>
          
          <div className="nordic-card p-6 text-center">
            <div className="text-3xl font-bold mb-2" style={{color: 'var(--accent-primary)'}}>
              {Math.round(performanceData.averageDurationAccuracy * 100)}%
            </div>
            <div className="text-sm" style={{color: 'var(--text-muted)'}}>Tidsestimering Nøyaktighet</div>
          </div>
        </div>

        {/* AI Performance Ranking */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <HiTrophy className="w-6 h-6" style={{color: 'var(--accent-primary)'}} />
            <h2 className="nordic-h3">AI-agent Ytelse Ranking</h2>
          </div>
          
          <div className="nordic-grid-3 gap-6">
            {aiPerformance.map((ai, index) => {
              const loadStatus = getLoadStatus(ai.currentLoad);
              return (
                <div key={ai.name} className="nordic-card">
                  <div className="p-6">
                    {/* AI Header */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                          #{index + 1}
                        </div>
                        <div>
                          <h3 className="font-semibold">{ai.name}</h3>
                          <div className="text-sm" style={{color: 'var(--text-muted)'}}>
                            {ai.totalTasks} oppgaver
                          </div>
                        </div>
                      </div>
                      <HiCpuChip className="w-6 h-6" style={{color: 'var(--accent-primary)'}} />
                    </div>

                    {/* Performance Metrics */}
                    <div className="space-y-3 mb-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Effektivitet</span>
                        <span className={`font-medium ${getEfficiencyColor(ai.efficiency)}`}>
                          {Math.round(ai.efficiency * 100)}%
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Suksessrate</span>
                        <span className="font-medium">
                          {Math.round(ai.successRate * 100)}%
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Responstid</span>
                        <span className="font-medium">
                          {ai.averageResponseTime}s
                        </span>
                      </div>
                      
                      <div className="flex justify-between items-center">
                        <span className="text-sm">Gjeldende Last</span>
                        <div className="flex items-center gap-2">
                          <div className={`w-2 h-2 rounded-full ${loadStatus.color}`}></div>
                          <span className="font-medium">{loadStatus.text}</span>
                        </div>
                      </div>
                    </div>

                    {/* Specializations */}
                    <div>
                      <div className="text-sm font-medium mb-2">Spesialiseringer:</div>
                      <div className="flex flex-wrap gap-1">
                        {ai.specializations.map((spec) => (
                          <span 
                            key={spec}
                            className="text-xs px-2 py-1 rounded-full"
                            style={{
                              background: 'var(--accent-primary)',
                              color: 'white'
                            }}
                          >
                            {spec}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Top Performing Teams */}
        <div className="mb-12">
          <div className="flex items-center gap-3 mb-6">
            <HiUsers className="w-6 h-6" style={{color: 'var(--accent-secondary)'}} />
            <h2 className="nordic-h3">Beste Team Sammensetninger</h2>
          </div>
          
          <div className="space-y-4">
            {topTeams.map((team, index) => (
              <div key={index} className="nordic-card">
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex-1">
                      {/* Team Composition */}
                      <div className="flex items-center gap-4 mb-3">
                        <div className="flex -space-x-2">
                          {team.composition.map((member, i) => (
                            <div 
                              key={i}
                              className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white text-xs font-bold border-2 border-white"
                            >
                              {member.ai.charAt(0)}
                            </div>
                          ))}
                        </div>
                        <div className="flex gap-2">
                          {team.composition.map((member, i) => (
                            <span 
                              key={i}
                              className="text-sm px-2 py-1 rounded-full"
                              style={{
                                background: 'var(--surface-elevated)',
                                color: 'var(--text-primary)'
                              }}
                            >
                              {member.ai}: {member.role}
                            </span>
                          ))}
                        </div>
                      </div>

                      {/* Performance Stats */}
                      <div className="flex gap-6 text-sm">
                        <div>
                          <span style={{color: 'var(--text-muted)'}}>Prosjekter: </span>
                          <span className="font-medium">{team.builds}</span>
                        </div>
                        <div>
                          <span style={{color: 'var(--text-muted)'}}>Suksessrate: </span>
                          <span className="font-medium text-green-600">
                            {Math.round(team.successRate * 100)}%
                          </span>
                        </div>
                        <div>
                          <span style={{color: 'var(--text-muted)'}}>Kvalitet: </span>
                          <span className="font-medium">
                            {Math.round(team.averageQuality * 100)}%
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Rank Badge */}
                    <div className="text-right">
                      <div className={`text-2xl font-bold ${
                        index === 0 ? 'text-yellow-500' : 
                        index === 1 ? 'text-gray-500' : 
                        'text-amber-600'
                      }`}>
                        #{index + 1}
                      </div>
                      <div className="text-xs" style={{color: 'var(--text-muted)'}}>
                        Rangering
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ML Insights */}
        <div className="nordic-card p-8 text-center">
          <HiChartBar className="w-12 h-12 mx-auto mb-4" style={{color: 'var(--accent-primary)'}} />
          <h3 className="nordic-h4 mb-4">Machine Learning Innsikter</h3>
          <div className="max-w-2xl mx-auto">
            <p className="nordic-body mb-4">
              ML-modellen har analysert {performanceData.totalBuilds} byggeprosjekter og 
              identifisert optimale mønstre for AI-team sammensetning.
            </p>
            <div className="flex justify-center gap-8 text-sm">
              <div>
                <div className="font-bold text-lg" style={{color: 'var(--accent-primary)'}}>94%</div>
                <div style={{color: 'var(--text-muted)'}}>Prediksjons-nøyaktighet</div>
              </div>
              <div>
                <div className="font-bold text-lg" style={{color: 'var(--accent-secondary)'}}>2.3x</div>
                <div style={{color: 'var(--text-muted)'}}>Forbedret ytelse</div>
              </div>
              <div>
                <div className="font-bold text-lg" style={{color: 'var(--accent-tertiary)'}}>85%</div>
                <div style={{color: 'var(--text-muted)'}}>Kostnadsreduksjon</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AIOptimizerDashboard;