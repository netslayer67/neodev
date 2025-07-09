import React, { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { ArrowRight } from 'lucide-react';

// --- Data Galeri (Lebih mudah dikelola) ---
// Menggunakan ID spesifik dari Unsplash untuk hasil yang konsisten dan berkualitas tinggi
const galleryItems = [
    {
        id: 1,
        src: 'https://images.unsplash.com/photo-1551232864-3f0890e58e48?q=80&w=800&auto=format&fit=crop',
        className: 'col-span-3 row-span-2 md:col-span-2 md:row-span-2',
        category: 'Urban Essentials',
    },
    {
        id: 2,
        src: 'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?q=80&w=800&auto=format&fit=crop',
        className: 'col-span-3 row-span-1 md:col-span-1 md:row-span-1',
        category: 'Signature Tees',
    },
    {
        id: 3,
        src: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=800&auto=format&fit=crop',
        className: 'col-span-3 row-span-2 md:col-span-1 md:row-span-2',
        category: 'Outerwear',
    },
    {
        id: 4,
        src: 'https://images.unsplash.com/photo-1509909241434-e3436def94f2?q=80&w=800&auto=format&fit=crop',
        className: 'col-span-3 row-span-1 md:col-span-2 md:row-span-1',
        category: 'Headwear',
    },
    {
        id: 5,
        src: 'https://images.unsplash.com/photo-1545231027-637d2f6210f8?q=80&w=800&auto=format&fit=crop',
        className: 'col-span-3 row-span-1 md:col-span-1 md:row-span-1',
        category: 'Core Collection',
    },
];


// --- Sub-Komponen untuk Clean Code: GalleryItem dengan Parallax ---
const GalleryItem = ({ item, index }) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ['start end', 'end start'], // Lacak saat elemen masuk dan keluar viewport
    });

    // Transformasi 'y' untuk efek parallax. Gambar akan bergerak -15% s/d 15%
    const y = useTransform(scrollYProgress, [0, 1], ['-15%', '15%']);

    const itemVariants = {
        hidden: { opacity: 0, scale: 0.9 },
        visible: {
            opacity: 1,
            scale: 1,
            transition: { duration: 0.6, delay: index * 0.1, ease: 'easeOut' }
        }
    };

    return (
        <motion.div
            ref={ref}
            variants={itemVariants}
            className={`group relative overflow-hidden rounded-2xl ${item.className}`}
        >
            <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/70 via-black/30 to-transparent pointer-events-none" />
            <motion.img
                src={item.src}
                alt={`Style ${item.id}`}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-in-out group-hover:scale-110"
                style={{ y }} // Terapkan efek parallax
                loading="lazy"
            />
            <div className="relative z-20 h-full flex flex-col justify-end p-6">
                <motion.div
                    initial={{ y: 20, opacity: 0 }}
                    whileHover={{ y: 0, opacity: 1 }}
                    className="transition-all"
                >
                    <p className="text-sm font-medium text-neutral-300">{item.category}</p>
                    <button className="mt-2 text-lg font-semibold text-white flex items-center gap-2">
                        Shop The Look <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
                    </button>
                </motion.div>
            </div>
        </motion.div>
    );
};


// --- Komponen Utama Seksi Galeri ---
const LookbookSection = () => {
    return (
        <section className="py-28 md:py-40 bg-black relative">
            {/* Latar belakang aurora */}
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-black via-gray-900 to-black" />
            <div className="absolute inset-0 w-full h-full bg-[url('/path-to-subtle-noise.png')] opacity-5" />

            <div className="container mx-auto px-6 relative z-10">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, amount: 0.5 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="text-center mb-16 max-w-2xl mx-auto"
                >
                    <h2 className="text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
                        ICONIC IN MOTION
                    </h2>
                    <p className="text-neutral-400 text-lg">
                        Gaya mentah yang mendefinisikan sebuah era. Dilihat melalui lensa komunitas kami.
                    </p>
                </motion.div>

                <motion.div
                    initial="hidden"
                    whileInView="visible"
                    viewport={{ once: true, amount: 0.1 }}
                    className="grid grid-cols-3 grid-rows-3 gap-4 md:gap-6 h-[120vh]"
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