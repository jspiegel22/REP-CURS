#!/bin/bash
# This script starts a Next.js server based on the package.json config

# Set environment variables
export PORT=5000
export NODE_ENV=development

# Create a symbolic link from the mock config to where server/vite.ts expects it
# This way we don't need to modify server/vite.ts itself
ln -sf $(pwd)/server/mock-vite-config.ts $(pwd)/vite.config.ts

# Start the Next.js application
echo "Starting Next.js application on port 5000..."
npx next dev -p 5000