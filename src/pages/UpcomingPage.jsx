import React, { useEffect, useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
    Clock, Mail, ArrowRight, Sparkles, Star, Shield, Eye,
    Zap, Crown, Gem, Rocket, ChevronUp
} from "lucide-react";

const TRANS_DUR = 320;
const TARGET_ISO = "2025-12-01T00:00:00";

// Enhanced countdown hook with performance optimization
function useCountdown(targetIso) {
    const target = useMemo(() => new Date(targetIso).getTime(), [targetIso]);
    const [time, setTime] = useState(() => calcTimeLeft(target));

    useEffect(() => {
        if (!target || Number.isNaN(target)) return;
        let frameId;

        const tick = () => {
            setTime(calcTimeLeft(target));
            frameId = requestAnimationFrame(tick);
        };

        tick();
        return () => cancelAnimationFrame(frameId);
    }, [target]);

    return time;
}

function calcTimeLeft(target) {
    const now = Date.now();
    const diff = Math.max(0, target - now);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
    const minutes = Math.floor((diff / (1000 * 60)) % 60);
    const seconds = Math.floor((diff / 1000) % 60);
    return { days, hours, minutes, seconds, done: diff === 0 };
}

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/i;

// Enhanced security sanitization
function sanitizeInput(input = "", maxLen = 254) {
    if (!input) return "";
    let s = String(input).slice(0, maxLen);
    s = s.replace(/<[^>]*>/g, "");
    s = s.replace(/https?:\/\/[^\s]+/gi, "");
    s = s.replace(/javascript:/gi, "");
    s = s.replace(/data:/gi, "");
    s = s.replace(/vbscript:/gi, "");
    s = s.replace(/on\w+=/gi, "");
    s = s.replace(/script/gi, "");
    s = s.replace(/[\x00-\x1F\x7F]+/g, "");
    return s.trim();
}

// Premium animated background blobs
const DecorativeBlob = ({ className, delay = 0, intensity = "low" }) => {
    const intensityMap = {
        low: "opacity-10",
        medium: "opacity-20",
        high: "opacity-30"
    };

    return (
        <motion.div
            className={`absolute rounded-full blur-3xl pointer-events-none ${intensityMap[intensity]} ${className}`}
            animate={{
                scale: [1, 1.3, 0.8, 1],
                rotate: [0, 90, 180, 270, 360],
                x: [0, 30, -20, 10, 0],
                y: [0, -20, 25, -10, 0]
            }}
            transition={{
                duration: 25,
                repeat: Infinity,
                ease: "easeInOut",
                delay
            }}
            style={{
                background: "linear-gradient(135deg, hsl(var(--accent)) 0%, hsl(var(--secondary)) 50%, transparent 100%)"
            }}
        />
    );
};

// Premium countdown unit with enhanced animations
const CountdownUnit = ({ value, label, index, isMobile }) => (
    <motion.div
        initial={{ opacity: 0, y: 40, rotateX: -90 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{
            duration: 0.8,
            delay: index * 0.15,
            type: "spring",
            stiffness: 200,
            damping: 20
        }}
        className="group perspective-1000"
    >
        <div className="relative transform-gpu">
            {/* Enhanced glow effect */}
            <motion.div
                className="absolute -inset-2 rounded-3xl blur-xl"
                style={{
                    background: "linear-gradient(135deg, hsl(var(--accent)/0.3), hsl(var(--secondary)/0.3))"
                }}
                animate={{
                    opacity: [0.3, 0.6, 0.3],
                    scale: [1, 1.05, 1]
                }}
                transition={{
                    duration: 3,
                    repeat: Infinity,
                    delay: index * 0.2
                }}
            />

            <motion.div
                whileHover={{
                    scale: 1.05,
                    rotateY: 5,
                    transition: { duration: 0.32 }
                }}
                className="relative glass-card border-accent/30 hover:border-accent/60 transition-all duration-320"
                style={{
                    padding: isMobile ? "1.25rem 1rem" : "2rem 1.5rem",
                    minWidth: isMobile ? "80px" : "120px"
                }}
            >
                <AnimatePresence mode="wait">
                    <motion.div
                        key={value}
                        initial={{ y: -30, opacity: 0, rotateX: 90 }}
                        animate={{ y: 0, opacity: 1, rotateX: 0 }}
                        exit={{ y: 30, opacity: 0, rotateX: -90 }}
                        transition={{
                            duration: 0.4,
                            type: "spring",
                            stiffness: 300
                        }}
                        className={`font-heading font-bold text-transparent bg-clip-text ${isMobile ? "text-3xl" : "text-5xl"
                            }`}
                        style={{
                            backgroundImage: "linear-gradient(135deg, hsl(var(--foreground)), hsl(var(--accent)), hsl(var(--secondary)))"
                        }}
                    >
                        {String(value).padStart(2, "0")}
                    </motion.div>
                </AnimatePresence>

                {/* Subtle particle effects */}
                <motion.div
                    className="absolute top-2 right-2 w-1 h-1 rounded-full bg-accent"
                    animate={{
                        opacity: [0, 1, 0],
                        scale: [0.5, 1, 0.5]
                    }}
                    transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: index * 0.3
                    }}
                />
            </motion.div>
        </div>

        <motion.div
            className="text-center mt-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: index * 0.15 + 0.5 }}
        >
            <div className={`font-medium text-muted-foreground tracking-widest ${isMobile ? "text-xs" : "text-sm"
                }`}>
                {label}
            </div>
        </motion.div>
    </motion.div>
);

// Premium preview card with enhanced luxury design
const PreviewCard = ({ index, isMobile }) => {
    const designs = [
        {
            title: "Ethereal Flow",
            concept: "Liquid dynamics meets structured form",
            rarity: "Ultra Rare",
            status: "90%",
            icon: Crown
        },
        {
            title: "Shadow Weave",
            concept: "Dark luxury with golden accents",
            rarity: "Limited",
            status: "85%",
            icon: Gem
        },
        {
            title: "Neon Genesis",
            concept: "Future-forward streetwear essence",
            rarity: "Exclusive",
            status: "95%",
            icon: Zap
        },
        {
            title: "Minimal Reign",
            concept: "Clean lines, maximum impact",
            rarity: "Signature",
            status: "80%",
            icon: Shield
        },
        {
            title: "Urban Mystic",
            concept: "Street meets spiritual journey",
            rarity: "Collector",
            status: "88%",
            icon: Sparkles
        },
        {
            title: "Void Walker",
            concept: "Beyond dimensions fashion",
            rarity: "Legendary",
            status: "92%",
            icon: Rocket
        }
    ];

    const design = designs[index] || designs[0];
    const IconComponent = design.icon;

    const rarityStyles = {
        "Ultra Rare": "from-error via-warning to-secondary",
        "Limited": "from-secondary via-accent to-info",
        "Exclusive": "from-accent via-info to-success",
        "Signature": "from-info via-secondary to-accent",
        "Collector": "from-warning via-error to-secondary",
        "Legendary": "from-accent via-secondary via-warning to-error"
    };

    return (
        <motion.article
            initial={{ opacity: 0, y: 60, rotateX: -15 }}
            whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
            whileHover={{
                y: -12,
                scale: 1.02,
                rotateY: 2,
                transition: { duration: 0.32, ease: "easeOut" }
            }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{
                duration: 0.7,
                delay: index * 0.15,
                type: "spring",
                stiffness: 200
            }}
            className="group cursor-pointer transform-gpu"
        >
            <div className="relative">
                {/* Premium glow effect */}
                <motion.div
                    className="absolute -inset-1 rounded-3xl blur-xl opacity-0 group-hover:opacity-100 transition-all duration-320"
                    style={{
                        background: `linear-gradient(135deg, hsl(var(--accent)/0.4), hsl(var(--secondary)/0.4))`
                    }}
                />

                <div className="relative glass-card border-border/40 group-hover:border-accent/50 transition-all duration-320 overflow-hidden">
                    {/* Preview area with enhanced design */}
                    <div
                        className="relative overflow-hidden"
                        style={{ height: isMobile ? "200px" : "280px" }}
                    >
                        {/* Dynamic gradient background */}
                        <motion.div
                            className="absolute inset-0 opacity-60"
                            style={{
                                background: `linear-gradient(135deg, hsl(var(--card)), hsl(var(--muted)/0.8), hsl(var(--card)))`
                            }}
                            animate={{
                                backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"]
                            }}
                            transition={{
                                duration: 8,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                        />

                        {/* Animated pattern overlay */}
                        <div className="absolute inset-0 opacity-20">
                            <motion.div
                                className="absolute top-6 left-6 w-8 h-8 border-2 border-accent/40 rounded-full"
                                animate={{ rotate: 360, scale: [1, 1.2, 1] }}
                                transition={{ duration: 4, repeat: Infinity }}
                            />
                            <motion.div
                                className="absolute bottom-6 right-6 w-6 h-6 border-2 border-secondary/50 rounded-full"
                                animate={{ rotate: -360, scale: [1, 0.8, 1] }}
                                transition={{ duration: 5, repeat: Infinity, delay: 1 }}
                            />
                            <motion.div
                                className="absolute top-1/2 left-1/2 w-12 h-12 border border-info/30 rounded-full -translate-x-1/2 -translate-y-1/2"
                                animate={{ rotate: 180, scale: [1, 1.1, 1] }}
                                transition={{ duration: 6, repeat: Infinity, delay: 2 }}
                            />
                        </div>

                        {/* Center preview content */}
                        <div className="absolute inset-0 flex items-center justify-center">
                            <div className="text-center space-y-4">
                                <motion.div
                                    animate={{ rotate: [0, 360] }}
                                    transition={{
                                        duration: 12,
                                        repeat: Infinity,
                                        ease: "linear"
                                    }}
                                    className="mx-auto w-16 h-16 rounded-2xl p-0.5"
                                    style={{
                                        background: `linear-gradient(135deg, hsl(var(--accent)), hsl(var(--secondary)))`
                                    }}
                                >
                                    <div className="w-full h-full rounded-2xl bg-card/80 backdrop-blur-sm flex items-center justify-center">
                                        <IconComponent className="w-7 h-7 text-accent" />
                                    </div>
                                </motion.div>

                                <div className="space-y-2">
                                    <div className="font-heading text-lg text-accent tracking-wide">
                                        PREVIEW
                                    </div>
                                    <div className="text-xs text-muted-foreground font-medium">
                                        Design {index + 1}
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Rarity badge with enhanced styling */}
                        <div className="absolute top-4 right-4">
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className={`px-4 py-2 rounded-2xl text-xs font-bold text-white shadow-2xl backdrop-blur-sm border border-white/20`}
                                style={{
                                    background: `linear-gradient(135deg, ${rarityStyles[design.rarity].split(' ').map(color => `hsl(var(--${color.replace('from-', '').replace('via-', '').replace('to-', '')}))`).join(', ')})`
                                }}
                            >
                                {design.rarity}
                            </motion.div>
                        </div>
                    </div>

                    {/* Enhanced content section */}
                    <div className="p-6 space-y-5">
                        <div className="flex items-start justify-between gap-4">
                            <div className="space-y-3 flex-1">
                                <h3 className="font-heading text-xl text-foreground group-hover:text-accent transition-colors duration-320 tracking-wide">
                                    {design.title}
                                </h3>
                                <p className="text-sm text-muted-foreground leading-relaxed">
                                    {design.concept}
                                </p>
                            </div>

                            <motion.div
                                whileHover={{
                                    scale: 1.15,
                                    rotate: 90,
                                    transition: { duration: 0.32 }
                                }}
                                className="p-3 rounded-2xl border border-accent/30 group-hover:border-accent/60 group-hover:bg-accent/10 transition-all duration-320"
                                style={{
                                    background: "linear-gradient(135deg, hsl(var(--accent)/0.05), hsl(var(--secondary)/0.05))"
                                }}
                            >
                                <ArrowRight className="w-5 h-5 text-accent" />
                            </motion.div>
                        </div>

                        {/* Enhanced progress section */}
                        <div className="space-y-3">
                            <div className="flex justify-between items-center text-sm">
                                <span className="text-muted-foreground font-medium">Development</span>
                                <span className="text-accent font-bold">{design.status}</span>
                            </div>

                            <div className="relative h-2 bg-muted/50 rounded-full overflow-hidden">
                                <motion.div
                                    initial={{ width: 0, x: "-100%" }}
                                    whileInView={{
                                        width: design.status,
                                        x: 0
                                    }}
                                    viewport={{ once: true }}
                                    transition={{
                                        duration: 1.5,
                                        delay: index * 0.2,
                                        ease: "easeOut"
                                    }}
                                    className="h-full rounded-full relative"
                                    style={{
                                        background: `linear-gradient(90deg, hsl(var(--accent)), hsl(var(--secondary)))`
                                    }}
                                >
                                    {/* Animated shine effect */}
                                    <motion.div
                                        className="absolute inset-0 rounded-full"
                                        style={{
                                            background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)"
                                        }}
                                        animate={{ x: ["-100%", "100%"] }}
                                        transition={{
                                            duration: 2,
                                            repeat: Infinity,
                                            repeatDelay: 3
                                        }}
                                    />
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </motion.article>
    );
};

export default function UpcomingPage({ targetIso = TARGET_ISO }) {
    const timeLeft = useCountdown(targetIso);
    const [email, setEmail] = useState("");
    const [status, setStatus] = useState({ ok: null, msg: "" });
    const [submitting, setSubmitting] = useState(false);
    const [lastSubmit, setLastSubmit] = useState(0);
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768);
        checkMobile();
        window.addEventListener('resize', checkMobile);
        return () => window.removeEventListener('resize', checkMobile);
    }, []);

    const handleChange = useCallback((e) => {
        const sanitized = sanitizeInput(e.target.value);
        setEmail(sanitized);
        if (status.msg) setStatus({ ok: null, msg: "" });
    }, [status.msg]);

    const handleSubscribe = useCallback((e) => {
        e?.preventDefault();
        if (submitting) return;

        const now = Date.now();
        if (now - lastSubmit < 5000) {
            setStatus({ ok: false, msg: "Please wait before trying again" });
            return;
        }

        const cleanEmail = sanitizeInput(email);
        if (!cleanEmail) {
            setStatus({ ok: false, msg: "Please enter your email" });
            return;
        }
        if (!EMAIL_RE.test(cleanEmail)) {
            setStatus({ ok: false, msg: "Please enter a valid email address" });
            return;
        }

        setSubmitting(true);
        setLastSubmit(now);

        // Simulate API call
        setTimeout(() => {
            setSubmitting(false);
            setStatus({ ok: true, msg: "Welcome to the exclusive list!" });
            setEmail("");
        }, 1500);
    }, [email, lastSubmit, submitting]);

    const scrollToTop = useCallback(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    }, []);

    return (
        <div className="relative min-h-screen overflow-hidden bg-background">
            {/* Enhanced decorative elements */}
            <DecorativeBlob
                className="w-[400px] h-[400px] -top-48 -left-48"
                delay={0}
                intensity="low"
            />
            <DecorativeBlob
                className="w-[500px] h-[500px] -bottom-60 -right-60"
                delay={3}
                intensity="medium"
            />
            <DecorativeBlob
                className="w-[300px] h-[300px] top-1/4 -left-32"
                delay={6}
                intensity="low"
            />
            <DecorativeBlob
                className="w-[200px] h-[200px] top-3/4 right-1/4"
                delay={9}
                intensity="high"
            />

            {/* Subtle grid overlay */}
            <div
                className="absolute inset-0 pointer-events-none opacity-[0.02]"
                style={{
                    backgroundImage: `linear-gradient(hsl(var(--accent)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--accent)) 1px, transparent 1px)`,
                    backgroundSize: "60px 60px"
                }}
            />

            <main className="relative container mx-auto px-4 lg:px-8 py-8 sm:py-16">
                {/* HERO SECTION */}
                <section className="text-center space-y-8 sm:space-y-12 mb-16 sm:mb-24">
                    <motion.div
                        initial={{ opacity: 0, y: 50 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                        className="space-y-6 sm:space-y-8"
                    >
                        <div className="relative inline-block">
                            <motion.div
                                animate={{
                                    scale: [1, 1.05, 1],
                                    opacity: [0.5, 0.8, 0.5]
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                                className="absolute -inset-8 rounded-full blur-3xl"
                                style={{
                                    background: "linear-gradient(135deg, hsl(var(--accent)/0.3), hsl(var(--secondary)/0.3))"
                                }}
                            />

                            <h1 className="relative font-heading tracking-tight leading-none">
                                <motion.span
                                    className="block text-transparent bg-clip-text drop-shadow-sm"
                                    style={{
                                        fontSize: isMobile ? "3.5rem" : "clamp(4rem, 12vw, 8rem)",
                                        backgroundImage: "linear-gradient(135deg, hsl(var(--foreground)), hsl(var(--accent)), hsl(var(--secondary)))"
                                    }}
                                    animate={{
                                        backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                                    }}
                                    transition={{
                                        duration: 8,
                                        repeat: Infinity,
                                        ease: "linear"
                                    }}
                                >
                                    COMING
                                </motion.span>
                                <motion.span
                                    className="block text-transparent bg-clip-text drop-shadow-sm"
                                    style={{
                                        fontSize: isMobile ? "3.5rem" : "clamp(4rem, 12vw, 8rem)",
                                        backgroundImage: "linear-gradient(135deg, hsl(var(--secondary)), hsl(var(--warning)), hsl(var(--accent)))"
                                    }}
                                    animate={{
                                        backgroundPosition: ["100% 50%", "0% 50%", "100% 50%"]
                                    }}
                                    transition={{
                                        duration: 8,
                                        repeat: Infinity,
                                        ease: "linear",
                                        delay: 0.5
                                    }}
                                >
                                    SOON
                                </motion.span>
                            </h1>
                        </div>

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ duration: 0.8, delay: 0.5 }}
                            className="space-y-4"
                        >
                            <p className={`text-muted-foreground ${isMobile ? "text-base" : "text-xl"}`}>
                                Eksklusif <span className="font-bold text-secondary">Neo Dervish</span> Collection
                            </p>

                            <motion.div
                                className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-accent/30"
                                style={{
                                    background: "linear-gradient(135deg, hsl(var(--card)/0.8), hsl(var(--card)/0.4))",
                                    backdropFilter: "blur(20px)"
                                }}
                                animate={{
                                    borderColor: [
                                        "hsl(var(--accent)/0.3)",
                                        "hsl(var(--secondary)/0.5)",
                                        "hsl(var(--accent)/0.3)"
                                    ]
                                }}
                                transition={{ duration: 3, repeat: Infinity }}
                            >
                                <Sparkles className="w-4 h-4 text-accent" />
                                <span className="text-sm font-medium text-accent">Limited Edition Drop</span>
                                <Sparkles className="w-4 h-4 text-secondary" />
                            </motion.div>
                        </motion.div>
                    </motion.div>
                </section>

                {/* COUNTDOWN + WAITLIST */}
                <section className="grid grid-cols-1 xl:grid-cols-3 gap-8 lg:gap-12 mb-20">
                    {/* Countdown */}
                    <div className="xl:col-span-2">
                        <motion.div
                            initial={{ opacity: 0, x: -50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.2 }}
                            className="relative"
                        >
                            <motion.div
                                className="absolute -inset-6 rounded-3xl blur-2xl opacity-30"
                                style={{
                                    background: "linear-gradient(135deg, hsl(var(--accent)), hsl(var(--secondary)))"
                                }}
                                animate={{
                                    opacity: [0.3, 0.5, 0.3],
                                    scale: [1, 1.02, 1]
                                }}
                                transition={{
                                    duration: 4,
                                    repeat: Infinity
                                }}
                            />

                            <div className="relative glass-card border-accent/30 p-8 lg:p-12">
                                <div className="text-center space-y-8">
                                    <motion.div
                                        animate={{ rotate: [0, 360] }}
                                        transition={{
                                            duration: 20,
                                            repeat: Infinity,
                                            ease: "linear"
                                        }}
                                        className="mx-auto w-20 h-20 rounded-3xl p-0.5"
                                        style={{
                                            background: "linear-gradient(135deg, hsl(var(--accent)), hsl(var(--secondary)))"
                                        }}
                                    >
                                        <div className="w-full h-full rounded-3xl bg-card/90 backdrop-blur-xl flex items-center justify-center">
                                            <Clock className="w-8 h-8 text-accent" />
                                        </div>
                                    </motion.div>

                                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-8">
                                        {[
                                            { key: "days", label: "DAYS", val: timeLeft.days },
                                            { key: "hours", label: "HOURS", val: timeLeft.hours },
                                            { key: "minutes", label: "MINS", val: timeLeft.minutes },
                                            { key: "seconds", label: "SECS", val: timeLeft.seconds },
                                        ].map((unit, index) => (
                                            <CountdownUnit
                                                key={unit.key}
                                                value={unit.val}
                                                label={unit.label}
                                                index={index}
                                                isMobile={isMobile}
                                            />
                                        ))}
                                    </div>

                                    <motion.div
                                        className="inline-flex items-center gap-3 px-6 py-3 rounded-full border border-warning/30"
                                        style={{
                                            background: "linear-gradient(135deg, hsl(var(--warning)/0.1), hsl(var(--secondary)/0.1))"
                                        }}
                                        animate={{
                                            borderColor: [
                                                "hsl(var(--warning)/0.3)",
                                                "hsl(var(--secondary)/0.5)",
                                                "hsl(var(--warning)/0.3)"
                                            ]
                                        }}
                                        transition={{ duration: 2, repeat: Infinity }}
                                    >
                                        <Star className="w-4 h-4 text-warning" />
                                        <span className="text-sm text-muted-foreground font-medium">
                                            Launch: December 1, 2025
                                        </span>
                                        <Star className="w-4 h-4 text-warning" />
                                    </motion.div>
                                </div>
                            </div>
                        </motion.div>
                    </div>

                    {/* Enhanced Waitlist */}
                    <div className="xl:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, x: 50 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{ duration: 0.8, delay: 0.4 }}
                            className="sticky top-8 h-fit"
                        >
                            <motion.div
                                className="absolute -inset-4 rounded-3xl blur-2xl opacity-40"
                                style={{
                                    background: "linear-gradient(135deg, hsl(var(--secondary)), hsl(var(--accent)))"
                                }}
                                animate={{
                                    opacity: [0.4, 0.6, 0.4],
                                    rotate: [0, 1, -1, 0]
                                }}
                                transition={{
                                    duration: 5,
                                    repeat: Infinity
                                }}
                            />

                            <div className="relative glass-card border-secondary/30 p-8">
                                <div className="text-center space-y-6 mb-8">
                                    <motion.div
                                        className="inline-flex items-center gap-3 px-4 py-2 rounded-full border border-accent/30"
                                        style={{
                                            background: "linear-gradient(135deg, hsl(var(--accent)/0.15), hsl(var(--secondary)/0.15))"
                                        }}
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        <Shield className="w-4 h-4 text-accent" />
                                        <span className="text-sm font-semibold text-accent">VIP Access</span>
                                    </motion.div>

                                    <div className="space-y-2">
                                        <h3 className="font-heading text-2xl text-foreground">Join Waitlist</h3>
                                        <p className="text-sm text-muted-foreground">Early access & exclusive updates</p>
                                    </div>
                                </div>

                                <div className="space-y-6">
                                    <div className="relative group">
                                        <motion.div
                                            className="absolute inset-0 rounded-2xl blur-xl opacity-0 group-focus-within:opacity-100 transition-all duration-320"
                                            style={{
                                                background: "linear-gradient(135deg, hsl(var(--accent)/0.2), hsl(var(--secondary)/0.2))"
                                            }}
                                        />

                                        <div className="relative flex items-center gap-4 p-4 rounded-2xl border border-border group-focus-within:border-accent/50 transition-all duration-320"
                                            style={{
                                                background: "linear-gradient(135deg, hsl(var(--input)/0.5), hsl(var(--card)/0.8))",
                                                backdropFilter: "blur(20px)"
                                            }}>
                                            <Mail className="w-5 h-5 text-accent flex-shrink-0" />
                                            <input
                                                type="email"
                                                placeholder="your@email.com"
                                                value={email}
                                                onChange={handleChange}
                                                maxLength={254}
                                                className="flex-1 bg-transparent outline-none text-foreground placeholder-muted-foreground"
                                                aria-invalid={status.ok === false}
                                            />
                                        </div>
                                    </div>

                                    <motion.button
                                        onClick={handleSubscribe}
                                        disabled={submitting || !email.trim()}
                                        whileHover={{ scale: 1.02 }}
                                        whileTap={{ scale: 0.98 }}
                                        className="w-full py-4 rounded-2xl font-semibold flex items-center justify-center gap-3 transition-all duration-320 disabled:opacity-50 disabled:cursor-not-allowed btn-primary"
                                    >
                                        <AnimatePresence mode="wait">
                                            {submitting ? (
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="flex items-center gap-3"
                                                >
                                                    <motion.div
                                                        animate={{ rotate: 360 }}
                                                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                                        className="w-5 h-5 border-2 border-primary-foreground/30 border-t-primary-foreground rounded-full"
                                                    />
                                                    <span>Joining...</span>
                                                </motion.div>
                                            ) : (
                                                <motion.div
                                                    initial={{ opacity: 0 }}
                                                    animate={{ opacity: 1 }}
                                                    exit={{ opacity: 0 }}
                                                    className="flex items-center gap-3"
                                                >
                                                    <span>Get Notified</span>
                                                    <ArrowRight className="w-5 h-5" />
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </motion.button>

                                    <AnimatePresence>
                                        {status.msg && (
                                            <motion.div
                                                initial={{ opacity: 0, y: -10, scale: 0.95 }}
                                                animate={{ opacity: 1, y: 0, scale: 1 }}
                                                exit={{ opacity: 0, y: -10, scale: 0.95 }}
                                                transition={{ duration: 0.32 }}
                                                className={`text-sm text-center p-4 rounded-2xl border backdrop-blur-sm ${status.ok
                                                    ? 'text-success border-success/30 bg-success/10'
                                                    : 'text-error border-error/30 bg-error/10'
                                                    }`}
                                            >
                                                {status.msg}
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            </div>
                        </motion.div>
                    </div>
                </section>

                {/* PREVIEW GRID */}
                <section className="space-y-16">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="text-center space-y-6"
                    >
                        <motion.h2
                            className="font-heading text-transparent bg-clip-text leading-tight"
                            style={{
                                fontSize: isMobile ? "2.5rem" : "4rem",
                                backgroundImage: "linear-gradient(135deg, hsl(var(--foreground)), hsl(var(--accent)), hsl(var(--secondary)))"
                            }}
                            animate={{
                                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                            }}
                            transition={{
                                duration: 10,
                                repeat: Infinity,
                                ease: "linear"
                            }}
                        >
                            Design Preview
                        </motion.h2>

                        <motion.p
                            className="text-muted-foreground max-w-2xl mx-auto leading-relaxed"
                            initial={{ opacity: 0 }}
                            whileInView={{ opacity: 1 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.3 }}
                        >
                            Sneak peek at upcoming pieces — each crafted with precision and passion
                        </motion.p>
                    </motion.div>

                    <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 lg:gap-8">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <PreviewCard key={i} index={i} isMobile={isMobile} />
                        ))}
                    </div>
                </section>

                {/* PREMIUM FOOTER */}
                <section className="text-center pt-20">
                    <motion.div
                        initial={{ opacity: 0, y: 30 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.8 }}
                        className="inline-flex items-center gap-6 glass-card px-8 py-6 rounded-full border-accent/30"
                    >
                        <motion.div
                            className="text-sm font-bold tracking-[0.2em] text-muted-foreground"
                            animate={{
                                color: [
                                    "hsl(var(--muted-foreground))",
                                    "hsl(var(--accent))",
                                    "hsl(var(--secondary))",
                                    "hsl(var(--muted-foreground))"
                                ]
                            }}
                            transition={{
                                duration: 4,
                                repeat: Infinity
                            }}
                        >
                            IN SOUL WE MOVE
                        </motion.div>

                        <motion.button
                            onClick={scrollToTop}
                            whileHover={{
                                scale: 1.05,
                                rotate: -5,
                                transition: { duration: 0.32 }
                            }}
                            whileTap={{ scale: 0.95 }}
                            className="btn-accent rounded-full px-6 py-3 text-sm font-semibold flex items-center gap-2 transition-all duration-320"
                        >
                            <span>Back to Top</span>
                            <motion.div
                                animate={{ y: [-2, 2, -2] }}
                                transition={{
                                    duration: 2,
                                    repeat: Infinity,
                                    ease: "easeInOut"
                                }}
                            >
                                <ChevronUp className="w-4 h-4" />
                            </motion.div>
                        </motion.button>
                    </motion.div>
                </section>
            </main>
        </div>
    );
}