#!/bin/bash

# Start the standalone server
PORT=5000 NODE_OPTIONS="--max-old-space-size=1024" NODE_ENV=production node standalone-server.js