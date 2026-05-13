'use client';

import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { mockHistory } from '@/lib/mockData';
import { formatDate, formatRelativeTime } from '@/lib/utils';
import { ArrowLeft, Clock, Sparkles, MessageSquare } from 'lucide-react';
import { RecommendationCard } from '@/components/features/RecommendationCard';

export default function HistoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const item = mockHistory.find((h) => h.id === id);

  if (!item) {
    return (
      <div className="px-6 py-8 max-w-4xl mx-auto">
        <div className="card text-center py-20">
          <Sparkles className="w-8 h-8 text-slate-200 mx-auto mb-3" />
          <p className="text-slate-400">Search not found.</p>
          <button onClick={() => router.back()} className="btn-secondary mt-4 text-sm px-4 py-2">
            Go back
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="px-6 py-8 max-w-4xl mx-auto space-y-8">
      {/* Back + header */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-700 mb-6 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to history
        </button>

        <div className="card bg-gradient-to-br from-brand-50/50 to-white border-brand-100">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center shrink-0">
              <MessageSquare className="w-5 h-5 text-brand-500" />
            </div>
            <div className="flex-1">
              <h2 className="font-display font-bold text-xl text-slate-950 leading-snug mb-3">
                {item.query}
              </h2>
              {item.context && (
                <div className="bg-white border border-cream-200 rounded-xl p-3 mb-3">
                  <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1">Context provided</p>
                  <p className="text-sm text-slate-600 italic">{item.context}</p>
                </div>
              )}
              <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
                <span className="text-xs text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {formatDate(item.timestamp)} · {formatRelativeTime(item.timestamp)}
                </span>
                <span className="text-xs text-slate-400 font-mono">{item.resultsCount} recommendations</span>
                {item.domain && (
                  <span className="tag bg-brand-50 text-brand-500">{item.domain}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Results grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.4 }}
      >
        <div className="flex items-center gap-2 mb-5">
          <Sparkles className="w-4 h-4 text-brand-400" />
          <h3 className="font-display font-semibold text-slate-900">Recommendations from this search</h3>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {item.recommendations.map((rec, i) => (
            <RecommendationCard key={rec.id} rec={rec} index={i} featured={i === 0} />
          ))}
        </div>
      </motion.div>
    </div>
  );
}