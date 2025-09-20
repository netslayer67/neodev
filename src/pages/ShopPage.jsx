"use client";

import {
  useState,
  useEffect,
  useRef,
  useCallback,
  useMemo,
  memo,
  startTransition,
  lazy,
  Suspense
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";
import { fetchProducts } from "@/store/slices/productSlice";

// Lazy load ProductCard untuk code splitting
const ProductCard = lazy(() => import("@/components/ProductCard"));

// Import selective icons untuk mengurangi bundle size
import { Shield, Star, Sparkles } from "lucide-react";

// Constants untuk optimasi
const MOBILE_BREAKPOINT = 768;
const TABLET_BREAKPOINT = 1024;
const MOBILE_ITEMS_PER_PAGE = 8;
const DESKTOP_ITEMS_PER_PAGE = 16;
const RESIZE_DEBOUNCE_MS = 200;
const INTERSECTION_ROOT_MARGIN = '200px';

// Security validation yang dioptimasi dengan memoization
const sanitizeInput = (() => {
  const cache = new Map();
  const MAX_CACHE_SIZE = 100;

  return (input) => {
    if (typeof input !== 'string') return '';

    // Check cache first
    if (cache.has(input)) {
      return cache.get(input);
    }

    const sanitized = input
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .replace(/javascript:/gi, '')
      .replace(/on\w+\s*=/gi, '')
      .replace(/data:/gi, '')
      .replace(/vbscript:/gi, '')
      .trim()
      .slice(0, 100);

    // Maintain cache size
    if (cache.size >= MAX_CACHE_SIZE) {
      const firstKey = cache.keys().next().value;
      cache.delete(firstKey);
    }

    cache.set(input, sanitized);
    return sanitized;
  };
})();

// Optimized Device Detection Hook
const useDeviceDetection = () => {
  const [deviceInfo, setDeviceInfo] = useState(() => {
    if (typeof window === 'undefined') {
      return { isMobile: false, isTablet: false, isDesktop: true };
    }

    const width = window.innerWidth;
    return {
      isMobile: width < MOBILE_BREAKPOINT,
      isTablet: width >= MOBILE_BREAKPOINT && width < TABLET_BREAKPOINT,
      isDesktop: width >= TABLET_BREAKPOINT
    };
  });

  const resizeTimeoutRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }

      resizeTimeoutRef.current = setTimeout(() => {
        const width = window.innerWidth;
        const newDeviceInfo = {
          isMobile: width < MOBILE_BREAKPOINT,
          isTablet: width >= MOBILE_BREAKPOINT && width < TABLET_BREAKPOINT,
          isDesktop: width >= TABLET_BREAKPOINT
        };

        setDeviceInfo(prev => {
          // Only update if there's an actual change
          if (prev.isMobile !== newDeviceInfo.isMobile ||
            prev.isTablet !== newDeviceInfo.isTablet ||
            prev.isDesktop !== newDeviceInfo.isDesktop) {
            return newDeviceInfo;
          }
          return prev;
        });
      }, RESIZE_DEBOUNCE_MS);
    };

    window.addEventListener('resize', handleResize, { passive: true });

    return () => {
      window.removeEventListener('resize', handleResize);
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current);
      }
    };
  }, []);

  return deviceInfo;
};

// Memoized Decorative Blobs dengan reduced motion support
const DecorativeBlobs = memo(() => {
  const prefersReducedMotion = useReducedMotion();

  if (prefersReducedMotion) {
    return (
      <>
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-gradient-to-br from-accent/15 to-info/8 rounded-full blur-3xl opacity-60" />
        <div className="absolute top-1/3 -right-24 w-72 h-72 bg-gradient-to-br from-secondary/12 to-warning/8 rounded-full blur-3xl opacity-60" />
        <div className="absolute -bottom-40 left-1/4 w-96 h-96 bg-gradient-to-br from-success/8 to-accent/8 rounded-full blur-3xl opacity-60" />
      </>
    );
  }

  return (
    <>
      <motion.div
        animate={{ x: [0, 40, 0], y: [0, -20, 0] }}
        transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
        className="absolute -top-32 -left-32 w-80 h-80 bg-gradient-to-br from-accent/15 to-info/8 rounded-full blur-3xl"
        style={{ willChange: 'transform' }}
      />
      <motion.div
        animate={{ x: [0, -30, 0], y: [0, 25, 0] }}
        transition={{ duration: 35, repeat: Infinity, ease: "linear", delay: 10 }}
        className="absolute top-1/3 -right-24 w-72 h-72 bg-gradient-to-br from-secondary/12 to-warning/8 rounded-full blur-3xl"
        style={{ willChange: 'transform' }}
      />
      <motion.div
        animate={{ x: [0, 25, 0], y: [0, -15, 0] }}
        transition={{ duration: 40, repeat: Infinity, ease: "linear", delay: 20 }}
        className="absolute -bottom-40 left-1/4 w-96 h-96 bg-gradient-to-br from-success/8 to-accent/8 rounded-full blur-3xl"
        style={{ willChange: 'transform' }}
      />
    </>
  );
});

// Optimized Hero Section
const HeroSection = memo(() => {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section className="relative pt-20 pb-8 px-4 sm:px-6 lg:px-8">
      <motion.div
        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="max-w-6xl mx-auto text-center"
      >
        <div className="inline-flex items-center gap-2 mb-4 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 backdrop-blur-xl">
          <Shield className="w-4 h-4 text-accent" />
          <span className="text-xs font-medium text-accent uppercase tracking-wider">
            Authenticated Luxury
          </span>
        </div>

        <h1 className="font-heading text-4xl sm:text-5xl lg:text-7xl tracking-tight mb-4">
          <span className="bg-gradient-to-r from-foreground via-accent to-secondary bg-clip-text text-transparent">
            Curated for Icons
          </span>
        </h1>

        <p className="text-sm sm:text-base text-muted-foreground max-w-md mx-auto mb-6 leading-relaxed">
          Exclusive pieces for those who demand excellence
        </p>

        <motion.div
          initial={prefersReducedMotion ? { scale: 1 } : { scale: 0.9 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, duration: 0.3 }}
          className="flex justify-center items-center gap-2"
        >
          {[...Array(5)].map((_, i) => (
            <Star key={i} className="w-4 h-4 text-warning fill-warning" />
          ))}
          <span className="ml-2 text-xs text-muted-foreground">Premium Certified</span>
        </motion.div>
      </motion.div>
    </section>
  );
});

// Optimized Loading Skeleton
const LoadingSkeleton = memo(({ itemCount, gridClasses }) => (
  <div className={gridClasses}>
    {Array.from({ length: itemCount }, (_, i) => (
      <Suspense key={`skeleton-${i}`} fallback={<div className="aspect-[4/5] bg-muted/20 rounded-2xl animate-pulse" />}>
        <ProductCard loading={true} index={i} />
      </Suspense>
    ))}
  </div>
));

// Main ShopPage Component
export default function ShopPage() {
  const dispatch = useDispatch();
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isInitialLoad, setIsInitialLoad] = useState(true);

  const observerRef = useRef(null);
  const deviceInfo = useDeviceDetection();
  const prefersReducedMotion = useReducedMotion();

  const { items: products, pagination, status, error } = useSelector(
    (state) => state.products
  );

  // Memoized grid configuration
  const gridConfig = useMemo(() => {
    const { isMobile, isTablet } = deviceInfo;

    return {
      itemsPerPage: isMobile ? MOBILE_ITEMS_PER_PAGE : DESKTOP_ITEMS_PER_PAGE,
      gridClasses: isMobile
        ? 'grid grid-cols-2 gap-4'
        : isTablet
          ? 'grid grid-cols-3 gap-5'
          : 'grid grid-cols-4 gap-6',
      skeletonCount: isMobile ? 6 : isTablet ? 9 : 12
    };
  }, [deviceInfo]);

  // Optimized product fetching
  useEffect(() => {
    const fetchData = () => {
      startTransition(() => {
        dispatch(
          fetchProducts({
            page,
            limit: gridConfig.itemsPerPage,
            search: sanitizeInput(searchQuery)
          })
        );
      });
    };

    fetchData();

    if (isInitialLoad) {
      setIsInitialLoad(false);
    }
  }, [dispatch, page, searchQuery, gridConfig.itemsPerPage, isInitialLoad]);

  // Optimized intersection observer
  const lastProductElementRef = useCallback(
    (node) => {
      if (status === "loading") return;

      if (observerRef.current) {
        observerRef.current.disconnect();
      }

      observerRef.current = new IntersectionObserver((entries) => {
        if (
          entries[0].isIntersecting &&
          pagination?.currentPage < pagination?.totalPages &&
          status === "succeeded"
        ) {
          startTransition(() => {
            setPage(prev => prev + 1);
          });
        }
      }, {
        threshold: 0.1,
        rootMargin: INTERSECTION_ROOT_MARGIN
      });

      if (node) observerRef.current.observe(node);
    },
    [status, pagination]
  );

  // Cleanup
  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  // Memoized product list
  const productList = useMemo(() => {
    if (!products?.length) return [];

    return products.map((product, index) => (
      <Suspense
        key={product._id}
        fallback={<div className="aspect-[4/5] bg-muted/20 rounded-2xl animate-pulse" />}
      >
        <ProductCard
          product={product}
          index={index}
          ref={index === products.length - 1 ? lastProductElementRef : null}
        />
      </Suspense>
    ));
  }, [products, lastProductElementRef]);

  // Error boundary
  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-heading mb-4">Something went wrong</h2>
          <p className="text-muted-foreground mb-6">Please try refreshing the page</p>
          <button
            onClick={() => window.location.reload()}
            className="px-6 py-2 bg-accent text-white rounded-lg hover:bg-accent/90 transition-colors"
          >
            Refresh Page
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-background via-background to-card/20 text-foreground overflow-hidden">

      {/* Decorative Blobs */}
      <DecorativeBlobs />

      {/* Hero Section */}
      <HeroSection />

      {/* Products Grid */}
      <main className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-7xl mx-auto">

          {/* Loading State */}
          {(status === "loading" && isInitialLoad) && (
            <LoadingSkeleton
              itemCount={gridConfig.skeletonCount}
              gridClasses={gridConfig.gridClasses}
            />
          )}

          {/* Products Grid */}
          {status !== "loading" && products?.length > 0 && (
            <motion.div
              className={gridConfig.gridClasses}
              initial={prefersReducedMotion ? {} : { opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.3 }}
            >
              {productList}
            </motion.div>
          )}

          {/* No Products Found */}
          {status === "succeeded" && products?.length === 0 && (
            <div className="text-center py-16">
              <h3 className="text-xl font-heading mb-2">No products found</h3>
              <p className="text-muted-foreground">Try adjusting your search criteria</p>
            </div>
          )}

          {/* Loading More Indicator */}
          {status === "loading" && !isInitialLoad && (
            <div className="flex justify-center py-8">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
                <span className="text-sm text-muted-foreground">Loading more products...</span>
              </div>
            </div>
          )}

          {/* End of Collection */}
          {status === "succeeded" &&
            pagination?.currentPage >= pagination?.totalPages &&
            products?.length > 0 && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3 }}
                className="text-center mt-16 mb-8"
              >
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-card/50 to-card/30 backdrop-blur-md border border-border/40 rounded-full">
                  <Star className="w-4 h-4 text-accent" />
                  <span className="text-sm font-medium text-muted-foreground">
                    You've explored our entire curated collection
                  </span>
                </div>
              </motion.div>
            )}
        </div>
      </main>
    </div>
  );
}