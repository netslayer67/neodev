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

// --- PENAMBAHAN FUNGSI USER MANAGEMENT ---

export const fetchUserById = createAsyncThunk(
    'admin/fetchUserById',
    async (userId, { rejectWithValue }) => {
        try {
            const response = await axios.get(`/admin/users/${userId}`);
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const createUser = createAsyncThunk(
    'admin/createUser',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post('/admin/users', userData);
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const updateUser = createAsyncThunk(
    'admin/updateUser',
    async ({ userId, userData }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`/admin/users/${userId}`, userData);
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

export const deleteUser = createAsyncThunk(
    'admin/deleteUser',
    async (userId, { rejectWithValue }) => {
        try {
            await axios.delete(`/admin/users/${userId}`);
            return userId;
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
            // Fetch User By ID
            .addCase(fetchUserById.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchUserById.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // You can store individual user data if needed
            })
            .addCase(fetchUserById.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload?.message;
            })
            // Create User
            .addCase(createUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(createUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.users.push(action.payload);
            })
            .addCase(createUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload?.message;
            })
            // Update User
            .addCase(updateUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(updateUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                const index = state.users.findIndex(user => user._id === action.payload._id);
                if (index !== -1) {
                    state.users[index] = action.payload;
                }
            })
            .addCase(updateUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload?.message;
            })
            // Delete User
            .addCase(deleteUser.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(deleteUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.users = state.users.filter(user => user._id !== action.payload);
            })
            .addCase(deleteUser.rejected, (state, action) => {
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