// Direct data migration script that doesn't rely on exec_sql
const { createClient } = require('@supabase/supabase-js');
const { Pool } = require('pg');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Check for required environment variables
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error('Missing required Supabase credentials. Please set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
  process.exit(1);
}

if (!process.env.DATABASE_URL) {
  console.error('Missing required DATABASE_URL environment variable');
  process.exit(1);
}

// Create Supabase client with admin privileges
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Create source database connection
const sourcePool = new Pool({ connectionString: process.env.DATABASE_URL });

// Tables to migrate (in order of dependencies)
const tables = [
  'users',
  'listings',
  'resorts',
  'rewards',
  'villas',
  'guide_submissions',
  'bookings',
  'leads',
  'social_shares',
  'weather_cache'
];

// Helper function to process rows before insertion
function processRows(tableName, rows) {
  // You can add custom transformations for specific tables if needed
  return rows;
}

// Function to handle smaller batch inserts instead of inserting all at once
async function batchInsert(tableName, rows, batchSize = 50) {
  if (rows.length === 0) return { success: true, count: 0 };
  
  const totalRows = rows.length;
  let insertedCount = 0;
  let errors = [];
  
  // Process in batches
  for (let i = 0; i < totalRows; i += batchSize) {
    const batch = rows.slice(i, i + batchSize);
    
    try {
      const { error } = await supabase
        .from(tableName)
        .insert(batch);
        
      if (error) {
        console.error(`Error inserting batch ${i}-${i+batchSize} in ${tableName}:`, error);
        errors.push({ batch: i, error });
      } else {
        insertedCount += batch.length;
        console.log(`Inserted batch ${i}-${i+batch.length} of ${totalRows} in ${tableName}`);
      }
    } catch (error) {
      console.error(`Exception in batch ${i}-${i+batchSize} for ${tableName}:`, error);
      errors.push({ batch: i, error });
    }
    
    // Small delay to avoid rate limiting
    await new Promise(resolve => setTimeout(resolve, 100));
  }
  
  return {
    success: errors.length === 0,
    count: insertedCount,
    errors: errors.length > 0 ? errors : undefined
  };
}

// Function to migrate a single table
async function migrateTable(tableName) {
  console.log(`\nMigrating table: ${tableName}`);
  
  try {
    // Check if table exists in source database
    const tableCheckResult = await sourcePool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_schema = 'public' 
        AND table_name = $1
      )
    `, [tableName]);
    
    if (!tableCheckResult.rows[0].exists) {
      console.log(`Table ${tableName} does not exist in source database, skipping.`);
      return { success: true, count: 0 };
    }
    
    // Get data from source
    const { rows } = await sourcePool.query(`SELECT * FROM "${tableName}"`);
    
    if (rows.length === 0) {
      console.log(`No data found in ${tableName}, skipping.`);
      return { success: true, count: 0 };
    }
    
    console.log(`Found ${rows.length} rows in ${tableName}.`);
    
    // Process rows if needed before insertion
    const processedRows = processRows(tableName, rows);
    
    // First, delete existing data in the destination table
    console.log(`Clearing existing data in ${tableName}...`);
    await supabase.from(tableName).delete().neq('id', 0);
    
    // Insert data in batches
    const result = await batchInsert(tableName, processedRows);
    
    if (result.success) {
      console.log(`Successfully migrated ${result.count} rows to ${tableName}`);
    } else {
      console.log(`Partially migrated ${result.count} rows to ${tableName} with some errors`);
    }
    
    return result;
  } catch (error) {
    console.error(`Failed to migrate ${tableName}:`, error);
    return { success: false, error };
  }
}

// Main migration function
async function migrateData() {
  let results = {};
  let totalSuccess = true;
  
  try {
    // Migrate each table in order
    for (const table of tables) {
      const result = await migrateTable(table);
      results[table] = result;
      
      if (!result.success) {
        totalSuccess = false;
      }
    }
    
    // Report summary
    console.log('\n===== MIGRATION SUMMARY =====');
    for (const table in results) {
      if (results[table].success) {
        console.log(`${table}: Success (${results[table].count} rows)`);
      } else {
        console.log(`${table}: Failed (${results[table].count || 0} rows migrated before error)`);
      }
    }
    
    return { success: totalSuccess, results };
  } catch (error) {
    console.error('Migration process failed:', error);
    return { success: false, error };
  } finally {
    // Close the source database connection
    await sourcePool.end();
  }
}

// Execute migration
migrateData()
  .then(result => {
    if (result.success) {
      console.log('\nData migration completed successfully!');
      process.exit(0);
    } else {
      console.log('\nData migration completed with errors. See above for details.');
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('Migration script failed with unhandled error:', error);
    process.exit(1);
  });