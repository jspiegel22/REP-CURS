# Supabase Migration Guide

This directory contains the migration files for setting up the database schema in Supabase.

## Migration Structure

The migration files are located in the `migrations/` directory and follow the naming convention:

```
YYYY_MM_DD_description.sql
```

For example:
- `20250405_initial_schema.sql` - The initial database schema
- `20250405_add_exec_sql_function.sql` - SQL function for executing dynamic queries
- `20250405_initial_data.sql` - Initial data for tables (if needed)

## How Supabase Migrations Work

Supabase automatically applies migrations from the GitHub repository when:

1. The migrations are stored in the `supabase/migrations/` folder
2. Your Supabase project is connected to your GitHub repository
3. Changes are pushed to the designated branch (usually `main` or `production`)

## Setting Up GitHub Integration with Supabase

1. In the Supabase Dashboard, go to your project
2. Navigate to the "Settings" section
3. Click on "Integrations"
4. Connect your GitHub repository
5. Select the branch to track (typically `main` or `production`)
6. Ensure migrations are in the correct path: `supabase/migrations/`

## Verifying Migration Success

After pushing changes to GitHub, you can verify if the migration was successful by:

1. Checking the Supabase Dashboard for any migration errors
2. Running the verification script:
   ```
   node check-supabase-migration.js
   ```

## Key Tables in the Schema

The database schema includes the following core tables:

- `users` - User accounts and authentication
- `guide_submissions` - Form submissions for guide requests
- `villas` - Villa listings and details
- `resorts` - Resort listings and details
- `adventures` - Adventure activities
- `bookings` - User bookings for listings or adventures
- `session` - Session management for authentication

## Row-Level Security

The migrations also set up Row-Level Security (RLS) policies for each table to ensure proper access control.

## Exec SQL Function

The `exec_sql` function allows for dynamic SQL execution with proper security controls. It's used for administrative tasks and is secured with the `SECURITY DEFINER` attribute to run with the privileges of the function creator.