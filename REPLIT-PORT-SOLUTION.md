# REPLIT PORT 5000 SOLUTION

## The Problem

Replit requires web applications to listen on port 5000, but Next.js servers typically run on port 3000. This causes the application to appear as "not running" in the Replit webview.

## Solutions Created

We've created multiple solutions to address this issue:

### 1. Smart Proxy (`replit-entry.js`)

This solution:
- Opens port 5000 immediately to satisfy Replit's requirement
- Starts Next.js on port 3000
- Automatically detects which port Next.js is running on
- Forwards all requests from port 5000 to Next.js
- Provides detailed logging for debugging

### 2. Simple Proxy (`direct-port-5000-simple.js`)

A simpler alternative that:
- Creates a basic proxy server on port 5000
- Starts Next.js on port 3000
- Forwards all requests without any complex detection logic
- Shows a loading page when Next.js is starting up

### 3. Diagnostic Tools

To help troubleshoot any issues:
- `monitor-app.js`: Checks if the application is running on different ports
- `check-deps.js`: Verifies all required dependencies are available
- `/debug` page: Shows detailed system information in the browser
- `/health-check` page: Provides real-time system status
- `/api/health` endpoint: API health check for monitoring

## How to Use

1. Update your Replit workflow:
   - Change the command from `npm run dev` to `node replit-entry.js`
   - Or for the simpler solution: `node direct-port-5000-simple.js`
   - Or use the bash script: `./run-app-on-port-5000.sh`

2. If you encounter any issues:
   - Run `node monitor-app.js` for diagnostics
   - Check the logs in the workflow console
   - Visit `/debug` in the browser
   - Try the alternative solution if one doesn't work

## Technical Implementation

- **HTTP Proxy**: Uses Node.js built-in `http` module to create a proxy server
- **Process Management**: Manages the Next.js process with proper cleanup on exit
- **Port Detection**: Dynamically detects which port Next.js is running on
- **Error Handling**: Shows user-friendly messages when services are starting up
- **Logging**: Provides detailed logs for troubleshooting

## Benefits

- No configuration changes needed to Next.js
- Works reliably within Replit's constraints
- Multiple fallback options for reliability
- Comprehensive diagnostic tools
- Clear documentation