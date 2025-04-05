#!/bin/bash
# Migration script to Supabase with Airtable compatibility validation

set -e

echo "=== Starting Supabase migration process ==="
echo "This script will migrate your data from PostgreSQL to Supabase."
echo "The process includes validation of Airtable field compatibility."
echo

# Step 1: Validate Airtable field compatibility
echo "Step 1: Validating Airtable field compatibility..."
if [ -z "$AIRTABLE_API_KEY" ] || [ -z "$AIRTABLE_BASE_ID" ]; then
  echo "Warning: AIRTABLE_API_KEY or AIRTABLE_BASE_ID environment variables not set."
  echo "Airtable validation will be skipped."
  read -p "Continue without Airtable validation? (y/n) " continue_without_airtable
  if [[ ! "$continue_without_airtable" =~ ^[Yy]$ ]]; then
    echo "Please set the Airtable environment variables and try again."
    exit 1
  fi
else
  echo "Running Airtable field validation..."
  node scripts/validate-airtable-fields.js
  if [ $? -ne 0 ]; then
    echo "Airtable validation encountered issues. Review the warnings above."
    read -p "Continue with migration despite validation warnings? (y/n) " continue_with_warnings
    if [[ ! "$continue_with_warnings" =~ ^[Yy]$ ]]; then
      echo "Migration aborted. Please fix the validation issues and try again."
      exit 1
    fi
  fi
fi
echo

# Step 2: Create migration files
echo "Step 2: Creating migration files..."
echo "Exporting schema from PostgreSQL..."
pg_dump -h $PGHOST -U $PGUSER -s $PGDATABASE --no-owner --no-acl > supabase/migrations/20250405_initial_schema.sql
echo "Exporting data from PostgreSQL..."
pg_dump -h $PGHOST -U $PGUSER -a $PGDATABASE --no-owner --no-acl > supabase/migrations/20250405_initial_data.sql
echo "Migration files created successfully."
echo

# Step 3: Check Supabase connection
echo "Step 3: Checking Supabase connection..."
node check-supabase-tables.js || true
echo

# Step 4: Create exec_sql function
echo "Step 4: Checking if exec_sql function exists in Supabase..."
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

# Step 5: Run the migration
echo "Step 5: Running migration..."
node scripts/direct-migrate-to-supabase.js
if [ $? -ne 0 ]; then
  echo "Migration failed. Please check the error messages above."
  exit 1
fi
echo

# Step 6: Enable Supabase
echo "Step 6: Enabling Supabase..."
node enable-supabase.js
echo

# Step 7: Verify data integrity
echo "Step 7: Verifying data integrity..."
node scripts/verify-migration-integrity.js
echo

echo "=== Migration Complete ==="
echo "Your data has been migrated to Supabase and the application is now configured to use Supabase."
echo "You may need to restart your application for the changes to take effect."
echo
echo "To verify the migration again at any time:"
echo "- For table existence: node check-supabase-tables.js"
echo "- For data integrity: node scripts/verify-migration-integrity.js"
echo "- For Airtable compatibility: node scripts/validate-airtable-fields.js"