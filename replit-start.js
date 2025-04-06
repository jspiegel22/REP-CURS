/**
 * Replit workflow starter - Executes automatically when "Start application" runs
 * This script runs next dev and our proxy together to ensure the app works in Replit
 */

// Import required modules
const { spawn } = require('child_process');

// Start the development server with the proxy
console.log('Starting Cabo Travel Guide application...');

// We run the node script directly as this is what will be executed by the workflow
const proc = spawn('node', ['start-dev.js'], {
  stdio: 'inherit',  // Ensure we see all output
  env: process.env   // Pass all environment variables
});

// Handle process exit
proc.on('exit', (code) => {
  console.log(`start-dev.js exited with code ${code}`);
  process.exit(code);
});

// Handle errors
proc.on('error', (err) => {
  console.error('Failed to start application:', err);
  process.exit(1);
});

// Handle termination signals
function shutdown() {
  console.log('Shutting down application...');
  proc.kill();
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);