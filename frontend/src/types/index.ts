export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'vendor' | 'admin';
  avatar?: string;
  phone?: string;
  isBlocked?: boolean;
  addresses?: Address[];
}

export interface Address {
  _id?: string;
  label: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  phone: string;
  isDefault?: boolean;
}

export interface Vendor {
  _id: string;
  user: string;
  businessName: string;
  businessPhone?: string;
  description?: string;
  logo?: string;
  isApproved: boolean;
  isBlocked: boolean;
  totalProducts?: number;
  totalSales?: number;
  rating?: number;
}

export interface Product {
  _id: string;
  title: string;
  slug: string;
  description: string;
  price: number;
  discountPrice: number;
  category: string;
  subcategory?: string;
  images: string[];
  thumbnail: string;
  stock: number;
  vendor: Vendor | string;
  brand?: string;
  variants?: { name: string; options: { label: string; value: string; stock: number }[] }[];
  ratings: number;
  numReviews: number;
  reviews?: Review[];
  trending?: boolean;
  featured?: boolean;
  flashDeal?: boolean;
  flashDealEnds?: string;
  tags?: string[];
  sold?: number;
  isActive?: boolean;
  createdAt?: string;
}

export interface CartItem {
  _id: string;
  product: Product;
  quantity: number;
  variant: string;
  price: number;
}

export interface Cart {
  _id: string;
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
}

export interface Order {
  _id: string;
  orderNumber: string;
  orderItems: {
    product: string;
    title: string;
    image: string;
    quantity: number;
    price: number;
    variant?: string;
  }[];
  shippingAddress: Address;
  paymentMethod: string;
  itemsPrice: number;
  taxPrice: number;
  deliveryPrice: number;
  totalPrice: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  isPaid: boolean;
  isDelivered: boolean;
  createdAt: string;
}

export interface Category {
  _id: string;
  name: string;
  slug: string;
  description: string;
  image: string;
  subcategories: { name: string; slug: string }[];
  productCount?: number;
}

export interface Review {
  _id: string;
  user: { _id: string; name: string; avatar?: string };
  product: string | Product;
  rating: number;
  title?: string;
  comment: string;
  createdAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  message?: string;
  count?: number;
  total?: number;
  token?: string;
  user?: User;
}
