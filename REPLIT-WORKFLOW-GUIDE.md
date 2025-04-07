# Replit Workflow Guide

This guide explains how to properly configure the Replit workflow for this project.

## Why This Is Important

Replit requires applications to listen on port 5000 to be properly detected and displayed in the webview. However, Next.js by default runs on port 3000. This creates a conflict that needs to be resolved.

## The Solution: replit-entry.js

We've created a special script called `replit-entry.js` that does the following:

1. Immediately starts a proxy server on port 5000 (which Replit requires)
2. Starts the Next.js development server on port 3000 (or another available port)
3. Forwards all requests from port 5000 to the Next.js server
4. Automatically detects which port Next.js is running on if it changes
5. Provides helpful error messages if there are any issues

## How to Configure the Workflow

To make sure your application runs correctly on Replit, you need to update the workflow settings:

1. Go to the "▶ Run" button at the top of the Replit interface
2. Click on the gear icon (⚙️) next to the Run button
3. In the "Commands" section, find "Start application" 
4. Change the command from "npm run dev" to "node replit-entry.js"
5. Click "Done" to save your changes
6. Click the "▶ Run" button to restart your application

## Verifying Everything Works

Once you've updated the workflow settings, you can verify that everything is working by:

1. Checking the console output for messages like "Proxy server running on port 5000" and "Found Next.js running on port X"
2. Opening the webview and navigating to /api/health or /health-check to see the health status page
3. Testing that your application's frontend and API endpoints work correctly

## Troubleshooting

If you encounter issues:

- **"Application didn't open port 5000" error**: Make sure you've updated the workflow command as described above
- **Blank screen in webview**: Check the console for errors; the Next.js server might have failed to start
- **API requests failing**: Verify that the proxy is correctly forwarding requests to Next.js

## Additional Notes

- Do not modify the `replit-entry.js` script unless you understand how it works
- If you need to change ports or add new startup parameters, do so through environment variables
- The health check endpoint at `/api/health` is used for diagnostics
- This setup allows your application to run correctly on Replit's infrastructure while using Next.js's development features

Remember that this configuration is specific to the Replit environment. If you're running the application locally or deploying it elsewhere, you would use different commands (like `npm run dev` directly).