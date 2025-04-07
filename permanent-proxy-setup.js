/**
 * Permanent Proxy Setup Script
 * 
 * This script helps set up a reliable proxy for Replit that starts immediately.
 * Run this script once with: node permanent-proxy-setup.js
 * 
 * It creates a modified version of replit-entry.js that will automatically
 * use the direct proxy method for more reliable connections.
 */

const fs = require('fs');
const path = require('path');

// Backup the original entry file if needed
function backupOriginalFile() {
  const entryPath = path.join(__dirname, 'replit-entry.js');
  const backupPath = path.join(__dirname, 'replit-entry.backup.js');
  
  if (fs.existsSync(entryPath) && !fs.existsSync(backupPath)) {
    console.log('📂 Creating backup of original entry file...');
    fs.copyFileSync(entryPath, backupPath);
    console.log('✅ Backup created: replit-entry.backup.js');
  }
}

// Replace the entry file with one that uses the direct proxy
function updateEntryFile() {
  const entryPath = path.join(__dirname, 'replit-entry.js');
  const directProxyCode = `/**
 * IMPROVED REPLIT ENTRY POINT
 * This script has been modified for more reliable connections
 * Modified by: permanent-proxy-setup.js
 */

const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');

// Log important messages to console and file
async function logMessage(message) {
  console.log(message);
  // Also log to a file for debugging
  fs.appendFileSync('replit-log.txt', \`\${new Date().toISOString()}: \${message}\\n\`);
}

// Cleanup function to handle process exit
function cleanup() {
  logMessage('🛑 Shutting down servers...');
  process.exit(0);
}

// Handle cleanup when process is terminated
process.on('SIGINT', cleanup);
process.on('SIGTERM', cleanup);

// Start the NextJS application
async function startNextJS() {
  logMessage('📦 Starting Next.js development server...');
  
  // Start Next.js using npm run dev (uses the scripts defined in package.json)
  const nextProcess = spawn('npm', ['run', 'dev'], {
    stdio: 'inherit', // This ensures we see the Next.js output in our console
    shell: true
  });
  
  // Log any errors from the Next.js process
  nextProcess.on('error', (err) => {
    logMessage(\`❌ Error starting Next.js: \${err.message}\`);
  });
  
  // Handle Next.js process exit
  nextProcess.on('exit', (code) => {
    logMessage(\`⚠️ Next.js process exited with code \${code}\`);
  });
  
  return nextProcess;
}

// Create a simple proxy server that directly forwards to port 3000
async function startProxy() {
  // Create the proxy server that forwards requests to NextJS
  const proxyServer = http.createServer((req, res) => {
    // Forward the request to the Next.js server
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: req.url,
      method: req.method,
      headers: req.headers
    };
    
    const proxyReq = http.request(options, (proxyRes) => {
      res.writeHead(proxyRes.statusCode, proxyRes.headers);
      proxyRes.pipe(res, { end: true });
    });
    
    proxyReq.on('error', (e) => {
      // If Next.js isn't running yet, return a simple loading page
      res.writeHead(503, { 'Content-Type': 'text/html' });
      res.end(\`
        <!DOCTYPE html>
        <html>
        <head>
          <title>Starting Application...</title>
          <meta http-equiv="refresh" content="3">
          <style>
            body { font-family: Arial, sans-serif; margin: 40px; line-height: 1.6; color: #333; }
            h1 { color: #2c3e50; }
            .loader { border: 5px solid #f3f3f3; border-top: 5px solid #3498db; border-radius: 50%; width: 50px; height: 50px; animation: spin 1s linear infinite; margin: 20px 0; }
            @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
          </style>
        </head>
        <body>
          <h1>Starting Application...</h1>
          <div class="loader"></div>
          <p>The application is starting up. This page will automatically refresh.</p>
          <p><small>Status: Next.js server is starting. Please wait...</small></p>
        </body>
        </html>
      \`);
    });
    
    req.pipe(proxyReq, { end: true });
  });
  
  // Start the proxy server on port 5000
  proxyServer.listen(5000, () => {
    logMessage('🚀 Proxy server running on port 5000');
  });
  
  return proxyServer;
}

// Main function that starts everything
async function main() {
  try {
    // Start the proxy server first so requests can come in immediately
    const proxyServer = await startProxy();
    
    // Then start Next.js
    const nextProcess = await startNextJS();
    
  } catch (error) {
    logMessage(\`❌ Error in main process: \${error.message}\`);
    cleanup();
  }
}

// Start everything
main();
`;

  console.log('📝 Updating entry file with direct proxy implementation...');
  fs.writeFileSync(entryPath, directProxyCode);
  console.log('✅ Updated replit-entry.js with improved direct proxy implementation');
}

// Main function
async function setup() {
  console.log('🔧 Setting up permanent proxy solution...');
  
  try {
    // Create backup first
    backupOriginalFile();
    
    // Then update the entry file
    updateEntryFile();
    
    console.log('✨ Permanent proxy setup complete!');
    console.log('👉 Your application will now use the direct proxy method every time it starts.');
    console.log('👉 Next steps:');
    console.log('   1. Restart your workflow from the Replit interface');
    console.log('   2. Your application will be available on port 5000');
    console.log('   3. To revert these changes, rename replit-entry.backup.js to replit-entry.js');
  } catch (error) {
    console.error('❌ Error during setup:', error.message);
    process.exit(1);
  }
}

// Run the setup
setup();