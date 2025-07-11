import React, { Suspense, lazy, useMemo } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';

// --- UI Components ---
import { Toaster } from '@/components/ui/toaster';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { PageLoader } from '@/components/PageLoader';
import ProtectedRoute from './components/ProtectedRoute'; // Asumsi komponen ini akan dibuat/

// --- Page Imports (Lazy Loaded) ---
const HomePage = lazy(() => import('@/pages/HomePage'));
const ShopPage = lazy(() => import('@/pages/ShopPage'));
const ProductDetailPage = lazy(() => import('@/pages/ProductDetailPage'));
const CartPage = lazy(() => import('@/pages/CartPage'));
const CheckoutPage = lazy(() => import('@/pages/CheckoutPage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/RegisterPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const AboutPage = lazy(() => import('@/pages/AboutPage'));
const ContactPage = lazy(() => import('@/pages/ContactPage'));

// --- Admin Page Imports (Lazy Loaded) ---
const AdminLayout = lazy(() => import('@/pages/admin/AdminLayout'));
const DashboardPage = lazy(() => import('@/pages/admin/DashboardPage'));
const AdminProductsPage = lazy(() => import('@/pages/admin/ProductsPage'));
const AdminOrdersPage = lazy(() => import('@/pages/admin/OrdersPage'));


// --- Helper Component untuk Layout ---
const MainLayout = ({ children }) => (
  <div className="flex flex-col min-h-screen bg-gradient-to-br from-black via-gray-800 to-black text-foreground">
    <Header />
    <main className="flex-grow">{children}</main>
    <Footer />
  </div>
);

function App() {
  const location = useLocation();

  // Memoize route definitions untuk menghindari kalkulasi ulang yang tidak perlu
  const routeElements = useMemo(() => (
    <Routes location={location} key={location.pathname}>
      {/* Rute Publik dengan Layout Utama */}
      <Route
        path="/"
        element={<MainLayout><HomePage /></MainLayout>}
      />
      <Route
        path="/shop"
        element={<MainLayout><ShopPage /></MainLayout>}
      />
      <Route
        path="/product/:slug" // Menggunakan slug untuk SEO-friendly URL
        element={<MainLayout><ProductDetailPage /></MainLayout>}
      />
      <Route
        path="/cart"
        element={<MainLayout><CartPage /></MainLayout>}
      />
      <Route
        path="/about"
        element={<MainLayout><AboutPage /></MainLayout>}
      />
      <Route
        path="/contact"
        element={<MainLayout><ContactPage /></MainLayout>}
      />

      {/* Rute Autentikasi (tanpa Header/Footer utama) */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />

      {/* Rute yang Dilindungi (Memerlukan Login) */}
      <Route
        path="/profile"
        element={<ProtectedRoute><MainLayout><ProfilePage /></MainLayout></ProtectedRoute>}
      />
      <Route
        path="/checkout"
        element={<ProtectedRoute><MainLayout><CheckoutPage /></MainLayout></ProtectedRoute>}
      />

      {/* Rute Admin */}
      <Route
        path="/admin"
        element={<ProtectedRoute adminOnly={true}><AdminLayout /></ProtectedRoute>}
      >
        <Route index element={<DashboardPage />} />
        <Route path="products" element={<AdminProductsPage />} />
        <Route path="orders" element={<AdminOrdersPage />} />
      </Route>

      {/* Tambahkan rute Not Found di sini jika perlu */}
      {/* <Route path="*" element={<NotFoundPage />} /> */}
    </Routes>
  ), [location]);

  return (
    <>
      <Suspense fallback={<PageLoader />}>
        <AnimatePresence mode="wait">
          {routeElements}
        </AnimatePresence>
      </Suspense>
      <Toaster />
    </>
  );
}

export default App;