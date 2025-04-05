// Proxy server for Replit to bridge Next.js (3000) with Replit's expected port (5000)
const { createServer } = require('http');
const { spawn } = require('child_process');
const { createProxyServer } = require('http-proxy');

// Create a proxy server instance
const proxy = createProxyServer({});

// Start the Next.js app
console.log('Starting Next.js application...');
const nextApp = spawn('npm', ['run', 'dev']);

// Log output from the Next.js process
nextApp.stdout.on('data', (data) => {
  console.log(`[Next.js] ${data.toString().trim()}`);
});

nextApp.stderr.on('data', (data) => {
  console.error(`[Next.js Error] ${data.toString().trim()}`);
});

// Create a server that proxies requests to the Next.js app on port 3000
const server = createServer((req, res) => {
  // Proxy the request to port 3000
  proxy.web(req, res, { target: 'http://localhost:3000' }, (err) => {
    console.error('Proxy error:', err);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Proxy error: ' + err.message);
  });
});

// Handle proxy errors
proxy.on('error', (err, req, res) => {
  console.error('Proxy error:', err);
  res.writeHead(500, { 'Content-Type': 'text/plain' });
  res.end('Proxy error: ' + err.message);
});

// Listen on port 5000 as expected by Replit
const PORT = 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Proxy server running at http://0.0.0.0:${PORT}`);
  console.log(`Forwarding requests to Next.js on port 3000`);
});

// Handle termination signals
process.on('SIGINT', () => {
  console.log('Shutting down...');
  nextApp.kill();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Shutting down...');
  nextApp.kill();
  process.exit(0);
});