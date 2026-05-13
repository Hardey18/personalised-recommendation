'use client';

import { useState } from 'react';
import { Search, Sparkles, ArrowRight, X } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface SearchBarProps {
  onSearch: (query: string, context?: string) => void;
  isLoading?: boolean;
}

const suggestions = [
  'Best resources to learn ML for engineers',
  'Productivity tools for remote teams',
  'Books on distributed systems',
  'Investment strategies for tech professionals',
  'Beginner guide to system design',
];

export function SearchBar({ onSearch, isLoading }: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [context, setContext] = useState('');
  const [showContext, setShowContext] = useState(false);
  const [focused, setFocused] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim(), context.trim() || undefined);
    }
  };

  const handleSuggestion = (s: string) => {
    setQuery(s);
    setFocused(false);
    onSearch(s);
  };

  return (
    <div className="relative">
      <form onSubmit={handleSubmit}>
        <div className={cn(
          'bg-white border-2 rounded-2xl shadow-card transition-all duration-200 overflow-hidden',
          focused ? 'border-brand-400 shadow-elevated' : 'border-cream-200'
        )}>
          {/* Main search row */}
          <div className="flex items-center gap-3 px-4 py-3.5">
            <Search className={cn('w-5 h-5 shrink-0 transition-colors', focused ? 'text-brand-500' : 'text-slate-300')} />
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onFocus={() => setFocused(true)}
              onBlur={() => setTimeout(() => setFocused(false), 150)}
              placeholder="What would you like to discover today?"
              className="flex-1 bg-transparent text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none font-light"
            />
            {query && (
              <button
                title='X'
                type="button"
                onClick={() => setQuery('')}
                className="text-slate-300 hover:text-slate-500 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            )}
            <button
              type="button"
              onClick={() => setShowContext(!showContext)}
              className={cn(
                'text-xs font-mono px-2.5 py-1 rounded-lg transition-all duration-150',
                showContext
                  ? 'bg-brand-50 text-brand-500'
                  : 'text-slate-400 hover:bg-cream-100 hover:text-slate-600'
              )}
            >
              + Context
            </button>
          </div>

          {/* Context row */}
          <AnimatePresence>
            {showContext && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: 'auto', opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.2 }}
                className="border-t border-cream-200 overflow-hidden"
              >
                <div className="flex items-center gap-3 px-4 py-2.5">
                  <Sparkles className="w-4 h-4 text-slate-300 shrink-0" />
                  <input
                    type="text"
                    value={context}
                    onChange={(e) => setContext(e.target.value)}
                    placeholder="Add context about yourself or your situation…"
                    className="flex-1 bg-transparent text-xs text-slate-600 placeholder:text-slate-300 focus:outline-none"
                  />
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Submit row */}
          <div className="border-t border-cream-200 px-4 py-2.5 flex items-center justify-between">
            <p className="text-[10px] text-slate-300 font-mono">AI-powered contextual search</p>
            <button
              type="submit"
              disabled={!query.trim() || isLoading}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-brand-500 text-white text-xs font-semibold rounded-lg hover:bg-brand-600 transition-all disabled:opacity-40 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <ArrowRight className="w-3.5 h-3.5" />
              )}
              {isLoading ? 'Thinking…' : 'Recommend'}
            </button>
          </div>
        </div>
      </form>

      {/* Suggestions dropdown */}
      <AnimatePresence>
        {focused && query.length === 0 && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.2 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-2xl border border-cream-200 shadow-elevated py-2 z-50"
          >
            <p className="px-4 py-1.5 text-[10px] font-mono text-slate-300 uppercase tracking-widest">Popular searches</p>
            {suggestions.map((s) => (
              <button
                key={s}
                onMouseDown={() => handleSuggestion(s)}
                className="w-full text-left px-4 py-2.5 text-sm text-slate-600 hover:bg-cream-100 hover:text-slate-900 transition-colors flex items-center gap-2.5"
              >
                <Search className="w-3.5 h-3.5 text-slate-300 shrink-0" />
                {s}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}