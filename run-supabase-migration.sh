#!/bin/bash

echo "Applying Supabase migrations..."

# Apply schema
echo "1. Applying DB schema to Supabase..."
node scripts/apply-supabase-migration.js

# Check if schema application was successful
if [ $? -ne 0 ]; then
  echo "Schema application failed. Please check the logs."
  exit 1
fi

# Migrate data
echo "2. Migrating data to Supabase..."
node scripts/migrate-data-to-supabase.js

# Check if data migration was successful
if [ $? -ne 0 ]; then
  echo "Data migration failed. Please check the logs."
  exit 1
fi

echo "Supabase migration completed successfully!"
