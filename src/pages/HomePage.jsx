// HomePage.jsx (Refactored with Luxury UI/UX)
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { fetchProducts } from '../store/slices/productSlice';
import ProductCard from '@/components/ProductCard';
import { PageLoader } from '@/components/PageLoader';
import { Helmet } from 'react-helmet';
import { useToast } from '@/components/ui/use-toast';
import CustomerReviews from '@/components/CustomerReviews';
import LookbookSection from '@/components/LookbookSection';
import ManifestoSection from '@/components/ManifestoSection';
import Vid from '../assets/vid.mp4';
import { useSelector, useDispatch } from 'react-redux';

const HomePage = () => {
  const dispatch = useDispatch();
  const { items: products, status: productStatus } = useSelector(state => state.products);
  const featuredProducts = products.slice(0, 3);
  const { toast } = useToast();

  useEffect(() => {
    if (products.length === 0) {
      dispatch(fetchProducts());
    }

    const cards = document.querySelectorAll('.tilt-card');
    const handleTilt = (e, card) => {
      const rect = card.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      card.style.transform = `rotateX(${y * -10}deg) rotateY(${x * 10}deg)`;
    };
    cards.forEach(card => {
      card.addEventListener('mousemove', e => handleTilt(e, card));
      card.addEventListener('mouseleave', () => (card.style.transform = ''));
    });
    return () => {
      cards.forEach(card => {
        card.removeEventListener('mousemove', handleTilt);
      });
    };
  }, [products]);

  const { scrollYProgress } = useScroll();
  const parallaxY = useTransform(scrollYProgress, [0, 1], ['-20%', '20%']);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-gradient-to-b from-black via-gray-900 to-black text-white font-sans antialiased"
    >
      <Helmet>
        <title>Neo Dervish — Where Soul Meets Style</title>
        <meta name="description" content="Luxury streetwear with spiritual energy and movement." />
        <link href="https://fonts.googleapis.com/css2?family=Playfair+Display:wght@500;800&display=swap" rel="stylesheet" />
      </Helmet>

      {/* Hero Section */}
      <section className="relative h-[100dvh] flex flex-col justify-center items-center text-center overflow-hidden">
        <video autoPlay muted loop playsInline className="absolute inset-0 w-full h-full object-cover z-0 opacity-20" src={Vid} />
        <div className="absolute inset-0 bg-black/50 backdrop-blur-sm z-0" />
        <motion.div className="relative z-10 px-6 max-w-4xl mx-auto space-y-4">
          <h1 className="text-6xl md:text-8xl tracking-wide font-heading uppercase">NEO DERVISH</h1>
          <p className="text-xl md:text-2xl text-neutral-300 tracking-wide">IN SOUL WE MOVE</p>
          <Button asChild size="lg" className="mt-6 bg-white text-black hover:bg-gold transition-all duration-300 rounded-full px-8 py-5 font-semibold shadow-md group">
            <Link to="/shop">
              Explore The Void <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:rotate-6" />
            </Link>
          </Button>
        </motion.div>
      </section>

      {/* Featured Products */}
      <section className="py-24 md:py-36 px-6 bg-black/30 backdrop-blur-lg border-y border-white/10">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-heading tracking-wider mb-3">Latest Drops</h2>
          <p className="text-neutral-400 text-lg">Curated pieces with spirit and structure.</p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
          {productStatus === 'loading' && <PageLoader />}
          {productStatus === 'succeeded' && featuredProducts.map((product, i) => (
            <div key={product._id} className="tilt-card glass-card transition-transform duration-300 will-change-transform">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      {/* Lookbook */}
      <LookbookSection />

      {/* Manifesto */}
      <ManifestoSection />

      {/* Testimonials */}
      <CustomerReviews />

      {/* Final CTA */}
      <section className="relative py-32 md:py-48 px-6 text-center overflow-hidden">
        <div className="absolute inset-0 bg-black/50 backdrop-blur-xl z-0" />
        <motion.div className="absolute inset-0 bg-cover bg-center opacity-10 parallax-bg" data-speed="0.3" style={{ backgroundImage: 'url(https://images.unsplash.com/photo-1515886657613-9f3515b0c78f)' }} />
        <div className="relative z-10 max-w-3xl mx-auto space-y-6">
          <h2 className="text-5xl md:text-7xl font-heading tracking-tight">OWN YOUR <span className="text-gold">MOVEMENT</span></h2>
          <p className="text-lg text-white/70">Crafted garments that resonate with your energy and elevate your expression.</p>
          <Button asChild size="lg" className="bg-white text-black hover:bg-emerald-300 transition duration-300 rounded-full font-semibold px-10 py-6 group">
            <Link to="/shop">
              Shop The Full Collection
              <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:rotate-6" />
            </Link>
          </Button>
        </div>
      </section>

      <style>{`
        @media (hover: none) {
          .tilt-card {
            transform: none !important;
          }
        }
      `}</style>
    </motion.div>
  );
};

export default HomePage;
