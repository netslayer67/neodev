"use client"

import React, { useRef, useState, useEffect, useCallback, memo } from "react"
import { motion, useSpring, useMotionValue, useScroll, useTransform } from "framer-motion"
import { ArrowRight, Heart, Sparkles, Compass, Star, Play } from "lucide-react"
import Vid from "../assets/vid.mp4"

/* ========================= */
/* Utilities */
/* - small, safe sanitizer */
/* - mobile detection */
/* ========================= */
const sanitizeText = (text = "", maxLength = 320) => {
    let s = String(text).slice(0, maxLength)
    s = s.replace(/<[^>]*>?/gm, "")
    s = s.replace(/(javascript:|data:|vbscript:|mailto:)/gi, "")
    s = s.replace(/[<>"'`\\{}()]/g, "")
    s = s.replace(/(union|select|insert|delete|drop|create|alter|exec|script)/gi, "")
    return s.trim()
}

const useMobile = (breakpoint = 768) => {
    const [isMobile, setIsMobile] = useState(false)
    useEffect(() => {
        if (typeof window === "undefined") return
        const check = () => setIsMobile(window.innerWidth <= breakpoint)
        check()
        window.addEventListener("resize", check)
        return () => window.removeEventListener("resize", check)
    }, [breakpoint])
    return isMobile
}

/* ========================= */
/* Micro components */
/* Keep them minimal and token-driven */
/* ========================= */
const Badge = ({ children }) => (
    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-card border border-accent/30 text-accent text-sm font-medium">
        <Sparkles className="w-4 h-4" />
        {children}
    </div>
)

const AnimatedBlob = memo(({ className = "", motionProps = {} }) => (
    <motion.div
        {...motionProps}
        animate={{
            x: [0, 30, -30, 0],
            y: [0, -20, 20, 0],
            scale: [1, 1.18, 0.98, 1],
        }}
        transition={{ duration: 28, repeat: Number.POSITIVE_INFINITY, ease: "easeInOut" }}
        className={`${className} rounded-full blur-3xl pointer-events-none`}
    />
))

/* ========================= */
/* PremiumMagneticButton */
/* - smaller API, token-driven classes */
/* - motion micro-interactions */
/* ========================= */
const PremiumMagneticButton = ({ children, variant = "primary", onClick }) => {
    const ref = React.useRef(null)
    const isMobile = useMobile()
    const x = useMotionValue(0)
    const y = useMotionValue(0)
    const springX = useSpring(x, { stiffness: 160, damping: 20 })
    const springY = useSpring(y, { stiffness: 160, damping: 20 })

    const handleMove = useCallback(
        (e) => {
            if (!ref.current || isMobile) return
            const rect = ref.current.getBoundingClientRect()
            const relX = e.clientX - rect.left
            const relY = e.clientY - rect.top
            const xPct = (relX / rect.width - 0.5) * 0.3
            const yPct = (relY / rect.height - 0.3) * 0.25
            x.set(xPct * rect.width)
            y.set(yPct * rect.height)
        },
        [isMobile, x, y],
    )

    return (
        <motion.button
            ref={ref}
            onMouseMove={handleMove}
            onMouseLeave={() => {
                x.set(0)
                y.set(0)
            }}
            onClick={onClick}
            style={{ x: springX, y: springY }}
            className={`relative z-10 group rounded-2xl font-medium tracking-wide focus:outline-none focus-visible:ring-2 focus-visible:ring-accent transition-all duration-[320ms] ease-cubic-bezier-33 px-6 py-3 ${isMobile ? "text-sm" : "text-base"
                } ${variant === "primary"
                    ? "bg-gradient-to-r from-primary to-primary/80 text-primary-foreground border border-accent/25 hover:from-primary/90 hover:to-primary/70"
                    : variant === "accent"
                        ? "glass-card border border-accent/40 text-accent hover:bg-accent/10"
                        : "bg-secondary text-secondary-foreground"
                }`}
            whileTap={{ scale: 0.985 }}
        >
            <div className="flex items-center gap-3 justify-center">
                {children}
                <ArrowRight className="w-5 h-5 transition-transform duration-[320ms] group-hover:translate-x-1" />
            </div>
        </motion.button>
    )
}

/* ========================= */
/* Value Card */
/* - accessible, performant */
/* ========================= */
const ValueCard = ({ icon: Icon, title, description, tone = "accent", delay = 0, compact = false }) => (
    <motion.article
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ delay, duration: 0.7 }}
        className={`group ${compact ? "p-4" : "p-6"}`}
    >
        <div className="glass-card rounded-2xl border border-border/30 transition-all duration-[320ms] overflow-hidden">
            <div className={`p-4 ${compact ? "space-y-2" : "space-y-4"} text-center`}>
                <div
                    className={`inline-flex items-center justify-center ${compact ? "w-10 h-10" : "w-14 h-14"} rounded-2xl glass-card border border-${tone}/30 group-hover:border-${tone}/60 transition-all duration-[320ms]`}
                >
                    <Icon className={`${compact ? "w-5 h-5" : "w-7 h-7"} text-${tone}`} />
                </div>
                <h3 className={`font-heading font-semibold text-${tone} ${compact ? "text-lg" : "text-xl"}`}>
                    {sanitizeText(title)}
                </h3>
                <p className={`text-muted-foreground ${compact ? "text-sm" : "text-base"} leading-relaxed`}>
                    {sanitizeText(description)}
                </p>
            </div>
            <div
                className={`absolute inset-0 bg-gradient-to-br from-${tone}/6 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-[320ms] pointer-events-none`}
            />
        </div>
    </motion.article>
)

/* ========================= */
/* Main component */
/* - respects reduced motion */
/* - lazy video + poster */
/* - compact mobile layout */
/* - token-driven styling */
/* ========================= */
const ManifestoSection = ({ disableVideo = false }) => {
    const ref = useRef(null)
    const isMobile = useMobile()
    const prefersReduced =
        typeof window !== "undefined" && window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches

    const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] })
    const y = useTransform(scrollYProgress, [0, 1], [0, isMobile ? -30 : -60])
    const opacity = useTransform(scrollYProgress, [0, 0.2, 0.9, 1], [0, 1, 1, 0])

    const manifesto = [
        { id: 1, icon: Heart, title: "Soul", description: "Every thread carries intention", tone: "error" },
        { id: 2, icon: Compass, title: "Movement", description: "Designed for your journey", tone: "accent" },
        { id: 3, icon: Star, title: "Craft", description: "Premium meets purpose", tone: "secondary" },
    ]

    const handleCTA = useCallback(() => {
        // light handler - integration point
        console.debug("Manifesto CTA")
    }, [])

    return (
        <section ref={ref} className="relative min-h-[80vh] flex items-center justify-center overflow-hidden">
            {/* ambient blobs */}
            <div className="absolute inset-0 pointer-events-none">
                {!isMobile && (
                    <>
                        <AnimatedBlob className="absolute -top-28 -left-28 w-80 h-80 bg-gradient-to-br from-accent/20 via-info/10 to-transparent" />
                        <AnimatedBlob className="absolute top-28 -right-24 w-64 h-64 bg-gradient-to-bl from-secondary/20 via-warning/10 to-transparent" />
                        <AnimatedBlob className="absolute bottom-6 left-1/4 w-56 h-56 bg-gradient-to-tr from-success/18 via-error/10 to-transparent" />
                    </>
                )}
                {isMobile && (
                    <div className="absolute -top-20 -left-20 w-40 h-40 bg-gradient-to-br from-accent/15 to-transparent rounded-full blur-2xl" />
                )}
            </div>

            {/* optional, lazy video background (perf-friendly) */}
            {!disableVideo && (
                <div className="absolute inset-0 z-0">
                    <video
                        src={Vid}
                        autoPlay={!prefersReduced}
                        loop
                        muted
                        playsInline
                        preload="metadata"
                        poster="/assets/vid-poster.jpg"
                        className={`w-full h-full object-cover brightness-[.28] contrast-[1.1] saturate-[1.05] ${isMobile ? "aspect-[9/16]" : ""
                            }`}
                        style={
                            isMobile
                                ? {
                                    width: "100%",
                                    height: "100%",
                                    objectFit: "cover",
                                    aspectRatio: "9/16",
                                }
                                : {}
                        }
                        aria-hidden
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-background/96 via-background/75 to-background/96 backdrop-blur-[1px]" />
                </div>
            )}

            {/* content */}
            <motion.div style={{ opacity, y }} className="relative z-50 w-full max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-10">
                <div className={`flex flex-col items-center ${isMobile ? "gap-6" : "gap-8"} text-center`}>
                    <Badge>Our Philosophy</Badge>

                    <h1
                        className={`font-heading font-bold tracking-tight leading-tight ${isMobile ? "text-3xl px-2" : "text-6xl"}`}
                    >
                        IN SOUL WE MOVE
                    </h1>

                    <p className={`max-w-3xl text-muted-foreground ${isMobile ? "text-sm px-4" : "text-xl"} leading-relaxed`}>
                        Movement is meditation. Style is intention. We craft garments for those who treat getting dressed as ritual.
                    </p>

                    {/* values: compact on mobile */}
                    <div className={`w-full ${isMobile ? "grid grid-cols-1 gap-3 px-2" : "grid grid-cols-3 gap-6"} my-6`}>
                        {manifesto.map((m, i) => (
                            <ValueCard
                                key={m.id}
                                icon={m.icon}
                                title={m.title}
                                description={m.description}
                                tone={m.tone}
                                delay={isMobile ? i * 0.08 : i * 0.12}
                                compact={isMobile}
                            />
                        ))}
                    </div>

                    {/* secondary text */}
                    <div className={`max-w-3xl ${isMobile ? "px-4" : ""}`}>
                        <h2 className={`font-heading font-semibold ${isMobile ? "text-xl" : "text-3xl"}`}>
                            Every stitch tells a story
                        </h2>
                        <p className={`text-muted-foreground ${isMobile ? "text-xs" : "text-base"} mt-2`}>
                            We craft experiences — garments that feel considered, light, and built to last. Simple language, clear
                            purpose.
                        </p>
                    </div>

                    {/* CTA */}
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
