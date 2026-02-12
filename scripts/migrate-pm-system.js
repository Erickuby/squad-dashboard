/**
 * Supabase Migration: PM System Tables
 *
 * This script creates the database schema for the PM system upgrade.
 * Run this after setting up Supabase credentials.
 *
 * Usage: node scripts/migrate-pm-system.js
 */

require('dotenv').config({ path: '.env.local' });
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Error: Supabase credentials not found in .env.local');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

async function migrate() {
  console.log('🚀 Starting PM System Migration...\n');

  // Create tasks table
  console.log('1️⃣ Creating tasks table...');
  const { error: tasksError } = await supabase.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS tasks (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        title TEXT NOT NULL,
        description TEXT,
        status TEXT NOT NULL DEFAULT 'todo',
        assigned_agent TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        started_at TIMESTAMP WITH TIME ZONE,
        completed_at TIMESTAMP WITH TIME ZONE,
        parent_task_id UUID REFERENCES tasks(id),
        priority TEXT DEFAULT 'normal',
        bounce_count INTEGER DEFAULT 0,
        requires_approval BOOLEAN DEFAULT FALSE,
        approved_by TEXT,
        approval_comment TEXT,
        project_id TEXT,
        chat_history JSONB DEFAULT '[]'::jsonb,
        checklist JSONB DEFAULT '[]'::jsonb,
        context_refs TEXT[] DEFAULT ARRAY[]::TEXT[],
        tags TEXT[] DEFAULT ARRAY[]::TEXT[],
        metadata JSONB DEFAULT '{}'::jsonb
      );

      CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
      CREATE INDEX IF NOT EXISTS idx_tasks_agent ON tasks(assigned_agent);
      CREATE INDEX IF NOT EXISTS idx_tasks_project ON tasks(project_id);
      CREATE INDEX IF NOT EXISTS idx_tasks_parent ON tasks(parent_task_id);
      CREATE INDEX IF NOT EXISTS idx_tasks_created ON tasks(created_at DESC);
    `
  });

  if (tasksError) {
    console.error('❌ Error creating tasks table:', tasksError.message);
  } else {
    console.log('✅ Tasks table created');
  }

  // Create projects table
  console.log('\n2️⃣ Creating projects table...');
  const { error: projectsError } = await supabase.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS projects (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        description TEXT,
        status TEXT DEFAULT 'active',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        manager_agent TEXT DEFAULT 'chris',
        context_refs TEXT[] DEFAULT ARRAY[]::TEXT[],
        metadata JSONB DEFAULT '{}'::jsonb
      );

      CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
    `
  });

  if (projectsError) {
    console.error('❌ Error creating projects table:', projectsError.message);
  } else {
    console.log('✅ Projects table created');
  }

  // Create contexts table
  console.log('\n3️⃣ Creating contexts table...');
  const { error: contextsError } = await supabase.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS contexts (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        content TEXT NOT NULL,
        project_id UUID REFERENCES projects(id),
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        metadata JSONB DEFAULT '{}'::jsonb
      );

      CREATE INDEX IF NOT EXISTS idx_contexts_project ON contexts(project_id);
      CREATE INDEX IF NOT EXISTS idx_contexts_type ON contexts(type);
    `
  });

  if (contextsError) {
    console.error('❌ Error creating contexts table:', contextsError.message);
  } else {
    console.log('✅ Contexts table created');
  }

  // Create sops table
  console.log('\n4️⃣ Creating sops table...');
  const { error: sopsError } = await supabase.rpc('exec_sql', {
    sql: `
      CREATE TABLE IF NOT EXISTS sops (
        id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
        name TEXT NOT NULL,
        agent TEXT NOT NULL,
        steps JSONB NOT NULL,
        version TEXT DEFAULT '1.0',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
        metadata JSONB DEFAULT '{}'::jsonb
      );

      CREATE INDEX IF NOT EXISTS idx_sops_agent ON sops(agent);
    `
  });

  if (sopsError) {
    console.error('❌ Error creating sops table:', sopsError.message);
  } else {
    console.log('✅ SOPs table created');
  }

  // Insert default projects
  console.log('\n5️⃣ Creating default projects...');
  const { data: existingProjects } = await supabase.from('projects').select('id').limit(1);

  if (!existingProjects || existingProjects.length === 0) {
    const { error: insertProjectsError } = await supabase.from('projects').insert([
      {
        name: 'YouTube Growth',
        description: 'Grow new YouTube channel with AI productivity content',
        status: 'active',
      },
      {
        name: 'LinkedIn Content',
        description: 'AI productivity content for project managers',
        status: 'active',
      },
    ]);

    if (insertProjectsError) {
      console.error('❌ Error inserting default projects:', insertProjectsError.message);
    } else {
      console.log('✅ Default projects created');
    }
  } else {
    console.log('ℹ️  Projects already exist, skipping');
  }

  // Insert default SOPs
  console.log('\n6️⃣ Creating default SOPs...');
  const { data: existingSOPs } = await supabase.from('sops').select('id').limit(1);

  if (!existingSOPs || existingSOPs.length === 0) {
    const { error: insertSOPsError } = await supabase.from('sops').insert([
      {
        name: 'Research Task Checklist',
        agent: 'researcher',
        steps: [
          { id: 1, text: 'Understand task requirements', completed: false },
          { id: 2, text: 'Search for relevant data and trends', completed: false },
          { id: 3, text: 'Verify sources', completed: false },
          { id: 4, text: 'Synthesize findings', completed: false },
          { id: 5, text: 'Provide actionable insights', completed: false },
        ],
      },
      {
        name: 'Builder Task Checklist',
        agent: 'builder',
        steps: [
          { id: 1, text: 'Review requirements', completed: false },
          { id: 2, text: 'Build solution', completed: false },
          { id: 3, text: 'Write documentation', completed: false },
          { id: 4, text: 'Test if possible', completed: false },
          { id: 5, text: 'Provide deployment instructions', completed: false },
        ],
      },
      {
        name: 'Copywriter Task Checklist',
        agent: 'copywriter',
        steps: [
          { id: 1, text: 'Review brand guidelines', completed: false },
          { id: 2, text: 'Draft copy', completed: false },
          { id: 3, text: 'Strong hook/opening', completed: false },
          { id: 4, text: 'Clear CTA', completed: false },
          { id: 5, text: 'Proofread', completed: false },
        ],
      },
      {
        name: 'Marketer Task Checklist',
        agent: 'marketer',
        steps: [
          { id: 1, text: 'Analyze data and metrics', completed: false },
          { id: 2, text: 'Develop strategy', completed: false },
          { id: 3, text: 'Set measurable KPIs', completed: false },
          { id: 4, text: 'Create timeline', completed: false },
          { id: 5, text: 'Provide actionable recommendations', completed: false },
        ],
      },
    ]);

    if (insertSOPsError) {
      console.error('❌ Error inserting default SOPs:', insertSOPsError.message);
    } else {
      console.log('✅ Default SOPs created');
    }
  } else {
    console.log('ℹ️  SOPs already exist, skipping');
  }

  console.log('\n✨ Migration complete!');
  console.log('\n📊 Tables created:');
  console.log('   - tasks');
  console.log('   - projects');
  console.log('   - contexts');
  console.log('   - sops');
  console.log('\n🎯 Next steps:');
  console.log('   1. Migrate existing squad-state tasks');
  console.log('   2. Update dashboard UI');
  console.log('   3. Implement bot integration');
}

migrate().catch(console.error);
