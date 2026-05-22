// 'use client';

// import { Recommendation } from '@/types';
// import { cn } from '@/lib/utils';
// import { TrendingUp, Tag } from 'lucide-react';
// import { motion } from 'framer-motion';

// interface RecommendationCardProps {
//   rec: Recommendation;
//   index: number;
//   featured?: boolean;
// }

// const categoryColors: Record<string, string> = {
//   Education: 'bg-blue-50 text-blue-600',
//   Technology: 'bg-purple-50 text-purple-600',
//   Business: 'bg-emerald-50 text-emerald-600',
//   Career: 'bg-amber-50 text-amber-600',
//   Finance: 'bg-rose-50 text-rose-600',
//   Health: 'bg-teal-50 text-teal-600',
// };

// export function RecommendationCard({ rec, index, featured }: RecommendationCardProps) {
//   const catColor = categoryColors[rec.category] || 'bg-slate-50 text-slate-600';
//   const scorePercent = Math.round(rec.score * 100);

//   return (
//     <motion.div
//       className={cn(
//         'card group cursor-pointer hover:shadow-elevated hover:-translate-y-0.5 transition-all duration-300',
//         featured && 'border-brand-200 bg-gradient-to-br from-white to-brand-50/30'
//       )}
//       initial={{ opacity: 0, y: 16 }}
//       animate={{ opacity: 1, y: 0 }}
//       transition={{ delay: index * 0.07, duration: 0.4 }}
//     >
//       {featured && (
//         <div className="flex items-center gap-1.5 mb-3">
//           <div className="w-1.5 h-1.5 bg-brand-500 rounded-full animate-pulse-soft" />
//           <span className="text-[10px] font-mono text-brand-500 uppercase tracking-widest">Top Pick</span>
//         </div>
//       )}

//       <div className="flex items-start justify-between gap-3 mb-3">
//         <span className={cn('tag', catColor)}>{rec.category}</span>
//         <div className="flex items-center gap-1 shrink-0">
//           <TrendingUp className="w-3.5 h-3.5 text-emerald-500" />
//           <span className="text-xs font-mono font-semibold text-emerald-600">{scorePercent}%</span>
//         </div>
//       </div>

//       <h3 className="font-display font-semibold text-slate-900 text-sm mb-2 leading-snug group-hover:text-brand-600 transition-colors">
//         {rec.title}
//       </h3>

//       <p className="text-xs text-slate-400 leading-relaxed mb-4 line-clamp-2">{rec.description}</p>

//       <div className="flex flex-wrap gap-1.5">
//         {rec.tags.slice(0, 3).map((tag) => (
//           <span key={tag} className="tag bg-cream-200 text-slate-500">
//             #{tag}
//           </span>
//         ))}
//       </div>

//       {/* Score bar */}
//       <div className="mt-4 pt-3 border-t border-cream-200">
//         <div className="flex items-center justify-between text-[10px] text-slate-400 mb-1.5">
//           <span className="font-mono">Match score</span>
//           <span className="font-mono font-medium text-slate-600">{scorePercent}%</span>
//         </div>
//         <div className="h-1 bg-cream-200 rounded-full overflow-hidden">
//           <motion.div
//             className="h-full bg-gradient-to-r from-brand-400 to-brand-500 rounded-full"
//             initial={{ width: 0 }}
//             animate={{ width: `${scorePercent}%` }}
//             transition={{ delay: index * 0.07 + 0.3, duration: 0.6, ease: 'easeOut' }}
//           />
//         </div>
//       </div>
//     </motion.div>
//   );
// }