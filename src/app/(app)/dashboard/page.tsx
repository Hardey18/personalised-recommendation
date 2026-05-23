'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQueryClient } from '@tanstack/react-query';
import { useAuthStore } from '@/store/authStore';
import { useConversation, parseAssistantContent } from '@/hooks/useConversation';
import { useRecommendations } from '@/hooks/useRecommendations';
import { RecommendationsPanel } from '@/components/features/RecommendationsPanel';
import { ConversationMessage, ParsedAIResponse } from '@/types';
import { Sparkles, Send, Plus, MessageSquare, Zap, Brain } from 'lucide-react';
import { cn } from '@/lib/utils';

// ─── Section colour map ───────────────────────────────────────────────────────

const SECTION_COLORS: Record<string, string> = {
  goals:       'bg-brand-50 border-brand-100 text-brand-700',
  preferences: 'bg-purple-50 border-purple-100 text-purple-700',
  constraints: 'bg-amber-50 border-amber-100 text-amber-700',
  domains:     'bg-emerald-50 border-emerald-100 text-emerald-700',
};
function sectionColor(label: string) {
  return SECTION_COLORS[label.toLowerCase()] ?? 'bg-slate-50 border-slate-100 text-slate-700';
}

// ─── Inferred context card ────────────────────────────────────────────────────

function InferredContextCard({ parsed }: { parsed: ParsedAIResponse }) {
  if (!parsed.sections.length && !parsed.contextSummary && !parsed.emotion) return null;
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.97 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.25 }}
      className="mt-3 bg-brand-50/60 border border-brand-100 rounded-xl p-3 space-y-3"
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5">
          <Brain className="w-3.5 h-3.5 text-brand-400" />
          <span className="text-[10px] font-mono text-brand-500 uppercase tracking-widest">Inferred context</span>
        </div>
        {parsed.emotion && (
          <span className="text-[10px] font-mono px-2 py-0.5 bg-white border border-brand-100 rounded-full text-brand-500 capitalize">
            {parsed.emotion}
          </span>
        )}
      </div>
      {parsed.sections.map((section) => (
        <div key={section.label}>
          <p className="text-[10px] font-mono text-slate-400 uppercase tracking-wider mb-1.5">{section.label}</p>
          <div className="flex flex-wrap gap-1.5">
            {section.entries.map((entry) => (
              <span key={entry.key} className={cn('inline-flex items-center gap-1 px-2 py-1 rounded-lg text-xs border', sectionColor(section.label))}>
                <span className="opacity-60 font-mono text-[10px]">{entry.key}:</span>
                <span className="font-medium capitalize">{entry.value}</span>
              </span>
            ))}
          </div>
        </div>
      ))}
      {parsed.contextSummary && (
        <p className="text-xs text-slate-500 italic border-t border-brand-100 pt-2 leading-relaxed">{parsed.contextSummary}</p>
      )}
    </motion.div>
  );
}

// ─── Chat message bubble ──────────────────────────────────────────────────────

function ChatMessage({ message }: { message: ConversationMessage }) {
  const isUser = message.role === 0;
  const time = new Date(message.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

  if (isUser) {
    return (
      <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} className="flex justify-end">
        <div className="max-w-[75%] bg-brand-500 text-white rounded-2xl rounded-tr-sm px-4 py-3 shadow-card">
          <p className="text-sm leading-relaxed">{message.content}</p>
          <p className="text-[10px] text-brand-200 mt-1.5 text-right font-mono">{time}</p>
        </div>
      </motion.div>
    );
  }

  if (message.role === 2) {
    const { plain, parsed, recommendationCount } = parseAssistantContent(message.content);
    return (
      <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.3 }} className="flex gap-3">
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
            {plain
              ? <p className="text-sm text-slate-700 leading-relaxed">{plain}</p>
              : <p className="text-sm text-slate-400 italic">Analysing your request…</p>
            }
            <p className="text-[10px] text-slate-300 mt-2 font-mono">{time}</p>
          </div>
          {parsed && <InferredContextCard parsed={parsed} />}
        </div>
      </motion.div>
    );
  }
  return null;
}

// ─── Typing indicator ─────────────────────────────────────────────────────────

function TypingIndicator() {
  return (
    <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 8 }} className="flex gap-3">
      <div className="w-7 h-7 rounded-lg bg-brand-100 flex items-center justify-center shrink-0">
        <Sparkles className="w-3.5 h-3.5 text-brand-500 animate-pulse-soft" />
      </div>
      <div className="bg-white border border-cream-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-soft">
        <div className="flex gap-1.5 items-center h-5">
          {[0, 1, 2].map((i) => (
            <span key={i} className="w-1.5 h-1.5 bg-brand-300 rounded-full animate-bounce" style={{ animationDelay: `${i * 0.15}s` }} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

const STARTER_PROMPTS = [
  'I need a pair of sneakers for running',
  'Recommend some books on machine learning',
  'Suggest productivity tools for remote teams',
  'Find me beginner resources for investing',
];

// ─── Main page ────────────────────────────────────────────────────────────────

export default function DashboardPage() {
  const { profile, userId } = useAuthStore();
  const queryClient = useQueryClient();

  const [input, setInput] = useState('');
  const [hasStarted, setHasStarted] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const { conversation, isSending, isStarting, sendMessage, resetConversation } = useConversation();
  const { recommendations, isLoading: recsLoading, fetchRecommendations, clearRecommendations } = useRecommendations();

  const messages = conversation?.messages ?? [];
  const conversationId = conversation?.id;
  const hasRecs = recommendations.length > 0 || recsLoading;

  const hour = new Date().getHours();
  const greeting = hour < 12 ? 'Good morning' : hour < 17 ? 'Good afternoon' : 'Good evening';
  const firstName = profile?.firstName ?? 'there';

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isSending]);

  const handleSend = async () => {
    const text = input.trim();
    if (!text || isSending) return;
    setInput('');
    setHasStarted(true);
    const result = await sendMessage(text);
    if (result && conversationId) {
      // Fetch recommendations after every send — replaces the previous list
      fetchRecommendations(conversationId);
    } else if (result) {
      // conversationId wasn't available yet (first message), use the one from the result
      fetchRecommendations(result.conversationId);
    }
    queryClient.invalidateQueries({ queryKey: ['conversation-history', userId] });
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSend(); }
  };

  const handleStarter = (prompt: string) => {
    setInput(prompt);
    setHasStarted(true);
    inputRef.current?.focus();
  };

  const handleReset = () => {
    resetConversation();
    clearRecommendations();
    setHasStarted(false);
    setInput('');
  };

  return (
    // Outer container: side-by-side on desktop, stacked on mobile
    <div className="flex h-[calc(100vh-4rem)]">

      {/* ── Left: chat column ── */}
      <div className={cn(
        'flex flex-col flex-1 min-w-0 transition-all duration-300',
        hasRecs ? 'lg:max-w-[60%]' : 'max-w-3xl mx-auto w-full'
      )}>
        <div className="flex flex-col h-full px-4 md:px-6">

          {/* Empty state */}
          <AnimatePresence>
            {!hasStarted && messages.length === 0 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4 }}
                className="flex-1 flex flex-col items-center justify-center text-center pb-8"
              >
                <div className="w-14 h-14 rounded-2xl bg-brand-500 flex items-center justify-center shadow-glow mb-5">
                  <Sparkles className="w-7 h-7 text-white" />
                </div>
                <p className="text-sm text-slate-400 mb-1">{greeting} 👋</p>
                <h2 className="font-display font-bold text-2xl md:text-3xl text-slate-950 mb-3">
                  What are you looking for, {firstName}?
                </h2>
                <p className="text-sm text-slate-400 max-w-sm leading-relaxed mb-8">
                  Describe what you need in plain language — I&apos;ll reason through your context and surface the most relevant recommendations.
                </p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 w-full max-w-lg">
                  {STARTER_PROMPTS.map((prompt) => (
                    <button
                      key={prompt}
                      onClick={() => handleStarter(prompt)}
                      className="text-left px-4 py-3 bg-white border border-cream-200 rounded-xl text-sm text-slate-600 hover:border-brand-300 hover:bg-brand-50/50 hover:text-brand-700 transition-all duration-150 shadow-soft group"
                    >
                      <span className="text-brand-400 mr-1.5 group-hover:text-brand-500">→</span>
                      {prompt}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Messages */}
          {(hasStarted || messages.length > 0) && (
            <div className="flex-1 overflow-y-auto py-6 space-y-5 scroll-smooth">
              {/* Conversation header */}
              <div className="flex items-center justify-between mb-2 sticky top-0 bg-cream-50/80 backdrop-blur-sm py-2 -mx-4 px-4 z-10">
                <div className="flex items-center gap-2">
                  <MessageSquare className="w-4 h-4 text-slate-400" />
                  <span className="text-xs font-medium text-slate-500">
                    {conversation
                      ? `Conversation · ${messages.filter(m => m.role === 0).length} message${messages.filter(m => m.role === 0).length !== 1 ? 's' : ''}`
                      : 'Starting…'}
                  </span>
                </div>
                <button onClick={handleReset} className="flex items-center gap-1.5 text-xs text-slate-400 hover:text-slate-600 transition-colors">
                  <Plus className="w-3.5 h-3.5" /> New conversation
                </button>
              </div>

              {messages.map((msg) => <ChatMessage key={msg.id} message={msg} />)}

              <AnimatePresence>
                {isSending && <TypingIndicator />}
              </AnimatePresence>

              <div ref={messagesEndRef} />
            </div>
          )}

          {/* Input bar */}
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
                placeholder="Describe what you're looking for…"
                rows={2}
                className="w-full px-4 pt-3.5 pb-2 bg-transparent text-sm text-slate-800 placeholder:text-slate-300 focus:outline-none resize-none leading-relaxed"
              />
              <div className="flex items-center justify-between px-3 pb-2.5">
                <p className="text-[10px] text-slate-300 font-mono flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> AI-powered · press Enter to send
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
                  {isSending || isStarting
                    ? <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    : <Send className="w-3.5 h-3.5" />
                  }
                  {isSending ? 'Thinking…' : isStarting ? 'Starting…' : 'Send'}
                </button>
              </div>
            </div>
            <p className="text-center text-[10px] text-slate-300 mt-2">Multi-turn · contextual · agentic reasoning</p>
          </div>

          {/* Mobile: inline recommendations drawer below input */}
          <div className="lg:hidden -mx-4 md:-mx-6">
            <RecommendationsPanel recommendations={recommendations} isLoading={recsLoading} inline />
          </div>
        </div>
      </div>

      {/* ── Right: recommendations sidebar (desktop only) ── */}
      <AnimatePresence>
        {hasRecs && (
          <motion.div
            initial={{ opacity: 0, x: 32, width: 0 }}
            animate={{ opacity: 1, x: 0, width: '40%' }}
            exit={{ opacity: 0, x: 32, width: 0 }}
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            className="hidden lg:flex flex-col border-l border-cream-200 bg-white overflow-hidden shrink-0"
            style={{ maxWidth: 400 }}
          >
            <RecommendationsPanel recommendations={recommendations} isLoading={recsLoading} />
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
