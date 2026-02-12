# Notion Integration - Complete!

Completed tasks now automatically sync to Notion! 🗄️✨

## What Was Built

✅ **Notion sync script** - Creates Notion pages from completed tasks
✅ **API endpoint** - `/api/sync-notion` handles auto-sync
✅ **Auto-sync on approval** - Tasks sync when you click "Approve"
✅ **Notion link in dashboard** - "View in Notion" button appears
✅ **Full data sync** - All comments, checklists, metadata preserved
✅ **Setup guide** - Complete step-by-step instructions

## How It Works

### Approval Flow with Notion Sync

```
You approve task (click "Approve" button)
     ↓
Task moves to "Completed" column
     ↓
🗄️ Auto-sync triggers:
     - Fetches task from Supabase
     - Creates Notion page
     - Adds all task details
     - Includes all comments (agent's work)
     - Adds checklist items
     - Stores Notion page ID in task
     ↓
"View in Notion" link appears in task detail
     ↓
Click link → Opens Notion page in new tab
```

### What Gets Synced to Notion

**Task Metadata:**
- ✅ Title
- ✅ Description
- ✅ Status (set to "Completed")
- ✅ Agent (who worked on it)
- ✅ Priority
- ✅ Created date
- ✅ Completed date
- ✅ Bounce count

**Agent Work (Comments):**
- ✅ All comments in chat_history
- ✅ Each comment shows:
  - Author name
  - Role (agent/human/manager)
  - Full message
  - Timestamp

**Checklist Items:**
- ✅ All checklist steps
- ✅ Completion status (checked/unchecked)

**Links:**
- ✅ Notion page ID stored in task
- ✅ Notion URL accessible from dashboard

## Setup Instructions

### Step 1: Create Notion Integration

1. Go to [Notion My Integrations](https://www.notion.so/my-integrations)
2. Click **"+ New integration"**
3. Fill in:
   - **Name**: "Squad Dashboard"
   - **Associated workspace**: Your workspace
   - **Type**: Internal
4. Click **Submit**
5. Copy the **Internal Integration Token** (starts with `secret_`)

### Step 2: Create Notion Database

1. Create new page in Notion
2. Add **Table database** to page
3. Rename to "Squad Completed Tasks"
4. Add columns (properties):

| Property | Type | Options |
|----------|------|---------|
| Name | Title | (default) |
| Status | Select | To Do, In Progress, Waiting Approval, Completed, Failed |
| Agent | Select | Researcher, Builder, Copywriter, Marketer, Manager |
| Priority | Select | Low, Normal, High, Urgent |
| Completed Date | Date | (default) |
| Created Date | Date | (default) |
| Bounce Count | Number | (default) |

5. Click **...** → **Add connections** → Select "Squad Dashboard" integration

### Step 3: Get Database ID

1. Click **Share** on database
2. Copy database ID from URL
3. URL format: `https://www.notion.so/workspace/[DATABASE_ID]?v=...`
4. ID is 32-character string between `workspace/` and `?v=`

### Step 4: Add Environment Variables

Create/Update `squad-dashboard/.env.local`:

```bash
# Notion Integration
NOTION_TOKEN=secret_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
NOTION_DATABASE_ID=a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

### Step 5: Install Dependencies

```bash
cd squad-dashboard
npm install @notionhq/client
```

### Step 6: Test Integration

```bash
node scripts/sync-notion.js setup
```

Output:
```
✅ Found existing Notion database

============================================================
  ✅ Database Setup Complete
============================================================

Database ID: a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
Database URL: https://www.notion.so/a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6
```

## Usage

### Auto-Sync (Recommended)

No manual steps required! Just:

1. Agent completes task → Moves to "Waiting Approval"
2. You click **"Approve"** button
3. Task moves to "Completed" column
4. **Notion page automatically created** ✨
5. **"View in Notion"** link appears in task detail
6. Click link to view full task in Notion!

### View Notion Page

1. Click completed task in Task Board
2. Task detail modal opens
3. Click **"View in Notion"** link (next to priority)
4. Opens Notion page in new tab

### Example Notion Page Content

```
📋 Description
Research viral YouTube trends for AI productivity niche

📊 Task Details
• Status: Completed
• Agent: Researcher
• Priority: High
• Project ID: proj-viral-001

💬 Work Log (5 comments)

Researcher (agent)
Started working on this task...
Let me research viral YouTube trends in AI productivity...

Researcher (agent)
Found 5 top viral trends:
1. AI Tool Reviews (23M avg views)
2. Productivity Hacks (18M avg views)
3. Coding Challenges (15M avg views)
4. Behind-the-scenes (12M avg views)
5. Quick Tips (10M avg views)

Researcher (agent)
Key insights:
- Short-form content (under 60s) performs best
- Upload times: 7-9am, 12pm, 5-6pm UK
- AI tutorials are #1 trending niche
- Include demonstrations in videos
- Use engaging thumbnails

Eric (human)
Great work! Approve this task.

— Feb 12, 2026 at 11:30 AM

✅ Checklist
☑️ Research 10+ viral videos
☑️ Identify common patterns
☑️ Analyze top performing niches
☑️ Provide actionable insights
☑️ Suggest content ideas

— Completed Date: Feb 12, 2026 at 11:30 AM
— Created Date: Feb 12, 2026 at 10:00 AM
— Bounce Count: 0
```

## Troubleshooting

### Error: "Missing Notion credentials"

**Solution:**
- Check `.env.local` exists
- Verify `NOTION_TOKEN` is set
- Verify `NOTION_DATABASE_ID` is set
- Restart dev server: `npm run dev`

### Error: "Database not found"

**Solution:**
- Verify database ID is correct (32 characters)
- Check database is shared with integration
- Go to database → Share → Add connections

### Notion link doesn't appear

**Solution:**
- Wait 30s for auto-refresh
- Click task to open detail modal
- Check task status is "Completed"
- Refresh Task Board

### Sync fails but task completes

**Solution:**
- Check console for errors
- Verify Notion credentials
- Test: `node scripts/sync-notion.js setup`
- Syncs can fail, but task still completes

## Files Modified

**New Files:**
- `scripts/sync-notion.js` - Notion sync script
- `app/api/sync-notion/route.ts` - API endpoint
- `NOTION-INTEGRATION.md` - Complete setup guide

**Modified Files:**
- `components/TaskBoard.tsx` - Added Notion sync on approve
- `types/squad.ts` - Added notion_page_id and notion_page_url
- `package.json` - Added @notionhq/client dependency

## Security

**Important:** Never commit `.env.local` to git!

```bash
# Add to .gitignore
echo ".env.local" >> squad-dashboard/.gitignore
```

## Next Steps

1. ✅ Create Notion integration
2. ✅ Create Notion database
3. ✅ Add environment variables
4. ✅ Install dependencies
5. ✅ Test with: `node scripts/sync-notion.js setup`
6. ✅ Approve a task → Watch it sync to Notion!

## Documentation

- **Setup Guide**: `squad-dashboard/NOTION-INTEGRATION.md`
- **Completed Tasks FAQ**: `squad-dashboard/COMPLETED-TASKS-FAQ.md`
- **Bot System**: `squad-dashboard/BOT-SYSTEM.md`
- **Bot Setup**: `squad-dashboard/BOT-SETUP.md`

## Summary

✅ Auto-sync completed tasks to Notion
✅ "View in Notion" link in dashboard
✅ All agent work preserved
✅ Full task history saved
✅ No manual steps required
✅ Complete setup guide provided

**Get started now!** Follow setup instructions in `NOTION-INTEGRATION.md` 🚀
