import React, { useEffect, useState, useMemo, useCallback, Suspense, lazy } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { Helmet } from "react-helmet";
import { ArrowRight, Search, X } from "lucide-react";
import vid from "../assets/vid.mp4";


import { fetchProducts } from "../store/slices/productSlice";
import ProductCard from "@/components/ProductCard";
import PageLoader from "@/components/PageLoader";
import { Button } from "@/components/ui/button";

// Lazy-load heavy sections for faster initial render
const LookbookSection = lazy(() => import("@/components/LookbookSection"));
const ManifestoSection = lazy(() => import("@/components/ManifestoSection"));
const CustomerReviews = lazy(() => import("@/components/CustomerReviews"));
const CTASection = lazy(() => import("@/components/CTASection"));

// shimmer uses tokens only (no hardcoded hex)
const shimmer = "animate-pulse bg-card/80";

// lightweight sanitization: remove tags, strip protocols, and limit length
const sanitizeInput = (raw = "", maxLen = 60) => {
  let s = String(raw).slice(0, maxLen);
  // remove tags
  s = s.replace(/<[^>]*>?/g, "");
  // remove protocols to avoid links
  s = s.replace(/https?:\/\//gi, "");
  s = s.replace(/mailto:/gi, "");
  // remove suspicious characters often used in injection attempts (keep basic punctuation)
  s = s.replace(/[<>"'`\\]/g, "");
  return s.trim();
};

const HomePage = () => {
  const dispatch = useDispatch();
  const { items: products, status: productStatus } = useSelector((s) => s.products);

  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
  const [compact, setCompact] = useState(false);
  const [debounced, setDebounced] = useState("");

  useEffect(() => {
    if (!products || products.length === 0) dispatch(fetchProducts());
  }, [dispatch, products]);

  // compact detector (works safe on SSR)
  useEffect(() => {
    if (typeof window === "undefined") return;
    const mq = window.matchMedia("(max-width:640px)");
    const onChange = (e) => setCompact(e.matches);
    setCompact(mq.matches);
    if (mq.addEventListener) mq.addEventListener("change", onChange);
    else mq.addListener(onChange);
    return () => {
      if (mq.removeEventListener) mq.removeEventListener("change", onChange);
      else mq.removeListener(onChange);
    };
  }, []);

  // debounce search to avoid re-renders and accidental heavy queries
  useEffect(() => {
    const t = setTimeout(() => setDebounced(search), 250);
    return () => clearTimeout(t);
  }, [search]);

  // input change handler with sanitization + soft validation
  const handleSearchChange = useCallback((e) => {
    const sanitized = sanitizeInput(e.target.value, 60);
    setSearch(sanitized);
  }, []);

  const featuredProducts = useMemo(() => (products || []).slice(0, 3), [products]);

  // compact-friendly sizes
  const btnSize = compact ? "sm" : "lg";
  const heroSize = compact ? "text-2xl" : "text-6xl";

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="text-foreground font-sans antialiased relative overflow-hidden"
    >
      <Helmet>
        <title>Neo Dervish — Soul Meets Style</title>
        <meta name="description" content="Luxury streetwear infused with soul and movement." />
      </Helmet>

      {/* Decorative blobs: token-driven colors only */}
      <motion.div
        className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-accent/20 blur-3xl"
        animate={{ scale: [1, 1.18, 1] }}
        transition={{ duration: 9, repeat: Infinity }}
        aria-hidden
      />

      <motion.div
        className="absolute bottom-8 right-8 w-72 h-72 rounded-full bg-secondary/10 blur-3xl"
        animate={{ scale: [1, 1.08, 1] }}
        transition={{ duration: 7, repeat: Infinity }}
        aria-hidden
      />

      {/* HERO */}
      <section className="relative w-full min-h-[56vh] md:min-h-[88vh] flex items-center justify-center bg-background text-foreground">
        {/* lightweight ambient video (poster fallback via CSS/video attributes) */}
        <video
          src={vid}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-30"
          aria-hidden
        />

        <div className="absolute inset-0 bg-overlay backdrop-blur-sm -z-10" />

        <div className="z-20 w-full max-w-5xl px-4 md:px-8 lg:px-12">
          <div className="glass-card p-6 md:p-8 rounded-3xl flex flex-col md:flex-row items-center gap-6 md:gap-10">
            <div className="flex-1 text-center md:text-left space-y-3">
              <h1 className={`${heroSize} font-bold tracking-tight`}>NEO DERVISH</h1>
              <p className="text-sm md:text-lg text-foreground/85 max-w-xl mx-auto md:mx-0">
                In Soul We Move — minimal, premium, movement-first streetwear.
              </p>

              <div className="flex items-center justify-center md:justify-start gap-3 mt-3">
                <Button
                  asChild
                  size={btnSize}
                  className="btn-primary px-6 py-2.5 rounded-full transition-all duration-[320ms] hover:scale-[1.03]"
                >
                  <Link to="/shop" className="flex items-center gap-2">
                    Explore <ArrowRight className="w-4 h-4 text-accent-foreground" />
                  </Link>
                </Button>

                <Button
                  asChild
                  size={compact ? "xs" : "md"}
                  className="px-5 py-2 rounded-full transition-all duration-[320ms] hover:bg-accent/20"
                >
                  <Link to="/lookbook" className="flex items-center gap-2">
                    Lookbook
                    <ArrowRight className="w-4 h-4 text-accent-foreground" />
                  </Link>
                </Button>
              </div>
            </div>

            {/* SEARCH */}
            <div className="w-full md:w-80">
              {!compact ? (
                <div className="relative">
                  <label htmlFor="hero-search" className="sr-only">
                    Search products
                  </label>
                  <input
                    id="hero-search"
                    name="search"
                    value={search}
                    onChange={handleSearchChange}
                    placeholder="Search product..."
                    className="w-full rounded-2xl py-3 pl-11 pr-3 bg-card/70 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent transition-all duration-[320ms] backdrop-blur-md text-foreground"
                    maxLength={60}
                    inputMode="search"
                    autoComplete="off"
                    aria-label="Search products"
                  />
                  <span className="absolute left-3.5 top-1/2 -translate-y-1/2 opacity-80 text-muted/80">
                    <Search className="w-4 h-4" />
                  </span>
                </div>
              ) : (
                <div className="flex justify-center">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setShowSearch((s) => !s)}
                    className="rounded-full border border-border bg-card/60 backdrop-blur-md"
                    aria-pressed={showSearch}
                  >
                    {showSearch ? <X className="w-4 h-4 text-foreground" /> : <Search className="w-4 h-4 text-foreground" />}
                  </Button>

                  {showSearch && (
                    <motion.input
                      initial={{ width: 0, opacity: 0 }}
                      animate={{ width: "100%", opacity: 1 }}
                      exit={{ width: 0, opacity: 0 }}
                      transition={{ duration: 0.32 }}
                      value={search}
                      onChange={handleSearchChange}
                      placeholder="Search..."
                      className="ml-2 flex-1 rounded-2xl py-2 px-3 bg-card/70 border border-border text-sm focus:outline-none focus:ring-2 focus:ring-accent backdrop-blur-md text-foreground transition-all duration-[320ms]"
                      maxLength={60}
                      aria-label="Compact search"
                    />
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-16 px-4 md:px-16 backdrop-blur-xl border-t border-border/10 bg-background text-foreground">
        <motion.div
          className="text-center mb-10"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-4xl font-serif font-semibold mb-2">Latest Drops</h2>
          <p className="text-accent/80 text-base">Made to move with you.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-7xl mx-auto">
          {productStatus === "loading" &&
            Array.from({ length: 3 }).map((_, i) => (
              <div key={i} className="rounded-2xl bg-card/5 border border-border/10 backdrop-blur-xl p-4 space-y-3">
                <div className={`w-full h-56 rounded-xl ${shimmer}`} />
                <div className={`w-3/4 h-4 rounded ${shimmer}`} />
                <div className={`w-1/2 h-3 rounded ${shimmer}`} />
              </div>
            ))}

          {productStatus === "succeeded" &&
            featuredProducts.map((product, i) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.12 }}
                viewport={{ once: true }}
                className="rounded-2xl bg-card/5 border border-border/10 backdrop-blur-xl shadow-lg hover:scale-[1.02] transition-transform duration-[320ms]"
              >
                <ProductCard product={product} index={i} />
              </motion.div>
            ))}
        </div>
      </section>

      {/* LAZY SECTIONS */}
      <Suspense fallback={<PageLoader />}>
        <LookbookSection />
        <ManifestoSection />
        <CustomerReviews />
        <CTASection />
      </Suspense>
    </motion.main>
  );
};

export default HomePage;
