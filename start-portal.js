/**
 * REPLIT PREVIEW PORTAL
 * This script starts both Next.js and a simple proxy to make the app visible in Replit
 */
const { spawn } = require('child_process');
const http = require('http');
const path = require('path');
const fs = require('fs');

console.log('🚀 Starting Replit Preview Portal...');

// Start Next.js in the background
const nextProcess = spawn('npx', ['next', 'dev'], {
  stdio: 'pipe',
  detached: true
});

// Log Next.js output
nextProcess.stdout.on('data', (data) => {
  console.log(`[Next.js] ${data.toString().trim()}`);
});

nextProcess.stderr.on('data', (data) => {
  console.error(`[Next.js Error] ${data.toString().trim()}`);
});

// Create a minimal HTTP server that binds to port 5000
// This will serve a portal page that loads the Next.js app in an iframe
const server = http.createServer((req, res) => {
  // Check if it's the root request
  if (req.url === '/' || req.url === '/index.html') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    
    // Create a simple portal page with an iframe
    const portalHtml = `
      <!DOCTYPE html>
      <html lang="en">
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Cabo San Lucas Travel - Preview Portal</title>
          <style>
            body, html { 
              margin: 0; 
              padding: 0; 
              height: 100%; 
              overflow: hidden;
              font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            }
            .portal-header {
              background: #222;
              color: white;
              padding: 8px 16px;
              display: flex;
              justify-content: space-between;
              align-items: center;
            }
            .portal-header h1 {
              margin: 0;
              font-size: 18px;
            }
            .portal-header .status {
              background: #3CB371;
              color: white;
              padding: 4px 8px;
              border-radius: 4px;
              font-size: 12px;
            }
            .portal-content {
              height: calc(100% - 40px);
              width: 100%;
            }
            iframe {
              border: none;
              width: 100%;
              height: 100%;
            }
            .loading {
              display: flex;
              justify-content: center;
              align-items: center;
              height: 100%;
              flex-direction: column;
            }
            .spinner {
              border: 5px solid #f3f3f3;
              border-top: 5px solid #3498db;
              border-radius: 50%;
              width: 50px;
              height: 50px;
              animation: spin 1s linear infinite;
              margin-bottom: 20px;
            }
            @keyframes spin {
              0% { transform: rotate(0deg); }
              100% { transform: rotate(360deg); }
            }
          </style>
        </head>
        <body>
          <div class="portal-header">
            <h1>Cabo San Lucas Travel Platform</h1>
            <div class="status">Preview Mode</div>
          </div>
          <div class="portal-content">
            <div id="loading" class="loading">
              <div class="spinner"></div>
              <p>Loading your application...</p>
            </div>
            <iframe id="app-frame" src="http://localhost:3000" style="display:none;"></iframe>
          </div>
          <script>
            // Check if the app is ready
            const iframe = document.getElementById('app-frame');
            const loading = document.getElementById('loading');
            
            function checkAppReady() {
              fetch('http://localhost:3000')
                .then(response => {
                  if (response.ok) {
                    loading.style.display = 'none';
                    iframe.style.display = 'block';
                  } else {
                    setTimeout(checkAppReady, 1000);
                  }
                })
                .catch(error => {
                  console.log('App not ready yet, retrying...');
                  setTimeout(checkAppReady, 1000);
                });
            }
            
            // Start checking
            setTimeout(checkAppReady, 2000);
            
            // Handle iframe load event
            iframe.onload = function() {
              loading.style.display = 'none';
              iframe.style.display = 'block';
            };
          </script>
        </body>
      </html>
    `;
    
    res.end(portalHtml);
    return;
  }
  
  // For all other requests, redirect to the Next.js server
  res.writeHead(302, { 'Location': `http://localhost:3000${req.url}` });
  res.end();
});

// Start the server
server.listen(5000, '0.0.0.0', () => {
  console.log('🌐 Preview Portal running on port 5000');
  console.log('📱 Your application is loading...');
});

// Handle cleanup when the process is terminated
process.on('SIGINT', () => {
  console.log('Stopping servers...');
  
  if (nextProcess && !nextProcess.killed) {
    // Terminate the Next.js process
    process.kill(-nextProcess.pid);
  }
  
  process.exit(0);
});

process.on('SIGTERM', () => {
  console.log('Stopping servers...');
  
  if (nextProcess && !nextProcess.killed) {
    // Terminate the Next.js process
    process.kill(-nextProcess.pid);
  }
  
  process.exit(0);
});