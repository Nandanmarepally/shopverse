'use client';

import { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import api from '@/lib/api';
import { Order } from '@/types';
import { formatPrice } from '@/lib/utils';

export default function VendorOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  useEffect(() => { api.get('/orders/vendor').then((r) => setOrders(r.data.data || [])); }, []);

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Vendor Orders</h1>
        {orders.map((o) => (
          <div key={o._id} className="glass-card p-4 mb-3">
            <p className="font-bold">{o.orderNumber}</p>
            <p className="text-sm capitalize">{o.status} · {formatPrice(o.totalPrice)}</p>
          </div>
        ))}
      </div>
    </MainLayout>
  );
}
