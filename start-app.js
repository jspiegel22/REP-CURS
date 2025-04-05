const { spawn } = require('child_process');
const path = require('path');

// Function to spawn a process and pipe its output
function spawnProcess(command, args, options = {}) {
  const proc = spawn(command, args, {
    stdio: 'inherit',
    shell: true,
    ...options
  });
  
  proc.on('error', (error) => {
    console.error(`Process failed to start: ${error.message}`);
  });
  
  return proc;
}

// Start the Next.js server
console.log('Starting Next.js development server...');
const nextServer = spawnProcess('npx', ['next', 'dev', '--port', '3000'], {
  env: { ...process.env, PORT: '3000' }
});

// Give Next.js a moment to start
setTimeout(() => {
  // Start the Express proxy server
  console.log('Starting Express proxy server...');
  const proxyServer = spawnProcess('npx', ['tsx', './proxy-server.ts'], {
    env: { ...process.env, PORT: '5000' }
  });
}, 5000);  // Wait 5 seconds before starting the proxy server