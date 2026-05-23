import { useState, useCallback } from 'react';
import { conversationService } from '@/lib/api/conversation';
import { Recommendation } from '@/types';

/**
 * Manages recommendations for a single conversation.
 * Call `fetchRecommendations(conversationId)` after every sendMessage —
 * the result always replaces the previous list (single list per conversation).
 */
export function useRecommendations() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const fetchRecommendations = useCallback(async (conversationId: string) => {
    setIsLoading(true);
    try {
      const recs = await conversationService.getRecommendations(conversationId);
      setRecommendations(recs ?? []);
    } catch {
      // Silently fail — recommendations are supplementary, not critical
    } finally {
      setIsLoading(false);
    }
  }, []);

  const clearRecommendations = useCallback(() => {
    setRecommendations([]);
  }, []);

  return { recommendations, isLoading, fetchRecommendations, clearRecommendations };
}
