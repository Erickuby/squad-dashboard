/**
 * Add script to YouTube Scripts Master Database (Simplified version)
 */

require('dotenv').config({ path: '.env.local' });

const { Client } = require('@notionhq/client');

const notionToken = process.env.NOTION_TOKEN;
const scriptsPageId = '306244a2469580539de5df6b3d597211';

console.log('\n' + '='.repeat(60));
console.log('  Adding Script to YouTube Scripts Database');
console.log('='.repeat(60) + '\n');

if (!notionToken) {
  console.error('❌ Missing NOTION_TOKEN');
  process.exit(1);
}

const notion = new Client({ auth: notionToken });

async function addScriptToDatabase() {
  try {
    // Create new page for the script (simplified version)
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
                text: { content: 'Full script includes CRAFT framework explanation, 7 real examples in action, putting it all together, and action plan.' },
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
                text: { content: '**Script Structure (10 minutes):**' },
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
                text: { content: 'Hook (0:00-0:30) - 250% GROWTH statistic' },
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
                text: { content: 'The Struggle (0:30-1:00) - BTNE context' },
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
                text: { content: 'Technique #3: Role-Based (4:00-5:00) - explanation + example' },
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
                text: { content: 'CRAFT Framework (5:00-6:00) - full 5-component explanation' },
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
                text: { content: 'Real Examples in Action (6:00-8:00) - 7 scenarios' },
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
                text: { content: 'Putting It All Together (8:00-9:00)' },
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
                text: { content: 'Action Plan (9:00-9:30) - 4-step guide' },
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
                text: { content: 'Access the Full Script' },
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
                text: { content: '📁 The full 1,800-word script is available in your workspace folder. Copy it directly to record!' },
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
                text: { content: 'squad-dashboard/youtube-script-expanded.md' },
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
                text: { content: 'Or in the scripts folder:' },
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
                text: { content: 'youtube-scripts/prompt-engineering-a-z-guide.md' },
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
                text: { content: 'How to Use' },
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
                text: { content: '🎬 Ready to record your 10-minute YouTube video!' },
              },
            ],
            icon: { emoji: '🎬' },
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
                text: { content: 'Open the local file in your workspace' },
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
                text: { content: 'Read through the script (or use it directly)' },
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
                text: { content: 'Record your video (~10 minutes)' },
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
                text: { content: 'Upload to YouTube' },
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
                text: { content: 'Share with BTNE community!' },
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
                text: { content: 'CRAFT Framework Summary' },
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
                text: { content: '**C** - Context: Analyze environment, background, audience, and constraints' },
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
                text: { content: '**R** - Role: Define your responsibility, function, and boundaries' },
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
                text: { content: '**A** - Action: Execute steps and behaviors to achieve objectives' },
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
                text: { content: '**F** - Format: Structure communication using appropriate mediums and tools' },
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
                text: { content: '**T** - Tone: Determine appropriate voice and emotional quality' },
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
                text: { content: '🚀 This isn\'t just about AI. It\'s about better communication in everything you do.' },
              },
            ],
            icon: { emoji: '🚀' },
            color: 'orange',
          },
        },
      ],
    });

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
    console.log('  ✅ Script structure breakdown (10 sections)');
    console.log('  ✅ CRAFT framework summary');
    console.log('  ✅ How to use (5 steps)');
    console.log('  ✅ Links to local script files');
    console.log('');
    console.log('How to Use:');
    console.log('─'.repeat(60));
    console.log('  1. Open Master Database (link above)');
    console.log('  2. Click on "Prompt Engineering A-Z Guide"');
    console.log('  3. Open local script file to read');
    console.log('  4. Copy to recording app or use directly');
    console.log('  5. Record your 10-minute video!');
    console.log('');
    console.log('Local Script Files:');
    console.log('─'.repeat(60));
    console.log('  • squad-dashboard/youtube-script-expanded.md');
    console.log('  • youtube-scripts/prompt-engineering-a-z-guide.md');
    console.log('');
    console.log('💡 Pro Tip:');
    console.log('  • Open local file for full script');
    console.log('  • Use Notion page for quick reference');
    console.log('  • All future scripts will be added here');
    console.log('  • Searchable and accessible from any device');
    console.log('');
    console.log('📹 Your script is now in the master database! Ready to record! 🚀\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('');
    console.error('Full error details:', error);
  }
}

addScriptToDatabase();
