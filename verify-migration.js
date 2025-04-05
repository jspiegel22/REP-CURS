/**
 * Script to verify the Neon to Supabase migration
 * This checks both database connections and compares table counts
 */

const { Pool } = require('pg');
const { createClient } = require('@supabase/supabase-js');

// Source database (Neon)
const sourcePool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }
});

// Supabase client
const supabaseUrl = process.env.SUPABASE_URL || process.env.REACT_APP_SUPABASE_ANON_KEY || '';
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';
const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

// Verify both database connections and compare tables
async function verifyMigration() {
  console.log('Verifying migration from Neon PostgreSQL to Supabase...');
  
  try {
    // Step 1: Check Neon connection
    console.log('\nTesting Neon PostgreSQL connection...');
    const neonResult = await sourcePool.query('SELECT NOW() as time');
    console.log('✅ Neon PostgreSQL connection successful, server time:', neonResult.rows[0].time);
    
    // Step 2: Check Supabase connection
    console.log('\nTesting Supabase connection...');
    const { data: supabaseTime, error } = await supabase.rpc('exec_sql', { 
      sql: 'SELECT NOW() as time' 
    });
    
    if (error) {
      console.error('❌ Supabase connection error:', error.message);
    } else {
      console.log('✅ Supabase connection successful, received data:', supabaseTime);
    }
    
    // Step 3: Get tables in both databases
    console.log('\nComparing tables between Neon and Supabase...');
    
    // Get tables from Neon
    const neonTablesResult = await sourcePool.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE';
    `);
    
    const neonTables = neonTablesResult.rows.map(row => row.table_name);
    console.log(`Neon has ${neonTables.length} tables:`, neonTables);
    
    // Get tables from Supabase
    const { data: supabaseTables, error: tablesError } = await supabase
      .from('information_schema.tables')
      .select('table_name')
      .eq('table_schema', 'public')
      .eq('table_type', 'BASE TABLE');
    
    if (tablesError) {
      console.error('❌ Error getting Supabase tables:', tablesError.message);
    } else {
      const supabaseTableNames = supabaseTables.map(row => row.table_name);
      console.log(`Supabase has ${supabaseTableNames.length} tables:`, supabaseTableNames);
      
      // Check for missing tables
      const missingInSupabase = neonTables.filter(table => !supabaseTableNames.includes(table));
      if (missingInSupabase.length > 0) {
        console.warn('⚠️ Tables missing in Supabase:', missingInSupabase);
      } else {
        console.log('✅ All Neon tables exist in Supabase');
      }
    }
    
    // Step 4: Compare record counts for key tables
    console.log('\nComparing record counts between databases...');
    const tablesToCheck = [
      'users', 'listings', 'resorts', 'villas', 'bookings', 
      'leads', 'guide_submissions', 'social_shares'
    ];
    
    const comparison = [];
    
    for (const table of tablesToCheck) {
      try {
        // Get count from Neon
        const neonCountResult = await sourcePool.query(`SELECT COUNT(*) FROM "${table}"`);
        const neonCount = parseInt(neonCountResult.rows[0].count, 10);
        
        // Get count from Supabase
        const { data, error: countError } = await supabase.rpc('exec_sql', { 
          sql: `SELECT COUNT(*) FROM "${table}"` 
        });
        
        if (countError) {
          comparison.push({
            table,
            neon: neonCount,
            supabase: 'ERROR',
            match: false,
            error: countError.message
          });
        } else {
          const supabaseCount = parseInt(data[0].count, 10);
          comparison.push({
            table,
            neon: neonCount,
            supabase: supabaseCount,
            match: neonCount === supabaseCount
          });
        }
      } catch (err) {
        comparison.push({
          table,
          error: err.message,
          match: false
        });
      }
    }
    
    // Print comparison results
    console.table(comparison);
    
    const allMatch = comparison.every(item => item.match);
    if (allMatch) {
      console.log('✅ All record counts match between Neon and Supabase!');
    } else {
      console.warn('⚠️ Some record counts do not match. Check the migration.');
    }
    
    // Clean up
    await sourcePool.end();
    
    return {
      success: true,
      neonTables: neonTables.length,
      supabaseTables: supabaseTables?.length || 0,
      recordComparison: comparison,
      allRecordsMatch: allMatch
    };
  } catch (error) {
    console.error('Error verifying migration:', error);
    
    // Clean up
    await sourcePool.end();
    
    return {
      success: false,
      error: error.message
    };
  }
}

// Run the verification
verifyMigration().then(result => {
  console.log('\nVerification result:', result.success ? 'SUCCESS' : 'FAILED');
  process.exit(result.success ? 0 : 1);
}).catch(error => {
  console.error('\nUnexpected error:', error);
  process.exit(1);
});