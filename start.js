// Unified startup script that starts Next.js and the proxy
const { spawn } = require('child_process');

console.log('Starting application servers...');

// Start Next.js
const nextProcess = spawn('npx', ['next', 'dev'], {
  stdio: 'inherit'
});

// Give Next.js time to start
setTimeout(() => {
  // Start proxy server
  require('./index');
}, 5000);

// Handle termination signals
process.on('SIGINT', () => {
  nextProcess.kill();
  process.exit(0);
});

process.on('SIGTERM', () => {
  nextProcess.kill();
  process.exit(0);
});