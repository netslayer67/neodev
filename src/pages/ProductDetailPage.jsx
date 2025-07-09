import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Helmet } from 'react-helmet';
import { products } from '@/data/products'; // Pastikan path & data produk sesuai
import { Button } from '@/components/ui/button';
import { useToast } from '@/components/ui/use-toast';
import { Plus, Minus, ShoppingBag, ArrowLeft, X, ChevronDown, ChevronUp } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import { pageTransition } from '@/lib/motion';

// Komponen Accordion yang bisa dibuka-tutup
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
  const { id } = useParams();
  const { toast } = useToast();
  const product = products.find((p) => p.id === id);

  const [quantity, setQuantity] = useState(1);
  const [selectedImage, setSelectedImage] = useState(product?.images?.[0]);

  // Data dan state untuk modal Pengiriman
  const [showAreaModal, setShowAreaModal] = useState(false);
  const [selectedProvince, setSelectedProvince] = useState(null);
  const [selectedCity, setSelectedCity] = useState(null);
  const provinces = { 'Jawa Barat': ['Kab. Bandung', 'Kab. Bekasi', 'Kab. Bogor'], 'DKI Jakarta': ['Jakarta Selatan', 'Jakarta Barat', 'Jakarta Timur'] };

  const relatedProducts = products.filter((p) => p.category === product.category && p.id !== id).slice(0, 4);

  const handleAddToCart = () => {
    toast({
      title: '🛒 Added to Cart!',
      description: `${quantity} x ${product.name} has been added to your cart.`,
      className: 'bg-black border-neutral-700 text-white',
    });
  };

  if (!product) {
    return (
      <div className="min-h-screen flex flex-col justify-center items-center text-white bg-black">
        <h1 className="text-4xl font-bold mb-4">Product Not Found</h1>
        <Link to="/shop" className="underline text-sky-400">Back to Shop</Link>
      </div>
    );
  }

  return (
    <motion.div
      initial="initial" animate="animate" exit="exit" variants={pageTransition}
      className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-black text-white pt-32 pb-24"
    >
      <div className="container mx-auto px-4">
        <Link to="/shop" className="inline-flex items-center mb-8 text-sm text-neutral-400 hover:text-white transition-colors">
          <ArrowLeft className="mr-2" size={16} />
          Back to The Collection
        </Link>

        {/* === MAIN PRODUCT SECTION === */}
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16">
          {/* === LEFT: Galeri Gambar === */}
          <div className="grid grid-cols-[80px_1fr] gap-4">
            {/* Thumbnails */}
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
            {/* Gambar Utama */}
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

          {/* === RIGHT: Info & Aksi Produk === */}
          <div className="flex flex-col space-y-8">
            {/* Info Dasar */}
            <div>
              <p className="uppercase text-sm text-sky-400 tracking-wider font-semibold">{product.category}</p>
              <h1 className="text-4xl lg:text-5xl font-bold text-white mt-2">{product.name}</h1>
              <p className="text-3xl font-medium text-white/90 mt-4">${product.price.toFixed(2)}</p>
            </div>

            {/* Blok Aksi */}
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

            {/* Accordion untuk Detail */}
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
                {/* Konten Pengiriman */}
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span>Ship to:</span>
                    <button onClick={() => setShowAreaModal(true)} className="text-white font-medium inline-flex items-center gap-1 hover:underline">
                      {selectedCity ? `${selectedCity}, ${selectedProvince}` : 'Select Area'} <ChevronDown size={16} />
                    </button>
                  </div>
                  <div className="flex justify-between"><span>Shipping Cost:</span><span className="text-white font-medium">Free</span></div>
                  <p>Free returns within 14 days of delivery. Terms and conditions apply.</p>
                </div>
              </AccordionItem>
            </div>
          </div>
        </div>

        {/* === Produk Terkait === */}
        <div className="mt-24 lg:mt-32">
          <h2 className="text-2xl font-medium text-center mb-10 tracking-wide">You Might Also Like</h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10">
            {relatedProducts.map((p) => <ProductCard key={p.id} product={p} />)}
          </div>
        </div>
      </div>
      <AnimatePresence>
        {showAreaModal && (
          <motion.div
            initial={{ opacity: 0, scale: 0.98 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex justify-center items-center px-4"
          >
            <motion.div
              className="bg-blue-900/10 border border-white/20 backdrop-blur-2xl text-white rounded-2xl w-full max-w-md p-6 space-y-6 relative shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setShowAreaModal(false)}
                className="absolute right-4 top-4 text-neutral-400 hover:text-red-400"
              >
                <X size={20} />
              </button>
              {!selectedProvince ? (
                <>
                  <h3 className="text-xl font-semibold mb-2">1. Pilih Provinsi</h3>
                  <div className="space-y-2 max-h-80 overflow-y-auto custom-scroll">
                    {Object.keys(provinces).map((prov) => (
                      <button
                        key={prov}
                        onClick={() => setSelectedProvince(prov)}
                        className="w-full px-4 py-2 text-left bg-white/10 hover:bg-white/20 rounded-md transition"
                      >
                        {prov}
                      </button>
                    ))}
                  </div>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-semibold mb-2">2. Pilih Kota / Kabupaten</h3>
                  <div className="space-y-2 max-h-80 overflow-y-auto">
                    {provinces[selectedProvince].map((city) => (
                      <button
                        key={city}
                        onClick={() => {
                          setSelectedCity(city);
                          setShowAreaModal(false);
                        }}
                        className="w-full px-4 py-2 text-left bg-white/10 hover:bg-white/20 rounded-md transition"
                      >
                        {city}
                      </button>
                    ))}
                  </div>
                  <button
                    onClick={() => setSelectedProvince(null)}
                    className="text-sm mt-4 underline text-neutral-400 hover:text-white"
                  >
                    ← Kembali ke Provinsi
                  </button>
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProductDetailPage;