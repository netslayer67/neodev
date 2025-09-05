import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useSelector, useDispatch } from "react-redux";
import { Helmet } from "react-helmet";
import { ArrowRight } from "lucide-react";

import { fetchProducts } from "../store/slices/productSlice";
import ProductCard from "@/components/ProductCard";
import PageLoader from "@/components/PageLoader";
import CustomerReviews from "@/components/CustomerReviews";
import LookbookSection from "@/components/LookbookSection";
import ManifestoSection from "@/components/ManifestoSection";
import CTASection from "@/components/CTASection";
import { Button } from "@/components/ui/button";

import Vid from "../assets/vid.mp4";

const shimmer =
  "animate-pulse bg-gradient-to-r from-[#1E2A47] via-[#0F0F1A] to-[#1E2A47]";

const HomePage = () => {
  const dispatch = useDispatch();
  const { items: products, status: productStatus } = useSelector(
    (state) => state.products
  );
  const featuredProducts = products.slice(0, 3);

  useEffect(() => {
    if (products.length === 0) dispatch(fetchProducts());
  }, [dispatch, products.length]);

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="bg-gradient-to-br from-[#0F0F1A] via-[#1E2A47] to-[#0F0F1A] text-white font-sans antialiased relative overflow-hidden"
    >
      <Helmet>
        <title>Neo Dervish — Soul Meets Style</title>
        <meta
          name="description"
          content="Luxury streetwear infused with soul and movement."
        />
      </Helmet>

      {/* BLOBS BACKGROUND */}
      <motion.div
        className="absolute -top-40 -left-40 w-96 h-96 rounded-full bg-[#8A5CF6]/20 blur-3xl"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ duration: 8, repeat: Infinity }}
      />
      <motion.div
        className="absolute bottom-0 right-0 w-72 h-72 rounded-full bg-[#8A5CF6]/10 blur-3xl"
        animate={{ scale: [1, 1.1, 1] }}
        transition={{ duration: 6, repeat: Infinity }}
      />

      {/* HERO */}
      <section className="relative w-full h-[100dvh] flex items-center justify-center text-center">
        <motion.video
          src={Vid}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/70 backdrop-blur-sm z-10" />
        <motion.div
          className="z-20 px-4 md:px-8 max-w-2xl space-y-6"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-4xl md:text-7xl font-serif font-bold tracking-tight">
            NEO DERVISH
          </h1>
          <p className="text-lg md:text-2xl text-white/70">
            In Soul We Move
          </p>
          <Button
            asChild
            size="lg"
            className="bg-[#8A5CF6] text-white font-semibold px-8 py-4 rounded-full hover:bg-[#7A4AE0] transition-all"
          >
            <Link to="/shop" className="flex items-center gap-2">
              Explore
              <ArrowRight className="w-5 h-5" />
            </Link>
          </Button>
        </motion.div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-20 px-4 md:px-16 bg-white/5 backdrop-blur-xl border-t border-white/10">
        <motion.div
          className="text-center mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-3xl md:text-5xl font-serif font-semibold mb-2">
            Latest Drops
          </h2>
          <p className="text-white/60 text-base md:text-lg">
            Made to move with you.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {productStatus === "loading" &&
            Array.from({ length: 3 }).map((_, i) => (
              <div
                key={i}
                className="rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl p-6 space-y-4"
              >
                <div className={`w-full h-64 rounded-xl ${shimmer}`} />
                <div className={`w-3/4 h-5 rounded ${shimmer}`} />
                <div className={`w-1/2 h-4 rounded ${shimmer}`} />
              </div>
            ))}

          {productStatus === "succeeded" &&
            featuredProducts.map((product, i) => (
              <motion.div
                key={product._id}
                initial={{ opacity: 0, y: 40 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: i * 0.2 }}
                viewport={{ once: true }}
                className="rounded-3xl bg-white/5 border border-white/10 backdrop-blur-xl shadow-xl hover:scale-[1.02] transition-transform"
              >
                <ProductCard product={product} index={i} />
              </motion.div>
            ))}
        </div>
      </section>

      {/* LOOKBOOK */}
      <LookbookSection />

      {/* MANIFESTO */}
      <ManifestoSection />

      {/* REVIEWS */}
      <CustomerReviews />

      {/* CTA */}
      <CTASection />
    </motion.main>
  );
};

export default HomePage;
