/**
 * Replit-specific development script
 * This script:
 * 1. Starts Next.js on port 3000
 * 2. Starts a proxy on port 5000 (the port Replit expects)
 */

console.log('🚀 Starting Replit development environment');
console.log('🔄 This script will start Next.js and a port 5000 proxy');

const { spawn } = require('child_process');
const http = require('http');
const httpProxy = require('http-proxy');

// Config
const NEXT_PORT = 3000;
const PROXY_PORT = 5000;

// Start Next.js
console.log('📦 Starting Next.js on port 3000...');
const nextProcess = spawn('npm', ['run', 'dev'], {
  stdio: ['ignore', 'pipe', 'pipe'],
  env: { ...process.env, PORT: NEXT_PORT }
});

// Handle Next.js output
nextProcess.stdout.on('data', (data) => {
  console.log(`Next.js: ${data.toString().trim()}`);
});

nextProcess.stderr.on('data', (data) => {
  console.error(`Next.js error: ${data.toString().trim()}`);
});

nextProcess.on('error', (error) => {
  console.error(`Failed to start Next.js: ${error.message}`);
  process.exit(1);
});

// Wait for Next.js to start before creating proxy
setTimeout(() => {
  console.log('🔄 Setting up proxy server on port 5000...');
  
  // Create proxy
  const proxy = httpProxy.createProxyServer({
    target: `http://localhost:${NEXT_PORT}`,
    ws: true
  });
  
  // Handle proxy errors
  proxy.on('error', (err, req, res) => {
    console.error(`❌ Proxy error: ${err.message}`);
    if (res && res.writeHead) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end(`Proxy error: ${err.message}`);
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
    
    // Forward to Next.js
    proxy.web(req, res);
  });
  
  // WebSocket support
  server.on('upgrade', (req, socket, head) => {
    proxy.ws(req, socket, head);
  });
  
  // Start proxy server
  server.listen(PROXY_PORT, '0.0.0.0', () => {
    console.log('✅ Proxy server running on port 5000');
    console.log(`✅ App is now available at: ${getAppUrl()}`);
  });
  
  // Get app URL helper
  function getAppUrl() {
    if (process.env.REPL_SLUG && process.env.REPL_OWNER) {
      return `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`;
    }
    return `http://localhost:${PROXY_PORT}`;
  }
  
  // Handle cleanup
  function cleanup() {
    console.log('🛑 Shutting down servers...');
    if (nextProcess && !nextProcess.killed) {
      nextProcess.kill();
    }
    process.exit(0);
  }
  
  // Set up signal handlers
  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);
  
}, 5000); // 5 second delay to let Next.js start