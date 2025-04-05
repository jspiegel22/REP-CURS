const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const { spawn } = require('child_process');

// Define ports
const PORT = process.env.PORT || 5000;
const NEXT_PORT = 3000;

console.log('Starting the Cabo Travel Platform...');

// Start Next.js in a separate process
console.log('Starting Next.js server...');
const nextProcess = spawn('npx', ['next', 'dev', '-p', NEXT_PORT], {
  stdio: 'inherit',
  env: { ...process.env, PORT: NEXT_PORT.toString() }
});

// Create Express proxy server
const app = express();

// Basic middleware
app.use(express.json());

// Use middleware for API proxying
app.use('/api', createProxyMiddleware({
  target: `http://localhost:${PORT + 1}`, // The Express API server runs on PORT + 1
  changeOrigin: true
}));

// Proxy all other requests to Next.js
app.use(createProxyMiddleware({
  target: `http://localhost:${NEXT_PORT}`,
  changeOrigin: true,
  ws: true
}));

// Start Express API server in a separate process
console.log('Starting API server...');
const apiProcess = spawn('node', ['server/index.js'], {
  stdio: 'inherit',
  env: { ...process.env, PORT: (PORT + 1).toString() }
});

// Start the proxy server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Proxy server running at http://0.0.0.0:${PORT}`);
  console.log(`Proxying frontend requests to Next.js at http://localhost:${NEXT_PORT}`);
  console.log(`Proxying API requests to Express at http://localhost:${PORT + 1}`);
});

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down servers...');
  nextProcess.kill();
  apiProcess.kill();
  process.exit(0);
});