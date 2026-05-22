import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { userService } from '@/lib/api/user';
import { useAuthStore } from '@/store/authStore';
import { UpdateProfilePayload } from '@/types';
import { toast } from 'sonner';

export function useProfile() {
  const { isAuthenticated, userId } = useAuthStore();
  return useQuery({
    // Keyed by userId so switching accounts never serves cached data from the previous user
    queryKey: ['profile', userId],
    queryFn: () => userService.getProfile(),
    enabled: isAuthenticated && !!userId,
    staleTime: 5 * 60 * 1000,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const { userId, profile, setProfile } = useAuthStore();

  return useMutation({
    mutationFn: (payload: UpdateProfilePayload) => userService.updateProfile(payload),
    onSuccess: (_response, payload) => {
      // The PUT endpoint may return a partial or empty body, so we never trust
      // _response alone. Instead we merge only the fields we submitted into the
      // existing full profile object — that way no field is ever lost.
      const currentProfile =
        (queryClient.getQueryData(['profile', userId]) as typeof profile) ?? profile;

      if (currentProfile) {
        const merged = {
          ...currentProfile,
          firstName:   payload.firstName,
          lastName:    payload.lastName,
          dateOfBirth: payload.dateOfBirth ?? currentProfile.dateOfBirth,
        };

        // Update Zustand store — sidebar, header, hero card re-render immediately
        setProfile(merged);
        // Update React Query cache — profile section re-renders without a round-trip
        queryClient.setQueryData(['profile', userId], merged);
      }

      // Also schedule a background refetch so we eventually get the authoritative
      // server state (e.g. if the server normalises any field values)
      queryClient.invalidateQueries({ queryKey: ['profile', userId] });

      toast.success('Profile updated successfully ✓');
    },
    onError: () => {
      toast.error('Failed to update profile. Please try again.');
    },
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
