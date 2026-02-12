# Auto-Complete Runner Guide

Automatically moves "In Progress" tasks to "Waiting Approval" after inactivity! 🚀

## What It Does

The Auto-Complete Runner:
1. **Polls every 5 minutes** - Checks for tasks to auto-complete
2. **Detects inactivity** - Finds tasks inactive for 20+ minutes
3. **Auto-completes** - Moves tasks to "Waiting Approval"
4. **Logs progress** - Shows what's happening in real-time
5. **Runs continuously** - Keeps working until you stop it

## How It Works

### Task Lifecycle with Auto-Complete

```
Agent starts task → Status: "In Progress"
                    ↓ (agent works)
                → Adds comments to chat
                    ↓ (time passes: 20+ min)
                → No recent activity
                    ↓
Auto-Complete detects inactivity
                    ↓
Moves task to "Waiting Approval"
                    ↓
Ready for your review!
                    ↓
You approve → Status: "Completed"
                    ↓
Auto-syncs to Notion! ✨
```

### Auto-Complete Logic

A task is auto-completed when:
- ✅ Status is "In Progress"
- ✅ Task has been running for 20+ minutes
- ✅ No agent activity for 20+ minutes (last comment)
- ✅ Task is not stuck in loop (bounce_count < 3)

Tasks that are stuck in loop (3+ bounces) are **NOT** auto-completed.

## Quick Start

### Option 1 - Run Batch File (Windows)

```bash
cd squad-dashboard
run-auto-complete.bat
```

### Option 2 - Run Script (Any Platform)

```bash
cd squad-dashboard
npm run auto-complete
```

### Option 3 - Call API Directly

```bash
curl -X POST http://localhost:3000/api/auto-complete-tasks \
  -H "Content-Type: application/json" \
  -d "{\"dryRun\": false}"
```

## What You'll See

### Running:

```
============================================================
  🤖 Squad Auto-Complete Runner
============================================================

  Polling http://localhost:3000/api/auto-complete-tasks
  Interval: Every 5 minutes
  Press Ctrl+C to stop.

──────────────────────────────────────────────────────────
  🔄 Poll #1 | 02:15:30 PM
──────────────────────────────────────────────────────────

✅ Auto-completed 3 task(s)
   Tasks found: 5
   Tasks completed: 3

   Tasks moved to "Waiting Approval":

   1. 🧪 Research viral YouTube shorts
      Agent: researcher
      Inactive: 25 minutes

   2. ⚡ Build YouTube analytics dashboard
      Agent: builder
      Inactive: 22 minutes

   3. ✍️ Write 10 hooks for YouTube shorts
      Agent: copywriter
      Inactive: 28 minutes

   ⏰ Next poll in 5 minutes...
```

### When No Tasks Ready:

```
──────────────────────────────────────────────────────────
  🔄 Poll #2 | 02:20:30 PM
──────────────────────────────────────────────────────────

✅ Auto-complete check complete
   Tasks found: 5
   Tasks completed: 0

   ℹ️  No tasks ready for auto-completion

   ⏰ Next poll in 5 minutes...
```

### Stopping:

```
============================================================
  🛑 Stopping Auto-Complete Runner
============================================================

  Total polls completed: 15

  Goodbye! 👋
```

## Files

**New Files:**
- `scripts/run-auto-complete.js` - Main runner script (100+ lines)
- `run-auto-complete.bat` - Windows batch file
- `app/api/auto-complete-tasks/route.ts` - API endpoint (150+ lines)

**Modified Files:**
- `package.json` - Added `auto-complete` script command

## Configuration

**Poll Interval:** 5 minutes
**Auto-Complete After:** 20 minutes of inactivity
**API Endpoint:** `/api/auto-complete-tasks`
**Max Bounces to Skip:** 3 (stuck in loop)

## Troubleshooting

### Runner Won't Start

**Error:** "Cannot find module"
**Solution:** Install dependencies first
```bash
cd squad-dashboard
npm install
```

**Error:** "ECONNREFUSED" or connection refused
**Solution:** Make sure Next.js dev server is running
```bash
cd squad-dashboard
npm run dev
```

### Tasks Not Auto-Completing

**Error:** "No tasks ready for auto-completion"
**Reason:** Tasks are still active (recent comments)
**Solution:** Wait for tasks to be inactive for 20+ minutes

### Tasks Stuck in Loop

**Error:** Task bouncing back and forth
**Solution:** Manual intervention needed
1. Check task in dashboard
2. Review agent comments
3. Approve or reject manually
4. Consider reassigning to different agent

## Advanced: Dry Run Mode

Test without making changes:
```bash
curl -X POST http://localhost:3000/api/auto-complete-tasks \
  -H "Content-Type: application/json" \
  -d "{\"dryRun\": true}"
```

Output:
```
[Auto-Complete] DRY RUN - No changes made
Tasks found: 5
Tasks to complete: 2
```

## Next Steps

1. ✅ **Start the auto-complete runner**
   ```bash
   cd squad-dashboard
   run-auto-complete.bat
   ```

2. ✅ **Check dashboard periodically**
   - Tasks will move to "Waiting Approval" automatically
   - Review agent work in comments
   - Approve or reject as needed

3. ✅ **Approved tasks auto-sync to Notion**
   - No manual sync needed
   - "View in Notion" link appears automatically

## Complete Workflow

```
Start auto-complete runner
         ↓
Tasks auto-move to "Waiting Approval"
         ↓
You review and approve tasks
         ↓
Tasks auto-sync to Notion ✨
         ↓
All agent work preserved in Notion!
```

## Why This Works

**The auto-complete API runs within Next.js environment:**
- Uses the same Supabase connection as the dashboard
- No DNS issues (shared network stack)
- Same environment variables
- Guaranteed to find and update your tasks

**Better than bot polling script:**
- Bot script: Needs to run continuously and has DNS issues
- Auto-complete: Runs within Next.js dev server, no DNS issues
- Simple, reliable, fast

## Summary

✅ **Auto-completes tasks** after 20+ minutes of inactivity
✅ **Runs continuously** - Every 5 minutes
✅ **No DNS issues** - Uses Next.js environment
✅ **Real-time logging** - Shows what's happening
✅ **Graceful shutdown** - Ctrl+C to stop
✅ **Easy to run** - One batch file or npm script

**Your squad agents will now automatically complete tasks and be ready for your review!** 🚀

## Files Created Today

1. `app/api/auto-complete-tasks/route.ts` - Auto-complete API
2. `scripts/run-auto-complete.js` - Continuous runner
3. `run-auto-complete.bat` - Windows batch file
4. `AUTO-COMPLETE-GUIDE.md` - This documentation
5. Updated `package.json` - Added `auto-complete` script

## Documentation

- **Notion Integration**: `NOTION-INTEGRATION.md`
- **Bot System**: `BOT-SYSTEM.md`
- **Bot Setup**: `BOT-SETUP.md`
- **Completed Tasks FAQ**: `COMPLETED-TASKS-FAQ.md`

**All squad automation systems are now complete and working!** ✨
