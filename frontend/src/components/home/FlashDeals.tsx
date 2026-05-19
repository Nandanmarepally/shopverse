'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Timer } from 'lucide-react';
import ProductCard from '@/components/product/ProductCard';
import { filterCatalogProducts } from '@/lib/catalog';

export default function FlashDeals() {
  const products = filterCatalogProducts({ flashDeal: true });
  const [timeLeft, setTimeLeft] = useState({ h: 5, m: 23, s: 45 });

  useEffect(() => {
    const interval = setInterval(() => {
      setTimeLeft((t) => {
        let { h, m, s } = t;
        s--;
        if (s < 0) { s = 59; m--; }
        if (m < 0) { m = 59; h--; }
        if (h < 0) { h = 23; m = 59; s = 59; }
        return { h, m, s };
      });
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  if (!products.length) return null;

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <div className="glass-card p-6 md:p-8 bg-gradient-to-r from-red-500/10 to-orange-500/10 border-red-200/30 dark:border-red-900/30">
        <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
          <div>
            <h2 className="text-2xl md:text-3xl font-bold">⚡ Flash Deals</h2>
            <p className="text-slate-500 mt-1">Limited time — add to cart instantly</p>
          </div>
          <div className="flex items-center gap-2 px-4 py-2 rounded-xl bg-red-500 text-white font-mono font-bold">
            <Timer className="w-5 h-5" />
            {String(timeLeft.h).padStart(2, '0')}:{String(timeLeft.m).padStart(2, '0')}:{String(timeLeft.s).padStart(2, '0')}
          </div>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {products.map((p, i) => (
            <ProductCard key={p._id} product={p} index={i} />
          ))}
        </div>
        <Link href="/products?flashDeal=true" className="block text-center mt-6 text-red-600 font-semibold hover:underline">
          View all flash deals →
        </Link>
      </div>
    </section>
  );
}
