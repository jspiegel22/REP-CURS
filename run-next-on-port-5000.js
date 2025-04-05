// Force Next.js to run on port 5000 regardless of package.json configuration
process.env.PORT = '5000';

const { spawn } = require('child_process');

// Run next dev with port 5000
console.log('Starting Next.js on port 5000...');
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