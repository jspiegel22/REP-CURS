require('dotenv').config();
const { Pool } = require('pg');

async function migrateDataDirect() {
  console.log('Starting direct data migration using PostgreSQL...');
  
  // Check if required environment variables are set
  if (!process.env.DATABASE_URL || !process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing required environment variables.');
    return false;
  }
  
  // Connect to the source database
  const sourcePool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });
  
  // List of tables to migrate
  const tables = [
    'users', 'listings', 'resorts', 'bookings', 'leads', 
    'guide_submissions', 'rewards', 'social_shares', 
    'weather_cache', 'villas', 'adventures', 'session'
  ];
  
  try {
    console.log('Connecting to source database...');
    const sourceClient = await sourcePool.connect();
    console.log('Connected to source database successfully');
    
    try {
      // Migrate each table
      for (const table of tables) {
        await migrateTable(sourceClient, table);
      }
      
      console.log('Data migration completed!');
      return true;
    } finally {
      sourceClient.release();
    }
  } catch (error) {
    console.error('Error connecting to source database:', error.message);
    return false;
  } finally {
    await sourcePool.end();
  }
}

async function migrateTable(sourceClient, tableName) {
  console.log(`\nMigrating data for table: ${tableName}`);
  
  try {
    // Get data from source table
    const dataResult = await sourceClient.query(`SELECT * FROM ${tableName}`);
    const rows = dataResult.rows;
    
    console.log(`Found ${rows.length} rows in table ${tableName}`);
    
    if (rows.length === 0) {
      console.log(`No data to migrate for ${tableName}`);
      return true;
    }
    
    // Get table schema
    const schemaResult = await sourceClient.query(`
      SELECT column_name, data_type, udt_name
      FROM information_schema.columns
      WHERE table_schema = 'public' AND table_name = $1
      ORDER BY ordinal_position
    `, [tableName]);
    
    const schema = schemaResult.rows;
    
    // Identify JSON columns
    const jsonColumns = schema
      .filter(col => col.data_type === 'json' || col.data_type === 'jsonb' || col.udt_name === 'json' || col.udt_name === 'jsonb')
      .map(col => col.column_name);
    
    if (jsonColumns.length > 0) {
      console.log(`Found JSON columns in ${tableName}: ${jsonColumns.join(', ')}`);
    }
    
    // Process rows in batches
    const batchSize = 50;
    const batches = Math.ceil(rows.length / batchSize);
    
    for (let i = 0; i < batches; i++) {
      const start = i * batchSize;
      const end = Math.min((i + 1) * batchSize, rows.length);
      const batchRows = rows.slice(start, end);
      
      console.log(`Processing batch ${i+1}/${batches} (${batchRows.length} rows)...`);
      
      // Create INSERT statement parts
      let columnNames = schema.map(col => col.column_name).join(', ');
      
      // For each row, create a VALUES clause with proper type casting for JSON
      let valuesClauses = [];
      let valueParams = [];
      let paramCounter = 1;
      
      for (const row of batchRows) {
        let rowPlaceholders = [];
        
        for (const col of schema) {
          const colName = col.column_name;
          const value = row[colName];
          
          // Handle JSON columns specially
          if (jsonColumns.includes(colName)) {
            if (value === null) {
              rowPlaceholders.push('NULL');
            } else {
              // For JSON columns, use CAST to ensure proper format
              rowPlaceholders.push(`$${paramCounter}::jsonb`);
              // Convert to string if it's already an object
              valueParams.push(typeof value === 'object' ? JSON.stringify(value) : value);
              paramCounter++;
            }
          } else {
            rowPlaceholders.push(`$${paramCounter}`);
            valueParams.push(value);
            paramCounter++;
          }
        }
        
        valuesClauses.push(`(${rowPlaceholders.join(', ')})`);
      }
      
      // Combine all parts into the final INSERT statement
      const insertSQL = `
        INSERT INTO ${tableName} (${columnNames})
        VALUES ${valuesClauses.join(', ')}
        ON CONFLICT DO NOTHING
      `;
      
      // Insert data directly
      try {
        await sourceClient.query(insertSQL, valueParams);
        console.log(`✅ Successfully inserted batch for ${tableName}`);
      } catch (error) {
        console.error(`❌ Error inserting batch for ${tableName}:`, error.message);
        // Log more details for debugging
        console.error(`SQL: ${insertSQL}`);
        console.error(`Parameters count: ${valueParams.length}`);
        // Sample of parameters (first few)
        console.error(`First few parameters: ${JSON.stringify(valueParams.slice(0, 5))}`);
      }
    }
    
    // Verify row count
    try {
      const verifyResult = await sourceClient.query(`SELECT COUNT(*) FROM ${tableName}`);
      const count = parseInt(verifyResult.rows[0].count);
      console.log(`✅ Verification: ${tableName} has ${count} rows after migration`);
    } catch (error) {
      console.error(`❌ Error verifying row count for ${tableName}:`, error.message);
    }
    
    return true;
  } catch (error) {
    console.error(`❌ Error migrating ${tableName}:`, error.message);
    return false;
  }
}

// Run if called directly
if (require.main === module) {
  migrateDataDirect()
    .then(success => {
      if (success) {
        console.log('\nData migration successful!');
        process.exit(0);
      } else {
        console.error('\nData migration failed!');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('Unexpected error:', error);
      process.exit(1);
    });
}

module.exports = { migrateDataDirect };