#!/usr/bin/env node

/**
 * Script to start the application on port 5000
 * This is required for Replit to properly detect the running application
 */

require('dotenv').config();
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { spawn } = require('child_process');
const path = require('path');

// Port that Next.js will run on internally
const NEXT_PORT = 3000;
// Port that we'll expose to Replit
const REPLIT_PORT = 5000;

// Create Express server for proxying
const app = express();

// Configure proxy middleware
const proxyOptions = {
  target: `http://localhost:${NEXT_PORT}`,
  changeOrigin: true,
  pathRewrite: {
    '^/api': '/api', // keep /api prefix
  },
  ws: true, // proxy websockets
  logLevel: 'silent' // reduce noise
};

// Add proxy middleware to handle all requests
app.use('/', createProxyMiddleware(proxyOptions));

// Start proxy server on port 5000
const server = app.listen(REPLIT_PORT, () => {
  console.log(`✅ Proxy server running on port ${REPLIT_PORT}`);
  console.log(`✅ Forwarding requests to Next.js on port ${NEXT_PORT}`);
});

// Start Next.js application
console.log('Starting Next.js application...');
const nextApp = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    PORT: NEXT_PORT
  }
});

// Handle exit signals
process.on('SIGINT', () => {
  console.log('Shutting down servers...');
  server.close();
  nextApp.kill('SIGINT');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Shutting down servers...');
  server.close();
  nextApp.kill('SIGTERM');
  process.exit(0);
});

// Handle Next.js process ending
nextApp.on('close', (code) => {
  console.log(`Next.js process exited with code ${code}`);
  server.close();
  process.exit(code);
});