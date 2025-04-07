# Replit Workflow Guide

This document outlines the Replit-specific workflow solutions implemented in the Cabo Travel Platform.

## Problem: Port Configurations

**Challenge**: 
Replit expects web applications to run on port 5000, while Next.js runs on port 3000 by default.

**Solution**:
We've implemented a proxy server that:
1. Binds to port 5000 (which Replit expects)
2. Forwards all traffic to the Next.js application running on port 3000
3. Starts automatically with the Replit workflow

## Implementation Details

### Entry Point

The `replit-entry.js` file serves as the main entry point for the application in Replit. This file:

1. Immediately starts a proxy server on port 5000
2. Then starts the Next.js application on port 3000
3. Properly forwards all requests between ports

### Proxy Server

The proxy implementation:
1. Uses minimal dependencies for reliability
2. Handles proper header forwarding
3. Manages WebSocket connections for hot reloading
4. Provides transparent proxying (clients aren't aware of the port redirection)

### Error Handling

The proxy includes robust error handling:
1. Catches and logs connection errors
2. Automatically retries connections to Next.js if the application is restarting
3. Gracefully handles shutdown signals

## How It Works

When the Replit "Start application" workflow runs:

1. `node replit-entry.js` is executed
2. The proxy immediately starts on port 5000 (making the app visible in Replit)
3. The Next.js server starts on port 3000
4. All traffic is transparently proxied between ports

## Troubleshooting

If the application doesn't appear in the Replit preview:

1. Check if the proxy server is running
2. Verify that port 5000 is bound successfully
3. Check if the Next.js server started successfully on port 3000
4. Look for any connection errors in the logs

## Limitations

- WebSocket connections might experience slight delays due to the proxy
- Some complex headers might not be perfectly forwarded
- Performance may be marginally impacted by the additional proxy layer

By using this approach, we ensure the Cabo Travel Platform runs reliably in the Replit environment while maintaining all Next.js functionality.
