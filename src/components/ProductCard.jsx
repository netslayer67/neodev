import React, { useRef } from 'react';
import { ShoppingBag, Heart, Eye } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { useToast } from './ui/use-toast';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const cardRef = useRef(null);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    dispatch(addToCart({ product }));
    toast({
      title: 'Added to Cart',
      description: `${product.name} has been successfully added.`,
      className: 'bg-black border-neutral-700 text-white',
    });
  };

  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = ((y - centerY) / centerY) * 6;
    const rotateY = ((x - centerX) / centerX) * -6;
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
      className="relative group w-full max-w-sm mx-auto perspective-1000 will-change-transform"
    >
      <Link
        to={`/product/${product.slug}`}
        className="block rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-2xl shadow-xl hover:shadow-2xl transition-all duration-500"
      >
        {/* Image Hero */}
        <div className="relative aspect-[4/5] overflow-hidden">
          <img
            src={product.images?.[0]?.url || 'https://images.unsplash.com/photo-1698476803391-cef4134df5c2'}
            alt={product.images?.[0]?.alt || product.name}
            loading="lazy"
            className="w-full h-full object-cover transform transition-transform duration-700 group-hover:scale-110"
          />

          {/* Liquid Glass Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10 pointer-events-none" />

          {/* Badge */}
          <span className="absolute top-4 left-4 bg-white/10 text-white text-xs font-medium px-3 py-1 rounded-full backdrop-blur-lg border border-white/20 shadow-md animate-pulse">
            New Arrival
          </span>

          {/* Icon Actions */}
          <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button
              className="p-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-white hover:bg-white/20 transition"
              aria-label="Add to wishlist"
            >
              <Heart size={16} />
            </button>
            <button
              className="p-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-white hover:bg-white/20 transition"
              aria-label="Preview product"
            >
              <Eye size={16} />
            </button>
          </div>
        </div>

        {/* Content */}
        <div className="relative z-20 p-6 space-y-3">
          <h3 className="text-white font-serif font-bold text-lg md:text-xl leading-tight tracking-tight truncate">
            {product.name}
          </h3>
          <p className="text-neutral-400 text-sm">{product.category}</p>

          <div className="flex items-center justify-between pt-4">
            <span className="text-gold-400 text-lg font-semibold tracking-tight">
              Rp {product.price.toLocaleString('id-ID')}
            </span>
            <motion.button
              whileTap={{ scale: 0.9 }}
              onClick={handleAddToCart}
              className="p-2 rounded-full bg-white/10 hover:bg-white/20 backdrop-blur-md border border-white/20 text-white transition"
              aria-label={`Add ${product.name} to cart`}
            >
              <ShoppingBag size={18} />
            </motion.button>
          </div>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;
