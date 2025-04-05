/**
 * Direct migration script from PostgreSQL to Supabase
 * This script will:
 * 1. Check if tables exist in Supabase
 * 2. If not, create them using the SQL schema
 * 3. Migrate data from PostgreSQL to Supabase
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
const { migrateSchema } = require('./direct_schema_migration');

// Database clients
const pgPool = new Pool({ connectionString: process.env.DATABASE_URL });
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Table list (order matters for foreign key constraints)
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
  'weather_cache',
  'session'  // Include session table for auth
];

/**
 * Check if tables exist in Supabase
 */
async function checkTables() {
  console.log('Checking if tables exist in Supabase...');
  
  const existingTables = [];
  const missingTables = [];
  
  for (const table of tables) {
    try {
      const { error } = await supabase
        .from(table)
        .select('count(*)')
        .limit(1);
      
      if (!error || !error.message.includes('does not exist')) {
        existingTables.push(table);
      } else {
        missingTables.push(table);
      }
    } catch (error) {
      missingTables.push(table);
    }
  }
  
  console.log(`Found ${existingTables.length} existing tables: ${existingTables.join(', ') || 'none'}`);
  console.log(`Missing ${missingTables.length} tables: ${missingTables.join(', ') || 'none'}`);
  
  return { existingTables, missingTables };
}

/**
 * Run SQL script via exec_sql function
 */
async function runSQL(sqlScript) {
  try {
    const { data, error } = await supabase.rpc('exec_sql', { query: sqlScript });
    
    if (error) {
      console.error('Error executing SQL:', error.message);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('Error executing SQL:', error.message);
    return false;
  }
}

/**
 * Migrate schema to Supabase
 */
async function runSchemaMigration() {
  console.log('Migrating schema to Supabase...');
  
  // Import from the dedicated schema migration script
  return require('./direct_schema_migration').migrateSchema();
}

/**
 * Process rows for insertion
 * This function handles any special formatting needed for Supabase
 * with special attention to field compatibility with Airtable
 */
function processRows(tableName, rows) {
  return rows.map(row => {
    // Clone the row to avoid modifying the original
    const processedRow = { ...row };
    
    // Handle Date fields
    if (processedRow.created_at && processedRow.created_at instanceof Date) {
      processedRow.created_at = processedRow.created_at.toISOString();
    }
    
    if (processedRow.updated_at && processedRow.updated_at instanceof Date) {
      processedRow.updated_at = processedRow.updated_at.toISOString();
    }
    
    if (processedRow.start_date && processedRow.start_date instanceof Date) {
      processedRow.start_date = processedRow.start_date.toISOString();
    }
    
    if (processedRow.end_date && processedRow.end_date instanceof Date) {
      processedRow.end_date = processedRow.end_date.toISOString();
    }
    
    if (processedRow.processed_at && processedRow.processed_at instanceof Date) {
      processedRow.processed_at = processedRow.processed_at.toISOString();
    }
    
    // Process JSON fields
    if (tableName === 'guide_submissions' || tableName === 'leads' || tableName === 'bookings') {
      // Ensure form_data is valid JSON
      if (processedRow.form_data) {
        if (typeof processedRow.form_data === 'string') {
          try {
            // Try to parse if it's a string
            processedRow.form_data = JSON.parse(processedRow.form_data);
          } catch (e) {
            // Keep as string if can't parse
            console.log(`Could not parse form_data for ${tableName} record ${processedRow.id}`);
          }
        }
      } else {
        // Set empty object if missing
        processedRow.form_data = {};
      }
      
      // Process array fields for Airtable compatibility
      if (processedRow.tags && typeof processedRow.tags === 'string') {
        try {
          processedRow.tags = JSON.parse(processedRow.tags);
        } catch (e) {
          processedRow.tags = processedRow.tags.split(',').map(tag => tag.trim());
        }
      }
      
      if (processedRow.interest_areas && typeof processedRow.interest_areas === 'string') {
        try {
          processedRow.interest_areas = JSON.parse(processedRow.interest_areas);
        } catch (e) {
          processedRow.interest_areas = processedRow.interest_areas.split(',').map(item => item.trim());
        }
      }
    }
    
    // Handle resort and villa amenities
    if ((tableName === 'resorts' || tableName === 'villas') && processedRow.amenities) {
      if (typeof processedRow.amenities === 'string') {
        try {
          processedRow.amenities = JSON.parse(processedRow.amenities);
        } catch (e) {
          processedRow.amenities = processedRow.amenities.split(',').map(item => item.trim());
        }
      }
    }
    
    // Handle villa image URLs
    if (tableName === 'villas' && processedRow.image_urls) {
      if (typeof processedRow.image_urls === 'string') {
        try {
          processedRow.image_urls = JSON.parse(processedRow.image_urls);
        } catch (e) {
          processedRow.image_urls = [processedRow.image_urls];
        }
      }
    }
    
    // Remove null primary keys as Supabase will generate them
    if (tableName !== 'users' && processedRow.id === null) {
      delete processedRow.id;
    }
    
    return processedRow;
  });
}

/**
 * Migrate data from PostgreSQL to Supabase
 */
async function migrateData() {
  console.log('Migrating data from PostgreSQL to Supabase...');
  
  // Process each table
  for (const table of tables) {
    console.log(`\nMigrating data for table: ${table}`);
    
    try {
      // Get data from PostgreSQL
      const { rows } = await pgPool.query(`SELECT * FROM ${table}`);
      console.log(`Found ${rows.length} rows in PostgreSQL ${table} table`);
      
      if (rows.length === 0) {
        console.log(`No data to migrate for ${table}`);
        continue;
      }
      
      // Process rows for Supabase
      const processedRows = processRows(table, rows);
      
      // Insert in batches of 100
      const batchSize = 100;
      
      for (let i = 0; i < processedRows.length; i += batchSize) {
        const batch = processedRows.slice(i, i + batchSize);
        
        console.log(`Inserting batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(processedRows.length / batchSize)} (${batch.length} rows)...`);
        
        // Use upsert to handle existing records (based on id)
        const { error } = await supabase
          .from(table)
          .upsert(batch, { onConflict: 'id' });
        
        if (error) {
          console.error(`Error inserting batch for ${table}:`, error.message);
        } else {
          console.log(`✅ Successfully inserted batch for ${table}`);
        }
      }
      
      // Verify data was inserted
      const { data, error } = await supabase
        .from(table)
        .select('count(*)', { count: 'exact' });
      
      if (error) {
        console.error(`Error verifying data for ${table}:`, error.message);
      } else {
        console.log(`✅ Verified ${data[0].count} rows in Supabase ${table} table`);
      }
    } catch (error) {
      console.error(`Error migrating data for ${table}:`, error.message);
    }
  }
}

/**
 * Main migration function
 */
async function main() {
  console.log('Starting direct migration from PostgreSQL to Supabase...');
  
  // Check if required environment variables are set
  if (!process.env.DATABASE_URL || !process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing required environment variables.');
    console.error('Make sure DATABASE_URL, SUPABASE_URL, and SUPABASE_SERVICE_ROLE_KEY are set.');
    return;
  }
  
  try {
    // Step 1: Check if tables exist in Supabase
    const { existingTables, missingTables } = await checkTables();
    
    // Step 2: Migrate schema if needed
    if (missingTables.length > 0) {
      console.log('Tables missing, migrating schema...');
      const schemaResult = await runSchemaMigration();
      
      if (!schemaResult) {
        console.error('Schema migration failed. Aborting data migration.');
        return;
      }
    } else {
      console.log('All tables already exist. Skipping schema migration.');
    }
    
    // Step 3: Migrate data
    await migrateData();
    
    console.log('\nMigration completed successfully!');
  } catch (error) {
    console.error('Error during migration:', error.message);
  } finally {
    // Close the PostgreSQL connection
    await pgPool.end();
  }
}

// Run the function if this file is executed directly
if (require.main === module) {
  main()
    .then(() => {
      console.log('Migration script finished.');
      process.exit(0);
    })
    .catch(error => {
      console.error('Unhandled error:', error);
      process.exit(1);
    });
}