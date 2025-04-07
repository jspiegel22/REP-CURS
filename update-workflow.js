/**
 * This script provides instructions for updating the Replit workflow configuration.
 * The web application requires port 5000 to be configured in the workflow.
 */

console.log(`
=====================================================
  HOW TO FIX WORKFLOW CONFIGURATION IN REPLIT UI
=====================================================

Your application is running correctly, but the Replit workflow 
needs to be configured to wait for port 5000 for the webview to work properly.

Follow these steps to update the workflow configuration:

1. Go to the "Workflows" tab in the left sidebar of the Replit IDE
2. Click on the "Start application" workflow
3. Click the "Edit" button (pencil icon)
4. Find the "wait_for_port" field and set it to 5000
5. Click "Save" to apply the changes
6. Restart the workflow

This will ensure that Replit waits for your application to start 
on port 5000 before showing the webview.

Your guide submission forms should then be accessible at:
- /test-form
- /test-submission

And the guide PDF at:
- /guides/ultimate-cabo-guide-2025.pdf

=====================================================
`);