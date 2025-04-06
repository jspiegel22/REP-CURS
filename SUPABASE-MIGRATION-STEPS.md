# Supabase Migration Steps

This document provides step-by-step instructions for manually migrating your database from Neon to Supabase.

## Prerequisites

- A Supabase account and project
- Access to the Supabase Dashboard
- The migration files already created in this repository

## Step 1: Access the Supabase SQL Editor

1. Log in to your Supabase dashboard
2. Select your project
3. Click on "SQL Editor" in the left sidebar
4. Click "New Query" to create a new SQL query

## Step 2: Create the Database Schema

1. Open the file `supabase/migrations/2025_04_05_initial_schema.sql` in this repository
2. Copy the entire contents of this file
3. Paste it into the SQL Editor in Supabase
4. Click "Run" to execute the SQL and create all tables, indexes, and constraints

Notes:
- This will create all the necessary tables with the correct structure
- If you encounter any errors, try executing smaller portions of the SQL at a time
- You may need to remove the PostgreSQL-specific commands at the beginning of the file

## Step 3: Import the Data

1. Open the file `supabase/seed/2025_04_05_seed_data.sql` in this repository
2. Copy the entire contents of this file
3. Paste it into a new SQL query in the Supabase SQL Editor
4. Click "Run" to import all the data

Notes:
- This will populate all tables with the existing data
- You may need to split this into smaller chunks if it's too large for the SQL Editor

## Step 4: Verify the Migration

Run the following SQL queries to verify the data was imported correctly:

```sql
-- Count records in key tables
SELECT 'users' as table_name, COUNT(*) as record_count FROM users
UNION ALL
SELECT 'villas' as table_name, COUNT(*) as record_count FROM villas
UNION ALL
SELECT 'adventures' as table_name, COUNT(*) as record_count FROM adventures
UNION ALL
SELECT 'bookings' as table_name, COUNT(*) as record_count FROM bookings
UNION ALL
SELECT 'guide_requests' as table_name, COUNT(*) as record_count FROM guide_requests;
```

## Step 5: Update Your Application

Once the migration is complete, your application is already configured to use Supabase as its database.

1. Ensure the following environment variables are set:
   - `SUPABASE_URL` - Your Supabase project URL
   - `SUPABASE_ANON_KEY` - Your Supabase anon/public key
   - `SUPABASE_SERVICE_ROLE_KEY` - Your Supabase service role key

2. Make sure the `USE_SUPABASE` environment variable is set to `true` in your `.env` file

## Alternative: Direct PostgreSQL Connection

If you prefer to connect directly to the PostgreSQL database in Supabase:

1. In the Supabase dashboard, go to Project Settings > Database
2. Find the "Connection string" or "Connection parameters" section
3. Copy the connection details
4. Update your `DATABASE_URL` environment variable with these details

## Troubleshooting

If you encounter any issues during the migration:

1. Check for error messages in the SQL Editor
2. For permissions issues, make sure you're using the service role key
3. For data type issues, check if the schema matches between Neon and Supabase

For specific tables that fail to import, you can try recreating just those tables:

```sql
-- Example for recreating a specific table
DROP TABLE IF EXISTS table_name;
CREATE TABLE table_name (
  -- column definitions
);

-- Then import just the data for this table
INSERT INTO table_name VALUES
-- data rows
;
```
