require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Get credentials from environment variables
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_ANON_KEY;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('Missing Supabase credentials');
  process.exit(1);
}

console.log('Supabase configuration:');
console.log(`- URL configured: ${supabaseUrl}`);
console.log(`- Anon Key configured: ${!!supabaseKey}`);
console.log(`- Service Key configured: ${!!supabaseServiceKey}`);

// Initialize Supabase client
const supabase = createClient(supabaseUrl, supabaseKey);

// Test authentication connection
async function testAuth() {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('❌ Supabase auth connection test failed:', error.message);
    } else {
      console.log('✅ Supabase auth connection successful');
    }
    
    return !error;
  } catch (err) {
    console.error('❌ Supabase auth connection error:', err.message);
    return false;
  }
}

// Test database connection by checking for tables
async function testDatabase() {
  try {
    // Try to query a table
    const { data, error } = await supabase
      .from('guide_submissions')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      if (error.message.includes('does not exist')) {
        console.log('⚠️ guide_submissions table does not exist yet - may need migration');
      } else {
        console.error('❌ Supabase data access failed:', error.message);
      }
      
      // Try another table
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select('count', { count: 'exact', head: true });
      
      if (usersError) {
        if (usersError.message.includes('does not exist')) {
          console.log('⚠️ users table does not exist yet - may need migration');
        } else {
          console.error('❌ Supabase users table access failed:', usersError.message);
        }
        return false;
      } else {
        console.log('✅ Supabase users table access successful');
        return true;
      }
    } else {
      console.log('✅ Supabase guide_submissions table access successful');
      return true;
    }
  } catch (err) {
    console.error('❌ Supabase database connection error:', err.message);
    return false;
  }
}

// Test all connections
async function runTests() {
  try {
    const authSuccess = await testAuth();
    const dbSuccess = await testDatabase();
    
    if (authSuccess && dbSuccess) {
      console.log('✅ All Supabase connections successful');
    } else if (authSuccess) {
      console.log('⚠️ Supabase auth works but database tables may need migration');
    } else {
      console.log('❌ Supabase connection tests failed');
    }
    
    // Try to list all tables (requires service role key)
    if (supabaseServiceKey) {
      const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey);
      
      try {
        const { data, error } = await supabaseAdmin.rpc('list_tables');
        
        if (error) {
          console.error('❌ Could not list tables:', error.message);
        } else if (data && data.length > 0) {
          console.log('✅ Tables in Supabase database:');
          data.forEach(table => console.log(`- ${table}`));
        } else {
          console.log('⚠️ No tables found in Supabase database');
        }
      } catch (err) {
        console.error('❌ Error listing tables:', err.message);
      }
    }
    
  } catch (err) {
    console.error('❌ Error running tests:', err.message);
  }
}

// Run all tests
runTests();