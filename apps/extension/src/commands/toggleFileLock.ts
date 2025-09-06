import * as vscode from 'vscode';
import * as path from 'path';
import { callServer } from '../utils/api.js';

export async function toggleFileLock(): Promise<void> {
  const activeEditor = vscode.window.activeTextEditor;
  if (!activeEditor) {
    vscode.window.showWarningMessage('No active file to lock/unlock');
    return;
  }

  const filePath = activeEditor.document.fileName;
  const workspaceFolder = vscode.workspace.getWorkspaceFolder(activeEditor.document.uri);
  
  if (!workspaceFolder) {
    vscode.window.showWarningMessage('File must be in workspace to coordinate');
    return;
  }

  const relativePath = path.relative(workspaceFolder.uri.fsPath, filePath);
  const fileName = path.basename(filePath);

  try {
    // Check current lock status
    const statusResult = await callServer('/api/locks/status', { 
      path: relativePath 
    });

    const isCurrentlyLocked = statusResult.locked;

    if (isCurrentlyLocked) {
      // Unlock file
      const confirm = await vscode.window.showQuickPick(
        ['Yes, unlock it', 'Cancel'],
        {
          placeHolder: `File "${fileName}" is currently locked. Unlock it?`
        }
      );

      if (confirm === 'Yes, unlock it') {
        await callServer('/api/locks', {
          path: relativePath,
          lock: false,
          agentId: 'vscode-extension'
        });
        
        vscode.window.showInformationMessage(`🔓 File unlocked: ${fileName}`);
      }
    } else {
      // Lock file
      const reason = await vscode.window.showInputBox({
        prompt: 'Reason for locking file',
        placeHolder: 'Editing component logic...',
        value: `Editing ${fileName}`
      });

      if (reason) {
        await callServer('/api/locks', {
          path: relativePath,
          lock: true,
          agentId: 'vscode-extension',
          reason: reason
        });
        
        vscode.window.showInformationMessage(`🔒 File locked: ${fileName}`);
      }
    }
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to toggle file lock: ${error}`);
  }
}

export async function lockCurrentFile(): Promise<void> {
  const activeEditor = vscode.window.activeTextEditor;
  if (!activeEditor) {
    vscode.window.showWarningMessage('No active file to lock');
    return;
  }

  const filePath = activeEditor.document.fileName;
  const workspaceFolder = vscode.workspace.getWorkspaceFolder(activeEditor.document.uri);
  
  if (!workspaceFolder) {
    vscode.window.showWarningMessage('File must be in workspace to coordinate');
    return;
  }

  const relativePath = path.relative(workspaceFolder.uri.fsPath, filePath);
  const reason = await vscode.window.showInputBox({
    prompt: 'Reason for locking file',
    placeHolder: 'Editing component logic...',
    value: `Editing ${path.basename(filePath)}`
  });

  if (!reason) return;

  try {
    await callServer('/api/locks', {
      path: relativePath,
      lock: true,
      agentId: 'vscode-extension',
      reason: reason
    });
    
    vscode.window.showInformationMessage(`🔒 File locked: ${path.basename(filePath)}`);
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to lock file: ${error}`);
  }
}

export async function unlockCurrentFile(): Promise<void> {
  const activeEditor = vscode.window.activeTextEditor;
  if (!activeEditor) {
    vscode.window.showWarningMessage('No active file to unlock');
    return;
  }

  const filePath = activeEditor.document.fileName;
  const workspaceFolder = vscode.workspace.getWorkspaceFolder(activeEditor.document.uri);
  
  if (!workspaceFolder) return;

  const relativePath = path.relative(workspaceFolder.uri.fsPath, filePath);

  try {
    await callServer('/api/locks', {
      path: relativePath,
      lock: false,
      agentId: 'vscode-extension'
    });
    
    vscode.window.showInformationMessage(`🔓 File unlocked: ${path.basename(filePath)}`);
  } catch (error) {
    vscode.window.showErrorMessage(`Failed to unlock file: ${error}`);
  }
}