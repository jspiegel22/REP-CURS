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

// Tables to verify
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
  'villas',
  'adventures'
];

/**
 * Get record count from PostgreSQL
 */
async function getPgRecordCount(table) {
  try {
    const result = await pgPool.query(`SELECT COUNT(*) FROM ${table}`);
    return parseInt(result.rows[0].count);
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
  console.log('=== Data Integrity Verification ===');
  console.log('Comparing record counts between PostgreSQL and Supabase...');
  console.log('');
  
  let allTablesMatch = true;
  let totalPgRecords = 0;
  let totalSupabaseRecords = 0;
  
  console.log('| Table              | PostgreSQL | Supabase  | Match |');
  console.log('|--------------------+------------+-----------+-------|');
  
  for (const table of tables) {
    const pgCount = await getPgRecordCount(table);
    const supabaseCount = await getSupabaseRecordCount(table);
    
    const match = pgCount === supabaseCount ? '✅' : '❌';
    if (pgCount !== supabaseCount) {
      allTablesMatch = false;
    }
    
    // Format the output as a table
    const tableCol = table.padEnd(18);
    const pgCol = String(pgCount).padEnd(10);
    const supabaseCol = String(supabaseCount).padEnd(9);
    
    console.log(`| ${tableCol} | ${pgCol} | ${supabaseCol} | ${match}   |`);
    
    if (pgCount > 0) totalPgRecords += pgCount;
    if (supabaseCount > 0) totalSupabaseRecords += supabaseCount;
  }
  
  console.log('|--------------------+------------+-----------+-------|');
  
  const totalPgCol = String(totalPgRecords).padEnd(10);
  const totalSupabaseCol = String(totalSupabaseRecords).padEnd(9);
  const totalMatch = totalPgRecords === totalSupabaseRecords ? '✅' : '❌';
  
  console.log(`| TOTAL              | ${totalPgCol} | ${totalSupabaseCol} | ${totalMatch}   |`);
  console.log('');
  
  if (allTablesMatch) {
    console.log('✅ All tables match exactly. Data integrity verified!');
  } else {
    console.log('❌ Some tables have discrepancies. Please check the data.');
  }
  
  return allTablesMatch;
}

/**
 * Main verification function
 */
async function main() {
  try {
    const integrityVerified = await verifyDataIntegrity();
    
    console.log('');
    if (integrityVerified) {
      console.log('Migration verification completed successfully!');
    } else {
      console.log('Migration verification completed with discrepancies.');
      console.log('You may need to manually check data or re-run the migration.');
    }
  } catch (error) {
    console.error('Error during verification:', error);
  } finally {
    // Close the PostgreSQL connection
    await pgPool.end();
  }
}

// Run the verification
if (require.main === module) {
  main()
    .then(() => {
      process.exit(0);
    })
    .catch(error => {
      console.error('Unhandled error:', error);
      process.exit(1);
    });
}

module.exports = { verifyDataIntegrity };