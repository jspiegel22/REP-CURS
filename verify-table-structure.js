require('dotenv').config();
const { Pool } = require('pg');

async function verifyTableStructure() {
  console.log('Verifying database table structure...');
  
  // Check if required environment variables are set
  if (!process.env.DATABASE_URL) {
    console.error('Missing required DATABASE_URL environment variable.');
    return false;
  }
  
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
      // List tables in the public schema
      const tablesResult = await client.query(`
        SELECT table_name 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
        ORDER BY table_name;
      `);
      
      const tables = tablesResult.rows.map(row => row.table_name);
      console.log(`\nFound ${tables.length} tables in the public schema:`);
      tables.forEach(table => console.log(`- ${table}`));
      
      // Check for stored functions including exec_sql
      const functionsResult = await client.query(`
        SELECT routine_name 
        FROM information_schema.routines 
        WHERE routine_schema = 'public' AND routine_type = 'FUNCTION'
        ORDER BY routine_name;
      `);
      
      const functions = functionsResult.rows.map(row => row.routine_name);
      console.log(`\nFound ${functions.length} functions in the public schema:`);
      functions.forEach(func => console.log(`- ${func}`));
      
      // Check if our expected tables are there
      const expectedTables = [
        'users', 'listings', 'resorts', 'bookings', 'leads', 
        'guide_submissions', 'rewards', 'social_shares', 
        'weather_cache', 'villas', 'adventures', 'session'
      ];
      
      const missingTables = expectedTables.filter(t => !tables.includes(t));
      const existingTables = expectedTables.filter(t => tables.includes(t));
      
      console.log(`\nExpected tables check:`);
      console.log(`- Present (${existingTables.length}): ${existingTables.join(', ') || 'none'}`);
      console.log(`- Missing (${missingTables.length}): ${missingTables.join(', ') || 'none'}`);
      
      // Check Supabase configuration
      await checkSupabaseConfig(client);
      
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

async function checkSupabaseConfig(client) {
  console.log('\nChecking Supabase configuration...');
  
  // Check if auth schema exists
  const authSchemaResult = await client.query(`
    SELECT EXISTS (
      SELECT FROM information_schema.schemata 
      WHERE schema_name = 'auth'
    );
  `);
  
  const authSchemaExists = authSchemaResult.rows[0].exists;
  console.log(`- Auth schema exists: ${authSchemaExists}`);
  
  // Check if storage schema exists
  const storageSchemaResult = await client.query(`
    SELECT EXISTS (
      SELECT FROM information_schema.schemata 
      WHERE schema_name = 'storage'
    );
  `);
  
  const storageSchemaExists = storageSchemaResult.rows[0].exists;
  console.log(`- Storage schema exists: ${storageSchemaExists}`);
  
  // Check if RLS is enabled for our tables
  console.log('\nChecking Row Level Security status:');
  
  const rlsResult = await client.query(`
    SELECT tablename, relrowsecurity
    FROM pg_tables 
    JOIN pg_class ON pg_tables.tablename = pg_class.relname
    WHERE schemaname = 'public' 
    AND tablename IN (
      'users', 'listings', 'resorts', 'bookings', 'leads', 
      'guide_submissions', 'rewards', 'social_shares', 
      'weather_cache', 'villas', 'adventures', 'session'
    )
    ORDER BY tablename;
  `);
  
  rlsResult.rows.forEach(row => {
    console.log(`- ${row.tablename}: RLS ${row.relrowsecurity ? 'enabled' : 'disabled'}`);
  });
  
  // Check if there are any RLS policies
  const policiesResult = await client.query(`
    SELECT tablename, policyname
    FROM pg_policies
    WHERE schemaname = 'public'
    ORDER BY tablename, policyname;
  `);
  
  console.log('\nRow Level Security policies:');
  if (policiesResult.rows.length === 0) {
    console.log('- No policies found');
  } else {
    policiesResult.rows.forEach(row => {
      console.log(`- ${row.tablename}: ${row.policyname}`);
    });
  }
}

// Run if called directly
if (require.main === module) {
  verifyTableStructure()
    .then(success => {
      if (success) {
        console.log('\nVerification completed successfully!');
        process.exit(0);
      } else {
        console.error('\nVerification failed!');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('Unexpected error:', error);
      process.exit(1);
    });
}