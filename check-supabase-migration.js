require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function checkSupabaseMigration() {
  console.log('Checking if Supabase migration was successful...');
  
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing Supabase credentials. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
    return false;
  }
  
  try {
    // Initialize Supabase client with service role key for admin access
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        db: { schema: 'public' }
      }
    );
    
    console.log('Connected to Supabase...');
    
    // List of tables to check
    const tablesToCheck = [
      'users',
      'guide_submissions',
      'villas',
      'resorts',
      'adventures',
      'bookings',
      'session'
    ];
    
    let successCount = 0;
    
    for (const table of tablesToCheck) {
      console.log(`Checking table: ${table}...`);
      
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error) {
        console.error(`❌ Error accessing table ${table}:`, error.message);
      } else {
        console.log(`✅ Successfully accessed table ${table}`);
        successCount++;
      }
    }
    
    // Check if exec_sql function exists
    console.log('Checking if exec_sql function exists...');
    
    try {
      const { data, error } = await supabase.rpc('exec_sql', {
        sql_query: 'SELECT 1 as test'
      });
      
      if (error) {
        console.error('❌ Error accessing exec_sql function:', error.message);
      } else {
        console.log('✅ Successfully accessed exec_sql function');
        successCount++;
      }
    } catch (functionError) {
      console.error('❌ Error accessing exec_sql function:', functionError.message);
    }
    
    console.log(`Successfully accessed ${successCount}/${tablesToCheck.length + 1} tables & functions`);
    return successCount === tablesToCheck.length + 1;
  } catch (error) {
    console.error('Error checking Supabase migration:', error.message);
    return false;
  }
}

// Run if called directly
if (require.main === module) {
  checkSupabaseMigration()
    .then(success => {
      if (success) {
        console.log('✅ Supabase migration successful! All tables accessible.');
        process.exit(0);
      } else {
        console.error('❌ Supabase migration partially successful or failed. Some tables not accessible.');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('Unexpected error:', error);
      process.exit(1);
    });
}

module.exports = { checkSupabaseMigration };