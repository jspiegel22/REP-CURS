require('dotenv').config();
const { Pool } = require('pg');

async function createExecSqlFunction() {
  console.log('Creating exec_sql function in Supabase via direct PostgreSQL connection...');
  
  // Extract connection details from Supabase URL
  // Format: postgres://postgres:[PASSWORD]@[HOST]:[PORT]/postgres
  const supabaseUrl = process.env.SUPABASE_URL || '';
  const match = supabaseUrl.match(/^(https?:\/\/)(.+)$/);
  
  if (!match) {
    console.error('Invalid Supabase URL format');
    return false;
  }
  
  // Form a PostgreSQL connection string
  // https://supabase.example.com -> postgres://postgres.supabase.example.com:5432/postgres
  const host = match[2].replace(/\/?$/, ''); // Remove trailing slash if any
  const connectionString = `postgres://postgres:${process.env.SUPABASE_SERVICE_ROLE_KEY}@db.${host}:5432/postgres`;
  
  console.log(`Connecting to: postgres://postgres:***@db.${host}:5432/postgres`);
  
  const pool = new Pool({ connectionString });
  
  const sql = `
    -- Create or update the exec_sql function
    CREATE OR REPLACE FUNCTION exec_sql(query text)
    RETURNS TABLE(result JSONB) 
    LANGUAGE plpgsql
    SECURITY DEFINER
    AS $$
    BEGIN
        RETURN QUERY EXECUTE query;
    EXCEPTION WHEN OTHERS THEN
        RAISE EXCEPTION '%', SQLERRM;
    END;
    $$;
    
    -- Grant usage rights
    GRANT EXECUTE ON FUNCTION exec_sql TO authenticated;
    GRANT EXECUTE ON FUNCTION exec_sql TO service_role;
    
    -- Set security label to expose the function via API
    SECURITY LABEL FOR anon ON FUNCTION exec_sql IS 'FUNCTION';
  `;
  
  try {
    // Check if function exists
    const checkResult = await pool.query(`
      SELECT COUNT(*) FROM pg_proc 
      WHERE proname = 'exec_sql' AND pronamespace = 'public'::regnamespace;
    `);
    
    if (parseInt(checkResult.rows[0].count) > 0) {
      console.log('✅ exec_sql function already exists');
      return true;
    }
    
    console.log('Function does not exist. Creating it...');
    const result = await pool.query(sql);
    console.log('✅ Successfully created exec_sql function in Supabase');
    return true;
  } catch (err) {
    console.error('Error creating exec_sql function:', err.message);
    console.error('You will need to create it manually in the Supabase SQL Editor.');
    console.log('\n------------------------------------------');
    console.log('COPY AND PASTE THE FOLLOWING SQL INTO THE SUPABASE SQL EDITOR:');
    console.log('------------------------------------------');
    console.log(sql);
    console.log('------------------------------------------');
    return false;
  } finally {
    await pool.end();
  }
}

// Run the function
createExecSqlFunction()
  .then(result => {
    if (result) {
      console.log('Done!');
      process.exit(0);
    } else {
      process.exit(1);
    }
  })
  .catch(error => {
    console.error('Unexpected error:', error);
    process.exit(1);
  });