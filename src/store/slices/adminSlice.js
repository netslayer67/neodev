import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';

// --- ASYNC THUNKS UNTUK ADMIN ---

export const fetchDashboardStats = createAsyncThunk(
    'admin/fetchDashboardStats',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('/admin/dashboard-stats');
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const fetchAllUsers = createAsyncThunk(
    'admin/fetchAllUsers',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('/admin/users');
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

// --- PENAMBAHAN FUNGSI BARU DI SINI ---

/**
 * (Admin) Mengambil semua data pesanan dari semua pengguna.
 */
export const fetchAllOrders = createAsyncThunk(
    'admin/fetchAllOrders',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('/admin/orders');
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

/**
 * (Admin) Mengambil detail satu pesanan berdasarkan ID.
 */
export const fetchOrderByIdForAdmin = createAsyncThunk(
    'admin/fetchOrderById',
    async (orderId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/admin/orders/${orderId}`);
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);


// --- Aksi untuk update status pesanan (tetap di sini) ---
export const confirmOrderPayment = createAsyncThunk(
    'admin/confirmOrderPayment',
    async (orderId, { rejectWithValue }) => {
        try {
            const response = await axios.put(`/admin/orders/${orderId}/confirm-payment`);
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const shipOrder = createAsyncThunk(
    'admin/shipOrder',
    async (orderId, { rejectWithValue }) => {
        try {
            const response = await axios.put(`/admin/orders/${orderId}/ship`);
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const fulfillOrder = createAsyncThunk(
    'admin/fulfillOrder',
    async (orderId, { rejectWithValue }) => {
        try {
            const response = await axios.put(`/admin/orders/${orderId}/fulfill`);
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);


// --- ADMIN SLICE ---
const adminSlice = createSlice({
    name: 'admin',
    initialState: {
        stats: null,
        users: [],
        orders: [], // State untuk menampung semua pesanan
        selectedOrder: null, // State untuk detail pesanan
        status: 'idle',
        error: null,
    },
    reducers: {
        clearAdminSelectedOrder: (state) => {
            state.selectedOrder = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch Dashboard Stats
            .addCase(fetchDashboardStats.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchDashboardStats.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.stats = action.payload;
            })
            .addCase(fetchDashboardStats.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload?.message;
            })
            // Fetch All Users
            .addCase(fetchAllUsers.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchAllUsers.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.users = action.payload;
            })
            .addCase(fetchAllUsers.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload?.message;
            })
            // Fetch All Orders (Admin)
            .addCase(fetchAllOrders.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchAllOrders.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.orders = action.payload;
            })
            .addCase(fetchAllOrders.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload?.message;
            })
            // Fetch Order By ID (Admin)
            .addCase(fetchOrderByIdForAdmin.pending, (state) => {
                state.status = 'loading';
                state.selectedOrder = null;
            })
            .addCase(fetchOrderByIdForAdmin.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.selectedOrder = action.payload;
            })
            .addCase(fetchOrderByIdForAdmin.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload?.message;
            })
            // Order status updates (hanya menangani error jika perlu)
            .addCase(confirmOrderPayment.rejected, (state, action) => {
                state.error = action.payload?.message;
            })
            .addCase(shipOrder.rejected, (state, action) => {
                state.error = action.payload?.message;
            })
            .addCase(fulfillOrder.rejected, (state, action) => {
                state.error = action.payload?.message;
            });
    },
});

export const { clearAdminSelectedOrder } = adminSlice.actions;
export default adminSlice.reducer;