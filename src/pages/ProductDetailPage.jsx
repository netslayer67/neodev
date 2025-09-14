import React, { useEffect, useState, useRef, useCallback } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Helmet } from "react-helmet";
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

// sanitize small text inputs
const sanitize = (v = "", max = 60) =>
  String(v)
    .slice(0, max)
    .replace(/<[^>]*>?/g, "")
    .replace(/https?:\/\//gi, "")
    .replace(/mailto:/gi, "")
    .replace(/[<>"'`\\]/g, "")
    .trim();

/* AccordionItem → versi super ringan */
const AccordionItem = ({ title, icon: Icon, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-border">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex justify-between items-center py-4 text-foreground hover:text-secondary transition-colors"
        aria-expanded={isOpen}
      >
        <span className="flex items-center gap-2 text-base font-semibold">
          {Icon && <Icon size={16} className="text-accent" />} {title}
        </span>
        <span className="text-muted-foreground">{isOpen ? "-" : "+"}</span>
      </button>

      {isOpen && <div className="text-sm text-muted-foreground pb-4">{children}</div>}
    </div>
  );
};

const ProductDetailPage = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { toast } = useToast();

  const { selectedProduct: product, status, items: allProducts } = useSelector(
    (s) => s.products || {}
  );

  const [quantity, setQuantity] = useState(1);
  const [selectedSize, setSelectedSize] = useState(null);
  const [imageIndex, setImageIndex] = useState(0);

  // swipe refs
  const [dragX, setDragX] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const startX = useRef(0);

  useEffect(() => {
    if (slug) dispatch(fetchProductBySlug(sanitize(slug, 120)));
    return () => dispatch(clearSelectedProduct());
  }, [slug, dispatch]);

  useEffect(() => {
    if (product) {
      setQuantity(1);
      setSelectedSize(product?.sizes?.[0]?.size || null);
      setImageIndex(0);
    }
  }, [product]);

  // keep quantity within stock
  useEffect(() => {
    if (!product || !product.sizes || !selectedSize) return;
    const stock =
      product.sizes.find((s) => s.size === selectedSize)?.quantity ?? 0;
    setQuantity((q) => (q > stock ? Math.max(1, stock) : q));
  }, [selectedSize, product]);

  const handleAddToCart = useCallback(() => {
    if (!product) return;
    if (!selectedSize) {
      toast({
        title: "Pilih size dulu",
        description: "Pilih ukuran sebelum menambahkan ke keranjang.",
        variant: "destructive",
      });
      return;
    }
    const stock =
      product.sizes.find((s) => s.size === selectedSize)?.quantity ?? 0;
    if (quantity < 1 || quantity > stock) {
      toast({
        title: "Jumlah tidak valid",
        description: `Stok untuk size ${selectedSize}: ${stock}`,
        variant: "destructive",
      });
      return;
    }

    dispatch(addToCart({ product: { ...product, size: selectedSize }, quantity }));
    toast({
      title: "Berhasil ditambahkan",
      description: `${quantity} × ${product.name} (Size ${selectedSize})`,
      className: "glass-card",
    });
  }, [product, selectedSize, quantity, dispatch, toast]);

  // 🌀 Native Swipe Handlers
  const handleTouchStart = (e) => {
    startX.current = e.touches[0].clientX;
    setIsDragging(true);
    setDragX(0);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    const currentX = e.touches[0].clientX;
    setDragX(currentX - startX.current);
  };

  const handleTouchEnd = () => {
    if (!isDragging) return;
    const threshold = 80;
    if (dragX < -threshold && imageIndex < product.images.length - 1) {
      setImageIndex(imageIndex + 1);
    } else if (dragX > threshold && imageIndex > 0) {
      setImageIndex(imageIndex - 1);
    }
    setIsDragging(false);
    setDragX(0);
  };

  if (status === "loading") return <PageLoader />;
  if (status === "failed") {
    return (
      <div className="min-h-screen flex items-center justify-center text-foreground">
        <div className="text-center space-y-4">
          <h1 className="text-2xl font-bold">Product Not Found</h1>
          <button
            onClick={() => navigate("/shop")}
            className="text-accent hover:underline"
          >
            Back to Shop
          </button>
        </div>
      </div>
    );
  }
  if (!product) return <PageLoader />;

  const relatedProducts = (allProducts || [])
    .filter((p) => p.category === product.category && p._id !== product._id)
    .slice(0, 4);

  return (
    <div className="min-h-screen pt-20 pb-32 font-sans relative text-foreground">
      <Helmet>
        <title>{product.name} — Neo Dervish</title>
        <meta
          name="description"
          content={
            product.description?.slice(0, 150) || "Premium streetwear."
          }
        />
      </Helmet>

      <div className="container mx-auto px-4 relative z-10">
        <Link
          to="/shop"
          className="flex items-center mb-6 text-sm text-muted-foreground hover:text-foreground transition"
        >
          <ArrowLeft className="mr-2" size={16} /> Back to Collection
        </Link>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* 🖼 Gallery */}
          <div className="space-y-4">
            <div className="glass-card rounded-2xl overflow-hidden shadow-xl">
              <div
                className="relative w-full h-[520px] md:h-[640px] max-h-[75vh] overflow-hidden"
                aria-roledescription="carousel"
                onTouchStart={handleTouchStart}
                onTouchMove={handleTouchMove}
                onTouchEnd={handleTouchEnd}
              >
                <div
                  className="flex w-full h-full transition-transform duration-300 ease-out"
                  style={{
                    transform: `translateX(calc(${-imageIndex * 100}% + ${dragX}px))`,
                  }}
                >
                  {product.images?.map((img, idx) => (
                    <img
                      key={idx}
                      src={img.url}
                      alt={`${product.name} image ${idx + 1}`}
                      className="object-contain w-full h-full flex-shrink-0 select-none touch-none"
                      draggable={false}
                    />
                  ))}
                </div>

                {/* dots */}
                <div className="absolute left-1/2 -translate-x-1/2 bottom-4 flex gap-2">
                  {product.images.map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setImageIndex(idx)}
                      aria-label={`Go to image ${idx + 1}`}
                      className={`w-2 h-2 rounded-full transition-all ${idx === imageIndex
                          ? "bg-foreground"
                          : "bg-foreground/20 hover:bg-foreground/60"
                        }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {/* thumbnails */}
            <div className="flex gap-2 overflow-x-auto scrollbar-hide py-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setImageIndex(idx)}
                  className={`w-20 h-20 rounded-xl border transition overflow-hidden ${imageIndex === idx
                      ? "border-accent"
                      : "border-border hover:border-muted-foreground"
                    }`}
                >
                  <img
                    src={img.url}
                    alt={`thumb-${idx}`}
                    className="object-cover w-full h-full"
                    draggable={false}
                  />
                </button>
              ))}
            </div>
          </div>

          {/* 📦 Info */}
          <div className="flex flex-col gap-6">
            <div>
              <p className="uppercase text-xs tracking-widest text-secondary mb-1 font-semibold">
                {product.category}
              </p>
              <h1 className="text-3xl lg:text-5xl font-heading font-bold leading-tight">
                {product.name}
              </h1>
              <p className="text-xl font-semibold mt-2">
                Rp {product.price?.toLocaleString("id-ID")}
              </p>
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
                      className={`px-4 py-2 text-sm font-medium rounded-full border transition ${selectedSize === size
                          ? "bg-secondary text-secondary-foreground border-secondary"
                          : quantity === 0
                            ? "bg-muted text-muted-foreground border-border cursor-not-allowed"
                            : "bg-card text-foreground border-border hover:bg-muted"
                        }`}
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
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                    aria-label="Decrease quantity"
                  >
                    <Minus size={16} />
                  </Button>
                  <span
                    className="font-semibold w-6 text-center"
                    aria-live="polite"
                  >
                    {quantity}
                  </span>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      const stock =
                        product?.sizes?.find((s) => s.size === selectedSize)
                          ?.quantity || 1;
                      setQuantity((q) => Math.min(q + 1, stock));
                    }}
                    aria-label="Increase quantity"
                  >
                    <Plus size={16} />
                  </Button>
                </div>
              </div>

              <Button
                onClick={handleAddToCart}
                disabled={
                  !selectedSize ||
                  (product?.sizes?.find((s) => s.size === selectedSize)
                    ?.quantity || 0) === 0
                }
                className={`w-full py-3 font-bold rounded-full transition flex items-center justify-center gap-2 ${!selectedSize ||
                    (product?.sizes?.find((s) => s.size === selectedSize)
                      ?.quantity || 0) === 0
                    ? "bg-muted text-muted-foreground cursor-not-allowed"
                    : "btn-primary hover:opacity-90"
                  }`}
              >
                <ShoppingBag size={20} />
                {!selectedSize
                  ? "Pilih Size"
                  : (product?.sizes?.find((s) => s.size === selectedSize)
                    ?.quantity || 0) === 0
                    ? "Habis"
                    : "Tambahkan ke Keranjang"}
              </Button>
            </div>

            {/* Accordions */}
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
            <h2 className="text-2xl font-heading font-semibold text-center mb-10">
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
    </div>
  );
};

export default ProductDetailPage;
