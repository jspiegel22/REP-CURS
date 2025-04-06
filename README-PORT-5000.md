# How to Access the Application

Because of Replit's constraints, the application runs on port 3000 but needs to be accessed through port 5000. 

## Viewing the Application

1. **Direct access URL**:
   ```
   https://603d1be0-7877-4e31-a83b-029d972cc9fd-00-cxbuxrzsxtnb.janeway.replit.dev/?port=3000
   ```

2. **Starting the application**:
   - Run the "Start application" workflow which starts Next.js
   - In a separate terminal, run: `node index.js` to start the proxy server

## Troubleshooting

If the application doesn't load properly:
1. Make sure both Next.js and the proxy server are running
2. Check that you're using the correct URL with the port parameter
3. Restart the workflow if needed

## Deploying the Application

When you're ready to deploy, use Replit's deploy button. This will create a production version of your application.