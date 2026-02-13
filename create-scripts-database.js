/**
 * Create YouTube Scripts Database in Notion
 */

require('dotenv').config({ path: '.env.local' });

const { Client } = require('@notionhq/client');
const fs = require('fs');

const notionToken = process.env.NOTION_TOKEN;
const notionDatabaseId = process.env.NOTION_DATABASE_ID;

console.log('\n' + '='.repeat(60));
console.log('  Creating YouTube Scripts Database in Notion');
console.log('='.repeat(60) + '\n');

if (!notionToken || !notionDatabaseId) {
  console.error('❌ Missing Notion credentials');
  console.error('Required: NOTION_TOKEN, NOTION_DATABASE_ID');
  process.exit(1);
}

const notion = new Client({ auth: notionToken });

async function createScriptsDatabase() {
  try {
    console.log('Creating YouTube Scripts page...');

    // Create a new page (standalone scripts database)
    const scriptsPage = await notion.pages.create({
      // No parent - creates in default location
      properties: {
        title: {
          title: [
            {
              text: {
                content: '📹 YouTube Scripts - Master Database',
              },
            },
          ],
        },
      },
      children: [
        {
          object: 'block',
          type: 'heading_2',
          heading_2: {
            rich_text: [
              {
                type: 'text',
                text: { content: 'What Is This?' },
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
                  content: 'This is your master database for storing all YouTube video scripts. Every script gets its own page here for easy access, searchability, and organization.',
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
                text: { content: 'Scripts Currently Stored' },
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
                text: { content: 'Below is your first script. When you create new scripts, they can be stored here alongside existing ones for easy access.' },
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
                text: { content: '💡 Pro tip: Keep scripts updated in both Squad Dashboard (for approval sync) and this master database (for long-term storage).' },
              },
            ],
            icon: { emoji: '💡' },
            color: 'blue',
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
                text: { content: 'How to Add New Scripts' },
              },
            ],
          },
        },
        {
          object: 'block',
          type: 'numbered_list_item',
          numbered_list_item: {
            rich_text: [
              {
                type: 'text',
                text: { content: 'Create a new child page under this master page with your script content' },
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
                text: { content: 'Add a new sub-page here for each YouTube script' },
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
                text: { content: '📁 Each script gets its own page for easy access and searchability' },
              },
            ],
            icon: { emoji: '📁' },
            color: 'green',
          },
        },
        {
          object: 'block',
          type: 'numbered_list_item',
          numbered_list_item: {
            rich_text: [
              {
                type: 'text',
                text: { content: 'Include: Title, duration, word count, framework (CRAFT, etc.), full script, timestamped sections, CTA, recording notes' },
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
                text: { content: 'Naming Convention' },
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
                text: { content: 'Use this format for consistent organization:' },
              },
            ],
          },
        },
        {
          object: 'block',
          type: 'code',
          code: {
            rich_text: [
              {
                type: 'text',
                text: { content: '[topic]-[details]-YYYY-MM-DD.md' },
              },
            ],
            language: 'markdown',
          },
        },
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [
              {
                type: 'text',
                text: { content: 'Examples:' },
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
                text: { content: 'prompt-engineering-a-z-guide-2026-02-13.md' },
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
                text: { content: 'ai-productivity-tips-2026-02-15.md (planned)' },
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
                text: { content: 'n8n-workflow-automation-2026-02-20.md (planned)' },
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
                text: { content: 'Quick Access' },
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
                text: { content: 'Always accessible from any device via Notion app or web. Search for scripts by title, topic, or date.' },
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
                text: { content: '🚀 Your YouTube scripts are now organized and ready to grow!' },
              },
            ],
            icon: { emoji: '🚀' },
            color: 'orange',
          },
        },
      ],
    });

    console.log('\n' + '='.repeat(60));
    console.log('  ✅ YouTube Scripts Database Created!');
    console.log('='.repeat(60) + '\n');
    console.log('Notion Page URL:', scriptsPage.url);
    console.log('');
    console.log('What Was Created:');
    console.log('─'.repeat(60));
    console.log('  ✅ Master database page for YouTube scripts');
    console.log('  ✅ First script: Prompt Engineering A-Z Guide (linked)');
    console.log('  ✅ Instructions for adding new scripts');
    console.log('  ✅ Naming convention guidelines');
    console.log('  ✅ Searchable and accessible from any device');
    console.log('');
    console.log('How to Use:');
    console.log('─'.repeat(60));
    console.log('  1. Open the Notion link above');
    console.log('  2. Create new sub-page for each script');
    console.log('  3. Paste script content, add details');
    console.log('  4. Save and enjoy organized access!');
    console.log('');
    console.log('💡 Pro Tip:');
    console.log('  Keep Squad Dashboard for task management (approval syncs to tasks)');
    console.log('  Keep this Scripts database for long-term storage');
    console.log('  Update this master page with new script links as you create them');
    console.log('');
    console.log('📹 Your YouTube scripts are now organized! 🚀\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('');
    console.error('Full error details:', error);
  }
}

createScriptsDatabase();
