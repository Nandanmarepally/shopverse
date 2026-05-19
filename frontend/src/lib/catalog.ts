import { Product } from '@/types';
import { SAMPLE_PRODUCTS } from '@/data/sampleProducts';

export const CATALOG_PRODUCTS: Product[] = SAMPLE_PRODUCTS;

export function getCatalogProductBySlug(slug: string): Product | undefined {
  return CATALOG_PRODUCTS.find((p) => p.slug === slug);
}

export function getCatalogProductById(id: string): Product | undefined {
  return CATALOG_PRODUCTS.find((p) => p._id === id);
}

export function getProductsByCategorySlug(categorySlug: string): Product[] {
  const map: Record<string, string> = {
    'viral-mini-gadgets': 'Viral Mini Gadgets',
    'gym-fitness': 'Gym & Fitness Products',
    'smart-home-kitchen': 'Smart Home & Kitchen',
  };
  const name = map[categorySlug];
  if (!name) return [];
  return CATALOG_PRODUCTS.filter((p) => p.category === name);
}

export function getProductsByCategoryName(categoryName: string): Product[] {
  return CATALOG_PRODUCTS.filter((p) => p.category === categoryName);
}

export function filterCatalogProducts(options: {
  category?: string;
  keyword?: string;
  trending?: boolean;
  featured?: boolean;
  flashDeal?: boolean;
  minPrice?: number;
  maxPrice?: number;
  sort?: string;
}): Product[] {
  let list = [...CATALOG_PRODUCTS];

  if (options.category) list = list.filter((p) => p.category === options.category);
  if (options.trending) list = list.filter((p) => p.trending);
  if (options.featured) list = list.filter((p) => p.featured);
  if (options.flashDeal) list = list.filter((p) => p.flashDeal);
  if (options.keyword) {
    const q = options.keyword.toLowerCase();
    list = list.filter(
      (p) =>
        p.title.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        p.category.toLowerCase().includes(q)
    );
  }
  if (options.minPrice != null) list = list.filter((p) => getEffective(p) >= options.minPrice!);
  if (options.maxPrice != null) list = list.filter((p) => getEffective(p) <= options.maxPrice!);

  if (options.sort === 'price') list.sort((a, b) => getEffective(a) - getEffective(b));
  else if (options.sort === '-price') list.sort((a, b) => getEffective(b) - getEffective(a));
  else if (options.sort === '-ratings') list.sort((a, b) => b.ratings - a.ratings);
  else if (options.sort === '-sold') list.sort((a, b) => (b.sold || 0) - (a.sold || 0));
  else list.sort((a, b) => (b.trending ? 1 : 0) - (a.trending ? 1 : 0));

  return list;
}

export function getSimilarProducts(product: Product, limit = 8): Product[] {
  return CATALOG_PRODUCTS.filter(
    (p) => p.category === product.category && p._id !== product._id
  ).slice(0, limit);
}

function getEffective(p: Product) {
  return p.discountPrice > 0 && p.discountPrice < p.price ? p.discountPrice : p.price;
}

export function isCatalogProduct(product: Product | { _id?: string }) {
  return Boolean(product._id?.startsWith('catalog-'));
}
