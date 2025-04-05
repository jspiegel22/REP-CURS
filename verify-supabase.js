const { createClient } = require('@supabase/supabase-js');

// Log environment variables (partially obscured for security)
console.log("SUPABASE_URL:", process.env.SUPABASE_URL 
  ? `${process.env.SUPABASE_URL.substring(0, 10)}...` : "Not set");
console.log("SUPABASE_ANON_KEY:", process.env.SUPABASE_ANON_KEY 
  ? `${process.env.SUPABASE_ANON_KEY.substring(0, 10)}...` : "Not set");
console.log("REACT_APP_SUPABASE_URL:", process.env.REACT_APP_SUPABASE_URL 
  ? `${process.env.REACT_APP_SUPABASE_URL.substring(0, 10)}...` : "Not set");
console.log("REACT_APP_SUPABASE_ANON_KEY:", process.env.REACT_APP_SUPABASE_ANON_KEY 
  ? `${process.env.REACT_APP_SUPABASE_ANON_KEY.substring(0, 10)}...` : "Not set");
console.log("SUPABASE_SERVICE_ROLE_KEY:", process.env.SUPABASE_SERVICE_ROLE_KEY 
  ? `${process.env.SUPABASE_SERVICE_ROLE_KEY.substring(0, 10)}...` : "Not set");

// Check if keys are swapped
if (process.env.SUPABASE_URL && process.env.SUPABASE_URL.startsWith('eyJhbGc')) {
  console.log("⚠️ SUPABASE_URL appears to be an API key instead of a URL");
}

if (process.env.SUPABASE_ANON_KEY && process.env.SUPABASE_ANON_KEY.startsWith('http')) {
  console.log("⚠️ SUPABASE_ANON_KEY appears to be a URL instead of an API key");
}

if (process.env.REACT_APP_SUPABASE_URL && process.env.REACT_APP_SUPABASE_URL.startsWith('eyJhbGc')) {
  console.log("⚠️ REACT_APP_SUPABASE_URL appears to be an API key instead of a URL");
}

if (process.env.REACT_APP_SUPABASE_ANON_KEY && process.env.REACT_APP_SUPABASE_ANON_KEY.startsWith('http')) {
  console.log("⚠️ REACT_APP_SUPABASE_ANON_KEY appears to be a URL instead of an API key");
}

// Fix variables if swapped (temporarily for this script)
let supabaseUrl = process.env.SUPABASE_URL;
let supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

// If URLs and keys are swapped, fix them
if (supabaseUrl && supabaseUrl.startsWith('eyJhbGc') && supabaseKey && supabaseKey.startsWith('http')) {
  console.log("Swapping URL and key for testing...");
  const temp = supabaseUrl;
  supabaseUrl = supabaseKey;
  supabaseKey = temp;
}

// If React vars are set but not the regular ones
if ((!supabaseUrl || !supabaseKey) && process.env.REACT_APP_SUPABASE_URL && process.env.REACT_APP_SUPABASE_ANON_KEY) {
  console.log("Using React app variables...");
  supabaseUrl = process.env.REACT_APP_SUPABASE_URL;
  supabaseKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
  
  // Check if these are also swapped
  if (supabaseUrl.startsWith('eyJhbGc') && supabaseKey.startsWith('http')) {
    console.log("Swapping React app URL and key for testing...");
    const temp = supabaseUrl;
    supabaseUrl = supabaseKey;
    supabaseKey = temp;
  }
}

async function testSupabaseConnection() {
  console.log("\nTesting Supabase connection...");
  console.log("Using URL:", supabaseUrl ? `${supabaseUrl.substring(0, 10)}...` : "Not set");
  console.log("Using key:", supabaseKey ? `${supabaseKey.substring(0, 10)}...` : "Not set");
  
  if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Missing Supabase credentials");
    return false;
  }
  
  try {
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false }
    });
    
    // Test a simple health check
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error("❌ Supabase connection error:", error.message);
      return false;
    }
    
    console.log("✅ Supabase connection successful");
    
    // Try retrieving some schema info
    try {
      // Use the REST API directly for SQL query
      const apiUrl = `${supabaseUrl}/rest/v1/sql`;
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': supabaseKey,
          'Authorization': `Bearer ${supabaseKey}`
        },
        body: JSON.stringify({
          query: "SELECT current_database() as database, current_schema as schema"
        })
      });
      
      const result = await response.json();
      
      if (result.error) {
        console.error("❌ SQL query error:", result.error);
      } else {
        console.log("Database info:", result);
      }
    } catch (sqlError) {
      console.error("❌ Error executing SQL:", sqlError);
    }
    
    return true;
  } catch (error) {
    console.error("❌ Failed to initialize Supabase client:", error);
    return false;
  }
}

testSupabaseConnection()
  .then(success => {
    if (success) {
      console.log("\n✅ Supabase verification completed successfully");
      process.exit(0);
    } else {
      console.error("\n❌ Supabase verification failed");
      process.exit(1);
    }
  })
  .catch(error => {
    console.error("\n❌ Supabase verification error:", error);
    process.exit(1);
  });
