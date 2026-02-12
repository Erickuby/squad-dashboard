'use client';

import { useState, useEffect } from 'react';
import { Task } from '@/types/squad';
import { supabase } from '@/lib/supabase';

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

const PRIORITY_COLORS: Record<string, string> = {
  low: 'text-gray-400',
  normal: 'text-blue-400',
  high: 'text-orange-400',
  urgent: 'text-red-400',
};

export default function TaskBoard({ selectedProject, filterAgent }: TaskBoardProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [newComment, setNewComment] = useState('');

  useEffect(() => {
    fetchTasks();

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
  }, [selectedProject, filterAgent]);

  async function fetchTasks() {
    if (!supabase) return;

    try {
      let query = supabase
        .from('tasks')
        .select('*')
        .order('created_at', { ascending: false });

      if (selectedProject) {
        query = query.eq('project_id', selectedProject);
      }

      if (filterAgent) {
        query = query.eq('assigned_agent', filterAgent);
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
    <div className="h-full overflow-hidden">
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
                  ✕
                </button>
              </div>

              {selectedTask.description && (
                <p className="text-gray-300 mb-4">{selectedTask.description}</p>
              )}

              <div className="flex items-center gap-4 text-sm">
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
                      Review the work and approve to complete, or reject to send back
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
    </div>
  );
}
