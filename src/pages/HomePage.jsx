import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { ArrowRight } from 'lucide-react';
import { products } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import { Helmet } from 'react-helmet';
import { pageTransition, staggerContainer, fadeIn } from '@/lib/motion';
import { useToast } from '@/components/ui/use-toast';
import CustomerReviews from '@/components/CustomerReviews';
import Vid from '../assets/vid.mp4'

const HomePage = () => {
  const featuredProducts = products.filter(p => p.isFeatured);
  const { toast } = useToast();

  const handleStoryClick = () => {
    toast({
      title: "🚧 Fitur ini belum diimplementasikan",
      description: "Halaman 'Our Story' akan segera hadir. Anda bisa memintanya di prompt berikutnya! 🚀",
    });
  };

  const categories = [
    { name: 'Hoodies', image: 'A person wearing a stylish black hoodie in an urban setting', alt: 'Model wearing a Radiant Rage hoodie' },
    { name: 'T-Shirts', image: 'A close-up of a high-quality minimalist black t-shirt', alt: 'Minimalist Radiant Rage t-shirt' },
    { name: 'Pants', image: 'A person wearing modern black cargo pants with a focus on a detailed pocket', alt: 'Model wearing Radiant Rage pants' },
  ];

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
    >
      <Helmet>
        <title>Radiant Rage - IN GOD WE FEAR</title>
        <meta name="description" content="Premium minimalist apparel for the modern soul. Shop the latest collection from Radiant Rage." />
      </Helmet>

      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center text-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <video
            autoPlay
            muted
            loop
            playsInline
            className="absolute inset-0 w-full h-full object-cover opacity-15 blur-sm z-0"
          >
            <source src={Vid} type="video/mp4" />
            {/* Fallback gradient blob */}
            <div className="absolute top-1/3 left-1/3 w-96 h-96 bg-blue-500 rounded-full blur-3xl opacity-10 animate-blob" />
          </video>
        </div>
        <motion.div
          className="relative z-10"
          variants={staggerContainer(0.2, 0.5)}
          initial="hidden"
          animate="show"
        >
          <motion.h1
            className="font-heading text-6xl md:text-9xl lg:text-[10rem] tracking-widest text-white text-outline"
            variants={fadeIn('down', 'tween', 0.2, 1)}
          >
            RADIANT
          </motion.h1>
          <motion.h1
            className="font-heading text-6xl md:text-9xl lg:text-[10rem] tracking-widest text-white"
            variants={fadeIn('up', 'tween', 0.2, 1)}
          >
            RAGE
          </motion.h1>
          <motion.p
            className="mt-4 font-heading text-2xl md:text-4xl tracking-[0.3em] text-neutral-300"
            variants={fadeIn('up', 'tween', 0.5, 1)}
          >
            IN GOD WE FEAR
          </motion.p>
          <motion.div variants={fadeIn('up', 'tween', 0.8, 1)}>
            <Button asChild size="lg" className="mt-8 bg-white text-black hover:bg-neutral-300 rounded-full font-bold px-10 py-6 group">
              <Link to="/shop">
                Shop Collection <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Featured Products Section */}
      <section className="py-24">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-heading tracking-wider text-white">Latest Drops</h2>
            <p className="text-neutral-400 mt-2">Check out the latest from our collection.</p>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredProducts.map(product => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      </section>

      {/* Category Showcase Section */}
      <section className="py-24 bg-neutral-950">
        <div className="container mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.5 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl font-heading tracking-wider text-white">Shop by Category</h2>
          </motion.div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {categories.map((category, index) => (
              <Link to="/shop" key={index}>
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.5 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="relative h-96 rounded-lg overflow-hidden group"
                >
                  <img class="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" alt={category.alt} src="https://images.unsplash.com/photo-1595872018818-97555653a011" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent"></div>
                  <div className="absolute bottom-0 left-0 p-8">
                    <h3 className="text-3xl font-heading tracking-wider text-white">{category.name}</h3>
                    <p className="text-neutral-300 mt-1 flex items-center group-hover:text-white transition-colors">
                      Explore <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </p>
                  </div>
                </motion.div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Manifesto Section */}
      <section className="py-32">
        <div className="container mx-auto px-6">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 1 }}
              className="h-[600px] rounded-lg overflow-hidden"
            >
              <img class="w-full h-full object-cover" alt="A striking, artistic black and white portrait of a person with a determined look" src="https://images.unsplash.com/photo-1570184637811-f1c88f539275" />
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.5 }}
              transition={{ duration: 1 }}
            >
              <h2 className="font-heading text-5xl tracking-widest text-white mb-6">FEAR IS A VIRTUE</h2>
              <p className="text-neutral-300 leading-relaxed mb-4">
                Our creed, "IN GOD WE FEAR," is not about terror, but about profound respect and reverence. It's the acknowledgment of a power greater than ourselves—a force that inspires humility, discipline, and purpose.
              </p>
              <p className="text-neutral-300 leading-relaxed mb-8">
                It's the fear of living a life without meaning, the fear of not reaching our potential. This is the fear that fuels us. This is Radiant Rage.
              </p>
              <Button onClick={handleStoryClick} variant="outline" size="lg" className="border-white/50 text-white hover:bg-white hover:text-black rounded-full font-bold px-10 py-6">
                Our Story
              </Button>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Customer Reviews Section */}
      <CustomerReviews />

      {/* Final CTA Section */}
      <section className="py-32 text-center bg-neutral-950">
        <div className="container mx-auto px-6">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="font-heading text-6xl md:text-8xl tracking-widest text-white mb-4"
          >
            JOIN THE RAGE.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-neutral-400 text-lg mb-8"
          >
            Explore the full collection and find the pieces that define you.
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            <Button asChild size="lg" className="bg-white text-black hover:bg-neutral-300 rounded-full font-bold px-10 py-6 group">
              <Link to="/shop">
                Explore Collection <ArrowRight className="ml-2 h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Link>
            </Button>
          </motion.div>
        </div>
      </section>
    </motion.div>
  );
};

export default HomePage;