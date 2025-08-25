import React, { useState, useEffect, useRef } from 'react';
import {
  HiCpuChip,
  HiCodeBracket,
  HiCog6Tooth,
  HiRocketLaunch,
  HiCheckCircle,
  HiExclamationTriangle,
  HiEye,
  HiUsers,
  HiChartBar
} from 'react-icons/hi2';

interface BuildStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'running' | 'completed' | 'error';
  progress: number;
  aiAgent?: string;
  details?: string[];
  startTime?: number;
  endTime?: number;
}

interface RealtimeProgressProps {
  isBuilding: boolean;
  projectDescription: string;
  onComplete?: (success: boolean) => void;
  onCancel?: () => void;
}

const RealtimeProgress: React.FC<RealtimeProgressProps> = ({
  isBuilding,
  projectDescription,
  onComplete,
  onCancel
}) => {
  const [steps, setSteps] = useState<BuildStep[]>([]);
  const [currentStepIndex, setCurrentStepIndex] = useState(0);
  const [overallProgress, setOverallProgress] = useState(0);
  const [aiTeamStatus, setAiTeamStatus] = useState<any[]>([]);
  const [liveCode, setLiveCode] = useState('');
  const [buildLogs, setBuildLogs] = useState<string[]>([]);
  const intervalRef = useRef<NodeJS.Timeout>();
  const [buildStartTime, setBuildStartTime] = useState<number>(0);
  const [estimatedDuration, setEstimatedDuration] = useState(5);

  // Initialize build steps based on project complexity
  useEffect(() => {
    if (!isBuilding) return;
    
    const buildSteps = generateBuildSteps(projectDescription);
    setSteps(buildSteps);
    setCurrentStepIndex(0);
    setOverallProgress(0);
    setBuildStartTime(Date.now());
    setEstimatedDuration(estimateBuildDuration(projectDescription));
    
    initializeAITeam(buildSteps);
    startBuildSimulation();
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isBuilding, projectDescription]);

  const generateBuildSteps = (description: string): BuildStep[] => {
    const complexity = estimateComplexity(description);
    
    const baseSteps: BuildStep[] = [
      {
        id: 'analysis',
        title: 'Prosjektanalyse',
        description: 'AI-team analyserer krav og planlegger arkitektur',
        status: 'pending',
        progress: 0,
        aiAgent: 'Claude (Orchestrator)'
      },
      {
        id: 'structure',
        title: 'Prosjektstruktur',
        description: 'Oppretter filstruktur og grunnleggende oppsett',
        status: 'pending',
        progress: 0,
        aiAgent: 'Claude (Frontend)'
      },
      {
        id: 'components',
        title: 'Komponenter',
        description: 'Genererer React-komponenter og UI-elementer',
        status: 'pending',
        progress: 0,
        aiAgent: 'Claude (Frontend)'
      }
    ];

    if (complexity > 0.5) {
      baseSteps.push(
        {
          id: 'backend',
          title: 'Backend API',
          description: 'Bygger server-side logikk og database-integrasjon',
          status: 'pending',
          progress: 0,
          aiAgent: 'GPT-4 (Backend)'
        },
        {
          id: 'integration',
          title: 'API Integrasjon',
          description: 'Kobler frontend med backend tjenester',
          status: 'pending',
          progress: 0,
          aiAgent: 'Claude (Fullstack)'
        }
      );
    }

    baseSteps.push(
      {
        id: 'styling',
        title: 'Styling & Design',
        description: 'Implementerer responsive design og tema-støtte',
        status: 'pending',
        progress: 0,
        aiAgent: 'Claude (UI/UX)'
      },
      {
        id: 'testing',
        title: 'Testing',
        description: 'Oppretter automatiske tester og validering',
        status: 'pending',
        progress: 0,
        aiAgent: 'Claude (Testing)'
      },
      {
        id: 'build',
        title: 'Bygg & Optimalisering',
        description: 'Kompilerer og optimaliserer for produksjon',
        status: 'pending',
        progress: 0,
        aiAgent: 'Gemini (DevOps)'
      }
    );

    if (complexity > 0.7) {
      baseSteps.push({
        id: 'deployment',
        title: 'Deployment',
        description: 'Deployer til produksjonsmiljø og setter opp domene',
        status: 'pending',
        progress: 0,
        aiAgent: 'Gemini (DevOps)'
      });
    }

    return baseSteps;
  };

  const estimateComplexity = (description: string): number => {
    const complexityKeywords = [
      'authentication', 'database', 'api', 'backend', 'real-time',
      'payment', 'deployment', 'testing', 'microservice', 'ai'
    ];
    
    const words = description.toLowerCase().split(/\s+/);
    const matches = words.filter(word =>
      complexityKeywords.some(keyword => word.includes(keyword))
    ).length;
    
    return Math.min(matches / 5, 1.0);
  };

  const estimateBuildDuration = (description: string): number => {
    const complexity = estimateComplexity(description);
    return Math.round(2 + (complexity * 8)); // 2-10 minutes based on complexity
  };

  const initializeAITeam = (buildSteps: BuildStep[]) => {
    const agents = [...new Set(buildSteps.map(step => step.aiAgent))];
    const teamStatus = agents.map(agent => ({
      name: agent || 'Unknown',
      status: 'standby',
      currentTask: null,
      completedTasks: 0,
      efficiency: 0.85 + Math.random() * 0.15
    }));
    
    setAiTeamStatus(teamStatus);
  };

  const startBuildSimulation = () => {
    intervalRef.current = setInterval(() => {
      setSteps(currentSteps => {
        const newSteps = [...currentSteps];
        let hasActiveStep = false;
        
        for (let i = 0; i < newSteps.length; i++) {
          const step = newSteps[i];
          
          if (step.status === 'running') {
            hasActiveStep = true;
            step.progress = Math.min(step.progress + (Math.random() * 15), 100);
            
            if (step.progress >= 100) {
              step.status = 'completed';
              step.endTime = Date.now();
              addBuildLog(`✅ ${step.title} completed by ${step.aiAgent}`);
              updateAITeamStatus(step.aiAgent!, 'completed', step.title);
            } else {
              generateLiveCodePreview(step);
              updateAITeamStatus(step.aiAgent!, 'working', step.title);
            }
            break;
          }
          
          if (step.status === 'pending' && !hasActiveStep) {
            step.status = 'running';
            step.startTime = Date.now();
            step.progress = 5;
            hasActiveStep = true;
            setCurrentStepIndex(i);
            addBuildLog(`🚀 Starting ${step.title} with ${step.aiAgent}`);
            updateAITeamStatus(step.aiAgent!, 'working', step.title);
            break;
          }
        }
        
        // Calculate overall progress
        const completedSteps = newSteps.filter(s => s.status === 'completed').length;
        const runningStep = newSteps.find(s => s.status === 'running');
        const runningProgress = runningStep ? runningStep.progress / 100 : 0;
        const overall = ((completedSteps + runningProgress) / newSteps.length) * 100;
        setOverallProgress(overall);
        
        // Check if all steps completed
        if (completedSteps === newSteps.length) {
          if (intervalRef.current) clearInterval(intervalRef.current);
          addBuildLog('🎉 Project build completed successfully!');
          setTimeout(() => onComplete?.(true), 1000);
        }
        
        return newSteps;
      });
    }, 300);
  };

  const updateAITeamStatus = (agentName: string, status: string, task: string) => {
    setAiTeamStatus(current => current.map(agent => 
      agent.name === agentName 
        ? { 
            ...agent, 
            status, 
            currentTask: task,
            completedTasks: status === 'completed' ? agent.completedTasks + 1 : agent.completedTasks
          }
        : agent
    ));
  };

  const getFirstWord = (text: string) => {
    return text.split(' ')[0] || 'app';
  };

  const generateLiveCodePreview = (step: BuildStep) => {
    const firstWord = getFirstWord(projectDescription);
    const codeSnippets = {
      analysis: `// 🧠 AI analyzing project requirements\nconst projectSpec = {\n  type: "${firstWord}",\n  complexity: "medium",\n  frameworks: ["React", "TypeScript"]\n};`,
      structure: `// 📁 Creating project structure\nmkdir src components pages\ntouch src/App.tsx src/index.tsx\ntouch package.json tsconfig.json`,
      components: `// ⚛️ Generating React components\nfunction ${projectDescription.includes('todo') ? 'TodoItem' : 'MainComponent'}() {\n  return (\n    <div className="component">\n      {/* Generated by AI */}\n    </div>\n  );\n}`,
      backend: `// 🔧 Setting up Express server\napp.get('/api/${firstWord}', (req, res) => {\n  res.json({ status: 'success' });\n});`,
      styling: `// 🎨 Applying Nordic design system\n.component {\n  background: var(--bg-primary);\n  border-radius: var(--radius-md);\n  padding: var(--space-lg);\n}`,
      testing: `// 🧪 Creating test suite\ndescribe('${firstWord} Component', () => {\n  it('renders correctly', () => {\n    // Test implementation\n  });\n});`,
      build: `// 🏗️ Building for production\n> vite build\n> Optimizing bundle size...\n> ✅ Build completed: 245.3 kB`,
      deployment: `// 🚀 Deploying to Vercel\n> Uploading files...\n> ✅ Deployed to: https://your-app.vercel.app`
    };
    
    const snippet = codeSnippets[step.id as keyof typeof codeSnippets] || '// Working...';
    setLiveCode(snippet);
  };

  const addBuildLog = (message: string) => {
    const timestamp = new Date().toLocaleTimeString();
    setBuildLogs(current => [`[${timestamp}] ${message}`, ...current].slice(0, 20));
  };

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    return minutes > 0 ? `${minutes}m ${seconds % 60}s` : `${seconds}s`;
  };

  const getElapsedTime = () => {
    return buildStartTime > 0 ? Date.now() - buildStartTime : 0;
  };

  if (!isBuilding) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full mx-4 max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-6 border-b" style={{background: 'var(--bg-primary)'}}>
          <div className="flex justify-between items-center">
            <div>
              <h2 className="nordic-h3 mb-2">🤖 AI-teamet bygger prosjektet ditt</h2>
              <p className="text-sm text-gray-600">
                {projectDescription}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold" style={{color: 'var(--accent-primary)'}}>
                {Math.round(overallProgress)}%
              </div>
              <div className="text-sm" style={{color: 'var(--text-muted)'}}>
                {formatDuration(getElapsedTime())} / ca. {estimatedDuration}min
              </div>
            </div>
          </div>
          
          {/* Overall Progress Bar */}
          <div className="mt-4">
            <div className="w-full bg-gray-200 rounded-full h-3">
              <div 
                className="h-3 rounded-full transition-all duration-500"
                style={{
                  background: 'linear-gradient(90deg, var(--accent-primary), var(--accent-secondary))',
                  width: `${overallProgress}%`
                }}
              />
            </div>
          </div>
        </div>

        <div className="flex h-[600px]">
          {/* Left Side - Build Steps */}
          <div className="w-1/3 p-6 border-r overflow-y-auto">
            <h3 className="nordic-h4 mb-4 flex items-center gap-2">
              <HiCog6Tooth className="w-5 h-5" />
              Byggetrinn
            </h3>
            <div className="space-y-3">
              {steps.map((step, index) => (
                <div 
                  key={step.id}
                  className={`p-3 rounded-lg border-2 transition-all ${
                    step.status === 'running' 
                      ? 'border-blue-500 bg-blue-50' 
                      : step.status === 'completed'
                      ? 'border-green-500 bg-green-50'
                      : step.status === 'error'
                      ? 'border-red-500 bg-red-50'
                      : 'border-gray-200'
                  }`}
                >
                  <div className="flex items-center gap-2 mb-1">
                    {step.status === 'completed' && <HiCheckCircle className="w-4 h-4 text-green-600" />}
                    {step.status === 'running' && <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />}
                    {step.status === 'error' && <HiExclamationTriangle className="w-4 h-4 text-red-600" />}
                    {step.status === 'pending' && <div className="w-4 h-4 border-2 border-gray-300 rounded-full" />}
                    
                    <span className="font-medium text-sm">{step.title}</span>
                  </div>
                  
                  <p className="text-xs text-gray-600 mb-2">{step.description}</p>
                  
                  {step.status === 'running' && (
                    <div className="w-full bg-gray-200 rounded-full h-1">
                      <div 
                        className="bg-blue-600 h-1 rounded-full transition-all duration-300"
                        style={{width: `${step.progress}%`}}
                      />
                    </div>
                  )}
                  
                  <div className="text-xs text-blue-600 mt-1">{step.aiAgent}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Center - Live Code Preview */}
          <div className="w-1/3 p-6 border-r">
            <h3 className="nordic-h4 mb-4 flex items-center gap-2">
              <HiCodeBracket className="w-5 h-5" />
              Live Kodeforhåndsvisning
            </h3>
            <div className="bg-gray-900 text-green-400 rounded-lg p-4 font-mono text-sm h-[500px] overflow-y-auto">
              <pre className="whitespace-pre-wrap">{liveCode}</pre>
              <div className="animate-pulse">▊</div>
            </div>
          </div>

          {/* Right Side - AI Team & Logs */}
          <div className="w-1/3 p-6">
            <div className="h-full flex flex-col">
              {/* AI Team Status */}
              <div className="mb-6">
                <h3 className="nordic-h4 mb-4 flex items-center gap-2">
                  <HiUsers className="w-5 h-5" />
                  AI-team Status
                </h3>
                <div className="space-y-2">
                  {aiTeamStatus.map((agent, index) => (
                    <div key={index} className="p-2 rounded bg-gray-50 border">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-sm">{agent.name}</span>
                        <div className={`px-2 py-1 rounded text-xs ${
                          agent.status === 'working' 
                            ? 'bg-yellow-100 text-yellow-800'
                            : agent.status === 'completed'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-800'
                        }`}>
                          {agent.status}
                        </div>
                      </div>
                      {agent.currentTask && (
                        <div className="text-xs text-gray-600 mt-1">
                          {agent.currentTask}
                        </div>
                      )}
                      <div className="flex justify-between text-xs text-gray-500 mt-1">
                        <span>Fullført: {agent.completedTasks}</span>
                        <span>Effektivitet: {Math.round(agent.efficiency * 100)}%</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Build Logs */}
              <div className="flex-1">
                <h3 className="nordic-h4 mb-4 flex items-center gap-2">
                  <HiChartBar className="w-5 h-5" />
                  Byggelogg
                </h3>
                <div className="bg-black text-green-400 rounded-lg p-3 font-mono text-xs h-48 overflow-y-auto">
                  {buildLogs.map((log, index) => (
                    <div key={index} className="mb-1">{log}</div>
                  ))}
                </div>
              </div>

              {/* Cancel Button */}
              <button
                onClick={onCancel}
                className="mt-4 w-full py-2 px-4 border border-red-300 text-red-700 rounded-lg hover:bg-red-50 transition-colors"
              >
                Avbryt Bygging
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RealtimeProgress;