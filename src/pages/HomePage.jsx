/* HomePage.jsx (refactored)
   - Fokus: performance: memoization, debounce search, reduce framer-motion usage,
     replace continuous framer-motion with CSS animated blobs, optimize video load.
*/

"use client";

import React, { useEffect, useState, useMemo, useCallback, Suspense, lazy, useRef } from "react";
import { Link } from "react-router-dom";
import { motion, useReducedMotion } from "framer-motion";
import { useSelector, useDispatch, shallowEqual } from "react-redux";
import { Helmet } from "react-helmet";
import { ArrowRight, Search, X, Sparkles, Star, TrendingUp } from "lucide-react";
import vid from "../assets/vid.webm";
import { fetchProducts } from "../store/slices/productSlice";
import ProductCard from "@/components/ProductCard";
import { Button } from "@/components/ui/button";

/* Lazy sections (kept lazy) */
const LookbookSection = lazy(() => import(/* webpackChunkName: "lookbook" */ "@/components/LookbookSection"));
const ManifestoSection = lazy(() => import(/* webpackChunkName: "manifesto" */ "@/components/ManifestoSection"));
const CustomerReviews = lazy(() => import(/* webpackChunkName: "reviews" */ "@/components/CustomerReviews"));
const CTASection = lazy(() => import(/* webpackChunkName: "cta" */ "@/components/CTASection"));

/* Small helper: honor reduced motion */
const useMotionVariants = () => {
  const shouldReduce = useReducedMotion();
  return {
    container: shouldReduce
      ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
      : { hidden: { opacity: 0 }, visible: { opacity: 1, transition: { staggerChildren: 0.08 } } },
    item: shouldReduce
      ? { hidden: { opacity: 1 }, visible: { opacity: 1 } }
      : {
        hidden: { opacity: 0, y: 8 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.45, ease: [0.25, 0.25, 0.25, 1] } },
      },
  };
};

/* ------------------ HERO (memoized) ------------------ */
const Hero = React.memo(function Hero({ isMobile, onSearchToggle, showSearch }) {
  const videoRef = useRef(null);

  useEffect(() => {
    // Only set preload for desktop to reduce mobile bandwidth/cpu
    if (videoRef.current && !isMobile) {
      try {
        videoRef.current.preload = "metadata";
      } catch (e) {
        // ignore
      }
    }
  }, [isMobile]);

  return (
    <section className="relative min-h-[72vh] flex items-center justify-center">
      {/* Background: use <video> only for non-mobile; mobile shows poster */}
      {!isMobile ? (
        <div className="absolute inset-0">
          <video
            ref={videoRef}
            src={vid}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover"
            style={{ filter: "brightness(0.32) contrast(1.05)" }}
            preload="metadata"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-background/92 via-background/68 to-background/92" />
          <div className="absolute inset-0 backdrop-blur-[2px]" />
        </div>
      ) : (
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{
            // fallback: use a low-res image or poster if available; if not, solid background
            background:
              "linear-gradient(180deg, rgba(0,0,0,0.25), rgba(0,0,0,0.45))",
          }}
        />
      )}

      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-6">
          <div className="inline-flex items-center gap-2 px-5 py-2 rounded-full glass-card border border-accent/24">
            <Sparkles className="w-4 h-4 text-accent" />
            <span className="text-xs font-medium text-accent">Premium Collection</span>
          </div>

          <div className="space-y-2">
            <h1 className={`font-heading font-bold ${isMobile ? "text-3xl sm:text-4xl" : "text-5xl md:text-6xl lg:text-7xl"} tracking-tight leading-tight`} aria-label="Neo Dervish — Soul Meets Style">
              <span className="bg-gradient-to-r from-foreground via-accent to-secondary bg-clip-text text-transparent">NEO</span>{" "}
              <span className="text-foreground">DERVISH</span>
            </h1>

            <p className={`${isMobile ? "text-sm px-2" : "text-lg"} text-muted-foreground max-w-2xl mx-auto leading-relaxed`}>
              <span className="font-medium text-accent">Soul meets style</span> — premium streetwear for movement.
            </p>
          </div>

          <div className={`flex ${isMobile ? "flex-col gap-3 px-4" : "flex-row gap-5 justify-center"} mt-6`}>
            <Button
              asChild
              size={isMobile ? "md" : "lg"}
              className={`group relative ${isMobile ? "w-full py-4" : "px-6 py-3"} bg-gradient-to-r from-primary to-primary/85 hover:from-primary/95 hover:to-primary/75 rounded-2xl transition-transform duration-[320ms] hover:scale-[1.02]`}
            >
              <Link to="/shop" className="flex items-center justify-center gap-2">
                <span className="font-medium">Explore</span>
                <ArrowRight className="w-4 h-4 text-accent transition-transform duration-[320ms] group-hover:translate-x-1" />
              </Link>
            </Button>

            <Button
              asChild
              variant="outline"
              size={isMobile ? "md" : "lg"}
              className={`${isMobile ? "w-full py-4" : "px-6 py-3"} glass-card rounded-2xl transition-shadow duration-[320ms] hover:shadow-xl`}
            >
              <Link to="/galeri" className="flex items-center justify-center gap-2">
                <Star className="w-4 h-4 text-secondary" />
                <span className="font-medium">Lookbook</span>
              </Link>
            </Button>
          </div>

          <div className="mt-6 flex justify-center">
            <button
              onClick={onSearchToggle}
              aria-expanded={showSearch}
              className={`glass-card ${isMobile ? "p-4" : "p-3"} rounded-2xl border border-border/30 transition-all duration-[320ms] hover:scale-105 active:scale-95`}
            >
              <Search className="w-5 h-5 text-accent" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
});

/* ------------------ SearchBar (memoized) ------------------ */
const SearchBar = React.memo(function SearchBar({ search, setSearch, isSearching, onClear, isMobile, showSearch }) {
  const inputRef = useRef(null);

  useEffect(() => {
    if (showSearch && isMobile) {
      const timer = setTimeout(() => inputRef.current?.focus(), 100);
      return () => clearTimeout(timer);
    }
  }, [showSearch, isMobile]);

  return (
    <div className="mx-auto w-full max-w-2xl">
      <div className="relative glass-card rounded-2xl border border-border/30 overflow-hidden transition-all duration-[320ms]">
        <div className="flex items-center p-2">
          <Search className="w-5 h-5 text-muted-foreground ml-3 flex-shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search premium pieces..."
            className={`flex-1 ${isMobile ? "px-3 py-4" : "px-4 py-3"} bg-transparent text-foreground placeholder:text-muted-foreground focus:outline-none text-sm sm:text-base`}
            maxLength={80}
            autoComplete="off"
            aria-label="Search products"
            inputMode="search"
            enterKeyHint="search"
          />

          {isSearching && (
            <div className="mr-3 flex-shrink-0">
              <div className="w-4 h-4 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
            </div>
          )}

          {search && (
            <button onClick={onClear} className={`${isMobile ? "mr-2 p-3" : "mr-3 p-2"} rounded-md transition-opacity duration-[320ms] flex-shrink-0`} aria-label="Clear search">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          )}
        </div>
      </div>
    </div>
  );
});

/* ------------------ ProductGrid (memoized) ------------------ */
const ProductGrid = React.memo(function ProductGrid({ products = [], status = "idle", isMobile }) {
  const skeletonItems = useMemo(
    () =>
      Array.from({ length: isMobile ? 2 : 4 }).map((_, i) => (
        <div key={i} className="glass-card rounded-2xl p-4 animate-pulse">
          <div className="aspect-square bg-muted rounded-xl mb-3" />
          <div className="h-4 bg-muted rounded mb-2" />
          <div className="h-3 bg-muted rounded w-2/3" />
        </div>
      )),
    [isMobile],
  );

  if (status === "loading") {
    return <div className={`grid ${isMobile ? "grid-cols-1 gap-4" : "grid-cols-2 lg:grid-cols-4 gap-6"}`}>{skeletonItems}</div>;
  }

  return (
    <div className={`grid ${isMobile ? "grid-cols-1 gap-4" : "grid-cols-2 lg:grid-cols-4 gap-6 md:gap-8"}`}>
      {products.map((p, i) => (
        <div key={p._id} className="group relative">
          <div className="relative glass-card rounded-2xl border border-border/30 overflow-hidden transition-all duration-[320ms] hover:shadow-2xl hover:-translate-y-1 will-change-transform transform">
            <ProductCard product={p} index={i} />
          </div>
        </div>
      ))}
    </div>
  );
});

/* ------------------ HomePage ------------------ */
const HomePage = () => {
  const dispatch = useDispatch();

  /* Selectors: pick only what's needed */
  const products = useSelector((s) => (s.products && s.products.items) || [], shallowEqual);
  const productStatus = useSelector((s) => (s.products && s.products.status) || "idle");

  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const debounceRef = useRef(null);
  const variants = useMotionVariants();

  /* Fetch products only if needed */
  useEffect(() => {
    if (!products || products.length === 0) {
      // dispatch once
      dispatch(fetchProducts()).catch((err) => {
        console.error("fetchProducts failed:", err);
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch]);

  /* Use matchMedia for mobile detection (efficient) */
  useEffect(() => {
    const mql = window.matchMedia?.("(max-width: 768px)");
    const apply = () => setIsMobile(Boolean(mql?.matches));
    apply();
    if (mql && mql.addEventListener) {
      mql.addEventListener("change", apply);
      return () => mql.removeEventListener("change", apply);
    } else if (mql && mql.addListener) {
      // fallback
      mql.addListener(apply);
      return () => mql.removeListener(apply);
    }
  }, []);

  /* Handlers (memoized) */
  const handleSearchChange = useCallback((value) => {
    setSearch(value || "");
  }, []);

  const clearSearch = useCallback(() => {
    setSearch("");
    setSearchResults([]);
    setIsSearching(false);
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
      debounceRef.current = null;
    }
  }, []);

  const toggleSearch = useCallback(() => setShowSearch((s) => !s), []);

  /* featuredProducts memoized */
  const featuredProducts = useMemo(() => {
    return [...(products || [])].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, isMobile ? 4 : 8);
  }, [products, isMobile]);

  /* Debounced search filtering: runs 300ms after user stops typing */
  useEffect(() => {
    // if empty search -> clear results
    if (!search) {
      setSearchResults([]);
      setIsSearching(false);
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
      return;
    }

    setIsSearching(true);
    if (debounceRef.current) clearTimeout(debounceRef.current);

    debounceRef.current = setTimeout(() => {
      try {
        const q = search.trim().toLowerCase();
        // simple client-side filter (cheap). If product list is huge => move to indexed solution / server search.
        const matches = (products || []).filter((p) => {
          if (!p) return false;
          const name = (p.name || "").toLowerCase();
          const cat = (p.category || "").toLowerCase();
          return name.includes(q) || cat.includes(q) || (p.tags || []).some((t) => String(t).toLowerCase().includes(q));
        });
        setSearchResults(matches);
      } catch (err) {
        console.error("search filter error", err);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
        debounceRef.current = null;
      }
    }, 300);

    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
        debounceRef.current = null;
      }
    };
  }, [search, products]);

  return (
    <>
      <Helmet>
        <title>Neo Dervish — Premium Soul Meets Style</title>
        <meta name="description" content="Luxury streetwear crafted for movement." />
        <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />
        <meta name="theme-color" content="#000000" />
      </Helmet>

      <motion.main initial="hidden" animate="visible" variants={variants.container} className="relative min-h-screen text-foreground overflow-hidden">
        {/* Background decorative blobs: use CSS-based lightweight animation */}
        {!isMobile && (
          <div className="fixed inset-0 pointer-events-none overflow-hidden">
            <div className="absolute -top-24 -left-24 w-72 h-72 bg-accent/20 rounded-full blur-3xl bg-blob" />
            <div className="absolute top-1/4 -right-28 w-64 h-64 bg-secondary/20 rounded-full blur-3xl bg-blob delay-2000" />
          </div>
        )}

        <motion.div variants={variants.item} className="relative">
          <Hero isMobile={isMobile} onSearchToggle={toggleSearch} showSearch={showSearch} />

          {/* Mobile search dropdown */}
          {showSearch && isMobile && (
            <div className="px-4 -mt-4 pb-6" aria-hidden={false}>
              <SearchBar search={search} setSearch={handleSearchChange} isSearching={isSearching} onClear={clearSearch} isMobile={isMobile} showSearch={showSearch} />

              <div className="mt-4">
                {searchResults.length > 0 ? (
                  <div className="space-y-3">
                    {searchResults.map((r) => (
                      <Link key={r._id} to={`/product/${r._id}`} className="flex items-center gap-4 p-4 glass-card rounded-xl border border-border/20 active:scale-[0.98] transition-transform">
                        <div className="w-14 h-14 bg-card rounded-lg overflow-hidden flex-shrink-0">
                          {r.images?.[0] && <img src={r.images[0] || "/placeholder.svg"} alt={r.name} className="w-full h-full object-cover" loading="lazy" />}
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-foreground truncate">{r.name}</div>
                          <div className="text-xs text-muted-foreground">{r.category}</div>
                        </div>
                        <div className="text-sm font-medium text-accent flex-shrink-0">${r.price}</div>
                      </Link>
                    ))}
                  </div>
                ) : (
                  <div className="text-center text-sm text-muted-foreground p-6 glass-card rounded-xl">No matches — try a different keyword.</div>
                )}
              </div>
            </div>
          )}

          {/* Desktop search bar & results */}
          {!isMobile && (
            <div className="mt-6 px-4">
              <SearchBar search={search} setSearch={handleSearchChange} isSearching={isSearching} onClear={clearSearch} isMobile={isMobile} showSearch={showSearch} />

              {searchResults.length > 0 && (
                <div className="mt-3 max-w-2xl mx-auto border-t border-border/20">
                  {searchResults.map((r) => (
                    <Link key={r._id} to={`/product/${r._id}`} className="flex items-center gap-4 p-3 hover:bg-card/60 transition-colors duration-[320ms] border-b border-border/10 last:border-none">
                      <div className="w-12 h-12 bg-card rounded-md overflow-hidden">
                        {r.images?.[0] && <img src={r.images[0] || "/placeholder.svg"} alt={r.name} className="w-full h-full object-cover" loading="lazy" />}
                      </div>
                      <div className="flex-1">
                        <div className="text-sm font-medium text-foreground">{r.name}</div>
                        <div className="text-xs text-muted-foreground">{r.category}</div>
                      </div>
                      <div className="text-sm font-medium text-accent">${r.price}</div>
                    </Link>
                  ))}
                </div>
              )}
            </div>
          )}
        </motion.div>

        <motion.section variants={variants.item} className={`relative ${isMobile ? "py-12" : "py-16"} px-4 sm:px-6 lg:px-8`}>
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8 md:mb-10">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-warning/24 mb-4">
                <TrendingUp className="w-4 h-4 text-warning" />
                <span className="text-sm font-medium text-warning">Latest Drops</span>
              </div>

              <h2 className={`font-heading ${isMobile ? "text-2xl sm:text-3xl" : "text-4xl md:text-5xl"} font-bold mb-2 leading-tight`}>
                <span className="bg-gradient-to-r from-secondary via-accent to-info bg-clip-text text-transparent">Crafted</span>{" "}
                <span className="text-foreground">for Movement</span>
              </h2>

              <p className="text-sm text-muted-foreground max-w-2xl mx-auto px-2">Designed with intention — made to move.</p>
            </div>

            <ProductGrid products={featuredProducts} status={productStatus} isMobile={isMobile} />

            <div className={`text-center ${isMobile ? "mt-8" : "mt-12"}`}>
              <Button asChild size="md" className={`${isMobile ? "w-full max-w-sm py-4" : "px-6 py-3"} glass-card border border-accent/30 rounded-2xl transition-transform duration-[320ms] hover:scale-[1.02]`}>
                <Link to="/shop" className="flex items-center justify-center gap-2">
                  <span className="font-medium">Explore Full Collection</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </div>
        </motion.section>

        <Suspense fallback={<div className="flex items-center justify-center py-12"><div className="glass-card p-6 rounded-2xl"><div className="w-6 h-6 border-2 border-accent/30 border-t-accent rounded-full animate-spin mx-auto" /></div></div>}>
          <LookbookSection />
          <ManifestoSection />
          <CustomerReviews />
          <CTASection />
        </Suspense>
      </motion.main>

      {/* Inline styles for lightweight CSS animation blobs (Tailwind + custom styles) */}
      <style jsx="true">{`
        @keyframes float-blob {
          0% { transform: translate3d(0, 0, 0) scale(1); }
          50% { transform: translate3d(30px, -20px, 0) scale(1.05); }
          100% { transform: translate3d(0, 0, 0) scale(1); }
        }
        .bg-blob {
          animation: float-blob 24s ease-in-out infinite;
          will-change: transform, opacity;
        }
        .bg-blob.delay-2000 {
          animation-delay: 2s;
        }
      `}</style>
    </>
  );
};

export default HomePage;
