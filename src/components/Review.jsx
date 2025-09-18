import React, { useState, useRef, useEffect } from "react";
import { useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import { Star, MessageSquare, ShoppingBag, Send, Sparkles, Shield, ChevronDown } from "lucide-react";

// Enhanced security sanitization
const sanitizeInput = (val) => {
    if (!val) return "";
    return val
        .replace(/(<([^>]+)>)/gi, "")
        .replace(/(https?:\/\/[^\s]+)/gi, "")
        .replace(/javascript:/gi, "")
        .replace(/data:/gi, "")
        .replace(/vbscript:/gi, "")
        .replace(/on\w+=/gi, "")
        .replace(/script/gi, "")
        .slice(0, 500); // Limit length
};

// Decorative animated blobs
const DecorativeBlob = ({ className, delay = 0 }) => (
    <motion.div
        initial={{ scale: 0, rotate: 0 }}
        animate={{
            scale: [1, 1.2, 0.8, 1],
            rotate: [0, 90, 180, 360],
            x: [0, 20, -15, 0],
            y: [0, -10, 15, 0]
        }}
        transition={{
            duration: 20,
            repeat: Infinity,
            delay,
            ease: "easeInOut"
        }}
        className={`absolute rounded-full blur-xl opacity-30 ${className}`}
    />
);

const StarRating = ({ rating, setRating, isMobile }) => {
    const [hoverRating, setHoverRating] = useState(0);

    return (
        <div className="flex gap-1 sm:gap-2">
            {[1, 2, 3, 4, 5].map((star) => (
                <motion.button
                    key={star}
                    whileHover={{ scale: 1.15, rotateZ: 5 }}
                    whileTap={{ scale: 0.85 }}
                    transition={{ duration: 0.32, ease: "easeOut" }}
                    type="button"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star)}
                    className="focus:outline-none focus:ring-2 focus:ring-accent/50 rounded-full p-1"
                >
                    <Star
                        size={isMobile ? 24 : 28}
                        className={`cursor-pointer transition-all duration-320 ${star <= (hoverRating || rating)
                                ? "text-secondary fill-secondary drop-shadow-sm filter brightness-110"
                                : "text-muted-foreground hover:text-secondary/60"
                            }`}
                    />
                </motion.button>
            ))}
        </div>
    );
};

const CustomSelect = ({ products, value, onChange, isMobile }) => {
    const [isOpen, setIsOpen] = useState(false);
    const selectedProduct = products.find(p => p._id === value);

    return (
        <div className="relative">
            <motion.button
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => setIsOpen(!isOpen)}
                className="w-full p-3 sm:p-4 rounded-2xl bg-card/80 backdrop-blur-xl border border-border/60 text-foreground text-left flex items-center justify-between group hover:border-accent/40 hover:bg-card/90 transition-all duration-320 focus:outline-none focus:ring-2 focus:ring-accent/50"
            >
                <span className={isMobile ? "text-sm truncate pr-2" : ""}>{selectedProduct?.name}</span>
                <motion.div
                    animate={{ rotateZ: isOpen ? 180 : 0 }}
                    transition={{ duration: 0.32 }}
                >
                    <ChevronDown size={18} className="text-muted-foreground group-hover:text-accent transition-colors duration-320" />
                </motion.div>
            </motion.button>

            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.32, ease: "easeOut" }}
                        className="absolute top-full left-0 right-0 mt-2 bg-card/95 backdrop-blur-xl border border-border/60 rounded-2xl overflow-hidden shadow-2xl z-50"
                    >
                        {products.map((product, index) => (
                            <motion.button
                                key={product._id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.05 }}
                                type="button"
                                onClick={() => {
                                    onChange(product._id);
                                    setIsOpen(false);
                                }}
                                className={`w-full p-3 sm:p-4 text-left hover:bg-accent/10 transition-colors duration-320 ${isMobile ? "text-sm" : ""
                                    } ${value === product._id ? "bg-accent/20 text-accent" : "text-foreground"}`}
                            >
                                {product.name}
                            </motion.button>
                        ))}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

const ReviewManager = ({ products = [], onSubmit }) => {
    const { user } = useSelector((s) => s.auth);
    const [productId, setProductId] = useState(products?.[0]?._id || "");
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isMobile, setIsMobile] = useState(false);
    const formRef = useRef(null);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!productId || rating === 0 || !comment.trim() || isSubmitting) return;

        setIsSubmitting(true);

        try {
            await onSubmit({
                productId,
                rating,
                comment: sanitizeInput(comment.trim())
            });

            // Reset form with delay for better UX
            setTimeout(() => {
                setRating(0);
                setComment("");
                setIsSubmitting(false);
            }, 1000);

        } catch (error) {
            setIsSubmitting(false);
        }
    };

    const containerVariants = {
        hidden: { opacity: 0, y: 50 },
        visible: {
            opacity: 1,
            y: 0,
            transition: {
                duration: 0.8,
                ease: "easeOut",
                staggerChildren: 0.1
            }
        }
    };

    const itemVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: {
            opacity: 1,
            y: 0,
            transition: { duration: 0.5, ease: "easeOut" }
        }
    };

    return (
        <motion.div
            ref={formRef}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
            className="relative w-full max-w-2xl mx-auto"
        >
            {/* Decorative Background Blobs */}
            <DecorativeBlob
                className="w-32 h-32 bg-gradient-to-r from-accent to-secondary top-4 right-4"
                delay={0}
            />
            <DecorativeBlob
                className="w-24 h-24 bg-gradient-to-r from-secondary to-success bottom-8 left-2"
                delay={2}
            />
            <DecorativeBlob
                className="w-20 h-20 bg-gradient-to-r from-info to-warning top-1/2 right-8"
                delay={4}
            />

            {/* Main Container */}
            <motion.div
                variants={itemVariants}
                className="relative glass-card p-6 sm:p-8 lg:p-10 shadow-2xl overflow-hidden"
            >
                {/* Glassmorphism overlay */}
                <div className="absolute inset-0 bg-gradient-to-br from-card/60 via-card/40 to-transparent backdrop-blur-xl" />

                {/* Content */}
                <div className="relative space-y-6 sm:space-y-8">
                    {/* Premium Header */}
                    <motion.div variants={itemVariants} className="text-center sm:text-left">
                        <div className="flex items-center justify-center sm:justify-start gap-3 mb-2">
                            <motion.div
                                animate={{ rotate: [0, 5, -5, 0] }}
                                transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                                className="p-2 bg-gradient-to-r from-accent to-secondary rounded-xl"
                            >
                                <MessageSquare size={isMobile ? 20 : 24} className="text-white" />
                            </motion.div>
                            <h2 className="text-xl sm:text-2xl lg:text-3xl font-heading font-bold bg-gradient-to-r from-foreground via-secondary to-accent bg-clip-text text-transparent">
                                Share Your Experience
                            </h2>
                        </div>
                        <p className="text-muted-foreground text-xs sm:text-sm flex items-center justify-center sm:justify-start gap-1">
                            <Sparkles size={14} className="text-secondary" />
                            Help others discover quality
                        </p>
                    </motion.div>

                    {/* Premium Form */}
                    <div className="space-y-5 sm:space-y-6">
                        {/* User Name - Read Only with Premium Style */}
                        <motion.div variants={itemVariants}>
                            <label className="block text-xs sm:text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                                <Shield size={14} className="text-success" />
                                Verified User
                            </label>
                            <div className="relative">
                                <input
                                    type="text"
                                    value={user?.name || "Guest User"}
                                    readOnly
                                    className="w-full p-3 sm:p-4 rounded-2xl bg-card/60 backdrop-blur-xl border border-success/30 text-foreground cursor-not-allowed select-none text-sm sm:text-base"
                                />
                                <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                                    <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                                </div>
                            </div>
                        </motion.div>

                        {/* Product Selection */}
                        <motion.div variants={itemVariants}>
                            <label className="block text-xs sm:text-sm font-medium text-muted-foreground mb-2 flex items-center gap-2">
                                <ShoppingBag size={14} className="text-accent" />
                                Select Product
                            </label>
                            <CustomSelect
                                products={products}
                                value={productId}
                                onChange={setProductId}
                                isMobile={isMobile}
                            />
                        </motion.div>

                        {/* Rating Section */}
                        <motion.div variants={itemVariants}>
                            <label className="block text-xs sm:text-sm font-medium text-muted-foreground mb-3 flex items-center gap-2">
                                <Star size={14} className="text-secondary" />
                                Rate Your Experience
                            </label>
                            <div className="flex justify-center sm:justify-start">
                                <StarRating
                                    rating={rating}
                                    setRating={setRating}
                                    isMobile={isMobile}
                                />
                            </div>
                            {rating > 0 && (
                                <motion.p
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="text-xs text-center sm:text-left mt-2 text-muted-foreground"
                                >
                                    {rating === 5 ? "Excellent!" : rating >= 4 ? "Great!" : rating >= 3 ? "Good" : "Could be better"}
                                </motion.p>
                            )}
                        </motion.div>

                        {/* Comment Section */}
                        <motion.div variants={itemVariants}>
                            <label className="block text-xs sm:text-sm font-medium text-muted-foreground mb-2">
                                Your Review
                            </label>
                            <div className="relative">
                                <textarea
                                    rows={isMobile ? 3 : 4}
                                    placeholder="Share what you loved about this product..."
                                    value={comment}
                                    onChange={(e) => setComment(sanitizeInput(e.target.value))}
                                    className="w-full p-3 sm:p-4 rounded-2xl bg-card/60 backdrop-blur-xl border border-border/60 text-foreground placeholder-muted-foreground resize-none focus:outline-none focus:ring-2 focus:ring-accent/50 focus:border-accent/40 hover:border-secondary/40 transition-all duration-320 text-sm sm:text-base"
                                    required
                                    maxLength={500}
                                />
                                <div className="absolute bottom-2 right-2 text-xs text-muted-foreground">
                                    {comment.length}/500
                                </div>
                            </div>
                        </motion.div>

                        {/* Submit Button */}
                        <motion.div
                            variants={itemVariants}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                        >
                            <motion.button
                                type="submit"
                                disabled={!productId || rating === 0 || !comment.trim() || isSubmitting}
                                className="w-full py-3 sm:py-4 text-sm sm:text-base font-semibold rounded-2xl btn-primary hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-320 flex items-center justify-center gap-2 shadow-lg"
                            >
                                <AnimatePresence mode="wait">
                                    {isSubmitting ? (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="flex items-center gap-2"
                                        >
                                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                            Submitting...
                                        </motion.div>
                                    ) : (
                                        <motion.div
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            exit={{ opacity: 0 }}
                                            className="flex items-center gap-2"
                                        >
                                            <Send size={16} />
                                            Submit Review
                                        </motion.div>
                                    )}
                                </AnimatePresence>
                            </motion.button>
                        </motion.div>
                    </div>
                </div>
            </motion.div>
        </motion.div>
    );
};

export default ReviewManager;