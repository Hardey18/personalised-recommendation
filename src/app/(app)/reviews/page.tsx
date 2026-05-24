'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useReviewUsers, useReviewUserDetail, useSimulateReview } from '@/hooks/useReviews';
import { ReviewUserDetail, ReviewItem } from '@/types';
import {
  ChevronDown, Star, MapPin, Tag, Loader2, Sparkles, Play,
  TrendingUp, MessageSquare, BarChart2, User,
  CheckCircle2, Quote,
} from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';

// ─── Helpers ──────────────────────────────────────────────────────────────────

function StarRating({ rating, max = 5, size = 'sm' }: { rating: number; max?: number; size?: 'sm' | 'md' | 'lg' }) {
  const sz = size === 'lg' ? 'w-5 h-5' : size === 'md' ? 'w-4 h-4' : 'w-3.5 h-3.5';
  return (
    <div className="flex items-center gap-0.5">
      {Array.from({ length: max }).map((_, i) => (
        <Star
          key={i}
          className={cn(sz, i < Math.round(rating) ? 'text-amber-400 fill-amber-400' : 'text-slate-200 fill-slate-200')}
        />
      ))}
    </div>
  );
}

function ScoreBar({ value, color, label }: { value: number; color: string; label: string }) {
  const pct = Math.round(value * 100);
  return (
    <div>
      <div className="flex items-center justify-between mb-1">
        <span className="text-xs text-slate-500">{label}</span>
        <span className="text-xs font-mono text-slate-500">{pct}%</span>
      </div>
      <div className="h-1.5 bg-cream-200 rounded-full overflow-hidden">
        <motion.div
          className={cn('h-full rounded-full', color)}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        />
      </div>
    </div>
  );
}

// ─── User selector dropdown ───────────────────────────────────────────────────

function UserSelector({
  selectedId,
  onSelect,
}: {
  selectedId: string | null;
  onSelect: (id: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const { data, isLoading } = useReviewUsers();
  const users = data?.items ?? [];
  const selected = users.find((u) => u.userId === selectedId);

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((o) => !o)}
        className={cn(
          'w-full flex items-center justify-between gap-3 px-4 py-3 bg-white border-2 rounded-xl text-sm transition-all duration-150',
          open ? 'border-brand-400 shadow-elevated' : 'border-cream-200 shadow-soft hover:border-brand-200'
        )}
      >
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-brand-50 flex items-center justify-center shrink-0">
            <User className="w-4 h-4 text-brand-400" />
          </div>
          {selected ? (
            <div className="text-left min-w-0">
              <p className="font-semibold text-slate-800 text-sm truncate">{selected.userId}</p>
              <p className="text-[10px] text-slate-400 font-mono">{selected.reviewCount} reviews · ★ {selected.averageRating.toFixed(2)}</p>
            </div>
          ) : (
            <span className="text-slate-400">Select a user to explore…</span>
          )}
        </div>
        <ChevronDown className={cn('w-4 h-4 text-slate-400 shrink-0 transition-transform', open && 'rotate-180')} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.15 }}
            className="absolute top-full left-0 right-0 mt-2 bg-white border border-cream-200 rounded-2xl shadow-elevated z-30 overflow-hidden"
          >
            {isLoading ? (
              <div className="flex items-center justify-center gap-2 py-6 text-slate-400 text-sm">
                <Loader2 className="w-4 h-4 animate-spin" /> Loading users…
              </div>
            ) : (
              <div className="max-h-72 overflow-y-auto py-1.5">
                {users.map((user) => (
                  <button
                    key={user.userId}
                    onClick={() => { onSelect(user.userId); setOpen(false); }}
                    className={cn(
                      'w-full flex items-center gap-3 px-4 py-3 hover:bg-cream-50 transition-colors text-left group',
                      selectedId === user.userId && 'bg-brand-50'
                    )}
                  >
                    <div className={cn(
                      'w-8 h-8 rounded-lg flex items-center justify-center shrink-0 text-xs font-display font-bold',
                      selectedId === user.userId ? 'bg-brand-500 text-white' : 'bg-cream-200 text-slate-500'
                    )}>
                      {user.userId.slice(0, 2).toUpperCase()}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={cn('text-sm font-semibold truncate', selectedId === user.userId ? 'text-brand-600' : 'text-slate-800')}>
                        {user.userId}
                      </p>
                      <div className="flex items-center gap-3 mt-0.5">
                        <span className="text-[10px] font-mono text-slate-400">{user.reviewCount} review{user.reviewCount !== 1 ? 's' : ''}</span>
                        <span className="flex items-center gap-0.5 text-[10px] font-mono text-amber-500">
                          <Star className="w-2.5 h-2.5 fill-amber-400" /> {user.averageRating.toFixed(2)}
                        </span>
                        {user.cities[0] && (
                          <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
                            <MapPin className="w-2.5 h-2.5" />{user.cities[0]}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex flex-wrap gap-1 max-w-[120px] justify-end">
                      {user.favoriteCategories.slice(0, 2).map((cat) => (
                        <span key={cat} className="text-[9px] bg-cream-100 text-slate-500 px-1.5 py-0.5 rounded-md font-mono">
                          {cat}
                        </span>
                      ))}
                    </div>
                  </button>
                ))}
              </div>
            )}
            {data && (
              <div className="border-t border-cream-100 px-4 py-2">
                <p className="text-[10px] text-slate-400 font-mono">{data.totalCount} users · page {data.page}/{data.totalPages}</p>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

// ─── Review card ──────────────────────────────────────────────────────────────

function ReviewCard({ item, isHighlighted }: { item: ReviewItem; isHighlighted?: boolean }) {
  return (
    <div className={cn(
      'rounded-xl border p-4 transition-all duration-200',
      isHighlighted
        ? 'border-brand-200 bg-brand-50/40 shadow-card'
        : 'border-cream-200 bg-white shadow-soft'
    )}>
      {isHighlighted && (
        <div className="flex items-center gap-1.5 mb-3">
          <div className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-pulse-soft" />
          <span className="text-[10px] font-mono text-brand-500 uppercase tracking-widest">Active item for simulation</span>
        </div>
      )}
      <div className="flex items-start justify-between gap-2 mb-2">
        <div className="min-w-0">
          <p className="font-semibold text-slate-800 text-sm leading-snug">{item.itemName}</p>
          <div className="flex items-center gap-2 mt-1">
            <StarRating rating={item.reviewRating} />
            <span className="text-[10px] font-mono text-slate-400">{item.reviewRating}/5</span>
          </div>
        </div>
        <div className="text-right shrink-0">
          <p className="text-[10px] font-mono text-slate-400">{item.city}</p>
          <p className="text-[10px] font-mono text-slate-400 mt-0.5">{formatDate(item.timestamp)}</p>
        </div>
      </div>
      <p className="text-xs text-slate-500 leading-relaxed mb-3 italic">&ldquo;{item.reviewText}&rdquo;</p>
      <div className="flex flex-wrap gap-1.5">
        {item.categories.map((cat) => (
          <span key={cat} className="inline-flex items-center gap-1 px-2 py-0.5 bg-cream-100 rounded-lg text-[10px] font-mono text-slate-500">
            <Tag className="w-2.5 h-2.5" />{cat}
          </span>
        ))}
      </div>
    </div>
  );
}

// ─── Simulation result card ───────────────────────────────────────────────────

function SimulationResult({
  predictedRating,
  generatedReview,
  itemName,
}: {
  predictedRating: number;
  generatedReview: string;
  itemName: string;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ duration: 0.4, ease: 'easeOut' }}
      className="rounded-2xl border border-brand-200 bg-gradient-to-br from-brand-50/60 to-white p-5 shadow-elevated"
    >
      {/* Header */}
      <div className="flex items-center gap-2 mb-4">
        <div className="w-7 h-7 rounded-lg bg-brand-500 flex items-center justify-center">
          <Sparkles className="w-3.5 h-3.5 text-white" />
        </div>
        <div>
          <p className="text-[10px] font-mono text-brand-500 uppercase tracking-widest">Simulation result</p>
          <p className="text-sm font-semibold text-slate-800">{itemName}</p>
        </div>
        <div className="ml-auto flex items-center gap-1.5 px-3 py-1.5 bg-white border border-brand-100 rounded-xl shadow-soft">
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
          <span className="text-xs font-semibold text-slate-700">Generated</span>
        </div>
      </div>

      {/* Predicted rating */}
      <div className="flex items-center gap-4 p-3.5 bg-white border border-cream-200 rounded-xl mb-4 shadow-soft">
        <div className="text-center">
          <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1">Predicted Rating</p>
          <p className="font-display font-bold text-4xl text-slate-950">{predictedRating.toFixed(1)}</p>
          <p className="text-[10px] text-slate-400 font-mono">out of 5</p>
        </div>
        <div className="w-px h-12 bg-cream-200" />
        <StarRating rating={predictedRating} size="lg" />
      </div>

      {/* Generated review */}
      <div className="bg-white border border-cream-200 rounded-xl p-4 shadow-soft">
        <div className="flex items-center gap-1.5 mb-3">
          <Quote className="w-3.5 h-3.5 text-brand-400" />
          <span className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">AI-generated review</span>
        </div>
        <p className="text-sm text-slate-700 leading-relaxed italic">&ldquo;{generatedReview}&rdquo;</p>
      </div>
    </motion.div>
  );
}

// ─── User detail sections ─────────────────────────────────────────────────────

function UserDetailView({
  detail,
  onSimulate,
  isSimulating,
}: {
  detail: ReviewUserDetail;
  onSimulate: () => void;
  isSimulating: boolean;
}) {
  const firstReview = detail.reviews.items[0];
  const bp = detail.behavioralProfile;

  return (
    <div className="space-y-5">
      {/* ── Section 1: User overview stats ── */}
      <div>
        <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-3">User overview</p>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
          {[
            { label: 'Total Reviews', value: detail.totalReviews, icon: <MessageSquare className="w-4 h-4" />, color: 'bg-brand-50 text-brand-500' },
            { label: 'Avg Rating',    value: detail.averageRating.toFixed(2), icon: <Star className="w-4 h-4" />, color: 'bg-amber-50 text-amber-500', sub: <StarRating rating={detail.averageRating} size="sm" /> },
            { label: 'Positivity',   value: `${Math.round(detail.positivityRatio * 100)}%`, icon: <TrendingUp className="w-4 h-4" />, color: 'bg-emerald-50 text-emerald-600' },
            { label: 'Strictness',   value: `${Math.round(detail.strictnessScore * 100)}%`, icon: <BarChart2 className="w-4 h-4" />, color: 'bg-purple-50 text-purple-500' },
          ].map((stat, i) => (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.07, duration: 0.35 }}
              className="bg-white border border-cream-200 rounded-xl p-3.5 shadow-soft"
            >
              <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center mb-2', stat.color)}>
                {stat.icon}
              </div>
              <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <p className="font-display font-bold text-xl text-slate-900 mt-0.5">{stat.value}</p>
              {stat.sub && <div className="mt-1">{stat.sub}</div>}
            </motion.div>
          ))}
        </div>
      </div>

      {/* ── Section 2: Behavioural profile + favourite categories ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Behavioural profile */}
        <motion.div
          initial={{ opacity: 0, x: -12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.2, duration: 0.4 }}
          className="bg-white border border-cream-200 rounded-xl p-4 shadow-soft"
        >
          <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-3">Behavioural profile</p>
          <div className="flex items-center gap-3 mb-4">
            <span className="px-2.5 py-1 bg-brand-50 text-brand-600 rounded-lg text-xs font-semibold capitalize">{bp.tone}</span>
            <span className="px-2.5 py-1 bg-purple-50 text-purple-600 rounded-lg text-xs font-semibold capitalize">{bp.writingStyle}</span>
          </div>
          <div className="space-y-3">
            <ScoreBar value={bp.positivityBias}     color="bg-emerald-400" label="Positivity bias" />
            <ScoreBar value={bp.strictnessEstimate} color="bg-purple-400"  label="Strictness" />
            <ScoreBar value={bp.sarcasmLikelihood}  color="bg-rose-400"    label="Sarcasm likelihood" />
          </div>
        </motion.div>

        {/* Favourite categories */}
        <motion.div
          initial={{ opacity: 0, x: 12 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
          className="bg-white border border-cream-200 rounded-xl p-4 shadow-soft"
        >
          <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-3">Favourite categories</p>
          <div className="flex flex-wrap gap-2">
            {detail.favoriteCategories.map((cat, i) => (
              <motion.span
                key={cat}
                initial={{ opacity: 0, scale: 0.85 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3 + i * 0.04 }}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 bg-cream-100 border border-cream-200 rounded-xl text-xs text-slate-600 font-medium"
              >
                <Tag className="w-3 h-3 text-slate-400" />{cat}
              </motion.span>
            ))}
          </div>
          {detail.reviews.items[0]?.city && (
            <div className="flex flex-wrap gap-2 mt-3 pt-3 border-t border-cream-100">
              <p className="text-[10px] font-mono text-slate-400 w-full uppercase tracking-widest">Cities</p>
              {[...new Set(detail.reviews.items.map(r => r.city))].map((city) => (
                <span key={city} className="inline-flex items-center gap-1 px-2 py-1 bg-white border border-cream-200 rounded-lg text-xs text-slate-500">
                  <MapPin className="w-2.5 h-2.5 text-slate-400" />{city}
                </span>
              ))}
            </div>
          )}
        </motion.div>
      </div>

      {/* ── Section 3: Reviews list + simulate button ── */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">Reviews ({detail.reviews.totalCount})</p>
          {firstReview && (
            <button
              onClick={onSimulate}
              disabled={isSimulating}
              className={cn(
                'flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold font-display transition-all duration-150',
                isSimulating
                  ? 'bg-cream-200 text-slate-400 cursor-not-allowed'
                  : 'bg-brand-500 text-white hover:bg-brand-600 shadow-card hover:shadow-elevated'
              )}
            >
              {isSimulating ? (
                <><Loader2 className="w-3.5 h-3.5 animate-spin" /> Simulating…</>
              ) : (
                <><Play className="w-3.5 h-3.5 fill-white" /> Simulate review</>
              )}
            </button>
          )}
        </div>

        <div className="space-y-3">
          {detail.reviews.items.map((item, i) => (
            <motion.div
              key={item.itemId}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.07, duration: 0.35 }}
            >
              <ReviewCard item={item} isHighlighted={i === 0} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function ReviewsPage() {
  const [selectedUserId, setSelectedUserId] = useState<string | null>(null);
  const [simulationResult, setSimulationResult] = useState<{ predictedRating: number; generatedReview: string; itemName: string } | null>(null);

  const { data: userDetail, isLoading: detailLoading } = useReviewUserDetail(selectedUserId);
  const { mutate: simulate, isPending: isSimulating } = useSimulateReview();

  const handleUserSelect = (userId: string) => {
    setSelectedUserId(userId);
    setSimulationResult(null); // clear previous result when switching user
  };

  const handleSimulate = () => {
    if (!userDetail || !selectedUserId) return;
    const firstReview = userDetail.reviews.items[0];
    if (!firstReview) return;

    simulate(
      {
        userId:          selectedUserId,
        itemId:          firstReview.itemId,
        itemName:        firstReview.itemName,
        categories:      firstReview.categories,
        itemAvgRating:   firstReview.reviewRating,
        itemText:        firstReview.reviewText,
        simulatedRating: firstReview.reviewRating,
      },
      {
        onSuccess: (res) => {
          setSimulationResult({
            predictedRating: res.predictedRating,
            generatedReview: res.generatedReview,
            itemName:        firstReview.itemName,
          });
        },
      }
    );
  };

  return (
    <div className="px-6 py-8 max-w-5xl mx-auto space-y-8">

      {/* ── Page header ── */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <h2 className="font-display font-bold text-2xl text-slate-950">User Reviews</h2>
        <p className="text-sm text-slate-400 mt-0.5">
          Explore reviewer profiles and simulate AI-generated reviews
        </p>
      </motion.div>

      {/* ── User selector ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <p className="text-xs font-medium text-slate-600 mb-2">Select a reviewer</p>
        <UserSelector selectedId={selectedUserId} onSelect={handleUserSelect} />
      </motion.div>

      {/* ── Loading state ── */}
      {detailLoading && selectedUserId && (
        <div className="flex items-center justify-center gap-3 py-20 text-slate-400">
          <Loader2 className="w-5 h-5 animate-spin" />
          <span className="text-sm">Loading user profile…</span>
        </div>
      )}

      {/* ── Empty state ── */}
      {!selectedUserId && !detailLoading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex flex-col items-center justify-center py-24 text-center"
        >
          <div className="w-14 h-14 rounded-2xl bg-cream-100 flex items-center justify-center mb-4">
            <User className="w-7 h-7 text-slate-300" />
          </div>
          <p className="text-slate-500 font-medium mb-1">No reviewer selected</p>
          <p className="text-sm text-slate-400 max-w-xs">
            Pick a user from the dropdown above to view their profile, reviews, and run a simulation.
          </p>
        </motion.div>
      )}

      {/* ── User detail ── */}
      {userDetail && !detailLoading && (
        <motion.div
          key={selectedUserId}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.35 }}
        >
          {/* User identity banner */}
          <div className="flex items-center gap-4 p-4 bg-white border border-cream-200 rounded-2xl shadow-soft mb-6">
            <div className="w-12 h-12 rounded-xl bg-brand-500 flex items-center justify-center text-white font-display font-bold text-base shrink-0">
              {userDetail.userId.slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-display font-bold text-lg text-slate-950">{userDetail.userId}</p>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-0.5 mt-0.5">
                <span className="text-xs text-slate-400 font-mono flex items-center gap-1">
                  <MessageSquare className="w-3 h-3" />{userDetail.totalReviews} reviews
                </span>
                <span className="flex items-center gap-1 text-xs text-amber-500 font-mono">
                  <Star className="w-3 h-3 fill-amber-400" />{userDetail.averageRating.toFixed(2)} avg
                </span>
              </div>
            </div>
          </div>

          <UserDetailView
            detail={userDetail}
            onSimulate={handleSimulate}
            isSimulating={isSimulating}
          />
        </motion.div>
      )}

      {/* ── Simulation result ── */}
      <AnimatePresence>
        {simulationResult && (
          <SimulationResult
            predictedRating={simulationResult.predictedRating}
            generatedReview={simulationResult.generatedReview}
            itemName={simulationResult.itemName}
          />
        )}
      </AnimatePresence>
    </div>
  );
}
