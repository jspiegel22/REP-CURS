# Supabase Migration Guide

This guide outlines three different approaches to migrate your database schema to Supabase:

1. **GitHub Integration** - Recommended, automated approach
2. **Direct PostgreSQL Connection** - Manual but reliable approach
3. **SQL Editor Manual Execution** - Last resort approach

## Prerequisites

Ensure you have the following environment variables set in your `.env` file:

```
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
```

For the direct PostgreSQL approach, you'll also need:

```
SUPABASE_PG_URL=postgresql://postgres:password@db.your-project.supabase.co:5432/postgres
```

## Option 1: GitHub Integration (Recommended)

Supabase can automatically apply migrations from your GitHub repository.

### Setup

1. Run the setup script:
   ```
   node setup-github-integration.js
   ```

2. In the Supabase Dashboard:
   - Go to "Settings" > "Integrations"
   - Connect your GitHub repository
   - Set migrations path to `supabase/migrations/`
   - Select the branch to track (typically `main`)

3. Push changes to GitHub:
   ```
   git add supabase/migrations/
   git commit -m "Add Supabase migrations"
   git push
   ```

4. Verify migration success:
   ```
   node check-supabase-migration.js
   ```

## Option 2: Direct PostgreSQL Connection

Connect directly to the Supabase PostgreSQL database and apply migrations.

### Setup

1. Get the PostgreSQL connection string:
   ```
   node get-supabase-pg-url.js
   ```
   Follow the instructions to add the connection string to your `.env` file.

2. Apply migrations directly:
   ```
   node direct-pg-migration.js
   ```

3. Verify migration success:
   ```
   node check-supabase-migration.js
   ```

## Option 3: SQL Editor Manual Execution

As a last resort, you can manually execute SQL in the Supabase SQL Editor.

### Steps

1. Go to the Supabase Dashboard and select your project
2. Navigate to "SQL Editor"
3. Create the exec_sql function:
   ```sql
   CREATE OR REPLACE FUNCTION exec_sql(sql_query text)
   RETURNS SETOF json
   LANGUAGE plpgsql
   SECURITY DEFINER
   AS $$
   BEGIN
     RETURN QUERY EXECUTE sql_query;
   END;
   $$;
   ```

4. Copy the contents of `schema.sql` and execute it
5. Verify tables exist:
   ```sql
   SELECT table_name 
   FROM information_schema.tables 
   WHERE table_schema = 'public';
   ```

## Migration Scripts

- `check-supabase-migration.js` - Verifies if tables exist in Supabase
- `setup-github-integration.js` - Sets up migration files for GitHub integration
- `get-supabase-pg-url.js` - Instructions for getting the PostgreSQL connection string
- `direct-pg-migration.js` - Applies migrations directly via PostgreSQL
- `migrate-combined.js` - Combined approach that tries multiple methods
- `apply-supabase-migration.js` - Applies migrations via exec_sql function
- `run-migration.sh` - Shell script to run the migration process

## Troubleshooting

### Tables Not Showing Up

If tables are created in PostgreSQL but not accessible via Supabase:

1. Check permissions - ensure RLS (Row Level Security) is configured correctly
2. Try direct SQL queries in SQL Editor to verify table existence
3. Verify schema is 'public' (default in Supabase)

### Migration Fails

If the migration process fails:

1. Check the logs for specific error messages
2. Try smaller migrations (one table at a time)
3. Verify your Supabase credentials are correct
4. Try the direct PostgreSQL approach as it bypasses the API

### GitHub Integration Issues

If GitHub integration isn't working:

1. Verify the repository connection in Supabase dashboard
2. Ensure migration files are in the correct location (supabase/migrations/)
3. Make sure you've pushed to the correct branch
4. Check GitHub repository permissions