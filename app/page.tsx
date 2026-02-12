'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, RefreshCw, AlertTriangle, Users, Calendar, Loader2, Menu } from 'lucide-react';
import AgentCard from '@/components/AgentCard';
import Sidebar from '@/components/Sidebar';
import { SquadState, Agent } from '@/types/squad';

export default function Dashboard() {
  const [squadState, setSquadState] = useState<SquadState | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [filter, setFilter] = useState<'all' | 'working' | 'available' | 'blocked' | 'review'>('all');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Initial fetch
  useEffect(() => {
    const fetchState = async () => {
      try {
        // Add timestamp to bust Vercel cache
        const response = await fetch(`/api/squad-state?t=${Date.now()}`, { cache: 'no-store' });
        const data = await response.json();
        setSquadState(data);
      } catch (error) {
        console.error('Error fetching squad state:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchState();
  }, []);

  useEffect(() => {
    if (!autoRefresh) return;

    const fetchState = async () => {
      try {
        // Add timestamp to bust cache
        const response = await fetch(`/api/squad-state?t=${Date.now()}`, { cache: 'no-store' });
        const data = await response.json();
        setSquadState(data);
      } catch (error) {
        console.error('Error fetching squad state:', error);
      }
    };

    fetchState(); // Initial fetch
    const interval = setInterval(fetchState, 30000);

    return () => clearInterval(interval);
  }, [autoRefresh]);

  const handleRefresh = async () => {
    setIsRefreshing(true);
    try {
      // Add timestamp to bust cache
      const response = await fetch(`/api/squad-state?t=${Date.now()}`, { cache: 'no-store' });
      const data = await response.json();
      setSquadState(data);
    } catch (error) {
      console.error('Error refreshing squad state:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  const getFilteredAgents = () => {
    if (!squadState) return [];
    const agents = Object.values(squadState.members);
    if (filter === 'all') return agents;
    return agents.filter(agent => agent.status === filter);
  };

  const filteredAgents = getFilteredAgents();

  if (isLoading || !squadState) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center lg:ml-80">
        <div className="text-center">
          <Loader2 className="w-12 h-12 animate-spin text-accent mx-auto mb-4" />
          <p className="text-muted-foreground">Loading squad dashboard...</p>
        </div>
      </div>
    );
  }

  const workingCount = Object.values(squadState.members).filter(a => a.status === 'working').length;
  const blockedCount = Object.values(squadState.members).filter(a => a.status === 'blocked').length;
  const totalBlockers = Object.values(squadState.members).reduce((acc, a) => acc + a.blockers.length, 0);

  return (
    <div className="min-h-screen bg-background">
      <Sidebar
        currentFilter={filter}
        onFilterChange={setFilter}
        onRefresh={handleRefresh}
        isRefreshing={isRefreshing}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen(!sidebarOpen)}
      />
      <div className="lg:ml-80 min-h-screen p-4 md:p-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-lg hover:bg-black/20"
              >
                <Menu className="w-6 h-6" />
              </button>
              <div>
                <h1 className="text-4xl md:text-5xl font-bold mb-2">
                  <span className="text-accent">Squad Dashboard</span>
                </h1>
                <p className="text-muted-foreground">
                  Real-time squad tracking & task management
                </p>
              </div>
            </div>

            <div className="hidden lg:flex items-center gap-3">
              {/* Auto refresh toggle */}
              <motion.button
                onClick={() => setAutoRefresh(!autoRefresh)}
                className={`p-3 rounded-xl glass-card ${autoRefresh ? 'bg-accent/20' : ''}`}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Activity className={`w-5 h-5 ${autoRefresh ? 'text-accent animate-pulse' : 'text-muted-foreground'}`} />
              </motion.button>

              {/* Refresh button */}
              <motion.button
                onClick={handleRefresh}
                disabled={isRefreshing}
                className="p-3 rounded-xl glass-card"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RefreshCw className={`w-5 h-5 ${isRefreshing ? 'animate-spin' : ''}`} />
              </motion.button>
            </div>
          </div>

          {/* Stats row */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
              className="stat-card"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent/20">
                  <Users className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{Object.keys(squadState.members).length}</div>
                  <div className="text-xs text-muted-foreground">Total Agents</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
              className="stat-card"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-green-500/20">
                  <Activity className="w-5 h-5 text-green-400" />
                </div>
                <div>
                  <div className="text-2xl font-bold">{workingCount}</div>
                  <div className="text-xs text-muted-foreground">Working Now</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              className="stat-card"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${blockedCount > 0 ? 'bg-red-500/20' : 'bg-green-500/20'}`}>
                  <AlertTriangle className={`w-5 h-5 ${blockedCount > 0 ? 'text-red-400' : 'text-green-400'}`} />
                </div>
                <div>
                  <div className="text-2xl font-bold">{blockedCount}</div>
                  <div className="text-xs text-muted-foreground">Blocked</div>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
              className="stat-card"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-accent/20">
                  <Calendar className="w-5 h-5 text-accent" />
                </div>
                <div>
                  <div className="text-sm font-bold">
                    {new Date(squadState.lastUpdated).toLocaleTimeString('en-US', {
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </div>
                  <div className="text-xs text-muted-foreground">Last Update</div>
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Blockers alert */}
        <AnimatePresence>
          {totalBlockers > 0 && (
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="mb-6 p-4 rounded-xl bg-red-500/10 border border-red-500/20"
            >
              <div className="flex items-center gap-3">
                <AlertTriangle className="w-5 h-5 text-red-400" />
                <div>
                  <div className="font-medium text-red-400">Active Blockers Detected</div>
                  <div className="text-sm text-muted-foreground">
                    {totalBlockers} blocker{totalBlockers !== 1 ? 's' : ''} need{totalBlockers === 1 ? 's' : ''} attention
                  </div>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Agent grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filteredAgents.length > 0 ? (
            filteredAgents.map((agent, index) => (
              <AgentCard key={agent.name} agent={agent} index={index} />
            ))
          ) : (
            <div className="col-span-2 text-center py-12">
              <p className="text-muted-foreground text-lg">
                No agents match the selected filter
              </p>
            </div>
          )}
        </div>

        {/* Activity log */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="mt-8 glass-card"
        >
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2 text-accent">
            <Calendar className="w-5 h-5" />
            Recent Activity
          </h2>
          <div className="space-y-3">
            <AnimatePresence mode="popLayout">
              {squadState.activityLog.slice(-5).reverse().map((log, index) => (
                <motion.div
                  key={log.timestamp}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ delay: index * 0.1 }}
                  className="flex items-start gap-4 p-3 rounded-lg bg-black/60"
                >
                  <div className="flex-shrink-0 w-10 h-10 rounded-lg bg-gradient-to-br from-accent to-yellow-600 flex items-center justify-center text-black text-lg font-bold">
                    {log.member.charAt(0)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium">{log.member}</span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(log.timestamp).toLocaleTimeString('en-US', {
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground">{log.action}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
