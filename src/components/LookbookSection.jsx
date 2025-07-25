import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

// Mock loading state
const useFakeLoad = (delay = 1500) => {
    const [loaded, setLoaded] = useState(false);
    useEffect(() => {
        const timer = setTimeout(() => setLoaded(true), delay);
        return () => clearTimeout(timer);
    }, [delay]);
    return loaded;
};

const galleryItems = [
    {
        id: 1,
        src: 'https://images.unsplash.com/photo-1551232864-3f0890e58e48?q=80&w=800&auto=format&fit=crop',
        category: 'Urban Essentials',
    },
    {
        id: 2,
        src: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=800&auto=format&fit=crop',
        category: 'Signature Tees',
    },
    {
        id: 3,
        src: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop',
        category: 'Outerwear',
    },
    {
        id: 4,
        src: 'https://images.unsplash.com/photo-1509909241434-e3436def94f2?q=80&w=800&auto=format&fit=crop',
        category: 'Headwear',
    },
    {
        id: 5,
        src: 'https://images.unsplash.com/photo-1545231027-637d2f6210f8?q=80&w=800&auto=format&fit=crop',
        category: 'Core Collection',
    },
];

const GalleryCard = ({ item, index, loaded }) => {
    return (
        <motion.div
            className="relative flex-shrink-0 w-[85vw] sm:w-[60vw] md:w-[40vw] h-[80vh] rounded-3xl overflow-hidden backdrop-blur-md bg-white/5 border border-white/10 shadow-2xl group transition-transform hover:scale-[1.02]"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15, duration: 0.8, ease: 'easeOut' }}
            viewport={{ once: true }}
        >
            {!loaded ? (
                <div className="absolute inset-0 animate-pulse bg-gradient-to-r from-neutral-800 via-neutral-900 to-neutral-800" />
            ) : (
                <>
                    <motion.img
                        src={item.src}
                        alt={item.category}
                        loading="lazy"
                        className="absolute inset-0 w-full h-full object-cover scale-100 group-hover:scale-110 transition-transform duration-1000 ease-[cubic-bezier(0.19,1,0.22,1)]"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent z-10" />
                    <div className="relative z-20 flex flex-col justify-end h-full p-6">
                        <h3 className="text-xl font-serif text-white tracking-tight mb-1">{item.category}</h3>
                        <button className="flex items-center gap-2 text-sm font-semibold text-white group-hover:underline">
                            Shop The Look
                            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform duration-300" />
                        </button>
                    </div>
                </>
            )}
        </motion.div>
    );
};

const LookbookSection = () => {
    const loaded = useFakeLoad();

    return (
        <section className="relative overflow-hidden bg-gradient-to-br from-black via-neutral-950 to-black py-28 md:py-40">
            {/* Liquid Glass Effect Overlay */}
            <div className="absolute inset-0 bg-[url('https://ik.imagekit.io/oidnycd6o/neo_products/1753110594579-ChatGPT_Image_Jul_20__2025__05_55_40_PM.webp')] bg-cover bg-center opacity-5 pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-6">
                <motion.div
                    className="text-center mb-20"
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.9 }}
                >
                    <h2 className="text-5xl md:text-6xl font-serif font-bold text-white mb-6 tracking-tight">
                        Lookbook 2025
                    </h2>
                    <p className="text-neutral-400 text-lg max-w-xl mx-auto leading-relaxed">
                        A curated glimpse into our seasonal capsule. Stories of culture, street, and silhouette in motion.
                    </p>
                </motion.div>

                {/* Scrollable Card Gallery */}
                <div className="relative">
                    <motion.div
                        className="flex gap-8 overflow-x-auto snap-x snap-mandatory px-4 md:px-0"
                        initial="hidden"
                        whileInView="visible"
                        viewport={{ once: true }}
                    >
                        {galleryItems.map((item, index) => (
                            <GalleryCard key={item.id} item={item} index={index} loaded={loaded} />
                        ))}
                    </motion.div>
                </div>
            </div>
        </section>
    );
};

export default LookbookSection;
