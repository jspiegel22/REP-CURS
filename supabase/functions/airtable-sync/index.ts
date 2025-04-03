import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const AIRTABLE_API_KEY = Deno.env.get('AIRTABLE_API_KEY')!;
const AIRTABLE_BASE_ID = Deno.env.get('AIRTABLE_BASE_ID')!;
const SUPABASE_URL = Deno.env.get('SUPABASE_URL')!;
const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

async function syncToAirtable(table: string, record: any) {
  const airtableUrl = `https://api.airtable.com/v0/${AIRTABLE_BASE_ID}/${table}`;
  
  try {
    const response = await fetch(airtableUrl, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${AIRTABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        records: [{
          fields: record
        }]
      })
    });

    if (!response.ok) {
      throw new Error(`Airtable sync failed: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    console.error(`Error syncing to Airtable: ${error}`);
    throw error;
  }
}

serve(async (req) => {
  try {
    const { table, record } = await req.json();

    if (!table || !record) {
      return new Response(
        JSON.stringify({ error: 'Missing table or record' }),
        { status: 400 }
      );
    }

    const result = await syncToAirtable(table, record);

    return new Response(
      JSON.stringify({ success: true, result }),
      { headers: { 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500 }
    );
  }
}); 