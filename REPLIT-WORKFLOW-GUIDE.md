# Updating Your Replit Workflow

This guide will help you update your Replit workflow to use the new proxy solution that ensures the application runs correctly on port 5000.

## Step 1: Check the Dependencies

First, let's make sure all the required dependencies are installed:

```bash
node check-deps.js
```

This script will verify that everything needed for the port proxy is correctly installed.

## Step 2: Update the Replit Workflow

1. Click on the ⚙️ gear icon next to the "Run" button in the Replit interface
2. Find the "Start application" workflow
3. Change the command from:
   ```
   npm run dev
   ```
   
   to:
   ```
   node replit-entry.js
   ```
4. Click "Done" to save the changes

## Step 3: Restart the Workflow

1. Click on the "Stop" button if the workflow is currently running
2. Click on the "Run" button to start the updated workflow

## Step 4: Verify the Application is Working

1. Check if the application is running by visiting the webview URL
2. Try accessing the `/debug` page to see detailed diagnostic information
3. You can also run `node monitor-app.js` in a separate Replit Shell tab to check the status of different components

## Troubleshooting Tips

If you encounter issues:

1. **Application doesn't start**: Run `node check-deps.js` to make sure all dependencies are installed
2. **Application starts but shows an error page**: Wait 10-15 seconds for Next.js to fully initialize, then refresh
3. **Port conflicts**: Try the simpler proxy script with `node direct-port-5000-simple.js`
4. **Replit shows "Project didn't open port 5000"**: Make sure you're using the correct workflow command and restart the workflow

## Alternative Solution

If you continue to have issues, you can try the simpler proxy solution:

1. Update the workflow command to:
   ```
   node direct-port-5000-simple.js
   ```
2. Restart the workflow

## Need More Help?

If you're still experiencing issues:

1. Run `node monitor-app.js` to get detailed diagnostics
2. Check the logs in the workflow console for any error messages
3. Try accessing the `/health-check` page for system status