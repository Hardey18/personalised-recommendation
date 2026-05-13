import { useMutation } from '@tanstack/react-query';
import { authService } from '@/lib/api/auth';
import { useAuthStore } from '@/store/authStore';
import { LoginPayload, ApiError } from '@/types';
import { AxiosError } from 'axios';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';

export function useLogin() {
  const { setAuth } = useAuthStore();
  const router = useRouter();

  return useMutation({
    mutationFn: (payload: LoginPayload) => authService.login(payload),
    onSuccess: (data) => {
      setAuth(data.user, data.accessToken);
      toast.success(`Welcome back, ${data.user.name}! 👋`);
      router.push('/dashboard');
    },
    onError: (error: AxiosError<ApiError>) => {
      const msg = error.response?.data?.message || 'Something went wrong. Please try again.';
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