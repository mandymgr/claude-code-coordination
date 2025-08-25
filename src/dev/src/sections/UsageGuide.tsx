import React, { useState } from 'react';
import {
  HiPlay,
  HiCommandLine,
  HiCodeBracket,
  HiCog6Tooth,
  HiRocketLaunch,
  HiUsers,
  HiCpuChip,
  HiLockClosed,
  HiGlobeAlt,
  HiChevronDown,
  HiChevronRight,
  HiCheckCircle,
  HiClipboardDocument,
  HiArrowTopRightOnSquare,
  HiLightBulb,
  HiExclamationTriangle
} from 'react-icons/hi2';

interface UsageGuideProps {
  isDarkTheme: boolean;
}

interface GuideStep {
  id: string;
  title: string;
  description: string;
  code?: string;
  commands?: string[];
  icon: any;
  category: 'installation' | 'basic' | 'advanced' | 'vscode' | 'troubleshooting';
}

const UsageGuide: React.FC<UsageGuideProps> = ({ isDarkTheme }) => {
  const [expandedStep, setExpandedStep] = useState<string | null>('install-cli');
  const [selectedCategory, setSelectedCategory] = useState<string>('installation');
  const [copiedCommand, setCopiedCommand] = useState<string>('');

  const categories = [
    { id: 'installation', name: 'Installasjon', icon: HiPlay, color: 'var(--accent-primary)' },
    { id: 'basic', name: 'Grunnleggende', icon: HiCommandLine, color: 'var(--accent-secondary)' },
    { id: 'advanced', name: 'Avansert', icon: HiCpuChip, color: 'var(--accent-tertiary)' },
    { id: 'vscode', name: 'VS Code', icon: HiCodeBracket, color: 'var(--accent-primary)' },
    { id: 'troubleshooting', name: 'Feilsøking', icon: HiExclamationTriangle, color: '#ef4444' }
  ];

  const guideSteps: GuideStep[] = [
    // Installation
    {
      id: 'install-cli',
      title: 'Installer Magic CLI',
      description: 'Installer hovedsystemet globalt på din maskin',
      code: `cd claude-code-coordination
npm install -g .`,
      commands: ['cd claude-code-coordination', 'npm install -g .'],
      icon: HiCommandLine,
      category: 'installation'
    },
    {
      id: 'verify-install',
      title: 'Verifiser Installasjon',
      description: 'Sjekk at Magic CLI er riktig installert',
      code: 'magic --version',
      commands: ['magic --version'],
      icon: HiCheckCircle,
      category: 'installation'
    },
    {
      id: 'start-backend',
      title: 'Start Backend Server',
      description: 'Start koordinasjons-backend for multi-terminal support',
      code: 'npm run backend',
      commands: ['npm run backend'],
      icon: HiRocketLaunch,
      category: 'installation'
    },
    {
      id: 'start-frontend',
      title: 'Start Web Dashboard',
      description: 'Åpne det visuelle grensesnittet i nettleseren',
      code: `cd src/dev
npm install
npm run dev`,
      commands: ['cd src/dev', 'npm install', 'npm run dev'],
      icon: HiGlobeAlt,
      category: 'installation'
    },

    // Basic Usage
    {
      id: 'basic-session',
      title: 'Start Koordinasjonssesjon',
      description: 'Opprett en ny sesjon for prosjektkoordinering',
      code: 'magic init',
      commands: ['magic init'],
      icon: HiPlay,
      category: 'basic'
    },
    {
      id: 'basic-build',
      title: 'Enkel Prosjektbygging',
      description: 'Bruk AI-teamet til å bygge prosjekter automatisk',
      code: 'magic build "en modern todo-app med React"',
      commands: ['magic build "beskrivelse av prosjekt"'],
      icon: HiRocketLaunch,
      category: 'basic'
    },
    {
      id: 'basic-status',
      title: 'Sjekk Status',
      description: 'Se oversikt over aktive sesjoner og låste filer',
      code: 'magic status',
      commands: ['magic status'],
      icon: HiCog6Tooth,
      category: 'basic'
    },
    {
      id: 'basic-lock',
      title: 'Lås Filer',
      description: 'Lås filer for å unngå konflikter med andre brukere',
      code: 'magic lock src/components/App.tsx',
      commands: ['magic lock <filpath>'],
      icon: HiLockClosed,
      category: 'basic'
    },

    // Advanced Usage
    {
      id: 'advanced-team',
      title: 'Konfigurer AI-Team',
      description: 'Tilpass AI-team sammensetning for komplekse prosjekter',
      code: `magic build "e-commerce platform" \\
  --ai-team=5 \\
  --stack=react-ts \\
  --deployment=vercel`,
      commands: ['magic build "prosjekt" --ai-team=5 --stack=react-ts'],
      icon: HiUsers,
      category: 'advanced'
    },
    {
      id: 'advanced-optimize',
      title: 'ML-basert Optimalisering',
      description: 'Kjør machine learning optimalisering av team-ytelse',
      code: 'magic optimize --analyze-performance',
      commands: ['magic optimize --analyze-performance'],
      icon: HiCpuChip,
      category: 'advanced'
    },
    {
      id: 'advanced-deploy',
      title: 'One-Click Deployment',
      description: 'Automatisk deployment til alle platformer',
      code: `magic deploy \\
  --platforms=vercel,netlify,aws \\
  --auto-domain`,
      commands: ['magic deploy --platforms=vercel,netlify,aws'],
      icon: HiArrowTopRightOnSquare,
      category: 'advanced'
    },

    // VS Code Integration
    {
      id: 'vscode-install',
      title: 'Installer VS Code Extension',
      description: 'Legg til koordinering direkte i VS Code editoren',
      code: `cd extensions/vscode
npm install
npm run compile`,
      commands: ['cd extensions/vscode', 'npm install', 'npm run compile'],
      icon: HiCodeBracket,
      category: 'vscode'
    },
    {
      id: 'vscode-shortcuts',
      title: 'Bruk Hurtigtaster',
      description: 'Effektiv navigering med tastatursnakveier',
      code: `Cmd+Shift+L  → Lås fil
Cmd+Shift+A  → AI-hjelp  
Cmd+Shift+S  → Vis status`,
      commands: ['Cmd+Shift+L', 'Cmd+Shift+A', 'Cmd+Shift+S'],
      icon: HiCommandLine,
      category: 'vscode'
    },

    // Troubleshooting
    {
      id: 'trouble-ports',
      title: 'Port-konflikter',
      description: 'Løs problemer med opptatte porter',
      code: `# Sjekk hvilke porter som er i bruk
lsof -i :3000
lsof -i :8080

# Kill prosess på port
kill -9 $(lsof -t -i:3000)`,
      commands: ['lsof -i :3000', 'kill -9 $(lsof -t -i:3000)'],
      icon: HiExclamationTriangle,
      category: 'troubleshooting'
    },
    {
      id: 'trouble-permissions',
      title: 'Tillatelser og Avhengigheter',
      description: 'Feilsøk installasjon og tilgangsproblemer',
      code: `# Reinstaller globalt
sudo npm uninstall -g claude-code-coordination
sudo npm install -g .

# Sjekk Node.js versjon
node --version`,
      commands: ['sudo npm uninstall -g claude-code-coordination', 'node --version'],
      icon: HiCog6Tooth,
      category: 'troubleshooting'
    }
  ];

  const filteredSteps = guideSteps.filter(step => step.category === selectedCategory);

  const copyToClipboard = async (text: string, commandId: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopiedCommand(commandId);
      setTimeout(() => setCopiedCommand(''), 2000);
    } catch (err) {
      console.error('Failed to copy text: ', err);
    }
  };

  const toggleStep = (stepId: string) => {
    setExpandedStep(expandedStep === stepId ? null : stepId);
  };

  return (
    <section className="nordic-section">
      <div className="nordic-container-wide">
        {/* Header */}
        <div className="nordic-grid-magazine mb-12">
          <div>
            <div className="nordic-h3" style={{color: 'var(--text-muted)', marginBottom: 'var(--space-sm)'}}>
              Komplett Guide
            </div>
            <h1 className="nordic-h1" style={{marginBottom: 'var(--space-md)'}}>
              Hvordan Bruke Systemet
            </h1>
            <p className="nordic-body-large">
              Steg-for-steg guide for å komme i gang med Claude Code Coordination - 
              fra installasjon til avanserte AI-team konfigurasjoner.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            <div className="nordic-card p-4">
              <div className="text-sm mb-2" style={{color: 'var(--text-muted)'}}>Hurtig navigering:</div>
              <div className="space-y-2">
                {categories.slice(0, 3).map((cat) => (
                  <button
                    key={cat.id}
                    onClick={() => setSelectedCategory(cat.id)}
                    className={`text-sm px-3 py-1 rounded transition-all ${
                      selectedCategory === cat.id ? 'font-medium' : 'hover:opacity-80'
                    }`}
                    style={{
                      background: selectedCategory === cat.id ? cat.color : 'var(--bg-tertiary)',
                      color: selectedCategory === cat.id ? 'white' : 'var(--text-primary)'
                    }}
                  >
                    <cat.icon className="w-4 h-4 inline mr-2" />
                    {cat.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Category Navigation */}
        <div className="flex flex-wrap gap-4 mb-8 justify-center">
          {categories.map((category) => (
            <button
              key={category.id}
              onClick={() => setSelectedCategory(category.id)}
              className={`flex items-center gap-3 px-6 py-3 rounded-lg transition-all font-medium ${
                selectedCategory === category.id 
                  ? 'shadow-lg transform scale-105' 
                  : 'hover:scale-102 hover:shadow-md'
              }`}
              style={{
                background: selectedCategory === category.id ? category.color : 'var(--bg-secondary)',
                color: selectedCategory === category.id ? 'white' : 'var(--text-primary)',
                border: selectedCategory === category.id ? 'none' : '1px solid var(--border-subtle)'
              }}
            >
              <category.icon className="w-5 h-5" />
              <span>{category.name}</span>
              <div className="text-xs opacity-75">
                ({filteredSteps.length})
              </div>
            </button>
          ))}
        </div>

        {/* Guide Steps */}
        <div className="max-w-4xl mx-auto space-y-4">
          {filteredSteps.map((step, index) => {
            const isExpanded = expandedStep === step.id;
            const StepIcon = step.icon;
            
            return (
              <div key={step.id} className="nordic-card overflow-hidden">
                <button
                  onClick={() => toggleStep(step.id)}
                  className="w-full p-6 text-left transition-all hover:bg-opacity-50"
                  style={{backgroundColor: isExpanded ? 'var(--bg-tertiary)' : 'transparent'}}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="flex items-center gap-3">
                        <div 
                          className="w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm"
                          style={{background: categories.find(c => c.id === selectedCategory)?.color}}
                        >
                          {index + 1}
                        </div>
                        <StepIcon className="w-6 h-6" style={{color: 'var(--accent-primary)'}} />
                      </div>
                      <div>
                        <h3 className="nordic-h4 mb-1">{step.title}</h3>
                        <p className="nordic-body text-sm" style={{color: 'var(--text-muted)'}}>
                          {step.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      {isExpanded && (
                        <HiCheckCircle className="w-5 h-5 text-green-500" />
                      )}
                      {isExpanded ? (
                        <HiChevronDown className="w-5 h-5" style={{color: 'var(--text-muted)'}} />
                      ) : (
                        <HiChevronRight className="w-5 h-5" style={{color: 'var(--text-muted)'}} />
                      )}
                    </div>
                  </div>
                </button>

                {isExpanded && (
                  <div className="px-6 pb-6 border-t" style={{borderColor: 'var(--border-subtle)'}}>
                    <div className="mt-6">
                      {step.code && (
                        <div className="mb-4">
                          <div className="flex items-center justify-between mb-2">
                            <div className="text-sm font-medium flex items-center gap-2">
                              <HiCommandLine className="w-4 h-4" />
                              Kommando{step.commands && step.commands.length > 1 ? 'er' : ''}:
                            </div>
                            <button
                              onClick={() => copyToClipboard(step.code!, step.id)}
                              className="text-xs px-3 py-1 rounded flex items-center gap-2 transition-all hover:scale-105"
                              style={{
                                background: copiedCommand === step.id ? 'var(--accent-secondary)' : 'var(--bg-tertiary)',
                                color: copiedCommand === step.id ? 'white' : 'var(--text-primary)'
                              }}
                            >
                              {copiedCommand === step.id ? (
                                <>
                                  <HiCheckCircle className="w-3 h-3" />
                                  Kopiert!
                                </>
                              ) : (
                                <>
                                  <HiClipboardDocument className="w-3 h-3" />
                                  Kopier
                                </>
                              )}
                            </button>
                          </div>
                          <div 
                            className="font-mono text-sm p-4 rounded-lg overflow-x-auto"
                            style={{
                              background: isDarkTheme ? '#1a1a1a' : '#f8f9fa',
                              border: '1px solid var(--border-subtle)'
                            }}
                          >
                            <pre style={{margin: 0, whiteSpace: 'pre-wrap'}}>{step.code}</pre>
                          </div>
                        </div>
                      )}

                      {/* Tips and Additional Info */}
                      <div className="mt-4 p-4 rounded-lg" style={{background: 'var(--bg-secondary)'}}>
                        <div className="flex items-start gap-3">
                          <HiLightBulb className="w-5 h-5 flex-shrink-0 mt-0.5" style={{color: 'var(--accent-tertiary)'}} />
                          <div className="text-sm">
                            {step.category === 'installation' && (
                              <div>
                                <div className="font-medium mb-2">💡 Tips for installasjon:</div>
                                <ul className="space-y-1 text-sm" style={{color: 'var(--text-muted)'}}>
                                  <li>• Sørg for at Node.js versjon 14+ er installert</li>
                                  <li>• Bruk sudo hvis du får tillatelsefeil på macOS/Linux</li>
                                  <li>• Restart terminalen etter global installasjon</li>
                                </ul>
                              </div>
                            )}
                            {step.category === 'basic' && (
                              <div>
                                <div className="font-medium mb-2">💡 Grunnleggende tips:</div>
                                <ul className="space-y-1 text-sm" style={{color: 'var(--text-muted)'}}>
                                  <li>• Bruk alltid beskrivende filnavn og prosjektbeskrivelser</li>
                                  <li>• Start med enkle kommandoer før du går til avanserte</li>
                                  <li>• Sjekk status regelmessig med `magic status`</li>
                                </ul>
                              </div>
                            )}
                            {step.category === 'advanced' && (
                              <div>
                                <div className="font-medium mb-2">💡 Avanserte teknikker:</div>
                                <ul className="space-y-1 text-sm" style={{color: 'var(--text-muted)'}}>
                                  <li>• Kombiner flere flagg for maksimal kontroll</li>
                                  <li>• Bruk ML-optimalisering for bedre team-ytelse</li>
                                  <li>• Sett opp egne deployment-pipelines</li>
                                </ul>
                              </div>
                            )}
                            {step.category === 'vscode' && (
                              <div>
                                <div className="font-medium mb-2">💡 VS Code integrasjon:</div>
                                <ul className="space-y-1 text-sm" style={{color: 'var(--text-muted)'}}>
                                  <li>• Tilpass hurtigtaster i VS Code preferences</li>
                                  <li>• Bruk Command Palette for alle funksjoner</li>
                                  <li>• Aktiver file decorations for visuell feedback</li>
                                </ul>
                              </div>
                            )}
                            {step.category === 'troubleshooting' && (
                              <div>
                                <div className="font-medium mb-2">💡 Feilsøking:</div>
                                <ul className="space-y-1 text-sm" style={{color: 'var(--text-muted)'}}>
                                  <li>• Sjekk logs i `.claude-coordination/logs/`</li>
                                  <li>• Restart backend server hvis WebSocket feil</li>
                                  <li>• Bruk `magic debug` for detaljert informasjon</li>
                                </ul>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Quick Reference Card */}
        <div className="mt-12 nordic-card p-8 text-center">
          <div className="max-w-2xl mx-auto">
            <HiRocketLaunch className="w-12 h-12 mx-auto mb-4" style={{color: 'var(--accent-primary)'}} />
            <h3 className="nordic-h4 mb-4">Klar til å starte?</h3>
            <p className="nordic-body mb-6">
              Med denne guiden har du alt du trenger for å bruke Claude Code Coordination effektivt. 
              Start med installasjonen og jobb deg oppover til avanserte funksjoner.
            </p>
            <div className="flex justify-center gap-4">
              <button 
                onClick={() => setSelectedCategory('installation')}
                className="nordic-button-primary"
              >
                Start med installasjon
              </button>
              <button 
                onClick={() => setSelectedCategory('basic')}
                className="nordic-button"
              >
                Hopp til grunnleggende bruk
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default UsageGuide;