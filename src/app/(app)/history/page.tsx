'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { mockHistory } from '@/lib/mockData';
import { formatRelativeTime } from '@/lib/utils';
import Link from 'next/link';
import { Sparkles, Clock, ArrowRight, Search, Filter, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';

const domains = ['All', 'Education', 'Technology', 'Business', 'Finance', 'Productivity'];

export default function HistoryPage() {
  const [searchFilter, setSearchFilter] = useState('');
  const [domainFilter, setDomainFilter] = useState('All');

  const filtered = mockHistory.filter((item) => {
    const matchesSearch = item.query.toLowerCase().includes(searchFilter.toLowerCase());
    const matchesDomain = domainFilter === 'All' || item.domain === domainFilter;
    return matchesSearch && matchesDomain;
  });

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
            <h2 className="font-display font-bold text-2xl text-slate-950">All searches</h2>
            <p className="text-sm text-slate-400 mt-0.5">{mockHistory.length} searches in your history</p>
          </div>
        </div>
      </motion.div>

      {/* Filters */}
      <motion.div
        className="flex flex-col sm:flex-row gap-3"
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-300" />
          <input
            type="text"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
            placeholder="Filter by keyword…"
            className="input-base pl-10"
          />
        </div>
        <div className="flex gap-2 flex-wrap">
          {domains.map((d) => (
            <button
              key={d}
              onClick={() => setDomainFilter(d)}
              className={cn(
                'px-3 py-2 text-xs font-medium rounded-xl border transition-all duration-150',
                domainFilter === d
                  ? 'bg-brand-500 text-white border-brand-500 shadow-card'
                  : 'bg-white text-slate-500 border-cream-200 hover:bg-cream-100 hover:border-cream-200'
              )}
            >
              {d}
            </button>
          ))}
        </div>
      </motion.div>

      {/* List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <motion.div
            className="card text-center py-16"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <Sparkles className="w-8 h-8 text-slate-200 mx-auto mb-3" />
            <p className="text-slate-400 text-sm">No searches match your filter.</p>
          </motion.div>
        ) : (
          filtered.map((item, i) => (
            <Link href={`/history/${item.id}`} key={item.id}>
              <motion.div
                className="card group cursor-pointer hover:shadow-elevated hover:-translate-y-0.5 transition-all duration-200"
                initial={{ opacity: 0, y: 12 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.06, duration: 0.4 }}
              >
                <div className="flex items-start gap-4">
                  {/* Icon */}
                  <div className="w-10 h-10 rounded-xl bg-brand-50 flex items-center justify-center shrink-0 group-hover:bg-brand-100 transition-colors">
                    <Sparkles className="w-4.5 h-4.5 text-brand-400" />
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 text-sm mb-1.5 group-hover:text-brand-600 transition-colors leading-snug">
                      {item.query}
                    </p>
                    {item.context && (
                      <p className="text-xs text-slate-400 italic mb-2 leading-relaxed line-clamp-1">
                        &ldquo;{item.context}&rdquo;
                      </p>
                    )}
                    <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                      <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        {formatRelativeTime(item.timestamp)}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">
                        {item.resultsCount} recommendations
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
          ))
        )}
      </div>
    </div>
  );
}