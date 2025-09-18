import React, { useState, useCallback, useEffect, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    ShieldCheck,
    ShoppingBag,
    ArrowRight,
    Star,
    Clock,
    Users,
    Sparkles,
    Eye,
    Heart,
    Truck,
    Award,
    Lock,
    CheckCircle
} from "lucide-react";

const TRANS_DUR = 320;

// Enhanced input sanitization for security
function sanitizeInput(input = "", maxLen = 100) {
    let s = String(input).slice(0, maxLen);
    s = s.replace(/<[^>]*>/g, ""); // HTML tags
    s = s.replace(/https?:\/\/\S+/gi, ""); // URLs
    s = s.replace(/[\x00-\x1F\x7F]+/g, ""); // Control chars
    s = s.replace(/[<>'"&]/g, ""); // Dangerous chars
    return s.trim();
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;
const PHONE_RE = /^[\d\s\-\+\(\)]{10,15}$/;

// Mock preorder data - replace with real API
const PREORDER_ITEMS = [
    {
        id: 1,
        name: "Ethereal Flow Tee",
        price: 450000,
        originalPrice: 550000,
        image: "/api/placeholder/400/500",
        sizes: ["S", "M", "L", "XL"],
        stock: 25,
        maxStock: 50,
        estimatedShipping: "10-15 Dec 2025",
        rarity: "Limited Edition",
        description: "Premium cotton blend dengan liquid dynamics print"
    },
    {
        id: 2,
        name: "Shadow Weave Hoodie",
        price: 750000,
        originalPrice: 950000,
        image: "/api/placeholder/400/500",
        sizes: ["S", "M", "L", "XL", "XXL"],
        stock: 12,
        maxStock: 30,
        estimatedShipping: "15-20 Dec 2025",
        rarity: "Ultra Rare",
        description: "Premium fleece dengan embroidered details"
    },
    {
        id: 3,
        name: "Neon Genesis Cap",
        price: 250000,
        originalPrice: 320000,
        image: "/api/placeholder/400/500",
        sizes: ["One Size"],
        stock: 35,
        maxStock: 100,
        estimatedShipping: "5-10 Dec 2025",
        rarity: "Signature",
        description: "Structured cap dengan reflective accents"
    }
];

const DecorativeBlob = ({ className, gradientColors, animationDelay = 0, duration = 15 }) => (
    <motion.div
        aria-hidden="true"
        className={`absolute rounded-full blur-3xl pointer-events-none ${className}`}
        style={{
            background: `linear-gradient(135deg, ${gradientColors.join(', ')})`,
            opacity: 0.12
        }}
        animate={{
            scale: [1, 1.15, 1],
            rotate: [0, 180, 360],
            x: [0, 20, 0],
            y: [0, -10, 0]
        }}
        transition={{
            duration,
            repeat: Infinity,
            ease: "easeInOut",
            delay: animationDelay
        }}
    />
);

const ProductCard = ({ item, onSelect, isSelected }) => {
    const progressPercent = ((item.maxStock - item.stock) / item.maxStock) * 100;
    const isLowStock = item.stock <= 5;

    const rarityColors = {
        "Limited Edition": "from-secondary to-warning",
        "Ultra Rare": "from-error to-accent",
        "Signature": "from-info to-secondary"
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -6, scale: 1.02 }}
            viewport={{ once: true }}
            transition={{
                duration: 0.5,
                hover: { duration: 0.32 }
            }}
            className={`group cursor-pointer ${isSelected ? 'ring-2 ring-accent' : ''}`}
            onClick={() => onSelect(item)}
        >
            <div className="relative overflow-hidden rounded-3xl">
                {/* Glow effect */}
                <div className={`absolute -inset-1 rounded-3xl blur-xl transition-all duration-320 ${isSelected
                        ? 'bg-gradient-to-r from-accent/40 to-secondary/40 opacity-100'
                        : 'bg-gradient-to-r from-accent/20 to-secondary/20 opacity-0 group-hover:opacity-100'
                    }`} />

                <div className={`relative glass-card transition-all duration-320 overflow-hidden ${isSelected
                        ? 'border-accent/50 bg-card/80'
                        : 'border-border/50 group-hover:border-accent/30'
                    }`}>
                    {/* Image Area */}
                    <div className="relative h-64 bg-gradient-to-br from-card to-muted overflow-hidden">
                        {/* Placeholder content */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center space-y-3">
                                <motion.div
                                    animate={{ rotate: [0, 360] }}
                                    transition={{ duration: 12, repeat: Infinity, ease: "linear" }}
                                    className="mx-auto w-16 h-16 rounded-full bg-gradient-to-r from-accent to-secondary p-0.5"
                                >
                                    <div className="w-full h-full rounded-full bg-card flex items-center justify-center">
                                        <Eye className="w-6 h-6 text-accent" />
                                    </div>
                                </motion.div>
                                <div className="font-heading text-sm text-muted-foreground">PREVIEW</div>
                            </div>
                        </div>

                        {/* Rarity Badge */}
                        <div className="absolute top-4 left-4">
                            <div className={`px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r ${rarityColors[item.rarity]} text-white shadow-lg`}>
                                {item.rarity}
                            </div>
                        </div>

                        {/* Stock Warning */}
                        {isLowStock && (
                            <div className="absolute top-4 right-4">
                                <div className="px-3 py-1 rounded-full text-xs font-semibold bg-gradient-to-r from-error to-warning text-white shadow-lg animate-pulse">
                                    Only {item.stock} left!
                                </div>
                            </div>
                        )}

                        {/* Selection Indicator */}
                        <AnimatePresence>
                            {isSelected && (
                                <motion.div
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    exit={{ scale: 0 }}
                                    className="absolute bottom-4 right-4"
                                >
                                    <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center shadow-lg">
                                        <CheckCircle className="w-5 h-5 text-white" />
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </div>

                    {/* Content */}
                    <div className="p-6 space-y-4">
                        <div className="space-y-2">
                            <h3 className="font-heading text-xl text-foreground group-hover:text-accent transition-colors duration-320">
                                {item.name}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                {item.description}
                            </p>
                        </div>

                        {/* Price */}
                        <div className="flex items-center gap-3">
                            <span className="text-2xl font-heading text-secondary">
                                Rp {item.price.toLocaleString('id-ID')}
                            </span>
                            <span className="text-sm text-muted-foreground line-through">
                                Rp {item.originalPrice.toLocaleString('id-ID')}
                            </span>
                        </div>

                        {/* Stock Progress */}
                        <div className="space-y-2">
                            <div className="flex justify-between text-xs">
                                <span className="text-muted-foreground">Stock Progress</span>
                                <span className="text-accent font-medium">{Math.round(progressPercent)}% sold</span>
                            </div>
                            <div className="h-2 bg-muted rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0 }}
                                    whileInView={{ width: `${progressPercent}%` }}
                                    viewport={{ once: true }}
                                    transition={{ duration: 1.5 }}
                                    className="h-full bg-gradient-to-r from-accent to-secondary rounded-full"
                                />
                            </div>
                        </div>

                        {/* Shipping Info */}
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                            <Truck className="w-4 h-4" />
                            <span>Ships {item.estimatedShipping}</span>
                        </div>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

const PreorderForm = ({ selectedItem, onSubmit, isSubmitting }) => {
    const [form, setForm] = useState({
        name: "",
        email: "",
        phone: "",
        size: "",
        quantity: 1
    });
    const [errors, setErrors] = useState({});

    const handleChange = useCallback((e) => {
        const { name, value } = e.target;
        const sanitized = name === 'quantity' ? value : sanitizeInput(value);
        setForm(prev => ({ ...prev, [name]: sanitized }));

        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({ ...prev, [name]: "" }));
        }
    }, [errors]);

    const validateForm = useCallback(() => {
        const newErrors = {};

        if (!form.name) newErrors.name = "Name is required";
        if (!form.email) newErrors.email = "Email is required";
        else if (!EMAIL_RE.test(form.email)) newErrors.email = "Invalid email format";
        if (!form.phone) newErrors.phone = "Phone is required";
        else if (!PHONE_RE.test(form.phone)) newErrors.phone = "Invalid phone format";
        if (!form.size) newErrors.size = "Size selection is required";
        if (form.quantity < 1 || form.quantity > selectedItem?.stock) {
            newErrors.quantity = `Quantity must be between 1 and ${selectedItem?.stock}`;
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    }, [form, selectedItem]);

    const handleSubmit = useCallback((e) => {
        e.preventDefault();
        if (!validateForm()) return;
        onSubmit({ ...form, itemId: selectedItem.id });
    }, [form, selectedItem, validateForm, onSubmit]);

    if (!selectedItem) {
        return (
            <div className="glass-card p-8 text-center border-border/30">
                <div className="space-y-4">
                    <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-r from-muted to-card flex items-center justify-center">
                        <ShoppingBag className="w-8 h-8 text-muted-foreground" />
                    </div>
                    <div className="space-y-2">
                        <h3 className="font-heading text-xl text-foreground">Select an Item</h3>
                        <p className="text-sm text-muted-foreground">
                            Choose a product to start your preorder
                        </p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="space-y-6"
        >
            {/* Selected Item Summary */}
            <div className="glass-card p-6 border-accent/20">
                <div className="flex items-center gap-4">
                    <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-accent/20 to-secondary/20 flex items-center justify-center">
                        <Heart className="w-6 h-6 text-accent" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-heading text-lg text-foreground">{selectedItem.name}</h3>
                        <p className="text-sm text-muted-foreground">{selectedItem.description}</p>
                        <div className="mt-2 flex items-center gap-2">
                            <span className="text-xl font-heading text-secondary">
                                Rp {selectedItem.price.toLocaleString('id-ID')}
                            </span>
                            <span className="text-xs text-success bg-success/10 px-2 py-1 rounded-full">
                                Save Rp {(selectedItem.originalPrice - selectedItem.price).toLocaleString('id-ID')}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Form */}
            <div className="glass-card p-8 border-border/30">
                <div className="mb-6 text-center">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-accent/10 border border-accent/20 mb-4">
                        <Lock className="w-4 h-4 text-accent" />
                        <span className="text-sm font-medium text-accent">Secure Preorder</span>
                    </div>
                    <h2 className="font-heading text-2xl text-foreground">Complete Your Order</h2>
                    <p className="text-sm text-muted-foreground">Secure your spot in this exclusive drop</p>
                </div>

                <div onSubmit={handleSubmit} className="space-y-6">
                    {/* Personal Info */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Full Name</label>
                            <div className="relative group">
                                <input
                                    type="text"
                                    name="name"
                                    value={form.name}
                                    onChange={handleChange}
                                    maxLength={50}
                                    className={`w-full p-4 rounded-2xl bg-input/30 border transition-all duration-320 outline-none ${errors.name
                                            ? 'border-error focus:ring-2 focus:ring-error/20'
                                            : 'border-border group-focus-within:border-accent/50 focus:ring-2 focus:ring-accent/20'
                                        }`}
                                    placeholder="Enter your full name"
                                />
                                {errors.name && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-xs text-error mt-1"
                                    >
                                        {errors.name}
                                    </motion.p>
                                )}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Email</label>
                            <div className="relative group">
                                <input
                                    type="email"
                                    name="email"
                                    value={form.email}
                                    onChange={handleChange}
                                    maxLength={100}
                                    className={`w-full p-4 rounded-2xl bg-input/30 border transition-all duration-320 outline-none ${errors.email
                                            ? 'border-error focus:ring-2 focus:ring-error/20'
                                            : 'border-border group-focus-within:border-accent/50 focus:ring-2 focus:ring-accent/20'
                                        }`}
                                    placeholder="your@email.com"
                                />
                                {errors.email && (
                                    <motion.p
                                        initial={{ opacity: 0, y: -10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        className="text-xs text-error mt-1"
                                    >
                                        {errors.email}
                                    </motion.p>
                                )}
                            </div>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <label className="text-sm font-medium text-foreground">Phone Number</label>
                        <div className="relative group">
                            <input
                                type="tel"
                                name="phone"
                                value={form.phone}
                                onChange={handleChange}
                                maxLength={20}
                                className={`w-full p-4 rounded-2xl bg-input/30 border transition-all duration-320 outline-none ${errors.phone
                                        ? 'border-error focus:ring-2 focus:ring-error/20'
                                        : 'border-border group-focus-within:border-accent/50 focus:ring-2 focus:ring-accent/20'
                                    }`}
                                placeholder="+62 812 3456 7890"
                            />
                            {errors.phone && (
                                <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-xs text-error mt-1"
                                >
                                    {errors.phone}
                                </motion.p>
                            )}
                        </div>
                    </div>

                    {/* Product Options */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Size</label>
                            <select
                                name="size"
                                value={form.size}
                                onChange={handleChange}
                                className={`w-full p-4 rounded-2xl bg-input/30 border transition-all duration-320 outline-none ${errors.size
                                        ? 'border-error focus:ring-2 focus:ring-error/20'
                                        : 'border-border focus:border-accent/50 focus:ring-2 focus:ring-accent/20'
                                    }`}
                            >
                                <option value="">Select size</option>
                                {selectedItem.sizes.map(size => (
                                    <option key={size} value={size}>{size}</option>
                                ))}
                            </select>
                            {errors.size && (
                                <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-xs text-error mt-1"
                                >
                                    {errors.size}
                                </motion.p>
                            )}
                        </div>

                        <div className="space-y-2">
                            <label className="text-sm font-medium text-foreground">Quantity</label>
                            <input
                                type="number"
                                name="quantity"
                                value={form.quantity}
                                onChange={handleChange}
                                min="1"
                                max={selectedItem.stock}
                                className={`w-full p-4 rounded-2xl bg-input/30 border transition-all duration-320 outline-none ${errors.quantity
                                        ? 'border-error focus:ring-2 focus:ring-error/20'
                                        : 'border-border focus:border-accent/50 focus:ring-2 focus:ring-accent/20'
                                    }`}
                            />
                            {errors.quantity && (
                                <motion.p
                                    initial={{ opacity: 0, y: -10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    className="text-xs text-error mt-1"
                                >
                                    {errors.quantity}
                                </motion.p>
                            )}
                        </div>
                    </div>

                    {/* Total */}
                    <div className="p-6 rounded-2xl bg-gradient-to-r from-secondary/5 to-accent/5 border border-secondary/20">
                        <div className="flex justify-between items-center">
                            <span className="font-medium text-foreground">Total Amount</span>
                            <span className="text-2xl font-heading text-secondary">
                                Rp {(selectedItem.price * form.quantity).toLocaleString('id-ID')}
                            </span>
                        </div>
                        <p className="text-xs text-muted-foreground mt-2">
                            Estimated shipping: {selectedItem.estimatedShipping}
                        </p>
                    </div>

                    {/* Submit Button */}
                    <motion.button
                        type="submit"
                        disabled={isSubmitting}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={handleSubmit}
                        className="w-full btn-primary rounded-2xl px-8 py-4 font-semibold flex items-center justify-center gap-3 transition-all duration-320 disabled:opacity-60"
                    >
                        {isSubmitting ? (
                            <>
                                <motion.div
                                    animate={{ rotate: 360 }}
                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                    className="w-5 h-5 border-2 border-primary-foreground border-t-transparent rounded-full"
                                />
                                <span>Processing...</span>
                            </>
                        ) : (
                            <>
                                <ShoppingBag className="w-5 h-5" />
                                <span>Secure Preorder</span>
                                <ArrowRight className="w-5 h-5" />
                            </>
                        )}
                    </motion.button>

                    {/* Security Notice */}
                    <div className="flex items-center justify-center gap-2 text-sm text-success">
                        <ShieldCheck className="w-4 h-4" />
                        <span>Your data is secure and encrypted</span>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default function PreorderPage() {
    const [selectedItem, setSelectedItem] = useState(null);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [orderStatus, setOrderStatus] = useState(null);

    const handleSelectItem = useCallback((item) => {
        setSelectedItem(item);
    }, []);

    const handleSubmitOrder = useCallback(async (orderData) => {
        setIsSubmitting(true);
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsSubmitting(false);
        setOrderStatus({
            success: true,
            message: "✨ Preorder confirmed! We'll contact you soon.",
            orderId: `PO${Date.now()}`
        });
    }, []);

    return (
        <div className="relative min-h-screen overflow-hidden bg-background">
            {/* Enhanced Decorative Elements */}
            <DecorativeBlob
                className="-top-48 -left-48 w-96 h-96"
                gradientColors={['hsl(var(--accent))', 'transparent']}
                animationDelay={0}
                duration={18}
            />
            <DecorativeBlob
                className="-bottom-48 -right-48 w-[32rem] h-[32rem]"
                gradientColors={['hsl(var(--secondary))', 'hsl(var(--warning))', 'transparent']}
                animationDelay={3}
                duration={22}
            />
            <DecorativeBlob
                className="top-1/3 -left-32 w-72 h-72"
                gradientColors={['hsl(var(--info))', 'hsl(var(--accent))', 'transparent']}
                animationDelay={6}
                duration={20}
            />

            {/* Subtle pattern overlay */}
            <div className="absolute inset-0 bg-[radial-gradient(rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none" />

            <main className="relative container mx-auto px-4 lg:px-8 py-12 space-y-16">
                {/* Hero Section */}
                <section className="text-center space-y-8">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="space-y-6"
                    >
                        <div className="relative inline-block">
                            <motion.div
                                animate={{ scale: [1, 1.05, 1] }}
                                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
                                className="absolute -inset-6 bg-gradient-to-r from-accent/15 to-secondary/15 rounded-3xl blur-2xl"
                            />
                            <h1 className="relative text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-heading tracking-tight">
                                <span className="text-transparent bg-clip-text bg-gradient-to-br from-foreground via-accent to-secondary drop-shadow-sm">
                                    PREORDER
                                </span>
                                <br />
                                <span className="text-transparent bg-clip-text bg-gradient-to-br from-secondary via-warning to-accent drop-shadow-sm">
                                    EXCLUSIVE
                                </span>
                            </h1>
                        </div>

                        <motion.div
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="max-w-2xl mx-auto space-y-4"
                        >
                            <p className="text-lg md:text-xl text-muted-foreground">
                                Secure your spot in the next <span className="font-semibold text-secondary">Neo Dervish</span> drop
                            </p>
                            <div className="flex items-center justify-center gap-6 text-sm">
                                <div className="flex items-center gap-2 text-accent">
                                    <Users className="w-4 h-4" />
                                    <span>Limited Slots</span>
                                </div>
                                <div className="flex items-center gap-2 text-success">
                                    <Clock className="w-4 h-4" />
                                    <span>Early Access</span>
                                </div>
                                <div className="flex items-center gap-2 text-warning">
                                    <Award className="w-4 h-4" />
                                    <span>Exclusive Pricing</span>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                </section>

                {/* Products Grid */}
                <section className="space-y-12">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center space-y-4"
                    >
                        <h2 className="font-heading text-3xl md:text-4xl text-transparent bg-clip-text bg-gradient-to-r from-foreground to-accent">
                            Available for Preorder
                        </h2>
                        <p className="text-muted-foreground">
                            Limited quantities — secure yours before production begins
                        </p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                        {PREORDER_ITEMS.map((item, index) => (
                            <ProductCard
                                key={item.id}
                                item={item}
                                onSelect={handleSelectItem}
                                isSelected={selectedItem?.id === item.id}
                            />
                        ))}
                    </div>
                </section>

                {/* Preorder Form */}
                <section className="max-w-2xl mx-auto">
                    <AnimatePresence>
                        {orderStatus ? (
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                className="text-center space-y-6"
                            >
                                <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-r from-success to-accent p-1">
                                    <div className="w-full h-full rounded-full bg-card flex items-center justify-center">
                                        <CheckCircle className="w-12 h-12 text-success" />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <h3 className="font-heading text-2xl text-success">Order Confirmed!</h3>
                                    <p className="text-muted-foreground">{orderStatus.message}</p>
                                    <p className="text-sm text-accent">Order ID: {orderStatus.orderId}</p>
                                </div>

                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={() => {
                                        setOrderStatus(null);
                                        setSelectedItem(null);
                                    }}
                                    className="btn-accent rounded-2xl px-8 py-3 font-semibold"
                                >
                                    Place Another Order
                                </motion.button>
                            </motion.div>
                        ) : (
                            <PreorderForm
                                selectedItem={selectedItem}
                                onSubmit={handleSubmitOrder}
                                isSubmitting={isSubmitting}
                            />
                        )}
                    </AnimatePresence>
                </section>

                {/* Stats Section */}
                <section className="text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="grid grid-cols-1 md:grid-cols-3 gap-8"
                    >
                        <div className="glass-card p-6 border-accent/20">
                            <div className="space-y-3">
                                <div className="mx-auto w-12 h-12 rounded-full bg-gradient-to-r from-success to-accent flex items-center justify-center">
                                    <ShieldCheck className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="font-heading text-lg text-foreground">Secure Payment</h3>
                                <p className="text-sm text-muted-foreground">256-bit SSL encryption</p>
                            </div>
                        </div>

                        <div className="glass-card p-6 border-secondary/20">
                            <div className="space-y-3">
                                <div className="mx-auto w-12 h-12 rounded-full bg-gradient-to-r from-secondary to-warning flex items-center justify-center">
                                    <Truck className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="font-heading text-lg text-foreground">Fast Shipping</h3>
                                <p className="text-sm text-muted-foreground">Free express delivery</p>
                            </div>
                        </div>

                        <div className="glass-card p-6 border-info/20">
                            <div className="space-y-3">
                                <div className="mx-auto w-12 h-12 rounded-full bg-gradient-to-r from-info to-accent flex items-center justify-center">
                                    <Award className="w-6 h-6 text-white" />
                                </div>
                                <h3 className="font-heading text-lg text-foreground">Premium Quality</h3>
                                <p className="text-sm text-muted-foreground">Handcrafted excellence</p>
                            </div>
                        </div>
                    </motion.div>
                </section>

                {/* Footer CTA */}
                <section className="text-center">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="inline-flex items-center gap-4 glass-card px-8 py-4 rounded-full border-accent/20"
                    >
                        <div className="text-sm text-muted-foreground font-medium tracking-wider">
                            IN SOUL WE MOVE
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
                            className="btn-accent rounded-full px-6 py-2 text-sm font-semibold transition-all duration-320"
                        >
                            Back to Top
                        </motion.button>
                    </motion.div>
                </section>
            </main>
        </div>
    );
}