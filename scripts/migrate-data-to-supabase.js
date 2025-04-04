// A script to migrate data from PostgreSQL to Supabase
const { createClient } = require('@supabase/supabase-js');
const { Pool } = require('pg');
const dotenv = require('dotenv');

// Load environment variables
dotenv.config();

// Create Supabase client using service role key for admin privileges
const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

// Create PostgreSQL connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

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

async function migrateTable(tableName) {
  console.log(`Migrating table: ${tableName}`);
  
  try {
    // Get all data from PostgreSQL
    const { rows } = await pool.query(`SELECT * FROM ${tableName}`);
    
    if (rows.length === 0) {
      console.log(`No data to migrate for table: ${tableName}`);
      return 0;
    }
    
    console.log(`Found ${rows.length} rows in table: ${tableName}`);
    
    // Insert data into Supabase
    const { data, error } = await supabase
      .from(tableName)
      .insert(rows);
      
    if (error) {
      console.error(`Error migrating table ${tableName}:`, error);
      return 0;
    }
    
    console.log(`Successfully migrated ${rows.length} rows to table: ${tableName}`);
    return rows.length;
  } catch (err) {
    console.error(`Failed to migrate table ${tableName}:`, err);
    return 0;
  }
}

async function migrateAllTables() {
  let totalMigrated = 0;
  
  for (const table of tables) {
    const migrated = await migrateTable(table);
    totalMigrated += migrated;
  }
  
  return totalMigrated;
}

// Run the migration
migrateAllTables()
  .then(count => {
    console.log(`Migration complete. Total rows migrated: ${count}`);
    process.exit(0);
  })
  .catch(err => {
    console.error('Migration failed:', err);
    process.exit(1);
  })
  .finally(() => {
    // Close PostgreSQL connection
    pool.end();
  });
