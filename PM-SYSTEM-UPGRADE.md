# Squad Dashboard PM System Upgrade

## Goal
Upgrade squad dashboard from status tracker to full Project Management system with:
- Role-based multi-agent orchestration
- Task database with comment threads
- Approval gates
- Error detection
- Context storage
- Telegram integration

---

## Phase 1: Database Schema

### Supabase Tables

#### 1. `tasks` (Main task database)
```sql
CREATE TABLE tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL, -- 'todo', 'in_progress', 'waiting_approval', 'completed', 'failed'
  assigned_agent TEXT, -- 'researcher', 'builder', 'copywriter', 'marketer', 'manager'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  started_at TIMESTAMP,
  completed_at TIMESTAMP,
  parent_task_id UUID REFERENCES tasks(id), -- Subtasks
  priority TEXT DEFAULT 'normal', -- 'low', 'normal', 'high', 'urgent'
  bounce_count INTEGER DEFAULT 0, -- Error loop detection
  requires_approval BOOLEAN DEFAULT FALSE,
  approved_by TEXT, -- 'eric' (human approval)
  approval_comment TEXT,
  project_id TEXT, -- 'youtube-growth', 'linkedin-content', etc.
  chat_history JSONB, -- Comment thread
  checklist JSONB, -- SOP checklist items
  context_refs TEXT[], -- Links to context documents
  tags TEXT[],
  metadata JSONB
);

CREATE INDEX idx_tasks_status ON tasks(status);
CREATE INDEX idx_tasks_agent ON tasks(assigned_agent);
CREATE INDEX idx_tasks_project ON tasks(project_id);
CREATE INDEX idx_tasks_parent ON tasks(parent_task_id);
```

#### 2. `projects` (Project containers)
```sql
CREATE TABLE projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active', -- 'active', 'paused', 'completed'
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  manager_agent TEXT DEFAULT 'chris',
  context_refs TEXT[], -- Links to docs, brand guidelines
  metadata JSONB
);
```

#### 3. `contexts` (Context storage)
```sql
CREATE TABLE contexts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL, -- 'brand_guideline', 'sop', 'document', 'template'
  content TEXT NOT NULL,
  project_id UUID REFERENCES projects(id),
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  metadata JSONB
);

CREATE INDEX idx_contexts_project ON contexts(project_id);
CREATE INDEX idx_contexts_type ON contexts(type);
```

#### 4. `sops` (Standard Operating Procedures)
```sql
CREATE TABLE sops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  agent TEXT NOT NULL, -- 'researcher', 'builder', 'copywriter', 'marketer'
  steps JSONB NOT NULL, -- Array of checklist items
  version TEXT DEFAULT '1.0',
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW(),
  metadata JSONB
);

CREATE INDEX idx_sops_agent ON sops(agent);
```

---

## Phase 2: Task States & Transitions

```
[TODO]
    ↓ (Manager assigns)
[IN_PROGRESS]
    ↓ (Bot completes work, requires approval)
[WAITING_APPROVAL]
    ↓ (Eric approves)
[COMPLETED]
    ↓ (Quality check fails, send back)
[IN_PROGRESS] (with bounce_count++)

Or:

[IN_PROGRESS]
    ↓ (Error/loop detected)
[FAILED]
    ↓ (Eric intervenes)
[IN_PROGRESS]
```

### Status Definitions
- **todo**: Task created, awaiting assignment
- **in_progress**: Assigned agent working on it
- **waiting_approval**: Bot completed, awaiting human approval
- **completed**: Approved and finalized
- **failed**: Error, requires intervention

---

## Phase 3: Role-Based System Prompts

### Manager Bot (Chris)
```markdown
You are Chris, the Project Manager and Squad Lead.

Your role:
1. Receive high-level commands from Eric
2. Break down complex requests into specific, actionable tasks
3. Assign tasks to the correct specialist bot
4. Monitor progress and detect blockers
5. Coordinate handoffs between team members
6. Request Eric approval for critical actions
7. Update squad-state.json to reflect current status

Tone:
- Direct, no fluff
- Proactive and opinionated
- When blockers detected, escalate immediately
- Never say "I'll try" - take action

Tools available:
- Create tasks in Supabase
- Update task status
- Assign tasks to specialists
- Sync to squad dashboard
- Send Telegram notifications to Eric
- Access context documents and SOPs

Rules:
- Every task must have clear success criteria
- Always check if similar tasks exist before creating new ones
- Set approval gates for high-impact tasks
- If a task bounces 3+ times, escalate to Eric
- Update squad state after every significant action
```

### Researcher Bot
```markdown
You are the Researcher. You find insights, trends, and data.

Your role:
1. Viral content research (LinkedIn, YouTube, TikTok)
2. Competitor analysis
3. Market trend identification
4. Data gathering and synthesis
5. Fact-checking and verification

Process:
1. Read task description from Supabase
2. Research using web search and content analysis
3. Document findings in comment thread
4. Provide actionable insights (not just raw data)
5. Mark as 'waiting_approval' when done

Success criteria:
- At least 3 concrete data points
- Actionable insights, not just observations
- Sources cited
- Next steps suggested
```

### Builder Bot
```markdown
You are the Builder. You build tools, workflows, and code.

Your role:
1. n8n workflow automation
2. Scripting and coding
3. API integrations
4. Tool development
5. Technical problem solving

Process:
1. Read task description from Supabase
2. Review any attached specs or comments
3. Build solution (code, workflow, or config)
4. Test locally if possible
5. Document in comment thread
6. Mark as 'waiting_approval'

SOP Checklist (must complete before approval):
- [ ] Solution meets requirements
- [ ] Code is clean and documented
- [ ] Error handling in place
- [ ] Tested (if applicable)
- [ ] Deployment instructions provided

Success criteria:
- Working solution
- Clear documentation
- Error handling present
- Ready for production
```

### Copywriter Bot
```markdown
You are the Copywriter. You write compelling copy that converts.

Your role:
1. LinkedIn posts and hooks
2. Video scripts and titles
3. Email sequences
4. Landing page copy
5. CTAs and taglines

Process:
1. Read task description from Supabase
2. Review brand guidelines from context storage
3. Draft copy
4. Iterate based on feedback
5. Finalize and mark as 'waiting_approval'

SOP Checklist:
- [ ] Matches brand tone
- [ ] Strong hook/opening
- [ ] Clear CTA
- [ ] Optimized for platform
- [ ] Proofread

Success criteria:
- Brand voice consistent
- Engaging and relevant
- Clear call to action
- Platform-appropriate format
```

### Marketer Bot
```markdown
You are the Marketer. You grow audience and drive engagement.

Your role:
1. Growth strategy development
2. Channel optimization
3. Audience analysis
4. Collaboration opportunities
5. KPI tracking and optimization

Process:
1. Read task description from Supabase
2. Analyze data and metrics
3. Develop strategy or recommendations
4. Document with timelines and KPIs
5. Mark as 'waiting_approval'

Success criteria:
- Data-driven recommendations
- Clear action plan
- Measurable KPIs
- Timeline included
```

---

## Phase 4: Comment Thread Format

```json
{
  "chat_history": [
    {
      "author": "chris",
      "role": "manager",
      "message": "Task created: Research top 10 viral AI productivity videos",
      "timestamp": "2026-02-12T09:00:00Z"
    },
    {
      "author": "researcher",
      "role": "agent",
      "message": "Found 8 videos with 100K+ views. Key themes: automation tools, time-saving hacks, AI assistants.",
      "timestamp": "2026-02-12T09:30:00Z"
    },
    {
      "author": "researcher",
      "role": "agent",
      "message": "Completed research. Key findings:\n- Average length: 45s\n- Most viral format: 'X tools to do Y faster'\n- Best time: Tuesday 6pm EST\n\nReady for review.",
      "timestamp": "2026-02-12T09:45:00Z"
    },
    {
      "author": "eric",
      "role": "human",
      "message": "Approved. Great insights. Let's move to Copywriter for hook development.",
      "timestamp": "2026-02-12T09:50:00Z"
    }
  ]
}
```

---

## Phase 5: Approval Gates

### High-Impact Tasks (Require Approval)
- Publishing content (email blasts, social posts)
- Code deployment to production
- Sending large volumes of messages
- External API calls with side effects
- Budget/spending actions

### Approval Flow
```
Bot completes task → status: 'waiting_approval'
↓
Telegram notification to Eric: "Task X requires approval. View: [link]"
↓
Eric reviews (dashboard or reply to Telegram)
↓
Eric: "approve" → status: 'completed'
Eric: "reject" → status: 'in_progress' + bounce_count++
Eric: "comment" → Add to chat_history, stay in 'waiting_approval'
```

### Telegram Commands
- `/approve <task-id>` - Approve task
- `/reject <task-id> [reason]` - Reject and send back
- `/task <task-id>` - View task details
- `/tasks [agent]` - List tasks (all or filtered by agent)

---

## Phase 6: Error & Loop Detection

### Bounce Counter Logic
```typescript
if (task.status === 'in_progress' && previousStatus === 'waiting_approval') {
  task.bounce_count++;
  if (task.bounce_count >= 3) {
    // Escalate to Eric
    notifyEric(`Task ${task.id} stuck in loop (${task.bounce_count} bounces). Manual intervention required.`);
    task.status = 'failed';
  }
}
```

### Error Conditions
- Same error message 2+ times
- Task in 'in_progress' > 2 hours without comment
- Bot crashes or times out
- Checklist items failing repeatedly

---

## Phase 7: Context Storage (RAG)

### Document Types
1. **Brand Guidelines**: Voice, tone, style rules
2. **SOPs**: Checklists for each bot type
3. **Project Docs**: Project-specific context
4. **Templates**: Reusable formats
5. **Knowledge Base**: Facts, links, references

### Bot Context Access
```typescript
async function getContextForTask(task: Task, agentType: string): Promise<string[]> {
  const contexts = await supabase
    .from('contexts')
    .select('*')
    .eq('project_id', task.project_id)
    .or(`type.eq.brand_guideline,type.eq.sop,type.eq.${agentType}_sop`);

  return contexts.map(c => c.content);
}
```

---

## Phase 8: Dashboard UI Updates

### New Components
1. **Task Board** (Kanban-style)
   - Columns: Todo, In Progress, Waiting Approval, Completed, Failed
   - Drag-and-drop task movement
   - Task cards with status, assignee, comments preview

2. **Task Detail Modal**
   - Full task description
   - Comment thread (scrollable)
   - Approval button (for waiting_approval tasks)
   - Checklist status
   - Related documents links
   - Bounce counter

3. **Project Selector**
   - Filter tasks by project
   - Project overview cards

4. **Context Viewer**
   - Browse documents in context storage
   - Upload new context

5. **SOP Editor**
   - Create/edit checklists per bot
   - Version history

### Updated Agent Cards
- Add "Current Tasks" count per agent
- Show bounce counter if stuck
- Quick link to agent's active tasks

---

## Implementation Plan

### Step 1: Database Setup (Today)
- Create Supabase tables
- Set up RLS policies
- Migrate existing squad-state data

### Step 2: Dashboard UI Updates (Today + Tomorrow)
- Task board component
- Task detail modal
- Approval buttons
- Comment thread UI

### Step 3: Bot Integration (This Week)
- Update system prompts
- Create polling mechanism
- Implement comment thread logic

### Step 4: Telegram Integration (This Week)
- Approval notifications
- Command handlers
- Task status updates

### Step 5: Context Storage & SOPs (Next Week)
- Document upload interface
- SOP editor
- RAG implementation

### Step 6: Testing & Refinement (Ongoing)
- End-to-end testing
- Bug fixes
- Performance optimization

---

## Next Steps

**Right now:**
1. Create Supabase migration script
2. Test table creation
3. Migrate existing tasks to new schema
4. Update dashboard API routes

**After that:**
5. Build task board UI
6. Add approval gates
7. Implement Telegram notifications

**Ready to start!**
