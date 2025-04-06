// Full proxy server for Replit that forwards to Next.js
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const http = require('http');

// Create Express server
const app = express();
const PORT = 5000;

// Create proxy middleware
const proxy = createProxyMiddleware({
  target: 'http://localhost:3000',
  changeOrigin: true,
  ws: true,
  onProxyReq: (proxyReq, req, res) => {
    // Logging to help with debugging
    console.log(`Proxying ${req.method} ${req.url} to Next.js`);
  }
});

// Use the proxy for all routes
app.use('/', proxy);

// Create HTTP server
const server = http.createServer(app);

// Start the server
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Full proxy server running on port ${PORT}`);
  console.log(`Forwarding all requests to Next.js on port 3000`);
});