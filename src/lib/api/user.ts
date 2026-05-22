"use client"

import apiClient from '@/lib/axios';
import { UserProfile, BehaviorAnalysis, UpdateProfilePayload } from '@/types';

export const userService = {
  getProfile: async (): Promise<UserProfile> => {
    const { data } = await apiClient.get<UserProfile>('User/profile');
    return data;
  },

  updateProfile: async (payload: UpdateProfilePayload): Promise<UserProfile> => {
    const { data } = await apiClient.put<UserProfile>('User/profile', payload);
    return data;
  },

  analyzeBehavior: async (userId: string): Promise<BehaviorAnalysis> => {
    const { data } = await apiClient.post<BehaviorAnalysis>('v1/behavior/analyze', { userId });
    return data;
  },
};
