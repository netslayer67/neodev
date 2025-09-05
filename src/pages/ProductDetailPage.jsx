import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Helmet } from "react-helmet";
import { motion, AnimatePresence } from "framer-motion";
import {
  fetchProductBySlug,
  clearSelectedProduct,
} from "../store/slices/productSlice";
import { addToCart } from "../store/slices/cartSlice";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import {
  Plus,
  Minus,
  ShoppingBag,
  ArrowLeft,
  Info,
  Truck,
} from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { pageTransition } from "@/lib/motion";
import PageLoader from "@/components/PageLoader";

// Accordion reusable
const AccordionItem = ({ title, icon: Icon, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-white/10">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center py-4"
      >
        <span className="flex items-center gap-2 text-base font-semibold text-white">
          {Icon && <Icon size={16} className="text-[#8A5CF6]" />} {title}
        </span>
        {isOpen ? <Minus size={18} /> : <Plus size={18} />}
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
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

  const {
    selectedProduct: product,
    status,
    items: allProducts,
  } = useSelector((state) => state.products);

  useEffect(() => {
    if (slug) dispatch(fetchProductBySlug(slug));
    return () => dispatch(clearSelectedProduct());
  }, [slug, dispatch]);

  useEffect(() => {
    if (product?.images) setSelectedImage(product.images[0]);
  }, [product]);

  useEffect(() => {
    if (!selectedSize || !product?.sizes) return;
    const selectedStock =
      product.sizes.find((s) => s.size === selectedSize)?.quantity || 0;
    if (quantity > selectedStock) {
      setQuantity(selectedStock > 0 ? selectedStock : 1);
    }
  }, [selectedSize, product?.sizes]);

  const handleAddToCart = () => {
    if (!selectedSize) {
      toast({
        title: "Pick a size first",
        description: "Choose before adding to cart.",
        variant: "destructive",
      });
      return;
    }

    const selectedStock =
      product?.sizes?.find((s) => s.size === selectedSize)?.quantity || 0;
    if (quantity > selectedStock) {
      toast({
        title: "Stock not enough",
        description: `Only ${selectedStock} items left for size ${selectedSize}.`,
        variant: "destructive",
      });
      return;
    }

    dispatch(addToCart({ product: { ...product, size: selectedSize }, quantity }));

    toast({
      title: "🛒 Added to Cart",
      description: `${quantity} x ${product.name} (Size ${selectedSize}) added.`,
      className: "bg-[#0F0F1A] border border-white/10 text-white",
    });
  };

  // ✅ Fix Loader Logic
  if (status === "loading") {
    return <PageLoader />;
  }

  if (status === "failed") {
    return (
      <div className="min-h-screen bg-[#0F0F1A] flex items-center justify-center text-white">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Product Not Found</h1>
          <Link to="/shop" className="text-[#8A5CF6] underline">
            Back to Shop
          </Link>
        </div>
      </div>
    );
  }

  if (!product) {
    return <PageLoader />;
  }

  const relatedProducts = allProducts
    .filter((p) => p.category === product.category && p._id !== product._id)
    .slice(0, 4);

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className="text-white min-h-screen pt-24 pb-32 font-sans bg-[#0F0F1A] relative"
    >
      <Helmet>
        <title>{product.name} - Collection</title>
      </Helmet>

      {/* 🔮 Blob Backgrounds */}
      <div className="absolute -top-20 -left-20 w-60 h-60 bg-[#8A5CF6]/20 rounded-full blur-3xl animate-pulse" />
      <div className="absolute -bottom-20 -right-20 w-72 h-72 bg-[#1E2A47]/30 rounded-full blur-3xl animate-pulse" />

      <div className="container mx-auto px-4 relative z-10">
        {/* Back link */}
        <Link
          to="/shop"
          className="flex items-center mb-6 text-sm text-white/50 hover:text-white transition"
        >
          <ArrowLeft className="mr-2" size={16} /> Back to Collection
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* 📸 Gallery */}
          <div className="space-y-4">
            <div className="rounded-2xl overflow-hidden border border-white/10 bg-[#1E2A47]/30 backdrop-blur-xl shadow-xl">
              <motion.img
                key={selectedImage?.url}
                src={selectedImage?.url}
                alt={product.name}
                initial={{ opacity: 0.3, scale: 1.05 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="object-cover w-full h-auto"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto scrollbar-hide">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(img)}
                  className={`w-20 h-20 rounded-xl border transition ${selectedImage?.url === img.url
                      ? "border-[#8A5CF6]"
                      : "border-white/20 hover:border-white/40"
                    }`}
                >
                  <img
                    src={img.url}
                    alt={`thumb-${idx}`}
                    className="rounded-xl object-cover w-full h-full"
                  />
                </button>
              ))}
            </div>
          </div>

          {/* 📝 Info Panel */}
          <div className="flex flex-col gap-6">
            <div>
              <p className="uppercase text-xs tracking-widest text-[#8A5CF6] mb-1 font-semibold">
                {product.category}
              </p>
              <h1 className="text-3xl lg:text-5xl font-serif font-bold leading-tight">
                {product.name}
              </h1>
              <p className="text-xl font-semibold text-white mt-2">
                Rp {product.price.toLocaleString("id-ID")}
              </p>
            </div>

            {/* Size & Quantity */}
            <div className="bg-[#1E2A47]/30 backdrop-blur-xl border border-white/10 rounded-2xl p-6 flex flex-col gap-5 shadow-lg">
              <div>
                <span className="text-white font-medium">Size</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {product?.sizes?.map(({ size, quantity }) => (
                    <button
                      key={size}
                      disabled={quantity === 0}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 text-sm font-medium rounded-full border transition-all 
                        ${selectedSize === size
                          ? "bg-[#8A5CF6] text-white border-[#8A5CF6]"
                          : quantity === 0
                            ? "bg-white/5 text-white/40 border-white/10 cursor-not-allowed"
                            : "bg-white/10 text-white border-white/20 hover:bg-white/20"
                        }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="text-white font-medium">Quantity</span>
                <div className="flex items-center gap-3 border border-white/20 rounded-full px-3 py-1 bg-[#0F0F1A]/50">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                  >
                    <Minus size={16} />
                  </Button>
                  <span className="text-white font-semibold w-6 text-center">
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const selectedStock =
                        product?.sizes?.find((s) => s.size === selectedSize)
                          ?.quantity || 1;
                      setQuantity((q) => Math.min(q + 1, selectedStock));
                    }}
                  >
                    <Plus size={16} />
                  </Button>
                </div>
              </div>

              <motion.div
                whileTap={{ scale: 0.95 }}
                transition={{ type: "spring", stiffness: 400, damping: 15 }}
              >
                <Button
                  onClick={handleAddToCart}
                  disabled={
                    !selectedSize ||
                    (product?.sizes?.find((s) => s.size === selectedSize)
                      ?.quantity || 0) === 0
                  }
                  className={`w-full py-3 font-bold rounded-full transition-all flex items-center justify-center gap-2
                    ${!selectedSize ||
                      (product?.sizes?.find((s) => s.size === selectedSize)
                        ?.quantity || 0) === 0
                      ? "bg-white/10 text-white/50 cursor-not-allowed"
                      : "bg-[#8A5CF6] text-white hover:bg-[#8A5CF6]/90"
                    }`}
                >
                  <ShoppingBag size={20} />
                  {!selectedSize
                    ? "Select Size"
                    : (product?.sizes?.find((s) => s.size === selectedSize)
                      ?.quantity || 0) === 0
                      ? "Out of Stock"
                      : "Add to Cart"}
                </Button>
              </motion.div>
            </div>

            {/* Accordion Info */}
            <div className="divide-y divide-white/10">
              <AccordionItem title="Description" icon={Info} defaultOpen>
                <p className="text-white/80">{product.description}</p>
              </AccordionItem>
              <AccordionItem title="Details & Fit" icon={Info}>
                <ul className="list-disc list-inside text-white/80 space-y-1 mb-4">
                  <li>
                    Material: {product.details?.material || "Premium Cotton"}
                  </li>
                  <li>Fit: {product.details?.fit || "Regular"}</li>
                  <li>Origin: {product.details?.origin || "In-house"}</li>
                </ul>
              </AccordionItem>
              <AccordionItem title="Shipping & Returns" icon={Truck}>
                <p className="text-white/80">
                  Fast delivery. Easy returns within 7 days.
                </p>
              </AccordionItem>
            </div>
          </div>
        </div>

        {/* Related */}
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
