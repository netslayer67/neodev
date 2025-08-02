'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { fetchProducts } from '@/store/slices/productSlice';
import ProductCard from '@/components/ProductCard';
import PageLoader from '@/components/PageLoader';
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
    <div className="bg-gradient-to-br from-black via-gray-900 to-black min-h-screen text-white transition-colors duration-700">
      <Helmet>
        <title>Shop — Premium Collection</title>
        <meta name="description" content="Explore our exclusive luxury collection crafted with elegance and detail." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative pt-32 pb-16 px-4 sm:px-6 lg:px-24">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold tracking-tight leading-tight bg-clip-text text-transparent bg-gradient-to-br from-white to-neutral-300">
            Curated For Elegance
          </h1>
          <p className="mt-4 text-neutral-400 max-w-xl mx-auto text-sm sm:text-base font-light">
            Discover refined pieces handpicked for modern icons. Elevated essentials, effortless luxury.
          </p>
          <div className="mt-6 flex justify-center items-center gap-3">
            <Sparkles className="w-4 h-4 text-yellow-400 animate-pulse" />
            <span className="text-xs uppercase tracking-widest text-yellow-400">Luxe Edition</span>
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
        className="px-4 sm:px-6 lg:px-24 pb-24 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        {status === 'loading' && Array.from({ length: 8 }).map((_, i) => (
          <motion.div
            key={i}
            className="rounded-xl border border-white/10 bg-white/5 backdrop-blur-md p-4 aspect-[4/5] animate-pulse"
          >
            <div className="w-full h-4/5 bg-neutral-800 rounded mb-4 shimmer" />
            <div className="h-4 w-3/4 bg-neutral-700 rounded mb-2 shimmer" />
            <div className="h-3 w-1/2 bg-neutral-700 rounded shimmer" />
          </motion.div>
        ))}

        {status !== 'loading' && products.map((product, i) => {
          const ref = i === products.length - 1 ? lastProductElementRef : null;
          return (
            <motion.div
              key={product._id}
              ref={ref}
              whileHover={{ scale: 1.02 }}
              transition={{ type: 'spring', stiffness: 180, damping: 20 }}
            >
              <ProductCard product={product} index={i} />
            </motion.div>
          );
        })}
      </motion.div>

      {/* End Collection Notice */}
      {status === 'succeeded' && pagination.currentPage >= pagination.totalPages && (
        <div className="text-center text-neutral-500 mt-12 text-sm tracking-widest uppercase">
          You’ve reached the end of the collection.
        </div>
      )}
    </div>
  );
}
