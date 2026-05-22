"use client"

import { useState } from 'react';
import { motion } from 'framer-motion';
import { formatRelativeTime } from '@/lib/utils';
import Link from 'next/link';
import { Sparkles, Clock, ArrowRight, Search, MessageSquare, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useConversationHistory } from '@/hooks/useConversationHistory';
// import { useConversationHistory } from '@/hooks/useConversationHistory';

export default function HistoryPage() {
  const [searchFilter, setSearchFilter] = useState('');
  const { conversations, isLoading } = useConversationHistory();

  const filtered = conversations.filter((item) =>
    item.preview.toLowerCase().includes(searchFilter.toLowerCase())
  );

  return (
    <div className="px-6 py-8 max-w-4xl mx-auto space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-display font-bold text-2xl text-slate-950">Conversations</h2>
            <p className="text-sm text-slate-400 mt-0.5">
              {conversations.length} conversation{conversations.length !== 1 ? 's' : ''} in your history
            </p>
          </div>
          <Link href="/dashboard" className="btn-primary text-sm px-4 py-2">
            <Plus className="w-3.5 h-3.5" /> New
          </Link>
        </div>
      </motion.div>

      {/* Search filter */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <div className="relative">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Filter conversations…"
            className="input-base pl-10"
          />
        </div>
      </motion.div>

      {/* List */}
      <div className="space-y-3">
        {isLoading && (
          Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="card flex items-start gap-4 animate-pulse">
              <div className="w-10 h-10 rounded-xl bg-cream-200 shrink-0" />
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-cream-200 rounded w-3/4" />
                <div className="h-3 bg-cream-200 rounded w-1/2" />
              </div>
            </div>
          ))
        )}

        {!isLoading && filtered.length === 0 && (
          <motion.div
            className="card text-center py-16 space-y-3"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <MessageSquare className="w-8 h-8 text-slate-200 mx-auto" />
            <p className="text-slate-400 text-sm">
              {conversations.length === 0
                ? "You haven't started any conversations yet."
                : 'No conversations match your filter.'}
            </p>
            {conversations.length === 0 && (
              <Link href="/dashboard" className="btn-primary text-sm px-5 py-2.5 inline-flex">
                Start your first conversation
              </Link>
            )}
          </motion.div>
        )}

        {!isLoading && filtered.map((item, i) => (
          <Link href={`/history/${item.id}`} key={item.id}>
            <motion.div
              className="card group cursor-pointer hover:shadow-elevated hover:-translate-y-0.5 transition-all duration-200"
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.06, duration: 0.4 }}
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center shrink-0 group-hover:bg-brand-100 transition-colors">
                  <MessageSquare className="w-4 h-4 text-brand-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-slate-800 text-sm mb-1.5 group-hover:text-brand-600 transition-colors leading-snug line-clamp-2">
                    {item.preview}
                  </p>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                    <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {formatRelativeTime(item.startedAt)}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400">
                      {item.messageCount} message{item.messageCount !== 1 ? 's' : ''}
                    </span>
                    {item.domain && (
                      <span className="tag bg-brand-50 text-brand-500">{item.domain}</span>
                    )}
                  </div>
                </div>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-brand-400 shrink-0 mt-1 transition-colors" />
              </div>
            </motion.div>
          </Link>
        ))}
      </div>
    </div>
  );
}
