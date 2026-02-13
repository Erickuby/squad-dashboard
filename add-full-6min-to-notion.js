/**
 * Add FULL 6-minute script to Notion (complete content)
 */

require('dotenv').config({ path: '.env.local' });

const { Client } = require('@notionhq/client');
const fs = require('fs');

const notionToken = process.env.NOTION_TOKEN;
const scriptsPageId = '306244a2469580539de5df6b3d597211';

console.log('\n' + '='.repeat(60));
console.log('  Adding FULL 6-Minute Script to Notion');
console.log('='.repeat(60) + '\n');

if (!notionToken) {
  console.error('❌ Missing NOTION_TOKEN');
  process.exit(1);
}

const notion = new Client({ auth: notionToken });

async function addFullScript() {
  try {
    // Delete old 6-min script page first
    console.log('Searching for existing 6-min script page...');
    const searchResults = await notion.search({
      query: 'Prompt Engineering A-Z Guide (6-Min Original)',
      filter: {
        property: 'object',
        value: 'page',
      },
    });

    if (searchResults.results.length > 0) {
      for (const result of searchResults.results) {
        if (result.properties.title && 
            result.properties.title.title[0]?.text.content.includes('6-Min Original')) {
          console.log('Deleting old 6-min script page:', result.id);
          await notion.pages.update({
            page_id: result.id,
            archived: true,
          });
        }
      }
    }

    // Read 6-minute script
    const scriptContent = fs.readFileSync('youtube-script-6min-original.md', 'utf-8');

    // Split into sections
    const lines = scriptContent.split('\n');
    
    // Create new page
    console.log('Creating new page with full script...');
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
                content: 'Prompt Engineering A-Z Guide (6-Min Original - FULL)',
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
                text: { content: 'Full 6-Minute Script' },
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
                text: { content: '📹 Complete 6-minute script with timestamps and visual cues. 1,245 words.' },
              },
            ],
            icon: { emoji: '📹' },
            color: 'blue',
          },
        },
        {
          object: 'block',
          type: 'divider',
          divider: {},
        },
      ],
    });

    // Add script content in chunks (avoid rate limit)
    console.log('Adding script content...');
    const maxParagraphLength = 1900; // Stay under 2000 limit
    let currentChunk = '';
    
    for (const line of lines) {
      currentChunk += line + '\n';
      
      // Check if adding next line would exceed limit
      if (currentChunk.length + line.length > maxParagraphLength) {
        // Add current chunk as paragraph
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
                    text: { content: currentChunk },
                  },
                ],
              },
            },
          ],
        });
        currentChunk = '';
        // Small delay to avoid rate limit
        await new Promise(resolve => setTimeout(resolve, 500));
      }
    }
    
    // Add remaining content
    if (currentChunk.trim()) {
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
                  text: { content: currentChunk },
                  },
              ],
            },
          },
        ],
      });
    }

    console.log('\n' + '='.repeat(60));
    console.log('  ✅ Full 6-Minute Script Added!');
    console.log('='.repeat(60) + '\n');
    console.log('Script Page URL:', scriptPage.url);
    console.log('');
    console.log('Master Database URL:');
    console.log('https://www.notion.so/YouTube-Scripts-Master-Database-306244a2469580539de5df6b3d597211');
    console.log('');
    console.log('✅ FULL script content is now in Notion!');
    console.log('Open the page to read the complete 6-minute script.');
    console.log('');
    console.log('💡 This page contains the complete script with:');
    console.log('  • Timestamps (every 30 seconds)');
    console.log('  • Visual cues for video recording');
    console.log('  • Full spoken word content');
    console.log('  • BTNE-relevant examples');
    console.log('');
    console.log('📹 Ready to record your 6-minute video! 🎬\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('');
    console.error('Full error details:', error);
  }
}

addFullScript();
