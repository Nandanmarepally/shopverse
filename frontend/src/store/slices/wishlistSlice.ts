import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/api';
import { Product } from '@/types';

interface WishlistState {
  items: Product[];
  loading: boolean;
}

const initialState: WishlistState = { items: [], loading: false };

export const fetchWishlist = createAsyncThunk('wishlist/fetch', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/users/wishlist');
    return res.data.data;
  } catch (err) {
    return rejectWithValue((err as Error).message);
  }
});

export const toggleWishlist = createAsyncThunk(
  'wishlist/toggle',
  async (productId: string, { rejectWithValue }) => {
    try {
      const res = await api.post(`/users/wishlist/${productId}`);
      return res.data.wishlist;
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

const wishlistSlice = createSlice({
  name: 'wishlist',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchWishlist.fulfilled, (state, action) => { state.items = action.payload; })
      .addCase(toggleWishlist.fulfilled, (state, action) => { state.items = action.payload; });
  },
});

export default wishlistSlice.reducer;
