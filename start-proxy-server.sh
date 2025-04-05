#!/bin/bash

# Kill any running node processes
pkill -f "node" || true

echo "Starting Express proxy server directly..."
PORT=5000 NODE_OPTIONS="--max-old-space-size=1024" NODE_ENV=production npx tsx ./proxy-server.ts