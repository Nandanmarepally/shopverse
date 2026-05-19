'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import Button from '@/components/ui/Button';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { CATEGORIES } from '@/lib/utils';

export default function AddProductPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '', description: '', price: '', discountPrice: '', category: CATEGORIES[0].name,
    subcategory: '', stock: '', trending: false, featured: false,
  });
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [images, setImages] = useState<FileList | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => fd.append(k, String(v)));
    if (thumbnail) fd.append('thumbnail', thumbnail);
    if (images) Array.from(images).forEach((f) => fd.append('images', f));
    try {
      await api.post('/products', fd, { headers: { 'Content-Type': 'multipart/form-data' } });
      toast.success('Product created!');
      router.push('/vendor/products');
    } catch (err) {
      toast.error((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Add Product</h1>
        <form onSubmit={handleSubmit} className="glass-card p-6 space-y-4">
          <input required placeholder="Title" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent" />
          <textarea required placeholder="Description" rows={4} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent" />
          <div className="grid grid-cols-2 gap-4">
            <input required type="number" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent" />
            <input type="number" placeholder="Discount Price" value={form.discountPrice} onChange={(e) => setForm({ ...form, discountPrice: e.target.value })} className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent" />
          </div>
          <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent">
            {CATEGORIES.map((c) => <option key={c.slug} value={c.name}>{c.name}</option>)}
          </select>
          <input required type="number" placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} className="w-full px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent" />
          <div><label className="text-sm">Thumbnail</label><input type="file" accept="image/*" onChange={(e) => setThumbnail(e.target.files?.[0] || null)} className="w-full mt-1" /></div>
          <div><label className="text-sm">Product Images</label><input type="file" accept="image/*" multiple onChange={(e) => setImages(e.target.files)} className="w-full mt-1" /></div>
          <Button type="submit" loading={loading} className="w-full">Create Product</Button>
        </form>
      </div>
    </MainLayout>
  );
}
