import React, { Suspense, lazy, useMemo } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import ScrollToTop from "./ScrollToTop";

// --- UI Components ---
import { Toaster } from "@/components/ui/toaster";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import PageLoader from "@/components/PageLoader";
import ProtectedRoute from "./components/ProtectedRoute";

// --- Pages (Lazy Loaded for performance) ---
const HomePage = lazy(() => import("@/pages/HomePage"));
const ShopPage = lazy(() => import("@/pages/ShopPage"));
const ProductDetailPage = lazy(() => import("@/pages/ProductDetailPage"));
const CartPage = lazy(() => import("@/pages/CartPage"));
const CheckoutPage = lazy(() => import("@/pages/CheckoutPage"));
const LoginPage = lazy(() => import("@/pages/LoginPage"));
const RegisterPage = lazy(() => import("@/pages/RegisterPage"));
const ProfilePage = lazy(() => import("@/pages/ProfilePage"));
const AboutPage = lazy(() => import("@/pages/AboutPage"));
const ContactPage = lazy(() => import("@/pages/ContactPage"));

// --- Admin Pages ---
const AdminLayout = lazy(() => import("@/pages/admin/AdminLayout"));
const DashboardPage = lazy(() => import("@/pages/admin/DashboardPage"));
const AdminProductsPage = lazy(() => import("@/pages/admin/ProductsPage"));
const AdminOrdersPage = lazy(() => import("@/pages/admin/OrdersPage"));

// --- Layout Wrapper ---
const MainLayout = ({ children }) => (
  <div className="relative flex flex-col min-h-screen overflow-hidden">
    {/* Background Layers */}
    <div className="absolute inset-0 -z-10">
      <div className="absolute inset-0 bg-gradient-to-br from-background via-card/80 to-background opacity-95 transition-all duration-[320ms]" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]" />
      {/* Blobs */}
      <motion.div

        className="absolute -top-24 -left-20 w-72 h-72 bg-accent/25 rounded-full blur-3xl"
      />
      <motion.div

        className="absolute -bottom-28 -right-20 w-96 h-96 bg-secondary/30 rounded-full blur-3xl"
      />
    </div>

    {/* Content */}
    <Header />
    <main className="flex-grow transition-all duration-[320ms]">{children}</main>
    <Footer />
  </div>
);

function App() {
  const location = useLocation();

  // Optimized route definitions
  const routeElements = useMemo(
    () => (
      <Routes location={location} key={location.pathname}>
        {/* Public */}
        <Route path="/" element={<MainLayout><HomePage /></MainLayout>} />
        <Route path="/shop" element={<MainLayout><ShopPage /></MainLayout>} />
        <Route path="/product/:slug" element={<MainLayout><ProductDetailPage /></MainLayout>} />
        <Route path="/cart" element={<MainLayout><CartPage /></MainLayout>} />
        <Route path="/about" element={<MainLayout><AboutPage /></MainLayout>} />
        <Route path="/contact" element={<MainLayout><ContactPage /></MainLayout>} />

        {/* Auth */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected */}
        <Route
          path="/profile"
          element={
            <ProtectedRoute>
              <MainLayout><ProfilePage /></MainLayout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/checkout"
          element={
            <ProtectedRoute>
              <MainLayout><CheckoutPage /></MainLayout>
            </ProtectedRoute>
          }
        />

        {/* Admin */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute adminOnly>
              <AdminLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardPage />} />
          <Route path="products" element={<AdminProductsPage />} />
          <Route path="orders" element={<AdminOrdersPage />} />
        </Route>

        {/* Optional: 404 */}
        {/* <Route path="*" element={<NotFoundPage />} /> */}
      </Routes>
    ),
    [location]
  );

  return (
    <>
      <Suspense fallback={<PageLoader />}>
        <AnimatePresence mode="wait">
          <ScrollToTop />
          {routeElements}
        </AnimatePresence>
      </Suspense>
      <Toaster />
    </>
  );
}

export default App;
