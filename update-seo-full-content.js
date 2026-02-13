/**
 * Update Notion SEO package page with FULL content (not link)
 */

require('dotenv').config({ path: '.env.local' });

const { Client } = require('@notionhq/client');

const notionToken = process.env.NOTION_TOKEN;
const scriptsPageId = '306244a2469580539de5df6b3d597211';

console.log('\n' + '='.repeat(60));
console.log('  Updating SEO Package Page - Adding FULL Content');
console.log('='.repeat(60) + '\n');

if (!notionToken) {
  console.error('❌ Missing NOTION_TOKEN');
  process.exit(1);
}

const notion = new Client({ auth: notionToken });

async function updateSEOPackage() {
  try {
    // Search for existing SEO package page
    console.log('Searching for SEO package page...');
    const searchResults = await notion.search({
      query: 'YouTube SEO Package - Prompt Engineering Guide',
      filter: {
        property: 'object',
        value: 'page',
      },
    });

    if (searchResults.results.length > 0) {
      for (const result of searchResults.results) {
        if (result.properties.title && 
            result.properties.title.title[0]?.text.content.includes('SEO Package')) {
          
          // Clear existing children and add FULL content
          console.log('Found SEO package page:', result.id);
          console.log('Deleting old content...');
          
          // Archive old blocks by replacing them
          await notion.blocks.delete({
            block_id: result.id,
          });
          
          console.log('Adding FULL SEO package content...');
          
          // Create new page with FULL content
          await notion.pages.update({
            page_id: result.id,
            archived: false,
            children: [
              {
                object: 'block',
                type: 'heading_2',
                heading_2: {
                  rich_text: [
                    {
                      type: 'text',
                      text: { content: 'Complete SEO Package (Full Content)' },
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
                      text: { content: '🎯 Everything you need to upload - titles, description, tags, and thumbnails. All here, no local file needed!' },
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
                      text: { content: 'SEO Titles (2 Options - Copy & Paste)' },
                    },
                  ],
                },
              },
              {
                object: 'block',
                type: 'heading_4',
                heading_4: {
                  rich_text: [
                    {
                      type: 'text',
                      text: { content: 'Option 1 (Click-Worthy):' },
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
                      text: { content: '3 Prompt Engineering Techniques That Transformed My Career' },
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
                      text: { content: 'Length: 55 characters ✅' },
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
                type: 'heading_4',
                heading_4: {
                  rich_text: [
                    {
                      type: 'text',
                      text: { content: 'Option 2 (Curiosity Gap):' },
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
                      text: { content: 'I Mastered Prompt Engineering (Here\'s How)' },
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
                      text: { content: 'Length: 42 characters ✅' },
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
                      text: { content: 'Video Description (SEO-Optimized)' },
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
                      text: { content: '📄 Hook + Summary + Timestamps + CTA (2,847 characters)' },
                    },
                  ],
                  icon: { emoji: '📄' },
                  color: 'blue',
                },
              },
              {
                object: 'block',
                type: 'heading_4',
                heading_4: {
                  rich_text: [
                    {
                      type: 'text',
                      text: { content: 'Hook + Summary:' },
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
                      text: { content: 'In 2025, demand for prompt engineering skills increased by 250%. But most of us are still struggling to write basic prompts. Today, I\'m going to show you 3 techniques that transformed my career from overwhelmed to empowered.' },
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
                      text: { content: 'Learn the exact prompt engineering strategies that tech professionals are using to boost productivity by 68% and earn 23% more. Whether you\'re a developer, project manager, or just starting your AI journey - these techniques work across ChatGPT, Claude, and any AI tool.' },
                    },
                  ],
                },
              },
              {
                object: 'block',
                type: 'heading_4',
                heading_4: {
                  rich_text: [
                    {
                      type: 'text',
                      text: { content: 'What\'s Covered:' },
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
                      text: { content: '🎯 Few-Shot Prompting - Show, don\'t just tell' },
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
                      text: { content: '🧠 Chain-of-Thought - Break down complex problems' },
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
                      text: { content: '🎭 Role-Based Prompting - Step into any expert persona' },
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
                      text: { content: '🚀 Real examples you can use today' },
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
                type: 'heading_4',
                heading_4: {
                  rich_text: [
                    {
                      type: 'text',
                      text: { content: 'Timestamps:' },
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
                      text: { content: '⏱️ 0:00 - Hook: The 250% Growth Stat' },
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
                      text: { content: '⏱️ 0:30 - The Struggle: Why We\'re Stuck' },
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
                      text: { content: '⏱️ 1:00 - Why It Matters: 68% Productivity, 23% Salary Boost' },
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
                      text: { content: '⏱️ 1:30 - The Transformation: From Frustrated to Empowered' },
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
                      text: { content: '⏱️ 2:00 - Technique #1: Few-Shot Prompting' },
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
                      text: { content: '⏱️ 2:30 - Few-Shot in Action: Real Examples' },
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
                      text: { content: '⏱️ 3:00 - Technique #2: Chain-of-Thought' },
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
                      text: { content: '⏱️ 3:30 - Chain-of-Thought for Non-Technical' },
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
                      text: { content: '⏱️ 4:00 - Technique #3: Role-Based Prompting' },
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
                      text: { content: '⏱️ 4:30 - Role-Based in Action: Expert Personas' },
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
                      text: { content: '⏱️ 5:00 - Putting It All Together' },
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
                      text: { content: '⏱️ 5:30 - Role-Based for Everything' },
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
                      text: { content: '⏱️ 9:30 - Conclusion & CTA: Start Today' },
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
                type: 'heading_4',
                heading_4: {
                  rich_text: [
                    {
                      type: 'text',
                      text: { content: 'Call to Action:' },
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
                      text: { content: '👆 Like if this helped you master prompt engineering!' },
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
                      text: { content: '💬 Comment: Which technique will you try first?' },
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
                      text: { content: '🔔 Subscribe for more AI productivity tips for Black tech professionals!' },
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
                      text: { content: '🔗 Join The Black Tech Community: [Link to community]' },
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
                      text: { content: 'Hashtags:' },
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
                      text: { content: '#PromptEngineering #AI #ChatGPT #ProductivityHacks #TechCareer #BlackTech #BTNE #AIProductivity #WorkSmarter #PromptHacks #ArtificialIntelligence' },
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
                      text: { content: 'SEO Tags (30 Comma-Separated)' },
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
                      text: { content: '📋 Copy and paste these directly into YouTube:' },
                    },
                  ],
                  icon: { emoji: '📋' },
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
                      text: { content: 'prompt engineering, AI productivity, ChatGPT tips, Claude AI, prompt hacks, BTNE, tech career, AI skills, artificial intelligence, prompt engineering guide, ChatGPT tutorial, Claude tutorial, AI for work, productivity hacks, master AI, prompt strategies, AI career boost, ChatGPT hacks, prompt engineering techniques, Claude prompts, AI learning, work smarter with AI, prompt engineering for beginners, advanced prompt engineering, few-shot prompting, chain-of-thought prompting, role-based prompting, Black tech community, AI training, professional AI skills' },
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
                      text: { content: 'Thumbnail Prompts (3 Click-Worthy Options)' },
                    },
                  ],
                },
              },
              {
                object: 'block',
                type: 'heading_4',
                heading_4: {
                  rich_text: [
                    {
                      type: 'text',
                      text: { content: 'Option 1 (Curiosity Gap):' },
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
                      text: { content: 'Face + "3 TECHNIQUES" + "250% GROWTH" - high contrast' },
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
                      text: { content: 'Prompt for Image Generator (Midjourney/DALL-E/etc.):' },
                    },
                  ],
                  icon: { emoji: '🖼️' },
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
                      text: { content: 'Professional YouTube thumbnail featuring a Black male tech professional in his late 20s to early 30s, speaking passionately to camera, wearing smart-casual attire, clean modern background with subtle blue and purple gradient lighting, bold white text overlay in center reading "3 TECHNIQUES" in thick sans-serif font, smaller yellow text below reading "250% GROWTH" in contrasting font, subtle tech circuit patterns in background, professional authentic expression, high contrast colors, curiosity gap element, trending minimal thumbnail style, 4K resolution' },
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
                type: 'heading_4',
                heading_4: {
                  rich_text: [
                    {
                      type: 'text',
                      text: { content: 'Option 2 (Before/After):' },
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
                      text: { content: 'Split YouTube thumbnail showing left side: frustrated Black tech professional staring at computer screen with red X, right side: confident same professional celebrating with green checkmark, bold text center: "Before vs After", smaller text below: "From Overwhelmed to Empowered", modern clean background, high contrast' },
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
                type: 'heading_4',
                heading_4: {
                  rich_text: [
                    {
                      type: 'text',
                      text: { content: 'Option 3 (Curiosity Gap):' },
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
                      text: { content: 'YouTube thumbnail featuring Black tech professional pointing at text bubble showing complex AI prompt, bold text center: "I Fixed This", question mark symbol, smaller text: "The 1 Secret Technique Nobody Teaches", mystery aesthetic, dark background with bright accent colors, genuine confused expression' },
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
                      text: { content: 'Thumbnail A/B Testing Strategy:' },
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
                      text: { content: 'Test 3 options against each other' },
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
                      text: { content: 'Use YouTube analytics to compare CTR' },
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
                      text: { content: 'Keep as winner, iterate for next video' },
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
                      text: { content: 'Why This Works' },
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
                      text: { content: '✅ Title: Under 60 characters, transformation promise' },
                    },
                  ],
                  icon: { emoji: '✅' },
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
                      text: { content: '✅ Description: Hook + timestamps + CTA, optimized length' },
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
                      text: { content: '✅ Tags: 30 tags (broad + specific + community mix)' },
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
                      text: { content: '✅ Thumbnail: Face + bold text + curiosity gap + high contrast' },
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
                      text: { content: '✅ Length: 6 minutes is perfect for educational AI content' },
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
                      text: { content: 'Ready to Record! 🎬' },
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
                      text: { content: 'Open Notion page, read clean script, generate thumbnail, record video, upload with SEO package, track performance.' },
                    },
                  ],
                },
              },
            ],
          });

          console.log('\n' + '='.repeat(60));
          console.log('  ✅ SEO Package Updated with FULL Content!');
          console.log('='.repeat(60) + '\n');
          console.log('SEO Package Page URL:', searchResults.results[0].url);
          console.log('');
          console.log('What Was Fixed:');
          console.log('─'.repeat(60));
          console.log('  ✅ Removed link to local file');
          console.log('  ✅ Added FULL SEO package content');
          console.log('  ✅ Can now copy everything directly from Notion');
          console.log('  ✅ No local file needed');
          console.log('');
          console.log('💡 Going forward, I will:');
          console.log('  • Always put full content in Notion');
          console.log('  • No links to local files unless you want backup');
          console.log('  • Everything accessible directly in Notion');
          console.log('');
          console.log('🎯 SEO package is now complete in Notion! 🚀\n');

          return;
        }
      }
    }

    console.error('❌ SEO package page not found');
    process.exit(1);

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('');
    console.error('Full error details:', error);
  }
}

updateSEOPackage();
