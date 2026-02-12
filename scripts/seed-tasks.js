/**
 * Seed test tasks into Supabase
 *
 * This script creates sample tasks for testing the Task Board.
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

async function seedTasks() {
  console.log('🌱 Seeding test tasks...\n');

  // Get projects
  const { data: projects } = await supabase
    .from('projects')
    .select('id, name');

  if (!projects || projects.length === 0) {
    console.error('❌ No projects found. Run migration first.');
    process.exit(1);
  }

  const youtubeProject = projects.find(p => p.name === 'YouTube Growth');
  const linkedinProject = projects.find(p => p.name === 'LinkedIn Content');

  // Sample tasks
  const tasks = [
    {
      title: 'Research viral YouTube shorts',
      description: 'Find top 10 viral AI productivity videos on YouTube Shorts. Identify common themes, hooks, and formats.',
      status: 'in_progress',
      assigned_agent: 'researcher',
      priority: 'high',
      project_id: youtubeProject.id,
      chat_history: [
        {
          author: 'chris',
          role: 'manager',
          message: 'Task created: Research viral YouTube shorts',
          timestamp: new Date().toISOString(),
        },
      ],
      checklist: [
        { id: 1, text: 'Understand task requirements', completed: true },
        { id: 2, text: 'Search for relevant data and trends', completed: false },
        { id: 3, text: 'Verify sources', completed: false },
        { id: 4, text: 'Synthesize findings', completed: false },
        { id: 5, text: 'Provide actionable insights', completed: false },
      ],
      requires_approval: true,
    },
    {
      title: 'Build YouTube analytics dashboard',
      description: 'Create an automated n8n workflow that tracks YouTube video performance and sends daily reports.',
      status: 'todo',
      assigned_agent: 'builder',
      priority: 'normal',
      project_id: youtubeProject.id,
      chat_history: [
        {
          author: 'chris',
          role: 'manager',
          message: 'Task created: Build YouTube analytics dashboard',
          timestamp: new Date().toISOString(),
        },
      ],
      checklist: [
        { id: 1, text: 'Review requirements', completed: false },
        { id: 2, text: 'Build solution', completed: false },
        { id: 3, text: 'Write documentation', completed: false },
        { id: 4, text: 'Test if possible', completed: false },
        { id: 5, text: 'Provide deployment instructions', completed: false },
      ],
      requires_approval: true,
    },
    {
      title: 'Write 5 hooks for LinkedIn post',
      description: 'Create 5 compelling hooks for a LinkedIn post about "5 AI tools every project manager needs".',
      status: 'waiting_approval',
      assigned_agent: 'copywriter',
      priority: 'high',
      project_id: linkedinProject.id,
      chat_history: [
        {
          author: 'chris',
          role: 'manager',
          message: 'Task created: Write 5 hooks for LinkedIn post',
          timestamp: new Date().toISOString(),
        },
        {
          author: 'copywriter',
          role: 'agent',
          message: 'Here are 5 hooks:\n\n1. "I was drowning in spreadsheets until I found this..."',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
        },
        {
          author: 'copywriter',
          role: 'agent',
          message: 'Completed hooks draft. All hooks follow the "gap hook" format and emphasize time savings. Ready for review.',
          timestamp: new Date(Date.now() - 1800000).toISOString(),
        },
      ],
      checklist: [
        { id: 1, text: 'Review brand guidelines', completed: true },
        { id: 2, text: 'Draft copy', completed: true },
        { id: 3, text: 'Strong hook/opening', completed: true },
        { id: 4, text: 'Clear CTA', completed: false },
        { id: 5, text: 'Proofread', completed: true },
      ],
      requires_approval: true,
    },
    {
      title: 'Develop YouTube growth strategy',
      description: 'Create a 3-month growth strategy for YouTube channel including KPIs, content calendar, and collaboration opportunities.',
      status: 'completed',
      assigned_agent: 'marketer',
      priority: 'urgent',
      project_id: youtubeProject.id,
      chat_history: [
        {
          author: 'chris',
          role: 'manager',
          message: 'Task created: Develop YouTube growth strategy',
          timestamp: new Date(Date.now() - 7200000).toISOString(),
        },
        {
          author: 'marketer',
          role: 'agent',
          message: 'Strategy drafted. KPIs: 10K subs in 3 months, 100K total views. Content calendar: 3 videos/week.',
          timestamp: new Date(Date.now() - 5400000).toISOString(),
        },
        {
          author: 'eric',
          role: 'human',
          message: 'Approved! This looks solid.',
          timestamp: new Date(Date.now() - 3600000).toISOString(),
        },
      ],
      checklist: [
        { id: 1, text: 'Analyze data and metrics', completed: true },
        { id: 2, text: 'Develop strategy', completed: true },
        { id: 3, text: 'Set measurable KPIs', completed: true },
        { id: 4, text: 'Create timeline', completed: true },
        { id: 5, text: 'Provide actionable recommendations', completed: true },
      ],
      requires_approval: true,
      approved_by: 'eric',
      completed_at: new Date(Date.now() - 3600000).toISOString(),
    },
    {
      title: 'Analyze competitor videos',
      description: 'Review top 5 AI productivity YouTubers. Identify their video formats, posting schedules, and engagement strategies.',
      status: 'todo',
      assigned_agent: 'researcher',
      priority: 'low',
      project_id: youtubeProject.id,
      chat_history: [
        {
          author: 'chris',
          role: 'manager',
          message: 'Task created: Analyze competitor videos',
          timestamp: new Date().toISOString(),
        },
      ],
      checklist: [
        { id: 1, text: 'Understand task requirements', completed: false },
        { id: 2, text: 'Search for relevant data and trends', completed: false },
        { id: 3, text: 'Verify sources', completed: false },
        { id: 4, text: 'Synthesize findings', completed: false },
        { id: 5, text: 'Provide actionable insights', completed: false },
      ],
      requires_approval: true,
    },
  ];

  // Insert tasks
  for (const task of tasks) {
    const { error } = await supabase.from('tasks').insert([task]);
    if (error) {
      console.error(`❌ Error inserting task "${task.title}":`, error.message);
    } else {
      console.log(`✅ Task created: ${task.title}`);
    }
  }

  console.log('\n✨ Seeding complete!');
  console.log('\n📊 Tasks created:', tasks.length);
  console.log('\n🎯 Open dashboard and switch to "Task Board" view to see them.');
}

seedTasks().catch(console.error);
