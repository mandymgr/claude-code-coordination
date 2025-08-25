import React, { useState } from 'react';
import { 
  HiSparkles,
  HiRocketLaunch,
  HiCog6Tooth,
  HiEye,
  HiChevronDown,
  HiChevronRight,
  HiDocumentDuplicate,
  HiCommandLine
} from 'react-icons/hi2';
import SmartInput from '../components/SmartInput';
import RealtimeProgress from '../components/RealtimeProgress';
import apiService from '../services/api';

interface SimpleBuilderProps {
  isDarkTheme: boolean;
}

const SimpleBuilder: React.FC<SimpleBuilderProps> = ({ isDarkTheme }) => {
  const [description, setDescription] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('');
  const [mode, setMode] = useState<'simple' | 'advanced' | 'expert'>('simple');
  const [isBuilding, setIsBuilding] = useState(false);
  const [showAdvanced, setShowAdvanced] = useState(false);

  const templates = [
    { id: 'todo-app', name: 'Todo App', desc: 'Task management with React' },
    { id: 'ecommerce', name: 'E-commerce', desc: 'Full shopping platform' },
    { id: 'blog', name: 'Blog', desc: 'Content management system' },
    { id: 'portfolio', name: 'Portfolio', desc: 'Professional showcase' },
    { id: 'chat', name: 'Chat App', desc: 'Real-time messaging' },
    { id: 'startup', name: 'Startup Site', desc: 'Landing page template' }
  ];

  const smartSuggestions = [
    'a modern task management app with dark mode',
    'an e-commerce platform with payment integration',
    'a real-time chat application with file sharing',
    'a portfolio website with project galleries',
    'a blog platform with markdown support'
  ];

  const handleBuild = async () => {
    setIsBuilding(true);
    
    try {
      const projectDescription = selectedTemplate || description;
      console.log('🚀 Starting real AI build:', projectDescription);
      
      // Create project in database
      const projectResponse = await apiService.createProject({
        name: projectDescription.split(' ').slice(0, 3).join('-'),
        description: projectDescription,
        techStack: 'react-ts',
        userId: 'user-' + Math.random().toString(36).substr(2, 9)
      });

      if (projectResponse.success) {
        // Start real AI team building
        const buildResponse = await apiService.buildWithAI({
          projectDescription,
          teamComposition: mode === 'simple' ? ['claude'] : ['claude', 'gpt-4'],
          projectId: projectResponse.projectId
        });

        console.log('🎉 Real AI build completed:', buildResponse);
      }
      
    } catch (error) {
      console.error('❌ Real build failed:', error);
      setIsBuilding(false);
    }
  };

  const handleBuildComplete = (success: boolean) => {
    setIsBuilding(false);
    if (success) {
      console.log('🎉 Build completed successfully!');
      // Could show success notification here
    }
  };

  const handleBuildCancel = () => {
    setIsBuilding(false);
  };

  return (
    <section className="nordic-section">
      <div className="nordic-container">
        <div className="text-center mb-12">
          <div className="nordic-h3" style={{color: 'var(--text-muted)', marginBottom: 'var(--space-sm)'}}>
            Enkel Opprettelse
          </div>
          <h1 className="nordic-h1" style={{marginBottom: 'var(--space-md)'}}>
            Bygg Hva Som Helst
          </h1>
          <p className="nordic-body-large max-w-2xl mx-auto">
            Beskriv prosjektet ditt i naturlig språk eller velg en mal. 
            AI-teamet vårt bygger det automatisk med beste praksis.
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex justify-center mb-8">
          <div className="nordic-card inline-flex p-1" style={{background: 'var(--surface-elevated)'}}>
            {(['simple', 'advanced', 'expert'] as const).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
                  mode === m 
                    ? 'text-white shadow-sm' 
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                style={{
                  background: mode === m ? 'var(--accent-primary)' : 'transparent'
                }}
              >
                {m === 'simple' && 'Enkel'}
                {m === 'advanced' && 'Avansert'}  
                {m === 'expert' && 'Ekspert'}
              </button>
            ))}
          </div>
        </div>

        {/* Simple Mode */}
        {mode === 'simple' && (
          <div className="max-w-4xl mx-auto space-y-8">
            {/* Quick Templates */}
            <div>
              <h3 className="nordic-h4 mb-4">Velg en mal</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {templates.map((template) => (
                  <button
                    key={template.id}
                    onClick={() => setSelectedTemplate(template.id)}
                    className={`nordic-card p-4 text-left transition-all hover:scale-105 ${
                      selectedTemplate === template.id 
                        ? 'ring-2 ring-blue-500' 
                        : ''
                    }`}
                  >
                    <div className="flex items-center gap-3 mb-2">
                      <HiDocumentDuplicate className="w-5 h-5" style={{color: 'var(--accent-primary)'}} />
                      <div className="font-medium">{template.name}</div>
                    </div>
                    <div className="text-sm" style={{color: 'var(--text-muted)'}}>
                      {template.desc}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            <div className="text-center" style={{color: 'var(--text-muted)'}}>
              eller
            </div>

            {/* Natural Language Input */}
            <div>
              <h3 className="nordic-h4 mb-4">Beskriv prosjektet ditt</h3>
              <SmartInput
                value={description}
                onChange={setDescription}
                placeholder="Jeg vil lage en moderne todo-app med drag-and-drop, dark mode, og sync mellom enheter..."
                context="simple"
                onSuggestionSelect={(suggestion) => {
                  console.log('Selected suggestion:', suggestion);
                  if (suggestion.category === 'template') {
                    setSelectedTemplate(suggestion.id);
                  }
                }}
                className="mb-4"
              />
            </div>

            {/* Build Button */}
            <div className="text-center">
              <button
                onClick={handleBuild}
                disabled={!selectedTemplate && !description.trim() || isBuilding}
                className="nordic-button-primary px-8 py-4 text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center gap-3">
                  {isBuilding ? (
                    <>
                      <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                      Bygger prosjekt...
                    </>
                  ) : (
                    <>
                      <HiRocketLaunch className="w-5 h-5" />
                      Start AI-teamet
                    </>
                  )}
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Advanced Mode */}
        {mode === 'advanced' && (
          <div className="max-w-4xl mx-auto space-y-8">
            <div className="nordic-grid-2">
              <div>
                <h3 className="nordic-h4 mb-4">Prosjektbeskrivelse</h3>
                <SmartInput
                  value={description}
                  onChange={setDescription}
                  placeholder="Detaljert beskrivelse av prosjektet med spesifiserte krav..."
                  context="advanced"
                  onSuggestionSelect={(suggestion) => {
                    console.log('Advanced suggestion selected:', suggestion);
                  }}
                />
              </div>
              
              <div>
                <h3 className="nordic-h4 mb-4">AI-team Sammensetning</h3>
                <div className="nordic-card p-4">
                  <div className="space-y-3">
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Frontend Specialist</span>
                      <span className="text-xs px-2 py-1 rounded" style={{background: 'var(--accent-primary)', color: 'white'}}>Claude</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">Backend Developer</span>
                      <span className="text-xs px-2 py-1 rounded" style={{background: 'var(--accent-secondary)', color: 'white'}}>GPT-4</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-sm">DevOps Engineer</span>
                      <span className="text-xs px-2 py-1 rounded" style={{background: 'var(--accent-tertiary)', color: 'white'}}>Gemini</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Advanced Options */}
            <div>
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="flex items-center gap-2 mb-4 text-sm"
                style={{color: 'var(--accent-primary)'}}
              >
                {showAdvanced ? <HiChevronDown /> : <HiChevronRight />}
                Avanserte innstillinger
              </button>
              
              {showAdvanced && (
                <div className="nordic-card p-6 space-y-4">
                  <div className="nordic-grid-2">
                    <div>
                      <label className="block text-sm font-medium mb-2">Teknologi Stack</label>
                      <select className="w-full p-2 border rounded" style={{borderColor: 'var(--border-subtle)'}}>
                        <option>React + TypeScript</option>
                        <option>Vue.js</option>
                        <option>Next.js</option>
                        <option>Svelte</option>
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-medium mb-2">Deployment</label>
                      <select className="w-full p-2 border rounded" style={{borderColor: 'var(--border-subtle)'}}>
                        <option>Vercel</option>
                        <option>Netlify</option>
                        <option>AWS</option>
                        <option>Docker</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}
            </div>

            <div className="text-center">
              <button
                onClick={handleBuild}
                disabled={!description.trim() || isBuilding}
                className="nordic-button-primary px-8 py-4 text-lg font-medium disabled:opacity-50"
              >
                <div className="flex items-center gap-3">
                  {isBuilding ? (
                    <>
                      <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                      Bygger...
                    </>
                  ) : (
                    <>
                      <HiCog6Tooth className="w-5 h-5" />
                      Bygg med tilpassinger
                    </>
                  )}
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Expert Mode */}
        {mode === 'expert' && (
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="nordic-grid-3">
              <div>
                <h3 className="nordic-h4 mb-4">Prosjekt Arkitektur</h3>
                <div className="nordic-card p-4">
                  <textarea
                    placeholder="Detaljert arkitektur og krav..."
                    className="w-full h-32 p-2 border-0 resize-none bg-transparent"
                  />
                </div>
              </div>
              
              <div>
                <h3 className="nordic-h4 mb-4">AI-team Konfigurasjon</h3>
                <div className="nordic-card p-4 space-y-3">
                  <div>
                    <label className="block text-xs mb-1">Leder AI</label>
                    <select className="w-full text-sm p-1 border rounded">
                      <option>Claude (Orchestrator)</option>
                      <option>GPT-4 (Manager)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs mb-1">Team Størrelse</label>
                    <input type="range" min="3" max="12" defaultValue="5" className="w-full" />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="nordic-h4 mb-4">Pipeline Kontroll</h3>
                <div className="nordic-card p-4 space-y-2">
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" defaultChecked />
                    Automatisk testing
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" defaultChecked />
                    Code review
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <input type="checkbox" />
                    Automatisk deployment
                  </label>
                </div>
              </div>
            </div>

            {/* Live Command Preview */}
            <div>
              <h3 className="nordic-h4 mb-4">Live Kommando Forhåndsvisning</h3>
              <div className="nordic-card bg-black text-green-400 font-mono text-sm p-4">
                <div>$ magic build "advanced-project" --ai-team=5 --stack=react-ts --deployment=vercel</div>
                <div className="text-gray-500 mt-2"># AI team configuration: Claude (Lead), GPT-4 (Backend), Gemini (DevOps)...</div>
              </div>
            </div>

            <div className="text-center">
              <button
                onClick={handleBuild}
                className="nordic-button-primary px-8 py-4 text-lg font-medium"
              >
                <div className="flex items-center gap-3">
                  <HiCommandLine className="w-5 h-5" />
                  Kjør Ekspert Pipeline
                </div>
              </button>
            </div>
          </div>
        )}

        {/* Advanced Realtime Progress */}
        <RealtimeProgress 
          isBuilding={isBuilding}
          projectDescription={selectedTemplate || description}
          onComplete={handleBuildComplete}
          onCancel={handleBuildCancel}
        />
      </div>
    </section>
  );
};

export default SimpleBuilder;