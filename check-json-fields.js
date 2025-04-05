require('dotenv').config();
const { Pool } = require('pg');

async function checkJsonFields() {
  console.log('Checking JSON fields in database tables...');
  
  // Check if required environment variables are set
  if (!process.env.DATABASE_URL) {
    console.error('Missing required DATABASE_URL environment variable.');
    return false;
  }
  
  // Tables with JSON fields to check
  const tables = ['resorts', 'guide_submissions', 'adventures'];
  
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
      for (const table of tables) {
        console.log(`\nChecking table: ${table}`);
        
        // Get the table schema
        const schemaResult = await client.query(`
          SELECT column_name, data_type, udt_name
          FROM information_schema.columns
          WHERE table_schema = 'public' AND table_name = $1
          ORDER BY ordinal_position
        `, [table]);
        
        const jsonColumns = schemaResult.rows.filter(col => 
          col.data_type === 'json' || col.data_type === 'jsonb' || col.udt_name === 'json' || col.udt_name === 'jsonb'
        );
        
        console.log(`JSON columns found: ${jsonColumns.length}`);
        jsonColumns.forEach(col => {
          console.log(`- ${col.column_name}: ${col.data_type}`);
        });
        
        if (jsonColumns.length > 0) {
          // Get a sample record to see the current values
          const sampleResult = await client.query(`SELECT * FROM ${table} LIMIT 1`);
          if (sampleResult.rows.length > 0) {
            const sample = sampleResult.rows[0];
            jsonColumns.forEach(col => {
              const value = sample[col.column_name];
              console.log(`  Sample value for ${col.column_name}:`);
              console.log(`  ${typeof value}: ${JSON.stringify(value, null, 2)}`);
            });
          } else {
            console.log(`No records found in ${table} to sample`);
          }
        }
      }
      
      return true;
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

// Run if called directly
if (require.main === module) {
  checkJsonFields()
    .then(success => {
      if (success) {
        console.log('\nJSON field check completed successfully!');
        process.exit(0);
      } else {
        console.error('\nJSON field check failed!');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('Unexpected error:', error);
      process.exit(1);
    });
}