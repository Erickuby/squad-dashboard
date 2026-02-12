# Notion Integration Setup Guide

Automatically sync completed tasks to Notion database! 🗄️

## Overview

When you approve a task, it automatically:
1. Creates a Notion page
2. Adds task details (title, description, status, etc.)
3. Includes all comments (agent's work)
4. Adds checklist items
5. Links task to Notion in the dashboard

## Setup Instructions

### Step 1: Create Notion Integration

1. Go to [Notion My Integrations](https://www.notion.so/my-integrations)
2. Click **"+ New integration"**
3. Fill in:
   - **Name**: "Squad Dashboard" (or your preferred name)
   - **Associated workspace**: Select your workspace
   - **Type**: Internal
4. Click **Submit**
5. Copy the **Internal Integration Token** (starts with `secret_`)

### Step 2: Create Notion Database

1. Create a new page in Notion (or use an existing page)
2. Add a **Table database** to the page
3. Rename database to "Squad Completed Tasks"
4. Add these columns (properties):

| Property Name | Type | Options |
|---------------|------|---------|
| Name | Title | (default) |
| Status | Select | To Do, In Progress, Waiting Approval, Completed, Failed |
| Agent | Select | Researcher, Builder, Copywriter, Marketer, Manager |
| Priority | Select | Low, Normal, High, Urgent |
| Completed Date | Date | (default) |
| Created Date | Date | (default) |
| Bounce Count | Number | (default) |

5. Click **...** (three dots) → **Add connections**
6. Select your "Squad Dashboard" integration

### Step 3: Get Database ID

1. Click **Share** on the database
2. Copy the database ID from the URL
   - URL format: `https://www.notion.so/workspace/[DATABASE_ID]?v=...`
   - The ID is the 32-character string between `workspace/` and `?v=`
   - Example: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6`

### Step 4: Add Environment Variables

Add these to `squad-dashboard/.env.local`:

```bash
# Notion Integration
NOTION_TOKEN=secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_DATABASE_ID=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6

# Optional: Parent page ID (for auto-creating database)
NOTION_PARENT_PAGE_ID=xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

### Step 5: Install Dependencies

```bash
cd squad-dashboard
npm install @notionhq/client
```

### Step 6: Test Integration

```bash
# Test database connection
node scripts/sync-notion.js setup
```

This will:
- Verify Notion credentials
- Check database exists
- Show database details

## How It Works

### Approval Flow

```
You approve task
     ↓
Task moves to "Completed"
     ↓
API calls sync-notion
     ↓
Notion page created with:
  - Title
  - Status (Completed)
  - Agent
  - Priority
  - Dates
  - All comments (work log)
  - Checklist items
     ↓
Task updated with Notion page ID
     ↓
"View in Notion" link appears in task detail modal
```

### What Gets Synced

**Task Metadata:**
- ✅ Title
- ✅ Description
- ✅ Status
- ✅ Agent
- ✅ Priority
- ✅ Created date
- ✅ Completed date
- ✅ Bounce count

**Agent Work:**
- ✅ All comments (work log)
- ✅ Timestamps for each comment
- ✅ Author names
- ✅ Comment formatting

**Checklist:**
- ✅ All checklist items
- ✅ Completion status

**Links:**
- ✅ Notion page ID stored in task
- ✅ Notion URL accessible from dashboard

## Usage

### View Notion Page

1. Click completed task in Task Board
2. Task detail modal opens
3. Click **"View in Notion"** link
4. Opens Notion page in new tab

### Auto-Sync

- Syncs **automatically** when you approve a task
- No manual steps required
- Happens in background

### Manual Sync

If auto-sync fails, you can manually sync:

```bash
# Get task from Supabase, then sync
node scripts/sync-notion.js sync '{"id":"task-id","title":"Task Title",...}'
```

## Example Notion Page

After sync, your Notion page will look like:

```
📋 Task Details

• Status: Completed
• Agent: Researcher
• Priority: High
• Project ID: proj-123

💬 Work Log (5 comments)

Researcher (agent)
Started working on this task...
Let me research viral trends...
Found 5 trending topics:
1. AI tutorials
2. Productivity hacks
...

Eric (human)
Looks great, approve!

✅ Checklist

☑️ Research viral trends
☑️ Analyze 10+ examples
☑️ Identify patterns
☑️ Provide actionable insights
```

## Troubleshooting

### Error: "Missing Notion credentials"

**Solution:**
1. Check `.env.local` file exists
2. Verify `NOTION_TOKEN` is set
3. Verify `NOTION_DATABASE_ID` is set
4. Restart dev server: `npm run dev`

### Error: "Database not found"

**Solution:**
1. Verify database ID is correct (32 characters)
2. Check database is shared with integration
3. Go to database → Share → Add connections → Select integration

### Error: "Insufficient permissions"

**Solution:**
1. Check integration is connected to database
2. Go to database → Share → Add connections
3. Ensure correct integration is selected
4. Verify integration has write access

### Notion link doesn't appear

**Solution:**
1. Refresh Task Board (auto-refreshes every 30s)
2. Check task status is "Completed"
3. Try clicking task to open detail modal
4. Check browser console for errors

### Sync fails but task completes

**Solution:**
1. Check API endpoint is working: `http://localhost:3000/api/sync-notion`
2. Check Notion credentials in `.env.local`
3. Review console logs for error details
4. Try manual sync via script

## Advanced: Auto-Create Database

If you haven't created a database yet, the script can auto-create it:

```bash
node scripts/sync-notion.js setup
```

This will:
1. Check if database exists
2. If not, create new database in parent page
3. Add all required properties
4. Output new database ID

**Requirements:**
- `NOTION_PARENT_PAGE_ID` in `.env.local`
- Integration connected to parent page

## Security Notes

**Never commit `.env.local`** to git!

Add to `.gitignore`:
```
.env.local
```

**Token security:**
- Keep `NOTION_TOKEN` secret
- Only share with trusted collaborators
- Rotate token if compromised

## Next Steps

1. ✅ Create Notion integration
2. ✅ Create Notion database
3. ✅ Add environment variables
4. ✅ Install dependencies
5. ✅ Test integration
6. ✅ Approve a task → Watch it sync to Notion!

## Files Modified

- `scripts/sync-notion.js` - Notion sync script
- `app/api/sync-notion/route.ts` - API endpoint
- `components/TaskBoard.tsx` - Added Notion link display
- `types/squad.ts` - Added notion_page_id and notion_page_url
- `package.json` - Added @notionhq/client

## Support

If you run into issues:
1. Check browser console for errors
2. Review terminal logs
3. Verify Notion credentials
4. Check database permissions
5. Test with: `node scripts/sync-notion.js setup`

Happy syncing! 🚀
