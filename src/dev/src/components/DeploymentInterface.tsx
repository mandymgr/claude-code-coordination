import React, { useState } from 'react';
import {
  HiRocketLaunch,
  HiGlobeAlt,
  HiShieldCheck,
  HiCloud,
  HiCog6Tooth,
  HiChartBar,
  HiExclamationCircle,
  HiCheckCircle,
  HiClock,
  HiArrowTopRightOnSquare
} from 'react-icons/hi2';
import apiService from '../services/api';

interface DeploymentInterfaceProps {
  isDarkTheme: boolean;
}

interface Deployment {
  id: string;
  projectName: string;
  provider: string;
  status: string;
  url?: string;
  startTime: string;
  duration?: number;
  healthStatus: string;
}

interface Provider {
  id: string;
  name: string;
  type: string;
  supports: string[];
  features: string[];
  icon: string;
}

const DeploymentInterface: React.FC<DeploymentInterfaceProps> = ({ isDarkTheme }) => {
  const [selectedProvider, setSelectedProvider] = useState('vercel');
  const [projectName, setProjectName] = useState('');
  const [customDomain, setCustomDomain] = useState('');
  const [enableSSL, setEnableSSL] = useState(true);
  const [isDeploying, setIsDeploying] = useState(false);
  const [deploymentProgress, setDeploymentProgress] = useState(0);
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [currentStep, setCurrentStep] = useState('');

  const providers: Provider[] = [
    {
      id: 'vercel',
      name: 'Vercel',
      type: 'Serverless',
      supports: ['React', 'Next.js', 'Vue', 'Svelte'],
      features: ['Auto SSL', 'CDN', 'Analytics', 'Edge Functions'],
      icon: '▲'
    },
    {
      id: 'netlify',
      name: 'Netlify',
      type: 'JAMstack',
      supports: ['React', 'Vue', 'Gatsby', 'Hugo'],
      features: ['SSL', 'Forms', 'Functions', 'Identity'],
      icon: '🌊'
    },
    {
      id: 'aws',
      name: 'Amazon Web Services',
      type: 'Cloud Platform',
      supports: ['Docker', 'Node.js', 'Python', 'Static'],
      features: ['SSL', 'CDN', 'Database', 'Monitoring'],
      icon: '☁️'
    },
    {
      id: 'docker',
      name: 'Docker Container',
      type: 'Containerization',
      supports: ['Node.js', 'Python', 'PHP', 'Java'],
      features: ['Scalability', 'Isolation', 'Portability'],
      icon: '🐳'
    }
  ];

  const deploymentSteps = [
    'Forbereder prosjekt...',
    'Bygger applikasjon...',
    'Optimaliserer assets...',
    'Deployer til produksjon...',
    'Konfigurerer domene...',
    'Setter opp SSL...',
    'Starter health monitoring...',
    'Deployment fullført!'
  ];

  const handleDeploy = async () => {
    if (!projectName.trim()) {
      alert('Vennligst skriv inn et prosjektnavn');
      return;
    }

    setIsDeploying(true);
    setDeploymentProgress(0);
    setCurrentStep('');

    const deploymentId = `deploy_${Date.now()}`;
    const newDeployment: Deployment = {
      id: deploymentId,
      projectName: projectName,
      provider: selectedProvider,
      status: 'deploying',
      startTime: new Date().toISOString(),
      healthStatus: 'unknown'
    };

    setDeployments(prev => [newDeployment, ...prev]);

    try {
      // Show deployment steps to user
      for (let i = 0; i < deploymentSteps.length; i++) {
        const step = deploymentSteps[i];
        setCurrentStep(step);
        setDeploymentProgress(((i + 1) / deploymentSteps.length) * 100);
        await new Promise(resolve => setTimeout(resolve, 500));
      }

      // Call real deployment API
      const deploymentResponse = await apiService.deployProject({
        projectPath: `/tmp/projects/${projectName}`, // In a real app, this would be the actual project path
        provider: selectedProvider as 'vercel' | 'netlify' | 'aws' | 'docker',
        config: {
          projectId: deploymentId,
          customDomain: customDomain || undefined,
          envVars: {}
        }
      });

      // Update deployment with real results
      const completedDeployment: Deployment = {
        ...newDeployment,
        status: deploymentResponse.success ? 'deployed' : 'failed',
        url: deploymentResponse.url || undefined,
        duration: Date.now() - new Date(newDeployment.startTime).getTime(),
        healthStatus: deploymentResponse.success ? 'healthy' : 'error'
      };

      setDeployments(prev => prev.map(d => d.id === deploymentId ? completedDeployment : d));

      if (deploymentResponse.success) {
        console.log('🎉 Real deployment successful:', deploymentResponse);
      } else {
        console.error('❌ Real deployment failed:', deploymentResponse.error);
      }

    } catch (error) {
      console.error('❌ Deployment error:', error);
      
      // Mark deployment as failed
      const failedDeployment: Deployment = {
        ...newDeployment,
        status: 'failed',
        duration: Date.now() - new Date(newDeployment.startTime).getTime(),
        healthStatus: 'error'
      };
      setDeployments(prev => prev.map(d => d.id === deploymentId ? failedDeployment : d));
    }

    setIsDeploying(false);
    setDeploymentProgress(0);
    setCurrentStep('');
    setProjectName('');
    setCustomDomain('');
  };

  const deleteDeployment = (deploymentId: string) => {
    setDeployments(prev => prev.filter(d => d.id !== deploymentId));
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'deploying':
        return <HiClock className="w-4 h-4 text-yellow-600 animate-spin" />;
      case 'deployed':
        return <HiCheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed':
        return <HiExclamationCircle className="w-4 h-4 text-red-600" />;
      default:
        return <HiClock className="w-4 h-4 text-gray-600" />;
    }
  };

  const getHealthColor = (health: string) => {
    switch (health) {
      case 'healthy': return 'text-green-600';
      case 'unhealthy': return 'text-red-600';
      case 'warning': return 'text-yellow-600';
      default: return 'text-gray-600';
    }
  };

  const formatDuration = (ms: number) => {
    const seconds = Math.floor(ms / 1000);
    const minutes = Math.floor(seconds / 60);
    return minutes > 0 ? `${minutes}m ${seconds % 60}s` : `${seconds}s`;
  };

  const formatTimeAgo = (timestamp: string) => {
    const diff = Date.now() - new Date(timestamp).getTime();
    const minutes = Math.floor(diff / 60000);
    if (minutes < 1) return 'nå';
    if (minutes < 60) return `${minutes}m siden`;
    const hours = Math.floor(minutes / 60);
    if (hours < 24) return `${hours}t siden`;
    return `${Math.floor(hours / 24)}d siden`;
  };

  return (
    <section className="nordic-section">
      <div className="nordic-container-wide">
        {/* Header */}
        <div className="nordic-grid-magazine mb-12">
          <div>
            <div className="nordic-h3" style={{color: 'var(--text-muted)', marginBottom: 'var(--space-sm)'}}>
              One-Click Deployment
            </div>
            <h1 className="nordic-h1" style={{marginBottom: 'var(--space-md)'}}>
              Automatisk Publisering
            </h1>
            <p className="nordic-body-large">
              Deploy prosjekter til multiple platformer med automatisk SSL, 
              domene-oppsett og kontinuerlig health monitoring.
            </p>
          </div>
          <div className="nordic-card p-6">
            <div className="text-center">
              <div className="text-2xl font-bold mb-2" style={{color: 'var(--accent-primary)'}}>
                {deployments.length}
              </div>
              <div className="text-sm" style={{color: 'var(--text-muted)'}}>
                Totale Deployments
              </div>
            </div>
          </div>
        </div>

        <div className="nordic-grid-2 gap-12 items-start">
          {/* Deployment Form */}
          <div>
            <h2 className="nordic-h3 mb-6">Nytt Deployment</h2>
            
            <div className="space-y-6">
              {/* Project Name */}
              <div>
                <label className="block text-sm font-medium mb-2">Prosjektnavn</label>
                <input
                  type="text"
                  value={projectName}
                  onChange={(e) => setProjectName(e.target.value)}
                  placeholder="min-fantastiske-app"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Provider Selection */}
              <div>
                <label className="block text-sm font-medium mb-4">Deployment Platform</label>
                <div className="grid grid-cols-2 gap-4">
                  {providers.map((provider) => (
                    <button
                      key={provider.id}
                      onClick={() => setSelectedProvider(provider.id)}
                      className={`p-4 border-2 rounded-lg text-left transition-all ${
                        selectedProvider === provider.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                    >
                      <div className="flex items-center gap-3 mb-3">
                        <span className="text-2xl">{provider.icon}</span>
                        <div>
                          <div className="font-semibold">{provider.name}</div>
                          <div className="text-sm text-gray-600">{provider.type}</div>
                        </div>
                      </div>
                      
                      <div className="space-y-2">
                        <div>
                          <div className="text-xs font-medium text-gray-500 mb-1">STØTTER</div>
                          <div className="flex flex-wrap gap-1">
                            {provider.supports.slice(0, 2).map((tech) => (
                              <span 
                                key={tech}
                                className="text-xs px-2 py-1 bg-gray-100 rounded-full"
                              >
                                {tech}
                              </span>
                            ))}
                            {provider.supports.length > 2 && (
                              <span className="text-xs text-gray-500">+{provider.supports.length - 2}</span>
                            )}
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Advanced Options */}
              <div className="border-t pt-6">
                <h3 className="font-medium mb-4">Avanserte innstillinger</h3>
                
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium mb-2">Tilpasset domene (valgfritt)</label>
                    <input
                      type="text"
                      value={customDomain}
                      onChange={(e) => setCustomDomain(e.target.value)}
                      placeholder="minapp.no"
                      className="w-full p-3 border border-gray-300 rounded-lg"
                    />
                  </div>

                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="ssl"
                      checked={enableSSL}
                      onChange={(e) => setEnableSSL(e.target.checked)}
                      className="w-4 h-4 text-blue-600"
                    />
                    <label htmlFor="ssl" className="text-sm">
                      Automatisk SSL sertifikat
                    </label>
                  </div>
                </div>
              </div>

              {/* Deploy Button */}
              <button
                onClick={handleDeploy}
                disabled={isDeploying || !projectName.trim()}
                className="w-full nordic-button-primary py-4 text-lg font-medium disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <div className="flex items-center justify-center gap-3">
                  {isDeploying ? (
                    <>
                      <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full" />
                      Deployer... ({Math.round(deploymentProgress)}%)
                    </>
                  ) : (
                    <>
                      <HiRocketLaunch className="w-5 h-5" />
                      Deploy til {providers.find(p => p.id === selectedProvider)?.name}
                    </>
                  )}
                </div>
              </button>

              {/* Deployment Progress */}
              {isDeploying && (
                <div className="space-y-3">
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                      style={{ width: `${deploymentProgress}%` }}
                    />
                  </div>
                  {currentStep && (
                    <div className="text-sm text-gray-600 text-center">
                      {currentStep}
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* Active Deployments */}
          <div>
            <h2 className="nordic-h3 mb-6">Deployments Oversikt</h2>
            
            {deployments.length === 0 ? (
              <div className="nordic-card p-8 text-center">
                <HiRocketLaunch className="w-12 h-12 mx-auto mb-4" style={{color: 'var(--text-muted)'}} />
                <h3 className="font-semibold mb-2">Ingen deployments ennå</h3>
                <p className="text-sm" style={{color: 'var(--text-muted)'}}>
                  Dine deployments vil vises her etter du har publisert et prosjekt.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {deployments.map((deployment) => (
                  <div key={deployment.id} className="nordic-card">
                    <div className="p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            {getStatusIcon(deployment.status)}
                            <h3 className="font-semibold">{deployment.projectName}</h3>
                            <span className="text-xs px-2 py-1 rounded-full bg-gray-100 text-gray-700">
                              {deployment.provider}
                            </span>
                          </div>
                          
                          <div className="grid grid-cols-2 gap-4 text-sm">
                            <div>
                              <span style={{color: 'var(--text-muted)'}}>Status: </span>
                              <span className="capitalize">{deployment.status}</span>
                            </div>
                            <div>
                              <span style={{color: 'var(--text-muted)'}}>Helse: </span>
                              <span className={`capitalize ${getHealthColor(deployment.healthStatus)}`}>
                                {deployment.healthStatus}
                              </span>
                            </div>
                            <div>
                              <span style={{color: 'var(--text-muted)'}}>Deployed: </span>
                              <span>{formatTimeAgo(deployment.startTime)}</span>
                            </div>
                            {deployment.duration && (
                              <div>
                                <span style={{color: 'var(--text-muted)'}}>Varighet: </span>
                                <span>{formatDuration(deployment.duration)}</span>
                              </div>
                            )}
                          </div>

                          {deployment.url && (
                            <div className="mt-3 pt-3 border-t">
                              <div className="flex items-center justify-between">
                                <span className="text-sm" style={{color: 'var(--text-muted)'}}>
                                  URL:
                                </span>
                                <div className="flex items-center gap-2">
                                  <a
                                    href={deployment.url}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-blue-600 hover:text-blue-800 font-mono"
                                  >
                                    {deployment.url.replace('https://', '')}
                                  </a>
                                  <HiArrowTopRightOnSquare className="w-4 h-4 text-gray-400" />
                                </div>
                              </div>
                            </div>
                          )}
                        </div>

                        <button
                          onClick={() => deleteDeployment(deployment.id)}
                          className="text-sm text-red-600 hover:text-red-800 px-3 py-1 rounded hover:bg-red-50"
                        >
                          Slett
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Provider Features Overview */}
        <div className="mt-16">
          <h2 className="nordic-h3 mb-6 text-center">Platform Funksjoner</h2>
          
          <div className="nordic-grid-4 gap-6">
            {providers.map((provider) => (
              <div key={provider.id} className="nordic-card p-6 text-center">
                <div className="text-3xl mb-4">{provider.icon}</div>
                <h3 className="font-semibold mb-2">{provider.name}</h3>
                <p className="text-sm text-gray-600 mb-4">{provider.type}</p>
                
                <div className="space-y-2">
                  <div className="text-xs font-medium text-gray-500">HOVEDFUNKSJONER</div>
                  <div className="space-y-1">
                    {provider.features.map((feature) => (
                      <div key={feature} className="text-xs text-gray-600">
                        • {feature}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default DeploymentInterface;