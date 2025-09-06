import * as vscode from 'vscode';
import { callServer } from '../utils/api.js';
import { captureContext } from '../utils/context.js';

export async function assignTask(): Promise<void> {
  const task = await vscode.window.showInputBox({ 
    prompt: 'Task for AI team…',
    placeHolder: 'Add dark mode toggle to the settings page'
  });
  
  if (!task) return;

  try {
    vscode.window.showInformationMessage('🤖 Processing task with AI team...');
    
    const context = await captureContext();
    const result = await callServer('/api/tasks', { task, context });
    
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
  } catch (error) {
    vscode.window.showErrorMessage(`❌ Task failed: ${error}`);
  }
}