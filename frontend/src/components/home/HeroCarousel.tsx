'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import Button from '@/components/ui/Button';

const slides = [
  {
    title: 'Viral Mini Gadgets',
    subtitle: 'Trending tech that everyone loves',
    cta: 'Shop Gadgets',
    href: '/category/viral-mini-gadgets',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=1200',
    gradient: 'from-violet-600/90 to-indigo-900/90',
  },
  {
    title: 'Gym & Fitness Gear',
    subtitle: 'Transform your home workout',
    cta: 'Shop Fitness',
    href: '/category/gym-fitness',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=1200',
    gradient: 'from-emerald-600/90 to-teal-900/90',
  },
  {
    title: 'Smart Home & Kitchen',
    subtitle: 'Upgrade your everyday living',
    cta: 'Shop Smart Home',
    href: '/category/smart-home-kitchen',
    image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=1200',
    gradient: 'from-orange-600/90 to-rose-900/90',
  },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => setCurrent((c) => (c + 1) % slides.length), 5000);
    return () => clearInterval(timer);
  }, []);

  return (
    <section className="relative h-[420px] md:h-[520px] overflow-hidden rounded-2xl mx-4 mt-4 max-w-7xl lg:mx-auto">
      <AnimatePresence mode="wait">
        <motion.div
          key={current}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.6 }}
          className="absolute inset-0"
        >
          <Image src={slides[current].image} alt={slides[current].title} fill className="object-cover" priority />
          <div className={`absolute inset-0 bg-gradient-to-r ${slides[current].gradient}`} />
          <div className="absolute inset-0 flex items-center px-8 md:px-16">
            <div className="max-w-lg text-white">
              <motion.h1
                initial={{ y: 30, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                className="text-3xl md:text-5xl font-bold mb-3"
              >
                {slides[current].title}
              </motion.h1>
              <motion.p initial={{ y: 20, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ delay: 0.1 }} className="text-lg md:text-xl opacity-90 mb-6">
                {slides[current].subtitle}
              </motion.p>
              <Link href={slides[current].href}>
                <Button size="lg" className="gap-2">
                  {slides[current].cta} <ArrowRight className="w-5 h-5" />
                </Button>
              </Link>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
      <button onClick={() => setCurrent((c) => (c - 1 + slides.length) % slides.length)} className="absolute left-4 top-1/2 -translate-y-1/2 p-2 rounded-full glass text-white hover:bg-white/20">
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button onClick={() => setCurrent((c) => (c + 1) % slides.length)} className="absolute right-4 top-1/2 -translate-y-1/2 p-2 rounded-full glass text-white hover:bg-white/20">
        <ChevronRight className="w-6 h-6" />
      </button>
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex gap-2">
        {slides.map((_, i) => (
          <button key={i} onClick={() => setCurrent(i)} className={`w-2 h-2 rounded-full transition ${i === current ? 'bg-white w-6' : 'bg-white/50'}`} />
        ))}
      </div>
    </section>
  );
}
