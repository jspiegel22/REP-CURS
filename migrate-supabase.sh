#!/bin/bash

# Display headline
echo "=========================================="
echo "   Supabase Migration Helper Script"
echo "=========================================="
echo

# Step 1: Check Supabase configuration
echo "Step 1: Checking Supabase configuration..."
if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
  echo "Error: Missing Supabase credentials in environment variables."
  echo "Please make sure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set."
  exit 1
fi

if [ -z "$DATABASE_URL" ]; then
  echo "Error: Missing DATABASE_URL environment variable."
  exit 1
fi

if [ "$USE_SUPABASE" != "true" ]; then
  echo "Warning: USE_SUPABASE is not set to 'true' in environment variables."
  read -p "Would you like to proceed anyway? (y/n): " proceed
  if [ "$proceed" != "y" ]; then
    echo "Migration aborted."
    exit 1
  fi
fi

echo "Supabase configuration verified."
echo

# Step 2: Schema Migration
echo "Step 2: Running Schema Migration..."
echo "Note: Some steps require manual execution in the Supabase dashboard."
node scripts/direct-schema-migration.js

# Check if schema migration was successful
if [ $? -ne 0 ]; then
  echo "Schema migration encountered issues. Please check the output above."
  read -p "Would you like to proceed to data migration anyway? (y/n): " proceed
  if [ "$proceed" != "y" ]; then
    echo "Migration process halted."
    exit 1
  fi
fi

echo

# Step 3: Data Migration
echo "Step 3: Running Data Migration..."
read -p "Have you completed the manual schema migration in Supabase SQL Editor? (y/n): " schemaComplete
if [ "$schemaComplete" = "y" ]; then
  node scripts/direct-data-migration.js
  
  # Check if data migration was successful
  if [ $? -ne 0 ]; then
    echo "Data migration encountered issues. Please check the output above."
    exit 1
  fi
else
  echo "Please complete the manual schema migration first:"
  echo "1. Go to your Supabase dashboard"
  echo "2. Click on 'SQL Editor'"
  echo "3. Create a new query"
  echo "4. Paste the contents of ./supabase/migrations/20240404_initial_schema.sql"
  echo "5. Click 'Run' to execute the schema migration"
  echo
  echo "After completing the manual schema migration, run this script again."
  exit 1
fi

echo
echo "=========================================="
echo "   Migration Process Complete!"
echo "=========================================="
echo
echo "Now you can start your application with USE_SUPABASE=true"
echo "To run the server: ./start-proxy-server.sh"