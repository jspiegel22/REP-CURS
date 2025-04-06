/**
 * Workflow wrapper script to start both the Next.js app and proxy server
 * This script is used as an entry point for the Replit workflow
 */
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

console.log('Starting combined servers for the Cabo Travel Platform...');

// Start the Next.js dev server and proxy server
require('./start-combined-servers.js');

// Log success message
console.log('Servers started successfully. The application is available at:');
console.log(`https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`);