'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';
import api from '@/lib/api';
import { formatPrice } from '@/lib/utils';
import { Package, ShoppingCart, AlertTriangle, DollarSign } from 'lucide-react';

export default function VendorDashboard() {
  const [data, setData] = useState<{
    totalProducts?: number;
    totalOrders?: number;
    totalRevenue?: number;
    lowStock?: number;
  }>({});

  useEffect(() => {
    api.get('/vendors/dashboard').then((r) => setData(r.data.data || {}));
  }, []);

  const stats = [
    { label: 'Products', value: data.totalProducts ?? 0, icon: Package },
    { label: 'Orders', value: data.totalOrders ?? 0, icon: ShoppingCart },
    { label: 'Revenue', value: formatPrice(data.totalRevenue ?? 0), icon: DollarSign },
    { label: 'Low Stock', value: data.lowStock ?? 0, icon: AlertTriangle },
  ];

  const links = [
    { href: '/vendor/products', label: 'Manage Products' },
    { href: '/vendor/products/add', label: 'Add Product' },
    { href: '/vendor/orders', label: 'Orders' },
    { href: '/vendor/analytics', label: 'Analytics' },
  ];

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Vendor Dashboard</h1>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          {stats.map((s) => (
            <div key={s.label} className="glass-card p-6">
              <s.icon className="w-8 h-8 text-indigo-500 mb-2" />
              <p className="text-2xl font-bold">{s.value}</p>
              <p className="text-sm text-slate-500">{s.label}</p>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-3">
          {links.map((l) => (
            <Link key={l.href} href={l.href} className="px-5 py-3 rounded-xl glass-card hover:shadow-lg transition font-medium">
              {l.label}
            </Link>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
