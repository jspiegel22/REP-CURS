import { createClient } from '@supabase/supabase-js';
import { Pool } from '@neondatabase/serverless';
import type { NextApiRequest, NextApiResponse } from 'next';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'GET') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const results = {
    environment: {
      supabaseUrl: process.env.SUPABASE_URL ? '✅ Set' : '❌ Not set',
      supabaseKey: process.env.SUPABASE_SERVICE_ROLE_KEY ? '✅ Set' : '❌ Not set',
      neonUrl: process.env.NEON_DATABASE_URL ? '✅ Set' : '❌ Not set',
      airtableKey: process.env.AIRTABLE_API_KEY ? '✅ Set' : '❌ Not set',
      airtableBase: process.env.AIRTABLE_BASE_ID ? '✅ Set' : '❌ Not set',
    },
    connections: {
      supabase: null,
      neon: null,
      airtable: null,
    },
  };

  try {
    // Test Supabase
    const supabase = createClient(
      process.env.SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );
    
    // First test the connection by getting the database version
    const { data: versionData, error: versionError } = await supabase
      .rpc('version');
    
    if (versionError) {
      results.connections.supabase = {
        status: 'error',
        message: `Connection error: ${versionError.message}`,
      };
    } else {
      results.connections.supabase = {
        status: 'success',
        data: {
          version: versionData,
          message: 'Connected successfully (tables not yet migrated)',
        },
      };
    }
  } catch (error) {
    results.connections.supabase = {
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }

  try {
    // Test Neon
    const pool = new Pool({
      connectionString: process.env.NEON_DATABASE_URL,
    });
    
    // Get database version and table count
    const [versionResult, tablesResult] = await Promise.all([
      pool.query('SELECT version();'),
      pool.query(`
        SELECT COUNT(*) as count 
        FROM information_schema.tables 
        WHERE table_schema = 'public'
      `)
    ]);
    
    await pool.end();
    
    results.connections.neon = {
      status: 'success',
      data: {
        version: versionResult.rows[0].version,
        tableCount: tablesResult.rows[0].count,
      },
    };
  } catch (error) {
    results.connections.neon = {
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }

  try {
    // Test Airtable
    const airtableResponse = await fetch(
      `https://api.airtable.com/v0/meta/bases/${process.env.AIRTABLE_BASE_ID}/tables`,
      {
        headers: {
          Authorization: `Bearer ${process.env.AIRTABLE_API_KEY}`,
        },
      }
    );
    
    if (!airtableResponse.ok) {
      throw new Error(`HTTP error! status: ${airtableResponse.status}`);
    }
    
    const airtableData = await airtableResponse.json();
    results.connections.airtable = {
      status: 'success',
      data: {
        tables: airtableData.tables.map((t: any) => ({
          name: t.name,
          recordCount: t.recordCount,
        })),
      },
    };
  } catch (error) {
    results.connections.airtable = {
      status: 'error',
      message: error instanceof Error ? error.message : 'Unknown error',
    };
  }

  return res.status(200).json(results);
} 