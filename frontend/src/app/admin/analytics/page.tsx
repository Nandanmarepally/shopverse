'use client';

import { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import api from '@/lib/api';
import { formatPrice } from '@/lib/utils';

export default function AdminAnalyticsPage() {
  const [data, setData] = useState<Record<string, number>>({});
  useEffect(() => { api.get('/users/dashboard').then((r) => setData(r.data.data || {})); }, []);

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Platform Analytics</h1>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {['users', 'vendors', 'products', 'orders', 'revenue'].map((k) => (
            <div key={k} className="glass-card p-6 capitalize">
              <p className="text-slate-500">{k}</p>
              <p className="text-2xl font-bold">{k === 'revenue' ? formatPrice(data[k] || 0) : data[k] || 0}</p>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
