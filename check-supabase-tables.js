require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

/**
 * Script to check if tables exist in Supabase
 * Useful after migration to verify all tables were created correctly
 */

function isSupabaseConfigured() {
  return process.env.SUPABASE_URL && 
         process.env.SUPABASE_ANON_KEY && 
         process.env.SUPABASE_SERVICE_ROLE_KEY;
}

async function checkTables() {
  if (!isSupabaseConfigured()) {
    console.error('Missing Supabase credentials');
    return false;
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    console.log('Checking tables in Supabase...');
    
    // Try the simple approach - directly check for tables
    const tablesWeExpect = [
      'users', 'listings', 'resorts', 'bookings', 'leads', 'guide_submissions',
      'rewards', 'social_shares', 'weather_cache', 'villas', 'adventures', 'session'
    ];
    
    let tablesFound = 0;
    
    for (const tableName of tablesWeExpect) {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('*')
          .limit(1);
        
        if (error) {
          if (error.message.includes('does not exist')) {
            console.log(`❌ Table '${tableName}' does not exist`);
          } else {
            console.log(`❌ Table '${tableName}' - Error: ${error.message}`);
          }
        } else {
          tablesFound++;
          const count = Array.isArray(data) ? data.length : 0;
          console.log(`✅ Table '${tableName}' exists with ${count} row(s) in the sample`);
          
          // If we have data, show a sample
          if (count > 0) {
            console.log('  Sample data:', JSON.stringify(data[0]).substring(0, 100) + '...');
          }
        }
      } catch (e) {
        console.log(`❌ Table '${tableName}' - Error: ${e.message}`);
      }
    }
    
    console.log(`\nFound ${tablesFound} of ${tablesWeExpect.length} expected tables`);
    
    // Check if we need to run migration
    if (tablesFound === 0) {
      console.log('\n⚠️ No tables found. Migration may not have been performed successfully.');
    }
    
  } catch (error) {
    console.error('Error checking tables:', error.message);
    return false;
  }
}

// Run if called directly
checkTables()
  .then(() => {
    console.log('Done checking tables');
  })
  .catch(error => {
    console.error('Error:', error);
    process.exit(1);
  });