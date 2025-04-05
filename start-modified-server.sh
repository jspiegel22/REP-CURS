#!/bin/bash

# Start Next.js in the background
echo "Starting Next.js in the background..."
npm run dev &

# Wait a bit for Next.js to start
sleep 10

# Start the proxy server
echo "Starting Express proxy server..."
npx tsx ./proxy-server.ts