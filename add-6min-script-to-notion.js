/**
 * Add 6-minute script to YouTube Scripts Master Database
 */

require('dotenv').config({ path: '.env.local' });

const { Client } = require('@notionhq/client');
const fs = require('fs');

const notionToken = process.env.NOTION_TOKEN;
const scriptsPageId = '306244a2469580539de5df6b3d597211';

console.log('\n' + '='.repeat(60));
console.log('  Adding 6-Minute Script to Notion');
console.log('='.repeat(60) + '\n');

if (!notionToken) {
  console.error('❌ Missing NOTION_TOKEN');
  process.exit(1);
}

const notion = new Client({ auth: notionToken });

async function add6MinScriptToDatabase() {
  try {
    // Read 6-minute script
    const scriptContent = fs.readFileSync('youtube-script-6min-original.md', 'utf-8');

    // Create new page for the 6-minute script
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
                content: 'Prompt Engineering A-Z Guide (6-Min Original)',
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
                text: { content: '📹 6-minute video (~1,245 words) - Original Draft' },
              },
            ],
            icon: { emoji: '📹' },
            color: 'blue',
          },
        },
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [
              {
                type: 'text',
                text: { content: '**Framework:** 3 Core Techniques (Few-shot, Chain-of-Thought, Role-Based)' },
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
                text: { content: '**Status:** Original draft (before CRAFT expansion)' },
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
                text: { content: 'What Is Included' },
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
                text: { content: 'This is the original 6-minute draft created by Copywriter. Later expanded to 10 minutes with CRAFT framework.' },
              },
            ],
            icon: { emoji: '📝' },
            color: 'gray',
          },
        },
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [
              {
                type: 'text',
                text: { content: '**Script Structure (6 minutes):**' },
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
                text: { content: 'Hook (0:00-0:30) - 250% GROWTH' },
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
                text: { content: 'The Struggle (0:30-1:00)' },
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
                text: { content: 'Why This Matters (1:00-1:30) - 68% productivity, 23% salary' },
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
                text: { content: 'Transformation Story (1:30-2:00)' },
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
                text: { content: 'Technique #1: Few-Shot (2:00-3:00) - explanation + example' },
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
                text: { content: 'Technique #2: Chain-of-Thought (3:00-4:00) - explanation + example' },
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
                text: { content: 'Technique #3: Role-Based (4:00-6:00) - explanation + example' },
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
                text: { content: 'Conclusion & CTA (9:30-10:00)' },
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
                text: { content: 'Access Full Script' },
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
                text: { content: '📁 The full 1,245-word script is available in your workspace folder.' },
              },
            ],
            icon: { emoji: '📁' },
            color: 'orange',
          },
        },
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [
              {
                type: 'text',
                text: { content: '**Local file location:**' },
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
                text: { content: 'squad-dashboard/youtube-script-6min-original.md' },
              },
            ],
            language: 'markdown',
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
                text: { content: 'Difference from 10-Minute Version' },
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
                text: { content: '📋 Comparison: 6-min original vs 10-min expanded' },
              },
            ],
            icon: { emoji: '📋' },
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
                text: { content: '**6-Min Original (This Script):**' },
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
                text: { content: '1,245 words' },
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
                text: { content: '3 core techniques explained' },
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
                text: { content: 'Sections 6:00-9:30: Minimal placeholders' },
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
                text: { content: '**10-Minute Expanded (Updated Version):**' },
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
                text: { content: '~1,800 words' },
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
                text: { content: '3 core techniques + CRAFT Framework' },
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
                text: { content: 'Sections 6:00-9:30: Full content with 7 real examples' },
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
                text: { content: 'Which to Use?' },
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
                text: { content: '💡 Use the 10-minute expanded version (with CRAFT) for recording - it has full content!' },
              },
            ],
            icon: { emoji: '💡' },
            color: 'blue',
          },
        },
        {
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [
              {
                type: 'text',
                text: { content: 'The 6-minute version is kept for reference and comparison. The 10-minute expanded version has all the content you need for a complete video.' },
              },
            ],
          },
        },
      ],
    });

    console.log('\n' + '='.repeat(60));
    console.log('  ✅ 6-Minute Script Added to Database!');
    console.log('='.repeat(60) + '\n');
    console.log('Script Page URL:', scriptPage.url);
    console.log('');
    console.log('Master Database URL:');
    console.log('https://www.notion.so/YouTube-Scripts-Master-Database-306244a2469580539de5df6b3d597211');
    console.log('');
    console.log('What Was Added:');
    console.log('─'.repeat(60));
    console.log('  ✅ Prompt Engineering A-Z Guide (6-Min Original)');
    console.log('  ✅ Script details (duration, words, framework)');
    console.log('  ✅ Script structure breakdown (8 sections)');
    console.log('  ✅ Comparison with 10-minute version');
    console.log('  ✅ Recommendation to use 10-min version');
    console.log('  ✅ Links to local script files');
    console.log('');
    console.log('Scripts in Database Now:');
    console.log('─'.repeat(60));
    console.log('  1. Prompt Engineering A-Z Guide (10-min expanded)');
    console.log('  2. Prompt Engineering A-Z Guide (6-min original) ← NEW');
    console.log('');
    console.log('💡 Recommendation:');
    console.log('  • Use the 10-minute expanded version for recording');
    console.log('  • It has CRAFT framework and full content');
    console.log('  • 6-min version kept for reference only');
    console.log('');
    console.log('📹 Both scripts are now in your master database! 🚀\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('');
    console.error('Full error details:', error);
  }
}

add6MinScriptToDatabase();
