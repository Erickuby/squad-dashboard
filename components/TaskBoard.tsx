'use client';

import { useState, useEffect } from 'react';
import { Task, Project } from '@/types/squad';
import { supabase } from '@/lib/supabase';
import { Plus, Filter, X } from 'lucide-react';

interface TaskBoardProps {
  selectedProject?: string;
  filterAgent?: string;
}

const COLUMNS = [
  { id: 'todo', label: 'To Do', color: 'border-gray-600' },
  { id: 'in_progress', label: 'In Progress', color: 'border-blue-600' },
  { id: 'waiting_approval', label: 'Waiting Approval', color: 'border-yellow-500' },
  { id: 'completed', label: 'Completed', color: 'border-green-600' },
  { id: 'failed', label: 'Failed', color: 'border-red-600' },
];

const AGENT_COLORS: Record<string, string> = {
  researcher: 'bg-purple-600',
  builder: 'bg-blue-600',
  copywriter: 'bg-pink-600',
  marketer: 'bg-green-600',
  manager: 'bg-yellow-600',
};

const AGENT_OPTIONS = [
  { value: '', label: 'All Agents' },
  { value: 'researcher', label: 'Researcher' },
  { value: 'builder', label: 'Builder' },
  { value: 'copywriter', label: 'Copywriter' },
  { value: 'marketer', label: 'Marketer' },
  { value: 'manager', label: 'Manager' },
];

const PRIORITY_COLORS: Record<string, string> = {
  low: 'text-gray-400',
  normal: 'text-blue-400',
  high: 'text-orange-400',
  urgent: 'text-red-400',
};

export default function TaskBoard({ selectedProject, filterAgent }: TaskBoardProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [newComment, setNewComment] = useState('');
  const [showNewTask, setShowNewTask] = useState(false);
  const [filterProject, setFilterProject] = useState<string>('');
  const [filterAgentLocal, setFilterAgentLocal] = useState<string>('');

  // New task form state
  const [newTask, setNewTask] = useState({
    title: '',
    description: '',
    assigned_agent: '',
    priority: 'normal' as 'low' | 'normal' | 'high' | 'urgent',
    project_id: '',
    requires_approval: false,
  });

  useEffect(() => {
    fetchTasks();
    fetchProjects();

    // Subscribe to real-time updates
    if (supabase) {
      const channel = supabase
        .channel('tasks-changes')
        .on('postgres_changes', { event: '*', schema: 'public', table: 'tasks' }, () => {
          fetchTasks();
        })
        .subscribe();

      return () => {
        // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
        supabase!.removeChannel(channel);
      };
    }
  }, [selectedProject, filterAgent, filterProject, filterAgentLocal]);

  async function fetchTasks() {
    if (!supabase) return;

    try {
      let query = supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      // Apply filters
      if (selectedProject || filterProject) {
        query = query.eq('project_id', selectedProject || filterProject);
      }

      if (filterAgent || filterAgentLocal) {
        query = query.eq('assigned_agent', filterAgent || filterAgentLocal);
      }

      const { data, error } = await query;
      if (error) throw error;
      setTasks(data || []);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setIsLoading(false);
    }
  }

  async function fetchProjects() {
    if (!supabase) return;

    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('status', 'active');

      if (error) throw error;
      setProjects(data || []);
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  }

  async function addComment(taskId: string, comment: string) {
    if (!comment.trim() || !supabase) return;

    try {
      const { data: task } = await supabase
        .from('tasks')
        .select('chat_history')
        .eq('id', taskId)
        .single();

      if (task) {
        const newHistory = [
          ...task.chat_history,
          {
            author: 'eric',
            role: 'human',
            message: comment,
            timestamp: new Date().toISOString(),
          },
        ];

        await supabase
          .from('tasks')
          .update({
            chat_history: newHistory,
            updated_at: new Date().toISOString(),
          })
          .eq('id', taskId);

        setNewComment('');
        setSelectedTask(prev => prev ? { ...prev, chat_history: newHistory } : null);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  }

  async function approveTask(taskId: string) {
    if (!supabase) return;

    try {
      await supabase
        .from('tasks')
        .update({
          status: 'completed',
          approved_by: 'eric',
          completed_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
        })
        .eq('id', taskId);

      setSelectedTask(null);
    } catch (error) {
      console.error('Error approving task:', error);
    }
  }

  async function rejectTask(taskId: string) {
    if (!supabase) return;

    try {
      // Get current task to increment bounce count
      const { data: task } = await supabase
        .from('tasks')
        .select('bounce_count')
        .eq('id', taskId)
        .single();

      if (task) {
        await supabase
          .from('tasks')
          .update({
            status: 'in_progress',
            bounce_count: (task.bounce_count || 0) + 1,
            updated_at: new Date().toISOString(),
          })
          .eq('id', taskId);
      }

      setSelectedTask(null);
    } catch (error) {
      console.error('Error rejecting task:', error);
    }
  }

  async function createTask(e: React.FormEvent) {
    e.preventDefault();
    if (!supabase) return;

    try {
      // Get SOP for agent
      let checklist = [];
      if (newTask.assigned_agent) {
        const { data: sop } = await supabase
          .from('sops')
          .select('steps')
          .eq('agent', newTask.assigned_agent)
          .single();

        if (sop) {
          checklist = sop.steps.map((step: any) => ({
            ...step,
            completed: false,
          }));
        }
      }

      const { error } = await supabase.from('tasks').insert([{
        title: newTask.title,
        description: newTask.description,
        status: 'todo',
        assigned_agent: newTask.assigned_agent || null,
        priority: newTask.priority,
        project_id: newTask.project_id || null,
        requires_approval: newTask.requires_approval,
        checklist,
        chat_history: [
          {
            author: 'eric',
            role: 'human',
            message: `Task created: ${newTask.title}`,
            timestamp: new Date().toISOString(),
          },
        ],
      }]);

      if (error) throw error;

      // Reset form
      setNewTask({
        title: '',
        description: '',
        assigned_agent: '',
        priority: 'normal',
        project_id: '',
        requires_approval: false,
      });
      setShowNewTask(false);

      fetchTasks();
    } catch (error) {
      console.error('Error creating task:', error);
    }
  }

  function getColumnTasks(status: string) {
    return tasks.filter(task => task.status === status);
  }

  function formatDate(dateString: string) {
    return new Date(dateString).toLocaleString('en-GB', {
      day: '2-digit',
      month: 'short',
      hour: '2-digit',
      minute: '2-digit',
    });
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Header with filters */}
      <div className="flex items-center justify-between mb-4 gap-4 flex-wrap">
        {/* Project filter */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2">
            <Filter className="w-4 h-4 text-gray-400" />
            <select
              value={filterProject}
              onChange={(e) => setFilterProject(e.target.value)}
              className="bg-black/40 text-white px-3 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-yellow-500 text-sm"
            >
              <option value="">All Projects</option>
              {projects.map(project => (
                <option key={project.id} value={project.id}>
                  {project.name}
                </option>
              ))}
            </select>
          </div>

          {/* Agent filter */}
          <select
            value={filterAgentLocal}
            onChange={(e) => setFilterAgentLocal(e.target.value)}
            className="bg-black/40 text-white px-3 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-yellow-500 text-sm"
          >
            {AGENT_OPTIONS.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        {/* New task button */}
        <button
          onClick={() => setShowNewTask(true)}
          className="flex items-center gap-2 px-4 py-2 bg-accent hover:bg-accent/80 text-black font-medium rounded-lg transition-colors"
        >
          <Plus className="w-4 h-4" />
          <span>New Task</span>
        </button>
      </div>

      {/* Task Board */}
      <div className="flex-1 overflow-hidden">
        <div className="flex gap-4 overflow-x-auto pb-4 h-full">
          {COLUMNS.map(column => (
            <div
              key={column.id}
              className={`flex-shrink-0 w-80 bg-gray-900 border-t-4 ${column.color} rounded-lg p-4 flex flex-col`}
            >
              <h3 className="text-white font-bold mb-4 flex items-center gap-2">
                {column.label}
                <span className="text-gray-400 text-sm">
                  ({getColumnTasks(column.id).length})
                </span>
              </h3>

              <div className="flex-1 overflow-y-auto space-y-3">
                {getColumnTasks(column.id).map(task => (
                  <div
                    key={task.id}
                    onClick={() => setSelectedTask(task)}
                    className="bg-gray-800 p-3 rounded-lg cursor-pointer hover:bg-gray-750 transition-colors border border-gray-700"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="text-white font-medium text-sm line-clamp-2">
                        {task.title}
                      </h4>
                      <span className={`text-xs font-semibold ${PRIORITY_COLORS[task.priority]}`}>
                        {task.priority}
                      </span>
                    </div>

                    {task.assigned_agent && (
                      <div className="flex items-center gap-2 mb-2">
                        <div className={`w-2 h-2 rounded-full ${AGENT_COLORS[task.assigned_agent]}`}></div>
                        <span className="text-gray-400 text-xs capitalize">
                          {task.assigned_agent}
                        </span>
                      </div>
                    )}

                    {task.chat_history.length > 0 && (
                      <div className="text-gray-500 text-xs mb-2">
                        {task.chat_history.length} comment{task.chat_history.length !== 1 ? 's' : ''}
                      </div>
                    )}

                    {task.bounce_count > 0 && (
                      <div className="text-red-400 text-xs">
                        ⚠️ {task.bounce_count} bounce{task.bounce_count !== 1 ? 's' : ''}
                      </div>
                    )}

                    <div className="text-gray-600 text-xs mt-2">
                      {formatDate(task.updated_at)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Task Detail Modal */}
      {selectedTask && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-gray-700">
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-white text-xl font-bold">{selectedTask.title}</h2>
                <button
                  onClick={() => setSelectedTask(null)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              {selectedTask.description && (
                <p className="text-gray-300 mb-4">{selectedTask.description}</p>
              )}

              <div className="flex items-center gap-4 text-sm flex-wrap">
                <div className="flex items-center gap-2">
                  <span className="text-gray-400">Status:</span>
                  <span className="text-white capitalize">
                    {selectedTask.status.replace('_', ' ')}
                  </span>
                </div>

                {selectedTask.assigned_agent && (
                  <div className="flex items-center gap-2">
                    <span className="text-gray-400">Agent:</span>
                    <div className={`flex items-center gap-2`}>
                      <div className={`w-2 h-2 rounded-full ${AGENT_COLORS[selectedTask.assigned_agent]}`}></div>
                      <span className="text-white capitalize">
                        {selectedTask.assigned_agent}
                      </span>
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-2">
                  <span className="text-gray-400">Priority:</span>
                  <span className={`${PRIORITY_COLORS[selectedTask.priority]} font-semibold`}>
                    {selectedTask.priority}
                  </span>
                </div>
              </div>
            </div>

            {/* Comment Thread */}
            <div className="flex-1 overflow-y-auto p-6">
              <h3 className="text-white font-bold mb-4">Comments</h3>

              {selectedTask.chat_history.length === 0 ? (
                <div className="text-gray-500 text-center py-8">No comments yet</div>
              ) : (
                <div className="space-y-4">
                  {selectedTask.chat_history.map((msg, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg ${
                        msg.role === 'human'
                          ? 'bg-yellow-900/20 border border-yellow-700'
                          : msg.role === 'manager'
                          ? 'bg-blue-900/20 border border-blue-700'
                          : 'bg-gray-800'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white font-medium capitalize">
                          {msg.author}
                          {msg.role !== 'human' && ` (${msg.role})`}
                        </span>
                        <span className="text-gray-500 text-xs">
                          {formatDate(msg.timestamp)}
                        </span>
                      </div>
                      <p className="text-gray-300 text-sm whitespace-pre-wrap">
                        {msg.message}
                      </p>
                    </div>
                  ))}
                </div>
              )}

              {/* Add Comment */}
              <div className="mt-6 pt-6 border-t border-gray-700">
                <textarea
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  placeholder="Add a comment..."
                  className="w-full bg-gray-800 text-white p-3 rounded-lg border border-gray-700 focus:outline-none focus:border-yellow-500 resize-none"
                  rows={3}
                />
                <button
                  onClick={() => addComment(selectedTask.id, newComment)}
                  disabled={!newComment.trim()}
                  className="mt-2 px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white font-medium rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Add Comment
                </button>
              </div>
            </div>

            {/* Approval Actions */}
            {selectedTask.status === 'waiting_approval' && (
              <div className="p-6 border-t border-gray-700 bg-yellow-900/20">
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-white font-bold mb-1">Awaiting Your Approval</h4>
                    <p className="text-gray-400 text-sm">
                      Review work and approve to complete, or reject to send back
                    </p>
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => rejectTask(selectedTask.id)}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white font-medium rounded-lg transition-colors"
                    >
                      Reject
                    </button>
                    <button
                      onClick={() => approveTask(selectedTask.id)}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white font-medium rounded-lg transition-colors"
                    >
                      Approve
                    </button>
                  </div>
                </div>
              </div>
            )}

            {selectedTask.bounce_count > 0 && selectedTask.bounce_count >= 3 && (
              <div className="p-6 border-t border-gray-700 bg-red-900/20">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">⚠️</span>
                  <div>
                    <h4 className="text-white font-bold">Task Stuck in Loop</h4>
                    <p className="text-gray-400 text-sm">
                      This task has been rejected {selectedTask.bounce_count} times. Manual intervention required.
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* New Task Modal */}
      {showNewTask && (
        <div className="fixed inset-0 bg-black/80 flex items-center justify-center p-4 z-50">
          <div className="bg-gray-900 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col border border-gray-700">
            <div className="p-6 border-b border-gray-700">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-white text-xl font-bold">Create New Task</h2>
                <button
                  onClick={() => setShowNewTask(false)}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={createTask} className="space-y-4">
                {/* Title */}
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Title *</label>
                  <input
                    type="text"
                    value={newTask.title}
                    onChange={(e) => setNewTask({ ...newTask, title: e.target.value })}
                    placeholder="Task title"
                    required
                    className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-yellow-500"
                  />
                </div>

                {/* Description */}
                <div>
                  <label className="block text-gray-400 text-sm mb-2">Description</label>
                  <textarea
                    value={newTask.description}
                    onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                    placeholder="Task description..."
                    rows={3}
                    className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-yellow-500 resize-none"
                  />
                </div>

                {/* Project & Agent */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Project</label>
                    <select
                      value={newTask.project_id}
                      onChange={(e) => setNewTask({ ...newTask, project_id: e.target.value })}
                      className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-yellow-500"
                    >
                      <option value="">No project</option>
                      {projects.map(project => (
                        <option key={project.id} value={project.id}>
                          {project.name}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Assigned Agent</label>
                    <select
                      value={newTask.assigned_agent}
                      onChange={(e) => setNewTask({ ...newTask, assigned_agent: e.target.value })}
                      className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-yellow-500"
                    >
                      <option value="">Unassigned</option>
                      {AGENT_OPTIONS.filter(a => a.value).map(option => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Priority & Approval */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-2">Priority</label>
                    <select
                      value={newTask.priority}
                      onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as any })}
                      className="w-full bg-gray-800 text-white px-4 py-2 rounded-lg border border-gray-700 focus:outline-none focus:border-yellow-500"
                    >
                      <option value="low">Low</option>
                      <option value="normal">Normal</option>
                      <option value="high">High</option>
                      <option value="urgent">Urgent</option>
                    </select>
                  </div>

                  <div className="flex items-center pt-6">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={newTask.requires_approval}
                        onChange={(e) => setNewTask({ ...newTask, requires_approval: e.target.checked })}
                        className="w-4 h-4 rounded border-gray-700 focus:ring-yellow-500"
                      />
                      <span className="text-white">Requires Approval</span>
                    </label>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4">
                  <button
                    type="button"
                    onClick={() => setShowNewTask(false)}
                    className="px-6 py-2 bg-gray-700 hover:bg-gray-600 text-white font-medium rounded-lg transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 bg-accent hover:bg-accent/80 text-black font-medium rounded-lg transition-colors"
                  >
                    Create Task
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
