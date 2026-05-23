'use client';

import { useParams, useRouter } from 'next/navigation';
import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQueryClient } from '@tanstack/react-query';
import { useConversationDetail } from '@/hooks/useConversationHistory';
import { useConversation, parseAssistantContent } from '@/hooks/useConversation';
import { useRecommendations } from '@/hooks/useRecommendations';
import { useAuthStore } from '@/store/authStore';
import { formatDate } from '@/lib/utils';
import { RecommendationsPanel } from '@/components/features/RecommendationsPanel';
import {
  ArrowLeft, Clock, MessageSquare, Sparkles, Zap, Brain,
  Loader2, AlertCircle, Send, Plus,
} from 'lucide-react';
import { ConversationMessage, ParsedAIResponse } from '@/types';
import { cn } from '@/lib/utils';
import Link from 'next/link';

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
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.2 }}
      className="mt-3 bg-brand-50/60 border border-brand-100 rounded-xl p-3 space-y-3"
    >
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
    </motion.div>
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
      <motion.div
        initial={{ opacity: 0, x: 20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.25 }}
        className="flex justify-end"
      >
        <div className="max-w-[75%] bg-brand-500 text-white rounded-2xl rounded-tr-sm px-4 py-3 shadow-card">
          <p className="text-sm leading-relaxed">{message.content}</p>
          <p className="text-[10px] text-brand-200 mt-1.5 text-right font-mono">{time}</p>
        </div>
      </motion.div>
    );
  }

  if (isAssistant) {
    const { plain, parsed, recommendationCount } = parseAssistantContent(message.content);
    return (
      <motion.div
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.25 }}
        className="flex gap-3"
      >
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
      </motion.div>
    );
  }

  return null;
}

function TypingIndicator() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      className="flex gap-3"
    >
      <div className="w-7 h-7 rounded-lg bg-brand-100 flex items-center justify-center shrink-0">
        <Sparkles className="w-3.5 h-3.5 text-brand-500 animate-pulse-soft" />
      </div>
      <div className="bg-white border border-cream-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-soft">
        <div className="flex gap-1.5 items-center h-5">
          {[0, 1, 2].map((i) => (
            <span
              key={i}
              className="w-1.5 h-1.5 bg-brand-300 rounded-full animate-bounce"
              style={{ animationDelay: `${i * 0.15}s` }}
            />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HistoryDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const queryClient = useQueryClient();
  const { userId } = useAuthStore();

  // Fetch the historical conversation
  const { conversation: historicalConv, isLoading, error } = useConversationDetail(id);

  // Live chat hook — we load the historical conversation into it so we can continue
  const { conversation, isSending, isStarting, loadConversation, sendMessage } = useConversation();

  // Recommendations for this conversation
  const { recommendations, isLoading: recsLoading, fetchRecommendations } = useRecommendations();

  const [input, setInput] = useState('');
  const [isLoaded, setIsLoaded] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  // Once fetched, load into the live hook and fetch existing recommendations
  useEffect(() => {
    if (historicalConv && !isLoaded) {
      loadConversation(historicalConv);
      fetchRecommendations(historicalConv.id);
      setIsLoaded(true);
    }
  }, [historicalConv, isLoaded, loadConversation, fetchRecommendations]);

  // Scroll to bottom whenever messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [conversation?.messages, isSending]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isSending || isStarting) return;
    setInput('');
    const result = await sendMessage(text);
    if (result) {
      // Refresh recommendations after each new message
      fetchRecommendations(id);
    }
    // Refresh history list and this conversation's cache
    queryClient.invalidateQueries({ queryKey: ['conversation-history', userId] });
    queryClient.invalidateQueries({ queryKey: ['conversation', id] });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  // ── Loading state ──
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[calc(100vh-4rem)] gap-3 text-slate-400">
        <Loader2 className="w-5 h-5 animate-spin" />
        <span className="text-sm">Loading conversation…</span>
      </div>
    );
  }

  // ── Error state ──
  if (error || (!isLoading && !historicalConv)) {
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

  // Use live conversation (which has the historical messages pre-loaded + any new ones)
  const messages = conversation?.messages ?? historicalConv?.messages ?? [];
  const userMessages = messages.filter((m) => m.role === 0);
  const firstUserMsg = userMessages[0];

  return (
    <div className="flex flex-col h-[calc(100vh-4rem)] max-w-3xl mx-auto px-4 md:px-6">

      {/* ── Header ── */}
      <div className="shrink-0 pt-5 pb-3 border-b border-cream-200">
        <div className="flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <button
              title='Arrow Left'
              onClick={() => router.back()}
              className="mt-0.5 text-slate-400 hover:text-slate-700 transition-colors shrink-0"
            >
              <ArrowLeft className="w-4 h-4" />
            </button>
            <div className="min-w-0">
              <h2 className="font-display font-bold text-base text-slate-950 leading-snug truncate">
                {firstUserMsg?.content ?? 'Conversation'}
              </h2>
              <div className="flex flex-wrap items-center gap-x-4 gap-y-0.5 mt-1">
                <span className="text-[10px] font-mono text-slate-400 flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {historicalConv ? formatDate(historicalConv.startedAt) : ''}
                </span>
                <span className="text-[10px] font-mono text-slate-400">
                  {userMessages.length} message{userMessages.length !== 1 ? 's' : ''}
                </span>
              </div>
            </div>
          </div>
          <Link
            href="/dashboard"
            className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 transition-colors shrink-0 mt-1"
          >
            <Plus className="w-3.5 h-3.5" /> New chat
          </Link>
        </div>
      </div>

      {/* ── Messages ── */}
      <div className="flex-1 overflow-y-auto py-5 space-y-5 scroll-smooth">
        {messages.length === 0 && (
          <div className="flex items-center justify-center h-full">
            <div className="text-center space-y-2">
              <MessageSquare className="w-8 h-8 text-slate-200 mx-auto" />
              <p className="text-slate-400 text-sm">No messages yet.</p>
            </div>
          </div>
        )}

        {messages.map((msg) => (
          <MessageBubble key={msg.id} message={msg} />
        ))}

        <AnimatePresence>
          {(isSending || isStarting) && <TypingIndicator />}
        </AnimatePresence>

        <div ref={messagesEndRef} />
      </div>

      {/* ── Input bar ── */}
      <div className="py-4 shrink-0">
        <div className={cn(
          'bg-white border-2 rounded-2xl shadow-card transition-all duration-200',
          'focus-within:border-brand-400 focus-within:shadow-elevated border-cream-200'
        )}>
          <textarea
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Continue the conversation…"
            rows={2}
            className="w-full px-4 pt-3.5 pb-2 bg-transparent text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none resize-none leading-relaxed"
          />
          <div className="flex items-center justify-between px-3 pb-2.5">
            <p className="text-[10px] text-slate-300 font-mono flex items-center gap-1">
              <Sparkles className="w-3 h-3" /> Continuing conversation · Enter to send
            </p>
            <button
              onClick={handleSend}
              disabled={!input.trim() || isSending || isStarting}
              className={cn(
                'flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all duration-150',
                input.trim() && !isSending && !isStarting
                  ? 'bg-brand-500 text-white hover:bg-brand-600 shadow-card'
                  : 'bg-cream-200 text-slate-400 cursor-not-allowed'
              )}
            >
              {isSending || isStarting ? (
                <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
              {isSending ? 'Thinking…' : isStarting ? 'Starting…' : 'Send'}
            </button>
          </div>
        </div>
        <p className="text-center text-[10px] text-slate-300 mt-2">
          AI remembers the full context of this conversation
        </p>
      </div>

      {/* ── Recommendations (inline drawer) ── */}
      <div className="-mx-4 md:-mx-6">
        <RecommendationsPanel recommendations={recommendations} isLoading={recsLoading} inline />
      </div>
    </div>
  );
}
