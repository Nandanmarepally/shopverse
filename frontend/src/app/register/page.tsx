'use client';

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
import { register as registerUser } from '@/store/slices/authSlice';

const schema = z.object({
  name: z.string().min(2, 'Name required'),
  email: z.string().email('Invalid email'),
  password: z.string().min(6, 'Min 6 characters'),
  phone: z.string().optional(),
});

type FormData = z.infer<typeof schema>;

export default function RegisterPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { loading } = useAppSelector((s) => s.auth);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });

  const onSubmit = async (data: FormData) => {
    try {
      await dispatch(registerUser(data)).unwrap();
      toast.success('Account created!');
      router.push('/');
    } catch (err) {
      toast.error((err as string) || 'Registration failed');
    }
  };

  return (
    <MainLayout>
      <div className="min-h-[70vh] flex items-center justify-center px-4 py-12">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="glass-card w-full max-w-md p-8">
          <h1 className="text-2xl font-bold mb-2">Create Account</h1>
          <p className="text-slate-500 mb-6">Join ShopVerse as a customer</p>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div>
              <label className="text-sm font-medium">Full Name</label>
              <input {...register('name')} className="w-full mt-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent focus:border-indigo-500 outline-none" />
              {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium">Email</label>
              <input {...register('email')} type="email" className="w-full mt-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent focus:border-indigo-500 outline-none" />
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>}
            </div>
            <div>
              <label className="text-sm font-medium">Phone</label>
              <input {...register('phone')} className="w-full mt-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent focus:border-indigo-500 outline-none" />
            </div>
            <div>
              <label className="text-sm font-medium">Password</label>
              <input {...register('password')} type="password" className="w-full mt-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent focus:border-indigo-500 outline-none" />
              {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
            </div>
            <Button type="submit" loading={loading} className="w-full">Create Account</Button>
          </form>
          <p className="text-center text-sm mt-6 text-slate-500">
            Already have an account? <Link href="/login" className="text-indigo-600 font-semibold">Login</Link>
          </p>
        </motion.div>
      </div>
    </MainLayout>
  );
}
