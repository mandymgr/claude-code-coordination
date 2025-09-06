import React, { useState, useEffect, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { 
  Users, 
  MessageCircle, 
  Video, 
  Code, 
  GitMerge, 
  Clock, 
  UserCheck, 
  UserX, 
  Settings,
  Plus,
  Share,
  Eye,
  Edit,
  MessageSquare,
  Activity
} from 'lucide-react';
import { apiService, safeApiCall, mockData } from '../services/api';

interface CollaborationUser {
  id: string;
  username: string;
  email: string;
  status: 'online' | 'away' | 'busy' | 'offline';
  current_project?: string;
  avatar_url?: string;
}

interface CollaborationSession {
  id: string;
  project_id: string;
  session_name: string;
  session_type: 'coding' | 'review' | 'planning' | 'meeting';
  creator_id: string;
  participants: CollaborationUser[];
  created_at: string;
  is_active: boolean;
}

interface CollaborationStats {
  sessions: {
    total_sessions: number;
    active_sessions: number;
    avg_session_duration_minutes: number;
    most_popular_session_type: string;
  };
  users: {
    total_collaborative_users: number;
    currently_online: number;
    avg_concurrent_users: number;
  };
  activity: {
    total_messages: number;
    code_edits: number;
    code_reviews: number;
    chat_messages: number;
  };
}

interface WebSocketMessage {
  type: string;
  data: any;
}

const CollaborationDashboard: React.FC = () => {
  const [onlineUsers, setOnlineUsers] = useState<CollaborationUser[]>([]);
  const [activeSessions, setActiveSessions] = useState<CollaborationSession[]>([]);
  const [collaborationStats, setCollaborationStats] = useState<CollaborationStats | null>(null);
  const [wsConnectionInfo, setWsConnectionInfo] = useState<any>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // WebSocket and session management
  const wsRef = useRef<WebSocket | null>(null);
  const [messages, setMessages] = useState<any[]>([]);
  const [selectedSession, setSelectedSession] = useState<string | null>(null);
  
  // Forms
  const [showCreateSession, setShowCreateSession] = useState(false);
  const [newSessionData, setNewSessionData] = useState({
    session_name: '',
    session_type: 'coding' as const,
    project_id: ''
  });

  useEffect(() => {
    loadDashboardData();
    setupWebSocketConnection();

    return () => {
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, []);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Use mock collaboration data for now since backend isn't running
      const collaborationMockData = {
        users: mockData.agents.filter(a => a.status === 'active').map(agent => ({
          id: agent.id,
          username: agent.name.replace(/🤖|⚡|🎨|🔧|🧪/g, '').trim(),
          email: `${agent.id}@claude-coordination.ai`,
          status: 'online' as const,
          current_project: 'claude-code-coordination',
          avatar_url: undefined
        })),
        sessions: mockData.sessions.map(session => ({
          id: session.id,
          project_id: 'claude-code-coordination',
          session_name: session.description,
          session_type: 'coding' as const,
          creator_id: typeof session.agents[0] === 'string' ? session.agents[0] : session.agents[0]?.id || 'krin',
          participants: [],
          created_at: session.startTime,
          is_active: session.status === 'active'
        })),
        stats: {
          sessions: {
            total_sessions: mockData.sessions.length,
            active_sessions: mockData.sessions.filter(s => s.status === 'active').length,
            avg_session_duration_minutes: 45,
            most_popular_session_type: 'coding'
          },
          users: {
            total_collaborative_users: mockData.agents.length,
            currently_online: mockData.agents.filter(a => a.status === 'active').length,
            avg_concurrent_users: 3
          },
          activity: {
            total_messages: 1250,
            code_edits: 890,
            code_reviews: 145,
            chat_messages: 215
          }
        },
        wsInfo: {
          websocket_url: 'ws://localhost:3001/collaboration',
          token: 'mock-token-123',
          available: false
        }
      };

      setOnlineUsers(collaborationMockData.users);
      setActiveSessions(collaborationMockData.sessions);
      setCollaborationStats(collaborationMockData.stats);
      setWsConnectionInfo(collaborationMockData.wsInfo);

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load collaboration data');
      console.error('Collaboration dashboard error:', err);
    } finally {
      setLoading(false);
    }
  };

  const setupWebSocketConnection = async () => {
    if (!wsConnectionInfo?.websocket_url || !wsConnectionInfo?.token) {
      // Will be set up after loadDashboardData completes
      return;
    }

    try {
      const wsUrl = `${wsConnectionInfo.websocket_url}?token=${wsConnectionInfo.token}`;
      const ws = new WebSocket(wsUrl);

      ws.onopen = () => {
        console.log('Connected to collaboration WebSocket');
        setIsConnected(true);
      };

      ws.onmessage = (event) => {
        try {
          const message: WebSocketMessage = JSON.parse(event.data);
          handleWebSocketMessage(message);
        } catch (error) {
          console.error('Error parsing WebSocket message:', error);
        }
      };

      ws.onclose = (event) => {
        // Only log close events in development mode - expected when backend offline
        if (process.env.NODE_ENV === 'development' && event.code !== 1006) {
          console.debug(`[WebSocket] Collaboration connection closed: ${event.code}`);
        }
        setIsConnected(false);
        
        // Don't attempt reconnection if WebSocket info indicates service is unavailable
        if (wsConnectionInfo?.available !== false) {
          // Attempt reconnection after 5 seconds
          setTimeout(() => {
            if (!wsRef.current || wsRef.current.readyState === WebSocket.CLOSED) {
              setupWebSocketConnection();
            }
          }, 5000);
        }
      };

      ws.onerror = (error) => {
        // WebSocket errors are expected when backend is offline - suppress logging
        setIsConnected(false);
      };

      wsRef.current = ws;

    } catch (error) {
      console.error('Failed to setup WebSocket connection:', error);
      setIsConnected(false);
    }
  };

  // Set up WebSocket connection once we have the connection info
  useEffect(() => {
    if (wsConnectionInfo && !isConnected) {
      setupWebSocketConnection();
    }
  }, [wsConnectionInfo]);

  const handleWebSocketMessage = (message: WebSocketMessage) => {
    switch (message.type) {
      case 'connection_established':
        setOnlineUsers(message.data.connected_users || []);
        setActiveSessions(message.data.active_sessions || []);
        break;

      case 'user_status_update':
        setOnlineUsers(prev => {
          const updated = prev.map(user => 
            user.id === message.data.user_id 
              ? { ...user, status: message.data.status, current_project: message.data.current_project }
              : user
          );
          
          // Add new user if not exists
          if (!updated.find(u => u.id === message.data.user_id)) {
            updated.push({
              id: message.data.user_id,
              username: message.data.username,
              email: '',
              status: message.data.status,
              current_project: message.data.current_project
            });
          }
          
          return updated;
        });
        break;

      case 'session_created':
      case 'session_updated':
        setActiveSessions(prev => {
          const existing = prev.find(s => s.id === message.data.id);
          if (existing) {
            return prev.map(s => s.id === message.data.id ? message.data : s);
          } else {
            return [...prev, message.data];
          }
        });
        break;

      case 'user_joined':
      case 'user_left':
        setActiveSessions(prev => prev.map(session => 
          session.id === message.data.session_id 
            ? { ...session, participants: message.data.participants || session.participants }
            : session
        ));
        break;

      case 'chat_message':
      case 'code_edit':
      case 'code_review':
        setMessages(prev => [...prev, message.data]);
        break;

      case 'error':
        console.error('WebSocket error:', message.data);
        break;

      default:
        console.log('Unknown WebSocket message:', message);
    }
  };

  const sendWebSocketMessage = (type: string, payload: any) => {
    if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify({ type, payload }));
    } else {
      console.warn('WebSocket not connected');
    }
  };

  const createSession = async () => {
    try {
      if (!newSessionData.session_name.trim()) {
        alert('Session name is required');
        return;
      }

      await safeApiCall(
        () => apiService.post('/api/collaboration/sessions', {
          ...newSessionData,
          project_id: newSessionData.project_id || 'default-project'
        }),
        { 
          id: `session_${Date.now()}`,
          session_name: newSessionData.session_name,
          session_type: newSessionData.session_type,
          is_active: true,
          created_at: new Date().toISOString()
        }, // Mock response
        'Create Session'
      );

      // Reset form
      setNewSessionData({
        session_name: '',
        session_type: 'coding',
        project_id: ''
      });
      setShowCreateSession(false);

      // Refresh sessions
      const sessions = await safeApiCall(() => Promise.resolve([]), []);
      setActiveSessions(sessions);

    } catch (error) {
      console.error('Failed to create session:', error);
      alert('Failed to create session');
    }
  };

  const joinSession = async (sessionId: string) => {
    try {
      await safeApiCall(
        () => apiService.post(`/api/collaboration/sessions/${sessionId}/join`), 
        { success: true }, // Mock response
        'Join Session'
      );
      setSelectedSession(sessionId);
    } catch (error) {
      console.error('Failed to join session:', error);
      alert('Failed to join session');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'online': return 'bg-green-500';
      case 'away': return 'bg-yellow-500';
      case 'busy': return 'bg-red-500';
      default: return 'bg-gray-500';
    }
  };

  const getSessionTypeIcon = (type: string) => {
    switch (type) {
      case 'coding': return <Code className="w-4 h-4" />;
      case 'review': return <GitMerge className="w-4 h-4" />;
      case 'planning': return <Settings className="w-4 h-4" />;
      case 'meeting': return <Video className="w-4 h-4" />;
      default: return <Activity className="w-4 h-4" />;
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-32"></div>
            ))}
          </div>
          <div className="bg-gray-200 rounded-lg h-96"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <Card className="border-red-200">
          <CardContent className="pt-6">
            <div className="text-red-600">
              <p>Error loading collaboration dashboard: {error}</p>
            </div>
            <Button onClick={loadDashboardData} className="mt-4">
              Retry
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-8 space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Team Collaboration</h1>
          <div className="flex items-center mt-1">
            <p className="text-gray-600">Real-time collaboration and communication</p>
            <div className="ml-4 flex items-center">
              <div className={`w-2 h-2 rounded-full mr-2 ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              <span className="text-sm text-gray-500">
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>
        </div>
        <Button onClick={() => setShowCreateSession(true)} className="flex items-center">
          <Plus className="w-4 h-4 mr-2" />
          New Session
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Online Users</p>
                <p className="text-2xl font-bold text-gray-900">{onlineUsers.length}</p>
              </div>
              <Users className="h-8 w-8 text-blue-500" />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {collaborationStats?.users.avg_concurrent_users.toFixed(1)} avg concurrent
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Sessions</p>
                <p className="text-2xl font-bold text-gray-900">
                  {collaborationStats?.sessions.active_sessions || 0}
                </p>
              </div>
              <Activity className="h-8 w-8 text-green-500" />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {collaborationStats?.sessions.avg_session_duration_minutes.toFixed(0)}min avg duration
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Messages Today</p>
                <p className="text-2xl font-bold text-gray-900">
                  {collaborationStats?.activity.total_messages || 0}
                </p>
              </div>
              <MessageCircle className="h-8 w-8 text-purple-500" />
            </div>
            <p className="text-xs text-gray-500 mt-2">
              {collaborationStats?.activity.code_reviews} code reviews
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Code Edits</p>
                <p className="text-2xl font-bold text-gray-900">
                  {collaborationStats?.activity.code_edits || 0}
                </p>
              </div>
              <Code className="h-8 w-8 text-orange-500" />
            </div>
            <p className="text-xs text-gray-500 mt-2">Real-time collaborative editing</p>
          </CardContent>
        </Card>
      </div>

      {/* Main Content */}
      <Tabs defaultValue="sessions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sessions">Active Sessions</TabsTrigger>
          <TabsTrigger value="users">Online Users</TabsTrigger>
          <TabsTrigger value="activity">Recent Activity</TabsTrigger>
        </TabsList>

        <TabsContent value="sessions" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {activeSessions.map((session) => (
              <Card key={session.id}>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle className="flex items-center">
                      {getSessionTypeIcon(session.session_type)}
                      <span className="ml-2">{session.session_name}</span>
                    </CardTitle>
                    <Badge variant={session.is_active ? 'success' : 'default'}>
                      {session.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Type:</span>
                      <span className="capitalize">{session.session_type}</span>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">Participants:</span>
                      <span>{session.participants.length}</span>
                    </div>
                    
                    <div className="flex -space-x-2">
                      {session.participants.slice(0, 4).map((participant) => (
                        <div
                          key={participant.id}
                          className="relative w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs font-medium border-2 border-white"
                          title={participant.username}
                        >
                          {participant.username.charAt(0).toUpperCase()}
                        </div>
                      ))}
                      {session.participants.length > 4 && (
                        <div className="relative w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center text-white text-xs font-medium border-2 border-white">
                          +{session.participants.length - 4}
                        </div>
                      )}
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        size="sm" 
                        onClick={() => joinSession(session.id)}
                        className="flex-1"
                      >
                        <UserCheck className="w-4 h-4 mr-1" />
                        Join
                      </Button>
                      <Button size="sm" variant="outline" className="flex items-center">
                        <Eye className="w-4 h-4" />
                      </Button>
                      <Button size="sm" variant="outline" className="flex items-center">
                        <Share className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {activeSessions.length === 0 && (
              <div className="col-span-2 text-center py-12 text-gray-500">
                <Activity className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No active collaboration sessions</p>
                <p className="text-sm">Create a new session to start collaborating</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="users" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {onlineUsers.map((user) => (
              <Card key={user.id}>
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <div className="relative">
                      <div className="w-10 h-10 bg-blue-500 rounded-full flex items-center justify-center text-white font-medium">
                        {user.username.charAt(0).toUpperCase()}
                      </div>
                      <div className={`absolute -bottom-1 -right-1 w-4 h-4 ${getStatusColor(user.status)} rounded-full border-2 border-white`}></div>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">
                        {user.username}
                      </p>
                      <p className="text-xs text-gray-500 truncate">
                        {user.current_project || 'No project'}
                      </p>
                      <Badge 
                        variant={user.status === 'online' ? 'success' : 'default'}
                        className="text-xs"
                      >
                        {user.status}
                      </Badge>
                    </div>
                  </div>
                  <div className="mt-3 flex space-x-2">
                    <Button size="sm" variant="outline" className="flex-1 text-xs">
                      <MessageSquare className="w-3 h-3 mr-1" />
                      Chat
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1 text-xs">
                      <Share className="w-3 h-3 mr-1" />
                      Invite
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
            
            {onlineUsers.length === 0 && (
              <div className="col-span-3 text-center py-12 text-gray-500">
                <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No users currently online</p>
              </div>
            )}
          </div>
        </TabsContent>

        <TabsContent value="activity" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Recent Activity</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {messages.slice(-10).map((message, index) => (
                  <div key={index} className="flex items-start space-x-3 p-3 bg-gray-50 rounded-lg">
                    <div className="flex-shrink-0">
                      {message.message_type === 'chat' && <MessageCircle className="w-4 h-4 text-blue-500" />}
                      {message.message_type === 'code_edit' && <Edit className="w-4 h-4 text-green-500" />}
                      {message.message_type === 'code_review' && <GitMerge className="w-4 h-4 text-purple-500" />}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900">
                        {message.message_type === 'chat' && 'New message'}
                        {message.message_type === 'code_edit' && 'Code edited'}
                        {message.message_type === 'code_review' && 'Code review'}
                      </p>
                      <p className="text-xs text-gray-500">
                        {new Date(message.timestamp).toLocaleTimeString()}
                      </p>
                    </div>
                  </div>
                ))}
                
                {messages.length === 0 && (
                  <div className="text-center py-8 text-gray-500">
                    <Clock className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p>No recent activity</p>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create Session Modal */}
      {showCreateSession && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <Card className="w-full max-w-md mx-4">
            <CardHeader>
              <CardTitle>Create New Session</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Session Name
                </label>
                <input
                  type="text"
                  value={newSessionData.session_name}
                  onChange={(e) => setNewSessionData(prev => ({ ...prev, session_name: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter session name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Session Type
                </label>
                <select
                  value={newSessionData.session_type}
                  onChange={(e) => setNewSessionData(prev => ({ ...prev, session_type: e.target.value as any }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="coding">Coding Session</option>
                  <option value="review">Code Review</option>
                  <option value="planning">Planning Meeting</option>
                  <option value="meeting">General Meeting</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Project ID (Optional)
                </label>
                <input
                  type="text"
                  value={newSessionData.project_id}
                  onChange={(e) => setNewSessionData(prev => ({ ...prev, project_id: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Enter project ID or leave empty"
                />
              </div>
              
              <div className="flex space-x-3">
                <Button onClick={createSession} className="flex-1">
                  Create Session
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setShowCreateSession(false)} 
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default CollaborationDashboard;