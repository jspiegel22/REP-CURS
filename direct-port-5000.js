/**
 * Ultra-simple proxy that binds directly to port 5000 and forwards to Next.js
 */

const http = require('http');
const httpProxy = require('http-proxy');

// Configuration
const NEXT_PORT = 3000;
const PROXY_PORT = 5000;

console.log('Starting proxy server...');

// Create proxy server
const proxy = httpProxy.createProxyServer({
  target: `http://localhost:${NEXT_PORT}`,
  ws: true
});

// Handle proxy errors
proxy.on('error', (err, req, res) => {
  console.error('Proxy error:', err);
  if (res && res.writeHead) {
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Proxy error: ' + err.message);
  }
});

// Create server
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
  
  // Forward to Next.js
  proxy.web(req, res);
});

// Handle WebSocket connections
server.on('upgrade', (req, socket, head) => {
  proxy.ws(req, socket, head);
});

// Start the proxy server
server.listen(PROXY_PORT, '0.0.0.0', () => {
  console.log(`Proxy server running on port ${PROXY_PORT}`);
  console.log(`Forwarding requests to Next.js on port ${NEXT_PORT}`);
  
  // Get the domain
  const domain = process.env.REPL_SLUG && process.env.REPL_OWNER
    ? `${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`
    : `localhost:${PROXY_PORT}`;
    
  console.log(`\nAccess your app at: https://${domain}`);
});

// Handle cleanup when script is terminated
process.on('SIGINT', () => {
  console.log('Shutting down proxy...');
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Shutting down proxy...');
  process.exit(0);
});