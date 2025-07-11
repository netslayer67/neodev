// src/store/slices/authSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';

// --- PERBAIKAN DI SINI ---
// Ambil item dari localStorage
const userItem = localStorage.getItem('user');
const token = localStorage.getItem('token');

// Hanya parse jika userItem ada (bukan null atau undefined)
const user = userItem ? JSON.parse(userItem) : null;

// Async Thunk untuk Registrasi
export const registerUser = createAsyncThunk(
    'auth/registerUser',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post('/auth/register', userData);
            // Simpan token dan user setelah registrasi berhasil
            localStorage.setItem('token', response.data.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.data.user));
            return response.data.data; // Mengembalikan { user, token }
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

// Async Thunk untuk Login
export const loginUser = createAsyncThunk(
    'auth/loginUser',
    async (userData, { rejectWithValue }) => {
        try {
            const response = await axios.post('/auth/login', userData);
            localStorage.setItem('token', response.data.data.token);
            localStorage.setItem('user', JSON.stringify(response.data.data.user));
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        user: user || null,
        token: token || null,
        status: user ? 'succeeded' : 'idle', // Set status awal berdasarkan keberadaan user
        error: null,
    },
    reducers: {
        logout: (state) => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            state.user = null;
            state.token = null;
            state.status = 'idle';
        },
    },
    extraReducers: (builder) => {
        builder
            // Penanganan untuk Login
            .addCase(loginUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(loginUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(loginUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload?.message || 'Login failed';
            })
            // Penanganan untuk Registrasi
            .addCase(registerUser.pending, (state) => {
                state.status = 'loading';
                state.error = null;
            })
            .addCase(registerUser.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.user = action.payload.user;
                state.token = action.payload.token;
            })
            .addCase(registerUser.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload?.message || 'Registration failed';
            });
    },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;