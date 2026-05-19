'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';
import api from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { Package, ShoppingCart, Users, Store, DollarSign } from 'lucide-react';

export default function AdminDashboard() {
  const [data, setData] = useState<{
    users?: number;
    vendors?: number;
    products?: number;
    orders?: number;
    revenue?: number;
    pendingVendors?: { businessName: string; user: { email: string } }[];
  }>({});

  useEffect(() => {
    api.get('/users/dashboard').then((r) => setData(r.data.data || {}));
  }, []);

  const stats = [
    { label: 'Users', value: data.users ?? 0, icon: Users },
    { label: 'Vendors', value: data.vendors ?? 0, icon: Store },
    { label: 'Products', value: data.products ?? 0, icon: Package },
    { label: 'Orders', value: data.orders ?? 0, icon: ShoppingCart },
    { label: 'Revenue', value: formatPrice(data.revenue ?? 0), icon: DollarSign },
  ];

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Admin Dashboard</h1>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
          {stats.map((s) => (
            <div key={s.label} className="glass-card p-6">
              <s.icon className="w-8 h-8 text-indigo-500 mb-2" />
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-sm text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-3 mb-10">
          {[
            { href: '/admin/vendors', label: 'Manage Vendors' },
            { href: '/admin/products', label: 'Products' },
            { href: '/admin/users', label: 'Users' },
            { href: '/admin/analytics', label: 'Analytics' },
          ].map((l) => (
            <Link key={l.href} href={l.href} className="px-5 py-3 rounded-xl glass-card font-medium hover:shadow-lg transition">{l.label}</Link>
          ))}
        </div>
        {data.pendingVendors && data.pendingVendors.length > 0 && (
          <div className="glass-card p-6">
            <h2 className="font-bold mb-4">Pending Vendor Approvals</h2>
            {data.pendingVendors.map((v, i) => (
              <p key={i} className="text-sm py-1">{v.businessName} — {v.user?.email}</p>
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
