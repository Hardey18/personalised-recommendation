'use client';

import { motion } from 'framer-motion';
import { useAuthStore } from '@/store/authStore';
import { useLogout } from '@/hooks/useAuth';
import { getInitials, formatDate } from '@/lib/utils';
import { mockHistory } from '@/lib/mockData';
import {
  User, Mail, Phone, Calendar, Shield, History, Zap, LogOut,
  TrendingUp, ChevronRight,
} from 'lucide-react';

export default function ProfilePage() {
  const { user } = useAuthStore();
  const logout = useLogout();

  if (!user) return null;

  const totalSearches = mockHistory.length;
  const domains = [...new Set(mockHistory.map((h) => h.domain).filter(Boolean))];

  const infoItems = [
    { label: 'Full name', value: user.name, icon: <User className="w-4 h-4" /> },
    { label: 'Email address', value: user.email, icon: <Mail className="w-4 h-4" /> },
    { label: 'Phone number', value: user.phoneNumber, icon: <Phone className="w-4 h-4" /> },
    { label: 'Member since', value: formatDate(user.createdAt), icon: <Calendar className="w-4 h-4" /> },
    { label: 'Account status', value: user.isActive ? 'Active' : 'Inactive', icon: <Shield className="w-4 h-4" />, accent: user.isActive },
  ];

  const activityItems = [
    { label: 'Total searches', value: totalSearches, icon: <History className="w-4.5 h-4.5" />, color: 'bg-brand-50 text-brand-500' },
    { label: 'Domains explored', value: domains.length, icon: <TrendingUp className="w-4.5 h-4.5" />, color: 'bg-emerald-50 text-emerald-600' },
    { label: 'AI recommendations', value: '28', icon: <Zap className="w-4.5 h-4.5" />, color: 'bg-amber-50 text-amber-500' },
  ];

  return (
    <div className="px-6 py-8 max-w-3xl mx-auto space-y-8">
      {/* Hero card */}
      <motion.div
        className="card bg-gradient-to-br from-brand-500 to-brand-700 text-white border-0 relative overflow-hidden"
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.1),transparent_70%)]" />
        <div className="relative flex items-center gap-5">
          <div className="w-16 h-16 rounded-2xl bg-white/20 backdrop-blur-sm flex items-center justify-center text-white text-xl font-display font-bold shrink-0">
            {getInitials(user.name)}
          </div>
          <div>
            <h2 className="font-display font-bold text-2xl text-white">{user.name}</h2>
            <p className="text-brand-100 text-sm mt-0.5">{user.email}</p>
            <div className="flex items-center gap-2 mt-2">
              <span className="flex items-center gap-1.5 text-xs text-brand-200">
                <Shield className="w-3 h-3" />
                {user.isActive ? 'Active account' : 'Inactive'}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Activity stats */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1, duration: 0.4 }}
      >
        <h3 className="font-display font-semibold text-slate-900 mb-4">Activity overview</h3>
        <div className="grid grid-cols-3 gap-4">
          {activityItems.map((a, i) => (
            <motion.div
              key={a.label}
              className="card text-center hover:shadow-elevated transition-all duration-200"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 + i * 0.07, duration: 0.35 }}
            >
              <div className={`w-9 h-9 rounded-xl ${a.color} flex items-center justify-center mx-auto mb-2`}>
                {a.icon}
              </div>
              <p className="font-display font-bold text-xl text-slate-950">{a.value}</p>
              <p className="text-[10px] text-slate-400 mt-0.5 leading-tight">{a.label}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      {/* Account information */}
      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2, duration: 0.4 }}
      >
        <h3 className="font-display font-semibold text-slate-900 mb-4">Account information</h3>
        <div className="card divide-y divide-cream-200 !p-0 overflow-hidden">
          {infoItems.map(({ label, value, icon, accent }) => (
            <div key={label} className="flex items-center gap-4 px-6 py-4 hover:bg-cream-50 transition-colors">
              <div className="w-8 h-8 rounded-lg bg-cream-100 flex items-center justify-center text-slate-400 shrink-0">
                {icon}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-[10px] font-mono text-slate-400 uppercase tracking-widest">{label}</p>
                <p className={`text-sm font-medium mt-0.5 truncate ${accent ? 'text-emerald-600' : 'text-slate-700'}`}>
                  {accent && <span className="inline-block w-1.5 h-1.5 bg-emerald-500 rounded-full mr-1.5 mb-0.5" />}
                  {value}
                </p>
              </div>
            </div>
          ))}
        </div>
      </motion.div>

      {/* Domains */}
      {domains.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.4 }}
        >
          <h3 className="font-display font-semibold text-slate-900 mb-4">Domains explored</h3>
          <div className="flex flex-wrap gap-2">
            {domains.map((d) => (
              <span key={d} className="px-3.5 py-1.5 bg-white border border-cream-200 rounded-xl text-sm text-slate-600 font-medium shadow-soft">
                {d}
              </span>
            ))}
          </div>
        </motion.div>
      )}

      {/* Sign out */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3, duration: 0.4 }}
      >
        <button
          onClick={logout}
          className="flex items-center gap-3 w-full card text-left hover:bg-red-50 hover:border-red-100 transition-all duration-200 group"
        >
          <div className="w-9 h-9 rounded-xl bg-red-50 flex items-center justify-center shrink-0 group-hover:bg-red-100 transition-colors">
            <LogOut className="w-4 h-4 text-red-400" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-700 group-hover:text-red-600 transition-colors">Sign out</p>
            <p className="text-xs text-slate-400">End your current session</p>
          </div>
          <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-red-400 transition-colors" />
        </button>
      </motion.div>
    </div>
  );
}