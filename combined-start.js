/**
 * Combined startup script for Next.js with direct-proxy
 * This script starts both Next.js and the direct-proxy server
 */
const { spawn } = require('child_process');
const path = require('path');
const http = require('http');

// Configuration
const NEXT_PORT = 3000;
const PROXY_PORT = 5000;
const NEXT_STARTUP_TIMEOUT = 10000; // 10 seconds
const CHECK_INTERVAL = 500; // 500 ms

// Start Next.js
function startNextJs() {
  console.log('Starting Next.js server...');
  
  const nextProc = spawn('npx', ['next', 'dev'], {
    env: { ...process.env, PORT: NEXT_PORT },
    stdio: 'pipe'
  });

  nextProc.stdout.on('data', (data) => {
    console.log(`[Next.js] ${data.toString().trim()}`);
  });

  nextProc.stderr.on('data', (data) => {
    console.error(`[Next.js ERROR] ${data.toString().trim()}`);
  });

  nextProc.on('error', (err) => {
    console.error('Failed to start Next.js server:', err);
    process.exit(1);
  });

  return nextProc;
}

// Start direct-proxy
function startProxy() {
  console.log('Starting proxy server...');
  
  const proxyProc = spawn('node', ['direct-proxy.js'], {
    env: { ...process.env, PORT: PROXY_PORT },
    stdio: 'pipe'
  });

  proxyProc.stdout.on('data', (data) => {
    console.log(`[Proxy] ${data.toString().trim()}`);
  });

  proxyProc.stderr.on('data', (data) => {
    console.error(`[Proxy ERROR] ${data.toString().trim()}`);
  });

  proxyProc.on('error', (err) => {
    console.error('Failed to start proxy server:', err);
    process.exit(1);
  });

  return proxyProc;
}

// Check if Next.js is running
function checkNextJsStatus() {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${NEXT_PORT}`, () => {
      resolve(true);
    }).on('error', () => {
      resolve(false);
    });
    req.setTimeout(1000, () => {
      req.abort();
      resolve(false);
    });
  });
}

// Wait for Next.js to be ready
async function waitForNextJs() {
  console.log('Waiting for Next.js to be ready...');
  
  const startTime = Date.now();
  
  while (Date.now() - startTime < NEXT_STARTUP_TIMEOUT) {
    const isRunning = await checkNextJsStatus();
    if (isRunning) {
      console.log('Next.js is ready!');
      return true;
    }
    await new Promise(resolve => setTimeout(resolve, CHECK_INTERVAL));
  }
  
  console.error(`Next.js failed to start within ${NEXT_STARTUP_TIMEOUT}ms`);
  return false;
}

// Main function
async function main() {
  // Start Next.js
  const nextProc = startNextJs();
  
  // Wait for Next.js to be ready
  const nextJsReady = await waitForNextJs();
  if (!nextJsReady) {
    console.error('Exiting due to Next.js startup failure');
    nextProc.kill();
    process.exit(1);
  }
  
  // Start proxy
  const proxyProc = startProxy();
  
  // Handle clean shutdown
  function shutdown() {
    console.log('Shutting down servers...');
    proxyProc.kill();
    nextProc.kill();
    process.exit(0);
  }
  
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
}

// Start the servers
main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});