import React, { useRef, useState, useEffect } from "react";
import { Heart, Eye } from "lucide-react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const shimmer =
  "animate-[shimmer_2s_infinite] bg-gradient-to-r from-transparent via-foreground/10 to-transparent";

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

  // Tilt effect (desktop only)
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
    if (cardRef.current) cardRef.current.style.transform = "rotateX(0deg) rotateY(0deg)";
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
        className="block overflow-hidden rounded-2xl border border-border/50 bg-card/60 backdrop-blur-xl shadow-lg transition-all duration-320 hover:shadow-xl hover:border-accent/60"
      >
        {/* Decorative subtle blob */}
        <motion.div
          aria-hidden
          className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-accent/20 blur-3xl opacity-40 group-hover:opacity-70 transition"
        />

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
                className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
              />
            </AnimatePresence>
          )}

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent z-10" />

          {/* Badge (fresh drop) */}
          {!loading && index === 0 && (
            <span className="absolute top-2 left-2 z-20 rounded-full border border-border/40 bg-card/60 px-2 py-0.5 text-[10px] font-medium text-foreground backdrop-blur-md shadow-sm animate-pulse">
              Fresh Drop
            </span>
          )}

          {/* Hover Icons */}
          {!loading && (
            <div className="absolute top-2 right-2 z-30 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-320">
              <button
                aria-label="Add to wishlist"
                className="rounded-full border border-border bg-card/70 p-2 text-foreground backdrop-blur-md hover:bg-accent/30 transition-all duration-320"
              >
                <Heart size={16} />
              </button>
              <button
                aria-label="Quick view"
                className="rounded-full border border-border bg-card/70 p-2 text-foreground backdrop-blur-md hover:bg-accent/30 transition-all duration-320"
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
              <h3 className="font-heading text-lg leading-snug line-clamp-2">
                {product.name}
              </h3>
              <p className="text-xs font-sans text-muted-foreground">
                {product.category}
              </p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-sm font-semibold text-accent">
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
