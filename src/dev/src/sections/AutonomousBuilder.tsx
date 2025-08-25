import React, { useState, useEffect, useRef } from 'react';
import { 
  HiRocketLaunch,
  HiCog6Tooth,
  HiUserGroup,
  HiCube,
  HiCheckCircle,
  HiExclamationTriangle,
  HiArrowRight,
  HiPlay,
  HiPause,
  HiStop,
  HiEye,
  HiChartBar,
  HiWrenchScrewdriver,
  HiSparkles,
  HiLightBulb,
  HiGlobeAlt,
  HiCode,
  HiCpuChip
} from 'react-icons/hi2';

interface AutonomousBuilderProps {
  isDarkTheme: boolean;
}

interface ProjectSpec {
  id: string;
  type: string;
  confidence: number;
  complexity: number;
  estimatedHours: number;
  tasks: Array<{
    id: string;
    title: string;
    type: string;
    priority: number;
    estimatedHours: number;
    aiSpecialization: string;
    status?: 'pending' | 'in-progress' | 'completed';
  }>;
  requiredSpecializations: string[];
  optimalTeamSize: number;
  technologies: Record<string, string>;
  requirements: Array<{
    name: string;
    confidence: number;
    estimatedHours: number;
  }>;
}

interface AITeamMember {
  id: string;
  name: string;
  specializations: string[];
  status: 'ready' | 'working' | 'completed';
  currentTask?: string;
  progress?: number;
}

const AutonomousBuilder: React.FC<AutonomousBuilderProps> = ({ isDarkTheme }) => {
  const [description, setDescription] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isBuilding, setBuildingStatus] = useState(false);
  const [projectSpec, setProjectSpec] = useState<ProjectSpec | null>(null);
  const [aiTeam, setAITeam] = useState<AITeamMember[]>([]);
  const [buildProgress, setBuildProgress] = useState(0);
  const [currentPhase, setCurrentPhase] = useState('');
  const [buildLog, setBuildLog] = useState<string[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);
  const logRef = useRef<HTMLDivElement>(null);

  // Sample project examples
  const examples = [
    "Lag en moderne e-handelsplattform med brukerautentisering, handlekurv og betalingsløsning",
    "Bygg en todo-app med oppgavehåndtering og brukerkontoer", 
    "Utvikle en sanntids chat-applikasjon med WebSockets og responsivt design",
    "Lag en portfolio-nettside med prosjektvisning og kontaktskjema",
    "Bygg en sosial medier-plattform med innlegg, likes og brukerkommentarer"
  ];

  const addToLog = (message: string) => {
    setBuildLog(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  useEffect(() => {
    if (logRef.current) {
      logRef.current.scrollTop = logRef.current.scrollHeight;
    }
  }, [buildLog]);

  const analyzeProject = async () => {
    if (!description.trim()) return;

    setIsAnalyzing(true);
    addToLog('🔍 Starter prosjektanalyse...');

    try {
      // Simulate API call to task parser
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Mock parsed project data
      const mockSpec: ProjectSpec = {
        id: 'proj_' + Math.random().toString(36).substr(2, 9),
        type: description.toLowerCase().includes('ecommerce') || description.toLowerCase().includes('e-handel') ? 'e-commerce' : 
              description.toLowerCase().includes('todo') ? 'todo-app' : 
              description.toLowerCase().includes('chat') ? 'chat-app' : 'web-app',
        confidence: 0.85 + Math.random() * 0.1,
        complexity: 0.6 + Math.random() * 0.3,
        estimatedHours: Math.floor(8 + Math.random() * 20),
        tasks: [
          { id: 'task1', title: 'Prosjektarkitektur Planlegging', type: 'planning', priority: 1, estimatedHours: 1, aiSpecialization: 'system-architecture' },
          { id: 'task2', title: 'Utviklingsmiljø Oppsett', type: 'setup', priority: 2, estimatedHours: 0.5, aiSpecialization: 'devops' },
          { id: 'task3', title: 'React Applikasjon Oppsett', type: 'frontend', priority: 3, estimatedHours: 1, aiSpecialization: 'frontend' },
          { id: 'task4', title: 'API Server Arkitektur', type: 'backend', priority: 4, estimatedHours: 1.5, aiSpecialization: 'backend' },
          { id: 'task5', title: 'Database Schema Design', type: 'backend', priority: 5, estimatedHours: 1, aiSpecialization: 'database' },
          { id: 'task6', title: 'Brukergrenesnitt Komponenter', type: 'frontend', priority: 6, estimatedHours: 3, aiSpecialization: 'frontend' },
          { id: 'task7', title: 'Testing & Deployment', type: 'testing', priority: 7, estimatedHours: 2, aiSpecialization: 'testing' }
        ],
        requiredSpecializations: ['frontend', 'backend', 'database', 'testing'],
        optimalTeamSize: 3,
        technologies: {
          frontend: 'React + TypeScript',
          backend: 'Node.js + Express',
          database: 'PostgreSQL',
          styling: 'Tailwind CSS'
        },
        requirements: [
          { name: 'user-authentication', confidence: 0.9, estimatedHours: 3 },
          { name: 'database', confidence: 0.95, estimatedHours: 2 },
          { name: 'responsive', confidence: 0.8, estimatedHours: 2 }
        ]
      };

      setProjectSpec(mockSpec);
      addToLog(`✅ Prosjekt analysert: ${mockSpec.type} (${Math.round(mockSpec.confidence * 100)}% sikkerhet)`);
      addToLog(`📊 Kompleksitet: ${mockSpec.complexity.toFixed(2)}, Estimert: ${mockSpec.estimatedHours} timer`);

      // Generate AI team
      const mockTeam: AITeamMember[] = [
        { id: 'claude-code', name: 'Claude Code', specializations: ['frontend', 'system-architecture'], status: 'ready' },
        { id: 'openai-gpt4', name: 'GPT-4', specializations: ['backend', 'database'], status: 'ready' },
        { id: 'specialized-ai', name: 'DevOps Specialist', specializations: ['testing', 'devops'], status: 'ready' }
      ];
      
      setAITeam(mockTeam);
      addToLog(`🤖 AI-team sammensatt: ${mockTeam.length} medlemmer`);

    } catch (error) {
      addToLog(`❌ Analysefeil: ${error}`);
    } finally {
      setIsAnalyzing(false);
    }
  };

  const startBuilding = async () => {
    if (!projectSpec) return;

    setBuildingStatus(true);
    setBuildProgress(0);
    addToLog('🚀 Starter autonom byggeprosjekt...');

    // Simulate autonomous building process
    const phases = [
      { name: 'Initialisering', duration: 1000 },
      { name: 'Planlegging & Oppsett', duration: 2000 },
      { name: 'Kjernutvikling', duration: 4000 },
      { name: 'Funksjoner & Integrasjon', duration: 3000 },
      { name: 'Testing & Deployment', duration: 2000 }
    ];

    let totalProgress = 0;
    const progressIncrement = 100 / phases.length;

    for (let i = 0; i < phases.length; i++) {
      const phase = phases[i];
      setCurrentPhase(phase.name);
      addToLog(`📋 Fase ${i + 1}: ${phase.name}`);
      
      // Update AI team status
      const updatedTeam = aiTeam.map(ai => ({
        ...ai,
        status: 'working' as const,
        currentTask: `Arbeider med ${phase.name}`,
        progress: Math.random() * 100
      }));
      setAITeam(updatedTeam);

      // Simulate phase progress
      await new Promise(resolve => {
        const interval = setInterval(() => {
          totalProgress += progressIncrement / 10;
          setBuildProgress(Math.min(totalProgress, (i + 1) * progressIncrement));
          
          if (totalProgress >= (i + 1) * progressIncrement) {
            clearInterval(interval);
            resolve(void 0);
          }
        }, phase.duration / 10);
      });

      addToLog(`✅ ${phase.name} fullført`);
    }

    // Final completion
    setAITeam(prev => prev.map(ai => ({ ...ai, status: 'completed', progress: 100 })));
    setCurrentPhase('Fullført');
    addToLog('🎉 Prosjekt bygget suksessfullt!');
    setBuildingStatus(false);
  };

  const stopBuilding = () => {
    setBuildingStatus(false);
    setCurrentPhase('Stoppet');
    addToLog('⏹️ Bygging stoppet av bruker');
  };

  return (
    <div className="nordic-section">
      <div className="nordic-container-wide">
        {/* Header */}
        <div className="mb-8">
          <h1 className="nordic-h1 mb-4 flex items-center gap-3">
            <HiRocketLaunch className="text-2xl" style={{color: 'var(--accent-primary)'}} />
            Autonom AI Byggeverktøy
          </h1>
          <p className="nordic-body-large">
            Bygg komplette applikasjoner fra enkle beskrivelser ved hjelp av AI-teamorkestrering
          </p>
        </div>

        {/* Project Description Input */}
        <div className="nordic-card mb-6">
          <h2 className="nordic-h3 mb-4 flex items-center gap-2">
            <HiLightBulb style={{color: 'var(--accent-secondary)'}} />
            Prosjektbeskrivelse
          </h2>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="project-description" className="nordic-body font-medium mb-2 block">
                Beskriv prosjektet du ønsker å bygge:
              </label>
              <textarea
                id="project-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="F.eks: Lag en moderne e-handelsplattform med brukerautentisering, handlekurv og betalingsløsning..."
                className="w-full h-32 p-4 rounded-lg border resize-none"
                style={{
                  backgroundColor: 'var(--bg-secondary)',
                  border: '1px solid var(--bg-tertiary)',
                  color: 'var(--text-primary)'
                }}
              />
            </div>

            {/* Example suggestions */}
            <div>
              <p className="nordic-caption mb-2">Eller prøv ett av disse eksemplene:</p>
              <div className="flex flex-wrap gap-2">
                {examples.map((example, index) => (
                  <button
                    key={index}
                    onClick={() => setDescription(example)}
                    className="text-xs px-3 py-1 rounded-full border transition-colors"
                    style={{
                      backgroundColor: 'var(--bg-secondary)',
                      border: '1px solid var(--bg-tertiary)',
                      color: 'var(--text-secondary)'
                    }}
                  >
                    {example.substring(0, 50)}...
                  </button>
                ))}
              </div>
            </div>

            <div className="flex gap-3">
              <button
                onClick={analyzeProject}
                disabled={isAnalyzing || !description.trim()}
                className="nordic-button-primary flex items-center gap-2"
              >
                {isAnalyzing ? (
                  <>
                    <HiCog6Tooth className="animate-spin" />
                    Analyserer...
                  </>
                ) : (
                  <>
                    <HiCpuChip />
                    Analyser Prosjekt
                  </>
                )}
              </button>
              
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="nordic-button flex items-center gap-2"
              >
                <HiWrenchScrewdriver />
                Avanserte Innstillinger
              </button>
            </div>
          </div>
        </div>

        {/* Advanced Settings */}
        {showAdvanced && (
          <div className="nordic-card mb-6">
            <h3 className="nordic-h4 mb-4">Avanserte Innstillinger</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="nordic-body font-medium mb-2 block">Målgruppe</label>
                <select className="w-full p-3 rounded-lg border" style={{backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--bg-tertiary)'}}>
                  <option>Generell</option>
                  <option>Utviklere</option>
                  <option>Bedrift</option>
                  <option>Forbrukere</option>
                </select>
              </div>
              <div>
                <label className="nordic-body font-medium mb-2 block">Prioritet</label>
                <select className="w-full p-3 rounded-lg border" style={{backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--bg-tertiary)'}}>
                  <option>Normal</option>
                  <option>Høy</option>
                  <option>Lav</option>
                  <option>Kritisk</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Project Analysis Results */}
        {projectSpec && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
            {/* Project Overview */}
            <div className="nordic-card">
              <h3 className="nordic-h4 mb-4 flex items-center gap-2">
                <HiChartBar style={{color: 'var(--accent-primary)'}} />
                Prosjektanalyse
              </h3>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="nordic-body">Prosjekttype:</span>
                  <span className="font-medium capitalize">{projectSpec.type.replace('-', ' ')}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="nordic-body">Sikkerhet:</span>
                  <span className="font-medium" style={{color: 'var(--accent-secondary)'}}>
                    {Math.round(projectSpec.confidence * 100)}%
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="nordic-body">Kompleksitet:</span>
                  <div className="flex items-center gap-2">
                    <div className="w-16 h-2 rounded-full" style={{backgroundColor: 'var(--bg-tertiary)'}}>
                      <div 
                        className="h-full rounded-full"
                        style={{
                          backgroundColor: 'var(--accent-primary)',
                          width: `${projectSpec.complexity * 100}%`
                        }}
                      />
                    </div>
                    <span className="text-sm">{projectSpec.complexity.toFixed(2)}</span>
                  </div>
                </div>
                <div className="flex justify-between items-center">
                  <span className="nordic-body">Estimert tid:</span>
                  <span className="font-medium">{projectSpec.estimatedHours} timer</span>
                </div>
              </div>

              {/* Technology Stack */}
              <div className="mt-6">
                <h4 className="nordic-caption font-medium mb-3">Teknologistakk</h4>
                <div className="grid grid-cols-2 gap-2">
                  {Object.entries(projectSpec.technologies).map(([key, value]) => (
                    <div key={key} className="text-sm">
                      <span className="nordic-caption">{key}:</span>
                      <span className="ml-1 font-medium">{value}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* AI Team */}
            <div className="nordic-card">
              <h3 className="nordic-h4 mb-4 flex items-center gap-2">
                <HiUserGroup style={{color: 'var(--accent-secondary)'}} />
                AI-Team ({aiTeam.length} medlemmer)
              </h3>

              <div className="space-y-3">
                {aiTeam.map(ai => (
                  <div key={ai.id} className="flex items-center justify-between p-3 rounded-lg" style={{backgroundColor: 'var(--bg-secondary)'}}>
                    <div className="flex items-center gap-3">
                      <div 
                        className={`w-3 h-3 rounded-full ${
                          ai.status === 'ready' ? 'bg-blue-500' :
                          ai.status === 'working' ? 'bg-yellow-500' : 'bg-green-500'
                        }`}
                      />
                      <div>
                        <p className="font-medium">{ai.name}</p>
                        <p className="text-xs" style={{color: 'var(--text-secondary)'}}>
                          {ai.specializations.join(', ')}
                        </p>
                        {ai.currentTask && (
                          <p className="text-xs" style={{color: 'var(--text-muted)'}}>
                            {ai.currentTask}
                          </p>
                        )}
                      </div>
                    </div>
                    {ai.progress !== undefined && (
                      <div className="text-right">
                        <div className="text-xs font-medium">{Math.round(ai.progress)}%</div>
                      </div>
                    )}
                  </div>
                ))}
              </div>

              {/* Build Controls */}
              <div className="mt-6 space-y-3">
                {!isBuilding && buildProgress === 0 && (
                  <button
                    onClick={startBuilding}
                    className="nordic-button-primary w-full flex items-center justify-center gap-2"
                  >
                    <HiPlay />
                    Start Autonom Bygging
                  </button>
                )}

                {isBuilding && (
                  <button
                    onClick={stopBuilding}
                    className="nordic-button-secondary w-full flex items-center justify-center gap-2"
                  >
                    <HiStop />
                    Stopp Bygging
                  </button>
                )}

                {/* Progress Bar */}
                {buildProgress > 0 && (
                  <div>
                    <div className="flex justify-between text-sm mb-2">
                      <span>{currentPhase}</span>
                      <span>{Math.round(buildProgress)}%</span>
                    </div>
                    <div className="w-full h-3 rounded-full" style={{backgroundColor: 'var(--bg-tertiary)'}}>
                      <div 
                        className="h-full rounded-full transition-all duration-300"
                        style={{
                          backgroundColor: 'var(--accent-primary)',
                          width: `${buildProgress}%`
                        }}
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Task Breakdown */}
        {projectSpec && (
          <div className="nordic-card mb-6">
            <h3 className="nordic-h4 mb-4 flex items-center gap-2">
              <HiCube style={{color: 'var(--accent-primary)'}} />
              Oppgavestruktur ({projectSpec.tasks.length} oppgaver)
            </h3>

            <div className="space-y-3">
              {projectSpec.tasks.map((task, index) => (
                <div key={task.id} className="flex items-center gap-4 p-3 rounded-lg" style={{backgroundColor: 'var(--bg-secondary)'}}>
                  <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium" style={{backgroundColor: 'var(--accent-primary)', color: 'white'}}>
                    {index + 1}
                  </div>
                  <div className="flex-grow">
                    <h4 className="font-medium">{task.title}</h4>
                    <p className="text-sm" style={{color: 'var(--text-secondary)'}}>
                      {task.aiSpecialization} • {task.estimatedHours}t • {task.type}
                    </p>
                  </div>
                  <div className="flex-shrink-0">
                    {task.status === 'completed' ? (
                      <HiCheckCircle className="w-5 h-5 text-green-500" />
                    ) : task.status === 'in-progress' ? (
                      <HiCog6Tooth className="w-5 h-5 animate-spin" style={{color: 'var(--accent-primary)'}} />
                    ) : (
                      <div className="w-5 h-5 rounded-full" style={{backgroundColor: 'var(--bg-tertiary)'}} />
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Build Log */}
        {buildLog.length > 0 && (
          <div className="nordic-card">
            <h3 className="nordic-h4 mb-4 flex items-center gap-2">
              <HiEye style={{color: 'var(--accent-secondary)'}} />
              Byggelogg
            </h3>
            <div 
              ref={logRef}
              className="h-64 p-4 rounded-lg overflow-y-auto font-mono text-sm"
              style={{backgroundColor: 'var(--bg-secondary)', border: '1px solid var(--bg-tertiary)'}}
            >
              {buildLog.map((entry, index) => (
                <div key={index} className="mb-1">
                  {entry}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AutonomousBuilder;