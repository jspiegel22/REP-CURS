#!/usr/bin/env node

// Script to start the Cabo Travel Platform on port 5000
console.log('Starting Cabo Travel Platform on port 5000...');

// Set the port to 5000
process.env.PORT = '5000';

// Execute Next.js on port 5000
require('child_process').spawn('npx', ['next', 'dev', '-p', '5000'], {
  stdio: 'inherit',
  env: { ...process.env, PORT: '5000' }
});