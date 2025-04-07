# Replit Port 5000 Solution

## Problem

Replit requires applications to be accessible on port 5000, but Next.js defaults to running on port 3000. This mismatch prevents Replit's built-in tools from properly displaying and connecting to your application.

## Solutions

We've created several scripts to solve this port discrepancy:

### Option 1: Simple Proxy (Recommended)

```bash
node simple-proxy.js
```

This script:
- Starts Next.js on port 3000
- Creates a lightweight proxy on port 5000
- Forwards all traffic between the two ports
- Handles WebSockets for hot module reloading
- Properly manages CORS headers
- Gracefully handles termination

### Option 2: Bash Script Launcher

```bash
./run-app.sh
```

A bash script that:
- Starts Next.js in the background
- Waits for Next.js to initialize
- Creates a Node.js proxy inline using a heredoc
- Manages process cleanup

### Option 3: Port 5000 Runner

```bash
node run-on-5000.js
```

Similar to the simple proxy but with different timing mechanisms:
- Starts Next.js with npm run dev
- Creates a proxy server after a short delay
- Uses 0.0.0.0 binding for proper network access

## How to Use

For Replit, use the simple-proxy.js solution:

1. Install the http-proxy package:
   ```
   npm install http-proxy
   ```

2. Run the script directly:
   ```
   node simple-proxy.js
   ```

3. For workflows, modify the configuration to run this script

## Troubleshooting

If you encounter issues:

- **Port already in use**: Make sure no other processes are using port 5000
- **Next.js not starting**: Check for Next.js errors in the console
- **Proxy connection issues**: Verify that Next.js is properly running on port 3000
- **WebSocket errors**: The proxy should handle WebSockets, but check for any connection issues

## Technical Details

The proxy solution uses:

- `http-proxy` npm package for request forwarding
- Node.js child_process for starting Next.js
- Standard HTTP server for handling incoming requests
- WebSocket proxying for live reload functionality