#!/bin/bash

# Kill any existing node processes
killall node 2>/dev/null

# Start Next.js in the background
echo "Starting Next.js server..."
npm run dev &
NEXT_PID=$!

# Wait for Next.js to be ready
echo "Waiting for Next.js to start..."
sleep 10

# Start the proxy server
echo "Starting proxy server on port 5000..."
node direct-proxy.js

# If proxy server exits, kill the Next.js process
kill $NEXT_PID 2>/dev/null