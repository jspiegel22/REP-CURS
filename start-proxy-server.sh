#!/bin/bash

echo "Starting Next.js app in the background..."
NODE_ENV=production PORT=3000 npm run dev &
NEXT_PID=$!

echo "Waiting for Next.js to start..."
sleep 5

echo "Starting proxy server..."
PORT=5000 npx tsx ./proxy-server.ts

# Cleanup
kill $NEXT_PID