#!/bin/bash

# Start the Next.js server
echo "🚀 Starting Next.js application..."
npm run dev &
NEXT_PID=$!

# Wait a bit for the Next.js server to start
echo "⏳ Waiting for Next.js to start..."
sleep 5

# Start the proxy server
echo "🔄 Starting proxy server..."
node -e "
const http = require('http');
const { createProxyMiddleware } = require('http-proxy-middleware');

const PORT = 5000;
const TARGET = 'http://localhost:3000';

// Create proxy server
const proxy = http.createServer((req, res) => {
  createProxyMiddleware({ 
    target: TARGET,
    changeOrigin: true
  })(req, res);
});

// Start listening
proxy.listen(PORT, () => {
  console.log(\`🚀 Proxy server running on port \${PORT} -> \${TARGET}\`);
});
"

# Keep the script running
wait $NEXT_PID