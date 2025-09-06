import * as vscode from 'vscode';

export async function callServer(path: string, body: any): Promise<any> {
  const config = vscode.workspace.getConfiguration('claude-coordination');
  const baseUrl = config.get<string>('serverUrl') || 'http://localhost:8080';
  
  const url = `${baseUrl}${path}`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': 'Bearer dev-token' // TODO: Implement proper JWT
      },
      body: JSON.stringify(body)
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`Server error ${response.status}: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API call failed:', error);
    throw error instanceof Error ? error : new Error('Unknown API error');
  }
}