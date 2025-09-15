import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ArrowRight, Eye } from "lucide-react";

// ✅ Fake shimmer loader
const useFakeLoad = (delay = 1500) => {
    const [loaded, setLoaded] = useState(false);
    useEffect(() => {
        const timer = setTimeout(() => setLoaded(true), delay);
        return () => clearTimeout(timer);
    }, [delay]);
    return loaded;
};

// ✅ Basic sanitizer untuk cegah input script/link aneh
const sanitizeInput = (value) => {
    return value.replace(/<[^>]*>?/gm, "").replace(/(https?:\/\/[^\s]+)/g, "");
};

// ✅ Gallery Data
const galleryItems = [
    {
        id: 1,
        src: "https://images.unsplash.com/photo-1551232864-3f0890e58e48?q=80&w=800&auto=format&fit=crop",
        category: "Urban Essentials",
    },
    {
        id: 2,
        src: "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=800&auto=format&fit=crop",
        category: "Signature Tees",
    },
    {
        id: 3,
        src: "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop",
        category: "Outerwear",
    },
    {
        id: 4,
        src: "https://images.unsplash.com/photo-1509909241434-e3436def94f2?q=80&w=800&auto=format&fit=crop",
        category: "Headwear",
    },
    {
        id: 5,
        src: "https://images.unsplash.com/photo-1545231027-637d2f6210f8?q=80&w=800&auto=format&fit=crop",
        category: "Core Collection",
    },
];

// ✅ Gallery Card
const GalleryCard = ({ item, index, loaded }) => (
    <motion.div
        className="relative rounded-3xl overflow-hidden glass-card shadow-lg group snap-center w-[85vw] sm:w-[55vw] lg:w-[30vw] h-[55vh] md:h-[75vh] flex-shrink-0 transition-transform duration-300 ease-out hover:scale-[1.02]"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.15, duration: 0.8, ease: "easeOut" }}
        viewport={{ once: true }}
    >
        {!loaded ? (
            <div className="absolute inset-0 bg-card/70 animate-pulse" />
        ) : (
            <>
                <motion.img
                    src={item.src}
                    alt={item.category}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-background/95 via-background/40 to-transparent z-10" />
                <div className="relative z-20 p-6 h-full flex flex-col justify-end">
                    <h3 className="text-2xl md:text-3xl font-heading text-foreground mb-2 tracking-tight">
                        {sanitizeInput(item.category)}
                    </h3>
                    <button className="inline-flex items-center gap-2 text-sm font-semibold tracking-wide text-accent transition-all duration-300 hover:text-accent-foreground">
                        Shop The Look
                        <ArrowRight className="w-4 h-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </button>
                </div>
            </>
        )}
    </motion.div>
);

const LookbookSection = () => {
    const loaded = useFakeLoad();

    return (
        <section className="relative overflow-hidden py-16 md:py-28">
            {/* Blobs */}
            <motion.div

                className="absolute -top-24 -left-20 w-72 h-72 bg-accent/25 rounded-full blur-3xl"
            />
            <motion.div

                className="absolute -bottom-28 -right-20 w-96 h-96 bg-secondary/30 rounded-full blur-3xl"
            />

            <div className="relative z-10 max-w-7xl mx-auto px-6">
                {/* Section Heading */}
                <motion.div
                    className="text-center mb-12 md:mb-20"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                >
                    <h2 className="text-4xl md:text-6xl font-heading text-foreground tracking-tight mb-4 drop-shadow">
                        Lookbook 2025
                    </h2>
                    <p className="text-muted-foreground text-base md:text-lg max-w-xl mx-auto leading-relaxed">
                        Movement, shape, and street elegance — a vision of tomorrow.
                    </p>
                </motion.div>

                {/* Scroll Cue */}
                <div className="mb-6 flex justify-center">
                    <motion.div
                        className="text-muted-foreground/70 text-sm tracking-wide flex items-center gap-2"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 1.2, duration: 1 }}
                    >
                        <Eye className="w-4 h-4 animate-pulse" />
                        Swipe to explore
                    </motion.div>
                </div>

                {/* Horizontal Gallery */}
                <motion.div
                    className="flex gap-6 md:gap-8 overflow-x-auto overflow-y-hidden px-4 md:px-0 snap-x snap-mandatory scroll-smooth scrollbar-hide"
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                >
                    {galleryItems.map((item, index) => (
                        <GalleryCard key={item.id} item={item} index={index} loaded={loaded} />
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default LookbookSection;
