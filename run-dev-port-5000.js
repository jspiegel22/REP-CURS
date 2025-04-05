// This script is run by `npm run dev` in package.json
// It starts the Next.js app on port 5000

const { execSync } = require('child_process');

try {
  console.log('Starting Next.js on port 5000...');
  execSync('npx next dev -p 5000', { stdio: 'inherit' });
} catch (error) {
  console.error('Error starting Next.js:', error);
  process.exit(1);
}