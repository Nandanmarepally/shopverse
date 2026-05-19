'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import MainLayout from '@/components/layout/MainLayout';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchMyOrders } from '@/store/slices/orderSlice';
import { formatPrice } from '@/lib/utils';

export default function OrdersPage() {
  const dispatch = useAppDispatch();
  const { orders } = useAppSelector((s) => s.orders);

  useEffect(() => { dispatch(fetchMyOrders()); }, [dispatch]);

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Orders</h1>
        {orders.length === 0 ? (
          <div className="text-center py-16 glass-card">
            <p className="text-slate-500 mb-4">No orders yet</p>
            <Link href="/products" className="text-indigo-600 font-semibold">Start Shopping</Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <div key={order._id} className="glass-card p-6">
                <div className="flex justify-between mb-4">
                  <div>
                    <p className="font-bold">{order.orderNumber}</p>
                    <p className="text-sm text-slate-500">{new Date(order.createdAt).toLocaleDateString()}</p>
                  </div>
                  <span className="px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 text-indigo-700 dark:bg-indigo-900 dark:text-indigo-300 capitalize">{order.status}</span>
                </div>
                <div className="flex gap-3 overflow-x-auto">
                  {order.orderItems.map((item, i) => (
                    <div key={i} className="flex items-center gap-2 shrink-0">
                      <div className="relative w-12 h-12 rounded-lg overflow-hidden"><Image src={item.image} alt="" fill className="object-cover" /></div>
                      <span className="text-sm">x{item.quantity}</span>
                    </div>
                  ))}
                </div>
                <p className="font-bold mt-4 text-right">{formatPrice(order.totalPrice)}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
