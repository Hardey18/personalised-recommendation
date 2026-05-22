'use client';

import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { useLogout } from '@/hooks/useAuth';
import { useProfile, useBehaviorAnalysis } from '@/hooks/useUser';
import { getInitials, formatDate } from '@/lib/utils';
import {
  User, Mail, Calendar, Shield, Zap, LogOut,
  TrendingUp, ChevronRight, Brain, Smile, MessageSquare,
  BarChart2, Loader2, AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';

function ScoreBar({ value, color }: { value: number; color: string }) {
  const pct = Math.round(value * 100);
  return (
    <div className="flex items-center gap-2">
      <div className="flex-1 h-1.5 bg-cream-200 rounded-full overflow-hidden">
        <motion.div
          className={cn('h-full rounded-full', color)}
          initial={{ width: 0 }}
          animate={{ width: `${pct}%` }}
          transition={{ duration: 0.7, ease: 'easeOut' }}
        />
      </div>
      <span className="text-xs font-mono text-slate-500 w-7 text-right">{pct}%</span>
    </div>
  );
}

export default function ProfilePage() {
  const { profile, userId } = useAuthStore();
  const logout = useLogout();

  const { data: freshProfile, isLoading: profileLoading } = useProfile();
  const { data: behavior, isLoading: behaviorLoading, error: behaviorError } = useBehaviorAnalysis();

  // Prefer fresh fetched data, fall back to cached store data
  const user = freshProfile ?? profile;

  if (profileLoading && !user) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="w-6 h-6 text-brand-400 animate-spin" />
      </div>
    );
  }

  if (!user) return null;

  const fullName = `${user.firstName} ${user.lastName}`;

  const infoItems = [
    { label: 'First name',    value: user.firstName,             icon: <User className="w-4 h-4" /> },
    { label: 'Last name',     value: user.lastName,              icon: <User className="w-4 h-4" /> },
    { label: 'Email address', value: user.email,                 icon: <Mail className="w-4 h-4" /> },
    ...(user.dateOfBirth
      ? [{ label: 'Date of birth', value: formatDate(user.dateOfBirth), icon: <Calendar className="w-4 h-4" /> }]
      : []),
    { label: 'User ID',       value: userId ?? user.id,          icon: <Shield className="w-4 h-4" />, mono: true },
    { label: 'Member since',  value: formatDate(user.createdAt), icon: <Calendar className="w-4 h-4" /> },
  ];

  const a = behavior?.analysis;

  return (
    <div className="px-6 py-8 max-w-3xl mx-auto space-y-8">

      {/* ── Hero card ── */}
      <motion.div
        className="card bg-gradient-to-br from-brand-500 to-brand-700 border-0 relative overflow-hidden"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.1),transparent_70%)]" />
        <div className="relative flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-xl font-display font-bold shrink-0">
            {getInitials(fullName)}
          </div>
          <div>
            <h2 className="font-display font-bold text-2xl text-white">{fullName}</h2>
            <p className="text-brand-100 text-sm mt-0.5">{user.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="flex items-center gap-1.5 text-xs text-brand-200 bg-white/10 px-2 py-0.5 rounded-full">
                <div className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                Active account
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ── Account information ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <h3 className="font-display font-semibold text-slate-900 mb-4">Account information</h3>
        <div className="card divide-y divide-cream-200 !p-0 overflow-hidden">
          {infoItems.map(({ label, value, icon, mono }) => (
            <div key={label} className="flex items-center gap-4 px-6 py-4 hover:bg-cream-50 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-cream-100 flex items-center justify-center text-slate-400 shrink-0">
                {icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">{label}</p>
                <p className={cn('text-sm font-medium mt-0.5 truncate text-slate-700', mono && 'font-mono text-xs text-slate-500')}>
                  {value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* ── Behaviour analysis ── */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <div className="flex items-center gap-2 mb-4">
          <Brain className="w-4 h-4 text-brand-400" />
          <h3 className="font-display font-semibold text-slate-900">Behaviour analysis</h3>
          {behaviorLoading && <Loader2 className="w-3.5 h-3.5 text-slate-300 animate-spin ml-1" />}
        </div>

        {behaviorLoading && (
          <div className="card flex items-center gap-3 text-slate-400 text-sm py-8 justify-center">
            <Loader2 className="w-4 h-4 animate-spin" />
            Analysing your communication patterns…
          </div>
        )}

        {behaviorError && !behaviorLoading && (
          <div className="card flex items-center gap-3 text-slate-400 text-sm py-6">
            <AlertCircle className="w-4 h-4 text-slate-300 shrink-0" />
            <span>Behaviour analysis unavailable — start a few conversations first.</span>
          </div>
        )}

        {behavior && a && (
          <div className="space-y-4">
            {/* Summary */}
            <div className="card bg-brand-50/40 border-brand-100">
              <p className="text-sm text-slate-600 leading-relaxed italic">{behavior.summary}</p>
            </div>

            {/* Trait grid */}
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
              {[
                { label: 'Tone',          value: a.tone,         icon: <MessageSquare className="w-4 h-4" />, color: 'bg-brand-50 text-brand-500' },
                { label: 'Writing style', value: a.writingStyle, icon: <BarChart2 className="w-4 h-4" />,     color: 'bg-purple-50 text-purple-500' },
                { label: 'Emotion',       value: a.enthusiasmScore > 0.5 ? 'Enthusiastic' : 'Measured',
                                                                  icon: <Smile className="w-4 h-4" />,        color: 'bg-amber-50 text-amber-500' },
              ].map((trait) => (
                <div key={trait.label} className="card hover:shadow-elevated transition-all duration-200">
                  <div className={cn('w-8 h-8 rounded-lg flex items-center justify-center mb-2', trait.color)}>
                    {trait.icon}
                  </div>
                  <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">{trait.label}</p>
                  <p className="text-sm font-semibold text-slate-800 mt-0.5 capitalize">{trait.value}</p>
                </div>
              ))}
            </div>

            {/* Score bars */}
            <div className="card space-y-4">
              <p className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-1">Signal scores</p>
              {[
                { label: 'Positivity bias',       value: a.positivityBias,         color: 'bg-emerald-400' },
                { label: 'Emotional consistency', value: a.emotionalConsistency,   color: 'bg-brand-400' },
                { label: 'Enthusiasm',            value: a.enthusiasmScore,        color: 'bg-amber-400' },
                { label: 'Strictness',            value: a.strictnessEstimate,     color: 'bg-purple-400' },
                { label: 'Sarcasm likelihood',    value: a.sarcasmLikelihood,      color: 'bg-rose-400' },
                { label: 'Complaint frequency',   value: a.complaintFrequency,     color: 'bg-red-400' },
              ].map((bar) => (
                <div key={bar.label}>
                  <p className="text-xs text-slate-500 mb-1">{bar.label}</p>
                  <ScoreBar value={bar.value} color={bar.color} />
                </div>
              ))}
            </div>

            {/* Sentiment */}
            <div className="grid grid-cols-2 gap-3">
              <div className="card text-center hover:shadow-elevated transition-all">
                <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1">Positivity ratio</p>
                <p className="font-display font-bold text-2xl text-emerald-600">
                  {Math.round(a.sentimentPatterns.positivityRatio * 100)}%
                </p>
              </div>
              <div className="card text-center hover:shadow-elevated transition-all">
                <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest mb-1">Negativity ratio</p>
                <p className="font-display font-bold text-2xl text-rose-500">
                  {Math.round(a.sentimentPatterns.negativityRatio * 100)}%
                </p>
              </div>
            </div>

            {/* Contextual preferences */}
            {a.contextualPreferences.length > 0 && (
              <div>
                <p className="text-xs font-mono text-slate-400 uppercase tracking-widest mb-2">Contextual preferences</p>
                <div className="flex flex-wrap gap-2">
                  {a.contextualPreferences.map((pref) => (
                    <span key={pref} className="px-3 py-1.5 bg-white border border-cream-200 rounded-xl text-sm text-slate-600 shadow-soft">
                      {pref}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </motion.div>

      {/* ── Sign out ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full card text-left hover:bg-red-50 hover:border-red-100 transition-all duration-200 group"
        >
          <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center shrink-0 group-hover:bg-red-100 transition-colors">
            <LogOut className="w-4 h-4 text-red-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-700 group-hover:text-red-600 transition-colors">Sign out</p>
            <p className="text-xs text-slate-400">End your current session</p>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-red-400 transition-colors" />
        </button>
      </motion.div>
    </div>
  );
}
