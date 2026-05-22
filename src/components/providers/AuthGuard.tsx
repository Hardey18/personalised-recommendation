'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@/store/authStore';
import { userService } from '@/lib/api/user';

export function AuthGuard({ children }: { children: React.ReactNode }) {
  const { isAuthenticated, profile, setProfile } = useAuthStore();
  const router = useRouter();

  // Zustand's persist middleware rehydrates asynchronously from localStorage.
  // On first render isAuthenticated is always false — we must wait for hydration
  // before deciding whether to redirect, otherwise every refresh sends the user
  // to /login and then straight to /dashboard regardless of where they were.
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    // useAuthStore.persist.hasHydrated() is true once localStorage has been read
    const unsub = useAuthStore.persist.onFinishHydration(() => setHydrated(true));
    // In case hydration already finished before this effect ran
    if (useAuthStore.persist.hasHydrated()) setHydrated(true);
    return unsub;
  }, []);

  useEffect(() => {
    if (!hydrated) return; // wait — don't act on the initial false state
    if (!isAuthenticated) {
      router.replace('/login');
      return;
    }
    // Re-hydrate profile if not already loaded (e.g. after a page refresh)
    if (!profile) {
      userService.getProfile().then(setProfile).catch(() => {
        // If profile fetch fails (expired token etc.), the 401 interceptor handles it
      });
    }
  }, [hydrated, isAuthenticated, profile, setProfile, router]);

  // Render nothing while waiting for hydration — avoids a flash of wrong content
  if (!hydrated) return null;
  if (!isAuthenticated) return null;

  return <>{children}</>;
}
