/**
 * Fast Replit-Specific Proxy for Next.js
 * This script:
 * 1. Creates a proxy server on port 5000 immediately
 * 2. Then starts Next.js on port 3000
 */

const { spawn } = require('child_process');
const http = require('http');
const httpProxy = require('http-proxy');

// Constants
const NEXT_PORT = 3000;
const PROXY_PORT = 5000;
const PROXY_HOST = '0.0.0.0';

console.log('🚀 Starting Cabo Travel application on Replit...');

// Create proxy server immediately
console.log(`⏳ Setting up port ${PROXY_PORT} proxy for Next.js...`);
  
// Create proxy server
const proxy = httpProxy.createProxyServer({
  target: `http://localhost:${NEXT_PORT}`,
  ws: true,
  xfwd: true
});

// Handle proxy errors
proxy.on('error', (err, req, res) => {
  console.error(`❌ Proxy error: ${err.message}`);
  if (res && res.writeHead) {
    res.writeHead(502, { 'Content-Type': 'text/plain' });
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
    res.writeHead(204);
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

// Start the proxy server - this needs to happen FIRST for Replit to detect the app
server.listen(PROXY_PORT, PROXY_HOST, () => {
  console.log(`✅ Proxy server running on port ${PROXY_PORT}`);
  
  // Get the domain
  const domain = process.env.REPL_SLUG && process.env.REPL_OWNER
    ? `https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co`
    : `http://localhost:${PROXY_PORT}`;
    
  console.log(`\n🌐 App is now available at: ${domain}`);
  
  // Now start Next.js
  console.log('📦 Starting Next.js...');
  const nextProcess = spawn('npm', ['run', 'dev'], {
    stdio: 'pipe', // Capture stdout and stderr
    env: { ...process.env, PORT: NEXT_PORT }
  });

  // Handle Next.js output
  console.log(`✅ Next.js process started (PID: ${nextProcess.pid})`);

  nextProcess.stdout.on('data', (data) => {
    const output = data.toString().trim();
    console.log(`[Next.js] ${output}`);
  });

  nextProcess.stderr.on('data', (data) => {
    const output = data.toString().trim();
    console.error(`[Next.js Error] ${output}`);
  });

  // Set up error handler
  nextProcess.on('error', (error) => {
    console.error(`❌ Next.js failed to start: ${error.message}`);
    // Don't exit if proxy is already running
  });
  
  // Set up graceful shutdown
  function shutdown() {
    console.log('\n🛑 Shutting down...');
    
    // Kill Next.js process
    if (nextProcess && !nextProcess.killed) {
      console.log(`🛑 Stopping Next.js process (PID: ${nextProcess.pid})`);
      nextProcess.kill();
    }
    
    // Close the proxy server
    server.close(() => {
      console.log('🛑 Proxy server closed');
      process.exit(0);
    });
  }
  
  // Handle termination signals
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
});