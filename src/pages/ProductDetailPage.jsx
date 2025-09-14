import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Helmet } from "react-helmet";
import { motion, AnimatePresence, useAnimation } from "framer-motion";
import {
  fetchProductBySlug,
  clearSelectedProduct,
} from "../store/slices/productSlice";
import { addToCart } from "../store/slices/cartSlice";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { Plus, Minus, ShoppingBag, ArrowLeft, Info, Truck } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import PageLoader from "@/components/PageLoader";
import { pageTransition } from "@/lib/motion";

// Utilities: token-driven durations
const UI_DUR = 0.32;

// sanitize small text inputs (prevent tags, protocols, suspicious chars)
const sanitize = (v = "", max = 60) =>
  String(v)
    .slice(0, max)
    .replace(/<[^>]*>?/g, "")
    .replace(/https?:\/\//gi, "")
    .replace(/mailto:/gi, "")
    .replace(/[<>"'`\\]/g, "")
    .trim();

// Carousel swipe helper: determines next index based on drag velocity and offset
const calcIndexFromDrag = (offsetX, velocityX, currentIndex, len) => {
  // threshold movement (px)
  const threshold = 80;
  // if fast flick, use velocity
  if (Math.abs(velocityX) > 800) {
    return velocityX < 0 ? Math.min(currentIndex + 1, len - 1) : Math.max(currentIndex - 1, 0);
  }
  if (Math.abs(offsetX) > threshold) {
    return offsetX < 0 ? Math.min(currentIndex + 1, len - 1) : Math.max(currentIndex - 1, 0);
  }
  return currentIndex;
};

/* Small accessible accordion used below */
const AccordionItem = ({ title, icon: Icon, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  return (
    <div className="border-b border-border">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center py-4 text-foreground hover:text-secondary transition-colors duration-[320ms]"
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-2 text-base font-semibold">
          {Icon && <Icon size={16} className="text-accent" />} {title}
        </span>
        <span className="text-muted-foreground">{isOpen ? "-" : "+"}</span>
      </button>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: UI_DUR }}
            className="overflow-hidden text-sm text-muted-foreground pb-4"
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
  const navigate = useNavigate();
  const { toast } = useToast();

  const { selectedProduct: product, status, items: allProducts } = useSelector((s) => s.products || {});

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [imageIndex, setImageIndex] = useState(0);
  const controls = useAnimation();
  const dragRef = useRef(null);

  useEffect(() => {
    if (slug) dispatch(fetchProductBySlug(sanitize(slug, 120)));
    return () => dispatch(clearSelectedProduct());
  }, [slug, dispatch]);

  useEffect(() => {
    // reset selections when product loads
    if (product) {
      setQuantity(1);
      setSelectedSize(product?.sizes?.[0]?.size || null);
      setImageIndex(0);
    }
  }, [product]);

  // keep quantity within available stock for the selected size
  useEffect(() => {
    if (!product || !product.sizes || !selectedSize) return;
    const stock = product.sizes.find((s) => s.size === selectedSize)?.quantity ?? 0;
    setQuantity((q) => (q > stock ? Math.max(1, stock) : q));
  }, [selectedSize, product]);

  const handleAddToCart = useCallback(() => {
    // safety checks
    if (!product) return;
    if (!selectedSize) {
      toast({ title: "Pilih size dulu", description: "Pilih ukuran sebelum menambahkan ke keranjang.", variant: "destructive" });
      return;
    }
    const stock = product.sizes.find((s) => s.size === selectedSize)?.quantity ?? 0;
    if (quantity < 1 || quantity > stock) {
      toast({ title: "Jumlah tidak valid", description: `Stok untuk size ${selectedSize}: ${stock}`, variant: "destructive" });
      return;
    }

    dispatch(addToCart({ product: { ...product, size: selectedSize }, quantity }));
    toast({ title: "Berhasil ditambahkan", description: `${quantity} × ${product.name} (Size ${selectedSize})`, className: "glass-card" });
  }, [product, selectedSize, quantity, dispatch, toast]);

  // image swipe handlers
  const onDragEnd = (e, info) => {
    if (!product?.images?.length) return;
    const next = calcIndexFromDrag(info.offset.x, info.velocity.x, imageIndex, product.images.length);
    setImageIndex(next);
  };

  // quick keyboard navigation for images
  useEffect(() => {
    const onKey = (ev) => {
      if (!product?.images?.length) return;
      if (ev.key === "ArrowRight") setImageIndex((i) => Math.min(i + 1, product.images.length - 1));
      if (ev.key === "ArrowLeft") setImageIndex((i) => Math.max(i - 1, 0));
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [product]);

  if (status === "loading") return <PageLoader />;
  if (status === "failed") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-foreground">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Product Not Found</h1>
          <button onClick={() => navigate("/shop")} className="text-accent hover:underline">Back to Shop</button>
        </div>
      </div>
    );
  }
  if (!product) return <PageLoader />;

  const relatedProducts = (allProducts || [])
    .filter((p) => p.category === product.category && p._id !== product._id)
    .slice(0, 4);

  return (
    <motion.div
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageTransition}
      className="min-h-screen pt-20 pb-32 font-sans bg-background relative text-foreground"
    >
      <Helmet>
        <title>{product.name} — Neo Dervish</title>
        <meta name="description" content={product.description?.slice(0, 150) || "Premium streetwear."} />
      </Helmet>

      {/* Decorative blobs token-driven */}
      <motion.div animate={{ y: [0, 14, 0] }} transition={{ duration: 12, repeat: Infinity }} className="absolute -top-20 -left-20 w-60 h-60 bg-accent/20 rounded-full blur-3xl" aria-hidden />
      <motion.div animate={{ y: [0, -18, 0] }} transition={{ duration: 14, repeat: Infinity }} className="absolute -bottom-20 -right-20 w-72 h-72 bg-primary/30 rounded-full blur-3xl" aria-hidden />

      <div className="container mx-auto px-4 relative z-10">
        <Link to="/shop" className="flex items-center mb-6 text-sm text-muted-foreground hover:text-foreground transition duration-[320ms]">
          <ArrowLeft className="mr-2" size={16} /> Back to Collection
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Gallery */}
          <div className="space-y-4">
            <div className="glass-card rounded-2xl overflow-hidden shadow-xl">
              <motion.div
                ref={dragRef}
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                onDragEnd={onDragEnd}
                className="relative w-full h-[520px] md:h-[640px] max-h-[75vh] overflow-hidden flex items-center justify-center"
                whileTap={{ cursor: "grabbing" }}
                transition={{ duration: UI_DUR }}
                aria-roledescription="carousel"
              >
                <AnimatePresence mode="wait">
                  {product.images?.[imageIndex] && (
                    <motion.img
                      key={product.images[imageIndex].url}
                      src={product.images[imageIndex].url}
                      alt={`${product.name} image ${imageIndex + 1}`}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -50 }}
                      transition={{ duration: UI_DUR }}
                      className="object-contain w-full h-full touch-none select-none"
                      draggable={false}
                    />
                  )}
                </AnimatePresence>

                {/* pagination dots */}
                <div className="absolute left-1/2 -translate-x-1/2 bottom-4 flex gap-2">
                  {product.images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setImageIndex(idx)}
                      aria-label={`Go to image ${idx + 1}`}
                      className={`w-2 h-2 rounded-full transition-all duration-[320ms] ${idx === imageIndex ? "bg-foreground" : "bg-foreground/20 hover:bg-foreground/60"}`}
                    />
                  ))}
                </div>
              </motion.div>
            </div>

            {/* thumbnail scroller for quick taps on mobile */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide py-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setImageIndex(idx)}
                  className={`w-20 h-20 rounded-xl border transition duration-[320ms] overflow-hidden ${imageIndex === idx ? "border-accent" : "border-border hover:border-muted-foreground"}`}
                >
                  <img src={img.url} alt={`thumb-${idx}`} className="object-cover w-full h-full" draggable={false} />
                </button>
              ))}
            </div>
          </div>

          {/* Info column */}
          <div className="flex flex-col gap-6">
            <div>
              <p className="uppercase text-xs tracking-widest text-secondary mb-1 font-semibold">{product.category}</p>
              <h1 className="text-3xl lg:text-5xl font-heading font-bold leading-tight">{product.name}</h1>
              <p className="text-xl font-semibold mt-2">Rp {product.price?.toLocaleString("id-ID")}</p>
            </div>

            <div className="glass-card p-6 flex flex-col gap-5 shadow-lg">
              <div>
                <span className="font-medium">Size</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {product?.sizes?.map(({ size, quantity }) => (
                    <button
                      key={size}
                      disabled={quantity === 0}
                      onClick={() => setSelectedSize(size)}
                      className={`px-4 py-2 text-sm font-medium rounded-full border transition-all duration-[320ms] ${selectedSize === size ? "bg-secondary text-secondary-foreground border-secondary" : quantity === 0 ? "bg-muted text-muted-foreground border-border cursor-not-allowed" : "bg-card text-foreground border-border hover:bg-muted"}`}
                      aria-pressed={selectedSize === size}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>

              <div className="flex justify-between items-center">
                <span className="font-medium">Quantity</span>
                <div className="flex items-center gap-3 border border-border rounded-full px-3 py-1 bg-background/60">
                  <Button variant="ghost" size="icon" onClick={() => setQuantity((q) => Math.max(1, q - 1))} aria-label="Decrease quantity"><Minus size={16} /></Button>
                  <span className="font-semibold w-6 text-center" aria-live="polite">{quantity}</span>
                  <Button variant="ghost" size="icon" onClick={() => {
                    const stock = product?.sizes?.find((s) => s.size === selectedSize)?.quantity || 1;
                    setQuantity((q) => Math.min(q + 1, stock));
                  }} aria-label="Increase quantity"><Plus size={16} /></Button>
                </div>
              </div>

              <motion.div whileTap={{ scale: 0.98 }} transition={{ duration: UI_DUR }}>
                <Button
                  onClick={handleAddToCart}
                  disabled={!selectedSize || (product?.sizes?.find((s) => s.size === selectedSize)?.quantity || 0) === 0}
                  className={`w-full py-3 font-bold rounded-full transition-all duration-[320ms] flex items-center justify-center gap-2 ${!selectedSize || (product?.sizes?.find((s) => s.size === selectedSize)?.quantity || 0) === 0 ? "bg-muted text-muted-foreground cursor-not-allowed" : "btn-primary hover:opacity-90"}`}
                >
                  <ShoppingBag size={20} />
                  {!selectedSize ? "Pilih Size" : (product?.sizes?.find((s) => s.size === selectedSize)?.quantity || 0) === 0 ? "Habis" : "Tambahkan ke Keranjang"}
                </Button>
              </motion.div>
            </div>

            {/* Accordions for details */}
            <div className="divide-y divide-border">
              <AccordionItem title="Description" icon={Info} defaultOpen>
                <p>{product.description}</p>
              </AccordionItem>

              <AccordionItem title="Details & Fit" icon={Info}>
                <ul className="list-disc list-inside space-y-1 mb-4 text-muted-foreground">
                  <li>Material: {product.details?.material || "Premium Cotton"}</li>
                  <li>Fit: {product.details?.fit || "Regular"}</li>
                  <li>Origin: {product.details?.origin || "In-house"}</li>
                </ul>
              </AccordionItem>

              <AccordionItem title="Shipping & Returns" icon={Truck}>
                <p>Fast delivery. Easy returns within 7 days.</p>
              </AccordionItem>
            </div>
          </div>
        </div>

        {/* Related */}
        {relatedProducts.length > 0 && (
          <div className="mt-24">
            <h2 className="text-2xl font-heading font-semibold text-center mb-10">You Might Also Like</h2>
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
