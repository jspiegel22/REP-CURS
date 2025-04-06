/**
 * Ultra-simple proxy that binds to port 5000 and forwards to Next.js
 * This uses minimal dependencies and should work reliably in Replit
 */
const http = require('http');
const net = require('net');
const url = require('url');

// Create server
const server = http.createServer((req, res) => {
  // Parse the request URL
  const options = url.parse(req.url);
  
  // Set the target to forward to
  options.hostname = 'localhost';
  options.port = 3000;
  options.path = req.url;
  options.method = req.method;
  options.headers = req.headers;
  
  // Create a proxy request
  const proxyReq = http.request(options, (proxyRes) => {
    // Set status code and headers
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    
    // Pipe the response data
    proxyRes.pipe(res);
  });
  
  // Forward the request body
  req.pipe(proxyReq);
  
  // Handle errors
  proxyReq.on('error', (err) => {
    console.error('Proxy error:', err);
    res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Proxy error: ' + err.message);
  });
});

// Listen on port 5000
server.listen(5000, '0.0.0.0', () => {
  console.log('Direct proxy server running on port 5000');
  console.log('Forwarding all requests to Next.js on port 3000');
});