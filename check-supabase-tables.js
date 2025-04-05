#!/usr/bin/env node

/**
 * Script to check if tables exist in Supabase
 * Useful after migration to verify all tables were created correctly
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Get connection info from environment
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

console.log('==== Supabase Tables Check ====');

function isSupabaseConfigured() {
  return SUPABASE_URL && SUPABASE_KEY;
}

async function checkSupabaseTables() {
  if (!isSupabaseConfigured()) {
    console.error('❌ Supabase not configured. Check SUPABASE_URL and SUPABASE_KEY env variables.');
    return false;
  }

  try {
    // Initialize Supabase client
    console.log(`Connecting to Supabase at ${SUPABASE_URL}...`);
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

    // Get session to verify connection
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      console.error('❌ Supabase connection error:', sessionError.message);
      return false;
    }
    
    console.log('✅ Connected to Supabase successfully');

    // Tables to check
    const expectedTables = [
      'users',
      'resorts',
      'villas',
      'adventures',
      'leads',
      'guide_submissions',
      'bookings',
      'weather_cache'
    ];

    console.log('\nChecking tables...');
    const tableResults = {};
    
    // Check each table
    for (const table of expectedTables) {
      try {
        console.log(`\nChecking table '${table}'...`);
        
        // Try to get one row to see if table exists
        const result = await supabase
          .from(table)
          .select('*')
          .limit(1);
        
        const { data, error } = result;
          
        if (error) {
          if (error.message.includes('does not exist')) {
            console.log(`❌ Table '${table}' does not exist`);
            tableResults[table] = { exists: false, error: error.message };
          } else {
            console.log(`⚠️ Error reading table '${table}': ${error.message}`);
            tableResults[table] = { exists: true, error: error.message };
          }
        } else {
          // Get actual record count
          const countResult = await supabase
            .from(table)
            .select('*', { count: 'exact' });
          
          const recordCount = countResult.count;
          const countError = countResult.error;
            
          if (countError) {
            console.log(`⚠️ Error counting records in '${table}': ${countError.message}`);
            tableResults[table] = { exists: true, count: 'error', error: countError.message };
          } else {
            console.log(`✅ Table '${table}' exists with ${recordCount} records`);
            tableResults[table] = { exists: true, count: recordCount };
            
            // If table exists and has records, sample some data
            if (recordCount > 0) {
              const { data: sampleData, error: sampleError } = await supabase
                .from(table)
                .select('*')
                .limit(1);
                
              if (!sampleError && sampleData && sampleData.length > 0) {
                console.log('  Sample record fields:', Object.keys(sampleData[0]).join(', '));
              }
            }
          }
        }
      } catch (err) {
        console.error(`❌ Error checking table '${table}':`, err.message);
        tableResults[table] = { exists: false, error: err.message };
      }
    }
    
    // Summary
    console.log('\n==== Summary ====');
    const existingTables = Object.keys(tableResults).filter(table => tableResults[table].exists);
    console.log(`Tables found: ${existingTables.length} of ${expectedTables.length}`);
    
    if (existingTables.length > 0) {
      console.log('\nExisting tables:');
      existingTables.forEach(table => {
        const count = tableResults[table].count;
        console.log(`- ${table}: ${count !== undefined ? count + ' records' : 'unknown count'}`);
      });
    }
    
    const missingTables = Object.keys(tableResults).filter(table => !tableResults[table].exists);
    if (missingTables.length > 0) {
      console.log('\nMissing tables:');
      missingTables.forEach(table => console.log(`- ${table}`));
    }
    
    return existingTables.length > 0;
  } catch (err) {
    console.error('Error checking Supabase tables:', err);
    return false;
  }
}

// Run if executed directly
if (require.main === module) {
  checkSupabaseTables().then(success => {
    if (success) {
      console.log('\n✅ Supabase tables check complete');
    } else {
      console.log('\n❌ Supabase tables check failed');
      process.exit(1);
    }
  }).catch(err => {
    console.error('Unexpected error:', err);
    process.exit(1);
  });
}

module.exports = { checkSupabaseTables };