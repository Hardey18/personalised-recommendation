import apiClient from '@/lib/axios';
import { LoginPayload, LoginResponse, RegisterPayload, RegisterResponse } from '@/types';

export const authService = {
  login: async (payload: LoginPayload): Promise<LoginResponse> => {
    const { data } = await apiClient.post<LoginResponse>('Auth/login', payload);
    return data;
  },
  register: async (payload: RegisterPayload): Promise<RegisterResponse> => {
    const { data } = await apiClient.post<RegisterResponse>('Auth/register', payload);
    return data;
  },
  logout: () => {
    // Nothing server-side needed; token is stateless
  },
};