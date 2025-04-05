#!/usr/bin/env node

// This script starts Next.js on port 5000
console.log('Starting Next.js on port 5000...');

// Configure environment variables
process.env.PORT = '5000';

// Import and execute the start process
require('child_process').spawn('npx', ['next', 'dev', '-p', '5000'], {
  stdio: 'inherit',
  env: { ...process.env, PORT: '5000' }
}).on('error', (error) => {
  console.error('Failed to start Next.js:', error);
  process.exit(1);
});