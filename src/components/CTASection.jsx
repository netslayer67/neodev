import { useEffect, useState, useRef, useCallback, memo } from "react"
import {
    ArrowRight, Sparkles, Crown, Star, Heart, Zap, Shield, CheckCircle,
    TrendingUp, Users, Clock, Award
} from "lucide-react"

// Optimized mobile detection with matchMedia API
const useMobileDetection = () => {
    const [isMobile, setIsMobile] = useState(false)

    useEffect(() => {
        if (typeof window === "undefined") return

        const mediaQuery = window.matchMedia("(max-width: 768px)")
        const handleChange = (e) => setIsMobile(e.matches)

        setIsMobile(mediaQuery.matches)
        mediaQuery.addEventListener("change", handleChange)

        return () => mediaQuery.removeEventListener("change", handleChange)
    }, [])

    return isMobile
}

// Progressive image loading with blur-up effect
const ProgressiveImage = memo(({ src, alt, className }) => {
    const [isLoaded, setIsLoaded] = useState(false)
    const [isInView, setIsInView] = useState(false)
    const imgRef = useRef(null)

    useEffect(() => {
        if (!imgRef.current) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsInView(true)
                    observer.disconnect()
                }
            },
            { threshold: 0.1, rootMargin: '50px' }
        )

        observer.observe(imgRef.current)
        return () => observer.disconnect()
    }, [])

    return (
        <div ref={imgRef} className={`relative overflow-hidden ${className}`}>
            {/* Blur placeholder using theme colors */}
            <div className={`
        absolute inset-0 bg-gradient-to-br from-muted via-card to-muted
        transition-opacity duration-500 ${isLoaded ? 'opacity-0' : 'opacity-100'}
      `} />

            {/* Main image */}
            {isInView && (
                <img
                    src={src}
                    alt={alt}
                    className={`
            w-full h-full object-cover transition-all duration-700 transform-gpu
            ${isLoaded ? 'opacity-100 scale-100' : 'opacity-0 scale-105'}
          `}
                    onLoad={() => setIsLoaded(true)}
                    loading="lazy"
                    decoding="async"
                />
            )}
        </div>
    )
})

// Social proof counter with count-up animation
const SocialProofCounter = memo(({ targetNumber, label, icon: Icon, color = "text-success" }) => {
    const [count, setCount] = useState(0)
    const [isVisible, setIsVisible] = useState(false)
    const counterRef = useRef(null)

    useEffect(() => {
        if (!counterRef.current) return

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setIsVisible(true)
                    observer.disconnect()
                }
            },
            { threshold: 0.3 }
        )

        observer.observe(counterRef.current)
        return () => observer.disconnect()
    }, [])

    useEffect(() => {
        if (!isVisible) return

        let startTime = null
        const duration = 2000

        const animateCount = (currentTime) => {
            if (startTime === null) startTime = currentTime
            const progress = Math.min((currentTime - startTime) / duration, 1)

            // Easing function for smooth animation
            const easeOutCubic = 1 - Math.pow(1 - progress, 3)
            setCount(Math.floor(easeOutCubic * targetNumber))

            if (progress < 1) {
                requestAnimationFrame(animateCount)
            }
        }

        requestAnimationFrame(animateCount)
    }, [isVisible, targetNumber])

    return (
        <div ref={counterRef} className="flex items-center gap-2">
            <Icon className={`w-4 h-4 ${color}`} />
            <span className="text-sm font-semibold text-foreground">
                {count.toLocaleString()}{targetNumber > 10 ? '+' : ''} {label}
            </span>
        </div>
    )
})

// Trust badge component using theme system
const TrustBadge = memo(({ icon: Icon, text, color }) => (
    <div className="flex items-center gap-2">
        <Icon className={`h-4 w-4 ${color}`} />
        <span className="text-sm font-medium text-muted-foreground">
            {text}
        </span>
    </div>
))

const CTASection = () => {
    const isMobile = useMobileDetection()
    const sectionRef = useRef(null)

    // Enhanced CTA handlers with analytics
    const handleShopClick = useCallback(() => {
        // Analytics tracking
        if (typeof gtag !== 'undefined') {
            gtag('event', 'cta_click', {
                event_category: 'engagement',
                event_label: 'shop_collection_cta'
            })
        }

        const shopSection = document.getElementById('shop-section')
        if (shopSection) {
            shopSection.scrollIntoView({ behavior: "smooth", block: "start" })
        } else {
            window.scrollTo({ top: 0, behavior: "smooth" })
        }
    }, [])

    const handleLookbookClick = useCallback(() => {
        if (typeof gtag !== 'undefined') {
            gtag('event', 'cta_click', {
                event_category: 'engagement',
                event_label: 'view_lookbook_cta'
            })
        }
        // Navigate to lookbook section or page
        const lookbookSection = document.getElementById('lookbook-section')
        if (lookbookSection) {
            lookbookSection.scrollIntoView({ behavior: "smooth", block: "start" })
        }
    }, [])

    return (
        <section
            ref={sectionRef}
            className="relative py-16 md:py-32 overflow-hidden bg-background"
        >
            {/* Optimized background effects using theme colors */}
            <div className="absolute inset-0 pointer-events-none">
                {/* Primary blob */}
                <div
                    className="absolute -top-40 -left-40 w-80 h-80 bg-accent/10 rounded-full blur-3xl opacity-60"
                    style={{
                        animation: 'blob 20s ease-in-out infinite',
                        willChange: 'transform'
                    }}
                />

                {/* Secondary blob */}
                <div
                    className="absolute -bottom-48 -right-32 w-96 h-96 bg-secondary/10 rounded-full blur-3xl opacity-40"
                    style={{
                        animation: 'blob 25s ease-in-out infinite reverse',
                        animationDelay: '10s',
                        willChange: 'transform'
                    }}
                />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-20 items-center">

                    {/* Left Content - CTV Enhanced */}
                    <div className="lg:col-span-3 space-y-6 text-center lg:text-left">

                        {/* Social Proof Counters */}
                        <div className="flex justify-center lg:justify-start gap-6 mb-6">
                            <SocialProofCounter
                                targetNumber={2847}
                                label="Happy Customers"
                                icon={Heart}
                                color="text-success"
                            />
                            <SocialProofCounter
                                targetNumber={4.9}
                                label="★ Rating"
                                icon={Star}
                                color="text-warning"
                            />
                        </div>

                        {/* Premium Badge with urgency using theme colors */}
                        <div className="inline-flex items-center gap-2 px-4 py-2.5 glass-card border border-accent/30">
                            <Crown className="h-4 w-4 text-accent animate-pulse" />
                            <span className="text-accent font-bold text-sm tracking-widest">
                                ULTRA PREMIUM • LIMITED STOCK
                            </span>
                        </div>

                        {/* Enhanced Title using theme typography */}
                        <h2 className="font-heading tracking-tight leading-[0.9] text-4xl md:text-6xl lg:text-7xl xl:text-8xl">
                            <span className="block text-transparent bg-clip-text animated-gradient drop-shadow">
                                Elevate
                            </span>
                            <span className="block text-foreground drop-shadow-sm">
                                Your Style
                            </span>
                        </h2>

                        {/* Value proposition with theme colors */}
                        <p className="text-muted-foreground font-light leading-relaxed text-lg max-w-xl mx-auto lg:mx-0">
                            Crafted for those who demand excellence.
                            <span className="text-accent font-semibold"> Premium quality</span> meets
                            <span className="text-secondary font-semibold"> bold expression</span> in every piece.
                        </p>

                        {/* CTA Buttons using theme system */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <button
                                onClick={handleShopClick}
                                className="group px-8 py-4 rounded-2xl btn-primary font-semibold flex items-center justify-center gap-3 hover:scale-105 hover:shadow-xl transition-all duration-300 shadow-lg shadow-accent/25"
                            >
                                <Sparkles className="h-5 w-5" style={{ animation: 'spin 3s linear infinite' }} />
                                <span>Shop Collection Now</span>
                                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                            </button>

                            <button
                                onClick={handleLookbookClick}
                                className="px-8 py-4 rounded-2xl glass-card border border-border font-semibold flex items-center justify-center gap-3 hover:scale-105 hover:bg-card/80 transition-all duration-300 text-foreground"
                            >
                                <Zap className="h-5 w-5 text-warning" />
                                <span>View Lookbook</span>
                            </button>
                        </div>

                        {/* Trust Badges using theme colors */}
                        <div className="flex flex-wrap justify-center lg:justify-start gap-6 pt-8 border-t border-border">
                            <TrustBadge icon={Shield} text="Secure Payment" color="text-success" />
                            <TrustBadge icon={TrendingUp} text="Free Shipping $100+" color="text-info" />
                            <TrustBadge icon={Clock} text="30-Day Returns" color="text-warning" />
                            <TrustBadge icon={Award} text="Lifetime Warranty" color="text-secondary" />
                        </div>

                        {/* Urgency indicator using theme system */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 glass-card border border-error/40 bg-error/5">
                            <Clock className="h-4 w-4 text-error animate-pulse" />
                            <span className="text-error font-medium text-sm">
                                Sale ends in 24 hours • 67% claimed
                            </span>
                        </div>
                    </div>

                    {/* Right Image - Enhanced product showcase */}
                    <div className="lg:col-span-2">
                        <div className="relative glass-card border border-border/30 rounded-3xl overflow-hidden shadow-2xl aspect-[3/4] max-w-md mx-auto group hover:shadow-accent/20 transition-shadow duration-500">

                            <ProgressiveImage
                                src="https://images.unsplash.com/photo-1600185365673-43f63fe17826?auto=format&fit=crop&w=600&q=80"
                                alt="Premium Fashion Collection"
                                className="w-full h-full transform group-hover:scale-105 transition-transform duration-700"
                            />

                            {/* Enhanced overlay with pricing using theme colors */}
                            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background/95 via-background/80 to-transparent">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-foreground font-bold text-lg mb-1">
                                            Elite Collection
                                        </p>
                                        <div className="flex items-center gap-2 mb-2">
                                            <span className="text-muted-foreground line-through text-sm">$199</span>
                                            <span className="text-secondary font-bold text-xl">$129</span>
                                            <span className="px-2 py-1 bg-error text-error-foreground text-xs font-bold rounded">35% OFF</span>
                                        </div>
                                        <div className="flex items-center gap-1">
                                            {[1, 2, 3, 4, 5].map(star => (
                                                <Star key={star} className="w-3 h-3 fill-warning text-warning" />
                                            ))}
                                            <span className="text-xs text-muted-foreground ml-1">(2,847 reviews)</span>
                                        </div>
                                    </div>
                                    <div className="w-12 h-12 bg-accent/20 rounded-full flex items-center justify-center border border-accent/30">
                                        <Crown className="h-6 w-6 text-accent" />
                                    </div>
                                </div>
                            </div>

                            {/* Limited stock indicator using theme colors */}
                            <div className="absolute top-4 right-4 px-3 py-1 bg-error/90 text-error-foreground text-xs font-bold rounded-full animate-pulse">
                                Only 12 left!
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Inline styles for blob animation - optimized */}
            <style jsx>{`
        @keyframes blob {
          0%, 100% { 
            transform: translate3d(0, 0, 0) scale(1);
          }
          33% { 
            transform: translate3d(20px, -20px, 0) scale(1.1);
          }
          66% { 
            transform: translate3d(-15px, 15px, 0) scale(0.9);
          }
        }
        
        /* Mobile optimizations */
        @media (max-width: 768px) {
          [style*="blob"] {
            animation-duration: 15s !important;
            opacity: 0.3 !important;
          }
        }
        
        /* Reduced motion support */
        @media (prefers-reduced-motion: reduce) {
          [style*="blob"],
          .animate-pulse,
          .animated-gradient {
            animation: none !important;
          }
        }
      `}</style>
        </section>
    )
}

export default CTASection