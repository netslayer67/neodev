import React, { useState, useEffect, useCallback, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronLeft, ChevronRight, Grid3X3, Square, Sparkles, ShoppingBag, Heart, Share2, X } from "lucide-react";

// Security utility for input sanitization
const sanitizeInput = (input) => {
    if (!input) return "";
    // Remove potential XSS vectors
    const dangerous = /<script|javascript:|on\w+=/gi;
    const urls = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})/i;

    if (dangerous.test(input) || (urls.test(input) && !input.startsWith('https://images.unsplash.com'))) {
        return "";
    }
    return input.replace(/[<>]/g, '');
};

const mediaItems = [
    { id: 1, type: "image", src: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=800&auto=format&fit=crop", alt: "Haute Couture", price: "$2,450", collection: "FW24" },
    { id: 2, type: "image", src: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop", alt: "Avant-Garde", price: "$1,890", collection: "SS24" },
    { id: 3, type: "image", src: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?q=80&w=800&auto=format&fit=crop", alt: "Minimalist Luxe", price: "$3,200", collection: "FW24" },
    { id: 4, type: "image", src: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=800&auto=format&fit=crop", alt: "Gold Edition", price: "$4,750", collection: "Limited" },
    { id: 5, type: "image", src: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?q=80&w=800&auto=format&fit=crop", alt: "Street Elegance", price: "$1,650", collection: "SS24" },
    { id: 6, type: "image", src: "https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=800&auto=format&fit=crop", alt: "Neo Classic", price: "$2,890", collection: "FW24" },
    { id: 7, type: "image", src: "https://images.unsplash.com/photo-1523381210434-271e8be1f52b?q=80&w=800&auto=format&fit=crop", alt: "Urban Noir", price: "$1,450", collection: "Core" },
    { id: 8, type: "image", src: "https://images.unsplash.com/photo-1519235106638-30cc49b5dbc5?q=80&w=800&auto=format&fit=crop", alt: "Ethereal", price: "$5,200", collection: "Atelier" },
];

const GalleryPage = () => {
    const [selectedItem, setSelectedItem] = useState(null);
    const [viewMode, setViewMode] = useState('grid');
    const [favorites, setFavorites] = useState(new Set());
    const [isMobile, setIsMobile] = useState(false);
    const [filter, setFilter] = useState('all');

    // Mobile detection
    useEffect(() => {
        const checkMobile = () => {
            setIsMobile(window.innerWidth < 768);
        };
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    // Filtered items based on collection
    const filteredItems = useMemo(() => {
        if (filter === 'all') return mediaItems;
        return mediaItems.filter(item => item.collection === filter);
    }, [filter]);

    const toggleFavorite = useCallback((id, e) => {
        e.stopPropagation();
        setFavorites(prev => {
            const newFavs = new Set(prev);
            if (newFavs.has(id)) {
                newFavs.delete(id);
            } else {
                newFavs.add(id);
            }
            return newFavs;
        });
    }, []);

    const handleShare = useCallback((item, e) => {
        e.stopPropagation();
        if (navigator.share) {
            navigator.share({
                title: item.alt,
                text: `Check out this ${item.alt} piece from our ${item.collection} collection`,
            });
        }
    }, []);

    // Animated background gradients
    const backgroundVariants = {
        initial: { opacity: 0 },
        animate: {
            opacity: 1,
            transition: { duration: 1.2, ease: "easeOut" }
        }
    };

    // Premium grid variants
    const gridVariants = {
        hidden: { opacity: 0 },
        visible: {
            opacity: 1,
            transition: {
                staggerChildren: 0.08,
                delayChildren: 0.2
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20, scale: 0.95 },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                duration: 0.32,
                ease: [0.25, 0.46, 0.45, 0.94]
            }
        }
    };

    return (
        <motion.div
            className="relative min-h-screen w-full overflow-x-hidden"
            variants={backgroundVariants}
            initial="initial"
            animate="animate"
        >
            {/* Luxury animated background blobs */}
            <div className="fixed inset-0 pointer-events-none">
                <motion.div
                    className="absolute top-[10%] left-[5%] w-[30rem] h-[30rem] rounded-full"
                    style={{ background: 'radial-gradient(circle, hsl(var(--accent) / 0.15) 0%, transparent 70%)' }}
                    animate={{
                        x: [0, 30, 0],
                        y: [0, -20, 0],
                        scale: [1, 1.15, 1]
                    }}
                    transition={{
                        duration: 20,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    className="absolute bottom-[5%] right-[10%] w-[35rem] h-[35rem] rounded-full"
                    style={{ background: 'radial-gradient(circle, hsl(var(--secondary) / 0.12) 0%, transparent 70%)' }}
                    animate={{
                        x: [0, -40, 0],
                        y: [0, 30, 0],
                        scale: [1.1, 0.95, 1.1]
                    }}
                    transition={{
                        duration: 18,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    className="absolute top-[50%] left-[50%] w-[25rem] h-[25rem] rounded-full"
                    style={{ background: 'radial-gradient(circle, hsl(var(--primary) / 0.08) 0%, transparent 70%)' }}
                    animate={{
                        rotate: [0, 360],
                        scale: [0.9, 1.2, 0.9]
                    }}
                    transition={{
                        duration: 25,
                        repeat: Infinity,
                        ease: "linear"
                    }}
                />
            </div>

            {/* Main Content */}
            <div className="relative z-10">
                {/* Premium Header */}
                <motion.header
                    className="sticky top-0 z-50 backdrop-blur-xl bg-background/40 border-b border-border/20"
                    initial={{ y: -100 }}
                    animate={{ y: 0 }}
                    transition={{ duration: 0.32, ease: "easeOut" }}
                >
                    <div className="container mx-auto px-4 md:px-6 py-4 md:py-6">
                        <div className="flex items-center justify-between">
                            {/* Logo/Title */}
                            <motion.div
                                className="flex items-center gap-2 md:gap-3"
                                whileHover={{ scale: 1.02 }}
                                transition={{ duration: 0.32 }}
                            >
                                <Sparkles className="w-5 h-5 md:w-6 md:h-6 text-secondary" />
                                <h1 className="text-2xl md:text-3xl font-heading tracking-wider bg-gradient-to-r from-secondary via-accent to-secondary bg-clip-text text-transparent animate-gradient">
                                    {isMobile ? "LUXE" : "LUXURY GALLERY"}
                                </h1>
                            </motion.div>

                            {/* Controls */}
                            <div className="flex items-center gap-2 md:gap-4">
                                {/* Filter Pills - Desktop Only */}
                                {!isMobile && (
                                    <div className="flex gap-2 mr-4">
                                        {['all', 'FW24', 'SS24', 'Limited', 'Atelier'].map((f) => (
                                            <motion.button
                                                key={f}
                                                onClick={() => setFilter(f)}
                                                className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all duration-320 ${filter === f
                                                    ? 'bg-gradient-to-r from-secondary to-accent text-background'
                                                    : 'bg-card/60 hover:bg-card text-muted-foreground hover:text-foreground'
                                                    }`}
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                            >
                                                {f === 'all' ? 'All' : f}
                                            </motion.button>
                                        ))}
                                    </div>
                                )}

                                {/* View Toggle */}
                                <motion.button
                                    onClick={() => setViewMode(viewMode === 'grid' ? 'single' : 'grid')}
                                    className="p-2.5 md:p-3 rounded-xl bg-card/60 backdrop-blur-sm hover:bg-card border border-border/20 transition-all duration-320"
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                >
                                    {viewMode === 'grid' ?
                                        <Square className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground" /> :
                                        <Grid3X3 className="w-4 h-4 md:w-5 md:h-5 text-muted-foreground" />
                                    }
                                </motion.button>
                            </div>
                        </div>

                        {/* Mobile Filter Pills */}
                        {isMobile && (
                            <div className="flex gap-2 mt-3 overflow-x-auto scrollbar-hide pb-1">
                                {['all', 'FW24', 'SS24', 'Limited'].map((f) => (
                                    <motion.button
                                        key={f}
                                        onClick={() => setFilter(f)}
                                        className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-all duration-320 ${filter === f
                                            ? 'bg-gradient-to-r from-secondary to-accent text-background'
                                            : 'bg-card/60 text-muted-foreground'
                                            }`}
                                        whileTap={{ scale: 0.95 }}
                                    >
                                        {f === 'all' ? 'All' : f}
                                    </motion.button>
                                ))}
                            </div>
                        )}
                    </div>
                </motion.header>

                {/* Gallery Container */}
                <div className="container mx-auto px-4 md:px-6 py-6 md:py-12">
                    {viewMode === 'grid' ? (
                        <motion.div
                            className={`grid gap-3 md:gap-6 ${isMobile
                                ? 'grid-cols-2'
                                : 'grid-cols-2 lg:grid-cols-3 xl:grid-cols-4'
                                }`}
                            variants={gridVariants}
                            initial="hidden"
                            animate="visible"
                        >
                            {filteredItems.map((item, index) => (
                                <motion.div
                                    key={item.id}
                                    variants={itemVariants}
                                    className="group relative aspect-[3/4] cursor-pointer"
                                    onClick={() => setSelectedItem(item)}
                                    whileHover={{ scale: 1.02 }}
                                    transition={{ duration: 0.32 }}
                                >
                                    {/* Glass Card Container */}
                                    <div className="absolute inset-0 rounded-2xl md:rounded-3xl overflow-hidden bg-card/30 backdrop-blur-md border border-border/20 hover:border-accent/30 transition-all duration-320">
                                        {/* Image */}
                                        <div className="absolute inset-0">
                                            <img
                                                src={item.src}
                                                alt={sanitizeInput(item.alt)}
                                                className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                                                loading="lazy"
                                            />
                                            {/* Luxury Gradient Overlay */}
                                            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-320" />
                                        </div>

                                        {/* Content Overlay */}
                                        <div className="absolute inset-0 p-3 md:p-4 flex flex-col justify-between opacity-0 group-hover:opacity-100 transition-all duration-320">
                                            {/* Top Actions */}
                                            <div className="flex justify-end gap-2">
                                                <motion.button
                                                    onClick={(e) => toggleFavorite(item.id, e)}
                                                    className="p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-all duration-320"
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.9 }}
                                                >
                                                    <Heart
                                                        className={`w-4 h-4 transition-all duration-320 ${favorites.has(item.id)
                                                            ? 'fill-error text-error'
                                                            : 'text-muted-foreground hover:text-error'
                                                            }`}
                                                    />
                                                </motion.button>
                                                {!isMobile && (
                                                    <motion.button
                                                        onClick={(e) => handleShare(item, e)}
                                                        className="p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-all duration-320"
                                                        whileHover={{ scale: 1.1 }}
                                                        whileTap={{ scale: 0.9 }}
                                                    >
                                                        <Share2 className="w-4 h-4 text-muted-foreground hover:text-accent transition-colors duration-320" />
                                                    </motion.button>
                                                )}
                                            </div>

                                            {/* Bottom Info */}
                                            <div className="space-y-2">
                                                <div>
                                                    <p className="text-xs text-secondary font-medium">{item.collection}</p>
                                                    <h3 className="text-sm md:text-base font-medium text-foreground">{item.alt}</h3>
                                                </div>
                                                <div className="flex items-center justify-between">
                                                    <span className="text-lg md:text-xl font-bold bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
                                                        {item.price}
                                                    </span>
                                                    <motion.button
                                                        onClick={(e) => {
                                                            e.stopPropagation();
                                                            // Add to cart logic
                                                        }}
                                                        className="p-2 rounded-lg bg-gradient-to-r from-secondary to-accent hover:from-accent hover:to-secondary transition-all duration-320"
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                    >
                                                        <ShoppingBag className="w-4 h-4 text-background" />
                                                    </motion.button>
                                                </div>
                                            </div>
                                        </div>

                                        {/* Quick View Label */}
                                        <div className="absolute bottom-3 left-3 md:bottom-4 md:left-4 opacity-100 group-hover:opacity-0 transition-opacity duration-320">
                                            <span className="text-xs px-2 py-1 rounded-full bg-background/60 backdrop-blur-sm text-muted-foreground">
                                                {item.collection}
                                            </span>
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </motion.div>
                    ) : (
                        // Single View Mode - Carousel Style
                        <div className="relative h-[70vh] md:h-[80vh] flex items-center justify-center">
                            <AnimatePresence mode="wait">
                                {filteredItems.map((item, index) => (
                                    <motion.div
                                        key={item.id}
                                        className="absolute inset-0 flex items-center justify-center px-4"
                                        initial={{ opacity: 0, x: 100 }}
                                        animate={{ opacity: 1, x: 0 }}
                                        exit={{ opacity: 0, x: -100 }}
                                        transition={{ duration: 0.32 }}
                                        style={{ display: selectedItem?.id === item.id || (!selectedItem && index === 0) ? 'flex' : 'none' }}
                                    >
                                        <div className="relative w-full max-w-4xl aspect-[3/4] md:aspect-[16/10] rounded-3xl overflow-hidden bg-card/30 backdrop-blur-xl border border-border/20">
                                            <img
                                                src={item.src}
                                                alt={sanitizeInput(item.alt)}
                                                className="w-full h-full object-cover"
                                            />
                                            <div className="absolute inset-0 bg-gradient-to-t from-background/80 via-transparent to-transparent" />

                                            {/* Info Overlay */}
                                            <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                                                <div className="flex items-end justify-between">
                                                    <div>
                                                        <p className="text-secondary font-medium mb-2">{item.collection}</p>
                                                        <h2 className="text-2xl md:text-4xl font-heading mb-2">{item.alt}</h2>
                                                        <p className="text-3xl md:text-5xl font-bold bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
                                                            {item.price}
                                                        </p>
                                                    </div>
                                                    <motion.button
                                                        className="px-6 py-3 rounded-xl bg-gradient-to-r from-secondary to-accent text-background font-medium hover:from-accent hover:to-secondary transition-all duration-320"
                                                        whileHover={{ scale: 1.05 }}
                                                        whileTap={{ scale: 0.95 }}
                                                    >
                                                        <span className="flex items-center gap-2">
                                                            <ShoppingBag className="w-5 h-5" />
                                                            {isMobile ? "Buy" : "Add to Cart"}
                                                        </span>
                                                    </motion.button>
                                                </div>
                                            </div>
                                        </div>
                                    </motion.div>
                                ))}
                            </AnimatePresence>

                            {/* Navigation */}
                            <button
                                onClick={() => {
                                    const currentIndex = filteredItems.findIndex(item => item.id === (selectedItem?.id || filteredItems[0].id));
                                    const prevIndex = currentIndex === 0 ? filteredItems.length - 1 : currentIndex - 1;
                                    setSelectedItem(filteredItems[prevIndex]);
                                }}
                                className="absolute left-4 md:left-8 p-3 rounded-full bg-background/60 backdrop-blur-sm hover:bg-background border border-border/20 transition-all duration-320"
                            >
                                <ChevronLeft className="w-5 h-5 text-muted-foreground" />
                            </button>
                            <button
                                onClick={() => {
                                    const currentIndex = filteredItems.findIndex(item => item.id === (selectedItem?.id || filteredItems[0].id));
                                    const nextIndex = currentIndex === filteredItems.length - 1 ? 0 : currentIndex + 1;
                                    setSelectedItem(filteredItems[nextIndex]);
                                }}
                                className="absolute right-4 md:right-8 p-3 rounded-full bg-background/60 backdrop-blur-sm hover:bg-background border border-border/20 transition-all duration-320"
                            >
                                <ChevronRight className="w-5 h-5 text-muted-foreground" />
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Detail Modal */}
            <AnimatePresence>
                {selectedItem && viewMode === 'grid' && (
                    <motion.div
                        className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-xl"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedItem(null)}
                    >
                        <motion.div
                            className="relative w-full max-w-6xl h-[90vh] rounded-3xl overflow-hidden bg-card/60 backdrop-blur-xl border border-border/20"
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            transition={{ duration: 0.32 }}
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Close Button */}
                            <button
                                onClick={() => setSelectedItem(null)}
                                className="absolute top-4 right-4 z-10 p-2 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background transition-all duration-320"
                            >
                                <X className="w-5 h-5 text-muted-foreground" />
                            </button>

                            <div className="flex flex-col md:flex-row h-full">
                                {/* Image Section */}
                                <div className="flex-1 relative">
                                    <img
                                        src={selectedItem.src}
                                        alt={sanitizeInput(selectedItem.alt)}
                                        className="w-full h-full object-cover"
                                    />
                                </div>

                                {/* Info Section */}
                                <div className="w-full md:w-96 p-6 md:p-8 flex flex-col justify-between bg-gradient-to-b from-card/20 to-card/60">
                                    <div>
                                        <p className="text-secondary font-medium mb-2">{selectedItem.collection}</p>
                                        <h2 className="text-3xl md:text-4xl font-heading mb-4">{selectedItem.alt}</h2>
                                        <p className="text-muted-foreground mb-6">
                                            Exclusive piece from our {selectedItem.collection} collection.
                                            Crafted with precision and designed for the discerning individual.
                                        </p>

                                        <div className="space-y-4 mb-6">
                                            <div className="flex items-center justify-between py-3 border-b border-border/20">
                                                <span className="text-muted-foreground">Material</span>
                                                <span className="text-foreground">Premium Fabric</span>
                                            </div>
                                            <div className="flex items-center justify-between py-3 border-b border-border/20">
                                                <span className="text-muted-foreground">Collection</span>
                                                <span className="text-foreground">{selectedItem.collection}</span>
                                            </div>
                                            <div className="flex items-center justify-between py-3">
                                                <span className="text-muted-foreground">Price</span>
                                                <span className="text-2xl font-bold bg-gradient-to-r from-secondary to-accent bg-clip-text text-transparent">
                                                    {selectedItem.price}
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="space-y-3">
                                        <motion.button
                                            className="w-full py-4 rounded-xl bg-gradient-to-r from-secondary to-accent text-background font-medium hover:from-accent hover:to-secondary transition-all duration-320"
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                        >
                                            <span className="flex items-center justify-center gap-2">
                                                <ShoppingBag className="w-5 h-5" />
                                                Purchase Now
                                            </span>
                                        </motion.button>
                                        <div className="flex gap-3">
                                            <motion.button
                                                onClick={() => toggleFavorite(selectedItem.id, { stopPropagation: () => { } })}
                                                className="flex-1 py-3 rounded-xl bg-card/60 hover:bg-card border border-border/20 transition-all duration-320"
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <Heart className={`w-5 h-5 mx-auto ${favorites.has(selectedItem.id)
                                                    ? 'fill-error text-error'
                                                    : 'text-muted-foreground'
                                                    }`} />
                                            </motion.button>
                                            <motion.button
                                                onClick={() => handleShare(selectedItem, { stopPropagation: () => { } })}
                                                className="flex-1 py-3 rounded-xl bg-card/60 hover:bg-card border border-border/20 transition-all duration-320"
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                            >
                                                <Share2 className="w-5 h-5 mx-auto text-muted-foreground" />
                                            </motion.button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default GalleryPage;