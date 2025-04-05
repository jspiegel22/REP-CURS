#!/usr/bin/env node

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const { Pool } = require('pg');

// Get connection info from environment
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;
const SUPABASE_DB_URL = process.env.SUPABASE_DB_URL || process.env.SUPABASE_PG_URL;

console.log('==== Supabase Table Structure Check ====');

async function verifyTableStructure() {
  try {
    // Connect to Supabase via REST API
    console.log('\n1. Checking Supabase connection via API...');
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    
    // Get session to verify connection
    const { data, error } = await supabase.auth.getSession();
    if (error) {
      console.error('❌ Supabase API connection error:', error.message);
      return false;
    }
    
    console.log('✅ Supabase API connection successful');

    // Check if we have direct PostgreSQL access
    console.log('\n2. Checking direct PostgreSQL access...');
    if (!SUPABASE_DB_URL) {
      console.log('❌ No SUPABASE_DB_URL or SUPABASE_PG_URL environment variable found');
      console.log('ℹ️ Will use Supabase REST API only');
    } else {
      // Try connecting directly to PostgreSQL
      const pgClient = await checkSupabaseConfig(new Pool({
        connectionString: SUPABASE_DB_URL,
        ssl: { rejectUnauthorized: false }
      }));
      
      if (pgClient) {
        console.log('✅ PostgreSQL connection successful');
        
        // List tables
        const tableResult = await pgClient.query(`
          SELECT table_name 
          FROM information_schema.tables 
          WHERE table_schema = 'public' 
          ORDER BY table_name
        `);
        
        if (tableResult.rows.length === 0) {
          console.log('❌ No tables found in the public schema');
        } else {
          console.log(`\nFound ${tableResult.rows.length} tables in the public schema:`);
          
          for (const row of tableResult.rows) {
            // Get column info for each table
            const columnResult = await pgClient.query(`
              SELECT column_name, data_type, character_maximum_length, column_default, is_nullable
              FROM information_schema.columns 
              WHERE table_schema = 'public' AND table_name = $1
              ORDER BY ordinal_position
            `, [row.table_name]);
            
            console.log(`\n📋 Table: ${row.table_name} (${columnResult.rows.length} columns)`);
            
            // Count rows
            const countResult = await pgClient.query(`SELECT COUNT(*) FROM "${row.table_name}"`);
            console.log(`   Records: ${countResult.rows[0].count}`);
            
            // Display column information
            console.log('   Columns:');
            columnResult.rows.forEach(col => {
              const type = col.data_type + 
                (col.character_maximum_length ? `(${col.character_maximum_length})` : '');
              const nullable = col.is_nullable === 'YES' ? 'NULL' : 'NOT NULL';
              const defaultVal = col.column_default ? `DEFAULT ${col.column_default}` : '';
              
              console.log(`     - ${col.column_name}: ${type} ${nullable} ${defaultVal}`);
            });
          }
        }
        
        // Close the client
        await pgClient.end();
      }
    }
    
    return true;
  } catch (err) {
    console.error('Error verifying table structure:', err);
    return false;
  }
}

async function checkSupabaseConfig(client) {
  try {
    // Try connecting
    await client.connect();
    return client;
  } catch (err) {
    console.error('❌ PostgreSQL connection error:', err.message);
    return null;
  }
}

// Run if executed directly
if (require.main === module) {
  verifyTableStructure().then(success => {
    if (success) {
      console.log('\n✅ Table structure verification complete!');
    } else {
      console.log('\n❌ Table structure verification failed.');
      process.exit(1);
    }
  }).catch(err => {
    console.error('Error:', err);
    process.exit(1);
  });
}

module.exports = { verifyTableStructure };