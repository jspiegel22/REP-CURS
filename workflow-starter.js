/**
 * Combined Workflow Starter for Next.js and Proxy
 * 
 * This script handles:
 * 1. Starting Next.js on port 3000
 * 2. Starting the proxy on port 5000
 * 3. Managing graceful startup and shutdown
 * 
 * Usage: node workflow-starter.js
 */

const { spawn } = require('child_process');
const path = require('path');
const http = require('http');

// Configuration
const NEXT_PORT = 3000;
const PROXY_PORT = 5000;
const RETRY_INTERVAL = 2000; // 2 seconds between retries
const MAX_RETRIES = 30; // Total wait time: 60 seconds

// Track child processes
let nextProcess = null;
let proxyProcess = null;
let shuttingDown = false;

console.log('🚀 Starting Cabo Travel Platform...');

// Function to check if Next.js is running
function checkNextJsStatus() {
  return new Promise((resolve) => {
    const req = http.get(`http://localhost:${NEXT_PORT}/api/health`, (res) => {
      if (res.statusCode === 200) {
        resolve(true);
      } else {
        resolve(false);
      }
    });
    
    req.on('error', () => {
      resolve(false);
    });
    
    req.setTimeout(1000, () => {
      req.destroy();
      resolve(false);
    });
  });
}

// Function to wait for Next.js to be ready
async function waitForNextJs() {
  let retries = 0;
  
  while (retries < MAX_RETRIES) {
    const isRunning = await checkNextJsStatus();
    if (isRunning) {
      console.log('✅ Next.js is running and responsive!');
      return true;
    }
    
    retries++;
    if (retries % 5 === 0) {
      console.log(`⏳ Waiting for Next.js to start... (${retries}/${MAX_RETRIES})`);
    }
    
    // Wait before next check
    await new Promise(resolve => setTimeout(resolve, RETRY_INTERVAL));
  }
  
  console.log('⚠️ Timed out waiting for Next.js to start, but continuing anyway...');
  return false;
}

// Start Next.js
function startNextJs() {
  console.log('📦 Starting Next.js dev server...');
  
  nextProcess = spawn('npm', ['run', 'dev', '--', '-p', NEXT_PORT], {
    stdio: 'pipe',
    shell: true
  });
  
  nextProcess.stdout.on('data', (data) => {
    console.log(`Next.js: ${data.toString().trim()}`);
  });
  
  nextProcess.stderr.on('data', (data) => {
    console.error(`Next.js Error: ${data.toString().trim()}`);
  });
  
  nextProcess.on('close', (code) => {
    if (!shuttingDown) {
      console.log(`⚠️ Next.js process exited with code ${code}`);
      process.exit(1);
    }
  });
}

// Start Proxy Server
function startProxyServer() {
  console.log('🔄 Starting proxy server on port 5000...');
  
  proxyProcess = spawn('node', [path.join(__dirname, 'workflow-preview.js')], {
    stdio: 'pipe',
    shell: true
  });
  
  proxyProcess.stdout.on('data', (data) => {
    console.log(`Proxy: ${data.toString().trim()}`);
  });
  
  proxyProcess.stderr.on('data', (data) => {
    console.error(`Proxy Error: ${data.toString().trim()}`);
  });
  
  proxyProcess.on('close', (code) => {
    if (!shuttingDown) {
      console.log(`⚠️ Proxy process exited with code ${code}`);
    }
  });
}

// Graceful shutdown
function shutdown() {
  shuttingDown = true;
  console.log('🛑 Shutting down gracefully...');
  
  // Kill processes
  if (proxyProcess) {
    proxyProcess.kill('SIGTERM');
  }
  
  if (nextProcess) {
    nextProcess.kill('SIGTERM');
  }
  
  // Allow time for processes to exit
  setTimeout(() => {
    console.log('👋 Goodbye!');
    process.exit(0);
  }, 1000);
}

// Start everything
async function main() {
  try {
    // Step 1: Start Next.js
    startNextJs();
    
    // Step 2: Wait for Next.js to be ready (with timeout)
    await waitForNextJs();
    
    // Step 3: Start proxy server
    startProxyServer();
    
    console.log('\n✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨');
    console.log('✅ All systems running! App available at:');
    console.log(`🌐 http://localhost:${PROXY_PORT}`);
    console.log('✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨✨\n');
  } catch (error) {
    console.error('❌ Error starting services:', error);
    shutdown();
  }
}

// Handle graceful shutdown
process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);

// Run the main function
main();