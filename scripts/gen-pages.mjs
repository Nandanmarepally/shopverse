import fs from 'fs';
import path from 'path';

const base = path.join(process.cwd(), 'frontend', 'src', 'app');

const pages = {
  'checkout/page.tsx': `'use client';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import MainLayout from '@/components/layout/MainLayout';
import Button from '@/components/ui/Button';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { createOrder } from '@/store/slices/orderSlice';
import { clearCartLocal } from '@/store/slices/cartSlice';
import { formatPrice } from '@/lib/utils';

const schema = z.object({ street: z.string().min(3), city: z.string().min(2), state: z.string().min(2), zipCode: z.string().min(4), phone: z.string().min(10) });
type F = z.infer<typeof schema>;

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items, subtotal, deliveryFee, tax, total } = useAppSelector((s) => s.cart);
  const { isAuthenticated } = useAppSelector((s) => s.auth);
  const { register, handleSubmit, formState: { errors } } = useForm<F>({ resolver: zodResolver(schema) });
  const [loading, setLoading] = useState(false);

  if (!isAuthenticated) return <MainLayout><motion-skeleton className="text-center py-20"><p>Please <a href="/login" className="text-indigo-600">login</a> to checkout</p></motion-skeleton></MainLayout>;

  const onSubmit = async (data: F) => {
    setLoading(true);
    try {
      await dispatch(createOrder({ shippingAddress: { ...data, country: 'India', label: 'Home' }, paymentMethod: 'COD' })).unwrap();
      dispatch(clearCartLocal());
      toast.success('Order placed!');
      router.push('/orders');
    } catch (e) { toast.error((e as Error).message); }
    finally { setLoading(false); }
  };

  return (
    <MainLayout>
      <motion-skeleton className="max-w-7xl mx-auto px-4 py-8 grid lg:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit(onSubmit)} className="glass-card p-6 space-y-4">
          <h1 className="text-2xl font-bold">Shipping Address</h1>
          {(['street','city','state','zipCode','phone'] as const).map((f) => (
            <motion-skeleton key={f}><label className="text-sm capitalize">{f}</label>
            <input {...register(f)} className="w-full mt-1 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent" />
            {errors[f] && <p className="text-red-500 text-xs">{errors[f]?.message}</p>}</motion-skeleton>
          ))}
          <Button type="submit" loading={loading} className="w-full">Place Order (COD)</Button>
        </form>
        <motion-skeleton className="glass-card p-6 h-fit">
          <h2 className="font-bold mb-4">Order Summary ({items.length} items)</h2>
          <motion-skeleton className="space-y-2 text-sm">
            <motion-skeleton className="flex justify-between"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></motion-skeleton>
            <motion-skeleton className="flex justify-between"><span>Delivery</span><span>{formatPrice(deliveryFee)}</span></motion-skeleton>
            <motion-skeleton className="flex justify-between"><span>Tax</span><span>{formatPrice(tax)}</span></motion-skeleton>
            <motion-skeleton className="flex justify-between font-bold text-lg border-t pt-2"><span>Total</span><span>{formatPrice(total)}</span></motion-skeleton>
          </motion-skeleton>
        </motion-skeleton>
      </motion-skeleton>
    </MainLayout>
  );
}`,
};

// Fix motion-skeleton to div in generated content
for (const [rel, content] of Object.entries(pages)) {
  const fixed = content.split('motion-skeleton').join('motion-skeleton').split('motion-skeleton').join('div');
  const fp = path.join(base, rel);
  fs.mkdirSync(path.dirname(fp), { recursive: true });
  fs.writeFileSync(fp, fixed.split('motion-skeleton').join('motion-skeleton').split('motion-skeleton').join('div'));
  console.log('wrote', rel);
}
