# Bot Polling System

Automated task processing system for Squad Dashboard agents.

## Overview

The bot polling system enables AI agents (Researcher, Builder, Copywriter, Marketer) to automatically:
- See tasks assigned to them
- Pick up "To Do" tasks
- Work on tasks
- Move tasks through the workflow
- Add comments to task chat history

## How It Works

### Architecture

```
┌─────────────────────────────────────────────┐
│         Bot Polling System               │
│         (runs every 2-3 min)         │
└─────────────────────────────────────────────┘
                    ↓
         ┌──────────────────┐
         │   Supabase DB   │
         └──────────────────┘
                    ↓
         ┌──────────────────┐
         │  Find tasks for │
         │  each agent     │
         └──────────────────┘
                    ↓
    ┌───────────┬───────────┬──────────┐
    │Researcher │ Builder   │Copywriter│ ...
    └───────────┴───────────┴──────────┘
                    ↓
         ┌──────────────────┐
         │  Process task   │
         │  Add comment   │
         │  Update status  │
         └──────────────────┘
```

### Task Workflow

1. **Task Created** (by Eric) → Status: `todo`
2. **Poll Run** → Bot finds "todo" task assigned to agent
3. **Agent Starts** → Status: `in_progress` + comment added
4. **Agent Works** → Process for 20-30 minutes
5. **Auto-Complete** → Status: `waiting_approval` (if no activity)
6. **Eric Approves** → Status: `completed`
7. **Or Eric Rejects** → Status: `in_progress` + bounce_count++

## Usage

### Run Once

```bash
cd squad-dashboard
npm run bot-poll
```

### Run Continuously (Every 2 minutes)

**Option 1 - Node.js version (recommended):**

```bash
cd squad-dashboard
npm run bot-start
```

**Option 2 - Windows Batch file:**

```bash
cd squad-dashboard
run-bot.bat
```

**Option 3 - Python version:**

```bash
cd squad-dashboard
npm run bot-start-py
```

**Option 1: Using a cron job**

```bash
# Add to crontab (crontab -e)
*/2 * * * * cd /path/to/squad-dashboard && npm run bot-poll >> bot-poll.log 2>&1
```

**Option 2: Using a simple loop script**

```bash
# Run indefinitely
while true; do
  npm run bot-poll
  sleep 120  # 2 minutes
done
```

**Option 3: Using PM2 (recommended for production)**

```bash
# Install PM2 globally
npm install -g pm2

# Start bot as PM2 process
pm2 start npm --name "squad-bot-poll" -- run bot-poll

# View logs
pm2 logs squad-bot-poll

# Stop
pm2 stop squad-bot-poll
```

## Agent Configurations

Each agent has:
- **System prompt** - Defines role, process, success criteria
- **SOP checklist** - Quality gates for task completion
- **Auto-complete logic** - Moves to "waiting_approval" after inactivity

### Researcher
- Role: Viral content research, competitor analysis
- Process: Search → Verify → Synthesize → Insights
- Success criteria: 3+ data points, actionable insights, sources cited

### Builder
- Role: Code, workflows, automation
- Process: Review → Build → Test → Document
- Success criteria: Working solution, documented, tested

### Copywriter
- Role: Posts, scripts, CTAs
- Process: Review guidelines → Draft → Proofread → Finalize
- Success criteria: Brand voice, engaging, clear CTA, proofread

### Marketer
- Role: Growth strategy, KPIs
- Process: Analyze → Strategy → KPIs → Timeline
- Success criteria: Data-driven, clear plan, measurable KPIs

## Monitoring

### Logs

The bot outputs to console:
- ✅ Tasks found and processed
- 🤖 Agent status changes
- ⚠️ Warnings and errors
- ❌ Failures

### Task Status

Check dashboard to see:
- Agent status cards (Squad view)
- Task board columns (Task Board view)
- Comment threads in task details

## Configuration

### Environment Variables

Required in `.env.local`:
```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
```

### Timing

- **Poll interval**: 2-3 minutes (recommended)
- **Task timeout**: 30 minutes in "in_progress" → check completion
- **Auto-complete**: 20 minutes since last agent comment → move to "waiting_approval"

## Troubleshooting

### Tasks not being picked up

1. Check Supabase connection:
   ```bash
   node scripts/check-supabase.js
   ```

2. Verify task has assigned_agent set to valid agent type

3. Check task status is "todo" (not "waiting_approval" or "completed")

### Agents stuck in "in_progress"

1. Check if started_at is recent
2. Check bounce_count (3+ → blocked)
3. Manual intervention may be needed:
   - Reject task → sends back to agent
   - Or change status manually in Supabase

### Polling script errors

1. Verify environment variables
2. Check Supabase credentials
3. Review console logs for specific errors

## Next Steps

### Current Implementation (v1)

- Simulated agent work (auto-updates)
- Basic task processing
- Auto-complete logic based on inactivity
- Comment updates

### Future Enhancements (v2)

- **Real LLM integration**: Spawn actual sub-agent sessions via `sessions_spawn`
- **Task-specific prompts**: Include task details in system prompt
- **Context integration**: Access brand guidelines from context storage
- **SOP enforcement**: Check checklist items before auto-complete
- **Quality gates**: Run checklists before moving to "waiting_approval"
- **Human escalation**: Alert Eric after 3+ bounces automatically

## Files

- `scripts/bot-poll.js` - Main polling script
- `package.json` - Added `bot-poll` script command
- `BOT-SYSTEM.md` - This documentation

## Example Output

```
============================================================
  🤖 Squad Bot Polling System
============================================================

🔄 Starting bot poll...

📊 Found 3 task(s) to process.

🤖 Processing Researcher (🧪)
   Tasks: 1

   📋 Task: "Research viral YouTube shorts"
      Status: todo
      Priority: high
      🚀 Spawning Researcher to start task...
      ✅ Researcher started working
🤖 Processing Builder (⚡)
   Tasks: 1

   📋 Task: "Build YouTube analytics dashboard"
      Status: todo
      Priority: normal
      🚀 Spawning Builder to start task...
      ✅ Builder started working

✨ Poll complete!

============================================================
  ✅ Poll complete at 2026-02-12T10:53:01.721Z
============================================================
```
