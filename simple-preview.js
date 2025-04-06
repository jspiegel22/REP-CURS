/**
 * Simple HTTP server that provides a preview page for the Next.js application
 */
const http = require('http');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

// Create a simple HTTP server
const server = http.createServer((req, res) => {
  if (req.url === '/' || req.url === '/index.html') {
    res.writeHead(200, { 'Content-Type': 'text/html' });
    
    // Send a simple HTML page with message and auto-refresh
    res.end(`
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="UTF-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Cabo San Lucas Travel Preview</title>
          <style>
            body {
              font-family: system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Arial, sans-serif;
              display: flex;
              flex-direction: column;
              align-items: center;
              justify-content: center;
              height: 100vh;
              margin: 0;
              background: linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%);
              color: #333;
              text-align: center;
              padding: 0 20px;
            }
            .container {
              max-width: 800px;
              background: white;
              padding: 30px;
              border-radius: 10px;
              box-shadow: 0 10px 30px rgba(0,0,0,0.1);
            }
            h1 {
              margin-top: 0;
              color: #0070f3;
            }
            .message {
              margin: 30px 0;
              font-size: 18px;
              line-height: 1.6;
            }
            .status {
              display: flex;
              align-items: center;
              justify-content: center;
              margin-top: 20px;
            }
            .dot {
              width: 12px;
              height: 12px;
              background-color: #22c55e;
              border-radius: 50%;
              margin-right: 8px;
            }
            .status-text {
              font-weight: 500;
            }
            .actions {
              margin-top: 30px;
            }
            .button {
              display: inline-block;
              background-color: #0070f3;
              color: white;
              padding: 12px 24px;
              border-radius: 5px;
              text-decoration: none;
              font-weight: 500;
              margin: 0 10px;
              box-shadow: 0 4px 14px rgba(0,0,0,0.1);
              transition: all 0.2s ease;
            }
            .button:hover {
              background-color: #005ccc;
              transform: translateY(-2px);
            }
            .view-url {
              margin-top: 20px;
              font-size: 14px;
              color: #666;
            }
            @keyframes pulse {
              0% { opacity: 1; }
              50% { opacity: 0.5; }
              100% { opacity: 1; }
            }
            .pulse {
              animation: pulse 2s infinite;
            }
          </style>
        </head>
        <body>
          <div class="container">
            <h1>Cabo San Lucas Travel Platform</h1>
            <div class="message">
              <p>Your Next.js application is running successfully on port 3000.</p>
              <p>You can view it directly by opening the preview window in Replit and appending <code>?port=3000</code> to the URL.</p>
            </div>
            <div class="status">
              <div class="dot pulse"></div>
              <div class="status-text">Server active on port 5000 (proxies to 3000)</div>
            </div>
            <div class="actions">
              <a href="https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co/?port=3000" target="_blank" class="button">View Application</a>
            </div>
            <div class="view-url">
              <p>Direct URL: <code>https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co/?port=3000</code></p>
            </div>
          </div>
        </body>
      </html>
    `);
  } else {
    res.writeHead(302, { 'Location': `http://localhost:3000${req.url}` });
    res.end();
  }
});

// Start the HTTP server
server.listen(5000, '0.0.0.0', () => {
  console.log('Preview server running on port 5000');
  console.log(`Direct URL to access Next.js: https://${process.env.REPL_SLUG}.${process.env.REPL_OWNER}.repl.co/?port=3000`);
  
  // Start Next.js in a separate process
  const nextProcess = spawn('npx', ['next', 'dev'], {
    stdio: 'inherit'
  });
  
  nextProcess.on('close', (code) => {
    console.log(`Next.js process exited with code ${code}`);
    process.exit(code);
  });
});

// Handle process termination
process.on('SIGINT', () => {
  server.close(() => {
    console.log('Server closed');
    process.exit(0);
  });
});