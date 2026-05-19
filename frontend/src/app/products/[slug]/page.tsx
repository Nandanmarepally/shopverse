'use client';

import { useMemo, useState } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { Star, Minus, Plus, ShoppingCart, Truck, Shield, Images } from 'lucide-react';
import toast from 'react-hot-toast';
import MainLayout from '@/components/layout/MainLayout';
import Button from '@/components/ui/Button';
import ProductCard from '@/components/product/ProductCard';
import { formatPrice, getDiscountPercent, getEffectivePrice } from '@/lib/utils';
import { useAppDispatch } from '@/store/hooks';
import { addToCartLocal } from '@/store/slices/cartSlice';
import { getCatalogProductBySlug, getSimilarProducts } from '@/lib/catalog';

export default function ProductDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const product = useMemo(() => getCatalogProductBySlug(slug as string), [slug]);
  const similar = useMemo(() => (product ? getSimilarProducts(product) : []), [product]);
  const [selectedImage, setSelectedImage] = useState(0);
  const [qty, setQty] = useState(1);
  const dispatch = useAppDispatch();

  if (!product) {
    return (
      <MainLayout>
        <div className="text-center py-20">Product not found</div>
      </MainLayout>
    );
  }

  const discount = getDiscountPercent(product.price, product.discountPrice);
  const price = getEffectivePrice(product);

  const handleAddToCart = () => {
    dispatch(addToCartLocal({ product, quantity: qty }));
    toast.success('Added to cart!');
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-10">
          <div>
            <div className="relative aspect-square rounded-2xl overflow-hidden bg-slate-100 dark:bg-slate-800 group">
              <Image
                src={product.images[selectedImage] || product.thumbnail}
                alt={product.title}
                fill
                className="object-cover transition-transform duration-300 group-hover:scale-105"
                priority
              />
            </div>
            <p className="flex items-center gap-2 text-sm text-slate-500 mt-3 mb-2">
              <Images className="w-4 h-4" />
              {product.images.length} gallery images — click to preview
            </p>
            <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => setSelectedImage(i)}
                  className={`relative w-20 h-20 md:w-24 md:h-24 rounded-xl overflow-hidden shrink-0 border-2 transition ${
                    i === selectedImage ? 'border-indigo-500 ring-2 ring-indigo-500/30' : 'border-transparent opacity-80 hover:opacity-100'
                  }`}
                >
                  <Image src={img} alt={`${product.title} ${i + 1}`} fill className="object-cover" />
                </button>
              ))}
            </div>
          </div>
          <div>
            <p className="text-indigo-600 font-medium">{product.category}</p>
            <p className="text-sm text-slate-500">{product.subcategory}</p>
            <h1 className="text-3xl font-bold mt-1 mb-3">{product.title}</h1>
            <div className="flex items-center gap-2 mb-4">
              <Star className="w-5 h-5 fill-amber-400 text-amber-400" />
              <span className="font-semibold">{product.ratings?.toFixed(1)}</span>
              <span className="text-slate-500">({product.numReviews} reviews)</span>
            </div>
            <div className="flex items-baseline gap-3 mb-6">
              <span className="text-3xl font-bold">{formatPrice(price)}</span>
              {discount > 0 && (
                <>
                  <span className="text-xl text-slate-400 line-through">{formatPrice(product.price)}</span>
                  <span className="text-red-500 font-bold">-{discount}%</span>
                </>
              )}
            </div>
            <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">{product.description}</p>
            <div className="flex items-center gap-4 mb-6">
              <span className="font-medium">Quantity:</span>
              <div className="flex items-center gap-2 border rounded-xl p-1">
                <button type="button" onClick={() => setQty(Math.max(1, qty - 1))} className="p-2">
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-bold">{qty}</span>
                <button type="button" onClick={() => setQty(Math.min(product.stock, qty + 1))} className="p-2">
                  <Plus className="w-4 h-4" />
                </button>
              </div>
              <span className="text-sm text-slate-500">{product.stock} in stock</span>
            </div>
            <Button onClick={handleAddToCart} className="w-full gap-2 mb-8">
              <ShoppingCart className="w-5 h-5" /> Add to Cart
            </Button>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 glass-card p-3">
                <Truck className="w-5 h-5 text-indigo-500" /> Free delivery over ₹499
              </div>
              <div className="flex items-center gap-2 glass-card p-3">
                <Shield className="w-5 h-5 text-indigo-500" /> Secure checkout
              </div>
            </div>
          </div>
        </div>
        {similar.length > 0 && (
          <section className="mt-16">
            <h2 className="text-2xl font-bold mb-6">More from {product.category}</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {similar.map((p, i) => (
                <ProductCard key={p._id} product={p} index={i} />
              ))}
            </div>
          </section>
        )}
      </div>
    </MainLayout>
  );
}
