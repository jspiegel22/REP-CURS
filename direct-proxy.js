/**
 * Ultra-simple proxy that binds to port 5000 and forwards to Next.js
 * This uses minimal dependencies and should work reliably in Replit
 */

const http = require('http');
const httpProxy = require('http-proxy');

// Configuration
const TARGET_PORT = 3000;  // Default Next.js port
const PROXY_PORT = 5000;   // Port Replit needs

// Create a proxy server instance
const proxy = httpProxy.createProxyServer({
  target: `http://localhost:${TARGET_PORT}`,
  ws: true, // Enable WebSocket proxying for hot reload
});

// Handle proxy errors
proxy.on('error', (err, req, res) => {
  console.error('Proxy error:', err);
  
  if (res.writeHead) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Proxy error occurred');
  }
});

// Create the server
const server = http.createServer((req, res) => {
  // Add CORS headers for cross-origin requests
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  
  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  // Forward the request to the target server
  proxy.web(req, res);
});

// Handle WebSocket upgrade requests for hot module reloading
server.on('upgrade', (req, socket, head) => {
  proxy.ws(req, socket, head);
});

// Start the server on port 5000
server.listen(PROXY_PORT, '0.0.0.0', () => {
  console.log(`Proxy server running on port ${PROXY_PORT}`);
  console.log(`Forwarding to Next.js at http://localhost:${TARGET_PORT}`);
  
  // Log a URL to access the app
  const domain = process.env.REPL_SLUG && process.env.REPL_OWNER
    ? `${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`
    : 'localhost:5000';
  
  console.log(`Access your app at: https://${domain}`);
});