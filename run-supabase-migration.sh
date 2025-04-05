#!/bin/bash
# Run the Supabase migration

echo "Running Supabase migration..."

# Step 1: Check if the exec_sql function exists
echo "Step 1: Checking if exec_sql function exists"
node scripts/create_exec_sql_function.js

echo "The exec_sql function must exist in Supabase to continue."
echo "If it doesn't exist yet, you'll need to create it manually using the SQL that was displayed above."
echo "Have you created the exec_sql function in Supabase? (y/n)"
read response

if [[ ! "$response" =~ ^[Yy]$ ]]; then
  echo "Please create the exec_sql function in Supabase and run this script again."
  exit 1
fi

# Step 2: Run the direct migration
echo "Step 2: Running direct migration to Supabase"
node scripts/direct-migrate-to-supabase.js

if [ $? -ne 0 ]; then
  echo "Migration failed! Please check the error messages above."
  exit 1
fi

# Step 3: Update the USE_SUPABASE environment variable
echo "Step 3: Updating environment variable"
grep -q "USE_SUPABASE=" .env
if [ $? -eq 0 ]; then
  # Update existing variable
  sed -i 's/USE_SUPABASE=.*/USE_SUPABASE=true/' .env
else
  # Add new variable
  echo "USE_SUPABASE=true" >> .env
fi

echo "Migration completed successfully!"
echo "The USE_SUPABASE environment variable has been set to true."
echo "The application will now use Supabase for storage."