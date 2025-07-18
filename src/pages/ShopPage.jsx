'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import { motion } from 'framer-motion';
import { fetchProducts } from '@/store/slices/productSlice';
import { ShoppingCart, Sun, Moon } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { PageLoader } from '@/components/PageLoader';

const categories = ['All', 'Hoodies', 'T-Shirts', 'Pants', 'Jackets', 'Accessories'];

export default function ShopPage() {
  const dispatch = useDispatch();
  const [activeCategory, setActiveCategory] = useState('All');
  const [page, setPage] = useState(1);
  const [darkMode, setDarkMode] = useState(true);
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

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  return (
    <div className={`${darkMode ? 'bg-gradient-to-br from-black via-gray-900 to-black text-white' : 'bg-neutral-100 text-neutral-900'} transition-colors duration-700`}>
      <Helmet>
        <title>Shop — Premium Collection</title>
        <meta name="description" content="Explore our exclusive luxury collection crafted with elegance and detail." />
      </Helmet>

      {/* Header */}
      <div className="relative pt-32 pb-16 px-6 lg:px-24">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <div>
            <h1 className="text-4xl md:text-5xl font-serif font-bold tracking-tight">The Luxe Collection</h1>
            <p className="text-neutral-400 mt-2">Modern fashion crafted for timeless presence.</p>
          </div>
          <div className="flex items-center gap-3">
            <button
              aria-label="Toggle Dark Mode"
              onClick={toggleDarkMode}
              className="p-2 rounded-full border border-neutral-700 bg-white/10 backdrop-blur-md hover:bg-white/20 transition"
            >
              {darkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <ShoppingCart className="text-gold-500" />
          </div>
        </div>

        {/* Category Filters */}
        <div className="mt-10 flex flex-wrap gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => {
                setActiveCategory(cat);
                setPage(1);
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              className={`relative px-4 py-2 rounded-full text-sm font-medium border transition-all duration-300 backdrop-blur-md ${activeCategory === cat
                ? 'bg-white/10 text-white border-gold-500 shadow-[0_0_10px_rgba(255,215,0,0.25)]'
                : 'bg-neutral-800/30 text-neutral-400 border-transparent hover:text-white hover:border-neutral-600'
                }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Product Grid */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.1 },
          },
        }}
        className="px-6 lg:px-24 pb-24 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
      >
        {products.map((product, i) => {
          const ref = i === products.length - 1 ? lastProductElementRef : null;
          return (
            <motion.div
              key={product._id}
              ref={ref}
              whileHover={{ scale: 1.03, rotateX: 2, rotateY: -2 }}
              transition={{ type: 'spring', stiffness: 200, damping: 20 }}
              className="bg-white/5 backdrop-blur-md rounded-xl p-4 shadow-xl transition-all duration-500 border border-white/10 hover:shadow-2xl group"
            >
              <ProductCard product={product} />
            </motion.div>
          );
        })}
      </motion.div>

      {/* Loader */}
      {status === 'loading' && (
        <div className="flex justify-center py-10">
          <PageLoader />
        </div>
      )}

      {status === 'succeeded' && pagination.currentPage >= pagination.totalPages && (
        <div className="text-center text-neutral-400 mt-12">You’ve reached the end of the collection.</div>
      )}
    </div>
  );
}
