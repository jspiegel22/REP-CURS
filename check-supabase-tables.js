/**
 * Script to check if tables exist in Supabase
 * Useful after migration to verify all tables were created correctly
 */
require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

function isSupabaseConfigured() {
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;
  
  if (!supabaseUrl || !supabaseKey) {
    console.error('❌ Missing Supabase credentials');
    return false;
  }
  
  console.log('✅ Supabase credentials found:');
  console.log(`   URL: ${supabaseUrl}`);
  console.log(`   Key: ${supabaseKey.substring(0, 3)}...${supabaseKey.substring(supabaseKey.length - 3)}`);
  
  return true;
}

async function checkSupabaseTables() {
  if (!isSupabaseConfigured()) {
    return;
  }
  
  const supabaseUrl = process.env.SUPABASE_URL;
  const supabaseKey = process.env.SUPABASE_ANON_KEY;
  const supabase = createClient(supabaseUrl, supabaseKey);
  
  // Test auth service
  const { data: authData, error: authError } = await supabase.auth.getSession();
  if (authError) {
    console.error('❌ Auth error:', authError.message);
  } else {
    console.log('✅ Auth service is working');
  }
  
  const tables = [
    'guide_submissions',
    'users',
    'villas',
    'resorts',
    'bookings',
    'leads',
    'listings',
    'rewards',
    'session',
    'social_shares'
  ];
  
  console.log('\nChecking tables:');
  let successCount = 0;
  
  for (const table of tables) {
    try {
      const { count, error } = await supabase
        .from(table)
        .select('*', { count: 'exact', head: true });
      
      if (error) {
        console.log(`❌ ${table}: ${error.message}`);
      } else {
        successCount++;
        console.log(`✅ ${table}: Found (count of rows: ${count || 0})`);
      }
    } catch (err) {
      console.log(`❌ ${table}: ${err.message}`);
    }
  }
  
  console.log(`\nSummary: ${successCount} of ${tables.length} tables are accessible`);
  
  if (successCount === tables.length) {
    console.log('✅ All tables migrated successfully to Supabase!');
  } else if (successCount > 0) {
    console.log('⚠️ Partial migration detected - some tables exist but not all');
  } else {
    console.log('❌ No tables found - migration may not have started or failed');
  }
}

// Run the check
checkSupabaseTables().catch(err => {
  console.error('Unhandled error:', err);
});