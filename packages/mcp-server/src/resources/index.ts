#!/usr/bin/env node

/**
 * MCP Server Resources Setup
 * Configures available resources for the MCP server
 */

export function setupResources() {
  const resources = [
    {
      uri: 'coordination://status',
      name: 'Coordination Status',
      description: 'Current coordination status and active agents'
    },
    {
      uri: 'coordination://agents',
      name: 'Agent Pool',
      description: 'Available AI agents and their capabilities'
    }
  ];
  
  console.log('📚 Resources configured:', resources.length);
  return resources;
}

export default setupResources;