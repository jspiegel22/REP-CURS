/**
 * Script to check if tables exist in Supabase
 * Useful after migration to verify all tables were created correctly
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Expected tables after migration
const expectedTables = [
  'users',
  'listings',
  'resorts',
  'villas',
  'bookings',
  'leads',
  'guide_submissions',
  'rewards',
  'social_shares',
  'weather_cache',
  'adventures',
  'session'
];

// Check if Supabase is configured
function isSupabaseConfigured() {
  return (
    process.env.SUPABASE_URL &&
    process.env.SUPABASE_ANON_KEY &&
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

// Check if tables exist
async function checkTables() {
  if (!isSupabaseConfigured()) {
    console.error('❌ Supabase is not configured. Please set the following environment variables:');
    console.error('  - SUPABASE_URL');
    console.error('  - SUPABASE_ANON_KEY');
    console.error('  - SUPABASE_SERVICE_ROLE_KEY');
    process.exit(1);
  }

  console.log('🔍 Connecting to Supabase...');
  
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    console.log('📋 Checking tables...');
    
    // Get all tables from Supabase
    const { data, error } = await supabase.rpc('exec_sql', {
      sql_query: `
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public'
        AND table_type = 'BASE TABLE'
        ORDER BY table_name;
      `
    });

    if (error) {
      if (error.message.includes("function \"exec_sql\" does not exist")) {
        console.error('❌ The exec_sql function does not exist in Supabase.');
        console.error('Please run the migration script to create this function first.');
        process.exit(1);
      }
      
      throw new Error(`Error fetching tables: ${error.message}`);
    }

    const existingTables = data.map(row => row.table_name);
    console.log(`\nFound ${existingTables.length} tables in Supabase:`);
    
    // Create a table to display results
    console.log('\n| Table Name        | Status  |');
    console.log('|-------------------|---------|');
    
    let allTablesExist = true;
    
    // Check if all expected tables exist
    for (const tableName of expectedTables) {
      const exists = existingTables.includes(tableName);
      const status = exists ? '✅ Found' : '❌ Missing';
      const statusColumn = exists ? status.padEnd(7) : status.padEnd(7);
      
      console.log(`| ${tableName.padEnd(17)} | ${statusColumn} |`);
      
      if (!exists) {
        allTablesExist = false;
      }
    }
    
    console.log('\n');
    
    if (allTablesExist) {
      console.log('✅ All expected tables exist in Supabase.');
    } else {
      console.log('⚠️ Some tables are missing. Please run the migration script to create them.');
    }
    
    return {
      success: allTablesExist,
      existingTables,
      missingTables: expectedTables.filter(t => !existingTables.includes(t))
    };
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

// Run if called directly
if (require.main === module) {
  checkTables();
}

module.exports = { checkTables };