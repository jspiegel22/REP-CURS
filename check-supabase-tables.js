// Check if tables exist in Supabase
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function checkTables() {
  console.log('Checking Supabase connection and tables...');
  
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_ANON_KEY) {
    console.error('Missing Supabase credentials!');
    return false;
  }
  
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_ANON_KEY
  );
  
  try {
    // Test basic connection
    console.log('Testing basic Supabase connection...');
    const { data, error } = await supabase
      .from('_dummy_non_existent_table')
      .select('*')
      .limit(1);
    
    if (error && error.code === '42P01') {
      console.log('Connection successful (expected error for non-existent table)');
    } else if (error) {
      console.error('Unexpected error connecting to Supabase:', error);
      return false;
    }
    
    // Now check specific tables
    return await checkSpecificTables(supabase);
  } catch (error) {
    console.error('Error in checkTables:', error);
    return false;
  }
}

async function checkSpecificTables(supabase) {
  const tables = [
    'users',
    'listings',
    'resorts',
    'bookings',
    'leads',
    'guide_submissions',
    'rewards',
    'social_shares',
    'weather_cache',
    'villas'
  ];
  
  const results = {};
  let allTablesExist = true;
  
  console.log('\nChecking specific tables:');
  
  for (const table of tables) {
    try {
      // First check if the table exists by trying a basic select
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error && error.code === '42P01') {
        // Table doesn't exist
        console.log(`❌ Table '${table}' does not exist`);
        results[table] = { exists: false, error: 'Table does not exist' };
        allTablesExist = false;
      } else if (error) {
        // Other error
        console.log(`❌ Error accessing table '${table}': ${error.message}`);
        results[table] = { exists: false, error: error.message };
        allTablesExist = false;
      } else {
        // Table exists, now count rows
        const { count, error: countError } = await supabase
          .from(table)
          .select('*', { count: 'exact', head: true });
        
        if (countError) {
          console.log(`✅ Table '${table}' exists but count failed: ${countError.message}`);
          results[table] = { exists: true, count: 'unknown' };
        } else {
          console.log(`✅ Table '${table}' exists with ${count} rows`);
          results[table] = { exists: true, count };
        }
      }
    } catch (err) {
      console.log(`❌ Error checking table '${table}': ${err.message}`);
      results[table] = { exists: false, error: err.message };
      allTablesExist = false;
    }
  }
  
  console.log('\nTable check summary:');
  for (const [table, result] of Object.entries(results)) {
    if (result.exists) {
      console.log(`✅ ${table}: ${result.count} rows`);
    } else {
      console.log(`❌ ${table}: ${result.error}`);
    }
  }
  
  console.log('\nOverall result:', allTablesExist ? '✅ All tables exist' : '❌ Some tables are missing');
  
  return allTablesExist;
}

// Run the function if this file is executed directly
if (require.main === module) {
  checkTables()
    .then(result => {
      if (result) {
        console.log('\nSUCCESS: Supabase connection and tables verified!');
        process.exit(0);
      } else {
        console.log('\nFAILURE: Supabase tables check failed!');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('Unexpected error:', error);
      process.exit(1);
    });
}