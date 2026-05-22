'use client';

import Link from 'next/link';
import { ArrowRight, Sparkles, Zap, GitBranch, MessageSquare, ChevronRight, Star } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    icon: <Sparkles className="w-5 h-5" />,
    title: 'Contextual Intelligence',
    desc: 'Goes beyond collaborative filtering to understand your real-time context and intent.',
    color: 'bg-brand-50 text-brand-500',
  },
  {
    icon: <MessageSquare className="w-5 h-5" />,
    title: 'Conversational Retrieval',
    desc: 'Multi-turn conversations that refine recommendations as your needs evolve.',
    color: 'bg-amber-50 text-amber-500',
  },
  {
    icon: <Zap className="w-5 h-5" />,
    title: 'Cold Start Ready',
    desc: 'Delivers quality recommendations from day one with zero interaction history.',
    color: 'bg-emerald-50 text-emerald-500',
  },
  {
    icon: <GitBranch className="w-5 h-5" />,
    title: 'Cross-Domain Reasoning',
    desc: 'Bridges insights across domains — from tech to finance to health — for holistic suggestions.',
    color: 'bg-purple-50 text-purple-500',
  },
];

const stats = [
  { value: '97%', label: 'Recommendation accuracy' },
  { value: '< 2s', label: 'Average response time' },
  { value: '12+', label: 'Domains supported' },
];

const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.1, duration: 0.5, ease: 'easeOut' },
  }),
};

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-cream-50 overflow-hidden">
      {/* Nav */}
      <nav className="fixed top-0 inset-x-0 z-50 flex items-center justify-between px-6 md:px-12 h-16 bg-cream-50/80 backdrop-blur-md border-b border-cream-200">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center shadow-card">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-bold text-lg text-slate-950">KoreRec</span>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/login" className="btn-ghost text-sm">Sign in</Link>
          <Link href="/register" className="btn-primary text-sm px-4 py-2">
            Get Started <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="relative pt-32 pb-24 px-6 md:px-12 max-w-6xl mx-auto">
        {/* Background blob */}
        <div className="absolute top-16 right-0 w-[600px] h-[600px] bg-brand-100/40 rounded-full blur-3xl -z-10" />
        <div className="absolute top-40 left-20 w-[300px] h-[300px] bg-accent-100/30 rounded-full blur-3xl -z-10" />

        <motion.div
          className="flex items-center gap-2 mb-6 w-fit px-3 py-1.5 bg-brand-50 rounded-full border border-brand-100"
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
        >
          <div className="w-2 h-2 bg-brand-500 rounded-full animate-pulse-soft" />
          <span className="text-xs font-medium text-brand-600 font-mono">Powered by Agentic AI</span>
        </motion.div>

        <motion.h1
          className="font-display font-bold text-5xl md:text-7xl text-slate-950 leading-[1.05] mb-6 max-w-4xl"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          Recommendations that{' '}
          <span className="relative inline-block">
            <span className="relative z-10 text-brand-500">think</span>
            <span className="absolute bottom-1 left-0 w-full h-3 bg-brand-100 -z-10 rounded" />
          </span>{' '}
          before they suggest.
        </motion.h1>

        <motion.p
          className="text-lg md:text-xl text-slate-500 max-w-2xl leading-relaxed mb-10 font-light"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          KoreRec goes beyond &ldquo;people also liked.&rdquo; Contextual, conversational, and continuously 
          adapting — intelligence that understands who you are and what you actually need.
        </motion.p>

        <motion.div
          className="flex flex-col sm:flex-row gap-3"
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <Link href="/register" className="btn-primary">
            Start exploring <ArrowRight className="w-4 h-4" />
          </Link>
          <button className="btn-secondary">
            See how it works <ChevronRight className="w-4 h-4" />
          </button>
        </motion.div>

        {/* Stats */}
        <motion.div
          className="flex flex-wrap gap-8 mt-16"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 0.5 }}
        >
          {stats.map((s) => (
            <div key={s.label}>
              <div className="font-display font-bold text-3xl text-slate-950">{s.value}</div>
              <div className="text-sm text-slate-400 mt-0.5">{s.label}</div>
            </div>
          ))}
        </motion.div>
      </section>

      {/* Features */}
      <section className="py-24 px-6 md:px-12 max-w-6xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-sm font-mono text-brand-500 mb-3 tracking-widest uppercase">Why KoreRec</p>
          <h2 className="font-display font-bold text-4xl md:text-5xl text-slate-950">
            Built different, by design.
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((f, i) => (
            <motion.div
              key={f.title}
              className="card hover:shadow-elevated hover:-translate-y-0.5 transition-all duration-300 group"
              custom={i}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              variants={fadeUp}
            >
              <div className={`w-10 h-10 rounded-xl ${f.color} flex items-center justify-center mb-4`}>
                {f.icon}
              </div>
              <h3 className="font-display font-semibold text-lg text-slate-950 mb-2">{f.title}</h3>
              <p className="text-slate-500 text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 px-6">
        <motion.div
          className="max-w-3xl mx-auto text-center bg-gradient-to-br from-brand-500 to-brand-700 rounded-3xl p-12 shadow-glow relative overflow-hidden"
          initial={{ opacity: 0, scale: 0.96 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.1),transparent_70%)]" />
          <Star className="w-10 h-10 text-brand-200 mx-auto mb-4 opacity-80" />
          <h2 className="font-display font-bold text-3xl md:text-4xl text-white mb-4">
            Ready for smarter recommendations?
          </h2>
          <p className="text-brand-100 mb-8 text-base leading-relaxed max-w-xl mx-auto">
            Join the team exploring what happens when AI reasons before it recommends. 
            Your personalised intelligence engine awaits.
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-white text-brand-600 font-display font-semibold rounded-xl shadow-elevated hover:shadow-glow hover:-translate-y-0.5 transition-all duration-200"
          >
            Get started free <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-6 md:px-12 border-t border-cream-200 flex flex-col sm:flex-row items-center justify-between gap-4 max-w-6xl mx-auto">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 rounded-md bg-brand-500 flex items-center justify-center">
            <Sparkles className="w-3 h-3 text-white" />
          </div>
          <span className="font-display font-semibold text-sm text-slate-950">KoreRec</span>
        </div>
        <p className="text-xs text-slate-400">© 2025 KoreRec. Built for the hackathon.</p>
      </footer>
    </div>
  );
}