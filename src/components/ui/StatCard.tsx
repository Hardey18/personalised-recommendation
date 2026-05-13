'use client';

import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  color: string;
  index?: number;
}

export function StatCard({ title, value, subtitle, icon, color, index = 0 }: StatCardProps) {
  return (
    <motion.div
      className="card flex items-start gap-4 hover:shadow-elevated transition-all duration-300"
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.08, duration: 0.4 }}
    >
      <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', color)}>
        {icon}
      </div>
      <div>
        <p className="text-xs text-slate-400 font-medium mb-1">{title}</p>
        <p className="font-display font-bold text-2xl text-slate-950">{value}</p>
        {subtitle && <p className="text-xs text-slate-400 mt-0.5">{subtitle}</p>}
      </div>
    </motion.div>
  );
}