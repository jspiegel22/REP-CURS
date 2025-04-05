const { createClient } = require('@supabase/supabase-js');

// Check environment variables
if (!process.env.SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
  console.error("Missing Supabase environment variables");
  process.exit(1);
}

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase = createClient(supabaseUrl, supabaseKey, {
  auth: { persistSession: false }
});

async function checkTables() {
  console.log("Checking tables in Supabase...");
  
  try {
    // Get table list using SQL API
    const apiUrl = `${supabaseUrl}/rest/v1/sql`;
    const response = await fetch(apiUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'apikey': supabaseKey,
        'Authorization': `Bearer ${supabaseKey}`
      },
      body: JSON.stringify({
        query: `
          SELECT table_name
          FROM information_schema.tables
          WHERE table_schema = 'public'
          AND table_type = 'BASE TABLE'
          ORDER BY table_name
        `
      })
    });
    
    const result = await response.json();
    if (result.error) {
      console.error("SQL API error:", result.error);
      throw new Error(`SQL API error: ${result.error.message || result.error}`);
    }
    
    console.log("Found tables:", result);
    
    // Check for specific tables
    const tablesOfInterest = ['users', 'guide_submissions', 'listings', 'session'];
    
    for (const table of tablesOfInterest) {
      // Try to query each table
      try {
        const response = await fetch(`${supabaseUrl}/rest/v1/${table}?limit=1`, {
          method: 'GET',
          headers: {
            'apikey': supabaseKey,
            'Authorization': `Bearer ${supabaseKey}`
          }
        });
        
        const status = response.status;
        console.log(`Table ${table} query status: ${status}`);
        
        if (status === 200) {
          console.log(`Table ${table} exists and is accessible`);
        } else {
          console.warn(`Table ${table} may not exist or is not accessible: ${status}`);
        }
      } catch (tableError) {
        console.error(`Error querying table ${table}:`, tableError);
      }
    }
    
    return true;
  } catch (error) {
    console.error("Error checking tables:", error);
    return false;
  }
}

// Run the check
checkTables()
  .then(success => {
    if (success) {
      console.log("✅ Table check completed");
      process.exit(0);
    } else {
      console.error("❌ Table check failed");
      process.exit(1);
    }
  })
  .catch(error => {
    console.error("Table check error:", error);
    process.exit(1);
  });
