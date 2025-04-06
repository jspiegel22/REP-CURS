/**
 * Replit startup script
 * This script starts the application on port 5000 which is required by Replit
 */
const { spawn } = require('child_process');

console.log('Starting Next.js application for Replit on port 5000...');

// Spawn Next.js on port 5000
const nextProcess = spawn('npx', ['next', 'dev', '-p', '5000'], {
  stdio: 'inherit',
  shell: true,
  env: { ...process.env, PORT: '5000' }
});

// Handle errors
nextProcess.on('error', (err) => {
  console.error('Failed to start Next.js:', err);
  process.exit(1);
});

// Handle process exit
nextProcess.on('close', (code) => {
  console.log(`Next.js process exited with code ${code}`);
  process.exit(code);
});

// Handle termination signals
function shutdown() {
  console.log('Shutting down gracefully...');
  nextProcess.kill();
  process.exit(0);
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);