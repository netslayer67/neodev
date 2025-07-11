// src/store/store.js
import { configureStore } from '@reduxjs/toolkit';
import productReducer from './slices/productSlice';
import authReducer from './slices/authSlice';
import cartReducer from './slices/cartSlice';
import orderReducer from './slices/orderSlice';
import adminReducer from './slices/adminSlice'; // <-- Pastikan ini diimpor

export const store = configureStore({
    reducer: {
        products: productReducer,
        auth: authReducer,
        cart: cartReducer,
        orders: orderReducer,
        admin: adminReducer, // <-- Dan pastikan ini ditambahkan di sini
    },
});