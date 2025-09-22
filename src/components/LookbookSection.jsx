"use client"

import React, {
    useState,
    useEffect,
    useRef,
    useMemo,
    useCallback,
    memo,
} from "react"
import { motion, useReducedMotion } from "framer-motion"
import {
    ArrowRight,
    Eye,
    Sparkles,
    Camera,
    Play,
    Heart,
} from "lucide-react"
import PropTypes from "prop-types"

/* ---------------------
   Sample data
   --------------------- */
export const galleryCollections = [
    { id: 1, src: "https://images.unsplash.com/photo-1551232864-3f0890e58e48?q=80&w=800&auto=format&fit=crop&fm=webp", category: "Urban Essentials", subtitle: "City Movement", description: "Designed for the modern nomad", color: "accent", featured: true, likes: 847, views: 12400 },
    { id: 2, src: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=800&auto=format&fit=crop&fm=webp", category: "Signature Tees", subtitle: "Core Collection", description: "Premium comfort meets style", color: "secondary", featured: false, likes: 623, views: 9800 },
    { id: 3, src: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop&fm=webp", category: "Outerwear", subtitle: "Weather Ready", description: "Performance meets elegance", color: "warning", featured: true, likes: 1205, views: 18600 },
    { id: 4, src: "https://images.unsplash.com/photo-1509909241434-e3436def94f2?q=80&w=800&auto=format&fit=crop&fm=webp", category: "Headwear", subtitle: "Crown Collection", description: "Crowned with intention", color: "info", featured: false, likes: 432, views: 7200 },
    { id: 5, src: "https://images.unsplash.com/photo-1545231027-637d2f6210f8?q=80&w=800&auto=format&fit=crop&fm=webp", category: "Limited Edition", subtitle: "Soul Series", description: "Where soul meets fabric", color: "success", featured: true, likes: 1847, views: 26800 },
    // { id: 6, src: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=800&auto=format&fit=crop&fm=webp", category: "Accessories", subtitle: "Complete Look", description: "Details that define", color: "error", featured: false, likes: 345, views: 5900 },
]

/* ----------------------------------
   Utilities
   ---------------------------------- */
const sanitizeInput = (value = "", maxLength = 120) => {
    if (!value) return ""
    let sanitized = String(value).slice(0, maxLength)
    sanitized = sanitized
        .replace(/<[^>]*>?/gm, "")
        .replace(/(?:javascript:|data:|vbscript:|mailto:|file:|https?:\/\/[^"]+)/gi, "")
        .replace(/[<>"'`\\{}()]/g, "")
    return sanitized.trim()
}

const TRANSITION = { duration: 0.32, ease: [0.4, 0, 0.2, 1] }

const useProgressiveLoad = (delay = 800) => {
    const [stage, setStage] = useState(0)
    useEffect(() => {
        const t1 = setTimeout(() => setStage(1), Math.round(delay * 0.35))
        const t2 = setTimeout(() => setStage(2), delay)
        return () => {
            clearTimeout(t1)
            clearTimeout(t2)
        }
    }, [delay])
    return stage
}

const useDevice = () => {
    const [isMobile, setIsMobile] = useState(false)
    useEffect(() => {
        if (typeof window === "undefined") return
        const mq = window.matchMedia("(max-width: 768px)")
        const update = () => setIsMobile(Boolean(mq.matches))
        update()
        if (mq.addEventListener) mq.addEventListener("change", update)
        else mq.addListener(update)
        return () => {
            if (mq.removeEventListener) mq.removeEventListener("change", update)
            else mq.removeListener(update)
        }
    }, [])
    return { isMobile }
}

/* ----------------------------------
   Extra inline styles
   ---------------------------------- */
const ExtraStyles = () => (
    <style>{`
    @keyframes shimmerX { 0% { transform: translateX(-100%)} 100% { transform: translateX(100%)} }
    .shimmer { position: absolute; inset: 0; background: linear-gradient(90deg, rgba(255,255,255,0) 0%, rgba(255,255,255,0.06) 50%, rgba(255,255,255,0) 100%); transform: translateX(-100%); animation: shimmerX 1.2s linear infinite; }
    .scrollbar-hide { scrollbar-width: none; -ms-overflow-style: none; }
    .scrollbar-hide::-webkit-scrollbar { display: none; }
    .blob-float { animation: float-blob 24s ease-in-out infinite; will-change: transform, opacity; }
    @keyframes float-blob { 0%{transform:translate3d(0,0,0) scale(1)}50%{transform:translate3d(30px,-18px,0) scale(1.04)}100%{transform:translate3d(0,0,0) scale(1)} }
  `}</style>
)

/* ----------------------------------
   Shimmer placeholder
   ---------------------------------- */
const PremiumShimmer = memo(({ className = "" }) => (
    <div className={`relative overflow-hidden bg-card/60 ${className}`} aria-hidden>
        <div className="absolute inset-0 bg-gradient-to-r from-card/40 via-card/60 to-card/40" />
        <div className="shimmer" />
    </div>
))

PremiumShimmer.displayName = "PremiumShimmer"

/* ----------------------------------
   Gallery Card
   ---------------------------------- */
const GalleryCard = memo(function GalleryCard({ item, stage, isMobile, onAction }) {
    const [imageLoaded, setImageLoaded] = useState(false)
    const reduced = useReducedMotion()

    const handleAction = useCallback((e, type) => {
        e.stopPropagation()
        onAction?.(item.id, type)
    }, [item.id, onAction])

    const cardSize = isMobile ? "min-w-[82%] max-w-[92%] h-[420px]" : "w-[420px] h-[560px]"

    return (
        <article
            role="article"
            aria-label={sanitizeInput(item.category)}
            className={`relative group ${cardSize} flex-shrink-0 snap-start`}
            style={{ willChange: "transform, opacity" }}
        >
            <div className="relative h-full rounded-2xl overflow-hidden liquid-glass-card border border-border/20 shadow-glass transition-all duration-[320ms] ease-[cubic-bezier(0.4,0,0.2,1)] group-hover:translate-y-[-4px]">
                {stage < 2 ? (
                    <PremiumShimmer className="absolute inset-0 rounded-2xl" />
                ) : (
                    <>
                        <div className="relative h-full overflow-hidden">
                            <img
                                src={item.src || "/placeholder.svg"}
                                alt={sanitizeInput(item.category)}
                                loading="lazy"
                                decoding="async"
                                className={`w-full h-full object-cover transform-gpu transition-all duration-[480ms] ${imageLoaded ? "opacity-100" : "opacity-0"} group-hover:scale-105`}
                                onLoad={() => setImageLoaded(true)}
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-background/96 via-background/30 to-transparent pointer-events-none" />
                        </div>

                        <div className={`absolute inset-0 z-10 flex flex-col justify-between ${isMobile ? "p-4" : "p-6"}`}>
                            <div className="flex items-start justify-between">
                                {item.featured && (
                                    <div className="inline-flex items-center gap-2 px-2.5 py-1 rounded-full liquid-glass border border-accent/30 backdrop-blur-md">
                                        <Sparkles className="w-3 h-3 text-accent" />
                                        <span className="text-xs font-medium text-accent">Featured</span>
                                    </div>
                                )}

                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                    <div className="flex items-center gap-1">
                                        <Eye className="w-3 h-3" />
                                        <span>{(item.views / 1000).toFixed(1)}k</span>
                                    </div>
                                    <div className="flex items-center gap-1">
                                        <Heart className="w-3 h-3" />
                                        <span>{item.likes}</span>
                                    </div>
                                </div>
                            </div>

                            <div className={`space-y-3 ${isMobile ? "space-y-2" : "space-y-4"}`}>
                                <div>
                                    <h3 className={`font-heading font-bold tracking-tight ${isMobile ? "text-xl" : "text-3xl"} text-foreground`}>{sanitizeInput(item.category)}</h3>
                                    <div className={`text-accent font-medium ${isMobile ? "text-sm" : "text-base"}`}>{sanitizeInput(item.subtitle)}</div>
                                </div>

                                <p className={`text-muted-foreground leading-relaxed ${isMobile ? "text-xs" : "text-sm"}`}>{sanitizeInput(item.description)}</p>

                                <div className="flex items-center gap-3">
                                    <button
                                        onClick={(e) => handleAction(e, "view")}
                                        className={`inline-flex items-center gap-2 rounded-xl liquid-glass border border-accent/30 hover:border-accent/60 transition-all duration-[320ms] px-4 py-2 ${isMobile ? "text-sm" : "text-base"}`}
                                        aria-label="Explore look"
                                    >
                                        <Camera className="w-4 h-4 text-accent" />
                                        <span className="font-medium text-accent">Explore</span>
                                        <ArrowRight className="w-4 h-4 text-accent transition-transform duration-[320ms] group-hover:translate-x-0.5" />
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </article>
    )
})

GalleryCard.displayName = "GalleryCard"
GalleryCard.propTypes = {
    item: PropTypes.object.isRequired,
    stage: PropTypes.number,
    isMobile: PropTypes.bool,
    onAction: PropTypes.func,
}

/* ----------------------------------
   Virtualized horizontal scroller
   ---------------------------------- */
const VirtualizedHorizontal = memo(function VirtualizedHorizontal({ items, isMobile, stage, onAction }) {
    const containerRef = useRef(null)
    const [containerWidth, setContainerWidth] = useState(0)
    const [scrollLeft, setScrollLeft] = useState(0)
    const rafRef = useRef(null)

    const cardWidth = isMobile ? 320 : 444

    useEffect(() => {
        const el = containerRef.current
        if (!el) return
        const resize = () => setContainerWidth(el.clientWidth)
        resize()
        const ro = new ResizeObserver(resize)
        ro.observe(el)
        return () => ro.disconnect()
    }, [])

    useEffect(() => {
        const el = containerRef.current
        if (!el) return
        const onScroll = () => {
            if (rafRef.current) cancelAnimationFrame(rafRef.current)
            rafRef.current = requestAnimationFrame(() => setScrollLeft(el.scrollLeft))
        }
        el.addEventListener("scroll", onScroll, { passive: true })
        return () => {
            el.removeEventListener("scroll", onScroll)
            if (rafRef.current) cancelAnimationFrame(rafRef.current)
        }
    }, [])

    const visibleCount = Math.max(1, Math.ceil(containerWidth / cardWidth))
    const buffer = Math.max(3, visibleCount)
    const startIdx = Math.max(0, Math.floor(scrollLeft / cardWidth) - buffer)
    const endIdx = Math.min(items.length, startIdx + visibleCount + buffer * 2)

    const leadingWidth = startIdx * cardWidth
    const trailingWidth = Math.max(0, items.length * cardWidth - leadingWidth - (endIdx - startIdx) * cardWidth)

    return (
        <div
            ref={containerRef}
            className={`flex gap-4 md:gap-6 overflow-x-auto overflow-y-hidden snap-x snap-mandatory scroll-smooth scrollbar-hide ${isMobile ? "px-4 -mx-4 pb-6" : "px-8 -mx-8"}`}
            style={{ WebkitOverflowScrolling: "touch" }}
        >
            <div style={{ width: leadingWidth }} />
            {items.slice(startIdx, endIdx).map((it) => (
                <GalleryCard key={it.id} item={it} stage={stage} isMobile={isMobile} onAction={onAction} />
            ))}
            <div style={{ width: trailingWidth }} />
        </div>
    )
})

VirtualizedHorizontal.displayName = "VirtualizedHorizontal"
VirtualizedHorizontal.propTypes = {
    items: PropTypes.array.isRequired,
    isMobile: PropTypes.bool,
    stage: PropTypes.number,
    onAction: PropTypes.func,
}

/* ----------------------------------
   LookbookSection (export)
   ---------------------------------- */
const LookbookSection = ({ collections = galleryCollections }) => {
    const stage = useProgressiveLoad(900)
    const { isMobile } = useDevice()
    const reducedMotion = useReducedMotion()

    const handleAction = useCallback((id, type) => {
        console.log("interaction", { id, type })
    }, [])

    const items = useMemo(() => {
        if (!collections || collections.length === 0) return []
        return collections
    }, [collections])

    return (
        <section className={`relative overflow-hidden ${isMobile ? "py-12" : "py-16 md:py-24"}`}>
            <ExtraStyles />

            {/* decorative blobs */}
            {!isMobile && (
                <div className="absolute inset-0 pointer-events-none">
                    <div className="absolute -top-40 -left-40 w-96 h-96 rounded-full blur-3xl blob-float bg-accent/12" />
                    <div className="absolute top-1/3 -right-40 w-80 h-80 rounded-full blur-3xl blob-float bg-secondary/10" />
                </div>
            )}

            <div className={`relative z-10 max-w-7xl mx-auto ${isMobile ? "px-4" : "px-4 sm:px-6 lg:px-8"}`}>
                <motion.div
                    initial={{ opacity: 0, y: 18 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={reducedMotion ? { duration: 0 } : { ...TRANSITION, delay: 0.08 }}
                    className={`text-center ${isMobile ? "mb-8" : "mb-12 md:mb-16"}`}
                >
                    <div className={`inline-flex items-center gap-2 rounded-full liquid-glass border border-accent/30 ${isMobile ? "px-4 py-2 mb-4" : "px-6 py-3 mb-6"}`}>
                        <Camera className="w-4 h-4 text-accent" />
                        <span className="text-sm font-medium text-accent">Lookbook</span>
                    </div>

                    <h2 className={`font-heading font-bold tracking-tight mb-4 ${isMobile ? "text-3xl" : "text-5xl"}`}>
                        <span className="bg-gradient-to-r from-secondary via-accent to-info bg-clip-text text-transparent">Visual</span>{" "}
                        <span className="text-foreground">Stories</span>
                    </h2>

                    <p className={`text-muted-foreground max-w-2xl mx-auto leading-relaxed ${isMobile ? "text-sm px-4" : "text-lg"}`}>
                        Each drop is crafted for motion — intent, form, and depth.
                    </p>
                </motion.div>

                <motion.div
                    className={`flex items-center justify-center ${isMobile ? "mb-6" : "mb-8"}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={reducedMotion ? { duration: 0 } : { ...TRANSITION, delay: 0.36 }}
                >
                    <div className="flex items-center gap-2 text-muted-foreground/80 text-sm">
                        <Play className="w-4 h-4 animate-pulse" />
                        <span>{isMobile ? "Swipe to explore" : "Scroll to explore the collection"}</span>
                    </div>
                </motion.div>

                <VirtualizedHorizontal items={items} isMobile={isMobile} stage={stage} onAction={handleAction} />

                <motion.div
                    className={`text-center ${isMobile ? "mt-10" : "mt-16"}`}
                    initial={{ opacity: 0, y: 16 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={reducedMotion ? { duration: 0 } : { ...TRANSITION, delay: 0.48 }}
                >
                    <button
                        onClick={() => console.log("view all")}
                        className={`group liquid-glass border border-accent/30 hover:border-accent/60 rounded-2xl transition-all duration-[320ms] px-6 py-3 ${isMobile ? "w-full max-w-sm" : "inline-flex"}`}
                    >
                        <div className="flex items-center gap-3 justify-center w-full">
                            <span className="font-medium text-accent">View Full Collection</span>
                            <ArrowRight className="w-5 h-5 text-accent transition-transform duration-[320ms] group-hover:translate-x-1" />
                        </div>
                    </button>
                </motion.div>
            </div>
        </section>
    )
}

LookbookSection.displayName = "LookbookSection"
LookbookSection.propTypes = {
    collections: PropTypes.array,
}

export default LookbookSection
