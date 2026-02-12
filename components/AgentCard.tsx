'use client';

import { motion } from 'framer-motion';
import { Activity, Clock, AlertCircle, CheckCircle2 } from 'lucide-react';
import { SquadMember } from '@/types/squad';

type AgentStatus = 'working' | 'available' | 'blocked' | 'review' | 'waiting_approval';

const statusConfig = {
  available: {
    color: 'from-green-400 to-emerald-500',
    bg: 'bg-green-500/20',
    emoji: '😊',
    label: 'Available',
    icon: <CheckCircle2 className="w-4 h-4 text-green-400" />,
  },
  working: {
    color: 'from-accent to-yellow-600',
    bg: 'bg-accent/20',
    emoji: '🧠',
    label: 'Working',
    icon: <Activity className="w-4 h-4 text-accent animate-pulse" />,
  },
  blocked: {
    color: 'from-red-400 to-rose-500',
    bg: 'bg-red-500/20',
    emoji: '😵',
    label: 'Blocked',
    icon: <AlertCircle className="w-4 h-4 text-red-400" />,
  },
  review: {
    color: 'from-orange-400 to-orange-600',
    bg: 'bg-orange-500/20',
    emoji: '🤔',
    label: 'Review',
    icon: <Clock className="w-4 h-4 text-orange-400" />,
  },
  waiting_approval: {
    color: 'from-yellow-400 to-amber-500',
    bg: 'bg-yellow-500/20',
    emoji: '⏳',
    label: 'Waiting Approval',
    icon: <Clock className="w-4 h-4 text-amber-400" />,
  },
};

interface AgentCardProps {
  agent: SquadMember;
  index: number;
}

export default function AgentCard({ agent, index }: AgentCardProps) {
  const config = statusConfig[agent.status as keyof typeof statusConfig] || statusConfig.available;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      whileHover={{ scale: 1.02, y: -4 }}
      className="glass-card group relative overflow-hidden"
    >
      {/* Gradient glow effect */}
      <div className={`absolute inset-0 bg-gradient-to-br ${config.color} opacity-0 group-hover:opacity-10 transition-opacity duration-300`} />

      {/* Header */}
      <div className="relative flex items-start justify-between mb-4">
        {/* Animated emoji face */}
        <motion.div
          animate={agent.status === 'working' ? {
            y: [0, -10, 0],
            rotate: [0, 5, -5, 0],
          } : {}}
          transition={agent.status === 'working' ? {
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          } : {}}
          className="text-5xl"
        >
          {config.emoji}
        </motion.div>

        {/* Status badge */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          className={`flex items-center gap-2 px-3 py-1.5 rounded-full ${config.bg} border border-current opacity-70`}
        >
          {config.icon}
          <span className="text-sm font-medium">{config.label}</span>
        </motion.div>
      </div>

      {/* Agent info */}
      <div className="relative mb-4">
        <h3 className="text-xl font-bold mb-1">{agent.name}</h3>
        <p className="text-muted-foreground text-sm">{agent.role}</p>
      </div>

      {/* Current task */}
      <div className="relative">
        <div className="text-sm text-muted-foreground mb-2">Current Task</div>
        <motion.div
          animate={agent.currentTask ? {
            opacity: [0.7, 1, 0.7],
          } : {}}
          transition={agent.currentTask ? {
            duration: 2,
            repeat: Infinity,
            ease: 'easeInOut',
          } : {}}
          className={`p-3 rounded-lg ${agent.currentTask ? 'bg-white/5' : 'bg-muted/30'} min-h-[60px]`}
        >
          {agent.currentTask || (
            <span className="text-muted-foreground/50 italic">No active task</span>
          )}
        </motion.div>
      </div>

      {/* Task details */}
      {(agent.startedAt || agent.eta) && (
        <div className="relative mt-4 grid grid-cols-2 gap-3">
          {agent.startedAt && (
            <div className="p-3 rounded-lg bg-white/5">
              <div className="text-xs text-muted-foreground mb-1">Started</div>
              <div className="text-sm font-medium">
                {new Date(agent.startedAt).toLocaleTimeString('en-US', {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </div>
            </div>
          )}
          {agent.eta && (
            <div className="p-3 rounded-lg bg-white/5">
              <div className="text-xs text-muted-foreground mb-1">ETA</div>
              <div className="text-sm font-medium">{agent.eta}</div>
            </div>
          )}
        </div>
      )}

      {/* Blockers */}
      {agent.blockers.length > 0 && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          className="relative mt-4 p-3 rounded-lg bg-red-500/10 border border-red-500/20"
        >
          <div className="flex items-center gap-2 mb-2">
            <AlertCircle className="w-4 h-4 text-red-400" />
            <span className="text-sm font-medium text-red-400">Blockers</span>
          </div>
          <ul className="text-sm text-muted-foreground space-y-1">
            {agent.blockers.map((blocker, i) => (
              <li key={i} className="flex items-start gap-2">
                <span className="text-red-400 mt-1">•</span>
                <span>{blocker}</span>
              </li>
            ))}
          </ul>
        </motion.div>
      )}

      {/* Status indicator line */}
      <motion.div
        layout
        className={`absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r ${config.color}`}
      />
    </motion.div>
  );
}
