// A minimal proxy server for Replit
const http = require('http');

// Create simple HTTP server
http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Proxy server running on port 5000');
}).listen(5000, '0.0.0.0', () => {
  console.log('Simple proxy server running on port 5000');
});