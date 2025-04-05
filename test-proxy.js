const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/plain' });
  res.end('Proxy test is working!');
});

server.listen(5001, '0.0.0.0', () => {
  console.log('Test server running on port 5001');
});