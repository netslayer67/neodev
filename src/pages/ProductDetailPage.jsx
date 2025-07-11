import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';

// Import actions dari slice
import { fetchProductBySlug, clearSelectedProduct } from '../store/slices/productSlice';
import { addToCart } from '../store/slices/cartSlice';

// Import komponen UI
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Minus, ShoppingBag, ArrowLeft, X, ChevronDown } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { pageTransition } from '@/lib/motion';
import { PageLoader } from '@/components/PageLoader';

// Komponen Accordion (tetap sama)
const AccordionItem = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-white/10">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center py-5 text-left"
      >
        <span className="text-lg font-medium text-white">{title}</span>
        {isOpen ? <Minus size={20} /> : <Plus size={20} />}
      </button>
      <AnimatePresence initial={false}>
        {isOpen && (
          <motion.div
            key="content"
            initial="collapsed"
            animate="open"
            exit="collapsed"
            variants={{
              open: { opacity: 1, height: 'auto', y: 0 },
              collapsed: { opacity: 0, height: 0, y: -10 },
            }}
            transition={{ duration: 0.4, ease: [0.04, 0.62, 0.23, 0.98] }}
            className="overflow-hidden"
          >
            <div className="pb-6 text-neutral-300 space-y-4 leading-relaxed">{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};


const ProductDetailPage = () => {
  // Menggunakan `slug` dari URL, sesuai dengan pembaruan rute
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { toast } = useToast();

  // State lokal untuk kuantitas dan gambar
  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(null);

  // Mengambil data dari Redux store
  const { selectedProduct: product, status, items: allProducts } = useSelector((state) => state.products);

  // Mengambil data produk saat komponen dimuat
  useEffect(() => {
    if (slug) {
      dispatch(fetchProductBySlug(slug));
    }
    // Cleanup: Membersihkan state saat komponen dilepas
    return () => {
      dispatch(clearSelectedProduct());
    };
  }, [slug, dispatch]);

  // Mengatur gambar utama saat data produk berubah
  useEffect(() => {
    if (product && product.images) {
      setSelectedImage(product.images[0]);
    }
  }, [product]);

  // Fungsi untuk menambahkan item ke keranjang
  const handleAddToCart = () => {
    dispatch(addToCart({ product, quantity: Number(quantity) }));
    toast({
      title: '🛒 Added to Cart!',
      description: `${quantity} x ${product.name} has been added to your cart.`,
      className: 'bg-black border-neutral-700 text-white',
    });
  };

  // Menampilkan state loading
  if (status === 'loading') {
    return <PageLoader />;
  }

  // Menampilkan pesan jika produk tidak ditemukan atau gagal dimuat
  if (status === 'failed' || !product) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-white bg-black">
        <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
        <Link to="/shop" className="underline text-sky-400">Back to Shop</Link>
      </div>
    );
  }

  // Filter produk terkait (menghindari produk yang sedang ditampilkan)
  const relatedProducts = allProducts.filter(p => p.category === product.category && p._id !== product._id).slice(0, 4);

  return (
    <motion.div
      initial="initial" animate="animate" exit="exit" variants={pageTransition}
      className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white pt-32 pb-24"
    >
      <Helmet>
        <title>{`${product.name} - Neo Dervish`}</title>
        <meta name="description" content={product.description} />
      </Helmet>
      <div className="container mx-auto px-4">
        <Link to="/shop" className="inline-flex items-center mb-8 text-sm text-neutral-400 hover:text-white transition-colors">
          <ArrowLeft className="mr-2" size={16} />
          Back to The Collection
        </Link>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          <div className="grid grid-cols-[80px_1fr] gap-4">
            <div className="space-y-3">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`block rounded-lg overflow-hidden border-2 transition-all duration-300 ${selectedImage === img ? 'border-white' : 'border-transparent hover:border-white/40'}`}
                >
                  <img src={img} alt={`thumb-${idx}`} className="w-full h-20 object-cover" loading="lazy" />
                </button>
              ))}
            </div>
            <div className="overflow-hidden rounded-xl border border-white/10">
              <AnimatePresence mode="wait">
                <motion.img
                  key={selectedImage}
                  src={selectedImage}
                  alt={product.name}
                  initial={{ opacity: 0.5 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0.5 }}
                  transition={{ duration: 0.3, ease: 'easeInOut' }}
                  className="w-full h-full object-cover"
                />
              </AnimatePresence>
            </div>
          </div>

          <div className="flex flex-col space-y-8">
            <div>
              <p className="uppercase text-sm text-sky-400 tracking-wider font-semibold">{product.category}</p>
              <h1 className="text-4xl lg:text-5xl font-bold text-white mt-2">{product.name}</h1>
              <p className="text-3xl font-medium text-white/90 mt-4">
                Rp {product.price.toLocaleString('id-ID')}
              </p>
            </div>

            <div className="bg-white/5 border border-white/10 rounded-xl p-6 space-y-6">
              <div className="flex items-center justify-between">
                <span className="font-medium text-white">Quantity:</span>
                <div className="flex items-center border border-white/20 rounded-full">
                  <Button variant="ghost" size="icon" onClick={() => setQuantity(q => Math.max(1, q - 1))}><Minus size={16} /></Button>
                  <span className="px-5 text-white text-base font-semibold">{quantity}</span>
                  <Button variant="ghost" size="icon" onClick={() => setQuantity(q => q + 1)}><Plus size={16} /></Button>
                </div>
              </div>
              <motion.div whileTap={{ scale: 0.98 }}>
                <Button onClick={handleAddToCart} className="w-full bg-white text-black hover:bg-neutral-200 py-3 rounded-full text-base font-bold shadow-lg shadow-white/10 transition-all">
                  <ShoppingBag className="mr-2" size={20} /> Add to Cart
                </Button>
              </motion.div>
            </div>

            <div className="space-y-2">
              <AccordionItem title="Description" defaultOpen={true}>
                <p>{product.description}</p>
              </AccordionItem>
              <AccordionItem title="Details & Fit">
                <ul className="list-disc list-inside space-y-2">
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
          <div className="mt-24 lg:mt-32">
            <h2 className="text-2xl font-medium text-center mb-10 tracking-wide">You Might Also Like</h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
              {relatedProducts.map((p) => <ProductCard key={p._id} product={p} />)}
            </div>
          </div>
        )}
      </div>
      {/* Modal pengiriman dihilangkan untuk fokus pada integrasi utama */}
    </motion.div>
  );
};

export default ProductDetailPage;