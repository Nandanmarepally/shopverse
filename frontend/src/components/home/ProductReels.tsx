'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Play } from 'lucide-react';
import api from '@/lib/api';
import { Product } from '@/types';
import { formatPrice, getEffectivePrice } from '@/lib/utils';

export default function ProductReels() {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    api.get('/products', { params: { trending: 'true', limit: 6 } }).then((res) => setProducts(res.data.data || []));
  }, []);

  return (
    <section className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-2xl md:text-3xl font-bold mb-6">📱 Product Reels</h2>
      <div className="flex gap-4 overflow-x-auto scrollbar-hide pb-4">
        {products.map((product, i) => (
          <motion.div
            key={product._id}
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: i * 0.05 }}
            viewport={{ once: true }}
            className="shrink-0 w-40 md:w-48"
          >
            <Link href={`/products/${product.slug || product._id}`}>
              <div className="relative aspect-[9/16] rounded-2xl overflow-hidden group">
                <Image
                  src={product.thumbnail || product.images[0]}
                  alt={product.title}
                  fill
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
                <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition">
                  <div className="w-12 h-12 rounded-full bg-white/20 backdrop-blur flex items-center justify-center">
                    <Play className="w-6 h-6 text-white fill-white" />
                  </div>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                  <p className="text-xs font-medium line-clamp-2">{product.title}</p>
                  <p className="text-sm font-bold mt-1">{formatPrice(getEffectivePrice(product))}</p>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
