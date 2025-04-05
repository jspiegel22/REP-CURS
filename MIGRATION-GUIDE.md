# Database Migration Guide: Neon PostgreSQL to Supabase

This document outlines the steps for migrating our application's database from Neon PostgreSQL to Supabase. It includes prerequisites, migration steps, verification processes, and troubleshooting tips.

## Table of Contents

1. [Prerequisites](#prerequisites)
2. [Migration Process](#migration-process)
3. [Verification](#verification)
4. [Troubleshooting](#troubleshooting)
5. [Rollback Process](#rollback-process)

## Prerequisites

Before starting the migration, ensure you have:

- [ ] Admin access to both Neon and Supabase projects
- [ ] Backup of the current Neon PostgreSQL database
- [ ] All environment variables set correctly:
  - `DATABASE_URL` (Neon)
  - `SUPABASE_URL`
  - `SUPABASE_ANON_KEY`
  - `SUPABASE_SERVICE_ROLE_KEY`

## Migration Process

### 1. Create a Full Database Backup

Create a backup of the current Neon PostgreSQL database to ensure you can restore if needed:

```bash
./run-migration.sh
```

This script does the following:
- Creates a backup of the Neon database in the `backups/` directory
- Fixes any swapped environment variables
- Runs the migration script to extract schema and transfer data
- Updates application code to support the Supabase database

### 2. Manual Configuration Steps

If you need to run the migration process manually, follow these steps:

#### A. Create Database Backup

```bash
mkdir -p backups
BACKUP_FILE="backups/neon_backup_$(date +"%Y%m%d_%H%M%S").dump"
PGPASSWORD=$PGPASSWORD pg_dump -h $PGHOST -p $PGPORT -U $PGUSER -d $PGDATABASE -f $BACKUP_FILE
```

#### B. Run Migration Script

```bash
node migrate-to-supabase.js
```

#### C. Update Application Configuration

Make sure the following files are updated to support Supabase:

- `server/services/supabase.ts`: Ensures correct Supabase client configuration
- `server/db.ts`: Supports dynamic database selection based on environment variables
- `.env`: Add `USE_SUPABASE=true` to enable Supabase as the primary database

#### D. Restart Application

```bash
npm run dev
```

## Verification

After the migration, verify that everything is working correctly:

```bash
node verify-migration.js
```

This script checks:
- Connectivity to both databases
- Compares table structures
- Verifies record counts between Neon and Supabase
- Generates a report of any inconsistencies

### Important Tables to Verify:

- `users`
- `listings`
- `resorts`
- `villas`
- `bookings`
- `leads`
- `guide_submissions`

## Troubleshooting

### Common Issues

1. **Swapped Environment Variables**
   
   If Supabase variables are swapped, the migration script attempts to correct this automatically. However, you can manually fix them:
   ```
   Correct SUPABASE_URL should start with "https://" 
   Correct SUPABASE_ANON_KEY should start with "eyJhbGciOi..."
   ```

2. **Missing Tables in Supabase**
   
   If tables are missing after migration, you can create them manually using the SQL schema in `supabase/migrations/`.

3. **Data Migration Failures**
   
   Check the error files created during migration for specific batch issues:
   ```
   error_batch_${table_name}.json
   ```

4. **Foreign Key Constraints**
   
   Tables must be created and populated in the correct dependency order. If you see foreign key constraint errors, verify the migration script's topological sort function is working correctly.

## Rollback Process

If the migration needs to be rolled back:

1. Update the `.env` file:
   ```
   USE_SUPABASE=false
   ```

2. Restart the application:
   ```bash
   npm run dev
   ```

3. The application will fall back to using the Neon PostgreSQL database.

## Future Migrations

For future schema migrations, use the SQL files in the `supabase/migrations/` directory. Add a new file with a timestamp prefix and the SQL changes:

```
supabase/migrations/20250406_add_new_feature.sql
```

Apply migrations using:

```bash
node apply-migration.js --file=supabase/migrations/20250406_add_new_feature.sql
```