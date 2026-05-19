'use client';

import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';
import api from '@/lib/api';
import { Review } from '@/types';

export default function ReviewsSection() {
  const [reviews, setReviews] = useState<Review[]>([]);

  useEffect(() => {
    api.get('/reviews/featured').then((res) => setReviews(res.data.data || [])).catch(() => {});
  }, []);

  const fallback = [
    { _id: '1', user: { name: 'Priya S.' }, rating: 5, comment: 'Amazing quality gadgets! Fast delivery and great packaging.', product: { title: 'LED Strip' } },
    { _id: '2', user: { name: 'Rahul M.' }, rating: 5, comment: 'Best fitness equipment at unbeatable prices. Highly recommend ShopVerse!', product: { title: 'Yoga Mat' } },
    { _id: '3', user: { name: 'Anita K.' }, rating: 4, comment: 'Smart home products work perfectly. Customer support was excellent.', product: { title: 'Smart Plug' } },
  ] as Review[];

  const display = reviews.length ? reviews : fallback;

  return (
    <section className="max-w-7xl mx-auto px-4 py-16">
      <h2 className="text-2xl md:text-3xl font-bold text-center mb-10">What Our Customers Say</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {display.map((review, i) => (
          <motion.div
            key={review._id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            viewport={{ once: true }}
            className="glass-card p-6 relative"
          >
            <Quote className="w-8 h-8 text-indigo-200 dark:text-indigo-800 absolute top-4 right-4" />
            <div className="flex gap-1 mb-3">
              {Array.from({ length: 5 }).map((_, j) => (
                <Star key={j} className={`w-4 h-4 ${j < review.rating ? 'fill-amber-400 text-amber-400' : 'text-slate-300'}`} />
              ))}
            </div>
            <p className="text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">&ldquo;{review.comment}&rdquo;</p>
            <p className="font-semibold">{typeof review.user === 'object' ? review.user.name : 'Customer'}</p>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
