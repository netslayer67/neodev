import React, { useRef, useState, useEffect } from 'react';
import { Heart, Eye } from 'lucide-react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const shimmer = 'animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent';

const ProductCard = ({ product, loading = false, index = null }) => {
  const cardRef = useRef(null);
  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    if (!product?.images?.length || product.images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % product.images.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [product?.images]);

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card || window.innerWidth < 768) return; // disable on mobile
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const rotateX = ((y - rect.height / 2) / rect.height) * 6;
    const rotateY = ((x - rect.width / 2) / rect.width) * -6;
    card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
  };

  const handleMouseLeave = () => {
    const card = cardRef.current;
    if (!card) return;
    card.style.transform = 'rotateX(0deg) rotateY(0deg)';
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileInView={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="group relative w-full transition-transform will-change-transform"
    >
      <Link
        to={loading ? '#' : `/product/${product?.slug}`}
        className="block overflow-hidden rounded-xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-md transition-all duration-500 hover:shadow-xl"
      >
        {/* Image Section */}
        <div className="relative aspect-[3/4] overflow-hidden rounded-t-xl">
          {loading ? (
            <div className={`w-full h-full ${shimmer}`} />
          ) : (
            <AnimatePresence mode="wait">
              <motion.img
                key={product?.images?.[currentImage]?.url}
                src={product?.images?.[currentImage]?.url || 'https://via.placeholder.com/400'}
                alt={product?.images?.[currentImage]?.alt || product?.name}
                loading="lazy"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.8 }}
                className="h-full w-full object-cover absolute inset-0 transition-transform duration-700 group-hover:scale-105"
              />
            </AnimatePresence>
          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10 pointer-events-none" />

          {!loading && index === 0 && (
            <span className="absolute top-2 left-2 z-20 rounded-full border border-white/20 bg-white/10 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-md shadow animate-pulse">
              Fresh Realease
            </span>
          )}

          {/* Hover Icons */}
          {!loading && (
            <div className="absolute top-2 right-2 z-30 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button className="rounded-full border border-white/20 bg-white/10 p-1.5 text-white backdrop-blur-md hover:bg-white/20 transition">
                <Heart size={14} />
              </button>
              <button className="rounded-full border border-white/20 bg-white/10 p-1.5 text-white backdrop-blur-md hover:bg-white/20 transition">
                <Eye size={14} />
              </button>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="relative z-20 space-y-1 p-3 sm:p-4">
          {loading ? (
            <>
              <div className={`h-4 w-3/4 rounded-md ${shimmer}`} />
              <div className={`h-3 w-1/2 rounded-md ${shimmer}`} />
              <div className="mt-5 flex items-center justify-between">
                <div className={`h-4 w-1/3 rounded-md ${shimmer}`} />
              </div>
            </>
          ) : (
            <>
              <h3 className="font-serif text-sm sm:text-base font-semibold text-white leading-snug line-clamp-2">
                {product.name}
              </h3>
              <p className="text-xs text-neutral-400">{product.category}</p>
              <div className="mt-2">
                <span className="text-sm font-semibold text-yellow-400">
                  Rp {product.price.toLocaleString('id-ID')}
                </span>
              </div>
            </>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
