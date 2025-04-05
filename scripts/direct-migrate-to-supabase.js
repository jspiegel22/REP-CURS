/**
 * Direct migration script from PostgreSQL to Supabase
 * This script will:
 * 1. Check if tables exist in Supabase
 * 2. If not, create them using the Drizzle schema
 * 3. Migrate data from PostgreSQL to Supabase
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

// Supabase client setup
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
);

// PostgreSQL connection
const pgPool = new Pool({
  connectionString: process.env.DATABASE_URL
});

// Tables to check and migrate
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
 * Check if tables exist in Supabase
 */
async function checkTables() {
  console.log('Checking if Supabase tables exist...');

  let allTablesExist = true;
  const results = {};

  // First check basic connection
  try {
    const { data, error } = await supabase.from('non_existent_table').select('*').limit(1);
    
    if (error && error.code === '42P01') {
      console.log('Supabase connection successful (expected error for non-existent table)');
    } else if (error) {
      console.error('Unexpected error testing Supabase connection:', error.message);
      return false;
    } else {
      console.log('Unexpected success when querying non-existent table');
    }
  } catch (err) {
    console.error('Error connecting to Supabase:', err.message);
    return false;
  }

  // Now check each table
  for (const table of tables) {
    try {
      // First check if the table exists by trying a basic select
      const { data, error } = await supabase
        .from(table)
        .select('*')
        .limit(1);
      
      if (error && error.code === '42P01') {
        // Table doesn't exist
        console.log(`Table '${table}' does not exist in Supabase`);
        results[table] = { exists: false, error: 'Table does not exist' };
        allTablesExist = false;
      } else if (error) {
        // Other error
        console.log(`Error accessing table '${table}': ${error.message}`);
        results[table] = { exists: false, error: error.message };
        allTablesExist = false;
      } else {
        // Table exists
        console.log(`Table '${table}' exists in Supabase`);
        results[table] = { exists: true };
      }
    } catch (err) {
      console.log(`Error checking table '${table}': ${err.message}`);
      results[table] = { exists: false, error: err.message };
      allTablesExist = false;
    }
  }

  console.log('\nTable check summary:');
  for (const [table, result] of Object.entries(results)) {
    if (result.exists) {
      console.log(`✅ ${table}`);
    } else {
      console.log(`❌ ${table}: ${result.error}`);
    }
  }

  return allTablesExist;
}

/**
 * Run SQL script via exec_sql function
 */
async function runSQL(sqlScript) {
  const { data, error } = await supabase.rpc('exec_sql', {
    query: sqlScript
  });

  if (error) {
    console.error('Error executing SQL:', error.message);
    throw error;
  }

  return data;
}

/**
 * Migrate schema to Supabase
 */
async function migrateSchema() {
  console.log('Migrating schema to Supabase...');

  try {
    // Get the schema SQL from either the schema file or using pg_dump
    let schemaSql;
    const schemaPath = path.join(__dirname, '..', 'supabase', 'migrations', '20250405_initial_schema.sql');
    
    if (fs.existsSync(schemaPath)) {
      console.log(`Using existing schema file: ${schemaPath}`);
      schemaSql = fs.readFileSync(schemaPath, 'utf8');
    } else {
      console.log('Generating schema from PostgreSQL...');
      
      // Execute pg_dump to get the schema
      const { execSync } = require('child_process');
      
      try {
        schemaSql = execSync(
          `pg_dump -h ${process.env.PGHOST} -U ${process.env.PGUSER} -s ${process.env.PGDATABASE} --no-owner --no-acl`,
          { env: { ...process.env, PGPASSWORD: process.env.PGPASSWORD } }
        ).toString();
        
        // Save the schema for future reference
        fs.mkdirSync(path.dirname(schemaPath), { recursive: true });
        fs.writeFileSync(schemaPath, schemaSql, 'utf8');
        console.log(`Schema saved to ${schemaPath}`);
      } catch (err) {
        console.error('Error executing pg_dump:', err.message);
        throw err;
      }
    }

    // Execute the schema SQL on Supabase
    console.log('Applying schema to Supabase...');
    await runSQL(schemaSql);
    console.log('Schema migration complete!');
    
    return true;
  } catch (err) {
    console.error('Error migrating schema:', err.message);
    return false;
  }
}

/**
 * Process rows for insertion
 * This function handles any special formatting needed for Supabase
 */
function processRows(tableName, rows) {
  // Clone the rows to avoid modifying the original data
  return rows.map(row => {
    const processedRow = { ...row };
    
    // Handle any special data types or conversions here
    
    return processedRow;
  });
}

/**
 * Migrate data from PostgreSQL to Supabase
 */
async function migrateData() {
  console.log('Migrating data from PostgreSQL to Supabase...');

  try {
    for (const table of tables) {
      console.log(`\nMigrating table: ${table}`);
      
      // Get the data from PostgreSQL
      const { rows } = await pgPool.query(`SELECT * FROM ${table}`);
      console.log(`Found ${rows.length} rows to migrate`);
      
      if (rows.length === 0) {
        console.log(`No data to migrate for ${table}`);
        continue;
      }
      
      // Process the rows for insertion
      const processedRows = processRows(table, rows);
      
      // Insert the data in batches to avoid overloading the API
      const batchSize = 50;
      for (let i = 0; i < processedRows.length; i += batchSize) {
        const batch = processedRows.slice(i, i + batchSize);
        console.log(`Inserting batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(processedRows.length / batchSize)}`);
        
        // Use upsert to handle any potential conflicts
        const { data, error } = await supabase
          .from(table)
          .upsert(batch, { onConflict: 'id' });
        
        if (error) {
          console.error(`Error inserting data into ${table}:`, error.message);
          throw error;
        }
      }
      
      console.log(`Successfully migrated ${rows.length} rows to ${table}`);
    }
    
    console.log('\nData migration complete!');
    return true;
  } catch (err) {
    console.error('Error migrating data:', err.message);
    return false;
  } finally {
    // Close the PostgreSQL connection
    pgPool.end();
  }
}

/**
 * Main migration function
 */
async function main() {
  console.log('Starting migration to Supabase...');
  
  try {
    // Check for required environment variables
    if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
      console.error('Missing required Supabase environment variables.');
      console.error('Make sure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.');
      return false;
    }
    
    if (!process.env.DATABASE_URL) {
      console.error('Missing required PostgreSQL connection string.');
      console.error('Make sure DATABASE_URL is set.');
      return false;
    }
    
    // Check if tables exist
    const tablesExist = await checkTables();
    
    if (tablesExist) {
      console.log('All tables already exist in Supabase.');
      return true;
    }
    
    // Migrate schema
    const schemaSuccess = await migrateSchema();
    
    if (!schemaSuccess) {
      console.error('Schema migration failed.');
      return false;
    }
    
    // Migrate data
    const dataSuccess = await migrateData();
    
    if (!dataSuccess) {
      console.error('Data migration failed.');
      return false;
    }
    
    console.log('\n✅ Migration completed successfully!');
    return true;
  } catch (err) {
    console.error('Unexpected error during migration:', err.message);
    return false;
  }
}

// Run the function if this file is executed directly
if (require.main === module) {
  main()
    .then(result => {
      if (result) {
        process.exit(0);
      } else {
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('Unexpected error:', error);
      process.exit(1);
    });
}

module.exports = { checkTables, migrateSchema, migrateData };