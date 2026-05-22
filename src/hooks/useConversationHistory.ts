import { useQuery } from '@tanstack/react-query';
import { conversationService } from '@/lib/api/conversation';
import { useAuthStore } from '@/store/authStore';
import { Conversation } from '@/types';
import { parseAssistantContent, getDomainFromParsed } from './useConversation';

const STORAGE_KEY = 'nexrec-conversation-ids';

export function getStoredConversationIds(userId: string): string[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = localStorage.getItem(`${STORAGE_KEY}-${userId}`);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function storeConversationId(userId: string, id: string) {
  if (typeof window === 'undefined') return;
  const existing = getStoredConversationIds(userId);
  if (!existing.includes(id)) {
    localStorage.setItem(
      `${STORAGE_KEY}-${userId}`,
      JSON.stringify([id, ...existing])
    );
  }
}

/** Derives preview text and domain label from a conversation */
function summariseConversation(conv: Conversation) {
  const firstUser = conv.messages.find((m) => m.role === 0);
  const lastAssistant = [...conv.messages].reverse().find((m) => m.role === 2);

  let domain: string | undefined;
  if (lastAssistant) {
    const { parsed } = parseAssistantContent(lastAssistant.content);
    domain = getDomainFromParsed(parsed);
  }

  return {
    id: conv.id,
    preview: firstUser?.content ?? 'Conversation',
    startedAt: conv.startedAt,
    messageCount: conv.messages.filter((m) => m.role === 0).length,
    domain,
  };
}

/** Lists all conversations (local ID registry → fetch each from API) */
export function useConversationHistory() {
  const { userId } = useAuthStore();

  const { data, isLoading } = useQuery({
    queryKey: ['conversation-history', userId],
    queryFn: async () => {
      if (!userId) return [];
      const ids = getStoredConversationIds(userId);
      if (ids.length === 0) return [];

      const results = await Promise.allSettled(
        ids.map((id) => conversationService.getConversation(id))
      );

      return results
        .filter((r): r is PromiseFulfilledResult<Conversation> => r.status === 'fulfilled')
        .map((r) => summariseConversation(r.value))
        .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
    },
    enabled: !!userId,
    staleTime: 0,          // always re-fetch when invalidated
    gcTime: 5 * 60 * 1000,
  });

  return { conversations: data ?? [], isLoading };
}

/** Fetches a single conversation by ID */
export function useConversationDetail(id: string) {
  const { isAuthenticated } = useAuthStore();

  const { data, isLoading, error } = useQuery({
    queryKey: ['conversation', id],
    queryFn: () => conversationService.getConversation(id),
    enabled: !!id && isAuthenticated,
    staleTime: 0,
  });

  return { conversation: data, isLoading, error };
}
