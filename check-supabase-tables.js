require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

/**
 * Script to check if tables exist in Supabase
 * Useful after migration to verify all tables were created correctly
 */
async function checkSupabaseTables() {
  console.log('Checking for tables in Supabase...');
  
  if (!isSupabaseConfigured()) {
    console.error('Supabase is not configured. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY environment variables.');
    return false;
  }
  
  try {
    // Initialize Supabase client with service role key for admin access
    const supabase = createClient(
      process.env.SUPABASE_URL,
      process.env.SUPABASE_SERVICE_ROLE_KEY
    );
    
    // Test the connection by trying to access a table
    const { data, error } = await supabase.from('users').select('*').limit(1);
    
    if (error) {
      if (error.code === 'PGRST116') {
        // Error code means permission issue
        console.error('Permission error accessing Supabase:', error.message);
      } else if (error.code === '42P01') {
        // Error code means table does not exist
        console.error('Users table does not exist in Supabase.');
      } else {
        console.error('Error accessing Supabase:', error);
      }
      
      // Try to list all tables 
      console.log('Attempting to list all tables...');
      const { data: tableData, error: tableError } = await supabase
        .from('information_schema.tables')
        .select('table_name')
        .eq('table_schema', 'public');
      
      if (tableError) {
        console.error('Failed to list tables:', tableError.message);
        
        // Try alternative approach
        console.log('Trying alternative approach to list tables...');
        try {
          // Check if tables exist by trying to access them directly
          const tablesToCheck = [
            'users', 'listings', 'guide_submissions', 'bookings', 
            'leads', 'resorts', 'villas', 'rewards', 'social_shares',
            'weather_cache'
          ];
          
          const tableResults = {};
          
          for (const table of tablesToCheck) {
            const { error: tableCheckError } = await supabase
              .from(table)
              .select('count')
              .limit(1);
            
            tableResults[table] = !tableCheckError;
          }
          
          console.log('Table existence check results:');
          for (const [table, exists] of Object.entries(tableResults)) {
            console.log(`- ${table}: ${exists ? '✅ exists' : '❌ missing'}`);
          }
          
          const existingTables = Object.entries(tableResults)
            .filter(([_, exists]) => exists)
            .map(([table]) => table);
          
          return existingTables.length > 0;
        } catch (e) {
          console.error('Alternative approach failed:', e.message);
          return false;
        }
      } else {
        if (tableData && tableData.length > 0) {
          console.log(`Found ${tableData.length} tables in Supabase:`);
          tableData.forEach(row => console.log(`- ${row.table_name}`));
          return true;
        } else {
          console.log('No tables found in Supabase database.');
          return false;
        }
      }
    } else {
      // Successfully retrieved data from users table
      console.log('✅ Successfully connected to Supabase and found users table!');
      
      // List tables
      const tables = [
        'users', 'listings', 'guide_submissions', 'bookings', 
        'leads', 'resorts', 'villas', 'rewards', 'social_shares',
        'weather_cache'
      ];
      
      let foundCount = 1; // Already found users
      
      for (const table of tables) {
        if (table === 'users') continue; // Already checked
        
        const { error: tableError } = await supabase
          .from(table)
          .select('count')
          .limit(1);
        
        if (tableError) {
          console.log(`❌ Table '${table}' not found or not accessible`);
        } else {
          console.log(`✅ Table '${table}' exists and is accessible`);
          foundCount++;
        }
      }
      
      console.log(`Found ${foundCount}/${tables.length} expected tables in Supabase.`);
      return foundCount > 0;
    }
  } catch (error) {
    console.error('Error checking Supabase tables:', error);
    return false;
  }
}

function isSupabaseConfigured() {
  return !!(process.env.SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY);
}

// Run if called directly
if (require.main === module) {
  checkSupabaseTables()
    .then(exists => {
      if (exists) {
        console.log('✅ Supabase tables check completed successfully.');
        process.exit(0);
      } else {
        console.error('❌ Supabase tables check failed - tables not found.');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('Unexpected error checking Supabase tables:', error);
      process.exit(1);
    });
}

module.exports = { checkSupabaseTables, isSupabaseConfigured };