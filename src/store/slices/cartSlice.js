// src/store/slices/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

// Fungsi untuk menyimpan state ke localStorage
const saveState = (state) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('cart', serializedState);
    } catch (e) {
        console.warn("Could not save cart state", e);
    }
};

// Fungsi untuk memuat state dari localStorage
const loadState = () => {
    try {
        const serializedState = localStorage.getItem('cart');
        if (serializedState === null) {
            return []; // Jika tidak ada, kembalikan array kosong
        }
        return JSON.parse(serializedState);
    } catch (e) {
        console.warn("Could not load cart state", e);
        return [];
    }
};

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        cartItems: loadState(), // Muat state saat aplikasi pertama kali dibuka
    },
    reducers: {
        // Reducer untuk menambahkan item ke keranjang
        addToCart: (state, action) => {
            const { product, quantity = 1 } = action.payload;
            const existingItem = state.cartItems.find((item) => item._id === product._id);

            if (existingItem) {
                // Jika item sudah ada, tambahkan kuantitasnya
                existingItem.quantity += quantity;
            } else {
                // Jika item baru, tambahkan ke keranjang
                state.cartItems.push({ ...product, quantity });
            }
            saveState(state.cartItems); // Simpan perubahan ke localStorage
        },

        // Reducer untuk mengurangi kuantitas item
        decreaseQuantity: (state, action) => {
            const itemIndex = state.cartItems.findIndex((item) => item._id === action.payload._id);

            if (itemIndex >= 0 && state.cartItems[itemIndex].quantity > 1) {
                state.cartItems[itemIndex].quantity -= 1;
            } else {
                // Jika kuantitas 1 atau kurang, hapus item
                state.cartItems.splice(itemIndex, 1);
            }
            saveState(state.cartItems);
        },

        // Reducer untuk menghapus item dari keranjang
        removeFromCart: (state, action) => {
            state.cartItems = state.cartItems.filter((item) => item._id !== action.payload._id);
            saveState(state.cartItems);
        },

        // --- PENAMBAHAN DI SINI ---
        // Reducer untuk mengosongkan seluruh keranjang
        clearCart: (state) => {
            state.cartItems = []; // Set array item menjadi kosong
            saveState(state.cartItems); // Perbarui localStorage juga
        },
    },
});

// Ekspor action creator yang baru
export const { addToCart, decreaseQuantity, removeFromCart, clearCart } = cartSlice.actions;

export default cartSlice.reducer;