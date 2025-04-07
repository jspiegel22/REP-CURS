/**
 * Replit startup script for Next.js applications
 * Runs Next.js on port 3000 and creates a proxy on port 5000
 */

const { spawn } = require('child_process');
const http = require('http');
const httpProxy = require('http-proxy');

// Configuration
const NEXT_PORT = 3000;  // Next.js default port
const PROXY_PORT = 5000; // Replit expects this port

console.log('🚀 Starting Next.js application...');

// Start Next.js
const nextProcess = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  env: { ...process.env, PORT: NEXT_PORT }
});

console.log(`📦 Next.js process started (PID: ${nextProcess.pid})`);

// Wait for Next.js to initialize
setTimeout(() => {
  console.log('🔄 Initializing proxy server...');
  
  // Create a proxy server
  const proxy = httpProxy.createProxyServer({
    target: `http://localhost:${NEXT_PORT}`,
    ws: true // Enable WebSockets support
  });
  
  // Handle proxy errors
  proxy.on('error', (err, req, res) => {
    console.error('❌ Proxy error:', err);
    if (res.writeHead) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end(`Proxy error: ${err.message}`);
    }
  });
  
  // Create HTTP server
  const server = http.createServer((req, res) => {
    // Set CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, content-type');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }
    
    // Forward the request to Next.js
    proxy.web(req, res);
  });
  
  // Handle WebSocket connections
  server.on('upgrade', (req, socket, head) => {
    proxy.ws(req, socket, head);
  });
  
  // Start the proxy server
  server.listen(PROXY_PORT, '0.0.0.0', () => {
    console.log(`✅ Proxy server running on port ${PROXY_PORT}`);
    console.log(`↪️  Forwarding to Next.js on port ${NEXT_PORT}`);
    
    // Get the domain
    const domain = process.env.REPL_SLUG && process.env.REPL_OWNER
      ? `${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`
      : `localhost:${PROXY_PORT}`;
      
    console.log(`\n🌐 Access your app at: https://${domain}`);
  });
  
}, 5000); // Give Next.js 5 seconds to start

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down...');
  
  // Kill Next.js process
  if (nextProcess && nextProcess.pid) {
    process.kill(nextProcess.pid);
  }
  
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Terminating...');
  
  // Kill Next.js process
  if (nextProcess && nextProcess.pid) {
    process.kill(nextProcess.pid);
  }
  
  process.exit(0);
});