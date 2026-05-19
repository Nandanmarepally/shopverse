export const formatPrice = (price: number) =>
  new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);

export const getDiscountPercent = (price: number, discountPrice: number) => {
  if (!discountPrice || discountPrice >= price) return 0;
  return Math.round(((price - discountPrice) / price) * 100);
};

export const getEffectivePrice = (product: { price: number; discountPrice?: number }) =>
  product.discountPrice && product.discountPrice > 0 && product.discountPrice < product.price
    ? product.discountPrice
    : product.price;

export const cn = (...classes: (string | boolean | undefined | null)[]) =>
  classes.filter(Boolean).join(' ');

export const CATEGORIES = [
  {
    name: 'Viral Mini Gadgets',
    slug: 'viral-mini-gadgets',
    icon: '⚡',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=400',
  },
  {
    name: 'Gym & Fitness Products',
    slug: 'gym-fitness',
    icon: '💪',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=400',
  },
  {
    name: 'Smart Home & Kitchen',
    slug: 'smart-home-kitchen',
    icon: '🏠',
    image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=400',
  },
];
