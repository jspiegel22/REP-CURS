/**
 * Replit Entry Point
 * This script handles both starting Next.js and creating a proxy to port 5000
 * It ensures port 5000 is opened immediately, which is critical for Replit workflows
 * It also dynamically detects which port Next.js is running on
 */

const http = require('http');
const { spawn } = require('child_process');
const net = require('net');
const fs = require('fs').promises;

// Create a log file to help with debugging
async function logMessage(message) {
  const timestamp = new Date().toISOString();
  const logLine = `[${timestamp}] ${message}\n`;
  
  console.log(message);
  
  try {
    await fs.appendFile('replit-log.txt', logLine);
  } catch (err) {
    console.error('Error writing to log file:', err);
  }
}

logMessage('📢 Starting Replit entry script...');

// Default Next.js port
let nextJsPort = 3000;

// Create a proxy server that will forward requests to the Next.js server
const server = http.createServer((req, res) => {
  logMessage(`📨 Forwarding request: ${req.method} ${req.url}`);
  
  // Create options for the proxy request
  const options = {
    hostname: 'localhost',
    port: nextJsPort,
    path: req.url,
    method: req.method,
    headers: req.headers
  };
  
  // Create the proxy request
  const proxyReq = http.request(options, (proxyRes) => {
    // Copy the status code and headers
    res.writeHead(proxyRes.statusCode, proxyRes.headers);
    
    // Pipe the response data
    proxyRes.pipe(res);
  });
  
  // Handle proxy request errors
  proxyReq.on('error', (e) => {
    logMessage(`❌ Proxy error: ${e.message}`);
    
    // Send a nice error page
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
          <meta http-equiv="refresh" content="5">
        </head>
        <body>
          <div class="container">
            <div class="spinner"></div>
            <h1>Application is starting...</h1>
            <p>Please wait a moment while the Cabo Travel Guide application initializes.</p>
            <p>This page will automatically refresh in 5 seconds.</p>
          </div>
        </body>
      </html>
    `);
  });
  
  // Handle client request errors
  req.on('error', (e) => {
    logMessage(`❌ Client request error: ${e.message}`);
    proxyReq.destroy();
  });
  
  // Forward the request body
  req.pipe(proxyReq);
});

// Function to update the proxy target port
function updateProxyTarget(port) {
  if (port !== nextJsPort) {
    nextJsPort = port;
    logMessage(`⚙️ Updated proxy target to port ${nextJsPort}`);
  }
}

// Listen on port 5000 immediately
server.listen(5000, () => {
  logMessage('🚀 Proxy server running on port 5000');
});

// Function to detect which port Next.js is running on
async function detectNextJsPort() {
  // Common Next.js ports to check
  const portsToCheck = [3000, 3001, 3002, 8080];
  
  for (const port of portsToCheck) {
    try {
      // Try to connect to the port
      const socket = new net.Socket();
      
      const connectPromise = new Promise((resolve, reject) => {
        socket.connect(port, 'localhost', () => {
          socket.destroy();
          resolve(true);
        });
        
        socket.on('error', () => {
          socket.destroy();
          resolve(false);
        });
      });
      
      const isConnected = await connectPromise;
      
      if (isConnected) {
        logMessage(`✅ Detected Next.js running on port ${port}`);
        updateProxyTarget(port);
        return port;
      }
    } catch (err) {
      logMessage(`⚠️ Error checking port ${port}: ${err.message}`);
    }
  }
  
  logMessage('⚠️ Could not detect Next.js port, using default (3000)');
  return 3000;
}

// Handle cleanup when the process exits
function cleanup() {
  logMessage('🛑 Shutting down servers...');
  
  if (nextProcess) {
    logMessage('👋 Stopping Next.js process');
    nextProcess.kill();
  }
  
  server.close(() => {
    logMessage('👋 Proxy server closed');
    process.exit(0);
  });
}

// Start Next.js
logMessage('📦 Starting Next.js development server...');

const nextProcess = spawn('npm', ['run', 'dev'], {
  stdio: ['inherit', 'pipe', 'pipe'],
  shell: true
});

// Pass through Next.js logs
nextProcess.stdout.on('data', (data) => {
  const output = data.toString();
  process.stdout.write(output);
  
  // Look for the "ready" message to detect when Next.js is running
  if (output.includes('ready') && output.includes('http://localhost:')) {
    // Extract the port from the output
    const match = output.match(/http:\/\/localhost:(\d+)/);
    if (match && match[1]) {
      const port = parseInt(match[1], 10);
      updateProxyTarget(port);
    }
  }
});

nextProcess.stderr.on('data', (data) => {
  process.stderr.write(data);
});

// Handle Next.js exit
nextProcess.on('exit', (code) => {
  logMessage(`⚠️ Next.js process exited with code ${code}`);
  logMessage('⚙️ Keeping proxy server running to show error messages...');
});

// Try to detect the port after a delay
async function detectWithRetries() {
  // Wait a moment before checking
  await new Promise(resolve => setTimeout(resolve, 5000));
  
  let retries = 5;
  while (retries > 0) {
    const port = await detectNextJsPort();
    if (port) {
      updateProxyTarget(port);
      return;
    }
    
    // Wait between retries
    await new Promise(resolve => setTimeout(resolve, 3000));
    retries--;
  }
  
  logMessage('⚠️ Failed to detect Next.js port after several attempts');
}

// Start detection
detectWithRetries();

// Set up cleanup handlers
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('exit', cleanup);