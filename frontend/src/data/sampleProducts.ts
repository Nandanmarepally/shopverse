import { Product } from '@/types';

/** Build 5 gallery images from Unsplash photo bases */
function gallery(...photoIds: string[]): string[] {
  return photoIds.map((id) => `https://images.unsplash.com/${id}?w=900&q=85`);
}

const vendor = 'catalog-vendor';

function p(
  id: string,
  slug: string,
  title: string,
  category: string,
  subcategory: string,
  price: number,
  discountPrice: number,
  photos: string[],
  extra: Partial<Product> = {}
): Product {
  const images = gallery(...photos);
  return {
    _id: `catalog-${id}`,
    slug,
    title,
    description: extra.description || `${title} — premium quality, fast delivery across India. Perfect for everyday use with great value.`,
    price,
    discountPrice,
    category,
    subcategory,
    images,
    thumbnail: images[0],
    stock: extra.stock ?? 120,
    vendor,
    ratings: extra.ratings ?? 4.5,
    numReviews: extra.numReviews ?? 200,
    trending: extra.trending ?? false,
    featured: extra.featured ?? false,
    flashDeal: extra.flashDeal ?? false,
    sold: extra.sold ?? 500,
    tags: extra.tags ?? [category, subcategory],
    isActive: true,
    ...extra,
  };
}

/** 10 × Viral Mini Gadgets */
const viralGadgets: Product[] = [
  p('vg01', 'magnetic-phone-mount-pro', 'Magnetic Phone Mount Pro', 'Viral Mini Gadgets', 'Phone Accessories', 599, 299,
    ['photo-1601784551446-20c9e07cdbdb', 'photo-1511707171634-5f897ff02aa9', 'photo-1583394293214-28e398dfaf67', 'photo-1565849902261-83a7915110eb', 'photo-1616340186355-77d4b88b55e1'],
    { trending: true, featured: true, ratings: 4.6, numReviews: 1240, sold: 3200 }),
  p('vg02', 'rgb-led-strip-5m', 'RGB LED Strip Lights 5M', 'Viral Mini Gadgets', 'LED Lights', 1299, 799,
    ['photo-1558618666-fcd25c85f82e', 'photo-1513506003901-1e6a229e2d15', 'photo-1565814636199-8b9e8a9c8f5e', 'photo-1524484484523-648f2aabf3e0', 'photo-1494438639946-1ebd1d20bf85'],
    { trending: true, flashDeal: true, ratings: 4.7, numReviews: 2100 }),
  p('vg03', 'mini-bluetooth-speaker', 'Mini Bluetooth Speaker', 'Viral Mini Gadgets', 'Audio', 1499, 899,
    ['photo-1608043152359-507e9c6a2f5a', 'photo-1545454675-3533b543be6d', 'photo-1618366712010-f4ae9c633a1c', 'photo-1598488035139-bdbb2231d04a', 'photo-1484704849700-f032a568e944'],
    { featured: true, ratings: 4.5, numReviews: 890 }),
  p('vg04', 'usb-mini-fan', 'Portable USB Mini Fan', 'Viral Mini Gadgets', 'Mini Tools', 499, 249,
    ['photo-1527443224154-7910e5e4f2b7', 'photo-1585778227491-99c083f7c4e8', 'photo-1555255707-c0796608838f', 'photo-1518770660439-4636190af475', 'photo-1581092160562-40aa08e78837'],
    { trending: true, ratings: 4.4, numReviews: 1560 }),
  p('vg05', 'smart-ring-light', 'Smart Ring Light 10 inch', 'Viral Mini Gadgets', 'LED Lights', 1999, 1299,
    ['photo-1516035069371-29a1c244ccac', 'photo-1511285560929-80b456fea0bc', 'photo-1493225457124-a3eb161ffa5f', 'photo-1526170375885-4d8ecf77b99f', 'photo-1478737273437-5165773641d0'],
    { featured: true, ratings: 4.8, numReviews: 670 }),
  p('vg06', 'wireless-earbuds-pro', 'Wireless Earbuds Pro', 'Viral Mini Gadgets', 'Audio', 2499, 1499,
    ['photo-1590658268037-6bf12165a8df', 'photo-1572569511254-d8f925fe2cbb', 'photo-1618366712010-f4ae9c633a1c', 'photo-1505740420928-5e560c06d30e', 'photo-1487219172541-07510e8c997a'],
    { trending: true, ratings: 4.6, numReviews: 3400, sold: 5100 }),
  p('vg07', 'phone-gimbal', 'Phone Gimbal Stabilizer', 'Viral Mini Gadgets', 'Phone Accessories', 3499, 2499,
    ['photo-1516035069371-29a1c244ccac', 'photo-1526170375885-4d8ecf77b99f', 'photo-1606983340126-99ab4feaa64a', 'photo-1583394293214-28e398dfaf67', 'photo-1565849902261-83a7915110eb'],
    { ratings: 4.7, numReviews: 420 }),
  p('vg08', 'car-charger-65w', 'Car Phone Charger 65W', 'Viral Mini Gadgets', 'Phone Accessories', 899, 549,
    ['photo-1558618666-fcd25c85f82e', 'photo-1601784551446-20c9e07cdbdb', 'photo-1581092160562-40aa08e78837', 'photo-1518770660439-4636190af475', 'photo-1527443224154-7910e5e4f2b7'],
    { flashDeal: true, ratings: 4.5, numReviews: 980 }),
  p('vg09', 'mini-hd-projector', 'Mini HD Projector', 'Viral Mini Gadgets', 'Mini Tools', 8999, 6499,
    ['photo-1478737273437-5165773641d0', 'photo-1493225457124-a3eb161ffa5f', 'photo-1511285560929-80b456fea0bc', 'photo-1526170375885-4d8ecf77b99f', 'photo-1606983340126-99ab4feaa64a'],
    { featured: true, ratings: 4.4, numReviews: 310, stock: 45 }),
  p('vg10', 'digital-luggage-scale', 'Digital Luggage Scale', 'Viral Mini Gadgets', 'Mini Tools', 399, 199,
    ['photo-1585778227491-99c083f7c4e8', 'photo-1555255707-c0796608838f', 'photo-1518770660439-4636190af475', 'photo-1581092160562-40aa08e78837', 'photo-1527443224154-7910e5e4f2b7'],
    { trending: true, ratings: 4.3, numReviews: 2200 }),
];

/** 10 × Gym & Fitness */
const gymFitness: Product[] = [
  p('gf01', 'adjustable-dumbbells-20kg', 'Adjustable Dumbbell Set 20kg', 'Gym & Fitness Products', 'Dumbbells', 4999, 3499,
    ['photo-1534438327276-14e5300c3a48', 'photo-1571019614242-c5c5dee9f50e', 'photo-1517836357463-d25dfeac3438', 'photo-1549060279-7e761f704eb6', 'photo-1583454110551-21f2fa2e61e7'],
    { featured: true, ratings: 4.8, numReviews: 890, stock: 60 }),
  p('gf02', 'premium-yoga-mat-6mm', 'Premium Yoga Mat 6mm', 'Gym & Fitness Products', 'Yoga Mats', 1499, 999,
    ['photo-1601925260368-ae2f83cf8b7f', 'photo-1544367567-0f2fcb009e0b', 'photo-1506126613408-eca07ce68773', 'photo-1599901860904-17e06ed06f1c', 'photo-1571019614242-c5c5dee9f50e'],
    { trending: true, ratings: 4.6, numReviews: 2100 }),
  p('gf03', 'resistance-bands-set', 'Resistance Bands Set (5pc)', 'Gym & Fitness Products', 'Resistance Bands', 799, 449,
    ['photo-1518611012118-696072aa579a', 'photo-1574680096145-05c9c7a9b0a0', 'photo-1517836357463-d25dfeac3438', 'photo-1549060279-7e761f704eb6', 'photo-1583454110551-21f2fa2e61e7'],
    { trending: true, flashDeal: true, ratings: 4.5, numReviews: 1800 }),
  p('gf04', 'foam-roller-massage', 'Foam Roller Massage', 'Gym & Fitness Products', 'Recovery', 999, 699,
    ['photo-1599901860904-17e06ed06f1c', 'photo-1574680096145-05c9c7a9b0a0', 'photo-1518611012118-696072aa579a', 'photo-1544367567-0f2fcb009e0b', 'photo-1506126613408-eca07ce68773'],
    { ratings: 4.4, numReviews: 560 }),
  p('gf05', 'gym-gloves-pro', 'Gym Gloves Pro', 'Gym & Fitness Products', 'Accessories', 599, 399,
    ['photo-1583454110551-21f2fa2e61e7', 'photo-1534438327276-14e5300c3a48', 'photo-1571019614242-c5c5dee9f50e', 'photo-1517836357463-d25dfeac3438', 'photo-1549060279-7e761f704eb6'],
    { ratings: 4.5, numReviews: 740 }),
  p('gf06', 'speed-jump-rope', 'Speed Jump Rope', 'Gym & Fitness Products', 'Cardio', 349, 199,
    ['photo-1518611012118-696072aa579a', 'photo-1574680096145-05c9c7a9b0a0', 'photo-1517836357463-d25dfeac3438', 'photo-1549060279-7e761f704eb6', 'photo-1583454110551-21f2fa2e61e7'],
    { trending: true, ratings: 4.3, numReviews: 1100 }),
  p('gf07', 'kettlebell-8kg', 'Kettlebell 8kg', 'Gym & Fitness Products', 'Dumbbells', 1999, 1499,
    ['photo-1571019614242-c5c5dee9f50e', 'photo-1534438327276-14e5300c3a48', 'photo-1517836357463-d25dfeac3438', 'photo-1549060279-7e761f704eb6', 'photo-1583454110551-21f2fa2e61e7'],
    { featured: true, ratings: 4.7, numReviews: 430 }),
  p('gf08', 'door-pull-up-bar', 'Door Pull Up Bar', 'Gym & Fitness Products', 'Strength', 1299, 899,
    ['photo-1549060279-7e761f704eb6', 'photo-1517836357463-d25dfeac3438', 'photo-1534438327276-14e5300c3a48', 'photo-1571019614242-c5c5dee9f50e', 'photo-1583454110551-21f2fa2e61e7'],
    { ratings: 4.6, numReviews: 620 }),
  p('gf09', 'ab-roller-wheel', 'Ab Roller Wheel', 'Gym & Fitness Products', 'Core', 449, 279,
    ['photo-1574680096145-05c9c7a9b0a0', 'photo-1518611012118-696072aa579a', 'photo-1517836357463-d25dfeac3438', 'photo-1549060279-7e761f704eb6', 'photo-1583454110551-21f2fa2e61e7'],
    { flashDeal: true, ratings: 4.4, numReviews: 1500 }),
  p('gf10', 'protein-shaker-bottle', 'Protein Shaker Bottle 700ml', 'Gym & Fitness Products', 'Accessories', 299, 179,
    ['photo-1626206288813-2e5ee4b28f8b', 'photo-1571019614242-c5c5dee9f50e', 'photo-1517836357463-d25dfeac3438', 'photo-1534438327276-14e5300c3a48', 'photo-1549060279-7e761f704eb6'],
    { trending: true, ratings: 4.2, numReviews: 3200, sold: 8000 }),
];

/** 10 × Smart Home & Kitchen */
const smartHome: Product[] = [
  p('sh01', 'smart-wifi-plug-4pack', 'Smart WiFi Plug 4-Pack', 'Smart Home & Kitchen', 'Smart Lights', 2499, 1799,
    ['photo-1558002038-1055907df827', 'photo-1556911220-bff31c812dba', 'photo-1556911220-e15b29be8c8f', 'photo-1556910103-1c02745aae4d', 'photo-1556909114-f6e7ad7d4046'],
    { featured: true, flashDeal: true, ratings: 4.4, numReviews: 1670 }),
  p('sh02', 'kitchen-chopper-5in1', 'Multi-Function Kitchen Chopper', 'Smart Home & Kitchen', 'Kitchen Tools', 899, 549,
    ['photo-1556911220-e15b29be8c8f', 'photo-1556910103-1c02745aae4d', 'photo-1556909114-f6e7ad7d4046', 'photo-1556911220-bff31c812dba', 'photo-1558002038-1055907df827'],
    { trending: true, ratings: 4.3, numReviews: 2450 }),
  p('sh03', 'electric-lunch-box', 'Electric Lunch Box', 'Smart Home & Kitchen', 'Kitchen Tools', 1799, 1199,
    ['photo-1556909114-f6e7ad7d4046', 'photo-1556911220-e15b29be8c8f', 'photo-1556910103-1c02745aae4d', 'photo-1556911220-bff31c812dba', 'photo-1558002038-1055907df827'],
    { ratings: 4.5, numReviews: 780 }),
  p('sh04', 'digital-kitchen-scale', 'Digital Kitchen Scale', 'Smart Home & Kitchen', 'Kitchen Tools', 699, 449,
    ['photo-1556910103-1c02745aae4d', 'photo-1556909114-f6e7ad7d4046', 'photo-1556911220-e15b29be8c8f', 'photo-1556911220-bff31c812dba', 'photo-1558002038-1055907df827'],
    { featured: true, ratings: 4.6, numReviews: 1340 }),
  p('sh05', 'silicone-utensil-set', 'Silicone Utensil Set 12pc', 'Smart Home & Kitchen', 'Kitchen Tools', 1299, 799,
    ['photo-1556911220-bff31c812dba', 'photo-1556911220-e15b29be8c8f', 'photo-1556910103-1c02745aae4d', 'photo-1556909114-f6e7ad7d4046', 'photo-1558002038-1055907df827'],
    { ratings: 4.5, numReviews: 920 }),
  p('sh06', 'air-fryer-liners', 'Air Fryer Liners 100pc', 'Smart Home & Kitchen', 'Kitchen Tools', 349, 199,
    ['photo-1556909114-f6e7ad7d4046', 'photo-1556911220-e15b29be8c8f', 'photo-1556910103-1c02745aae4d', 'photo-1556911220-bff31c812dba', 'photo-1558002038-1055907df827'],
    { trending: true, ratings: 4.2, numReviews: 4100 }),
  p('sh07', 'cabinet-led-sensor', 'Cabinet LED Sensor Light', 'Smart Home & Kitchen', 'Smart Lights', 599, 349,
    ['photo-1558002038-1055907df827', 'photo-1556911220-bff31c812dba', 'photo-1556911220-e15b29be8c8f', 'photo-1556910103-1c02745aae4d', 'photo-1556909114-f6e7ad7d4046'],
    { flashDeal: true, ratings: 4.4, numReviews: 1890 }),
  p('sh08', 'vegetable-mandoline', 'Vegetable Cutter Mandoline', 'Smart Home & Kitchen', 'Kitchen Tools', 799, 499,
    ['photo-1556911220-e15b29be8c8f', 'photo-1556910103-1c02745aae4d', 'photo-1556909114-f6e7ad7d4046', 'photo-1556911220-bff31c812dba', 'photo-1558002038-1055907df827'],
    { ratings: 4.3, numReviews: 1100 }),
  p('sh09', 'smart-water-bottle', 'Smart Water Bottle 750ml', 'Smart Home & Kitchen', 'Organizers', 1499, 999,
    ['photo-1602143407151-7111542de6e8', 'photo-1558002038-1055907df827', 'photo-1556911220-bff31c812dba', 'photo-1556911220-e15b29be8c8f', 'photo-1556910103-1c02745aae4d'],
    { featured: true, trending: true, ratings: 4.6, numReviews: 560 }),
  p('sh10', 'spice-rack-organizer', 'Spice Rack Organizer', 'Smart Home & Kitchen', 'Organizers', 999, 649,
    ['photo-1556910103-1c02745aae4d', 'photo-1556909114-f6e7ad7d4046', 'photo-1556911220-e15b29be8c8f', 'photo-1556911220-bff31c812dba', 'photo-1558002038-1055907df827'],
    { ratings: 4.5, numReviews: 870 }),
];

export const SAMPLE_PRODUCTS: Product[] = [...viralGadgets, ...gymFitness, ...smartHome];
