#!/usr/bin/env node
/**
 * 🇳🇴 Krins CLI - Nordic AI Development Coordination
 * Entry point for the Krins command interface
 */

import MagicCLI from './magic-cli';

// Create and run the CLI with Krins branding
const cli = new MagicCLI();

console.log(`
🇳🇴 Krins - Nordic AI Development Coordination
Powered by Magic CLI v3.0.0
`);

cli.run().catch(error => {
  console.error('💥 Krins CLI Fatal Error:', error.message);
  process.exit(1);
});