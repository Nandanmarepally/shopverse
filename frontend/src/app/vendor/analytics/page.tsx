'use client';

import { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import api from '@/lib/api';
import { formatPrice } from '@/lib/utils';

export default function VendorAnalyticsPage() {
  const [data, setData] = useState<Record<string, number>>({});
  useEffect(() => { api.get('/vendors/dashboard').then((r) => setData(r.data.data || {})); }, []);

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Analytics</h1>
        <div className="grid grid-cols-2 gap-4">
          <div className="glass-card p-6"><p className="text-slate-500">Revenue</p><p className="text-3xl font-bold">{formatPrice(data.totalRevenue || 0)}</p></div>
          <div className="glass-card p-6"><p className="text-slate-500">Orders</p><p className="text-3xl font-bold">{data.totalOrders || 0}</p></div>
          <div className="glass-card p-6"><p className="text-slate-500">Products</p><p className="text-3xl font-bold">{data.totalProducts || 0}</p></div>
          <div className="glass-card p-6"><p className="text-slate-500">Low Stock Items</p><p className="text-3xl font-bold text-amber-500">{data.lowStock || 0}</p></div>
        </div>
      </div>
    </MainLayout>
  );
}
