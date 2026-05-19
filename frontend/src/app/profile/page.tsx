'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import toast from 'react-hot-toast';
import MainLayout from '@/components/layout/MainLayout';
import Button from '@/components/ui/Button';
import api from '@/lib/api';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { loadUser, logout } from '@/store/slices/authSlice';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const dispatch = useAppDispatch();
  const router = useRouter();
  const { user, isAuthenticated } = useAppSelector((s) => s.auth);
  const { register, handleSubmit, reset } = useForm({ defaultValues: { name: '', phone: '' } });

  useEffect(() => {
    if (user) reset({ name: user.name, phone: user.phone || '' });
  }, [user, reset]);

  if (!isAuthenticated) {
    return <MainLayout><div className="text-center py-20">Please login</div></MainLayout>;
  }

  const onSubmit = async (data: { name: string; phone: string }) => {
    try {
      await api.put('/auth/profile', data);
      dispatch(loadUser());
      toast.success('Profile updated');
    } catch {
      toast.error('Update failed');
    }
  };

  const handleLogout = async () => {
    await dispatch(logout());
    router.push('/');
  };

  return (
    <MainLayout>
      <div className="max-w-lg mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Profile</h1>
        <form onSubmit={handleSubmit(onSubmit)} className="glass-card p-6 space-y-4">
          <div><label className="text-sm">Email</label><input value={user?.email} disabled className="w-full mt-1 px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 opacity-60" /></div>
          <div><label className="text-sm">Name</label><input {...register('name')} className="w-full mt-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent" /></div>
          <div><label className="text-sm">Phone</label><input {...register('phone')} className="w-full mt-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent" /></div>
          <Button type="submit" className="w-full">Save Changes</Button>
          <Button type="button" variant="danger" className="w-full" onClick={handleLogout}>Logout</Button>
        </form>
      </div>
    </MainLayout>
  );
}
