"use client"

import { useEffect, useState, useRef, useCallback, memo } from "react"
import {
    ArrowRight, Sparkles, Crown, Star, Heart, Zap,
    Shield, TrendingUp, Clock, Award
} from "lucide-react"

/* ----------------------------
   Mobile Detection
---------------------------- */
const useMobileDetection = () => {
    const [isMobile, setIsMobile] = useState(false)
    useEffect(() => {
        if (typeof window === "undefined") return
        const mq = window.matchMedia("(max-width: 768px)")
        setIsMobile(mq.matches)
        const handleChange = (e) => setIsMobile(e.matches)
        mq.addEventListener("change", handleChange)
        return () => mq.removeEventListener("change", handleChange)
    }, [])
    return isMobile
}

/* ----------------------------
   Progressive Image
---------------------------- */
const ProgressiveImage = memo(({ src, alt, className }) => {
    const [loaded, setLoaded] = useState(false)
    return (
        <div className={`relative overflow-hidden ${className}`}>
            <div className={`
        absolute inset-0 bg-gradient-to-br from-muted via-card to-muted
        transition-opacity duration-500 ${loaded ? "opacity-0" : "opacity-100"}
      `} />
            <img
                src={src}
                alt={alt}
                className={`
          w-full h-full object-cover transform-gpu
          transition-all duration-700
          ${loaded ? "opacity-100 scale-100" : "opacity-0 scale-105"}
        `}
                onLoad={() => setLoaded(true)}
                loading="lazy"
                decoding="async"
            />
        </div>
    )
})

/* ----------------------------
   Social Proof Counter
---------------------------- */
const SocialProofCounter = memo(({ targetNumber, label, icon: Icon, color = "text-success" }) => {
    const [count, setCount] = useState(0)
    useEffect(() => {
        let frame
        let start
        const duration = 2000
        const step = (ts) => {
            if (!start) start = ts
            const progress = Math.min((ts - start) / duration, 1)
            const ease = 1 - Math.pow(1 - progress, 3)
            setCount(Math.floor(ease * targetNumber))
            if (progress < 1) frame = requestAnimationFrame(step)
        }
        frame = requestAnimationFrame(step)
        return () => cancelAnimationFrame(frame)
    }, [targetNumber])
    return (
        <div className="flex items-center gap-2">
            <Icon className={`w-4 h-4 ${color}`} />
            <span className="text-sm font-semibold text-foreground">
                {count}{targetNumber > 10 ? "+" : ""} {label}
            </span>
        </div>
    )
})

/* ----------------------------
   Trust Badge
---------------------------- */
const TrustBadge = memo(({ icon: Icon, text, color }) => (
    <div className="flex items-center gap-2">
        <Icon className={`h-4 w-4 ${color}`} />
        <span className="text-sm font-medium text-muted-foreground">{text}</span>
    </div>
))

/* ----------------------------
   CTA Section
---------------------------- */
const CTASection = () => {
    const isMobile = useMobileDetection()

    const handleShopClick = useCallback(() => {
        if (typeof gtag !== "undefined") {
            gtag("event", "cta_click", {
                event_category: "engagement",
                event_label: "shop_collection_cta"
            })
        }
        const el = document.getElementById("shop-section")
        el ? el.scrollIntoView({ behavior: "smooth", block: "start" })
            : window.scrollTo({ top: 0, behavior: "smooth" })
    }, [])

    const handleLookbookClick = useCallback(() => {
        if (typeof gtag !== "undefined") {
            gtag("event", "cta_click", {
                event_category: "engagement",
                event_label: "view_lookbook_cta"
            })
        }
        const el = document.getElementById("lookbook-section")
        if (el) el.scrollIntoView({ behavior: "smooth", block: "start" })
    }, [])

    return (
        <section className="relative py-16 md:py-28 overflow-hidden bg-background">
            {/* Blobs */}
            <div className="absolute inset-0 pointer-events-none">
                <div className="absolute -top-40 -left-40 w-72 h-72 rounded-full blur-3xl bg-accent/15 animate-pulse" />
                <div className="absolute -bottom-40 -right-40 w-96 h-96 rounded-full blur-3xl bg-secondary/15 animate-pulse" />
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 md:px-8">
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-20 items-center">

                    {/* Left Content */}
                    <div className="lg:col-span-3 text-center lg:text-left space-y-6">

                        {/* Counters */}
                        <div className="flex justify-center lg:justify-start gap-6">
                            <SocialProofCounter targetNumber={2847} label="Happy Customers" icon={Heart} color="text-success" />
                            <SocialProofCounter targetNumber={5} label="★ Rating" icon={Star} color="text-warning" />
                        </div>

                        {/* Premium Badge */}
                        <div className="inline-flex items-center gap-2 px-4 py-2.5 liquid-glass-card">
                            <Crown className="h-4 w-4 text-accent" />
                            <span className="text-accent font-bold text-sm tracking-widest">
                                ULTRA PREMIUM • LIMITED STOCK
                            </span>
                        </div>

                        {/* Title */}
                        <h2 className="font-heading tracking-tight leading-[0.9] text-4xl md:text-6xl lg:text-7xl">
                            <span className="block text-transparent bg-clip-text animated-gradient drop-shadow">
                                Elevate
                            </span>
                            <span className="block text-foreground">Your Style</span>
                        </h2>

                        {/* Subtext */}
                        <p className="text-muted-foreground text-lg max-w-xl mx-auto lg:mx-0">
                            <span className="text-accent font-semibold">Premium quality</span> meets{" "}
                            <span className="text-secondary font-semibold">bold expression</span> in every piece.
                        </p>

                        {/* Buttons */}
                        <div className="flex flex-col sm:flex-row gap-4 pt-4">
                            <button
                                onClick={handleShopClick}
                                className="group px-8 py-4 rounded-2xl btn-primary font-semibold flex items-center justify-center gap-3
                  hover:scale-105 hover:shadow-xl transition-all duration-[320ms] shadow-glass"
                            >
                                <Sparkles className="h-5 w-5" />
                                <span>Shop Now</span>
                                <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform duration-[320ms]" />
                            </button>

                            <button
                                onClick={handleLookbookClick}
                                className="px-8 py-4 rounded-2xl liquid-glass-card font-semibold flex items-center justify-center gap-3
                  hover:scale-105 transition-all duration-[320ms]"
                            >
                                <Zap className="h-5 w-5 text-warning" />
                                <span>Lookbook</span>
                            </button>
                        </div>

                        {/* Trust Badges */}
                        <div className="flex flex-wrap justify-center lg:justify-start gap-6 pt-6 border-t border-border">
                            <TrustBadge icon={Shield} text="Secure Payment" color="text-success" />
                            <TrustBadge icon={TrendingUp} text="Free Shipping $100+" color="text-info" />
                            <TrustBadge icon={Clock} text="30-Day Returns" color="text-warning" />
                            <TrustBadge icon={Award} text="Lifetime Warranty" color="text-secondary" />
                        </div>

                        {/* Urgency */}
                        <div className="inline-flex items-center gap-2 px-4 py-2 liquid-glass-strong border border-error/40 bg-error/10">
                            <Clock className="h-4 w-4 text-error animate-pulse" />
                            <span className="text-error font-medium text-sm">
                                Sale ends soon • 67% claimed
                            </span>
                        </div>
                    </div>

                    {/* Right Showcase */}
                    <div className="lg:col-span-2">
                        <div className="relative liquid-glass-card rounded-3xl overflow-hidden aspect-[3/4] max-w-md mx-auto group hover:shadow-xl transition-all duration-[320ms]">
                            <ProgressiveImage
                                src="https://images.unsplash.com/photo-1600185365673-43f63fe17826?auto=format&fit=crop&w=600&q=80"
                                alt="Premium Fashion Collection"
                                className="w-full h-full group-hover:scale-105 transition-transform duration-[320ms]"
                            />
                            <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-background/95 via-background/80 to-transparent">
                                <p className="text-foreground font-bold text-lg mb-1">Elite Collection</p>
                                <div className="flex items-center gap-2 mb-2">
                                    <span className="text-muted-foreground line-through text-sm">$199</span>
                                    <span className="text-secondary font-bold text-xl">$129</span>
                                    <span className="px-2 py-1 bg-error text-error-foreground text-xs font-bold rounded">35% OFF</span>
                                </div>
                                <div className="flex items-center gap-1">
                                    {[1, 2, 3, 4, 5].map(i => <Star key={i} className="w-3 h-3 fill-warning text-warning" />)}
                                    <span className="text-xs text-muted-foreground ml-1">(2,847 reviews)</span>
                                </div>
                            </div>
                            <div className="absolute top-4 right-4 px-3 py-1 bg-error/90 text-error-foreground text-xs font-bold rounded-full animate-pulse">
                                Only 12 left!
                            </div>
                        </div>
                    </div>

                </div>
            </div>
        </section>
    )
}

export default CTASection
