import { useQuery, useMutation } from '@tanstack/react-query';
import { userService } from '@/lib/api/user';
import { useAuthStore } from '@/store/authStore';

export function useProfile() {
  const { isAuthenticated } = useAuthStore();
  return useQuery({
    queryKey: ['profile'],
    queryFn: () => userService.getProfile(),
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000,
  });
}

export function useBehaviorAnalysis() {
  const { userId } = useAuthStore();
  return useQuery({
    queryKey: ['behavior', userId],
    queryFn: () => userService.analyzeBehavior(userId!),
    enabled: !!userId,
    staleTime: 10 * 60 * 1000,
  });
}
