require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Supabase credentials not found in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function checkSupabase() {
  try {
    const { data, error } = await supabase
      .from('squad_state')
      .select('*')
      .single();

    if (error) {
      console.error('❌ Error fetching from Supabase:', error);
      return;
    }

    console.log('\n📦 Current Supabase state:');
    console.log('ID:', data.id);
    console.log('Updated at:', data.updated_at);
    console.log('\nState data:');
    console.log(JSON.stringify(data.state_data, null, 2));

    const workingCount = Object.values(data.state_data.members || {}).filter(m => m.status === 'working').length;
    console.log(`\n📊 Working agents: ${workingCount}`);
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkSupabase();
