'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import MainLayout from '@/components/layout/MainLayout';
import Button from '@/components/ui/Button';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { login } from '@/store/slices/authSlice';

const schema = z.object({
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type FormData = z.infer<typeof schema>;

export default function LoginPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading, isAuthenticated, user } = useAppSelector((s) => s.auth);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });

  useEffect(() => {
    if (isAuthenticated && user) {
      if (user.role === 'admin') router.push('/admin/dashboard');
      else if (user.role === 'vendor') router.push('/vendor/dashboard');
      else router.push('/');
    }
  }, [isAuthenticated, user, router]);

  const onSubmit = async (data: FormData) => {
    try {
      const result = await dispatch(login(data)).unwrap();
      toast.success('Welcome back!');
      if (result.user.role === 'admin') router.push('/admin/dashboard');
      else if (result.user.role === 'vendor') router.push('/vendor/dashboard');
      else router.push('/');
    } catch (err) {
      toast.error((err as string) || 'Login failed');
    }
  };

  return (
    <MainLayout>
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card w-full max-w-md p-8">
          <h1 className="text-2xl font-bold mb-2">Welcome Back</h1>
          <p className="text-slate-500 mb-6">Sign in to your ShopVerse account</p>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Email</label>
              <input {...register('email')} type="email" className="w-full mt-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent focus:border-indigo-500 outline-none" />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium">Password</label>
              <input {...register('password')} type="password" className="w-full mt-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent focus:border-indigo-500 outline-none" />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>
            <Button type="submit" loading={loading} className="w-full">Sign In</Button>
          </form>
          <p className="text-center text-sm mt-6 text-slate-500">
            Don&apos;t have an account? <Link href="/register" className="text-indigo-600 font-semibold">Register</Link>
          </p>
          <p className="text-xs text-center mt-4 text-slate-400">Vendors: accounts are created by admin only</p>
        </motion.div>
      </div>
    </MainLayout>
  );
}
