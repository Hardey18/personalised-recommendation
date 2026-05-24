import apiClient from '@/lib/axios';
import {
  ReviewUsersResponse,
  ReviewUserDetail,
  SimulateReviewPayload,
  SimulateReviewResponse,
} from '@/types';

export const reviewsService = {
  listUsers: async (page = 1, pageSize = 10): Promise<ReviewUsersResponse> => {
    const { data } = await apiClient.get<ReviewUsersResponse>(
      `v1/reviews/users?page=${page}&pageSize=${pageSize}`
    );
    return data;
  },

  getUserDetail: async (userId: string, page = 1, pageSize = 10): Promise<ReviewUserDetail> => {
    const { data } = await apiClient.get<ReviewUserDetail>(
      `v1/reviews/users/${userId}?page=${page}&pageSize=${pageSize}`
    );
    return data;
  },

  simulate: async (payload: SimulateReviewPayload): Promise<SimulateReviewResponse> => {
    const { data } = await apiClient.post<SimulateReviewResponse>(
      'v1/reviews/simulate',
      payload
    );
    return data;
  },
};
