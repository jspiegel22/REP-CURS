// Simple proxy server for Replit
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const http = require('http');

// Create Express server
const app = express();
const PORT = 5000;

// Initial status route to respond immediately
app.get('/status', (req, res) => {
  res.send('Proxy server is running');
});

// Create proxy middleware
const proxy = createProxyMiddleware({
  target: 'http://localhost:3000',
  changeOrigin: true,
  ws: true
});

// Use the proxy for all other routes
app.use('/', proxy);

// Create HTTP server
const server = http.createServer(app);

// Start the server
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Proxy server running on port ${PORT}`);
});