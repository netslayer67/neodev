// src/store/slices/dashboardSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

// Async thunk to fetch dashboard stats
export const fetchDashboardStats = createAsyncThunk(
    'dashboard/fetchStats',
    async (_, { rejectWithValue }) => {
        try {
            const res = await axios.get('/api/v1/admin/dashboard-stats');
            return res.data.data;
        } catch (error) {
            return rejectWithValue(error.response?.data?.message || error.message);
        }
    }
);

const dashboardSlice = createSlice({
    name: 'dashboard',
    initialState: {
        stats: {
            revenue: { total: 0, percentageChange: 0, history: [] },
            sales: { total: 0, percentageChange: 0 },
            users: { newLast30Days: 0, percentageChange: 0 },
            activeNow: 0,
        },
        recentActivities: [],
        status: 'idle', // 'idle' | 'loading' | 'succeeded' | 'failed'
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchDashboardStats.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchDashboardStats.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.stats = action.payload;
                state.recentActivities = action.payload.recentActivities || [];
            })
            .addCase(fetchDashboardStats.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export default dashboardSlice.reducer;
