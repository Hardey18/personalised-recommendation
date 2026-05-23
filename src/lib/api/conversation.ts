import apiClient from '@/lib/axios';
import { Conversation, ConversationMessage, Recommendation } from '@/types';

export const conversationService = {
  list: async (): Promise<Conversation[]> => {
    const { data } = await apiClient.get<Conversation[]>('v1/Conversation');
    return data;
  },

  start: async (): Promise<Conversation> => {
    const { data } = await apiClient.post<Conversation>('v1/Conversation/start');
    return data;
  },

  sendMessage: async (conversationId: string, message: string): Promise<ConversationMessage> => {
    const { data } = await apiClient.post<ConversationMessage>(
      `v1/Conversation/${conversationId}/message`,
      { message }
    );
    return data;
  },

  getConversation: async (conversationId: string): Promise<Conversation> => {
    const { data } = await apiClient.get<Conversation>(`v1/Conversation/${conversationId}`);
    return data;
  },

  getRecommendations: async (conversationId: string): Promise<Recommendation[]> => {
    const { data } = await apiClient.post<Recommendation[]>(
      `v1/Recommendations/conversation/${conversationId}`
    );
    return data;
  },
};
