import Link from 'next/link';
import { Share2, Globe, MessageCircle, Mail } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-slate-900 text-slate-300 mt-20">
      <div className="max-w-7xl mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          <div>
            <h3 className="text-2xl font-bold gradient-text mb-4">ShopVerse</h3>
            <p className="text-sm leading-relaxed mb-4">
              Your premium multi-vendor marketplace for viral gadgets, fitness gear, and smart home products.
            </p>
            <div className="flex gap-3">
              {[Share2, Globe, MessageCircle, Mail].map((Icon, i) => (
                <a key={i} href="#" className="p-2 rounded-lg bg-slate-800 hover:bg-indigo-600 transition">
                  <Icon className="w-4 h-4" />
                </a>
              ))}
            </div>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Shop</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/products" className="hover:text-indigo-400 transition">All Products</Link></li>
              <li><Link href="/category/viral-mini-gadgets" className="hover:text-indigo-400 transition">Viral Gadgets</Link></li>
              <li><Link href="/category/gym-fitness" className="hover:text-indigo-400 transition">Gym & Fitness</Link></li>
              <li><Link href="/category/smart-home-kitchen" className="hover:text-indigo-400 transition">Smart Home</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Account</h4>
            <ul className="space-y-2 text-sm">
              <li><Link href="/login" className="hover:text-indigo-400 transition">Login</Link></li>
              <li><Link href="/register" className="hover:text-indigo-400 transition">Register</Link></li>
              <li><Link href="/orders" className="hover:text-indigo-400 transition">My Orders</Link></li>
              <li><Link href="/wishlist" className="hover:text-indigo-400 transition">Wishlist</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-white mb-4">Newsletter</h4>
            <p className="text-sm mb-3">Get deals and updates delivered to your inbox.</p>
            <form className="flex gap-2">
              <input type="email" placeholder="Your email" className="flex-1 px-3 py-2 rounded-lg bg-slate-800 border border-slate-700 text-sm focus:outline-none focus:border-indigo-500" />
              <button type="submit" className="p-2 rounded-lg gradient-bg">
                <Mail className="w-5 h-5 text-white" />
              </button>
            </form>
          </div>
        </div>
        <div className="border-t border-slate-800 mt-12 pt-8 text-center text-sm">
          © {new Date().getFullYear()} ShopVerse. All rights reserved.
        </div>
      </div>
    </footer>
  );
}


