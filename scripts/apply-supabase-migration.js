// A simple script to apply our SQL migrations to Supabase
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Create Supabase client using service role key for admin privileges
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function applyMigration() {
  try {
    // Read the SQL file
    const sqlPath = path.join(__dirname, '../supabase/migrations/20240404_initial_schema.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');
    
    console.log('Applying Supabase migration...');
    
    // Execute the SQL queries
    const { data, error } = await supabase.rpc('exec_sql', { sql });
    
    if (error) {
      console.error('Error applying migration:', error);
      return false;
    }
    
    console.log('Migration successfully applied to Supabase');
    return true;
  } catch (err) {
    console.error('Failed to apply migration:', err);
    console.log('Note: You may need to manually run the SQL in the Supabase dashboard SQL Editor.');
    return false;
  }
}

// Run the migration
applyMigration()
  .then(success => {
    if (!success) {
      console.log('If the automatic migration failed, you can manually apply the SQL in the Supabase dashboard:');
      console.log('1. Go to your Supabase project dashboard');
      console.log('2. Click on "SQL Editor"');
      console.log('3. Paste the contents of ./supabase/migrations/20240404_initial_schema.sql');
      console.log('4. Run the query');
    }
    process.exit(success ? 0 : 1);
  })
  .catch(err => {
    console.error('Unhandled error:', err);
    process.exit(1);
  });
