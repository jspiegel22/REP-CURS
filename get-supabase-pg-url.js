require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

async function getSupabasePgUrl() {
  console.log('Attempting to retrieve Supabase PostgreSQL connection string...');
  
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing Supabase credentials. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
    return null;
  }
  
  try {
    // Initialize Supabase client with service role key for admin access
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY,
      {
        db: { schema: 'public' }
      }
    );
    
    console.log('Connected to Supabase...');
    
    // Try to get database connection info (this won't actually work via the JS client)
    // This is just to illustrate that we need manual intervention
    console.log('');
    console.log('⚠️ NOTE: The PostgreSQL connection string cannot be retrieved programmatically via the Supabase JS client.');
    console.log('You need to get it manually from the Supabase dashboard:');
    console.log('');
    console.log('1. Go to https://supabase.com/dashboard and select your project');
    console.log('2. Navigate to "Settings" > "Database"');
    console.log('3. Find the "Connection string" or "URI" section');
    console.log('4. Choose "Connection pooling" if available for better performance');
    console.log('5. Copy the connection string that looks like:');
    console.log('   postgresql://postgres:[PASSWORD]@db.[PROJECT_ID].supabase.co:5432/postgres');
    console.log('');
    console.log('6. Add it to your .env file as SUPABASE_PG_URL=your_connection_string');
    console.log('');
    console.log('After you have added the connection string, you can run:');
    console.log('node direct-pg-migration.js');
    
    return null;
  } catch (error) {
    console.error('Error connecting to Supabase:', error.message);
    return null;
  }
}

// Run if called directly
if (require.main === module) {
  getSupabasePgUrl()
    .then(pgUrl => {
      if (pgUrl) {
        console.log('Retrieved PostgreSQL connection string:', pgUrl);
      }
      process.exit(0);
    })
    .catch(error => {
      console.error('Unexpected error:', error);
      process.exit(1);
    });
}

module.exports = { getSupabasePgUrl };