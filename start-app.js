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

// Start the Next.js server directly on port 5000
console.log('Starting Next.js development server on port 5000...');
const nextServer = spawnProcess('npx', ['next', 'dev', '--port', '5000'], {
  env: { ...process.env, PORT: '5000' }
});