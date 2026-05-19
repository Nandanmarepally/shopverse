'use client';

import Image from 'next/image';
import Link from 'next/link';
import { Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import { motion } from 'framer-motion';
import toast from 'react-hot-toast';
import MainLayout from '@/components/layout/MainLayout';
import Button from '@/components/ui/Button';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateQtyLocal, removeLocal } from '@/store/slices/cartSlice';
import { formatPrice } from '@/lib/utils';

export default function CartPage() {
  const dispatch = useAppDispatch();
  const { items, subtotal, deliveryFee, tax, total } = useAppSelector((s) => s.cart);

  if (!items.length) {
    return (
      <MainLayout>
        <div className="max-w-lg mx-auto text-center py-24 px-4">
          <ShoppingBag className="w-16 h-16 mx-auto text-slate-300 mb-4" />
          <h2 className="text-2xl font-bold mb-2">Your cart is empty</h2>
          <p className="text-slate-500 mb-6">Browse our 30 sample products</p>
          <Link href="/products"><Button>Continue Shopping</Button></Link>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold mb-8">Shopping Cart</h1>
        <div className="grid lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <motion.div key={item._id} layout className="glass-card p-4 flex gap-4">
                <div className="relative w-24 h-24 rounded-xl overflow-hidden shrink-0 bg-slate-100">
                  <Image src={item.product.thumbnail || item.product.images?.[0]} alt={item.product.title} fill className="object-cover" />
                </div>
                <div className="flex-1 min-w-0">
                  <Link href={`/products/${item.product.slug}`} className="font-semibold hover:text-indigo-600 line-clamp-2">
                    {item.product.title}
                  </Link>
                  <p className="text-indigo-600 font-bold mt-1">{formatPrice(item.price)}</p>
                  <div className="flex items-center gap-3 mt-3">
                    <button
                      type="button"
                      onClick={() => {
                        if (item.quantity <= 1) dispatch(removeLocal(item._id));
                        else dispatch(updateQtyLocal({ itemId: item._id, quantity: item.quantity - 1 }));
                      }}
                      className="p-1 rounded-lg border"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="font-semibold w-8 text-center">{item.quantity}</span>
                    <button
                      type="button"
                      onClick={() => {
                        if (item.quantity >= item.product.stock) {
                          toast.error('Max stock reached');
                          return;
                        }
                        dispatch(updateQtyLocal({ itemId: item._id, quantity: item.quantity + 1 }));
                      }}
                      className="p-1 rounded-lg border"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        dispatch(removeLocal(item._id));
                        toast.success('Removed');
                      }}
                      className="ml-auto p-2 text-red-500"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
                <p className="font-bold shrink-0">{formatPrice(item.price * item.quantity)}</p>
              </motion.div>
            ))}
          </div>
          <div className="glass-card p-6 h-fit space-y-4">
            <h3 className="font-bold text-lg">Order Summary</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span>{formatPrice(subtotal)}</span></div>
              <div className="flex justify-between"><span>Delivery</span><span>{deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee)}</span></div>
              <div className="flex justify-between"><span>Tax (18% GST)</span><span>{formatPrice(tax)}</span></div>
              <div className="flex justify-between font-bold text-lg border-t pt-2"><span>Total</span><span>{formatPrice(total)}</span></div>
            </div>
            <Link href="/checkout"><Button className="w-full">Proceed to Checkout</Button></Link>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
