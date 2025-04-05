require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { Pool } = require('pg');
const { createClient } = require('@supabase/supabase-js');

/**
 * Script to enable Supabase as the primary database
 * This script updates the .env file to set USE_SUPABASE=true
 */

function isSupabaseConfigured() {
  return process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY;
}

async function checkSupabaseConnection() {
  if (!isSupabaseConfigured()) {
    console.error('Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY environment variables');
    return false;
  }

  try {
    // First, try direct PostgreSQL connection
    console.log('Testing Supabase connection via direct PostgreSQL...');
    
    if (!process.env.DATABASE_URL) {
      console.error('Missing DATABASE_URL environment variable');
      return false;
    }
    
    const pool = new Pool({
      connectionString: process.env.DATABASE_URL,
      ssl: { rejectUnauthorized: false }
    });
    
    try {
      const client = await pool.connect();
      try {
        const result = await client.query('SELECT version()');
        console.log('Supabase connection successful (via PostgreSQL)');
        console.log('Server version:', result.rows[0].version);
        return true;
      } finally {
        client.release();
      }
    } finally {
      await pool.end();
    }
  } catch (error) {
    console.error('Error connecting to Supabase via PostgreSQL:', error.message);
    
    // Fallback to Supabase SDK
    try {
      console.log('Attempting fallback to Supabase SDK...');
      const supabase = createClient(
        process.env.SUPABASE_URL,
        process.env.SUPABASE_SERVICE_ROLE_KEY
      );
      
      // Simple test query using the Supabase API
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .limit(1);
        
      if (error) {
        console.error('Error connecting via Supabase SDK:', error.message);
        return false;
      }
      
      console.log('Supabase SDK connection successful');
      return true;
    } catch (sdkError) {
      console.error('Error connecting via Supabase SDK:', sdkError.message);
      return false;
    }
  }
}

async function verifyDatabaseContent() {
  console.log('\nVerifying database content...');
  
  // Check if required environment variables are set
  if (!process.env.DATABASE_URL) {
    console.error('Missing required DATABASE_URL environment variable.');
    return false;
  }
  
  // Connect to the database
  const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  
  try {
    console.log('Connecting to database...');
    const client = await pool.connect();
    console.log('Connected successfully');
    
    try {
      // Get table row counts
      const tables = [
        'users', 'listings', 'resorts', 'bookings', 'leads', 
        'guide_submissions', 'rewards', 'social_shares', 
        'weather_cache', 'villas', 'adventures', 'session'
      ];
      
      const tableStats = [];
      
      for (const table of tables) {
        const countResult = await client.query(`SELECT COUNT(*) FROM ${table}`);
        const count = parseInt(countResult.rows[0].count);
        tableStats.push({ table, count });
      }
      
      console.log('\nTable statistics:');
      let totalRows = 0;
      tableStats.forEach(stat => {
        console.log(`- ${stat.table}: ${stat.count} rows`);
        totalRows += stat.count;
      });
      console.log(`Total rows across all tables: ${totalRows}`);
      
      return totalRows > 0;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error connecting to database:', error.message);
    return false;
  } finally {
    await pool.end();
  }
}

async function updateEnvironmentFile() {
  const envFilePath = path.join(__dirname, '.env');
  
  if (!fs.existsSync(envFilePath)) {
    console.error('.env file not found');
    return false;
  }
  
  let envContent = fs.readFileSync(envFilePath, 'utf8');
  
  // Check if USE_SUPABASE is already set
  if (envContent.includes('USE_SUPABASE=true')) {
    console.log('USE_SUPABASE already set to true');
    return true;
  }
  
  // Update or add USE_SUPABASE
  if (envContent.includes('USE_SUPABASE=')) {
    // Replace existing setting
    envContent = envContent.replace(/USE_SUPABASE=.*/, 'USE_SUPABASE=true');
  } else {
    // Add new setting
    envContent += '\nUSE_SUPABASE=true\n';
  }
  
  // Write updated content back to file
  fs.writeFileSync(envFilePath, envContent);
  console.log('Updated .env file to enable Supabase');
  
  return true;
}

async function enableSupabase() {
  console.log('======================================');
  console.log('Enabling Supabase as primary database');
  console.log('======================================\n');
  
  // Check Supabase connection
  if (!await checkSupabaseConnection()) {
    console.error('Supabase connection check failed. Aborting.');
    return false;
  }
  
  // Verify database content
  if (!await verifyDatabaseContent()) {
    console.error('Database content verification failed. Make sure data migration is complete.');
    return false;
  }
  
  // Update environment file
  if (!await updateEnvironmentFile()) {
    console.error('Failed to update environment file.');
    return false;
  }
  
  console.log('\n✅ Supabase has been enabled as the primary database!');
  console.log('Restart your application for changes to take effect.');
  
  return true;
}

// Run if called directly
if (require.main === module) {
  enableSupabase()
    .then(success => {
      if (success) {
        console.log('Supabase enablement completed successfully!');
        process.exit(0);
      } else {
        console.error('Supabase enablement failed!');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('Unexpected error:', error);
      process.exit(1);
    });
}