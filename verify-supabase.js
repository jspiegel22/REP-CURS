#!/usr/bin/env node

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Get connection info from environment
const SUPABASE_URL = process.env.SUPABASE_URL;
const SUPABASE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

console.log('==== Basic Supabase Connection Test ====');
console.log(`URL: ${SUPABASE_URL ? SUPABASE_URL : 'Not set'}`);
console.log(`KEY: ${SUPABASE_KEY ? 'Set (starts with: ' + SUPABASE_KEY.substring(0, 10) + '...)' : 'Not set'}`);

async function testSupabaseConnection() {
  if (!SUPABASE_URL || !SUPABASE_KEY) {
    console.error('❌ Supabase configuration missing!');
    return false;
  }

  try {
    // Initialize Supabase client
    const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);
    
    // Make a basic health check request (does not require any tables)
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      console.error('❌ Supabase auth error:', error.message);
      return false;
    }
    
    console.log('✅ Connected to Supabase successfully!');
    console.log('Session:', data.session ? 'Present' : 'None (but connection works)');
    
    // Try to get the storage buckets as another test
    const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
    
    if (bucketsError) {
      console.log('⚠️ Storage access error (but base connection works):', bucketsError.message);
    } else {
      console.log(`Found ${buckets.length} storage buckets`);
      if (buckets.length > 0) {
        buckets.forEach(bucket => console.log(`- ${bucket.name}`));
      }
    }
    
    return true;
  } catch (err) {
    console.error('❌ Supabase connection error:', err.message);
    return false;
  }
}

// Run test if executed directly
if (require.main === module) {
  testSupabaseConnection().then(success => {
    if (success) {
      console.log('\n✅ Supabase connection successful!');
    } else {
      console.log('\n❌ Supabase connection failed. Please check your configuration.');
      process.exit(1);
    }
  }).catch(err => {
    console.error('Error testing connection:', err);
    process.exit(1);
  });
}

module.exports = { testSupabaseConnection };