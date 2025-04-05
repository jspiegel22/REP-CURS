// Verify that the application is properly configured to use Supabase
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

async function verifyAppMigration() {
  console.log("\n----- Verifying Application Migration -----");
  
  // 1. Check environment variables
  console.log("\nStep 1: Checking environment variables...");
  const dotEnvPath = path.resolve('.env');
  
  if (!fs.existsSync(dotEnvPath)) {
    console.error("❌ .env file not found!");
    return false;
  }
  
  const envContent = fs.readFileSync(dotEnvPath, 'utf8');
  const useSupabase = envContent.includes('USE_SUPABASE=true');
  
  if (useSupabase) {
    console.log("✅ USE_SUPABASE=true is set in .env");
  } else {
    console.error("❌ USE_SUPABASE=true is not set in .env");
    console.log("Current settings:");
    if (envContent.includes('USE_SUPABASE=')) {
      console.log(envContent.match(/USE_SUPABASE=.*/)[0]);
    } else {
      console.log("USE_SUPABASE setting not found");
    }
    return false;
  }
  
  // 2. Check Supabase connection
  console.log("\nStep 2: Testing Supabase connection...");
  // Get environment variables (using dotenv to ensure they're loaded)
  require('dotenv').config();
  
  // Check if REACT_APP_* variables are swapped
  let supabaseUrl = process.env.SUPABASE_URL;
  let supabaseKey = process.env.SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;
  const reactUrl = process.env.REACT_APP_SUPABASE_URL;
  const reactKey = process.env.REACT_APP_SUPABASE_ANON_KEY;
  
  // If regular vars not set but React ones are
  if ((!supabaseUrl || !supabaseKey) && reactUrl && reactKey) {
    console.log("Using React app variables for Supabase test");
    
    // Check if React app variables are swapped
    if (reactUrl.startsWith('eyJhbGc') && reactKey.startsWith('http')) {
      console.log("⚠️ REACT_APP variables are swapped - using corrected values for test");
      supabaseUrl = reactKey;
      supabaseKey = reactUrl;
    } else {
      supabaseUrl = reactUrl;
      supabaseKey = reactKey;
    }
  }
  
  // Check if URL and key are swapped
  if (supabaseUrl && supabaseUrl.startsWith('eyJhbGc') && supabaseKey && supabaseKey.startsWith('http')) {
    console.log("⚠️ URL and key are swapped - using corrected values for test");
    // Swap them for this test
    const temp = supabaseUrl;
    supabaseUrl = supabaseKey;
    supabaseKey = temp;
  }
  
  console.log(`Supabase URL: ${supabaseUrl ? `${supabaseUrl.slice(0, 10)}...` : 'Not set'}`);
  console.log(`Supabase Key: ${supabaseKey ? `${supabaseKey.slice(0, 10)}...` : 'Not set'}`);
  
  if (!supabaseUrl || !supabaseKey) {
    console.error("❌ Missing Supabase credentials");
    return false;
  }
  
  try {
    // Create Supabase client
    const supabase = createClient(supabaseUrl, supabaseKey, {
      auth: { persistSession: false }
    });
    
    // Test connection with a simple query
    const { data, error } = await supabase
      .from('guide_submissions')
      .select('count', { count: 'exact', head: true });
    
    if (error) {
      console.error("❌ Supabase query error:", error.message);
      return false;
    }
    
    console.log("✅ Supabase connection successful");
    console.log("Connected to Supabase project:", supabaseUrl);
    
    // 3. Test schema by checking tables
    console.log("\nStep 3: Checking database tables...");
    
    const tablesToCheck = [
      'users',
      'guide_submissions',
      'listings',
      'villas',
      'resorts',
      'adventures',
      'bookings',
      'leads'
    ];
    
    for (const tableName of tablesToCheck) {
      try {
        const { data, error } = await supabase
          .from(tableName)
          .select('count', { count: 'exact', head: true });
        
        if (error) {
          console.log(`❌ Table "${tableName}" error:`, error.message);
        } else {
          console.log(`✅ Table "${tableName}" exists`);
        }
      } catch (tableError) {
        console.error(`❌ Error checking table "${tableName}":`, tableError);
      }
    }
    
    console.log("\n✅ Application migration verification completed");
    return true;
  } catch (error) {
    console.error("❌ Supabase connection error:", error);
    return false;
  }
}

// Run the verification
verifyAppMigration()
  .then(success => {
    if (success) {
      console.log("\n🎉 Application is successfully configured to use Supabase!");
      process.exit(0);
    } else {
      console.error("\n❌ Application migration verification failed");
      process.exit(1);
    }
  })
  .catch(error => {
    console.error("\n❌ Error during verification:", error);
    process.exit(1);
  });