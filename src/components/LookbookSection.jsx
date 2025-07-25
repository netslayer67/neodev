import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { ArrowRight, Eye } from 'lucide-react';

// Fake loading hook with shimmer
const useFakeLoad = (delay = 1800) => {
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

const GalleryCard = ({ item, index, loaded }) => (
    <motion.div
        className="relative rounded-3xl overflow-hidden backdrop-blur-xl bg-white/5 border border-white/10 shadow-[inset_0_0_0.5px_white/10] group snap-center w-[85vw] sm:w-[55vw] lg:w-[30vw] h-[80vh] flex-shrink-0 transition-transform hover:scale-[1.015]"
        initial={{ opacity: 0, y: 60 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.2, duration: 0.9, ease: 'easeOut' }}
        viewport={{ once: true }}
    >
        {!loaded ? (
            <div className="absolute inset-0 bg-gradient-to-r from-neutral-800 via-neutral-900 to-neutral-800 animate-pulse" />
        ) : (
            <>
                <motion.img
                    src={item.src}
                    alt={item.category}
                    loading="lazy"
                    className="absolute inset-0 w-full h-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.19,1,0.22,1)] group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent z-10" />
                <div className="relative z-20 p-6 h-full flex flex-col justify-end">
                    <h3 className="text-2xl font-serif text-white mb-2 tracking-tight">{item.category}</h3>
                    <button className="inline-flex items-center gap-2 text-sm text-white font-semibold tracking-wide group-hover:underline">
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
        <section className="relative overflow-hidden bg-gradient-to-b from-black via-neutral-950 to-black py-24 md:py-36">
            {/* Decorative Liquid Overlay */}
            <div className="absolute inset-0 z-0 bg-[url('https://ik.imagekit.io/oidnycd6o/neo_products/1753110594579-ChatGPT_Image_Jul_20__2025__05_55_40_PM.webp')] bg-cover bg-center opacity-[0.04] pointer-events-none" />

            <div className="relative z-10 max-w-7xl mx-auto px-6">
                {/* Section Heading */}
                <motion.div
                    className="text-center mb-16"
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                >
                    <h2 className="text-4xl md:text-6xl font-serif font-bold text-white tracking-tight mb-4">
                        Lookbook 2025
                    </h2>
                    <p className="text-neutral-400 text-lg md:text-xl max-w-xl mx-auto leading-relaxed">
                        Explore a curated lens of our seasonal narratives — silhouettes, movement, and street elegance.
                    </p>
                </motion.div>

                {/* Scroll Cue */}
                <div className="mb-4 flex justify-center">
                    <motion.div
                        className="text-white/50 text-sm tracking-wide flex items-center gap-2"
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
                    className="flex gap-8 overflow-x-auto px-4 md:px-0 snap-x snap-mandatory scroll-smooth"
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
