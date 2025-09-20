import React, { useRef, useState, useEffect, useCallback, useMemo, memo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

// Import hanya ikon yang diperlukan untuk mengurangi bundle size
import { Heart, Eye } from "lucide-react";

// Konstanta untuk optimasi performa
const CAROUSEL_INTERVAL = 5000;
const TILT_SENSITIVITY = 6;
const ANIMATION_DURATION = 0.32;

// Shimmer effect yang dioptimasi dengan CSS-in-JS yang minimal
const shimmerClass = "animate-pulse bg-gradient-to-r from-muted/20 via-muted/40 to-muted/20";

// Memoized Badge Component untuk mencegah re-renders
const FreshDropBadge = memo(() => (
  <span className="absolute top-2 left-2 z-20 rounded-full border border-border/40 bg-card/60 px-2 py-0.5 text-[10px] font-medium text-foreground backdrop-blur-md shadow-sm">
    Fresh Drop
  </span>
));

// Memoized Action Buttons untuk hover state
const ActionButtons = memo(() => (
  <div className="absolute top-2 right-2 z-30 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
    <button
      aria-label="Add to wishlist"
      className="rounded-full border border-border bg-card/70 p-2 text-foreground backdrop-blur-md hover:bg-accent/30 transition-colors duration-200"
    >
      <Heart size={14} />
    </button>
    <button
      aria-label="Quick view"
      className="rounded-full border border-border bg-card/70 p-2 text-foreground backdrop-blur-md hover:bg-accent/30 transition-colors duration-200"
    >
      <Eye size={14} />
    </button>
  </div>
));

// Optimized Loading Skeleton Component
const LoadingSkeleton = memo(() => (
  <>
    {/* Image Skeleton */}
    <div className="relative aspect-[3/4] overflow-hidden rounded-t-2xl">
      <div className={`w-full h-full ${shimmerClass}`} />
      <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent z-10" />
    </div>

    {/* Content Skeleton */}
    <div className="relative z-20 space-y-2 p-4">
      <div className={`h-4 w-3/4 rounded-md ${shimmerClass}`} />
      <div className={`h-3 w-1/2 rounded-md ${shimmerClass}`} />
      <div className="mt-3 flex items-center justify-between">
        <div className={`h-4 w-1/3 rounded-md ${shimmerClass}`} />
      </div>
    </div>
  </>
));

// Optimized Product Image Component dengan lazy loading yang lebih baik
const ProductImage = memo(({ images, currentImage, productName }) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageError, setImageError] = useState(false);

  const currentImageData = images?.[currentImage];
  const imageUrl = currentImageData?.url || "https://via.placeholder.com/400x533/1a1a2e/ffffff?text=No+Image";

  const handleImageLoad = useCallback(() => {
    setImageLoaded(true);
  }, []);

  const handleImageError = useCallback(() => {
    setImageError(true);
    setImageLoaded(true);
  }, []);

  return (
    <div className="relative aspect-[3/4] overflow-hidden rounded-t-2xl bg-muted/20">
      <AnimatePresence mode="wait">
        <motion.img
          key={`${currentImageData?.url}-${currentImage}`}
          src={imageUrl}
          alt={currentImageData?.alt || productName || 'Product image'}
          loading="lazy"
          decoding="async"
          onLoad={handleImageLoad}
          onError={handleImageError}
          initial={{ opacity: 0 }}
          animate={{ opacity: imageLoaded ? 1 : 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className={`absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-102 ${imageError ? 'object-contain bg-muted/10' : ''
            }`}
          style={{ willChange: 'transform' }}
        />
      </AnimatePresence>

      {/* Gradient Overlay yang dioptimasi */}
      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent z-10" />

      {/* Loading indicator */}
      {!imageLoaded && (
        <div className="absolute inset-0 flex items-center justify-center bg-muted/10">
          <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
        </div>
      )}
    </div>
  );
});

// Optimized Product Info Component
const ProductInfo = memo(({ product }) => (
  <div className="relative z-20 space-y-1 p-4">
    <h3 className="font-heading text-base sm:text-lg leading-snug line-clamp-2 group-hover:text-accent transition-colors duration-200">
      {product.name}
    </h3>
    <p className="text-xs font-sans text-muted-foreground">
      {product.category}
    </p>
    <div className="mt-2 flex items-center justify-between">
      <span className="text-sm font-semibold text-accent">
        Rp {product.price?.toLocaleString?.("id-ID") || '0'}
      </span>
    </div>
  </div>
));

// Main ProductCard Component dengan optimasi maksimal
const ProductCard = memo(({ product, loading = false, index = null }) => {
  const cardRef = useRef(null);
  const rafRef = useRef(null);
  const intervalRef = useRef(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  const prefersReducedMotion = useReducedMotion();
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  // Memoized values untuk mencegah re-computation
  const hasMultipleImages = useMemo(() =>
    product?.images?.length > 1,
    [product?.images?.length]
  );

  const shouldShowFreshBadge = useMemo(() =>
    !loading && index === 0,
    [loading, index]
  );

  // Optimized image carousel dengan proper cleanup
  useEffect(() => {
    if (!hasMultipleImages || loading || prefersReducedMotion) return;

    intervalRef.current = setInterval(() => {
      setCurrentImage(prev => (prev + 1) % product.images.length);
    }, CAROUSEL_INTERVAL);

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [hasMultipleImages, loading, product?.images?.length, prefersReducedMotion]);

  // Optimized tilt effect dengan RAF dan throttling
  const handleMouseMove = useCallback((e) => {
    if (isMobile || prefersReducedMotion || !isHovered) return;

    // Cancel previous RAF untuk throttling
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
    }

    rafRef.current = requestAnimationFrame(() => {
      const card = cardRef.current;
      if (!card) return;

      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;

      const rotateX = ((y - rect.height / 2) / rect.height) * TILT_SENSITIVITY;
      const rotateY = ((x - rect.width / 2) / rect.width) * -TILT_SENSITIVITY;

      card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
  }, [isMobile, prefersReducedMotion, isHovered]);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);

    // Cancel any pending RAF
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }

    // Reset transform dengan smooth transition
    if (cardRef.current && !prefersReducedMotion) {
      cardRef.current.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
    }
  }, [prefersReducedMotion]);

  // Cleanup RAF pada unmount
  useEffect(() => {
    return () => {
      if (rafRef.current) {
        cancelAnimationFrame(rafRef.current);
      }
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, []);

  // Optimized animation variants
  const cardVariants = useMemo(() => ({
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: prefersReducedMotion ? 0.1 : ANIMATION_DURATION,
        ease: "easeOut"
      }
    }
  }), [prefersReducedMotion]);

  // Early return untuk loading state
  if (loading) {
    return (
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="group relative w-full overflow-hidden rounded-2xl border border-border/30 bg-card/40 backdrop-blur-md shadow-md"
      >
        <LoadingSkeleton />
      </motion.div>
    );
  }

  // Validation untuk product data
  if (!product || !product.slug) {
    return null;
  }

  return (
    <motion.div
      ref={cardRef}
      variants={cardVariants}
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true, margin: "100px" }}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className="group relative w-full transition-all duration-300 will-change-transform"
      style={{
        transformStyle: 'preserve-3d',
        backfaceVisibility: 'hidden'
      }}
    >
      <Link
        to={`/product/${product.slug}`}
        className="block overflow-hidden rounded-2xl border border-border/50 bg-card/60 backdrop-blur-xl shadow-lg transition-all duration-300 hover:shadow-xl hover:shadow-accent/5 hover:border-accent/40 focus:outline-none focus:ring-2 focus:ring-accent/50"
        aria-label={`View details for ${product.name}`}
      >
        {/* Decorative blob yang dioptimasi */}
        {!prefersReducedMotion && (
          <motion.div
            aria-hidden="true"
            className="absolute -top-8 -right-8 w-24 h-24 rounded-full bg-accent/10 blur-2xl opacity-0 group-hover:opacity-60 transition-opacity duration-300"
            animate={{
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        )}

        {/* Product Image */}
        <ProductImage
          images={product.images}
          currentImage={currentImage}
          productName={product.name}
        />

        {/* Fresh Drop Badge */}
        {shouldShowFreshBadge && <FreshDropBadge />}

        {/* Action Buttons */}
        <ActionButtons />

        {/* Product Info */}
        <ProductInfo product={product} />
      </Link>
    </motion.div>
  );
});

// Set display name untuk debugging
ProductCard.displayName = 'ProductCard';

export default ProductCard;