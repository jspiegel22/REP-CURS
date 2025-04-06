const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const PORT = 5000;
const TARGET = 'http://localhost:3000';

// Create a proxy to forward all requests to the Next.js server
const proxy = createProxyMiddleware({
  target: TARGET,
  changeOrigin: true,
  ws: true
});

// Apply the proxy middleware to all routes
app.use('/', proxy);

// Start the server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Proxy server running on port ${PORT}`);
  console.log(`Forwarding requests to ${TARGET}`);
});