# Proactive Agent Manager - Complete Guide

**Your new proactive agent management system is ready!** 🚀

## What This Does

The proactive system automatically:
1. **Auto-spawns agents** when tasks are assigned (every 30 seconds)
2. **Monitors progress** of all in-progress tasks (every 5 minutes)
3. **Reports status** to you automatically - no need to ask
4. **Detects completion** and alerts you when tasks finish
5. **Warns** if agents aren't making progress (15+ minutes)

## How It Works

```
You create task (in Squad Dashboard)
         ↓
Auto-spawner detects "todo" task (30 sec)
         ↓
Spawns real sub-agent session
         ↓
Task moves to "in_progress"
         ↓
Task monitor checks progress (5 min)
         ↓
Reports status to you automatically
         ↓
Agent completes task
         ↓
Task moves to "Waiting Approval"
         ↓
Task monitor detects completion
         ↓
Alerts you: "TASK READY FOR REVIEW"
         ↓
You approve task
         ↓
Task auto-syncs to Notion ✨
```

## Quick Start

**Run the Proactive Agent Manager:**

```bash
cd squad-dashboard
proactive-agent-manager.bat
```

**That's it!** One command starts everything.

## What You'll See

### Console Output:

```
============================================================
  Proactive Squad Agent Manager
============================================================

This system manages your squad agents proactively:
   - Auto-spawns agents when tasks are assigned
   - Monitors progress automatically
   - Reports status every 5 minutes
   - Alerts when tasks complete

===========================================================
   Starting systems...
===========================================================

🚀 Starting continuous agent spawning...
Checking for new tasks every 30 seconds.
Press Ctrl+C to stop.

[Spawner runs in background]

===========================================================
  Task Monitor Active - Proactive Updates
===========================================================

🔍 Monitoring in-progress tasks...
Checking task status every 5 minutes.
Press Ctrl+C to stop.
```

### Every 5 Minutes:

**Status Report:**
```
📊 Found 2 active task(s):

🧪 RESEARCHER: 1 task(s)
   Status: IN_PROGRESS
   Time since update: 3 min
   Last agent comment: 8 min ago
   ✅ Agent is active and reporting progress

✍️ COPYWRITER: 1 task(s)
   Status: IN_PROGRESS
   Time since update: 12 min
   Last agent comment: 2 min ago
   ✅ Agent is active and reporting progress

============================================================
  Summary:
============================================================
  In Progress: 2
  Waiting Approval: 0
  Total Active: 2
```

### When Task Completes:

```
✅ TASK COMPLETED!
   "10-Minute YouTube Video Script..."
   Status: WAITING_APPROVAL
   Agent: COPYWRITER
   Completed: 1:35 PM

   Next step: Review tasks and approve/reject

============================================================
  Summary:
============================================================
  In Progress: 1
  Waiting Approval: 1
  Total Active: 2

  📋 Tasks ready for approval:
     • "10-Minute YouTube Video Script: Prompt Engineering A-Z Guide"

  Action: Review tasks and approve/reject
```

### Warnings:

If an agent hasn't commented in 15+ minutes:

```
   ⚠️ WARNING: No progress for 18 minutes!
   Agent should report progress every 10 minutes.
   Task is still in progress - RESEARCHER is working on it.
```

## Files Created

1. **auto-spawn-agents.js** - Auto-spawns agents every 30 seconds
2. **task-monitor.js** - Monitors progress every 5 minutes
3. **proactive-agent-manager.bat** - Combined launcher (runs both together)

## What Changed

**Before:**
- Manual agent spawning required
- Had to ask for progress updates
- No automatic status reports
- Tasks could get stuck without detection

**After:**
- Agents auto-spawn when tasks assigned
- Automatic progress reports every 5 minutes
- Proactive completion alerts
- Task stuck detection (15+ min no progress)
- One command to manage everything

## Your New Workflow

### Old Way (Manual):
```
1. Create task in dashboard
2. Run bot-poll manually to spawn agent
3. Manually check progress by asking "how's it going?"
4. Wait and hope agent completes
5. Check if task moved to "Waiting Approval"
6. Approve task
```

### New Way (Proactive):
```
1. Create task in dashboard
   ↓
2. Auto-spawner detects task (30 seconds later)
   ↓
3. Agent spawned automatically and starts working
   ↓
4. Task monitor reports status every 5 minutes (automatic!)
   ↓
5. Agent completes, task moves to "Waiting Approval"
   ↓
6. You get alert: "TASK READY FOR REVIEW" (automatic!)
   ↓
7. Review and approve task
   ↓
8. Task auto-syncs to Notion ✨
```

## What You Need to Do

### Setup (One Time):

1. **Start the Proactive Agent Manager:**
   ```bash
   cd squad-dashboard
   proactive-agent-manager.bat
   ```

2. **Keep it running:**
   - Leave the console window open
   - Both systems run automatically
   - Stop with Ctrl+C when done for the day

### Daily Usage:

**Just run it once** each time you start working:
```bash
cd squad-dashboard
proactive-agent-manager.bat
```

**Keep it running** while you're working with squad agents.

## What Gets Reported to You

Every 5 minutes, you'll see:

✅ **Active agents working** (who's doing what)
✅ **Task status updates** (how long they've been working)
✅ **Progress warnings** (if agents are stuck)
✅ **Completion alerts** (when tasks ready for review)
✅ **Summary reports** (total tasks, approvals needed)

**No more asking "how's it going?"** - updates come to you! 🎉

## Example Timeline

**8:00 AM** - You create task in dashboard
**8:00:30 AM** - Auto-spawner detects task (30 sec later)
**8:00:30 AM** - Researcher spawned automatically
**8:05:00 AM** - Task monitor: "Researcher working, 4 min ago"
**8:10:00 AM** - Task monitor: "Researcher working, 9 min ago"
**8:15:00 AM** - Task monitor: "Researcher working, 14 min ago"
**8:20:00 AM** - Task monitor: "Researcher working, 19 min ago"
**8:25:00 AM** - Task monitor: "Researcher working, 24 min ago"
**8:30:00 AM** - Task monitor: "✅ TASK COMPLETED! Ready for review"
**8:30:01 AM** - You get completion alert automatically
**8:35:00 AM** - You review and approve task
**8:35:01 AM** - Task auto-syncs to Notion

**Total time from task creation to completion: 30 minutes with zero manual intervention!** 🚀

## Benefits

### For You:
- ✅ **Automatic** - No manual spawning required
- ✅ **Proactive** - Status updates come to you, not the other way
- ✅ **Monitoring** - 5-minute checks on all tasks
- ✅ **Alerts** - Know when tasks complete without asking
- ✅ **Visibility** - Always see what's happening
- ✅ **Time saving** - Focus on your work, not managing agents

### For Agents:
- ✅ **Automatic start** - No waiting for bot-poll
- ✅ **Session tracking** - Every session is linked and monitored
- ✅ **Progress reporting** - 10-minute requirement enforced
- ✅ **Stuck detection** - Warning after 15 min no progress
- ✅ **Completion detection** - Auto-move to "Waiting Approval"

## Advanced: Cron Job

For fully automated operation (runs even when you're offline), set up a cron job:

```bash
# Runs every 30 seconds, checks for tasks, spawns agents
*/30 * * * * * cd /c/Users/ericc/clawd/squad-dashboard && node auto-spawn-agents.js

# Runs every 5 minutes, monitors progress
*/5 * * * * * cd /c/Users/ericc/clawd/squad-dashboard && node task-monitor.js
```

## Troubleshooting

**Agents not spawning:**
- Check console for error messages
- Verify Supabase connection
- Ensure no duplicate sessions

**No status updates:**
- Task monitor might not be running
- Check if task-monitor.js process is active
- Look for "Task Monitor Active" in console

**Tasks stuck in "todo":**
- Auto-spawner might not be running
- Check for "Auto-spawning agents now" in console
- Restart proactive-agent-manager.bat

## Next Steps

1. ✅ **Start proactive-agent-manager.bat**
2. ✅ **Create a task** in Squad Dashboard
3. ✅ **Watch console** for automatic status updates
4. ✅ **Review tasks** when alerted to "Ready for Approval"
5. ✅ **Approve** and watch Notion auto-sync ✨

**Your squad agents now work proactively with zero manual intervention!** 🚀
