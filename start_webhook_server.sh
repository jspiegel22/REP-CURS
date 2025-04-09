#!/bin/bash

# Script to start the webhook server
echo "Starting Cabo Webhook server..."
echo "This server handles webhooks to external services like Make.com, Zapier, and Airtable"
echo "Press Ctrl+C to stop the server"
echo ""

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
  echo "Error: Python 3 is required but not installed."
  exit 1
fi

# Check if the required packages are installed
if ! python3 -c "import fastapi" &> /dev/null; then
  echo "Installing required Python packages..."
  pip install fastapi uvicorn psycopg2-binary pydantic requests
fi

# Start the server
cd api
python3 -m uvicorn main:app --host 0.0.0.0 --port 8000 --reload

# Note: This script will keep running until manually interrupted (Ctrl+C)