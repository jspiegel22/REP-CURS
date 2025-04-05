// Script to start both the Next.js app and proxy server
const { spawn } = require('child_process');
const path = require('path');

console.log('🚀 Starting Next.js application with proxy...');

// Start Next.js application
const nextProcess = spawn('npm', ['run', 'dev'], {
  stdio: 'inherit',
  shell: true
});

console.log('✅ Next.js process started');

// Wait a moment for Next.js to start
setTimeout(() => {
  console.log('🔄 Starting proxy server...');
  
  // Start proxy server
  const proxyProcess = spawn('node', ['proxy-server.js'], {
    stdio: 'inherit',
    shell: true
  });
  
  console.log('✅ Proxy server started');

  // Handle process termination
  process.on('SIGINT', () => {
    console.log('👋 Shutting down...');
    nextProcess.kill();
    proxyProcess.kill();
    process.exit(0);
  });

  // Handle child process exit
  nextProcess.on('exit', (code) => {
    console.log(`❌ Next.js process exited with code ${code}`);
    proxyProcess.kill();
    process.exit(code);
  });

  proxyProcess.on('exit', (code) => {
    console.log(`❌ Proxy process exited with code ${code}`);
    nextProcess.kill();
    process.exit(code);
  });
}, 2000); // Wait 2 seconds before starting proxy