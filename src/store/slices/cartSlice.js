// src/store/slices/cartSlice.js
import { createSlice } from '@reduxjs/toolkit';

// --- localStorage helpers ---
const saveState = (state) => {
    try {
        const serializedState = JSON.stringify(state);
        localStorage.setItem('cart', serializedState);
    } catch (e) {
        console.warn("Could not save cart state", e);
    }
};

const loadState = () => {
    try {
        const serializedState = localStorage.getItem('cart');
        if (serializedState === null) return [];
        return JSON.parse(serializedState);
    } catch (e) {
        console.warn("Could not load cart state", e);
        return [];
    }
};

const cartSlice = createSlice({
    name: 'cart',
    initialState: {
        cartItems: loadState(),
    },
    reducers: {
        addToCart: (state, action) => {
            const { product, quantity = 1 } = action.payload;
            const size = product.size;

            const existingItem = state.cartItems.find(
                (item) => item._id === product._id && item.size === size
            );

            if (existingItem) {
                existingItem.quantity += quantity;
            } else {
                state.cartItems.push({
                    ...product,
                    quantity,
                    size,
                });
            }

            saveState(state.cartItems);
        },

        decreaseQuantity: (state, action) => {
            const { _id, size } = action.payload;

            const itemIndex = state.cartItems.findIndex(
                (item) => item._id === _id && item.size === size
            );

            if (itemIndex >= 0) {
                if (state.cartItems[itemIndex].quantity > 1) {
                    state.cartItems[itemIndex].quantity -= 1;
                } else {
                    state.cartItems.splice(itemIndex, 1);
                }

                saveState(state.cartItems);
            }
        },

        removeFromCart: (state, action) => {
            const { _id, size } = action.payload;

            state.cartItems = state.cartItems.filter(
                (item) => !(item._id === _id && item.size === size)
            );

            saveState(state.cartItems);
        },

        clearCart: (state) => {
            state.cartItems = [];
            saveState(state.cartItems);
        },
    },
});

export const {
    addToCart,
    decreaseQuantity,
    removeFromCart,
    clearCart,
} = cartSlice.actions;

export default cartSlice.reducer;
