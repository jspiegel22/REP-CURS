/**
 * Script to verify data integrity after Supabase migration
 * It compares record counts from PostgreSQL and Supabase to ensure all data was transferred correctly
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const { Pool } = require('pg');

// Database clients
const pgPool = new Pool({ connectionString: process.env.DATABASE_URL });
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Table list to verify
const tables = [
  'users',
  'rewards',
  'resorts',
  'villas',
  'adventures',
  'listings',
  'bookings',
  'leads',
  'guide_submissions',
  'social_shares',
  'weather_cache'
  // Exclude 'session' table as it may have different counts
];

/**
 * Get record count from PostgreSQL
 */
async function getPgRecordCount(table) {
  try {
    const result = await pgPool.query(`SELECT COUNT(*) FROM ${table}`);
    return parseInt(result.rows[0].count, 10);
  } catch (error) {
    console.error(`Error getting PostgreSQL count for ${table}:`, error.message);
    return -1;
  }
}

/**
 * Get record count from Supabase
 */
async function getSupabaseRecordCount(table) {
  try {
    const { data, error, count } = await supabase
      .from(table)
      .select('*', { count: 'exact', head: true });
      
    if (error) {
      console.error(`Error getting Supabase count for ${table}:`, error.message);
      return -1;
    }
    
    return count;
  } catch (error) {
    console.error(`Error getting Supabase count for ${table}:`, error.message);
    return -1;
  }
}

/**
 * Verify data integrity by comparing record counts
 */
async function verifyDataIntegrity() {
  console.log('Verifying data integrity after migration...');
  console.log('Comparing record counts between PostgreSQL and Supabase\n');
  
  console.log('| Table Name        | PostgreSQL | Supabase | Status |');
  console.log('|-------------------|------------|----------|--------|');
  
  let allVerified = true;
  
  for (const table of tables) {
    const pgCount = await getPgRecordCount(table);
    const supabaseCount = await getSupabaseRecordCount(table);
    
    // Skip tables that don't exist or had errors
    if (pgCount === -1 || supabaseCount === -1) {
      console.log(`| ${table.padEnd(17)} | Error      | Error    | ❌ Failed |`);
      allVerified = false;
      continue;
    }
    
    const isMatch = pgCount === supabaseCount;
    const status = isMatch ? '✅ Match' : '❌ Mismatch';
    
    console.log(
      `| ${table.padEnd(17)} | ${String(pgCount).padEnd(10)} | ${String(supabaseCount).padEnd(8)} | ${status} |`
    );
    
    if (!isMatch) {
      allVerified = false;
    }
  }
  
  console.log('\n');
  
  if (allVerified) {
    console.log('✅ All record counts match between PostgreSQL and Supabase.');
    console.log('Data integrity verified!');
  } else {
    console.log('⚠️ Some record counts do not match between PostgreSQL and Supabase.');
    console.log('Please investigate the mismatches and consider re-running the migration.');
  }
  
  return allVerified;
}

/**
 * Main verification function
 */
async function main() {
  try {
    const result = await verifyDataIntegrity();
    return result;
  } catch (error) {
    console.error('Error during verification:', error.message);
    return false;
  } finally {
    // Close the PostgreSQL connection
    await pgPool.end();
  }
}

// Run the function if this file is executed directly
if (require.main === module) {
  main()
    .then(result => {
      process.exit(result ? 0 : 1);
    })
    .catch(error => {
      console.error('Unhandled error:', error);
      process.exit(1);
    });
}

module.exports = { verifyDataIntegrity };