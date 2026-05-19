import MainLayout from '@/components/layout/MainLayout';
import HeroCarousel from '@/components/home/HeroCarousel';
import CategoryGrid from '@/components/home/CategoryGrid';
import ProductSection from '@/components/home/ProductSection';
import FlashDeals from '@/components/home/FlashDeals';
import ReviewsSection from '@/components/home/ReviewsSection';
import Newsletter from '@/components/home/Newsletter';
import {
  getProductsByCategoryName,
  filterCatalogProducts,
} from '@/lib/catalog';

export default function HomePage() {
  const viral = getProductsByCategoryName('Viral Mini Gadgets');
  const gym = getProductsByCategoryName('Gym & Fitness Products');
  const smartHome = getProductsByCategoryName('Smart Home & Kitchen');
  const trending = filterCatalogProducts({ trending: true });

  return (
    <MainLayout>
      <HeroCarousel />
      <ProductSection
        title="🔥 Trending Now"
        subtitle="What everyone is buying"
        products={trending}
        href="/products?trending=true"
        limit={8}
      />
      <CategoryGrid />
      <ProductSection
        title="⚡ Viral Mini Gadgets"
        subtitle="10 viral picks — tap to view & add to cart"
        products={viral}
        href="/category/viral-mini-gadgets"
        limit={8}
      />
      <ProductSection
        title="💪 Gym & Fitness"
        subtitle="10 products for your home workout"
        products={gym}
        href="/category/gym-fitness"
        limit={8}
      />
      <ProductSection
        title="🏠 Smart Home & Kitchen"
        subtitle="10 smart essentials for daily living"
        products={smartHome}
        href="/category/smart-home-kitchen"
        limit={8}
      />
      <FlashDeals />
      <ReviewsSection />
      <Newsletter />
    </MainLayout>
  );
}
