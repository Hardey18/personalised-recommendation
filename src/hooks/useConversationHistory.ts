import { useQuery } from '@tanstack/react-query';
import { conversationService } from '@/lib/api/conversation';
import { useAuthStore } from '@/store/authStore';
import { Conversation } from '@/types';
import { parseAssistantContent, getDomainFromParsed } from './useConversation';

/** Derives a preview string and domain tag from a conversation object */
function summariseConversation(conv: Conversation) {
  // The API now returns a `title` field — use it as the preview when available.
  // Fall back to the first user message content, then a generic label.
  const firstUser = conv.messages?.find((m) => m.role === 0);
  const preview = conv.title || firstUser?.content || 'Conversation';

  // Derive a domain tag from the last assistant message's inferred context
  const lastAssistant = conv.messages
    ? [...conv.messages].reverse().find((m) => m.role === 2)
    : undefined;
  let domain: string | undefined;
  if (lastAssistant) {
    const { parsed } = parseAssistantContent(lastAssistant.content);
    domain = getDomainFromParsed(parsed);
  }

  return {
    id: conv.id,
    preview,
    startedAt: conv.startedAt,
    messageCount: conv.messages?.filter((m) => m.role === 0).length ?? 0,
    domain,
  };
}

/** Fetches the authenticated user's full conversation list from the API */
export function useConversationHistory() {
  const { isAuthenticated, userId } = useAuthStore();

  const { data, isLoading } = useQuery({
    // Keyed by userId so switching accounts always fetches fresh data
    queryKey: ['conversation-history', userId],
    queryFn: async () => {
      const conversations = await conversationService.list();
      return conversations
        .map(summariseConversation)
        .sort((a, b) => new Date(b.startedAt).getTime() - new Date(a.startedAt).getTime());
    },
    enabled: isAuthenticated && !!userId,
    staleTime: 0,
    gcTime: 5 * 60 * 1000,
  });

  return { conversations: data ?? [], isLoading };
}

/** Fetches a single conversation by ID */
export function useConversationDetail(id: string) {
  const { isAuthenticated } = useAuthStore();

  const { data, isLoading, error } = useQuery({
    queryKey: ['conversation', id],
    queryFn: async () => {
      const conv = await conversationService.getConversation(id);
      // Sort messages chronologically — API order is not guaranteed
      return {
        ...conv,
        messages: [...conv.messages].sort(
          (a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
        ),
      };
    },
    enabled: !!id && isAuthenticated,
    staleTime: 0,
  });

  return { conversation: data, isLoading, error };
}
