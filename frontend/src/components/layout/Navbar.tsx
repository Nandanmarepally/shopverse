'use client';

import Link from 'next/link';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Search, ShoppingCart, Heart, User, Menu, X, Sun, Moon,
  ChevronDown, Zap, Dumbbell, Home,
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { useAppSelector } from '@/store/hooks';
import { CATEGORIES } from '@/lib/utils';

const megaMenu = [
  { name: 'Viral Mini Gadgets', slug: 'viral-mini-gadgets', icon: Zap },
  { name: 'Gym & Fitness', slug: 'gym-fitness', icon: Dumbbell },
  { name: 'Smart Home & Kitchen', slug: 'smart-home-kitchen', icon: Home },
];

export default function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const { theme, setTheme } = useTheme();
  const { isAuthenticated, user } = useAppSelector((s) => s.auth);
  const { itemCount } = useAppSelector((s) => s.cart);

  const dashboardLink =
    user?.role === 'admin' ? '/admin/dashboard' :
    user?.role === 'vendor' ? '/vendor/dashboard' : '/profile';

  return (
    <header className="sticky top-0 z-50 glass border-b border-slate-200/50 dark:border-slate-700/50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16 gap-4">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <div className="w-9 h-9 rounded-xl gradient-bg flex items-center justify-center text-white font-bold text-lg">
              S
            </div>
            <span className="font-bold text-xl gradient-text hidden sm:block">ShopVerse</span>
          </Link>

          <div className="hidden md:flex flex-1 max-w-xl relative">
            <form action="/search" className="w-full">
              <input
                name="q"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search products..."
                className="w-full pl-11 pr-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-indigo-500 focus:outline-none transition"
              />
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            </form>
          </div>

          <nav className="hidden lg:flex items-center gap-1">
            <div
              className="relative"
              onMouseEnter={() => setMegaOpen(true)}
              onMouseLeave={() => setMegaOpen(false)}
            >
              <button className="flex items-center gap-1 px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition text-sm font-medium">
                Categories <ChevronDown className="w-4 h-4" />
              </button>
              <AnimatePresence>
                {megaOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    className="absolute top-full left-0 mt-2 w-80 glass-card p-4 shadow-xl"
                  >
                    {megaMenu.map((cat) => (
                      <Link
                        key={cat.slug}
                        href={`/category/${cat.slug}`}
                        className="flex items-center gap-3 p-3 rounded-xl hover:bg-indigo-50 dark:hover:bg-indigo-950/50 transition"
                      >
                        <cat.icon className="w-5 h-5 text-indigo-500" />
                        <span className="font-medium">{cat.name}</span>
                      </Link>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
            <Link href="/products" className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition text-sm font-medium">Products</Link>
            <Link href="/products?trending=true" className="px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition text-sm font-medium">Trending</Link>
          </nav>

          <div className="flex items-center gap-1 sm:gap-2">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            {isAuthenticated && user?.role === 'user' && (
              <Link href="/wishlist" className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition relative hidden sm:block">
                <Heart className="w-5 h-5" />
              </Link>
            )}
            <Link href="/cart" className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition relative">
              <ShoppingCart className="w-5 h-5" />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 gradient-bg text-white text-xs rounded-full flex items-center justify-center font-bold">
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Link>
            {isAuthenticated ? (
              <Link href={dashboardLink} className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition">
                <User className="w-5 h-5" />
              </Link>
            ) : (
              <Link href="/login" className="hidden sm:block px-4 py-2 rounded-xl gradient-bg text-white text-sm font-semibold">
                Login
              </Link>
            )}
            <button onClick={() => setMenuOpen(!menuOpen)} className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
              {menuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="lg:hidden border-t border-slate-200 dark:border-slate-700 overflow-hidden"
          >
            <div className="p-4 space-y-2">
              <form action="/search" className="relative mb-3">
                <input name="q" placeholder="Search..." className="w-full pl-10 pr-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800" />
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              </form>
              {CATEGORIES.map((cat) => (
                <Link key={cat.slug} href={`/category/${cat.slug}`} onClick={() => setMenuOpen(false)}
                  className="block px-3 py-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800">
                  {cat.icon} {cat.name}
                </Link>
              ))}
              {!isAuthenticated && (
                <Link href="/login" onClick={() => setMenuOpen(false)} className="block text-center py-2 gradient-bg text-white rounded-xl font-semibold">
                  Login / Register
                </Link>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}

