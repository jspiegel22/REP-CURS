require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Create a single supabase client for interacting with your database
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

async function checkTables() {
  try {
    console.log('Checking tables in Supabase...');
    
    // Query for all tables in public schema
    const { data, error } = await supabase
      .rpc('get_tables')
      .select('*');

    if (error) {
      console.error('Error fetching tables:', error);
      // Try alternative method
      console.log('Trying alternative method...');
      await checkSpecificTables();
      return;
    }

    if (data && data.length) {
      console.log('Tables found in Supabase:');
      data.forEach(table => {
        console.log(`- ${table.table_name}`);
      });
    } else {
      console.log('No tables found or tables are not accessible.');
      await checkSpecificTables();
    }
  } catch (error) {
    console.error('Error checking tables:', error);
    await checkSpecificTables();
  }
}

async function checkSpecificTables() {
  const tables = [
    'users', 
    'listings', 
    'bookings', 
    'leads', 
    'guide_submissions',
    'resorts', 
    'villas',
    'rewards',
    'social_shares',
    'weather_cache'
  ];

  console.log('\nChecking individual tables...');

  for (const table of tables) {
    try {
      const { data, error } = await supabase
        .from(table)
        .select('count')
        .limit(1);

      if (error) {
        console.log(`❌ Table '${table}' error:`, error.message);
      } else {
        console.log(`✅ Table '${table}' exists`);
      }
    } catch (error) {
      console.log(`❌ Error querying table '${table}':`, error.message);
    }
  }
}

checkTables();