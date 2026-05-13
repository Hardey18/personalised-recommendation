'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { motion } from 'framer-motion';
import {
  Sparkles, LayoutDashboard, History, User, LogOut, ChevronLeft,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useLogout } from '@/hooks/useAuth';
import { useAuthStore } from '@/store/authStore';
import { getInitials } from '@/lib/utils';
import { useState } from 'react';

const navItems = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/history', label: 'History', icon: History },
  { href: '/profile', label: 'Profile', icon: User },
];

export function Sidebar() {
  const pathname = usePathname();
  const logout = useLogout();
  const { user } = useAuthStore();
  const [collapsed, setCollapsed] = useState(false);

  return (
    <motion.aside
      className="hidden md:flex flex-col h-screen sticky top-0 bg-white border-r border-cream-200 shadow-soft transition-all duration-300 z-20"
      animate={{ width: collapsed ? 72 : 240 }}
      transition={{ duration: 0.25, ease: 'easeInOut' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-3 px-4 h-16 border-b border-cream-200 shrink-0">
        <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center shadow-card shrink-0">
          <Sparkles className="w-4 h-4 text-white" />
        </div>
        {!collapsed && (
          <motion.span
            className="font-display font-bold text-slate-950 text-base"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            KoreRec
          </motion.span>
        )}
      </div>

      {/* Nav */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {navItems.map(({ href, label, icon: Icon }) => {
          const active = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 group',
                active
                  ? 'bg-brand-50 text-brand-600'
                  : 'text-slate-500 hover:bg-cream-100 hover:text-slate-800'
              )}
              title={collapsed ? label : undefined}
            >
              <Icon className={cn('w-5 h-5 shrink-0', active ? 'text-brand-500' : 'text-slate-400 group-hover:text-slate-600')} />
              {!collapsed && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                  {label}
                </motion.span>
              )}
              {active && !collapsed && (
                <div className="ml-auto w-1.5 h-1.5 bg-brand-500 rounded-full" />
              )}
            </Link>
          );
        })}
      </nav>

      {/* Bottom: user + logout */}
      <div className="border-t border-cream-200 p-3 space-y-1 shrink-0">
        <button
          onClick={logout}
          className={cn(
            'flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-slate-400 hover:bg-red-50 hover:text-red-500 transition-all duration-150'
          )}
          title={collapsed ? 'Sign out' : undefined}
        >
          <LogOut className="w-4 h-4 shrink-0" />
          {!collapsed && <span>Sign out</span>}
        </button>

        {user && (
          <div className={cn(
            'flex items-center gap-3 px-3 py-2.5 rounded-xl bg-cream-100 mt-1',
            collapsed && 'justify-center'
          )}>
            <div className="w-7 h-7 rounded-lg bg-brand-500 flex items-center justify-center text-white text-xs font-display font-bold shrink-0">
              {getInitials(user.name)}
            </div>
            {!collapsed && (
              <div className="min-w-0">
                <p className="text-xs font-semibold text-slate-800 truncate">{user.name}</p>
                <p className="text-[10px] text-slate-400 truncate">{user.email}</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Collapse toggle */}
      <button
        title='Left'
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-20 w-6 h-6 bg-white border border-cream-200 rounded-full flex items-center justify-center shadow-soft hover:bg-cream-100 transition-colors z-10"
      >
        <ChevronLeft className={cn('w-3 h-3 text-slate-400 transition-transform', collapsed && 'rotate-180')} />
      </button>
    </motion.aside>
  );
}