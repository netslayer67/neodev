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

const shimmer = "animate-pulse bg-gradient-to-r from-neutral-800 via-neutral-700 to-neutral-800";

const HomePage = () => {
  const dispatch = useDispatch();
  const { items: products, status: productStatus } = useSelector((state) => state.products);
  const featuredProducts = products.slice(0, 3);

  useEffect(() => {
    if (products.length === 0) dispatch(fetchProducts());
  }, [dispatch, products.length]);

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
      className="bg-gradient-to-br from-neutral-950 via-black to-neutral-900 text-white font-sans antialiased"
    >
      <Helmet>
        <title>Neo Dervish — Soul Meets Style</title>
        <meta name="description" content="Luxury streetwear infused with soul and movement." />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;800&family=Inter:wght@400;500;700&display=swap" rel="stylesheet" />
      </Helmet>

      {/* HERO VIDEO */}
      <section className="relative w-full h-[100dvh] overflow-hidden flex items-center justify-center text-center">
        <motion.video
          src={Vid}
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-sm z-10" />
        <motion.div
          className="z-20 px-6 max-w-2xl space-y-6"
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
        >
          <h1 className="text-5xl md:text-7xl font-serif font-bold tracking-tight leading-[1.2]">
            NEO DERVISH
          </h1>
          <p className="text-xl md:text-2xl text-white/70 italic">“In Soul We Move.”</p>
          <Button
            asChild
            size="lg"
            className="bg-white/90 text-black font-semibold px-8 py-4 rounded-full hover:bg-white transition-all"
          >
            <Link to="/shop" className="flex items-center group gap-2">
              Explore the Void
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </motion.div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-24 px-6 md:px-16 bg-black/10 backdrop-blur-xl border-t border-white/10">
        <motion.div
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
        >
          <h2 className="text-4xl md:text-5xl font-serif font-semibold mb-4">Latest Drops</h2>
          <p className="text-white/60 text-lg">Where movement meets material.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
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

      {/* CUSTOMER REVIEWS */}
      <CustomerReviews />

      {/* CTA */}
      <CTASection />
    </motion.main>
  );
};

export default HomePage;
