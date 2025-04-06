/**
 * Combined service starter for Replit environment
 * This script starts Next.js and the proxy server in a single process
 */
const { spawn } = require('child_process');
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

// Create Express server for the proxy
const app = express();
const PORT = 5000;

// Create proxy middleware
const proxy = createProxyMiddleware({
  target: 'http://localhost:3000',
  changeOrigin: true,
  ws: true,
  onProxyRes: (proxyRes, req, res) => {
    console.log(`[PROXY] ${req.method} ${req.url} -> ${proxyRes.statusCode}`);
  }
});

// Forward all requests to port 3000
app.use('/', proxy);

// Start Next.js in a child process
console.log('Starting Next.js development server...');
const nextProcess = spawn('npx', ['next', 'dev'], {
  stdio: 'pipe' // Pipe the stdout/stderr to this process
});

// Pipe the Next.js logs to our console
nextProcess.stdout.on('data', (data) => {
  process.stdout.write(`[NEXT] ${data}`);
});

nextProcess.stderr.on('data', (data) => {
  process.stderr.write(`[NEXT-ERR] ${data}`);
});

// Wait a moment for Next.js to start
setTimeout(() => {
  // Start proxy server
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Proxy server running on port ${PORT}`);
    console.log(`Forwarding all requests to Next.js on port 3000`);
  });
}, 5000); // Give Next.js 5 seconds to start

// Handle process termination
function cleanup() {
  console.log('Shutting down servers...');
  if (nextProcess) {
    nextProcess.kill();
  }
  process.exit(0);
}

// Handle termination signals
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);