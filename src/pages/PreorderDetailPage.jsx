import React, {
    useEffect,
    useState,
    useRef,
    useCallback,
    useMemo,
    memo,
    lazy,
    Suspense,
    startTransition
} from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Helmet } from "react-helmet";
import { motion, AnimatePresence, useReducedMotion } from "framer-motion";

import {
    fetchProductBySlug,
    clearSelectedProduct,
} from "../store/slices/productSlice";
import { addToCart } from "../store/slices/cartSlice";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";

// Lazy load components untuk code splitting
const ProductCard = lazy(() => import("@/components/ProductCard"));
const PageLoader = lazy(() => import("@/components/PageLoader"));

// Import selective icons untuk mengurangi bundle size
import { Plus, Minus, ShoppingBag, ArrowLeft, Info, Truck, Clock, Award, Lock } from "lucide-react";

// Constants untuk optimasi
const DRAG_THRESHOLD = 80;
const MAX_INPUT_LENGTH = 120;
const RELATED_PRODUCTS_LIMIT = 4;
const IMAGE_LOADING_DELAY = 100;
const TOUCH_THROTTLE_MS = 16; // ~60fps

// Optimized sanitization dengan caching
const sanitizeCache = new Map();
const MAX_CACHE_SIZE = 100;

const sanitize = (value = "", max = MAX_INPUT_LENGTH) => {
    const key = `${value}-${max}`;

    if (sanitizeCache.has(key)) {
        return sanitizeCache.get(key);
    }

    const sanitized = String(value)
        .slice(0, max)
        .replace(/<[^>]*>?/g, "")
        .replace(/https?:\/\//gi, "")
        .replace(/mailto:/gi, "")
        .replace(/[<>"]|'`\\/g, "")
        .trim();

    // Maintain cache size
    if (sanitizeCache.size >= MAX_CACHE_SIZE) {
        const firstKey = sanitizeCache.keys().next().value;
        sanitizeCache.delete(firstKey);
    }

    sanitizeCache.set(key, sanitized);
    return sanitized;
};

// Optimized Image Component dengan lazy loading dan error handling
const OptimizedImage = memo(({
    src,
    alt,
    className,
    onLoad,
    priority = false,
    sizes = "100vw"
}) => {
    const [isLoaded, setIsLoaded] = useState(false);
    const [hasError, setHasError] = useState(false);
    const imgRef = useRef(null);

    const handleLoad = useCallback(() => {
        setIsLoaded(true);
        onLoad?.();
    }, [onLoad]);

    const handleError = useCallback(() => {
        setHasError(true);
        setIsLoaded(true);
    }, []);

    return (
        <div className="relative w-full h-full">
            <img
                ref={imgRef}
                src={src}
                alt={alt}
                className={`${className} transition-opacity duration-300 ${isLoaded ? "opacity-100" : "opacity-0"
                    }`}
                onLoad={handleLoad}
                onError={handleError}
                loading={priority ? "eager" : "lazy"}
                decoding="async"
                draggable={false}
                sizes={sizes}
            />

            {!isLoaded && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted/20">
                    <div className="w-8 h-8 border-2 border-accent/30 border-t-accent rounded-full animate-spin" />
                </div>
            )}

            {hasError && (
                <div className="absolute inset-0 flex items-center justify-center bg-muted/10 text-muted-foreground text-sm">
                    Failed to load image
                </div>
            )}
        </div>
    );
});

// Optimized Image Gallery Component
const ImageGallery = memo(({ images, productName }) => {
    const [currentIndex, setCurrentIndex] = useState(0);
    const [touchStart, setTouchStart] = useState(0);
    const [touchEnd, setTouchEnd] = useState(0);
    const [isDragging, setIsDragging] = useState(false);
    const [dragOffset, setDragOffset] = useState(0);

    const rafRef = useRef(null);
    const prefersReducedMotion = useReducedMotion();

    // Optimized touch handlers dengan throttling
    const handleTouchStart = useCallback((e) => {
        setTouchStart(e.touches[0].clientX);
        setIsDragging(true);
    }, []);

    const handleTouchMove = useCallback((e) => {
        if (!isDragging) return;

        if (rafRef.current) {
            cancelAnimationFrame(rafRef.current);
        }

        rafRef.current = requestAnimationFrame(() => {
            const currentTouch = e.touches[0].clientX;
            const diff = currentTouch - touchStart;
            setDragOffset(diff);
            setTouchEnd(currentTouch);
        });
    }, [isDragging, touchStart]);

    const handleTouchEnd = useCallback(() => {
        if (!isDragging) return;

        const distance = touchStart - touchEnd;
        const isSignificantSwipe = Math.abs(distance) > DRAG_THRESHOLD;

        if (isSignificantSwipe) {
            if (distance > 0 && currentIndex < images.length - 1) {
                startTransition(() => {
                    setCurrentIndex(prev => prev + 1);
                });
            } else if (distance < 0 && currentIndex > 0) {
                startTransition(() => {
                    setCurrentIndex(prev => prev - 1);
                });
            }
        }

        setIsDragging(false);
        setDragOffset(0);
        setTouchEnd(0);
    }, [isDragging, touchStart, touchEnd, currentIndex, images.length]);

    // Cleanup RAF
    useEffect(() => {
        return () => {
            if (rafRef.current) {
                cancelAnimationFrame(rafRef.current);
            }
        };
    }, []);

    // Preload adjacent images
    useEffect(() => {
        const preloadImage = (src) => {
            const img = new Image();
            img.src = src;
        };

        // Preload next and previous images
        if (images[currentIndex + 1]) {
            setTimeout(() => preloadImage(images[currentIndex + 1].url), IMAGE_LOADING_DELAY);
        }
        if (images[currentIndex - 1]) {
            setTimeout(() => preloadImage(images[currentIndex - 1].url), IMAGE_LOADING_DELAY);
        }
    }, [currentIndex, images]);

    if (!images?.length) return null;

    return (
        <div className="space-y-4">
            {/* Main Image Display */}
            <div className="glass-card rounded-2xl overflow-hidden shadow-xl">
                <div
                    className="relative w-full h-[520px] md:h-[640px] max-h-[75vh] overflow-hidden"
                    onTouchStart={handleTouchStart}
                    onTouchMove={handleTouchMove}
                    onTouchEnd={handleTouchEnd}
                >
                    <AnimatePresence mode="wait">
                        <motion.div
                            key={currentIndex}
                            initial={prefersReducedMotion ? {} : { opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            exit={prefersReducedMotion ? {} : { opacity: 0, x: -20 }}
                            transition={{ duration: 0.3, ease: "easeOut" }}
                            className="absolute inset-0"
                            style={{
                                transform: isDragging ? `translateX(${dragOffset}px)` : undefined,
                            }}
                        >
                            <OptimizedImage
                                src={images[currentIndex]?.url}
                                alt={`${productName} - Image ${currentIndex + 1}`}
                                className="object-contain w-full h-full"
                                priority={currentIndex === 0}
                                sizes="(max-width: 768px) 100vw, 50vw"
                            />
                        </motion.div>
                    </AnimatePresence>

                    {/* Preorder Badge */}
                    <div className="absolute top-4 left-4">
                        <div className="px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-warning to-accent text-white shadow-lg">
                            PREORDER EXCLUSIVE
                        </div>
                    </div>

                    {/* Navigation Dots */}
                    {images.length > 1 && (
                        <div className="absolute left-1/2 -translate-x-1/2 bottom-4 flex gap-2">
                            {images.map((_, idx) => (
                                <button
                                    key={idx}
                                    onClick={() => startTransition(() => setCurrentIndex(idx))}
                                    aria-label={`Go to image ${idx + 1}`}
                                    className={`w-2 h-2 rounded-full transition-all duration-300 ${idx === currentIndex
                                        ? "bg-warning scale-125"
                                        : "bg-foreground/20 hover:bg-foreground/60"
                                        }`}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            {/* Thumbnail Navigation */}
            {images.length > 1 && (
                <div className="flex gap-2 overflow-x-auto scrollbar-hide py-2">
                    {images.map((img, idx) => (
                        <button
                            key={idx}
                            onClick={() => startTransition(() => setCurrentIndex(idx))}
                            className={`w-20 h-20 rounded-xl border transition-all duration-300 overflow-hidden flex-shrink-0 ${currentIndex === idx
                                ? "border-warning scale-105 shadow-lg"
                                : "border-border hover:border-muted-foreground"
                                }`}
                        >
                            <OptimizedImage
                                src={img.url}
                                alt={`${productName} thumbnail ${idx + 1}`}
                                className="object-cover w-full h-full"
                                sizes="80px"
                            />
                        </button>
                    ))}
                </div>
            )}
        </div>
    );
});

// Optimized Accordion Component
const AccordionItem = memo(({ title, icon: Icon, children, defaultOpen = false }) => {
    const [isOpen, setIsOpen] = useState(defaultOpen);
    const prefersReducedMotion = useReducedMotion();

    const toggleAccordion = useCallback(() => {
        startTransition(() => {
            setIsOpen(prev => !prev);
        });
    }, []);

    return (
        <div className="border-b border-border">
            <button
                onClick={toggleAccordion}
                className="w-full flex justify-between items-center py-4 text-foreground hover:text-secondary transition-colors duration-300"
                aria-expanded={isOpen}
            >
                <span className="flex items-center gap-2 text-base font-semibold">
                    {Icon && <Icon size={16} className="text-accent" />}
                    {title}
                </span>
                <motion.span
                    animate={{ rotate: isOpen ? 45 : 0 }}
                    transition={{ duration: prefersReducedMotion ? 0.1 : 0.2 }}
                    className="text-muted-foreground text-xl"
                >
                    +
                </motion.span>
            </button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={prefersReducedMotion ? { opacity: 1 } : { opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, height: 0 }}
                        transition={{ duration: prefersReducedMotion ? 0.1 : 0.3, ease: "easeOut" }}
                        className="text-sm text-muted-foreground pb-4 overflow-hidden"
                    >
                        {children}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
});

// Memoized Product Info Component for Preorder
const ProductInfo = memo(({
    product,
    quantity,
    selectedSize,
    onQuantityChange,
    onSizeChange,
    onAddToCart
}) => {
    const selectedSizeStock = useMemo(() => {
        return product?.sizes?.find(s => s.size === selectedSize)?.quantity || 0;
    }, [product?.sizes, selectedSize]);

    const canAddToCart = selectedSize;

    return (
        <div className="flex flex-col gap-6">
            {/* Product Header */}
            <div>
                <div className="flex items-center gap-2 mb-2">
                    <Clock className="w-4 h-4 text-warning" />
                    <span className="text-xs font-semibold text-warning uppercase tracking-wider">
                        Preorder Exclusive
                    </span>
                </div>
                <p className="uppercase text-xs tracking-widest text-secondary mb-1 font-semibold">
                    {product.category}
                </p>
                <h1 className="text-3xl lg:text-5xl font-heading font-bold leading-tight">
                    {product.name}
                </h1>
                <p className="text-xl font-semibold mt-2">
                    Rp {product.price?.toLocaleString("id-ID")}
                </p>
                <div className="flex items-center gap-2 mt-2 text-sm text-warning">
                    <Award className="w-4 h-4" />
                    <span>Limited preorder pricing - VA payment only</span>
                </div>
            </div>

            {/* Selection Card */}
            <div className="glass-card p-6 flex flex-col gap-5 shadow-lg border-warning/20">
                {/* Size Selection */}
                <div>
                    <span className="font-medium">Size</span>
                    <div className="flex flex-wrap gap-2 mt-2">
                        {product?.sizes?.map(({ size, quantity }) => (
                            <button
                                key={size}
                                onClick={() => onSizeChange(size)}
                                className={`px-4 py-2 text-sm font-medium rounded-full border transition-all duration-300 ${selectedSize === size
                                    ? "bg-warning text-warning-foreground border-warning scale-105"
                                    : "bg-card text-foreground border-border hover:bg-muted hover:scale-105"
                                    }`}
                                aria-pressed={selectedSize === size}
                                aria-label={`Size ${size}`}
                            >
                                {size}
                            </button>
                        ))}
                    </div>
                    {selectedSize && (
                        <p className="text-xs text-muted-foreground mt-2">
                            Preorder available for size {selectedSize}
                        </p>
                    )}
                </div>

                {/* Quantity Selection */}
                <div className="flex justify-between items-center">
                    <span className="font-medium">Quantity</span>
                    <div className="flex items-center gap-3 border border-border rounded-full px-3 py-1 bg-background/60">
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onQuantityChange(Math.max(1, quantity - 1))}
                            disabled={quantity <= 1}
                        >
                            <Minus size={16} />
                        </Button>
                        <span className="font-semibold w-6 text-center">{quantity}</span>
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onQuantityChange(Math.min(10, quantity + 1))} // Reasonable limit for preorder
                            disabled={quantity >= 10}
                        >
                            <Plus size={16} />
                        </Button>
                    </div>
                </div>

                {/* Add to Cart Button */}
                <Button
                    onClick={onAddToCart}
                    disabled={!canAddToCart}
                    className={`w-full py-3 font-bold rounded-full transition-all duration-300 flex items-center justify-center gap-2 ${!canAddToCart
                        ? "bg-muted text-muted-foreground cursor-not-allowed"
                        : "bg-gradient-to-r from-warning to-accent hover:opacity-90 hover:scale-105 active:scale-95 text-white"
                        }`}
                >
                    <Lock size={18} />
                    {!selectedSize
                        ? "Pilih Size"
                        : "Add to Preorder Cart"}
                </Button>

                <div className="text-center text-xs text-muted-foreground">
                    <p>⚡ Secure preorder • VA payment required</p>
                    <p>📅 Estimated delivery: 4-6 weeks after production</p>
                </div>
            </div>
        </div>
    );
});

// Memoized Related Products Component
const RelatedProducts = memo(({ products, currentProductId, category }) => {
    const relatedProducts = useMemo(() => {
        return products
            ?.filter(p => p.category === category && p._id !== currentProductId)
            ?.slice(0, RELATED_PRODUCTS_LIMIT) || [];
    }, [products, category, currentProductId]);

    if (relatedProducts.length === 0) return null;

    return (
        <div className="mt-24">
            <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-2xl font-heading font-semibold text-center mb-10"
            >
                More Preorder Items
            </motion.h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
                {relatedProducts.map((product, index) => (
                    <motion.div
                        key={product._id}
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.1, duration: 0.5 }}
                    >
                        <Suspense fallback={
                            <div className="aspect-[4/5] bg-muted/20 rounded-2xl animate-pulse" />
                        }>
                            <ProductCard product={product} isPreorder={true} />
                        </Suspense>
                    </motion.div>
                ))}
            </div>
        </div>
    );
});

// Main PreorderDetailPage Component
const PreorderDetailPage = () => {
    const { slug } = useParams();
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const { toast } = useToast();

    const [quantity, setQuantity] = useState(1);
    const [selectedSize, setSelectedSize] = useState(null);

    // Optimized Redux selectors
    const product = useSelector(state => state.products?.selectedProduct);
    const status = useSelector(state => state.products?.status);
    const allProducts = useSelector(state => state.products?.items || []);

    // Fetch product effect
    useEffect(() => {
        if (slug) {
            const sanitizedSlug = sanitize(slug, MAX_INPUT_LENGTH);
            dispatch(fetchProductBySlug(sanitizedSlug));
        }

        return () => {
            dispatch(clearSelectedProduct());
        };
    }, [slug, dispatch]);

    // Reset state when product changes
    useEffect(() => {
        if (product) {
            setQuantity(1);
            setSelectedSize(product?.sizes?.[0]?.size || null);
        }
    }, [product?._id]);

    // Optimized handlers
    const handleAddToCart = useCallback(() => {
        if (!product || !selectedSize) {
            toast({
                title: "Pilih size terlebih dahulu",
                description: "Pilih ukuran sebelum menambahkan ke keranjang preorder.",
                variant: "destructive",
            });
            return;
        }

        dispatch(addToCart({
            product: { ...product, size: selectedSize, isPreorder: true },
            quantity
        }));

        toast({
            title: "Berhasil ditambahkan ke preorder",
            description: `${quantity} × ${product.name} (Size ${selectedSize}) - Preorder`,
            className: "glass-card",
        });
    }, [product, selectedSize, quantity, dispatch, toast]);

    const handleQuantityChange = useCallback((newQuantity) => {
        startTransition(() => {
            setQuantity(newQuantity);
        });
    }, []);

    const handleSizeChange = useCallback((size) => {
        startTransition(() => {
            setSelectedSize(size);
        });
    }, []);

    // Error and loading states
    if (status === "loading") {
        return (
            <Suspense fallback={<div className="min-h-screen bg-background" />}>
                <PageLoader />
            </Suspense>
        );
    }

    if (status === "failed" || !product) {
        return (
            <div className="min-h-screen flex items-center justify-center text-foreground">
                <div className="text-center space-y-4">
                    <h1 className="text-2xl font-bold">Preorder Item Not Found</h1>
                    <Button
                        onClick={() => navigate("/preorder")}
                        variant="outline"
                    >
                        Back to Preorder Collection
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <>
            <Helmet>
                <title>{product.name} — Preorder | Neo Dervish</title>
                <meta
                    name="description"
                    content={`Preorder ${product.description?.slice(0, 150) || "Exclusive preorder collection"}`}
                />
                <meta property="og:title" content={`${product.name} — Preorder | Neo Dervish`} />
                <meta property="og:description" content={product.description} />
                <meta property="og:image" content={product.images?.[0]?.url} />
                <link rel="preload" href={product.images?.[0]?.url} as="image" />
            </Helmet>

            <div className="min-h-screen pt-20 pb-32 font-sans relative text-foreground overflow-hidden">
                {/* Decorative Background Elements */}
                <div className="absolute -top-40 -left-40 w-96 h-96 bg-warning/15 rounded-full blur-3xl animate-pulse" />
                <div className="absolute bottom-0 right-0 w-80 h-80 bg-accent/8 rounded-full blur-3xl animate-pulse" />

                <div className="container mx-auto px-4 relative z-10">
                    {/* Back Button */}
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Link
                            to="/preorder"
                            className="flex items-center mb-6 text-sm text-muted-foreground hover:text-foreground transition-colors duration-300"
                        >
                            <ArrowLeft className="mr-2" size={16} />
                            Back to Preorder Collection
                        </Link>
                    </motion.div>

                    {/* Main Content */}
                    <div className="grid lg:grid-cols-2 gap-12">
                        {/* Image Gallery */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.95 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.6, ease: "easeOut" }}
                        >
                            <ImageGallery
                                images={product.images}
                                productName={product.name}
                            />
                        </motion.div>

                        {/* Product Info */}
                        <motion.div
                            initial={{ opacity: 0, x: 20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.6, delay: 0.2 }}
                        >
                            <ProductInfo
                                product={product}
                                quantity={quantity}
                                selectedSize={selectedSize}
                                onQuantityChange={handleQuantityChange}
                                onSizeChange={handleSizeChange}
                                onAddToCart={handleAddToCart}
                            />

                            {/* Product Details Accordions */}
                            <div className="mt-8 divide-y divide-border">
                                <AccordionItem title="Description" icon={Info} defaultOpen>
                                    <p className="leading-relaxed">{product.description}</p>
                                </AccordionItem>

                                <AccordionItem title="Preorder Details" icon={Clock}>
                                    <div className="space-y-2 text-muted-foreground">
                                        <p>• <strong>VA Payment Only:</strong> Preorders require Virtual Account payment</p>
                                        <p>• <strong>Production Time:</strong> 2-3 weeks after preorder closes</p>
                                        <p>• <strong>Shipping:</strong> 1-2 weeks after production completion</p>
                                        <p>• <strong>Total Delivery:</strong> Approximately 4-6 weeks</p>
                                        <p>• <strong>Refund Policy:</strong> Non-refundable once production begins</p>
                                    </div>
                                </AccordionItem>

                                <AccordionItem title="Shipping & Returns" icon={Truck}>
                                    <div className="space-y-2 text-muted-foreground">
                                        <p>• Fast delivery within 2-3 business days after production</p>
                                        <p>• Free shipping on all preorder items</p>
                                        <p>• Preorder items are final sale</p>
                                    </div>
                                </AccordionItem>
                            </div>
                        </motion.div>
                    </div>

                    {/* Related Products */}
                    <RelatedProducts
                        products={allProducts}
                        currentProductId={product._id}
                        category={product.category}
                    />
                </div>
            </div>
        </>
    );
};

// Set display names untuk debugging
OptimizedImage.displayName = 'OptimizedImage';
ImageGallery.displayName = 'ImageGallery';
AccordionItem.displayName = 'AccordionItem';
ProductInfo.displayName = 'ProductInfo';
RelatedProducts.displayName = 'RelatedProducts';
PreorderDetailPage.displayName = 'PreorderDetailPage';

export default PreorderDetailPage;