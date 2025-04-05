#!/usr/bin/env node

// Script to start the application within Replit's workflow
console.log('Starting Cabo Travel Platform on port 5000...');

// Set environment variables
process.env.PORT = '5000';

// Start Next.js
const { spawn } = require('child_process');
const nextProcess = spawn('npx', ['next', 'dev', '-p', '5000'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    PORT: '5000',
  }
});

// Handle errors
nextProcess.on('error', (error) => {
  console.error(`Error starting Next.js: ${error.message}`);
  process.exit(1);
});

// Handle unexpected exits
nextProcess.on('exit', (code) => {
  if (code !== 0) {
    console.error(`Next.js exited with code ${code}`);
    process.exit(code || 1);
  }
});

// Handle termination
['SIGINT', 'SIGTERM'].forEach(signal => {
  process.on(signal, () => {
    console.log(`Received ${signal}, shutting down...`);
    nextProcess.kill();
    process.exit(0);
  });
});