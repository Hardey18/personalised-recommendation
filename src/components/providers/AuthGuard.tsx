"use client"

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { userService } from '@/lib/api/user';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, profile, setProfile } = useAuthStore();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }
    // Re-hydrate profile if not already loaded (e.g. after a page refresh)
    if (!profile) {
      userService.getProfile().then(setProfile).catch(() => {
        // If profile fetch fails (expired token etc.), let the 401 interceptor handle it
      });
    }
  }, [isAuthenticated, profile, setProfile, router]);

  if (!isAuthenticated) return null;

  return <>{children}</>;
}
