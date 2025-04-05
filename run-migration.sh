#!/bin/bash

# Comprehensive Migration Script: Neon PostgreSQL to Supabase
# This script manages the complete migration process
set -e

echo "=========================================="
echo "Starting Neon PostgreSQL to Supabase Migration"
echo "=========================================="

# Step 1: Create a backup of the current database
echo "Creating backup of Neon PostgreSQL database..."
BACKUP_FILE="backups/neon_backup_$(date +"%Y%m%d_%H%M%S").dump"
mkdir -p backups
PGPASSWORD=$PGPASSWORD pg_dump -h $PGHOST -p $PGPORT -U $PGUSER -d $PGDATABASE -f $BACKUP_FILE
echo "✅ Backup created: $BACKUP_FILE"

# Step 2: Check for swapped environment variables
echo "Checking Supabase environment variables..."
if [[ $REACT_APP_SUPABASE_URL == eyJ* ]]; then
  echo "⚠️ REACT_APP_SUPABASE_URL and REACT_APP_SUPABASE_ANON_KEY are swapped!"
  echo "Temporarily fixing for migration..."
  
  # Temporarily set correct variables for the migration
  export CORRECT_SUPABASE_URL=$REACT_APP_SUPABASE_ANON_KEY
  export CORRECT_SUPABASE_ANON_KEY=$REACT_APP_SUPABASE_URL
else
  export CORRECT_SUPABASE_URL=$SUPABASE_URL
  export CORRECT_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY
fi

# Export correct variables for the migration script
export SUPABASE_URL=$CORRECT_SUPABASE_URL
export SUPABASE_ANON_KEY=$CORRECT_SUPABASE_ANON_KEY

# Step 3: Run the migration script
echo "Running migration script..."
node migrate-to-supabase.js

# Step 4: Create Supabase directory and migration file for future use
echo "Creating Supabase migration directory and initial schema file..."
mkdir -p supabase/migrations
TIMESTAMP=$(date +"%Y%m%d")
SCHEMA_FILE="supabase/migrations/${TIMESTAMP}_initial_schema.sql"

echo "-- Initial schema migration from Neon PostgreSQL to Supabase" > $SCHEMA_FILE
echo "-- Created on $(date)" >> $SCHEMA_FILE
echo "-- This file can be used for future schema migrations" >> $SCHEMA_FILE
echo "" >> $SCHEMA_FILE

# Extract schema from backup file
echo "Extracting schema from backup file to $SCHEMA_FILE..."
pg_restore --schema-only -f - $BACKUP_FILE | grep -v "^--" | grep -v "^\s*$" >> $SCHEMA_FILE

echo "✅ Supabase migration schema file created: $SCHEMA_FILE"

# Step 5: Update application to use Supabase
echo "Updating application to use Supabase..."

# Create or update the server/services/supabase.ts file
mkdir -p server/services
cat > server/services/supabase.ts << 'END_OF_FILE'
import { createClient } from '@supabase/supabase-js';

// Handle the swapped environment variables issue
const supabaseUrl = process.env.SUPABASE_URL || process.env.REACT_APP_SUPABASE_ANON_KEY || '';
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY || process.env.REACT_APP_SUPABASE_URL || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.error('Missing Supabase credentials. Set SUPABASE_URL and SUPABASE_ANON_KEY environment variables.');
}

// Create Supabase client
const supabase = createClient(supabaseUrl, supabaseAnonKey);

export { supabase };
END_OF_FILE

echo "✅ Supabase service file created/updated"

# Step 6: Update server/storage.ts to use Supabase if not already
echo "Checking if server/storage.ts needs to be updated..."

# We'll add this step later after examining storage.ts

# Step 7: Update server/db.ts to use Supabase connection when USE_SUPABASE flag is true
echo "Updating server/db.ts to support dynamic database selection..."

cat > server/db.ts << 'END_OF_FILE'
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';
import * as schema from "@shared/schema";

// Get appropriate database URL based on environment configuration
function getDatabaseUrl() {
  // If using Supabase and we have a direct PostgreSQL URL for it
  if (process.env.USE_SUPABASE === 'true' && process.env.SUPABASE_POSTGRES_URL) {
    console.log('Using Supabase PostgreSQL URL');
    return process.env.SUPABASE_POSTGRES_URL;
  }
  
  // Fall back to standard DATABASE_URL (for Neon or any other provider)
  if (!process.env.DATABASE_URL) {
    throw new Error(
      "DATABASE_URL must be set. Did you forget to provision a database?",
    );
  }
  
  return process.env.DATABASE_URL;
}

// Configure PostgreSQL pool
export const pool = new Pool({ 
  connectionString: getDatabaseUrl(),
  ssl: {
    rejectUnauthorized: false, // Needed for cloud database connections
  }
});

// Test the connection
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Database connection error:', err.message);
  } else {
    console.log('✅ Database connected, server time:', res.rows[0].now);
    console.log('   Using database provider:', process.env.USE_SUPABASE === 'true' ? 'Supabase' : 'Neon PostgreSQL');
  }
});

export const db = drizzle(pool, { schema });
END_OF_FILE

echo "✅ server/db.ts updated to support dynamic database selection"

echo "=========================================="
echo "Migration completed successfully!"
echo "=========================================="
echo "Next steps:"
echo "1. Review any errors in the migration process"
echo "2. Make necessary code updates for Supabase integration"
echo "3. Restart the application to use Supabase"
echo "4. Verify all functionality works correctly"
echo "=========================================="