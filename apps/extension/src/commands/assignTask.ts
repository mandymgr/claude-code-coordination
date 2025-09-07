import * as vscode from 'vscode';
import { callServer } from '../utils/api.js';
import { captureContext } from '../utils/context.js';
// Import paths updated for new structure - use relative imports for better compatibility
// import { ContextAwareAI } from '../../../packages/ai-core/src/context-aware-ai';
// import { MagicCLI } from '../../../packages/ai-core/src/magic-cli';
import path from 'path';

export async function assignTask(): Promise<void> {
  const task = await vscode.window.showInputBox({ 
    prompt: 'Task for AI team…',
    placeHolder: 'Add dark mode toggle to the settings page'
  });
  
  if (!task) return;

  try {
    vscode.window.showInformationMessage('🤖 Processing task with AI team...');
    
    const context = await captureContext();
    
    // Check for ADR context in workspace
    const workspaceRoot = vscode.workspace.workspaceFolders?.[0]?.uri.fsPath;
    let adrPath: string | undefined;
    
    if (workspaceRoot) {
      // Look for ADRs in common locations
      const possiblePaths = [
        path.join(workspaceRoot, 'docs/adr'),
        path.join(workspaceRoot, '../Krins-Dev-Memory-OS/docs/adr'),
        path.join(path.dirname(workspaceRoot), 'Krins-Dev-Memory-OS/docs/adr')
      ];
      
      for (const possiblePath of possiblePaths) {
        try {
          const fs = require('fs');
          if (fs.existsSync(possiblePath)) {
            adrPath = possiblePath;
            break;
          }
        } catch (e) {
          // Continue checking other paths
        }
      }
    }
    
    // Use context-aware AI if ADRs are found
    if (adrPath) {
      vscode.window.showInformationMessage('📋 Found ADRs - using architectural context...');
      
      // Show ADR context available in output channel
      const outputChannel = vscode.window.createOutputChannel('Claude Code - ADR Context');
      outputChannel.clear();
      outputChannel.appendLine(`📋 ADR Context available for task: "${task}"`);
      outputChannel.appendLine('─'.repeat(50));
      outputChannel.appendLine(`ADR Path: ${adrPath}`);
      outputChannel.appendLine('Context will be used for intelligent code generation.');
      outputChannel.show();
    }
    
    // Use KRIN MCP Server for intelligent task assignment
    try {
      // Create coordination session
      vscode.window.showInformationMessage('🎯 KRIN: Creating AI coordination session...');
      
      const result = await callServer('/api/coordination/assign', { 
        task, 
        context: {
          ...context,
          adrPath,
          adrContext: adrPath ? 'ADR context available' : 'No ADR context found'
        },
        agents: ['claude', 'gpt4', 'gemini'], // Let KRIN choose optimal agent
        priority: 'medium',
        autoFix: true // Enable quality gates with auto-fix
      });
    
    if (result.success) {
      // Open diff preview
      const doc = await vscode.workspace.openTextDocument({ 
        content: result.diffText,
        language: 'diff'
      });
      
      await vscode.window.showTextDocument(doc, {
        viewColumn: vscode.ViewColumn.Beside,
        preview: true
      });
      
      // Show KRIN assignment details
      const statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Right, 100);
      statusBarItem.text = `🤖 ${result.assignedAgent} • ${result.estimatedTime}`;
      statusBarItem.tooltip = `KRIN assigned to ${result.assignedAgent}: ${result.reasoning}`;
      statusBarItem.show();
      
      // Auto-hide status after 10 seconds
      setTimeout(() => statusBarItem.dispose(), 10000);
      
      vscode.window.showInformationMessage(
        `✅ KRIN: Task assigned to ${result.assignedAgent}! ${result.qualityPassed ? '🛡️ Quality gates passed' : '⚠️ Quality issues found'}`
      );
      
      // Show quality gate results if available
      if (result.qualityResults) {
        const qualityChannel = vscode.window.createOutputChannel('KRIN - Quality Gates');
        qualityChannel.clear();
        qualityChannel.appendLine(`🛡️ Quality Gate Results for: "${task}"`);
        qualityChannel.appendLine('─'.repeat(50));
        
        result.qualityResults.checks.forEach((check: any) => {
          const status = check.passed ? '✅' : '❌';
          qualityChannel.appendLine(`${status} ${check.name}: ${check.message}`);
          if (check.fixedIssues > 0) {
            qualityChannel.appendLine(`   🔧 Auto-fixed ${check.fixedIssues} issues`);
          }
        });
        
        qualityChannel.show();
      }
    } else {
      vscode.window.showErrorMessage(`❌ KRIN task assignment failed: ${result.error || 'Unknown error'}`);
    }
    } catch (mcpError) {
      // Fallback to regular task assignment
      console.warn('MCP Server unavailable, falling back to regular assignment:', mcpError);
      
      const result = await callServer('/api/tasks', { 
        task, 
        context: {
          ...context,
          adrPath,
          adrContext: adrPath ? 'ADR context available' : 'No ADR context found'
        }
      });
      
      if (result.success) {
        // Open diff preview
        const doc = await vscode.workspace.openTextDocument({ 
          content: result.diffText,
          language: 'diff'
        });
        
        await vscode.window.showTextDocument(doc, {
          viewColumn: vscode.ViewColumn.Beside,
          preview: true
        });
        
        vscode.window.showInformationMessage(
          `✅ Task completed! Generated diff with ${result.tokens} tokens in ${result.duration}ms`
        );
      } else {
        vscode.window.showErrorMessage(`❌ Task failed: ${result.error || 'Unknown error'}`);
      }
    }
  } catch (error) {
    vscode.window.showErrorMessage(`❌ Task failed: ${error}`);
  }
}