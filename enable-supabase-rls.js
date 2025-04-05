require('dotenv').config();
const { Pool } = require('pg');

async function enableRowLevelSecurity() {
  console.log('Starting to enable Row Level Security for tables...');
  
  // Check if required environment variables are set
  if (!process.env.DATABASE_URL) {
    console.error('Missing required DATABASE_URL environment variable.');
    return false;
  }
  
  // List of tables to enable RLS for
  const tables = [
    'users', 'listings', 'resorts', 'bookings', 'leads', 
    'guide_submissions', 'rewards', 'social_shares', 
    'weather_cache', 'villas', 'adventures', 'session'
  ];
  
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
      // First, make sure tables are in the public schema
      for (const table of tables) {
        try {
          // Check if table exists first
          const checkResult = await client.query(`
            SELECT EXISTS (
              SELECT FROM information_schema.tables 
              WHERE table_schema = 'public' 
              AND table_name = $1
            );
          `, [table]);
          
          const tableExists = checkResult.rows[0].exists;
          
          if (!tableExists) {
            console.log(`Table '${table}' doesn't exist, skipping`);
            continue;
          }
          
          // Enable RLS
          await client.query(`ALTER TABLE public.${table} ENABLE ROW LEVEL SECURITY;`);
          console.log(`✅ Enabled RLS for table: ${table}`);
          
          // Create a policy that allows all operations for authenticated users
          await client.query(`
            CREATE POLICY "${table}_policy" ON public.${table}
            USING (true)
            WITH CHECK (true);
          `);
          console.log(`✅ Created permissive policy for table: ${table}`);
          
        } catch (error) {
          if (error.message.includes('already exists')) {
            console.log(`⚠️ Policy already exists for table: ${table}`);
          } else {
            console.error(`❌ Error processing table ${table}:`, error.message);
          }
        }
      }
      
      console.log('RLS setup completed!');
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
  enableRowLevelSecurity()
    .then(success => {
      if (success) {
        console.log('RLS setup successful!');
        process.exit(0);
      } else {
        console.error('RLS setup failed!');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('Unexpected error:', error);
      process.exit(1);
    });
}

module.exports = { enableRowLevelSecurity };