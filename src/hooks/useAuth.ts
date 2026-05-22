"use client"

import { useMutation } from '@tanstack/react-query';
import { authService } from '@/lib/api/auth';
import { userService } from '@/lib/api/user';
import { useAuthStore } from '@/store/authStore';
import { LoginPayload, RegisterPayload, ApiError } from '@/types';
import { decodeJwt } from '@/lib/utils';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function useLogin() {
  const { setToken, setProfile } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    onSuccess: async (data) => {
      const claims = decodeJwt(data.token);
      if (!claims) {
        toast.error('Invalid token received. Please try again.');
        return;
      }
      // Store token first so axios interceptor can use it immediately
      setToken(data.token, claims.sub);

      // Fetch the real profile right after login
      try {
        const profile = await userService.getProfile();
        setProfile(profile);
        toast.success(`Welcome back, ${profile.firstName}! 👋`);
      } catch {
        // Profile fetch failed but login succeeded — still navigate
        toast.success('Logged in successfully');
      }

      router.push('/dashboard');
    },
    onError: (error: AxiosError<ApiError>) => {
      const msg =
        error.response?.data?.message ||
        (typeof error.response?.data === 'string' ? error.response.data : null) ||
        'Invalid credentials. Please try again.';
      toast.error(msg);
    },
  });
}

export function useRegister() {
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: RegisterPayload) => authService.register(payload),
    onSuccess: () => {
      toast.success('Account created successfully! Please sign in.');
      router.push('/login');
    },
    onError: (error: AxiosError<ApiError>) => {
      const msg =
        error.response?.data?.message ||
        (typeof error.response?.data === 'string' ? error.response.data : null) ||
        'Registration failed. Please try again.';
      toast.error(msg);
    },
  });
}

export function useLogout() {
  const { clearAuth } = useAuthStore();
  const router = useRouter();

  return () => {
    authService.logout();
    clearAuth();
    toast.success('Logged out successfully');
    router.push('/login');
  };
}
