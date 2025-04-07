/**
 * Simple Workflow Preview Server for Replit
 * 
 * This script:
 * 1. Creates an HTTP server on port 5000
 * 2. Forwards all requests to port 3000 (Next.js)
 * 3. Includes basic error handling
 * 
 * Usage: Run this script with "node workflow-preview.js"
 */

const http = require('http');
const { createProxyServer } = require('http-proxy');

// Port configuration
const FRONTEND_PORT = 3000;
const PROXY_PORT = 5000;

// Create HTTP proxy
const proxy = createProxyServer({
  target: `http://localhost:${FRONTEND_PORT}`,
  ws: true, // Enable WebSocket proxying for Next.js
  changeOrigin: true
});

// Log proxy errors but don't crash
proxy.on('error', (err, req, res) => {
  console.error('Proxy error:', err);
  if (!res.headersSent) {
    res.writeHead(502, { 'Content-Type': 'text/plain' });
    res.end('Proxy error: The application may still be starting up. Please try again in a moment.');
  }
});

// Create the HTTP server
const server = http.createServer((req, res) => {
  // Add CORS headers for development
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  
  // Handle OPTIONS method directly for CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  // Log the request
  console.log(`Proxying: ${req.method} ${req.url}`);
  
  // Forward request to Next.js
  proxy.web(req, res, {}, (err) => {
    console.error('Failed to proxy request:', err);
    if (!res.headersSent) {
      res.writeHead(502, { 'Content-Type': 'text/plain' });
      res.end('Service unavailable. The application is starting up or has crashed. Please try refreshing.');
    }
  });
});

// Also handle WebSocket requests
server.on('upgrade', (req, socket, head) => {
  proxy.ws(req, socket, head, (err) => {
    console.error('WebSocket proxy error:', err);
    socket.destroy();
  });
});

// Start the server
server.listen(PROXY_PORT, () => {
  console.log(`🚀 Preview proxy server running at http://localhost:${PROXY_PORT}`);
  console.log(`✅ Forwarding all requests to http://localhost:${FRONTEND_PORT}`);
  console.log(`🌐 Open your app in the Replit webview`);
});

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down preview server...');
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});