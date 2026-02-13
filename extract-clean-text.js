/**
 * Extract clean spoken text from 6-minute script and update Notion
 */

require('dotenv').config({ path: '.env.local' });

const { Client } = require('@notionhq/client');
const fs = require('fs');

const notionToken = process.env.NOTION_TOKEN;
const scriptsPageId = '306244a2469580539de5df6b3d597211';

console.log('\n' + '='.repeat(60));
console.log('  Extracting Clean Spoken Text for Notion');
console.log('='.repeat(60) + '\n');

if (!notionToken) {
  console.error('❌ Missing NOTION_TOKEN');
  process.exit(1);
}

const notion = new Client({ auth: notionToken });

async function extractCleanText() {
  try {
    // Read 6-minute script
    const scriptContent = fs.readFileSync('youtube-script-6min-original.md', 'utf-8');

    // Extract only spoken text (remove timestamps, visual cues, etc.)
    const lines = scriptContent.split('\n');
    let cleanText = '';
    
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];

      // Skip empty lines
      if (!line.trim()) continue;

      // Skip timestamps like [0:00-0:30]
      if (/^\[\d{2}:\d{2}-\d{2}:\d{2}\]/.test(line)) continue;

      // Skip section headers like ### [0:00-0:30] HOOK
      if (/^###?\s*\[/.test(line)) continue;

      // Skip visual cues (starts with **Visual:)
      if (/^\*\*Visual:/.test(line)) continue;

      // Skip audio cues (starts with **Audio:)
      if (/^\*\*Audio:/.test(line)) continue;

      // When we find "**Script:", start capturing the next line
      if (/^\*\*Script:/.test(line)) {
        // Get the next line (actual spoken text)
        if (i + 1 < lines.length) {
          const spokenText = lines[i + 1].trim();
          if (spokenText) {
            cleanText += spokenText + '\n\n';
          }
        }
        continue;
      }

      // Skip other markdown lines (headers, bold, etc.)
      if (/^#+\s/.test(line)) continue;
      if (/^\*\*[^V]/.test(line)) continue; // Skip ** but not **Visual
    }

    console.log('Clean text extracted!');
    console.log('Lines:', cleanText.split('\n').length);
    console.log('Characters:', cleanText.length);
    console.log('');

    // Delete old clean text page
    console.log('Searching for existing clean text page...');
    const searchResults = await notion.search({
      query: 'Prompt Engineering A-Z Guide (6-Min - Clean Text)',
      filter: {
        property: 'object',
        value: 'page',
      },
    });

    if (searchResults.results.length > 0) {
      for (const result of searchResults.results) {
        if (result.properties.title && 
            result.properties.title.title[0]?.text.content.includes('Clean Text')) {
          console.log('Deleting old clean text page:', result.id);
          await notion.pages.update({
            page_id: result.id,
            archived: true,
          });
        }
      }
    }

    // Create new page with clean text only
    console.log('Creating new page with clean text...');
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
                content: 'Prompt Engineering A-Z Guide (6-Min - Clean Text)',
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
                text: { content: 'Clean Spoken Text (Plain Words Only)' },
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
                text: { content: '📹 Plain spoken text only - no timestamps, visual cues, or camera directions. Just the words to say.' },
              },
            ],
            icon: { emoji: '📹' },
            color: 'green',
          },
        },
        {
          object: 'block',
          type: 'divider',
          divider: {},
        },
      ],
    });

    // Add clean text in chunks
    console.log('Adding clean text...');
    const maxParagraphLength = 1900;
    let currentChunk = '';
    const cleanLines = cleanText.split('\n');
    
    for (const line of cleanLines) {
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
    console.log('  ✅ Clean Text Added to Notion!');
    console.log('='.repeat(60) + '\n');
    console.log('Script Page URL:', scriptPage.url);
    console.log('');
    console.log('Master Database URL:');
    console.log('https://www.notion.so/YouTube-Scripts-Master-Database-306244a2469580539de5df6b3d597211');
    console.log('');
    console.log('✅ Clean spoken text is now in Notion!');
    console.log('Just the words to say - no distractions!');
    console.log('');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('');
    console.error('Full error details:', error);
  }
}

extractCleanText();
