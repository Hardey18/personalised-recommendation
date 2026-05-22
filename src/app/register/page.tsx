'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import { Eye, EyeOff, Sparkles, ArrowLeft, Mail, Lock, AlertCircle, User } from 'lucide-react';
import { useRegister } from '@/hooks/useAuth';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';

const registerSchema = z.object({
  firstName: z.string().min(1, 'First name is required').min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(1, 'Last name is required').min(2, 'Last name must be at least 2 characters'),
  email: z.string().min(1, 'Email is required').email('Please enter a valid email address'),
  password: z.string().min(1, 'Password is required').min(6, 'Password must be at least 6 characters'),
});

type RegisterForm = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const [showPassword, setShowPassword] = useState(false);
  const { mutate: registerUser, isPending } = useRegister();
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, touchedFields },
  } = useForm<RegisterForm>({
    resolver: zodResolver(registerSchema),
    mode: 'onBlur',
  });

  const onSubmit = (data: RegisterForm) => {
    registerUser(data);
  };

  return (
    <div className="min-h-screen bg-cream-50 flex">
      {/* Left panel — decorative */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-brand-600 via-brand-500 to-brand-700 p-12 flex-col justify-between">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_bottom_left,rgba(251,146,60,0.2),transparent_60%)]" />
        <div className="absolute top-0 right-0 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 w-48 h-48 bg-white/5 rounded-full blur-2xl" />

        <Link href="/" className="flex items-center gap-2 z-10">
          <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center backdrop-blur-sm">
            <Sparkles className="w-4 h-4 text-white" />
          </div>
          <span className="font-display font-bold text-white text-lg">KoreRec</span>
        </Link>

        <div className="z-10">
          <div className="flex gap-2 mb-6">
            {['ML', 'AI', 'Rec Sys', 'LLM', 'RAG'].map((tag) => (
              <span key={tag} className="px-2.5 py-1 bg-white/15 backdrop-blur-sm rounded-full text-xs text-white/80 font-mono">
                {tag}
              </span>
            ))}
          </div>
          <h2 className="font-display font-bold text-4xl text-white leading-tight mb-4">
            Start your AI-driven<br />journey today.
          </h2>
          <p className="text-brand-100 text-sm leading-relaxed max-w-xs">
            Join KoreRec and experience personalised recommendations that evolve with your preferences.
          </p>
        </div>

        {/* Decorative card preview */}
        <div className="z-10 space-y-3">
          {[
            { label: 'Top recommendation', title: 'Advanced ML Course', score: '97%' },
            { label: 'Cross-domain pick', title: 'System Design Patterns', score: '93%' },
          ].map((item) => (
            <div key={item.title} className="flex items-center gap-3 bg-white/10 backdrop-blur-sm rounded-xl px-4 py-3 border border-white/10">
              <div className="w-2 h-2 bg-accent-400 rounded-full" />
              <div className="flex-1">
                <div className="text-[10px] text-white/50 font-mono uppercase tracking-wider">{item.label}</div>
                <div className="text-sm text-white font-medium">{item.title}</div>
              </div>
              <span className="text-xs font-mono text-accent-300 bg-accent-500/20 px-2 py-0.5 rounded-full">{item.score}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex flex-col">
        <div className="flex items-center justify-between p-6 lg:hidden">
          <Link href="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-brand-500 flex items-center justify-center">
              <Sparkles className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="font-display font-bold text-slate-950">KoreRec</span>
          </Link>
        </div>

        <div className="flex-1 flex items-center justify-center px-6 py-12">
          <motion.div
            className="w-full max-w-[400px]"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/" className="hidden lg:inline-flex items-center gap-1.5 text-sm text-slate-400 hover:text-slate-600 mb-8 transition-colors">
              <ArrowLeft className="w-3.5 h-3.5" />
              Back to home
            </Link>

            <div className="mb-8">
              <h1 className="font-display font-bold text-3xl text-slate-950 mb-2">Create account</h1>
              <p className="text-slate-400 text-sm">Join KoreRec and get started with AI recommendations.</p>
            </div>

            <form noValidate className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
              {/* First Name */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700" htmlFor="firstName">
                  First Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="firstName"
                    type="text"
                    placeholder="John"
                    className={cn(
                      'input-base pl-10',
                      errors.firstName && touchedFields.firstName && 'input-error'
                    )}
                    {...register('firstName')}
                  />
                </div>
                {errors.firstName && touchedFields.firstName && (
                  <motion.p
                    className="flex items-center gap-1.5 text-xs text-red-500"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                  >
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {errors.firstName.message}
                  </motion.p>
                )}
              </div>

              {/* Last Name */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700" htmlFor="lastName">
                  Last Name
                </label>
                <div className="relative">
                  <User className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="lastName"
                    type="text"
                    placeholder="Doe"
                    className={cn(
                      'input-base pl-10',
                      errors.lastName && touchedFields.lastName && 'input-error'
                    )}
                    {...register('lastName')}
                  />
                </div>
                {errors.lastName && touchedFields.lastName && (
                  <motion.p
                    className="flex items-center gap-1.5 text-xs text-red-500"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                  >
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {errors.lastName.message}
                  </motion.p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="block text-sm font-medium text-slate-700" htmlFor="email">
                  Email address
                </label>
                <div className="relative">
                  <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                    className={cn(
                      'input-base pl-10',
                      errors.email && touchedFields.email && 'input-error'
                    )}
                    {...register('email')}
                  />
                </div>
                {errors.email && touchedFields.email && (
                  <motion.p
                    className="flex items-center gap-1.5 text-xs text-red-500"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                  >
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {errors.email.message}
                  </motion.p>
                )}
              </div>


              {/* Password */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <label className="block text-sm font-medium text-slate-700" htmlFor="password">
                    Password
                  </label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="Create a password"
                    autoComplete="new-password"
                    className={cn(
                      'input-base pl-10 pr-10',
                      errors.password && touchedFields.password && 'input-error'
                    )}
                    {...register('password')}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
                {errors.password && touchedFields.password && (
                  <motion.p
                    className="flex items-center gap-1.5 text-xs text-red-500"
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                  >
                    <AlertCircle className="w-3.5 h-3.5 shrink-0" />
                    {errors.password.message}
                  </motion.p>
                )}
              </div>

              <button
                type="submit"
                disabled={isPending}
                className="btn-primary w-full mt-2"
              >
                {isPending ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Creating account…
                  </>
                ) : (
                  'Register for KoreRec'
                )}
              </button>
            </form>

            <p className="text-center text-xs text-slate-400 mt-6">
              Already have an account?{' '}
              <Link href="/login" className="text-brand-500 font-medium hover:text-brand-600 transition-colors">
                Sign in here
              </Link>
            </p>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
