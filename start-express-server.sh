#!/bin/bash
# This script starts the Express server using ts-node

# Set the port for our Express server
export PORT=3000

# Start the Express server with ts-node
echo "Starting Express server on port $PORT..."
npx ts-node server/index.ts