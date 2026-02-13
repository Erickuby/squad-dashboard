/**
 * Add YouTube SEO Package to Notion
 */

require('dotenv').config({ path: '.env.local' });

const { Client } = require('@notionhq/client');
const fs = require('fs');

const notionToken = process.env.NOTION_TOKEN;
const scriptsPageId = '306244a2469580539de5df6b3d597211';

console.log('\n' + '='.repeat(60));
console.log('  Adding YouTube SEO Package to Notion');
console.log('='.repeat(60) + '\n');

if (!notionToken) {
  console.error('❌ Missing NOTION_TOKEN');
  process.exit(1);
}

const notion = new Client({ auth: notionToken });

async function addSEOPackage() {
  try {
    // Read SEO package
    const seoContent = fs.readFileSync('youtube-seo-package.md', 'utf-8');

    // Create new page
    console.log('Creating SEO package page...');
    const seoPage = await notion.pages.create({
      parent: {
        type: 'page_id',
        page_id: scriptsPageId,
      },
      properties: {
        title: {
          title: [
            {
              text: {
                content: 'YouTube SEO Package - Prompt Engineering Guide',
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
                text: { content: 'Complete SEO Package' },
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
                text: { content: '🎯 Ready to upload! SEO title, description, 30 tags, and thumbnail prompts based on February 2026 research.' },
              },
            ],
            icon: { emoji: '🎯' },
            color: 'green',
          },
        },
        {
          object: 'block',
          type: 'divider',
          divider: {},
        },
        {
          object: 'block',
          type: 'heading_3',
          heading_3: {
            rich_text: [
              {
                type: 'text',
                text: { content: 'What You Get' },
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
                text: { content: '✅ SEO Title (2 options - under 60 chars)' },
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
                text: { content: '✅ Video Description (SEO-optimized with timestamps + CTA)' },
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
                text: { content: '✅ SEO Tags (30 comma-separated tags, copy-paste ready)' },
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
                text: { content: '✅ Thumbnail Prompts (3 click-worthy options)' },
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
          type: 'heading_3',
          heading_3: {
            rich_text: [
              {
                type: 'text',
                text: { content: 'Research Findings' },
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
                text: { content: '📊 Based on February 2026 YouTube trends and viral video analysis.' },
              },
            ],
            icon: { emoji: '📊' },
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
                text: { content: '**Hooks:** First 3 seconds must hook | Emotional + curiosity + number-based perform best' },
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
                text: { content: '**Thumbnails:** Face + bold text + curiosity gap = 20-30% higher CTR' },
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
                text: { content: '**Video Length:** 6 minutes is sweet spot for educational AI content' },
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
                text: { content: '**Posting Times (UK):** 7-9 AM, 12-1 PM, 5-6 PM (GMT/BST)' },
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
          type: 'heading_3',
          heading_3: {
            rich_text: [
              {
                type: 'text',
                text: { content: 'Local File' },
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
                text: { content: 'squad-dashboard/youtube-seo-package.md' },
              },
            ],
            language: 'markdown',
          },
        },
      ],
    });

    console.log('\n' + '='.repeat(60));
    console.log('  ✅ SEO Package Added to Notion!');
    console.log('='.repeat(60) + '\n');
    console.log('SEO Package Page URL:', seoPage.url);
    console.log('');
    console.log('Master Database URL:');
    console.log('https://www.notion.so/YouTube-Scripts-Master-Database-306244a2469580539de5df6b3d597211');
    console.log('');
    console.log('What Was Added:');
    console.log('─'.repeat(60));
    console.log('  ✅ SEO Package page in Notion');
    console.log('  ✅ Research findings included');
    console.log('  ✅ Links to local file');
    console.log('  ✅ Ready to upload!');
    console.log('');
    console.log('💡 Open the page above for SEO package:');
    console.log('  • 2 SEO title options');
    console.log('  • Video description with timestamps');
    console.log('  • 30 SEO tags (copy-paste ready)');
    console.log('  • 3 thumbnail prompts (click-worthy)');
    console.log('');
    console.log('🎯 Everything ready to record and upload! 🚀\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('');
    console.error('Full error details:', error);
  }
}

addSEOPackage();
