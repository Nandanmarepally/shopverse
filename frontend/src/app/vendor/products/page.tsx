'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';
import Button from '@/components/ui/Button';
import api from '@/lib/api';
import { Product } from '@/types';
import { formatPrice } from '@/lib/utils';
import toast from 'react-hot-toast';

export default function VendorProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);

  const load = () => api.get('/products/vendor/my').then((r) => setProducts(r.data.data || []));
  useEffect(() => { load(); }, []);

  const remove = async (id: string) => {
    if (!confirm('Delete this product?')) return;
    await api.delete(`/products/${id}`);
    toast.success('Deleted');
    load();
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between mb-8">
          <h1 className="text-3xl font-bold">My Products</h1>
          <Link href="/vendor/products/add"><Button>Add Product</Button></Link>
        </div>
        <div className="space-y-3">
          {products.map((p) => (
            <div key={p._id} className="glass-card p-4 flex justify-between items-center">
              <div>
                <p className="font-bold">{p.title}</p>
                <p className="text-sm text-slate-500">{formatPrice(p.price)} · Stock: {p.stock}</p>
              </div>
              <Button size="sm" variant="danger" onClick={() => remove(p._id)}>Delete</Button>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
