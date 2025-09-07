#!/usr/bin/env node

/**
 * MCP Server Prompts Setup
 * Configures available prompts for the MCP server
 */

export function setupPrompts() {
  const prompts = [
    {
      name: 'coordinate-task',
      description: 'Coordinate a development task across multiple AI agents',
      arguments: [
        {
          name: 'task',
          description: 'The development task to coordinate',
          required: true
        },
        {
          name: 'priority',
          description: 'Task priority (low, medium, high)',
          required: false
        }
      ]
    },
    {
      name: 'quality-gate',
      description: 'Run quality gate checks on code changes',
      arguments: [
        {
          name: 'changes',
          description: 'Code changes to validate',
          required: true
        }
      ]
    }
  ];
  
  console.log('💭 Prompts configured:', prompts.length);
  return prompts;
}

export default setupPrompts;