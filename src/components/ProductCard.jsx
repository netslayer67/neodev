import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowUpRight, ShoppingBag } from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from './ui/use-toast';
import { useDispatch } from 'react-redux'; // 1. Import useDispatch
import { addToCart } from '../store/slices/cartSlice'; // 2. Import action addToCart

const ProductCard = ({ product }) => {
  const { toast } = useToast();
  const dispatch = useDispatch(); // 3. Inisialisasi dispatch

  // Fungsi untuk menambahkan produk ke keranjang
  const handleAddToCart = (e) => {
    e.preventDefault();
    e.stopPropagation();

    // 4. Dispatch action dengan mengirim data produk
    dispatch(addToCart({ product }));

    toast({
      title: 'Added to Cart',
      description: `${product.name} has been successfully added.`,
      className: 'bg-black border-neutral-700 text-white',
    });
  };

  return (
    <motion.div className="group relative rounded-xl overflow-hidden border border-neutral-800/80 bg-neutral-900 shadow-lg transition-all duration-300 hover:border-neutral-700 hover:shadow-white/5">
      {/* 5. Perbarui link untuk menggunakan slug */}
      <Link to={`/product/${product.slug}`} className="block">
        <div className="relative h-96 overflow-hidden">
          <motion.img
            src={product.images?.[0] || 'https://images.unsplash.com/photo-1698476803391-cef4134df5c2'}
            alt={product.name}
            className="w-full h-full object-cover transition-transform duration-500 ease-in-out group-hover:scale-105"
            loading="lazy"
            decoding="async"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
          <div className="absolute bottom-0 left-0 right-0 p-5 text-white">
            <div className="flex justify-between items-end">
              <div>
                <h3 className="text-lg font-medium drop-shadow-md truncate">{product.name}</h3>
                <p className="text-sm text-neutral-400 drop-shadow-sm">{product.category}</p>
              </div>
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                <ArrowUpRight size={20} className="text-neutral-300" />
              </div>
            </div>
          </div>
        </div>
      </Link>
      <div className="p-5 bg-neutral-900/30">
        <div className="flex justify-between items-center">
          <p className="text-xl font-semibold text-white">
            Rp {product.price.toLocaleString('id-ID')}
          </p>
          <Button
            size="icon"
            variant="outline"
            className="bg-transparent border-neutral-700 text-neutral-300 rounded-full h-10 w-10 hover:bg-white hover:text-black hover:border-white transition-all duration-300 opacity-70 group-hover:opacity-100"
            onClick={handleAddToCart}
            aria-label={`Add ${product.name} to cart`}
          >
            <ShoppingBag size={20} />
          </Button>
        </div>
      </div>
    </motion.div>
  );
};

export default ProductCard;