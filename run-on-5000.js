/**
 * Script to start the application on port 5000
 * This is required for Replit to properly detect the running application
 */

const { spawn } = require('child_process');
const httpProxy = require('http-proxy');
const http = require('http');

// Configuration
const NEXT_PORT = 3000;  // Default Next.js port
const PROXY_PORT = 5000; // Public port for Replit

console.log('Starting Next.js application...');

// Start Next.js
const nextProcess = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  env: { ...process.env, PORT: NEXT_PORT },
});

// Set up Proxy Server
const proxy = httpProxy.createProxyServer({
  target: `http://localhost:${NEXT_PORT}`,
  ws: true, // Enable WebSocket proxying
});

// Create HTTP Server
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
  
  // Forward requests to Next.js
  proxy.web(req, res, {}, (err) => {
    console.error('Proxy error:', err);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Proxy error: ' + err.message);
  });
});

// Handle WebSocket connections
server.on('upgrade', (req, socket, head) => {
  proxy.ws(req, socket, head);
});

// Initialize the proxy server
setTimeout(() => {
  server.listen(PROXY_PORT, '0.0.0.0', () => {
    console.log(`Proxy server running on port ${PROXY_PORT}`);
    console.log(`Forwarding requests to Next.js on port ${NEXT_PORT}`);
    
    // Get the domain
    const domain = process.env.REPL_SLUG && process.env.REPL_OWNER
      ? `${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`
      : `localhost:${PROXY_PORT}`;
      
    console.log(`\nAccess your app at: https://${domain}`);
  });
}, 3000); // Give Next.js a few seconds to start up

// Handle graceful shutdown
function cleanup() {
  console.log('Shutting down...');
  
  if (nextProcess && nextProcess.pid) {
    process.kill(nextProcess.pid);
  }
  
  if (server) {
    server.close();
  }
  
  process.exit(0);
}

// Set up signal handlers
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);