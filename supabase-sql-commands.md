# Supabase SQL Commands

This file contains SQL commands that need to be executed directly in the Supabase SQL Editor.

## 1. Create exec_sql Function

Execute this in the Supabase SQL Editor to create the exec_sql function:

```sql
-- Create a PostgreSQL function to execute SQL statements directly
-- This is used for schema migration and admin operations
CREATE OR REPLACE FUNCTION exec_sql(sql_query text)
RETURNS SETOF json
LANGUAGE plpgsql
SECURITY DEFINER -- This ensures the function runs with the privileges of the creator
AS $$
BEGIN
  RETURN QUERY EXECUTE sql_query;
END;
$$;
```

## 2. Example: Test exec_sql Function

After creating the function, you can test it with this command in the SQL Editor:

```sql
SELECT * FROM exec_sql('SELECT now() as current_time;');
```

## 3. Apply Schema Migration

If the GitHub integration method fails, you can use the exec_sql function to manually migrate the schema:

```sql
SELECT * FROM exec_sql('
-- Insert the entire schema.sql content here
-- For example:
CREATE TYPE public.adventure_category AS ENUM (''water'', ''land'', ''air'', ''cultural'', ''food'');
CREATE TYPE public.adventure_provider AS ENUM (''cabo-adventures'', ''wild-canyon'', ''cactus-tours'', ''other'');
CREATE TYPE public.booking_type AS ENUM (''villa'', ''resort'', ''adventure'', ''restaurant'', ''event'');

-- Table definitions follow
CREATE TABLE IF NOT EXISTS users (
  id SERIAL PRIMARY KEY,
  username VARCHAR(255) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  email VARCHAR(255) UNIQUE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- ... rest of the schema
');
```

## 4. Troubleshooting

If you encounter errors when using the exec_sql function, they might be syntax errors in your SQL.

Try executing smaller pieces of SQL to isolate the error:

```sql
SELECT * FROM exec_sql('CREATE TABLE test_table (id SERIAL PRIMARY KEY, name TEXT);');
```

## 5. Manual Table Verification

To verify a table exists:

```sql
SELECT * FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'users';
```