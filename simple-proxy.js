// Enhanced proxy server for Replit
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const app = express();

// Create proxy middleware
const proxy = createProxyMiddleware({
  target: 'http://localhost:3000',
  changeOrigin: true,
  ws: true,
  onProxyRes: (proxyRes, req, res) => {
    // Add additional logging for debugging
    console.log(`[PROXY] ${req.method} ${req.url} -> ${proxyRes.statusCode}`);
  }
});

// Forward all requests to port 3000
app.use('/', proxy);

// Start server
app.listen(5000, '0.0.0.0', () => {
  console.log('Enhanced proxy server running on port 5000');
  console.log('Forwarding all requests to Next.js on port 3000');
});