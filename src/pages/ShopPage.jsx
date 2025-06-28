import React from 'react';
import { motion } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { products } from '@/data/products';
import ProductCard from '@/components/ProductCard';
import { pageTransition } from '@/lib/motion';

const ShopPage = () => {
  const categories = ['All', 'Hoodies', 'T-Shirts', 'Pants', 'Jackets', 'Accessories'];
  const [activeCategory, setActiveCategory] = React.useState('All');
  
  const filteredProducts = activeCategory === 'All' 
    ? products 
    : products.filter(p => p.category === activeCategory);

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className="container mx-auto px-6 pt-32 pb-16"
    >
      <Helmet>
        <title>Shop - Radiant Rage</title>
        <meta name="description" content="Explore the full collection of Radiant Rage apparel. Minimalist designs for a modern world." />
      </Helmet>
      
      <div className="text-center mb-12">
        <h1 className="text-5xl md:text-7xl font-heading tracking-wider text-white">THE COLLECTION</h1>
        <p className="text-neutral-400 mt-2">Find your statement piece.</p>
      </div>
      
      <div className="flex justify-center flex-wrap gap-4 mb-12">
        {categories.map(category => (
          <button
            key={category}
            onClick={() => setActiveCategory(category)}
            className={`px-6 py-2 rounded-full font-semibold transition-colors ${
              activeCategory === category ? 'bg-white text-black' : 'bg-neutral-800 text-white hover:bg-neutral-700'
            }`}
          >
            {category}
          </button>
        ))}
      </div>

      <motion.div
        layout
        className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8"
      >
        {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
        ))}
      </motion.div>
    </motion.div>
  );
};

export default ShopPage;