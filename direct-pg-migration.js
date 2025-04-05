require('dotenv').config();
const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');

async function directPgMigration() {
  console.log('Starting direct PostgreSQL migration to Supabase...');
  
  // Check environment variables
  const pgUrl = process.env.SUPABASE_PG_URL;
  if (!pgUrl) {
    console.error('Missing SUPABASE_PG_URL environment variable. Run get-supabase-pg-url.js for instructions.');
    return false;
  }
  
  // Connect to Supabase PostgreSQL database directly
  let pgPool;
  try {
    pgPool = new Pool({
      connectionString: pgUrl,
      ssl: { rejectUnauthorized: false }
    });
    
    const client = await pgPool.connect();
    console.log('Connected to Supabase PostgreSQL database directly...');
    
    // Test connection
    const { rows } = await client.query('SELECT current_database() as db, current_user as user');
    console.log(`Connected to database: ${rows[0].db} as user: ${rows[0].user}`);
    client.release();
  } catch (error) {
    console.error('Error connecting to Supabase PostgreSQL:', error.message);
    return false;
  }
  
  // Migration files to apply in order
  const migrationFiles = [
    { path: path.join(__dirname, 'supabase', 'migrations', '20250405_add_exec_sql_function.sql'), required: true },
    { path: path.join(__dirname, 'supabase', 'migrations', '20250405_initial_schema.sql'), required: true },
    { path: path.join(__dirname, 'supabase', 'migrations', '20250405_initial_data.sql'), required: false }
  ];
  
  // Process each migration file
  for (const migration of migrationFiles) {
    if (!fs.existsSync(migration.path)) {
      if (migration.required) {
        console.error(`Required migration file not found: ${migration.path}`);
        return false;
      } else {
        console.warn(`Optional migration file not found: ${migration.path}`);
        continue;
      }
    }
    
    console.log(`Applying migration: ${path.basename(migration.path)}...`);
    const sql = fs.readFileSync(migration.path, 'utf8');
    
    try {
      const client = await pgPool.connect();
      try {
        // Execute the entire migration file as a transaction
        await client.query('BEGIN');
        await client.query(sql);
        await client.query('COMMIT');
        console.log(`✅ Applied migration: ${path.basename(migration.path)}`);
      } catch (error) {
        await client.query('ROLLBACK');
        console.error(`❌ Error applying migration ${path.basename(migration.path)}:`, error.message);
        
        // Don't stop for optional migrations
        if (migration.required) {
          client.release();
          return false;
        }
      } finally {
        client.release();
      }
    } catch (error) {
      console.error('Connection error:', error.message);
      return false;
    }
  }
  
  // Verify tables were created
  try {
    const client = await pgPool.connect();
    
    const { rows } = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    client.release();
    
    if (rows.length > 0) {
      console.log('Tables found in database:');
      rows.forEach(row => {
        console.log(`- ${row.table_name}`);
      });
    } else {
      console.error('No tables found in database after migration');
      return false;
    }
  } catch (error) {
    console.error('Error verifying tables:', error.message);
    return false;
  }
  
  console.log('✅ Direct PostgreSQL migration to Supabase completed successfully');
  return true;
}

// Run if called directly
if (require.main === module) {
  directPgMigration()
    .then(success => {
      if (success) {
        console.log('✅ Migration process complete!');
        process.exit(0);
      } else {
        console.error('❌ Migration process failed.');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('Unexpected error:', error);
      process.exit(1);
    })
    .finally(() => {
      // Close any open connections
      const pg = require('pg');
      pg.pools.end();
    });
}

module.exports = { directPgMigration };