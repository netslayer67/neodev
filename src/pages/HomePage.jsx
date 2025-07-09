// HomePage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { products } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import { Helmet } from 'react-helmet';
import { useToast } from '@/components/ui/use-toast';
import CustomerReviews from '@/components/CustomerReviews';
import LookbookSection from '@/components/LookbookSection';
import ManifestoSection from '@/components/ManifestoSection';
import Vid from '../assets/vid.mp4';

// Helper component for animated text characters
const AnimatedText = ({ text, el: Wrapper = 'p', className, variants }) => (
  <Wrapper className={className}>
    <span className="sr-only">{text}</span>
    <motion.span
      initial="hidden"
      whileInView="visible"
      viewport={{ once: true }}
      transition={{ staggerChildren: 0.03 }}
      aria-hidden
    >
      {text.split("").map((char, i) => (
        <motion.span key={i} variants={variants} className="inline-block">
          {char}
        </motion.span>
      ))}
    </motion.span>
  </Wrapper>
);

const HomePage = () => {
  const featuredProducts = products.filter(p => p.isFeatured);
  const { toast } = useToast();

  // Hooks for parallax scroll effect
  const { scrollYProgress } = useScroll();
  const parallaxY = useTransform(scrollYProgress, [0, 1], ["-20%", "20%"]);

  const handleStoryClick = () => {
    toast({
      title: "🚧 Our Story is Coming Soon",
      description: "We are currently crafting this page. Please check back later.",
      variant: "default",
    });
  };

  // Animation variants
  const textReveal = {
    hidden: { opacity: 0, y: "100%" },
    visible: { opacity: 1, y: "0%", transition: { duration: 0.8, ease: "circOut" } },
  };

  const fadeIn = (direction = 'up', delay = 0) => ({
    hidden: {
      opacity: 0,
      y: direction === 'up' ? 20 : -20,
    },
    show: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        delay,
        ease: 'easeOut'
      }
    }
  });

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-b from-black via-gray-800 to-black text-white antialiased"
    >
      <Helmet>
        <title>Neo Dervish — Where Soul Meets Style</title>
        <meta name="description" content="Discover exclusive streetwear from Neo Dervish. Premium collections crafted with meaning and designed for movement." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative h-screen flex flex-col items-center justify-center text-center overflow-hidden">
        <motion.video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
          src={Vid}
          style={{ y: parallaxY, opacity: 0.15 }}
        />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />
        <motion.div
          className="relative z-10 p-6"
          initial="hidden"
          animate="show"
          variants={{ show: { transition: { staggerChildren: 0.2 } } }}
        >
          <div className="font-heading text-6xl md:text-9xl tracking-widest uppercase overflow-hidden py-2">
            <AnimatedText text="NEO" el="h1" variants={textReveal} />
          </div>
          <div className="font-heading text-6xl md:text-9xl tracking-widest uppercase overflow-hidden py-2">
            <AnimatedText text="DERVISH" el="h1" variants={textReveal} />
          </div>
          <motion.p
            className="mt-6 text-xl md:text-2xl tracking-widest text-neutral-300"
            variants={fadeIn('up', 0.8)}
          >
            IN SOUL WE MOVE
          </motion.p>
          <motion.div variants={fadeIn('up', 1)}>
            <Button asChild size="lg" className="mt-12 bg-white text-black hover:bg-neutral-200 rounded-full font-bold px-10 py-6 group shadow-lg transition-all duration-300 ease-in-out hover:scale-105 active:scale-100">
              <Link to="/shop">
                Explore The Void <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Featured Products */}
      <section className="py-28 md:py-40 bg-black/20 backdrop-blur-lg border-y border-white/10">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-heading tracking-widest mb-3">Latest Drops</h2>
            <p className="text-neutral-400 text-lg">Exclusive pieces from our new collection.</p>
          </motion.div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-16">
            {featuredProducts.map((product, index) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.3 }}
                transition={{ duration: 0.8, delay: index * 0.1, ease: 'easeOut' }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Gallery / Lookbook Section */}
      <LookbookSection />

      {/* Manifesto Section */}
      <ManifestoSection />

      {/* Testimonials */}
      <CustomerReviews />

      {/* Final CTA */}
      <section className="relative py-32 md:py-48 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-xl z-0" />
        <motion.div className="absolute inset-0 bg-cover bg-center opacity-10" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1515886657613-9f3515b0c78f)', y: parallaxY }} />
        <motion.div
          className="relative z-10 max-w-4xl mx-auto space-y-8"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.5 }}
          transition={{ duration: 1, ease: "easeOut" }}
        >
          <h2 className="text-5xl md:text-7xl font-extrabold tracking-tight">
            OWN YOUR <span className="text-white/50">MOVEMENT</span>
          </h2>
          <p className="text-lg md:text-xl text-white/70 max-w-2xl mx-auto">
            Discover apparel that doesn’t just fit, but speaks. Align your style with your spirit.
          </p>
          <Button asChild size="lg" className="bg-white text-black hover:bg-neutral-200 rounded-full font-semibold px-10 py-7 group transition-all duration-300 ease-in-out hover:scale-105 active:scale-100">
            <Link to="/shop">
              Shop The Full Collection
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
            </Link>
          </Button>
        </motion.div>
      </section>
    </motion.div>
  );
};

export default HomePage;