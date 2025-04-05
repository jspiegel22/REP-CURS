/**
 * This script will create or check the exec_sql function in Supabase
 * The exec_sql function is required for many operations, including migrations
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));

async function createExecSqlFunction() {
  // Check environment variables
  if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    console.error('Missing required Supabase environment variables.');
    console.error('Make sure SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are set.');
    return false;
  }

  // Read the SQL file
  const sqlPath = path.join(__dirname, '..', 'supabase', 'migrations', '20250405_add_exec_sql_function.sql');
  if (!fs.existsSync(sqlPath)) {
    console.error(`SQL file not found: ${sqlPath}`);
    return false;
  }

  const sql = fs.readFileSync(sqlPath, 'utf8');
  console.log('Read SQL function definition');

  // Setup Supabase client with service role key
  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    console.log('Creating exec_sql function via direct SQL...');

    // Create the function using REST API
    const url = `${process.env.SUPABASE_URL}/rest/v1/sql`;
    const headers = {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${process.env.SUPABASE_SERVICE_ROLE_KEY}`,
      'apikey': process.env.SUPABASE_SERVICE_ROLE_KEY
    };

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query: sql })
    });

    const responseText = await response.text();
    
    if (!response.ok) {
      console.error(`Error creating exec_sql function: HTTP ${response.status}`);
      console.error(responseText);
      
      // Check if error is because function already exists
      if (responseText.includes('already exists')) {
        console.log('exec_sql function already exists');
      } else {
        return false;
      }
    } else {
      console.log('✅ Successfully created exec_sql function');
      console.log('Response:', responseText);
    }

    // Verify the function works
    console.log('Verifying exec_sql function...');
    try {
      const { data, error } = await supabase.rpc('exec_sql', {
        sql_query: 'SELECT 1 as test'
      });

      if (error) {
        console.error('Function verification failed:', error.message);
        return false;
      }

      console.log('✅ Verified exec_sql function is working correctly');
      console.log('Function returned:', data);
      return true;
    } catch (verifyError) {
      console.error('Error during verification:', verifyError.message);
      
      // Try one more time with a different approach using fetch
      console.log('Trying alternative verification method...');
      try {
        const verifyResponse = await fetch(`${process.env.SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
          method: 'POST',
          headers,
          body: JSON.stringify({ sql_query: 'SELECT 1 as test' })
        });
        
        if (verifyResponse.ok) {
          console.log('✅ Alternative verification succeeded');
          return true;
        } else {
          console.error('Alternative verification failed:', await verifyResponse.text());
          return false;
        }
      } catch (altError) {
        console.error('Alternative verification error:', altError.message);
        return false;
      }
    }
  } catch (error) {
    console.error('Unexpected error:', error.message);
    return false;
  }
}

// Run if called directly
if (require.main === module) {
  createExecSqlFunction()
    .then(success => {
      if (success) {
        console.log('Function creation completed successfully');
        process.exit(0);
      } else {
        console.error('Function creation failed');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('Unexpected error:', error);
      process.exit(1);
    });
}

module.exports = { createExecSqlFunction };