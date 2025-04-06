/**
 * A simple proxy server that forwards requests from port 5000 to port 3000 (Next.js default)
 * This allows Replit to detect the application properly while Next.js runs on its default port
 */

const http = require('http');
const httpProxy = require('http-proxy');

// Create and configure the proxy
const proxy = httpProxy.createProxyServer({
  target: 'http://localhost:3000',
  ws: true // Required for WebSocket support (hot module reloading)
});

// Handle proxy errors
proxy.on('error', (err, req, res) => {
  console.error('Proxy error:', err);
  if (res.writeHead) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Proxy error: ' + err.message);
  }
});

// Create the server
const server = http.createServer((req, res) => {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  // Forward the request to Next.js
  proxy.web(req, res);
});

// Handle WebSocket connections (needed for Next.js hot reloading)
server.on('upgrade', (req, socket, head) => {
  proxy.ws(req, socket, head);
});

// Start the proxy server
server.listen(5000, '0.0.0.0', () => {
  console.log('Proxy server running on port 5000');
  console.log('Forwarding requests to Next.js on port 3000');
});

// Ensure the process stays alive
setInterval(() => {}, 1000 * 60 * 60);

// Handle clean shutdown
process.on('SIGINT', () => {
  server.close(() => {
    console.log('Proxy server shut down');
    process.exit(0);
  });
});