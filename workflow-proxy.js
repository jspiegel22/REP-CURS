/**
 * Minimal Replit Workflow Proxy
 * This simple script creates a proxy on port 5000 that forwards to Next.js on port 3000
 * Designed specifically for Replit workflows to reliably detect the application
 */

const http = require('http');
const httpProxy = require('http-proxy');

// Constants
const NEXT_PORT = 3000;
const PROXY_PORT = 5000;
const PROXY_HOST = '0.0.0.0';

// Create proxy server
const proxy = httpProxy.createProxyServer({
  target: `http://localhost:${NEXT_PORT}`,
  ws: true
});

// Create HTTP server
const server = http.createServer((req, res) => {
  proxy.web(req, res);
});

// Handle WebSocket connections
server.on('upgrade', (req, socket, head) => {
  proxy.ws(req, socket, head);
});

// Start the proxy server
server.listen(PROXY_PORT, PROXY_HOST, () => {
  console.log(`✅ Proxy server running on port ${PROXY_PORT}`);
  console.log(`Forwarding to Next.js on port ${NEXT_PORT}`);
});

// Handle proxy errors silently to prevent crashes
proxy.on('error', (err) => {
  // Suppress error output in production
  if (process.env.NODE_ENV !== 'production') {
    console.error(`Proxy error: ${err.message}`);
  }
});

// Handle termination
process.on('SIGINT', () => process.exit(0));
process.on('SIGTERM', () => process.exit(0));