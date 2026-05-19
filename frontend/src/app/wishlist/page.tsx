'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import MainLayout from '@/components/layout/MainLayout';
import ProductCard from '@/components/product/ProductCard';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { fetchWishlist } from '@/store/slices/wishlistSlice';

export default function WishlistPage() {
  const dispatch = useAppDispatch();
  const { items } = useAppSelector((s) => s.wishlist);
  const { isAuthenticated } = useAppSelector((s) => s.auth);

  useEffect(() => {
    if (isAuthenticated) dispatch(fetchWishlist());
  }, [dispatch, isAuthenticated]);

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>
        {!items.length ? (
          <div className="text-center py-16 glass-card">
            <p className="text-slate-500 mb-4">Your wishlist is empty</p>
            <Link href="/products" className="text-indigo-600 font-semibold">Browse Products</Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">{items.map((p, i) => <ProductCard key={p._id} product={p} index={i} />)}</div>
        )}
      </div>
    </MainLayout>
  );
}
