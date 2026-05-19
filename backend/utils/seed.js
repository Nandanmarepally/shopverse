import dotenv from 'dotenv';
import mongoose from 'mongoose';
import User from '../models/User.js';
import Vendor from '../models/Vendor.js';
import Category from '../models/Category.js';
import Product from '../models/Product.js';

dotenv.config();

const categories = [
  {
    name: 'Viral Mini Gadgets',
    slug: 'viral-mini-gadgets',
    description: 'Trending mini gadgets everyone is talking about',
    image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600',
    subcategories: [
      { name: 'Phone Accessories', slug: 'phone-accessories' },
      { name: 'LED Lights', slug: 'led-lights' },
      { name: 'Mini Tools', slug: 'mini-tools' },
    ],
  },
  {
    name: 'Gym & Fitness Products',
    slug: 'gym-fitness',
    description: 'Premium fitness gear for your workout goals',
    image: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?w=600',
    subcategories: [
      { name: 'Dumbbells', slug: 'dumbbells' },
      { name: 'Yoga Mats', slug: 'yoga-mats' },
      { name: 'Resistance Bands', slug: 'resistance-bands' },
    ],
  },
  {
    name: 'Smart Home & Kitchen',
    slug: 'smart-home-kitchen',
    description: 'Smart appliances and kitchen essentials',
    image: 'https://images.unsplash.com/photo-1556911220-bff31c812dba?w=600',
    subcategories: [
      { name: 'Smart Lights', slug: 'smart-lights' },
      { name: 'Kitchen Tools', slug: 'kitchen-tools' },
      { name: 'Organizers', slug: 'organizers' },
    ],
  },
];

const sampleProducts = (vendorId) => [
  {
    title: 'Magnetic Phone Mount Pro',
    description: 'Ultra-strong magnetic car mount with 360° rotation. Compatible with all smartphones.',
    price: 599,
    discountPrice: 299,
    category: 'Viral Mini Gadgets',
    subcategory: 'Phone Accessories',
    images: ['https://images.unsplash.com/photo-1601784551446-20c9e07cdbdb?w=600'],
    stock: 150,
    vendor: vendorId,
    trending: true,
    featured: true,
    ratings: 4.5,
    numReviews: 128,
  },
  {
    title: 'RGB LED Strip Lights 5M',
    description: 'Smart RGB LED strip with app control, music sync, and 16 million colors.',
    price: 1299,
    discountPrice: 799,
    category: 'Viral Mini Gadgets',
    subcategory: 'LED Lights',
    images: ['https://images.unsplash.com/photo-1558618666-fcd25c85f82e?w=600'],
    stock: 200,
    vendor: vendorId,
    trending: true,
    flashDeal: true,
    ratings: 4.7,
    numReviews: 256,
  },
  {
    title: 'Adjustable Dumbbell Set 20kg',
    description: 'Professional adjustable dumbbells for home gym. Quick weight change system.',
    price: 4999,
    discountPrice: 3499,
    category: 'Gym & Fitness Products',
    subcategory: 'Dumbbells',
    images: ['https://images.unsplash.com/photo-1534438327276-14e5300c3a48?w=600'],
    stock: 45,
    vendor: vendorId,
    featured: true,
    ratings: 4.8,
    numReviews: 89,
  },
  {
    title: 'Premium Yoga Mat 6mm',
    description: 'Non-slip eco-friendly yoga mat with alignment lines. Includes carry strap.',
    price: 1499,
    discountPrice: 999,
    category: 'Gym & Fitness Products',
    subcategory: 'Yoga Mats',
    images: ['https://images.unsplash.com/photo-1601925260368-ae2f83cf8b7f?w=600'],
    stock: 120,
    vendor: vendorId,
    trending: true,
    ratings: 4.6,
    numReviews: 312,
  },
  {
    title: 'Smart WiFi Plug 4-Pack',
    description: 'Voice-controlled smart plugs compatible with Alexa and Google Home.',
    price: 2499,
    discountPrice: 1799,
    category: 'Smart Home & Kitchen',
    subcategory: 'Smart Lights',
    images: ['https://images.unsplash.com/photo-1558002038-1055907df827?w=600'],
    stock: 80,
    vendor: vendorId,
    featured: true,
    flashDeal: true,
    ratings: 4.4,
    numReviews: 167,
  },
  {
    title: 'Multi-Function Kitchen Chopper',
    description: '5-in-1 manual food chopper for vegetables, nuts, and herbs. Easy to clean.',
    price: 899,
    discountPrice: 549,
    category: 'Smart Home & Kitchen',
    subcategory: 'Kitchen Tools',
    images: ['https://images.unsplash.com/photo-1556911220-e15b29be8c8f?w=600'],
    stock: 300,
    vendor: vendorId,
    trending: true,
    ratings: 4.3,
    numReviews: 445,
  },
];

const seed = async () => {
  await mongoose.connect(process.env.MONGODB_URI);
  console.log('Connected to MongoDB');

  await User.deleteMany({});
  await Vendor.deleteMany({});
  await Category.deleteMany({});
  await Product.deleteMany({});

  const admin = await User.create({
    name: process.env.ADMIN_NAME || 'Super Admin',
    email: process.env.ADMIN_EMAIL || 'admin@shopverse.com',
    password: process.env.ADMIN_PASSWORD || 'Admin@123456',
    role: 'admin',
  });
  console.log('Admin created:', admin.email);

  const vendorUser = await User.create({
    name: 'Demo Vendor',
    email: 'vendor@shopverse.com',
    password: 'Vendor@123456',
    role: 'vendor',
  });

  const vendor = await Vendor.create({
    user: vendorUser._id,
    businessName: 'TechGear Store',
    businessPhone: '+91 9876543210',
    description: 'Premium gadgets and fitness products',
    isApproved: true,
    approvedAt: Date.now(),
    approvedBy: admin._id,
  });
  console.log('Vendor created:', vendorUser.email);

  await Category.insertMany(categories);
  console.log('Categories seeded');

  const products = sampleProducts(vendor._id);
  for (const p of products) {
    await Product.create(p);
  }
  console.log('Products seeded');

  console.log('\n--- Seed Complete ---');
  console.log('Admin:', admin.email, '/ Admin@123456');
  console.log('Vendor:', vendorUser.email, '/ Vendor@123456');
  process.exit(0);
};

seed().catch((err) => {
  console.error(err);
  process.exit(1);
});
