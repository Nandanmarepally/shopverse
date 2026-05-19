'use client';

import { useMemo, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import ProductCard from '@/components/product/ProductCard';
import { filterCatalogProducts, CATALOG_PRODUCTS } from '@/lib/catalog';
import { CATEGORIES } from '@/lib/utils';

function ProductsContent() {
  const searchParams = useSearchParams();

  const filters = useMemo(
    () => ({
      category: searchParams.get('category') || '',
      keyword: searchParams.get('q') || searchParams.get('keyword') || '',
      trending: searchParams.get('trending') === 'true',
      featured: searchParams.get('featured') === 'true',
      flashDeal: searchParams.get('flashDeal') === 'true',
      minPrice: searchParams.get('minPrice') ? Number(searchParams.get('minPrice')) : undefined,
      maxPrice: searchParams.get('maxPrice') ? Number(searchParams.get('maxPrice')) : undefined,
      sort: searchParams.get('sort') || '',
    }),
    [searchParams]
  );

  const products = useMemo(() => {
    const hasFilter = Object.values(filters).some((v) => v !== '' && v !== false && v !== undefined);
    return hasFilter ? filterCatalogProducts(filters) : CATALOG_PRODUCTS;
  }, [filters]);

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">Shop Catalog</h1>
        <p className="text-slate-500 mb-8">30 products across 3 categories — frontend showcase</p>
        <div className="flex flex-col lg:flex-row gap-8">
          <aside className="lg:w-56 shrink-0 glass-card p-5 h-fit space-y-3 text-sm">
            <p className="font-semibold">Categories</p>
            {CATEGORIES.map((c) => (
              <a key={c.slug} href={`/category/${c.slug}`} className="block hover:text-indigo-600">
                {c.icon} {c.name} (10)
              </a>
            ))}
          </aside>
          <div className="flex-1">
            <p className="text-slate-500 mb-4">{products.length} products</p>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((p, i) => (
                <ProductCard key={p._id} product={p} index={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<MainLayout><div className="p-8">Loading...</div></MainLayout>}>
      <ProductsContent />
    </Suspense>
  );
}
