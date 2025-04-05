require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

async function verifySupabaseTables() {
  console.log('Verifying Supabase tables access...');
  
  // Read SUPABASE_DB_URL from .env file for debugging
  let supabaseDbUrl;
  try {
    const envContent = fs.readFileSync('.env', 'utf8');
    const match = envContent.match(/SUPABASE_DB_URL=(.*)/);
    if (match && match[1]) {
      supabaseDbUrl = match[1];
      console.log(`Found Supabase DB URL: ${supabaseDbUrl.substring(0, 40)}...`);
    }
  } catch (err) {
    console.error('Could not read .env file:', err.message);
  }
  
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing Supabase credentials. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
    return false;
  }
  
  try {
    // Initialize Supabase client with service role key for admin access
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    
    console.log('Connecting to Supabase...');
    
    // List of tables to check
    const tablesToCheck = [
      'users',
      'guide_submissions',
      'resorts',
      'villas',
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
    
    console.log(`Successfully accessed ${successCount}/${tablesToCheck.length} tables`);
    return successCount === tablesToCheck.length;
  } catch (error) {
    console.error('Error verifying Supabase tables:', error.message);
    return false;
  }
}

// Run if called directly
if (require.main === module) {
  verifySupabaseTables()
    .then(success => {
      if (success) {
        console.log('✅ All tables verified and accessible in Supabase!');
        process.exit(0);
      } else {
        console.error('❌ Some tables are not accessible in Supabase.');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('Unexpected error:', error);
      process.exit(1);
    });
}

module.exports = { verifySupabaseTables };