'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { Recommendation } from '@/types';
import {
  Sparkles, ExternalLink, TrendingUp, Loader2,
  ChevronDown, ChevronUp, Tag,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useState } from 'react';

// ─── Domain tag inference ─────────────────────────────────────────────────────
// The backend domain field is a number enum whose mapping we don't have the full
// spec for — in practice most results currently return the same value (7).
// Instead we derive a more meaningful tag from the URL hostname when available,
// falling back to a known-enum map, then to a generic "Resource" label.

const URL_DOMAIN_MAP: { pattern: RegExp; label: string; color: string }[] = [
  { pattern: /udemy\.com/,        label: 'Course',    color: 'bg-brand-50 text-brand-700' },
  { pattern: /coursera\.org/,     label: 'Course',    color: 'bg-brand-50 text-brand-700' },
  { pattern: /codecademy\.com/,   label: 'Course',    color: 'bg-brand-50 text-brand-700' },
  { pattern: /pluralsight\.com/,  label: 'Course',    color: 'bg-brand-50 text-brand-700' },
  { pattern: /edx\.org/,          label: 'Course',    color: 'bg-brand-50 text-brand-700' },
  { pattern: /skillshare\.com/,   label: 'Course',    color: 'bg-brand-50 text-brand-700' },
  { pattern: /linkedin\.com\/learning/, label: 'Course', color: 'bg-brand-50 text-brand-700' },
  { pattern: /youtube\.com|youtu\.be/,  label: 'Video',  color: 'bg-red-50 text-red-700' },
  { pattern: /oreilly\.com/,      label: 'Book',      color: 'bg-amber-50 text-amber-700' },
  { pattern: /manning\.com/,      label: 'Book',      color: 'bg-amber-50 text-amber-700' },
  { pattern: /amazon\.com/,       label: 'Book',      color: 'bg-amber-50 text-amber-700' },
  { pattern: /goodreads\.com/,    label: 'Book',      color: 'bg-amber-50 text-amber-700' },
  { pattern: /packtpub\.com/,     label: 'Book',      color: 'bg-amber-50 text-amber-700' },
  { pattern: /medium\.com/,       label: 'Article',   color: 'bg-purple-50 text-purple-700' },
  { pattern: /dev\.to/,           label: 'Article',   color: 'bg-purple-50 text-purple-700' },
  { pattern: /hashnode\.com/,     label: 'Article',   color: 'bg-purple-50 text-purple-700' },
  { pattern: /substack\.com/,     label: 'Article',   color: 'bg-purple-50 text-purple-700' },
  { pattern: /github\.com/,       label: 'Open Source', color: 'bg-slate-100 text-slate-700' },
  { pattern: /npmjs\.com/,        label: 'Package',   color: 'bg-cyan-50 text-cyan-700' },
  { pattern: /docs\.|documentation/, label: 'Docs',   color: 'bg-teal-50 text-teal-700' },
  { pattern: /reddit\.com/,       label: 'Community', color: 'bg-orange-50 text-orange-700' },
  { pattern: /stackoverflow\.com/,label: 'Community', color: 'bg-orange-50 text-orange-700' },
];

// Fallback enum map for when there's no URL to inspect
const ENUM_DOMAIN_MAP: Record<number, { label: string; color: string }> = {
  0:  { label: 'General',     color: 'bg-slate-100 text-slate-600' },
  1:  { label: 'Books',       color: 'bg-amber-50 text-amber-700' },
  2:  { label: 'Courses',     color: 'bg-brand-50 text-brand-700' },
  3:  { label: 'Products',    color: 'bg-emerald-50 text-emerald-700' },
  4:  { label: 'Videos',      color: 'bg-red-50 text-red-700' },
  5:  { label: 'Articles',    color: 'bg-purple-50 text-purple-700' },
  6:  { label: 'Tools',       color: 'bg-cyan-50 text-cyan-700' },
  7:  { label: 'General',    color: 'bg-slate-100 text-slate-600' },
  8:  { label: 'Finance',     color: 'bg-green-50 text-green-700' },
  9:  { label: 'Health',      color: 'bg-teal-50 text-teal-700' },
  10: { label: 'Technology',  color: 'bg-indigo-50 text-indigo-700' },
};

function domainMeta(domain: number, url?: string): { label: string; color: string } {
  // 1. Try to infer from the URL hostname — most accurate
  if (url?.trim()) {
    const match = URL_DOMAIN_MAP.find(({ pattern }) => pattern.test(url));
    if (match) return { label: match.label, color: match.color };
  }
  // 2. Fall back to enum map
  return ENUM_DOMAIN_MAP[domain] ?? { label: 'General', color: 'bg-slate-100 text-slate-600' };
}

// ─── Confidence bar ───────────────────────────────────────────────────────────
function ConfidenceBar({ value }: { value: number }) {
  const pct = Math.round(value * 100);
  const color =
    pct >= 80 ? 'bg-emerald-400' :
    pct >= 60 ? 'bg-brand-400' :
    'bg-amber-400';

  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1 bg-cream-200 rounded-full overflow-hidden">
        <motion.div
          className={cn('h-full rounded-full', color)}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        />
      </div>
      <span className="text-[10px] font-mono text-slate-400 w-6 text-right shrink-0">{pct}%</span>
    </div>
  );
}

// ─── Single recommendation card ───────────────────────────────────────────────
function RecCard({ rec, index }: { rec: Recommendation; index: number }) {
  const { label, color } = domainMeta(rec.domain, rec.url);
  const hasUrl = !!rec.url?.trim();

  return (
    <motion.div
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.06, duration: 0.35 }}
      className="bg-white rounded-xl border border-cream-200 p-3.5 shadow-soft hover:shadow-card hover:-translate-y-0.5 transition-all duration-200 group"
    >
      {/* Top row: domain badge + price */}
      <div className="flex items-center justify-between gap-2 mb-2">
        <span className={cn('inline-flex items-center gap-1 px-2 py-0.5 rounded-lg text-[10px] font-mono font-medium', color)}>
          <Tag className="w-2.5 h-2.5" />
          {label}
        </span>
        {rec.price != null && rec.price > 0 && (
          <span className="text-[10px] font-mono font-semibold text-slate-600 bg-cream-100 px-1.5 py-0.5 rounded-md">
            ${rec.price.toFixed(2)}
          </span>
        )}
        {(rec.price == null || rec.price === 0) && (
          <span className="text-[10px] font-mono text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded-md">
            Free
          </span>
        )}
      </div>

      {/* Title */}
      <h4 className="text-sm font-semibold text-slate-800 leading-snug mb-1.5 group-hover:text-brand-600 transition-colors line-clamp-2">
        {rec.title}
      </h4>

      {/* Description */}
      <p className="text-xs text-slate-400 leading-relaxed mb-3 line-clamp-2">
        {rec.description}
      </p>

      {/* Confidence bar */}
      <div className="mb-3">
        <div className="flex items-center justify-between mb-1">
          <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
            <TrendingUp className="w-2.5 h-2.5" /> Match
          </span>
        </div>
        <ConfidenceBar value={rec.confidence} />
      </div>

      {/* Visit link — only rendered when url is a non-empty string */}
      {hasUrl && (
        <a
          href={rec.url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className="flex items-center justify-center gap-1.5 w-full py-1.5 rounded-lg text-xs font-semibold text-brand-600 bg-brand-50 hover:bg-brand-100 border border-brand-100 transition-all duration-150"
        >
          <ExternalLink className="w-3 h-3" />
          Visit resource
        </a>
      )}
    </motion.div>
  );
}

// ─── Skeleton ─────────────────────────────────────────────────────────────────
function RecSkeleton({ count = 3 }: { count?: number }) {
  return (
    <>
      {Array.from({ length: count }).map((_, i) => (
        <div key={i} className="bg-white rounded-xl border border-cream-200 p-3.5 space-y-2.5 animate-pulse">
          <div className="flex justify-between">
            <div className="h-4 w-16 bg-cream-200 rounded-lg" />
            <div className="h-4 w-10 bg-cream-200 rounded-md" />
          </div>
          <div className="h-4 w-full bg-cream-200 rounded" />
          <div className="h-3 w-5/6 bg-cream-200 rounded" />
          <div className="h-3 w-4/6 bg-cream-200 rounded" />
          <div className="h-1 w-full bg-cream-200 rounded-full mt-2" />
        </div>
      ))}
    </>
  );
}

// ─── Panel ────────────────────────────────────────────────────────────────────

interface RecommendationsPanelProps {
  recommendations: Recommendation[];
  isLoading: boolean;
  /** If true, renders as a collapsible bottom drawer (mobile / history detail) */
  inline?: boolean;
}

export function RecommendationsPanel({
  recommendations,
  isLoading,
  inline = false,
}: RecommendationsPanelProps) {
  const [collapsed, setCollapsed] = useState(false);
  const hasRecs = recommendations.length > 0;
  const showContent = !collapsed && (isLoading || hasRecs);

  // Don't render the panel at all if there's nothing to show and not loading
  if (!isLoading && !hasRecs) return null;

  if (inline) {
    // ── Inline / collapsible drawer (used in history detail + mobile) ──
    return (
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="border-t border-cream-200 bg-cream-50/60"
      >
        {/* Drawer header — always visible */}
        <button
          onClick={() => setCollapsed((c) => !c)}
          className="w-full flex items-center justify-between px-4 py-3 hover:bg-cream-100 transition-colors"
        >
          <div className="flex items-center gap-2">
            <div className="w-5 h-5 rounded-md bg-brand-500 flex items-center justify-center">
              <Sparkles className="w-3 h-3 text-white" />
            </div>
            <span className="text-sm font-semibold text-slate-800">
              Recommendations
            </span>
            {isLoading && <Loader2 className="w-3.5 h-3.5 text-brand-400 animate-spin" />}
            {!isLoading && hasRecs && (
              <span className="text-[10px] font-mono bg-brand-500 text-white px-1.5 py-0.5 rounded-full">
                {recommendations.length}
              </span>
            )}
          </div>
          {collapsed
            ? <ChevronDown className="w-4 h-4 text-slate-400" />
            : <ChevronUp className="w-4 h-4 text-slate-400" />
          }
        </button>

        <AnimatePresence>
          {showContent && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.25 }}
              className="overflow-hidden"
            >
              <div className="px-4 pb-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                {isLoading ? <RecSkeleton count={3} /> : recommendations.map((rec, i) => (
                  <RecCard key={rec.id} rec={rec} index={i} />
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    );
  }

  // ── Sidebar panel (desktop dashboard) ──
  return (
    <div className="flex flex-col h-full overflow-hidden">
      {/* Panel header */}
      <div className="flex items-center justify-between px-4 py-3.5 border-b border-cream-200 shrink-0">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-brand-500 flex items-center justify-center">
            <Sparkles className="w-3.5 h-3.5 text-white" />
          </div>
          <h3 className="font-display font-semibold text-sm text-slate-900">Recommendations</h3>
        </div>
        <div className="flex items-center gap-2">
          {isLoading && <Loader2 className="w-3.5 h-3.5 text-brand-400 animate-spin" />}
          {!isLoading && hasRecs && (
            <span className="text-[10px] font-mono bg-brand-500 text-white px-2 py-0.5 rounded-full">
              {recommendations.length}
            </span>
          )}
        </div>
      </div>

      {/* Scrollable cards */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3">
        {isLoading && <RecSkeleton count={4} />}
        {!isLoading && recommendations.map((rec, i) => (
          <RecCard key={rec.id} rec={rec} index={i} />
        ))}
      </div>
    </div>
  );
}
