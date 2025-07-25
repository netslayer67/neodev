import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Helmet } from "react-helmet";
import { useSelector, useDispatch } from "react-redux";
import { fetchProducts } from "../store/slices/productSlice";

import ProductCard from "@/components/ProductCard";
import PageLoader from "@/components/PageLoader";
import CustomerReviews from "@/components/CustomerReviews";
import LookbookSection from "@/components/LookbookSection";
import ManifestoSection from "@/components/ManifestoSection";
import CTASection from "@/components/CTASection";

import Vid from "../assets/vid.mp4";
import { Button } from "@/components/ui/button";

const HomePage = () => {
  const dispatch = useDispatch();
  const { items: products, status: productStatus } = useSelector((state) => state.products);
  const featuredProducts = products.slice(0, 3);

  useEffect(() => {
    if (products.length === 0) dispatch(fetchProducts());
  }, [dispatch, products.length]);

  const { scrollYProgress } = useScroll();
  const parallax = useTransform(scrollYProgress, [0, 1], ["-8%", "8%"]);

  return (
    <motion.main
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-br from-black via-neutral-950 to-black text-white font-sans antialiased overflow-x-hidden"
    >
      <Helmet>
        <title>Neo Dervish — Where Soul Meets Style</title>
        <meta name="description" content="Luxury streetwear infused with soul and movement. Discover the void." />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;800&family=Inter:wght@400;500;700&display=swap" rel="stylesheet" />
      </Helmet>

      {/* HERO */}
      <section className="relative h-[100dvh] flex items-center justify-center text-center overflow-hidden">
        <motion.video
          src={Vid}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover"
          style={{ y: parallax }}
        />
        <div className="absolute inset-0 bg-black/60 backdrop-blur-md z-0" />

        <motion.div
          className="relative z-10 px-6 max-w-3xl space-y-6"
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
        >
          <h1 className="text-5xl sm:text-6xl md:text-7xl font-serif font-bold tracking-tight leading-tight">
            NEO DERVISH
          </h1>
          <p className="text-xl sm:text-2xl text-white/70 italic">“In Soul We Move.”</p>
          <Button
            asChild
            size="lg"
            className="bg-white text-black font-semibold px-8 py-4 rounded-full transition hover:scale-105 hover:bg-neutral-200"
          >
            <Link to="/shop" className="flex items-center group gap-2">
              Explore The Void
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </Button>
        </motion.div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-28 px-6 md:px-12 backdrop-blur-xl border-y border-white/10 bg-black/30">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          viewport={{ once: true }}
          className="text-center max-w-xl mx-auto mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-serif font-semibold mb-3">Latest Drops</h2>
          <p className="text-white/60 text-lg">Curated for motion. Designed for spirit.</p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10 max-w-7xl mx-auto">
          {productStatus === "loading" && <PageLoader />}
          {productStatus === "succeeded" &&
            featuredProducts.map((product, i) => (
              <motion.div
                key={product._id}
                className="rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 p-4 hover:scale-[1.02] transition-transform shadow-lg"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.2, duration: 0.8 }}
                viewport={{ once: true }}
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
