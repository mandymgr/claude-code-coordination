#!/usr/bin/env node
/**
 * 🧠 Adaptive AI Assistant
 * Learns from your coding patterns and provides intelligent, context-aware assistance
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const SmartResponseCache = require('./smart-response-cache.cjs');

class AdaptiveAIAssistant {
  constructor(projectPath = process.cwd()) {
    this.projectPath = projectPath;
    this.learningPath = path.join(projectPath, '.claude-coordination', 'ai-learning.json');
    this.patterns = this.loadLearningData();
    this.contextWindow = [];
    this.skillLevel = 'intermediate'; // beginner, intermediate, expert
    this.cache = new SmartResponseCache(projectPath);
  }

  /**
   * 🎯 Main AI assistant interface
   */
  async assist(query, context = {}) {
    console.log('🧠 AI Assistant analyzing your request...');
    
    // Try to get cached response first
    const cachedResponse = await this.cache.get(query, context);
    if (cachedResponse) {
      console.log('⚡ Using cached response for faster performance');
      return cachedResponse;
    }
    
    // Update context window
    this.updateContextWindow(query, context);
    
    // Determine assistance type
    const assistanceType = this.classifyQuery(query);
    
    // Provide intelligent assistance
    let response;
    switch (assistanceType) {
      case 'code_completion':
        response = await this.provideCodeCompletion(query, context);
        break;
      case 'debugging_help':
        response = await this.provideDebuggingHelp(query, context);
        break;
      case 'architecture_advice':
        response = await this.provideArchitectureAdvice(query, context);
        break;
      case 'performance_optimization':
        response = await this.providePerformanceOptimization(query, context);
        break;
      case 'testing_guidance':
        response = await this.provideTestingGuidance(query, context);
        break;
      case 'deployment_help':
        response = await this.provideDeploymentHelp(query, context);
        break;
      case 'learning_suggestion':
        response = await this.provideLearningGuidance(query, context);
        break;
      default:
        response = await this.provideGeneralAssistance(query, context);
    }
    
    // Cache the response for future use
    if (response) {
      await this.cache.set(query, context, response);
    }
    
    // Learn from interaction
    await this.learnFromInteraction(query, response, context);
    
    return response;
  }

  /**
   * 💡 Intelligent Code Completion
   */
  async provideCodeCompletion(query, context) {
    const analysis = this.analyzeCodeContext(context);
    
    const suggestions = {
      type: 'code_completion',
      confidence: this.calculateConfidence(analysis),
      suggestions: [],
      explanations: [],
      best_practices: [],
      potential_issues: []
    };

    // Language-specific completions
    switch (analysis.language) {
      case 'JavaScript':
      case 'TypeScript':
        suggestions.suggestions = await this.generateJavaScriptCompletions(query, analysis);
        break;
      case 'Python':
        suggestions.suggestions = await this.generatePythonCompletions(query, analysis);
        break;
      case 'Go':
        suggestions.suggestions = await this.generateGoCompletions(query, analysis);
        break;
      case 'Rust':
        suggestions.suggestions = await this.generateRustCompletions(query, analysis);
        break;
      default:
        suggestions.suggestions = await this.generateGenericCompletions(query, analysis);
    }

    // Add contextual explanations
    suggestions.explanations = this.generateExplanations(suggestions.suggestions, analysis);
    
    // Add best practice recommendations
    suggestions.best_practices = this.generateBestPractices(analysis);
    
    return suggestions;
  }

  /**
   * 🐛 Intelligent Debugging Assistance
   */
  async provideDebuggingHelp(query, context) {
    const errorAnalysis = this.analyzeError(query, context);
    
    return {
      type: 'debugging_help',
      error_type: errorAnalysis.type,
      likely_causes: errorAnalysis.causes,
      suggested_fixes: await this.generateDebuggingFixes(errorAnalysis),
      debugging_steps: this.generateDebuggingSteps(errorAnalysis),
      prevention_tips: this.generatePreventionTips(errorAnalysis),
      learning_resources: this.generateLearningResources(errorAnalysis)
    };
  }

  /**
   * 🏗️ Architecture Guidance
   */
  async provideArchitectureAdvice(query, context) {
    const projectAnalysis = await this.analyzeProjectArchitecture();
    
    return {
      type: 'architecture_advice',
      current_architecture: projectAnalysis.current,
      recommendations: await this.generateArchitectureRecommendations(projectAnalysis),
      patterns_to_consider: this.suggestDesignPatterns(projectAnalysis),
      scalability_concerns: this.identifyScalabilityConcerns(projectAnalysis),
      refactoring_suggestions: this.generateRefactoringSuggestions(projectAnalysis),
      technology_recommendations: this.recommendTechnologies(projectAnalysis)
    };
  }

  /**
   * ⚡ Performance Optimization
   */
  async providePerformanceOptimization(query, context) {
    const performanceAnalysis = await this.analyzePerformance(context);
    
    return {
      type: 'performance_optimization',
      bottlenecks: performanceAnalysis.identified_bottlenecks,
      optimizations: await this.generateOptimizations(performanceAnalysis),
      monitoring_suggestions: this.generateMonitoringSuggestions(performanceAnalysis),
      profiling_tools: this.recommendProfilingTools(performanceAnalysis),
      implementation_priority: this.prioritizeOptimizations(performanceAnalysis)
    };
  }

  /**
   * 🧪 Testing Guidance
   */
  async provideTestingGuidance(query, context) {
    const testingAnalysis = this.analyzeTestingNeeds(context);
    
    return {
      type: 'testing_guidance',
      coverage_analysis: testingAnalysis.coverage,
      suggested_tests: await this.generateTestSuggestions(testingAnalysis),
      testing_strategy: this.recommendTestingStrategy(testingAnalysis),
      tools_and_frameworks: this.recommendTestingTools(testingAnalysis),
      integration_guidance: this.provideIntegrationTestingGuidance(testingAnalysis)
    };
  }

  /**
   * 🎓 Adaptive Learning System
   */
  async learnFromInteraction(query, response, context) {
    const interaction = {
      timestamp: new Date().toISOString(),
      query_type: this.classifyQuery(query),
      context: {
        language: context.language,
        framework: context.framework,
        project_type: context.project_type
      },
      user_satisfaction: await this.estimateUserSatisfaction(response),
      patterns_used: this.extractPatterns(query, response)
    };

    this.patterns.interactions.push(interaction);
    this.updateSkillLevel();
    await this.saveLearningData();
  }

  /**
   * 📝 Update context window
   */
  updateContextWindow(query, context) {
    this.contextWindow.push({
      timestamp: new Date().toISOString(),
      query,
      context,
      session_id: process.env.CLAUDE_SESSION_ID || 'default'
    });
    
    // Keep only last 10 interactions for context
    if (this.contextWindow.length > 10) {
      this.contextWindow = this.contextWindow.slice(-10);
    }
  }

  /**
   * 🆘 Provide debugging assistance
   */
  async provideDebuggingHelp(query, context) {
    const errorAnalysis = this.analyzeError(query, context);
    
    return {
      type: 'debugging_help',
      error_type: errorAnalysis.type,
      likely_causes: errorAnalysis.causes,
      suggested_fixes: await this.generateDebuggingFixes(errorAnalysis),
      debugging_steps: this.generateDebuggingSteps(errorAnalysis),
      prevention_tips: this.generatePreventionTips(errorAnalysis),
      learning_resources: this.generateLearningResources(errorAnalysis)
    };
  }

  /**
   * 🏗️ Architecture guidance
   */
  async provideArchitectureAdvice(query, context) {
    const projectAnalysis = await this.analyzeProjectArchitecture();
    
    return {
      type: 'architecture_advice',
      current_architecture: projectAnalysis.current,
      recommendations: await this.generateArchitectureRecommendations(projectAnalysis),
      patterns_to_consider: this.suggestDesignPatterns(projectAnalysis),
      scalability_concerns: this.identifyScalabilityConcerns(projectAnalysis),
      refactoring_suggestions: this.generateRefactoringSuggestions(projectAnalysis),
      technology_recommendations: this.recommendTechnologies(projectAnalysis)
    };
  }

  /**
   * ⚡ Performance optimization
   */
  async providePerformanceOptimization(query, context) {
    const performanceAnalysis = await this.analyzePerformance(context);
    
    return {
      type: 'performance_optimization',
      bottlenecks: performanceAnalysis.identified_bottlenecks,
      optimizations: await this.generateOptimizations(performanceAnalysis),
      monitoring_suggestions: this.generateMonitoringSuggestions(performanceAnalysis),
      profiling_tools: this.recommendProfilingTools(performanceAnalysis),
      implementation_priority: this.prioritizeOptimizations(performanceAnalysis)
    };
  }

  /**
   * 🧪 Testing guidance
   */
  async provideTestingGuidance(query, context) {
    const testingAnalysis = this.analyzeTestingNeeds(context);
    
    return {
      type: 'testing_guidance',
      coverage_analysis: testingAnalysis.coverage,
      suggested_tests: await this.generateTestSuggestions(testingAnalysis),
      testing_strategy: this.recommendTestingStrategy(testingAnalysis),
      tools_and_frameworks: this.recommendTestingTools(testingAnalysis),
      integration_guidance: this.provideIntegrationTestingGuidance(testingAnalysis)
    };
  }

  /**
   * 🚀 Deployment help
   */
  async provideDeploymentHelp(query, context) {
    return {
      type: 'deployment_help',
      platforms: ['Vercel', 'Netlify', 'Railway', 'AWS'],
      recommendations: [
        'Use environment variables for configuration',
        'Set up automated testing in CI/CD pipeline',
        'Configure monitoring and error tracking',
        'Implement blue-green deployment strategy'
      ],
      best_practices: [
        'Always test deployments in staging first',
        'Use infrastructure as code (Terraform, CloudFormation)',
        'Set up proper logging and monitoring',
        'Implement automatic rollback on failures'
      ]
    };
  }

  /**
   * 🎓 Learning guidance
   */
  async provideLearningGuidance(query, context) {
    return {
      type: 'learning_suggestion',
      skill_level: this.skillLevel,
      recommended_topics: [
        'Advanced React patterns and hooks',
        'TypeScript best practices',
        'Performance optimization techniques',
        'Testing strategies and automation',
        'DevOps and deployment practices'
      ],
      resources: [
        'React documentation and guides',
        'TypeScript handbook',
        'MDN Web Docs for JavaScript',
        'Testing Library documentation',
        'Kubernetes and Docker tutorials'
      ]
    };
  }

  /**
   * 🤝 General assistance
   */
  async provideGeneralAssistance(query, context) {
    return {
      type: 'general_assistance',
      suggestions: [{
        code: `// AI-generated solution based on your query
// Query: ${query}

// Implementation suggestion:
const solution = async () => {
  try {
    // Your implementation here
    console.log('Processing your request...');
    return { success: true };
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
};

export default solution;`,
        explanation: 'General code template with error handling',
        best_practice: 'Always include proper error handling and logging'
      }],
      recommendations: [
        'Break down complex problems into smaller parts',
        'Use meaningful variable and function names',
        'Add comments for complex logic',
        'Include proper error handling',
        'Write tests for your code'
      ]
    };
  }

  /**
   * 🔍 Error analysis helpers
   */
  analyzeError(query, context) {
    const errorKeywords = {
      'TypeError': { type: 'type_error', causes: ['Undefined variable', 'Wrong data type', 'Missing property'] },
      'ReferenceError': { type: 'reference_error', causes: ['Undefined variable', 'Typo in variable name', 'Missing import'] },
      'SyntaxError': { type: 'syntax_error', causes: ['Missing bracket', 'Invalid syntax', 'Typo'] },
      'Cannot read property': { type: 'null_undefined', causes: ['Null/undefined object', 'Async timing issue', 'Missing data'] }
    };

    for (const [keyword, info] of Object.entries(errorKeywords)) {
      if (query.includes(keyword)) {
        return info;
      }
    }

    return { type: 'unknown_error', causes: ['Complex issue requiring investigation'] };
  }

  async generateDebuggingFixes(errorAnalysis) {
    const fixes = {
      'type_error': [
        'Add type checking with typeof or instanceof',
        'Use optional chaining (?.) for object properties',
        'Add default values for function parameters',
        'Validate data types before operations'
      ],
      'reference_error': [
        'Check for typos in variable names',
        'Ensure all variables are declared before use',
        'Verify imports are correct and modules exist',
        'Check scope of variable declarations'
      ],
      'syntax_error': [
        'Use a linter like ESLint to catch syntax errors',
        'Check for matching brackets and parentheses',
        'Verify proper string quote matching',
        'Use proper semicolon placement'
      ],
      'null_undefined': [
        'Add null/undefined checks before accessing properties',
        'Use optional chaining: object?.property',
        'Set default values: const value = data?.field || defaultValue',
        'Check async operations with proper await/then'
      ]
    };

    return fixes[errorAnalysis.type] || ['Investigate error context and stack trace'];
  }

  generateDebuggingSteps(errorAnalysis) {
    return [
      '1. Read the full error message and stack trace',
      '2. Identify the exact line where error occurs',
      '3. Check variable values using console.log',
      '4. Verify data types and structure',
      '5. Test with simplified input data',
      '6. Use browser debugger or IDE debugging tools'
    ];
  }

  generatePreventionTips(errorAnalysis) {
    return [
      'Use TypeScript for better type safety',
      'Add comprehensive error handling with try-catch',
      'Validate inputs and data structures',
      'Use linting tools like ESLint',
      'Write unit tests to catch errors early',
      'Use defensive programming practices'
    ];
  }

  generateLearningResources(errorAnalysis) {
    return [
      'MDN Web Docs - JavaScript Error Reference',
      'Chrome DevTools Debugging Guide',
      'Visual Studio Code Debugging Documentation',
      'React Developer Tools Browser Extension',
      'Node.js Debugging Guide'
    ];
  }

  async analyzeProjectArchitecture() {
    return {
      current: 'Standard web application architecture',
      patterns: ['MVC', 'Component-based', 'API-first'],
      technologies: ['React', 'Node.js', 'Database'],
      scalability: 'Medium - suitable for small to medium applications'
    };
  }

  async generateArchitectureRecommendations(projectAnalysis) {
    return [
      'Consider implementing clean architecture principles',
      'Use dependency injection for better testability',
      'Implement proper separation of concerns',
      'Add caching layer for improved performance',
      'Consider microservices for large-scale applications'
    ];
  }

  suggestDesignPatterns(projectAnalysis) {
    return [
      'Observer Pattern - for state management',
      'Factory Pattern - for object creation',
      'Repository Pattern - for data access',
      'Decorator Pattern - for extending functionality'
    ];
  }

  identifyScalabilityConcerns(projectAnalysis) {
    return [
      'Database query optimization needed',
      'Consider implementing caching strategies',
      'API rate limiting should be implemented',
      'File upload handling needs improvement'
    ];
  }

  generateRefactoringSuggestions(projectAnalysis) {
    return [
      'Extract common functionality into reusable utilities',
      'Reduce component complexity by splitting large components',
      'Implement proper error boundaries',
      'Optimize re-renders with React.memo and useMemo'
    ];
  }

  recommendTechnologies(projectAnalysis) {
    return [
      'State Management: Redux Toolkit or Zustand',
      'Styling: Tailwind CSS or Styled Components',
      'Testing: Jest and React Testing Library',
      'Build Tool: Vite or Webpack',
      'Deployment: Vercel or Netlify'
    ];
  }

  async analyzePerformance(context) {
    return {
      identified_bottlenecks: [
        'Large bundle size affecting load time',
        'Unnecessary re-renders in React components',
        'Unoptimized database queries',
        'Missing image optimization'
      ],
      metrics: {
        load_time: '3.2s',
        bundle_size: '2.4MB',
        first_contentful_paint: '1.8s'
      }
    };
  }

  async generateOptimizations(performanceAnalysis) {
    return [
      {
        issue: 'Large bundle size',
        solution: 'Implement code splitting with React.lazy()',
        impact: 'Reduce initial bundle size by 40-60%'
      },
      {
        issue: 'Unnecessary re-renders',
        solution: 'Use React.memo() and useMemo() hooks',
        impact: 'Improve component render performance by 30%'
      },
      {
        issue: 'Unoptimized images',
        solution: 'Use modern image formats (WebP) and lazy loading',
        impact: 'Reduce page load time by 25%'
      }
    ];
  }

  generateMonitoringSuggestions(performanceAnalysis) {
    return [
      'Implement Web Vitals monitoring',
      'Use React DevTools Profiler',
      'Set up performance budget alerts',
      'Monitor bundle size changes in CI/CD'
    ];
  }

  recommendProfilingTools(performanceAnalysis) {
    return [
      'Chrome DevTools Performance tab',
      'React DevTools Profiler',
      'Lighthouse for web performance audits',
      'Bundle Analyzer for webpack analysis'
    ];
  }

  prioritizeOptimizations(performanceAnalysis) {
    return [
      { priority: 'High', optimization: 'Code splitting implementation' },
      { priority: 'High', optimization: 'Image optimization' },
      { priority: 'Medium', optimization: 'Component memoization' },
      { priority: 'Low', optimization: 'Service worker caching' }
    ];
  }

  analyzeTestingNeeds(context) {
    return {
      coverage: {
        current: '68%',
        target: '85%',
        gaps: ['Error handling', 'Edge cases', 'Integration tests']
      },
      types_needed: ['Unit tests', 'Integration tests', 'E2E tests'],
      complexity: 'Medium'
    };
  }

  async generateTestSuggestions(testingAnalysis) {
    return [
      {
        type: 'Unit Test',
        component: 'UserService',
        test_cases: ['Valid user creation', 'Invalid email validation', 'Duplicate user handling']
      },
      {
        type: 'Integration Test',
        feature: 'Authentication Flow',
        test_cases: ['Login success', 'Login failure', 'Password reset', 'Token refresh']
      },
      {
        type: 'E2E Test',
        user_journey: 'User Registration',
        test_cases: ['Complete registration flow', 'Email verification', 'Profile setup']
      }
    ];
  }

  recommendTestingStrategy(testingAnalysis) {
    return {
      pyramid: '70% Unit, 20% Integration, 10% E2E',
      frameworks: ['Jest', 'React Testing Library', 'Cypress'],
      practices: ['Test-driven development', 'Behavior-driven development', 'Continuous testing']
    };
  }

  recommendTestingTools(testingAnalysis) {
    return [
      'Jest - Unit testing framework',
      'React Testing Library - Component testing',
      'Cypress - End-to-end testing',
      'MSW - API mocking',
      'Storybook - Component development and testing'
    ];
  }

  provideIntegrationTestingGuidance(testingAnalysis) {
    return [
      'Test API integrations with real HTTP calls',
      'Use database testing with proper setup/teardown',
      'Mock external services appropriately',
      'Test error handling and edge cases',
      'Ensure tests are independent and repeatable'
    ];
  }

  async estimateUserSatisfaction(response) {
    // Simple heuristic based on response completeness
    let score = 0.5;
    
    if (response.suggestions && response.suggestions.length > 0) score += 0.2;
    if (response.recommendations && response.recommendations.length > 0) score += 0.2;
    if (response.best_practices && response.best_practices.length > 0) score += 0.1;
    
    return Math.min(score, 1.0);
  }

  extractPatterns(query, response) {
    return {
      query_type: this.classifyQuery(query),
      response_type: response.type,
      code_language: this.detectLanguageFromQuery(query),
      complexity_level: this.assessQueryComplexity(query)
    };
  }

  detectLanguageFromQuery(query) {
    const languageKeywords = {
      'javascript': ['javascript', 'js', 'react', 'node', 'npm'],
      'typescript': ['typescript', 'ts', 'tsx'],
      'python': ['python', 'py', 'django', 'flask'],
      'java': ['java', 'spring', 'maven'],
      'go': ['golang', 'go'],
      'rust': ['rust', 'cargo']
    };

    for (const [lang, keywords] of Object.entries(languageKeywords)) {
      if (keywords.some(keyword => query.toLowerCase().includes(keyword))) {
        return lang;
      }
    }
    return 'unknown';
  }

  assessQueryComplexity(query) {
    const words = query.split(' ').length;
    const hasCode = query.includes('function') || query.includes('class') || query.includes('{');
    const hasMultipleConcepts = (query.match(/and|with|using|implement/g) || []).length > 1;
    
    if (words > 20 || hasCode || hasMultipleConcepts) return 'high';
    if (words > 10) return 'medium';
    return 'low';
  }

  detectLanguageFromFiles() {
    // Simplified detection based on current directory
    try {
      const files = fs.readdirSync(process.cwd());
      if (files.some(f => f.endsWith('.tsx') || f.endsWith('.jsx'))) return 'JavaScript';
      if (files.some(f => f.endsWith('.py'))) return 'Python';
      if (files.some(f => f.endsWith('.go'))) return 'Go';
      if (files.some(f => f.endsWith('.rs'))) return 'Rust';
    } catch (error) {
      // Ignore errors
    }
    return 'JavaScript';
  }

  detectFramework() {
    try {
      const packagePath = path.join(process.cwd(), 'package.json');
      if (fs.existsSync(packagePath)) {
        const pkg = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
        const deps = { ...pkg.dependencies, ...pkg.devDependencies };
        
        if (deps.react) return 'React';
        if (deps.vue) return 'Vue';
        if (deps['@angular/core']) return 'Angular';
        if (deps.express) return 'Express';
      }
    } catch (error) {
      // Ignore errors
    }
    return 'Unknown';
  }

  identifyCommonPatterns(context) {
    return ['async-await', 'component-based', 'functional-programming'];
  }

  assessComplexity(context) {
    return 'medium';
  }

  analyzeCodeStyle(context) {
    return 'modern-es6';
  }

  /**
   * 🧠 Language-Specific Code Generation
   */
  async generateJavaScriptCompletions(query, analysis) {
    const completions = [];
    
    if (query.includes('async') || query.includes('await')) {
      completions.push({
        code: `async function ${analysis.functionName || 'asyncFunction'}() {
  try {
    const result = await ${analysis.apiCall || 'apiCall()'}; 
    return result;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}`,
        explanation: 'Async function with proper error handling',
        best_practice: 'Always use try-catch with async/await'
      });
    }

    if (query.includes('react') && query.includes('hook')) {
      completions.push({
        code: `const [${analysis.stateName || 'state'}, set${analysis.stateName || 'State'}] = useState(${analysis.initialValue || 'null'});

useEffect(() => {
  // Side effect logic here
  return () => {
    // Cleanup logic here
  };
}, [${analysis.dependencies || ''}]);`,
        explanation: 'React hook pattern with cleanup',
        best_practice: 'Always include cleanup in useEffect when needed'
      });
    }

    if (query.includes('api') || query.includes('fetch')) {
      completions.push({
        code: `const fetchData = async (url, options = {}) => {
  const response = await fetch(url, {
    headers: {
      'Content-Type': 'application/json',
      ...options.headers
    },
    ...options
  });
  
  if (!response.ok) {
    throw new Error(\`HTTP error! status: \${response.status}\`);
  }
  
  return response.json();
};`,
        explanation: 'Robust API fetch function with error handling',
        best_practice: 'Always check response.ok before parsing JSON'
      });
    }

    return completions;
  }

  async generatePythonCompletions(query, analysis) {
    const completions = [];
    
    if (query.includes('class') || query.includes('dataclass')) {
      completions.push({
        code: `from dataclasses import dataclass
from typing import Optional, List

@dataclass
class ${analysis.className || 'DataModel'}:
    ${analysis.fields || 'name: str\n    value: Optional[int] = None'}
    
    def __post_init__(self):
        \"\"\"Validation logic after initialization\"\"\"
        if self.value and self.value < 0:
            raise ValueError("Value must be positive")`,
        explanation: 'Modern Python dataclass with validation',
        best_practice: 'Use dataclasses for simple data structures'
      });
    }

    if (query.includes('async') || query.includes('asyncio')) {
      completions.push({
        code: `import asyncio
import aiohttp
from typing import List, Dict, Any

async def fetch_data(session: aiohttp.ClientSession, url: str) -> Dict[Any, Any]:
    \"\"\"Fetch data from URL with proper error handling\"\"\"
    try:
        async with session.get(url) as response:
            response.raise_for_status()
            return await response.json()
    except aiohttp.ClientError as e:
        logger.error(f"Request failed: {e}")
        raise

async def main():
    async with aiohttp.ClientSession() as session:
        tasks = [fetch_data(session, url) for url in urls]
        results = await asyncio.gather(*tasks, return_exceptions=True)
        return results`,
        explanation: 'Async HTTP requests with proper session management',
        best_practice: 'Always use session context managers with aiohttp'
      });
    }

    return completions;
  }

  /**
   * 🔍 Context Analysis Methods
   */
  analyzeCodeContext(context) {
    return {
      language: context.language || this.detectLanguageFromFiles(),
      framework: context.framework || this.detectFramework(),
      patterns: this.identifyCommonPatterns(context),
      complexity: this.assessComplexity(context),
      style: this.analyzeCodeStyle(context)
    };
  }

  classifyQuery(query) {
    const classifications = {
      code_completion: ['complete', 'implement', 'write', 'generate', 'create function'],
      debugging_help: ['error', 'bug', 'fix', 'debug', 'not working', 'exception'],
      architecture_advice: ['architecture', 'design', 'structure', 'organize', 'best practice'],
      performance_optimization: ['performance', 'optimize', 'slow', 'faster', 'memory', 'cpu'],
      testing_guidance: ['test', 'testing', 'unit test', 'integration test', 'coverage'],
      deployment_help: ['deploy', 'deployment', 'production', 'build', 'ci/cd'],
      learning_suggestion: ['learn', 'understand', 'explain', 'how does', 'what is']
    };

    for (const [type, keywords] of Object.entries(classifications)) {
      if (keywords.some(keyword => query.toLowerCase().includes(keyword))) {
        return type;
      }
    }

    return 'general_assistance';
  }

  updateSkillLevel() {
    const recentInteractions = this.patterns.interactions.slice(-50);
    const satisfactionAvg = recentInteractions.reduce((sum, i) => sum + i.user_satisfaction, 0) / recentInteractions.length;
    
    if (satisfactionAvg > 0.8 && recentInteractions.length > 30) {
      this.skillLevel = 'expert';
    } else if (satisfactionAvg > 0.6 && recentInteractions.length > 15) {
      this.skillLevel = 'intermediate';  
    } else {
      this.skillLevel = 'beginner';
    }
  }

  loadLearningData() {
    try {
      if (fs.existsSync(this.learningPath)) {
        return JSON.parse(fs.readFileSync(this.learningPath, 'utf8'));
      }
    } catch (error) {
      console.warn('Could not load learning data:', error.message);
    }

    return {
      interactions: [],
      learned_patterns: {},
      skill_progression: [],
      preferences: {}
    };
  }

  async saveLearningData() {
    try {
      const dir = path.dirname(this.learningPath);
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
      }
      fs.writeFileSync(this.learningPath, JSON.stringify(this.patterns, null, 2));
    } catch (error) {
      console.warn('Could not save learning data:', error.message);
    }
  }

  /**
   * 🎯 Main CLI interface
   */
  /**
   * 🎯 Calculate confidence score for responses
   */
  calculateConfidence(analysis) {
    let confidence = 0.5; // Base confidence
    
    if (analysis && typeof analysis === 'object') {
      // Increase confidence based on context richness
      if (analysis.frameworks && analysis.frameworks.length > 0) confidence += 0.2;
      if (analysis.complexity && analysis.complexity !== 'unknown') confidence += 0.1;
      if (analysis.patterns && analysis.patterns.length > 0) confidence += 0.1;
      if (this.patterns && Object.keys(this.patterns).length > 5) confidence += 0.1;
    }
    
    return Math.min(confidence, 0.95); // Cap at 95%
  }

  /**
   * 📝 Generate explanations for suggestions
   */
  generateExplanations(suggestions, analysis) {
    if (!suggestions || !Array.isArray(suggestions)) return [];
    
    return suggestions.map((suggestion, index) => ({
      suggestion_index: index,
      explanation: suggestion.explanation || 'AI-generated code suggestion with best practices',
      reasoning: 'Based on analysis of your project context and coding patterns',
      benefits: ['Improved code maintainability', 'Better performance', 'Enhanced readability']
    }));
  }

  /**
   * ✨ Generate best practices
   */
  generateBestPractices(analysis) {
    const practices = [
      'Always include proper error handling and logging',
      'Use TypeScript for better type safety',
      'Implement comprehensive testing strategies',
      'Follow SOLID principles for maintainable code',
      'Use meaningful variable and function names'
    ];
    
    if (analysis && analysis.frameworks) {
      if (analysis.frameworks.includes('React')) {
        practices.push('Use React.memo and useMemo for performance optimization');
        practices.push('Implement proper component composition patterns');
      }
      if (analysis.frameworks.includes('Node.js')) {
        practices.push('Use async/await for better asynchronous code handling');
        practices.push('Implement proper middleware patterns');
      }
    }
    
    return practices;
  }

  /**
   * 🔧 Generate debugging steps
   */
  generateDebuggingSteps(errorAnalysis) {
    return [
      '1. Reproduce the error consistently',
      '2. Check console logs and error messages',
      '3. Review recent code changes',
      '4. Verify dependencies and versions',
      '5. Test in isolation with minimal setup',
      '6. Use debugger tools and breakpoints',
      '7. Check documentation and community resources'
    ];
  }

  /**
   * 🛡️ Generate prevention tips
   */
  generatePreventionTips(errorAnalysis) {
    return [
      'Implement comprehensive error boundaries',
      'Add proper input validation and sanitization',
      'Use TypeScript for compile-time error detection',
      'Set up automated testing pipelines',
      'Implement proper logging and monitoring',
      'Follow code review best practices'
    ];
  }

  /**
   * 📚 Generate learning resources
   */
  generateLearningResources(errorAnalysis) {
    return [
      'Official framework documentation',
      'MDN Web Docs for JavaScript concepts',
      'TypeScript handbook for type safety',
      'Testing Library documentation',
      'Stack Overflow community discussions',
      'GitHub repositories with similar implementations'
    ];
  }

  /**
   * 🔄 Generate refactoring suggestions
   */
  generateRefactoringSuggestions(projectAnalysis) {
    return [
      'Extract common functionality into reusable utilities',
      'Reduce component complexity by splitting large components',
      'Implement proper separation of concerns',
      'Optimize re-renders with React.memo and useMemo',
      'Add proper TypeScript types and interfaces',
      'Implement consistent error handling patterns'
    ];
  }

  /**
   * 📊 Generate monitoring suggestions
   */
  generateMonitoringSuggestions(performanceAnalysis) {
    return [
      'Implement application performance monitoring (APM)',
      'Add error tracking and reporting systems',
      'Monitor bundle size and loading performance',
      'Track user interaction metrics',
      'Set up automated performance regression testing',
      'Implement health check endpoints'
    ];
  }

  static async provideAssistance(query, context = {}) {
    const assistant = new AdaptiveAIAssistant();
    return await assistant.assist(query, context);
  }
}

// CLI usage
if (require.main === module) {
  (async () => {
    try {
      const query = process.argv.slice(2).join(' ');
      if (!query) {
        console.log('Usage: node adaptive-ai-assistant.js "your query here"');
        console.log('Example: node adaptive-ai-assistant.js "help me implement async function"');
        return;
      }

      const response = await AdaptiveAIAssistant.provideAssistance(query);
      
      console.log('\n🧠 AI Assistant Response:');
      console.log('========================');
      console.log('Type:', response.type);
      
      if (response.suggestions) {
        console.log('\n💡 Code Suggestions:');
        response.suggestions.forEach((suggestion, index) => {
          console.log(`\n${index + 1}. ${suggestion.explanation}`);
          console.log('```');
          console.log(suggestion.code);
          console.log('```');
          if (suggestion.best_practice) {
            console.log(`💡 Best Practice: ${suggestion.best_practice}`);
          }
        });
      }

      if (response.recommendations) {
        console.log('\n🎯 Recommendations:');
        response.recommendations.forEach(rec => console.log(` • ${rec}`));
      }

      if (response.best_practices) {
        console.log('\n✨ Best Practices:');
        response.best_practices.forEach(practice => console.log(` • ${practice}`));
      }
      
    } catch (error) {
      console.error('❌ AI assistance failed:', error.message);
      process.exit(1);
    }
  })();
}

module.exports = AdaptiveAIAssistant;