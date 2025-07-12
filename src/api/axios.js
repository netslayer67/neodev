// src/api/axios.js
import axios from 'axios';
import { store } from '../store/store'; // Import store

// --- PERBAIKAN DI SINI ---
// Ubah 'v1' menjadi 'V1' agar sesuai dengan endpoint backend
const instance = axios.create({
    baseURL: 'https://be-neo.vercel.app/api/v1',
    headers: {
        'Content-Type': 'application/json',
    },
});

// Interceptor untuk menyisipkan token di setiap request
instance.interceptors.request.use(
    (config) => {
        const token = store.getState().auth.token;
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default instance;