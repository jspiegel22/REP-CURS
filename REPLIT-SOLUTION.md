# REPLIT PORT 5000 SOLUTION

## The Problem

Replit requires applications to listen on port 5000, but Next.js runs on port 3000 by default. This conflict prevents the application from being visible in Replit's webview.

## The Solution

We've created a simple proxy server that:
1. Immediately opens port 5000 (required by Replit)
2. Starts Next.js on port 3000
3. Forwards all requests from port 5000 to port 3000

## How to Use This Solution

1. Update your Replit workflow:
   - Click the ⚙️ gear icon next to the "Run" button
   - Change the command from `npm run dev` to `node direct-port-5000-simple.js`
   - Click "Done" to save

2. Test the solution:
   - Run `node monitor-app.js` in a separate Shell tab to check if everything is working
   - Visit `/debug` in the webview to see detailed app information

## Files Included

- `direct-port-5000-simple.js`: Ultra-simple proxy server with no fancy detection or complex logic
- `monitor-app.js`: Script to check if your application is properly running
- `client/src/pages/debug.tsx`: Debug page to verify the application is working
- `client/src/pages/api/health.ts`: API endpoint for checking application health

## Troubleshooting

If the application still doesn't work:

1. Make sure the workflow is running `direct-port-5000-simple.js`
2. Check for any console errors
3. Run `node monitor-app.js` to diagnose issues
4. Visit `/debug` to view system information

## Important Notes

- This solution is specifically for Replit and isn't needed for local development
- Don't modify the proxy script unless absolutely necessary
- If you need to use a different port, update both the proxy script and monitor script

## Screenshot

Access the `/debug` page in your application to see a visual confirmation that everything is working correctly.