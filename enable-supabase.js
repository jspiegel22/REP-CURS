/**
 * Script to enable Supabase as the primary database
 * This script updates the .env file to set USE_SUPABASE=true
 */

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

// Check if Supabase is configured
function isSupabaseConfigured() {
  return (
    process.env.SUPABASE_URL &&
    process.env.SUPABASE_ANON_KEY &&
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );
}

// Verify Supabase connection
async function checkSupabaseConnection() {
  if (!isSupabaseConfigured()) {
    throw new Error('Supabase environment variables are not set');
  }

  const supabase = createClient(
    process.env.SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY
  );

  try {
    const { data, error } = await supabase.from('users').select('id').limit(1);
    
    if (error) {
      throw new Error(`Supabase connection test failed: ${error.message}`);
    }
    
    console.log('Supabase connection verified successfully');
    return true;
  } catch (error) {
    console.error('Supabase connection test failed:', error.message);
    return false;
  }
}

// Update environment variables to enable Supabase
async function updateEnvironmentFile() {
  const envFilePath = path.resolve(process.cwd(), '.env');
  
  if (!fs.existsSync(envFilePath)) {
    throw new Error('.env file not found');
  }
  
  let envContent = fs.readFileSync(envFilePath, 'utf8');
  
  // Check if USE_SUPABASE is already set
  if (envContent.includes('USE_SUPABASE=')) {
    // Update existing setting
    envContent = envContent.replace(/USE_SUPABASE=(true|false)/, 'USE_SUPABASE=true');
  } else {
    // Add new setting
    envContent += '\n# Enable Supabase as the primary database\nUSE_SUPABASE=true\n';
  }
  
  // Write updated content back to file
  fs.writeFileSync(envFilePath, envContent);
  console.log('.env file updated to enable Supabase');
}

// Main function
async function enableSupabase() {
  try {
    console.log('Verifying Supabase connection...');
    const connectionSuccessful = await checkSupabaseConnection();
    
    if (!connectionSuccessful) {
      console.error('Cannot enable Supabase: Connection test failed');
      process.exit(1);
    }
    
    console.log('Updating environment configuration...');
    await updateEnvironmentFile();
    
    console.log('✅ Supabase has been enabled as the primary database');
    console.log('You may need to restart your application for changes to take effect');
  } catch (error) {
    console.error('Error enabling Supabase:', error.message);
    process.exit(1);
  }
}

// Run the script
if (require.main === module) {
  enableSupabase();
}

module.exports = { enableSupabase, isSupabaseConfigured, checkSupabaseConnection };