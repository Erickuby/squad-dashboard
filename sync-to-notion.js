/**
 * Sync YouTube Script Task to Notion
 */

require('dotenv').config({ path: '.env.local' });

const { Client } = require('@notionhq/client');
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
const notionToken = process.env.NOTION_TOKEN;
const notionDatabaseId = process.env.NOTION_DATABASE_ID;

const TASK_ID = '434b5685-5948-41a6-b827-9a508a43c7bf';

console.log('\n' + '='.repeat(60));
console.log('  Syncing Task to Notion');
console.log('='.repeat(60) + '\n');

if (!supabaseUrl || !supabaseKey || !notionToken || !notionDatabaseId) {
  console.error('❌ Missing credentials');
  console.error('Required: SUPABASE_URL, SUPABASE_KEY, NOTION_TOKEN, NOTION_DATABASE_ID');
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);
const notion = new Client({ auth: notionToken });

async function syncToNotion() {
  try {
    // Fetch task from Supabase
    const { data: task, error: fetchError } = await supabase
      .from('tasks')
      .select('*')
      .eq('id', TASK_ID)
      .single();

    if (fetchError) throw fetchError;

    if (!task) {
      console.error('❌ Task not found');
      process.exit(1);
    }

    console.log('Task Found:');
    console.log('  Title:', task.title);
    console.log('  Status:', task.status);
    console.log('  Agent:', task.assigned_agent);
    console.log('  Comments:', task.chat_history?.length || 0);
    console.log('');

    // Extract script from Copywriter comments
    const copywriterComments = task.chat_history.filter(msg =>
      msg.author === 'Copywriter' || msg.role === 'agent'
    );

    const scriptContent = copywriterComments.map(c => c.message).join('\n\n');

    // Build Notion page content
    const blocks = [
      {
        object: 'block',
        type: 'heading_1',
        heading_1: {
          rich_text: [
            {
              type: 'text',
              text: { content: task.title },
            },
          ],
        },
      },
      {
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: (task.description || 'No description provided.').substring(0, 1900),
              },
            },
          ],
        },
      },
      {
        object: 'block',
        type: 'divider',
        divider: {},
      },
      {
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [
            {
              type: 'text',
              text: { content: '📋 Task Details' },
            },
          ],
        },
      },
      {
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [
            {
              type: 'text',
              text: { content: `Status: ${task.status}` },
            },
          ],
        },
      },
      {
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [
            {
              type: 'text',
              text: { content: `Agent: ${task.assigned_agent || 'Unassigned'}` },
            },
          ],
        },
      },
      {
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [
            {
              type: 'text',
              text: { content: `Priority: ${task.priority}` },
            },
          ],
        },
      },
      {
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [
            {
              type: 'text',
              text: { content: `Created: ${new Date(task.created_at).toLocaleString('en-GB')}` },
            },
          ],
        },
      },
      {
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [
            {
              type: 'text',
              text: { content: `Completed: ${task.completed_at ? new Date(task.completed_at).toLocaleString('en-GB') : 'N/A'}` },
            },
          ],
        },
      },
      {
        object: 'block',
        type: 'divider',
        divider: {},
      },
      {
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [
            {
              type: 'text',
              text: { content: '💬 YouTube Script (Full)' },
            },
          ],
        },
      },
      {
        object: 'block',
        type: 'callout',
        callout: {
          rich_text: [
            {
              type: 'text',
              text: { content: `📄 Full script is ${scriptContent.length} characters (${Math.floor(scriptContent.length / 5)} words). See comments below for complete content.` },
            },
          ],
          icon: { emoji: '📄' },
        },
      },
      {
        object: 'block',
        type: 'divider',
        divider: {},
      },
      {
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [
            {
              type: 'text',
              text: { content: '📊 Work Log' },
            },
          ],
        },
      },
    ];

    // Add all comments
    task.chat_history.forEach(msg => {
      blocks.push({
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              type: 'text',
              text: { content: `**${msg.author}** (${msg.role}): ` },
            },
            {
              type: 'text',
              text: { content: new Date(msg.timestamp).toLocaleString('en-GB') },
              annotations: { bold: true, color: 'gray' },
            },
          ],
        },
      });

      blocks.push({
        object: 'block',
        type: 'quote',
        quote: {
          rich_text: [
            {
              type: 'text',
              text: { content: msg.message.substring(0, 1500) + (msg.message.length > 1500 ? '...' : '') },
            },
          ],
        },
      });
    });

    console.log('Creating Notion page...');

    // Create Notion page (simplified - just title and content)
    const notionPage = await notion.pages.create({
      parent: { database_id: notionDatabaseId },
      properties: {
        title: {
          title: [
            {
              text: {
                content: task.title,
              },
            },
          ],
        },
      },
      children: blocks.slice(0, 100), // Limit to 100 blocks
    });

    console.log('');
    console.log('✅ Task Synced to Notion!');
    console.log('='.repeat(60) + '\n');
    console.log('Notion Page ID:', notionPage.id);
    console.log('Notion Page URL:', notionPage.url);
    console.log('');

    // Update task with Notion page ID
    const { error: updateError } = await supabase
      .from('tasks')
      .update({
        notion_page_id: notionPage.id,
        notion_page_url: notionPage.url,
        updated_at: new Date().toISOString(),
      })
      .eq('id', TASK_ID);

    if (updateError) throw updateError;

    console.log('✅ Task updated with Notion link!');
    console.log('');
    console.log('What You Can Do Now:');
    console.log('─'.repeat(60));
    console.log('  1. Open Notion:', notionPage.url);
    console.log('  2. View full YouTube script in Notion');
    console.log('  3. Copy script to record your video');
    console.log('  4. Start filming! 🎬');
    console.log('');
    console.log('🎉 Script in Notion! Go record your video! 🎬\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('');
    console.error('Full error details:', error);
  }
}

syncToNotion();
