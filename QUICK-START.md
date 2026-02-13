# Proactive Agent Manager - Quick Reference

**Start in ONE command:**

```bash
cd squad-dashboard
proactive-agent-manager.bat
```

**That's it!** Everything runs automatically from there.

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

Press Ctrl+C to stop.
===========================================================
   Starting systems...
===========================================================

[Two systems running - both stay active]

🔍 Monitoring in-progress tasks...
Checking task status every 5 minutes.
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

## Warnings (If No Progress):

```
   ⚠️ WARNING: No progress for 18 minutes!
   Agent should report progress every 10 minutes.
   Task is still in progress - RESEARCHER is working on it.
```

## Daily Workflow:

**Morning:**
```
1. Open terminal
2. cd squad-dashboard
3. proactive-agent-manager.bat
4. Keep terminal open while you work
5. Create tasks in Squad Dashboard
6. Watch for automatic status updates
```

**Evening:**
```
1. Press Ctrl+C to stop (or leave running overnight)
2. Review completed tasks
3. Approve/reject as needed
```

## Summary

✅ **Automatic** - Agents spawn themselves when you create tasks
✅ **Proactive** - Status updates come to you every 5 minutes
✅ **Alerts** - Know when tasks complete without asking
✅ **Monitoring** - See who's working and for how long
✅ **Zero manual work** - Focus on your work, not managing agents

**One command starts everything!** 🚀

## Files

- `proactive-agent-manager.bat` - Combined launcher (runs both systems)
- `auto-spawn-agents.js` - Auto-spawns agents every 30 seconds
- `task-monitor.js` - Monitors progress every 5 minutes
- `PROACTIVE-AGENT-MANAGER.md` - Complete guide

## Need More Details?

See `PROACTIVE-AGENT-MANAGER.md` for full documentation.
