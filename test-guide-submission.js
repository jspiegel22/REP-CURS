require('dotenv').config();
const { Pool } = require('pg');
const { randomUUID } = require('crypto');

// Use the DATABASE_URL from the environment for direct connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL
});

async function testGuideSubmission() {
  try {
    console.log('Connecting to database...');
    const client = await pool.connect();
    
    try {
      // First check if the guide_submissions table exists
      const tableCheck = await client.query(`
        SELECT EXISTS (
          SELECT FROM information_schema.tables 
          WHERE table_schema = 'public' 
          AND table_name = 'guide_submissions'
        )`);
      
      const tableExists = tableCheck.rows[0].exists;
      console.log(`Guide submissions table exists: ${tableExists}`);
      
      if (!tableExists) {
        console.error('Guide submissions table does not exist!');
        return;
      }
      
      // Create a test guide submission
      const submissionId = randomUUID();
      console.log('Creating test guide submission...');
      
      const insertResult = await client.query(`
        INSERT INTO guide_submissions (
          first_name, 
          email, 
          source, 
          status, 
          guide_type, 
          submission_id,
          created_at,
          updated_at,
          form_name
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING id
      `, [
        'Test User', 
        'test@example.com', 
        'test-script', 
        'completed', 
        'Ultimate Cabo Guide 2025', 
        submissionId,
        new Date(),
        new Date(),
        'guide_download'
      ]);
      
      const submissionId2 = insertResult.rows[0].id;
      console.log(`Guide submission created with ID: ${submissionId2}`);
      
      // Retrieve the submission to verify it was created
      console.log('Retrieving guide submission...');
      const selectResult = await client.query(`
        SELECT * FROM guide_submissions WHERE id = $1
      `, [submissionId2]);
      
      if (selectResult.rows.length) {
        console.log('Guide submission retrieved successfully:');
        console.log(selectResult.rows[0]);
      } else {
        console.error('Guide submission not found!');
      }
      
      console.log('\nTest completed successfully!');
    } catch (error) {
      console.error('Error during test:', error);
    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Database connection error:', error);
  } finally {
    pool.end();
  }
}

testGuideSubmission();