'use client';

import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ShoppingCart, Star } from 'lucide-react';
import { Product } from '@/types';
import { formatPrice, getDiscountPercent, getEffectivePrice } from '@/lib/utils';
import { useAppDispatch } from '@/store/hooks';
import { addToCartLocal } from '@/store/slices/cartSlice';
import toast from 'react-hot-toast';

interface ProductCardProps {
  product: Product;
  index?: number;
}

export default function ProductCard({ product, index = 0 }: ProductCardProps) {
  const dispatch = useAppDispatch();
  const discount = getDiscountPercent(product.price, product.discountPrice);
  const effectivePrice = getEffectivePrice(product);
  const image = product.thumbnail || product.images?.[0] || '/placeholder.png';
  const imageCount = product.images?.length ?? 0;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCartLocal({ product, quantity: 1 }));
    toast.success('Added to cart!');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.05 }}
      whileHover={{ y: -6 }}
      className="group"
    >
      <Link href={`/products/${product.slug}`}>
        <div className="glass-card overflow-hidden transition-shadow hover:shadow-xl hover:shadow-indigo-500/10">
          <div className="relative aspect-square overflow-hidden bg-slate-100 dark:bg-slate-800">
            <Image
              src={image}
              alt={product.title}
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-110"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
            {imageCount > 1 && (
              <span className="absolute bottom-2 left-2 px-2 py-0.5 text-[10px] font-semibold rounded-md bg-black/60 text-white">
                {imageCount} photos
              </span>
            )}
            {discount > 0 && (
              <span className="absolute top-2 left-2 px-2 py-1 text-xs font-bold bg-red-500 text-white rounded-lg">
                -{discount}%
              </span>
            )}
            {product.trending && (
              <span className="absolute top-2 right-2 px-2 py-1 text-xs font-bold bg-amber-500 text-white rounded-lg">
                🔥 Trending
              </span>
            )}
            <button
              type="button"
              onClick={handleAddToCart}
              className="absolute bottom-2 right-2 p-2.5 rounded-full gradient-bg shadow-lg opacity-0 group-hover:opacity-100 transition-all hover:scale-110"
              aria-label="Add to cart"
            >
              <ShoppingCart className="w-4 h-4 text-white" />
            </button>
          </div>
          <div className="p-4">
            <p className="text-xs text-indigo-500 font-medium mb-1">{product.category}</p>
            <h3 className="font-semibold text-sm line-clamp-2 mb-2 group-hover:text-indigo-600 transition">
              {product.title}
            </h3>
            <div className="flex items-center gap-1 mb-2">
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span className="text-xs font-medium">{product.ratings?.toFixed(1) || '0.0'}</span>
              <span className="text-xs text-slate-400">({product.numReviews || 0})</span>
            </div>
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-lg">{formatPrice(effectivePrice)}</span>
              {discount > 0 && (
                <span className="text-sm text-slate-400 line-through">{formatPrice(product.price)}</span>
              )}
            </div>
          </div>
        </div>
      </Link>
    </motion.div>
  );
}
