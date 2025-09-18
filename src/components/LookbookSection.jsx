"use client"

import React, { useState, useEffect, useMemo, useCallback } from "react"
import { motion } from "framer-motion"
import { ArrowRight, Eye, Sparkles, Camera, Play, Heart, Share2 } from "lucide-react"

const sanitizeInput = (value = "", maxLength = 100) => {
    if (!value) return ""
    let sanitized = String(value).slice(0, maxLength)
    // Single regex pass for better performance
    sanitized = sanitized
        .replace(/<[^>]*>?/gm, "")
        .replace(/(javascript:|data:|vbscript:|mailto:|https?:\/\/[^\s]+)/gi, "")
        .replace(/[<>"'`\\{}()]/g, "")
    return sanitized.trim()
}

const useProgressiveLoad = (delay = 800) => {
    const [loadingStage, setLoadingStage] = useState(0)

    useEffect(() => {
        const timer1 = setTimeout(() => setLoadingStage(1), delay * 0.4)
        const timer2 = setTimeout(() => setLoadingStage(2), delay)

        return () => {
            clearTimeout(timer1)
            clearTimeout(timer2)
        }
    }, [delay])

    return loadingStage
}

const useMobileDetection = () => {
    const [isMobile, setIsMobile] = useState(false)
    const [isTablet, setIsTablet] = useState(false)

    useEffect(() => {
        if (typeof window === "undefined") return

        const checkDevice = () => {
            const width = window.innerWidth
            const isTouchDevice = "ontouchstart" in window

            setIsMobile(width <= 768)
            setIsTablet(width > 768 && width <= 1024 && isTouchDevice)
        }

        checkDevice()
        let timeoutId
        const debouncedResize = () => {
            clearTimeout(timeoutId)
            timeoutId = setTimeout(checkDevice, 150)
        }

        window.addEventListener("resize", debouncedResize, { passive: true })
        return () => {
            window.removeEventListener("resize", debouncedResize)
            clearTimeout(timeoutId)
        }
    }, [])

    return { isMobile, isTablet }
}

const galleryCollections = [
    {
        id: 1,
        src: "https://images.unsplash.com/photo-1551232864-3f0890e58e48?q=80&w=800&auto=format&fit=crop&fm=webp",
        category: "Urban Essentials",
        subtitle: "City Movement",
        description: "Designed for the modern nomad",
        color: "accent",
        featured: true,
        likes: 847,
        views: 12400,
    },
    {
        id: 2,
        src: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=800&auto=format&fit=crop&fm=webp",
        category: "Signature Tees",
        subtitle: "Core Collection",
        description: "Premium comfort meets style",
        color: "secondary",
        featured: false,
        likes: 623,
        views: 9800,
    },
    {
        id: 3,
        src: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop&fm=webp",
        category: "Outerwear",
        subtitle: "Weather Ready",
        description: "Performance meets elegance",
        color: "warning",
        featured: true,
        likes: 1205,
        views: 18600,
    },
    {
        id: 4,
        src: "https://images.unsplash.com/photo-1509909241434-e3436def94f2?q=80&w=800&auto=format&fit=crop&fm=webp",
        category: "Headwear",
        subtitle: "Crown Collection",
        description: "Crowned with intention",
        color: "info",
        featured: false,
        likes: 432,
        views: 7200,
    },
    {
        id: 5,
        src: "https://images.unsplash.com/photo-1545231027-637d2f6210f8?q=80&w=800&auto=format&fit=crop&fm=webp",
        category: "Limited Edition",
        subtitle: "Soul Series",
        description: "Where soul meets fabric",
        color: "success",
        featured: true,
        likes: 1847,
        views: 26800,
    },
    {
        id: 6,
        src: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?q=80&w=800&auto=format&fit=crop&fm=webp",
        category: "Accessories",
        subtitle: "Complete Look",
        description: "Details that define",
        color: "error",
        featured: false,
        likes: 345,
        views: 5900,
    },
]

const PremiumShimmer = React.memo(({ stage, className = "" }) => (
    <div className={`relative overflow-hidden ${className}`}>
        <div className="absolute inset-0 bg-gradient-to-r from-card/40 via-card/60 to-card/40" />
        <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-accent/20 to-transparent"
            animate={{ x: ["-100%", "100%"] }}
            transition={{
                duration: 1.5,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
                delay: stage * 0.1,
            }}
        />
    </div>
))

const PremiumGalleryCard = React.memo(({ item, index, loadingStage, isMobile, onInteract }) => {
    const [isHovered, setIsHovered] = useState(false)
    const [isLiked, setIsLiked] = useState(false)
    const [imageLoaded, setImageLoaded] = useState(false)

    const handleLike = useCallback(
        (e) => {
            e.stopPropagation()
            setIsLiked(!isLiked)
            onInteract?.(item.id, "like")
        },
        [isLiked, item.id, onInteract],
    )

    const handleShare = useCallback(
        (e) => {
            e.stopPropagation()
            onInteract?.(item.id, "share")
        },
        [item.id, onInteract],
    )

    const cardDimensions = isMobile
        ? "w-[280px] h-[420px]" // Optimized for 360px width with padding
        : "w-[420px] h-[580px]"

    return (
        <motion.div
            className={`relative group cursor-pointer ${cardDimensions} flex-shrink-0 snap-center`}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{
                opacity: 1,
                y: 0,
                transition: {
                    delay: index * 0.08, // Reduced delay for faster loading
                    duration: 0.6,
                    ease: "easeOut",
                },
            }}
            whileHover={
                !isMobile
                    ? {
                        y: -8, // Reduced movement for better performance
                        transition: { duration: 0.25, ease: "easeOut" },
                    }
                    : {}
            }
            viewport={{ once: true, margin: "-50px" }}
            onHoverStart={() => !isMobile && setIsHovered(true)}
            onHoverEnd={() => setIsHovered(false)}
        >
            {/* Main card with optimized glass morphism */}
            <div className="relative h-full rounded-2xl overflow-hidden glass-card border border-border/20 shadow-xl">
                {/* Loading states */}
                {loadingStage < 2 ? (
                    <PremiumShimmer stage={index} className="absolute inset-0 rounded-2xl" />
                ) : (
                    <>
                        <div className="relative h-full overflow-hidden">
                            <img
                                src={item.src || "/placeholder.svg"}
                                alt={sanitizeInput(item.category)}
                                loading="lazy"
                                decoding="async"
                                className={`w-full h-full object-cover transition-all duration-500 ${imageLoaded ? "opacity-100" : "opacity-0"
                                    } ${isHovered && !isMobile ? "scale-105" : "scale-100"}`}
                                onLoad={() => setImageLoaded(true)}
                            />

                            {/* Simplified overlay gradients */}
                            <div className="absolute inset-0 bg-gradient-to-t from-background/90 via-background/20 to-transparent" />
                            <div
                                className={`absolute inset-0 bg-gradient-to-tr from-${item.color}/10 via-transparent to-transparent opacity-50`}
                            />

                            {isHovered && !isMobile && (
                                <div className="absolute inset-0 backdrop-blur-sm bg-background/20 transition-opacity duration-300" />
                            )}
                        </div>

                        {/* Premium content overlay */}
                        <div className={`absolute inset-0 flex flex-col justify-between z-10 ${isMobile ? "p-4" : "p-6"}`}>
                            {/* Top section - Stats & Actions */}
                            <div className="flex justify-between items-start">
                                {/* Featured badge */}
                                {item.featured && (
                                    <div
                                        className={`px-2.5 py-1 rounded-full glass-card border border-${item.color}/30 backdrop-blur-md`}
                                    >
                                        <div className="flex items-center gap-1">
                                            <Sparkles className={`w-3 h-3 text-${item.color}`} />
                                            <span className={`text-xs font-medium text-${item.color}`}>Featured</span>
                                        </div>
                                    </div>
                                )}

                                <div className="flex gap-2">
                                    <button
                                        onClick={handleLike}
                                        className={`p-2 rounded-full glass-card border transition-all duration-200 ${isMobile ? "min-w-[44px] min-h-[44px]" : "p-2.5"
                                            } ${isLiked ? `border-error/50 bg-error/10` : `border-border/30 hover:border-accent/50`}`}
                                    >
                                        <Heart
                                            className={`w-4 h-4 transition-colors duration-200 ${isLiked ? "text-error fill-current" : "text-foreground/70"
                                                }`}
                                        />
                                    </button>

                                    <button
                                        onClick={handleShare}
                                        className={`p-2 rounded-full glass-card border border-border/30 hover:border-info/50 transition-all duration-200 ${isMobile ? "min-w-[44px] min-h-[44px]" : "p-2.5"
                                            }`}
                                    >
                                        <Share2 className="w-4 h-4 text-foreground/70" />
                                    </button>
                                </div>
                            </div>

                            {/* Bottom section - Content */}
                            <div className={`space-y-3 ${isMobile ? "space-y-2" : "space-y-4"}`}>
                                {/* Stats bar */}
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

                                {/* Main content */}
                                <div className={`space-y-1 ${isMobile ? "space-y-1" : "space-y-2"}`}>
                                    <div>
                                        <h3
                                            className={`font-heading font-bold text-foreground tracking-tight ${isMobile ? "text-xl" : "text-3xl"
                                                }`}
                                        >
                                            {sanitizeInput(item.category)}
                                        </h3>
                                        <p className={`text-${item.color} font-medium ${isMobile ? "text-sm" : "text-base"}`}>
                                            {sanitizeInput(item.subtitle)}
                                        </p>
                                    </div>

                                    <p className={`text-muted-foreground leading-relaxed ${isMobile ? "text-xs" : "text-sm"}`}>
                                        {sanitizeInput(item.description)}
                                    </p>
                                </div>

                                <button
                                    className={`group inline-flex items-center gap-2 rounded-xl glass-card border border-${item.color}/30 hover:border-${item.color}/60 transition-all duration-200 hover:scale-[1.01] ${isMobile ? "px-3 py-2 text-sm" : "px-4 py-3 text-base"
                                        }`}
                                >
                                    <Camera className={`w-4 h-4 text-${item.color}`} />
                                    <span className={`font-medium text-${item.color}`}>Explore Look</span>
                                    <ArrowRight
                                        className={`w-4 h-4 text-${item.color} transition-transform duration-200 group-hover:translate-x-0.5`}
                                    />
                                </button>
                            </div>
                        </div>
                    </>
                )}
            </div>
        </motion.div>
    )
})

const LookbookSection = () => {
    const loadingStage = useProgressiveLoad(1000) // Reduced delay
    const { isMobile, isTablet } = useMobileDetection()
    const [activeFilter, setActiveFilter] = useState("all")

    const handleCardInteraction = useCallback((cardId, action) => {
        // Handle analytics or state updates here
    }, [])

    const filteredItems = useMemo(() => {
        if (activeFilter === "all") return galleryCollections
        if (activeFilter === "featured") return galleryCollections.filter((item) => item.featured)
        return galleryCollections.filter((item) => item.color === activeFilter)
    }, [activeFilter])

    return (
        <section className={`relative overflow-hidden ${isMobile ? "py-12" : "py-16 md:py-24"}`}>
            {!isMobile && (
                <div className="absolute inset-0 pointer-events-none">
                    <motion.div
                        animate={{
                            x: [-100, 100, -100],
                            y: [-50, 50, -50],
                        }}
                        transition={{
                            duration: 20,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                        }}
                        className="absolute -top-40 -left-40 w-96 h-96 bg-gradient-to-br from-accent/10 via-info/5 to-transparent rounded-full blur-3xl"
                    />

                    <motion.div
                        animate={{
                            x: [100, -100, 100],
                            y: [50, -50, 50],
                        }}
                        transition={{
                            duration: 25,
                            repeat: Number.POSITIVE_INFINITY,
                            ease: "easeInOut",
                        }}
                        className="absolute top-1/3 -right-40 w-80 h-80 bg-gradient-to-bl from-secondary/15 via-warning/10 to-transparent rounded-full blur-3xl"
                    />
                </div>
            )}

            <div className={`relative z-10 max-w-7xl mx-auto ${isMobile ? "px-4" : "px-4 sm:px-6 lg:px-8"}`}>
                <motion.div
                    className={`text-center ${isMobile ? "mb-8" : "mb-12 md:mb-16"}`}
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6, ease: "easeOut" }}
                >
                    {/* Premium badge */}
                    <div
                        className={`inline-flex items-center gap-2 rounded-full glass-card border border-accent/30 ${isMobile ? "px-4 py-2 mb-4" : "px-6 py-3 mb-6"
                            }`}
                    >
                        <Camera className="w-4 h-4 text-accent" />
                        <span className="text-sm font-medium text-accent">Lookbook 2025</span>
                    </div>

                    {/* Main headline */}
                    <h2 className={`font-heading font-bold tracking-tight mb-4 ${isMobile ? "text-3xl" : "text-6xl"}`}>
                        <span className="bg-gradient-to-r from-secondary via-accent to-info bg-clip-text text-transparent">
                            Visual
                        </span>{" "}
                        <span className="text-foreground">Stories</span>
                    </h2>

                    <p
                        className={`text-muted-foreground max-w-2xl mx-auto leading-relaxed ${isMobile ? "text-sm px-4" : "text-xl"
                            }`}
                    >
                        Every piece tells a story of <span className="text-accent font-medium">movement</span>,
                        <span className="text-secondary font-medium"> intention</span>, and
                        <span className="text-info font-medium"> soul</span>.
                    </p>
                </motion.div>

                <motion.div
                    className={`flex justify-center ${isMobile ? "mb-6" : "mb-8"}`}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.8, duration: 0.8 }}
                >
                    <div className="flex items-center gap-2 text-muted-foreground/70 text-sm">
                        <Play className="w-4 h-4 animate-pulse" />
                        <span>{isMobile ? "Swipe to explore" : "Scroll to explore the collection"}</span>
                    </div>
                </motion.div>

                <motion.div
                    className={`flex gap-6 overflow-x-auto overflow-y-hidden snap-x snap-mandatory scroll-smooth scrollbar-hide ${isMobile ? "px-4 -mx-4 pb-4" : "px-8 -mx-8"
                        }`}
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    style={{
                        scrollbarWidth: "none",
                        msOverflowStyle: "none",
                        WebkitOverflowScrolling: "touch",
                    }}
                >
                    {filteredItems.map((item, index) => (
                        <PremiumGalleryCard
                            key={item.id}
                            item={item}
                            index={index}
                            loadingStage={loadingStage}
                            isMobile={isMobile}
                            onInteract={handleCardInteraction}
                        />
                    ))}
                </motion.div>

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
                    >
                        <div className="flex items-center gap-3">
                            <span className={`font-medium text-accent ${isMobile ? "text-base" : "text-lg"}`}>
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
