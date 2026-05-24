'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, History, User, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/history',   label: 'History',   icon: History },
  { href: '/reviews',   label: 'Reviews',   icon: Star },
  { href: '/profile',   label: 'Profile',   icon: User },
];

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 inset-x-0 z-20 bg-white border-t border-cream-200 flex items-stretch h-16 safe-area-pb">
      {navItems.map(({ href, label, icon: Icon }) => {
        const active = pathname === href || pathname.startsWith(href + '/');
        return (
          <Link
            key={href}
            href={href}
            className={cn(
              'flex-1 flex flex-col items-center justify-center gap-0.5 text-[10px] font-medium transition-colors',
              active ? 'text-brand-500' : 'text-slate-400'
            )}
          >
            <Icon className={cn('w-5 h-5', active ? 'text-brand-500' : 'text-slate-400')} />
            {label}
          </Link>
        );
      })}
    </nav>
  );
}
