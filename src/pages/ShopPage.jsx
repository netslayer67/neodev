import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { useDispatch, useSelector } from 'react-redux';

// 1. Import action dari productSlice
import { fetchProducts } from '../store/slices/productSlice';

import ProductCard from '@/components/ProductCard';
import { pageTransition } from '@/lib/motion';
import { PageLoader } from '@/components/PageLoader';

// Konfigurasi animasi (tetap sama)
const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.05 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: 'easeOut' } },
};

const ShopPage = () => {
  const dispatch = useDispatch();

  // 2. State lokal hanya untuk filter UI dan nomor halaman
  const [activeCategory, setActiveCategory] = useState('All');
  const [page, setPage] = useState(1);

  // 3. Ambil data dari Redux store
  const { items: products, pagination, status } = useSelector((state) => state.products);

  const categories = ['All', 'Hoodies', 'T-Shirts', 'Pants', 'Jackets', 'Accessories'];

  // 4. Logika untuk memuat produk
  useEffect(() => {
    // Dispatch action untuk mengambil produk saat kategori atau halaman berubah
    dispatch(fetchProducts({ page, limit: 8, category: activeCategory === 'All' ? '' : activeCategory }));
  }, [dispatch, page, activeCategory]);

  // 5. Infinite Scroll dengan Intersection Observer
  const observer = useRef();
  const lastProductElementRef = useCallback(node => {
    if (status === 'loading') return;
    if (observer.current) observer.current.disconnect();

    observer.current = new IntersectionObserver(entries => {
      // Jika elemen terakhir terlihat dan masih ada halaman berikutnya
      if (entries[0].isIntersecting && pagination.currentPage < pagination.totalPages) {
        setPage(prevPage => prevPage + 1);
      }
    });

    if (node) observer.current.observe(node);
  }, [status, pagination]);

  // Handler untuk mengubah kategori
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setPage(1); // Reset ke halaman pertama saat ganti kategori
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white px-4 sm:px-6 lg:px-8 pt-32 pb-24"
    >
      <Helmet>
        <title>Shop The Collection — Neo Dervish</title>
        <meta name="description" content="Explore the curated collection of modern, minimal, and luxury fashion by Neo Dervish." />
      </Helmet>

      {/* Kontrol Header & Filter (Tampilan Tetap Sama) */}
      <header className="container mx-auto mb-16 md:mb-20">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-8">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.8, ease: 'easeOut' }}>
            <h1 className="text-4xl lg:text-5xl font-bold tracking-tight text-white">The Collection</h1>
            <p className="text-neutral-400 mt-2 text-base">Curated pieces designed for the modern spirit.</p>
          </motion.div>
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.6, delay: 0.2 }} className="flex items-center flex-wrap gap-2 p-1.5 bg-neutral-900/60 rounded-full border border-neutral-700/80">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryChange(category)}
                className={`relative px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 focus:outline-none ${activeCategory === category ? 'text-white' : 'text-neutral-400 hover:text-white'}`}
              >
                {activeCategory === category && (
                  <motion.span
                    layoutId="active-pill"
                    className="absolute inset-0 bg-white/10 rounded-full"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
                <span className="relative z-10">{category}</span>
              </button>
            ))}
          </motion.div>
        </div>
      </header>

      {/* 6. Grid Produk Dinamis dari Redux */}
      <motion.div
        layout
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12"
      >
        {products.map((product, index) => {
          // Tambahkan ref ke elemen terakhir untuk trigger infinite scroll
          if (products.length === index + 1) {
            return (
              <motion.div ref={lastProductElementRef} key={product._id} layout variants={itemVariants}>
                <ProductCard product={product} />
              </motion.div>
            );
          }
          return (
            <motion.div key={product._id} layout variants={itemVariants}>
              <ProductCard product={product} />
            </motion.div>
          );
        })}
      </motion.div>

      {/* 7. Indikator Loading dan Pesan Akhir */}
      {status === 'loading' && <PageLoader />}
      {status === 'succeeded' && pagination.currentPage >= pagination.totalPages && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mt-16 text-neutral-500 text-sm">
          <p>You've reached the end of the collection.</p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default ShopPage;