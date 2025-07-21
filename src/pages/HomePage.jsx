import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Helmet } from 'react-helmet';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProducts } from '../store/slices/productSlice';

import ProductCard from '@/components/ProductCard';
import PageLoader from '@/components/PageLoader';
import CustomerReviews from '@/components/CustomerReviews';
import LookbookSection from '@/components/LookbookSection';
import ManifestoSection from '@/components/ManifestoSection';
import CTASection from '@/components/CTASection';

import Vid from '../assets/vid.mp4';
import { Button } from '@/components/ui/button';

const HomePage = () => {
  const dispatch = useDispatch();
  const { items: products, status: productStatus } = useSelector((state) => state.products);
  const featuredProducts = products.slice(0, 3);

  useEffect(() => {
    if (products.length === 0) dispatch(fetchProducts());
  }, [dispatch, products.length]);

  const { scrollYProgress } = useScroll();
  const parallaxY = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      className="bg-gradient-to-br from-black via-slate-950 to-black text-white font-sans antialiased overflow-x-hidden"
    >
      <Helmet>
        <title>Neo Dervish — Where Soul Meets Style</title>
        <meta name="description" content="Luxury streetwear infused with soul and movement. Discover the void." />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600;800&family=Inter:wght@400;500;700&display=swap" rel="stylesheet" />
      </Helmet>

      {/* HERO */}
      <section className="relative h-[100dvh] flex items-center justify-center text-center overflow-hidden">
        <video
          src={Vid}
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover opacity-20"
        />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-xl z-0" />

        <motion.div
          className="relative z-10 px-6 max-w-4xl space-y-6"
          initial={{ y: 60, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 1 }}
        >
          <h1 className="text-5xl sm:text-6xl md:text-8xl font-heading uppercase tracking-[.2em] text-white">
            NEO DERVISH
          </h1>
          <p className="text-lg sm:text-xl md:text-2xl text-white/70 font-light animate-pulse">
            " IN SOUL WE MOVE. "
          </p>
          <Button
            asChild
            size="lg"
            className="mt-6 px-10 py-5 rounded-full font-semibold bg-white text-black shadow-xl hover:bg-white/90 transition-all duration-300"
          >
            <Link to="/shop" className="flex items-center gap-2 group">
              Explore The Void
              <ArrowRight className="h-5 w-5 group-hover:translate-x-1 group-hover:rotate-6 transition-transform" />
            </Link>
          </Button>
        </motion.div>
      </section>

      {/* FEATURED PRODUCTS */}
      <section className="py-24 md:py-36 px-6 backdrop-blur-xl border-y border-white/10 bg-black/30">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-heading tracking-tight text-white">
            Latest Drops
          </h2>
          <p className="text-neutral-400 text-lg mt-3 max-w-md mx-auto">
            Curated for movement. Designed for clarity.
          </p>
        </div>
        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          transition={{ staggerChildren: 0.2 }}
        >
          {productStatus === 'loading' && <PageLoader />}
          {productStatus === 'succeeded' &&
            featuredProducts.map((product) => (
              <motion.div
                key={product._id}
                className="rounded-2xl bg-white/5 backdrop-blur-lg p-4 transition-transform duration-300 hover:scale-[1.02] hover:shadow-xl border border-white/10"
                whileHover={{ scale: 1.02 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
        </motion.div>
      </section>

      {/* LOOKBOOK */}
      <LookbookSection />

      {/* MANIFESTO */}
      <ManifestoSection />

      {/* REVIEWS */}
      <CustomerReviews />

      {/* CTA */}
      <CTASection />
    </motion.div>
  );
};

export default HomePage;
