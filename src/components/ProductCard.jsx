import React, { useRef, useState, useEffect } from 'react';
import { ShoppingBag, Heart, Eye } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { useToast } from './ui/use-toast';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

const shimmer = 'animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent';

const ProductCard = ({ product, loading = false, index = null }) => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const cardRef = useRef(null);
  const [selectedSize] = useState(null);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart({ product, size: selectedSize }));
    toast({
      title: 'Added to Cart',
      description: `${product.name} (Size ${selectedSize}) added.`,
      className: 'bg-black border-neutral-700 text-white',
    });
  };

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
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

  const [currentImage, setCurrentImage] = useState(0);

  useEffect(() => {
    if (!product?.images?.length || product.images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % product.images.length);
    }, 6000);

    return () => clearInterval(interval);
  }, [product?.images]);

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileInView={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 50 }}
      transition={{ duration: 0.6, ease: 'easeOut' }}
      className="group relative w-full max-w-sm mx-auto transition-transform will-change-transform"
    >
      <Link
        to={loading ? '#' : `/product/${product?.slug}`}
        className="block overflow-hidden rounded-3xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_4px_60px_rgba(255,255,255,0.05)] transition-all duration-500 hover:shadow-xl"
      >
        {/* Image */}
        <div className="relative aspect-[4/5] overflow-hidden">
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
                className="h-full w-full object-cover absolute inset-0 transition-transform duration-700 group-hover:scale-110"
              />
            </AnimatePresence>

          )}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10 pointer-events-none" />
          {!loading && index === 0 && (
            <span className="absolute top-4 left-4 z-20 rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-bold text-white backdrop-blur-md shadow animate-pulse drop-shadow-[0_0_2px_black]">
              Fresh Release
            </span>
          )}
          {/* Hover Icons */}
          {!loading && (
            <div className="absolute top-4 right-4 z-30 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button className="rounded-full border border-white/20 bg-white/10 p-2 text-white backdrop-blur-md hover:bg-white/20 transition">
                <Heart size={16} />
              </button>
              <button className="rounded-full border border-white/20 bg-white/10 p-2 text-white backdrop-blur-md hover:bg-white/20 transition">
                <Eye size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Info */}
        <div className="relative z-20 space-y-3 p-6">
          {loading ? (
            <>
              <div className={`h-4 w-3/4 rounded-md ${shimmer}`} />
              <div className={`h-3 w-1/2 rounded-md ${shimmer}`} />
              <div className="mt-6 flex items-center justify-between">
                <div className={`h-4 w-1/3 rounded-md ${shimmer}`} />
                <div className={`h-8 w-8 rounded-full ${shimmer}`} />
              </div>
            </>
          ) : (
            <>
              <h3 className="truncate font-serif text-lg font-bold leading-tight tracking-tight text-white md:text-xl">
                {product.name}
              </h3>
              <p className="text-sm text-neutral-400">{product.category}</p>

              <div className="mt-4 flex items-center justify-between">
                <span className="text-lg font-semibold tracking-tight text-yellow-400">
                  Rp {product.price.toLocaleString('id-ID')}
                </span>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleAddToCart}
                  className="rounded-full border border-white/20 bg-white/10 p-2 text-white backdrop-blur-md hover:bg-white/20 transition"
                  aria-label={`Add ${product.name} to cart`}
                >
                  <ShoppingBag size={18} />
                </motion.button>
              </div>
            </>
          )}
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
