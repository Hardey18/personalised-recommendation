"use client"

import { useParams, useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { parseAssistantContent } from '@/hooks/useConversation';
import { formatDate } from '@/lib/utils';
import {
  ArrowLeft, Clock, MessageSquare, Sparkles, Zap, Brain,
  Loader2, AlertCircle,
} from 'lucide-react';
import { ConversationMessage, ParsedAIResponse } from '@/types';
import { cn } from '@/lib/utils';
import { useConversationDetail } from '@/hooks/useConversationHistory';

// ─── Colour map per section label ─────────────────────────────────────────────

const SECTION_COLORS: Record<string, string> = {
  goals:       'bg-brand-50 border-brand-100 text-brand-700',
  preferences: 'bg-purple-50 border-purple-100 text-purple-700',
  constraints: 'bg-amber-50 border-amber-100 text-amber-700',
  domains:     'bg-emerald-50 border-emerald-100 text-emerald-700',
};
function sectionColor(label: string) {
  return SECTION_COLORS[label.toLowerCase()] ?? 'bg-slate-50 border-slate-100 text-slate-700';
}

// ─── Inferred context panel ───────────────────────────────────────────────────

function InferredContextPanel({ parsed }: { parsed: ParsedAIResponse }) {
  const hasSections = parsed.sections.length > 0;
  if (!hasSections && !parsed.contextSummary && !parsed.emotion) return null;

  return (
    <div className="mt-3 bg-brand-50/60 border border-brand-100 rounded-xl p-3 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Brain className="w-3.5 h-3.5 text-brand-400" />
          <span className="text-[10px] font-mono text-brand-500 uppercase tracking-widest">
            Inferred context
          </span>
        </div>
        {parsed.emotion && (
          <span className="text-[10px] font-mono px-2 py-0.5 bg-white border border-brand-100 rounded-full text-brand-500 capitalize">
            {parsed.emotion}
          </span>
        )}
      </div>

      {parsed.sections.map((section) => (
        <div key={section.label}>
          <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1.5">
            {section.label}
          </p>
          <div className="flex flex-wrap gap-1.5">
            {section.entries.map((entry) => (
              <span
                key={entry.key}
                className={cn(
                  'inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs border',
                  sectionColor(section.label)
                )}
              >
                <span className="opacity-60 font-mono text-[10px]">{entry.key}:</span>
                <span className="font-medium capitalize">{entry.value}</span>
              </span>
            ))}
          </div>
        </div>
      ))}

      {parsed.contextSummary && (
        <p className="text-xs text-slate-500 italic border-t border-brand-100 pt-2 leading-relaxed">
          {parsed.contextSummary}
        </p>
      )}
    </div>
  );
}

// ─── Message bubble ───────────────────────────────────────────────────────────

function MessageBubble({ message }: { message: ConversationMessage }) {
  const isUser = message.role === 0;
  const isAssistant = message.role === 2;
  const time = new Date(message.timestamp).toLocaleTimeString([], {
    hour: '2-digit', minute: '2-digit',
  });

  if (isUser) {
    return (
      <div className="flex justify-end">
        <div className="max-w-[75%] bg-brand-500 text-white rounded-2xl rounded-tr-sm px-4 py-3 shadow-card">
          <p className="text-sm leading-relaxed">{message.content}</p>
          <p className="text-[10px] text-brand-200 mt-1.5 text-right font-mono">{time}</p>
        </div>
      </div>
    );
  }

  if (isAssistant) {
    const { plain, parsed, recommendationCount } = parseAssistantContent(message.content);
    return (
      <div className="flex gap-3">
        <div className="w-7 h-7 rounded-lg bg-brand-100 flex items-center justify-center shrink-0 mt-1">
          <Sparkles className="w-3.5 h-3.5 text-brand-500" />
        </div>
        <div className="flex-1 max-w-[82%]">
          <div className="bg-white border border-cream-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-soft">
            {recommendationCount > 0 && (
              <div className="flex items-center gap-1.5 mb-2 pb-2 border-b border-cream-200">
                <Zap className="w-3.5 h-3.5 text-amber-500" />
                <span className="text-xs font-semibold text-amber-600">
                  {recommendationCount} recommendation{recommendationCount !== 1 ? 's' : ''} found
                </span>
              </div>
            )}
            {plain ? (
              <p className="text-sm text-slate-700 leading-relaxed">{plain}</p>
            ) : (
              <p className="text-sm text-slate-400 italic">No summary available.</p>
            )}
            <p className="text-[10px] text-slate-300 mt-2 font-mono">{time}</p>
          </div>
          {parsed && <InferredContextPanel parsed={parsed} />}
        </div>
      </div>
    );
  }

  return null;
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HistoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { conversation, isLoading, error } = useConversationDetail(id);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 gap-3 text-slate-400">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="text-sm">Loading conversation…</span>
      </div>
    );
  }

  if (error || !conversation) {
    return (
      <div className="px-6 py-8 max-w-3xl mx-auto">
        <div className="card text-center py-20 space-y-3">
          <AlertCircle className="w-8 h-8 text-slate-200 mx-auto" />
          <p className="text-slate-400 text-sm">Conversation not found or failed to load.</p>
          <button onClick={() => router.back()} className="btn-secondary text-sm px-4 py-2">
            Go back
          </button>
        </div>
      </div>
    );
  }

  const userMessages = conversation.messages.filter((m) => m.role === 0);
  const firstUserMsg = userMessages[0];

  return (
    <div className="px-6 py-8 max-w-3xl mx-auto space-y-6">
      <motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
        {/* Back */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-700 mb-6 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to history
        </button>

        {/* Meta card */}
        <div className="card bg-gradient-to-br from-brand-50/50 to-white border-brand-100">
          <div className="flex items-start gap-4">
            <div className="w-10 h-10 rounded-xl bg-brand-100 flex items-center justify-center shrink-0">
              <MessageSquare className="w-5 h-5 text-brand-500" />
            </div>
            <div className="flex-1">
              <h2 className="font-display font-bold text-xl text-slate-950 leading-snug mb-3">
                {firstUserMsg?.content ?? 'Conversation'}
              </h2>
              <div className="flex flex-wrap items-center gap-x-5 gap-y-1">
                <span className="text-xs text-slate-400 flex items-center gap-1.5">
                  <Clock className="w-3.5 h-3.5" />
                  {formatDate(conversation.startedAt)}
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {userMessages.length} message{userMessages.length !== 1 ? 's' : ''} sent
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  {conversation.messages.length} total turns
                </span>
              </div>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Full conversation replay */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.15, duration: 0.4 }}
        className="space-y-5"
      >
        <div className="flex items-center gap-2 mb-2">
          <Sparkles className="w-4 h-4 text-brand-400" />
          <h3 className="font-display font-semibold text-slate-900 text-sm">Full conversation</h3>
        </div>
        {conversation.messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}
      </motion.div>
    </div>
  );
}
