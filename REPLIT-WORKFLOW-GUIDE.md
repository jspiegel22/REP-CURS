# Replit Workflow Guide

## Current Issue
Replit expects applications to run on port 5000, but Next.js defaults to port 3000. This causes workflows to fail with:

```
Error in river service (workflows - agentRestartRunWorkflow), code: DIDNT_OPEN_A_PORT, message: 
run command "Start application" didn't open port `5000` after 20000ms.
```

## Solution

We've created a port forwarding solution that:
1. Opens port 5000 immediately with a proxy server
2. Dynamically detects which port Next.js is running on
3. Forwards all requests from port 5000 to the detected Next.js port

## How to Update the Workflow

1. Go to the **Tools** menu in Replit
2. Select **Workflow**
3. Edit the "Start application" workflow
4. Replace the current command `npm run dev` with:
   ```
   node replit-entry.js
   ```
5. Save the workflow
6. Run the workflow

## Verification

After updating the workflow and running it:
1. Wait for the application to start
2. Navigate to `/health-check` in your browser
3. Verify that the proxy is active and shows the correct port information

## Technical Notes

- The `replit-entry.js` script handles everything automatically
- It includes error handling and retry logic
- It supports WebSocket forwarding for hot reloading
- It will show a friendly loading page when Next.js is still starting up