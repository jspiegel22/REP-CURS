// Script to start Next.js on port 5000
// This can be used as an entry point for Replit

process.env.PORT = '5000';
const { spawn } = require('child_process');

console.log('Starting Next.js on port 5000...');

// Kill any existing processes on port 5000
try {
  const os = require('os');
  if (os.platform() === 'win32') {
    spawn('taskkill', ['/F', '/IM', 'node.exe'], { stdio: 'ignore' });
  } else {
    spawn('pkill', ['-f', 'next'], { stdio: 'ignore' });
  }
} catch (error) {
  // Ignore errors
}

// Start Next.js with port 5000
const nextProcess = spawn('npx', ['next', 'dev', '-p', '5000'], {
  stdio: 'inherit',
  env: {
    ...process.env,
    PORT: '5000'
  }
});

nextProcess.on('error', (error) => {
  console.error(`Error starting Next.js: ${error.message}`);
  process.exit(1);
});

nextProcess.on('exit', (code, signal) => {
  if (code !== 0) {
    console.error(`Next.js process exited with code ${code}`);
    process.exit(code || 1);
  }
});

// Handle termination signals
process.on('SIGINT', () => {
  console.log('Shutting down Next.js...');
  nextProcess.kill();
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Shutting down Next.js...');
  nextProcess.kill();
  process.exit(0);
});