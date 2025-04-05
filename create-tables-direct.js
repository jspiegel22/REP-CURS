/**
 * Direct, simple table creation script for Supabase
 */

require('dotenv').config();
const { createClient } = require('@supabase/supabase-js');

// Get Supabase credentials
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY || process.env.SUPABASE_ANON_KEY;

async function createTables() {
  try {
    console.log('Connecting to Supabase...');
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Verify connection
    const { data: sessionData, error: sessionError } = await supabase.auth.getSession();
    if (sessionError) {
      console.error('Failed to connect to Supabase:', sessionError.message);
      return false;
    }
    console.log('✅ Connected to Supabase');
    
    // Let's directly insert data which will create the table if it doesn't exist
    console.log('\nCreating guide_submissions table...');
    
    const { data: insertData, error: insertError } = await supabase
      .from('guide_submissions')
      .insert({
        first_name: 'Test',
        last_name: 'User',
        email: 'test@example.com',
        guide_type: 'villas',
        submission_id: 'test-' + Date.now(),
        interest_areas: ['beach', 'dining']
      })
      .select();
    
    if (insertError) {
      console.error('❌ Failed to create guide_submissions table:', insertError.message);
    } else {
      console.log('✅ Successfully created and inserted into guide_submissions table');
      console.log('Inserted data:', insertData);
      
      // Now verify we can read the data back
      const { data: readData, error: readError } = await supabase
        .from('guide_submissions')
        .select('*');
      
      if (readError) {
        console.error('❌ Failed to read from guide_submissions table:', readError.message);
      } else {
        console.log('✅ Successfully read from guide_submissions table');
        console.log('Table now has', readData.length, 'rows');
      }
    }
    
    return true;
  } catch (err) {
    console.error('Unexpected error:', err);
    return false;
  }
}

createTables().then(success => {
  if (success) {
    console.log('\n✅ Table creation completed');
  } else {
    console.log('\n❌ Table creation failed');
    process.exit(1);
  }
});