import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Button } from '../components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../components/ui/tabs';
import { Progress } from '../components/ui/progress';
import { 
  Shield, 
  CheckCircle, 
  XCircle, 
  Clock, 
  AlertTriangle,
  Code,
  Bug,
  Zap,
  FileText,
  GitBranch,
  Play,
  Settings,
  TrendingUp,
  Activity,
  Target,
  RefreshCw,
  Wrench
} from 'lucide-react';
import { apiService, mockData, safeApiCall, QualityGate, QualityCheck } from '../services/api';

interface QualityGatesProps {
  isDarkTheme?: boolean;
}

interface QualityRule {
  id: string;
  name: string;
  type: 'syntax' | 'security' | 'performance' | 'style' | 'test';
  severity: 'error' | 'warning' | 'info';
  description: string;
  enabled: boolean;
  autoFix: boolean;
}

interface CodeAnalysis {
  file: string;
  issues: Array<{
    line: number;
    column: number;
    rule: string;
    severity: 'error' | 'warning' | 'info';
    message: string;
    fixable: boolean;
  }>;
}

const QualityGates: React.FC<QualityGatesProps> = ({ isDarkTheme = false }) => {
  const [qualityGates, setQualityGates] = useState<QualityGate[]>([]);
  const [selectedGate, setSelectedGate] = useState<QualityGate | null>(null);
  const [analysisResults, setAnalysisResults] = useState<CodeAnalysis[]>([]);
  const [qualityRules, setQualityRules] = useState<QualityRule[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadQualityData();
    const interval = setInterval(loadQualityData, 15000); // Update every 15 seconds
    return () => clearInterval(interval);
  }, []);

  const loadQualityData = async () => {
    try {
      const [gates, rules] = await Promise.all([
        safeApiCall(() => apiService.getQualityGates(), mockData.qualityGates),
        safeApiCall(() => Promise.resolve(generateMockRules()), generateMockRules())
      ]);

      setQualityGates(gates);
      setQualityRules(rules);
      
      if (!selectedGate && gates.length > 0) {
        setSelectedGate(gates[0]);
      }
    } catch (error) {
      console.error('Failed to load quality data:', error);
    } finally {
      setLoading(false);
    }
  };

  const generateMockRules = (): QualityRule[] => [
    {
      id: 'typescript-strict',
      name: 'TypeScript Strict Mode',
      type: 'syntax',
      severity: 'error',
      description: 'Enforce strict TypeScript checking',
      enabled: true,
      autoFix: false
    },
    {
      id: 'no-console',
      name: 'No Console Statements',
      type: 'style',
      severity: 'warning',
      description: 'Remove console.log statements from production code',
      enabled: true,
      autoFix: true
    },
    {
      id: 'security-audit',
      name: 'Security Vulnerabilities',
      type: 'security',
      severity: 'error',
      description: 'Check for known security vulnerabilities',
      enabled: true,
      autoFix: false
    },
    {
      id: 'performance-bundle',
      name: 'Bundle Size Check',
      type: 'performance',
      severity: 'warning',
      description: 'Ensure bundle size stays within limits',
      enabled: true,
      autoFix: false
    },
    {
      id: 'test-coverage',
      name: 'Test Coverage',
      type: 'test',
      severity: 'warning',
      description: 'Maintain minimum test coverage threshold',
      enabled: true,
      autoFix: false
    }
  ];

  const generateMockAnalysis = (): CodeAnalysis[] => [
    {
      file: 'src/components/AIAgent.tsx',
      issues: [
        {
          line: 42,
          column: 15,
          rule: 'no-console',
          severity: 'warning',
          message: 'Unexpected console statement',
          fixable: true
        },
        {
          line: 89,
          column: 8,
          rule: 'typescript-strict',
          severity: 'error',
          message: 'Variable implicitly has an any type',
          fixable: false
        }
      ]
    },
    {
      file: 'src/services/api.ts',
      issues: [
        {
          line: 156,
          column: 22,
          rule: 'security-audit',
          severity: 'error',
          message: 'Potential XSS vulnerability in user input',
          fixable: false
        }
      ]
    }
  ];

  const runQualityGate = async (gateId: string) => {
    setIsRunning(true);
    try {
      // Simulate running quality gates
      await new Promise(resolve => setTimeout(resolve, 3000));
      
      const updatedGate = await safeApiCall(
        () => apiService.runQualityGate(gateId, ['src/**/*.tsx', 'src/**/*.ts']),
        {
          ...mockData.qualityGates[0],
          status: 'failed',
          checks: [
            { name: 'TypeScript Check', status: 'passed', message: 'No type errors found' },
            { name: 'ESLint', status: 'failed', message: '3 linting errors found', details: 'Fix console statements and unused variables' },
            { name: 'Security Audit', status: 'failed', message: '1 security issue found', details: 'Potential XSS vulnerability detected' },
            { name: 'Tests', status: 'passed', message: 'All tests passing' },
          ]
        }
      );

      setQualityGates(prev => prev.map(gate => 
        gate.id === gateId ? updatedGate : gate
      ));
      setAnalysisResults(generateMockAnalysis());
      
    } catch (error) {
      console.error('Failed to run quality gate:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const autoFixIssues = async () => {
    setIsRunning(true);
    try {
      // Simulate auto-fixing issues
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Remove fixable issues
      setAnalysisResults(prev => 
        prev.map(analysis => ({
          ...analysis,
          issues: analysis.issues.filter(issue => !issue.fixable)
        })).filter(analysis => analysis.issues.length > 0)
      );
      
      // Update gate status if all fixable issues resolved
      if (selectedGate && analysisResults.some(a => a.issues.some(i => i.fixable))) {
        const updatedGate = {
          ...selectedGate,
          checks: selectedGate.checks.map(check => 
            check.name === 'ESLint' 
              ? { ...check, status: 'passed' as const, message: 'All linting issues auto-fixed' }
              : check
          )
        };
        setSelectedGate(updatedGate);
        setQualityGates(prev => prev.map(gate => 
          gate.id === selectedGate.id ? updatedGate : gate
        ));
      }
      
    } catch (error) {
      console.error('Failed to auto-fix issues:', error);
    } finally {
      setIsRunning(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed': return 'text-green-600 bg-green-100';
      case 'failed': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'failed': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'pending': return <Clock className="w-4 h-4 text-yellow-600" />;
      default: return <AlertTriangle className="w-4 h-4 text-gray-600" />;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'error': return 'text-red-600 bg-red-100';
      case 'warning': return 'text-yellow-600 bg-yellow-100';
      case 'info': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-6">
          <div className="h-8 bg-gray-200 rounded w-64"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[...Array(2)].map((_, i) => (
              <div key={i} className="bg-gray-200 rounded-lg h-48"></div>
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
            Quality Gates
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mt-2">
            Automated code quality and security validation
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <Badge variant="default" className="flex items-center space-x-2">
            <Shield className="w-4 h-4" />
            <span>{qualityGates.filter(g => g.status === 'passed').length} Passed</span>
          </Badge>
          <Button 
            onClick={() => selectedGate && runQualityGate(selectedGate.id)}
            disabled={isRunning}
            className="flex items-center space-x-2"
          >
            {isRunning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4" />}
            <span>{isRunning ? 'Running...' : 'Run Quality Gate'}</span>
          </Button>
        </div>
      </div>

      {/* Quality Gate Overview */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {qualityGates.map(gate => (
          <div 
            key={gate.id}
            className={`cursor-pointer transition-all duration-200 ${
              selectedGate?.id === gate.id ? 'ring-2 ring-blue-500' : 'hover:shadow-md'
            }`}
            onClick={() => setSelectedGate(gate)}
          >
            <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="flex items-center space-x-2">
                <Shield className="w-5 h-5" />
                <span>{gate.name}</span>
              </CardTitle>
              <Badge variant="default" className={getStatusColor(gate.status)}>
                {getStatusIcon(gate.status)}
                <span className="ml-1 capitalize">{gate.status}</span>
              </Badge>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {gate.checks.map(check => (
                  <div key={check.name} className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      {getStatusIcon(check.status)}
                      <span className="text-sm">{check.name}</span>
                    </div>
                    <Badge 
                      variant="default" 
                      className={`text-xs ${getStatusColor(check.status)}`}
                    >
                      {check.status}
                    </Badge>
                  </div>
                ))}
                
                <div className="mt-4 pt-3 border-t">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-gray-600 dark:text-gray-400">Overall Status:</span>
                    <span className={`font-medium ${
                      gate.status === 'passed' ? 'text-green-600' : 
                      gate.status === 'failed' ? 'text-red-600' : 'text-yellow-600'
                    }`}>
                      {gate.status === 'passed' ? 'All Checks Passed' : 
                       gate.status === 'failed' ? 'Issues Found' : 'In Progress'}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
            </Card>
          </div>
        ))}
      </div>

      {/* Detailed Quality Gate View */}
      {selectedGate && (
        <Tabs defaultValue={activeTab}>
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="issues">Issues</TabsTrigger>
            <TabsTrigger value="rules">Rules</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CheckCircle className="w-5 h-5 text-green-600" />
                    <span>Passed Checks</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-green-600">
                    {selectedGate.checks.filter(c => c.status === 'passed').length}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">out of {selectedGate.checks.length}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <XCircle className="w-5 h-5 text-red-600" />
                    <span>Failed Checks</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-red-600">
                    {selectedGate.checks.filter(c => c.status === 'failed').length}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">requiring attention</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Wrench className="w-5 h-5 text-blue-600" />
                    <span>Auto-Fixable</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">
                    {analysisResults.reduce((count, analysis) => 
                      count + analysis.issues.filter(issue => issue.fixable).length, 0
                    )}
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">issues can be auto-fixed</p>
                  {analysisResults.some(a => a.issues.some(i => i.fixable)) && (
                    <Button 
                      size="sm" 
                      className="mt-3" 
                      onClick={autoFixIssues}
                      disabled={isRunning}
                    >
                      <Wrench className="w-4 h-4 mr-1" />
                      Auto-Fix Issues
                    </Button>
                  )}
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Check Details</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {selectedGate.checks.map(check => (
                    <div key={check.name} className="p-4 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            {getStatusIcon(check.status)}
                            <h4 className="font-medium">{check.name}</h4>
                            <Badge className={getStatusColor(check.status)}>
                              {check.status}
                            </Badge>
                          </div>
                          <p className="text-gray-600 dark:text-gray-400 mb-2">{check.message}</p>
                          {check.details && (
                            <p className="text-sm text-gray-500">{check.details}</p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="issues" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bug className="w-5 h-5" />
                  <span>Code Analysis Results</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {analysisResults.length === 0 ? (
                  <p className="text-gray-600 dark:text-gray-400 text-center py-8">
                    No issues found. Run a quality gate to see analysis results.
                  </p>
                ) : (
                  <div className="space-y-6">
                    {analysisResults.map(analysis => (
                      <div key={analysis.file}>
                        <h4 className="font-medium mb-3 flex items-center space-x-2">
                          <FileText className="w-4 h-4" />
                          <span>{analysis.file}</span>
                          <Badge variant="default">{analysis.issues.length} issues</Badge>
                        </h4>
                        <div className="space-y-2 ml-6">
                          {analysis.issues.map((issue, index) => (
                            <div key={index} className="p-3 bg-gray-50 dark:bg-gray-800 rounded">
                              <div className="flex items-start justify-between">
                                <div className="flex-1">
                                  <div className="flex items-center space-x-2 mb-1">
                                    <Badge className={getSeverityColor(issue.severity)}>
                                      {issue.severity}
                                    </Badge>
                                    <span className="text-sm font-medium">{issue.rule}</span>
                                    {issue.fixable && (
                                      <Badge variant="default" className="text-xs">
                                        <Wrench className="w-3 h-3 mr-1" />
                                        fixable
                                      </Badge>
                                    )}
                                  </div>
                                  <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">
                                    {issue.message}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    Line {issue.line}, Column {issue.column}
                                  </p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="rules" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Settings className="w-5 h-5" />
                  <span>Quality Rules Configuration</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {qualityRules.map(rule => (
                    <div key={rule.id} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3 mb-2">
                          <h4 className="font-medium">{rule.name}</h4>
                          <Badge className={getSeverityColor(rule.severity)}>
                            {rule.severity}
                          </Badge>
                          <Badge variant="default" className="text-xs capitalize">
                            {rule.type}
                          </Badge>
                          {rule.autoFix && (
                            <Badge variant="default" className="text-xs">
                              <Wrench className="w-3 h-3 mr-1" />
                              auto-fix
                            </Badge>
                          )}
                        </div>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {rule.description}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge variant="default">
                          {rule.enabled ? "Enabled" : "Disabled"}
                        </Badge>
                        <Button variant="outline" size="sm">
                          Configure
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle>Quality Gate Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span>Auto-run on file changes</span>
                  <Button variant="outline" size="sm">Configure</Button>
                </div>
                <div className="flex items-center justify-between">
                  <span>Fail on security issues</span>
                  <Button variant="outline" size="sm">Enabled</Button>
                </div>
                <div className="flex items-center justify-between">
                  <span>Auto-fix safe issues</span>
                  <Button variant="outline" size="sm">Enabled</Button>
                </div>
                <div className="flex items-center justify-between">
                  <span>Notification threshold</span>
                  <Button variant="outline" size="sm">Errors Only</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      )}
    </div>
  );
};

export default QualityGates;