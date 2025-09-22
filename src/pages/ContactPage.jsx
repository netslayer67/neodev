import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Phone,
    Mail,
    Instagram,
    Twitter,
    Send,
    ChevronDown,
    MessageCircle,
    MapPin,
    Clock,
    Shield,
    Star,
    Sparkles,
    Check,
    AlertCircle,
    User,
    MessageSquare,
    Headphones,
    Award,
    Zap,
    ArrowRight,
    Globe,
    Heart,
    Crown
} from "lucide-react";

// Enhanced security with stricter validation
const sanitizeInput = (input, type = 'text') => {
    if (typeof input !== 'string') return '';

    let sanitized = input
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/vbscript:/gi, '')
        .replace(/data:/gi, '')
        .replace(/blob:/gi, '')
        .replace(/on\w+\s*=/gi, '')
        .replace(/style\s*=/gi, '')
        .replace(/[<>{}]/g, '')
        .replace(/[^\w\s@.-]/g, '')
        .trim();

    switch (type) {
        case 'email':
            return sanitized.toLowerCase().slice(0, 100);
        case 'name':
            return sanitized.replace(/[^\w\s\-']/g, '').slice(0, 50);
        case 'message':
            return sanitized.slice(0, 1000);
        default:
            return sanitized.slice(0, 200);
    }
};

const validateInput = (value, type) => {
    switch (type) {
        case 'email':
            return /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(value);
        case 'name':
            return value.length >= 2 && value.length <= 50;
        case 'message':
            return value.length >= 10 && value.length <= 1000;
        default:
            return value.length > 0;
    }
};

// Luxury form field component with enhanced liquid glass
const LuxuryFormField = ({ id, label, icon: Icon, type = 'text', as = 'input', validation, error, success, ...props }) => {
    const [focused, setFocused] = useState(false);
    const [value, setValue] = useState('');

    const handleChange = (e) => {
        const sanitized = sanitizeInput(e.target.value, type);
        setValue(sanitized);
        if (props.onChange) {
            e.target.value = sanitized;
            props.onChange(e);
        }
    };

    const isValid = value && validateInput(value, type);

    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 20 },
                show: { opacity: 1, y: 0, transition: { duration: 0.5 } }
            }}
            className="relative group"
        >
            <label htmlFor={id} className="flex items-center gap-2 text-sm font-semibold text-foreground/90 mb-3">
                {Icon && <Icon className="w-4 h-4 text-accent" />}
                {label}
                {validation?.required && <span className="text-error">*</span>}
            </label>

            <div className="relative">
                {as === 'textarea' ? (
                    <textarea
                        id={id}
                        value={value}
                        onChange={handleChange}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                        {...props}
                        className={`
                            w-full px-5 py-4 liquid-glass-strong text-foreground font-medium resize-none
                            border-2 transition-all duration-320 placeholder:text-muted-foreground/50
                            focus:outline-none focus:ring-0 focus:scale-[1.01] focus:shadow-2xl
                            ${error
                                ? 'border-error/60 focus:border-error shadow-xl shadow-error/20 bg-error/5'
                                : isValid
                                    ? 'border-success/60 focus:border-success shadow-xl shadow-success/20 bg-success/5'
                                    : focused
                                        ? 'border-accent/80 focus:border-accent shadow-2xl shadow-accent/30 bg-accent/5'
                                        : 'border-border/40 hover:border-accent/50 hover:shadow-lg hover:shadow-accent/10'
                            }
                        `}
                    />
                ) : (
                    <input
                        id={id}
                        type={type}
                        value={value}
                        onChange={handleChange}
                        onFocus={() => setFocused(true)}
                        onBlur={() => setFocused(false)}
                        {...props}
                        className={`
                            w-full px-5 py-4 liquid-glass-strong text-foreground font-medium
                            border-2 transition-all duration-320 placeholder:text-muted-foreground/50
                            focus:outline-none focus:ring-0 focus:scale-[1.01] focus:shadow-2xl
                            ${error
                                ? 'border-error/60 focus:border-error shadow-xl shadow-error/20 bg-error/5'
                                : isValid
                                    ? 'border-success/60 focus:border-success shadow-xl shadow-success/20 bg-success/5'
                                    : focused
                                        ? 'border-accent/80 focus:border-accent shadow-2xl shadow-accent/30 bg-accent/5'
                                        : 'border-border/40 hover:border-accent/50 hover:shadow-lg hover:shadow-accent/10'
                            }
                        `}
                    />
                )}

                {/* Enhanced status indicators */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: 180 }}
                            className="absolute right-4 top-1/2 -translate-y-1/2"
                        >
                            <div className="w-6 h-6 bg-error/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                <AlertCircle className="w-4 h-4 text-error" />
                            </div>
                        </motion.div>
                    )}
                    {isValid && !error && (
                        <motion.div
                            initial={{ scale: 0, rotate: -180 }}
                            animate={{ scale: 1, rotate: 0 }}
                            exit={{ scale: 0, rotate: 180 }}
                            className="absolute right-4 top-1/2 -translate-y-1/2"
                        >
                            <div className="w-6 h-6 bg-success/20 rounded-full flex items-center justify-center backdrop-blur-sm">
                                <Check className="w-4 h-4 text-success" />
                            </div>
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Character count */}
                {type === 'message' && (
                    <div className="absolute -bottom-6 right-2 text-xs text-muted-foreground/70">
                        <span className={value.length > 900 ? 'text-warning' : ''}>{value.length}</span>/1000
                    </div>
                )}

                {/* Luxury glow effect */}
                <div
                    className={`absolute inset-0 rounded-glass opacity-0 group-hover:opacity-100 transition-opacity duration-320 pointer-events-none ${focused ? 'opacity-100' : ''
                        }`}
                    style={{
                        background: focused
                            ? 'linear-gradient(135deg, hsl(var(--accent)/0.15), transparent)'
                            : 'linear-gradient(135deg, hsl(var(--accent)/0.08), transparent)',
                    }}
                />
            </div>

            {error && (
                <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-xs text-error font-medium flex items-center gap-1"
                >
                    <AlertCircle className="w-3 h-3" />
                    {error}
                </motion.p>
            )}
        </motion.div>
    );
};

// Enhanced FAQ component
const LuxuryFAQ = ({ faq, index }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 }}
            className="relative group"
        >
            <div className="liquid-glass-card border border-border/30 hover:border-accent/40 transition-all duration-320 overflow-hidden">
                <div className="relative p-6">
                    {/* Shimmer effect */}
                    <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/10 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100"
                        animate={{ x: ["-100%", "200%"] }}
                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 4 }}
                    />

                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex items-center justify-between w-full text-left group/button"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-accent/20 to-info/10 backdrop-blur-sm flex items-center justify-center">
                                <faq.icon className="w-5 h-5 text-accent" />
                            </div>
                            <h3 className="font-bold text-foreground group-hover/button:text-accent transition-colors duration-320">
                                {faq.question}
                            </h3>
                        </div>

                        <motion.div
                            animate={{ rotate: isOpen ? 180 : 0 }}
                            transition={{ duration: 0.32 }}
                            className="w-8 h-8 rounded-full bg-muted/10 group-hover/button:bg-accent/20 flex items-center justify-center transition-colors duration-320"
                        >
                            <ChevronDown className="w-4 h-4 text-muted-foreground group-hover/button:text-accent" />
                        </motion.div>
                    </button>

                    <AnimatePresence>
                        {isOpen && (
                            <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: "auto", opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.32 }}
                                className="overflow-hidden"
                            >
                                <div className="mt-4 ml-13 text-sm text-muted-foreground/90 leading-relaxed">
                                    {faq.answer}
                                </div>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
};

// Premium contact method card
const ContactMethodCard = ({ method, index }) => (
    <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1 }}
        whileHover={{ y: -12, transition: { duration: 0.32 } }}
        className="relative group cursor-pointer h-full"
    >
        <a href={method.action} className="block h-full">
            <div className="liquid-glass-card p-6 border-2 border-border/20 hover:border-accent/50 transition-all duration-320 overflow-hidden h-full">
                {/* Animated background */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-br from-accent/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-320"
                    animate={{
                        background: [
                            "linear-gradient(135deg, hsl(var(--accent)/0.05), transparent)",
                            "linear-gradient(225deg, hsl(var(--accent)/0.08), transparent)",
                            "linear-gradient(135deg, hsl(var(--accent)/0.05), transparent)",
                        ]
                    }}
                    transition={{ duration: 4, repeat: Infinity }}
                />

                {/* Luxury shimmer */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/15 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100"
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{ duration: 1.5, repeat: Infinity, repeatDelay: 3 }}
                />

                <div className="relative z-10 h-full flex flex-col">
                    <div className="flex items-start justify-between mb-4">
                        <div className={`w-14 h-14 rounded-2xl bg-gradient-to-br ${method.gradient} flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform duration-320`}>
                            <method.icon className="w-7 h-7 text-white" />
                        </div>

                        <div className="flex items-center gap-1">
                            <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                            <span className="text-xs text-success font-medium">Online</span>
                        </div>
                    </div>

                    <h3 className="font-bold text-xl text-foreground mb-2 group-hover:text-accent transition-colors duration-320">
                        {method.title}
                    </h3>

                    <p className="text-sm text-muted-foreground/80 mb-4 flex-grow">
                        {method.subtitle}
                    </p>

                    <div className="space-y-2">
                        <p className="font-semibold text-accent">
                            {method.value}
                        </p>

                        <div className="flex items-center gap-2 text-xs text-success font-medium">
                            <Clock className="w-3 h-3" />
                            {method.available}
                        </div>
                    </div>

                    <div className="flex items-center gap-2 mt-4 pt-3 border-t border-border/20">
                        <ArrowRight className="w-4 h-4 text-accent group-hover:translate-x-1 transition-transform duration-320" />
                        <span className="text-xs text-accent font-medium">Connect Now</span>
                    </div>
                </div>
            </div>
        </a>
    </motion.div>
);

const ContactPage = () => {
    const [isMobile, setIsMobile] = useState(false);
    const [formData, setFormData] = useState({ name: '', email: '', message: '' });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Enhanced mobile detection
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleInputChange = (field, value, type) => {
        const sanitized = sanitizeInput(value, type);
        setFormData(prev => ({ ...prev, [field]: sanitized }));

        if (sanitized && !validateInput(sanitized, type)) {
            setErrors(prev => ({ ...prev, [field]: getErrorMessage(field, type) }));
        } else {
            setErrors(prev => ({ ...prev, [field]: null }));
        }
    };

    const getErrorMessage = (field, type) => {
        const messages = {
            email: 'Please enter a valid email address',
            name: 'Name must be 2-50 characters',
            message: 'Message must be 10-1000 characters'
        };
        return messages[type] || 'This field is required';
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        const newErrors = {};
        Object.keys(formData).forEach(field => {
            const type = field === 'email' ? 'email' : field === 'name' ? 'name' : 'message';
            if (!formData[field] || !validateInput(formData[field], type)) {
                newErrors[field] = getErrorMessage(field, type);
            }
        });

        if (Object.keys(newErrors).length > 0) {
            setErrors(newErrors);
            return;
        }

        setIsSubmitting(true);
        await new Promise(resolve => setTimeout(resolve, 2000));
        setIsSubmitting(false);
        setIsSubmitted(true);
        setFormData({ name: '', email: '', message: '' });

        setTimeout(() => setIsSubmitted(false), 5000);
    };

    // Data
    const faqs = [
        {
            question: "How fast is luxury delivery?",
            answer: "Express delivery in 2-3 business days with premium packaging and white-glove service.",
            icon: Zap
        },
        {
            question: "Can I modify my exclusive order?",
            answer: "Yes, you can modify orders within 1 hour. Our concierge team handles all changes personally.",
            icon: Headphones
        },
        {
            question: "What's your authenticity guarantee?",
            answer: "Every piece comes with authenticity certification and lifetime quality assurance.",
            icon: Award
        },
        {
            question: "Do you offer private styling consultation?",
            answer: "Yes, complimentary styling sessions available for VIP members and orders above $500.",
            icon: Star
        }
    ];

    const contactMethods = [
        {
            icon: Phone,
            title: "VIP Hotline",
            subtitle: "Immediate luxury assistance",
            value: "+62 812 3456 7890",
            action: "tel:+6281234567890",
            gradient: "from-accent to-info",
            available: "24/7 Premium Support"
        },
        {
            icon: Mail,
            title: "Concierge Email",
            subtitle: "Personal service specialist",
            value: "concierge@atelier.luxury",
            action: "mailto:concierge@atelier.luxury",
            gradient: "from-secondary to-warning",
            available: "Response within 1 hour"
        },
        {
            icon: MessageCircle,
            title: "Live Chat",
            subtitle: "Instant connection",
            value: "Chat with specialist",
            action: "#",
            gradient: "from-success to-accent",
            available: "Online now"
        }
    ];

    return (
        <div className="relative min-h-screen  text-foreground overflow-hidden">
            {/* Enhanced animated background blobs */}
            <motion.div
                animate={{
                    x: [0, 150, -80, 0],
                    y: [0, -100, 60, 0],
                    scale: [1, 1.3, 0.8, 1],
                }}
                transition={{ duration: 32, repeat: Infinity, ease: "easeInOut" }}
                className="absolute -top-64 -left-64 w-128 h-128 bg-gradient-to-br from-accent/20 to-info/15 rounded-full blur-3xl"
            />
            <motion.div
                animate={{
                    x: [0, -120, 90, 0],
                    y: [0, 100, -70, 0],
                    scale: [1, 0.7, 1.4, 1],
                }}
                transition={{ duration: 38, repeat: Infinity, ease: "easeInOut", delay: 12 }}
                className="absolute top-1/4 -right-48 w-96 h-96 bg-gradient-to-br from-secondary/25 to-warning/15 rounded-full blur-3xl"
            />
            <motion.div
                animate={{
                    x: [0, 80, -60, 0],
                    y: [0, -50, 80, 0],
                    scale: [1, 1.2, 0.9, 1],
                }}
                transition={{ duration: 40, repeat: Infinity, ease: "easeInOut", delay: 20 }}
                className="absolute -bottom-48 left-1/3 w-80 h-80 bg-gradient-to-br from-success/20 to-accent/15 rounded-full blur-3xl"
            />

            <div className="relative z-10 min-h-screen pt-24 pb-24 px-4 sm:px-6 lg:px-8">
                <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ duration: 0.8 }}
                    className="max-w-7xl mx-auto"
                >
                    {/* Premium Header */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.8 }}
                        className="text-center mb-20"
                    >
                        <div className="inline-flex items-center gap-3 mb-8 px-6 py-3 liquid-glass-strong border border-accent/30">
                            <Crown className="w-5 h-5 text-accent" />
                            <span className="text-sm font-bold text-accent uppercase tracking-wider">
                                Premium Support
                            </span>
                            <Sparkles className="w-4 h-4 text-accent" />
                        </div>

                        <h1 className="text-5xl sm:text-6xl lg:text-8xl font-heading font-bold mb-8 leading-tight">
                            <span className="bg-gradient-to-r from-foreground via-accent to-secondary bg-clip-text text-transparent">
                                Let's Connect
                            </span>
                        </h1>

                        <p className="text-lg sm:text-xl text-muted-foreground/90 max-w-3xl mx-auto leading-relaxed mb-12">
                            Experience white-glove customer service. Our luxury specialists are here to elevate your experience.
                        </p>

                        {/* Enhanced trust indicators */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.4 }}
                            className="flex items-center justify-center gap-8 flex-wrap"
                        >
                            {[
                                { icon: Star, label: "5-Star Service", count: "24/7", color: "text-warning" },
                                { icon: Clock, label: "Response Time", count: "< 1hr", color: "text-accent" },
                                { icon: Heart, label: "Satisfaction", count: "99%", color: "text-success" }
                            ].map((stat, i) => (
                                <motion.div
                                    key={i}
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: 0.6 + i * 0.1, type: "spring" }}
                                    className="text-center px-4"
                                >
                                    <div className="flex items-center gap-2 justify-center mb-2">
                                        <stat.icon className={`w-5 h-5 ${stat.color}`} />
                                        <span className={`font-bold text-lg ${stat.color}`}>{stat.count}</span>
                                    </div>
                                    <p className="text-sm text-muted-foreground font-medium">{stat.label}</p>
                                </motion.div>
                            ))}
                        </motion.div>
                    </motion.div>

                    {/* Contact Methods Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
                        {contactMethods.map((method, index) => (
                            <ContactMethodCard key={index} method={method} index={index} />
                        ))}
                    </div>

                    {/* Main Content Grid */}
                    <div className="grid lg:grid-cols-3 gap-12 items-start">
                        {/* Contact Form */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="lg:col-span-2 relative group"
                        >
                            <div className="liquid-glass-card p-8 sm:p-12 border-2 border-border/20 hover:border-accent/40 transition-all duration-320 overflow-hidden">
                                {/* Enhanced background effects */}
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-br from-accent/5 via-transparent to-info/5 opacity-0 group-hover:opacity-100 transition-opacity duration-320"
                                    animate={{
                                        background: [
                                            "linear-gradient(135deg, hsl(var(--accent)/0.05), transparent, hsl(var(--info)/0.05))",
                                            "linear-gradient(225deg, hsl(var(--info)/0.05), transparent, hsl(var(--accent)/0.05))",
                                            "linear-gradient(135deg, hsl(var(--accent)/0.05), transparent, hsl(var(--info)/0.05))",
                                        ]
                                    }}
                                    transition={{ duration: 6, repeat: Infinity }}
                                />

                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/12 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100"
                                    animate={{ x: ["-100%", "200%"] }}
                                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 5 }}
                                />

                                <div className="relative z-10">
                                    <div className="flex items-center gap-4 mb-10">
                                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-accent/20 to-info/10 backdrop-blur-sm flex items-center justify-center">
                                            <MessageSquare className="w-7 h-7 text-accent" />
                                        </div>
                                        <div>
                                            <h2 className="text-3xl font-heading font-bold bg-gradient-to-r from-foreground to-accent bg-clip-text text-transparent">
                                                Send Message
                                            </h2>
                                            <p className="text-muted-foreground/80">Get personal assistance from our specialists</p>
                                        </div>
                                    </div>

                                    <AnimatePresence mode="wait">
                                        {!isSubmitted ? (
                                            <motion.form
                                                key="form"
                                                initial={{ opacity: 1 }}
                                                exit={{ opacity: 0, scale: 0.95 }}
                                                onSubmit={handleSubmit}
                                                className="space-y-8"
                                            >
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    className="space-y-8"
                                                >
                                                    <LuxuryFormField
                                                        id="name"
                                                        label="Full Name"
                                                        icon={User}
                                                        type="name"
                                                        placeholder="Your name..."
                                                        value={formData.name}
                                                        onChange={(e) => handleInputChange('name', e.target.value, 'name')}
                                                        error={errors.name}
                                                        validation={{ required: true }}
                                                    />

                                                    <LuxuryFormField
                                                        id="email"
                                                        label="Email Address"
                                                        icon={Mail}
                                                        type="email"
                                                        placeholder="your@email.com"
                                                        value={formData.email}
                                                        onChange={(e) => handleInputChange('email', e.target.value, 'email')}
                                                        error={errors.email}
                                                        validation={{ required: true }}
                                                    />

                                                    <LuxuryFormField
                                                        id="message"
                                                        label="Your Message"
                                                        icon={MessageCircle}
                                                        as="textarea"
                                                        type="message"
                                                        rows={6}
                                                        placeholder="Tell us how we can help you..."
                                                        value={formData.message}
                                                        onChange={(e) => handleInputChange('message', e.target.value, 'message')}
                                                        error={errors.message}
                                                        validation={{ required: true }}
                                                    />
                                                </motion.div>

                                                <motion.button
                                                    type="submit"
                                                    disabled={isSubmitting || Object.keys(errors).some(key => errors[key])}
                                                    whileHover={{ scale: 1.02, y: -2 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className="w-full py-5 px-8 rounded-glass font-bold text-lg bg-gradient-to-r from-accent to-info text-white shadow-2xl hover:shadow-accent/40 transition-all duration-320 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100 flex items-center justify-center gap-3 relative overflow-hidden group/btn"
                                                >
                                                    <motion.div
                                                        className="absolute inset-0 bg-gradient-to-r from-info to-accent opacity-0 group-hover/btn:opacity-100 transition-opacity duration-320"
                                                    />

                                                    <div className="relative z-10 flex items-center gap-3">
                                                        {isSubmitting ? (
                                                            <>
                                                                <motion.div
                                                                    className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full"
                                                                    animate={{ rotate: 360 }}
                                                                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                                />
                                                                Sending Message...
                                                            </>
                                                        ) : (
                                                            <>
                                                                <Send className="w-6 h-6" />
                                                                Send Message
                                                                <motion.div
                                                                    animate={{ x: [0, 4, 0] }}
                                                                    transition={{ duration: 2, repeat: Infinity }}
                                                                >
                                                                    <ArrowRight className="w-5 h-5" />
                                                                </motion.div>
                                                            </>
                                                        )}
                                                    </div>
                                                </motion.button>
                                            </motion.form>
                                        ) : (
                                            <motion.div
                                                key="success"
                                                initial={{ opacity: 0, scale: 0.8 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                transition={{ type: "spring", duration: 0.6 }}
                                                className="text-center py-16"
                                            >
                                                <motion.div
                                                    initial={{ scale: 0, rotate: -180 }}
                                                    animate={{ scale: 1, rotate: 0 }}
                                                    transition={{ delay: 0.2, type: "spring" }}
                                                    className="w-24 h-24 bg-gradient-to-br from-success to-accent rounded-full flex items-center justify-center mx-auto mb-8 shadow-2xl shadow-success/30"
                                                >
                                                    <Check className="w-12 h-12 text-white" />
                                                </motion.div>

                                                <motion.h3
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.4 }}
                                                    className="text-3xl font-heading font-bold text-success mb-4"
                                                >
                                                    Message Sent Successfully!
                                                </motion.h3>

                                                <motion.p
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.5 }}
                                                    className="text-muted-foreground/90 mb-8 text-lg"
                                                >
                                                    Our luxury specialists will respond within 1 hour.
                                                </motion.p>

                                                <motion.div
                                                    initial={{ opacity: 0, y: 20 }}
                                                    animate={{ opacity: 1, y: 0 }}
                                                    transition={{ delay: 0.6 }}
                                                    className="inline-flex items-center gap-3 px-6 py-3 liquid-glass-strong border border-accent/30"
                                                >
                                                    <Sparkles className="w-5 h-5 text-accent" />
                                                    <span className="text-accent font-medium">Premium support experience activated</span>
                                                    <Crown className="w-4 h-4 text-accent" />
                                                </motion.div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </motion.div>

                        {/* Right Sidebar - FAQ & Info */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="space-y-8"
                        >
                            {/* FAQ Section */}
                            <div>
                                <div className="text-center lg:text-left mb-8">
                                    <div className="flex items-center gap-3 justify-center lg:justify-start mb-4">
                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-secondary/20 to-warning/10 backdrop-blur-sm flex items-center justify-center">
                                            <MessageCircle className="w-6 h-6 text-secondary" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-heading font-bold">Frequently Asked</h2>
                                            <p className="text-sm text-muted-foreground/80">Quick answers to luxury service questions</p>
                                        </div>
                                    </div>
                                </div>

                                <div className="space-y-4">
                                    {faqs.map((faq, index) => (
                                        <LuxuryFAQ key={index} faq={faq} index={index} />
                                    ))}
                                </div>
                            </div>

                            {/* Location Info Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.7 }}
                                className="relative group"
                            >
                                <div className="liquid-glass-card p-6 border border-border/30 hover:border-accent/40 transition-all duration-320 overflow-hidden">
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-br from-info/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-320"
                                    />

                                    <div className="relative z-10">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-info/20 to-accent/10 backdrop-blur-sm flex items-center justify-center">
                                                <MapPin className="w-5 h-5 text-info" />
                                            </div>
                                            <h3 className="font-bold text-foreground text-lg">Visit Our Atelier</h3>
                                        </div>

                                        <div className="space-y-3 text-sm">
                                            <div className="liquid-glass border border-border/20 p-4 rounded-xl">
                                                <p className="font-semibold text-foreground mb-2">Luxury Flagship Store</p>
                                                <p className="text-muted-foreground/90">Jl. Sudirman No. 123</p>
                                                <p className="text-muted-foreground/90">Jakarta, Indonesia 12345</p>
                                            </div>

                                            <div className="flex items-center gap-3 pt-2">
                                                <Clock className="w-4 h-4 text-accent" />
                                                <span className="text-accent font-medium">By Appointment Only</span>
                                            </div>

                                            <div className="flex items-center gap-3">
                                                <Globe className="w-4 h-4 text-success" />
                                                <span className="text-success font-medium">Private Showroom Available</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Social Media Card */}
                            <motion.div
                                initial={{ opacity: 0, y: 20 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ delay: 0.8 }}
                                className="relative group"
                            >
                                <div className="liquid-glass-card p-6 border border-border/30 hover:border-accent/40 transition-all duration-320 overflow-hidden">
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-br from-secondary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-320"
                                    />

                                    <div className="relative z-10">
                                        <div className="flex items-center gap-3 mb-6">
                                            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary/20 to-warning/10 backdrop-blur-sm flex items-center justify-center">
                                                <Star className="w-5 h-5 text-secondary" />
                                            </div>
                                            <h3 className="font-bold text-foreground text-lg">Follow Our Journey</h3>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3">
                                            {[
                                                {
                                                    icon: Instagram,
                                                    label: '@atelier.luxury',
                                                    gradient: 'from-pink-500 to-purple-600',
                                                    followers: '50K+'
                                                },
                                                {
                                                    icon: Twitter,
                                                    label: '@AtelierLux',
                                                    gradient: 'from-blue-400 to-blue-600',
                                                    followers: '25K+'
                                                }
                                            ].map((social, i) => (
                                                <motion.a
                                                    key={i}
                                                    href="#"
                                                    whileHover={{ scale: 1.05, y: -2 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className={`p-4 rounded-2xl bg-gradient-to-r ${social.gradient} hover:shadow-xl hover:shadow-accent/20 transition-all duration-320 text-center group/social relative overflow-hidden`}
                                                >
                                                    <motion.div
                                                        className="absolute inset-0 bg-gradient-to-r from-white/10 to-transparent opacity-0 group-hover/social:opacity-100 transition-opacity duration-320"
                                                        animate={{ x: ["-100%", "200%"] }}
                                                        transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                                                    />

                                                    <div className="relative z-10">
                                                        <social.icon className="w-6 h-6 text-white mx-auto mb-2 group-hover/social:scale-110 transition-transform duration-320" />
                                                        <p className="text-xs text-white/90 font-bold mb-1">{social.label}</p>
                                                        <p className="text-xs text-white/70">{social.followers}</p>
                                                    </div>
                                                </motion.a>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Mobile Floating Actions */}
                    {isMobile && (
                        <motion.div
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 1.2 }}
                            className="fixed bottom-6 right-6 z-50 flex flex-col gap-3"
                        >
                            {[
                                {
                                    icon: Phone,
                                    action: "tel:+6281234567890",
                                    gradient: "from-accent to-info",
                                    delay: 0
                                },
                                {
                                    icon: Mail,
                                    action: "mailto:concierge@atelier.luxury",
                                    gradient: "from-secondary to-warning",
                                    delay: 0.1
                                },
                                {
                                    icon: MessageCircle,
                                    action: "#",
                                    gradient: "from-success to-accent",
                                    delay: 0.2
                                }
                            ].map(({ icon: Icon, action, gradient, delay }, i) => (
                                <motion.a
                                    key={i}
                                    href={action}
                                    animate={{
                                        y: [0, -8, 0],
                                        scale: [1, 1.05, 1]
                                    }}
                                    transition={{
                                        duration: 3 + delay,
                                        repeat: Infinity,
                                        ease: "easeInOut",
                                        delay: delay * 2
                                    }}
                                    whileHover={{ scale: 1.15, rotate: 5 }}
                                    whileTap={{ scale: 0.9 }}
                                    className={`w-16 h-16 rounded-2xl bg-gradient-to-r ${gradient} shadow-2xl backdrop-blur-xl flex items-center justify-center group/fab relative overflow-hidden`}
                                >
                                    <motion.div
                                        className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover/fab:opacity-100 transition-opacity duration-320"
                                        animate={{ rotate: [0, 360] }}
                                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                                    />

                                    <Icon className="w-7 h-7 text-white group-hover/fab:scale-110 transition-transform duration-320 relative z-10" />
                                </motion.a>
                            ))}
                        </motion.div>
                    )}

                    {/* Premium Footer */}
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 1 }}
                        className="text-center mt-24 pt-16 border-t border-border/30"
                    >
                        <motion.div
                            whileHover={{ scale: 1.05 }}
                            className="inline-flex items-center gap-3 px-8 py-4 liquid-glass-strong border border-border/40 hover:border-accent/50 transition-all duration-320 mb-8 group"
                        >
                            <Crown className="w-5 h-5 text-accent group-hover:rotate-12 transition-transform duration-320" />
                            <span className="text-sm font-bold text-muted-foreground group-hover:text-accent transition-colors duration-320">
                                Premium support experience since 2024
                            </span>
                            <Sparkles className="w-4 h-4 text-accent group-hover:scale-110 transition-transform duration-320" />
                        </motion.div>

                        <p className="text-muted-foreground/80 max-w-2xl mx-auto leading-relaxed">
                            Your satisfaction is our commitment. Experience luxury customer service that exceeds expectations.
                            <span className="block mt-2 text-accent font-medium">
                                "This is legit, premium brand vibes" - Every satisfied customer
                            </span>
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default ContactPage;