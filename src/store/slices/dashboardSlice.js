// src/store/slices/dashboardSlice.js

import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';

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
        revenue: { total: 0, change: '0%' },
        sales: { total: 0, change: '0%' },
        subscriptions: { total: 0, change: '0%' },
        activeUsers: { total: 0 },
        chartData: [],
        recentActivities: [],
        status: 'idle',
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
                const {
                    revenue,
                    sales,
                    subscriptions,
                    activeUsers,
                    chartData,
                    recentActivities,
                } = action.payload;

                state.revenue = revenue || { total: 0, change: '0%' };
                state.sales = sales || { total: 0, change: '0%' };
                state.subscriptions = subscriptions || { total: 0, change: '0%' };
                state.activeUsers = activeUsers || { total: 0 };
                state.chartData = chartData || [];
                state.recentActivities = recentActivities || [];
            })
            .addCase(fetchDashboardStats.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload;
            });
    },
});

export default dashboardSlice.reducer;
