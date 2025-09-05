'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { fetchProducts } from '@/store/slices/productSlice';
import ProductCard from '@/components/ProductCard';
import { Sparkles } from 'lucide-react';

export default function ShopPage() {
  const dispatch = useDispatch();
  const [activeCategory, setActiveCategory] = useState('All');
  const [page, setPage] = useState(1);
  const observer = useRef(null);

  const { items: products, pagination, status } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProducts({ page, limit: 8, category: activeCategory === 'All' ? '' : activeCategory }));
  }, [dispatch, page, activeCategory]);

  const lastProductElementRef = useCallback(
    (node) => {
      if (status === 'loading') return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && pagination.currentPage < pagination.totalPages) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [status, pagination]
  );

  return (
    <div className="relative min-h-screen text-white bg-[#0F0F1A] overflow-hidden">
      <Helmet>
        <title>Shop — Premium Collection</title>
        <meta name="description" content="Discover our premium collection — refined, timeless, effortless." />
      </Helmet>

      {/* 🔮 Blobs Background */}
      <div className="absolute -top-32 -left-32 w-96 h-96 bg-[#8A5CF6]/30 rounded-full mix-blend-screen filter blur-3xl animate-pulse" />
      <div className="absolute top-1/2 -right-32 w-[28rem] h-[28rem] bg-[#1E2A47]/40 rounded-full mix-blend-overlay filter blur-3xl animate-ping" />

      {/* Hero Section */}
      <section className="relative pt-28 pb-16 px-4 sm:px-6 lg:px-24">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-neutral-300">
            Curated for Icons
          </h1>
          <p className="mt-3 text-neutral-400 max-w-md mx-auto text-sm sm:text-base">
            Timeless pieces. Effortless style.
          </p>
          <div className="mt-5 flex justify-center items-center gap-2">
            <Sparkles className="w-4 h-4 text-[#8A5CF6] animate-pulse" />
            <span className="text-xs uppercase tracking-widest text-[#8A5CF6]">Luxe Edition</span>
          </div>
        </motion.div>
      </section>

      {/* Product Grid */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.08 },
          },
        }}
        className="px-4 sm:px-6 lg:px-24 pb-20 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        {status === 'loading' &&
          Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-4 aspect-[4/5] animate-pulse"
            >
              <div className="w-full h-4/5 bg-neutral-800 rounded mb-3" />
              <div className="h-4 w-3/4 bg-neutral-700 rounded mb-2" />
              <div className="h-3 w-1/2 bg-neutral-700 rounded" />
            </motion.div>
          ))}

        {status !== 'loading' &&
          products.map((product, i) => {
            const ref = i === products.length - 1 ? lastProductElementRef : null;
            return (
              <motion.div
                key={product._id}
                ref={ref}
                whileHover={{ scale: 1.03 }}
                transition={{ type: 'spring', stiffness: 200, damping: 20 }}
                className="rounded-2xl bg-[#1E2A47]/20 backdrop-blur-lg border border-white/10 hover:border-[#8A5CF6]/50 transition"
              >
                <ProductCard product={product} index={i} />
              </motion.div>
            );
          })}
      </motion.div>

      {/* End Collection */}
      {status === 'succeeded' && pagination.currentPage >= pagination.totalPages && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-neutral-500 mb-16 text-sm tracking-wide"
        >
          You’ve reached the end.
        </motion.div>
      )}
    </div>
  );
}
