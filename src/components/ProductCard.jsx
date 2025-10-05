import React, { useRef, useState, useEffect, useCallback, useMemo, memo } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { Heart, Eye, Clock, Award } from "lucide-react";

// Constants
const CAROUSEL_INTERVAL = 5000;
const TILT_SENSITIVITY = 6;
const ANIMATION_DURATION = 0.32;

// Shimmer effect
const shimmerClass = "animate-pulse bg-gradient-to-r from-muted/20 via-muted/40 to-muted/20";

// Badge
const FreshDropBadge = memo(() => (
  <span className="absolute top-2 left-2 z-20 rounded-full border border-border/40 bg-card/60 px-2 py-0.5 text-[10px] font-medium text-foreground backdrop-blur-md shadow-sm">
    Fresh Drop
  </span>
));

// Preorder Badge
const PreorderBadge = memo(() => (
  <span className="absolute top-2 left-2 z-20 rounded-full border border-warning/40 bg-gradient-to-r from-warning/20 to-accent/20 px-2 py-0.5 text-[10px] font-medium text-warning backdrop-blur-md shadow-sm">
    <Clock size={8} className="inline mr-1" />
    PREORDER
  </span>
));

// Action buttons
const ActionButtons = memo(() => (
  <div className="absolute top-2 right-2 z-30 flex flex-col gap-2 opacity-0 group-hover:opacity-100 transition-opacity duration-320">
    <button className="rounded-full border border-border bg-card/70 p-2 text-foreground backdrop-blur-md hover:bg-accent/30 transition-colors duration-320" aria-label="Wishlist">
      <Heart size={14} />
    </button>
    <button className="rounded-full border border-border bg-card/70 p-2 text-foreground backdrop-blur-md hover:bg-accent/30 transition-colors duration-320" aria-label="Quick View">
      <Eye size={14} />
    </button>
  </div>
));

// Loading skeleton
const LoadingSkeleton = memo(() => (
  <>
    <div className="relative aspect-[3/4] overflow-hidden rounded-t-2xl">
      <div className={`w-full h-full ${shimmerClass}`} />
      <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent z-10" />
    </div>
    <div className="relative z-20 space-y-2 p-4">
      <div className={`h-4 w-3/4 rounded-md ${shimmerClass}`} />
      <div className={`h-3 w-1/2 rounded-md ${shimmerClass}`} />
      <div className="mt-3 flex items-center justify-between">
        <div className={`h-4 w-1/3 rounded-md ${shimmerClass}`} />
      </div>
    </div>
  </>
));

// Product Image
const ProductImage = memo(({ images, currentImage, productName }) => {
  const [loaded, setLoaded] = useState(false);
  const [error, setError] = useState(false);

  const imageData = images?.[currentImage];
  const imageUrl = imageData?.url || "https://via.placeholder.com/400x533/1a1a2e/ffffff?text=No+Image";

  return (
    <div className="relative aspect-[3/4] overflow-hidden rounded-t-2xl bg-muted/20">
      <AnimatePresence mode="wait">
        <motion.img
          key={`${imageData?.url}-${currentImage}`}
          src={imageUrl}
          alt={imageData?.alt || productName || 'Product'}
          loading="lazy"
          decoding="async"
          onLoad={() => setLoaded(true)}
          onError={() => { setError(true); setLoaded(true); }}
          initial={{ opacity: 0 }}
          animate={{ opacity: loaded ? 1 : 0 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.4, ease: "easeOut" }}
          className={`absolute inset-0 h-full w-full object-cover transition-transform duration-500 group-hover:scale-102 ${error ? 'object-contain bg-muted/10' : ''}`}
          style={{ willChange: 'transform' }}
        />
      </AnimatePresence>
      <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent z-10" />
      {!loaded && <div className="absolute inset-0 flex items-center justify-center bg-muted/10">
        <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
      </div>}
    </div>
  );
});

// Product Info
const ProductInfo = memo(({ product, isPreorder = false }) => (
  <div className="relative z-20 space-y-1 p-4">
    <h3 className={`font-heading text-base sm:text-lg line-clamp-2 transition-colors duration-320 ${isPreorder ? 'group-hover:text-warning' : 'group-hover:text-accent'}`}>{product.name}</h3>
    <p className="text-xs font-sans text-muted-foreground">{product.category}</p>
    <div className="mt-2 flex items-center justify-between">
      <span className={`text-sm font-semibold ${isPreorder ? 'text-warning' : 'text-accent'}`}>Rp {product.price?.toLocaleString("id-ID") || '0'}</span>
      {isPreorder && (
        <div className="flex items-center gap-1 text-xs text-warning font-medium">
          <Award size={10} />
          <span>VA Only</span>
        </div>
      )}
    </div>
  </div>
));

// Main ProductCard
const ProductCard = memo(({ product, loading = false, index = null, isPreorder = false }) => {
  const cardRef = useRef(null);
  const rafRef = useRef(null);
  const intervalRef = useRef(null);
  const [currentImage, setCurrentImage] = useState(0);
  const [hovered, setHovered] = useState(false);

  const prefersReducedMotion = useReducedMotion();
  const isMobile = typeof window !== 'undefined' && window.innerWidth < 768;

  const multipleImages = useMemo(() => product?.images?.length > 1, [product?.images?.length]);
  const showBadge = useMemo(() => !loading && index === 0 && !isPreorder, [loading, index, isPreorder]);
  const showPreorderBadge = useMemo(() => !loading && isPreorder, [loading, isPreorder]);

  useEffect(() => {
    if (!multipleImages || loading || prefersReducedMotion) return;
    intervalRef.current = setInterval(() => setCurrentImage(prev => (prev + 1) % product.images.length), CAROUSEL_INTERVAL);
    return () => clearInterval(intervalRef.current);
  }, [multipleImages, loading, product?.images?.length, prefersReducedMotion]);

  const handleMouseMove = useCallback((e) => {
    if (isMobile || prefersReducedMotion || !hovered) return;
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    rafRef.current = requestAnimationFrame(() => {
      const rect = cardRef.current.getBoundingClientRect();
      const rotateX = ((e.clientY - rect.top - rect.height / 2) / rect.height) * TILT_SENSITIVITY;
      const rotateY = ((e.clientX - rect.left - rect.width / 2) / rect.width) * -TILT_SENSITIVITY;
      cardRef.current.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`;
    });
  }, [hovered, isMobile, prefersReducedMotion]);

  const handleMouseEnter = useCallback(() => setHovered(true), []);
  const handleMouseLeave = useCallback(() => {
    setHovered(false);
    if (rafRef.current) cancelAnimationFrame(rafRef.current);
    if (cardRef.current && !prefersReducedMotion) cardRef.current.style.transform = "perspective(1000px) rotateX(0deg) rotateY(0deg)";
  }, [prefersReducedMotion]);

  useEffect(() => () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); if (intervalRef.current) clearInterval(intervalRef.current); }, []);

  const variants = useMemo(() => ({
    hidden: { opacity: 0, y: prefersReducedMotion ? 0 : 20 },
    visible: { opacity: 1, y: 0, transition: { duration: prefersReducedMotion ? 0.1 : ANIMATION_DURATION, ease: "easeOut" } }
  }), [prefersReducedMotion]);

  if (loading) return (
    <motion.div variants={variants} initial="hidden" animate="visible" className="group relative w-full overflow-hidden rounded-2xl border border-border/30 bg-card/40 backdrop-blur-md shadow-md">
      <LoadingSkeleton />
    </motion.div>
  );

  if (!product || !product.slug) return null;

  return (
    <motion.div ref={cardRef} variants={variants} initial="hidden" whileInView="visible" viewport={{ once: true, margin: "100px" }} onMouseMove={handleMouseMove} onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave} className="group relative w-full transition-all duration-320 will-change-transform" style={{ transformStyle: 'preserve-3d', backfaceVisibility: 'hidden' }}>
      <Link to={isPreorder ? `/preorder/${product.slug}` : `/product/${product.slug}`} className={`block overflow-hidden rounded-2xl border border-border/50 backdrop-blur-xl shadow-lg transition-all duration-320 hover:shadow-xl focus:outline-none focus:ring-2 ${isPreorder ? 'bg-gradient-to-br from-card/60 to-warning/5 hover:shadow-warning/5 hover:border-warning/40 focus:ring-warning/50' : 'bg-card/60 hover:shadow-accent/5 hover:border-accent/40 focus:ring-accent/50'}`} aria-label={`View details for ${product.name}`}>
        {!prefersReducedMotion && <motion.div className={`absolute -top-8 -right-8 w-24 h-24 rounded-full blur-2xl opacity-0 group-hover:opacity-60 transition-opacity duration-320 ${isPreorder ? 'bg-warning/10' : 'bg-accent/10'}`} animate={{ scale: [1, 1.1, 1] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }} />}
        <ProductImage images={product.images} currentImage={currentImage} productName={product.name} />
        {showBadge && <FreshDropBadge />}
        {showPreorderBadge && <PreorderBadge />}
        <ActionButtons />
        <ProductInfo product={product} isPreorder={isPreorder} />
      </Link>
    </motion.div>
  );
});

ProductCard.displayName = 'ProductCard';
export default ProductCard;
