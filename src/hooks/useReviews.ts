import { useQuery, useMutation } from '@tanstack/react-query';
import { reviewsService } from '@/lib/api/reviews';
import { SimulateReviewPayload } from '@/types';
import { toast } from 'sonner';

export function useReviewUsers(page = 1, pageSize = 10) {
  return useQuery({
    queryKey: ['review-users', page, pageSize],
    queryFn: () => reviewsService.listUsers(page, pageSize),
    staleTime: 5 * 60 * 1000,
  });
}

export function useReviewUserDetail(userId: string | null) {
  return useQuery({
    queryKey: ['review-user-detail', userId],
    queryFn: () => reviewsService.getUserDetail(userId!),
    enabled: !!userId,
    staleTime: 2 * 60 * 1000,
  });
}

export function useSimulateReview() {
  return useMutation({
    mutationFn: (payload: SimulateReviewPayload) => reviewsService.simulate(payload),
    onError: () => {
      toast.error('Simulation failed. Please try again.');
    },
  });
}
