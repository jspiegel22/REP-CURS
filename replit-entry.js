/**
 * Replit Entry Point
 * This script handles both starting Next.js and creating a proxy to port 5000
 * It ensures port 5000 is opened immediately, which is critical for Replit workflows
 * It also dynamically detects which port Next.js is running on
 */

const { spawn } = require('child_process');
const http = require('http');
const httpProxy = require('http-proxy');

// Constants
let NEXT_PORT = 3000; // This will be updated dynamically if needed
const POSSIBLE_PORTS = [3000, 3001, 3002, 3003, 3004, 3005];
const PROXY_PORT = 5000;

// Setup proxy server first - this needs to be available immediately
console.log('🚀 Starting Replit proxy server on port 5000...');

// Create a proxy server instance with a default target
// We'll update this dynamically when we detect the actual Next.js port
const proxy = httpProxy.createProxyServer({
  target: `http://localhost:${NEXT_PORT}`,
  ws: true,
  autoRewrite: true
});

// Handle proxy errors
proxy.on('error', (err, req, res) => {
  console.error('Proxy error:', err.message);
  
  if (res && !res.headersSent) {
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
            <p>Please wait a moment while the Next.js server initializes.</p>
            <p>This page will automatically refresh in 5 seconds.</p>
            <p><small>Current target port: ${NEXT_PORT}</small></p>
            <script>setTimeout(() => { window.location.reload(); }, 5000);</script>
          </div>
        </body>
      </html>
    `);
  }
});

// Create the HTTP server for the proxy
const server = http.createServer((req, res) => {
  // Log request for debugging
  console.log(`[Proxy] ${req.method} ${req.url}`);
  
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
  
  // Handle OPTIONS requests for CORS
  if (req.method === 'OPTIONS') {
    res.writeHead(200);
    res.end();
    return;
  }
  
  // Forward request to Next.js
  proxy.web(req, res);
});

// Handle WebSocket requests
server.on('upgrade', (req, socket, head) => {
  proxy.ws(req, socket, head);
});

// Open port 5000 immediately - this is critical for Replit to detect the app
server.listen(PROXY_PORT, () => {
  console.log(`✅ Proxy server running on port ${PROXY_PORT}`);
});

// Function to update proxy target
function updateProxyTarget(port) {
  NEXT_PORT = port;
  proxy.options.target = `http://localhost:${port}`;
  console.log(`🔄 Updated proxy target to port ${port}`);
}

// Function to detect which port Next.js is running on
async function detectNextJsPort() {
  // Give Next.js time to start and print its port info
  await new Promise(resolve => setTimeout(resolve, 3000));
  
  // Check each possible port to see if Next.js is running there
  for (const port of POSSIBLE_PORTS) {
    try {
      const req = http.get(`http://localhost:${port}/api/health`, (res) => {
        if (res.statusCode === 200) {
          updateProxyTarget(port);
          return true;
        }
      });
      
      req.on('error', () => {
        // This port didn't work, try the next one
      });
      
      req.setTimeout(500);
    } catch (error) {
      // Ignore errors and try the next port
    }
  }
  
  console.log(`⚠️ Could not detect Next.js port, defaulting to ${NEXT_PORT}`);
  return false;
}

// Now start Next.js
console.log('📦 Starting Next.js development server...');

const nextProcess = spawn('npm', ['run', 'dev'], {
  stdio: 'pipe',
  shell: true
});

// Handle Next.js output
nextProcess.stdout.on('data', (data) => {
  const output = data.toString().trim();
  console.log(`[Next.js] ${output}`);
  
  // Check if the output contains port information
  const portMatch = output.match(/localhost:(\d+)/);
  if (portMatch && portMatch[1]) {
    const detectedPort = parseInt(portMatch[1], 10);
    if (detectedPort !== NEXT_PORT) {
      updateProxyTarget(detectedPort);
    }
  }
});

nextProcess.stderr.on('data', (data) => {
  const output = data.toString().trim();
  console.error(`[Next.js Error] ${output}`);
  
  // Also check stderr for port information (Next.js outputs to stderr sometimes)
  const portMatch = output.match(/trying (\d+) instead/);
  if (portMatch && portMatch[1]) {
    const detectedPort = parseInt(portMatch[1], 10);
    if (detectedPort !== NEXT_PORT) {
      updateProxyTarget(detectedPort);
    }
  }
});

// Handle Next.js exit
nextProcess.on('exit', (code) => {
  console.error(`❌ Next.js process exited with code ${code}`);
  console.log('⚙️ Keeping proxy server running to show error messages...');
});

// Graceful shutdown
function cleanup() {
  console.log('🛑 Shutting down...');
  
  // Kill child processes
  if (nextProcess) {
    nextProcess.kill();
  }
  
  // Close the proxy server
  server.close(() => {
    console.log('👋 Goodbye!');
    process.exit(0);
  });
}

// Handle termination signals
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

// Try to detect Next.js port after starting
detectNextJsPort();