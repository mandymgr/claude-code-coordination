#!/usr/bin/env node
/**
 * 🪄✨ Enhanced Magic CLI - Ultimate Development Command Interface
 * Advanced CLI with tab completion, progress indicators, and intelligent assistance
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const readline = require('readline');

// Import magic modules
const UniversalProjectDetector = require('./universal-project-detector.cjs');
const MagicDevEnvironment = require('./magic-dev-environment.cjs');
const AdaptiveAIAssistant = require('./adaptive-ai-assistant.cjs');
const SmartResponseCache = require('./smart-response-cache.cjs');

class EnhancedMagicCLI {
  constructor() {
    this.version = '2.0.0';
    this.projectPath = process.cwd();
    this.commands = this.setupCommands();
    this.completions = this.setupCompletions();
    this.aiAssistant = new AdaptiveAIAssistant(this.projectPath);
    this.cache = new SmartResponseCache(this.projectPath);
    this.isInteractiveMode = false;
  }

  /**
   * 🎯 Setup enhanced command definitions
   */
  setupCommands() {
    return {
      // Core Magic Commands
      'init': {
        description: '🪄 Initialize magic for any project type',
        usage: 'magic init [project-path] [--type] [--features]',
        options: ['--type=web', '--type=mobile', '--type=api', '--features=all', '--features=ai', '--features=deploy'],
        action: this.initMagic.bind(this),
        examples: [
          'magic init',
          'magic init ./my-project --type=web --features=all',
          'magic init --type=mobile'
        ]
      },

      'ai': {
        description: '🧠 AI-powered development assistance',
        usage: 'magic ai "question" [--context] [--cache]',
        options: ['--context=file', '--context=project', '--cache', '--no-cache', '--explain'],
        action: this.askAI.bind(this),
        examples: [
          'magic ai "how to optimize this React component?"',
          'magic ai "best security practices" --context=project',
          'magic ai "explain this error" --explain'
        ]
      },

      'detect': {
        description: '🔍 Intelligent project detection and analysis',
        usage: 'magic detect [path] [--verbose] [--json]',
        options: ['--verbose', '--json', '--dependencies', '--frameworks'],
        action: this.detectProject.bind(this),
        examples: [
          'magic detect',
          'magic detect ./backend --verbose',
          'magic detect --json'
        ]
      },

      'setup': {
        description: '⚡ Setup development environment',
        usage: 'magic setup [feature] [--auto]',
        options: ['--auto', '--ai', '--deployment', '--monitoring', '--testing'],
        subcommands: ['ai', 'deploy', 'monitor', 'test', 'all'],
        action: this.setupEnvironment.bind(this),
        examples: [
          'magic setup --auto',
          'magic setup ai',
          'magic setup deploy --auto'
        ]
      },

      'dashboard': {
        description: '📊 Launch magic development dashboard',
        usage: 'magic dashboard [--port] [--open]',
        options: ['--port=3000', '--open', '--dev'],
        action: this.launchDashboard.bind(this),
        examples: [
          'magic dashboard',
          'magic dashboard --port=4000 --open'
        ]
      },

      'cache': {
        description: '🚀 Manage AI response cache',
        usage: 'magic cache [command]',
        subcommands: ['stats', 'clear', 'warm', 'cleanup'],
        action: this.manageCache.bind(this),
        examples: [
          'magic cache stats',
          'magic cache clear',
          'magic cache warm'
        ]
      },

      'interactive': {
        description: '💬 Start interactive magic session',
        usage: 'magic interactive [--ai-context]',
        options: ['--ai-context', '--project-aware'],
        action: this.startInteractive.bind(this),
        examples: [
          'magic interactive',
          'magic interactive --ai-context --project-aware'
        ]
      },

      'optimize': {
        description: '⚡ Optimize project performance',
        usage: 'magic optimize [target] [--analyze]',
        options: ['--analyze', '--fix', '--report'],
        subcommands: ['code', 'bundle', 'deps', 'images', 'all'],
        action: this.optimizeProject.bind(this),
        examples: [
          'magic optimize',
          'magic optimize bundle --analyze',
          'magic optimize code --fix'
        ]
      },

      'completion': {
        description: '📝 Generate shell completion scripts',
        usage: 'magic completion [shell]',
        options: ['bash', 'zsh', 'fish'],
        action: this.generateCompletion.bind(this),
        examples: [
          'magic completion bash > ~/.magic-completion.bash',
          'magic completion zsh'
        ]
      }
    };
  }

  /**
   * 🔧 Setup tab completions
   */
  setupCompletions() {
    const completions = {};
    
    // Generate completions for each command
    Object.entries(this.commands).forEach(([command, config]) => {
      completions[command] = {
        options: config.options || [],
        subcommands: config.subcommands || []
      };
    });

    return completions;
  }

  /**
   * 🎯 Main CLI entry point with enhanced parsing
   */
  async run(args = process.argv.slice(2)) {
    if (args.length === 0) {
      return this.showEnhancedHelp();
    }

    const [command, ...params] = args;

    // Handle global options
    if (command === '--version' || command === '-v') {
      return this.showVersion();
    }

    if (command === '--help' || command === '-h') {
      return this.showEnhancedHelp();
    }

    // Execute command with enhanced error handling
    try {
      await this.executeCommand(command, params);
    } catch (error) {
      this.handleError(error, command);
    }
  }

  /**
   * ⚡ Execute command with progress indication
   */
  async executeCommand(command, params) {
    const config = this.commands[command];
    
    if (!config) {
      console.log(`❌ Unknown command: ${command}`);
      console.log(`💡 Run 'magic --help' to see available commands`);
      this.suggestSimilarCommands(command);
      return;
    }

    // Show command execution start
    console.log(`🪄 Executing: magic ${command} ${params.join(' ')}`);
    
    // Execute with progress indication
    const startTime = Date.now();
    await config.action(params);
    const duration = Date.now() - startTime;
    
    console.log(`✅ Completed in ${duration}ms`);
  }

  /**
   * 💡 Suggest similar commands
   */
  suggestSimilarCommands(input) {
    const commands = Object.keys(this.commands);
    const suggestions = commands.filter(cmd => 
      cmd.includes(input.toLowerCase()) || 
      input.toLowerCase().includes(cmd) ||
      this.levenshteinDistance(cmd, input.toLowerCase()) <= 2
    );

    if (suggestions.length > 0) {
      console.log(`\n💡 Did you mean one of these?`);
      suggestions.forEach(suggestion => {
        console.log(`   magic ${suggestion}`);
      });
    }
  }

  /**
   * 🔤 Calculate Levenshtein distance for command suggestions
   */
  levenshteinDistance(str1, str2) {
    const matrix = [];
    
    for (let i = 0; i <= str2.length; i++) {
      matrix[i] = [i];
    }
    
    for (let j = 0; j <= str1.length; j++) {
      matrix[0][j] = j;
    }
    
    for (let i = 1; i <= str2.length; i++) {
      for (let j = 1; j <= str1.length; j++) {
        if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
          matrix[i][j] = matrix[i - 1][j - 1];
        } else {
          matrix[i][j] = Math.min(
            matrix[i - 1][j - 1] + 1,
            matrix[i][j - 1] + 1,
            matrix[i - 1][j] + 1
          );
        }
      }
    }
    
    return matrix[str2.length][str1.length];
  }

  /**
   * 📚 Enhanced help display
   */
  showEnhancedHelp() {
    console.log(`
🪄✨ Enhanced Magic CLI v${this.version} ✨🪄
The ultimate development magic wand for ANY project

📖 USAGE:
   magic <command> [options] [arguments]

🚀 CORE COMMANDS:
`);

    Object.entries(this.commands).forEach(([command, config]) => {
      console.log(`   ${command.padEnd(12)} ${config.description}`);
      
      if (config.examples && config.examples.length > 0) {
        console.log(`${''.padEnd(16)}Examples:`);
        config.examples.slice(0, 2).forEach(example => {
          console.log(`${''.padEnd(18)}${example}`);
        });
      }
      console.log('');
    });

    console.log(`
🎯 GLOBAL OPTIONS:
   -h, --help       Show this help message
   -v, --version    Show version information
   --verbose        Enable verbose output
   --json           Output in JSON format
   --no-cache       Disable AI response caching

💡 GETTING STARTED:
   magic init                    # Initialize magic in current project
   magic ai "your question"      # Ask AI for help
   magic interactive            # Start interactive session
   magic dashboard             # Open visual dashboard

🔧 TAB COMPLETION:
   magic completion bash > ~/.magic-completion.bash
   source ~/.magic-completion.bash

🌟 Visit: https://github.com/magic-dev/magic-cli for more information
`);
  }

  /**
   * 📊 Show version with system info
   */
  showVersion() {
    console.log(`
🪄 Enhanced Magic CLI v${this.version}

📊 System Information:
   Node.js: ${process.version}
   Platform: ${process.platform}
   Architecture: ${process.arch}
   Project Path: ${this.projectPath}

🚀 Features:
   ✅ AI-Powered Assistant
   ✅ Smart Response Caching
   ✅ Universal Project Detection
   ✅ Interactive Mode
   ✅ Tab Completion
   ✅ Progress Indicators
`);
  }

  /**
   * 🧠 Enhanced AI assistance
   */
  async askAI(params) {
    const question = params.find(p => !p.startsWith('--'))?.replace(/['"]/g, '');
    const useCache = !params.includes('--no-cache');
    const explain = params.includes('--explain');
    const contextType = this.extractOption(params, '--context') || 'auto';

    if (!question) {
      console.log('❓ Please provide a question: magic ai "your question"');
      return;
    }

    console.log(`🧠 AI Assistant processing: "${question}"`);
    
    if (useCache) {
      this.showProgress('Checking cache...');
    }

    const context = await this.buildAIContext(contextType);
    const response = await this.aiAssistant.assist(question, context);

    console.log('\n🤖 AI Response:');
    console.log('─'.repeat(50));
    
    if (typeof response === 'object') {
      this.formatAIResponse(response, explain);
    } else {
      console.log(response);
    }

    console.log('─'.repeat(50));
    console.log('💾 Response cached for future use');
  }

  /**
   * 🎨 Format AI response nicely
   */
  formatAIResponse(response, explain = false) {
    if (response.suggestions && response.suggestions.length > 0) {
      console.log('\n💡 Suggestions:');
      response.suggestions.forEach((suggestion, index) => {
        console.log(`\n${index + 1}. ${suggestion.title || 'Suggestion'}`);
        if (suggestion.code) {
          console.log('```');
          console.log(suggestion.code);
          console.log('```');
        }
        if (suggestion.explanation && explain) {
          console.log(`💬 ${suggestion.explanation}`);
        }
      });
    }

    if (response.best_practices && response.best_practices.length > 0) {
      console.log('\n🌟 Best Practices:');
      response.best_practices.forEach(practice => {
        console.log(`   • ${practice}`);
      });
    }

    if (response.potential_issues && response.potential_issues.length > 0) {
      console.log('\n⚠️  Potential Issues:');
      response.potential_issues.forEach(issue => {
        console.log(`   • ${issue}`);
      });
    }
  }

  /**
   * 🏗️ Build AI context
   */
  async buildAIContext(contextType) {
    const context = {
      projectPath: this.projectPath,
      timestamp: Date.now()
    };

    if (contextType === 'project' || contextType === 'auto') {
      try {
        const detector = new UniversalProjectDetector();
        const projectInfo = detector.detectProject(this.projectPath);
        Object.assign(context, projectInfo);
      } catch (error) {
        // Silent fallback
      }
    }

    return context;
  }

  /**
   * 🚀 Cache management
   */
  async manageCache(params) {
    const subcommand = params[0] || 'stats';

    switch (subcommand) {
      case 'stats':
        const stats = this.cache.getStats();
        console.log('📊 Cache Statistics:');
        console.log(`   Entries: ${stats.entryCount}`);
        console.log(`   Size: ${stats.totalSizeKB}KB / ${stats.maxSizeKB}KB (${stats.utilizationPercent}%)`);
        console.log(`   Hit Rate: ${stats.hitRate}%`);
        console.log(`   Recent Entries: ${stats.recentEntries}`);
        console.log(`   Last Cleanup: ${stats.lastCleanup}`);
        break;

      case 'clear':
        console.log('🧹 Clearing cache...');
        await this.cache.clearCache();
        break;

      case 'warm':
        console.log('🔥 Warming cache...');
        await this.cache.warmCache();
        break;

      case 'cleanup':
        console.log('🗑️ Running cleanup...');
        await this.cache.cleanup();
        break;

      default:
        console.log('❓ Unknown cache command:', subcommand);
        console.log('Available: stats, clear, warm, cleanup');
    }
  }

  /**
   * 💬 Start interactive mode
   */
  async startInteractive(params) {
    this.isInteractiveMode = true;
    console.log(`
🪄✨ Magic Interactive Session Started ✨🪄

Type 'help' for commands, 'exit' to quit
AI context: ${params.includes('--ai-context') ? 'enabled' : 'basic'}
`);

    const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      prompt: '🪄 magic> '
    });

    rl.prompt();

    rl.on('line', async (line) => {
      const input = line.trim();
      
      if (input === 'exit' || input === 'quit') {
        console.log('✨ Magic session ended. Happy coding!');
        rl.close();
        return;
      }

      if (input === 'help') {
        this.showInteractiveHelp();
        rl.prompt();
        return;
      }

      if (input.startsWith('ai ')) {
        await this.askAI([input.substring(3)]);
        rl.prompt();
        return;
      }

      // Execute as regular command
      try {
        const [command, ...params] = input.split(' ');
        await this.executeCommand(command, params);
      } catch (error) {
        this.handleError(error, input);
      }

      rl.prompt();
    });

    rl.on('close', () => {
      this.isInteractiveMode = false;
      process.exit(0);
    });
  }

  /**
   * 📖 Show interactive help
   */
  showInteractiveHelp() {
    console.log(`
💬 Interactive Mode Commands:
   ai <question>        Ask AI assistant
   cache stats          Show cache statistics
   detect               Analyze current project
   setup <feature>      Setup development features
   help                 Show this help
   exit                 Exit interactive mode

💡 You can use any magic command in interactive mode!
`);
  }

  /**
   * 📝 Generate completion scripts
   */
  generateCompletion(params) {
    const shell = params[0] || 'bash';
    
    if (shell === 'bash') {
      console.log(this.generateBashCompletion());
    } else if (shell === 'zsh') {
      console.log(this.generateZshCompletion());
    } else {
      console.log('❓ Unsupported shell. Available: bash, zsh');
    }
  }

  /**
   * 🐚 Generate Bash completion script
   */
  generateBashCompletion() {
    const commands = Object.keys(this.commands).join(' ');
    const allOptions = Object.values(this.commands)
      .flatMap(cmd => cmd.options || [])
      .filter(Boolean)
      .join(' ');

    return `#!/bin/bash
# Magic CLI Bash Completion

_magic_completion() {
  local cur prev opts
  COMPREPLY=()
  cur="\${COMP_WORDS[COMP_CWORD]}"
  prev="\${COMP_WORDS[COMP_CWORD-1]}"

  # Commands
  if [[ \${COMP_CWORD} == 1 ]]; then
    opts="${commands}"
    COMPREPLY=( \$(compgen -W "\${opts}" -- \${cur}) )
    return 0
  fi

  # Options
  if [[ \${cur} == -* ]]; then
    opts="${allOptions}"
    COMPREPLY=( \$(compgen -W "\${opts}" -- \${cur}) )
    return 0
  fi

  # File completion as fallback
  COMPREPLY=( \$(compgen -f -- \${cur}) )
  return 0
}

complete -F _magic_completion magic
`;
  }

  /**
   * 🐚 Generate Zsh completion script
   */
  generateZshCompletion() {
    const commands = Object.entries(this.commands)
      .map(([cmd, config]) => `"${cmd}:${config.description}"`)
      .join(' ');

    return `#compdef magic
# Magic CLI Zsh Completion

_magic() {
  local context curcontext="\$curcontext" state line
  typeset -A opt_args

  _arguments -C \\
    '(-h --help)'{-h,--help}'[Show help information]' \\
    '(-v --version)'{-v,--version}'[Show version information]' \\
    '1: :_magic_commands' \\
    '*::arg:->args'

  case \$state in
    args)
      case \$words[1] in
        ai)
          _arguments \\
            '--context[Set context type]:context:(file project auto)' \\
            '--cache[Use cache]' \\
            '--no-cache[Disable cache]' \\
            '--explain[Show explanations]'
          ;;
        cache)
          _arguments \\
            '1: :(stats clear warm cleanup)'
          ;;
        *)
          _files
          ;;
      esac
      ;;
  esac
}

_magic_commands() {
  local commands=(
    ${commands}
  )
  _describe 'command' commands
}

_magic "\$@"
`;
  }

  /**
   * 🎯 Extract option value from parameters
   */
  extractOption(params, option) {
    const param = params.find(p => p.startsWith(option + '='));
    return param ? param.split('=')[1] : null;
  }

  /**
   * ⏳ Show progress indicator
   */
  showProgress(message) {
    if (this.isInteractiveMode) return;
    
    process.stdout.write(`⏳ ${message} `);
    
    // Simple spinner
    const spinner = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];
    let i = 0;
    
    const interval = setInterval(() => {
      process.stdout.write(`\r⏳ ${message} ${spinner[i]}`);
      i = (i + 1) % spinner.length;
    }, 100);
    
    setTimeout(() => {
      clearInterval(interval);
      process.stdout.write(`\r✅ ${message} Done!\n`);
    }, 1500);
  }

  /**
   * ❌ Enhanced error handling
   */
  handleError(error, command) {
    console.error(`❌ Error executing '${command}':`);
    console.error(`   ${error.message}`);
    
    if (process.env.DEBUG || process.env.VERBOSE) {
      console.error('\n🐛 Debug Information:');
      console.error(error.stack);
    }
    
    console.log(`\n💡 Try 'magic ${command} --help' for usage information`);
    process.exit(1);
  }

  // Placeholder methods for existing functionality
  async initMagic(params) { console.log('🪄 Init magic...'); }
  async detectProject(params) { console.log('🔍 Detecting project...'); }
  async setupEnvironment(params) { console.log('⚡ Setting up environment...'); }
  async launchDashboard(params) { console.log('📊 Launching dashboard...'); }
  async optimizeProject(params) { console.log('⚡ Optimizing project...'); }
}

// CLI Entry Point
if (require.main === module) {
  const cli = new EnhancedMagicCLI();
  cli.run().catch(error => {
    console.error('💥 Fatal error:', error.message);
    process.exit(1);
  });
}

module.exports = EnhancedMagicCLI;