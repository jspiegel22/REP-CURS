/**
 * Custom development starter for Replit environment
 * This script starts Next.js on port 3000 and forwards port 5000 to it
 */

const { spawn } = require('child_process');
const http = require('http');
const httpProxy = require('http-proxy');
const fs = require('fs');
const path = require('path');

// Configuration
const NEXT_PORT = 3000;  // Default Next.js port
const PROXY_PORT = 5000; // Port Replit needs

// Log function with timestamp
function log(message) {
  const timestamp = new Date().toISOString();
  console.log(`[${timestamp}] ${message}`);
}

// Start Next.js
function startNextJs() {
  log('Starting Next.js development server...');
  
  const nextProcess = spawn('npx', ['next', 'dev'], {
    stdio: 'inherit',
    env: { ...process.env, PORT: NEXT_PORT }
  });
  
  nextProcess.on('error', (err) => {
    log(`Failed to start Next.js: ${err.message}`);
    process.exit(1);
  });
  
  nextProcess.on('close', (code) => {
    if (code !== 0 && code !== null) {
      log(`Next.js process exited with code ${code}`);
      process.exit(code);
    }
  });
  
  return nextProcess;
}

// Create and start the proxy server
function startProxyServer() {
  // Create a proxy server instance
  const proxy = httpProxy.createProxyServer({
    target: `http://localhost:${NEXT_PORT}`,
    ws: true, // Enable WebSocket proxying for hot reload
  });
  
  // Handle proxy errors
  proxy.on('error', (err, req, res) => {
    log(`Proxy error: ${err.message}`);
    
    if (res.writeHead) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Proxy error occurred');
    }
  });
  
  // Create HTTP server
  const server = http.createServer((req, res) => {
    // Add CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }
    
    // Log incoming requests
    log(`${req.method} ${req.url}`);
    
    // Forward to Next.js
    proxy.web(req, res);
  });
  
  // Handle WebSocket connections
  server.on('upgrade', (req, socket, head) => {
    proxy.ws(req, socket, head);
  });
  
  // Start the proxy server
  server.listen(PROXY_PORT, '0.0.0.0', () => {
    log(`Proxy server running on port ${PROXY_PORT}`);
    log(`Forwarding to Next.js at http://localhost:${NEXT_PORT}`);
    
    // Log a URL to access the app
    const domain = process.env.REPL_SLUG && process.env.REPL_OWNER
      ? `${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`
      : `localhost:${PROXY_PORT}`;
    
    log(`Access your app at: https://${domain}`);
  });
  
  return server;
}

// Check if Next.js is running
function checkNextJsStatus() {
  return new Promise((resolve, reject) => {
    const req = http.request({
      hostname: 'localhost',
      port: NEXT_PORT,
      path: '/',
      method: 'HEAD',
      timeout: 1000
    }, (res) => {
      if (res.statusCode >= 200 && res.statusCode < 500) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
    
    req.on('error', () => resolve(false));
    req.on('timeout', () => {
      req.destroy();
      resolve(false);
    });
    
    req.end();
  });
}

// Wait for Next.js to be ready
async function waitForNextJs() {
  log('Waiting for Next.js to be ready...');
  
  for (let i = 0; i < 60; i++) {
    const isReady = await checkNextJsStatus();
    if (isReady) {
      log('Next.js is ready!');
      return true;
    }
    
    // Wait 1 second before checking again
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  log('Timed out waiting for Next.js to be ready');
  return false;
}

// Main function
async function main() {
  log('Starting development environment for Replit...');
  
  // Start Next.js
  const nextProcess = startNextJs();
  
  // Wait for Next.js to be ready
  await waitForNextJs();
  
  // Start the proxy server
  const proxyServer = startProxyServer();
  
  // Handle graceful shutdown
  function shutdown() {
    log('Shutting down...');
    
    // Kill the Next.js process
    if (nextProcess && nextProcess.pid) {
      process.kill(nextProcess.pid);
    }
    
    // Close the proxy server
    if (proxyServer) {
      proxyServer.close();
    }
    
    process.exit(0);
  }
  
  // Set up signal handlers
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

// Run the main function
main().catch(err => {
  log(`Error: ${err.message}`);
  process.exit(1);
});