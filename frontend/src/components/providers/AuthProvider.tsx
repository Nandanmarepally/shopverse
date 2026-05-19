'use client';

import { useEffect } from 'react';
import { useAppDispatch } from '@/store/hooks';
import { loadUser } from '@/store/slices/authSlice';

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(loadUser());
    }
  }, [dispatch]);

  return <>{children}</>;
}

