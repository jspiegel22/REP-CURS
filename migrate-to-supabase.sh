#!/bin/bash
# Migration script to Supabase

set -e

echo "=== Starting Supabase migration process ==="
echo "This script will migrate your data from PostgreSQL to Supabase."
echo

# Step 1: Create migration files
echo "Step 1: Creating migration files..."
echo "Exporting schema from PostgreSQL..."
pg_dump -h $PGHOST -U $PGUSER -s $PGDATABASE --no-owner --no-acl > supabase/migrations/20250405_initial_schema.sql
echo "Exporting data from PostgreSQL..."
pg_dump -h $PGHOST -U $PGUSER -a $PGDATABASE --no-owner --no-acl > supabase/migrations/20250405_initial_data.sql
echo "Migration files created successfully."
echo

# Step 2: Check Supabase connection
echo "Step 2: Checking Supabase connection..."
node check-supabase-tables.js || true
echo

# Step 3: Create exec_sql function
echo "Step 3: Checking if exec_sql function exists in Supabase..."
node scripts/create_exec_sql_function.js
echo
echo "Important: You need to create the exec_sql function in Supabase to continue."
echo "Please go to your Supabase project, open the SQL Editor, and run the SQL displayed above."
echo
read -p "Have you created the exec_sql function in Supabase? (y/n) " exec_sql_response
if [[ ! "$exec_sql_response" =~ ^[Yy]$ ]]; then
  echo "Please create the exec_sql function and then run this script again."
  exit 1
fi

# Step 4: Run the migration
echo "Step 4: Running migration..."
node scripts/direct-migrate-to-supabase.js
if [ $? -ne 0 ]; then
  echo "Migration failed. Please check the error messages above."
  exit 1
fi
echo

# Step 5: Enable Supabase
echo "Step 5: Enabling Supabase..."
node enable-supabase.js
echo

echo "=== Migration Complete ==="
echo "Your data has been migrated to Supabase and the application is now configured to use Supabase."
echo "You may need to restart your application for the changes to take effect."
echo
echo "To verify the migration, run: node check-supabase-tables.js"