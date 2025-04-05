// Simple HTTP proxy to forward requests from port 5000 to 3000
const { createProxyMiddleware } = require('http-proxy-middleware');
const express = require('express');
const app = express();

// Configuration
const PORT = 5000;
const TARGET = 'http://localhost:3000';

console.log(`🔄 Setting up proxy server on port ${PORT} -> ${TARGET}`);

// Proxy all requests
app.use('/', createProxyMiddleware({ 
  target: TARGET,
  changeOrigin: true,
  ws: true, // Support WebSockets
  logLevel: 'debug'
}));

// Start the proxy
app.listen(PORT, () => {
  console.log(`🚀 Proxy server running on port ${PORT} -> ${TARGET}`);
  console.log(`👉 Access your application at http://localhost:${PORT}`);
});