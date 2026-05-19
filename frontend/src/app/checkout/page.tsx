'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import toast from 'react-hot-toast';
import MainLayout from '@/components/layout/MainLayout';
import Button from '@/components/ui/Button';
import { useAppSelector } from '@/store/hooks';
import { clearCartLocal } from '@/store/slices/cartSlice';
import { useAppDispatch } from '@/store/hooks';
import { formatPrice } from '@/lib/utils';

const schema = z.object({
  street: z.string().min(3),
  city: z.string().min(2),
  state: z.string().min(2),
  zipCode: z.string().min(4),
  phone: z.string().min(10),
});

type FormData = z.infer<typeof schema>;

export default function CheckoutPage() {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const { items, subtotal, deliveryFee, tax, total } = useAppSelector((s) => s.cart);
  const { register, handleSubmit, formState: { errors } } = useForm<FormData>({ resolver: zodResolver(schema) });
  const [loading, setLoading] = useState(false);

  if (!items.length) {
    return (
      <MainLayout>
        <div className="text-center py-20">
          <p className="mb-4">Your cart is empty</p>
          <Link href="/products" className="text-indigo-600 font-semibold">Browse products</Link>
        </div>
      </MainLayout>
    );
  }

  const onSubmit = async (_data: FormData) => {
    setLoading(true);
    await new Promise((r) => setTimeout(r, 800));
    dispatch(clearCartLocal());
    toast.success('Order placed! (Demo — no payment)');
    setLoading(false);
    router.push('/orders');
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-8 grid lg:grid-cols-2 gap-8">
        <form onSubmit={handleSubmit(onSubmit)} className="glass-card p-6 space-y-4">
          <h1 className="text-2xl font-bold">Shipping Address</h1>
          {(['street', 'city', 'state', 'zipCode', 'phone'] as const).map((field) => (
            <div key={field}>
              <label className="text-sm font-medium capitalize">{field === 'zipCode' ? 'ZIP Code' : field}</label>
              <input {...register(field)} className="w-full mt-1 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent focus:border-indigo-500 outline-none" />
              {errors[field] && <p className="text-red-500 text-xs mt-1">{errors[field]?.message}</p>}
            </div>
          ))}
          <Button type="submit" loading={loading} className="w-full">Place Order (Demo COD)</Button>
        </form>
        <div className="glass-card p-6 h-fit">
          <h2 className="font-bold mb-4">Order Summary ({items.length} items)</h2>
          <div className="space-y-2 text-sm">
            <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
            <div className="flex justify-between"><span>Delivery</span><span>{formatPrice(deliveryFee)}</span></div>
            <div className="flex justify-between"><span>Tax</span><span>{formatPrice(tax)}</span></div>
            <div className="flex justify-between font-bold text-lg border-t pt-2"><span>Total</span><span>{formatPrice(total)}</span></div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
