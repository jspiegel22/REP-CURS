#!/bin/bash

# Kill any existing Node processes to ensure a clean start
pkill -f "node" || true
sleep 1

# Run the combined server script
echo "Starting application..."
NODE_OPTIONS="--max-old-space-size=1024" NODE_ENV=production node start-replit.js