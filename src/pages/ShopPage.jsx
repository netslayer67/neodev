"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Helmet } from "react-helmet";
import { motion } from "framer-motion";
import { fetchProducts } from "@/store/slices/productSlice";
import ProductCard from "@/components/ProductCard";
import { Sparkles } from "lucide-react";

export default function ShopPage() {
  const dispatch = useDispatch();
  const [activeCategory, setActiveCategory] = useState("All");
  const [page, setPage] = useState(1);
  const observer = useRef(null);

  const { items: products, pagination, status } = useSelector(
    (state) => state.products
  );

  useEffect(() => {
    dispatch(
      fetchProducts({
        page,
        limit: 8,
        category: activeCategory === "All" ? "" : activeCategory,
      })
    );
  }, [dispatch, page, activeCategory]);

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

  const categories = ["All", "Tops", "Bottoms", "Outerwear", "Accessories"];

  return (
    <div className="relative min-h-screen text-foreground overflow-hidden">
      <Helmet>
        <title>Shop — Premium Collection</title>
        <meta
          name="description"
          content="Discover our premium collection — refined, timeless, effortless."
        />
      </Helmet>

      {/* Blobs */}
      <motion.div

        className="absolute -top-24 -left-20 w-72 h-72 bg-accent/25 rounded-full blur-3xl"
      />
      <motion.div

        className="absolute -bottom-28 -right-20 w-96 h-96 bg-secondary/30 rounded-full blur-3xl"
      />

      {/* 🏆 Hero */}
      <section className="relative pt-28 pb-16 px-4 sm:px-6 lg:px-20">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-4xl mx-auto text-center"
        >
          <h1 className="font-heading text-5xl md:text-6xl tracking-tight bg-gradient-to-r from-foreground to-muted-foreground bg-clip-text text-transparent">
            Curated for Icons
          </h1>
          <p className="mt-3 font-sans text-sm sm:text-base text-muted-foreground max-w-md mx-auto">
            Timeless pieces. Effortless style.
          </p>
          <div className="mt-4 flex justify-center items-center gap-2">
            <Sparkles className="w-4 h-4 text-accent animate-pulse" />
            <span className="text-xs font-sans uppercase tracking-widest text-accent">
              Luxe Edition
            </span>
          </div>
        </motion.div>
      </section>

      {/* 🛍️ Product Grid */}
      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0 },
          visible: {
            opacity: 1,
            transition: { staggerChildren: 0.08 },
          },
        }}
        className="px-4 sm:px-6 lg:px-20 pb-20 grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
      >
        {status === "loading" &&
          Array.from({ length: 8 }).map((_, i) => (
            <motion.div
              key={i}
              className="rounded-2xl bg-card/50 backdrop-blur-xl border border-border/50 p-4 aspect-[4/5] animate-pulse"
            >
              <div className="w-full h-4/5 bg-muted/50 rounded mb-3" />
              <div className="h-4 w-3/4 bg-muted/30 rounded mb-2" />
              <div className="h-3 w-1/2 bg-muted/30 rounded" />
            </motion.div>
          ))}

        {status !== "loading" &&
          products.map((product, i) => {
            const ref = i === products.length - 1 ? lastProductElementRef : null;
            return (
              <motion.div
                key={product._id}
                ref={ref}
                whileHover={{ scale: 1.02 }}
                transition={{ duration: 0.32 }}
                className="relative rounded-2xl bg-card/60 backdrop-blur-xl border border-border hover:border-accent/60 transition-all duration-320 shadow-sm hover:shadow-lg"
              >
                {/* glowing border ring */}
                <motion.div
                  aria-hidden
                  className="absolute inset-0 rounded-2xl border-2 border-accent/0"
                  whileHover={{ borderColor: "hsl(var(--accent))" }}
                  transition={{ duration: 0.32 }}
                />
                <ProductCard product={product} index={i} />
              </motion.div>
            );
          })}
      </motion.div>

      {/* End Collection */}
      {status === "succeeded" &&
        pagination.currentPage >= pagination.totalPages && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center font-sans text-sm text-muted-foreground mb-16"
          >
            You’ve reached the end.
          </motion.div>
        )}
    </div>
  );
}
