#!/bin/bash

# Start both Express server and Next.js in parallel
PORT=5000 NODE_OPTIONS="--max-old-space-size=1024" NODE_ENV=production npx concurrently \
  "npx next dev --port 3000" \
  "npx tsx ./proxy-server.ts"