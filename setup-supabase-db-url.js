require('dotenv').config();
const fs = require('fs');

async function setupSupabaseDbUrl() {
  console.log('Setting up DATABASE_URL for Supabase...');
  
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.SUPABASE_URL) {
    console.error('Missing Supabase credentials. Set SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY');
    return false;
  }
  
  try {
    // Extract project reference from Supabase URL
    const supabaseUrlMatch = process.env.SUPABASE_URL.match(/https:\/\/(.*?)\.supabase\.co/);
    if (!supabaseUrlMatch || !supabaseUrlMatch[1]) {
      console.error('Could not extract project reference from SUPABASE_URL');
      return false;
    }
    
    const projectRef = supabaseUrlMatch[1];
    console.log(`Extracted project reference: ${projectRef}`);
    
    // Construct the PostgreSQL connection string for Supabase
    const supabaseDbUrl = `postgresql://postgres:${process.env.SUPABASE_SERVICE_ROLE_KEY}@db.${projectRef}.supabase.co:5432/postgres`;
    
    console.log(`Generated Supabase DATABASE_URL: ${supabaseDbUrl.substring(0, 40)}...`);
    
    // Update .env file
    let envContent;
    try {
      envContent = fs.readFileSync('.env', 'utf8');
    } catch (err) {
      console.log('No .env file found, creating new one.');
      envContent = '';
    }
    
    // Check if SUPABASE_DB_URL already exists
    if (envContent.includes('SUPABASE_DB_URL=')) {
      // Update existing SUPABASE_DB_URL
      envContent = envContent.replace(
        /SUPABASE_DB_URL=.*/,
        `SUPABASE_DB_URL=${supabaseDbUrl}`
      );
    } else {
      // Add new SUPABASE_DB_URL
      envContent += `\nSUPABASE_DB_URL=${supabaseDbUrl}`;
    }
    
    // Write back to .env file
    fs.writeFileSync('.env', envContent);
    
    console.log('✅ SUPABASE_DB_URL added to .env file successfully!');
    console.log('To use this URL for database operations with Supabase, set DATABASE_URL=SUPABASE_DB_URL in your code or environment.');
    
    return true;
  } catch (error) {
    console.error('Error setting up Supabase DATABASE_URL:', error.message);
    return false;
  }
}

// Run if called directly
if (require.main === module) {
  setupSupabaseDbUrl()
    .then(success => {
      if (success) {
        console.log('✅ Supabase DATABASE_URL setup completed successfully!');
        process.exit(0);
      } else {
        console.error('❌ Failed to set up Supabase DATABASE_URL.');
        process.exit(1);
      }
    })
    .catch(error => {
      console.error('Unexpected error:', error);
      process.exit(1);
    });
}

module.exports = { setupSupabaseDbUrl };