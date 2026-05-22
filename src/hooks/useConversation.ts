import { useState, useCallback, useRef } from 'react';
import { conversationService } from '@/lib/api/conversation';
import { Conversation, ConversationMessage, JsonValue, ParsedAIResponse } from '@/types';
import { toast } from 'sonner';

// ─── Dynamic AI response parser ───────────────────────────────────────────────

/**
 * Converts any JsonValue into a human-readable string for display.
 * Arrays become comma-separated, booleans become "Yes/No", nulls are skipped.
 */
function valueToString(v: JsonValue): string | null {
  if (v === null || v === undefined) return null;
  if (typeof v === 'boolean') return v ? 'Yes' : 'No';
  if (typeof v === 'number') return String(v);
  if (typeof v === 'string') return v.trim() || null;
  if (Array.isArray(v)) {
    const parts = v.map(valueToString).filter(Boolean) as string[];
    return parts.length ? parts.join(', ') : null;
  }
  // Nested object — flatten its own key:value pairs inline
  const parts = Object.entries(v)
    .map(([k, val]) => {
      const s = valueToString(val);
      return s ? `${formatKey(k)}: ${s}` : null;
    })
    .filter(Boolean) as string[];
  return parts.length ? parts.join(' · ') : null;
}

/** Converts camelCase / snake_case / kebab-case keys to Title Case */
function formatKey(key: string): string {
  return key
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/[-_]/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());
}

/**
 * Parses the assistant content string into a structured display object.
 *
 * The content format is:
 *   "I found N recommendations and inferred goals: . Summary: { ...json... }"
 * or
 *   "I found N recommendations and inferred goals: . Summary: ```json\n{ ...json... }\n```"
 *
 * The JSON can have any shape — we walk it dynamically.
 */
export function parseAssistantContent(content: string): {
  plain: string;
  parsed: ParsedAIResponse | null;
  recommendationCount: number;
} {
  // 1. Recommendation count
  const countMatch = content.match(/I found (\d+) recommendation/i);
  const recommendationCount = countMatch ? parseInt(countMatch[1]) : 0;

  // 2. Extract the raw JSON string — handles ```json...``` or bare {...}
  const fencedMatch = content.match(/```json\s*([\s\S]*?)```/i);
  const summaryMatch = content.match(/Summary:\s*(\{[\s\S]*\})/i);
  const bareMatch = content.match(/(\{[\s\S]*\})/);
  const rawJson = fencedMatch?.[1] ?? summaryMatch?.[1] ?? bareMatch?.[1] ?? null;

  let parsed: ParsedAIResponse | null = null;

  if (rawJson) {
    try {
      const obj = JSON.parse(rawJson.trim()) as Record<string, JsonValue>;

      const contextSummary =
        typeof obj['contextSummary'] === 'string' ? obj['contextSummary'] : undefined;
      const emotion =
        typeof obj['emotion'] === 'string' ? obj['emotion'] : undefined;

      // Walk every top-level key (except contextSummary / emotion which get special treatment)
      const SKIP = new Set(['contextSummary', 'emotion']);
      const sections: ParsedAIResponse['sections'] = [];

      for (const [sectionKey, sectionVal] of Object.entries(obj)) {
        if (SKIP.has(sectionKey)) continue;

        const entries: { key: string; value: string }[] = [];

        if (sectionVal !== null && typeof sectionVal === 'object' && !Array.isArray(sectionVal)) {
          // Object section — one badge per key
          for (const [k, v] of Object.entries(sectionVal as Record<string, JsonValue>)) {
            const s = valueToString(v);
            if (s && s !== 'null' && s !== 'false') {
              entries.push({ key: formatKey(k), value: s });
            }
          }
        } else {
          // Scalar or array section — treat the whole thing as one entry
          const s = valueToString(sectionVal);
          if (s && s !== 'null') {
            entries.push({ key: formatKey(sectionKey), value: s });
          }
        }

        if (entries.length > 0) {
          sections.push({ label: formatKey(sectionKey), entries });
        }
      }

      parsed = { sections, contextSummary, emotion };
    } catch {
      /* If JSON parse fails, parsed stays null — we still show the plain text */
    }
  }

  // 3. Plain text: strip boilerplate + JSON block
  const plain = content
    .replace(/```json[\s\S]*?```/gi, '')
    .replace(/Summary:\s*\{[\s\S]*\}/i, '')
    .replace(/I found \d+ recommendations? and inferred goals:\s*\.?\s*/i, '')
    .trim();

  return { plain, parsed, recommendationCount };
}

/** Returns a short domain label from parsed content for history list */
export function getDomainFromParsed(parsed: ParsedAIResponse | null): string | undefined {
  if (!parsed) return undefined;
  const domainsSection = parsed.sections.find(
    (s) => s.label.toLowerCase() === 'domains'
  );
  if (domainsSection?.entries[0]) return domainsSection.entries[0].value;
  return undefined;
}

// ─── useConversation hook ─────────────────────────────────────────────────────

/** Sort a message array chronologically by timestamp */
function sortMessages(msgs: ConversationMessage[]): ConversationMessage[] {
  return [...msgs].sort(
    (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
  );
}

export function useConversation() {
  const [conversation, setConversation] = useState<Conversation | null>(null);
  const [isStarting, setIsStarting] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const conversationRef = useRef<Conversation | null>(null);

  /** Load an existing conversation (e.g. from history) into the hook so
   *  subsequent sendMessage calls continue that same thread. */
  const loadConversation = useCallback((conv: Conversation) => {
    const sorted = { ...conv, messages: sortMessages(conv.messages) };
    conversationRef.current = sorted;
    setConversation(sorted);
  }, []);

  const sendMessage = useCallback(
    async (message: string): Promise<ConversationMessage | null> => {
      let conv = conversationRef.current;

      // ── Auto-start if no active conversation ──
      if (!conv) {
        setIsStarting(true);
        try {
          conv = await conversationService.start();
          conversationRef.current = conv;
          setConversation(conv);
        } catch {
          toast.error('Could not start a conversation. Please try again.');
          setIsStarting(false);
          return null;
        } finally {
          setIsStarting(false);
        }
      }

      setIsSending(true);

      // Optimistic user message
      const optimisticUserMsg: ConversationMessage = {
        id: `optimistic-${Date.now()}`,
        conversationId: conv.id,
        role: 0,
        content: message,
        timestamp: new Date().toISOString(),
      };
      setConversation((prev) =>
        prev ? { ...prev, messages: [...prev.messages, optimisticUserMsg] } : prev
      );

      try {
        const assistantMsg = await conversationService.sendMessage(conv.id, message);
        setConversation((prev) => {
          if (!prev) return prev;
          // Remove optimistic, append confirmed user msg + assistant reply, re-sort
          const msgs = prev.messages.filter((m) => m.id !== optimisticUserMsg.id);
          return {
            ...prev,
            messages: sortMessages([
              ...msgs,
              { ...optimisticUserMsg, id: `user-${Date.now()}` },
              assistantMsg,
            ]),
          };
        });
        return assistantMsg;
      } catch {
        setConversation((prev) =>
          prev
            ? { ...prev, messages: prev.messages.filter((m) => m.id !== optimisticUserMsg.id) }
            : prev
        );
        toast.error('Failed to send message. Please try again.');
        return null;
      } finally {
        setIsSending(false);
      }
    },
    [/* no external deps — conversationRef is stable */]
  );

  const resetConversation = useCallback(() => {
    setConversation(null);
    conversationRef.current = null;
  }, []);

  return {
    conversation,
    isStarting,
    isSending,
    loadConversation,
    sendMessage,
    resetConversation,
  };
}
