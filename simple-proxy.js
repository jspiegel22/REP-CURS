/**
 * Simple proxy for Replit that starts both Next.js and an HTTP proxy
 * Combined script that handles everything in one file
 */

const { spawn } = require('child_process');
const http = require('http');
const httpProxy = require('http-proxy');

// Configuration
const NEXT_PORT = 3000;  // Default Next.js port
const PROXY_PORT = 5000; // Public port for Replit

console.log('Starting Next.js application...');

// Start Next.js
const nextProcess = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  env: { ...process.env, PORT: NEXT_PORT },
});

console.log(`Started Next.js (PID: ${nextProcess.pid})`);

// Wait a bit for Next.js to initialize
setTimeout(() => {
  console.log('Setting up proxy server...');
  
  // Create proxy server
  const proxy = httpProxy.createProxyServer({
    target: `http://localhost:${NEXT_PORT}`,
    ws: true
  });
  
  // Handle proxy errors
  proxy.on('error', (err, req, res) => {
    console.error('Proxy error:', err);
    if (res.writeHead) {
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
}, 5000); // Give Next.js 5 seconds to start

// Handle cleanup when script is terminated
function shutdown() {
  console.log('Shutting down...');
  
  if (nextProcess) {
    console.log(`Killing Next.js process (PID: ${nextProcess.pid})`);
    process.kill(nextProcess.pid);
  }
  
  process.exit(0);
}

// Set up signal handlers
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);