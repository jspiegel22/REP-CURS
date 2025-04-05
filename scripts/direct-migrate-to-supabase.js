// Direct migration script for Supabase
const { createClient } = require('@supabase/supabase-js');
const { Pool } = require('pg');
const dotenv = require('dotenv');
const fs = require('fs');
const path = require('path');

// Load environment variables
dotenv.config();

// Check for required environment variables
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing required Supabase credentials. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

// Create Supabase client
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// We'll use the Supabase REST API instead of direct PostgreSQL connection

// Create source database connection
const sourceDbUrl = process.env.DATABASE_URL;
const sourcePool = new Pool({ connectionString: sourceDbUrl });

// Tables to migrate
const tables = [
  'users',
  'listings',
  'resorts',
  'villas',
  'bookings',
  'leads',
  'guide_submissions',
  'rewards',
  'social_shares',
  'weather_cache'
];

// Function to check if tables exist in Supabase
async function checkTables() {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id')
      .limit(1);
    
    if (error && error.code === 'PGRST204') {
      // Table doesn't exist
      console.log('Table users does not exist');
      return false;
    }

    console.log('Table users exists');
    return true;
  } catch (err) {
    console.error('Error checking tables:', err);
    // Assume tables exist to be safe
    return true;
  }
}

// Function to migrate data from source to Supabase
async function migrateData() {
  console.log('Migrating data to Supabase...');
  
  let totalMigrated = 0;
  
  for (const table of tables) {
    console.log(`Migrating table: ${table}`);
    
    try {
      // Get all data from source database
      const { rows } = await sourcePool.query(`SELECT * FROM ${table}`);
      
      if (rows.length === 0) {
        console.log(`No data to migrate for table: ${table}`);
        continue;
      }
      
      console.log(`Found ${rows.length} rows in table: ${table}`);
      
      // Insert data into Supabase
      console.log(`Attempting to insert ${rows.length} rows into ${table}...`);
      
      // Process rows to handle any JSON fields
      const processedRows = rows.map(row => {
        const processed = {};
        for (const [key, value] of Object.entries(row)) {
          // Handle circular references or complex objects
          if (typeof value === 'object' && value !== null) {
            try {
              // Ensure the object can be stringified
              JSON.stringify(value);
              processed[key] = value;
            } catch (e) {
              console.warn(`Converting complex object in ${key} to string for row in ${table}`);
              processed[key] = JSON.stringify(value);
            }
          } else {
            processed[key] = value;
          }
        }
        return processed;
      });
      
      try {
        const { data, error } = await supabase
          .from(table)
          .insert(processedRows);
          
        if (error) {
          console.error(`Error migrating table ${table}:`, JSON.stringify(error, null, 2));
          
          // Try inserting rows one by one to identify problematic records
          console.log(`Trying to insert rows one by one for ${table}...`);
          let successCount = 0;
          
          for (let i = 0; i < processedRows.length; i++) {
            try {
              const { error: rowError } = await supabase
                .from(table)
                .insert([processedRows[i]]);
                
              if (rowError) {
                console.error(`Error inserting row ${i} in ${table}:`, JSON.stringify(rowError, null, 2));
              } else {
                successCount++;
              }
            } catch (err) {
              console.error(`Exception inserting row ${i} in ${table}:`, err);
            }
          }
          
          console.log(`Successfully inserted ${successCount} out of ${processedRows.length} rows in ${table}`);
          totalMigrated += successCount;
          continue;
        }
        
        console.log(`Successfully migrated ${processedRows.length} rows to table: ${table}`);
        totalMigrated += processedRows.length;
      } catch (err) {
        console.error(`Exception during migration of ${table}:`, err);
      }

    } catch (err) {
      console.error(`Failed to migrate table ${table}:`, err);
    }
  }
  
  return totalMigrated;
}

// Main function
async function main() {
  try {
    // Check if tables already exist
    const tablesExist = await checkTables();
    
    if (!tablesExist) {
      console.error('Tables do not exist in Supabase. Please create them before migrating data.');
      console.error('You can create tables using the Supabase dashboard or by running SQL migrations.');
      process.exit(1);
    }
    
    console.log('Tables appear to exist in Supabase. Proceeding with data migration.');
    
    // Migrate data
    const totalMigrated = await migrateData();
    console.log(`Migration complete. Total rows migrated: ${totalMigrated}`);
  } catch (error) {
    console.error('Migration failed:', error);
    process.exit(1);
  } finally {
    // Close database connections
    sourcePool.end();
  }
}

// Run the migration
main();