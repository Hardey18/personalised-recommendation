'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { mockRecommendations, mockHistory } from '@/lib/mockData';
import { Recommendation, SearchHistoryItem } from '@/types';
import {
  Sparkles, History, TrendingUp, Zap, ArrowRight, Clock, MessageSquare,
} from 'lucide-react';
import Link from 'next/link';
import { formatRelativeTime } from '@/lib/utils';
import { SearchBar } from '../../../components/features/SearchBar';
import { StatCard } from '../../../components/ui/StatCard';
import { RecommendationSkeleton } from '../../../components/ui/Skeleton';
import { RecommendationCard } from '../../../components/features/RecommendationCard';

export default function DashboardPage() {
  const { user } = useAuthStore();
  const [results, setResults] = useState<Recommendation[]>([]);
  const [currentQuery, setCurrentQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);

  const recentHistory = mockHistory.slice(0, 3);

  const handleSearch = async (query: string, context?: string) => {
    setCurrentQuery(query);
    setIsSearching(true);
    setHasSearched(true);
    setResults([]);

    // Simulate API call delay
    await new Promise((r) => setTimeout(r, 1500));

    // Mock: shuffle and return recommendations
    const shuffled = [...mockRecommendations].sort(() => Math.random() - 0.5);
    setResults(shuffled);
    setIsSearching(false);
  };

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="px-6 py-8 max-w-5xl mx-auto space-y-10">
      {/* Greeting */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <p className="text-sm text-slate-400 font-medium mb-1">{greeting} 👋</p>
        <h2 className="font-display font-bold text-2xl md:text-3xl text-slate-950">
          What are you looking for today, {user?.name?.split(' ')[0]}?
        </h2>
      </motion.div>

      {/* Search */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.5 }}
      >
        <SearchBar onSearch={handleSearch} isLoading={isSearching} />
      </motion.div>

      {/* Stats row */}
      {!hasSearched && (
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
        >
          <StatCard title="Total Searches" value={mockHistory.length} icon={<Sparkles className="w-5 h-5" />} color="bg-brand-50 text-brand-500" index={0} />
          <StatCard title="Recommendations" value="28" subtitle="this week" icon={<Zap className="w-5 h-5" />} color="bg-amber-50 text-amber-500" index={1} />
          <StatCard title="Domains Explored" value="5" icon={<TrendingUp className="w-5 h-5" />} color="bg-emerald-50 text-emerald-600" index={2} />
          <StatCard title="AI Turns" value="12" subtitle="multi-turn sessions" icon={<MessageSquare className="w-5 h-5" />} color="bg-purple-50 text-purple-500" index={3} />
        </motion.div>
      )}

      {/* Search Results */}
      <AnimatePresence>
        {hasSearched && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="flex items-center justify-between mb-5">
              <div>
                <h3 className="font-display font-semibold text-slate-900 text-base">
                  {isSearching ? 'Reasoning through your query…' : `${results.length} recommendations`}
                </h3>
                {!isSearching && currentQuery && (
                  <p className="text-xs text-slate-400 mt-0.5 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> for &ldquo;{currentQuery}&rdquo;
                  </p>
                )}
              </div>
              {!isSearching && results.length > 0 && (
                <button
                  onClick={() => { setHasSearched(false); setResults([]); }}
                  className="text-xs text-slate-400 hover:text-slate-600 transition-colors"
                >
                  Clear results
                </button>
              )}
            </div>

            {isSearching ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <RecommendationSkeleton key={i} />
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {results.map((rec, i) => (
                  <RecommendationCard key={rec.id} rec={rec} index={i} featured={i === 0} />
                ))}
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Recent History */}
      {!hasSearched && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.5 }}
        >
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-slate-400" />
              <h3 className="font-display font-semibold text-slate-900 text-base">Recent searches</h3>
            </div>
            <Link href="/history" className="text-xs text-brand-500 hover:text-brand-600 font-medium flex items-center gap-1 transition-colors">
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          <div className="space-y-3">
            {recentHistory.map((item, i) => (
              <Link href={`/history/${item.id}`} key={item.id}>
                <motion.div
                  className="card flex items-start gap-4 hover:shadow-elevated hover:-translate-y-0.5 transition-all duration-200 cursor-pointer group"
                  initial={{ opacity: 0, x: -12 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.35 + i * 0.07, duration: 0.4 }}
                >
                  <div className="w-9 h-9 rounded-xl bg-brand-50 flex items-center justify-center shrink-0">
                    <Sparkles className="w-4 h-4 text-brand-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-800 truncate group-hover:text-brand-600 transition-colors">
                      {item.query}
                    </p>
                    <div className="flex items-center gap-3 mt-1">
                      <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />{formatRelativeTime(item.timestamp)}
                      </span>
                      <span className="text-[10px] font-mono text-slate-400">{item.resultsCount} results</span>
                      {item.domain && (
                        <span className="tag bg-cream-200 text-slate-500">{item.domain}</span>
                      )}
                    </div>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-300 group-hover:text-brand-400 shrink-0 mt-1 transition-colors" />
                </motion.div>
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </div>
  );
}