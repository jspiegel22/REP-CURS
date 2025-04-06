/**
 * Custom development starter for Replit environment
 * This script starts Next.js on port 3000 and forwards port 5000 to it
 */
const { spawn } = require('child_process');
const path = require('path');
const http = require('http');
const httpProxy = require('http-proxy');

// Configuration
const NEXT_PORT = 3000;
const PROXY_PORT = 5000; 
const NEXT_STARTUP_TIMEOUT = 15000; // 15 seconds wait time
const CHECK_INTERVAL = 500; // 500 ms

// Start Next.js
function startNextJs() {
  console.log('Starting Next.js server on port 3000...');
  
  const nextProc = spawn('npx', ['next', 'dev'], {
    env: { ...process.env, PORT: NEXT_PORT },
    stdio: 'inherit'
  });

  nextProc.on('error', (err) => {
    console.error('Failed to start Next.js server:', err);
    process.exit(1);
  });

  return nextProc;
}

// Start proxy server on port 5000
function startProxyServer() {
  console.log('Starting proxy server on port 5000...');
  
  // Create proxy server
  const proxy = httpProxy.createProxyServer({});
  
  // Error handling
  proxy.on('error', function(err, req, res) {
    console.error('Proxy error:', err);
    if (res.writeHead) {
      res.writeHead(500, { 'Content-Type': 'text/plain' });
      res.end('Proxy error: ' + err.message);
    }
  });
  
  // Create the server
  const server = http.createServer(function(req, res) {
    // Define the target
    const target = `http://localhost:${NEXT_PORT}`;
    
    // Add CORS headers
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
    
    // Handle OPTIONS method for CORS preflight
    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }
    
    // Forward the request to the target server
    proxy.web(req, res, { target: target });
  });
  
  // Start the server
  server.listen(PROXY_PORT, '0.0.0.0', function() {
    console.log(`Proxy server running on port ${PROXY_PORT}`);
    console.log(`Forwarding to Next.js at http://localhost:${NEXT_PORT}`);
    console.log(`Access your app at: https://${process.env.REPLIT_SLUG}.${process.env.REPLIT_OWNER}.repl.co`);
  });
  
  return server;
}

// Check if Next.js is running
function checkNextJsStatus() {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${NEXT_PORT}`, () => {
      resolve(true);
    }).on('error', () => {
      resolve(false);
    });
    req.setTimeout(1000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

// Wait for Next.js to be ready
async function waitForNextJs() {
  console.log('Waiting for Next.js to be ready...');
  
  const startTime = Date.now();
  
  while (Date.now() - startTime < NEXT_STARTUP_TIMEOUT) {
    const isRunning = await checkNextJsStatus();
    if (isRunning) {
      console.log('Next.js is ready! Starting proxy server...');
      return true;
    }
    await new Promise(resolve => setTimeout(resolve, CHECK_INTERVAL));
  }
  
  console.error(`Next.js failed to start within ${NEXT_STARTUP_TIMEOUT}ms`);
  return false;
}

// Main function
async function main() {
  // Start Next.js
  const nextProc = startNextJs();
  
  // Wait for Next.js to be ready
  const nextJsReady = await waitForNextJs();
  if (!nextJsReady) {
    console.error('Exiting due to Next.js startup failure');
    nextProc.kill();
    process.exit(1);
  }
  
  // Start proxy
  const proxyServer = startProxyServer();
  
  // Handle clean shutdown
  function shutdown() {
    console.log('Shutting down servers...');
    nextProc.kill();
    proxyServer.close();
    process.exit(0);
  }
  
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

// Start the servers
main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});