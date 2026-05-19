'use client';

import { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import api from '@/lib/api';
import { Product } from '@/types';

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  useEffect(() => { api.get('/products/admin/all').then((r) => setProducts(r.data.data || [])); }, []);

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">All Products</h1>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead><tr className="border-b"><th className="text-left p-3">Title</th><th className="text-left p-3">Category</th><th className="text-left p-3">Stock</th><th className="text-left p-3">Active</th></tr></thead>
            <tbody>{products.map((p) => (
              <tr key={p._id} className="border-b border-slate-100 dark:border-slate-800">
                <td className="p-3">{p.title}</td><td className="p-3">{p.category}</td><td className="p-3">{p.stock}</td>
                <td className="p-3">{p.isActive !== false ? 'Yes' : 'No'}</td>
              </tr>
            ))}</tbody>
          </table>
        </div>
      </div>
    </MainLayout>
  );
}
