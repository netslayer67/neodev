"use client"

import { useEffect, useState, useRef, useCallback } from "react"
import { motion, useScroll, useTransform, AnimatePresence } from "framer-motion"
import {
    ArrowRight,
    Sparkles,
    Crown,
    Star,
    Heart,
    Zap,
    Shield,
    TrendingUp,
    Award,
    Lock,
    Mail,
    CheckCircle,
} from "lucide-react"

const sanitizeInput = (input) => {
    if (typeof input !== "string") return ""
    return input
        .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "")
        .replace(/<[^>]+>/g, "")
        .replace(/javascript:/gi, "")
        .replace(/on\w+\s*=\s*"[^"]*"/gi, "")
        .replace(/on\w+\s*=\s*'[^']*'/gi, "")
        .replace(/data:/gi, "")
        .replace(/vbscript:/gi, "")
        .replace(/file:/gi, "")
        .replace(/ftp:/gi, "")
        .replace(/mailto:/gi, "")
        .replace(/tel:/gi, "")
        .replace(/[<>{}]/g, "")
        .trim()
        .slice(0, 100)
}

const validateEmail = (email) => {
    const sanitized = sanitizeInput(email)
    const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    const suspiciousPatterns = /script|javascript|vbscript|onload|onerror|eval|alert|confirm|prompt/i
    return emailRegex.test(sanitized) && !suspiciousPatterns.test(sanitized) && sanitized.length >= 5
}

const GlassButton = ({
    children,
    onClick,
    variant = "primary",
    size = "lg",
    className = "",
    disabled = false,
    ...props
}) => {
    const variants = {
        primary:
            "bg-gradient-to-br from-accent/20 via-accent/30 to-secondary/20 text-accent-foreground border-accent/30 hover:border-accent/50 shadow-[0_8px_32px_rgba(0,200,255,0.15)] hover:shadow-[0_20px_60px_rgba(0,200,255,0.3)] hover:bg-gradient-to-br hover:from-accent/30 hover:via-accent/40 hover:to-secondary/30",
        secondary:
            "bg-card/40 text-foreground border-border/30 hover:border-secondary/50 hover:bg-secondary/10 shadow-[0_8px_24px_rgba(0,0,0,0.12)] hover:shadow-[0_16px_40px_rgba(0,0,0,0.2)]",
        outline:
            "bg-background/50 text-foreground border-border/40 hover:border-accent/60 hover:bg-accent/10 shadow-[0_4px_16px_rgba(0,0,0,0.1)] hover:shadow-[0_12px_32px_rgba(0,0,0,0.15)]",
    }

    const sizes = {
        sm: "px-4 py-2.5 text-sm",
        md: "px-6 py-3.5 text-base",
        lg: "px-8 py-4 text-lg",
        xl: "px-12 py-5 text-xl",
    }

    return (
        <motion.button
            whileHover={{ scale: 1.02, y: -2 }}
            whileTap={{ scale: 0.98 }}
            className={`group relative overflow-hidden font-semibold tracking-wide transition-all duration-[320ms] rounded-2xl border backdrop-blur-3xl ${variants[variant]} ${sizes[size]} ${className} ${disabled ? "opacity-50 cursor-not-allowed" : ""}`}
            onClick={disabled ? undefined : onClick}
            disabled={disabled}
            {...props}
        >
            <div className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/20 to-transparent group-hover:translate-x-full transition-transform duration-[800ms] ease-out" />

            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-[320ms]" />

            <div className="relative flex items-center justify-center gap-3">{children}</div>
        </motion.button>
    )
}

const EmailSignup = ({ isMobile }) => {
    const [email, setEmail] = useState("")
    const [isValid, setIsValid] = useState(true)
    const [isSubmitted, setIsSubmitted] = useState(false)
    const [isLoading, setIsLoading] = useState(false)

    const handleSubmit = useCallback(async () => {
        if (validateEmail(email)) {
            setIsLoading(true)
            // Simulate API call
            await new Promise((resolve) => setTimeout(resolve, 1200))
            setIsSubmitted(true)
            setEmail("")
            setIsLoading(false)
            setTimeout(() => setIsSubmitted(false), 5000)
        } else {
            setIsValid(false)
            setTimeout(() => setIsValid(true), 3000)
        }
    }, [email])

    const handleEmailChange = useCallback(
        (e) => {
            const sanitized = sanitizeInput(e.target.value)
            setEmail(sanitized)
            if (!isValid) setIsValid(true)
        },
        [isValid],
    )

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.6 }}
            className="relative mt-8"
        >
            <div className={`flex ${isMobile ? "flex-col" : "flex-col sm:flex-row"} gap-3`}>
                <div className="relative flex-1">
                    <input
                        type="email"
                        value={email}
                        onChange={handleEmailChange}
                        placeholder="Enter your email for exclusive access"
                        className={`w-full px-4 py-4 bg-card/50 backdrop-blur-3xl border rounded-2xl text-foreground placeholder-muted-foreground/60 transition-all duration-[320ms] focus:outline-none focus:ring-2 ${isValid
                                ? "border-border/30 focus:border-accent/60 focus:ring-accent/20 hover:border-border/50"
                                : "border-error/50 focus:border-error focus:ring-error/20"
                            }`}
                        maxLength={100}
                        disabled={isLoading || isSubmitted}
                    />
                    {isSubmitted ? (
                        <CheckCircle className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 text-success animate-pulse" />
                    ) : (
                        <Lock className="absolute right-4 top-1/2 -translate-y-1/2 h-4 w-4 text-success/60" />
                    )}
                </div>

                <GlassButton
                    onClick={handleSubmit}
                    variant="primary"
                    size={isMobile ? "lg" : "lg"}
                    disabled={isSubmitted || isLoading}
                    className="min-w-[140px]"
                >
                    {isLoading ? (
                        <motion.div
                            animate={{ rotate: 360 }}
                            transition={{ duration: 1, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                        >
                            <Mail className="h-4 w-4" />
                        </motion.div>
                    ) : isSubmitted ? (
                        <>
                            <CheckCircle className="h-4 w-4" />
                            <span>Welcome!</span>
                        </>
                    ) : (
                        <>
                            <Heart className="h-4 w-4" />
                            <span>Join Elite</span>
                        </>
                    )}
                </GlassButton>
            </div>

            <AnimatePresence>
                {!isValid && (
                    <motion.p
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        className="text-error text-sm mt-3 font-medium flex items-center gap-2"
                    >
                        <Shield className="h-4 w-4" />
                        Please enter a valid email address
                    </motion.p>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

const FloatingProof = ({ isMobile }) => {
    const proofs = [
        { icon: Crown, label: "15K+ Elite", position: isMobile ? "top-4 left-4" : "top-8 left-8" },
        { icon: Star, label: "4.9★", position: isMobile ? "top-4 right-4" : "top-16 right-12" },
        { icon: TrendingUp, label: "+300%", position: isMobile ? "bottom-16 left-4" : "bottom-20 left-12" },
        { icon: Award, label: "Premium", position: isMobile ? "bottom-16 right-4" : "bottom-8 right-8" },
    ]

    return (
        <>
            {proofs.map((proof, idx) => (
                <motion.div
                    key={idx}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 1 + idx * 0.15, duration: 0.5, type: "spring" }}
                    className={`absolute ${proof.position} bg-card/60 backdrop-blur-3xl border border-border/30 rounded-xl px-3 py-2 shadow-lg hover:shadow-xl transition-all duration-[320ms] hover:scale-105`}
                >
                    <div className="flex items-center gap-2">
                        <proof.icon
                            className={`h-4 w-4 ${idx === 0 ? "text-accent" : idx === 1 ? "text-warning" : idx === 2 ? "text-success" : "text-secondary"}`}
                        />
                        <span className={`${isMobile ? "text-xs" : "text-xs"} font-medium text-foreground/90`}>{proof.label}</span>
                    </div>
                </motion.div>
            ))}
        </>
    )
}

const CTASection = () => {
    const [isMobile, setIsMobile] = useState(false)
    const [isLoaded, setIsLoaded] = useState(false)
    const sectionRef = useRef(null)

    const { scrollYProgress } = useScroll({
        target: sectionRef,
        offset: ["start end", "end start"],
    })

    const y1 = useTransform(scrollYProgress, [0, 1], [0, -120])
    const y2 = useTransform(scrollYProgress, [0, 1], [0, 120])
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.8, 1], [0, 1, 1, 0])

    useEffect(() => {
        const checkMobile = () => setIsMobile(window.innerWidth < 768)
        const timer = setTimeout(() => setIsLoaded(true), 300)

        checkMobile()
        window.addEventListener("resize", checkMobile)

        return () => {
            window.removeEventListener("resize", checkMobile)
            clearTimeout(timer)
        }
    }, [])

    const handleShopClick = useCallback(() => {
        // Analytics tracking would go here
        window.scrollTo({ top: 0, behavior: "smooth" })
    }, [])

    return (
        <section ref={sectionRef} className="relative py-16 md:py-32 overflow-hidden">
            <motion.div
                style={{ y: y1 }}
                animate={{
                    x: [0, 100, -60, 0],
                    scale: [1, 1.3, 0.8, 1],
                    rotate: [0, 120, 240, 360],
                }}
                transition={{
                    duration: 40,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                }}
                className="absolute -top-48 -left-40 w-96 h-96 bg-accent/8 rounded-full blur-3xl"
            />
            <motion.div
                style={{ y: y2 }}
                animate={{
                    x: [0, -80, 40, 0],
                    scale: [1, 0.7, 1.4, 1],
                    rotate: [360, 240, 120, 0],
                }}
                transition={{
                    duration: 35,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                }}
                className="absolute -bottom-56 -right-48 w-[600px] h-[600px] bg-secondary/10 rounded-full blur-3xl"
            />
            <motion.div
                animate={{
                    x: [0, 60, -30, 0],
                    y: [0, -40, 20, 0],
                    scale: [1, 1.2, 0.9, 1],
                }}
                transition={{
                    duration: 30,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                }}
                className="absolute top-1/4 left-1/4 w-80 h-80 bg-warning/6 rounded-full blur-3xl"
            />
            <motion.div
                animate={{
                    x: [0, -35, 70, 0],
                    y: [0, 50, -15, 0],
                }}
                transition={{
                    duration: 32,
                    repeat: Number.POSITIVE_INFINITY,
                    ease: "easeInOut",
                }}
                className="absolute top-2/3 right-1/3 w-96 h-96 bg-info/8 rounded-full blur-3xl"
            />

            <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
                <motion.div
                    style={{ opacity }}
                    className={`grid ${isMobile ? "grid-cols-1 gap-8 text-center" : "grid-cols-1 lg:grid-cols-5 gap-20 items-center"}`}
                >
                    <div className={`space-y-6 ${isMobile ? "" : "lg:col-span-3"}`}>
                        {/* Premium Badge */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0, rotate: -180 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
                            className="inline-flex items-center gap-2 px-4 py-2.5 bg-accent/15 border border-accent/30 rounded-full backdrop-blur-3xl hover:bg-accent/20 transition-all duration-[320ms]"
                        >
                            <Crown className="h-4 w-4 text-accent animate-pulse" />
                            <span className="text-accent font-bold text-sm tracking-widest">ULTRA PREMIUM</span>
                        </motion.div>

                        <motion.div
                            initial={{ opacity: 0, y: 40 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3, duration: 0.8 }}
                        >
                            <h2
                                className={`font-heading tracking-tight leading-[0.85] ${isMobile ? "text-4xl" : "text-6xl lg:text-7xl xl:text-8xl"}`}
                            >
                                <motion.span
                                    className="block bg-gradient-to-br from-foreground via-accent/80 to-secondary bg-clip-text text-transparent"
                                    animate={{ backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"] }}
                                    transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                >
                                    Elevate
                                </motion.span>
                                <motion.span
                                    className="block bg-gradient-to-br from-secondary via-warning to-accent bg-clip-text text-transparent"
                                    animate={{ backgroundPosition: ["100% 50%", "0% 50%", "100% 50%"] }}
                                    transition={{ duration: 10, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
                                >
                                    Your Style
                                </motion.span>
                            </h2>
                        </motion.div>

                        <motion.p
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5, duration: 0.6 }}
                            className={`text-muted-foreground font-light leading-relaxed ${isMobile ? "text-base max-w-xs mx-auto" : "text-lg max-w-xl"}`}
                        >
                            Crafted for those who demand excellence. Every piece tells a story of premium quality and bold expression.
                        </motion.p>

                        <motion.div
                            initial={{ opacity: 0, y: 30 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.7, duration: 0.6 }}
                            className={`flex ${isMobile ? "flex-col" : "flex-row"} gap-4`}
                        >
                            <GlassButton
                                variant="primary"
                                size={isMobile ? "lg" : "xl"}
                                onClick={handleShopClick}
                                className="group relative overflow-hidden"
                            >
                                <Sparkles className="h-5 w-5 animate-spin" style={{ animationDuration: "4s" }} />
                                <span>Shop Collection</span>
                                <ArrowRight className="h-5 w-5 transition-all duration-[320ms] group-hover:translate-x-1 group-hover:scale-110" />
                            </GlassButton>

                            <GlassButton variant="outline" size={isMobile ? "md" : "lg"} className="group">
                                <Zap className="h-5 w-5 text-warning transition-transform duration-[320ms] group-hover:scale-110" />
                                <span>View Lookbook</span>
                            </GlassButton>
                        </motion.div>

                        {/* Email Signup */}
                        <EmailSignup isMobile={isMobile} />

                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 1, duration: 0.6 }}
                            className={`flex ${isMobile ? "flex-col gap-3" : "justify-start items-center gap-8"} pt-6 border-t border-border/20`}
                        >
                            {[
                                { icon: Shield, text: "Secure Payment", color: "text-success" },
                                { icon: Star, text: "4.9★ Rated", color: "text-warning" },
                                { icon: Zap, text: "Fast Delivery", color: "text-accent" },
                            ].map((item, idx) => (
                                <motion.div
                                    key={idx}
                                    whileHover={{ scale: 1.05 }}
                                    className={`flex items-center gap-2 ${isMobile ? "justify-center" : ""}`}
                                >
                                    <item.icon className={`h-4 w-4 ${item.color}`} />
                                    <span className="text-sm font-medium text-foreground/80">{item.text}</span>
                                </motion.div>
                            ))}
                        </motion.div>
                    </div>

                    <motion.div
                        initial={{ opacity: 0, scale: 0.8, rotateY: 45 }}
                        animate={{ opacity: 1, scale: 1, rotateY: 0 }}
                        transition={{ delay: 0.5, duration: 1, ease: [0.25, 0.4, 0.25, 1] }}
                        className={`relative ${isMobile ? "mt-8" : "lg:col-span-2"}`}
                    >
                        {/* Main Product Container */}
                        <div className="relative group">
                            <motion.div
                                animate={{
                                    scale: [1, 1.15, 1],
                                    opacity: [0.2, 0.4, 0.2],
                                }}
                                transition={{ duration: 5, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
                                className="absolute inset-0 bg-gradient-to-br from-accent/15 via-secondary/10 to-primary/15 rounded-3xl blur-3xl"
                            />

                            <motion.div
                                whileHover={{
                                    rotateY: isMobile ? 0 : -6,
                                    rotateX: isMobile ? 0 : 3,
                                    scale: 1.02,
                                    transition: { duration: 0.32, ease: "easeOut" },
                                }}
                                className={`relative bg-card/40 backdrop-blur-3xl border border-border/30 rounded-3xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-[320ms] ${isMobile ? "aspect-square max-w-sm mx-auto" : "aspect-[3/4] max-w-md"
                                    }`}
                                style={{ transformStyle: "preserve-3d" }}
                            >
                                <AnimatePresence>
                                    {isLoaded ? (
                                        <motion.img
                                            initial={{ opacity: 0, scale: 1.2 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ duration: 1, ease: "easeOut" }}
                                            src="https://images.unsplash.com/photo-1600185365673-43f63fe17826?auto=format&fit=crop&w=600&q=80"
                                            alt="Premium Fashion Collection"
                                            className="w-full h-full object-cover transition-transform duration-[800ms] group-hover:scale-110"
                                            loading="lazy"
                                        />
                                    ) : (
                                        <motion.div
                                            animate={{ opacity: [0.3, 0.6, 0.3] }}
                                            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY }}
                                            className="w-full h-full bg-gradient-to-br from-card via-muted/20 to-card"
                                        />
                                    )}
                                </AnimatePresence>

                                <motion.div
                                    initial={{ opacity: 0, y: 100 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: 1.2, duration: 0.8 }}
                                    className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background/95 via-background/80 to-transparent backdrop-blur-2xl"
                                >
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <p className="text-foreground font-bold text-lg mb-1">Elite Collection</p>
                                            <p className="text-secondary font-semibold text-lg">From $129</p>
                                        </div>
                                        <motion.div
                                            whileHover={{ scale: 1.1, rotate: 15 }}
                                            className="w-12 h-12 bg-gradient-to-br from-accent/30 to-secondary/30 backdrop-blur-3xl rounded-full flex items-center justify-center border border-accent/30 shadow-lg"
                                        >
                                            <Crown className="h-6 w-6 text-accent" />
                                        </motion.div>
                                    </div>
                                </motion.div>
                            </motion.div>

                            {/* Floating Social Proof */}
                            <FloatingProof isMobile={isMobile} />
                        </div>
                    </motion.div>
                </motion.div>
            </div>

            <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-background via-background/50 to-transparent pointer-events-none" />
        </section>
    )
}

export default CTASection
