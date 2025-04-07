/**
 * Ultra-simple proxy for Replit that simply binds to port 5000 and forwards to 3000
 * No fancy detection, no complex logic - just works
 */

const http = require('http');
const { spawn } = require('child_process');

// Create a simple HTTP server that forwards all requests to Next.js
const server = http.createServer((req, res) => {
  // Set up the target options
  const options = {
    hostname: 'localhost',
    port: 3000,
    path: req.url,
    method: req.method,
    headers: req.headers,
  };
  
  // Create the forwarding request
  const proxy = http.request(options, (proxyRes) => {
    // Copy status code
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    
    // Stream the response data
    proxyRes.pipe(res);
  });
  
  // Handle request errors
  proxy.on('error', (e) => {
    console.error('Proxy request error:', e.message);
    res.writeHead(502, { 'Content-Type': 'text/html' });
    res.end(`
      <html>
        <head>
          <title>Application Starting...</title>
          <style>
            body { font-family: system-ui, sans-serif; padding: 2rem; text-align: center; line-height: 1.6; }
            .container { max-width: 600px; margin: 0 auto; }
            .spinner { display: inline-block; width: 50px; height: 50px; border: 3px solid rgba(0,0,0,.1); 
                     border-radius: 50%; border-top-color: #2563eb; animation: spin 1s ease-in-out infinite; }
            @keyframes spin { to { transform: rotate(360deg); } }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="spinner"></div>
            <h1>Application is starting...</h1>
            <p>Please wait a moment while Next.js initializes.</p>
            <p>This page will automatically refresh in 5 seconds.</p>
            <script>setTimeout(() => { window.location.reload(); }, 5000);</script>
          </div>
        </body>
      </html>
    `);
  });
  
  // Forward the request data
  req.pipe(proxy);
});

// Listen on port 5000 immediately
server.listen(5000, () => {
  console.log('🚀 Proxy server running on port 5000');
});

// Start Next.js development server
console.log('📦 Starting Next.js development server...');

const nextProcess = spawn('npm', ['run', 'dev'], {
  stdio: ['inherit', 'pipe', 'pipe'],
  shell: true
});

// Handle Next.js output for debugging
nextProcess.stdout.on('data', (data) => {
  process.stdout.write(`[Next.js] ${data}`);
});

nextProcess.stderr.on('data', (data) => {
  process.stderr.write(`[Next.js Error] ${data}`);
});

// Handle Next.js exit
nextProcess.on('exit', (code) => {
  console.error(`❌ Next.js process exited with code ${code}`);
  console.log('⚙️ Keeping proxy server running to show error messages...');
});

// Handle termination signals
function cleanup() {
  console.log('🛑 Shutting down...');
  
  if (nextProcess) {
    nextProcess.kill();
  }
  
  server.close(() => {
    console.log('👋 Goodbye!');
    process.exit(0);
  });
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);