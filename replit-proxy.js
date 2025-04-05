// Advanced proxy for Replit to manage Next.js port redirection
const http = require('http');
const { spawn } = require('child_process');
const httpProxy = require('http-proxy');
const { EventEmitter } = require('events');

// Custom event emitter to handle app readiness
const appEvents = new EventEmitter();

// Create a proxy server
const proxy = httpProxy.createProxyServer({});

// Handle proxy errors gracefully
proxy.on('error', (err, req, res) => {
  console.error('Proxy error:', err);
  
  if (!res.headersSent) {
    res.writeHead(502, { 'Content-Type': 'text/plain' });
    res.end('Proxy error - Next.js app might be starting up. Please try again in a moment.');
  }
});

// Track if the Next.js server is running
let nextAppRunning = false;
let serverStartTime = Date.now();
let proxyReady = false;

// Create the proxy server
const server = http.createServer((req, res) => {
  // Check if Next.js is running
  if (nextAppRunning) {
    // Proxy requests to the Next.js server
    proxy.web(req, res, { target: 'http://localhost:3001' }, (err) => {
      if (!res.headersSent) {
        res.writeHead(500, { 'Content-Type': 'text/plain' });
        res.end(`Proxy error: ${err.message}`);
      }
    });
  } else {
    // Return a loading message
    const waitTime = Math.floor((Date.now() - serverStartTime) / 1000);
    res.writeHead(503, { 'Content-Type': 'text/html' });
    res.end(`
      <!DOCTYPE html>
      <html>
        <head>
          <title>Starting the application...</title>
          <meta http-equiv="refresh" content="2">
          <style>
            body {
              font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif;
              color: #333;
              text-align: center;
              padding: 50px;
              max-width: 800px;
              margin: 0 auto;
              line-height: 1.6;
            }
            .loader {
              border: 5px solid #f3f3f3;
              border-top: 5px solid #3498db;
              border-radius: 50%;
              width: 50px;
              height: 50px;
              animation: spin 1s linear infinite;
              margin: 20px auto;
            }
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
            .container {
              background-color: #f9f9f9;
              border-radius: 8px;
              padding: 20px;
              box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Starting the application...</h1>
            <div class="loader"></div>
            <p>Please wait while the Next.js application starts (${waitTime} seconds elapsed)</p>
            <p>This page will automatically refresh when the app is ready.</p>
          </div>
        </body>
      </html>
    `);
  }
});

// Listen on the port Replit expects (5000)
const PORT = 5000;
server.listen(PORT, '0.0.0.0', () => {
  proxyReady = true;
  console.log(`\n🚀 Proxy server running at http://0.0.0.0:${PORT}`);
  console.log(`Waiting for Next.js to start on port 3001...`);
});

// Start the Next.js app
console.log('\n📦 Starting Next.js application...');
const nextApp = spawn('npx', ['next', 'dev', '-p', '3001']);

// Status checker that retries connecting to Next.js
function checkNextAppStatus() {
  if (nextAppRunning) return;
  
  const checkReq = http.request({
    host: 'localhost',
    port: 3001,
    path: '/',
    method: 'HEAD',
    timeout: 1000
  }, (res) => {
    if (res.statusCode >= 200 && res.statusCode < 500) {
      nextAppRunning = true;
      console.log(`\n✅ Next.js application is running on port 3001`);
      console.log(`✅ Proxy successfully connected to Next.js\n`);
      appEvents.emit('ready');
    }
  });
  
  checkReq.on('error', () => {
    // Next.js not running yet, but that's expected during startup
  });
  
  checkReq.on('timeout', () => {
    checkReq.destroy();
  });
  
  checkReq.end();
}

// Check every 2 seconds if Next.js has started
const statusInterval = setInterval(checkNextAppStatus, 2000);

// After 60 seconds, stop checking and just wait for the stdout signal
setTimeout(() => {
  if (!nextAppRunning) {
    console.log("\n⚠️ Next.js taking longer than expected to start. Still waiting...");
  }
}, 60000);

// Process Next.js output 
nextApp.stdout.on('data', (data) => {
  const output = data.toString().trim();
  console.log(`[Next.js] ${output}`);
  
  // Watch for the "ready" message from Next.js
  if (output.includes('- Ready in')) {
    // Next.js is ready
    setTimeout(() => {
      nextAppRunning = true;
      console.log(`\n✅ Next.js application is running on port 3001`);
      console.log(`✅ Proxy successfully connected to Next.js\n`);
      appEvents.emit('ready');
    }, 1000); // Small buffer to make sure it's fully ready
  }
});

nextApp.stderr.on('data', (data) => {
  console.error(`[Next.js Error] ${data.toString().trim()}`);
});

// Handle process termination
function cleanup() {
  console.log('Shutting down...');
  clearInterval(statusInterval);
  
  if (nextApp) {
    nextApp.kill();
  }
  
  process.exit(0);
}

process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);
process.on('uncaughtException', (err) => {
  console.error('Uncaught exception:', err);
  cleanup();
});