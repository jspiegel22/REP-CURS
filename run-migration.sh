#!/bin/bash

echo "Starting Supabase migration process..."

# Check for required environment variables
if [ -z "$SUPABASE_URL" ] || [ -z "$SUPABASE_SERVICE_ROLE_KEY" ]; then
  echo "Error: Missing Supabase credentials. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env file."
  exit 1
fi

if [ -z "$DATABASE_URL" ]; then
  echo "Error: Missing DATABASE_URL environment variable."
  exit 1
fi

# Run the combined migration script
echo "Running combined migration process..."
node migrate-combined.js

if [ $? -eq 0 ]; then
  echo "✅ Migration completed successfully!"
else
  echo "❌ Migration process completed with errors. See above logs for details."
  echo "You may need to set up GitHub integration in the Supabase dashboard."
  echo "Instructions:"
  echo "1. Go to https://supabase.com/dashboard and select your project"
  echo "2. Navigate to Settings > Integrations"
  echo "3. Connect your GitHub repository"
  echo "4. Ensure migrations are in the supabase/migrations/ folder"
  exit 1
fi

# Verify the migration
echo "Verifying migration..."
node check-supabase-migration.js

if [ $? -eq 0 ]; then
  echo "✅ Migration verified successfully! All tables and functions are accessible."
else
  echo "❌ Migration verification failed. Some tables or functions may not be accessible."
  exit 1
fi

echo "Migration process complete!"