# Port 5000 Solution for Replit

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

## Using the Solution

1. Update your Replit workspace workflow to use one of these scripts:
   - For the workflow configuration, use `node simple-proxy.js`

2. The script will:
   - Start Next.js on port 3000
   - Start a proxy on port 5000
   - Output the application URL

3. When you access the Replit URL, you'll be connecting through the proxy to your Next.js application.

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

## Requirements

- http-proxy npm package (`npm install http-proxy`)
- Node.js environment (provided by Replit)
- Next.js application configured with `npm run dev` script

## Modifying the Solution

If you need to modify the proxy behavior:

- Adjust timeouts in the scripts if Next.js takes longer to start
- Modify CORS headers if you're experiencing cross-origin issues
- Change binding addresses if needed for your specific network setup