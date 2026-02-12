/**
 * Sync completed tasks to Notion
 *
 * When a task is approved/completed, sync it to Notion database.
 * Creates a Notion page with all task details, comments, and results.
 */

require('dotenv').config({ path: '.env.local' });
const { Client } = require('@notionhq/client');

const NOTION_TOKEN = process.env.NOTION_TOKEN;
const NOTION_DATABASE_ID = process.env.NOTION_DATABASE_ID;

if (!NOTION_TOKEN || !NOTION_DATABASE_ID) {
  console.error('❌ Error: Notion credentials not found in .env.local');
  console.log('Required: NOTION_TOKEN, NOTION_DATABASE_ID');
  process.exit(1);
}

const notion = new Client({ auth: NOTION_TOKEN });

/**
 * Sync a completed task to Notion
 * @param {Object} task - Task object from Supabase
 * @returns {Promise<string>} Notion page ID
 */
async function syncTaskToNotion(task) {
  console.log(`📝 Syncing task "${task.title}" to Notion...\n`);

  try {
    // 1. Create Notion page
    const page = await notion.pages.create({
      parent: {
        type: 'database_id',
        database_id: NOTION_DATABASE_ID,
      },
      properties: {
        // Title
        Name: {
          title: [
            {
              text: {
                content: task.title,
              },
            },
          ],
        },

        // Status
        Status: {
          select: {
            name: 'Completed',
          },
        },

        // Agent
        Agent: {
          select: task.assigned_agent ? {
            name: task.assigned_agent,
          } : undefined,
        },

        // Priority
        Priority: {
          select: {
            name: task.priority || 'Normal',
          },
        },

        // Completed Date
        'Completed Date': {
          date: task.completed_at || new Date().toISOString(),
        },

        // Created Date
        'Created Date': {
          date: task.created_at,
        },

        // Bounce Count
        'Bounce Count': {
          number: task.bounce_count || 0,
        },
      },
    });

    console.log(`✅ Created Notion page: ${page.id}`);

    // 2. Build page content with blocks
    const blocks = [];

    // Task description
    if (task.description) {
      blocks.push({
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: '📋 Description',
              },
            },
          ],
        },
      });

      blocks.push({
        object: 'block',
        type: 'paragraph',
        paragraph: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: task.description,
              },
            },
          ],
        },
      });
    }

    // Task metadata
    blocks.push({
      object: 'block',
      type: 'heading_2',
      heading_2: {
        rich_text: [
          {
            type: 'text',
            text: {
              content: '📊 Task Details',
            },
          },
        ],
      },
    });

    blocks.push({
      object: 'block',
      type: 'bulleted_list_item',
      bulleted_list_item: {
        rich_text: [
          {
            type: 'text',
            text: {
              content: `Status: ${task.status}`,
            },
          },
        ],
      },
    });

    if (task.assigned_agent) {
      blocks.push({
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: `Agent: ${task.assigned_agent}`,
              },
            },
          ],
        },
      });
    }

    blocks.push({
      object: 'block',
      type: 'bulleted_list_item',
      bulleted_list_item: {
        rich_text: [
          {
            type: 'text',
            text: {
              content: `Priority: ${task.priority}`,
            },
          },
        ],
      },
    });

    if (task.project_id) {
      blocks.push({
        object: 'block',
        type: 'bulleted_list_item',
        bulleted_list_item: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: `Project ID: ${task.project_id}`,
              },
          },
          ],
        },
      });
    }

    // Comments / Work log
    if (task.chat_history && task.chat_history.length > 0) {
      blocks.push({
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: `💬 Work Log (${task.chat_history.length} comments)`,
              },
            },
          ],
        },
      });

      for (const comment of task.chat_history) {
        blocks.push({
          object: 'block',
          type: 'heading_3',
          heading_3: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content: `${comment.author} (${comment.role})`,
                },
              },
            ],
          },
        });

        blocks.push({
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content: comment.message,
                },
              },
            ],
          },
        });

        blocks.push({
          object: 'block',
          type: 'paragraph',
          paragraph: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content: `— ${new Date(comment.timestamp).toLocaleString('en-GB')}`,
                  color: 'gray',
                },
              },
            ],
          },
        });

        blocks.push({
          object: 'block',
          type: 'divider',
          divider: {},
        });
      }
    }

    // Checklist (if exists)
    if (task.checklist && task.checklist.length > 0) {
      blocks.push({
        object: 'block',
        type: 'heading_2',
        heading_2: {
          rich_text: [
            {
              type: 'text',
              text: {
                content: '✅ Checklist',
              },
            },
          ],
        },
      });

      for (const item of task.checklist) {
        blocks.push({
          object: 'block',
          type: 'to_do',
          to_do: {
            rich_text: [
              {
                type: 'text',
                text: {
                  content: item.title || item.text || item.name || 'Checklist item',
                },
              },
            ],
            checked: item.completed || false,
          },
        });
      }
    }

    // Add blocks to page
    await notion.blocks.children.append({
      block_id: page.id,
      children: blocks,
    });

    console.log(`✅ Added ${blocks.length} blocks to Notion page\n`);

    // 3. Return page info
    return {
      success: true,
      pageId: page.id,
      pageUrl: page.url,
      message: 'Task synced to Notion successfully',
    };

  } catch (error) {
    console.error('❌ Error syncing task to Notion:', error);

    return {
      success: false,
      error: error.message,
      message: 'Failed to sync task to Notion',
    };
  }
}

/**
 * Get or create Notion database
 * Creates database with required properties if it doesn't exist
 */
async function getOrCreateDatabase() {
  try {
    // Try to get database
    const database = await notion.databases.retrieve({
      database_id: NOTION_DATABASE_ID,
    });

    console.log('✅ Found existing Notion database');
    return database;

  } catch (error) {
    if (error.code === 'object_not_found') {
      console.log('⚠️  Database not found, creating new one...');

      // Create database
      const database = await notion.databases.create({
        parent: {
          type: 'page_id',
          page_id: process.env.NOTION_PARENT_PAGE_ID,
        },
        title: [
          {
            type: 'text',
            text: {
              content: 'Squad Completed Tasks',
            },
          },
        ],
        properties: {
          Name: {
            title: {},
          },
          Status: {
            select: {
              options: [
                { name: 'To Do', color: 'gray' },
                { name: 'In Progress', color: 'blue' },
                { name: 'Waiting Approval', color: 'yellow' },
                { name: 'Completed', color: 'green' },
                { name: 'Failed', color: 'red' },
              ],
            },
          },
          Agent: {
            select: {
              options: [
                { name: 'Researcher', color: 'purple' },
                { name: 'Builder', color: 'blue' },
                { name: 'Copywriter', color: 'pink' },
                { name: 'Marketer', color: 'green' },
                { name: 'Manager', color: 'yellow' },
              ],
            },
          },
          Priority: {
            select: {
              options: [
                { name: 'Low', color: 'gray' },
                { name: 'Normal', color: 'blue' },
                { name: 'High', color: 'orange' },
                { name: 'Urgent', color: 'red' },
              ],
            },
          },
          'Completed Date': {
            date: {},
          },
          'Created Date': {
            date: {},
          },
          'Bounce Count': {
            number: {},
          },
        },
      });

      console.log('✅ Created new Notion database');
      console.log('📌 Update NOTION_DATABASE_ID in .env.local:');
      console.log(`   NOTION_DATABASE_ID=${database.id}\n`);

      return database;

    } else {
      throw error;
    }
  }
}

// Command line interface
async function main() {
  const args = process.argv.slice(2);
  const command = args[0];

  if (command === 'setup') {
    console.log('\n' + '='.repeat(60));
    console.log('  🗄️  Setting up Notion Database');
    console.log('='.repeat(60) + '\n');

    const database = await getOrCreateDatabase();

    console.log('\n' + '='.repeat(60));
    console.log('  ✅ Database Setup Complete');
    console.log('='.repeat(60));
    console.log(`\nDatabase ID: ${database.id}`);
    console.log(`Database URL: ${database.url}\n`);

  } else if (command === 'sync' && args[1]) {
    // Sync a task by ID (JSON format)
    const taskJson = args[1];
    const task = JSON.parse(taskJson);

    const result = await syncTaskToNotion(task);

    if (result.success) {
      console.log('\n' + '='.repeat(60));
      console.log('  ✅ Sync Complete');
      console.log('='.repeat(60));
      console.log(`\nPage ID: ${result.pageId}`);
      console.log(`Page URL: ${result.pageUrl}\n`);
    } else {
      console.log('\n❌ Sync Failed:', result.message);
      process.exit(1);
    }

  } else {
    console.log('\nUsage:');
    console.log('  Setup database:  node scripts/sync-notion.js setup');
    console.log('  Sync task:      node scripts/sync-notion.js sync \'{"id":"...","title":"..."}\'\n');
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { syncTaskToNotion, getOrCreateDatabase };
