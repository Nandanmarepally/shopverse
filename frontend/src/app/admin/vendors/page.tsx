'use client';

import { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import Button from '@/components/ui/Button';
import api from '@/lib/api';
import toast from 'react-hot-toast';
import { Vendor } from '@/types';

export default function AdminVendorsPage() {
  const [vendors, setVendors] = useState<Vendor[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: '', email: '', password: '', businessName: '', isApproved: true });

  const load = () => api.get('/vendors').then((r) => setVendors(r.data.data || []));
  useEffect(() => { load(); }, []);

  const createVendor = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/vendors', form);
      toast.success('Vendor created');
      setShowForm(false);
      load();
    } catch (err) {
      toast.error((err as Error).message);
    }
  };

  const approve = async (id: string) => {
    await api.put(`/vendors/${id}/approve`);
    toast.success('Vendor approved');
    load();
  };

  const block = async (id: string) => {
    await api.put(`/vendors/${id}/block`);
    toast.success('Vendor blocked');
    load();
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Vendor Management</h1>
          <Button onClick={() => setShowForm(!showForm)}>Create Vendor</Button>
        </div>
        {showForm && (
          <form onSubmit={createVendor} className="glass-card p-6 mb-8 grid md:grid-cols-2 gap-4">
            {Object.entries(form).map(([k, v]) => (
              k !== 'isApproved' ? (
                <input key={k} placeholder={k} value={v as string} onChange={(e) => setForm({ ...form, [k]: e.target.value })} className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-transparent" />
              ) : null
            ))}
            <label className="flex items-center gap-2"><input type="checkbox" checked={form.isApproved} onChange={(e) => setForm({ ...form, isApproved: e.target.checked })} /> Approve immediately</label>
            <Button type="submit" className="md:col-span-2">Create Vendor Account</Button>
          </form>
        )}
        <div className="space-y-3">
          {vendors.map((v) => (
            <div key={v._id} className="glass-card p-4 flex flex-wrap justify-between items-center gap-4">
              <div>
                <p className="font-bold">{v.businessName}</p>
                <p className="text-sm text-slate-500">{(v as Vendor & { user?: { email: string } }).user?.email}</p>
                <span className={`text-xs px-2 py-0.5 rounded-full ${v.isApproved ? 'bg-green-100 text-green-700' : 'bg-amber-100 text-amber-700'}`}>
                  {v.isApproved ? 'Approved' : 'Pending'}
                </span>
              </div>
              <div className="flex gap-2">
                {!v.isApproved && <Button size="sm" onClick={() => approve(v._id)}>Approve</Button>}
                <Button size="sm" variant="danger" onClick={() => block(v._id)}>Block</Button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
