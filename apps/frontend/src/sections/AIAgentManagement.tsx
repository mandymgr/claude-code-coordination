import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Progress } from '../components/ui/progress';
import { 
  Bot, 
  Brain, 
  Cpu, 
  Zap, 
  Target, 
  Activity, 
  Settings,
  TrendingUp
} from 'lucide-react';
import { apiService, mockData, safeApiCall, AIAgent, CoordinationSession } from '../services/api';

interface AIAgentManagementProps {
  isDarkTheme?: boolean;
}

interface AgentTask {
  id: string;
  title: string;
  status: 'pending' | 'in_progress' | 'completed' | 'failed';
  assignedAt: string;
  completedAt?: string;
  complexity: 'low' | 'medium' | 'high';
  estimatedTime: number;
}

interface AgentPerformance {
  agentId: string;
  tasksCompleted: number;
  averageTime: number;
  successRate: number;
  tokensUsed: number;
  specializations: string[];
}

const AIAgentManagement: React.FC<AIAgentManagementProps> = () => {
  const [agents, setAgents] = useState<AIAgent[]>([]);
  const [selectedAgent, setSelectedAgent] = useState<AIAgent | null>(null);
  const [agentTasks, setAgentTasks] = useState<AgentTask[]>([]);
  const [performance, setPerformance] = useState<Record<string, AgentPerformance>>({});
  const [loading, setLoading] = useState(true);
  const [activeTab] = useState('overview');

  useEffect(() => {
    loadAgentData();
    const interval = setInterval(loadAgentData, 10000); // Update every 10 seconds
    return () => clearInterval(interval);
  }, []);

  const loadAgentData = async () => {
    try {
      const [agentsData, , performanceData] = await Promise.all([
        safeApiCall(() => apiService.getAgents(), mockData.agents, 'AI Agents'),
        safeApiCall(() => apiService.getSessions(), mockData.sessions, 'Agent Sessions'),
        safeApiCall(() => apiService.getAgentPerformance(), generateMockPerformance(), 'Agent Performance')
      ]);

      setAgents(agentsData);
      setPerformance(performanceData);
      
      if (!selectedAgent && agentsData.length > 0) {
        setSelectedAgent(agentsData[0]);
      }
    } catch (error) {
      console.error('Failed to load agent data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockPerformance = () => {
    const perf: Record<string, AgentPerformance> = {};
    mockData.agents.forEach(agent => {
      perf[agent.id] = {
        agentId: agent.id,
        tasksCompleted: Math.floor(Math.random() * 50) + 10,
        averageTime: Math.floor(Math.random() * 3000) + 500,
        successRate: Math.floor(Math.random() * 20) + 80,
        tokensUsed: Math.floor(Math.random() * 50000) + 10000,
        specializations: agent.capabilities
      };
    });
    return perf;
  };

  const getAgentStatusColor = (status: string) => {
    switch (status) {
      case 'active': return 'bg-green-500';
      case 'busy': return 'bg-yellow-500';
      case 'idle': return 'bg-gray-400';
      default: return 'bg-gray-300';
    }
  };

  const getAgentTypeIcon = (type: string) => {
    switch (type) {
      case 'claude': return <Brain className="w-5 h-5" />;
      case 'gpt4': return <Cpu className="w-5 h-5" />;
      case 'gemini': return <Zap className="w-5 h-5" />;
      default: return <Bot className="w-5 h-5" />;
    }
  };

  const assignTask = async (agentId: string) => {
    const taskTitle = prompt('Enter task description:');
    if (!taskTitle) return;

    try {
      await safeApiCall(
        () => apiService.assignTask(agentId, taskTitle),
        { success: true }
      );
      
      // Add optimistic update
      const newTask: AgentTask = {
        id: `task-${Date.now()}`,
        title: taskTitle,
        status: 'pending',
        assignedAt: new Date().toISOString(),
        complexity: 'medium',
        estimatedTime: 30
      };
      setAgentTasks(prev => [newTask, ...prev]);
      
      // Update agent status to busy
      setAgents(prev => prev.map(a => 
        a.id === agentId ? { ...a, status: 'busy' as const } : a
      ));
      
    } catch (error) {
      console.error('Failed to assign task:', error);
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-64"></div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-40"></div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
            AI Agent Management
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Monitor and manage your AI coordination team
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="default" className="flex items-center space-x-2">
            <Activity className="w-4 h-4" />
            <span>{agents.filter(a => a.status === 'active').length} Active</span>
          </Badge>
          <Button variant="outline" onClick={loadAgentData}>
            Refresh
          </Button>
        </div>
      </div>

      {/* Agent Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {agents.map(agent => (
          <div 
            key={agent.id}
            className={`cursor-pointer transition-all duration-200 ${
              selectedAgent?.id === agent.id ? 'ring-2 ring-blue-500' : 'hover:shadow-md'
            }`}
            onClick={() => setSelectedAgent(agent)}
          >
            <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  {getAgentTypeIcon(agent.type)}
                  <div>
                    <h3 className="font-semibold text-gray-900 dark:text-white">
                      {agent.name}
                    </h3>
                    <p className="text-sm text-gray-600 dark:text-gray-400 capitalize">
                      {agent.type} Model
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-2">
                  <div className={`w-3 h-3 rounded-full ${getAgentStatusColor(agent.status)}`} />
                  <Badge 
                    variant={agent.status === 'active' ? 'default' : 'default'}
                    className="capitalize"
                  >
                    {agent.status}
                  </Badge>
                </div>
              </div>

              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Tasks Completed</span>
                  <span className="font-medium">{performance[agent.id]?.tasksCompleted || 0}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-600 dark:text-gray-400">Success Rate</span>
                  <span className="font-medium">{performance[agent.id]?.successRate || 0}%</span>
                </div>
                <Progress value={performance[agent.id]?.successRate || 0} className="h-2" />
              </div>

              <div className="mt-4 flex flex-wrap gap-1">
                {agent.capabilities.slice(0, 3).map(capability => (
                  <Badge key={capability} variant="default" className="text-xs">
                    {capability}
                  </Badge>
                ))}
                {agent.capabilities.length > 3 && (
                  <Badge variant="default" className="text-xs">
                    +{agent.capabilities.length - 3}
                  </Badge>
                )}
              </div>

              <div className="mt-4 flex space-x-2">
                <Button 
                  size="sm" 
                  onClick={() => assignTask(agent.id)}
                  disabled={agent.status === 'busy'}
                >
                  <Target className="w-4 h-4 mr-1" />
                  Assign Task
                </Button>
              </div>
            </CardContent>
          </Card>
          </div>
        ))}
      </div>

      {/* Detailed Agent View */}
      {selectedAgent && (
        <Tabs defaultValue={activeTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="tasks">Active Tasks</TabsTrigger>
            <TabsTrigger value="performance">Performance</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    {getAgentTypeIcon(selectedAgent.type)}
                    <span>{selectedAgent.name} Details</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Status:</span>
                      <Badge className={`ml-2 capitalize ${
                        selectedAgent.status === 'active' ? 'bg-green-500' : 
                        selectedAgent.status === 'busy' ? 'bg-yellow-500' : 'bg-gray-500'
                      }`}>
                        {selectedAgent.status}
                      </Badge>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Type:</span>
                      <span className="ml-2 font-medium capitalize">{selectedAgent.type}</span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Tasks Today:</span>
                      <span className="ml-2 font-medium">{performance[selectedAgent.id]?.tasksCompleted || 0}</span>
                    </div>
                    <div>
                      <span className="text-gray-600 dark:text-gray-400">Avg Response:</span>
                      <span className="ml-2 font-medium">{performance[selectedAgent.id]?.averageTime || 0}ms</span>
                    </div>
                  </div>
                  
                  <div>
                    <h4 className="font-medium mb-2">Capabilities</h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedAgent.capabilities.map(capability => (
                        <Badge key={capability} variant="default">
                          {capability}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <TrendingUp className="w-5 h-5" />
                    <span>Performance Metrics</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Success Rate</span>
                        <span>{performance[selectedAgent.id]?.successRate || 0}%</span>
                      </div>
                      <Progress value={performance[selectedAgent.id]?.successRate || 0} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Token Efficiency</span>
                        <span>87%</span>
                      </div>
                      <Progress value={87} />
                    </div>
                    <div>
                      <div className="flex justify-between text-sm mb-1">
                        <span>Response Speed</span>
                        <span>92%</span>
                      </div>
                      <Progress value={92} />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="tasks" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Active Tasks</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {agentTasks.length === 0 ? (
                    <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                      No active tasks. Assign a task to get started.
                    </p>
                  ) : (
                    agentTasks.map(task => (
                      <div key={task.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                        <div>
                          <h4 className="font-medium">{task.title}</h4>
                          <div className="flex items-center space-x-4 text-sm text-gray-600 dark:text-gray-400 mt-1">
                            <span>Status: {task.status}</span>
                            <span>•</span>
                            <span>Complexity: {task.complexity}</span>
                            <span>•</span>
                            <span>Est: {task.estimatedTime}min</span>
                          </div>
                        </div>
                        <Badge 
                          variant={task.status === 'completed' ? 'default' : 'default'}
                          className="capitalize"
                        >
                          {task.status}
                        </Badge>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="performance" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Token Usage</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600 mb-2">
                    {(performance[selectedAgent.id]?.tokensUsed || 0).toLocaleString()}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">Tokens used today</p>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Average Response Time</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    {performance[selectedAgent.id]?.averageTime || 0}ms
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">Avg response time</p>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="w-5 h-5" />
                  <span>Agent Configuration</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Auto-assign tasks</span>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
                <div className="flex items-center justify-between">
                  <span>Max concurrent tasks</span>
                  <Button variant="outline" size="sm">3</Button>
                </div>
                <div className="flex items-center justify-between">
                  <span>Priority level</span>
                  <Button variant="outline" size="sm">High</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default AIAgentManagement;