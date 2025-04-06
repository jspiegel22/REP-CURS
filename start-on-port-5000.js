/**
 * Script to start the application on port 5000
 * This is required for Replit to properly detect the running application
 */
const { spawn } = require('child_process');
const path = require('path');

// Spawn the next dev process with the port 5000 argument
const nextProcess = spawn('npx', ['next', 'dev', '-p', '5000'], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, PORT: '5000' }
});

// Handle process events
nextProcess.on('error', (err) => {
  console.error('Failed to start Next.js process:', err);
  process.exit(1);
});

nextProcess.on('close', (code) => {
  console.log(`Next.js process exited with code ${code}`);
  process.exit(code);
});

// Ensure clean shutdown on termination signals
function shutdown() {
  console.log('Shutting down gracefully...');
  nextProcess.kill();
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

console.log('Starting Next.js application on port 5000...');