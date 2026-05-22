import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfile } from '@/types';

interface AuthState {
  profile: UserProfile | null;
  accessToken: string | null;
  userId: string | null;
  isAuthenticated: boolean;
  setToken: (token: string, userId: string) => void;
  setProfile: (profile: UserProfile) => void;
  clearAuth: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      profile: null,
      accessToken: null,
      userId: null,
      isAuthenticated: false,
      setToken: (accessToken, userId) => {
        set({ accessToken, userId, isAuthenticated: true });
      },
      setProfile: (profile) => set({ profile }),
      clearAuth: () => {
        set({ profile: null, accessToken: null, userId: null, isAuthenticated: false });
      },
    }),
    {
      name: 'nexrec-auth',
      partialize: (state) => ({
        profile: state.profile,
        accessToken: state.accessToken,
        userId: state.userId,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
