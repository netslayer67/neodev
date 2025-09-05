import React, { useRef, useState, useEffect } from "react";
import { Heart, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const shimmer =
  "animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-white/10 to-transparent";

const ProductCard = ({ product, loading = false, index = null }) => {
  const cardRef = useRef(null);
  const [currentImage, setCurrentImage] = useState(0);

  // Auto image carousel
  useEffect(() => {
    if (!product?.images?.length || product.images.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % product.images.length);
    }, 5000);
    return () => clearInterval(interval);
  }, [product?.images]);

  // Tilt effect on desktop only
  const handleMouseMove = (e) => {
    const card = cardRef.current;
    if (!card || window.innerWidth < 768) return;
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
    card.style.transform = "rotateX(0deg) rotateY(0deg)";
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      whileInView={{ opacity: 1, y: 0 }}
      initial={{ opacity: 0, y: 40 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
      className="group relative w-full transition-transform will-change-transform"
    >
      <Link
        to={loading ? "#" : `/product/${product?.slug}`}
        className="block overflow-hidden rounded-2xl border border-white/10 bg-[#1E2A47]/30 backdrop-blur-lg shadow-lg transition-all duration-500 hover:shadow-2xl hover:border-[#8A5CF6]/50"
      >
        {/* 🔮 Blob effect */}
        <div className="absolute -top-12 -right-12 w-32 h-32 bg-[#8A5CF6]/20 rounded-full blur-3xl group-hover:opacity-70 opacity-40 transition" />

        {/* Image Section */}
        <div className="relative aspect-[3/4] overflow-hidden rounded-t-2xl">
          {loading ? (
            <div className={`w-full h-full ${shimmer}`} />
          ) : (
            <AnimatePresence mode="wait">
              <motion.img
                key={product?.images?.[currentImage]?.url}
                src={
                  product?.images?.[currentImage]?.url ||
                  "https://via.placeholder.com/400"
                }
                alt={product?.images?.[currentImage]?.alt || product?.name}
                loading="lazy"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.6 }}
                className="h-full w-full object-cover absolute inset-0 transition-transform duration-700 group-hover:scale-105"
              />
            </AnimatePresence>
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0F0F1A]/90 via-[#0F0F1A]/40 to-transparent z-10" />

          {/* Badge */}
          {!loading && index === 0 && (
            <span className="absolute top-2 left-2 z-20 rounded-full border border-white/20 bg-white/10 px-2 py-0.5 text-[10px] font-medium text-white backdrop-blur-md shadow-sm animate-pulse">
              Fresh Drop
            </span>
          )}

          {/* Hover Icons */}
          {!loading && (
            <div className="absolute top-2 right-2 z-30 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <button
                aria-label="Add to wishlist"
                className="rounded-full border border-white/20 bg-white/10 p-2 text-white backdrop-blur-md hover:bg-[#8A5CF6]/40 transition"
              >
                <Heart size={16} />
              </button>
              <button
                aria-label="Quick view"
                className="rounded-full border border-white/20 bg-white/10 p-2 text-white backdrop-blur-md hover:bg-[#8A5CF6]/40 transition"
              >
                <Eye size={16} />
              </button>
            </div>
          )}
        </div>

        {/* Info Section */}
        <div className="relative z-20 space-y-1 p-4">
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
              <h3 className="font-serif text-base font-semibold text-white leading-snug line-clamp-2">
                {product.name}
              </h3>
              <p className="text-xs text-neutral-400">{product.category}</p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm font-semibold text-[#8A5CF6]">
                  Rp {product.price.toLocaleString("id-ID")}
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
