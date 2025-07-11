// src/components/ProtectedRoute.jsx
import React from 'react';
import { useSelector } from 'react-redux';
import { Navigate, useLocation } from 'react-router-dom';
import { PageLoader } from './PageLoader';

/**
 * Komponen untuk melindungi rute.
 * @param {object} props
 * @param {React.ReactNode} props.children - Komponen yang akan di-render jika otorisasi berhasil.
 * @param {boolean} [props.adminOnly=false] - Jika true, hanya user dengan role 'admin' yang diizinkan.
 */
const ProtectedRoute = ({ children, adminOnly = false }) => {
    const { user, token, status } = useSelector((state) => state.auth);
    const location = useLocation();

    // 1. Tampilkan loading jika status auth masih dalam proses verifikasi awal
    if (status === 'loading') {
        return <PageLoader />;
    }

    // 2. Jika tidak ada token (belum login), arahkan ke halaman login
    if (!token) {
        // Simpan lokasi saat ini agar bisa kembali setelah login berhasil
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 3. Jika rute ini hanya untuk admin, periksa peran pengguna
    if (adminOnly && user?.role !== 'admin') {
        // Jika bukan admin, arahkan ke halaman utama (atau halaman 403 'Forbidden')
        return <Navigate to="/" replace />;
    }

    // 4. Jika semua pemeriksaan berhasil, render komponen anak (halaman yang dilindungi)
    return children;
};

export default ProtectedRoute;