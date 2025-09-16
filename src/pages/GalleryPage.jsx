// GalleryPage.jsx
import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Share2 } from "lucide-react";
import { cn } from "@/lib/utils";

// --- sanitizer ---
const sanitizeInput = (input) => {
    if (!input) return "";
    const dangerous = /<script|javascript:|on\w+=/gi;
    const urls = /^(https?:\/\/)?([\da-z\.-]+)\.([a-z\.]{2,6})/i;
    if (dangerous.test(input)) return "";
    if (urls.test(input) && !input.startsWith("https://images.unsplash.com"))
        return "";
    return String(input).replace(/[<>]/g, "");
};

// --- sample items ---
const mediaItems = [
    {
        id: 1,
        type: "image",
        src: "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=1400&auto=format&fit=crop",
        alt: "Haute Couture - Behind the scenes",
        collection: "FW24",
        caption: "Shot on location — muted palette, studio lights.",
    },
    {
        id: 2,
        type: "image",
        src: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=1400&auto=format&fit=crop",
        alt: "Avant-Garde silhouette",
        collection: "SS24",
        caption: "Experiment with proportion and texture.",
    },
    {
        id: 3,
        type: "image",
        src: "https://images.unsplash.com/photo-1581044777550-4cfa60707c03?q=80&w=1400&auto=format&fit=crop",
        alt: "Minimalist luxe frame",
        collection: "FW24",
        caption: "Close-up on tailoring.",
    },
    {
        id: 4,
        type: "image",
        src: "https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1400&auto=format&fit=crop",
        alt: "Gold edition texture",
        collection: "Limited",
        caption: "Detail study: metallic weave.",
    },
];

const GalleryPage = () => {
    const [selectedIndex, setSelectedIndex] = useState(null);
    const [viewMode, setViewMode] = useState("grid");
    const [favorites, setFavorites] = useState(new Set());
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const check = () => setIsMobile(window.innerWidth < 768);
        check();
        window.addEventListener("resize", check);
        return () => window.removeEventListener("resize", check);
    }, []);

    useEffect(() => {
        const onKey = (e) => {
            if (e.key === "Escape") closeDetail();
            if (e.key === "ArrowRight") goNext();
            if (e.key === "ArrowLeft") goPrev();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    });

    const toggleFav = useCallback((id, e) => {
        e?.stopPropagation();
        setFavorites((prev) => {
            const n = new Set(prev);
            if (n.has(id)) n.delete(id);
            else n.add(id);
            return n;
        });
    }, []);

    const handleShare = useCallback((item, e) => {
        e?.stopPropagation();
        if (navigator.share) {
            navigator.share({ title: item.alt, text: item.caption });
        } else {
            navigator.clipboard?.writeText(item.src).catch(() => { });
        }
    }, []);

    const openDetail = (item) => {
        setSelectedIndex(mediaItems.findIndex((m) => m.id === item.id));
        setViewMode("detail");
    };

    const closeDetail = () => {
        setSelectedIndex(null);
        setViewMode("grid");
    };

    const goNext = () => {
        setSelectedIndex((i) =>
            i === null ? 0 : (i + 1) % mediaItems.length
        );
    };

    const goPrev = () => {
        setSelectedIndex((i) =>
            i === null ? 0 : (i - 1 + mediaItems.length) % mediaItems.length
        );
    };

    const selected = selectedIndex !== null ? mediaItems[selectedIndex] : null;

    return (
        <motion.div className="relative bg-warning-foreground/15 min-h-screen w-full text-foreground overflow-hidden">
            {/* Header */}
            <motion.header className="sticky top-0 z-10 backdrop-blur-xl bg-background/30 border-b border-border/10">
                <div className="container mx-auto px-4 py-3 flex items-center justify-between">
                    <button
                        onClick={() => (window.location.href = "/")}
                        className="px-3 py-2 rounded-lg bg-card/50 border border-border/10"
                    >
                        Back
                    </button>
                    <span className="text-xs text-muted-foreground md:text-sm">
                        Gallery • Documentation
                    </span>
                </div>
            </motion.header>

            <main className="container mx-auto px-4 py-8 md:py-12">
                {/* Grid */}
                {viewMode === "grid" && (
                    <div
                        className={cn(
                            "grid gap-3 md:gap-6",
                            isMobile ? "grid-cols-2" : "grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                        )}
                    >
                        {mediaItems.map((item) => (
                            <button
                                key={item.id}
                                onClick={() => openDetail(item)}
                                className="group relative aspect-[3/4] overflow-hidden rounded-2xl border border-border/10 bg-card/30 backdrop-blur-md hover:scale-[1.02] transition"
                            >
                                <img
                                    src={item.src}
                                    alt={sanitizeInput(item.alt)}
                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                                />
                                <div className="absolute bottom-0 left-0 right-0 p-3 bg-gradient-to-t from-black/60 to-transparent text-white text-sm">
                                    {sanitizeInput(item.alt)}
                                </div>
                            </button>
                        ))}
                    </div>
                )}

                {/* Detail View */}
                <AnimatePresence>
                    {viewMode === "detail" && selected && (
                        <motion.div
                            className="fixed inset-0 z-50 flex items-center justify-center px-4 py-6 bg-background/80"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                        >
                            {/* background blur */}
                            <div
                                className="absolute inset-0 blur-3xl scale-110 opacity-40"
                                style={{
                                    backgroundImage: `url(${selected.src})`,
                                    backgroundSize: "cover",
                                    backgroundPosition: "center",
                                }}
                            />

                            {/* Desktop */}
                            {!isMobile && (
                                <div className="relative w-full max-w-[1200px] flex items-center justify-center gap-10">
                                    <motion.div
                                        className="relative bg-card/40 backdrop-blur-xl rounded-3xl overflow-hidden border border-border/10 shadow-2xl flex-shrink-0"
                                        style={{ aspectRatio: "9/16", width: "min(35vw,420px)" }}
                                    >
                                        <motion.img
                                            src={selected.src}
                                            alt={sanitizeInput(selected.alt)}
                                            className="w-full h-full object-cover"
                                            drag
                                            dragConstraints={{ left: 0, right: 0, top: 0, bottom: 0 }}
                                            dragElastic={0.3}
                                            onDragEnd={(e, info) => {
                                                if (info.offset.x > 100) goPrev();
                                                else if (info.offset.x < -100) goNext();
                                                else if (info.offset.y > 120) closeDetail();
                                            }}
                                        />
                                    </motion.div>

                                    {/* sidebar */}
                                    <aside className="w-80 shrink-0 flex flex-col justify-between p-4 rounded-xl bg-background/60 backdrop-blur-lg border border-border/10">
                                        <div>
                                            <p className="text-xs text-secondary font-medium">
                                                {selected.collection}
                                            </p>
                                            <h2 className="text-2xl font-heading">
                                                {sanitizeInput(selected.alt)}
                                            </h2>
                                            <p className="text-sm text-muted-foreground mt-2">
                                                {sanitizeInput(selected.caption)}
                                            </p>
                                        </div>
                                        <div className="flex gap-3 mt-6">
                                            <button
                                                onClick={(e) => handleShare(selected, e)}
                                                className="p-2 rounded-lg bg-card/60 border border-border/10"
                                            >
                                                <Share2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={(e) => toggleFav(selected.id, e)}
                                                className="p-2 rounded-lg bg-card/60 border border-border/10"
                                            >
                                                <Heart
                                                    className={cn(
                                                        "w-4 h-4",
                                                        favorites.has(selected.id)
                                                            ? "fill-accent text-accent"
                                                            : "text-muted-foreground"
                                                    )}
                                                />
                                            </button>
                                        </div>
                                    </aside>
                                </div>
                            )}

                            {/* Mobile */}
                            {isMobile && (
                                <motion.div className="relative w-full max-w-[min(90vw,600px)] flex flex-col items-center">
                                    <motion.div
                                        className="relative aspect-[9/16] w-full rounded-2xl overflow-hidden border border-border/10 bg-card/40 backdrop-blur-xl shadow-2xl"
                                        drag="y"
                                        dragConstraints={{ top: 0, bottom: 0 }}
                                        dragElastic={0.6}
                                        onDragEnd={(e, info) => {
                                            if (info.offset.y > 120) closeDetail();
                                        }}
                                    >
                                        <motion.img
                                            src={selected.src}
                                            alt={sanitizeInput(selected.alt)}
                                            className="w-full h-full object-cover"
                                            drag="x"
                                            dragConstraints={{ left: 0, right: 0 }}
                                            dragElastic={0.4}
                                            onDragEnd={(e, info) => {
                                                if (info.offset.x > 100) goPrev();
                                                else if (info.offset.x < -100) goNext();
                                            }}
                                        />
                                    </motion.div>
                                    <div className="w-full mt-4 space-y-2 text-center">
                                        <p className="text-xs text-secondary font-medium">
                                            {selected.collection}
                                        </p>
                                        <h2 className="text-lg font-heading">
                                            {sanitizeInput(selected.alt)}
                                        </h2>
                                        <p className="text-sm text-muted-foreground">
                                            {sanitizeInput(selected.caption)}
                                        </p>
                                        <div className="flex justify-center gap-4 mt-3">
                                            <button
                                                onClick={(e) => handleShare(selected, e)}
                                                className="p-2 rounded-lg bg-card/60 border border-border/10"
                                            >
                                                <Share2 className="w-4 h-4" />
                                            </button>
                                            <button
                                                onClick={(e) => toggleFav(selected.id, e)}
                                                className="p-2 rounded-lg bg-card/60 border border-border/10"
                                            >
                                                <Heart
                                                    className={cn(
                                                        "w-4 h-4",
                                                        favorites.has(selected.id)
                                                            ? "fill-accent text-accent"
                                                            : "text-muted-foreground"
                                                    )}
                                                />
                                            </button>
                                        </div>
                                    </div>
                                </motion.div>
                            )}
                        </motion.div>
                    )}
                </AnimatePresence>
            </main>
        </motion.div>
    );
};

export default GalleryPage;
