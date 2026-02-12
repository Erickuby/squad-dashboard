# Bot System - Complete Setup Guide

The squad bot polling system is now fully functional and ready to run!

## What Was Built

### 1. Bot Polling Script (`scripts/bot-poll.js`)
- Polls Supabase every time it's run
- Finds tasks assigned to agents
- Groups tasks by agent type
- Processes each task (spawn → start work → complete)
- Handles errors and updates status

### 2. Continuous Runners

**Option A - Node.js Version (Recommended)**
```bash
npm run bot-start
```
- `scripts/start-bot-node.js`
- Runs indefinitely
- Polls every 2 minutes
- Graceful shutdown on Ctrl+C

**Option B - Windows Batch File**
```bash
run-bot.bat
```
- `run-bot.bat`
- Simple Windows batch loop
- Polls every 2 minutes
- Ctrl+C to stop

**Option C - Python Version**
```bash
npm run bot-start-py
```
- `scripts/start-bot.py`
- Cross-platform Python script
- Runs indefinitely
- Graceful shutdown on Ctrl+C

### 3. Agent System Prompts

Each agent has a dedicated configuration:

**Researcher** 🧪
- Role: Viral content research, competitor analysis
- Process: Search → Verify → Synthesize → Insights
- Success criteria: 3+ data points, actionable insights

**Builder** ⚡
- Role: Code, workflows, automation
- Process: Review → Build → Test → Document
- Success criteria: Working solution, documented

**Copywriter** ✍️
- Role: Posts, scripts, CTAs
- Process: Review guidelines → Draft → Proofread → Finalize
- Success criteria: Brand voice, engaging, clear CTA

**Marketer** 📈
- Role: Growth strategy, KPIs
- Process: Analyze → Strategy → KPIs → Timeline
- Success criteria: Data-driven, clear plan, measurable KPIs

## How It Works

### Workflow

```
┌─────────────────────┐
│   Eric creates     │
│     task         │
└────────┬──────────┘
         │
         ↓
    ┌────────┐
    │  Task  │
    │  Board │
    │(todo) │
    └───┬────┘
        │
        ↓ (bot poll every 2 min)
┌───────────────────────────────────┐
│  Bot finds task assigned to     │
│  Researcher/Builder/...         │
└────────────┬──────────────────────┘
             ↓
    ┌─────────────┬──────────────┐
    │  Start work │ Add comment  │
    └──────┬──────┴──────────────┘
           ↓
┌──────────────────────────────────────────┐
│  Task status: todo → in_progress   │
│  Agent adds work to chat_history      │
└──────────────────────────────────────────┘
             ↓ (after 20-30 min)
┌──────────────────────────────────────────┐
│  Task status: in_progress →         │
│  waiting_approval                  │
│  Ready for Eric to review!          │
└──────────────────────────────────────────┘
             ↓
┌──────────────────────────────────────────┐
│  Eric approves → completed           │
│  Eric rejects → in_progress          │
│  (bounce_count++)                 │
└──────────────────────────────────────────┘
```

### Auto-Complete Logic

After 20-30 minutes of inactivity:
- Bot checks last agent comment time
- If > 20 min ago since last comment
- Auto-move task to "waiting_approval"
- Task ready for Eric's approval

## Usage

### Quick Start (Windows)

```bash
cd squad-dashboard
run-bot.bat
```

### Quick Start (Mac/Linux)

```bash
cd squad-dashboard
npm run bot-start
```

### Stop Bot

Press `Ctrl+C` to stop gracefully.

The bot will:
1. Complete current poll
2. Log total polls completed
3. Exit cleanly

## Monitoring

### Check Dashboard

**Squad View:**
- Agent status cards update in real-time
- "Working" → Agent has active task
- "Review" → Task awaiting approval
- "Available" → Agent ready for new task

**Task Board View:**
- Tasks move between columns automatically
- Comments appear in real-time
- Status updates reflect immediately

### Check Logs

Bot outputs to console:
- ✅ Tasks found and processed
- 🤖 Agent status changes
- ⚠️ Warnings and errors
- ❌ Failures

## Troubleshooting

### Bot not picking up tasks

1. **Check task assignment:**
   - Task has `assigned_agent` set to valid agent type?
   - Task status is "todo"?

2. **Check bot is running:**
   - Console should show "Poll #X" every 2 minutes
   - No error messages

3. **Check dashboard:**
   - Switch to Task Board view
   - Task should appear in "In Progress" column
   - Switch to Squad view
   - Agent should show "Working"

### Tasks stuck in "in_progress"

1. **Check last poll time:**
   - Bot should poll every 2 minutes
   - Check console logs

2. **Check auto-complete timer:**
   - Tasks auto-complete after 20-30 min of inactivity
   - Add comments to reset timer

3. **Manual intervention:**
   - Approve/reject to unstick task
   - Or edit task status directly in Supabase

### Bot errors

1. **Check Supabase connection:**
   - Environment variables set correctly?
   - Network connectivity OK?

2. **Check credentials:**
   - NEXT_PUBLIC_SUPABASE_URL correct?
   - NEXT_PUBLIC_SUPABASE_ANON_KEY valid?

3. **Check logs:**
   - Read console error messages
   - Check specific error details

## Next Steps

### Current Status (v1)

✅ Bot polling system complete
✅ Agents automatically pick up tasks
✅ Auto-complete logic based on inactivity
✅ Error handling and status updates
✅ Multiple runner options (Node.js, Python, Batch)
✅ Squad view syncs with Task Board

### Future Enhancements (v2)

- **Real LLM integration** via `sessions_spawn`
- **Task-specific prompts** including task details
- **Context integration** accessing brand guidelines
- **SOP enforcement** checking checklist items
- **Quality gates** running checklists before auto-complete
- **Human escalation** after 3 bounces automatically

## Files

- `scripts/bot-poll.js` - Main polling logic
- `scripts/start-bot-node.js` - Node.js continuous runner
- `scripts/start-bot.py` - Python continuous runner
- `run-bot.bat` - Windows batch runner
- `package.json` - Script commands
- `BOT-SYSTEM.md` - Complete documentation

## Example Output

```
============================================================
  Starting Squad Bot Polling System
============================================================
  Polling every 120 seconds...
  Press Ctrl+C to stop.

  Poll #1 | 10:59:00 AM
--------------------------------------------------------------

📊 Found 3 task(s) to process.

🤖 Processing Researcher (🧪)
   Tasks: 1
   📋 Task: "Research viral YouTube shorts"
      Status: todo
      Priority: high
      🚀 Spawning Researcher to start task...
      ✅ Researcher started working

  Poll #2 | 11:01:00 AM
--------------------------------------------------------------

📊 Found 3 task(s) to process.

🤖 Processing Researcher (🧪)
   Tasks: 1
   📋 Task: "Research viral YouTube shorts"
      Status: in_progress
      Priority: high
      (already working)

✨ Poll complete!
```

The bot system is fully functional and ready to automate your squad! 🚀
