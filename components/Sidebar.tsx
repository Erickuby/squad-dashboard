'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { LayoutDashboard, Users, Activity, AlertTriangle, Clock, RefreshCw, X, Menu } from 'lucide-react';

interface SidebarProps {
  currentFilter: 'all' | 'working' | 'available' | 'blocked' | 'review';
  onFilterChange: (filter: 'all' | 'working' | 'available' | 'blocked' | 'review') => void;
  onRefresh: () => void;
  isRefreshing: boolean;
  isOpen: boolean;
  onToggle: () => void;
}

export default function Sidebar({
  currentFilter,
  onFilterChange,
  onRefresh,
  isRefreshing,
  isOpen,
  onToggle,
}: SidebarProps) {
  const filters = [
    { id: 'all', label: 'All Agents', icon: <Users className="w-4 h-4" /> },
    { id: 'working', label: 'Working Now', icon: <Activity className="w-4 h-4" /> },
    { id: 'available', label: 'Available', icon: <Users className="w-4 h-4" /> },
    { id: 'blocked', label: 'Blocked', icon: <AlertTriangle className="w-4 h-4" /> },
    { id: 'review', label: 'In Review', icon: <Clock className="w-4 h-4" /> },
  ];

  return (
    <>
      {/* Mobile overlay */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onToggle}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
          />
        )}
      </AnimatePresence>

      {/* Sidebar */}
      <motion.aside
        initial={false}
        animate={{
          x: isOpen ? 0 : -320,
          transition: { type: "spring", damping: 25, stiffness: 200 },
        }}
        className="fixed lg:static top-0 left-0 h-full w-80 bg-card border-r border-border z-50 flex flex-col"
      >
        {/* Header */}
        <div className="p-6 border-b border-border">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-accent">Squad</h1>
            <button
              onClick={onToggle}
              className="lg:hidden p-2 rounded-lg hover:bg-black/20"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
          <p className="text-sm text-muted-foreground">
            Real-time team tracking
          </p>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <div className="mb-6">
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">
              Filters
            </h2>
            {filters.map((filter) => (
              <button
                key={filter.id}
                onClick={() => onFilterChange(filter.id as any)}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg transition-all ${
                  currentFilter === filter.id
                    ? 'bg-accent text-black font-semibold'
                    : 'hover:bg-black/20 text-muted-foreground'
                }`}
              >
                {filter.icon}
                <span>{filter.label}</span>
              </button>
            ))}
          </div>

          <div>
            <h2 className="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-3 px-3">
              Quick Actions
            </h2>
            <button
              onClick={onRefresh}
              disabled={isRefreshing}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg hover:bg-black/20 text-muted-foreground transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <RefreshCw className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} />
              <span>Refresh Dashboard</span>
            </button>
          </div>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-border">
          <div className="flex items-center gap-3 px-3 py-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent to-yellow-600 flex items-center justify-center text-black text-xs font-bold">
              C
            </div>
            <div className="flex-1 min-w-0">
              <div className="text-sm font-medium truncate">Squad Lead</div>
              <div className="text-xs text-muted-foreground truncate">Chris</div>
            </div>
          </div>
        </div>
      </motion.aside>
    </>
  );
}
