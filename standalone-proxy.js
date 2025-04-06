// Simplified standalone proxy that will run reliably on Replit
const http = require('http');
const httpProxy = require('http-proxy');

// Create a proxy server with custom settings
const proxy = httpProxy.createProxyServer({
  target: 'http://localhost:3000',
  ws: true
});

// Listen for the `error` event on the proxy
proxy.on('error', function (err, req, res) {
  console.error('Proxy error:', err);
  res.writeHead(500, {
    'Content-Type': 'text/plain'
  });
  res.end('Something went wrong with the proxy.');
});

// Create the server that uses the proxy
const server = http.createServer(function(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  
  // Handle the request
  proxy.web(req, res);
});

// Listen to the `upgrade` event and proxy websocket requests
server.on('upgrade', function (req, socket, head) {
  proxy.ws(req, socket, head);
});

// Start listening immediately
server.listen(5000, '0.0.0.0', () => {
  console.log('Proxy server running on port 5000');
  console.log('Forwarding all requests to Next.js on port 3000');
});