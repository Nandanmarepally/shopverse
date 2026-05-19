'use client';

import { useEffect, useState } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import Button from '@/components/ui/Button';
import api from '@/lib/api';
import { User } from '@/types';
import toast from 'react-hot-toast';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const load = () => api.get('/users').then((r) => setUsers(r.data.data || []));
  useEffect(() => { load(); }, []);

  const toggleBlock = async (id: string, blocked: boolean) => {
    await api.put(`/users/${id}/${blocked ? 'unblock' : 'block'}`);
    toast.success(blocked ? 'User unblocked' : 'User blocked');
    load();
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">User Management</h1>
        {users.map((u) => (
          <div key={u._id} className="glass-card p-4 mb-3 flex justify-between items-center">
            <div><p className="font-bold">{u.name}</p><p className="text-sm text-slate-500">{u.email}</p></div>
            <Button size="sm" variant="danger" onClick={() => toggleBlock(u._id, u.isBlocked || false)}>
              {u.isBlocked ? 'Unblock' : 'Block'}
            </Button>
          </div>
        ))}
      </div>
    </MainLayout>
  );
}
