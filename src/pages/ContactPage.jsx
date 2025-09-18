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
    Zap
} from "lucide-react";

// Enhanced input sanitization for security
const sanitizeInput = (input, type = 'text') => {
    if (typeof input !== 'string') return '';

    let sanitized = input
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
        .replace(/javascript:/gi, '')
        .replace(/vbscript:/gi, '')
        .replace(/data:/gi, '')
        .replace(/on\w+\s*=/gi, '')
        .replace(/style\s*=/gi, '')
        .replace(/[<>]/g, '')
        .trim();

    // Type-specific validation
    switch (type) {
        case 'email':
            sanitized = sanitized.toLowerCase().slice(0, 100);
            break;
        case 'name':
            sanitized = sanitized.replace(/[^\w\s\-']/g, '').slice(0, 50);
            break;
        case 'message':
            sanitized = sanitized.replace(/[<>{}]/g, '').slice(0, 1000);
            break;
        default:
            sanitized = sanitized.slice(0, 200);
    }

    return sanitized;
};

// Validation patterns
const validateInput = (value, type) => {
    switch (type) {
        case 'email':
            return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
        case 'name':
            return value.length >= 2 && value.length <= 50;
        case 'message':
            return value.length >= 10 && value.length <= 1000;
        default:
            return value.length > 0;
    }
};

// FAQ Data - Premium focused
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

// Contact methods with premium positioning
const contactMethods = [
    {
        icon: Phone,
        title: "VIP Hotline",
        subtitle: "Immediate assistance",
        value: "+62 812 3456 7890",
        action: "tel:+6281234567890",
        gradient: "from-accent to-info",
        available: "24/7 Premium Support"
    },
    {
        icon: Mail,
        title: "Concierge Email",
        subtitle: "Personal service",
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

// Animation variants
const containerVariants = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1,
            delayChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 30, scale: 0.95 },
    show: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: {
            duration: 0.6,
            ease: [0.25, 0.46, 0.45, 0.94]
        }
    }
};

const floatVariants = {
    animate: {
        y: [-10, 10, -10],
        transition: {
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut"
        }
    }
};

// Premium form field component
const LuxuryFormField = ({
    id,
    label,
    icon: Icon,
    type = 'text',
    as = 'input',
    validation,
    error,
    success,
    ...props
}) => {
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
        <motion.div variants={itemVariants} className="relative group">
            <label
                htmlFor={id}
                className="flex items-center gap-2 text-sm font-medium text-foreground/90 mb-3"
            >
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
                            w-full px-4 py-4 bg-gradient-to-br from-card/70 to-card/40 backdrop-blur-xl 
                            border-2 rounded-2xl transition-all duration-320 font-medium resize-none
                            placeholder:text-muted-foreground/60 placeholder:font-normal
                            focus:outline-none focus:ring-0
                            ${error
                                ? 'border-error/50 focus:border-error shadow-lg shadow-error/10'
                                : isValid
                                    ? 'border-success/50 focus:border-success shadow-lg shadow-success/10'
                                    : focused
                                        ? 'border-accent/60 focus:border-accent shadow-xl shadow-accent/20'
                                        : 'border-border/50 hover:border-border focus:border-accent'
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
                            w-full px-4 py-4 bg-gradient-to-br from-card/70 to-card/40 backdrop-blur-xl 
                            border-2 rounded-2xl transition-all duration-320 font-medium
                            placeholder:text-muted-foreground/60 placeholder:font-normal
                            focus:outline-none focus:ring-0
                            ${error
                                ? 'border-error/50 focus:border-error shadow-lg shadow-error/10'
                                : isValid
                                    ? 'border-success/50 focus:border-success shadow-lg shadow-success/10'
                                    : focused
                                        ? 'border-accent/60 focus:border-accent shadow-xl shadow-accent/20'
                                        : 'border-border/50 hover:border-border focus:border-accent'
                            }
                        `}
                    />
                )}

                {/* Status indicators */}
                <AnimatePresence>
                    {error && (
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            className="absolute right-3 top-1/2 -translate-y-1/2"
                        >
                            <AlertCircle className="w-5 h-5 text-error" />
                        </motion.div>
                    )}
                    {isValid && !error && (
                        <motion.div
                            initial={{ scale: 0, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0, opacity: 0 }}
                            className="absolute right-3 top-1/2 -translate-y-1/2"
                        >
                            <Check className="w-5 h-5 text-success" />
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* Character count for message */}
                {type === 'message' && (
                    <div className="absolute -bottom-6 right-2 text-xs text-muted-foreground">
                        {value.length}/1000
                    </div>
                )}

                {/* Glow effect */}
                <motion.div
                    className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-320 pointer-events-none"
                    style={{
                        background: focused
                            ? 'linear-gradient(135deg, hsl(var(--accent)/0.1), transparent)'
                            : 'linear-gradient(135deg, hsl(var(--accent)/0.05), transparent)',
                    }}
                />
            </div>

            {error && (
                <motion.p
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mt-2 text-xs text-error font-medium"
                >
                    {error}
                </motion.p>
            )}
        </motion.div>
    );
};

// FAQ Accordion Component
const LuxuryFAQ = ({ faq, index }) => {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <motion.div
            variants={itemVariants}
            className="relative group"
        >
            <div className="glass-card border border-border/30 hover:border-accent/30 transition-all duration-320 overflow-hidden">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-card/60 to-card/20 backdrop-blur-xl" />

                {/* Shimmer effect */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/5 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100"
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 4,
                    }}
                />

                <div className="relative z-10 p-6">
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="flex items-center justify-between w-full text-left group/button"
                    >
                        <div className="flex items-center gap-3">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-accent/20 to-info/20 flex items-center justify-center">
                                <faq.icon className="w-4 h-4 text-accent" />
                            </div>
                            <h3 className="font-semibold text-foreground group-hover/button:text-accent transition-colors duration-320">
                                {faq.question}
                            </h3>
                        </div>

                        <motion.div
                            animate={{ rotate: isOpen ? 180 : 0 }}
                            transition={{ duration: 0.32 }}
                            className="w-6 h-6 rounded-full bg-muted/20 group-hover/button:bg-accent/20 flex items-center justify-center transition-colors duration-320"
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
                                <p className="mt-4 ml-11 text-sm text-muted-foreground leading-relaxed">
                                    {faq.answer}
                                </p>
                            </motion.div>
                        )}
                    </AnimatePresence>
                </div>
            </div>
        </motion.div>
    );
};

// Contact method card
const ContactMethodCard = ({ method, index }) => (
    <motion.div
        variants={itemVariants}
        whileHover={{
            y: -8,
            transition: { duration: 0.32, ease: "easeOut" }
        }}
        className="relative group cursor-pointer"
    >
        <a href={method.action} className="block">
            <div className="glass-card p-6 border-2 border-border/30 hover:border-accent/40 transition-all duration-320 overflow-hidden h-full">
                {/* Background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-card/70 to-card/30 backdrop-blur-xl" />

                {/* Luxury shimmer */}
                <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/8 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100"
                    animate={{ x: ["-100%", "200%"] }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        repeatDelay: 3 + index,
                    }}
                />

                <div className="relative z-10">
                    <div className="flex items-start justify-between mb-4">
                        <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${method.gradient} flex items-center justify-center shadow-lg`}>
                            <method.icon className="w-6 h-6 text-white" />
                        </div>

                        <div className="w-2 h-2 bg-success rounded-full animate-pulse" />
                    </div>

                    <h3 className="font-bold text-lg text-foreground mb-1">
                        {method.title}
                    </h3>

                    <p className="text-sm text-muted-foreground mb-3">
                        {method.subtitle}
                    </p>

                    <p className="font-medium text-accent mb-2">
                        {method.value}
                    </p>

                    <p className="text-xs text-success font-medium">
                        {method.available}
                    </p>
                </div>
            </div>
        </a>
    </motion.div>
);

const ContactPage = () => {
    const [isMobile, setIsMobile] = useState(false);
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        message: ''
    });
    const [errors, setErrors] = useState({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isSubmitted, setIsSubmitted] = useState(false);

    // Detect mobile
    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleInputChange = (field, value, type) => {
        const sanitized = sanitizeInput(value, type);
        setFormData(prev => ({ ...prev, [field]: sanitized }));

        // Validate
        if (sanitized && !validateInput(sanitized, type)) {
            setErrors(prev => ({ ...prev, [field]: getErrorMessage(field, type) }));
        } else {
            setErrors(prev => ({ ...prev, [field]: null }));
        }
    };

    const getErrorMessage = (field, type) => {
        switch (type) {
            case 'email': return 'Please enter a valid email address';
            case 'name': return 'Name must be 2-50 characters';
            case 'message': return 'Message must be 10-1000 characters';
            default: return 'This field is required';
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Validate all fields
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

        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 2000));

        setIsSubmitting(false);
        setIsSubmitted(true);
        setFormData({ name: '', email: '', message: '' });

        // Reset after 5 seconds
        setTimeout(() => setIsSubmitted(false), 5000);
    };

    return (
        <div className="relative min-h-screen bg-gradient-to-br from-background via-background to-card/10 text-foreground overflow-hidden">
            {/* Animated Background Blobs */}
            <motion.div
                animate={{
                    x: [0, 120, 0],
                    y: [0, -60, 0],
                    scale: [1, 1.2, 1],
                }}
                transition={{
                    duration: 28,
                    repeat: Infinity,
                    ease: "easeInOut"
                }}
                className="absolute -top-48 -left-48 w-96 h-96 bg-gradient-to-br from-accent/25 to-info/20 rounded-full blur-3xl"
            />
            <motion.div
                animate={{
                    x: [0, -90, 0],
                    y: [0, 80, 0],
                    scale: [1, 0.8, 1],
                }}
                transition={{
                    duration: 35,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 10
                }}
                className="absolute top-1/3 -right-40 w-80 h-80 bg-gradient-to-br from-secondary/30 to-warning/20 rounded-full blur-3xl"
            />
            <motion.div
                animate={{
                    x: [0, 70, 0],
                    y: [0, -40, 0],
                    scale: [1, 1.1, 1],
                }}
                transition={{
                    duration: 32,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: 15
                }}
                className="absolute -bottom-32 left-1/4 w-72 h-72 bg-gradient-to-br from-success/25 to-accent/20 rounded-full blur-3xl"
            />

            <div className="relative z-10 min-h-screen pt-20 pb-20 px-4 sm:px-6 lg:px-8">
                <motion.div
                    variants={containerVariants}
                    initial="hidden"
                    animate="show"
                    className="max-w-7xl mx-auto"
                >
                    {/* Header */}
                    <motion.div variants={itemVariants} className="text-center mb-16">
                        <div className="inline-flex items-center gap-2 mb-6 px-4 py-2 rounded-full bg-gradient-to-r from-accent/10 to-info/10 border border-accent/20 backdrop-blur-xl">
                            <Shield className="w-4 h-4 text-accent" />
                            <span className="text-xs font-medium text-accent uppercase tracking-wider">
                                Premium Support
                            </span>
                        </div>

                        <h1 className="text-4xl sm:text-5xl lg:text-7xl font-heading font-bold mb-6">
                            <span className="bg-gradient-to-r from-foreground via-accent to-secondary bg-clip-text text-transparent">
                                Let's Connect
                            </span>
                        </h1>

                        <p className="text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed">
                            Experience white-glove customer service. Our luxury specialists are here to assist you.
                        </p>

                        {/* Trust indicators */}
                        <div className="flex items-center justify-center gap-6 mt-8">
                            {[
                                { icon: Star, label: "5-Star Service", count: "24/7" },
                                { icon: Clock, label: "Response Time", count: "< 1hr" },
                                { icon: Award, label: "Satisfaction", count: "99%" }
                            ].map((stat, i) => (
                                <motion.div
                                    key={i}
                                    variants={itemVariants}
                                    className="text-center"
                                >
                                    <div className="flex items-center gap-1 justify-center mb-1">
                                        <stat.icon className="w-4 h-4 text-accent" />
                                        <span className="font-bold text-accent">{stat.count}</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground">{stat.label}</p>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    {/* Contact Methods */}
                    <motion.div
                        variants={itemVariants}
                        className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
                    >
                        {contactMethods.map((method, index) => (
                            <ContactMethodCard key={index} method={method} index={index} />
                        ))}
                    </motion.div>

                    {/* Main Content Grid */}
                    <div className="grid lg:grid-cols-5 gap-12">
                        {/* Contact Form */}
                        <motion.div
                            variants={itemVariants}
                            className="lg:col-span-3 relative group"
                        >
                            <div className="glass-card p-8 sm:p-10 border-2 border-border/30 hover:border-accent/30 transition-all duration-320 overflow-hidden">
                                {/* Background effects */}
                                <div className="absolute inset-0 bg-gradient-to-br from-card/70 to-card/30 backdrop-blur-2xl" />

                                {/* Shimmer */}
                                <motion.div
                                    className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/8 to-transparent -skew-x-12 opacity-0 group-hover:opacity-100"
                                    animate={{ x: ["-100%", "200%"] }}
                                    transition={{
                                        duration: 2.5,
                                        repeat: Infinity,
                                        repeatDelay: 4,
                                    }}
                                />

                                <div className="relative z-10">
                                    <div className="flex items-center gap-3 mb-8">
                                        <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-accent/20 to-info/20 flex items-center justify-center">
                                            <MessageSquare className="w-6 h-6 text-accent" />
                                        </div>
                                        <div>
                                            <h2 className="text-2xl font-heading font-bold">Send Message</h2>
                                            <p className="text-sm text-muted-foreground">Get personal assistance from our specialists</p>
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

                                                <motion.button
                                                    type="submit"
                                                    disabled={isSubmitting || Object.keys(errors).some(key => errors[key])}
                                                    whileHover={{ scale: 1.02 }}
                                                    whileTap={{ scale: 0.98 }}
                                                    className="w-full py-4 px-6 rounded-2xl font-bold text-base bg-gradient-to-r from-accent to-info hover:shadow-2xl hover:shadow-accent/30 transition-all duration-320 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                                >
                                                    {isSubmitting ? (
                                                        <>
                                                            <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                                            Sending...
                                                        </>
                                                    ) : (
                                                        <>
                                                            <Send className="w-5 h-5" />
                                                            Send Message
                                                            <motion.div
                                                                animate={{ x: [0, 3, 0] }}
                                                                transition={{ duration: 1.5, repeat: Infinity }}
                                                            >
                                                                →
                                                            </motion.div>
                                                        </>
                                                    )}
                                                </motion.button>
                                            </motion.form>
                                        ) : (
                                            <motion.div
                                                key="success"
                                                initial={{ opacity: 0, scale: 0.9 }}
                                                animate={{ opacity: 1, scale: 1 }}
                                                className="text-center py-12"
                                            >
                                                <motion.div
                                                    initial={{ scale: 0 }}
                                                    animate={{ scale: 1 }}
                                                    transition={{ delay: 0.2, type: "spring" }}
                                                    className="w-20 h-20 bg-gradient-to-br from-success to-accent rounded-full flex items-center justify-center mx-auto mb-6"
                                                >
                                                    <Check className="w-10 h-10 text-white" />
                                                </motion.div>

                                                <h3 className="text-2xl font-bold text-success mb-2">Message Sent!</h3>
                                                <p className="text-muted-foreground mb-6">
                                                    Our luxury specialists will respond within 1 hour.
                                                </p>

                                                <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                                                    <Sparkles className="w-4 h-4 text-accent" />
                                                    <span>Premium support experience activated</span>
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </motion.div>

                        {/* FAQ Section */}
                        <motion.div
                            variants={itemVariants}
                            className="lg:col-span-2 space-y-6"
                        >
                            <div className="text-center lg:text-left mb-8">
                                <div className="flex items-center gap-3 justify-center lg:justify-start mb-4">
                                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary/20 to-warning/20 flex items-center justify-center">
                                        <MessageCircle className="w-5 h-5 text-secondary" />
                                    </div>
                                    <h2 className="text-2xl font-heading font-bold">Frequently Asked</h2>
                                </div>
                                <p className="text-muted-foreground">Quick answers to common luxury service questions</p>
                            </div>

                            <div className="space-y-4">
                                {faqs.map((faq, index) => (
                                    <LuxuryFAQ key={index} faq={faq} index={index} />
                                ))}
                            </div>

                            {/* Additional Info Card */}
                            <motion.div
                                variants={itemVariants}
                                className="relative group mt-8"
                            >
                                <div className="glass-card p-6 border border-border/30 hover:border-accent/30 transition-all duration-320 overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-card/60 to-card/20 backdrop-blur-xl" />

                                    <div className="relative z-10">
                                        <div className="flex items-center gap-3 mb-4">
                                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-info/20 to-accent/20 flex items-center justify-center">
                                                <MapPin className="w-4 h-4 text-info" />
                                            </div>
                                            <h3 className="font-semibold text-foreground">Visit Our Atelier</h3>
                                        </div>

                                        <div className="space-y-2 text-sm text-muted-foreground">
                                            <p className="font-medium text-foreground">Luxury Flagship Store</p>
                                            <p>Jl. Sudirman No. 123</p>
                                            <p>Jakarta, Indonesia 12345</p>

                                            <div className="flex items-center gap-2 mt-4 pt-4 border-t border-border/30">
                                                <Clock className="w-4 h-4 text-accent" />
                                                <span className="text-xs font-medium text-accent">By Appointment Only</span>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>

                            {/* Social Links */}
                            <motion.div
                                variants={itemVariants}
                                className="relative group"
                            >
                                <div className="glass-card p-6 border border-border/30 hover:border-accent/30 transition-all duration-320 overflow-hidden">
                                    <div className="absolute inset-0 bg-gradient-to-br from-card/60 to-card/20 backdrop-blur-xl" />

                                    <div className="relative z-10">
                                        <h3 className="font-semibold text-foreground mb-4">Follow Our Journey</h3>

                                        <div className="flex gap-3">
                                            {[
                                                { icon: Instagram, label: '@atelier.luxury', gradient: 'from-pink-500 to-purple-600' },
                                                { icon: Twitter, label: '@AtelierLux', gradient: 'from-blue-400 to-blue-600' }
                                            ].map((social, i) => (
                                                <motion.a
                                                    key={i}
                                                    href="#"
                                                    whileHover={{ scale: 1.1 }}
                                                    whileTap={{ scale: 0.95 }}
                                                    className={`flex-1 p-4 rounded-xl bg-gradient-to-r ${social.gradient} hover:shadow-lg hover:shadow-accent/20 transition-all duration-320 text-center group/social`}
                                                >
                                                    <social.icon className="w-5 h-5 text-white mx-auto mb-2 group-hover/social:scale-110 transition-transform duration-320" />
                                                    <p className="text-xs text-white/90 font-medium">{social.label}</p>
                                                </motion.a>
                                            ))}
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        </motion.div>
                    </div>

                    {/* Floating Contact Buttons - Mobile Only */}
                    {isMobile && (
                        <motion.div
                            initial={{ y: 100, opacity: 0 }}
                            animate={{ y: 0, opacity: 1 }}
                            transition={{ delay: 1 }}
                            className="fixed bottom-6 right-6 z-50 flex flex-col gap-3"
                        >
                            {[
                                { icon: Phone, action: "tel:+6281234567890", gradient: "from-accent to-info" },
                                { icon: Mail, action: "mailto:concierge@atelier.luxury", gradient: "from-secondary to-warning" },
                                { icon: MessageCircle, action: "#", gradient: "from-success to-accent" }
                            ].map(({ icon: Icon, action, gradient }, i) => (
                                <motion.a
                                    key={i}
                                    href={action}
                                    variants={floatVariants}
                                    animate="animate"
                                    style={{ animationDelay: `${i * 0.2}s` }}
                                    whileHover={{ scale: 1.1 }}
                                    whileTap={{ scale: 0.9 }}
                                    className={`w-14 h-14 rounded-full bg-gradient-to-r ${gradient} shadow-2xl backdrop-blur-xl flex items-center justify-center group`}
                                >
                                    <Icon className="w-6 h-6 text-white group-hover:scale-110 transition-transform duration-320" />
                                </motion.a>
                            ))}
                        </motion.div>
                    )}

                    {/* Premium Footer */}
                    <motion.div
                        variants={itemVariants}
                        className="text-center mt-20 pt-12 border-t border-border/30"
                    >
                        <div className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-card/60 to-card/40 backdrop-blur-xl border border-border/50 rounded-full mb-6">
                            <Sparkles className="w-4 h-4 text-accent" />
                            <span className="text-sm font-medium text-muted-foreground">
                                Premium support experience since 2024
                            </span>
                        </div>

                        <p className="text-sm text-muted-foreground max-w-md mx-auto">
                            Your satisfaction is our commitment. Experience luxury customer service that exceeds expectations.
                        </p>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
};

export default ContactPage;