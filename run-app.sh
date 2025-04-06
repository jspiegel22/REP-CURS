#!/bin/bash
# Startup script for the application
# Runs Next.js on port 3000 and starts the proxy on port 5000

# Start Next.js in the background
npm run dev &
NEXT_PID=$!

echo "Started Next.js with PID: $NEXT_PID"
echo "Waiting for Next.js to initialize..."

# Wait for Next.js to start
sleep 7

# Start the proxy server
echo "Starting proxy server on port 5000..."
node << 'EOF' &
const http = require('http');
const httpProxy = require('http-proxy');

// Create proxy server
const proxy = httpProxy.createProxyServer({
  target: 'http://localhost:3000',
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
  // CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  
  // Handle preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  // Forward to Next.js
  proxy.web(req, res);
});

// Handle WebSockets
server.on('upgrade', (req, socket, head) => {
  proxy.ws(req, socket, head);
});

// Start server
server.listen(5000, '0.0.0.0', () => {
  console.log('Proxy server running on port 5000');
  console.log('Forwarding to Next.js on port 3000');
});

// Keep script running
process.on('SIGINT', () => {
  console.log('Shutting down proxy...');
  server.close();
  process.exit(0);
});
EOF

PROXY_PID=$!
echo "Started proxy with PID: $PROXY_PID"

# Handle cleanup when script is terminated
function cleanup {
  echo "Cleaning up processes..."
  if ps -p $NEXT_PID > /dev/null; then
    echo "Killing Next.js process: $NEXT_PID"
    kill $NEXT_PID
  fi
  
  if ps -p $PROXY_PID > /dev/null; then
    echo "Killing proxy process: $PROXY_PID"
    kill $PROXY_PID
  fi
  
  exit 0
}

# Set up trap for cleanup
trap cleanup INT TERM

# Keep the script running
echo "Both services are running. Press Ctrl+C to stop."
wait