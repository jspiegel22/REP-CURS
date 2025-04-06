# Replit Workflow Solution

## The Problem

Next.js applications default to running on port 3000, but Replit requires applications to be accessible on port 5000 for proper integration with its platform.

## Solution Overview

We've implemented several solutions to address this port mismatch:

### 1. Direct Proxy (direct-proxy.js)

A lightweight proxy server that:
- Listens on port 5000
- Forwards all requests to the Next.js application on port 3000
- Handles WebSocket connections for hot module reloading
- Adds proper CORS headers

### 2. Simple Proxy with Next.js Starter (simple-proxy.js)

A combined script that:
- Starts the Next.js application on port 3000
- Creates a proxy server on port 5000
- Forwards all traffic
- Handles graceful shutdown

### 3. Enhanced Development Starter (start-on-port-5000.js)

A more robust solution that:
- Starts Next.js on port 3000
- Waits for Next.js to be ready before starting the proxy
- Provides detailed logging
- Handles error cases
- Properly shuts down both servers on termination

### 4. Lightweight Port 5000 Solution (port-5000.js)

A minimal proxy implementation that:
- Forwards HTTP requests from port 5000 to 3000
- Handles WebSocket connections
- Provides error handling

### 5. Run on Port 5000 Script (run-on-5000.js)

Another implementation that:
- Launches Next.js using npm run dev
- Sets up a proxy on port 5000
- Uses setTimeout to ensure Next.js has time to start

## Recommended Approach

For most cases, we recommend using `run-on-5000.js` as it provides:
- Simple, clean implementation
- Reliable forwarding
- Proper error handling
- Graceful shutdown

## Usage

To use our port solution:

1. Ensure the workflow is set to run the script:
   ```
   node run-on-5000.js
   ```

2. When the application starts, you'll see output like:
   ```
   Starting Next.js application...
   Proxy server running on port 5000
   Forwarding requests to Next.js on port 3000
   Access your app at: https://your-repl-name.username.repl.co
   ```

3. The application should now be accessible through Replit's interface.

## Troubleshooting

If you encounter issues:

- Check that port 5000 is not already in use
- Verify that Next.js can start normally on port 3000
- Look for proxy error messages in the console
- Ensure all dependencies are installed (http-proxy is required)

## Implementation Details

The proxy solutions use the following key components:

1. `http-proxy` package for request forwarding
2. WebSocket handling for hot module reloading support
3. CORS headers for cross-origin requests
4. Graceful shutdown handlers for clean process termination

These implementations avoid modifying the core Next.js configuration while ensuring compatibility with Replit's requirements.