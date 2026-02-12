-- Squad Dashboard PM System Migration
-- Run this in Supabase SQL Editor: https://supabase.com/dashboard/project/YOUR-PROJECT/sql/new-editor

-- 1. Create tasks table
CREATE TABLE IF NOT EXISTS tasks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title TEXT NOT NULL,
  description TEXT,
  status TEXT NOT NULL DEFAULT 'todo',
  assigned_agent TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  started_at TIMESTAMP WITH TIME ZONE,
  completed_at TIMESTAMP WITH TIME ZONE,
  parent_task_id UUID REFERENCES tasks(id),
  priority TEXT DEFAULT 'normal',
  bounce_count INTEGER DEFAULT 0,
  requires_approval BOOLEAN DEFAULT FALSE,
  approved_by TEXT,
  approval_comment TEXT,
  project_id TEXT,
  chat_history JSONB DEFAULT '[]'::jsonb,
  checklist JSONB DEFAULT '[]'::jsonb,
  context_refs TEXT[] DEFAULT ARRAY[]::TEXT[],
  tags TEXT[] DEFAULT ARRAY[]::TEXT[],
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_tasks_status ON tasks(status);
CREATE INDEX IF NOT EXISTS idx_tasks_agent ON tasks(assigned_agent);
CREATE INDEX IF NOT EXISTS idx_tasks_project ON tasks(project_id);
CREATE INDEX IF NOT EXISTS idx_tasks_parent ON tasks(parent_task_id);
CREATE INDEX IF NOT EXISTS idx_tasks_created ON tasks(created_at DESC);

-- 2. Create projects table
CREATE TABLE IF NOT EXISTS projects (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  manager_agent TEXT DEFAULT 'chris',
  context_refs TEXT[] DEFAULT ARRAY[]::TEXT[],
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);

-- 3. Create contexts table
CREATE TABLE IF NOT EXISTS contexts (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  type TEXT NOT NULL,
  content TEXT NOT NULL,
  project_id UUID REFERENCES projects(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_contexts_project ON contexts(project_id);
CREATE INDEX IF NOT EXISTS idx_contexts_type ON contexts(type);

-- 4. Create sops table
CREATE TABLE IF NOT EXISTS sops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  agent TEXT NOT NULL,
  steps JSONB NOT NULL,
  version TEXT DEFAULT '1.0',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  metadata JSONB DEFAULT '{}'::jsonb
);

CREATE INDEX IF NOT EXISTS idx_sops_agent ON sops(agent);

-- 5. Insert default projects
INSERT INTO projects (name, description, status)
SELECT 'YouTube Growth', 'Grow new YouTube channel with AI productivity content', 'active'
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE name = 'YouTube Growth');

INSERT INTO projects (name, description, status)
SELECT 'LinkedIn Content', 'AI productivity content for project managers', 'active'
WHERE NOT EXISTS (SELECT 1 FROM projects WHERE name = 'LinkedIn Content');

-- 6. Insert default SOPs
INSERT INTO sops (name, agent, steps)
SELECT 'Research Task Checklist', 'researcher', '[
  {"id": 1, "text": "Understand task requirements", "completed": false},
  {"id": 2, "text": "Search for relevant data and trends", "completed": false},
  {"id": 3, "text": "Verify sources", "completed": false},
  {"id": 4, "text": "Synthesize findings", "completed": false},
  {"id": 5, "text": "Provide actionable insights", "completed": false}
]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM sops WHERE name = 'Research Task Checklist');

INSERT INTO sops (name, agent, steps)
SELECT 'Builder Task Checklist', 'builder', '[
  {"id": 1, "text": "Review requirements", "completed": false},
  {"id": 2, "text": "Build solution", "completed": false},
  {"id": 3, "text": "Write documentation", "completed": false},
  {"id": 4, "text": "Test if possible", "completed": false},
  {"id": 5, "text": "Provide deployment instructions", "completed": false}
]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM sops WHERE name = 'Builder Task Checklist');

INSERT INTO sops (name, agent, steps)
SELECT 'Copywriter Task Checklist', 'copywriter', '[
  {"id": 1, "text": "Review brand guidelines", "completed": false},
  {"id": 2, "text": "Draft copy", "completed": false},
  {"id": 3, "text": "Strong hook/opening", "completed": false},
  {"id": 4, "text": "Clear CTA", "completed": false},
  {"id": 5, "text": "Proofread", "completed": false}
]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM sops WHERE name = 'Copywriter Task Checklist');

INSERT INTO sops (name, agent, steps)
SELECT 'Marketer Task Checklist', 'marketer', '[
  {"id": 1, "text": "Analyze data and metrics", "completed": false},
  {"id": 2, "text": "Develop strategy", "completed": false},
  {"id": 3, "text": "Set measurable KPIs", "completed": false},
  {"id": 4, "text": "Create timeline", "completed": false},
  {"id": 5, "text": "Provide actionable recommendations", "completed": false}
]'::jsonb
WHERE NOT EXISTS (SELECT 1 FROM sops WHERE name = 'Marketer Task Checklist');

-- 7. Enable RLS (Row Level Security)
ALTER TABLE tasks ENABLE ROW LEVEL SECURITY;
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;
ALTER TABLE contexts ENABLE ROW LEVEL SECURITY;
ALTER TABLE sops ENABLE ROW LEVEL SECURITY;

-- 8. Create RLS policies (public read/write for now, tighten later)
CREATE POLICY "Public read access for tasks" ON tasks FOR SELECT USING (true);
CREATE POLICY "Public write access for tasks" ON tasks FOR ALL USING (true);

CREATE POLICY "Public read access for projects" ON projects FOR SELECT USING (true);
CREATE POLICY "Public write access for projects" ON projects FOR ALL USING (true);

CREATE POLICY "Public read access for contexts" ON contexts FOR SELECT USING (true);
CREATE POLICY "Public write access for contexts" ON contexts FOR ALL USING (true);

CREATE POLICY "Public read access for sops" ON sops FOR SELECT USING (true);
CREATE POLICY "Public write access for sops" ON sops FOR ALL USING (true);

-- Migration complete!
