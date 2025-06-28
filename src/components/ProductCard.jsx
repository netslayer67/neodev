import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ShoppingBag } from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';

const ProductCard = ({ product }) => {
  const { toast } = useToast();

  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();
    toast({
      title: 'Added to Cart!',
      description: `${product.name} has been added to your cart.`,
    });
  };

  return (
    <motion.div whileHover={{ y: -5 }} className="group">
      <Link to={`/product/${product.id}`} className="block">
        <div className="relative overflow-hidden rounded-lg">
          <img 
            class="w-full h-96 object-cover transition-transform duration-500 group-hover:scale-105"
            alt={product.name}
           src="https://images.unsplash.com/photo-1698476803391-cef4134df5c2" />
          <div className="absolute inset-0 bg-black/20"></div>
          <div className="absolute bottom-4 right-4">
            <Button
              size="icon"
              className="bg-white/80 text-black hover:bg-white rounded-full backdrop-blur-sm opacity-0 group-hover:opacity-100 transition-opacity"
              onClick={handleAddToCart}
            >
              <ShoppingBag size={20} />
            </Button>
          </div>
        </div>
        <div className="mt-4">
          <h3 className="text-lg font-semibold text-white truncate">{product.name}</h3>
          <p className="text-neutral-400 text-sm">{product.category}</p>
          <p className="text-lg font-bold text-white mt-1">${product.price.toFixed(2)}</p>
        </div>
      </Link>
    </motion.div>
  );
};

export default ProductCard;