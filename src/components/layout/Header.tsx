'use client';

import { usePathname } from 'next/navigation';
import { Bell, Search } from 'lucide-react';
import { useAuthStore } from '@/store/authStore';
import { getInitials } from '@/lib/utils';
import Link from 'next/link';

const pageTitles: Record<string, { title: string; desc: string }> = {
  '/dashboard': { title: 'Dashboard', desc: 'Discover personalised recommendations' },
  '/history': { title: 'Search History', desc: 'Review and revisit your past searches' },
  '/profile': { title: 'My Profile', desc: 'Manage your account and preferences' },
};

export function Header() {
  const pathname = usePathname();
  const { profile: user } = useAuthStore();

  // Match exact or dynamic routes
  const matchedKey = Object.keys(pageTitles).find(
    (k) => pathname === k || pathname.startsWith(k + '/')
  );
  const page = matchedKey ? pageTitles[matchedKey] : { title: 'NexRec', desc: '' };

  return (
    <header className="h-16 bg-white/80 backdrop-blur-md border-b border-cream-200 flex items-center justify-between px-6 sticky top-0 z-10 shrink-0">
      <div>
        <h1 className="font-display font-bold text-base text-slate-950">{page.title}</h1>
        {page.desc && (
          <p className="text-xs text-slate-400 hidden sm:block">{page.desc}</p>
        )}
      </div>

      <div className="flex items-center gap-2">
        <button className="btn-ghost w-9 h-9 p-0 relative" aria-label="Notifications">
          <Bell className="w-4.5 h-4.5" />
          <span className="absolute top-2 right-2 w-1.5 h-1.5 bg-accent-500 rounded-full" />
        </button>

        {user && (
          <Link
            href="/profile"
            className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-cream-100 transition-colors"
          >
            <div className="w-7 h-7 rounded-lg bg-brand-500 flex items-center justify-center text-white text-xs font-display font-bold">
              {getInitials(`${user.firstName} ${user.lastName}`)}
            </div>
            <span className="text-sm font-medium text-slate-700 hidden sm:block">{user.firstName} {user.lastName}</span>
          </Link>
        )}
      </div>
    </header>
  );
}