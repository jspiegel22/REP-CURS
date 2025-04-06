/**
 * Combined server script for Replit
 * Runs both the Next.js server on port 3000 and proxy on port 5000
 */
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

// Store child processes to manage them later
const processes = [];

// Function to spawn a child process and handle its output
function spawnProcess(command, args, options = {}) {
  console.log(`Starting: ${command} ${args.join(' ')}`);
  
  const childProcess = spawn(command, args, {
    stdio: 'pipe',
    ...options
  });
  
  childProcess.stdout.on('data', (data) => {
    console.log(`[${command}] ${data.toString().trim()}`);
  });
  
  childProcess.stderr.on('data', (data) => {
    console.error(`[${command}] ${data.toString().trim()}`);
  });
  
  childProcess.on('close', (code) => {
    console.log(`[${command}] process exited with code ${code}`);
  });
  
  processes.push(childProcess);
  return childProcess;
}

// Handle shutdown gracefully
function shutdown() {
  console.log('Shutting down servers...');
  processes.forEach(process => {
    if (!process.killed) {
      process.kill();
    }
  });
  process.exit(0);
}

// Listen for termination signals
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// Start Next.js development server (port 3000)
spawnProcess('npx', ['next', 'dev']);

// Start the proxy server (port 5000)
spawnProcess('node', ['port-5000.js']);

console.log('Both servers are running!');
console.log('Next.js on port 3000, proxy on port 5000');
console.log(`App is available at: https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`);