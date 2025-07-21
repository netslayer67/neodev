// src/store/slices/productSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';

// ====================================================================
// Async Thunks - Logika untuk berinteraksi dengan API Backend
// ====================================================================

/**
 * Mengambil daftar produk dari endpoint /products.
 * Logika filter dan paginasi sekarang diasumsikan ditangani oleh parameter query default di backend.
 */
export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('/products');
            // Backend mengembalikan { success, message, data: { products, pagination } }
            // Kita kembalikan `data`-nya
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

/**
 * Mengambil satu produk berdasarkan slug-nya.
 * @param {string} slug - Slug produk.
 */
export const fetchProductBySlug = createAsyncThunk(
    'products/fetchProductBySlug',
    async (slug, { rejectWithValue }) => {
        try {
            // Menggunakan endpoint /products/:slug dari product.route.ts
            const response = await axios.get(`/products/slug/${slug}`);
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

/**
 * Membuat produk baru (Admin).
 * Menggunakan FormData karena ada upload gambar.
 * @param {FormData} productData - Data produk dalam bentuk FormData.
 */
export const createProduct = createAsyncThunk(
    'products/createProduct',
    async (productData, { rejectWithValue }) => {
        try {
            const response = await axios.post('/products', productData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

/**
 * Memperbarui produk yang ada (Admin).
 * @param {object} { id, productData } - ID produk dan data FormData baru.
 */
export const updateProduct = createAsyncThunk(
    'products/updateProduct',
    async ({ id, productData }, { rejectWithValue }) => {
        try {
            const response = await axios.put(`/products/${id}`, productData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });
            return response.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

/**
 * Menghapus produk (Admin).
 * @param {string} id - ID produk yang akan dihapus.
 */
export const deleteProduct = createAsyncThunk(
    'products/deleteProduct',
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(`/products/${id}`);
            return id; // Kembalikan ID untuk dihapus dari state
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

// ====================================================================
// Product Slice - State Management
// ====================================================================

const productSlice = createSlice({
    name: 'products',
    initialState: {
        items: [],
        selectedProduct: null,
        pagination: {},
        status: 'idle',
        error: null,
    },
    reducers: {
        clearSelectedProduct: (state) => {
            state.selectedProduct = null;
        }
    },
    extraReducers: (builder) => {
        builder
            // Fetch All Products
            .addCase(fetchProducts.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                // --- PERBAIKAN DI SINI ---
                // Pastikan untuk mengakses data produk dan paginasi dengan benar dari payload
                state.items = action.payload.products || []; // Fallback ke array kosong
                state.pagination = action.payload.pagination || {}; // Fallback ke objek kosong
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload?.message || 'Failed to fetch products';
            })
            // ... (sisa extraReducers) ...
            .addCase(fetchProductBySlug.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.selectedProduct = action.payload.data || null;
            });

    },
});

export const { clearSelectedProduct } = productSlice.actions;

export default productSlice.reducer;