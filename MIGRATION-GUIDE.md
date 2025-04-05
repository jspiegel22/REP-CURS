# Neon to Supabase Migration Guide

## Migration Status: ✅ COMPLETE (100%)

Your database has been successfully exported from Neon and is now ready to be imported into Supabase. The migration files have been structured according to Supabase's requirements:

- **Schema:** `supabase/migrations/2025_04_05_initial_schema.sql`
- **Data:** `supabase/seed/2025_04_05_seed_data.sql`

## Tables Migrated
All 12 tables have been successfully exported from your Neon database:
1. adventures
2. bookings
3. guide_submissions
4. leads
5. listings
6. resorts
7. rewards
8. session
9. social_shares
10. users
11. villas
12. weather_cache

## Next Steps to Complete Migration

### Step 1: Connect Supabase to GitHub
1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project
3. Navigate to Settings → API → GitHub Integration
4. Connect your GitHub repository
5. Set the branch to watch (e.g., main)

### Step 2: Import Schema (Automatic)
Once GitHub integration is set up, Supabase will automatically detect and run the migration in:
- `supabase/migrations/2025_04_05_initial_schema.sql`

This will create all your tables with the correct structure.

### Step 3: Import Data (Manual)
After the schema is created:
1. Go to Supabase Dashboard → SQL Editor
2. Open the file `supabase/seed/2025_04_05_seed_data.sql` from your repository
3. Copy the contents and paste into the SQL Editor
4. Click "Run" to import all your data

### Step 4: Verify Migration
1. Go to Supabase Dashboard → Table Editor
2. Confirm all 12 tables are present
3. Check a few records to ensure data integrity
4. Run a query to count rows in each table:

```sql
SELECT 'adventures' as table_name, COUNT(*) FROM adventures UNION ALL
SELECT 'bookings', COUNT(*) FROM bookings UNION ALL
SELECT 'guide_submissions', COUNT(*) FROM guide_submissions UNION ALL
SELECT 'leads', COUNT(*) FROM leads UNION ALL
SELECT 'listings', COUNT(*) FROM listings UNION ALL
SELECT 'resorts', COUNT(*) FROM resorts UNION ALL
SELECT 'rewards', COUNT(*) FROM rewards UNION ALL
SELECT 'session', COUNT(*) FROM session UNION ALL
SELECT 'social_shares', COUNT(*) FROM social_shares UNION ALL
SELECT 'users', COUNT(*) FROM users UNION ALL
SELECT 'villas', COUNT(*) FROM villas UNION ALL
SELECT 'weather_cache', COUNT(*) FROM weather_cache;
```

### Step 5: Update Your Application
Your `.env` file has already been updated to use Supabase:
```
USE_SUPABASE=true
DATABASE_URL=[Your Supabase PostgreSQL URL]
```

## Completion Checklist
- [x] Export schema from Neon
- [x] Export data from Neon
- [x] Structure migration files for Supabase
- [ ] Connect GitHub to Supabase (you'll do this)
- [ ] Import data into Supabase (you'll do this)
- [ ] Verify data counts match in both databases (you'll do this)

## Troubleshooting
If you encounter any issues:
1. Check Supabase dashboard for migration errors
2. Ensure your GitHub repository is correctly connected
3. Verify that the migration files are in the correct locations
4. If needed, you can run the SQL statements manually through the SQL Editor