require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');

// Use the DATABASE_URL from the environment for direct connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function executeSchema() {
  try {
    console.log('Reading SQL schema...');
    const schema = fs.readFileSync('schema-to-execute.sql', 'utf8');

    console.log('Connecting to database...');
    const client = await pool.connect();
    
    try {
      console.log('Executing schema as transaction...');
      await client.query('BEGIN');
      await client.query(schema);
      await client.query('COMMIT');
      console.log('Schema executed successfully!');

      // Verify tables
      await verifyTables(client);
    } catch (error) {
      console.error('Error executing schema:', error);
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Database error:', error);
  } finally {
    pool.end();
  }
}

async function verifyTables(client) {
  const tables = [
    'users', 
    'listings', 
    'bookings', 
    'leads', 
    'guide_submissions',
    'resorts', 
    'villas',
    'rewards',
    'social_shares',
    'weather_cache',
    'session'
  ];

  console.log('\nVerifying tables...');

  for (const table of tables) {
    try {
      const result = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = $1
        )`, [table]);
      
      const exists = result.rows[0].exists;
      
      if (exists) {
        console.log(`✅ Table '${table}' exists`);
      } else {
        console.log(`❌ Table '${table}' does not exist`);
      }
    } catch (error) {
      console.log(`❌ Error verifying table '${table}':`, error.message);
    }
  }
}

executeSchema();