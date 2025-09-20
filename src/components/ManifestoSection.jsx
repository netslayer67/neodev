"use client"

import React, { useRef, useCallback, memo } from "react"
import { motion, useSpring, useMotionValue, useScroll, useTransform, useReducedMotion } from "framer-motion"
import { ArrowRight, Heart, Sparkles, Compass, Star, Play } from "lucide-react"
import Vid from "../assets/vid.webm"

/* ========================= */
/* Utilities */
/* ========================= */
const sanitizeText = (text = "", maxLength = 320) => {
    let s = String(text).slice(0, maxLength)
    s = s.replace(/<[^>]*>?/gm, "").replace(/(javascript:|data:|vbscript:|mailto:)/gi, "")
    return s.trim()
}

const manifestoData = [
    { id: 1, icon: Heart, title: sanitizeText("Soul"), description: sanitizeText("Every thread carries intention"), tone: "error" },
    { id: 2, icon: Compass, title: sanitizeText("Movement"), description: sanitizeText("Designed for your journey"), tone: "accent" },
    { id: 3, icon: Star, title: sanitizeText("Craft"), description: sanitizeText("Premium meets purpose"), tone: "secondary" },
]

/* ========================= */
/* Micro components */
/* ========================= */
const Badge = memo(({ children }) => (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-accent/30 text-accent text-sm font-medium">
        <Sparkles className="w-4 h-4" />
        {children}
    </div>
))

const AnimatedBlob = memo(({ className = "", motionProps = {} }) => {
    const prefersReducedMotion = useReducedMotion()
    if (prefersReducedMotion) return null
    return (
        <motion.div
            {...motionProps}
            animate={{ x: [0, 30, -30, 0], y: [0, -20, 20, 0], scale: [1, 1.18, 0.98, 1] }}
            transition={{ duration: 28, repeat: Infinity, ease: "easeInOut" }}
            className={`${className} rounded-full blur-3xl pointer-events-none`}
        />
    )
})

const PremiumMagneticButton = ({ children, variant = "primary", onClick }) => {
    const ref = React.useRef(null)
    const prefersReducedMotion = useReducedMotion()
    const isMobile = typeof window !== "undefined" && window.innerWidth <= 768
    const x = useMotionValue(0)
    const y = useMotionValue(0)
    const springX = useSpring(x, { stiffness: 160, damping: 20 })
    const springY = useSpring(y, { stiffness: 160, damping: 20 })

    const handleMove = useCallback(
        (e) => {
            if (!ref.current || isMobile || prefersReducedMotion) return
            const rect = ref.current.getBoundingClientRect()
            const relX = e.clientX - rect.left
            const relY = e.clientY - rect.top
            x.set((relX / rect.width - 0.5) * rect.width * 0.2)
            y.set((relY / rect.height - 0.5) * rect.height * 0.2)
        },
        [isMobile, prefersReducedMotion, x, y],
    )

    return (
        <motion.button
            ref={ref}
            onMouseMove={handleMove}
            onMouseLeave={() => { x.set(0); y.set(0) }}
            onClick={onClick}
            style={{ x: springX, y: springY }}
            className={`relative z-10 group rounded-2xl font-medium tracking-wide px-6 py-3 transition-all duration-300 ${variant === "primary"
                    ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground border border-accent/25 hover:from-primary/90 hover:to-primary/70"
                    : "glass-card border border-accent/40 text-accent hover:bg-accent/10"
                }`}
            whileTap={{ scale: 0.985 }}
        >
            <div className="flex items-center gap-3 justify-center">
                {children}
                <ArrowRight className="w-5 h-5 transition-transform duration-300 group-hover:translate-x-1" />
            </div>
        </motion.button>
    )
}

const ValueCard = memo(({ icon: Icon, title, description, tone = "accent", delay = 0, compact = false }) => (
    <motion.article
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-50px" }}
        transition={{ delay, duration: 0.5 }}
        className={`group ${compact ? "p-4" : "p-6"}`}
    >
        <div className="glass-card rounded-2xl border border-border/30 transition-all overflow-hidden">
            <div className={`p-4 ${compact ? "space-y-2" : "space-y-4"} text-center`}>
                <div className={`inline-flex items-center justify-center ${compact ? "w-10 h-10" : "w-14 h-14"} rounded-2xl glass-card border border-${tone}/30`}>
                    <Icon className={`${compact ? "w-5 h-5" : "w-7 h-7"} text-${tone}`} />
                </div>
                <h3 className={`font-heading font-semibold text-${tone} ${compact ? "text-lg" : "text-xl"}`}>{title}</h3>
                <p className={`text-muted-foreground ${compact ? "text-sm" : "text-base"} leading-relaxed`}>{description}</p>
            </div>
        </div>
    </motion.article>
))

/* ========================= */
/* Main Component */
/* ========================= */
const ManifestoSection = ({ disableVideo = false }) => {
    const ref = useRef(null)
    const isMobile = typeof window !== "undefined" && window.innerWidth <= 768
    const prefersReducedMotion = useReducedMotion()

    const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
    const y = prefersReducedMotion ? 0 : useTransform(scrollYProgress, [0, 1], [0, isMobile ? -30 : -60])
    const opacity = prefersReducedMotion ? 1 : useTransform(scrollYProgress, [0, 0.2, 0.9, 1], [0, 1, 1, 0])

    const handleCTA = useCallback(() => {
        console.debug("Manifesto CTA")
    }, [])

    return (
        <section ref={ref} className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
            {/* Animated Blobs */}
            <div className="absolute inset-0 pointer-events-none">
                {!isMobile && (
                    <>
                        <AnimatedBlob className="absolute -top-28 -left-28 w-80 h-80 bg-gradient-to-br from-accent/20 via-info/10 to-transparent" />
                        <AnimatedBlob className="absolute top-28 -right-24 w-64 h-64 bg-gradient-to-bl from-secondary/20 via-warning/10 to-transparent" />
                    </>
                )}
            </div>

            {/* Video */}
            {!disableVideo && !isMobile && (
                <div className="absolute inset-0 z-0">
                    <video
                        src={Vid}
                        autoPlay={!prefersReducedMotion}
                        loop
                        muted
                        playsInline
                        preload="metadata"
                        poster="/assets/vid-poster.jpg"
                        className="w-full h-full object-cover brightness-[.28] contrast-[1.1] saturate-[1.05]"
                        loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-background/96 via-background/75 to-background/96 backdrop-blur-[1px]" />
                </div>
            )}

            {/* Content */}
            <motion.div style={{ opacity, y }} className="relative z-50 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
                <div className={`flex flex-col items-center ${isMobile ? "gap-6" : "gap-8"} text-center`}>
                    <Badge>Our Philosophy</Badge>

                    <h1 className={`font-heading font-bold tracking-tight leading-tight ${isMobile ? "text-3xl px-2" : "text-6xl"}`}>
                        IN SOUL WE MOVE
                    </h1>

                    <p className={`max-w-3xl text-muted-foreground ${isMobile ? "text-sm px-4" : "text-xl"} leading-relaxed`}>
                        Movement is meditation. Style is intention. We craft garments for those who treat getting dressed as ritual.
                    </p>

                    <div className={`w-full ${isMobile ? "grid grid-cols-1 gap-3 px-2" : "grid grid-cols-3 gap-6"} my-6`}>
                        {manifestoData.map((m, i) => (
                            <ValueCard key={m.id} {...m} delay={isMobile ? i * 0.08 : i * 0.12} compact={isMobile} />
                        ))}
                    </div>

                    <div className={`max-w-3xl ${isMobile ? "px-4" : ""}`}>
                        <h2 className={`font-heading font-semibold ${isMobile ? "text-xl" : "text-3xl"}`}>Every stitch tells a story</h2>
                        <p className={`text-muted-foreground ${isMobile ? "text-xs" : "text-base"} mt-2`}>
                            We craft experiences — garments that feel considered, light, and built to last. Simple language, clear purpose.
                        </p>
                    </div>

                    <div className={`flex ${isMobile ? "flex-col gap-3 w-full max-w-xs items-center" : "flex-row gap-4"} mt-2`}>
                        <PremiumMagneticButton variant="primary" onClick={handleCTA}>
                            <Play className="w-4 h-4" />
                            Experience the Story
                        </PremiumMagneticButton>
                        <PremiumMagneticButton variant="accent" onClick={handleCTA}>
                            <Heart className="w-4 h-4" />
                            Join the Movement
                        </PremiumMagneticButton>
                    </div>
                </div>
            </motion.div>
        </section>
    )
}

export default ManifestoSection
