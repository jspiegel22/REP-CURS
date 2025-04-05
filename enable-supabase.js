// Enable Supabase by setting the USE_SUPABASE environment variable
require('dotenv').config();
const fs = require('fs');
const path = require('path');
const { checkTables } = require('./scripts/direct-migrate-to-supabase');

async function enableSupabase() {
  console.log('Checking if Supabase tables exist...');
  
  const tablesExist = await checkTables();
  
  if (!tablesExist) {
    console.log('\nSome Supabase tables are missing or inaccessible.');
    console.log('Please make sure you have migrated your data to Supabase before enabling it.');
    console.log('Proceeding to enable Supabase anyway, as requested.');
  }
  
  console.log('Enabling Supabase storage...');
  
  try {
    const envPath = path.join(__dirname, '.env');
    
    if (!fs.existsSync(envPath)) {
      console.error('.env file not found!');
      return false;
    }
    
    let envContent = fs.readFileSync(envPath, 'utf8');
    
    // Check if USE_SUPABASE already exists
    if (envContent.includes('USE_SUPABASE=')) {
      // Replace the existing value
      envContent = envContent.replace(/USE_SUPABASE=.*/g, 'USE_SUPABASE=true');
    } else {
      // Add the new environment variable
      envContent += '\nUSE_SUPABASE=true\n';
    }
    
    // Write the updated content back to the .env file
    fs.writeFileSync(envPath, envContent);
    
    console.log('Successfully enabled Supabase storage!');
    console.log('The application will now use Supabase for database operations.');
    console.log('You may need to restart your application for the changes to take effect.');
    
    return true;
  } catch (error) {
    console.error('Error enabling Supabase:', error);
    return false;
  }
}

// Run the function if this file is executed directly
if (require.main === module) {
  enableSupabase()
    .then(result => {
      if (result) {
        console.log('Done!');
        process.exit(0);
      } else {
        console.log('Failed to enable Supabase.');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('Unexpected error:', error);
      process.exit(1);
    });
}