// src/store/slices/productSlice.js
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from '../../api/axios';

// ====================================================================
// Async Thunks - Logika untuk berinteraksi dengan API Backend
// ====================================================================

/**
 * Mengambil daftar produk dari endpoint /products.
 * Backend mengembalikan { success, message, data: { products, pagination } }
 */
export const fetchProducts = createAsyncThunk(
    'products/fetchProducts',
    async (_, { rejectWithValue }) => {
        try {
            const response = await axios.get('/products');
            return response.data.data;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

/**
 * Mengambil satu produk berdasarkan slug-nya.
 */
export const fetchProductBySlug = createAsyncThunk(
    'products/fetchProductBySlug',
    async (slug, { rejectWithValue }) => {
        try {
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
 * Memperbarui produk (Admin).
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
 */
export const deleteProduct = createAsyncThunk(
    'products/deleteProduct',
    async (id, { rejectWithValue }) => {
        try {
            await axios.delete(`/products/${id}`);
            return id;
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

/**
 * ✅ Update stok produk (khusus untuk ukuran tertentu).
 * Biasanya dipanggil saat order/cancel.
 */
export const updateProductStock = createAsyncThunk(
    'products/updateProductStock',
    async ({ productId, size, quantity }, { rejectWithValue }) => {
        try {
            const response = await axios.patch(`/products/${productId}/stock`, {
                size,
                quantity,
            });
            return response.data.data; // return updated product
        } catch (err) {
            return rejectWithValue(err.response.data);
        }
    }
);

// ====================================================================
// Product Slice - Redux State Management
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
            // Fetch all products
            .addCase(fetchProducts.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchProducts.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload.products || [];
                state.pagination = action.payload.pagination || {};
            })
            .addCase(fetchProducts.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.payload?.message || 'Failed to fetch products';
            })

            // Fetch single product by slug
            .addCase(fetchProductBySlug.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.selectedProduct = action.payload.data || null;
            })

            // Update stock (real-time)
            .addCase(updateProductStock.fulfilled, (state, action) => {
                const updated = action.payload;
                const index = state.items.findIndex(p => p._id === updated._id);
                if (index !== -1) {
                    state.items[index] = updated;
                }
                if (state.selectedProduct && state.selectedProduct._id === updated._id) {
                    state.selectedProduct = updated;
                }
            })

            // Create product
            .addCase(createProduct.fulfilled, (state, action) => {
                state.items.unshift(action.payload.data); // tambahkan ke awal list
            })

            // Update product
            .addCase(updateProduct.fulfilled, (state, action) => {
                const updated = action.payload.data;
                const index = state.items.findIndex(p => p._id === updated._id);
                if (index !== -1) {
                    state.items[index] = updated;
                }
                if (state.selectedProduct && state.selectedProduct._id === updated._id) {
                    state.selectedProduct = updated;
                }
            })

            // Delete product
            .addCase(deleteProduct.fulfilled, (state, action) => {
                state.items = state.items.filter(p => p._id !== action.payload);
                if (state.selectedProduct && state.selectedProduct._id === action.payload) {
                    state.selectedProduct = null;
                }
            });
    },
});

// Export actions and reducer
export const { clearSelectedProduct } = productSlice.actions;
export default productSlice.reducer;
