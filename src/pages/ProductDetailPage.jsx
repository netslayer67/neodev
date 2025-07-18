import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { Helmet } from 'react-helmet';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchProductBySlug, clearSelectedProduct } from '../store/slices/productSlice';
import { addToCart } from '../store/slices/cartSlice';
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Minus, ShoppingBag, ArrowLeft } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { pageTransition } from '@/lib/motion';
import { PageLoader } from '@/components/PageLoader';

const AccordionItem = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-white/10">
      <button onClick={() => setIsOpen(!isOpen)} className="w-full flex justify-between items-center py-4">
        <span className="text-lg font-semibold text-white">{title}</span>
        {isOpen ? <Minus size={18} /> : <Plus size={18} />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.4 }}
            className="overflow-hidden text-sm text-white/80 pb-4"
          >
            {children}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

const ProductDetailPage = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { toast } = useToast();
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);

  const { selectedProduct: product, status, items: allProducts } = useSelector(state => state.products);

  useEffect(() => {
    if (slug) dispatch(fetchProductBySlug(slug));
    return () => dispatch(clearSelectedProduct());
  }, [slug, dispatch]);

  useEffect(() => {
    if (product?.images) setSelectedImage(product.images[0]);
  }, [product]);

  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity }));
    toast({
      title: '🛒 Added to Cart',
      description: `${quantity} x ${product.name} added.`,
      className: 'bg-black border border-white/10 text-white'
    });
  };

  if (status === 'loading') return <PageLoader />;
  if (status === 'failed' || !product) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-white">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold">Product Not Found</h1>
          <Link to="/shop" className="text-sky-400 underline">Back to Shop</Link>
        </div>
      </div>
    );
  }

  const relatedProducts = allProducts.filter(p => p.category === product.category && p._id !== product._id).slice(0, 4);

  return (
    <motion.div
      initial="initial" animate="animate" exit="exit" variants={pageTransition}
      className="bg-gradient-to-br from-black via-gray-800 to-black text-white min-h-screen pt-24 pb-32"
    >
      <Helmet>
        <title>{product.name} - Neo Dervish</title>
      </Helmet>

      <div className="container mx-auto px-4">
        <Link to="/shop" className="flex items-center mb-6 text-sm text-white/50 hover:text-white transition">
          <ArrowLeft className="mr-2" size={16} /> Back to Collection
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          <div className="space-y-6">
            <div className="flex gap-3 overflow-x-auto scrollbar-hide">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`rounded-xl border-2 transition ${selectedImage === img ? 'border-white' : 'border-white/20 hover:border-white/40'}`}
                >
                  <img src={img} alt={`thumb-${idx}`} className="w-20 h-20 object-cover rounded-lg" loading="lazy" />
                </button>
              ))}
            </div>
            <div className="relative rounded-xl overflow-hidden border border-white/10">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  src={selectedImage}
                  alt={product.name}
                  initial={{ opacity: 0.4 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0.4 }}
                  transition={{ duration: 0.4 }}
                  className="w-full object-cover rounded-xl"
                />
              </AnimatePresence>
            </div>
          </div>

          <div className="flex flex-col gap-6">
            <div>
              <p className="uppercase text-xs text-sky-400 tracking-wide font-medium">{product.category}</p>
              <h1 className="text-4xl lg:text-5xl font-bold mt-2 mb-3">{product.name}</h1>
              <p className="text-2xl font-semibold">Rp {product.price.toLocaleString('id-ID')}</p>
            </div>

            <div className="bg-white/5 backdrop-blur-lg border border-white/10 rounded-xl p-6 flex flex-col gap-5">
              <div className="flex justify-between items-center">
                <span className="text-white font-medium">Quantity</span>
                <div className="flex items-center gap-3 border border-white/20 rounded-full px-3 py-1">
                  <Button variant="ghost" size="icon" onClick={() => setQuantity(q => Math.max(1, q - 1))}><Minus size={16} /></Button>
                  <span className="text-white font-semibold w-6 text-center">{quantity}</span>
                  <Button variant="ghost" size="icon" onClick={() => setQuantity(q => q + 1)}><Plus size={16} /></Button>
                </div>
              </div>
              <motion.div whileTap={{ scale: 0.97 }}>
                <Button onClick={handleAddToCart} className="w-full bg-white text-black py-3 font-bold rounded-full shadow-xl hover:bg-neutral-200">
                  <ShoppingBag size={20} className="mr-2" /> Add to Cart
                </Button>
              </motion.div>
            </div>

            <div className="divide-y divide-white/10">
              <AccordionItem title="Description" defaultOpen>
                <p>{product.description}</p>
              </AccordionItem>
              <AccordionItem title="Details & Fit">
                <ul className="list-disc list-inside">
                  <li>Material: {product.details?.material || 'Premium Cotton Blend'}</li>
                  <li>Fit: {product.details?.fit || 'Regular Fit'}</li>
                  <li>Origin: {product.details?.origin || 'Designed in-house'}</li>
                </ul>
              </AccordionItem>
              <AccordionItem title="Shipping & Returns">
                <p>Informasi pengiriman dan pengembalian akan ditampilkan di sini.</p>
              </AccordionItem>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-24">
            <h2 className="text-2xl font-semibold text-center mb-10">You Might Also Like</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map(p => (
                <ProductCard key={p._id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default ProductDetailPage;