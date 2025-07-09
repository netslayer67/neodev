import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { products } from '@/data/products'; // Pastikan path ini benar
import ProductCard from '@/components/ProductCard'; // Pastikan path ini benar
import { pageTransition } from '@/lib/motion'; // Pastikan path ini benar

// Konfigurasi animasi untuk Framer Motion
const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.05 },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: 'easeOut' },
  },
};

const ShopPage = () => {
  const categories = ['All', 'Hoodies', 'T-Shirts', 'Pants', 'Jackets', 'Accessories'];
  const [activeCategory, setActiveCategory] = useState('All');
  const [visibleCount, setVisibleCount] = useState(8);
  const [isLoading, setIsLoading] = useState(false);
  const loadMoreRef = useRef(null);

  const filteredProducts = activeCategory === 'All'
    ? products
    : products.filter((p) => p.category === activeCategory);

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  // Infinite Scroll dengan Intersection Observer
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const entry = entries[0];
        if (entry.isIntersecting && !isLoading && hasMore) {
          setIsLoading(true);
          setTimeout(() => {
            setVisibleCount((prev) => prev + 4);
            setIsLoading(false);
          }, 500); // Simulasi waktu loading
        }
      },
      { threshold: 1.0 }
    );

    const currentRef = loadMoreRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [isLoading, hasMore]);

  // Reset scroll dan produk saat kategori berubah
  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setVisibleCount(8); // Reset ke jumlah produk awal
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

      {/* Kontrol Header & Filter */}
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
                className={`relative px-4 py-2 rounded-full text-sm font-medium transition-colors duration-300 focus:outline-none ${activeCategory === category ? 'text-white' : 'text-neutral-400 hover:text-white'
                  }`}
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

      {/* Grid Produk */}
      <motion.div
        layout
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="container mx-auto grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-6 gap-y-12"
      >
        <AnimatePresence>
          {visibleProducts.map((product) => (
            <motion.div key={product.id} layout variants={itemVariants} initial="hidden" animate="visible" exit="hidden">
              <ProductCard product={product} />
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Trigger & Indikator Loading */}
      <div ref={loadMoreRef} className="h-1 w-full mt-16" />
      {isLoading && (
        <div className="flex justify-center items-center mt-8">
          <div className="w-6 h-6 border-2 border-neutral-600 border-t-white rounded-full animate-spin"></div>
        </div>
      )}

      {!isLoading && !hasMore && (
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center mt-16 text-neutral-500 text-sm">
          <p>You've reached the end of the collection.</p>
        </motion.div>
      )}

    </motion.div>
  );
};

export default ShopPage;