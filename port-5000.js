/**
 * A simple proxy server that forwards requests from port 5000 to port 3000 (Next.js default)
 * This allows Replit to detect the application properly while Next.js runs on its default port
 */
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 5000;
const TARGET = 'http://localhost:3000';

// Configuration for the proxy
const proxyOptions = {
  target: TARGET,
  changeOrigin: true,
  ws: true, // Enable WebSocket proxying
  pathRewrite: {
    '^/api': '/api', // keep /api paths as is
  },
  onError: (err, req, res) => {
    console.error('Proxy Error:', err);
    res.writeHead(502, {
      'Content-Type': 'text/plain',
    });
    res.end('Proxy Error: The Next.js server might not be running yet. Please try again in a moment.');
  },
  onProxyRes: (proxyRes, req, res) => {
    // Log proxy activity (for debugging)
    if (process.env.DEBUG) {
      console.log(`[PROXY] ${req.method} ${req.path} -> ${proxyRes.statusCode}`);
    }
  },
};

// Create the proxy middleware
const proxy = createProxyMiddleware(proxyOptions);

// Apply the proxy to all routes
app.use('/', proxy);

// Start the server
app.listen(PORT, () => {
  console.log(`Proxy server running on http://localhost:${PORT}`);
  console.log(`Forwarding requests to ${TARGET}`);
});