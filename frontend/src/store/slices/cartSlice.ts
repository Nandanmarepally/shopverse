import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/api';
import { Cart, CartItem } from '@/types';

interface CartState {
  items: CartItem[];
  subtotal: number;
  deliveryFee: number;
  tax: number;
  total: number;
  itemCount: number;
  loading: boolean;
  error: string | null;
}

const loadLocalCart = (): Partial<CartState> => {
  if (typeof window === 'undefined') return {};
  try {
    const saved = localStorage.getItem('cart');
    return saved ? JSON.parse(saved) : {};
  } catch {
    return {};
  }
};

const saveLocalCart = (state: CartState) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem('cart', JSON.stringify({
      items: state.items,
      subtotal: state.subtotal,
      deliveryFee: state.deliveryFee,
      tax: state.tax,
      total: state.total,
      itemCount: state.itemCount,
    }));
  }
};

const calcTotals = (items: CartItem[]) => {
  const subtotal = items.reduce((acc, item) => acc + item.price * item.quantity, 0);
  const deliveryFee = subtotal > 499 ? 0 : 49;
  const tax = Math.round(subtotal * 0.18);
  const total = subtotal + deliveryFee + tax;
  const itemCount = items.reduce((acc, item) => acc + item.quantity, 0);
  return { subtotal, deliveryFee, tax, total, itemCount };
};

const initialState: CartState = {
  items: [],
  subtotal: 0,
  deliveryFee: 49,
  tax: 0,
  total: 0,
  itemCount: 0,
  loading: false,
  error: null,
  ...loadLocalCart(),
};

export const fetchCart = createAsyncThunk('cart/fetch', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/cart');
    return res.data.data as Cart;
  } catch (err) {
    return rejectWithValue((err as Error).message);
  }
});

export const addToCart = createAsyncThunk(
  'cart/add',
  async (data: { productId: string; quantity: number; variant?: string }, { rejectWithValue }) => {
    try {
      const res = await api.post('/cart', data);
      return res.data.data as Cart;
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const updateCartItem = createAsyncThunk(
  'cart/update',
  async (data: { itemId: string; quantity: number }, { rejectWithValue }) => {
    try {
      const res = await api.put(`/cart/${data.itemId}`, { quantity: data.quantity });
      return res.data.data as Cart;
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const removeFromCart = createAsyncThunk(
  'cart/remove',
  async (itemId: string, { rejectWithValue }) => {
    try {
      const res = await api.delete(`/cart/${itemId}`);
      return res.data.data as Cart;
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

const applyCart = (state: CartState, cart: Cart) => {
  state.items = cart.items;
  state.subtotal = cart.subtotal;
  state.deliveryFee = cart.deliveryFee;
  state.tax = cart.tax;
  state.total = cart.total;
  state.itemCount = cart.items.reduce((acc, i) => acc + i.quantity, 0);
  saveLocalCart(state);
};

const cartSlice = createSlice({
  name: 'cart',
  initialState,
  reducers: {
    addToCartLocal: (state, action) => {
      const { product, quantity = 1, variant = '' } = action.payload;
      const price = product.discountPrice > 0 ? product.discountPrice : product.price;
      const existing = state.items.find(
        (i) => i.product._id === product._id && i.variant === variant
      );
      if (existing) {
        existing.quantity += quantity;
      } else {
        state.items.push({
          _id: `local-${product._id}-${Date.now()}`,
          product,
          quantity,
          variant,
          price,
        });
      }
      Object.assign(state, calcTotals(state.items));
      saveLocalCart(state);
    },
    clearCartLocal: (state) => {
      state.items = [];
      Object.assign(state, calcTotals([]));
      saveLocalCart(state);
    },
    updateQtyLocal: (state, action: { payload: { itemId: string; quantity: number } }) => {
      const item = state.items.find((i) => i._id === action.payload.itemId);
      if (!item) return;
      if (action.payload.quantity < 1) {
        state.items = state.items.filter((i) => i._id !== action.payload.itemId);
      } else {
        item.quantity = action.payload.quantity;
      }
      Object.assign(state, calcTotals(state.items));
      saveLocalCart(state);
    },
    removeLocal: (state, action: { payload: string }) => {
      state.items = state.items.filter((i) => i._id !== action.payload);
      Object.assign(state, calcTotals(state.items));
      saveLocalCart(state);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCart.fulfilled, (state, action) => applyCart(state, action.payload))
      .addCase(addToCart.fulfilled, (state, action) => applyCart(state, action.payload))
      .addCase(updateCartItem.fulfilled, (state, action) => applyCart(state, action.payload))
      .addCase(removeFromCart.fulfilled, (state, action) => applyCart(state, action.payload));
  },
});

export const { addToCartLocal, clearCartLocal, updateQtyLocal, removeLocal } = cartSlice.actions;
export default cartSlice.reducer;
