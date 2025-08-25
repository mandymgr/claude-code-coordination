import React, { useState, useEffect } from 'react';
import {
  HiUsers,
  HiGlobeAlt,
  HiCursorArrowRays,
  HiExclamationTriangle,
  HiShield,
  HiChatBubbleLeft,
  HiEye,
  HiPencil,
  HiPlay,
  HiStop
} from 'react-icons/hi2';

interface MultiUserInterfaceProps {
  isDarkTheme: boolean;
}

interface User {
  id: string;
  role: string;
  presence: string;
  currentProject?: string;
  cursor: { x: number; y: number };
  selection?: any;
  connectedAt: string;
}

interface Project {
  id: string;
  name: string;
  collaborators: number;
  buildStatus: string;
  lastActivity: string;
}

interface Conflict {
  id: string;
  type: string;
  users: string[];
  field: string;
  timestamp: string;
}

const MultiUserInterface: React.FC<MultiUserInterfaceProps> = ({ isDarkTheme }) => {
  const [isConnected, setIsConnected] = useState(false);
  const [activeUsers, setActiveUsers] = useState<User[]>([]);
  const [activeProjects, setActiveProjects] = useState<Project[]>([]);
  const [activeConflicts, setActiveConflicts] = useState<Conflict[]>([]);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [connectionStatus, setConnectionStatus] = useState('disconnected');

  // Simulate WebSocket connection
  useEffect(() => {
    simulateConnection();
    const interval = setInterval(updateRealTimeData, 2000);
    return () => clearInterval(interval);
  }, []);

  const simulateConnection = async () => {
    setConnectionStatus('connecting');
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIsConnected(true);
    setConnectionStatus('connected');
    
    // Create current user
    const user: User = {
      id: 'user_' + Math.random().toString(36).substr(2, 9),
      role: 'collaborator',
      presence: 'online',
      cursor: { x: 0, y: 0 },
      connectedAt: new Date().toISOString()
    };
    setCurrentUser(user);
    
    // Load initial data
    loadInitialData();
  };

  const loadInitialData = () => {
    // Simulate active users
    setActiveUsers([
      {
        id: 'user_alice',
        role: 'admin',
        presence: 'online',
        currentProject: 'project_todo_app',
        cursor: { x: 245, y: 120 },
        connectedAt: new Date(Date.now() - 300000).toISOString()
      },
      {
        id: 'user_bob',
        role: 'collaborator',
        presence: 'online', 
        currentProject: 'project_todo_app',
        cursor: { x: 180, y: 340 },
        connectedAt: new Date(Date.now() - 150000).toISOString()
      },
      {
        id: 'user_charlie',
        role: 'viewer',
        presence: 'away',
        cursor: { x: 0, y: 0 },
        connectedAt: new Date(Date.now() - 600000).toISOString()
      }
    ]);

    // Simulate active projects
    setActiveProjects([
      {
        id: 'project_todo_app',
        name: 'Modern Todo App',
        collaborators: 3,
        buildStatus: 'building',
        lastActivity: new Date(Date.now() - 30000).toISOString()
      },
      {
        id: 'project_ecommerce',
        name: 'E-commerce Platform',
        collaborators: 2,
        buildStatus: 'completed',
        lastActivity: new Date(Date.now() - 120000).toISOString()
      },
      {
        id: 'project_blog',
        name: 'Blog Platform',
        collaborators: 1,
        buildStatus: 'idle',
        lastActivity: new Date(Date.now() - 300000).toISOString()
      }
    ]);

    // Simulate conflicts
    setActiveConflicts([
      {
        id: 'conflict_1',
        type: 'text_edit',
        users: ['user_alice', 'user_bob'],
        field: 'description',
        timestamp: new Date(Date.now() - 45000).toISOString()
      }
    ]);
  };

  const updateRealTimeData = () => {
    // Simulate real-time updates
    setActiveUsers(prev => prev.map(user => ({
      ...user,
      cursor: {
        x: Math.max(0, user.cursor.x + (Math.random() - 0.5) * 20),
        y: Math.max(0, user.cursor.y + (Math.random() - 0.5) * 20)
      }
    })));

    // Randomly update project build status
    if (Math.random() > 0.8) {
      setActiveProjects(prev => prev.map(project => {
        if (project.buildStatus === 'building' && Math.random() > 0.7) {
          return { ...project, buildStatus: 'completed' };
        }
        return project;
      }));
    }
  };

  const connectToServer = async () => {
    setConnectionStatus('connecting');
    await new Promise(resolve => setTimeout(resolve, 1500));
    setIsConnected(true);
    setConnectionStatus('connected');
  };

  const disconnectFromServer = () => {
    setIsConnected(false);
    setConnectionStatus('disconnected');
    setActiveUsers([]);
    setActiveProjects([]);
    setActiveConflicts([]);
  };

  const joinProject = (projectId: string) => {
    console.log(`Joining project: ${projectId}`);
    // In real implementation, this would send WebSocket message
  };

  const resolveConflict = (conflictId: string, resolution: string) => {
    console.log(`Resolving conflict ${conflictId} with: ${resolution}`);
    setActiveConflicts(prev => prev.filter(c => c.id !== conflictId));
  };

  const changeRole = (userId: string, newRole: string) => {
    console.log(`Changing role for ${userId} to: ${newRole}`);
    setActiveUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, role: newRole } : user
    ));
  };

  const getPresenceColor = (presence: string) => {
    switch (presence) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'busy': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'text-purple-600';
      case 'collaborator': return 'text-blue-600';
      case 'viewer': return 'text-gray-600';
      default: return 'text-gray-600';
    }
  };

  const getBuildStatusColor = (status: string) => {
    switch (status) {
      case 'building': return 'text-yellow-600';
      case 'completed': return 'text-green-600';
      case 'failed': return 'text-red-600';
      default: return 'text-gray-600';
    }
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
              Flerbruker Samarbeid
            </div>
            <h1 className="nordic-h1" style={{marginBottom: 'var(--space-md)'}}>
              Live Koordinering
            </h1>
            <p className="nordic-body-large">
              Sanntids samarbeid mellom flere brukere med intelligent 
              konfliktløsning og rolle-basert tilgangskonroll.
            </p>
          </div>
          <div className="flex flex-col gap-4">
            {/* Connection Control */}
            <div className="nordic-card p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className={`w-3 h-3 rounded-full ${
                    connectionStatus === 'connected' ? 'bg-green-500' :
                    connectionStatus === 'connecting' ? 'bg-yellow-500 animate-pulse' :
                    'bg-red-500'
                  }`}></div>
                  <span className="text-sm font-medium">
                    {connectionStatus === 'connected' ? 'Tilkoblet' :
                     connectionStatus === 'connecting' ? 'Kobler til...' :
                     'Frakoblet'}
                  </span>
                </div>
                {isConnected ? (
                  <button
                    onClick={disconnectFromServer}
                    className="text-sm px-3 py-1 rounded bg-red-100 text-red-700 hover:bg-red-200"
                  >
                    <HiStop className="w-4 h-4 inline mr-1" />
                    Koble fra
                  </button>
                ) : (
                  <button
                    onClick={connectToServer}
                    className="text-sm px-3 py-1 rounded bg-green-100 text-green-700 hover:bg-green-200"
                  >
                    <HiPlay className="w-4 h-4 inline mr-1" />
                    Koble til
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {!isConnected ? (
          <div className="text-center py-16">
            <HiGlobeAlt className="w-16 h-16 mx-auto mb-4" style={{color: 'var(--text-muted)'}} />
            <h3 className="nordic-h4 mb-2">Ikke tilkoblet</h3>
            <p className="nordic-body" style={{color: 'var(--text-muted)'}}>
              Koble til flerbruker-koordinering for å samarbeide i sanntid.
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Active Users */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <HiUsers className="w-6 h-6" style={{color: 'var(--accent-primary)'}} />
                <h2 className="nordic-h3">Aktive Brukere ({activeUsers.length})</h2>
              </div>
              
              <div className="nordic-grid-3 gap-6">
                {activeUsers.map((user) => (
                  <div key={user.id} className="nordic-card">
                    <div className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center gap-3">
                          <div className="relative">
                            <div className="w-10 h-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold">
                              {user.id.split('_')[1]?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                            <div className={`absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-white ${getPresenceColor(user.presence)}`}></div>
                          </div>
                          <div>
                            <div className="font-medium">{user.id.split('_')[1] || user.id}</div>
                            <div className={`text-sm ${getRoleColor(user.role)}`}>
                              {user.role}
                            </div>
                          </div>
                        </div>
                        
                        {currentUser?.role === 'admin' && user.id !== currentUser.id && (
                          <select
                            value={user.role}
                            onChange={(e) => changeRole(user.id, e.target.value)}
                            className="text-xs border rounded px-2 py-1"
                          >
                            <option value="viewer">Viewer</option>
                            <option value="collaborator">Collaborator</option>
                            <option value="admin">Admin</option>
                          </select>
                        )}
                      </div>

                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span style={{color: 'var(--text-muted)'}}>Status:</span>
                          <span className="capitalize">{user.presence}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span style={{color: 'var(--text-muted)'}}>Prosjekt:</span>
                          <span>{user.currentProject ? 'Aktiv' : 'Ledig'}</span>
                        </div>
                        
                        <div className="flex justify-between">
                          <span style={{color: 'var(--text-muted)'}}>Tilkoblet:</span>
                          <span>{formatTimeAgo(user.connectedAt)}</span>
                        </div>

                        {user.currentProject && (
                          <div className="flex justify-between">
                            <span style={{color: 'var(--text-muted)'}}>Cursor:</span>
                            <span className="font-mono text-xs">
                              ({Math.round(user.cursor.x)}, {Math.round(user.cursor.y)})
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Projects */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <HiCursorArrowRays className="w-6 h-6" style={{color: 'var(--accent-secondary)'}} />
                <h2 className="nordic-h3">Aktive Prosjekter ({activeProjects.length})</h2>
              </div>
              
              <div className="space-y-4">
                {activeProjects.map((project) => (
                  <div key={project.id} className="nordic-card">
                    <div className="p-6">
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-4 mb-2">
                            <h3 className="font-semibold">{project.name}</h3>
                            <div className="flex items-center gap-2">
                              <HiUsers className="w-4 h-4" style={{color: 'var(--text-muted)'}} />
                              <span className="text-sm">{project.collaborators}</span>
                            </div>
                          </div>
                          
                          <div className="flex gap-6 text-sm">
                            <div>
                              <span style={{color: 'var(--text-muted)'}}>Status: </span>
                              <span className={`font-medium ${getBuildStatusColor(project.buildStatus)}`}>
                                {project.buildStatus}
                              </span>
                            </div>
                            <div>
                              <span style={{color: 'var(--text-muted)'}}>Sist aktivt: </span>
                              <span>{formatTimeAgo(project.lastActivity)}</span>
                            </div>
                          </div>
                        </div>

                        <button
                          onClick={() => joinProject(project.id)}
                          className="nordic-button text-sm px-4 py-2"
                        >
                          Bli med
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Active Conflicts */}
            {activeConflicts.length > 0 && (
              <div>
                <div className="flex items-center gap-3 mb-6">
                  <HiExclamationTriangle className="w-6 h-6 text-yellow-600" />
                  <h2 className="nordic-h3">Aktive Konflikter ({activeConflicts.length})</h2>
                </div>
                
                <div className="space-y-4">
                  {activeConflicts.map((conflict) => (
                    <div key={conflict.id} className="nordic-card border-l-4 border-yellow-500">
                      <div className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <HiExclamationTriangle className="w-5 h-5 text-yellow-600" />
                              <h3 className="font-semibold">Tekstendring konflikt</h3>
                            </div>
                            
                            <div className="text-sm space-y-1">
                              <div>
                                <span style={{color: 'var(--text-muted)'}}>Felt: </span>
                                <code className="bg-gray-100 px-2 py-1 rounded">{conflict.field}</code>
                              </div>
                              <div>
                                <span style={{color: 'var(--text-muted)'}}>Involverte brukere: </span>
                                <span>{conflict.users.join(', ')}</span>
                              </div>
                              <div>
                                <span style={{color: 'var(--text-muted)'}}>Tidspunkt: </span>
                                <span>{formatTimeAgo(conflict.timestamp)}</span>
                              </div>
                            </div>
                          </div>

                          <div className="flex gap-2">
                            <button
                              onClick={() => resolveConflict(conflict.id, 'accept_mine')}
                              className="text-sm px-3 py-1 rounded bg-green-100 text-green-700 hover:bg-green-200"
                            >
                              Aksepter mine
                            </button>
                            <button
                              onClick={() => resolveConflict(conflict.id, 'accept_theirs')}
                              className="text-sm px-3 py-1 rounded bg-blue-100 text-blue-700 hover:bg-blue-200"
                            >
                              Aksepter deres
                            </button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Live Cursor Visualization */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <HiEye className="w-6 h-6" style={{color: 'var(--accent-tertiary)'}} />
                <h2 className="nordic-h3">Live Cursor Tracking</h2>
              </div>
              
              <div className="nordic-card relative" style={{ minHeight: '200px' }}>
                <div className="absolute inset-0 p-4">
                  <div className="text-sm mb-4" style={{color: 'var(--text-muted)'}}>
                    Sanntids musebevegelser fra aktive samarbeidspartnere:
                  </div>
                  
                  {activeUsers
                    .filter(user => user.currentProject)
                    .map((user, index) => (
                      <div
                        key={user.id}
                        className="absolute transition-all duration-1000 ease-out"
                        style={{
                          left: `${Math.min(user.cursor.x, 300)}px`,
                          top: `${Math.min(user.cursor.y, 100)}px`,
                          zIndex: 10 + index
                        }}
                      >
                        <div className="flex items-center gap-2">
                          <HiCursorArrowRays 
                            className="w-4 h-4 transform rotate-12"
                            style={{
                              color: index === 0 ? '#3B82F6' : 
                                     index === 1 ? '#EF4444' : 
                                     '#10B981'
                            }}
                          />
                          <span className="text-xs px-2 py-1 rounded bg-black text-white">
                            {user.id.split('_')[1]}
                          </span>
                        </div>
                      </div>
                    ))}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default MultiUserInterface;