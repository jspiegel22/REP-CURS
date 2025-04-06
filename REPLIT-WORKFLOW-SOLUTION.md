# Replit Workflow Solution for Cabo Travel Guide

Due to the unique challenges of the Replit environment, we've created a custom solution for running our application properly.

## Current Setup

1. **Hybrid Architecture**: 
   - Next.js app for API routes and data access
   - Vite-powered React application for the frontend

2. **Port Conflicts**: 
   - Next.js runs on port 3000 (default)
   - Replit requires applications to run on port 5000

## Solutions Implemented

### Custom Proxy Server

We've implemented a lightweight proxy server in `direct-proxy.js` that:
- Listens on port 5000 (Replit's required port)
- Forwards all requests to the Next.js server on port 3000
- Adds proper CORS headers
- Handles error conditions gracefully

### Run Script

The `run.sh` script orchestrates:
1. Starting the Next.js server in the background
2. Waiting for Next.js to be ready
3. Starting the proxy server on port 5000 to make the app visible in Replit

### Redirects in Next.js Configuration

We've updated `next.config.js` to:
- Add proper CORS headers
- Configure rewrites for the Vite application
- Allow proper communication between components

## How to Run the Application

1. **Via Workflow**: 
   - The "Start application" workflow runs Next.js
   - In a separate terminal, run `node direct-proxy.js`

2. **Direct Method**:
   - Run `chmod +x run.sh && ./run.sh` to start both servers

## Tips for Development

- Use `?port=3000` query parameter in the Replit URL to access the app directly
- When making changes to the frontend, only restart the Vite part
- When changing API routes, restart the entire application