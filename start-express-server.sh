#!/bin/bash
# This script starts the Express server using tsx (improved ts-node)

# Set the port for our Express server
export PORT=5000
export NODE_ENV=development

# Create a symbolic link from the mock config to where server/vite.ts expects it
ln -sf $(pwd)/server/mock-vite-config.ts $(pwd)/vite.config.ts

# Start the Express server with tsx
echo "Starting Express server on port $PORT..."
npx tsx server/index.ts