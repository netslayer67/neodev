"use client";

import { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
// Premium Shop Page - Luxury Collection
import { motion, AnimatePresence } from "framer-motion";
import { fetchProducts } from "@/store/slices/productSlice";
import ProductCard from "@/components/ProductCard";
import {
  Sparkles,
  Search,
  Filter,
  Grid3X3,
  LayoutGrid,
  ChevronDown,
  Shield,
  Star
} from "lucide-react";

// Security validation for inputs
const sanitizeInput = (input) => {
  if (typeof input !== 'string') return '';
  return input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/javascript:/gi, '')
    .replace(/on\w+\s*=/gi, '')
    .replace(/data:/gi, '')
    .replace(/vbscript:/gi, '')
    .trim()
    .slice(0, 100); // Limit length
};

export default function ShopPage() {
  const dispatch = useDispatch();
  const [activeCategory, setActiveCategory] = useState("All");
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const observer = useRef(null);

  const { items: products, pagination, status } = useSelector(
    (state) => state.products
  );

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Fetch products
  useEffect(() => {
    dispatch(
      fetchProducts({
        page,
        limit: isMobile ? 6 : 12,
        category: activeCategory === "All" ? "" : activeCategory,
        search: sanitizeInput(searchQuery)
      })
    );
  }, [dispatch, page, activeCategory, searchQuery, isMobile]);

  // Infinite scroll
  const lastProductElementRef = useCallback(
    (node) => {
      if (status === "loading") return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (
          entries[0].isIntersecting &&
          pagination.currentPage < pagination.totalPages
        ) {
          setPage((prev) => prev + 1);
        }
      });
      if (node) observer.current.observe(node);
    },
    [status, pagination]
  );

  const categories = useMemo(() => [
    { id: "All", label: "All", icon: "✨" },
    { id: "Tops", label: "Tops", icon: "👕" },
    { id: "Bottoms", label: "Bottoms", icon: "👖" },
    { id: "Outerwear", label: "Outerwear", icon: "🧥" },
    { id: "Accessories", label: "Accessories", icon: "👜" }
  ], []);

  const handleSearchChange = (e) => {
    const sanitized = sanitizeInput(e.target.value);
    setSearchQuery(sanitized);
    setPage(1);
  };

  const handleCategoryChange = (category) => {
    setActiveCategory(category);
    setPage(1);
    setIsFilterOpen(false);
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-background via-background to-card/20 text-foreground overflow-hidden">

      {/* Animated Decorative Blobs */}
      <motion.div
        animate={{
          x: [0, 100, 0],
          y: [0, -50, 0],
          scale: [1, 1.1, 1],
        }}
        transition={{
          duration: 20,
          repeat: Infinity,
          ease: "easeInOut"
        }}
        className="absolute -top-32 -left-32 w-80 h-80 bg-gradient-to-br from-accent/30 to-info/20 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          x: [0, -80, 0],
          y: [0, 60, 0],
          scale: [1, 0.9, 1],
        }}
        transition={{
          duration: 25,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 5
        }}
        className="absolute top-1/3 -right-24 w-72 h-72 bg-gradient-to-br from-secondary/25 to-warning/15 rounded-full blur-3xl"
      />
      <motion.div
        animate={{
          x: [0, 60, 0],
          y: [0, -40, 0],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 30,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 10
        }}
        className="absolute -bottom-40 left-1/4 w-96 h-96 bg-gradient-to-br from-success/20 to-accent/15 rounded-full blur-3xl"
      />

      {/* Hero Section */}
      <section className="relative pt-20 pb-8 px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 60 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
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
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.5, duration: 0.5 }}
            className="flex justify-center items-center gap-2"
          >
            {[...Array(5)].map((_, i) => (
              <Star key={i} className="w-4 h-4 text-warning fill-warning" />
            ))}
            <span className="ml-2 text-xs text-muted-foreground">Premium Certified</span>
          </motion.div>
        </motion.div>
      </section>


      {/* Products Grid */}
      <main className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-6xl mx-auto">
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
            className={`grid gap-4 sm:gap-6 ${isMobile
              ? 'grid-cols-2'
              : viewMode === "grid"
                ? 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4'
                : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
              }`}
          >
            {/* Loading Skeletons */}
            {status === "loading" &&
              Array.from({ length: isMobile ? 6 : 12 }).map((_, i) => (
                <motion.div
                  key={i}
                  variants={{
                    hidden: { opacity: 0, y: 20 },
                    visible: { opacity: 1, y: 0 },
                  }}
                  className="group relative"
                >
                  <div className="aspect-[4/5] rounded-2xl bg-gradient-to-br from-card/60 to-card/30 backdrop-blur-xl border border-border/50 p-4 animate-pulse">
                    <div className="w-full h-4/5 bg-gradient-to-br from-muted/40 to-muted/20 rounded-xl mb-3" />
                    <div className="h-4 w-3/4 bg-muted/30 rounded-lg mb-2" />
                    <div className="h-3 w-1/2 bg-muted/20 rounded-lg" />
                  </div>

                  {/* Skeleton Glow Effect */}
                  <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-transparent via-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-320" />
                </motion.div>
              ))}

            {/* Products */}
            {status !== "loading" &&
              products.map((product, i) => {
                const ref = i === products.length - 1 ? lastProductElementRef : null;
                return (
                  <motion.div
                    key={product._id}
                    ref={ref}
                    variants={{
                      hidden: { opacity: 0, y: 30 },
                      visible: { opacity: 1, y: 0 },
                    }}
                    whileHover={{
                      y: -8,
                      transition: { duration: 0.32, ease: "easeOut" }
                    }}
                    className="group relative"
                  >
                    {/* Glass Card Container */}
                    <div className="relative rounded-2xl bg-gradient-to-br from-card/70 to-card/40 backdrop-blur-xl border border-border/50 hover:border-accent/40 transition-all duration-320 shadow-lg hover:shadow-2xl hover:shadow-accent/10 overflow-hidden">

                      {/* Luxury Shimmer Effect */}
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/10 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100"
                        animate={{
                          x: ["-100%", "200%"],
                        }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          repeatDelay: 3,
                        }}
                      />

                      {/* Glow Border */}
                      <motion.div
                        className="absolute inset-0 rounded-2xl border-2 border-accent/0 group-hover:border-accent/30 transition-all duration-320"
                        whileHover={{
                          boxShadow: "0 0 30px rgba(var(--accent), 0.3)",
                        }}
                      />

                      <ProductCard product={product} index={i} />
                    </div>

                    {/* Floating Action */}
                    <motion.div
                      initial={{ opacity: 0, scale: 0.8 }}
                      whileHover={{ opacity: 1, scale: 1 }}
                      className="absolute -bottom-4 right-4 w-12 h-12 bg-gradient-to-r from-accent to-info rounded-full shadow-xl flex items-center justify-center cursor-pointer backdrop-blur-xl border border-accent/20 hover:shadow-2xl hover:shadow-accent/30 transition-all duration-320"
                    >
                      <motion.div
                        whileHover={{ rotate: 90 }}
                        transition={{ duration: 0.32 }}
                      >
                        <Sparkles className="w-5 h-5 text-white" />
                      </motion.div>
                    </motion.div>
                  </motion.div>
                );
              })}
          </motion.div>

          {/* End of Collection */}
          {status === "succeeded" &&
            pagination.currentPage >= pagination.totalPages && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="text-center mt-16 mb-8"
              >
                <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-card/60 to-card/40 backdrop-blur-xl border border-border/50 rounded-full">
                  <Star className="w-4 h-4 text-accent" />
                  <span className="text-sm font-medium text-muted-foreground">
                    You've seen our entire curated collection
                  </span>
                </div>
              </motion.div>
            )}
        </div>
      </main>
    </div>
  );
}