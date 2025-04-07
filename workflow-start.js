/**
 * Replit Workflow Combined Starter
 * This script starts both a proxy on port 5000 and Next.js
 */

const { spawn } = require('child_process');
const http = require('http');
const httpProxy = require('http-proxy');

// First, start the proxy immediately
const NEXT_PORT = 3000;
const PROXY_PORT = 5000;
const PROXY_HOST = '0.0.0.0';

// Create proxy server (must be first so Replit detects port 5000)
const proxy = httpProxy.createProxyServer({
  target: `http://localhost:${NEXT_PORT}`,
  ws: true
});

// Handle proxy errors silently to prevent crashes
proxy.on('error', (err) => {
  // Suppress verbose error output
});

// Create HTTP server
const server = http.createServer((req, res) => {
  proxy.web(req, res);
});

// Handle WebSocket connections
server.on('upgrade', (req, socket, head) => {
  proxy.ws(req, socket, head);
});

// Start the proxy server immediately
server.listen(PROXY_PORT, PROXY_HOST, () => {
  console.log(`📡 Proxy running on port ${PROXY_PORT}`);

  // Now start Next.js
  const nextProcess = spawn('npx', ['next', 'dev'], {
    stdio: 'inherit',
    env: { ...process.env, PORT: NEXT_PORT }
  });

  // Handle cleanup on exit
  function cleanup() {
    if (nextProcess && !nextProcess.killed) {
      nextProcess.kill();
    }
    server.close();
    process.exit(0);
  }

  // Handle termination signals
  process.on('SIGINT', cleanup);
  process.on('SIGTERM', cleanup);

  // Handle Next.js process exit
  nextProcess.on('exit', (code) => {
    console.log(`Next.js exited with code ${code}`);
    cleanup();
  });
});