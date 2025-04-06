#!/bin/bash

# This script starts both the Next.js server and the proxy server
# The Next.js server runs on port 3000 (default)
# The proxy server forwards requests from port 5000 to port 3000
# This is required for Replit to properly detect the application

echo "Starting Cabo Travel Platform..."

# Load environment variables from .env file if it exists
if [ -f .env ]; then
  export $(cat .env | grep -v '^#' | xargs)
  echo "Loaded environment variables from .env"
fi

# Check if the port-5000.js script exists
if [ ! -f port-5000.js ]; then
  echo "Error: port-5000.js not found"
  exit 1
fi

echo "Starting combined servers (Next.js + Proxy)..."
node start-combined-servers.js