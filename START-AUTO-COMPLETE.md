# Quick Start - Auto-Complete Runner

## Where to Run

**Run in Command Prompt or PowerShell:**

Open terminal and navigate to your squad-dashboard folder, then run:

```bash
cd squad-dashboard
start-auto-complete.bat
```

## Location

The batch file is located at:
```
C:\Users\ericc\clawd\squad-dashboard\start-auto-complete.bat
```

## What It Does

1. **Changes to squad-dashboard directory**
2. **Starts auto-complete runner**
3. **Polls every 5 minutes**
4. **Auto-completes tasks** after 20+ min of inactivity
5. **Shows real-time progress** in console

## Quick Alternative (If you want to use npm)

```bash
cd squad-dashboard
npm run auto-complete
```

Both do the same thing - pick whichever you prefer!

## What to Expect

```
============================================================
  🤖 Squad Auto-Complete Runner
============================================================

  Polling http://localhost:3000/api/auto-complete-tasks
  Interval: Every 5 minutes
  Press Ctrl+C to stop.

─────────────────────────────────────────────────────
  🔄 Poll #1 | 2:17:00 PM
─────────────────────────────────────────────────────

✅ Auto-completed 5 task(s)
   Tasks found: 5
   Tasks completed: 5

   Tasks moved to "Waiting Approval":

   1. 🧪 Research viral YouTube shorts
   2. ⚡ Build YouTube analytics dashboard
   3. ✍️ Write 10 hooks for YouTube shorts
   4. 📈 Do a Market Researcher...

   ⏰ Next poll in 5 minutes...
```

## After Running

1. **Open dashboard:** http://localhost:3000
2. **Watch "Waiting Approval" column**
3. **Approve tasks** when ready
4. **Watch Notion sync** happen automatically!

**Run `start-auto-complete.bat` now!** 🚀
