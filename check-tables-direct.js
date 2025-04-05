require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function checkTables() {
  // Create a Supabase client
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  // List of tables to check
  const tables = [
    'users', 'listings', 'resorts', 'bookings', 'leads', 
    'guide_submissions', 'rewards', 'social_shares', 
    'weather_cache', 'villas', 'adventures', 'session'
  ];

  console.log('Checking tables in Supabase...');
  
  const tableStatuses = [];
  
  for (const table of tables) {
    try {
      // Try to query each table
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error) {
        if (error.message.includes('does not exist')) {
          console.log(`❌ Table '${table}' does not exist`);
          tableStatuses.push({ table, exists: false, error: error.message });
        } else {
          console.log(`⚠️ Error querying table '${table}':`, error.message);
          tableStatuses.push({ table, exists: true, error: error.message });
        }
      } else {
        console.log(`✅ Table '${table}' exists with ${data.length} record(s) sampled`);
        tableStatuses.push({ table, exists: true });
      }
    } catch (error) {
      console.log(`❌ Error checking table '${table}':`, error.message);
      tableStatuses.push({ table, exists: false, error: error.message });
    }
  }
  
  // Summary
  const existingTables = tableStatuses.filter(t => t.exists).map(t => t.table);
  const missingTables = tableStatuses.filter(t => !t.exists).map(t => t.table);
  
  console.log(`\nSummary:`);
  console.log(`- Existing tables (${existingTables.length}): ${existingTables.join(', ') || 'none'}`);
  console.log(`- Missing tables (${missingTables.length}): ${missingTables.join(', ') || 'none'}`);
  
  return { existingTables, missingTables, tableStatuses };
}

// Run if called directly
if (require.main === module) {
  checkTables()
    .then(() => console.log('Check completed'))
    .catch(error => {
      console.error('Unexpected error:', error);
      process.exit(1);
    });
}