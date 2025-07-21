// LookbookSection.jsx (Luxury Redesign v2)
import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

// Lookbook Gallery Data
const galleryItems = [
    {
        id: 1,
        src: 'https://images.unsplash.com/photo-1551232864-3f0890e58e48?q=80&w=800&auto=format&fit=crop',
        className: 'md:col-span-2 md:row-span-2',
        category: 'Urban Essentials',
    },
    {
        id: 2,
        src: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=800&auto=format&fit=crop',
        className: 'md:col-span-1 md:row-span-1',
        category: 'Signature Tees',
    },
    {
        id: 3,
        src: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop',
        className: 'md:col-span-1 md:row-span-2',
        category: 'Outerwear',
    },
    {
        id: 4,
        src: 'https://images.unsplash.com/photo-1509909241434-e3436def94f2?q=80&w=800&auto=format&fit=crop',
        className: 'md:col-span-2 md:row-span-1',
        category: 'Headwear',
    },
    {
        id: 5,
        src: 'https://images.unsplash.com/photo-1545231027-637d2f6210f8?q=80&w=800&auto=format&fit=crop',
        className: 'md:col-span-1 md:row-span-1',
        category: 'Core Collection',
    },
];

const GalleryItem = ({ item, index }) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start'],
    });

    const y = useTransform(scrollYProgress, [0, 1], ['-10%', '10%']);

    const variants = {
        hidden: { opacity: 0, scale: 0.95 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { delay: index * 0.15, duration: 0.6, ease: 'easeOut' },
        },
    };

    return (
        <motion.div
            ref={ref}
            variants={variants}
            initial="hidden"
            whileInView="visible"
            viewport={{ once: true, amount: 0.3 }}
            className={`relative group overflow-hidden rounded-3xl bg-white/5 backdrop-blur-xl border border-white/10 transition-transform duration-500 ${item.className}`}
        >
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/70 via-black/30 to-transparent pointer-events-none rounded-3xl" />
            <motion.img
                src={item.src}
                alt={item.category}
                style={{ y }}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
            />
            <div className="relative z-20 h-full flex flex-col justify-end p-6">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    whileHover={{ y: 0, opacity: 1 }}
                    className="transition-all"
                >
                    <p className="text-sm font-medium text-neutral-300">{item.category}</p>
                    <button className="mt-1 text-white font-semibold text-lg flex items-center gap-1 group-hover:underline">
                        Shop The Look
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                    </button>
                </motion.div>
            </div>
        </motion.div>
    );
};

const LookbookSection = () => {
    return (
        <section className="relative py-24 md:py-36 bg-gradient-to-br from-black via-gray-900 to-black overflow-hidden">
            {/* Optional background noise texture */}
            <div className="absolute inset-0 bg-[url('https://ik.imagekit.io/oidnycd6o/neo_products/1753110594579-ChatGPT_Image_Jul_20__2025__05_55_40_PM.webp')] opacity-5 pointer-events-none" />

            <div className="relative z-10 container mx-auto px-6">
                {/* Section Heading */}
                <motion.div
                    initial={{ opacity: 0, y: 40 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.4 }}
                    transition={{ duration: 0.8, ease: 'easeOut' }}
                    className="text-center mb-16 max-w-2xl mx-auto"
                >
                    <h2 className="text-4xl md:text-5xl font-heading tracking-tight text-white mb-4">
                        ICONIC IN MOTION
                    </h2>
                    <p className="text-neutral-400 text-lg font-light">
                        Gaya mentah yang mendefinisikan sebuah era. Dilihat melalui lensa komunitas kami.
                    </p>
                </motion.div>

                {/* Gallery Grid */}
                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true }}
                    className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 auto-rows-[200px] md:auto-rows-[300px] gap-4 md:gap-6"
                >
                    {galleryItems.map((item, index) => (
                        <GalleryItem key={item.id} item={item} index={index} />
                    ))}
                </motion.div>
            </div>
        </section>
    );
};

export default LookbookSection;
