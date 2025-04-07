# Replit Port Solution

## Problem

Replit expects applications to run on port 5000, but Next.js defaults to port 3000. This causes Replit workflows to fail with the error message:

```
Error in river service (workflows - agentRestartRunWorkflow), code: DIDNT_OPEN_A_PORT, message: run command "Start application" didn't open port `5000` after 20000ms.
```

## Solution

We've created a robust solution for this port mismatch with the following components:

### 1. `replit-entry.js`

This is the main entry point script that:
- Opens port 5000 immediately with a proxy server
- Dynamically detects which port Next.js is running on (3000, 3001, etc.)
- Forwards all requests from port 5000 to the detected Next.js port
- Includes error handling and WebSocket support for hot reloading

### 2. Implementation Steps

To implement this solution:

1. **Update Workflow Command**
   - Change the workflow command from `npm run dev` to `node replit-entry.js`
   - This ensures the proxy starts immediately, satisfying Replit's port check

2. **Verify the Proxy**
   - Navigate to `/health-check` in your application
   - This page will show you the current port configuration
   - Confirm the proxy status is "Active"

## How It Works

When the `replit-entry.js` script runs:

1. It immediately creates an HTTP server on port 5000
2. It starts the Next.js development server on port 3000
3. If Next.js uses a different port (e.g., 3001 because 3000 is already in use), the script detects this automatically
4. The proxy server forwards all HTTP requests and WebSocket connections to the correct Next.js port
5. If Next.js is still starting up, the proxy shows a friendly "loading" page instead of an error

## Technical Details

- The proxy uses the `http-proxy` package to handle request forwarding
- Port detection happens through:
  - Monitoring Next.js console output for port information
  - Active health checks to various potential ports
- WebSocket connections (needed for hot reloading) are properly forwarded
- CORS headers are added to all responses
- Error handling ensures the proxy stays running even if Next.js crashes

## Files Created/Modified

1. `replit-entry.js` - Main entry script that combines proxy and Next.js startup
2. `check-deps.js` - Helper script to ensure all dependencies are installed
3. `server/routes.ts` - Added port information to health check endpoint
4. `client/src/pages/health-check.tsx` - Created health check page to monitor ports

## Next Steps

1. Update your Replit workflow to use `node replit-entry.js` as the command
2. Test the application to ensure everything works as expected
3. If using the health check page, navigate to `/health-check` to verify the port configuration