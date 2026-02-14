/**
 * Add script to YouTube Scripts Master Database
 */

require('dotenv').config({ path: '.env.local' });

const { Client } = require('@notionhq/client');
const fs = require('fs');

const notionToken = process.env.NOTION_TOKEN;
const scriptsPageId = '306244a2469580539de5df6b3d597211';

console.log('\n' + '='.repeat(60));
console.log('  Adding Script to YouTube Scripts Master Database');
console.log('='.repeat(60) + '\n');

if (!notionToken) {
  console.error('❌ Missing NOTION_TOKEN');
  process.exit(1);
}

const notion = new Client({ auth: notionToken });

async function addScriptToDatabase() {
  try {
    // Read expanded script
    const scriptContent = fs.readFileSync('youtube-script-expanded.md', 'utf-8');

    // Create new page for the script
    const scriptPage = await notion.pages.create({
      parent: {
        type: 'page_id',
        page_id: scriptsPageId,
      },
      properties: {
        title: {
          title: [
            {
              text: {
                content: 'Prompt Engineering A-Z Guide',
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
                text: { content: 'Script Details' },
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
                text: { content: '📹 10-minute video (~1,800 words)' },
              },
            ],
            icon: { emoji: '📹' },
            color: 'green',
          },
        },
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [
              {
                type: 'text',
                text: { content: '**Framework:** CRAFT (Context, Role, Action, Format, Tone)' },
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
                text: { content: '**Techniques:** Few-shot, Chain-of-Thought, Role-Based Prompting' },
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
                text: { content: '**Status:** ✅ Ready to record' },
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
                text: { content: 'Full Script' },
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
                text: { content: '💡 Copy this script to your recording app or use it directly in Notion.' },
              },
            ],
            icon: { emoji: '💡' },
            color: 'blue',
          },
        },
      ],
    });

    // Add script content in chunks
    const chunks = scriptContent.match(/[\s\S]{1,1500}/g) || [];
    let blockCount = 5; // Already added 5 blocks

    for (const chunk of chunks) {
      const paragraphs = chunk.split('\n\n');
      for (const paragraph of paragraphs) {
        if (paragraph.trim() && !paragraph.startsWith('#')) {
          if (paragraph.startsWith('---')) {
            await notion.blocks.children.append({
              block_id: scriptPage.id,
              children: [
                {
                  object: 'block',
                  type: 'divider',
                  divider: {},
                },
              ],
            });
            blockCount++;
          } else if (paragraph.startsWith('**') || paragraph.startsWith('###')) {
            await notion.blocks.children.append({
              block_id: scriptPage.id,
              children: [
                {
                  object: 'block',
                  type: 'heading_3',
                  heading_3: {
                    rich_text: [
                      {
                        type: 'text',
                        text: { content: paragraph.replace(/^#+\s*/, '').replace(/\*\*/g, '') },
                      },
                    ],
                  },
                },
              ],
            });
            blockCount++;
          } else {
            await notion.blocks.children.append({
              block_id: scriptPage.id,
              children: [
                {
                  object: 'block',
                  type: 'paragraph',
                  paragraph: {
                    rich_text: [
                      {
                        type: 'text',
                        text: { content: paragraph },
                      },
                    ],
                  },
                },
              ],
            });
            blockCount++;
          }
        }
      }
    }

    console.log('\n' + '='.repeat(60));
    console.log('  ✅ Script Added to Database!');
    console.log('='.repeat(60) + '\n');
    console.log('Script Page URL:', scriptPage.url);
    console.log('');
    console.log('Master Database URL:');
    console.log('https://www.notion.so/YouTube-Scripts-Master-Database-306244a2469580539de5df6b3d597211');
    console.log('');
    console.log('What Was Added:');
    console.log('─'.repeat(60));
    console.log('  ✅ Prompt Engineering A-Z Guide (child page)');
    console.log('  ✅ Script details (duration, words, framework)');
    console.log('  ✅ Full script content in Notion format');
    console.log('  ✅ Organized and searchable');
    console.log('');
    console.log('How to Use:');
    console.log('─'.repeat(60));
    console.log('  1. Open Master Database (link above)');
    console.log('  2. Click on "Prompt Engineering A-Z Guide"');
    console.log('  3. Copy script to record');
    console.log('  4. Add your notes and highlights');
    console.log('');
    console.log('💡 Pro Tip:');
    console.log('  • Search scripts by title, topic, or date');
    console.log('  • Add your recording notes in Notion');
    console.log('  • Copy-paste to recording app as needed');
    console.log('  • All scripts organized in one place!');
    console.log('');
    console.log('📹 Script is now in your master database! 🚀\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('');
    console.error('Full error details:', error);
  }
}

addScriptToDatabase();
