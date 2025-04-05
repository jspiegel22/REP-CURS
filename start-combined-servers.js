const { spawn } = require('child_process');
const path = require('path');

// Function to spawn a process and handle its output
function spawnProcess(command, args, options = {}) {
  console.log(`Starting: ${command} ${args.join(' ')}`);
  
  const proc = spawn(command, args, {
    stdio: 'pipe',
    shell: process.platform === 'win32',
    ...options
  });

  // Pipe the process output to our own stdout/stderr
  proc.stdout.on('data', (data) => {
    process.stdout.write(`[${options.name || 'Process'}] ${data}`);
  });

  proc.stderr.on('data', (data) => {
    process.stderr.write(`[${options.name || 'Process'}] ${data}`);
  });

  // Handle process exit
  proc.on('exit', (code) => {
    console.log(`${options.name || 'Process'} exited with code ${code}`);
  });

  return proc;
}

// Start Next.js
const nextProcess = spawnProcess('npm', ['run', 'dev'], { 
  name: 'Next.js',
  env: { ...process.env, PORT: 3000 }
});

// Give Next.js a head start
setTimeout(() => {
  // Start Express/Proxy Server
  const proxyProcess = spawnProcess('ts-node', ['proxy-server.ts'], { 
    name: 'Express',
    env: { ...process.env, PORT: 5000 }
  });

  // Handle graceful shutdown
  process.on('SIGINT', () => {
    console.log('Shutting down all servers...');
    nextProcess.kill();
    proxyProcess.kill();
    process.exit(0);
  });
}, 2000);

console.log('Starting both Next.js and Express servers...');
console.log('Press Ctrl+C to stop all servers');