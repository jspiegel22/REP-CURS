const { createClient } = require('@supabase/supabase-js');
const { Pool } = require('pg');

async function migrateDataDirect() {
  console.log("Starting direct data migration to Supabase...");
  
  // Check for required environment variables
  if (!process.env.PGHOST || !process.env.PGPORT || !process.env.PGUSER || 
      !process.env.PGPASSWORD || !process.env.PGDATABASE) {
    console.error("PostgreSQL connection parameters not set. Need PGHOST, PGPORT, PGUSER, PGPASSWORD, PGDATABASE");
    return false;
  }
  
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error("Supabase credentials not set. Cannot connect to Supabase");
    return false;
  }
  
  // Create Supabase client
  const supabase = createClient(
    process.env.SUPABASE_URL, 
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { persistSession: false } }
  );
  
  // Create PostgreSQL connection using individual parameters
  const sourceClient = new Pool({
    host: process.env.PGHOST,
    port: process.env.PGPORT,
    user: process.env.PGUSER,
    password: process.env.PGPASSWORD,
    database: process.env.PGDATABASE,
    ssl: {
      rejectUnauthorized: false
    }
  });
  
  console.log("Testing connections...");
  
  try {
    // Test Postgres connection
    console.log("Testing connection to source database...");
    console.log(`Connecting to: ${process.env.PGHOST}:${process.env.PGPORT}/${process.env.PGDATABASE}`);
    await sourceClient.query('SELECT NOW()');
    console.log("Source database connection successful");
    
    // Test Supabase connection
    console.log("Testing connection to Supabase...");
    const { data, error } = await supabase.from('users').select('count(*)');
    if (error) throw error;
    console.log("Supabase connection successful");
    
    // Get list of tables from source
    console.log("Retrieving table list from source database...");
    const tablesResult = await sourceClient.query(`
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      AND table_type = 'BASE TABLE'
      ORDER BY table_name
    `);
    
    const tables = tablesResult.rows.map(row => row.table_name);
    console.log(`Found ${tables.length} tables: ${tables.join(', ')}`);
    
    // Migrate each table
    for (const tableName of tables) {
      await migrateTable(sourceClient, tableName);
      console.log(`✅ Table ${tableName} migrated successfully`);
    }
    
    console.log("✅ Data migration completed successfully");
    return true;
  } catch (error) {
    console.error("Error during migration:", error);
    return false;
  } finally {
    // Close the PostgreSQL connection
    await sourceClient.end();
  }
}

async function migrateTable(sourceClient, tableName) {
  console.log(`Migrating table: ${tableName}`);
  
  try {
    // Get count of records
    const countResult = await sourceClient.query(`SELECT COUNT(*) FROM "${tableName}"`);
    const count = parseInt(countResult.rows[0].count);
    
    if (count === 0) {
      console.log(`Table ${tableName} is empty, skipping`);
      return;
    }
    
    console.log(`Found ${count} records to migrate in ${tableName}`);
    
    // Get all records from the source table
    const dataResult = await sourceClient.query(`SELECT * FROM "${tableName}"`);
    const rows = dataResult.rows;
    
    // Create Supabase client for batch inserts
    const supabase = createClient(
      process.env.SUPABASE_URL, 
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      { auth: { persistSession: false } }
    );
    
    // Process in batches
    const batchSize = 50;
    let successCount = 0;
    
    for (let i = 0; i < rows.length; i += batchSize) {
      const batch = rows.slice(i, i + batchSize);
      
      try {
        // Clean the data for JSON compatibility
        const cleanBatch = batch.map(row => {
          const cleanRow = {};
          for (const [key, value] of Object.entries(row)) {
            if (value instanceof Date) {
              cleanRow[key] = value.toISOString();
            } else if (value instanceof Buffer) {
              cleanRow[key] = value.toString('base64');
            } else {
              cleanRow[key] = value;
            }
          }
          return cleanRow;
        });
        
        // Insert into Supabase
        const { error } = await supabase.from(tableName).insert(cleanBatch);
        
        if (error) {
          console.error(`Error inserting batch (${i} to ${i + batch.length - 1}):`, error);
          
          // Try one at a time if batch fails
          console.log("Attempting individual inserts...");
          for (const row of cleanBatch) {
            const { error: rowError } = await supabase.from(tableName).insert([row]);
            if (!rowError) {
              successCount++;
            } else {
              console.error(`Error inserting row:`, rowError);
            }
          }
        } else {
          successCount += batch.length;
          console.log(`Migrated batch ${Math.floor(i / batchSize) + 1}/${Math.ceil(rows.length / batchSize)} (${i}-${Math.min(i + batchSize - 1, rows.length - 1)})`);
        }
      } catch (err) {
        console.error(`Error processing batch:`, err);
      }
    }
    
    console.log(`Migrated ${successCount}/${rows.length} records to ${tableName}`);
    
    if (successCount < rows.length) {
      console.warn(`⚠️ Only migrated ${successCount} of ${rows.length} records in ${tableName}`);
    }
  } catch (error) {
    console.error(`Error migrating table ${tableName}:`, error);
    throw error;
  }
}

// Run the migration
migrateDataDirect()
  .then(success => {
    if (success) {
      console.log("✅ Direct data migration completed successfully");
      process.exit(0);
    } else {
      console.error("❌ Direct data migration failed");
      process.exit(1);
    }
  })
  .catch(error => {
    console.error("Migration error:", error);
    process.exit(1);
  });
