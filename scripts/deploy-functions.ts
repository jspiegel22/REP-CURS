import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import * as fs from 'fs';
import * as path from 'path';

dotenv.config();

const functions = [
  'airtable-sync',
  'send-email',
  'activecampaign-sync'
];

async function deployFunction(functionName: string) {
  console.log(`Deploying ${functionName}...`);
  
  // Read the function code
  const functionCode = fs.readFileSync(
    path.join(__dirname, `../supabase/functions/${functionName}/index.ts`),
    'utf8'
  );

  // Connect to Supabase
  const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );

  try {
    // Deploy the function
    const { error } = await supabase.functions.deploy(functionName, {
      body: functionCode,
      headers: {
        'Content-Type': 'application/json'
      }
    });
    
    if (error) {
      console.error(`Error deploying ${functionName}:`, error);
      throw error;
    }
    
    console.log(`Successfully deployed ${functionName}`);
  } catch (error) {
    console.error(`Failed to deploy ${functionName}:`, error);
    throw error;
  }
}

async function main() {
  try {
    for (const functionName of functions) {
      await deployFunction(functionName);
    }
    
    console.log('All functions deployed successfully!');
  } catch (error) {
    console.error('Function deployment failed:', error);
    process.exit(1);
  }
}

main(); 