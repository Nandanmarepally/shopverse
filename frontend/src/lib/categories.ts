export const SLUG_TO_CATEGORY: Record<string, string> = {
  'viral-mini-gadgets': 'Viral Mini Gadgets',
  'gym-fitness': 'Gym & Fitness Products',
  'smart-home-kitchen': 'Smart Home & Kitchen',
};

export const getCategoryName = (slug: string) => SLUG_TO_CATEGORY[slug] || slug;
