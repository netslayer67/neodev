import React, { useRef, useState } from 'react';
import { ShoppingBag, Heart, Eye } from 'lucide-react';
import { useDispatch } from 'react-redux';
import { addToCart } from '../store/slices/cartSlice';
import { useToast } from './ui/use-toast';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const sizes = ['S', 'M', 'L', 'XL'];

const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const { toast } = useToast();
  const cardRef = useRef(null);
  const [selectedSize, setSelectedSize] = useState(null);

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    if (!selectedSize) {
      toast({
        title: 'Please select a size.',
        description: 'Choose a size before adding to cart.',
        variant: 'destructive',
      });
      return;
    }

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
    const rotateX = ((y - rect.height / 2) / rect.height) * 8;
    const rotateY = ((x - rect.width / 2) / rect.width) * -8;
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
      className="relative group w-full max-w-sm mx-auto will-change-transform"
    >
      <Link
        to={`/product/${product.slug}`}
        className="block rounded-3xl overflow-hidden border border-white/10 bg-white/5 backdrop-blur-xl shadow-[0_4px_60px_rgba(255,255,255,0.04)] transition-all duration-500 hover:shadow-2xl"
      >
        {/* Image */}
        <div className="relative aspect-[4/5] overflow-hidden">
          <img
            src={product.images?.[0]?.url || 'https://via.placeholder.com/400'}
            alt={product.images?.[0]?.alt || product.name}
            loading="lazy"
            className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10 pointer-events-none" />

          {/* Badge */}
          <span className="absolute top-4 left-4 bg-white/10 text-white text-xs font-medium px-3 py-1 rounded-full backdrop-blur-lg border border-white/20 shadow-sm animate-pulse">
            New Arrival
          </span>

          {/* Icons */}
          <div className="absolute top-4 right-4 z-20 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
            <button className="p-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-white hover:bg-white/20 transition">
              <Heart size={16} />
            </button>
            <button className="p-2 rounded-full bg-white/10 border border-white/20 backdrop-blur-md text-white hover:bg-white/20 transition">
              <Eye size={16} />
            </button>
          </div>
        </div>

        {/* Info */}
        <div className="relative z-20 p-6 space-y-4">
          <h3 className="text-white font-serif font-bold text-lg md:text-xl leading-tight tracking-tight truncate">
            {product.name}
          </h3>
          <p className="text-neutral-400 text-sm">{product.category}</p>

          {/* Size */}
          <div className="flex gap-2 flex-wrap">
            {sizes.map((size) => (
              <button
                key={size}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedSize(size);
                }}
                className={`px-3 py-1 text-sm rounded-full border backdrop-blur-md transition-all duration-300
                  ${selectedSize === size
                    ? 'bg-gold-500 text-black border-gold-500 shadow-lg'
                    : 'bg-white/10 text-white border-white/20 hover:bg-white/20'
                  }`}
              >
                {size}
              </button>
            ))}
          </div>

          {/* Price & Cart */}
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
