/**
 * Ultra-simple proxy that binds to port 5000 and forwards to Next.js
 * This uses minimal dependencies and should work reliably in Replit
 */
const http = require('http');
const httpProxy = require('http-proxy');

// Create a proxy server with custom application logic
const proxy = httpProxy.createProxyServer({});

// Error handling
proxy.on('error', function(err, req, res) {
  console.error('Proxy error:', err);
  res.writeHead(500, {
    'Content-Type': 'text/plain'
  });
  res.end('Proxy error: ' + err.message);
});

// Create the server
const server = http.createServer(function(req, res) {
  // Define the target
  const target = 'http://localhost:3000';
  
  console.log(`Proxying request: ${req.method} ${req.url} -> ${target}`);
  
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  
  // Handle OPTIONS method for CORS preflight
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  // Forward the request to the target server
  proxy.web(req, res, { target: target });
});

// Start the server
const PORT = process.env.PORT || 5000;
server.listen(PORT, '0.0.0.0', function() {
  console.log(`Proxy server running on port ${PORT}`);
  console.log(`Forwarding to Next.js at http://localhost:3000`);
  console.log(`Access your app at: https://${process.env.REPLIT_SLUG}.${process.env.REPLIT_OWNER}.repl.co`);
});