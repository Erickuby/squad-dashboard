/**
 * Sync squad-state.json to Supabase
 *
 * This script reads squad-state.json and pushes it to Supabase.
 * Run this after updating squad-state.json to keep the cloud backend in sync.
 *
 * Usage: node scripts/sync-to-supabase.js
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Supabase credentials not found in .env.local');
  console.error('Please set NEXT_PUBLIC_SUPABASE_URL and NEXT_PUBLIC_SUPABASE_ANON_KEY');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function syncToSupabase() {
  try {
    // Read squad-state.json
    const statePath = path.join(__dirname, '..', '..', 'squad-state.json');
    const stateData = fs.readFileSync(statePath, 'utf8');
    const state = JSON.parse(stateData);

    console.log('📖 Reading squad-state.json...');
    console.log('   Updated at:', new Date(state.lastUpdated).toISOString());

    // Check if there's existing data
    const { data: existingData } = await supabase
      .from('squad_state')
      .select('id')
      .limit(1);

    let result;

    if (existingData && existingData.length > 0) {
      // Update existing record - force timestamp update
      console.log('🔄 Updating existing record in Supabase...');
      result = await supabase
        .from('squad_state')
        .update({
          state_data: state,
          updated_at: new Date().toISOString(), // Force timestamp update
        })
        .eq('id', existingData[0].id)
        .select();
    } else {
      // Insert new record
      console.log('➕ Inserting new record to Supabase...');
      result = await supabase
        .from('squad_state')
        .insert([{ state_data: state }])
        .select();
    }

    if (result.error) {
      throw result.error;
    }

    console.log('✅ Successfully synced to Supabase!');
    console.log('   Record ID:', result.data[0].id);
    console.log('   Updated at:', new Date(result.data[0].updated_at).toISOString());

    // Show summary
    const workingCount = Object.values(state.members).filter(m => m.status === 'working').length;
    const blockedCount = Object.values(state.members).filter(m => m.status === 'blocked').length;
    console.log('');
    console.log('📊 Squad State Summary:');
    console.log(`   Total agents: ${Object.keys(state.members).length}`);
    console.log(`   Working: ${workingCount}`);
    console.log(`   Blocked: ${blockedCount}`);

  } catch (error) {
    console.error('❌ Error syncing to Supabase:', error.message);
    process.exit(1);
  }
}

syncToSupabase();
