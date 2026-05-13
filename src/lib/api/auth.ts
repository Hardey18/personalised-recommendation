import apiClient from '@/lib/axios';
import { AuthResponse, LoginPayload } from '@/types';

export const authService = {
  login: async (payload: LoginPayload): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>('auth/login', payload);
    return data;
  },
  logout: () => {
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
  },
};