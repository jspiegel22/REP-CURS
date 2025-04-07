/**
 * Ultra-simple Replit direct proxy for guaranteed website visibility
 * This script creates a direct proxy on port 5000 to port 3000
 */
const http = require('http');
const httpProxy = require('http-proxy');
const { spawn } = require('child_process');

// Always open port 5000 immediately to ensure Replit detects the app
const proxy = httpProxy.createProxyServer({});
const PORT = 5000;
const TARGET_PORT = 3000;

// Create the proxy server
const proxyServer = http.createServer((req, res) => {
  console.log(`📨 Forwarding request: ${req.method} ${req.url}`);
  
  // Add CORS headers for API routes
  if (req.url.startsWith('/api/')) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With, Content-Type, Authorization');
    
    // Handle preflight requests
    if (req.method === 'OPTIONS') {
      res.writeHead(200);
      res.end();
      return;
    }
  }
  
  // Forward the request to the target
  proxy.web(req, res, { 
    target: `http://localhost:${TARGET_PORT}`,
    changeOrigin: true
  }, (err) => {
    console.error(`❌ Proxy error: ${err.message}`);
    res.writeHead(502);
    res.end('Proxy Error: Application is starting...');
  });
});

// Start the proxy server immediately
proxyServer.listen(PORT, () => {
  console.log(`🚀 Proxy server running on port ${PORT}`);
});

// Start the Next.js development server
console.log('📦 Starting Next.js development server...');
const nextServer = spawn('npm', ['run', 'dev'], { stdio: 'inherit' });

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('Shutting down...');
  nextServer.kill();
  proxyServer.close();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Shutting down...');
  nextServer.kill();
  proxyServer.close();
  process.exit(0);
});