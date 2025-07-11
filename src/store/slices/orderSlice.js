// src/store/slices/orderSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';

// --- ASYNC THUNKS ---

export const createOrder = createAsyncThunk(
    'orders/create',
    async (orderData, { rejectWithValue }) => {
        try {
            const response = await axios.post('/orders', orderData);
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const fetchMyOrders = createAsyncThunk(
    'orders/fetchMyOrders',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('/orders');
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

// --- ASYNC THUNK YANG HILANG DITAMBAHKAN DI SINI ---
/**
 * Mengambil detail satu pesanan berdasarkan ID-nya.
 * @param {string} orderId - ID unik dari pesanan.
 */
export const fetchOrderById = createAsyncThunk(
    'orders/fetchById',
    async (orderId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/orders/${orderId}`);
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const cancelOrder = createAsyncThunk(
    'orders/cancel',
    async (orderId, { rejectWithValue }) => {
        try {
            const response = await axios.put(`/orders/${orderId}/cancel`);
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);


// --- ORDER SLICE ---

const orderSlice = createSlice({
    name: 'orders',
    initialState: {
        myOrders: [],
        selectedOrder: null,
        status: 'idle',
        error: null,
    },
    reducers: {
        clearOrderState: (state) => {
            state.status = 'idle';
            state.error = null;
            state.selectedOrder = null;
        },
    },
    // --- PERBAIKAN UTAMA PADA EXTRA REDUCERS ---
    extraReducers: (builder) => {
        builder
            // Create Order
            .addCase(createOrder.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createOrder.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.myOrders.unshift(action.payload);
            })
            .addCase(createOrder.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload?.message;
            })
            // Fetch My Orders
            .addCase(fetchMyOrders.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchMyOrders.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.myOrders = action.payload;
            })
            .addCase(fetchMyOrders.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload?.message;
            })
            // Cancel Order
            .addCase(cancelOrder.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(cancelOrder.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const index = state.myOrders.findIndex(order => order.orderId === action.payload.orderId);
                if (index !== -1) {
                    state.myOrders[index] = action.payload;
                }
                // Jika pesanan yang dibatalkan adalah yang sedang dipilih, perbarui juga
                if (state.selectedOrder?.orderId === action.payload.orderId) {
                    state.selectedOrder = action.payload;
                }
            })
            .addCase(cancelOrder.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload?.message;
            })
            // Fetch Order By ID (yang sebelumnya error)
            .addCase(fetchOrderById.pending, (state) => {
                state.status = 'loading';
                state.selectedOrder = null;
            })
            .addCase(fetchOrderById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.selectedOrder = action.payload;
            })
            .addCase(fetchOrderById.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload?.message;
            });
    },
});

export const { clearOrderState } = orderSlice.actions;

export default orderSlice.reducer;