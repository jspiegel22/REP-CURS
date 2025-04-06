/**
 * A simple proxy server that forwards requests from port 5000 to port 3000 (Next.js default)
 * This allows Replit to detect the application properly while Next.js runs on its default port
 */
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

// Configuration
const PORT = 5000;
const TARGET = 'http://localhost:3000';

// Create Express server
const app = express();

// Proxy options
const options = {
  target: TARGET,
  changeOrigin: true,
  ws: true, // proxy websockets
  pathRewrite: {
    '^/': '/' // remove path prefix if needed
  },
  // Add error handling
  onError: (err, req, res) => {
    console.error('Proxy error:', err);
    res.writeHead(500, {
      'Content-Type': 'text/plain'
    });
    res.end('Something went wrong with the proxy.');
  },
  // Log proxy activity
  onProxyReq: (proxyReq, req, res) => {
    console.log(`Proxying ${req.method} request to: ${req.url}`);
  }
};

// Create the proxy middleware
const proxy = createProxyMiddleware(options);

// Apply the proxy to all routes
app.use('/', proxy);

// Start the server - bind to 0.0.0.0 to make it accessible from outside
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Proxy server running on http://0.0.0.0:${PORT}`);
  console.log(`Forwarding requests to ${TARGET}`);
});