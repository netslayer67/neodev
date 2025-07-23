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
import PageLoader from '@/components/PageLoader';


const AccordionItem = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-white/10">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center py-4"
      >
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
  const [selectedSize, setSelectedSize] = useState(null);

  const { selectedProduct: product, status, items: allProducts } = useSelector(state => state.products);

  useEffect(() => {
    if (slug) dispatch(fetchProductBySlug(slug));
    return () => dispatch(clearSelectedProduct());
  }, [slug, dispatch]);

  useEffect(() => {
    if (product?.images) setSelectedImage(product.images[0]);
  }, [product]);

  useEffect(() => {
    if (!selectedSize || !product?.sizes) return;
    const selectedStock = product.sizes.find(s => s.size === selectedSize)?.quantity || 0;
    if (quantity > selectedStock) {
      setQuantity(selectedStock > 0 ? selectedStock : 1);
    }
  }, [selectedSize, product?.sizes]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast({
        title: 'Please select a size.',
        description: 'Choose a size before adding to cart.',
        variant: 'destructive',
      });
      return;
    }

    const selectedStock = product?.sizes?.find(s => s.size === selectedSize)?.quantity || 0;
    if (quantity > selectedStock) {
      toast({
        title: 'Insufficient stock',
        description: `Only ${selectedStock} items available for size ${selectedSize}.`,
        variant: 'destructive',
      });
      return;
    }

    dispatch(addToCart({ product, quantity, size: selectedSize }));
    toast({
      title: '🛒 Added to Cart',
      description: `${quantity} x ${product.name} (Size ${selectedSize}) added.`,
      className: 'bg-black border border-white/10 text-white',
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
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className="bg-gradient-to-br from-zinc-950 via-neutral-900 to-zinc-950 text-white min-h-screen pt-24 pb-32 font-sans"
    >
      <Helmet>
        <title>{product.name} - Neo Dervish</title>
      </Helmet>

      <div className="container mx-auto px-4">
        <Link to="/shop" className="flex items-center mb-6 text-sm text-white/50 hover:text-white transition">
          <ArrowLeft className="mr-2" size={16} /> Back to Collection
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* GALLERY */}
          <div className="space-y-6">
            <div className="flex gap-3 overflow-x-auto scrollbar-hide">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`rounded-xl border-2 transition ${selectedImage === img
                    ? 'border-white'
                    : 'border-white/20 hover:border-white/40'
                    }`}
                >
                  <img src={img.url} alt={img.alt || `thumb-${idx}`} className="w-20 h-20 object-cover rounded-lg" loading="lazy" />
                </button>
              ))}
            </div>
            <div className="relative rounded-3xl overflow-hidden border border-white/10 backdrop-blur-2xl bg-white/5 shadow-[0_4px_40px_rgba(255,255,255,0.05)]">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage?.url}
                  src={selectedImage?.url}
                  alt={selectedImage?.alt || product.name}
                  initial={{ opacity: 0.4, scale: 1.02 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0.4, scale: 1.01 }}
                  transition={{ duration: 0.5 }}
                  className="w-full object-cover rounded-3xl"
                />
              </AnimatePresence>
            </div>
          </div>

          {/* INFO PANEL */}
          <div className="flex flex-col gap-6">
            <div>
              <p className="uppercase text-xs tracking-widest text-gold-400 mb-1 font-semibold">
                {product.category}
              </p>
              <h1 className="text-4xl lg:text-5xl font-serif font-bold tracking-tight leading-tight">
                {product.name}
              </h1>
              <p className="text-2xl font-semibold text-white mt-2">
                Rp {product.price.toLocaleString('id-ID')}
              </p>
            </div>

            <div className="bg-white/5 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 flex flex-col gap-5 shadow-inner">
              <div className="flex flex-col gap-4">
                <span className="text-white font-medium">Select Size</span>
                <div className="flex flex-wrap gap-2">
                  {product?.sizes?.map(({ size, quantity }) => (
                    <button
                      key={size}
                      disabled={quantity === 0}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 text-sm font-medium rounded-full border transition-all backdrop-blur-md shadow-sm
                        ${selectedSize === size
                          ? 'bg-gold-500 text-black border-gold-500 shadow-md'
                          : quantity === 0
                            ? 'bg-white/5 text-white/40 border-white/10 cursor-not-allowed'
                            : 'bg-white/10 text-white border-white/20 hover:bg-white/20'}
                      `}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-white font-medium">Quantity</span>
                <div className="flex items-center gap-3 border border-white/20 rounded-full px-3 py-1 bg-black/20">
                  <Button variant="ghost" size="icon" onClick={() => setQuantity(q => Math.max(1, q - 1))}>
                    <Minus size={16} />
                  </Button>
                  <span className="text-white font-semibold w-6 text-center">{quantity}</span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const selectedStock = product?.sizes?.find(s => s.size === selectedSize)?.quantity || 1;
                      setQuantity(q => Math.min(q + 1, selectedStock));
                    }}
                  >
                    <Plus size={16} />
                  </Button>
                </div>
              </div>

              <motion.div
                whileTap={{ scale: 0.95 }}
                transition={{ type: 'spring', stiffness: 400, damping: 15 }}
              >
                <Button
                  onClick={handleAddToCart}
                  disabled={
                    !selectedSize ||
                    (product?.sizes?.find(s => s.size === selectedSize)?.quantity || 0) === 0
                  }
                  className={`w-full py-3 font-bold rounded-full shadow-xl transition-all
      ${!selectedSize ||
                      (product?.sizes?.find(s => s.size === selectedSize)?.quantity || 0) === 0
                      ? 'bg-white/10 text-white/50 cursor-not-allowed'
                      : 'bg-white text-black hover:bg-neutral-200'
                    }`}
                >
                  <ShoppingBag size={20} className="mr-2" />
                  {!selectedSize
                    ? 'Select Size First'
                    : (product?.sizes?.find(s => s.size === selectedSize)?.quantity || 0) === 0
                      ? 'Out of Stock'
                      : 'Add to Cart'
                  }
                </Button>
              </motion.div>

            </div>

            <div className="divide-y divide-white/10">
              <AccordionItem title="Description" defaultOpen>
                <p className="text-white/80">{product.description}</p>
              </AccordionItem>
              <AccordionItem title="Details & Fit">
                <ul className="list-disc list-inside text-white/80 space-y-1 mb-4">
                  <li>Material: {product.details?.material || 'Premium Cotton Blend'}</li>
                  <li>Fit: {product.details?.fit || 'Regular Fit'}</li>
                  <li>Origin: {product.details?.origin || 'Designed in-house'}</li>
                </ul>

                {/* Size Chart */}
                <div className="overflow-x-auto rounded-xl border border-white/10 backdrop-blur-sm bg-white/5 shadow-inner">
                  <table className="min-w-full text-sm text-white/80">
                    <thead className="uppercase tracking-wider bg-white/10 text-white text-left">
                      <tr>
                        <th className="px-4 py-2">Size</th>
                        <th className="px-4 py-2">Chest (cm)</th>
                        <th className="px-4 py-2">Length (cm)</th>
                        <th className="px-4 py-2">Sleeve (cm)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { size: 'S', chest: 48, length: 68, sleeve: 22 },
                        { size: 'M', chest: 51, length: 70, sleeve: 23 },
                        { size: 'L', chest: 54, length: 72, sleeve: 24 },
                        { size: 'XL', chest: 57, length: 74, sleeve: 25 },
                      ].map((row) => (
                        <tr key={row.size} className="odd:bg-white/5 even:bg-white/10">
                          <td className="px-4 py-2 font-semibold">{row.size}</td>
                          <td className="px-4 py-2">{row.chest}</td>
                          <td className="px-4 py-2">{row.length}</td>
                          <td className="px-4 py-2">{row.sleeve}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <p className="text-xs text-white/50 mt-2">Measurements may vary slightly by 1-2cm due to handmade process.</p>
              </AccordionItem>
              <AccordionItem title="Shipping & Returns">
                <p className="text-white/80">Informasi pengiriman dan pengembalian akan ditampilkan di sini.</p>
              </AccordionItem>
            </div>
          </div>
        </div>

        {relatedProducts.length > 0 && (
          <div className="mt-24">
            <h2 className="text-2xl font-serif font-semibold text-center mb-10">
              You Might Also Like
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {relatedProducts.map((p) => (
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
