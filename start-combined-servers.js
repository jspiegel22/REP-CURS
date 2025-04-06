/**
 * Combined server script for Replit
 * Runs both the Next.js server on port 3000 and proxy on port 5000
 */
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Keep track of all child processes
const children = [];

function spawnProcess(command, args, options = {}) {
  const child = spawn(command, args, {
    stdio: 'inherit',
    shell: true,
    ...options
  });
  
  children.push(child);
  
  child.on('error', (error) => {
    console.error(`Error starting process: ${command}`, error);
  });
  
  return child;
}

// Handle graceful shutdown
function shutdown() {
  console.log('\nShutting down all processes...');
  
  // Send SIGTERM to all child processes
  children.forEach(child => {
    if (!child.killed) {
      child.kill();
    }
  });
  
  // Exit this process
  process.exit(0);
}

// Setup signal handlers
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
process.on('SIGHUP', shutdown);

console.log('Starting Next.js server on port 3000...');
spawnProcess('npm', ['run', 'dev']);

console.log('Starting proxy server on port 5000...');
spawnProcess('node', ['port-5000.js']);

console.log('All servers started. Press Ctrl+C to stop.');
console.log('Access the application at: https://' + process.env.REPL_SLUG + '.' + process.env.REPL_OWNER + '.repl.co');