'use client';

import { motion } from 'framer-motion';
import { Mail } from 'lucide-react';
import toast from 'react-hot-toast';
import Button from '@/components/ui/Button';

export default function Newsletter() {
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    toast.success('Thanks for subscribing!');
  };

  return (
    <section className="max-w-7xl mx-auto px-4 py-12 mb-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        className="rounded-2xl gradient-bg p-8 md:p-12 text-center text-white"
      >
        <Mail className="w-12 h-12 mx-auto mb-4 opacity-80" />
        <h2 className="text-2xl md:text-3xl font-bold mb-2">Stay in the Loop</h2>
        <p className="opacity-90 mb-6 max-w-md mx-auto">Subscribe for exclusive deals, new arrivals, and flash sale alerts.</p>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            required
            placeholder="Enter your email"
            className="flex-1 px-4 py-3 rounded-xl text-slate-900 focus:outline-none"
          />
          <Button type="submit" variant="secondary" className="whitespace-nowrap">
            Subscribe
          </Button>
        </form>
      </motion.div>
    </section>
  );
}
