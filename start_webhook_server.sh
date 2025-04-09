#!/bin/bash

# Start the webhook server for processing webhook events
# This script starts the FastAPI webhook server that handles webhook deliveries

echo "Starting webhook server..."
echo "This server will receive webhook events from the application and forward them to configured endpoints"
echo ""

# Check for Python and required packages
if ! command -v python3 &> /dev/null; then
  echo "ERROR: Python 3 not found. Please install Python 3 to run the webhook server."
  exit 1
fi

# Check for required Python packages
MISSING_PACKAGES=()
for package in fastapi uvicorn psycopg2 pydantic; do
  if ! python3 -c "import $package" &> /dev/null; then
    MISSING_PACKAGES+=($package)
  fi
done

if [ ${#MISSING_PACKAGES[@]} -gt 0 ]; then
  echo "Missing required Python packages: ${MISSING_PACKAGES[*]}"
  echo "Please install them with:"
  echo "pip install ${MISSING_PACKAGES[*]}"
  exit 1
fi

echo "All required packages found. Starting server..."
echo ""

# Go to the API directory and start the server
cd api
uvicorn main:app --host 0.0.0.0 --port 8000 --reload

# Note: The --reload flag will automatically restart the server when files change
# Remove it for production deployments