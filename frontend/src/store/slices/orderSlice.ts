import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/lib/api';
import { Order } from '@/types';

interface OrderState {
  orders: Order[];
  order: Order | null;
  loading: boolean;
}

const initialState: OrderState = { orders: [], order: null, loading: false };

export const fetchMyOrders = createAsyncThunk('orders/fetchMy', async (_, { rejectWithValue }) => {
  try {
    const res = await api.get('/orders/my');
    return res.data.data;
  } catch (err) {
    return rejectWithValue((err as Error).message);
  }
});

export const createOrder = createAsyncThunk(
  'orders/create',
  async (data: { shippingAddress: object; paymentMethod?: string }, { rejectWithValue }) => {
    try {
      const res = await api.post('/orders', data);
      return res.data.data;
    } catch (err) {
      return rejectWithValue((err as Error).message);
    }
  }
);

const orderSlice = createSlice({
  name: 'orders',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyOrders.fulfilled, (state, action) => { state.orders = action.payload; })
      .addCase(createOrder.fulfilled, (state, action) => { state.order = action.payload; });
  },
});

export default orderSlice.reducer;
