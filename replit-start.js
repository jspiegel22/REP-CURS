/**
 * Replit starter script with timing control
 * Starts Next.js and then launches the proxy server
 */

const { spawn } = require('child_process');
const { execSync } = require('child_process');

// Check if Next.js is already running
try {
  const check = execSync('lsof -i:3000 -t').toString().trim();
  if (check) {
    console.log('Next.js is already running on port 3000. Killing process...');
    execSync(`kill -9 ${check}`);
  }
} catch (error) {
  // No process running on port 3000
}

// Check if proxy is already running
try {
  const check = execSync('lsof -i:5000 -t').toString().trim();
  if (check) {
    console.log('Proxy is already running on port 5000. Killing process...');
    execSync(`kill -9 ${check}`);
  }
} catch (error) {
  // No process running on port 5000
}

console.log('Starting Next.js...');

// Start Next.js
const nextProcess = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  env: { ...process.env, PORT: 3000 },
});

console.log(`Next.js started (PID: ${nextProcess.pid})`);

// Give Next.js time to start (10 seconds)
console.log('Waiting for Next.js to initialize (10 seconds)...');

// Start proxy after delay
setTimeout(() => {
  console.log('Starting proxy server...');
  
  // Use the direct-proxy.js we created earlier
  const proxyProcess = spawn('node', ['direct-proxy.js'], {
    stdio: 'inherit',
  });
  
  console.log(`Proxy server started (PID: ${proxyProcess.pid})`);
  
  // Handle shutdown
  function shutdown() {
    console.log('Shutting down services...');
    
    if (proxyProcess && proxyProcess.pid) {
      try {
        process.kill(proxyProcess.pid);
        console.log(`Proxy process (PID: ${proxyProcess.pid}) terminated`);
      } catch (err) {
        console.error(`Failed to kill proxy process: ${err.message}`);
      }
    }
    
    if (nextProcess && nextProcess.pid) {
      try {
        process.kill(nextProcess.pid);
        console.log(`Next.js process (PID: ${nextProcess.pid}) terminated`);
      } catch (err) {
        console.error(`Failed to kill Next.js process: ${err.message}`);
      }
    }
    
    process.exit(0);
  }
  
  // Set up signal handlers
  process.on('SIGINT', shutdown);
  process.on('SIGTERM', shutdown);
  
}, 10000); // 10 second delay