import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/api';
import { Product } from '@/types';

interface ProductState {
  products: Product[];
  product: Product | null;
  similar: Product[];
  total: number;
  loading: boolean;
  error: string | null;
}

const initialState: ProductState = {
  products: [],
  product: null,
  similar: [],
  total: 0,
  loading: false,
  error: null,
};

export const fetchProducts = createAsyncThunk(
  'products/fetchAll',
  async (params: Record<string, string> | undefined, { rejectWithValue }) => {
    try {
      const res = await api.get('/products', { params });
      return { products: res.data.data, total: res.data.total };
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const fetchProduct = createAsyncThunk(
  'products/fetchOne',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await api.get(`/products/${id}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const fetchProductBySlug = createAsyncThunk(
  'products/fetchBySlug',
  async (slug: string, { rejectWithValue }) => {
    try {
      const res = await api.get(`/products/slug/${slug}`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

export const fetchSimilar = createAsyncThunk(
  'products/similar',
  async (id: string, { rejectWithValue }) => {
    try {
      const res = await api.get(`/products/${id}/similar`);
      return res.data.data;
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

const productSlice = createSlice({
  name: 'products',
  initialState,
  reducers: { clearProduct: (state) => { state.product = null; } },
  extraReducers: (builder) => {
    builder
      .addCase(fetchProducts.pending, (state) => { state.loading = true; })
      .addCase(fetchProducts.fulfilled, (state, action) => {
        state.loading = false;
        state.products = action.payload.products;
        state.total = action.payload.total;
      })
      .addCase(fetchProducts.rejected, (state) => { state.loading = false; })
      .addCase(fetchProduct.fulfilled, (state, action) => { state.product = action.payload; })
      .addCase(fetchProductBySlug.fulfilled, (state, action) => { state.product = action.payload; })
      .addCase(fetchSimilar.fulfilled, (state, action) => { state.similar = action.payload; });
  },
});

export const { clearProduct } = productSlice.actions;
export default productSlice.reducer;
