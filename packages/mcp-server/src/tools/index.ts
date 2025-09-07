#!/usr/bin/env node

/**
 * MCP Server Tools Setup
 * Configures available tools for the MCP server
 */

export function setupTools() {
  const tools = [
    {
      name: 'assign-task',
      description: 'Assign a task to an AI agent',
      inputSchema: {
        type: 'object',
        properties: {
          task: { type: 'string' },
          agentType: { type: 'string' }
        }
      }
    },
    {
      name: 'quality-check',
      description: 'Run quality checks on code',
      inputSchema: {
        type: 'object',
        properties: {
          code: { type: 'string' }
        }
      }
    }
  ];
  
  console.log('🔧 Tools configured:', tools.length);
  return tools;
}

export default setupTools;