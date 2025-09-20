"use client"

import React, {
    useState,
    useEffect,
    useRef,
    useMemo,
    useCallback,
    memo,
} from "react"
import { motion } from "framer-motion"
import {
    ArrowRight,
    Eye,
    Sparkles,
    Camera,
    Play,
    Heart,
    Share2,
} from "lucide-react"

/* ---------------------
   Utils
   --------------------- */
const sanitizeInput = (value = "", maxLength = 100) => {
    if (!value) return ""
    let sanitized = String(value).slice(0, maxLength)
    sanitized = sanitized
        .replace(/<[^>]*>?/gm, "")
        .replace(/(javascript:|data:|vbscript:|mailto:|https?:\/\/[^\s]+)/gi, "")
        .replace(/[<>"'`\\{}()]/g, "")
    return sanitized.trim()
}

/* ---------------------
   Small hooks
   --------------------- */
const useProgressiveLoad = (delay = 800) => {
    const [stage, setStage] = useState(0)
    useEffect(() => {
        const t1 = setTimeout(() => setStage(1), Math.round(delay * 0.4))
        const t2 = setTimeout(() => setStage(2), delay)
        return () => {
            clearTimeout(t1)
            clearTimeout(t2)
        }
    }, [delay])
    return stage
}

const useMobileDetection = () => {
    const [isMobile, setIsMobile] = useState(false)
    const [isTablet, setIsTablet] = useState(false)
    useEffect(() => {
        if (typeof window === "undefined") return
        const check = () => {
            const w = window.innerWidth
            const touch = "ontouchstart" in window
            setIsMobile(w <= 768)
            setIsTablet(w > 768 && w <= 1024 && touch)
        }
        check()
        let tid = null
        const onResize = () => {
            if (tid) cancelAnimationFrame(tid)
            tid = requestAnimationFrame(check)
        }
        window.addEventListener("resize", onResize, { passive: true })
        return () => {
            window.removeEventListener("resize", onResize)
            if (tid) cancelAnimationFrame(tid)
        }
    }, [])
    return { isMobile, isTablet }
}

/* ---------------------
   Sample data
   --------------------- */
const galleryCollections = [
    { id: 1, src: "https://images.unsplash.com/photo-1551232864-3f0890e58e48?q=80&w=800&auto=format&fit=crop&fm=webp", category: "Urban Essentials", subtitle: "City Movement", description: "Designed for the modern nomad", color: "accent", featured: true, likes: 847, views: 12400 },
    { id: 2, src: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=800&auto=format&fit=crop&fm=webp", category: "Signature Tees", subtitle: "Core Collection", description: "Premium comfort meets style", color: "secondary", featured: false, likes: 623, views: 9800 },
    { id: 3, src: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop&fm=webp", category: "Outerwear", subtitle: "Weather Ready", description: "Performance meets elegance", color: "warning", featured: true, likes: 1205, views: 18600 },
    { id: 4, src: "https://images.unsplash.com/photo-1509909241434-e3436def94f2?q=80&w=800&auto=format&fit=crop&fm=webp", category: "Headwear", subtitle: "Crown Collection", description: "Crowned with intention", color: "info", featured: false, likes: 432, views: 7200 },
    { id: 5, src: "https://images.unsplash.com/photo-1545231027-637d2f6210f8?q=80&w=800&auto=format&fit=crop&fm=webp", category: "Limited Edition", subtitle: "Soul Series", description: "Where soul meets fabric", color: "success", featured: true, likes: 1847, views: 26800 },
    { id: 6, src: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=800&auto=format&fit=crop&fm=webp", category: "Accessories", subtitle: "Complete Look", description: "Details that define", color: "error", featured: false, likes: 345, views: 5900 },
    // ... bisa bertambah puluhan/ratus item
]

/* ---------------------
   Extra styles
   --------------------- */
const ExtraStyles = () => (
    <style>{`
    @keyframes shimmerX {
      0% { transform: translateX(-100%); }
      100% { transform: translateX(100%); }
    }
    .shimmer {
      position: absolute;
      inset: 0;
      background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.07) 50%, rgba(255,255,255,0) 100%);
      transform: translateX(-100%);
      will-change: transform;
      animation: shimmerX 1.3s linear infinite;
    }
    .scrollbar-hide { scrollbar-width: none; -ms-overflow-style: none; }
    .scrollbar-hide::-webkit-scrollbar { display: none; }
  `}</style>
)

/* ---------------------
   PremiumShimmer
   --------------------- */
const PremiumShimmer = memo(({ className = "" }) => (
    <div className={`relative overflow-hidden bg-card/60 ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-r from-card/40 via-card/60 to-card/40" />
        <div className="shimmer" aria-hidden="true" />
    </div>
))

/* ---------------------
   PremiumGalleryCard
   --------------------- */
const PremiumGalleryCard = memo(function PremiumGalleryCard({
    item,
    loadingStage,
    isMobile,
    onInteract,
}) {
    const [isLiked, setIsLiked] = useState(false)
    const [imageLoaded, setImageLoaded] = useState(false)

    const handleLike = useCallback(
        (e) => {
            e.stopPropagation()
            setIsLiked((s) => !s)
            onInteract?.(item.id, "like")
        },
        [item.id, onInteract]
    )
    const handleShare = useCallback(
        (e) => {
            e.stopPropagation()
            onInteract?.(item.id, "share")
        },
        [item.id, onInteract]
    )

    const cardDimensions = isMobile
        ? "min-w-[85%] max-w-[90%] h-[420px]"
        : "w-[420px] h-[580px]"

    return (
        <div
            className={`relative group cursor-pointer ${cardDimensions} flex-shrink-0 snap-start`}
            role="article"
            aria-label={sanitizeInput(item.category)}
            style={{ willChange: "transform, opacity" }}
        >
            <div className="relative h-full rounded-2xl overflow-hidden glass-card border border-border/20 shadow-xl">
                {loadingStage < 2 ? (
                    <PremiumShimmer className="absolute inset-0 rounded-2xl" />
                ) : (
                    <>
                        <div className="relative h-full overflow-hidden">
                            <img
                                src={item.src || "/placeholder.svg"}
                                alt={sanitizeInput(item.category)}
                                loading="lazy"
                                decoding="async"
                                className={`w-full h-full object-cover transition-opacity duration-500 ${imageLoaded ? "opacity-100" : "opacity-0"
                                    } group-hover:scale-105 transform-gpu`}
                                onLoad={() => setImageLoaded(true)}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent pointer-events-none" />
                        </div>

                        <div
                            className={`absolute inset-0 flex flex-col justify-between z-10 ${isMobile ? "p-4" : "p-6"
                                }`}
                        >
                            <div className="flex justify-between items-start">
                                {item.featured && (
                                    <div className="px-2.5 py-1 rounded-full glass-card border border-accent/30 backdrop-blur-md">
                                        <div className="flex items-center gap-1">
                                            <Sparkles className="w-3 h-3 text-accent" />
                                            <span className="text-xs font-medium text-accent">
                                                Featured
                                            </span>
                                        </div>
                                    </div>
                                )}

                            </div>

                            <div className={`space-y-3 ${isMobile ? "space-y-2" : "space-y-4"}`}>
                                <div className="flex items-center gap-4 text-xs text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <Eye className="w-3 h-3" />
                                        <span>{(item.views / 1000).toFixed(1)}k</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Heart className="w-3 h-3" />
                                        <span>{item.likes}</span>
                                    </div>
                                </div>

                                <div className={`space-y-1 ${isMobile ? "space-y-1" : "space-y-2"}`}>
                                    <div>
                                        <h3
                                            className={`font-heading font-bold text-foreground tracking-tight ${isMobile ? "text-xl" : "text-3xl"
                                                }`}
                                        >
                                            {sanitizeInput(item.category)}
                                        </h3>
                                        <p
                                            className={`text-accent font-medium ${isMobile ? "text-sm" : "text-base"
                                                }`}
                                        >
                                            {sanitizeInput(item.subtitle)}
                                        </p>
                                    </div>

                                    <p
                                        className={`text-muted-foreground leading-relaxed ${isMobile ? "text-xs" : "text-sm"
                                            }`}
                                    >
                                        {sanitizeInput(item.description)}
                                    </p>
                                </div>

                                <button
                                    className={`group inline-flex items-center gap-2 rounded-xl glass-card border border-accent/30 hover:border-accent/60 transition-all duration-200 hover:scale-[1.01] ${isMobile ? "px-3 py-2 text-sm" : "px-4 py-3 text-base"
                                        }`}
                                >
                                    <Camera className="w-4 h-4 text-accent" />
                                    <span className="font-medium text-accent">Explore Look</span>
                                    <ArrowRight className="w-4 h-4 text-accent transition-transform duration-200 group-hover:translate-x-0.5" />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </div>
    )
})

/* ---------------------
   VirtualizedHorizontal
   --------------------- */
const VirtualizedHorizontal = ({ items, isMobile, loadingStage, onInteract }) => {
    const containerRef = useRef(null)
    const [containerWidth, setContainerWidth] = useState(0)
    const [scrollLeft, setScrollLeft] = useState(0)
    const [renderRange, setRenderRange] = useState([0, Math.min(6, items.length)])
    const rafRef = useRef(null)

    const cardWidth = isMobile ? 320 : 444 // approx card + gap

    useEffect(() => {
        const el = containerRef.current
        if (!el) return
        const onResize = () => setContainerWidth(el.clientWidth)
        onResize()
        const ro = new ResizeObserver(onResize)
        ro.observe(el)
        return () => ro.disconnect()
    }, [])

    const computeRange = useCallback(() => {
        const visibleCount = Math.ceil(containerWidth / cardWidth) || 1
        const buffer = Math.max(3, visibleCount)
        const startIndex = Math.max(0, Math.floor(scrollLeft / cardWidth) - buffer)
        const endIndex = Math.min(items.length, startIndex + visibleCount + buffer * 2)
        setRenderRange([startIndex, endIndex])
    }, [containerWidth, scrollLeft, cardWidth, items.length])

    useEffect(() => {
        computeRange()
    }, [computeRange])

    useEffect(() => {
        const el = containerRef.current
        if (!el) return
        const onScroll = () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current)
            rafRef.current = requestAnimationFrame(() => {
                setScrollLeft(el.scrollLeft)
            })
        }
        el.addEventListener("scroll", onScroll, { passive: true })
        return () => {
            el.removeEventListener("scroll", onScroll)
            if (rafRef.current) cancelAnimationFrame(rafRef.current)
        }
    }, [])

    useEffect(() => {
        computeRange()
    }, [scrollLeft, computeRange])

    const [start, end] = renderRange
    const leadingSpacerWidth = start * cardWidth
    const trailingSpacerWidth =
        Math.max(0, items.length * cardWidth - leadingSpacerWidth - (end - start) * cardWidth)

    return (
        <div
            ref={containerRef}
            className={`flex gap-4 md:gap-6 overflow-x-auto overflow-y-hidden snap-x snap-mandatory scroll-smooth scrollbar-hide ${isMobile ? "px-4 -mx-4 pb-4" : "px-8 -mx-8"
                }`}
            style={{ WebkitOverflowScrolling: "touch" }}
        >
            <div style={{ width: leadingSpacerWidth }} />
            {items.slice(start, end).map((item) => (
                <PremiumGalleryCard
                    key={item.id}
                    item={item}
                    loadingStage={loadingStage}
                    isMobile={isMobile}
                    onInteract={onInteract}
                />
            ))}
            <div style={{ width: trailingSpacerWidth }} />
        </div>
    )
}

/* ---------------------
   LookbookSection
   --------------------- */
const LookbookSection = () => {
    const loadingStage = useProgressiveLoad(1000)
    const { isMobile } = useMobileDetection()
    const [activeFilter, setActiveFilter] = useState("all")

    const handleCardInteraction = useCallback((cardId, action) => {
        // analytics / events
    }, [])

    const filteredItems = useMemo(() => {
        if (activeFilter === "all") return galleryCollections
        if (activeFilter === "featured")
            return galleryCollections.filter((it) => it.featured)
        return galleryCollections.filter((it) => it.color === activeFilter)
    }, [activeFilter])

    const showBackgroundMotion = !isMobile

    return (
        <section
            className={`relative overflow-hidden ${isMobile ? "py-12" : "py-16 md:py-24"}`}
        >
            <ExtraStyles />
            {showBackgroundMotion && (
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full blur-3xl bg-gradient-to-br from-accent/10 via-info/5 to-transparent" />
                    <div className="absolute top-1/3 -right-40 w-80 h-80 rounded-full blur-3xl bg-gradient-to-bl from-secondary/15 via-warning/10 to-transparent" />
                </div>
            )}

            <div
                className={`relative z-10 max-w-7xl mx-auto ${isMobile ? "px-4" : "px-4 sm:px-6 lg:px-8"
                    }`}
            >
                <motion.div
                    className={`text-center ${isMobile ? "mb-8" : "mb-12 md:mb-16"}`}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, ease: "easeOut" }}
                >
                    <div
                        className={`inline-flex items-center gap-2 rounded-full glass-card border border-accent/30 ${isMobile ? "px-4 py-2 mb-4" : "px-6 py-3 mb-6"
                            }`}
                    >
                        <Camera className="w-4 h-4 text-accent" />
                        <span className="text-sm font-medium text-accent">
                            Lookbook 2025
                        </span>
                    </div>

                    <h2
                        className={`font-heading font-bold tracking-tight mb-4 ${isMobile ? "text-3xl" : "text-6xl"
                            }`}
                    >
                        <span className="bg-gradient-to-r from-secondary via-accent to-info bg-clip-text text-transparent">
                            Visual
                        </span>{" "}
                        <span className="text-foreground">Stories</span>
                    </h2>

                    <p
                        className={`text-muted-foreground max-w-2xl mx-auto leading-relaxed ${isMobile ? "text-sm px-4" : "text-xl"
                            }`}
                    >
                        Every piece tells a story of{" "}
                        <span className="text-accent font-medium">movement</span>,
                        <span className="text-secondary font-medium"> intention</span>, and
                        <span className="text-info font-medium"> soul</span>.
                    </p>
                </motion.div>

                <motion.div
                    className={`flex justify-center ${isMobile ? "mb-6" : "mb-8"}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4, duration: 0.6 }}
                >
                    <div className="flex items-center gap-2 text-muted-foreground/70 text-sm">
                        <Play className="w-4 h-4 animate-pulse" />
                        <span>
                            {isMobile ? "Swipe to explore" : "Scroll to explore the collection"}
                        </span>
                    </div>
                </motion.div>

                <VirtualizedHorizontal
                    items={filteredItems}
                    isMobile={isMobile}
                    loadingStage={loadingStage}
                    onInteract={handleCardInteraction}
                />

                <motion.div
                    className={`text-center ${isMobile ? "mt-12" : "mt-16"}`}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.6, duration: 0.5 }}
                >
                    <button
                        className={`group glass-card border border-accent/30 hover:border-accent/60 rounded-2xl transition-all duration-200 hover:scale-[1.01] hover:shadow-lg ${isMobile ? "px-6 py-3" : "px-8 py-4"
                            }`}
                        onClick={() => { }}
                    >
                        <div className="flex items-center gap-3">
                            <span
                                className={`font-medium text-accent ${isMobile ? "text-base" : "text-lg"
                                    }`}
                            >
                                View Complete Collection
                            </span>
                            <ArrowRight className="w-5 h-5 text-accent transition-transform duration-200 group-hover:translate-x-0.5" />
                        </div>
                    </button>
                </motion.div>
            </div>
        </section>
    )
}

export default LookbookSection
