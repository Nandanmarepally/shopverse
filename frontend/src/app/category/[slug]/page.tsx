'use client';

import { useParams } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import ProductCard from '@/components/product/ProductCard';
import { getProductsByCategorySlug } from '@/lib/catalog';
import { getCategoryName } from '@/lib/categories';

export default function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const categoryName = getCategoryName(slug as string);
  const products = getProductsByCategorySlug(slug as string);

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-2">{categoryName}</h1>
        <p className="text-slate-500 mb-8">
          {products.length} products · 5 images each · view details & add to cart
        </p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {products.map((p, i) => (
            <ProductCard key={p._id} product={p} index={i} />
          ))}
        </div>
      </div>
    </MainLayout>
  );
}
